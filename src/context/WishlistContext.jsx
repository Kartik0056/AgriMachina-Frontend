import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('farmer_wishlist');
      if (saved) {
        setWishlistItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse wishlist from storage', e);
    }
  }, []);

  const saveToStorage = (items) => {
    setWishlistItems(items);
    localStorage.setItem('farmer_wishlist', JSON.stringify(items));
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => (item._id || item.id) === (productId._id || productId));
  };

  const toggleWishlist = (product) => {
    const prodId = product._id || product.id;
    if (isInWishlist(prodId)) {
      const filtered = wishlistItems.filter(item => (item._id || item.id) !== prodId);
      saveToStorage(filtered);
      addToast(`Removed ${product.name} from your Wishlist.`, 'info');
    } else {
      const updated = [product, ...wishlistItems];
      saveToStorage(updated);
      addToast(`Added ${product.name} to your Wishlist! 💚`, 'success');
    }
  };

  const removeFromWishlist = (productId) => {
    const filtered = wishlistItems.filter(item => (item._id || item.id) !== productId);
    saveToStorage(filtered);
    addToast('Item removed from wishlist.', 'info');
  };

  const clearWishlist = () => {
    saveToStorage([]);
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
