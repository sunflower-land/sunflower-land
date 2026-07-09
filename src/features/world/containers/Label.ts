const ICON_WIDTH = 11;
const ICON_GAP = -1;
const ICON_CENTER_Y = 3.5;

export class Label extends Phaser.GameObjects.Container {
  private iconSprite: Phaser.GameObjects.Sprite | undefined;
  private iconVisible = true;
  private syncFloatingIcon: (() => void) | undefined;

  constructor(
    scene: Phaser.Scene,
    text: string,
    type: "brown" | "grey" | "gold" | "vibrant" = "grey",
    iconKey?: string,
    iconDepth?: number,
  ) {
    super(scene, 0, 0);
    this.scene = scene;

    const textWidth = text.length * 4 - 1;
    const patchWidth = textWidth + 6;
    const hasIcon = !!iconKey && scene.textures.exists(iconKey);

    const name = scene.add.bitmapText(
      -textWidth / 2,
      1,
      "Teeny Tiny Pixls",
      text,
      5,
    );

    let key = "label";
    if (type === "brown") {
      key = "brown_label";
    } else if (type === "gold") {
      key = "gold_label";
    } else if (type === "vibrant") {
      key = "vibrant_label";
    }

    const label = (this.scene.add as any).rexNinePatch2({
      x: 0,
      y: 3.5,
      width: patchWidth,
      height: 11,
      key: key,
      columns: [3, 3, 3],
      rows: [3, 3, 3],
      baseFrame: undefined,
      getFrameNameCallback: undefined,
    });

    this.add(label);
    this.add(name);
    if (hasIcon) {
      const iconX = -patchWidth / 2 - ICON_GAP - ICON_WIDTH / 2;
      const icon = scene.add
        .sprite(iconX, ICON_CENTER_Y, iconKey!)
        .setSize(ICON_WIDTH, ICON_WIDTH)
        .setOrigin(0.5, 0.5);
      this.iconSprite = icon;

      if (iconDepth !== undefined) {
        icon.setDepth(iconDepth);
        this.syncFloatingIcon = () => {
          if (!icon.active) return;

          const point = this.getWorldTransformMatrix().transformPoint(
            iconX,
            ICON_CENTER_Y,
          );

          icon.setPosition(point.x, point.y);
          icon.setVisible(
            this.iconVisible &&
              this.visible &&
              (this.parentContainer?.visible ?? true),
          );
        };

        this.syncFloatingIcon();
        scene.events.on("update", this.syncFloatingIcon);
        this.once("destroy", () => {
          if (this.syncFloatingIcon) {
            scene.events.off("update", this.syncFloatingIcon);
          }

          icon.destroy();
        });
      } else {
        this.add(icon);
      }
    }

    this.setDepth(1);
  }

  setIconVisible(visible: boolean) {
    this.iconVisible = visible;

    if (this.iconSprite) {
      this.iconSprite.setVisible(visible);
      this.syncFloatingIcon?.();
    }
  }
}
