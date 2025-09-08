import React, { useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Decimal from "decimal.js-light";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import { PIXEL_SCALE } from "features/game/lib/constants";

import { Bar } from "components/ui/ProgressBar";
import { InnerPanel } from "components/ui/Panel";
import { ZoomContext } from "components/ZoomProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSound } from "lib/utils/hooks/useSound";
import { READONLY_RESOURCE_COMPONENTS } from "features/island/resources/Resource";
import { RockName } from "features/game/types/resources";
import { InventoryItemName } from "features/game/types/game";

const tool = "Pickaxe";

const STRIKE_SHEET_FRAME_WIDTH = 112;
const STRIKE_SHEET_FRAME_HEIGHT = 48;
const ADVANCED_STRIKE_SHEET_FRAME_WIDTH = 288 / 6;
const ADVANCED_STRIKE_SHEET_FRAME_HEIGHT = 27;

interface Props {
  hasTool: boolean;
  touchCount: number;
  showHelper: boolean;
  stoneRockName: RockName;
  requiredToolAmount: Decimal;
  inventory: Partial<Record<InventoryItemName, Decimal>>;
}

const RecoveredStoneComponent: React.FC<Props> = ({
  hasTool,
  touchCount,
  showHelper,
  stoneRockName,
  requiredToolAmount,
  inventory,
}) => {
  const { scale } = useContext(ZoomContext);
  const [showSpritesheet, setShowSpritesheet] = useState(false);
  const [showEquipTool, setShowEquipTool] = useState(false);

  const strikeGif = useRef<SpriteSheetInstance>();
  const { t } = useAppTranslation();

  const { play: miningAudio } = useSound("mining");

  const Image = READONLY_RESOURCE_COMPONENTS()[stoneRockName];

  useEffect(() => {
    // prevent performing react state update on an unmounted component
    return () => {
      strikeGif.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (touchCount > 0) {
      setShowSpritesheet(true);
      miningAudio();
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

  const strikeSheetFrameWidth =
    stoneRockName === "Stone Rock"
      ? STRIKE_SHEET_FRAME_WIDTH
      : ADVANCED_STRIKE_SHEET_FRAME_WIDTH;
  const strikeSheetFrameHeight =
    stoneRockName === "Stone Rock"
      ? STRIKE_SHEET_FRAME_HEIGHT
      : ADVANCED_STRIKE_SHEET_FRAME_HEIGHT;

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
        {!showSpritesheet && <Image />}

        {/* spritesheet */}
        {showSpritesheet && (
          <Spritesheet
            className="pointer-events-none"
            style={{
              position: "absolute",
              width: `${strikeSheetFrameWidth * PIXEL_SCALE}px`,
              height: `${strikeSheetFrameHeight * PIXEL_SCALE}px`,
              imageRendering: "pixelated",

              // Adjust the base of resource node to be perfectly aligned to
              // on a grid point.
              bottom: `${PIXEL_SCALE * 0.333}px`,
              right: `${PIXEL_SCALE * -16.14}px`,
            }}
            getInstance={(spritesheet) => {
              strikeGif.current = spritesheet;
              spritesheet.goToAndPlay(0);
            }}
            image={SUNNYSIDE.resource.rocks.strikeSheet[stoneRockName]}
            widthFrame={strikeSheetFrameWidth}
            heightFrame={strikeSheetFrameHeight}
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
                {t("craft")}{" "}
                {requiredToolAmount.sub(inventory[tool] ?? 0).toString()}{" "}
                {tool.toLowerCase()}
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
