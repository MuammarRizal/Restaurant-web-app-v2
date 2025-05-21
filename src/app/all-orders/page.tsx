"use client";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, Utensils, Coffee, Loader2, Cake } from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  image: string;
  category: "makanan" | "minuman";
  label?: string;
  dessert?: string;
  status: "pending" | "preparing" | "ready" | "delivered";
};

type Order = {
  id: string;
  user: {
    username: string;
    table: string;
  };
  cart: CartItem[];
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  isReady: boolean;
  updatedAt?: {
    seconds: number;
    nanoseconds: number;
  };
};

// SWR fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Gagal memuat data pesanan");
  }
  return response.json();
};

// Helper function to capitalize each word
const capitalizeEachWord = (str: string) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const CustomerOrderPage = () => {
  const { data, error, isLoading } = useSWR("/api/cart", fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
    dedupingInterval: 2000
  });

  // Status configuration
  const statusConfig = {
    waiting: {
      icon: <Clock className="w-5 h-5" />,
      color: "bg-yellow-100 text-yellow-800",
      border: "border-yellow-300",
      label: "Menunggu",
      description: "Pesanan Anda sedang diproses"
    },
    completed: {
      icon: <CheckCircle className="w-5 h-5" />,
      color: "bg-green-100 text-green-800",
      border: "border-green-300",
      label: "Selesai",
      description: "Pesanan Anda sudah selesai"
    }
  };

  // Group orders by user and find the first food image
  const groupOrdersByUser = () => {
    if (!data || !data.data) return [];
    
    const orders = data.data as Order[];
    const userOrders: Record<string, { 
      order: Order; 
      items: CartItem[];
      foodImage: string | null;
      mostRecentTimestamp: number;
    }> = {};

    orders.forEach((order) => {
      const username = order.user.username || "Pelanggan";
      if (!userOrders[username]) {
        // Find first food item for image
        const foodItem = order.cart.find(item => item.category === "makanan");
        
        userOrders[username] = {
          order: {
            ...order,
            cart: [] // We'll handle items separately
          },
          items: [],
          foodImage: foodItem?.image || null,
          mostRecentTimestamp: order.createdAt.seconds
        };
      } else if (order.createdAt.seconds > userOrders[username].mostRecentTimestamp) {
        // Update timestamp if this order is more recent
        userOrders[username].mostRecentTimestamp = order.createdAt.seconds;
      }
      
      order.cart.forEach((item) => {
        userOrders[username].items.push(item);
        // Update food image if we find one later
        if (item.category === "makanan" && !userOrders[username].foodImage) {
          userOrders[username].foodImage = item.image;
        }
      });
    });

    // Convert to array and sort by most recent timestamp
    return Object.values(userOrders).sort((a, b) => b.mostRecentTimestamp - a.mostRecentTimestamp);
  };

  // Calculate time information
  const getTimeInfo = (createdAt: { seconds: number }) => {
    const now = Math.floor(Date.now() / 1000);
    const minutes = Math.floor((now - createdAt.seconds) / 60);
    return `${minutes} menit lalu`;
  };

  // Get all waiting orders (isReady: false)
  const getWaitingOrders = () => {
    return groupOrdersByUser().filter(({ order }) => !order.isReady);
  };

  // Get all completed orders (isReady: true)
  const getCompletedOrders = () => {
    return groupOrdersByUser().filter(({ order }) => order.isReady);
  };

  // Render item details with category-specific properties
  const renderItemDetails = (item: CartItem) => (
    <li key={item.id} className="text-sm mb-3 pb-3 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0">
      <div className="flex items-start">
        <span className="mr-2 mt-0.5 p-1 rounded-full bg-gray-100">
          {item.category === "makanan" ? (
            <Utensils className="w-3 h-3 text-orange-500" />
          ) : (
            <Coffee className="w-3 h-3 text-blue-500" />
          )}
        </span>
        <div className="flex-1">
          <div className="flex justify-between">
            <span className="font-medium">{item.quantity}x {item.name}</span>
            {item.status === "ready" && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                Siap
              </span>
            )}
          </div>
          
          {/* Display dessert for food items */}
          {item.category === "makanan" && item.dessert && (
            <div className="flex items-center mt-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-md w-fit">
              <Cake className="w-3 h-3 mr-1" />
              {item.dessert}
            </div>
          )}
          
          {/* Display label for drink items */}
          {item.category === "minuman" && item.label && (
            <div className="flex items-center mt-1 text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-md w-fit">
              {capitalizeEachWord(item.label)}
            </div>
          )}
          
          {/* Notes */}
          {item.notes && (
            <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded border border-gray-100">
              <span className="font-medium">Catatan:</span> {item.notes}
            </p>
          )}
        </div>
      </div>
    </li>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
          <p className="mt-4 text-gray-700">Memuat data pesanan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-700 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-12">
      {/* Gunakan container dengan max-width yang lebih besar dan margin auto untuk layar besar */}
      <div className="max-w-screen-2xl mx-auto relative px-4 sm:px-6 lg:px-8">
        {/* Header dengan width terbatas */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center py-6 max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Status Pesanan</h1>
          <p className="text-gray-600">Lacak semua pesanan Anda di sini</p>
        </motion.div>

        {/* Order Status Sections */}
        <div className="space-y-12">
          {/* Waiting Orders */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-yellow-500" />
              Pesanan Menunggu ({getWaitingOrders().length})
            </h2>
            
            {/* Grid dengan jumlah kolom yang lebih banyak untuk layar besar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
              <AnimatePresence>
                {getWaitingOrders().map(({ order, items, foodImage }) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-sm border-l-4 border-yellow-300 overflow-hidden h-full"
                  >
                    {/* Card Header */}
                    <div className="bg-yellow-50 px-4 py-3 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-yellow-800 font-medium flex items-center">
                          {statusConfig.waiting.icon}
                          <span className="ml-1">Sedang Diproses</span>
                        </p>
                        <h3 className="font-medium text-sm">Order #{order.id.slice(0, 8)}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-gray-700">
                          {order.user.username || "Pelanggan"}
                        </p>
                        <p className="text-xs text-gray-600">
                          {order.user.table ? `Meja ${order.user.table}` : "Take Away"}
                        </p>
                      </div>
                    </div>

                    {/* Food Image */}
                    <div className="w-full h-36 relative">
                      <img
                        src={foodImage || "https://cdn1.sisiplus.co.id/media/sisiplus/asset/uploads/artikel/0RzAgdXcgFYiIJEicyob41baAMoKFFIJP4FG3tOj.jpg"}
                        alt="Makanan"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://cdn1.sisiplus.co.id/media/sisiplus/asset/uploads/artikel/0RzAgdXcgFYiIJEicyob41baAMoKFFIJP4FG3tOj.jpg";
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <p className="text-white text-xs">
                          {getTimeInfo(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-4">
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">Daftar Pesanan:</h4>
                      <ul className="divide-y divide-gray-100">
                        {items.map(renderItemDetails)}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {getWaitingOrders().length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-yellow-50 border border-yellow-100 rounded-xl p-8 text-center max-w-4xl mx-auto"
              >
                <div className="text-5xl mb-4">🕒</div>
                <p className="text-yellow-800 font-medium">Tidak ada pesanan yang sedang diproses</p>
                <p className="text-yellow-700 text-sm mt-1">Semua pesanan Anda telah selesai</p>
              </motion.div>
            )}
          </section>

          {/* Completed Orders */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
              Pesanan Selesai ({getCompletedOrders().length})
            </h2>
            
            {/* Grid dengan jumlah kolom yang lebih banyak untuk layar besar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
              <AnimatePresence>
                {getCompletedOrders().map(({ order, items, foodImage }) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-sm border-l-4 border-green-300 overflow-hidden h-full"
                  >
                    {/* Card Header */}
                    <div className="bg-green-50 px-4 py-3 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-green-800 font-medium flex items-center">
                          {statusConfig.completed.icon}
                          <span className="ml-1">Selesai</span>
                        </p>
                        <h3 className="font-medium text-sm">Order #{order.id.slice(0, 8)}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-gray-700">
                          {order.user.username || "Pelanggan"}
                        </p>
                        <p className="text-xs text-gray-600">
                          {order.user.table ? `Meja ${order.user.table}` : "Take Away"}
                        </p>
                      </div>
                    </div>

                    {/* Food Image */}
                    <div className="w-full h-36 relative">
                      <img
                        src={foodImage || "https://via.placeholder.com/300x200?text=Makanan"}
                        alt="Makanan"
                        className="w-full h-full object-cover brightness-90"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Makanan";
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <p className="text-white text-xs">
                          Selesai: {order.updatedAt ? getTimeInfo(order.updatedAt) : getTimeInfo(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-4">
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">Daftar Pesanan:</h4>
                      <ul className="divide-y divide-gray-100">
                        {items.map(renderItemDetails)}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {getCompletedOrders().length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-50 border border-green-100 rounded-xl p-8 text-center max-w-4xl mx-auto"
              >
                <div className="text-5xl mb-4">📋</div>
                <p className="text-green-800 font-medium">Belum ada pesanan yang selesai</p>
                <p className="text-green-700 text-sm mt-1">Pesanan Anda masih dalam proses</p>
              </motion.div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderPage;