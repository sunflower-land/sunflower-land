import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { LimitedItemName } from "../types/craftables";
import { CropName } from "../types/crops";

type Request = {
  farmId: number;
  token: string;
  fieldIndex: number;
  crop: CropName;
};

const API_URL = CONFIG.API_URL;

async function harvestMutantCropRequest(request: Request) {
  const response = await window.fetch(
    `${API_URL}/mutant-crop/${request.farmId}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
      },
      body: JSON.stringify({
        fieldIndex: request.fieldIndex,
      }),
    }
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    return null;
  }

  const transaction = await response.json();

  return transaction;
}

/**
 * Try to harvest a mutant crop
 * This is a mixture of on-chain + off-chain verification that will determine if it can be minted
 * Not everyone getting this far will be succesful
 */
export async function harvestMutantCrop(request: Request) {
  const canCraft = await metamask
    .getMutantCrops()
    .isNextAvailableCrop(request.crop);

  if (!canCraft) {
    return false;
  }

  const transaction = await harvestMutantCropRequest(request);

  if (!transaction) {
    return false;
  }

  await metamask.getMutantCrops().mint(transaction);

  return true;
}
