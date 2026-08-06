import {
  mockGiveaways,
  mockGiveawayLeaderboard,
  MOCK_GIVEAWAY_ID,
  MOCK_PAST_GIVEAWAY_ID,
} from "./mockGiveaways";

describe("offline giveaway fixtures", () => {
  it("returns one joinable active giveaway and one recent (finished) one", () => {
    const { active, recent } = mockGiveaways();

    expect(active).toHaveLength(1);
    expect(active[0].id).toBe(MOCK_GIVEAWAY_ID);
    expect(["upcoming", "live"]).toContain(active[0].status);

    expect(recent).toHaveLength(1);
    expect(recent[0].id).toBe(MOCK_PAST_GIVEAWAY_ID);
    expect(recent[0].status).toBe("complete");
  });

  it("keeps a stable start time across polls so the race can actually begin", () => {
    const a = mockGiveaways().active[0].startAt;
    const b = mockGiveaways().active[0].startAt;
    expect(a).toBe(b);
    // The board leaderboard must agree with the discovery feed.
    expect(mockGiveawayLeaderboard(MOCK_GIVEAWAY_ID).startAt).toBe(a);
  });

  it("serves a board for the live giveaway (participants empty = just me)", () => {
    const board = mockGiveawayLeaderboard(MOCK_GIVEAWAY_ID);
    expect(board.id).toBe(MOCK_GIVEAWAY_ID);
    expect(board.prizes.length).toBeGreaterThan(0);
    expect(board.participants).toEqual([]);
    expect(["upcoming", "live"]).toContain(board.status);
  });

  it("serves a finished board with sample winners for the recent one", () => {
    const board = mockGiveawayLeaderboard(MOCK_PAST_GIVEAWAY_ID);
    expect(board.status).toBe("complete");
    expect(board.leaderboard.length).toBeGreaterThan(0);
    expect(board.leaderboard[0].position).toBe(1);
  });
});
