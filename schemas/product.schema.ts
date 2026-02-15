import { z } from "zod"; // veri şeması ile ilgli api dan gelen veriyi doğrulamak ve tip güvenliği sağlamak için kullanılır

// --- Relational field helper ---
// Directus ilişkisel alanları sorguya göre farklı şekillerde döner:
//   - Sadece ID dizisi: [21, 22, 23]            (fields=* kullanırken)
//   - Kısmi nesneler: [{id:21, images:[...]}]    (fields=*,reviews.images gibi)
//   - Tam nesneler: [{id:21, store_id:1, ...}]   (fields=*,reviews.* gibi)
// Bu helper hepsini kabul eder:
const RelationalItem = z.union([z.number(), z.record(z.string(), z.any())]);
const RelationalArray = z.array(RelationalItem).default([]);

// --- Review Schema (tam genişletilmiş review için) ---
export const ReviewSchema = z.object({
  id: z.number(),
  store_id: z.union([z.number(), z.record(z.string(), z.any())]),
  product_id: z.union([z.number(), z.record(z.string(), z.any())]),
  user_full_name: z.string(),
  comment: z.string(),
  rate: z.number().min(0).max(5),
  images: z
    .union([z.array(z.string()), z.string()])
    .transform((val) =>
      typeof val === "string" ? (JSON.parse(val) as string[]) : val,
    )
    .default([]),
});

export type Review = z.infer<typeof ReviewSchema>;

// --- Store Schema ---
export const StoreSchema = z.object({
  id: z.number(),
  tenant_id: z.union([z.number(), z.record(z.string(), z.any())]),
  provider: z.string(),
  identifier: z.string(),
  rate: z.number(),
  products: RelationalArray,
  reviews: RelationalArray,
});

export type Store = z.infer<typeof StoreSchema>;

// --- Product Schema ---
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  barcode: z.string(),
  tenant_id: z.union([z.number(), z.record(z.string(), z.any())]),
  stores: RelationalArray,
  reviews: RelationalArray,
});

export type Product = z.infer<typeof ProductSchema>;

// --- Directus Response ---
export const DirectusResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({ data: dataSchema });

// --- Form Schemas (Ürün Ekle / Düzenle) ---
export const ProductFormSchema = z.object({
  name: z
    .string({ error: "Ürün adı zorunludur." })
    .min(2, "Ürün adı en az 2 karakter olmalıdır.")
    .max(200, "Ürün adı en fazla 200 karakter olabilir."),
  barcode: z
    .string({ error: "Barkod numarası zorunludur." })
    .min(1, "Barkod numarası zorunludur.")
    .regex(/^\d+$/, "Barkod yalnızca rakam içermelidir."),
});

export type ProductFormData = z.infer<typeof ProductFormSchema>;

// --- Store Form Schema ---
export const StoreFormSchema = z.object({
  provider: z
    .string({ error: "Mağaza sağlayıcısı zorunludur." })
    .min(1, "Mağaza sağlayıcısı zorunludur."),
  identifier: z
    .string({ error: "Mağaza tanımlayıcısı zorunludur." })
    .min(1, "Mağaza tanımlayıcısı zorunludur."),
  rate: z
    .number({ error: "Puan zorunludur." })
    .min(0, "Puan 0 ile 5 arasında olmalıdır.")
    .max(5, "Puan 0 ile 5 arasında olmalıdır."),
});

export type StoreFormData = z.infer<typeof StoreFormSchema>;
