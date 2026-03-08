import { Scene } from "../Scene";

interface Props {
    x: number;
    y: number;
    scene: Scene;
    width: number;
    maxTime: number; // in milliseconds
}

export class TimerBar extends Phaser.GameObjects.Container {
    private shadow: Phaser.GameObjects.Rectangle;
    private border: Phaser.GameObjects.Rectangle;
    private background: Phaser.GameObjects.Rectangle;
    private bar: Phaser.GameObjects.Rectangle;
    private maxWidth: number;
    maxTime: number;
    currentTime: number;

    constructor({ x, y, scene, width, maxTime }: Props) {
        super(scene, x, y);

        this.maxTime = maxTime;
        this.currentTime = maxTime;
        this.maxWidth = width;

        // Shadow/Depth
        this.shadow = scene.add.rectangle(0, 2, width + 2, 2, 0xb8b8b8);
        this.shadow.setOrigin(0.5);

        // Border
        this.border = scene.add.rectangle(0, 0, width + 2, 4, 0xffffff);
        this.border.setOrigin(0.5);

        // Background
        this.background = scene.add.rectangle(0, 0, width, 2, 0x000);
        this.background.setOrigin(0.5);

        // Bar
        this.bar = scene.add.rectangle(0, 0, width, 2, 0x6abf9e);
        this.bar.setOrigin(0.5);

        this.setVisible(false);
        this.add([this.shadow, this.border, this.background, this.bar]);
    }

    setTime(value: number) {
        const isVisible = value > 0 && value < this.maxTime ? true : false;
        this.setVisible(isVisible);
        this.currentTime = Phaser.Math.Clamp(value, 0, this.maxTime);
        const timeRatio = this.currentTime / this.maxTime;
        this.bar.width = this.maxWidth * timeRatio;

        const color = Phaser.Display.Color.Interpolate.ColorWithColor(
            new Phaser.Display.Color(255, 0, 0), // Pastel red/coral when terminating
            new Phaser.Display.Color(106, 191, 158), // Darker pastel green/mint when starting
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
