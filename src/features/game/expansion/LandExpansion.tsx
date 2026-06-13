import React, { useContext, useEffect, useRef } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { animated } from "@react-spring/web";
import { useSelector } from "@xstate/react";

import { Game } from "./Game";
import { ModalProvider } from "../components/modal/ModalProvider";
import { GameBoard } from "components/GameBoard";
import { Context } from "../GameProvider";
import { ZoomContext } from "components/ZoomProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "../lib/constants";
import type { MachineState } from "../lib/gameMachine";

const _ocean = (state: MachineState) => {
  const season = state.context.state?.season?.season;
  const islandType = state.context.state?.island?.type;

  if (season === "winter") return SUNNYSIDE.decorations.frozenOcean;
  if (islandType === "volcano") return SUNNYSIDE.decorations.darkOcean;
  return SUNNYSIDE.decorations.ocean;
};

/**
 * Infinite ocean backdrop. Fills the whole viewport behind the game board so
 * that monitors (or zoom levels) that show past the board's edges see ocean,
 * never a hard edge.
 *
 * It is anchored to the world, not the screen: its background-position tracks
 * the scroll offset (see the rAF sync below) so the water moves with the land,
 * and its tile size tracks the zoom so the waves keep the land's pixel scale.
 */
const InfiniteOcean = React.forwardRef<HTMLDivElement>((_props, ref) => {
  const { gameService } = useContext(Context);
  const { scale } = useContext(ZoomContext);
  const ocean = useSelector(gameService, _ocean);

  return (
    <animated.div
      ref={ref}
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `url(${ocean})`,
        backgroundRepeat: "repeat",
        backgroundSize: scale.to((s) => `${64 * PIXEL_SCALE * s}px`),
        imageRendering: "pixelated",
      }}
    />
  );
});

InfiniteOcean.displayName = "InfiniteOcean";

export const LandExpansion: React.FC = () => {
  // catching and passing scroll container to keyboard listeners
  const container = useRef<HTMLElement | null>(null);
  const oceanRef = useRef<HTMLDivElement>(null);

  // Keep the ocean backdrop locked to the world and stop the player panning
  // off the top-left of the board. Driven by scroll/resize events rather than a
  // perpetual rAF, so it does no layout work while the view is idle.
  useEffect(() => {
    const scrollEl = container.current;
    if (!scrollEl) return;

    const sync = () => {
      // Don't let the player pan above or to the left of the board's top-left
      // corner. Measured from the rendered board, so it's exact at any zoom.
      // (Any momentary over-scroll just reveals the infinite ocean behind the
      // board, never white — so a same-frame correction here is enough; no need
      // to intercept the wheel.)
      const boardEl = document.getElementById("game-board");
      if (boardEl) {
        const board = boardEl.getBoundingClientRect();
        const view = scrollEl.getBoundingClientRect();
        const overTop = board.top - view.top;
        const overLeft = board.left - view.left;
        if (overTop > 0) scrollEl.scrollTop += overTop;
        if (overLeft > 0) scrollEl.scrollLeft += overLeft;
      }

      // Pan the ocean with the world. The on-screen pan is 1:1 with the scroll
      // offset at any zoom (the board's percentage transform-origin scrolls
      // with it), so shifting the background by -scroll locks water to land.
      if (oceanRef.current) {
        oceanRef.current.style.backgroundPosition = `${-scrollEl.scrollLeft}px ${-scrollEl.scrollTop}px`;
      }
    };

    // Coalesce bursts of scroll/resize into one sync per frame (the sync reads
    // layout, so we don't want to run it more than once per paint).
    let raf: number | undefined;
    const scheduleSync = () => {
      if (raf !== undefined) return;
      raf = requestAnimationFrame(() => {
        raf = undefined;
        sync();
      });
    };

    scrollEl.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);
    sync();

    return () => {
      scrollEl.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      if (raf !== undefined) cancelAnimationFrame(raf);
    };
  }, []);

  // Load data
  return (
    <ModalProvider>
      <div className="relative w-full h-full">
        <InfiniteOcean ref={oceanRef} />
        <ScrollContainer
          className="!overflow-scroll relative w-full h-full page-scroll-container overscroll-none"
          innerRef={container}
          ignoreElements={"*[data-prevent-drag-scroll]"}
        >
          <GameBoard>
            <Game />
          </GameBoard>
        </ScrollContainer>
      </div>
    </ModalProvider>
  );
};
