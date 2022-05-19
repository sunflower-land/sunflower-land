import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { CharityAddress } from "../components/CreateFarm";

type Request = {
  charity: string;
  token: string;
  captcha: string;
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
      captcha: request.captcha,
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  const { signature, charity, deadline } = await response.json();

  return { signature, charity, deadline };
}

type CreateFarmOptions = {
  charity: CharityAddress;
  token: string;
  captcha: string;
};

export async function createFarm({
  charity,
  token,
  captcha,
}: CreateFarmOptions) {
  const transaction = await signTransaction({
    charity,
    token,
    captcha,
  });

  await metamask.getBeta().createFarm(transaction);

  const farm = await metamask.getFarm().getNewFarm();

  return farm;
}
