import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Request = {
  portalId: string;
  token: string;
  farmId: number;
};

const API_URL = CONFIG.API_URL;

export async function portal(request: Request) {
  // TODO check cache for valid token;

  // Uses same autosave event driven endpoint
  const response = await window.fetch(
    `${API_URL}/portal/${request.portalId}/login`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
      },
      body: JSON.stringify({
        farmId: request.farmId,
      }),
    }
  );

  if (response.status >= 400) {
    throw new Error(ERRORS.PORTAL_LOGIN_ERROR);
  }

  const data: { token: string } = await response.json();

  return data;
}
