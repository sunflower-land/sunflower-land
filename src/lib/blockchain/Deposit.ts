import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import DepositAbi from "./abis/Deposit.json";
import { Deposit as IDeposit } from "./types/Deposit";
import { estimateGasPrice, parseMetamaskError } from "./utils";

const address = CONFIG.DEPOSIT_CONTRACT;

export interface DepositArgs {
  web3: Web3;
  account: string;
  farmId: number;
  sfl: string;
  itemIds: number[];
  itemAmounts: number[];
}

export async function depositToFarm({
  web3,
  account,
  farmId,
  sfl,
  itemIds,
  itemAmounts,
}: DepositArgs) {
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    (
      new web3.eth.Contract(
        DepositAbi as AbiItem[],
        address as string
      ) as unknown as IDeposit
    ).methods
      .depositToFarm(farmId, sfl, itemIds, itemAmounts)
      .send({ from: account, gasPrice })
      .on("error", function (error: any) {
        console.log({ error });
        const parsed = parseMetamaskError(error);

        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
        console.log({ transactionHash });
        try {
          // Sequence wallet doesn't resolve the receipt. Therefore
          // We try to fetch it after we have a tx hash returned
          // From Sequence.
          const receipt: any = await web3.eth.getTransactionReceipt(
            transactionHash
          );

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
