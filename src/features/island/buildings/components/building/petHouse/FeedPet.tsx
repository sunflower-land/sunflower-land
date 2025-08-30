import { Label } from "components/ui/Label";
import { Pet, PetName } from "features/game/types/pets";
import React from "react";
import { FeedPetCard } from "./FeedPetCard";

type Props = {
  activePets: [PetName, Pet | undefined][];
};

export const FeedPet: React.FC<Props> = ({ activePets }) => {
  return (
    <div className="flex flex-col gap-2 m-1 max-h-[500px] overflow-y-auto scrollable">
      <Label type={"formula"}>{`Your Pets (${activePets.length})`}</Label>
      {activePets.length === 0 ? (
        <p className="p-4 text-center text-gray-500">
          {`You don't have any pets yet. Visit the Pet Shop to get your first pet!`}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mr-2 auto-rows-fr">
          {activePets.map(
            ([petName, pet]) =>
              pet && <FeedPetCard key={petName} petName={petName} pet={pet} />,
          )}
        </div>
      )}
    </div>
  );
};
