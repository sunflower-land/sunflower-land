import React, { Fragment, useContext, useState } from "react";

import springRaft from "assets/land/prestige_raft.png";
import desertRaft from "assets/land/desert_prestige_raft.png";
import springPrestige from "assets/announcements/spring_prestige.png";
import desertPrestige from "assets/announcements/desert_prestige.png";
import lockIcon from "assets/skills/lock.png";
import land from "assets/land/islands/island.webp";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { NPC } from "features/island/bumpkin/components/NPC";
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
import { useActor } from "@xstate/react";
import { ISLAND_UPGRADE } from "features/game/events/landExpansion/upgradeFarm";
import { getKeys } from "features/game/types/craftables";
import { createPortal } from "react-dom";
import confetti from "canvas-confetti";
import { GameState, IslandType } from "features/game/types/game";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Transition } from "@headlessui/react";
import { formatDateTime } from "lib/utils/time";
import { translate } from "lib/i18n/translate";
import { Loading } from "features/auth/components";

const UPGRADE_DATES: (state: GameState) => Record<IslandType, number | null> = (
  state,
) => ({
  basic: new Date(0).getTime(),
  spring: new Date("2024-05-15T00:00:00Z").getTime(),
  desert: null, // Next prestige after desert
});

const UPGRADE_RAFTS: Record<IslandType, string | null> = {
  basic: springRaft,
  spring: desertRaft,
  desert: null, // Next prestige after desert
};

const UPGRADE_PREVIEW: Record<IslandType, string | null> = {
  basic: springPrestige,
  spring: desertPrestige,
  desert: null, // Next prestige after desert
};

const UPGRADE_MESSAGES: Record<IslandType, string | null> = {
  basic: null,
  spring: translate("islandupgrade.welcomePetalParadise"),
  desert: translate("islandupgrade.welcomeDesertIsland"),
};

const UPGRADE_DESCRIPTIONS: Record<IslandType, string | null> = {
  basic: null,
  spring: translate("islandupgrade.exoticResourcesDescription"),
  desert: translate("islandupgrade.desertResourcesDescription"),
};

const IslandUpgraderModal: React.FC<{
  onClose: () => void;
  onUpgrade: () => void;
}> = ({ onClose, onUpgrade }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const { island, inventory } = gameState.context.state;
  const upgrade = ISLAND_UPGRADE[island.type];
  const { t } = useAppTranslation();

  const remainingExpansions =
    upgrade.expansions - (inventory["Basic Land"]?.toNumber() ?? 0);

  if (showConfirmation) {
    return (
      <Panel>
        <div className="p-2">
          <p className="text-sm mb-2">{t("islandupgrade.confirmUpgrade")}</p>

          <p className="text-xs">{t("islandupgrade.warning")}</p>
          <div className="flex my-2">
            {getKeys(upgrade.items).map((name) => (
              <Label
                key={name}
                icon={ITEM_DETAILS[name].image}
                className="mr-3"
                type="default"
              >{`${upgrade.items[name]} ${name}`}</Label>
            ))}
          </div>
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

  const upgradeDate = UPGRADE_DATES(gameState.context.state)[island.type];
  const hasUpgrade = upgradeDate !== null;
  const isReady = hasUpgrade && upgradeDate < Date.now();

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
          <Label icon={lockIcon} type="danger" className="mr-3 my-2">
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
                  icon={land}
                  type="danger"
                  className="mr-3 whitespace-nowrap"
                >
                  {`${remainingExpansions} Expansions Remaining`}
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
  gameState: GameState;
  offset: number;
}
export const IslandUpgrader: React.FC<Props> = ({ gameState, offset }) => {
  const { t } = useAppTranslation();

  const { gameService, showAnimations } = useContext(Context);

  const [showModal, setShowModal] = useState(false);

  const [showTravelAnimation, setShowTravelAnimation] = useState(false);
  const [showUpgraded, setShowUpgraded] = useState(false);

  const island = gameState.island.type ?? "basic";

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

    scrollIntoView(Section.Home, "auto");

    setShowTravelAnimation(false);
    if (showAnimations) confetti();
  };

  const nextExpansioon =
    (gameState.inventory["Basic Land"]?.toNumber() ?? 3) + 1;

  const getPosition = () => {
    if (island === "basic" && nextExpansioon == 10) {
      return { x: 1, y: -5 };
    }

    return { x: 7, y: 0 };
  };

  const onClose = () => {
    if (showTravelAnimation) {
      return;
    }
    setShowModal(false);
  };

  const upgradeRaft = UPGRADE_RAFTS[island];
  const preview = UPGRADE_PREVIEW[island];

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
            className="bg-black absolute z-10 inset-0 pointer-events-none flex justify-center items-center"
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
            <p className="text-sm mb-2">
              {UPGRADE_MESSAGES[gameState.island.type]}
            </p>
            <p className="text-xs mb-2">
              {UPGRADE_DESCRIPTIONS[gameState.island.type]}
            </p>
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
              <NPC parts={NPC_WEARABLES["grubnuk"]} />
            </div>
          </div>
        </MapPlacement>
      )}
    </>
  );
};
