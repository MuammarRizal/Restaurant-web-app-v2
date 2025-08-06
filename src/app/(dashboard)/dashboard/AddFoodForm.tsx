"use client";
import { useState } from "react";
const AddFoodForm = ({ onAddFood }: any) => {
  const [category, setCategory] = useState("food");
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    quantity: "",
    category: "main",
  });

  console.log(category);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "category" && value === "food") {
      setCategory("food");
    } else {
      setCategory("drink");
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onAddFood({
      ...formData,
      quantity: parseFloat(formData.quantity),
      id: Date.now(), // temporary ID
    });
    setFormData({
      name: "",
      image: "",
      quantity: "",
      category: "main",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-md mb-6"
    >
      <h2 className="text-xl font-bold mb-4">Tambah Menu Makanan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-2">Nama Makanan</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Kategori</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="food">Makanan</option>
            <option value="drink">Minuman</option>
          </select>
        </div>

        {/* JIKA KATEGORI NYA MINUMAN MAKA TAMPILKAN INI */}
        {category === "food" ? (
          <div>
            <label className="block text-gray-700 mb-2">Dessert</label>
            <input
              type="text"
              name="dessert"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        ) : (
          <div>
            <label className="block text-gray-700 mb-2">Label</label>
            <select
              name="label"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="tea">Tea</option>
              <option value="coffee">Coffee</option>
              <option value="powder">Powder</option>
            </select>
          </div>
        )}
      </div>
      <div>
        <label className="block text-gray-700 mt-2">Image URL</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="https://examples.com/image.jpg"
          required
        />
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Tambahkan Menu
      </button>
    </form>
  );
};

export default AddFoodForm;
