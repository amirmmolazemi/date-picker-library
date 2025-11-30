<script setup>
import { computed, ref, watch } from "vue";
import { langDates } from "@/constants/langDates";
import { createCalendarEngine } from "@/composables/useCalenderEngine";
import useGetToday from "@/composables/useGetToday";
import dateFormatter from "@/utils/dateFormatter";
import MobileDatepicker from "@/components/mobile/mobile-datepicker.vue";
import DesktopDatepicker from "@/components/desktop/desktop-datepicker.vue";
import BaseInput from "@/components/ui/base-input.vue";

const props = defineProps({
  format: { type: String, default: "YYYY-MM-DD" },
  min: { type: String, default: "1400/01/01" },
  max: { type: String, default: "1405/09/08" },
  headless: { type: Boolean, default: false },
  mode: {
    type: String,
    default: "single",
    validator(value) {
      return ["range", "single"].includes(value);
    },
  },
});

const emit = defineEmits(["close", "open", "changed"]);
const model = defineModel();

const activeLang = ref("fa");
const selectedDate = ref("");
const showCalender = ref(props.headless);
const today = useGetToday();

const adapter = computed(() => langDates.langs[activeLang.value].adapter);
const months = computed(() => langDates.langs[activeLang.value].months);

const engine = createCalendarEngine(adapter.value, today.year, today.month, true, [
  props.min,
  props.max,
]);

const years = computed(() => {
  let start = Number(props.min.split("/")[0]);
  let end = Number(props.max.split("/")[0]);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const formatDate = (date) => {
  const formattedDate = props.mode === "single" ? dateFormatter(date, props.format) : date;
  model.value = formattedDate;
  if (!props.headless) showCalender.value = false;
  else emit("close");
};

watch(showCalender, (value) => {
  if (!props.headless && value) emit("open");
});

const closeHandler = () => {
  if (!props.headless) showCalender.value = false;
  emit("close", selectedDate.value);
};

const changeDateHandler = (item) => {
  if (item?.status) model.value = dateFormatter(item.date, props.format);
  emit("changed");
};
</script>

<template>
  <div v-if="showCalender" class="overlay" @click="closeHandler"></div>
  <div class="container" v-if="showCalender">
    <desktop-datepicker
      :active-lang="activeLang"
      :months="months"
      :years="years"
      @date="formatDate"
      @changed="changeDateHandler"
      @closed="closeHandler"
      :mode="mode"
      :engine="engine"
      :today-date="today"
    />
    <mobile-datepicker
      :months="months"
      :showCalender="showCalender"
      :years="years"
      :active-lang="activeLang"
      @changed="changeDateHandler"
      :engine="engine"
      :today="today"
      :min="min"
      :max="max"
    />
  </div>
  <base-input v-if="!headless" @click="showCalender = true" :value="model" :placeholder="model" />
</template>
