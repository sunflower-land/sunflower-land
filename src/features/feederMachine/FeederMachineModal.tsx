import { useActor } from "@xstate/react";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { Modal } from "components/ui/Modal";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { AnimalFoodName, AnimalMedicineName } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import { getKeys } from "features/game/types/decorations";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { ANIMAL_FOODS } from "features/game/types/animals";

interface Props {
  show: boolean;
  onClose: () => void;
}

export const FeederMachineModal: React.FC<Props> = ({ show, onClose }) => {
  const { t } = useAppTranslation();
  const { gameService, shortcutItem } = useContext(Context);
  const [selectedName, setSelectedName] = useState<
    AnimalFoodName | AnimalMedicineName
  >("Hay");
  const { coins, ingredients } = ANIMAL_FOODS[selectedName];

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const onSelect = (item: AnimalFoodName | AnimalMedicineName) => {
    setSelectedName(item);
    shortcutItem(item);
  };

  const lessIngredients = (amount = 1) =>
    getKeys(ingredients).some((name) =>
      ingredients[name]?.mul(amount).greaterThan(state.inventory[name] || 0),
    );

  const lessFunds = (amount = 1) => {
    if (!coins) return;

    return state.coins < coins * amount;
  };

  const mix = (amount = 1) => {
    gameService.send("feed.mixed", {
      feed: selectedName,
      amount,
    });

    shortcutItem(selectedName);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <CloseButtonPanel
        onClose={onClose}
        container={OuterPanel}
        tabs={[
          { icon: ITEM_DETAILS.Hay.image, name: t("feederMachine.title") },
        ]}
      >
        <SplitScreenView
          panel={
            <CraftingRequirements
              gameState={state}
              details={{ item: selectedName }}
              requirements={{
                coins,
                resources: ingredients,
              }}
              actionView={
                <div className="flex space-x-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
                  <Button
                    disabled={lessFunds() || lessIngredients()}
                    onClick={() => mix()}
                  >
                    {t("mix.one")}
                  </Button>
                </div>
              }
            />
          }
          content={
            <>
              {getKeys(ANIMAL_FOODS).map((item) => {
                return (
                  <Box
                    key={item}
                    isSelected={selectedName === item}
                    onClick={() => onSelect(item)}
                    image={ITEM_DETAILS[item].image}
                    count={state.inventory[item]}
                  />
                );
              })}
            </>
          }
        />
      </CloseButtonPanel>
    </Modal>
  );
};
