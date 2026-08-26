import type { Unsubscribe } from "./subscriptions";
import type { WorldRect } from "../core/coordinates";

/**
 * Screen-space rect for an anchor, in CSS pixels relative to the engine's
 * container element (the same box FarmOverlay fills).
 */
export type ScreenRect = {
  left: number;
  top: number;
  width: number;
  height: number;
  /** False when the anchor is outside the camera's view. */
  visible: boolean;
};

type Projection = (world: WorldRect) => ScreenRect;

type AnchorListener = (rect: ScreenRect | undefined) => void;

/**
 * The bridge between in-world positions and React overlay UI. Phaser-side code
 * registers world rects under stable ids (entity renderers own their anchors);
 * the camera supplies the world -> screen projection and asks for a reproject
 * when it moves or zooms; React components subscribe to an id via
 * useWorldAnchor and get live screen rects to position popovers, bars, and
 * floating text.
 *
 * Deliberately multi-listener with mandatory unsubscribes — this is the
 * replacement for the world's single-`listener` manager singletons.
 */
export class AnchorRegistry {
  private anchors = new Map<string, WorldRect>();
  private rects = new Map<string, ScreenRect>();
  private listeners = new Map<string, Set<AnchorListener>>();
  private project: Projection | undefined;

  /** Register or move an anchor. Idempotent; notifies subscribers on change. */
  setAnchor(id: string, world: WorldRect) {
    this.anchors.set(id, world);
    this.reproject(id);
  }

  removeAnchor(id: string) {
    this.anchors.delete(id);
    this.rects.delete(id);
    this.notify(id, undefined);
  }

  getRect(id: string): ScreenRect | undefined {
    return this.rects.get(id);
  }

  /**
   * Camera side: install the world->screen projection. Call again with the
   * same function identity is fine; reprojectAll() after camera movement.
   */
  setProjection(project: Projection) {
    this.project = project;
    this.reprojectAll();
  }

  reprojectAll() {
    for (const id of this.anchors.keys()) {
      this.reproject(id);
    }
  }

  subscribe(id: string, listener: AnchorListener): Unsubscribe {
    let set = this.listeners.get(id);
    if (!set) {
      set = new Set();
      this.listeners.set(id, set);
    }
    set.add(listener);
    // New subscribers get the current rect straight away.
    listener(this.rects.get(id));
    return () => {
      set.delete(listener);
      if (set.size === 0) this.listeners.delete(id);
    };
  }

  dispose() {
    this.anchors.clear();
    this.rects.clear();
    this.listeners.clear();
    this.project = undefined;
  }

  private reproject(id: string) {
    const world = this.anchors.get(id);
    if (!world || !this.project) return;
    const next = this.project(world);
    const prev = this.rects.get(id);
    if (
      prev &&
      prev.left === next.left &&
      prev.top === next.top &&
      prev.width === next.width &&
      prev.height === next.height &&
      prev.visible === next.visible
    ) {
      return;
    }
    this.rects.set(id, next);
    this.notify(id, next);
  }

  private notify(id: string, rect: ScreenRect | undefined) {
    this.listeners.get(id)?.forEach((listener) => listener(rect));
  }
}
