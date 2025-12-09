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
  selectionMode: {
    type: String,
    default: "single",
    validator: (value) => ["single", "range", "multiple"].includes(value),
  },
  availableMonths: { type: Array, required: true },
  availableYears: { type: Array, required: true },
  today: { type: Object, required: true },
  calenderEngine: { type: Object, required: true },
});
const currentView = ref("days");
const selectedDates = reactive({
  single: { year: null, month: null, day: null },
  range: { start: {}, end: {} },
  multiple: [],
});
const { locale, getLocaleMessage } = useI18n();
const providerData = useGetProvidersData(
  getLocaleMessage,
  locale,
  selectedDates.single,
  props.today,
);

watch([selectedDates.single], () => {
  selectedDates.range = { start: {}, end: {} };
  syncEngine(selectedDates.single.year, selectedDates.single.month);
});

watch([selectedDates.range, selectedDates.single, selectedDates.multiple], () => emit("changed"));

const selectionHandlers = {
  single: (cell) => updateSingle(cell, selectedDates),
  multiple: (cell) => updateMultiple(cell, selectedDates),
  range: (cell) => updateRange(cell, selectedDates),
};

const handleDayClick = (cell) => selectionHandlers[props.selectionMode]?.(cell);

const handleMonthClick = (selectedDate) => {
  selectedDates.single.month = selectedDate.month + 1;
  selectedDates.single.day = null;
  if (!selectedDates.single.year) selectedDates.single.year = selectedDate.year;
  currentView.value = "days";
};

const syncEngine = (year, month) => {
  emit("update-year", year);
  emit("update-month", month);
};

const handleYearClick = (year) => {
  selectedDates.single.year = year;
  currentView.value = "months";
};

const emit = defineEmits(["date", "changed", "closed", "update-year", "update-month"]);

function buildOutputDateValue() {
  switch (props.selectionMode) {
    case "range": {
      const s = selectedDates.range.start;
      const e = selectedDates.range.end;
      if (!s.day || !e.day) return null;
      return `${s.year}/${s.month}/${s.day} | ${e.year}/${e.month}/${e.day}`;
    }
    case "multiple":
      return selectedDates.multiple.length ? selectedDates.multiple : null;
    case "single": {
      const s = selectedDates.single;
      return s.day ? `${s.year}/${s.month}/${s.day}` : null;
    }
  }
  return null;
}

const submitSelection = () => {
  const finalDate = buildOutputDateValue();
  emit("date", finalDate);
  emit("closed");
  syncEngine(props.today.year, props.today.month);
};
</script>

<template>
  <header class="header">
    <icon-close class="header__close" @click="$emit('closed')" />
    <p class="header__title">{{ providerData.mainText }}</p>
  </header>
  <div class="content">
    <grid-filter
      :current-month-text="providerData.currentMonthText.value"
      :current-view="currentView"
      :year="
        selectedDates.single.year
          ? selectedDates.single.year
          : calenderEngine.calendarGrid.value[0].year
      "
      @update:current-view="currentView = $event"
    />
    <div
      class="content__weekdays"
      v-if="currentView === 'days'"
      :dir="providerData.direction.value"
    >
      <span
        class="content__weekdays__day"
        v-for="weekday in providerData?.weekdays.value"
        :key="weekday"
      >
        {{ weekday }}
      </span>
    </div>
    <grid-days
      :selection-mode="selectionMode"
      :current-view="currentView"
      :selected-dates="selectedDates"
      :today="today"
      :locale="locale"
      :today-text="providerData.todayText.value"
      :calender-engine="calenderEngine"
      :dir="providerData.direction.value"
      @clicked="handleDayClick"
    />
    <grid-months
      :current-view="currentView"
      :selected-dates="selectedDates.single.month ? selectedDates.single : today"
      :available-months="availableMonths"
      :dir="providerData.direction.value"
      @clicked="handleMonthClick"
    />
    <grid-years
      :current-view="currentView"
      :selected-dates="selectedDates.single.month ? selectedDates.single : today"
      :available-years="availableYears"
      :dir="providerData.direction.value"
      @clicked="handleYearClick"
      :locale="locale"
    />
    <base-button :text="locale === 'jalaali' ? 'تایید' : 'submit'" @click="submitSelection" />
  </div>
</template>
