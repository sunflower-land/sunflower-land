import { CONFIG } from "lib/config";

const API_URL = CONFIG.API_URL;

export async function loadBanDetails(
  id: number,
  token: string
): Promise<{
  isBanned: boolean;
  verificationUrl: string;
  botStatus?: "VERIFY" | "PENDING" | "REJECTED";
}> {
  // Go and fetch the metadata file for this farm
  const url = `${API_URL}/bans/${id}`;
  const response = await window.fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  console.log({ data });
  return data;
}
