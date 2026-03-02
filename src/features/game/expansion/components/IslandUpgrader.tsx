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
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { useActor, useSelector } from "@xstate/react";
import { ISLAND_UPGRADE } from "features/game/events/landExpansion/upgradeFarm";
import { CollectibleName, getKeys } from "features/game/types/craftables";
import { createPortal } from "react-dom";
import confetti from "canvas-confetti";
import { IslandType } from "features/game/types/game";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Transition } from "@headlessui/react";
import { formatDateTime } from "lib/utils/time";
import { translate } from "lib/i18n/translate";
import { Loading } from "features/auth/components";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";
import { MachineState } from "features/game/lib/gameMachine";
import { useNow } from "lib/utils/hooks/useNow";

const UPGRADE_DATES: Record<IslandType, number | null> = {
  basic: new Date(0).getTime(),
  spring: new Date("2024-05-15T00:00:00Z").getTime(),
  desert: new Date("2025-02-03T00:00:00Z").getTime(),
  volcano: null, // Next prestige after volcano
};

export const UPGRADE_RAFTS: Record<IslandType, string | null> = {
  basic: SUNNYSIDE.land.springRaft,
  spring: SUNNYSIDE.land.desertRaft,
  desert: SUNNYSIDE.land.volcanoRaft,
  volcano: null, // Next prestige after volcano
};

const UPGRADE_PREVIEW: Record<IslandType, string | null> = {
  basic: null,
  spring: SUNNYSIDE.announcement.springPrestige,
  desert: SUNNYSIDE.announcement.desertPrestige,
  volcano: SUNNYSIDE.announcement.volcanoPrestige,
};

const UPGRADE_MESSAGES: Record<IslandType, string | null> = {
  basic: null,
  spring: translate("islandupgrade.welcomePetalParadise"),
  desert: translate("islandupgrade.welcomeDesertIsland"),
  volcano: translate("islandupgrade.welcomeVolcanoIsland"),
};

const UPGRADE_DESCRIPTIONS: Record<IslandType, string | null> = {
  basic: null,
  spring: translate("islandupgrade.exoticResourcesDescription"),
  desert: translate("islandupgrade.desertResourcesDescription"),
  volcano: translate("islandupgrade.volcanoResourcesDescription"),
};

const IslandUpgraderModal: React.FC<{
  onClose: () => void;
  onUpgrade: () => void;
}> = ({ onClose, onUpgrade }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const now = useNow();

  const [showConfirmation, setShowConfirmation] = useState(false);

  const { island, inventory, collectibles, home } = gameState.context.state;
  const upgrade = ISLAND_UPGRADE[island.type];
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

  const upgradeDate = UPGRADE_DATES[island.type];
  const hasUpgrade = upgradeDate !== null;
  const isReady = hasUpgrade && upgradeDate <= now;

  const hasResources = getKeys(upgrade.items).every(
    (name) => inventory[name]?.gte(upgrade.items[name] ?? 0) ?? false,
  );

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
              {!isReady && (
                <Label
                  icon={SUNNYSIDE.icons.stopwatch}
                  type="danger"
                  className="mr-3 my-2 whitespace-nowrap"
                >
                  {`${t("coming.soon")} - ${formatDateTime(
                    new Date(upgradeDate).toISOString(),
                  )}`}
                </Label>
              )}
              {remainingExpansions > 0 && (
                <Label
                  icon={SUNNYSIDE.land.island}
                  type="danger"
                  className="mr-3 whitespace-nowrap"
                >
                  {`${remainingExpansions} Expansions Remaining`}
                </Label>
              )}

              {isReady && hasUnexpiredItemsPlaced() && (
                <Label
                  icon={SUNNYSIDE.icons.expression_alerted}
                  type="danger"
                  className="mr-3 mb-1"
                >
                  {t("islandupgrade.tempItemWarning")}
                </Label>
              )}
              {getKeys(upgrade.items).map((name) => (
                <Label
                  key={name}
                  icon={ITEM_DETAILS[name].image}
                  className="mr-3 whitespace-nowrap"
                  type={
                    inventory[name]?.gte(upgrade.items[name] ?? 0)
                      ? "default"
                      : "danger"
                  }
                >{`${upgrade.items[name]} x ${name}`}</Label>
              ))}
            </div>
          </>
        )}
      </div>
      <Button
        disabled={
          !hasUpgrade || !hasResources || !isReady || remainingExpansions > 0
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
    gameService.send({ type: "PAUSE" });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    gameService.send({ type: "farm.upgraded" });
    gameService.send({ type: "SAVE" });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setShowUpgraded(true);

    gameService.send({ type: "PLAY" });

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
