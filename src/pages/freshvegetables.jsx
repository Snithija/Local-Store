// src/pages/Texaschicken.jsx
import React, { useState, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";

const FreshVegetables = () => {
  const [selectedCategory, setSelectedCategory] = useState("Fresh Vegetables");
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();
  const { getProductsByCategory, getAllProducts, isInStock, getProduct, loading, products } = useProducts();

  const freshVegetablesRef = useRef(null);
  const fruitsRef = useRef(null);
  const herbsSpicesRef = useRef(null);
  const organicRef = useRef(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    const refs = {
      "Fresh Vegetables": freshVegetablesRef,
      "Fruits": fruitsRef,
      "Herbs & Spices": herbsSpicesRef,
      "Organic Products": organicRef,
    };

    const targetRef = refs[category];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const categories = [
    "Fresh Vegetables",
    "Fruits",
    "Herbs & Spices",
    "Organic Products",
  ];

  const getFilteredItems = () => {
    if (!searchTerm) return null;
    
    const allItems = getAllProducts();
    return allItems.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (item.category === 'Fresh Vegetables' || item.category === 'Fruits' || 
         item.category === 'Herbs & Spices' || item.category === 'Organic Products') &&
        (item.name.toLowerCase().includes(searchLower) ||
         item.description?.toLowerCase().includes(searchLower))
      );
    });
  };

  const handleAddToCart = (productId) => {
    const product = getProduct(productId);
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      vegetables: "Vegetable Market",
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
    <div className="min-h-screen bg-gray-50">
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
                  Vegetables Store
                </h1>
                 <span className="text-xs font-medium text-gray-500 mb-1 block">
                  Fresh and Quality Vegetables
                </span>
              </div>

             
            </div>

            <div className="relative shrink-0">
              <div className="w-[380px] h-[250px] rounded-xl overflow-hidden">
                <img
                  src="https://media.istockphoto.com/id/637320954/photo/cart-with-fresh-fruits-and-vegetables-in-shopping-centre.jpg?s=612x612&w=0&k=20&c=fkytXdfLrzOUs8nsSTz8jOlMszScic90J-en3EL18Bk="
                  alt="Store"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Offers Section */}
      <div className="mx-4 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">
            All Offers from Vegetables Store 
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search from menu..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
        {searchTerm && (
          <div className="mb-6">
            {getFilteredItems()?.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-black mb-4">Search Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredItems().map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No items found matching "{searchTerm}"</p>
              </div>
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

        {/* Fresh Vegetables Section */}
        <div ref={freshVegetablesRef} className="mt-12">
          <h2 className="text-3xl font-bold text-green-600 mb-6">
            Fresh Vegetables
          </h2>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : getProductsByCategory('Fresh Vegetables').length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getProductsByCategory('Fresh Vegetables').map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Fruits Section */}
        <div ref={fruitsRef} className="mt-12">
          <h2 className="text-3xl font-bold text-red-500 mb-6">
            Fruits
          </h2>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : getProductsByCategory('Fruits').length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getProductsByCategory('Fruits').map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Herbs & Spices Section */}
        <div ref={herbsSpicesRef} className="mt-12">
          <h2 className="text-3xl font-bold text-yellow-700 mb-6">
            Herbs & Spices
          </h2>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : getProductsByCategory('Herbs & Spices').length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getProductsByCategory('Herbs & Spices').map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Organic Products Section */}
        <div ref={organicRef} className="mt-12">
          <h2 className="text-3xl font-bold text-emerald-600 mb-6">
            Organic Products
          </h2>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : getProductsByCategory('Organic Products').length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getProductsByCategory('Organic Products').map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreshVegetables;