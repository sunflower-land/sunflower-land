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
- [x] Dev tooling: `dev/DebugGrid.ts` (grid/origin/genesis outline + demo anchor, localStorage `phaserFarm.debug`) + `dev/DevPanel.tsx`. Offline farm = run dev server with `VITE_API_URL=` blank (ART*MODE). \_Island/season/expansion switcher deferred to Phase 1 where the art matrix needs it*
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
- [x] Corner status icons (boost ⚡, weather, bee swarm, fertiliser) — in-scene Phaser images in `CropRenderer` (moved from React per the game-layer ruling)
- [x] Click-to-plant with `selectedItem`, click-to-harvest — same events + payloads (`seed.planted` with uuid cropId, `crop.harvested`, `plot.fertilised`), double-click buffer, analytics milestones, BLACKSMITH/seasonal-seed modals. Browser-verified: plant + harvest round trip. _Deferred: quick-select popup when no seed is selected_
- [x] `TimerPopover` on hover via the hover channel + plot anchor — browser-verified ("Sunflower 58secs" with icon). The only crop UI left in React
- [x] Progress bar under growing crops when `showTimers` — in-scene `ProgressBarSprite`, browser-verified ("58s"/"1d")
- [x] Harvest FX: floating `+N` with `getYieldColour` — in-scene `playYieldFloat` (browser-verified); proc firework spritesheet ≥10 yield in Phaser (logic ported, needs a high-yield farm to eyeball)
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

## Phase 4 — Compound & derived resources ✅ core (2026-08-27)

Modal hosts extended: `overlay/FarmModals.tsx` gained flower/beehive/salt/fisherman/water-trap modals (+ `overlay/farmModalContents.tsx` for the ported inline contents); `ResourcesUI` gained a `CompoundPopover` for the new hover kinds. Browser-verified on the offline farm: apple harvest → `+1` HUD delta + replenishing art + in-scene 11h bar + "Apple Replenishing" popover; mushroom pick → `+1`; blueberry 5h bar; ready/empty flower beds; beehive quantity bar; salt farm platform with in-scene UPGRADE chip + goblin; fisherman idle on the wharf.

