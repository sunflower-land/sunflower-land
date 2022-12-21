import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";
import { useInterpret } from "@xstate/react";

import npc from "assets/npcs/reindeer.gif";
import shadow from "assets/npcs/shadow.png";
import closeIcon from "assets/icons/close.png";
import carrots from "assets/food/reindeer_carrot.png";
import firePit from "assets/buildings/fire_pit.png";

import * as AuthProvider from "features/auth/lib/Provider";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Panel } from "components/ui/Panel";
import { QuestName, QUESTS } from "features/game/types/quests";
import { Button } from "components/ui/Button";
import { QuestProgress } from "features/island/farmerQuest/components/QuestProgress";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { CONFIG } from "lib/config";
import { Context } from "features/game/GameProvider";

import { MachineInterpreter, questMachine } from "../lib/quest/questMachine";

const END_DATE = new Date("2022-12-28");

const REINDEER_QUESTS: QuestName[] = [
  "Reindeer Quest 1",
  "Reindeer Quest 2",
  "Reindeer Quest 3",
];

interface Props {
  onClose: () => void;
}
export const ReindeerModal: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const questService = useInterpret(questMachine, {
    context: {
      quests: REINDEER_QUESTS,
      bumpkinId: gameState.context.state.bumpkin?.id as number,
      jwt: authState.context.rawToken,
      farmId: authState.context.farmId,
    },
  }) as unknown as MachineInterpreter;

  const [state, send] = useActor(questService);

  const close = () => {
    if (state.matches("loading") || state.matches("minting")) {
      return;
    }

    onClose();
  };
  const Content = () => {
    if (state.matches("introduction")) {
      return (
        <div className="py-1 pl-1 flex flex-col justify-center pr-4">
          <p className="mb-3">
            Oh ohhhh. I ate too many carrots and turned into a Reindeer.
          </p>
          <p className="mb-3">
            I need some friends. If you eat some Reindeer Carrots I will give
            you free Bumpkin clothing.
          </p>
          <div className="flex justify-center mb-2">
            <img
              src={firePit}
              className="mr-2 img-highlight"
              style={{
                height: `${PIXEL_SCALE * 20}px`,
              }}
            />
            <img
              src={carrots}
              className="img-highlight"
              style={{
                height: `${PIXEL_SCALE * 20}px`,
              }}
            />
          </div>
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
      return (
        <div className="h-24">
          <span className="">Something went wrong!</span>
        </div>
      );
    }

    if (state.matches("complete")) {
      return (
        <div className="pr-4 pl-2 py-2">
          <p className="mb-3">
            Wow, you really do love Reindeer Carrots as much as I do!
          </p>
          <p>
            {`I have no more gifts for you. Don't forget to wear your new
            clothing!`}
          </p>
        </div>
      );
    }

    if (state.matches("idle")) {
      return (
        <QuestProgress
          onClaim={() => send("MINT")}
          questName={state.context.currentQuest as QuestName}
          secondsLeft={Math.floor((END_DATE.getTime() - Date.now()) / 1000)}
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
      <img
        src={closeIcon}
        className="absolute cursor-pointer z-20"
        onClick={close}
        style={{
          top: `${PIXEL_SCALE * 6}px`,
          right: `${PIXEL_SCALE * 6}px`,
          width: `${PIXEL_SCALE * 11}px`,
        }}
      />
      {Content()}
    </Panel>
  );
};

export const ReindeerQuest: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className="absolute z-20"
        style={{
          left: `${GRID_WIDTH_PX * 16}px`,
          top: `${GRID_WIDTH_PX * 35}px`,
        }}
      >
        <img
          src={shadow}
          className="absolute z-10"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * -2}px`,
          }}
        />
        <img
          src={npc}
          className="relative left-0 top-0 cursor-pointer hover:img-highlight z-20"
          onClick={() => setShowModal(true)}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
          }}
        />
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <ReindeerModal onClose={() => setShowModal(false)} />
      </Modal>
    </>
  );
};
