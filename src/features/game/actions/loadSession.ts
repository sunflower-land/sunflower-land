import Decimal from "decimal.js-light";
import { GameState, InventoryItemName } from "../types/game";

type Request = {
  sessionId: string;
  farmId: number;
  sender: string;
  signature: string;
  hasV1Tokens: boolean;
  hasV1Farm: boolean;
};

type Response = {
  balance: string;
  inventory: Record<InventoryItemName, string>;
  fields: GameState["fields"];
};
const API_URL = import.meta.env.VITE_API_URL;

export async function loadSession(request: Request): Promise<GameState> {
  const response = await window.fetch(`${API_URL}/session`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      ...request,
    }),
  });

  const { farm } = await response.json();

  return {
    inventory: Object.keys(farm.inventory).reduce(
      (items, item) => ({
        ...items,
        [item]: new Decimal(farm.inventory[item]),
      }),
      {} as Record<InventoryItemName, Decimal>
    ),
    balance: new Decimal(farm.balance),
    fields: farm.fields,
    id: farm.id,
  };
}
