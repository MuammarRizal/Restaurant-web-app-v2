"use client";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, Truck, Coffee, User, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { DrinkItem, Order } from "@/types/menus";
import { usePlayAudioOnNewData } from "@/hooks/useAudioOnNewData";

// Kunci untuk localStorage
const LS_READY_DRINKS_KEY = "barista_ready_drinks";
const LS_DELIVERED_DRINKS_KEY = "barista_delivered_drinks";

// Fungsi fetcher untuk useSWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Gagal memuat data pesanan");
  }
  return res.json();
};

const BaristaPage = () => {
  const {
    data: ordersData,
    error,
    isLoading,
    mutate,
  } = useSWR<{ data: Order[] }>("/api/cart", fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: true,
  });

  const { audioRef } = usePlayAudioOnNewData(ordersData);
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  const [persistedReadyItems, setPersistedReadyItems] = useState<
    { orderId: string; itemId: string }[]
  >([]);
  const [persistedDeliveredItems, setPersistedDeliveredItems] = useState<
    { orderId: string; itemId: string }[]
  >([]);

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

  // Sync data dari SWR dengan state lokal dan aplikasikan status dari localStorage
  useEffect(() => {
    if (ordersData?.data) {
      // Buat salinan deep copy dari data pesanan
      const processedOrders = JSON.parse(
        JSON.stringify(ordersData.data)
      ) as Order[];

      // Terapkan status dari localStorage
      processedOrders.forEach((order) => {
        order.cart.forEach((item) => {
          // Cek apakah item ini ada di daftar ready yang tersimpan
          const isReady = persistedReadyItems.some(
            (pi) => pi.orderId === order.id && pi.itemId === item.id
          );

          // Cek apakah item ini ada di daftar delivered yang tersimpan
          const isDelivered = persistedDeliveredItems.some(
            (pi) => pi.orderId === order.id && pi.itemId === item.id
          );

          // Terapkan status berdasarkan prioritas (delivered > ready > original)
          if (isDelivered) {
            item.status = "delivered";
          } else if (isReady) {
            item.status = "ready";
          }
          // Jika tidak ada di kedua daftar, status original tetap dipertahankan
        });
      });

      setLocalOrders(processedOrders);
    }
  }, [ordersData, persistedReadyItems, persistedDeliveredItems]);

  // Action handlers
  const updateItemStatus = async (
    orderId: string,
    itemId: string,
    newStatus: "pending" | "ready" | "delivered"
  ) => {
    if (!confirm("Apa anda yakin?")) {
      return;
    }

    // Optimistic UI update
    const updatedOrders = localOrders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          cart: order.cart.map((item) => {
            if (item.id === itemId) {
              return { ...item, status: newStatus };
            }
            return item;
          }),
        };
      }

      return order;
    });

    setLocalOrders(updatedOrders);

    try {
      // Simpan perubahan ke localStorage berdasarkan status
      if (newStatus === "ready") {
        const updatedReadyItems = [...persistedReadyItems, { orderId, itemId }];
        setPersistedReadyItems(updatedReadyItems);
        localStorage.setItem(
          LS_READY_DRINKS_KEY,
          JSON.stringify(updatedReadyItems)
        );
      } else if (newStatus === "delivered") {
        const updatedDeliveredItems = [
          ...persistedDeliveredItems,
          { orderId, itemId },
        ];
        setPersistedDeliveredItems(updatedDeliveredItems);
        localStorage.setItem(
          LS_DELIVERED_DRINKS_KEY,
          JSON.stringify(updatedDeliveredItems)
        );
      }
      await axios.put(
        "/api/cart",
        {
          docId: orderId,
          isReady: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Revalidasi data dari server
      mutate();
    } catch (err) {
      console.error("Gagal memperbarui status:", err);
      // Kembalikan ke state sebelumnya jika gagal
      setLocalOrders(ordersData?.data || []);
      alert("Gagal memperbarui status. Silakan coba lagi.");
    }
  };

  // Filter orders by status - group by user instead of individual items
  const getOrdersByStatus = (status: string) => {
    const ordersWithDrinks: Order[] = [];

    localOrders.forEach((order) => {
      const drinkItems = order.cart.filter(
        (item) => item.status === status && item.category === "minuman"
      );

      if (drinkItems.length > 0) {
        // Create a new order object with only the filtered drink items
        ordersWithDrinks.push({
          ...order,
          cart: drinkItems,
        });
      }
    });

    // Sort by createdAt timestamp (newest first)
    return ordersWithDrinks.sort(
      (a, b) => b.createdAt.seconds - a.createdAt.seconds
    );
  };

  // Count total drink items by status
  const getDrinkItemsCountByStatus = (status: string) => {
    let count = 0;
    localOrders.forEach((order) => {
      order.cart.forEach((item) => {
        if (item.status === status && item.category === "minuman") {
          count++;
        }
      });
    });
    return count;
  };

  console.log(localOrders);

  // Clear localStorage function
  const clearLocalStorage = () => {
    if (
      confirm(
        "Hapus semua data tersimpan? Ini akan mengembalikan semua pesanan ke status aslinya."
      )
    ) {
      localStorage.removeItem(LS_READY_DRINKS_KEY);
      localStorage.removeItem(LS_DELIVERED_DRINKS_KEY);
      setPersistedReadyItems([]);
      setPersistedDeliveredItems([]);
      mutate(); // Revalidate data
    }
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
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-700 mb-4">{error.message}</p>
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
      <audio ref={audioRef} src="/mp3/orderan.mp3" preload="auto" />

      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Coffee className="w-8 h-8 text-brown-600 mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Sistem Pesanan Minuman
            </h1>
          </div>
        </div>

        {/* Order Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pending Orders */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-yellow-200">
            <div className="bg-yellow-500 px-4 py-3">
              <h2 className="text-white font-semibold flex items-center">
                <Clock className="mr-2" /> Menunggu (
                {getDrinkItemsCountByStatus("pending")})
              </h2>
            </div>
            <div className="p-4 space-y-4 min-h-[400px]">
              <AnimatePresence>
                {getOrdersByStatus("pending").map((order) => (
                  <motion.div
                    key={`pending-${order.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Customer Info */}
                    <div className="flex items-center mb-3">
                      <User className="w-5 h-5 text-gray-500 mr-2" />
                      <div className="flex-1">
                        <h3 className="font-bold">
                          {order.user.username || "Pelanggan"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {order.user.table
                            ? `Meja ${order.user.table}`
                            : "Take Away"}
                        </p>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {getMinutesSince(order.createdAt.seconds)} mnt lalu
                      </span>
                    </div>

                    {/* Drink Items */}
                    <div className="space-y-3">
                      {order.cart.map((item) => (
                        <div
                          key={item.id}
                          className="border-t pt-3 first:border-t-0 first:pt-0"
                        >
                          {/* Drink Image */}
                          <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://via.placeholder.com/300x200?text=Minuman";
                              }}
                            />
                          </div>

                          {/* Order Item Info */}
                          <div className="text-sm mb-3">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-700 font-medium">
                                {item.name}
                              </span>
                              <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                                {item.quantity}x
                              </span>
                            </div>
                            {item.notes && (
                              <p className="text-xs text-gray-500 mt-1 bg-blue-50 p-2 rounded">
                                📝 {item.notes}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() =>
                              updateItemStatus(order.id, item.id, "ready")
                            }
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm mb-2 last:mb-0"
                          >
                            Tandai Siap Antar
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {getOrdersByStatus("pending").length === 0 && (
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
                <CheckCircle className="mr-2" /> Siap Antar (
                {getDrinkItemsCountByStatus("ready")})
              </h2>
            </div>
            <div className="p-4 space-y-4 min-h-[400px]">
              <AnimatePresence>
                {getOrdersByStatus("ready").map((order) => (
                  <motion.div
                    key={`ready-${order.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Customer Info */}
                    <div className="flex items-center mb-3">
                      <User className="w-5 h-5 text-gray-500 mr-2" />
                      <div className="flex-1">
                        <h3 className="font-bold">
                          {order.user.username || "Pelanggan"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {order.user.table
                            ? `Meja ${order.user.table}`
                            : "Take Away"}
                        </p>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {getMinutesSince(order.createdAt.seconds)} mnt
                      </span>
                    </div>

                    {/* Drink Items */}
                    <div className="space-y-3">
                      {order.cart.map((item) => (
                        <div
                          key={item.id}
                          className="border-t pt-3 first:border-t-0 first:pt-0"
                        >
                          {/* Drink Image */}
                          <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://via.placeholder.com/300x200?text=Minuman";
                              }}
                            />
                          </div>

                          {/* Order Item Info */}
                          <div className="text-sm mb-3">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-700 font-medium">
                                {item.quantity}x {item.name}
                              </span>
                            </div>
                            {item.notes && (
                              <p className="text-xs text-gray-500 mt-1 bg-blue-50 p-2 rounded">
                                📝 {item.notes}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() =>
                              updateItemStatus(order.id, item.id, "delivered")
                            }
                            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-sm mb-2 last:mb-0"
                          >
                            Tandai Sudah Diantar
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {getOrdersByStatus("ready").length === 0 && (
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
                <Truck className="mr-2" /> Sudah Diantar (
                {getDrinkItemsCountByStatus("delivered")})
              </h2>
            </div>
            <div className="p-4 space-y-4 min-h-[400px]">
              <AnimatePresence>
                {getOrdersByStatus("delivered").map((order) => (
                  <motion.div
                    key={`delivered-${order.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-green-50/30"
                  >
                    {/* Customer Info */}
                    <div className="flex items-center mb-3">
                      <User className="w-5 h-5 text-gray-500 mr-2" />
                      <div className="flex-1">
                        <h3 className="font-bold">
                          {order.user.username || "Pelanggan"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {order.user.table
                            ? `Meja ${order.user.table}`
                            : "Take Away"}
                        </p>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {getMinutesSince(order.createdAt.seconds)} mnt
                      </span>
                    </div>

                    {/* Drink Items */}
                    <div className="space-y-3">
                      {order.cart.map((item) => (
                        <div
                          key={item.id}
                          className="border-t pt-3 first:border-t-0 first:pt-0"
                        >
                          {/* Drink Image */}
                          <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://via.placeholder.com/300x200?text=Minuman";
                              }}
                            />
                          </div>

                          {/* Order Item Info */}
                          <div className="text-sm mb-3">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-700 font-medium">
                                {item.quantity}x {item.name}
                              </span>
                            </div>
                            {item.notes && (
                              <p className="text-xs text-gray-500 mt-1 bg-blue-50 p-2 rounded">
                                📝 {item.notes}
                              </p>
                            )}
                          </div>

                          <div className="text-center text-green-600 text-sm py-2">
                            <CheckCircle className="inline mr-1" size={16} />{" "}
                            Sudah diantar
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {getOrdersByStatus("delivered").length === 0 && (
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
