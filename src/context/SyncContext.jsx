import React, { createContext, useContext, useEffect, useCallback, useRef, useMemo } from 'react';

const SyncContext = createContext(null);

const BROADCAST_CHANNEL_NAME = 'agrimachina_live_sync';

export const SyncProvider = ({ children }) => {
  const listenersRef = useRef(new Set());
  const broadcastChannelRef = useRef(null);
  const eventSourceRef = useRef(null);

  // Helper to notify all registered component listeners without triggering full context tree re-renders
  const notifyListeners = useCallback((eventData) => {
    for (const listener of listenersRef.current) {
      try {
        listener(eventData);
      } catch (err) {
        console.error('[LiveSync] Listener error:', err);
      }
    }
  }, []);

  // Broadcast to other tabs locally
  const broadcastLocal = useCallback((eventType, payload = {}) => {
    const eventData = {
      type: eventType,
      payload,
      timestamp: Date.now()
    };

    // 1. Broadcast via BroadcastChannel
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage(eventData);
      } catch (e) {}
    }

    // 2. Storage event fallback
    try {
      localStorage.setItem('agri_sync_tick', JSON.stringify(eventData));
    } catch (e) {}

    // 3. Notify current tab listeners directly
    notifyListeners(eventData);
  }, [notifyListeners]);

  useEffect(() => {
    // 1. Setup BroadcastChannel for cross-tab local sync
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        broadcastChannelRef.current = bc;

        bc.onmessage = (e) => {
          if (e.data) {
            notifyListeners(e.data);
          }
        };
      } catch (e) {
        console.warn('[LiveSync] BroadcastChannel init error:', e);
      }
    }

    // 2. Setup LocalStorage storage event fallback for cross-tab sync
    const handleStorage = (e) => {
      if (e.key === 'agri_sync_tick' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          notifyListeners(parsed);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // 3. Setup Server-Sent Events (SSE) for server-initiated updates
    const apiBase = import.meta.env.VITE_API_URL || '';
    const sseUrl = `${apiBase}/api/sync/stream`;

    let reconnectTimer = null;

    const connectSSE = () => {
      try {
        const es = new EventSource(sseUrl, { withCredentials: true });
        eventSourceRef.current = es;

        const eventTypes = [
          'CATALOG_CHANGED',
          'INVENTORY_UPDATED',
          'CATEGORY_CHANGED',
          'DEALS_UPDATED',
          'NEW_SUPPORT_QUERY',
          'TICKET_UPDATED',
          'ORDER_CREATED',
          'ORDER_UPDATED',
          'ORDER_STATUS_CHANGED'
        ];

        eventTypes.forEach(evt => {
          es.addEventListener(evt, (e) => {
            try {
              const data = JSON.parse(e.data);
              notifyListeners({ type: evt, payload: data, timestamp: Date.now() });
            } catch (err) {}
          });
        });

        es.onerror = () => {
          es.close();
          if (!reconnectTimer) {
            reconnectTimer = setTimeout(() => {
              reconnectTimer = null;
              connectSSE();
            }, 10000);
          }
        };
      } catch (err) {
        console.warn('[LiveSync] SSE connection error:', err);
      }
    };

    connectSSE();

    return () => {
      window.removeEventListener('storage', handleStorage);
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
    };
  }, [notifyListeners]);

  // Stable subscribe function
  const subscribe = useCallback((callback) => {
    listenersRef.current.add(callback);
    return () => {
      listenersRef.current.delete(callback);
    };
  }, []);

  // Memoize context value so consumers NEVER re-render needlessly
  const contextValue = useMemo(() => ({
    broadcastLocal,
    subscribe
  }), [broadcastLocal, subscribe]);

  return (
    <SyncContext.Provider value={contextValue}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};

/**
 * Custom Hook: useLiveRefresh
 * Automatically re-invokes callback whenever relevant data changes in Admin Panel or Server.
 *
 * @param {Function} refreshFn - Async or sync data-fetching function to execute
 * @param {Array<string>} targetEvents - Optional filter by event types (e.g. ['CATALOG_CHANGED', 'INVENTORY_UPDATED'])
 */
export const useLiveRefresh = (refreshFn, targetEvents = null) => {
  const { subscribe } = useSync();
  const refreshFnRef = useRef(refreshFn);
  refreshFnRef.current = refreshFn;

  const targetEventsKey = Array.isArray(targetEvents) ? targetEvents.join(',') : '';

  useEffect(() => {
    const unsubscribe = subscribe((eventData) => {
      if (!targetEvents || targetEvents.includes(eventData.type)) {
        if (typeof refreshFnRef.current === 'function') {
          refreshFnRef.current(eventData);
        }
      }
    });

    return unsubscribe;
  }, [subscribe, targetEventsKey]);
};
