import type Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import { queueImage } from "../core/assets";

/**
 * The visiting help affordance [VisitingPet.tsx / Monument.tsx / Manor.tsx]:
 * a 20-wide disc with the drag icon, floated off the entity's top-right
 * corner (the DOM's -top-4 -right-4).
 */

export function queueHelpDiscAssets(scene: Phaser.Scene) {
  queueImage(scene, SUNNYSIDE.icons.disc);
  queueImage(scene, SUNNYSIDE.icons.drag);
}

export function addHelpDisc(
  scene: Phaser.Scene,
  box: { x: number; y: number; width: number },
  depth: number,
): Phaser.GameObjects.Image[] {
  if (!scene.textures.exists(SUNNYSIDE.icons.disc)) return [];
  const x = box.x + box.width - 4;
  const y = box.y - 6;
  const disc = scene.add.image(x, y, SUNNYSIDE.icons.disc).setOrigin(0.5, 0.5);
  disc.setScale(20 / disc.width);
  disc.setDepth(depth);
  const drag = scene.add.image(x, y, SUNNYSIDE.icons.drag).setOrigin(0.5, 0.5);
  drag.setScale(14 / drag.width);
  drag.setDepth(depth + 0.1);
  return [disc, drag];
}
