import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Request = {
  farmId: number;
  token: string;
};

const API_URL = CONFIG.API_URL;

export async function kickPlayer(request: Request) {
  // Uses same autosave event driven endpoint
  const response = await window.fetch(
    `${API_URL}/kick-player/${request.farmId}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
      },
      body: JSON.stringify({
        accountId: request.farmId,
      }),
    }
  );

  if (response.status >= 400) {
    throw new Error(ERRORS.RESET_SERVER_ERROR);
  }

  const data: { success: boolean } = await response.json();

  return data;
}
