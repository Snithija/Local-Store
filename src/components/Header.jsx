// src/components/Header.jsx
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, ChevronDown, User } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Cart from "./Cart";

const PillLink = ({ to, children, ...props }) => (
  <NavLink
    to={to}
    {...props}
    className={({ isActive }) =>
      [
        "px-5 py-2 rounded-full text-sm font-medium transition",
        isActive
          ? "bg-primary text-white shadow"
          : "text-foreground hover:bg-muted",
      ].join(" ")
    }
  >
    {children}
  </NavLink>
);

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const auth = useAuth();
  const { role, logout } = auth;

  const isDashboard =
    location.pathname.startsWith("/manager") ||
    location.pathname.startsWith("/delivery");

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      switch (role) {
        case "manager":
          navigate("/manager");
          break;
        case "delivery":
          navigate("/delivery");
          break;
        case "customer":
          navigate("/customer");
          break;
        default:
          navigate("/");
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-card bg-green-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="Local-Store/public/assests/store-icon.png"
            alt="Local Store Logo"
            className="h-10 w-auto object-contain"
          />
          <span>Local Store</span>
        </Link>

        {/* Center nav */}
        {!isDashboard && (
          <nav className="hidden items-center gap-2 md:flex">
            <PillLink to="/" onClick={handleHomeClick}>Home</PillLink>

            {!["/general store1", "/pharma care", "/general store2", "/track"].includes(
              location.pathname
            ) && (
              <button
                onClick={() => navigate("/orderhistory")}
                className="px-5 py-2 rounded-full text-sm font-medium text-foreground hover:bg-muted"
              >
                Order History
              </button>
            )}

            <Link
              to="/track"
              className="px-5 py-2 rounded-full text-sm font-medium text-foreground hover:bg-muted"
            >
              Track Order
            </Link>
          </nav>
        )}

        {/* RIGHT SIDE (desktop): Cart (ONLY for customer) + My Account */}
        <div className="hidden md:flex items-center gap-3">

          {/* CART ONLY FOR CUSTOMER */}
          {role === "customer" && (
            <div className="flex items-end gap-1">
              <button
                onClick={() => setIsCartOpen(true)}
                className="hidden items-center gap-1 sm:flex hover:text-primary transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{totalItems} items</span>
              </button>

              <span className="hidden rounded-full bg-green-600 px-2 py-0.5 text-white sm:inline">
                GBP {totalPrice.toFixed(2)}
              </span>
            </div>
          )}

          {/* Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              <User className="h-4 w-4" />
              My Account
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isAccountOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isAccountOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border bg-white shadow-md z-50">
                <div className="p-3 border-b">
                  <p className="text-sm font-semibold">
                    {auth?.user?.name || "Guest"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {auth?.user?.email || ""}
                  </p>
                </div>

                <ul className="text-sm">
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-muted text-red-500"
                      onClick={() => {
                        logout();
                        setIsAccountOpen(false);
                        navigate("/login");
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE: Menu + Cart (ONLY for customer) */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-xl border px-3 py-1.5 text-sm hover:bg-muted transition flex items-center gap-2"
            >
              Menu
              <ChevronDown
                className={`inline h-4 w-4 transition-transform ${
                  isMobileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isMobileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border bg-white shadow-md z-50">
                <ul className="text-sm">
                  <li>
                    <Link
                      to="/"
                      className="block px-4 py-2 hover:bg-muted"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/track"
                      className="block px-4 py-2 hover:bg-muted"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Track Order
                    </Link>
                  </li>

                  <li className="border-t">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-muted text-red-500"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                        navigate("/login");
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* MOBILE CART ONLY FOR CUSTOMER */}
          {role === "customer" && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1 rounded-full px-2 py-1 hover:bg-muted transition"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="text-sm">{totalItems}</span>
            </button>
          )}
        </div>
      </div>

      {/* Shared Cart Drawer */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;
