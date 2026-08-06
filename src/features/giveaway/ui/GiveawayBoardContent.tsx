import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";
import { useNavigate } from "react-router";
import useSWR from "swr";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { Loading } from "features/auth/components";
import { Context as GameContext } from "features/game/GameProvider";
import * as Auth from "features/auth/lib/Provider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasFeatureAccess } from "lib/flags";
import { CONFIG } from "lib/config";
import { SUNNYSIDE } from "assets/sunnyside";
import { useNow } from "lib/utils/hooks/useNow";
import { millisecondsToString } from "lib/utils/time";

import { getGiveaways } from "../actions/getGiveaways";
import { CreateGiveaway } from "./CreateGiveaway";
import {
  DEFAULT_MINIGAME,
  minigameDescription,
  minigameFromTitle,
  type MinigameType,
} from "../lib/minigames";
import { recallGiveawayType } from "../lib/giveawayType";

/**
 * The Community Games panel body (no CloseButtonPanel of its own, so it can sit
 * inside the streamer modal's tab or the plaza board). Lists what's on and
 * recently finished, lets admins create a giveaway inline, and drops the player
 * into the event — all management and results live inside the event itself.
 */
export const GiveawayBoardContent: React.FC = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { gameService } = useContext(GameContext);
  const { authService } = useContext(Auth.Context);
  const token = authService.getSnapshot().context.user.rawToken as string;

  const gameState = useSelector(gameService, (state) => state.context.state);
  const isAdmin = hasFeatureAccess(gameState, "GIVEAWAY_ADMIN");

  const [showCreate, setShowCreate] = useState(false);
  const [joining, setJoining] = useState<{ id: string; type: MinigameType }>();

  const now = useNow({ live: true, intervalMs: 1000 });

  const { isJoining, joinSettled } = useSelector(gameService, (state) => ({
    isJoining: state.matches("joiningGiveaway"),
    joinSettled:
      state.matches("joiningGiveawaySuccess") ||
      state.matches("joiningGiveawayFailed"),
  }));

  const canFetch = !!token || !CONFIG.API_URL;
  const { data: feed } = useSWR(
    canFetch ? ["giveaways"] : null,
    () => getGiveaways({ token }),
    { refreshInterval: 10000 },
  );

  // On a completed join effect, drop straight into the event (with its type).
  useEffect(() => {
    if (joinSettled && joining) {
      gameService.send("CONTINUE");
      navigate(`/giveaway/play/${joining.id}?type=${joining.type}`);
    }
  }, [joinSettled, joining, gameService, navigate]);

  // The mini-game for a giveaway: the creator's local mapping, else inferred
  // from the title, else the default (see minigames.ts — the API has no type).
  const typeFor = (id: string, title: string): MinigameType =>
    recallGiveawayType(id) ?? minigameFromTitle(title) ?? DEFAULT_MINIGAME;

  const enter = (id: string, type: MinigameType) =>
    navigate(`/giveaway/play/${id}?type=${type}`);

  const join = (id: string, type: MinigameType) => {
    // Offline / UI mode: no backend to join — enter the event directly.
    if (!CONFIG.API_URL) return enter(id, type);
    setJoining({ id, type });
    gameService.send("giveaway.joined", {
      effect: { type: "giveaway.joined", giveawayId: id },
      authToken: token,
    });
  };

  const startsInLabel = (startAt: number) => {
    const seconds = Math.max(0, Math.ceil((startAt - now) / 1000));
    return seconds >= 60
      ? t("giveaway.startsInMinutes", { count: Math.ceil(seconds / 60) })
      : t("giveaway.startsInSeconds", { count: seconds });
  };

  if (showCreate) {
    return <CreateGiveaway onBack={() => setShowCreate(false)} />;
  }

  const active = feed?.active ?? [];
  const past = feed?.recent ?? [];

  return (
    <div className="flex flex-col gap-2 p-1">
      {isAdmin && (
        <Button onClick={() => setShowCreate(true)}>
          {t("giveaway.create")}
        </Button>
      )}

      {!feed && <Loading />}

      {feed && active.length === 0 && past.length === 0 && (
        <p className="text-sm p-1">{t("giveaway.none")}</p>
      )}

      {active.map((giveaway) => {
        const type = typeFor(giveaway.id, giveaway.title);
        const isLive = giveaway.status === "live";

        return (
          <InnerPanel key={giveaway.id} className="flex flex-col gap-2 p-2">
            <div className="flex justify-between items-center gap-1">
              <Label type="default">{giveaway.title}</Label>
              {isLive ? (
                <Label type="danger">{t("giveaway.gameLive")}</Label>
              ) : (
                <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                  {startsInLabel(giveaway.startAt)}
                </Label>
              )}
            </div>

            <p className="text-xs">{minigameDescription(type)}</p>

            {isLive ? (
              // A live game can't be joined — you'd have missed the start.
              <p className="text-xxs italic">{t("giveaway.waitingResults")}</p>
            ) : isJoining && joining?.id === giveaway.id ? (
              <Loading text={t("giveaway.joining")} />
            ) : (
              <Button onClick={() => join(giveaway.id, type)}>
                {t("giveaway.clickToJoin")}
              </Button>
            )}

            {/* Admins can still slip into a live game to run / finish it. */}
            {isLive && isAdmin && (
              <Button
                className="w-auto text-xxs"
                onClick={() => enter(giveaway.id, type)}
              >
                {t("giveaway.enter")}
              </Button>
            )}
          </InnerPanel>
        );
      })}

      {past.length > 0 && (
        <>
          <Label type="default">{t("giveaway.pastResults")}</Label>
          {past.map((giveaway) => (
            <InnerPanel
              key={giveaway.id}
              className="flex justify-between items-center gap-2 p-2"
            >
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs truncate">{giveaway.title}</span>
                <span className="text-xxs italic">
                  {t("giveaway.endedAgo", {
                    time: millisecondsToString(
                      Math.max(0, now - giveaway.endedAt),
                      { length: "short" },
                    ),
                  })}
                </span>
              </div>
              <Button
                className="w-auto text-xxs"
                onClick={() =>
                  enter(giveaway.id, typeFor(giveaway.id, giveaway.title))
                }
              >
                {t("giveaway.viewResults")}
              </Button>
            </InnerPanel>
          ))}
        </>
      )}
    </div>
  );
};
