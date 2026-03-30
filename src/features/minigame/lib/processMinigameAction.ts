import {
  BurnRule,
  CollectRule,
  DailyMintBucket,
  MinigameActionDefinition,
  MinigameConfig,
  MinigameProcessInput,
  MinigameProcessResult,
  MinigameRuntimeState,
  MintRule,
  ProduceRule,
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

export function cloneMinigameRuntimeState(
  state: MinigameRuntimeState,
): MinigameRuntimeState {
  return {
    balances: { ...state.balances },
    producing: Object.fromEntries(
      Object.entries(state.producing).map(([id, entry]) => [
        id,
        { ...entry },
      ]),
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
  };
}

function recordSuccessfulMinigameAction(
  state: MinigameRuntimeState,
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

function applyBurns(
  balances: Record<string, number>,
  burn: Record<string, BurnRule> | undefined,
): string | undefined {
  if (!burn) return undefined;
  for (const [token, rule] of Object.entries(burn)) {
    const have = getBalance(balances, token);
    if (have < rule.amount) {
      return `Insufficient ${token}`;
    }
  }
  for (const [token, rule] of Object.entries(burn)) {
    balances[token] = getBalance(balances, token) - rule.amount;
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
  producing: MinigameRuntimeState["producing"],
  produce: Record<string, ProduceRule> | undefined,
  now: number,
): { error?: string; producingId?: string } {
  if (!produce) return {};
  for (const [outputToken, rule] of Object.entries(produce)) {
    const activeForOutput = Object.values(producing).filter(
      (p) => p.outputToken === outputToken,
    ).length;
    if (rule.limit !== undefined && activeForOutput >= rule.limit) {
      return { error: `Production limit reached for ${outputToken}` };
    }
    if (rule.requires !== undefined) {
      const activeForLane = Object.values(producing).filter(
        (p) =>
          p.outputToken === outputToken && p.requires === rule.requires,
      ).length;
      const cap = getBalance(balances, rule.requires);
      if (activeForLane >= cap) {
        return {
          error: `Not enough ${rule.requires} capacity for new ${outputToken} production`,
        };
      }
    }
    const id = newProducingJobId();
    producing[id] = {
      outputToken,
      startedAt: now,
      completesAt: now + rule.msToComplete,
      ...(rule.requires !== undefined ? { requires: rule.requires } : {}),
    };
    return { producingId: id };
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
  producing: MinigameRuntimeState["producing"],
  collect: Record<string, CollectRule> | undefined,
  itemId: string | undefined,
  now: number,
): string | undefined {
  if (!collect) return undefined;
  if (!itemId) {
    return "itemId is required for collect";
  }
  const job = producing[itemId];
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
  delete producing[itemId];
  return undefined;
}

function runPhases(
  def: MinigameActionDefinition,
  input: MinigameProcessInput,
  working: MinigameRuntimeState,
): { error?: string; producingId?: string } {
  const errRequire = applyRequire(working.balances, def.require);
  if (errRequire) return { error: errRequire };

  const errBelow = applyRequireBelow(working.balances, def.requireBelow);
  if (errBelow) return { error: errBelow };

  const errAbsent = applyRequireAbsent(working.balances, def.requireAbsent);
  if (errAbsent) return { error: errAbsent };

  const errBurn = applyBurns(working.balances, def.burn);
  if (errBurn) return { error: errBurn };

  const prod = applyProduce(
    working.balances,
    working.producing,
    def.produce,
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

  const errCollect = applyCollect(
    working.balances,
    working.producing,
    def.collect,
    input.itemId,
    input.now,
  );
  if (errCollect) return { error: errCollect };

  return { producingId: prod.producingId };
}

export function processMinigameAction(
  config: MinigameConfig,
  state: MinigameRuntimeState,
  input: MinigameProcessInput,
): MinigameProcessResult {
  const def = config.actions[input.actionId];
  if (!def) {
    return { ok: false, error: `Unknown action ${input.actionId}` };
  }

  const working = cloneMinigameRuntimeState(state);
  rolloverDailyMintedIfNeeded(working.dailyMinted, input.now);

  const { error, producingId } = runPhases(def, input, working);
  if (error) {
    return { ok: false, error };
  }

  recordSuccessfulMinigameAction(working, input.now);

  return { ok: true, state: working, producingId };
}

export function emptyMinigameState(now: number = Date.now()): MinigameRuntimeState {
  const day = utcCalendarDay(now);
  return {
    balances: {},
    producing: {},
    dailyMinted: { utcDay: day, minted: {} },
    activity: 0,
    dailyActivity: { date: day, count: 0 },
  };
}
