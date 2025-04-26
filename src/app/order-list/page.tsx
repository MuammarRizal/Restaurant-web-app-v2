"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, Trash2, CookingPot, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
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
      price: 25000,
      image: "https://img-global.cpcdn.com/recipes/5b7a6c1a9d1e4f2a/1200x630cq70/photo.jpg",
      notes: "Pedas, tambah telur",
      status: "preparing"
    },
    {
      id: "2",
      name: "Es Teh Manis",
      quantity: 1,
      price: 5000,
      image: "https://img-global.cpcdn.com/recipes/5b7a6c1a9d1e4f2a/1200x630cq70/photo.jpg",
      notes: "Kurang manis",
      status: "ready"
    },
    {
      id: "3",
      name: "Sate Ayam",
      quantity: 10,
      price: 20000,
      image: "https://img-global.cpcdn.com/recipes/5b7a6c1a9d1e4f2a/1200x630cq70/photo.jpg",
      status: "served"
    }
  ]);

  const removeOrder = (id: string) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  const statusStyles = {
    preparing: "bg-yellow-100 text-yellow-800",
    ready: "bg-blue-100 text-blue-800",
    served: "bg-green-100 text-green-800"
  };

  const statusIcons = {
    preparing: <Clock className="w-4 h-4" />,
    ready: <CheckCircle className="w-4 h-4" />,
    served: <CheckCircle className="w-4 h-4" />
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
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-md"
        >
          <span>Lihat Proses Masak</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="overflow-hidden bg-white rounded-xl shadow-lg border border-gray-100"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-orange-50">
            <tr>
              <th className="px-8 py-4 text-left text-sm font-medium text-orange-800 uppercase tracking-wider">Menu</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-orange-800 uppercase tracking-wider">Jumlah</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-orange-800 uppercase tracking-wider">Harga</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-orange-800 uppercase tracking-wider">Catatan</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-orange-800 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-orange-800 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            <AnimatePresence>
              {orders.length === 0 && (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <img 
                        src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" 
                        alt="No orders"
                        className="w-24 h-24 mb-4 opacity-50"
                      />
                      <p className="text-gray-500 text-lg">Tidak ada pesanan saat ini</p>
                    </div>
                  </td>
                </motion.tr>
              )}
              {orders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-orange-50/50"
                >
                  <td className="px-8 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-16 h-16 rounded-lg overflow-hidden mr-4 shadow-sm border border-gray-100"
                      >
                        <img 
                          src={order.image} 
                          alt={order.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/100?text=No+Image";
                          }}
                        />
                      </motion.div>
                      <span className="font-medium text-gray-900">{order.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    <span className="px-3 py-1 bg-gray-100 rounded-full">
                      {order.quantity}x
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    Rp {order.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    {order.notes ? (
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm"
                      >
                        {order.notes}
                      </motion.div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`px-3 py-1.5 inline-flex items-center text-sm font-semibold rounded-full ${statusStyles[order.status]}`}
                    >
                      <span className="mr-2">
                        {statusIcons[order.status]}
                      </span>
                      {order.status === "preparing" && "Memasak"}
                      {order.status === "ready" && "Siap"}
                      {order.status === "served" && "Selesai"}
                    </motion.div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeOrder(order.id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                      <span className="hidden sm:inline">Hapus</span>
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
          {orders.length > 0 && (
            <tfoot className="bg-orange-50">
              <tr>
                <td colSpan={2} className="px-8 py-4 text-lg font-medium text-gray-900">
                  Total Pesanan
                </td>
                <td className="px-6 py-4 text-xl font-bold text-orange-600">
                  Rp {orders.reduce((sum, order) => sum + (order.price * order.quantity), 0).toLocaleString()}
                </td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          )}
        </table>
      </motion.div>
    </div>
  );
};

export default OrderTable;