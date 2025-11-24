import React, { useEffect, useMemo, useState } from "react";

import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Dropdown } from "components/ui/Dropdown";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  EconomyReportEntry,
  EconomyReportSummary,
} from "../actions/getEconomyData";

interface Props {
  summary: EconomyReportSummary | null;
  reports: EconomyReportEntry[];
}

export const AnalyticsSection: React.FC<Props> = ({ summary, reports }) => {
  const { t } = useAppTranslation();
  const summaryReports = useMemo(
    () => reports.map((report) => report.summary),
    [reports],
  );

  const activityOptions = useMemo(() => {
    const activitySet = new Set<string>();
    if (summary?.farm?.activity?.totals) {
      Object.keys(summary.farm.activity.totals).forEach((activity) =>
        activitySet.add(activity),
      );
    }
    summaryReports.forEach((report) => {
      Object.keys(report.farm.activity?.totals ?? {}).forEach((activity) =>
        activitySet.add(activity),
      );
    });
    return Array.from(activitySet).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" }),
    );
  }, [summary?.farm?.activity?.totals, summaryReports]);

  const [selectedActivity, setSelectedActivity] = useState("");

  useEffect(() => {
    if (activityOptions.length === 0) {
      setSelectedActivity("");
      return;
    }

    if (!selectedActivity || !activityOptions.includes(selectedActivity)) {
      setSelectedActivity(activityOptions[0]);
    }
  }, [activityOptions, selectedActivity]);

  const normalizedActivity = selectedActivity.trim();
  const hasOptions = activityOptions.length > 0;

  const history = useMemo(() => {
    if (!normalizedActivity) return [];

    const entries: Array<{ date: string; value: number }> = [];
    summaryReports.forEach((report) => {
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

    return entries.sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [summaryReports, normalizedActivity]);

  return (
    <InnerPanel className="flex flex-col gap-2">
      <Label type="default">{t("economyDashboard.analyticsTitle")}</Label>
      {hasOptions ? (
        <Dropdown
          options={activityOptions}
          value={normalizedActivity || undefined}
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
                <th className="py-1">
                  {t("economyDashboard.analyticsValueColumn")}
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map(({ date, value }) => (
                <tr
                  key={`${date}-${value}`}
                  className="border-b border-[#b96f50] last:border-b-0"
                >
                  <td className="py-1 pr-2 whitespace-nowrap">
                    {date || t("economyDashboard.unknownDate")}
                  </td>
                  <td className="py-1">{value.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </InnerPanel>
  );
};
