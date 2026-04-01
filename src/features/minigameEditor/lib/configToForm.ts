import type {
  MinigameConfig,
  MinigameActionDefinition,
  MinigameBalanceItem,
  MintRule,
  ProduceRule,
} from "features/minigame/lib/types";

import type {
  ActionForm,
  ActionType,
  DashboardForm,
  EditorFormState,
  ItemForm,
  MintRuleForm,
} from "./types";
import { EMPTY_DASHBOARD } from "./types";

export function parseMintRule(key: string, rule: MintRule): MintRuleForm {
  const r = rule as Record<string, number>;
  if ("min" in r && "max" in r) {
    return {
      token: key,
      type: "ranged",
      amount: 0,
      min: r.min ?? 0,
      max: r.max ?? 0,
      dailyCap: r.dailyCap ?? 0,
    };
  }
  if ("dailyCap" in r && "amount" in r) {
    return {
      token: key,
      type: "fixedCapped",
      amount: r.amount ?? 0,
      dailyCap: r.dailyCap ?? 0,
      min: 0,
      max: 0,
    };
  }
  return {
    token: key,
    type: "fixed",
    amount: r.amount ?? 0,
    dailyCap: 0,
    min: 0,
    max: 0,
  };
}

export function configToForm(
  slug: string,
  config: MinigameConfig,
): EditorFormState {
  const actions: ActionForm[] = Object.entries(config.actions ?? {}).map(
    ([id, value]) => {
      const def = value as MinigameActionDefinition;

      // Infer action type from definition shape
      const inferType = (): ActionType => {
        if (Object.keys(def.produce ?? {}).length > 0) return "produce";
        if (
          Object.keys(def.burn ?? {}).length > 0 &&
          Object.keys(def.mint ?? {}).length === 0
        )
          return "burn";
        if (
          Object.keys(def.mint ?? {}).length > 0 &&
          Object.keys(def.burn ?? {}).length > 0
        )
          return "craft";
        if (Object.keys(def.mint ?? {}).length > 0) return "reward";
        return "reward";
      };

      return {
        actionType: inferType(),
        id,
        mint: Object.entries(def.mint ?? {}).map(([key, rule]) =>
          parseMintRule(key, rule),
        ),
        burn: Object.entries(def.burn ?? {}).map(([key, rule]) => ({
          token: key,
          amount: (rule as { amount: number }).amount,
        })),
        require: Object.entries(def.require ?? {}).map(([key, rule]) => ({
          token: key,
          amount: (rule as { amount: number }).amount,
        })),
        requireBelow: Object.entries(def.requireBelow ?? {}).map(
          ([key, amount]) => ({
            token: key,
            amount: amount as number,
          }),
        ),
        requireAbsent: (def.requireAbsent ?? []) as string[],
        produce: Object.entries(def.produce ?? {}).map(([key, rule]) => {
          const r = rule as ProduceRule;
          return {
            token: key,
            msToComplete: r.msToComplete,
            limit: r.limit,
            requires: r.requires,
          };
        }),
        collect: Object.entries(def.collect ?? {}).map(([key, rule]) => ({
          token: key,
          amount: (rule as { amount: number }).amount,
        })),
      };
    },
  );

  const items: ItemForm[] = Object.entries(config.items ?? {}).map(
    ([key, v]) => {
      const item = v as MinigameBalanceItem;
      return {
        key,
        name: item.name,
        description: item.description,
        image: item.image ?? "",
        id: item.id,
        tradeable: item.tradeable === true,
        presignedPutUrl: "",
      };
    },
  );

  let dashboard: DashboardForm = { ...EMPTY_DASHBOARD };
  if (config.dashboard) {
    const d = config.dashboard;
    dashboard = {
      enabled: true,
      displayName: d.displayName,
      headerBalanceToken: d.headerBalanceToken,
      inventoryShortcutTokens: d.inventoryShortcutTokens.join(", "),
      shop: d.shop.map((s) => ({
        id: s.id,
        actionId: s.actionId,
        name: s.name ?? "",
        description: s.description ?? "",
        listImageToken: s.listImageToken ?? "",
        priceToken: s.price.token,
        priceAmount: s.price.amount,
        ownedBalanceToken: s.ownedBalanceToken ?? "",
      })),
      productionCollectByStartId: Object.entries(
        d.productionCollectByStartId,
      ).map(([startId, collectId]) => ({
        startId,
        collectId: collectId as string,
      })),
      visualTheme: d.visualTheme ?? "",
    };
  }

  return {
    slug,
    playUrl: config.playUrl ?? "",
    descriptionTitle: config.descriptions?.title ?? "",
    descriptionSubtitle: config.descriptions?.subtitle ?? "",
    descriptionWelcome: config.descriptions?.welcome ?? "",
    descriptionRules: config.descriptions?.rules ?? "",
    items,
    actions,
    dashboard,
  };
}
