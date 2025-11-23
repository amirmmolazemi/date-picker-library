export function isJalaliLeap(jy) {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394,
    2456, 3178,
  ];

  let bl = breaks.length;
  let gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];
  let jm, jump, N;

  for (let i = 1; i < bl; i++) {
    jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ += Math.floor(jump / 33) * 8 + Math.floor((jump % 33) / 4);
    jp = jm;
  }

  N = jy - jp;
  leapJ += Math.floor(N / 33) * 8 + Math.floor((N % 33) / 4);

  if (jump % 33 === 4 && jump - N === 4) leapJ++;

  const leap = (((leapJ + 1) % 33) - 1) % 4;
  return leap === 0;
}

export function jalaliToGregorian(jy_in, jm_in, jd_in) {
  let jy = jy_in - 979;
  let jm = jm_in - 1;
  let jd = jd_in - 1;

  let j_day_no = 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4);

  for (let i = 0; i < jm; ++i) {
    j_day_no += i < 6 ? 31 : 30;
  }
  j_day_no += jd;

  let g_day_no = j_day_no + 79;

  let gy = 1600 + 400 * Math.floor(g_day_no / 146097);
  g_day_no = g_day_no % 146097;

  let leap = true;
  if (g_day_no >= 36525) {
    g_day_no--;
    gy += 100 * Math.floor(g_day_no / 36524);
    g_day_no = g_day_no % 36524;
    if (g_day_no >= 365) g_day_no++;
    else leap = false;
  }

  gy += 4 * Math.floor(g_day_no / 1461);
  g_day_no %= 1461;

  if (g_day_no >= 366) {
    leap = false;
    g_day_no--;
    gy += Math.floor(g_day_no / 365);
    g_day_no = g_day_no % 365;
  }

  let gm = 0;
  const gregorianMonthDays = (mi, isLeap) => {
    if (mi === 1) return isLeap ? 29 : 28;
    if ([0, 2, 4, 6, 7, 9, 11].includes(mi)) return 31;
    return 30;
  };

  for (gm = 0; gm < 12; gm++) {
    const v = gregorianMonthDays(gm, leap);
    if (g_day_no < v) break;
    g_day_no -= v;
  }
  const gd = g_day_no + 1;
  return { gy, gm: gm + 1, gd };
}
