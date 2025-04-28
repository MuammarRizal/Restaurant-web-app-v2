"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CookingPot, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  image: string;
  notes?: string;
  status: "preparing" | "ready" | "served";
};

const OrderTable = () => {
  const router = useRouter();
  
  // Sample order data with images
  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: "1",
      name: "Nasi Goreng Spesial",
      quantity: 2,
      image: "https://img-global.cpcdn.com/recipes/5b7a6c1a9d1e4f2a/1200x630cq70/photo.jpg",
      notes: "Pedas, tambah telur",
      status: "preparing"
    },
    {
      id: "2",
      name: "Es Teh Manis",
      quantity: 1,
      image: "https://img-global.cpcdn.com/recipes/5b7a6c1a9d1e4f2a/1200x630cq70/photo.jpg",
      notes: "Kurang manis",
      status: "ready"
    },
    {
      id: "3",
      name: "Sate Ayam",
      quantity: 10,
      image: "https://img-global.cpcdn.com/recipes/5b7a6c1a9d1e4f2a/1200x630cq70/photo.jpg",
      status: "served"
    }
  ]);

  const statusColors = {
    preparing: "border-yellow-300",
    ready: "border-blue-300",
    served: "border-green-300"
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <h2 className="text-3xl font-bold text-orange-600 flex items-center gap-3">
          <CookingPot className="w-8 h-8" />
          Daftar Pesanan Aktif
        </h2>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/order-inprogress')}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-md cursor-pointer"
        >
          <span>Proses Pesanan</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <AnimatePresence>
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center p-12"
            >
              <img 
                src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" 
                alt="No orders"
                className="w-24 h-24 mx-auto mb-4 opacity-50"
              />
              <p className="text-gray-500 text-lg">Tidak ada pesanan saat ini</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${statusColors[order.status]} transition-all`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={order.image} 
                      alt={order.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-xl font-bold text-white">{order.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className="px-2 py-1 bg-orange-500 text-white text-sm rounded-full">
                          {order.quantity}x
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {order.notes && (
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="bg-orange-50 text-orange-800 px-3 py-2 rounded-lg text-sm mb-3 flex items-start"
                      >
                        <span className="mr-2">📝</span>
                        <p>{order.notes}</p>
                      </motion.div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {order.status === "preparing" && "Sedang dimasak"}
                        {order.status === "ready" && "Siap diantar"}
                        {order.status === "served" && "Sudah disajikan"}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default OrderTable;