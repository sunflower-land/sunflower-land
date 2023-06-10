import React, { useContext, useEffect } from "react";
import { Modal } from "react-bootstrap";

import { Panel } from "components/ui/Panel";
import { AuctioneerContent } from "./AuctioneerContent";
import { useActor, useInterpret } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { CONFIG } from "lib/config";
import {
  MachineInterpreter,
  createAuctioneerMachine,
} from "features/game/lib/auctionMachine";
import { Bid, GameState } from "features/game/types/game";
import * as AuthProvider from "features/auth/lib/Provider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

interface Props {
  gameState: GameState;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (state: GameState) => void;
  onMint: (id: string) => void;
  deviceTrackerId: string;
}

export const AuctioneerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  gameState,
  onUpdate,
  onMint,
  deviceTrackerId,
}) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const auctionService = useInterpret(createAuctioneerMachine({ onUpdate }), {
    context: {
      farmId: authState.context.user.farmId,
      token: authState.context.user.rawToken,
      bid: gameState.auctioneer.bid,
      deviceTrackerId: deviceTrackerId,
    },
  }) as unknown as MachineInterpreter;

  const [auctioneerState, send] = useActor(auctionService);

  useEffect(() => {
    if (isOpen) {
      auctionService.send("OPEN", { gameState });
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

  return (
    <Modal centered show={isOpen} onHide={closeModal} scrollable>
      <CloseButtonPanel
        onClose={onClose}
        tabs={[{ icon: SUNNYSIDE.icons.stopwatch, name: "Auctions & Drops" }]}
      >
        <div
          style={{
            minHeight: "200px",
          }}
        >
          <div className="flex flex-col">
            <>
              <AuctioneerContent
                auctionService={auctionService}
                gameState={gameState}
                onMint={onMint}
              />
            </>
          </div>
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
