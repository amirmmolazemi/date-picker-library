<script setup>
import { ref, watch, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { updateMultiple, updateRange, updateSingle } from "@/helpers/updateDates";
import useGetProvidersData from "@/composables/useGetProvidersData";
import IconClose from "@/components/icons/icon-close.vue";
import BaseButton from "@/components/ui/base-button.vue";
import GridFilter from "@/components/common/grid-filter.vue";
import GridDays from "@/components/common/grid-days.vue";
import GridMonths from "@/components/common/grid-months.vue";
import GridYears from "@/components/common/grid-years.vue";

const props = defineProps({
  mode: String,
  months: Array,
  years: Array,
  todayDate: Object,
  engine: Object,
});
const showMonths = ref(false);
const showYears = ref(false);
const date = reactive({
  single: { year: null, month: null, day: null },
  range: { start: {}, end: {} },
  multiple: [],
});
const { locale, getLocaleMessage } = useI18n();
const data = useGetProvidersData(getLocaleMessage, locale, date, props);

watch([date.single], () => {
  date.range = { start: {}, end: {} };
  props.engine.setMonth(date.single.month);
  props.engine.setYear(date.single.year);
});

watch([date.range, date.single, date.multiple], () => emit("changed"));

const handleDayClick = (cell) => {
  switch (props.mode) {
    case "single":
      return updateSingle(cell, date);
    case "multiple":
      return updateMultiple(cell, date);
    case "range":
      return updateRange(cell, date);
  }
};

const handleMonthClick = (selectedDate) => {
  date.single.month = selectedDate.month + 1;
  date.single.day = null;
  if (!date.single.year) date.single.year = selectedDate.year;
  showMonths.value = false;
};

const handleYearClick = (year) => {
  date.single.year = year;
  showYears.value = false;
  showMonths.value = true;
};

const emit = defineEmits(["date", "changed", "closed"]);

const clickHandler = () => {
  let finalDate;
  if (props.mode === "range") {
    const { year: startYear, month: startMonth, day: startDay } = date.range.start;
    const { year: endYear, month: endMonth, day: endDay } = date.range.end;
    const textTemplate = `${startYear}/${startMonth}/${startDay} | ${endYear}/${endMonth}/${endDay}`;
    finalDate = startDay && endDay ? textTemplate : null;
  }
  if (props.mode === "multiple") finalDate = date.multiple.length > 0 ? date.multiple : null;
  if (props.mode === "single") {
    finalDate = date.single.day
      ? `${date.single.year}/${date.single.month}/${date.single.day}`
      : null;
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
    <p class="header--title">{{ data.mainText }}</p>
  </header>
  <div class="content">
    <grid-filter
      :currentMonthText="data.currentMonthText.value"
      :show-years="showYears"
      :year="date.single.year ? date.single.year : engine.grid.value[0].year"
      :active-lang="locale"
      @update:showYears="(e) => ((showYears = e), (showMonths = !e))"
      @update:showMonths="(e) => ((showYears = !e), (showMonths = e))"
    />
    <div class="content__weekdays" v-if="!showMonths && !showYears" :dir="data.direction.value">
      <span class="content__weekdays--day" v-for="weekday in data?.weekdays.value" :key="weekday">
        {{ weekday }}
      </span>
    </div>
    <grid-days
      :mode="mode"
      :show-months="showMonths"
      :showYears="showYears"
      :date="date"
      :todayDate="todayDate"
      :active-lang="locale"
      :today-text="data.todayText.value"
      :engine="engine"
      :dir="data.direction.value"
      @clicked="handleDayClick"
    />
    <grid-months
      :show-months="showMonths"
      :date="date.single.month ? date.single : todayDate"
      :months="months"
      :dir="data.direction.value"
      @clicked="handleMonthClick"
    />
    <grid-years
      :show-years="showYears"
      :date="date.single.month ? date.single : todayDate"
      :years="years"
      :dir="data.direction.value"
      @clicked="handleYearClick"
      :active-lang="locale"
    />
    <base-button :text="locale === 'jalaali' ? 'تایید' : 'submit'" @click="clickHandler" />
  </div>
</template>
