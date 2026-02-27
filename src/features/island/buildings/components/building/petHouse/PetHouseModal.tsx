import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { Pet, PetName, PetNFT } from "features/game/types/pets";
import { ManagePets } from "./ManagePets";
import { OuterPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PetGuide, PetGuideButton } from "features/pets/petGuide/PetGuide";

interface Props {
  show: boolean;
  onClose: () => void;
}

type PetHouseTab = "pets" | "guide";

export const PetHouseModal: React.FC<Props> = ({ show, onClose }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [tab, setTab] = useState<PetHouseTab>("pets");
  const pets = useSelector(gameService, (state) => state.context.state.pets);
  const petHousePets = useSelector(
    gameService,
    (state) => state.context.state.petHouse?.pets ?? {},
  );

  if (!pets) {
    return null;
  }

  const { common = {}, nfts = {} } = pets;

  // Get common pets placed in pet house
  const activeCommonPets = getObjectEntries(common).filter(([petName, pet]) => {
    if (!pet) return false;
    const placedInPetHouse = petHousePets[petName]?.some(
      (item) => !!item.coordinates,
    );
    return placedInPetHouse;
  });

  // Get NFT pets placed in pet house
  const activeNFTPets: [number, PetNFT][] = Object.entries(nfts)
    .filter(
      ([, petNFT]) => petNFT.location === "petHouse" && !!petNFT.coordinates,
    )
    .map(([id, petNFT]) => [Number(id), petNFT]);

  // Combine both pet types
  const activePets: [PetName | number, Pet | PetNFT | undefined][] = [
    ...activeCommonPets,
    ...activeNFTPets,
  ];

  return (
    <Modal show={show} onHide={onClose} size="lg">
      {tab !== "guide" && (
        <div className="flex flex-row gap-2 items-center justify-end">
          <PetGuideButton
            onShow={() => {
              setTab("guide");
            }}
          />
        </div>
      )}
      <CloseButtonPanel
        onClose={onClose}
        tabs={[
          {
            id: "pets",
            icon: ITEM_DETAILS.Barkley.image,
            name: t("pets.manage"),
          },
        ]}
        container={OuterPanel}
      >
        {tab === "pets" && <ManagePets activePets={activePets} />}
        {tab === "guide" && <PetGuide onClose={() => setTab("pets")} />}
      </CloseButtonPanel>
    </Modal>
  );
};
