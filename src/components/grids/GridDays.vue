<script setup>
import { computed } from "vue";
import { englishToPersianDigit } from "@/utils/replaceNumbers";

const props = defineProps({
  showMonths: Boolean,
  showYears: Boolean,
  mode: String,
  todayDate: Object,
  selectedRange: Object,
  today: Object,
  engine: Object,
});

defineEmits(["clicked"]);

const inRangeWeeks = computed(() => {
  if (props.mode !== "range") return [];

  const cells = props.engine.grid.value;

  const startIndex = cells.findIndex(c =>
    c.day === props.selectedRange.start.day &&
    c.month === props.selectedRange.start.month &&
    c.year === props.selectedRange.start.year
  );

  const endIndex = cells.findIndex(c =>
    c.day === props.selectedRange.end.day &&
    c.month === props.selectedRange.end.month &&
    c.year === props.selectedRange.end.year
  );

  if (startIndex === -1 || endIndex === -1) return [];
  const weeks = [];

  for (let i = 0; i < cells.length; i += 7) {
    const weekStart = i;
    const weekEnd = i + 6;

    const hasStart = startIndex >= weekStart && startIndex <= weekEnd;
    const hasEnd = endIndex >= weekStart && endIndex <= weekEnd;

    if (hasStart && hasEnd) weeks.push({ from: startIndex, to: endIndex });
    else if (hasStart) weeks.push({ from: startIndex, to: weekEnd });
    else if (hasEnd) weeks.push({ from: weekStart, to: endIndex });
    else if (weekStart > startIndex && weekEnd < endIndex) weeks.push({ from: weekStart, to: weekEnd });
  }

  return weeks;
});

const isCellInRange = (index) => {
  return inRangeWeeks.value.some(w => index >= w.from && index <= w.to);
};
</script>

<template>
  <div class="content__days" v-if="!showMonths && !showYears">
    <div v-for="(week, wIndex) in inRangeWeeks" :key="wIndex" class="content__days__week-gradient" :style="{
      gridColumn: `${week.from % 7 + 1} / ${week.to % 7 + 2}`,
      gridRow: `${Math.floor(week.from / 7) + 1} / ${Math.floor(week.to / 7) + 2}`,
    }"></div>
    <div class="content__days__day" v-for="(cell, i) in engine.grid.value" :key="i" :class="{
      selected: mode !== 'range' && today.day === cell.day && today.month === cell.month && cell.enable,
      today: todayDate.day === cell.day && todayDate.month === cell.month && todayDate.year === cell.year,
      'not-current': !cell.current || !cell.enable,
      'range-start': mode === 'range' &&
        selectedRange.start.day === cell.day &&
        selectedRange.start.month === cell.month &&
        selectedRange.start.year === cell.year,
      'range-end': mode === 'range' &&
        selectedRange.end.day === cell.day &&
        selectedRange.end.month === cell.month &&
        selectedRange.end.year === cell.year,
      'in-range': isCellInRange(i)
    }" @click="$emit('clicked', cell)">
      {{ englishToPersianDigit(cell.day) }}
      <span class="content__days__day--today" v-if="
        todayDate.day === cell.day &&
        todayDate.month === cell.month &&
        todayDate.year === cell.year &&
        cell.current
      ">
        امروز
      </span>
    </div>
  </div>
</template>
