import { Scene } from "../Scene";

interface Props {
    x: number;
    y: number;
    scene: Scene;
    width: number;
    maxTime: number; // in milliseconds
}

export class TimerBar extends Phaser.GameObjects.Container {
    private frame: Phaser.GameObjects.Image;
    private bar: Phaser.GameObjects.Rectangle;
    private maxWidth: number;
    maxTime: number;
    currentTime: number;

    constructor({ x, y, scene, width, maxTime }: Props) {
        super(scene, x, y);

        this.maxTime = maxTime;
        this.currentTime = maxTime;
        this.maxWidth = width;

        // Random frame image (progress_bar_1 or progress_bar_2)
        const frameKey = Math.random() < 0.5 ? "progress_bar_1" : "progress_bar_2";
        this.frame = scene.add.image(0, 0, frameKey);
        this.frame.setOrigin(0.5).setDepth(10).setVisible(true);

        // Scale the frame to match the desired width, keeping aspect ratio
        const frameScaleX = (width + 7.5) / this.frame.width;
        this.frame.setScale(frameScaleX);

        // Bar (fills left-to-right based on remaining time)
        this.bar = scene.add.rectangle(0, -0.5, width, 2, 0x6abf9e);
        this.bar.setOrigin(0.5).setDepth(11);

        this.setVisible(false);
        this.add([this.frame, this.bar]);
    }

    setTime(value: number) {
        const isVisible = value > 0 && value < this.maxTime ? true : false;
        this.setVisible(isVisible);
        this.currentTime = Phaser.Math.Clamp(value, 0, this.maxTime);
        const timeRatio = this.currentTime / this.maxTime;
        this.bar.width = this.maxWidth * timeRatio;

        const color = Phaser.Display.Color.Interpolate.ColorWithColor(
            new Phaser.Display.Color(255, 0, 0), // Red/coral when almost done
            new Phaser.Display.Color(106, 191, 158), // Green/mint when full
            this.maxTime,
            this.currentTime,
        );
        this.bar.fillColor = Phaser.Display.Color.GetColor(
            color.r,
            color.g,
            color.b,
        );
    }
}
