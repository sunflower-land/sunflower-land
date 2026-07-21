import React, { Fragment, useContext, useState } from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { NPCPlaceable } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { MapPlacement } from "./MapPlacement";

import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import coinsIcon from "assets/icons/coins.webp";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { useActor, useSelector } from "@xstate/react";
import {
  ISLAND_UPGRADE,
  isLandUpgradable,
  getAscensionUpgradeCost,
  ASCENSION_BUMPKIN_LEVEL,
} from "features/game/events/landExpansion/upgradeFarm";
import { useTimeBasedFeatureAccess } from "lib/utils/hooks/useTimeBasedFeatureAccess";
import {
  getAscensionLevel,
  getMaxBumpkinLevel,
  LEVELS_PER_ASCENSION,
} from "features/game/lib/level";
import type { CollectibleName } from "features/game/types/craftables";
import { getKeys } from "lib/object";
import { createPortal } from "react-dom";
import confetti from "canvas-confetti";
import type { AscensionIslandType, IslandType } from "features/game/types/game";
import { ASCENSION_ISLANDS, getIslandName } from "features/game/types/game";
import { hasFeatureAccess, TIME_BASED_FEATURE_FLAG_WINDOWS } from "lib/flags";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Transition } from "@headlessui/react";
import { translate } from "lib/i18n/translate";
import { Loading } from "features/auth/components";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";
import type { MachineState } from "features/game/lib/gameMachine";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";

export const UPGRADE_RAFTS: Record<IslandType, string | null> = {
  basic: SUNNYSIDE.land.springRaft,
  spring: SUNNYSIDE.land.desertRaft,
  desert: SUNNYSIDE.land.volcanoRaft,
  volcano: SUNNYSIDE.land.volcanoRaft, // Next prestige after volcano
  // Ascension islands chain onward (swamp → … → marble → marble); reuse the
  // volcano raft stub like the preview/message/description assets do.
  swamp: SUNNYSIDE.land.volcanoRaft,
  spooky: SUNNYSIDE.land.volcanoRaft,
  crystal: SUNNYSIDE.land.volcanoRaft,
  galaxy: SUNNYSIDE.land.volcanoRaft,
  marble: SUNNYSIDE.land.volcanoRaft,
};

const UPGRADE_PREVIEW: Record<IslandType, string | null> = {
  basic: null,
  spring: SUNNYSIDE.announcement.springPrestige,
  desert: SUNNYSIDE.announcement.desertPrestige,
  volcano: SUNNYSIDE.announcement.volcanoPrestige,
  swamp: SUNNYSIDE.announcement.volcanoPrestige,
  // Ascension islands (spooky onward) reuse the swamp value for now.
  spooky: SUNNYSIDE.announcement.volcanoPrestige,
  crystal: SUNNYSIDE.announcement.volcanoPrestige,
  galaxy: SUNNYSIDE.announcement.volcanoPrestige,
  marble: SUNNYSIDE.announcement.volcanoPrestige,
};

const UPGRADE_MESSAGES: Record<IslandType, string | null> = {
  basic: null,
  spring: translate("islandupgrade.welcomePetalParadise"),
  desert: translate("islandupgrade.welcomeDesertIsland"),
  volcano: translate("islandupgrade.welcomeVolcanoIsland"),
  swamp: translate("islandupgrade.welcomeVolcanoIsland"),
  // Ascension islands (spooky onward) reuse the swamp value for now.
  spooky: translate("islandupgrade.welcomeVolcanoIsland"),
  crystal: translate("islandupgrade.welcomeVolcanoIsland"),
  galaxy: translate("islandupgrade.welcomeVolcanoIsland"),
  marble: translate("islandupgrade.welcomeVolcanoIsland"),
};

