import type Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState } from "features/game/types/game";
import {
  PLANT_STAGES,
  GREENHOUSE_EMPTY_POT,
} from "features/greenhouse/GreenhousePot";
import { getGreenhouseReadyAt } from "features/game/events/landExpansion/greenhouseReadiness";
import {
  getGreenhouseBoostWindows,
  getGreenhouseGlowWindows,
} from "features/game/lib/boostWindows";
import { getDisplaySeconds } from "features/game/lib/timerDisplay";
import type { GreenHouseCropSeedName } from "features/game/types/crops";
import {
  getOilUsage,
  SEED_TO_PLANT,
} from "features/game/events/landExpansion/plantGreenhouse";
import { GREENHOUSE_COMPOST } from "features/game/types/composters";
import type { GreenhouseCompostName } from "features/game/types/composters";
import { SUNNYSIDE as SUNNY } from "assets/sunnyside";
import powerup from "assets/icons/level_up.png";
import { secondsToString } from "lib/utils/time";
import { translate } from "lib/i18n/translate";
import Decimal from "decimal.js-light";
import { LabelChip, type LabelChipType } from "../../components/LabelSprite";
import { getEffectiveSpeedAt } from "features/game/lib/boostWindows";
import { queueImage, runLoader } from "../../core/assets";
import { makeClickable } from "../../core/clickable";
import { readNodeTimer } from "../../core/clock";
import { DEPTHS } from "../../core/depths";
import { playSound } from "../../core/sounds";
import { ProgressBarSprite } from "../../components/ProgressBarSprite";
import { EntityRenderer } from "../EntityRenderer";

/**
 * The greenhouse's four pots [greenhouse/GreenhousePot.tsx]. Unlike the farm
 * surfaces these aren't grid-placed — the DOM pins them at fixed offsets
 * inside the room art, so the layout is a small table here too.
 *
 * Empty pot -> click plants the selected greenhouse seed; growing -> staged
 * art + progress bar (+ the boost lightning); ready -> click harvests. All
 * timing comes from the same boost-window helpers the DOM uses.
 */

type Slice = {
  pots: GameState["greenhouse"]["pots"];
  /** Boost windows read wider state; this is the ref that moves with them. */
  collectibles: GameState["collectibles"];
  bumpkin: GameState["bumpkin"];
};

const POT_WIDTH = 28;

/**
 * [GreenhouseInside.tsx] pot offsets inside the 176x192 room, in source px
 * from the room's left/right and bottom edges.
 */
const POT_LAYOUT: Record<
  number,
  { left?: number; right?: number; bottom: number }
> = {
  1: { left: 26, bottom: 95 },
  2: { left: 26, bottom: 46 },
  3: { right: 26, bottom: 95 },
  4: { right: 26, bottom: 46 },
};

const ROOM = { width: 176, height: 192 };

type PotObjects = {
  art: Phaser.GameObjects.Image;
  zone: Phaser.GameObjects.Zone;
  bar?: ProgressBarSprite;
  boost?: Phaser.GameObjects.Image;
  fertiliser?: Phaser.GameObjects.Image;
  fertiliserName?: string;
};

export class GreenhousePotRenderer extends EntityRenderer<Slice> {
  private pots = new Map<number, PotObjects>();
  private tickMs = 0;

  selector(state: MachineState): Slice {
    const game = state.context.state;
    return {
      pots: game.greenhouse.pots,
      collectibles: game.collectibles,
      bumpkin: game.bumpkin,
    };
  }

  equals = (a: Slice, b: Slice) =>
    a.pots === b.pots &&
    a.collectibles === b.collectibles &&
    a.bumpkin === b.bumpkin;

  /** The room is centred on the origin, so pots resolve against its box. */
  private potOrigin(id: number) {
    return greenhousePotOrigin(id);
  }

  async sync(slice: Slice) {
    const token = this.beginSync();
    queueImage(this.scene, GREENHOUSE_EMPTY_POT);
    queueImage(this.scene, SUNNYSIDE.icons.lightning);
    queueImage(this.scene, SUNNYSIDE.ui.emptyBar);
    queueImage(this.scene, powerup);
    queueImage(this.scene, SUNNY.icons.stopwatch);
    LabelChip.queueAssets(this.scene);
    for (const pot of Object.values(slice.pots)) {
      const name = pot?.plant?.name;
      if (!name) continue;
      Object.values(PLANT_STAGES[name]).forEach((url) =>
        queueImage(this.scene, url),
      );
    }
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    for (const id of [1, 2, 3, 4]) {
      this.syncPot(id, slice);
    }
  }

