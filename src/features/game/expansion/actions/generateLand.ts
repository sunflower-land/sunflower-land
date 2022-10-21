import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

const API_URL = CONFIG.API_URL;

/**
 * Test endpoint for local testing of land generation algorithm
 */
export async function generateTestLand() {
  // Call backend expand-land
  const response = await window.fetch(`${API_URL}/land-test`, {
    method: "GET",
    //mode: "no-cors",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      accept: "application/json",
    },
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error("Could not expand land");
  }

  const data = await response.json();

  return data;
}
