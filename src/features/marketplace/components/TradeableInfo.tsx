import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { TradeableDetails } from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { TradeableDisplay } from "../lib/tradeables";

import bg from "assets/ui/3x3_bg.png";

export const TradeableInfo: React.FC<{
  display: TradeableDisplay;
  tradeable?: TradeableDetails;
}> = ({ display, tradeable }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <InnerPanel className="w-full flex relative mb-1">
        <div className="flex flex-wrap absolute top-2 right-2">
          {/* {tradeable && (
            <Label
              type="formula"
              icon={increaseArrow}
              className="mr-2"
            >{`42% (7D)`}</Label>
          )} */}

          {tradeable && tradeable.collection !== "resources" && (
            <Label type="default">{`Supply: ${tradeable.supply}`}</Label>
          )}
        </div>

        <img src={bg} className="w-full rounded-sm" />
        <img
          src={display.image}
          className="w-1/3 absolute"
          style={{
            left: "50%",
            transform: "translate(-50%, 50%)",
            bottom: "50%",
          }}
        />
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
