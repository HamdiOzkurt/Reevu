import type { Review } from "@/schemas/product.schema";
import {
    createProduct,
    deleteProduct,
    fetchProduct,
    fetchProductReviews,
    fetchProducts,
    fetchReviews,
    updateProduct,
} from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ---------- Query keys ----------
export const queryKeys = {
  products: ["products"] as const,
  product: (id: number) => ["product", id] as const,
  reviews: (productId?: number) => ["reviews", productId] as const,
};

// ---------- Queries ----------
export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 dakika önbellekte tut
    retry: 2,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => fetchProduct(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useReviews(productId?: number) {
  return useQuery({
    queryKey: queryKeys.reviews(productId),
    queryFn: () => fetchReviews(productId),
    enabled: productId !== undefined,
    staleTime: 1000 * 60 * 5,
  });
}

// Ürün detay sayfası için tam review verileri (ReviewSchema ile doğrulanmış)
export function useProductReviews(productId: number) {
  return useQuery<Review[]>({
    queryKey: ["productReviews", productId] as const,
    queryFn: () => fetchProductReviews(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

// ---------- Mutations ----------
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; barcode: string }) =>
      createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
    },
  });
}

export function useUpdateProduct(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; barcode: string }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({ queryKey: queryKeys.product(id) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
    },
  });
}