const UPGRADE_DESCRIPTIONS: Record<IslandType, string | null> = {
  basic: null,
  spring: translate("islandupgrade.exoticResourcesDescription"),
  desert: translate("islandupgrade.desertResourcesDescription"),
  volcano: translate("islandupgrade.volcanoResourcesDescription"),
  swamp: translate("islandupgrade.volcanoResourcesDescription"),
  // Ascension islands (spooky onward) reuse the swamp value for now.
  spooky: translate("islandupgrade.volcanoResourcesDescription"),
  crystal: translate("islandupgrade.volcanoResourcesDescription"),
  galaxy: translate("islandupgrade.volcanoResourcesDescription"),
  marble: translate("islandupgrade.volcanoResourcesDescription"),
};

// Swamp ascension launch date — shown as a teaser on the locked "coming soon"
// label until the upgrade opens to everyone.
const SWAMP_LAUNCH_DATE = new Date("2026-08-03"); // 3rd August 2026

// Swamp (terminal ascension island) isn't in ISLAND_UPGRADE, so fall back to an
// empty upgrade to keep the unconditional reads below type-safe and crash-free.
const NO_ISLAND_UPGRADE: Pick<
  (typeof ISLAND_UPGRADE)[keyof typeof ISLAND_UPGRADE],
  "items" | "expansions"
> = { expansions: 0, items: {} };

