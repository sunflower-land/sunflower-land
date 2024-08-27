import { CONFIG } from "lib/config";
import { AbiItem } from "web3-utils";
import WithdrawalABI from "./abis/Withdrawals";
import { estimateGasPrice, parseMetamaskError } from "./utils";
import { getNextSessionId, getSessionId } from "./Session";
import { writeContract } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";

const address = CONFIG.WITHDRAWAL_CONTRACT;

export async function withdrawSFLTransaction({
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  tax,
  sfl,
}: {
  account: `0x${string}`;
  signature: `0x${string}`;
  sessionId: `0x${string}`;
  nextSessionId: `0x${string}`;
  deadline: number;
  // Data
  farmId: number;
  sfl: number;
  tax: number;
}): Promise<string> {
  const oldSessionId = sessionId;

  await writeContract(config, {
    abi: WithdrawalABI,
    address: address as `0x${string}`,
    functionName: "withdrawSFL",
    args: [
      signature,
      sessionId,
      nextSessionId,
      BigInt(deadline),
      BigInt(farmId),
      BigInt(sfl),
      BigInt(tax),
    ],
    account,
  });

  return await getNextSessionId(account, farmId, oldSessionId);
}

export async function withdrawItemsTransaction({
  web3,
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  ids,
  amounts,
}: {
  web3: Web3;
  account: string;
  signature: string;
  sessionId: string;
  nextSessionId: string;
  deadline: number;
  // Data
  farmId: number;
  ids: number[];
  amounts: number[];
}): Promise<string> {
  const oldSessionId = sessionId;
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    (
      new web3.eth.Contract(
        WithdrawalABI as AbiItem[],
        address as string,
      ) as unknown as Withdrawals
    ).methods
      .withdrawItems(
        signature,
        sessionId,
        nextSessionId,
        deadline,
        farmId,
        ids,
        amounts,
      )
      .send({ from: account, gasPrice })
      .on("error", function (error: any) {
        const parsed = parseMetamaskError(error);
        // eslint-disable-next-line no-console
        console.log({ parsedIt: parsed });
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
        // eslint-disable-next-line no-console
        console.log({ receipt });
        resolve(receipt);
      });
  });

  const newSessionId = await getNextSessionId(
    web3,
    account,
    farmId,
    oldSessionId,
  );
  return newSessionId;
}

export async function withdrawWearablesTransaction({
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  ids,
  amounts,
}: {
  account: `0x${string}`;
  signature: `0x${string}`;
  sessionId: `0x${string}`;
  nextSessionId: `0x${string}`;
  deadline: number;
  // Data
  farmId: number;
  ids: number[];
  amounts: number[];
}): Promise<string> {
  const oldSessionId = await getSessionId(farmId);

  await writeContract(config, {
    abi: WithdrawalABI,
    address: address as `0x${string}`,
    functionName: "withdrawWearables",
    args: [
      signature,
      sessionId,
      nextSessionId,
      BigInt(deadline),
      BigInt(farmId),
      ids.map(BigInt),
      amounts.map(BigInt),
    ],
    account,
  });

  return await getNextSessionId(account, farmId, oldSessionId);
}

export async function withdrawBudsTransaction({
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  budIds,
}: {
  account: `0x${string}`;
  signature: `0x${string}`;
  sessionId: `0x${string}`;
  nextSessionId: `0x${string}`;
  deadline: number;
  // Data
  farmId: number;
  budIds: number[];
}): Promise<string> {
  const oldSessionId = await getSessionId(farmId);

  await writeContract(config, {
    abi: WithdrawalABI,
    address: address as `0x${string}`,
    functionName: "withdrawBuds",
    args: [
      signature,
      sessionId,
      nextSessionId,
      BigInt(deadline),
      BigInt(farmId),
      budIds.map(BigInt),
    ],
    account,
  });

  return await getNextSessionId(account, farmId, oldSessionId);
}
