"use client";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, Truck, Utensils, User, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type CartItem = {
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
  cart: CartItem[];
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};

const KitchenPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("/api/cart");
        setOrders(response.data.data);
      } catch (error: any) {
        console.error("Error fetching orders:", error.message);
        setError("Gagal memuat data pesanan. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Action handlers
  const updateItemStatus = (orderId: string, itemId: string, newStatus: "pending" | "ready" | "delivered") => {
    if (!confirm("Apa anda yakin?")) {
      return;
    }
    
    setOrders(orders.map(order => {
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
    }));
  };

  // Filter orders by status and category (only makanan)
  const getFoodItemsByStatus = (status: string) => {
    const items: { order: Order; item: CartItem }[] = [];
    
    orders.forEach(order => {
      order.cart.forEach(item => {
        if (item.status === status && item.category === "makanan") {
          items.push({ order, item });
        }
      });
    });
    
    return items;
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

  if (loading) {
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
          <p className="text-gray-700 mb-4">{error}</p>
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Utensils className="w-8 h-8 text-orange-600 mr-3" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Sistem Pesanan Dapur (Makanan)</h1>
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
                    <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
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
                    <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
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
                    <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
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