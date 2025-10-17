import { NPCName } from "lib/npcs";
import { translate } from "lib/i18n/translate";

/**
 * Bumpkin related information, useful for generating dialogue
 */
export const STORY_NPCS: Partial<
  Record<
    NPCName,
    {
      about: string;
      personality: string;
      likes: string;
      dislikes: string;
    }
  >
> = {
  "pumpkin' pete": {
    about:
      "Friendly pumpkin farmer who helps out new players. They wear a big pumpkin on their head.",
    personality:
      "Friendly, Casual, Wholesome, Bumpkin, Excited. Open and ready to chat",
    likes: "Pumpkins, Sunflowers, Helping Bumpkins",
    dislikes: "Skeletons, Nightshades, Automatic Crop machine, Green House",
  },
  miranda: {
    about: "Beachy Bumpkin who loves sun, dancing and the fruits!",
    personality: "Vibrant, Exotic, Tropical",
    likes: "Dancing Samba Music, Sunshine",
    dislikes: "Rain, Nightshades",
  },
  peggy: {
    about: "A friendly Bumpkin who loves baking! She loves chickens and eggs.",
    personality: "Friendly, A bit stressed about cooking for everyone.",
    likes: "Baking, Cooking, Chickens & Eggs",
    dislikes: "People using gems in cooking",
  },
  betty: {
    about:
      "A young ambitious Bumpkin who runs the farmers market. She is saving up for her own farm.",
    personality: "Bubbly, friendly",
    likes: "Crops, Farmers Market",
    dislikes: "Goblins, Nigthshades, Taxes",
  },
  corale: {
    about: "A mysterious Mermaid who is trying to set fish free.",
    personality: "Mysterious, Curious, Excited",
    likes: "Fish, Mermaids, Marvels, Grubs",
    dislikes: "Fishermen, Fishing nets",
  },
  grimbly: {
    about: "An expert Goblin blacksmith always looking for work.",
    personality: "Grumpy, hungry, short tempered, snatches materials.",
    likes: "Crafting, Minerals, Shiny things, Food!",
    dislikes: "Coins & empty handed Bumpkins",
  },
  garth: {
    about: "A potion master apprentice who is learning the ropes.",
    personality: "Curious, Excited, A bit clumsy",
    likes: "Potion making, Learning, Magic, Nightshades",
    dislikes: "Sunflorians",
  },
  grimtooth: {
    about: "A pirate inspired Goblin who loves treasure and rum.",
    personality: "Excited, A bit clumsy",
    likes: "Treasure, Rum, Pirates",
    dislikes: "Bumpkins, Sunflorians",
  },
  timmy: {
    about:
      "Young boy wearing a bear suit - always looking for his parents. Should not talk to strangers.",
    personality: "Overly curious, sympathetic to Goblins",
    likes: "Fruit juices, Bear suits, Playing with other kids",
    dislikes: "Goblins, Skeletons",
  },
  raven: {
    about:
      "A mysterious potion maker who deals in dark magic and shadowy crops. Occasionally caught creating potions in the dark.",
    personality: "Dark, Gothic, Mysterious",
    likes: "Dark crops, Potions, Spellwork, Shadows",
    dislikes: "Bright things, Cheerfulness",
  },
  bert: {
    about:
      "A crazy mushroom enthusiast who's particularly interested in magical varieties",
    personality: "Relaxed, Trippy, Enthusiastic",
    likes: "Magic Mushrooms, Enchanted things",
    dislikes: "Ordinary mushrooms, Reality",
  },
  finn: {
    about:
      "A boastful fisherman who loves telling tales about his catches. Older brother of Finley - often caught cheating and buying fish from the market to show off.",
    personality: "Confident, Bragging, Storyteller",
    likes: "Fishing, Big catches, Telling fish stories",
    dislikes: "Small fish, Being outdone",
  },
  "old salty": {
    about: "A seasoned pirate searching for treasures and adventure",
    personality: "Adventurous, Pirate-speak, Treasure-hungry",
    likes: "Treasure hunting, The sea, Plundering",
    dislikes: "Empty-handed sailors, Landlubbers",
  },
  victoria: {
    about: "The demanding queen who expects perfection from her subjects",
    personality: "Regal, Demanding, Imperious",
    likes: "Taxes, Order, Wealth, Perfection",
    dislikes: "Peasants, Tardiness, Disappointment",
  },
  gambit: {
    about: "A charismatic gambler who loves games of chance",
    personality: "Daring, Playful, Risk-taking",
    likes: "Betting, Gambling, High stakes",
    dislikes: "Playing it safe, Low stakes",
  },
  birdie: {
    about:
      "A fashion-conscious Bumpkin who loves showing off seasonal items and rare outfits",
    personality: "Stylish, Enthusiastic, Trend-setting",
    likes: "Rare outfits, Seasonal items, Being admired",
    dislikes: "Out-of-season fashion, Common items",
  },
  grubnuk: {
    about: "A mischievous goblin merchant with a keen eye for valuable trades",
    personality: "Cunning, Opportunistic, Business-minded",
    likes: "Profitable trades, Rare resources, Bargaining",
    dislikes: "Bad deals, Wasted time",
  },
  gordo: {
    about: "A rotund and jolly Goblin who specializes in exotic goods",
    personality: "Cheerful, Enterprising, Food-loving",
    likes: "Exotic items, Good food, Making deals",
    dislikes: "Empty stomachs, Missed opportunities",
  },
  tywin: {
    about:
      "A wealthy and influential noble who demands the finest resources. Prince of Sunflower Land.",
    personality: "Aristocratic, Refined, Commanding",
    likes: "Luxury items, Quality goods, Status symbols",
    dislikes: "Poor quality items, Tardiness, Bumpkins",
  },
  cornwell: {
    about:
      "A knowledgeable farmer specializing in corn and crop cultivation. Lives in Sunflower Tower and contains a wealth of secrets and wisdom of Sunflower Land's past.",
    personality: "Patient, Wise, Agricultural expert",
    likes: "Corn, Crop cultivation, Sharing farming wisdom",
    dislikes: "Crop failures, Poor farming practices",
  },
  finley: {
    about: "A young, aspiring woman trying to outdo her older brother Finn",
    personality: "Competitive, Determined, Ambitious",
    likes: "Fishing, Proving himself, Learning new techniques",
    dislikes: "Being compared to Finn, Failed catches",
  },
  blacksmith: {
    about:
      "A skilled craftsman who forges tools and equipment for the community",
    personality: "Gruff, Hardworking, No-nonsense",
    likes: "Quality materials, Efficient work, Fair trades",
    dislikes: "Time-wasters, Poor quality materials",
  },
  tango: {
    about:
      "An energetic monkey who brings rhythm and joy to the community. One day drank a potion and turned into a monkey!",
    personality: "Lively, Passionate, Expressive",
    likes: "Dancing, Music, Celebrations",
    dislikes: "Standing still, Silence",
  },
  petro: {
    about:
      "A resourceful mechanic who can fix almost anything with oil and effort",
    personality: "Practical, Innovative, Hard-working",
    likes: "Machinery, Oil, Problem-solving",
    dislikes: "Broken equipment, Waste",
  },
  guria: {
    about: "A mystical Goblin witch with insight into the future",
    personality: "Mysterious, Intuitive, Enigmatic",
    likes: "Crystal balls, Predictions, Ancient wisdom",
    dislikes: "Skeptics, Disrupted readings",
  },
  chase: {
    about: "An adventurous rancher always seeking new discoveries",
    personality: "Bold, Curious, Adventurous",
    likes: "Exploration, Discoveries, Adventure",
    dislikes: "Staying in one place, Routine",
  },
};

