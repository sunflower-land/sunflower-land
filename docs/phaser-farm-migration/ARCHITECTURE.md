# Phaser Farm Engine — Architecture Guide

The engine is a fresh module, deliberately **not** built on `src/features/world`'s patterns. Everything here is designed around one idea:

> **The game machine is the single source of truth. Phaser is a projection of it, exactly like React is today.**

And one boundary:

> **Everything rendered on the game layer is Phaser. React renders only screen-space UI.**
> If it draws on the world — crops, boats, NPCs, rafts, the expand icon and its requirement label chips, progress bars and inline timers, corner status icons, floating +N text, decor — it is Phaser, even when it's clickable, even when it's "just a label". The test: does it pan/zoom with the world? Then it's game-layer → Phaser. React keeps exactly three things: the HUD, modals, and hover popovers/tooltips. The handshake is always the same: Phaser draws and detects; clicks open React UI through the bridge (`farmModal.open(...)` / `openModal(...)`), hovers drive popovers through `bridge.hover`. Whole in-world components must never be hosted in the DOM overlay "because it's easier" — that was tried (a zoom-scaled "world plane") and removed.
>
> In-scene UI building blocks live in `components/`: `ProgressBarSprite` (the DOM Bar + pixel-font time label), `LabelChip` (Label-style chips), `playYieldFloat` (+N feedback), `pixelText` (the `font-pixel` face at DOM sizing).

React components re-render when selected state changes; our Phaser renderers do the same thing — subscribe with a selector, and reconcile display objects when the selected slice changes. Input goes the other way: pointer events dispatch the same xstate events React dispatches today. Phaser never mutates game state locally.

```
                    ┌─────────────────────────────────┐
                    │   gameMachine (xstate)          │
                    │   events/ handlers (unchanged)  │
                    └─────────────────────────────────┘
                       ▲                      │
         send("crop.harvested")      subscribe(selector)
                       │                      ▼
┌──────────────────────┴──────┐   ┌────────────────────────────┐
│  Phaser input               │   │  EntityRenderers           │
│  (pointer, drag, keyboard)  │   │  sync(slice) → reconcile   │
└─────────────────────────────┘   │  Phaser display objects    │
                                  └────────────────────────────┘
                                              │
                                     world→screen anchors
                                              ▼
                                  ┌────────────────────────────┐
                                  │  React overlay             │
                                  │  (hover popovers, modals,  │
                                  │   HUD)                     │
                                  └────────────────────────────┘
```

## Module layout

