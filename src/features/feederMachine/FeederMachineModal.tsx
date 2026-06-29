import { useActor } from "@xstate/react";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { Modal } from "components/ui/Modal";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import type {
  AnimalFoodName,
  AnimalMedicineName,
} from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import { getKeys } from "lib/object";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import Decimal from "decimal.js-light";
import {
  ANIMAL_FOODS,
  type Feed,
  type FeedType,
} from "features/game/types/animals";
import { Label } from "components/ui/Label";
import { getIngredients } from "./feedMixed";
import { getBulkMixRequirements } from "./getBulkMixRequirements";
import { formatNumber } from "lib/utils/formatNumber";

interface Props {
  show: boolean;
  onClose: () => void;
  building: "Hen House" | "Barn";
}

const FOOD_TYPE_TERMS = {
  food: "feeder.foodTypes.food",
  medicine: "feeder.foodTypes.medicine",
} as const;

export const FeederMachineModal: React.FC<Props> = ({
  show,
  onClose,
  building,
}) => {
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
  const {
    requests,
    missingRequests,
    requirements: bulkRequirements,
  } = getBulkMixRequirements(state, building);

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
    gameService.send("feed.mixed", {
      item: selectedName,
      amount,
    });

    shortcutItem(selectedName);
  };

  const hasBulkRequests = getKeys(missingRequests).length > 0;

  const hasEnoughBulkIngredients = getKeys(bulkRequirements.ingredients).every(
    (name) =>
      (state.inventory[name] ?? new Decimal(0)).gte(
        bulkRequirements.ingredients[name] ?? 0,
      ),
  );

  const hasEnoughBulkCoins = state.coins >= bulkRequirements.coins;

  const missingIngredients = getKeys(bulkRequirements.ingredients).reduce(
    (acc, ingredient) => {
      const required =
        bulkRequirements.ingredients[ingredient] ?? new Decimal(0);
      const available = state.inventory[ingredient] ?? new Decimal(0);
      const difference = required.sub(available);

      if (difference.lte(0)) {
        return acc;
      }

      acc[ingredient] = difference;
      return acc;
    },
    {} as Record<string, Decimal>,
  );

  const bulkMix = () => {
    getKeys(missingRequests).forEach((item) => {
      const amount = missingRequests[item]?.toNumber() ?? 0;

      if (amount <= 0) {
        return;
      }

      gameService.send("feed.mixed", {
        item,
        amount,
      });
    });

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
              <div className="flex flex-col mt-1">
                <Label type="default" className="mb-1">
                  {t("feeder.combinedRequests")}
                </Label>
                <div className="border border-[#2E2543] p-2 bg-[#dba072] min-h-[96px]">
                  <div className="flex flex-col gap-2">
                    {getKeys(requests).length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {getKeys(requests).map((item) => (
                          <Label
                            key={`${building}-${item}`}
                            icon={ITEM_DETAILS[item].image}
                            type="default"
                          >
                            {formatNumber(requests[item] ?? 0)}
                          </Label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs">
                        {t("feeder.noRequestsForBuilding")}
                      </p>
                    )}
                    <div className="flex flex-col gap-1 pt-1">
                      <Label type="warning">{t("feeder.needToMix")}</Label>
                      {hasBulkRequests ? (
                        <div className="flex flex-wrap gap-1">
                          {getKeys(missingRequests).map((item) => (
                            <Label
                              key={`missing-${item}`}
                              icon={ITEM_DETAILS[item].image}
                              type="default"
                            >
                              {formatNumber(missingRequests[item] ?? 0)}
                            </Label>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs">
                          {t("feeder.allRequestsCovered")}
                        </p>
                      )}
                    </div>
                    {getKeys(bulkRequirements.ingredients).length > 0 && (
                      <div className="flex flex-col gap-1 pt-1">
                        <Label type="default">
                          {t("feeder.ingredientsToMix")}
                        </Label>
                        <div className="flex flex-wrap gap-1">
                          {getKeys(bulkRequirements.ingredients).map(
                            (ingredient) => {
                              const item =
                                ingredient as keyof typeof ITEM_DETAILS;

                              return (
                                <Label
                                  key={`required-ingredient-${ingredient}`}
                                  icon={ITEM_DETAILS[item].image}
                                  type="default"
                                >
                                  {formatNumber(
                                    bulkRequirements.ingredients[ingredient] ??
                                      0,
                                  )}
                                </Label>
                              );
                            },
                          )}
                        </div>
                      </div>
                    )}
                    {getKeys(missingIngredients).length > 0 && (
                      <div className="flex flex-col gap-1 pt-1">
                        <Label type="danger">
                          {t("feeder.missingIngredients")}
                        </Label>
                        <div className="flex flex-wrap gap-1">
                          {getKeys(missingIngredients).map((ingredient) => {
                            const item =
                              ingredient as keyof typeof ITEM_DETAILS;

                            return (
                              <Label
                                key={`ingredient-${ingredient}`}
                                icon={ITEM_DETAILS[item].image}
                                type="default"
                              >
                                {formatNumber(
                                  missingIngredients[ingredient] ?? 0,
                                )}
                              </Label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <Button
                      disabled={
                        !hasBulkRequests ||
                        !hasEnoughBulkIngredients ||
                        !hasEnoughBulkCoins
                      }
                      onClick={bulkMix}
                    >
                      {t("feeder.mixAll")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </CloseButtonPanel>
    </Modal>
  );
};
