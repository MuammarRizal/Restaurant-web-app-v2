"use client";
import axios from "axios";
import { useState } from "react";
import { mutate } from "swr";
const AddFoodForm = ({ onAddFood }: any) => {
  const [category, setCategory] = useState("makanan");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    quantity: "",
    category: "makanan",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "category") {
      setCategory(value);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const isConfirmed = window.confirm(
      "Apakah Anda yakin ingin memasukkan pesanan?"
    );
    if (!isConfirmed) return;
    try {
      setLoading(true);
      const { data } = await axios.post("/api/menus", {
        ...formData,
        quantity: parseFloat(formData.quantity),
        id: Date.now(),
      });
      if (data.message === "Data sudah ada") {
        alert(`Makanan/Minuman ${data.data.name} Sudah Ada`);
        return;
      }
      setFormData({
        name: "",
        image: "",
        quantity: "",
        category: "makanan",
      });

      setCategory("makanan");
      if (e.target.dessert) {
        e.target.dessert.value = "";
      }
      mutate("/api/menus");
      setFormData({
        name: "",
        image: "",
        quantity: "",
        category: "makanan",
      });

      setCategory("makanan");
      if (e.target.dessert) {
        e.target.dessert.value = "";
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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
            onChange={handleChange}
            value={category}
            className="w-full p-2 border rounded"
          >
            <option value="makanan">Makanan</option>
            <option value="minuman">Minuman</option>
          </select>
        </div>

        {/* JIKA KATEGORI NYA MINUMAN MAKA TAMPILKAN INI */}
        {category === "makanan" ? (
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
              required
              className="w-full p-2 border rounded"
            >
              <option>Pilih</option>
              <option value="tea">Tea</option>
              <option value="coffee">Coffee</option>
              <option value="non-coffee">Non Coffee</option>
            </select>
          </div>
        )}
      </div>
      <div>
        <label className="block text-gray-700 mt-2">Image URL</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="https://examples.com/image.jpg | Ambil Dari google (Copy Image Address)"
          required
        />
      </div>
      <button
        type="submit"
        className={`${
          loading
            ? "bg-red-400 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700"
        } mt-4  text-white px-4 py-2 rounded `}
        disabled={loading}
      >
        {loading ? "Loading" : "Tambahkan Menu"}
      </button>
    </form>
  );
};

export default AddFoodForm;
