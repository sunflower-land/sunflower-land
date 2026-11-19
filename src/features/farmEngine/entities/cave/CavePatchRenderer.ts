import type Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import shopIcon from "assets/icons/shop.png";
import { translate } from "lib/i18n/translate";
import { getKeys } from "lib/object";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { MachineState } from "features/game/lib/gameMachine";
import type { Cave, CaveBatch } from "features/game/types/game";
import {
  caveTileKey,
  getCaveDrillSquare,
  isCavePatchCleared,
} from "features/game/types/caveRecipes";
import {
  getCavePatchComposition,
  getRevealedCaveTiles,
  isCaveSeed,
  resolveRevealedCaveTile,
  type ResolvedCaveTile,
} from "features/game/types/cavePatch";
import { BEETLES } from "features/game/types/beetles";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  CAVE_PATCH_SIZE,
  CAVE_SLOTS,
  caveSlotsForTier,
} from "features/game/expansion/placeable/lib/caveLayout";
import { getCaveBatchPercentage } from "features/cave/lib/caveBatchProgress";
import {
  CAVE_FEEDBACK_DISPLAY_MS,
  CAVE_FEEDBACK_FADE_MS,
  getCaveDigFeedback,
  type CaveDigFeedback,
} from "features/cave/lib/digFeedback";
import { LabelBadge, type LabelBadgeType } from "../../components/LabelBadge";
import { pixelText } from "../../components/pixelText";
import { ProgressBarSprite } from "../../components/ProgressBarSprite";
import { queueImage, runLoader } from "../../core/assets";
import { makeClickable } from "../../core/clickable";
import { WORLD_TILE } from "../../core/coordinates";
import { burst } from "../../core/juice";
import { fitWidth } from "../../core/pixelArt";
import { EntityRenderer } from "../EntityRenderer";
import { CAVE_DEPTHS, caveTileX, caveTileY } from "./caveGeometry";
import {
  caveTutorialSeen,
  createCaveHand,
  openCaveModal,
  readCaveGuide,
  readCaveShovelNeed,
  type CaveHand,
} from "./caveGuide";

/**
 * The Cave's 5x5 dig patches [cave/components/CavePatch.tsx], one per
 * unlocked slot: shaded with the batch's timer while it grows; once ready,
 * every buried tile is a sand hill dug with the Sand Shovel (one tile) or the
 * Sand Drill (a 2x2 square), and a dug tile shows what it held and its clue.
 * Under the patch sit its status labels; beside it, the shop shortcut when
 * the player has run out of digging tools [Cave.tsx].
 *
 * Digs dispatch the same `cave.dug` / `cave.drilled` events the DOM sends,
 * behind the same tool, board and already-dug checks its buttons carry.
 */

type Slice = {
  cave: Cave | undefined;
  shovels: number;
  drills: number;
  tilesDug: number;
};

type Tile = { x: number; y: number };

// [CavePatch.tsx] the same hover boxes the desert dig site uses: one tile for
// the shovel, 2x2 for the drill (served from public/world).
const SHOVEL_SELECT = "world/shovel_select_new.webp";
const DRILL_SELECT = "world/drill_select_new.webp";

const PATCH_PX = CAVE_PATCH_SIZE * WORLD_TILE;

/** CSS px -> source px. */
const css = (value: number) => value / PIXEL_SCALE;

type PatchObjects = {
  /** What is drawn: the batch (by reference) and its phase. */
  batch: CaveBatch | undefined;
  phase: "none" | "growing" | "ready";
  handTile: boolean;
  objects: Phaser.GameObjects.GameObject[];
  labels: LabelBadge[];
  bar?: ProgressBarSprite;
  zone?: Phaser.GameObjects.Zone;
  hand?: CaveHand;
  shop?: {
    art: Phaser.GameObjects.Image;
    icon: Phaser.GameObjects.Image;
    zone: Phaser.GameObjects.Zone;
  };
};

export class CavePatchRenderer extends EntityRenderer<Slice> {
  private loaded = false;
  private patches = new Map<number, PatchObjects>();

