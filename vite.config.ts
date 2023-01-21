import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import tsconfigPaths from "vite-tsconfig-paths";
import { minifyHtml, injectHtml } from "vite-plugin-html";
import inject from "@rollup/plugin-inject";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    tsconfigPaths(),
    minifyHtml(),
    injectHtml({
      // TODO with API environment variables
      injectData: {},
    }),
    VitePWA({
      injectRegister: "auto",
      manifest: {
        short_name: "Sunflower Land",
        icons: [
          {
            src: "./src/assets/brand/logo_with_sunflower_pwa_192.png",
            sizes: "192x88",
            type: "image/png",
          },
          {
            src: "./src/assets/brand/logo_with_sunflower_pwa_512.png",
            sizes: "512x236",
            type: "image/png",
          },
        ],
        display: "fullscreen",
        theme_color: "#5FC14C",
        background_color: "#10A3E3",
      },
    }),
  ],
  // Addresses web3 issue
  resolve: {
    alias: {
      web3: "web3/dist/web3.min.js",
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: "util",
    },
  },
  css: {
    modules: {},
  },
  base: "./",
  build: {
    chunkSizeWarningLimit: 1000,
    assetsDir: "assets",
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      plugins: [inject({ Buffer: ["buffer", "Buffer"] })],
    },
  },
});
