import { BumpkinContainer } from "../Core/BumpkinContainer";
import { Scene } from "../Scene";
import { createAnimation } from "../lib/Utils";
import { WALKING_SPEED } from "../Constants";
import { MachineInterpreter } from "../lib/Machine";

interface Props {
    x: number,
    y: number,
    scene: Scene,
    player?: BumpkinContainer
}

export class Blast_Skeleton extends Phaser.GameObjects.Container {
    scene: Scene;
    private player?: BumpkinContainer;
    private sprite: Phaser.GameObjects.Sprite;
    private spriteName: string;
    private food: Phaser.GameObjects.Sprite;
    private tomatoBomb: Phaser.GameObjects.Sprite;

    constructor({ x, y, scene, player }: Props) {
        super(scene, x, y);
        this.scene = scene;
        this.player = player;
        this.spriteName = "sniper_skeleton";

        this.sprite = this.scene.add.sprite(0, 0, `${this.spriteName}_idle`).setScale(1.2).setVisible(false);
        this.food = this.scene.add.sprite(0, +5, `${this.spriteName}_tomato`).setVisible(false);
        this.tomatoBomb = this.scene.add.sprite(0, 0, `${this.spriteName}_tomato_screenSplat`).setVisible(false);
        this.add([this.sprite, this.tomatoBomb, this.food])
        scene.physics.add.existing(this);
        (this.body as Phaser.Physics.Arcade.Body)
            .setSize(this.sprite.width, this.sprite.height);

        // Enemy
        this.scheduleAction();

        // Overlaps
        this.createOverlaps();

        // Events
        this.createEvents();

        // Damage
        this.createDamage();

        // Hit
        this.createHit();

        // Defeat
        this.createDefeat

        scene.add.existing(this);
    }

    public get portalService() {
        return this.scene.registry.get("portalService") as
            | MachineInterpreter
            | undefined;
    }

    private scheduleAction() {
        const delay = Phaser.Math.Between(6000, 8000)
        this.scene.time.delayedCall(
            delay, () => {

                this.createBlast();
                this.scheduleAction();
            }
        )
    }

    private createBlast() {
        if (!this.player) return;

        this.scene.physics.add.existing(this.tomatoBomb);
        const body = this.tomatoBomb.body as Phaser.Physics.Arcade.Body;
        body.enable = false;
        const playerWorldX = this.player.getWorldTransformMatrix().tx - this.x;
        const playerWorldY = this.player.getWorldTransformMatrix().ty - this.y;

        this.tomatoBomb.setVisible(false);
        this.sprite.setVisible(true);
        this.food.setVisible(true);
        this.setDepth(10000);

        this.scene.add.tween({
            targets: [this.sprite, this.food, this.tomatoBomb],
            x: playerWorldX,
            y: playerWorldY - 20,
            duration: 2000,
            ease: "Quad.Out",
            onComplete: () => {
                createAnimation(
                    this.scene,
                    this.food,
                    `${this.spriteName}_tomato_rolling`,
                    "tomato_rolling",
                    0,
                    7,
                    20,
                    0
                );

                this.sprite.setVisible(false);

                this.food.once("animationcomplete", () => {
                    body.enable = true;
                    this.food.setVisible(false);
                    this.tomatoBomb.setVisible(true);
                    createAnimation(
                        this.scene,
                        this.tomatoBomb,
                        `${this.spriteName}_tomato_screenSplat`,
                        "tomato_screenSplat",
                        0,
                        4,
                        20,
                        0
                    );

                    this.createReset();
                });
            },
        });
    }

    private createReset() {
        this.scene.time.delayedCall(1000, () => {

            this.tomatoBomb.setVisible(false);
            this.sprite.setPosition(0, 0);
            this.food.setPosition(0, 0);
            this.tomatoBomb.setPosition(0, 0);
            this.food.setTexture(`${this.spriteName}_tomato`);
            (this.tomatoBomb.body as Phaser.Physics.Arcade.Body).enable = false;
        });

        this.scene.time.delayedCall(2000, () => {
            this.scene.velocity = WALKING_SPEED;
        });
    }

    private createOverlaps() {
        if (!this.player) return;
        this.scene.physics.add.overlap(this.player, this.tomatoBomb, () => {
            this.scene.velocity = 25;
        })
    }

    private createDamage() {
        if (!this.player) return;
    }

    private createHit() { }

    private createEvents() { }

    private createDefeat() { }

    public defeat() {
        this.sprite.setVisible(false);
        this.food.setVisible(false);
        this.tomatoBomb.setVisible(false);
    }
}