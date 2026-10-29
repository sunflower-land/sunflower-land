import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { useNavigate } from "react-router";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import type { BuildingProps } from "../Building";
import type { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import { useNow } from "lib/utils/hooks/useNow";
import { getKeys } from "lib/object";
import { isCavePatchCleared } from "features/game/types/caveRecipes";
import { saveIslandScrollPosition } from "features/game/expansion/lib/islandScroll";
import type { GameState } from "features/game/types/game";

const _cave = (state: MachineState) => state.context.state.cave;

const hasReadyCavePatch = (cave: GameState["cave"], now: number): boolean =>
  !!cave &&
  getKeys(cave.machines).some((id) => {
    const batch = cave.machines[id].batch;
    return !!batch && batch.readyAt <= now && !isCavePatchCleared(batch);
  });

/**
 * The Cave on the farm. Clicking it walks the player into `/cave`; the shared
 * ready indicator shows while a patch is ready to dig.
 */
export const CaveBuilding: React.FC<BuildingProps> = ({ isBuilt }) => {
  const { gameService } = useContext(Context);
  const cave = useSelector(gameService, _cave);

  const navigate = useNavigate();

  const now = useNow({ live: !!cave });
  const ready = hasReadyCavePatch(cave, now);

  const handleClick = () => {
    if (isBuilt) {
      saveIslandScrollPosition();
      navigate("/cave");
    }
  };

  return (
    <BuildingImageWrapper
      name="Cave"
      onClick={handleClick}
      ready={isBuilt && ready}
    >
      <img
        src={SUNNYSIDE.building.cave}
        className="absolute bottom-0 pointer-events-none"
        style={{
          // The art's own width - the Cave sprite is 50x55.
          width: `${PIXEL_SCALE * 50}px`,
        }}
      />
    </BuildingImageWrapper>
  );
};
