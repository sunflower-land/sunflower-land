import { getMarketplaceReturnRoute } from "./marketplaceReturnRoute";

describe("getMarketplaceReturnRoute", () => {
  it("returns to the route captured when the marketplace was opened", () => {
    expect(
      getMarketplaceReturnRoute({
        pathname: "/world/marketplace/hot",
        navigation: { returnTo: "/world/kingdom" },
        fromRoute: "/world/plaza",
      }),
    ).toBe("/world/kingdom");
  });

  it("supports legacy non-marketplace return routes", () => {
    expect(
      getMarketplaceReturnRoute({
        pathname: "/world/marketplace/hot",
        fromRoute: "/world/retreat",
      }),
    ).toBe("/world/retreat");
  });

  it("does not return to a marketplace route after visiting a player", () => {
    expect(
      getMarketplaceReturnRoute({
        pathname: "/world/marketplace/collectibles/101",
        fromRoute: "/world/marketplace/collectibles/101",
      }),
    ).toBe("/world/plaza");
  });

  it("falls back to the farm for the standalone marketplace", () => {
    expect(
      getMarketplaceReturnRoute({
        pathname: "/marketplace/profile/123/history",
        fromRoute: "/marketplace/profile/123/history",
      }),
    ).toBe("/");
  });
});
