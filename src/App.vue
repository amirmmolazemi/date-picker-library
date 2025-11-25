<script setup>
import { ref } from "vue";
import DatePicker from "./components/DatePicker.vue";
const date = ref("")
const changeHandler = (data) => date.value = data
</script>

<template>
  <date-picker @formated-date="changeHandler" format="YYYY/MM/DD" />
  <span>{{ date }}</span>
</template>

<style lang="scss">
@use "./assets/styles/global.scss";
</style>
