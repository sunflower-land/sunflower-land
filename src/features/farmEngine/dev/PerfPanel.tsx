import React, { useEffect, useRef, useState } from "react";
import type Phaser from "phaser";
import { InnerPanel } from "components/ui/Panel";

/**
 * Dev-build only: live engine health readout, top-centre. Everything comes
 * from the running game handle — no instrumentation cost when hidden:
 * - fps now / 5s-low (the low is what a hitch feels like)
 * - frame time in ms
 * - main-thread long tasks (>50ms) in the last 5s [PerformanceObserver]
 * - display-list size + live texture count (leak canaries across
 *   farm↔world↔farm navigation)
 * - JS heap MB (Chrome-only performance.memory)
 * - renderer type / DPR / camera zoom
 */

const SAMPLE_MS = 250;
const RENDER_MS = 500;
const WINDOW_SAMPLES = 20; // 5s of fps samples

type Stats = {
  fps: number;
  fpsLow: number;
  frameMs: number;
  objects: number;
  textures: number;
  /** Σ width*height*4 over every texture source — decoded/GPU memory estimate. */
  textureMb: number;
  heapMb: number | undefined;
  longTasks: number;
  renderer: string;
  zoom: number;
};

const estimateTextureBytes = (game: Phaser.Game): number => {
  const textures = Object.values(
    game.textures.list,
  ) as Phaser.Textures.Texture[];
  let bytes = 0;
  for (const texture of textures) {
    for (const source of texture.source ?? []) {
      bytes += (source.width ?? 0) * (source.height ?? 0) * 4;
    }
  }
  return bytes;
};

const readStats = (
  game: Phaser.Game,
  fpsWindow: number[],
  longTasks: number,
): Stats => {
  const scene = game.scene.scenes[0];
  const memory = (performance as { memory?: { usedJSHeapSize: number } })
    .memory;
  return {
    fps: Math.round(game.loop.actualFps),
    fpsLow: Math.round(Math.min(...fpsWindow)),
    frameMs: Math.round(game.loop.delta * 10) / 10,
    objects: scene?.children?.list?.length ?? 0,
    textures: Object.keys(game.textures.list).length,
    textureMb: Math.round(estimateTextureBytes(game) / 1048576),
    heapMb: memory ? Math.round(memory.usedJSHeapSize / 1048576) : undefined,
    longTasks,
    renderer: game.renderer.type === 2 ? "webgl" : ("canvas" as string),
    zoom: Math.round((scene?.cameras?.main?.zoom ?? 0) * 100) / 100,
  };
};

export const PerfPanel: React.FC<{
  getGame: () => Phaser.Game | undefined;
}> = ({ getGame }) => {
  const [stats, setStats] = useState<Stats>();
  const fpsWindow = useRef<number[]>([]);
  const longTasks = useRef<number[]>([]); // timestamps of recent long tasks

  useEffect(() => {
    let observer: PerformanceObserver | undefined;
    try {
      observer = new PerformanceObserver((list) => {
        const now = performance.now();
        for (const _ of list.getEntries()) longTasks.current.push(now);
      });
      observer.observe({ entryTypes: ["longtask"] });
    } catch {
      // longtask unsupported — the counter just stays at 0
    }

    const sampler = setInterval(() => {
      const game = getGame();
      if (!game) return;
      fpsWindow.current.push(game.loop.actualFps);
      if (fpsWindow.current.length > WINDOW_SAMPLES) fpsWindow.current.shift();
    }, SAMPLE_MS);

    const renderer = setInterval(() => {
      const game = getGame();
      if (!game || fpsWindow.current.length === 0) return;
      const cutoff = performance.now() - 5000;
      longTasks.current = longTasks.current.filter((t) => t >= cutoff);
      setStats(readStats(game, fpsWindow.current, longTasks.current.length));
    }, RENDER_MS);

    return () => {
      clearInterval(sampler);
      clearInterval(renderer);
      observer?.disconnect();
    };
  }, [getGame]);

  if (!stats) return null;

  const fpsColor =
    stats.fpsLow >= 55 ? "#3e8948" : stats.fpsLow >= 30 ? "#f77622" : "#e43b44";

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2">
      <InnerPanel>
        <div
          className="px-1 flex items-center gap-3 text-xs font-mono whitespace-nowrap"
          style={{ fontFamily: "monospace" }}
        >
          <span style={{ color: fpsColor }}>
            {`${stats.fps}fps (low ${stats.fpsLow})`}
          </span>
          <span>{`${stats.frameMs}ms`}</span>
          <span
            style={{ color: stats.longTasks > 0 ? "#e43b44" : undefined }}
            title="main-thread tasks >50ms in the last 5s"
          >
            {`jank ${stats.longTasks}`}
          </span>
          <span title="scene display-list objects">{`obj ${stats.objects}`}</span>
          <span
            title="live GPU textures / estimated decoded memory"
            style={{ color: stats.textureMb > 300 ? "#e43b44" : undefined }}
          >
            {`tex ${stats.textures}/${stats.textureMb}MB`}
          </span>
          {stats.heapMb !== undefined && (
            <span>{`heap ${stats.heapMb}MB`}</span>
          )}
          <span className="opacity-70">
            {`${stats.renderer} z${stats.zoom}`}
          </span>
        </div>
      </InnerPanel>
    </div>
  );
};
