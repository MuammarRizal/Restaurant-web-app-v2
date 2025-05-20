"use client";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, Truck, Coffee, User, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

type DrinkItem = {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  image: string;
  category: string;
  status: "pending" | "ready" | "delivered";
};

type Order = {
  id: string;
  user: {
    username: string;
    table: string;
  };
  cart: DrinkItem[];
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};

// Kunci untuk localStorage
const LS_READY_DRINKS_KEY = "barista_ready_drinks";
const LS_DELIVERED_DRINKS_KEY = "barista_delivered_drinks";

// SWR fetcher function
const fetcher = (url: string) => axios.get(url).then(res => res.data);

const BaristaPage = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/cart', fetcher, {
    refreshInterval: 5000, // Refresh every 5 seconds
    revalidateOnFocus: true,
  });
  
  const [persistedReadyItems, setPersistedReadyItems] = useState<{orderId: string, itemId: string}[]>([]);
  const [persistedDeliveredItems, setPersistedDeliveredItems] = useState<{orderId: string, itemId: string}[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const savedReadyItems = localStorage.getItem(LS_READY_DRINKS_KEY);
      if (savedReadyItems) {
        setPersistedReadyItems(JSON.parse(savedReadyItems));
      }
      
      const savedDeliveredItems = localStorage.getItem(LS_DELIVERED_DRINKS_KEY);
      if (savedDeliveredItems) {
        setPersistedDeliveredItems(JSON.parse(savedDeliveredItems));
      }
    } catch (err) {
      console.error("Error loading data from localStorage:", err);
    }
  }, []);

  // Process orders data with localStorage status
  const processOrders = (orders: Order[]) => {
    if (!orders) return [];
    
    return orders.map(order => {
      const processedCart = order.cart.map(item => {
        // Cek apakah item ini ada di daftar ready yang tersimpan
        const isReady = persistedReadyItems.some(
          pi => pi.orderId === order.id && pi.itemId === item.id
        );
        
        // Cek apakah item ini ada di daftar delivered yang tersimpan
        const isDelivered = persistedDeliveredItems.some(
          pi => pi.orderId === order.id && pi.itemId === item.id
        );
        
        // Terapkan status berdasarkan prioritas (delivered > ready > original)
        if (isDelivered) {
          return { ...item, status: "delivered" };
        } else if (isReady) {
          return { ...item, status: "ready" };
        }
        return item;
      });
      
      return { ...order, cart: processedCart };
    });
  };

  const orders = processOrders(data?.data || []);

  // Action handlers dengan penyimpanan ke localStorage
  const updateItemStatus = async (orderId: string, itemId: string, newStatus: "pending" | "ready" | "delivered") => {
    if (!confirm("Apa anda yakin?")) {
      return;
    }
    
    try {
      // Update localStorage based on status
      if (newStatus === "ready") {
        const updatedReadyItems = [...persistedReadyItems, { orderId, itemId }];
        setPersistedReadyItems(updatedReadyItems);
        localStorage.setItem(LS_READY_DRINKS_KEY, JSON.stringify(updatedReadyItems));
      } else if (newStatus === "delivered") {
        const updatedDeliveredItems = [...persistedDeliveredItems, { orderId, itemId }];
        setPersistedDeliveredItems(updatedDeliveredItems);
        localStorage.setItem(LS_DELIVERED_DRINKS_KEY, JSON.stringify(updatedDeliveredItems));
      }
      
      // Optimistically update the UI
      mutate({
        ...data,
        data: data.data.map((order: Order) => {
          if (order.id === orderId) {
            return {
              ...order,
              cart: order.cart.map(item => {
                if (item.id === itemId) {
                  return { ...item, status: newStatus };
                }
                return item;
              })
            };
          }
          return order;
        })
      }, false); // Don't revalidate immediately
      
      // Send to server (uncomment when ready)
      // await axios.patch(`/api/cart/${orderId}/items/${itemId}`, {
      //   status: newStatus
      // });
      
      // Revalidate data
      mutate();
    } catch (err) {
      console.error("Error updating item status:", err);
      alert("Gagal memperbarui status. Silakan coba lagi.");
    }
  };

  // Clear localStorage function
  const clearLocalStorage = () => {
    if (confirm("Hapus semua data tersimpan? Ini akan mengembalikan semua pesanan ke status aslinya.")) {
      localStorage.removeItem(LS_READY_DRINKS_KEY);
      localStorage.removeItem(LS_DELIVERED_DRINKS_KEY);
      setPersistedReadyItems([]);
      setPersistedDeliveredItems([]);
      mutate(); // Revalidate data
    }
  };

  // Filter drink items by status
  const getDrinkItemsByStatus = (status: string) => {
    const items: { order: Order; item: DrinkItem }[] = [];
    
    orders.forEach(order => {
      order.cart.forEach(item => {
        if (item.status === status && item.category === "minuman") {
          items.push({ order, item });
        }
      });
    });
    
    // Sort by createdAt timestamp (newest first)
    return items.sort((a, b) => b.order.createdAt.seconds - a.order.createdAt.seconds);
  };

  // Status styling
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    ready: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800"
  };

  const statusIcons = {
    pending: <Clock className="w-4 h-4" />,
    ready: <CheckCircle className="w-4 h-4" />,
    delivered: <Truck className="w-4 h-4" />
  };

  // Calculate minutes since order was created
  const getMinutesSince = (seconds: number) => {
    const now = Math.floor(Date.now() / 1000);
    return Math.floor((now - seconds) / 60);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-brown-600 animate-spin" />
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
          <p className="text-gray-700 mb-4">Gagal memuat data pesanan. Silakan coba lagi.</p>
          <button
            onClick={() => mutate()}
            className="bg-brown-500 text-white px-4 py-2 rounded hover:bg-brown-600 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Coffee className="w-8 h-8 text-brown-600 mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Sistem Pesanan Minuman</h1>
          </div>
          <button
            onClick={clearLocalStorage}
            className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded transition-colors"
            title="Reset data tersimpan di perangkat ini"
          >
            Reset Data Lokal
          </button>
        </div>

        {/* Order Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pending Orders */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-yellow-200">
            <div className="bg-yellow-500 px-4 py-3">
              <h2 className="text-white font-semibold flex items-center">
                <Clock className="mr-2" /> Menunggu ({getDrinkItemsByStatus("pending").length})
              </h2>
            </div>
            <div className="p-4 space-y-4 min-h-[400px]">
              <AnimatePresence>
                {getDrinkItemsByStatus("pending").map(({ order, item }) => (
                  <motion.div
                    key={`${order.id}-${item.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Customer Info */}
                    <div className="flex items-center mb-3">
                      <User className="w-5 h-5 text-gray-500 mr-2" />
                      <div>
                        <h3 className="font-bold">{order.user.username || "Pelanggan"}</h3>
                        <p className="text-sm text-gray-500">
                          {order.user.table ? `Meja ${order.user.table}` : "Take Away"}
                        </p>
                      </div>
                    </div>

                    {/* Drink Image */}
                    <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Minuman";
                        }}
                      />
                    </div>

                    {/* Order Item */}
                    <div className="text-sm mb-3">
                      <div className="flex justify-between">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {getMinutesSince(order.createdAt.seconds)} mnt
                        </span>
                      </div>
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-1 bg-blue-50 p-2 rounded">
                          📝 {item.notes}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => updateItemStatus(order.id, item.id, "ready")}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Tandai Siap Antar
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {getDrinkItemsByStatus("pending").length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Tidak ada pesanan minuman
                </div>
              )}
            </div>
          </div>

          {/* Ready Orders */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
            <div className="bg-blue-500 px-4 py-3">
              <h2 className="text-white font-semibold flex items-center">
                <CheckCircle className="mr-2" /> Siap Antar ({getDrinkItemsByStatus("ready").length})
              </h2>
            </div>
            <div className="p-4 space-y-4 min-h-[400px]">
              <AnimatePresence>
                {getDrinkItemsByStatus("ready").map(({ order, item }) => (
                  <motion.div
                    key={`${order.id}-${item.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Customer Info */}
                    <div className="flex items-center mb-3">
                      <User className="w-5 h-5 text-gray-500 mr-2" />
                      <div>
                        <h3 className="font-bold">{order.user.username || "Pelanggan"}</h3>
                        <p className="text-sm text-gray-500">
                          {order.user.table ? `Meja ${order.user.table}` : "Take Away"}
                        </p>
                      </div>
                    </div>

                    {/* Drink Image */}
                    <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Minuman";
                        }}
                      />
                    </div>

                    {/* Order Item */}
                    <div className="text-sm mb-3">
                      <div className="flex justify-between">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {getMinutesSince(order.createdAt.seconds)} mnt
                        </span>
                      </div>
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-1 bg-blue-50 p-2 rounded">
                          📝 {item.notes}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => updateItemStatus(order.id, item.id, "delivered")}
                      className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      Tandai Sudah Diantar
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {getDrinkItemsByStatus("ready").length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Tidak ada pesanan minuman
                </div>
              )}
            </div>
          </div>

          {/* Delivered Orders */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-green-200">
            <div className="bg-green-500 px-4 py-3">
              <h2 className="text-white font-semibold flex items-center">
                <Truck className="mr-2" /> Sudah Diantar ({getDrinkItemsByStatus("delivered").length})
              </h2>
            </div>
            <div className="p-4 space-y-4 min-h-[400px]">
              <AnimatePresence>
                {getDrinkItemsByStatus("delivered").map(({ order, item }) => (
                  <motion.div
                    key={`${order.id}-${item.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-green-50/30"
                  >
                    {/* Customer Info */}
                    <div className="flex items-center mb-3">
                      <User className="w-5 h-5 text-gray-500 mr-2" />
                      <div>
                        <h3 className="font-bold">{order.user.username || "Pelanggan"}</h3>
                        <p className="text-sm text-gray-500">
                          {order.user.table ? `Meja ${order.user.table}` : "Take Away"}
                        </p>
                      </div>
                    </div>

                    {/* Drink Image */}
                    <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Minuman";
                        }}
                      />
                    </div>

                    {/* Order Item */}
                    <div className="text-sm mb-3">
                      <div className="flex justify-between">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {getMinutesSince(order.createdAt.seconds)} mnt
                        </span>
                      </div>
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-1 bg-blue-50 p-2 rounded">
                          📝 {item.notes}
                        </p>
                      )}
                    </div>

                    <div className="text-center text-green-600 text-sm py-2">
                      <CheckCircle className="inline mr-1" /> Sudah diantar
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {getDrinkItemsByStatus("delivered").length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Tidak ada pesanan minuman
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaristaPage;