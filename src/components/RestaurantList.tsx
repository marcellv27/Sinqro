import React from 'react';
import RestaurantCard from './RestaurantCard';

const SAMPLE_RESTAURANTS = [
  {
    id: 1,
    name: "Pizza Palace",
    type: "Italian",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80",
    rating: 4.5,
    deliveryTime: "30-45 min",
    minOrder: "€10.00"
  },
  {
    id: 2,
    name: "Burger House",
    type: "American",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=500&q=80",
    rating: 4.2,
    deliveryTime: "25-40 min",
    minOrder: "€15.00"
  },
  {
    id: 3,
    name: "Sushi Master",
    type: "Japanese",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    deliveryTime: "35-50 min",
    minOrder: "€20.00"
  }
];

const RestaurantList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SAMPLE_RESTAURANTS.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
};

export default RestaurantList;