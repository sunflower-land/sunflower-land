import React from "react";
import { Panel } from "components/ui/Panel";
import { useContext } from "react";
import * as AuthProvider from "features/auth/lib/Provider";
import useSWR from "swr";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { useSelector } from "@xstate/react";
import { getRewardsDashboard } from "./actions/getFlowerDashboardProfile";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";

const fetcher = async ([url, token]: [string, string]) => {
  return getRewardsDashboard(token);
};

const _rawToken = (state: AuthMachineState) => state.context.user.rawToken;

export const RewardsDashboardProfile = () => {
  const { authService } = useContext(AuthProvider.Context);
  const rawToken = useSelector(authService, _rawToken);
  const { t } = useAppTranslation();

  const { data, isLoading, error, mutate } = useSWR(
    ["/rewards-dashboard", rawToken!],
    fetcher,
  );

  // Refresh data every 10 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      mutate();
    }, 10000);

    return () => clearInterval(interval);
  }, [mutate]);

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
      {`Rewards Dashboard`}
      <hr className="w-full my-4 border-gray-200" />
      <div className="flex">
        <div>
          <div className="flex flex-col gap-2">
            {data?.globalPoolCounters.map((pool) => (
              <div key={pool.pool}>
                <p>{pool.pool}</p>
                <p>{pool.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
};
