<script setup>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { createCalendarEngine } from "@/composables/useCalenderEngine";
import useGetToday from "@/composables/useGetToday";
import dateFormatter from "@/utils/dateFormatter";
import MobileDatepicker from "@/components/datepicker/mobile-datepicker.vue";
import DesktopDatepicker from "@/components/datepicker/desktop-datepicker.vue";
import BaseInput from "@/components/ui/base-input.vue";

const props = defineProps({
  format: { type: String, default: "YYYY-MM-DD" },
  min: { type: String, default: "1404/01/01" },
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
});

const emit = defineEmits(["close", "open", "changed"]);
const model = defineModel();

const { locale, getLocaleMessage } = useI18n();
const showCalender = ref(props.headless);

const provider = computed(() => getLocaleMessage(locale.value).provider);
const months = computed(() => getLocaleMessage(locale.value).months);
const today = computed(() => useGetToday(locale.value));
const engine = computed(() =>
  createCalendarEngine(provider.value, today.value, [props.min, props.max]),
);
const defaultDates = computed(() => {
  if (props.mode === "single") {
    if (!props.defaults[0]) return `${null}/${null}/${null}`;
    const splitedDate = props.defaults[0].split("/");
    return `${+splitedDate[0]}/${+splitedDate[1]}/${+splitedDate[2]}`;
  }
  if (props.mode === "range") {
    if (props.defaults.length < 2) return null;
    const [startYear, startMonth, startDay] = props.defaults[0].split("/");
    const [endYear, endMonth, endDay] = props.defaults[1].split("/");
    return `${startYear}/${startMonth}/${startDay} | ${endYear}/${endMonth}/${endDay}`;
  }
  if (props.mode === "multiple") {
    if (props.defaults.length < 1) return [];
    return props.defaults.map((item) => {
      const [year, month, day] = item.split("/");
      return { year, month, day };
    });
  }
});
const years = computed(() => {
  let start = Number(props.min.split("/")[0]);
  let end = Number(props.max.split("/")[0]);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const formatDate = (date) => {
  const result = date ? date : defaultDates.value;
  const formattedDate = props.mode === "single" ? dateFormatter(result, props.format) : result;
  model.value = formattedDate;
  if (!props.headless) showCalender.value = false;
  else emit("close");
};

watch(showCalender, (value) => {
  if (!props.headless && value) emit("open");
});

const closeHandler = () => {
  if (!props.headless) showCalender.value = false;
  emit("close");
};

const changeDateHandler = (item) => {
  if (item?.status) model.value = dateFormatter(item.date, props.format);
  emit("changed");
};
</script>

<template>
  <div class="datepicker">
    <div v-if="showCalender" class="overlay" @click="closeHandler"></div>
    <div class="container" v-if="showCalender">
      <desktop-datepicker
        :months="months"
        :years="years"
        @date="formatDate"
        @changed="changeDateHandler"
        @closed="closeHandler"
        :mode="props.mode"
        :engine="engine"
        :today-date="today"
      />
      <mobile-datepicker
        :months="months"
        :showCalender="showCalender"
        :years="years"
        @changed="changeDateHandler"
        :engine="engine"
        :today="today"
        :min="min"
        :max="max"
      />
    </div>
    <base-input
      v-if="!headless"
      @click="showCalender = true"
      :value="model"
      :placeholder="props.mode !== 'multiple' ? model : ''"
    />
  </div>
</template>
