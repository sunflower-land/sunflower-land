import React, { useCallback, useEffect, useMemo, useState } from "react";
import { InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { TextInput } from "components/ui/TextInput";
import { Dropdown } from "components/ui/Dropdown";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SectionHeader } from "../components/SectionHeader";
import type {
  EconomyPlayerRow,
  EconomyPlayersResponse,
  EconomySuppliesResponse,
} from "../lib/types";
import { useEditorApi } from "../lib/useEditorApi";

const LIMIT_OPTIONS = ["10", "25", "50", "100"];
const DEFAULT_LIMIT = 50;

const TEXT = "text-xs text-[#3e2731]";
const TABLE_WRAP =
  "w-full overflow-x-auto rounded-sm border-2 border-[#3e2731]/25 bg-[#f5f0e6]";
const TABLE = "min-w-full text-left text-xs font-[Teeny]";
const TH =
  "px-2 py-1 font-semibold border-b-2 border-[#3e2731]/25 whitespace-nowrap bg-[#e9e0c9]";
const TD = "px-2 py-1 border-b border-[#3e2731]/10 whitespace-nowrap";

function formatNum(n: number): string {
  if (!Number.isFinite(n)) return "0";
  return Math.floor(n).toLocaleString();
}

function objectSize(obj: unknown): number {
  if (!obj || typeof obj !== "object") return 0;
  return Object.keys(obj as Record<string, unknown>).length;
}

function shortDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toISOString().replace("T", " ").slice(0, 16);
}

