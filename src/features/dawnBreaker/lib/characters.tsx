import React from "react";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { NPCParts } from "features/island/bumpkin/components/NPC";

import obieGif from "assets/sfts/obie.gif";
import maxiumusImg from "assets/npcs/maximus.png";
import snailImg from "assets/npcs/snail.png";

export type Week = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type SpeakingBumpkin = "marcus" | "bella" | "sofia";
export type SpeakingNonBumpkin = "maximus" | "obie" | "snail";
export type SpeakingCharacter = SpeakingBumpkin | SpeakingNonBumpkin;

export function isSpeakingBumpkin(
  value: SpeakingCharacter
): value is SpeakingBumpkin {
  return ["marcus", "bella", "sofia"].includes(value);
}

export function isSpeakingNonBumpkin(
  value: SpeakingCharacter
): value is SpeakingNonBumpkin {
  return ["maximus", "obie", "wendy", "snail"].includes(value);
}

const marcusParts: Partial<NPCParts> = {
  hair: "Blacksmith Hair",
  shirt: "Striped Blue Shirt",
  pants: "Lumberjack Overalls",
  body: "Light Brown Worried Farmer Potion",
};

const bellaParts: Partial<NPCParts> = {
  hair: "Parlour Hair",
  shirt: "Maiden Top",
  pants: "Peasant Skirt",
  tool: "Farmer Pitchfork",
  body: "Light Brown Worried Farmer Potion",
};

const sofiaParts: Partial<NPCParts> = {
  hair: "Red Long Hair",
  shirt: "Fire Shirt",
  necklace: "Artist Scarf",
  pants: "Farmer Pants",
  body: "Light Brown Worried Farmer Potion",
};

type CharacterDetails = Coordinates & {
  flip?: boolean;
  inDarkness?: boolean;
  dialogue?: JSX.Element;
};

type DawnBreakerPositions = {
  lanterns: Coordinates[];
  bumpkin: CharacterDetails;
  marcus?: CharacterDetails;
  bella?: CharacterDetails;
  sofia?: CharacterDetails;
  maximus?: CharacterDetails;
  obie?: CharacterDetails;
  wendy?: CharacterDetails;
  snail?: CharacterDetails;
};

export const bumpkinParts: Record<SpeakingBumpkin, Partial<NPCParts>> = {
  marcus: marcusParts,
  bella: bellaParts,
  sofia: sofiaParts,
};

export const characterImages: Record<SpeakingNonBumpkin, string> = {
  maximus: maxiumusImg,
  obie: obieGif,
  snail: snailImg,
};

