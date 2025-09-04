import React, { useContext, useState } from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import {
  isPetNapping,
  isPetNeglected,
  PetName,
} from "features/game/types/pets";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { PetModal } from "./PetModal";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import barkleyAsleep from "assets/sfts/pets/dogs/barkley_asleep.webp";
import biscuitAsleep from "assets/sfts/pets/dogs/biscuit_asleep.webp";
import cloudyAsleep from "assets/sfts/pets/dogs/cloudy_asleep.webp";
import meowchiAsleep from "assets/sfts/pets/cats/meowchi_asleep.webp";
import buttersAsleep from "assets/sfts/pets/cats/butters_asleep.webp";
import smokeyAsleep from "assets/sfts/pets/cats/smokey_asleep.webp";
import twizzleAsleep from "assets/sfts/pets/owls/twizzle_asleep.webp";
import flickerAsleep from "assets/sfts/pets/owls/flicker_asleep.webp";
import pippinAsleep from "assets/sfts/pets/owls/pippin_asleep.webp";
import burroAsleep from "assets/sfts/pets/horses/burro_asleep.webp";
import pintoAsleep from "assets/sfts/pets/horses/pinto_asleep.webp";
import roanAsleep from "assets/sfts/pets/horses/roan_asleep.webp";
import stallionAsleep from "assets/sfts/pets/horses/stallion_asleep.webp";
import mudhornAsleep from "assets/sfts/pets/bulls/mudhorn_asleep.webp";
import bisonAsleep from "assets/sfts/pets/bulls/bison_asleep.webp";
import oxenAsleep from "assets/sfts/pets/bulls/oxen_asleep.webp";
import nibblesAsleep from "assets/sfts/pets/hamsters/nibbles_asleep.webp";
import peanutsAsleep from "assets/sfts/pets/hamsters/peanuts_asleep.webp";
import waddlesAsleep from "assets/sfts/pets/penguins/waddles_asleep.webp";
import pipAsleep from "assets/sfts/pets/penguins/pip_asleep.webp";
import skipperAsleep from "assets/sfts/pets/penguins/skipper_asleep.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import { useVisiting } from "lib/utils/visitUtils";
import classNames from "classnames";
import { Transition } from "@headlessui/react";

const PETS_STYLES: Record<
  PetName,
  {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    width?: number;
    height?: number;
  }
> = {
  // Dogs
  Barkley: { width: 20, bottom: 22, left: -2 },
  Biscuit: { width: 20, bottom: 22, left: -1.5 },
  Cloudy: { width: 20, bottom: 25, left: -2 },

  // Cats
  Meowchi: { width: 20, bottom: 23, left: -1.5 },
  Butters: { width: 20, bottom: 23, left: -1.5 },
  Smokey: { width: 20, bottom: 23, left: -1.5 },

  // Owls
  Twizzle: { width: 17, bottom: 19 },
  Flicker: { width: 17, bottom: 22 },
  Pippin: { width: 17, bottom: 22 },

  // Horses
  Burro: { width: 20, bottom: 23, left: -2 },
  Pinto: { width: 22, bottom: 24, left: -3.5 },
  Roan: { width: 19, bottom: 25, left: -1.5 },
  Stallion: { width: 21, bottom: 24, left: -2.5 },

  // Bulls
  Mudhorn: { width: 23, bottom: 26, left: -4.25 },
  Bison: { width: 22, bottom: 26, left: -3.25 },
  Oxen: { width: 23, bottom: 26, left: -4.25 },

  // Hamsters
  Nibbles: { width: 16, bottom: 20 },
  Peanuts: { width: 16, bottom: 20 },

  // Penguins
  Waddles: { width: 17, bottom: 20 },
  Pip: { width: 17, bottom: 20 },
  Skipper: { width: 21, bottom: 20, left: -3 },

  // Goat
  Ramsey: { width: 32, bottom: 36 },
};

const PET_PIXEL_STYLES = getObjectEntries(PETS_STYLES).reduce<
  Record<PetName, React.CSSProperties>
>(
  (acc, [pet, styles]) => {
    acc[pet] = {
      left: styles.left ? `${PIXEL_SCALE * styles.left}px` : undefined,
      right: styles.right ? `${PIXEL_SCALE * styles.right}px` : undefined,
      top: styles.top ? `${PIXEL_SCALE * styles.top}px` : undefined,
      bottom: styles.bottom ? `${PIXEL_SCALE * styles.bottom}px` : undefined,
      width: styles.width ? `${PIXEL_SCALE * styles.width}px` : undefined,
      height: styles.height ? `${PIXEL_SCALE * styles.height}px` : undefined,
    };
    return acc;
  },
  { ...PETS_STYLES },
);

