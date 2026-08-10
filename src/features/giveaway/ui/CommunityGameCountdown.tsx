import React, { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { useSelector } from "@xstate/react";
import { useNavigate } from "react-router";

import { Label } from "components/ui/Label";
import { ButtonPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { CONFIG } from "lib/config";
import * as Auth from "features/auth/lib/Provider";
import { Context as GameContext } from "features/game/GameProvider";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";

import { getGiveaways } from "../actions/getGiveaways";
import {
  DEFAULT_MINIGAME,
  minigameFromTitle,
  type MinigameType,
} from "../lib/minigames";
import { recallGiveawayType } from "../lib/giveawayType";

/** How often we check for an upcoming community game while in the Kingdom. */
const POLL_MS = 30 * 1000;

const Countdown: React.FC<{
  live: boolean;
  startAt: number;
  endAt: number;
  onClick: () => void;
  onHide: () => void;
}> = ({ live, startAt, endAt, onClick, onHide }) => {
  const start = useCountdown(startAt);
  const end = useCountdown(endAt);
  const { t } = useAppTranslation();

  return (
    <div className="flex justify-between">
      <div className="flex flex-col" onClick={onClick}>
        <div className="flex items-center">
          <Label
            type={live ? "success" : "info"}
            icon={SUNNYSIDE.icons.stopwatch}
            className="ml-1"
          >
            {live
              ? t("giveaway.communityGameLive")
              : t("giveaway.communityGameSoon")}
          </Label>
          <Label type="warning" className="ml-1">
            {t("giveaway.beta")}
          </Label>
        </div>
        {/* Count down to the start while it's still upcoming, else to the end. */}
        <TimerDisplay time={live ? end : start} />
      </div>
      <img
        src={SUNNYSIDE.icons.close}
        className="h-5 cursor-pointer ml-2"
        onClick={onHide}
      />
    </div>
  );
};

/**
 * A HUD widget — same idea as the town-hall stream and floating-island
 * countdowns — that appears when a community game is on now or coming up. We
 * poll for one every 30s (only mounted while in the Kingdom, see WorldHud).
 * Clicking it takes you STRAIGHT into the game (joining first if it's upcoming),
 * where the lobby countdown runs. Marked BETA for now.
 */
export const CommunityGameCountdown: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(GameContext);
  const navigate = useNavigate();
  const token = authService.getSnapshot().context.user.rawToken as string;

  const [hide, setHide] = useState(false);
  const [joining, setJoining] = useState<{ id: string; type: MinigameType }>();

  const joinSettled = useSelector(
    gameService,
    (state) =>
      state.matches("joiningGiveawaySuccess") ||
      state.matches("joiningGiveawayFailed"),
  );

  // Once the join effect settles, drop straight into the event.
  useEffect(() => {
    if (joinSettled && joining) {
      gameService.send("CONTINUE");
      navigate(`/giveaway/play/${joining.id}?type=${joining.type}`);
    }
  }, [joinSettled, joining, gameService, navigate]);

  // In offline / UI mode there's no token, but the action serves a mock feed.
  const canFetch = !!token || !CONFIG.API_URL;
  const { data: feed } = useSWR(
    canFetch ? ["giveaways-hud"] : null,
    () => getGiveaways({ token }),
    { refreshInterval: POLL_MS },
  );

  // `active` is soonest-first — surface the next community game.
  const next = feed?.active?.[0];
  if (!next || hide) return null;

  const type =
    recallGiveawayType(next.id) ??
    minigameFromTitle(next.title) ??
    DEFAULT_MINIGAME;

  const enter = () => {
    const dest = `/giveaway/play/${next.id}?type=${type}`;
    // Offline mode, or a game that's already live (can't be joined) — go
    // straight in. Otherwise join, then navigate once the effect settles.
    if (!CONFIG.API_URL || next.status === "live") {
      navigate(dest);
      return;
    }
    setJoining({ id: next.id, type });
    gameService.send("giveaway.joined", {
      effect: { type: "giveaway.joined", giveawayId: next.id },
      authToken: token,
    });
  };

  return (
    <ButtonPanel className="flex justify-center">
      <Countdown
        live={next.status === "live"}
        startAt={next.startAt}
        endAt={next.endAt}
        onClick={enter}
        onHide={() => setHide(true)}
      />
    </ButtonPanel>
  );
};
