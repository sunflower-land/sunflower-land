import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import DepositAbi from "./abis/Deposit.json";
import BudDepositAbi from "./abis/BudDeposit.json";
import { Deposit as IDeposit } from "./types/Deposit";
import { Deposit as IBudDeposit } from "./types/BudDeposit";
import { estimateGasPrice, parseMetamaskError } from "./utils";

const address = CONFIG.DEPOSIT_CONTRACT;
const budsDepositAddress = CONFIG.BUD_DEPOSIT_CONTRACT;

export interface DepositArgs {
  web3: Web3;
  account: string;
  farmId: number;
  sfl: string;
  itemIds: number[];
  itemAmounts: string[];
  wearableIds: number[];
  wearableAmounts: number[];
  budIds: number[];
}

export async function depositToFarm({
  web3,
  account,
  farmId,
  sfl,
  itemIds,
  itemAmounts,
  wearableAmounts,
  wearableIds,
  budIds,
}: DepositArgs) {
  const gasPrice = await estimateGasPrice(web3);

  const depositFn = (
    new web3.eth.Contract(
      BudDepositAbi as AbiItem[],
      budsDepositAddress as string,
    ) as unknown as IBudDeposit
  ).methods.depositToFarm(
    farmId,
    sfl,
    itemIds,
    itemAmounts,
    wearableIds,
    wearableAmounts,
    budIds,
  );

  await new Promise((resolve, reject) => {
    depositFn
      .send({ from: account, gasPrice })
      .on("error", function (error: any) {
        // eslint-disable-next-line no-console
        console.log({ error });
        const parsed = parseMetamaskError(error);

        reject(parsed);
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
        resolve(receipt);
      });
  });
}

export interface DepositBumpkinArgs {
  web3: Web3;
  account: string;
  signature: string;
  deadline: number;
  tokenUri: string;
  farmId: number;
  bumpkinId: number;
  ids: number[];
  amounts: number[];
}

export async function depositBumpkinTransaction({
  web3,
  account,
  farmId,
  bumpkinId,
  ids,
  amounts,
  deadline,
  signature,
  tokenUri,
}: DepositBumpkinArgs) {
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    (
      new web3.eth.Contract(
        DepositAbi as AbiItem[],
        address as string,
      ) as unknown as IDeposit
    ).methods
      .depositBumpkin(
        signature,
        deadline,
        farmId,
        bumpkinId,
        ids,
        amounts,
        tokenUri,
      )
      .send({ from: account, gasPrice })
      .on("error", function (error: any) {
        // eslint-disable-next-line no-console
        console.log({ error });
        const parsed = parseMetamaskError(error);

        reject(parsed);
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
        resolve(receipt);
      });
  });
}
