import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import tsconfigPaths from "vite-tsconfig-paths";
import { minifyHtml, injectHtml } from "vite-plugin-html";
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
      // strategies: "injectManifest",
      // srcDir: "src",
      // filename: "service-worker.js",
      selfDestroying: true,
      manifest: {
        short_name: "Sunflower Land",
        icons: [
          {
            src: `pwa/icon_pwa_144.png`,
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: `pwa/icon_pwa_192.png`,
            sizes: "192x88",
            type: "image/png",
          },
          {
            src: `pwa/icon_pwa_512.png`,
            sizes: "512x236",
            type: "image/png",
          },
        ],
        display: "fullscreen",
        theme_color: "#3E8848",
        background_color: "#124E89",
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
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ["phaser"],
        },
      },
    },
  },
});
