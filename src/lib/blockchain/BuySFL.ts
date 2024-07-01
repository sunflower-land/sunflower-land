import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import BuySFLAbi from "./abis/BuySFL.json";
import { estimateGasPrice, parseMetamaskError } from "./utils";

const address = CONFIG.BUY_SFL_CONTRACT;

interface BuySFLArgs {
  web3: Web3;
  account: string;
  signature: string;
  farmId: number;
  amountOutMin: number;
  deadline: number;
  feePercent: number;
  matic: number;
}

export async function buySFL({
  web3,
  account,
  signature,
  farmId,
  amountOutMin,
  deadline,
  feePercent,
  matic,
}: BuySFLArgs) {
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    new web3.eth.Contract(BuySFLAbi as AbiItem[], address as string).methods
      .swap(signature, farmId, amountOutMin, deadline, feePercent)
      .send({ from: account, value: matic, gasPrice })
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
