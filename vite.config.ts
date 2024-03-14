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
      devOptions: {
        enabled: true,
        type: "module",
        navigateFallback: "offline.html",
      },
      srcDir: "src",
      strategies: "injectManifest",
      includeManifestIcons: false,
      includeAssets: [
        "world/*",
        "pwa/**/*",
        "farms/*",
        "offline/*",
        "offline.html",
      ],
      injectManifest: {
        maximumFileSizeToCacheInBytes: 15000000,
        globPatterns: ["assets/*.{jpg,mp3,svg,gif,png}"],
        globIgnores: ["**/*.{js,css,html}"],
      },
      filename: "sw.ts",
      manifest: {
        name: "Sunflower Land",
        id: "com.sunflower-land",
        description:
          "🧑‍🌾 Install our app for a more seamless farming experience. Enjoy full-screen action, easy access, and exclusive features!",
        short_name: "Sunflower Land",
        start_url:
          process.env.VITE_NETWORK === "mainnet" ? "/play/" : "/testnet/",
        theme_color: "#303443",
        display: "standalone",
        background_color: "#0099dc",
        orientation: "portrait",
        icons: [
          {
            src: "pwa/icons/pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa/icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "pwa/screenshots/1.jpg",
            sizes: "900x1680",
            type: "image/jpg",
            form_factor: "narrow",
          },
          {
            src: "pwa/screenshots/2.jpg",
            sizes: "900x1680",
            type: "image/jpg",
            form_factor: "narrow",
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
