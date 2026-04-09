export type MintRuleFixed = { amount: number };

export type MintRuleFixedDailyCapped = {
  amount: number;
  dailyCap: number;
};

export type MintRuleRanged = {
  min: number;
  max: number;
  dailyCap: number;
};

export type MintRule =
  | MintRuleFixed
  | MintRuleFixedDailyCapped
  | MintRuleRanged;

export type BurnRule = { amount: number } | { min: number; max: number };

export type RequireRule = {
  amount: number;
  /** When set with `collect` (and no `produce`), starts a timed job after other phases. */
  seconds?: number;
};

/** Virtual action id for completing a generator / timed job (POST portal action or game event). */
export const PLAYER_ECONOMY_GENERATOR_COLLECTED_ACTION = "generator.collected";

export type GeneratorRecipeRule = {
  /**
   * Milliseconds until the job completes. Optional when the same action’s `collect[token].seconds`
   * defines duration (editor Generate + linked collect).
   */
  msToComplete?: number;
  /**
   * Max concurrent jobs with this `outputToken` across all lanes. Omit for no global cap.
   */
  limit?: number;
  /**
   * Capacity is per lane: only jobs tagged with this same key count toward the cap
   * (parallel outputs like multiple wormeries each generating Worm).
   */
  requires?: string;
  /**
   * Legacy: id of a separate action whose `collect` completed this job before
   * {@link PLAYER_ECONOMY_GENERATOR_COLLECTED_ACTION}. Prefer jobs with `sourceActionId` on the server.
   */
  collectActionId?: string;
};

export type CollectRule = {
  amount: number;
  /** Seconds until this output can be collected (generator / timed production). */
  seconds?: number;
  /**
   * One collect row: probability (0–100) that `amount` is granted. Omit or 100 = always.
   * Multiple collect rows: relative weight for one weighted pick; one row always grants.
   * Server is authoritative; the client may mock rolls locally.
   */
  chance?: number;
};

export type PlayerEconomyBalanceItem = {
  name: string;
  description: string;
  image?: string;
  id?: number;
  /** Main marketplace currency for this minigame when true. */
  tradeable?: boolean;
  /**
   * When true, this balance item can be selected as the produce rule "requires" token
   * and appears in the dashboard production zone when the player owns it.
   */
  generator?: boolean;
  /**
   * When true and the player has a positive balance, this item’s art appears in the
   * economy dashboard trophy zone (checkered area).
   */
  trophy?: boolean;
  /** Starting balance for new farms (no persisted minigame doc yet). */
  initialBalance?: number;
};

export type PlayerEconomyDescriptions = {
  title?: string;
  subtitle?: string;
  welcome?: string;
  rules?: string;
};

/** Persisted by the minigame editor so Rules tab cards round-trip after save/load. */
export type PlayerEconomyEditorActionType = "shop" | "generator" | "custom";

export type PlayerEconomyActionDefinition = {
  /**
   * Which editor rule card this action came from (`generator` = Generate).
   * Ignored at runtime by the minigame engine.
   */
  type?: PlayerEconomyEditorActionType;
  /**
   * When false, this action is omitted from the derived in-game shop.
   * Default true when omitted (backward compatible).
   */
  showInShop?: boolean;
  /** Max successful invocations per UTC day (advanced / iframe minigames). */
  maxUsesPerDay?: number;
  /**
   * Max lifetime purchases of this action per farm (shop). Non-collect invocations only.
   * Omit or ≤0 for unlimited.
   */
  purchaseLimit?: number;
  require?: Record<string, RequireRule>;
  requireBelow?: Record<string, number>;
  requireAbsent?: string[];
  mint?: Record<string, MintRule>;
  burn?: Record<string, BurnRule>;
  produce?: Record<string, GeneratorRecipeRule>;
  collect?: Record<string, CollectRule>;
};

export type PlayerEconomyConfig = {
  actions: Record<string, PlayerEconomyActionDefinition>;
  items?: Record<string, PlayerEconomyBalanceItem>;
  descriptions?: PlayerEconomyDescriptions;
  /** Optional themed shell (e.g. bookmatched backdrop). */
  visualTheme?: string;
  /** Canonical iframe origin from API; overridden by `VITE_PORTAL_GAME_URL` when set. */
  playUrl?: string;
  /**
   * Balance token key (`items` record key) for dashboard HUD + price widget.
   * Must match an item with `tradeable: true` and a numeric `id`. Omit to auto-pick (id 0, else lowest id).
   */
  mainCurrencyToken?: string;
};

export type GeneratorJob = {
  outputToken: string;
  startedAt: number;
  completesAt: number;
  /** When set, this job counts only toward that cap lane (see `GeneratorRecipeRule.requires`). */
  requires?: string;
  /** Action that created this job; used to resolve `collect` for {@link PLAYER_ECONOMY_GENERATOR_COLLECTED_ACTION}. */
  sourceActionId?: string;
};

export type DailyMintBucket = {
  utcDay: string;
  minted: Record<string, number>;
};

export type PlayerEconomyDailyActivity = {
  date: string;
  count: number;
};

export type DailyActionUsesBucket = {
  utcDay: string;
  byAction: Record<string, number>;
};

export type PlayerEconomyRuntimeState = {
  balances: Record<string, number>;
  generating: Record<string, GeneratorJob>;
  dailyMinted: DailyMintBucket;
  activity: number;
  dailyActivity: PlayerEconomyDailyActivity;
  dailyActionUses?: DailyActionUsesBucket;
  /** Per-action purchase counts when `purchaseLimit` is used on shop rules. */
  purchaseCounts?: Record<string, number>;
};

export type PlayerEconomyProcessInput = {
  actionId: string;
  /** Required only when `actionId` is {@link PLAYER_ECONOMY_GENERATOR_COLLECTED_ACTION} (production job id). */
  itemId?: string;
  /** Ranged mint and ranged burn amounts (token key → integer). */
  amounts?: Record<string, number>;
  now: number;
};

export type PlayerEconomyCollectGrant = {
  token: string;
  amount: number;
};

export type PlayerEconomyProcessSuccess = {
  ok: true;
  state: PlayerEconomyRuntimeState;
  generatorJobId?: string;
  collectGrants?: PlayerEconomyCollectGrant[];
};

export type PlayerEconomyProcessFailure = {
  ok: false;
  error: string;
};

export type PlayerEconomyProcessResult =
  | PlayerEconomyProcessSuccess
  | PlayerEconomyProcessFailure;
