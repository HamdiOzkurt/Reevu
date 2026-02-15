import { Colors, ThemeColors } from "@/constants/Colors";
import { useSettingsStore } from "@/stores/settingsStore";

export function useColors(): ThemeColors {
  const isDark = useSettingsStore((s) => s.isDark);
  return isDark ? Colors.dark : Colors.light;
}
