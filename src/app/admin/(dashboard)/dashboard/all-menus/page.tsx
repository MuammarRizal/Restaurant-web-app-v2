"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface Menu {
  name: string;
  quantity: number;
  category: string;
  label?: string;
  image: string;
}

const AllMenus = () => {
  const [menus, setMenus] = useState<Menu[]>();
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data, isLoading, error } = useSWR("/api/menus", fetcher);

  useEffect(() => {
    if (data && data.data) {
      setMenus(data.data);
    }
  }, [data]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📋 All Menus</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus?.map((menu, idx) => (
          <div
            key={idx}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Gambar */}
            <div className="relative w-full h-48">
              <img
                src={menu.image}
                alt={menu.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Konten */}
            <div className="p-4 mt-2">
              <h2 className="text-lg font-semibold text-gray-800">
                {menu.name}
              </h2>

              <p className="text-sm text-gray-500 capitalize">
                {menu.category}
                {menu.label && ` • ${menu.label}`}
              </p>

              <div className="mt-3 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Stock: {menu.quantity}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMenus;
