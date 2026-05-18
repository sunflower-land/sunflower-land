import { useActor } from "@xstate/react";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { Modal } from "components/ui/Modal";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { AnimalFoodName, AnimalMedicineName } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useEffect, useState } from "react";
import { getKeys } from "lib/object";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { ANIMAL_FOODS, Feed, FeedType } from "features/game/types/animals";
import { Label } from "components/ui/Label";
import { getIngredients } from "./feedMixed";
import {
  AnimalFeedBuffName,
  InventoryItemName,
} from "features/game/types/game";
import { InventoryItemDetails } from "components/ui/layouts/InventoryItemDetails";

interface Props {
  show: boolean;
  onClose: () => void;
}

const FOOD_TYPE_TERMS = {
  food: "feeder.foodTypes.food",
  medicine: "feeder.foodTypes.medicine",
} as const;

const ANIMAL_FEED_BUFFS: AnimalFeedBuffName[] = ["Salt Lick", "Honey Treat"];

type Tab = "feederMachine" | "spices";

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
  const [selectedSpice, setSelectedSpice] =
    useState<AnimalFeedBuffName>("Honey Treat");
  const [tab, setTab] = useState<Tab>("feederMachine");
  const { coins } = ANIMAL_FOODS[selectedName];

  const { ingredients } = getIngredients({ state, name: selectedName });
  const spices = ANIMAL_FEED_BUFFS.filter((item) =>
    state.inventory[item]?.gt(0),
  );
  const hasSpices = spices.length > 0;
  const selectedSpiceItem = spices.includes(selectedSpice)
    ? selectedSpice
    : undefined;
  const nextAvailableSpice = selectedSpiceItem ?? spices[0];
  const activeTab = hasSpices ? tab : "feederMachine";

  useEffect(() => {
    if (tab !== "spices") {
      return;
    }

    const timeout = window.setTimeout(() => {
      if (!hasSpices) {
        setTab("feederMachine");
        shortcutItem(selectedName);
        return;
      }

      if (nextAvailableSpice && nextAvailableSpice !== selectedSpice) {
        setSelectedSpice(nextAvailableSpice);
        shortcutItem(nextAvailableSpice);
      }
    });

    return () => window.clearTimeout(timeout);
  }, [
    hasSpices,
    nextAvailableSpice,
    selectedName,
    selectedSpice,
    shortcutItem,
    tab,
  ]);

  const setActiveTab: React.Dispatch<React.SetStateAction<Tab>> = (nextTab) => {
    const resolvedTab =
      typeof nextTab === "function" ? nextTab(activeTab) : nextTab;

    if (resolvedTab === "spices" && !hasSpices) {
      shortcutItem(selectedName);
      setTab("feederMachine");
      return;
    }

    if (resolvedTab === "spices" && nextAvailableSpice) {
      setSelectedSpice(nextAvailableSpice);
      shortcutItem(nextAvailableSpice);
    }

    setTab(resolvedTab);
  };

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

  const onSelectSpice = (item: AnimalFeedBuffName) => {
    setSelectedSpice(item);
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
      item: selectedName,
      amount,
    });

    shortcutItem(selectedName);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <CloseButtonPanel
        onClose={onClose}
        container={OuterPanel}
        currentTab={activeTab}
        setCurrentTab={setActiveTab}
        tabs={[
          {
            id: "feederMachine",
            icon: ITEM_DETAILS.Hay.image,
            name: t("feederMachine.title"),
          },
          ...(hasSpices
            ? [
                {
                  id: "spices" as const,
                  icon: ITEM_DETAILS["Honey Treat"].image,
                  name: t("spices"),
                },
              ]
            : []),
        ]}
      >
        <SplitScreenView
          panel={
            activeTab === "spices" ? (
              selectedSpiceItem ? (
                <InventoryItemDetails
                  game={state}
                  details={{ item: selectedSpiceItem as InventoryItemName }}
                />
              ) : (
                <></>
              )
            ) : (
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
            )
          }
          content={
            <div className="flex flex-col">
              {activeTab === "spices" ? (
                <div className="flex flex-col">
                  <Label
                    type="default"
                    icon={ITEM_DETAILS["Honey Treat"].image}
                    className="mb-1"
                  >
                    {t("spices")}
                  </Label>
                  <div className="flex flex-wrap mb-2">
                    {spices.map((item) => (
                      <Box
                        key={item}
                        isSelected={selectedSpiceItem === item}
                        onClick={() => onSelectSpice(item)}
                        image={ITEM_DETAILS[item].image}
                        count={state.inventory[item]}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                Object.entries(groupedItems).map(([type, items]) => (
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
                ))
              )}
            </div>
          }
        />
      </CloseButtonPanel>
    </Modal>
  );
};
