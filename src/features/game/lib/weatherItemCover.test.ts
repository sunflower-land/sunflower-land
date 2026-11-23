import { INITIAL_FARM } from "./constants";
import type { GameState, PlacedItem } from "../types/game";
import type { ScheduledWeatherEvent } from "../types/weather";
import {
  findUsedEvent,
  getUnprotectedThreat,
  getWindfallBonus,
  getUsedUntil,
  getWeatherItemCover,
  isWeatherItemGreyed,
} from "./weatherItemCover";

const HOUR = 60 * 60 * 1000;

// 2026-11-16 starts a spring week and 2026-11-23 a summer week (the season
// rotates every Monday). Event times are made up for the tests, except that
// each one sits inside a week of the right season.
const BEES_1: ScheduledWeatherEvent = {
  name: "beeMigration",
  startAt: Date.UTC(2026, 10, 16),
  endAt: Date.UTC(2026, 10, 19),
};
const FLOOD: ScheduledWeatherEvent = {
  name: "flood",
  startAt: Date.UTC(2026, 10, 19),
  endAt: Date.UTC(2026, 10, 23),
};
const BEES_2: ScheduledWeatherEvent = {
  name: "beeMigration",
  startAt: Date.UTC(2026, 10, 23),
  endAt: Date.UTC(2026, 10, 26),
};
const EVENTS = [BEES_1, FLOOD, BEES_2];

const MID_FLOOD = FLOOD.startAt + 24 * HOUR;

const copy = (fields: Partial<PlacedItem> = {}): PlacedItem => ({
  id: "1",
  coordinates: { x: 0, y: 0 },
  createdAt: 0,
  readyAt: 0,
  ...fields,
});

const lifted = (fields: Partial<PlacedItem> = {}): PlacedItem => ({
  ...copy(fields),
  coordinates: undefined,
});

const farm = (fields: Partial<GameState> = {}): GameState => ({
  ...INITIAL_FARM,
  collectibles: {},
  boostHistory: undefined,
  ...fields,
});

describe("weather item cover", () => {
  describe("a copy placed before its event", () => {
    const sandbag = copy({ placedAt: FLOOD.startAt - HOUR });
    const game = farm({ collectibles: { Sandbag: [sandbag] } });
    const args = { game, item: "Sandbag" as const, events: EVENTS };

    it("covers the event while it runs", () => {
      expect(getWeatherItemCover({ ...args, now: MID_FLOOD })).toEqual(FLOOD);
      expect(
        isWeatherItemGreyed({ ...args, placement: sandbag, now: MID_FLOOD }),
      ).toBe(false);
    });

    it("is used on that event", () => {
      expect(
        getUsedUntil({ ...args, placement: sandbag, now: MID_FLOOD }),
      ).toBe(FLOOD.endAt);
    });

    it("greys out when the event ends", () => {
      expect(
        isWeatherItemGreyed({ ...args, placement: sandbag, now: FLOOD.endAt }),
      ).toBe(true);
      expect(
        isWeatherItemGreyed({
          ...args,
          placement: sandbag,
          now: FLOOD.endAt - 1,
        }),
      ).toBe(false);
    });

    it("doesn't cover anything before the event starts", () => {
      expect(
        getWeatherItemCover({ ...args, now: FLOOD.startAt - 1 }),
      ).toBeUndefined();
      expect(
        getUsedUntil({ ...args, placement: sandbag, now: FLOOD.startAt - 1 }),
      ).toBeUndefined();
    });
  });

  it("covers from the moment it is placed mid-event", () => {
    const sandbag = copy({ placedAt: MID_FLOOD });
    const game = farm({ collectibles: { Sandbag: [sandbag] } });

    expect(
      getWeatherItemCover({
        game,
        item: "Sandbag",
        events: EVENTS,
        now: MID_FLOOD,
      }),
    ).toEqual(FLOOD);
  });

  describe("a copy lifted mid-event", () => {
    const sandbag = lifted({ usedUntil: FLOOD.endAt });
    const game = farm({ collectibles: { Sandbag: [sandbag] } });
    const args = { game, item: "Sandbag" as const, events: EVENTS };

    it("stops covering", () => {
      expect(
        getWeatherItemCover({ ...args, now: MID_FLOOD + HOUR }),
      ).toBeUndefined();
    });

    it("still greys out when the event ends", () => {
      expect(
        isWeatherItemGreyed({ ...args, placement: sandbag, now: FLOOD.endAt }),
      ).toBe(true);
    });

    it("covers again when placed back during the same event", () => {
      const placedBack = copy({
        usedUntil: FLOOD.endAt,
        placedAt: MID_FLOOD + 2 * HOUR,
      });

      expect(
        getWeatherItemCover({
          ...args,
          game: farm({ collectibles: { Sandbag: [placedBack] } }),
          now: MID_FLOOD + 2 * HOUR,
        }),
      ).toEqual(FLOOD);
    });
  });

  it("stays fresh when placed and lifted before its event", () => {
    const sandbag = lifted();
    const game = farm({ collectibles: { Sandbag: [sandbag] } });
    const args = {
      game,
      item: "Sandbag" as const,
      placement: sandbag,
      events: EVENTS,
    };

    expect(getUsedUntil({ ...args, now: FLOOD.endAt + HOUR })).toBeUndefined();
    expect(isWeatherItemGreyed({ ...args, now: FLOOD.endAt + HOUR })).toBe(
      false,
    );
  });

  it("doesn't use a copy lifted at the very moment its event starts", () => {
    expect(
      findUsedEvent({
        game: farm(),
        item: "Sandbag",
        from: FLOOD.startAt - HOUR,
        to: FLOOD.startAt,
        events: EVENTS,
      }),
    ).toBeUndefined();
    expect(
      findUsedEvent({
        game: farm(),
        item: "Sandbag",
        from: FLOOD.startAt - HOUR,
        to: FLOOD.startAt + 1,
        events: EVENTS,
      }),
    ).toEqual(FLOOD);
  });

  it("is used on the first of two events and doesn't cover the second", () => {
    const lure = copy({ placedAt: BEES_1.startAt - HOUR });
    const game = farm({ collectibles: { "Wildflower Lure": [lure] } });
    const args = { game, item: "Wildflower Lure" as const, events: EVENTS };
    const midBees2 = BEES_2.startAt + HOUR;

    expect(getWeatherItemCover({ ...args, now: midBees2 })).toBeUndefined();
    expect(getUsedUntil({ ...args, placement: lure, now: midBees2 })).toBe(
      BEES_1.endAt,
    );
    expect(
      isWeatherItemGreyed({ ...args, placement: lure, now: midBees2 }),
    ).toBe(true);
  });

  describe("with a Guardian", () => {
    const sandbag = copy({ placedAt: FLOOD.startAt - HOUR });
    const afterFlood = FLOOD.endAt + HOUR;

    it("keeps a threat item fresh when the season's Guardian was out at the start", () => {
      const game = farm({
        collectibles: {
          Sandbag: [sandbag],
          "Spring Guardian": [copy({ placedAt: FLOOD.startAt - HOUR })],
        },
      });
      const args = {
        game,
        item: "Sandbag" as const,
        placement: sandbag,
        events: EVENTS,
      };

      expect(getUsedUntil({ ...args, now: afterFlood })).toBeUndefined();
      expect(isWeatherItemGreyed({ ...args, now: afterFlood })).toBe(false);
    });

    it("counts a Guardian that was out at the start and lifted later", () => {
      const game = farm({
        collectibles: {
          Sandbag: [sandbag],
          "Spring Guardian": [lifted()],
        },
        boostHistory: {
          "Spring Guardian": [
            { from: FLOOD.startAt - HOUR, to: FLOOD.startAt + HOUR },
          ],
        },
      });

      expect(
        isWeatherItemGreyed({
          game,
          item: "Sandbag",
          placement: sandbag,
          events: EVENTS,
          now: afterFlood,
        }),
      ).toBe(false);
    });

    it("uses the item when the Guardian was placed after the start", () => {
      const game = farm({
        collectibles: {
          Sandbag: [sandbag],
          "Spring Guardian": [copy({ placedAt: MID_FLOOD })],
        },
      });

      expect(
        isWeatherItemGreyed({
          game,
          item: "Sandbag",
          placement: sandbag,
          events: EVENTS,
          now: afterFlood,
        }),
      ).toBe(true);
    });

    it("uses the item when the Guardian is another season's", () => {
      const game = farm({
        collectibles: {
          Sandbag: [sandbag],
          "Summer Guardian": [copy({ placedAt: FLOOD.startAt - HOUR })],
        },
      });

      expect(
        isWeatherItemGreyed({
          game,
          item: "Sandbag",
          placement: sandbag,
          events: EVENTS,
          now: afterFlood,
        }),
      ).toBe(true);
    });

    it("still uses a positive-event item", () => {
      const lure = copy({ placedAt: BEES_1.startAt - HOUR });
      const game = farm({
        collectibles: {
          "Wildflower Lure": [lure],
          "Spring Guardian": [copy({ placedAt: BEES_1.startAt - HOUR })],
        },
      });

      expect(
        isWeatherItemGreyed({
          game,
          item: "Wildflower Lure",
          placement: lure,
          events: EVENTS,
          now: BEES_1.endAt,
        }),
      ).toBe(true);
    });
  });

  it("doesn't look at events settled before weatherCheckedUntil", () => {
    // Placed through the flood, which a Guardian covered; the Guardian's
    // history has since been pruned, but the server recorded the decision.
    const sandbag = copy({
      placedAt: FLOOD.startAt - HOUR,
      weatherCheckedUntil: FLOOD.endAt,
    });
    const game = farm({ collectibles: { Sandbag: [sandbag] } });

    expect(
      isWeatherItemGreyed({
        game,
        item: "Sandbag",
        placement: sandbag,
        events: EVENTS,
        now: FLOOD.endAt + HOUR,
      }),
    ).toBe(false);
  });

  it("goes by a stored usedUntil over what it would derive", () => {
    const sandbag = copy({
      placedAt: FLOOD.startAt - HOUR,
      usedUntil: BEES_1.endAt,
    });
    const game = farm({ collectibles: { Sandbag: [sandbag] } });
    const args = { game, item: "Sandbag" as const, events: EVENTS };

    expect(getUsedUntil({ ...args, placement: sandbag, now: MID_FLOOD })).toBe(
      BEES_1.endAt,
    );
    expect(getWeatherItemCover({ ...args, now: MID_FLOOD })).toBeUndefined();
  });

  it("finds a copy placed in the home", () => {
    const sandbag = copy({ placedAt: FLOOD.startAt - HOUR });
    const game = farm({
      home: { ...INITIAL_FARM.home, collectibles: { Sandbag: [sandbag] } },
    });

    expect(
      getWeatherItemCover({
        game,
        item: "Sandbag",
        events: EVENTS,
        now: MID_FLOOD,
      }),
    ).toEqual(FLOOD);
  });

  describe("getUnprotectedThreat", () => {
    const args = { name: "flood" as const, events: EVENTS, now: MID_FLOOD };

    it("returns the threat while it runs", () => {
      expect(getUnprotectedThreat({ ...args, game: farm() })).toEqual(FLOOD);
    });

    it("returns nothing when that threat isn't running", () => {
      expect(
        getUnprotectedThreat({ ...args, game: farm(), now: FLOOD.endAt }),
      ).toBeUndefined();
    });

    it("returns nothing while its item covers it", () => {
      const game = farm({
        collectibles: { Sandbag: [copy({ placedAt: MID_FLOOD - HOUR })] },
      });

      expect(getUnprotectedThreat({ ...args, game })).toBeUndefined();
    });

    it("returns nothing when the season's Guardian was out at its start", () => {
      const game = farm({
        collectibles: {
          "Spring Guardian": [copy({ placedAt: FLOOD.startAt - HOUR })],
        },
      });

      expect(getUnprotectedThreat({ ...args, game })).toBeUndefined();
    });

    it("returns the threat when its item was used on an earlier event", () => {
      const game = farm({
        collectibles: {
          Sandbag: [
            copy({ placedAt: FLOOD.startAt - HOUR, usedUntil: BEES_1.endAt }),
          ],
        },
      });

      expect(getUnprotectedThreat({ ...args, game })).toEqual(FLOOD);
    });
  });
  describe("getWindfallBonus", () => {
    // 2026-11-23 starts a summer week.
    const HARVEST: ScheduledWeatherEvent = {
      name: "bountifulHarvest",
      startAt: Date.UTC(2026, 10, 23),
      endAt: Date.UTC(2026, 10, 26),
    };
    const FRENZY: ScheduledWeatherEvent = {
      name: "fishFrenzy",
      startAt: Date.UTC(2026, 10, 26),
      endAt: Date.UTC(2026, 10, 30),
    };
    const MID_HARVEST = HARVEST.startAt + 24 * HOUR;
    const args = {
      name: "bountifulHarvest" as const,
      events: [HARVEST, FRENZY],
      now: MID_HARVEST,
    };

    it("gives +0.4 while the windfall runs", () => {
      expect(getWindfallBonus({ ...args, game: farm() })).toEqual({
        amount: 0.4,
      });
    });

    it("gives nothing before it starts or once it ends", () => {
      const game = farm();

      expect(
        getWindfallBonus({ ...args, game, now: HARVEST.startAt - 1 }),
      ).toEqual({ amount: 0 });
      expect(getWindfallBonus({ ...args, game, now: HARVEST.startAt })).toEqual(
        { amount: 0.4 },
      );
      expect(getWindfallBonus({ ...args, game, now: HARVEST.endAt })).toEqual({
        amount: 0,
      });
    });

    it("gives nothing while another event runs", () => {
      expect(
        getWindfallBonus({
          ...args,
          game: farm(),
          now: FRENZY.startAt + HOUR,
        }),
      ).toEqual({ amount: 0 });
    });

    it("gives +0.4 for Fish Frenzy while it runs", () => {
      expect(
        getWindfallBonus({
          ...args,
          name: "fishFrenzy",
          game: farm(),
          now: FRENZY.startAt + HOUR,
        }),
      ).toEqual({ amount: 0.4 });
    });

    it("gives +0.8 when the season's Guardian was out at the start", () => {
      const game = farm({
        collectibles: {
          "Summer Guardian": [copy({ placedAt: HARVEST.startAt - HOUR })],
        },
      });

      expect(getWindfallBonus({ ...args, game })).toEqual({
        amount: 0.8,
        guardian: "Summer Guardian",
      });
    });

    it("keeps +0.8 when that Guardian is lifted during the event", () => {
      const game = farm({
        collectibles: { "Summer Guardian": [lifted()] },
        boostHistory: {
          "Summer Guardian": [
            { from: HARVEST.startAt - HOUR, to: MID_HARVEST - HOUR },
          ],
        },
      });

      expect(getWindfallBonus({ ...args, game })).toEqual({
        amount: 0.8,
        guardian: "Summer Guardian",
      });
    });

    it("gives +0.4 when the Guardian was placed after the start", () => {
      const game = farm({
        collectibles: {
          "Summer Guardian": [copy({ placedAt: HARVEST.startAt + HOUR })],
        },
      });

      expect(getWindfallBonus({ ...args, game })).toEqual({ amount: 0.4 });
    });

    it("gives +0.4 when the Guardian is another season's", () => {
      const game = farm({
        collectibles: {
          "Spring Guardian": [copy({ placedAt: HARVEST.startAt - HOUR })],
        },
      });

      expect(getWindfallBonus({ ...args, game })).toEqual({ amount: 0.4 });
    });
  });
});
