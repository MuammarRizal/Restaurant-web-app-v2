"use client";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, Truck, Utensils, User, Loader2, Dessert } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

type CartItem = {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  image: string;
  category: string;
  dessert?: string; // Added dessert field
  status: "pending" | "ready" | "delivered";
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

// Fungsi fetcher untuk useSWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Gagal memuat data pesanan');
  }
  return res.json();
};

// Kunci untuk localStorage
const LS_READY_ORDERS_KEY = "kitchen_ready_orders";
const LS_DELIVERED_ORDERS_KEY = "kitchen_delivered_orders";

const KitchenPage = () => {
  const { data: ordersData, error, isLoading, mutate } = useSWR<{ data: Order[] }>('/api/cart', fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  });

  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  const [persistedReadyItems, setPersistedReadyItems] = useState<{orderId: string, itemId: string}[]>([]);
  const [persistedDeliveredItems, setPersistedDeliveredItems] = useState<{orderId: string, itemId: string}[]>([]);

  useEffect(() => {
    try {
      const savedReadyItems = localStorage.getItem(LS_READY_ORDERS_KEY);
      if (savedReadyItems) {
        setPersistedReadyItems(JSON.parse(savedReadyItems));
      }
      
      const savedDeliveredItems = localStorage.getItem(LS_DELIVERED_ORDERS_KEY);
      if (savedDeliveredItems) {
        setPersistedDeliveredItems(JSON.parse(savedDeliveredItems));
      }
    } catch (err) {
      console.error("Error loading data from localStorage:", err);
    }
  }, []);

  useEffect(() => {
    if (ordersData?.data) {
      const processedOrders = JSON.parse(JSON.stringify(ordersData.data)) as Order[];
      
      processedOrders.forEach(order => {
        order.cart.forEach(item => {
          const isReady = persistedReadyItems.some(
            pi => pi.orderId === order.id && pi.itemId === item.id
          );
          
          const isDelivered = persistedDeliveredItems.some(
            pi => pi.orderId === order.id && pi.itemId === item.id
          );
          
          if (isDelivered) {
            item.status = "delivered";
          } else if (isReady) {
            item.status = "ready";
          }
        });
      });
      
      setLocalOrders(processedOrders);
    }
  }, [ordersData, persistedReadyItems, persistedDeliveredItems]);

  const updateItemStatus = async (orderId: string, itemId: string, newStatus: "pending" | "ready" | "delivered") => {
    if (!confirm("Apa anda yakin?")) {
      return;
    }
    
    const updatedOrders = localOrders.map(order => {
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
    });
    
    setLocalOrders(updatedOrders);

    try {
      if (newStatus === "ready") {
        const updatedReadyItems = [...persistedReadyItems, { orderId, itemId }];
        setPersistedReadyItems(updatedReadyItems);
        localStorage.setItem(LS_READY_ORDERS_KEY, JSON.stringify(updatedReadyItems));
      } else if (newStatus === "delivered") {
        const updatedDeliveredItems = [...persistedDeliveredItems, { orderId, itemId }];
        setPersistedDeliveredItems(updatedDeliveredItems);
        localStorage.setItem(LS_DELIVERED_ORDERS_KEY, JSON.stringify(updatedDeliveredItems));
        
        await axios.put('/api/cart', { 
          docId: orderId,
          isReady: true 
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
      }
  
      mutate();
    } catch (err) {
      console.error('Gagal memperbarui status:', err);
      setLocalOrders(ordersData?.data || []);
      alert('Gagal memperbarui status. Silakan coba lagi.');
    }
  };

  const getFoodItemsByStatus = (status: string) => {
    const items: { order: Order; item: CartItem }[] = [];
    
    localOrders.forEach(order => {
      order.cart.forEach(item => {
        if (item.status === status && item.category === "makanan") {
          items.push({ order, item });
        }
      });
    });
    
    return items.sort((a, b) => b.order.createdAt.seconds - a.order.createdAt.seconds);
  };

  const clearLocalStorage = () => {
    if (confirm("Hapus semua data tersimpan? Ini akan mengembalikan semua pesanan ke status aslinya.")) {
      localStorage.removeItem(LS_READY_ORDERS_KEY);
      localStorage.removeItem(LS_DELIVERED_ORDERS_KEY);
      setPersistedReadyItems([]);
      setPersistedDeliveredItems([]);
      mutate();
    }
  };

  const getMinutesSince = (seconds: number) => {
    const now = Math.floor(Date.now() / 1000);
    return Math.floor((now - seconds) / 60);
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
            onClick={() => mutate()}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
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
            <Utensils className="w-8 h-8 text-orange-600 mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Sistem Pesanan Dapur (Makanan)</h1>
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
                <Clock className="mr-2" /> Menunggu ({getFoodItemsByStatus("pending").length})
              </h2>
            </div>
            <div className="p-4 space-y-4 min-h-[400px]">
              <AnimatePresence>
                {getFoodItemsByStatus("pending").map(({ order, item }) => (
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

                    {/* Food Image */}
                    <div className="w-full h-32 mb-3 rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Makanan";
                        }}
                      />
                    </div>

                    {/* Order Item */}
                    <div className="text-sm mb-3">
                      <div className="flex justify-between items-start">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {getMinutesSince(order.createdAt.seconds)} mnt
                        </span>
                      </div>
                      
                      {/* Dessert Information */}
                      {item.dessert && (
                        <div className="flex items-center mt-2 text-sm text-purple-700 bg-purple-50 p-2 rounded">
                          <Dessert className="w-4 h-4 mr-2" />
                          <span>Dessert: {item.dessert}</span>
                        </div>
                      )}
                      
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-2 bg-blue-50 p-2 rounded">
                          📝 Catatan: {item.notes}
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
              {getFoodItemsByStatus("pending").length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Tidak ada pesanan makanan
                </div>
              )}
            </div>
          </div>

          {/* Ready Orders */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
            <div className="bg-blue-500 px-4 py-3">
              <h2 className="text-white font-semibold flex items-center">
                <CheckCircle className="mr-2" /> Siap Antar ({getFoodItemsByStatus("ready").length})
              </h2>
            </div>
            <div className="p-4 space-y-4 min-h-[400px]">
              <AnimatePresence>
                {getFoodItemsByStatus("ready").map(({ order, item }) => (
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

                    {/* Food Image */}
                    <div className="w-full h-32 mb-3 rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Makanan";
                        }}
                      />
                    </div>

                    {/* Order Item */}
                    <div className="text-sm mb-3">
                      <div className="flex justify-between items-start">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {getMinutesSince(order.createdAt.seconds)} mnt
                        </span>
                      </div>
                      
                      {/* Dessert Information */}
                      {item.dessert && (
                        <div className="flex items-center mt-2 text-sm text-purple-700 bg-purple-50 p-2 rounded">
                          <Dessert className="w-4 h-4 mr-2" />
                          <span>Dessert: {item.dessert}</span>
                        </div>
                      )}
                      
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-2 bg-blue-50 p-2 rounded">
                          📝 Catatan: {item.notes}
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
              {getFoodItemsByStatus("ready").length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Tidak ada pesanan makanan
                </div>
              )}
            </div>
          </div>

          {/* Delivered Orders */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-green-200">
            <div className="bg-green-500 px-4 py-3">
              <h2 className="text-white font-semibold flex items-center">
                <Truck className="mr-2" /> Sudah Diantar ({getFoodItemsByStatus("delivered").length})
              </h2>
            </div>
            <div className="p-4 space-y-4 min-h-[400px]">
              <AnimatePresence>
                {getFoodItemsByStatus("delivered").map(({ order, item }) => (
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

                    {/* Food Image */}
                    <div className="w-full h-32 mb-3 rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Makanan";
                        }}
                      />
                    </div>

                    {/* Order Item */}
                    <div className="text-sm mb-3">
                      <div className="flex justify-between items-start">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {getMinutesSince(order.createdAt.seconds)} mnt
                        </span>
                      </div>
                      
                      {/* Dessert Information */}
                      {item.dessert && (
                        <div className="flex items-center mt-2 text-sm text-purple-700 bg-purple-50 p-2 rounded">
                          <Dessert className="w-4 h-4 mr-2" />
                          <span>Dessert: {item.dessert}</span>
                        </div>
                      )}
                      
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-2 bg-blue-50 p-2 rounded">
                          📝 Catatan: {item.notes}
                        </p>
                      )}
                    </div>

                    <div className="text-center text-green-600 text-sm py-2">
                      <CheckCircle className="inline mr-1" /> Sudah diantar
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {getFoodItemsByStatus("delivered").length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Tidak ada pesanan makanan
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenPage;