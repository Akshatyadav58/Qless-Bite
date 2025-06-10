import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Clock, CheckCircle2, XCircle, Package2, Trash2 } from 'lucide-react';
import { db } from '../../firebase/config';
import { Order } from '../../types';
import Button from '../../components/ui/Button';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';

const OrderManagement: React.FC<{ restaurantId: string }> = ({ restaurantId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  
  const fetchOrders = async () => {
    try {
      const ordersRef = collection(db, 'orders');
      const restaurantOrdersQuery = query(
        ordersRef,
        where('restaurantId', '==', restaurantId),
        where('paymentStatus', '==', activeTab === 'pending' ? 'PENDING' : 'COMPLETED'),
        orderBy('orderDate', 'desc')
      );
      
      const ordersSnapshot = await getDocs(restaurantOrdersQuery);
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        orderDate: doc.data().orderDate.toDate(),
      })) as Order[];
      
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [restaurantId, activeTab]);

  const handleUpdateStatus = async (orderId: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        paymentStatus: 'COMPLETED'
      });
      
      // Refresh orders
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDeleteRestaurant = async () => {
    if (!window.confirm('Are you sure you want to delete this restaurant? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      
      // Delete restaurant document
      await deleteDoc(doc(db, 'restaurants', restaurantId));
      
      // Delete associated menu items
      const menuItemsQuery = query(
        collection(db, 'menuItems'),
        where('restaurantId', '==', restaurantId)
      );
      const menuItemsSnapshot = await getDocs(menuItemsQuery);
      
      for (const doc of menuItemsSnapshot.docs) {
        await deleteDoc(doc.ref);
      }
      
      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      alert('Failed to delete restaurant. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Order Management</h2>
        <Button
          variant="outline"
          className="text-red-500 border-red-200 hover:bg-red-50"
          onClick={handleDeleteRestaurant}
          leftIcon={<Trash2 className="h-4 w-4" />}
        >
          Delete Restaurant
        </Button>
      </div>
      
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`py-4 px-6 text-sm font-medium flex items-center ${
            activeTab === 'pending'
              ? 'text-primary-600 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('pending')}
        >
          <Clock className="h-4 w-4 mr-2" />
          Pending Orders ({orders.length})
        </button>
        
        <button
          className={`py-4 px-6 text-sm font-medium flex items-center ${
            activeTab === 'completed'
              ? 'text-primary-600 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('completed')}
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Completed Orders ({orders.length})
        </button>
      </div>
      
      {orders.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <Package2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'pending' 
                ? "No pending orders" 
                : "No completed orders"
              }
            </h3>
            <p className="text-gray-500">
              {activeTab === 'pending'
                ? "You don't have any pending orders at the moment."
                : "You haven't completed any orders yet."
              }
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
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
                  {order.paymentStatus === 'PENDING' ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  )}
                </div>
              </CardHeader>
              
              <CardBody>
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
                
                {activeTab === 'pending' && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    <Button
                      variant="primary"
                      onClick={() => handleUpdateStatus(order.id)}
                    >
                      Mark as Completed
                    </Button>
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

export default OrderManagement;