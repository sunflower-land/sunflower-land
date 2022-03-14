import { ERRORS } from "lib/errors";
import Web3 from "web3";

const MINIMUM_GAS_PRICE = 40;

export async function estimateGasPrice(web3: Web3, incr = 1) {
  const minimum = MINIMUM_GAS_PRICE * 1000000000;
  try {
    const e = await web3.eth.getGasPrice();
    let gasPrice = e ? Number(e) * incr : undefined;
    if (!gasPrice || gasPrice < minimum) {
      gasPrice = minimum;
    }
    console.log({ gasPrice });
    return gasPrice;
  } catch {
    return minimum;
  }
}

export function parseMetamaskError(error: any): Error {
  console.log({ parse: error });
  if (error.code === 4001) {
    return new Error(ERRORS.REJECTED_TRANSACTION);
  }

  if (error.code === -32603) {
    console.log("Congested!");
    return new Error(ERRORS.NETWORK_CONGESTED);
  }

  return error;
}
