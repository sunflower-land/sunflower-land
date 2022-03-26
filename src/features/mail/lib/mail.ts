import { metamask } from "lib/blockchain/metamask";

import Decimal from "decimal.js-light";
import { fromWei } from "web3-utils";
import { Message } from "../types/message";

const MESSAGES_KEY = "readMessages";

async function getSFLSupply() {
  const supply = await metamask.getToken().totalSupply();

  return new Decimal(fromWei(supply));
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

/**
 * MVP1:
 * - always change id to reflect unread
 * TODO:
 * - offchain SFL supply api
 */
export async function getInbox() {
  const sflBalance = await getSFLSupply();

  return [
    // double space for line break
    {
      id: "sfl-supply",
      title: "SFL Supply",
      body: `Total SFL: ${sflBalance.toDecimalPlaces(3, Decimal.ROUND_DOWN)}  
        &nbsp;  
        Note: this value is read from the Blockchain. Farmers may not have synced yet.
      `,
    },
    {
      id: "2022-03-25",
      title: "Welcome to Beta!",
      body: `Welcome to open beta! The game is still in its early stages and we are so grateful that you are here.`,
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
