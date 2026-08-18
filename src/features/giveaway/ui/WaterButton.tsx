import React, { useEffect, useRef } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { PopControls } from "../lib/popControls";

const SIZE = 118;

/**
 * The Pumpkin Pop water button.
 *
 * Deliberately a plain, big, mash-friendly target — the skill in this game is
 * knowing when to STOP, not timing a marker, so there's no ring to read. Each
 * tap pops the button and sends a ripple out, and the live water count sits
 * under it so you can watch yourself creep toward the danger zone.
 *
 * Feedback is driven off `controls` with rAF (no React re-render per tap), the
 * same approach as the Jumper button. Desktop players can hit SPACE instead —
 * the scene handles that directly.
 */
export const WaterButton: React.FC<{ controls: PopControls }> = ({
  controls,
}) => {
  const { t } = useAppTranslation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const bankedRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let shownWaters = -1;
    let shownBanked = -1;

    const tick = () => {
      if (controls.banked !== shownBanked) {
        shownBanked = controls.banked;
        if (bankedRef.current) {
          bankedRef.current.textContent = t("giveaway.pop.banked", {
            count: shownBanked,
          });
        }
      }

      if (controls.myWaters !== shownWaters) {
        shownWaters = controls.myWaters;
        if (countRef.current) countRef.current.textContent = `${shownWaters}`;

        buttonRef.current?.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(0.9)" },
            { transform: "scale(1)" },
          ],
          { duration: 130, easing: "ease-out" },
        );
        rippleRef.current?.animate(
          [
            { transform: "scale(0.85)", opacity: 0.55 },
            { transform: "scale(1.4)", opacity: 0 },
          ],
          { duration: 400, easing: "ease-out" },
        );
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [controls, t]);

  return (
    <div
      ref={wrapRef}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
    >
      <div
        className="relative flex flex-col items-center"
        style={{ width: SIZE }}
      >
        {/* Your running total, above the round count. The big number resets
            every round, which on its own reads like losing your points — so the
            bank sits right next to it, visibly carrying over. */}
        <span
          ref={bankedRef}
          className="text-xxs text-white opacity-80"
          style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.7)" }}
        >
          {t("giveaway.pop.banked", { count: 0 })}
        </span>

        {/* Waters this round, right above the button. */}
        <span
          className="font-secondary text-white mb-1"
          style={{
            fontSize: "30px",
            lineHeight: 1,
            textShadow: "2px 2px 0 rgba(0,0,0,0.7)",
          }}
        >
          <span ref={countRef}>{0}</span>
        </span>

        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          {/* Ripple, bursting out from under the button on each tap. */}
          <div
            ref={rippleRef}
            className="absolute inset-0 rounded-full"
            style={{ border: "5px solid #6bc7ff", opacity: 0 }}
          />

          <button
            ref={buttonRef}
            onPointerDown={(e) => {
              e.preventDefault();
              controls.water();
            }}
            className="absolute inset-0 rounded-full flex flex-col items-center justify-center pointer-events-auto"
            style={{
              background: "#3a7dbd",
              border: "4px solid rgba(0,0,0,0.6)",
              touchAction: "manipulation",
              boxShadow: "0 4px 8px rgba(0,0,0,0.35)",
            }}
          >
            <img
              src={SUNNYSIDE.icons.water}
              alt=""
              className="mb-0.5"
              style={{ width: "28px", imageRendering: "pixelated" }}
            />
            <span
              className="font-secondary select-none text-white"
              style={{
                fontSize: "17px",
                lineHeight: 1,
                textShadow: "2px 2px 0 rgba(0,0,0,0.6)",
              }}
            >
              {t("giveaway.pop.water")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