function downloadJson(filename: string, payload: unknown): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const SuppliesSection: React.FC<{ slug: string }> = ({ slug }) => {
  const { t } = useAppTranslation();
  const { loadSupplies } = useEditorApi();
  const [data, setData] = useState<EconomySuppliesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!slug.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await loadSupplies(slug);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [slug, loadSupplies]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <InnerPanel className="p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <SectionHeader type="default" icon={SUNNYSIDE.icons.basket}>
          {t("playerEconomyEditor.dataTab.suppliesHeading")}
        </SectionHeader>
        <Button className="w-auto text-xs" onClick={refresh} disabled={loading}>
          {loading
            ? t("playerEconomyEditor.dataTab.loading")
            : t("playerEconomyEditor.dataTab.refresh")}
        </Button>
      </div>

      {error && (
        <Label type="danger" className="mb-1">
          {error}
        </Label>
      )}

      {!data && !loading && !error && (
        <p className={TEXT}>{t("playerEconomyEditor.dataTab.suppliesEmpty")}</p>
      )}

      {data && data.supplies.length === 0 && !loading && (
        <p className={TEXT}>{t("playerEconomyEditor.dataTab.suppliesEmpty")}</p>
      )}

      {data && data.supplies.length > 0 && (
        <div className={TABLE_WRAP}>
          <table className={TABLE}>
            <thead>
              <tr>
                <th className={TH}>
                  {t("playerEconomyEditor.dataTab.col.itemId")}
                </th>
                <th className={TH}>
                  {t("playerEconomyEditor.dataTab.col.itemName")}
                </th>
                <th className={TH}>
                  {t("playerEconomyEditor.dataTab.col.supplyCount")}
                </th>
                <th className={TH}>
                  {t("playerEconomyEditor.dataTab.col.supplyMax")}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.supplies.map((row) => (
                <tr key={row.itemId}>
                  <td className={TD}>{row.itemId}</td>
                  <td className={TD}>{row.name || "—"}</td>
                  <td className={TD}>{formatNum(row.count)}</td>
                  <td className={TD}>
                    {row.maxSupply !== undefined
                      ? formatNum(row.maxSupply)
                      : "∞"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </InnerPanel>
  );
};

const PlayerRowItem: React.FC<{ player: EconomyPlayerRow }> = ({ player }) => {
  const { t } = useAppTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="cursor-pointer hover:bg-[#e9e0c9]/60"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className={TD}>{expanded ? "▼" : "▶"}</td>
        <td className={TD}>{player.farmId}</td>
        <td className={TD}>{formatNum(player.activity)}</td>
        <td className={TD}>{formatNum(player.dailyActivity?.count ?? 0)}</td>
        <td className={TD}>
          {player.highscore !== undefined ? formatNum(player.highscore) : "—"}
        </td>
        <td className={TD}>{objectSize(player.balances)}</td>
        <td className={TD}>{objectSize(player.generating)}</td>
        <td className={TD}>{objectSize(player.rules)}</td>
        <td className={TD}>{objectSize(player.exchangeCompletions)}</td>
        <td className={TD}>{shortDate(player.updatedAt)}</td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={10} className="px-2 py-2 bg-[#f5f0e6]/60">
            <div className="text-[10px] opacity-60 mb-1">
              {t("playerEconomyEditor.dataTab.fullPayload")}
            </div>
            <pre className="text-[11px] font-mono whitespace-pre-wrap break-all bg-[#f5f0e6] border border-[#3e2731]/20 rounded-sm p-2 overflow-x-auto">
              {JSON.stringify(player, null, 2)}
            </pre>
          </td>
        </tr>
      )}
    </>
  );
};

const PlayersSection: React.FC<{ slug: string }> = ({ slug }) => {
  const { t } = useAppTranslation();
  const { loadPlayers } = useEditorApi();

  const [limit, setLimit] = useState<number>(DEFAULT_LIMIT);
  const [skip, setSkip] = useState<number>(0);
  const [farmIdInput, setFarmIdInput] = useState<string>("");
  const [appliedFarmId, setAppliedFarmId] = useState<number | undefined>(
    undefined,
  );
  const [data, setData] = useState<EconomyPlayersResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!slug.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await loadPlayers(slug, {
        limit,
        skip: appliedFarmId !== undefined ? 0 : skip,
        targetFarmId: appliedFarmId,
      });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [slug, limit, skip, appliedFarmId, loadPlayers]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const { page, totalPages } = useMemo(() => {
    if (!data || appliedFarmId !== undefined) {
      return { page: 1, totalPages: 1 };
    }
    const p = Math.floor(skip / Math.max(1, limit)) + 1;
    const tp = Math.max(1, Math.ceil(data.total / Math.max(1, limit)));
    return { page: p, totalPages: tp };
  }, [data, skip, limit, appliedFarmId]);

  const canGoPrev = appliedFarmId === undefined && skip > 0;
  const canGoNext = appliedFarmId === undefined && Boolean(data?.hasMore);

  const handlePrev = () => {
    if (!canGoPrev) return;
    setSkip((prev) => Math.max(0, prev - limit));
  };

  const handleNext = () => {
    if (!canGoNext) return;
    setSkip((prev) => prev + limit);
  };

  const handleLimitChange = (next: string) => {
    const parsed = Number(next);
    if (!Number.isFinite(parsed) || parsed < 1) return;
    setLimit(parsed);
    setSkip(0);
  };

  const handleFarmIdSubmit = () => {
    const trimmed = farmIdInput.trim();
    if (!trimmed) {
      setAppliedFarmId(undefined);
      setSkip(0);
      return;
    }
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError(t("playerEconomyEditor.dataTab.farmIdInvalid"));
      return;
    }
    setAppliedFarmId(Math.floor(parsed));
    setSkip(0);
  };

  const handleClearFarmId = () => {
    setFarmIdInput("");
    setAppliedFarmId(undefined);
    setSkip(0);
  };

  const handleDownload = () => {
    if (!data) return;
    const suffix =
      appliedFarmId !== undefined
        ? `farm-${appliedFarmId}`
        : `page-${page}`;
    downloadJson(`${slug || "economy"}-players-${suffix}.json`, data);
  };

  return (
    <InnerPanel className="p-3 space-y-2">
      <SectionHeader type="default" icon={SUNNYSIDE.icons.player}>
        {t("playerEconomyEditor.dataTab.playersHeading")}
      </SectionHeader>

      <div className="flex flex-wrap items-end gap-2">
        <div className="flex-1 min-w-[180px]">
          <div className="text-[10px] opacity-60 mb-1">
            {t("playerEconomyEditor.dataTab.farmIdSearchLabel")}
          </div>
          <div className="flex gap-1">
            <TextInput
              value={farmIdInput}
              onValueChange={setFarmIdInput}
              placeholder={t("playerEconomyEditor.dataTab.farmIdPlaceholder")}
              icon={SUNNYSIDE.icons.search}
            />
          </div>
          <div className="flex gap-1 mt-1">
            <Button
              className="text-xs flex-1"
              onClick={handleFarmIdSubmit}
              disabled={loading}
            >
              {t("playerEconomyEditor.dataTab.search")}
            </Button>
            {appliedFarmId !== undefined && (
              <Button
                className="text-xs flex-1"
                onClick={handleClearFarmId}
                disabled={loading}
              >
                {t("playerEconomyEditor.dataTab.clear")}
              </Button>
            )}
          </div>
        </div>

        <div className="w-[110px]">
          <div className="text-[10px] opacity-60 mb-1">
            {t("playerEconomyEditor.dataTab.limitLabel")}
          </div>
          <Dropdown
            options={LIMIT_OPTIONS}
            value={String(limit)}
            onChange={handleLimitChange}
          />
        </div>

        <div className="flex gap-1">
          <Button
            className="text-xs"
            onClick={handleDownload}
            disabled={!data || loading}
          >
            {t("playerEconomyEditor.dataTab.download")}
          </Button>
          <Button className="text-xs" onClick={refresh} disabled={loading}>
            {loading
              ? t("playerEconomyEditor.dataTab.loading")
              : t("playerEconomyEditor.dataTab.refresh")}
          </Button>
        </div>
      </div>

      {error && (
        <Label type="danger" className="mb-1">
          {error}
        </Label>
      )}

      {data && (
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="opacity-70">
            {appliedFarmId !== undefined
              ? t("playerEconomyEditor.dataTab.searchingFarmId", {
                  farmId: appliedFarmId,
                })
              : t("playerEconomyEditor.dataTab.pagination", {
                  page,
                  totalPages,
                  total: data.total,
                })}
          </div>
          <div className="flex gap-1">
            <Button
              className="text-xs w-auto px-2"
              onClick={handlePrev}
              disabled={!canGoPrev || loading}
            >
              ◀
            </Button>
            <Button
              className="text-xs w-auto px-2"
              onClick={handleNext}
              disabled={!canGoNext || loading}
            >
              ▶
            </Button>
          </div>
        </div>
      )}

      {data && data.players.length === 0 && !loading && (
        <p className={TEXT}>
          {t("playerEconomyEditor.dataTab.playersEmpty")}
        </p>
      )}

      {data && data.players.length > 0 && (
        <div className={TABLE_WRAP}>
          <table className={TABLE}>
            <thead>
              <tr>
                <th className={TH} />
                <th className={TH}>
                  {t("playerEconomyEditor.dataTab.col.farmId")}
                </th>
                <th className={TH}>
                  {t("playerEconomyEditor.dataTab.col.activity")}
                </th>
                <th className={TH}>
                  {t("playerEconomyEditor.dataTab.col.dailyActivity")}
                </th>
                <th className={TH}>
                  {t("playerEconomyEditor.dataTab.col.highscore")}
                </th>
                <th className={TH}>
                  {t("playerEconomyEditor.dataTab.col.balances")}
                </th>
                <th className={TH}>
                  {t("playerEconomyEditor.dataTab.col.generating")}
                </th>
                <th className={TH}>
                  {t("playerEconomyEditor.dataTab.col.rules")}
                </th>
                <th className={TH}>
                  {t("playerEconomyEditor.dataTab.col.exchangeCompletions")}
                </th>
                <th className={TH}>
                  {t("playerEconomyEditor.dataTab.col.updatedAt")}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.players.map((p) => (
                <PlayerRowItem
                  key={`${p.farmId}-${p.playerEconomySlug}`}
                  player={p}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </InnerPanel>
  );
};

export const DataTab: React.FC<{ slug: string }> = ({ slug }) => {
  const { t } = useAppTranslation();

  if (!slug.trim()) {
    return (
      <InnerPanel className="p-3">
        <p className={TEXT}>
          {t("playerEconomyEditor.dataTab.slugRequired")}
        </p>
      </InnerPanel>
    );
  }

  return (
    <div className="space-y-3">
      <SuppliesSection slug={slug} />
      <PlayersSection slug={slug} />
    </div>
  );
};