export const characters: Record<Week, DawnBreakerPositions> = {
  1: {
    lanterns: [
      {
        x: -11,
        y: 7,
      },
      {
        x: -9,
        y: 5,
      },
      {
        x: -13,
        y: 5,
      },
      {
        x: -12,
        y: 3,
      },
      {
        x: -10,
        y: 3,
      },
    ],
    bumpkin: {
      x: -11,
      y: 5,
    },
    marcus: {
      x: 4,
      y: -14,
      flip: true,
      dialogue: (
        <>
          <p>{`Marcus: What's happening? Why has the darkness come?`}</p>
          <p>{`I need to protect my family, but how can I when we can't even see what's out there?`}</p>
        </>
      ),
    },
    bella: {
      x: 3,
      y: -15,
      flip: true,
      dialogue: (
        <>
          <p>{`Bella: Oh no, my crops! They won't survive without sunlight. How will we feed ourselves?`}</p>
          <p>{`Marcus, I'm so scared.`}</p>
        </>
      ),
    },
    sofia: {
      x: 1,
      y: -14,
      dialogue: (
        <>
          <p>
            Sofia: This is so scary, but also kind of exciting. What do you
            think is causing this darkness?
          </p>
          <p>I want to help however I can.</p>
        </>
      ),
    },
    maximus: {
      x: -7,
      y: -12,
    },
    wendy: {
      x: -11,
      y: -4,
    },
    obie: {
      x: -9,
      y: -12,
    },
    snail: {
      x: 3,
      y: 4,
      flip: true,
    },
  },
  2: {
    lanterns: [
      {
        x: 0,
        y: 2,
      },
      {
        x: 2,
        y: 2,
      },
      {
        x: 3,
        y: 0,
      },
      {
        x: 1,
        y: -1,
      },
      {
        x: -1,
        y: 0,
      },
    ],
    bumpkin: {
      x: 1,
      y: 1,
    },
    marcus: {
      x: 4,
      y: -13,
      flip: true,
      dialogue: (
        <>
          <p>{`Marcus: I should never have cast my line into the waters of that distant land.`}</p>
          <p>{`I was lured by temptation and the promise of a great catch. But what I reeled in was something far more sinister.`}</p>
          <p>{`This darkness continues to cast shadows on all I hold dear. How do I find the light again?`}</p>
        </>
      ),
    },
    bella: {
      x: 2,
      y: -15,
      flip: true,
      dialogue: (
        <>
          <p>{`Bella: I can see the weight on Marcus' shoulders.`}</p>
          <p>{`What could have happened while he was away? What has he done?`}</p>
          <p>{`Whatever it was, it's caused this darkness to descend upon us.`}</p>
        </>
      ),
    },
    sofia: {
      x: -3,
      y: -12,
      flip: true,
      inDarkness: true,
      dialogue: (
        <>
          <p>{`Sofia: I have to keep going. Hopefully Hoot knows something. `}</p>
          <p>
            {`There has to be a way to bring back the light. I just hope I'm not too late...`}
          </p>
        </>
      ),
    },
    maximus: {
      x: -7,
      y: -12,
      flip: true,
      dialogue: (
        <>
          <p>Humph... go away!</p>
        </>
      ),
    },
    wendy: {
      x: -11,
      y: -4,
    },
    obie: {
      x: -9,
      y: -12,
    },
    snail: {
      x: 3,
      y: 4,
      flip: true,
    },
  },
  3: {
    lanterns: [
      {
        x: 9,
        y: 4,
      },
      {
        x: 8,
        y: 2,
      },
      {
        x: 10,
        y: 1,
      },
      {
        x: 12,
        y: 2,
      },
      {
        x: 11,
        y: 4,
      },
    ],
    marcus: {
      x: 2,
      y: -13,
      flip: true,
      dialogue: (
        <>
          <p>{`Marcus: I should have never gone to the north. I brought this darkness upon us.`}</p>
        </>
      ),
    },
    bella: {
      x: 4,
      y: -15,
      flip: true,
      dialogue: (
        <>
          <p>{`Bella: Don't blame yourself, Marcus."`}</p>
          <p>{`We'll get through this together.`}</p>
          <p>{`Hopefully Sofia will return soon with some news.`}</p>
        </>
      ),
    },
    sofia: {
      x: -4,
      y: -11,
      flip: true,
      inDarkness: true,
      dialogue: (
        <>
          <p>{`Sofia: I'm scared, but I have to be brave.`}</p>
          <p>{`Just keep going.`}</p>
        </>
      ),
    },
    bumpkin: {
      x: 10,
      y: 3,
    },
    maximus: {
      x: -7,
      y: -12,
    },
    wendy: {
      x: -11,
      y: -4,
    },
    obie: {
      x: -9,
      y: -12,
    },
  },
  4: {
    lanterns: [
      {
        x: -12,
        y: -3,
      },
      {
        x: -10,
        y: -3,
      },
      {
        x: -13,
        y: -5,
      },
      {
        x: -9,
        y: -5,
      },
      {
        x: -11,
        y: -7,
      },
    ],
    marcus: {
      x: 4,
      y: -12,
      dialogue: (
        <>
          <p>{`Marcus: This little gnome seemed so insignificant.`}</p>
          <p>{`I guess it wasn't. I should have just left it alone.`}</p>
        </>
      ),
    },
    bella: {
      x: 2,
      y: -15,
      flip: true,
      dialogue: (
        <>
          <p>{`Bella: Oh thank the gods, Sofia is back`}</p>
          <p>{`"What did you find out?"`}</p>
        </>
      ),
    },
    sofia: {
      x: 1,
      y: -13,
      dialogue: (
        <>
          <p>{`Sofia: Hoot was no help with these dizzying riddles.`}</p>
          <p>{`There was two creatures guarding the Bell Tower.`}</p>
          <p>{`They frightened me at first but I sensed some sadness there too. Like maybe they had lost something too..`}</p>
        </>
      ),
    },
    bumpkin: {
      x: -11,
      y: -4,
    },
    maximus: {
      x: -7,
      y: -11,
      flip: true,
    },
    wendy: {
      x: -5,
      y: -5,
      flip: true,
    },
    obie: {
      x: -8,
      y: -12,
      dialogue: (
        <>
          <p>You took what is ours, we take what is yours.</p>
        </>
      ),
    },
  },
  5: {
    lanterns: [
      {
        x: 9,
        y: -3,
      },
      {
        x: 7,
        y: -5,
      },
      {
        x: 8,
        y: -7,
      },
      {
        x: 10,
        y: -7,
      },
      {
        x: 11,
        y: -6,
      },
    ],
    bumpkin: {
      x: 9,
      y: -5,
    },
    marcus: {
      x: 4,
      y: -15,
      flip: true,
      dialogue: (
        <>
          <p>{`Marcus: I should have heeded the whispers of caution.`}</p>
          <p>{`Greed clouded my judgment, and I succumbed to the allure of profit. But at what cost?`}</p>
          <p>{`The gnomes, bearers of magic and joy, were not mine to claim. The path I chose led me astray.`}</p>
        </>
      ),
    },
    bella: {
      x: 2,
      y: -15,
      flip: true,
      dialogue: (
        <>
          <p>{`Bella: These eggplants, they seem to have taken over, crowding the beauty that once flourished here.`}</p>
          <p>{`Something has rocked the delicate balance within nature. Something is seeking revenge.`}</p>
        </>
      ),
    },
    sofia: {
      x: 1,
      y: -13,
      flip: true,
      dialogue: (
        <>
          <p>{`Sofia: Oh my... I think I can see the Bell Tower.`}</p>
          <p>{`Could the light be returning.`}</p>
        </>
      ),
    },
    maximus: {
      x: -7,
      y: -11,
      flip: true,
      dialogue: (
        <>
          <p>{`The moonseekers are upon us.`}</p>
        </>
      ),
    },
    wendy: {
      x: -5,
      y: -5,
      flip: true,
    },
    obie: {
      x: -8,
      y: -12,
    },
  },
  6: {
    lanterns: [
      {
        x: 0,
        y: 0,
      },
      {
        x: -2,
        y: -2,
      },
      {
        x: -1,
        y: -4,
      },
      {
        x: 1,
        y: -4,
      },
      {
        x: 2,
        y: -2,
      },
    ],
    bumpkin: {
      x: 0,
      y: -2,
    },
  },
  7: {
    lanterns: [
      {
        x: 4,
        y: -7,
      },
      {
        x: 2,
        y: -9,
      },
      {
        x: 3,
        y: -11,
      },
      {
        x: 5,
        y: -11,
      },
      {
        x: 6,
        y: -9,
      },
    ],
    bumpkin: {
      x: 4,
      y: -9,
    },
  },
  8: {
    lanterns: [
      {
        x: -9,
        y: -12,
      },
      {
        x: -9,
        y: -14,
      },
      {
        x: -7,
        y: -15,
      },
      {
        x: -6,
        y: -13,
      },
      {
        x: -7,
        y: -11,
      },
    ],
    bumpkin: {
      x: -7,
      y: -13,
    },
  },
  9: {
    lanterns: [],
    bumpkin: {
      x: -4,
      y: -14,
    },
  },
};