  /**
   * [Cave.tsx clearedOnEntry] patches already fully dug when the player came
   * in show as empty sand, waiting for a new mix. Keyed by the batch's start
   * so a batch started (and dug out) during this visit stays dug until the
   * player leaves.
   */
  private clearedOnEntry: Record<string, number> | undefined;

  /** [Cave.tsx lastDugMachine] keeps the shop shortcut beside that patch. */
  private lastDugMachine: string | undefined;

  /** [CavePatch.tsx hovered] the tile under the pointer, and its patch. */
  private hovered: { id: number; tile: Tile } | undefined;
  private hoverBox: Phaser.GameObjects.Image | undefined;

  private unsubscribes: (() => void)[] = [];

  selector(state: MachineState): Slice {
    const game = state.context.state;
    return {
      cave: game.cave,
      shovels: game.inventory["Sand Shovel"]?.toNumber() ?? 0,
      drills: game.inventory["Sand Drill"]?.toNumber() ?? 0,
      tilesDug: game.farmActivity["Cave Tile Dug"] ?? 0,
    };
  }

  equals = (a: Slice, b: Slice) =>
    a.cave === b.cave &&
    a.shovels === b.shovels &&
    a.drills === b.drills &&
    a.tilesDug === b.tilesDug;

  async sync(slice: Slice) {
    const token = this.beginSync();

    this.clearedOnEntry ??= Object.fromEntries(
      Object.entries(slice.cave?.machines ?? {}).flatMap(([id, { batch }]) =>
        batch && isCavePatchCleared(batch) ? [[id, batch.startedAt]] : [],
      ),
    );

    queueImage(this.scene, SUNNYSIDE.soil.sand_hill);
    queueImage(this.scene, SUNNYSIDE.soil.sand_dug);
    queueImage(this.scene, SHOVEL_SELECT);
    queueImage(this.scene, DRILL_SELECT);
    queueImage(this.scene, SUNNYSIDE.icons.confirm);
    queueImage(this.scene, SUNNYSIDE.icons.click_icon);
    queueImage(this.scene, SUNNYSIDE.ui.emptyBar);
    queueImage(this.scene, SUNNYSIDE.ui.round_button);
    queueImage(this.scene, shopIcon);
    // Everything a tile can hold, and the tools the feedback labels show.
    for (const item of [
      "Wild Mushroom",
      "Magic Mushroom",
      "Mud",
      "Sand Shovel",
      "Sand Drill",
      ...BEETLES,
    ] as const) {
      queueImage(this.scene, ITEM_DETAILS[item].image);
    }
    LabelBadge.queueAssets(this.scene);
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    if (!this.loaded) {
      this.loaded = true;
      // The tutorial's acknowledgements move the hand; the held tool decides
      // between the shovel's box and the drill's.
      this.unsubscribes.push(
        this.bridge.caveUi.subscribe(() => this.render()),
        this.bridge.ui.subscribe(() => this.syncHoverBox()),
      );
    }
    this.render(slice);
  }

  /** The batch a patch shows [Cave.tsx: a cleared-on-entry batch shows none]. */
  private shownBatch(cave: Cave | undefined, id: number) {
    const batch = cave?.machines[String(id)]?.batch;
    return batch?.startedAt === this.clearedOnEntry?.[String(id)]
      ? undefined
      : batch;
  }

  private patchOrigin(id: number) {
    const { patch } = CAVE_SLOTS[id];
    return { x: caveTileX(patch.x), y: caveTileY(patch.y) };
  }

