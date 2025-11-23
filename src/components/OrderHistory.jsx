import React from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import { ArrowLeft } from "lucide-react";

const OrderHistory = () => {
  const { customerOrders = [] } = useOrders(); // ⭐ Use customer orders only
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-24">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">

        {/* 🔙 BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h2 className="text-2xl font-bold mb-6">Order History</h2>

        {customerOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No orders found</p>
        ) : (
          <div className="space-y-4">
            {customerOrders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg p-4 bg-gray-50 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">
                    Order #{order.id}
                  </h3>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 text-green-800"
                        : order.status === "OUT_FOR_DELIVERY"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "PREPARING"
                        ? "bg-orange-100 text-orange-800"
                        : order.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="text-gray-700">
                  <strong>Total:</strong> ₹{order.total}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  {new Date(order.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;