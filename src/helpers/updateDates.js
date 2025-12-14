import isSameDate from "@/utils/isSameDate";

export const updateSingle = (cell, date) => {
  if (cell.current && cell.enable) date.single = { ...date.single, ...cell };
};

export const updateMultiple = (cell, date) => {
  const index = date.multiple.findIndex((item) => isSameDate(item, cell));
  if (index !== -1) date.multiple.splice(index, 1);
  else date.multiple.push({ ...cell });
};

export const updateRange = (cell, date) => {
  if (!cell.enable || !cell.current) return;
  if (!date.range.start.day) date.range.start = { ...cell };
  else if (date.range.start.day === cell.day) date.range = { start: {}, end: {} };
  else if (date.range.start.day < cell.day) date.range.end = { ...cell };
};
