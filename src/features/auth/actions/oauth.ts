import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { makeGame } from "features/game/lib/transforms";
import { GameState } from "features/game/types/game";

type Request = {
  type: string;
  token: string;
  code: string;
  transactionId: string;
  farmId: number;
};

const API_URL = CONFIG.API_URL;

export async function oauthoriseRequest(request: Request) {
  const response = await window.fetch(`${API_URL}/oauth/${request.farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
      "X-Transaction-ID": request.transactionId,
    },
    body: JSON.stringify({
      code: request.code,
      type: request.type,
    }),
  });

  const { game, discordId, fslId, errorCode } = await response.json();

  if (response.status >= 400) {
    throw new Error(errorCode ?? ERRORS.OAUTH_SERVER_ERROR);
  }

  return { game: makeGame(game), discordId, fslId };
}

export async function oauthorise({
  code,
  type,
  transactionId,
  jwt,
  farmId,
}: {
  code: string;
  type: string;
  transactionId: string;
  jwt: string;
  farmId: number;
}): Promise<{ game: GameState; fslId?: string; discordId?: string }> {
  const { game, fslId, discordId } = await oauthoriseRequest({
    token: jwt as string,
    type,
    code,
    transactionId,
    farmId,
  });

  return { game, fslId, discordId };
}

export function redirectOAuth({ nonce }: { nonce: string }) {
  // const applicationID = "946044940008435803";
  const applicationID = "1287592468124012634";

  // const redirect = encodeURIComponent("http://localhost:3000/#/oauth/discord");
  const redirect = encodeURIComponent(
    "https://api-hannigan.sunflower-land.com/oauth/discord",
  );

  const state = nonce;

  // Guild = server
  const scope = "guilds.members.read";
  window.location.href = `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${applicationID}&scope=${scope}&redirect_uri=${redirect}&prompt=consent&state=${state}`;
}
