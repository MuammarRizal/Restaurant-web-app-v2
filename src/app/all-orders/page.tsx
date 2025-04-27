"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, Utensils, Coffee } from "lucide-react";
import { useState } from "react";

type OrderStatus = "preparing" | "delivered";

type OrderItem = {
  id: string;
  name: string;
  type: "food" | "drink";
  quantity: number;
  notes?: string;
};

type CustomerOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  tableNumber: string;
  items: OrderItem[];
  status: OrderStatus;
  orderTime: Date;
  completedTime?: Date;
  image: string;
};

const CustomerOrderPage = () => {
  // Sample order data with 10 orders (5 preparing, 5 delivered)
  const [orders, setOrders] = useState<CustomerOrder[]>([
    {
      id: "ORD-001",
      orderNumber: "2023-11-001",
      customerName: "Budi Santoso",
      tableNumber: "A5",
      items: [
        { id: "1", name: "Nasi Goreng Spesial", type: "food", quantity: 2, notes: "Pedas, no telur" },
        { id: "2", name: "Es Teh Manis", type: "drink", quantity: 1 }
      ],
      status: "preparing",
      orderTime: new Date(),
      image: "https://img.freepik.com/free-photo/fried-rice-with-shrimps-chili-pepper-garlic-plate_1150-27186.jpg"
    },
    {
        id: "ORD-032",
        orderNumber: "2023-11-001",
        customerName: "Budi Santoso",
        tableNumber: "A5",
        items: [
          { id: "1", name: "Nasi Goreng Spesial", type: "food", quantity: 2, notes: "Pedas, no telur" },
          { id: "2", name: "Es Teh Manis", type: "drink", quantity: 1 }
        ],
        status: "preparing",
        orderTime: new Date(),
        image: "https://img.freepik.com/free-photo/fried-rice-with-shrimps-chili-pepper-garlic-plate_1150-27186.jpg"
      },
      {
        id: "ORD-033",
        orderNumber: "2023-11-001",
        customerName: "Budi Santoso",
        tableNumber: "A5",
        items: [
          { id: "1", name: "Nasi Goreng Spesial", type: "food", quantity: 2, notes: "Pedas, no telur" },
          { id: "2", name: "Es Teh Manis", type: "drink", quantity: 1 }
        ],
        status: "preparing",
        orderTime: new Date(),
        image: "https://img.freepik.com/free-photo/fried-rice-with-shrimps-chili-pepper-garlic-plate_1150-27186.jpg"
      },
    {
      id: "ORD-002",
      orderNumber: "2023-11-002",
      customerName: "Ani Wijaya",
      tableNumber: "B2",
      items: [
        { id: "3", name: "Ayam Bakar", type: "food", quantity: 1, notes: "Bagian dada" },
        { id: "4", name: "Jus Alpukat", type: "drink", quantity: 2 }
      ],
      status: "preparing",
      orderTime: new Date(),
      image: "https://img.freepik.com/free-photo/grilled-chicken-legs-with-spices-herbs_1147-156.jpg"
    },
    {
      id: "ORD-003",
      orderNumber: "2023-11-003",
      customerName: "Citra Dewi",
      tableNumber: "C1",
      items: [
        { id: "5", name: "Mie Goreng", type: "food", quantity: 1 },
        { id: "6", name: "Es Jeruk", type: "drink", quantity: 1 }
      ],
      status: "preparing",
      orderTime: new Date(),
      image: "https://img.freepik.com/free-photo/fried-noodles-with-vegetables-meat_1150-25701.jpg"
    },
    {
      id: "ORD-004",
      orderNumber: "2023-11-004",
      customerName: "Doni Pratama",
      tableNumber: "D3",
      items: [
        { id: "7", name: "Soto Ayam", type: "food", quantity: 1, notes: "Tambah sambal" },
        { id: "8", name: "Teh Hangat", type: "drink", quantity: 1 }
      ],
      status: "preparing",
      orderTime: new Date(),
      image: "https://img.freepik.com/free-photo/bowl-soup-with-chicken-meat-carrots_1150-25714.jpg"
    },
    {
      id: "ORD-005",
      orderNumber: "2023-11-005",
      customerName: "Eka Putra",
      tableNumber: "E4",
      items: [
        { id: "9", name: "Sate Kambing", type: "food", quantity: 5, notes: "Bumbu kacang dipisah" },
        { id: "10", name: "Es Cendol", type: "drink", quantity: 1 }
      ],
      status: "preparing",
      orderTime: new Date(),
      image: "https://img.freepik.com/free-photo/side-view-sate-plate-with-rice-sauce_141793-3462.jpg"
    },
    {
      id: "ORD-006",
      orderNumber: "2023-11-006",
      customerName: "Fani Amelia",
      tableNumber: "F2",
      items: [
        { id: "11", name: "Gado-Gado", type: "food", quantity: 1 },
        { id: "12", name: "Air Mineral", type: "drink", quantity: 2 }
      ],
      status: "delivered",
      orderTime: new Date(Date.now() - 1000 * 60 * 30),
      completedTime: new Date(Date.now() - 1000 * 60 * 15),
      image: "https://img.freepik.com/free-photo/gado-gado-indonesian-food_141793-3464.jpg"
    },
    {
      id: "ORD-007",
      orderNumber: "2023-11-007",
      customerName: "Guntur Wibowo",
      tableNumber: "G5",
      items: [
        { id: "13", name: "Rendang", type: "food", quantity: 1, notes: "Empuk" },
        { id: "14", name: "Es Kelapa", type: "drink", quantity: 1 }
      ],
      status: "delivered",
      orderTime: new Date(Date.now() - 1000 * 60 * 45),
      completedTime: new Date(Date.now() - 1000 * 60 * 30),
      image: "https://img.freepik.com/free-photo/beef-rendang-traditional-indonesian-food_141793-3468.jpg"
    },
    {
      id: "ORD-008",
      orderNumber: "2023-11-008",
      customerName: "Hana Lestari",
      tableNumber: "H1",
      items: [
        { id: "15", name: "Pecel Lele", type: "food", quantity: 1, notes: "Extra sambal" },
        { id: "16", name: "Es Teh Tarik", type: "drink", quantity: 1 }
      ],
      status: "delivered",
      orderTime: new Date(Date.now() - 1000 * 60 * 60),
      completedTime: new Date(Date.now() - 1000 * 60 * 45),
      image: "https://img.freepik.com/free-photo/fried-catfish-with-sambal-vegetables_141793-3466.jpg"
    },
    {
      id: "ORD-009",
      orderNumber: "2023-11-009",
      customerName: "Irfan Maulana",
      tableNumber: "I3",
      items: [
        { id: "17", name: "Bakso Special", type: "food", quantity: 1 },
        { id: "18", name: "Es Campur", type: "drink", quantity: 1 }
      ],
      status: "delivered",
      orderTime: new Date(Date.now() - 1000 * 60 * 75),
      completedTime: new Date(Date.now() - 1000 * 60 * 60),
      image: "https://img.freepik.com/free-photo/bowl-soup-with-meatballs-vegetables_141793-3467.jpg"
    },
    {
      id: "ORD-010",
      orderNumber: "2023-11-010",
      customerName: "Jihan Aulia",
      tableNumber: "J2",
      items: [
        { id: "19", name: "Rawon", type: "food", quantity: 1, notes: "Daging banyak" },
        { id: "20", name: "Es Dawet", type: "drink", quantity: 1 }
      ],
      status: "delivered",
      orderTime: new Date(Date.now() - 1000 * 60 * 90),
      completedTime: new Date(Date.now() - 1000 * 60 * 75),
      image: "https://img.freepik.com/free-photo/rawon-soup-traditional-indonesian-food_141793-3469.jpg"
    }
  ]);

  // Status configuration
  const statusConfig = {
    preparing: {
      icon: <Clock className="w-5 h-5" />,
      color: "bg-yellow-100 text-yellow-800",
      border: "border-yellow-300",
      label: "Sedang Diproses",
      description: "Pesanan Anda sedang dimasak"
    },
    delivered: {
      icon: <CheckCircle className="w-5 h-5" />,
      color: "bg-green-100 text-green-800",
      border: "border-green-300",
      label: "Sudah Diterima",
      description: "Pesanan sudah sampai di meja Anda"
    }
  };

  // Calculate time information
  const getTimeInfo = (order: CustomerOrder) => {
    if (order.status === "delivered" && order.completedTime) {
      const minutes = Math.floor((new Date().getTime() - order.completedTime.getTime()) / 60000);
      return `Diantar ${minutes} menit lalu`;
    }
    
    const minutes = Math.floor((new Date().getTime() - order.orderTime.getTime()) / 60000);
    return `Diproses ${minutes} menit`;
  };

  // Group orders by status
  const [activeOrders, completedOrders] = [
    orders.filter(o => o.status === "preparing"),
    orders.filter(o => o.status === "delivered")
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Status Pesanan Anda</h1>
          <p className="text-gray-600">Lacak semua pesanan Anda di sini</p>
        </motion.div>

        {/* In Progress Orders */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-yellow-500" />
            Pesanan Sedang Diproses ({activeOrders.length})
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence>
              {activeOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-white rounded-lg shadow-sm border-l-4 ${statusConfig.preparing.border} p-4 h-full`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-sm">#{order.orderNumber}</h3>
                      <p className="text-xs font-semibold text-gray-600">
                        {order.customerName} • Meja {order.tableNumber}
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      {statusConfig.preparing.icon}
                    </motion.div>
                  </div>

                  <div className="flex flex-col">
                    <div className="w-full h-24 rounded-md overflow-hidden mb-2">
                      <img
                        src={order.image}
                        alt={order.items[0].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <ul className="space-y-1">
                        {order.items.slice(0, 3).map((item) => (
                          <motion.li 
                            key={item.id}
                            whileHover={{ x: 3 }}
                            className="text-xs flex items-start"
                          >
                            <span className="mr-1 mt-0.5">
                              {item.type === "food" ? (
                                <Utensils className="w-3 h-3 text-orange-500" />
                              ) : (
                                <Coffee className="w-3 h-3 text-blue-500" />
                              )}
                            </span>
                            <span>
                              {item.quantity}x {item.name}
                              {item.notes && (
                                <span className="block text-[0.65rem] text-gray-500">• {item.notes}</span>
                              )}
                            </span>
                          </motion.li>
                        ))}
                        {order.items.length > 3 && (
                          <li className="text-xs text-gray-500">
                            +{order.items.length - 3} item lainnya
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    {getTimeInfo(order)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {activeOrders.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-center"
            >
              <p className="text-yellow-800">Tidak ada pesanan yang sedang diproses</p>
            </motion.div>
          )}
        </div>

        {/* Completed Orders */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
            Pesanan Sudah Diterima ({completedOrders.length})
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence>
              {completedOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-white rounded-lg shadow-sm border-l-4 ${statusConfig.delivered.border} p-4 h-full`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-sm">#{order.orderNumber}</h3>
                      <p className="text-xs font-semibold text-gray-600">
                        {order.customerName} • Meja {order.tableNumber}
                      </p>
                    </div>
                    {statusConfig.delivered.icon}
                  </div>

                  <div className="flex flex-col">
                    <div className="w-full h-24 rounded-md overflow-hidden mb-2">
                      <img
                        src={order.image}
                        alt={order.items[0].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <ul className="space-y-1">
                        {order.items.slice(0, 3).map((item) => (
                          <motion.li 
                            key={item.id}
                            whileHover={{ x: 3 }}
                            className="text-xs flex items-start"
                          >
                            <span className="mr-1 mt-0.5">
                              {item.type === "food" ? (
                                <Utensils className="w-3 h-3 text-orange-500" />
                              ) : (
                                <Coffee className="w-3 h-3 text-blue-500" />
                              )}
                            </span>
                            <span>
                              {item.quantity}x {item.name}
                              {item.notes && (
                                <span className="block text-[0.65rem] text-gray-500">• {item.notes}</span>
                              )}
                            </span>
                          </motion.li>
                        ))}
                        {order.items.length > 3 && (
                          <li className="text-xs text-gray-500">
                            +{order.items.length - 3} item lainnya
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    {getTimeInfo(order)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {completedOrders.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-50 border border-green-100 rounded-lg p-4 text-center"
            >
              <p className="text-green-800">Belum ada pesanan yang selesai</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderPage;