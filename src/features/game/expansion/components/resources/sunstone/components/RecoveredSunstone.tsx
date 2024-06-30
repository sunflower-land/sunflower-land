import React, { useContext, useEffect, useRef, useState } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import strikeSheet from "assets/resources/sunstone/sunstone_rock_spark.png";

import { PIXEL_SCALE } from "features/game/lib/constants";

import { Bar } from "components/ui/ProgressBar";
import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";
import { loadAudio, miningAudio } from "lib/utils/sfx";
import sunstone_1 from "assets/resources/sunstone/sunstone_rock_1.webp";
import sunstone_2 from "assets/resources/sunstone/sunstone_rock_2.webp";
import sunstone_3 from "assets/resources/sunstone/sunstone_rock_3.webp";
import sunstone_4 from "assets/resources/sunstone/sunstone_rock_4.webp";
import sunstone_5 from "assets/resources/sunstone/sunstone_rock_5.webp";
import sunstone_6 from "assets/resources/sunstone/sunstone_rock_6.webp";
import sunstone_7 from "assets/resources/sunstone/sunstone_rock_7.webp";
import sunstone_8 from "assets/resources/sunstone/sunstone_rock_8.webp";
import sunstone_9 from "assets/resources/sunstone/sunstone_rock_9.webp";
import sunstone_10 from "assets/resources/sunstone/sunstone_rock_10.webp";

import { ZoomContext } from "components/ZoomProvider";

import { getSunstoneStage } from "../Sunstone";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const tool = "Gold Pickaxe";

const STRIKE_SHEET_FRAME_WIDTH = 48;
const STRIKE_SHEET_FRAME_HEIGHT = 48;

interface Props {
  hasTool: boolean;
  touchCount: number;
  minesLeft: number;
}

const RecoveredSunstoneComponent: React.FC<Props> = ({
  hasTool,
  touchCount,
  minesLeft,
}) => {
  const { scale } = useContext(ZoomContext);
  const [showSpritesheet, setShowSpritesheet] = useState(false);
  const [showEquipTool, setShowEquipTool] = useState(false);
  const [showBumpkinLevel, setShowBumpkinLevel] = useState(false);

  const strikeGif = useRef<SpriteSheetInstance>();

  const { t } = useAppTranslation();

  useEffect(() => {
    loadAudio([miningAudio]);

    // prevent performing react state update on an unmounted component
    return () => {
      strikeGif.current = undefined;
    };
  }, []);

  const sunstoneImage = [
    sunstone_1,
    sunstone_2,
    sunstone_3,
    sunstone_4,
    sunstone_5,
    sunstone_6,
    sunstone_7,
    sunstone_8,
    sunstone_9,
    sunstone_10,
  ][getSunstoneStage(minesLeft) - 1];

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
    setShowBumpkinLevel(false);
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
        {/* static resource node image */}
        {!showSpritesheet && (
          <img
            src={sunstoneImage}
            className={"absolute pointer-events-none"}
            style={{
              width: `${PIXEL_SCALE * 24}px`,
              bottom: `${PIXEL_SCALE * 1}px`,
              right: `${PIXEL_SCALE * 4}px`,
            }}
          />
        )}

        {/* spritesheet */}
        {showSpritesheet && (
          <>
            <img
              src={sunstoneImage}
              className="absolute pointer-events-none"
              style={{
                width: `${PIXEL_SCALE * 24}px`,
                bottom: `${PIXEL_SCALE * 1}px`,
                right: `${PIXEL_SCALE * 4}px`,
              }}
            />
            <Spritesheet
              className="pointer-events-none"
              style={{
                position: "absolute",
                width: `${STRIKE_SHEET_FRAME_WIDTH * PIXEL_SCALE}px`,
                height: `${STRIKE_SHEET_FRAME_HEIGHT * PIXEL_SCALE}px`,
                imageRendering: "pixelated",

                // Adjust the base of resource node to be perfectly aligned to
                // on a grid point.
                bottom: `${PIXEL_SCALE * 0}px`,
                right: `${PIXEL_SCALE * -4}px`,
              }}
              getInstance={(spritesheet) => {
                strikeGif.current = spritesheet;
                spritesheet.goToAndPlay(0);
              }}
              image={strikeSheet}
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
          </>
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

export const RecoveredSunstone = React.memo(RecoveredSunstoneComponent);
