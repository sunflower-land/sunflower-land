import {
  parseCaveMerchantSeen,
  readCaveMerchantSeen,
  subscribeCaveMerchantSeen,
  writeCaveMerchantSeen,
} from "./merchantOffers";

const seen = { visit: "[1,1000]", offers: ["offer-a"] };

describe("Cave merchant view storage", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => jest.restoreAllMocks());

  it("persists views across consumers and scopes them to the farm", () => {
    writeCaveMerchantSeen(101, seen);
    expect(parseCaveMerchantSeen(readCaveMerchantSeen(101))).toEqual(seen);
    expect(parseCaveMerchantSeen(readCaveMerchantSeen(102))).toBeUndefined();
    writeCaveMerchantSeen(102, { ...seen, offers: ["offer-b"] });
    expect(parseCaveMerchantSeen(readCaveMerchantSeen(101))).toEqual(seen);
  });

  it("ignores missing, malformed or obsolete records", () => {
    for (const raw of [
      "",
      "{",
      "null",
      "1",
      "{}",
      '{"visit":"x","offers":[1]}',
    ]) {
      expect(parseCaveMerchantSeen(raw)).toBeUndefined();
    }
  });

  it("notifies mounted consumers once per change and supports cross-tab updates", () => {
    const listener = jest.fn();
    const unsubscribe = subscribeCaveMerchantSeen(listener);
    writeCaveMerchantSeen(103, seen);
    writeCaveMerchantSeen(103, seen);
    expect(listener).toHaveBeenCalledTimes(1);
    window.dispatchEvent(new StorageEvent("storage"));
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
    window.dispatchEvent(new StorageEvent("storage"));
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("keeps a farm-scoped session fallback when storage writes fail", () => {
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage denied");
    });
    writeCaveMerchantSeen(104, seen);
    expect(parseCaveMerchantSeen(readCaveMerchantSeen(104))).toEqual(seen);
    expect(parseCaveMerchantSeen(readCaveMerchantSeen(105))).toBeUndefined();
  });

  it("survives storage reads being denied", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage denied");
    });
    expect(parseCaveMerchantSeen(readCaveMerchantSeen(106))).toBeUndefined();
    writeCaveMerchantSeen(106, seen);
    expect(parseCaveMerchantSeen(readCaveMerchantSeen(106))).toEqual(seen);
  });
});
