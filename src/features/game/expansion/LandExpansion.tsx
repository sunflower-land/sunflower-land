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

  // When the board is zoomed out it shrinks toward its centre, exposing the
  // backdrop above and to the left of it. Don't let the player pan past the
  // board's top-left corner. Measured from the rendered board, so it's exact
  // at any zoom.
  useEffect(() => {
    const scrollEl = container.current;
    if (!scrollEl) return;

    const clampTopLeft = () => {
      const boardEl = document.getElementById("game-board");
      if (!boardEl) return;

      const board = boardEl.getBoundingClientRect();
      const view = scrollEl.getBoundingClientRect();
      const overTop = board.top - view.top;
      const overLeft = board.left - view.left;
      if (overTop > 0) scrollEl.scrollTop += overTop;
      if (overLeft > 0) scrollEl.scrollLeft += overLeft;
    };

    // Pan the ocean backdrop with the world. The on-screen pan is 1:1 with the
    // scroll offset at any zoom (the board's percentage transform-origin
    // scrolls with it), so shifting the background by -scroll locks the water
    // to the land.
    const syncOcean = () => {
      if (oceanRef.current) {
        oceanRef.current.style.backgroundPosition = `${-scrollEl.scrollLeft}px ${-scrollEl.scrollTop}px`;
      }
    };

    // Wheel/trackpad scrolling runs on the browser's compositor thread, so a
    // post-hoc clamp (scroll event or rAF) lands a frame late and flashes white.
    // Take the wheel over: scroll synchronously and clamp in the same tick so
    // the over-scroll never reaches the screen.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const px =
        e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? scrollEl.clientHeight : 1;
      // Shift+wheel means horizontal scroll — the browser normally does this
      // swap itself, but the raw event still carries the delta in deltaY.
      const swap = e.shiftKey && !e.deltaX;
      scrollEl.scrollLeft += (swap ? e.deltaY : e.deltaX) * px;
      scrollEl.scrollTop += (swap ? 0 : e.deltaY) * px;
      clampTopLeft();
      syncOcean();
    };
    scrollEl.addEventListener("wheel", onWheel, { passive: false });

    // Mouse-drag is already applied on the main thread by the library; this rAF
    // keeps it (and zooming, which fires no scroll event) clamped too. rAF runs
    // before paint, so the ocean sync here lands in the same frame.
    let raf: number;
    const loop = () => {
      clampTopLeft();
      syncOcean();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      scrollEl.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(raf);
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
