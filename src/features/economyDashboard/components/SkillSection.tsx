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

export const SkillSection: React.FC<Props> = ({ summary, reports }) => {
  const { t } = useAppTranslation();

  const summaryReports = useMemo(
    () => reports.map((entry) => entry.summary),
    [reports],
  );

  const skillOptions = useMemo(() => {
    const skillSet = new Set<string>();
    if (summary?.farm?.skills?.totals) {
      Object.keys(summary.farm.skills.totals).forEach((skill) =>
        skillSet.add(skill),
      );
    }
    summaryReports.forEach((report) => {
      Object.keys(report.farm.skills?.totals ?? {}).forEach((skill) =>
        skillSet.add(skill),
      );
    });
    return Array.from(skillSet).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" }),
    );
  }, [summary?.farm?.skills?.totals, summaryReports]);

  const [selectedSkill, setSelectedSkill] = useState("");

  useEffect(() => {
    if (skillOptions.length === 0) {
      setSelectedSkill("");
      return;
    }

    if (!selectedSkill || !skillOptions.includes(selectedSkill)) {
      const randomSkill =
        skillOptions[Math.floor(Math.random() * skillOptions.length)];
      setSelectedSkill(randomSkill);
    }
  }, [selectedSkill, skillOptions]);

  const normalizedSkill = selectedSkill.trim();

  const history = useMemo(() => {
    if (!normalizedSkill) return [];
    return summaryReports
      .map((report) => ({
        date: report.reportDate,
        value: report.farm.skills?.totals?.[normalizedSkill] ?? 0,
      }))
      .filter((entry) => !!entry.date)
      .sort((a, b) => (a.date! < b.date! ? 1 : -1));
  }, [summaryReports, normalizedSkill]);

  const selectedSkillValue = useMemo(() => {
    if (!normalizedSkill) return 0;
    if (summary?.farm?.skills?.totals?.[normalizedSkill] !== undefined) {
      return summary.farm.skills.totals[normalizedSkill];
    }

    for (let i = summaryReports.length - 1; i >= 0; i -= 1) {
      const value = summaryReports[i].farm.skills?.totals?.[normalizedSkill];
      if (value !== undefined) {
        return value;
      }
    }

    return 0;
  }, [normalizedSkill, summary?.farm?.skills?.totals, summaryReports]);

  const hasOptions = skillOptions.length > 0;

  return (
    <InnerPanel className="flex flex-col gap-2">
      <Label type="default">{t("economyDashboard.skillTitle")}</Label>
      <Dropdown
        options={skillOptions}
        value={selectedSkill || undefined}
        onChange={setSelectedSkill}
        placeholder={t("economyDashboard.skillPlaceholder")}
        showSearch
        maxHeight={8}
        disabled={!hasOptions}
      />

      {selectedSkill ? (
        <p className="text-xs text-white -mt-1">
          {t("economyDashboard.skillCurrent", {
            skill: selectedSkill,
            value: selectedSkillValue.toLocaleString(),
          })}
        </p>
      ) : (
        <p className="text-xs text-white -mt-1">
          {t("economyDashboard.skillNoData")}
        </p>
      )}

      {selectedSkill && history.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left border-b border-[#b96f50]">
                <th className="py-1 pr-2">
                  {t("economyDashboard.historyDate")}
                </th>
                <th className="py-1">
                  {t("economyDashboard.skillHistoryColumn")}
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
