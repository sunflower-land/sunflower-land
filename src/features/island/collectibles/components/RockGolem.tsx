import React, { useContext, useRef } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import golemSheet from "assets/sfts/rock_golem.png";
import { canMine } from "features/game/events/landExpansion/stoneMine";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";

export const RockGolem: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const state = gameState.context.state;

  const stone = state.expansions?.[0].stones?.[0];

  const golemGif = useRef<SpriteSheetInstance>();
  const golemClosingGif = useRef<SpriteSheetInstance>();

  const canMineRock = stone ? canMine(stone) : false;

  return (
    <div
      className="relative h-full"
      style={{
        width: `${PIXEL_SCALE * 34}px`,
      }}
    >
      {canMineRock ? (
        <Spritesheet
          key="standing"
          className="absolute group-hover:img-highlight pointer-events-none transform z-10"
          style={{
            width: `${PIXEL_SCALE * 34}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            right: `${PIXEL_SCALE * 2}px`,
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
          className="absolute group-hover:img-highlight pointer-events-none transform z-10"
          style={{
            width: `${PIXEL_SCALE * 34}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            right: `${PIXEL_SCALE * 2}px`,
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
    </div>
  );
};
