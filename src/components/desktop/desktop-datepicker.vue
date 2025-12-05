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
const date = reactive({ year: null, month: null, day: null });
const selectedRange = reactive({ start: {}, end: {} });
const multipleSelections = reactive([]);

const weekdays = computed(() => langDates.langs[props.activeLang].weekdays);
const currentMonthText = computed(
  () =>
    langDates.langs[props.activeLang].months[
      date.month ? date.month - 1 : props.todayDate.month - 1
    ],
);
const mainText = computed(() => langDates.langs[props.activeLang].mainText);
const todayText = computed(() => langDates.langs[props.activeLang].todayText);

watch([date], () => {
  selectedRange.end = {};
  selectedRange.start = {};
  props.engine.setMonth(date.month);
  props.engine.setYear(date.year);
});

watch([selectedRange, date, multipleSelections], () => emit("changed"));

const handleDayClick = (cell) => {
  if (props.mode === "single" && cell.current && cell.enable) {
    date.day = cell.day;
    date.month = cell.month;
    date.year = cell.year;
  }
  if (props.mode === "multiple" && cell.enable) {
    const selectedItemIndex = multipleSelections.findIndex(
      (item) => item.day === cell.day && item.month === cell.month && item.year === cell.year,
    );
    if (selectedItemIndex !== -1) {
      multipleSelections.splice(selectedItemIndex, 1);
    } else {
      multipleSelections.push({ year: cell.year, month: cell.month, day: cell.day });
    }
  }
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

const handleMonthClick = (selectedDate) => {
  date.month = selectedDate.month + 1;
  date.day = null;
  if (!date.year) date.year = selectedDate.year;
  showMonths.value = false;
};

const handleYearClick = (year) => {
  date.year = year;
  showYears.value = false;
  showMonths.value = true;
};

const emit = defineEmits(["date", "changed", "closed"]);

const clickHandler = () => {
  let finalDate;
  if (props.mode === "range") {
    const { year: startYear, month: startMonth, day: startDay } = selectedRange.start;
    const { year: endYear, month: endMonth, day: endDay } = selectedRange.end;
    const textTemplate = `${startYear}/${startMonth}/${startDay} | ${endYear}/${endMonth}/${endDay}`;
    finalDate = startDay && endDay ? textTemplate : null;
  }
  if (props.mode === "multiple") {
    finalDate = multipleSelections.length > 0 ? multipleSelections : null;
  }
  if (props.mode === "single") {
    finalDate = date.day ? `${date.year}/${date.month}/${date.day}` : null;
  }
  emit("date", finalDate);
  emit("closed");
  props.engine.setMonth(props.todayDate.month);
  props.engine.setYear(props.todayDate.year);
};
</script>

<template>
  <header class="header">
    <icon-close class="header--close" @click="$emit('closed')" />
    <p class="header--title">{{ mainText }}</p>
  </header>
  <div class="content">
    <grid-filter
      :currentMonthText="currentMonthText"
      :show-years="showYears"
      :show-months="showMonths"
      :year="date.year ? date.year : engine.grid.value[0].year"
      :active-lang="activeLang"
      @update:showYears="(e) => ((showYears = e), (showMonths = !e))"
      @update:showMonths="(e) => ((showYears = !e), (showMonths = e))"
    />
    <div class="content__weekdays" v-if="!showMonths && !showYears">
      <span class="content__weekdays--day" v-for="weekday in weekdays" :key="weekday">
        {{ weekday }}
      </span>
    </div>
    <grid-days
      :mode="mode"
      :selected-range="selectedRange"
      :show-months="showMonths"
      :showYears="showYears"
      :date="date"
      :todayDate="todayDate"
      :active-lang="activeLang"
      :today-text="todayText"
      :engine="engine"
      @clicked="handleDayClick"
      :multiple-selections="multipleSelections"
    />
    <grid-months
      :show-months="showMonths"
      :date="date.month ? date : todayDate"
      :months="months"
      @clicked="handleMonthClick"
    />
    <grid-years
      :show-years="showYears"
      :date="date.month ? date : todayDate"
      :years="years"
      @clicked="handleYearClick"
      :active-lang="activeLang"
    />
    <base-button :text="activeLang === 'jalaali' ? 'تایید' : 'submit'" @click="clickHandler" />
  </div>
</template>
