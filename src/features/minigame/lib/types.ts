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

export type BurnRule = { amount: number };

export type RequireRule = { amount: number };

export type ProduceRule = {
  msToComplete: number;
  /**
   * Max concurrent jobs with this `outputToken` across all lanes. Omit for no global cap.
   */
  limit?: number;
  /**
   * Capacity is per lane: only jobs tagged with this same key count toward the cap
   * (parallel outputs like multiple wormeries each producing Worm).
   */
  requires?: string;
};

export type CollectRule = { amount: number };

export type MinigameBalanceItem = {
  name: string;
  description: string;
  image?: string;
  id?: number;
  /** Main marketplace currency for this minigame when true. */
  tradeable?: boolean;
};

export type MinigameDescriptions = {
  title?: string;
  subtitle?: string;
  welcome?: string;
  rules?: string;
};

export type MinigameShopConfigRow = {
  id: string;
  actionId: string;
  name?: string;
  description?: string;
  listImageToken?: string;
  price: { token: string; amount: number };
  ownedBalanceToken?: string;
};

export type MinigameDashboardConfig = {
  displayName: string;
  headerBalanceToken: string;
  inventoryShortcutTokens: string[];
  shop: MinigameShopConfigRow[];
  productionCollectByStartId: Record<string, string>;
  visualTheme?: string;
};

export type MinigameActionDefinition = {
  require?: Record<string, RequireRule>;
  requireBelow?: Record<string, number>;
  requireAbsent?: string[];
  mint?: Record<string, MintRule>;
  burn?: Record<string, BurnRule>;
  produce?: Record<string, ProduceRule>;
  collect?: Record<string, CollectRule>;
};

export type MinigameConfig = {
  actions: Record<string, MinigameActionDefinition>;
  items?: Record<string, MinigameBalanceItem>;
  descriptions?: MinigameDescriptions;
  dashboard?: MinigameDashboardConfig;
};

export type ProducingEntry = {
  outputToken: string;
  startedAt: number;
  completesAt: number;
  /** When set, this job counts only toward that cap lane (see `ProduceRule.requires`). */
  requires?: string;
};

export type DailyMintBucket = {
  utcDay: string;
  minted: Record<string, number>;
};

export type MinigameDailyActivity = {
  date: string;
  count: number;
};

export type MinigameRuntimeState = {
  balances: Record<string, number>;
  producing: Record<string, ProducingEntry>;
  dailyMinted: DailyMintBucket;
  activity: number;
  dailyActivity: MinigameDailyActivity;
};

export type MinigameProcessInput = {
  actionId: string;
  itemId?: string;
  amounts?: Record<string, number>;
  now: number;
};

export type MinigameProcessSuccess = {
  ok: true;
  state: MinigameRuntimeState;
  producingId?: string;
};

export type MinigameProcessFailure = {
  ok: false;
  error: string;
};

export type MinigameProcessResult =
  | MinigameProcessSuccess
  | MinigameProcessFailure;
