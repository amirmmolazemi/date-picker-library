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
});

const date = reactive({ ...props.today });
const selectedDate = reactive({});
const dayRef = ref(null);
const monthRef = ref(null);
const yearRef = ref(null);

const currentGrid = computed(() => props.engine.grid.value.filter((item) => item.current));
const currentDays = computed(() => wrapList(currentGrid.value));
const currentMonths = computed(() => wrapList(props.months));
const currentYears = computed(() => wrapList(props.years));

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

const handlers = {
  day: (element) => (date.day = Number(persianToEnglish(element))),
  month: (element) => (date.month = props.months.indexOf(element) + 1),
  year: (element) => (date.year = Number(persianToEnglish(element))),
};

const makeScrollHandler = (ref, key) => {
  return () => {
    const element = pickCenterItem(ref.value);
    if (!element) return;
    handlers[key](element.innerText);
    selectedDate[key] = handlers[key](element.innerText);
  };
};

const handleDayScroll = makeScrollHandler(dayRef, "day");
const handleMonthScroll = makeScrollHandler(monthRef, "month");
const handleYearScroll = makeScrollHandler(yearRef, "year");

useInfiniteScroll(dayRef, () => props.engine.grid.value, { distance: 32 });
useInfiniteScroll(monthRef, () => props.months, { distance: 32 });
useInfiniteScroll(yearRef, () => props.years, { distance: 32 });

const scrollToToday = (ref) => {
  const element = ref.value?.querySelector(".today");
  if (element) element.scrollIntoView({ block: "center" });
};

const emit = defineEmits(["changed"]);

watch(selectedDate, () => {
  emit("changed", {
    status: "mobile",
    date: `${selectedDate.year}/${selectedDate.month}/${selectedDate.day}`,
  });
});

onMounted(async () => {
  await nextTick();
  [dayRef, monthRef, yearRef].forEach(scrollToToday);
});
</script>

<template>
  <div class="calender">
    <div class="calender__block" ref="dayRef" @scroll="handleDayScroll">
      <span
        v-for="(item, i) in currentDays"
        :key="i"
        class="calender__block--text"
        :class="{ today: date.day === item.value.day && item.zone === 'original' }"
      >
        {{ item.value.current && englishToPersianDigit(item.value.day) }}
      </span>
    </div>
    <div class="calender__block" ref="monthRef" @scroll="handleMonthScroll">
      <span
        v-for="(item, i) in currentMonths"
        :key="i"
        class="calender__block--text"
        :class="{ today: date.month - 3 === i - 4 && item.zone === 'original' }"
      >
        {{ item.value }}
      </span>
    </div>
    <div class="calender__block" ref="yearRef" @scroll="handleYearScroll">
      <span
        v-for="(item, i) in currentYears"
        :key="i"
        class="calender__block--text"
        :class="{ today: date.year === item.value && item.zone === 'original' }"
      >
        {{ englishToPersianDigit(item.value) }}
      </span>
    </div>
  </div>
</template>
