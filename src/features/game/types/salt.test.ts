import type { GameState } from "features/game/types/game";
import {
  BASE_SALT_YIELD,
  MAX_STORED_SALT_CHARGES_PER_NODE,
  SALT_CHARGE_GENERATION_TIME,
  SALT_NODE_COORDINATES,
  getSaltChargeGenerationTime,
  getSaltNodeCoordinates,
  getSaltYieldPerRake,
  getSeaBlessedChance,
  materializeSaltRegen,
  populateSaltFarm,
  rechargeAllSaltNodes,
  syncSaltNode,
  type Salt,
  type SaltNode,
} from "./salt";
import { INITIAL_FARM } from "../lib/constants";
import { prngChance } from "lib/prng";
import { KNOWN_IDS } from "features/game/types";
import { getWharfCoordinates } from "../expansion/lib/constants";

describe("salt nextChargeAt regen", () => {
  const t0 = 1_000_000_000_000;

  function nodeFrom(salt: Salt): SaltNode {
    return {
      createdAt: t0,
      salt,
    };
  }

  it("advances multiple charges when far offline", () => {
    const salt: Salt = {
      storedCharges: 0,
      nextChargeAt: t0 + SALT_CHARGE_GENERATION_TIME,
    };
    const later = t0 + SALT_CHARGE_GENERATION_TIME * 3 + 1;
    const out = materializeSaltRegen(salt, later, undefined);
    expect(out.storedCharges).toBe(3);
    expect(out.nextChargeAt).toBe(t0 + SALT_CHARGE_GENERATION_TIME * 4);
  });

  it("schedules next boundary when hitting stored cap", () => {
    const salt: Salt = {
      storedCharges: MAX_STORED_SALT_CHARGES_PER_NODE - 1,
      nextChargeAt: t0,
    };
    const out = materializeSaltRegen(salt, t0 + 1, undefined);
    expect(out.storedCharges).toBe(MAX_STORED_SALT_CHARGES_PER_NODE);
    expect(out.nextChargeAt).toBe(t0 + SALT_CHARGE_GENERATION_TIME);
  });

  it("clamps stored charges when persisted value is above max", () => {
    const salt: Salt = {
      storedCharges: MAX_STORED_SALT_CHARGES_PER_NODE + 10,
      nextChargeAt: t0 + SALT_CHARGE_GENERATION_TIME,
    };
    const out = materializeSaltRegen(salt, t0, undefined);
    expect(out.storedCharges).toBe(MAX_STORED_SALT_CHARGES_PER_NODE);
  });

  it("does not shorten an in-flight wait when a shorter boost interval is used only for later segments", () => {
    const half = SALT_CHARGE_GENERATION_TIME / 2;
    const salt: Salt = {
      storedCharges: 0,
      nextChargeAt: t0 + SALT_CHARGE_GENERATION_TIME,
    };
    const synced = syncSaltNode(nodeFrom(salt), t0 + 1_000, {
      chargeIntervalMs: half,
    });
    expect(synced.salt.nextChargeAt).toBe(t0 + SALT_CHARGE_GENERATION_TIME);
    const afterGrant = syncSaltNode(
      synced,
      t0 + SALT_CHARGE_GENERATION_TIME + 1,
      {
        chargeIntervalMs: half,
      },
    );
    expect(afterGrant.salt.storedCharges).toBe(1);
    expect(afterGrant.salt.nextChargeAt).toBe(
      t0 + SALT_CHARGE_GENERATION_TIME + half,
    );
  });
});

