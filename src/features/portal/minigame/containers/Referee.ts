import { Scene } from "../Scene";
import { createAnimation, onAnimationComplete } from "../lib/Utils";
import { REFEREE_EFFECT_DURATION, REFEREE_EFFECT_SCALE_MODIFIER, REFEREE_EFFECT_SPEED_MODIFIER } from "../Constants";

interface Props {
  x: number;
  y: number;
  scene: Scene;
}

const REFEREE_SCALE = 0.11;

export class Referee extends Phaser.GameObjects.Container {
  scene: Scene;
  private sprite: Phaser.GameObjects.Sprite;

  constructor({ x, y, scene }: Props) {
    super(scene, x, y);
    this.scene = scene;

    this.sprite = this.scene.add.sprite(0, 0, "referee")
      .setScale(REFEREE_SCALE)
    this.add(this.sprite);
    this.setDepth(2);

    createAnimation(this.scene, this.sprite, "referee", "idle", 0, 8, 10, -1);

    scene.physics.add.existing(this);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.sprite.width * REFEREE_SCALE, this.sprite.height * REFEREE_SCALE);
    body.setOffset(-this.sprite.width * REFEREE_SCALE / 2, -this.sprite.height * REFEREE_SCALE / 2);

    this.scene.add.existing(this);
  }

  public defeat() {
    createAnimation(
      this.scene,
      this.sprite,
      "referee_yellow_card",
      "action",
      0,
      18,
      10,
      0
    );

    onAnimationComplete(this.sprite, "referee_yellow_card_action_anim", () => {
      this.sprite?.play("referee_idle_anim", true);
      this.applyEffect();
    });
  }

  private applyEffect() {
    // 50% chance to target player or an enemy
    const isPlayerTarget = Math.random() < 0.5;

    // 50% chance to grow + slow OR shrink + speedup
    const isGrowAndSlow = Math.random() < 0.5;

    let targets: Phaser.GameObjects.Container[] = [];

    if (isPlayerTarget && this.scene.currentPlayer) {
      targets = [this.scene.currentPlayer];
    } else {
      const enemies = this.scene.allEnemies.filter(e => e !== this);
      if (enemies.length > 0) {
        targets = enemies;
      } else if (this.scene.currentPlayer) {
        targets = [this.scene.currentPlayer];
      }
    }

    if (targets.length === 0) return;

    targets.forEach(targetObj => {
      if (isGrowAndSlow) {
        targetObj.setScale(targetObj.scale + REFEREE_EFFECT_SCALE_MODIFIER);

        if (targetObj === this.scene.currentPlayer) {
          this.scene.velocity *= (1 - REFEREE_EFFECT_SPEED_MODIFIER);
        } else {
          const tweens = this.scene.tweens.getTweensOf(targetObj);
          tweens.forEach(t => t.setTimeScale(t.timeScale * (1 - REFEREE_EFFECT_SPEED_MODIFIER)));
        }
      } else {
        const newScale = Math.max(0.1, targetObj.scale - REFEREE_EFFECT_SCALE_MODIFIER);
        targetObj.setScale(newScale);

        if (targetObj === this.scene.currentPlayer) {
          this.scene.velocity *= (1 + REFEREE_EFFECT_SPEED_MODIFIER);
        } else {
          const tweens = this.scene.tweens.getTweensOf(targetObj);
          tweens.forEach(t => t.setTimeScale(t.timeScale * (1 + REFEREE_EFFECT_SPEED_MODIFIER)));
        }
      }
    });

    this.scene.time.delayedCall(REFEREE_EFFECT_DURATION, () => {
      targets.forEach(targetObj => {
        if (!targetObj || !targetObj.active) return;

        if (isGrowAndSlow) {
          targetObj.setScale(targetObj.scale - REFEREE_EFFECT_SCALE_MODIFIER);

          if (targetObj === this.scene.currentPlayer) {
            this.scene.velocity /= (1 - REFEREE_EFFECT_SPEED_MODIFIER);
          } else {
            const tweens = this.scene.tweens.getTweensOf(targetObj);
            tweens.forEach(t => t.setTimeScale(t.timeScale / (1 - REFEREE_EFFECT_SPEED_MODIFIER)));
          }
        } else {
          targetObj.setScale(targetObj.scale + REFEREE_EFFECT_SCALE_MODIFIER);

          if (targetObj === this.scene.currentPlayer) {
            this.scene.velocity /= (1 + REFEREE_EFFECT_SPEED_MODIFIER);
          } else {
            const tweens = this.scene.tweens.getTweensOf(targetObj);
            tweens.forEach(t => t.setTimeScale(t.timeScale / (1 + REFEREE_EFFECT_SPEED_MODIFIER)));
          }
        }
      });
    });
  }
}
