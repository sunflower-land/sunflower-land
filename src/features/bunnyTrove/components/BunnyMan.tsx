import React, { useContext, useState } from "react";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { NPC } from "features/island/bumpkin/components/DynamicMiniNFT";
import { Modal } from "react-bootstrap";
import { Equipped } from "features/game/types/bumpkin";
import { Quest } from "features/game/expansion/components/Quest";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

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

  return (
    <>
      <p className="mb-2 text-sm">
        Hey mate, i lost some of my Easter Eggs around, can you find all of
        them?.
      </p>
      <p className="mb-2 text-sm">Eggs Found:</p>
      <p className="mb-2 text-sm">
        Bunny Trove Easter Eggs:{" "}
        {bunnyTroveEggs.filter((egg) => egg.collectedAt).length}/5
      </p>
      <p className="mb-2 text-sm">
        Helios Easter Eggs: {HeliosEggs.filter((egg) => egg.collectedAt).length}
        /1
      </p>
      <p className="mb-2 text-sm">
        Farm Easter Eggs : {MainEggs.filter((egg) => egg.collectedAt).length}/1
      </p>
      <a
        className="mb-4 underline text-sm"
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
