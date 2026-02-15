import { useColors } from "@/hooks/useColors";
import { useSettingsStore } from "@/stores/settingsStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function AppStack() {
  const isDark = useSettingsStore((s) => s.isDark);
  const colors = useColors();

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "600" },
          contentStyle: { backgroundColor: colors.background },
          headerBackButtonDisplayMode: "minimal",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ title: "Ürün Detay" }} />
        <Stack.Screen name="product/add" options={{ title: "Ürün Ekle" }} />
        <Stack.Screen
          name="product/edit/[id]"
          options={{ title: "Ürün Düzenle" }}
        />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppStack />
    </QueryClientProvider>
  );
}