```
src/features/farmEngine/
├── FarmPhaser.tsx            # React mount component (the only React→Phaser entry point)
├── core/
│   ├── rendering.ts          # DPR supersampling model (see "Rendering model")
│   ├── coordinates.ts        # grid↔world↔screen transforms, the ONE place y-inversion lives
│   ├── camera.ts             # pan (drag-scroll parity), pinch/wheel zoom (0.5–1 range parity), scroll restore
│   ├── assets.ts             # URL-as-key loader helpers, per-texture NEAREST opt-in
│   ├── clock.ts              # scene-level ticker replicating useNodeTimer semantics for renderers
│   ├── clickable.ts          # the one clickable affordance (cursor + click + hover callback)
│   ├── depths.ts             # paint-order bands mirroring Land.tsx
│   └── sounds.ts             # Howl effects callable from Phaser code
├── components/               # in-scene UI building blocks (game-layer, not React)
│   ├── ProgressBarSprite.ts  # the DOM Bar art + pixel-font time label
│   ├── LabelSprite.ts        # Label-style chips (LabelChip)
│   ├── YieldFloat.ts         # transient +N feedback
│   └── pixelText.ts          # the font-pixel face at DOM sizing
├── bridge/
│   ├── GameBridge.ts         # typed facade handed to the scene: dispatch() + select()/subscribe()
│   ├── subscriptions.ts      # selector subscription helper (selector + equality fn → callback)
│   ├── anchors.ts            # world-position → screen-rect anchor registry (Phaser side)
│   └── useWorldAnchor.ts     # React hook: subscribe to an anchor, position an overlay element
├── scenes/
│   └── FarmScene.ts          # thin conductor: creates layers + renderers, owns nothing else
├── layers/                   # non-entity scenery, one class per Land.tsx background concern
│   ├── OceanLayer.ts         # tiled ocean (seasonal variant)
│   ├── LandBaseLayer.ts      # LEVEL_IMAGES composite, origin-centred
│   ├── DirtLayer.ts          # dirt/path autotiling (port of DirtRenderer edge logic)
│   ├── CloudsLayer.ts        # dynamic + static clouds
│   ├── WaterDecorLayer.ts    # swimmers, snorkler, shark fin, mushroom island, fins
│   └── BoatsLayer.ts         # Pete's raft, restock/Discord boats, upgrade raft, event rafts
├── entities/
│   ├── EntityRenderer.ts     # the base contract (below)
│   ├── registry.ts           # RENDERERS: state slice key → renderer class (the Land.tsx islandElements map, reborn)
│   ├── npc/NPCSprite.ts      # composited idle bumpkin from the animation service's spritesheets
│   ├── UpcomingExpansionRenderer.ts # expand icon / pontoon / reveal marker
│   ├── crops/CropRenderer.ts
│   ├── resources/            # ResourceNodeRenderer base + Tree/Mineral(config)/Oil/LavaPit/... renderers
│   ├── collectibles/…        # metadata-driven static renderer + per-name special renderers
│   ├── buildings/…
│   └── characters/…          # bumpkin, farm hands, buds, pets
├── landscaping/
│   ├── LandscapingController.ts  # enters/leaves edit mode from machine state, grid overlay, dim
│   ├── GhostPlaceable.ts         # drag ghost, collision tint, keyboard nudge, multi-place
│   └── MoveController.ts         # drag/flip/remove of placed entities (MovableComponent's replacement)
├── overlay/
│   ├── FarmOverlay.tsx       # React portal layer above the canvas; renders anchored hover UI
│   ├── FarmModals.tsx        # one React modal per FarmModalName — the UI half of in-world clicks
│   ├── CropsUI.tsx           # crop hover TimerPopover
│   └── ResourcesUI.tsx       # node hover popovers, no-tool warnings, chest-reward host
└── dev/
    ├── DevHarness.tsx        # standalone route on offline farms (landDataStatic/Dynamic) for rapid iteration
    └── parity.ts             # screenshot-diff helpers
```

Naming note: "renderer" is the operative word everywhere. If a class in this module contains game rules (timing math, yield logic, collision rules), it's in the wrong repo layer — import it from `src/features/game/` instead.

## The bridge (the part that must not become the world's registry-bus)

`FarmPhaser.tsx` constructs one **`GameBridge`** object and passes it to the scene via scene `init` data — not via `game.registry`, not via globals.

```ts
interface GameBridge {
  // Phaser → machine. Same events, same payloads as React dispatches today.
  dispatch: <T extends GameEventName>(
    event: T,
    payload: GameEventPayload<T>,
  ) => void;

  // Machine → Phaser. Fine-grained, selector-based — never whole-state pushes.
  select: <S>(selector: (state: MachineState) => S) => S;
  subscribe: <S>(
    selector: (state: MachineState) => S,
    onChange: (slice: S) => void,
    equals?: (a: S, b: S) => boolean,
  ) => Unsubscribe;

  // UI prefs from GameProvider Context (selectedItem, showTimers, showAnimations, …)
  ui: UiPrefsBridge;

  // Landscaping child machine access (typed, replaces getSnapshot().children.landscaping casts)
  landscaping: LandscapingBridge;
}
```

Rules, written down so they survive code review:

