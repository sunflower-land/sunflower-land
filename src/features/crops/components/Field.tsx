import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import classNames from "classnames";

import selectBox from "assets/ui/select/select_box.png";

import { Context } from "features/game/GameProvider";
import {
  GameState,
  FieldItem,
  InventoryItemName,
} from "features/game/types/game";
import { AppIconContext } from "features/crops/AppIconProvider";

import { CropName } from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { getShortcuts } from "../../hud/lib/shortcuts";
import { Soil } from "./Soil";
import Decimal from "decimal.js-light";

const POPOVER_TIME_MS = 1000;

interface Props {
  selectedItem?: InventoryItemName;
  fieldIndex: number;
  className?: string;
}

export const Field: React.FC<Props> = ({
  selectedItem,
  className,
  fieldIndex,
}) => {
  const [showPopover, setShowPopover] = useState(true);
  const [popover, setPopover] = useState<JSX.Element | null>(null);
  const { gameService, shortcutItem } = useContext(Context);
  const { updateHarvestable } = useContext(AppIconContext);
  const [game] = useActor(gameService);
  const inventory = game.context.state.inventory;
  const field = game.context.state.fields[fieldIndex];

  const displayPopover = async (element: JSX.Element) => {
    setPopover(element);
    setShowPopover(true);

    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  const onClick = () => {
    // Plant
    if (!field) {
      try {
        gameService.send("item.planted", {
          index: fieldIndex,
          item: selectedItem,
        });

        if (selectedItem) {
          if ((inventory[selectedItem] || new Decimal(0)).sub(1).equals(0)) {
            const shortcuts = getShortcuts();
            if ((inventory[shortcuts[1]] || 0) > 0) {
              shortcutItem(shortcuts[1]);
            } else if ((inventory[shortcuts[2]] || 0) > 0) {
              shortcutItem(shortcuts[2]);
            }
          }
        }

        displayPopover(
          <div className="flex items-center justify-center text-xs text-white text-shadow overflow-visible">
            <img
              src={ITEM_DETAILS[selectedItem as CropName].image}
              className="w-4 mr-1"
            />
            <span>-1</span>
          </div>
        );
      } catch (e: any) {
        // TODO - catch more elaborate errors
        displayPopover(
          <span className="flex items-center justify-center text-xs text-white text-shadow overflow-visible">
            {e.message}
          </span>
        );
      } finally {
        return;
      }
    }

    try {
      gameService.send("item.harvested", {
        index: fieldIndex,
      });
      updateHarvestable();

      displayPopover(
        <div className="flex items-center justify-center text-xs text-white text-shadow overflow-visible">
          <img src={ITEM_DETAILS[field.name].image} className="w-4 mr-1" />
          <span>+1</span>
        </div>
      );
    } catch (e: any) {
      // TODO - catch more elaborate errors
      displayPopover(
        <span className="text-xs text-white text-shadow">{e.message}</span>
      );
    }
  };

  return (
    <div
      onClick={onClick}
      className={classNames("relative group cursor-pointer", className)}
      style={{
        width: `${GRID_WIDTH_PX}px`,
        height: `${GRID_WIDTH_PX}px`,
      }}
    >
      <Soil field={field} />

      <div
        className={classNames(
          "transition-opacity absolute -bottom-2 w-40 -left-16 z-20 pointer-events-none",
          {
            "opacity-100": showPopover,
            "opacity-0": !showPopover,
          }
        )}
      >
        {popover}
      </div>

      <img
        src={selectBox}
        style={{
          opacity: 0.1,
        }}
        className="absolute inset-0 w-full top-7 opacity-0 group-hover:opacity-100 hover:!opacity-100 z-10"
      />
    </div>
  );
};
