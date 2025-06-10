import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, MenuItem, Restaurant } from '../types';

interface CartState {
  items: CartItem[];
  restaurant: Restaurant | null;
  totalAmount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: MenuItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_RESTAURANT'; payload: Restaurant };

interface CartContextType {
  cart: CartState;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setRestaurant: (restaurant: Restaurant) => void;
  isItemInCart: (id: string) => boolean;
  getItemQuantity: (id: string) => number;
}

const initialState: CartState = {
  items: [],
  restaurant: null,
  totalAmount: 0,
};

const calculateTotalAmount = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex !== -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        
        return {
          ...state,
          items: updatedItems,
          totalAmount: calculateTotalAmount(updatedItems),
        };
      } else {
        const newItem: CartItem = {
          ...action.payload,
          quantity: 1,
        };
        
        const updatedItems = [...state.items, newItem];
        
        return {
          ...state,
          items: updatedItems,
          totalAmount: calculateTotalAmount(updatedItems),
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      
      return {
        ...state,
        items: updatedItems,
        totalAmount: calculateTotalAmount(updatedItems),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        const updatedItems = state.items.filter(item => item.id !== id);
        
        return {
          ...state,
          items: updatedItems,
          totalAmount: calculateTotalAmount(updatedItems),
        };
      }
      
      const updatedItems = state.items.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      
      return {
        ...state,
        items: updatedItems,
        totalAmount: calculateTotalAmount(updatedItems),
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...initialState,
      };
    
    case 'SET_RESTAURANT':
      // If restaurant is different, clear cart
      if (state.restaurant && state.restaurant.id !== action.payload.id) {
        return {
          items: [],
          restaurant: action.payload,
          totalAmount: 0,
        };
      }
      
      return {
        ...state,
        restaurant: action.payload,
      };
    
    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Get cart from localStorage
const getInitialCart = (): CartState => {
  if (typeof window === 'undefined') return initialState;
  
  try {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : initialState;
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return initialState;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, getInitialCart());

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  const addToCart = (item: MenuItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setRestaurant = (restaurant: Restaurant) => {
    dispatch({ type: 'SET_RESTAURANT', payload: restaurant });
  };

  const isItemInCart = (id: string): boolean => {
    return cart.items.some(item => item.id === id);
  };

  const getItemQuantity = (id: string): number => {
    const item = cart.items.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setRestaurant,
    isItemInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};