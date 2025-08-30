import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { PetName } from "features/game/types/pets";
import { FeedPet } from "./FeedPet";

interface Props {
  show: boolean;
  onClose: () => void;
}

export const PetHouseModal: React.FC<Props> = ({ show, onClose }) => {
  const { gameService } = useContext(Context);
  const pets = useSelector(gameService, (state) => state.context.state.pets);
  const [tab, setTab] = useState<"Feed" | "Fetch">("Feed");
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
    <Modal show={show} onHide={onClose} size="lg">
      <CloseButtonPanel
        onClose={onClose}
        tabs={[
          {
            icon: ITEM_DETAILS.Barkley.image,
            name: "Feed",
            id: "Feed",
          },
          {
            icon: ITEM_DETAILS.Barkley.image,
            name: "Fetch",
            id: "Fetch",
          },
        ]}
        currentTab={tab}
        setCurrentTab={setTab}
      >
        {tab === "Feed" && <FeedPet activePets={activePets} />}
      </CloseButtonPanel>
    </Modal>
  );
};
