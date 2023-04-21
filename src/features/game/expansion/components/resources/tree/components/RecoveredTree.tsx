import React, { useEffect, useRef, useState } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import shakeSheet from "assets/resources/tree/shake_sheet.png";

import { PIXEL_SCALE } from "features/game/lib/constants";

import { Bar } from "components/ui/ProgressBar";
import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";
import { chopAudio } from "lib/utils/sfx";

const tool = "Axe";

const SHAKE_SHEET_FRAME_WIDTH = 448 / 7;
const SHAKE_SHEET_FRAME_HEIGHT = 48;

interface Props {
  hasTool: boolean;
  touchCount: number;
}

const RecoveredTreeComponent: React.FC<Props> = ({ hasTool, touchCount }) => {
  const [showEquipTool, setShowEquipTool] = useState(false);

  const treeRef = useRef<HTMLDivElement>(null);
  const shakeGif = useRef<SpriteSheetInstance>();

  useEffect(() => {
    if (touchCount > 0) {
      chopAudio.play();
      shakeGif.current?.goToAndPlay(0);
    }
  }, [touchCount]);

  const handleHover = () => {
    if (!hasTool) {
      setShowEquipTool(true);
    }
  };

  const handleMouseLeave = () => {
    setShowEquipTool(false);
  };

  return (
    <div
      className="absolute w-full h-full"
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
    >
      {/* Unchopped tree which is choppable */}
      <div
        ref={treeRef}
        className={classNames("absolute w-full h-full", {
          "cursor-pointer hover:img-highlight": !showEquipTool,
          "cursor-not-allowed": showEquipTool,
        })}
      >
        <Spritesheet
          className="pointer-events-none"
          style={{
            position: "absolute",
            width: `${SHAKE_SHEET_FRAME_WIDTH * PIXEL_SCALE}px`,
            height: `${SHAKE_SHEET_FRAME_HEIGHT * PIXEL_SCALE}px`,
            imageRendering: "pixelated",

            // Adjust the base of tree to be perfectly aligned to
            // on a grid point.
            bottom: `${PIXEL_SCALE * 2}px`,
            right: `${PIXEL_SCALE * -4}px`,
          }}
          getInstance={(spritesheet) => {
            shakeGif.current = spritesheet;
          }}
          image={shakeSheet}
          widthFrame={SHAKE_SHEET_FRAME_WIDTH}
          heightFrame={SHAKE_SHEET_FRAME_HEIGHT}
          fps={14}
          steps={7}
          direction={`forward`}
          autoplay={false}
          loop={true}
          onLoopComplete={(spritesheet) => {
            spritesheet.pause();
          }}
        />
      </div>

      {/* No tool warning */}
      {showEquipTool && (
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -10}px`,
          }}
        >
          <InnerPanel className="absolute whitespace-nowrap w-fit z-50">
            <div className="text-xxs mx-1 p-1">
              <span>Equip {tool.toLowerCase()}</span>
            </div>
          </InnerPanel>
        </div>
      )}

      {/* Health bar */}
      {touchCount > 0 && (
        <div
          className="absolute left-1/2 pointer-events-none"
          style={{
            marginLeft: `${PIXEL_SCALE * -8}px`,
            bottom: `${PIXEL_SCALE * -5}px`,
          }}
        >
          <Bar percentage={100 - (touchCount / 3) * 100} type="health" />
        </div>
      )}
    </div>
  );
};

export const RecoveredTree = React.memo(RecoveredTreeComponent);
