<script setup>
import { computed } from "vue";
import { buildRangeWeeks } from "@/helpers/buildRangeWeeks";
import { englishToPersianDigit } from "@/utils/replaceNumbers";
import sameDate from "@/utils/sameDate";

const props = defineProps({
  currentView: { type: String, required: true },
  selectedDates: { type: Object, required: true },
  selectionMode: { type: String, required: true },
  today: { type: Object, required: true },
  calenderEngine: { type: Object, required: true },
  locale: { type: String, default: "jalaali" },
  todayText: { type: String, required: true },
});

defineEmits(["clicked"]);

const findCellIndex = (cells, date) => cells.findIndex((cell) => sameDate(cell, date));

const inRangeWeeks = computed(() => {
  if (props.selectionMode !== "range") return [];
  const cells = props.calenderEngine.calendarGrid.value;
  const startIndex = findCellIndex(cells, props.selectedDates.range.start);
  const endIndex = findCellIndex(cells, props.selectedDates.range.end);
  if (startIndex === -1 || endIndex === -1) return [];
  return buildRangeWeeks(cells, startIndex, endIndex);
});

const isCellInRange = (index) => inRangeWeeks.value.some((w) => index >= w.from && index <= w.to);

const getCellClasses = (cell, index) => {
  let selected = false;
  if (props.selectionMode === "single") selected = sameDate(props.selectedDates.single, cell);
  if (props.selectionMode === "multiple") {
    const isInMultiple = props.selectedDates.multiple.some((date) => sameDate(date, cell));
    const isEnabled = cell.enable;
    const isCurrent = cell.current;
    selected = isInMultiple && isEnabled && isCurrent;
  }

  const isRangeStart = sameDate(props.selectedDates.range.start, cell);
  const isRangeEnd = sameDate(props.selectedDates.range.end, cell);

  return {
    "content__days__day--selected": selected,
    "content__days__day--not-current": !cell.current || !cell.enable,
    "content__days__day--range-start": isRangeStart,
    "content__days__day--range-end": isRangeEnd,
    "content__days__day--in-range": isCellInRange(index),
  };
};
</script>

<template>
  <div class="content__days" v-if="currentView === 'days'">
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
      v-for="(cell, i) in calenderEngine.calendarGrid.value"
      :key="i"
      :class="getCellClasses(cell, i)"
      @click="$emit('clicked', cell)"
    >
      {{ locale === "gregorian" ? cell.day : englishToPersianDigit(cell.day) }}
      <span class="content__days__day--today" v-if="sameDate(cell, today) && cell.current">
        {{ todayText }}
      </span>
    </div>
  </div>
</template>
