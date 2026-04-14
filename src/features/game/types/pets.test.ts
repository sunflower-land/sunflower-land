import { getPetLevel, isPetOfTypeFed } from "./pets";

describe("getPetLevel", () => {
  it("should return the correct experience to next level for level 2", () => {
    expect(getPetLevel(100)).toMatchObject({
      level: 2,
      experienceBetweenLevels: 200,
    });
  });

  it("should return the correct experience to next level for level 3", () => {
    expect(getPetLevel(300)).toMatchObject({
      level: 3,
      experienceBetweenLevels: 300,
    });
  });

  it("should return the correct experience to next level for level 4", () => {
    expect(getPetLevel(600)).toMatchObject({
      level: 4,
      experienceBetweenLevels: 400,
    });
  });

  it("should return the correct experience to next level for level 5", () => {
    expect(getPetLevel(1000)).toMatchObject({
      level: 5,
      experienceBetweenLevels: 500,
    });
  });

  it("should return the correct experience to next level for level 6", () => {
    expect(getPetLevel(1500)).toMatchObject({
      level: 6,
      experienceBetweenLevels: 600,
    });
  });

  it("should return the correct experience to next level for level 7", () => {
    expect(getPetLevel(2100)).toMatchObject({
      level: 7,
      experienceBetweenLevels: 700,
    });
  });

  it("should return the correct experience to next level for level 8", () => {
    expect(getPetLevel(2800)).toMatchObject({
      level: 8,
      experienceBetweenLevels: 800,
    });
  });

  it("should return the correct experience to next level for level 9", () => {
    expect(getPetLevel(3600)).toMatchObject({
      level: 9,
      experienceBetweenLevels: 900,
    });
  });

  it("should return the correct experience to next level for level 10", () => {
    expect(getPetLevel(4500)).toMatchObject({
      level: 10,
      experienceBetweenLevels: 1000,
    });
  });

  it("should return the correct experience to next level for level 11", () => {
    expect(getPetLevel(5500)).toMatchObject({
      level: 11,
      experienceBetweenLevels: 1100,
    });
  });

  it("should return the correct experience to next level for level 12", () => {
    expect(getPetLevel(6600)).toMatchObject({
      level: 12,
      experienceBetweenLevels: 1200,
    });
  });

  it("should return the correct experience to next level for level 13", () => {
    expect(getPetLevel(7800)).toMatchObject({
      level: 13,
      experienceBetweenLevels: 1300,
    });
  });

  it("should return the correct experience to next level for level 14", () => {
    expect(getPetLevel(9100)).toMatchObject({
      level: 14,
      experienceBetweenLevels: 1400,
    });
  });

  it("should return the correct experience to next level for level 15", () => {
    expect(getPetLevel(10500)).toMatchObject({
      level: 15,
      experienceBetweenLevels: 1500,
    });
  });

  it("should return the correct experience to next level for level 16", () => {
    expect(getPetLevel(12000)).toMatchObject({
      level: 16,
      experienceBetweenLevels: 1600,
    });
  });

  it("should return the correct experience to next level for level 17", () => {
    expect(getPetLevel(13600)).toMatchObject({
      level: 17,
      experienceBetweenLevels: 1700,
    });
  });

  it("should return the correct experience to next level for level 18", () => {
    expect(getPetLevel(15300)).toMatchObject({
      level: 18,
      experienceBetweenLevels: 1800,
    });
  });

  it("should return the correct experience to next level for level 19", () => {
    expect(getPetLevel(17100)).toMatchObject({
      level: 19,
      experienceBetweenLevels: 1900,
    });
  });

  it("should return the correct experience to next level for level 20", () => {
    expect(getPetLevel(19000)).toMatchObject({
      level: 20,
      experienceBetweenLevels: 2000,
    });
  });

  it("should return the correct experience to next level for level 21", () => {
    expect(getPetLevel(21000)).toMatchObject({
      level: 21,
      experienceBetweenLevels: 2100,
    });
  });
});

