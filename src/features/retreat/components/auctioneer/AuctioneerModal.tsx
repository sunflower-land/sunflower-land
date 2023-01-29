import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";

import { Context } from "features/game/GoblinProvider";
import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { AuctioneerContent } from "./AuctioneerContent";
import { UpcomingAuctions } from "./UpcomingAuctions";
import { useActor } from "@xstate/react";
import { MachineInterpreter } from "features/retreat/auctioneer/auctioneerMachine";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";
import { setImageWidth } from "lib/images";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { AuctioneerItemName } from "features/game/types/auctioneer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AuctioneerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<"auction" | "upcoming">("auction");
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);
  const child = goblinState.children.auctioneer as MachineInterpreter;

  const [auctioneerState, send] = useActor(child);

  const isMinting = auctioneerState.matches("minting");
  const isMinted = auctioneerState.matches("minted");

  console.log({ state: auctioneerState.context });
  const mintedItemName = auctioneerState.context.bid
    ?.item as AuctioneerItemName;

<<<<<<< HEAD
  return (
    <Modal centered show={isOpen} onHide={onClose} scrollable>
      <Panel className="relative">
        <div className="p-2 flex flex-col items-center">
          <p>Under construction!</p>
          <img src={SUNNYSIDE.npcs.goblin_hammering} className="w-1/3" />
          <p className="my-2 text-sm">This feature is coming soon.</p>
          <a
            href="https://docs.sunflower-land.com/player-guides/islands/goblin-retreat/goblin-auctioneer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline"
          >
            Read more
          </a>
        </div>
      </Panel>
    </Modal>
  );

  return (
    <Modal centered show={isOpen} onHide={onClose} scrollable>
      {isMinting && (
=======
  const Content = () => {
    if (isMinting) {
      return (
>>>>>>> 841f5100 (UI flows)
        <Panel className="relative">
          <div className="flex flex-col items-center p-2">
            <span className="text-shadow text-center loading">Minting</span>
            <img
              src={SUNNYSIDE.npcs.goblin_hammering}
              className="w-1/2 mt-2 mb-3"
            />
            <span className="text-sm">
              Please be patient while we mint the SFT for you.
            </span>
          </div>
        </Panel>
      );
    }

    if (isMinted) {
      return (
        <Panel className="relative">
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center p-2">
              <h1 className="text-center mb-3">
                Woohoo, you just minted an awesome new item!
              </h1>
              <img
                src={ITEM_DETAILS[mintedItemName].image}
                className="mb-3"
                onLoad={(e) => setImageWidth(e.currentTarget)}
              />
              <h2 className="text-center text-sm mb-3">{mintedItemName}</h2>
            </div>
            <Button onClick={() => send("REFRESH")}>Ok</Button>
          </div>
        </Panel>
      );
    }

    return (
      <Panel className="relative" hasTabs>
        <div
          className="absolute flex"
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            left: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
          }}
        >
          <Tab isActive={tab === "auction"} onClick={() => setTab("auction")}>
            <span className="text-sm text-shadow ml-1">Auctioneer</span>
          </Tab>
          <Tab isActive={tab === "upcoming"} onClick={() => setTab("upcoming")}>
            <span className="text-sm text-shadow ml-1">Upcoming</span>
          </Tab>
          <img
            src={SUNNYSIDE.icons.close}
            className="absolute cursor-pointer z-20"
            onClick={onClose}
            style={{
              top: `${PIXEL_SCALE * 1}px`,
              right: `${PIXEL_SCALE * 1}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </div>

        <div
          style={{
            minHeight: "200px",
          }}
        >
          <div className="flex flex-col">
            <>
              {tab === "auction" && <AuctioneerContent />}
              {tab === "upcoming" && <UpcomingAuctions />}
            </>
          </div>
        </div>
      </Panel>
    );
  };

  return (
    <Modal centered show={isOpen} onHide={onClose} scrollable>
      <Content />
    </Modal>
  );
};
