import { getPriceHistory } from "./marketplace";

function buildDay({ date, low }: { date: string; low: number }) {
  return {
    date,
    low,
    high: low,
    volume: 0,
    sales: 0,
  };
}

describe("getPriceHistory", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-01-10T00:00:00.000Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("fills low=0 using the next older date when sorted newest-first", () => {
    const from = new Date("2025-01-01T00:00:00.000Z").getTime();

    const dates = [
      "2025-01-01",
      "2025-01-02",
      "2025-01-03",
      "2025-01-04",
      "2025-01-05",
      "2025-01-06",
      "2025-01-07",
      "2025-01-08",
      "2025-01-09",
      "2025-01-10",
    ].reduce<Record<string, ReturnType<typeof buildDay>>>((acc, date) => {
      acc[date] = buildDay({ date, low: 10 });
      return acc;
    }, {});

    // Newest day has price, previous day is an explicit "gap" (low=0),
    // and the next older day has the fallback price.
    dates["2025-01-08"] = buildDay({ date: "2025-01-08", low: 50 });
    dates["2025-01-09"] = buildDay({ date: "2025-01-09", low: 0 });
    dates["2025-01-10"] = buildDay({ date: "2025-01-10", low: 100 });

    const history = {
      totalSales: 0,
      totalVolume: 0,
      dates,
    };

    const result = getPriceHistory({ history, from, price: 100 });

    expect(result.dates[0].date).toBe("2025-01-10");

    const jan09 = result.dates.find((d) => d.date === "2025-01-09");
    expect(jan09?.low).toBe(50);

    expect(result.oneDayPrice).toBe(50);
    expect(result.oneDayChange).toBeCloseTo(100, 6);
  });

  it("does not propagate oldest zeros forward through the array", () => {
    const from = new Date("2025-01-01T00:00:00.000Z").getTime();

    // Oldest day is 0 (no older price exists), but a real price appears later.
    // We should not allow that oldest 0 to cascade into newer dates.
    const dates = [
      "2025-01-01",
      "2025-01-02",
      "2025-01-03",
      "2025-01-04",
      "2025-01-05",
      "2025-01-06",
      "2025-01-07",
      "2025-01-08",
      "2025-01-09",
      "2025-01-10",
    ].reduce<Record<string, ReturnType<typeof buildDay>>>((acc, date) => {
      acc[date] = buildDay({ date, low: 0 });
      return acc;
    }, {});

    dates["2025-01-02"] = buildDay({ date: "2025-01-02", low: 40 });
    dates["2025-01-09"] = buildDay({ date: "2025-01-09", low: 0 }); // gap
    dates["2025-01-10"] = buildDay({ date: "2025-01-10", low: 100 });

    const history = { totalSales: 0, totalVolume: 0, dates };

    const result = getPriceHistory({ history, from, price: 100 });

    const jan09 = result.dates.find((d) => d.date === "2025-01-09");
    // Should backfill from a non-zero older price (not from the oldest 0)
    expect(jan09?.low).toBe(40);
    expect(Number.isFinite(result.oneDayChange)).toBe(true);
  });
});
