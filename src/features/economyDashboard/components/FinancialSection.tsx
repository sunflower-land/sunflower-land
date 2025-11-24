import React, { useMemo } from "react";

import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  EconomyReportEntry,
  EconomyReportSummary,
} from "../actions/getEconomyData";

interface Props {
  summary: EconomyReportSummary | null;
  reports: EconomyReportEntry[];
}

export const FinancialSection: React.FC<Props> = ({ summary, reports }) => {
  const { t } = useAppTranslation();

  const history = useMemo(
    () =>
      reports
        .map((entry) => ({
          date: entry.summary.reportDate,
          xsollaUsd: Number(entry.summary.xsollaUsdTotal ?? 0),
          feesUsd: entry.stats?.processedFees?.totalUsd ?? 0,
          deposits: entry.stats?.flowerDeposits?.total ?? 0,
          withdrawals: entry.stats?.flowerWithdrawals?.total ?? 0,
        }))
        .filter((entry) => !!entry.date),
    [reports],
  );

  const xsollaTotal = Number(summary?.xsollaUsdTotal ?? 0);
  const hasFinancialSummary = summary?.xsollaUsdTotal !== undefined;
  const hasHistory = history.length > 0;

  if (!hasFinancialSummary && !hasHistory) {
    return null;
  }

  return (
    <InnerPanel className="flex flex-col">
      <Label type="default" className="mb-1.5">
        {t("economyDashboard.financialTitle")}
      </Label>
      <p className="text-xs text-white mb-2">
        {t("economyDashboard.xsollaTotal", {
          value: xsollaTotal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        })}
      </p>
      {history.length === 0 ? (
        <p className="text-xs text-white">
          {t("economyDashboard.noFinancialHistory")}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left border-b border-[#b96f50]">
                <th className="py-1 pr-2">
                  {t("economyDashboard.historyDate")}
                </th>
                <th className="py-1 pr-2">
                  {t("economyDashboard.financialXsollaColumn")}
                </th>
                <th className="py-1 pr-2">
                  {t("economyDashboard.financialFeesColumn")}
                </th>
                <th className="py-1 pr-2">
                  {t("economyDashboard.financialDepositsColumn")}
                </th>
                <th className="py-1">
                  {t("economyDashboard.financialWithdrawalsColumn")}
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map(
                ({ date, xsollaUsd, feesUsd, deposits, withdrawals }) => (
                  <tr
                    key={`${date}-${xsollaUsd}-${feesUsd}`}
                    className="border-b border-[#b96f50] last:border-b-0"
                  >
                    <td className="py-1 pr-2 whitespace-nowrap">
                      {date || t("economyDashboard.unknownDate")}
                    </td>
                    <td className="py-1 pr-2">
                      {xsollaUsd.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-1 pr-2">
                      {feesUsd.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-1 pr-2">{deposits.toLocaleString()}</td>
                    <td className="py-1">{withdrawals.toLocaleString()}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </InnerPanel>
  );
};
