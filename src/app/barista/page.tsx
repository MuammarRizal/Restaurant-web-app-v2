"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Coffee, CheckCircle, Truck, User } from "lucide-react";
import { useState } from "react";

type DrinkOrder = {
  id: string;
  customerName: string;
  tableNumber: string;
  drinkImage: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    notes?: string;
  }[];
  status: "pending" | "preparing" | "ready" | "delivered";
  orderTime: Date;
};

const BaristaPage = () => {
  const [orders, setOrders] = useState<DrinkOrder[]>([
    {
      id: "B-001",
      customerName: "Budi Santoso",
      tableNumber: "A2",
      drinkImage: "https://img.freepik.com/free-photo/glass-cup-with-coffee-table_144627-8868.jpg",
      items: [
        { id: "1", name: "Latte", quantity: 1, notes: "Extra foam, less sugar" },
        { id: "2", name: "Es Teh", quantity: 2, notes: "Less ice" }
      ],
      status: "pending",
      orderTime: new Date()
    },
    {
      id: "B-002",
      customerName: "Ani Wijaya",
      tableNumber: "B3",
      drinkImage: "https://img.freepik.com/free-photo/cup-coffee-with-heart-drawn-foam_1286-96.jpg",
      items: [
        { id: "3", name: "Cappuccino", quantity: 1, notes: "Double shot" }
      ],
      status: "preparing",
      orderTime: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
    },
    {
      id: "B-003",
      customerName: "Rina Permata",
      tableNumber: "C1",
      drinkImage: "https://img.freepik.com/free-photo/fresh-coffee-steams-wooden-table-close-up-generative-ai_188544-8923.jpg",
      items: [
        { id: "4", name: "Matcha Latte", quantity: 1 }
      ],
      status: "ready",
      orderTime: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
    },
    {
      id: "B-004",
      customerName: "Doni Pratama",
      tableNumber: "D4",
      drinkImage: "https://img.freepik.com/free-photo/cup-coffee-with-coffee-beans_123827-21343.jpg",
      items: [
        { id: "5", name: "Americano", quantity: 1, notes: "Hot" },
        { id: "6", name: "Orange Juice", quantity: 1 }
      ],
      status: "delivered",
      orderTime: new Date(Date.now() - 1000 * 60 * 20) // 20 minutes ago
    }
  ]);

  // Action handlers
  const startPreparing = (id: string) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: "preparing" } : order
    ));
  };

  const markAsReady = (id: string) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: "ready" } : order
    ));
  };

  const markAsDelivered = (id: string) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: "delivered" } : order
    ));
  };

  // Filter orders by status
  const filteredOrders = (status: string) => 
    orders.filter(order => order.status === status);

  // Status styling
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    preparing: "bg-orange-100 text-orange-800",
    ready: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800"
  };

  const statusIcons = {
    pending: <Clock className="w-4 h-4" />,
    preparing: <Coffee className="w-4 h-4" />,
    ready: <CheckCircle className="w-4 h-4" />,
    delivered: <Truck className="w-4 h-4" />
  };

  const statusLabels = {
    pending: "Menunggu",
    preparing: "Sedang dibuat",
    ready: "Siap diantar",
    delivered: "Sudah diantar"
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Coffee className="w-8 h-8 text-brown-600 mr-3" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Sistem Pesanan Barista</h1>
        </div>

        {/* Order Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pending Orders */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-yellow-200">
            <div className="bg-yellow-500 px-4 py-3">
              <h2 className="text-white font-semibold flex items-center">
                <Clock className="mr-2" /> Menunggu ({filteredOrders("pending").length})
              </h2>
            </div>
            <div className="p-4 space-y-4 min-h-[400px]">
              <AnimatePresence>
                {filteredOrders("pending").map(order => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Customer Info */}
                    <div className="flex items-center mb-3">
                      <User className="w-5 h-5 text-gray-500 mr-2" />
                      <div>
                        <h3 className="font-medium">{order.customerName}</h3>
                        <p className="text-sm text-gray-500">Meja {order.tableNumber}</p>
                      </div>
                    </div>

                    {/* Drink Image */}
                    <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
                      <img 
                        src={order.drinkImage} 
                        alt={order.items[0].name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Minuman";
                        }}
                      />
                    </div>

                    {/* Order Items */}
                    <ul className="space-y-2 mb-3">
                      {order.items.map(item => (
                        <li key={item.id} className="text-sm">
                          <div className="flex justify-between">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {Math.floor((new Date().getTime() - order.orderTime.getTime()) / 60000)} mnt
                            </span>
                          </div>
                          {item.notes && (
                            <p className="text-xs text-gray-500 mt-1 bg-blue-50 p-2 rounded">
                              📝 {item.notes}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => startPreparing(order.id)}
                      className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                    >
                      Mulai Membuat
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredOrders("pending").length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Tidak ada pesanan
                </div>
              )}
            </div>
          </div>

          {/* Preparing Orders */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-200">
            <div className="bg-orange-500 px-4 py-3">
              <h2 className="text-white font-semibold flex items-center">
                <Coffee className="mr-2" /> Sedang Dibuat ({filteredOrders("preparing").length})
              </h2>
            </div>
            <div className="p-4 space-y-4 min-h-[400px]">
              <AnimatePresence>
                {filteredOrders("preparing").map(order => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Customer Info */}
                    <div className="flex items-center mb-3">
                      <User className="w-5 h-5 text-gray-500 mr-2" />
                      <div>
                        <h3 className="font-medium">{order.customerName}</h3>
                        <p className="text-sm text-gray-500">Meja {order.tableNumber}</p>
                      </div>
                    </div>

                    {/* Drink Image */}
                    <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
                      <img 
                        src={order.drinkImage} 
                        alt={order.items[0].name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Order Items */}
                    <ul className="space-y-2 mb-3">
                      {order.items.map(item => (
                        <li key={item.id} className="text-sm">
                          <div className="flex justify-between">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {Math.floor((new Date().getTime() - order.orderTime.getTime()) / 60000)} mnt
                            </span>
                          </div>
                          {item.notes && (
                            <p className="text-xs text-gray-500 mt-1 bg-blue-50 p-2 rounded">
                              📝 {item.notes}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => markAsReady(order.id)}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Tandai Siap
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredOrders("preparing").length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Tidak ada pesanan
                </div>
              )}
            </div>
          </div>

          {/* Ready Orders */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
            <div className="bg-blue-500 px-4 py-3">
              <h2 className="text-white font-semibold flex items-center">
                <CheckCircle className="mr-2" /> Siap Antar ({filteredOrders("ready").length})
              </h2>
            </div>
            <div className="p-4 space-y-4 min-h-[400px]">
              <AnimatePresence>
                {filteredOrders("ready").map(order => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Customer Info */}
                    <div className="flex items-center mb-3">
                      <User className="w-5 h-5 text-gray-500 mr-2" />
                      <div>
                        <h3 className="font-medium">{order.customerName}</h3>
                        <p className="text-sm text-gray-500">Meja {order.tableNumber}</p>
                      </div>
                    </div>

                    {/* Drink Image */}
                    <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
                      <img 
                        src={order.drinkImage} 
                        alt={order.items[0].name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Order Items */}
                    <ul className="space-y-2 mb-3">
                      {order.items.map(item => (
                        <li key={item.id} className="text-sm">
                          <div className="flex justify-between">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {Math.floor((new Date().getTime() - order.orderTime.getTime()) / 60000)} mnt
                            </span>
                          </div>
                          {item.notes && (
                            <p className="text-xs text-gray-500 mt-1 bg-blue-50 p-2 rounded">
                              📝 {item.notes}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => markAsDelivered(order.id)}
                      className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      Tandai Sudah Diantar
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredOrders("ready").length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Tidak ada pesanan
                </div>
              )}
            </div>
          </div>

          {/* Delivered Orders */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-green-200">
            <div className="bg-green-500 px-4 py-3">
              <h2 className="text-white font-semibold flex items-center">
                <Truck className="mr-2" /> Sudah Diantar ({filteredOrders("delivered").length})
              </h2>
            </div>
            <div className="p-4 space-y-4 min-h-[400px]">
              <AnimatePresence>
                {filteredOrders("delivered").map(order => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-green-50/30"
                  >
                    {/* Customer Info */}
                    <div className="flex items-center mb-3">
                      <User className="w-5 h-5 text-gray-500 mr-2" />
                      <div>
                        <h3 className="font-medium">{order.customerName}</h3>
                        <p className="text-sm text-gray-500">Meja {order.tableNumber}</p>
                      </div>
                    </div>

                    {/* Drink Image */}
                    <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
                      <img 
                        src={order.drinkImage} 
                        alt={order.items[0].name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Order Items */}
                    <ul className="space-y-2 mb-3">
                      {order.items.map(item => (
                        <li key={item.id} className="text-sm">
                          <div className="flex justify-between">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {Math.floor((new Date().getTime() - order.orderTime.getTime()) / 60000)} mnt
                            </span>
                          </div>
                          {item.notes && (
                            <p className="text-xs text-gray-500 mt-1 bg-blue-50 p-2 rounded">
                              📝 {item.notes}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>

                    <div className="text-center text-green-600 text-sm py-2">
                      <CheckCircle className="inline mr-1" /> Sudah diantar
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredOrders("delivered").length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Tidak ada pesanan
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