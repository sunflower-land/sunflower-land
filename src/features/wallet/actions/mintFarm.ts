import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Request = {
  id: number;
  jwt: string;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

export async function mintFarm(request: Request) {
  const response = await window.fetch(`${API_URL}/mint-farm/${request.id}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "X-Transaction-ID": request.transactionId,
      Authorization: `Bearer ${request.jwt}`,
    },
  });

  if (response.status >= 400) {
    throw new Error(ERRORS.LOGIN_SERVER_ERROR);
  }

  const {} = await response.json();

  return {};
}
