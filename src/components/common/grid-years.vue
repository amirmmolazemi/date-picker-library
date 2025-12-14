<script setup>
import { englishToPersianDigit } from "@/utils/replaceNumbers";

defineProps({
  selectedDates: { type: Object, required: true },
  availableYears: { type: Array, required: true },
  locale: { type: String, default: "jalaali" },
});

defineEmits(["clicked"]);
</script>

<template>
  <div class="content__years">
    <slot
      name="year-cell"
      v-for="year in availableYears"
      :key="year"
      :year="year"
      :selected="selectedDates.year === year"
      :locale="locale"
      :selectYear="() => $emit('clicked', { year })"
    >
      <div
        class="content__years__year"
        :class="{ 'content__years__year--selected': selectedDates.year === year }"
        @click="$emit('clicked', { year })"
      >
        {{ locale === "gregorian" ? year : englishToPersianDigit(year) }}
      </div>
    </slot>
  </div>
</template>
