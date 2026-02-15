import { getTranslations, translateCategory } from "@/constants/i18n";
import { useSettingsStore } from "@/stores/settingsStore";

export function useTranslation() {
  const language = useSettingsStore((s) => s.language);
  const t = getTranslations(language);
  const tc = (label: string) => translateCategory(label, language);
  return { t, tc, language };
}
