import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import tsconfigPaths from "vite-tsconfig-paths";
import { minifyHtml, injectHtml } from "vite-plugin-html";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ["./offline.html"],
  plugins: [
    reactRefresh(),
    tsconfigPaths(),
    minifyHtml(),
    injectHtml({
      // TODO with API environment variables
      injectData: {},
    }),
    VitePWA({
      devOptions: {
        enabled: true,
        type: "module",
      },
      strategies: "injectManifest",
      filename: "sw.ts",
      manifest: {
        name: "Sunflower Land",
        id: "com.sunflower-land",
        description:
          "Plant, Chop, Mine, Craft & Collect at Sunflower Land. The MetaVerse game with endless resources.",
        short_name: "Sunflower Land",
        start_url: "/",
        theme_color: "#303443",
        display: "standalone",
        background_color: "#0099dc",
        orientation: "portrait",
        icons: [
          {
            src: "pwa/icons/manifest-icon-192.maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa/icons/manifest-icon-192.maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "pwa/icons/manifest-icon-512.maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa/icons/manifest-icon-512.maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "pwa/screenshots/logo.webp",
            sizes: "780x350",
            type: "image/webp",
            form_factor: "wide",
          },
          {
            src: "pwa/screenshots/welcome.webp",
            sizes: "780x349",
            type: "image/webp",
          },
          {
            src: "pwa/screenshots/fishing.webp",
            sizes: "780x348",
            type: "image/webp",
          },
        ],
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
