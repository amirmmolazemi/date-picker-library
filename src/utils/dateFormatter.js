const dateFormatter = (date, format = "YYYY/MM/DD") => {
  if (!date && !format) return;
  const [year, month, day] = date.split("/");
  const dates = { YYYY: year, MM: month.padStart(2, "0"), DD: day.padStart(2, "0") };
  return format.replace(/YYYY|MM|DD/g, (match) => dates[match]);
};

export default dateFormatter;
