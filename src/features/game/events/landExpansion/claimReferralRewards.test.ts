import Decimal from "decimal.js-light";
import { claimReferralRewards } from "./claimReferralRewards";
import { INITIAL_FARM } from "features/game/lib/constants";

describe("referral.rewardsClaimed", () => {
  it("throws an error if referrals do not exist", () => {
    expect(() =>
      claimReferralRewards({
        state: {
          ...INITIAL_FARM,
          referrals: undefined,
        },
        action: {
          type: "referral.rewardsClaimed",
        },
      }),
    ).toThrow("Referrals not found");
  });

  it("throws an error if there are no rewards to claim", () => {
    expect(() =>
      claimReferralRewards({
        state: {
          ...INITIAL_FARM,
          referrals: {
            totalReferrals: 5,
            totalVIPReferrals: 2,
            totalUnclaimedReferrals: 3,
          },
        },
        action: {
          type: "referral.rewardsClaimed",
        },
      }),
    ).toThrow("No rewards to claim");
  });

  it("adds item rewards to inventory", () => {
    const state = claimReferralRewards({
      state: {
        ...INITIAL_FARM,
        referrals: {
          totalReferrals: 5,
          totalVIPReferrals: 2,
          totalUnclaimedReferrals: 3,
          rewards: {
            items: {
              "Sunflower Seed": 10,
              "Carrot Seed": 5,
            },
          },
        },
        inventory: {
          "Sunflower Seed": new Decimal(2),
          "Carrot Seed": new Decimal(0),
        },
      },
      action: {
        type: "referral.rewardsClaimed",
      },
    });

    expect(state.inventory["Sunflower Seed"]).toEqual(new Decimal(12));
    expect(state.inventory["Carrot Seed"]).toEqual(new Decimal(5));
    expect(state.referrals?.rewards).toBeUndefined();
    expect(state.referrals?.totalUnclaimedReferrals).toBeUndefined();
  });

  it("adds wearable rewards to wardrobe", () => {
    const state = claimReferralRewards({
      state: {
        ...INITIAL_FARM,
        referrals: {
          totalReferrals: 5,
          totalVIPReferrals: 2,
          totalUnclaimedReferrals: 3,
          rewards: {
            wearables: { "Farmer Hat": 1 },
          },
        },
        wardrobe: { "Farmer Hat": 1 },
      },
      action: {
        type: "referral.rewardsClaimed",
      },
    });

    expect(state.wardrobe["Farmer Hat"]).toEqual(2);
    expect(state.referrals?.rewards).toBeUndefined();
    expect(state.referrals?.totalUnclaimedReferrals).toBeUndefined();
  });

  it("adds SFL to balance", () => {
    const state = claimReferralRewards({
      state: {
        ...INITIAL_FARM,
        referrals: {
          totalReferrals: 5,
          totalVIPReferrals: 2,
          totalUnclaimedReferrals: 3,
          rewards: {
            sfl: 10,
          },
        },
      },
      action: {
        type: "referral.rewardsClaimed",
      },
    });

    expect(state.balance).toEqual(new Decimal(10));
    expect(state.referrals?.rewards).toBeUndefined();
    expect(state.referrals?.totalUnclaimedReferrals).toBeUndefined();
  });

  it("adds coins to player", () => {
    const state = claimReferralRewards({
      state: {
        ...INITIAL_FARM,
        coins: 5,
        referrals: {
          totalReferrals: 5,
          totalVIPReferrals: 2,
          totalUnclaimedReferrals: 3,
          rewards: {
            coins: 10,
          },
        },
      },
      action: {
        type: "referral.rewardsClaimed",
      },
    });

    expect(state.coins).toEqual(15);
    expect(state.referrals?.rewards).toBeUndefined();
    expect(state.referrals?.totalUnclaimedReferrals).toBeUndefined();
  });

  it("handles multiple reward types together", () => {
    const state = claimReferralRewards({
      state: {
        ...INITIAL_FARM,
        coins: 5,
        referrals: {
          totalReferrals: 5,
          totalVIPReferrals: 2,
          totalUnclaimedReferrals: 3,
          rewards: {
            items: {
              "Sunflower Seed": 10,
            },
            wearables: { "Farmer Hat": 1 },
            sfl: 10,
            coins: 10,
          },
        },
        inventory: {
          "Sunflower Seed": new Decimal(2),
        },
        wardrobe: {
          "Farmer Hat": 1,
        },
      },
      action: {
        type: "referral.rewardsClaimed",
      },
    });

    expect(state.inventory["Sunflower Seed"]).toEqual(new Decimal(12));
    expect(state.wardrobe["Farmer Hat"]).toEqual(2);
    expect(state.balance).toEqual(new Decimal(10));
    expect(state.coins).toEqual(15);
    expect(state.referrals?.rewards).toBeUndefined();
    expect(state.referrals?.totalUnclaimedReferrals).toBeUndefined();
  });
});
