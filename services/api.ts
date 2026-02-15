import {
  ProductSchema,
  ReviewSchema,
  StoreSchema,
  type Product,
  type Review,
  type Store,
} from "@/schemas/product.schema";
import { z } from "zod";
import { apiClient } from "./apiClient";

// ---------- Helpers ----------
function parseArray<T>(schema: z.ZodType<T>, data: unknown[]): T[] {
  return data.map((item) => schema.parse(item));
}

// ---------- Products ----------
export async function fetchProducts(): Promise<Product[]> {
  // Liste görünümü: sadece temel alanlar + review resimlerini al
  const { data } = await apiClient.get(
    "/items/reevu_products?fields=*,reviews.id,reviews.images",
  );
  return parseArray(ProductSchema, data.data);
}

export async function fetchProduct(id: number): Promise<Product> {
  //Geriye ürün dizisi sözü Promise<Product ile bu kodun amacı bu.
  // Detay görünümü: tüm alanları genişlet
  const { data } = await apiClient.get(
    `/items/reevu_products/${id}?fields=*,reviews.*,stores.*`,
  );
  return ProductSchema.parse(data.data);
}

// Ürün detay sayfası için review'ları ayrıca çek (tam ReviewSchema ile)
export async function fetchProductReviews(
  productId: number,
): Promise<Review[]> {
  const { data } = await apiClient.get(
    `/items/reevu_store_product_reviews?filter[product_id][_eq]=${productId}&fields=*`,
  );
  return parseArray(ReviewSchema, data.data);
}

export async function createProduct(payload: {
  name: string;
  barcode: string;
}) {
  const { data } = await apiClient.post("/items/reevu_products", payload);
  return data.data;
}

export async function updateProduct(
  id: number,
  payload: { name: string; barcode: string },
) {
  const { data } = await apiClient.patch(
    `/items/reevu_products/${id}`,
    payload,
  );
  return data.data;
}

export async function deleteProduct(id: number) {
  await apiClient.delete(`/items/reevu_products/${id}`);
}

// ---------- Stores ----------
export async function fetchStores(): Promise<Store[]> {
  const { data } = await apiClient.get("/items/reevu_stores");
  return parseArray(StoreSchema, data.data);
}

export async function fetchStore(id: number): Promise<Store> {
  const { data } = await apiClient.get(
    `/items/reevu_stores/${id}?fields=*,products.*,reviews.*`,
  );
  return StoreSchema.parse(data.data);
}

export async function createStore(payload: Partial<Store>) {
  const { data } = await apiClient.post("/items/reevu_stores", payload);
  return data.data;
}

export async function updateStore(id: number, payload: Partial<Store>) {
  const { data } = await apiClient.patch(`/items/reevu_stores/${id}`, payload);
  return data.data;
}

export async function deleteStore(id: number) {
  await apiClient.delete(`/items/reevu_stores/${id}`);
}

// ---------- Reviews ----------
export async function fetchReviews(productId?: number): Promise<Review[]> {
  const filter = productId
    ? `?filter[product_id][_eq]=${productId}&fields=*`
    : "?fields=*";
  const { data } = await apiClient.get(
    `/items/reevu_store_product_reviews${filter}`,
  );
  return parseArray(ReviewSchema, data.data);
}

export async function fetchReview(id: number): Promise<Review> {
  const { data } = await apiClient.get(
    `/items/reevu_store_product_reviews/${id}`,
  );
  return ReviewSchema.parse(data.data);
}
