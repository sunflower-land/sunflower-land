import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { getHomeRoute } from "./getHomeRoute";

const withInteriors = (enabled: boolean): GameState => ({
  ...TEST_FARM,
  settings: { ...TEST_FARM.settings, interiorsEnabled: enabled },
});

describe("getHomeRoute", () => {
  describe("on the player's own farm", () => {
    it("routes to the legacy home without the interiors experiment", () => {
      expect(
        getHomeRoute({
          game: withInteriors(false),
          isVisiting: false,
          farmId: 1,
        }),
      ).toEqual("/home");
    });

    it("routes to the new interior with the interiors experiment", () => {
      expect(
        getHomeRoute({
          game: withInteriors(true),
          isVisiting: false,
          farmId: 1,
        }),
      ).toEqual("/interior");
    });
  });

  describe("when visiting", () => {
    it("routes to the visited farm's legacy home when they have no interior", () => {
      expect(
        getHomeRoute({
          game: withInteriors(false),
          isVisiting: true,
          farmId: 2,
        }),
      ).toEqual("/visit/2/home");
    });

    // `game` is the *visited* farm's state while visiting, so the toggle is
    // read off the owner of the house rather than the player looking at it.
    it("routes to the visited farm's new interior when they have one", () => {
      expect(
        getHomeRoute({
          game: withInteriors(true),
          isVisiting: true,
          farmId: 2,
        }),
      ).toEqual("/visit/2/interior");
    });
  });
});
