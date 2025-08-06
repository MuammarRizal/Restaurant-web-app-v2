"use client";

import { useState, useEffect } from "react";
import FoodItem from "./FoodItem";
import AddFoodForm from "./AddFoodForm";
import axios from "axios";

type FoodItem = {
  id: number | string;
  name: string;
  description: string;
  image: string;
  quantity: number;
  category: string;
};

const AdminDashboard = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log(foods);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/menus");
        setFoods(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  console.log(foods);
  const handleAddFood = (newFood: any) => {
    console.log({ newFood });
    setFoods((prev) => [...prev, newFood]);
  };

  const handleDeleteFood = (id: any) => {
    setFoods((prev) => prev.filter((food) => food.id !== id));
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
              {foods.filter((food) => food.category === "main").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-gray-500">Minuman</h3>
            <p className="text-3xl font-bold">
              {foods.filter((food) => food.category === "drink").length}
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
          <p className="text-gray-500">
            Belum ada menu makanan. Silakan tambahkan menu.
          </p>
        ) : (
          <div className="space-y-4">
            {foods.map((food) => (
              <FoodItem key={food.id} food={food} onDelete={handleDeleteFood} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
