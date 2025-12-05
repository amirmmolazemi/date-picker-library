<script setup>
defineProps({ showMonths: Boolean, date: Object, months: Array });

defineEmits(["clicked"]);
</script>

<template>
  <div class="content__months" v-if="showMonths">
    <div
      class="content__months--month"
      v-for="(month, index) in months"
      :key="month"
      :class="{ selected: date.month - 1 === index }"
      @click="$emit('clicked', { year: date.year, month: index })"
    >
      {{ month }}
    </div>
  </div>
</template>
