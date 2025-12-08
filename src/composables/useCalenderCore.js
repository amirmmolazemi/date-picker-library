import { computed } from "vue";
import { parseDate } from "@/utils/parseDate";
import { useCalendar } from "@/composables/useCalenderCreator";

const useCalenderCore = (props, today, locale, getLocaleMessage) => {
  const provider = computed(() => getLocaleMessage(locale.value).provider);
  const months = computed(() => getLocaleMessage(locale.value).months);
  const engine = computed(() => useCalendar(provider.value, today.value, [props.min, props.max]));
  const years = computed(() => {
    let start = parseDate(props.min)[0];
    let end = parseDate(props.max)[0];
    return [...Array(end - start + 1).keys()].map((i) => start + i);
  });

  return { months, engine, years };
};

export default useCalenderCore;
