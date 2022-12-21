import Web3 from "web3";
import { AbiItem } from "web3-utils";
import ABI from "./abis/EasterEgg.json";
import { CONFIG } from "lib/config";
import { estimateGasPrice, parseMetamaskError } from "./utils";
import { EasterEgg } from "./types/EasterEgg";

const address = CONFIG.EASTER_EGG_CONTRACT;

/**
 * What is this?
 */
export async function easterEgg({
  bumpkinId,
  web3,
  account,
}: {
  bumpkinId: number;
  web3: Web3;
  account: string;
}): Promise<void> {
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    const contract = new web3.eth.Contract(
      ABI as AbiItem[],
      address as string
    ) as unknown as EasterEgg;
    contract.methods
      .mint(bumpkinId)
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
