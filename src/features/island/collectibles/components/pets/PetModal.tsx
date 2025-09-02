import React, { useContext, useState } from "react";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { PetName } from "features/game/types/pets";
import { PetInfo } from "./PetInfo";
import { PetFeed } from "./PetFeed";
import { OuterPanel } from "components/ui/Panel";
import foodIcon from "assets/food/chicken_drumstick.png";
import { CookableName } from "features/game/types/consumables";
import { Label } from "components/ui/Label";

interface Props {
  show: boolean;
  onClose: () => void;
  petName: PetName;
}

export const PetModal: React.FC<Props> = ({ show, onClose, petName }) => {
  const { gameService } = useContext(Context);
  const [tab, setTab] = useState<"Info" | "Feed" | "Fetch">("Info");

  const petData = useSelector(
    gameService,
    (state) => state.context.state.pets.commonPets[petName],
  );
  const inventory = useSelector(
    gameService,
    (state) => state.context.state.inventory,
  );
  const hasPetHouse = useSelector(
    gameService,
    (state) =>
      state.context.state.inventory["Pet House"]?.greaterThan(0) ?? false,
  );
  const hasThreeOrMorePets = useSelector(gameService, (state) => {
    return (
      Object.values({
        ...state.context.state.pets.commonPets,
        ...state.context.state.pets.nftPets,
      }).length >= 3
    );
  });
  const showBuildPetHouse = !hasPetHouse && hasThreeOrMorePets;

  if (!petData) {
    return null;
  }

  const handleFeed = (food: CookableName) => {
    gameService.send("pet.fed", {
      pet: petName,
      food,
    });
  };

  return (
    <Modal show={show} onHide={onClose}>
      {showBuildPetHouse && (
        <div className="absolute top-[-4rem] right-0 flex flex-col gap-1 items-end justify-end">
          <Label type="info">{`Tired of managing your pets individually?`}</Label>
          <Label type="vibrant" secondaryIcon={ITEM_DETAILS["Pet House"].image}>
            {`Build a pet house from blacksmith to manage all of them together!`}
          </Label>
        </div>
      )}
      <CloseButtonPanel
        onClose={onClose}
        tabs={[
          { name: "Info", icon: ITEM_DETAILS[petName].image, id: "Info" },
          { name: "Feed", icon: foodIcon, id: "Feed" },
          { name: "Fetch", icon: ITEM_DETAILS[petName].image, id: "Fetch" },
        ]}
        currentTab={tab}
        setCurrentTab={setTab}
        container={tab === "Feed" ? OuterPanel : undefined}
      >
        {tab === "Info" && <PetInfo petName={petName} petData={petData} />}
        {tab === "Feed" && (
          <PetFeed
            petName={petName}
            petData={petData}
            handleFeed={handleFeed}
            inventory={inventory}
          />
        )}
      </CloseButtonPanel>
    </Modal>
  );
};
