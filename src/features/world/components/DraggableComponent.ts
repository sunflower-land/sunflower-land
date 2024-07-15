export class DraggableComponent {
  container: Phaser.GameObjects.Container;
  x: number;
  y: number;

  constructor({
    container,
    onDragEnd,
  }: {
    container: Phaser.GameObjects.Container;
    onDragEnd: () => void;
  }) {
    this.container = container;
    this.x = container.x;
    this.y = container.y;

    // Set the container as interactive and enable dragging
    container
      .setInteractive({ cursor: "pointer", draggable: true })
      .on("pointerdown", (pointer: Phaser.Input.Pointer) => {
        container.scene.input.setDraggable(container);
      })
      .on(
        "drag",
        (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
          // Move the container to the dragged position
          // Snap to grid while dragging
          this.x = Math.round(dragX / 16) * 16;
          this.y = Math.round(dragY / 16) * 16;
        },
      )
      .on("dragend", (pointer: Phaser.Input.Pointer) => {
        // Call the onDragEnd callback
        onDragEnd();
      });
  }
}
