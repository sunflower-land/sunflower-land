import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import FarmABI from "./abis/Farm.json";
import { estimateGasPrice, parseMetamaskError } from "./utils";

const address = CONFIG.FARM_CONTRACT;

type FarmAccount = {
  account: string;
  owner: string;
  tokenId: string;
};

// TODO - simplify the smart contract to fetch this in 1 call
export async function getFarms(
  web3: Web3,
  account: string,
  attempts = 0,
): Promise<FarmAccount[]> {
  await new Promise((res) => setTimeout(res, 3000 * attempts));

  try {
    const accounts = await new web3.eth.Contract(
      FarmABI as AbiItem[],
      address as string,
    ).methods
      .getFarms(account)
      .call({ from: account });

    return accounts;
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return getFarms(web3, account, attempts + 1);
    }

    throw error;
  }
}

export async function ownerOf(
  web3: Web3,
  account: string,
  tokenId: string,
): Promise<string> {
  const owner = await new web3.eth.Contract(
    FarmABI as AbiItem[],
    address as string,
  ).methods
    .ownerOf(tokenId)
    .call();

  return owner;
}

export async function getFarm(
  web3: Web3,
  tokenId: number,
): Promise<FarmAccount> {
  const farm = await new web3.eth.Contract(
    FarmABI as AbiItem[],
    address as string,
  ).methods
    .getFarm(tokenId)
    .call();

  return farm;
}

export async function getNewFarm(
  web3: Web3,
  account: string,
): Promise<FarmAccount> {
  await new Promise((res) => setTimeout(res, 3000));

  const farms = await getFarms(web3, account);

  // Try again
  if (farms.length === 0) {
    return getNewFarm(web3, account);
  }

  // Double check they are the owner
  const owner = await ownerOf(web3, account, farms[0].tokenId);
  if (owner !== account) {
    return getNewFarm(web3, account);
  }

  return farms[0];
}

export async function getTotalSupply(
  web3: Web3,
  account: string,
  attempts = 0,
): Promise<number> {
  await new Promise((res) => setTimeout(res, 3000 * attempts));

  try {
    const accounts = await new web3.eth.Contract(
      FarmABI as AbiItem[],
      address as string,
    ).methods
      .totalSupply()
      .call({ from: account });

    return accounts;
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return getTotalSupply(web3, account, attempts + 1);
    }

    throw error;
  }
}

export async function transfer({
  web3,
  account,
  to,
  tokenId,
}: {
  web3: Web3;
  account: string;
  to: string;
  tokenId: number;
}): Promise<string> {
  const gasPrice = await estimateGasPrice(web3);

  return new Promise((resolve, reject) => {
    new web3.eth.Contract(FarmABI as AbiItem[], address as string).methods
      .transferFrom(account, to, tokenId)
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
        // eslint-disable-next-line no-console
        console.log({ receipt });
        resolve(receipt);
      });
  });
}
