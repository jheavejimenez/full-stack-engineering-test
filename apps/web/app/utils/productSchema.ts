import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  stock: z
    .number()
    .positive("Stock must be a positive number")
    .int("Stock must be an integer"),
  price: z.number().positive("Price must be a positive number"),
  description: z.string().min(1, "Description is required"),
});

export type ProductFormData = z.infer<typeof productSchema>;
