import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.sunflowerland.com",
  appName: "Sunflower Land",
  webDir: "dist",
  server: {
    url: "https://sunflower-land.com/play",
  },
  bundledWebRuntime: false,
};

export default config;
