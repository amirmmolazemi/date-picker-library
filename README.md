# moli-vue-date-picker

> A vue responsive UI library to select jalali date and time

## Installation

### npm

```bash
npm install moli-vue-date-picker --save
```

### Usage

if you want to use it normal use this code and add the css import to your main.js

```vue
<script setup>
import { ref } from "vue";
import "moli-vue-date-picker/dist/moli-vue-date-picker.css";
const date = ref("");
</script>

<template>
  <DatePicker v-model="date" />
</template>
```

if you want to access to the events that the library provides, use this code

```vue
<script setup>
import { ref } from "vue";
import "moli-vue-date-picker/dist/moli-vue-date-picker.css";
const date = ref("");
</script>

<template>
  <date-picker
    v-model="date"
    @close="console.log('close')"
    @open="console.log('open')"
    @changed="console.log('changed')"
  />
</template>
```

if you want to declare the calendar headless use this code

> using `@close` is required to handle the visibility.
> when you are using the calendar, calendar is always visible and you have a full control to change the visibility

```vue
<script setup>
import { ref } from "vue";
import "moli-vue-date-picker/dist/moli-vue-date-picker.css";
const date = ref("");
const show = ref(false);
</script>

<template>
  <date-picker v-model="date" @close="show = false" headless v-if="show" />
  <button @click="show = true">show the calendar</button>
</template>
```

if you want to customize the date picker by yourself:

```vue
<script setup>
import { ref } from "vue";
import "moli-vue-date-picker/dist/moli-vue-date-picker.css";
const date = ref("");
</script>

<template>
  <DatePicker v-model="date" />
</template>

<style lang="scss">
:root {
  --CSS-VARIABLE: YOUR_VALUE;
}
</style>
```

