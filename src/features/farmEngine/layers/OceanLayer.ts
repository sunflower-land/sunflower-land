import Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import type { MachineState } from "features/game/lib/gameMachine";
import type { IslandType } from "features/game/types/game";
import type { TemperateSeasonName } from "features/game/types/game";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { queueImage, runLoader } from "../core/assets";
import { getGameboardWorldBounds } from "../core/coordinates";
import { DEPTHS } from "../core/depths";
import { EntityRenderer } from "../entities/EntityRenderer";

/**
 * The tiled ocean under everything. DOM parity (Land.tsx's gameboard div):
 * background-image tiled at 64 source px per tile, anchored at the board's
 * top-left; frozen in winter, dark from volcano islands up.
 *
 * Tiled by stamping plain images into one RenderTexture — never a
 * TileSprite, which blurs NEAREST texels in WebGL (project-ii's lesson).
 */

type OceanSlice = {
  season: TemperateSeasonName;
  islandType: IslandType;
  expansionCount: number;
};

const OCEAN_TILE_SOURCE_PX = 64;

const getOceanTexture = ({ season, islandType }: OceanSlice): string => {
  if (season === "winter") return SUNNYSIDE.decorations.frozenOcean;
  if (hasRequiredIslandExpansion(islandType, "volcano")) {
    return SUNNYSIDE.decorations.darkOcean;
  }
  return SUNNYSIDE.decorations.ocean;
};

export class OceanLayer extends EntityRenderer<OceanSlice> {
  private surface: Phaser.GameObjects.RenderTexture | undefined;

  selector(state: MachineState): OceanSlice {
    return {
      season: state.context.state.season.season,
      islandType: state.context.state.island.type,
      expansionCount:
        state.context.state.inventory["Basic Land"]?.toNumber() ?? 3,
    };
  }

  equals = (a: OceanSlice, b: OceanSlice) =>
    a.season === b.season &&
    a.islandType === b.islandType &&
    a.expansionCount === b.expansionCount;

  async sync(slice: OceanSlice) {
    const token = this.beginSync();
    const texture = getOceanTexture(slice);
    queueImage(this.scene, texture);
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    const bounds = getGameboardWorldBounds(slice.expansionCount);

    this.surface?.destroy();
    this.surface = this.scene.add
      .renderTexture(bounds.x, bounds.y, bounds.width, bounds.height)
      .setOrigin(0, 0)
      .setDepth(DEPTHS.OCEAN);
    this.surface.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    // CSS renders the tile at 64 src px regardless of the file's size.
    const source = this.scene.textures.get(texture).getSourceImage();
    const stamp = this.scene.make
      .image({ key: texture, add: false })
      .setOrigin(0, 0)
      .setScale(OCEAN_TILE_SOURCE_PX / source.width);

    this.surface.beginDraw();
    for (let x = 0; x < bounds.width; x += OCEAN_TILE_SOURCE_PX) {
      for (let y = 0; y < bounds.height; y += OCEAN_TILE_SOURCE_PX) {
        this.surface.batchDraw(stamp, x, y);
      }
    }
    this.surface.endDraw();
    stamp.destroy();
  }

  protected onDestroy() {
    this.surface?.destroy();
    this.surface = undefined;
  }
}
