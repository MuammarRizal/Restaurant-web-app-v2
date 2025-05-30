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
import { capitalizeEachWord } from "../utils/util";
import LoadingProgress from "@/components/LoadingProgress";

const Menus = () => {
  // State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [foods, setFoods] = useState<MenuItem[]>([]);
  const [drinks, setDrinks] = useState<MenuItem[]>([]);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [activeDrinkLabel, setActiveDrinkLabel] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isOrderedLoading, setIsLoadingOrdered] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // Drink label options
  const drinkLabels = [
    "Semua",
    "tea",
    "espresso",
    "flavored",
    "brew",
    "powder",
    "mixology"
  ];

  // Filter menu items
  const filteredItems = menus.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    // For "Semua" category, we'll use a different UI structure in the return
    if (activeCategory === "Semua") {
      return matchesSearch;
    }
    
    // For "makanan" category
    if (activeCategory === "makanan") {
      return item.category === "makanan" && matchesSearch;
    }
    
    // For "minuman" category with label filtering
    if (activeCategory === "minuman") {
      if (activeDrinkLabel === "Semua") {
        return item.category === "minuman" && matchesSearch;
      } else {
        return item.category === "minuman" && item.label === activeDrinkLabel && matchesSearch;
      }
    }
    
    return false;
  });

  // Categories - Explicitly defined with proper labels
  const categories = [
    { value: "Semua", label: "Semua" },
    { value: "makanan", label: "Makanan" },
    { value: "minuman", label: "Minuman" },
  ];

  // Group items by category and label for "Semua" view
  const groupedItems = {
    makanan: filteredItems.filter(item => item.category === "makanan"),
    minuman: drinkLabels.slice(1).reduce((acc, label) => {
      acc[label] = filteredItems.filter(
        item => item.category === "minuman" && item.label === label
      );
      return acc;
    }, {} as Record<string, MenuItem[]>)
  };

  // Cart functions
  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1, status: "pending" }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateNotes = (id: number, newNotes: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, notes: newNotes } : item
      )
    );
  };

  const onSubmitOrdered = () => {
    if (cart.length === 0) {
      alert("Silahkan pesan makanan dahulu");
      return;
    }
    setIsLoadingOrdered(true);
    cart.map((item) => dispatch(addItem(item)));
    const cartStringify = JSON.stringify(cart);
    localStorage.setItem("cart", cartStringify);
    router.push("order-list");
  };

  useEffect(() => {
    const storage = localStorage.getItem("qr_code");
    if (!storage) {
      alert("Silahkan Scan QR Dahulu");
      router.push("/validation");
      return;
    }
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/menus");
        const allMenus = response.data.data;
        
        // Set all menus
        setMenus(allMenus);
        
        // Separate foods and drinks for potential future use
        const foodsData = allMenus.filter(
          (item: MenuItem) => item.category === "makanan"
        );
        const drinksData = allMenus.filter(
          (item: MenuItem) => item.category === "minuman"
        );
        
        setFoods(foodsData);
        setDrinks(drinksData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const username = useSelector((state: RootState) => state.users.username);
  const table = useSelector((state: RootState) => state.users.table);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  // Render menu item with category-specific properties
  const renderMenuItem = (item: MenuItem) => (
    <div
      key={item.id}
      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-40 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />
      </div>
      <div className="p-3">
        {/* <h3 className="font-medium">{item.name}</h3> */}
        
        {/* Display category-specific properties */}
        {item.category === "makanan" && (
          <p className="text-sm text-gray-500 mt-1">
            🍰 Dessert: {item.dessert || "N/A"}
          </p>
        )}
        
        {item.category === "minuman" && (
          <p className="text-sm text-gray-500 mt-1">
            🏷️ {capitalizeEachWord(item.label) || "N/A"}
          </p>
        )}
        
        <ButtonAddCart
          item={item}
          addToCart={addToCart}
          cart={cart}
        />
      </div>
    </div>
  );

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
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => {
                      setActiveCategory(category.value);
                      setActiveDrinkLabel("Semua"); // Reset drink label filter when changing category
                    }}
                    className={`px-4 py-2 rounded-full whitespace-nowrap ${
                      activeCategory === category.value
                        ? "bg-orange-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {category.label}
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

            {/* Show drink labels only when minuman category is active */}
            {activeCategory === "minuman" && (
              <div className="flex space-x-2 overflow-x-auto pb-4 w-full">
                {drinkLabels.map((label) => (
                  <button
                    key={label}
                    onClick={() => setActiveDrinkLabel(label)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap ${
                      activeDrinkLabel === label
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {label === "Semua" ? label : capitalizeEachWord(label)}
                  </button>
                ))}
              </div>
            )}

            {/* Conditional rendering based on active category */}
            {activeCategory === "Semua" ? (
              // For "Semua" category, group items by category and label
              <div className="space-y-8">
                {/* Food section */}
                {groupedItems.makanan.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">🍔 Makanan</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupedItems.makanan.map(renderMenuItem)}
                    </div>
                  </div>
                )}
                
                {/* Drink sections, grouped by label */}
                {Object.entries(groupedItems.minuman).map(([label, items]) => 
                  items.length > 0 ? (
                    <div key={label}>
                      <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
                        ☕ Minuman - {capitalizeEachWord(label)}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map(renderMenuItem)}
                      </div>
                    </div>
                  ) : null
                )}
                
                {/* No results message */}
                {groupedItems.makanan.length === 0 && 
                 Object.values(groupedItems.minuman).every(items => items.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Tidak ada menu yang ditemukan</p>
                  </div>
                )}
              </div>
            ) : (
              // For specific categories
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map(renderMenuItem)}
                
                {filteredItems.length === 0 && (
                  <div className="col-span-3 text-center py-8 text-gray-500">
                    <p>Tidak ada menu yang ditemukan</p>
                  </div>
                )}
              </div>
            )}
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
                  <span className="ms-auto">{capitalizeEachWord(username)}</span>
                </h2>
                <p className="text-end">
                  {table !== "Take Away" ? `Meja ${table}` : table}
                </p>
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
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="border-b border-gray-100 pb-4"
                    >
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
                          {/* Show category-specific properties in cart too */}
                          {item.category === "makanan" && (
                            <p className="text-xs text-gray-500">
                              Dessert: {item.dessert || "N/A"}
                            </p>
                          )}
                          {item.category === "minuman" && (
                            <p className="text-xs text-gray-500">
                              {capitalizeEachWord(item.label) || "N/A"}
                            </p>
                          )}
                          <div className="flex items-center mt-1">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
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
                  {isOrderedLoading ? (
                    <div className="w-full h-10 rounded-lg py-3 font-medium text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                      <LoadingProgress />
                    </div>
                  ) : (
                    <button
                      className="mt-6 w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium cursor-pointer"
                      onClick={onSubmitOrdered}
                    >
                      Lanjutkan Pemesanan
                    </button>
                  )}
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