- **No `game.registry` for app state.** The registry pattern in `world/Phaser.tsx` is the primary thing we're not repeating.
- **No whole-state snapshots.** `world` does `registry.set("gameState", state)` + a global `"gameStateUpdated"` emit on every machine transition, so every consumer wakes on every change. Here, every consumer declares a selector and an equality function; `subscribe` is implemented on `gameService.subscribe` with memoized selector results (the non-React equivalent of `useSelector`). A renderer that owns `state.crops` never hears about a tree chop.
- **Every subscription returns an unsubscribe and every owner disposes it** in `destroy()`. The world's single-`listener` manager singletons (`npcModalManager` et al.) leak by design; nothing here may.
- **No `window` CustomEvents.** Settings (audio, timers visibility, animations) flow through `bridge.ui` subscriptions.
- **Phaser code never imports React; React code never reaches into scene internals.** The bridge and the anchor registry are the only two crossing points.

## EntityRenderer contract

One renderer instance per **entity type** (not per entity). It owns the full lifecycle of its display objects, keyed by entity id — a miniature reconciler, which is exactly how React's keyed lists behave today:

```ts
abstract class EntityRenderer<S> {
  constructor(
    protected scene: FarmScene,
    protected bridge: GameBridge,
  ) {}

  /** Selector for this renderer's slice, e.g. (s) => s.context.state.crops */
  abstract selector(state: MachineState): S;
  equals(a: S, b: S): boolean; // default: shallow/keyed compare

  /** Called on mount and whenever the selected slice changes. Reconcile:
   *  create objects for new ids, update changed ones, destroy removed ones. */
  abstract sync(slice: S): void;

  /** Per-frame needs only (sprite animation, bee flight). Most renderers don't override. */
  update(time: number, delta: number): void;

  destroy(): void; // unsubscribe + destroy all owned objects
}
```

`FarmScene.create()` iterates `entities/registry.ts`, instantiates each renderer, and wires `bridge.subscribe(r.selector, r.sync, r.equals)`. That registry file is the successor of `Land.tsx`'s `islandElements` arrays — **adding a new entity type to the farm means adding one line there plus one renderer class.** That is the whole "where do I add things" answer.

### Interaction pattern inside a renderer

Pointer handlers dispatch and stop — no local state mutation, no optimistic bookkeeping beyond what React does today (e.g. the harvest proc animation fires on dispatch, then `sync` reflects the authoritative result):

```ts
sprite.setInteractive({ useHandCursor: true });
sprite.on("pointerdown", () => {
  this.bridge.dispatch("crop.harvested", { index: id });
  // machine transition → subscription fires → sync() redraws the plot as empty
});
```

Timers do not tick per-entity. `core/clock.ts` re-implements `useNodeTimer`'s semantics (`now`, `readyAt`, `speed`, boost-window aware via the same `computeReadyAt`/`workAccruedAt` imports from `src/features/game/lib/boostWindows.ts`) and renderers register `{readyAt, onStage}` callbacks; the clock batches stage-boundary changes so a 500-plot farm does one pass per second, not 500 intervals.

## Coordinate system

Single source of truth in `core/coordinates.ts`, replicating `MapPlacement.tsx` exactly:

- Source art is 16px/tile (`SQUARE_WIDTH`). **Phaser world units = source pixels**, world origin (0,0) at the centre of the land base image (its art is authored origin-centred — see the doc comment in `LandBase.tsx`). Grid → world: `worldX = x * 16 + oX`, `worldY = -(y * 16) - oY` (game +y is up; the y-flip lives here and nowhere else).
- Parity zoom is achieved by **camera zoom = `DPR` × `PIXEL_SCALE` (2.625) × user zoom (0.5–1)** — never by scaling sprites. (Note the world uses zoom 3/4; the farm keeps its own 2.625 convention for feel parity.)

## Rendering model (project-ii's, adopted)

Pixel _placement_ parity with the DOM is not the goal; pixel _consistency_ is — every texel the same size on screen. The DOM farm's fractional 2.625× magnification makes texels alternate 2 and 3 CSS px; we render "blown up, then zoomed" instead (see `core/rendering.ts`, patterned on the sibling project-ii repo):

