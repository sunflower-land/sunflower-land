import { CONFIG } from "lib/config";

const API_URL = CONFIG.API_URL;

export type PersonhoodDetails =
  | {
      status: "APPROVED";
    }
  | { status: "PENDING"; sessionId: string }
  | { status: "REJECTED" };

export async function loadPersonhoodDetails(
  id: number,
  token: string,
  transactionId: string,
): Promise<PersonhoodDetails> {
  // Go and fetch the metadata file for this farm
  const url = `${API_URL}/personhood/${id}`;
  const response = await window.fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
      "X-Transaction-ID": transactionId,
    },
  });

  if (response.status === 200) {
    return { status: "APPROVED" };
  }

  if (response.status === 401) {
    return { status: "REJECTED" };
  }

  if (response.status === 404) {
    const data = await response.json();

    return {
      status: "PENDING",
      sessionId: data.sessionId,
    };
  }

  throw new Error("Persoonhood could not be determined");
}
