import Decimal from "decimal.js-light";
import { INITIAL_EQUIPMENT, INITIAL_FARM, TEST_FARM } from "../lib/constants";
import { claimAirdrop } from "./claimAirdrop";

describe("claimAirdrop", () => {
  const dateNow = Date.now();

  it("throws if no airdrops are available", () => {
    expect(() =>
      claimAirdrop({
        state: {
          ...TEST_FARM,
          airdrops: [],
        },
        action: {
          type: "airdrop.claimed",
          id: "1",
        },
      }),
    ).toThrow("No airdrops exist");
  });

  it("does not open non-existent reward", () => {
    expect(() =>
      claimAirdrop({
        state: {
          ...TEST_FARM,
          airdrops: [
            {
              id: "123",
              createdAt: Date.now(),
              items: {},
              wearables: {},
              sfl: 5,
              coins: 0,
            },
          ],
        },
        action: {
          type: "airdrop.claimed",
          id: "2",
        },
      }),
    ).toThrow("Airdrop #2 does not exist");
  });

  it("claims a SFL reward", () => {
    const state = claimAirdrop({
      state: {
        ...TEST_FARM,
        airdrops: [
          {
            id: "123",
            items: {},
            wearables: {},
            createdAt: Date.now(),
            sfl: 5,
            coins: 0,
          },
        ],
      },
      action: {
        type: "airdrop.claimed",
        id: "123",
      },
    });

    expect(state.balance).toEqual(new Decimal(5));
  });

  it("claims an items reward", () => {
    const state = claimAirdrop({
      state: {
        ...TEST_FARM,
        inventory: {},
        airdrops: [
          {
            id: "123",
            createdAt: Date.now(),
            wearables: {},
            items: {
              Gold: 5,
            },
            sfl: 0,
            coins: 0,
          },
        ],
      },
      action: {
        type: "airdrop.claimed",
        id: "123",
      },
    });

    expect(state.inventory).toEqual({
      Gold: new Decimal(5),
    });

    expect(state.airdrops).toEqual([]);
  });

  it("claims a wearable reward", () => {
    const state = claimAirdrop({
      state: {
        ...TEST_FARM,
        inventory: {},
        wardrobe: {
          "Red Farmer Shirt": 1,
        },
        airdrops: [
          {
            id: "123",
            createdAt: Date.now(),
            items: {},
            wearables: {
              "Red Farmer Shirt": 4,
              "Farmer Overalls": 1,
            },
            sfl: 0,
            coins: 0,
          },
        ],
      },
      action: {
        type: "airdrop.claimed",
        id: "123",
      },
    });

    expect(state.wardrobe).toEqual({
      "Red Farmer Shirt": 5,
      "Farmer Overalls": 1,
    });

    expect(state.airdrops).toEqual([]);
  });

  it("claims a reward of multiple items", () => {
    const state = claimAirdrop({
      state: {
        ...TEST_FARM,
        inventory: {
          Wood: new Decimal(5),
        },
        airdrops: [
          {
            id: "123",
            createdAt: Date.now(),
            wearables: {},
            items: {
              Gold: 5,
              Wood: 20,
            },
            sfl: 0,
            coins: 0,
          },
        ],
      },
      action: {
        type: "airdrop.claimed",
        id: "123",
      },
    });

    expect(state.inventory).toEqual({
      Gold: new Decimal(5),
      Wood: new Decimal(25),
    });
    expect(state.airdrops).toEqual([]);
  });

  it("claims multiple airdrops", () => {
    let state = claimAirdrop({
      state: {
        ...TEST_FARM,
        balance: new Decimal(2),
        inventory: {
          Sunflower: new Decimal(5),
        },
        airdrops: [
          {
            id: "123",
            createdAt: Date.now(),
            wearables: {},
            items: {
              Gold: 5,
              Wood: 20,
            },
            sfl: 0,
            coins: 0,
          },
          {
            id: "68",
            createdAt: Date.now(),
            sfl: 5,
            coins: 0,
            wearables: {},
            items: {
              Sunflower: 5,
            },
          },
        ],
      },
      action: {
        type: "airdrop.claimed",
        id: "123",
      },
    });

    expect(state.airdrops).toHaveLength(1);

    state = claimAirdrop({
      state,
      action: {
        type: "airdrop.claimed",
        id: "68",
      },
    });

    expect(state.inventory).toEqual({
      Gold: new Decimal(5),
      Wood: new Decimal(20),
      Sunflower: new Decimal(10),
    });

    expect(state.balance).toEqual(new Decimal(7));
    expect(state.airdrops).toEqual([]);
  });

  it("claims a coin reward", () => {
    const state = claimAirdrop({
      state: {
        ...TEST_FARM,
        inventory: {},
        wardrobe: {
          "Red Farmer Shirt": 1,
        },
        airdrops: [
          {
            id: "123",
            createdAt: Date.now(),
            items: {},
            wearables: {},
            sfl: 0,
            coins: 100,
          },
        ],
      },
      action: {
        type: "airdrop.claimed",
        id: "123",
      },
    });

    expect(state.coins).toEqual(100);

    expect(state.airdrops).toEqual([]);
  });

  it("removed placedItems land when claiming negative airdrops", () => {
    const state = claimAirdrop({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Abandoned Bear": new Decimal(2),
        },
        airdrops: [
          {
            id: "123",
            createdAt: Date.now(),
            items: {
              "Abandoned Bear": -1,
            },
            wearables: {},
            sfl: 0,
            coins: 0,
          },
        ],
        collectibles: {
          "Abandoned Bear": [
            {
              id: "123",
              readyAt: 0,
              createdAt: 0,
              coordinates: {
                x: 0,
                y: 0,
              },
            },
            {
              id: "456",
              readyAt: 0,
              createdAt: 0,
            },
          ],
        },
      },
      action: {
        type: "airdrop.claimed",
        id: "123",
      },
      createdAt: dateNow,
    });

    expect(state.inventory).toEqual({
      "Abandoned Bear": new Decimal(1),
    });

    expect(state.airdrops).toEqual([]);

    expect(state.collectibles).toEqual({
      "Abandoned Bear": [
        {
          id: "123",
          readyAt: 0,
          createdAt: 0,
          removedAt: dateNow,
        },
        {
          id: "456",
          readyAt: 0,
          createdAt: 0,
        },
      ],
    });
  });

  it("removes placedItems land from combination of farm and home if more than 1 item is claimed", () => {
    const state = claimAirdrop({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Abandoned Bear": new Decimal(4),
        },
        airdrops: [
          {
            id: "123",
            createdAt: Date.now(),
            items: {
              "Abandoned Bear": -3,
            },
            wearables: {},
            sfl: 0,
            coins: 0,
          },
        ],
        collectibles: {
          "Abandoned Bear": [
            {
              id: "123",
              readyAt: 0,
              createdAt: 0,
              coordinates: {
                x: 0,
                y: 0,
              },
            },
            {
              id: "456",
              readyAt: 0,
              createdAt: 0,
              coordinates: {
                x: 0,
                y: 0,
              },
            },
            {
              id: "789",
              readyAt: 0,
              createdAt: 0,
            },
          ],
        },
        home: {
          collectibles: {
            "Abandoned Bear": [
              {
                id: "123",
                readyAt: 0,
                createdAt: 0,
                coordinates: {
                  x: 0,
                  y: 0,
                },
              },
              {
                id: "456",
                readyAt: 0,
                createdAt: 0,
                coordinates: {
                  x: 0,
                  y: 0,
                },
              },
              {
                id: "789",
                readyAt: 0,
                createdAt: 0,
                coordinates: {
                  x: 0,
                  y: 0,
                },
              },
              {
                id: "135",
                readyAt: 0,
                createdAt: 0,
              },
            ],
          },
        },
      },
      action: {
        type: "airdrop.claimed",
        id: "123",
      },
      createdAt: dateNow,
    });

    expect(state.inventory).toEqual({
      "Abandoned Bear": new Decimal(1),
    });

    expect(state.airdrops).toEqual([]);

    expect(state.collectibles).toEqual({
      "Abandoned Bear": [
        {
          id: "123",
          readyAt: 0,
          createdAt: 0,
          removedAt: dateNow,
        },
        {
          id: "456",
          readyAt: 0,
          createdAt: 0,
          removedAt: dateNow,
        },
        {
          id: "789",
          readyAt: 0,
          createdAt: 0,
        },
      ],
    });
    expect(state.home.collectibles).toEqual({
      "Abandoned Bear": [
        {
          id: "123",
          readyAt: 0,
          createdAt: 0,
          removedAt: dateNow,
        },
        {
          id: "456",
          readyAt: 0,
          createdAt: 0,
          coordinates: {
            x: 0,
            y: 0,
          },
        },
        {
          id: "789",
          readyAt: 0,
          createdAt: 0,
          coordinates: {
            x: 0,
            y: 0,
          },
        },
        {
          id: "135",
          readyAt: 0,
          createdAt: 0,
        },
      ],
    });
  });

  it("removes placed buildings from farm when claiming negative airdrops", () => {
    const state = claimAirdrop({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Hen House": new Decimal(2),
        },
        airdrops: [
          {
            id: "123",
            createdAt: Date.now(),
            items: {
              "Hen House": -1,
            },
            wearables: {},
            sfl: 0,
            coins: 0,
          },
        ],
        buildings: {
          "Hen House": [
            {
              id: "123",
              readyAt: 0,
              createdAt: 0,
              coordinates: {
                x: 0,
                y: 0,
              },
            },
            {
              id: "456",
              readyAt: 0,
              createdAt: 0,
            },
          ],
        },
      },
      action: {
        type: "airdrop.claimed",
        id: "123",
      },
      createdAt: dateNow,
    });

    expect(state.inventory).toEqual({
      "Hen House": new Decimal(1),
    });

    expect(state.airdrops).toEqual([]);

    expect(state.buildings).toEqual({
      "Hen House": [
        {
          id: "123",
          readyAt: 0,
          createdAt: 0,
          removedAt: dateNow,
        },
        {
          id: "456",
          readyAt: 0,
          createdAt: 0,
        },
      ],
    });
  });

  it("removes placed resources from farm when claiming negative airdrops", () => {
    const state = claimAirdrop({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Gold Rock": new Decimal(2),
          "Pure Gold Rock": new Decimal(2),
        },
        gold: {
          123: {
            x: 0,
            y: 0,
            createdAt: dateNow,
            removedAt: dateNow,
            stone: { minedAt: dateNow },
            multiplier: 1,
          },
          456: {
            x: 0,
            y: 0,
            createdAt: dateNow,
            removedAt: dateNow,
            stone: { minedAt: dateNow },
            multiplier: 4,
            name: "Pure Gold Rock",
          },
        },
        airdrops: [
          {
            id: "123",
            createdAt: dateNow,
            items: {
              "Gold Rock": -1,
            },
            wearables: {},
            sfl: 0,
            coins: 0,
          },
        ],
      },
      action: {
        type: "airdrop.claimed",
        id: "123",
      },
      createdAt: dateNow,
    });

    expect(state.inventory["Gold Rock"]).toEqual(new Decimal(1));
    expect(state.gold[123]).toEqual(undefined);
    expect(state.airdrops).toEqual([]);
  });

  it("removes fused placed resources from farm when claiming negative airdrops", () => {
    const state = claimAirdrop({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Gold Rock": new Decimal(2),
          "Pure Gold Rock": new Decimal(2),
        },
        gold: {
          123: {
            x: 0,
            y: 0,
            createdAt: dateNow,
            removedAt: dateNow,
            stone: { minedAt: dateNow },
            multiplier: 1,
          },
          456: {
            x: 0,
            y: 0,
            createdAt: dateNow,
            removedAt: dateNow,
            stone: { minedAt: dateNow },
            multiplier: 4,
            name: "Pure Gold Rock",
          },
        },
        airdrops: [
          {
            id: "123",
            createdAt: dateNow,
            items: {
              "Pure Gold Rock": -1,
            },
            wearables: {},
            sfl: 0,
            coins: 0,
          },
        ],
      },
      action: {
        type: "airdrop.claimed",
        id: "123",
      },
      createdAt: dateNow,
    });

    expect(state.inventory["Pure Gold Rock"]).toEqual(new Decimal(1));
    expect(state.gold[456]).toEqual(undefined);
    expect(state.airdrops).toEqual([]);
  });

  it("does nothing if no resources are placed", () => {
    const state = claimAirdrop({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Gold Rock": new Decimal(2),
          "Pure Gold Rock": new Decimal(2),
        },
        gold: {},
        airdrops: [
          {
            id: "123",
            createdAt: dateNow,
            items: {
              "Pure Gold Rock": -1,
            },
            wearables: {},
            sfl: 0,
            coins: 0,
          },
        ],
      },
      action: {
        type: "airdrop.claimed",
        id: "123",
      },
      createdAt: dateNow,
    });

    expect(state.inventory["Pure Gold Rock"]).toEqual(new Decimal(1));
    expect(state.gold).toEqual({});
    expect(state.airdrops).toEqual([]);
  });

  it("unequips wearable from bumpkin when claiming negative airdrop", () => {
    const state = claimAirdrop({
      state: {
        ...INITIAL_FARM,
        wardrobe: {
          "Red Farmer Shirt": 2,
          "Farmer Overalls": 1,
        },
        airdrops: [
          {
            id: "123",
            createdAt: Date.now(),
            items: {},
            wearables: {
              "Red Farmer Shirt": -1,
            },
            sfl: 0,
            coins: 0,
          },
        ],
      },
      action: {
        type: "airdrop.claimed",
        id: "123",
      },
      createdAt: dateNow,
    });

    expect(state.wardrobe["Red Farmer Shirt"]).toEqual(1);
    expect(state.bumpkin?.equipped.shirt).toBeUndefined();
    expect(state.bumpkin?.equipped.pants).toEqual("Farmer Overalls");
    expect(state.airdrops).toEqual([]);
  });

  it("unequips wearable from farmhands when claiming negative airdrop", () => {
    const state = claimAirdrop({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_EQUIPMENT,
            shirt: "Yellow Farmer Shirt",
          },
        },
        farmHands: {
          bumpkins: {
            1: {
              equipped: {
                ...INITIAL_EQUIPMENT,
              },
            },
          },
        },
        wardrobe: {
          "Red Farmer Shirt": 2,
          "Yellow Farmer Shirt": 1,
        },
        airdrops: [
          {
            id: "123",
            createdAt: Date.now(),
            items: {},
            wearables: {
              "Red Farmer Shirt": -1,
            },
            sfl: 0,
            coins: 0,
          },
        ],
      },
      action: {
        type: "airdrop.claimed",
        id: "123",
      },
      createdAt: dateNow,
    });

    expect(state.wardrobe["Red Farmer Shirt"]).toEqual(1);
    expect(state.farmHands.bumpkins[1]?.equipped.shirt).toBeUndefined();
    expect(state.farmHands.bumpkins[1]?.equipped.pants).toEqual(
      "Farmer Overalls",
    );
    expect(state.bumpkin?.equipped.shirt).toEqual("Yellow Farmer Shirt");
    expect(state.airdrops).toEqual([]);
  });

  it("unequips wearable from bumpkin first, then farmhands when claiming negative airdrop", () => {
    const state = claimAirdrop({
      state: {
        ...INITIAL_FARM,
        farmHands: {
          bumpkins: {
            1: {
              equipped: {
                ...INITIAL_EQUIPMENT,
              },
            },
          },
        },
        wardrobe: {
          "Red Farmer Shirt": 2,
        },
        airdrops: [
          {
            id: "123",
            createdAt: Date.now(),
            items: {},
            wearables: {
              "Red Farmer Shirt": -1,
            },
            sfl: 0,
            coins: 0,
          },
        ],
      },
      action: {
        type: "airdrop.claimed",
        id: "123",
      },
      createdAt: dateNow,
    });

    expect(state.wardrobe["Red Farmer Shirt"]).toEqual(1);
    expect(state.bumpkin?.equipped.shirt).toBeUndefined();
    expect(state.farmHands.bumpkins[1]?.equipped.shirt).toEqual(
      "Red Farmer Shirt",
    );
    expect(state.airdrops).toEqual([]);
  });

  it("claims a positive wearable airdrop without unequipping", () => {
    const state = claimAirdrop({
      state: {
        ...INITIAL_FARM,
        wardrobe: {
          "Red Farmer Shirt": 1,
        },
        airdrops: [
          {
            id: "123",
            createdAt: Date.now(),
            items: {},
            wearables: {
              "Red Farmer Shirt": 2,
            },
            sfl: 0,
            coins: 0,
          },
        ],
      },
      action: {
        type: "airdrop.claimed",
        id: "123",
      },
      createdAt: dateNow,
    });

    expect(state.wardrobe["Red Farmer Shirt"]).toEqual(3);
    expect(state.bumpkin?.equipped.shirt).toEqual("Red Farmer Shirt");
    expect(state.airdrops).toEqual([]);
  });
});
