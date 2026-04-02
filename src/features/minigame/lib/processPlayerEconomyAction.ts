import { resolveProduceDurationMs } from "./resolveProduceDuration";
import {
  BurnRule,
  CollectRule,
  DailyActionUsesBucket,
  DailyMintBucket,
  PlayerEconomyActionDefinition,
  PlayerEconomyConfig,
  PlayerEconomyProcessInput,
  PlayerEconomyProcessResult,
  PlayerEconomyRuntimeState,
  MintRule,
  GeneratorRecipeRule,
  RequireRule,
} from "./types";

export function utcCalendarDay(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

export function rolloverDailyMintedIfNeeded(
  bucket: DailyMintBucket,
  now: number,
): void {
  const today = utcCalendarDay(now);
  if (bucket.utcDay !== today) {
    bucket.utcDay = today;
    bucket.minted = {};
  }
}

function dailyMintSubKey(actionId: string, token: string): string {
  return `${actionId}|${token}`;
}

function isRangedMint(rule: MintRule): rule is {
  min: number;
  max: number;
  dailyCap: number;
} {
  return "min" in rule && "max" in rule && "dailyCap" in rule;
}

function isFixedMintWithDailyCap(
  rule: MintRule,
): rule is { amount: number; dailyCap: number } {
  return "amount" in rule && "dailyCap" in rule && !("min" in rule);
}

export function clonePlayerEconomyRuntimeState(
  state: PlayerEconomyRuntimeState,
): PlayerEconomyRuntimeState {
  const uses = state.dailyActionUses;
  const purchases = state.purchaseCounts;
  return {
    balances: { ...state.balances },
    generating: Object.fromEntries(
      Object.entries(state.generating).map(([id, entry]) => [id, { ...entry }]),
    ),
    dailyMinted: {
      utcDay: state.dailyMinted.utcDay,
      minted: { ...state.dailyMinted.minted },
    },
    activity: state.activity,
    dailyActivity: {
      date: state.dailyActivity.date,
      count: state.dailyActivity.count,
    },
    ...(uses
      ? {
          dailyActionUses: {
            utcDay: uses.utcDay,
            byAction: { ...uses.byAction },
          },
        }
      : {}),
    ...(purchases && Object.keys(purchases).length > 0
      ? { purchaseCounts: { ...purchases } }
      : {}),
  };
}

function recordSuccessfulMinigameAction(
  state: PlayerEconomyRuntimeState,
  now: number,
): void {
  const today = utcCalendarDay(now);
  state.activity = (state.activity ?? 0) + 1;
  if (state.dailyActivity.date !== today) {
    state.dailyActivity = { date: today, count: 1 };
  } else {
    state.dailyActivity = {
      date: today,
      count: state.dailyActivity.count + 1,
    };
  }
}

function getBalance(balances: Record<string, number>, token: string): number {
  return balances[token] ?? 0;
}

function applyRequire(
  balances: Record<string, number>,
  require: Record<string, RequireRule> | undefined,
): string | undefined {
  if (!require) return undefined;
  for (const [token, rule] of Object.entries(require)) {
    if (getBalance(balances, token) < rule.amount) {
      return `Requires at least ${rule.amount} ${token}`;
    }
  }
  return undefined;
}

function applyRequireBelow(
  balances: Record<string, number>,
  requireBelow: Record<string, number> | undefined,
): string | undefined {
  if (!requireBelow) return undefined;
  for (const [token, maxExclusive] of Object.entries(requireBelow)) {
    if (getBalance(balances, token) >= maxExclusive) {
      return `${token} is at or above the allowed maximum`;
    }
  }
  return undefined;
}

function applyRequireAbsent(
  balances: Record<string, number>,
  absent: string[] | undefined,
): string | undefined {
  if (!absent?.length) return undefined;
  for (const token of absent) {
    if (getBalance(balances, token) > 0) {
      return `${token} already acquired`;
    }
  }
  return undefined;
}

function isRangedBurn(rule: BurnRule): rule is { min: number; max: number } {
  return "min" in rule && "max" in rule;
}

function applyBurns(
  balances: Record<string, number>,
  burn: Record<string, BurnRule> | undefined,
  amounts: Record<string, number> | undefined,
): string | undefined {
  if (!burn) return undefined;
  for (const [token, rule] of Object.entries(burn)) {
    const have = getBalance(balances, token);
    let sub: number;
    if (isRangedBurn(rule)) {
      const passed = amounts?.[token];
      if (passed === undefined || !Number.isInteger(passed)) {
        return `Missing or invalid burn amount for ${token}`;
      }
      if (passed < rule.min || passed > rule.max) {
        return `Burn for ${token} must be between ${rule.min} and ${rule.max}`;
      }
      sub = passed;
    } else {
      sub = rule.amount;
    }
    if (have < sub) {
      return `Insufficient ${token}`;
    }
  }
  for (const [token, rule] of Object.entries(burn)) {
    const sub = isRangedBurn(rule) ? (amounts?.[token] as number) : rule.amount;
    balances[token] = getBalance(balances, token) - sub;
    if (balances[token] === 0) {
      delete balances[token];
    }
  }
  return undefined;
}

function newProducingJobId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function applyProduce(
  balances: Record<string, number>,
  generating: PlayerEconomyRuntimeState["generating"],
  produce: Record<string, GeneratorRecipeRule> | undefined,
  collect: Record<string, CollectRule> | undefined,
  now: number,
): { error?: string; generatorJobId?: string } {
  if (!produce) return {};
  for (const [outputToken, rule] of Object.entries(produce)) {
    const activeForOutput = Object.values(generating).filter(
      (p) => p.outputToken === outputToken,
    ).length;
    if (rule.limit !== undefined && activeForOutput >= rule.limit) {
      return { error: `Production limit reached for ${outputToken}` };
    }
    if (rule.requires !== undefined) {
      const activeForLane = Object.values(generating).filter(
        (p) => p.outputToken === outputToken && p.requires === rule.requires,
      ).length;
      const cap = getBalance(balances, rule.requires);
      if (activeForLane >= cap) {
        return {
          error: `Not enough ${rule.requires} capacity for new ${outputToken} production`,
        };
      }
    }
    const id = newProducingJobId();
    const durationMs = resolveProduceDurationMs(outputToken, rule, collect);
    generating[id] = {
      outputToken,
      startedAt: now,
      completesAt: now + durationMs,
      ...(rule.requires !== undefined ? { requires: rule.requires } : {}),
    };
    return { generatorJobId: id };
  }
  return {};
}

function applyMint(
  balances: Record<string, number>,
  bucket: DailyMintBucket,
  mint: Record<string, MintRule> | undefined,
  actionId: string,
  amounts: Record<string, number> | undefined,
): string | undefined {
  if (!mint) return undefined;
  for (const [token, rule] of Object.entries(mint)) {
    let add: number;
    if (isRangedMint(rule)) {
      const passed = amounts?.[token];
      if (passed === undefined || !Number.isInteger(passed)) {
        return `Missing or invalid mint amount for ${token}`;
      }
      if (passed < rule.min || passed > rule.max) {
        return `Amount for ${token} must be between ${rule.min} and ${rule.max}`;
      }
      const key = dailyMintSubKey(actionId, token);
      const used = bucket.minted[key] ?? 0;
      if (used + passed > rule.dailyCap) {
        return `Daily cap exceeded for ${token} on action ${actionId}`;
      }
      bucket.minted[key] = used + passed;
      add = passed;
    } else if (isFixedMintWithDailyCap(rule)) {
      const key = dailyMintSubKey(actionId, token);
      const used = bucket.minted[key] ?? 0;
      if (used + rule.amount > rule.dailyCap) {
        return `Daily cap exceeded for ${token} on action ${actionId}`;
      }
      bucket.minted[key] = used + rule.amount;
      add = rule.amount;
    } else {
      add = rule.amount;
    }
    balances[token] = getBalance(balances, token) + add;
  }
  return undefined;
}

function applyCollect(
  balances: Record<string, number>,
  generating: PlayerEconomyRuntimeState["generating"],
  collect: Record<string, CollectRule> | undefined,
  itemId: string | undefined,
  now: number,
): string | undefined {
  if (!collect) return undefined;
  if (!itemId) {
    return "itemId is required for collect";
  }
  const job = generating[itemId];
  if (!job) {
    return "Unknown production id";
  }
  if (now < job.completesAt) {
    return "Production not complete yet";
  }
  const collectTokens = Object.keys(collect);
  if (!collectTokens.includes(job.outputToken)) {
    return "Production output does not match this action";
  }
  for (const [token, rule] of Object.entries(collect)) {
    if (token !== job.outputToken) {
      continue;
    }
    balances[token] = getBalance(balances, token) + rule.amount;
  }
  delete generating[itemId];
  return undefined;
}

function rolloverDailyActionUsesIfNeeded(
  bucket: PlayerEconomyRuntimeState["dailyActionUses"] | undefined,
  now: number,
): DailyActionUsesBucket {
  const today = utcCalendarDay(now);
  if (!bucket || bucket.utcDay !== today) {
    return { utcDay: today, byAction: {} };
  }
  return { utcDay: bucket.utcDay, byAction: { ...bucket.byAction } };
}

function checkPurchaseLimit(
  def: PlayerEconomyActionDefinition,
  actionId: string,
  purchaseCounts: PlayerEconomyRuntimeState["purchaseCounts"],
  itemId: string | undefined,
): string | undefined {
  if (itemId?.trim()) return undefined;
  const cap = def.purchaseLimit;
  if (cap === undefined || !Number.isFinite(cap) || cap <= 0) return undefined;
  const limit = Math.floor(cap);
  const used = purchaseCounts?.[actionId] ?? 0;
  if (used >= limit) {
    return "Purchase limit reached";
  }
  return undefined;
}

function incrementPurchaseCountIfNeeded(
  state: PlayerEconomyRuntimeState,
  def: PlayerEconomyActionDefinition,
  actionId: string,
  itemId: string | undefined,
): void {
  if (itemId?.trim()) return;
  const cap = def.purchaseLimit;
  if (cap === undefined || !Number.isFinite(cap) || cap <= 0) return;
  const prev = state.purchaseCounts ?? {};
  state.purchaseCounts = {
    ...prev,
    [actionId]: (prev[actionId] ?? 0) + 1,
  };
}

function checkMaxUsesPerDay(
  def: PlayerEconomyActionDefinition,
  actionId: string,
  dailyActionUses: PlayerEconomyRuntimeState["dailyActionUses"],
  now: number,
): string | undefined {
  const cap = def.maxUsesPerDay;
  if (cap === undefined || cap <= 0) return undefined;
  const bucket = rolloverDailyActionUsesIfNeeded(dailyActionUses, now);
  const used = bucket.byAction[actionId] ?? 0;
  if (used >= cap) {
    return "Daily limit reached for this action";
  }
  return undefined;
}

function runPhases(
  def: PlayerEconomyActionDefinition,
  input: PlayerEconomyProcessInput,
  working: PlayerEconomyRuntimeState,
): { error?: string; generatorJobId?: string } {
  const hasProduce = Object.keys(def.produce ?? {}).length > 0;
  const hasCollect = Object.keys(def.collect ?? {}).length > 0;
  const itemId = input.itemId?.trim();

  /** With `itemId`, only the collect phase runs (same action id as start for unified configs). */
  if (itemId) {
    if (!hasCollect) {
      return { error: "itemId is not valid for this action" };
    }
    const errCollect = applyCollect(
      working.balances,
      working.generating,
      def.collect,
      itemId,
      input.now,
    );
    if (errCollect) return { error: errCollect };
    return {};
  }

  if (hasCollect && !hasProduce) {
    return { error: "itemId is required for collect" };
  }

  const errRequire = applyRequire(working.balances, def.require);
  if (errRequire) return { error: errRequire };

  const errBelow = applyRequireBelow(working.balances, def.requireBelow);
  if (errBelow) return { error: errBelow };

  const errAbsent = applyRequireAbsent(working.balances, def.requireAbsent);
  if (errAbsent) return { error: errAbsent };

  const errBurn = applyBurns(working.balances, def.burn, input.amounts);
  if (errBurn) return { error: errBurn };

  const prod = applyProduce(
    working.balances,
    working.generating,
    def.produce,
    def.collect,
    input.now,
  );
  if (prod.error) return { error: prod.error };

  const errMint = applyMint(
    working.balances,
    working.dailyMinted,
    def.mint,
    input.actionId,
    input.amounts,
  );
  if (errMint) return { error: errMint };

  return { generatorJobId: prod.generatorJobId };
}

export function processPlayerEconomyAction(
  config: PlayerEconomyConfig,
  state: PlayerEconomyRuntimeState,
  input: PlayerEconomyProcessInput,
): PlayerEconomyProcessResult {
  const def = config.actions[input.actionId];
  if (!def) {
    return { ok: false, error: `Unknown action ${input.actionId}` };
  }

  const working = clonePlayerEconomyRuntimeState(state);
  rolloverDailyMintedIfNeeded(working.dailyMinted, input.now);

  const errCap = checkMaxUsesPerDay(
    def,
    input.actionId,
    working.dailyActionUses,
    input.now,
  );
  if (errCap) {
    return { ok: false, error: errCap };
  }

  const errPurchaseLimit = checkPurchaseLimit(
    def,
    input.actionId,
    working.purchaseCounts,
    input.itemId,
  );
  if (errPurchaseLimit) {
    return { ok: false, error: errPurchaseLimit };
  }

  const { error, generatorJobId } = runPhases(def, input, working);
  if (error) {
    return { ok: false, error };
  }

  recordSuccessfulMinigameAction(working, input.now);

  if (def.maxUsesPerDay !== undefined && def.maxUsesPerDay > 0) {
    const rolled = rolloverDailyActionUsesIfNeeded(
      working.dailyActionUses,
      input.now,
    );
    const id = input.actionId;
    rolled.byAction[id] = (rolled.byAction[id] ?? 0) + 1;
    working.dailyActionUses = rolled;
  }

  incrementPurchaseCountIfNeeded(working, def, input.actionId, input.itemId);

  return { ok: true, state: working, generatorJobId };
}

export function emptyPlayerEconomyState(
  now: number = Date.now(),
): PlayerEconomyRuntimeState {
  const day = utcCalendarDay(now);
  return {
    balances: {},
    generating: {},
    dailyMinted: { utcDay: day, minted: {} },
    activity: 0,
    dailyActivity: { date: day, count: 0 },
    dailyActionUses: { utcDay: day, byAction: {} },
    purchaseCounts: {},
  };
}
