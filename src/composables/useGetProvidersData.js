import { computed } from "vue";

const useGetProvidersData = (getLocaleMessage, locale, date, props) => {
  const currentMonth = computed(() => (date.month ? date.month - 1 : props.todayDate.month - 1));
  const weekdays = computed(() => getLocaleMessage(locale.value).weekdays);
  const todayText = computed(() => getLocaleMessage(locale.value).todayText);
  const mainText = computed(() => getLocaleMessage(locale.value).mainText);
  const direction = computed(() => getLocaleMessage(locale.value).direction);
  const currentMonthText = computed(
    () => getLocaleMessage(locale.value).months[currentMonth.value],
  );
  return { weekdays, todayText, mainText, direction, currentMonthText };
};

export default useGetProvidersData;
