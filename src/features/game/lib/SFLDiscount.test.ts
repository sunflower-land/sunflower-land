import Decimal from "decimal.js-light";
import { SFLDiscount } from "./SFLDiscount";
import { TEST_FARM } from "./constants";

describe("SFLDiscount", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return 0.75 when inventory has Dawn Breaker Banner", () => {
    // Date during Dawn Breaker Season
    const mockedDate = new Date(2023, 5, 5);
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockedDate);

    const state = {
      ...TEST_FARM,
      inventory: { "Dawn Breaker Banner": new Decimal(1) },
    };
    const sfl = new Decimal(1);
    const result = SFLDiscount(state, sfl);
    expect(result).toEqual(new Decimal(0.75));
  });

  it("should return 1 when inventory does not have Dawn Breaker Banner", () => {
    // Date during Dawn Breaker Season
    const mockedDate = new Date(2023, 5, 5);
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockedDate);

    const state = {
      ...TEST_FARM,
      inventory: { "Dawn Breaker Banner": undefined },
    };
    const sfl = new Decimal(1);
    const result = SFLDiscount(state, sfl);
    expect(result).toEqual(new Decimal(1));
  });

  it("should return 0.75 when inventory has Witches' Eve Banner", () => {
    // Date during Witches' Eve Season
    const mockedDate = new Date(2023, 8, 5);
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockedDate);

    const state = {
      ...TEST_FARM,
      inventory: { "Witches' Eve Banner": new Decimal(1) },
    };
    const sfl = new Decimal(1);
    const result = SFLDiscount(state, sfl);
    expect(result).toEqual(new Decimal(0.75));
  });

  it("should return 1 when inventory does not have Witches' Eve Banner", () => {
    // Date during Witches' Eve Season
    const mockedDate = new Date(2023, 8, 5);
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockedDate);

    const state = {
      ...TEST_FARM,
      inventory: { "Witches' Eve Banner": undefined },
    };
    const sfl = new Decimal(1);
    const result = SFLDiscount(state, sfl);
    expect(result).toEqual(new Decimal(1));
  });

  it("should not apply discount using a banner from another season", () => {
    // Date during Dawn Breaker Season
    const mockedDate = new Date(2023, 5, 5);
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockedDate);

    const state = {
      ...TEST_FARM,
      inventory: { "Witches' Eve Banner": new Decimal(1) },
    };
    const sfl = new Decimal(1);
    const result = SFLDiscount(state, sfl);
    expect(result).toEqual(new Decimal(1));
  });

  it("should return 0.75 when inventory has Lifetime Farmer Banner", () => {
    const state = {
      ...TEST_FARM,
      inventory: { "Lifetime Farmer Banner": new Decimal(1) },
    };
    const sfl = new Decimal(1);
    const result = SFLDiscount(state, sfl);
    expect(result).toEqual(new Decimal(0.75));
  });
});
