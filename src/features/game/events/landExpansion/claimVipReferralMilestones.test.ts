import Decimal from "decimal.js-light";
import { claimVipReferralMilestones } from "./claimVipReferralMilestones";
import { INITIAL_FARM } from "features/game/lib/constants";

describe("referral.vipMilestonesClaimed", () => {
  it("throws an error if referrals do not exist", () => {
    expect(() =>
      claimVipReferralMilestones({
        state: {
          ...INITIAL_FARM,
          referrals: undefined,
        },
        action: {
          type: "referral.vipMilestonesClaimed",
          milestone: 1,
        },
      }),
    ).toThrow("Referrals not found");
  });

  it("throws an error if the milestone is not configured", () => {
    expect(() =>
      claimVipReferralMilestones({
        state: {
          ...INITIAL_FARM,
          referrals: {
            totalReferrals: 100,
            totalVIPReferrals: 100,
          },
        },
        action: {
          type: "referral.vipMilestonesClaimed",
          milestone: 15,
        },
      }),
    ).toThrow("Invalid milestone");
  });

  it("throws an error if the milestone has not been reached", () => {
    expect(() =>
      claimVipReferralMilestones({
        state: {
          ...INITIAL_FARM,
          referrals: {
            totalReferrals: 4,
            totalVIPReferrals: 4,
          },
        },
        action: {
          type: "referral.vipMilestonesClaimed",
          milestone: 5,
        },
      }),
    ).toThrow("Milestone not reached");
  });

  it("throws an error if the milestone has already been claimed", () => {
    expect(() =>
      claimVipReferralMilestones({
        state: {
          ...INITIAL_FARM,
          referrals: {
            totalReferrals: 5,
            totalVIPReferrals: 5,
            vipMilestonesClaimed: { 5: 1700000000000 },
          },
        },
        action: {
          type: "referral.vipMilestonesClaimed",
          milestone: 5,
        },
      }),
    ).toThrow("Milestone already claimed");
  });

  it("grants the first milestone (5,000 coins) and records claimedAt", () => {
    const now = 1700000000000;
    const state = claimVipReferralMilestones({
      state: {
        ...INITIAL_FARM,
        coins: 100,
        referrals: {
          totalReferrals: 1,
          totalVIPReferrals: 1,
        },
      },
      action: {
        type: "referral.vipMilestonesClaimed",
        milestone: 1,
      },
      createdAt: now,
    });

    expect(state.coins).toEqual(5100);
    expect(state.referrals?.vipMilestonesClaimed).toEqual({ 1: now });
  });

  it("only claims the specified milestone, not other reached ones", () => {
    // Player is at 12 VIP referrals (1, 5, 10 reached) but only claims 5.
    const now = 1700000000000;
    const state = claimVipReferralMilestones({
      state: {
        ...INITIAL_FARM,
        coins: 0,
        referrals: {
          totalReferrals: 12,
          totalVIPReferrals: 12,
        },
      },
      action: {
        type: "referral.vipMilestonesClaimed",
        milestone: 5,
      },
      createdAt: now,
    });

    // Only the Super Totem (milestone 5) is granted.
    expect(state.inventory["Super Totem"]).toEqual(new Decimal(1));
    expect(state.coins).toEqual(0); // milestone 1 (5,000 coins) NOT claimed
    expect(state.wardrobe["Streamer Helmet"]).toBeUndefined(); // milestone 10 NOT claimed
    expect(state.referrals?.vipMilestonesClaimed).toEqual({ 5: now });
  });

  it("preserves previously claimed milestones when claiming a new one", () => {
    const now = 1700000000000;
    const state = claimVipReferralMilestones({
      state: {
        ...INITIAL_FARM,
        coins: 0,
        referrals: {
          totalReferrals: 10,
          totalVIPReferrals: 10,
          vipMilestonesClaimed: { 1: 1, 5: 2 },
        },
      },
      action: {
        type: "referral.vipMilestonesClaimed",
        milestone: 10,
      },
      createdAt: now,
    });

    expect(state.wardrobe["Streamer Helmet"]).toEqual(1);
    expect(state.referrals?.vipMilestonesClaimed).toEqual({
      1: 1,
      5: 2,
      10: now,
    });
  });
});
