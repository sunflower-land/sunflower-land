import React, { useEffect, useMemo, useState } from "react";

import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Dropdown } from "components/ui/Dropdown";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { EconomyReportEntry } from "../actions/getEconomyData";

export interface ResourceHistoryEntry {
  date: string;
  supply?: string | number;
  distribution?: string | number;
}

interface Props {
  reports: EconomyReportEntry[];
  inventoryOptions: string[];
}

export const ResourceSection: React.FC<Props> = ({
  reports,
  inventoryOptions,
}) => {
  const { t } = useAppTranslation();
  const [selectedResource, setSelectedResource] = useState("");

  useEffect(() => {
    if (inventoryOptions.length === 0) return;
    if (selectedResource && inventoryOptions.includes(selectedResource)) return;

    const fallback =
      inventoryOptions.find((option) => option === "Sunflower") ??
      inventoryOptions[0];

    if (fallback) {
      setSelectedResource(fallback);
    }
  }, [inventoryOptions, selectedResource]);

  const normalizedResource = selectedResource.trim();
  const resourceLabel =
    normalizedResource || t("economyDashboard.resourceUnset");

  const summaryReports = useMemo(
    () => reports.map((report) => report.summary),
    [reports],
  );

  const formatRecordValue = (value: string | number) => {
    if (typeof value === "number") {
      return value.toLocaleString();
    }

    if (/^-?\d+(\.\d+)?$/.test(value)) {
      const numericValue = Number(value);
      return numericValue.toLocaleString();
    }

    return value;
  };

  const history = useMemo(() => {
    if (!normalizedResource) return [];

    return summaryReports
      .map((report) => ({
        date: report.reportDate,
        supply: report.farm.collectibles.totals?.[normalizedResource],
        distribution: report.farm.collectibles.holders?.[normalizedResource],
      }))
      .filter(
        (entry) =>
          entry.date &&
          (entry.supply !== undefined || entry.distribution !== undefined),
      )
      .map(
        (entry) =>
          ({
            ...entry,
            supply:
              entry.supply !== undefined
                ? formatRecordValue(entry.supply)
                : undefined,
            distribution:
              entry.distribution !== undefined
                ? formatRecordValue(entry.distribution)
                : undefined,
          }) satisfies ResourceHistoryEntry,
      )
      .sort((a, b) => (a.date! < b.date! ? 1 : -1));
  }, [summaryReports, normalizedResource]);

  return (
    <div className="flex flex-col gap-2">
      <InnerPanel className="flex flex-col gap-2">
        <Label type="default" className="mb-1">
          {t("economyDashboard.resource")}
        </Label>
        <Dropdown
          options={inventoryOptions}
          value={selectedResource || undefined}
          onChange={setSelectedResource}
          placeholder={t("economyDashboard.resourcePlaceholder")}
          showSearch
          maxHeight={8}
        />
      </InnerPanel>

      <InnerPanel className="flex flex-col">
        <Label type="default" className="mb-1.5">
          {t("economyDashboard.historyTitle", {
            resource: resourceLabel,
          })}
        </Label>
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
                  <th className="py-1">
                    {t("economyDashboard.distributionColumn")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map(({ date, supply, distribution }) => (
                  <tr
                    key={`${date}-${supply ?? "nos"}-${distribution ?? "nod"}`}
                    className="border-b border-[#b96f50] last:border-b-0"
                  >
                    <td className="py-1 pr-2 whitespace-nowrap">
                      {date || t("economyDashboard.unknownDate")}
                    </td>
                    <td className="py-1 pr-2">{supply ?? "-"}</td>
                    <td className="py-1">{distribution ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </InnerPanel>
    </div>
  );
};
