import React from "react";
import { Panel } from "components/ui/Panel";
import { useContext } from "react";
import * as AuthProvider from "features/auth/lib/Provider";
import useSWR from "swr";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { useSelector } from "@xstate/react";
import { useParams } from "react-router";
import { getLedgerDashboardProfile } from "./actions/getLedgerDashboardProfile";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import classNames from "classnames";
import flowerToken from "assets/icons/flower_token.webp";

const fetcher = async ([url, token, id]: [string, string, string]) => {
  return getLedgerDashboardProfile(token, id);
};

const _rawToken = (state: AuthMachineState) => state.context.user.rawToken;

export const LedgerDashboardProfile = () => {
  const { id } = useParams();

  const { authService } = useContext(AuthProvider.Context);
  const rawToken = useSelector(authService, _rawToken);
  const { t } = useAppTranslation();

  const { data, isLoading, error } = useSWR(
    ["/ledger-dashboard", rawToken!, id!],
    fetcher,
  );

  if (error) {
    return (
      <Panel className="inset-0 fixed pointer-events-auto">
        <Label type="danger">{t("transaction.somethingWentWrong")}</Label>
        <Button
          onClick={() => {
            window.location.reload();
          }}
        >
          {t("try.again")}
        </Button>
      </Panel>
    );
  }

  return (
    <Panel className="inset-0 fixed pointer-events-auto">
      {`Ledger Dashboard`}
      <Label type="default">{`Team Fees - 7 Days`}</Label>
      <div className="flex">
        <img src={flowerToken} className="w-10 h-10" />
        <p className="text-sm">{data?.teamFees.weeklyFees.toLocaleString()}</p>
      </div>
      <div className="max-h-[200px] scrollable overflow-y-auto relative">
        {data?.ledger.map((item, index) => (
          <div
            key={`${item.type}-${item.createdAt}`}
            className={classNames(
              "flex items-center relative transition-all text-xs sm:text-sm",
              {
                "bg-[#ead4aa]": index % 2 === 0,
              },
            )}
            style={{
              borderBottom: "1px solid #b96f50",
              borderTop: index === 0 ? "1px solid #b96f50" : "",
            }}
          >
            <div className="w-1/5">{item.type}</div>
            <div className="flex items-center justify-evenly w-4/5">
              <div>{item.farmId}</div>
              <div className="w-1/3">
                {item.balance > 0 ? "+" : ""}
                {item.balance}
              </div>
              <div>{new Date(item.createdAt).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
};
