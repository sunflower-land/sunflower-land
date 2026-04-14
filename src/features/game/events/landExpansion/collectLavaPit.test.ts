import { INITIAL_FARM } from "features/game/lib/constants";
import { collectLavaPit } from "./collectLavaPit";
import Decimal from "decimal.js-light";

describe("collectLavaPit", () => {
  const now = Date.now();

  it("requires a lava pit", () => {
    expect(() =>
      collectLavaPit({
        state: INITIAL_FARM,
        action: { type: "lavaPit.collected", id: "1" },
        createdAt: now,
      }),
    ).toThrow("Lava pit not found");
  });

  it("requires lava pit to be started", () => {
    expect(() =>
      collectLavaPit({
        state: {
          ...INITIAL_FARM,
          lavaPits: {
            1: { x: 0, y: 0, createdAt: 0 },
          },
        },
        action: { type: "lavaPit.collected", id: "1" },
        createdAt: now,
      }),
    ).toThrow("Lava pit not started");
  });

  it("collects the lava pit", () => {
    const result = collectLavaPit({
      state: {
        ...INITIAL_FARM,
        lavaPits: {
          1: { x: 0, y: 0, startedAt: 0, createdAt: 0 },
        },
      },
      action: { type: "lavaPit.collected", id: "1" },
      createdAt: now,
    });

    expect(result.lavaPits[1].startedAt).toBe(undefined);
    expect(result.lavaPits[1].collectedAt).toBe(now);
  });

  it("requires the lava pit was started 72 hours ago", () => {
    expect(() =>
      collectLavaPit({
        state: {
          ...INITIAL_FARM,
          lavaPits: {
            1: {
              x: 0,
              y: 0,
              startedAt: now,
              readyAt: now + 72 * 60 * 60 * 1000,
              createdAt: 0,
            },
          },
        },
        action: { type: "lavaPit.collected", id: "1" },
        createdAt: now,
      }),
    ).toThrow("Lava pit still active");
  });

  it("cooks 2x faster with obsidian necklace", () => {
    const result = collectLavaPit({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin.equipped,
            necklace: "Obsidian Necklace",
          },
        },
        lavaPits: {
          1: {
            x: 0,
            y: 0,
            startedAt: now - 36 * 60 * 60 * 1000,
            createdAt: 0,
          },
        },
      },
      action: { type: "lavaPit.collected", id: "1" },
      createdAt: now,
    });

    expect(result.lavaPits[1].startedAt).toBe(undefined);
    expect(result.lavaPits[1].collectedAt).toBe(now);
  });

  it("gives an obsidian", () => {
    const result = collectLavaPit({
      state: {
        ...INITIAL_FARM,
        lavaPits: {
          1: { x: 0, y: 0, startedAt: 0, createdAt: 0 },
        },
      },
      action: { type: "lavaPit.collected", id: "1" },
      createdAt: now,
    });

    expect(result.inventory.Obsidian).toEqual(new Decimal(1));
  });

  it("gives 1.5x obsidian with obsidian turtle", () => {
    const result = collectLavaPit({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
        },
        collectibles: {
          "Obsidian Turtle": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              readyAt: now,
              createdAt: now,
            },
          ],
        },
        lavaPits: {
          1: { x: 0, y: 0, startedAt: 0, createdAt: 0 },
        },
      },
      action: { type: "lavaPit.collected", id: "1" },
      createdAt: now,
    });

    expect(result.inventory.Obsidian).toEqual(new Decimal(1.5));
  });

  it("gives +0.15 obsidian with magma stone", () => {
    const result = collectLavaPit({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
        },
        collectibles: {
          "Magma Stone": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              readyAt: now,
              createdAt: now,
            },
          ],
        },
        lavaPits: {
          1: { x: 0, y: 0, startedAt: 0, createdAt: 0 },
        },
      },
      action: { type: "lavaPit.collected", id: "1" },
      createdAt: now,
    });

    expect(result.inventory.Obsidian).toEqual(new Decimal(1.15));
  });
});