export const PET_STATE_IMAGES: Record<
  PetName,
  Record<"happy" | "asleep", string>
> = {
  Barkley: {
    happy: ITEM_DETAILS.Barkley.image,
    asleep: barkleyAsleep,
  },
  Biscuit: {
    happy: ITEM_DETAILS.Biscuit.image,
    asleep: biscuitAsleep,
  },
  Cloudy: {
    happy: ITEM_DETAILS.Cloudy.image,
    asleep: cloudyAsleep,
  },
  Meowchi: {
    happy: ITEM_DETAILS.Meowchi.image,
    asleep: meowchiAsleep,
  },
  Butters: {
    happy: ITEM_DETAILS.Butters.image,
    asleep: buttersAsleep,
  },
  Smokey: {
    happy: ITEM_DETAILS.Smokey.image,
    asleep: smokeyAsleep,
  },
  Twizzle: {
    happy: ITEM_DETAILS.Twizzle.image,
    asleep: twizzleAsleep,
  },
  Flicker: {
    happy: ITEM_DETAILS.Flicker.image,
    asleep: flickerAsleep,
  },
  Pippin: {
    happy: ITEM_DETAILS.Pippin.image,
    asleep: pippinAsleep,
  },
  Burro: {
    happy: ITEM_DETAILS.Burro.image,
    asleep: burroAsleep,
  },
  Pinto: {
    happy: ITEM_DETAILS.Pinto.image,
    asleep: pintoAsleep,
  },
  Roan: {
    happy: ITEM_DETAILS.Roan.image,
    asleep: roanAsleep,
  },
  Stallion: {
    happy: ITEM_DETAILS.Stallion.image,
    asleep: stallionAsleep,
  },
  Mudhorn: {
    happy: ITEM_DETAILS.Mudhorn.image,
    asleep: mudhornAsleep,
  },
  Bison: {
    happy: ITEM_DETAILS.Bison.image,
    asleep: bisonAsleep,
  },
  Oxen: {
    happy: ITEM_DETAILS.Oxen.image,
    asleep: oxenAsleep,
  },
  Nibbles: {
    happy: ITEM_DETAILS.Nibbles.image,
    asleep: nibblesAsleep,
  },
  Peanuts: {
    happy: ITEM_DETAILS.Peanuts.image,
    asleep: peanutsAsleep,
  },
  Waddles: {
    happy: ITEM_DETAILS.Waddles.image,
    asleep: waddlesAsleep,
  },
  Pip: {
    happy: ITEM_DETAILS.Pip.image,
    asleep: pipAsleep,
  },
  Skipper: {
    happy: ITEM_DETAILS.Skipper.image,
    asleep: skipperAsleep,
  },
  Ramsey: {
    happy: ITEM_DETAILS.Ramsey.image,
    asleep: ITEM_DETAILS.Ramsey.image,
  },
};

const _petData = (name: PetName) => (state: MachineState) =>
  state.context.state.pets?.common?.[name];

export const Pet: React.FC<{ name: PetName }> = ({ name }) => {
  const [showPetModal, setShowPetModal] = useState(false);
  const [showXpPopup, setShowXpPopup] = useState(false);
  const { gameService } = useContext(Context);
  const { isVisiting } = useVisiting();

  const petData = useSelector(gameService, _petData(name));
  const isNeglected = isPetNeglected(petData);
  const isNapping = isPetNapping(petData);
  const petImage =
    PET_STATE_IMAGES[name][isNeglected || isNapping ? "asleep" : "happy"];

  const handlePetClick = () => {
    if (isVisiting) {
      return;
    } else if (isNapping) {
      gameService.send("pet.pet", {
        pet: name,
      });
      setShowXpPopup(true);
      window.setTimeout(() => setShowXpPopup(false), 1000);
    } else {
      setShowPetModal(true);
    }
  };

  return (
    <>
      <div className="absolute" style={{ ...PET_PIXEL_STYLES[name] }}>
        <img
          src={petImage}
          className={classNames("absolute w-full", {
            "cursor-pointer hover:img-highlight": !isVisiting,
          })}
          alt={name}
          onClick={handlePetClick}
        />
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
        {isNapping ? (
          <img
            src={SUNNYSIDE.icons.sleeping}
            alt="sleeping"
            className="absolute w-6 top-[-0.5rem] left-[-0.5rem]"
          />
        ) : isNeglected ? (
          <img
            src={SUNNYSIDE.icons.expression_stress}
            alt="stress"
            className="absolute w-[18px] top-[-0.5rem] left-[-0.5rem]"
          />
        ) : null}
      </div>
      <PetModal
        show={showPetModal}
        onClose={() => setShowPetModal(false)}
        petName={name}
      />
    </>
  );
};
