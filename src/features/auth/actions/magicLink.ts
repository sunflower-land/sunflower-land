import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { randomID } from "lib/utils/random";

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
        "x-transaction-id": randomID(),
      },
    },
  );

  if (response.status === 401) {
    throw new Error(ERRORS.UNAUTHORIZED);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.MAGIC_LINK_ERROR);
  }

  return await response.json();
}
