const englishToPersianDigit = (s) => s.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

export default englishToPersianDigit;
