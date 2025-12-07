const parseStringDate = (text) => {
  const [year, month, day] = text.split("/").map(Number);
  return { year, month, day };
};

const toStringDate = ({ year, month, day }) => {
  return `${year}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`;
};

const toTimestamp = ({ year, month, day }) => {
  const date = new Date(year, month - 1, day);
  return date.getTime();
};

const formatTemplate = ({ year, month, day }, template) => {
  const map = {
    YYYY: year,
    MM: String(month).padStart(2, "0"),
    DD: String(day).padStart(2, "0"),
  };
  return template.replace(/YYYY|MM|DD/g, (m) => map[m]);
};

const formatObjectTemplate = (dateObj, templateObject) => {
  const output = {};
  let text = "";
  for (const key in templateObject) {
    output[key] = formatTemplate(dateObj, templateObject[key]);
    text += formatTemplate(dateObj, templateObject[key]) + "/";
  }
  text = text.slice(0, -1);
  output.text = text;
  return output;
};

const processSingleDate = (date, format) => {
  const { year, month, day } = date;
  let dateObj;

  if (typeof date === "string") dateObj = parseStringDate(date);
  else if (typeof date === "object") dateObj = { year, month, day };
  if (format === "timestamp") return toTimestamp(dateObj);
  if (typeof format === "string") return formatTemplate(dateObj, format);
  if (typeof format === "object") return formatObjectTemplate(dateObj, format);
  return toStringDate(dateObj);
};

const processRange = (range, format) => {
  const [start, end] = range.split("|").map((s) => s.trim());
  const startDay = processSingleDate(start, format);
  const endDay = processSingleDate(end, format);
  return { start: startDay, end: endDay, text: `${startDay.text} | ${endDay.text}` };
};

const processMultiple = (dates, format) => dates.map((date) => processSingleDate(date, format));

const dateFormatter = (date, format) => {
  if (!date) return;
  if (!Array.isArray(date) && !date.includes("|")) return processSingleDate(date, format);
  if (date.includes("|")) return processRange(date, format);
  if (Array.isArray(date)) return processMultiple(date, format);
  return null;
};

export default dateFormatter;
