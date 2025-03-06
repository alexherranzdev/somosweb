// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
  i18n: {
    locales: ["es", "en", "ca"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
