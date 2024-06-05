import React, { useContext, useRef, useState } from "react";
import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";
import choppedSheet from "assets/resources/tree/chopped_sheet.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { ZoomContext } from "components/ZoomProvider";

const CHOPPED_SHEET_FRAME_WIDTH = 1040 / 13;
const CHOPPED_SHEET_FRAME_HEIGHT = 48;

interface Props {
  resourceAmount?: number;
}

const DepletingTreeComponent: React.FC<Props> = ({ resourceAmount }) => {
  const { scale } = useContext(ZoomContext);
  const [playing, setPlaying] = useState(false);
  const choppedGif = useRef<SpriteSheetInstance>();

  return (
    <div className="absolute w-full h-full pointer-events-none">
      <Spritesheet
        style={{
          opacity: playing ? 1 : 0,
          transition: "opacity 0.2s ease-in",

          width: `${CHOPPED_SHEET_FRAME_WIDTH * PIXEL_SCALE}px`,
          height: `${CHOPPED_SHEET_FRAME_HEIGHT * PIXEL_SCALE}px`,
          imageRendering: "pixelated",

          // Adjust the base of tree to be perfectly aligned to
          // on a grid point.
          bottom: `${PIXEL_SCALE * 4}px`,
          right: `${PIXEL_SCALE * -6}px`,
        }}
        className="absolute z-40"
        getInstance={(spritesheet) => {
          choppedGif.current = spritesheet;
          spritesheet.goToAndPlay(0);
          setPlaying(true);
        }}
        image={choppedSheet}
        widthFrame={CHOPPED_SHEET_FRAME_WIDTH}
        heightFrame={CHOPPED_SHEET_FRAME_HEIGHT}
        zoomScale={scale}
        fps={20}
        steps={11}
        direction={`forward`}
        autoplay={false}
        loop={true}
        onLoopComplete={async (spritesheet) => {
          // fade out tree then remove sprite from render
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
            src={SUNNYSIDE.resource.wood}
            className="mr-2 img-highlight-heavy"
            style={{
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
          <span className="yield-text text-white font-pixel">{`+${resourceAmount}`}</span>
        </div>
      )}
    </div>
  );
};

export const DepletingTree = React.memo(DepletingTreeComponent);
