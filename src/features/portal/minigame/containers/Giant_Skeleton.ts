import { BumpkinContainer } from "../Core/BumpkinContainer";
import { Scene } from "../Scene";
import { createAnimation } from "../Constants";
import { MachineInterpreter } from "../lib/Machine";

interface Props {
    x: number;
    y: number;
    scene: Scene,
    player?: BumpkinContainer,
}

export class Giant_Skeleton extends Phaser.GameObjects.Container {
    scene: Scene;
    private player?: BumpkinContainer;
    private sprite: Phaser.GameObjects.Sprite;
    private barrel: Phaser.GameObjects.Sprite;
    private spriteName: string;
    private direction: number = 1;
    private followGiant: boolean = true;

    constructor({ x, y, scene, player }: Props) {
        super(scene, x, y);
        this.scene = scene
        this.player = player;
        this.spriteName = "giant_skeleton";

        this.sprite = this.scene.add.sprite(0, 0, `${this.spriteName}_idle`);
        this.barrel = this.scene.add.sprite(0, -20, `${this.spriteName}_barrel`)
        this.add(this.barrel)
        this.scene.physics.add.existing(this.barrel);

        // Giant skeleton
        this.createGiant();
        this.giantMovemen();

        // Barrel
        this.throwBarrelLoop();

        // Overlap
        this.createOverlaps();

        scene.add.existing(this);
    }

    public get portalService() {
        return this.scene.registry.get("portalService") as
            | MachineInterpreter
            | undefined;
    }

    getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private createGiant() {
        this.scene.physics.add.existing(this.sprite);
        (this.sprite.body as Phaser.Physics.Arcade.Body)
            .setSize(this.sprite.width, this.sprite.height)
            .setCollideWorldBounds(true)
            .setImmovable(true);

        this.setSize(this.sprite.width, this.sprite.height);
        this.add(this.sprite);
        this.setDepth(10);

        // Animation
        createAnimation(this.scene, this.sprite, `${this.spriteName}_idle`, "idle", 0, 3, 4, -1)
    }

    private giantMovemen() {
        const moveLeft = this.x - 150;
        const moveRight = 330;
        this.x = moveLeft;

        let prevX = this.x

        this.scene.tweens.add({
            targets: this.sprite,
            x: moveRight,
            duration: 15000,
            ease: "Linear",
            yoyo: true,
            repeat: -1,
            onUpdate: (tween, target: any) => {
                if (this.followGiant) {
                    this.barrel.x = this.sprite.x;
                    this.barrel.y = this.sprite.y - 20;
                }

                const dx = target.x - prevX;
                if (dx < 0) {
                    this.sprite.flipX = true;  // moving left
                    this.direction = -1;
                    this.barrel.flipX = true;
                } else if (dx > 0) {
                    this.sprite.flipX = false; // moving right
                    this.direction = 1;
                    this.barrel.flipX = false;
                }
                prevX = target.x;
            }
        })
    }

    private throwBarrelLoop() {
        const delay = this.getRandomNumber(1000, 8000);
        this.scene.time.delayedCall(delay, () => {
            this.followGiant = false;
            (this.barrel.body as Phaser.Physics.Arcade.Body).enable = false;
            console.log("Barrel physics enabled?", (this.barrel.body as Phaser.Physics.Arcade.Body).enable);
            this.barrelMovement(() => {
                // After barrel resets, start next throw
                this.throwBarrelLoop();
            });
        });
    }

    private barrelMovement(onComplete?: () => void) {
        const body = this.barrel.body as Phaser.Physics.Arcade.Body;
        body.enable = true;
        body.setCollideWorldBounds(false);

        // Throw barrel
        const distance = this.direction === 1 ? "+=150" : "-=150"
        const valueY = this.getRandomNumber(50, 200)
        this.scene.tweens.add({
            targets: this.barrel,
            props: {
                x: { value: distance, duration: 3000, ease: 'Power2' },
                y: { value: `${valueY}`, duration: 2000, ease: 'Bounce' }
            },
        })

        this.scene.time.delayedCall(5000, () => {
            this.barrel.setPosition(this.sprite.x, this.sprite.y - 20);
            this.followGiant = true;
            this.barrel.setVisible(true)
            if (onComplete) onComplete();
        })

    }

    private createDamage() { }

    private createHit() { }

    private createEvents() { }

    private createOverlaps() {
        if (!this.player) return;
        this.scene.physics.add.collider(this, this.player);
        this.scene.physics.add.overlap(this.barrel, this.player, () => {
            this.barrel.setVisible(false);
            (this.barrel.body as Phaser.Physics.Arcade.Body).enable = false;
        });
    }

    private createDefeat() { }

}