import { splitDateParts } from "@/utils/splitDateParts";

const isDateWithinRange = (year, month, day, limits) => {
  if (!Array.isArray(limits) || limits.length !== 2) return false;

  const parse = (date) => {
    const [year, month, day] = splitDateParts(date);
    return year * 10000 + month * 100 + day;
  };

  const target = year * 10000 + month * 100 + day;
  const minValue = parse(limits[0]);
  const maxValue = parse(limits[1]);
  return target >= minValue && target <= maxValue;
};

export default isDateWithinRange;
