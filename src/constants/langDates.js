import { jalaliAdapter } from "@/core/jalaliSystem";

const langDates = {
  langs: {
    fa: {
      calendar: "jalali",
      adaptor: jalaliAdapter,
      weekdays: ["شنبه", "۱شنبه", "۲شنبه", "۳شنبه", "۴شنبه", "۵شنبه", "جمعه"],
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
      weekdays: ["۲شنبه", "۳شنبه", "۴شنبه", "۵شنبه", "جمعه", "شنبه", "۱شنبه"],
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
