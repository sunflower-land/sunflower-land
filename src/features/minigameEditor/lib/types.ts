import type {
  MinigameConfig,
  MinigameDashboardConfig,
  MinigameShopConfigRow,
} from "features/minigame/lib/types";

/* ─── API row ─────────────────────────────────────────────────── */

export type MinigameConfigRow = {
  slug: string;
  farmId: number;
  config: MinigameConfig;
  createdAt: string;
  updatedAt: string;
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
};

export type ProduceRuleForm = {
  token: string;
  msToComplete: number;
  limit?: number;
  requires?: string;
};

export type CollectRuleForm = {
  token: string;
  amount: number;
};

export type ItemForm = {
  key: string;
  name: string;
  description: string;
  image: string;
  id?: number;
  tradeable: boolean;
  presignedPutUrl: string;
  uploadError?: string;
};

export type ActionType = "produce" | "reward" | "craft" | "burn";

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
   * For "produce" actions only: the linked collect action's ID and mint rules.
   * When saving, this becomes a separate action in the config.
   */
  linkedCollectId?: string;
  linkedCollectMint?: MintRuleForm[];
};

export type ShopRowForm = {
  id: string;
  actionId: string;
  name: string;
  description: string;
  listImageToken: string;
  priceToken: string;
  priceAmount: number;
  ownedBalanceToken: string;
};

export type DashboardForm = {
  enabled: boolean;
  displayName: string;
  headerBalanceToken: string;
  inventoryShortcutTokens: string;
  shop: ShopRowForm[];
  productionCollectByStartId: { startId: string; collectId: string }[];
  visualTheme: string;
};

export type EditorFormState = {
  slug: string;
  playUrl: string;
  descriptionTitle: string;
  descriptionSubtitle: string;
  descriptionWelcome: string;
  descriptionRules: string;
  items: ItemForm[];
  actions: ActionForm[];
  dashboard: DashboardForm;
};

export type EditorTab = "basics" | "items" | "actions";

/* ─── Empty defaults ──────────────────────────────────────────── */

export const EMPTY_DASHBOARD: DashboardForm = {
  enabled: false,
  displayName: "",
  headerBalanceToken: "",
  inventoryShortcutTokens: "",
  shop: [],
  productionCollectByStartId: [],
  visualTheme: "",
};

export const EMPTY_FORM: EditorFormState = {
  slug: "",
  playUrl: "",
  descriptionTitle: "",
  descriptionSubtitle: "",
  descriptionWelcome: "",
  descriptionRules: "",
  items: [],
  actions: [],
  dashboard: { ...EMPTY_DASHBOARD },
};

export const EMPTY_MINT_ROW: MintRuleForm = {
  token: "",
  type: "fixed",
  amount: 0,
  dailyCap: 0,
  min: 0,
  max: 0,
};

export const EMPTY_BURN_ROW: TokenAmount = { token: "", amount: 0 };

export const ACTION_TYPE_OPTIONS: {
  type: ActionType;
  label: string;
  iconKey: "basket" | "treasure" | "hammer" | "lightning";
}[] = [
  { type: "produce", label: "Produce/Stake", iconKey: "basket" },
  { type: "reward", label: "Reward", iconKey: "treasure" },
  { type: "craft", label: "Craft", iconKey: "hammer" },
  { type: "burn", label: "Burn", iconKey: "lightning" },
];

export function getActionTypeLabel(type: ActionType): string {
  switch (type) {
    case "produce":
      return "Produce/Stake";
    case "reward":
      return "Reward";
    case "craft":
      return "Craft";
    case "burn":
      return "Burn";
  }
}
