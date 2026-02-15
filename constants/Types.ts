// Tüm tip tanımları artık Zod şemalarından geliyor
export type { Product, Review, Store } from "@/schemas/product.schema";

import type { Product } from "@/schemas/product.schema";

// Directus API response wrapper
export interface DirectusResponse<T> {
  data: T;
}

// Ürünün review görsellerinden ilk fotoğrafı al
// reviews dizisi sayı (ID) veya kısmi nesne olabilir
export function getProductImage(product: Product): string | null {
  const reviews = product.reviews;
  if (!Array.isArray(reviews)) return null;
  for (const review of reviews) {
    if (typeof review === "object" && review !== null) {
      const r = review as Record<string, unknown>;
      const images = r.images;
      if (
        Array.isArray(images) &&
        images.length > 0 &&
        typeof images[0] === "string"
      ) {
        return images[0];
      }
    }
  }
  return null;
}

// Kategoriler ve anahtar kelime eşleştirmesi
export interface Category {
  label: string;
  keywords: string[];
}

export const CATEGORIES: Category[] = [
  { label: "Tüm Ürünler", keywords: [] },
  {
    label: "Cilt Bakımı",
    keywords: [
      "cera",
      "moisture",
      "lifting",
      "serum",
      "cream",
      "krem",
      "nemlendirici",
      "sıkılaştırıcı",
    ],
  },
  { label: "Güneş Koruma", keywords: ["sunscreen", "spf", "güneş", "koruma"] },
  {
    label: "Temizleme",
    keywords: ["cleansing", "temizleme", "purifying", "arındırıcı"],
  },
  { label: "Maske", keywords: ["mask", "maske"] },
  { label: "Tonik", keywords: ["toner", "tonik", "boosting"] },
  { label: "Makyaj", keywords: ["cushion", "fondöten", "fond"] },
];
