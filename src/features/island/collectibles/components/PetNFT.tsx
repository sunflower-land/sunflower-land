import React, { useContext, useState } from "react";
import { PetSprite } from "../../pets/PetSprite";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import {
  isPetNeglected,
  isPetNapping,
  getPetType,
  isPetOfTypeFed,
} from "features/game/types/pets";
import { PetModal } from "../../pets/PetModal";
import { Transition } from "@headlessui/react";

type Props = {
  id: string;
};

const _petNFTData = (id: string) => (state: MachineState) => {
  return state.context.state.pets?.nfts?.[Number(id)];
};

const _isTypeFed = (id: string) => (state: MachineState) => {
  const petData = state.context.state.pets?.nfts?.[Number(id)];
  if (!petData) return false;
  if (!petData.traits) return false;

  const isTypeFed = isPetOfTypeFed({
    nftPets: state.context.state.pets?.nfts ?? {},
    petType: petData.traits.type,
    id: Number(id),
    now: Date.now(),
  });

  return isTypeFed;
};

export const PetNFT: React.FC<Props> = ({ id }) => {
  const { gameService } = useContext(Context);
  const petNFTData = useSelector(gameService, _petNFTData(id));
  const [showPetModal, setShowPetModal] = useState(false);
  const [showXpPopup, setShowXpPopup] = useState(false);

  const isNeglected = isPetNeglected(petNFTData);
  const isNapping = isPetNapping(petNFTData);
  const isTypeFed = useSelector(gameService, _isTypeFed(id));

  if (!petNFTData) return null;

  const isRevealed = petNFTData.revealAt < Date.now();
  const petType = getPetType(petNFTData);

  const handlePetClick = () => {
    if (isNapping && !isTypeFed) {
      gameService.send("pet.pet", {
        petId: Number(id),
      });
      setShowXpPopup(true);
      window.setTimeout(() => setShowXpPopup(false), 1000);
    } else {
      setShowPetModal(true);
    }
  };

  return (
    <PetSprite
      id={Number(id)}
      isNeglected={isNeglected}
      isNapping={isNapping}
      isTypeFed={isTypeFed}
      clickable
      onClick={handlePetClick}
      petData={petNFTData}
    >
      <Transition
        appear={true}
        show={showXpPopup}
        enter="transition-opacity transition-transform duration-200"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 -translate-y-0"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="flex -top-2 left-1/2 -translate-x-1/2 absolute z-40 pointer-events-none"
        as="div"
      >
        <span className="text-sm yield-text" style={{ color: "#71e358" }}>
          {"+10XP"}
        </span>
      </Transition>
      {isRevealed && petType && (
        <PetModal
          show={showPetModal}
          onClose={() => setShowPetModal(false)}
          petId={Number(id)}
          data={petNFTData}
          isNeglected={isNeglected}
          petType={petType}
          isTypeFed={isTypeFed}
        />
      )}
    </PetSprite>
  );
};
