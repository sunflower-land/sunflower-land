import {
  draftPlacementEvent,
  needsDraftPlacement,
  settlePlacementEvent,
  type PlacementContext,
} from "./placementEvents";

const context = (overrides: Partial<PlacementContext>): PlacementContext => ({
  coordinates: { x: 3, y: 4 },
  ...overrides,
});

describe("settlePlacementEvent", () => {
  it("buys without coordinates in the sandbox so Cancel keeps the purchase", () => {
    const event = settlePlacementEvent(
      context({
        sandbox: true,
        action: "decoration.bought",
        placeable: { name: "Dirt Path" },
      }),
      "farm",
    );

    expect(event).toMatchObject({
      type: "decoration.bought",
      name: "Dirt Path",
      location: "farm",
    });
    expect(event).not.toHaveProperty("coordinates");
  });

  it("buys at the tile when the sandbox is off", () => {
    const event = settlePlacementEvent(
      context({
        action: "decoration.bought",
        placeable: { name: "Dirt Path" },
      }),
      "farm",
    );

    expect(event).toMatchObject({
      type: "decoration.bought",
      name: "Dirt Path",
      coordinates: { x: 3, y: 4 },
    });
  });

  it("keeps an owned instance's own id", () => {
    const event = settlePlacementEvent(
      context({
        sandbox: true,
        action: "farmHand.placed",
        placeable: { name: "FarmHand", id: "hand-1" },
      }),
      "home",
    );

    expect(event).toMatchObject({
      type: "farmHand.placed",
      id: "hand-1",
      coordinates: { x: 3, y: 4 },
    });
  });
});

describe("needsDraftPlacement", () => {
  it("follows a sandbox purchase with a draft placement at the tile", () => {
    const buying = context({
      sandbox: true,
      action: "decoration.bought",
      placeable: { name: "Dirt Path" },
    });

    expect(needsDraftPlacement(buying)).toBe(true);
    expect(draftPlacementEvent(buying, "farm")).toMatchObject({
      type: "collectible.placed",
      name: "Dirt Path",
      coordinates: { x: 3, y: 4 },
      location: "farm",
    });
  });

  it("does not follow a purchase that already carries its tile", () => {
    expect(
      needsDraftPlacement(
        context({
          action: "decoration.bought",
          placeable: { name: "Dirt Path" },
        }),
      ),
    ).toBe(false);
  });

  it("does not follow a plain placement", () => {
    expect(
      needsDraftPlacement(
        context({
          sandbox: true,
          action: "collectible.placed",
          placeable: { name: "Dirt Path" },
        }),
      ),
    ).toBe(false);
  });
});