  private syncPot(id: number, slice: Slice) {
    const game = this.bridge.select((state) => state.context.state);
    const pot = slice.pots[id];
    const plant = pot?.plant;
    const { x, bottom } = this.potOrigin(id);
    const depth = DEPTHS.ENTITY_BASE + bottom;

    let objects = this.pots.get(id);
    if (!objects) {
      const art = this.scene.add
        .image(0, 0, GREENHOUSE_EMPTY_POT)
        .setOrigin(0, 1);
      const zone = this.scene.add
        .zone(0, 0, POT_WIDTH, POT_WIDTH)
        .setOrigin(0, 1);
      makeClickable(this.scene, zone, () => this.onPotClick(id), {
        glow: () => this.pots.get(id)?.art,
      });
      // Anchor for the React quick-select disc row [GreenhousePot.tsx].
      const { x: ax, bottom: abottom } = this.potOrigin(id);
      this.bridge.anchors.setAnchor(`greenhouse-pot-${id}`, {
        x: ax,
        y: abottom - POT_WIDTH,
        width: POT_WIDTH,
        height: POT_WIDTH,
      });
      objects = { art, zone };
      this.pots.set(id, objects);
    }

    objects.zone.setPosition(x, bottom);
    objects.zone.setDepth(depth);
    objects.art.setPosition(x, bottom);
    objects.art.setDepth(depth);

    this.syncFertiliserBadge(objects, pot?.fertiliser?.name, x, bottom, depth);

    if (!plant) {
      objects.art.setTexture(GREENHOUSE_EMPTY_POT);
      objects.art.setScale(1);
      objects.art.setX(x + (POT_WIDTH - objects.art.width) / 2);
      this.clearExtras(objects);
      return;
    }

    const windows = [
      ...getGreenhouseBoostWindows(game, plant.name),
      ...getGreenhouseGlowWindows(pot?.fertiliser),
    ];
    const readyAt = getGreenhouseReadyAt(plant, game, pot?.fertiliser);
    const reading = readNodeTimer(
      {
        startedAt: plant.plantedAt,
        baseDurationMs: plant.baseDurationMs,
        windows,
        legacyReadyAt: readyAt,
      },
      Date.now(),
    );
    const percentage = reading.progress * 100;
    const stage =
      percentage < 20
        ? "seedling"
        : percentage < 50
          ? "growing"
          : percentage < 100
            ? "almost"
            : "ready";

    const texture = PLANT_STAGES[plant.name][stage];
    if (this.scene.textures.exists(texture)) {
      objects.art.setTexture(texture);
      // Pixel-art rule: draw at native size (1 art px = 1 world px). The DOM
      // forces every stage to 28 wide, which resamples the 29px "almost"
      // frames; here they stay crisp, centred on the pot box.
      objects.art.setScale(1);
      objects.art.setX(x + (POT_WIDTH - objects.art.width) / 2);
    }

    const now = Date.now();
    const secondsLeft = Math.max(Math.ceil((reading.readyAt - now) / 1000), 0);
    const speed = plant.baseDurationMs
      ? getEffectiveSpeedAt({ at: now, windows })
      : 1;

    // [GreenhousePot.tsx] boost lightning at (right 3, top 1), 7px.
    if (secondsLeft > 0 && speed > 1) {
      if (!objects.boost) {
        objects.boost = this.scene.add
          .image(0, 0, SUNNYSIDE.icons.lightning)
          .setOrigin(0, 0)
          .setDepth(depth + 2);
        objects.boost.setScale(1);
      }
      objects.boost.setPosition(
        x + POT_WIDTH - 3 - objects.boost.width,
        bottom - POT_WIDTH + 1,
      );
    } else {
      objects.boost?.destroy();
      objects.boost = undefined;
    }

    // [GreenhousePot.tsx] bar at (left 6.5, bottom 2.5), 15 wide.
    if (this.bridge.ui.get().showTimers && secondsLeft > 0) {
      objects.bar ??= new ProgressBarSprite(this.scene, {
        x: x + 6.5,
        y: bottom - 2.5 - 7,
        formatLength: "short",
        depth: depth + 2,
      });
      objects.bar.setPosition(x + 6.5, bottom - 2.5 - 7);
      objects.bar.set(
        percentage,
        getDisplaySeconds({
          showActualTime: this.bridge.ui.get().showActualTime,
          workLeftSeconds: secondsLeft,
          countdownSeconds: secondsLeft,
        }),
      );
    } else {
      objects.bar?.destroy();
      objects.bar = undefined;
    }
  }

