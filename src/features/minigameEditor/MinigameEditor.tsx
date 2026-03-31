import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import { useNavigate, useParams } from "react-router";
import Decimal from "decimal.js-light";
import * as AuthProvider from "features/auth/lib/Provider";
import { Context as GameContext } from "features/game/GameProvider";
import { CONFIG } from "lib/config";
import { randomID } from "lib/utils/random";
import { Panel, InnerPanel, OuterPanel, ButtonPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { TextInput } from "components/ui/TextInput";
import { NumberInput } from "components/ui/NumberInput";
import { Checkbox } from "components/ui/Checkbox";
import { Tab } from "components/ui/Tab";
import { SUNNYSIDE } from "assets/sunnyside";
import { SquareIcon } from "components/ui/SquareIcon";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type {
  MinigameConfig,
  MinigameActionDefinition,
  MinigameDashboardConfig,
  MinigameShopConfigRow,
  ProduceRule,
  CollectRule,
} from "features/minigame/lib/types";

/* ─── Types ────────────────────────────────────────────────────── */

type MinigameConfigRow = {
  slug: string;
  farmId: number;
  config: MinigameConfig;
  createdAt: string;
  updatedAt: string;
};

type TokenAmount = { token: string; amount: number };

type MintRuleForm = {
  token: string;
  type: "fixed" | "fixedCapped" | "ranged";
  amount: number;
  dailyCap: number;
  min: number;
  max: number;
};

type ProduceRuleForm = {
  token: string;
  msToComplete: number;
  limit?: number;
  requires?: string;
};

type CollectRuleForm = {
  token: string;
  amount: number;
};

type ItemForm = {
  key: string;
  name: string;
  description: string;
  image: string;
  id?: number;
  tradeable: boolean;
  presignedPutUrl: string;
  uploadError?: string;
};

type ActionForm = {
  id: string;
  mint: MintRuleForm[];
  burn: TokenAmount[];
  require: TokenAmount[];
  requireBelow: TokenAmount[];
  requireAbsent: string[];
  produce: ProduceRuleForm[];
  collect: CollectRuleForm[];
};

type ShopRowForm = {
  id: string;
  actionId: string;
  name: string;
  description: string;
  listImageToken: string;
  priceToken: string;
  priceAmount: number;
  ownedBalanceToken: string;
};

type DashboardForm = {
  enabled: boolean;
  displayName: string;
  headerBalanceToken: string;
  inventoryShortcutTokens: string;
  shop: ShopRowForm[];
  productionCollectByStartId: { startId: string; collectId: string }[];
  visualTheme: string;
};

type EditorFormState = {
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

const EMPTY_DASHBOARD: DashboardForm = {
  enabled: false,
  displayName: "",
  headerBalanceToken: "",
  inventoryShortcutTokens: "",
  shop: [],
  productionCollectByStartId: [],
  visualTheme: "",
};

const EMPTY_FORM: EditorFormState = {
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

/* ─── Conversion helpers ───────────────────────────────────────── */

function formToConfig(form: EditorFormState): MinigameConfig {
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
        {} as Record<string, any>,
      );
      if (Object.keys(mint).length) def.mint = mint;

      // Produce
      const produce = row.produce.reduce(
        (map, p) => {
          if (!p.token.trim()) return map;
          const rule: ProduceRule = { msToComplete: Math.max(0, p.msToComplete || 0) };
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
        {} as Record<string, CollectRule>,
      );
      if (Object.keys(collect).length) def.collect = collect;

      acc[row.id.trim()] = def;
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

function parseMintRule(key: string, rule: import("features/minigame/lib/types").MintRule): MintRuleForm {
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

function configToForm(slug: string, config: MinigameConfig): EditorFormState {
  const actions: ActionForm[] = Object.entries(config.actions ?? {}).map(
    ([id, value]) => {
      const def = value as MinigameActionDefinition;
      return {
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
      const item = v as import("features/minigame/lib/types").MinigameBalanceItem;
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
      ).map(([startId, collectId]) => ({ startId, collectId: collectId as string })),
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

/* ─── API hook ─────────────────────────────────────────────────── */

function useEditorApi() {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const { gameService } = useContext(GameContext);
  const [gameState] = useActor(gameService);
  const farmId = gameState.context.farmId;
  const token = authState.context.user.rawToken as string;

  const listUrl = useMemo(
    () => `${CONFIG.API_URL}/data?type=mingame-editor&farmId=${farmId}`,
    [farmId],
  );

  const loadRows = async (): Promise<MinigameConfigRow[]> => {
    const response = await fetch(listUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const body = (await response.json().catch(() => ({}))) as {
      data?: MinigameConfigRow[];
    };
    if (!response.ok) throw new Error(`Load failed (${response.status})`);
    return Array.isArray(body.data) ? body.data : [];
  };

  const submitEvent = async (event: Record<string, unknown>) => {
    const response = await fetch(`${CONFIG.API_URL}/event/${farmId}`, {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "X-Transaction-ID": randomID(),
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
      body: JSON.stringify({
        event,
        createdAt: new Date().toISOString(),
      }),
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as {
        errorCode?: string;
      };
      throw new Error(body.errorCode ?? `Request failed (${response.status})`);
    }
  };

  return { loadRows, submitEvent };
}

/* ─── Reusable sub-components ──────────────────────────────────── */

/** Section header label inside a panel */
const SectionHeader: React.FC<{
  children: React.ReactNode;
  type?: "default" | "info" | "warning" | "success" | "vibrant";
  icon?: string;
}> = ({ children, type = "default", icon }) => (
  <Label type={type} icon={icon} className="mb-2">
    {children}
  </Label>
);

/** A labeled field with pixel-art label above the input */
const FieldRow: React.FC<{
  label: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, hint, children }) => (
  <div className="space-y-1">
    <span className="text-xs text-white ml-1">{label}</span>
    {children}
    {hint && <span className="text-[10px] opacity-60 ml-1 block">{hint}</span>}
  </div>
);

/** Token + Amount row editor (for burn / require / requireBelow / collect) */
const TokenAmountEditor: React.FC<{
  title: string;
  labelType?: "info" | "warning" | "danger" | "success" | "vibrant";
  icon?: string;
  rows: TokenAmount[];
  onChange: (rows: TokenAmount[]) => void;
  amountLabel?: string;
}> = ({ title, labelType = "info", icon, rows, onChange, amountLabel = "Amt" }) => {
  const setRow = (index: number, next: Partial<TokenAmount>) => {
    const copy = [...rows];
    copy[index] = { ...copy[index], ...next };
    onChange(copy);
  };

  return (
    <div className="space-y-1">
      <Label type={labelType} icon={icon}>
        {title}
      </Label>
      {rows.length === 0 && (
        <p className="text-[10px] italic opacity-50 ml-1">No entries yet</p>
      )}
      {rows.map((row, index) => (
        <div
          key={`${title}-${index}`}
          className="grid grid-cols-12 gap-1 items-center"
        >
          <div className="col-span-6">
            <TextInput
              value={row.token}
              onValueChange={(value) => setRow(index, { token: value })}
              placeholder="Token key"
            />
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <span className="text-[10px] opacity-60">{amountLabel}</span>
          </div>
          <div className="col-span-3">
            <NumberInput
              value={new Decimal(row.amount)}
              maxDecimalPlaces={2}
              onValueChange={(value) =>
                setRow(index, { amount: value.toNumber() })
              }
            />
          </div>
          <div className="col-span-2">
            <Button
              variant="secondary"
              onClick={() => onChange(rows.filter((_, i) => i !== index))}
              className="w-full"
            >
              <img
                src={SUNNYSIDE.icons.cancel}
                className="w-3"
                style={{ imageRendering: "pixelated" }}
              />
            </Button>
          </div>
        </div>
      ))}
      <Button
        variant="secondary"
        onClick={() => onChange([...rows, { token: "", amount: 0 }])}
      >
        <span className="text-xs">+ Add {title}</span>
      </Button>
    </div>
  );
};

/** Mint rule editor (supports Fixed / FixedCapped / Ranged union) */
const MintRuleEditor: React.FC<{
  rows: MintRuleForm[];
  onChange: (rows: MintRuleForm[]) => void;
}> = ({ rows, onChange }) => {
  const setRow = (index: number, next: Partial<MintRuleForm>) => {
    const copy = [...rows];
    copy[index] = { ...copy[index], ...next };
    onChange(copy);
  };

  return (
    <div className="space-y-1">
      <Label type="success" icon={SUNNYSIDE.icons.plant}>
        Mint
      </Label>
      {rows.length === 0 && (
        <p className="text-[10px] italic opacity-50 ml-1">No mint rules</p>
      )}
      {rows.map((row, index) => (
        <InnerPanel key={`mint-${index}`} className="p-2 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] opacity-70">
              Mint Rule {index + 1}
            </span>
            <Button
              variant="secondary"
              onClick={() => onChange(rows.filter((_, i) => i !== index))}
              className="w-8 h-6"
            >
              <img
                src={SUNNYSIDE.icons.cancel}
                className="w-3"
                style={{ imageRendering: "pixelated" }}
              />
            </Button>
          </div>
          <TextInput
            value={row.token}
            onValueChange={(value) => setRow(index, { token: value })}
            placeholder="Token key"
          />
          {/* Type selector */}
          <div className="flex gap-1">
            {(["fixed", "fixedCapped", "ranged"] as const).map((t) => (
              <ButtonPanel
                key={t}
                selected={row.type === t}
                onClick={() => setRow(index, { type: t })}
                className="px-2 py-1 text-[10px] flex-1 text-center"
              >
                {t === "fixed"
                  ? "Fixed"
                  : t === "fixedCapped"
                    ? "Daily Cap"
                    : "Ranged"}
              </ButtonPanel>
            ))}
          </div>
          {/* Fields per type */}
          {row.type === "fixed" && (
            <FieldRow label="Amount">
              <NumberInput
                value={new Decimal(row.amount)}
                maxDecimalPlaces={2}
                onValueChange={(v) => setRow(index, { amount: v.toNumber() })}
              />
            </FieldRow>
          )}
          {row.type === "fixedCapped" && (
            <div className="grid grid-cols-2 gap-1">
              <FieldRow label="Amount">
                <NumberInput
                  value={new Decimal(row.amount)}
                  maxDecimalPlaces={2}
                  onValueChange={(v) =>
                    setRow(index, { amount: v.toNumber() })
                  }
                />
              </FieldRow>
              <FieldRow label="Daily Cap">
                <NumberInput
                  value={new Decimal(row.dailyCap)}
                  maxDecimalPlaces={0}
                  onValueChange={(v) =>
                    setRow(index, { dailyCap: v.toNumber() })
                  }
                />
              </FieldRow>
            </div>
          )}
          {row.type === "ranged" && (
            <div className="grid grid-cols-3 gap-1">
              <FieldRow label="Min">
                <NumberInput
                  value={new Decimal(row.min)}
                  maxDecimalPlaces={2}
                  onValueChange={(v) => setRow(index, { min: v.toNumber() })}
                />
              </FieldRow>
              <FieldRow label="Max">
                <NumberInput
                  value={new Decimal(row.max)}
                  maxDecimalPlaces={2}
                  onValueChange={(v) => setRow(index, { max: v.toNumber() })}
                />
              </FieldRow>
              <FieldRow label="Daily Cap">
                <NumberInput
                  value={new Decimal(row.dailyCap)}
                  maxDecimalPlaces={0}
                  onValueChange={(v) =>
                    setRow(index, { dailyCap: v.toNumber() })
                  }
                />
              </FieldRow>
            </div>
          )}
        </InnerPanel>
      ))}
      <Button
        variant="secondary"
        onClick={() =>
          onChange([
            ...rows,
            {
              token: "",
              type: "fixed",
              amount: 0,
              dailyCap: 0,
              min: 0,
              max: 0,
            },
          ])
        }
      >
        <span className="text-xs">+ Add Mint Rule</span>
      </Button>
    </div>
  );
};

/** Produce rule editor */
const ProduceRuleEditor: React.FC<{
  rows: ProduceRuleForm[];
  onChange: (rows: ProduceRuleForm[]) => void;
}> = ({ rows, onChange }) => {
  const setRow = (index: number, next: Partial<ProduceRuleForm>) => {
    const copy = [...rows];
    copy[index] = { ...copy[index], ...next };
    onChange(copy);
  };

  return (
    <div className="space-y-1">
      <Label type="vibrant">Produce</Label>
      {rows.length === 0 && (
        <p className="text-[10px] italic opacity-50 ml-1">No produce rules</p>
      )}
      {rows.map((row, index) => (
        <InnerPanel key={`produce-${index}`} className="p-2 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] opacity-70">
              Produce {index + 1}
            </span>
            <Button
              variant="secondary"
              onClick={() => onChange(rows.filter((_, i) => i !== index))}
              className="w-8 h-6"
            >
              <img
                src={SUNNYSIDE.icons.cancel}
                className="w-3"
                style={{ imageRendering: "pixelated" }}
              />
            </Button>
          </div>
          <TextInput
            value={row.token}
            onValueChange={(value) => setRow(index, { token: value })}
            placeholder="Output token"
          />
          <div className="grid grid-cols-2 gap-1">
            <FieldRow label="Time (ms)">
              <NumberInput
                value={new Decimal(row.msToComplete)}
                maxDecimalPlaces={0}
                onValueChange={(v) =>
                  setRow(index, { msToComplete: v.toNumber() })
                }
              />
            </FieldRow>
            <FieldRow label="Limit (optional)">
              <NumberInput
                value={new Decimal(row.limit ?? 0)}
                maxDecimalPlaces={0}
                onValueChange={(v) =>
                  setRow(index, {
                    limit: v.toNumber() > 0 ? v.toNumber() : undefined,
                  })
                }
              />
            </FieldRow>
          </div>
          <FieldRow label="Requires (lane key)" hint="Optional capacity lane">
            <TextInput
              value={row.requires ?? ""}
              onValueChange={(value) => setRow(index, { requires: value })}
              placeholder="e.g. wormery"
            />
          </FieldRow>
        </InnerPanel>
      ))}
      <Button
        variant="secondary"
        onClick={() =>
          onChange([...rows, { token: "", msToComplete: 0, limit: undefined }])
        }
      >
        <span className="text-xs">+ Add Produce Rule</span>
      </Button>
    </div>
  );
};

/** Require absent editor (string list) */
const RequireAbsentEditor: React.FC<{
  values: string[];
  onChange: (values: string[]) => void;
}> = ({ values, onChange }) => (
  <div className="space-y-1">
    <Label type="warning">Require Absent</Label>
    {values.length === 0 && (
      <p className="text-[10px] italic opacity-50 ml-1">No absent checks</p>
    )}
    {values.map((val, index) => (
      <div key={`absent-${index}`} className="grid grid-cols-12 gap-1 items-center">
        <div className="col-span-10">
          <TextInput
            value={val}
            onValueChange={(v) => {
              const copy = [...values];
              copy[index] = v;
              onChange(copy);
            }}
            placeholder="Token that must NOT exist"
          />
        </div>
        <div className="col-span-2">
          <Button
            variant="secondary"
            onClick={() => onChange(values.filter((_, i) => i !== index))}
            className="w-full"
          >
            <img
              src={SUNNYSIDE.icons.cancel}
              className="w-3"
              style={{ imageRendering: "pixelated" }}
            />
          </Button>
        </div>
      </div>
    ))}
    <Button variant="secondary" onClick={() => onChange([...values, ""])}>
      <span className="text-xs">+ Add Absent Check</span>
    </Button>
  </div>
);

/* ─── Tab types ─────────────────────────────────────────────────── */

type EditorTab = "basics" | "items" | "actions" | "dashboard" | "preview";

/* ─── Main form ────────────────────────────────────────────────── */

const MinigameEditorForm: React.FC<{
  mode: "create" | "edit";
  initial: EditorFormState;
  saving: boolean;
  error: string | null;
  onSave: (form: EditorFormState) => void;
  onBack: () => void;
}> = ({ mode, initial, saving, error, onSave, onBack }) => {
  const [form, setForm] = useState<EditorFormState>(initial);
  const [activeTab, setActiveTab] = useState<EditorTab>("basics");
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [expandedAction, setExpandedAction] = useState<number | null>(null);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const uploadImage = async (index: number, file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    const meta = await new Promise<{ width: number; height: number }>(
      (resolve, reject) => {
        image.onload = () =>
          resolve({ width: image.naturalWidth, height: image.naturalHeight });
        image.onerror = () => reject(new Error("Invalid image file"));
        image.src = objectUrl;
      },
    ).finally(() => URL.revokeObjectURL(objectUrl));

    if (meta.width > 64 || meta.height > 64) {
      throw new Error("Image must be 64x64 pixels or smaller");
    }

    const item = form.items[index];
    if (!item.presignedPutUrl.trim()) {
      throw new Error("Add a pre-signed S3 PUT URL first");
    }

    const response = await fetch(item.presignedPutUrl.trim(), {
      method: "PUT",
      headers: { "Content-Type": file.type || "image/png" },
      body: file,
    });
    if (!response.ok) {
      throw new Error(`Upload failed (${response.status})`);
    }

    const publicUrl =
      item.presignedPutUrl.split("?")[0] ?? item.presignedPutUrl;
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], image: publicUrl, uploadError: undefined };
      return { ...prev, items };
    });
  };

  const updateItem = (index: number, next: Partial<ItemForm>) => {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], ...next };
      return { ...prev, items };
    });
  };

  const updateAction = (index: number, next: Partial<ActionForm>) => {
    setForm((prev) => {
      const actions = [...prev.actions];
      actions[index] = { ...actions[index], ...next };
      return { ...prev, actions };
    });
  };

  const updateDashboard = (next: Partial<DashboardForm>) => {
    setForm((prev) => ({
      ...prev,
      dashboard: { ...prev.dashboard, ...next },
    }));
  };

  const updateShopRow = (index: number, next: Partial<ShopRowForm>) => {
    setForm((prev) => {
      const shop = [...prev.dashboard.shop];
      shop[index] = { ...shop[index], ...next };
      return {
        ...prev,
        dashboard: { ...prev.dashboard, shop },
      };
    });
  };

  /* ── Tab content renderers ─── */

  const renderBasicsTab = () => (
    <div className="space-y-3">
      {/* Game Identity */}
      <InnerPanel className="p-3 space-y-2">
        <SectionHeader type="info" icon={SUNNYSIDE.icons.player}>
          Game Identity
        </SectionHeader>
        <FieldRow
          label="Slug"
          hint={
            mode === "edit"
              ? "Cannot be changed after creation"
              : "Unique identifier (lowercase, dashes)"
          }
        >
          <TextInput
            value={form.slug}
            onValueChange={(slug) => setForm((prev) => ({ ...prev, slug }))}
            maxLength={60}
            placeholder="my-cool-minigame"
            className={mode === "edit" ? "pointer-events-none opacity-70" : ""}
          />
        </FieldRow>
        <FieldRow label="Play URL" hint="The iframe URL that hosts your game">
          <TextInput
            value={form.playUrl}
            onValueChange={(playUrl) =>
              setForm((prev) => ({ ...prev, playUrl }))
            }
            placeholder="https://my-game.minigames.sunflower-land.com"
          />
        </FieldRow>
      </InnerPanel>

      {/* Descriptions */}
      <InnerPanel className="p-3 space-y-2">
        <SectionHeader type="info" icon={SUNNYSIDE.icons.expression_chat}>
          Descriptions
        </SectionHeader>
        <FieldRow label="Title" hint="Main display name for your minigame">
          <TextInput
            value={form.descriptionTitle}
            onValueChange={(v) =>
              setForm((prev) => ({ ...prev, descriptionTitle: v }))
            }
            placeholder="My Awesome Game"
          />
        </FieldRow>
        <FieldRow label="Subtitle">
          <TextInput
            value={form.descriptionSubtitle}
            onValueChange={(v) =>
              setForm((prev) => ({ ...prev, descriptionSubtitle: v }))
            }
            placeholder="A short tagline"
          />
        </FieldRow>
        <FieldRow label="Welcome Message" hint="Shown when a player first opens your game">
          <TextInput
            value={form.descriptionWelcome}
            onValueChange={(v) =>
              setForm((prev) => ({ ...prev, descriptionWelcome: v }))
            }
            placeholder="Welcome to the adventure..."
          />
        </FieldRow>
        <FieldRow label="Rules" hint="Explain how to play">
          <TextInput
            value={form.descriptionRules}
            onValueChange={(v) =>
              setForm((prev) => ({ ...prev, descriptionRules: v }))
            }
            placeholder="Click to collect, earn points..."
          />
        </FieldRow>
      </InnerPanel>
    </div>
  );

  const renderItemsTab = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <SectionHeader type="warning">
          {form.items.length} Item{form.items.length !== 1 ? "s" : ""} Defined
        </SectionHeader>
      </div>

      {form.items.length === 0 && (
        <InnerPanel className="p-4 text-center">
          <p className="text-xs opacity-60 mb-2">
            No items yet. Items are the tokens and collectibles in your
            minigame.
          </p>
        </InnerPanel>
      )}

      {form.items.map((item, index) => (
        <InnerPanel key={`item-${index}`} className="p-3 space-y-2">
          {/* Item header with preview */}
          <div className="flex items-center gap-2">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name || item.key || "item"}
                className="w-10 h-10 object-contain border border-white/20 rounded"
                style={{ imageRendering: "pixelated" }}
              />
            ) : (
              <div
                className="w-10 h-10 flex items-center justify-center border border-white/20 rounded opacity-40"
                style={{ imageRendering: "pixelated" }}
              >
                <span className="text-lg">?</span>
              </div>
            )}
            <div className="flex-1">
              <Label type="warning">
                {item.name || item.key || `Item ${index + 1}`}
              </Label>
            </div>
            <Button
              variant="secondary"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  items: prev.items.filter((_, i) => i !== index),
                }))
              }
              className="w-8"
            >
              <img
                src={SUNNYSIDE.icons.cancel}
                className="w-3"
                style={{ imageRendering: "pixelated" }}
              />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <FieldRow label="Token Key" hint="Unique ID for this item">
              <TextInput
                value={item.key}
                onValueChange={(v) => updateItem(index, { key: v })}
                placeholder="GoldenNugget"
              />
            </FieldRow>
            <FieldRow label="Display Name">
              <TextInput
                value={item.name}
                onValueChange={(v) => updateItem(index, { name: v })}
                placeholder="Golden Nugget"
              />
            </FieldRow>
          </div>

          <FieldRow label="Description">
            <TextInput
              value={item.description}
              onValueChange={(v) => updateItem(index, { description: v })}
              placeholder="A shiny collectible..."
            />
          </FieldRow>

          {/* Image section */}
          <div className="space-y-1">
            <FieldRow label="Image URL" hint="Direct URL or upload below">
              <TextInput
                value={item.image}
                onValueChange={(v) => updateItem(index, { image: v })}
                placeholder="https://..."
              />
            </FieldRow>
            <FieldRow label="Pre-signed PUT URL" hint="For S3 upload">
              <TextInput
                value={item.presignedPutUrl}
                onValueChange={(v) =>
                  updateItem(index, { presignedPutUrl: v })
                }
                placeholder="https://s3.amazonaws.com/..."
              />
            </FieldRow>
            <div className="flex items-center gap-2">
              <input
                ref={(el) => {
                  fileRefs.current[index] = el;
                }}
                type="file"
                accept="image/png,image/webp,image/gif,image/jpeg"
                className="hidden"
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0];
                  if (!file) return;
                  void uploadImage(index, file).catch((err) => {
                    updateItem(index, {
                      uploadError:
                        err instanceof Error ? err.message : "Upload failed",
                    });
                  });
                }}
              />
              <Button
                variant="secondary"
                onClick={() => fileRefs.current[index]?.click()}
                className="w-auto"
              >
                <span className="text-xs px-1">Upload Image</span>
              </Button>
              <span className="text-[10px] opacity-50">Max 64x64px</span>
            </div>
            {item.uploadError && (
              <Label type="danger">{item.uploadError}</Label>
            )}
          </div>

          {/* Metadata row */}
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1">
              <span className="text-[10px] opacity-70">Marketplace ID</span>
              <div className="w-20">
                <NumberInput
                  value={new Decimal(item.id ?? 0)}
                  maxDecimalPlaces={0}
                  onValueChange={(v) =>
                    updateItem(index, { id: v.toNumber() })
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] opacity-70">Tradeable</span>
              <Checkbox
                checked={item.tradeable}
                onChange={(checked) =>
                  updateItem(index, { tradeable: checked })
                }
              />
            </div>
          </div>
        </InnerPanel>
      ))}

      <Button
        onClick={() =>
          setForm((prev) => ({
            ...prev,
            items: [
              ...prev.items,
              {
                key: "",
                name: "",
                description: "",
                image: "",
                tradeable: false,
                presignedPutUrl: "",
              },
            ],
          }))
        }
      >
        <span className="text-xs">+ Add Item</span>
      </Button>
    </div>
  );

  const renderActionsTab = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <SectionHeader type="vibrant">
          {form.actions.length} Action{form.actions.length !== 1 ? "s" : ""}{" "}
          Defined
        </SectionHeader>
      </div>

      {form.actions.length === 0 && (
        <InnerPanel className="p-4 text-center">
          <p className="text-xs opacity-60 mb-2">
            No actions yet. Actions define the game mechanics: what tokens are
            minted, burned, required, or produced.
          </p>
        </InnerPanel>
      )}

      {form.actions.map((action, index) => {
        const isExpanded = expandedAction === index;
        const ruleCount =
          action.mint.length +
          action.burn.length +
          action.require.length +
          action.requireBelow.length +
          action.requireAbsent.length +
          action.produce.length +
          action.collect.length;

        return (
          <InnerPanel key={`action-${index}`} className="p-3 space-y-2">
            {/* Action header - click to expand/collapse */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() =>
                setExpandedAction(isExpanded ? null : index)
              }
            >
              <img
                src={SUNNYSIDE.icons.arrow_right}
                className="w-3 transition-transform"
                style={{
                  imageRendering: "pixelated",
                  transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                }}
              />
              <div className="flex-1 flex items-center gap-2">
                <Label type="vibrant">
                  {action.id || `Action ${index + 1}`}
                </Label>
                <span className="text-[10px] opacity-50">
                  {ruleCount} rule{ruleCount !== 1 ? "s" : ""}
                </span>
              </div>
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  setForm((prev) => ({
                    ...prev,
                    actions: prev.actions.filter((_, i) => i !== index),
                  }));
                  if (expandedAction === index) setExpandedAction(null);
                }}
                className="w-8"
              >
                <img
                  src={SUNNYSIDE.icons.cancel}
                  className="w-3"
                  style={{ imageRendering: "pixelated" }}
                />
              </Button>
            </div>

            {isExpanded && (
              <div className="space-y-3 mt-2">
                <FieldRow label="Action ID" hint="Unique identifier for this action">
                  <TextInput
                    value={action.id}
                    onValueChange={(v) => updateAction(index, { id: v })}
                    placeholder="harvest, craft, collect..."
                  />
                </FieldRow>

                {/* Require */}
                <TokenAmountEditor
                  title="Require (min balance)"
                  labelType="info"
                  rows={action.require}
                  onChange={(rows) => updateAction(index, { require: rows })}
                />

                {/* Require Below */}
                <TokenAmountEditor
                  title="Require Below (max balance)"
                  labelType="warning"
                  rows={action.requireBelow}
                  amountLabel="Max"
                  onChange={(rows) =>
                    updateAction(index, { requireBelow: rows })
                  }
                />

                {/* Require Absent */}
                <RequireAbsentEditor
                  values={action.requireAbsent}
                  onChange={(values) =>
                    updateAction(index, { requireAbsent: values })
                  }
                />

                {/* Burn */}
                <TokenAmountEditor
                  title="Burn"
                  labelType="danger"
                  rows={action.burn}
                  onChange={(rows) => updateAction(index, { burn: rows })}
                />

                {/* Mint */}
                <MintRuleEditor
                  rows={action.mint}
                  onChange={(rows) => updateAction(index, { mint: rows })}
                />

                {/* Produce */}
                <ProduceRuleEditor
                  rows={action.produce}
                  onChange={(rows) => updateAction(index, { produce: rows })}
                />

                {/* Collect */}
                <TokenAmountEditor
                  title="Collect"
                  labelType="success"
                  rows={action.collect}
                  onChange={(rows) =>
                    updateAction(index, {
                      collect: rows.map((r) => ({
                        token: r.token,
                        amount: r.amount,
                      })),
                    })
                  }
                />
              </div>
            )}
          </InnerPanel>
        );
      })}

      <Button
        onClick={() =>
          setForm((prev) => ({
            ...prev,
            actions: [
              ...prev.actions,
              {
                id: "",
                mint: [],
                burn: [],
                require: [],
                requireBelow: [],
                requireAbsent: [],
                produce: [],
                collect: [],
              },
            ],
          }))
        }
      >
        <span className="text-xs">+ Add Action</span>
      </Button>
    </div>
  );

  const renderDashboardTab = () => (
    <div className="space-y-3">
      {/* Enable toggle */}
      <InnerPanel className="p-3">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={form.dashboard.enabled}
            onChange={(checked) => updateDashboard({ enabled: checked })}
          />
          <span className="text-xs">Enable Dashboard Config</span>
        </div>
      </InnerPanel>

      {form.dashboard.enabled && (
        <>
          {/* Basic dashboard fields */}
          <InnerPanel className="p-3 space-y-2">
            <SectionHeader type="info">Dashboard Settings</SectionHeader>
            <div className="grid grid-cols-2 gap-2">
              <FieldRow label="Display Name">
                <TextInput
                  value={form.dashboard.displayName}
                  onValueChange={(v) => updateDashboard({ displayName: v })}
                  placeholder="My Game"
                />
              </FieldRow>
              <FieldRow label="Visual Theme">
                <TextInput
                  value={form.dashboard.visualTheme}
                  onValueChange={(v) => updateDashboard({ visualTheme: v })}
                  placeholder="default"
                />
              </FieldRow>
            </div>
            <FieldRow
              label="Header Balance Token"
              hint="Token shown in the dashboard header"
            >
              <TextInput
                value={form.dashboard.headerBalanceToken}
                onValueChange={(v) =>
                  updateDashboard({ headerBalanceToken: v })
                }
                placeholder="Coins"
              />
            </FieldRow>
            <FieldRow
              label="Inventory Shortcut Tokens"
              hint="Comma-separated list of token keys"
            >
              <TextInput
                value={form.dashboard.inventoryShortcutTokens}
                onValueChange={(v) =>
                  updateDashboard({ inventoryShortcutTokens: v })
                }
                placeholder="Coins, Gems, Wood"
              />
            </FieldRow>
          </InnerPanel>

          {/* Shop rows */}
          <InnerPanel className="p-3 space-y-2">
            <SectionHeader type="warning">
              Shop ({form.dashboard.shop.length} items)
            </SectionHeader>
            {form.dashboard.shop.map((shopRow, index) => (
              <InnerPanel key={`shop-${index}`} className="p-2 space-y-1">
                <div className="flex items-center justify-between">
                  <Label type="chill">Shop Item {index + 1}</Label>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      updateDashboard({
                        shop: form.dashboard.shop.filter(
                          (_, i) => i !== index,
                        ),
                      })
                    }
                    className="w-8"
                  >
                    <img
                      src={SUNNYSIDE.icons.cancel}
                      className="w-3"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <FieldRow label="ID">
                    <TextInput
                      value={shopRow.id}
                      onValueChange={(v) => updateShopRow(index, { id: v })}
                      placeholder="shop-item-1"
                    />
                  </FieldRow>
                  <FieldRow label="Action ID">
                    <TextInput
                      value={shopRow.actionId}
                      onValueChange={(v) =>
                        updateShopRow(index, { actionId: v })
                      }
                      placeholder="buy-sword"
                    />
                  </FieldRow>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <FieldRow label="Name">
                    <TextInput
                      value={shopRow.name}
                      onValueChange={(v) => updateShopRow(index, { name: v })}
                      placeholder="Iron Sword"
                    />
                  </FieldRow>
                  <FieldRow label="List Image Token">
                    <TextInput
                      value={shopRow.listImageToken}
                      onValueChange={(v) =>
                        updateShopRow(index, { listImageToken: v })
                      }
                      placeholder="IronSword"
                    />
                  </FieldRow>
                </div>
                <FieldRow label="Description">
                  <TextInput
                    value={shopRow.description}
                    onValueChange={(v) =>
                      updateShopRow(index, { description: v })
                    }
                    placeholder="A sturdy blade"
                  />
                </FieldRow>
                <div className="grid grid-cols-3 gap-1">
                  <FieldRow label="Price Token">
                    <TextInput
                      value={shopRow.priceToken}
                      onValueChange={(v) =>
                        updateShopRow(index, { priceToken: v })
                      }
                      placeholder="Coins"
                    />
                  </FieldRow>
                  <FieldRow label="Price Amount">
                    <NumberInput
                      value={new Decimal(shopRow.priceAmount)}
                      maxDecimalPlaces={2}
                      onValueChange={(v) =>
                        updateShopRow(index, { priceAmount: v.toNumber() })
                      }
                    />
                  </FieldRow>
                  <FieldRow label="Owned Token">
                    <TextInput
                      value={shopRow.ownedBalanceToken}
                      onValueChange={(v) =>
                        updateShopRow(index, { ownedBalanceToken: v })
                      }
                      placeholder="Optional"
                    />
                  </FieldRow>
                </div>
              </InnerPanel>
            ))}
            <Button
              variant="secondary"
              onClick={() =>
                updateDashboard({
                  shop: [
                    ...form.dashboard.shop,
                    {
                      id: "",
                      actionId: "",
                      name: "",
                      description: "",
                      listImageToken: "",
                      priceToken: "",
                      priceAmount: 0,
                      ownedBalanceToken: "",
                    },
                  ],
                })
              }
            >
              <span className="text-xs">+ Add Shop Item</span>
            </Button>
          </InnerPanel>

          {/* Production collect mapping */}
          <InnerPanel className="p-3 space-y-2">
            <SectionHeader type="success">
              Production Collect Mapping
            </SectionHeader>
            <p className="text-[10px] opacity-50 -mt-1">
              Map production start action IDs to their collect action IDs
            </p>
            {form.dashboard.productionCollectByStartId.map((entry, index) => (
              <div
                key={`prodmap-${index}`}
                className="grid grid-cols-12 gap-1 items-center"
              >
                <div className="col-span-5">
                  <TextInput
                    value={entry.startId}
                    onValueChange={(v) => {
                      const copy = [
                        ...form.dashboard.productionCollectByStartId,
                      ];
                      copy[index] = { ...copy[index], startId: v };
                      updateDashboard({ productionCollectByStartId: copy });
                    }}
                    placeholder="Start action ID"
                  />
                </div>
                <div className="col-span-1 flex justify-center">
                  <img
                    src={SUNNYSIDE.icons.arrow_right}
                    className="w-3"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <div className="col-span-4">
                  <TextInput
                    value={entry.collectId}
                    onValueChange={(v) => {
                      const copy = [
                        ...form.dashboard.productionCollectByStartId,
                      ];
                      copy[index] = { ...copy[index], collectId: v };
                      updateDashboard({ productionCollectByStartId: copy });
                    }}
                    placeholder="Collect action ID"
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      updateDashboard({
                        productionCollectByStartId:
                          form.dashboard.productionCollectByStartId.filter(
                            (_, i) => i !== index,
                          ),
                      })
                    }
                    className="w-full"
                  >
                    <img
                      src={SUNNYSIDE.icons.cancel}
                      className="w-3"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="secondary"
              onClick={() =>
                updateDashboard({
                  productionCollectByStartId: [
                    ...form.dashboard.productionCollectByStartId,
                    { startId: "", collectId: "" },
                  ],
                })
              }
            >
              <span className="text-xs">+ Add Mapping</span>
            </Button>
          </InnerPanel>
        </>
      )}
    </div>
  );

  const renderPreviewTab = () => {
    const config = formToConfig(form);
    const json = JSON.stringify(config, null, 2);

    return (
      <div className="space-y-2">
        <InnerPanel className="p-3">
          <SectionHeader type="formula">JSON Preview</SectionHeader>
          <pre
            className="text-[10px] leading-relaxed overflow-x-auto max-h-[50vh] whitespace-pre font-mono bg-black/20 p-2 rounded"
            style={{ color: "#f0e4d4" }}
          >
            {json}
          </pre>
        </InnerPanel>
      </div>
    );
  };

  /* ── Tab definitions ─── */

  const tabs: { id: EditorTab; icon: string; name: string }[] = [
    { id: "basics", icon: SUNNYSIDE.icons.expression_chat, name: "Basics" },
    { id: "items", icon: SUNNYSIDE.icons.basket, name: "Items" },
    { id: "actions", icon: SUNNYSIDE.icons.lightning, name: "Actions" },
    { id: "dashboard", icon: SUNNYSIDE.icons.hammer, name: "Dashboard" },
    { id: "preview", icon: SUNNYSIDE.icons.search, name: "Preview" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "basics":
        return renderBasicsTab();
      case "items":
        return renderItemsTab();
      case "actions":
        return renderActionsTab();
      case "dashboard":
        return renderDashboardTab();
      case "preview":
        return renderPreviewTab();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with tabs */}
      <OuterPanel hasTabs className="flex-1 overflow-hidden flex flex-col relative">
        {/* Tab bar */}
        <div
          className="absolute flex"
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            left: `0px`,
            right: `${PIXEL_SCALE * 1}px`,
          }}
        >
          <div className="flex overflow-x-auto scrollbar-hide mr-auto">
            {tabs.map((tab, index) => (
              <Tab
                key={tab.id}
                isFirstTab={index === 0}
                className="relative mr-1"
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                <SquareIcon icon={tab.icon} width={7} />
                <span className="text-xs sm:text-sm text-ellipsis ml-1 whitespace-nowrap">
                  {tab.name}
                </span>
              </Tab>
            ))}
          </div>
          {/* Back button */}
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="flex-none cursor-pointer float-right hover:brightness-90"
            onClick={onBack}
            style={{
              width: `${PIXEL_SCALE * 11}px`,
              height: `${PIXEL_SCALE * 11}px`,
              marginTop: `${PIXEL_SCALE * 1}px`,
              marginRight: `${PIXEL_SCALE * 1}px`,
              imageRendering: "pixelated",
            }}
          />
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto scrollable p-2 pb-20">
          {renderTabContent()}
        </div>
      </OuterPanel>

      {/* Sticky footer with save + error */}
      <div className="mt-1">
        {error && (
          <Label type="danger" className="mb-1">
            {error}
          </Label>
        )}
        <Button disabled={saving} onClick={() => onSave(form)}>
          {saving
            ? "Saving..."
            : mode === "create"
              ? "Create Minigame"
              : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

/* ─── List view ────────────────────────────────────────────────── */

export const MinigameEditor: React.FC = () => {
  const navigate = useNavigate();
  const { loadRows } = useEditorApi();
  const [rows, setRows] = useState<MinigameConfigRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await loadRows();
        if (!mounted) return;
        setRows(data);
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, [loadRows]);

  return (
    <div className="p-2 pb-16 space-y-2 relative h-full">
      <Panel className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <Label type="vibrant" icon={SUNNYSIDE.icons.hammer}>
            Minigame Editor
          </Label>
        </div>

        {loading && (
          <InnerPanel className="p-3 text-center">
            <p className="text-xs animate-pulse">Loading your minigames...</p>
          </InnerPanel>
        )}

        {error && <Label type="danger">{error}</Label>}

        {!loading && rows.length === 0 && (
          <InnerPanel className="p-4 text-center">
            <p className="text-xs opacity-60 mb-1">
              You haven't created any minigames yet.
            </p>
            <p className="text-[10px] opacity-40">
              Create your first one to get started!
            </p>
          </InnerPanel>
        )}

        <div className="space-y-1 mt-2">
          {rows.map((row) => (
            <ButtonPanel
              key={row.slug}
              onClick={() => navigate(`/minigame-editor/edit/${row.slug}`)}
              className="p-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold">{row.slug}</div>
                  <div className="text-[10px] opacity-60">
                    Updated: {new Date(row.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <img
                  src={SUNNYSIDE.icons.arrow_right}
                  className="w-3"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            </ButtonPanel>
          ))}
        </div>
      </Panel>

      <div className="fixed bottom-2 left-0 right-0 px-2 z-10">
        <Button
          className="w-full"
          onClick={() => navigate("/minigame-editor/create")}
        >
          <span className="text-sm">+ Create New Minigame</span>
        </Button>
      </div>
    </div>
  );
};

/* ─── Create view ──────────────────────────────────────────────── */

export const MinigameEditorCreate: React.FC = () => {
  const navigate = useNavigate();
  const { submitEvent } = useEditorApi();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSave = async (form: EditorFormState) => {
    setSaving(true);
    setError(null);
    try {
      const slug = form.slug.trim();
      if (!slug) throw new Error("Slug is required");
      await submitEvent({
        type: "minigame.created",
        slug,
        config: formToConfig(form),
      });
      navigate("/minigame-editor");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create minigame");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full overflow-hidden p-2">
      <MinigameEditorForm
        mode="create"
        initial={EMPTY_FORM}
        saving={saving}
        error={error}
        onSave={onSave}
        onBack={() => navigate("/minigame-editor")}
      />
    </div>
  );
};

/* ─── Edit view ────────────────────────────────────────────────── */

export const MinigameEditorEdit: React.FC = () => {
  const navigate = useNavigate();
  const { slug = "" } = useParams<{ slug: string }>();
  const { loadRows, submitEvent } = useEditorApi();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initial, setInitial] = useState<EditorFormState | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const rows = await loadRows();
        const row = rows.find((entry) => entry.slug === slug);
        if (!row) throw new Error("Minigame not found");
        if (!mounted) return;
        setInitial(configToForm(row.slug, row.config));
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Failed to load minigame");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (slug) void load();
    return () => {
      mounted = false;
    };
  }, [loadRows, slug]);

  const onSave = async (form: EditorFormState) => {
    setSaving(true);
    setError(null);
    try {
      await submitEvent({
        type: "minigame.edited",
        slug,
        config: formToConfig(form),
      });
      navigate("/minigame-editor");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update minigame");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-2">
        <Panel className="p-3 text-center">
          <p className="text-xs animate-pulse">Loading minigame...</p>
        </Panel>
      </div>
    );
  }

  if (!initial) {
    return (
      <div className="p-2 space-y-2">
        <Panel className="p-3 space-y-2">
          {error && <Label type="danger">{error}</Label>}
          <Button onClick={() => navigate("/minigame-editor")}>
            Back to List
          </Button>
        </Panel>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden p-2">
      <MinigameEditorForm
        mode="edit"
        initial={initial}
        saving={saving}
        error={error}
        onSave={onSave}
        onBack={() => navigate("/minigame-editor")}
      />
    </div>
  );
};
