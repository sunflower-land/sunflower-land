import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { getObjectEntries } from "lib/object";
import type { Pet, PetName, PetNFT } from "features/game/types/pets";
import { ManagePets } from "./ManagePets";
import { PetsTab } from "./PetsTab";
import { FeedTab } from "./FeedTab";
import { OuterPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PetGuide, PetGuideButton } from "features/pets/petGuide/PetGuide";
import { SUNNYSIDE } from "assets/sunnyside";
import foodIcon from "assets/food/chicken_drumstick.png";
import { hasFeatureAccess } from "lib/flags";
import type { MachineState } from "features/game/lib/gameMachine";

interface Props {
  show: boolean;
  onClose: () => void;
}

type LegacyPetHouseTab = "pets" | "guide";
type PetHouseTab = "pets" | "feed" | "guides";

const _state = (state: MachineState) => state.context.state;

export const PetHouseModal: React.FC<Props> = ({ show, onClose }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  // Redesigned Pets/Feed/Guides tabs are beta/testnet-only (PET_HOUSE_TABS)
  // until they've had time to bake — everyone else keeps the tab layout
  // that shipped before this redesign.
  const hasTabsAccess = hasFeatureAccess(state, "PET_HOUSE_TABS");

  const [tab, setTab] = useState<PetHouseTab>("pets");
  const [legacyTab, setLegacyTab] = useState<LegacyPetHouseTab>("pets");
  const pets = state.pets;
  const petHousePets = state.petHouse?.pets ?? {};

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

  if (!hasTabsAccess) {
    return (
      <Modal show={show} onHide={onClose} size="lg">
        {legacyTab !== "guide" && (
          <div className="flex flex-row gap-2 items-center justify-end">
            <PetGuideButton onShow={() => setLegacyTab("guide")} />
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
          {legacyTab === "pets" && <ManagePets activePets={activePets} />}
          {legacyTab === "guide" && (
            <PetGuide onClose={() => setLegacyTab("pets")} />
          )}
        </CloseButtonPanel>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <CloseButtonPanel
        onClose={onClose}
        currentTab={tab}
        setCurrentTab={setTab}
        tabs={[
          {
            id: "pets",
            icon: ITEM_DETAILS.Barkley.image,
            name: t("pets.tabPets"),
          },
          {
            id: "feed",
            icon: foodIcon,
            name: t("pets.tabFeed"),
          },
          {
            id: "guides",
            icon: SUNNYSIDE.icons.expression_confused,
            name: t("pets.tabGuides"),
          },
        ]}
        container={OuterPanel}
      >
        {tab === "pets" && <PetsTab activePets={activePets} />}
        {tab === "feed" && <FeedTab activePets={activePets} />}
        {tab === "guides" && <PetGuide />}
      </CloseButtonPanel>
    </Modal>
  );
};
