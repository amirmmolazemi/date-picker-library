import "../dist/main.css";
import DatePicker from "./components/datepicker/date-picker.vue";
import { i18n } from "./i18n";

function install(app) {
  app.use(i18n);
  app.component("DatePicker", DatePicker);
}

export default { install, DatePicker };
