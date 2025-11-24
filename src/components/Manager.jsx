// src/components/GroceriesSection.jsx
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useState } from "react";

const BRANDS = [
  {
    id: "groceries",
    name: "Grocery Store 1",
    logo: "Local-Store/public/assests/general store.png",
    bg: "#CF2027",
    path: "/groceries",
    status: "open",
  },
  {
    id: "pharma",
    name: "Pharma Store",
    logo: "Local-Store/public/assests/pharamalogo.jpg",
    bg: "#C9151B",
    path: "/pharama",
    status: "open",
  },
  {
    id: "freshvegetables",
    name: "Grocery Store 2",
    logo:
      "https://i.pinimg.com/736x/42/29/55/42295579d4fbf33376042a45ccd82c2f.jpg",
    bg: "#133C7A",
    path: "/freshvegetables",
    status: "open",
  },
];

const PRODUCT_ITEMS = [
  { id: 1, name: "Fresh Vegetables", image: "Local-Store/public/assests/fresh vegetable.jpg", category: "Grocery" },
  { id: 2, name: "Medicine & Supplements", image: "Local-Store/public/assests/medicine &&.jpg", category: "Pharma" },
  { id: 3, name: "Daily Essentials", image: "Local-Store/public/assests/daily essentials.jpg", category: "General" },
  { id: 4, name: "Fresh Fruits", image: "Local-Store/public/assests/fruits.jpg", category: "Grocery" },
  { id: 5, name: "Fresh Vegetables (Pack)", image: "Local-Store/public/assests/fresh vegetable.jpg", category: "Grocery" },
  { id: 6, name: "Cold Drinks", image: "Local-Store/public/assests/groceries9.jpg", category: "General" },
  { id: 7, name: "Baby Care Products", image: "public/Images/medicine20.jpg", category: "General" },
  { id: 8, name: "Pain Relief Spray", image: "public/Images/medicine10.jpg", category: "Pharma" },
  { id: 9, name: "Organic Spices", image: "public/Images/groceries5.jpg", category: "Grocery" },
  { id: 10, name: "Cleaning Essentials", image: "public/Images/groceries19.jpg", category: "General" },
  { id: 11, name: "Nuts & Dry Fruits", image: "public/Images/groceries15.jpg", category: "Grocery" },
  { id: 12, name: "Breakfast Cereals", image: "public/Images/groceries11.jpg", category: "Grocery" },
];

const CUSTOMER_REVIEWS = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 5,
    review:
      "Amazing service! Fresh vegetables delivered right to my door. Will definitely order again.",
    product: "Fresh Vegetables",
    avatar: "PS",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    rating: 5,
    review: "Quick delivery and all medicines were genuine. Very satisfied with the pharma service.",
    product: "Medicine",
    avatar: "RK",
  },
  {
    id: 3,
    name: "Anita Patel",
    rating: 4,
    review: "Great quality products at reasonable prices. The grocery section has everything I need!",
    product: "Daily Essentials",
    avatar: "AP",
  },
  {
    id: 4,
    name: "Vikram Singh",
    rating: 5,
    review: "Best online store! Fresh fruits were perfectly ripe and delivery was super fast.",
    product: "Fresh Fruits",
    avatar: "VS",
  },
  {
    id: 5,
    name: "Sneha Reddy",
    rating: 5,
    review: "Excellent customer support and quality products. My go-to store for all essentials.",
    product: "General Store",
    avatar: "SR",
  },
  {
    id: 6,
    name: "Amit Verma",
    rating: 4,
    review: "Convenient shopping experience. Love the variety and quality of products available.",
    product: "Groceries",
    avatar: "AV",
  },
];

