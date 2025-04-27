"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
};

type CartItem = MenuItem & {
  quantity: number;
  notes?: string;
};

const Menus = () => {
  // Menu data with additional items
  const menuItems: MenuItem[] = [
    // Makanan
    { id: 1, name: "Nasi Goreng Spesial", price: 25000, category: "Makanan", image: "https://sanex.co.id/wp-content/uploads/2024/11/2734.jpg" },
    { id: 2, name: "Mie Ayam Jamur", price: 20000, category: "Makanan", image: "https://www.unileverfoodsolutions.co.id/dam/global-ufs/mcos/SEA/calcmenu/recipes/ID-recipes/general/Mie-Ayam-Jamur-Enak-dan-Praktis-/RESEP%20MIE%20AYAM%20JAMUR-header.jpeg" },
    { id: 3, name: "Ayam Bakar Madu", price: 30000, category: "Makanan", image: "https://cdn1-production-images-kly.akamaized.net/vxvwNUeOwrEXXW4vOZN8Dr_WrCc=/800x450/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/4583813/original/020048500_1695287593-WhatsApp_Image_2023-09-21_at_15.18.15.jpeg" },
    { id: 7, name: "Sate Ayam (10 tusuk)", price: 22000, category: "Makanan", image: "https://img-global.cpcdn.com/recipes/5b7a6c1a9d1e4f2a/1200x630cq70/photo.jpg" },
    { id: 8, name: "Gado-Gado", price: 18000, category: "Makanan", image: "https://cdn0-production-images-kly.akamaized.net/4QYciN5XK1X8H6m7uDdX7n0nR6U=/1200x675/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3243004/original/097060800_1601445941-shutterstock_579600934.jpg" },
    { id: 9, name: "Soto Ayam", price: 17000, category: "Makanan", image: "https://cdn0-production-images-kly.akamaized.net/mt8u4L3vLg8WxY9X9Q3g0w0Xx6U=/1200x675/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3243004/original/097060800_1601445941-shutterstock_579600934.jpg" },
    
    // Minuman
    { id: 4, name: "Es Teh Manis", price: 5000, category: "Minuman", image: "https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2021/06/15093247/Ketahui-Fakta-Es-Teh-Manis.jpg" },
    { id: 5, name: "Jus Alpukat", price: 15000, category: "Minuman", image: "https://res.cloudinary.com/dk0z4ums3/image/upload/v1708574230/attached_image/7-manfaat-jus-alpukat-bagi-kesehatan-yang-sayang-untuk-dilewatkan.jpg" },
    { id: 6, name: "Kopi Susu", price: 12000, category: "Minuman", image: "https://www.nescafe.com/id/sites/default/files/2023-08/Jenis-jenis_Kopi_Susu_yang_Enak__Menyegarkan._Sudah_Pernah_Coba_hero.jpg" },
    { id: 10, name: "Es Jeruk", price: 8000, category: "Minuman", image: "https://asset.kompas.com/crops/6zW6zQJQ5hJg4i8z5V5Z5X5X5X5=/1200x675/smart/filters:quality(75):strip_icc():format(webp)/media/2021/06/15/es-jeruk-nipis.jpg" },
    { id: 11, name: "Es Campur", price: 12000, category: "Minuman", image: "https://cdn0-production-images-kly.akamaized.net/4QYciN5XK1X8H6m7uDdX7n0nR6U=/1200x675/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3243004/original/097060800_1601445941-shutterstock_579600934.jpg" },
    { id: 12, name: "Air Mineral", price: 3000, category: "Minuman", image: "https://cdn0-production-images-kly.akamaized.net/4QYciN5XK1X8H6m7uDdX7n0nR6U=/1200x675/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3243004/original/097060800_1601445941-shutterstock_579600934.jpg" },
    
    // Dessert
    { id: 13, name: "Pisang Goreng", price: 10000, category: "Dessert", image: "https://cdn0-production-images-kly.akamaized.net/4QYciN5XK1X8H6m7uDdX7n0nR6U=/1200x675/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3243004/original/097060800_1601445941-shutterstock_579600934.jpg" },
    { id: 14, name: "Klepon", price: 8000, category: "Dessert", image: "https://cdn0-production-images-kly.akamaized.net/4QYciN5XK1X8H6m7uDdX7n0nR6U=/1200x675/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3243004/original/097060800_1601445941-shutterstock_579600934.jpg" },
  ];

  // State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const router = useRouter();

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === "Semua" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Categories
  const categories = ["Semua", ...new Set(menuItems.map(item => item.category))];

  // Cart functions
  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const updateNotes = (id: number, newNotes: string) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, notes: newNotes } : item
      )
    );
  };

  // Calculate total
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  useEffect(() => {
    console.log({cart})
  },[cart])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-orange-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Open Kedai</h1>
          <p className="text-sm">Pusat Pelatihan Kerja Daerah Jakarta Selatan</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Menu Section (Left) */}
          <div className="lg:w-2/3 bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex space-x-2 overflow-x-auto pb-2 w-full">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap ${
                      activeCategory === category
                        ? "bg-orange-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Cari menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-auto"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map(item => (
                <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="p-4 bg-orange-50">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-orange-600 font-bold mt-1">Rp {item.price.toLocaleString()}</p>
                    <button
                      onClick={() => addToCart(item)}
                      className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Tambah
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Section (Right) */}
          <div className="lg:w-1/3 bg-white rounded-lg shadow-md p-4 h-fit sticky top-4">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">🛒</span> Keranjang
              {cart.length > 0 && (
                <span className="ml-2 bg-orange-500 text-white text-sm px-2 py-1 rounded-full">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Keranjang kosong</p>
                <p className="text-sm mt-2">Tambahkan menu dari daftar</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {cart.map(item => (
                    <div key={item.id} className="border-b border-gray-100 pb-4">
                      <div className="flex items-start">
                        <div className="w-16 h-16 rounded-md mr-3 flex-shrink-0 overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-orange-600 font-bold">Rp {item.price.toLocaleString()}</p>
                          <div className="flex items-center mt-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-gray-200 rounded-l-md flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="w-10 h-8 bg-gray-100 flex items-center justify-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-gray-200 rounded-r-md flex items-center justify-center"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <textarea
                          placeholder="Catatan untuk item ini (pedas, kurang garam, dll)"
                          value={item.notes || ""}
                          onChange={(e) => updateNotes(item.id, e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Global Notes */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catatan Pesanan (Opsional)
                  </label>
                  <textarea
                    placeholder="Contoh: Bungkus, Makan di tempat, Alamat pengiriman, dll"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                    rows={3}
                  />
                </div>

                <div className="mt-6 border-t border-gray-200 pt-4">
                  <button 
                    className="mt-6 w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    onClick={() => {
                      console.log("Order submitted:", {
                        items: cart,
                        notes,
                        total
                      });
                      // Add your order submission logic here
                      router.push("order-list")
                    }}
                  >
                    Lanjut ke Pembayaran
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menus;