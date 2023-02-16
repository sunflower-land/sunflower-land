import Decimal from "decimal.js-light";
import { KNOWN_IDS, IDS } from "features/game/types";
import { InventoryItemName } from "features/game/types/game";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import InventoryJSON from "./abis/Inventory.json";
import { CONFIG } from "lib/config";
import { parseMetamaskError } from "./utils";
import { SunflowerLandInventory } from "./types";
import { TransferBatch, TransferSingle } from "./types/SunflowerLandInventory";

const contractAddress = CONFIG.INVENTORY_CONTRACT;

export type ItemSupply = Record<InventoryItemName, Decimal>;

async function loadSupplyBatch(
  web3: Web3,
  account: string,
  ids: number[],
  attempts = 0
): Promise<string[]> {
  await new Promise((res) => setTimeout(res, 3000 * attempts));

  try {
    const supplies: string[] = await (
      new web3.eth.Contract(
        InventoryJSON as AbiItem[],
        contractAddress as string
      ) as unknown as SunflowerLandInventory
    ).methods
      .totalSupplyBatch(ids)
      .call({ from: account });

    return supplies;
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return loadSupplyBatch(web3, account, ids, attempts + 1);
    }

    throw error;
  }
}

export async function totalSupply(web3: Web3, account: string) {
  const ids = Object.values(KNOWN_IDS);
  const names = Object.keys(KNOWN_IDS) as InventoryItemName[];

  const supplies: string[] = await loadSupplyBatch(web3, account, ids);

  return supplies.reduce(
    (items, supply, index) => ({
      ...items,
      [names[index]]: new Decimal(supply),
    }),
    {} as ItemSupply
  );
}

export async function getInventorySupply(
  web3: Web3,
  account: string,
  ids: number[]
) {
  const supply = await loadSupplyBatch(web3, account, ids);
  return supply.map(Number);
}

export async function getInventoryBalances(
  web3: Web3,
  account: string,
  address: string
) {
  const batchAccounts = Array(IDS.length).fill(address);
  const balances = await (
    new web3.eth.Contract(
      InventoryJSON as AbiItem[],
      contractAddress as string
    ) as unknown as SunflowerLandInventory
  ).methods
    .balanceOfBatch(batchAccounts, IDS)
    .call({ from: account });

  return balances;
}

export async function getInventoryBalance(
  web3: Web3,
  account: string,
  farmAddress: string,
  id: number
): Promise<string> {
  return await (
    new web3.eth.Contract(
      InventoryJSON as AbiItem[],
      contractAddress as string
    ) as unknown as SunflowerLandInventory
  ).methods
    .balanceOf(farmAddress, id)
    .call();
}

export async function getInventoryTransfers(
  web3: Web3,
  account: string,
  farmAddress: string,
  fromBlock: number
) {
  const events: TransferSingle[] = await new Promise((res, rej) => {
    (
      new web3.eth.Contract(
        InventoryJSON as AbiItem[],
        contractAddress as string
      ) as unknown as SunflowerLandInventory
    ).getPastEvents(
      "TransferSingle",
      {
        filter: {
          to: farmAddress,
        },
        fromBlock,
        toBlock: "latest",
      },
      function (error, events) {
        if (error) {
          rej(error);
        }

        res(events as unknown as TransferSingle[]);
      }
    );
  });

  const externalEvents = events.filter(
    (event) =>
      event.returnValues.from !== "0x0000000000000000000000000000000000000000"
  );

  return externalEvents;
}

export async function getInventoryBatchTransfers(
  web3: Web3,
  account: string,
  farmAddress: string,
  fromBlock: number
) {
  const events: TransferBatch[] = await new Promise((res, rej) => {
    (
      new web3.eth.Contract(
        InventoryJSON as AbiItem[],
        contractAddress as string
      ) as unknown as SunflowerLandInventory
    ).getPastEvents(
      "TransferBatch",
      {
        filter: {
          to: farmAddress,
        },
        fromBlock,
        toBlock: "latest",
      },
      function (error, events) {
        if (error) {
          rej(error);
        }

        res(events as unknown as TransferBatch[]);
      }
    );
  });

  const externalEvents = events.filter(
    (event) =>
      event.returnValues.from !== "0x0000000000000000000000000000000000000000"
  );

  return externalEvents;
}