  private render(
    slice: Slice = this.bridge.select((state) => this.selector(state)),
  ) {
    if (!this.loaded || this.destroyed) return;
    const { cave } = slice;
    const slots = cave ? caveSlotsForTier(cave.tier) : [];

    for (const [id, patch] of this.patches) {
      if (slots.includes(id)) continue;
      this.destroyPatch(patch);
      this.patches.delete(id);
    }
    if (!cave) return;

    const now = Date.now();
    const game = this.bridge.select((state) => state.context.state);
    const guide = readCaveGuide(
      game,
      now,
      caveTutorialSeen(this.bridge),
      this.bridge.caveUi.get().modal,
    );
    // [Cave.tsx shopMachine] keep one shortcut beside the last patch dug
    // while it is still ready; otherwise use the first ready one.
    const { needsShovels, readyMachines } = readCaveShovelNeed(game, now);
    const shopMachine =
      readyMachines.find((id) => String(id) === this.lastDugMachine) ??
      readyMachines[0];

    for (const id of slots) {
      const batch = this.shownBatch(cave, id);
      const phase = !batch ? "none" : batch.readyAt > now ? "growing" : "ready";
      // [Cave.tsx tutorialTile] the first dig points at the middle tile.
      const handTile =
        id === 1 &&
        guide.guiding === "dig" &&
        phase === "ready" &&
        !batch?.dug?.[caveTileKey(2, 2)];

      let patch = this.patches.get(id);
      if (
        !patch ||
        patch.batch !== batch ||
        patch.phase !== phase ||
        patch.handTile !== handTile
      ) {
        if (patch) this.destroyPatch(patch);
        patch = this.buildPatch(id, batch, phase, handTile);
        this.patches.set(id, patch);
      }

      if (patch.bar && batch) {
        patch.bar.set(
          getCaveBatchPercentage(batch, now),
          Math.max(0, (batch.readyAt - now) / 1000),
        );
      }

      this.syncShop(
        id,
        patch,
        !guide.step && needsShovels && shopMachine === id,
      );
    }

    this.syncHoverBox();
  }

  private buildPatch(
    id: number,
    batch: CaveBatch | undefined,
    phase: PatchObjects["phase"],
    handTile: boolean,
  ): PatchObjects {
    const patch: PatchObjects = {
      batch,
      phase,
      handTile,
      objects: [],
      labels: [],
    };
    // The room image already draws the bare sand of an empty patch.
    if (!batch || phase === "none") return patch;

    const origin = this.patchOrigin(id);

    if (phase === "growing") {
      // [CavePatch.tsx] bg-white/20 rounded-md over the patch...
      const shade = this.scene.add
        .graphics()
        .setDepth(CAVE_DEPTHS.TILE)
        .fillStyle(0xffffff, 0.2)
        .fillRoundedRect(origin.x, origin.y, PATCH_PX, PATCH_PX, css(6));
      patch.objects.push(shade);
      // ...with the plot-style timer and bar centred on it.
      patch.bar = new ProgressBarSprite(this.scene, {
        x: origin.x + PATCH_PX / 2 - 7.5,
        y: origin.y + PATCH_PX / 2 - 3.5,
        type: "progress",
        formatLength: "medium",
        depth: CAVE_DEPTHS.LABEL,
      });
      return patch;
    }

    // Read the records once per batch.
    const revealed = getRevealedCaveTiles(batch);
    const found = { Beetle: 0, Mushroom: 0 };
    for (const { tile } of Object.values(revealed)) {
      if (tile.type !== "Mud") found[tile.type] += 1;
    }

    for (let y = 0; y < CAVE_PATCH_SIZE; y++) {
      for (let x = 0; x < CAVE_PATCH_SIZE; x++) {
        const key = caveTileKey(x, y);
        const left = origin.x + x * WORLD_TILE;
        const top = origin.y + y * WORLD_TILE;
        if (batch.dug?.[key] && revealed[key]) {
          this.addDugTile(
            patch,
            resolveRevealedCaveTile(revealed[key]),
            left,
            top,
          );
        } else {
          patch.objects.push(this.addSand(SUNNYSIDE.soil.sand_hill, left, top));
        }
      }
    }

    // [CaveTutorial.tsx] the hand on the tutorial tile's bottom-right corner.
    if (handTile) {
      patch.hand = createCaveHand(this.scene, {
        x: origin.x + 2 * WORLD_TILE + WORLD_TILE - 6,
        y: origin.y + 2 * WORLD_TILE + WORLD_TILE - 6,
        depth: CAVE_DEPTHS.HAND,
        animate: this.bridge.ui.get().showAnimations,
      });
    }

    const cleared = isCavePatchCleared(batch);
    this.addStatusLabels(patch, batch, cleared, found, origin);

    // A dug-out patch takes no tool.
    if (!cleared) {
      const zone = this.scene.add
        .zone(origin.x, origin.y, PATCH_PX, PATCH_PX)
        .setOrigin(0, 0)
        .setDepth(CAVE_DEPTHS.TILE);
      zone.setInteractive({ useHandCursor: true });
      // Registered ahead of makeClickable's own handlers, so the tile under
      // the pointer is known by the time the click fires.
      let pressed: Tile | undefined;
      const tileAt = (pointer: Phaser.Input.Pointer): Tile => {
        const world = this.scene.cameras.main.getWorldPoint(
          pointer.x,
          pointer.y,
        );
        const clamp = (value: number) =>
          Math.min(Math.max(Math.floor(value / WORLD_TILE), 0), 4);
        return { x: clamp(world.x - origin.x), y: clamp(world.y - origin.y) };
      };
      zone.on("pointerup", (pointer: Phaser.Input.Pointer) => {
        pressed = tileAt(pointer);
      });
      zone.on("pointermove", (pointer: Phaser.Input.Pointer) => {
        // A held pointer is a tap or a pan, not a hover.
        if (pointer.isDown) return;
        this.setHovered({ id, tile: tileAt(pointer) });
      });
      makeClickable(
        this.scene,
        zone,
        () => {
          if (pressed) this.onTileClick(id, pressed);
        },
        {
          onHoverChange: (hovered) => {
            if (!hovered) {
              if (this.hovered?.id === id) this.setHovered(undefined);
              return;
            }
            this.pickUpShovel();
          },
        },
      );
      patch.zone = zone;
    }

    return patch;
  }

