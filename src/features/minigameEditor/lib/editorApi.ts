import type { MinigameConfig } from "features/minigame/lib/types";
import {
  migrateLegacyMinigameConfigFields,
  type MinigameConfigWithLegacy,
} from "features/minigame/lib/minigameConfigMigration";
import type { MinigameConfigRow } from "./types";

/** POST /event/:farmId body.event */
export type MinigameEditorClientEvent =
  | { type: "minigame.created"; slug: string; config?: MinigameConfig }
  | { type: "minigame.edited"; slug: string; config: MinigameConfig }
  | { type: "minigame.removed"; slug: string };

/** Parsed from POST /event/:farmId JSON (same envelope as other game effects). */
export type MinigameEditorEventResult = {
  gameState?: unknown;
  data?: unknown;
  /** When API echoes the saved document */
  savedConfig?: MinigameConfig;
  savedRow?: MinigameConfigRow;
};

export function getMinigameEditorDataType(): string {
  return (
    (import.meta.env.VITE_MINIGAME_EDITOR_DATA_TYPE as string | undefined)?.trim() ||
    "minigame-editor"
  );
}

export function getMinigameEditorUploadDataType(): string {
  return (
    (import.meta.env.VITE_MINIGAME_EDITOR_UPLOAD_DATA_TYPE as string | undefined)?.trim() ||
    "minigameEditorUpload"
  );
}

export function ensureMinigameConfig(raw: unknown): MinigameConfig {
  const base =
    raw && typeof raw === "object"
      ? (raw as Partial<MinigameConfigWithLegacy>)
      : {};

  const actions =
    base.actions &&
    typeof base.actions === "object" &&
    !Array.isArray(base.actions)
      ? base.actions
      : {};

  const items =
    base.items &&
    typeof base.items === "object" &&
    !Array.isArray(base.items)
      ? base.items
      : undefined;

  const input: MinigameConfigWithLegacy = {
    actions,
    ...(items ? { items } : {}),
    ...(base.descriptions ? { descriptions: base.descriptions } : {}),
    ...(base.visualTheme ? { visualTheme: base.visualTheme } : {}),
    ...(base.playUrl ? { playUrl: base.playUrl } : {}),
    ...(base.initialBalances ? { initialBalances: base.initialBalances } : {}),
    ...(base.productionCollectByStartId
      ? { productionCollectByStartId: base.productionCollectByStartId }
      : {}),
    ...(base.dashboard ? { dashboard: base.dashboard } : {}),
  };

  return migrateLegacyMinigameConfigFields(input);
}

export function toMinigameConfigRow(raw: unknown): MinigameConfigRow | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.slug !== "string" || !r.slug.trim()) return null;
  return {
    slug: r.slug.trim(),
    farmId: Number(r.farmId ?? 0),
    createdAt:
      typeof r.createdAt === "string"
        ? r.createdAt
        : new Date().toISOString(),
    updatedAt:
      typeof r.updatedAt === "string"
        ? r.updatedAt
        : new Date().toISOString(),
    config: ensureMinigameConfig(r.config),
  };
}

export function parseMinigameEditorListBody(body: unknown): MinigameConfigRow[] {
  if (Array.isArray(body)) {
    return body
      .map((x) => toMinigameConfigRow(x))
      .filter((x): x is MinigameConfigRow => x != null);
  }
  if (body && typeof body === "object") {
    const o = body as Record<string, unknown>;
    const inner =
      o.data ?? o.minigameConfigs ?? o.configs ?? o.rows ?? o.items;
    if (Array.isArray(inner)) {
      return inner
        .map((x) => toMinigameConfigRow(x))
        .filter((x): x is MinigameConfigRow => x != null);
    }
  }
  return [];
}

export function extractSavedEditorFromEventData(
  data: unknown,
): Pick<MinigameEditorEventResult, "savedConfig" | "savedRow"> {
  if (!data || typeof data !== "object") return {};
  const d = data as Record<string, unknown>;
  const rowRaw =
    d.minigameEditorRow ?? d.minigameConfigRow ?? d.editorRow ?? d.row;
  const row = toMinigameConfigRow(rowRaw) ?? undefined;
  const configRaw = d.config ?? d.minigameConfig;
  const config =
    configRaw !== undefined && configRaw !== null
      ? ensureMinigameConfig(configRaw)
      : row?.config;
  return {
    savedRow: row,
    savedConfig: config,
  };
}
