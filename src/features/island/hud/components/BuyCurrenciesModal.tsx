import React, { useContext, useEffect, useState } from "react";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

import blockBuckIcon from "assets/icons/block_buck.png";
import exchangeIcon from "assets/icons/exchange.png";
import giftIcon from "assets/icons/gift.png";
import increaseIcon from "assets/icons/increase_arrow.png";
import coinsIcon from "assets/icons/coins.webp";
import coinsStack from "assets/icons/coins_stack.webp";
import coinsScattered from "assets/icons/coins_scattered.webp";
import sflIcon from "assets/icons/sfl.webp";
import lifeTimeFarmerBanner from "assets/decorations/banners/dawn_breaker_banner.png";
import { SFL_TO_COIN_PACKAGES } from "features/game/events/landExpansion/exchangeSFLtoCoins";
import { OuterPanel } from "components/ui/Panel";
import * as AuthProvider from "features/auth/lib/Provider";
import { XsollaLoading } from "features/game/components/modal/components/XsollaLoading";
import { XsollaIFrame } from "features/game/components/modal/components/XsollaIFrame";
import { Context } from "features/game/GameProvider";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { MachineState } from "features/game/lib/gameMachine";
import { useActor, useSelector } from "@xstate/react";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { randomID } from "lib/utils/random";
import { buyBlockBucksXsolla } from "features/game/actions/buyBlockBucks";
import {
  BuyBlockBucks,
  Price,
} from "features/game/components/modal/components/BuyBlockBucks";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { SquareIcon } from "components/ui/SquareIcon";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  SeasonalBanner,
  getPreviousSeasonalBanner,
  getSeasonalBanner,
  getSeasonalBannerImage,
} from "features/game/types/seasons";
import { hasFeatureAccess } from "lib/flags";
import { getBannerPrice } from "features/game/events/landExpansion/bannerPurchased";
import Decimal from "decimal.js-light";
import classNames from "classnames";
import { Inventory } from "./inventory/InventoryItemsModal";

const COIN_IMAGES = [coinsScattered, coinsIcon, coinsStack];

type Props = {
  initialTab?: number;
  show: boolean;
  onClose: () => void;
};

const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;
const _farmId = (state: MachineState) => state.context.farmId;
const _autosaving = (state: MachineState) => state.matches("autosaving");

