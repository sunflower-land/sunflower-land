import { getKeys } from "./craftables";
import greenThumb from "assets/skills/green_thumb.png";
import seedSpecialist from "assets/skills/seed_specialist.png";
import sunflower from "assets/crops/sunflower/crop.png";
import radish from "assets/crops/radish/crop.png";
import wheat from "assets/crops/wheat/crop.png";
import prospector from "assets/skills/prospector.png";
import buckaroo from "assets/skills/land/animals/buckaroo.png";
import coal_face from "assets/skills/land/rocks/coal_face.png";
import curer from "assets/skills/land/cooking/curer.png";
import digger from "assets/skills/land/rocks/digger.png";
import free_range from "assets/skills/land/animals/free_range.png";
import gold_rush_LE from "assets/skills/land/rocks/gold_rush_LE.png";
import horse_whisperer from "assets/skills/land/animals/horse_whisperer.png";
import kitchen_hand from "assets/skills/land/cooking/kitchen_hand.png";
import lumberjack_LE from "assets/skills/land/trees/lumberjack_LE.png";
import michelin_stars from "assets/skills/land/cooking/michelin_stars.png";
import money_tree from "assets/skills/land/trees/money_tree.png";
import rush_hour from "assets/skills/land/cooking/rush_hour.png";
import seeker from "assets/skills/land/rocks/seeker.png";
import stable_hand from "assets/skills/land/animals/stable_hand.png";
import tough_tree from "assets/skills/land/trees/tough_tree.png";
import tree_hugger from "assets/skills/land/trees/tree_hugger.png";

export type BumpkinSkillName =
  | "Green Thumb"
  | "Cultivator"
  | "Master Farmer"
  | "Golden Flowers"
  | "Plant Whisperer"
  | "Happy Crop"
  | "Lumberjack"
  | "Tree Hugger"
  | "Tough Tree"
  | "Money Tree"
  | "Digger"
  | "Coal Face"
  | "Seeker"
  | "Gold Rush"
  | "Rush Hour"
  | "Kitchen Hand"
  | "Michelin Stars"
  | "Curer"
  | "Stable Hand"
  | "Free Range"
  | "Horse Whisperer"
  | "Buckaroo";

export type BumpkinSkillTree =
  | "Crops"
  | "Trees"
  | "Rocks"
  | "Cooking"
  | "Animals";

export type BumpkinSkill = {
  name: BumpkinSkillName;
  tree: BumpkinSkillTree;
  requirements: {
    skill?: BumpkinSkillName;
    points: number;
  };
  boosts: string;
  image: string;
  disabled?: boolean;
};

