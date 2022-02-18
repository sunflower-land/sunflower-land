const NETWORK = process.env.VITE_NETWORK as "mainnet" | "mumbai";
const DONATION_ADDRESS = process.env.VITE_DONATION_ADDRESS;

const POLYGON_CHAIN_ID = NETWORK === "mainnet" ? 137 : 80001;

const WISHING_WELL_CONTRACT = process.env.VITE_WISHING_WELL_CONTRACT;
const BETA_CONTRACT = process.env.VITE_BETA_CONTRACT;
const FARM_CONTRACT = process.env.VITE_FARM_CONTRACT;
const INVENTORY_CONTRACT = process.env.VITE_INVENTORY_CONTRACT;
const PAIR_CONTRACT = process.env.VITE_PAIR_CONTRACT;
const SESSION_CONTRACT = process.env.VITE_SESSION_CONTRACT;
const TOKEN_CONTRACT = process.env.VITE_TOKEN_CONTRACT;

export const configMock = jest.fn(() => ({
  CONFIG: {
    NETWORK,
    POLYGON_CHAIN_ID,
    DONATION_ADDRESS,
    WISHING_WELL_CONTRACT,
    BETA_CONTRACT,
    FARM_CONTRACT,
    INVENTORY_CONTRACT,
    PAIR_CONTRACT,
    SESSION_CONTRACT,
    TOKEN_CONTRACT,
  },
}));

jest.doMock("../config", configMock);
