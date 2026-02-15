import { getProductImage } from "@/constants/Types";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";
import { useCartStore } from "@/stores/cartStore";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CartScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);

  if (items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.empty}>
          <Ionicons name="cart-outline" size={64} color={colors.grayLight} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {t.emptyCart}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            {(() => {
              const imgUrl = getProductImage(item.product);
              return imgUrl ? (
                <Image source={{ uri: imgUrl }} style={styles.productImage} />
              ) : (
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Ionicons
                    name="cube-outline"
                    size={28}
                    color={colors.primary}
                  />
                </View>
              );
            })()}
            <View style={styles.info}>
              <Text
                style={[styles.name, { color: colors.text }]}
                numberOfLines={2}
              >
                {item.product.name}
              </Text>
              <View style={styles.quantityRow}>
                <TouchableOpacity
                  style={[styles.qtyBtn, { backgroundColor: colors.grayLight }]}
                  onPress={() =>
                    updateQuantity(item.product.id, item.quantity - 1)
                  }
                >
                  <Ionicons name="remove" size={18} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.qtyText, { color: colors.text }]}>
                  {item.quantity}
                </Text>
                <TouchableOpacity
                  style={[styles.qtyBtn, { backgroundColor: colors.grayLight }]}
                  onPress={() =>
                    updateQuantity(item.product.id, item.quantity + 1)
                  }
                >
                  <Ionicons name="add" size={18} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.product.id)}>
              <Ionicons name="trash-outline" size={22} color={colors.danger} />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        style={[styles.clearButton, { backgroundColor: colors.danger }]}
        onPress={clearCart}
      >
        <Text style={styles.clearText}>{t.clearCart}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
  },
  list: {
    padding: 16,
    gap: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "700",
  },
  clearButton: {
    margin: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  clearText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
