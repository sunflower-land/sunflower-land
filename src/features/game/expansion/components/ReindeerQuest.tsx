import React, { useContext, useState } from "react";

import npc from "assets/npcs/idle.gif";
import { MapPlacement } from "./MapPlacement";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Quest, QuestName, QUESTS } from "features/game/types/quests";
import { useInterpret } from "@xstate/react";
import { MachineInterpreter, questMachine } from "../lib/quest/questMachine";
import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { QuestProgress } from "features/island/farmerQuest/components/QuestProgress";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { CONFIG } from "lib/config";
import { Context } from "features/game/GameProvider";

const REINDEER_QUESTS: QuestName[] = [
  "Reindeer Quest 1",
  "Reindeer Quest 2",
  "Reindeer Quest 3",
];

export const ReindeerModal: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const questService = useInterpret(questMachine, {
    context: {
      quests: REINDEER_QUESTS,
      bumpkinId: gameState.context.state.bumpkin?.id as number,
    },
  }) as unknown as MachineInterpreter;

  const [state, send] = useActor(questService);

  const Content = () => {
    console.log({ value: state.value });
    if (state.matches("introduction")) {
      return (
        <div className="p-1">
          <p className="mb-3">I love Reindeer Carrots!</p>
          <p className="mb-3">
            I will share some gifts for those that can eat enough Reindeer
            Carrots.
          </p>
          <Button onClick={() => send("CONTINUE")}>Continue</Button>
        </div>
      );
    }

    if (state.matches("loading")) {
      return (
        <div className="h-24">
          <span className="loading ">Loading</span>
        </div>
      );
    }

    const quest = QUESTS[state.context.currentQuest as QuestName];

    if (state.matches("minting")) {
      return (
        <div className="h-24">
          <span className="loading ">Minting</span>
        </div>
      );
    }

    if (state.matches("error")) {
      return <span>Something went wrong!</span>;
    }

    if (state.matches("complete")) {
      return (
        <div>
          <p className="mb-3">
            Wow, you really do love Reindeer Carrots as much as I do!
          </p>
          <p>
            I have no more gifts for you. Don't forget to wear your new
            clothing!
          </p>
        </div>
      );
    }

    if (state.matches("idle")) {
      return (
        <QuestProgress
          onClaim={() => send("MINT")}
          questName={state.context.currentQuest as QuestName}
        />
      );
    }

    if (state.matches("minted")) {
      const bumpkinUrl =
        CONFIG.NETWORK === "mainnet"
          ? `https://bumpkins.io/#/bumpkins/${gameState.context.state.bumpkin?.id}`
          : `https://testnet.bumpkins.io/#/bumpkins/${gameState.context.state.bumpkin?.id}`;

      return (
        <div className="p-1 flex flex-col items-center">
          <p className="mb-1">Congratulations!</p>
          <img
            src={getImageUrl(ITEM_IDS[quest.wearable])}
            className="w-1/3 my-2 rounded-lg"
          />
          <p className="text-sm mb-3">{`You minted a ${quest.wearable}`}</p>
          <p className="text-sm mb-3">
            Go to{" "}
            <a
              href={bumpkinUrl}
              target="_blank"
              className="underline"
              rel="noreferrer"
            >
              Bumpkins.io
            </a>{" "}
            to equip this item
          </p>
          <Button onClick={() => send("CONTINUE")}>Continue</Button>
        </div>
      );
    }

    return null;
  };

  return (
    <Panel
      bumpkinParts={{
        body: "Beige Farmer Potion",
        hair: "Buzz Cut",
        suit: "Reindeer Suit",
        shirt: "Red Farmer Shirt",
        hat: "Reindeer Antlers",
        tool: "Farmer Pitchfork",
      }}
    >
      {Content()}
    </Panel>
  );
};

export const ReindeerQuest: React.FC = () => {
  const [showModal, setShowModal] = useState(true);

  return (
    <>
      <MapPlacement x={5} y={-5}>
        <img
          src={npc}
          className="cursor-pointer hover:img-highlight"
          onClick={() => setShowModal(true)}
          style={{
            width: `${PIXEL_SCALE * 15}px`,
          }}
        />
      </MapPlacement>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <ReindeerModal />
      </Modal>
    </>
  );
};
