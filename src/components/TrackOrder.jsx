import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle2, 
  ChefHat, 
  Bike, 
  MapPin, 
  Clock, 
  Search,
  AlertCircle,
  Phone,
  MessageSquare,
  Navigation,
  Timer,
  Store,
  User 
} from 'lucide-react';

const orderStatuses = {
  CONFIRMED: {
    title: 'Order Confirmed',
    description: 'Your order has been received',
    icon: CheckCircle2,
    color: 'text-green-500',
    bgColor: 'bg-green-100'
  },
  PREPARING: {
    title: 'Preparing',
    description: 'Restaurant is preparing your food',
    icon: ChefHat,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100'
  },
  OUT_FOR_DELIVERY: {
    title: 'Out for Delivery',
    description: 'Your order is on the way',
    icon: Bike,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100'
  },
  DELIVERED: {
    title: 'Delivered',
    description: 'Order has been delivered',
    icon: MapPin,
    color: 'text-green-500',
    bgColor: 'bg-green-100'
  }
};

const TrackOrder = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('CONFIRMED');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // First try to get order from navigation state
    if (location.state) {
      setOrderDetails(location.state);
      setCurrentStatus(location.state.status || 'CONFIRMED');
      localStorage.setItem('currentOrder', JSON.stringify(location.state));
    } else {
      // If not in navigation state, try localStorage
      const savedOrder = localStorage.getItem('currentOrder');
      if (savedOrder) {
        const parsedOrder = JSON.parse(savedOrder);
        setOrderDetails(parsedOrder);
        setCurrentStatus(parsedOrder.status || 'CONFIRMED');
      } else {
        setError('No active order found');
        // Redirect to home after 3 seconds if no order is found
        setTimeout(() => navigate('/'), 3000);
        return;
      }
    }

    // Simulate order progress
    const statusOrder = ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    let currentIndex = statusOrder.indexOf('CONFIRMED');

    const progressInterval = setInterval(() => {
      setCurrentStatus(prevStatus => {
        const currentIdx = statusOrder.indexOf(prevStatus);
        if (currentIdx < statusOrder.length - 1) {
          const newStatus = statusOrder[currentIdx + 1];
          // Update localStorage with new status
          const updatedOrder = { ...orderDetails, status: newStatus };
          localStorage.setItem('currentOrder', JSON.stringify(updatedOrder));
          setOrderDetails(updatedOrder);
          return newStatus;
        }
        clearInterval(progressInterval);
        return prevStatus;
      });
    }, 30000); // Update status every 30 seconds

    return () => clearInterval(progressInterval);
  }, [navigate, location.state]);

  const handleTrackOrder = async () => {
    if (!orderNumber.trim()) {
      setError('Please enter an order number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would fetch the order details from your backend
      if (orderNumber === '#12345') {
        setOrderDetails(mockOrderData);
        setCurrentStatus(mockOrderData.status);
      } else {
        setError('Order not found. Please check the order number.');
        setOrderDetails(null);
      }
    } catch (err) {
      setError('Failed to fetch order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get all statuses up to the current one
  const getRelevantStatuses = () => {
    const statusOrder = ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    return statusOrder.slice(0, currentIndex + 1);
  };

  const formatOrderTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Details and Status */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            {/* Order Header with Live Status */}
            <div className="flex items-center justify-between bg-[#FF5722]/5 p-4 rounded-lg">
              <div>
                <h2 className="text-2xl font-bold text-[#FF5722]">Live Tracking</h2>
                <p className="text-gray-600 mt-1">Real-time order updates</p>
              </div>
              <div className="animate-pulse">
                <div className="w-3 h-3 bg-[#FF5722] rounded-full"></div>
              </div>
            </div>

            {orderDetails && (
              <>
                {/* Order Header */}
                <div className="border-b pb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">#{orderDetails.orderNumber}</h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Live Tracking
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{orderDetails.restaurant}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Ordered at {formatOrderTime(orderDetails.orderTime)}</span>
                  </div>
                </div>

                {/* Live Status Updates */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Estimated Time</h3>
                    <span className="text-[#FF5722] font-bold">{orderDetails.estimatedDeliveryTime} mins</span>
                  </div>
                  
                  {/* Status Timeline */}
                  <div className="relative pt-2">
                    <div className="absolute left-[17px] top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    {getRelevantStatuses().map((status, index) => (
                      <div key={status} className="relative flex items-start gap-4 pb-8">
                        <div className={`relative z-10 rounded-full p-2 ${orderStatuses[status].bgColor}`}>
                          {(() => {
                            const StatusIcon = orderStatuses[status].icon;
                            return <StatusIcon className={`w-5 h-5 ${orderStatuses[status].color}`} />;
                          })()}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{orderStatuses[status].title}</h4>
                          <p className="text-sm text-gray-600">{orderStatuses[status].description}</p>
                          {status === currentStatus && (
                            <div className="mt-2 text-sm text-gray-500">
                              <Timer className="w-4 h-4 inline mr-1" />
                              Updated {Math.floor(Math.random() * 5) + 1} mins ago
                            </div>
                          )}
                        </div>
                        {status === currentStatus && (
                          <div className="animate-pulse">
                            <div className="w-2 h-2 bg-[#FF5722] rounded-full"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Middle Column - Live Map View */}
        <div className="lg:col-span-2">
          {orderDetails && (
            <div className="bg-white rounded-lg shadow-md h-full">
              {/* Simulated Map View */}
              <div className="relative h-[150px] bg-gradient-to-b from-[#FF5722]/5 to-white rounded-t-lg overflow-hidden">
                
                

                {/* Location Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#FF5722] rounded-full p-2">
                      <Navigation className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">Delivery Location</h3>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">Live</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{orderDetails.deliveryAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="p-6">
                

                {/* Order Details */}
                <div className="space-y-6">
                  {/* Restaurant Info */}
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                    <div className="p-3 bg-[#FF5722]/10 rounded-full">
                      <Store className="w-6 h-6 text-[#FF5722]" />
                    </div>
                    <div>
                      <p className="font-medium">{orderDetails.restaurant}</p>
                      <p className="text-sm text-gray-600">Order #{orderDetails.orderNumber}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <h4 className="font-medium mb-4 text-gray-900">Order Summary</h4>
                    <div className="space-y-3">
                      {orderDetails.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 flex items-center justify-center bg-[#FF5722]/10 rounded text-[#FF5722] font-medium">
                              {item.quantity}
                            </span>
                            <span>{item.name}</span>
                          </div>
                          <span className="font-medium">£{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t mt-3 pt-3">
                        <div className="flex justify-between items-center font-medium text-[#FF5722]">
                          <span>Total Amount</span>
                          <span>£{orderDetails.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