describe("populateSaltFarm", () => {
  const t0 = 1_000_000_000_000;

  function makeGame(overrides: Partial<GameState> = {}): GameState {
    return {
      ...INITIAL_FARM,
      saltFarm: {
        level: 1,
        nodes: {
          "0": {
            createdAt: t0,
            salt: {
              storedCharges: 0,
              nextChargeAt: t0 + SALT_CHARGE_GENERATION_TIME,
            },
          },
        },
      },
      ...overrides,
    };
  }

  it("returns early when charge generation time has not changed", () => {
    const gameBefore = makeGame();
    const game: GameState = { ...gameBefore };
    const now = t0 + SALT_CHARGE_GENERATION_TIME * 2;

    populateSaltFarm({ gameBefore, gameAfter: game, now });

    expect(game.saltFarm.nodes["0"].salt.storedCharges).toBe(0);
    expect(game.saltFarm.nodes["0"].salt.nextChargeAt).toBe(
      t0 + SALT_CHARGE_GENERATION_TIME,
    );
  });

  it("returns early when charge generation time has not changed with active boost", () => {
    const gameBefore = makeGame({
      bumpkin: { ...INITIAL_FARM.bumpkin, skills: { "Salty Seas": 1 } },
    });
    const game: GameState = { ...gameBefore };
    const now = t0 + SALT_CHARGE_GENERATION_TIME * 2;

    populateSaltFarm({ gameBefore, gameAfter: game, now });

    expect(game.saltFarm.nodes["0"].salt.storedCharges).toBe(0);
    expect(game.saltFarm.nodes["0"].salt.nextChargeAt).toBe(
      t0 + SALT_CHARGE_GENERATION_TIME,
    );
  });

  it("crystallizes at old rate when boost is added", () => {
    const gameBefore = makeGame();
    const game: GameState = { ...gameBefore };
    game.bumpkin = { ...game.bumpkin, skills: { "Salty Seas": 1 } };

    const boostedInterval = SALT_CHARGE_GENERATION_TIME * 0.9;
    const now = t0 + SALT_CHARGE_GENERATION_TIME + boostedInterval + 1;

    populateSaltFarm({ gameBefore, gameAfter: game, now });

    // Should crystallize 1 charge at the OLD (unboosted) rate, not the new boosted rate.
    // nextChargeAt starts at t0 + SALT_CHARGE_GENERATION_TIME (one old interval).
    // At now, one old interval has elapsed -> storedCharges = 1.
    // If the new boosted rate were applied retroactively, a second charge
    // would have been granted since boostedInterval < SALT_CHARGE_GENERATION_TIME.
    expect(game.saltFarm.nodes["0"].salt.storedCharges).toBe(1);
    expect(game.saltFarm.nodes["0"].salt.nextChargeAt).toBe(
      t0 + SALT_CHARGE_GENERATION_TIME * 2,
    );
  });

  it("crystallizes at old rate when sculpture upgrades", () => {
    const gameBefore = makeGame();
    const game: GameState = { ...gameBefore };
    game.sculptures = { ...game.sculptures, "Salt Sculpture": { level: 1 } };

    const boostedInterval = SALT_CHARGE_GENERATION_TIME * 0.95;
    const now = t0 + SALT_CHARGE_GENERATION_TIME + boostedInterval + 1;

    populateSaltFarm({ gameBefore, gameAfter: game, now });

    expect(game.saltFarm.nodes["0"].salt.storedCharges).toBe(1);
    expect(game.saltFarm.nodes["0"].salt.nextChargeAt).toBe(
      t0 + SALT_CHARGE_GENERATION_TIME * 2,
    );
  });

  it("crystallizes boosted progress when boost is removed, then follows slower cadence", () => {
    const boostedInterval = SALT_CHARGE_GENERATION_TIME * 0.9;
    const gameBefore = makeGame({
      bumpkin: { ...INITIAL_FARM.bumpkin, skills: { "Salty Seas": 1 } },
      saltFarm: {
        level: 1,
        nodes: {
          "0": {
            createdAt: t0,
            salt: {
              storedCharges: 0,
              nextChargeAt: t0 + boostedInterval,
            },
          },
        },
      },
    });
    const game: GameState = {
      ...gameBefore,
      bumpkin: { ...gameBefore.bumpkin, skills: {} },
    };

    const now = t0 + boostedInterval + boostedInterval / 2;

    populateSaltFarm({ gameBefore, gameAfter: game, now });

    expect(game.saltFarm.nodes["0"].salt.storedCharges).toBe(1);
    expect(game.saltFarm.nodes["0"].salt.nextChargeAt).toBe(
      t0 + boostedInterval * 2,
    );

    const { chargeGenerationTimeMs: slowerInterval } =
      getSaltChargeGenerationTime({
        gameState: game,
      });
    const afterCadence = syncSaltNode(
      game.saltFarm.nodes["0"],
      game.saltFarm.nodes["0"].salt.nextChargeAt + slowerInterval - 1,
      { chargeIntervalMs: slowerInterval },
    );

    expect(afterCadence.salt.storedCharges).toBe(2);
    expect(afterCadence.salt.nextChargeAt).toBe(
      t0 + boostedInterval * 2 + slowerInterval,
    );
  });

  it("uses gameAfter sculpture level for max charge cap while charge interval follows current sculpture level", () => {
    const gameBefore = makeGame({
      saltFarm: {
        level: 4,
        nodes: {
          "0": {
            createdAt: t0,
            salt: {
              storedCharges: 0,
              nextChargeAt: t0,
            },
          },
        },
      },
    });

    const game: GameState = { ...gameBefore };
    game.sculptures = { ...game.sculptures, "Salt Sculpture": { level: 3 } };

    const { chargeGenerationTimeMs: intervalMs } = getSaltChargeGenerationTime({
      gameState: gameBefore,
    });
    const now = t0 + intervalMs * 5;

    populateSaltFarm({
      gameBefore,
      gameAfter: game,
      now,
    });

    expect(game.saltFarm.nodes["0"].salt.storedCharges).toBe(4);
  });

  it("runs sync when sculpture upgrade increases max charges without changing charge interval", () => {
    const gameBefore = makeGame({
      sculptures: { "Salt Sculpture": { level: 2 } },
      saltFarm: {
        level: 1,
        nodes: {
          "0": {
            createdAt: t0,
            salt: {
              storedCharges: 3,
              nextChargeAt: t0,
            },
          },
        },
      },
    });
    const gameAfter: GameState = {
      ...gameBefore,
      sculptures: { "Salt Sculpture": { level: 3 } },
    };

    expect(
      getSaltChargeGenerationTime({ gameState: gameBefore })
        .chargeGenerationTimeMs,
    ).toBe(
      getSaltChargeGenerationTime({ gameState: gameAfter })
        .chargeGenerationTimeMs,
    );

    const { chargeGenerationTimeMs: intervalMs } = getSaltChargeGenerationTime({
      gameState: gameBefore,
    });
    const now = t0 + intervalMs * 5;

    populateSaltFarm({ gameBefore, gameAfter, now });

    expect(gameAfter.saltFarm.nodes["0"].salt.storedCharges).toBe(4);
  });
});

