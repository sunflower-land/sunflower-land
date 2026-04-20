import type { PlayerEconomyConfig } from "features/minigame/lib/types";
import {
  migrateLegacyPlayerEconomyConfigFields,
  type PlayerEconomyConfigWithLegacy,
} from "features/minigame/lib/minigameConfigMigration";
import type { PlayerEconomyConfigRow } from "./types";

/** Returned in 400 `errorCode` when cache refresh was used within the cooldown window. */
export const ECONOMY_INVALIDATE_COOLDOWN_ERROR_CODE =
  "ECONOMY_INVALIDATE_COOLDOWN";

/** POST /event/:farmId body.event */
export type PlayerEconomyEditorClientEvent =
  | {
      type: "playerEconomy.created";
      slug: string;
      config?: PlayerEconomyConfig;
    }
  | { type: "playerEconomy.edited"; slug: string; config: PlayerEconomyConfig }
  | { type: "playerEconomy.removed"; slug: string }
  | {
      type: "economy.prepare-upload";
      slug: string;
      files: { path: string; contentType: string }[];
    }
  | { type: "economy.invalidated"; slug: string };

/** Parsed from POST /event/:farmId JSON (same envelope as other game effects). */
export type PlayerEconomyEditorEventResult = {
  gameState?: unknown;
  data?: unknown;
  /** When API echoes the saved document */
  savedConfig?: PlayerEconomyConfig;
  savedRow?: PlayerEconomyConfigRow;
};

export function getPlayerEconomyEditorDataType(): string {
  return (
    (
      import.meta.env.VITE_PLAYER_ECONOMY_EDITOR_DATA_TYPE as string | undefined
    )?.trim() ||
    (
      import.meta.env.VITE_MINIGAME_EDITOR_DATA_TYPE as string | undefined
    )?.trim() ||
    "economy-editor"
  );
}

export function getPlayerEconomyEditorUploadDataType(): string {
  return (
    (
      import.meta.env.VITE_PLAYER_ECONOMY_EDITOR_UPLOAD_DATA_TYPE as
        | string
        | undefined
    )?.trim() ||
    (
      import.meta.env.VITE_MINIGAME_EDITOR_UPLOAD_DATA_TYPE as
        | string
        | undefined
    )?.trim() ||
    "economyEditorUpload"
  );
}

export function ensurePlayerEconomyConfig(raw: unknown): PlayerEconomyConfig {
  const base =
    raw && typeof raw === "object"
      ? (raw as Partial<PlayerEconomyConfigWithLegacy>)
      : {};

  const actions =
    base.actions &&
    typeof base.actions === "object" &&
    !Array.isArray(base.actions)
      ? base.actions
      : {};

  const items =
    base.items && typeof base.items === "object" && !Array.isArray(base.items)
      ? base.items
      : undefined;

  const input: PlayerEconomyConfigWithLegacy = {
    actions,
    ...(items ? { items } : {}),
    ...(base.descriptions ? { descriptions: base.descriptions } : {}),
    ...(base.visualTheme ? { visualTheme: base.visualTheme } : {}),
    ...(base.playUrl ? { playUrl: base.playUrl } : {}),
    ...(typeof base.mainCurrencyToken === "string" &&
    base.mainCurrencyToken.trim()
      ? { mainCurrencyToken: base.mainCurrencyToken.trim() }
      : {}),
    ...(base.initialBalances ? { initialBalances: base.initialBalances } : {}),
    ...(base.productionCollectByStartId
      ? { productionCollectByStartId: base.productionCollectByStartId }
      : {}),
    ...(base.dashboard ? { dashboard: base.dashboard } : {}),
    ...(base.purchases &&
    typeof base.purchases === "object" &&
    !Array.isArray(base.purchases)
      ? { purchases: base.purchases as PlayerEconomyConfig["purchases"] }
      : {}),
    ...(typeof base.enabled === "boolean" ? { enabled: base.enabled } : {}),
  };

  return migrateLegacyPlayerEconomyConfigFields(input);
}

function parseHostedSiteIndexObject(
  raw: unknown,
): PlayerEconomyConfigRow["hostedSiteIndex"] {
  if (raw === null) return null;
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const bucket = typeof o.bucket === "string" ? o.bucket.trim() : "";
  const key = typeof o.key === "string" ? o.key.trim() : "";
  const lastModified =
    typeof o.lastModified === "string" ? o.lastModified.trim() : "";
  if (!bucket || !key || !lastModified) return null;
  return { bucket, key, lastModified };
}

export function toPlayerEconomyConfigRow(
  raw: unknown,
): PlayerEconomyConfigRow | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.slug !== "string" || !r.slug.trim()) return null;

  let hostedSiteIndex: PlayerEconomyConfigRow["hostedSiteIndex"] = undefined;
  if ("hostedSiteIndex" in r) {
    const v = r.hostedSiteIndex;
    hostedSiteIndex =
      v === null ? null : (parseHostedSiteIndexObject(v) ?? null);
  }

  const invalidatedAt =
    typeof r.invalidatedAt === "string" && r.invalidatedAt.trim()
      ? r.invalidatedAt.trim()
      : undefined;

  return {
    slug: r.slug.trim(),
    farmId: Number(r.farmId ?? 0),
    createdAt:
      typeof r.createdAt === "string" ? r.createdAt : new Date().toISOString(),
    updatedAt:
      typeof r.updatedAt === "string" ? r.updatedAt : new Date().toISOString(),
    config: ensurePlayerEconomyConfig(r.config),
    ...(hostedSiteIndex !== undefined ? { hostedSiteIndex } : {}),
    ...(invalidatedAt !== undefined ? { invalidatedAt } : {}),
  };
}

export function parsePlayerEconomyEditorListBody(
  body: unknown,
): PlayerEconomyConfigRow[] {
  if (Array.isArray(body)) {
    return body
      .map((x) => toPlayerEconomyConfigRow(x))
      .filter((x): x is PlayerEconomyConfigRow => x != null);
  }
  if (body && typeof body === "object") {
    const o = body as Record<string, unknown>;
    const inner = o.data ?? o.minigameConfigs ?? o.configs ?? o.rows ?? o.items;
    if (Array.isArray(inner)) {
      return inner
        .map((x) => toPlayerEconomyConfigRow(x))
        .filter((x): x is PlayerEconomyConfigRow => x != null);
    }
  }
  return [];
}

export function extractSavedEditorFromEventData(
  data: unknown,
): Pick<PlayerEconomyEditorEventResult, "savedConfig" | "savedRow"> {
  if (!data || typeof data !== "object") return {};
  const d = data as Record<string, unknown>;
  const rowRaw =
    d.playerEconomyEditorRow ??
    d.minigameEditorRow ??
    d.minigameConfigRow ??
    d.editorRow ??
    d.row;
  const row = toPlayerEconomyConfigRow(rowRaw) ?? undefined;
  const configRaw = d.config ?? d.minigameConfig;
  const config =
    configRaw !== undefined && configRaw !== null
      ? ensurePlayerEconomyConfig(configRaw)
      : row?.config;
  return {
    savedRow: row,
    savedConfig: config,
  };
}
