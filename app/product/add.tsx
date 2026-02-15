import { useColors } from "@/hooks/useColors";
import { useCreateProduct } from "@/hooks/useProductQueries";
import {
  ProductFormSchema,
  type ProductFormData,
} from "@/schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProductAdd() {
  const router = useRouter();
  const colors = useColors();
  const createMutation = useCreateProduct();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: { name: "", barcode: "" },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      await createMutation.mutateAsync(data);
      router.back();
    } catch {
      Alert.alert("Hata", "Ürün eklenemedi. Lütfen tekrar deneyiniz.");
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.form}>
        {/* Ürün Adı */}
        <Text style={[styles.label, { color: colors.text }]}>Ürün Adı</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  borderColor: errors.name ? colors.danger : colors.border,
                  color: colors.text,
                },
              ]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Ürün adı girin"
              placeholderTextColor={colors.gray}
            />
          )}
        />
        {errors.name && (
          <Text style={[styles.errorText, { color: colors.danger }]}>
            {errors.name.message}
          </Text>
        )}

        {/* Barkod */}
        <Text style={[styles.label, { color: colors.text }]}>Barkod</Text>
        <Controller
          control={control}
          name="barcode"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  borderColor: errors.barcode ? colors.danger : colors.border,
                  color: colors.text,
                },
              ]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Barkod numarası"
              placeholderTextColor={colors.gray}
              keyboardType="numeric"
            />
          )}
        />
        {errors.barcode && (
          <Text style={[styles.errorText, { color: colors.danger }]}>
            {errors.barcode.message}
          </Text>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              {
                backgroundColor: colors.primary,
                opacity: isSubmitting ? 0.6 : 1,
              },
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.saveText}>Kaydet</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: colors.grayLight }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
              İptal
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 12,
    marginLeft: 4,
    marginTop: 2,
  },
});
