export class ClickableComponent {
  constructor({
    container,
    onClick,
  }: {
    container: Phaser.GameObjects.Container;
    onClick: () => void;
  }) {
    container
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", (p: Phaser.Input.Pointer) => {
        onClick();
      });
  }
}
