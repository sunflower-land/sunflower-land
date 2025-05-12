import React from "react";
import { InnerPanel, Panel } from "components/ui/Panel";
import { useContext } from "react";
import * as AuthProvider from "features/auth/lib/Provider";
import useSWR from "swr";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { useSelector } from "@xstate/react";
import { getRewardsDashboard } from "./actions/getFlowerDashboardProfile";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PIXEL_SCALE } from "features/game/lib/constants";

import flowerToken from "assets/icons/flower_token.webp";
import walletIcon from "assets/icons/wallet.png";
import gift from "assets/icons/gift.png";

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

  // if (error) {
  //   return (
  //     <Panel className="inset-0 fixed pointer-events-auto">
  //       <Label type="danger">{t("transaction.somethingWentWrong")}</Label>
  //       <Button
  //         onClick={() => {
  //           window.location.reload();
  //         }}
  //       >
  //         {t("try.again")}
  //       </Button>
  //     </Panel>
  //   );
  // }

  return (
    <Panel className="inset-0 fixed pointer-events-auto">
      {/* Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <InnerPanel className="relative">
          <div className="flex w-full space-x-3 p-1">
            <img
              src={flowerToken}
              alt="Flower Token"
              className="img-highlight"
              style={{ width: PIXEL_SCALE * 12, height: PIXEL_SCALE * 12 }}
            />
            <div className="flex-1 flex flex-col -mt-1">
              <span className="text-base">{`$0.11`}</span>
              <span className="text-xs">{`Supply: 265,000,000`}</span>
              <span className="text-xs">{`FDV: $28,000,000`}</span>
            </div>
          </div>
          <a
            href="https://app.uniswap.org/swap?chain=base&inputCurrency=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&outputCurrency=0x3e12b9d6a4d12cd9b4a6d613872d0eb32f68b380&value=1&field=input"
            className="text-xs absolute top-1 right-1 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {`Buy/Sell`}
          </a>
        </InnerPanel>
        <InnerPanel>
          <div className="flex w-full space-x-3 p-1">
            <img
              src={walletIcon}
              alt="Wallet Icon"
              className="img-highlight"
              style={{ width: PIXEL_SCALE * 14, height: PIXEL_SCALE * 14 }}
            />
            <div className="flex-1 flex flex-col -mt-1">
              <span className="text-base">{`102,168`}</span>
              <span className="text-xs">{`7 day player spend`}</span>
              <span className="text-xs">{`10,246 players spent flower`}</span>
            </div>
          </div>
        </InnerPanel>
        <InnerPanel>
          <div className="flex w-full space-x-3 p-1">
            <img
              src={gift}
              alt="Rewards Pool"
              className="img-highlight"
              style={{ width: PIXEL_SCALE * 14, height: PIXEL_SCALE * 14 }}
            />
            <div className="flex-1 flex flex-col -mt-1">
              <span className="text-sm">{`Rewards Pool`}</span>
              <span className="text-xs">{`10,245,700`}</span>
              <span className="text-xs">{`246,000 HODLers`}</span>
            </div>
          </div>
        </InnerPanel>
      </div>
      {/* {`Rewards Dashboard`}
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
      </div> */}
    </Panel>
  );
};
