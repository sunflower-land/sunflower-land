import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem, toWei, fromWei } from "web3-utils";
import TokenJSON from "./abis/Token.json";
import { SunflowerLandToken, Transfer } from "./types/SunflowerLandToken";
import { estimateGasPrice, parseMetamaskError } from "./utils";
import Decimal from "decimal.js-light";

/**
 * Keep full wei amount as used for approving/sending
 */
export async function sflBalanceOf(
  web3: Web3,
  address: string,
  attempts = 0,
): Promise<string> {
  try {
    const balance = await (
      new web3.eth.Contract(
        TokenJSON as AbiItem[],
        CONFIG.TOKEN_CONTRACT as string,
      ) as unknown as SunflowerLandToken
    ).methods
      .balanceOf(address)
      .call();

    return balance;
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return await sflBalanceOf(web3, address, attempts + 1);
    }

    throw error;
  }
}

/**
 * Onchain SFL balance
 */
export async function totalSFLSupply(web3: Web3, account: string) {
  const supply = await (
    new web3.eth.Contract(
      TokenJSON as AbiItem[],
      CONFIG.TOKEN_CONTRACT as string,
    ) as unknown as SunflowerLandToken
  ).methods
    .totalSupply()
    .call({ from: account });

  return supply;
}

export async function getPastDeposits(
  web3: Web3,
  account: string,
  farmAddress: string,
  fromBlock: number,
) {
  const events: Transfer[] = await new Promise((res, rej) => {
    (
      new web3.eth.Contract(
        TokenJSON as AbiItem[],
        CONFIG.TOKEN_CONTRACT as string,
      ) as unknown as SunflowerLandToken
    ).getPastEvents(
      "Transfer",
      {
        filter: {
          to: farmAddress,
        },
        fromBlock,
        toBlock: "latest",
      },
      function (error, events) {
        if (error) {
          rej(error);
        }

        res(events as unknown as Transfer[]);
      },
    );
  });

  // Exclude game mints/burns
  const externalEvents = events.filter(
    (event) =>
      event.returnValues.from !==
        "0x0000000000000000000000000000000000000000" &&
      Number(event.returnValues.value) > 0,
  );

  return externalEvents;
}

export async function approveSFL(
  web3: Web3,
  account: string,
  address: string,
  value: number,
) {
  const gasPrice = await estimateGasPrice(web3);
  const getWei = toWei(value.toString());
  const approve = await (
    new web3.eth.Contract(
      TokenJSON as AbiItem[],
      CONFIG.TOKEN_CONTRACT as string,
    ) as unknown as SunflowerLandToken
  ).methods
    .approve(address, getWei)
    .send({ from: account, gasPrice });

  return approve;
}

export async function isTokenApprovedForContract(
  web3: Web3,
  account: string,
  address: string,
  attempts = 0,
): Promise<boolean> {
  await new Promise((res) => setTimeout(res, 3000 * attempts));
  try {
    const allowance = await (
      new web3.eth.Contract(
        TokenJSON as AbiItem[],
        CONFIG.TOKEN_CONTRACT as string,
      ) as unknown as SunflowerLandToken
    ).methods
      .allowance(account, address)
      .call({ from: account });
    const allowanceNumber = new Decimal(fromWei(allowance));
    const isApproved = allowanceNumber.gte(100);

    return isApproved;
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return isTokenApprovedForContract(web3, account, address, attempts + 1);
    }

    throw error;
  }
}
