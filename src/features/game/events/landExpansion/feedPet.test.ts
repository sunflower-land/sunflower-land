import { INITIAL_FARM } from "features/game/lib/constants";
import { feedPet } from "./feedPet";
import Decimal from "decimal.js-light";

describe("feedPet", () => {
  it("requires pet exists", () => {
    expect(() =>
      feedPet({
        state: INITIAL_FARM,
        action: { type: "pet.fed", name: "Barkley", resource: "Acorn" },
      }),
    ).toThrow("Pet Barkley not found");
  });

  it("requires pet is awake (has not been fed in the last 12 hours)", () => {
    expect(() =>
      feedPet({
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Pumpkin Soup": new Decimal(10),
          },
          collectibles: {
            Barkley: [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                id: "1",
                readyAt: 0,
              },
            ],
          },
          pets: {
            Barkley: {
              cravings: ["Pumpkin Soup"],
              readyAt: Date.now() + 1000,
            },
          },
        },
        action: { type: "pet.fed", name: "Barkley", resource: "Acorn" },
      }),
    ).toThrow("Pet is sleeping");
  });

  it("requires you have food", () => {
    expect(() =>
      feedPet({
        state: {
          ...INITIAL_FARM,
          collectibles: {
            Barkley: [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                id: "1",
                readyAt: 0,
              },
            ],
          },
          pets: {
            Barkley: {
              cravings: ["Pumpkin Soup"],
              readyAt: Date.now() - 24 * 60 * 60 * 1000,
            },
          },
        },
        action: { type: "pet.fed", name: "Barkley", resource: "Acorn" },
      }),
    ).toThrow("Missing Pumpkin Soup");
  });

  it("requires pet can fetch item", () => {
    expect(() =>
      feedPet({
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Pumpkin Soup": new Decimal(10),
          },
          collectibles: {
            Barkley: [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                id: "1",
                readyAt: 0,
              },
            ],
          },
          pets: {
            Barkley: {
              cravings: ["Pumpkin Soup"],
              readyAt: Date.now() - 24 * 60 * 60 * 1000,
            },
          },
        },
        action: { type: "pet.fed", name: "Barkley", resource: "Ruffroot" },
      }),
    ).toThrow("Pet cannot fetch Ruffroot");
  });

  it("fetches the item", () => {
    const now = Date.now();
    const state = feedPet({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Pumpkin Soup": new Decimal(10),
        },
        collectibles: {
          Barkley: [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        pets: {
          Barkley: {
            cravings: ["Pumpkin Soup"],
            readyAt: now - 24 * 60 * 60 * 1000,
          },
        },
      },
      action: { type: "pet.fed", name: "Barkley", resource: "Chewed Bone" },
      createdAt: now,
    });

    expect(state.inventory["Pumpkin Soup"]).toStrictEqual(new Decimal(9));
    expect(state.inventory["Chewed Bone"]).toStrictEqual(new Decimal(1));
    expect(state.pets?.Barkley?.readyAt).toEqual(now + 12 * 60 * 60 * 1000);
  });
});
