import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/assets/styles/abstracts/_variables.scss" as *;
          @use "@/assets/styles/abstracts/_mixins.scss" as *;
        `,
      },
    },
  },
  build: {
    sourcemap: false,
    lib: {
      entry: fileURLToPath(new URL("./src/index.js", import.meta.url)),
      name: "MoliDatepicker",
      fileName: (format) => `moli-vue-date-picker.${format}.js`,
    },
    rollupOptions: {
      external: [
        "vue",
        "vue-i18n",
        "@vueuse/core",
        /^date-fns/,
      ],
      output: {
        globals: {
          vue: "Vue",
          "vue-i18n": "VueI18n",
          "@vueuse/core": "VueUse",
          "date-fns": "DateFns",
          "date-fns-jalali": "DateFnsJalali",
        },
      },
    },
  },
});