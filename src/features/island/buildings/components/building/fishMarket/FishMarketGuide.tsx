import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import {
  GUARANTEED_BAIT,
  GUARANTEED_CATCH_BY_BAIT,
  FishName,
} from "features/game/types/fishing";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";

const FishRow: React.FC<{ fish: FishName; alternateBg?: boolean }> = ({
  fish,
  alternateBg,
}) => (
  <div
    className={`flex items-center p-1 ${
      alternateBg ? "bg-[#ead4aa] rounded-md" : ""
    }`}
  >
    <img src={ITEM_DETAILS[fish].image} className="w-6 h-auto mr-2" />
    <p className="text-xs">{fish}</p>
  </div>
);

export const FishMarketGuide = () => {
  const { t } = useAppTranslation();

  return (
    <InnerPanel className="scrollable max-h-[300px] overflow-y-scroll">
      <div className="p-1">
        <Label type="default" icon={SUNNYSIDE.tools.fishing_rod}>
          {t("guaranteedCatch.guide.title")}
        </Label>
        <p className="text-xs pl-1 pt-1.5">{t("guaranteedCatch.guide.info")}</p>
      </div>
      <div>
        {GUARANTEED_BAIT.map((bait) => (
          <div className="mb-2" key={bait}>
            <Label
              type="default"
              icon={ITEM_DETAILS[bait].image}
              className="my-2 ml-1.5"
            >
              {bait}
            </Label>
            <div className="flex flex-col p-1">
              {GUARANTEED_CATCH_BY_BAIT[bait].map((item, index) => (
                <FishRow key={item} fish={item} alternateBg={index % 2 === 0} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </InnerPanel>
  );
};
