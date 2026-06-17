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
import coinsIcon from "assets/icons/coins.webp";
import { ITEM_DETAILS } from "features/game/types/images";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { useActor, useSelector } from "@xstate/react";
import {
  ISLAND_UPGRADE,
  isLandUpgradable,
  getAscensionUpgradeCost,
} from "features/game/events/landExpansion/upgradeFarm";
import type { CollectibleName } from "features/game/types/craftables";
import { getKeys } from "lib/object";
import { createPortal } from "react-dom";
import confetti from "canvas-confetti";
import type { IslandType } from "features/game/types/game";
import { ASCENSION_ISLANDS } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Transition } from "@headlessui/react";
import { translate } from "lib/i18n/translate";
import { Loading } from "features/auth/components";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";
import type { MachineState } from "features/game/lib/gameMachine";

export const UPGRADE_RAFTS: Record<IslandType, string | null> = {
  basic: SUNNYSIDE.land.springRaft,
  spring: SUNNYSIDE.land.desertRaft,
  desert: SUNNYSIDE.land.volcanoRaft,
  volcano: SUNNYSIDE.land.volcanoRaft, // Next prestige after volcano
  swamp: null, // Next prestige after volcano
};

const UPGRADE_PREVIEW: Record<IslandType, string | null> = {
  basic: null,
  spring: SUNNYSIDE.announcement.springPrestige,
  desert: SUNNYSIDE.announcement.desertPrestige,
  volcano: SUNNYSIDE.announcement.volcanoPrestige,
  swamp: SUNNYSIDE.announcement.volcanoPrestige,
};

const UPGRADE_MESSAGES: Record<IslandType, string | null> = {
  basic: null,
  spring: translate("islandupgrade.welcomePetalParadise"),
  desert: translate("islandupgrade.welcomeDesertIsland"),
  volcano: translate("islandupgrade.welcomeVolcanoIsland"),
  swamp: translate("islandupgrade.welcomeVolcanoIsland"),
};

const UPGRADE_DESCRIPTIONS: Record<IslandType, string | null> = {
  basic: null,
  spring: translate("islandupgrade.exoticResourcesDescription"),
  desert: translate("islandupgrade.desertResourcesDescription"),
  volcano: translate("islandupgrade.volcanoResourcesDescription"),
  swamp: translate("islandupgrade.volcanoResourcesDescription"),
};

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

  const { island, inventory, collectibles, home, coins } =
    gameState.context.state;
  const upgrade = isLandUpgradable(island.type)
    ? ISLAND_UPGRADE[island.type]
    : NO_ISLAND_UPGRADE;
  const { t } = useAppTranslation();

  const remainingExpansions =
    upgrade.expansions - (inventory["Basic Land"]?.toNumber() ?? 0);

  if (showConfirmation) {
    return (
      <Panel>
        <Label type="danger" className="m-1 mb-0">
          {t("warning")}
        </Label>
        <div className="p-2">
          <p className="text-sm">{t("islandupgrade.confirmUpgrade")}</p>
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

  // Ascension upgrades (volcano -> swamp onward) are gated behind the
  // SWAMP_ASCENSION feature flag; basic-island upgrades are unaffected.
  const nextIsland = isLandUpgradable(island.type)
    ? ISLAND_UPGRADE[island.type].upgrade
    : undefined;
  const isAscensionUpgrade =
    !!nextIsland &&
    (ASCENSION_ISLANDS as readonly string[]).includes(nextIsland);
  const flagAllows =
    !isAscensionUpgrade ||
    hasFeatureAccess(gameState.context.state, "SWAMP_ASCENSION");
  const hasUpgrade = isLandUpgradable(island.type) && flagAllows;

  // Ascension upgrades carry their (level-scaled) cost in getAscensionUpgradeCost,
  // not in ISLAND_UPGRADE[...].items (which is empty for them).
  const { items: upgradeItems, coins: upgradeCoins } = isAscensionUpgrade
    ? getAscensionUpgradeCost((island.ascensionLevel ?? 0) + 1)
    : { items: upgrade.items, coins: 0 };

  const hasResources =
    getKeys(upgradeItems).every(
      (name) => inventory[name]?.gte(upgradeItems[name] ?? 0) ?? false,
    ) && coins >= upgradeCoins;

  return (
    <CloseButtonPanel bumpkinParts={NPC_WEARABLES.grubnuk} onClose={onClose}>
      <div className="p-2">
        <div className="flex items-center  mb-2 ">
          <p className="text-sm mr-2">{t("islandupgrade.upgradeIsland")}</p>
          <img src={SUNNYSIDE.icons.heart} className="h-6" />
        </div>
        <p className="text-xs mb-2">{t("islandupgrade.newOpportunities")}</p>
        <p className="text-xs mb-2">{t("islandupgrade.confirmation")}</p>
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
            {t("coming.soon")}
          </Label>
        )}

        {hasUpgrade && (
          <>
            <div className="flex items-center mt-2 mb-1 flex-wrap">
              {remainingExpansions > 0 && (
                <Label
                  icon={SUNNYSIDE.land.island}
                  type="danger"
                  className="mr-3 whitespace-nowrap"
                >
                  {`${remainingExpansions} Expansions Remaining`}
                </Label>
              )}

              {hasUnexpiredItemsPlaced() && (
                <Label
                  icon={SUNNYSIDE.icons.expression_alerted}
                  type="danger"
                  className="mr-3 mb-1"
                >
                  {t("islandupgrade.tempItemWarning")}
                </Label>
              )}
              {getKeys(upgradeItems).map((name) => (
                <Label
                  key={name}
                  icon={ITEM_DETAILS[name].image}
                  className="mr-3 whitespace-nowrap"
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
                  className="mr-3 whitespace-nowrap"
                  type={coins >= upgradeCoins ? "default" : "danger"}
                >{`${upgradeCoins} x Coins`}</Label>
              )}
            </div>
          </>
        )}
      </div>
      <Button
        disabled={!hasUpgrade || !hasResources || remainingExpansions > 0}
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
const _expansionCount = (state: MachineState) =>
  state.context.state.inventory["Basic Land"]?.toNumber() ?? 3;

export const IslandUpgrader: React.FC<Props> = ({ offset }) => {
  const { t } = useAppTranslation();

  const { gameService, showAnimations } = useContext(Context);

  const islandType = useSelector(gameService, _islandType);
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
      return nextExpansion === 31 ? { x: 16, y: 14 } : { x: 9, y: 9 };
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
            <p className="text-sm mb-2">{UPGRADE_MESSAGES[islandType]}</p>
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
