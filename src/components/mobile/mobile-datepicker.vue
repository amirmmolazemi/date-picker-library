<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import { englishToPersianDigit, persianToEnglish } from "@/utils/replaceNumbers";
import wrapList from "@/utils/wrapList";

const props = defineProps({
  activeLang: String,
  months: Array,
  years: Array,
  engine: Object,
  today: Object,
  min: String,
  max: String,
});

const parseDate = (v) => {
  const [y, m, d] = v.split("/").map(Number);
  return { y, m, d };
};

const minDate = parseDate(props.min);
const maxDate = parseDate(props.max);

const clamp = (y, m, d) => {
  const num = y * 10000 + m * 100 + d;
  const minNum = minDate.y * 10000 + minDate.m * 100 + minDate.d;
  const maxNum = maxDate.y * 10000 + maxDate.m * 100 + maxDate.d;
  if (num < minNum) return minNum;
  if (num > maxNum) return maxNum;
  return num;
};

const filteredYears = computed(() => props.years.filter((y) => y >= minDate.y && y <= maxDate.y));

const filteredMonths = computed(() => {
  if (date.year === minDate.y && date.year === maxDate.y)
    return props.months.filter((_, idx) => idx + 1 >= minDate.m && idx + 1 <= maxDate.m);
  if (date.year === minDate.y) return props.months.filter((_, idx) => idx + 1 >= minDate.m);
  if (date.year === maxDate.y) return props.months.filter((_, idx) => idx + 1 <= maxDate.m);
  return props.months;
});

const filteredDays = computed(() => {
  const grid = props.engine.grid.value.filter((i) => i.current);
  const days = grid.map((i) => i.day);
  if (date.year === minDate.y && date.month === minDate.m)
    return days.filter((d) => d >= minDate.d);
  if (date.year === maxDate.y && date.month === maxDate.m)
    return days.filter((d) => d <= maxDate.d);
  return days;
});

const date = reactive({ ...props.today });
const selectedDate = reactive({ day: date.day, month: date.month, year: date.year });
const ignoreInitialEmit = ref(true);

const dayRef = ref(null);
const monthRef = ref(null);
const yearRef = ref(null);

const currentDays = computed(() => wrapList(filteredDays.value));
const currentMonths = computed(() => wrapList(filteredMonths.value));
const currentYears = computed(() => wrapList(filteredYears.value));

const pickCenterItem = (container) => {
  if (!container) return null;
  const center = container.scrollTop + container.clientHeight / 2;
  const items = container.children;
  let best = null;
  let bestDiff = Infinity;
  for (const item of items) {
    const itemCenter = item.offsetTop + item.offsetHeight / 2;
    const diff = Math.abs(itemCenter - center);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = item;
    }
  }
  return best;
};

const clampAndApply = () => {
  const num = clamp(date.year, date.month, date.day);
  const year = Math.floor(num / 10000);
  const month = Math.floor((num % 10000) / 100);
  const day = num % 100;
  date.year = year;
  date.month = month;
  date.day = day;
  selectedDate.year = year;
  selectedDate.month = month;
  selectedDate.day = day;
};

watch([() => date.year, () => date.month], () => {
  props.engine.setYear(date.year);
  props.engine.setMonth(date.month);
});

const handlers = {
  day: (v) => {
    date.day = Number(persianToEnglish(v));
    clampAndApply();
  },
  month: (v) => {
    date.month = filteredMonths.value.indexOf(v) + 1;
    clampAndApply();
  },
  year: (v) => {
    date.year = Number(persianToEnglish(v));
    clampAndApply();
  },
};

const makeScrollHandler = (ref, key) => {
  return () => {
    const element = pickCenterItem(ref.value);
    if (!element) return;
    handlers[key](element.innerText);
  };
};

const handleDayScroll = makeScrollHandler(dayRef, "day");
const handleMonthScroll = makeScrollHandler(monthRef, "month");
const handleYearScroll = makeScrollHandler(yearRef, "year");

useInfiniteScroll(dayRef, () => filteredDays.value, { distance: 32 });
useInfiniteScroll(monthRef, () => filteredMonths.value, { distance: 32 });
useInfiniteScroll(yearRef, () => filteredYears.value, { distance: 32 });

const emit = defineEmits(["changed"]);

watch(selectedDate, () => {
  if (ignoreInitialEmit.value) return;
  emit("changed", {
    status: "mobile",
    date: `${selectedDate.year}/${selectedDate.month}/${selectedDate.day}`,
  });
});

const scrollToToday = (ref) => {
  const element = ref.value?.querySelector(".today");
  if (element) element.scrollIntoView({ block: "center" });
};

onMounted(async () => {
  await nextTick();
  [dayRef, monthRef, yearRef].forEach(scrollToToday);
  await nextTick();
  ignoreInitialEmit.value = false;
});
</script>

<template>
  <div class="calender">
    <div class="calender__block" ref="dayRef" @scroll="handleDayScroll">
      <span v-for="(item, i) in currentDays" :key="i" class="calender__block--text"
        :class="{ today: date.day === item.value && item.zone === 'original' }">
        {{ englishToPersianDigit(item.value) }}
      </span>
    </div>
    <div class="calender__block" ref="monthRef" @scroll="handleMonthScroll">
      <span v-for="(item, i) in currentMonths" :key="i" class="calender__block--text" :class="{
        today: date.month === filteredMonths.indexOf(item.value) + 1 && item.zone === 'original',
      }">
        {{ item.value }}
      </span>
    </div>
    <div class="calender__block" ref="yearRef" @scroll="handleYearScroll">
      <span v-for="(item, i) in currentYears" :key="i" class="calender__block--text"
        :class="{ today: date.year === item.value && item.zone === 'original' }">
        {{ item.value }}
      </span>
    </div>
  </div>
</template>
