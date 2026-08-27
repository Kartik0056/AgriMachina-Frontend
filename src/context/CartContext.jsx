import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const prevUserRef = useRef(user?._id || null);

  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user_data');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const key = parsedUser?._id ? `agri_cart_user_${parsedUser._id}` : 'agri_cart_guest';
      const saved = localStorage.getItem(key) || localStorage.getItem('agri_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem('agri_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Handle Login / Logout State Transitions
  useEffect(() => {
    if (authLoading) return;

    const prevUserId = prevUserRef.current;
    const currentUserId = user?._id || null;

    if (prevUserId !== currentUserId) {
      if (currentUserId) {
        // User logged in!
        // 1. Read existing saved cart for this specific user
        let userSavedCart = [];
        try {
          const rawUserCart = localStorage.getItem(`agri_cart_user_${currentUserId}`);
          userSavedCart = rawUserCart ? JSON.parse(rawUserCart) : [];
        } catch (e) {
          userSavedCart = [];
        }

        // 2. Read any guest items added while not logged in
        let guestCart = [];
        try {
          const rawGuestCart = localStorage.getItem('agri_cart_guest') || localStorage.getItem('agri_cart');
          guestCart = rawGuestCart ? JSON.parse(rawGuestCart) : [];
        } catch (e) {
          guestCart = [];
        }

        // 3. Merge guest items into user's saved cart
        const mergedCart = [...userSavedCart];
        for (const guestItem of guestCart) {
          if (!guestItem?.product?._id) continue;
          const existingIdx = mergedCart.findIndex(
            (item) => item.product?._id === guestItem.product._id
          );
          if (existingIdx > -1) {
            mergedCart[existingIdx].quantity += guestItem.quantity || 1;
          } else {
            mergedCart.push(guestItem);
          }
        }

        // 4. Save merged cart for user and clear temporary guest cart
        localStorage.setItem(`agri_cart_user_${currentUserId}`, JSON.stringify(mergedCart));
        localStorage.removeItem('agri_cart_guest');
        localStorage.removeItem('agri_cart');
        setCartItems(mergedCart);
      } else {
        // User logged out!
        // Clear active cart from current device
        setCartItems([]);
        localStorage.removeItem('agri_cart_guest');
        localStorage.removeItem('agri_cart');
      }
      prevUserRef.current = currentUserId;
    }
  }, [user, authLoading]);

  // Persist active cart items to user-specific or guest storage
  useEffect(() => {
    if (authLoading) return;
    const key = user?._id ? `agri_cart_user_${user._id}` : 'agri_cart_guest';
    localStorage.setItem(key, JSON.stringify(cartItems));
  }, [cartItems, user, authLoading]);

  useEffect(() => {
    localStorage.setItem('agri_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const getItemKey = (product, selectedVariant) => {
    const prodId = product?._id || product?.id || 'unknown';
    if (selectedVariant && selectedVariant.name) {
      return `${prodId}_var_${selectedVariant.name.replace(/\s+/g, '_')}`;
    }
    return String(prodId);
  };

  const addToCart = (product, quantity = 1, selectedVariant = null) => {
    if (!product) return;
    const key = getItemKey(product, selectedVariant);
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => (item.cartKey || item.product?._id || item.product?.id) === key);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (selectedVariant) updated[existingIndex].selectedVariant = selectedVariant;
        return updated;
      }
      return [...prev, { cartKey: key, product, quantity, selectedVariant }];
    });
  };

  const addMultipleToCart = (products) => {
    if (!Array.isArray(products)) return;
    setCartItems((prev) => {
      const updated = [...prev];
      for (const prod of products) {
        if (!prod) continue;
        const key = getItemKey(prod, null);
        const idx = updated.findIndex((item) => (item.cartKey || item.product?._id || item.product?.id) === key);
        if (idx > -1) {
          updated[idx].quantity += 1;
        } else {
          updated.push({ cartKey: key, product: prod, quantity: 1, selectedVariant: null });
        }
      }
      return updated;
    });
  };

  const removeFromCart = (cartKeyOrId) => {
    setCartItems((prev) => prev.filter((item) => item.cartKey !== cartKeyOrId && (item.product?._id || item.product?.id) !== cartKeyOrId));
  };

  const updateQuantity = (cartKeyOrId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartKeyOrId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        (item.cartKey === cartKeyOrId || (item.product?._id || item.product?.id) === cartKeyOrId)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    if (user?._id) {
      localStorage.removeItem(`agri_cart_user_${user._id}`);
    } else {
      localStorage.removeItem('agri_cart_guest');
    }
  };

  const trackRecentlyViewed = (product) => {
    if (!product || (!product._id && !product.id)) return;
    const prodId = product._id || product.id;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => (p._id || p.id) !== prodId);
      return [product, ...filtered].slice(0, 10);
    });
  };

  // Authoritative Pricing Calculations with Variant Support
  const getItemPrice = (item) => {
    if (item.selectedVariant && item.selectedVariant.sellingPrice !== undefined) {
      return Number(item.selectedVariant.sellingPrice) || 0;
    }
    return Number(item.product?.sellingPrice) || Number(item.product?.price) || 0;
  };

  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + (getItemPrice(item) * (item.quantity || 1)),
    0
  );

  const gstTotal = cartItems.reduce((sum, item) => {
    const rate = item.product?.gstPercent || 12;
    const itemSub = getItemPrice(item) * (item.quantity || 1);
    return sum + Math.round((itemSub * rate) / 100);
  }, 0);

  const shippingFee = cartSubtotal >= 4999 || cartSubtotal === 0 ? 0 : 499;
  const grandTotal = cartSubtotal + shippingFee;
  const totalItemsCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemsCount,
        addToCart,
        addMultipleToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        gstTotal,
        shippingFee,
        grandTotal,
        recentlyViewed,
        trackRecentlyViewed,
        getItemPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

