import type { GameState } from "../../types/game";
import { makeGame } from "../transforms";
import { getLastTemperateSeasonStartedAt } from "../temperateSeason";
import VETERAN from "./veteranFarm.json";
import CHIN from "./chin.json";
import ISPANK from "./ispank.json";

/**
 * Real account exports captured from the network tab, loaded VERBATIM as
 * DevPanel Layout presets — the parity-testing targets, because anything that
 * looks off on them versus the DOM farm is a genuine engine bug.
 *
 *  - veteran: Adam's farm — volcano + Basic Biome, 12 land, level 82
 *  - chin:    0xCh1n1 — swamp + Basic Biome, 42 land, 1.56B XP, 541 placed
 *  - ispank:  iSPANK — swamp, 33 land, 100M XP, 410 placed
 *
 * Each runs through `makeGame` — the client's own API deserializer — so
 * nothing is synthesized. Offline-QoL overrides only, all aimed at the boot
 * interrupts a stale export re-triggers on EVERY load: `tcsAcknowledged`
 * stamped fresh, `season.startedAt` stamped to the current temperate window
 * (else the blocking `seasonChanged` screen), sold trades un-fulfilled and
 * the auction bid dropped (else `marketplaceSale`/`offers`/bid screens).
 */
const stripFulfilled = <T extends { fulfilledAt?: number }>(
  record: Record<string, T> | undefined,
): Record<string, T> | undefined =>
  record &&
  Object.fromEntries(
    Object.entries(record).map(([id, trade]) => {
      const { fulfilledAt: _, ...rest } = trade;
      return [id, rest as T];
    }),
  );

const fromExport = (raw: unknown): GameState => {
  const game = makeGame(raw);
  return {
    ...game,
    tcsAcknowledged: Date.now(),
    season: {
      ...game.season,
      startedAt: getLastTemperateSeasonStartedAt(),
    },
    trades: {
      ...game.trades,
      listings: stripFulfilled(game.trades.listings),
      offers: stripFulfilled(game.trades.offers),
    },
    auctioneer: { ...game.auctioneer, bid: undefined },
  };
};

export const REAL_FARM_LAYOUTS: Record<string, () => GameState> = {
  veteran: () => fromExport(VETERAN),
  chin: () => fromExport(CHIN),
  ispank: () => fromExport(ISPANK),
};

export const isRealFarmLayout = (layout: string | null): layout is string =>
  !!layout && layout in REAL_FARM_LAYOUTS;
