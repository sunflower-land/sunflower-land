import { Scene } from "../Scene";
import { Enemy } from "../Types";
import { createAnimation, onAnimationComplete } from "../lib/Utils";

interface Props {
    x: number;
    y: number;
    scene: Scene;
    angle: number;
    enemies: Enemy[];
}

/**
 * PlayerFood projectile fired by the Bumpkin player.
 * Travels vertically upward at a constant speed.
 * Does NOT rotate while in flight.
 * On hitting an enemy, plays a one-shot "cabbage_splat" animation
 * on its own sprite and then destroys itself.
 */
export class PlayerFood extends Phaser.GameObjects.Container {
    scene: Scene;
    private sprite: Phaser.GameObjects.Sprite;
    private enemies: Enemy[];
    private isDefeating: boolean = false;

    /**
     * Creates a new PlayerFood projectile instance.
     * @param x       {number}                           X position in the world.
     * @param y       {number}                           Y position in the world.
     * @param scene   {Scene}                            The main Scene.
     * @param angle   {number}                           Angle of trajectory in radians (typically -Math.PI / 2 for upward).
     * @param enemies {Phaser.GameObjects.Container[]}   Array of enemies to check collisions against.
     */
    constructor({ x, y, scene, angle, enemies }: Props) {
        super(scene, x, y);
        this.scene = scene;
        this.enemies = enemies;

        this.sprite = this.scene.add.sprite(0, 0, "cabbage");
        this.add(this.sprite);
        this.setDepth(150);

        // Overlaps
        this.createOverlaps();

        scene.physics.add.existing(this);
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCircle(this.sprite.width / 2);
        body.setOffset(-this.sprite.width / 2, -this.sprite.height / 2);

        const speed = 300;
        body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

        scene.add.existing(this);

        this.updates();
    }

    private createOverlaps() {
        this.enemies.forEach(enemy => {
            this.scene.physics.add.overlap(this, enemy, () => {
                if (this.isDefeating) return;
                this.isDefeating = true;

                // Stop movement
                const body = this.body as Phaser.Physics.Arcade.Body;
                body.setVelocity(0, 0);

                // Defeat enemy
                enemy.defeat();

                // Play splat animation once, then destroy
                createAnimation(this.scene, this.sprite, "cabbage_splat", "action", 0, 4, 10, 0);
                onAnimationComplete(this.sprite, "cabbage_splat_action_anim", () => {
                    this.destroy();
                });
            });
        });
    }

    /**
     * Subscribes to the scene's update loop to handle bounds checking.
     * The projectile does NOT rotate.
     */
    private updates(): void {
        const updateKey = `playerFood-${Phaser.Math.RND.uuid()}`;
        this.scene.addToUpdate(updateKey, () => {
            if (!this.active) {
                this.scene?.removeFromUpdate(updateKey);
                return;
            }

            if (
                this.x < 0 || this.x > (this.scene.map?.widthInPixels ?? 1000) ||
                this.y < 0 || this.y > (this.scene.map?.heightInPixels ?? 1000)
            ) {
                this.scene.removeFromUpdate(updateKey);
                this.destroy();
                return;
            }
        });
    }
}
