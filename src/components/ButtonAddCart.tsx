import { MenuItem } from '@/types/menus'
import React from 'react'
import { motion } from 'framer-motion'

function ButtonAddCart({ item, addToCart }: { item: MenuItem; addToCart: (item: MenuItem) => void }) {
  const isAvailable = item.quantity > 0;
  const remainingStock = Math.min(item.quantity, 10); // Cap at 10 for visual purposes

  return (
    <motion.div 
      className={`p-4 ${isAvailable ? 'bg-orange-50' : 'bg-gray-100'} rounded-lg shadow-sm hover:shadow-md transition-all`}
    >
      <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
      
      {/* Animated Stock Indicator */}
      <div className="my-3">
        {isAvailable ? (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-orange-600">
              <span>Tersisa</span>
              <span>{item.quantity}x</span>
            </div>
            <motion.div 
              className="h-2 bg-orange-200 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className={`h-full ${remainingStock > 5 ? 'bg-green-500' : remainingStock > 2 ? 'bg-orange-500' : 'bg-red-500'} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${remainingStock * 10}%` }}
                transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
              />
            </motion.div>
            <motion.p 
              className="text-xs text-right text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {remainingStock === item.quantity ? '' : 'Hampir habis!'}
            </motion.p>
          </div>
        ) : (
          <motion.div
            className="py-2 text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <span className="inline-block px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold animate-pulse">
              STOK HABIS
            </span>
          </motion.div>
        )}
      </div>

      <motion.button
        onClick={() => isAvailable && addToCart(item)}
        disabled={!isAvailable}
        className={`w-full text-white py-2 rounded-lg transition-colors ${
          isAvailable 
            ? 'bg-orange-500 hover:bg-orange-600 cursor-pointer' 
            : 'bg-gray-400 cursor-not-allowed'
        }`}
        whileTap={isAvailable ? { scale: 0.95 } : {}}
      >
        {isAvailable ? (
          <motion.span 
            className="flex items-center justify-center gap-1"
            whileHover={{ scale: 1.05 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
              />
            </svg>
            Tambah ke Keranjang
          </motion.span>
        ) : (
          'Stok Habis'
        )}
      </motion.button>
    </motion.div>
  );
}

export default ButtonAddCart;