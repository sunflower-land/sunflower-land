import React, { useContext, useEffect } from "react";
import { Modal } from "react-bootstrap";

import { Panel } from "components/ui/Panel";
import { AuctioneerContent } from "./AuctioneerContent";
import { useActor, useInterpret } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  MachineInterpreter,
  createAuctioneerMachine,
} from "features/game/lib/auctionMachine";
import { Bid, GameState } from "features/game/types/game";
import * as AuthProvider from "features/auth/lib/Provider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { hasFeatureAccess } from "lib/flags";
import { NPC_WEARABLES } from "lib/npcs";

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
      canAccess: hasFeatureAccess(gameState.inventory, "AUCTION"),
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
        <Panel bumpkinParts={NPC_WEARABLES["hammerin' harry"]}>
          <span className="loading">Loading</span>
        </Panel>
      </Modal>
    );
  }

  const bid = auctioneerState.context.bid as Bid;

  const closeModal = () => {
    onClose();
  };

  return (
    <Modal centered show={isOpen} onHide={closeModal} scrollable>
      <CloseButtonPanel
        onClose={onClose}
        tabs={[{ icon: SUNNYSIDE.icons.stopwatch, name: "Auctions & Drops" }]}
        bumpkinParts={NPC_WEARABLES["hammerin' harry"]}
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
