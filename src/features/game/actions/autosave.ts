import { CONFIG } from "lib/config";
import { SellAction } from "../events/sell";
import { PastAction } from "../lib/gameMachine";
import { CraftAction } from "../types/craftables";

type Request = {
  actions: PastAction[];
  farmId: number;
  sender: string;
  sessionId: string;
  signature: string;
  offset: number;
};

const API_URL = CONFIG.API_URL;

function squashEvents(events: PastAction[]): PastAction[] {
  return events.reduce((items, event, index) => {
    if (index > 0) {
      const previous = items[items.length - 1];

      const isShopEvent =
        (event.type === "item.crafted" && previous.type === "item.crafted") ||
        (event.type === "item.sell" && previous.type === "item.sell");

      // We can combine the amounts when buying/selling the same item
      if (isShopEvent && event.item === previous.item) {
        return [
          ...items.slice(0, -1),
          {
            ...event,
            amount:
              (previous as SellAction | CraftAction).amount + event.amount,
          } as PastAction,
        ];
      }
    }

    return [...items, event];
  }, [] as PastAction[]);
}

function serialize(events: PastAction[], offset: number) {
  return events.map((action) => ({
    ...action,
    createdAt: new Date(action.createdAt.getTime() + offset).toISOString(),
  }));
}

export async function autosave(request: Request) {
  if (!API_URL) return;

  // Shorten the payload
  const events = squashEvents(request.actions);

  // Serialize values before sending
  const actions = serialize(events, request.offset);

  const response = await window.fetch(`${API_URL}/autosave`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      farmId: request.farmId,
      sender: request.sender,
      sessionId: request.sessionId,
      signature: request.signature,
      actions,
    }),
  });

  if (response.status !== 200 || !response.ok) {
    throw new Error("Could not save game");
  }

  const data = await response.json();

  return data;
}
