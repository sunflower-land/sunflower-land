import { Label } from "components/ui/Label";
import { Pet, PetName } from "features/game/types/pets";
import React, { useContext } from "react";
import { FeedPetCard } from "./FeedPetCard";
import { Button } from "components/ui/Button";
import { CookableName } from "features/game/types/consumables";
import { Context } from "features/game/GameProvider";
import cancel from "assets/icons/cancel.png";
type Props = {
  activePets: [PetName, Pet | undefined][];
};

export const FeedPet: React.FC<Props> = ({ activePets }) => {
  const [isBulkFeed, setIsBulkFeed] = React.useState(false);
  const { gameService } = useContext(Context);
  const [selectedFeed, setSelectedFeed] = React.useState<
    {
      petName: PetName;
      food: CookableName;
    }[]
  >([]);

  const handleConfirmFeed = () => {
    // Event to handle Bulk Feed
    selectedFeed.forEach((item) => {
      try {
        gameService.send("pet.fed", {
          pet: item.petName,
          food: item.food,
        });
      } catch (error) {
        // If error do nothing
      }
    });
    setSelectedFeed([]);
    setIsBulkFeed(false);
  };

  const handleBulkFeed = () => {
    if (!isBulkFeed) {
      setIsBulkFeed(true);
    } else {
      handleConfirmFeed();
    }
  };

  return (
    <div className="flex flex-col gap-2 m-1">
      <div className="flex flex-row justify-between mr-2">
        <Label type={"formula"}>{`Your Pets (${activePets.length})`}</Label>
        <div className="flex flex-row gap-2 ">
          <Button className="w-40" onClick={handleBulkFeed}>
            {isBulkFeed ? `Confirm Feed` : `Bulk Feed`}
          </Button>
          {isBulkFeed && (
            <Button
              className="w-6 h-6"
              onClick={() => {
                setSelectedFeed([]);
                setIsBulkFeed(false);
              }}
            >
              <img src={cancel} alt="Clear" />
            </Button>
          )}
        </div>
      </div>
      {activePets.length === 0 ? (
        <p className="p-4 text-center text-gray-500">
          {`You don't have any pets yet. Visit the Pet Shop to get your first pet!`}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mr-2 max-h-[500px] overflow-y-auto scrollable">
          {activePets.map(
            ([petName, pet]) =>
              pet && (
                <FeedPetCard
                  key={petName}
                  petName={petName}
                  pet={pet}
                  isBulkFeed={isBulkFeed}
                  selectedFeed={selectedFeed}
                  setSelectedFeed={setSelectedFeed}
                />
              ),
          )}
        </div>
      )}
    </div>
  );
};
