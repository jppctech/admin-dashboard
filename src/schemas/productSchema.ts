import { z } from 'zod';

export const productSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  stock: z.number(),
  imageUrl: z.array(z.string().url()),
});

export type Product = z.infer<typeof productSchema>;