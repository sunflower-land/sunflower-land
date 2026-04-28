import { placeEvent } from "./placeEvent";

describe("placeEvent", () => {
  it("dispatches collectible.placed for collectibles in the interior", () => {
    expect(placeEvent("Abandoned Bear", "interior")).toBe("collectible.placed");
  });

  it("dispatches collectible.placed for collectibles on level_one", () => {
    expect(placeEvent("Abandoned Bear", "level_one")).toBe(
      "collectible.placed",
    );
  });

  it("rejects placing a resource node inside the interior", () => {
    expect(() => placeEvent("Tree", "interior")).toThrow(
      "Tree cannot be placed inside the interior",
    );
  });

  it("rejects placing a resource node on level_one", () => {
    expect(() => placeEvent("Stone Rock", "level_one")).toThrow(
      "Stone Rock cannot be placed inside the interior",
    );
  });

  it("rejects placing a building inside the interior", () => {
    expect(() => placeEvent("Water Well", "interior")).toThrow(
      "Water Well cannot be placed inside the interior",
    );
  });

  it("still routes resources on the farm to their dedicated event", () => {
    expect(placeEvent("Tree", "farm")).toBe("tree.placed");
  });
});
