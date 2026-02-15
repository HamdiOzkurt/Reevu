import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ThemeMode = "light" | "dark";
type Language = "Türkçe" | "English" | "Deutsch" | "Français" | "العربية";

interface SettingsState {
  // Tema
  themeMode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;

  // Dil
  language: Language;
  setLanguage: (lang: Language) => void;

  // Bildirimler
  notifications: boolean;
  setNotifications: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Tema
      themeMode: "light",
      isDark: false,
      toggleTheme: () =>
        set((state) => {
          const newMode = state.themeMode === "light" ? "dark" : "light";
          return { themeMode: newMode, isDark: newMode === "dark" };
        }),
      setThemeMode: (mode) => set({ themeMode: mode, isDark: mode === "dark" }),

      // Dil
      language: "Türkçe",
      setLanguage: (lang) => set({ language: lang }),

      // Bildirimler
      notifications: true,
      setNotifications: (enabled) => set({ notifications: enabled }),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        themeMode: state.themeMode,
        isDark: state.isDark,
        language: state.language,
        notifications: state.notifications,
      }),
    },
  ),
);
