import React, { useContext, useEffect, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import { Modal } from "react-bootstrap";
import { NPC } from "features/island/bumpkin/components/NPC";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";

import { Guide } from "./components/Guide";
import { Task } from "./components/Task";

export const HayseedHank: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const handleClick = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div
        className="absolute z-10"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          right: `${PIXEL_SCALE * 4}px`,
          bottom: `${PIXEL_SCALE * 32}px`,
          transform: "scaleX(-1)",
        }}
      >
        <NPC
          parts={{
            body: "Light Brown Farmer Potion",
            shirt: "Red Farmer Shirt",
            pants: "Brown Suspenders",
            hair: "Sun Spots",
          }}
          onClick={handleClick}
        />
        {/* <img
            src={SUNNYSIDE.icons.expression_chat}
            className="absolute animate-float pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 9}px`,
              top: `${PIXEL_SCALE * -5}px`,
              right: `${PIXEL_SCALE * 1}px`,
            }}
          /> */}
      </div>
      <Modal centered show={isOpen} onHide={close}>
        <CloseButtonPanel
          currentTab={tab}
          setCurrentTab={setTab}
          tabs={[
            {
              icon: SUNNYSIDE.icons.hammer,
              name: "Task",
            },
            {
              icon: SUNNYSIDE.icons.expression_confused,
              name: "Guide",
            },
          ]}
          bumpkinParts={{
            body: "Light Brown Farmer Potion",
            shirt: "Red Farmer Shirt",
            pants: "Brown Suspenders",
            hair: "Sun Spots",
            tool: "Farmer Pitchfork",
          }}
          onClose={close}
        >
          {tab === 0 && <Task />}
          {tab === 1 && <Guide />}
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
