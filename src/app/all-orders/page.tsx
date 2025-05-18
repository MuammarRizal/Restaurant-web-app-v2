"use client";
import useSWR from "swr";
import { motion, AnimatePresence, number } from "framer-motion";
import { Clock, CheckCircle, Utensils, Coffee, Loader2 } from "lucide-react";
import { useState } from "react";

type CartItem = {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  image: string;
  category: "makanan" | "minuman";
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
};

// SWR fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Gagal memuat data pesanan");
  }
  return response.json();
};

const CustomerOrderPage = () => {
  // Use SWR instead of useState and useEffect with polling
  const { data, error, isLoading } = useSWR("/api/cart", fetcher, {
    refreshInterval: 5000, // Revalidate every 5 seconds
    revalidateOnFocus: true,
    dedupingInterval: 2000
  });

  console.log(data)
  // Group orders by user and find the first food image
  const groupOrdersByUser = () => {
    if (!data || !data.data) return [];
    
    const orders = data.data;
    const userOrders: Record<string, { 
      order: Order; 
      items: CartItem[];
      foodImage: string | null;
      mostRecentTimestamp: number;
    }> = {};

    orders.forEach((order: any) => {
      const username = order.user.username || "Pelanggan";
      if (!userOrders[username]) {
        // Find first food item for image
        const foodItem = order.cart.find((item: any) => item.category === "makanan");
        
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
      
      order.cart.forEach((item: any) => {
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

  // Calculate time information
  const getTimeInfo = (createdAt: { seconds: number }) => {
    const now = Math.floor(Date.now() / 1000);
    const minutes = Math.floor((now - createdAt.seconds) / 60);
    return `${minutes} menit lalu`;
  };

  // Filter items by status
  const filterItemsByStatus = (items: CartItem[], statuses: string[]) => {
    return items.filter(item => statuses.includes(item.status));
  };

  // Get all waiting items (pending or preparing)
  const getWaitingOrders = () => {
    return groupOrdersByUser().filter(({ items }) => 
      items.some(item => item.status === "pending" || item.status === "preparing")
    );
  };

  // Get all completed items (ready or delivered)
  const getCompletedOrders = () => {
    return groupOrdersByUser().filter(({ items }) => 
      items.some(item => item.status === "ready" || item.status === "delivered")
    );
  };

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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Status Pesanan Anda</h1>
          <p className="text-gray-600">Lacak semua pesanan Anda di sini</p>
        </motion.div>

        {/* Order Status Sections */}
        <div className="space-y-10">
          {/* Waiting Orders */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-yellow-500" />
              Pesanan Menunggu ({getWaitingOrders().length})
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {getWaitingOrders().map(({ order, items, foodImage }) => {
                  const waitingItems = filterItemsByStatus(items, ["pending", "preparing"]);
                  
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`bg-white rounded-lg shadow-sm border-l-4 ${statusConfig.waiting.border} p-4 h-full`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-sm">Order ID : <b>{order.id}</b></h3>
                          <p className="text-xs font-semibold text-gray-600">
                            {order?.user?.username || "Pelanggan"} • {order?.user?.table ? `Meja ${order.user.table}` : "Take Away"}
                          </p>
                        </div>
                        {statusConfig.waiting.icon}
                      </div>

                      <div className="flex flex-col">
                        <div className="w-full h-24 rounded-md overflow-hidden mb-2">
                          <img
                            src={foodImage || "https://via.placeholder.com/300x200?text=Makanan"}
                            alt="Makanan"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Makanan";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <ul className="space-y-2">
                            {waitingItems.map((item) => (
                              <li key={item.id} className="text-sm">
                                <div className="flex items-start">
                                  <span className="mr-2 mt-0.5">
                                    {item.category === "makanan" ? (
                                      <Utensils className="w-3 h-3 text-orange-500" />
                                    ) : (
                                      <Coffee className="w-3 h-3 text-blue-500" />
                                    )}
                                  </span>
                                  <span>
                                    {item.quantity}x {item.name}
                                    <p className="text-xs text-gray-500 mt-1 bg-blue-50 p-2 rounded">
                                      📝 {item.notes || "Tidak ada catatan"}
                                    </p>
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mt-2">
                        {getTimeInfo(order.createdAt)}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {getWaitingOrders().length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-center"
              >
                <p className="text-yellow-800">Tidak ada pesanan yang menunggu</p>
              </motion.div>
            )}
          </div>

          {/* Completed Orders */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
              Pesanan Selesai ({getCompletedOrders().length})
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {getCompletedOrders().map(({ order, items, foodImage }) => {
                  const completedItems = filterItemsByStatus(items, ["ready", "delivered"]);
                  
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`bg-white rounded-lg shadow-sm border-l-4 ${statusConfig.completed.border} p-4 h-full`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-sm">#{order.id.slice(0, 8)}</h3>
                          <p className="text-xs font-semibold text-gray-600">
                            {order.user.username || "Pelanggan"} • {order.user.table || "Take Away"}
                          </p>
                        </div>
                        {statusConfig.completed.icon}
                      </div>

                      <div className="flex flex-col">
                        <div className="w-full h-24 rounded-md overflow-hidden mb-2">
                          <img
                            src={foodImage || "https://via.placeholder.com/300x200?text=Makanan"}
                            alt="Makanan"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <ul className="space-y-2">
                            {completedItems.map((item) => (
                              <li key={item.id} className="text-sm">
                                <div className="flex items-start">
                                  <span className="mr-2 mt-0.5">
                                    {item.category === "makanan" ? (
                                      <Utensils className="w-3 h-3 text-orange-500" />
                                    ) : (
                                      <Coffee className="w-3 h-3 text-blue-500" />
                                    )}
                                  </span>
                                  <span>
                                    {item.quantity}x {item.name}
                                    <p className="text-xs text-gray-500 mt-1 bg-blue-50 p-2 rounded">
                                      📝 {item.notes || "Tidak ada catatan"}
                                    </p>
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mt-2">
                        {getTimeInfo(order.createdAt)}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {getCompletedOrders().length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-50 border border-green-100 rounded-lg p-4 text-center"
              >
                <p className="text-green-800">Belum ada pesanan yang selesai</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderPage;