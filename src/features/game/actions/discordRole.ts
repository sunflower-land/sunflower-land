import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

const API_URL = CONFIG.API_URL;

export type DiscordRole =
  | "diamond-farmers"
  | "bud-clubhouse"
  | "goblins"
  | "sunflorians"
  | "nightshades"
  | "bumpkins";

type Options = {
  farmId: number;
  token: string;
  role: DiscordRole;
};

export async function addDiscordRole({ farmId, token, role }: Options) {
  const response = await window.fetch(`${API_URL}/discordRole/${farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      role,
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.DISCORD_ROLE_SERVER_ERROR);
  }

  await response.json();

  return { success: true };
}
