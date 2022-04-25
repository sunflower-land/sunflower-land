import { Craftable } from "../types/craftables";
import Decimal from "decimal.js-light";

/**
 * Subtract higher tier item supplies from the selected's amount left
 * @param itemSupply onchain supply of all items
 * @param selected selected item
 */
export const getAmountLeft = (
  itemSupply: Record<any, Decimal>,
  selected: Craftable
) => {
  const { name, supply, upgrades } = selected;

  if (!supply) return Infinity; // avoid sold out logic

  const amountLeft = supply - itemSupply[name]?.toNumber();
  const upgradeSupply =
    upgrades
      ?.map((upgrade) => itemSupply[upgrade]?.toNumber())
      .reduce((sum, amount) => sum + amount) || 0;

  return amountLeft - upgradeSupply;
};
