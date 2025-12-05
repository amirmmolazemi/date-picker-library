<script setup>
import { englishToPersianDigit } from "@/utils/replaceNumbers";
import IconChevron from "@/components/icons/icon-chevron.vue";

defineProps({
  showYears: Boolean,
  year: Number,
  currentMonthText: String,
  activeLang: String,
});

const emit = defineEmits(["update:showMonths", "update:showYears"]);
</script>

<template>
  <div class="content__filter" v-if="!showYears">
    <div
      class="content__filter--item"
      @click="
        emit('update:showYears', false);
        emit('update:showMonths', true);
      "
    >
      <span>{{ currentMonthText }}</span>
      <icon-chevron />
    </div>
    <div
      class="content__filter--item"
      @click="
        emit('update:showYears', true);
        emit('update:showMonths', false);
      "
    >
      <span>{{ activeLang === "gregorian" ? year : englishToPersianDigit(year) }}</span>
      <icon-chevron />
    </div>
  </div>
  <div class="content__filter" v-if="showYears">
    <div class="content__filter--item" style="rotate: 180deg">
      <!-- <icon-arrow /> -->
    </div>
    <div class="content__filter--item">
      <span>{{ activeLang === "gregorian" ? year : englishToPersianDigit(year) }}</span>
    </div>
    <div class="content__filter--item">
      <!-- <icon-arrow /> -->
    </div>
  </div>
</template>