describe("rechargeAllSaltNodes", () => {
  const t0 = 1_000_000_000_000;

  function makeGameWithNodes(
    nodeIds: string[],
    overrides: Partial<GameState> = {},
  ): GameState {
    const nodes: Record<string, SaltNode> = {};
    for (const id of nodeIds) {
      nodes[id] = {
        createdAt: t0,
        salt: {
          storedCharges: 0,
          nextChargeAt: t0 + SALT_CHARGE_GENERATION_TIME,
        },
      };
    }
    return {
      ...INITIAL_FARM,
      saltFarm: { level: 1, nodes },
      ...overrides,
    };
  }

  it("fills every node to the base cap when no sculpture is placed", () => {
    const game = makeGameWithNodes(["0", "1", "2"]);
    const now = t0 + 1234;

    const result = rechargeAllSaltNodes(game, now);

    for (const id of ["0", "1", "2"]) {
      expect(result.saltFarm.nodes[id].salt.storedCharges).toBe(
        MAX_STORED_SALT_CHARGES_PER_NODE,
      );
      expect(result.saltFarm.nodes[id].salt.nextChargeAt).toBe(
        now + SALT_CHARGE_GENERATION_TIME,
      );
    }
  });

  it("raises the cap to 4 when Salt Sculpture is level 3", () => {
    const game = makeGameWithNodes(["0"], {
      sculptures: { "Salt Sculpture": { level: 3 } },
    });
    const now = t0 + 1234;

    const result = rechargeAllSaltNodes(game, now);

    expect(result.saltFarm.nodes["0"].salt.storedCharges).toBe(4);
  });

  it("raises the cap to 5 when Salt Sculpture is level 6", () => {
    const game = makeGameWithNodes(["0"], {
      sculptures: { "Salt Sculpture": { level: 6 } },
    });
    const now = t0 + 1234;

    const result = rechargeAllSaltNodes(game, now);

    expect(result.saltFarm.nodes["0"].salt.storedCharges).toBe(5);
  });

  it("uses the boosted interval for nextChargeAt when Salty Seas is active", () => {
    const game = makeGameWithNodes(["0"], {
      bumpkin: { ...INITIAL_FARM.bumpkin, skills: { "Salty Seas": 1 } },
    });
    const now = t0 + 1234;

    const result = rechargeAllSaltNodes(game, now);

    expect(result.saltFarm.nodes["0"].salt.nextChargeAt).toBe(
      now + SALT_CHARGE_GENERATION_TIME * 0.9,
    );
    expect(result.saltFarm.nodes["0"].salt.storedCharges).toBe(
      MAX_STORED_SALT_CHARGES_PER_NODE,
    );
  });

  it("clamps existing storedCharges that exceed the sculpture-derived cap", () => {
    const game = makeGameWithNodes(["0"]);
    game.saltFarm.nodes["0"].salt.storedCharges =
      MAX_STORED_SALT_CHARGES_PER_NODE + 10;
    const now = t0 + 1234;

    const result = rechargeAllSaltNodes(game, now);

    expect(result.saltFarm.nodes["0"].salt.storedCharges).toBe(
      MAX_STORED_SALT_CHARGES_PER_NODE,
    );
  });

  it("is a no-op on an empty salt farm", () => {
    const game = makeGameWithNodes([]);
    const now = t0 + 1234;

    const result = rechargeAllSaltNodes(game, now);

    expect(Object.keys(result.saltFarm.nodes)).toHaveLength(0);
  });
});

