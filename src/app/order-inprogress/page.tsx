"use client";
import { motion } from "framer-motion";
import { Clock, CookingPot, Home } from "lucide-react";
import { useRouter } from "next/navigation";

const OrderInProgress = () => {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 text-center"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            y: [0, -10, 0] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut" 
          }}
          className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6"
        >
          <CookingPot className="w-10 h-10 text-orange-600" />
        </motion.div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Pesanan Sedang Diproses
        </h1>
        
        {/* Subtitle */}
        <p className="text-gray-600 mb-6">
          Tim kami sedang menyiapkan pesanan Anda dengan sepenuh hati
        </p>

        {/* Simple Loading Animation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5,
                  delay: i * 0.2 
                }}
                className="w-3 h-3 bg-orange-500 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Estimated Time */}
        <div className="flex items-center justify-center text-orange-600">
          <Clock className="w-5 h-5 mr-2" />
          <span>Perkiraan waktu: 10-15 menit</span>
        </div>

        {/* Back to home */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className="cursor-pointer mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors mx-auto"
        >
          <Home className="w-5 h-5" />
          <span>Silahkan Scan Lagi  </span>
        </motion.button>

        {/* Chef Illustration */}
        <motion.div
          animate={{ x: [-5, 5, -5] }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut" 
          }}
          className="mt-8"
        >
          <img 
            src="https://cdn-icons-png.flaticon.com/512/2936/2936886.png" 
            alt="Chef cooking"
            className="w-24 h-24 mx-auto"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderInProgress;