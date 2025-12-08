<script setup>
import { computed } from "vue";
import { englishToPersianDigit } from "@/utils/replaceNumbers";
import sameDate from "@/utils/sameDate";

const props = defineProps({
  showMonths: Boolean,
  showYears: Boolean,
  mode: String,
  todayDate: Object,
  date: Object,
  engine: Object,
  activeLang: String,
  todayText: String,
});

defineEmits(["clicked"]);

const inRangeWeeks = computed(() => {
  if (props.mode !== "range") return [];
  const cells = props.engine.grid.value;
  const startIndex = cells.findIndex((cell) => sameDate(cell, props.date.range.start));
  const endIndex = cells.findIndex((cell) => sameDate(cell, props.date.range.end));

  if (startIndex === -1 || endIndex === -1) return [];
  const weeks = [];

  for (let index = 0; index < cells.length; index += 7) {
    const weekStart = index;
    const weekEnd = index + 6;

    const hasStart = startIndex >= weekStart && startIndex <= weekEnd;
    const hasEnd = endIndex >= weekStart && endIndex <= weekEnd;

    if (hasStart && hasEnd) weeks.push({ from: startIndex, to: endIndex });
    else if (hasStart) weeks.push({ from: startIndex, to: weekEnd });
    else if (hasEnd) weeks.push({ from: weekStart, to: endIndex });
    else if (weekStart > startIndex && weekEnd < endIndex)
      weeks.push({ from: weekStart, to: weekEnd });
  }

  return weeks;
});

const isCellInRange = (index) => {
  return inRangeWeeks.value.some((w) => index >= w.from && index <= w.to);
};

const getCellClasses = (cell, index) => {
  const selected =
    props.mode === "single"
      ? sameDate(props.date.single, cell)
      : props.date.multiple.some((date) => sameDate(date, cell)) &&
        cell.enable &&
        props.mode !== "range" &&
        cell.current;
  const isRangeStart = sameDate(props.date.range.start, cell);
  const isRangeEnd = sameDate(props.date.range.end, cell);

  return {
    selected,
    "not-current": !cell.current || !cell.enable,
    "range-start": isRangeStart,
    "range-end": isRangeEnd,
    "in-range": isCellInRange(index),
  };
};
</script>

<template>
  <div class="content__days" v-if="!showMonths && !showYears">
    <div
      v-for="(week, wIndex) in inRangeWeeks"
      :key="wIndex"
      class="content__days__week-gradient"
      :style="{
        gridColumn: `${(week.from % 7) + 1} / ${(week.to % 7) + 2}`,
        gridRow: `${Math.floor(week.from / 7) + 1} / ${Math.floor(week.to / 7) + 2}`,
      }"
    ></div>
    <div
      class="content__days__day"
      v-for="(cell, i) in engine.grid.value"
      :key="i"
      :class="getCellClasses(cell, i)"
      @click="$emit('clicked', cell)"
    >
      {{ activeLang === "gregorian" ? cell.day : englishToPersianDigit(cell.day) }}
      <span class="content__days__day--today" v-if="sameDate(cell, todayDate) && cell.current">
        {{ todayText }}
      </span>
    </div>
  </div>
</template>
