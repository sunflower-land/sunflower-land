import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { BumpkinParts, tokenUriBuilder } from "lib/utils/tokenUriBuilder";

const API_URL = CONFIG.API_URL ?? "https://api-dev.sunflower-land.com";

export type NPCActionType = "idle" | "walking";

type Request = {
  parts: BumpkinParts;
};

type Sheets = Record<NPCActionType, string>;

type Response = {
  sheets: Sheets;
};

export async function buildNPCSheetsRequest(fileName: string) {
  const response = await window.fetch(`${API_URL}/bumpkins/npc/${fileName}`, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      accept: "application/json",
    },
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.BUMPKINS_METADATA_ERROR);
  }

  const data: Response = await response.json();

  return data.sheets;
}

const URL =
  CONFIG.NETWORK === "mainnet"
    ? "https://images.bumpkins.io/npcSheets"
    : "https://testnet-images.bumpkins.io/npcSheets";

const getImage = async (url: string) => {
  let image: string;

  try {
    image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      img.onload = () => resolve(url);
      img.onerror = (e) => reject(e);
    });
  } catch {
    image = await new Promise((resolve, reject) => {
      const skipCacheUrl = `${url}?version=${Date.now()}`;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = skipCacheUrl;
      img.onload = () => resolve(skipCacheUrl);
      img.onerror = (e) => reject(e);
    });
  }

  return image;
};

export async function buildNPCSheets(request: Request): Promise<Response> {
  const tokenUri = tokenUriBuilder(request.parts);

  const idleUrl = `${URL}/idle/${tokenUri}.webp`;
  const walkingUrl = `${URL}/walking/${tokenUri}.webp`;

  try {
    const [idle, walking] = await Promise.all([
      getImage(idleUrl),
      getImage(walkingUrl),
    ]);

    return {
      sheets: {
        idle,
        walking,
      },
    };
  } catch {
    // Since these are not real NFTs, prepend fake ID and version
    const validName = `0_v1_${tokenUri}`;
    const sheets = await buildNPCSheetsRequest(validName);
    return {
      sheets,
    };
  }
}
