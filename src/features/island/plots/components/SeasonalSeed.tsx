import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { TemperateSeasonName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { SeedName } from "features/game/types/seeds";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

export const SeasonalSeed: React.FC<{
  seed: SeedName;
  season: TemperateSeasonName;
  onClose: () => void;
}> = ({ seed, season, onClose }) => {
  const { t } = useAppTranslation();
  return (
    <Panel>
      <div className="p-2">
        <Label icon={ITEM_DETAILS[seed].image} type="danger">
          {t("seasonal.wrongSeed")}
        </Label>
        <p>
          {t("seasonal.wrongSeedDescription", {
            seed,
            season,
          })}
        </p>
      </div>
      <Button onClick={onClose}>{t("close")}</Button>
    </Panel>
  );
};
