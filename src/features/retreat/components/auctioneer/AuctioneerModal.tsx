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
import { GameState } from "features/game/types/game";
import * as AuthProvider from "features/auth/lib/Provider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { Button } from "components/ui/Button";
import { ModalContext } from "features/game/components/modal/ModalProvider";

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
  const { openModal } = useContext(ModalContext);

  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const auctionService = useInterpret(createAuctioneerMachine({ onUpdate }), {
    context: {
      farmId: authState.context.user.farmId,
      token: authState.context.user.rawToken,
      bid: gameState.auctioneer.bid,
      deviceTrackerId: deviceTrackerId,
      canAccess: true,
    },
  }) as unknown as MachineInterpreter;

  const [auctioneerState, send] = useActor(auctionService);

  console.log({ state: auctioneerState.value });
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
        <Panel bumpkinParts={NPC_WEARABLES["hammerin harry"]}>
          <span className="loading">Loading</span>
        </Panel>
      </Modal>
    );
  }

  const closeModal = () => {
    onClose();
  };

  return (
    <Modal centered show={isOpen} onHide={closeModal} scrollable>
      <CloseButtonPanel
        onClose={onClose}
        tabs={[{ icon: SUNNYSIDE.icons.stopwatch, name: "Auctions & Drops" }]}
        bumpkinParts={NPC_WEARABLES["hammerin harry"]}
        secondaryAction={
          <a
            href="https://docs.sunflower-land.com/player-guides/auctions"
            className="mx-auto text-xxs underline text-center"
            target="_blank"
            rel="noreferrer"
          >
            <div className="flex items-center">
              <div className="mr-2">
                <Label type="info">BETA</Label>
              </div>

              <img
                src={SUNNYSIDE.icons.expression_confused}
                className="flex-none cursor-pointer float-right"
                style={{
                  height: `${PIXEL_SCALE * 11}px`,
                }}
              />
            </div>
          </a>
        }
      >
        <div
          style={{
            minHeight: "200px",
          }}
        >
          <div className="flex flex-col">
            {!gameState.inventory["Gold Pass"] && (
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center">
                  <img
                    src={ITEM_DETAILS["Gold Pass"].image}
                    className="h-4 mr-1"
                  />
                  <span className="text-xs">
                    A Gold Pass is required to mint rare NFTs.
                  </span>
                </div>
                <Button
                  onClick={() => {
                    onClose();
                    openModal("GOLD_PASS");
                  }}
                  className="text-xxs w-16 p-0 h-8"
                >
                  Buy
                </Button>
              </div>
            )}

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
