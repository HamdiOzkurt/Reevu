import { Product, getProductImage } from "@/constants/Types";
import { useColors } from "@/hooks/useColors";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
}

export default function ProductCard({
  product,
  onPress,
  onAddToCart,
}: ProductCardProps) {
  const colors = useColors();
  const imageUrl = getProductImage(product);
  const reviewCount = Array.isArray(product.reviews)
    ? product.reviews.length
    : 0;
  const isFav = useFavoritesStore((s) => s.isFavorite(product.id));
  const toggleFav = useFavoritesStore((s) => s.toggleFavorite);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {imageUrl ? (
        <View>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <TouchableOpacity
            style={styles.heartButton}
            onPress={(e) => {
              e.stopPropagation();
              toggleFav(product);
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={20}
              color={isFav ? "#EF4444" : "#FFF"}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={[styles.placeholder, { backgroundColor: colors.background }]}
        >
          <Ionicons name="cube-outline" size={36} color={colors.primary} />
          <TouchableOpacity
            style={[styles.heartButton, { top: 6, right: 6 }]}
            onPress={(e) => {
              e.stopPropagation();
              toggleFav(product);
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={20}
              color={isFav ? "#EF4444" : colors.gray}
            />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.bottomRow}>
          <View style={styles.reviewBadge}>
            <Ionicons name="chatbubble-outline" size={12} color={colors.gray} />
            <Text style={[styles.reviewCount, { color: colors.gray }]}>
              {reviewCount}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
          >
            <Ionicons name="cart-outline" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    margin: 6,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  heartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  reviewCount: {
    fontSize: 11,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
