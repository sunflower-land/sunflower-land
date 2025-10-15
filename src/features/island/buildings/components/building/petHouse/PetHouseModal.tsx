import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { PetName } from "features/game/types/pets";
import { ManagePets } from "./ManagePets";
import { OuterPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasFeatureAccess } from "lib/flags";

interface Props {
  show: boolean;
  onClose: () => void;
}

export const PetHouseModal: React.FC<Props> = ({ show, onClose }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const pets = useSelector(gameService, (state) => state.context.state.pets);
  const PlacedCollectibles = (petName: PetName) => {
    const collectibles = useSelector(gameService, (state) =>
      state.context.state.collectibles[petName]?.filter(
        (collectible) => !!collectible.coordinates,
      ),
    );
    const homeCollectibles = useSelector(gameService, (state) =>
      state.context.state.home.collectibles[petName]?.filter(
        (collectible) => !!collectible.coordinates,
      ),
    );
    return [...(collectibles || []), ...(homeCollectibles || [])];
  };
  const hasPetsAccess = useSelector(gameService, (state) =>
    hasFeatureAccess(state.context.state, "PET_HOUSE"),
  );

  if (!hasPetsAccess || !pets) {
    return null;
  }

  const { common = {} } = pets;

  const activePets = getObjectEntries(common).filter(
    ([petName, pet]) => pet && PlacedCollectibles(petName).length > 0,
  );

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <CloseButtonPanel
        onClose={onClose}
        tabs={[
          {
            icon: ITEM_DETAILS.Barkley.image,
            name: t("pets.manage"),
          },
        ]}
        container={OuterPanel}
      >
        <ManagePets activePets={activePets} />
      </CloseButtonPanel>
    </Modal>
  );
};