const BrandCard = ({ item, index = 0 }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "https://via.placeholder.com/200x120.png?text=Logo";
  };

  const handleClick = () => {
    if (item.status === "open") {
      navigate(item.path);
    } else {
      alert(
        `${item.name} is ${
          item.status === "closed" ? "temporarily closed" : "opening soon"
        }`
      );
    }
  };

  const badgeColor =
    item.status === "open"
      ? "bg-green-500"
      : item.status === "opens_soon"
      ? "bg-orange-500"
      : "bg-gray-500";

  const badgeText =
    item.status === "open" ? "Open" : item.status === "opens_soon" ? "Opens Soon" : "Closed";

  return (
    <div
      className="group relative block overflow-hidden rounded-2xl border bg-green-400 shadow-lg transition-all duration-500 ease-out cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`,
      }}
    >
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          background-size: 1000px 100%;
        }
      `}</style>

      <span
        className={`absolute top-3 left-3 z-10 rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-all duration-300 ${badgeColor} ${
          isHovered ? "scale-110" : "scale-100"
        }`}
        style={{
          animation: item.status === "open" ? "pulse 2s ease-in-out infinite" : "none",
        }}
      >
        {badgeText}
      </span>

      <div
        className="relative flex items-center justify-center px-4 h-60 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: "url('/Images/login-bg.jpg')",
        }}
      >
        <div
          className="absolute inset-0 backdrop-blur-md transition-all duration-500"
          style={{
            backdropFilter: isHovered ? "blur(8px)" : "blur(16px)",
          }}
        />

        {isHovered && (
          <div
            className="absolute inset-0 shimmer-effect opacity-50"
            style={{
              animation: "shimmer 2s linear infinite",
            }}
          />
        )}

        <img
          src={item.logo}
          alt={item.name}
          onError={handleError}
          className={`relative z-10 max-h-40 w-auto object-contain transition-all duration-500 ${
            isHovered ? "scale-110 rotate-2" : "scale-100 rotate-0"
          }`}
          loading="lazy"
          style={{
            filter: isHovered ? "drop-shadow(0 10px 20px rgba(0,0,0,0.3))" : "none",
          }}
        />
      </div>

      <div
        className={`py-3 text-center rounded-b-2xl transition-all duration-300 ${
          item.status === "open" ? "bg-[#48A14D] text-white" : "bg-gray-200 text-gray-700"
        } ${isHovered ? "py-4" : "py-3"}`}
      >
        <h3
          className={`text-[15px] px-3 font-semibold truncate transition-all duration-300 ${
            isHovered ? "text-base tracking-wide" : ""
          }`}
        >
          {item.name}
        </h3>
      </div>
    </div>
  );
};

const ProductCard = ({ item, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  // const handleAddToCart = (e) => {
  //   e.stopPropagation();
  //   alert(`${item.name} added to cart!`);
  // };

  return (
    <div
      className="w-full group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
      }}
    >
      <div
        className={`relative h-48 w-full overflow-hidden rounded-xl shadow-md transition-all duration-500 ${
          isHovered ? "shadow-2xl" : ""
        }`}
      >
        <img
          src={item.image}
          alt={item.name}
          className={`h-full w-full object-cover transition-all duration-700 ${
            isHovered ? "scale-125 rotate-2" : "scale-100"
          }`}
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? "opacity-80" : "opacity-100"}`} />

        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* <button
              onClick={handleAddToCart}
              className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300"
              aria-label={`Add ${item.name} to cart`}
            >
              <Plus className="w-6 h-6 text-green-600" />
            </button> */}
          </div>
        )}
      </div>

      <div className="p-3">
        <p className={`text-xs font-medium text-gray-500 mb-1 transition-all duration-300 ${isHovered ? "text-green-600 font-semibold" : ""}`}>
          {item.category}
        </p>
        <h3 className={`text-sm font-semibold text-gray-800 truncate transition-all duration-300 ${isHovered ? "text-green-700" : ""}`}>
          {item.name}
        </h3>
      </div>
    </div>
  );
};

const ReviewCard = ({ review }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex-shrink-0 w-80 mx-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`bg-white rounded-2xl shadow-lg p-6 h-full border-2 border-gray-100 transition-all duration-300 ${isHovered ? "shadow-2xl scale-105 border-green-300" : ""}`}>
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            {review.avatar}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-800 text-base">{review.name}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{review.product}</p>
            <div className="flex gap-0.5 mt-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed italic">"{review.review}"</p>
      </div>
    </div>
  );
};

const GroceriesSection = () => {
  return (
    <>
      <div className="w-full flex justify-center mt-0">
        <div
          className="bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-7xl transition-all duration-500 hover:shadow-2xl"
          style={{
            animation: "fadeInUp 0.8s ease-out",
          }}
        >
          <img
            src="/Images/home-page.jpg"
            alt="Home Banner"
            className="w-full max-h-[650px] object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>

      <section id="groceries" className="py-10">
        <div className="container mx-auto px-4">
          <h2
            className="mb-6 text-2xl font-extrabold tracking-tight text-foreground"
            style={{
              animation: "fadeInUp 0.6s ease-out 0.2s both",
            }}
          >
            Groceries, Pharma Care & General Stores
          </h2>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {BRANDS.map((brand, index) => (
              <BrandCard key={brand.id} item={brand} index={index} />
            ))}
          </div>

          <div className="mt-12">
            <h3
              className="mb-4 text-xl font-bold text-gray-800"
              style={{
                animation: "fadeInUp 0.6s ease-out 0.8s both",
              }}
            >
              Popular Products
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {PRODUCT_ITEMS.map((product, index) => (
                <ProductCard key={product.id} item={product} index={index} />
              ))}
            </div>
          </div>

          {/* CUSTOMER REVIEWS MARQUEE SECTION */}
          <div className="mt-16 mb-8">
            <h3
              className="mb-6 text-xl font-bold text-gray-800 text-center"
              style={{
                animation: "fadeInUp 0.6s ease-out 1s both",
              }}
            >
              What Our Customers Say
            </h3>

            <div className="relative overflow-hidden py-4">
              <style>{`
                @keyframes scroll {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(-50%);
                  }
                }
                
                .marquee-container {
                  display: flex;
                  animation: scroll 30s linear infinite;
                }
                
                .marquee-container:hover {
                  animation-play-state: paused;
                }
              `}</style>

              <div className="flex">
                <div className="marquee-container w-full">
                  {/* First set of reviews */}
                  {CUSTOMER_REVIEWS.map((review) => (
                    <ReviewCard key={`review-1-${review.id}`} review={review} />
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {CUSTOMER_REVIEWS.map((review) => (
                    <ReviewCard key={`review-2-${review.id}`} review={review} />
                  ))}
                </div>
              </div>

              {/* Gradient overlays for fade effect */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GroceriesSection;
