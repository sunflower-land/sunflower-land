import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { JiggerStatus } from "../components/Jigger";

const API_URL = CONFIG.API_URL;

export async function loadBanDetails(
  id: string,
  token: string,
  transactionId: string,
): Promise<{
  isBanned: boolean;
  verificationUrl: string;
  botStatus?: JiggerStatus;
}> {
  // Go and fetch the metadata file for this farm
  const url = `${API_URL}/bans/${id}`;
  const response = await window.fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
      "X-Transaction-ID": transactionId,
    },
  });

  if (response.status >= 400) {
    throw new Error(ERRORS.BANS_SERVER_ERROR);
  }

  const data = await response.json();

  return data;
}
