import React, { useEffect, useState } from "react";
import { Box } from "components/ui/Box";
import { getKeys } from "features/game/types/craftables";
import { randomBetweenMaxExclusive as randomInt } from "features/game/expansion/lib/randomBetweenMaxExlusive";
import { Button } from "components/ui/Button";
import { DynamicNPC } from "./components/DynamicNPC";

import rosyWide from "assets/bumpkins/large/eyes/rosy_wide.png";
import rosySquint from "assets/bumpkins/large/eyes/rosy_squint.png";
import lightFarmerPotion from "assets/bumpkins/large/body/light_farmer.png";
import darkFarmerPotion from "assets/bumpkins/large/body/dark_farmer.png";
import farmerShirt from "assets/bumpkins/large/shirts/farmer_shirt.png";
import lumberjackShirt from "assets/bumpkins/large/shirts/lumberjack_shirt.png";
import basicHair from "assets/bumpkins/large/hair/basic.png";
import explorerHair from "assets/bumpkins/large/hair/explorer.png";
import rancherHair from "assets/bumpkins/large/hair/rancher.png";
import farmerPants from "assets/bumpkins/large/pants/farmer_pants.png";
import blackShoes from "assets/bumpkins/large/shoes/black_shoes.png";
import smile from "assets/bumpkins/large/mouths/smile.png";
import dropShadow from "assets/bumpkins/large/body_dropshadow.png";

import hairIcon from "assets/bumpkins/icons/hair_icon.png";
import eyesIcon from "assets/bumpkins/icons/eyes_icon.png";
import bodyIcon from "assets/bumpkins/icons/body_icon.png";
import shirtIcon from "assets/bumpkins/icons/shirt_icon.png";
import leftArrow from "assets/icons/arrow_left.png";
import rightArrow from "assets/icons/arrow_right.png";

export type LimitedBody = "Light Farmer Potion" | "Dark Farmer Potion";
export type LimitedHair = "Basic Hair" | "Explorer Hair" | "Rancher Hair";
export type LimitedShirt = "Farmer Shirt" | "Lumberjack Shirt";
export type LimitedPants = "Farmer Pants";
export type LimitedEyes = "Rosy Wide Eyes" | "Rosy Squinted Eyes";
export type LimitedMouth = "Smile Mouth";
export type LimitedShoes = "Black Shoes";

type LimitedBumpkinItem =
  | LimitedBody
  | LimitedHair
  | LimitedShirt
  | LimitedPants
  | LimitedEyes
  | LimitedMouth
  | LimitedShoes;

interface Bumpkin {
  body: LimitedBody;
  hair: LimitedHair;
  eyes: LimitedEyes;
  mouth: LimitedMouth;
  shirt: LimitedShirt;
  pants: LimitedPants;
  shoes: LimitedShoes;
}

type Category = "hair" | "eyes" | "body" | "shirt";
type CategoryDetails = {
  name: Category;
  icon: string;
  options: LimitedBumpkinItem[];
};

const ITEM_IMAGES: Record<LimitedBumpkinItem, string> = {
  "Light Farmer Potion": lightFarmerPotion,
  "Dark Farmer Potion": darkFarmerPotion,
  "Basic Hair": basicHair,
  "Explorer Hair": explorerHair,
  "Rancher Hair": rancherHair,
  "Farmer Shirt": farmerShirt,
  "Lumberjack Shirt": lumberjackShirt,
  "Farmer Pants": farmerPants,
  "Rosy Wide Eyes": rosyWide,
  "Rosy Squinted Eyes": rosySquint,
  "Black Shoes": blackShoes,
  "Smile Mouth": smile,
};

const BUMPKIN_PARTS: Record<Category, CategoryDetails> = {
  hair: {
    name: "hair",
    icon: hairIcon,
    options: ["Basic Hair", "Explorer Hair", "Rancher Hair"],
  },
  eyes: {
    name: "eyes",
    icon: eyesIcon,
    options: ["Rosy Wide Eyes", "Rosy Squinted Eyes"],
  },
  body: {
    name: "body",
    icon: bodyIcon,
    options: ["Light Farmer Potion", "Dark Farmer Potion"],
  },
  shirt: {
    name: "shirt",
    icon: shirtIcon,
    options: ["Farmer Shirt", "Lumberjack Shirt"],
  },
};

const getRandomPart = <T,>(category: Category) => {
  const { options } = BUMPKIN_PARTS[category];
  const randomIndex = randomInt(0, options.length);

  return options[randomIndex] as T;
};

