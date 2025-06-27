import React, { useContext, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import {
  getMarketPrice,
  getResourceTax,
  TradeableDetails,
} from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { TradeableDisplay } from "../lib/tradeables";

import grassBg from "assets/ui/3x3_bg.png";
import brownBg from "assets/brand/brown_background.png";
import lockIcon from "assets/icons/lock.png";
import crownIcon from "assets/icons/vip.webp";

import { InventoryItemName } from "features/game/types/game";
import { isTradeResource } from "features/game/actions/tradeLimits";
import { useParams } from "react-router";
import { TradeableStats } from "./TradeableStats";
import { secondsToString } from "lib/utils/time";
import {
  BUMPKIN_RELEASES,
  INVENTORY_RELEASES,
} from "features/game/types/withdrawables";
import { BUMPKIN_ITEM_PART, BumpkinItem } from "features/game/types/bumpkin";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import classNames from "classnames";
import { pixelGreenBorderStyle } from "features/game/lib/style";
import { useGame } from "features/game/GameProvider";

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

export const TradeableImage: React.FC<{
  display: TradeableDisplay;
  supply?: number;
}> = ({ display, supply }) => {
  const { t } = useAppTranslation();
  const params = useParams();
  const isResource = isTradeResource(display.name as InventoryItemName);

  const isBumpkinBackground = display.name.includes("Background");
  const useBrownBackground = params.collection === "wearables" || isResource;
  const itemBackground = useBrownBackground ? brownBg : grassBg;
  const background = display.type === "buds" ? display.image : itemBackground;

  const [isPortrait, setIsPortrait] = React.useState(false);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    setIsPortrait(img.naturalHeight > img.naturalWidth);
  };

  return (
    <InnerPanel className="w-full flex relative mb-1" style={{ padding: 0 }}>
      <div className="flex flex-wrap absolute top-2 right-2">
        {/* {tradeable && (
      <Label
        type="formula"
        icon={increaseArrow}
        className="mr-2"
      >{`42% (7D)`}</Label>
    )} */}

        {supply && !isResource ? (
          <Label type="default">{t("marketplace.supply", { supply })}</Label>
        ) : null}
      </div>

      <img
        src={isBumpkinBackground ? display.image : background}
        className="w-full rounded-sm"
      />
      {!isBumpkinBackground && display.type !== "buds" && (
        <img
          src={display.image}
          className={`absolute ${isPortrait ? "h-1/2" : "w-1/3"}`}
          style={{
            left: "50%",
            transform: "translate(-50%, 50%)",
            bottom: "50%",
          }}
          onLoad={handleImageLoad}
        />
      )}
    </InnerPanel>
  );
};

export const TradeableDescription: React.FC<{
  display: TradeableDisplay;
  tradeable?: TradeableDetails;
}> = ({ display, tradeable }) => {
  const { t } = useAppTranslation();

  let tradeAt = undefined;
  let withdrawAt = undefined;
  if (tradeable?.collection === "wearables") {
    tradeAt = BUMPKIN_RELEASES[display.name as BumpkinItem]?.tradeAt;
    withdrawAt = BUMPKIN_RELEASES[display.name as BumpkinItem]?.withdrawAt;
  }

  if (tradeable?.collection === "collectibles") {
    tradeAt = INVENTORY_RELEASES[display.name as InventoryItemName]?.tradeAt;
    withdrawAt =
      INVENTORY_RELEASES[display.name as InventoryItemName]?.withdrawAt;
  }

  const canTrade = !!tradeAt && tradeAt <= new Date();
  const canWithdraw = !!withdrawAt && withdrawAt <= new Date();

  const isWearable = display.type === "wearables";
  const isCollectible = display.type === "collectibles";
  const isResource = isTradeResource(display.name as InventoryItemName);

  return (
    <InnerPanel className="mb-1">
      <div className="p-2">
        <Label type="default" className="mb-1" icon={SUNNYSIDE.icons.search}>
          {t("marketplace.description")}
        </Label>
        <div className="flex flex-col space-y-1">
          <p className="text-xs mb-1">{display.description}</p>
          <div className="flex flex-col space-y-1">
            {isWearable ? (
              <div className="flex items-center space-x-1">
                <Label type="default">{t("wearable")}</Label>
                <Label type="default" className="capitalize">
                  {BUMPKIN_ITEM_PART[display.name as BumpkinItem]}
                </Label>
              </div>
            ) : isResource ? (
              <Label type="default">{t("marketplace.resource")}</Label>
            ) : (
              isCollectible && <Label type="default">{t("collectible")}</Label>
            )}
            {display.buffs.map((buff) => (
              <Label
                key={buff.shortDescription}
                icon={buff.boostTypeIcon}
                secondaryIcon={buff.boostedItemIcon}
                type={buff.labelType}
              >
                {buff.shortDescription}
              </Label>
            ))}
          </div>
        </div>
        {tradeable?.expiresAt && (
          <div className="p-2 pl-0 pb-0">
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              {`${secondsToString((tradeable.expiresAt - Date.now()) / 1000, {
                length: "short",
              })} left`}
            </Label>
          </div>
        )}
        {tradeable &&
          (!tradeable?.isActive || (tradeAt !== undefined && !tradeAt)) && (
            <div className="p-2 pl-0 pb-0">
              <Label type="danger">{t("marketplace.notForSale")}</Label>
            </div>
          )}

        {tradeable?.isVip && (
          <div className="p-2 pl-0 pb-0">
            <Label type="danger" icon={crownIcon}>
              {t("marketplace.vipOnly")}
            </Label>
          </div>
        )}
        {!canTrade && !!tradeAt && (
          <div className="p-2 pl-0 pb-0 flex items-center justify-between  flex-wrap">
            <Label type="danger" icon={SUNNYSIDE.icons.stopwatch}>
              {t("coming.soon")}
            </Label>
            <Label type="transparent">{formatDate(tradeAt)}</Label>
          </div>
        )}
        {!canWithdraw && !!withdrawAt && (
          <div className="p-2 pl-0 pb-0 flex items-center justify-between flex-wrap">
            <Label type="danger" icon={lockIcon}>
              {t("marketplace.withdrawComingSoon")}
            </Label>
            <Label type="transparent">{formatDate(withdrawAt)}</Label>
          </div>
        )}
      </div>
    </InnerPanel>
  );
};