  /**
   * [GreenhousePot.tsx onClick + harvest] fertilise-first, then plant when
   * empty (seed + oil guards) or harvest when ready.
   */
  private onPotClick(id: number) {
    const game = this.bridge.select((state) => state.context.state);
    const pot = game.greenhouse.pots[id];
    const selected = this.bridge.ui.get().selectedItem;

    // A selected compost applies to any unfertilised pot first.
    const tryFertilise = () => {
      if (!selected || !(selected in GREENHOUSE_COMPOST) || pot?.fertiliser) {
        return false;
      }
      // The DOM reaches the reducer unguarded and would throw the machine
      // into its error screen on zero compost; don't.
      if (!(game.inventory[selected] ?? new Decimal(0)).gte(1)) return false;
      this.bridge.dispatch("greenhouse.fertilised", {
        id,
        fertiliser: selected as GreenhouseCompostName,
      });
      return true;
    };

    if (!pot?.plant) {
      if (tryFertilise()) return;

      const seed = selected as GreenHouseCropSeedName | undefined;
      const valid =
        seed &&
        SEED_TO_PLANT[seed] &&
        (game.inventory[seed] ?? new Decimal(0)).gte(1);
      if (!valid) {
        // [GreenhousePot.tsx plantSeed] the quick-select disc row. Deferred
        // past this pointerdown so its outside-click closer survives.
        if (this.bridge.ui.get().enableQuickSelect) {
          setTimeout(
            () =>
              this.bridge.quickSelect.set({
                anchorId: `greenhouse-pot-${id}`,
                patchId: `${id}`,
              }),
            0,
          );
        }
        return;
      }

      const { usage: oilRequired } = getOilUsage({ seed, game });
      if (oilRequired > game.greenhouse.oil) {
        this.showPotLabel(
          id,
          `${oilRequired} ${translate("greenhouse.oilRequired")}`,
          "danger",
        );
        return;
      }

      this.bridge.dispatch("greenhouse.planted", { id, seed });
      playSound("plant");
      return;
    }

    const readyAt = getGreenhouseReadyAt(pot.plant, game, pot.fertiliser);
    if (Date.now() < readyAt) {
      if (tryFertilise()) return;
      // [GreenhousePot.tsx TimerPopover] time remaining on click.
      this.showPotLabel(
        id,
        secondsToString(Math.ceil((readyAt - Date.now()) / 1000), {
          length: "medium",
        }),
        "default",
      );
      return;
    }
    this.bridge.dispatch("greenhouse.harvested", { id });
    playSound("harvest");
  }

  /** [GreenhousePotFertiliserBadges] powerup for Goodie, stopwatch for Glow. */
  private syncFertiliserBadge(
    objects: PotObjects,
    name: string | undefined,
    x: number,
    bottom: number,
    depth: number,
  ) {
    if (name !== objects.fertiliserName) {
      objects.fertiliser?.destroy();
      objects.fertiliser = undefined;
      objects.fertiliserName = name;
    }
    if (!name) return;
    const icon = name === "Greenhouse Goodie" ? powerup : SUNNY.icons.stopwatch;
    if (!this.scene.textures.exists(icon)) return;
    if (!objects.fertiliser) {
      // Native size — see the pixel-art rule note above.
      objects.fertiliser = this.scene.add.image(0, 0, icon).setOrigin(1, 1);
      objects.fertiliser.setScale(1);
    }
    // [GreenhousePot.tsx] bottom 2, right 0 of the 28px pot box.
    objects.fertiliser.setPosition(x + POT_WIDTH, bottom - 2);
    objects.fertiliser.setDepth(depth + 2);
  }

  /** Transient chip over a pot (oil warning / time remaining), 2s. */
  private showPotLabel(id: number, text: string, type: LabelChipType) {
    const { x, bottom } = this.potOrigin(id);
    const chip = new LabelChip(this.scene, {
      x,
      y: bottom - POT_WIDTH - 8,
      text,
      type,
      depth: DEPTHS.ENTITY_BASE + bottom + 20,
    });
    chip.container.x += (POT_WIDTH - chip.width) / 2;
    this.scene.time.delayedCall(2000, () => chip.destroy());
  }

  /** Bars tick once a second like every other timed renderer. */
  update(_time: number, delta: number) {
    this.tickMs += delta;
    if (this.tickMs < 1000) return;
    this.tickMs = 0;
    const slice = this.bridge.select((state) => this.selector(state));
    for (const id of [1, 2, 3, 4]) this.syncPot(id, slice);
  }

  private clearExtras(objects: PotObjects) {
    objects.bar?.destroy();
    objects.bar = undefined;
    objects.boost?.destroy();
    objects.boost = undefined;
  }

  protected onDestroy() {
    this.pots.forEach((objects, id) => {
      objects.art.destroy();
      objects.zone.destroy();
      objects.fertiliser?.destroy();
      this.clearExtras(objects);
      this.bridge.anchors.removeAnchor(`greenhouse-pot-${id}`);
    });
    this.pots.clear();
  }
}

/** Room-centred world origin of a greenhouse pot [POT_LAYOUT]. */
export function greenhousePotOrigin(id: number): { x: number; bottom: number } {
  const layout = POT_LAYOUT[id];
  const roomLeft = -ROOM.width / 2;
  const roomBottom = ROOM.height / 2;
  const x =
    layout.right !== undefined
      ? roomLeft + ROOM.width - layout.right - POT_WIDTH
      : roomLeft + (layout.left ?? 0);
  return { x, bottom: roomBottom - layout.bottom };
}
