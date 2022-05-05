import { CONFIG } from "lib/config";

type Request = {
  farmId: number;
  token: string;
  fingerprint: string;
};

const API_URL = CONFIG.API_URL;

export async function reset(request: Request) {
  // Uses same autosave event driven endpoint
  const response = await window.fetch(`${API_URL}/reset/${request.farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
      "X-Fingerprint": request.fingerprint,
    },
  });

  const data: { success: boolean } = await response.json();

  return data;
}
