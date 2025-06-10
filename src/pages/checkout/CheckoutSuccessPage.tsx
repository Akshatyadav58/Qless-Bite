import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardBody } from '../../components/ui/Card';

interface OrderState {
  order: {
    items: any[];
    timeSlot: string;
    paymentMethod: string;
    totalAmount: number;
    specialInstructions?: string;
    restaurantName?: string;
  };
}

const CheckoutSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as OrderState;
  
  useEffect(() => {
    // If no order data, redirect to home
    if (!state?.order) {
      navigate('/');
    }
  }, [state, navigate]);
  
  if (!state?.order) {
    return null; // Will redirect via useEffect
  }
  
  const { order } = state;
  const orderId = Math.random().toString(36).substring(2, 10).toUpperCase();
  const orderDate = new Date().toLocaleDateString();
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600">
          Your order has been confirmed and will be ready for pickup at your selected time.
        </p>
      </div>
      
      <Card>
        <CardBody>
          <div className="border-b border-gray-100 pb-4 mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Order Summary</h2>
              <span className="text-sm text-gray-500">Order ID: #{orderId}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Placed on {orderDate}</p>
          </div>
          
          <div className="border-b border-gray-100 pb-4 mb-4">
            <h3 className="font-medium mb-3">Restaurant</h3>
            <p className="text-gray-700">{order.restaurantName || 'Selected Restaurant'}</p>
          </div>
          
          <div className="border-b border-gray-100 pb-4 mb-4">
            <h3 className="font-medium mb-3">Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <h3 className="font-medium mb-2">Pickup Time</h3>
              <p className="text-gray-700">{order.timeSlot}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Payment Method</h3>
              <p className="text-gray-700">
                {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Total Amount</h3>
              <p className="text-gray-700 font-bold">₹{order.totalAmount.toFixed(2)}</p>
            </div>
          </div>
          
          {order.specialInstructions && (
            <div>
              <h3 className="font-medium mb-2">Special Instructions</h3>
              <p className="text-gray-700">{order.specialInstructions}</p>
            </div>
          )}
        </CardBody>
      </Card>
      
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          leftIcon={<ArrowLeft className="h-5 w-5" />}
        >
          Back to Home
        </Button>
        
        <Button 
          variant="primary" 
          onClick={() => navigate('/orders')}
          leftIcon={<ShoppingBag className="h-5 w-5" />}
        >
          View My Orders
        </Button>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;