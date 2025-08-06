import z from "zod";

export const MenuSchema = z.object({
  name: z.string().min(5, "Name Wajib Di isi"),
  category: z.enum(["makanan", "minuman"], "Hanya Boleh Makanan Dan Minuman"),
  quantity: z.number(),
  image: z.string().url(),
  dessert: z.string().optional(),
  label: z.string().optional(),
});
