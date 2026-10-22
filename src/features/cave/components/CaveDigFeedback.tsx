import React, { useContext, useEffect, useState } from "react";
import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { CaveDigFeedback as Feedback } from "../lib/digFeedback";
import "./caveDigFeedback.css";

export type CaveFeedbackEvent = {
  id: number;
  x: number;
  y: number;
  feedback: Feedback[];
};

export function CaveDigFeedback({ event }: { event?: CaveFeedbackEvent }) {
  const { t } = useAppTranslation();
  const { showAnimations } = useContext(Context);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!event) return;
    const frame = requestAnimationFrame(() => setVisible(true));
    const timeout = window.setTimeout(() => setVisible(false), 1200);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [event]);
  return (
    <div
      className="cave-dig-feedback absolute z-50 pointer-events-none flex flex-col items-center gap-1"
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
      style={{
        left: (event?.x ?? 0) * GRID_WIDTH_PX,
        top: (event?.y ?? 0) * GRID_WIDTH_PX,
        transform: "translate(-50%, -100%)",
        opacity: visible ? 1 : 0,
        transitionDuration: showAnimations ? "200ms" : "0ms",
      }}
    >
      {event?.feedback.map((feedback) => (
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
