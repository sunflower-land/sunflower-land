import Decimal from "decimal.js-light";
import { communityContracts } from "features/community/lib/communityContracts";
import { Incubator, IncubatorName } from "features/community/types/community";
import { fromWei } from "web3-utils";

export async function loadIncubators() {
  try {
    const incubatorIds = await communityContracts.getIncubator().incubatorIds();

    const result = incubatorIds.map(async (id) => ({
      name: "active" as IncubatorName,
      description: "An occupied incubator.",
      id,
      earnings: await getEarnings(id),
    }));
    const res: Incubator[] = await Promise.all(result);

    return res;
  } catch {
    return <Incubator[]>[];
  }
}

export async function getEarnings(incubatorId: string) {
  try {
    const earnings = await communityContracts
      .getIncubator()
      .incubatorEarnings(incubatorId);

    return new Decimal(fromWei(earnings[0]));
  } catch {
    return new Decimal(0);
  }
}