export const BUMPKIN_SKILL_TREE: Record<BumpkinSkillName, BumpkinSkill> = {
  "Green Thumb": {
    name: "Green Thumb",
    tree: "Crops",
    requirements: {
      points: 1,
    },
    boosts: "Crops yield 5% more",
    image: greenThumb,
  },
  Cultivator: {
    name: "Cultivator",
    tree: "Crops",
    requirements: {
      points: 1,
      skill: "Green Thumb",
    },
    boosts: "Crops grow 5% quicker",
    image: seedSpecialist,
  },
  "Master Farmer": {
    name: "Master Farmer",
    tree: "Crops",
    requirements: {
      points: 2,
      skill: "Cultivator",
    },
    boosts: "Crops yield 10% more",
    image: sunflower,
  },
  "Golden Flowers": {
    name: "Golden Flowers",
    tree: "Crops",
    requirements: {
      points: 2,
      skill: "Master Farmer",
    },
    boosts: "Chance for Sunflowers to Drop Gold ",
    image: prospector,
  },
  "Plant Whisperer": {
    name: "Plant Whisperer",
    tree: "Crops",
    requirements: {
      points: 1,
      skill: "Master Farmer",
    },
    boosts: "Crops require ?",
    image: radish,
    disabled: true,
  },
  "Happy Crop": {
    name: "Happy Crop",
    tree: "Crops",
    requirements: {
      points: 2,
      skill: "Master Farmer",
    },
    boosts: "Chance to get 2x crops",
    image: wheat,
  },
  Lumberjack: {
    name: "Lumberjack",
    tree: "Trees",
    requirements: {
      points: 1,
    },
    boosts: "Trees drop 10% more",
    image: lumberjack_LE,
  },
  "Tree Hugger": {
    name: "Tree Hugger",
    tree: "Trees",
    requirements: {
      points: 2,
      skill: "Lumberjack",
    },
    boosts: "Trees regrow 20% quicker",
    image: tree_hugger,
  },
  "Tough Tree": {
    name: "Tough Tree",
    tree: "Trees",
    requirements: {
      points: 3,
      skill: "Tree Hugger",
    },
    boosts: "Chance to get 3x wood drops",
    image: tough_tree,
  },
  "Money Tree": {
    name: "Money Tree",
    tree: "Trees",
    requirements: {
      points: 2,
      skill: "Tree Hugger",
    },
    boosts: "Chance for SFL drops",
    image: money_tree,
  },
  Digger: {
    name: "Digger",
    tree: "Rocks",
    requirements: {
      points: 1,
    },
    boosts: "Stone Drops 10% more",
    image: digger,
  },
  "Coal Face": {
    name: "Coal Face",
    tree: "Rocks",
    requirements: {
      points: 2,
      skill: "Digger",
    },
    boosts: "Stones recover 20% quicker",
    image: coal_face,
  },
  Seeker: {
    name: "Seeker",
    tree: "Rocks",
    requirements: {
      points: 3,
      skill: "Coal Face",
    },
    boosts: "Attract Rock Monsters",
    image: seeker,
    disabled: true,
  },
  "Gold Rush": {
    name: "Gold Rush",
    tree: "Rocks",
    requirements: {
      points: 2,
      skill: "Coal Face",
    },
    boosts: "Chance to get 2.5x gold drops",
    image: gold_rush_LE,
  },
  "Rush Hour": {
    name: "Rush Hour",
    tree: "Cooking",
    requirements: {
      points: 1,
    },
    boosts: "Cook meals 10% faster",
    image: rush_hour,
  },
  "Kitchen Hand": {
    name: "Kitchen Hand",
    tree: "Cooking",
    requirements: {
      points: 2,
      skill: "Rush Hour",
    },
    boosts: "Meals yield an extra 5% experience",
    image: kitchen_hand,
  },
  "Michelin Stars": {
    name: "Michelin Stars",
    tree: "Cooking",
    requirements: {
      points: 2,
      skill: "Kitchen Hand",
    },
    boosts: "High quality food, earn additional 5% SFL",
    image: michelin_stars,
  },
  Curer: {
    name: "Curer",
    tree: "Cooking",
    requirements: {
      points: 2,
      skill: "Michelin Stars",
    },
    boosts: "Consuming deli goods adds extra 15% exp",
    image: curer,
  },
  "Stable Hand": {
    name: "Stable Hand",
    tree: "Animals",
    requirements: {
      points: 1,
    },
    boosts: "Animals produce 10% quicker",
    image: stable_hand,
  },
  "Free Range": {
    name: "Free Range",
    tree: "Animals",
    requirements: {
      points: 2,
      skill: "Stable Hand",
    },
    boosts: "Animals produce 10% more",
    image: free_range,
  },
  "Horse Whisperer": {
    name: "Horse Whisperer",
    tree: "Animals",
    requirements: {
      points: 2,
      skill: "Free Range",
    },
    boosts: "Increase chance of mutants",
    image: horse_whisperer,
  },
  Buckaroo: {
    name: "Buckaroo",
    tree: "Animals",
    requirements: {
      points: 2,
      skill: "Horse Whisperer",
    },
    boosts: "Chance of double drops",
    image: buckaroo,
  },
};

export const SKILL_TREE_CATEGORIES = Array.from(
  new Set(
    getKeys(BUMPKIN_SKILL_TREE).map((skill) => BUMPKIN_SKILL_TREE[skill].tree)
  )
);

export const getSkills = (treeName: BumpkinSkillTree) => {
  return getKeys(BUMPKIN_SKILL_TREE).reduce((treeSkills, skill) => {
    if (BUMPKIN_SKILL_TREE[skill].tree === treeName) {
      return [...treeSkills, BUMPKIN_SKILL_TREE[skill]];
    }

    return treeSkills;
  }, [] as BumpkinSkill[]);
};

export const createSkillPath = (skills: BumpkinSkill[]) => {
  const startingSkill = skills.find((item) => !item.requirements.skill);
  const path = [[startingSkill?.name as BumpkinSkillName]];

  const remainingLevels = new Set(
    skills.map((item) => item.requirements.skill)
  );

  for (let index = 0; index < remainingLevels.size - 1; index++) {
    const lastSkillLevelName = path[path.length - 1][0];

    const skillsInCurrentLevel: BumpkinSkillName[] = skills
      .filter((item) => item.requirements.skill === lastSkillLevelName)
      .map((item) => item.name);

    path.push(skillsInCurrentLevel);
  }

  return path;
};
