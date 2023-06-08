import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { AuctioneerContent } from "./AuctioneerContent";
import { UpcomingAuctions } from "./UpcomingAuctions";
import { useActor, useInterpret } from "@xstate/react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";
import { setImageWidth } from "lib/images";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { CONFIG } from "lib/config";
import {
  MachineInterpreter,
  createAuctioneerMachine,
} from "features/game/lib/auctionMachine";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { Bid, GameState, InventoryItemName } from "features/game/types/game";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import * as AuthProvider from "features/auth/lib/Provider";
import { Context } from "features/game/GameProvider";

interface Props {
  gameState: GameState;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (state: GameState) => void;
}

export const AuctioneerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  gameState,
  onUpdate,
}) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const [tab, setTab] = useState<"auction" | "upcoming">("auction");

  const auctionService = useInterpret(createAuctioneerMachine({ onUpdate }), {
    context: {
      farmId: authState.context.user.farmId,
      token: authState.context.user.rawToken,
      bid: gameState.auctioneer.bid,
    },
  }) as unknown as MachineInterpreter;

  const [auctioneerState, send] = useActor(auctionService);

  useEffect(() => {
    if (isOpen) {
      auctionService.send("OPEN");
    }
  }, [isOpen]);

  if (auctioneerState.matches("idle")) {
    return null;
  }

  if (auctioneerState.matches("loading")) {
    return (
      <Modal centered show={isOpen} onHide={onClose}>
        <Panel>
          <span className="loading">Loading</span>
        </Panel>
      </Modal>
    );
  }

  const isMinting = auctioneerState.matches("minting");
  const isMinted = auctioneerState.matches("minted");

  const bid = auctioneerState.context.bid as Bid;

  const closeModal = () => {
    onClose();
  };

  if (CONFIG.NETWORK === "mainnet") {
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
  }

  const Content = () => {
    if (isMinting) {
      return (
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
      const image =
        bid.type === "collectible"
          ? ITEM_DETAILS[bid.collectible as InventoryItemName].image
          : getImageUrl(ITEM_IDS[bid.wearable as BumpkinItem]);

      return (
        <Panel className="relative">
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center p-2">
              <h1 className="text-center mb-3">
                Woohoo, you just minted an awesome new item!
              </h1>
              <img
                src={image}
                className="mb-3"
                onLoad={(e) => setImageWidth(e.currentTarget)}
              />
              <h2 className="text-center text-sm mb-3">
                {bid.type === "collectible" ? bid.collectible : bid.wearable}
              </h2>
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
            onClick={closeModal}
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
              {tab === "auction" && (
                <AuctioneerContent
                  auctionService={auctionService}
                  gameState={gameState}
                />
              )}
              {tab === "upcoming" && (
                <UpcomingAuctions
                  auctionService={auctionService}
                  game={gameState}
                />
              )}
            </>
          </div>
        </div>
      </Panel>
    );
  };

  return (
    <Modal centered show={isOpen} onHide={closeModal} scrollable>
      <Content />
    </Modal>
  );
};
