import React, { useEffect, useRef } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { FishingControls } from "../lib/fishingControls";

/**
 * The Fishing cast button. A tap queues a cast on the shared controls channel
 * (the scene drains it); desktop players can hit SPACE instead. Each resolved
 * cast (`controls.lastResult`) pops the button and flashes a catch/miss banner —
 * read via rAF so there's no React re-render churn while fishing.
 */
export const FishButton: React.FC<{ controls: FishingControls }> = ({
  controls,
}) => {
  const { t } = useAppTranslation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let seenNonce = 0;

    const tick = () => {
      // Dim + disable the button while a cast is in flight (mid cast/reel), so
      // you have to wait for the line to come back before casting again.
      const button = buttonRef.current;
      if (button) {
        button.style.opacity = controls.casting ? "0.5" : "1";
        button.style.filter = controls.casting ? "grayscale(0.5)" : "none";
      }

      const result = controls.lastResult;
      if (result && result.nonce !== seenNonce) {
        seenNonce = result.nonce;

        // Pop the button.
        buttonRef.current?.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.12)" },
            { transform: "scale(1)" },
          ],
          { duration: 200, easing: "ease-out" },
        );

        // Flash a catch/miss banner above the button.
        const banner = bannerRef.current;
        if (banner) {
          const caught = result.count > 0;
          banner.textContent = !caught
            ? t("giveaway.fishing.miss")
            : result.count === 1
              ? `+${result.xp}!`
              : `+${result.xp} x${result.count}!`;
          banner.style.color = caught ? "#63c74d" : "#e43b44";
          banner.animate(
            [
              { opacity: 0, transform: "translateY(6px)" },
              { opacity: 1, transform: "translateY(0)", offset: 0.2 },
              { opacity: 1, transform: "translateY(0)", offset: 0.75 },
              { opacity: 0, transform: "translateY(-6px)" },
            ],
            { duration: 1100, easing: "ease-out" },
          );
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [controls, t]);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-2">
      <div
        ref={bannerRef}
        className="font-secondary select-none"
        style={{
          opacity: 0,
          fontSize: "20px",
          lineHeight: 1,
          textShadow: "2px 2px 0 rgba(0,0,0,0.6)",
        }}
      />
      <button
        ref={buttonRef}
        onPointerDown={(e) => {
          e.preventDefault();
          controls.cast();
        }}
        className="rounded-full flex items-center justify-center pointer-events-auto"
        style={{
          width: "96px",
          height: "96px",
          background: "#2f6d9e",
          border: "4px solid rgba(0,0,0,0.6)",
          touchAction: "manipulation",
          boxShadow: "0 4px 8px rgba(0,0,0,0.35)",
        }}
      >
        <span
          className="font-secondary select-none text-white"
          style={{
            fontSize: "20px",
            lineHeight: 1,
            textShadow: "2px 2px 0 rgba(0,0,0,0.6)",
          }}
        >
          {t("giveaway.fishing.cast")}
        </span>
      </button>
    </div>
  );
};
