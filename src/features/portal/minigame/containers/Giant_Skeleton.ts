import { BumpkinContainer } from "../Core/BumpkinContainer";
import { Scene } from "../Scene";
import { createAnimation } from "../Constants";
import { MachineInterpreter } from "../lib/Machine";
import { EventBus } from "../lib/EventBus";

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
        this.add([this.sprite, this.barrel])
        this.scene.physics.add.existing(this.barrel);

        // Giant skeleton
        this.createGiant();

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

    private createGiant() {
        this.scene.physics.add.existing(this.sprite);
        (this.sprite.body as Phaser.Physics.Arcade.Body)
            .setSize(this.sprite.width, this.sprite.height)
            .setCollideWorldBounds(true)
            .setImmovable(true);

        this.setSize(this.sprite.width, this.sprite.height);
        this.add(this.sprite);
        this.setDepth(0);

        createAnimation(this.scene, this.sprite, `${this.spriteName}_idle`, "idle", 0, 3, 4, -1)

        const moveLeft = this.x - 90;
        const moveRight = 335;
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
        const delay = Phaser.Math.Between(1000, 8000);
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
        if (!this.player) return;
        const body = this.barrel.body as Phaser.Physics.Arcade.Body;
        body.enable = true;
        body.setCollideWorldBounds(false);
        this.setDepth(200);

        const distance = this.direction === 1 ? "+=150" : "-=150"
        const valueY = this.player.getWorldTransformMatrix().ty - this.y;
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

    private createOverlaps() {
        if (!this.player) return;
        const enlargePlayer = 1.5;
        const deafaultScale = 1;

        this.scene.physics.add.collider(this, this.player);
        this.scene.physics.add.overlap(this.barrel, this.player, () => {
            this.barrel.setVisible(false);
            this.player?.setScale(enlargePlayer);
            (this.barrel.body as Phaser.Physics.Arcade.Body).enable = false;
            this.scene.time.delayedCall(3000, () => this.player?.setScale(deafaultScale))
        });
    }

    private createDamage() { }

    private createHit() { }

    private createEvents() { }

    private createDefeat() { }
}