import { CONFIG } from "lib/config";

export const ADMIN_IDS = [1, 3, 39488, 128727];

/**
 * IDs whitelisted to access the support dashboard
 * @Craig 87 (testnet)
 * @Elias 8301980143151001 (eliascse)
 * @Elias 30 (testnet)
 */
const TESTNET_MANAGER_IDS = [87, 8301980143151001, 30];

/**
 * IDs whitelisted to access the support dashboard
 * @Aeon 29
 * @Dcol 130170
 * @Labochi 7841
 * @Jiko 2489871284279175
 */
const PRODUCTION_MANAGER_IDS = [
  ...ADMIN_IDS,
  29, // Aeon
  130170, // Dcol
  7841, // Labochi
  2489871284279175, // Jiko
];

export const MANAGER_IDS =
  CONFIG.NETWORK === "amoy" ? TESTNET_MANAGER_IDS : PRODUCTION_MANAGER_IDS;

export const TEAM_USERNAMES = [
  "adam",
  "tango",
  "elias",
  "dcol",
  "Aeon",
  "Labochi",
  "Birb",
  "Celinhotv",
  "LittleEins",
  "Craig",
  "Spencer",
  "NoneForSome",
];
