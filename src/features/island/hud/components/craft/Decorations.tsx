import React, { useContext, useState } from "react";
import classNames from "classnames";
import { useActor } from "@xstate/react";

import token from "assets/icons/token_2.png";
import lock from "assets/skills/lock.png";

import {
  ShopDecorationName,
  HELIOS_DECORATIONS,
} from "features/game/types/decorations";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  onClose: () => void;
}

const DECORATIONS = {
  ...HELIOS_DECORATIONS(),
};

export const Decorations: React.FC<Props> = ({ onClose }) => {
  const [selectedName, setSelectedName] =
    useState<ShopDecorationName>("Basic Bear");

  const selected = HELIOS_DECORATIONS()[selectedName];
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

  const price = selected.sfl;

  const buy = () => {
    gameService.send("LANDSCAPE", {
      placeable: selected.name,
      action: "decoration.bought",
      requirements: {
        sfl: price,
        ingredients: selected.ingredients,
      },
    });
    onClose();
  };

  const lessFunds = (amount = 1) => {
    if (!price) return false;

    return state.balance.lessThan(price.mul(amount).toString());
  };

  const Action = () => {
    return (
      <div className="flex space-x-1 w-full sm:flex-col sm:space-x-0 sm:space-y-1">
        <Button
          disabled={lessFunds()}
          className="text-xxs sm:text-xs"
          onClick={() => buy()}
        >
          Craft
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <div className="w-full max-h-48 sm:max-h-96 sm:w-3/5 h-fit overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap">
        {getKeys(DECORATIONS).map((name: ShopDecorationName) => (
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
                {price?.equals(0) ? `Free` : `${price}`}
              </span>
            </div>
          </div>
        </div>
        {Action()}
      </OuterPanel>
    </div>
  );
};
