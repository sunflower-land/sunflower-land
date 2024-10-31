import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { SeasonName } from "features/game/types/seasons";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

type SeasonalMutants = {
  banner: string;
  chicken: InventoryItemName;
  flower: InventoryItemName;
  fish: InventoryItemName;
};

const DEFAULT: SeasonalMutants = {
  chicken: "Fat Chicken",
  flower: "Red Pansy",
  fish: "Anchovy",
  banner: "?",
};

const SEASONAL_MUTANTS: Partial<Record<SeasonName, SeasonalMutants>> = {
  "Bull Run": {
    chicken: "Alien Chicken",
    flower: "Chicory",
    fish: "Longhorn Cowfish",
    banner: SUNNYSIDE.announcement.bullRunSeasonRares,
  },
};

interface Props {
  season: SeasonName;
}
export const SeasonalMutants: React.FC<Props> = ({ season }) => {
  const mutants = SEASONAL_MUTANTS[season];

  const { t } = useAppTranslation();

  if (!mutants) {
    return null;
  }
  return (
    <InnerPanel className="mb-1">
      <div className="p-1">
        <div className="flex justify-between mb-2">
          <Label className="-ml-1" type="default">
            {t("season.codex.mutants")}
          </Label>
        </div>
        <p className="text-xs">{t("season.codex.mutants.discover")}</p>
        <img className="my-1 w-full rounded-md" src={mutants.banner} />

        <NoticeboardItems
          iconWidth={8}
          items={[
            {
              text: t("season.codex.mutants.one", {
                item: mutants.chicken,
              }),
              icon: ITEM_DETAILS.Chicken.image,
            },
            {
              text: t("season.codex.mutants.two", {
                item: mutants.fish,
              }),

              icon: ITEM_DETAILS.Rod.image,
            },
            {
              text: t("season.codex.mutants.three", {
                item: mutants.flower,
              }),
              icon: ITEM_DETAILS["Red Pansy"].image,
            },
          ]}
        />
      </div>
    </InnerPanel>
  );
};
