import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type Phaser from "phaser";

import { ITEM_DETAILS } from "features/game/types/images";
import { Panel } from "components/ui/Panel";
import { ResizableBar } from "components/ui/ProgressBar";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

/**
 * Full-screen boot cover for the Phaser farm. Sits above EVERYTHING (HUD,
 * overlay, dev panel) until the engine has finished its initial texture
 * loads, then fades out.
 *
 * Readiness: the renderers load lazily in bursts, so "loaded" = the scene
 * exists and its loader has been idle (no queued or in-flight files) for two
 * consecutive checks after at least one burst completed. The bar eases
 * toward 90% while loading and snaps to 100% on ready — smooth, never stuck.
 */

const POLL_MS = 150;
const MIN_SHOW_MS = 600;
const FADE_MS = 400;

export const FarmLoading: React.FC<{
  getGame: () => Phaser.Game | undefined;
}> = ({ getGame }) => {
  const { t } = useAppTranslation();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "fading" | "done">("loading");
  const idleChecks = useRef(0);
  const sawActivity = useRef(false);
  const mountedAt = useRef(0);

  useEffect(() => {
    if (phase !== "loading") return;
    if (!mountedAt.current) mountedAt.current = Date.now();

    const interval = setInterval(() => {
      // Ease toward 90% while we wait.
      setProgress((current) => current + (90 - current) * 0.06);

      const game = getGame();
      const scene = game?.scene?.scenes?.[0] as
        | { load?: { list: Set<unknown>; inflight: Set<unknown> } }
        | undefined;
      const loader = scene?.load;
      if (!loader) return;

      const busy = loader.list.size > 0 || loader.inflight.size > 0;
      if (busy) {
        sawActivity.current = true;
        idleChecks.current = 0;
        return;
      }
      if (!sawActivity.current) return;

      idleChecks.current += 1;
      if (
        idleChecks.current >= 2 &&
        Date.now() - mountedAt.current >= MIN_SHOW_MS
      ) {
        setProgress(100);
        setPhase("fading");
      }
    }, POLL_MS);

    return () => clearInterval(interval);
  }, [phase, getGame]);

  useEffect(() => {
    if (phase !== "fading") return;
    const timer = setTimeout(() => setPhase("done"), FADE_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === "done") return null;

  // Own body portal: the HUD portals to <body> with its own z-index, so the
  // cover must too (a child z-index inside the engine wrapper loses).
  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center transition-opacity"
      style={{
        // The night-ocean tone the world fades in over.
        backgroundColor: "#0e4a6d",
        zIndex: 2000,
        opacity: phase === "fading" ? 0 : 1,
        transitionDuration: `${FADE_MS}ms`,
        pointerEvents: phase === "fading" ? "none" : "auto",
      }}
    >
      <div className="w-72 max-w-[80vw]">
        <Panel>
          <div className="flex flex-col items-center p-3 gap-3">
            <img
              src={ITEM_DETAILS.Sunflower.image}
              alt=""
              className="w-10 animate-pulsate"
              style={{ imageRendering: "pixelated" }}
            />
            <span className="text-sm">{t("loading")}</span>
            <ResizableBar
              percentage={progress}
              type="progress"
              outerDimensions={{ width: 60, height: 8 }}
            />
          </div>
        </Panel>
      </div>
    </div>,
    document.body,
  );
};
