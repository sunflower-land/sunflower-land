import React, { useRef } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import golemSheet from "assets/nfts/rock_golem.png";
import { GameState } from "features/game/types/game";
import { canMine } from "features/game/events/landExpansion/stoneMine";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

export const RockGolem: React.FC<{ state: GameState }> = ({ state }) => {
  const stone = state.expansions[0].stones?.[0];

  const golemGif = useRef<SpriteSheetInstance>();
  const golemClosingGif = useRef<SpriteSheetInstance>();

  const canMineRock = stone ? canMine(stone) : false;

  return (
    <>
      {canMineRock ? (
        <Spritesheet
          key="standing"
          className="group-hover:img-highlight pointer-events-none transform z-10"
          style={{
            width: `${GRID_WIDTH_PX * 5}px`,
            imageRendering: "pixelated",
          }}
          getInstance={(spritesheet) => {
            golemGif.current = spritesheet;
          }}
          image={golemSheet}
          widthFrame={34}
          heightFrame={42}
          fps={6}
          steps={38}
          endAt={8}
          direction={`forward`}
          autoplay={true}
          loop={true}
        />
      ) : (
        <Spritesheet
          key="closing"
          className="group-hover:img-highlight pointer-events-none transform z-10"
          style={{
            width: `${GRID_WIDTH_PX * 5}px`,
            imageRendering: "pixelated",
          }}
          getInstance={(spritesheet) => {
            golemClosingGif.current = spritesheet;
          }}
          image={golemSheet}
          widthFrame={34}
          heightFrame={42}
          fps={10}
          startAt={8}
          endAt={23}
          steps={38}
          direction={`forward`}
          autoplay={true}
          loop={false}
        />
      )}
    </>
  );
};
