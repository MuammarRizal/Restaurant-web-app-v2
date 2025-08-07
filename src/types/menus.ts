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
  dessert?: string; // For food items
  label?: string; // For drink items
  createdAt?: string;
  notes?: string; // For cart items
}

export interface MenuItemApi {
  id?: string;
  name: string;
  quantity: number;
  label?: string;
  dessert?: string;
  category: "makanan" | "minuman";
  image: string;
  createdAt?: Date;
}

export type DrinkItem = {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  image: string;
  category: string;
  status: "pending" | "ready" | "delivered";
};

export type Order = {
  id: string;
  user: {
    username: string;
    table: string;
  };
  cart: DrinkItem[];
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};
