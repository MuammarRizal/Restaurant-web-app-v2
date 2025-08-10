"use client";

import { useState, useEffect } from "react";
import FoodItem from "./FoodItem";
import AddFoodForm from "./AddFoodForm";
import axios from "axios";
import useSWR, { mutate } from "swr";

type FoodItem = {
  id: number | string;
  name: string;
  description: string;
  image: string;
  quantity: number;
  category: string;
  dessert?: string;
  label?: string;
};

const AdminDashboard = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);

  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data, isLoading, error } = useSWR("/api/menus", fetcher);

  useEffect(() => {
    if (data && data.data) {
      setFoods(data.data);
    }
  }, [data]);

  const handleDeleteFood = async (id: string) => {
    const isConfirmed = confirm("Yakin ingin menghapus Data ? ");
    if (isConfirmed) {
      await axios.post(`/api/menus/${id}`);
      mutate("/api/menus");
    }
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
              {foods.filter((food) => food.category === "makanan").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-gray-500">Minuman</h3>
            <p className="text-3xl font-bold">
              {foods.filter((food) => food.category === "minuman").length}
            </p>
          </div>
        </div>
      </div>

      <AddFoodForm />

      <div>
        <h2 className="text-xl font-bold mb-4">Daftar Menu</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : foods.length === 0 ? (
          <p className="text-gray-500">
            Belum ada menu makanan. Silakan tambahkan menu.
          </p>
        ) : (
          <>
            <div>
              <h3 className="text-lg font-semibold mt-6 mb-2">Makanan</h3>
              <div className="space-y-4">
                {foods
                  .filter((food) => food.category === "makanan")
                  .map((food) => (
                    <FoodItem
                      key={food.id}
                      food={food}
                      onDelete={handleDeleteFood}
                    />
                  ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mt-6 mb-2">Minuman</h3>
              <div className="space-y-4">
                {foods
                  .filter((food) => food.category === "minuman")
                  .map((food) => (
                    <FoodItem
                      key={food.id}
                      food={food}
                      onDelete={handleDeleteFood}
                    />
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
