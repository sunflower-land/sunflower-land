import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";
import { useNavigate } from "react-router";

import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { RoundButton } from "components/ui/RoundButton";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Loading } from "features/auth/components";
import { Context as GameContext } from "features/game/GameProvider";
import * as Auth from "features/auth/lib/Provider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasFeatureAccess } from "lib/flags";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

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

  const finished =
    playerScore !== undefined || phase === "ended" || phase === "complete";

  // The management / results panel, opened from the disc button. It defaults to
  // open once the event finishes (so results surface without a tap); once the
  // player opens or closes it, their choice takes over. `undefined` = follow the
  // default, avoiding a setState-in-effect.
  const [panelOverride, setPanelOverride] = useState<boolean | undefined>(
    undefined,
  );
  const panelOpen = panelOverride ?? finished;

  // Hide the claim button as soon as it's used. Optimistic: an "already claimed"
  // error is effectively claimed too, so we don't put it back on failure.
  const [claimed, setClaimed] = useState(false);

  // "You missed the start" — you joined a live game whose race already began
  // (its start time is before you arrived). Derived off the mount time so no
  // setState-in-effect is needed.
  const [mountedAt] = useState(() => Date.now());
  const [missedDismissed, setMissedDismissed] = useState(false);
  const missedStart =
    !!board &&
    board.status === "live" &&
    board.startAt < mountedAt &&
    !missedDismissed;

  // Once the admin finalises, refresh so positions/prizes appear.
  useEffect(() => {
    if (endSettled) {
      gameService.send("CONTINUE");
      refresh();
    }
  }, [endSettled, gameService, refresh]);

  useEffect(() => {
    if (claimSuccess || claimFailed) {
      // Return the machine to `playing`; the prize airdrop (added to gameState by
      // the effect) surfaces through the standard airdrop-claim UI.
      gameService.send("CONTINUE");
    }
  }, [claimSuccess, claimFailed, gameService]);

  const finishEvent = () =>
    gameService.send("giveaway.ended", {
      effect: { type: "giveaway.ended", giveawayId: id },
      authToken: token,
    });

  const claim = () => {
    setClaimed(true);
    gameService.send("giveaway.claimed", {
      effect: { type: "giveaway.claimed", giveawayId: id },
      authToken: token,
    });
  };

  const playerRow = board?.leaderboard.find((r) => r.farmId === playerId);
  const prizeTier =
    playerRow && board
      ? prizeForPosition(board.prizes, playerRow.position)
      : undefined;
  const canClaim = board?.status === "complete" && !!prizeTier;

  return (
    <div className="absolute inset-0">
      <GiveawayPhaser minigame={minigame} />

      {/* Status banner + the big 30s race clock */}
      {board && !finished && (
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

      {/* Management / results disc — always available, top-right. */}
      {board && (
        <div className="absolute top-2 right-2 z-20">
          <RoundButton onClick={() => setPanelOverride(true)}>
            <img
              src={SUNNYSIDE.icons.settings}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: `${PIXEL_SCALE * 12}px` }}
            />
          </RoundButton>
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
                <Button onClick={() => navigate("/world/stream")}>
                  {t("giveaway.goHome")}
                </Button>
              </div>
            </Panel>
          </div>
        </div>
      )}

      {/* Log Chop instructions */}
      {minigame === "chop" && phase === "racing" && !finished && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <Label type="vibrant">{t("giveaway.chopHint")}</Label>
        </div>
      )}

      {/* Management / results & leaderboard */}
      <Modal show={panelOpen && !!board} onHide={() => setPanelOverride(false)}>
        {board && (
          <CloseButtonPanel
            title={board.title}
            onClose={() => setPanelOverride(false)}
          >
            <div className="flex flex-col gap-2 p-1">
              {/* Your own score, once you've finished. */}
              {playerScore !== undefined && (
                <Label type="info">
                  {t("giveaway.yourScore", { score: playerScore })}
                </Label>
              )}

              {board.status === "complete" ? (
                // Finalised — show the ranked board and (winners) the claim.
                <>
                  <GiveawayLeaderboard id={id} />
                  {canClaim &&
                    !claimed &&
                    (isClaiming ? (
                      <Loading text={t("claiming")} />
                    ) : (
                      <Button onClick={claim}>
                        {t("giveaway.claimPrize")}
                      </Button>
                    ))}
                </>
              ) : (
                // Not finalised yet — the leaderboard only appears once the host
                // ends the event. Until then, wait (or, for the host, finish).
                <>
                  {playerScore !== undefined && (
                    <p className="text-xs">{t("giveaway.finishedWaiting")}</p>
                  )}
                  {isAdmin ? (
                    isEnding ? (
                      <Loading text={t("giveaway.finishing")} />
                    ) : (
                      <Button onClick={finishEvent}>
                        {t("giveaway.finishEvent")}
                      </Button>
                    )
                  ) : (
                    playerScore !== undefined && (
                      <Loading text={t("giveaway.waitingHost")} />
                    )
                  )}
                </>
              )}

              <Button onClick={() => navigate("/world/stream")}>
                {t("giveaway.goHome")}
              </Button>
            </div>
          </CloseButtonPanel>
        )}
      </Modal>

      {/* Joined a live game that already kicked off. */}
      <Modal show={missedStart} onHide={() => setMissedDismissed(true)}>
        <CloseButtonPanel onClose={() => setMissedDismissed(true)}>
          <div className="flex flex-col items-center gap-2 p-2">
            <Label type="danger">{t("giveaway.missedStartTitle")}</Label>
            <p className="text-sm text-center">{t("giveaway.missedStart")}</p>
            <Button onClick={() => navigate("/world/stream")}>
              {t("giveaway.goHome")}
            </Button>
          </div>
        </CloseButtonPanel>
      </Modal>
    </div>
  );
};
