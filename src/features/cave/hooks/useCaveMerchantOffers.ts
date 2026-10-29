import { useContext, useSyncExternalStore } from "react";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { Cave } from "features/game/types/game";
import {
  hasUnseenCaveMerchantOffers,
  viewCaveMerchantOffers,
} from "features/game/types/caveMerchant";
import {
  parseCaveMerchantSeen,
  readCaveMerchantSeen,
  subscribeCaveMerchantSeen,
  writeCaveMerchantSeen,
} from "../lib/merchantOffers";

const _farmId = (state: MachineState) => state.context.farmId;
const _isVisiting = (state: MachineState) =>
  state.context.visitorId !== undefined;

/** Shared by the farm, the Cave and the modal; never requests fresh stock. */
export function useCaveMerchantOffers(cave: Cave | undefined, now: number) {
  const { gameService } = useContext(Context);
  const farmId = useSelector(gameService, _farmId);
  const isVisiting = useSelector(gameService, _isVisiting);
  const raw = useSyncExternalStore(subscribeCaveMerchantSeen, () =>
    readCaveMerchantSeen(farmId),
  );
  const seen = parseCaveMerchantSeen(raw);

  return {
    hasUnseenOffers:
      !isVisiting && hasUnseenCaveMerchantOffers(cave, now, seen),
    markOffersViewed: () => {
      if (isVisiting) return;
      // Re-read to preserve views made by another mounted consumer or tab.
      const next = viewCaveMerchantOffers(
        cave,
        now,
        parseCaveMerchantSeen(readCaveMerchantSeen(farmId)),
      );
      if (next) writeCaveMerchantSeen(farmId, next);
    },
  };
}
