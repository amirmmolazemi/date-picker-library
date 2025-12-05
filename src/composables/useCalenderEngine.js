import enabledDate from "@/utils/enabledDate";
import { ref, computed } from "vue";

export const createCalendarEngine = (provider, initialDate, limits) => {
  const year = ref(initialDate.year);
  const month = ref(initialDate.month);

  const setYear = (y) => (year.value = y);
  const setMonth = (m) => (month.value = m);

  const grid = computed(() => {
    const cells = [];
    const daysInMonth = provider.getDaysInMonth(year.value, month.value);
    const firstWeekday = provider.getFirstWeekday(year.value, month.value);
    const prev = provider.getPreviousMonth(year.value, month.value);
    const daysInPrev = provider.getDaysInMonth(prev.year, prev.month);

    const prefix = firstWeekday;
    for (let i = prefix - 1; i >= 0; i--) {
      const day = daysInPrev - i;
      cells.push({
        year: prev.year,
        month: prev.month,
        day,
        current: false,
        enable: enabledDate(prev.year, prev.month, day, limits, provider),
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({
        year: year.value,
        month: month.value,
        day,
        current: true,
        enable: enabledDate(year.value, month.value, day, limits, provider),
      });
    }

    const nextMonth = provider.getNextMonth(year.value, month.value);
    const remaining = 35 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      cells.push({
        year: nextMonth.year,
        month: nextMonth.month,
        day: i,
        current: false,
        enable: enabledDate(nextMonth.year, nextMonth.month, i, limits, provider),
      });
    }

    return cells.slice(0, 37);
  });

  return { setYear, setMonth, grid };
};
