import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { getToken } from "./social";

type Request = {
  token: string;
  code: string;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

export async function oauthoriseRequest(request: Request) {
  const response = await window.fetch(`${API_URL}/oauth`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
      "X-Transaction-ID": request.transactionId,
    },
    body: JSON.stringify({
      code: request.code,
    }),
  });

  const { token, errorCode } = await response.json();

  if (response.status >= 400) {
    throw new Error(errorCode ?? ERRORS.OAUTH_SERVER_ERROR);
  }

  return { token };
}

export async function oauthorise(
  code: string,
  transactionId: string,
): Promise<{ token: string }> {
  const oldToken = await getToken();

  const { token } = await oauthoriseRequest({
    token: oldToken as string,
    code,
    transactionId,
  });

  // Remove query parameters from url
  window.history.pushState({}, "", window.location.pathname);

  return { token };
}

export function redirectOAuth() {
  const applicationID = "946044940008435803";
  const redirect = encodeURIComponent(CONFIG.DISCORD_REDIRECT as string);

  // Guild = server
  const scope = "guilds.members.read";
  window.location.href = `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${applicationID}&scope=${scope}&redirect_uri=${redirect}&prompt=consent`;
}
