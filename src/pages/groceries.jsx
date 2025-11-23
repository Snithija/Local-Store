// src/pages/groceries.jsx
import React, { useState, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";

const Groceries = () => {
  const [selectedCategory, setSelectedCategory] = useState("Groceries");
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();
  const { getProductsByCategory, getAllProducts, isInStock, getProduct, loading } = useProducts();

  const groceriesRef = useRef(null);
  const householdRef = useRef(null);
  const snacksRef = useRef(null);
  const beveragesRef = useRef(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    const refs = {
      Groceries: groceriesRef,
      Household: householdRef,
      Snacks: snacksRef,
      Beverages: beveragesRef,
    };

    const targetRef = refs[category];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const categories = ["Groceries", "Household", "Snacks", "Beverages"];

  const getFilteredItems = () => {
    if (!searchQuery) return null;
    
    const allItems = getAllProducts();
    return allItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleAddToCart = (productId) => {
    const product = getProduct(productId);
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stores: "Groceries Store",
      quantity: 1,
    });
  };

  // Product Card Component
  const ProductCard = ({ product }) => {
    const inStock = isInStock(product.id);
    const stockCount = product.stock;
    const isLowStock = stockCount > 0 && stockCount <= (product.lowStockThreshold || 5);

    return (
      <div className="bg-white rounded-lg p-4 flex space-x-4 relative">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">GBP {product.price}</span>
            {!inStock ? (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                Only {stockCount} left
              </span>
            ) : null}
          </div>
        </div>
        <div className="relative w-32 h-32">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover rounded-lg ${!inStock ? 'opacity-50 grayscale' : ''}`}
          />
          <button
            onClick={() => handleAddToCart(product.id)}
            disabled={!inStock}
            className={`absolute -bottom-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-lg transition-colors ${
              inStock
                ? 'bg-black text-white hover:bg-gray-800 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {inStock ? '+' : '✕'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Main Banner Section */}
      <div className="mx-4 mt-4">
        <div className="bg-gray-100 rounded-xl shadow-md relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <img
              src="public/Images/general store.png"
              alt="Background"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="p-6 flex flex-col lg:flex-row items-start gap-6 relative z-10">
            <div className="flex-1">
              <div className="mb-4 mt-20">
                
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Groceries Store
                </h1>
                 <span className="text-xs font-medium text-gray-500 mb-1 block">
                  Fresh and Quality Groceries
                </span>
              </div>

             
            </div>

            <div className="relative shrink-0">
              <div className="w-[380px] h-[250px] rounded-xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3962292/pexels-photo-3962292.jpeg"
                  alt="Store"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Categories Section */}
      <div className="mx-4 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">
            All Products from Groceries Store
          </h2>

          <div className="relative">
            <input
              type="text"
              placeholder="Search from menu..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="w-4 h-4 absolute left-3 top-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-6">
            {getFilteredItems()?.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-black mb-6">Search Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredItems().map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-600 mt-4">
                No items found matching your search.
              </p>
            )}
          </div>
        )}

        {/* Categories */}
        <div className="overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-6 py-3 whitespace-nowrap transition-colors text-sm font-medium ${
                  selectedCategory === category
                    ? "bg-black text-white rounded-lg"
                    : "text-gray-700 hover:bg-gray-100 rounded-lg"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Groceries Section */}
        <div ref={groceriesRef} className="mt-12">
          <h2 className="text-3xl font-bold text-emerald-700 mb-6">Groceries</h2>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : getProductsByCategory('Groceries').length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getProductsByCategory('Groceries').map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Household Section */}
        <div ref={householdRef} className="mt-12">
          <h2 className="text-3xl font-bold text-blue-700 mb-6">Household</h2>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : getProductsByCategory('Household').length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getProductsByCategory('Household').map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Snacks Section */}
        <div ref={snacksRef} className="mt-12">
          <h2 className="text-3xl font-bold text-red-600 mb-6">Snacks</h2>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : getProductsByCategory('Snacks').length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getProductsByCategory('Snacks').map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Beverages Section */}
        <div ref={beveragesRef} className="mt-12">
          <h2 className="text-3xl font-bold text-purple-700 mb-6">Beverages</h2>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : getProductsByCategory('Beverages').length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getProductsByCategory('Beverages').map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Groceries;