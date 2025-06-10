import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Clock, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Button from '../../components/ui/Button';
import Card, { CardBody, CardFooter, CardHeader } from '../../components/ui/Card';
import TimeSlotSelector from './TimeSlotSelector';
import PaymentMethodSelector from './PaymentMethodSelector';
import { PaymentMethod } from '../../types';

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };
  
  const handleProceedToCheckout = async () => {
    if (!currentUser || !cart.restaurant) return;
    
    // Validate order requirements
    if (!selectedTimeSlot) {
      alert('Please select a pickup time.');
      return;
    }
    
    try {
      setLoading(true);
      
      // Create order in Firestore
      const orderData = {
        customerId: currentUser.uid,
        customerName: currentUser.displayName || 'Anonymous',
        restaurantId: cart.restaurant.id,
        items: cart.items,
        totalAmount: cart.totalAmount + 1, // Including service fee
        timeSlot: selectedTimeSlot,
        orderDate: new Date(),
        status: 'PENDING', // Changed from paymentStatus to status
        paymentMethod,
        paymentStatus: 'PENDING',
        specialInstructions
      };
      
      const orderRef = await addDoc(collection(db, 'orders'), orderData);
      
      // Navigate to success page
      navigate('/checkout/success', { 
        state: { 
          order: {
            ...orderData,
            id: orderRef.id,
            restaurantName: cart.restaurant.name
          }
        }
      });
      
      // Clear cart after successful order
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (cart.items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Cart</h1>
        
        <div className="bg-white rounded-lg shadow-card p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Trash2 className="h-12 w-12 text-gray-400" />
          </div>
          
          <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          
          <Button 
            variant="primary" 
            onClick={() => navigate('/')}
          >
            Browse Restaurants
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">
                  {cart.restaurant?.name}
                </h2>
                <button 
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:text-red-700 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear Cart
                </button>
              </div>
            </CardHeader>
            
            <div className="divide-y divide-gray-100">
              {cart.items.map(item => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row">
                  <div className="w-full sm:w-24 h-24 mb-4 sm:mb-0 flex-shrink-0">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  
                  <div className="flex-1 sm:ml-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Prep time: {item.preparationTime} mins</span>
                        </div>
                      </div>
                      
                      <span className="font-medium text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center border rounded-md">
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-gray-500 hover:text-gray-700"
                        >
                          -
                        </button>
                        
                        <span className="px-2 py-1">{item.quantity}</span>
                        
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-500 hover:text-gray-700"
                        >
                          +
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium">Order Summary</h2>
            </CardHeader>
            
            <CardBody>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{cart.totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium">₹1.00</span>
                </div>
                
                <div className="border-t border-gray-100 pt-4 flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-lg">₹{(cart.totalAmount + 1).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Pickup Time
                </label>
                <TimeSlotSelector onSelectTimeSlot={setSelectedTimeSlot} selectedTimeSlot={selectedTimeSlot} />
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <PaymentMethodSelector 
                  selectedMethod={paymentMethod} 
                  onSelectMethod={setPaymentMethod} 
                />
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Any special requests or notes for your order..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>
            </CardBody>
            
            <CardFooter>
              <Button 
                variant="primary" 
                fullWidth 
                onClick={handleProceedToCheckout}
                isLoading={loading}
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Place Order
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;