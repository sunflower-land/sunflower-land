import React from "react";

import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Dropdown } from "components/ui/Dropdown";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  selectedSkill: string;
  options: string[];
  onSkillChange: (skill: string) => void;
  currentValue: number;
  history: Array<{ date: string; value: number }>;
}

export const SkillSection: React.FC<Props> = ({
  selectedSkill,
  options,
  onSkillChange,
  currentValue,
  history,
}) => {
  const { t } = useAppTranslation();

  const hasOptions = options.length > 0;

  return (
    <InnerPanel className="flex flex-col gap-2">
      <Label type="default">{t("economyDashboard.skillTitle")}</Label>
      <Dropdown
        options={options}
        value={selectedSkill || undefined}
        onChange={onSkillChange}
        placeholder={t("economyDashboard.skillPlaceholder")}
        showSearch
        maxHeight={8}
        disabled={!hasOptions}
      />

      {selectedSkill ? (
        <p className="text-xs text-white -mt-1">
          {t("economyDashboard.skillCurrent", {
            skill: selectedSkill,
            value: currentValue.toLocaleString(),
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
