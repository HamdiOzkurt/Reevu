import { ProductDetailSkeleton } from "@/components/SkeletonLoader";
import { useColors } from "@/hooks/useColors";
import { useProduct, useProductReviews } from "@/hooks/useProductQueries";
import { useTranslation } from "@/hooks/useTranslation";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const { t } = useTranslation();
  const addToCart = useCartStore((s) => s.addToCart);
  const isFav = useFavoritesStore((s) => s.isFavorite(Number(id)));
  const toggleFav = useFavoritesStore((s) => s.toggleFavorite);
  const [addingToCart, setAddingToCart] = React.useState(false);
  const numericId = Number(id);

  const handleAddToCart = () => {
    if (addingToCart || !product) return;
    setAddingToCart(true);
    addToCart(product);
    setTimeout(() => setAddingToCart(false), 800);
  };

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useProduct(numericId);

  // Review'ları ayrı hook ile çek (tam ReviewSchema doğrulaması ile)
  const { data: reviews = [] } = useProductReviews(numericId);

  if (isLoading) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <ProductDetailSkeleton />
      </ScrollView>
    );
  }

  if (isError || !product) {
    return (
      <View
        style={[styles.errorContainer, { backgroundColor: colors.background }]}
      >
        <Ionicons
          name="cloud-offline-outline"
          size={48}
          color={colors.danger}
        />
        <Text style={[styles.errorText, { color: colors.danger }]}>
          {error?.message ?? t.productLoadError}
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={() => refetch()}
        >
          <Text style={styles.retryText}>{t.retry}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.content, { backgroundColor: colors.card }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.name, { color: colors.text, flex: 1 }]}>
            {product.name}
          </Text>
          <TouchableOpacity
            onPress={() => toggleFav(product)}
            style={styles.favButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={26}
              color={isFav ? "#EF4444" : colors.gray}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.badge, { backgroundColor: colors.background }]}>
            <Ionicons
              name="chatbubble-outline"
              size={14}
              color={colors.primary}
            />
            <Text style={[styles.badgeText, { color: colors.text }]}>
              {reviews.length} {t.reviews}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.cartButton,
            {
              backgroundColor: colors.primary,
              opacity: addingToCart ? 0.7 : 1,
            },
          ]}
          onPress={handleAddToCart}
          activeOpacity={0.7}
          disabled={addingToCart}
        >
          {addingToCart ? (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#FFF" />
              <Text style={styles.cartButtonText}>{t.added}</Text>
            </>
          ) : (
            <>
              <Ionicons name="cart-outline" size={20} color="#FFF" />
              <Text style={styles.cartButtonText}>{t.addToCart}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Yorumlar */}
      <View style={styles.reviewSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t.reviewsTitle}
        </Text>
        {reviews.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {t.noReviews}
          </Text>
        ) : (
          reviews.map((review) => (
            <View
              key={review.id}
              style={[styles.reviewCard, { backgroundColor: colors.card }]}
            >
              <View style={styles.reviewHeader}>
                <Text style={[styles.reviewUser, { color: colors.text }]}>
                  {review.user_full_name}
                </Text>
                <View style={styles.stars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < review.rate ? "star" : "star-outline"}
                      size={14}
                      color={colors.orange}
                    />
                  ))}
                </View>
              </View>
              <Text
                style={[styles.reviewComment, { color: colors.textSecondary }]}
              >
                {review.comment}
              </Text>
              {review.images && review.images.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.imageRow}
                >
                  {review.images.map((img: string, idx: number) => (
                    <Image
                      key={idx}
                      source={{ uri: img }}
                      style={[
                        styles.reviewImage,
                        { backgroundColor: colors.grayLight },
                      ]}
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 6,
  },
  favButton: {
    paddingTop: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "500",
  },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  cartButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  reviewSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
  },
  reviewCard: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: "600",
  },
  stars: {
    flexDirection: "row",
    gap: 2,
  },
  reviewComment: {
    fontSize: 13,
    lineHeight: 20,
  },
  imageRow: {
    marginTop: 8,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
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
