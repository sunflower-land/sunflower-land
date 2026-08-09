import React, { useContext, useEffect, useRef } from "react";

import { Panel, InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import { GiveawayContext } from "../lib/GiveawayProvider";
import { serverOffset } from "../lib/serverClock";
import type { TriviaControls } from "../lib/triviaControls";
import { triviaRound, questionForRound, TRIVIA_ROUNDS } from "../lib/trivia";

/**
 * Kahoot-style colour per answer quadrant: `solid` for the answer pill, and two
 * translucent tints for the quadrant fill — `soft` normally, `strong` when it's
 * highlighted. Both stay see-through so the Bumpkins (and their reactions)
 * behind them are always visible.
 */
const ANSWERS = [
  {
    solid: "#d1432f",
    soft: "rgba(209,67,47,0.20)",
    strong: "rgba(209,67,47,0.42)",
  },
  {
    solid: "#2b6fb0",
    soft: "rgba(43,111,176,0.20)",
    strong: "rgba(43,111,176,0.42)",
  },
  {
    solid: "#cf8a24",
    soft: "rgba(207,138,36,0.20)",
    strong: "rgba(207,138,36,0.42)",
  },
  {
    solid: "#3d9440",
    soft: "rgba(61,148,64,0.20)",
    strong: "rgba(61,148,64,0.42)",
  },
];

/** A big, plain, very legible font for the answers. */
const ANSWER_FONT: React.CSSProperties = {
  fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  fontWeight: 800,
  fontSize: "20px",
  lineHeight: 1.1,
  color: "#ffffff",
  textShadow:
    "1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000",
};

type Result = NonNullable<TriviaControls["lastResult"]>;

/** Big centre pop when a question resolves — time taken + points won. */
const ResultPopup: React.FC<{ result: Result }> = ({ result }) => {
  const { t } = useAppTranslation();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.animate(
      [
        { transform: "scale(0.6)", opacity: 0 },
        { transform: "scale(1.1)", opacity: 1, offset: 0.6 },
        { transform: "scale(1)", opacity: 1 },
      ],
      { duration: 350, easing: "ease-out" },
    );
  }, []);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
      <div ref={ref}>
        <Panel>
          <div className="flex flex-col items-center gap-1 px-4 py-2">
            <span
              className="font-secondary"
              style={{
                fontSize: "40px",
                lineHeight: 1,
                color: result.correct ? "#4caf50" : "#e43b44",
              }}
            >
              {result.correct
                ? t("giveaway.trivia.correct")
                : t("giveaway.trivia.wrong")}
            </span>
            {result.correct && (
              <>
                <span className="text-sm">
                  {t("giveaway.trivia.seconds", {
                    seconds: result.seconds.toFixed(1),
                  })}
                </span>
                <span
                  className="font-secondary"
                  style={{ fontSize: "28px", lineHeight: 1, color: "#ffd12b" }}
                >
                  {t("giveaway.trivia.points", { points: result.points })}
                </span>
              </>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
};

/**
 * The Trivia HUD, built for portrait / mobile: a rules + countdown modal first,
 * then the whole screen becomes a 2×2 grid of answer quadrants (the four Kahoot
 * colours). Tapping a quadrant moves your Bumpkin into it — the Bumpkins show
 * through the translucent tint so you can see everyone's picks. The answer text
 * sits in a bold pill at the bottom of each quadrant. On the reveal the correct
 * quadrant lights up, wrong ones dim, and a centre popup shows your speed +
 * points. You keep your pick between questions and can change it until reveal.
 */
export const TriviaPanel: React.FC<{ controls: TriviaControls }> = ({
  controls,
}) => {
  const { t } = useAppTranslation();
  const { id, board, phase } = useContext(GiveawayContext);
  // `useNow` gives a LOCAL clock tick (re-renders every 200ms). We correct it
  // with the server offset so this HUD sits on the exact same timeline as the
  // TriviaScene (which uses serverNow()). Otherwise, when the two clocks differ,
  // the panel highlights the correct quadrant for one question while the scene
  // graded a different one — "right quadrant but says wrong".
  const now = useNow({ live: true, intervalMs: 200 });

  if (phase !== "racing" || !board) return null;

  const round = triviaRound(now + serverOffset() - board.startAt);
  const secondsLeft = Math.max(0, Math.ceil(round.msLeft / 1000));

  // Rules + countdown before the first question.
  if (round.phase === "intro") {
    return (
      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-xs px-2">
          <Panel>
            <div className="flex flex-col items-center gap-2 p-1 text-center">
              <Label type="default">{t("giveaway.trivia.title")}</Label>
              <p className="text-sm">{t("giveaway.trivia.rules")}</p>
              <span
                className="font-secondary"
                style={{ fontSize: "48px", lineHeight: 1 }}
              >
                {secondsLeft}
              </span>
              <p className="text-xxs opacity-80">
                {t("giveaway.trivia.getReady")}
              </p>
            </div>
          </Panel>
        </div>
      </div>
    );
  }

  const question = questionForRound(id, round.index);
  const revealing = round.phase === "feedback";

  return (
    <>
      {/* Progress + question + countdown, up top (over the grid). */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-full max-w-sm px-2 pointer-events-none">
        <InnerPanel className="p-2">
          <div className="flex items-center justify-between mb-1">
            <Label type="default">
              {t("giveaway.trivia.question", {
                current: Math.min(round.index + 1, TRIVIA_ROUNDS),
                total: TRIVIA_ROUNDS,
              })}
            </Label>
            {!revealing && (
              <span
                className="font-secondary"
                style={{
                  fontSize: "24px",
                  lineHeight: 1,
                  color: secondsLeft <= 3 ? "#e43b44" : "#ffffff",
                }}
              >
                {secondsLeft}
              </span>
            )}
          </div>
          <p className="text-sm text-center">{question.question}</p>
          {/* If the question is about an item or NPC, show it too. */}
          {(question.image || question.npc) && (
            <div className="flex justify-center mt-1">
              {question.npc ? (
                <div className="flex items-center justify-center h-10">
                  <NPCIcon parts={NPC_WEARABLES[question.npc]} width={28} />
                </div>
              ) : (
                <img
                  src={question.image}
                  alt=""
                  className="h-10 w-10 object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
              )}
            </div>
          )}
        </InnerPanel>
      </div>

      {/* Full-screen 2×2 answer quadrants. */}
      <div className="absolute inset-0 z-10 grid grid-cols-2 grid-rows-2">
        {question.answers.map((answer, i) => {
          const isCorrect = revealing && i === question.correct;
          const isYourPick = controls.picked === i;
          const isYourWrong = revealing && isYourPick && !isCorrect;
          const dim = revealing && !isCorrect && !isYourPick;
          const ring = isCorrect
            ? "0 0 0 4px #ffffff"
            : isYourWrong
              ? "0 0 0 4px #e43b44"
              : isYourPick
                ? "0 0 0 4px #ffd12b"
                : "none";
          return (
            <button
              key={i}
              onPointerDown={(e) => {
                e.preventDefault();
                if (!revealing) controls.pick(i);
              }}
              disabled={revealing}
              className="relative flex items-end justify-center pointer-events-auto"
              style={{ touchAction: "manipulation", opacity: dim ? 0.35 : 1 }}
            >
              {/* Quadrant tint + border (Bumpkins show through — even when the
                  correct answer is highlighted, the fill stays translucent). */}
              <div
                className="absolute inset-1 rounded-2xl"
                style={{
                  background:
                    isCorrect || isYourPick
                      ? ANSWERS[i].strong
                      : ANSWERS[i].soft,
                  border: `4px solid ${ANSWERS[i].solid}`,
                  boxShadow: ring,
                }}
              />
              {/* The answer, in a bold pill at the bottom of the quadrant. */}
              <div
                className="relative m-3 px-3 py-2 rounded-xl text-center"
                style={{
                  background: ANSWERS[i].solid,
                  border: "3px solid rgba(0,0,0,0.55)",
                  maxWidth: "90%",
                }}
              >
                <span style={ANSWER_FONT}>{answer}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Centre result pop during the reveal. */}
      {revealing && controls.lastResult && (
        <ResultPopup
          key={controls.lastResult.nonce}
          result={controls.lastResult}
        />
      )}
    </>
  );
};
