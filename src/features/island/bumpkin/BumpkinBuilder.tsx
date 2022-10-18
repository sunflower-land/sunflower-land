import React, { useContext, useEffect, useState } from "react";
import { Box } from "components/ui/Box";
import { getKeys } from "features/game/types/craftables";
import { Button } from "components/ui/Button";
import { DynamicNPC } from "./components/DynamicNPC";
import { DynamicNFT } from "../../bumpkins/components/DynamicNFT";

import hairIcon from "assets/bumpkins/icons/hair_icon.png";
import bodyIcon from "assets/bumpkins/icons/body_icon.png";
import shirtIcon from "assets/bumpkins/icons/shirt_icon.png";
import leftArrow from "assets/icons/arrow_left.png";
import rightArrow from "assets/icons/arrow_right.png";
import { Context } from "features/game/GameProvider";
import { InitialBumpkinParts } from "features/game/actions/mintBumpkin";
import { randomInt } from "lib/utils/random";
import { BumpkinWallpaper } from "features/game/types/bumpkin";

export type LimitedBody =
  | "Beige Farmer Potion"
  | "Light Brown Farmer Potion"
  | "Dark Brown Farmer Potion";
export type LimitedHair = "Basic Hair" | "Explorer Hair" | "Rancher Hair";
export type LimitedShirt =
  | "Red Farmer Shirt"
  | "Yellow Farmer Shirt"
  | "Blue Farmer Shirt";
export type LimitedPants = "Farmer Pants";
export type LimitedShoes = "Black Farmer Boots";
export type LimitedTools = "Farmer Pitchfork";

type LimitedBumpkinItem =
  | LimitedBody
  | LimitedHair
  | LimitedShirt
  | LimitedPants
  | LimitedShoes
  | LimitedTools;

interface Bumpkin {
  body: LimitedBody;
  hair: LimitedHair;
  background: BumpkinWallpaper;
  shirt: LimitedShirt;
  pants: LimitedPants;
  shoes: LimitedShoes;
  tool: LimitedTools;
}

type Category = "hair" | "body" | "shirt";
type CategoryDetails = {
  name: Category;
  icon: string;
  options: LimitedBumpkinItem[];
};

const BUMPKIN_PARTS: Record<Category, CategoryDetails> = {
  hair: {
    name: "hair",
    icon: hairIcon,
    options: ["Basic Hair", "Explorer Hair", "Rancher Hair"],
  },
  body: {
    name: "body",
    icon: bodyIcon,
    options: [
      "Beige Farmer Potion",
      "Light Brown Farmer Potion",
      "Dark Brown Farmer Potion",
    ],
  },
  shirt: {
    name: "shirt",
    icon: shirtIcon,
    options: ["Red Farmer Shirt", "Yellow Farmer Shirt", "Blue Farmer Shirt"],
  },
};

const getRandomPart = <T,>(category: Category) => {
  const { options } = BUMPKIN_PARTS[category];
  const randomIndex = randomInt(0, options.length);
  return options[randomIndex] as unknown as T;
};

const makeInitialBumpkin = (): Bumpkin => ({
  body: getRandomPart<LimitedBody>("body"),
  hair: getRandomPart<LimitedHair>("hair"),
  shirt: getRandomPart<LimitedShirt>("shirt"),
  pants: "Farmer Pants",
  shoes: "Black Farmer Boots",
  tool: "Farmer Pitchfork",
  background: "Farm Background",
});

const findSelectedOptionIndex = (
  selectedOption: string,
  category: Category
) => {
  const { options } = BUMPKIN_PARTS[category];

  return options.findIndex((option) => option === selectedOption);
};

export const BumpkinBuilder: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryDetails>(
    BUMPKIN_PARTS.hair
  );
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [bumpkinParts, setBumpkinParts] = useState<Bumpkin>(
    makeInitialBumpkin()
  );

  const { gameService } = useContext(Context);

  useEffect(() => {
    setSelectedOptionIndex(
      findSelectedOptionIndex(
        bumpkinParts[activeCategory.name],
        activeCategory.name
      )
    );
  }, []);

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

  const handleMint = () => {
    const parts: InitialBumpkinParts = {
      body: bumpkinParts.body,
      hair: bumpkinParts.hair,
      shirt: bumpkinParts.shirt,
    };
    gameService.send("MINT_BUMPKIN", { parts });
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
              onClick={() => setActiveCategory(BUMPKIN_PARTS[category])}
            />
          ))}
        </div>
        <DynamicNFT bumpkinParts={bumpkinParts} />
        <div className="absolute bottom-[9%] right-[10%]">
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
