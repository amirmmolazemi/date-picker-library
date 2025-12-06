<script setup>
import { computed, ref } from "vue";
import { englishToPersianDigit } from "@/utils/replaceNumbers";
import IconChevron from "@/components/icons/icon-chevron.vue";
import { useI18n } from "vue-i18n";

defineProps({
  showYears: Boolean,
  year: Number,
  currentMonthText: String,
  activeLang: String,
});

const showOptions = ref(false);
const { locale, getLocaleMessage } = useI18n();
const localeLabel = computed(() => getLocaleMessage(locale.value).label);
const chevronStyle = computed(() => ({
  transform: showOptions.value ? "rotate(180deg)" : "rotate(0deg)",
}));

const changeLocale = (selectedLocale) => {
  showOptions.value = false;
  locale.value = selectedLocale;
};

const emit = defineEmits(["update:showMonths", "update:showYears"]);
</script>

<template>
  <div class="content__filter" v-if="!showYears">
    <div class="content__filter--item" @click="showOptions = !showOptions">
      <span>{{ localeLabel }}</span>
      <icon-chevron :style="chevronStyle" />
      <div class="locale-dropdown" v-if="showOptions">
        <div
          class="locale-dropdown--item"
          v-for="label in ['jalaali', 'gregorian']"
          :key="label"
          @click.stop="changeLocale(label)"
        >
          {{ getLocaleMessage(label).label }}
        </div>
      </div>
    </div>
    <div
      class="content__filter--item"
      @click="
        emit('update:showYears', false);
        emit('update:showMonths', true);
      "
    >
      <span>{{ currentMonthText }}</span>
      <icon-chevron />
    </div>
    <div
      class="content__filter--item"
      @click="
        emit('update:showYears', true);
        emit('update:showMonths', false);
      "
    >
      <span>{{ activeLang === "gregorian" ? year : englishToPersianDigit(year) }}</span>
      <icon-chevron />
    </div>
  </div>
  <div class="content__filter" v-if="showYears">
    <div class="content__filter--item" style="rotate: 180deg">
      <!-- <icon-arrow /> -->
    </div>
    <div class="content__filter--item">
      <span>{{ activeLang === "gregorian" ? year : englishToPersianDigit(year) }}</span>
    </div>
    <div class="content__filter--item">
      <!-- <icon-arrow /> -->
    </div>
  </div>
</template>
