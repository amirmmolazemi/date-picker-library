import { jalaliAdapter } from "@/core/jalaliSystem";

const langDates = {
  langs: {
    fa: {
      calendar: "jalali",
      adaptor: jalaliAdapter,
      weekdays: ["شنبه", "1شنبه", "2شنبه", "3شنبه", "4شنبه", "5شنبه", "جمعه"],
      months: [
        "فروردین",
        "اردیبهشت",
        "خرداد",
        "تیر",
        "مرداد",
        "شهریور",
        "مهر",
        "آبان",
        "آذر",
        "دی",
        "بهمن",
        "اسفند",
      ],
      translations: {
        label: "شمسی",
      },
    },
    en: {
      calendar: "gregorian",
      adaptor: jalaliAdapter,
      weekdays: ["2شنبه", "3شنبه", "4شنبه", "5شنبه", "جمعه", "شنبه", "یکشنبه"],
      months: [
        "ژانویه",
        "فوریه",
        "مارس",
        "آوریل",
        "مه",
        "ژوئن",
        "ژوئیه",
        "اوت",
        "سپتامبر",
        "اکتبر",
        "نوامبر",
        "دسامبر",
      ],
      translations: {
        label: "میلادی",
      },
    },
  },
};

export { langDates };
