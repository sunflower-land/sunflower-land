import { BumpkinContainer } from "../Core/BumpkinContainer";
import { Scene } from "../Scene";
import { createAnimation } from "../lib/Utils";
import { MachineInterpreter } from "../lib/Machine";
import { VISIBLE_AURA, NOT_VISIBLE_AURA } from "../Constants";

interface Props {
    x: number;
    y: number;
    scene: Scene,
    player?: BumpkinContainer,
}

export class Menace_Skeleton extends Phaser.GameObjects.Container {
    scene: Scene;
    private player?: BumpkinContainer;
    private sprite: Phaser.GameObjects.Sprite;
    private spriteName: string;
    private vege: Phaser.GameObjects.Sprite;
    private vegeSplat: Phaser.GameObjects.Sprite;
    private playerWorldX_Sprite?: number;
    private randomVege: string;
    private vegeList: string[];
    private flipX: boolean = false;
    private randomThrow: number;
    constructor({ x, y, scene, player }: Props) {
        super(scene, x, y);
        this.scene = scene
        this.player = player;
        this.spriteName = "sniper_skeleton";

        this.vegeList = ["carrot", "cabbage", "potato"];
        this.randomVege = Phaser.Math.RND.pick(this.vegeList);

        this.randomThrow = Phaser.Math.Between(-50, 50);
        this.flipX = this.randomThrow <= 0;

        this.sprite = this.scene.add.sprite(0, 0, `${this.spriteName}_move`).setVisible(false);
        this.vege = this.scene.add.sprite(0, 0, `${this.spriteName}_${this.randomVege}`).setVisible(false);
        this.vegeSplat = this.scene.add.sprite(0, 0, `${this.spriteName}_${this.randomVege}_splat`).setVisible(false);
        this.add([this.sprite, this.vege]);
        this.player?.setVisible(true)
        this.scene.physics.add.existing(this);
        (this.body as Phaser.Physics.Arcade.Body)
            .setSize(this.sprite.width, this.sprite.height);

        // Enemy
        this.scheduleMenace();

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

    private scheduleMenace() {
        const delay = Phaser.Math.Between(6000, 8000);
        this.scene.time.delayedCall(delay, () => {

            this.createMenace();
            this.scheduleMenace();
        });
    }

    private createMenace() {
        if (!this.player) return;

        this.player.setVisible(true);
        this.sprite.setVisible(true);
        this.playerWorldX_Sprite = this.player.getWorldTransformMatrix().tx;
        this.randomVege = Phaser.Math.RND.pick(this.vegeList);
        this.vege.setTexture(`${this.spriteName}_${this.randomVege}`);
        this.vege.setVisible(true);

        this.randomThrow = Phaser.Math.Between(-50, 50);
        this.flipX = this.randomThrow <= 0;

        const switchSide = this.flipX === true ? this.sprite.x + 10 : this.sprite.x - 10;
        this.flipX === true ? this.vege.setFlipX(true) : this.vege.setFlipX(false);
        this.sprite.setFlipX(this.flipX);
        this.vege.setPosition(switchSide, 0);

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

        this.scene.time.delayedCall(650, () => {

            this.foodMovement();
        });
    }

    private foodMovement() {
        if (!this.player) return;
        this.sprite.anims.remove("idle");
        this.add(this.vegeSplat)
        this.scene.physics.add.existing(this.vegeSplat);

        const splatBody = this.vegeSplat.body as Phaser.Physics.Arcade.Body;
        splatBody.enable = false;
        splatBody.setAllowGravity(false);
        splatBody.setImmovable(true);
        splatBody.setSize(15, 15, true);

        const playerWorldY = this.player.getWorldTransformMatrix().ty;
        const throwSpeed = playerWorldY < 297 ? 250 : 300;

        this.vege.setFlipX(this.flipX);
        this.vegeSplat.setFlipX(this.flipX);
        this.vegeSplat.setPosition(this.randomThrow, playerWorldY - this.y);
        console.log(playerWorldY, throwSpeed);

        this.scene.add.tween({
            targets: this.vege,
            x: this.randomThrow,
            y: playerWorldY - this.y,
            duration: throwSpeed,
            ease: 'Quad.Out',
            onComplete: () => {
                createAnimation(
                    this.scene,
                    this.sprite,
                    `${this.spriteName}_move`,
                    "move",
                    0,
                    3,
                    4,
                    -1
                );
            }
        });

        this.scene.time.delayedCall(throwSpeed, () => {
            this.vege.setVisible(false);
            this.vegeSplat.setVisible(true);
            splatBody.enable = true;
            createAnimation(
                this.scene,
                this.vegeSplat,
                `${this.spriteName}_${this.randomVege}_splat`,
                "splat",
                0,
                4,
                30,
                0
            );
        }
        );

        this.createReset();
    }

    private createReset() {
        this.scene.time.delayedCall(4000, () => {
            if (!this.player) return;
            this.vegeSplat.setVisible(false);
            (this.vegeSplat.body as Phaser.Physics.Arcade.Body).enable = false;
            (this.sprite.body as Phaser.Physics.Arcade.Body).enable = false;
            this.vege.setTexture(`${this.spriteName}_${this.randomVege}`);

            this.player?.sprite?.setVisible(true);
            this.player?.shadow?.setVisible(true);
            this.player.setVisible(true);
        });
    }

    private createOverlaps() {
        if (!this.player) return;
        this.scene.physics.add.overlap(this.vegeSplat, this.player, () => {
            this.vegeSplat.setVisible(false);
            
            if (this.player) {
                const aura = this.player.clothing.aura;
                
                if (!aura) {
                    // No aura in inventory
                    this.player.setVisible(false);
                } else if (VISIBLE_AURA.includes(aura)) {
                    // Aura is visible
                    this.player?.sprite?.setVisible(false);
                    this.player?.shadow?.setVisible(false);
                    this.player.showAura();
                } else if (NOT_VISIBLE_AURA.includes(aura)) {
                    // Aura is not visible
                    this.player.setVisible(false);
                } else {
                    // Default case
                    this.player.showAura();
                }
            }
            (this.vegeSplat.body as Phaser.Physics.Arcade.Body).enable = false;
        }
    )
    }

    private createDamage() {
        if (!this.player) return;
    }

    private createHit() { }

    private createEvents() { }

    private createDefeat() { }

    public defeat() {
        this.sprite.setVisible(false);
        this.vege.setVisible(false);
        this.vegeSplat.setVisible(false);
    }
}