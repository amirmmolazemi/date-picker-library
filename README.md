# moli-vue-datepicker

> A vue responsive UI library to select jalali date and time

## Installation

### npm

```bash
npm install moli-vue-datepicker --save
```

### Usage

if you want to use it normal use this code and add the css import to your main.js

```vue
<script setup>
import { ref } from "vue";
import DatePicker from "moli-vue-datepicker";
const date = ref("")
</script>

<template>
  <DatePicker v-model="date" />
</template>
```

``` js
import { createApp } from 'vue'
import App from './App.vue'
import 'moli-vue-datepicker/dist/index.css';

createApp(App).mount('#app')
```

if you want to access to the events that the library provides, use this code

```vue
<script setup>
import { ref } from "vue";
import DatePicker from "moli-vue-datepicker";
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
import DatePicker from "./components/date-picker.vue";
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
| `format` | `string`  | `"YYYY/MM/DD"`            | Format of the dates         | `YYYY.MM.DD` `YYYY-MM-DD` |
| `min`    | `string`  | `1400/1/1`                | min age that calender shows | `any`                     |
| `max`    | `string`  | `1405/1/1`                | max age that calender shows | `any`                     |
| `mode`   | `string`  | `single`                  | change the mode of calender | `range`        |
|`headless`| `boolean`| `false`                 | assign to a input or not    | `true`                    |

## Built With

- [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework.
- [moment-jalaali](https://github.com/jalaali/moment-jalaali) - A Jalaali (Jalali, Persian, Khorshidi, Shamsi) calendar system plugin for moment.js.

## Change log

#### 1.0.1 (2025-12-01)
- docs: format document and improve readability

### 1.0.0 (2025-11-30)
