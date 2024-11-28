import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { TradeableDetails } from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { TradeableDisplay } from "../lib/tradeables";

import grassBg from "assets/ui/3x3_bg.png";
import brownBg from "assets/brand/brown_background.png";

import { InventoryItemName } from "features/game/types/game";
import { getKeys } from "features/game/types/craftables";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";
import { useParams } from "react-router-dom";

export const TradeableInfo: React.FC<{
  display: TradeableDisplay;
  tradeable?: TradeableDetails;
}> = ({ display, tradeable }) => {
  const { t } = useAppTranslation();
  const params = useParams();
  const isResource = getKeys(TRADE_LIMITS).includes(
    display.name as InventoryItemName,
  );

  const isBackground = display.name.includes("Background");
  const useBrownBackground = params.collection === "wearables" || isResource;
  const background = useBrownBackground ? brownBg : grassBg;

  return (
    <>
      <InnerPanel className="w-full flex relative mb-1" style={{ padding: 0 }}>
        <div className="flex flex-wrap absolute top-2 right-2">
          {/* {tradeable && (
            <Label
              type="formula"
              icon={increaseArrow}
              className="mr-2"
            >{`42% (7D)`}</Label>
          )} */}

          {tradeable && !isResource && (
            <Label type="default">{`Supply: ${tradeable.supply}`}</Label>
          )}
        </div>

        <img
          src={isBackground ? display.image : background}
          className="w-full rounded-sm"
        />
        {!isBackground && (
          <img
            src={display.image}
            className="w-1/3 absolute"
            style={{
              left: "50%",
              transform: "translate(-50%, 50%)",
              bottom: "50%",
            }}
          />
        )}
      </InnerPanel>
      <InnerPanel>
        <div className="p-2">
          <Label type="default" className="mb-1" icon={SUNNYSIDE.icons.search}>
            {t("marketplace.description")}
          </Label>
          <p className="text-sm mb-2">{display.description}</p>
          {display.buff && (
            <Label
              icon={display.buff.boostTypeIcon}
              type={display.buff.labelType}
              className="mb-2"
            >
              {display.buff.shortDescription}
            </Label>
          )}
        </div>
      </InnerPanel>
    </>
  );
};
