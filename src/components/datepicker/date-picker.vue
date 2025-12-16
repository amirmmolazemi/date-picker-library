<script setup>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { desktopSlots } from "@/constants/desktopSlots";
import { splitDateParts } from "@/utils/splitDateParts";
import { useCalendar } from "@/composables/useCalendarCreator";
import useDateDefaults from "@/composables/useDateDefaults";
import useGetToday from "@/composables/useGetToday";
import dateFormatter from "@/helpers/dateFormatter";
import DesktopDatepicker from "@/components/datepicker/desktop-datepicker.vue";
import BaseInput from "@/components/ui/base-input.vue";
import MobileDatepicker from "@/components/datepicker/mobile-datepicker.vue";

const props = defineProps({
  min: { type: String, default: "1404/01/08" },
  max: { type: String, default: "2026/12/08" },
  defaults: { type: Array, default: () => [] },
  headless: { type: Boolean, default: false },
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

const provider = computed(() => getLocaleMessage(locale.value).provider);
const availableMonths = computed(() => getLocaleMessage(locale.value).months);
const calendarEngine = computed(() =>
  useCalendar(provider.value, today.value, [props.min, props.max]),
);
const availableYears = computed(() => {
  let start = splitDateParts(props.min)[0];
  let end = splitDateParts(props.max)[0];
  return [...Array(end - start + 1).keys()].map((i) => start + i);
});

const isCalendarVisible = ref(props.headless);

const formatDate = (date) => {
  const resolved = resolveDateValue(date);

  const formatted = dateFormatter(resolved, props.format);

  applyFormattedDate(normalizeFormattedDate(formatted));
  handleCalendarClose();
};

const resolveDateValue = (date) => date?.value ?? defaultDates.value;
const applyFormattedDate = (value) => (inputValue.value = value);

const normalizeFormattedDate = (formatted) =>
  typeof formatted === "object" && !Array.isArray(formatted) ? formatted.text : formatted;

const handleCalendarClose = () => {
  props.headless ? emit("close") : (isCalendarVisible.value = false);
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
    applyFormattedDate(normalizeFormattedDate(formattedDate));
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
