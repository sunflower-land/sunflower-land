import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem, fromWei } from "web3-utils";
import ABI from "./abis/AccountMinter.json";
import { AccountMinter as IAccountMinter } from "./types/AccountMinter";
import { estimateGasPrice, parseMetamaskError } from "./utils";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { PayableTransactionObject } from "./types/types";

export async function getCreatedAt(
  web3: Web3,
  account: string,
  address: string,
  attempts = 1,
): Promise<number> {
  await new Promise((res) => setTimeout(res, 3000 * attempts));

  try {
    const createdAt = await (
      new web3.eth.Contract(
        ABI as AbiItem[],
        CONFIG.ACCOUNT_MINTER_CONTRACT as string,
      ) as unknown as IAccountMinter
    ).methods
      .farmCreatedAt(address)
      .call({ from: account });

    return Number(createdAt);
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return getCreatedAt(web3, account, address, attempts + 1);
    }

    throw error;
  }
}

export async function estimateAccountGas({
  web3,
  account,
  signature,
  deadline,
  fee,
}: {
  web3: Web3;
  account: string;
  signature: string;
  deadline: number;
  fee: string;
}): Promise<number> {
  const gasPrice = await estimateGasPrice(web3);

  return new Promise((res, rej) => {
    (
      (
        new web3.eth.Contract(
          ABI as AbiItem[],
          CONFIG.ACCOUNT_MINTER_CONTRACT as string,
        ) as unknown as IAccountMinter
      ).methods.mintAccount(signature, deadline, fee, account) as any
    ).estimateGas(
      { from: account, value: 0 },
      function (err: any, estimatedGas: string) {
        // eslint-disable-next-line no-console
        console.log({ err, estimatedGas });
        if (err) {
          rej(err);
        }

        const transactionCost = Number(gasPrice) * Number(estimatedGas);
        res(transactionCost);
      },
    );
  });
}

export async function createNewAccount({
  web3,
  account,
  signature,
  deadline,
  fee,
}: {
  web3: Web3;
  account: string;
  signature: string;
  deadline: number;
  fee: string;
}): Promise<string> {
  const gasPrice = await estimateGasPrice(web3);

  const mintAccountFn: PayableTransactionObject<void> = (
    new web3.eth.Contract(
      ABI as AbiItem[],
      CONFIG.ACCOUNT_MINTER_CONTRACT as string,
    ) as unknown as IAccountMinter
  ).methods.mintAccount(signature, deadline, fee, account);

  return new Promise((resolve, reject) => {
    mintAccountFn
      .send({ from: account, value: fee, gasPrice })
      .on("error", function (error: any) {
        // eslint-disable-next-line no-console
        console.log({ error });
        const parsed = parseMetamaskError(error);

        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
        // eslint-disable-next-line no-console
        console.log({ transactionHash });
        // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?sjid=11955999175679069053-AP&client_type=gtag#purchase
        onboardingAnalytics.logEvent("purchase", {
          currency: "MATIC",
          // Unique ID to prevent duplicate events
          transaction_id: `create-${account}`,
          value: Number(fromWei(fee)),
          items: [
            {
              item_id: "NFT_ACCOUNT",
              item_name: "NFT Account",
            },
          ],
        });

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
