'use client'
import { motion } from 'framer-motion'

const FoodLoading = () => {
  const foodItems = ['🍕', '🍝', '🍣', '🍔', '🥗']
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <div className="flex space-x-4 mb-6">
        {foodItems.map((item, index) => (
          <motion.div
            key={index}
            className="text-4xl"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 2,
              delay: index * 0.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {item}
          </motion.div>
        ))}
      </div>

      <motion.h3 
        className="text-xl font-medium text-gray-700"
        animate={{
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
      >
        Menyiapkan Pesanan Anda...
      </motion.h3>

      <div className="mt-6 w-48 h-1 bg-gray-200 rounded-full">
        <motion.div
          className="h-full bg-amber-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  )
}

export default FoodLoading