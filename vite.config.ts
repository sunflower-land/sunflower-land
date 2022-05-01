import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import tsconfigPaths from "vite-tsconfig-paths";
import { minifyHtml, injectHtml } from "vite-plugin-html";

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
  },
});
