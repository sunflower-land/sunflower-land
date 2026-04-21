import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import React, { useContext } from "react";
import { WhatsNew } from "./WhatsNew";
import { ITEM_DETAILS } from "features/game/types/images";
import { useLocation, useNavigate } from "react-router";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import sflIcon from "assets/icons/flower_token.webp";
import tradeIcon from "assets/icons/trade.png";
import whaleIcon from "assets/icons/whale.webp";
import walletIcon from "assets/icons/wallet.png";
import { MarketplaceTrends } from "features/game/types/marketplace";
import { Loading } from "features/auth/components";
import { loadTrends } from "../actions/loadTrends";
import * as Auth from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";
import { TopTrades } from "./TopTrades";
import useSWR, { preload } from "swr";
import { CONFIG } from "lib/config";
import { useGame } from "features/game/GameProvider";

const hotNowFetcher = ([, token]: [string, string]) => {
  if (CONFIG.API_URL) return loadTrends({ token });
};
export const preloadHotNow = (token: string) =>
  preload(["/marketplace/trends", token], hotNowFetcher);

export const MarketplaceHotNow: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);
  const { gameState } = useGame();
  const navigate = useNavigate();

  const { t } = useAppTranslation();

  const { data, error } = useSWR(
    ["/marketplace/trends", authState.context.user.rawToken as string],
    hotNowFetcher,
  );

  // Errors are handled by the game machine
  if (error) throw error;

  const isWorldRoute = useLocation().pathname.includes("/world");

  return (
    <div className="overflow-y-scroll scrollable pr-1">
      <InnerPanel className="mb-1">
        <div className="p-2">
          <Label type="default" className="mb-2 -ml-1">
            {t("marketplace.welcome")}
          </Label>
          <p className="text-sm mb-2">{t("marketplace.welcomeDescription")}</p>

          <div className="flex flex-wrap ">
            <div className="w-full sm:w-1/3 xl:w-1/4 pr-1">
              <ButtonPanel
                className="w-full h-full"
                onClick={() =>
                  navigate(
                    `${isWorldRoute ? "/world" : ""}/marketplace/collection?filters=resources`,
                  )
                }
              >
                <div className="flex items-center">
                  <img
                    src={ITEM_DETAILS.Eggplant.image}
                    className="w-10 mr-2"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p>{t("marketplace.resources")}</p>
                      <img
                        src={SUNNYSIDE.icons.chevron_right}
                        className="h-4"
                      />
                    </div>
                    <p className="text-xs">
                      {t("marketplace.resourcesDescription")}
                    </p>
                  </div>
                </div>
              </ButtonPanel>
            </div>

            <div className="w-full sm:w-1/3 xl:w-1/4 pr-1">
              <ButtonPanel
                className="w-full h-full"
                onClick={() =>
                  navigate(
                    `${isWorldRoute ? "/world" : ""}/marketplace/collection?filters=collectibles,wearables,utility`,
                  )
                }
              >
                <div className="flex items-center">
                  <img
                    src={ITEM_DETAILS["Grinx's Hammer"].image}
                    className="w-10 mr-2"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p>{t("marketplace.powerUps")}</p>
                      <img
                        src={SUNNYSIDE.icons.chevron_right}
                        className="h-4"
                      />
                    </div>
                    <p className="text-xs">
                      {t("marketplace.powerUpsDescription")}
                    </p>
                  </div>
                </div>
              </ButtonPanel>
            </div>

            <div className="w-full sm:w-1/3 xl:w-1/4 pr-1">
              <ButtonPanel
                className=" w-full h-full"
                onClick={() =>
                  navigate(
                    `${isWorldRoute ? "/world" : ""}/marketplace/collection?filters=collectibles,wearables,cosmetic`,
                  )
                }
              >
                <div className="flex items-center">
                  <img
                    src={ITEM_DETAILS["Abandoned Bear"].image}
                    className="w-10 mr-2"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p>{t("marketplace.cosmetics")}</p>
                      <img
                        src={SUNNYSIDE.icons.chevron_right}
                        className="h-4"
                      />
                    </div>
                    <p className="text-xs">
                      {t("marketplace.cosmeticsDescription")}
                    </p>
                  </div>
                </div>
              </ButtonPanel>
            </div>
          </div>
        </div>
      </InnerPanel>

      <MarketplaceStats trends={data} />

      <InnerPanel className="mb-2">
        <div className="p-2">
          <div className="flex items-center justify-between">
            <Label type="default" icon={whaleIcon} className="-ml-1 mb-2">
              {t("marketplace.whaleTrades")}
            </Label>

            <Label type="transparent" icon={SUNNYSIDE.icons.stopwatch}>
              {t("marketplace.7days")}
            </Label>
          </div>

          <TopTrades trends={data} />
        </div>
      </InnerPanel>

      <InnerPanel>
        <div className="p-2">
          <Label type="success" className="-ml-1 mb-2">
            {t("reward.whatsNew")}
          </Label>

          <WhatsNew />
        </div>
      </InnerPanel>
    </div>
  );
};

export const MarketplaceStats: React.FC<{
  trends?: MarketplaceTrends;
}> = ({ trends }) => {
  const { t } = useAppTranslation();
  if (!trends?.topTrades) {
    return (
      <InnerPanel className="mb-1">
        <Loading />
      </InnerPanel>
    );
  }

  return (
    <div className="flex flex-wrap">
      <div className="w-full sm:w-1/3 sm:pr-1  mb-1">
        <InnerPanel>
          <div className="flex items-center p-1">
            <img src={sflIcon} className="h-10 mr-2" />
            <div>
              <p>{`${trends.volume.toLocaleString()} FLOWER`}</p>
              <p className="text-xs">{t("marketplace.totalVolume")}</p>
            </div>
          </div>
        </InnerPanel>
      </div>
      <div className="w-full sm:w-1/3 sm:pr-1  mb-1">
        <InnerPanel>
          <div className="flex items-center p-1">
            <img src={tradeIcon} className="h-10 mr-2" />
            <div>
              <p>{`${trends.trades.toLocaleString()}`}</p>
              <p className="text-xs">{t("marketplace.totalTrades")}</p>
            </div>
          </div>
        </InnerPanel>
      </div>
      <div className="w-full sm:w-1/3  mb-1">
        <InnerPanel>
          <div className="flex items-center sm:p-1">
            <img src={walletIcon} className="h-10 mr-2" />
            <div>
              <p>{`${trends.owners.toLocaleString()}`}</p>
              <p className="text-xs">
                {t("marketplace.walletsHoldingCollectibles")}
              </p>
            </div>
          </div>
        </InnerPanel>
      </div>
    </div>
  );
};
