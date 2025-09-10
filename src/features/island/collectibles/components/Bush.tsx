import React, { useContext } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";

import { BUSH_VARIANTS } from "features/island/lib/alternateArt";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";

const _island = (state: MachineState) => state.context.state.island;
const _season = (state: MachineState) => state.context.state.season.season;

export const Bush: React.FC<CollectibleProps> = () => {
  const { gameService } = useContext(Context);
  const island = useSelector(gameService, _island);
  const season = useSelector(gameService, _season);
  const biome = getCurrentBiome(island);

  return (
    <SFTDetailPopover name="Bush">
      <>
        <img
          src={BUSH_VARIANTS[biome][season]}
          style={{
            width: `${PIXEL_SCALE * (island.type === "desert" ? 20 : island.type === "volcano" ? 28 : 28)}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * (island.type === "desert" ? 6 : island.type === "volcano" ? 2 : 2)}px`,
          }}
          className="absolute"
          alt="Bush"
        />
      </>
    </SFTDetailPopover>
  );
};
