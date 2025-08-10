"use client";

import useSWR from "swr";

interface OrderItem {
  category: string;
  createdAt: { seconds: number; nanoseconds: number };
  id: string;
  image: string;
  label: string;
  name: string;
  quantity: number;
  status: "pending" | "ready" | "delivered";
}

interface Order {
  id: string;
  user: { table: string; username: string };
  cart: OrderItem[];
  createdAt: { seconds: number; nanoseconds: number };
  updatedAt: { seconds: number; nanoseconds: number };
  isReady: boolean;
}

export default function BaristaOrders() {
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Gagal memuat data pesanan");
    }
    return res.json();
  };

  const {
    data: ordersData,
    error,
    isLoading,
  } = useSWR<{ data: Order[] }>("/api/cart", fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: true,
  });

  console.log({ ordersData });

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    return date.toLocaleString();
  };

  if (isLoading) {
    return <p className="p-6 text-gray-500">Memuat pesanan...</p>;
  }

  if (error) {
    return (
      <p className="p-6 text-red-500">Gagal memuat pesanan: {error.message}</p>
    );
  }

  const orders = ordersData?.data ?? [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        ☕ Barista Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">Belum ada pesanan.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              {/* Header Pesanan */}
              <div className="border-b px-4 py-3 flex justify-between items-center bg-gray-50">
                <div>
                  <h2 className="font-semibold text-gray-800">
                    Meja {order.user.table} — {order.user.username}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Order ID: {order.id} • {formatTime(order.createdAt.seconds)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    order.isReady
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.isReady ? "Ready" : "In Progress"}
                </span>
              </div>

              {/* Item Minuman */}
              <div className="p-4 space-y-4">
                {order.cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border rounded-lg p-3"
                  >
                    <div className="relative w-16 h-16 rounded overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-xs text-gray-500 capitalize">
                        {item.category} • {item.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity / item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
