import React, { useContext, useState } from "react";

import springRaft from "assets/land/prestige_raft.png";
import desertRaft from "assets/land/desert_prestige_raft.png";
import springPrestige from "assets/announcements/spring_prestige.png";
import desertPrestige from "assets/announcements/desert_prestige.png";
import lockIcon from "assets/skills/lock.png";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { NPC } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import { Modal } from "react-bootstrap";
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
import classNames from "classnames";
import { createPortal } from "react-dom";
import confetti from "canvas-confetti";
import { ADMIN_IDS, hasFeatureAccess } from "lib/flags";
import { GameState, IslandType } from "features/game/types/game";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";

const UPGRADE_RAFTS: Record<IslandType, string> = {
  basic: springRaft,
  spring: desertRaft,
  desert: desertRaft, // TODO
};

const UPGRADE_PREVIEW: Record<IslandType, string> = {
  basic: springPrestige,
  spring: desertPrestige,
  desert: desertPrestige, // TODO
};

const IslandUpgraderModal: React.FC<{
  onClose: () => void;
  onUpgrade: () => void;
}> = ({ onClose, onUpgrade }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { island, inventory } = gameState.context.state;
  const upgrade = ISLAND_UPGRADE[island.type];

  const remaindingExpansions =
    upgrade.expansions - (inventory["Basic Land"]?.toNumber() ?? 0);

  if (showConfirmation) {
    return (
      <Panel>
        <div className="p-2">
          <p className="text-sm mb-2">
            Are you sure you want to upgrade to a new island.
          </p>

          <p className="text-xs">
            Make sure you do not have any crops, fruit, buildings or chickens in
            progress. These will be returned to your inventory.
          </p>
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
          <Button onClick={() => setShowConfirmation(false)}>No</Button>
          <Button className="ml-1" onClick={onUpgrade}>
            Yes
          </Button>
        </div>
      </Panel>
    );
  }

  const hasAccess =
    gameState.context.state.island.type === "basic" &&
    (hasFeatureAccess(gameState.context.state, "ISLAND_UPGRADE") ||
      ADMIN_IDS.includes(gameState.context.farmId));

  const hasResources = getKeys(upgrade.items).every(
    (name) => inventory[name]?.gte(upgrade.items[name] ?? 0) ?? false
  );

  return (
    <CloseButtonPanel bumpkinParts={NPC_WEARABLES.grubnuk} onClose={onClose}>
      <div className="p-2">
        <div className="flex items-center  mb-2 ">
          <p className="text-sm mr-2">Upgrade Island</p>
          <img src={SUNNYSIDE.icons.heart} className="h-6" />
        </div>
        <p className="text-xs mb-2">
          An exotic island awaits you with new resources and opportunities to
          grow your farm.
        </p>
        <p className="text-xs mb-2">
          Would you like to upgrade? You will start on a small island with all
          of your items.
        </p>
        <img
          src={UPGRADE_PREVIEW[gameState.context.state.island.type] as string}
          className="w-full rounded-md"
        />

        {hasAccess && (
          <>
            <div className="flex items-center mt-2 mb-1">
              {remaindingExpansions > 0 && (
                <Label icon={lockIcon} type="danger" className="mr-3">
                  Locked
                </Label>
              )}
              {getKeys(upgrade.items).map((name) => (
                <Label
                  key={name}
                  icon={ITEM_DETAILS[name].image}
                  className="mr-3"
                  type={
                    inventory[name]?.gte(upgrade.items[name] ?? 0)
                      ? "default"
                      : "danger"
                  }
                >{`${upgrade.items[name]} x ${name}`}</Label>
              ))}
            </div>
            {remaindingExpansions > 0 && (
              <p className="text-xs">{`You are not ready. Expand ${remaindingExpansions} more times`}</p>
            )}
          </>
        )}

        {!hasAccess && (
          <Label icon={lockIcon} type="danger" className="mr-3 my-2">
            {gameState.context.state.island.type === "basic"
              ? "Coming Soon - February 1st"
              : "Coming Soon - May 1st"}
          </Label>
        )}
      </div>
      <Button
        disabled={!hasResources || !hasAccess || remaindingExpansions > 0}
        onClick={() => setShowConfirmation(true)}
      >
        Continue
      </Button>
    </CloseButtonPanel>
  );
};

interface Props {
  gameState: GameState;
  offset: number;
}
export const IslandUpgrader: React.FC<Props> = ({ gameState, offset }) => {
  const { gameService } = useContext(Context);

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
    confetti();
  };

  const onClose = () => {
    if (showTravelAnimation) {
      return;
    }
    setShowModal(false);
  };

  return (
    <>
      {createPortal(
        <div
          style={{
            zIndex: 9999999,
            transition: "opacity 1.25s ease-in-out",
          }}
          className={classNames(
            "bg-black absolute z-10 inset-0  opacity-0 pointer-events-none flex justify-center items-center",
            {
              "opacity-100": showTravelAnimation,
            }
          )}
        >
          <span className="loading">Exploring</span>
        </div>,
        document.body
      )}
      <Modal show={showModal} centered onHide={onClose}>
        <IslandUpgraderModal onUpgrade={onUpgrade} onClose={onClose} />
      </Modal>

      <Modal show={showUpgraded} centered>
        <CloseButtonPanel bumpkinParts={NPC_WEARABLES.grubnuk}>
          <div className="p-2">
            <p className="text-sm mb-2">Welcome to Petal Paradise!</p>
            <p className="text-xs mb-2">
              {`This area of Sunflower Land is known for it's exotic resources.
              Expand your land to discover fruit, flowers, bee hives & rare
              gems!`}
            </p>
            <img
              src={UPGRADE_PREVIEW.basic}
              className="w-full rounded-md mb-2"
            />
            <p className="text-xs mb-2">
              Your items have been safely returned to your inventory.
            </p>
          </div>
          <Button onClick={() => setShowUpgraded(false)}>Continue</Button>
        </CloseButtonPanel>
      </Modal>

      <MapPlacement x={7 + offset} y={0} width={4}>
        <div
          className="absolute cursor-pointer hover:img-highlight"
          onClick={() => setShowModal(true)}
          style={{
            top: `${2 * PIXEL_SCALE}px`,
            left: `${2 * PIXEL_SCALE}px`,
          }}
        >
          <img
            src={UPGRADE_RAFTS[island]}
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
    </>
  );
};
