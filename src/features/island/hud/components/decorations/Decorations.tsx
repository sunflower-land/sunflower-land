import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import {
  ShopDecorationName,
  HELIOS_DECORATIONS,
  Decoration,
} from "features/game/types/decorations";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { MachineInterpreter } from "features/game/expansion/placeable/landscapingMachine";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";

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

  const landscapingMachine = gameService.state.children
    .landscaping as MachineInterpreter;

  const buy = () => {
    landscapingMachine.send("SELECT", {
      action: "decoration.bought",
      placeable: selected.name,
      requirements: {
        sfl: selected.sfl,
        ingredients: selected.ingredients,
      },
      multiple: true,
    });

    onClose();
  };

  const lessFunds = () => {
    if (!price) return false;

    return state.balance.lessThan(price.toString());
  };

  const lessIngredients = () =>
    getKeys(selected.ingredients).some((name) =>
      selected.ingredients[name]?.greaterThan(inventory[name] || 0)
    );
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
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          details={{
            item: selected.name,
          }}
          requirements={{
            resources: selected.ingredients,
            sfl: price,
          }}
          actionView={
            <Button disabled={lessFunds() || lessIngredients()} onClick={buy}>
              Buy
            </Button>
          }
        />
      }
      content={
        <>
          {Object.values(HELIOS_DECORATIONS()).map((item: Decoration) => (
            <Box
              isSelected={selected.name === item.name}
              key={item.name}
              onClick={() => setSelectedName(item.name as ShopDecorationName)}
              image={ITEM_DETAILS[item.name].image}
              count={inventory[item.name]}
            />
          ))}
        </>
      }
    />
  );
};
