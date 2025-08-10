import axios from "axios";
import { useState } from "react";
import useSWR, { mutate } from "swr";

export default function ModalForm({ data }: { data: any }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: data.name,
    quantity: data.quantity,
    category: data.category,
    dessert: data.dessert,
    label: data.label,
    image: data.image,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/api/menus/${data.id}`, formData);
    } catch (error) {
      console.log(error);
    } finally {
      mutate("/api/menus");
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="cursor-pointer bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
      >
        Update Menu
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            {/* Header Modal */}
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold">Update Menu</h2>
              <button
                onClick={() => setShowModal(false)}
                className="cursor-pointer text-gray-600 hover:text-red-500 text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nama Menu */}
                <div>
                  <label className="block text-gray-700 mb-2">Nama Menu</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                {/* Quantity */}
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

                {/* Kategori */}
                <div>
                  <label className="block text-gray-700 mb-2">Kategori</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="makanan">Makanan</option>
                    <option value="minuman">Minuman</option>
                  </select>
                </div>

                {/* Conditional Input */}
                {formData.category === "makanan" ? (
                  <div>
                    <label className="block text-gray-700 mb-2">Dessert</label>
                    <input
                      type="text"
                      name="dessert"
                      value={formData.dessert}
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
                      value={formData.label}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Pilih</option>
                      <option value="tea">Tea</option>
                      <option value="coffee">Coffee</option>
                      <option value="non-coffee">Non Coffee</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Image URL */}
              <div className="mt-4">
                <label className="block text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="https://examples.com/image.jpg"
                  required
                />
              </div>

              {/* Tombol Submit */}
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cursor-pointer bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded mr-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`${
                    loading
                      ? "bg-red-400 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white px-4 py-2 rounded cursor-pointer`}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Update Menu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
