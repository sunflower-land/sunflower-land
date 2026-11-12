import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  BEETLE_FEEDING_XP,
  type BeetleName,
} from "features/game/types/beetles";
import { getKeys } from "lib/object";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useTimeBasedFeatureAccess } from "lib/utils/hooks/useTimeBasedFeatureAccess";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";

const _game = (state: MachineState) => state.context.state;

/**
 * Building-level Beetle feeding mode. Off, a tap picks the Beetle to feed;
 * on, the animals ask for that Beetle (as many as get them to their next
 * level) and a tap on the button turns the mode off.
 */
export const BeetleFeedingButton: React.FC<{
  beetle?: BeetleName;
  onChange: (beetle?: BeetleName) => void;
  /** The picker's open state lives in the building so it can also open when
   * the player's last Beetle of the selected kind is gone. */
  showPicker: boolean;
  onShowPickerChange: (show: boolean) => void;
}> = ({ beetle, onChange, showPicker, onShowPickerChange }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const game = useSelector(gameService, _game);

  const hasAccess = useTimeBasedFeatureAccess({
    featureName: "BEETLE_FEEDING",
    game,
  });
  if (!hasAccess) return null;

  return (
    <>
      <button
        type="button"
        aria-label={t("animals.beetleMode")}
        className="relative z-10 border-0 bg-transparent p-0 cursor-pointer hover:img-highlight"
        style={{ width: `${PIXEL_SCALE * 18}px` }}
        onClick={() =>
          beetle ? onChange(undefined) : onShowPickerChange(true)
        }
      >
        <img className="block w-full" src={SUNNYSIDE.icons.disc} alt="" />
        <img
          src={ITEM_DETAILS[beetle ?? "Green Beetle"].image}
          alt=""
          className={classNames(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none",
            { "opacity-60": !beetle },
          )}
          style={{ width: `${PIXEL_SCALE * 10}px` }}
        />
        {beetle && (
          <img
            src={SUNNYSIDE.icons.confirm}
            alt=""
            className="absolute -top-0.5 -right-0.5 pointer-events-none"
            style={{ width: `${PIXEL_SCALE * 6}px` }}
          />
        )}
      </button>

      <Modal show={showPicker} onHide={() => onShowPickerChange(false)}>
        <CloseButtonPanel onClose={() => onShowPickerChange(false)}>
          <div className="flex flex-col gap-1 p-1">
            <Label type="default" icon={ITEM_DETAILS["Green Beetle"].image}>
              {t("animals.beetleMode")}
            </Label>
            <p className="text-xs mb-1">
              {t("animals.beetleMode.description")}
            </p>
            <div className="flex flex-wrap">
              {getKeys(BEETLE_FEEDING_XP).map((name) => (
                <div key={name} className="flex flex-col items-center">
                  <Box
                    image={ITEM_DETAILS[name].image}
                    count={game.inventory[name]}
                    disabled={!game.inventory[name]?.gte(1)}
                    onClick={() => {
                      onShowPickerChange(false);
                      onChange(name);
                    }}
                  />
                  <span className="text-xxs">{`${BEETLE_FEEDING_XP[name]} XP`}</span>
                </div>
              ))}
            </div>
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
