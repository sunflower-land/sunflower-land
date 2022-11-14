import { communityContracts } from "features/community/lib/communityContracts";
import { Tadpole, TadpoleName } from "features/community/types/community";

export async function loadTadpoles() {
  try {
    const tadpoleIds = await communityContracts.getIncubator().getTadpoleIds();

    const result = tadpoleIds.map(async (id) => ({
      health: await getTadpoleHealth(id),
      id,
    }));
    const res: Tadpole[] = await Promise.all(result);

    return res;
  } catch {
    return <Tadpole[]>[];
  }
}

export async function getTadpoleHealth(tadpoleId: number[]) {
  try {
    const tadpoleHealth = await communityContracts
      .getTadpole()
      .getTadpoleHealth(tadpoleId);

    return tadpoleHealth as TadpoleName;
  } catch {
    return "dying" as TadpoleName;
  }
}
