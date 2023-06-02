import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import BuyBlockBucksAbi from "./abis/BuyBlockBucks.json";
import { estimateGasPrice, parseMetamaskError } from "./utils";

const address = CONFIG.BUY_BLOCK_BUCKS_CONTRACT;

interface BuyBlockBucksArgs {
  web3: Web3;
  account: string;
  signature: string;
  farmId: number;
  amount: number;
  deadline: number;
  fee: number;
}

export async function buyBlockBucksMATIC({
  web3,
  account,
  signature,
  farmId,
  amount,
  deadline,
  fee,
}: BuyBlockBucksArgs) {
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    new web3.eth.Contract(
      BuyBlockBucksAbi as AbiItem[],
      address as string
    ).methods
      .buyBlockBucksMATIC(signature, farmId, amount, fee, deadline)
      .send({ from: account, value: fee, gasPrice })
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
