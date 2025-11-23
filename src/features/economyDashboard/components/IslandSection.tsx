import React from "react";

import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  islands: Record<string, number>;
}

export const IslandSection: React.FC<Props> = ({ islands }) => {
  const { t } = useAppTranslation();

  const entries = Object.entries(islands ?? {}).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  );

  return (
    <InnerPanel className="flex flex-col">
      <Label type="default" className="mb-1.5">
        {t("economyDashboard.islandTitle")}
      </Label>
      {entries.length === 0 ? (
        <p className="text-xs text-white">
          {t("economyDashboard.noIslandData")}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left border-b border-[#b96f50]">
                <th className="py-1 pr-2">
                  {t("economyDashboard.islandName")}
                </th>
                <th className="py-1">{t("economyDashboard.playersColumn")}</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(([island, count]) => (
                <tr
                  key={island}
                  className="border-b border-[#b96f50] last:border-b-0"
                >
                  <td className="py-1 pr-2">{island}</td>
                  <td className="py-1">{count.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </InnerPanel>
  );
};
