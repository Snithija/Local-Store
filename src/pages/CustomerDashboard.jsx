import React from "react";
import Header from "../components/Header";
import ManagerSection from "../components/Manager";
import Footer from "../components/Footer";

const CustomerDashboard = () => {
  return (
    <div className="min-h-screen bg-green-50">
      {/* Navigation Header */}
      <Header />
      <ManagerSection />
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CustomerDashboard;
