<script setup>
import { ref } from "vue";
import DatePicker from "./components/DatePicker.vue";
const date = ref("");
</script>

<template>
  <date-picker format="YYYY/MM/DD" mode="single" v-model="date" />
  <span>{{ date }}</span>
</template>

<style lang="scss">
@use "./assets/styles/global.scss";
</style>