  /**
   * A tile's sand art, centred on the tile at its native size. The DOM
   * stretches the 16x12 art over the whole 16x16 tile; the engine never
   * resamples world art [core/pixelArt.ts].
   */
  private addSand(texture: string, left: number, top: number) {
    return this.scene.add
      .image(left + WORLD_TILE / 2, top + WORLD_TILE / 2, texture)
      .setOrigin(0.5, 0.5)
      .setDepth(CAVE_DEPTHS.TILE);
  }

  /** [CavePatch.tsx DugTile] dug sand, what the tile held, and its clue. */
  private addDugTile(
    patch: PatchObjects,
    tile: ResolvedCaveTile,
    left: number,
    top: number,
  ) {
    patch.objects.push(this.addSand(SUNNYSIDE.soil.sand_dug, left, top));

    const item = getKeys(tile.items)[0];
    if (item) {
      const texture = ITEM_DETAILS[item].image;
      if (this.scene.textures.exists(texture)) {
        // Centred in the tile at 9px wide, as the DOM draws it. This is an
        // icon on a tile rather than world art: at native size (16px for
        // Mud) it covers the dug hole and the clue number.
        const icon = this.scene.add
          .image(left + WORLD_TILE / 2, top + WORLD_TILE / 2, texture)
          .setOrigin(0.5, 0.5)
          .setDepth(CAVE_DEPTHS.TILE_CONTENT);
        fitWidth(icon, 9);
        patch.objects.push(icon);
      }
    }

    if (tile.type === "Beetle") {
      // A 5px tick in the tile's top-right corner.
      const tick = this.scene.add
        .image(left + WORLD_TILE, top, SUNNYSIDE.icons.confirm)
        .setOrigin(1, 0)
        .setDepth(CAVE_DEPTHS.TILE_CONTENT + 1);
      fitWidth(tick, 5);
      patch.objects.push(tick);
    }

    if (tile.clue !== undefined) {
      // [DugTile] text-xs white, outlined, at bottom-0 right-0.5.
      const clue = pixelText(
        this.scene,
        left + WORLD_TILE - css(2),
        top + WORLD_TILE,
        String(tile.clue),
        { fontSize: 24, fontFamily: "Basic" },
      )
        .setOrigin(1, 1)
        .setDepth(CAVE_DEPTHS.TILE_CONTENT + 2);
      patch.objects.push(clue);
    }
  }

