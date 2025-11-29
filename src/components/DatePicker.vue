<script setup>
import { computed, ref, watch } from "vue";
import { langDates } from "@/constants/langDates";
import { createCalendarEngine } from "@/composables/useCalenderEngine";
import useGetToday from "@/composables/useGetToday";
import dateFormatter from "@/utils/dateFormatter";
import MobileDatePicker from "@/components/mobile/MobileDatePicker.vue";
import DesktopDatePicker from "@/components/desktop/DesktopDatePicker.vue";
import BaseInput from "@/components/ui/base-input.vue";

const props = defineProps({
  format: { type: String, default: "YYYY-MM-DD" },
  min: { type: String, default: "1400/01/01" },
  max: { type: String, default: "1410/01/15" },
  assign: { type: Boolean, default: false },
  mode: {
    type: String,
    default: "single",
    validator(value) {
      return ["range", "multiple", "single"].includes(value);
    },
  },
});

const emit = defineEmits(["close", "open", "changed"]);
const model = defineModel()

const activeLang = ref("fa");
const showCalender = ref(props.assign ? true : false);
const today = useGetToday();

const adapter = computed(() => langDates.langs[activeLang.value].adaptor);
const engine = createCalendarEngine(adapter.value, today.year, today.month, true, [
  props.min,
  props.max,
]);

const years = computed(() => {
  const arr = [];
  const start = props.min.split("/")[0];
  const end = props.max.split("/")[0];
  for (let year = start; year <= end; year++) arr.push(Number(year));
  return arr;
});

const months = computed(() => langDates.langs[activeLang.value].months);

const formatDate = (date) => {
  showCalender.value = false;
  const formatted = dateFormatter(date, props.format)
  model.value = formatted
};

watch([showCalender], () => emit(showCalender.value ? "open" : "close"));
</script>

<template>
  <div class="container" v-if="showCalender">
    <DesktopDatePicker :activeLang="activeLang" :months="months" :years="years" @date="formatDate"
      @changed="$emit('changed')" :mode="mode" :engine="engine" :todayDate="today" />
    <MobileDatePicker :months="months" :years="years" :activeLang="activeLang" :engine="engine" :today="today" />
  </div>
  <base-input @click="showCalender = true" v-if="!showCalender && !assign" :value="model" :placeholder="model" />
</template>