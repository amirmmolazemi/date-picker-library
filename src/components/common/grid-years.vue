<script setup>
import { englishToPersianDigit } from "@/utils/replaceNumbers";

defineProps({
  currentView: { type: String, required: true },
  selectedDates: { type: Object, required: true },
  availableYears: { type: Array, required: true },
  locale: { type: String, default: "jalaali" },
});

defineEmits(["clicked"]);
</script>

<template>
  <div class="content__years" v-if="currentView === 'years'">
    <div
      class="content__years__year"
      v-for="year in availableYears"
      :key="year"
      :class="{ 'content__years__year--selected': selectedDates.year === year }"
      @click="$emit('clicked', { year })"
    >
      {{ locale === "gregorian" ? year : englishToPersianDigit(year) }}
    </div>
  </div>
</template>
