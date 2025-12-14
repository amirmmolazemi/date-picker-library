import { createI18n } from "vue-i18n";
import calendarLocales from "@/constants/calendarLocales.js";

export const i18n = createI18n({ legacy: false, locale: "jalaali", messages: calendarLocales });
