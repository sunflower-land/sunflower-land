import { SUNNYSIDE } from "assets/sunnyside";
import { getAOEExtent } from "features/game/expansion/placeable/lib/collisionDetection";
import Phaser from "phaser";
import type { MachineState } from "features/game/lib/gameMachine";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";
import { setClientToGridOverride } from "features/game/expansion/lib/gridPointer";
import { removePlaceable } from "features/island/collectibles/lib/placing";
import {
  getMoveAction,
  getRemoveAction,
  RESOURCE_MOVE_EVENTS,
} from "features/island/collectibles/MovableComponent";
import type { GameState } from "features/game/types/game";
import type { LandscapingPlaceable } from "features/game/expansion/placeable/landscapingMachine";
import {
  BUILDINGS_DIMENSIONS,
  type BuildingName,
} from "features/game/types/buildings";
import {
  ANIMAL_DIMENSIONS,
  COLLECTIBLES_DIMENSIONS,
  type CollectibleName,
} from "features/game/types/craftables";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import { ITEM_DETAILS } from "features/game/types/images";
import { getCurrentBiome } from "features/island/biomes/biomes";
import type { GameBridge } from "../bridge/GameBridge";
import type { Unsubscribe } from "../bridge/subscriptions";
import { runLoader } from "../core/assets";
import { nativeScale } from "../core/pixelArt";
import { artTexture, queueArt } from "../core/animated";
import { readonlyResourceArt } from "./readonlyResourceArt";
import { collectiblesAt } from "../entities/collectibles/CollectibleRenderer";
import type { PlaceableLocation } from "features/game/types/collectibles";
import { isPlacementSurface } from "../core/surface";
import {
  getGameboardWorldBounds,
  gridRectToWorld,
  WORLD_TILE,
} from "../core/coordinates";
import { DEPTHS } from "../core/depths";
import { DPR } from "../core/rendering";
import type { FarmScene } from "../scenes/FarmScene";
import {
  BUILDING_BASE_ART,
  type BuildingArtContext,
} from "../entities/buildings/buildingArt";
import { STATIC_COLLECTIBLES } from "../entities/collectibles/staticCollectibles";

/**
 * Landscaping (edit) mode [Land.tsx landscaping branches + Placeable.tsx].
 * Drives the UNCHANGED landscapingMachine: this controller only renders the
 * dim + grid overlays and the placement ghost, converts pointer/keyboard
 * input to grid coordinates, and sends the machine the exact events the DOM
 * sends (UPDATE/DRAG/DROP — confirm/cancel stay with the React
 * PlaceableController in LandscapingHud).
 *
 * Phase 8a scope: mode chrome + ghost placement. Selecting/moving existing
 * items (MOVE/BLUR/FLIP/REMOVE, pixel-perfect, overlap menu) is 8b.
 */

const GRID_LINE_DEFAULT = 0xffffff;
const GRID_LINE_DEFAULT_ALPHA = 0.17;
const GRID_LINE_REMOVAL = 0xdc2626;
const GRID_LINE_REMOVAL_ALPHA = 0.55;

const GHOST_OK = 0x00ff00;
const GHOST_BAD = 0xff0000;

type LandscapingSnapshot = {
  active: boolean;
  removalMode: boolean;
  placeableName?: string;
  placeableId?: string;
  coordinates: Coordinates;
  collisionDetected: boolean;
  origin?: Coordinates;
  moving?: { id: string; name: string };
};

/** One movable placed thing [MovableComponent wrappers]. */
type Placement = {
  name: LandscapingPlaceable;
  id: string;
  coordinates: { x: number; y: number; oX?: number; oY?: number };
  dims: { width: number; height: number };
};

const SELECTION_ANCHOR = "landscaping-selected";

const placeableDimensions = (name: string) => {
  if (name === "Bud" || name === "FarmHand" || name === "Bumpkin") {
    return { width: 1, height: 1 };
  }
  if (name === "Pet") return { width: 2, height: 2 };
  return (
    {
      ...BUILDINGS_DIMENSIONS,
      ...COLLECTIBLES_DIMENSIONS,
      ...ANIMAL_DIMENSIONS,
      ...RESOURCE_DIMENSIONS,
    }[name as BuildingName] ?? { width: 1, height: 1 }
  );
};

export class LandscapingController {
  private subscriptions: Unsubscribe[] = [];
  private pollTimer: Phaser.Time.TimerEvent | undefined;

  private dim: Phaser.GameObjects.Rectangle | undefined;
  private grid: Phaser.GameObjects.Graphics | undefined;
  private aoeOverlays: Phaser.GameObjects.GameObject[] = [];
  private gridRemoval = false;

  private ghost:
    | {
        tint: Phaser.GameObjects.Rectangle;
        art?: Phaser.GameObjects.Image;
        /** DOM offsets for the art inside the tile box [Resource.tsx]. */
        artOffset?: {
          left?: number;
          right?: number;
          top?: number;
          bottom?: number;
        };
        name: string;
        dragging: boolean;
        pixelPerfect: boolean;
        /** Ghost needs an initial camera-centre seed once per placeable. */
        seeded: boolean;
      }
    | undefined;

