import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

const API_URL = CONFIG.API_URL;

export async function checkMigrationStatus(
  farmId: string,
  token: string,
  transactionId: string
): Promise<{
  migrated: boolean;
}> {
  // Go and fetch the metadata file for this farm
  const url = `${API_URL}/migrated/${farmId}`;
  const response = await window.fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
      "X-Transaction-ID": transactionId,
    },
  });

  if (response.status >= 400) {
    throw new Error(ERRORS.MIGRATED_SERVER_ERROR);
  }

  const data = await response.json();

  return data;
}
