import { INITIAL_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import type { Pet, PetName, PetNFT } from "features/game/types/pets";
import { planBulkFetch } from "./planBulkFetch";

const now = Date.now();
const state: GameState = { ...INITIAL_FARM };

// XP thresholds: level n requires 50 * (n-1) * n XP.
const LEVEL_3_XP = 300;
const LEVEL_18_XP = 15300;
const LEVEL_100_XP = 495000;

const makePet = (name: PetName, overrides: Partial<Pet> = {}): Pet => ({
  name,
  requests: { food: [], fedAt: now },
  energy: 500,
  experience: 0,
  pettedAt: now,
  ...overrides,
});

type ActivePets = [PetName | number, Pet | PetNFT | undefined][];

describe("planBulkFetch", () => {
  it("returns an empty plan when nothing is requested", () => {
    const activePets: ActivePets = [["Barkley", makePet("Barkley")]];
    const plan = planBulkFetch({ activePets, state, desired: {}, now });

    expect(plan.fetches).toEqual([]);
    expect(plan.shortfall).toEqual({});
  });

  it("meets demand within a pet's energy budget", () => {
    const activePets: ActivePets = [
      ["Barkley", makePet("Barkley", { energy: 500 })],
    ];
    const plan = planBulkFetch({
      activePets,
      state,
      desired: { Acorn: 3 },
      now,
    });

    expect(plan.fetches).toEqual([
      { petId: "Barkley", fetch: "Acorn", amount: 3 },
    ]);
    expect(plan.fulfilled.Acorn?.toNumber()).toEqual(3);
    expect(plan.shortfall).toEqual({});
    expect(plan.energyAfter.Barkley).toEqual(200);
  });

  it("reports a shortfall when there is not enough energy", () => {
    const activePets: ActivePets = [
      ["Barkley", makePet("Barkley", { energy: 250 })],
    ];
    const plan = planBulkFetch({
      activePets,
      state,
      desired: { Acorn: 5 },
      now,
    });

    // 250 energy / 100 per Acorn = 2 fetches.
    expect(plan.fetches).toEqual([
      { petId: "Barkley", fetch: "Acorn", amount: 2 },
    ]);
    expect(plan.fulfilled.Acorn?.toNumber()).toEqual(2);
    expect(plan.shortfall.Acorn?.toNumber()).toEqual(3);
  });

  it("excludes napping and neglected pets", () => {
    const activePets: ActivePets = [
      // Napping: petted more than 2 hours ago.
      ["Barkley", makePet("Barkley", { pettedAt: now - 3 * 60 * 60 * 1000 })],
      // Neglected: has XP and last fed over 3 days ago.
      [
        "Meowchi",
        makePet("Meowchi", {
          experience: 120,
          requests: { food: [], fedAt: now - 4 * 24 * 60 * 60 * 1000 },
        }),
      ],
    ];
    const plan = planBulkFetch({
      activePets,
      state,
      desired: { Acorn: 1 },
      now,
    });

    expect(plan.fetches).toEqual([]);
    expect(plan.shortfall.Acorn?.toNumber()).toEqual(1);
  });

  it("reports a shortfall for level-locked resources", () => {
    // Barkley at level 1 cannot fetch Chewed Bone (requires level 3).
    const activePets: ActivePets = [["Barkley", makePet("Barkley")]];
    const plan = planBulkFetch({
      activePets,
      state,
      desired: { "Chewed Bone": 1 },
      now,
    });

    expect(plan.fetches).toEqual([]);
    expect(plan.shortfall["Chewed Bone"]?.toNumber()).toEqual(1);
  });

  it("allocates scarce resources first and preserves specialist pets", () => {
    // Barkley (Dog) is the only pet that can fetch Chewed Bone.
    // Both pets can fetch Acorn. With exactly enough energy for the combined
    // demand, a naive Acorn-first pass would starve Chewed Bone.
    const activePets: ActivePets = [
      ["Barkley", makePet("Barkley", { experience: LEVEL_3_XP, energy: 200 })],
      ["Meowchi", makePet("Meowchi", { energy: 200 })],
    ];
    const plan = planBulkFetch({
      activePets,
      state,
      desired: { Acorn: 2, "Chewed Bone": 1 },
      now,
    });

    expect(plan.shortfall).toEqual({});
    // Chewed Bone comes from the specialist (Barkley)...
    expect(plan.fetches).toContainEqual({
      petId: "Barkley",
      fetch: "Chewed Bone",
      amount: 1,
    });
    // ...and all Acorn from Meowchi, so Barkley's energy is saved for its specialty.
    expect(plan.fetches).toContainEqual({
      petId: "Meowchi",
      fetch: "Acorn",
      amount: 2,
    });
    expect(
      plan.fetches.find((f) => f.petId === "Barkley" && f.fetch === "Acorn"),
    ).toBeUndefined();
  });

  it("uses boosted yields to reduce the number of fetches needed", () => {
    // A level 18 pet yields 2.1 Acorn per fetch (10% level boost + 1 flat),
    // so 4 Acorn only needs 2 fetches.
    const activePets: ActivePets = [
      ["Barkley", makePet("Barkley", { experience: LEVEL_18_XP, energy: 500 })],
    ];
    const plan = planBulkFetch({
      activePets,
      state,
      desired: { Acorn: 4 },
      now,
    });

    expect(plan.fetches).toEqual([
      { petId: "Barkley", fetch: "Acorn", amount: 2 },
    ]);
    expect(plan.fulfilled.Acorn?.toNumber()).toEqual(4.2);
    expect(plan.shortfall).toEqual({});
  });

  it("prefers the higher-yield pet even when it is more useful elsewhere", () => {
    // Meowchi (Cat, lvl 100) yields 1.25 heart leaf and can also make ribbon;
    // Twizzle (Owl, lvl 3) yields only 1.0 and cannot make ribbon. With ribbon
    // also requested, the old "least useful elsewhere" pick saved Meowchi and
    // handed heart leaf to Twizzle. Ranking yield first uses the efficient pet.
    // (Barkley is only here so ribbon has two sources and stays pending while
    // heart leaf is allocated.)
    const activePets: ActivePets = [
      [
        "Meowchi",
        makePet("Meowchi", { experience: LEVEL_100_XP, energy: 5000 }),
      ],
      ["Twizzle", makePet("Twizzle", { experience: LEVEL_3_XP, energy: 5000 })],
      [
        "Barkley",
        makePet("Barkley", { experience: LEVEL_18_XP, energy: 5000 }),
      ],
    ];
    const plan = planBulkFetch({
      activePets,
      state,
      desired: { "Heart leaf": 6, Ribbon: 4 },
      now,
    });

    // The higher-yield pet (Meowchi, 1.25) takes the heart leaf...
    expect(
      plan.fetches.find(
        (f) => f.petId === "Meowchi" && f.fetch === "Heart leaf",
      ),
    ).toBeDefined();
    // ...not the lower-yield Twizzle (1.0), which the old logic would have used.
    expect(
      plan.fetches.find(
        (f) => f.petId === "Twizzle" && f.fetch === "Heart leaf",
      ),
    ).toBeUndefined();
    // Ribbon likewise goes to the higher-yield Meowchi (1.25 vs Barkley's 1.1),
    // which still has energy to spare — the efficient pet takes both.
    expect(
      plan.fetches.find((f) => f.petId === "Meowchi" && f.fetch === "Ribbon"),
    ).toBeDefined();
    expect(
      plan.fetches.find((f) => f.petId === "Barkley" && f.fetch === "Ribbon"),
    ).toBeUndefined();
    expect(plan.shortfall).toEqual({});
  });
});
