import Decimal from "decimal.js-light";

import { GameState } from "features/game/types/game";
import { sellBounty, SellBountyAction } from "./sellBounty";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { getChapterTicket } from "features/game/types/chapters";

describe("sellBounty", () => {
  const GAME_STATE: GameState = {
    ...TEST_FARM,
    inventory: {
      "Blue Balloon Flower": new Decimal(1),
      Obsidian: new Decimal(1),
    },
    bounties: {
      requests: [
        {
          id: "1",
          name: "Blue Balloon Flower",
          coins: 100,
          items: {
            "Sunflower Seed": 10,
          },
        },
        {
          id: "2",
          name: "Blue Balloon Flower",
          items: {
            "Amber Fossil": 1,
          },
        },
        {
          id: "3",
          name: "Blue Balloon Flower",
          items: {
            Horseshoe: 1,
          },
        },
        {
          id: "4",
          name: "Obsidian",
          sfl: 100,
        },
        {
          id: "5",
          name: "Blue Balloon Flower",
          items: {
            Timeshard: 1,
          },
        },
        {
          id: "6",
          name: "Mark",
          quantity: 100,
          items: {
            Timeshard: 9,
          },
        },
        {
          id: "7",
          name: "Doll",
          quantity: 1,
          items: {
            Timeshard: 9,
          },
        },
      ],
      completed: [],
    },
    coins: 0,
    farmActivity: {},
  } as GameState;

  it("ensures player has item", () => {
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "1",
    };

    expect(() =>
      sellBounty({
        state: {
          ...GAME_STATE,
          inventory: {},
        },
        action,
      }),
    ).toThrow("You do not have the ingredients to sell this bounty");
  });

  it("ensures player has item not placed", () => {
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "7",
    };

    expect(() =>
      sellBounty({
        state: {
          ...GAME_STATE,
          inventory: { Doll: new Decimal(1) },
          collectibles: {
            Doll: [
              {
                id: "1",
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
        action,
      }),
    ).toThrow("You do not have the ingredients to sell this bounty");
  });

  it("ensures bounty exists", () => {
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "999",
    };

    expect(() => sellBounty({ state: GAME_STATE, action })).toThrow(
      "Bounty does not exist",
    );
  });

  it("ensures not already completed", () => {
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "1",
    };

    const state = {
      ...GAME_STATE,
      bounties: {
        ...GAME_STATE.bounties,
        completed: [{ id: "1", soldAt: 123456789 }],
      },
    };

    expect(() => sellBounty({ state, action })).toThrow(
      "Bounty already completed",
    );
  });

  it("rewards coins", () => {
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "1",
    };

    const result = sellBounty({ state: GAME_STATE, action });

    expect(result.coins).toBe(100);
  });

  it("rewards items", () => {
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "1",
    };

    const result = sellBounty({ state: GAME_STATE, action });

    expect(result.inventory["Sunflower Seed"]).toEqual(new Decimal(10));
  });

  it("rewards Amber Fossil", () => {
    const mockDate = new Date(2024, 7, 10); // Time during Pharaoh's Treasure
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);

    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "2",
    };

    const result = sellBounty({ state: GAME_STATE, action });

    expect(result.inventory[getChapterTicket(mockDate.getTime())]).toEqual(
      new Decimal(1),
    );

    jest.useRealTimers();
  });

  it("rewards Horseshoe at Bull Run Season", () => {
    const mockDate = new Date(2024, 11, 11);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "3",
    };

    const result = sellBounty({ state: GAME_STATE, action });

    expect(result.inventory[getChapterTicket(mockDate.getTime())]).toEqual(
      new Decimal(1),
    );
  });

  it("rewards sfl", () => {
    const mockDate = new Date(2024, 11, 11);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "4",
    };

    const result = sellBounty({ state: GAME_STATE, action });

    expect(result.balance).toEqual(new Decimal(100));
  });

  it("rewards +1 Horseshoe when Cowboy Hat is worn during Bull Run Season", () => {
    const mockDate = new Date(2024, 11, 11);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "3",
    };

    const result = sellBounty({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hat: "Cowboy Hat",
          },
        },
      },
      action,
      createdAt: mockDate.getTime(),
    });

    expect(result.inventory[getChapterTicket(mockDate.getTime())]).toEqual(
      new Decimal(2),
    );
  });

  it("rewards +1 Horseshoe when Cowboy Shirt is worn during Bull Run Season", () => {
    const mockDate = new Date(2024, 11, 11);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "3",
    };

    const result = sellBounty({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            shirt: "Cowboy Shirt",
          },
        },
      },
      action,
      createdAt: mockDate.getTime(),
    });

    expect(result.inventory[getChapterTicket(mockDate.getTime())]).toEqual(
      new Decimal(2),
    );
  });

  it("rewards +1 Horseshoe when Cowboy Trouser is worn during Bull Run Season", () => {
    const mockDate = new Date(2024, 11, 11);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "3",
    };

    const result = sellBounty({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            pants: "Cowboy Trouser",
          },
        },
      },
      action,
      createdAt: mockDate.getTime(),
    });

    expect(result.inventory[getChapterTicket(mockDate.getTime())]).toEqual(
      new Decimal(2),
    );
  });

  it("stacks Cowboy Set boost at Bull Run Season", () => {
    const mockDate = new Date(2024, 11, 11);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "3",
    };

    const result = sellBounty({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hat: "Cowboy Hat",
            shirt: "Cowboy Shirt",
            pants: "Cowboy Trouser",
          },
        },
      },
      action,
      createdAt: mockDate.getTime(),
    });

    expect(result.inventory[getChapterTicket(mockDate.getTime())]).toEqual(
      new Decimal(4),
    );
  });

  it("rewards +1 TimeShard when Acorn Hat is worn during Winds of Change Chapter", () => {
    const mockDate = new Date(2025, 2, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);

    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "5",
    };

    const result = sellBounty({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hat: "Acorn Hat",
          },
        },
      },
      action,
      createdAt: mockDate.getTime(),
    });

    expect(result.inventory[getChapterTicket(mockDate.getTime())]).toEqual(
      new Decimal(2),
    );
  });

  it("stacks timeshard boosts during Winds of Change Chapter", () => {
    const mockDate = new Date(2025, 2, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);

    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "5",
    };

    const result = sellBounty({
      state: {
        ...GAME_STATE,
        collectibles: {
          Igloo: [
            {
              id: "123",
              coordinates: { x: -1, y: -1 },
              createdAt: Date.now() - 100,
              readyAt: Date.now() - 100,
            },
          ],
          Hammock: [
            {
              id: "123",
              coordinates: { x: -1, y: -1 },
              createdAt: Date.now() - 100,
              readyAt: Date.now() - 100,
            },
          ],
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hat: "Acorn Hat",
          },
        },
      },
      action,
      createdAt: mockDate.getTime(),
    });

    expect(result.inventory[getChapterTicket(mockDate.getTime())]).toEqual(
      new Decimal(4),
    );
  });

  it("subtracts the item", () => {
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "1",
    };

    const result = sellBounty({ state: GAME_STATE, action });

    expect(result.inventory["Blue Balloon Flower"]).toEqual(new Decimal(0));
  });

  it("marks as completed", () => {
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "1",
    };

    const result = sellBounty({ state: GAME_STATE, action });

    expect(result.bounties.completed).toHaveLength(1);
    expect(result.bounties.completed[0].id).toBe("1");
    expect(result.bounties.completed[0].soldAt).toBeDefined();
  });
  it("sell bounty with Mark Bounties", () => {
    const now = Date.now();
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "6",
    };

    const result = sellBounty({
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          Mark: new Decimal(100),
        },
      },
      action,
      createdAt: now,
    });

    expect(result.inventory[getChapterTicket(now)]).toEqual(new Decimal(9));
  });
});
