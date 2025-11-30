const wrapList = (list, count = 2) => {
  if (!Array.isArray(list)) return [];
  if (list.length <= count * 2) return [...list, ...list, ...list].map((i) => ({ value: i }));
  const start = list.slice(0, count).map((i) => ({ value: i }));
  const end = list.slice(list.length - count).map((i) => ({ value: i }));
  const middle = list.map((i) => ({ value: i, zone: "original" }));
  return [...end, ...middle, ...start];
};

export default wrapList;
