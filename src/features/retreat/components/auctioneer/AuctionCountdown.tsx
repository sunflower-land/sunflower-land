import React, { useContext, useEffect, useState } from "react";
import { loadAuctions } from "./actions/loadAuctions";
import * as AuthProvider from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { TimerDisplay } from "./AuctionDetails";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Auction } from "features/game/lib/auctionMachine";
import { createPortal } from "react-dom";
import { Context } from "features/game/GameProvider";

const Countdown: React.FC<{ auction: Auction }> = ({ auction }) => {
  const start = useCountdown(auction?.startAt);
  const end = useCountdown(auction?.endAt);

  if (auction.endAt < Date.now()) {
    return (
      <div className="h-7 flex justify-center">
        <Label type="danger">Auction has finished</Label>
      </div>
    );
  }

  if (auction.startAt < Date.now()) {
    return (
      <div>
        <div className="h-6 flex justify-center">
          <Label type="info">Auction is live!</Label>
        </div>
        <TimerDisplay time={end} />
      </div>
    );
  }

  return (
    <div>
      <p className="text-xxs">Next Auction</p>
      <TimerDisplay time={start} />
    </div>
  );
};

export const AuctionCountdown: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [auction, setAuction] = useState<Auction>();

  useEffect(() => {
    const load = async () => {
      const { auctions } = await loadAuctions({
        token: authState.context.user.rawToken as string,
        transactionId: gameState.context.transactionId as string,
      });

      const upcoming = auctions.filter((auction) => auction.endAt > Date.now());

      if (upcoming.length > 0) {
        setAuction(upcoming[0]);
      }
    };

    load();
  }, []);

  if (!auction) {
    return null;
  }

  return createPortal(
    <InnerPanel
      className="fixed bottom-2 left-1/2 -translate-x-1/2 flex justify-center"
      id="test-auction"
    >
      <Countdown auction={auction} />
    </InnerPanel>,
    document.body
  );
};
