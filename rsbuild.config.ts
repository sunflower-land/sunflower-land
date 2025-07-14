import { defineConfig, loadEnv } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";

const { publicVars } = loadEnv({ prefixes: ["VITE_"] });

// https://rsbuild.rs/guide/migration/vite
export default defineConfig({
  plugins: [pluginReact(), pluginNodePolyfill()],
  html: {
    template: "./rsbuild.html",
  },
  source: {
    entry: {
      index: "./src/main.tsx",
    },
    define: {
      ...publicVars,
      "process.env": "({})",
      "import.meta.env": "({})",
    },
  },
});