export const TradeableInfo: React.FC<{
  display: TradeableDisplay;
  tradeable?: TradeableDetails;
}> = ({ display, tradeable }) => {
  return (
    <>
      <TradeableImage display={display} supply={tradeable?.supply} />
      <TradeableDescription display={display} tradeable={tradeable} />
      {display.type === "collectibles" &&
        isTradeResource(display.name as InventoryItemName) && <ResourceTaxes />}
    </>
  );
};

export const TradeableMobileInfo: React.FC<{
  display: TradeableDisplay;
  tradeable?: TradeableDetails;
}> = ({ display, tradeable }) => {
  const marketPrice = getMarketPrice({ tradeable });
  return (
    <>
      <div className="flex justify-between gap-1 items-center">
        <TradeableImage display={display} supply={tradeable?.supply} />
        <TradeableStats
          history={tradeable?.history}
          marketPrice={marketPrice}
        />
      </div>
      <TradeableDescription display={display} tradeable={tradeable} />
    </>
  );
};

export const ResourceTaxes: React.FC = () => {
  const { t } = useAppTranslation();
  const [showModal, setShowModal] = useState(false);
  const { openModal } = useContext(ModalContext);
  const { gameState } = useGame();

  const tax = getResourceTax({ game: gameState.context.state });

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel onClose={() => setShowModal(false)}>
          <Label type="default" className="mb-1">
            {t("marketplace.economy.title")}
          </Label>
          <div className="p-1">
            <p className="text-sm mb-1">
              {t("marketplace.economy.description")}
            </p>
          </div>
          <NoticeboardItems
            items={[
              {
                icon: SUNNYSIDE.icons.cancel,
                text: t("marketplace.economy.tutorialIsland"),
              },
              {
                icon: SUNNYSIDE.icons.heart,
                text: t("marketplace.economy.petalParadise"),
              },
              {
                icon: SUNNYSIDE.icons.heart,
                text: t("marketplace.economy.desertIsland"),
              },
              {
                icon: SUNNYSIDE.icons.heart,
                text: t("marketplace.economy.volcanoIsland"),
              },
            ]}
          />
          <p className="text-xs p-1">{t("marketplace.economy.protection")}</p>
        </CloseButtonPanel>
        <div
          className={classNames(
            `w-full items-center flex  text-xs p-1 pr-4 mt-1 relative`,
          )}
          style={{
            background: "#3e8948",
            color: "#ffffff",
            ...pixelGreenBorderStyle,
          }}
        >
          <img src={crownIcon} className="w-8 mr-2" />
          <div>
            <p className="text-xs flex-1">
              {t("marketplace.vip.resourceDiscount")}
            </p>
            <span
              onClick={() => openModal("VIP_ITEMS")}
              className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500 mb-2 text-white"
            >
              {t("read.more")}
            </span>
          </div>
        </div>
      </Modal>
      <InnerPanel
        className="mb-1 cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="flex justify-between items-center px-1 relative">
          <div className="flex items-center ">
            <img src={lockIcon} className="w-4 mr-1" />
            <div>
              <p className="text-xs">
                {t("marketplace.resourceFee", { tax: tax * 100 })}
              </p>
            </div>
          </div>
        </div>
        <p className="text-xxs italic underline mb-0.5 pl-1">
          {t("marketplace.unlocks.perks")}
        </p>
      </InnerPanel>
    </>
  );
};
