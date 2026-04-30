import React from "react";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { ITEM_DETAILS } from "features/game/types/images";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { HOURGLASSES } from "features/game/events/landExpansion/burnCollectible";
import { HourglassType } from "features/island/collectibles/components/Hourglass";
import { TranslationKeys } from "lib/i18n/dictionaries/types";

type TimeBasedConsumables = HourglassType | "Time Warp Totem" | "Super Totem";

export const needsPlacementConfirmation = (name: string) =>
  name === "Gnome" ||
  HOURGLASSES.includes(name as HourglassType) ||
  name === "Time Warp Totem" ||
  name === "Super Totem";

interface Props {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PlacementConfirmationModal: React.FC<Props> = ({
  itemName,
  onConfirm,
  onCancel,
}) => {
  const { t } = useAppTranslation();

  const getResourceNodeCondition = (hourglass: TimeBasedConsumables) => {
    const hourglassCondition: Record<TimeBasedConsumables, TranslationKeys> = {
      "Blossom Hourglass": "landscape.hourglass.resourceNodeCondition.blossom",
      "Gourmet Hourglass": "landscape.hourglass.resourceNodeCondition.gourmet",
      "Harvest Hourglass": "landscape.hourglass.resourceNodeCondition.harvest",
      "Orchard Hourglass": "landscape.hourglass.resourceNodeCondition.orchard",
      "Ore Hourglass": "landscape.hourglass.resourceNodeCondition.ore",
      "Timber Hourglass": "landscape.hourglass.resourceNodeCondition.timber",
      "Time Warp Totem": "landscape.timeWarpTotem.resourceNodeCondition",
      "Super Totem": "landscape.superTotem.resourceNodeCondition",
      "Fisher's Hourglass": "landscape.hourglass.resourceNodeCondition.fishers",
    };
    return t(hourglassCondition[hourglass], { selectedChestItem: itemName });
  };

  const redGnomeBoostInstruction = () => (
    <div className="flex flex-col gap-y-2 text-xs">
      <p>{t("landscape.confirmation.gnomes.one")}</p>
      <p>{t("landscape.confirmation.gnomes.two")}</p>
      <div className="flex justify-center mt-2 space-x-2">
        <img src={ITEM_DETAILS["Cobalt"].image} className="w-12" />
        <img src={ITEM_DETAILS["Gnome"].image} className="w-12" />
        <img src={ITEM_DETAILS["Clementine"].image} className="w-12" />
      </div>
      <div className="flex justify-center">
        <img src={ITEM_DETAILS["Crop Plot"].image} className="w-12" />
      </div>
    </div>
  );

  const messages =
    itemName === "Gnome"
      ? [redGnomeBoostInstruction()]
      : [
          getResourceNodeCondition(itemName as TimeBasedConsumables),
          t("landscape.confirmation.hourglass.one", {
            selectedChestItem: itemName,
          }),
          t("landscape.confirmation.hourglass.two", {
            selectedChestItem: itemName,
          }),
          itemName === "Time Warp Totem" || itemName === "Super Totem" ? (
            <Label type="danger" icon={SUNNYSIDE.icons.cancel}>
              {t("landscape.timeWarpTotem.nonStack")}
            </Label>
          ) : (
            ""
          ),
        ];

  return (
    <ConfirmationModal
      show
      onHide={onCancel}
      messages={messages}
      onCancel={onCancel}
      onConfirm={onConfirm}
      confirmButtonLabel={t("place")}
    />
  );
};