export const BuyCurrenciesModal: React.FC<Props> = ({
  show,
  onClose,
  initialTab = 0,
}) => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const [tab, setTab] = useState(initialTab);

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const { t } = useAppTranslation();

  // Block bucks
  const [showXsolla, setShowXsolla] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<Price>();
  const [hideBuyBBLabel, setHideBuyBBLabel] = useState(false);

  // SFL to Coins
  const [exchangePackageId, setExchangePackageId] = useState<number>();

  // Banners
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [banner, setBanner] = useState<
    SeasonalBanner | "Lifetime Farmer Banner"
  >("Lifetime Farmer Banner");

  // const [showPurchased, setShowPurchased] = useState(hasPurchased);

  const token = useSelector(authService, _token);
  const farmId = useSelector(gameService, _farmId);
  const autosaving = useSelector(gameService, _autosaving);

  useEffect(() => {
    // Trigger an autosave in case they have changes so user can sync right away
    gameService.send("SAVE");

    onboardingAnalytics.logEvent("begin_checkout");
  }, []);

  const handleSFLtoCoinsExchange = (packageId: number) => {
    gameService.send("sfl.exchanged", { packageId });
    setExchangePackageId(undefined);
    onClose();
  };

  const onMaticBuy = async () => {
    gameService.send("BUY_BLOCK_BUCKS", {
      currency: "MATIC",
      amount: price?.amount,
    });
    onClose();
  };

  const handleExited = () => {
    setShowXsolla(undefined);
    setPrice(undefined);
    setLoading(false);
  };

  const handleCreditCardBuy = async () => {
    setLoading(true);
    try {
      const amount = price?.amount ?? 0;

      const { url } = await buyBlockBucksXsolla({
        amount,
        farmId,
        transactionId: randomID(),
        token,
      });

      setShowXsolla(url);
      setLoading(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setLoading(false);
    }
  };

  const handleCreditCardSuccess = () => {
    gameService.send("UPDATE_BLOCK_BUCKS", { amount: price?.amount });
    onClose();
  };

  const seasonalBannerImage = getSeasonalBannerImage();

  const originalBannerPrice = 90;

  const previousBanner = getPreviousSeasonalBanner();
  const hasPreviousBanner = !!state.inventory[previousBanner];
  const seasonalBanner = getSeasonalBanner();
  const bannerPrice = getBannerPrice(banner, hasPreviousBanner).toNumber();

  const hasDiscount = bannerPrice < originalBannerPrice;

  const onConfirm = (banner: SeasonalBanner | "Lifetime Farmer Banner") => {
    gameService.send("banner.purchased", {
      name: banner,
    });
    setShowConfirmation(false);
  };

  if (showConfirmation) {
    return (
      <ConfirmationModal
        onClose={() => setShowConfirmation(false)}
        onConfirm={onConfirm}
        banner={banner}
        price={bannerPrice}
        seasonalBannerImage={seasonalBannerImage}
        inventory={state.inventory}
      />
    );
  }

  return (
    <Modal
      show={show}
      onHide={onClose}
      onExited={handleExited}
      size={showXsolla ? "lg" : undefined}
    >
      {showXsolla ? (
        <div className="relative w-full h-full min-h-[65vh] min-w[65vw] px-1">
          <XsollaLoading autoClose={true} />
          <XsollaIFrame
            url={showXsolla}
            onSuccess={handleCreditCardSuccess}
            onClose={onClose}
          />
        </div>
      ) : loading ? (
        <div className="h-32 flex items-center justify-center">
          <XsollaLoading autoClose={false} />
        </div>
      ) : (
        <CloseButtonPanel
          onBack={price ? () => setPrice(undefined) : undefined}
          currentTab={tab}
          setCurrentTab={(tab) => {
            setTab(tab);
          }}
          onClose={onClose}
          tabs={[
            { icon: blockBuckIcon, name: `Block Bucks` },
            { icon: exchangeIcon, name: `${t("sfl/coins")}` },
            ...(hasFeatureAccess(state, "BANNER_SALES")
              ? [{ icon: SUNNYSIDE.icons.basket, name: `Banner` }]
              : []),
          ]}
        >
          {tab === 0 && (
            <div className="flex flex-col space-y-1">
              {!hideBuyBBLabel && (
                <div className="flex justify-between pt-2 px-1">
                  <Label icon={blockBuckIcon} type="default" className="ml-2">
                    {`${t("transaction.buy.BlockBucks")}`}
                  </Label>
                  <a
                    href="https://docs.sunflower-land.com/fundamentals/blockchain-fundamentals#block-bucks"
                    className="text-xxs underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("read.more")}
                  </a>
                </div>
              )}
              <BuyBlockBucks
                isSaving={autosaving}
                price={price}
                setPrice={setPrice}
                onMaticBuy={onMaticBuy}
                onCreditCardBuy={handleCreditCardBuy}
                onHideBuyBBLabel={(hide) => setHideBuyBBLabel(hide)}
              />
            </div>
          )}
          {tab === 1 && (
            <div className="flex flex-col space-y-2">
              <Label icon={exchangeIcon} type="default" className="mt-2 ml-1">
                {`${t("exchange")} SFL ${t("for")} Coins`}
              </Label>
              {/* Exchange packages */}
              {!exchangePackageId && (
                <div className="flex px-1 pb-2 justify-between gap-1 text-[14px] sm:text-sm sm:gap-2">
                  {Object.keys(SFL_TO_COIN_PACKAGES).map((packageId, index) => {
                    const option = SFL_TO_COIN_PACKAGES[Number(packageId)];

                    return (
                      <OuterPanel
                        key={JSON.stringify(option)}
                        className="flex relative flex-col flex-1 items-center p-2 cursor-pointer hover:bg-brown-300"
                        onClick={() => setExchangePackageId(Number(packageId))}
                      >
                        <span className="whitespace-nowrap mb-2">{`${option.coins} coins`}</span>
                        <div className="flex flex-1 justify-center items-center mb-6 w-full relative">
                          <SquareIcon width={24} icon={COIN_IMAGES[index]} />
                        </div>
                        <Label
                          icon={sflIcon}
                          type="warning"
                          iconWidth={11}
                          className="absolute h-7"
                          style={{
                            width: "106%",
                            bottom: "-8px",
                            left: "-2px",
                          }}
                        >
                          {`${option.sfl} SFL`}
                        </Label>
                      </OuterPanel>
                    );
                  })}
                </div>
              )}
              {/* Exchange confirmation */}
              {!!exchangePackageId && (
                <div className="flex flex-col space-y-1">
                  <div className="py-1">
                    <img
                      src={SUNNYSIDE.icons.arrow_left}
                      className="h-6 w-6 ml-2 cursor-pointer"
                      onClick={() => setExchangePackageId(undefined)}
                    />
                  </div>
                  <div className="flex px-1 pb-1 w-full items-center text-sm justify-between">
                    <div className="flex items-center space-x-2">
                      <span>
                        {t("item")}{" "}
                        {SFL_TO_COIN_PACKAGES[Number(exchangePackageId)].coins}{" "}
                        {"x"}
                      </span>
                      <img src={coinsIcon} className="w-6" />
                    </div>
                    <span>{`${t("total")} ${
                      SFL_TO_COIN_PACKAGES[Number(exchangePackageId)].sfl
                    } SFL`}</span>
                  </div>
                  <Button
                    onClick={() => handleSFLtoCoinsExchange(exchangePackageId)}
                  >
                    {t("confirm")}
                  </Button>
                </div>
              )}
            </div>
          )}
          {tab === 2 && hasFeatureAccess(state, "BANNER_SALES") && (
            <div className="flex flex-col space-y-2">
              {/* Lifetime Farmer */}
              <OuterPanel
                className="flex relative flex-col flex-1 items-center p-2 cursor-pointer hover:bg-brown-300"
                onClick={() => {
                  setShowConfirmation(true);
                  setBanner("Lifetime Farmer Banner");
                }}
              >
                <Label
                  type="default"
                  className="absolute h-7"
                  icon={lifeTimeFarmerBanner}
                  iconWidth={16}
                  style={{
                    width: "40%",
                    top: "4px",
                    left: "0px",
                  }}
                >
                  {t("season.lifetime.farmer")}
                </Label>

                <div className="flex mt-10 w-full relative">
                  <img src={giftIcon} alt="Coins" className="w-5" />
                  <p className="text-sm ml-2">{t("season.supporter.gift")}</p>
                </div>

                <div className="flex mt-2 w-full relative">
                  <img
                    src={seasonalBannerImage}
                    alt="Seasonal Banner"
                    className="w-4 ml-[0.5px]"
                  />
                  <p className="text-sm ml-2">
                    {t("season.free.season.passes")}
                  </p>
                </div>

                <Label
                  icon={blockBuckIcon}
                  type="warning"
                  iconWidth={16}
                  className="absolute h-7"
                  style={{
                    width: "20%",
                    bottom: "2px",
                    right: "2px",
                  }}
                >
                  {getBannerPrice("Lifetime Farmer Banner", false).toNumber()}
                </Label>
              </OuterPanel>
              {/* Season Banner */}
              <OuterPanel
                className="flex relative flex-col flex-1 items-center p-2 cursor-pointer hover:bg-brown-300"
                onClick={() => {
                  setShowConfirmation(true);
                  setBanner(seasonalBanner);
                }}
              >
                <Label
                  icon={seasonalBannerImage}
                  type="default"
                  iconWidth={16}
                  className="absolute h-7"
                  style={{
                    width: "50%",
                    top: "4px",
                    left: "0px",
                  }}
                >
                  {seasonalBanner}
                </Label>

                <div className="flex mt-10 w-full relative">
                  <img src={giftIcon} alt="Coins" className="w-5" />
                  <p className="text-sm ml-2">{t("season.mystery.gift")}</p>
                </div>

                <div className="flex mt-2 w-full relative">
                  <img
                    src={SUNNYSIDE.icons.confirm}
                    alt="Coins"
                    className="w-5 mt-1"
                  />
                  <p className="text-sm ml-2">{t("season.vip.access")}</p>
                </div>

                <div className="flex mt-2 w-full relative">
                  <img
                    src={increaseIcon}
                    alt="Coins"
                    className="w-3 mt-1 ml-1"
                  />
                  <p className="text-sm ml-2">{t("season.xp.boost")}</p>
                </div>

                {hasDiscount && (
                  <p
                    className="absolute text-xxs line-through bottom-2 right-[34px] bottom-9"
                    style={{}}
                  >
                    {originalBannerPrice}
                  </p>
                )}
                <Label
                  icon={blockBuckIcon}
                  type="warning"
                  iconWidth={16}
                  className="absolute h-7"
                  style={{
                    width: "20%",
                    bottom: "2px",
                    right: "2px",
                  }}
                >
                  {getBannerPrice(seasonalBanner, hasPreviousBanner).toNumber()}
                </Label>
              </OuterPanel>
            </div>
          )}
        </CloseButtonPanel>
      )}
    </Modal>
  );
};

