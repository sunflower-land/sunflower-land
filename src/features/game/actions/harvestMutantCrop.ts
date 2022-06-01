import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { LimitedItemName } from "../types/craftables";
import { CropName } from "../types/crops";

async function loadMutantCropMetadata(id: number) {
  // Go and fetch the metadata file for this farm
  const url = `${API_URL}/nfts/mutant-crops/${id}`;
  const response = await window.fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });

  const data = await response.json();

  return data;
}

type Request = {
  farmId: number;
  token: string;
  fieldIndex: number;
  crop: CropName;
};

const API_URL = CONFIG.API_URL;

async function harvestMutantCropRequest(request: Request) {
  console.log({ request });
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

  console.log({ response });
  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  // Rotten crop or unlucky
  if (response.status !== 200 || !response.ok) {
    return null;
  }

  const transaction = await response.json();

  return transaction;
}

// Smart contract crop IDs
const CROP_IDS: Record<CropName, number> = {
  Sunflower: 0,
  Potato: 1,
  Pumpkin: 2,
  Carrot: 3,
  Cabbage: 4,
  Beetroot: 5,
  Cauliflower: 6,
  Parsnip: 7,
  Radish: 8,
  Wheat: 9,
};

/**
 * Try to harvest a mutant crop
 * This is a mixture of on-chain + off-chain verification that will determine if it can be minted
 * Not everyone getting this far will be succesful
 */
export async function harvestMutantCrop(request: Request) {
  try {
    const totalSupply = await metamask.getMutantCrops().totalSupply();
    console.log({ totalSupply });
    const cropId = CROP_IDS[request.crop];
    const canCraft = Number(totalSupply) % 10 === cropId;
    console.log({ canCraft });

    if (!canCraft) {
      return null;
    }

    const transaction = await harvestMutantCropRequest(request);
    console.log({ transaction });
    if (!transaction) {
      return null;
    }

    await metamask.getMutantCrops().mint(transaction);

    const id = totalSupply + 1;
    const metadata = await loadMutantCropMetadata(id);
    return { id, image: metadata.image };
  } catch {
    return null;
  }
}
