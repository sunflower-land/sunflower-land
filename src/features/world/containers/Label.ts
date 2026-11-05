const ICON_WIDTH = 11;
const ICON_GAP = -1;
const ICON_CENTER_Y = 3.5;

export class Label extends Phaser.GameObjects.Container {
  private iconSprite: Phaser.GameObjects.Sprite | undefined;
  private text: Phaser.GameObjects.BitmapText;
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
    this.text = name;
    if (hasIcon) {
      const icon = scene.add
        .sprite(0, ICON_CENTER_Y, iconKey!)
        .setOrigin(0.5, 0.5);

      // An icon is drawn at its texture's own size - `setSize` below only
      // sets the hit area - so one wider than `ICON_WIDTH` has to be pushed
      // further out or it overlaps the first letter. Read the frame before
      // `setSize`, which overwrites `width`. Icons that size or smaller sit
      // exactly where they always have.
      const drawnWidth = icon.frame?.width ?? ICON_WIDTH;
      const iconX =
        -patchWidth / 2 - ICON_GAP - Math.max(ICON_WIDTH, drawnWidth) / 2;

      icon.setPosition(iconX, ICON_CENTER_Y).setSize(ICON_WIDTH, ICON_WIDTH);
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

  /**
   * Swap the text for another of the same length - the patch behind it is
   * sized once, at construction, so longer text would spill out of it.
   */
  setText(text: string): this {
    this.text.setText(text);
    this.text.setX(-(text.length * 4 - 1) / 2);

    return this;
  }

  /** Recolour the text (e.g. green/red for a result); `undefined` resets it. */
  setTextTint(tint?: number) {
    if (tint === undefined) {
      this.text.clearTint();
    } else {
      this.text.setTint(tint);
    }
  }

  setIconVisible(visible: boolean) {
    this.iconVisible = visible;

    if (this.iconSprite) {
      this.iconSprite.setVisible(visible);
      this.syncFloatingIcon?.();
    }
  }
}
