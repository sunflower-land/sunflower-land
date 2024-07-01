import React, { useContext, useEffect, useState } from "react";
import * as AuthProvider from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { TimerDisplay } from "./AuctionDetails";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Auction } from "features/game/lib/auctionMachine";
import { Context } from "features/game/GameProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import { loadAuctions } from "./actions/loadAuctions";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const Countdown: React.FC<{ auction: Auction; onComplete: () => void }> = ({
  auction,
  onComplete,
}) => {
  const start = useCountdown(auction?.startAt);
  const end = useCountdown(auction?.endAt);
  const { t } = useAppTranslation();

  useEffect(() => {
    if (auction.endAt < Date.now()) {
      onComplete();
    }
  }, [end]);

  if (auction.endAt < Date.now()) {
    return null;
  }

  if (auction.startAt < Date.now()) {
    return (
      <div>
        <div className="h-6 flex justify-center">
          <Label type="info" icon={SUNNYSIDE.icons.stopwatch} className="ml-1">
            {t("auction.live")}
          </Label>
          <img
            src={SUNNYSIDE.icons.close}
            className="h-5 cursor-pointer ml-2"
            onClick={onComplete}
          />
        </div>
        <TimerDisplay time={end} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex">
        <Label type="default" className="ml-1" icon={SUNNYSIDE.icons.stopwatch}>
          <div
            className="sm:max-w-[350px] max-w-[150px]"
            style={{
              // maxWidth: "155px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {t("auction")}
            {":"}{" "}
            {auction.type === "collectible"
              ? auction.collectible
              : auction.wearable}
          </div>
        </Label>
        <img
          src={SUNNYSIDE.icons.close}
          className="h-5 cursor-pointer ml-2"
          onClick={onComplete}
        />
      </div>
      <TimerDisplay time={start} />
    </div>
  );
};

export const AuctionCountdown: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [auction, setAuction] = useState<Auction | undefined>();

  useEffect(() => {
    const load = async () => {
      const { auctions } = await loadAuctions({
        token: authState.context.user.rawToken as string,
        transactionId: gameState.context.transactionId as string,
      });

      // Show countdown 1 hour from Auction
      const upcoming = auctions.filter(
        (auction) =>
          auction.startAt - 60 * 60 * 1000 < Date.now() &&
          auction.endAt > Date.now(),
      );

      if (upcoming.length > 0) {
        setAuction(upcoming[0]);
      }
    };

    load();
  }, []);

  if (!auction) {
    return null;
  }

  return (
    <InnerPanel className="flex justify-center" id="test-auction">
      <Countdown auction={auction} onComplete={() => setAuction(undefined)} />
    </InnerPanel>
  );
};
