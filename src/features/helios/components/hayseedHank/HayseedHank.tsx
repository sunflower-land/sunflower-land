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
import { SpeakingText } from "features/game/components/SpeakingModal";
import { Panel } from "components/ui/Panel";
import { NPC_WEARABLES } from "lib/npcs";
import { GuidePath } from "./lib/guide";

export const HayseedHank: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [guide, setGuide] = useState<GuidePath>();

  const handleClick = () => {
    setShowIntro(true);
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
        {showIntro && (
          <Panel bumpkinParts={NPC_WEARABLES["hank"]}>
            <SpeakingText
              onClose={() => {
                console.log("CLOSE");
                setShowIntro(false);
              }}
              message={[
                {
                  text: "Looks like our little island is getting crowded. If we want to craft buildings and rare NFTs, we'll need more space.",
                },
                {
                  text: "Let's first chop down these trees, gather some wood and expand the island.",
                },
              ]}
            />
          </Panel>
        )}
        {!showIntro && (
          <CloseButtonPanel
            currentTab={tab}
            setCurrentTab={(tab) => {
              setGuide(undefined);
              setTab(tab);
            }}
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
            {tab === 0 && (
              <Task
                onOpenGuide={(g) => {
                  setGuide(g);
                  setTab(1);
                }}
              />
            )}
            {tab === 1 && <Guide selected={guide} onSelect={setGuide} />}
          </CloseButtonPanel>
        )}
      </Modal>
    </>
  );
};
