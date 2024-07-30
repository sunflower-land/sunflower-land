import React, { useContext, useEffect, useRef, useState } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import desertShakeSheet from "assets/resources/tree/desert_shake_sheet.webp";
import cacti from "assets/resources/tree/cacti.webp";

import { PIXEL_SCALE } from "features/game/lib/constants";

import { Bar } from "components/ui/ProgressBar";
import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";
import { chopAudio, loadAudio } from "lib/utils/sfx";
import { SUNNYSIDE } from "assets/sunnyside";
import { ZoomContext } from "components/ZoomProvider";
import { IslandType } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const tool = "Axe";

const SHAKE_SHEET_FRAME_WIDTH = 448 / 7;
const SHAKE_SHEET_FRAME_HEIGHT = 48;

interface Props {
  hasTool: boolean;
  showHelper: boolean;
  touchCount: number;
  island: IslandType;
}

const SHAKE_SHEET: Record<IslandType, string> = {
  basic: SUNNYSIDE.resource.shakeSheet,
  spring: SUNNYSIDE.resource.springShakeSheet,
  desert: desertShakeSheet,
};

const TREE_IMAGE: Record<IslandType, string> = {
  basic: SUNNYSIDE.resource.tree,
  spring: SUNNYSIDE.resource.spring_tree,
  desert: cacti,
};

const RecoveredTreeComponent: React.FC<Props> = ({
  hasTool,
  touchCount,
  showHelper,
  island,
}) => {
  const { scale } = useContext(ZoomContext);
  const [showSpritesheet, setShowSpritesheet] = useState(false);
  const [showEquipTool, setShowEquipTool] = useState(false);

  const shakeGif = useRef<SpriteSheetInstance>();
  const { t } = useAppTranslation();

  loadAudio([chopAudio]);

  // prevent performing react state update on an unmounted component
  useEffect(() => {
    return () => {
      shakeGif.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (touchCount > 0) {
      setShowSpritesheet(true);
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
        className={classNames("absolute w-full h-full", {
          "cursor-pointer hover:img-highlight": !showEquipTool,
          "cursor-not-allowed": showEquipTool,
        })}
      >
        {showHelper && (
          <img
            className="absolute cursor-pointer group-hover:img-highlight z-30 animate-pulsate"
            src={SUNNYSIDE.icons.chop_icon}
            style={{
              width: `${PIXEL_SCALE * 18}px`,
              right: `${PIXEL_SCALE * -4}px`,
              top: `${PIXEL_SCALE * -4}px`,
            }}
          />
        )}

        {/* static tree image */}
        {!showSpritesheet && (
          <img
            src={TREE_IMAGE[island]}
            className={"absolute pointer-events-none"}
            style={{
              width: `${PIXEL_SCALE * 26}px`,
              bottom: `${PIXEL_SCALE * 2}px`,
              right: `${PIXEL_SCALE * 3}px`,
            }}
          />
        )}

        {/* spritesheet */}
        {showSpritesheet && (
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
              spritesheet.goToAndPlay(0);
            }}
            image={SHAKE_SHEET[island]}
            widthFrame={SHAKE_SHEET_FRAME_WIDTH}
            heightFrame={SHAKE_SHEET_FRAME_HEIGHT}
            zoomScale={scale}
            fps={24}
            steps={7}
            direction={`forward`}
            autoplay={false}
            loop={true}
            onLoopComplete={(spritesheet) => {
              spritesheet.pause();
              if (touchCount == 0 && !!shakeGif.current) {
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
            top: `${PIXEL_SCALE * -10}px`,
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

export const RecoveredTree = React.memo(RecoveredTreeComponent);
