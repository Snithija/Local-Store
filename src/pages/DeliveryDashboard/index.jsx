import React, { useState, useEffect } from "react";
import { useOrders } from "../../context/OrderContext";

const DeliveryDashboard = () => {
  const { deliveryOrders, updateDeliveryOrder, fetchDeliveryOrders } = useOrders();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch orders on mount
    fetchDeliveryOrders();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchDeliveryOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchDeliveryOrders]);

  const handleAcceptOrder = async (orderId) => {
    setLoading(true);
    try {
      await updateDeliveryOrder(orderId, "ACCEPTED");
    } catch (error) {
      console.error('Error accepting order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOutForDelivery = async (orderId) => {
    setLoading(true);
    try {
      await updateDeliveryOrder(orderId, "OUT_FOR_DELIVERY");
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDelivered = async (orderId) => {
    setLoading(true);
    try {
      await updateDeliveryOrder(orderId, "DELIVERED");
    } catch (error) {
      console.error('Error marking as delivered:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionButton = (order) => {
    const status = order?.status?.toUpperCase();
    
    switch (status) {
      case "ASSIGNED":
      case "READY":
        return (
          <button
            onClick={() => handleAcceptOrder(order.id)}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50"
          >
            Accept Order
          </button>
        );
      case "ACCEPTED":
        return (
          <button
            onClick={() => handleOutForDelivery(order.id)}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
          >
            Start Delivery
          </button>
        );
      case "OUT_FOR_DELIVERY":
        return (
          <button
            onClick={() => handleMarkAsDelivered(order.id)}
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-50"
          >
            Mark as Delivered
          </button>
        );
      default:
        return null;
    }
  };

  const getStatusInfo = (status) => {
    switch (status?.toUpperCase()) {
      case "ASSIGNED":
      case "READY":
        return {
          text: "New Assignment",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
        };
      case "ACCEPTED":
        return {
          text: "Accepted",
          bgColor: "bg-orange-100",
          textColor: "text-orange-800",
        };
      case "OUT_FOR_DELIVERY":
        return {
          text: "Out for Delivery",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
        };
      case "DELIVERED":
        return {
          text: "Delivered",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
        };
      default:
        return {
          text: status || "Unknown",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
        };
    }
  };

  const activeOrders = deliveryOrders?.filter(order => 
    ["ASSIGNED", "ACCEPTED", "OUT_FOR_DELIVERY", "READY"].includes(order?.status?.toUpperCase())
  ) || [];

  const completedToday = deliveryOrders?.filter(order => 
    order?.status?.toUpperCase() === "DELIVERED"
  ) || [];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Delivery Dashboard
          </h1>
          <p className="text-gray-600">Your delivery assignments</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-blue-500 text-white rounded-lg p-4 shadow-md">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {activeOrders.length}
              </div>
              <div className="text-sm font-medium">Active Orders</div>
            </div>
          </div>

          <div className="bg-green-500 text-white rounded-lg p-4 shadow-md">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {completedToday.length}
              </div>
              <div className="text-sm font-medium">Completed Today</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {deliveryOrders && deliveryOrders.length > 0 ? (
          deliveryOrders.map((order) => {
            const statusInfo = getStatusInfo(order?.status);

            return (
              <div
                key={order?.id}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      Order #{order?.orderNumber || order?.id}
                    </h3>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo?.bgColor} ${statusInfo?.textColor}`}
                    >
                      {statusInfo?.text}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pickup:</span>
                    <span className="font-medium text-gray-900">
                      {order?.pickup || 'Store'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium text-gray-900">
                      {order?.customer || 'Guest'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount:</span>
                    <span className="text-xl font-bold text-gray-900">
                      ₹{order?.total}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      {getActionButton(order)}
                    </div>
                  </div>
                </div>

                {order?.deliveryAddress && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Delivery Information
                    </h4>
                    <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                  </div>
                )}

                {order?.items && order.items.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Items ({order.items.length})
                    </h4>
                    <div className="space-y-1">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <p key={idx} className="text-sm text-gray-600">
                          {item.quantity}x {item.name}
                        </p>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-sm text-gray-500">
                          +{order.items.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <p className="text-gray-500 text-lg">No delivery orders assigned yet</p>
            <p className="text-gray-400 text-sm mt-2">Orders will appear here when manager assigns them</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
