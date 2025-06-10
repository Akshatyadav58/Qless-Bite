import React, { useState } from 'react';
import { Plus, Minus, Clock } from 'lucide-react';
import { MenuItem, Restaurant } from '../../types';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useCart } from '../../context/CartContext';

interface MenuItemCardProps {
  item: MenuItem;
  restaurant: Restaurant;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, restaurant }) => {
  const { addToCart, removeFromCart, updateQuantity, isItemInCart, getItemQuantity, setRestaurant } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  const quantity = getItemQuantity(item.id);
  
  const handleAddToCart = () => {
    setIsAdding(true);
    setRestaurant(restaurant);
    addToCart(item);
    
    // Visual feedback with animation
    setTimeout(() => {
      setIsAdding(false);
    }, 300);
  };
  
  const handleIncreaseQuantity = () => {
    updateQuantity(item.id, quantity + 1);
  };
  
  const handleDecreaseQuantity = () => {
    if (quantity === 1) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, quantity - 1);
    }
  };
  
  return (
    <Card className={`h-full transition-all duration-300 ${isAdding ? 'scale-105' : ''}`}>
      <div className="relative h-40 overflow-hidden rounded-t-lg">
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
        
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-medium px-3 py-1 bg-red-500 rounded">
              Unavailable
            </span>
          </div>
        )}
      </div>
      
      <CardBody>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
          <div className="text-primary-500 font-bold">₹{item.price.toFixed(2)}</div>
        </div>
        
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
          {item.description}
        </p>
        
        <div className="flex items-center mt-2 mb-4 text-xs text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          <span>Prep time: {item.preparationTime} mins</span>
        </div>
        
        <div className="mt-auto">
          {!isItemInCart(item.id) ? (
            <Button
              variant="primary"
              fullWidth
              onClick={handleAddToCart}
              disabled={!item.isAvailable}
            >
              Add to Cart
            </Button>
          ) : (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecreaseQuantity}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <span className="text-gray-900 font-medium mx-2">{quantity}</span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleIncreaseQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default MenuItemCard;