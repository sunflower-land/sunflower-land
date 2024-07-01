import Web3 from "web3";
import { AbiItem } from "web3-utils";
import ABI from "./abis/SunflowerDailyRewards.json";
import { CONFIG } from "lib/config";
import { estimateGasPrice, parseMetamaskError } from "./utils";
import { SunflowerDailyRewards } from "./types/SunflowerDailyRewards";

export async function getDailyCode(
  web3: Web3,
  account: string,
  attempts = 0,
): Promise<number> {
  await new Promise((res) => setTimeout(res, 3000 * attempts));

  try {
    const code = await (
      new web3.eth.Contract(
        ABI as AbiItem[],
        CONFIG.DAILY_REWARD_CONTRACT,
      ) as unknown as SunflowerDailyRewards
    ).methods
      .counts(account)
      .call({ from: account });

    return Number(code ?? "0");
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return getDailyCode(web3, account, attempts + 1);
    }

    throw error;
  }
}

export async function trackDailyReward({
  web3,
  account,
  code,
}: {
  web3: Web3;
  account: string;
  code: number;
}): Promise<void> {
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    (
      new web3.eth.Contract(
        ABI as AbiItem[],
        CONFIG.DAILY_REWARD_CONTRACT,
      ) as unknown as SunflowerDailyRewards
    ).methods
      .reward(code)
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
