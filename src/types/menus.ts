// export type MenuItem = {
//     id: number;
//     name: string;
//     category: string;
//     image: string;
//     quantity: number;
// };

// types/menus.ts

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  image: string;
  quantity: number;
  price?: number;
  // New properties
  dessert?: string;  // For food items
  label?: string;    // For drink items
  createdAt?: string;
  notes?: string;    // For cart items
}