// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { ProductProvider } from "./context/ProductContext";
import React from "react";

// Components
import Header from "./components/Header.jsx";
// import Footer from "./components/Footer.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Registration.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import TrackOrder from "./components/TrackOrder.jsx";
import OrderHistory from "./components/OrderHistory.jsx";

// Pages
import CustomerDashboard from "./pages/CustomerDashboard";
import Groceries from "./pages/groceries.jsx";
import Pharama from "./pages/pharama.jsx";
import FreshVegetables from "./pages/freshvegetables.jsx";
import DeliveryDashboard from "./pages/DeliveryDashboard/index.jsx";
import ManagerDashboard from "./pages/ManagerDashboard/index.jsx";

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            <Router>
              <AppShell />
            </Router>
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

function AppShell() {
  const location = useLocation();
  const hideChrome = ["/login", "/register",].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {!hideChrome && <Header />}

      <main className="flex-1">
        {/* Smoothly scrolls to #hash targets after navigation */}
        <ScrollToHash />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/orderhistory" element={<OrderHistory />} />

          {/* Protected */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
         <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery"
            element={
              <ProtectedRoute allowedRoles={["delivery"]}>
                <DeliveryDashboard />
              </ProtectedRoute>
            }
          />

          {/* Public manager pages */}
          <Route path="/groceries" element={<Groceries />} />
          <Route path="/pharama" element={<Pharama />} />
          <Route path="/freshvegetables" element={<FreshVegetables />} />
        </Routes>
      </main>

      {/* {!hideChrome && <Footer />} */}
    </div>
  );
}

function ScrollToHash() {
  const { hash } = useLocation();
  React.useEffect(() => {
    if (!hash) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(hash.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [hash]);
  return null;
}

export default App;