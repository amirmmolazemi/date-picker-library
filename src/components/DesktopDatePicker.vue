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
});

const today = useGetToday();
const showMonths = ref(false);
const showyears = ref(false);
const todayDate = reactive({ year: today.year, month: today.month, day: today.day })

const adapter = computed(() => langDates.langs[props.activeLang].adaptor);
const weekdays = computed(() => langDates.langs[props.activeLang].weekdays);
const currentMonthText = computed(
  () => langDates.langs[props.activeLang].months[todayDate.month - 1],
);

const engine = createCalendarEngine(adapter.value, todayDate.year, todayDate.month);

watch([todayDate], () => {
  engine.setMonth(todayDate.month);
  engine.setYear(todayDate.year);
});

const handleDayClick = (cell) => {
  if (cell.current) todayDate.day = cell.day;
};

const handleMonthClick = (i) => {
  todayDate.month = i + 1;
  showMonths.value = false;
};

const handleYearClick = (year) => {
  todayDate.year = year;
  showyears.value = false;
  showMonths.value = true;
};

const emit = defineEmits(["date"])

const clickHandler = () => {
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
    <div class="content__days" v-if="!showMonths && !showyears">
      <div class="content__days__day" v-for="(cell, i) in engine.grid.value" :class="{
        selected: todayDate.day === cell.day && cell.current && cell.month === todayDate.month, 'today': todayDate.day === cell.day && today.month === cell.month && cell.current && today.year === cell.year,
        'not-current': !cell.current,
      }" :key="i" @click="handleDayClick(cell)">
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
