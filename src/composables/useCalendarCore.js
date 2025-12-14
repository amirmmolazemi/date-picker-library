import { computed } from "vue";
import { splitDateParts } from "@/utils/splitDateParts";
import { useCalendar } from "@/composables/useCalendarCreator";

const useCalendarCore = (props, today, locale, getLocaleMessage) => {
  const provider = computed(() => getLocaleMessage(locale.value).provider);
  const availableMonths = computed(() => getLocaleMessage(locale.value).months);
  const calendarEngine = computed(() => useCalendar(provider.value, today, [props.min, props.max]));
  const availableYears = computed(() => {
    let start = splitDateParts(props.min)[0];
    let end = splitDateParts(props.max)[0];
    return [...Array(end - start + 1).keys()].map((i) => start + i);
  });

  return { availableMonths, calendarEngine, availableYears };
};

export default useCalendarCore;
