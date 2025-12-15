import React, { useCallback, useEffect, useState } from "react";
import { InnerPanel, Panel } from "components/ui/Panel";
import { useContext } from "react";
import useSWR from "swr";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import classNames from "classnames";

import flowerToken from "assets/icons/flower_token.webp";
import flame from "assets/icons/flame.webp";
import walletIcon from "assets/icons/wallet.png";
import gift from "assets/icons/gift.png";
import increaseArrow from "assets/icons/increase_arrow.png";
import water from "assets/icons/water.png";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { useLocation, useNavigate } from "react-router";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Loading } from "features/auth/components/Loading";
import { convertToTitleCase } from "features/island/hud/components/settings-menu/general-settings/Notifications";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";
import { capitalize } from "lib/utils/capitalize";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { getFlowerDashboard } from "./actions/getFlowerDashboard";
import { LastUpdatedAt } from "components/LastUpdatedAt";
import { Modal } from "components/ui/Modal";
import { FlowerRewards } from "./FlowerRewards";

const TOTAL_SUPPLY = 256000000;

export const FlowerDashboard = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { openModal } = useContext(ModalContext);
  const [showRewards, setShowRewards] = useState(false);
  const { data, isLoading, error, mutate } = useSWR(
    ["/data?type=flowerDashboard"],
    getFlowerDashboard,
  );

  const { pathname } = useLocation();

  const isInternalRoute = pathname.includes("/game");

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // exit marketplace if Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose]);

  // Refresh data every minute
  useEffect(() => {
    const interval = setInterval(() => {
      mutate();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [mutate]);

  if (error) {
    return (
      <div className="bg-[#181425] w-full h-full safe-area-inset-top safe-area-inset-bottom">
        <Panel className="inset-0 fixed pointer-events-auto">
          <div className="relative flex w-full justify-between pr-10 items-center  mr-auto h-[70px] mb-2">
            <div
              className="absolute inset-0 w-full h-full -z-0 rounded-sm"
              // Repeating pixel art image background
              style={{
                backgroundImage: `url(${SUNNYSIDE.announcement.flowerBanner})`,
                imageRendering: "pixelated",
                backgroundSize: "320px",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 w-full h-full bg-black opacity-50 -z-0 rounded-sm" />
            <div className="z-10 pl-4">
              <p className="text-lg text-white z-10 text-shadow">
                {t("flowerDashboard.title")}
              </p>
            </div>

            {isInternalRoute && (
              <img
                src={SUNNYSIDE.icons.close}
                className="flex-none cursor-pointer absolute right-2"
                onClick={handleClose}
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                  height: `${PIXEL_SCALE * 11}px`,
                }}
              />
            )}
          </div>
          <Label className="m-1 mb-2" type="danger">
            {t("transaction.somethingWentWrong")}
          </Label>
          <Button
            onClick={() => {
              window.location.reload();
            }}
          >
            {t("try.again")}
          </Button>
        </Panel>
      </div>
    );
  }

  const fdv = data?.tokenInfo?.priceUsd
    ? data.tokenInfo.priceUsd * TOTAL_SUPPLY
    : 0;

  return (
    <>
      <div className="bg-[#181425] w-full h-full safe-area-inset-top safe-area-inset-bottom">
        <Panel className="inset-0 fixed pointer-events-auto flex flex-col overflow-y-auto scrollable">
          <div className="relative flex w-full justify-between pr-10 items-center  mr-auto h-[70px] mb-2">
            <div
              className="absolute inset-0 w-full h-full -z-0 rounded-sm"
              // Repeating pixel art image background
              style={{
                backgroundImage: `url(${SUNNYSIDE.announcement.flowerBanner})`,

                imageRendering: "pixelated",
                backgroundSize: "320px",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 w-full h-full bg-black opacity-50 -z-0 rounded-sm" />
            <div className="z-10 pl-4">
              <p className="text-lg text-white z-10 text-shadow">
                {t("flowerDashboard.title")}
              </p>
              <span className="text-xs text-white z-10 text-shadow">
                <LastUpdatedAt lastUpdated={data?.lastUpdated} />
              </span>
            </div>

            {isInternalRoute && (
              <img
                src={SUNNYSIDE.icons.close}
                className="flex-none cursor-pointer absolute right-2"
                onClick={handleClose}
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                  height: `${PIXEL_SCALE * 11}px`,
                }}
              />
            )}
          </div>
          {/* In Game Flower Stats */}
          {isLoading && <Loading />}
          {!isLoading && (
            <div className="flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                <InnerPanel className="relative">
                  <div className="flex w-full space-x-3 p-1">
                    <div className="flex items-start justify-center w-8">
                      <img
                        src={flowerToken}
                        alt="Flower Token"
                        className="img-highlight w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 flex flex-col -mt-1">
                      <span>{`$${data?.tokenInfo.priceUsd ?? "No data"}`}</span>
                      <span className="text-xxs sm:text-xs">
                        {t("marketplace.supply", {
                          supply: TOTAL_SUPPLY.toLocaleString(),
                        })}
                      </span>
                      <span className="text-xxs sm:text-xs">{`FDV: $${fdv.toLocaleString()}`}</span>
                    </div>
                  </div>
                  <a
                    href="https://app.uniswap.org/swap?chain=base&inputCurrency=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&outputCurrency=0x3e12b9d6a4d12cd9b4a6d613872d0eb32f68b380&value=1&field=input"
                    className="text-xxs absolute top-1 right-1 underline cursor-pointer"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`${t("flowerDashboard.buySell")}`}
                  </a>
                </InnerPanel>
                <InnerPanel>
                  <div className="flex w-full space-x-3 p-1">
                    <div className="flex items-start justify-center w-8">
                      <img
                        src={walletIcon}
                        alt="Wallet Icon"
                        className="img-highlight w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 flex flex-col -mt-1">
                      <span>{`$${data?.sevenDayData?.totalSpent.toLocaleString()}`}</span>
                      <span className="text-xxs sm:text-xs">{`${t("flowerDashboard.sevenDayPlayerSpend")}`}</span>
                      <span className="text-xxs sm:text-xs">{`${t(
                        "flowerDashboard.uniquePlayersSpent",
                        {
                          count: (
                            data?.sevenDayData?.uniqueSpenders ?? 0
                          ).toLocaleString(),
                        },
                      )}`}</span>
                    </div>
                  </div>
                </InnerPanel>
                <InnerPanel>
                  <div className="flex w-full space-x-3 p-1">
                    <div className="flex items-start justify-center w-9">
                      <img
                        src={gift}
                        alt="Rewards Pool"
                        className="img-highlight w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 flex flex-col -mt-1">
                      <span>{`${t("flowerDashboard.pool.rewards")}`}</span>
                      <span className="text-xxs sm:text-xs">{`${data?.pools.rewards.toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 0,
                        },
                      )}`}</span>
                      <span className="text-xxs sm:text-xs">{`${t(
                        "flowerDashboard.hodlers",
                        {
                          count: (data?.totalHolders ?? 0).toLocaleString(),
                        },
                      )}`}</span>
                    </div>
                  </div>
                </InnerPanel>
              </div>
              {/* Top Burns */}
              <InnerPanel className="mb-2">
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between">
                    <Label type="default" className="mb-1.5">
                      {t("flowerDashboard.gameBurns.title")}
                    </Label>
                    <span className="text-xs mb-1">
                      {t("flowerDashboard.last7Days")}
                    </span>
                  </div>
                  {Object.entries(data?.topGameBurns ?? {}).map(
                    ([burn, amount], index) => (
                      <div
                        key={burn}
                        className={classNames(
                          "flex items-center relative justify-between p-1.5 ",
                          {
                            "bg-[#ead4aa]": index % 2 === 0,
                          },
                        )}
                        style={{
                          borderBottom: "1px solid #b96f50",
                          borderTop: index === 0 ? "1px solid #b96f50" : "",
                        }}
                      >
                        <p className="text-xs">{convertToTitleCase(burn)}</p>
                        <div className="flex justify-end">
                          <img
                            src={flowerToken}
                            className="w-4 h-4 mt-[1px] mr-1"
                            alt="Flower Token"
                          />
                          <p className="text-xs mb-0.5">{`${amount.toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 0,
                            },
                          )}`}</p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </InnerPanel>
              {/* On Chain Token Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                <InnerPanel className="relative">
                  <div className="flex w-full space-x-3 p-1">
                    <div className="flex items-start justify-center w-8">
                      <img
                        src={increaseArrow}
                        alt="Deposit Arrow"
                        className="img-highlight w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 flex flex-col -mt-1">
                      <span>
                        {data?.sevenDayData.totalDeposits.toLocaleString()}
                      </span>
                      <span className="text-xxs sm:text-xs">{`${t(
                        "flowerDashboard.deposit.inflow",
                      )}`}</span>
                      <div className="flex flex-row gap-2">
                        <span className="text-xxs sm:text-xs">{`${t(
                          "flowerDashboard.inWallets",
                          {
                            percent: data?.tokenInfo.inWalletsPercent ?? 0,
                          },
                        )} | ${t("flowerDashboard.inGame", {
                          percent: data?.tokenInfo.inGamePercent ?? 0,
                        })}`}</span>
                      </div>
                    </div>
                  </div>
                  <a
                    className={classNames(
                      "text-xxs absolute top-1 right-1 underline cursor-pointer",
                      {
                        "pointer-events-none": !openModal,
                      },
                    )}
                    // Open deposit modal
                    onClick={() => openModal && openModal("DEPOSIT")}
                  >
                    {t("deposit")}
                  </a>
                </InnerPanel>
                <InnerPanel className="relative">
                  <div className="flex w-full space-x-3 p-1">
                    <div className="flex items-start justify-center w-7">
                      <img
                        src={water}
                        alt="Liquidity"
                        className="img-highlight w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 flex flex-col -mt-1">
                      <span>{`${t("liquidity")}`}</span>
                      <span className="text-xxs sm:text-xs">{`$${data?.tokenInfo.liquidity.toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 0,
                        },
                      )} USD`}</span>
                      <span className="text-xxs sm:text-xs">{`${t(
                        "flowerDashboard.30DayVolume",
                      )}: $${data?.tokenInfo.thirtyDayVolume.toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 0,
                        },
                      )} USD`}</span>
                    </div>
                  </div>
                  <div
                    className=" absolute top-1 right-1 flex items-end flex-col cursor-pointer"
                    onClick={() => setShowRewards(true)}
                  >
                    <span className="text-xxs  underline ">
                      {t("flowerRewards.title")}
                    </span>
                  </div>
                </InnerPanel>
                <InnerPanel className="relative">
                  <div className="flex w-full space-x-3 p-1">
                    <div className="flex items-start justify-center w-8">
                      <img
                        src={SUNNYSIDE.icons.heart}
                        alt="Team Fees"
                        className="img-highlight w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 flex flex-col -mt-1">
                      <span>{`${t("flowerDashboard.teamFees")}`}</span>
                      <span className="text-xxs sm:text-xs">{`${data?.teamFees.toLocaleString()} FLOWER`}</span>
                      <span className="text-xxs sm:text-xs">{`${t(
                        "flowerDashboard.last7Days",
                      )}`}</span>
                    </div>
                  </div>
                  <a
                    className="text-xxs absolute top-1 right-1 underline cursor-pointer"
                    onClick={() => {
                      window.open(
                        `https://docs.sunflower-land.com/getting-started/usdflower-erc20`,
                        "_blank",
                      );
                    }}
                  >
                    {t("read.more")}
                  </a>
                </InnerPanel>
              </div>
              {/* Pools */}
              <InnerPanel className="mb-2">
                <div className="flex flex-col w-full">
                  <Label type="default" className="mb-1.5">
                    {`${t("flowerDashboard.pools")}`}
                  </Label>

                  {Object.entries(data?.pools ?? {}).map(
                    ([pool, amount], index) => (
                      <div
                        key={pool}
                        className={classNames(
                          "flex items-center relative justify-between p-1.5 ",
                          {
                            "bg-[#ead4aa]": index % 2 === 0,
                          },
                        )}
                        style={{
                          borderBottom: "1px solid #b96f50",
                          borderTop: index === 0 ? "1px solid #b96f50" : "",
                        }}
                      >
                        <p className="text-xs">{`${capitalize(pool)}`}</p>
                        <div className="flex justify-end">
                          <img
                            src={flowerToken}
                            className="w-4 h-4 mt-[1px] mr-1"
                            alt="Flower Token"
                          />
                          <p className="text-xs mb-0.5">{`${amount.toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 0,
                            },
                          )}`}</p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </InnerPanel>
              <div className="flex flex-col md:flex-row gap-2 w-full">
                <InnerPanel className="w-full">
                  <div className="flex items-center justify-between">
                    <Label type="default" className="mb-1.5">
                      {`${t("flowerDashboard.topEarners")}`}
                    </Label>
                    <span className="text-xs mb-1">
                      {t("flowerDashboard.last7Days")}
                    </span>
                  </div>
                  {data?.topEarners.map(
                    ({ player, amount, tokenUri }, index) => (
                      <div
                        key={index}
                        className={classNames(
                          "flex items-center relative justify-between p-1.5 ",
                          {
                            "bg-[#ead4aa]": index % 2 === 0,
                          },
                        )}
                        style={{
                          borderBottom: "1px solid #b96f50",
                          borderTop: index === 0 ? "1px solid #b96f50" : "",
                        }}
                      >
                        <div className="flex items-center gap-2 h-4">
                          <NPCIcon
                            parts={interpretTokenUri(tokenUri).equipped}
                            width={25}
                          />
                          <p className="text-xs">{`${player}`}</p>
                        </div>
                        <div className="flex justify-end">
                          <img
                            src={flowerToken}
                            className="w-4 h-4 mt-[1px] mr-1"
                            alt="Flower Token"
                          />
                          <p className="text-xs mb-0.5">{`${amount
                            .toFixed()
                            .toLocaleString()}`}</p>
                        </div>
                      </div>
                    ),
                  )}
                </InnerPanel>
                <InnerPanel className="w-full">
                  <div className="flex items-center justify-between">
                    <Label type="default" className="mb-1.5">
                      {t("flowerDashboard.topBurners")}
                    </Label>
                    <span className="text-xs mb-1">
                      {t("flowerDashboard.last7Days")}
                    </span>
                  </div>
                  {data?.topBurners.map(
                    ({ player, amount, tokenUri }, index) => (
                      <div
                        key={index}
                        className={classNames(
                          "flex items-center relative justify-between p-1.5 ",
                          {
                            "bg-[#ead4aa]": index % 2 === 0,
                          },
                        )}
                        style={{
                          borderBottom: "1px solid #b96f50",
                          borderTop: index === 0 ? "1px solid #b96f50" : "",
                        }}
                      >
                        <div className="flex items-center gap-2 h-4">
                          <NPCIcon
                            parts={interpretTokenUri(tokenUri).equipped}
                            width={25}
                          />
                          <p className="text-xs">{`${player}`}</p>
                        </div>
                        <div className="flex justify-end">
                          <img
                            src={flame}
                            className="w-4 h-4 mt-[1px] mr-1"
                            alt="Flame"
                          />
                          <p className="text-xs mb-0.5">{`${amount
                            .toFixed()
                            .toLocaleString()}`}</p>
                        </div>
                      </div>
                    ),
                  )}
                </InnerPanel>
              </div>
            </div>
          )}
        </Panel>
      </div>
      <Modal show={showRewards} onHide={() => setShowRewards(false)}>
        <FlowerRewards onClose={() => setShowRewards(false)} />
      </Modal>
    </>
  );
};
