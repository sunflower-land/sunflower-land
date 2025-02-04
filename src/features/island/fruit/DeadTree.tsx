import React, { useContext, useState } from "react";
import { InfoPopover } from "../common/InfoPopover";
import { PATCH_FRUIT_LIFECYCLE } from "./fruits";
import { PATCH_FRUIT, PatchFruitName } from "features/game/types/fruits";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { IslandType } from "features/game/types/game";

interface Props {
  patchFruitName: PatchFruitName;
  hasAxes: boolean;
  islandType: IslandType;
}

const _island = (state: MachineState) => state.context.state.island.type;

export const DeadTree = ({ patchFruitName, hasAxes, islandType }: Props) => {
  const { gameService } = useContext(Context);
  const { isBush } = PATCH_FRUIT[patchFruitName];
  const [showNoToolWarning, setShowNoToolWarning] = useState<boolean>(false);

  const island = useSelector(gameService, _island);

  const handleHover = () => {
    if (!hasAxes) {
      setShowNoToolWarning(true);
    }
  };

  const handleMouseLeave = () => {
    setShowNoToolWarning(false);
  };

  const { t } = useAppTranslation();
  return (
    <>
      <div
        className={classNames("absolute w-full h-full", {
          "cursor-not-allowed": showNoToolWarning,
          "cursor-pointer hover:img-highlight": !showNoToolWarning,
        })}
        onMouseEnter={handleHover}
        onMouseLeave={handleMouseLeave}
      >
        {/* Dead tree/bush */}
        <img
          src={PATCH_FRUIT_LIFECYCLE[island][patchFruitName].dead}
          className="absolute"
          style={{
            bottom: `${PIXEL_SCALE * (isBush ? 9 : 5)}px`,
            left: `${PIXEL_SCALE * (isBush ? 8 : 4)}px`,
            width: `${PIXEL_SCALE * (isBush ? 16 : 24)}px`,
          }}
        ></img>
      </div>

      {/* No tool warning */}
      <div
        className="flex justify-center absolute w-full pointer-events-none"
        style={{
          top: `${PIXEL_SCALE * -14}px`,
        }}
      >
        <InfoPopover showPopover={showNoToolWarning}>
          <div className="flex flex-1 items-center text-xxs justify-center px-2 py-1 whitespace-nowrap">
            <img src={SUNNYSIDE.tools.axe} className="w-4 mr-1" />
            <span>{t("warning.noAxe")}</span>
          </div>
        </InfoPopover>
      </div>
    </>
  );
};
