import { MenuItem } from "./menus";

export type CartItem = MenuItem & {
  quantity: number;
  notes?: string;
  username?: string;
  table?: string;
};
