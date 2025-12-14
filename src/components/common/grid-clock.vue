<script setup>
import IconArrow from "@/components/icons/icon-arrow.vue";
import { reactive, watch } from "vue";

const time = reactive({ hour: "00", minute: "00" });
const TIME_LIMITS = { hour: 23, minute: 59 };

const formatTwoDigits = (value) => String(value).padStart(2, "0");

watch(time, () => emit("changed", time));

const emit = defineEmits(["changed"]);

const incrementTimeUnit = (type) => {
  const max = TIME_LIMITS[type];
  const current = Number(time[type]);
  const next = current >= max ? 0 : current + 1;
  time[type] = formatTwoDigits(next);
};

const decrementTimeUnit = (type) => {
  const max = TIME_LIMITS[type];
  const current = Number(time[type]);
  const prev = current <= 0 ? max : current - 1;
  time[type] = formatTwoDigits(prev);
};
</script>

<template>
  <div class="content__clockPicker">
    <div class="content__clockPicker__minute">
      <icon-arrow
        class="content__clockPicker__minute__increment"
        @click="incrementTimeUnit('minute')"
      />
      <span>{{ time.minute }}</span>
      <icon-arrow
        class="content__clockPicker__minute__decrement"
        @click="decrementTimeUnit('minute')"
      />
    </div>
    <span class="content__clockPicker__separator">:</span>
    <div class="content__clockPicker__hour">
      <icon-arrow
        class="content__clockPicker__hour__increment"
        @click="incrementTimeUnit('hour')"
      />
      <span>{{ time.hour }}</span>
      <icon-arrow
        class="content__clockPicker__hour__decrement"
        @click="decrementTimeUnit('hour')"
      />
    </div>
  </div>
</template>
