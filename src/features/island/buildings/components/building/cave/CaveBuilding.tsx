import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { useNavigate } from "react-router";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import type { BuildingProps } from "../Building";
import type { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { useNow } from "lib/utils/hooks/useNow";
import { useSound } from "lib/utils/hooks/useSound";
import { getKeys } from "lib/object";
import { isCavePatchCleared } from "features/game/types/caveRecipes";
import { saveIslandScrollPosition } from "features/game/expansion/lib/islandScroll";
import type { GameState } from "features/game/types/game";

const _cave = (state: MachineState) => state.context.state.cave;

const getReadyCavePatchCount = (
  cave: GameState["cave"],
  now: number,
): number =>
  cave
    ? getKeys(cave.machines).filter((id) => {
        const batch = cave.machines[id].batch;
        return !!batch && batch.readyAt <= now && !isCavePatchCleared(batch);
      }).length
    : 0;

/**
 * The Cave on the farm. Clicking it walks the player into `/cave`; a bubble
 * counts the patches that are ready to dig.
 */
export const CaveBuilding: React.FC<BuildingProps> = ({ isBuilt }) => {
  const { gameService } = useContext(Context);
  const cave = useSelector(gameService, _cave);

  const navigate = useNavigate();

  // TODO(Chapter 16 art): reuses the Barn door sound until Cave SFX land.
  const { play: caveAudio } = useSound("barn");

  const now = useNow({ live: !!cave });
  const readyPatchCount = getReadyCavePatchCount(cave, now);

  const handleClick = () => {
    if (isBuilt) {
      caveAudio();
      saveIslandScrollPosition();
      navigate("/cave");
    }
  };

  return (
    <BuildingImageWrapper name="Cave" onClick={handleClick}>
      {isBuilt && readyPatchCount > 0 && (
        <Label
          type="success"
          className="absolute -top-2 left-1/2 -translate-x-1/2 z-20"
          style={{ pointerEvents: "none" }}
        >
          {readyPatchCount}
        </Label>
      )}
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
