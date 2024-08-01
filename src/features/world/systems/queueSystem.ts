import { MachineInterpreter } from "features/game/lib/gameMachine";
import { FarmerContainer } from "../containers/FarmerContainer";
import { PHASER_GRID_WIDTH, PHASER_SCALE } from "../components/SpriteComponent";
import PathFinding, { DiagonalMovement } from "pathfinding";
import { getKeys } from "features/game/types/decorations";
import { isEventType } from "features/game/events";

export function queueSystem({
  scene,
  components,
  gameService,
}: {
  scene: Phaser.Scene;
  components: FarmerContainer[];
  gameService: MachineInterpreter;
}) {
  const queue = gameService.state.context.queue;
  const game = gameService.state.context.state;

  let next = queue[0];

  if (!next) {
    return;
  }

  // TODO - move into collision detection functions
  var grid = new PathFinding.Grid(50, 50);

  //   Put crops & trees into array as "1"
  getKeys(game.crops).forEach((cropId) => {
    const { x, y } = game.crops[cropId];
    grid.setWalkableAt(x, y, false);
  });

  // TODO - proper width/height
  getKeys(game.trees).forEach((id) => {
    const { x, y } = game.trees[id];
    grid.setWalkableAt(x, y, false);
  });

  // Move containers towards queue item
  components.forEach((component) => {
    if (component.state === "performing" || component.state === "waiting") {
      return;
    }

    let x = next.x;
    let y = next.y;

    if (
      isEventType("crop.harvested", next.event) ||
      isEventType("seed.planted", next.event)
    ) {
      const crop = game.crops[next.event.index];
      x = crop.x;
      y = crop.y;
    }

    if (isEventType("timber.chopped", next.event)) {
      const tree = game.trees[next.event.index];
      x = tree.x;
      y = tree.y;
    }

    // Override whatever the event is sending through
    next.x = x;
    next.y = y;

    const componentX = Math.max(0, Math.round(component.x / PHASER_GRID_WIDTH));
    const componentY = Math.max(0, Math.round(component.y / PHASER_GRID_WIDTH));

    // Find a path

    var finder = new PathFinding.AStarFinder({
      //   diagonalMovement: DiagonalMovement.OnlyWhenNoObstacles,
    });
    const paths = finder.findPath(componentX, componentY, x, y, grid);
    const path = paths.find(
      (coords) => coords[0] !== componentX || coords[1] !== componentY,
    );

    console.log({ paths, path, componentX, componentY, x, y });

    if (path) {
      x = path[0];
      y = path[1];
    }

    // Now apply to world coordinates
    x = x * PHASER_GRID_WIDTH;
    y = y * PHASER_GRID_WIDTH;

    console.log({ path, x, y });

    // x -= PHASER_GRID_WIDTH * 0.5;
    // y -= PHASER_GRID_WIDTH * 0.5;

    // Calculate the direction vector
    const direction = new Phaser.Math.Vector2(x - component.x, y - component.y);

    // Normalize the direction vector (to make its length 1)
    direction.normalize();

    // Move component along the direction vector with a fixed speed
    const speed = 2 * PHASER_SCALE; // Adjust the speed as needed
    component.x += direction.x * speed;
    component.y += direction.y * speed;

    if (component.x > x) {
      component.character.sprite?.setScale(PHASER_SCALE * -1, PHASER_SCALE);
    } else if (component.x < x) {
      component.character.sprite?.setScale(PHASER_SCALE, PHASER_SCALE);
    }

    component.walk();

    // Trigger action on arrival?
    const destinationX = next.x * PHASER_GRID_WIDTH;
    const destinationY = next.y * PHASER_GRID_WIDTH;
    const distance = Phaser.Math.Distance.BetweenPoints(
      { x: destinationX, y: destinationY },
      component,
    );

    console.log({ distance, destinationX, destinationY });
    if (distance < 2 * PHASER_SCALE) {
      console.log("ARRIVED");
      component.perform({ action: next });
    }
  });
}
