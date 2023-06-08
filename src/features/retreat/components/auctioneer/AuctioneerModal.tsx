import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { AuctioneerContent } from "./AuctioneerContent";
import { UpcomingAuctions } from "./UpcomingAuctions";
import { useActor, useInterpret } from "@xstate/react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { CONFIG } from "lib/config";
import {
  MachineInterpreter,
  createAuctioneerMachine,
} from "features/game/lib/auctionMachine";
import { Bid, GameState } from "features/game/types/game";
import * as AuthProvider from "features/auth/lib/Provider";

interface Props {
  gameState: GameState;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (state: GameState) => void;
  onMint: (id: string) => void;
}

export const AuctioneerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  gameState,
  onUpdate,
  onMint,
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
                  onMint={onMint}
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
