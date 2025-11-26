import React, { useState } from "react";

import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Dropdown } from "components/ui/Dropdown";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { EconomyReportSummary } from "../actions/getEconomyData";
import { getKeys } from "features/game/lib/crafting";
import { KNOWN_IDS } from "features/game/types";
import { downloadCsv } from "../utils/downloadCsv";

interface Props {
  reports: EconomyReportSummary[];
  startDate?: string;
}

type ResourceHistoryRow = {
  date: string;
  supply?: number;
  supplyDiff?: number;
  distribution?: number;
  distributionDiff?: number;
};

export const ResourceSection: React.FC<Props> = ({ reports, startDate }) => {
  const { t } = useAppTranslation();
  const [selectedResource, setSelectedResource] = useState("");

  const options = getKeys(KNOWN_IDS);

  const normalizedResource = selectedResource.trim();
  const resourceLabel =
    normalizedResource || t("economyDashboard.resourceUnset");

  const formatRecordValue = (value?: string | number) => {
    if (value === undefined || value === null) return "-";

    if (typeof value === "number") {
      return value.toLocaleString();
    }

    if (/^-?\d+(\.\d+)?$/.test(value)) {
      const numericValue = Number(value);
      return numericValue.toLocaleString();
    }

    return value;
  };

  const formatDiffValue = (value?: number) => {
    if (value === undefined || value === null) return "-";
    if (value === 0) return "0";

    const formatted = Math.abs(value).toLocaleString();
    return value > 0 ? `+${formatted}` : `-${formatted}`;
  };

  const parseNumericValue = (value?: string | number) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === "number") return value;

    if (/^-?\d+(\.\d+)?$/.test(value)) {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? undefined : parsed;
    }

    return undefined;
  };

  const history: ResourceHistoryRow[] = !normalizedResource
    ? []
    : (() => {
        const entries = reports
          .map((report) => ({
            date: report.reportDate,
            supply: parseNumericValue(
              report.farm.collectibles.totals?.[normalizedResource],
            ),
            distribution: parseNumericValue(
              report.farm.collectibles.holders?.[normalizedResource],
            ),
          }))
          .filter(
            (entry) =>
              entry.date &&
              (entry.supply !== undefined || entry.distribution !== undefined),
          )
          .sort((a, b) => (a.date! < b.date! ? -1 : 1));

        const withDiff: ResourceHistoryRow[] = entries.map((entry, index) => {
          const prev = entries[index - 1];
          return {
            ...entry,
            supplyDiff:
              entry.supply !== undefined && prev?.supply !== undefined
                ? entry.supply - prev.supply
                : undefined,
            distributionDiff:
              entry.distribution !== undefined &&
              prev?.distribution !== undefined
                ? entry.distribution - prev.distribution
                : undefined,
          };
        });

        return withDiff
          .filter((entry) => !startDate || entry.date >= startDate)
          .sort((a, b) => (a.date! < b.date! ? 1 : -1));
      })();

  const canExportHistory = Boolean(normalizedResource && history.length > 0);

  const handleExportCsv = () => {
    if (!canExportHistory) return;

    const headers = [
      t("economyDashboard.historyDate"),
      t("economyDashboard.supplyColumn"),
      t("economyDashboard.diffColumn"),
      t("economyDashboard.distributionColumn"),
      t("economyDashboard.diffColumn"),
    ];

    const rows = history.map(
      ({ date, supply, supplyDiff, distribution, distributionDiff }) => [
        date || t("economyDashboard.unknownDate"),
        formatRecordValue(supply),
        formatDiffValue(supplyDiff),
        formatRecordValue(distribution),
        formatDiffValue(distributionDiff),
      ],
    );

    downloadCsv(
      [headers, ...rows].map((row) =>
        row.map((value) =>
          value === undefined || value === null ? "" : String(value),
        ),
      ),
      `resource-${normalizedResource}-${Date.now()}.csv`,
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <InnerPanel className="flex flex-col gap-2">
        <Label type="default" className="mb-1">
          {t("economyDashboard.resource")}
        </Label>
        <Dropdown
          options={options}
          value={selectedResource || undefined}
          onChange={setSelectedResource}
          placeholder={t("economyDashboard.resourcePlaceholder")}
          showSearch
          maxHeight={8}
        />
      </InnerPanel>

      <InnerPanel className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <Label type="default">
            {t("economyDashboard.historyTitle", {
              resource: resourceLabel,
            })}
          </Label>
          <Button
            className="w-full md:w-auto"
            onClick={handleExportCsv}
            disabled={!canExportHistory}
          >
            {t("economyDashboard.exportCsv")}
          </Button>
        </div>
        {!normalizedResource && (
          <p className="text-xs text-white">
            {t("economyDashboard.resourceRequired")}
          </p>
        )}
        {normalizedResource && history.length === 0 && (
          <p className="text-xs text-white">
            {t("economyDashboard.noHistory")}
          </p>
        )}
        {normalizedResource && history.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left border-b border-[#b96f50]">
                  <th className="py-1 pr-2">
                    {t("economyDashboard.historyDate")}
                  </th>
                  <th className="py-1 pr-2">
                    {t("economyDashboard.supplyColumn")}
                  </th>
                  <th className="py-1 pr-2">
                    {t("economyDashboard.diffColumn")}
                  </th>
                  <th className="py-1">
                    {t("economyDashboard.distributionColumn")}
                  </th>
                  <th className="py-1">{t("economyDashboard.diffColumn")}</th>
                </tr>
              </thead>
              <tbody>
                {history.map(
                  ({
                    date,
                    supply,
                    distribution,
                    supplyDiff,
                    distributionDiff,
                  }) => (
                    <tr
                      key={`${date}-${supply ?? "nos"}-${distribution ?? "nod"}`}
                      className="border-b border-[#b96f50] last:border-b-0"
                    >
                      <td className="py-1 pr-2 whitespace-nowrap">
                        {date || t("economyDashboard.unknownDate")}
                      </td>
                      <td className="py-1 pr-2">{formatRecordValue(supply)}</td>
                      <td className="py-1 pr-2">
                        {formatDiffValue(supplyDiff)}
                      </td>
                      <td className="py-1">
                        {formatRecordValue(distribution)}
                      </td>
                      <td className="py-1">
                        {formatDiffValue(distributionDiff)}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </InnerPanel>
    </div>
  );
};
