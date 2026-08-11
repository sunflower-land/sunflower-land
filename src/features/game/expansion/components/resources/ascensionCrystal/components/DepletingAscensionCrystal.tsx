import React, { useContext, useRef, useState } from "react";
import Spritesheet, {
  type SpriteSheetInstance,
} from "components/animation/SpriteAnimator";
import dropSheet from "assets/resources/ascension_crystal/crystal_rock_drop.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ZoomContext } from "components/ZoomProvider";
import { ITEM_DETAILS } from "features/game/types/images";

const DROP_SHEET_FRAME_WIDTH = 48;
const DROP_SHEET_FRAME_HEIGHT = 48;

interface Props {
  resourceAmount?: number;
}

const DepletingAscensionCrystalComponent: React.FC<Props> = ({
  resourceAmount,
}) => {
  const { scale } = useContext(ZoomContext);
  const [playing, setPlaying] = useState(false);
  const dropGif = useRef<SpriteSheetInstance>(undefined);

  return (
    <div className="absolute w-full h-full pointer-events-none">
      <Spritesheet
        style={{
          opacity: playing ? 1 : 0,
          transition: "opacity 0.2s ease-in",

          width: `${DROP_SHEET_FRAME_WIDTH * PIXEL_SCALE}px`,
          height: `${DROP_SHEET_FRAME_HEIGHT * PIXEL_SCALE}px`,
          imageRendering: "pixelated",

          // Centre the 48px frame over the 2x2 (32px) node so the sheet's
          // crystal lines up with where the static node stood.
          bottom: `${PIXEL_SCALE * -2}px`,
          right: `${PIXEL_SCALE * -8}px`,
        }}
        className="absolute z-40"
        getInstance={(spritesheet) => {
          dropGif.current = spritesheet;
          spritesheet.goToAndPlay(0);
          setPlaying(true);
        }}
        image={dropSheet}
        widthFrame={DROP_SHEET_FRAME_WIDTH}
        heightFrame={DROP_SHEET_FRAME_HEIGHT}
        zoomScale={scale}
        fps={20}
        steps={10}
        direction={`forward`}
        autoplay={false}
        loop={true}
        onLoopComplete={async (spritesheet) => {
          // hold the settled shard, then fade out
          spritesheet.pause();
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setPlaying(false);
        }}
      />

      {/* Collected resource amount */}
      {!!resourceAmount && (
        <div
          className="flex justify-center absolute w-full z-40"
          style={{
            width: `${PIXEL_SCALE * 48}px`,
            left: `${PIXEL_SCALE * -8}px`,
            top: `${PIXEL_SCALE * -2}px`,
            opacity: playing ? 1 : 0,
            transition: "opacity 0.2s ease-in",
          }}
        >
          <img
            src={ITEM_DETAILS["Ascension Shard"].image}
            className="mr-2 img-highlight-heavy"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
            }}
          />
          <span className="yield-text text-white font-pixel">{`+${resourceAmount}`}</span>
        </div>
      )}
    </div>
  );
};

export const DepletingAscensionCrystal = React.memo(
  DepletingAscensionCrystalComponent,
);
