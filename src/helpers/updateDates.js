import sameDate from "@/utils/sameDate";

export const updateSingle = (cell, date) => {
  if (cell.current && cell.enable) date.single = { ...cell };
};

export const updateMultiple = (cell, date) => {
  const idx = date.multiple.findIndex((item) => sameDate(item, cell));
  if (idx !== -1) date.multiple.splice(idx, 1);
  else date.multiple.push({ ...cell });
};

export const updateRange = (cell, date) => {
  if (!cell.enable || !cell.current) return;
  const newDate = { ...cell };
  if (!date.range.start.day) date.range.start = newDate;
  else if (date.range.start.day === cell.day) date.range = { start: {}, end: {} };
  else if (date.range.start.day < cell.day) date.range.end = newDate;
};
