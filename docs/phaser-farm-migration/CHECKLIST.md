# Phaser Farm Migration — Checklist

Phases are ordered so each is independently shippable behind the `PHASER_FARM` flag and testable in the dev harness. File references point at the React source being ported (the parity reference) — read it before porting it.

Conventions:

- ✅ a phase is "done" when it passes the parity screenshot diff for its surface **and** its interactions dispatch identical machine events.
- The game layer (`src/features/game/events/`, `gameMachine.ts`, `landscapingMachine.ts`) is never modified to make a phase work.

---

## Phase 0 — Foundation ✅ (2026-08-26)

The architecture end-to-end, before any breadth. Everything after this is repetition of these patterns.

- [x] Module scaffold `src/features/farmEngine/` per [ARCHITECTURE.md](./ARCHITECTURE.md)
- [x] `PHASER_FARM` feature flag in `src/lib/flags.ts` (`testnetLocalStorageFeatureFlag("phaserFarm")` — auto-on for amoy/local dev, localStorage opt-in on mainnet)
- [x] Flag-gated swap at the existing `/farm` route in `src/features/game/expansion/Game.tsx`
- [x] Phaser.Game config: no physics, **no `arcade.debug`**. Lives in `FarmPhaser.tsx` (small enough not to warrant a separate `core/engine.ts` yet). ~~pixelArt + Scale.RESIZE~~ superseded by the project-ii rendering model (DPR backing store + `Scale.NONE`, LINEAR + per-texture NEAREST) — see the Phase 1 entry and ARCHITECTURE.md
- [x] `core/coordinates.ts` — grid↔world, y-inversion, `oX/oY` offsets, gameboard dims/bounds; unit-tested against `MapPlacement.tsx` maths
- [x] `core/camera.ts` — drag-pan, wheel + two-pointer pinch zoom 0.5–1, initial centre on origin, sessionStorage one-shot restore, gameboard bounds tracking expansion count. Anchor projection derived from scroll+zoom (NOT `worldView` — it's stale in the tick that moves the camera). _Browser-verified: pan; wheel/pinch still need hand-testing on device_
- [x] `bridge/GameBridge.ts` + `bridge/subscriptions.ts` — `dispatch`, selector `subscribe` with equality fns (unit-tested), UI-prefs store pushed from `GameProvider` context, typed landscaping access, `openModal` wired from `ModalProvider` (its `GlobalModal` type is now exported)
- [x] `bridge/anchors.ts` + `bridge/useWorldAnchor.ts` + `overlay/FarmOverlay.tsx` — anchor registry, camera-driven reprojection, `WorldAnchored` positioner. _Browser-verified: a React label pinned to grid (0,0) tracks pan/zoom_
- [x] `core/clock.ts` — batched 1s-pass stage clock with `useNodeTimer` semantics via `boostWindows.ts` imports (unit-tested, both timing models)
- [x] `core/assets.ts` — URL-as-key image/spritesheet queue + awaitable loader (first real use: Phase 1)
- [x] `entities/EntityRenderer.ts` + `entities/registry.ts` — base contract + empty registry
- [x] Dev tooling: `dev/DebugGrid.ts` (grid/origin/genesis outline + demo anchor, localStorage `phaserFarm.debug`) + `dev/DevPanel.tsx`. Offline farm = run dev server with `VITE_API_URL=` blank (ART_MODE). _Island/season/expansion switcher deferred to Phase 1 where the art matrix needs it_
- [x] `dev/parity.ts` — canvas snapshot + dependency-free pixel diff (full harness grows with Phase 1)
- [x] Engine teardown verified in-browser: navigate `/farm` → `/home` → `/farm`, exactly one canvas after remount, no engine console errors. HUD renders over the canvas (no z-index on the engine wrapper — `HudContainer` portals at `z-10` and must win)

## Phase 1 — Land & environment (static world parity) ✅ core (2026-08-26)

Reference: the background stack at the top of `src/features/game/expansion/Land.tsx`.

New this phase: the **in-world modal bridge** (`bridge.farmModal` + `overlay/FarmModals.tsx` — Phaser renders the sprite and the click, React renders the modal) and the **NPC pipeline** (`entities/npc/NPCSprite.ts` — composited idle bumpkins from the animation service's 96×64 spritesheets, the same pipeline the world's BumpkinContainer uses).

> **The boundary rule (decided during this phase):** rendering anything gameplay-related is Phaser — swimmers, boats, rafts, NPCs, the expand icon, the pontoon, all of it. React renders UI only: HUD, modals, tooltips, popovers, anchored labels/progress bars. An earlier "world plane" pattern that hosted whole in-world React components over the canvas was removed for violating this; the anchored-overlay scale trick survives strictly for UI (see `overlay/UpcomingExpansionUI.tsx`).

- [x] `OceanLayer` — tiled ocean at 64 src px/tile; winter `frozenOcean`, volcano+ `darkOcean` variants
- [x] `LandBaseLayer` — `getLandImage` (imported from `LandBase.tsx`), origin-centred at scale 1; reacts to expansion / biome / season slices
- [x] `BackgroundIslandsLayer` — 8 islands, 1536×1088 design-board scaling incl. the DOM's CSS-px rounding
- [x] `CloudsLayer` — 4 stretched static frame bands + 32 dynamic clouds; `animate-float` bob (6 CSS px, 3s sine) as tweens gated on `showAnimations` via the UI-prefs bridge
- [x] Water decor — `layers/WaterDecorLayer.ts`: goblin, snorkler (click → modal), seasonal swimmers + cossies, frozen swimmer, mushroom island, full-moon fins (drift tweens), shark fin (45s spritesheet cycle + click → modal). _Parity gap: goblin/snorkler/swimmer source assets are animated GIF/WebP — Phaser shows their first frame until spritesheet art exists_
- [x] Boats — `layers/BoatsLayer.ts`: Pete's teaser raft [TravelTeaser], restock boat [RestockBoat], Discord boat incl. sail tween + Wobble [DiscordBoat], Grubnuk's upgrade raft [IslandUpgrader, position table exported as `getUpgradeRaftPosition`], La Tomatina raft. All clicks → React modals via `farmModal` / global DISCORD modal. Browser-verified: Pete + Grubnuk NPCs render from animation-service sheets; Pete click opens the tabs modal. _Gaps: Discord hull GIF static; Pete's speech-bubble hint text not yet rendered (chat icon only) — needs the engine's speech-bubble treatment; NPC pixel-alignment eyeballed, needs a side-by-side check_
- [x] Upcoming expansion — `entities/UpcomingExpansionRenderer.ts`: expand icon (+pulsate), pontoon, land-complete + reveal marker, reveal flow (events + confetti + BETTY/FIREPIT modals) all Phaser; requirement labels + construction ProgressBar are anchored React (`overlay/UpcomingExpansionUI.tsx`); requirements/speed-up modals in `FarmModals`. _Gap: icon pulsate ignores VIP coin discount (labels use the real hook); camera doesn't re-centre after island upgrade yet_
- [ ] NPC animation-service note: sheets only allow CORS from localhost:3000 — local smoke tests must run the dev server on the default port
- [x] Rendering model reworked to project-ii's (see ARCHITECTURE.md "Rendering model"): DPR-supersampled backing store + `zoom: 1/DPR`, global LINEAR with per-texture NEAREST opt-in (`core/assets.ts`), ocean re-tiled via RenderTexture stamps (TileSprite blurs NEAREST in WebGL), modal-open input gating. Browser-verified at deviceScaleFactor 2: uniform native-res texels, pan + click mapping intact
- [x] `DirtLayer` — pure derivation in `layers/dirtTiles.ts` (imports `getGameGrid` + `getDirtImage`), unit-tested (isolated plot, run caps, crop↔path joining, biome art); sprite projection browser-untested — the offline farm has no crops (verify when Phase 2 plants one, or via Phase 8 path placement)
- [ ] Parity diff across matrix: 9 biomes × 4 seasons × expansion levels {3, 9, 15, 23, 42} — needs the dev-harness island/season/expansion switcher (deferred from Phase 0); current verification is the default offline fixture only

## Phase 2 — Crops (the interactive vertical slice) ✅ core (2026-08-26)

Reference: `src/features/island/plots/Plot.tsx` + `components/`. This phase sets the template every entity follows — review it hardest.

New this phase: bridge channels for entity UI — `hover` (pointer-over entity → React popovers), `fx` (transient world events → floating +N), `cropReward` (chest/captcha handoff with a result callback) — plus per-plot anchors (`cropAnchorId`), the shared `core/clickable.ts` hover effect, `core/sounds.ts` (plant/harvest Howls), and a crop fixture in `STATIC_OFFLINE_FARM` (2 empty plots, ready Sunflower, growing Kale + seeds).

- [x] `entities/crops/CropRenderer.ts` registered for `state.crops`; per-id reconciliation (plant/harvest/removal; move re-syncs come free when Phase 8 dispatches them). Clicks land on a tile-sized zone (DOM parity: the tall crop art is not clickable), with the hover effect applied to the art
- [x] Soil & growth stages — imported `getGrowthStage` + `CROP_LIFECYCLE[biome]` art at the DOM's −12px offset; non-fertile plot (dry soil + water-well modal). _Deferred: Tornado/Tsunami/GreatFreeze weather-plot art, tutorial dig/click pulsate icons_
- [x] Both timing models via `getHarvestMetrics` (now exported from `FertilePlot.tsx`); boost windows unioned from `getCropPlotBoostWindows` + `getCropFertiliserWindows`
- [x] Clock-driven stage transitions — one `FarmClock` registration per planted plot, stage fractions [0.25, 0.5, 1]. _Nuance: clock progress ignores landscaping-banked `boostedTime` (art may flip a beat early on lifted windowed crops; overlay % is exact)_
- [x] Corner status icons (boost ⚡, weather, bee swarm, fertiliser) — anchored React in `overlay/CropsUI.tsx` (decision: per-plot status icons are UI, same anchored-scaled pattern as progress bars)
- [x] Click-to-plant with `selectedItem`, click-to-harvest — same events + payloads (`seed.planted` with uuid cropId, `crop.harvested`, `plot.fertilised`), double-click buffer, analytics milestones, BLACKSMITH/seasonal-seed modals. Browser-verified: plant + harvest round trip. _Deferred: quick-select popup when no seed is selected_
- [x] `TimerPopover` on hover via the hover channel + plot anchor — browser-verified ("Sunflower 58secs" with icon)
- [x] `ProgressBar` under growing crops when `showTimers` — browser-verified ("58s"/"1d")
- [x] Harvest FX: floating `+N` with `getYieldColour` via the fx channel (browser-verified); proc firework spritesheet ≥10 yield in Phaser (logic ported, needs a high-yield farm to eyeball)
- [x] Chest reward / captcha flow — `cropReward` channel → `ChestReward` anchored at the plot, harvest completes via callback (wired; needs a reward roll to eyeball)
- [ ] Event-payload parity test vs `Plot.tsx` dispatches (automated dispatch-spy suite still to write)

## Phase 3 — Trees & mineral nodes ✅ core (2026-08-27)

Reference: `src/features/game/expansion/components/resources/*`. All follow recovered → depleting (strike anim + `+N`) → depleted (stump/hole + `TimerPopover` countdown) → recovered.

New this phase, following two further boundary rulings: **progress bars/inline timers render in-scene** (`components/ProgressBarSprite.ts` — the DOM Bar art + pixel-font time label; crops + pontoon + lava pits use it) and **game-layer labels render in-scene** (`components/LabelSprite.ts` chips — expansion requirement labels are now Phaser; `components/YieldFloat.ts` — the +N floats are Phaser; crop corner status icons are Phaser). React overlays are now hover-popovers + modals ONLY (`CropsUI` = crop popover; `ResourcesUI` = node popovers, no-tool warnings, chest-reward host). Shared node plumbing in `entities/resources/ResourceNodeRenderer.ts` (per-id reconcile, DOM stale-read touch counts, outside-click reset, health bars, hover channel).

- [x] Shared base: `ResourceNodeRenderer` + config-driven `MineralRenderer` (one class, five family configs)
- [x] Trees (`entities/resources/TreeRenderer.ts`) — shake sheet, chop sheet, stump + recovery timer, biome/season `alternateArt` variants, Insta-Chop, Foreman-Beaver tool rules, chest-reward captcha. Browser-verified: 3-click chop → stump → "Tree 1hr 59mins" hover popover
- [x] Stone / Fused / Reinforced (`STONE_CONFIG`) — tier art + tier strike sheets, Quarry/Tap-Prospector rules
- [x] Iron / Refined / Tempered (`IRON_CONFIG`)
- [x] Gold / Pure / Prime (`GOLD_CONFIG`)
- [x] Crimstone stages 1–6 (`CRIMSTONE_CONFIG`, imported `getCrimstoneStage`), stage-6 triple-drop sheet, Crimstone Spikes Hair wearable rule
- [x] Sunstone stages 1–10 (`SUNSTONE_CONFIG`, imported `getSunstoneStage`), deliberate `now <= readyAt` depletion parity
- [x] Ascension Crystal — single-use, mining ghost (drop sheet + `+3` float at the removed node's box)
- [x] Oil Reserve — full/half/empty by remaining WORK, spurting-well bonus overlay, single-click drill
- [x] Lava Pit — idle/running(bar)/ready(alert) + modal (`LavaPitModalContent` reused). _Gap: running art is an animated webp — static in Phaser_
- [x] Boulder — static + teaser modal
- [x] Advanced-tier art/offsets per the READONLY table (all 9 rock names)
- Fixture: `STATIC_OFFLINE_FARM` now has iron/gold/crimstone/sunstone/oil nodes + all pickaxes/drill
- _Deferred: recover lightning-flash Transitions (tree/gold/crimstone polish); Pete-style speech text; exact DOM Label chip border art; no-tool warning i18n keys (plain English for now)_

## Phase 4 — Compound & derived resources

- [ ] Fruit Patch (`features/island/fruit/`) — seedling/replenishing/replenished/dead tree states, harvest/chop flows
- [ ] Flower Bed (`features/island/flowers/`) — growth stages, cross-breed modal via bridge
- [ ] Beehive (`resources/beehive/`) — port `beehiveMachine.ts` bee-flight behaviour into renderer `update()`; swarm indicator
- [ ] Mushrooms (`features/island/mushrooms/`) — spritesheet anim, always-on-top depth band, spawn/despawn reconciliation
- [ ] Salt nodes + placeholders (`components/salt/`, coords from `types/salt.ts` `getSaltNodeCoordinates`) — derived positions, upgrade flow modal
- [ ] Fisherman + dock (`features/island/fisherman/Fisherman.tsx`) — cast flow modal via bridge
- [ ] Water trap spots (`fisherman/WaterTrapSpot.tsx`, coords from `types/crustaceans.ts`)

## Phase 5 — Buildings

Reference: `src/features/island/buildings/components/building/Building.tsx`.

- [ ] Building renderer registry: texture per building × construction state (constructing/built), biome/season variants from `alternateArt.ts`
- [ ] Construction timer popover + ready indicator
- [ ] Click → correct React modal/interior-entry per building (cooking bubbles, crafting indicators as sub-objects)
- [ ] Cooking/crafting progress indicators (bubble + item icon) driven by state subscription
- [ ] Interior **entry points** work (doors navigate to the existing React interiors — interiors themselves are Phase 12+)

## Phase 6 — Collectibles (breadth via registry)

Reference: `src/features/island/collectibles/Collectible.tsx` + 371 components in `collectibles/components/`.

- [ ] Audit script: classify all 371 into (a) static single image, (b) spritesheet loop, (c) special/interactive (state-reading, clickable, time-varying)
- [ ] `StaticCollectibleRenderer` — metadata-driven (image map + `COLLECTIBLES_DIMENSIONS`), zero per-item code for class (a)
- [ ] `SheetCollectibleRenderer` — declarative frame config for class (b)
- [ ] Individual renderers for class (c) (expect a few dozen: e.g. Time Warp Totem states, Nyon Statue, seasonal interactives)
- [ ] Fence autotiling (`Fence`, `StoneFence`, `GoldenFence`, `GoldenStoneFence`) on `makeGrid` adjacency
- [ ] Dirt path & tile collectibles via `DirtLayer`/tiles logic (`Tiles.tsx`)
- [ ] Buff/AOE auras where rendered today (respect `showAnimations`)
- [ ] Flipped rendering (`flipped` prop parity)

## Phase 7 — Characters & dynamic entities

- [ ] Placed Bumpkin (`features/island/bumpkin/components/PlacedBumpkin.tsx` → NPC sprite composition) — wearable-composited character rendering (reuse world's bumpkin part compositing approach as reference, but through this engine's asset pipeline)
- [ ] Farm hands (`features/island/farmhand/FarmHand.tsx`)
- [ ] Buds (`features/island/buds/Bud.tsx`) — filtered to `location === "farm"`
- [ ] Pet NFTs (`features/island/pets/PetNFT.tsx`, `PetSprite`) — 2×2, animations
- [ ] Airdrops (`components/Airdrop.tsx`) — claim flow via bridge
- [ ] Depth/painter parity checks with characters moving through object rows

## Phase 8 — Landscaping mode (full editing parity)

References: `placeable/landscapingMachine.ts` (unchanged), `placeable/Placeable.tsx`, `collectibles/MovableComponent.tsx`, `landscaping/LandscapingGrid.tsx`.

- [ ] `LandscapingController` — enter/leave on machine `landscaping` state; grid overlay; black dim; hide/show timers per today's behaviour
- [ ] `GhostPlaceable` — drag ghost with `READONLY_*` art, 1-tile grid snap, pixel-perfect mode (`p` key, 1px snap), arrow/WASD nudge, `detectCollision` per move, green/red tint, `UPDATE`/`PLACE` to machine
- [ ] Multi-place flow (`PLACE` with `multiple: true` keeps placing; next-origin behaviour parity)
- [ ] `MoveController` — select/`SELECT`, drag placed entities, drop → `getMoveAction(name)` dispatch, `BLUR`, `FLIP`, long-press behaviour on touch
- [ ] Removal mode: `TOGGLE_REMOVAL_MODE`, `REMOVE`, `REMOVE_ALL` (+ confirm modals via bridge)
- [ ] Overlap disambiguation menu as anchored React overlay (replaces `MovableComponent`'s singleton menu)
- [ ] Collision parity: imported `detectCollision`/`detectWaterCollision`, `NON_COLLIDING_OBJECTS` — no re-implementation
- [ ] Layout preview / saved layouts (`hud/components/LayoutPreview.tsx`, `SavedLayoutsModal.tsx`) keep working (they're React HUD; verify data flow only)
- [ ] `LandscapingHud` works unmodified over the canvas
- [ ] Retire check: no code path left that measures DOM (`#genesisBlock` `getBoundingClientRect`, scroll-container offsets)

## Phase 9 — Visiting mode

- [ ] Phaser farm renders from `visitorState` context (visited farm) with visiting interactions only
- [ ] Clutter (`features/island/clutter/Clutter.tsx`) — trash/pest pickup dispatching `VisitingEvent`s
- [ ] Helping/cheering flows + `VisitingHud` unchanged over canvas
- [ ] Local-only visiting events still excluded from the save queue (machine behaviour — verify, don't change)

## Phase 10 — Parity QA & the swap

- [ ] Full-matrix screenshot diff green (biomes × seasons × expansion levels × landscaping on/off)
- [ ] Event-dispatch parity suite green (every farm-reachable `PlayingEvent`/`PlacementEvent`)
- [ ] Perf: 60fps on 42-expansion maxed farm, mid-range mobile; memory stable across farm↔world↔farm navigation (no leaked scenes/textures)
- [ ] Beta rollout: flag → `betaFeatureFlag`, gather feedback, burn down bug list
- [ ] Flip default; React farm behind an escape-hatch flag for one release
- [ ] Delete: `Land.tsx` render tree, `MapPlacement.tsx`, `MovableComponent.tsx`, `Placeable.tsx` DOM path, `DirtRenderer.tsx`, per-resource React renderers (keep the pure logic they imported), `GameBoard`/`ZoomProvider` if nothing else uses them
- [ ] Docs: update ARCHITECTURE.md to reflect as-built reality; write the interiors plan

## Phase 11 — Post-parity upgrades (the payoff — separate efforts, not part of "port")

- [ ] Texture atlas packing for farm assets
- [ ] Day/night & weather shader pass (farm-appropriate; recolour-not-glow per pixel-art style rules)
- [ ] Particle/tween polish: harvest, chop, mining feedback
- [ ] Camera niceties: momentum pan, smart zoom-to-cursor
- [ ] Explore: crop sway, water animation, ambient wildlife

## Phase 12+ — Interiors (deferred by decision #3)

Planned properly after land parity; expected shape: one `InteriorScene` sharing all Phase-0 infrastructure, per-interior layers/renderers for `home`, `barn` (+ `animalMachine` animals), `henHouse`, `greenhouse`, `petHouse`, using `HOME_BOUNDS`-family collision imports.
