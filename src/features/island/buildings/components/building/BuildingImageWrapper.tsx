import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import {
  getBuildingBumpkinLevelRequired,
  isBuildingEnabled,
} from "features/game/expansion/lib/buildingRequirements";
import { BuildingName } from "features/game/types/buildings";
import { MachineState } from "features/game/lib/gameMachine";
import { getBumpkinLevel } from "features/game/lib/level";
import { Context } from "features/game/GameProvider";

/**
 * BuildingImageWrapper props
 * @param nonInteractible if the building is non interactible
 * @param ready if the building crafting process is ready
 * @param onClick on click event
 */
interface Props {
  name: string;
  nonInteractible?: boolean;
  ready?: boolean;
  onClick: () => void;
}

const _bumpkinLevel = (state: MachineState) =>
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0);

export const BuildingImageWrapper: React.FC<Props> = ({
  name,
  nonInteractible,
  ready,
  onClick,
  children,
}) => {
  const { gameService } = useContext(Context);
  const bumpkinLevel = useSelector(gameService, _bumpkinLevel);

  const getHandleDisabledOnClick = (name: string) =>
    function handleDisabledOnClick() {
      const bumpkinLevelRequired = getBuildingBumpkinLevelRequired(
        name as BuildingName
      );
      return (
        <CloseButtonPanel>
          <div>
            {name} requires bumpkin level {bumpkinLevelRequired} to use.
          </div>
        </CloseButtonPanel>
      );
    };

  let enabled = !nonInteractible;
  if (enabled) {
    enabled = isBuildingEnabled(bumpkinLevel, name as BuildingName);
  }

  return (
    <>
      {/* building */}
      <div
        className={classNames(
          "relative w-full h-full",
          nonInteractible ? "" : "cursor-pointer hover:img-highlight"
        )}
        onClick={!enabled ? getHandleDisabledOnClick(name) : onClick}
      >
        {children}
      </div>

      {/* Ready indicator */}
      {ready && (
        <div
          className="flex justify-center absolute w-full pointer-events-none z-30"
          style={{
            top: `${PIXEL_SCALE * -12}px`,
          }}
        >
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className="ready"
            style={{
              width: `${PIXEL_SCALE * 4}px`,
            }}
          />
        </div>
      )}
    </>
  );
};