  /**
   * [CavePatch.tsx] the status column under the patch: ready / cleared, the
   * Beetles found, the Mushrooms found — centred, 4 CSS px below the sand.
   */
  private addStatusLabels(
    patch: PatchObjects,
    batch: CaveBatch,
    cleared: boolean,
    found: { Beetle: number; Mushroom: number },
    origin: { x: number; y: number },
  ) {
    const composition = getCavePatchComposition(batch.recipe, batch.skills);
    const beetles = { found: found.Beetle, total: composition.Beetle };
    const mushrooms = { found: found.Mushroom, total: composition.Mushroom };

    const rows: { type: LabelBadgeType; text: string; icon?: string }[] = [
      cleared
        ? { type: "default", text: translate("cave.dig.cleared") }
        : { type: "success", text: translate("cave.batch.ready") },
      beetles.found >= beetles.total
        ? {
            type: "success",
            icon: ITEM_DETAILS["Green Beetle"].image,
            text: translate("cave.dig.allBeetlesFound"),
          }
        : {
            type: "default",
            icon: ITEM_DETAILS["Green Beetle"].image,
            text: translate("cave.dig.beetlesFound", beetles),
          },
      mushrooms.found < mushrooms.total
        ? {
            type: "default",
            icon: ITEM_DETAILS["Wild Mushroom"].image,
            text: translate("cave.dig.mushroomsFound", mushrooms),
          }
        : {
            type: "success",
            icon: ITEM_DETAILS["Wild Mushroom"].image,
            text: translate("cave.dig.allMushroomsFound"),
          },
    ];

    let top = origin.y + PATCH_PX + css(4);
    for (const row of rows) {
      const label = new LabelBadge(this.scene, {
        x: 0,
        y: 0,
        ...row,
        depth: CAVE_DEPTHS.LABEL,
      });
      label.setPosition(
        Math.round(origin.x + PATCH_PX / 2 - label.width / 2),
        Math.round(top),
      );
      patch.labels.push(label);
      // gap-0.5
      top += LabelBadge.ROW_HEIGHT + css(2);
    }
  }

  /**
   * [Cave.tsx] the shop shortcut beside a ready patch when the player is out
   * of digging tools: a round button 4px right of the patch, centred on it.
   */
  private syncShop(id: number, patch: PatchObjects, wanted: boolean) {
    if (!wanted) {
      patch.shop?.art.destroy();
      patch.shop?.icon.destroy();
      patch.shop?.zone.destroy();
      patch.shop = undefined;
      return;
    }
    if (patch.shop) return;
    const origin = this.patchOrigin(id);
    const SIZE = 22;
    const x = origin.x + PATCH_PX + 4;
    const y = origin.y + PATCH_PX / 2 - SIZE / 2;
    const art = this.scene.add
      .image(x, y, SUNNYSIDE.ui.round_button)
      .setOrigin(0, 0)
      .setDepth(CAVE_DEPTHS.BUTTON);
    // 14px wide, centred on the button.
    const icon = this.scene.add
      .image(x + SIZE / 2, y + SIZE / 2, shopIcon)
      .setOrigin(0.5, 0.5)
      .setDepth(CAVE_DEPTHS.BUTTON + 1);
    fitWidth(icon, 14);
    const zone = this.scene.add
      .zone(x, y, SIZE, SIZE)
      .setOrigin(0, 0)
      .setDepth(CAVE_DEPTHS.BUTTON);
    makeClickable(
      this.scene,
      zone,
      () => openCaveModal(this.bridge, { name: "merchant" }),
      { glow: () => patch.shop?.art },
    );
    patch.shop = { art, icon, zone };
  }

  /**
   * [CavePatch.tsx onPointerEnter] digging needs a tool in hand: pick up the
   * shovel unless a Cave tool is already selected.
   */
  private pickUpShovel() {
    const selected = this.bridge.ui.get().selectedItem;
    if (selected !== "Sand Shovel" && selected !== "Sand Drill") {
      this.bridge.selectItem("Sand Shovel");
    }
  }

