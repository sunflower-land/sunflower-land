import { useActor } from "@xstate/react";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { Modal } from "components/ui/Modal";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import type {
  AnimalFoodName,
  AnimalMedicineName,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import { getKeys } from "lib/object";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { Button } from "components/ui/Button";
import { ButtonPanel, OuterPanel } from "components/ui/Panel";
import { SquareIcon } from "components/ui/SquareIcon";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getWearableImage } from "features/game/lib/getWearableImage";
import Decimal from "decimal.js-light";
import {
  ANIMAL_FOODS,
  type AnimalType,
  type Feed,
  type FeedType,
} from "features/game/types/animals";
import { Label } from "components/ui/Label";
import { getIngredients } from "./feedMixed";
import { getBulkMixRequirements } from "./getBulkMixRequirements";
import { formatNumber } from "lib/utils/formatNumber";
import { hasFeatureAccess } from "lib/flags";

interface Props {
  show: boolean;
  onClose: () => void;
  building: "Hen House" | "Barn";
}

type BulkMixItem = AnimalFoodName | AnimalMedicineName;

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
  const { gameService, shortcutItem, shortcutItems } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const [selectedName, setSelectedName] = useState<
    AnimalFoodName | AnimalMedicineName
  >("Hay");
  const [tab, setTab] = useState<"food" | "automaticMixer">("food");
  const { coins } = ANIMAL_FOODS[selectedName];

  const showBulkMixer = hasFeatureAccess(state, "BULK_MIXER");

  const { ingredients } = getIngredients({ state, name: selectedName });
  const { requests, feeds, animalsWaiting, freeFeedBoosts } =
    getBulkMixRequirements(state, building);

  // Feeds that still need mixing become toggleable cards; fully-covered feeds
  // are shown as informational rows.
  const mixableFeeds = feeds.filter((feed) => feed.missing.gt(0));
  const coveredFeeds = feeds.filter((feed) => feed.missing.lte(0));

  // Track which feeds the player has toggled OFF. Everything mixable is
  // selected by default, so storing only the deselections keeps the default
  // in sync as requests change without a state-resetting effect.
  const [deselectedFeeds, setDeselectedFeeds] = useState<
    Partial<Record<BulkMixItem, boolean>>
  >({});

  const isFeedSelected = (item: BulkMixItem) => !deselectedFeeds[item];
  const toggleFeed = (item: BulkMixItem) =>
    setDeselectedFeeds((prev) => ({ ...prev, [item]: !prev[item] }));

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

  const hasFeedRequests = getKeys(requests).length > 0;
  const hasMixableFeeds = mixableFeeds.length > 0;
  // Requests exist, but the player's inventory already covers every one.
  const allCovered = hasFeedRequests && !hasMixableFeeds;
  // No requests because a boost feeds/cures these animals for free.
  const freeFeeding = !hasFeedRequests && freeFeedBoosts.length > 0;
  // A wearable (Oracle Syringe) is curing sick animals for free.
  const curesSickForFree = freeFeedBoosts.some(
    (boost) => boost.source === "wearable",
  );

  const freeFeedLabel = (animalType: AnimalType) => {
    switch (animalType) {
      case "Chicken":
        return t("feeder.freeFeed.Chicken");
      case "Cow":
        return t("feeder.freeFeed.Cow");
      case "Sheep":
        return t("feeder.freeFeed.Sheep");
    }
  };

  // The calm "nothing to do" summary shared by the covered (3a) and
  // free-feeding (4a) states: green status, two lines, muted button.
  const renderCalmPanel = (
    label: string,
    primary: string,
    secondary: string,
  ) => (
    <>
      <div className="flex flex-col gap-2 px-1 pt-1">
        <Label type="success">{label}</Label>
        <p className="text-xs">{primary}</p>
        <p className="text-xxs">{secondary}</p>
      </div>
      <div className="mt-auto w-full">
        <Button disabled>{t("feeder.nothingToMix")}</Button>
      </div>
    </>
  );

  // Covered feeds are informational rows. Keep the confirmation icon in the
  // same leading slot used by selectable feed cards so the list stays aligned.
  const renderCoveredRow = (feed: (typeof coveredFeeds)[number]) => (
    <div key={`covered-${feed.item}`} className="flex items-center gap-2 px-2">
      <img
        src={SUNNYSIDE.icons.confirm}
        alt=""
        className="flex-none"
        style={{
          width: `${PIXEL_SCALE * 8}px`,
          height: `${PIXEL_SCALE * 8}px`,
          imageRendering: "pixelated",
        }}
      />
      <SquareIcon icon={ITEM_DETAILS[feed.item].image} width={9} />
      <div className="flex flex-col flex-1">
        <span className="text-xs">{feed.item}</span>
        <span className="text-xxs">{t("feeder.coveredByInventory")}</span>
      </div>
      <span className="text-xxs">
        {`${formatNumber(feed.inInventory)}/${formatNumber(feed.requested)}`}
      </span>
    </div>
  );

  const getFeedIngredientShortfalls = (feed: (typeof mixableFeeds)[number]) =>
    getKeys(feed.ingredients).reduce(
      (shortfalls, ingredient) => {
        const required = feed.ingredients[ingredient] ?? new Decimal(0);
        const available = state.inventory[ingredient] ?? new Decimal(0);
        const shortfall = required.sub(available);

        if (shortfall.gt(0)) {
          shortfalls[ingredient] = shortfall;
        }

        return shortfalls;
      },
      {} as GameState["inventory"],
    );

  // A feed with insufficient ingredients is shown for planning, but cannot be
  // selected because the bulk action cannot produce it yet.
  const canMixFeed = (feed: (typeof mixableFeeds)[number]) =>
    getKeys(getFeedIngredientShortfalls(feed)).length === 0;

  // Only feasible feeds the player has left selected contribute to the mix.
  const selectedFeeds = mixableFeeds.filter(
    (feed) => canMixFeed(feed) && isFeedSelected(feed.item),
  );

  // Sum the ingredients required across every selected feed.
  const selectedIngredients = selectedFeeds.reduce(
    (acc, feed) => {
      getKeys(feed.ingredients).forEach((ingredient) => {
        acc[ingredient] = (acc[ingredient] ?? new Decimal(0)).add(
          feed.ingredients[ingredient] ?? new Decimal(0),
        );
      });
      return acc;
    },
    {} as GameState["inventory"],
  );

  const selectedCoins = selectedFeeds.reduce(
    (total, feed) => total + feed.coins,
    0,
  );

  const mixCount = selectedFeeds.reduce(
    (total, feed) => total + feed.missing.toNumber(),
    0,
  );

  // Ingredients where the player is short of what the selection requires.
  const ingredientShortfalls = getKeys(selectedIngredients).reduce(
    (acc, ingredient) => {
      const need = selectedIngredients[ingredient] ?? new Decimal(0);
      const have = state.inventory[ingredient] ?? new Decimal(0);
      const short = need.sub(have);

      if (short.gt(0)) {
        acc[ingredient] = short;
      }
      return acc;
    },
    {} as GameState["inventory"],
  );

  const hasShortfall = getKeys(ingredientShortfalls).length > 0;
  const hasEnoughCoins = state.coins >= selectedCoins;
  const nothingSelected = mixCount === 0;
  const blocked = nothingSelected || hasShortfall || !hasEnoughCoins;

  const formatIngredientList = (list: GameState["inventory"]) =>
    getKeys(list)
      .map(
        (ingredient) => `${formatNumber(list[ingredient] ?? 0)} ${ingredient}`,
      )
      .join(", ");

  const missingMessage = nothingSelected
    ? t("feeder.nothingToMix")
    : t("feeder.missingIngredientsSummary", {
        ingredients: formatIngredientList(ingredientShortfalls),
      });

  const bulkMix = () => {
    const mixedItems = selectedFeeds.map((feed) => feed.item);

    selectedFeeds.forEach((feed) => {
      gameService.send("feed.mixed", {
        item: feed.item,
        amount: feed.missing.toNumber(),
      });
    });

    if (mixedItems.length === 1) {
      shortcutItem(mixedItems[0]);
      return;
    }

    shortcutItems(mixedItems as InventoryItemName[], { activateFirst: false });
  };

  return (
    <Modal show={show} onHide={onClose}>
      <CloseButtonPanel
        onClose={onClose}
        container={OuterPanel}
        tabs={[
          {
            id: "food",
            icon: ITEM_DETAILS.Hay.image,
            name: t("feeder.foodTypes.food"),
          },
          ...(showBulkMixer
            ? [
                {
                  id: "automaticMixer" as const,
                  icon: ITEM_DETAILS["Mixed Grain"].image,
                  name: t("feeder.bulkMixer"),
                },
              ]
            : []),
        ]}
        currentTab={tab}
        setCurrentTab={setTab}
      >
        {tab === "food" && (
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
        )}
        {tab === "automaticMixer" && showBulkMixer && (
          <SplitScreenView
            mobileReversePanelOrder
            panel={
              <div className="flex flex-col gap-2 sm:min-h-[19.5rem] w-full">
                {freeFeeding ? (
                  renderCalmPanel(
                    t("feeder.freeFeedingActive"),
                    t("feeder.freeFeedingDescription", { building }),
                    t("feeder.freeFeedingWakeUp"),
                  )
                ) : allCovered ? (
                  renderCalmPanel(
                    t("feeder.allRequestsCoveredLabel"),
                    t("feeder.canFeedAnimals", { count: animalsWaiting }),
                    t("feeder.headToBuildingToFeed", { building }),
                  )
                ) : (
                  <>
                    {getKeys(selectedIngredients).length > 0 && (
                      <div className="flex flex-col gap-1 px-1 pt-1">
                        <Label type="default">{t("feeder.mixSummary")}</Label>
                        <div className="flex flex-col gap-1">
                          {getKeys(selectedIngredients).map((ingredient) => {
                            const need =
                              selectedIngredients[ingredient] ?? new Decimal(0);
                            const have =
                              state.inventory[ingredient] ?? new Decimal(0);
                            const short = have.lessThan(need);
                            const amounts = `${formatNumber(
                              have,
                            )}/${formatNumber(need)}`;

                            return (
                              <div
                                key={`summary-${ingredient}`}
                                className="flex items-center justify-between gap-2"
                              >
                                <div className="flex items-center gap-1">
                                  <SquareIcon
                                    icon={ITEM_DETAILS[ingredient].image}
                                    width={7}
                                  />
                                  <span className="text-xs">{ingredient}</span>
                                </div>
                                {short ? (
                                  <Label type="danger">{amounts}</Label>
                                ) : (
                                  <span className="text-xs">{amounts}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {hasFeedRequests && (nothingSelected || hasShortfall) && (
                      <div className="flex flex-col gap-1 px-1">
                        <Label type="danger">{missingMessage}</Label>
                      </div>
                    )}

                    <div className="mt-auto w-full">
                      <Button disabled={blocked} onClick={bulkMix}>
                        {t("feeder.mixSelected", { count: mixCount })}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            }
            content={
              <div className="flex flex-col gap-2 p-1 sm:min-h-[19.5rem] w-full">
                {freeFeeding ? (
                  <>
                    <Label type="default">{t("feeder.noMixingNeeded")}</Label>
                    <div className="flex flex-col gap-2">
                      {freeFeedBoosts.map((boost) => (
                        <div
                          key={boost.item}
                          className="flex items-center gap-2"
                        >
                          <SquareIcon
                            icon={
                              boost.source === "collectible"
                                ? ITEM_DETAILS[boost.item].image
                                : getWearableImage(boost.item)
                            }
                            width={9}
                          />
                          <div className="flex flex-col flex-1 gap-1">
                            <span className="text-xs">{boost.item}</span>
                            <Label type="info">
                              {boost.source === "collectible"
                                ? freeFeedLabel(boost.animalType)
                                : t("feeder.freeCureLabel")}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Barn Delight footnote only applies when sick animals
                        aren't already being cured for free. */}
                    {!curesSickForFree && (
                      <p className="text-xxs">
                        {t("feeder.freeFeedSickFootnote")}
                      </p>
                    )}
                  </>
                ) : !hasFeedRequests ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs">
                      {t("feeder.noRequestsForBuilding")}
                    </p>
                    <p className="text-xs">
                      {t("feeder.bulkMixerEmptyDescription")}
                    </p>
                  </div>
                ) : (
                  <>
                    <Label type="default">
                      {allCovered
                        ? t("feeder.feedRequests")
                        : t("feeder.chooseWhatToMix")}
                    </Label>

                    {hasMixableFeeds && (
                      <div className="flex flex-col gap-2">
                        {mixableFeeds.map((feed) => {
                          const feedIngredientShortfalls =
                            getFeedIngredientShortfalls(feed);
                          const feedCanBeMixed =
                            getKeys(feedIngredientShortfalls).length === 0;
                          const selected = isFeedSelected(feed.item);
                          const ingredientList = formatIngredientList(
                            feed.ingredients,
                          );
                          const needsText = feedCanBeMixed
                            ? feed.type === "medicine"
                              ? t("feeder.medicineFeedNeeds", {
                                  ingredients: ingredientList,
                                })
                              : t("feeder.feedNeeds", {
                                  ingredients: ingredientList,
                                })
                            : t("feeder.feedMissing", {
                                ingredients: formatIngredientList(
                                  feedIngredientShortfalls,
                                ),
                              });

                          if (!feedCanBeMixed) {
                            return (
                              <ButtonPanel
                                key={feed.item}
                                variant="card"
                                className="flex items-center gap-2"
                              >
                                <div
                                  className="flex-none"
                                  style={{
                                    width: `${PIXEL_SCALE * 8}px`,
                                    height: `${PIXEL_SCALE * 8}px`,
                                  }}
                                />
                                <SquareIcon
                                  icon={ITEM_DETAILS[feed.item].image}
                                  width={9}
                                />
                                <div className="flex flex-col">
                                  <span className="text-xs">
                                    {`${feed.item} x${formatNumber(feed.missing)}`}
                                  </span>
                                  <span className="text-xxs text-red-500">
                                    {needsText}
                                  </span>
                                </div>
                              </ButtonPanel>
                            );
                          }

                          return (
                            <ButtonPanel
                              key={feed.item}
                              variant="card"
                              selected={selected}
                              onClick={() => toggleFeed(feed.item)}
                              className="flex items-center gap-2"
                            >
                              <div
                                className="flex items-center justify-center flex-none"
                                style={{
                                  width: `${PIXEL_SCALE * 8}px`,
                                  height: `${PIXEL_SCALE * 8}px`,
                                }}
                              >
                                {selected && (
                                  <img
                                    src={SUNNYSIDE.icons.confirm}
                                    alt=""
                                    className="w-full h-full"
                                    style={{ imageRendering: "pixelated" }}
                                  />
                                )}
                              </div>
                              <SquareIcon
                                icon={ITEM_DETAILS[feed.item].image}
                                width={9}
                              />
                              <div className="flex flex-col">
                                <span className="text-xs">
                                  {`${feed.item} x${formatNumber(feed.missing)}`}
                                </span>
                                <span className="text-xxs">{needsText}</span>
                              </div>
                            </ButtonPanel>
                          );
                        })}
                      </div>
                    )}

                    {coveredFeeds.length > 0 && (
                      <div className="flex flex-col gap-2">
                        {coveredFeeds.map(renderCoveredRow)}
                      </div>
                    )}
                  </>
                )}
              </div>
            }
          />
        )}
      </CloseButtonPanel>
    </Modal>
  );
};
