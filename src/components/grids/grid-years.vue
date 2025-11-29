<script setup>
import { englishToPersianDigit } from "@/utils/replaceNumbers";

defineProps({
  showYears: Boolean,
  today: Object,
  years: Array,
});

defineEmits(["clicked"]);
</script>

<template>
  <div class="content__years" v-if="showYears">
    <div
      class="content__years--year"
      v-for="year in years"
      :key="year"
      :class="{ selected: today.year === year }"
      @click="$emit('clicked', year)"
    >
      {{ englishToPersianDigit(year) }}
    </div>
  </div>
</template>
