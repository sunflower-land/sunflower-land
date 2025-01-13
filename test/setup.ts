export {};

jest.doMock("assets/sunnyside", () => ({
  SUNNYSIDE: {
    achievement: {},
    announcement: {},
    badges: {},
    crops: {},
    captcha: {},
    skills: {},
    land: {},
    soil: {},
    animals: {},
    animalFoods: {},
    crafting: {},
    vfx: {},
    fx: {},
    fruit: {},
    brand: {},
    building: {},
    icons: {},
    npcs: {},
    sfts: {},
    resource: {},
    tools: {},
    ui: {},
    decorations: {},
    splash: {},
    tutorial: {},
  },
}));

const NETWORK = process.env.VITE_NETWORK as "mainnet" | "amoy";
const DONATION_ADDRESS = process.env.VITE_DONATION_ADDRESS;

const POLYGON_CHAIN_ID = NETWORK === "mainnet" ? 137 : 80002;

const WISHING_WELL_CONTRACT = process.env.VITE_WISHING_WELL_CONTRACT;
const ACCOUNT_MINTER_CONTRACT = process.env.ACCOUNT_MINTER_CONTRACT;
const FARM_CONTRACT = process.env.VITE_FARM_CONTRACT;
const INVENTORY_CONTRACT = process.env.VITE_INVENTORY_CONTRACT;
const PAIR_CONTRACT = process.env.VITE_PAIR_CONTRACT;
const SESSION_CONTRACT = process.env.VITE_SESSION_CONTRACT;
const TOKEN_CONTRACT = process.env.VITE_TOKEN_CONTRACT;
const FIREBASE_VAPID_KEY = "test";
const FIREBASE_API_KEY = "test";
const FIREBASE_MESSAGING_SENDER_ID = "test";
const FIREBASE_APP_ID = "test";

export const configMock = jest.fn(() => ({
  CONFIG: {
    NETWORK,
    POLYGON_CHAIN_ID,
    DONATION_ADDRESS,
    WISHING_WELL_CONTRACT,
    ACCOUNT_MINTER_CONTRACT,
    FARM_CONTRACT,
    INVENTORY_CONTRACT,
    PAIR_CONTRACT,
    SESSION_CONTRACT,
    TOKEN_CONTRACT,
    FIREBASE_VAPID_KEY,
    FIREBASE_API_KEY,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID,
  },
}));

jest.mock("lib/config", () => ({
  get CONFIG() {
    return {
      NETWORK,
      POLYGON_CHAIN_ID,
      DONATION_ADDRESS,
      WISHING_WELL_CONTRACT,
      ACCOUNT_MINTER_CONTRACT,
      FARM_CONTRACT,
      INVENTORY_CONTRACT,
      PAIR_CONTRACT,
      SESSION_CONTRACT,
      TOKEN_CONTRACT,
      FIREBASE_VAPID_KEY,
      FIREBASE_API_KEY,
      FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID,
    }; // set some default value
  },
}));
