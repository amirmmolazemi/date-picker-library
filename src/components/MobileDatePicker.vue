<script setup>
import { computed, nextTick, onMounted, ref } from "vue";
import englishToPersianDigit from "@/utils/englishToPersianDigit";

const props = defineProps({
  months: { type: Array, required: true },
  years: { type: Array, required: true },
});

const currentYear = ref(1404);
const currentMonth = ref(9);
const currentDay = ref(3);

const days = computed(() => {
  const count = currentMonth.value < 7 ? 31 : 30;
  return Array.from({ length: count }, (_, i) => i + 1);
});

const itemHeight = 32;

onMounted(() => {
  nextTick(() => {
    const blocks = document.querySelectorAll(".container__calender__block");

    if (blocks[0]) blocks[0].scrollTop = (currentDay.value - 1) * itemHeight;

    if (blocks[1]) {
      blocks[1].scrollTop =
        (currentMonth.value - 1) * itemHeight - (blocks[1].clientHeight / 2 - itemHeight / 2);
    }

    const yearIndex = props.years.indexOf(currentYear.value);
    if (blocks[2] && yearIndex !== -1) {
      blocks[2].scrollTop = yearIndex * itemHeight - (blocks[2].clientHeight / 2 - itemHeight / 2);
    }
  });
});
</script>

<template>
  <div class="calender">
    <div class="calender__block">
      <span
        class="calender__block--text"
        :class="{ selected: currentDay === day }"
        v-for="day in days"
        :key="day"
      >
        {{ englishToPersianDigit(day) }}
      </span>
    </div>
    <div class="calender__block">
      <span
        class="calender__block--text"
        :class="{ selected: currentMonth === index + 1 }"
        v-for="(month, index) in months"
        :key="month"
      >
        {{ month }}
      </span>
    </div>
    <div class="calender__block">
      <span
        class="calender__block--text"
        :class="{ selected: currentYear === year }"
        v-for="year in years"
        :key="year"
      >
        {{ englishToPersianDigit(year) }}
      </span>
    </div>
  </div>
</template>
