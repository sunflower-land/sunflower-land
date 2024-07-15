export class DraggableComponent {
  x: number;
  y: number;
  constructor({
    container,
    onDragEnd,
  }: {
    container: Phaser.GameObjects.Container;
    onDragEnd: () => void;
  }) {
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
          x = Math.round(dragX / 16) * 16;
          y = Math.round(dragY / 16) * 16;

          const p = container
            .getComponents()
            .find((r) => isProgressBarComponent);
          p.hide();
        },
      )
      .on("dragend", (pointer: Phaser.Input.Pointer) => {
        // Snap to grid
        container.x = Math.round(container.x / 16) * 16;
        container.y = Math.round(container.y / 16) * 16;

        // Call the onDragEnd callback
        onDragEnd();
      });
  }

  update() {
    container.x = Math.round(this.x / 16) * 16;
    container.y = Math.round(this.y / 16) * 16;
  }
}
