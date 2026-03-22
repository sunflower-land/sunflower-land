import Phaser from "phaser";

export interface LineGlitchOptions {
    lineCount?: number;
    delay?: number;
    maxOffset?: number;
    burstChance?: number;
}

export class LineGlitch {
    private scene: Phaser.Scene;
    private lines: Phaser.GameObjects.Rectangle[] = [];
    private event?: Phaser.Time.TimerEvent;
    private centerX: number;

    private options: Required<LineGlitchOptions>;

    constructor(scene: Phaser.Scene, options: LineGlitchOptions = {}) {
        this.scene = scene;

        this.options = {
            lineCount: options.lineCount ?? 40,
            delay: options.delay ?? 120,
            maxOffset: options.maxOffset ?? 60,
            burstChance: options.burstChance ?? 5
        };

        const { width, height } = scene.scale;
        this.centerX = width / 2;

        this.createLines(height);
        this.start();
    }

    private createLines(height: number): void {
        for (let i = 0; i < this.options.lineCount; i++) {
            const y = Phaser.Math.Between(0, height);
            const lineHeight = Phaser.Math.Between(2, 6);

            const line = this.scene.add.rectangle(
                this.centerX,
                y,
                this.scene.scale.width,
                lineHeight,
                0xffffff
            ).setAlpha(Phaser.Math.FloatBetween(0.1, 0.4));

            this.lines.push(line);
        }
    }

    private start(): void {
        this.event = this.scene.time.addEvent({
            delay: this.options.delay,
            loop: true,
            callback: this.glitch,
            callbackScope: this
        });
    }

    private glitch(): void {
        const { height } = this.scene.scale;

        this.lines.forEach(line => {
            line.y = Phaser.Math.Between(0, height);
            line.height = Phaser.Math.Between(2, 8);
            line.alpha = Phaser.Math.FloatBetween(0.05, 0.6);

            const offset = Phaser.Math.Between(
                -this.options.maxOffset,
                this.options.maxOffset
            );

            this.scene.tweens.add({
                targets: line,
                x: this.centerX + offset,
                duration: 40,
                yoyo: true,
                ease: "Stepped"
            });
        });

        if (Phaser.Math.Between(0, this.options.burstChance) === 0) {
            this.scene.cameras.main.shake(80, 0.01);
        }
    }

    public stop(): void {
        this.event?.remove(false);
    }

    public destroy(): void {
        this.stop();
        this.lines.forEach(line => line.destroy());
        this.lines = [];
    }
}