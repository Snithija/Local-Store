// src/context/ProductContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/products');
      if (response.data.success) {
        setProducts(response.data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Reduce stock when item is added to cart (optimistic update)
  const reduceStock = (productId, quantity = 1) => {
    setProducts(prev => {
      return prev.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            stock: Math.max(0, product.stock - quantity)
          };
        }
        return product;
      });
    });
  };

  // Increase stock when item is removed from cart (optimistic update)
  const increaseStock = (productId, quantity = 1) => {
    setProducts(prev => {
      return prev.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            stock: product.stock + quantity
          };
        }
        return product;
      });
    });
  };

  // Update stock (for manager dashboard) - API call
  const updateStock = async (productId, newStock) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await axiosInstance.patch(`/api/products/${productId}/stock`, {
        stock: parseInt(newStock)
      });

      if (response.data.success) {
        setProducts(prev => {
          return prev.map(product => {
            if (product.id === productId) {
              return response.data.data;
            }
            return product;
          });
        });
      }
    } catch (err) {
      console.error('Error updating stock:', err);
      alert('Failed to update stock. Please try again.');
      // Refresh products to get correct state
      fetchProducts();
    }
  };

  // Check if product is in stock
  const isInStock = (productId) => {
    const product = products.find(p => p.id === productId);
    return product && product.stock > 0;
  };

  // Get product by ID
  const getProduct = (productId) => {
    return products.find(p => p.id === productId);
  };

  // Get all products
  const getAllProducts = () => {
    return products;
  };

  // Get products by category
  const getProductsByCategory = (category) => {
    return products.filter(p => p.category === category);
  };

  // Add new product (for manager) - API call
  const addProduct = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await axiosInstance.post('/api/products', {
        name: product.name,
        description: product.description || '',
        image: product.image || '📦',
        category: product.category,
        price: parseFloat(product.price),
        stock: parseInt(product.stock) || 0,
        lowStockThreshold: parseInt(product.lowStockThreshold) || 10,
      });

      if (response.data.success) {
        setProducts(prev => [response.data.data, ...prev]);
        return response.data.data.id;
      }
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Failed to add product. Please try again.');
      throw err;
    }
  };

  // Update product details (for manager) - API call
  const updateProduct = async (productId, updates) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await axiosInstance.put(`/api/products/${productId}`, updates);

      if (response.data.success) {
        setProducts(prev => {
          return prev.map(product => {
            if (product.id === productId) {
              return response.data.data;
            }
            return product;
          });
        });
      }
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Failed to update product. Please try again.');
      fetchProducts(); // Refresh to get correct state
    }
  };

  // Delete product (for manager) - API call
  const deleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await axiosInstance.delete(`/api/products/${productId}`);

      if (response.data.success) {
        setProducts(prev => prev.filter(product => product.id !== productId));
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
      fetchProducts(); // Refresh to get correct state
    }
  };

  const value = {
    products,
    loading,
    error,
    reduceStock,
    increaseStock,
    updateStock,
    isInStock,
    getProduct,
    getAllProducts,
    getProductsByCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: fetchProducts,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
