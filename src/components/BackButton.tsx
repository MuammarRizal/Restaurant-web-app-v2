import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react' // or any other icon library
import { useRouter } from 'next/navigation'


export default function BackButton() {
    const router = useRouter()
    const onBack = () => {
        router.push("/")
    }
  return (
    <motion.button
      onClick={onBack}
      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"
      whileHover={{ x: -4 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        animate={{ x: [0, -2, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'loop'
        }}
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.span>
      <span className="font-medium">Kembali</span>
    </motion.button>
  )
}