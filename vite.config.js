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
        @use "@/assets/styles/main" as *;
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
      formats: ["es"],
    },
    minify: "terser",
    rollupOptions: {
      external: ["vue", "vue-i18n", "@vueuse/core", /^date-fns/],
    },
  },
});
