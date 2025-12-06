import { createI18n } from "vue-i18n";
import { langDates } from "@/constants/langDates";

export const i18n = createI18n({
  legacy: false,
  locale: "jalaali",
  messages: langDates.langs,
});
