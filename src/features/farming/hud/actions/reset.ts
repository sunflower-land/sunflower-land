import { InventoryItemName, Wardrobe } from "features/game/types/game";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Request = {
  farmId: number;
  token: string;
  fingerprint: string;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

export async function reset(request: Request) {
  // Uses same autosave event driven endpoint
  const response = await window.fetch(`${API_URL}/reset/${request.farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
      "X-Fingerprint": request.fingerprint,
      "X-Transaction-ID": request.transactionId,
    },
  });

  if (response.status >= 400) {
    throw new Error(ERRORS.RESET_SERVER_ERROR);
  }

  const data: {
    success: boolean;
    changeset: {
      balance: number;
      inventory: Record<InventoryItemName, number>;
      wardrobe: Wardrobe;
    };
  } = await response.json();

  return data;
}
