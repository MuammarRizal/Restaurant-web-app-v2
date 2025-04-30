import { motion } from 'framer-motion';
import { MenuItem } from '@/types/menus';
import { CartItem } from '@/types/cart';

interface ButtonAddCartProps {
  cart: CartItem[];
  item: MenuItem;
  addToCart: (item: MenuItem) => void;
}

function ButtonAddCart({ cart, item, addToCart }: ButtonAddCartProps) {
  const isAvailable = item.quantity > 0;
  const remainingStock = Math.min(item.quantity, 10); // Cap at 10 for visual purposes
  const isCartAvailable = cart.some((cartItem) => cartItem.name === item.name);

  const stockIndicatorColor = 
    remainingStock > 5 ? 'bg-green-500' : 
    remainingStock > 2 ? 'bg-orange-500' : 'bg-red-500';

  return (
    <motion.div 
      className={`p-4 ${isAvailable ? 'bg-orange-50' : 'bg-gray-100'} rounded-lg shadow-sm hover:shadow-md transition-all`}
    >
      <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
      
      {/* Stock Indicator Section */}
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
                className={`h-full ${stockIndicatorColor} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${remainingStock * 10}%` }}
                transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
              />
            </motion.div>
            
            {remainingStock !== item.quantity && (
              <motion.p 
                className="text-xs text-right text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Hampir habis!
              </motion.p>
            )}
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

      {/* Add to Cart Button */}
      <motion.button
        onClick={() => isAvailable && addToCart(item)}
        disabled={!isAvailable || isCartAvailable}
        className={`w-full text-white py-2 rounded-lg transition-colors ${
          isAvailable && !isCartAvailable
            ? 'bg-orange-500 hover:bg-orange-600 cursor-pointer' 
            : 'bg-gray-400 cursor-not-allowed'
        }`}
        whileTap={isAvailable ? { scale: 0.95 } : {}}
      >
        <motion.span 
          className="flex items-center justify-center gap-1"
          whileHover={{ scale: isAvailable && !isCartAvailable ? 1.05 : 1 }}
        >
          <PlusIcon />
          {isCartAvailable ? "Anda Sudah Pesan" : isAvailable ? "Tambah ke Keranjang" : "Stok Habis"}
        </motion.span>
      </motion.button>
    </motion.div>
  );
}

// Extracted SVG icon component for better readability
function PlusIcon() {
  return (
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
  );
}

export default ButtonAddCart;