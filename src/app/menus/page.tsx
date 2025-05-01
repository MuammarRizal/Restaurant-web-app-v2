"use client";
import BackButton from "@/components/BackButton";
import ButtonAddCart from "@/components/ButtonAddCart";
import Loading from "@/components/Loading";
import { addItem } from "@/features/cart/cartSlice";
import { RootState } from "@/store/store";
import { CartItem } from "@/types/cart";
import { MenuItem } from "@/types/menus";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Menus = () => {
  // State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menus, setMenus] = useState<CartItem[]>([]);
  const [loading,setLoading] = useState<boolean>(true);
  const [error,setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const dispatch = useDispatch()
  const router = useRouter();

  // Filter menu items
  const filteredItems = menus.filter(item => {
    const matchesCategory = activeCategory === "Semua" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Categories
  const categories = ["Semua", ...new Set(menus.map(item => item.category))];

  // Cart functions
  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateNotes = (id: number, newNotes: string) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, notes: newNotes } : item
      )
    );
  };

  const onSubmitOrdered = () => {
    if(cart.length === 0){
      alert("Silahkan pesan makanan dahulu")
    }
    cart.map(item => dispatch(addItem(item)))
    console.log("Order submitted:", {
      items: cart,
    });
    // Add your order submission logic here
    router.push("order-list")
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const menus = await axios.get("/api/menus");
        setMenus(menus.data.data)
      } catch (error: any) {
        setError(error.message)
      }finally {
        setLoading(false)
      }
    }

    fetchData()
  },[])

  const username = useSelector((state: RootState) => state.users.username)
  const table = useSelector((state: RootState) => state.users.table)
  console.log({cart})
  if(loading) return <Loading />
  if(error) return <div>Error: {error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-orange-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Open Kedai</h1>
          <p className="text-sm">Pusat Pelatihan Kerja Daerah Jakarta Selatan</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Menu Section (Left) */}
          <div className="lg:w-2/3 bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex space-x-2 overflow-x-auto pb-2 w-full">
                <BackButton />
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap ${
                      activeCategory === category
                        ? "bg-orange-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Cari menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-auto"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map(item => (
                <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                  </div>
                  <ButtonAddCart item={item} addToCart={addToCart} cart={cart}/>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Section (Right) */}
          <div className="lg:w-1/3 bg-white rounded-lg shadow-md p-4 h-fit sticky top-4">
          <div className="header flex items-center">
              <h2 className="text-xl font-bold mb-4">
                <span className="mr-2">🛒</span> Keranjang
                {cart.length > 0 && (
                  <span className="ml-2 bg-orange-500 text-white text-sm px-2 py-1 rounded-full">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
               
              </h2>
              <div className="table ms-auto">
                <h2 className="text-xl font-bold">
                  <span className="ms-auto">{username}</span>
                </h2> 
              <p className="text-end">Meja {table}</p>
              </div>
          </div>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Keranjang kosong</p>
                <p className="text-sm mt-2">Tambahkan menu dari daftar</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {cart.map(item => (
                    <div key={item.id} className="border-b border-gray-100 pb-4">
                      <div className="flex items-start">
                        <div className="w-16 h-16 rounded-md mr-3 flex-shrink-0 overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{item.name}</h3>
                          {/* <p className="text-orange-600 font-bold">Rp {item.price.toLocaleString()}</p> */}
                          <div className="flex items-center mt-1">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <textarea
                          placeholder="Catatan untuk item ini (pedas, kurang garam, dll)"
                          value={item.notes || ""}
                          onChange={(e) => updateNotes(item.id, e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-2 pt-2">
                  <button 
                    className="mt-6 w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium cursor-pointer"
                    onClick={onSubmitOrdered}
                  >
                    Lanjutkan Pemesanan
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menus;