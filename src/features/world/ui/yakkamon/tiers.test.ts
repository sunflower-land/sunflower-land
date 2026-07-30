import {
  YAKKAMON_TIERS,
  canClaimCode,
  getOpenTier,
  getUnlockAt,
} from "./tiers";

const [FRIDAY, SATURDAY, SUNDAY, MONDAY] = YAKKAMON_TIERS;
const BEFORE_LAUNCH = FRIDAY.unlocksAt - 1;

describe("getOpenTier", () => {
  it("returns null before the first tier opens", () => {
    expect(getOpenTier(BEFORE_LAUNCH)).toBeNull();
  });

  it("returns the level 150 tier on the first day", () => {
    expect(getOpenTier(FRIDAY.unlocksAt)).toEqual(FRIDAY);
  });

  it("drops to the lowest open tier as the days pass", () => {
    expect(getOpenTier(SATURDAY.unlocksAt)).toEqual(SATURDAY);
    expect(getOpenTier(SUNDAY.unlocksAt)).toEqual(SUNDAY);
    expect(getOpenTier(MONDAY.unlocksAt)).toEqual(MONDAY);
  });

  it("stays on the final tier once every tier is live", () => {
    expect(getOpenTier(MONDAY.unlocksAt + 100000)).toEqual(MONDAY);
  });
});

describe("getUnlockAt", () => {
  it("gives high level players the earliest tier", () => {
    expect(getUnlockAt(200)).toEqual(FRIDAY.unlocksAt);
    expect(getUnlockAt(150)).toEqual(FRIDAY.unlocksAt);
  });

  it("gives each level its own tier", () => {
    expect(getUnlockAt(149)).toEqual(SATURDAY.unlocksAt);
    expect(getUnlockAt(99)).toEqual(SUNDAY.unlocksAt);
    expect(getUnlockAt(49)).toEqual(MONDAY.unlocksAt);
  });

  it("returns null for players below every tier", () => {
    expect(getUnlockAt(19)).toBeNull();
  });
});

describe("canClaimCode", () => {
  it("lets beta testers claim before anything opens", () => {
    expect(
      canClaimCode({ level: 1, now: BEFORE_LAUNCH, isBetaTester: true }),
    ).toBe(true);
  });

  it("blocks everyone else before the first tier opens", () => {
    expect(
      canClaimCode({ level: 200, now: BEFORE_LAUNCH, isBetaTester: false }),
    ).toBe(false);
  });

  it("lets a level 150 player claim on the first day", () => {
    expect(
      canClaimCode({ level: 150, now: FRIDAY.unlocksAt, isBetaTester: false }),
    ).toBe(true);
  });

  it("makes a level 100 player wait for the second day", () => {
    expect(
      canClaimCode({ level: 100, now: FRIDAY.unlocksAt, isBetaTester: false }),
    ).toBe(false);
    expect(
      canClaimCode({
        level: 100,
        now: SATURDAY.unlocksAt,
        isBetaTester: false,
      }),
    ).toBe(true);
  });

  it("never opens to players below the final tier", () => {
    expect(
      canClaimCode({
        level: 19,
        now: MONDAY.unlocksAt + 100000,
        isBetaTester: false,
      }),
    ).toBe(false);
  });
});
