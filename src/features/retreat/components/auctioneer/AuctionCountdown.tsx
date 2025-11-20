import React, { useContext, useEffect, useState } from "react";
import * as AuthProvider from "features/auth/lib/Provider";
import { useSelector } from "@xstate/react";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { TimerDisplay } from "./AuctionDetails";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Auction } from "features/game/lib/auctionMachine";
import { Context } from "features/game/GameProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { loadUpcomingAuction } from "./actions/loadUpcomingAuction";
import {
  acknowledgeAuctionCountdown,
  getAuctionCountdownLastRead,
} from "./auctionCountdownStorage";
import { getAuctionItemType } from "./lib/getAuctionItemType";
import { useNow } from "lib/utils/hooks/useNow";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { MachineState } from "features/game/lib/gameMachine";

const Countdown: React.FC<{ auction: Auction; onComplete: () => void }> = ({
  auction,
  onComplete,
}) => {
  const start = useCountdown(auction?.startAt);
  const end = useCountdown(auction?.endAt);
  const { t } = useAppTranslation();

  const now = useNow({ live: true, autoEndAt: auction.endAt });
  const item = getAuctionItemType(auction);

  if (auction.endAt <= now) {
    onComplete();
    return null;
  }

  if (auction.startAt < now) {
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
            {":"} {item}
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

const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;
const _transactionId = (state: MachineState) =>
  state.context.transactionId as string;

export const AuctionCountdown: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);

  const token = useSelector(authService, _token);
  const transactionId = useSelector(gameService, _transactionId);

  const [auction, setAuction] = useState<Auction | undefined>();

  useEffect(() => {
    const load = async () => {
      const upcoming = await loadUpcomingAuction({
        token,
        transactionId,
      });

      if (upcoming && getAuctionCountdownLastRead() !== upcoming.auctionId) {
        setAuction(upcoming);
      }
    };

    load();
  }, [token, transactionId]);

  const handleClick = () => {
    if (auction) {
      acknowledgeAuctionCountdown(auction.auctionId);
      setAuction(undefined);
    }
  };

  if (!auction) {
    return null;
  }

  return (
    <InnerPanel className="flex justify-center" id="test-auction">
      <Countdown auction={auction} onComplete={handleClick} />
    </InnerPanel>
  );
};
