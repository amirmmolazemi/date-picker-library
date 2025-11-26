<script setup>
import { ref, computed, watch, reactive } from "vue";
import { createCalendarEngine } from "@/composables/useCalenderEngine";
import { langDates } from "@/constants/langDates";
import { englishToPersianDigit } from "@/utils/replaceNumbers";
import useGetToday from "@/composables/useGetToday";
import ArrowIcon from "@/components/icons/arrow-icon.vue";
import CloseIcon from "@/components/icons/close-icon.vue";
import chevronIcon from "@/components/icons/chevron-icon.vue";
import BaseButton from "@/components/ui/base-button.vue";

const props = defineProps({
  activeLang: { type: String, required: true },
  months: { type: Array, required: true },
  years: { type: Array, required: true },
  range: Boolean
});

const today = useGetToday();
const showMonths = ref(false);
const showyears = ref(false);
const todayDate = reactive({ ...today })
const selectedRange = reactive({ start: {}, end: {} });

const adapter = computed(() => langDates.langs[props.activeLang].adaptor);
const weekdays = computed(() => langDates.langs[props.activeLang].weekdays);
const currentMonthText = computed(
  () => langDates.langs[props.activeLang].months[todayDate.month - 1],
);

const engine = createCalendarEngine(adapter.value, todayDate.year, todayDate.month);

watch([todayDate], () => {
  selectedRange.end = {};
  selectedRange.start = {};
  engine.setMonth(todayDate.month);
  engine.setYear(todayDate.year);
});

const handleDayClick = (cell) => {
  if (!props.range && cell.current) {
    todayDate.day = cell.day;
  }
  if (props.range && cell.current) {
    if (!selectedRange.start.day) {
      selectedRange.start.day = cell.day
      selectedRange.start.month = cell.month
      selectedRange.start.year = cell.year
    } else {
      if (selectedRange.start.day > cell.day) return;
      if (selectedRange.start.day === cell.day) {
        selectedRange.start = {};
        selectedRange.end = {};
        return;
      }
      selectedRange.end.day = cell.day
      selectedRange.end.month = cell.month
      selectedRange.end.year = cell.year
    }
  }
};

const rangeVars = computed(() => {
  if (!props.range || !selectedRange.start.day || !selectedRange.end.day) {
    return {};
  }

  const cells = engine.grid.value;
  const startIndex = cells.findIndex(c =>
    c.day === selectedRange.start.day &&
    c.month === selectedRange.start.month &&
    c.year === selectedRange.start.year
  );

  const endIndex = cells.findIndex(c =>
    c.day === selectedRange.end.day &&
    c.month === selectedRange.end.month &&
    c.year === selectedRange.end.year
  );

  if (startIndex === -1 || endIndex === -1) return {};

  const startCol = (startIndex % 7) + 1;
  const startRow = Math.floor(startIndex / 7) + 1;

  const endCol = (endIndex % 7) + 1;
  const endRow = Math.floor(endIndex / 7) + 1;

  return {
    "--range-start-col": startCol,
    "--range-end-col": endCol + 1,
    "--range-start-row": startRow,
    "--range-end-row": endRow + 1
  };
});


const handleMonthClick = (i) => {
  todayDate.month = i + 1;
  showMonths.value = false;
};

const handleYearClick = (year) => {
  todayDate.year = year;
  showyears.value = false;
  showMonths.value = true;
};

const emit = defineEmits(["date", "rangeDate"])

const clickHandler = () => {
  if (props.range) {
    emit("rangeDate", `${selectedRange.start.year}/${selectedRange.start.month}/${selectedRange.start.day} | ${selectedRange.end.year}/${selectedRange.end.month}/${selectedRange.end.day}`);
    return;
  }
  const { day, month, year } = todayDate;
  emit("date", `${year}/${month}/${day}`);
}
</script>

<template>
  <header class="header">
    <close-icon class="header--close" />
    <p class="header--title">تاریخ را انتخاب نمایید</p>
  </header>
  <div class="content">
    <div class="content__filter" v-if="!showyears">
      <div class="content__filter--item" @click="((showMonths = true), (showyears = false))">
        <span>{{ currentMonthText }}</span>
        <chevron-icon />
      </div>
      <div class="content__filter--item" @click="((showyears = true), (showMonths = false))">
        <span>{{ englishToPersianDigit(todayDate.year) }}</span>
        <chevron-icon />
      </div>
    </div>
    <div class="content__filter" v-if="showyears">
      <div class="content__filter--item" style="rotate: 180deg">
        <arrow-icon />
      </div>
      <div class="content__filter--item" @scroll="onScroll('day', $event)">
        <span>{{ englishToPersianDigit(todayDate.year) }}</span>
      </div>
      <div class="content__filter--item">
        <arrow-icon />
      </div>
    </div>
    <div class="content__weekdays" v-if="!showMonths && !showyears">
      <span class="content__weekdays--day" v-for="weekday in weekdays" :key="weekday">
        {{ weekday }}
      </span>
    </div>
    <div class="content__days" v-if="!showMonths && !showyears" :style="rangeVars">
      <div class="content__days__day" v-for="(cell, i) in engine.grid.value" :key="i" :class="{
        selected: !range && todayDate.day === cell.day && todayDate.month === cell.month,
        today: today.day === cell.day && today.month === cell.month && today.year === cell.year,
        'not-current': !cell.current,
        'range-start': props.range && selectedRange.start.day === cell.day && selectedRange.start.month === cell.month && selectedRange.start.year === cell.year,
        'range-end': props.range && selectedRange.end.day === cell.day && selectedRange.end.month === cell.month && selectedRange.end.year === cell.year,
        'in-range': props.range && selectedRange.start.day && selectedRange.end.day && today.month === cell.month && today.year === cell.year
          && cell.day > selectedRange.start.day
          && cell.day < selectedRange.end.day
      }" @click="handleDayClick(cell)">
        {{ englishToPersianDigit(cell.day) }}
        <span class="content__days__day--today"
          v-if="today.day === cell.day && today.month === cell.month && cell.current && today.year === cell.year">امروز</span>
      </div>
    </div>
    <div class="content__months" v-if="showMonths">
      <div class="content__months--month" v-for="(month, index) in months" :key="month"
        :class="{ selected: todayDate.month - 1 === index }" @click="handleMonthClick(index)">
        {{ month }}
      </div>
    </div>
    <div class="content__years" v-if="showyears">
      <div class="content__years--year" v-for="year in years" :key="year" :class="{ selected: todayDate.year === year }"
        @click="handleYearClick(year)">
        {{ englishToPersianDigit(year) }}
      </div>
    </div>
    <base-button text="تایید" @click="clickHandler" />
  </div>
</template>