const IslandUpgraderModal: React.FC<{
  onClose: () => void;
  onUpgrade: () => void;
}> = ({ onClose, onUpgrade }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const { island, inventory, collectibles, home, coins, bumpkin } =
    gameState.context.state;

  // Temporary: ascending from Swamp (A1) to the next island (A2) is gated behind
  // the SPOOKY_ASCENSION window (testnet bypasses). Mirror the server gate so the
  // button reflects it.
  const hasSpookyAscensionAccess = useTimeBasedFeatureAccess({
    featureName: "SPOOKY_ASCENSION",
    game: gameState.context.state,
  });
  // Match the reducer's authoritative A1→A2 condition (ascensionLevel === 1) so
  // the button can't enable an upgrade the server rejects, or vice versa.
  const isNextAscensionLocked =
    (island.ascensionLevel ?? 0) === 1 && !hasSpookyAscensionAccess;
  const upgrade = isLandUpgradable(island.type)
    ? ISLAND_UPGRADE[island.type]
    : NO_ISLAND_UPGRADE;
  const { t, i18n } = useAppTranslation();
  const nextAscensionUnlockDate =
    TIME_BASED_FEATURE_FLAG_WINDOWS.SPOOKY_ASCENSION.start.toLocaleDateString(
      i18n.resolvedLanguage,
      { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },
    );

  const remainingExpansions =
    upgrade.expansions - (inventory["Basic Land"]?.toNumber() ?? 0);

  // Ascension upgrades (volcano -> swamp onward) are gated behind the
  // SWAMP_ASCENSION feature flag; basic-island upgrades are unaffected. Computed
  // up here so the confirmation panel below can switch its copy too.
  const nextIsland = isLandUpgradable(island.type)
    ? ISLAND_UPGRADE[island.type].upgrade
    : undefined;
  const isAscensionUpgrade =
    !!nextIsland &&
    (ASCENSION_ISLANDS as readonly string[]).includes(nextIsland);

  // Ascension islands also require a minimum Bumpkin level.
  // Mirror the server gate: maxed current band — level 150 for the first
  // ascension (band 0), level 50 of the current band for every re-ascension.
  const hasRequiredLevel =
    !isAscensionUpgrade ||
    getAscensionLevel({
      experience: bumpkin.experience ?? 0,
      ascensionLevel: island.ascensionLevel ?? 0,
      // Mirror the server gate: the pre-ascension cap drops to 150 under
      // SWAMP_ASCENSION, so without this a maxed level-150 player would be
      // measured against the legacy 200 cap and never show as ready.
      maxLevel: getMaxBumpkinLevel(gameState.context.state),
    }).isReadyToAscend;

  if (showConfirmation) {
    return (
      <Panel>
        <Label type="danger" className="m-1 mb-0">
          {t("warning")}
        </Label>
        <div className="p-2">
          <p className="text-sm">
            {isAscensionUpgrade
              ? t("islandupgrade.confirmAscend")
              : t("islandupgrade.confirmUpgrade")}
          </p>
          <p className="text-xs mt-2">{t("islandupgrade.warning1")}</p>
        </div>

        <div className="flex">
          <Button onClick={() => setShowConfirmation(false)}>{t("no")}</Button>
          <Button className="ml-1" onClick={onUpgrade}>
            {t("yes")}
          </Button>
        </div>
      </Panel>
    );
  }

  const hasUnexpiredItemsPlaced = () => {
    const temporaryCollectibles = getKeys(EXPIRY_COOLDOWNS).reduce(
      (acc, name) => {
        const items = collectibles[name as CollectibleName] ?? [];
        const homeItems = home.collectibles[name as CollectibleName] ?? [];

        const count = [...items, ...homeItems].length;

        if (count > 0) {
          return {
            ...acc,
            [name]: count,
          };
        }

        return acc;
      },
      {} as Record<string, number>,
    );

    return getKeys(temporaryCollectibles).length > 0;
  };

  const flagAllows =
    !isAscensionUpgrade ||
    hasFeatureAccess(gameState.context.state, "SWAMP_ASCENSION");
  const hasUpgrade = isLandUpgradable(island.type) && flagAllows;

  // Ascension upgrades carry their (level-scaled) cost in getAscensionUpgradeCost,
  // not in ISLAND_UPGRADE[...].items (which is empty for them).
  const { items: upgradeItems, coins: upgradeCoins } = isAscensionUpgrade
    ? getAscensionUpgradeCost((island.ascensionLevel ?? 0) + 1)
    : { items: upgrade.items, coins: 0 };

  // Localised launch date (US vs rest-of-world ordering from the browser locale).
  // SWAMP_LAUNCH_DATE is parsed as UTC midnight, so format in UTC too — otherwise
  // negative-UTC locales (the Americas) render the previous calendar day.
  const comingSoonDate = SWAMP_LAUNCH_DATE.toLocaleDateString(
    navigator.language,
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },
  );

  const hasResources =
    getKeys(upgradeItems).every(
      (name) => inventory[name]?.gte(upgradeItems[name] ?? 0) ?? false,
    ) && coins >= upgradeCoins;

  return (
    <CloseButtonPanel bumpkinParts={NPC_WEARABLES.grubnuk} onClose={onClose}>
      <div className="p-2">
        <div className="flex items-center  mb-2 ">
          <p className="text-sm mr-2">
            {isAscensionUpgrade
              ? t("islandupgrade.ascendIsland")
              : t("islandupgrade.upgradeIsland")}
          </p>
          <img src={SUNNYSIDE.icons.heart} className="h-6" />
        </div>
        <p className="text-xs mb-2">
          {isAscensionUpgrade
            ? t("islandupgrade.ascendIntro")
            : t("islandupgrade.newOpportunities")}
        </p>
        <p className="text-xs mb-2">
          {isAscensionUpgrade
            ? t("islandupgrade.ascendConfirmation")
            : t("islandupgrade.confirmation")}
        </p>
        <img
          src={UPGRADE_PREVIEW[gameState.context.state.island.type] as string}
          className="w-full rounded-md"
        />

        {!hasUpgrade && (
          <Label
            icon={SUNNYSIDE.icons.lock}
            type="danger"
            className="mr-3 my-2"
          >
            {isAscensionUpgrade
              ? t("islandupgrade.comingSoon", { date: comingSoonDate })
              : t("coming.soon")}
          </Label>
        )}

        {hasUpgrade && isNextAscensionLocked && (
          <Label
            icon={SUNNYSIDE.icons.lock}
            type="danger"
            className="mr-3 my-2"
          >
            {t("islandupgrade.comingSoon", { date: nextAscensionUnlockDate })}
          </Label>
        )}

        {hasUpgrade && (
          <>
            <div className="flex items-center mt-2 mb-1 flex-wrap gap-x-2 gap-y-1">
              {remainingExpansions > 0 && (
                <Label
                  icon={SUNNYSIDE.land.island}
                  type="danger"
                  className="whitespace-nowrap"
                >
                  {t("islandupgrade.expansionsRemaining", {
                    remaining: remainingExpansions,
                  })}
                </Label>
              )}

              {!hasRequiredLevel && (
                <Label
                  icon={SUNNYSIDE.icons.player}
                  type="danger"
                  className="whitespace-nowrap"
                >
                  {island.ascensionLevel
                    ? t("islandupgrade.ascensionLevelRequired", {
                        level: LEVELS_PER_ASCENSION,
                      })
                    : t("islandupgrade.levelRequired", {
                        level: ASCENSION_BUMPKIN_LEVEL,
                      })}
                </Label>
              )}

              {hasUnexpiredItemsPlaced() && (
                <Label icon={SUNNYSIDE.icons.expression_alerted} type="danger">
                  {t("islandupgrade.tempItemWarning")}
                </Label>
              )}
              {getKeys(upgradeItems).map((name) => (
                <Label
                  key={name}
                  icon={ITEM_DETAILS[name].image}
                  className="whitespace-nowrap"
                  type={
                    inventory[name]?.gte(upgradeItems[name] ?? 0)
                      ? "default"
                      : "danger"
                  }
                >{`${upgradeItems[name]} x ${name}`}</Label>
              ))}
              {upgradeCoins > 0 && (
                <Label
                  icon={coinsIcon}
                  className="whitespace-nowrap"
                  type={coins >= upgradeCoins ? "default" : "danger"}
                >
                  {`${upgradeCoins} x ${t("coins")}`}
                </Label>
              )}
            </div>
          </>
        )}
      </div>
      <Button
        disabled={
          !hasUpgrade ||
          !hasResources ||
          !hasRequiredLevel ||
          remainingExpansions > 0 ||
          isNextAscensionLocked
        }
        onClick={() => setShowConfirmation(true)}
      >
        {t("continue")}
      </Button>
    </CloseButtonPanel>
  );
};