```css
:root {
  /* Color palette */
  --primary-200: #cee0fc;
  --primary-400: #84b3fe;
  --primary-600: #2471eb;
  --primary-main: #2f7bf5;
  --gray-100: #f6f8ff;
  --gray-200: #dadce5;
  --gray-400: #a2a5b0;
  --text-white: #ffffff;
  --text-light-info: #2d89e9;
  --text-dark-primary: #f4f4f4;
  --text-light-base: #0e101c;
  --text-light-base2: #5a5a5a;
  --bg-light-default: #fafafa;
  --bg-white: #ffffff;
  --bg-gradiant-start: #cee0fc26;
  --bg-gradiant-end: #cee0fc;
  --input-background: #eee;
  --input-border: #dcdcdc;

  /* Fonts */
  --font-weight-semibold: 600;

  /* Spacing (rem) */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 0.75rem;
  --space-lg: 1rem;
  --space-xl: 1.25rem;
  --space-xxl: 1.5rem;

  /* Font sizes */
  --font-xs: 0.75rem;
  --font-sm: 0.875rem;

  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.625rem;
  --radius-xl: 3.75rem;

  /* Shadows */
  --shadow-container-mobile: -4.25rem 3.875rem 11rem #0000001a;

  /* Breakpoints */
  --md: 768px;

  /* COMPONENTS VARIABLES */

  /* Layout sizes */
  --container-width: 22.5rem;
  --container-max-width-mobile: 37.5rem;
  --container-padding: var(--space-xxl) var(--space-lg) var(--space-md) var(--space-lg);
  --container-border-radius: var(--radius-md);
  --container-max-height-mobile: 28.1875rem;
  --container-background-color: var(--gray-100);
  --container-mobile-background-color: var(--bg-white);
  --container-mobile-padding: 0;
  --container-mobile-border-radius: var(--radius-xl);

  /* Mobile calendar sizes */
  --calendar-width: 22.5rem;
  --calendar-height: 12.9375rem;
  --calendar-gap: 3.5rem;
  --calendar-block-width: 4.25rem;
  --calendar-block-gap: var(--space-md);
  --calendar-text-width: 4rem;
  --calendar-text-color: var(--gray-400);
  --calendar-text-line-height: 2rem;
  --calendar-text-font-weight: var(--font-weight-semibold);
  --calendar-text-today-color: var(--primary-main);
  --calendar-text-today-border-top: 1px solid var(--primary-main);
  --calendar-text-today-border-bottom: 1px solid var(--primary-main);

  /* calendar grid */
  --calendar-grid-gap: var(--space-md);
  --calendar-grid-max-height: 16rem;
  --calendar-grid-columns: 3;
  --calendar-grid-rows: 4;

  /* Desktop calendar sizes */
  --month-width: 5.625rem;
  --month-height: 3.4375rem;
  --year-width: 5.625rem;
  --year-height: 3.4375rem;
  --day-size: 2rem;
  --locale-width: 6.25rem;
  --locale-dropdown-top: 19%;
  --locale-dropdown-left: 68%;
  --locale-border-radius: var(--radius-sm);
  --locale-background-color: var(--gray-200);
  --locale-item-padding: var(--space-sm);
  --locale-item-font-size: var(--font-xs);
  --locale-item-color: var(--text-light-base);

  /* Header */
  --header-margin-bottom: var(--space-md);
  --header-height: var(--space-xxl);
  --header-title-line-height: 1rem;
  --header-title-font-size: var(--font-xs);
  --header-title-color: var(--text-light-base);
  --header-close-icon-width: var(--space-xxl);
  --header-close-icon-height: var(--space-xxl);

  /* Weekday/days/years/months/filter sizes and colors */
  --content-gap: var(--space-xl);
  --filter-height: var(--space-xxl);
  --filter-font-size: var(--font-xs);
  --filter-color: var(--text-light-base);
  --filter-gap: var(--space-xs);
  --weekday-width: 1.875rem;
  --weekday-height: 1rem;
  --weekday-background-color: var(--bg-light-default);
  --weekday-border-radius: var(--radius-sm);
  --weekday-padding-inline: var(--space-xs);
  --weekday-day-font-size: var(--font-xs);
  --weekday-day-color: var(--text-light-base);
  --days-gap: var(--space-lg);
  --day-gradient: linear-gradient(to right, var(--bg-gradiant-start), var(--bg-gradiant-end));
  --day-gradient-radius: 0.625rem;
  --day-border-radius: var(--radius-lg);
  --day-font-size: var(--font-sm);
  --day-color: var(--text-light-base);
  --day-hover-background-color: var(--primary-200);
  --years-padding-right: var(--space-md);
  --year-border: 1px solid var(--gray-200);
  --year-border-radius: var(--radius-lg);
  --year-line-height: 1.25rem;
  --year-font-size: var(--font-xs);
  --year-color: var(--text-light-base2);
  --year-selected-background-color: var(--primary-main);
  --year-selected-color: var(--text-dark-primary);
  --month-border: 1px solid var(--gray-200);
  --month-border-radius: var(--radius-lg);
  --month-line-height: 1.25rem;
  --month-color: var(--text-light-base2);
  --month-font-size: var(--font-xs);
  --month-selected-background-color: var(--primary-main);
  --month-selected-color: var(--text-dark-primary);

  /* Time Picker */
  --clockPicker-height: 16rem;
  --clockPicker-separator-font-size: 2.5rem;
  --clockPicker-font-size: 3.125rem;
  --clockPicker-gap: 3.125rem;
  --clockPicker-increment-rotate: 90deg;
  --clockPicker-decrement-rotate: -90deg;
  --clockPicker-texts-gap: 0.625rem;

  /* Misc */
  --scrollbar-width-sm: 0.25rem;
  --scrollbar-track-border-radius: var(--radius-lg);
  --scrollbar-track-background-color: var(--primary-200);
  --scrollbar-track-border-left: 1px solid var(--bg-white);
  --scrollbar-track-border-right: 1px solid var(--bg-white);
  --scrollbar-thumb-border-radius: var(--radius-sm);
  --scrollbar-thumb-background-color: var(--primary-400);

  --text-today-size: 0.625rem;
  --text-today-line: 0.75rem;
  --text-today-color: var(--text-light-info);
  --text-not-current-color: var(--gray-400);

  /* range/selected */
  --range-background-color: var(--primary-main);
  --range-hover-background-color: var(--primary-main);
  --range-hover-color: var(--text-dark-primary);

  /* Base button */
  --base-button-height: 3rem;
  --base-button-inline-padding: 1rem;
  --base-button-text: var(--text-white);

  /* Base input */
  --base-input-background-color: var(--bg-white);
  --base-input-width: 22.5rem;
  --base-input-border: 1px solid var(--input-border);
  --base-input-button-background: var(--input-background);
  --base-input-button-width: 1.75rem;
  --base-input-button-height: 1.75rem;
}
```

