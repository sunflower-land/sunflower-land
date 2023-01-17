import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import npc from "assets/npcs/dragon_hat_npc.gif";
import shadow from "assets/npcs/shadow.png";
import envelopes from "assets/icons/red_envelope.png";
import island from "assets/events/chinese-new-year/chinese_island.png";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import { Quest } from "./Quest";
import { Panel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { Equipped } from "features/game/types/bumpkin";

const resourceToFindRedEnvelopes: { [key: number]: string } = {
  21: "Beetroots",
  22: "Trees",
  23: "Cauliflowers",
  24: "Potatoes",
  25: "Parsnips",
  26: "Cabbages",
  27: "Sunflowers",
};

const todaysFind = resourceToFindRedEnvelopes[new Date().getDate()];

const ModalEventComing = () => {
  return (
    <div>
      <p className="mb-4">
        We are working hard to organise a beautiful Spring Festival for all
        farmers.
      </p>
      <p className="mb-4">
        {`The festivities start on ${new Date(
          "2023-01-21T00:00:00+08:00"
        ).toDateString()}`}
      </p>
    </div>
  );
};

const ModalDescription = () => {
  return (
    <>
      <div>
        <p className="mb-4">
          Amid the sound of firecrackers a year has come to an end and to
          welcome the new year farmers will find Red Envelopes on different
          places everyday.
        </p>
        <p className="mb-4">
          {`There are rumours a few lucky farmers are finding Red Envelopes while harvesting on ${todaysFind} today.`}
        </p>
        <p className="mb-4">萬事如意</p>
        <div className="flex justify-center mb-4">
          <img
            src={envelopes}
            className="mr-2 img-highlight"
            style={{
              height: `${PIXEL_SCALE * 20}px`,
            }}
          />
        </div>
      </div>
    </>
  );
};

const QuestCompletion = () => {
  return (
    <div className="pr-4 pl-2 py-2">
      <p className="mb-3">
        Wow, you are really lucky finding all these Red Envelopes!
      </p>
      <p>
        {`I have no more gifts for you. Don't forget to wear your new
          items!`}
      </p>
    </div>
  );
};

export const ChineseNewYearQuest: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const bumpkin: Partial<Equipped> = {
    body: "Beige Farmer Potion",
    hair: "Basic Hair",
    pants: "Blue Suspenders",
    shirt: "Blue Farmer Shirt",
    tool: "Sword",
    shoes: "Black Farmer Boots",
    background: "Farm Background",
    // hat: "Lion Dance Mask",
  };

  return (
    <>
      <img
        src={island}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 226}px`,
          bottom: `${GRID_WIDTH_PX * 10}px`,
          left: `${GRID_WIDTH_PX * -21}px`,
        }}
      />
      <div
        className="absolute z-20"
        style={{
          top: `${GRID_WIDTH_PX * 24}px`,
          left: `${GRID_WIDTH_PX * -12}px`,
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
        {!todaysFind ? (
          <Panel bumpkinParts={bumpkin}>
            <img
              src={SUNNYSIDE.icons.close}
              className="absolute cursor-pointer z-20"
              onClick={() => setShowModal(false)}
              style={{
                top: `${PIXEL_SCALE * 6}px`,
                right: `${PIXEL_SCALE * 6}px`,
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
            {ModalEventComing()}
          </Panel>
        ) : (
          <Quest
            quests={["Chinese New Year Quest 1", "Chinese New Year Quest 2"]}
            onClose={() => setShowModal(false)}
            questTitle="Happy Chinese New Year!"
            questDescription={ModalDescription()}
            bumpkinParts={bumpkin}
            questCompletionScreen={QuestCompletion()}
          />
        )}
      </Modal>
    </>
  );
};
