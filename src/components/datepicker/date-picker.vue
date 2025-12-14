<script setup>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { desktopSlots } from "@/constants/desktopSlots";
import dateFormatter from "@/helpers/dateFormatter";
import useDateDefaults from "@/composables/useDateDefaults";
import useCalendarCore from "@/composables/useCalendarCore";
import useGetToday from "@/composables/useGetToday";
import DesktopDatepicker from "@/components/datepicker/desktop-datepicker.vue";
import BaseInput from "@/components/ui/base-input.vue";
import MobileDatepicker from "@/components/datepicker/mobile-datepicker.vue";

const props = defineProps({
  min: { type: String, default: "1404/01/08" },
  max: { type: String, default: "2026/12/08" },
  defaults: { type: Array, default: [] },
  headless: { type: Boolean, default: false },
  locales: { type: Boolean, default: true },
  mode: {
    type: String,
    default: "single",
    validator(value) {
      return ["range", "single", "multiple"].includes(value);
    },
  },
  format: "YYYY/MM/DD",
  pickerType: {
    type: String,
    default: "both",
    validator(value) {
      return ["date", "clock", "both"].includes(value);
    },
  },
  submitText: { type: Object, default: { jalaali: "تایید", gregorian: "submit" } },
  selectDateText: {
    type: Object,
    default: { jalaali: "تاریخ را انتخاب نمایید", gregorian: "please select a date" },
  },
  todayText: { type: Object, default: { jalaali: "امروز", gregorian: "today" } },
});

const emit = defineEmits(["close", "open", "changed"]);
const inputValue = defineModel();

const { locale, getLocaleMessage } = useI18n();
const today = computed(() => useGetToday(locale.value));
const { defaultDates } = useDateDefaults(props);
const { calendarEngine, availableMonths, availableYears } = useCalendarCore(
  props,
  today.value,
  locale,
  getLocaleMessage,
);

const isCalendarVisible = ref(props.headless);

const formatDate = (date) => {
  const result = date ? date.value : defaultDates.value;
  const formattedDate = dateFormatter(result, props.format);
  if (typeof formattedDate === "object" && !Array.isArray(formattedDate))
    inputValue.value = formattedDate.text;
  else inputValue.value = formattedDate;
  if (!props.headless) isCalendarVisible.value = false;
  else emit("close");
};

watch(isCalendarVisible, (value) => {
  if (!props.headless && value) emit("open");
});

const closeHandler = () => {
  if (!props.headless) isCalendarVisible.value = false;
  emit("close");
};

const changeDateHandler = (item) => {
  if (item?.status) {
    const { year, month, day } = item;
    const formattedDate = dateFormatter(`${year}/${month}/${day}`, props.format);
    inputValue.value = formattedDate;
    if (typeof formattedDate === "object") inputValue.value = formattedDate.text;
  }
  emit("changed");
};
</script>

<template>
  <div class="datepicker">
    <div v-if="isCalendarVisible" class="overlay" @click="closeHandler"></div>
    <div class="container" v-if="isCalendarVisible">
      <desktop-datepicker
        :availableMonths="availableMonths"
        :availableYears="availableYears"
        @date="formatDate"
        @changed="changeDateHandler"
        @closed="closeHandler"
        @update-month="calendarEngine.updateMonth($event)"
        @update-year="calendarEngine.updateYear($event)"
        :selectionMode="props.mode"
        :calendar-engine="calendarEngine"
        :today="today"
        :picker-type="pickerType"
        :select-date-text="selectDateText"
        :submit-text="submitText"
        :today-text="todayText"
      >
        <template v-for="slotName in desktopSlots" v-slot:[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </desktop-datepicker>
      <mobile-datepicker
        :availableMonths="availableMonths"
        :availableYears="availableYears"
        @changed="changeDateHandler"
        @update-month="calendarEngine.updateMonth($event)"
        @update-year="calendarEngine.updateYear($event)"
        :calendar-engine="calendarEngine"
        :today="today"
        :min-date="min"
        :max-date="max"
      />
    </div>
    <slot
      name="input-field"
      :value="inputValue"
      :mode="props.mode"
      :openCalendar="() => (isCalendarVisible = true)"
      v-if="!headless"
    >
      <base-input
        :placeholder="props.mode !== 'multiple' ? inputValue : ''"
        @click="isCalendarVisible = true"
      />
    </slot>
  </div>
</template>
