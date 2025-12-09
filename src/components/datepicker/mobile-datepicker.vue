<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import { englishToPersianDigit, persianToEnglish } from "@/utils/replaceNumbers";
import { parseDate } from "@/utils/parseDate";
import wrapList from "@/helpers/wrapList";

const props = defineProps({
  availableMonths: { type: Array, required: true },
  availableYears: { type: Array, required: true },
  calenderEngine: { type: Object, required: true },
  today: { type: Object, required: true },
  minDate: { type: String, default: "1404/01/08", required: true },
  maxDate: { type: String, default: "2026/12/08", required: true },
});

const emit = defineEmits(["changed", "update-month", "update-year"]);

const minDate = parseDate(props.minDate);
const maxDate = parseDate(props.maxDate);

const selectedDate = reactive({ ...props.today });
const dayColumnRef = ref(null);
const monthColumnRef = ref(null);
const yearColumnRef = ref(null);
const skipInitialEmit = ref(true);

const scrollableDays = computed(() => wrapList(filteredDays.value));
const scrollableMonths = computed(() => wrapList(filteredMonths.value));
const scrollableYears = computed(() => wrapList(props.availableYears));

const filteredMonths = computed(() => {
  if (selectedDate.year === minDate[0] && selectedDate.year === maxDate[0])
    return props.availableMonths.filter((_, idx) => idx + 1 >= minDate[1] && idx + 1 <= maxDate[1]);
  if (selectedDate.year === minDate[0])
    return props.availableMonths.filter((_, idx) => idx + 1 >= minDate[1]);
  if (selectedDate.year === maxDate[0])
    return props.availableMonths.filter((_, idx) => idx + 1 <= maxDate[1]);
  return props.availableMonths;
});

const filteredDays = computed(() => {
  const grid = props.calenderEngine.calendarGrid.value.filter((i) => i.current);
  const days = grid.map((i) => i.day);
  if (selectedDate.year === minDate[0] && selectedDate.month === minDate[1])
    return days.filter((day) => day >= minDate[2]);
  if (selectedDate.year === maxDate[0] && selectedDate.month === maxDate[1])
    return days.filter((day) => day <= maxDate[2]);
  return days;
});

const getCenterVisibleItem = (container) => {
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

const clampSelectedDateWithinRange = () => {
  const num = clampDateValue(selectedDate);
  const year = Math.floor(num / 10000);
  const month = Math.floor((num % 10000) / 100);
  const day = num % 100;
  selectedDate.year = year;
  selectedDate.month = month;
  selectedDate.day = day;
};

const clampDateValue = ({ year, month, day }) => {
  const num = year * 10000 + month * 100 + day;
  const minNum = minDate[0] * 10000 + minDate[1] * 100 + minDate[2];
  const maxNum = maxDate[0] * 10000 + maxDate[1] * 100 + maxDate[2];
  if (num < minNum) return minNum;
  if (num > maxNum) return maxNum;
  return num;
};

watch([() => selectedDate.year, () => selectedDate.month], () => {
  emit("update-year", selectedDate.year);
  emit("update-month", selectedDate.month);
});

const handlers = {
  day: (num) => (selectedDate.day = Number(persianToEnglish(num))),
  month: (num) => (selectedDate.month = filteredMonths.value.indexOf(num) + 1),
  year: (num) => (selectedDate.year = Number(persianToEnglish(num))),
};

const makeScrollHandler = (ref, key) => {
  return () => {
    const element = getCenterVisibleItem(ref.value);
    if (!element) return;
    handlers[key](element.innerText);
    clampSelectedDateWithinRange();
  };
};

const handleDayScroll = makeScrollHandler(dayColumnRef, "day");
const handleMonthScroll = makeScrollHandler(monthColumnRef, "month");
const handleYearScroll = makeScrollHandler(yearColumnRef, "year");

useInfiniteScroll(dayColumnRef, () => filteredDays.value);
useInfiniteScroll(monthColumnRef, () => filteredMonths.value);
useInfiniteScroll(yearColumnRef, () => props.availableYears);

watch(selectedDate, () => {
  if (skipInitialEmit.value) return;
  emit("changed", { status: true, ...selectedDate });
});

const scrollColumnToCurrentDate = (ref) => {
  const element = ref.value?.querySelector(".calender__block__text--today");
  if (element) element.scrollIntoView({ block: "center" });
};

onMounted(async () => {
  await nextTick();
  [dayColumnRef, monthColumnRef, yearColumnRef].forEach(scrollColumnToCurrentDate);
  skipInitialEmit.value = false;
});
</script>

<template>
  <div class="calender">
    <div class="calender__block" ref="dayColumnRef" @scroll="handleDayScroll">
      <span
        v-for="(item, i) in scrollableDays"
        :key="i"
        class="calender__block__text"
        :class="{
          'calender__block__text--today':
            selectedDate.day === item.value && item.zone === 'original',
        }"
      >
        {{ englishToPersianDigit(item.value) }}
      </span>
    </div>
    <div class="calender__block" ref="monthColumnRef" @scroll="handleMonthScroll">
      <span
        v-for="(item, i) in scrollableMonths"
        :key="i"
        class="calender__block__text"
        :class="{
          'calender__block__text--today':
            selectedDate.month === filteredMonths.indexOf(item.value) + 1 &&
            item.zone === 'original',
        }"
      >
        {{ item.value }}
      </span>
    </div>
    <div class="calender__block" ref="yearColumnRef" @scroll="handleYearScroll">
      <span
        v-for="(item, i) in scrollableYears"
        :key="i"
        class="calender__block__text"
        :class="{
          'calender__block__text--today':
            selectedDate.year === item.value && item.zone === 'original',
        }"
      >
        {{ item.value }}
      </span>
    </div>
  </div>
</template>
