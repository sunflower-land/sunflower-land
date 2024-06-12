import { makeListingType } from "./makeTradeListingType";

describe("makeListingType", () => {
  it("should return a trade listing", () => {
    const result = makeListingType({ Apple: 1, Orange: 2 });

    expect(result).toEqual("apple-orange");
  });

  it("should return a trade listing with two words", () => {
    const result = makeListingType({ "Goblin Emblem": 1, Orange: 2 });

    expect(result).toEqual("goblinEmblem-orange");
  });
});
