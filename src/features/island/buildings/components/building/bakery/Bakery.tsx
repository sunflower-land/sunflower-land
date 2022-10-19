import React, { useContext, useState } from "react";
import bakery from "assets/buildings/bakery_building.png";
import classNames from "classnames";
import { ConsumableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { CraftingMachineChildProps } from "../WithCraftingMachine";
import { BuildingProps } from "../Building";
import { BakeryModal } from "./BakeryModal";
import { InventoryItemName } from "features/game/types/game";

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
        className="relative cursor-pointer hover:img-highlight"
        onClick={handleClick}
      >
        {ready && name && (
          <div className="flex justify-center absolute -top-7 w-full">
            <img src={ITEM_DETAILS[name].image} className="w-5 ready" />
          </div>
        )}
        <img
          src={bakery}
          className={classNames("w-full", {
            "opacity-100": !crafting,
            "opacity-80": crafting,
          })}
        />
      </div>

      <BakeryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCook={handleCook}
      />
    </>
  );
};
