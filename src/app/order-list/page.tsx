"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CookingPot, ArrowRight, Trash2, Edit, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
// import { clearCart, removeFromCart } from "@/features/cart/cartSlice";
import { useState } from "react";
import { clearCart } from "@/features/cart/cartSlice";
import axios from "axios";

const OrderTable = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { cart, users } = useSelector((state: RootState) => state);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedNote, setEditedNote] = useState("");
  const [loading, setloading] = useState<boolean>(false)
  const handleOrder = async () => {
    setloading(true)
    try{
      // console.log("cart:",{cart,users})
      const response = await axios.post("/api/cart",{cart: cart, user: users})
      if(response.statusText !== "OK" ){
        console.log("response:",{response})
        console.log("response:",{response.status})
        alert("Ada yang salah nih servernya")
        throw new Error('Something went wrong');
      }

      alert("Data berhasil ditambahkan")
      dispatch(clearCart());
      router.push("/order-inprogress");
    }catch(error){
      console.log(error)
    }
  };

  const startEditing = (id: number, currentNote: string) => {
    setEditingId(id);
    setEditedNote(currentNote || "");
  };

  // const saveNote = (id: number) => {
  //   dispatch(updateNote({ id, notes: editedNote }));
  //   setEditingId(null);
  // };

  // const cancelEditing = () => {
  //   setEditingId(null);
  // };

  // const handleRemoveItem = (id: number) => {
  //   if (confirm("Hapus item dari pesanan?")) {
  //     dispatch(removeItem(id));
  //   }
  // };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-orange-600 flex items-center gap-2">
            <CookingPot className="w-6 h-6" />
            Daftar Pesanan
          </h2>
          <div className="mt-2 text-sm text-gray-600">
            <p>Pelanggan: <span className="font-medium">{users.username}</span></p>
            <p>Meja: <span className="font-medium">{users.table !== "Take Away" ? `Meja ${users.table}` : "Take Away"}</span></p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-orange-100 text-orange-800 px-3 py-2 rounded-lg">
            Total Item: <span className="font-bold">{totalItems}</span>
          </div>
          {loading ? (
            <div
            className="flex items-center gap-2 px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <span>Mohon Tunggu ...</span>
            <ArrowRight className="w-4 h-4" />
          </div>
          ) : (
            <button
              onClick={handleOrder}
              disabled={cart.length === 0}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <span>Proses Pesanan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Order Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <AnimatePresence>
          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center p-8 bg-orange-50"
            >
              <p className="text-gray-500">Tidak ada pesanan saat ini</p>
            </motion.div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Menu
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catatan
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cart.map((order) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={order.image}
                              alt={order.name}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/100?text=No+Image";
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{order.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                          {order.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded-md">
                          {order.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {editingId === order.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editedNote}
                              onChange={(e) => setEditedNote(e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm"
                              autoFocus
                            />
                            <button
                              // onClick={() => saveNote(order.id)}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              // onClick={cancelEditing}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            {order.notes || "-"}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEditing(order.id, order.notes || "")}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            // onClick={() => handleRemoveItem(order.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrderTable;