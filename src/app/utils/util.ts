import { CartItem } from "@/types/cart";

export function capitalizeEachWord(text: String) {
    if (!text) return '';
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

export function sentenceCase(text: String){
    if (!text) return '';
    text = text.trimStart(); // Hapus spasi di awal
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// Type guard untuk validasi tipe CartItem
export function isCartItem(item: any): item is CartItem {
    return (
      item && 
      typeof item.id === 'number' &&
      typeof item.name === 'string' &&
      typeof item.price === 'number' &&
      (typeof item.quantity === 'number' || typeof item.quantity === 'undefined')
    );
  }