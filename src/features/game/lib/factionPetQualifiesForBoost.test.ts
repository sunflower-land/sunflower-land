import { qualifiesForFactionPetBoostFromPriorWeekRequests } from "./factionPetQualifiesForBoost";

describe("qualifiesForFactionPetBoostFromPriorWeekRequests", () => {
  it("returns false when there is no prior-week request data (new faction members)", () => {
    expect(qualifiesForFactionPetBoostFromPriorWeekRequests([])).toBe(false);
  });

  it("returns false when at least one request was never fed", () => {
    expect(
      qualifiesForFactionPetBoostFromPriorWeekRequests([
        { food: "Apple Pie", quantity: 1, dailyFulfilled: { 1: 1 } },
        { food: "Honey Cake", quantity: 1, dailyFulfilled: {} },
      ]),
    ).toBe(false);
  });

  it("returns true when every request was fed at least once", () => {
    expect(
      qualifiesForFactionPetBoostFromPriorWeekRequests([
        { food: "Apple Pie", quantity: 1, dailyFulfilled: { 1: 1 } },
        { food: "Honey Cake", quantity: 1, dailyFulfilled: { 2: 1 } },
      ]),
    ).toBe(true);
  });
});
