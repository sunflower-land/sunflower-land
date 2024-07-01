import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import WishingWellJSON from "./abis/WishingWell.json";
import { estimateGasPrice } from "./utils";

const address = CONFIG.WISHING_WELL_CONTRACT;

export async function wish(web3: Web3, account: string) {
  const gasPrice = await estimateGasPrice(web3);
  return new Promise((resolve, reject) => {
    new web3.eth.Contract(
      WishingWellJSON as AbiItem[],
      address as string,
    ).methods
      .wish()
      .send({ from: account, gasPrice })
      .on("error", function (error: any) {
        // eslint-disable-next-line no-console
        console.log({ error });

        reject(error);
      })
      .on("transactionHash", async (transactionHash: any) => {
        // eslint-disable-next-line no-console
        console.log({ transactionHash });
        try {
          // Sequence wallet doesn't resolve the receipt. Therefore
          // We try to fetch it after we have a tx hash returned
          // From Sequence.
          const receipt: any =
            await web3.eth.getTransactionReceipt(transactionHash);

          if (receipt) resolve(receipt);
        } catch (e) {
          reject(e);
        }
      })
      .on("receipt", function (receipt: any) {
        // eslint-disable-next-line no-console
        console.log({ receipt });
        resolve(receipt);
      });
  });
}

export async function collectFromWellOnChain({
  web3,
  account,
  signature,
  tokens,
  deadline,
  farmId,
}: {
  web3: Web3;
  account: string;
  signature: string;
  tokens: string;
  deadline: number;
  farmId: number;
}) {
  const gasPrice = await estimateGasPrice(web3);

  return new Promise((resolve, reject) => {
    new web3.eth.Contract(
      WishingWellJSON as AbiItem[],
      address as string,
    ).methods
      .collectFromWell(signature, tokens, deadline, farmId)
      .send({ from: account, gasPrice })
      .on("error", function (error: any) {
        // eslint-disable-next-line no-console
        console.log({ error });

        reject(error);
      })
      .on("transactionHash", async (transactionHash: any) => {
        // eslint-disable-next-line no-console
        console.log({ transactionHash });
        try {
          // Sequence wallet doesn't resolve the receipt. Therefore
          // We try to fetch it after we have a tx hash returned
          // From Sequence.
          const receipt: any =
            await web3.eth.getTransactionReceipt(transactionHash);

          if (receipt) resolve(receipt);
        } catch (e) {
          reject(e);
        }
      })
      // This event is fired once the tx has been mined and not reverted. The first time when confNumber == 0 is the actual block in which it was mined.
      // This event will fire 24 times in total with a new confirmation number each time.
      // The higher the confirmation number the more confident you can be that the chain will not be undone.
      .on("confirmation", function (confNumber: number, receipt: any) {
        if (confNumber === 3) {
          resolve(receipt);
        }
      });
  });
}

export async function getWellBalance(web3: Web3, account: string) {
  const balance = await new web3.eth.Contract(
    WishingWellJSON as AbiItem[],
    address as string,
  ).methods
    .balanceOf(account)
    .call({ from: account });

  return balance;
}

export async function canCollectFromWell(
  web3: Web3,
  account: string,
): Promise<boolean> {
  const canCollect = await new web3.eth.Contract(
    WishingWellJSON as AbiItem[],
    address as string,
  ).methods
    .canCollect(account)
    .call({ from: account });

  return canCollect;
}

export async function lastCollectedFromWell(
  web3: Web3,
  account: string,
): Promise<number> {
  const lastUpdatedAt = await new web3.eth.Contract(
    WishingWellJSON as AbiItem[],
    address as string,
  ).methods
    .lastUpdatedAt(account)
    .call({ from: account });

  return lastUpdatedAt;
}

export async function getLockedPeriod(
  web3: Web3,
  account: string,
): Promise<number> {
  const getLockedPeriod = await new web3.eth.Contract(
    WishingWellJSON as AbiItem[],
    address as string,
  ).methods
    .getLockedPeriod()
    .call({ from: account });

  return getLockedPeriod;
}