  /**
   * [CavePatch.tsx tile buttons] the Sand Drill digs the 2x2 square from the
   * tile, anything else digs the one tile with the Sand Shovel — each behind
   * the checks that disable the DOM's button.
   */
  private onTileClick(id: number, tile: Tile) {
    const game = this.bridge.select((state) => state.context.state);
    const batch = this.shownBatch(game.cave, id);
    if (!batch || batch.readyAt > Date.now()) return;

    const selected = this.bridge.ui.get().selectedItem;
    // A touch tap enters and clicks in one go.
    this.pickUpShovel();

    const hasBoard = isCaveSeed(batch.seed);
    const isDug = ({ x, y }: Tile) => !!batch.dug?.[caveTileKey(x, y)];
    const machineId = String(id);

    if (selected === "Sand Drill") {
      const square = getCaveDrillSquare(tile.x, tile.y);
      const hasDrill = !!game.inventory["Sand Drill"]?.gt(0);
      if (!hasDrill || !hasBoard || square.every(isDug)) return;
      this.dig(machineId, square, "Sand Drill");
      return;
    }

    // A dug tile takes no tool.
    if (isDug(tile)) return;
    const hasShovel = !!game.inventory["Sand Shovel"]?.gt(0);
    // The seed arrives with the save that follows the batch start.
    if (!hasShovel || !hasBoard) return;
    // The tile becomes a dug tile under the pointer.
    this.setHovered(undefined);
    this.dig(machineId, [tile], "Sand Shovel");
  }

  /** [CavePatch.tsx dig] send the dig, then read what this action did. */
  private dig(
    machineId: string,
    coords: Tile[],
    tool: "Sand Shovel" | "Sand Drill",
  ) {
    const state = () => this.bridge.select((s) => s.context.state);
    const before = state();
    if (tool === "Sand Shovel") {
      this.bridge.dispatch("cave.dug", { machineId, ...coords[0] });
    } else {
      this.bridge.dispatch("cave.drilled", { machineId, coords });
    }
    const after = state();

    const previousDug = before.cave?.machines[machineId]?.batch?.dug;
    const currentDug = after.cave?.machines[machineId]?.batch?.dug;
    const newlyDug = coords.filter(({ x, y }) => {
      const key = caveTileKey(x, y);
      return !previousDug?.[key] && !!currentDug?.[key];
    });
    if (newlyDug.length) {
      this.lastDugMachine = machineId;
      this.puff(Number(machineId), newlyDug);
    }

    const feedback = getCaveDigFeedback({
      before,
      after,
      machineId,
      coords,
      tool,
    });
    if (feedback.length) {
      this.showFeedback(Number(machineId), feedback, {
        x:
          coords.reduce((sum, point) => sum + point.x, 0) / coords.length + 0.5,
        y: Math.min(...coords.map((point) => point.y)),
      });
    }
  }

  /** Sand thrown up from each tile just dug [core/juice.ts]. */
  private puff(id: number, tiles: Tile[]) {
    if (!this.bridge.ui.get().showAnimations) return;
    const origin = this.patchOrigin(id);
    for (const tile of tiles) {
      burst(this.scene, {
        x: origin.x + tile.x * WORLD_TILE + WORLD_TILE / 2,
        y: origin.y + tile.y * WORLD_TILE + WORLD_TILE / 2,
        material: "soil",
        depth: CAVE_DEPTHS.FEEDBACK,
        count: 5,
        spread: 7,
        lift: 7,
      });
    }
  }

