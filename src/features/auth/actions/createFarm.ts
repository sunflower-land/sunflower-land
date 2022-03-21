import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { CharityAddress } from "../components/Donation";

type Request = {
  charity: string;
  donation: number;
  token: string;
};

const API_URL = CONFIG.API_URL;

export async function signTransaction(request: Request) {
  const response = await window.fetch(`${API_URL}/farm`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
    },
    body: JSON.stringify({
      charity: request.charity,
      donation: request.donation,
    }),
  });

  if (response.status >= 400) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  const { signature, charity, donation } = await response.json();

  return { signature, charity, donation };
}

type CreateFarmOptions = {
  charity: CharityAddress;
  donation: number;
  token: string;
};

export async function createFarm({
  donation,
  charity,
  token,
}: CreateFarmOptions) {
  const transaction = await signTransaction({
    donation,
    charity,
    token,
  });

  const address = metamask.myAccount as string;
  const farm = metamask.getFarm().onCreated(address);

  await metamask.getBeta().createFarm(transaction);

  const newFarm = await farm;

  return newFarm;
}
