import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

export type Currency = "MATIC";

type Request = {
  token: string;
  transactionId: string;
};

type Response = {
  sessionId: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
    expiration: string;
  };
};

const API_URL = CONFIG.API_URL;

export async function startRekognition(request: Request): Promise<Response> {
  const response = await window.fetch(`${API_URL}/rekognition/start`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
      "X-Transaction-ID": request.transactionId,
    },
    body: JSON.stringify(request),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.MINT_COLLECTIBLE_SERVER_ERROR);
  }

  return await response.json();
}
