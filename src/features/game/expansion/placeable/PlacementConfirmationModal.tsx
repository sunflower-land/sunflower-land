import React from "react";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

/**
 * Only the Gnome needs confirming before placement, because the three gnomes have
 * to go down in a particular order for the boost to apply.
 *
 * Temporary boosters used to confirm too, warning the player to finish anything
 * in progress first. Under the windowed model a boost applies retroactively over
 * whatever it overlaps, so there is nothing to wait for.
 */
export const needsPlacementConfirmation = (name: string) => name === "Gnome";

interface Props {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PlacementConfirmationModal: React.FC<Props> = ({
  onConfirm,
  onCancel,
}) => {
  const { t } = useAppTranslation();

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

  return (
    <ConfirmationModal
      show
      onHide={onCancel}
      messages={[]}
      bodyContent={redGnomeBoostInstruction()}
      onCancel={onCancel}
      onConfirm={onConfirm}
      confirmButtonLabel={t("place")}
    />
  );
};
