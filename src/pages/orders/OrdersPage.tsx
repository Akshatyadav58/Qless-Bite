import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Clock, Package, CheckCircle, XCircle } from 'lucide-react';
import { db } from '../../firebase/config';
import { Order } from '../../types';
import { useAuth } from '../../context/AuthContext';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const OrdersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!currentUser) return;
        
        const ordersRef = collection(db, 'orders');
        const userOrdersQuery = query(
          ordersRef,
          where('customerId', '==', currentUser.uid),
          orderBy('orderDate', 'desc')
        );
        
        const ordersSnapshot = await getDocs(userOrdersQuery);
        const ordersData = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          orderDate: doc.data().orderDate.toDate(),
        })) as Order[];
        
        console.log('Fetched orders:', ordersData); // Debug log
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentUser]);
  
  // Updated filtering logic to match the order structure from cart
  const activeOrders = orders.filter(order => 
    order.paymentStatus === 'PENDING' || 
    (order.status && (
      order.status === 'PENDING' || 
      order.status === 'CONFIRMED' || 
      order.status === 'PREPARING' || 
      order.status === 'PACKED'
    ))
  );
  
  const completedOrders = orders.filter(order => 
    order.paymentStatus === 'COMPLETED' ||
    (order.status && (
      order.status === 'COMPLETED' || 
      order.status === 'CANCELED'
    ))
  );
  
  const displayOrders = activeTab === 'active' ? activeOrders : completedOrders;
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  const renderOrderStatus = (order: Order) => {
    // Check both status and paymentStatus fields
    const status = order.status || order.paymentStatus;
    
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Confirmed
          </span>
        );
      case 'PREPARING':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            Preparing
          </span>
        );
      case 'PACKED':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Ready for Pickup
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completed
          </span>
        );
      case 'CANCELED':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Canceled
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };
  
  // Function to get restaurant name from restaurantId
  const getRestaurantName = (restaurantId: string) => {
    // For now, return the restaurantId. In a real app, you'd fetch the restaurant name
    // You could also store the restaurant name in the order document when creating it
    return restaurantId;
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>
      
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`py-4 px-6 text-sm font-medium flex items-center ${
            activeTab === 'active'
              ? 'text-primary-600 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('active')}
        >
          <Clock className="h-4 w-4 mr-2" />
          Active Orders ({activeOrders.length})
        </button>
        
        <button
          className={`py-4 px-6 text-sm font-medium flex items-center ${
            activeTab === 'completed'
              ? 'text-primary-600 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('completed')}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Order History ({completedOrders.length})
        </button>
      </div>
      
      {displayOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-card p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            {activeTab === 'active' ? (
              <Package className="h-12 w-12 text-gray-400" />
            ) : (
              <CheckCircle className="h-12 w-12 text-gray-400" />
            )}
          </div>
          
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            {activeTab === 'active' 
              ? "No active orders" 
              : "No order history"
            }
          </h2>
          
          <p className="text-gray-600 mb-6">
            {activeTab === 'active'
              ? "You don't have any active orders at the moment."
              : "You haven't completed any orders yet."
            }
          </p>
          
          <Button 
            variant="primary" 
            onClick={() => window.location.href = '/'}
          >
            Browse Restaurants
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {displayOrders.map(order => (
            <Card key={order.id}>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">Order #{order.id.substring(0, 8)}</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-gray-500 text-sm">
                      {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2 sm:mt-0 flex items-center">
                  {renderOrderStatus(order)}
                </div>
              </CardHeader>
              
              <CardBody>
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <h3 className="font-medium mb-2">Restaurant</h3>
                  <p className="text-gray-700">{getRestaurantName(order.restaurantId)}</p>
                </div>
                
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <h3 className="font-medium mb-2">Items</h3>
                  <div className="space-y-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between">
                        <div className="flex items-start">
                          <div className="h-10 w-10 mr-3 flex-shrink-0">
                            <img 
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-full w-full object-cover rounded"
                            />
                          </div>
                          <div>
                            <p className="text-gray-700">{item.name}</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Pickup Time</h3>
                    <p className="text-gray-700 flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      {order.timeSlot}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <p className="text-gray-700">
                      {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Total Amount</h3>
                    <p className="text-gray-700 font-medium">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                
                {order.specialInstructions && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="font-medium mb-2">Special Instructions</h3>
                    <p className="text-gray-700">{order.specialInstructions}</p>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;