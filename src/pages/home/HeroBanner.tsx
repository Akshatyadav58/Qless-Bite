import React from 'react';
import { ArrowRight, Clock, Utensils, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const HeroBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Skip the Queue, <br />
              <span className="text-yellow-300">Enjoy Your Meal</span>
            </h1>
            
            <p className="text-lg sm:text-xl opacity-90">
              Pre-order your favorite food from campus canteens and pick it up without waiting in line.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/restaurants">
                <Button 
                  variant="secondary" 
                  size="lg"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Order Now
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-full mr-3">
                  <Clock className="h-5 w-5" />
                </div>
                <p className="font-medium">Save Time</p>
              </div>
              
              <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-full mr-3">
                  <Utensils className="h-5 w-5" />
                </div>
                <p className="font-medium">Fresh Food</p>
              </div>
              
              <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-full mr-3">
                  <CreditCard className="h-5 w-5" />
                </div>
                <p className="font-medium">Easy Payment</p>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-yellow-400 rounded-full opacity-70"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary-500 rounded-full opacity-70"></div>
            
            <div className="relative bg-white p-4 rounded-xl shadow-xl transform rotate-3">
              <img 
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Food delivery" 
                className="rounded-lg w-full h-80 object-cover"
              />
            </div>
            
            <div className="absolute bottom-12 -left-16 bg-white p-4 rounded-lg shadow-lg transform -rotate-6 w-64">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-green-600 text-sm font-medium">Order Ready</span>
              </div>
              <p className="text-gray-800 font-medium">Your lunch is ready for pickup!</p>
              <p className="text-gray-500 text-sm">Collect from counter #3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;