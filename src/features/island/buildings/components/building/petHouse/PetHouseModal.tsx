import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { Label } from "components/ui/Label";
import { PetCard } from "./PetCard";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { PetName } from "features/game/types/pets";

interface Props {
  show: boolean;
  onClose: () => void;
}

export const PetHouseModal: React.FC<Props> = ({ show, onClose }) => {
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

  const { commonPets } = pets;

  const activePets = getObjectEntries(commonPets).filter(
    ([petName, pet]) => pet && PlacedCollectibles(petName).length > 0,
  );

  return (
    <Modal show={show} onHide={onClose}>
      <CloseButtonPanel
        onClose={onClose}
        tabs={[
          {
            icon:
              ITEM_DETAILS["Pet House"]?.image || ITEM_DETAILS.Barkley.image,
            name: "Pet House",
          },
        ]}
      >
        <div className="m-1">
          <Label className="mb-2 block" type={"formula"}>
            {`Your Pets (${activePets.length})`}
          </Label>
          {activePets.length === 0 ? (
            <p className="p-4 text-center text-gray-500">
              {`You don't have any pets yet. Visit the Pet Shop to get your
                first pet!`}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto scrollable">
              {activePets.map(
                ([petName, pet]) =>
                  pet && <PetCard key={petName} petName={petName} pet={pet} />,
              )}
            </div>
          )}
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
