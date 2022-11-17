import React, { useContext, useState } from "react";

import deli from "assets/buildings/deli.png";
import artisian from "assets/npcs/artisian.gif";
import artisianDoing from "assets/npcs/artisian_doing.gif";
import shadow from "assets/npcs/shadow.png";

import { ConsumableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { CraftingMachineChildProps } from "../WithCraftingMachine";
import { BuildingProps } from "../Building";
import { InventoryItemName } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import { DeliModal } from "./DeliModal";
import { ClickableBuildingImage } from "../ClickableBuildingImage";

type Props = BuildingProps & Partial<CraftingMachineChildProps>;

export const Deli: React.FC<Props> = ({
  buildingId,
  crafting,
  idle,
  ready,
  name,
  craftingService,
  handleShowCraftingTimer,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { setToast } = useContext(ToastContext);

  if (!craftingService || !handleShowCraftingTimer)
    return <img src={deli} className="w-full" />;

  const handleCook = (item: ConsumableName) => {
    craftingService.send({
      type: "CRAFT",
      event: "recipe.cooked",
      item,
      buildingId,
    });
  };

  const handleCollect = () => {
    const { name } = craftingService.state.context;

    if (!name) return;

    craftingService.send({
      type: "COLLECT",
      item: name,
      event: "recipe.collected",
    });

    setToast({
      icon: ITEM_DETAILS[name as InventoryItemName].image,
      content: "+1",
    });
  };

  const handleClick = () => {
    if (idle) {
      setShowModal(true);
      return;
    }

    if (crafting) {
      handleShowCraftingTimer();
      return;
    }

    if (ready) {
      handleCollect();
      return;
    }
  };

  return (
    <>
      <ClickableBuildingImage
        className="relative cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 62}px`,
          height: `${PIXEL_SCALE * 54}px`,
        }}
        onClick={handleClick}
      >
        {ready && name && (
          <div className="flex justify-center absolute -top-7 w-full pointer-events-none">
            <img src={ITEM_DETAILS[name].image} className="w-5 ready" />
          </div>
        )}
        <img
          src={deli}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 62}px`,
            height: `${PIXEL_SCALE * 54}px`,
            left: `${PIXEL_SCALE * 1}px`,
            top: `${PIXEL_SCALE * -3}px`,
          }}
        />
        {crafting ? (
          <img
            src={artisianDoing}
            className="absolute z-20 pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 20}px`,
              right: `${PIXEL_SCALE * 1}px`,
              bottom: `${PIXEL_SCALE * 16.7}px`,
              transform: "scaleX(-1)",
            }}
          />
        ) : (
          <img
            src={artisian}
            className="absolute z-20 pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 16}px`,
              right: `${PIXEL_SCALE * 1}px`,
              bottom: `${PIXEL_SCALE * 16.7}px`,
              transform: "scaleX(-1)",
            }}
          />
        )}

        <img
          src={shadow}
          className="absolute z-10 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            right: `${PIXEL_SCALE * 2.5}px`,
            bottom: `${PIXEL_SCALE * 14.7}px`,
          }}
        />
        {name && (
          <img
            src={ITEM_DETAILS[name].image}
            className={classNames("absolute z-30 pointer-events-none", {
              "img-highlight-heavy": ready,
            })}
            style={{
              // TODO - dynamically get correct width
              width: `${PIXEL_SCALE * 12}px`,
              bottom: `${PIXEL_SCALE * 8.7}px`,
              right: `${PIXEL_SCALE * 8}px`,
            }}
          />
        )}
      </ClickableBuildingImage>

      <DeliModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCook={handleCook}
      />
    </>
  );
};
