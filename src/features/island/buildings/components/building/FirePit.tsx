import React, { useContext, useState } from "react";

import firePit from "assets/buildings/fire_pit.png";
import classNames from "classnames";
import { FirePitModal } from "./firePit/FirePitModal";
import { ConsumableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { CraftingMachineChildProps } from "./WithCraftingMachine";

export const FirePit: React.FC<CraftingMachineChildProps> = ({
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

  if (!craftingService || !handleShowCraftingTimer) return <></>;

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
      icon: ITEM_DETAILS[name].image,
      content: "+1",
    });
  };

  const handleClick = () => {
    if (idle) {
      return setShowModal(true);
    }

    if (crafting) {
      console.log("isCrafting");
      console.log(handleShowCraftingTimer);
      handleShowCraftingTimer();
    }

    if (ready) {
      handleCollect();
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
          src={firePit}
          className={classNames("w-full", {
            "opacity-100": !crafting,
            "opacity-80": crafting,
          })}
        />
      </div>

      <FirePitModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCook={handleCook}
      />
    </>
  );
};
