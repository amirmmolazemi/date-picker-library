<script setup>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import dateFormatter from "@/helpers/dateFormatter";
import useDateDefaults from "@/composables/useDateDefaults";
import useCalenderCore from "@/composables/useCalenderCore";
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
});

const emit = defineEmits(["close", "open", "changed"]);
const inputValue = defineModel();

const { locale, getLocaleMessage } = useI18n();
const today = computed(() => useGetToday(locale.value));
const { defaultDates } = useDateDefaults(props);
const { calenderEngine, availableMonths, availableYears } = useCalenderCore(
  props,
  today,
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
    const selectedDate = `${year}/${month}/${day}`;
    const formattedDate = dateFormatter(selectedDate, props.format);
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
        @update-month="calenderEngine.updateMonth($event)"
        @update-year="calenderEngine.updateYear($event)"
        :selectionMode="props.mode"
        :calender-engine="calenderEngine"
        :today="today"
      />
      <mobile-datepicker
        :availableMonths="availableMonths"
        :availableYears="availableYears"
        @changed="changeDateHandler"
        @update-month="calenderEngine.updateMonth($event)"
        @update-year="calenderEngine.updateYear($event)"
        :calender-engine="calenderEngine"
        :today="today"
        :min-date="min"
        :max-date="max"
      />
    </div>
    <base-input
      v-if="!headless"
      @click="isCalendarVisible = true"
      :placeholder="props.mode !== 'multiple' ? inputValue : ''"
    />
  </div>
</template>
