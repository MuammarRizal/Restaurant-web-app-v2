import { motion } from "framer-motion";

function LoadingProgress() {
  return (
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
  )
}

export default LoadingProgress