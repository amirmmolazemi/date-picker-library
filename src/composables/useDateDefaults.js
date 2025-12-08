import { parseDate } from "@/utils/parseDate";
import { computed } from "vue";

const useDateDefaults = (props) => {
  const defaultDates = computed(() => {
    const defaults = props.defaults;
    if (props.mode === "single") {
      if (!defaults[0]) return null;
      const [year, month, day] = parseDate(defaults[0]);
      return `${year}/${month}/${day}`;
    }
    if (props.mode === "range") {
      if (props.defaults.length < 2) return null;
      const [startYear, startMonth, startDay] = parseDate(defaults[0]);
      const [endYear, endMonth, endDay] = parseDate(defaults[1]);
      return `${startYear}/${startMonth}/${startDay} | ${endYear}/${endMonth}/${endDay}`;
    }
    if (props.mode === "multiple") {
      if (props.defaults.length < 1) return null;
      return props.defaults.map((item) => {
        const [year, month, day] = item.split("/");
        return { year, month, day };
      });
    }
  });

  return { defaultDates };
};

export default useDateDefaults;
