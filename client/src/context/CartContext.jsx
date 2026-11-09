import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('marutham_local_cart');
    return saved ? JSON.parse(saved) : { items: [] };
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('marutham_local_cart', JSON.stringify(cart));
  }, [cart]);

  // If user is authenticated, sync with backend cart
  useEffect(() => {
    if (isAuthenticated) {
      fetchBackendCart();
    }
  }, [isAuthenticated]);

  const fetchBackendCart = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.data.success && res.data.cart) {
        setCart(res.data.cart);
      }
    } catch (e) {
      console.warn('Could not fetch backend cart, using local cart:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    const qty = Number(quantity);

    if (isAuthenticated) {
      try {
        const res = await api.post('/cart', { productId: product._id, quantity: qty });
        if (res.data.success) {
          setCart(res.data.cart);
          return true;
        }
      } catch (err) {
        console.warn('Backend cart add failed, saving locally:', err.message);
      }
    }

    // Local cart fallback
    setCart(prev => {
      const items = [...(prev.items || [])];
      const index = items.findIndex(i => (i.product?._id || i.product) === product._id);
      if (index > -1) {
        items[index].quantity += qty;
      } else {
        items.push({ product, quantity: qty });
      }
      return { ...prev, items };
    });
    return true;
  };

  const updateQuantity = async (productId, quantity) => {
    const qty = Number(quantity);

    if (isAuthenticated) {
      try {
        const res = await api.put(`/cart/${productId}`, { quantity: qty });
        if (res.data.success) {
          setCart(res.data.cart);
          return;
        }
      } catch (err) {
        console.warn('Backend cart update failed:', err.message);
      }
    }

    setCart(prev => {
      let items = [...(prev.items || [])];
      if (qty <= 0) {
        items = items.filter(i => (i.product?._id || i.product) !== productId);
      } else {
        const item = items.find(i => (i.product?._id || i.product) === productId);
        if (item) item.quantity = qty;
      }
      return { ...prev, items };
    });
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await api.delete(`/cart/${productId}`);
        if (res.data.success) {
          setCart(res.data.cart);
          return;
        }
      } catch (err) {
        console.warn('Backend cart remove failed:', err.message);
      }
    }

    setCart(prev => ({
      ...prev,
      items: (prev.items || []).filter(i => (i.product?._id || i.product) !== productId)
    }));
  };

  const clearCart = () => {
    setCart({ items: [] });
    localStorage.removeItem('marutham_local_cart');
  };

  const items = cart?.items || [];
  const cartCount = items.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const subtotal = items.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * (item.quantity || 0);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        cartCount,
        subtotal,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchBackendCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

