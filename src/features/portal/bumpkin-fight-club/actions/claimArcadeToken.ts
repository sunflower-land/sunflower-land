import { makeGame } from "features/game/lib/transforms";
import { GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Request = {
  token: string;
};

export async function claimArcadeToken(request: Request) {
  // Uses same autosave event driven endpoint
  const response = await window.fetch(
    `${CONFIG.API_URL}/portal/${CONFIG.PORTAL_APP}/mint`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
      },
      body: JSON.stringify({
        items: {
          "Arcade Token": 1,
        },
      }),
    }
  );

  if (response.status >= 400) {
    throw new Error(ERRORS.PORTAL_LOGIN_ERROR);
  }

  const data: { game: GameState } = await response.json();

  const game = makeGame(data.game);

  return { game };
}
