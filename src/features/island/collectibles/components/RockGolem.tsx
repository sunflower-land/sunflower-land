import React, { useContext, useRef } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import golemSheet from "assets/sfts/rock_golem.png";
import { canMine } from "features/game/lib/resourceNodes";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { ZoomContext } from "components/ZoomProvider";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const RockGolem: React.FC = () => {
  const { scale } = useContext(ZoomContext);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const state = gameState.context.state;

  const someStonesMined = Object.values(state.stones).some(
    (stone) => !canMine(stone, stone.name ?? "Stone Rock"),
  );

  const golemGif = useRef<SpriteSheetInstance>(undefined);
  const golemClosingGif = useRef<SpriteSheetInstance>(undefined);

  return (
    <SFTDetailPopover name="Rock Golem">
      <>
        {someStonesMined ? (
          <Spritesheet
            key="closing"
            className="absolute group-hover:img-highlight"
            style={{
              width: `${PIXEL_SCALE * 34}px`,
              bottom: `${PIXEL_SCALE * 0}px`,
              right: `${PIXEL_SCALE * 0}px`,
              imageRendering: "pixelated",
            }}
            getInstance={(spritesheet) => {
              golemClosingGif.current = spritesheet;
            }}
            image={golemSheet}
            widthFrame={34}
            heightFrame={42}
            zoomScale={scale}
            fps={10}
            startAt={8}
            endAt={23}
            steps={38}
            direction={`forward`}
            autoplay={true}
            loop={false}
          />
        ) : (
          <Spritesheet
            key="standing"
            className="absolute group-hover:img-highlight"
            style={{
              width: `${PIXEL_SCALE * 34}px`,
              bottom: `${PIXEL_SCALE * 0}px`,
              right: `${PIXEL_SCALE * 0}px`,
              imageRendering: "pixelated",
            }}
            getInstance={(spritesheet) => {
              golemGif.current = spritesheet;
            }}
            image={golemSheet}
            widthFrame={34}
            heightFrame={42}
            zoomScale={scale}
            fps={6}
            steps={38}
            endAt={8}
            direction={`forward`}
            autoplay={true}
            loop={true}
          />
        )}
      </>
    </SFTDetailPopover>
  );
};
