import { CONFIG } from "lib/config";
import { makeGame } from "../lib/transforms";
import { SkillName } from "../types/skills";

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
  const response = await window.fetch(`${API_URL}/autosave/${request.farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
      "X-Fingerprint": request.fingerprint,
    },
    body: JSON.stringify({
      sessionId: request.sessionId,
      actions: [
        {
          type: "skill.learned",
          skill: request.skill,
        },
      ],
    }),
  });

  const data = await response.json();

  const farm = makeGame(data.farm);

  return { farm };
}
