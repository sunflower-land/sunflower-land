import { wallet } from "lib/blockchain/wallet";
import { fromWei } from "web3-utils";
import Decimal from "decimal.js-light";

import { balancesToInventory } from "lib/utils/visitUtils";

import { GameState, Inventory, InventoryItemName } from "../types/game";
import { getKeys } from "../types/craftables";
import { EMPTY } from "../lib/constants";
import { CONFIG } from "lib/config";
import { KNOWN_IDS, KNOWN_ITEMS } from "../types";
import { getMintedAtBatch, Recipe } from "lib/blockchain/Game";
import { loadBumpkins, OnChainBumpkin } from "lib/blockchain/BumpkinDetails";
import { sflBalanceOf } from "lib/blockchain/Token";
import { getInventoryBalances } from "lib/blockchain/Inventory";
import { getFarm } from "lib/blockchain/Farm";
import {
  GOBLIN_BLACKSMITH_ITEMS,
  GOBLIN_PIRATE_ITEMS,
} from "../types/collectibles";

const API_URL = CONFIG.API_URL;

async function loadMetadata(id: number) {
  // Go and fetch the metadata file for this farm
  const url = `${API_URL}/nfts/farm/${id}`;
  const response = await window.fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });

  const data = await response.json();

  return data;
}

type GetStateArgs = {
  farmAddress: string;
  account: string;
  id: number;
};

export async function isFarmBlacklisted(id: number) {
  const metadata = await loadMetadata(id);

  return metadata.image.includes("banned");
}
const blacksmithItems = getKeys(GOBLIN_BLACKSMITH_ITEMS).map(
  (name) => KNOWN_IDS[name]
);
const pirateItems = getKeys(GOBLIN_PIRATE_ITEMS).map((name) => KNOWN_IDS[name]);

const RECIPES_IDS = [...blacksmithItems, ...pirateItems];

export type LimitedItemRecipeWithMintedAt = Recipe & {
  mintedAt: number;
};

export async function getGameOnChainState({
  farmAddress,
  account,
}: GetStateArgs): Promise<{
  game: GameState;
  bumpkin?: OnChainBumpkin;
  bumpkins: OnChainBumpkin[];
}> {
  if (!CONFIG.API_URL) {
    return { game: EMPTY, bumpkins: [] };
  }

  const balance = await sflBalanceOf(wallet.web3Provider, farmAddress);
  const balances = await getInventoryBalances(wallet.web3Provider, farmAddress);
  const bumpkins = await loadBumpkins(wallet.web3Provider, account);

  const inventory = balancesToInventory(balances);

  return {
    game: {
      ...EMPTY,
      balance: new Decimal(fromWei(balance)),
      inventory,
    },
    bumpkin: bumpkins[0],
    bumpkins,
  };
}

export async function getOnChainState({
  farmAddress,
  account,
  id,
}: GetStateArgs): Promise<{
  game: GameState;
  owner: string;
  mintedAtTimes: Partial<Record<InventoryItemName, number>>;
  bumpkin?: OnChainBumpkin;
}> {
  if (!CONFIG.API_URL) {
    return { game: EMPTY, owner: "", mintedAtTimes: {} };
  }

  const balanceFn = sflBalanceOf(wallet.web3Provider, farmAddress);
  const balancesFn = getInventoryBalances(wallet.web3Provider, farmAddress);
  const farmFn = getFarm(wallet.web3Provider, id);
  const bumpkinFn = loadBumpkins(wallet.web3Provider, account);

  const mintedAtsFn = getMintedAtBatch(wallet.web3Provider, id, RECIPES_IDS);

  // Promise all
  const [balance, balances, farm, mintedAts, bumpkins] = await Promise.all([
    balanceFn,
    balancesFn,
    farmFn,
    mintedAtsFn,
    bumpkinFn,
  ]);

  const mintedAtTimes = mintedAts.reduce(
    (acc, mintedAt, index) => ({
      ...acc,
      [KNOWN_ITEMS[RECIPES_IDS[index]]]: Number(mintedAt),
    }),
    {}
  );

  const inventory = balancesToInventory(balances);

  return {
    game: {
      ...EMPTY,
      balance: new Decimal(fromWei(balance)),
      inventory,
    },
    owner: farm.owner,
    mintedAtTimes,
    bumpkin: bumpkins[0],
  };
}
export async function getTreasuryItems() {
  if (!API_URL) return {} as Inventory;

  const treasuryItems = await getInventoryBalances(
    wallet.web3Provider,
    CONFIG.TREASURY_ADDRESS
  );

  return balancesToInventory(treasuryItems);
}
