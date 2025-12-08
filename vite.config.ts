import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { minifyHtml, injectHtml } from "vite-plugin-html";
import { VitePWA } from "vite-plugin-pwa";
import preload from "vite-plugin-preload";
import mkcert from "vite-plugin-mkcert";

const getPortFromCLI = () => {
  const portIndex = process.argv.findIndex((arg) => arg === "--port");
  if (portIndex !== -1 && process.argv[portIndex + 1]) {
    return Number(process.argv[portIndex + 1]);
  }
  return 3000; // Default port
};

// https://vitejs.dev/config/
export default defineConfig(() => {
  const port = getPortFromCLI();

  return {
    plugins: [
      react({
        babel: {
          plugins: ["babel-plugin-react-compiler"],
        },
      }),
      preload(),
      tsconfigPaths(),
      minifyHtml(),
      injectHtml({
        // TODO with API environment variables
        injectData: {},
      }),
      ...(port === 443
        ? [
            mkcert({
              hosts: ["https://127.0.0.1"],
            }),
          ]
        : []),
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
          start_url: process.env.VITE_NETWORK === "mainnet" ? "/play/" : "/",
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
  };
});
