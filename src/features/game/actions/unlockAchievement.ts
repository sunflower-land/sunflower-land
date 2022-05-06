import { CONFIG } from "lib/config";
import { sanitizeHTTPResponse } from "lib/network";
import { makeGame } from "../lib/transforms";
import { autosaveRequest } from "./autosave";
import { AchievementName } from "features/game/types/achievements";

type Request = {
  farmId: number;
  sessionId: string;
  token: string;
  fingerprint: string;
  achievement: AchievementName;
};

const API_URL = CONFIG.API_URL;

export async function unlockAchievement(request: Request) {
  if (!API_URL) return { farm: null };

  // Uses same autosave event driven endpoint
  const response = await autosaveRequest({
    ...request,
    actions: [
      {
        type: "achievement.unlocked",
        achievement: request.achievement,
      },
    ],
  });

  const data = await sanitizeHTTPResponse<{
    farm: any;
  }>(response);

  const farm = makeGame(data.farm);

  return { farm };
}
