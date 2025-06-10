import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Search } from 'lucide-react';
import { db } from '../../firebase/config';
import { Restaurant } from '../../types';
import RestaurantCard from './RestaurantCard';
import Input from '../../components/ui/Input';
import HeroBanner from './HeroBanner';

const HomePage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Get all unique tags from restaurants
  const allTags = restaurants
    .flatMap(restaurant => restaurant.tags)
    .filter((tag, index, self) => self.indexOf(tag) === index);
  
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const restaurantsCollection = collection(db, 'restaurants');
        const restaurantsSnapshot = await getDocs(restaurantsCollection);
        
        const restaurantsData = restaurantsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Restaurant[];
        
        setRestaurants(restaurantsData);
        setFilteredRestaurants(restaurantsData);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurants();
  }, []);
  
  useEffect(() => {
    // Filter restaurants based on search term and selected tag
    const filtered = restaurants.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTag = selectedTag ? restaurant.tags.includes(selectedTag) : true;
      
      return matchesSearch && matchesTag;
    });
    
    setFilteredRestaurants(filtered);
  }, [searchTerm, selectedTag, restaurants]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };
  
  return (
    <div>
      <HeroBanner />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Canteen</h2>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-1/2">
              <Input
                placeholder="Search by name, location, or cuisine..."
                value={searchTerm}
                onChange={handleSearchChange}
                leftIcon={<Search className="h-5 w-5" />}
                fullWidth
              />
            </div>
            
            <div className="w-full md:w-1/2 flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No canteens found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;