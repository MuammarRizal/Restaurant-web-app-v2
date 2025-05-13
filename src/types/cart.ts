import { MenuItem } from "./menus";
import { User } from "./user";

export type CartItem = MenuItem & {
  quantity: number;
  notes?: string;
  username?: string;
  table?: string;
};


export type CartApi = {
  id: string;
  cart: CartItem[];
  user: User
}