describe("getSaltNodeCoordinates", () => {
  const ids = Object.keys(SALT_NODE_COORDINATES);

  // Each node keeps a constant offset from the dock across every land size, so
  // the salt cluster moves with the wharf instead of drifting.
  it("keeps a constant offset from the dock at every land size", () => {
    const offsetFromDock = (count: number, id: string) => {
      const c = getSaltNodeCoordinates(count, id);
      const dock = getWharfCoordinates(count);
      return { dx: c.x - dock.x, dy: c.y - dock.y };
    };

    for (const id of ids) {
      const ref = offsetFromDock(3, id);
      for (const count of [7, 14, 21, 42]) {
        expect(offsetFromDock(count, id)).toEqual(ref);
      }
    }
  });

  // Each node keeps the SALT_NODE_COORDINATES cluster shape (a fixed offset from
  // node "0") at every land size.
  it("preserves the cluster shape across land sizes", () => {
    const shapeAt = (count: number) =>
      ids.map((id) => {
        const a = getSaltNodeCoordinates(count, id);
        const b = getSaltNodeCoordinates(count, ids[0]);
        return { dx: a.x - b.x, dy: a.y - b.y };
      });

    expect(shapeAt(3)).toEqual(shapeAt(42));
  });
});

describe("Salty Seas rank", () => {
  const gameWithRank = (rank: number): GameState =>
    ({
      ...INITIAL_FARM,
      bumpkin: { ...INITIAL_FARM.bumpkin, skills: { "Salty Seas": rank } },
    }) as GameState;

  it("shortens the charge interval by rank", () => {
    expect(
      getSaltChargeGenerationTime({ gameState: gameWithRank(1) })
        .chargeGenerationTimeMs,
    ).toBeCloseTo(SALT_CHARGE_GENERATION_TIME * 0.9);
    expect(
      getSaltChargeGenerationTime({ gameState: gameWithRank(2) })
        .chargeGenerationTimeMs,
    ).toBeCloseTo(SALT_CHARGE_GENERATION_TIME * 0.85);
    expect(
      getSaltChargeGenerationTime({ gameState: gameWithRank(3) })
        .chargeGenerationTimeMs,
    ).toBeCloseTo(SALT_CHARGE_GENERATION_TIME * 0.8);
  });

  it("reports the rank's multiplier in boostsUsed", () => {
    expect(
      getSaltChargeGenerationTime({ gameState: gameWithRank(3) }).boostsUsed,
    ).toContainEqual({ name: "Salty Seas", value: "x0.8" });
  });
});

