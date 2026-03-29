import { Scene } from "../Scene";

interface Props {
    x: number;
    y: number;
    scene: Scene;
}


export class Lumber extends Phaser.GameObjects.Container {
    scene: Scene;
    private sprite: Phaser.GameObjects.Sprite;

    constructor({ x, y, scene }: Props) {
        super(scene, x, y);
        this.scene = scene;

        this.sprite = this.scene.add.sprite(0, 0, "lumber")
            .setOrigin(0.5)
            .setScale(1.2, 2.8);
        this.add(this.sprite);
        this.setDepth(4);

        scene.add.existing(this);
    }
}