const makeInitialBumpkin = (): Bumpkin => ({
  body: getRandomPart<LimitedBody>("body"),
  hair: getRandomPart<LimitedHair>("hair"),
  eyes: getRandomPart<LimitedEyes>("eyes"),
  shirt: getRandomPart<LimitedShirt>("shirt"),
  mouth: "Smile Mouth",
  pants: "Farmer Pants",
  shoes: "Black Shoes",
});

const findSelectedOptionIndex = (
  selectedOption: string,
  category: Category
) => {
  const { options } = BUMPKIN_PARTS[category];

  return options.findIndex((option) => option === selectedOption);
};

interface Props {
  onMint: () => void;
}

export const BumpkinBuilder: React.FC<Props> = ({ onMint }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryDetails>(
    BUMPKIN_PARTS.hair
  );
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [bumpkinParts, setBumpkinParts] = useState<Bumpkin>(
    makeInitialBumpkin()
  );

  useEffect(() => {
    setSelectedOptionIndex(
      findSelectedOptionIndex(
        bumpkinParts[activeCategory.name],
        activeCategory.name
      )
    );
  }, []);

  const handleSelect = (category: Category) => {
    setActiveCategory(BUMPKIN_PARTS[category]);

    setSelectedOptionIndex(
      findSelectedOptionIndex(
        bumpkinParts[BUMPKIN_PARTS[category].name],
        BUMPKIN_PARTS[category].name
      )
    );
  };

  const handleArrowClick = (direction: "left" | "right") => {
    const { options } = activeCategory;
    let index = selectedOptionIndex;

    switch (direction) {
      case "left":
        index--;
        break;
      case "right":
        index++;
        break;
    }

    if (index < 0) {
      index = options.length - 1;
    } else if (index === options.length) {
      index = 0;
    }

    setSelectedOptionIndex(index);
    setBumpkinParts({
      ...bumpkinParts,
      [activeCategory.name]: activeCategory.options[index],
    });
  };

  const findImageToShow = (category: Category) => {
    // If rotating through a categories items then find the image from that
    // categories options array
    if (activeCategory.name === category) {
      return ITEM_IMAGES[activeCategory.options[selectedOptionIndex]];
    }
    // else find the image using the selected bumpkin items
    return ITEM_IMAGES[bumpkinParts[category]];
  };

  const handleMint = () => {
    console.log(bumpkinParts);
    onMint();
  };

  return (
    <>
      <div className="relative flex flex-col items-center p-2">
        <h1 className="mb-2 text-">Bumpkin Builder</h1>
        <div className="flex mb-2">
          {getKeys(BUMPKIN_PARTS).map((category) => (
            <Box
              key={category}
              image={BUMPKIN_PARTS[category].icon}
              isSelected={activeCategory.name === category}
              onClick={() => handleSelect(category)}
            />
          ))}
        </div>
        <div className="relative w-full">
          <img
            src={dropShadow}
            alt="drop-shadow"
            className="absolute bottom-0 z-0 opacity-30"
          />
          <img src={ITEM_IMAGES[bumpkinParts.body]} className="z-0 w-full" />
          {getKeys(bumpkinParts).map((part, index) => {
            const zIndex = index * 10;

            if (part === "body") return;

            return (
              <img
                key={part}
                src={findImageToShow(part as Category)}
                className={`absolute inset-0 z-${zIndex} w-full`}
              />
            );
          })}
        </div>

        <div className="absolute bottom-[9.5%] right-[22%]">
          <DynamicNPC
            body={bumpkinParts.body}
            hair={bumpkinParts.hair}
            pants={bumpkinParts.pants}
            shirt={bumpkinParts.shirt}
          />
        </div>

        <div
          className="flex items-center justify-center absolute top-1/2 left-2 w-10 h-10 z-[100] cursor-pointer"
          onClick={() => handleArrowClick("left")}
        >
          <img src={leftArrow} alt="left-arrow" className=" w-7" />
        </div>
        <div
          className="flex items-center justify-center absolute top-1/2 right-2 w-10 h-10 z-[100] cursor-pointer"
          onClick={() => handleArrowClick("right")}
        >
          <img src={rightArrow} alt="right-arrow" className="w-7" />
        </div>
      </div>
      <Button onClick={handleMint}>Mint Bumpkin</Button>
    </>
  );
};
