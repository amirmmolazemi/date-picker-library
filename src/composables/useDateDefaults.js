import { splitDateParts } from "@/utils/splitDateParts";
import { computed } from "vue";

const useDateDefaults = (props) => {
  const defaultDates = computed(() => {
    const defaults = props.defaults;
    switch (props.mode) {
      case "single":
        if (!defaults[0]) return null;
        const [year, month, day] = splitDateParts(defaults[0]);
        return `${year}/${month}/${day}`;
      case "range":
        if (props.defaults.length < 2) return null;
        const [startYear, startMonth, startDay] = splitDateParts(defaults[0]);
        const [endYear, endMonth, endDay] = splitDateParts(defaults[1]);
        return `${startYear}/${startMonth}/${startDay} | ${endYear}/${endMonth}/${endDay}`;
      case "multiple":
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
