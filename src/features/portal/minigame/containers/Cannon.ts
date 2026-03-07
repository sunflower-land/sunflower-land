import { BumpkinContainer } from "../Core/BumpkinContainer";
import { EventBus } from "../lib/EventBus";
import { Scene } from "../Scene";
import { Side } from "../Types";

interface Props {
    x: number;
    y: number;
    scene: Scene,
    side: Side,
    player?: BumpkinContainer,
}

// Radius from cannon center to where the player stands while using it
const PLAYER_ORBIT_RADIUS = 20;

// How many dashes to draw in the aim line
const DASH_COUNT = 17;
const DASH_LENGTH = 6;
const DASH_GAP = 4;

/**
 * Cannon game object. Sits at a fixed position on the map.
 * When the player stands within range and presses E, the cannon enters
 * aiming mode: the sprite rotates toward the mouse cursor, a dashed
 * trajectory line is drawn, and the player is repositioned at the base.
 * @fires   EventBus#activate-cannon-button — every frame, emitting status: { isActivated, side, position }.
 * @listens EventBus#cannon-aim-start — triggers startAiming().
 * @listens EventBus#cannon-aim-stop  — triggers stopAiming().
 */
export class Cannon extends Phaser.GameObjects.Container {
    scene: Scene;
    private player?: BumpkinContainer;
    private sprite: Phaser.GameObjects.Sprite;
    private spriteName: string;
    private side: Side;

    // Aim graphics (dashed line)
    private aimGraphics: Phaser.GameObjects.Graphics;

    // Current aim angle in radians (0 = right, PI/2 = down, etc.)
    private aimAngle: number = Math.PI / 2; // default pointing down

    // Rotation speed for the cannon when aiming (radians per frame)
    private readonly AIM_SPEED: number = 0.025;

    // Whether this cannon is currently being operated by the player
    private isActive: boolean = false;

    /**
     * Creates a new Cannon instance.
     * @param x      {number}           X position in the world.
     * @param y      {number}           Y position in the world.
     * @param scene  {Scene}            The main Scene.
     * @param side   {Side}             Which side this cannon belongs to.
     * @param player {BumpkinContainer} (optional) Reference to the player container.
     */
    constructor({ x, y, scene, side, player }: Props) {
        super(scene, x, y);
        this.scene = scene;
        this.side = side;
        this.player = player;

        // Sprite
        this.spriteName = "cannon";
        this.sprite = this.scene.add.sprite(0, 0, this.spriteName);

        // Aim graphics (world-space, not inside the container)
        this.aimGraphics = this.scene.add.graphics();
        this.aimGraphics.setDepth(500);
        this.aimGraphics.setVisible(false);

        // Physics on the container body
        scene.physics.add.existing(this);
        (this.body as Phaser.Physics.Arcade.Body)
            .setSize(this.sprite.width, this.sprite.height)
            .setImmovable(true)
            .setCollideWorldBounds(true);

        this.setSize(this.sprite.width, this.sprite.height);
        this.add(this.sprite);
        this.setDepth(10);

        // Register proximity check + aim update
        this.updates();

        // Listen for aim-mode toggle from Scene
        EventBus.on("cannon-aim-start", (data: { side: Side }) => {
            if (data.side === this.side) this.startAiming();
        });

        EventBus.on("cannon-aim-stop", (data: { side: Side }) => {
            if (data.side === this.side) this.stopAiming();
        });

        scene.add.existing(this);
    }

    /**
     * Returns the current aim angle in radians.
     * 0 = right, PI/2 = down, PI = left, -PI/2 = up.
     * @returns {number} Aim angle in radians.
     */
    public get currentAngle(): number {
        return this.aimAngle;
    }

    /**
     * Activates mouse-aim mode for this cannon.
     * Should be called only when the player is within proximity range
     * and has pressed the interaction key.
     * @fires EventBus#(internal graphics update) — redraws trajectory each frame.
     */
    public startAiming(): void {
        this.isActive = true;
        this.aimAngle = -Math.PI / 2;
        this.aimGraphics.setVisible(true);
    }

