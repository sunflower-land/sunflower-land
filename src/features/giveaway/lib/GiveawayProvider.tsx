import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "@xstate/react";
import useSWR from "swr";

import { Context as GameContext } from "features/game/GameProvider";
import * as Auth from "features/auth/lib/Provider";
import type { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { CONFIG } from "lib/config";

import { getGiveawayLeaderboard } from "../actions/getGiveawayLeaderboard";
import type { GiveawayLeaderboardResponse } from "./types";
import { getPhase, type GiveawayPhase } from "./phase";
import type { GiveawayBridge } from "./bridge";
import { RACE_DURATION_MS } from "./sim";

const BOARD_POLL_MS = 5000;

interface GiveawayContextValue {
  id: string;
  board?: GiveawayLeaderboardResponse;
  isLoading: boolean;
  phase: GiveawayPhase;
  /** ms until the race starts (0 once live). */
  countdownMs: number;
  /** ms left on the 30s race clock (0 unless racing). */
  raceRemainingMs: number;
  /** Live score for the HUD, updated as the mini-game plays. */
  displayScore: number;
  /** The score the local player achieved, once they finish. */
  playerScore?: number;
  isSubmitting: boolean;
  bridge: GiveawayBridge;
  refresh: () => void;
}

export const GiveawayContext = React.createContext<GiveawayContextValue>(
  {} as GiveawayContextValue,
);

export const GiveawayProvider: React.FC<
  React.PropsWithChildren<{ id: string }>
> = ({ id, children }) => {
  const { gameService } = useContext(GameContext);
  const { authService } = useContext(Auth.Context);

  const token = authService.getSnapshot().context.user.rawToken as string;

  const { playerId, playerClothing } = useSelector(gameService, (state) => ({
    playerId: state.context.farmId,
    playerClothing: state.context.state.bumpkin?.equipped,
  }));

  const { isSubmitting, isSubmitSuccess, isSubmitFailed, isPlaying } =
    useSelector(gameService, (state) => ({
      isSubmitting: state.matches("submittingGiveaway"),
      isSubmitSuccess: state.matches("submittingGiveawaySuccess"),
      isSubmitFailed: state.matches("submittingGiveawayFailed"),
      isPlaying: state.matches("playing"),
    }));

  // In offline / UI mode there's no token, but the action serves a mock board.
  const canFetch = !!token || !CONFIG.API_URL;

  const { data: board, mutate } = useSWR(
    canFetch ? ["giveawayLeaderboard", id] : null,
    () => getGiveawayLeaderboard({ token, id }),
    { refreshInterval: BOARD_POLL_MS },
  );

  // A ticking clock so the countdowns update and the phase auto-advances.
  // Sub-second so the 30s race clock doesn't visibly stutter.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, []);

  const phase = getPhase(board, now);
  const countdownMs = board ? Math.max(0, board.startAt - now) : 0;
  // The race runs for a fixed 30s from startAt.
  const raceRemainingMs =
    board && phase === "racing"
      ? Math.max(
          0,
          Math.min(RACE_DURATION_MS, board.startAt + RACE_DURATION_MS - now),
        )
      : 0;

  // Keep a ref of the latest board so the (stable) bridge getters see fresh data.
  const boardRef = useRef(board);
  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  /** Score shown in the HUD as it changes (display only — never submitted). */
  const [displayScore, setDisplayScore] = useState(0);
  // The final score, set once when the game ends — the only score submitted.
  const [playerScore, setPlayerScore] = useState<number | undefined>(undefined);
  const submittedRef = useRef(false);

  // Stable bridge object handed to Phaser once (see GiveawayPhaser).
  const bridge = useMemo<GiveawayBridge>(
    () => ({
      giveawayId: id,
      playerId,
      playerClothing: playerClothing as unknown as BumpkinParts,
      getParticipants: () => boardRef.current?.participants ?? [],
      getUsernames: () =>
        (boardRef.current?.leaderboard ?? []).reduce<Record<number, string>>(
          (acc, row) => {
            if (row.username) acc[row.farmId] = row.username;
            return acc;
          },
          {},
        ),
      getPhase: () => getPhase(boardRef.current, Date.now()),
      getRaceStartAt: () => boardRef.current?.startAt ?? Date.now(),
      // We only submit the final score, so mid-game progress is display-only.
      onProgress: () => {},
      onScoreChange: setDisplayScore,
      onFinish: (score: number) => setPlayerScore((prev) => prev ?? score),
    }),
    // playerId / playerClothing are stable for the session; id is fixed per route.
    [id, playerId, playerClothing],
  );

  // Submit the final score ONCE, when the game ends and the machine is idle.
  // (No mid-game submissions — that flashed a loading modal every few seconds.)
  useEffect(() => {
    if (playerScore === undefined || submittedRef.current) return;

    // Offline / UI mode: no backend — keep the local score for the results view.
    if (!CONFIG.API_URL) {
      submittedRef.current = true;
      return;
    }
    if (!isPlaying) return;

    submittedRef.current = true;
    gameService.send("giveaway.submitted", {
      effect: {
        type: "giveaway.submitted",
        giveawayId: id,
        score: playerScore,
      },
      authToken: token,
    });
  }, [playerScore, isPlaying, gameService, id, token]);

  // Auto-acknowledge the effect result so the machine returns to `playing`, then
  // refresh the board to show the just-submitted score.
  useEffect(() => {
    if (isSubmitSuccess || isSubmitFailed) {
      gameService.send("CONTINUE");
      mutate();
    }
  }, [isSubmitSuccess, isSubmitFailed, gameService, mutate]);

  const value: GiveawayContextValue = {
    id,
    board,
    isLoading: !board,
    phase,
    countdownMs,
    raceRemainingMs,
    displayScore,
    playerScore,
    isSubmitting,
    bridge,
    refresh: () => mutate(),
  };

  return (
    <GiveawayContext.Provider value={value}>
      {children}
    </GiveawayContext.Provider>
  );
};
