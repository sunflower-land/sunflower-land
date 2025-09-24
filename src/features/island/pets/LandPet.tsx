import React, { useContext, useState } from "react";
import {
  getPetType,
  isPetNapping,
  isPetNeglected,
  PetName,
} from "features/game/types/pets";
import { PetModal } from "./PetModal";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { Transition } from "@headlessui/react";
import { PetSprite } from "./PetSprite";
import { _petData } from "./lib/petShared";

export const LandPet: React.FC<{ name: PetName }> = ({ name }) => {
  const [showPetModal, setShowPetModal] = useState(false);
  const [showXpPopup, setShowXpPopup] = useState(false);
  const { gameService } = useContext(Context);

  const petData = useSelector(gameService, _petData(name));

  const isNeglected = isPetNeglected(petData);
  const isNapping = isPetNapping(petData);
  const petType = getPetType(petData);

  if (!petType || !petData) {
    return null;
  }

  const handlePetClick = () => {
    if (isNapping) {
      gameService.send("pet.pet", {
        petId: name,
      });
      setShowXpPopup(true);
      window.setTimeout(() => setShowXpPopup(false), 1000);
    } else {
      setShowPetModal(true);
    }
  };

  return (
    <PetSprite
      id={name}
      isNeglected={isNeglected}
      isNapping={isNapping}
      onClick={handlePetClick}
      clickable
      petData={petData}
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
      <PetModal
        show={showPetModal}
        onClose={() => setShowPetModal(false)}
        petId={name}
        isNeglected={isNeglected}
        petType={petType}
        data={petData}
      />
    </PetSprite>
  );
};
