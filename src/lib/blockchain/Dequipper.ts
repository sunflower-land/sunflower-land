import Web3 from "web3";
import { AbiItem } from "web3-utils";
import ABI from "./abis/Dequipper.json";
import { CONFIG } from "lib/config";
import { estimateGasPrice, parseMetamaskError } from "./utils";

export async function dequipBumpkin({
  web3,
  account,
  bumpkinId,
  ids,
  amounts,
}: {
  web3: Web3;
  account: string;
  bumpkinId: number;
  ids: number[];
  amounts: number[];
}): Promise<void> {
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    (
      new web3.eth.Contract(
        ABI as AbiItem[],
        CONFIG.DEQUIPPER_CONTRACT,
      ) as unknown as any
    ).methods
      .dequip(bumpkinId, ids, amounts)
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