- **Backing store at physical resolution**: the canvas is sized `CSS px × DPR` (DPR = device ratio, integer-clamped 2–4) and squeezed back via `scale.zoom = 1/DPR`; the camera zooms by DPR on top of the art zoom. Texel-size variation shrinks to a physical pixel — a fraction of a CSS pixel — and the browser's final composite is a clean integer downscale. Low-density displays supersample at 2×.
- **Global LINEAR, per-texture NEAREST**: `render: { pixelArt: false, antialias: true, roundPixels: true }` (pixelArt must be _explicitly_ false — it defaults on when `scale.zoom !== 1` and force-kills antialiasing). Every texture loaded through `core/assets.ts` opts into NEAREST; vector Graphics/text stay antialiased at native res.
- **Never a `TileSprite`** — it blurs NEAREST texels in WebGL. Tile by stamping plain images (the ocean stamps into one `RenderTexture`).
- **Camera/pointer maths are in buffer pixels** throughout; only the anchor projection divides by DPR to hand CSS px to the React overlay.
- **Canvas-only input**: `input: { windowEvents: false }` — Phaser defaults to ALSO listening at window level, which made HUD/modal clicks pan the camera and click plots through the UI (found the hard way: selecting a seed in the inventory silently panned the world). With canvas-only input, a `pointerdown` on the canvas takes pointer capture so a drag released over a DOM element still delivers its `pointerup`. Belt-and-braces on top: `game.input.enabled = false` while any farm modal is open.
- Clickable affordance: `core/clickable.ts` = hand cursor + click + hover callback, deliberately **no visual hover effect** for now (a scale-up was tried and rejected); when a treatment is chosen it goes there so every interactive object picks it up at once.
- Painter's algorithm parity: `Land.tsx` sorts tiles first, then non-colliding, then by descending grid `y`. Renderers set `depth` from the same comparator (`depth = DEPTH_BAND[kind] + worldY`); mushrooms keep their explicit always-on-top band (React `z=99999`).
- Sub-tile offsets `oX/oY` are render-only, exactly as today — collision/AOE/grid math (`detectCollision`, `makeGrid`, `isWithinAOE`) is imported unchanged and operates on grid coords.

## Camera & viewport

Must match the DOM farm's feel before parity means anything:

- Drag-pan replaces `react-indiana-drag-scroll`; interactive entities call `event.stopPropagation()`-equivalents the way `data-prevent-drag-scroll` does today.
- Pinch/wheel zoom clamped 0.5–1 around the same origin behaviour as `ZoomProvider`.
- Initial scroll centred on the land base + sessionStorage scroll restore (`islandScroll.ts` semantics).
- Gameboard bounds: `84×56` grid units plus the expansion-count offset from `Land.tsx` (`offset = ceil(sqrt(expansions) * 10 / 2) * 2`).

## React overlay (hover popovers, modals, HUD)

Everything HUD-level stays in the existing React tree, untouched. HOVER popovers/tooltips (and only those — see the boundary rule) render in **`overlay/FarmOverlay.tsx`** — an absolutely-positioned DOM layer over the canvas — positioned by the **anchor bridge**:

1. A renderer registers an anchor: `bridge.anchors.set(id, { worldX, worldY, width, height })` (and removes it on destroy).
2. The Phaser side projects anchors world→screen through the camera each time the camera moves/zooms (not per frame), publishing screen rects.
3. React components use `useWorldAnchor(id)` to get a live screen rect and render the existing `TimerPopover` / `InnerPanel` at that position.

This means **zero rewrite of the popover/panel components** (`TimerPopover.tsx`, `Panel.tsx`) and pixel-identical hover UI. Hover/click intents originate in Phaser (`pointerover` → `overlayController.show("timer-popover", anchorId, props)`), flow through a small typed overlay store — **multi-listener, subscription-based; not a single-`listener` manager singleton like `npcModalManager`**.

Modals are simpler: they're screen-centred. A Phaser click either dispatches a machine event, opens a global modal (`bridge.openModal(type)` → the existing `ModalProvider`), or opens an **in-world modal** (`bridge.farmModal.open(name)` → `overlay/FarmModals.tsx`, which hosts one React modal per `FarmModalName` — the snorkler dialogue, Pete's tabs, the restock shipment, the island-upgrade flow, expansion requirements...). Adding a new in-world interaction = sprite + click in a renderer, a name in `FarmModalName`, a case in `FarmModals`. The `SHOW_MODAL` state-map modals keep working unchanged.

