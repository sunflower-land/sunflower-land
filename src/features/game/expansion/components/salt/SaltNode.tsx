import React, { useContext, useMemo } from "react";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useNow } from "lib/utils/hooks/useNow";
import {
  getSaltChargeGenerationTime,
  getStoredSaltCharges,
} from "features/game/types/salt";
import { canInstantHarvestSaltNode, getSaltNodeSprite } from "./saltNodeStage";

interface Props {
  id: string;
  visiting: boolean;
}

const _node = (id: string) => (state: MachineState) =>
  state.context.state.saltFarm.nodes[id];

const _gameState = (state: MachineState) => state.context.state;
const _inventory = (state: MachineState) => state.context.state.inventory;

export const SaltNode: React.FC<Props> = ({ id, visiting }) => {
  const { gameService, showAnimations } = useContext(Context);
  const node = useSelector(gameService, _node(id));
  const gameState = useSelector(gameService, _gameState);
  const inventory = useSelector(gameService, _inventory);
  const now = useNow({ live: true });

  const storedCharges = useMemo(() => {
    if (!node) return 0;
    const chargeIntervalMs = getSaltChargeGenerationTime({ gameState });
    return getStoredSaltCharges(node, now, { chargeIntervalMs });
  }, [node, now, gameState]);
  const availableRakes = Math.floor(inventory["Salt Rake"]?.toNumber() ?? 0);

  if (!node) return null;

  const saltNodeSprite = getSaltNodeSprite(storedCharges);

  return (
    <div className="relative w-full h-full">
      <div
        className="w-full h-full cursor-pointer hover:img-highlight"
        onClick={() => {
          if (
            !canInstantHarvestSaltNode({
              visiting,
              storedCharges,
              availableRakes,
            })
          ) {
            return;
          }

          gameService.send("saltHarvest.harvested", { id });
        }}
      >
        {storedCharges > 0 && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
            <img
              src={SUNNYSIDE.icons.expression_alerted}
              className={showAnimations ? "ready" : ""}
              style={{ width: `${PIXEL_SCALE * 4}px` }}
            />
          </div>
        )}
        <img src={saltNodeSprite} width={PIXEL_SCALE * 18} />
      </div>
    </div>
  );
};
