import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { Outlet, useNavigate } from "react-router";
import Phaser from "phaser";
import { Context } from "features/game/GameProvider";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { Hud } from "features/island/hud/Hud";
import { LandscapingHud } from "features/island/hud/LandscapingHud";
import { VisitingHud } from "features/island/hud/VisitingHud";
import { useVisiting } from "lib/utils/visitUtils";
import { useSelector } from "@xstate/react";
import type { MachineState } from "features/game/lib/gameMachine";
import { createGameBridge, type GameBridge } from "./bridge/GameBridge";
import { DPR } from "./core/rendering";
import { FarmScene } from "./scenes/FarmScene";
import {
  HOME_RENDERERS,
  PET_HOUSE_RENDERERS,
  GREENHOUSE_RENDERERS,
  ANIMAL_HOUSE_RENDERERS,
  INTERIOR_FLOOR_RENDERERS,
  type RendererFactory,
} from "./entities/registry";
import { isPlacementSurface, type FarmSurface } from "./core/surface";
import { hasFeatureAccess } from "lib/flags";
import type { PlaceableLocation } from "features/game/types/collectibles";
import { FarmOverlay } from "./overlay/FarmOverlay";
import { FarmModals } from "./overlay/FarmModals";
import { CropsUI } from "./overlay/CropsUI";
import { ResourcesUI } from "./overlay/ResourcesUI";
import { LandscapingUI } from "./overlay/LandscapingUI";
import { InteriorUI } from "./overlay/InteriorUI";
import { WorkerUI } from "./overlay/WorkerUI";
import { AnimalHouseUI } from "./overlay/AnimalHouseUI";
import { InteriorFloorUI } from "./overlay/InteriorFloorUI";
import { GreenhouseUI } from "./overlay/GreenhouseUI";
import { PetHouseUI } from "./overlay/PetHouseUI";
import { SftPopoverUI } from "./overlay/SftPopoverUI";
import { DevPanel } from "./dev/DevPanel";
import { PerfPanel } from "./dev/PerfPanel";
import { FarmLoading } from "./overlay/FarmLoading";

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
/** Renderer sets for the non-farm surfaces; the farm uses the default. */
const INTERIOR_RENDERERS: Partial<
  Record<string, Record<string, RendererFactory>>
> = {
  home: HOME_RENDERERS,
  petHouse: PET_HOUSE_RENDERERS,
  greenhouse: GREENHOUSE_RENDERERS,
  barn: ANIMAL_HOUSE_RENDERERS,
  henHouse: ANIMAL_HOUSE_RENDERERS,
  interior: INTERIOR_FLOOR_RENDERERS,
  level_one: INTERIOR_FLOOR_RENDERERS,
};

