"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CookingPot, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { clearCart } from "@/features/cart/cartSlice";

type OrderItem = {
  id: number;
  name: string;
  category: string;
  image: string;
  quantity: number;
  notes?: string;
};

const OrderTable = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { cart } = useSelector((state: RootState) => state);
  const handleOrder = () => {
    if(!confirm("Apa Pesanan Sudah Sesuai ?")){
      return;
    }
    dispatch(clearCart());
    router.push("/order-inprogress")
  }
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-orange-600 flex items-center gap-2">
          <CookingPot className="w-6 h-6" />
          Daftar Pesanan Aktif
        </h2>
        
        <button
          onClick={handleOrder}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <span>Proses Pesanan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Order List */}
      <div>
        <AnimatePresence>
          {cart.length === 0 ? (
            <div className="text-center p-8 bg-orange-50 rounded-lg">
              <p className="text-gray-500">Tidak ada pesanan saat ini</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cart.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
                >
                  {/* Image with Overlay */}
                  <div className="relative h-50 overflow-hidden">
                    <img 
                      src={order.image} 
                      alt={order.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <div className="flex justify-between items-end">
                        <h3 className="text-white font-medium">{order.name}</h3>
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                          {order.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Notes */}
                  <div className="p-3">
                    <div className={`flex items-start p-2 rounded text-sm ${
                      order.notes 
                        ? "bg-orange-50 text-orange-800" 
                        : "bg-gray-50 text-gray-500"
                    }`}>
                      <span className="mr-2">📝</span>
                      <p>{order.notes || "Tidak ada keterangan"}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrderTable;