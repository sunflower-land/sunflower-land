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
import { CookableName } from "features/game/types/consumables";

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
      <CloseButtonPanel
        onClose={onClose}
        tabs={[
          { name: "Info", icon: ITEM_DETAILS[petName].image, id: "Info" },
          { name: "Feed", icon: ITEM_DETAILS[petName].image, id: "Feed" },
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
