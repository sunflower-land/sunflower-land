# Phaser Farm Migration

Port the farm's **rendering layer** from React DOM to Phaser, while keeping everything else — the game machine, event handlers, HUD, modals, popovers — exactly where it is. When you enter the world we already use Phaser; this brings the same runtime to your farm, and later your interiors (home, barn, hen house, greenhouse, pet house).

## Why

- **Performance**: 1000+ absolutely-positioned DOM nodes with CSS transforms don't scale. A Phaser canvas with a single draw loop, texture atlases, and culling does.
- **Capability**: shaders, lighting, particles, smooth tweens, day/night — things that are painful or impossible in DOM.
- **Consistency**: one rendering runtime across world and farm.

## Ground rules (agreed decisions)

1. **Parallel build behind a feature flag.** The Phaser farm is built as a sibling of the React farm and gated by a `PHASER_FARM` flag (`src/lib/flags.ts`). `src/features/game/expansion/Game.tsx` already declares a `/farm` route rendering the React `Land` — the flag swaps in the Phaser farm there. The React farm stays untouched and remains the default until full parity. Zero risk to live players during the build.
2. **Independent, well-architected engine module.** We do **not** build on `src/features/world`'s patterns. That code works but is scrappy: `game.registry` as a global bus, whole-`GameState` snapshot pushes on every change, single-listener modal-manager singletons with no unsubscribe, `window` CustomEvents for settings, disabled `exhaustive-deps`, `arcade.debug: true` in the prod config. The farm engine is a fresh module (`src/features/farmEngine/`) with explicit, typed communication patterns. See [ARCHITECTURE.md](./ARCHITECTURE.md). (Long-term, the world can migrate onto this engine's patterns — but that is out of scope here.)
3. **Land to full parity first.** The outdoor farm — all island types, biomes, seasons, resources, buildings, collectibles, characters, landscaping mode — reaches full parity before we touch interiors.
4. **Strict visual parity.** Same sprites, same positions, same growth stages, same z-ordering (painter's algorithm), same popovers. A player flipping the flag should not be able to tell the difference. Visual upgrades (shaders, lighting, better tweens) come as a **separate phase after the swap**, so any regression during the port is unambiguous.

## What moves and what stays

| Layer                                                                                                                                            | Stays / Moves                     | Notes                                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Game machine, event handlers (`src/features/game/lib/gameMachine.ts`, `src/features/game/events/`)                                               | **Stays, unchanged**              | Phaser dispatches the same `gameService.send("crop.harvested", …)` events React does today.                                                                                                                                      |
| Landscaping machine (`src/features/game/expansion/placeable/landscapingMachine.ts`)                                                              | **Stays, unchanged**              | Phaser-native drag replaces `react-draggable`, but all mutations still flow through `SELECT` / `MOVE` / `PLACE` / `REMOVE` / `DROP` into the same machine.                                                                       |
| Pure game logic (`CROPS`, `computeReadyAt`, `getHarvestMetrics`, `detectCollision`, `makeGrid`, `alternateArt.ts` variant maps, `LEVEL_IMAGES`…) | **Stays, imported by the engine** | These are render-agnostic pure functions/data. The engine consumes them directly — no duplication.                                                                                                                               |
| In-world rendering (everything `Land.tsx` renders: land base, dirt, resources, buildings, collectibles, characters, clouds, water)               | **Moves to Phaser**               | The subject of this migration.                                                                                                                                                                                                   |
| Hover popovers (TimerPopover, no-tool warnings)                                                                                                  | **Stays React**, repositioned     | Rendered in a DOM overlay above the canvas, anchored to world positions via the anchor bridge. Everything else on the game layer (progress bars, labels, +N, status icons) is Phaser — see the boundary rule in ARCHITECTURE.md. |
| HUD, modals, toasts, inventory, settings (`Hud.tsx`, `ModalProvider`, `SHOW_MODAL` map, chest rewards/captcha)                                   | **Stays React, untouched**        | Fixed-position UI; doesn't care what renders underneath it.                                                                                                                                                                      |

## Documents in this folder

- **[README.md](./README.md)** (this file) — the plan: goals, decisions, scope.
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — the guide: engine structure, React↔Phaser bridge, entity renderer contract, coordinate system, and the "how to add a new resource / collectible / building" recipes.
- **[CHECKLIST.md](./CHECKLIST.md)** — the phased, file-referenced work checklist. One phase per PR-sized chunk, ordered so each phase is independently testable behind the flag.

## Milestone overview

| Phase | What                                                                                                                                                   | Proves                                                              |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| 0     | Foundation: engine mount, flag + route, camera (pan/pinch-zoom parity), coordinate system, state bridge, overlay anchors, dev harness on offline farms | The architecture, end to end, before any breadth                    |
| 1     | Land & environment: ocean, land base, background islands, clouds, water decor, upcoming expansion, dirt/path autotiling                                | Static world parity across 9 biomes × 4 seasons × 42 levels         |
| 2     | Crops (vertical slice): plots, growth stages, timers, popovers, harvest FX, event dispatch                                                             | The full interactive loop — the template every other entity follows |
| 3     | Trees & mineral nodes: tree, stone, iron, gold, crimstone, sunstone, ascension crystal, oil, lava pit, boulder                                         | The recovered → depleting → depleted state pattern at scale         |
| 4     | Compound resources: fruit patches, flower beds, beehives, mushrooms, salt nodes, fisherman/water traps                                                 | Entities with sub-machines and derived positions                    |
| 5     | Buildings: registry, construction states, click-through to React modals                                                                                | Modal interop                                                       |
| 6     | Collectibles (371 components): metadata-driven static pipeline + individual ports for animated/special ones; fence & path autotiling                   | Breadth via registry, not hand-porting                              |
| 7     | Characters & dynamic: bumpkin, farm hands, buds, pet NFTs, airdrops                                                                                    | Animated wearable-composited entities                               |
| 8     | Landscaping mode: grid, ghost placement, drag/drop, collision tint, move/remove/flip, keyboard nudge, multi-place                                      | Full editing parity, DOM-measurement code retired                   |
| 9     | Visiting mode: visitor state, clutter, helping                                                                                                         | Second machine context on same scenes                               |
| 10    | Parity QA & swap: screenshot diffing, perf budget, flag default flip, React farm removal                                                               | Ship                                                                |
| 11    | Post-parity upgrades: shaders, lighting, particles, tween polish                                                                                       | The reason we did all this                                          |
| 12+   | Interiors: home, barn, hen house, greenhouse, pet house                                                                                                | Deferred until land parity (decision #3)                            |

## Success criteria

- Pixel parity: automated screenshot comparison of React vs Phaser farm across a matrix of offline-farm fixtures (`src/features/game/lib/landDataStatic.ts`, `landDataDynamic.ts`) — biomes × seasons × expansion levels.
- Every `PlayingEvent` and `PlacementEvent` reachable from the farm today is dispatchable from the Phaser farm, with identical payloads (the machine and its tests are the referee).
- Performance: 60fps target on a maxed-out 42-expansion farm on mid-range mobile, where the DOM farm currently struggles.
- No change to `src/features/game/events/` or `gameMachine.ts` required by the port (additions for genuinely new needs are fine; rewrites are a smell).