  /**
   * [CaveDigFeedback.tsx] one dig's labels, stacked above the dug tiles:
   * fade in, hold for the display time, fade out. Each dig owns its own
   * lifetime, whatever follows it.
   */
  private showFeedback(
    id: number,
    feedback: CaveDigFeedback[],
    at: { x: number; y: number },
  ) {
    const origin = this.patchOrigin(id);
    const centreX = origin.x + at.x * WORLD_TILE;
    let bottom = origin.y + at.y * WORLD_TILE;

    const labels = [...feedback].reverse().map((entry) => {
      const label = new LabelBadge(this.scene, {
        x: 0,
        y: 0,
        type: "success",
        icon: ITEM_DETAILS[entry.item].image,
        text:
          entry.kind === "shovelSaved"
            ? translate("cave.feedback.shovelSaved")
            : entry.kind === "drillSaved"
              ? translate("cave.feedback.drillSaved")
              : translate(
                  entry.amount === 1
                    ? "cave.feedback.bonusBeetle"
                    : "cave.feedback.bonusBeetles",
                  { amount: entry.amount },
                ),
        depth: CAVE_DEPTHS.FEEDBACK,
      });
      label.setPosition(
        Math.round(centreX - label.width / 2),
        Math.round(bottom - label.height),
      );
      // gap-1
      bottom -= LabelBadge.ROW_HEIGHT + css(4);
      return label;
    });

    const containers = labels.map((label) => label.container);
    const fadeMs = this.bridge.ui.get().showAnimations
      ? CAVE_FEEDBACK_FADE_MS
      : 0;
    containers.forEach((container) => container.setAlpha(0));
    this.scene.tweens.add({
      targets: containers,
      alpha: 1,
      duration: fadeMs,
      ease: "Quart.easeOut",
    });
    this.scene.time.delayedCall(CAVE_FEEDBACK_DISPLAY_MS, () => {
      this.scene.tweens.add({
        targets: containers,
        alpha: 0,
        duration: fadeMs,
        ease: "Quart.easeOut",
      });
    });
    this.scene.time.delayedCall(
      CAVE_FEEDBACK_DISPLAY_MS + CAVE_FEEDBACK_FADE_MS,
      () => labels.forEach((label) => label.destroy()),
    );
  }

  private setHovered(hovered: { id: number; tile: Tile } | undefined) {
    this.hovered = hovered;
    this.syncHoverBox();
  }

  /**
   * [CavePatch.tsx hoverBox] where the hover box sits: the 2x2 square's
   * top-left for the drill, the tile itself for the shovel. Derived from the
   * batch, not just the pointer: once the hovered tile (or the whole drill
   * square) is dug the box goes away without waiting for the pointer to move.
   */
  private syncHoverBox() {
    if (!this.loaded || this.destroyed) return;
    const box = (() => {
      const hovered = this.hovered;
      if (!hovered) return undefined;
      const batch = this.patches.get(hovered.id)?.batch;
      if (!batch || batch.readyAt > Date.now() || isCavePatchCleared(batch)) {
        return undefined;
      }
      const isDug = ({ x, y }: Tile) => !!batch.dug?.[caveTileKey(x, y)];
      if (this.bridge.ui.get().selectedItem === "Sand Drill") {
        const square = getCaveDrillSquare(hovered.tile.x, hovered.tile.y);
        return square.every(isDug) ? undefined : { ...square[0], size: 2 };
      }
      return isDug(hovered.tile) ? undefined : { ...hovered.tile, size: 1 };
    })();

    if (!box || !this.hovered) {
      this.hoverBox?.setVisible(false);
      return;
    }
    const texture = box.size === 2 ? DRILL_SELECT : SHOVEL_SELECT;
    if (!this.scene.textures.exists(texture)) return;
    const origin = this.patchOrigin(this.hovered.id);
    this.hoverBox ??= this.scene.add
      .image(0, 0, texture)
      .setOrigin(0.5, 0.5)
      .setDepth(CAVE_DEPTHS.HOVER_BOX);
    // Native size, centred on the tile (or the square) it frames.
    this.hoverBox
      .setTexture(texture)
      .setPosition(
        origin.x + (box.x + box.size / 2) * WORLD_TILE,
        origin.y + (box.y + box.size / 2) * WORLD_TILE,
      )
      .setVisible(true);
  }

  /** Timers, and the growing -> ready turn, follow the clock. */
  update(_time: number, delta: number) {
    if (!this.secondElapsed(delta)) return;
    this.render();
  }

  private destroyPatch(patch: PatchObjects) {
    patch.objects.forEach((object) => object.destroy());
    patch.labels.forEach((label) => label.destroy());
    patch.bar?.destroy();
    patch.zone?.destroy();
    patch.hand?.destroy();
    patch.shop?.art.destroy();
    patch.shop?.icon.destroy();
    patch.shop?.zone.destroy();
  }

  protected onDestroy() {
    this.unsubscribes.forEach((unsubscribe) => unsubscribe());
    this.unsubscribes = [];
    this.patches.forEach((patch) => this.destroyPatch(patch));
    this.patches.clear();
    this.hoverBox?.destroy();
    this.hoverBox = undefined;
  }
}
