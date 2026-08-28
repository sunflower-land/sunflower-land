import { useSelector } from "@xstate/react";
import { useNow } from "lib/utils/hooks/useNow";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { Modal } from "components/ui/Modal";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import type {
  AnimalFeedBuffName,
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
import { Checkbox } from "components/ui/Checkbox";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SmallBox } from "components/ui/SmallBox";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { getWearableImage } from "features/game/lib/getWearableImage";
import Decimal from "decimal.js-light";
import {
  ANIMAL_FOODS,
  type AnimalType,
  type Feed,
  type FeedType,
} from "features/game/types/animals";
import { Label } from "components/ui/Label";
import { getIngredients, getMaxFeedMixAmount } from "./feedMixed";
import { InventoryItemDetails } from "components/ui/layouts/InventoryItemDetails";
import { getBulkMixRequirements } from "./getBulkMixRequirements";
import { formatNumber } from "lib/utils/formatNumber";
import { hasFeatureAccess } from "lib/flags";
import { BulkMixModal } from "./BulkMixModal";

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

const ANIMAL_FEED_BUFFS: AnimalFeedBuffName[] = ["Salt Lick", "Honey Treat"];

type Tab = "food" | "automaticMixer";

export const FeederMachineModal: React.FC<Props> = ({
  show,
  onClose,
  building,
}) => {
  const { t } = useAppTranslation();
  const { gameService, shortcutItem, shortcutItems } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  // Feed costs depend on temporary boosts (Collie/Bantam Shrine), so take one
  // clock read for this render rather than reaching for Date.now() below.
  const now = useNow();
  const [selectedName, setSelectedName] = useState<
    AnimalFoodName | AnimalMedicineName
  >("Hay");
  const [selectedSpice, setSelectedSpice] =
    useState<AnimalFeedBuffName>("Honey Treat");
  const [isSpiceSelected, setIsSpiceSelected] = useState(false);
  const [tab, setTab] = useState<Tab>("food");
  const [showMixInfo, setShowMixInfo] = useState(false);
  const [showBulkMixModal, setShowBulkMixModal] = useState(false);
  const [customMixAmount, setCustomMixAmount] = useState(new Decimal(0));
  const { coins } = ANIMAL_FOODS[selectedName];

  const showBulkMixer = hasFeatureAccess(state, "BULK_MIXER");

  const { ingredients } = getIngredients({ state, name: selectedName });
  const maxMixAmount = getMaxFeedMixAmount({ state, name: selectedName });
  const spices = ANIMAL_FEED_BUFFS.filter((item) =>
    state.inventory[item]?.gt(0),
  );
  const hasSpices = spices.length > 0;
  const selectedSpiceItem = spices.includes(selectedSpice)
    ? selectedSpice
    : undefined;
  const showSpiceDetails = isSpiceSelected && hasSpices && !!selectedSpiceItem;
  const { requests, feeds, animalsWaiting, freeFeedBoosts } =
    getBulkMixRequirements(state, building, now);

  // Only feeds that still need mixing are listed - a feed the inventory
  // already covers is not something the player has to act on.
  const mixableFeeds = feeds.filter((feed) => feed.missing.gt(0));

  // Track which feeds the player has toggled OFF. Everything mixable is
  // selected by default, so storing only the deselections keeps the default
  // in sync as requests change without a state-resetting effect.
  const [deselectedFeeds, setDeselectedFeeds] = useState<
    Partial<Record<BulkMixItem, boolean>>
  >({});

  const isFeedSelected = (item: BulkMixItem) => !deselectedFeeds[item];
  const toggleFeed = (item: BulkMixItem) =>
    setDeselectedFeeds((prev) => ({ ...prev, [item]: !prev[item] }));

  // The checkbox stops its click reaching the panel, so it dismisses the mix
  // explainer itself to match every other click in the modal.
  const selectFeed = (item: BulkMixItem) => {
    setShowMixInfo(false);
    toggleFeed(item);
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
    setIsSpiceSelected(false);
    setCustomMixAmount(new Decimal(0));
    shortcutItem(item);
  };

  const onSelectSpice = (item: AnimalFeedBuffName) => {
    setSelectedSpice(item);
    setIsSpiceSelected(true);
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

  const closeBulkMixModal = () => {
    setShowBulkMixModal(false);
    setCustomMixAmount(new Decimal(0));
  };

  const mixCustomAmount = () => {
    if (
      !customMixAmount.isInteger() ||
      customMixAmount.lessThanOrEqualTo(0) ||
      customMixAmount.greaterThan(maxMixAmount)
    ) {
      return;
    }

    mix(customMixAmount.toNumber());
    closeBulkMixModal();
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
  const nothingSelected = selectedFeeds.length === 0;
  const blocked = nothingSelected || hasShortfall || !hasEnoughCoins;

  const formatIngredientList = (list: GameState["inventory"]) =>
    getKeys(list)
      .map(
        (ingredient) => `${formatNumber(list[ingredient] ?? 0)} ${ingredient}`,
      )
      .join(", ");

  const bulkMix = () => {
    const mixedItems = selectedFeeds.map((feed) => feed.item);

    gameService.send("feeds.bulkMixed", {
      feeds: selectedFeeds.map((feed) => ({
        item: feed.item,
        amount: feed.missing.toNumber(),
      })),
    });

    if (mixedItems.length === 1) {
      shortcutItem(mixedItems[0]);
      return;
    }

    shortcutItems(mixedItems as InventoryItemName[], { activateFirst: false });
  };

  // This component stays mounted while the modal is hidden, so the explainer
  // has to be reset on the way out or it reappears on the next open.
  const closeModal = () => {
    setShowMixInfo(false);
    closeBulkMixModal();
    onClose();
  };

  return (
    <Modal show={show} onHide={closeModal}>
      {/* A click anywhere in the panel dismisses the mix explainer. The popup
          and its icon stop propagation so they are not caught by this. The
          modal stops mouse events reaching the document, so this cannot be a
          document-level listener. */}
      <div onClick={() => setShowMixInfo(false)}>
        <CloseButtonPanel
          onClose={closeModal}
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
                showSpiceDetails ? (
                  <InventoryItemDetails
                    game={state}
                    details={{ item: selectedSpiceItem as InventoryItemName }}
                  />
                ) : (
                  <CraftingRequirements
                    gameState={state}
                    details={{ item: selectedName }}
                    requirements={{
                      coins,
                      resources: ingredients,
                    }}
                    actionView={
                      <div className="flex flex-col w-full">
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
                        {maxMixAmount > 10 && (
                          <Button
                            className="mt-1"
                            onClick={() => setShowBulkMixModal(true)}
                          >
                            {t("feeder.mixInBulk")}
                          </Button>
                        )}
                      </div>
                    }
                  />
                )
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
                            isSelected={
                              !isSpiceSelected && selectedName === item.name
                            }
                            onClick={() => onSelect(item.name)}
                            image={ITEM_DETAILS[item.name].image}
                            count={state.inventory[item.name]}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  {hasSpices && (
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
                            isSelected={
                              isSpiceSelected && selectedSpiceItem === item
                            }
                            onClick={() => onSelectSpice(item)}
                            image={ITEM_DETAILS[item].image}
                            count={state.inventory[item]}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              }
            />
          )}
          {tab === "automaticMixer" && showBulkMixer && (
            <InnerPanel className="flex flex-col gap-2 p-1 w-full">
              {freeFeeding ? (
                <>
                  <Label type="success">{t("feeder.freeFeedingActive")}</Label>
                  <p className="text-xs">
                    {t("feeder.freeFeedingDescription", { building })}
                  </p>
                  <div className="flex flex-col gap-1">
                    {freeFeedBoosts.map((boost) => (
                      <InnerPanel
                        key={boost.item}
                        className="flex gap-1 items-center w-full"
                      >
                        <SmallBox
                          image={
                            boost.source === "collectible"
                              ? ITEM_DETAILS[boost.item].image
                              : getWearableImage(boost.item)
                          }
                        />
                        <div className="flex flex-col flex-1 justify-center -mt-0.5">
                          <p className="text-xs mb-0.5">{boost.item}</p>
                          <p className="text-xxs">
                            {boost.source === "collectible"
                              ? freeFeedLabel(boost.animalType)
                              : t("feeder.freeCureLabel")}
                          </p>
                        </div>
                      </InnerPanel>
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
              ) : allCovered ? (
                <>
                  <Label type="success">
                    {t("feeder.allRequestsCoveredLabel")}
                  </Label>
                  <p className="text-xs">
                    {t("feeder.canFeedAnimals", { count: animalsWaiting })}
                  </p>
                  <p className="text-xxs">
                    {t("feeder.headToBuildingToFeed", { building })}
                  </p>
                </>
              ) : !hasFeedRequests ? (
                <>
                  <p className="text-xs">{t("feeder.noRequestsForBuilding")}</p>
                  <p className="text-xs">
                    {t("feeder.bulkMixerEmptyDescription")}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-1 relative">
                    <Label type="default">{t("feeder.selectFoodsToMix")}</Label>
                    {/* Where the amounts come from - the requirement is
                        planned per animal, so it is not obvious. */}
                    <button
                      type="button"
                      className="flex cursor-pointer pr-1"
                      aria-label={t("info")}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMixInfo((visible) => !visible);
                      }}
                    >
                      <img
                        src={SUNNYSIDE.icons.expression_confused}
                        alt=""
                        style={{ width: `${PIXEL_SCALE * 7}px` }}
                      />
                    </button>
                    {showMixInfo && (
                      <InnerPanel
                        className="absolute top-6 left-0 z-10 w-full p-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-xxs">
                          {t("feeder.ingredientsExplainer")}
                        </span>
                      </InnerPanel>
                    )}
                  </div>

                  {/* There are only ever a handful of feeds, so the list needs
                      no scroll container of its own - the modal scrolls. */}
                  <div className="flex flex-col gap-1">
                    {mixableFeeds.map((feed) => {
                      const feedCanBeMixed = canMixFeed(feed);
                      const selected =
                        feedCanBeMixed && isFeedSelected(feed.item);

                      return (
                        <InnerPanel
                          key={feed.item}
                          className={classNames("flex gap-1 items-center", {
                            "cursor-pointer": feedCanBeMixed,
                          })}
                          onClick={
                            feedCanBeMixed
                              ? () => toggleFeed(feed.item)
                              : undefined
                          }
                        >
                          <SmallBox image={ITEM_DETAILS[feed.item].image} />
                          <div className="flex flex-col flex-1 justify-center -mt-0.5">
                            <p className="text-xs">
                              {`${feed.item} x${formatNumber(feed.missing)}`}
                            </p>
                          </div>
                          {/* Selecting a feed confirms the player can afford
                              it, so the requirement labels carry the whole
                              story - they turn red on the ones falling
                              short. */}
                          <div className="flex flex-col gap-1">
                            {getKeys(feed.ingredients).map((ingredient) => (
                              <RequirementLabel
                                key={`${feed.item}-${ingredient}`}
                                type="item"
                                item={ingredient}
                                balance={
                                  state.inventory[ingredient] ?? new Decimal(0)
                                }
                                requirement={
                                  feed.ingredients[ingredient] ?? new Decimal(0)
                                }
                              />
                            ))}
                          </div>
                          {/* The panel is a click target too, so keep the
                              checkbox's own click from bubbling into it and
                              toggling a second time. */}
                          <div
                            className="flex-none"
                            onClick={(event) => {
                              // A disabled checkbox toggles nothing, so let the
                              // click through to dismiss the explainer like any
                              // other click.
                              if (feedCanBeMixed) {
                                event.stopPropagation();
                              }
                            }}
                          >
                            <Checkbox
                              checked={selected}
                              disabled={!feedCanBeMixed}
                              onChange={() => selectFeed(feed.item)}
                              aria-label={feed.item}
                            />
                          </div>
                        </InnerPanel>
                      );
                    })}
                  </div>

                  {/* Each feed is affordable on its own, so a shortfall here
                      only appears when the selection shares an ingredient. */}
                  {hasShortfall && (
                    <Label type="danger">
                      {t("feeder.missingIngredientsSummary", {
                        ingredients: formatIngredientList(ingredientShortfalls),
                      })}
                    </Label>
                  )}

                  <Button disabled={blocked} onClick={bulkMix}>
                    {t("feeder.bulkMix")}
                  </Button>
                </>
              )}
            </InnerPanel>
          )}
        </CloseButtonPanel>
      </div>
      <BulkMixModal
        show={showBulkMixModal}
        onClose={closeBulkMixModal}
        ingredients={ingredients}
        maxAmount={maxMixAmount}
        amount={customMixAmount}
        setAmount={setCustomMixAmount}
        onMix={mixCustomAmount}
      />
    </Modal>
  );
};
