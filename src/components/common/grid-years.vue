<script setup>
import { englishToPersianDigit } from "@/utils/replaceNumbers";

defineProps({ showYears: Boolean, date: Object, years: Array, activeLang: String });

defineEmits(["clicked"]);
</script>

<template>
  <div class="content__years" v-if="showYears">
    <div
      class="content__years__year"
      v-for="year in years"
      :key="year"
      :class="{ 'content__years__year--selected': date.year === year }"
      @click="$emit('clicked', year)"
    >
      {{ activeLang === "gregorian" ? year : englishToPersianDigit(year) }}
    </div>
  </div>
</template>
