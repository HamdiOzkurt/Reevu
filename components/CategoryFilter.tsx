import { CATEGORIES } from "@/constants/Types";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

interface CategoryFilterProps {
  selected: string;
  onSelect: (label: string) => void;
}

export default function CategoryFilter({
  selected,
  onSelect,
}: CategoryFilterProps) {
  const colors = useColors();
  const { tc } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((cat) => {
        const active = selected === cat.label;
        return (
          <Pressable
            key={cat.label}
            style={[
              styles.chip,
              { backgroundColor: active ? colors.primary : colors.grayLight },
            ]}
            onPress={() => onSelect(cat.label)}
          >
            <Text
              style={[
                styles.chipText,
                { color: active ? "#FFF" : colors.textSecondary },
              ]}
            >
              {tc(cat.label)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingVertical: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
