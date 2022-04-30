import { CONFIG } from "lib/config";
import { sanitizeHTTPResponse } from "lib/network";
import { makeGame } from "../lib/transforms";
import { SkillName } from "../types/skills";
import { autosaveRequest } from "./autosave";

type Request = {
  farmId: number;
  sessionId: string;
  token: string;
  fingerprint: string;
  skill: SkillName;
};

const API_URL = CONFIG.API_URL;

export async function levelUp(request: Request) {
  if (!API_URL) return { farm: null };

  // Uses same autosave event driven endpoint
  const response = await autosaveRequest({
    ...request,
    actions: [
      {
        type: "skill.learned",
        skill: request.skill,
      },
    ],
  });

  const data = await sanitizeHTTPResponse<{
    farm: any;
  }>(response);

  const farm = makeGame(data.farm);

  return { farm };
}
