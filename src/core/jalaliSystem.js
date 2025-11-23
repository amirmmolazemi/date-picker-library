import { jalaliToGregorian, isJalaliLeap } from "@/utils/jalaliMath.js";

const getDaysInMonth = (year, month) => {
  if (month >= 1 && month <= 6) return 31;
  if (month >= 7 && month <= 11) return 30;
  return isJalaliLeap(year) ? 30 : 29;
};

const getFirstWeekday = (year, month) => {
  const g = jalaliToGregorian(year, month, 1);
  const d = new Date(Date.UTC(g.gy, g.gm - 1, g.gd));
  const jsDay = d.getUTCDay();
  return (jsDay + 1) % 7;
};

const getPreviousMonth = (year, month) => {
  if (month === 1) return { year: year - 1, month: 12 };
  return { year, month: month - 1 };
};

const getNextMonth = (year, month) => {
  if (month === 12) return { year: year + 1, month: 1 };
  return { year, month: month + 1 };
};

export const jalaliAdapter = {
  getDaysInMonth,
  getFirstWeekday,
  getPreviousMonth,
  getNextMonth,
};
