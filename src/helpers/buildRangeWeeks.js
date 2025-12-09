export const buildRangeWeeks = (cells, startIndex, endIndex) => {
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    const weekStart = i;
    const weekEnd = i + 6;

    const hasStart = startIndex >= weekStart && startIndex <= weekEnd;
    const hasEnd = endIndex >= weekStart && endIndex <= weekEnd;

    if (hasStart && hasEnd) weeks.push({ from: startIndex, to: endIndex });
    else if (hasStart) weeks.push({ from: startIndex, to: weekEnd });
    else if (hasEnd) weeks.push({ from: weekStart, to: endIndex });
    else if (weekStart > startIndex && weekEnd < endIndex)
      weeks.push({ from: weekStart, to: weekEnd });
  }
  return weeks;
};
