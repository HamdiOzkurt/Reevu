import { useColors } from "@/hooks/useColors";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, type ViewStyle } from "react-native";

interface SkeletonProps {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

function SkeletonBox({
  width,
  height,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const colors = useColors();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.grayLight,
          opacity,
        },
        style,
      ]}
    />
  );
}

/** Anasayfa ürün kartları için Skeleton */
export function ProductCardSkeleton() {
  return (
    <View style={styles.card}>
      <SkeletonBox width="100%" height={120} borderRadius={12} />
      <View style={styles.cardContent}>
        <SkeletonBox width="80%" height={14} />
        <SkeletonBox width="50%" height={12} style={{ marginTop: 8 }} />
        <View style={styles.cardBottom}>
          <SkeletonBox width={50} height={20} borderRadius={10} />
          <SkeletonBox width={32} height={32} borderRadius={16} />
        </View>
      </View>
    </View>
  );
}

/** Ürün listesi için Skeleton Grid */
export function ProductListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </View>
  );
}

/** Ürün detay sayfası Skeleton */
export function ProductDetailSkeleton() {
  return (
    <View style={styles.detailContainer}>
      <View style={styles.detailCard}>
        <SkeletonBox width="90%" height={22} />
        <SkeletonBox width="40%" height={14} style={{ marginTop: 8 }} />
        <SkeletonBox
          width={100}
          height={30}
          borderRadius={15}
          style={{ marginTop: 16 }}
        />
        <SkeletonBox
          width="100%"
          height={48}
          borderRadius={12}
          style={{ marginTop: 16 }}
        />
      </View>
      <View style={styles.reviews}>
        <SkeletonBox width={120} height={20} />
        {Array.from({ length: 3 }).map((_, i) => (
          <View key={i} style={styles.reviewSkeleton}>
            <SkeletonBox width="60%" height={14} />
            <SkeletonBox width="100%" height={40} style={{ marginTop: 8 }} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardContent: {
    padding: 10,
    gap: 4,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  detailContainer: {
    flex: 1,
  },
  detailCard: {
    padding: 20,
    marginBottom: 8,
  },
  reviews: {
    padding: 16,
    gap: 12,
  },
  reviewSkeleton: {
    padding: 14,
    borderRadius: 10,
  },
});

export default SkeletonBox;
