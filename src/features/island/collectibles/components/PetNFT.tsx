import React, { useContext, useState } from "react";
import { PetSprite } from "../../pets/PetSprite";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import {
  isPetNeglected,
  isPetNapping,
  getPetType,
} from "features/game/types/pets";
import { PetModal } from "../../pets/PetModal";
import { ITEM_DETAILS } from "features/game/types/images";

type Props = {
  id: string;
};

const _petNFTData = (id: string) => (state: MachineState) => {
  return state.context.state.pets?.nfts?.[Number(id)];
};

export const PetNFT: React.FC<Props> = ({ id }) => {
  const { gameService } = useContext(Context);
  const petNFTData = useSelector(gameService, _petNFTData(id));
  const [showPetModal, setShowPetModal] = useState(false);

  const isNeglected = isPetNeglected(petNFTData);
  const isNapping = isPetNapping(petNFTData);

  if (!petNFTData) return null;

  const isRevealed = petNFTData.revealAt < Date.now();
  const petType = getPetType(petNFTData);

  if (!isRevealed || !petType) {
    return <img src={ITEM_DETAILS["Pet Egg"].image} />;
  }

  return (
    <PetSprite
      id={Number(id)}
      isNeglected={isNeglected}
      isNapping={isNapping}
      clickable
    >
      <PetModal
        show={showPetModal}
        onClose={() => setShowPetModal(false)}
        petId={Number(id)}
        data={petNFTData}
        isNeglected={isNeglected}
        petType={petType}
      />
    </PetSprite>
  );
};
