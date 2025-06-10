import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Clock, MapPin, Filter } from 'lucide-react';
import { db } from '../../firebase/config';
import { MenuItem, Restaurant } from '../../types';
import MenuItemCard from './MenuItemCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const RestaurantPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Extract unique categories from menu items
  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  
  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        if (!id) return;
        
        // Fetch restaurant details
        const restaurantDoc = await getDoc(doc(db, 'restaurants', id));
        
        if (!restaurantDoc.exists()) {
          console.error('Restaurant not found');
          setLoading(false);
          return;
        }
        
        const restaurantData = { id: restaurantDoc.id, ...restaurantDoc.data() } as Restaurant;
        setRestaurant(restaurantData);
        
        // Fetch menu items for this restaurant
        const menuItemsQuery = query(
          collection(db, 'menuItems'),
          where('restaurantId', '==', id)
        );
        
        const menuItemsSnapshot = await getDocs(menuItemsQuery);
        const menuItemsData = menuItemsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as MenuItem[];
        
        setMenuItems(menuItemsData);
        setFilteredItems(menuItemsData);
      } catch (error) {
        console.error('Error fetching restaurant and menu:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurantAndMenu();
  }, [id]);
  
  useEffect(() => {
    // Filter menu items based on search term and active category
    const filtered = menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredItems(filtered);
  }, [searchTerm, activeCategory, menuItems]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Restaurant not found</h2>
        <p className="text-gray-600 mb-8">The restaurant you're looking for doesn't exist or has been removed.</p>
        <Button variant="primary" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      {/* Restaurant Header */}
      <div className="relative h-64 sm:h-80 md:h-96 bg-gray-900">
        <div className="absolute inset-0">
          <img 
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">{restaurant.name}</h1>
            
            <div className="flex flex-wrap gap-4 items-center text-sm sm:text-base">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-primary-300" />
                <span>{restaurant.location}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-primary-300" />
                <span>{restaurant.openingHours.open} - {restaurant.openingHours.close}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menu Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Menu</h2>
          <p className="text-gray-600">{restaurant.description}</p>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/2">
            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={handleSearchChange}
              leftIcon={<Filter className="h-5 w-5" />}
              fullWidth
            />
          </div>
          
          <div className="w-full md:w-1/2 flex overflow-x-auto py-1 hide-scrollbar">
            <div className="flex space-x-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Menu Items */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <MenuItemCard key={item.id} item={item} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantPage;