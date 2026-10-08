import Decimal from "decimal.js-light";
import {
  applyPatch,
  buildPreviewLink,
  decodeJsonParam,
  diffState,
  encodeJsonParam,
  readPreviewParams,
  resolveTimeToken,
} from "./previewLink";

const NOW = Date.UTC(2026, 9, 7, 12, 0, 0);
const HOUR = 60 * 60 * 1000;

describe("readPreviewParams", () => {
  it("reads params from the query string", () => {
    expect(
      readPreviewParams({ search: "?fixture=test&patch=e30", hash: "" }),
    ).toEqual({ fixture: "test", patch: "e30" });
  });

  it("reads params from the hash query and lets the real query win", () => {
    expect(
      readPreviewParams({
        search: "?fixture=test",
        hash: "#/world/plaza?fixture=new&intro=1",
      }),
    ).toEqual({ fixture: "test", intro: "1" });
  });

  it("ignores unknown and empty params", () => {
    expect(readPreviewParams({ search: "?error=X&patch=", hash: "" })).toEqual(
      {},
    );
  });
});

describe("json params", () => {
  it("round-trips unicode through base64url", () => {
    const value = { name: "Bumpkin ✨ ü", nested: { a: [1, "two"] } };
    const encoded = encodeJsonParam(value);
    expect(encoded).not.toMatch(/[+/=]/);
    expect(decodeJsonParam(encoded)).toEqual(value);
  });

  it("accepts raw JSON", () => {
    expect(decodeJsonParam('{"coins": 5}')).toEqual({ coins: 5 });
  });

  it("rejects non-objects", () => {
    expect(() => decodeJsonParam("WzFd")).toThrow(/JSON object/); // [1]
  });
});

describe("resolveTimeToken", () => {
  it("resolves $now offsets to milliseconds", () => {
    expect(resolveTimeToken("$now", NOW)).toBe(NOW);
    expect(resolveTimeToken("$now-2h", NOW)).toBe(NOW - 2 * HOUR);
    expect(resolveTimeToken("$now+30m", NOW)).toBe(NOW + 30 * 60 * 1000);
    expect(resolveTimeToken("$now+1.5d", NOW)).toBe(NOW + 36 * HOUR);
  });

  it("resolves $date offsets to ISO strings", () => {
    expect(resolveTimeToken("$date-1w", NOW)).toBe(
      new Date(NOW - 7 * 24 * HOUR).toISOString(),
    );
  });

  it("leaves other strings alone", () => {
    expect(resolveTimeToken("$nowhere", NOW)).toBe("$nowhere");
    expect(resolveTimeToken("Sunflower", NOW)).toBe("Sunflower");
  });
});

describe("applyPatch", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const base: Record<string, any> = {
    coins: 10,
    balance: new Decimal(1),
    inventory: { Sunflower: new Decimal(3) },
    bumpkin: { experience: 0, equipped: { hair: "Basic Hair" } },
    henHouse: { level: 1, animals: { "0": { state: "idle", awakeAt: 0 } } },
    farmHands: { bumpkins: {} },
    list: [1, 2, 3],
  };

  it("deep-merges without mutating the base", () => {
    const result = applyPatch(
      base,
      { bumpkin: { experience: 500 }, coins: 99 },
      NOW,
    );

    expect(result.bumpkin).toEqual({
      experience: 500,
      equipped: { hair: "Basic Hair" },
    });
    expect(result.coins).toBe(99);
    expect(base.coins).toBe(10);
    expect(base.bumpkin.experience).toBe(0);
  });

  it("coerces numbers merged over Decimals and new Decimal-record keys", () => {
    const result = applyPatch(
      base,
      { balance: 42, inventory: { Sunflower: 10, Gold: "7" } },
      NOW,
    );

    expect(result.balance).toBeInstanceOf(Decimal);
    expect(result.balance.toNumber()).toBe(42);
    expect(result.inventory.Sunflower.toNumber()).toBe(10);
    expect(result.inventory.Gold).toBeInstanceOf(Decimal);
    expect(result.inventory.Gold.toNumber()).toBe(7);
  });

  it("deletes keys set to null", () => {
    const result = applyPatch(base, { henHouse: null, list: null }, NOW);
    expect(result).not.toHaveProperty("henHouse");
    expect(result).not.toHaveProperty("list");
  });

  it("replaces arrays wholesale", () => {
    expect(applyPatch(base, { list: [9] }, NOW).list).toEqual([9]);
  });

  it("resolves time tokens anywhere, including new objects", () => {
    const result = applyPatch(
      base,
      {
        henHouse: {
          animals: {
            "0": { awakeAt: "$now-2h" },
            "1": { state: "sick", awakeAt: "$now+1h" },
          },
        },
      },
      NOW,
    );

    expect(result.henHouse.animals["0"]).toEqual({
      state: "idle",
      awakeAt: NOW - 2 * HOUR,
    });
    expect(result.henHouse.animals["1"]).toEqual({
      state: "sick",
      awakeAt: NOW + HOUR,
    });
  });

  it("does not coerce numbers inside new nested objects of a plain record", () => {
    const result = applyPatch(
      base,
      {
        farmHands: { bumpkins: { "1": { equipped: { hair: "X" }, level: 2 } } },
      },
      NOW,
    );
    expect(result.farmHands.bumpkins["1"]).toEqual({
      equipped: { hair: "X" },
      level: 2,
    });
  });
});

describe("diffState", () => {
  it("is the inverse of applyPatch for plain and Decimal values", () => {
    const base = {
      coins: 10,
      inventory: { Sunflower: new Decimal(3), Gold: new Decimal(1) },
      henHouse: { level: 1 },
      bumpkin: { experience: 0 },
    };
    const patch = {
      coins: 20,
      inventory: { Sunflower: 5, Gold: null, Wood: 2 },
      henHouse: null,
    };
    const current = applyPatch(base, patch, NOW);

    expect(diffState(base, current)).toEqual({
      coins: 20,
      inventory: { Sunflower: "5", Gold: null, Wood: "2" },
      henHouse: null,
    });
  });

  it("returns an empty patch for identical states", () => {
    const state = { a: new Decimal(1), b: { c: [1, 2] } };
    expect(diffState(state, { ...state })).toEqual({});
  });
});

describe("buildPreviewLink", () => {
  it("keeps the S3 object path and puts params before the hash route", () => {
    const link = buildPreviewLink({
      base: "https://bucket.s3.ap-southeast-2.amazonaws.com/pr-1/index.html",
      route: "/world/plaza",
      fixture: "test",
      patch: { coins: 1 },
      localStorage: { islesIntroduction: "$date" },
    });

    const url = new URL(link);
    expect(url.origin).toBe("https://bucket.s3.ap-southeast-2.amazonaws.com");
    expect(url.pathname).toBe("/pr-1/index.html");
    expect(url.searchParams.get("fixture")).toBe("test");
    expect(decodeJsonParam(url.searchParams.get("patch")!)).toEqual({
      coins: 1,
    });
    expect(decodeJsonParam(url.searchParams.get("ls")!)).toEqual({
      islesIntroduction: "$date",
    });
    expect(url.hash).toBe("#/world/plaza");
  });

  it("omits empty params and the root route", () => {
    expect(
      buildPreviewLink({
        base: "https://preview.test/?old=1#/gone",
        patch: {},
      }),
    ).toBe("https://preview.test/");
  });

  it("round-trips through readPreviewParams", () => {
    const link = buildPreviewLink({
      base: "https://preview.test/pr-3/index.html",
      route: "/world/plaza",
      patch: { coins: 3 },
      keepIntro: true,
    });
    const url = new URL(link);
    expect(readPreviewParams(url)).toEqual({
      patch: encodeJsonParam({ coins: 3 }),
      intro: "1",
    });
  });
});
