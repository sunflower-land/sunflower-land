import React, { useContext, useEffect } from "react";
import { useSelector } from "@xstate/react";
import { useNavigate } from "react-router";

import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Loading } from "features/auth/components";
import { Context as GameContext } from "features/game/GameProvider";
import * as Auth from "features/auth/lib/Provider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasFeatureAccess } from "lib/flags";
import { toOrdinalSuffix } from "features/retreat/components/auctioneer/AuctionLeaderboardTable";

import { GiveawayPhaser } from "./GiveawayPhaser";
import { GiveawayContext } from "./lib/GiveawayProvider";
import {
  GiveawayLeaderboard,
  prizeForPosition,
} from "./ui/GiveawayLeaderboard";
import { type MinigameType, DEFAULT_MINIGAME } from "./lib/minigames";

export const GiveawayGame: React.FC<{ minigame?: MinigameType }> = ({
  minigame = DEFAULT_MINIGAME,
}) => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { gameService } = useContext(GameContext);
  const { authService } = useContext(Auth.Context);
  const {
    id,
    board,
    phase,
    countdownMs,
    raceRemainingMs,
    displayScore,
    playerScore,
    isLoading,
    refresh,
    bridge,
  } = useContext(GiveawayContext);

  const token = authService.getSnapshot().context.user.rawToken as string;
  const playerId = useSelector(gameService, (state) => state.context.farmId);

  const gameState = useSelector(gameService, (state) => state.context.state);
  const isAdmin = hasFeatureAccess(gameState, "GIVEAWAY_ADMIN");

  const { isClaiming, claimSuccess, claimFailed, isEnding, endSettled } =
    useSelector(gameService, (state) => ({
      isClaiming: state.matches("claimingGiveaway"),
      claimSuccess: state.matches("claimingGiveawaySuccess"),
      claimFailed: state.matches("claimingGiveawayFailed"),
      isEnding: state.matches("endingGiveaway"),
      endSettled:
        state.matches("endingGiveawaySuccess") ||
        state.matches("endingGiveawayFailed"),
    }));

  // Once the admin finalises, refresh so positions/prizes appear.
  useEffect(() => {
    if (endSettled) {
      gameService.send("CONTINUE");
      refresh();
    }
  }, [endSettled, gameService, refresh]);

  const finishEvent = () =>
    gameService.send("giveaway.ended", {
      effect: { type: "giveaway.ended", giveawayId: id },
      authToken: token,
    });

  useEffect(() => {
    if (claimSuccess || claimFailed) {
      // Return the machine to `playing`; the prize airdrop (added to gameState by
      // the effect) surfaces through the standard airdrop-claim UI.
      gameService.send("CONTINUE");
    }
  }, [claimSuccess, claimFailed, gameService]);

  const playerRow = board?.leaderboard.find((r) => r.farmId === playerId);
  const prizeTier =
    playerRow && board
      ? prizeForPosition(board.prizes, playerRow.position)
      : undefined;
  const canClaim = board?.status === "complete" && !!prizeTier;

  const claim = () =>
    gameService.send("giveaway.claimed", {
      effect: { type: "giveaway.claimed", giveawayId: id },
      authToken: token,
    });

  // The results panel shows once the player finishes, or once the event is over.
  const showResults =
    playerScore !== undefined || phase === "ended" || phase === "complete";

  return (
    <div className="absolute inset-0">
      <GiveawayPhaser minigame={minigame} />

      {/* Status banner + the big 30s race clock */}
      {board && !showResults && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1">
          <Label type="info">{board.title}</Label>
          {phase === "racing" && (
            <span
              className="font-secondary"
              style={{
                fontSize: "64px",
                lineHeight: 1,
                // Runs red for the last 5 seconds.
                color: raceRemainingMs <= 5000 ? "#e43b44" : "#ffffff",
                textShadow: "3px 3px 0 rgba(0,0,0,0.7)",
              }}
            >
              {Math.ceil(raceRemainingMs / 1000)}
            </span>
          )}
          {/* Rendered in HTML rather than canvas text so it stays crisp. */}
          {phase === "racing" && minigame === "chop" && (
            <span
              className="font-secondary text-white"
              style={{
                fontSize: "28px",
                lineHeight: 1,
                textShadow: "2px 2px 0 rgba(0,0,0,0.7)",
              }}
            >
              {t("giveaway.scoreValue", { score: displayScore })}
            </span>
          )}
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Panel>
            <Loading />
          </Panel>
        </div>
      )}

      {/* Lobby: waiting for the event to start */}
      {phase === "lobby" && board && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="pointer-events-auto w-full max-w-xs">
            <Panel>
              <div className="flex flex-col items-center gap-2 p-1">
                <Label type="default">{board.title}</Label>
                <p className="text-sm text-center">
                  {t("giveaway.startingIn")}
                </p>
                {/* Whole seconds only — ticks 3, 2, 1 then the lobby closes. */}
                <span
                  className="font-secondary"
                  style={{ fontSize: "40px", lineHeight: 1 }}
                >
                  {Math.max(1, Math.ceil(countdownMs / 1000))}
                </span>
                <span className="text-xxs">
                  {t("giveaway.participants", {
                    count: board.totalParticipants,
                  })}
                </span>
              </div>
            </Panel>
          </div>
        </div>
      )}

      {/* Log Chop instructions */}
      {minigame === "chop" && phase === "racing" && !showResults && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <Label type="vibrant">{t("giveaway.chopHint")}</Label>
        </div>
      )}

      {/* Results / leaderboard */}
      {showResults && board && (
        <div className="absolute inset-0 flex items-center justify-center z-10 overflow-y-auto pointer-events-none">
          <div className="pointer-events-auto w-full max-w-md my-4">
            <Panel>
              <div className="flex flex-col gap-2 p-1">
                <div className="flex justify-between items-center gap-1">
                  <Label type="success">{board.title}</Label>
                  <div className="flex items-center gap-1">
                    {playerScore !== undefined && (
                      <Label type="info">
                        {t("giveaway.yourScore", { score: playerScore })}
                      </Label>
                    )}
                    {/* Your finishing position (only known inside the top 10). */}
                    {playerRow && (
                      <Label type="default">
                        {toOrdinalSuffix(playerRow.position)}
                      </Label>
                    )}
                  </div>
                </div>

                {phase === "racing" && playerScore !== undefined && (
                  <p className="text-xs">{t("giveaway.finishedWaiting")}</p>
                )}

                <GiveawayLeaderboard id={id} />

                <Button onClick={() => refresh()}>
                  {t("giveaway.refreshBoard")}
                </Button>

                {/* The creator decides when the event is finalised — this
                    assigns positions and sends out the prizes. */}
                {isAdmin &&
                  board.status !== "complete" &&
                  (isEnding ? (
                    <Loading text={t("giveaway.finishing")} />
                  ) : (
                    <Button onClick={finishEvent}>
                      {t("giveaway.finishEvent")}
                    </Button>
                  ))}

                {canClaim &&
                  (isClaiming ? (
                    <Loading text={t("claiming")} />
                  ) : (
                    <Button onClick={claim}>{t("giveaway.claimPrize")}</Button>
                  ))}

                <Button onClick={() => navigate("/world/plaza")}>
                  {t("giveaway.backToTown")}
                </Button>
              </div>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
};
