import { interpret } from "xstate";

import { TEST_FARM } from "features/game/lib/constants";
import { DEFAULT_HONEY_PRODUCTION_TIME } from "features/game/lib/updateBeehives";
import type { Beehive } from "features/game/types/game";

import { type BeehiveContext, beehiveMachine } from "./beehiveMachine";

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

  const partialContext: BeehiveContext = {
    ...context,
    hive: partialHive,
    honeyProduced: DEFAULT_HONEY_PRODUCTION_TIME / 2,
  };

  it("exits honey ready when the synced hive is no longer full", () => {
    const service = interpret(beehiveMachine.withContext(context)).start();

    expect(service.getSnapshot().matches("honeyReady")).toBe(true);

    service.send("UPDATE_HIVE", { updatedHive: partialHive });

    expect(service.getSnapshot().matches("hiveBuzzing")).toBe(true);
    expect(service.getSnapshot().matches("honeyReady")).toBe(false);
    expect(service.getSnapshot().context.honeyProduced).toBe(
      DEFAULT_HONEY_PRODUCTION_TIME / 2,
    );

    service.stop();
  });

  it("keeps honey ready when the synced hive is still full", () => {
    const service = interpret(beehiveMachine.withContext(context)).start();

    expect(service.getSnapshot().matches("honeyReady")).toBe(true);

    service.send("UPDATE_HIVE", { updatedHive: fullHive });

    expect(service.getSnapshot().matches("honeyReady")).toBe(true);
    expect(service.getSnapshot().context.honeyProduced).toBe(
      DEFAULT_HONEY_PRODUCTION_TIME,
    );

    service.stop();
  });

  it("starts buzzing when honey is partial and reaches honey ready after a full hive sync", () => {
    const service = interpret(
      beehiveMachine.withContext(partialContext),
    ).start();

    expect(service.getSnapshot().matches("hiveBuzzing")).toBe(true);
    expect(service.getSnapshot().context.honeyProduced).toBe(
      DEFAULT_HONEY_PRODUCTION_TIME / 2,
    );

    service.send("UPDATE_HIVE", { updatedHive: fullHive });
    service.send("BUZZ");

    expect(service.getSnapshot().matches("honeyReady")).toBe(true);
    expect(service.getSnapshot().context.honeyProduced).toBe(
      DEFAULT_HONEY_PRODUCTION_TIME,
    );

    service.stop();
  });
});
