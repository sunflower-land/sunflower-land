import { CONFIG } from "lib/config";

const API_URL = CONFIG.API_URL;

export async function checkMigrationStatus(
  farmId: string,
  token: string
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
    },
  });

  const data = await response.json();

  return data;
}
