import { persianToEnglish } from "@/utils/replaceNumbers";

const options = { year: "numeric", month: "numeric", day: "numeric" };

const providers = {
  jalaali: {
    locale: "fa-IR-u-ca-persian",
    parse(date) {
      const formatter = new Intl.DateTimeFormat(this.locale, options);
      const dates = formatter
        .format(date)
        .split("/")
        .map((item) => Number(persianToEnglish(item)));
      const [year, month, day] = dates;
      return { year, month, day };
    },
  },
  gregorian: {
    locale: "en-US",
    parse(date) {
      const formatter = new Intl.DateTimeFormat(this.locale, options);
      const dates = formatter.format(date).split("/").map(Number);
      const [month, day, year] = dates;
      return { year, month, day };
    },
  },
};

const useGetToday = (locale = "jalaali") => {
  const provider = providers[locale];
  const today = new Date();
  return provider.parse(today);
};

export default useGetToday;