## Landscaping mode

The `landscapingMachine` is untouched; only its two DOM-bound views are replaced:

- `Placeable.tsx` (ghost) → `GhostPlaceable.ts`: Phaser-native drag on a tinted ghost sprite, grid snap at `16`px world units (or 1px in pixel-perfect mode, `p` key), arrow/WASD nudge, `detectCollision` per tick, green/red tint, `PLACE`/`UPDATE` events to the machine as today. This retires the DOM-measurement hack (`getBoundingClientRect` on `#genesisBlock` + scroll-container offsets) entirely — the engine knows its own camera transform.
- `MovableComponent.tsx` (1696 lines wrapping every placed entity) → `MoveController.ts`: on entering landscaping state, entity renderers mark their objects draggable; drag-end dispatches `getMoveAction(name)` with grid coords; `FLIP`/`REMOVE`/`BLUR` flow to the landscaping child machine through `bridge.landscaping`. The overlap-disambiguation menu becomes an anchored React overlay.

`LandscapingGrid`'s CSS grid lines become a `Phaser.GameObjects.Grid`/TileSprite; the dim overlay a screen-space rectangle.

## Asset pipeline

Strict parity means **the same PNGs**. The existing code imports them as URLs via Vite (`LEVEL_IMAGES`, `CROP_LIFECYCLE`, `alternateArt.ts` variants, `SUNNYSIDE`), so:

- Phase 0 builds `core/assets.ts`: `load(scene, key, url)` helpers that take the **existing imported URL maps** as manifests — no parallel asset lists to drift out of sync. Texture keys are derived from URLs.
- Load what the current farm needs (its biome + season + placed items), not the whole catalogue: a manifest builder reads `GameState` and emits the load list; landscaping/placement lazily loads on demand.
- Spritesheets already used by `SpriteAnimator` (mushrooms, harvest proc, tree shake, depleting animations) map 1:1 onto `Phaser.Textures` spritesheet loading with the same frame counts.
- Later optimization (post-parity): atlas packing. Not during the port.

## How to add things (the recipes)

**A new resource** (e.g. a new rock type):

1. Game layer as today: types, events, handlers under `src/features/game/` — unchanged by this migration.
2. Add a renderer in `entities/<name>/` extending `EntityRenderer` (rocks: extend the shared `RockRenderer` and supply the recovered/depleting/depleted textures + hit stages).
3. Register it in `entities/registry.ts` with its selector.
4. Add its sprites to the manifest section of `core/assets.ts` (usually just referencing the art map you created in step 1).
5. Popover/progress needs are declarative: register anchors + overlay intents; no new React needed if `TimerPopover`/`ProgressBar` suffice.

**A new collectible**: add art + metadata as today (`COLLECTIBLES_DIMENSIONS`, image map). If it's a static image, the metadata-driven `StaticCollectibleRenderer` picks it up with **zero engine code**. Animated/interactive ones get a named renderer class registered in the collectible renderer map (mirroring how `collectibles/components/` overrides work today).

**A new building**: entry in the building renderer registry (texture per construction state, click → modal type). Crafting indicator/bubble is a shared sub-object.

**A new UI popover**: build it in React as always; show it from Phaser via an overlay intent + anchor. If it's a full modal, add a `GlobalModal` type and open it through the bridge callback.

## Testing & dev workflow

- `dev/DevHarness.tsx`: a route mounting the engine on `STATIC_OFFLINE_FARM` / `DYNAMIC_OFFLINE_FARM` (`getDynamicIsland` lets us fabricate any island type × expansion count) with no auth — the primary iteration loop.
- Unit tests: renderers are testable headlessly (Phaser HEADLESS mode) — feed a slice, assert display-object inventory (`sync` is pure state→objects).
- Parity harness: screenshot the React farm and the Phaser farm on identical fixtures, pixel-diff. Run across the biome × season × expansion matrix before each phase is called done.
- Event parity: assert (via a dispatch spy) that each ported interaction emits the same event name + payload the React component emits.
