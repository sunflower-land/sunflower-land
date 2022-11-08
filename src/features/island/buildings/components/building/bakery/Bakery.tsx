import React, { useContext, useState } from "react";

import bakery from "assets/buildings/bakery.png";
import smoke from "assets/buildings/smoke.gif";
import goblinChef from "assets/npcs/goblin_chef.gif";
import shadow from "assets/npcs/shadow.png";

import { ConsumableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { CraftingMachineChildProps } from "../WithCraftingMachine";
import { BuildingProps } from "../Building";
import { BakeryModal } from "./BakeryModal";
import { InventoryItemName } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";

type Props = BuildingProps & Partial<CraftingMachineChildProps>;

export const Bakery: React.FC<Props> = ({
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
    return <img src={bakery} className="w-full" />;

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
      <div
        className="relative cursor-pointer hover:img-highlight w-full h-full"
        onClick={handleClick}
      >
        {ready && name && (
          <div className="flex justify-center absolute -top-7 w-full">
            <img src={ITEM_DETAILS[name].image} className="w-5 ready" />
          </div>
        )}
        <img
          src={bakery}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 62}px`,
            left: `${PIXEL_SCALE * 1}px`,
            top: `${PIXEL_SCALE * -3}px`,
          }}
        />
        <img
          src={goblinChef}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 22}px`,
            left: `${PIXEL_SCALE * 32}px`,
            bottom: `${PIXEL_SCALE * 3}px`,
            transform: "scaleX(-1)",
          }}
        />
        <img
          src={shadow}
          className="absolute z-10"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            left: `${PIXEL_SCALE * 33}px`,
            bottom: `${PIXEL_SCALE * 1}px`,
          }}
        />
        {crafting && (
          <img
            src={smoke}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 20}px`,
              left: `${PIXEL_SCALE * 9}px`,
              bottom: `${PIXEL_SCALE * 44}px`,
            }}
          />
        )}

        {name && (
          <img
            src={ITEM_DETAILS[name].image}
            className={classNames("absolute z-30", {
              "img-highlight-heavy": ready,
            })}
            style={{
              // TODO - dynamically get correct width
              width: `${PIXEL_SCALE * 12}px`,
              bottom: `${PIXEL_SCALE * 4.5}px`,
              left: `${PIXEL_SCALE * 14.5}px`,
            }}
          />
        )}
      </div>

      <BakeryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCook={handleCook}
      />
    </>
  );
};
