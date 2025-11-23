import React from "react";

import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  currentValue: number;
  history: Array<{ date: string; value: number }>;
}

export const ActivitySection: React.FC<Props> = ({ currentValue, history }) => {
  const { t } = useAppTranslation();

  return (
    <InnerPanel className="flex flex-col">
      <Label type="default" className="mb-1.5">
        {t("economyDashboard.activityTitle")}
      </Label>
      <p className="text-xs text-white mb-2">
        {t("economyDashboard.activityCurrent", {
          value: currentValue.toLocaleString(),
        })}
      </p>

      {history.length === 0 ? (
        <p className="text-xs text-white">
          {t("economyDashboard.activityNoHistory")}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left border-b border-[#b96f50]">
                <th className="py-1 pr-2">
                  {t("economyDashboard.historyDate")}
                </th>
                <th className="py-1">
                  {t("economyDashboard.activityColumnValue")}
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
