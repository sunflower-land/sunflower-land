import { Scene } from "../Scene";
import { Enemy } from "../Types";

interface Props {
    x: number;
    y: number;
    scene: Scene;
    angle: number;
    enemies: Enemy[];
}

/**
 * Orange projectile fired by the Cannon.
 * Travels in a straight line at a constant speed in the specified angle.
 * Destroys itself if it hits an enemy (and destroys the enemy) or goes out of bounds.
 */
export class Orange extends Phaser.GameObjects.Container {
    scene: Scene;
    private sprite: Phaser.GameObjects.Sprite;
    private enemies: Enemy[];

    /**
     * Creates a new Orange projectile instance.
     * @param x       {number}                           X position in the world.
     * @param y       {number}                           Y position in the world.
     * @param scene   {Scene}                            The main Scene.
     * @param angle   {number}                           Angle of trajectory in radians.
     * @param enemies {Phaser.GameObjects.Container[]}   Array of enemies to check collisions against.
     */
    constructor({ x, y, scene, angle, enemies }: Props) {
        super(scene, x, y);
        this.scene = scene;
        this.enemies = enemies;

        this.sprite = this.scene.add.sprite(0, 0, "orange");
        this.add(this.sprite);
        this.setDepth(150);

        // Overlaps
        this.createOverlaps();

        scene.physics.add.existing(this);
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCircle(this.sprite.width / 2);

        body.setOffset(-this.sprite.width / 2, -this.sprite.height / 2);

        const speed = 250;
        body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

        scene.add.existing(this);

        this.updates();
    }

    private createOverlaps() {
        this.enemies.forEach(enemy => {
            this.scene.physics.add.overlap(this, enemy, () => {
                enemy.defeat();
            })
        })
    }

    /**
     * Subscribes to the scene's update loop to handle rotation, bounds checking,
     * and collisions with enemies.
     */
    private updates(): void {
        const updateKey = `orange-${Phaser.Math.RND.uuid()}`;
        this.scene.addToUpdate(updateKey, () => {
            if (!this.active) {
                this.scene.removeFromUpdate(updateKey);
                return;
            }

            this.sprite.angle += 15;

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
