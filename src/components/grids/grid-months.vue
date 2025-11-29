<script setup>
defineProps({
  showMonths: Boolean,
  today: Object,
  months: Array,
});

defineEmits(["clicked"]);
</script>

<template>
  <div class="content__months" v-if="showMonths">
    <div
      class="content__months--month"
      v-for="(month, index) in months"
      :key="month"
      :class="{ selected: today.month - 1 === index }"
      @click="$emit('clicked', index)"
    >
      {{ month }}
    </div>
  </div>
</template>
