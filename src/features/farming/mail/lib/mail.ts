import { wallet } from "lib/blockchain/wallet";

import Decimal from "decimal.js-light";
import { fromWei, toBN } from "web3-utils";
import { Message } from "../types/message";
import { CONFIG } from "lib/config";

const MESSAGES_KEY = "readMessages";

// starts at 5mm, every 10mm tokens half again after milestone_2
enum Halvening {
  MILESTONE_1 = "5e+6",
  MILESTONE_2 = "10e+6",
}

const API_URL = CONFIG.API_URL;

async function getSFLSupply() {
  const [total, burned] = API_URL
    ? await Promise.all([
        wallet.getToken().totalSupply(),
        wallet
          .getToken()
          .balanceOf("0x000000000000000000000000000000000000dead"),
      ])
    : [toBN(0), toBN(0)];

  const totalSupply = new Decimal(fromWei(total));

  // total and circulating
  return [totalSupply, totalSupply.minus(new Decimal(fromWei(burned)))];
}

function formatAmount(num: Decimal) {
  return num.toDecimalPlaces(3, Decimal.ROUND_DOWN).toNumber().toLocaleString();
}

/**
 * Only saves read messages from the array.
 */
export function cleanupCache(oldInbox: Message[]) {
  const newReadMessages = oldInbox
    .filter((msg) => !msg.unread)
    .map((msg) => msg.id);

  if (newReadMessages.length) {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(newReadMessages));
  } else {
    localStorage.removeItem(MESSAGES_KEY);
  }
}

function getNextHalvening(currentSupply: Decimal) {
  if (currentSupply.lessThan(new Decimal(Halvening.MILESTONE_1))) {
    return new Decimal(Halvening.MILESTONE_1);
  }
  if (currentSupply.lessThan(new Decimal(Halvening.MILESTONE_2))) {
    return new Decimal(Halvening.MILESTONE_2);
  }

  // (12e+6/10e+6) + 1 * 10 = 20 -> next halving of 12e+6
  const integerVal = currentSupply.idiv(Halvening.MILESTONE_2).add(1).times(10);
  return new Decimal(`${integerVal}e+6`);
}

export async function getInbox() {
  const [totalSfl, circSfl] = await getSFLSupply();
  const nextHalvening = getNextHalvening(totalSfl);

  return [
    // double space for line break
    {
      id: "halvening",
      title: "Halvening",
      body: API_URL
        ? `Total SFL: ${formatAmount(totalSfl)}  
        &nbsp;  
        Next halvening is at ${nextHalvening.toNumber().toLocaleString()}  
        &nbsp;   
        Notes: This value is read from the Blockchain. Other farmers may not have synced yet. 
      `
        : "You're running Sunflower Land locally!",
    },
    {
      id: "sfl-supply",
      title: "SFL Supply",
      body: API_URL
        ? `Circulating SFL: ${formatAmount(circSfl)}  
        &nbsp;     
        Notes: The amount of SFL in farms, wallets, and pools. This excludes burned SFL. 
      `
        : "You're running Sunflower Land locally!",
    },
  ];
}

export function getReadMessages() {
  return JSON.parse(localStorage.getItem(MESSAGES_KEY) || "[]");
}

export function updateCache(id: string) {
  const newReadMessages = [...getReadMessages(), id];

  localStorage.setItem(MESSAGES_KEY, JSON.stringify(newReadMessages));
}
