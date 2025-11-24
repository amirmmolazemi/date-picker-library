<script setup>
import { computed, ref } from "vue";
import { langDates } from "@/constants/langDates";
import MobileDatePicker from "@/components/MobileDatePicker.vue";
import DesktopDatePicker from "@/components/DesktopDatePicker.vue";

const props = defineProps({
  startYear: { type: Number, default: 1354 },
  endYear: { type: Number, default: 1414 },
  yearRange: { type: Number, default: 50 },
});

const activeLang = ref("fa");

const years = computed(() => {
  const start = props.startYear;
  const end = props.endYear !== null ? props.endYear : props.startYear + props.yearRange - 1;
  const arr = [];
  for (let y = start; y <= end; y++) arr.push(y);
  return arr;
});

const months = computed(() => langDates.langs[activeLang.value].months);
</script>

<template>
  <div class="container">
    <DesktopDatePicker :activeLang="activeLang" :months="months" :years="years" />
    <MobileDatePicker :months="months" :years="years" />
  </div>
</template>
