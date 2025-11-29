<script setup>
import { ref, computed, watch, reactive } from "vue";
import { langDates } from "@/constants/langDates";
import IconClose from "@/components/icons/icon-close.vue";
import BaseButton from "@/components/ui/base-button.vue";
import GridFilter from "@/components/filter/grid-filter.vue";
import GridDays from "@/components/grids/grid-days.vue";
import GridMonths from "@/components/grids/grid-months.vue";
import GridYears from "@/components/grids/grid-years.vue";

const props = defineProps({
  activeLang: String,
  mode: String,
  months: Array,
  years: Array,
  todayDate: Object,
  engine: Object,
});
const showMonths = ref(false);
const showYears = ref(false);
const today = reactive({ ...props.todayDate });
const selectedRange = reactive({ start: {}, end: {} });

const weekdays = computed(() => langDates.langs[props.activeLang].weekdays);
const currentMonthText = computed(() => langDates.langs[props.activeLang].months[today.month - 1]);

watch([today], () => {
  selectedRange.end = {};
  selectedRange.start = {};
  props.engine.setMonth(today.month);
  props.engine.setYear(today.year);
});

watch([selectedRange, today], () => emit("changed"));

const handleDayClick = (cell) => {
  if (props.mode === "single" && cell.current && cell.enable) today.day = cell.day;
  if (props.mode === "range" && cell.enable && cell.current) {
    if (!selectedRange.start.day) {
      selectedRange.start.day = cell.day;
      selectedRange.start.month = cell.month;
      selectedRange.start.year = cell.year;
    } else {
      if (selectedRange.start.day > cell.day) return;
      if (selectedRange.start.day === cell.day) {
        selectedRange.start = {};
        selectedRange.end = {};
        return;
      }
      selectedRange.end.day = cell.day;
      selectedRange.end.month = cell.month;
      selectedRange.end.year = cell.year;
    }
  }
};

const handleMonthClick = (index) => {
  today.month = index + 1;
  showMonths.value = false;
};

const handleYearClick = (year) => {
  today.year = year;
  showYears.value = false;
  showMonths.value = true;
};

const emit = defineEmits(["date", "changed"]);

const clickHandler = () => {
  if (props.mode === "range") {
    const { startYear, startMonth, startDay } = selectedRange.start;
    const { endYear, endMonth, endDay } = selectedRange.end;
    emit("date", `${startYear}/${startMonth}/${startDay} | ${endYear}/${endMonth}/${endDay}`);
    return;
  }
  const { day, month, year } = today;
  emit("date", `${year}/${month}/${day}`);
};
</script>

<template>
  <header class="header">
    <icon-close class="header--close" />
    <p class="header--title">تاریخ را انتخاب نمایید</p>
  </header>
  <div class="content">
    <grid-filter :current-month-text="currentMonthText" :show-years="showYears" :show-months="showMonths" :today="today"
      @update:showYears="(e) => ((showYears = e), (showMonths = !e))"
      @update:showMonths="(e) => ((showYears = !e), (showMonths = e))" />
    <div class="content__weekdays" v-if="!showMonths && !showYears">
      <span class="content__weekdays--day" v-for="weekday in weekdays" :key="weekday">
        {{ weekday }}
      </span>
    </div>
    <grid-days :mode="mode" :selected-range="selectedRange" :show-months="showMonths" :showYears="showYears"
      :today="today" :todayDate="todayDate" :engine="engine" @clicked="handleDayClick" />
    <grid-months :show-months="showMonths" :today="today" :months="months" @clicked="handleMonthClick" />
    <grid-years :show-years="showYears" :today="today" :years="years" @clicked="handleYearClick" />
    <base-button text="تایید" @click="clickHandler" />
  </div>
</template>
