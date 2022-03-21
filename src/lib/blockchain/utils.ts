import Web3 from "web3";

const MINIMUM_GAS_PRICE = 40;

export async function estimateGasPrice(web3: Web3, incr = 1) {
  const e = await web3.eth.getGasPrice();
  let gasPrice = e ? Number(e) * incr : undefined;
  const minimum = MINIMUM_GAS_PRICE * 1000000000;
  if (!gasPrice || gasPrice < minimum) {
    gasPrice = minimum;
  }
  console.log({ gasPrice });
  return gasPrice;
}
