import React from "react";

import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Dropdown } from "components/ui/Dropdown";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export interface ResourceHistoryEntry {
  date: string;
  supply?: string | number;
  distribution?: string | number;
}

interface Props {
  selectedResource: string;
  normalizedResource: string;
  resourceLabel: string;
  options: string[];
  onResourceChange: (resource: string) => void;
  supplyRecords: Array<[string, string | number]>;
  holderRecords: Array<[string, string | number]>;
  history: ResourceHistoryEntry[];
}

export const ResourceSection: React.FC<Props> = ({
  selectedResource,
  normalizedResource,
  resourceLabel,
  options,
  onResourceChange,
  supplyRecords,
  holderRecords,
  history,
}) => {
  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col gap-2">
      <InnerPanel className="flex flex-col gap-2">
        <Label type="default" className="mb-1">
          {t("economyDashboard.resource")}
        </Label>
        <Dropdown
          options={options}
          value={selectedResource || undefined}
          onChange={onResourceChange}
          placeholder={t("economyDashboard.resourcePlaceholder")}
          showSearch
          maxHeight={8}
        />
      </InnerPanel>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <InnerPanel className="flex flex-col">
          <Label type="default" className="mb-1.5">
            {t("economyDashboard.supplyTitle", {
              resource: resourceLabel,
            })}
          </Label>
          {(!normalizedResource || supplyRecords.length === 0) && (
            <p className="text-xs text-white">
              {t(
                normalizedResource
                  ? "economyDashboard.noSupply"
                  : "economyDashboard.resourceRequired",
              )}
            </p>
          )}
          {normalizedResource &&
            supplyRecords.map(([key, value], index) => (
              <div
                key={key}
                className={classNames(
                  "flex items-center justify-between p-1.5 text-xs",
                  {
                    "bg-[#ead4aa]": index % 2 === 0,
                  },
                )}
                style={{
                  borderBottom: "1px solid #b96f50",
                  borderTop: index === 0 ? "1px solid #b96f50" : "",
                }}
              >
                <span>{key}</span>
                <span>{value}</span>
              </div>
            ))}
        </InnerPanel>

        <InnerPanel className="flex flex-col">
          <Label type="default" className="mb-1.5">
            {t("economyDashboard.distributionTitle", {
              resource: resourceLabel,
            })}
          </Label>
          {(!normalizedResource || holderRecords.length === 0) && (
            <p className="text-xs text-white">
              {t(
                normalizedResource
                  ? "economyDashboard.noDistribution"
                  : "economyDashboard.resourceRequired",
              )}
            </p>
          )}
          {normalizedResource &&
            holderRecords.map(([key, value], index) => (
              <div
                key={key}
                className={classNames(
                  "flex items-center justify-between p-1.5 text-xs",
                  {
                    "bg-[#ead4aa]": index % 2 === 0,
                  },
                )}
                style={{
                  borderBottom: "1px solid #b96f50",
                  borderTop: index === 0 ? "1px solid #b96f50" : "",
                }}
              >
                <span>{key}</span>
                <span>{value}</span>
              </div>
            ))}
        </InnerPanel>
      </div> */}

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