type ConfirmationProps = {
  onClose: () => void;
  onConfirm: (banner: SeasonalBanner | "Lifetime Farmer Banner") => void;
  banner: SeasonalBanner | "Lifetime Farmer Banner";
  price: number;
  seasonalBannerImage: string;
  inventory: Inventory;
};

const ConfirmationModal: React.FC<ConfirmationProps> = ({
  onClose,
  onConfirm,
  banner,
  price,
  seasonalBannerImage,
  inventory,
}) => {
  const { t } = useAppTranslation();
  const isLifeTime = banner === "Lifetime Farmer Banner";
  const hasBanner = !!inventory[banner];
  const blockBuckBalance = inventory["Block Buck"] || new Decimal(0);
  const hasLifeTime = !!inventory["Lifetime Farmer Banner"];

  return (
    <Modal show onHide={onClose} onExited={onClose}>
      <CloseButtonPanel className="m-2">
        <Label
          icon={isLifeTime ? lifeTimeFarmerBanner : seasonalBannerImage}
          type="default"
          iconWidth={16}
          className="absolute h-7"
          style={{
            width: "50%",
            top: "14px",
            left: "10px",
          }}
        >
          {banner}
        </Label>

        {isLifeTime && (
          <div className="flex mt-12 w-full relative">
            <img src={giftIcon} alt="Coins" className="w-5" />
            <p className="text-sm ml-2">{t("season.supporter.gift")}</p>
          </div>
        )}

        <div
          className={classNames("flex w-full mt-2 relative", {
            "mt-12": !isLifeTime,
          })}
        >
          <img src={SUNNYSIDE.icons.confirm} alt="Coins" className="w-5" />
          <p className="text-sm ml-2">{t("season.vip.access")}</p>
        </div>
        <p className="text-xxs ml-6">{t("goblin.exchange")}</p>
        <p className="text-xxs ml-6">{t("p2p.trading")}</p>
        <p className="text-xxs ml-6">{t("goblin.deliveries")}</p>
        <p className="text-xxs ml-6">{t("season.bonusTickets")}</p>
        <p className="text-xxs ml-6">{t("season.megastore.discount")}</p>

        <div className="flex mt-2 w-full relative">
          <img
            src={seasonalBannerImage}
            alt="Coins"
            className="w-4 ml-[0.5px]"
          />
          <p className="text-sm ml-2">{t("season.banner")}</p>
        </div>
        {isLifeTime && (
          <p className="text-xxs ml-6">
            {t("season.free.season.passes.description")}
          </p>
        )}
        <div className="flex mt-2 w-full relative">
          <img src={giftIcon} alt="Coins" className="w-5" />
          <p className="text-sm ml-2">{t("season.mystery.gift")}</p>
        </div>

        <div className="flex mt-2 mb-4 w-full relative">
          <img src={increaseIcon} alt="Coins" className="w-3 mt-1 ml-1" />
          <p className="text-sm ml-2">{t("season.xp.boost")}</p>
        </div>

        {!hasBanner && !hasLifeTime && (
          <>
            {blockBuckBalance.lt(price) ? (
              <>
                <p className="text-sm my-4">
                  {t("offer.not.enough.BlockBucks")}
                </p>
                <div className=" flex">
                  <Button onClick={onClose}>{t("back")}</Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm my-4">
                  {`Are you sure you want to purchase the ${banner} for ${price} Block Bucks?`}
                </p>
                <div className="flex">
                  <Button className="mr-1" onClick={onClose}>
                    {t("no.thanks")}
                  </Button>
                  <Button
                    onClick={() => onConfirm(banner)}
                    disabled={blockBuckBalance.lt(price) || hasBanner}
                  >
                    {t("season.buyNow")}
                  </Button>
                </div>
              </>
            )}
          </>
        )}
        {/* if has Banner or lifetime */}
        {(hasBanner || hasLifeTime) && (
          <>
            <p className="text-sm my-4">{`You already own a ${
              hasLifeTime ? "Lifetime Farmer Banner" : banner
            }.`}</p>
            <div className="flex">
              <Button className="mr-1" onClick={onClose}>
                {t("back")}
              </Button>
            </div>
          </>
        )}
      </CloseButtonPanel>
    </Modal>
  );
};
