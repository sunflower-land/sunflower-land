import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { TradeableDetails } from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { TradeableDisplay } from "../lib/tradeables";

import grassBg from "assets/ui/3x3_bg.png";
import brownBg from "assets/brand/brown_background.png";
import lightningIcon from "assets/icons/lightning.png";
import { InventoryItemName } from "features/game/types/game";
import { getKeys } from "features/game/types/craftables";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";
import { useParams } from "react-router";
import { TradeableStats } from "./TradeableStats";
import { secondsToString } from "lib/utils/time";

export const TradeableImage: React.FC<{
  display: TradeableDisplay;
  supply?: number;
}> = ({ display, supply }) => {
  const { t } = useAppTranslation();
  const params = useParams();
  const isResource = getKeys(TRADE_LIMITS).includes(
    display.name as InventoryItemName,
  );

  const isBackground = display.name.includes("Background");
  const useBrownBackground = params.collection === "wearables" || isResource;
  const background = useBrownBackground ? brownBg : grassBg;

  const [isPortrait, setIsPortrait] = React.useState(false);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    setIsPortrait(img.naturalHeight > img.naturalWidth);
  };

  return (
    <div className="w-full flex relative mb-1" style={{ padding: 0 }}>
      <div className="flex flex-wrap absolute top-2 right-2">
        {/* {tradeable && (
      <Label
        type="formula"
        icon={increaseArrow}
        className="mr-2"
      >{`42% (7D)`}</Label>
    )} */}

        {!!supply && !isResource && (
          <Label type="default">{t("marketplace.supply", { supply })}</Label>
        )}
      </div>

      <img
        src={isBackground ? display.image : background}
        className="w-full rounded-sm"
      />
      {!isBackground && (
        <img
          src={display.image}
          className={`absolute rounded-md ${isPortrait ? "h-1/2" : "w-1/3"}`}
          style={{
            left: "50%",
            transform: "translate(-50%, 50%)",
            bottom: "50%",
          }}
          onLoad={handleImageLoad}
        />
      )}
    </div>
  );
};

export const TradeableDescription: React.FC<{
  display: TradeableDisplay;
  tradeable?: TradeableDetails;
}> = ({ display, tradeable }) => {
  const { t } = useAppTranslation();

  return (
    <div>
      <div className="p-2">
        <div className="flex items-center justify-between">
          <Label type="default" className="mb-1" icon={SUNNYSIDE.icons.search}>
            {t("marketplace.about")}
          </Label>
          {tradeable && !tradeable?.isActive && (
            <Label type="danger" icon={SUNNYSIDE.icons.stopwatch}>
              {t("marketplace.notForSale")}
            </Label>
          )}
        </div>
        <p className="text-sm mb-2">{display.description}</p>
        {display.buff && (
          <Label
            icon={
              display.buff.boostedItemIcon ??
              display.buff.boostTypeIcon ??
              lightningIcon
            }
            type={"transparent"}
            className="mb-2 ml-2"
          >
            {display.buff.shortDescription}
          </Label>
        )}
      </div>
      {tradeable?.expiresAt && (
        <div className="p-2">
          <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
            {`${secondsToString((tradeable.expiresAt - Date.now()) / 1000, {
              length: "short",
            })} left`}
          </Label>
        </div>
      )}
    </div>
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
    </>
  );
};

export const TradeableMobileInfo: React.FC<{
  display: TradeableDisplay;
  tradeable?: TradeableDetails;
}> = ({ display, tradeable }) => {
  let latestSale = 0;
  if (tradeable?.history.sales.length) {
    latestSale =
      tradeable.history.sales[0].sfl / tradeable.history.sales[0].quantity;
  }

  return (
    <div className="flex justify-between gap-1 items-center">
      <TradeableImage display={display} supply={tradeable?.supply} />
      <TradeableStats history={tradeable?.history} price={latestSale} />
    </div>
  );
};
