import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { ITEM_DETAILS } from "features/game/types/images";
import { Panel } from "components/ui/Panel";
import { ResizableBar } from "components/ui/ProgressBar";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { loadProgress } from "../core/assets";
import type { FarmScene } from "../scenes/FarmScene";

/**
 * What the player sees while a surface's first textures arrive.
 *
 * The scene itself starts veiled and dissolves in when it is ready
 * [FarmScene.revealWhenReady], so this component only has to cover what the
 * canvas can't:
 *
 * - Cold boot (the engine was just created): an opaque cover above
 *   EVERYTHING — the HUD would otherwise sit over an empty world — in the
 *   veil's own tone, lifting in step with the scene's dissolve.
 * - Warm hop (farm <-> interior on a running engine): nothing at all. The
 *   textures are cached, the scene is ready within a frame or two and the
 *   camera dissolve is the whole transition. Only if a surface's first visit
 *   is slow does a small label appear, so the veil never reads as a hang.
 *
 * Readiness and progress are the scene's real state, not a guess: the first
 * version polled the loader every 150ms for two idle readings behind a bar
 * easing toward 90%, with a 600ms minimum — up to a second of cover over a
 * world that was already drawn.
 */

/**
 * Cold boot: hold the panel back so a fast load only shows the tone. Longer
 * than a typical warm-cache boot (~350ms): at that length the panel faded in
 * just as the farm was ready and flashed for a couple of hundred ms.
 */
const PANEL_DELAY_MS = 900;
/** Warm hop: how long the veil may sit bare before the label explains it. */
const HOP_LABEL_DELAY_MS = 600;
const FADE_MS = 220;
const PROGRESS_POLL_MS = 80;

type Phase = "covering" | "fading" | "done";

export const FarmLoading: React.FC<{
  /** The mounted scene, once the engine has started it. */
  scene: FarmScene | undefined;
  /** True when the engine was already running (a hop, not a boot). */
  warm: boolean;
}> = ({ scene, warm }) => {
  const { t } = useAppTranslation();
  const [phase, setPhase] = useState<Phase>("covering");
  const [showDetail, setShowDetail] = useState(false);
  const [progress, setProgress] = useState(0);

  // Lift with the scene's own reveal.
  useEffect(() => {
    if (!scene) return;
    let cancelled = false;
    scene.revealed.then(() => {
      if (cancelled) return;
      performance.mark("farm:cover-lift");
      setProgress(100);
      setPhase("fading");
    });
    return () => {
      cancelled = true;
    };
  }, [scene]);

  useEffect(() => {
    if (phase !== "fading") return;
    const timer = setTimeout(() => setPhase("done"), FADE_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  // The panel / label only appear if the wait is long enough to notice.
  useEffect(() => {
    if (phase !== "covering") return;
    const timer = setTimeout(
      () => setShowDetail(true),
      warm ? HOP_LABEL_DELAY_MS : PANEL_DELAY_MS,
    );
    return () => clearTimeout(timer);
  }, [phase, warm]);

  // Real progress: files settled over files asked for. The total grows as
  // renderers queue their slices, so only ever move the bar forward.
  useEffect(() => {
    if (phase !== "covering" || !scene || warm) return;
    const interval = setInterval(() => {
      const { requested, settled } = loadProgress(scene);
      if (!requested) return;
      const percentage = Math.min(99, (settled / requested) * 100);
      setProgress((current) => Math.max(current, percentage));
    }, PROGRESS_POLL_MS);
    return () => clearInterval(interval);
  }, [phase, scene, warm]);

  if (phase === "done") return null;

  if (warm) {
    if (!showDetail || phase !== "covering") return null;
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-sm text-white text-shadow">{t("loading")}</span>
      </div>
    );
  }

  // Own body portal: the HUD portals to <body> with its own z-index, so the
  // cover must too (a child z-index inside the engine wrapper loses).
  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center transition-opacity ease-out"
      style={{
        // The veil tone the world dissolves in from [FarmScene VEIL_COLOR].
        backgroundColor: "#0e4a6d",
        zIndex: 2000,
        opacity: phase === "fading" ? 0 : 1,
        transitionDuration: `${FADE_MS}ms`,
        pointerEvents: phase === "fading" ? "none" : "auto",
      }}
    >
      <div
        className="w-72 max-w-[80vw] transition-opacity duration-200"
        style={{ opacity: showDetail ? 1 : 0 }}
      >
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
