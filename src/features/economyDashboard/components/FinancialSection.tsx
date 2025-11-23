import React from "react";

import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  xsollaTotal: number;
  history: Array<{
    date: string;
    xsollaUsd: number;
    feesUsd: number;
    deposits: number;
    withdrawals: number;
  }>;
}

export const FinancialSection: React.FC<Props> = ({ xsollaTotal, history }) => {
  const { t } = useAppTranslation();

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
