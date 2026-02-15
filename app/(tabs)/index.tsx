import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { ProductListSkeleton } from "@/components/SkeletonLoader";
import { CATEGORIES } from "@/constants/Types";
import { useColors } from "@/hooks/useColors";
import { useProducts } from "@/hooks/useProductQueries";
import { useTranslation } from "@/hooks/useTranslation";
import type { Product } from "@/schemas/product.schema";
import { useCartStore } from "@/stores/cartStore";
import { useFilterStore } from "@/stores/filterStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { t } = useTranslation();
  const addToCart = useCartStore((s) => s.addToCart);

  // Zustand filter state
  const search = useFilterStore((s) => s.searchQuery);
  const setSearch = useFilterStore((s) => s.setSearchQuery);
  const selectedCategory = useFilterStore((s) => s.selectedCategory);
  const setSelectedCategory = useFilterStore((s) => s.setSelectedCategory);

  // TanStack Query
  const { data: products, isLoading, isError, error, refetch } = useProducts();

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p: Product) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      if (selectedCategory === "Tüm Ürünler") return matchSearch;
      const cat = CATEGORIES.find((c) => c.label === selectedCategory);
      if (!cat || cat.keywords.length === 0) return matchSearch;
      const nameLower = p.name.toLowerCase();
      const matchCategory = cat.keywords.some((kw) => nameLower.includes(kw));
      return matchSearch && matchCategory;
    });
  }, [products, search, selectedCategory]);

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => router.push(`/product/${item.id}` as any)}
      onAddToCart={() => addToCart(item)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder={t.searchPlaceholder}
        />
        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </View>

      {isLoading ? (
        <ProductListSkeleton count={6} />
      ) : isError ? (
        <View style={styles.errorContainer}>
          <Ionicons
            name="cloud-offline-outline"
            size={48}
            color={colors.danger}
          />
          <Text style={[styles.errorText, { color: colors.danger }]}>
            {error?.message ?? t.errorOccurred}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => refetch()}
          >
            <Text style={styles.retryText}>{t.retry}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  list: {
    padding: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
