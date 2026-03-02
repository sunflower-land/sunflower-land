import React, { useContext, useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";

import { Panel } from "components/ui/Panel";
import { AuctioneerContent } from "./AuctioneerContent";
import { AuctionHistory } from "./AuctionHistory";
import { useActor, useActorRef } from "@xstate/react";
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
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Loading } from "features/auth/components";
import { hasReputation } from "features/game/lib/reputation";
import { Reputation } from "features/game/lib/reputation";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";
import choreIcon from "assets/icons/chores.webp";

interface Props {
  gameState: GameState;
  isOpen: boolean;
  farmId: number;
  onClose: () => void;
  onUpdate: (state: GameState) => void;
  onMint: () => void;
  deviceTrackerId: string;
  linkedAddress?: string;
}

export const AuctioneerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  farmId,
  gameState,
  onUpdate,
  onMint,
  deviceTrackerId,
  linkedAddress,
}) => {
  const { t } = useAppTranslation();
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  type Tab = "auction" | "results";
  const [tab, setTab] = useState<Tab>("auction");

  const auctionService = useActorRef(createAuctioneerMachine({ onUpdate }), {
    context: {
      farmId: farmId,
      token: authState.context.user.rawToken,
      bid: gameState.auctioneer.bid,
      deviceTrackerId: deviceTrackerId,
      canAccess: true,
      linkedAddress: linkedAddress,
    },
  }) as unknown as MachineInterpreter;

  const [auctioneerState] = useActor(auctionService);

  useEffect(() => {
    if (isOpen) {
      auctionService.send({ type: "OPEN", gameState });
    }
  }, [isOpen]);

  const hasAuctionAccess = hasReputation({
    game: gameState,
    reputation: Reputation.Grower,
  });

  if (auctioneerState.matches("idle")) {
    return null;
  }

  if (auctioneerState.matches("loading")) {
    return (
      <Modal show={isOpen} onHide={onClose}>
        <Panel bumpkinParts={NPC_WEARABLES["hammerin harry"]}>
          <Loading />
        </Panel>
      </Modal>
    );
  }

  return (
    <Modal show={isOpen} onHide={onClose}>
      <CloseButtonPanel
        onClose={onClose}
        currentTab={tab}
        setCurrentTab={setTab}
        tabs={[
          {
            id: "auction",
            icon: SUNNYSIDE.icons.stopwatch,
            name: t("auction.title"),
          },

          {
            id: "results",
            icon: choreIcon,
            name: t("auction.results"),
          },
        ]}
        bumpkinParts={NPC_WEARABLES["hammerin harry"]}
        secondaryAction={
          <a
            href="https://docs.sunflower-land.com/getting-started/crypto-and-digital-collectibles"
            className="mx-auto text-xxs underline text-center"
            target="_blank"
            rel="noreferrer"
          >
            <div className="flex items-center">
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
        {tab === "auction" && (
          <div
            style={{
              minHeight: "200px",
            }}
          >
            <div className="flex flex-col">
              {!hasAuctionAccess && (
                <div className="pt-2 pl-2">
                  <RequiredReputation reputation={Reputation.Grower} />
                </div>
              )}
              <AuctioneerContent
                auctionService={auctionService}
                gameState={gameState}
                onMint={onMint}
              />
            </div>
          </div>
        )}
        {tab === "results" && <AuctionHistory />}
      </CloseButtonPanel>
    </Modal>
  );
};
