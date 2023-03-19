import React, { useContext, useState } from "react";
import classNames from "classnames";
import { useActor } from "@xstate/react";

import token from "assets/icons/token_2.png";
import tokenStatic from "assets/icons/token_2.png";
import lock from "assets/skills/lock.png";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Decimal } from "decimal.js-light";
import { Stock } from "components/ui/Stock";
import { INITIAL_STOCK, PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";
import { Restock } from "features/island/buildings/components/building/market/Restock";
import { BuildingName, BUILDINGS } from "features/game/types/buildings";

interface Props {
  onClose: () => void;
}

type EquipmentName = BuildingName;
const EQUIPMENT = {
  ...BUILDINGS(),
};

export const Equipment: React.FC<Props> = ({ onClose }) => {
  const [selectedName, setSelectedName] = useState<EquipmentName>("Workbench");

  const selected = EQUIPMENT[selectedName];
  const { setToast } = useContext(ToastContext);
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const inventory = state.inventory;
  const collectibles = state.collectibles;

  const price = selected[0].sfl;

  const buy = (amount = 1) => {
    gameService.send("seed.bought", {
      item: selectedName,
      amount,
    });

    setToast({
      icon: tokenStatic,
      content: `-${price?.mul(amount).toString()}`,
    });

    shortcutItem(selectedName);
  };

  const lessFunds = (amount = 1) => {
    if (!price) return false;

    return state.balance.lessThan(price.mul(amount).toString());
  };

  const stock = state.stock[selectedName] || new Decimal(0);

  const labelState = () => {
    const max = INITIAL_STOCK(state)[selectedName];
    const inventoryCount = inventory[selectedName] ?? new Decimal(0);
    const inventoryFull = max ? inventoryCount.gt(max) : true;

    if (stock?.equals(0)) {
      return (
        <Label type="danger" className="-mt-2 mb-1">
          Sold out
        </Label>
      );
    }
    return (
      <Stock item={{ name: selectedName }} inventoryFull={inventoryFull} />
    );
  };

  const Action = () => {
    if (stock?.equals(0)) {
      return <Restock onClose={onClose} />;
    }

    const max = INITIAL_STOCK(state)[selectedName];

    if (max && inventory[selectedName]?.gt(max)) {
      return (
        <div className="my-1">
          <p className="text-xxs text-center">
            You have too many seeds in your basket!
          </p>
        </div>
      );
    }

    return (
      <div className="flex space-x-1 w-full sm:flex-col sm:space-x-0 sm:space-y-1">
        <Button
          disabled={lessFunds() || stock?.lessThan(1)}
          className="text-xxs sm:text-xs"
          onClick={() => buy(1)}
        >
          Craft
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <div className="w-full max-h-48 sm:max-h-96 sm:w-3/5 h-fit overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap">
        {getKeys(EQUIPMENT).map((name: EquipmentName) => (
          <Box
            isSelected={selectedName === name}
            key={name}
            onClick={() => setSelectedName(name)}
            image={ITEM_DETAILS[name].image}
            overlayIcon={
              <img
                src={lock}
                alt="locked"
                className="relative object-contain"
                style={{
                  width: `${PIXEL_SCALE * 12}px`,
                }}
              />
            }
            count={inventory[name]}
          />
        ))}
      </div>
      <OuterPanel className="w-full flex-1 flex flex-col">
        <div className="flex flex-col justify-center items-start sm:items-center p-2 pb-0 relative">
          {labelState()}
          <div className="flex space-x-2 items-center mt-1 sm:flex-col-reverse md:space-x-0">
            <img
              src={ITEM_DETAILS[selectedName].image}
              className="w-5 sm:w-8 sm:my-1"
              alt={selectedName}
            />
            <span className="text-center mb-1">{selectedName}</span>
          </div>
          <div className="border-t border-white w-full my-2 pt-2 flex justify-between sm:flex-col sm:space-y-2 sm:items-center">
            <div className="flex space-x-1 justify-center items-center">
              <img src={token} className="h-4 sm:h-5" />
              <span
                className={classNames("text-xs text-center", {
                  "text-red-500": lessFunds(),
                })}
              >
                {price.equals(0) ? `Free` : `${price}`}
              </span>
            </div>
          </div>
        </div>
        {Action()}
      </OuterPanel>
    </div>
  );
};
