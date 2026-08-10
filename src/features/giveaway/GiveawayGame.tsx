import React, { useContext, useEffect, useRef, useState } from "react";
import { useInterpret, useSelector } from "@xstate/react";
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

import {
  mmoMachine,
  type MachineInterpreter as MMOMachineInterpreter,
  type MMOContext,
} from "features/world/mmoMachine";
import { GiveawayPhaser } from "./GiveawayPhaser";
import { GiveawayContext } from "./lib/GiveawayProvider";
import {
  GiveawayLeaderboard,
  prizeForPosition,
} from "./ui/GiveawayLeaderboard";
import { RaceButtons } from "./ui/RaceButtons";
import { EggButtons } from "./ui/EggButtons";
import { JumpButton } from "./ui/JumpButton";
import { TriviaPanel } from "./ui/TriviaPanel";
import { FishButton } from "./ui/FishButton";
import { GameLeaderboard } from "./ui/GameLeaderboard";
import {
  type MinigameType,
  DEFAULT_MINIGAME,
  GIVEAWAY_MINIGAMES,
} from "./lib/minigames";
import type { RaceControls } from "./lib/raceControls";
import type { EggControls } from "./lib/eggControls";
import type { JumpControls } from "./lib/jumpControls";
import type { TriviaControls } from "./lib/triviaControls";
import type { FishingControls } from "./lib/fishingControls";
import { syncServerClock, resetServerClock } from "./lib/serverClock";

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

  // The one MMO connection for this event — shared by the Phaser game (rendering
  // other players) and the leaderboard (ranking by their broadcast positions).
  // Routed to the party-games room by the giveaway scene id.
  const sceneId =
    GIVEAWAY_MINIGAMES.find((m) => m.type === minigame)?.sceneId ??
    "giveaway_race";
  const gameContext = gameService.getSnapshot().context;
  const mmoService = useInterpret(mmoMachine, {
    context: {
      jwt: authService.getSnapshot().context.user.rawToken,
      farmId: gameContext.farmId,
      bumpkin: gameState.bumpkin,
      pets: gameState.pets,
      faction: gameState.faction?.name,
      sceneId,
      experience: gameState.bumpkin?.experience ?? 0,
      isCommunity: false,
      moderation: gameContext.moderation,
      username: gameState.username,
    },
  }) as unknown as MMOMachineInterpreter;

  useEffect(() => {
    return () => {
      mmoService.getSnapshot().context.server?.leave();
    };
  }, [mmoService]);

  // Once the event is over, drop off the party server (frees the connection —
  // the results screen reads the finalised board from the API, not the MMO).
  // The authoritative clear-out is the server ending the room; this is the
  // client leaving promptly so nobody lingers on it.
  const leftRoomRef = useRef(false);
  useEffect(() => {
    if ((phase === "complete" || phase === "ended") && !leftRoomRef.current) {
      leftRoomRef.current = true;
      mmoService.getSnapshot().context.server?.leave();
    }
  }, [phase, mmoService]);

  // The joined room, for the leaderboard. The subscribe writes it to a ref
  // (synchronous, always current — like the scene's registry), and a poll pulls
  // it into state every 400ms. Pull-based so it can't lag behind the scene the
  // way a push (setState-in-subscribe) did — the room shows up within a tick.
  const serverRef = useRef<MMOContext["server"]>(
    mmoService.getSnapshot().context.server,
  );
  const [mmoServer, setMmoServer] = useState<MMOContext["server"]>(
    mmoService.getSnapshot().context.server,
  );
  useEffect(() => {
    const sub = mmoService.subscribe((state) => {
      serverRef.current = state.context.server;
    });
    const poll = setInterval(() => {
      setMmoServer(serverRef.current);
      // Sync our clock to the room's authoritative time so everyone runs the
      // game on the same timeline (see serverClock).
      syncServerClock(serverRef.current?.state?.serverTime ?? 0);
    }, 400);
    return () => {
      sub.unsubscribe();
      clearInterval(poll);
      resetServerClock();
    };
  }, [mmoService]);

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

  // The per-game input channel shared with the Phaser scene, created exactly
  // once (a stable object, so the Phaser game never re-mounts). Race uses a
  // colour target + a press queue; Egg Catch uses a held direction.
  const [raceTarget, setRaceTarget] = useState<number | null>(null);
  // Latest resolved press, for button feedback. `nonce` bumps every press so the
  // HUD re-animates even when the same button is hit twice in a row.
  const [raceFeedback, setRaceFeedback] = useState<{
    color: number;
    correct: boolean;
    nonce: number;
  }>();
  const [controls] = useState<
    RaceControls | EggControls | JumpControls | TriviaControls | FishingControls
  >(() => {
    if (minigame === "eggs") {
      // Mutated through `set` (a method) rather than by assignment, so the
      // scene reads a live `move` without tripping the no-mutate-state rule.
      const egg: EggControls = {
        move: 0,
        set: (dir) => {
          egg.move = dir;
        },
      };
      return egg;
    }
    if (minigame === "trivia") {
      const trivia: TriviaControls = {
        pending: null,
        picked: null,
        lastResult: null,
        pick: (answer) => {
          trivia.pending = answer;
        },
      };
      return trivia;
    }
    if (minigame === "fishing") {
      const fishing: FishingControls = {
        casts: 0,
        lastResult: null,
        casting: false,
        cast: () => {
          fishing.casts += 1;
        },
      };
      return fishing;
    }
    if (minigame === "jump") {
      const jumpControls: JumpControls = {
        taps: 0,
        theta: 0,
        lastTap: null,
        tap: () => {
          jumpControls.taps += 1;
        },
      };
      return jumpControls;
    }
    return {
      setTarget: setRaceTarget,
      queue: [],
      onFeedback: (color, correct) =>
        setRaceFeedback((prev) => ({
          color,
          correct,
          nonce: (prev?.nonce ?? 0) + 1,
        })),
    };
  });

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
      <GiveawayPhaser
        minigame={minigame}
        mmoService={mmoService}
        controls={controls}
      />

      {/* Live MMO-position leaderboard, top-left. */}
      <GameLeaderboard server={mmoServer} minigame={minigame} />

      {/* Race: the four colour buttons + how-to hint. Shown from the lobby (so
          players see the controls before the start) through the race itself;
          presses only count once racing, when a colour lights up. */}
      {minigame === "race" &&
        (phase === "lobby" || phase === "racing") &&
        !finished && (
          <>
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
              <Label type="vibrant">{t("giveaway.raceHint")}</Label>
            </div>
            <RaceButtons
              target={raceTarget}
              feedback={raceFeedback}
              onPress={(color) => (controls as RaceControls).queue.push(color)}
            />
          </>
        )}

      {/* Egg Catch: mobile left/right (also driven by arrows / A-D in the scene) */}
      {minigame === "eggs" && phase === "racing" && !finished && (
        <EggButtons onMove={(dir) => (controls as EggControls).set(dir)} />
      )}

      {/* Jumper: tap button with the spinning ring (also driven by SPACE) */}
      {minigame === "jump" && phase === "racing" && !finished && (
        <JumpButton controls={controls as JumpControls} />
      )}

      {/* Trivia: question + four answer buttons (also 1-4 keys in the scene) */}
      {minigame === "trivia" && phase === "racing" && !finished && (
        <TriviaPanel controls={controls as TriviaControls} />
      )}

      {/* Fishing: tap to cast (also SPACE in the scene) */}
      {minigame === "fishing" && phase === "racing" && !finished && (
        <FishButton controls={controls as FishingControls} />
      )}

      {/* Status banner + the big 30s race clock */}
      {board && !finished && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1">
          <Label type="info">{board.title}</Label>
          {/* Trivia shows its own per-question countdown in the panel instead. */}
          {phase === "racing" && minigame !== "trivia" && (
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
          {/* Point-based games show a live score, in HTML so it stays crisp. */}
          {phase === "racing" &&
            (minigame === "chop" ||
              minigame === "eggs" ||
              minigame === "jump" ||
              minigame === "fishing") && (
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
                <Button onClick={() => navigate("/world/kingdom")}>
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

      {/* Egg Catch instructions (sits above the corner move buttons) */}
      {minigame === "eggs" && phase === "racing" && !finished && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
          <Label type="vibrant">{t("giveaway.eggHint")}</Label>
        </div>
      )}

      {/* Jumper instructions (sits above the tap button) */}
      {minigame === "jump" && phase === "racing" && !finished && (
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-10">
          <Label type="vibrant">{t("giveaway.jumpHint")}</Label>
        </div>
      )}

      {/* Fishing instructions (sits above the cast button) */}
      {minigame === "fishing" && phase === "racing" && !finished && (
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-10">
          <Label type="vibrant">{t("giveaway.fishHint")}</Label>
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
              {board.status === "complete" ? (
                // Finalised — show the ranked board (your own score sits above it
                // when you finished outside the top 10) and, for winners, claim.
                <>
                  <GiveawayLeaderboard id={id} playerScore={playerScore} />
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
                    <>
                      <Label type="info">
                        {t("giveaway.yourScore", { score: playerScore })}
                      </Label>
                      <p className="text-xs">{t("giveaway.finishedWaiting")}</p>
                    </>
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

              <Button onClick={() => navigate("/world/kingdom")}>
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
            <Button onClick={() => navigate("/world/kingdom")}>
              {t("giveaway.goHome")}
            </Button>
          </div>
        </CloseButtonPanel>
      </Modal>
    </div>
  );
};
