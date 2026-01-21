import { CONFIG } from "lib/config";
import {
  CrustaceanName,
  CrustaceanChum,
  WaterTrapName,
} from "features/game/types/crustaceans";

const API_URL = CONFIG.API_URL;

export type CrustaceanChumMapping = Record<
  CrustaceanName,
  { chums: CrustaceanChum[]; waterTrap: WaterTrapName }
>;

export async function loadCrustaceanChums(
  token: string,
  caughtCrustaceans: CrustaceanName[],
): Promise<CrustaceanChumMapping> {
  if (!API_URL) {
    return {} as CrustaceanChumMapping;
  }

  try {
    const url = new URL(`${API_URL}/data?type=crustaceanChums`);
    if (caughtCrustaceans.length > 0) {
      url.searchParams.append("caught", JSON.stringify(caughtCrustaceans));
    }

    const response = await window.fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status >= 400) {
      return {} as CrustaceanChumMapping;
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    return {} as CrustaceanChumMapping;
  }
}
