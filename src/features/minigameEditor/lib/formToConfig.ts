import type {
  MinigameConfig,
  MinigameActionDefinition,
  MinigameShopConfigRow,
  ProduceRule,
} from "features/minigame/lib/types";

import type { EditorFormState } from "./types";

export function formToConfig(form: EditorFormState): MinigameConfig {
  const actions = form.actions.reduce(
    (acc, row) => {
      if (!row.id.trim()) return acc;

      const def: MinigameActionDefinition = {};

      // Require
      const require = row.require.reduce(
        (map, t) => {
          if (!t.token.trim()) return map;
          map[t.token.trim()] = { amount: Math.max(0, t.amount || 0) };
          return map;
        },
        {} as Record<string, { amount: number }>,
      );
      if (Object.keys(require).length) def.require = require;

      // RequireBelow
      const requireBelow = row.requireBelow.reduce(
        (map, t) => {
          if (!t.token.trim()) return map;
          map[t.token.trim()] = Math.max(0, t.amount || 0);
          return map;
        },
        {} as Record<string, number>,
      );
      if (Object.keys(requireBelow).length) def.requireBelow = requireBelow;

      // RequireAbsent
      const requireAbsent = row.requireAbsent.filter((s) => s.trim());
      if (requireAbsent.length) def.requireAbsent = requireAbsent;

      // Burn
      const burn = row.burn.reduce(
        (map, t) => {
          if (!t.token.trim()) return map;
          map[t.token.trim()] = { amount: Math.max(0, t.amount || 0) };
          return map;
        },
        {} as Record<string, { amount: number }>,
      );
      if (Object.keys(burn).length) def.burn = burn;

      // Mint (supports union types)
      const mint = row.mint.reduce(
        (map, t) => {
          if (!t.token.trim()) return map;
          if (t.type === "ranged") {
            map[t.token.trim()] = {
              min: Math.max(0, t.min || 0),
              max: Math.max(0, t.max || 0),
              dailyCap: Math.max(0, t.dailyCap || 0),
            };
          } else if (t.type === "fixedCapped") {
            map[t.token.trim()] = {
              amount: Math.max(0, t.amount || 0),
              dailyCap: Math.max(0, t.dailyCap || 0),
            };
          } else {
            map[t.token.trim()] = { amount: Math.max(0, t.amount || 0) };
          }
          return map;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {} as Record<string, any>,
      );
      if (Object.keys(mint).length) def.mint = mint;

      // Produce
      const produce = row.produce.reduce(
        (map, p) => {
          if (!p.token.trim()) return map;
          const rule: ProduceRule = {
            msToComplete: Math.max(0, p.msToComplete || 0),
          };
          if (p.limit !== undefined && p.limit > 0) rule.limit = p.limit;
          if (p.requires?.trim()) rule.requires = p.requires.trim();
          map[p.token.trim()] = rule;
          return map;
        },
        {} as Record<string, ProduceRule>,
      );
      if (Object.keys(produce).length) def.produce = produce;

      // Collect
      const collect = row.collect.reduce(
        (map, c) => {
          if (!c.token.trim()) return map;
          map[c.token.trim()] = { amount: Math.max(0, c.amount || 0) };
          return map;
        },
        {} as Record<string, { amount: number }>,
      );
      if (Object.keys(collect).length) def.collect = collect;

      acc[row.id.trim()] = def;

      // For produce actions, emit the linked collect action as a separate action
      if (
        row.actionType === "produce" &&
        row.linkedCollectId?.trim() &&
        row.linkedCollectMint?.length
      ) {
        const collectDef: MinigameActionDefinition = {};
        const collectMint = row.linkedCollectMint.reduce(
          (map, t) => {
            if (!t.token.trim()) return map;
            map[t.token.trim()] = { amount: Math.max(0, t.amount || 0) };
            return map;
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {} as Record<string, any>,
        );
        if (Object.keys(collectMint).length) collectDef.mint = collectMint;
        acc[row.linkedCollectId.trim()] = collectDef;
      }

      return acc;
    },
    {} as MinigameConfig["actions"],
  );

  const items = form.items.reduce(
    (acc, item) => {
      if (!item.key.trim()) return acc;
      acc[item.key.trim()] = {
        name: item.name,
        description: item.description,
        ...(item.image.trim() ? { image: item.image.trim() } : {}),
        ...(item.id !== undefined ? { id: item.id } : {}),
        ...(item.tradeable ? { tradeable: true } : {}),
      };
      return acc;
    },
    {} as NonNullable<MinigameConfig["items"]>,
  );

  const config: MinigameConfig = {
    actions,
    ...(Object.keys(items).length ? { items } : {}),
    descriptions: {
      title: form.descriptionTitle || undefined,
      subtitle: form.descriptionSubtitle || undefined,
      welcome: form.descriptionWelcome || undefined,
      rules: form.descriptionRules || undefined,
    },
    ...(form.playUrl.trim() ? { playUrl: form.playUrl.trim() } : {}),
  };

  // Dashboard
  if (form.dashboard.enabled && form.dashboard.displayName.trim()) {
    const shopRows: MinigameShopConfigRow[] = form.dashboard.shop
      .filter((s) => s.id.trim() && s.actionId.trim())
      .map((s) => ({
        id: s.id.trim(),
        actionId: s.actionId.trim(),
        ...(s.name.trim() ? { name: s.name.trim() } : {}),
        ...(s.description.trim() ? { description: s.description.trim() } : {}),
        ...(s.listImageToken.trim()
          ? { listImageToken: s.listImageToken.trim() }
          : {}),
        price: {
          token: s.priceToken.trim(),
          amount: Math.max(0, s.priceAmount || 0),
        },
        ...(s.ownedBalanceToken.trim()
          ? { ownedBalanceToken: s.ownedBalanceToken.trim() }
          : {}),
      }));

    const prodCollect = form.dashboard.productionCollectByStartId.reduce(
      (map, entry) => {
        if (entry.startId.trim() && entry.collectId.trim()) {
          map[entry.startId.trim()] = entry.collectId.trim();
        }
        return map;
      },
      {} as Record<string, string>,
    );

    config.dashboard = {
      displayName: form.dashboard.displayName.trim(),
      headerBalanceToken: form.dashboard.headerBalanceToken.trim(),
      inventoryShortcutTokens: form.dashboard.inventoryShortcutTokens
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      shop: shopRows,
      productionCollectByStartId: prodCollect,
      ...(form.dashboard.visualTheme.trim()
        ? { visualTheme: form.dashboard.visualTheme.trim() }
        : {}),
    };
  }

  return config;
}
