import React, { useEffect, useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import plus from "assets/icons/plus.png";
import lightning from "assets/icons/lightning.png";
import fullMoon from "assets/icons/full_moon.png";
import multiCast from "src/assets/icons/multi-cast.webp";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { GameState, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  CHUM_AMOUNTS,
  Chum,
  FishName,
  FishingBait,
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
  EXTRA_REELS_AMOUNT,
} from "features/game/events/landExpansion/castRod";
import { isFishFrenzy, isFullMoon } from "features/game/types/calendar";
import { SEASON_ICONS } from "../buildings/components/building/market/SeasonalSeeds";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { Checkbox } from "components/ui/Checkbox";
import { hasFeatureAccess } from "lib/flags";
import { SmallBox } from "components/ui/SmallBox";
import { ChumSelection } from "./ChumSelection";
import { useNow } from "lib/utils/hooks/useNow";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { gameAnalytics } from "lib/gameAnalytics";

const BAIT: FishingBait[] = [
  "Earthworm",
  "Grub",
  "Red Wiggler",
  "Fishing Lure",
];

export const OldBaitSelection: React.FC<{
  onCast: (
    bait: FishingBait,
    chum?: InventoryItemName,
    multiplier?: number,
    guaranteedCatch?: FishName,
    reelPacksToBuy?: number,
  ) => void;
  state: GameState;
}> = ({ onCast, state }) => {
  const items = {
    ...getBasketItems(state.inventory),
    ...getChestItems(state),
  };

  const now = useNow();

  useEffect(() => {
    const lastSelectedBait = localStorage.getItem("lastSelectedBait");
    if (lastSelectedBait) {
      setBait(lastSelectedBait as FishingBait);
    }
    const lastSelectedChum = localStorage.getItem("lastSelectedChum");

    const hasRequirements =
      lastSelectedChum &&
      items[lastSelectedChum as InventoryItemName]?.gte(
        CHUM_AMOUNTS[lastSelectedChum as Chum] ?? 0,
      );

    if (hasRequirements) {
      setChum(lastSelectedChum as Chum);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showChum, setShowChum] = useState(false);
  const [chum, setChum] = useState<Chum | undefined>();
  const [bait, setBait] = useState<FishingBait>("Earthworm");
  const [multiplier, setMultiplier] = useState<number>(1);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const { t } = useAppTranslation();

  const isVip = hasVipAccess({ game: state });

  if (showChum) {
    return (
      <InnerPanel>
        <ChumSelection
          bait={bait}
          state={state}
          onCancel={() => setShowChum(false)}
          initialChum={chum}
          onList={(selected) => {
            setChum(selected);
            localStorage.setItem("lastSelectedChum", selected);
            setShowChum(false);
          }}
        />
      </InnerPanel>
    );
  }

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
    onCast(bait, chum, effectiveMultiplier, undefined, packsRequired);

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

  const currentSeason = state.season.season;

  return (
    <>
      <div className="flex flex-col gap-1">
        <InnerPanel>
          <div className="p-2">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <div className="flex items-center gap-2">
                <Label
                  icon={SEASON_ICONS[currentSeason]}
                  type="default"
                  className="capitalize"
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
          </div>

          <div className="flex flex-wrap">
            {BAIT.map((name) => (
              <Box
                image={ITEM_DETAILS[name].image}
                isSelected={bait === name}
                count={items[name]}
                onClick={() => {
                  setBait(name);
                  localStorage.setItem("lastSelectedBait", name);
                }}
                key={name}
              />
            ))}
          </div>
        </InnerPanel>
        <div>
          <InnerPanel className="my-1 relative">
            <div className="flex p-1 items-center">
              <div className="flex-shrink-0 h-10 w-10 mr-2 justify-items-center">
                <img src={ITEM_DETAILS[bait].image} className="h-8" />
              </div>
              <div>
                <p className="text-sm mb-1">
                  {t("fishing.baitMultiplier", {
                    count: effectiveMultiplier,
                    bait,
                  })}
                </p>

                <p className="text-xs">{ITEM_DETAILS[bait].description}</p>
                {!items[bait] && bait !== "Fishing Lure" && (
                  <Label className="mt-2" type="default">
                    {t("statements.craft.composter")}
                  </Label>
                )}
                {!items[bait] && bait === "Fishing Lure" && (
                  <Label className="mt-1" type="default">
                    {t("fishermanModal.craft.beach")}
                  </Label>
                )}
              </div>
            </div>
            {!items[bait] && (
              <Label className="absolute -top-3 right-0" type={"danger"}>
                {t("fishermanModal.zero.available")}
              </Label>
            )}
          </InnerPanel>
        </div>
        {isVip && hasFeatureAccess(state, "MULTI_CAST") && (
          <InnerPanel className="mb-1">
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
                        onClick={() => setMultiplier(value)}
                      >
                        <span className="text-xs ml-1 -mr-0.5">{`${value}x`}</span>
                        <Checkbox checked={isSelected} onChange={() => {}} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </InnerPanel>
        )}
        <InnerPanel className="mb-1">
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
              <div className="flex">
                <img
                  src={SUNNYSIDE.icons.expression_confused}
                  className="h-4 mr-2"
                />
                <p className="text-xs mb-1">
                  {t("fishermanModal.attractFish")}
                </p>
              </div>
              <Button
                disabled={!bait}
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

        {fishingLimitReached && (
          <Label className="mb-1 ml-1" type="danger">
            {fishingLimitReached
              ? t("fishermanModal.fishingLimitReached")
              : t("fishermanModal.notEnoughReels")}
          </Label>
        )}

        {missingRod && (
          <Label className="mb-1 ml-1" type="danger">
            {t("fishermanModal.needCraftRod")}
          </Label>
        )}

        {fishingLimitReached ? (
          <Button
            disabled={
              missingRod ||
              !bait ||
              !items[bait as InventoryItemName]?.gte(effectiveMultiplier)
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
            onClick={() => onCast(bait, chum, effectiveMultiplier)}
            disabled={
              !bait ||
              effectiveMultiplier > reelsLeft ||
              fishingLimitReached ||
              missingRod ||
              !items[bait as InventoryItemName]?.gte(effectiveMultiplier) ||
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
