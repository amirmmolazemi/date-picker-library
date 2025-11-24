<script setup>
import { ref, computed, watch } from "vue";
import { createCalendarEngine } from "@/composables/useCalenderEngine";
import { langDates } from "@/constants/langDates";
import ArrowIcon from "@/components/icons/arrow-icon.vue";
import CloseIcon from "@/components/icons/close-icon.vue";
import chevronIcon from "@/components/icons/chevron-icon.vue";
import BaseButton from "@/components/ui/base-button.vue";
import englishToPersianDigit from "@/utils/englishToPersianDigit";

const showMonths = ref(false);
const showyears = ref(false);
const currentYear = ref(1404);
const currentMonth = ref(9);
const currentDay = ref(3);

const props = defineProps({
  activeLang: { type: String, required: true },
  months: { type: Array, required: true },
  years: { type: Array, required: true },
});

const adapter = computed(() => langDates.langs[props.activeLang].adaptor);
const engine = createCalendarEngine(adapter.value, currentYear.value, currentMonth.value);

watch([currentMonth, currentYear], () => {
  engine.setMonth(currentMonth.value);
  engine.setYear(currentYear.value);
});

const currentMonthText = computed(
  () => langDates.langs[props.activeLang].months[currentMonth.value - 1],
);

const weekdays = computed(() => langDates.langs[props.activeLang].weekdays);

const handleDayClick = (cell) => {
  if (cell.current) currentDay.value = cell.day;
};

const handleMonthClick = (i) => {
  currentMonth.value = i + 1;
  showMonths.value = false;
};

const handleYearClick = (year) => {
  currentYear.value = year;
  showyears.value = false;
  showMonths.value = true;
};

const clickHandler = () =>
  console.log(`${currentYear.value}/${currentMonth.value}/${currentDay.value}`);
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
        <span>{{ englishToPersianDigit(currentYear) }}</span>
        <chevron-icon />
      </div>
    </div>
    <div class="content__filter" v-if="showyears">
      <div class="content__filter--item" style="rotate: 180deg">
        <arrow-icon />
      </div>
      <div class="content__filter--item" @scroll="onScroll('day', $event)">
        <span>{{ englishToPersianDigit(currentYear) }}</span>
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
    <div class="content__days" v-if="!showMonths && !showyears">
      <div
        class="content__days--day"
        v-for="(cell, i) in engine.grid.value"
        :class="{
          selected: currentDay === cell.day && cell.current,
          'not-current': !cell.current,
        }"
        :key="i"
        @click="handleDayClick(cell)"
      >
        {{ englishToPersianDigit(cell.day) }}
      </div>
    </div>
    <div class="content__months" v-if="showMonths">
      <div
        class="content__months--month"
        v-for="(month, index) in months"
        :key="month"
        :class="{ selected: currentMonth - 1 === index }"
        @click="handleMonthClick(index)"
      >
        {{ month }}
      </div>
    </div>
    <div class="content__years" v-if="showyears">
      <div
        class="content__years--year"
        v-for="year in years"
        :key="year"
        :class="{ selected: currentYear === year }"
        @click="handleYearClick(year)"
      >
        {{ englishToPersianDigit(year) }}
      </div>
    </div>
    <base-button text="تایید" @click="clickHandler" />
  </div>
</template>
