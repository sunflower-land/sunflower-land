import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem, toWei } from "web3-utils";
import PairJSON from "./abis/Pair.json";

const address = CONFIG.PAIR_CONTRACT;

export async function getPairBalance(web3: Web3, account: string) {
  const balance: string = await new web3.eth.Contract(
    PairJSON as AbiItem[],
    address as string,
  ).methods
    .balanceOf(account)
    .call({ from: account });

  return balance;
}

export async function mintTestnetTokens(web3: Web3, account: string) {
  const amount = toWei("100");
  return new Promise((resolve, reject) => {
    new web3.eth.Contract(PairJSON as AbiItem[], address as string).methods
      .mint(account, amount)
      .send({ from: account })
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
