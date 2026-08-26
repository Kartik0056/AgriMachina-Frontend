import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const prevUserRef = useRef(user?._id || null);
  const { addToast } = useToast();

  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user_data');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const key = parsedUser?._id ? `agri_wishlist_user_${parsedUser._id}` : 'agri_wishlist_guest';
      const saved = localStorage.getItem(key) || localStorage.getItem('farmer_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Handle Login / Logout State Transitions for Wishlist
  useEffect(() => {
    if (authLoading) return;

    const prevUserId = prevUserRef.current;
    const currentUserId = user?._id || null;

    if (prevUserId !== currentUserId) {
      if (currentUserId) {
        // User logged in!
        // 1. Read existing saved wishlist for this user
        let userSavedWishlist = [];
        try {
          const rawUserList = localStorage.getItem(`agri_wishlist_user_${currentUserId}`);
          userSavedWishlist = rawUserList ? JSON.parse(rawUserList) : [];
        } catch (e) {
          userSavedWishlist = [];
        }

        // 2. Read any guest items added while not logged in
        let guestList = [];
        try {
          const rawGuestList = localStorage.getItem('agri_wishlist_guest') || localStorage.getItem('farmer_wishlist');
          guestList = rawGuestList ? JSON.parse(rawGuestList) : [];
        } catch (e) {
          guestList = [];
        }

        // 3. Merge guest wishlist into user wishlist
        const mergedList = [...userSavedWishlist];
        for (const guestItem of guestList) {
          const guestId = guestItem?._id || guestItem?.id;
          if (!guestId) continue;
          if (!mergedList.some(item => (item._id || item.id) === guestId)) {
            mergedList.unshift(guestItem);
          }
        }

        // 4. Save merged wishlist for user and clear temporary guest wishlist
        localStorage.setItem(`agri_wishlist_user_${currentUserId}`, JSON.stringify(mergedList));
        localStorage.removeItem('agri_wishlist_guest');
        localStorage.removeItem('farmer_wishlist');
        setWishlistItems(mergedList);
      } else {
        // User logged out!
        // Clear active wishlist from device
        setWishlistItems([]);
        localStorage.removeItem('agri_wishlist_guest');
        localStorage.removeItem('farmer_wishlist');
      }
      prevUserRef.current = currentUserId;
    }
  }, [user, authLoading]);

  // Persist active wishlist items to user-specific or guest storage
  useEffect(() => {
    if (authLoading) return;
    const key = user?._id ? `agri_wishlist_user_${user._id}` : 'agri_wishlist_guest';
    localStorage.setItem(key, JSON.stringify(wishlistItems));
  }, [wishlistItems, user, authLoading]);

  const isInWishlist = (productId) => {
    if (!productId) return false;
    const targetId = productId._id || productId.id || productId;
    return wishlistItems.some(item => (item._id || item.id) === targetId);
  };

  const toggleWishlist = (product) => {
    if (!product) return;
    const prodId = product._id || product.id;
    if (isInWishlist(prodId)) {
      const filtered = wishlistItems.filter(item => (item._id || item.id) !== prodId);
      setWishlistItems(filtered);
      addToast(`Removed ${product.name} from your Wishlist.`, 'info');
    } else {
      const updated = [product, ...wishlistItems];
      setWishlistItems(updated);
      addToast(`Added ${product.name} to your Wishlist! 💚`, 'success');
    }
  };

  const removeFromWishlist = (productId) => {
    const targetId = productId?._id || productId?.id || productId;
    const filtered = wishlistItems.filter(item => (item._id || item.id) !== targetId);
    setWishlistItems(filtered);
    addToast('Item removed from wishlist.', 'info');
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    if (user?._id) {
      localStorage.removeItem(`agri_wishlist_user_${user._id}`);
    } else {
      localStorage.removeItem('agri_wishlist_guest');
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistCount: wishlistItems.length,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

