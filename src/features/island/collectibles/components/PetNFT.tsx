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
  isPetNFTRevealed,
} from "features/game/types/pets";
import { Transition } from "@headlessui/react";
import { PetModal } from "features/island/pets/PetModal";

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
  const [showPositiveXpPopup, setShowPositiveXpPopup] = useState(false);
  const [showNegativeXpPopup, setShowNegativeXpPopup] = useState(false);

  const isNeglected = isPetNeglected(petNFTData);
  const isNapping = isPetNapping(petNFTData);
  const isTypeFed = useSelector(gameService, _isTypeFed(id));

  if (!petNFTData) return null;

  const isRevealed = isPetNFTRevealed(Number(id), Date.now());
  const petType = getPetType(petNFTData);

  const handlePetClick = () => {
    if (isNeglected && !isTypeFed) {
      gameService.send("pet.neglected", {
        petId: Number(id),
      });
      setShowNegativeXpPopup(true);
      window.setTimeout(() => setShowNegativeXpPopup(false), 1000);
    } else if (isNapping && !isTypeFed) {
      gameService.send("pet.pet", {
        petId: Number(id),
      });
      setShowPositiveXpPopup(true);
      window.setTimeout(() => setShowPositiveXpPopup(false), 1000);
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
    >
      <Transition
        appear={true}
        show={showPositiveXpPopup || showNegativeXpPopup}
        enter="transition-opacity transition-transform duration-200"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 -translate-y-0"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="flex -top-2 left-1/2 -translate-x-1/2 absolute z-40 pointer-events-none"
        as="div"
      >
        <span
          className="text-sm yield-text"
          style={{
            color: showPositiveXpPopup
              ? "#71e358"
              : showNegativeXpPopup
                ? "#ff0000"
                : undefined,
          }}
        >
          {showPositiveXpPopup ? "+10XP" : showNegativeXpPopup ? "-500XP" : ""}
        </span>
      </Transition>
      {isRevealed && petType && (
        <PetModal
          show={showPetModal}
          onClose={() => setShowPetModal(false)}
          data={petNFTData}
          isNeglected={isNeglected}
          petType={petType}
          isTypeFed={isTypeFed}
        />
      )}
    </PetSprite>
  );
};
