import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { BumpkinParts, tokenUriBuilder } from "lib/utils/tokenUriBuilder";

const API_URL = CONFIG.API_URL ?? "https://api-dev.sunflower-land.com";

export type NPCActionType = "idle" | "walking";
const SHEET_TYPES: NPCActionType[] = ["idle", "walking"];

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

export async function buildNPCSheets(request: Request): Promise<Response> {
  const tokenUri = tokenUriBuilder(request.parts);
  const response: Response = { sheets: {} as Sheets };

  await Promise.all(
    SHEET_TYPES.map(async (sheetType) => {
      const url = `${URL}/${sheetType}/${tokenUri}.webp`;
      const img = new Image();
      img.src = url;

      await new Promise((resolve) => {
        // Check if image already loaded
        if (img.complete) {
          response.sheets[sheetType] = url;
          resolve(url);
        } else {
          img.onload = () => {
            response.sheets[sheetType] = url;
            resolve(url);
          };

          // Image 404 - build them
          img.onerror = async () => {
            // Since these are not real NFTs, prepend fake ID and version
            const validName = `0_v1_${tokenUri}`;
            const sheets = await buildNPCSheetsRequest(validName);
            response.sheets = sheets;
            resolve(sheets[sheetType]);
          };
        }
      });
    })
  );

  return response;
}