    /**
     * Deactivates mouse-aim mode for this cannon.
     * Hides aim graphics and resets cannon rotation.
     */
    public stopAiming(): void {
        this.isActive = false;
        this.aimGraphics.setVisible(false);
        this.sprite.setAngle(0);
    }

    /**
     * Registers a per-frame update loop for this cannon using scene.addToUpdate.
     * Evaluates proximity to the player and handles active aiming.
     * @fires EventBus#activate-cannon-button — emitted with activation state.
     */
    private updates(): void {
        this.scene.addToUpdate("cannon-" + this.side, () => {
            const distance = Phaser.Math.Distance.BetweenPoints(
                this.player as BumpkinContainer,
                this,
            );
            if (distance > 40) {
                EventBus.emit("activate-cannon-button", {
                    isActivated: false,
                    side: this.side,
                });
            } else {
                EventBus.emit("activate-cannon-button", {
                    isActivated: true,
                    side: this.side,
                    position: { x: this.x, y: this.y },
                });
            }

            if (!this.isActive) return;

            this.updateAim();
        });
    }

    /**
     * Rotates the cannon sprite and repositions the player based on
     * keyboard inputs (A/D or Left/Right arrows).
     * Called every frame while isActive is true.
     */
    private updateAim(): void {
        const keys = this.scene.cursorKeys;
        if (!keys) return;

        const leftDown = keys.left.isDown || keys.a?.isDown;
        const rightDown = keys.right.isDown || keys.d?.isDown;

        if (leftDown) {
            this.aimAngle -= this.AIM_SPEED;
        } else if (rightDown) {
            this.aimAngle += this.AIM_SPEED;
        }

        const spriteDegrees = Phaser.Math.RadToDeg(this.aimAngle) + 90;
        this.sprite.setAngle(spriteDegrees);
        this.repositionPlayer();
        this.drawAimLine();
    }

    /**
     * Repositions the player sprite at the base of the cannon,
     * opposite to the current aim direction, and flips the player
     * sprite to face inward.
     */
    private repositionPlayer(): void {
        if (!this.player) return;

        const baseAngle = this.aimAngle + Math.PI;
        const offsetX = Math.cos(baseAngle) * PLAYER_ORBIT_RADIUS;
        const offsetY = Math.sin(baseAngle) * PLAYER_ORBIT_RADIUS;

        this.player.setPosition(
            this.x + offsetX,
            this.y + offsetY,
        );

        if (Math.cos(this.aimAngle) >= 0) {
            this.player.faceRight();
        } else {
            this.player.faceLeft();
        }
    }

    /**
     * Draws a dashed trajectory line from the barrel tip toward the cursor.
     * Automatically handles fading out longer dashes.
     */
    private drawAimLine(): void {
        this.aimGraphics.clear();

        const barrelTipX = this.x + Math.cos(this.aimAngle) * (this.sprite.height / 2 + 4);
        const barrelTipY = this.y + Math.sin(this.aimAngle) * (this.sprite.height / 2 + 4);

        const step = DASH_LENGTH + DASH_GAP;

        this.aimGraphics.lineStyle(1.5, 0xffffff, 0.85);

        for (let i = 0; i < DASH_COUNT; i++) {
            const startDist = i * step;
            const endDist = startDist + DASH_LENGTH;

            const alpha = 1 - (i / DASH_COUNT) * 0.7;
            this.aimGraphics.lineStyle(1.5, 0xffffff, alpha);

            const x1 = barrelTipX + Math.cos(this.aimAngle) * startDist;
            const y1 = barrelTipY + Math.sin(this.aimAngle) * startDist;
            const x2 = barrelTipX + Math.cos(this.aimAngle) * endDist;
            const y2 = barrelTipY + Math.sin(this.aimAngle) * endDist;

            this.aimGraphics.beginPath();
            this.aimGraphics.moveTo(x1, y1);
            this.aimGraphics.lineTo(x2, y2);
            this.aimGraphics.strokePath();
        }

        this.aimGraphics.fillStyle(0xffffff, 0.9);
        this.aimGraphics.fillCircle(barrelTipX, barrelTipY, 1.5);
    }
}