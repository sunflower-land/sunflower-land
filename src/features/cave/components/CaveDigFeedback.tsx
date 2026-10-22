import React, { useContext, useEffect, useState } from "react";
import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  CAVE_FEEDBACK_DISPLAY_MS,
  CAVE_FEEDBACK_FADE_MS,
  type CaveDigFeedback as Feedback,
} from "../lib/digFeedback";
import "./caveDigFeedback.css";

export type CaveFeedbackEvent = {
  id: number;
  createdAt: number;
  x: number;
  y: number;
  feedback: Feedback[];
};

/** One dig's visual lifetime, independent of later digs; announcements live in CavePatch. */
export function CaveDigFeedback({ event }: { event: CaveFeedbackEvent }) {
  const { t } = useAppTranslation();
  const { showAnimations } = useContext(Context);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const remaining = event.createdAt + CAVE_FEEDBACK_DISPLAY_MS - Date.now();
    if (remaining <= 0) return;
    const frame = requestAnimationFrame(() => setVisible(true));
    const timeout = window.setTimeout(() => setVisible(false), remaining);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [event]);
  return (
    <div
      className="cave-dig-feedback absolute z-50 pointer-events-none flex flex-col items-center gap-1"
      style={{
        left: event.x * GRID_WIDTH_PX,
        top: event.y * GRID_WIDTH_PX,
        transform: "translate(-50%, -100%)",
        opacity: visible ? 1 : 0,
        transitionDuration: showAnimations
          ? `${CAVE_FEEDBACK_FADE_MS}ms`
          : "0ms",
      }}
    >
      {event.feedback.map((feedback) => (
        <Label
          key={`${event.id}-${feedback.kind}-${feedback.item}`}
          type="success"
          icon={ITEM_DETAILS[feedback.item].image}
          className="whitespace-nowrap"
        >
          {feedback.kind === "shovelSaved"
            ? t("cave.feedback.shovelSaved")
            : feedback.kind === "drillSaved"
              ? t("cave.feedback.drillSaved")
              : t(
                  feedback.amount === 1
                    ? "cave.feedback.bonusBeetle"
                    : "cave.feedback.bonusBeetles",
                  { amount: feedback.amount },
                )}
        </Label>
      ))}
    </div>
  );
}
