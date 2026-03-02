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
import { ANIMAL_FOODS, Feed, FeedType } from "features/game/types/animals";
import { Label } from "components/ui/Label";
import { getIngredients } from "./feedMixed";

interface Props {
  show: boolean;
  onClose: () => void;
}

const FOOD_TYPE_TERMS = {
  food: "feeder.foodTypes.food",
  medicine: "feeder.foodTypes.medicine",
} as const;

export const FeederMachineModal: React.FC<Props> = ({ show, onClose }) => {
  const { t } = useAppTranslation();
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const [selectedName, setSelectedName] = useState<
    AnimalFoodName | AnimalMedicineName
  >("Hay");
  const { coins } = ANIMAL_FOODS[selectedName];

  const { ingredients } = getIngredients({ state, name: selectedName });

  const groupedItems = getKeys(ANIMAL_FOODS).reduce(
    (acc, item) => {
      const type = ANIMAL_FOODS[item].type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(ANIMAL_FOODS[item]);
      return acc;
    },
    {} as Record<FeedType, Feed[]>,
  );

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
    gameService.send({ type: "feed.mixed", item: selectedName, amount });

    shortcutItem(selectedName);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <CloseButtonPanel
        onClose={onClose}
        container={OuterPanel}
        tabs={[
          {
            id: "feederMachine",
            icon: ITEM_DETAILS.Hay.image,
            name: t("feederMachine.title"),
          },
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
                  <Button
                    disabled={lessFunds(10) || lessIngredients(10)}
                    onClick={() => mix(10)}
                  >
                    {t("mix.ten")}
                  </Button>
                </div>
              }
            />
          }
          content={
            <div className="flex flex-col">
              {Object.entries(groupedItems).map(([type, items]) => (
                <div key={type} className="flex flex-col">
                  <Label type="default" className="mb-1">
                    {t(FOOD_TYPE_TERMS[type as FeedType])}
                  </Label>
                  <div className="flex flex-wrap mb-2">
                    {items.map((item) => (
                      <Box
                        key={item.name}
                        isSelected={selectedName === item.name}
                        onClick={() => onSelect(item.name)}
                        image={ITEM_DETAILS[item.name].image}
                        count={state.inventory[item.name]}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          }
        />
      </CloseButtonPanel>
    </Modal>
  );
};
