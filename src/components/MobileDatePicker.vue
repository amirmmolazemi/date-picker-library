<script setup>
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import { englishToPersianDigit } from "@/utils/replaceNumbers";
import { langDates } from "@/constants/langDates";
import { createCalendarEngine } from "@/composables/useCalenderEngine";
import useGetToday from "@/composables/useGetToday";

const props = defineProps({
  activeLang: { type: String, required: true },
  months: { type: Array, required: true },
  years: { type: Array, required: true },
});

const today = useGetToday();
const todayDate = reactive({ year: today.year, month: today.month, day: today.day, });
const adapter = computed(() => langDates.langs[props.activeLang].adaptor);
const engine = createCalendarEngine(adapter.value, todayDate.year, todayDate.month, false);

const dayRef = ref(null);
const monthRef = ref(null);
const yearRef = ref(null);

useInfiniteScroll(dayRef, () => { engine.grid.value }, { distance: 32, });
useInfiniteScroll(monthRef, () => props.months, { distance: 32, });
useInfiniteScroll(yearRef, () => props.years, { distance: 32, });

onMounted(async () => {
  await nextTick();
  const todayDayEl = dayRef.value.querySelector(".selected");
  if (todayDayEl) todayDayEl.scrollIntoView({ block: "center" });

  const todayMonthEl = monthRef.value.querySelector(".selected");
  if (todayMonthEl) todayMonthEl.scrollIntoView({ block: "center" });

  const todayYearEl = yearRef.value.querySelector(".selected");
  if (todayYearEl) todayYearEl.scrollIntoView({ block: "center" });
});
</script>


<template>
  <div class="calender">
    <div class="calender__block" ref="dayRef">
      <span v-for="item in engine.grid.value" :key="item.day" class="calender__block--text"
        :class="{ selected: todayDate.day === item.day }">
        {{ englishToPersianDigit(item.day) }}
      </span>
    </div>
    <div class="calender__block" ref="monthRef">
      <span v-for="(month, i) in months" :key="i" class="calender__block--text"
        :class="{ selected: todayDate.month - 1 === i % props.months.length }">
        {{ month }}
      </span>
    </div>
    <div class="calender__block" ref="yearRef">
      <span v-for="year in years" :key="year" class="calender__block--text"
        :class="{ selected: todayDate.year === year }">
        {{ englishToPersianDigit(year) }}
      </span>
    </div>
  </div>
</template>
