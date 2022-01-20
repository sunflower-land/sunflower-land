import React, { useContext, useState } from "react";
import classNames from "classnames";

import token from "assets/icons/token.png";
import selectBox from "assets/ui/select/select_box.png";

import {
  Context,
  FieldItem,
  InventoryItemName,
} from "features/game/GameProvider";

import {AppContext, CropsIconContext, CropsIconProvider} from '../CropsIconProvider';

import { Soil } from "./Soil";
import { Crop, CropName } from "../lib/crops";
import { ITEM_DETAILS } from "features/game/lib/items";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

const POPOVER_TIME_MS = 1000;

interface Props {
  selectedItem?: InventoryItemName;
  field: FieldItem;
  className?: string;
}

export const Field: React.FC<Props> = ({ field, selectedItem, className }) => {
  const [showPopover, setShowPopover] = useState(true);
  const [popover, setPopover] = useState<JSX.Element | null>(null);
  const { dispatcher } = useContext(Context);
  const { incrementHarvestable } = useContext(CropsIconContext);

  const displayPopover = async (element: JSX.Element) => {
    setPopover(element);
    setShowPopover(true);

    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  const onClick = () => {
    // Plant
    if (!field.crop) {
      try {
        const {} = dispatcher({
          type: "crop.planted",
          index: field.fieldIndex,
          item: selectedItem,
        });

        displayPopover(
          <div className="flex items-center justify-center text-xs text-white text-shadow overflow-visible">
            <img
              src={ITEM_DETAILS[selectedItem as CropName].image}
              className="w-4 h-4 mr-1"
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
      dispatcher({
        type: "crop.harvested",
        index: field.fieldIndex,
      });
      incrementHarvestable(-1);

      displayPopover(
        <div className="flex items-center justify-center text-xs text-white text-shadow overflow-visible">
          <img
            src={ITEM_DETAILS[field.crop.name].image}
            className="w-4 h-4 mr-1"
          />
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