export const CHORE_DIALOGUES: Partial<Record<NPCName, string[]>> = {
  "pumpkin' pete": [
    translate("npcDialogues.pumpkinPete.chore1"),
    translate("npcDialogues.pumpkinPete.chore2"),
    translate("npcDialogues.pumpkinPete.chore3"),
  ],
  peggy: [
    translate("npcDialogues.peggy.chore1"),
    translate("npcDialogues.peggy.chore2"),
    translate("npcDialogues.peggy.chore3"),
  ],
  betty: [
    translate("npcDialogues.betty.chore1"),
    translate("npcDialogues.betty.chore2"),
    translate("npcDialogues.betty.chore3"),
  ],
  miranda: [
    translate("npcDialogues.miranda.chore1"),
    translate("npcDialogues.miranda.chore2"),
    translate("npcDialogues.miranda.chore3"),
  ],
  blacksmith: [
    translate("npcDialogues.blacksmith.chore1"),
    translate("npcDialogues.blacksmith.chore2"),
    translate("npcDialogues.blacksmith.chore3"),
  ],
  raven: [
    translate("npcDialogues.raven.chore1"),
    translate("npcDialogues.raven.chore2"),
    translate("npcDialogues.raven.chore3"),
  ],
  cornwell: [
    translate("npcDialogues.cornwell.chore1"),
    translate("npcDialogues.cornwell.chore2"),
    translate("npcDialogues.cornwell.chore3"),
  ],
  finley: [
    translate("npcDialogues.finley.chore1"),
    translate("npcDialogues.finley.chore2"),
    translate("npcDialogues.finley.chore3"),
  ],
  gordo: [
    translate("npcDialogues.gordo.chore1"),
    translate("npcDialogues.gordo.chore2"),
    translate("npcDialogues.gordo.chore3"),
  ],
  tywin: [
    translate("npcDialogues.tywin.chore1"),
    translate("npcDialogues.tywin.chore2"),
    translate("npcDialogues.tywin.chore3"),
  ],
  "old salty": [
    translate("npcDialogues.oldSalty.chore1"),
    translate("npcDialogues.oldSalty.chore2"),
    translate("npcDialogues.oldSalty.chore3"),
  ],
  guria: [
    translate("npcDialogues.guria.chore1"),
    translate("npcDialogues.guria.chore2"),
    translate("npcDialogues.guria.chore3"),
  ],
  petro: [
    translate("npcDialogues.petro.chore1"),
    translate("npcDialogues.petro.chore2"),
    translate("npcDialogues.petro.chore3"),
  ],
  chase: [
    translate("npcDialogues.chase.chore1"),
    translate("npcDialogues.chase.chore2"),
    translate("npcDialogues.chase.chore3"),
  ],
  birdie: [
    translate("npcDialogues.birdie.chore1"),
    translate("npcDialogues.birdie.chore2"),
    translate("npcDialogues.birdie.chore3"),
  ],
  grimbly: [
    translate("npcDialogues.grimbly.chore1"),
    translate("npcDialogues.grimbly.chore2"),
    translate("npcDialogues.grimbly.chore3"),
  ],
  garth: [
    translate("npcDialogues.garth.chore1"),
    translate("npcDialogues.garth.chore2"),
    translate("npcDialogues.garth.chore3"),
  ],
  grimtooth: [
    translate("npcDialogues.grimtooth.chore1"),
    translate("npcDialogues.grimtooth.chore2"),
    translate("npcDialogues.grimtooth.chore3"),
  ],
  finn: [
    translate("npcDialogues.finn.chore1"),
    translate("npcDialogues.finn.chore2"),
    translate("npcDialogues.finn.chore3"),
  ],
  victoria: [
    translate("npcDialogues.victoria.chore1"),
    translate("npcDialogues.victoria.chore2"),
    translate("npcDialogues.victoria.chore3"),
  ],
  gambit: [
    translate("npcDialogues.gambit.chore1"),
    translate("npcDialogues.gambit.chore2"),
    translate("npcDialogues.gambit.chore3"),
  ],
  grubnuk: [
    translate("npcDialogues.grubnuk.chore1"),
    translate("npcDialogues.grubnuk.chore2"),
    translate("npcDialogues.grubnuk.chore3"),
  ],
  bert: [
    translate("npcDialogues.bert.chore1"),
    translate("npcDialogues.bert.chore2"),
    translate("npcDialogues.bert.chore3"),
  ],
  tango: [
    translate("npcDialogues.tango.chore1"),
    translate("npcDialogues.tango.chore2"),
    translate("npcDialogues.tango.chore3"),
  ],
  timmy: [
    translate("npcDialogues.timmy.chore1"),
    translate("npcDialogues.timmy.chore2"),
    translate("npcDialogues.timmy.chore3"),
  ],
  corale: [
    translate("npcDialogues.corale.chore1"),
    translate("npcDialogues.corale.chore2"),
    translate("npcDialogues.corale.chore3"),
  ],
};
