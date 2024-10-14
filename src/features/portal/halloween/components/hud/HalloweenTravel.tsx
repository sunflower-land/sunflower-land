import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import worldIcon from "assets/icons/world.png";
import { goHome } from "features/portal/lib/portalUtil";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { PortalMachineState } from "../../lib/halloweenMachine";
import { useSound } from "lib/utils/hooks/useSound";
import classNames from "classnames";
import { isTouchDevice } from "features/world/lib/device";
import { HALLOWEEN_NPC_WEARABLES } from "../../HalloweenConstants";

const _isPlaying = (state: PortalMachineState) => state.matches("playing");
const _isJoystickActive = (state: PortalMachineState) =>
  state.context.isJoystickActive;

export const HalloweenTravel: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const { t } = useAppTranslation();

  const isPlaying = useSelector(portalService, _isPlaying);
  const isJoystickActive = useSelector(portalService, _isJoystickActive);

  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const button = useSound("button");

  // hide exit confirmation when game ends
  useEffect(() => {
    if (isPlaying) return;

    setShowExitConfirmation(false);
  }, [isPlaying]);

  return (
    <>
      <div
        className="fixed z-50 flex flex-col justify-between"
        style={{
          left: `${PIXEL_SCALE * 3}px`,
          bottom: `${PIXEL_SCALE * 3}px`,
        }}
      >
        <div
          className={classNames(
            "flex relative z-50 justify-center cursor-pointer",
            {
              "hover:img-highlight": !isJoystickActive && !isTouchDevice(),
            },
          )}
          style={{
            width: `${PIXEL_SCALE * 22}px`,
            height: `${PIXEL_SCALE * 23}px`,
          }}
          onClick={() => {
            button.play();
            if (isPlaying) {
              setShowExitConfirmation(true);
            } else {
              goHome();
            }
          }}
        >
          <img
            src={SUNNYSIDE.ui.round_button}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 22}px`,
            }}
          />
          <img
            src={worldIcon}
            style={{
              width: `${PIXEL_SCALE * 12}px`,
              left: `${PIXEL_SCALE * 5}px`,
              top: `${PIXEL_SCALE * 4}px`,
            }}
            className="absolute"
          />
        </div>
      </div>
      <ConfirmationModal
        bumpkinParts={HALLOWEEN_NPC_WEARABLES}
        show={showExitConfirmation}
        onHide={() => setShowExitConfirmation(false)}
        messages={[t("halloween.endGameConfirmation")]}
        onCancel={() => setShowExitConfirmation(false)}
        onConfirm={() => {
          portalService.send("END_GAME_EARLY");
          setShowExitConfirmation(false);
        }}
        confirmButtonLabel={t("halloween.endGame")}
      />
    </>
  );
};
