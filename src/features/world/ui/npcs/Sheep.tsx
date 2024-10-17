import React, { useContext, useEffect, useState } from "react";
import { NPC_WEARABLES, acknowledgeNPC } from "lib/npcs";
import { Modal } from "components/ui/Modal";
import { SpeakingModal } from "features/game/components/SpeakingModal";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PlayerGift } from "../PlayerModals";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { NPCBumpkin } from "features/world/scenes/BaseScene";

type Player = {
  id: number;
  clothing: BumpkinParts;
  experience: number;
};

interface Props {
  onClose: () => void;
}
export const Sheep: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showGG, setShowGG] = useState(false);
  const [player] = useState<Player>();
  const [tab, setTab] = useState(0);

  useEffect(() => {
    acknowledgeNPC("sheep");
  }, []);

  const { pumpkinPlaza } = gameState.context.state;

  const openedAt = pumpkinPlaza.giftGiver?.openedAt ?? 0;

  // Have they opened one today already?
  const hasOpened =
    !!openedAt &&
    new Date(openedAt).toISOString().substring(0, 10) ===
      new Date().toISOString().substring(0, 10);
  const closeModal = () => {
    onClose();
  };

  if (showGG) {
    return (
      <>
        <Modal show={showGG} onHide={closeModal}>
          <CloseButtonPanel
            onClose={closeModal}
            bumpkinParts={player?.clothing}
            currentTab={tab}
            setCurrentTab={setTab}
            tabs={[
              {
                icon: SUNNYSIDE.icons.heart,
                name: "Gift Giver",
              },
            ]}
          >
            <PlayerGift player={player as Player} />
          </CloseButtonPanel>
        </Modal>
      </>
    );
  }
  if (hasOpened) {
    return (
      <SpeakingModal
        onClose={closeModal}
        bumpkinParts={NPC_WEARABLES.sheep}
        message={[
          {
            text: t("npcDialogues.sheep.intro1"),
          },
          {
            text: t("npcDialogues.sheep.intro2"),
          },
        ]}
      />
    );
  } else {
    return (
      <SpeakingModal
        onClose={() => {
          onClose();
        }}
        bumpkinParts={NPC_WEARABLES.sheep}
        message={[
          {
            text: t("npcDialogues.sheep.intro1"),
          },
          {
            text: t("npcDialogues.sheep.intro2"),
            actions: [
              {
                text: t("claim.gift"),
                cb: () => setShowGG(true),
              },
            ],
          },
        ]}
      />
    );
  }
};

const todayUTC = Math.floor(
  (new Date().getTime() -
    new Date(new Date().getUTCFullYear(), 0, 0).getTime()) /
    1000 /
    60 /
    60 /
    24,
); // Day of the year (0-365/366)

// Define a type for the valid scene names
type SceneName = "plaza" | "beach" | "kingdom" | "woodlands";

// Get sheep coordinates based on the current day of the week (UTC)
export const getSheepCoords = (scene: SceneName) => {
  const SHEEP_COORDINATES: Record<SceneName, { x: number; y: number }[]> = {
    plaza: [
      { x: 469, y: 69 },
      { x: 50, y: 440 },
      { x: 290, y: 158 },
      { x: 680, y: 95 },
      { x: 95, y: 212 },
      { x: 87, y: 339 },
      { x: 175, y: 62 },
    ],
    beach: [
      { x: 450, y: 140 },
      { x: 100, y: 75 },
      { x: 368, y: 45 },
      { x: 332, y: 548 },
      { x: 273, y: 665 },
      { x: 469, y: 660 },
      { x: 313, y: 775 },
    ],
    kingdom: [
      { x: 75, y: 40 },
      { x: 432, y: 519 },
      { x: 50, y: 675 },
      { x: 348, y: 172 },
      { x: 84, y: 306 },
      { x: 17, y: 425 },
      { x: 200, y: 350 },
    ],
    woodlands: [
      { x: 127, y: 102 },
      { x: 133, y: 37 },
      { x: 278, y: 144 },
      { x: 170, y: 267 },
      { x: 341, y: 39 },
      { x: 350, y: 35 },
      { x: 218, y: 96 },
    ],
  };

  // Return coordinates for the given scene and day
  return SHEEP_COORDINATES[scene][todayUTC % SHEEP_COORDINATES[scene].length];
};

// Get sheep location based on the current day of the week (UTC)
export const sheepPlace = (): SceneName => {
  const SCENE_NAMES = Object.keys({
    plaza: {},
    beach: {},
    kingdom: {},
    woodlands: {},
  }) as SceneName[];

  return SCENE_NAMES[todayUTC % SCENE_NAMES.length];
};

// Remove after release
// Get the scene where the sheep should appear today
const todayPlace = sheepPlace();
const coord = getSheepCoords(todayPlace);
export const EVENT_BUMPKINS: NPCBumpkin[] = [
  {
    x: coord.x,
    y: coord.y,
    npc: "sheep",
  },
];
