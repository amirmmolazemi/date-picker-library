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
const date = ref("")
</script>

<template>
  <DatePicker v-model="date" />
</template>
```

``` js
import { createApp } from "vue";
import App from "./App.vue";
import DatePicker from "moli-vue-date-picker";
import "moli-vue-date-picker/dist/moli-vue-date-picker.css";

const app = createApp(App);
app.use(DatePicker);
app.mount("#app");

```

if you want to access to the events that the library provides, use this code

```vue
<script setup>
import { ref } from "vue";
const date = ref("")
</script>

<template>
  <date-picker v-model="date" @close="console.log('close')" @open="console.log('open')" @changed="console.log('changed')" />
</template>
```

if you want to declare the calender headless use this code

> using `@close` is required to handle the visibility.
> when you are using the calender, calender is always visible and you have a full control to change the visibility

```vue
<script setup>
import { ref } from "vue";
const date = ref("")
const show = ref(false)
</script>

<template>
  <date-picker v-model="date" @close="show = false" headless v-if="show" />
  <button @click="show = true">show the calender</button>
</template>
```

## 🎯 Common Props

calender component accept these common props:

| Prop     | Type      | Default                   | Description                 | Other options             |
| -------- | --------- | ------------------------- | --------------------------- | ------------------------- |
| `format` | `any`     | `"YYYY/MM/DD"`            | Formating the dates         | `timestamp` , `any format with YYYY,MM,DD` , `{ year: "YYYY", month: "MM", day: "DD" }` |
| `min`    | `string`  | `1400/1/1`                | min age that calender shows | `any date`                |
| `max`    | `string`  | `1405/1/1`                | max age that calender shows | `any date`                |
|`defaults`| `array`   | `[]`                      |default values if user don't choose the date | `any date`|
| `mode`   | `string`  | `single`                  | change the mode of calender | `range` `multiple`        |
|`headless`| `boolean` | `false`                   | assign to a input or not    | `true`                    |

## Built With

- [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework.
- [date-fns](https://date-fns.org/) - A calendar system plugin.
- [i18n](https://vue-i18n.intlify.dev/) - A
Internationalization plugin for Vue.js

## Change log

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
