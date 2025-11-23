// src/context/OrderContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axios";

const OrderContext = createContext();
export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [managerOrders, setManagerOrders] = useState([]);
  const [deliveryOrders, setDeliveryOrders] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);  // ⭐ ADDED
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ===================================================
     ⭐ FETCH CUSTOMER ORDERS
  =================================================== */
  const fetchCustomerOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axiosInstance.get("/api/orders/my-orders");
      if (response.data.success) {
        setCustomerOrders(response.data.data);
      }
    } catch (err) {
      console.error("❌ Error fetching customer orders:", err);
    }
  };

  /* ===================================================
     FETCH MANAGER ORDERS
  =================================================== */
  const fetchManagerOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axiosInstance.get("/api/orders/manager/all");
      if (response.data.success) {
        setManagerOrders(response.data.data);
      }
    } catch (err) {
      console.error("❌ Error fetching manager orders:", err);
      setError(err.response?.data?.message || "Failed to fetch orders");
    }
  };

  /* ===================================================
     FETCH DELIVERY ORDERS
  =================================================== */
  const fetchDeliveryOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axiosInstance.get("/api/orders/delivery/all");
      if (response.data.success) {
        setDeliveryOrders(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching delivery orders:", err);
      setError(err.response?.data?.message || "Failed to fetch orders");
    }
  };

  /* ===================================================
     🔄 AUTO REFRESH BASED ON ROLE
  =================================================== */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user.role;

    if (role === "manager") {
      fetchManagerOrders();
      const interval = setInterval(fetchManagerOrders, 3000);
      return () => clearInterval(interval);
    }

    if (role === "delivery") {
      fetchDeliveryOrders();
      const interval = setInterval(fetchDeliveryOrders, 5000);
      return () => clearInterval(interval);
    }

    if (role === "customer") {
      fetchCustomerOrders();
      const interval = setInterval(fetchCustomerOrders, 4000);
      return () => clearInterval(interval);
    }
  }, []);

  /* ===================================================
     UPDATE TRACKING STATUS (CUSTOMER)
  =================================================== */
  const updateTrackingStatus = async (orderId, status) => {
    try {
      const current = JSON.parse(localStorage.getItem("currentOrder") || "{}");
      if (!current || current.id !== orderId) return;

      current.status = status;
      localStorage.setItem("currentOrder", JSON.stringify(current));
    } catch (err) {
      console.error("Error updating tracking status:", err);
    }
  };

  /* ===================================================
     DELIVERY PARTNER – UPDATE ORDER
  =================================================== */
  const updateDeliveryOrder = async (orderId, newStatus) => {
    try {
      const response = await axiosInstance.patch(
        `/api/orders/delivery/${orderId}/status`,
        { status: newStatus }
      );

      if (response.data.success) {
        await fetchDeliveryOrders();
        await fetchManagerOrders();
        updateTrackingStatus(orderId, newStatus);
      }
    } catch (err) {
      console.error("Error updating delivery order:", err);
      alert("Failed to update order status.");
    }
  };

  /* ===================================================
     MANAGER – UPDATE ORDER
  =================================================== */
  const updateManagerOrder = async (orderId, action) => {
    try {
      let newStatus =
        action === "accept"
          ? "PREPARING"
          : action === "reject"
          ? "REJECTED"
          : action === "mark-ready"
          ? "READY"
          : action === "assign-delivery"
          ? "OUT_FOR_DELIVERY"
          : null;

      if (!newStatus) return;

      const response = await axiosInstance.patch(
        `/api/orders/manager/${orderId}/status`,
        { status: newStatus }
      );

      if (response.data.success) {
        await fetchManagerOrders();
        if (newStatus === "OUT_FOR_DELIVERY") fetchDeliveryOrders();
        updateTrackingStatus(orderId, newStatus);
      }
    } catch (err) {
      console.error("Error updating manager order:", err);
      alert("Failed to update order.");
    }
  };

  /* ===================================================
     CUSTOMER – CREATE ORDER
  =================================================== */
  const addManagerOrder = async (order) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const response = await axiosInstance.post("/api/orders", {
        items: order.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: order.total,
        deliveryAddress: order.deliveryAddress || "",
      });

      if (response.data.success) {
        const newOrder = response.data.data;

        const transformedOrder = {
          id: newOrder.id,
          orderNumber: newOrder.orderNumber,
          customerName: newOrder.customer?.name || user.name || "Guest",
          items: newOrder.items.map((item) => ({
            id: item.productId,
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
            image: item.product.image,
          })),
          total: newOrder.total,
          status: newOrder.status,
          deliveryAddress: newOrder.deliveryAddress,
          timestamp: newOrder.createdAt,
        };

        localStorage.setItem("currentOrder", JSON.stringify(transformedOrder));
        return transformedOrder;
      }
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Failed to create order.");
      throw err;
    }
  };

  /* ===================================================
     CONTEXT VALUE
  =================================================== */
  return (
    <OrderContext.Provider
      value={{
        managerOrders,
        deliveryOrders,
        customerOrders,        // ⭐ EXPORTED
        fetchCustomerOrders,   // ⭐ EXPORTED
        updateManagerOrder,
        updateDeliveryOrder,
        addManagerOrder,
        fetchManagerOrders,
        fetchDeliveryOrders,
        loading,
        error,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;