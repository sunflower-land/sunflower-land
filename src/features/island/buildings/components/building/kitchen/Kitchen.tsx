import React, { useContext, useState } from "react";

import kitchen from "assets/buildings/kitchen.png";

import npc from "assets/npcs/chef.gif";
import doing from "assets/npcs/chef_doing.gif";
import shadow from "assets/npcs/shadow.png";

import { ConsumableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { InventoryItemName } from "features/game/types/game";
import { CraftingMachineChildProps } from "../WithCraftingMachine";
import { BuildingProps } from "../Building";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { KitchenModal } from "./KitchenModal";

type Props = BuildingProps & Partial<CraftingMachineChildProps>;

export const Kitchen: React.FC<Props> = ({
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

  const handleCook = (item: ConsumableName) => {
    craftingService?.send({
      type: "CRAFT",
      event: "recipe.cooked",
      item,
      buildingId,
    });
  };

  const handleCollect = () => {
    const context = craftingService?.state.context;
    const name = context?.name;
    if (!name) return;

    craftingService?.send({
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
    console.log({ idle });
    if (idle) {
      setShowModal(true);
      return;
    }

    if (crafting) {
      handleShowCraftingTimer && handleShowCraftingTimer();
      return;
    }

    if (ready) {
      handleCollect();
      return;
    }
  };

  return (
    <>
      <div
        className="relative cursor-pointer hover:img-highlight w-full h-full"
        onClick={handleClick}
      >
        {ready && name && (
          <img
            src={ITEM_DETAILS[name].image}
            className="absolute z-30 img-highlight-heavy"
            style={{
              // TODO - dynamically get correct width
              width: `${PIXEL_SCALE * 12}px`,
              bottom: `${PIXEL_SCALE * 8}px`,
              left: `${PIXEL_SCALE * 10}px`,
            }}
          />
        )}
        <img
          src={kitchen}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 55}px`,
            left: `${PIXEL_SCALE * 4.5}px`,
            bottom: `${PIXEL_SCALE * 3}px`,
          }}
        />
        {crafting && name && (
          <img
            src={ITEM_DETAILS[name].image}
            className="absolute z-30"
            style={{
              // TODO - dynamically get correct width
              width: `${PIXEL_SCALE * 12}px`,
              bottom: `${PIXEL_SCALE * 8}px`,
              left: `${PIXEL_SCALE * 10}px`,
            }}
          />
        )}
        {crafting ? (
          <img
            src={doing}
            className="absolute z-20"
            style={{
              width: `${PIXEL_SCALE * 16}px`,
              bottom: `${PIXEL_SCALE * 4}px`,
              right: `${PIXEL_SCALE * 24}px`,
              transform: "scaleX(-1)",
            }}
          />
        ) : (
          <img
            src={npc}
            className="absolute z-20"
            style={{
              width: `${PIXEL_SCALE * 16}px`,

              bottom: `${PIXEL_SCALE * 4}px`,
              right: `${PIXEL_SCALE * 24}px`,
              transform: "scaleX(-1)",
            }}
          />
        )}
        <img
          src={shadow}
          className="absolute z-10"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            right: `${PIXEL_SCALE * 25}px`,
          }}
        />
      </div>

      <KitchenModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCook={handleCook}
      />
    </>
  );
};
