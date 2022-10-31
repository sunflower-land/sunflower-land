import Decimal from "decimal.js-light";
import { communityContracts } from "features/community/lib/communityContracts";
import { fromWei } from "web3-utils";

export type Token = {
  balance: Decimal;
};

export async function loadTokens() {
  try {
    const balance = await communityContracts.getWhitelistToken().balanceOf();

    const res: Token = { balance: new Decimal(fromWei(balance)) };

    return res;
  } catch {
    return { balance: new Decimal(0) };
  }
}
