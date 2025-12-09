<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { englishToPersianDigit } from "@/utils/replaceNumbers";
import IconChevron from "@/components/icons/icon-chevron.vue";
import { langDates } from "@/constants/langDates";

const props = defineProps({
  currentView: { type: String, required: true },
  year: { type: Number, required: true },
  currentMonthText: { type: String, required: true },
});

const showOptions = ref(false);
const { locale, getLocaleMessage } = useI18n();
const localeLabel = computed(() => getLocaleMessage(locale.value).label);
const chevronStyle = computed(() => ({
  transform: showOptions.value ? "rotate(180deg)" : "rotate(0deg)",
}));
const formattedYear = computed(() =>
  locale === "gregorian" ? props.year : englishToPersianDigit(props.year),
);
const locales = computed(() => Object.keys(langDates.langs));

const changeLocale = (selectedLocale) => {
  showOptions.value = false;
  locale.value = selectedLocale;
};

const emit = defineEmits(["update:currentView"]);
</script>

<template>
  <div class="content__filter">
    <div
      class="content__filter__item"
      @click="showOptions = !showOptions"
      v-if="currentView !== 'years'"
    >
      <span>{{ localeLabel }}</span>
      <icon-chevron :style="chevronStyle" />
      <div class="locale-dropdown" v-if="showOptions">
        <div
          class="locale-dropdown__item"
          v-for="label in locales"
          :key="label"
          @click.stop="changeLocale(label)"
        >
          {{ getLocaleMessage(label).label }}
        </div>
      </div>
    </div>
    <div
      class="content__filter__item"
      @click="emit('update:currentView', 'months')"
      v-if="currentView !== 'years'"
    >
      <span>{{ currentMonthText }}</span>
      <icon-chevron />
    </div>
    <div
      class="content__filter__item"
      @click="emit('update:currentView', 'years')"
      v-if="currentView !== 'years'"
    >
      <span>{{ formattedYear }}</span>
      <icon-chevron />
    </div>
    <div class="content__filter__yearNumber" v-if="currentView === 'years'">
      <span>{{ formattedYear }}</span>
    </div>
  </div>
</template>
