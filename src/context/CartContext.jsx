// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useProducts } from "./ProductContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const productContext = useProducts();
  
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Persist cart to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const addToCart = async (item) => {
    // Check if ProductContext is available
    if (!productContext) {
      // Fallback to old behavior if ProductContext not available
      setCart((prevCart) => {
        const existingItem = prevCart.find((i) => i.id === item.id);
        if (existingItem) {
          return prevCart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prevCart, item];
      });
      return true;
    }

    // Use ProductContext for stock management
    const { getProduct, isInStock, reduceStock } = productContext;
    const product = getProduct(item.id);

    // Check if product exists
    if (!product) {
      console.error('Product not found:', item.id);
      alert('Product not found!');
      return false;
    }

    // Check if product is in stock
    if (!isInStock(item.id)) {
      alert('This item is out of stock!');
      return false;
    }

    // Check if adding one more would exceed available stock
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      if (product.stock < 1) {
        alert(`Only ${product.stock} items available in stock!`);
        return false;
      }
    }

    // Add to cart
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id);
      if (existing) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });

    // Reduce stock
    reduceStock(item.id, 1);
    return true;
  };

  const removeFromCart = (itemId) => {
    const item = cart.find((cartItem) => cartItem.id === itemId);
    
    if (item && productContext) {
      const { increaseStock } = productContext;
      // Return stock
      increaseStock(itemId, item.quantity);
    }
    
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (!productContext) {
      // Fallback without stock management
      setCart((prevCart) =>
        prevCart
          .map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.max(0, quantity) }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
      return;
    }

    const { getProduct, increaseStock, reduceStock } = productContext;
    const item = cart.find((cartItem) => cartItem.id === itemId);
    const product = getProduct(itemId);

    if (!item || !product) return;

    const quantityDiff = quantity - item.quantity;

    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    // Check stock availability for increase
    if (quantityDiff > 0 && product.stock < quantityDiff) {
      alert(`Only ${product.stock} more items available!`);
      return;
    }

    // Update cart
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

    // Update stock
    if (quantityDiff > 0) {
      reduceStock(itemId, quantityDiff);
    } else if (quantityDiff < 0) {
      increaseStock(itemId, Math.abs(quantityDiff));
    }
  };

  const clearCart = () => {
    if (productContext) {
      const { increaseStock } = productContext;
      // Return all stock
      cart.forEach((item) => {
        increaseStock(item.id, item.quantity);
      });
    }
    
    setCart([]);
    try {
      localStorage.removeItem("cart");
    } catch {}
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};