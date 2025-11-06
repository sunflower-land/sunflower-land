import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { PetName, isPetNFTRevealed } from "features/game/types/pets";
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
import petNFTEgg from "assets/icons/pet_nft_egg.png";
import petNFTEggMarketplace from "assets/pets/pet-nft-egg-marketplace.webp";
import { CONFIG } from "lib/config";

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

export const PET_PIXEL_STYLES = getObjectEntries(PETS_STYLES).reduce<
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

export const _petData = (name: PetName) => (state: MachineState) =>
  state.context.state.pets?.common?.[name];

export const isPetNFT = (petId: PetName | number): petId is number => {
  return typeof petId === "number";
};

export const petImageDomain =
  CONFIG.NETWORK === "mainnet" ? "pets" : "testnet-pets";

/*
 NFT Pet image locations
 Idle, Sleeping and Marketplace have two types of files eg. animated and sheet. 
 Append the id with _animated to get the animated webp.
 Sheets (Phaser) stored at: https://${petImageDomain}.sunflower-land.com/sheets/${id}.webp
 Sleeping: https://${petImageDomain}.sunflower-land.com/sleepings/${id}(_animated).webp
 Idle: https://${petImageDomain}.sunflower-land.com/idles/${id}(_animated).webp
 Marketplace: https://${petImageDomain}.sunflower-land.com/marketplace/${id}(_animated).webp
 OpenSea: https://${petImageDomain}.sunflower-land.com/opensea/${id}.webp
 */

export const getPetImage = (
  state: "asleep" | "happy",
  id: number | PetName,
) => {
  if (isPetNFT(id)) {
    if (!isPetNFTRevealed(id, Date.now())) {
      return petNFTEgg;
    }
    if (state === "asleep") {
      return `https://${petImageDomain}.sunflower-land.com/sleepings/${id}_animated.webp`;
    }

    return `https://${petImageDomain}.sunflower-land.com/idles/${id}_animated.webp`;
  }

  return PET_STATE_IMAGES[id][state];
};

export const getPetImageForMarketplace = (id: number) => {
  if (!isPetNFTRevealed(id, Date.now())) {
    return petNFTEggMarketplace;
  }

  return `https://${petImageDomain}.sunflower-land.com/marketplace/${id}_animated.webp`;
};
