import { getKeys } from "./craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { translate } from "lib/i18n/translate";

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
    boosts: translate("description.green.thumb"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  Cultivator: {
    name: "Cultivator",
    tree: "Crops",
    requirements: {
      points: 1,
      skill: "Green Thumb",
    },
    boosts: translate("description.cultivator"),
    image: SUNNYSIDE?.skills?.cultivator,
  },
  "Master Farmer": {
    name: "Master Farmer",
    tree: "Crops",
    requirements: {
      points: 2,
      skill: "Cultivator",
    },
    boosts: translate("description.master.farmer"),
    image: SUNNYSIDE?.skills?.master_farmer,
  },
  "Golden Flowers": {
    name: "Golden Flowers",
    tree: "Crops",
    requirements: {
      points: 2,
      skill: "Master Farmer",
    },
    boosts: translate("description.golden.flowers"),
    image: SUNNYSIDE?.skills?.golden_flowers,
  },
  "Plant Whisperer": {
    name: "Plant Whisperer",
    tree: "Crops",
    requirements: {
      points: 1,
      skill: "Master Farmer",
    },
    boosts: translate("coming.soon"),
    image: CROP_LIFECYCLE.Radish.crop,
    disabled: true,
  },
  "Happy Crop": {
    name: "Happy Crop",
    tree: "Crops",
    requirements: {
      points: 2,
      skill: "Master Farmer",
    },
    boosts: translate("description.happy.crop"),
    image: SUNNYSIDE?.skills?.happy_crop,
  },
  Lumberjack: {
    name: "Lumberjack",
    tree: "Trees",
    requirements: {
      points: 1,
    },
    boosts: translate("description.lumberjack"),
    image: SUNNYSIDE?.skills?.lumberjack_LE,
  },
  "Tree Hugger": {
    name: "Tree Hugger",
    tree: "Trees",
    requirements: {
      points: 2,
      skill: "Lumberjack",
    },
    boosts: translate("description.tree.hugger"),
    image: SUNNYSIDE?.skills?.tree_hugger,
  },
  "Tough Tree": {
    name: "Tough Tree",
    tree: "Trees",
    requirements: {
      points: 3,
      skill: "Tree Hugger",
    },
    boosts: translate("description.tough.tree"),
    image: SUNNYSIDE?.skills?.tough_tree,
  },
  "Money Tree": {
    name: "Money Tree",
    tree: "Trees",
    requirements: {
      points: 2,
      skill: "Tree Hugger",
    },
    boosts: translate("description.money.tree"),
    image: SUNNYSIDE?.skills?.money_tree,
  },
  Digger: {
    name: "Digger",
    tree: "Rocks",
    requirements: {
      points: 1,
    },
    boosts: translate("description.digger"),
    image: SUNNYSIDE?.skills?.digger,
  },
  "Coal Face": {
    name: "Coal Face",
    tree: "Rocks",
    requirements: {
      points: 2,
      skill: "Digger",
    },
    boosts: translate("description.coal.face"),
    image: SUNNYSIDE?.skills?.coal_face,
  },
  Seeker: {
    name: "Seeker",
    tree: "Rocks",
    requirements: {
      points: 3,
      skill: "Coal Face",
    },
    boosts: translate("description.seeker"),
    image: SUNNYSIDE?.skills?.seeker,
    disabled: true,
  },
  "Gold Rush": {
    name: "Gold Rush",
    tree: "Rocks",
    requirements: {
      points: 2,
      skill: "Coal Face",
    },
    boosts: translate("description.gold.rush"),
    image: SUNNYSIDE?.skills?.gold_rush_LE,
  },
  "Rush Hour": {
    name: "Rush Hour",
    tree: "Cooking",
    requirements: {
      points: 1,
    },
    boosts: translate("description.rush.hour"),
    image: SUNNYSIDE?.skills?.rush_hour,
  },
  "Kitchen Hand": {
    name: "Kitchen Hand",
    tree: "Cooking",
    requirements: {
      points: 2,
      skill: "Rush Hour",
    },
    boosts: translate("description.kitchen.hand"),
    image: SUNNYSIDE?.skills?.kitchen_hand,
  },
  "Michelin Stars": {
    name: "Michelin Stars",
    tree: "Cooking",
    requirements: {
      points: 2,
      skill: "Kitchen Hand",
    },
    boosts: translate("description.michelin.stars"),
    image: SUNNYSIDE?.skills?.michelin_stars,
  },
  Curer: {
    name: "Curer",
    tree: "Cooking",
    requirements: {
      points: 2,
      skill: "Michelin Stars",
    },
    boosts: translate("description.curer"),
    image: SUNNYSIDE?.skills?.curer,
  },
  "Stable Hand": {
    name: "Stable Hand",
    tree: "Animals",
    requirements: {
      points: 1,
    },
    boosts: translate("description.stable.hand"),
    image: SUNNYSIDE?.skills?.stable_hand,
  },
  "Free Range": {
    name: "Free Range",
    tree: "Animals",
    requirements: {
      points: 2,
      skill: "Stable Hand",
    },
    boosts: translate("description.free.range"),
    image: SUNNYSIDE?.skills?.free_range,
  },
  "Horse Whisperer": {
    name: "Horse Whisperer",
    tree: "Animals",
    requirements: {
      points: 2,
      skill: "Free Range",
    },
    boosts: translate("description.horse.whisperer"),
    image: SUNNYSIDE?.skills?.horse_whisperer,
  },
  Buckaroo: {
    name: "Buckaroo",
    tree: "Animals",
    requirements: {
      points: 2,
      skill: "Horse Whisperer",
    },
    boosts: translate("description.buckaroo"),
    image: SUNNYSIDE?.skills?.buckaroo,
  },
};

export const SKILL_TREE_CATEGORIES = Array.from(
  new Set(
    getKeys(BUMPKIN_SKILL_TREE).map((skill) => BUMPKIN_SKILL_TREE[skill].tree),
  ),
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
    skills.map((item) => item.requirements.skill),
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
