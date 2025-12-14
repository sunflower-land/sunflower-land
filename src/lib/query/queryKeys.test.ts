import {
  playerKeys,
  socialKeys,
  dashboardKeys,
  liquidityKeys,
  referralKeys,
  marketplaceKeys,
  auctionKeys,
  notificationKeys,
} from "./queryKeys";

describe("Query Key Factory", () => {
  describe("playerKeys", () => {
    it("creates correct all key", () => {
      expect(playerKeys.all).toEqual(["player"]);
    });

    it("creates correct details key", () => {
      expect(playerKeys.details()).toEqual(["player", "detail"]);
    });

    it("creates correct detail key with farmId", () => {
      expect(playerKeys.detail(123)).toEqual(["player", "detail", 123]);
    });
  });

  describe("socialKeys", () => {
    it("creates correct leaderboard key", () => {
      expect(socialKeys.leaderboard(456)).toEqual([
        "social",
        "leaderboard",
        456,
      ]);
    });

    it("creates correct blessingResults key", () => {
      expect(socialKeys.blessingResults("2024-01-01")).toEqual([
        "social",
        "blessing-results",
        "2024-01-01",
      ]);
    });

    it("creates correct chatInteractions key", () => {
      expect(socialKeys.chatInteractions(100, 200)).toEqual([
        "social",
        "chat-interactions",
        100,
        200,
      ]);
    });

    it("creates correct feedInteractions key", () => {
      expect(socialKeys.feedInteractions(100, true, "all")).toEqual([
        "social",
        "feed-interactions",
        100,
        true,
        "all",
      ]);
    });

    it("creates correct followNetwork key", () => {
      expect(socialKeys.followNetwork(100, 200, "followers")).toEqual([
        "social",
        "follow-network",
        100,
        200,
        "followers",
      ]);
    });
  });

  describe("marketplaceKeys", () => {
    it("creates correct collection key", () => {
      expect(marketplaceKeys.collection("collectibles")).toEqual([
        "marketplace",
        "collection",
        "collectibles",
        undefined,
      ]);
    });

    it("creates correct collection key with filters", () => {
      expect(
        marketplaceKeys.collection("wearables", { rarity: "rare" }),
      ).toEqual(["marketplace", "collection", "wearables", { rarity: "rare" }]);
    });

    it("creates correct tradeable key", () => {
      expect(marketplaceKeys.tradeable("collectibles", 123)).toEqual([
        "marketplace",
        "tradeable",
        "collectibles",
        123,
      ]);
    });

    it("creates correct hotNow key", () => {
      expect(marketplaceKeys.hotNow()).toEqual(["marketplace", "hot-now"]);
    });

    it("creates correct whatsNew key", () => {
      expect(marketplaceKeys.whatsNew("wearables")).toEqual([
        "marketplace",
        "whats-new",
        "wearables",
      ]);
    });
  });

  describe("auctionKeys", () => {
    it("creates correct history key", () => {
      expect(auctionKeys.history()).toEqual(["auction", "history"]);
    });

    it("creates correct results key", () => {
      expect(auctionKeys.results("auction-123")).toEqual([
        "auction",
        "history",
        "auction-123",
      ]);
    });
  });

  describe("notificationKeys", () => {
    it("creates correct subscriptions key", () => {
      expect(notificationKeys.subscriptions(789)).toEqual([
        "notifications",
        "subscriptions",
        789,
      ]);
    });
  });

  describe("dashboardKeys", () => {
    it("creates correct flower key", () => {
      expect(dashboardKeys.flower()).toEqual(["dashboard", "flower"]);
    });

    it("creates correct economy key", () => {
      expect(dashboardKeys.economy("2024-01-01", "2024-01-31")).toEqual([
        "dashboard",
        "economy",
        { startDate: "2024-01-01", endDate: "2024-01-31" },
      ]);
    });

    it("creates correct ledger key", () => {
      expect(dashboardKeys.ledger("ledger-123")).toEqual([
        "dashboard",
        "ledger",
        "ledger-123",
      ]);
    });
  });

  describe("liquidityKeys", () => {
    it("creates correct player key", () => {
      expect(liquidityKeys.player("0x123")).toEqual([
        "liquidity",
        "player",
        "0x123",
      ]);
    });
  });

  describe("referralKeys", () => {
    it("creates correct referrees key", () => {
      expect(referralKeys.referrees(999)).toEqual([
        "referral",
        "referrees",
        999,
      ]);
    });
  });
});
