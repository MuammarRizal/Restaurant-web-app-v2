"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, Utensils, Flame } from "lucide-react";
import { useState } from "react";

type KitchenOrder = {
  id: string;
  tableNumber: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    notes?: string;
  }[];
  status: "pending" | "cooking" | "ready" | "served";
  timestamp: Date;
};

const KitchenOrders = () => {
  const [orders, setOrders] = useState<KitchenOrder[]>([
    {
      id: "K-001",
      tableNumber: "A1",
      items: [
        { id: "1", name: "Nasi Goreng Spesial", quantity: 2, notes: "Pedas" },
        { id: "2", name: "Ayam Bakar", quantity: 1 }
      ],
      status: "pending",
      timestamp: new Date()
    },
    {
      id: "K-002",
      tableNumber: "B3",
      items: [
        { id: "3", name: "Sate Ayam", quantity: 10, notes: "Bumbu kacang dipisah" }
      ],
      status: "cooking",
      timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
    },
    {
      id: "K-003",
      tableNumber: "C2",
      items: [
        { id: "4", name: "Gado-Gado", quantity: 1 }
      ],
      status: "ready",
      timestamp: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
    }
  ]);

  const startCooking = (id: string) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: "cooking" } : order
    ));
  };

  const markAsReady = (id: string) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: "ready" } : order
    ));
  };

  const markAsServed = (id: string) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: "served" } : order
    ));
  };

  const filteredOrders = (status: string) => 
    orders.filter(order => order.status === status);

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800",
    cooking: "bg-orange-100 text-orange-800",
    ready: "bg-blue-100 text-blue-800",
    served: "bg-green-100 text-green-800"
  };

  const statusIcon = {
    pending: <Clock className="w-4 h-4" />,
    cooking: <Flame className="w-4 h-4" />,
    ready: <CheckCircle className="w-4 h-4" />,
    served: <CheckCircle className="w-4 h-4" />
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Utensils className="w-8 h-8 text-orange-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Kitchen Order System</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Orders */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-yellow-500 px-4 py-3">
              <h2 className="text-white font-semibold flex items-center">
                <Clock className="mr-2" /> Pending ({filteredOrders("pending").length})
              </h2>
            </div>
            <div className="p-4 space-y-4 min-h-[300px]">
              <AnimatePresence>
                {filteredOrders("pending").map(order => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold">Table {order.tableNumber}</h3>
                        <span className="text-xs text-gray-500">
                          {order.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColor[order.status]}`}>
                        Pending
                      </span>
                    </div>
                    <ul className="space-y-2 mt-2">
                      {order.items.map(item => (
                        <li key={item.id} className="text-sm">
                          {item.quantity}x {item.name}
                          {item.notes && <p className="text-xs text-gray-500">Note: {item.notes}</p>}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => startCooking(order.id)}
                      className="mt-3 w-full bg-orange-500 text-white py-1.5 rounded-lg text-sm hover:bg-orange-600"
                    >
                      Start Cooking
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredOrders("pending").length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No pending orders
                </div>
              )}
            </div>
          </div>

          {/* Cooking Orders */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-orange-500 px-4 py-3">
              <h2 className="text-white font-semibold flex items-center">
                <Flame className="mr-2" /> Cooking ({filteredOrders("cooking").length})
              </h2>
            </div>
            <div className="p-4 space-y-4 min-h-[300px]">
              <AnimatePresence>
                {filteredOrders("cooking").map(order => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold">Table {order.tableNumber}</h3>
                        <span className="text-xs text-gray-500">
                          Cooking for {Math.floor((new Date().getTime() - order.timestamp.getTime()) / 60000)} mins
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColor[order.status]}`}>
                        Cooking
                      </span>
                    </div>
                    <ul className="space-y-2 mt-2">
                      {order.items.map(item => (
                        <li key={item.id} className="text-sm">
                          {item.quantity}x {item.name}
                          {item.notes && <p className="text-xs text-gray-500">Note: {item.notes}</p>}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => markAsReady(order.id)}
                      className="mt-3 w-full bg-blue-500 text-white py-1.5 rounded-lg text-sm hover:bg-blue-600"
                    >
                      Mark as Ready
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredOrders("cooking").length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No orders being cooked
                </div>
              )}
            </div>
          </div>

          {/* Ready Orders */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-blue-500 px-4 py-3">
              <h2 className="text-white font-semibold flex items-center">
                <CheckCircle className="mr-2" /> Ready ({filteredOrders("ready").length})
              </h2>
            </div>
            <div className="p-4 space-y-4 min-h-[300px]">
              <AnimatePresence>
                {filteredOrders("ready").map(order => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold">Table {order.tableNumber}</h3>
                        <span className="text-xs text-gray-500">
                          Ready for {Math.floor((new Date().getTime() - order.timestamp.getTime()) / 60000)} mins
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColor[order.status]}`}>
                        Ready
                      </span>
                    </div>
                    <ul className="space-y-2 mt-2">
                      {order.items.map(item => (
                        <li key={item.id} className="text-sm">
                          {item.quantity}x {item.name}
                          {item.notes && <p className="text-xs text-gray-500">Note: {item.notes}</p>}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => markAsServed(order.id)}
                      className="mt-3 w-full bg-green-500 text-white py-1.5 rounded-lg text-sm hover:bg-green-600"
                    >
                      Mark as Served
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredOrders("ready").length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No orders ready
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenOrders;