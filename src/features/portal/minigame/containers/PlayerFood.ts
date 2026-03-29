import { Scene } from "../Scene";
import { Enemy, PlayerFoodConfig, PlayerFoodType } from "../Types";
import { createAnimation, onAnimationComplete } from "../lib/Utils";
import { PLAYER_FOOD_CONFIG } from "../Constants";
import { Chest } from "./Chest";


interface Props {
    x: number;
    y: number;
    scene: Scene;
    angle: number;
    enemies: Enemy[];
    type?: PlayerFoodType;
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
    private foodType: PlayerFoodType;
    private config: PlayerFoodConfig;
    private boomerangReturned: boolean = false;

    /**
     * Creates a new PlayerFood projectile instance.
     * @param x       {number}                           X position in the world.
     * @param y       {number}                           Y position in the world.
     * @param scene   {Scene}                            The main Scene.
     * @param angle   {number}                           Angle of trajectory in radians (typically -Math.PI / 2 for upward).
     * @param enemies {Phaser.GameObjects.Container[]}   Array of enemies to check collisions against.
     */
    constructor({ x, y, scene, angle, enemies, type = "cabbage" }: Props) {
        super(scene, x, y);
        this.scene = scene;
        this.enemies = enemies;
        this.foodType = type;
        this.config = PLAYER_FOOD_CONFIG[this.foodType];

        this.sprite = this.scene.add.sprite(0, 0, this.config.texture).setScale(this.config.scale);
        this.setY(this.y - (this.sprite.height * this.config.scale) / 2);
        this.add(this.sprite);
        this.setDepth(2000);

        // Overlaps
        this.createOverlaps();

        scene.physics.add.existing(this);
        const body = this.body as Phaser.Physics.Arcade.Body;
        const hitRadius = (this.sprite.displayWidth / 2) * this.config.hitRadiusScale;
        body.setCircle(hitRadius);
        body.setOffset(-hitRadius, -hitRadius);

        body.setVelocity(Math.cos(angle) * this.config.speed, Math.sin(angle) * this.config.speed);

        scene.add.existing(this);

        this.updates();
    }

    private createOverlaps() {
        if (!this.scene.currentPlayer) return;

        this.enemies.forEach(enemy => {
            this.scene.physics.add.overlap(this, enemy, () => {
                if (this.isDefeating && !this.config.noEnemyContact) return;
                this.isDefeating = true;

                // Defeat enemy
                if (!enemy.isDefeated) {
                    enemy.defeat();
                };

                if (!this.config.noEnemyContact) {
                    // Stop movement
                    const body = this.body as Phaser.Physics.Arcade.Body;
                    body.setVelocity(0, 0);

                    // Play splat animation once, then destroy
                    this.sprite.setScale(1);
                    createAnimation(this.scene, this.sprite, this.config.splatTexture, "action", 0, 4, 10, 0);
                    onAnimationComplete(this.sprite, `${this.config.splatTexture}_action_anim`, () => {
                        this.destroy();
                    });
                }
            });
        });

        this.scene.chests.forEach(chest => {
            this.scene.physics.add.overlap(this, chest, () => {
                if (chest.isOpened) return;
                chest.onFoodHit();
                const body = this.body as Phaser.Physics.Arcade.Body;
                const angle = Math.PI / 2;
                body.setVelocity(Math.cos(angle) * this.config.speed, Math.sin(angle) * this.config.speed);
            });
        });

        this.scene.physics.add.overlap(this, this.scene.currentPlayer, () => {
            this.scene.currentPlayer?.hurt();
            this.destroy();
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

            if (this.config.spins) {
                this.sprite.angle += 10;
            }

            if (this.config.boomerang && !this.boomerangReturned && this.y <= 20) {
                this.boomerangReturned = true;
                const body = this.body as Phaser.Physics.Arcade.Body;
                body.setVelocity(-body.velocity.x, -body.velocity.y);
            }

            if (
                this.x < -100 || this.x > (this.scene.map?.widthInPixels ?? 1000) + 100 ||
                this.y < -100 || this.y > (this.scene.map?.heightInPixels ?? 1000) + 100
            ) {
                this.scene.removeFromUpdate(updateKey);
                this.destroy();
                return;
            }
        });
    }
}
