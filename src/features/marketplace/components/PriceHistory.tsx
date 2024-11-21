import React from "react";
import tradeIcon from "assets/icons/trade.png";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PriceHistory as IPriceHistory } from "features/game/types/marketplace";
import { Loading } from "features/auth/components";
import { SUNNYSIDE } from "assets/sunnyside";
import { CONFIG } from "lib/config";

interface Props {
  history?: IPriceHistory[];
}

export const PriceHistory: React.FC<Props> = ({ history }) => {
  const { t } = useAppTranslation();

  const lastSold = history?.reverse().find((p) => !!p.price);

  if (CONFIG.NETWORK === "mainnet") {
    return (
      <InnerPanel className="mb-1">
        <p>{t("coming.soon")}</p>
      </InnerPanel>
    );
  }

  return (
    <InnerPanel className="mb-1">
      <div className="p-2">
        <div className="flex items-center justify-between mb-2">
          <Label icon={tradeIcon} type="default" className="mb-1">
            {t("marketplace.priceHistory")}
          </Label>
          {!!lastSold && (
            <p className="text-xs">
              {t("marketplace.lastSold", { sfl: lastSold.price })}
            </p>
          )}
        </div>
        <div className="h-[130px] w-full pb-4">
          {/* Full width */}
          <PriceChart history={history} />
        </div>
      </div>
    </InnerPanel>
  );
};

function formatDate(date: string) {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export const PriceChart: React.FC<Props> = ({ history }) => {
  const { t } = useAppTranslation();

  if (!history) {
    return <Loading />;
  }

  const hasSale = history.some((day) => !!day.price);

  if (!hasSale) {
    return (
      <div className="flex h-full items-center justify-center">
        {t("marketplace.noSales")}
      </div>
    );
  }
  const max = Math.max(1, ...history.map((h) => h.price)) * 1.25;

  return (
    <div className="h-full w-full flex">
      <div className="w-8 text-xs h-full  flex flex-col justify-between items-end">
        <span>
          {Math.floor(max)}
          {`-`}
        </span>
        <span>
          {Math.floor(max / 2)}
          {`-`}
        </span>
        <span>{`0-`}</span>
      </div>
      <div className="flex-1 h-full">
        <div
          className="h-full flex-1 flex"
          style={{
            borderLeft: "1px solid #3e2731",
            borderBottom: "1px solid #3e2731",
          }}
        >
          {/* Ensure full width and height */}
          {history.map((day) => (
            <div
              key={day.date}
              className="h-full relative group"
              style={{
                width: `${100 / history.length}%`,
                paddingLeft: 1,
                paddingRight: 1,
              }}
            >
              <div
                className="w-full bg-[#714431] absolute bottom-0"
                style={{
                  height: `${(day.price / max) * 100}%`,
                  borderTopLeftRadius: 3,
                  borderTopRightRadius: 3,
                }}
              />
              <InnerPanel className="absolute text-xs -top-8 -right-16 w-32 shadow-lg opacity-0 group-hover:opacity-100 z-10">
                <p>{`Avg. price: ${day.price}`}</p>
                <p>{`Num. sales: ${day.sales}`}</p>
                <p>{formatDate(day.date)}</p>
              </InnerPanel>
              <img
                src={SUNNYSIDE.icons.chevron_right}
                className="h-5 absolute left-0 -bottom-2 -rotate-90 opacity-0 group-hover:opacity-100 z-10"
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </div>
          ))}
        </div>
        {history.length && (
          <div className="text-xs w-full  flex justify-between items-center">
            <span className="italic">{formatDate(history[0].date)}</span>
            <span className="italic">
              {formatDate(history[Math.floor(history.length / 2)].date)}
            </span>
            <span className="italic">
              {formatDate(history[history.length - 1].date)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
