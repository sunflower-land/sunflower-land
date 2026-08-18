import React, { useEffect, useRef, useState } from "react";

import { Panel, InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { PopControls, PopReveal } from "../lib/popControls";
import {
  POP_ROUNDS,
  POP_REVEAL_MS,
  POP_WATER_MS,
  POP_ELIMINATION_FRACTION,
} from "../lib/pop";

/** How long the bursts get the screen to themselves before the panel slides in. */
const BURST_WINDOW_MS = 900;

/** How long the "don't finish top" nudge stays up at the start of round one. */
const OPENING_HINT_MS = 4000;

/** Most popped growers listed before the rest are summarised as "+n more". */
const MAX_VICTIM_ROWS = 5;

/** Snapshot of the scene's round state, polled into React. */
type Snapshot = {
  round: number;
  phase: PopControls["phase"];
  msLeft: number;
  banked: number;
  reveal: PopReveal | null;
};

const snapshot = (c: PopControls): Snapshot => ({
  round: c.round,
  phase: c.phase,
  msLeft: c.msLeft,
  banked: c.banked,
  reveal: c.reveal,
});

/** The end-of-round verdict: did your pumpkin survive, and what you banked. */
const RevealPopup: React.FC<{ reveal: PopReveal }> = ({ reveal }) => {
  const { t } = useAppTranslation();
  const ref = useRef<HTMLDivElement>(null);

  // Re-fire the entrance for each round's reveal (keyed on nonce by the caller).
  useEffect(() => {
    ref.current?.animate(
      [
        { transform: "scale(0.7)", opacity: 0 },
        { transform: "scale(1.06)", opacity: 1, offset: 0.6 },
        { transform: "scale(1)", opacity: 1 },
      ],
      { duration: 320, easing: "ease-out" },
    );
  }, []);

  const listed = reveal.victims.slice(0, MAX_VICTIM_ROWS);
  const overflow = reveal.victims.length - listed.length;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
      <div ref={ref} className="w-full max-w-[260px]">
        <Panel>
          <div className="flex flex-col items-center gap-1 p-1">
            <span
              className="font-secondary"
              style={{
                fontSize: "34px",
                lineHeight: 1,
                color: reveal.survived ? "#4caf50" : "#e43b44",
              }}
            >
              {reveal.survived
                ? t("giveaway.pop.safe")
                : t("giveaway.pop.popped")}
            </span>

            {/* Always spell out the cap — it's the number you're playing
                against, and knowing where it landed is how you pace the next
                round. */}
            <span className="text-xxs text-center opacity-80">
              {reveal.survived
                ? t("giveaway.pop.safeBy", {
                    waters: reveal.myWaters,
                    cap: reveal.cap,
                  })
                : t("giveaway.pop.tooKeen", {
                    waters: reveal.myWaters,
                    cap: reveal.cap,
                  })}
            </span>

            <Label type="danger">
              {t("giveaway.pop.poppedCount", {
                count: reveal.victims.length,
              })}
            </Label>

            <InnerPanel className="w-full p-1">
              <table className="w-full text-xxs">
                <tbody>
                  {listed.map((v, i) => (
                    <tr
                      key={`${v.name}-${i}`}
                      className={v.isSelf ? "bg-[#ffdc82]" : ""}
                    >
                      <td className="py-0.5 px-1 truncate max-w-[140px]">
                        {v.name}
                      </td>
                      <td className="py-0.5 px-1 text-right whitespace-nowrap">
                        {t("giveaway.pop.waters", { count: v.waters })}
                      </td>
                    </tr>
                  ))}
                  {overflow > 0 && (
                    <tr>
                      <td colSpan={2} className="text-center leading-none">
                        {t("giveaway.pop.andMore", { count: overflow })}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </InnerPanel>

            {/* What the round was worth: survive it and its waters are banked,
                pop and they're gone — but nothing already banked is lost. */}
            {reveal.survived ? (
              <Label type="success">
                {t("giveaway.pop.bankedRound", { count: reveal.myWaters })}
              </Label>
            ) : (
              <Label type="danger">{t("giveaway.pop.bankedNothing")}</Label>
            )}

            <span className="text-xxs text-center opacity-80">
              {t("giveaway.pop.totalBanked", { count: reveal.banked })}
            </span>
          </div>
        </Panel>
      </div>
    </div>
  );
};

/**
 * The Pumpkin Pop HUD: the round clock at the top, the rules intro before round
 * one, and the pop reveal between rounds.
 *
 * All of it is driven off the scene's single game clock (published through
 * `PopControls`), polled here a few times a second — so the panel can never
 * drift out of step with the pumpkins actually bursting on screen.
 */
export const PopPanel: React.FC<{ controls: PopControls }> = ({ controls }) => {
  const { t } = useAppTranslation();

  const [state, setState] = useState<Snapshot>(() => snapshot(controls));
  useEffect(() => {
    const interval = setInterval(() => setState(snapshot(controls)), 100);
    return () => clearInterval(interval);
  }, [controls]);

  const seconds = Math.max(0, Math.ceil(state.msLeft / 1000));

  const showOpeningHint =
    state.round === 1 && state.msLeft > POP_WATER_MS - OPENING_HINT_MS;

  // Hold the reveal panel back until the bursts have played out on the patch.
  const showReveal =
    state.phase === "reveal" &&
    !!state.reveal &&
    state.msLeft < POP_REVEAL_MS - BURST_WINDOW_MS;

  return (
    <>
      {/* Round clock. Centred at the top, clear of the leaderboard + settings. */}
      {state.phase !== "intro" && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 pointer-events-none">
          {/* One row, so the clock stack stays clear of the back row of the
              patch — the field is only ~4 rows tall on screen. */}
          <div className="flex items-center gap-1">
            <Label type={state.phase === "water" ? "default" : "danger"}>
              {t("giveaway.pop.round", {
                current: state.round,
                total: POP_ROUNDS,
              })}
            </Label>
            {/* Your accumulating score — the number the game is ranked on. */}
            {state.phase === "water" && (
              <Label type="info">
                {t("giveaway.pop.banked", { count: state.banked })}
              </Label>
            )}
          </div>
          {state.phase === "water" && (
            <span
              className="font-secondary"
              style={{
                fontSize: "52px",
                lineHeight: 1,
                // Runs red for the last 5 seconds — the danger window.
                color: seconds <= 5 ? "#e43b44" : "#ffffff",
                textShadow: "3px 3px 0 rgba(0,0,0,0.7)",
              }}
            >
              {seconds}
            </span>
          )}
        </div>
      )}

      {/* Rules + countdown, before round one. */}
      {state.phase === "intro" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="w-full max-w-[260px]">
            <Panel>
              <div className="flex flex-col items-center gap-2 p-1">
                <Label type="default">{t("giveaway.pop.title")}</Label>
                <p className="text-xs text-center">{t("giveaway.pop.rules")}</p>
                <Label type="danger">
                  {t("giveaway.pop.topPercent", {
                    percent: Math.round(POP_ELIMINATION_FRACTION * 100),
                  })}
                </Label>
                <span
                  className="font-secondary"
                  style={{ fontSize: "40px", lineHeight: 1 }}
                >
                  {seconds}
                </span>
              </div>
            </Panel>
          </div>
        </div>
      )}

      {/* A nudge above the button. The rule only needs restating at the very
          start of round one — after that it's in the way of the patch, which is
          the thing you're actually reading. */}
      {state.phase === "water" && showOpeningHint && (
        <div className="absolute bottom-44 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <Label type="vibrant">{t("giveaway.pop.hint")}</Label>
        </div>
      )}

      {showReveal && state.reveal && (
        <RevealPopup key={state.reveal.nonce} reveal={state.reveal} />
      )}
    </>
  );
};
