import React, { useMemo, useState } from "react";

import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Dropdown } from "components/ui/Dropdown";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { EconomyReportSummary } from "../actions/getEconomyData";
import { downloadCsv } from "../utils/downloadCsv";

interface Props {
  reports: EconomyReportSummary[];
  startDate?: string;
}

export const AnalyticsSection: React.FC<Props> = ({ reports, startDate }) => {
  const { t } = useAppTranslation();
  const activityOptions = useMemo(() => {
    const activitySet = new Set<string>();
    reports.forEach((report) => {
      Object.keys(report.farm.activity?.totals ?? {}).forEach((activity) =>
        activitySet.add(activity),
      );
    });
    return Array.from(activitySet).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" }),
    );
  }, [reports]);

  const [selectedActivity, setSelectedActivity] = useState("");

  const effectiveActivity = useMemo(() => {
    if (activityOptions.length === 0) return "";

    if (!selectedActivity || !activityOptions.includes(selectedActivity)) {
      return activityOptions[0];
    }

    return selectedActivity;
  }, [activityOptions, selectedActivity]);

  const normalizedActivity = effectiveActivity.trim();
  const hasOptions = activityOptions.length > 0;

  const formatDiffValue = (value?: number) => {
    if (value === undefined || value === null) return "-";
    if (value === 0) return "0";

    const formatted = Math.abs(value).toLocaleString();
    return value > 0 ? `+${formatted}` : `-${formatted}`;
  };

  const history = useMemo(() => {
    if (!normalizedActivity) return [];

    const entries: Array<{ date: string; value: number }> = [];
    reports.forEach((report) => {
      const date = report.reportDate;
      const value = report.farm.activity?.totals?.[normalizedActivity];

      if (
        date &&
        value !== undefined &&
        value !== null &&
        !Number.isNaN(Number(value))
      ) {
        entries.push({ date, value: Number(value) });
      }
    });

    entries.sort((a, b) => (a.date < b.date ? -1 : 1));

    const withDiff = entries.map((entry, index) => {
      const prev = entries[index - 1];
      return {
        ...entry,
        diff:
          entry.value !== undefined && prev?.value !== undefined
            ? entry.value - prev.value
            : undefined,
      };
    });

    return withDiff
      .filter((entry) => !startDate || entry.date >= startDate)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [reports, normalizedActivity, startDate]);

  const canExportHistory = Boolean(
    hasOptions && normalizedActivity && history.length > 0,
  );

  const handleExportCsv = () => {
    if (!canExportHistory) return;

    const headers = [
      t("economyDashboard.historyDate"),
      t("economyDashboard.analyticsValueColumn"),
      t("economyDashboard.diffColumn"),
    ];

    const rows = history.map(({ date, value, diff }) => [
      date || t("economyDashboard.unknownDate"),
      value.toString(),
      formatDiffValue(diff),
    ]);

    downloadCsv(
      [headers, ...rows].map((row) => row.map((value) => value ?? "")),
      `analytics-${normalizedActivity}-${Date.now()}.csv`,
    );
  };

  return (
    <InnerPanel className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <Label type="default">{t("economyDashboard.analyticsTitle")}</Label>
        <Button
          className="w-full md:w-auto"
          onClick={handleExportCsv}
          disabled={!canExportHistory}
        >
          {t("economyDashboard.exportCsv")}
        </Button>
      </div>
      {hasOptions ? (
        <Dropdown
          options={activityOptions}
          value={effectiveActivity || undefined}
          onChange={setSelectedActivity}
          placeholder={t("economyDashboard.analyticsPlaceholder")}
          showSearch
          maxHeight={8}
        />
      ) : (
        <p className="text-xs text-white">
          {t("economyDashboard.analyticsNoOptions")}
        </p>
      )}

      {hasOptions && !normalizedActivity && (
        <p className="text-xs text-white">
          {t("economyDashboard.analyticsRequired")}
        </p>
      )}

      {hasOptions && normalizedActivity && history.length === 0 && (
        <p className="text-xs text-white">
          {t("economyDashboard.analyticsNoHistory")}
        </p>
      )}

      {hasOptions && normalizedActivity && history.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left border-b border-[#b96f50]">
                <th className="py-1 pr-2">
                  {t("economyDashboard.historyDate")}
                </th>
                <th className="py-1 pr-2">
                  {t("economyDashboard.analyticsValueColumn")}
                </th>
                <th className="py-1">{t("economyDashboard.diffColumn")}</th>
              </tr>
            </thead>
            <tbody>
              {history.map(({ date, value, diff }) => (
                <tr
                  key={`${date}-${value}`}
                  className="border-b border-[#b96f50] last:border-b-0"
                >
                  <td className="py-1 pr-2 whitespace-nowrap">
                    {date || t("economyDashboard.unknownDate")}
                  </td>
                  <td className="py-1 pr-2">{value.toLocaleString()}</td>
                  <td className="py-1">{formatDiffValue(diff)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </InnerPanel>
  );
};