describe("isPetOfTypeFed", () => {
  it("returns true if a pet of the type was fed today (excluding the given id)", () => {
    const now = new Date("2025-01-10T12:00:00.000Z").getTime();
    const today = new Date("2025-01-10T10:00:00.000Z").getTime();

    const nftPets = {
      1: {
        id: 1,
        name: "Pet #1" as const,
        requests: {
          food: [],
          fedAt: today,
        },
        energy: 0,
        experience: 100,
        pettedAt: now,
        traits: {
          type: "Dragon" as const,
          fur: "Green" as const,
          accessory: "Crown" as const,
          bib: "Gold Necklace" as const,
          aura: "Common Aura" as const,
        },
      },
      2: {
        id: 2,
        name: "Pet #2" as const,
        requests: {
          food: [],
          fedAt: today,
        },
        energy: 0,
        experience: 100,
        pettedAt: now,
        traits: {
          type: "Dragon" as const,
          fur: "Blue" as const,
          accessory: "Flower Crown" as const,
          bib: "Collar" as const,
          aura: "No Aura" as const,
        },
      },
    };

    expect(
      isPetOfTypeFed({
        nftPets,
        petType: "Dragon",
        id: 1,
        now,
      }),
    ).toBe(true);
  });

  it("returns false if no pet of the type was fed today", () => {
    const now = new Date("2025-01-10T12:00:00.000Z").getTime();
    const yesterday = new Date("2025-01-09T12:00:00.000Z").getTime();

    const nftPets = {
      1: {
        id: 1,
        name: "Pet #1" as const,
        requests: {
          food: [],
          fedAt: yesterday,
        },
        energy: 0,
        experience: 100,
        pettedAt: now,
        traits: {
          type: "Dragon" as const,
          fur: "Green" as const,
          accessory: "Crown" as const,
          bib: "Gold Necklace" as const,
          aura: "Common Aura" as const,
        },
      },
    };

    expect(
      isPetOfTypeFed({
        nftPets,
        petType: "Dragon",
        id: 1,
        now,
      }),
    ).toBe(false);
  });

  it("returns false if the only pet of that type is the excluded one", () => {
    const now = new Date("2025-01-10T12:00:00.000Z").getTime();
    const today = new Date("2025-01-10T10:00:00.000Z").getTime();

    const nftPets = {
      1: {
        id: 1,
        name: "Pet #1" as const,
        requests: {
          food: [],
          fedAt: today,
        },
        energy: 0,
        experience: 100,
        pettedAt: now,
        traits: {
          type: "Dragon" as const,
          fur: "Green" as const,
          accessory: "Crown" as const,
          bib: "Gold Necklace" as const,
          aura: "Common Aura" as const,
        },
      },
    };

    expect(
      isPetOfTypeFed({
        nftPets,
        petType: "Dragon",
        id: 1,
        now,
      }),
    ).toBe(false);
  });

  it("returns false if no pets of that type exist", () => {
    const now = new Date("2025-01-10T12:00:00.000Z").getTime();
    const today = new Date("2025-01-10T10:00:00.000Z").getTime();

    const nftPets = {
      1: {
        id: 1,
        name: "Pet #1" as const,
        requests: {
          food: [],
          fedAt: today,
        },
        energy: 0,
        experience: 100,
        pettedAt: now,
        traits: {
          type: "Griffin" as const,
          fur: "Green" as const,
          accessory: "Crown" as const,
          bib: "Gold Necklace" as const,
          aura: "Common Aura" as const,
        },
      },
    };

    expect(
      isPetOfTypeFed({
        nftPets,
        petType: "Dragon",
        id: 1,
        now,
      }),
    ).toBe(false);
  });

  it("returns false if pets don't have traits", () => {
    const now = new Date("2025-01-10T12:00:00.000Z").getTime();
    const today = new Date("2025-01-10T10:00:00.000Z").getTime();

    const nftPets = {
      1: {
        id: 1,
        name: "Pet #1" as const,
        requests: {
          food: [],
          fedAt: today,
        },
        energy: 0,
        experience: 100,
        pettedAt: now,
      },
    };

    expect(
      isPetOfTypeFed({
        nftPets,
        petType: "Dragon",
        id: 1,
        now,
      }),
    ).toBe(false);
  });

  it("handles multiple pets of different types correctly", () => {
    const now = new Date("2025-01-10T12:00:00.000Z").getTime();
    const today = new Date("2025-01-10T10:00:00.000Z").getTime();
    const yesterday = new Date("2025-01-09T10:00:00.000Z").getTime();

    const nftPets = {
      1: {
        id: 1,
        name: "Pet #1" as const,
        requests: {
          food: [],
          fedAt: today,
        },
        energy: 0,
        experience: 100,
        pettedAt: now,
        traits: {
          type: "Dragon" as const,
          fur: "Green" as const,
          accessory: "Crown" as const,
          bib: "Gold Necklace" as const,
          aura: "Common Aura" as const,
        },
      },
      2: {
        id: 2,
        name: "Pet #2" as const,
        requests: {
          food: [],
          fedAt: yesterday,
        },
        energy: 0,
        experience: 100,
        pettedAt: now,
        traits: {
          type: "Griffin" as const,
          fur: "Blue" as const,
          accessory: "Flower Crown" as const,
          bib: "Collar" as const,
          aura: "No Aura" as const,
        },
      },
      3: {
        id: 3,
        name: "Pet #3" as const,
        requests: {
          food: [],
          fedAt: today,
        },
        energy: 0,
        experience: 100,
        pettedAt: now,
        traits: {
          type: "Griffin" as const,
          fur: "Purple" as const,
          accessory: "Seedling" as const,
          bib: "Baby Bib" as const,
          aura: "No Aura" as const,
        },
      },
    };

    expect(
      isPetOfTypeFed({
        nftPets,
        petType: "Dragon",
        id: 1,
        now,
      }),
    ).toBe(false);

    expect(
      isPetOfTypeFed({
        nftPets,
        petType: "Griffin",
        id: 2,
        now,
      }),
    ).toBe(true);
  });

  it("handles date boundaries correctly (midnight)", () => {
    const now = new Date("2025-01-10T00:00:00.000Z").getTime();
    const today = new Date("2025-01-10T00:00:00.000Z").getTime();
    const yesterday = new Date("2025-01-09T23:59:59.000Z").getTime();

    const nftPets = {
      1: {
        id: 1,
        name: "Pet #1" as const,
        requests: {
          food: [],
          fedAt: today,
        },
        energy: 0,
        experience: 100,
        pettedAt: now,
        traits: {
          type: "Dragon" as const,
          fur: "Green" as const,
          accessory: "Crown" as const,
          bib: "Gold Necklace" as const,
          aura: "Common Aura" as const,
        },
      },
      2: {
        id: 2,
        name: "Pet #2" as const,
        requests: {
          food: [],
          fedAt: yesterday,
        },
        energy: 0,
        experience: 100,
        pettedAt: now,
        traits: {
          type: "Dragon" as const,
          fur: "Blue" as const,
          accessory: "Flower Crown" as const,
          bib: "Collar" as const,
          aura: "No Aura" as const,
        },
      },
    };

    expect(
      isPetOfTypeFed({
        nftPets,
        petType: "Dragon",
        id: 1,
        now,
      }),
    ).toBe(false);

    expect(
      isPetOfTypeFed({
        nftPets,
        petType: "Dragon",
        id: 2,
        now,
      }),
    ).toBe(true);
  });

  it("uses current time when now is not provided", () => {
    const now = Date.now();
    const today = new Date(now).toISOString().split("T")[0];
    const todayTimestamp = new Date(today).getTime();

    const nftPets = {
      1: {
        id: 1,
        name: "Pet #1" as const,
        requests: {
          food: [],
          fedAt: todayTimestamp,
        },
        energy: 0,
        experience: 100,
        pettedAt: now,
        traits: {
          type: "Dragon" as const,
          fur: "Green" as const,
          accessory: "Crown" as const,
          bib: "Gold Necklace" as const,
          aura: "Common Aura" as const,
        },
      },
    };

    expect(
      isPetOfTypeFed({
        nftPets,
        petType: "Dragon",
        id: 1,
        now,
      }),
    ).toBe(false);
  });

  it("returns true if multiple pets of the type were fed today", () => {
    const now = new Date("2025-01-10T12:00:00.000Z").getTime();
    const today1 = new Date("2025-01-10T10:00:00.000Z").getTime();
    const today2 = new Date("2025-01-10T14:00:00.000Z").getTime();

    const nftPets = {
      1: {
        id: 1,
        name: "Pet #1" as const,
        requests: {
          food: [],
          fedAt: today1,
        },
        energy: 0,
        experience: 100,
        pettedAt: now,
        traits: {
          type: "Dragon" as const,
          fur: "Green" as const,
          accessory: "Crown" as const,
          bib: "Gold Necklace" as const,
          aura: "Common Aura" as const,
        },
      },
      2: {
        id: 2,
        name: "Pet #2" as const,
        requests: {
          food: [],
          fedAt: today2,
        },
        energy: 0,
        experience: 100,
        pettedAt: now,
        traits: {
          type: "Dragon" as const,
          fur: "Blue" as const,
          accessory: "Flower Crown" as const,
          bib: "Collar" as const,
          aura: "No Aura" as const,
        },
      },
    };

    expect(
      isPetOfTypeFed({
        nftPets,
        petType: "Dragon",
        id: 1,
        now,
      }),
    ).toBe(true);
  });

  it("handles empty nftPets object", () => {
    const now = new Date("2025-01-10T12:00:00.000Z").getTime();

    expect(
      isPetOfTypeFed({
        nftPets: {},
        petType: "Dragon",
        id: 1,
        now,
      }),
    ).toBe(false);
  });

  it("returns false if pet has negative experience", () => {
    const now = new Date("2025-01-10T12:00:00.000Z").getTime();
    const today = new Date("2025-01-10T10:00:00.000Z").getTime();

    const nftPets = {
      1: {
        id: 1,
        name: "Pet #1" as const,
        requests: {
          food: [],
          fedAt: today,
        },
        energy: 0,
        experience: -10,
        pettedAt: now,
        traits: {
          type: "Dragon" as const,
          fur: "Green" as const,
          accessory: "Crown" as const,
          bib: "Gold Necklace" as const,
          aura: "Common Aura" as const,
        },
      },
      2: {
        id: 2,
        name: "Pet #2" as const,
        requests: {
          food: [],
          fedAt: today,
        },
        energy: 0,
        experience: -10,
        pettedAt: now,
        traits: {
          type: "Dragon" as const,
          fur: "Blue" as const,
          accessory: "Flower Crown" as const,
          bib: "Collar" as const,
          aura: "No Aura" as const,
        },
      },
    };

    expect(
      isPetOfTypeFed({
        nftPets,
        petType: "Dragon",
        id: 1,
        now,
      }),
    ).toBe(false);
  });
});
