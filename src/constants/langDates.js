import { gregorianProvider } from "@/providers/gregorianProvider";
import { jalaliProvider } from "@/providers/jalaliProvider";

const langDates = {
  langs: {
    jalaali: {
      provider: jalaliProvider,
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
      label: "شمسی",
      direction: "rtl",
      mainText: "تاریخ را انتخاب نمایید",
      todayText: "امروز",
    },
    gregorian: {
      provider: gregorianProvider,
      weekdays: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      label: "gregorian",
      direction: "ltr",
      mainText: "please select a date",
      todayText: "today",
    },
  },
};

export { langDates };
