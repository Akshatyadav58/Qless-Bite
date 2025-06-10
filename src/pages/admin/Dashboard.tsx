import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ShoppingBag, Users, CreditCard, TrendingUp, Settings, Menu as MenuIcon, Plus } from 'lucide-react';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { Restaurant } from '../../types';
import Card, { CardBody } from '../../components/ui/Card';
import MenuManagement from './MenuManagement';
import OrderManagement from './OrderManagement';
import RestaurantManagement from './RestaurantManagement';
import Button from '../../components/ui/Button';
import { addRestaurant } from '../../firebase/seedData';

const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'settings'>('orders');
  const [addingRestaurant, setAddingRestaurant] = useState(false);
  
  const fetchRestaurants = async () => {
    try {
      if (!userProfile) return;
      
      let restaurantsQuery;
      
      if (userProfile.role === 'admin') {
        restaurantsQuery = query(collection(db, 'restaurants'));
      } else if (userProfile.role === 'vendor') {
        restaurantsQuery = query(
          collection(db, 'restaurants'),
          where('vendorId', '==', userProfile.uid)
        );
      } else {
        setRestaurants([]);
        setLoading(false);
        return;
      }
      
      const restaurantsSnapshot = await getDocs(restaurantsQuery);
      const restaurantsData = restaurantsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Restaurant[];
      
      setRestaurants(restaurantsData);
      
      if (restaurantsData.length > 0) {
        setSelectedRestaurant(restaurantsData[0]);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRestaurants();
  }, [userProfile]);

  const handleAddRestaurant = async () => {
    if (!userProfile) return;
    
    try {
      setAddingRestaurant(true);
      await addRestaurant(userProfile.uid);
      await fetchRestaurants();
    } catch (error) {
      console.error('Error adding restaurant:', error);
    } finally {
      setAddingRestaurant(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!userProfile || (userProfile.role !== 'admin' && userProfile.role !== 'vendor')) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 p-4 rounded-md text-red-700">
          <h2 className="text-lg font-medium">Access Denied</h2>
          <p className="mt-1">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }
  
  if (restaurants.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to the Dashboard</h2>
          <p className="text-gray-600 mb-8">You don't have any restaurants yet. Let's add your first restaurant.</p>
          <Button
            variant="primary"
            onClick={handleAddRestaurant}
            isLoading={addingRestaurant}
            leftIcon={<Plus className="h-5 w-5" />}
          >
            Add Your First Restaurant
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Restaurant Dashboard</h1>
        <Button
          variant="primary"
          onClick={handleAddRestaurant}
          isLoading={addingRestaurant}
          leftIcon={<Plus className="h-5 w-5" />}
        >
          Add Restaurant
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardBody className="p-0">
              <div className="p-4 border-b border-gray-100">
                <select
                  value={selectedRestaurant?.id}
                  onChange={(e) => {
                    const restaurant = restaurants.find(r => r.id === e.target.value);
                    if (restaurant) {
                      setSelectedRestaurant(restaurant);
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {restaurants.map(restaurant => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <nav className="py-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium ${
                    activeTab === 'orders'
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ShoppingBag className="h-5 w-5 mr-3" />
                  Order Management
                </button>
                
                <button
                  onClick={() => setActiveTab('menu')}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium ${
                    activeTab === 'menu'
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MenuIcon className="h-5 w-5 mr-3" />
                  Menu Management
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium ${
                    activeTab === 'settings'
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Restaurant Settings
                </button>
              </nav>
            </CardBody>
          </Card>
          
          {/* Stats Cards */}
          <div className="mt-6 space-y-4">
            <Card>
              <CardBody className="p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-primary-100 text-primary-600">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Today's Orders</p>
                    <p className="text-2xl font-semibold text-gray-900">12</p>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody className="p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-secondary-100 text-secondary-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Customers</p>
                    <p className="text-2xl font-semibold text-gray-900">48</p>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody className="p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-accent-100 text-accent-600">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">₹632.50</p>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody className="p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Growth</p>
                    <p className="text-2xl font-semibold text-gray-900">+24%</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          <Card>
            <CardBody>
              {selectedRestaurant && (
                <>
                  {activeTab === 'orders' && (
                    <OrderManagement restaurantId={selectedRestaurant.id} />
                  )}
                  
                  {activeTab === 'menu' && (
                    <MenuManagement restaurantId={selectedRestaurant.id} />
                  )}
                  
                  {activeTab === 'settings' && (
                    <RestaurantManagement 
                      restaurant={selectedRestaurant}
                      onUpdate={fetchRestaurants}
                    />
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;