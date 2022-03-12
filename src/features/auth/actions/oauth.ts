import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { login, saveSession } from "./login";

type Request = {
  token: string;
  code: string;
};

const API_URL = CONFIG.API_URL;

export async function oauthoriseRequest(request: Request) {
  const response = await window.fetch(`${API_URL}/oauth`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
    },
    body: JSON.stringify({
      code: request.code,
    }),
  });

  if (response.status >= 400) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  const { token } = await response.json();

  return { token };
}

export async function oauthorise(code: string): Promise<{ token: string }> {
  const address = metamask.myAccount as string;

  const { token: oldToken } = await login();

  const { token } = await oauthoriseRequest({
    token: oldToken,
    code,
  });

  saveSession(address, { token });

  return { token };
}

export function redirectOAuth() {
  const applicationID = "946044940008435803";
  const redirect = encodeURIComponent(CONFIG.DISCORD_REDIRECT as string);

  // Guild = server
  const scope = "guilds.members.read";
  window.location.href = `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${applicationID}&scope=${scope}&redirect_uri=${redirect}&prompt=consent`;
}
