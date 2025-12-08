<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import { englishToPersianDigit, persianToEnglish } from "@/utils/replaceNumbers";
import { parseDate } from "@/utils/parseDate";
import wrapList from "@/helpers/wrapList";

const props = defineProps({
  months: Array,
  years: Array,
  engine: Object,
  today: Object,
  min: String,
  max: String,
});

const emit = defineEmits(["changed"]);

const minDate = parseDate(props.min);
const maxDate = parseDate(props.max);

const date = reactive({ ...props.today });
const dayRef = ref(null);
const monthRef = ref(null);
const yearRef = ref(null);
const ignoreInitialEmit = ref(true);

const currentDays = computed(() => wrapList(filteredDays.value));
const currentMonths = computed(() => wrapList(filteredMonths.value));
const currentYears = computed(() => wrapList(props.years));

const filteredMonths = computed(() => {
  if (date.year === minDate[0] && date.year === maxDate[0])
    return props.months.filter((_, idx) => idx + 1 >= minDate[1] && idx + 1 <= maxDate[1]);
  if (date.year === minDate[0]) return props.months.filter((_, idx) => idx + 1 >= minDate[1]);
  if (date.year === maxDate[0]) return props.months.filter((_, idx) => idx + 1 <= maxDate[1]);
  return props.months;
});

const filteredDays = computed(() => {
  const grid = props.engine.grid.value.filter((i) => i.current);
  const days = grid.map((i) => i.day);
  if (date.year === minDate[0] && date.month === minDate[1])
    return days.filter((day) => day >= minDate[2]);
  if (date.year === maxDate[0] && date.month === maxDate[1])
    return days.filter((day) => day <= maxDate[2]);
  return days;
});

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
  const num = clamp(date);
  const year = Math.floor(num / 10000);
  const month = Math.floor((num % 10000) / 100);
  const day = num % 100;
  date.year = year;
  date.month = month;
  date.day = day;
};

const clamp = ({ year, month, day }) => {
  const num = year * 10000 + month * 100 + day;
  const minNum = minDate[0] * 10000 + minDate[1] * 100 + minDate[2];
  const maxNum = maxDate[0] * 10000 + maxDate[1] * 100 + maxDate[2];
  if (num < minNum) return minNum;
  if (num > maxNum) return maxNum;
  return num;
};

watch([() => date.year, () => date.month], () => {
  props.engine.setYear(date.year);
  props.engine.setMonth(date.month);
});

const handlers = {
  day: (num) => (date.day = Number(persianToEnglish(num))),
  month: (num) => (date.month = filteredMonths.value.indexOf(num) + 1),
  year: (num) => (date.year = Number(persianToEnglish(num))),
};

const makeScrollHandler = (ref, key) => {
  return () => {
    const element = pickCenterItem(ref.value);
    if (!element) return;
    handlers[key](element.innerText);
    clampAndApply();
  };
};

const handleDayScroll = makeScrollHandler(dayRef, "day");
const handleMonthScroll = makeScrollHandler(monthRef, "month");
const handleYearScroll = makeScrollHandler(yearRef, "year");

useInfiniteScroll(dayRef, () => filteredDays.value);
useInfiniteScroll(monthRef, () => filteredMonths.value);
useInfiniteScroll(yearRef, () => props.years);

watch(date, () => {
  if (ignoreInitialEmit.value) return;
  emit("changed", {
    status: true,
    date: `${date.year}/${date.month}/${date.day}`,
  });
});

const scrollToToday = (ref) => {
  const element = ref.value?.querySelector(".calender__block__text--today");
  if (element) element.scrollIntoView({ block: "center" });
};

onMounted(async () => {
  await nextTick();
  [dayRef, monthRef, yearRef].forEach(scrollToToday);
  ignoreInitialEmit.value = false;
});
</script>

<template>
  <div class="calender">
    <div class="calender__block" ref="dayRef" @scroll="handleDayScroll">
      <span
        v-for="(item, i) in currentDays"
        :key="i"
        class="calender__block__text"
        :class="{
          'calender__block__text--today': date.day === item.value && item.zone === 'original',
        }"
      >
        {{ englishToPersianDigit(item.value) }}
      </span>
    </div>
    <div class="calender__block" ref="monthRef" @scroll="handleMonthScroll">
      <span
        v-for="(item, i) in currentMonths"
        :key="i"
        class="calender__block__text"
        :class="{
          'calender__block__text--today':
            date.month === filteredMonths.indexOf(item.value) + 1 && item.zone === 'original',
        }"
      >
        {{ item.value }}
      </span>
    </div>
    <div class="calender__block" ref="yearRef" @scroll="handleYearScroll">
      <span
        v-for="(item, i) in currentYears"
        :key="i"
        class="calender__block__text"
        :class="{
          'calender__block__text--today': date.year === item.value && item.zone === 'original',
        }"
      >
        {{ item.value }}
      </span>
    </div>
  </div>
</template>
