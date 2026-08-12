import Phaser from "phaser";
import { v4 as uuidv4 } from "uuid";

import { SUNNYSIDE } from "assets/sunnyside";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { CROPS } from "features/game/types/crops";
import type { GameState } from "features/game/types/game";
import {
  getCropReadyAt,
  isReadyToHarvest,
} from "features/game/events/landExpansion/harvest";
import { isCropSeed, type SeedName } from "features/game/types/seeds";
import type { MachineInterpreter } from "features/game/lib/gameMachine";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { getKeys } from "lib/object";

type GrowthStage = "seedling" | "halfway" | "almost" | "ready";

type PlotObjects = {
  soil: Phaser.GameObjects.Image;
  crop: Phaser.GameObjects.Image;
  hitArea: Phaser.GameObjects.Zone;
};

// Same thresholds as FertilePlot's getGrowthStage
const getGrowthStage = (percentage: number): GrowthStage => {
  if (percentage >= 100) return "ready";
  if (percentage >= 50) return "almost";
  if (percentage >= 25) return "halfway";
  return "seedling";
};

/**
 * MVP canvas port of the crop layer of Land.tsx.
 *
 * Reads plots straight out of the game machine state (injected via the
 * registry, same pattern as world/Phaser.tsx) and fires the existing
 * "seed.planted" / "crop.harvested" events — no game logic lives here.
 *
 * Tile (x, y) maps to world (x * SQUARE_WIDTH, -y * SQUARE_WIDTH), mirroring
 * MapPlacement (positive y goes up on screen).
 */
export class FarmScene extends Phaser.Scene {
  private plots: Record<string, PlotObjects> = {};

  constructor() {
    super("farm");
  }

  private get gameService() {
    return this.registry.get("gameService") as MachineInterpreter;
  }

  private get gameState(): GameState {
    return this.gameService.getSnapshot().context.state;
  }

  preload() {
    const biome = getCurrentBiome(this.gameState.island);
    const lifecycle = CROP_LIFECYCLE[biome];

    this.load.image("soil", SUNNYSIDE.soil.soil2);

    getKeys(lifecycle).forEach((crop) => {
      this.load.image(`${crop}-seedling`, lifecycle[crop].seedling);
      this.load.image(`${crop}-halfway`, lifecycle[crop].halfway);
      this.load.image(`${crop}-almost`, lifecycle[crop].almost);
      this.load.image(`${crop}-ready`, lifecycle[crop].ready);
    });
  }

  create() {
    this.cameras.main.setZoom(3);
    this.setupCameraPan();

    this.syncPlots();
    this.centerCamera();

    // Re-sync whenever the React layer pushes a new machine state
    this.game.events.on("gameStateUpdated", this.syncPlots, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off("gameStateUpdated", this.syncPlots, this);
    });

    // Growth stages only change on the order of seconds
    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => this.refreshCropStages(),
    });
  }

  /**
   * Creates/destroys plot sprites to match the machine state. Idempotent —
   * runs on create and after every state change.
   */
  private syncPlots = () => {
    const crops = this.gameState.crops;

    // Remove plots that no longer exist (e.g. picked up while landscaping)
    Object.keys(this.plots).forEach((id) => {
      if (crops[id]?.x === undefined || crops[id]?.y === undefined) {
        Object.values(this.plots[id]).forEach((object) => object.destroy());
        delete this.plots[id];
      }
    });

    Object.entries(crops).forEach(([id, plot]) => {
      if (plot.x === undefined || plot.y === undefined) return;

      const worldX = plot.x * SQUARE_WIDTH;
      const worldY = -plot.y * SQUARE_WIDTH;

      if (!this.plots[id]) {
        // Mirrors Soil.tsx: images are 16px wide, drawn from 12 source px
        // above the tile's top edge so tall crops overhang upwards.
        const soil = this.add
          .image(worldX, worldY - 12, "soil")
          .setOrigin(0, 0);
        const crop = this.add
          .image(worldX, worldY - 12, "soil")
          .setOrigin(0, 0)
          .setVisible(false);

        const hitArea = this.add
          .zone(worldX, worldY, SQUARE_WIDTH, SQUARE_WIDTH)
          .setOrigin(0, 0)
          .setInteractive({ useHandCursor: true })
          .on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            // Suppress plot actions at the end of a camera pan
            if (pointer.getDistance() > 4) return;
            this.onPlotClick(id);
          });

        this.plots[id] = { soil, crop, hitArea };
      }

      this.plots[id].soil.setPosition(worldX, worldY - 12);
      this.plots[id].crop.setPosition(worldX, worldY - 12);
      this.plots[id].hitArea.setPosition(worldX, worldY);
    });

    this.refreshCropStages();
  };

  private refreshCropStages() {
    const state = this.gameState;
    const now = Date.now();

    Object.entries(this.plots).forEach(([id, objects]) => {
      const plot = state.crops[id];
      const crop = plot?.crop;

      if (!crop) {
        objects.crop.setVisible(false);
        return;
      }

      const readyAt = getCropReadyAt(
        crop,
        CROPS[crop.name],
        state,
        plot.fertiliser,
      );
      const percentage =
        readyAt <= crop.plantedAt
          ? 100
          : ((now - crop.plantedAt) / (readyAt - crop.plantedAt)) * 100;

      const texture = `${crop.name}-${getGrowthStage(percentage)}`;
      if (objects.crop.texture.key !== texture) {
        objects.crop.setTexture(texture);
      }
      objects.crop.setVisible(true);
    });
  }

  /**
   * Same action rules as Plot.tsx's onClick, minus fertilisers, rewards and
   * tutorial hooks: empty plot + crop seed selected → plant; ready → harvest.
   */
  private onPlotClick(id: string) {
    const state = this.gameState;
    const plot = state.crops[id];
    if (!plot) return;

    if (!plot.crop) {
      const selected = this.registry.get("selectedItem") as
        | SeedName
        | undefined;
      if (!selected || !isCropSeed(selected)) return;

      this.gameService.send("seed.planted", {
        index: id,
        item: selected,
        cropId: uuidv4().slice(0, 8),
      });
      return;
    }

    if (
      isReadyToHarvest(
        Date.now(),
        plot.crop,
        CROPS[plot.crop.name],
        state,
        plot.fertiliser,
      )
    ) {
      this.gameService.send("crop.harvested", { index: id });
    }
  }

  private centerCamera() {
    const positions = Object.values(this.gameState.crops).filter(
      (plot) => plot.x !== undefined && plot.y !== undefined,
    );

    if (positions.length === 0) {
      this.cameras.main.centerOn(0, 0);
      return;
    }

    const xs = positions.map((plot) => plot.x! * SQUARE_WIDTH);
    const ys = positions.map((plot) => -plot.y! * SQUARE_WIDTH);

    this.cameras.main.centerOn(
      (Math.min(...xs) + Math.max(...xs) + SQUARE_WIDTH) / 2,
      (Math.min(...ys) + Math.max(...ys) + SQUARE_WIDTH) / 2,
    );
  }

  private setupCameraPan() {
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (!pointer.isDown) return;

      const camera = this.cameras.main;
      camera.scrollX -= (pointer.x - pointer.prevPosition.x) / camera.zoom;
      camera.scrollY -= (pointer.y - pointer.prevPosition.y) / camera.zoom;
    });
  }
}
