import { ref, computed } from "vue";

export const createCalendarEngine = (adapter, initialYear, initialMonth) => {
  const year = ref(initialYear);
  const month = ref(initialMonth);

  const setYear = (y) => (year.value = y);
  const setMonth = (m) => (month.value = m);

  const prevMonth = () => {
    const prev = adapter.getPreviousMonth(year.value, month.value);
    year.value = prev.year;
    month.value = prev.month;
  };

  const nextMonth = () => {
    const next = adapter.getNextMonth(year.value, month.value);
    year.value = next.year;
    month.value = next.month;
  };

  const grid = computed(() => {
    const cells = [];
    const daysInMonth = adapter.getDaysInMonth(year.value, month.value);
    const firstWeekday = adapter.getFirstWeekday(year.value, month.value);
    const prev = adapter.getPreviousMonth(year.value, month.value);
    const daysInPrev = adapter.getDaysInMonth(prev.year, prev.month);

    const prefix = firstWeekday;
    for (let i = prefix - 1; i >= 0; i--) {
      cells.push({ year: prev.year, month: prev.month, day: daysInPrev - i, current: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ year: year.value, month: month.value, day, current: true });
    }

    // const nextMonth = adapter.getNextMonth(year.value, month.value);
    // const remainingDayOftheMonth = 35 - cells.length;
    // for (let i = 1; i <= remainingDayOftheMonth; i++) {
    //   cells.push({ year: nextMonth.year, month: nextMonth.month, day: i, current: false });
    // }

    return cells.slice(0, 35);
  });

  return {
    year,
    month,
    setYear,
    setMonth,
    prevMonth,
    nextMonth,
    grid,
    adapter,
  };
};
