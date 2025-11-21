import React, { useContext, useEffect, useRef, useState } from "react";
import Decimal from "decimal.js-light";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";

import { Bar } from "components/ui/ProgressBar";
import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";
import { ZoomContext } from "components/ZoomProvider";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSound } from "lib/utils/hooks/useSound";
import { IronRockName } from "features/game/types/resources";
import { READONLY_RESOURCE_COMPONENTS } from "features/island/resources/Resource";
import {
  GameState,
  InventoryItemName,
  TemperateSeasonName,
} from "features/game/types/game";

const tool = "Stone Pickaxe";

const STRIKE_SHEET_FRAME_WIDTH = 112;
const STRIKE_SHEET_FRAME_HEIGHT = 48;

interface Props {
  season: TemperateSeasonName;
  island: GameState["island"];
  hasTool: boolean;
  touchCount: number;
  ironRockName: IronRockName;
  requiredToolAmount: Decimal;
  inventory: Partial<Record<InventoryItemName, Decimal>>;
}

const RecoveredIronComponent: React.FC<Props> = ({
  hasTool,
  touchCount,
  season,
  island,
  ironRockName,
  requiredToolAmount,
  inventory,
}) => {
  const { scale } = useContext(ZoomContext);
  const [showEquipTool, setShowEquipTool] = useState(false);

  const strikeGif = useRef<SpriteSheetInstance>(undefined);

  const { t } = useAppTranslation();

  const { play: miningAudio } = useSound("mining");

  const Image = READONLY_RESOURCE_COMPONENTS({
    season,
    island,
  })[ironRockName];

  useEffect(() => {
    // prevent performing react state update on an unmounted component
    return () => {
      strikeGif.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (touchCount > 0) {
      miningAudio();
      strikeGif.current?.goToAndPlay(0);
    }
  }, [touchCount, miningAudio]);

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
        {/* static resource node image */}
        {touchCount === 0 && <Image />}

        {/* spritesheet */}
        {touchCount > 0 && (
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
            image={SUNNYSIDE.resource.ironStrikeSheet}
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

export const RecoveredIron = React.memo(RecoveredIronComponent);
