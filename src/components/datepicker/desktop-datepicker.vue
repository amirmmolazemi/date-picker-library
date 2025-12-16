<script setup>
import { ref, watch, reactive, computed } from "vue";
import { useI18n } from "vue-i18n";
import { updateMultiple, updateRange, updateSingle } from "@/helpers/updateDates";
import { buildOutputs } from "@/helpers/buildOutputs";
import IconClose from "@/components/icons/icon-close.vue";
import BaseButton from "@/components/ui/base-button.vue";
import GridFilter from "@/components/common/grid-filter.vue";
import GridDays from "@/components/common/grid-days.vue";
import GridMonths from "@/components/common/grid-months.vue";
import GridYears from "@/components/common/grid-years.vue";
import GridClock from "@/components/common/grid-clock.vue";

const props = defineProps({
  selectionMode: {
    type: String,
    default: "single",
    validator: (value) => ["single", "range", "multiple"].includes(value),
  },
  availableMonths: { type: Array, required: true },
  availableYears: { type: Array, required: true },
  today: { type: Object, required: true },
  calendarEngine: { type: Object, required: true },
  pickerType: { type: String, required: true },
  submitText: { type: Object, required: true },
  selectDateText: { type: Object, required: true },
  todayText: { type: Object, required: true },
});
const currentView = ref(props.pickerType === "clock" ? "clock" : "days");
const selectedDates = reactive({
  single: { year: null, month: null, day: null, time: { hour: "00", minute: "00" } },
  range: { start: {}, end: {} },
  multiple: [],
});
const { locale, getLocaleMessage } = useI18n();
const currentMonth = computed(() =>
  selectedDates.single.month ? selectedDates.single.month - 1 : props.today.month - 1,
);
const weekdays = computed(() => getLocaleMessage(locale.value).weekdays);
const direction = computed(() => getLocaleMessage(locale.value).direction);
const currentMonthText = computed(() => getLocaleMessage(locale.value).months[currentMonth.value]);

watch([selectedDates.single], () => {
  selectedDates.range = { start: {}, end: {} };
  syncEngine(selectedDates.single.year, selectedDates.single.month);
});

watch([selectedDates.range, () => selectedDates.single, selectedDates.multiple], () =>
  emit("changed"),
);

const selectionHandlers = {
  single: (cell) => updateSingle(cell, selectedDates),
  multiple: (cell) => updateMultiple(cell, selectedDates),
  range: (cell) => updateRange(cell, selectedDates),
};

const handleDayClick = (cell) => {
  selectionHandlers[props.selectionMode]?.(cell);
  if (props.pickerType !== "date" && props.selectionMode === "single") currentView.value = "clock";
};

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

const handleYearClick = ({ year }) => {
  selectedDates.single.year = year;
  currentView.value = "months";
};

const handleTimeChange = (time) => (selectedDates.single.time = time);

const emit = defineEmits(["date", "changed", "closed", "update-year", "update-month"]);

function buildOutputDateValue() {
  if (props.pickerType === "clock") return buildOutputs.buildClockOutput(selectedDates);
  switch (props.selectionMode) {
    case "range":
      return buildOutputs.buildRangeOutput(selectedDates);
    case "multiple":
      return buildOutputs.buildMultipleOutput(selectedDates);
    case "single":
      return buildOutputs.buildSingleOutput(selectedDates, props.pickerType);
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
    <slot name="close-icon" :close="() => $emit('closed')">
      <icon-close class="header__close" @click="$emit('closed')" />
    </slot>
    <p class="header__title">{{ selectDateText[locale] }}</p>
  </header>
  <div class="content">
    <slot
      name="grid-filter"
      :currentMonthText="currentMonthText"
      :currentView="currentView"
      :year="selectedDates.single.year || calendarEngine.calendarGrid.value[0].year"
      :updateCurrentView="(view) => (currentView = view.current)"
      v-if="pickerType !== 'clock'"
    >
      <grid-filter
        :current-month-text="currentMonthText"
        :current-view="currentView"
        :year="selectedDates.single.year || calendarEngine.calendarGrid.value[0].year"
        @update:current-view="currentView = $event.current"
      >
        <template #locale-dropdown="slotProps">
          <slot name="locale-dropdown" v-bind="slotProps" />
        </template>
      </grid-filter>
    </slot>
    <slot
      name="weekdays"
      :weekdays="weekdays"
      v-if="currentView === 'days' && pickerType !== 'clock'"
      :dir="direction"
    >
      <div class="content__weekdays">
        <span class="content__weekdays__day" v-for="weekday in weekdays" :key="weekday">
          {{ weekday }}
        </span>
      </div>
    </slot>
    <slot
      name="grid-clock"
      :onChange="handleTimeChange"
      v-if="pickerType !== 'date' && currentView === 'clock'"
    >
      <grid-clock @changed="handleTimeChange" />
    </slot>
    <grid-days
      v-if="pickerType !== 'clock' && currentView === 'days'"
      :selection-mode="selectionMode"
      :selected-dates="selectedDates"
      :today="today"
      :locale="locale"
      :today-text="todayText[locale]"
      :calendar-engine="calendarEngine"
      :dir="direction"
      @clicked="handleDayClick"
    >
      <template #day-cell="slotProps">
        <slot name="day-cell" v-bind="slotProps" />
      </template>
    </grid-days>
    <grid-months
      v-if="pickerType !== 'clock' && currentView === 'months'"
      :selected-dates="selectedDates.single.month ? selectedDates.single : today"
      :available-months="availableMonths"
      :dir="direction"
      @clicked="handleMonthClick"
    >
      <template #month-cell="slotProps">
        <slot name="month-cell" v-bind="slotProps" />
      </template>
    </grid-months>
    <grid-years
      v-if="pickerType !== 'clock' && currentView === 'years'"
      :selected-dates="selectedDates.single.month ? selectedDates.single : today"
      :available-years="availableYears"
      :dir="direction"
      @clicked="handleYearClick"
      :locale="locale"
    >
      <template #year-cell="slotProps">
        <slot name="year-cell" v-bind="slotProps" />
      </template>
    </grid-years>
    <slot name="submit-button" :submit="submitSelection" :locale="locale">
      <base-button :text="submitText[locale]" @click="submitSelection" />
    </slot>
  </div>
</template>
