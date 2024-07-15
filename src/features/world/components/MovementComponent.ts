export class MovementComponent {
  destinationX: number;
  destinationY: number;

  constructor({
    container,
    destinationX,
    destinationY,
  }: {
    container: Phaser.GameObjects.Container;
    destinationX: number;
    destinationY: number;
  }) {
    this.destinationX = destinationX;
    this.destinationY = destinationY;
  }
}
