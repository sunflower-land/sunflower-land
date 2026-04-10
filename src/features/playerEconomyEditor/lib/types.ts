import type { PlayerEconomyConfig } from "features/minigame/lib/types";

/* ─── API row ─────────────────────────────────────────────────── */

/** S3 location + timestamp for hosted minigame `index.html` (economy-editor list API). */
export type HostedMinigameSiteIndexInfo = {
  bucket: string;
  key: string;
  lastModified: string;
};

export type PlayerEconomyConfigRow = {
  slug: string;
  farmId: number;
  config: PlayerEconomyConfig;
  createdAt: string;
  updatedAt: string;
  /** ISO time of last CDN cache refresh (`economy.invalidated`). */
  invalidatedAt?: string;
  hostedSiteIndex?: HostedMinigameSiteIndexInfo | null;
};

/* ─── Form primitives ─────────────────────────────────────────── */

export type TokenAmount = { token: string; amount: number };

export type MintRuleForm = {
  token: string;
  type: "fixed" | "fixedCapped" | "ranged";
  amount: number;
  dailyCap: number;
  min: number;
  max: number;
  /**
   * Generate → Collect rows only: drop chance 0–100 (default 100). Ignored for shop mint rows.
   */
  collectChance?: number;
};

/** Custom rule: mint row with min / max / per-token daily cap. */
export type CustomMintRowForm = {
  token: string;
  min: number;
  max: number;
  dailyCap: number;
  /** 0–100; omit or 100 = always mint when the action runs. */
  chance?: number;
};

/** Custom rule: burn row with min / max (client passes exact burn in `amounts`). */
export type CustomBurnRowForm = {
  token: string;
  min: number;
  max: number;
};

export type ProduceRuleForm = {
  token: string;
  msToComplete: number;
  limit?: number;
  /** Balance item this production slot uses (required for timed / capped lanes). */
  requires: string;
};

export type CollectRuleForm = {
  token: string;
  amount: number;
  /** Seconds until collect (mirrors saved `collect[token].seconds`). */
  seconds?: number;
  /** 0–100; default 100 when omitted. */
  chance?: number;
};

export type ItemForm = {
  key: string;
  name: string;
  description: string;
  image: string;
  id?: number;
  tradeable: boolean;
  /** When true, can be chosen as produce "requires" and shown in the dashboard production zone. */
  generator: boolean;
  /** When true, shown in the economy dashboard trophy zone when the player owns at least one. */
  trophy: boolean;
  /** Starting balance for new farms (`items[token].initialBalance` in saved config). */
  initialBalance: number;
  /** True while PUT to S3 / presign is in flight (editor-only, not persisted). */
  imageUploading?: boolean;
  uploadError?: string;
  /**
   * Soft-delete in the editor only: hidden from UI and omitted from saved config.
   * Keeps the slot so numeric `id` sequencing continues for new items.
   */
  deleted?: boolean;
};

export type ActionType = "produce" | "shop" | "custom";

export type ActionForm = {
  actionType: ActionType;
  id: string;
  mint: MintRuleForm[];
  burn: TokenAmount[];
  require: TokenAmount[];
  requireBelow: TokenAmount[];
  requireAbsent: string[];
  produce: ProduceRuleForm[];
  collect: CollectRuleForm[];
  /**
   * For "produce" actions only: optional legacy link to a separate collect-only action id.
   * Collect payouts and timing are saved on this action’s `collect` map (seconds + amount).
   */
  linkedCollectId?: string;
  linkedCollectMint?: MintRuleForm[];
  /**
   * Shop: when false, hidden from derived in-game shop (loaded from `showInShop`; no editor toggle).
   */
  showInShop: boolean;
  /**
   * Shop: max lifetime purchases per farm (persisted as `purchaseLimit` on the action). 0 = unlimited.
   */
  shopPurchaseLimit: number;
  /** Custom rule only — advanced mint rows. */
  customMint: CustomMintRowForm[];
  customBurn: CustomBurnRowForm[];
  /** Custom: max successful runs per UTC day (0 = unlimited). */
  customDailyUsesCap: number;
};

export type EditorFormState = {
  slug: string;
  playUrl: string;
  /** `items` token key (`String(id)`); empty = auto primary currency among tradeable items. */
  mainCurrencyToken: string;
  descriptionTitle: string;
  descriptionSubtitle: string;
  descriptionWelcome: string;
  descriptionRules: string;
  items: ItemForm[];
  actions: ActionForm[];
};

export type EditorTab = "basics" | "items" | "actions" | "json";

/* ─── Empty defaults ──────────────────────────────────────────── */

export const EMPTY_FORM: EditorFormState = {
  slug: "",
  playUrl: "",
  mainCurrencyToken: "",
  descriptionTitle: "",
  descriptionSubtitle: "",
  descriptionWelcome: "",
  descriptionRules: "",
  items: [],
  actions: [],
};

export const EMPTY_MINT_ROW: MintRuleForm = {
  token: "",
  type: "fixed",
  amount: 0,
  dailyCap: 0,
  min: 0,
  max: 0,
  collectChance: 100,
};

export const EMPTY_CUSTOM_MINT_ROW: CustomMintRowForm = {
  token: "",
  min: 0,
  max: 0,
  dailyCap: 0,
  chance: 100,
};

export const EMPTY_CUSTOM_BURN_ROW: CustomBurnRowForm = {
  token: "",
  min: 0,
  max: 0,
};

export const EMPTY_BURN_ROW: TokenAmount = { token: "", amount: 0 };

/** Rule types offered when adding a new action (Generate is legacy-only in saved configs). */
export const ACTION_TYPE_OPTIONS: {
  type: Exclude<ActionType, "produce">;
  label: string;
  iconKey: "shop" | "settings";
}[] = [
  { type: "shop", label: "Shop", iconKey: "shop" },
  { type: "custom", label: "Custom", iconKey: "settings" },
];

export function getActionTypeLabel(type: ActionType): string {
  switch (type) {
    case "produce":
      return "Generate";
    case "shop":
      return "Shop";
    case "custom":
      return "Custom";
  }
}
