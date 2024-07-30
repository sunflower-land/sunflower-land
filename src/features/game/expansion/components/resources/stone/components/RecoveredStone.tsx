import React, { useContext, useEffect, useRef, useState } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import { PIXEL_SCALE } from "features/game/lib/constants";

import { Bar } from "components/ui/ProgressBar";
import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";
import { loadAudio, miningAudio } from "lib/utils/sfx";
import { ZoomContext } from "components/ZoomProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const tool = "Pickaxe";

const STRIKE_SHEET_FRAME_WIDTH = 112;
const STRIKE_SHEET_FRAME_HEIGHT = 48;

interface Props {
  hasTool: boolean;
  touchCount: number;
  showHelper: boolean;
}

const RecoveredStoneComponent: React.FC<Props> = ({
  hasTool,
  touchCount,
  showHelper,
}) => {
  const { scale } = useContext(ZoomContext);
  const [showSpritesheet, setShowSpritesheet] = useState(false);
  const [showEquipTool, setShowEquipTool] = useState(false);

  const strikeGif = useRef<SpriteSheetInstance>();
  const { t } = useAppTranslation();

  useEffect(() => {
    loadAudio([miningAudio]);

    // prevent performing react state update on an unmounted component
    return () => {
      strikeGif.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (touchCount > 0) {
      setShowSpritesheet(true);
      miningAudio.play();
      strikeGif.current?.goToAndPlay(0);
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
      {/* Uncollected resource node which is collectable */}
      <div
        className={classNames("absolute w-full h-full", {
          "cursor-pointer hover:img-highlight": !showEquipTool,
          "cursor-not-allowed": showEquipTool,
        })}
      >
        {showHelper && (
          <img
            className="absolute cursor-pointer group-hover:img-highlight z-30"
            src={SUNNYSIDE.icons.wood_mine_icon}
            style={{
              width: `${PIXEL_SCALE * 18}px`,
              right: `${PIXEL_SCALE * -8}px`,
              top: `${PIXEL_SCALE * -8}px`,
            }}
          />
        )}

        {/* static resource node image */}
        {!showSpritesheet && (
          <img
            src={SUNNYSIDE.resource.stone_small}
            className={"absolute pointer-events-none opacity-100"}
            style={{
              width: `${PIXEL_SCALE * 14}px`,
              bottom: `${PIXEL_SCALE * 3}px`,
              right: `${PIXEL_SCALE * 1}px`,
            }}
          />
        )}

        {/* spritesheet */}
        {showSpritesheet && (
          <Spritesheet
            className="pointer-events-none"
            style={{
              position: "absolute",
              width: `${STRIKE_SHEET_FRAME_WIDTH * PIXEL_SCALE}px`,
              height: `${STRIKE_SHEET_FRAME_HEIGHT * PIXEL_SCALE}px`,
              imageRendering: "pixelated",

              // Adjust the base of resource node to be perfectly aligned to
              // on a grid point.
              bottom: `${PIXEL_SCALE * -13}px`,
              right: `${PIXEL_SCALE * -63}px`,
            }}
            getInstance={(spritesheet) => {
              strikeGif.current = spritesheet;
              spritesheet.goToAndPlay(0);
            }}
            image={SUNNYSIDE.resource.stoneStrikeSheet}
            widthFrame={STRIKE_SHEET_FRAME_WIDTH}
            heightFrame={STRIKE_SHEET_FRAME_HEIGHT}
            zoomScale={scale}
            fps={24}
            steps={6}
            direction={`forward`}
            autoplay={false}
            loop={true}
            onLoopComplete={(spritesheet) => {
              spritesheet.pause();
              if (touchCount == 0 && !!strikeGif.current) {
                setShowSpritesheet(false);
              }
            }}
          />
        )}
      </div>

      {/* No tool warning */}
      {showEquipTool && (
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -14}px`,
          }}
        >
          <InnerPanel className="absolute whitespace-nowrap w-fit z-50">
            <div className="text-xs mx-1 p-1">
              <span>
                {t("craft")} {tool.toLowerCase()}
              </span>
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

export const RecoveredStone = React.memo(RecoveredStoneComponent);
