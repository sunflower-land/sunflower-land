import type Phaser from "phaser";
import oilBarrels from "assets/land/oil_barrels.webp";
import oilIcon from "assets/resources/oil.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import type { MachineState } from "features/game/lib/gameMachine";
import { formatNumber } from "lib/utils/formatNumber";
import { translate } from "lib/i18n/translate";
import {
  queueArt,
  resolveArtObject,
  type ArtObject,
} from "../../core/animated";
import { queueImage, runLoader } from "../../core/assets";
import { nativeScale } from "../../core/pixelArt";
import { makeClickable } from "../../core/clickable";
import { DEPTHS } from "../../core/depths";
import { EntityRenderer } from "../EntityRenderer";
import { LabelChip } from "../../components/LabelSprite";

/**
 * The greenhouse oil machine [greenhouse/GreenhouseOil.tsx]: the barrels at
 * (60.5, 52) inside the 176x192 room, the oil-count label floating above,
 * smoke while anything grows, and a click opening the add-oil modal.
 */

type Slice = {
  oil: number;
  planting: boolean;
};

/** Room-centred world geometry [GreenhouseInside.tsx wrapper at (60.5, 52)]. */
const ROOM = { width: 176, height: 192 };
const BARRELS = {
  x: -ROOM.width / 2 + 60.5,
  y: -ROOM.height / 2 + 52,
  width: 55,
  height: 20,
};

export class GreenhouseOilRenderer extends EntityRenderer<Slice> {
  private barrels?: Phaser.GameObjects.Image;
  private zone?: Phaser.GameObjects.Zone;
  private chip?: LabelChip;
  private chipKey?: string;
  private smoke?: ArtObject;

  selector(state: MachineState): Slice {
    const greenhouse = state.context.state.greenhouse;
    return {
      oil: greenhouse.oil,
      planting: Object.values(greenhouse.pots).some((pot) => !!pot.plant),
    };
  }

  equals = (a: Slice, b: Slice) => a.oil === b.oil && a.planting === b.planting;

  async sync(slice: Slice) {
    const token = this.beginSync();
    queueImage(this.scene, oilBarrels);
    queueImage(this.scene, oilIcon);
    queueArt(this.scene, SUNNYSIDE.building.smoke);
    LabelChip.queueAssets(this.scene);
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    const depth = DEPTHS.ENTITY_BASE + BARRELS.y + BARRELS.height;

    if (!this.barrels && this.scene.textures.exists(oilBarrels)) {
      this.barrels = this.scene.add
        .image(BARRELS.x, BARRELS.y, oilBarrels)
        .setOrigin(0, 0)
        .setDepth(depth);
      nativeScale(this.barrels, BARRELS.width);
      this.zone = this.scene.add
        .zone(BARRELS.x, BARRELS.y - 8, BARRELS.width, BARRELS.height + 8)
        .setOrigin(0, 0)
        .setDepth(depth);
      makeClickable(
        this.scene,
        this.zone,
        () => this.bridge.farmModal.open("greenhouseOil"),
        { glow: () => this.barrels },
      );
    }

    // Oil label, centred above the barrels [GreenhouseOil.tsx top -6].
    const text = translate("greenhouse.oilInMachine", {
      oil: formatNumber(slice.oil),
    });
    const chipKey = `${text}#${slice.oil <= 0}`;
    if (chipKey !== this.chipKey) {
      this.chip?.destroy();
      this.chipKey = chipKey;
      this.chip = new LabelChip(this.scene, {
        x: BARRELS.x + BARRELS.width / 2,
        y: BARRELS.y - 6,
        text,
        icon: oilIcon,
        iconWidth: 7, // native oil.webp width — 1:1 pixels
        type: slice.oil <= 0 ? "danger" : "default",
        depth: depth + 1,
      });
      this.chip.container.x -= this.chip.width / 2;
    }

    // Smoke while any pot grows [GreenhouseOil.tsx left 58, bottom 30].
    if (slice.planting) {
      this.smoke = resolveArtObject(
        this.scene,
        this.smoke,
        SUNNYSIDE.building.smoke,
      );
      if (this.smoke) {
        this.smoke.setOrigin(0, 1);
        const width = 20;
        this.smoke.setScale(width / this.smoke.width);
        this.smoke.setPosition(BARRELS.x + 58, BARRELS.y + BARRELS.height - 30);
        this.smoke.setDepth(depth + 1);
      }
    } else {
      this.smoke?.destroy();
      this.smoke = undefined;
    }
  }

  protected onDestroy() {
    this.barrels?.destroy();
    this.zone?.destroy();
    this.chip?.destroy();
    this.smoke?.destroy();
  }
}
