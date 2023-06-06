import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import React, { useLayoutEffect, useState } from "react";
import { MachineInterpreter } from "./lib/potionHouseMachine";

// MOCK REWARD FUNCTION
interface Reward {
  name: string;
  type: string;
  tier: "mega" | "higher" | "mid" | "lower";
}

const REWARDS: Reward[][] = [
  [
    {
      name: "Majestic Unicorn Garden Sculpture",
      type: "Decoration",
      tier: "mega",
    },
    { name: "Abundant Harvest Basket", type: "Highest Bounty", tier: "mega" },
    { name: "Mystical Rainbow Seed Pack", type: "Mutant Crop", tier: "mega" },
  ],
  [
    {
      name: "Ornate Enchanted Garden Statue",
      type: "Decoration",
      tier: "higher",
    },
    {
      name: "Exquisite Crystal Plant Stand",
      type: "Decoration",
      tier: "higher",
    },
  ],
  [
    { name: "Luminous Faerie Lantern", type: "Decoration", tier: "mid" },
    { name: "Vibrant Rainbow Flower Seeds", type: "Decoration", tier: "mid" },
  ],
  [
    { name: "Quirky Mushroom Garden Kit", type: "Decoration", tier: "lower" },
    { name: "Enchanted Miniature Forest", type: "Decoration", tier: "lower" },
  ],
  [
    {
      name: "Delightful Potted Pixie Plant",
      type: "Decoration",
      tier: "lower",
    },
    {
      name: "Magical Glow-in-the-Dark Pebbles",
      type: "Decoration",
      tier: "lower",
    },
  ],
];

function getRandomReward(progress: number): Reward {
  const megaRewardThreshold = 100;
  const megaRewardIndex =
    progress === megaRewardThreshold
      ? Math.floor(Math.random() * REWARDS[0].length)
      : -1;

  if (megaRewardIndex !== -1) {
    return REWARDS[0][megaRewardIndex];
  } else {
    const progressIndex = Math.floor(progress / 30);
    const rewardOptions = REWARDS[progressIndex];
    return rewardOptions[Math.floor(Math.random() * rewardOptions.length)];
  }
}

function generateText(prize: string, tier: string): string {
  let message = "";

  switch (tier) {
    case "mega":
      message = `Behold, apprentice! Your exceptional skills have summoned the presence of enchantment. The ${prize} shall grace your garden, radiating its magical aura for all to behold!`;
      break;
    case "higher":
      message = `Well done, apprentice! Your dedication and progress have earned you the ${prize}. It shall serve as a splendid addition, evoking awe and wonder in all who behold it.`;
      break;
    case "mid":
      message = `Impressive work, apprentice! The ${prize} is your reward for your growing skills. It promises to bring a touch of ${prize.toLowerCase()} to your garden, enchanting all who visit.`;
      break;
    case "lower":
      message = `Keep practicing, apprentice! The ${prize} awaits your touch. While it may not have an immediate effect, its ${prize.toLowerCase()} will gradually reveal hidden wonders in your garden.`;
      break;
    default:
      message = `Congratulations, apprentice! You have been rewarded with ${prize} for your efforts. May it bring joy and magic to your potion-making journey.`;
      break;
  }

  return message;
}

interface ResultProps {
  score?: number;
  machine: MachineInterpreter;
}

export const ResultPage: React.FC<ResultProps> = ({ score = 10 }) => {
  const [prize, setPrize] = useState<Reward | null>(null);
  const [text, setText] = useState<string>("");

  useLayoutEffect(() => {
    const reward = getRandomReward(score);
    setPrize(reward);
    setText(generateText(reward.name, reward.tier));
  }, []);

  return (
    <>
      <div className="flex flex-col h-full">
        <div>{score}/100</div>
        <div>{text}</div>
        <div className="flex justify-evenly grow items-center">
          <div>{prize?.name}</div>
          <DynamicNFT
            bumpkinParts={{
              body: "Beige Farmer Potion",
              hair: "Blacksmith Hair",
              pants: "Farmer Overalls",
              shirt: "Yellow Farmer Shirt",
              tool: "Hammer",
              background: "Farm Background",
              shoes: "Black Farmer Boots",
            }}
          />
        </div>
      </div>
    </>
  );
};