export const FarmPhaser: React.FC<{
  /**
   * Which placement surface to render. "farm" is the island; "home" is the
   * house interior [home/Home.tsx], which swaps the world layers for the
   * room backdrop and points every placement renderer at `game.home`.
   */
  surface?: FarmSurface;
}> = ({ surface = "farm" }) => {
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
  const isLandscaping = useSelector(gameService, (state: MachineState) =>
    state.matches("landscaping"),
  );
  const { isVisiting } = useVisiting();

  const containerRef = useRef<HTMLDivElement>(null);

  const [{ bridge, setUiPrefs, setOpenModal, setSelectItem, setNavigate }] =
    useState(() => createGameBridge({ gameService }));

  const navigate = useNavigate();

  // openModal/shortcutItem/navigate come from provider state; keep the bridge
  // pointing at the latest without rebuilding it.
  useEffect(() => {
    setOpenModal(openModal);
  }, [openModal, setOpenModal]);
  useEffect(() => {
    setSelectItem(shortcutItem);
  }, [shortcutItem, setSelectItem]);
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate, setNavigate]);

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

  const animalDeal = useSyncExternalStore(
    (onChange) => bridge.animalDeal.subscribe(onChange),
    () => bridge.animalDeal.get(),
  );

  const hudLocation: PlaceableLocation = isPlacementSurface(surface)
    ? surface
    : "home";

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
      scene: [
        new FarmScene(bridge, {
          key: surface,
          location: surface,
          renderers: INTERIOR_RENDERERS[surface],
        }),
      ],
    });
    gameRef.current = game;
    if (import.meta.env.DEV) {
      // Parity/perf harness hooks (docs/phaser-farm-migration/scripts).
      (window as { __farmGame?: Phaser.Game }).__farmGame = game;
      (window as { __farmBridge?: GameBridge }).__farmBridge = bridge;
    }

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
      const hooks = window as {
        __farmGame?: Phaser.Game;
        __farmBridge?: GameBridge;
      };
      // Clear the dev hooks — a stale global pins the destroyed game's memory.
      if (hooks.__farmGame === game) delete hooks.__farmGame;
      if (hooks.__farmBridge === bridge) delete hooks.__farmBridge;
      game.destroy(true);
      bridge.dispose();
    };
    // The bridge is created once with the component; the engine mounts once
    // per surface (the route swaps surfaces, remounting the scene).
  }, [bridge, surface]);

  // While an in-world modal is open the world must go deaf: Phaser also
  // listens at window level, so a tap on the modal would otherwise land in
  // the scene too (project-ii's lesson).
  const onModalOpenChange = (open: boolean) => {
    const game = gameRef.current;
    if (!game) return;
    game.input.enabled = !open;
    // A modal opening mid-press swallows the pointerup, leaving isDown stuck
    // true — the camera would then pan forever after the modal closes.
    game.input.pointers.forEach((pointer) => pointer.reset());
  };

  return createPortal(
    // No z-index: as a late body sibling this already paints above the app,
    // while HudContainer's z-10 body portal (and every modal) stays above it.
    <div className="fixed inset-0">
      <div ref={containerRef} className="absolute inset-0" />
      <FarmOverlay registry={bridge.anchors}>
        {surface !== "farm" && (
          <InteriorUI bridge={bridge} location={surface} />
        )}
        {(surface === "barn" || surface === "henHouse") && (
          <AnimalHouseUI bridge={bridge} building={surface} />
        )}
        {(surface === "interior" || surface === "level_one") && (
          <InteriorFloorUI bridge={bridge} floor={surface} />
        )}
        {surface === "greenhouse" && <GreenhouseUI bridge={bridge} />}
        {surface === "petHouse" && <PetHouseUI bridge={bridge} />}
        {surface === "farm" && <WorkerUI bridge={bridge} />}
        {surface === "farm" && <CropsUI bridge={bridge} />}
        {surface === "farm" && <ResourcesUI bridge={bridge} />}
        <LandscapingUI bridge={bridge} />
        <SftPopoverUI bridge={bridge} />
        {import.meta.env.DEV && <DevPanel />}
        {import.meta.env.DEV && <PerfPanel getGame={() => gameRef.current} />}
      </FarmOverlay>
      <FarmModals bridge={bridge} onOpenChange={onModalOpenChange} />
      {/* [Land.tsx:1348-1352] edit/visit modes swap the HUD. The fixed rooms
          (greenhouse, animal houses) pass location="home" and isFarming=false,
          exactly as their DOM screens do. */}
      {isLandscaping ? (
        <LandscapingHud location={hudLocation} />
      ) : isVisiting ? (
        <VisitingHud />
      ) : animalDeal ? null : ( // ExchangeHud renders inside AnimalHouseUI
        <Hud isFarming={isPlacementSurface(surface)} location={hudLocation} />
      )}
      {/* Nested routes (marketplace) render above the canvas farm */}
      <Outlet />
      {/* Boot cover — above the HUD until the engine's first loads settle */}
      <FarmLoading getGame={() => gameRef.current} />
    </div>,
    document.body,
  );
};

/**
 * Route fork for the /interior and /level_one floors [Navigation.tsx].
 * Unlike Game.tsx's routes these mount straight under GameWrapper, so the
 * PHASER_FARM check happens here where the machine context is available.
 */
export const PhaserInteriorRoute: React.FC<{
  floor: "interior" | "level_one";
  /** The DOM component to fall back to when the flag is off. */
  fallback: React.ReactNode;
}> = ({ floor, fallback }) => {
  const { gameService } = useContext(Context);
  const usePhaser = useSelector(gameService, (state: MachineState) =>
    hasFeatureAccess(state.context.state, "PHASER_FARM"),
  );
  return usePhaser ? <FarmPhaser surface={floor} /> : <>{fallback}</>;
};
