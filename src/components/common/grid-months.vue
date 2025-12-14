<script setup>
defineProps({
  selectedDates: { type: Object, required: true },
  availableMonths: { type: Array, required: true },
});

defineEmits(["clicked"]);
</script>

<template>
  <div class="content__months">
    <slot
      name="month-cell"
      v-for="(month, index) in availableMonths"
      :key="month"
      :month="month"
      :selected="selectedDates.month - 1 === index"
      :selectMonth="() => $emit('clicked', { year: selectedDates.year, month: index })"
    >
      <div
        class="content__months__month"
        :class="{ 'content__months__month--selected': selectedDates.month - 1 === index }"
        @click="$emit('clicked', { year: selectedDates.year, month: index })"
      >
        {{ month }}
      </div>
    </slot>
  </div>
</template>