## inject your UI

you can inject your UI or change the styles with this code.
each template belongs to each component in the date picker

```vue
<template>
  <date-picker format="YYYY/MM/DD" mode="range" v-model="date">
    <template #submit-button="{ submit, locale }"></template>
    <template #weekdays="{ weekdays }"></template>
    <template #grid-filter="{ currentMonthText, currentView, year, updateCurrentView }"> </template>
    <template #grid-clock="{ onChange }"> </template>
    <template #input-field="{ value, openCalendar, mode }"></template>
    <template #locale-dropdown="{ locales, changeLocale }"> </template>
    <template #day-cell="{ cell, selectDay, isToday, todayText }"> </template>
    <template #month-cell="{ month, selected, selectMonth }"> </template>
    <template #year-cell="{ year, selected, locale, selectYear }"> </template>
    <template #close-icon="{ close }"> </template>
  </date-picker>
</template>
```

## 🎯 Common Props

calendar component accept these common props:

| Prop         | Type      | Default        | Description                                  | Other options                                                                           |
| ------------ | --------- | -------------- | -------------------------------------------- | --------------------------------------------------------------------------------------- |
| `format`     | `any`     | `"YYYY/MM/DD"` | Formating the dates                          | `timestamp` , `any format with YYYY,MM,DD` , `{ year: "YYYY", month: "MM", day: "DD" }` |
| `min`        | `string`  | `1400/1/1`     | min age that calendar shows                  | `any date`                                                                              |
| `max`        | `string`  | `1405/1/1`     | max age that calendar shows                  | `any date`                                                                              |
| `defaults`   | `array`   | `[]`           | default values if user don't choose the date | `any date`                                                                              |
| `mode`       | `string`  | `single`       | change the mode of calendar                  | `range` `multiple`                                                                      |
| `headless`   | `boolean` | `false`        | assign to a input or not                     | `true`                                                                                  |
| `pickerType` | `string`  | `both`         | choose to have date picker or time picker    | `clock` `date`                                                                          |

## Built With

- [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework.
- [date-fns](https://date-fns.org/) - A calendar system plugin.
- [i18n](https://vue-i18n.intlify.dev/) - A
  Internationalization plugin for Vue.js

## Change log

#### 0.6.0 (2025-12-14)

- feat: add time picker to the project
- feat: add customization ui feature that consumer can inject their UI

#### 0.5.0 (2025-12-10)

- feat: add customize feature for date picker and input

#### 0.4.5 (2025-12-09)

- refactor: reduce the package bundle size to 37kb and makes the project better

#### 0.4.2 (2025-12-07)

- fix: fix the mobile device bug for formatting date
- docs: add the new change log for document

#### 0.4.0 (2025-12-07)

- feat: add new formats to return ( add timestamp and objectTemplate )
- docs: add new props options

#### 0.3.1 (2025-12-06)

- docs: fix some issues in document for wrong syntax

#### 0.3.0 (2025-12-06)

- feat: add the localization options for gregorian and jalaali

#### 0.2.0 (2025-12-05)

- feat: add the defaults values as a props
- fix: fix the selecting issues for months and years

#### 0.1.1 (2025-12-03)

- fix: fix the selection issue in ranges and multiples

#### 0.1.0 (2025-12-02)

- feat: add multiple selection to the project

#### 0.0.2 (2025-12-02)

- fix: fix the css minification in the package
- fix: fix the styles imports for performance
- feat: migrate to date-fns instead of moment.js

#### 0.0.1 (2025-12-01)

- docs: format document and improve readability

### 0.0.1 (2025-11-30)
