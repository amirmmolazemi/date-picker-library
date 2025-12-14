import { computed, reactive } from "vue";
import isDateWithinRange from "@/helpers/isDateWithinRange";

const DAYS_IN_GRID = 35;

export const useCalendar = (provider, { year, month }, limits) => {
  const initialDate = reactive({ year, month });
  const enabledCache = new Map();

  const updateYear = (y) => (initialDate.year = y);
  const updateMonth = (m) => (initialDate.month = m);

  const calendarGrid = computed(() => {
    const cells = [];

    const daysInCurrentMonth = provider.getDaysInMonth(initialDate.year, initialDate.month);
    const firstWeekday = provider.getFirstWeekday(initialDate.year, initialDate.month);

    const { year: previousYear, month: previousMonth } = provider.getPreviousMonth(
      initialDate.year,
      initialDate.month,
    );
    const daysInPreviousMonth = provider.getDaysInMonth(previousYear, previousMonth);

    for (let i = firstWeekday - 1; i >= 0; i--) {
      const day = daysInPreviousMonth - i;
      cells.push(createCell(previousYear, previousMonth, day, false));
    }

    for (let day = 1; day <= daysInCurrentMonth; day++) {
      cells.push(createCell(initialDate.year, initialDate.month, day, true));
    }

    const { year: nextYear, month: nextMonth } = provider.getNextMonth(
      initialDate.year,
      initialDate.month,
    );
    const remainingCells = DAYS_IN_GRID - cells.length;
    for (let day = 1; day <= remainingCells; day++) {
      cells.push(createCell(nextYear, nextMonth, day, false));
    }

    return cells;
  });

  const isEnabled = (year, month, day) => {
    const key = `${year}-${month}-${day}`;
    if (!enabledCache.has(key)) enabledCache.set(key, isDateWithinRange(year, month, day, limits));
    return enabledCache.get(key);
  };

  const createCell = (year, month, day, current) => {
    return { year, month, day, current, enable: isEnabled(year, month, day) };
  };

  return { updateYear, updateMonth, calendarGrid };
};
