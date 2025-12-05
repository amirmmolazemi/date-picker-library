import {
  addMonths,
  subMonths,
  format,
  getDaysInMonth as fnsGetDaysInMonth,
  startOfMonth,
  getDay,
} from "date-fns";

const newDate = (year, month, day) => new Date(year, month, day);

const getDaysInMonth = (year, month) => {
  const d = newDate(year, month - 1, 1);
  return fnsGetDaysInMonth(d);
};

const getFirstWeekday = (year, month) => {
  const first = startOfMonth(newDate(year, month - 1, 1));
  return (getDay(first) + 1) % 7;
};

const getPreviousMonth = (year, month) => {
  const d = subMonths(newDate(year, month - 1, 1), 1);
  return {
    year: parseInt(format(d, "yyyy")),
    month: parseInt(format(d, "MM")),
  };
};

const getNextMonth = (year, month) => {
  const d = addMonths(newDate(year, month - 1, 1), 1);
  return {
    year: parseInt(format(d, "yyyy")),
    month: parseInt(format(d, "MM")),
  };
};

export const gregorianProvider = { getDaysInMonth, getFirstWeekday, getPreviousMonth, getNextMonth };
