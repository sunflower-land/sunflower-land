import React, { useContext, useState } from "react";

import { useActor, useSelector } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import type { Bid, GameState } from "features/game/types/game";
import type {
  AuctionResults,
  MachineInterpreter,
  Auction as IAuction,
} from "features/game/lib/auctionMachine";
import { Auctions } from "./Auctions";
import { Loser } from "./Loser";
import { Winner } from "./Winner";
import { AuctionDetails } from "./AuctionDetails";
import { Pending } from "./Pending";
import { AuctionBid } from "./AuctionBid";
import { DraftBid } from "./DraftBid";
import { Refunded } from "./Refunded";
import { MissingAuction } from "./MissingAuction";
import { TieBreaker } from "./TieBreaker";
import { AuctionsComingSoon } from "./AuctionsComingSoon";
import { GameWallet } from "features/wallet/Wallet";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Loading } from "features/auth/components";
import { useScrollRestoration } from "lib/utils/hooks/useScrollRestoration";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";

const _linkedWallet = (state: MachineState) => state.context.linkedWallet;

interface Props {
  auctionService: MachineInterpreter;
  gameState: GameState;
  onMint: (id: string) => void;
}
export const AuctioneerContent: React.FC<Props> = ({
  auctionService,
  gameState,
  onMint,
}) => {
  const { t } = useAppTranslation();
  const [auctioneerState, send] = useActor(auctionService);
  const { gameService } = useContext(Context);
  const linkedWallet = useSelector(gameService, _linkedWallet);

  const [selectedAuctionId, setSelectedAuctionId] = useState<string>();
  const [showLinkWallet, setShowLinkWallet] = useState(false);
  const { scrollContainerRef, handleScroll } =
    useScrollRestoration<HTMLDivElement>();

  if (auctioneerState.matches("noAccess")) {
    return <AuctionsComingSoon />;
  }

  if (auctioneerState.matches("introduction")) {
    return (
      <>
        <div className="p-2">
          <p className="text-sm mb-2">{t("statements.auctioneer.one")}</p>
          <p className="text-sm mb-2">{t("statements.auctioneer.two")}</p>
          <a
            href="https://docs.sunflower-land.com/web3-and-economy/wallets-and-collectibles"
            className="mx-auto text-xxs underline  pb-2 pt-2"
            target="_blank"
            rel="noreferrer"
          >
            {t("read.more")}
          </a>
        </div>
        <Button onClick={() => send("CONTINUE")}>{t("continue")}</Button>
      </>
    );
  }

  if (auctioneerState.matches("error")) {
    return (
      <div className="p-2">
        <p className="mb-2">{t("error.wentWrong")}</p>
        <Button onClick={() => auctionService.send("REFRESH")}>
          {t("retry")}
        </Button>
      </div>
    );
  }

  if (auctioneerState.matches("noWallet") && showLinkWallet) {
    return (
      <>
        <p className="text-sm p-2">{t("auction.noWallet")}</p>
        <GameWallet action="auction">
          <div className="p-2">
            <Button
              onClick={() => {
                setShowLinkWallet(false);

                // Linking a wallet or minting the farm NFT leaves the game
                // waiting on its success screen
                const game = gameService.getSnapshot();
                if (
                  game.matches("linkingWalletSuccess") ||
                  game.matches("assigningNFTSuccess")
                ) {
                  gameService.send("CONTINUE");
                }

                auctionService.send({
                  type: "REFRESH",
                  linkedAddress: linkedWallet,
                });
              }}
            >
              {t("continue")}
            </Button>
          </div>
        </GameWallet>
      </>
    );
  }

  if (auctioneerState.matches("draftingBid")) {
    const auction = auctioneerState.context.auctions.find(
      (auction) => auction.auctionId === selectedAuctionId,
    ) as IAuction;

    return (
      <DraftBid
        gameState={gameState}
        auction={auction}
        onBid={(tickets: number) => {
          auctionService.send("BID", { auctionId: auction.auctionId, tickets });
        }}
        onBack={() => auctionService.send("CANCEL")}
      />
    );
  }

  if (auctioneerState.matches("bidding")) {
    return <Loading text={t("placing.bid")} />;
  }

  if (auctioneerState.matches("cancelling")) {
    return <Loading text={t("cancelling.bid")} />;
  }

  if (auctioneerState.matches("refunded")) {
    return <Refunded />;
  }

  if (auctioneerState.matches("missingAuction")) {
    return <MissingAuction auctionService={auctionService} />;
  }

  if (auctioneerState.matches("bidded")) {
    const auction = auctioneerState.context.auctions.find(
      (auction) => auction.auctionId === auctioneerState.context.bid?.auctionId,
    ) as IAuction;

    return (
      <AuctionBid
        auction={auction}
        auctionService={auctionService}
        bid={auctioneerState.context.bid as Bid}
      />
    );
  }

  if (auctioneerState.matches("checkingResults")) {
    return <Loading />;
  }

  if (auctioneerState.matches("pending")) {
    return <Pending />;
  }

  if (auctioneerState.matches("loser")) {
    return (
      <Loser
        farmId={auctioneerState.context.farmId}
        onRefund={() => auctionService.send("REFUND")}
        results={auctioneerState.context.results as AuctionResults}
      />
    );
  }

  if (auctioneerState.matches("winner")) {
    return (
      <Winner
        onMint={onMint}
        bid={auctioneerState.context.bid as Bid}
        farmId={auctioneerState.context.farmId ?? 0}
        results={auctioneerState.context.results as AuctionResults}
      />
    );
  }
  if (auctioneerState.matches("tiebreaker")) {
    return (
      <TieBreaker
        auctionService={auctionService}
        farmId={auctioneerState.context.farmId}
        results={auctioneerState.context.results as AuctionResults}
      />
    );
  }

  // Bidding needs a linked wallet, so say so before the player picks an auction
  const walletNotice = auctioneerState.matches("noWallet") && (
    <div className="flex flex-col items-start p-1 mb-1">
      <Label type="danger" className="mb-1">
        {t("auction.walletRequired")}
      </Label>
      <Button onClick={() => setShowLinkWallet(true)}>
        {t("linkedAccounts.linkWallet")}
      </Button>
    </div>
  );

  if (selectedAuctionId) {
    const auction = auctioneerState.context.auctions.find(
      (auction) => auction.auctionId === selectedAuctionId,
    ) as IAuction;

    return (
      <>
        {walletNotice}
        <AuctionDetails
          auction={auction}
          game={gameState}
          onDraftBid={() => {
            if (auctioneerState.matches("noWallet")) {
              setShowLinkWallet(true);
              return;
            }

            auctionService.send("DRAFT_BID");
          }}
          isUpcomingItem={false}
          onBack={() => setSelectedAuctionId(undefined)}
        />
      </>
    );
  }

  return (
    <>
      {walletNotice}
      <Auctions
        auctionService={auctionService}
        onSelect={(id) => setSelectedAuctionId(id)}
        game={gameState}
        scrollContainerRef={scrollContainerRef}
        onScroll={handleScroll}
      />
    </>
  );
};