describe("Wide Rakes rank", () => {
  const gameWithRank = (rank: number): GameState =>
    ({
      ...INITIAL_FARM,
      bumpkin: { ...INITIAL_FARM.bumpkin, skills: { "Wide Rakes": rank } },
    }) as GameState;
  const now = 1_000_000_000_000;

  it("adds salt per rake by rank", () => {
    expect(getSaltYieldPerRake(gameWithRank(1), now).saltYield).toBe(
      BASE_SALT_YIELD + 2,
    );
    expect(getSaltYieldPerRake(gameWithRank(2), now).saltYield).toBe(
      BASE_SALT_YIELD + 3,
    );
    expect(getSaltYieldPerRake(gameWithRank(3), now).saltYield).toBe(
      BASE_SALT_YIELD + 4,
    );
  });

  it("reports the rank's bonus in boostsUsed", () => {
    expect(getSaltYieldPerRake(gameWithRank(3), now).boostsUsed).toContainEqual(
      {
        name: "Wide Rakes",
        value: "+4",
      },
    );
  });
});

describe("Sea Blessed rank", () => {
  const gameWithRank = (rank: number): GameState =>
    ({
      ...INITIAL_FARM,
      bumpkin: { ...INITIAL_FARM.bumpkin, skills: { "Sea Blessed": rank } },
    }) as GameState;

  it("returns 0 without the skill", () => {
    expect(getSeaBlessedChance(INITIAL_FARM)).toBe(0);
  });

  it("scales the chance with rank", () => {
    expect(getSeaBlessedChance(gameWithRank(1))).toBe(5);
    expect(getSeaBlessedChance(gameWithRank(2))).toBe(7.5);
    expect(getSeaBlessedChance(gameWithRank(3))).toBe(10);
  });

  // Guards rank 2's fractional half-percent end to end, at the generator rather
  // than at the call site. farmId 1 / counter 2 is a witness: its prng value
  // lands in [7, 7.5), so it misses at rank 1's 5% and would also miss if 7.5
  // were ever truncated to 7 — it only fires if the full 7.5 reaches prngChance.
  it("rolls rank 2 at the full 7.5%, not a truncated 7%", () => {
    const roll = (chance: number) =>
      prngChance({
        farmId: 1,
        itemId: KNOWN_IDS["Salt"],
        counter: 2,
        chance,
        criticalHitName: "Sea Blessed",
      });

    expect(roll(getSeaBlessedChance(gameWithRank(1)))).toBe(false);
    expect(roll(getSeaBlessedChance(gameWithRank(2)))).toBe(true);
    // The truncation this guards against:
    expect(roll(7)).toBe(false);
  });

  it("rolls a higher rank whenever a lower rank hits", () => {
    const hits = (rank: number) => {
      let count = 0;
      for (let counter = 0; counter < 2_000; counter++) {
        if (
          prngChance({
            farmId: 1,
            itemId: KNOWN_IDS["Salt"],
            counter,
            chance: getSeaBlessedChance(gameWithRank(rank)),
            criticalHitName: "Sea Blessed",
          })
        ) {
          count++;
        }
      }
      return count;
    };

    expect(hits(1)).toBeLessThan(hits(2));
    expect(hits(2)).toBeLessThan(hits(3));
  });
});
