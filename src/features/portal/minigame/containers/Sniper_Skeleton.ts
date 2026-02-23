import { BumpkinContainer } from "../Core/BumpkinContainer";
import { Scene } from "../Scene";
import { createAnimation } from "../Constants";
import { MachineInterpreter } from "../lib/Machine";
import Phaser from "phaser";

interface Props {
    x: number;
    y: number;
    scene: Scene,
    player?: BumpkinContainer,
}

export class Sniper_Skeleton extends Phaser.GameObjects.Container {
    scene: Scene;
    private player?: BumpkinContainer;
    private sprite: Phaser.GameObjects.Sprite;
    private spriteName: string;
    private food: Phaser.GameObjects.Sprite;
    private playerWorldX_Sprite?: number;
    private randomFood: string;
    private foodList: string[];

    constructor({ x, y, scene, player }: Props) {
        super(scene, x, y);
        this.scene = scene
        this.player = player;
        this.spriteName = "sniper_skeleton";

        this.foodList = ["tomato"];
        this.randomFood = Phaser.Math.RND.pick(this.foodList);

        this.sprite = this.scene.add.sprite(0, 0, `${this.spriteName}_idle`).setScale(1);
        this.food = this.scene.add.sprite(0, 0, `${this.spriteName}_${this.randomFood}`).setScale(1).setVisible(false);
        this.add([this.sprite, this.food]);
        this.sprite.setVisible(false);

        // Sniper Skeleton starts with glitch effect
        this.scene.time.addEvent({
            delay: 5000,
            callback: this.glitchEffect,
            callbackScope: this,
            loop: true
        });

        // Overlaps
        this.createOverlaps();

        scene.add.existing(this);
    }

    public get portalService() {
        return this.scene.registry.get("portalService") as
            | MachineInterpreter
            | undefined;
    }

    private glitchEffect(duration: number = 150) {
        if (!this.player) return;
        this.sprite.setVisible(true);
        const sprite = this.sprite;
        const originalX = this.player.getWorldTransformMatrix().tx - this.x;
        const originalY = sprite.y;
        const originalScaleX = sprite.scaleX;
        const originalScaleY = sprite.scaleY;

        this.scene.tweens.add({
            targets: sprite,
            x: originalX + Phaser.Math.Between(-4, 4),
            y: originalY + Phaser.Math.Between(-4, 4),
            scaleX: originalScaleX + Phaser.Math.FloatBetween(-0.08, 0.08),
            scaleY: originalScaleY + Phaser.Math.FloatBetween(-0.08, 0.08),
            alpha: Phaser.Math.FloatBetween(0.7, 1),
            duration: 30,
            yoyo: true,
            repeat: Math.floor(duration / 30),
            ease: 'steps(2)',
            onComplete: () => {
                sprite.setPosition(originalX, originalY);
                sprite.setScale(originalScaleX, originalScaleY);
                sprite.setAlpha(1);
                // After glitch, create sniper skeleton
                this.createSniper();
            }
        });

        if (sprite.anims) {
            this.scene.time.addEvent({
                delay: 20,
                repeat: 5,
                callback: () => {
                    const randomFrame = Phaser.Math.Between(0, 3);
                    sprite.setFrame(randomFrame);
                }
            });
        }
    }

    private createSniper() {
        if (!this.player) return;
        this.playerWorldX_Sprite = this.player.getWorldTransformMatrix().tx;
        this.randomFood = Phaser.Math.RND.pick(this.foodList);
        this.food.setTexture(`${this.spriteName}_${this.randomFood}`);
        this.food.setVisible(true);

        const flipX = this.player.x < this.x ? true : false;
        const switchFoodSide = flipX === true ? this.playerWorldX_Sprite - this.x + 10 : this.playerWorldX_Sprite - this.x - 10;
        flipX === true ? this.food.setFlipX(true) : this.food.setFlipX(false);
        this.sprite.setFlipX(flipX);

        this.sprite.setPosition(this.playerWorldX_Sprite - this.x, 0);
        this.food.setPosition(switchFoodSide, 0);

        this.scene.physics.add.existing(this.sprite);
        const body = this.sprite.body as Phaser.Physics.Arcade.Body
        body.setSize(this.sprite.width, this.sprite.height)
            .setCollideWorldBounds(true)
            .setImmovable(true);

        this.setSize(this.sprite.width, this.sprite.height);
        this.setDepth(10);

        createAnimation(
            this.scene,
            this.sprite,
            `${this.spriteName}_idle`,
            "idle",
            0,
            3,
            4,
            0
        );

        this.scene.time.delayedCall(300, () =>
            // Throw food after short delay
            this.foodMovement()
        )
    }

    private foodMovement() {
        if (!this.player) return;
        this.food.setVisible(true);
        this.scene.physics.add.existing(this.food);
        (this.food.body as Phaser.Physics.Arcade.Body).enable = true;
        const playerWorldX = this.player.getWorldTransformMatrix().tx;
        const playerWorldY = this.player.getWorldTransformMatrix().ty;

        const flipX = this.player.x < this.x ? true : false;
        const targetX = flipX === true ? playerWorldX - this.x - 15 : playerWorldX - this.x + 15;

        this.scene.add.tween({
            targets: this.food,
            x: targetX,
            y: playerWorldY - this.y,
            duration: 500,
            ease: 'Quad.Out',
            onComplete: () => {
                createAnimation(
                    this.scene,
                    this.food,
                    `${this.spriteName}_${this.randomFood}_splat`,
                    "splat",
                    0,
                    4,
                    15,
                    0
                );
                this.sprite.setVisible(false);
            }
        });

        this.scene.time.delayedCall(2000, () => {
            this.food.setVisible(false);
            (this.food.body as Phaser.Physics.Arcade.Body).enable = false;
            (this.sprite.body as Phaser.Physics.Arcade.Body).enable = false;
            this.food.setTexture(`${this.spriteName}_${this.randomFood}`);
            // console.log("Food physics enabled?", (this.food.body as Phaser.Physics.Arcade.Body).enable);
        });
    }

    private createDamage() { }

    private createHit() { }

    private createEvents() { }

    private createOverlaps() {
        if (!this.player) return;
        this.scene.physics.add.overlap(this.food, this.player, () => {
            this.food.setVisible(false);
            // console.log("Overlap triggered!"); // Should NOT appear after disabling
            (this.food.body as Phaser.Physics.Arcade.Body).enable = false;
            (this.sprite.body as Phaser.Physics.Arcade.Body).enable = false;
        });
    }

    private createDefeat() { }

}