import React, { useContext, useEffect, useRef } from "react";
import { useSelector } from "@xstate/react";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  BEETLE_FEEDING_XP,
  type BeetleName,
} from "features/game/types/beetles";
import { getKeys } from "lib/object";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";

const _inventory = (state: MachineState) => state.context.state.inventory;

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
  const { gameService, shortcutItem, removeShortcut, selectedItem } =
    useContext(Context);
  const { t } = useAppTranslation();
  const inventory = useSelector(gameService, _inventory);
  // The held item before Beetle mode took over the hand, restored when the
  // mode ends so a leftover Beetle does not keep being fed.
  const previousSelection = useRef<InventoryItemName | undefined>(undefined);
  const selectedItemRef = useRef(selectedItem);
  const beetleRef = useRef(beetle);

  useEffect(() => {
    selectedItemRef.current = selectedItem;
    beetleRef.current = beetle;
  });

  const restoreHand = (beetle: BeetleName) => {
    const previous = previousSelection.current;
    previousSelection.current = undefined;
    // The player may have changed the held item since: leave their pick.
    if (selectedItemRef.current !== beetle) return;

    if (previous) {
      shortcutItem(previous);
    } else {
      removeShortcut(beetle);
    }
  };

  // Leaving the building drops the mode state with this component: put the
  // hand back so the Beetle does not stay selected in the next building.
  useEffect(() => {
    return () => {
      if (beetleRef.current) restoreHand(beetleRef.current);
    };
  }, []);

  const closePicker = () => {
    onShowPickerChange(false);
    // The picker is only open while the mode is on when it opened itself
    // because the Beetles ran out; closing it ends the mode.
    if (beetle) {
      onChange(undefined);
      restoreHand(beetle);
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label={t("animals.beetleMode")}
        className="relative z-10 border-0 bg-transparent p-0 cursor-pointer hover:img-highlight"
        style={{ width: `${PIXEL_SCALE * 18}px` }}
        onClick={() => {
          if (beetle) {
            onChange(undefined);
            restoreHand(beetle);
          } else {
            onShowPickerChange(true);
          }
        }}
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

      <Modal show={showPicker} onHide={closePicker}>
        <CloseButtonPanel onClose={closePicker}>
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
                    count={inventory[name]}
                    disabled={!inventory[name]?.gte(1)}
                    onClick={() => {
                      if (!beetle) previousSelection.current = selectedItem;
                      onShowPickerChange(false);
                      onChange(name);
                      // Hold the picked Beetle, so the HUD selection matches
                      // the mode instead of a stale Slop or treat selection.
                      shortcutItem(name);
                    }}
                  />
                  <span className="text-xxs">
                    {t("animals.beetleMode.xpValue", {
                      xp: BEETLE_FEEDING_XP[name],
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
