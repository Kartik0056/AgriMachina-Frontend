import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('agri_cart');
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

  useEffect(() => {
    localStorage.setItem('agri_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('agri_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product._id === product._id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
  };

  const addMultipleToCart = (products) => {
    setCartItems((prev) => {
      const updated = [...prev];
      for (const prod of products) {
        const idx = updated.findIndex((item) => item.product._id === prod._id);
        if (idx > -1) {
          updated[idx].quantity += 1;
        } else {
          updated.push({ product: prod, quantity: 1 });
        }
      }
      return updated;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const trackRecentlyViewed = (product) => {
    if (!product || !product._id) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p._id !== product._id);
      return [product, ...filtered].slice(0, 10);
    });
  };

  // Calculations
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + (item.product.sellingPrice || 0) * item.quantity,
    0
  );

  const gstTotal = cartItems.reduce((sum, item) => {
    const rate = item.product.gstPercent || 12;
    const itemSub = (item.product.sellingPrice || 0) * item.quantity;
    return sum + Math.round((itemSub * rate) / 100);
  }, 0);

  const shippingFee = cartSubtotal >= 4999 || cartSubtotal === 0 ? 0 : 499;
  const grandTotal = cartSubtotal + shippingFee;
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
        trackRecentlyViewed
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
