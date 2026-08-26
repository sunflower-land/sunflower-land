import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Phaser from "phaser";
import { Context } from "features/game/GameProvider";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { Hud } from "features/island/hud/Hud";
import { createGameBridge } from "./bridge/GameBridge";
import { DPR } from "./core/rendering";
import { FarmScene } from "./scenes/FarmScene";
import { FarmOverlay } from "./overlay/FarmOverlay";
import { FarmModals } from "./overlay/FarmModals";
import { CropsUI } from "./overlay/CropsUI";
import { ResourcesUI } from "./overlay/ResourcesUI";
import { DevPanel } from "./dev/DevPanel";

/**
 * React mount for the Phaser farm — the only place React and the engine meet.
 * Builds the GameBridge from GameProvider's machine + UI prefs, boots one
 * Phaser.Game with the FarmScene, renders the anchored React overlay and the
 * (unchanged) HUD on top, and tears everything down on unmount.
 *
 * Rendered via a body portal: the route tree sits inside the DOM farm's
 * scroll/zoom wrappers (ScrollContainer + scaled GameBoard), and the canvas
 * must be viewport-fixed instead. Those wrappers become removable once the
 * flag flips (Phase 10).
 */
export const FarmPhaser: React.FC = () => {
  const {
    gameService,
    selectedItem,
    shortcutItem,
    showTimers,
    showAnimations,
    showActualTime,
    enableQuickSelect,
  } = useContext(Context);
  const { openModal } = useContext(ModalContext);

  const containerRef = useRef<HTMLDivElement>(null);

  const [{ bridge, setUiPrefs, setOpenModal, setSelectItem }] = useState(() =>
    createGameBridge({ gameService }),
  );

  // openModal/shortcutItem come from provider state; keep the bridge pointing
  // at the latest without rebuilding it.
  useEffect(() => {
    setOpenModal(openModal);
  }, [openModal, setOpenModal]);
  useEffect(() => {
    setSelectItem(shortcutItem);
  }, [shortcutItem, setSelectItem]);

  const uiPrefs = useMemo(
    () => ({
      selectedItem,
      showTimers,
      showAnimations,
      showActualTime,
      enableQuickSelect,
    }),
    [
      selectedItem,
      showTimers,
      showAnimations,
      showActualTime,
      enableQuickSelect,
    ],
  );

  useEffect(() => {
    setUiPrefs(uiPrefs);
  }, [uiPrefs, setUiPrefs]);

  const gameRef = useRef<Phaser.Game | undefined>(undefined);

  useEffect(() => {
    // Backing store at physical resolution, squeezed back via zoom — see
    // core/rendering.ts for why. pixelArt must be explicitly false: it
    // defaults to true whenever scale.zoom !== 1 and force-disables
    // antialiasing. NEAREST is opted into per texture in core/assets.ts.
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current ?? undefined,
      render: {
        pixelArt: false,
        antialias: true,
        roundPixels: true,
      },
      // CRITICAL: Phaser defaults to ALSO listening at window level, so
      // clicks on the HUD and modals would pan the camera and click plots
      // through the UI. Listen on the canvas only.
      input: {
        windowEvents: false,
      },
      scale: {
        mode: Phaser.Scale.NONE,
        width: Math.round(window.innerWidth * DPR),
        height: Math.round(window.innerHeight * DPR),
        zoom: 1 / DPR,
      },
      scene: [new FarmScene(bridge)],
    });
    gameRef.current = game;

    // With canvas-only input, a drag released over a DOM element would lose
    // its pointerup and leave the camera panning. Capture the pointer on the
    // canvas for the duration of each press so the release always lands.
    game.events.once(Phaser.Core.Events.READY, () => {
      game.canvas.addEventListener("pointerdown", (event) => {
        game.canvas.setPointerCapture(event.pointerId);
      });
    });

    const onResize = () => {
      game.scale.resize(
        Math.round(window.innerWidth * DPR),
        Math.round(window.innerHeight * DPR),
      );
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      gameRef.current = undefined;
      game.destroy(true);
      bridge.dispose();
    };
    // The bridge is created once with the component; the engine mounts once.
  }, [bridge]);

  // While an in-world modal is open the world must go deaf: Phaser also
  // listens at window level, so a tap on the modal would otherwise land in
  // the scene too (project-ii's lesson).
  const onModalOpenChange = (open: boolean) => {
    if (gameRef.current) gameRef.current.input.enabled = !open;
  };

  return createPortal(
    // No z-index: as a late body sibling this already paints above the app,
    // while HudContainer's z-10 body portal (and every modal) stays above it.
    <div className="fixed inset-0">
      <div ref={containerRef} className="absolute inset-0" />
      <FarmOverlay registry={bridge.anchors}>
        <CropsUI bridge={bridge} />
        <ResourcesUI bridge={bridge} />
        {import.meta.env.DEV && <DevPanel />}
      </FarmOverlay>
      <FarmModals bridge={bridge} onOpenChange={onModalOpenChange} />
      <Hud isFarming={true} location="farm" />
    </div>,
    document.body,
  );
};
