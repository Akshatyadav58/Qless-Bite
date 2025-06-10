export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'customer' | 'admin' | 'vendor';
  phoneNumber?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  vendorId: string;
  location: string;
  openingHours: {
    open: string;
    close: string;
  };
  tags: string[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  isAvailable: boolean;
  preparationTime: number; // in minutes
  tags: string[];
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export type PaymentMethod = 'COD' | 'ONLINE';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'PACKED' | 'COMPLETED' | 'CANCELED';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  restaurantId: string;
  items: CartItem[];
  totalAmount: number;
  timeSlot: string;
  orderDate: Date;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'PENDING' | 'COMPLETED';
  specialInstructions?: string;
}