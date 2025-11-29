<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import { englishToPersianDigit, persianToEnglish } from "@/utils/replaceNumbers";

const props = defineProps({
  activeLang: String,
  months: Array,
  years: Array,
  engine: Object,
  today: Object,
});

const date = reactive({ year: props.today.year, month: props.today.month, day: props.today.day })

const dayRef = ref(null);
const monthRef = ref(null);
const yearRef = ref(null);

const currentGrid = computed(() => {
  const grids = props.engine.grid.value.filter((item) => item.current)
  const startOfArray = grids.slice(0, 2)
  const endOfArray = grids.slice(grids.length - 2)
  return [...endOfArray, ...grids, ...startOfArray]
});

const currentYears = computed(() => {
  const grids = props.years
  const startOfArray = grids.length > 5 ? grids.slice(0, 2) : []
  const endOfArray = grids.length > 5 ? grids.slice(grids.length - 2) : []
  return [...endOfArray, ...grids, ...startOfArray]
});

const currentMonths = computed(() => {
  const grids = props.months
  const startOfArray = grids.length > 5 ? grids.slice(0, 2) : []
  const endOfArray = grids.length > 5 ? grids.slice(grids.length - 2) : []
  console.log(props.months);
  return [...endOfArray, ...grids, ...startOfArray]
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

watch([date], () => {
  props.engine.setMonth(date.month);
  props.engine.setYear(date.year);
});

const handleDayScroll = () => {
  const el = pickCenterItem(dayRef.value);
  if (!el) return;
  date.day = Number(persianToEnglish(el.innerText))
};

const handleMonthScroll = () => {
  const el = pickCenterItem(monthRef.value);
  if (!el) return;
  date.month = props.months.indexOf(el.innerText) + 1
};

const handleYearScroll = () => {
  const el = pickCenterItem(yearRef.value);
  if (!el) return;
  date.year = Number(persianToEnglish(el.innerText))
};

useInfiniteScroll(dayRef, () => props.engine.grid.value, { distance: 32 });
useInfiniteScroll(monthRef, () => props.months, { distance: 32 });
useInfiniteScroll(yearRef, () => props.years, { distance: 32 });

onMounted(async () => {
  await nextTick();
  const todayDayEl = dayRef.value.querySelector(".today");
  if (todayDayEl) todayDayEl.scrollIntoView({ block: "center" });

  const todayMonthEl = monthRef.value.querySelector(".today");
  if (todayMonthEl) todayMonthEl.scrollIntoView({ block: "center" });

  const todayYearEl = yearRef.value.querySelector(".today");
  if (todayYearEl) todayYearEl.scrollIntoView({ block: "center" });
});
</script>

<template>
  <div class="calender">
    <div class="calender__block" ref="dayRef" @scroll="handleDayScroll">
      <span v-for="(item, i) in currentGrid" :key="i" class="calender__block--text"
        :class="{ 'today': date.day === item.day }">
        {{ item.current && englishToPersianDigit(item.day) }}
      </span>
    </div>
    <div class="calender__block" ref="monthRef" @scroll="handleMonthScroll">
      <span v-for="(month, i) in currentMonths" :key="i" class="calender__block--text"
        :class="{ 'today': date.month - 3 === i - 4 }">
        {{ month }}
      </span>
    </div>
    <div class="calender__block" ref="yearRef" @scroll="handleYearScroll">
      <span v-for="(year, i) in currentYears" :key="i" class="calender__block--text"
        :class="{ 'today': date.year === year }">
        {{ englishToPersianDigit(year) }}
      </span>
    </div>
  </div>
</template>
