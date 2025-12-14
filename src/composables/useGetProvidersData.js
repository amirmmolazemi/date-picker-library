import { computed } from "vue";

const useGetProvidersData = (getLocaleMessage, locale, date, currentDate) => {
  const currentMonth = computed(() => (date.month ? date.month - 1 : currentDate.month - 1));
  const weekdays = computed(() => getLocaleMessage(locale.value).weekdays);
  const direction = computed(() => getLocaleMessage(locale.value).direction);
  const currentMonthText = computed(
    () => getLocaleMessage(locale.value).months[currentMonth.value],
  );
  return { weekdays, direction, currentMonthText };
};

export default useGetProvidersData;
