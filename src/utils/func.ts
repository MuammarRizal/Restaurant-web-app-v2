export function toTitleCase(text: string): string {
  if (!text) return "";

  return text
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export const playSound = () => {
  const sound = new Audio("/mp3/orderan.mp3"); // letakkan file sound.mp3 di folder public
  sound.play();
};

export function getIdFromUrl(url: string) {
  const parts = url.split("/"); // pisah berdasarkan "/"
  return parts[parts.length - 1]; // ambil bagian terakhir
}
