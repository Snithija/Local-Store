// src/pages/managerDashBoard/index.jsx
import React, { useState, useEffect } from "react";
import {
  Bell,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useOrders } from "../../context/OrderContext";
import { useProducts } from "../../context/ProductContext";

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const {
    managerOrders,
    updateManagerOrder,
    updateDeliveryOrder,
    fetchManagerOrders,
  } = useOrders();

  /** 🔥 FIXED — NO DOUBLE FETCH, NO INFINITE LOOP */
  useEffect(() => {
    if (activeTab === "orders" || activeTab === "dashboard") {
      fetchManagerOrders();
    }
  }, [activeTab]);

  /** PRODUCT LOGIC */
  const {
    getAllProducts,
    updateStock,
    addProduct,
    updateProduct,
    deleteProduct,
    loading: productsLoading,
  } = useProducts();

  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    lowStockThreshold: 10,
    image: "📦",
    description: "",
  });

  /** Load product list */
  useEffect(() => {
    const loadProducts = () => {
      setProducts(getAllProducts() || []);
    };

    loadProducts();

    const interval = setInterval(loadProducts, 2000);
    return () => clearInterval(interval);
  }, [getAllProducts]);

  // Calculate today's metrics
  const today = new Date().setHours(0, 0, 0, 0);
  const todayOrders = managerOrders?.filter(order => {
    const orderDate = new Date(order.createdAt || order.timestamp).setHours(0, 0, 0, 0);
    return orderDate === today;
  }) || [];

  const todayRevenue = todayOrders.reduce((total, order) => total + (order.total || 0), 0);
  const completedOrders = todayOrders.filter(o => o.status?.toUpperCase() === 'DELIVERED').length;

  // Get recent orders (last 5)
  const recentOrders = [...(managerOrders || [])].slice(0, 5);

  const lowStockProducts = products.filter(
    (p) => p.stock <= (p.lowStockThreshold || 10)
  );

  // Calculate weekly and monthly stats for analytics
  const getWeeklyRevenue = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return managerOrders?.filter(o => new Date(o.createdAt || o.timestamp) >= weekAgo)
      .reduce((t, o) => t + (o.total || 0), 0) || 0;
  };

  const getMonthlyRevenue = () => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return managerOrders?.filter(o => new Date(o.createdAt || o.timestamp) >= monthAgo)
      .reduce((t, o) => t + (o.total || 0), 0) || 0;
  };

  const handleUpdateStock = (productId, newStock) => {
    const s = parseInt(newStock);
    if (isNaN(s) || s < 0) return;

    updateStock(productId, s);
    setProducts(getAllProducts());
  };

  const handleSaveProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      alert("Please fill all required fields");
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        lowStockThreshold: parseInt(newProduct.lowStockThreshold),
      });
    } else {
      addProduct({
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        lowStockThreshold: parseInt(newProduct.lowStockThreshold),
      });
    }

    setShowProductModal(false);
    setEditingProduct(null);

    setNewProduct({
      name: "",
      category: "",
      price: "",
      stock: "",
      lowStockThreshold: 10,
      image: "📦",
      description: "",
    });

    setProducts(getAllProducts());
  };

  const mapStatusForUI = (status) => {
    if (!status) return "pending";
    const s = status.toUpperCase();

    if (["NEW", "PENDING", "CONFIRMED"].includes(s)) return "pending";
    if (s === "PREPARING") return "accepted";
    if (s === "READY") return "preparing";
    if (["ASSIGNED", "OUT_FOR_DELIVERY"].includes(s)) return "out_for_delivery";
    if (s === "DELIVERED") return "completed";
    if (s === "REJECTED") return "rejected";

    return "pending";
  };

  /** 🔥 FIXED FULL ORDER ACTION LOGIC */
  const handleOrderAction = (orderId, action) => {
    if (action === "accept") {
      updateManagerOrder(orderId, "accept");
    } else if (action === "reject") {
      updateManagerOrder(orderId, "reject");
    } else if (action === "prepare") {
      updateManagerOrder(orderId, "mark-ready");
    } else if (action === "dispatch") {
      const order = managerOrders.find((o) => o.id === orderId);
      updateManagerOrder(orderId, "assign-delivery", order);
    } else if (action === "complete") {
      updateDeliveryOrder(orderId, "DELIVERED");
    }
  };

  const getStatusColor = (ui) =>
    ({
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      preparing: "bg-purple-100 text-purple-800",
      out_for_delivery: "bg-indigo-100 text-indigo-800",
      completed: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }[ui]);

  const getStatusText = (ui) =>
    ({
      pending: "Pending",
      accepted: "Preparing",
      preparing: "Ready",
      out_for_delivery: "Out for Delivery",
      completed: "Completed",
      rejected: "Rejected",
    }[ui]);

  const formatTime = (t) => (t ? new Date(t).toLocaleString() : "");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto p-4 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Outlet Manager</h1>
            <p className="text-sm text-gray-600">Real-time inventory management</p>
          </div>

          {/* <div className="relative">
            <Bell className="w-6 h-6 text-gray-600" />
            {lowStockProducts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {lowStockProducts.length}
              </span>
            )}
          </div> */}
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 flex gap-4">
          {["dashboard", "products", "orders"].map((t) => (
            <button
              key={t}
              className={`py-3 px-4 capitalize ${
                activeTab === t
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto p-6">
        {/* ====================== DASHBOARD ====================== */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Today's Revenue</p>
                    <p className="text-2xl font-bold text-green-600">₹{todayRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-10 h-10 text-green-500 opacity-20" />
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Orders Today</p>
                    <p className="text-2xl font-bold text-blue-600">{todayOrders.length}</p>
                  </div>
                  <ShoppingCart className="w-10 h-10 text-blue-500 opacity-20" />
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-purple-600">{products.length}</p>
                  </div>
                  <Package className="w-10 h-10 text-purple-500 opacity-20" />
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed Today</p>
                    <p className="text-2xl font-bold text-orange-600">{completedOrders}</p>
                  </div>
                  <CheckCircle className="w-10 h-10 text-orange-500 opacity-20" />
                </div>
              </div>
            </div>

            {/* Low Stock Alerts */}
            {lowStockProducts.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 mb-2">
                      Low Stock Alert - {lowStockProducts.length} Product(s)
                    </h3>
                    <div className="space-y-2">
                      {lowStockProducts.map(product => (
                        <div key={product.id} className="flex items-center justify-between bg-white p-3 rounded">
                          <div className="flex items-center gap-3">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div>
                              <p className="font-medium text-sm">{product.name}</p>
                              <p className="text-xs text-gray-600">{product.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-red-600">{product.stock} units</p>
                            <p className="text-xs text-gray-500">Threshold: {product.lowStockThreshold}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Orders and Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Recent Orders
                </h3>
                <div className="space-y-3">
                  {recentOrders.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No recent orders</p>
                  ) : (
                    recentOrders.map(order => {
                      const ui = mapStatusForUI(order.status);
                      return (
                        <div key={order.id} className="border-b pb-3 last:border-b-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Order #{order.orderNumber || order.id?.slice(-6)}</p>
                              <p className="text-sm text-gray-600">{order.customerName}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatTime(order.createdAt || order.timestamp)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">₹{order.total}</p>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${getStatusColor(ui)}`}>
                                {getStatusText(ui)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Analytics Report */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Analytics Report
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Weekly Revenue</p>
                    <p className="text-xl font-bold text-blue-600">₹{getWeeklyRevenue().toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
                    <p className="text-xl font-bold text-purple-600">₹{getMonthlyRevenue().toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Average Order Value</p>
                    <p className="text-xl font-bold text-green-600">
                      ₹{todayOrders.length > 0 ? Math.round(todayRevenue / todayOrders.length).toLocaleString() : 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Today's average</p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                    <p className="text-xl font-bold text-orange-600">{managerOrders?.length || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">All time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================== PRODUCTS ====================== */}
        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">Product Management</h2>

              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2 hover:bg-blue-700"
                onClick={() => {
                  setEditingProduct(null);
                  setNewProduct({
                    name: "",
                    category: "",
                    price: "",
                    stock: "",
                    lowStockThreshold: 10,
                    description: "",
                    image: "📦",
                  });
                  setShowProductModal(true);
                }}
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-auto">
              {productsLoading ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No products found.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                      <th className="px-6 py-3">Product</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Price</th>
                      <th className="px-6 py-3">Stock</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-4 flex gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded object-cover border"
                          />
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-gray-500">
                              {p.description}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4">{p.category}</td>
                        <td className="px-6 py-4">₹{p.price}</td>

                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min="0"
                            className="border rounded w-20 px-2 py-1"
                            value={p.stock}
                            onChange={(e) =>
                              handleUpdateStock(p.id, e.target.value)
                            }
                          />
                        </td>

                        <td className="px-6 py-4">
                          {p.stock === 0 ? (
                            <span className="text-red-600 text-xs font-semibold">
                              Out of Stock
                            </span>
                          ) : p.stock <= p.lowStockThreshold ? (
                            <span className="text-yellow-600 text-xs font-semibold">
                              Low Stock
                            </span>
                          ) : (
                            <span className="text-green-600 text-xs font-semibold">
                              In Stock
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 flex gap-3">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => {
                              setEditingProduct(p);
                              setNewProduct(p);
                              setShowProductModal(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => deleteProduct(p.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ====================== ORDERS ====================== */}
        {activeTab === "orders" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Order Management</h2>

              <button
                onClick={fetchManagerOrders}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                Refresh Orders
              </button>
            </div>

            {!managerOrders || managerOrders.length === 0 ? (
              <div className="bg-white shadow p-8 rounded text-center">
                <p className="text-gray-500 text-lg">No orders found</p>
                <button
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                  onClick={fetchManagerOrders}
                >
                  Refresh
                </button>
              </div>
            ) : (
              managerOrders.map((order) => {
                const ui = mapStatusForUI(order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-white shadow p-6 rounded mb-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Order #{order.orderNumber || order.id}
                        </h3>
                        <p className="text-gray-600">
                          {order.customerName} • {order.items.length} items
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                          ui
                        )}`}
                      >
                        {getStatusText(ui)}
                      </span>
                    </div>

                    <p className="text-sm mt-3">
                      Total: <b>₹{order.total}</b>
                    </p>

                    <div className="flex gap-3 mt-4">
                      {ui === "pending" && (
                        <>
                          <button
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            onClick={() =>
                              handleOrderAction(order.id, "accept")
                            }
                          >
                            Accept
                          </button>

                          <button
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            onClick={() =>
                              handleOrderAction(order.id, "reject")
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {ui === "accepted" && (
                        <button
                          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                          onClick={() =>
                            handleOrderAction(order.id, "prepare")
                          }
                        >
                          Mark as Ready
                        </button>
                      )}

                      {ui === "preparing" && (
                        <button
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                          onClick={() =>
                            handleOrderAction(order.id, "dispatch")
                          }
                        >
                          Assign Delivery Partner
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* ====================== PRODUCT MODAL ====================== */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h3>
              <button onClick={() => setShowProductModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                className="w-full border p-2 rounded"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />

              <input
                className="w-full border p-2 rounded"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              />

              <textarea
                className="w-full border p-2 rounded"
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    description: e.target.value,
                  })
                }
              />

              <input
                type="number"
                className="w-full border p-2 rounded"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
              />

              <input
                type="number"
                className="w-full border p-2 rounded"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
              />

              <button
                onClick={handleSaveProduct}
                className="w-full bg-blue-600 text-white p-2 rounded mt-3 hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;