import { getInteriorExitRoute, getInteriorRoute } from "./interiorRoutes";

describe("getInteriorRoute", () => {
  it("routes to the player's own ground floor", () => {
    expect(getInteriorRoute({ floor: "ground" })).toEqual("/interior");
  });

  it("routes to the player's own level one", () => {
    expect(getInteriorRoute({ floor: "level_one" })).toEqual("/level_one");
  });

  it("keeps the visit prefix on the ground floor", () => {
    expect(getInteriorRoute({ floor: "ground", visitedFarmId: 123 })).toEqual(
      "/visit/123/interior",
    );
  });

  it("keeps the visit prefix on level one", () => {
    expect(
      getInteriorRoute({ floor: "level_one", visitedFarmId: 123 }),
    ).toEqual("/visit/123/level_one");
  });
});

describe("getInteriorExitRoute", () => {
  it("exits to the player's own land", () => {
    expect(getInteriorExitRoute({})).toEqual("/");
  });

  it("exits back onto the visited land, not the player's own", () => {
    expect(getInteriorExitRoute({ visitedFarmId: 123 })).toEqual("/visit/123");
  });
});
