import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import npc from "assets/npcs/dragon_hat_npc.gif";
import shadow from "assets/npcs/shadow.png";
import envelopes from "assets/icons/red_envelope.png";
import island from "assets/events/lunar-new-year/new_year_island.png";
import mrChu from "assets/events/lunar-new-year/mr_chu.gif";
import lampNpc from "assets/events/lunar-new-year/lamp_npc.gif";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import { Quest } from "./Quest";
import { Equipped } from "features/game/types/bumpkin";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

import luckySign from "assets/quest/luck_sign.png";
import { LunarNewYearDonation } from "features/community/lunarNewYear/LunarNewYearDonation";

const resourceToFindRedEnvelopes: { [key: number]: string } = {
  20: "beetroots",
  21: "trees",
  22: "cauliflowers",
  23: "potatoes",
  24: "parsnips",
  25: "cabbages",
  26: "sunflowers",
};

const day = new Date().getUTCDate();
const todaysFind = resourceToFindRedEnvelopes[day];

const ModalEventComing = () => {
  return (
    <div className="p-2">
      <div className="flex w-full justify-center">
        <img
          src={luckySign}
          alt="lucky sign"
          className="mb-4"
          style={{ width: `${PIXEL_SCALE * 31}px` }}
        />
      </div>
      <p className="mb-2 text-sm text-left">
        Dragon dance and lion dance, red lantern and fireworks, Lunar New Year
        event is coming soon.
      </p>
      <p className="mb-2 text-sm text-left">
        {`The festivities start on ${new Date(
          "2023-01-20T00:00:00+00:00"
        ).toLocaleString()}`}
      </p>
      <a
        className="mb-4 underline text-sm"
        href="https://docs.sunflower-land.com/player-guides/special-events/lunar-new-year"
        target="_blank"
        rel="noreferrer"
      >
        Read more
      </a>
    </div>
  );
};

const ModalDescription = () => {
  return (
    <>
      <div className="flex justify-center mb-3">
        <img
          src={envelopes}
          className="img-highlight"
          style={{
            height: `${PIXEL_SCALE * 20}px`,
          }}
        />
      </div>
      <p className="mb-2 text-sm">
        Amid the sound of firecrackers, a year has come to an end. To celebrate
        the New Year, some special red envelopes have been hidden among the
        crops and trees.
      </p>
      <p className="mb-2 text-sm">
        There are rumours a few lucky farmers are finding these envelopes among
        their <span className="underline">{todaysFind}</span> today.
      </p>
      <a
        className="mb-4 underline text-sm"
        href="https://docs.sunflower-land.com/player-guides/special-events/lunar-new-year"
        target="_blank"
        rel="noreferrer"
      >
        Read more
      </a>
      <p className="mb-2 text-sm text-center">萬事如意</p>
    </>
  );
};

const QuestCompletion = () => {
  return (
    <div className="p-2">
      <p className="mb-2">
        Wow, you are really lucky finding all these Red Envelopes!
      </p>
      <p>
        {`I have no more gifts for you. Don't forget to wear your new
          items!`}
      </p>
    </div>
  );
};

export const LunarNewYearQuest: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDonation, setShowDonation] = React.useState(false);

  const bumpkin: Partial<Equipped> = {
    body: "Beige Farmer Potion",
    hair: "Basic Hair",
    pants: "Blue Suspenders",
    shirt: "Blue Farmer Shirt",
    tool: "Sword",
    shoes: "Black Farmer Boots",
    background: "Farm Background",
    hat: "Lion Dance Mask",
  };

  if (Date.now() >= new Date("2023-01-28T00:00:00+00:00").getTime()) {
    return null;
  }

  return (
    <>
      <img
        src={island}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 212}px`,
          bottom: `${GRID_WIDTH_PX * 10}px`,
          left: `${GRID_WIDTH_PX * -21}px`,
        }}
      />

      <img
        src={lampNpc}
        className="absolute z-20 hover:cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          bottom: `${GRID_WIDTH_PX * 13.98}px`,
          left: `${GRID_WIDTH_PX * -9.8}px`,
        }}
        onClick={() => setShowDonation(true)}
      />

      <div
        className="absolute z-20"
        style={{
          top: `${GRID_WIDTH_PX * 19}px`,
          left: `${GRID_WIDTH_PX * -19}px`,
        }}
      >
        <img
          src={shadow}
          className="absolute z-10"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 4}px`,
            left: `${PIXEL_SCALE * 2}px`,
          }}
        />
        <img
          src={mrChu}
          className="relative left-0 top-0 z-20"
          style={{
            width: `${PIXEL_SCALE * 21}px`,
          }}
        />
      </div>
      <div
        className="absolute z-20"
        style={{
          top: `${GRID_WIDTH_PX * 24}px`,
          left: `${GRID_WIDTH_PX * -15}px`,
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
          <CloseButtonPanel
            title="The New Year is coming!"
            bumpkinParts={bumpkin}
            onClose={() => setShowModal(false)}
          >
            {ModalEventComing()}
          </CloseButtonPanel>
        ) : (
          <Quest
            quests={["Lunar New Year Quest 1", "Lunar New Year Quest 2"]}
            onClose={() => setShowModal(false)}
            questTitle="Happy Lunar New Year!"
            questDescription={ModalDescription()}
            bumpkinParts={bumpkin}
            questCompletionScreen={QuestCompletion()}
          />
        )}
      </Modal>

      {showDonation && (
        <Modal
          show={showDonation}
          onHide={() => setShowDonation(false)}
          centered
        >
          <CloseButtonPanel
            title="Wants to support more events like this?!"
            bumpkinParts={bumpkin}
            onClose={() => setShowDonation(false)}
          >
            <LunarNewYearDonation />
          </CloseButtonPanel>
        </Modal>
      )}
    </>
  );
};
