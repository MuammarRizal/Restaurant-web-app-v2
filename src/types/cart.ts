import { MenuItem } from "./menus";

export type CartItem = MenuItem & {
  quantity: number;
  notes?: string;
};
