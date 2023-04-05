import React, { useContext, useState } from "react";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { NPC } from "features/island/bumpkin/components/DynamicMiniNFT";
import { Modal } from "react-bootstrap";
import { Equipped } from "features/game/types/bumpkin";
import { Quest } from "features/game/expansion/components/Quest";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { ResizableBar } from "components/ui/ProgressBar";
import { setPrecision } from "lib/utils/formatNumber";
import Decimal from "decimal.js-light";

const ModalDescription = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { state } = gameState.context;

  const bunnyTroveEggs = state.easterHunt?.eggs.filter(
    (egg) => egg && egg.island === "Bunny Trove"
  );
  const HeliosEggs = state.easterHunt?.eggs.filter(
    (egg) => egg && egg.island === "Helios"
  );
  const MainEggs = state.easterHunt?.eggs.filter(
    (egg) => egg && egg.island === "Main"
  );

  const bunnyTroveEggsCollected = bunnyTroveEggs.filter(
    (egg) => egg.collectedAt
  ).length;
  const heliosEggsCollected = HeliosEggs.filter(
    (egg) => egg.collectedAt
  ).length;
  const mainIslandEggsCollected = MainEggs.filter(
    (egg) => egg.collectedAt
  ).length;

  // const progressPercentage = Math.min(1, progress / quest.requirement) * 100;
  const progressPercentage = (collected: number, requirement: number) => {
    return Math.min(1, collected / requirement) * 100;
  };

  return (
    <>
      <p className="mb-3 text-sm">
        Hey mate, I lost some of my Easter Eggs around. Can you find all of
        them?
      </p>
      <p className="text-sm">Easter Eggs Found for the last 12hrs:</p>
      <p className="mt-5 text-sm">Bunny Trove Easter Eggs</p>
      <div className="flex items-center my-1.5">
        <ResizableBar
          percentage={progressPercentage(bunnyTroveEggsCollected, 5)}
          type="progress"
          outerDimensions={{
            width: 80,
            height: 10,
          }}
        />
        <span className="text-xxs ml-2">{`${setPrecision(
          new Decimal(bunnyTroveEggsCollected)
        )}/5`}</span>
      </div>
      <p className="mt-3 text-sm">Helios Easter Eggs</p>
      <div className="flex items-center my-1.5">
        <ResizableBar
          percentage={progressPercentage(heliosEggsCollected, 1)}
          type="progress"
          outerDimensions={{
            width: 80,
            height: 10,
          }}
        />
        <span className="text-xxs ml-2">{`${setPrecision(
          new Decimal(heliosEggsCollected)
        )}/1`}</span>
      </div>
      <p className="mt-3 text-sm">Farm Easter Eggs</p>
      <div className="flex items-center my-1.5">
        <ResizableBar
          percentage={progressPercentage(mainIslandEggsCollected, 1)}
          type="progress"
          outerDimensions={{
            width: 80,
            height: 10,
          }}
        />
        <span className="text-xxs ml-2">{`${setPrecision(
          new Decimal(mainIslandEggsCollected)
        )}/1`}</span>
      </div>
      <a
        className="underline text-xxs pb-2 pt-3 hover:text-blue-500"
        href="https://docs.sunflower-land.com/player-guides/special-events/bunny-trove"
        target="_blank"
        rel="noreferrer"
      >
        Read more
      </a>
    </>
  );
};

const QuestCompletion = () => {
  return (
    <div className="p-2">
      <p className="mb-2">
        Wow, you are really lucky finding all these Easter Eggs!
      </p>
      <p>
        {`I have no more gifts for you. Don't forget to wear your new
          items!`}
      </p>
    </div>
  );
};

export const BunnyMan: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const bumpkin: Partial<Equipped> = {
    body: "Beige Farmer Potion",
    shirt: "Red Farmer Shirt",
    pants: "Brown Suspenders",
    hair: "Sun Spots",
    tool: "Sword",
    shoes: "Black Farmer Boots",
    background: "Farm Background",
    onesie: "Bunny Onesie",
  };

  return (
    <>
      <MapPlacement x={-7.1} y={1.5} height={1} width={1}>
        <div className="relative w-full h-full hover:cursor-pointer hover:img-highlight">
          <NPC
            body="Beige Farmer Potion"
            shirt="Red Farmer Shirt"
            pants="Brown Suspenders"
            hair="Sun Spots"
            onesie="Bunny Onesie"
            onClick={() => setShowModal(true)}
          />
        </div>
      </MapPlacement>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Quest
          quests={["Easter Quest 1"]}
          onClose={() => setShowModal(false)}
          questTitle="Lost Eggs!"
          questDescription={ModalDescription()}
          bumpkinParts={bumpkin}
          questCompletionScreen={QuestCompletion()}
        />
      </Modal>
    </>
  );
};
