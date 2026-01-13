import React, { useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import plus from "assets/icons/plus.png";
import lightning from "assets/icons/lightning.png";
import fullMoon from "assets/icons/full_moon.png";
import multiCast from "src/assets/icons/multi-cast.webp";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import {
  GameState,
  Inventory,
  InventoryItemName,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  CHUM_AMOUNTS,
  Chum,
  FishName,
  FishingBait,
  getSeasonalGuaranteedCatch,
  isGuaranteedBait,
} from "features/game/types/fishing";
import { isWearableActive } from "features/game/lib/wearables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  getBasketItems,
  getChestItems,
} from "../hud/components/inventory/utils/inventory";
import Decimal from "decimal.js-light";
import {
  getReelsPackGemPrice,
  getRemainingReels,
} from "features/game/events/landExpansion/castRod";
import { isFishFrenzy, isFullMoon } from "features/game/types/calendar";
import { SEASON_ICONS } from "../buildings/components/building/market/SeasonalSeeds";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { Checkbox } from "components/ui/Checkbox";
import { SmallBox } from "components/ui/SmallBox";
import { ChumSelection } from "./ChumSelection";
import { DropdownPanel } from "components/ui/DropdownPanel";
import { EXTRA_REELS_AMOUNT } from "features/game/events/landExpansion/castRod";
import { gameAnalytics } from "lib/gameAnalytics";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { useNow } from "lib/utils/hooks/useNow";

const BAIT: FishingBait[] = [
  "Earthworm",
  "Grub",
  "Red Wiggler",
  "Fishing Lure",
  "Fish Flake",
  "Fish Stick",
  "Fish Oil",
  "Crab Stick",
];

const getStoredBait = (): FishingBait | undefined => {
  if (typeof window === "undefined") return undefined;

  const stored = localStorage.getItem("lastSelectedBait");
  return stored ? (stored as FishingBait) : undefined;
};

const getDefaultChum = (items: Inventory): Chum | undefined => {
  if (typeof window === "undefined") return undefined;

  const lastSelectedChum = localStorage.getItem(
    "lastSelectedChum",
  ) as Chum | null;

  const hasRequirements =
    lastSelectedChum &&
    items[lastSelectedChum as InventoryItemName]?.gte(
      CHUM_AMOUNTS[lastSelectedChum as Chum] ?? 0,
    );

  return hasRequirements ? (lastSelectedChum as Chum) : undefined;
};

const getDefaultMultiplier = () => {
  if (typeof window === "undefined") return 1;

  const lastSelectedMultiplier = localStorage.getItem("lastSelectedMultiplier");
  return lastSelectedMultiplier ? parseInt(lastSelectedMultiplier) : 1;
};

const getDefaultGuaranteedCatch = () => {
  if (typeof window === "undefined") return undefined;

  const lastSelectedGuaranteedCatch = localStorage.getItem(
    "lastSelectedGuaranteedCatch",
  ) as FishName | null;

  return lastSelectedGuaranteedCatch ?? undefined;
};

type Props = {
  onCast: (
    bait: FishingBait,
    chum?: InventoryItemName,
    multiplier?: number,
    guaranteedCatch?: FishName,
    reelPacksToBuy?: number,
  ) => void;
  state: GameState;
};

