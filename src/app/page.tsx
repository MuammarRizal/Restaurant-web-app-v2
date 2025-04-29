"use client";
import { increment } from "@/features/counter/counterSlice";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Table = {
  table: string;
  status: "available" | "occupied";
};

const Home = () => {
  const [isNameWarningOpen, setIsNameWarningOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [showTableList, setShowTableList] = useState<boolean>(true);
  const [tables] = useState<Table[]>([
    { table: "1", status: "available" },
    { table: "2", status: "occupied" },
    { table: "3", status: "available" },
    { table: "4", status: "available" },
    { table: "Take Away", status: "available"}
  ]);

  const router = useRouter();

  const closeNameWarning = (): void => setIsNameWarningOpen(false);

  const selectTable = (tableNum: string): void => {
    setTableNumber(tableNum);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!name || !tableNumber) {
      setIsNameWarningOpen(true);
      return;
    }
    router.push("/menus")
    // Proceed to menu page
    console.log("Name:", name, "Table:", tableNumber);
  };
  const counterValue = useSelector(( state : RootState ) => state.counter.value)
  const dispatch = useDispatch()
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-10 px-4">
      <button onClick={() => dispatch(increment())}>TESSSS {counterValue}</button>
      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-800 sm:text-5xl md:text-6xl">
            Selamat Datang di Open Kedai
          </h1>
          <p className="text-xl font-medium text-orange-600">
            Pusat Pelatihan Kerja Daerah Jakarta Selatan
          </p>
        </header>

        {/* Main Form Section */}
        <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-700">
                Kode Anda: <span className="text-orange-600">PPKDJS</span>
              </h2>
              <p className="mt-2 text-gray-600">
                👋 Halo, silahkan masukkan nama Anda:
              </p>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Lengkap"
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                required
              />
            </div>

            <div className="mb-6">
              {/* Table List */}
              {showTableList && (
                <div className="mt-2 rounded-lg border border-gray-200 p-3">
                <h3 className="mb-2">Pilih Meja :</h3>
                <div className="grid grid-cols-2 gap-2">
                  {tables.map((table, index) => {
                    const isLastItem = index === tables.length - 1;
                    const isTakeAway = table.table === "Take Away";
                    const isAvailable = table.status === "available";
                    
                    return (
                      <button
                        key={table.table}
                        type="button"
                        onClick={() => selectTable(table.table)}
                        disabled={!isAvailable}
                        className={`
                          rounded-lg p-2 text-center transition-colors
                          ${isLastItem ? 'col-span-2' : ''}
                          ${isAvailable
                            ? isTakeAway
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          }
                          ${tableNumber === table.table ? 'ring-2 ring-orange-500' : ''}
                        `}
                      >
                        {isTakeAway ? "Take Away" : `Meja ${table.table}`}
                        {!isAvailable && (
                          <span className="block text-xs text-gray-500">(Penuh)</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-orange-600 py-3 font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Ayo Cari Menu
            </button>
          </form>
        </div>
      </div>

      {/* Name Warning Popup */}
      {isNameWarningOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-xl">
            <h2 className="mb-4 text-2xl font-semibold">Peringatan!</h2>
            <p className="mb-6 text-gray-700">
              Silakan masukkan Nama dan Table.
            </p>
            <button
              className="rounded-lg bg-orange-600 px-6 py-2 font-medium text-white hover:bg-orange-700"
              onClick={closeNameWarning}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;