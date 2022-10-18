import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { BumpkinParts } from "../types/bumpkin";

const API_URL = CONFIG.API_URL;

export type InitialBumpkinParts = Pick<BumpkinParts, "hair" | "body" | "shirt">;
type Options = {
  bumpkinParts: InitialBumpkinParts;
  token: string;
  farmId: number;
};

type Response = {
  payload: {
    deadline: number;
    farmId: number;
    fee: string;
    itemIds: number[];
    sender: string;
    tokenUri: string;
  };
  signature: string;
};

export async function mintBumpkin({ bumpkinParts, token, farmId }: Options) {
  const response = await window.fetch(`${API_URL}/mint-bumpkin/${farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      bumpkinParts,
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  const transaction: Response = await response.json();

  await metamask.getBumpkinMinter().createBumpkin({
    signature: transaction.signature,
    deadline: transaction.payload.deadline,
    farmId: transaction.payload.farmId,
    fee: transaction.payload.fee,
    partIds: transaction.payload.itemIds,
    tokenUri: transaction.payload.tokenUri,
  });

  await waitForBumpkin();
}

async function waitForBumpkin() {
  const bumpkins = await metamask.getBumpkinDetails().loadBumpkins();

  console.log({ waiting: bumpkins });
  if (bumpkins.length === 0) {
    await waitForBumpkin();
  }

  // Possible pending block bug
  if (bumpkins[0].owner !== metamask.myAccount) {
    await waitForBumpkin();
  }
}
