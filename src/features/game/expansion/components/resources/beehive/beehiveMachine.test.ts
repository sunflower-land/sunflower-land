import { interpret } from "xstate";

import { TEST_FARM } from "features/game/lib/constants";
import { DEFAULT_HONEY_PRODUCTION_TIME } from "features/game/lib/updateBeehives";
import { Beehive } from "features/game/types/game";

import { BeehiveContext, beehiveMachine } from "./beehiveMachine";

describe("beehiveMachine", () => {
  const fullHive: Beehive = {
    x: 1,
    y: 1,
    swarm: true,
    honey: {
      produced: DEFAULT_HONEY_PRODUCTION_TIME,
      updatedAt: Date.now(),
    },
    flowers: [],
  };

  const partialHive: Beehive = {
    ...fullHive,
    honey: {
      ...fullHive.honey,
      produced: DEFAULT_HONEY_PRODUCTION_TIME / 2,
    },
  };

  const context: BeehiveContext = {
    gameState: TEST_FARM,
    hive: fullHive,
    honeyProduced: DEFAULT_HONEY_PRODUCTION_TIME,
    currentSpeed: 0,
  };

  it("exits honey ready when the synced hive is no longer full", () => {
    const service = interpret(beehiveMachine.withContext(context)).start();

    expect(service.getSnapshot().matches("honeyReady")).toBe(true);

    service.send("UPDATE_HIVE", { updatedHive: partialHive });

    expect(service.getSnapshot().matches("honeyReady")).toBe(false);
    expect(service.getSnapshot().context.honeyProduced).toBe(
      DEFAULT_HONEY_PRODUCTION_TIME / 2,
    );

    service.stop();
  });
});
