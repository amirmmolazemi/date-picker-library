<script setup>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import dateFormatter from "@/helpers/dateFormatter";
import useDateDefaults from "@/composables/useDateDefaults";
import useCalenderCore from "@/composables/useCalenderCore";
import useGetToday from "@/composables/useGetToday";
import DesktopDatepicker from "@/components/datepicker/desktop-datepicker.vue";
import BaseInput from "@/components/ui/base-input.vue";
import MobileDatepicker from "@/components/datepicker/mobile-datepicker.vue";

const props = defineProps({
  min: { type: String, default: "1404/01/08" },
  max: { type: String, default: "2026/12/08" },
  defaults: { type: Array, default: [] },
  headless: { type: Boolean, default: false },
  locales: { type: Boolean, default: true },
  mode: {
    type: String,
    default: "single",
    validator(value) {
      return ["range", "single", "multiple"].includes(value);
    },
  },
  format: "YYYY/MM/DD",
});

const emit = defineEmits(["close", "open", "changed"]);
const model = defineModel();

const { locale, getLocaleMessage } = useI18n();
const today = computed(() => useGetToday(locale.value));
const { defaultDates } = useDateDefaults(props);
const { engine, months, years } = useCalenderCore(props, today, locale, getLocaleMessage);
const showCalender = ref(props.headless);

const formatDate = (date) => {
  const result = date ? date : defaultDates.value;
  const formattedDate = dateFormatter(result, props.format);
  if (typeof formattedDate === "object" && !Array.isArray(formattedDate))
    model.value = formattedDate.text;
  else model.value = formattedDate;

  if (!props.headless) showCalender.value = false;
  else emit("close");
};

watch(showCalender, (value) => {
  if (!props.headless && value) emit("open");
});

const closeHandler = () => {
  if (!props.headless) showCalender.value = false;
  emit("close");
};

const changeDateHandler = (item) => {
  if (item?.status) {
    const formattedDate = dateFormatter(item.date, props.format);
    model.value = formattedDate;
    if (typeof formattedDate === "object") model.value = formattedDate.text;
  }
  emit("changed");
};
</script>

<template>
  <div class="datepicker">
    <div v-if="showCalender" class="overlay" @click="closeHandler"></div>
    <div class="container" v-if="showCalender">
      <desktop-datepicker
        :months="months"
        :years="years"
        @date="formatDate"
        @changed="changeDateHandler"
        @closed="closeHandler"
        :mode="props.mode"
        :engine="engine"
        :today-date="today"
      />
      <mobile-datepicker
        :months="months"
        :showCalender="showCalender"
        :years="years"
        @changed="changeDateHandler"
        :engine="engine"
        :today="today"
        :min="min"
        :max="max"
      />
    </div>
    <base-input
      v-if="!headless"
      @click="showCalender = true"
      :value="model"
      :placeholder="props.mode !== 'multiple' ? model : ''"
    />
  </div>
</template>