export const BaitSelection: React.FC<Props> = ({ onCast, state }) => {
  const items = {
    ...getBasketItems(state.inventory),
    ...getChestItems(state),
  };

  const isVip = hasVipAccess({ game: state });
  const currentSeason = state.season.season;
  const now = useNow();

  const getGuaranteedOptions = (bait: FishingBait) => {
    return isGuaranteedBait(bait)
      ? getSeasonalGuaranteedCatch(bait, currentSeason)
      : [];
  };
  const defaultGuaranteedCatch = getDefaultGuaranteedCatch();

  const [showChum, setShowChum] = useState(false);
  const [chum, setChum] = useState<Chum | undefined>(() =>
    !defaultGuaranteedCatch ? getDefaultChum(items) : undefined,
  );
  const [selectedBait, setSelectedBait] = useState<FishingBait | undefined>(
    () => getStoredBait(),
  );
  const [multiplier, setMultiplier] = useState<number>(() =>
    getDefaultMultiplier(),
  );
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const { t } = useAppTranslation();

  const [guaranteedCatch, setGuaranteedCatch] = useState<FishName | undefined>(
    () => defaultGuaranteedCatch ?? undefined,
  );

  const handleBaitChange = (bait: FishingBait) => {
    setSelectedBait(bait);
    if (typeof window !== "undefined") {
      localStorage.setItem("lastSelectedBait", bait);
    }

    handleGuaranteedCatchChange(undefined);
  };

  const handleMultiplierChange = (multiplier: number) => {
    setMultiplier(multiplier);
    if (typeof window !== "undefined") {
      localStorage.setItem("lastSelectedMultiplier", multiplier.toString());
    }
  };

  const handleGuaranteedCatchChange = (
    guaranteedCatch: FishName | undefined,
  ) => {
    setGuaranteedCatch(guaranteedCatch);
    setChum(undefined);
    if (typeof window !== "undefined") {
      if (guaranteedCatch) {
        localStorage.setItem("lastSelectedGuaranteedCatch", guaranteedCatch);
      } else {
        localStorage.removeItem("lastSelectedGuaranteedCatch");
      }
    }
  };

  const reelsLeft = getRemainingReels(state);
  const effectiveMultiplier = isVip ? multiplier : 1;

  const getExtraReelPacksRequired = () => {
    // Find the diff between the effective multiplier and reels left
    const diff = effectiveMultiplier - reelsLeft;

    // then work out how many groups of 5 need to be purchased (never negative)
    const reelPacksRequired = Math.max(0, Math.ceil(diff / EXTRA_REELS_AMOUNT));

    // if the multiplier is just 1 then let them just buy the 5
    return reelPacksRequired;
  };

  const fishingLimitReached = reelsLeft <= 0 || effectiveMultiplier > reelsLeft;
  const hasAncientRod = isWearableActive({ name: "Ancient Rod", game: state });
  const rodsRequired = hasAncientRod ? 0 : effectiveMultiplier;
  // Get reels required to make the cast
  const packsRequired = fishingLimitReached ? getExtraReelPacksRequired() : 0;
  // Get the gems cost for the reels
  const gemPrice =
    packsRequired > 0
      ? getReelsPackGemPrice({
          state,
          packs: packsRequired,
          createdAt: now,
        })
      : 0;

  const handleBuyMoreReelsAndCast = () => {
    onCast(
      selectedBait!,
      chum,
      effectiveMultiplier,
      guaranteedCatch,
      packsRequired,
    );

    gameAnalytics.trackSink({
      currency: "Gem",
      amount: gemPrice,
      item: "FishingReels",
      type: "Fee",
    });

    setShowConfirmationModal(false);
  };

  const missingRod =
    !hasAncientRod &&
    (!state.inventory["Rod"] || state.inventory.Rod.lt(rodsRequired));
  const guaranteedCatchOptions = selectedBait
    ? getGuaranteedOptions(selectedBait)
    : [];

  if (showChum && selectedBait) {
    return (
      <InnerPanel>
        <ChumSelection
          bait={selectedBait}
          state={state}
          onCancel={() => setShowChum(false)}
          initialChum={chum}
          onList={(selected) => {
            setChum(selected);
            if (typeof window !== "undefined") {
              localStorage.setItem("lastSelectedChum", selected);
            }
            setShowChum(false);
          }}
        />
      </InnerPanel>
    );
  }

  if (selectedBait && isGuaranteedBait(selectedBait) && !guaranteedCatch) {
    return (
      <InnerPanel className="flex flex-col min-h-[320px] justify-between">
        <div className="flex flex-col space-y-2 flex-1">
          <div className="flex items-center">
            <p className="p-1 text-xs">{t("fishing.guaranteedCatch.select")}</p>
          </div>
          <div className="flex flex-wrap">
            {guaranteedCatchOptions.length > 0 ? (
              guaranteedCatchOptions.map((name: FishName, index: number) => (
                <div
                  key={name}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Box
                    image={ITEM_DETAILS[name].image}
                    isSelected={
                      guaranteedCatch ? guaranteedCatch === name : index === 0
                    }
                    count={items[name]}
                    onClick={() => {
                      handleGuaranteedCatchChange(name);
                    }}
                    key={name}
                  />
                </div>
              ))
            ) : (
              <div className="text-xs ml-1">
                <p className="text-xs mb-1">
                  {t("fishing.guaranteedCatch.none")}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            onClick={() => {
              handleGuaranteedCatchChange(undefined);
              handleBaitChange("Earthworm");
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={() => {
              const selected = guaranteedCatch ?? guaranteedCatchOptions[0];

              handleGuaranteedCatchChange(selected);
            }}
          >
            {t("confirm")}
          </Button>
        </div>
      </InnerPanel>
    );
  }

  const notEnoughBait =
    selectedBait &&
    (items[selectedBait] ?? new Decimal(0)).lt(effectiveMultiplier);

  return (
    <>
      <div className="flex flex-col gap-1">
        <InnerPanel>
          <div className="flex items-center justify-between flex-wrap gap-1">
            <div className="flex items-center gap-2">
              <Label
                icon={SEASON_ICONS[currentSeason]}
                type="default"
                className="capitalize ml-1"
              >
                {t(`season.${currentSeason}`)}
              </Label>
              {isFishFrenzy(state) && (
                <Label icon={lightning} type="vibrant">
                  {t("calendar.events.fishFrenzy.title")}
                </Label>
              )}
              {isFullMoon(state) && (
                <Label icon={fullMoon} type="vibrant">
                  {t("calendar.events.fullMoon.title")}
                </Label>
              )}
            </div>

            <Label
              icon={SUNNYSIDE.tools.fishing_rod}
              type={reelsLeft <= 0 ? "danger" : "default"}
            >
              {reelsLeft === 1
                ? t("fishing.oneReelLeft")
                : t("fishing.reelsLeft", { reelsLeft })}
            </Label>
          </div>
        </InnerPanel>
        <DropdownPanel
          options={BAIT.map((bait) => ({
            value: bait,
            label: (
              <div className="flex flex-col gap-1">
                <p className="text-xs">{`${effectiveMultiplier} x ${bait} (${items[bait]?.toString() ?? 0})`}</p>
                <p className="text-xxs">{ITEM_DETAILS[bait].description}</p>
              </div>
            ),
            icon: ITEM_DETAILS[bait].image,
          }))}
          value={selectedBait}
          placeholder={t("fishing.select.your.bait")}
          onChange={(bait) => handleBaitChange(bait as FishingBait)}
        />
        {notEnoughBait && (
          <Label className="ml-1" type="danger">
            {t("fishing.dont.have.enough.bait", { bait: selectedBait })}
          </Label>
        )}
        {selectedBait && isGuaranteedBait(selectedBait) && guaranteedCatch && (
          <InnerPanel>
            <Label
              type="default"
              className="text-xs ml-1"
              icon={SUNNYSIDE.tools.fishing_rod}
            >
              {t("fishing.guaranteedCatch.title")}
            </Label>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 p-1 pt-2">
                <img
                  src={ITEM_DETAILS[guaranteedCatch].image}
                  className="h-6"
                />
                <p className="mb-1">{guaranteedCatch}</p>
              </div>
              <div
                className="mr-2 cursor-pointer"
                onClick={() => handleGuaranteedCatchChange(undefined)}
              >
                <img src={SUNNYSIDE.icons.cancel} className="h-5" />
              </div>
            </div>
          </InnerPanel>
        )}
        {isVip && (
          <InnerPanel>
            <div className="flex flex-col justify-between space-y-2">
              <Label type="default" className="text-xs ml-1" icon={multiCast}>
                {t("fishing.multiCast")}
              </Label>
              <div className="flex items-center space-x-2 p-1">
                <SmallBox
                  image={SUNNYSIDE.tools.fishing_rod}
                  count={state.inventory["Rod"] ?? new Decimal(0)}
                />
                <div className="flex gap-2">
                  {[1, 5, 10, 25].map((value) => {
                    const isSelected = effectiveMultiplier === value;

                    return (
                      <div
                        key={value}
                        className="flex items-center gap-1 cursor-pointer"
                      >
                        <span className="text-xs ml-1 -mr-0.5">{`${value}x`}</span>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleMultiplierChange(value)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </InnerPanel>
        )}
        {!isGuaranteedBait(selectedBait) && (
          <InnerPanel>
            {chum ? (
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <Label
                    type="default"
                    icon={ITEM_DETAILS[chum].image}
                    className="ml-1.5"
                  >
                    {t("fishermanModal.chum", {
                      count: CHUM_AMOUNTS[chum] * effectiveMultiplier,
                      type: chum,
                    })}
                  </Label>
                </div>
                <img
                  src={SUNNYSIDE.icons.cancel}
                  className="h-5 pr-0.5 cursor-pointer"
                  onClick={() => {
                    setChum(undefined);
                    localStorage.removeItem("lastSelectedChum");
                  }}
                />
              </div>
            ) : (
              <div className="p-1 flex justify-between items-center flex-1 w-full">
                <div className="flex justify-center items-center">
                  <img
                    src={SUNNYSIDE.icons.expression_confused}
                    className="h-6 mr-2 mb-1"
                  />
                  <p className="text-xs mb-1">
                    {t("fishermanModal.attractFish")}
                  </p>
                </div>
                <Button
                  disabled={!selectedBait}
                  className={`h-[30px] w-[40px]`}
                  onClick={() => setShowChum(true)}
                >
                  <div className="flex items-center">
                    <img src={plus} className="w-8 mt-1" />
                  </div>
                </Button>
              </div>
            )}
          </InnerPanel>
        )}
        {fishingLimitReached && (
          <Label className="mb-0.5 ml-1" type="danger">
            {fishingLimitReached
              ? t("fishermanModal.fishingLimitReached")
              : t("fishermanModal.notEnoughReels")}
          </Label>
        )}
        {missingRod && (
          <Label className="mb-0.5 ml-1" type="danger">
            {t("fishermanModal.needCraftRod")}
          </Label>
        )}
        {fishingLimitReached ? (
          <Button
            disabled={
              missingRod ||
              !selectedBait ||
              !items[selectedBait as InventoryItemName]?.gte(
                effectiveMultiplier,
              )
            }
            onClick={() => setShowConfirmationModal(true)}
          >
            <div className="flex items-center">
              {t("fishing.buyMoreReels", {
                reels: packsRequired * EXTRA_REELS_AMOUNT, // total reels to buy
                price: gemPrice,
              })}
              <img src={ITEM_DETAILS.Gem.image} className="ml-1 h-4" />
            </div>
          </Button>
        ) : (
          <Button
            onClick={() =>
              onCast(selectedBait!, chum, effectiveMultiplier, guaranteedCatch)
            }
            disabled={
              !selectedBait ||
              effectiveMultiplier > reelsLeft ||
              fishingLimitReached ||
              missingRod ||
              !items[selectedBait as InventoryItemName]?.gte(
                effectiveMultiplier,
              ) ||
              (chum
                ? !items[chum as InventoryItemName]?.gte(
                    new Decimal(CHUM_AMOUNTS[chum] * effectiveMultiplier),
                  )
                : false)
            }
          >
            <div className="flex items-center">
              <span className="text-sm mr-1">{t("fishing.cast")}</span>
              <img src={SUNNYSIDE.tools.fishing_rod} className="h-5" />
            </div>
          </Button>
        )}
      </div>
      <ModalOverlay
        show={showConfirmationModal}
        onBackdropClick={() => setShowConfirmationModal(false)}
      >
        <InnerPanel>
          <div className="flex flex-col p-2 pb-0 items-center">
            <span className="text-sm text-start w-full mb-1">
              {t("fishing.buyReels.confirmation", { gemPrice })}
            </span>
          </div>
          <div className="flex justify-content-around mt-2 space-x-1">
            <Button onClick={() => setShowConfirmationModal(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleBuyMoreReelsAndCast}>{t("confirm")}</Button>
          </div>
        </InnerPanel>
      </ModalOverlay>
    </>
  );
};
