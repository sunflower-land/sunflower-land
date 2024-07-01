import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import ABI from "./abis/Auction.json";
import { estimateGasPrice, parseMetamaskError } from "./utils";
import { getNextSessionId, getSessionId } from "./Session";
import { SunflowerLandAuction } from "./types/SunflowerLandAuction";

const address = CONFIG.AUCTION_CONTRACT;

export async function mintAuctionCollectible({
  web3,
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  mintId,
  supply,
  fee,
}: {
  web3: Web3;
  account: string;
  signature: string;
  sessionId: string;
  nextSessionId: string;
  deadline: number;
  // Data
  farmId: number;
  mintId: number;
  supply: number;
  fee: number;
}): Promise<string> {
  const oldSessionId = await getSessionId(web3, farmId);
  const gasPrice = await estimateGasPrice(web3);

  // eslint-disable-next-line no-console
  console.log({
    signature,
    sessionId,
    nextSessionId,
    deadline,
    farmId,
    fee,
    mintId,
    supply,
  });
  await new Promise((resolve, reject) => {
    (
      new web3.eth.Contract(
        ABI as AbiItem[],
        address as string,
      ) as unknown as SunflowerLandAuction
    ).methods
      .mintCollectible(
        signature,
        sessionId,
        nextSessionId,
        deadline,
        farmId,
        fee,
        mintId,
        supply,
      )
      .send({ from: account, gasPrice, value: fee })
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

export async function mintAuctionWearable({
  web3,
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  mintId,
  supply,
  fee,
}: {
  web3: Web3;
  account: string;
  signature: string;
  sessionId: string;
  nextSessionId: string;
  deadline: number;
  // Data
  farmId: number;
  mintId: number;
  supply: number;
  fee: number;
}): Promise<string> {
  const oldSessionId = await getSessionId(web3, farmId);
  const gasPrice = await estimateGasPrice(web3);

  // eslint-disable-next-line no-console
  console.log({
    signature,
    sessionId,
    nextSessionId,
    deadline,
    farmId,
    fee,
    mintId,
    supply,
  });
  await new Promise((resolve, reject) => {
    (
      new web3.eth.Contract(
        ABI as AbiItem[],
        address as string,
      ) as unknown as SunflowerLandAuction
    ).methods
      .mintWearable(
        signature,
        sessionId,
        nextSessionId,
        deadline,
        farmId,
        fee,
        mintId,
        supply,
      )
      .send({ from: account, gasPrice, value: fee })
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
