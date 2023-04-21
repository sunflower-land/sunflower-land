import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import { Box } from "components/ui/Box";
import { Context } from "features/game/GameProvider";
import { CollectibleName, getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { Decimal } from "decimal.js-light";
import { Bean, BeanName, BEANS } from "features/game/types/beans";
import { Button } from "components/ui/Button";
import { CONFIG } from "lib/config";
import { INITIAL_STOCK } from "features/game/lib/constants";
import { Restock } from "features/island/buildings/components/building/market/Restock";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";

interface Props {
  onClose: () => void;
}

export const ExoticSeeds: React.FC<Props> = ({ onClose }) => {
  const [selected, setSelected] = useState<Bean>(BEANS()["Magic Bean"]);
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;
  const collectibles = state.collectibles;

  const price = selected.sfl;

  const lessFunds = () => {
    if (!price) return false;

    return state.balance.lessThan(price.toString());
  };

  const lessIngredients = () => {
    return getKeys(selected.ingredients).some((name) =>
      selected.ingredients[name]?.greaterThan(inventory[name] || 0)
    );
  };
  getKeys(selected.ingredients).some((name) =>
    selected.ingredients[name]?.greaterThan(inventory[name] || 0)
  );

  const buy = () => {
    gameService.send("bean.bought", {
      bean: selected.name,
    });

    shortcutItem(selected.name);
  };

  const getInventoryItemCount = (name: BeanName) => {
    return inventory[name]?.sub(
      collectibles[name as CollectibleName]?.length ?? 0
    );
  };
  const stock = state.stock[selected.name] ?? new Decimal(0);
  const max = INITIAL_STOCK(state)[selected.name];
  const inventoryFull = max
    ? (getInventoryItemCount(selected.name) ?? new Decimal(0)).gt(max)
    : true;

  const Action = () => {
    if (stock?.equals(0)) {
      return <Restock onClose={onClose} />;
    }

    if (inventoryFull) {
      return (
        <span className="text-xxs text-center my-1">
          {`Max ${max} ${selected.name}s`}
        </span>
      );
    }

    if (CONFIG.NETWORK === "mainnet" || selected.name !== "Magic Bean") {
      return <span className="text-xxs text-center my-1">Coming soon</span>;
    }

    return (
      <Button
        disabled={
          lessFunds() ||
          lessIngredients() ||
          stock?.lessThan(1) ||
          inventoryFull
        }
        onClick={buy}
      >
        Buy 1
      </Button>
    );
  };

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          stock={stock}
          details={{
            item: selected.name,
          }}
          requirements={{
            resources: selected.ingredients,
            sfl: price,
            timeSeconds: selected.plantSeconds,
          }}
          actionView={Action()}
        />
      }
      content={
        <>
          {Object.values(BEANS()).map((item: Bean) => (
            <Box
              isSelected={selected.name === item.name}
              key={item.name}
              onClick={() => setSelected(item)}
              image={ITEM_DETAILS[item.name].image}
              count={getInventoryItemCount(item.name)}
            />
          ))}
        </>
      }
    />
  );
};
