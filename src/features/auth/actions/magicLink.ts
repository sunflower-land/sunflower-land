import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Request = {
  token: string;
  farmId: number;
};

export async function getMagicLink(request: Request) {
  const response = await fetch(
    `${CONFIG.API_URL}/auth/link/authorize?farmId=${request.farmId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
      },
    }
  );

  if (response.status >= 400) {
    throw new Error(ERRORS.CREATE_ACCOUNT_SERVER_ERROR);
  }

  return await response.json();
}
