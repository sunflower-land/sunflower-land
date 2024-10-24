import React, { useContext, useState } from "react";
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
import { Modal } from "components/ui/Modal";
import { InnerPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

/**
 * BuildingImageWrapper props
 * @param nonInteractible if the building is non interactible
 * @param ready if the building crafting process is ready
 * @param onClick on click event
 */
interface Props {
  name: string;
  index?: number;
  nonInteractible?: boolean;
  ready?: boolean;
  onClick: () => void;
}

const _bumpkinLevel = (state: MachineState) =>
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0);

export const BuildingImageWrapper: React.FC<Props> = ({
  name,
  index,
  nonInteractible,
  ready,
  onClick,
  children,
}) => {
  const { gameService, showAnimations } = useContext(Context);
  const bumpkinLevel = useSelector(gameService, _bumpkinLevel);
  const [warning, setWarning] = useState<JSX.Element>();

  const [showBumpkinLevel, setShowBumpkinLevel] = useState(false);

  const bumpkinLevelRequired = getBuildingBumpkinLevelRequired(
    name as BuildingName,
    index ?? 0,
  );
  const bumpkinTooLow = bumpkinLevel < bumpkinLevelRequired;
  const { t } = useAppTranslation();

  const getHandleDisabledOnClick = (name: string, nonInteractible: boolean) =>
    function handleDisabledOnClick() {
      if (nonInteractible) return;

      setWarning(
        <CloseButtonPanel onClose={() => setWarning(undefined)}>
          <div className="p-2 flex flex-col items-center">
            <img src={SUNNYSIDE.icons.lock} className="w-20 my-2" />
            <p className="text-sm">{`${name} requires Bumpkin level ${bumpkinLevelRequired} to use.`}</p>
          </div>
        </CloseButtonPanel>,
      );
    };

  let enabled = !nonInteractible;
  if (enabled) {
    enabled = isBuildingEnabled(bumpkinLevel, name as BuildingName);
  }

  const handleHover = () => {
    if (bumpkinTooLow) {
      setShowBumpkinLevel(true);
    }
  };

  const handleMouseLeave = () => {
    setShowBumpkinLevel(false);
  };

  return (
    <>
      <Modal show={!!warning}>{warning}</Modal>
      {/* building */}
      <div
        className={classNames(
          "relative w-full h-full",
          nonInteractible
            ? bumpkinTooLow
              ? "opacity-50"
              : ""
            : "cursor-pointer hover:img-highlight",
        )}
        onClick={
          !enabled
            ? getHandleDisabledOnClick(name, nonInteractible ?? false)
            : onClick
        }
        onMouseEnter={handleHover}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      {/* Bumpkin level warning */}
      {showBumpkinLevel && (
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -14}px`,
          }}
        >
          <InnerPanel className="absolute whitespace-nowrap w-fit z-50">
            <div className="text-xs mx-1 p-1">
              <span>
                {t("bumpkin.level")} {bumpkinLevelRequired} {t("required")}
                {"."}
              </span>
            </div>
          </InnerPanel>
        </div>
      )}

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
            className={showAnimations ? "ready" : ""}
            style={{
              width: `${PIXEL_SCALE * 4}px`,
            }}
          />
        </div>
      )}
    </>
  );
};
