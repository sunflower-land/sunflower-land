import type Phaser from "phaser";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState, TemperateSeasonName } from "features/game/types/game";
import { getLandImage } from "features/game/expansion/components/LandBase";
import { queueImage, runLoader } from "../core/assets";
import { DEPTHS } from "../core/depths";
import { EntityRenderer } from "../entities/EntityRenderer";

/**
 * The composite land sprite. The art is authored at 16 px/tile with the world
 * origin at its exact centre (see getLandImage's doc), so it renders at scale
 * 1 centred on (0,0) — the same contract the DOM farm's origin-centred
 * wrapper relies on.
 */

type Slice = {
  island: GameState["island"];
  season: TemperateSeasonName;
  expansionCount: number;
};

export class LandBaseLayer extends EntityRenderer<Slice> {
  private sprite: Phaser.GameObjects.Image | undefined;

  selector(state: MachineState): Slice {
    return {
      island: state.context.state.island,
      season: state.context.state.season.season,
      expansionCount:
        state.context.state.inventory["Basic Land"]?.toNumber() ?? 3,
    };
  }

  equals = (a: Slice, b: Slice) =>
    a.island === b.island &&
    a.season === b.season &&
    a.expansionCount === b.expansionCount;

  async sync({ island, season, expansionCount }: Slice) {
    const token = this.beginSync();
    const texture = getLandImage(island, expansionCount, season);
    queueImage(this.scene, texture);
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    this.sprite?.destroy();
    this.sprite = this.scene.add
      .image(0, 0, texture)
      .setOrigin(0.5, 0.5)
      .setDepth(DEPTHS.LAND_BASE);
  }

  protected onDestroy() {
    this.sprite?.destroy();
    this.sprite = undefined;
  }
}