  private selection:
    | {
        placement: Placement;
        tint: Phaser.GameObjects.Rectangle;
        /** Drag-preview art following the target cell. */
        art?: Phaser.GameObjects.Image;
        artOffset?: {
          left?: number;
          right?: number;
          top?: number;
          bottom?: number;
        };
        /** [MovableComponent] pixel-perfect nudge mode ("p"), ±8 src px. */
        pixelPerfect: boolean;
        pixelDelta: { x: number; y: number };
        dragging: boolean;
        dragStart: { worldX: number; worldY: number };
        target: { x: number; y: number };
        colliding: boolean;
      }
    | undefined;

  private last: LandscapingSnapshot = {
    active: false,
    removalMode: false,
    coordinates: { x: 0, y: 0 },
    collisionDetected: true,
  };

  private detachInput: (() => void) | undefined;

  constructor(
    private readonly scene: FarmScene,
    private readonly bridge: GameBridge,
  ) {}

  mount() {
    // The child machine isn't reachable through the parent's selector-diff
    // plumbing (its context mutates without parent snapshots changing), so
    // poll it on a short timer — the DOM does the equivalent with
    // useSyncExternalStore over the child [LandscapingGrid.tsx].
    this.pollTimer = this.scene.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => this.refresh(),
    });

    this.attachInput();
    this.refresh();
  }

  private snapshot(): LandscapingSnapshot {
    const machine = this.bridge.select((state: MachineState) => state);
    const active = machine.matches("landscaping");
    const child = this.bridge.landscaping.get();
    const context = child?.getSnapshot()?.context;
    return {
      active,
      removalMode: !!context?.removalMode,
      placeableName: context?.placeable?.name,
      placeableId: context?.placeable?.id,
      coordinates: context?.coordinates ?? { x: 0, y: 0 },
      collisionDetected: context?.collisionDetected ?? true,
      origin: context?.origin,
      moving: context?.moving,
    };
  }

  private refresh() {
    const snapshot = this.snapshot();
    const previous = this.last;
    this.last = snapshot;

    if (snapshot.active !== previous.active) {
      this.scene.landscapingActive = snapshot.active;
      if (snapshot.active) {
        this.showChrome();
        // Camera-based grid conversion for the React quick panel.
        setClientToGridOverride((clientX, clientY) => {
          const world = this.scene.cameras.main.getWorldPoint(
            clientX * DPR,
            clientY * DPR,
          );
          return {
            gridX: Math.round(world.x / WORLD_TILE - 0.5),
            gridY: Math.round(-world.y / WORLD_TILE + 0.5),
          };
        });
      } else {
        setClientToGridOverride(undefined);
        this.hideChrome();
      }
    }
    if (
      snapshot.active &&
      snapshot.removalMode !== previous.removalMode &&
      this.grid
    ) {
      this.drawGrid(snapshot.removalMode);
    }

    // Selection lifecycle [MovableComponent]: clear visuals when the
    // machine's moving item changes or landscaping exits.
    if (
      this.selection &&
      (!snapshot.active ||
        snapshot.moving?.id !== this.selection.placement.id ||
        snapshot.moving?.name !== this.selection.placement.name)
    ) {
      this.clearSelection();
    }

    // Ghost lifecycle.
    if (!snapshot.active || !snapshot.placeableName) {
      this.destroyGhost();
      return;
    }
    if (
      !this.ghost ||
      this.ghost.name !== snapshot.placeableName ||
      previous.placeableId !== snapshot.placeableId
    ) {
      void this.createGhost(snapshot);
      return;
    }
    this.positionGhost(snapshot);
  }

  // ----- mode chrome -------------------------------------------------------

  private showChrome() {
    const bounds = getGameboardWorldBounds(
      this.bridge.select(
        (state) => state.context.state.inventory["Basic Land"]?.toNumber() ?? 3,
      ),
    );

    // [Land.tsx:1336] black dim — the DOM's overlay sits at -z-10, i.e. it
    // dims the ground but NOT the placed entities, so it lives below the
    // entity band here (entities span roughly ±1500 around ENTITY_BASE).
    this.dim = this.scene.add
      .rectangle(
        bounds.x - 1000,
        bounds.y - 1000,
        bounds.width + 2000,
        bounds.height + 2000,
        0x000000,
        0.4,
      )
      .setOrigin(0, 0)
      .setDepth(DEPTHS.ENTITY_BASE - 3000);

    this.grid = this.scene.add.graphics().setDepth(DEPTHS.ALWAYS_ON_TOP + 101);
    this.drawGrid(this.last.removalMode);
    this.drawAoeOverlays();
  }

  /**
   * [CollectibleCollection.tsx ScarecrowAOEOverlay] pulsing blue AOE boxes
   * under the three scarecrow-type placeables while landscaping — the same
   * getAOEExtent the gameplay gate uses, so the drawn area can't drift.
   */
  private drawAoeOverlays() {
    this.aoeOverlays.forEach((object) => object.destroy());
    this.aoeOverlays = [];
    const game = this.bridge.select((state) => state.context.state);
    const skills = game.bumpkin?.skills ?? {};
    const AOE_NAMES = [
      "Basic Scarecrow",
      "Scary Mike",
      "Laurie the Chuckle Crow",
    ] as const;
    for (const name of AOE_NAMES) {
      for (const item of game.collectibles[name] ?? []) {
        if (!item.coordinates) continue;
        const extent = getAOEExtent(name, skills);
        const left = (item.coordinates.x - extent.xLeft) * WORLD_TILE;
        const top = -(item.coordinates.y - 1) * WORLD_TILE;
        const width = (extent.xLeft + extent.xRight + 1) * WORLD_TILE;
        const height = extent.depth * WORLD_TILE;
        const rect = this.scene.add
          .rectangle(left, top, width, height, 0x93c5fd, 0.5)
          .setOrigin(0, 0)
          .setDepth(DEPTHS.ALWAYS_ON_TOP + 100);
        this.aoeOverlays.push(rect);
        if (this.scene.textures.exists(SUNNYSIDE.icons.lightning)) {
          const icon = this.scene.add
            .image(
              left + width / 2,
              top + height / 2,
              SUNNYSIDE.icons.lightning,
            )
            .setAlpha(0.5)
            .setDepth(DEPTHS.ALWAYS_ON_TOP + 100.5);
          nativeScale(icon, 10);
          this.aoeOverlays.push(icon);
        }
      }
    }
  }

  private drawGrid(removal: boolean) {
    if (!this.grid) return;
    this.gridRemoval = removal;
    const bounds = getGameboardWorldBounds(
      this.bridge.select(
        (state) => state.context.state.inventory["Basic Land"]?.toNumber() ?? 3,
      ),
    );
    this.grid.clear();
    this.grid.lineStyle(
      1 / 2.625,
      removal ? GRID_LINE_REMOVAL : GRID_LINE_DEFAULT,
      removal ? GRID_LINE_REMOVAL_ALPHA : GRID_LINE_DEFAULT_ALPHA,
    );
    // Lines on tile boundaries (tile edges land on multiples of 16).
    for (let x = bounds.x; x <= bounds.x + bounds.width; x += WORLD_TILE) {
      this.grid.lineBetween(x, bounds.y, x, bounds.y + bounds.height);
    }
    for (let y = bounds.y; y <= bounds.y + bounds.height; y += WORLD_TILE) {
      this.grid.lineBetween(bounds.x, y, bounds.x + bounds.width, y);
    }
  }

  private hideChrome() {
    this.aoeOverlays.forEach((object) => object.destroy());
    this.aoeOverlays = [];
    this.dim?.destroy();
    this.dim = undefined;
    this.grid?.destroy();
    this.grid = undefined;
    this.destroyGhost();
  }

  // ----- ghost -------------------------------------------------------------

  private ghostArt(name: string): {
    texture: string;
    width: number;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  } | null {
    const game = this.bridge.select((state) => state.context.state);

    // Resources use the DOM's READONLY art + offsets [Resource.tsx].
    const resourceArt = readonlyResourceArt(name, game, game.season.season);
    if (resourceArt) return resourceArt;
    const buildingArt = BUILDING_BASE_ART[name as BuildingName];
    if (buildingArt) {
      const ctx: BuildingArtContext = {
        biome: getCurrentBiome(game.island),
        season: game.season.season,
        henHouseLevel: game.henHouse.level,
        barnLevel: game.barn.level,
        waterWellLevel: game.waterWell.level,
        petHouseLevel: game.petHouse.level ?? 1,
        agingShedLevel: game.agingShed.level,
      };
      const art = buildingArt(ctx);
      return { texture: art.texture, width: art.width };
    }
    const staticSpec = STATIC_COLLECTIBLES[name as CollectibleName];
    if (staticSpec) {
      return {
        texture: staticSpec.art ?? ITEM_DETAILS[name as CollectibleName].image,
        width: staticSpec.width,
      };
    }
    const details = ITEM_DETAILS[name as CollectibleName];
    if (details?.image) {
      const dims = placeableDimensions(name);
      return { texture: details.image, width: dims.width * WORLD_TILE };
    }
    return null;
  }

  private async createGhost(snapshot: LandscapingSnapshot) {
    this.destroyGhost();
    const name = snapshot.placeableName!;
    const dims = placeableDimensions(name);

    const tint = this.scene.add
      .rectangle(
        0,
        0,
        dims.width * WORLD_TILE,
        dims.height * WORLD_TILE,
        GHOST_OK,
        0.5,
      )
      .setOrigin(0, 0)
      .setDepth(DEPTHS.ALWAYS_ON_TOP + 102);

    this.ghost = {
      tint,
      name,
      dragging: false,
      pixelPerfect: false,
      seeded: false,
    };

    const art = this.ghostArt(name);
    if (art) {
      queueArt(this.scene, art.texture);
      await runLoader(this.scene);
      // Animated art loads as a strip — the ghost is a still preview, so it
      // shows frame 0 (a spritesheet's base texture is the whole strip).
      const ghostTexture = artTexture(art.texture);
      // The placeable may have changed while the loader ran.
      if (
        this.ghost?.name !== name ||
        !this.scene.textures.exists(ghostTexture)
      )
        return;
      const image = this.scene.add
        .image(0, 0, ghostTexture, 0)
        .setOrigin(0, 1)
        .setDepth(DEPTHS.ALWAYS_ON_TOP + 103)
        .setAlpha(0.9);
      image.setScale(art.width / image.width);
      this.ghost.art = image;
      this.ghost.artOffset = {
        left: art.left,
        right: art.right,
        top: art.top,
        bottom: art.bottom,
      };
    }

    // Seed the ghost at the camera-centre grid cell [Placeable.tsx initial
    // position]; a multi-place origin means the machine already re-seeded,
    // and a quick-panel drag is already streaming its own UPDATEs.
    const current = this.snapshot();
    const child = this.bridge.landscaping.get();
    const draggingAlready = !!child
      ?.getSnapshot()
      ?.matches({ editing: "dragging" });
    if (!current.origin && !draggingAlready) {
      const camera = this.scene.cameras.main;
      const midX = camera.scrollX + camera.width / 2;
      const midY = camera.scrollY + camera.height / 2;
      this.sendUpdate(
        Math.round(midX / WORLD_TILE),
        Math.round(-midY / WORLD_TILE),
      );
    }
    if (this.ghost) this.ghost.seeded = true;
    this.positionGhost(this.snapshot());
  }

  private positionGhost(snapshot: LandscapingSnapshot) {
    if (!this.ghost) return;
    const { coordinates, collisionDetected } = snapshot;
    const dims = placeableDimensions(this.ghost.name);
    const worldX = coordinates.x * WORLD_TILE;
    const worldY = -coordinates.y * WORLD_TILE;

    this.ghost.tint.setPosition(worldX, worldY);
    this.ghost.tint.setFillStyle(collisionDetected ? GHOST_BAD : GHOST_OK, 0.5);
    if (this.ghost.art) {
      this.positionArt(
        this.ghost.art,
        {
          x: worldX,
          y: worldY,
          width: dims.width * WORLD_TILE,
          height: dims.height * WORLD_TILE,
        },
        this.ghost.artOffset,
      );
    }
  }

  /**
   * Place bottom-left-anchored art inside a tile box using the DOM's
   * left/right/top/bottom offsets [Resource.tsx READONLY components].
   */
  private positionArt(
    image: Phaser.GameObjects.Image,
    box: { x: number; y: number; width: number; height: number },
    offset?: { left?: number; right?: number; top?: number; bottom?: number },
  ) {
    const artWidth = image.displayWidth;
    const artHeight = image.displayHeight;
    const x =
      offset?.right !== undefined
        ? box.x + box.width - offset.right - artWidth
        : box.x + (offset?.left ?? 0);
    // `top` measures the art's TOP down from the box top; the sprite is
    // bottom-anchored, so convert through its height.
    const bottomEdge =
      offset?.top !== undefined
        ? box.y + offset.top + artHeight
        : box.y + box.height - (offset?.bottom ?? 0);
    image.setPosition(x, bottomEdge);
  }

  // ----- input -------------------------------------------------------------

  private attachInput() {
    const input = this.scene.input;

    const onPointerDown = (pointer: Phaser.Input.Pointer) => {
      if (this.last.active && !this.ghost) {
        this.onEditPointerDown(pointer);
        return;
      }
      if (!this.ghost) return;
      const dims = placeableDimensions(this.ghost.name);
      const { coordinates } = this.last;
      const worldX = coordinates.x * WORLD_TILE;
      const worldY = -coordinates.y * WORLD_TILE;
      const inside =
        pointer.worldX >= worldX - WORLD_TILE &&
        pointer.worldX <= worldX + (dims.width + 1) * WORLD_TILE &&
        pointer.worldY >= worldY - WORLD_TILE &&
        pointer.worldY <= worldY + (dims.height + 1) * WORLD_TILE;
      if (!inside) return;
      this.ghost.dragging = true;
      this.scene.farmCamera.panSuspended = true;
      this.scene.input.setDefaultCursor("grabbing");
      this.bridge.landscaping.send({ type: "DRAG" });
    };

    const onPointerMove = (pointer: Phaser.Input.Pointer) => {
      if (this.selection?.dragging && pointer.isDown) {
        this.onSelectionDrag(pointer);
        return;
      }
      if (!this.ghost?.dragging || !pointer.isDown) return;
      const dims = placeableDimensions(this.ghost.name);
      // Centre the footprint under the pointer [react-draggable feel].
      // Grid y is flipped: the box TOP is world -y*16, so centring needs +h/2.
      const rawX = pointer.worldX / WORLD_TILE - dims.width / 2;
      const rawY = -pointer.worldY / WORLD_TILE + dims.height / 2;
      if (this.ghost.pixelPerfect) {
        this.sendUpdate(Math.round(rawX * 16) / 16, Math.round(rawY * 16) / 16);
      } else {
        this.sendUpdate(Math.round(rawX), Math.round(rawY));
      }
    };

    const onPointerUp = () => {
      if (this.selection?.dragging) {
        this.scene.input.setDefaultCursor("default");
        this.onSelectionDrop();
        return;
      }
      if (!this.ghost?.dragging) return;
      this.ghost.dragging = false;
      this.scene.farmCamera.panSuspended = false;
      this.scene.input.setDefaultCursor("default");
      this.bridge.landscaping.send({ type: "DROP" });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!this.last.active) return;
      if (!this.ghost && this.selection) {
        this.onSelectionKey(event);
        return;
      }
      if (!this.ghost) return;
      const target = document.activeElement;
      if (target && target.tagName === "INPUT") return;

      if (event.key === "p") {
        this.ghost.pixelPerfect = !this.ghost.pixelPerfect;
        return;
      }
      const step = this.ghost.pixelPerfect ? 1 / 16 : 1;
      let dx = 0;
      let dy = 0;
      if (event.key === "ArrowUp" || event.key === "w") dy = step;
      else if (event.key === "ArrowDown" || event.key === "s") dy = -step;
      else if (event.key === "ArrowLeft" || event.key === "a") dx = -step;
      else if (event.key === "ArrowRight" || event.key === "d") dx = step;
      else return;
      event.preventDefault();
      const { coordinates } = this.last;
      this.sendUpdate(coordinates.x + dx, coordinates.y + dy);
    };

    input.on(Phaser.Input.Events.POINTER_DOWN, onPointerDown);
    input.on(Phaser.Input.Events.POINTER_MOVE, onPointerMove);
    input.on(Phaser.Input.Events.POINTER_UP, onPointerUp);
    window.addEventListener("keydown", onKeyDown);

    this.detachInput = () => {
      input.off(Phaser.Input.Events.POINTER_DOWN, onPointerDown);
      input.off(Phaser.Input.Events.POINTER_MOVE, onPointerMove);
      input.off(Phaser.Input.Events.POINTER_UP, onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }

  /** The surface being edited — the farm island or a home interior. */
  private get location(): PlaceableLocation {
    // Landscaping is only reachable on placement surfaces; the greenhouse and
    // animal houses have fixed furniture and never enter this controller.
    return isPlacementSurface(this.scene.location)
      ? this.scene.location
      : "farm";
  }

  /** Does a placement's `location` belong to the surface being edited? */
  private onThisSurface(location?: string): boolean {
    return this.location === "farm"
      ? !location || location === "farm"
      : location === this.location;
  }

  /** [Placeable.tsx detect()] collision check + UPDATE, exactly the DOM's. */
  private sendUpdate(x: number, y: number) {
    const name = this.ghost?.name;
    if (!name) return;
    const dims = placeableDimensions(name);
    const collisionDetected = detectCollision({
      state: this.bridge.select((state) => state.context.state),
      position: { x, y, width: dims.width, height: dims.height },
      location: this.location,
      name: name as CollectibleName,
    });
    this.bridge.landscaping.send({
      type: "UPDATE",
      coordinates: { x, y },
      collisionDetected,
    });
    // Rapid keypresses outrun the 100ms poll — keep the local snapshot
    // current so each nudge builds on the last, and move the ghost art in
    // the same frame instead of waiting for the next poll.
    this.last = { ...this.last, coordinates: { x, y }, collisionDetected };
    this.positionGhost(this.last);
  }

  // ----- existing-item select/move/remove [MovableComponent] ---------------

  /** All movable placements with their footprints, from game state. */
  private placements(game: GameState): Placement[] {
    const out: Placement[] = [];
    const push = (
      name: LandscapingPlaceable,
      id: string,
      coordinates:
        | { x: number; y: number; oX?: number; oY?: number }
        | undefined,
      dims: { width: number; height: number },
    ) => {
      if (coordinates) out.push({ name, id, coordinates, dims });
    };

    for (const [name, items] of Object.entries(game.buildings)) {
      (items ?? []).forEach((item) =>
        push(
          name as LandscapingPlaceable,
          item.id,
          item.coordinates,
          BUILDINGS_DIMENSIONS[name as BuildingName],
        ),
      );
    }
    for (const [name, items] of Object.entries(
      collectiblesAt(game, this.location),
    )) {
      if (name === "Dirt Path") {
        (items ?? []).forEach((item) =>
          push("Dirt Path", item.id, item.coordinates, { width: 1, height: 1 }),
        );
        continue;
      }
      (items ?? []).forEach((item) =>
        push(
          name as LandscapingPlaceable,
          item.id,
          item.coordinates,
          COLLECTIBLES_DIMENSIONS[name as CollectibleName],
        ),
      );
    }
    // Resources only exist on the farm island; interiors are collectibles,
    // buds, pets and bumpkins only.
    const resourceMaps: [
      string,
      Record<string, { x?: number; y?: number; name?: string }>,
    ][] = [
      ["Tree", game.trees],
      ["Stone Rock", game.stones],
      ["Iron Rock", game.iron],
      ["Gold Rock", game.gold],
      ["Crimstone Rock", game.crimstones],
      ["Sunstone Rock", game.sunstones],
      ["Oil Reserve", game.oilReserves],
      ["Lava Pit", game.lavaPits ?? {}],
      ["Beehive", game.beehives],
      ["Fruit Patch", game.fruitPatches],
      ["Crop Plot", game.crops],
      ["Flower Bed", game.flowers.flowerBeds],
      ["Ascension Crystal", game.ascensionCrystals ?? {}],
    ];
    for (const [fallbackName, map] of this.location === "farm"
      ? resourceMaps
      : []) {
      for (const [id, node] of Object.entries(map ?? {})) {
        if (node?.x === undefined || node?.y === undefined) continue;
        const name = (node.name ?? fallbackName) as LandscapingPlaceable;
        push(
          name,
          id,
          { x: node.x, y: node.y },
          RESOURCE_DIMENSIONS[
            (name in RESOURCE_DIMENSIONS
              ? name
              : fallbackName) as keyof typeof RESOURCE_DIMENSIONS
          ],
        );
      }
    }
    for (const [id, bud] of Object.entries(game.buds ?? {})) {
      if (this.onThisSurface(bud.location)) {
        push("Bud", id, bud.coordinates, { width: 1, height: 1 });
      }
    }
    for (const [id, pet] of Object.entries(game.pets?.nfts ?? {})) {
      if (this.onThisSurface(pet.location)) {
        push("Pet", id, pet.coordinates, { width: 2, height: 2 });
      }
    }
    for (const [id, hand] of Object.entries(game.farmHands.bumpkins ?? {})) {
      if (this.onThisSurface(hand.location)) {
        push("FarmHand", id, hand.coordinates, { width: 1, height: 1 });
      }
    }
    if (
      game.bumpkin?.coordinates &&
      this.onThisSurface(game.bumpkin.location)
    ) {
      push("Bumpkin", "main", game.bumpkin.coordinates, {
        width: 1,
        height: 1,
      });
    }
    return out;
  }

  private hitTest(worldX: number, worldY: number): Placement | undefined {
    const game = this.bridge.select((state) => state.context.state);
    const candidates = this.placements(game).filter((placement) => {
      const box = gridRectToWorld(placement.coordinates, placement.dims);
      // Bumpkins stand ABOVE their tile [NPCPlaceable] — grab the body too.
      const headroom =
        placement.name === "Bumpkin" || placement.name === "FarmHand" ? 16 : 0;
      return (
        worldX >= box.x &&
        worldX < box.x + box.width &&
        worldY >= box.y - headroom &&
        worldY < box.y + box.height
      );
    });
    // Frontmost wins, like the DOM's y-sorted stacking.
    return candidates.sort((a, b) => {
      const boxA = gridRectToWorld(a.coordinates, a.dims);
      const boxB = gridRectToWorld(b.coordinates, b.dims);
      return boxB.y + boxB.height - (boxA.y + boxA.height);
    })[0];
  }

  /** editing.idle click: removal shovel, drag-start on selection, or MOVE. */
  private onEditPointerDown(pointer: Phaser.Input.Pointer) {
    // Clicking inside the current selection starts a drag.
    if (this.selection) {
      const box = gridRectToWorld(
        this.selection.placement.coordinates,
        this.selection.placement.dims,
      );
      const inside =
        pointer.worldX >= box.x &&
        pointer.worldX < box.x + box.width &&
        pointer.worldY >= box.y &&
        pointer.worldY < box.y + box.height;
      if (inside) {
        this.selection.dragging = true;
        this.selection.dragStart = {
          worldX: pointer.worldX,
          worldY: pointer.worldY,
        };
        this.scene.farmCamera.panSuspended = true;
        this.scene.input.setDefaultCursor("grabbing");
        return;
      }
    }

    const hit = this.hitTest(pointer.worldX, pointer.worldY);
    if (!hit) {
      if (this.selection) this.bridge.landscaping.send({ type: "BLUR" });
      return;
    }

    if (this.last.removalMode) {
      // [MovableComponent removal mode] one click removes.
      const game = this.bridge.select((state) => state.context.state);
      const collectible = game.collectibles[hit.name as CollectibleName]?.find(
        (item) => item.id === hit.id,
      );
      const action = getRemoveAction(
        hit.name,
        Date.now(),
        collectible,
        this.location,
      );
      if (!action) return;
      // [MovableComponent] Kuebiko / Hungry Caterpillar removals carry a
      // gameplay side-effect warning — confirm via modal first.
      if (hit.name === "Kuebiko" || hit.name === "Hungry Caterpillar") {
        this.bridge.farmModal.open("removeWarning", {
          name: hit.name,
          id: hit.id,
          action,
        });
        return;
      }
      this.bridge.landscaping.send({
        type: "REMOVE",
        event: action,
        id: hit.id,
        name: hit.name,
        location: this.location,
      });
      return;
    }

    // [MovableComponent] several items on the same origin tile -> picker.
    const overlaps = this.placements(
      this.bridge.select((state) => state.context.state),
    ).filter(
      (placement) =>
        placement.coordinates.x === hit.coordinates.x &&
        placement.coordinates.y === hit.coordinates.y,
    );
    if (overlaps.length > 1) {
      const box = gridRectToWorld(hit.coordinates, hit.dims);
      this.bridge.anchors.setAnchor("landscaping-overlap", box);
      // Deferred past this pointerdown (outside-click closer gotcha).
      setTimeout(
        () =>
          this.bridge.overlapMenu.set({
            anchorId: "landscaping-overlap",
            choices: overlaps.map((placement) => ({
              id: placement.id,
              name: placement.name,
            })),
          }),
        0,
      );
      return;
    }

    this.bridge.landscaping.send({ type: "MOVE", name: hit.name, id: hit.id });
    this.select(hit);
    // The DOM starts the drag in the same mousedown that selects — arm it so
    // the first gesture moves the item instead of only selecting it.
    if (this.selection) {
      this.selection.dragging = true;
      this.selection.dragStart = {
        worldX: pointer.worldX,
        worldY: pointer.worldY,
      };
      this.scene.farmCamera.panSuspended = true;
      this.scene.input.setDefaultCursor("grabbing");
    }
  }

  private select(placement: Placement) {
    this.clearSelection();
    const box = gridRectToWorld(placement.coordinates, placement.dims);
    const tint = this.scene.add
      .rectangle(box.x, box.y, box.width, box.height, GHOST_OK, 0.5)
      .setOrigin(0, 0)
      .setDepth(DEPTHS.ALWAYS_ON_TOP + 102);
    this.selection = {
      placement,
      tint,
      pixelPerfect: false,
      pixelDelta: { x: 0, y: 0 },
      dragging: false,
      dragStart: { worldX: 0, worldY: 0 },
      target: { x: placement.coordinates.x, y: placement.coordinates.y },
      colliding: false,
    };
    this.bridge.anchors.setAnchor(SELECTION_ANCHOR, box);
    this.bridge.landscapingMoving.set({
      id: placement.id,
      name: placement.name,
    });
    this.publishControls();

    // Drag-preview art so the move shows the item, not just the tint
    // (ITEM_DETAILS approximation, like the placement ghost).
    const artSpec = this.ghostArt(placement.name);
    const previewTexture = artSpec && artTexture(artSpec.texture);
    if (
      artSpec &&
      previewTexture &&
      this.scene.textures.exists(previewTexture)
    ) {
      const image = this.scene.add
        .image(box.x, box.y + box.height, previewTexture, 0)
        .setOrigin(0, 1)
        .setDepth(DEPTHS.ALWAYS_ON_TOP + 103)
        .setAlpha(0.9);
      image.setScale(artSpec.width / image.width);
      this.positionArt(image, box, {
        left: artSpec.left,
        right: artSpec.right,
        top: artSpec.top,
        bottom: artSpec.bottom,
      });
      this.selection.art = image;
      this.selection.artOffset = {
        left: artSpec.left,
        right: artSpec.right,
        top: artSpec.top,
        bottom: artSpec.bottom,
      };
    }
  }

  private moveTarget(dxTiles: number, dyTiles: number) {
    if (!this.selection) return;
    const { placement } = this.selection;
    const x = placement.coordinates.x + dxTiles;
    const y = placement.coordinates.y + dyTiles;
    const game = this.bridge.select((state) => state.context.state);
    const colliding = detectCollision({
      state: removePlaceable({
        state: game,
        id: placement.id,
        name: placement.name,
      }),
      position: { x, y, ...placement.dims },
      location: this.location,
      name: placement.name as CollectibleName,
    });
    this.selection.target = { x, y };
    this.selection.colliding = colliding;
    const box = gridRectToWorld({ x, y }, placement.dims);
    const offsetX = this.selection.pixelDelta.x;
    const offsetY = this.selection.pixelDelta.y;
    this.selection.tint.setPosition(box.x + offsetX, box.y - offsetY);
    this.selection.tint.setFillStyle(colliding ? GHOST_BAD : GHOST_OK, 0.5);
    if (this.selection.art) {
      this.positionArt(
        this.selection.art,
        {
          x: box.x + offsetX,
          y: box.y - offsetY,
          width: box.width,
          height: box.height,
        },
        this.selection.artOffset,
      );
    }
    this.bridge.anchors.setAnchor(SELECTION_ANCHOR, box);
    this.bridge.landscapingMoving.set({
      id: placement.id,
      name: placement.name,
    });
    this.publishControls();
  }

  private onSelectionDrag(pointer: Phaser.Input.Pointer) {
    if (!this.selection) return;
    const dx = Math.round(
      (pointer.worldX - this.selection.dragStart.worldX) / WORLD_TILE,
    );
    const dy = -Math.round(
      (pointer.worldY - this.selection.dragStart.worldY) / WORLD_TILE,
    );
    this.moveTarget(dx, dy);
  }

  /** [MovableComponent onStop] commit the move directly to gameService. */
  private onSelectionDrop() {
    if (!this.selection) return;
    this.scene.farmCamera.panSuspended = false;
    this.selection.dragging = false;

    const { placement, target, colliding, pixelDelta } = this.selection;
    const nudged = pixelDelta.x !== 0 || pixelDelta.y !== 0;
    const moved =
      target.x !== placement.coordinates.x ||
      target.y !== placement.coordinates.y ||
      nudged;
    if (!moved) return;
    if (colliding) {
      // Snap the tint back to the saved position.
      this.moveTarget(0, 0);
      return;
    }

    const isResource = placement.name in RESOURCE_MOVE_EVENTS;
    const isNFT = placement.name === "Bud" || placement.name === "Pet";
    this.bridge.dispatch({
      type: getMoveAction(placement.name, this.location),
      ...(isResource
        ? {}
        : isNFT
          ? { nft: placement.name }
          : placement.name === "FarmHand" || placement.name === "Bumpkin"
            ? {}
            : { name: placement.name }),
      coordinates: isResource
        ? { x: target.x, y: target.y }
        : {
            x: target.x,
            y: target.y,
            oX: (placement.coordinates.oX ?? 0) + pixelDelta.x,
            oY: (placement.coordinates.oY ?? 0) + pixelDelta.y,
          },
      ...(placement.name === "Bumpkin" ? {} : { id: placement.id }),
      ...(isResource ? {} : { location: this.location }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // Track the new saved position locally so further nudges chain.
    placement.coordinates = {
      ...placement.coordinates,
      x: target.x,
      y: target.y,
      oX: (placement.coordinates.oX ?? 0) + pixelDelta.x,
      oY: (placement.coordinates.oY ?? 0) + pixelDelta.y,
    };
    this.selection.pixelDelta = { x: 0, y: 0 };
  }

  private onSelectionKey(event: KeyboardEvent) {
    const target = document.activeElement;
    if (target && target.tagName === "INPUT") return;
    if (!this.selection) return;

    // [MovableComponent] "p" toggles pixel-perfect nudging (±8 src px,
    // committed as oX/oY on the next drop).
    if (event.key === "p") {
      this.togglePixelPerfect();
      return;
    }

    let dx = 0;
    let dy = 0;
    if (event.key === "ArrowUp" || event.key === "w") dy = 1;
    else if (event.key === "ArrowDown" || event.key === "s") dy = -1;
    else if (event.key === "ArrowLeft" || event.key === "a") dx = -1;
    else if (event.key === "ArrowRight" || event.key === "d") dx = 1;
    else return;
    event.preventDefault();

    if (this.selection.pixelPerfect) {
      this.nudgePixel(dx, dy);
      return;
    }

    this.moveTarget(dx, dy);
    this.onSelectionDrop();
  }

  /** One source pixel, clamped to the DOM's +/-8 total [MovableComponent]. */
  private nudgePixel(dx: number, dy: number) {
    if (!this.selection) return;
    const { placement, pixelDelta } = this.selection;
    const savedOX = placement.coordinates.oX ?? 0;
    const savedOY = placement.coordinates.oY ?? 0;
    pixelDelta.x = Phaser.Math.Clamp(
      pixelDelta.x + dx,
      -8 - savedOX,
      8 - savedOX,
    );
    pixelDelta.y = Phaser.Math.Clamp(
      pixelDelta.y + dy,
      -8 - savedOY,
      8 - savedOY,
    );
    this.moveTarget(0, 0); // re-place visuals at the offset position
    this.onSelectionDrop();
    this.publishControls();
  }

  private togglePixelPerfect() {
    if (!this.selection) return;
    this.selection.pixelPerfect = !this.selection.pixelPerfect;
    this.publishControls();
  }

  /** Hand the React disc row a live view of the pixel-perfect state. */
  private publishControls() {
    if (!this.selection) {
      this.bridge.landscapingControls.set(null);
      return;
    }
    const { placement, pixelDelta, pixelPerfect } = this.selection;
    const savedOX = placement.coordinates.oX ?? 0;
    const savedOY = placement.coordinates.oY ?? 0;
    this.bridge.landscapingControls.set({
      pixelPerfect,
      togglePixelPerfect: () => this.togglePixelPerfect(),
      nudge: (dx, dy) => this.nudgePixel(dx, dy),
      canNudge: {
        // Game y is inverted: visually up is +y.
        up: pixelDelta.y + savedOY < 8,
        down: pixelDelta.y + savedOY > -8,
        left: pixelDelta.x + savedOX > -8,
        right: pixelDelta.x + savedOX < 8,
      },
    });
  }

  private clearSelection() {
    if (!this.selection) return;
    if (this.selection.dragging) {
      this.scene.farmCamera.panSuspended = false;
      this.scene.input.setDefaultCursor("default");
    }
    this.selection.tint.destroy();
    this.selection.art?.destroy();
    this.selection = undefined;
    this.bridge.landscapingMoving.set(null);
    this.bridge.landscapingControls.set(null);
    this.bridge.anchors.removeAnchor(SELECTION_ANCHOR);
  }

  private destroyGhost() {
    if (!this.ghost) return;
    if (this.ghost.dragging) this.scene.farmCamera.panSuspended = false;
    this.ghost.tint.destroy();
    this.ghost.art?.destroy();
    this.ghost = undefined;
  }

  destroy() {
    setClientToGridOverride(undefined);
    this.pollTimer?.remove();
    this.pollTimer = undefined;
    this.detachInput?.();
    this.detachInput = undefined;
    this.subscriptions.forEach((unsubscribe) => unsubscribe());
    this.subscriptions = [];
    this.clearSelection();
    this.hideChrome();
  }
}
