import ProductCard from "@/components/ProductCard";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";
import type { Product } from "@/schemas/product.schema";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function FavoritesScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const router = useRouter();
  const favorites = useFavoritesStore((s) => s.favorites);
  const addToCart = useCartStore((s) => s.addToCart);

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => router.push(`/product/${item.id}` as any)}
      onAddToCart={() => addToCart(item)}
    />
  );

  if (favorites.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={64} color={colors.grayLight} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            {t.noFavorites}
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {t.favoritesHint}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.countRow}>
        <Text style={[styles.countText, { color: colors.textSecondary }]}>
          {favorites.length} {t.favoriteCount}
        </Text>
      </View>
      <FlatList
        data={favorites}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  countRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  countText: {
    fontSize: 13,
    fontWeight: "500",
  },
  list: {
    padding: 10,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
