<script setup>
import { ref } from "vue";
import DatePicker from "./components/date-picker.vue";
const date = ref("");
</script>

<template>
  <date-picker format="YYYY/MM/DD" mode="range" headless v-model="date" />
</template>

<style lang="scss">
@use "./assets/styles/global.scss";
</style>
