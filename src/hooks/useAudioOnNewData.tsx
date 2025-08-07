import { Order } from "@/types/menus";
import { useEffect, useRef, useState } from "react";

export function usePlayAudioOnNewData(ordersData?: { data: Order[] }) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [previousData, setPreviousData] = useState<Order[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Deteksi interaksi pengguna
  useEffect(() => {
    const handleUserInteraction = () => {
      setHasInteracted(true);
      removeListeners();
    };

    const events = ["click", "keydown", "mousemove", "touchstart", "scroll"];

    const addListeners = () => {
      events.forEach((event) =>
        window.addEventListener(event, handleUserInteraction, { passive: true })
      );
    };

    const removeListeners = () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleUserInteraction)
      );
    };

    addListeners();
    return () => removeListeners();
  }, []);

  // Deteksi penambahan data baru
  useEffect(() => {
    if (!hasInteracted || !ordersData) return;

    if (previousData.length && ordersData.data.length > previousData.length) {
      audioRef.current?.play().catch((e) => {
        console.error("Gagal memainkan suara:", e);
      });
    }

    setPreviousData(ordersData.data);
  }, [ordersData, hasInteracted]);

  return { audioRef };
}
