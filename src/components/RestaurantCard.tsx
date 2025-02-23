import React from 'react';
import { Star, Clock, Euro } from 'lucide-react';

interface Restaurant {
  id: number;
  name: string;
  type: string;
  image: string;
  rating: number;
  deliveryTime: string;
  minOrder: string;
}

interface Props {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<Props> = ({ restaurant }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{restaurant.type}</p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span>{restaurant.rating}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-400 mr-1" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center">
            <Euro className="h-4 w-4 text-gray-400 mr-1" />
            <span>Min. {restaurant.minOrder}</span>
          </div>
        </div>

        <button className="mt-4 w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-300">
          View Menu
        </button>
      </div>
    </div>
  );
};

export default RestaurantCard;