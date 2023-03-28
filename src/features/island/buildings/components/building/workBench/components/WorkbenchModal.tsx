import React, { SyntheticEvent, useContext, useState } from "react";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";
import { Modal } from "react-bootstrap";

import token from "assets/icons/token_2.png";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";

import { WorkbenchToolName, WORKBENCH_TOOLS } from "features/game/types/tools";
import { getKeys } from "features/game/types/craftables";
import { acknowledgeTutorial, hasShownTutorial } from "lib/tutorial";
import { Tutorial } from "./Tutorial";
import { Equipped } from "features/game/types/bumpkin";
import { Restock } from "features/island/buildings/components/building/market/Restock";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { makeBulkBuyAmount } from "../../market/lib/makeBulkBuyAmount";

interface Props {
  isOpen: boolean;
  onClose: (e?: SyntheticEvent) => void;
}

export const WorkbenchModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedName, setSelectedName] = useState<WorkbenchToolName>("Axe");
  const { setToast } = useContext(ToastContext);
  const { gameService, shortcutItem } = useContext(Context);
  const [showTutorial, setShowTutorial] = useState<boolean>(
    !hasShownTutorial("Workbench")
  );

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const bumpkinParts: Partial<Equipped> = {
    body: "Light Brown Farmer Potion",
    hair: "Blacksmith Hair",
    pants: "Lumberjack Overalls",
    shirt: "SFL T-Shirt",
    tool: "Hammer",
    background: "Farm Background",
    shoes: "Brown Boots",
  };

  const acknowledge = () => {
    acknowledgeTutorial("Workbench");
    setShowTutorial(false);
  };

  if (showTutorial) {
    return (
      <Modal show={isOpen} onHide={acknowledge} centered>
        <Tutorial onClose={acknowledge} bumpkinParts={bumpkinParts} />
      </Modal>
    );
  }

  const selected = WORKBENCH_TOOLS()[selectedName];
  const inventory = state.inventory;

  const price = selected.sfl;

  const lessIngredients = (amount = 1) =>
    getKeys(selected.ingredients).some((name) =>
      selected.ingredients[name]?.mul(amount).greaterThan(inventory[name] || 0)
    );

  const lessFunds = (amount = 1) => {
    if (!price) return;

    return state.balance.lessThan(price.mul(amount));
  };

  const onToolClick = (toolName: WorkbenchToolName) => {
    setSelectedName(toolName);
    shortcutItem(toolName);
  };

  const craft = (event: SyntheticEvent, amount: number) => {
    event.stopPropagation();
    gameService.send("tool.crafted", {
      tool: selectedName,
      amount,
    });

    setToast({
      icon: token,
      content: `-${price?.mul(amount)}`,
    });

    getKeys(selected.ingredients).map((name) => {
      const item = ITEM_DETAILS[name];
      setToast({
        icon: item.image,
        content: `-${selected.ingredients[name]?.mul(amount)}`,
      });
    });

    shortcutItem(selectedName);
  };

  const stock = state.stock[selectedName] || new Decimal(0);

  const bulkToolCraftAmount = makeBulkBuyAmount(stock);

  const Action = () => {
    if (stock?.equals(0)) {
      return <Restock onClose={onClose}></Restock>;
    }

    return (
      <div className="flex space-x-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
        <Button
          disabled={lessFunds() || lessIngredients() || stock?.lessThan(1)}
          onClick={(e) => craft(e, 1)}
        >
          Craft 1
        </Button>
        {bulkToolCraftAmount > 1 && (
          <Button
            disabled={lessFunds() || lessIngredients() || stock?.lessThan(1)}
            onClick={(e) => craft(e, bulkToolCraftAmount)}
          >
            Craft {bulkToolCraftAmount}
          </Button>
        )}
      </div>
    );
  };

  return (
    <Modal centered show={isOpen} onHide={onClose}>
      <CloseButtonPanel
        bumpkinParts={bumpkinParts}
        onClose={onClose}
        tabs={[{ icon: SUNNYSIDE.icons.hammer, name: "Tools" }]}
      >
        <SplitScreenView
          panel={
            <CraftingRequirements
              gameState={state}
              stock={stock}
              details={{
                item: selectedName,
              }}
              requirements={{
                sfl: price,
                resources: selected.ingredients,
              }}
              actionView={Action()}
            />
          }
          content={
            <>
              {getKeys(WORKBENCH_TOOLS()).map((toolName) => (
                <Box
                  isSelected={selectedName === toolName}
                  key={toolName}
                  onClick={() => onToolClick(toolName)}
                  image={ITEM_DETAILS[toolName].image}
                  count={inventory[toolName]}
                />
              ))}
            </>
          }
        />
      </CloseButtonPanel>
    </Modal>
  );
};
