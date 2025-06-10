import React from 'react';
import { Clock, MapPin, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { Restaurant } from '../../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`}>
      <Card hoverable className="h-full transition-transform duration-300 hover:scale-[1.02]">
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img 
            src={restaurant.imageUrl} 
            alt={restaurant.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
          
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1 text-primary-500" />
            <span>{restaurant.location}</span>
          </div>
          
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1 text-primary-500" />
            <span>{restaurant.openingHours.open} - {restaurant.openingHours.close}</span>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-1">
            {restaurant.tags.map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
              >
                <Tag className="h-3 w-3 mr-1 text-primary-500" />
                {tag}
              </span>
            ))}
          </div>
          
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {restaurant.description}
          </p>
        </div>
      </Card>
    </Link>
  );
};

export default RestaurantCard;