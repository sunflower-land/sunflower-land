import React, { useContext, useEffect, useRef, useState } from "react";

import { Context } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { CountdownLabel } from "components/ui/CountdownLabel";
import { randomInt, randomID } from "lib/utils/random";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { postEffect } from "features/game/actions/effect";

import { RotateCollectibleGame } from "./RotateCollectibleGame";
import { PuzzleDragGame } from "./PuzzleDragGame";
import type { CaptchaGameName, CaptchaGameProps } from "./types";
import {
  CAPTCHA_LOCK_MS,
  clearCaptchaLock,
  getCaptchaLockedUntil,
  lockCaptcha,
} from "./lib/captchaLock";

// Register new captcha minigames here - one is dealt at random each attempt
const MINIGAMES: {
  name: CaptchaGameName;
  component: React.FC<CaptchaGameProps>;
}[] = [
  { name: "rotate", component: RotateCollectibleGame },
  { name: "jigsaw", component: PuzzleDragGame },
];

const MAX_FAILURES = 2;

// How long the tick/cross feedback shows before the flow moves on
const FEEDBACK_MS = 1800;

export const Captcha: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const [lockedUntil, setLockedUntil] = useState<number | undefined>(() => {
    // The farm's `captcha.failedAt` also arms the lock, so clearing local
    // storage or refreshing right after failing doesn't reset the strikes
    const failedAt = gameService.state.context.state.captcha?.failedAt ?? 0;
    const serverLock = failedAt + CAPTCHA_LOCK_MS;

    const localLock = getCaptchaLockedUntil() ?? 0;

    const lock = Math.max(localLock, serverLock > Date.now() ? serverLock : 0);

    return lock > Date.now() ? lock : undefined;
  });
  const [failures, setFailures] = useState(0);
  const [deal, setDeal] = useState(() => ({
    id: 0,
    gameIndex: randomInt(0, MINIGAMES.length),
  }));
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [result, setResult] = useState<"correct" | "wrong">();
  const feedbackTimerRef = useRef<number | undefined>(undefined);

  // Don't leak the feedback timer if the modal unmounts mid-feedback
  useEffect(() => {
    return () => window.clearTimeout(feedbackTimerRef.current);
  }, []);

  // While locked, tick a countdown and deal a fresh game once it expires
  useEffect(() => {
    if (!lockedUntil) return;

    const setTime = () => {
      const remaining = (lockedUntil - Date.now()) / 1000;

      if (remaining <= 0) {
        clearCaptchaLock();
        setLockedUntil(undefined);
        setFailures(0);
        setDeal((prev) => ({
          id: prev.id + 1,
          gameIndex: randomInt(0, MINIGAMES.length),
        }));
      } else {
        setSecondsLeft(remaining);
      }
    };

    setTime();

    const interval = setInterval(setTime, 1000);

    return () => clearInterval(interval);
  }, [lockedUntil]);

  const game = MINIGAMES[deal.gameIndex];

  const onSuccess = () => {
    setResult("correct");

    // Let the tick animation play before firing the effect - its response
    // comes back with `captcha.required` cleared. The game name feeds the
    // farm activity stats (e.g. "Rotate Captcha Succeeded").
    feedbackTimerRef.current = window.setTimeout(() => {
      gameService.send("captcha.succeeded", {
        effect: { type: "captcha.succeeded", game: game.name },
      });
    }, FEEDBACK_MS);
  };

  const onFailure = () => {
    setResult("wrong");

    // Record which game they failed against the farm. Fire-and-forget - the
    // modal keeps its own flow (next game / lockout) regardless of the
    // request outcome.
    const { farmId, rawToken } = gameService.state.context;
    postEffect({
      farmId: Number(farmId),
      token: rawToken as string,
      transactionId: randomID(),
      effect: { type: "captcha.failed", game: game.name },
    }).catch(() => undefined);

    // Let the cross animation play before dealing the next attempt (or locking)
    feedbackTimerRef.current = window.setTimeout(() => {
      setResult(undefined);

      const count = failures + 1;

      if (count >= MAX_FAILURES) {
        setLockedUntil(lockCaptcha());
        setFailures(0);
      } else {
        setFailures(count);
      }

      // Deal a fresh random minigame for the next attempt
      setDeal((prev) => ({
        id: prev.id + 1,
        gameIndex: randomInt(0, MINIGAMES.length),
      }));
    }, FEEDBACK_MS);
  };

  if (lockedUntil) {
    return (
      <>
        <div className="flex flex-col items-center p-2">
          <span className="text-center text-base">{t("captcha.locked")}</span>
          <img src={SUNNYSIDE.icons.stopwatch} className="h-8 my-2" />
          <p className="text-sm text-center mb-3">
            {t("captcha.locked.description")}
          </p>
          {secondsLeft > 0 && <CountdownLabel timeLeft={secondsLeft} />}
        </div>
        {/* Let them look around while they wait - their next interaction
            brings the captcha straight back */}
        <Button className="mt-2" onClick={() => gameService.send("CLOSE")}>
          {t("close")}
        </Button>
      </>
    );
  }

  if (result) {
    const isCorrect = result === "correct";
    const willLock = !isCorrect && failures + 1 >= MAX_FAILURES;

    return (
      <div
        className="flex flex-col items-center justify-center p-2"
        style={{ minHeight: "12rem" }}
      >
        <img
          src={isCorrect ? SUNNYSIDE.icons.confirm : SUNNYSIDE.icons.cancel}
          className={`w-12 mb-3 ${isCorrect ? "animate-bounce" : ""}`}
          style={{
            imageRendering: "pixelated",
            ...(isCorrect ? {} : { animation: "shake 0.5s" }),
          }}
        />
        <span className="text-center text-base">
          {t(isCorrect ? "captcha.correct" : "captcha.wrong")}
        </span>
        {!isCorrect && !willLock && (
          <p className="text-xs text-center mt-1">{t("captcha.wrong.retry")}</p>
        )}
      </div>
    );
  }

  const Minigame = game.component;

  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-center text-base mb-1">{t("captcha.title")}</span>
      <p className="text-xs text-center mb-2">{t("captcha.description")}</p>
      <Minigame key={deal.id} onSuccess={onSuccess} onFailure={onFailure} />
      {failures > 0 && (
        <div className="h-6 flex justify-center items-center mt-2">
          {Array(failures)
            .fill(null)
            .map((_, index) => (
              <img
                key={index}
                src={SUNNYSIDE.icons.cancel}
                className="h-full object-fit mr-2"
              />
            ))}
        </div>
      )}
    </div>
  );
};
