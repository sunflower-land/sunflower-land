import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";

import close from "assets/icons/close.png";
import { Context } from "features/game/GoblinProvider";
import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { AuctioneerContent } from "./AuctioneerContent";
import { UpcomingAuctions } from "./UpcomingAuctions";
import { useActor } from "@xstate/react";
import { Loading } from "features/auth/components";
import { MachineInterpreter } from "features/game/lib/goblinMachine";
import mintingAnimation from "assets/npcs/goblin_hammering.gif";
import { MintedEvent } from "features/retreat/auctioneer/auctioneerMachine";
import { Button } from "components/ui/Button";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";

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

  const isLoading = auctioneerState.matches("loading");
  const isPlaying = auctioneerState.matches("playing");
  const isMinting = auctioneerState.matches("minting");
  const isMinted = auctioneerState.matches("minted");

  const mintedItemName = ((auctioneerState.event as any)?.data as MintedEvent)
    ?.item;

  return (
    <Modal centered show={isOpen} onHide={onClose} scrollable>
      {isMinting && (
        <Panel className="relative">
          <div className="flex flex-col items-center px-2 py-4">
            <span className="text-shadow text-center loading">Minting</span>
            <img src={mintingAnimation} className="w-1/2 mt-2 mb-3" />
            <span className="text-sm">
              Please be patient while we mint the NFT for you.
            </span>
          </div>
        </Panel>
      )}
      {isMinted && (
        <Panel className="relative">
          <div className="flex flex-col items-center px-2 py-4">
            <div className="flex flex-col">
              <div className="p-2 flex flex-col items-center">
                <h1 className="text-center mb-3 text-lg">
                  Woohoo, you just minted an awesome new item!
                </h1>
                <img
                  src={ITEM_DETAILS[mintedItemName].image}
                  className="w-20 mb-3"
                />
                <h1 className="text-center mb-3">{mintedItemName}</h1>
              </div>
              <Button onClick={() => send("REFRESH")}>Ok</Button>
            </div>
          </div>
        </Panel>
      )}
      {(isPlaying || isLoading) && (
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
            <Tab
              isActive={tab === "upcoming"}
              onClick={() => setTab("upcoming")}
            >
              <span className="text-sm text-shadow ml-1">Upcoming</span>
            </Tab>
            <img
              src={close}
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
              {isLoading && <Loading />}
              {isPlaying && (
                <>
                  {tab === "auction" && <AuctioneerContent />}
                  {tab === "upcoming" && <UpcomingAuctions />}
                </>
              )}
            </div>
          </div>
        </Panel>
      )}
    </Modal>
  );
};