interface Props {
  offset: number;
}

const _islandType = (state: MachineState) =>
  state.context.state.island?.type ?? "basic";
const _ascensionLevel = (state: MachineState) =>
  state.context.state.island?.ascensionLevel ?? 0;
const _expansionCount = (state: MachineState) =>
  state.context.state.inventory["Basic Land"]?.toNumber() ?? 3;

export const IslandUpgrader: React.FC<Props> = ({ offset }) => {
  const { t } = useAppTranslation();

  const { gameService, showAnimations } = useContext(Context);

  const islandType = useSelector(gameService, _islandType);
  const ascensionLevel = useSelector(gameService, _ascensionLevel);
  const expansionCount = useSelector(gameService, _expansionCount);

  const [showModal, setShowModal] = useState(false);
  const [showTravelAnimation, setShowTravelAnimation] = useState(false);
  const [showUpgraded, setShowUpgraded] = useState(false);

  const [scrollIntoView] = useScrollIntoView();

  const onUpgrade = async () => {
    setShowTravelAnimation(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setShowModal(false);
    gameService.send("PAUSE");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    gameService.send("farm.upgraded");
    gameService.send("SAVE");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setShowUpgraded(true);

    gameService.send("PLAY");

    scrollIntoView(Section.GenesisBlock, "auto");

    setShowTravelAnimation(false);
    if (showAnimations) confetti();
  };

  const nextExpansion = expansionCount + 1;

  const getPosition = () => {
    if (islandType === "basic") {
      switch (nextExpansion) {
        case 10:
          return { x: 1, y: -5 };
        case 11:
          return { x: 0, y: 2 };
        case 12:
          return { x: 0, y: 8 };
        case 13:
          return { x: -1, y: 14 };
        case 14:
          return { x: -7, y: 14 };
        case 15:
          return { x: -14, y: 14 };
        case 16:
          return { x: -20, y: 14 };
        case 17:
          return { x: -26, y: 14 };
        case 18:
          return { x: -27, y: 8 };
        case 19:
          return { x: -27, y: 2 };
        case 20:
          return { x: -28, y: -4 };
        case 21:
          return { x: -28, y: -10 };
        case 22:
          return { x: -22, y: -10 };
        case 23:
          return { x: -17, y: -10 };
        case 24:
          return { x: -11, y: -10 };
      }
    }

    if (islandType === "spring") {
      switch (nextExpansion) {
        case 17:
          return { x: -26, y: 14 };
        case 18:
          return { x: -27, y: 8 };
        case 19:
          return { x: -27, y: 2 };
        case 20:
          return { x: -28, y: -4 };
        case 21:
          return { x: -28, y: -10 };
      }
    }
    if (islandType === "desert" && nextExpansion === 26) {
      return { x: 1, y: -11 };
    }
    // Until the volcano cap (30 expansions) the raft sits on the side and the
    // modal blocks the upgrade ("X Expansions Remaining"); once maxed it moves
    // to the top-right scaffolding, ready to prestige to swamp.
    // TODO: confirm the scaffolding coordinate in-game.
    if (islandType === "volcano") {
      return nextExpansion === 31 ? { x: -1, y: 20 } : { x: 9, y: 9 };
    }

    if (
      hasRequiredIslandExpansion(islandType, "swamp") &&
      nextExpansion === 43
    ) {
      return { x: -40, y: -16 };
    }

    return { x: 7, y: 0 };
  };

  const onClose = () => {
    if (showTravelAnimation) {
      return;
    }
    setShowModal(false);
  };

  const upgradeRaft = UPGRADE_RAFTS[islandType];
  const preview = UPGRADE_PREVIEW[islandType];

  // Ascension islands (swamp onward) share the volcano welcome copy, so surface
  // the real island name plus the ascension level instead of a hardcoded title.
  const isAscensionIsland = ASCENSION_ISLANDS.includes(
    islandType as AscensionIslandType,
  );
  const welcomeMessage = isAscensionIsland
    ? t("islandupgrade.welcomeAscensionIsland", {
        island: getIslandName(islandType),
        level: ascensionLevel,
      })
    : UPGRADE_MESSAGES[islandType];

  return (
    <>
      {createPortal(
        <Transition
          show={showTravelAnimation}
          enter="transform transition-opacity duration-1000"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transform transition-opacity duration-1000"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          as={Fragment}
        >
          <div
            style={{ zIndex: 9999999 }}
            className="bg-black text-white absolute inset-0 pointer-events-none flex justify-center items-center"
          >
            <Loading text={t("islandupgrade.exploring")} />
          </div>
        </Transition>,
        document.body,
      )}

      <Modal show={showModal} onHide={onClose}>
        <IslandUpgraderModal onUpgrade={onUpgrade} onClose={onClose} />
      </Modal>

      <Modal show={showUpgraded}>
        <CloseButtonPanel bumpkinParts={NPC_WEARABLES.grubnuk}>
          <div className="p-2">
            <p className="text-sm mb-2">{welcomeMessage}</p>
            <p className="text-xs mb-2">{UPGRADE_DESCRIPTIONS[islandType]}</p>
            {preview && (
              <img src={preview} className="w-full rounded-md mb-2" />
            )}
            <p className="text-xs mb-2">{t("islandupgrade.itemsReturned")}</p>
          </div>
          <Button onClick={() => setShowUpgraded(false)}>
            {t("continue")}
          </Button>
        </CloseButtonPanel>
      </Modal>

      {upgradeRaft && (
        <MapPlacement
          x={getPosition().x + offset}
          y={getPosition().y}
          width={4}
        >
          <div
            className="absolute cursor-pointer hover:img-highlight"
            onClick={() => setShowModal(true)}
            style={{
              top: `${2 * PIXEL_SCALE}px`,
              left: `${2 * PIXEL_SCALE}px`,
            }}
          >
            <img
              src={upgradeRaft}
              style={{
                width: `${62 * PIXEL_SCALE}px`,
              }}
            />
            <div
              className="absolute"
              style={{
                top: `${16 * PIXEL_SCALE}px`,
                left: `${24 * PIXEL_SCALE}px`,
                width: `${1 * GRID_WIDTH_PX}px`,
                transform: "scaleX(-1)",
              }}
            >
              <NPCPlaceable parts={NPC_WEARABLES["grubnuk"]} />
            </div>
          </div>
        </MapPlacement>
      )}
    </>
  );
};
