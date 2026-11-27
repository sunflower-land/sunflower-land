import React, { useContext, useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";

import { Panel } from "components/ui/Panel";
import { AuctioneerContent } from "./AuctioneerContent";
import { AuctionHistory } from "./AuctionHistory";
import { useActor, useInterpret, useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  type MachineInterpreter,
  createAuctioneerMachine,
} from "features/game/lib/auctionMachine";
import type { GameState } from "features/game/types/game";
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
import { useNow } from "lib/utils/hooks/useNow";
import { Context as GameContext } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";

const _walletStepDone = (state: MachineState) =>
  state.matches("linkingWalletSuccess") || state.matches("assigningNFTSuccess");

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
  const { gameService } = useContext(GameContext);

  type Tab = "auction" | "results";
  const [tab, setTab] = useState<Tab>("auction");

  const auctionService = useInterpret(createAuctioneerMachine({ onUpdate }), {
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
      auctionService.send("OPEN", { gameState });
    }
  }, [isOpen]);

  const now = useNow();

  const hasAuctionAccess = hasReputation({
    game: gameState,
    reputation: Reputation.Grower,
    now,
  });

  // Kept here so they survive switching tabs. The wallet prompt replaces the
  // screens that normally confirm a linked wallet or minted farm NFT, so move
  // the game on as soon as either succeeds
  const [showLinkWallet, setShowLinkWallet] = useState(false);
  const walletStepDone = useSelector(gameService, _walletStepDone);
  const isLinkingWallet = auctioneerState.matches("noWallet") && showLinkWallet;
  useEffect(() => {
    if (isLinkingWallet && walletStepDone) {
      gameService.send("CONTINUE");
    }
  }, [isLinkingWallet, walletStepDone, gameService]);

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
            href="https://docs.sunflower-land.com/web3-and-economy/wallets-and-collectibles"
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
                hasAuctionAccess={hasAuctionAccess}
                showLinkWallet={showLinkWallet}
                setShowLinkWallet={setShowLinkWallet}
              />
            </div>
          </div>
        )}
        {tab === "results" && <AuctionHistory />}
      </CloseButtonPanel>
    </Modal>
  );
};