- [x] Fruit Patch (`FruitPatchRenderer`) — seedling/growing/replenishing/replenished/dead states, harvest + dead-tree chop (wood reward float), fertilise, boost windows. Browser-verified harvest round trip
- [x] Flower Bed (`FlowerBedRenderer`) — `FLOWER_VARIANTS` growth art, cross-breed modal (`FlowerBedModal` reused), insta-grow + congratulations modals
- [x] Beehive (`BeehiveRenderer`) — `beehiveMachine` reduced to a 1s tick (honey %, ready drop indicator), Bee.tsx flight as a tween chain (exact geometry/durations), harvest + swarm modal
- [x] Mushrooms (`MushroomRenderer`) — 5-frame idle sheet with random ≤15s replay gap, ALWAYS_ON_TOP band, one-click pick (browser-verified)
- [x] Salt farm (`SaltRenderer`) — derived positions, upgrade flow modal (`UpgradeSaltFarmModalPanel` reused), in-scene UPGRADE label chip
- [x] Fisherman + dock (`FishermanRenderer`) — per-island wharf art + offsets, bubbles/fish decor, 56-frame sheet as idle→casting→waiting→reeling→caught state machine, cast/caught modals
- [x] Water trap spots (`WaterTrapRenderer`) — wharf-derived coords, crab-spot art, 2-frame pot loops, soak bar, sparkle+alert when ready, placement/caught modals
- [x] Yield-float icon loading hardened: `playYieldFloat` now lazy-loads a missing icon texture (was Phaser's black missing-texture square), and Tree/Mineral/AscensionCrystal/FruitPatch queue their float icons up front
- Fixture: `STATIC_OFFLINE_FARM` now has fruit patches (ready Apple, growing Blueberry), flower beds (ready Red Pansy + empty), a half-full beehive, a Wild Mushroom, and a crab-trap spot
- _Deferred: quick-select popup (fruit + flowers), harvest shake anim, fisherman map-puzzle challenge + fish-frenzy/full-moon/marvel icons, compact DOM-parity variants of the beehive-level / flower-congrats / fisherman-caught modals, crab-spot art placement eyeball vs DOM (tiny at default zoom)_

## Phase 5 — Buildings ✅ core (2026-08-27)

Reference: `src/features/island/buildings/components/building/Building.tsx`.

Architecture: one `entities/buildings/BuildingRenderer.ts` reconciling all of `game.buildings`, with the per-building art/offsets flattened to data in `buildingArt.ts` (`BUILDING_BASE_ART` + `COOKING_LAYOUT`, Phaser-free/jest-testable). Building clicks route through new `FarmModalName`s to `overlay/BuildingModals.tsx`, which reuses the DOM's exported modals (`FirePitModal`…`SmoothieShackModal`, `ShopItems`, `WorkbenchModal`, `ComposterModal`, `CraftingBoxModalContent`, `FishMarketModal`, `AgingShedModal`, `CropMachineModal` + local `cropStateMachine`, `UpgradeBuildingModal`, `Constructing`, `WeatherAffectedModal`). Navigation buildings go through the new `bridge.navigateTo` (react-router wired in FarmPhaser). Browser-verified: Town Center/Market/Workbench base art; Fire Pit cooking state (0.8 alpha, doing-NPC, item icon, ready `!` alert) → click opens the Fire Pit modal; constructing Kitchen at 50% + in-scene bar → click opens the Constructing panel ("01:58:42" + Speed up); running Compost Bin (composting art + in-scene timer bar); Market click → Betty conversation + shop.

- [x] Building renderer registry: texture per building × construction state, biome/season/level variants (`alternateArt.ts`, `BARN_IMAGES`, `COMPOSTER_IMAGES`, aging-shed thresholds, water-well upgrade-adjusted level)
- [x] Constructing state: 50% alpha + bottom-centre in-scene progress bar + Constructing modal with gem/coin speed-up (`building.spedUp`/`upgrade.spedUp`)
- [x] Click → correct React modal per building; level gate → lock panel; destroyed (tornado/tsunami badge) → `WeatherAffectedModal`; collect-on-click parity (`recipes.collected` / `processedResource.collected`)
- [x] Cooking/processing indicators: NPC idle/doing swap, per-building cooking item icon (DOM anchor formulas), ReadyRecipes/ReadyProcessed floating rows, ready `!` alert with shake, Bakery smoke, Smoothie Shack desk overlay, composter/crafting-box bars, greenhouse smoke + ready-plant row, aging-shed ready alert
- [x] Interior entry points: Hen House/Barn/Greenhouse/Pet House routes + Town Center/House/Manor/Mansion via `getHomeRoute` (wired; routes themselves not browser-tested offline)
- Fixture: `STATIC_OFFLINE_FARM` buildings = INITIAL trio + cooking Fire Pit + constructing Kitchen + running Compost Bin
- _Deferred: NPC/smoke gifs render first frame only (need spritesheets); crop-machine stage sheets (idle art always) + ready-crop row; hen-house/barn hungry/sick/love alert rows; tent bumpkin; house/manor/mansion/town-center extras (DailyReward, HomeBumpkins, LetterBox, collect heart); fish-market idle Neville (composed bumpkin — characters phase); visiting help discs; hover bumpkin-level tooltip; market crop-shortage/special-event labels over the shop; water well auto-open constructing modal on upgrade edge_

## Phase 6 — Collectibles (breadth via registry) ✅ core (2026-08-27)

Reference: `src/features/island/collectibles/Collectible.tsx` + 369 components in `collectibles/components/` + ~330 inline entries in `CollectibleCollection.tsx`.

Architecture: one `entities/collectibles/CollectibleRenderer.ts` over `game.collectibles`, driven by the GENERATED `staticCollectibles.ts` table (535 entries: width/bottom/left/right/centeredIn/shadow per item; `art` omitted where the placed art is byte-identical to `ITEM_DETAILS[name].image` — 504 items — with 31 explicit imports for trophy/case variants). The table was produced by extraction scripts now preserved in `docs/phaser-farm-migration/scripts/` (re-run `extract-collectibles.js` → `extract-inline.js` → `crosscheck.js` → `gen-static-table.js` when the DOM components change). Template pieces (`TemplateCollectible` + `DECORATION_TEMPLATES`) and un-tabled specials fall back to ITEM_DETAILS art at natural width, bottom-centred; `PlaceableFlower` widths use the DOM's name-pattern rule. Browser-verified: Basic Bear, 3-Fence autotiled run (end caps), stacked Blue Tiles (connected art), Rug in the low depth band, Red Carnation, constructing Scarecrow (50% alpha + bar).

- [x] Audit: marker-based classification of all components — ~535 static (incl. 24 animated-gif statics), 4 true spritesheet, ~25 state-reading/interactive
- [x] Static renderer — metadata-driven, zero per-item code; `flipped` → `setFlipX`; shadow underlays; in-progress = 50% alpha + centred bar + speed-up modal (`collectibleConstructing` → `Building` panel from Collectible.tsx, `collectible.spedUp`)
- [x] Sheet support — declarative config; Squirrel Monkey loops (26×32, 12fps, 9 steps)
- [x] Fence autotiling — reuses the DOM's exported `getFenceImage`/`getStoneFenceImage`/golden variants over `getGameGrid` (crops + collectibles)
- [x] Tiles via `getTileImage` (connected-below check); Dirt Path skipped (painted by `DirtLayer`)
- [x] Depth parity: tiles lowest band, rugs/furniture (`NON_COLLIDING_OBJECTS`) next, everything else painter's `y`
- _Deferred: the ~25 stateful collectibles' behaviours (Time Warp Totem/Hourglass/Super Totem expiry art + renew/burn, Genie Lamp / Maneki Neko / Festive Tree reveals, Monument/Project cheer flows, Beds, Salt Sculpture levels, Obsidian Shrine, Bush + Winds-of-Change season variants, weather-protection `used` alerts) — all render their static art; Wicker Man / Tomato Bombard / Rock Golem triggered sheets; SFT detail click popovers (marketplace floor/supply panel); ScarecrowAOEOverlay (landscaping-only); 24 gif statics animate as first frame_

## Phase 7 — Characters & dynamic entities ✅ core (2026-08-27)

Renderers in `entities/characters/`: `PlayerRenderer` (placed bumpkin + farm hands via `NPCSprite`'s animation-service idle sheets; click zones are 16×32 tile boxes, NOT the 96px sheet frame — sprite-level hit areas swallowed neighbours' clicks), `PetRenderer` (NFT pets from `state.pets.nfts` — CDN 44×44 sheets idle 0-8 @8fps, sleeping webp when napping/neglected/type-fed, egg pre-reveal — AND placed common pets, whose placement is a collectible entry but whose logic lives here; `CollectibleRenderer` skips pet names; `PETS_STYLES` raw offsets exported from petShared), `BudRenderer` (CDN webp per token id, shadow + 32-wide art at (-8,-16), Retreat nudge), `AirdropRenderer` (chest bulge tween + floating alert). Modal hosts in `overlay/CharacterModals.tsx` reuse `BumpkinModal` (feed tab), `BumpkinEquip` (farm hand, dispatches `farmHand.equipped`), `PetModal`, `AirdropModal` (owns `airdrop.claimed`). Browser-verified: both bumpkins idle-animating, Barkley placed, airdrop alert, bumpkin click → BumpkinModal (Feed/Equip/Skills/Info), farm hand click → equip modal, Barkley click → PetModal (energy/level/feed/fetch).

- [x] Placed Bumpkin — NPCSprite composition, flipped, click → BumpkinModal
- [x] Farm hands — same pipeline, click → equip modal
- [x] Buds — `location === "farm"` filter, CDN art (animated webp = first frame in Phaser)
- [x] Pet NFTs (2×2, idle sheet anim + asleep/egg states, per-type alert icon positions) + common pets (PETS_STYLES offsets, happy/asleep art, `pet.pet`/`pet.neglected` clicks)
- [x] Airdrops — bulge + float animations, click → ClaimReward modal via bridge (coordinate-less airdrops stay with Game.tsx's AirdropPopup)
- [x] Depth: all use painter's `ENTITY_BASE + y` band
- _Deferred: aura back/front layers (20×19 8-frame 14fps); tutorial click helpers; visiting flows (player modal, pet help discs); bud click popover (buffs + marketplace details); ±XP floats on pet/neglect; PlayerModal/Discovery global singletons; the DOM's 0.78 src px bumpkin-vs-farmhand vertical delta; NFT pet walking anim_

## Phase 8 — Landscaping mode ✅ core (2026-08-27)

References: `placeable/landscapingMachine.ts` (unchanged), `placeable/Placeable.tsx`, `collectibles/MovableComponent.tsx`, `landscaping/LandscapingGrid.tsx`.

Architecture: `landscaping/LandscapingController.ts` drives the UNCHANGED landscapingMachine — it renders the mode chrome + ghost + selection tint in-scene, converts pointer/keyboard input to grid coordinates via camera math (replacing every DOM measurement), and sends the machine the DOM's exact events. The React `LandscapingHud` (chest, quick panel, PlaceableController confirm/cancel, removal-mode buttons, 60s autosave) mounts unmodified from FarmPhaser (`isLandscaping ? <LandscapingHud/> : <Hud/>`). Existing-item moves commit straight to gameService with `getMoveAction` payloads (now exported), collision always via imported `detectCollision` over `removePlaceable`-stripped state. `farmCamera.panSuspended` stops pan-fighting during drags; `makeClickable` is inert while `scene.landscapingActive` (the DOM's READONLY swap). Browser-verified end-to-end: hammer → dim + tile-aligned grid + landscaping HUD; chest → Letter A Tile → ghost seeded at camera centre → arrow-nudged with per-cell collision (red on crops/gold rock/constructing scarecrow footprints — all correct) → Enter placed it at (3,3) → exit; select Basic Bear → tint + disc row → arrow-move committed `collectible.moved` → shovel → confirm → bear removed.

- [x] `LandscapingController` — enter/leave, 42px-aligned grid (red in removal mode), black dim, chrome teardown
- [x] Ghost placement — camera-centre seed, drag + arrow/WASD nudge, `p` pixel-perfect (1/16-tile fractional coordinates), per-move `detectCollision` → `UPDATE`, green/red tint, DRAG/DROP; confirm/cancel/Enter/Escape stay with the React PlaceableController
- [x] Multi-place flow — machine + PlaceableController handle `nextOrigin` re-seeding (origin-aware ghost)
- [x] Move — hit-test over ALL placements (buildings/collectibles/resources/buds/pets/farm hands/bumpkin, frontmost-by-y), `MOVE` select, drag or arrow nudge → `getMoveAction` dispatch with the DOM's exact payload shapes (resources omit name+location, NFTs use `nft`, oX/oY preserved), `BLUR` on outside click
- [x] Removal mode: `TOGGLE_REMOVAL_MODE` grid tint + one-click `REMOVE` via `getRemoveAction`; `REMOVE_ALL` via the HUD's existing two-step button
- [x] Flip/remove disc row — anchored React overlay (`overlay/LandscapingUI.tsx`) at the selection anchor, two-step remove, flip for collectibles/FarmHand/Bumpkin
- [x] Collision parity: imported `detectCollision` + `removePlaceable` — zero re-implementation
- [x] `LandscapingHud` unmodified over the canvas (chest/shop/layouts/cancel column all live)
- _Deferred: ghost art for resources uses ITEM_DETAILS approximation (not READONLY_RESOURCE_COMPONENTS); moving items shows only the tint until drop (no drag-preview art); pixel-perfect oX/oY editing for EXISTING items (nudge arrows disc); overlap disambiguation menu; Kuebiko/Hungry-Caterpillar removal warnings; mobile long-press/tap-to-arm; quick panel's drag-to-place (its GenesisBlock grid math no-ops on canvas — plain click place works); hiding Fisherman/water traps/salt/upcoming-expansion during landscaping; saved-layouts browser verification_

## Phase 9 — Visiting mode ✅ core (2026-08-27, code-complete; live-API browser pass pending)

Key inversion (gameMachine loadLandToVisit): while visiting, `context.state` = the VISITED farm (renders as-is through the same renderers), `context.visitorState` = your own farm, `isVisiting = context.visitorId !== undefined`. The engine adds `scene.visitingActive` (subscription in FarmScene) and `makeClickable`'s `visitClickable` opt-in — everything is click-dead on a visit except the DOM's `enableOnVisitClick` set.

- [x] `/visit/:id` route flag-forks to `<FarmPhaser key="visit"/>`; FarmPhaser renders `VisitingHud` when visiting (third HUD branch)
- [x] Click gating parity: opt-ins = collectibles (all), pets (common + NFT), clutter, home-set buildings (Town Center/Tent/House/Manor/Mansion/Pet House); everything else inert
- [x] `ClutterRenderer` — trash/dung/weed + pests (10px art, pests below garbage above ALWAYS_ON_TOP), hidden once `hasHelpedPlayerToday`; click → `garbage.collected {id, totalHelpedToday}` (local-only; loot lands in the VISITOR's inventory) → `FarmHelped` modal on `isHelpComplete`
- [x] Help flows: pets → `pet.visitingPets` (help disc drawn while `!visitedAt`); monuments/projects → `project.helped` (names in `REQUIRED_CHEERS`, skip if `helpedAt`); Pet House → `pet.helpAllPetsInHouse` when tasks pending, else navigate `/visit/:id/pet-house`; home buildings navigate `getHomeRoute({isVisiting: true})`
- [x] `farmHelped` FarmModalName → the DOM's `FarmHelped` (its OK button owns the `farm.helped` effect that persists the help server-side)
- [x] Local-only exclusion verified in gameMachine (LOCAL_VISITING_EVENTS filtered from the actions queue at :436-439) — machine untouched
- _Deferred: live-API browser verification (offline ART_MODE has no /visit endpoint); clutter sparkle overlay (gif); monument cheer-progress bars + help.webp pulse icon; VisitorGuide auto-open verification; camera sessionStorage is shared between own/visited farm (scroll carries over); cheering (`farm.cheered` is HUD/social-UI territory, works via VisitingHud)_

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
