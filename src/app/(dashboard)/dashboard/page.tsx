'use client'

import { useState, useEffect } from 'react';
import FoodItem from './FoodItem';
import AddFoodForm from './AddFoodForm';

type FoodItem = {
    id: number | string;
    name: string;
    description: string;
    price: number;
    category: string;
}

const AdminDashboard = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from API (in a real app, this would be an API call)
  useEffect(() => {
    const fetchFoods = async () => {
      // Simulate API call
      setTimeout(() => {
        setFoods([
          {
            id: 1,
            name: 'Nasi Goreng Spesial',
            description: 'Nasi goreng dengan telur, ayam, dan sayuran',
            price: 35000,
            category: 'main'
          },
          {
            id: 2,
            name: 'Es Teh Manis',
            description: 'Es teh dengan gula sesuai selera',
            price: 10000,
            category: 'drink'
          }
        ]);
        setIsLoading(false);
      }, 500);
    };

    fetchFoods();
  }, []);

  const handleAddFood = (newFood: any) => {
    setFoods(prev => [...prev, newFood]);
  };

  const handleDeleteFood = (id: any) => {
    setFoods(prev => prev.filter(food => food.id !== id));
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-gray-500">Total Menu</h3>
            <p className="text-3xl font-bold">{foods.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-gray-500">Menu Utama</h3>
            <p className="text-3xl font-bold">
              {foods.filter(food => food.category === 'main').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-gray-500">Minuman</h3>
            <p className="text-3xl font-bold">
              {foods.filter(food => food.category === 'drink').length}
            </p>
          </div>
        </div>
      </div>

      <AddFoodForm onAddFood={handleAddFood} />

      <div>
        <h2 className="text-xl font-bold mb-4">Daftar Menu</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : foods.length === 0 ? (
          <p className="text-gray-500">Belum ada menu makanan. Silakan tambahkan menu.</p>
        ) : (
          <div className="space-y-4">
            {foods.map(food => (
              <FoodItem 
                key={food.id} 
                food={food} 
                onDelete={handleDeleteFood}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;