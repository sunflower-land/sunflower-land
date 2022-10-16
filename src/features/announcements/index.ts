import chicken from "assets/announcements/chickens.gif";
import nugget from "assets/announcements/nugget.gif";
import nomad from "assets/announcements/nomad.gif";
import cakes from "assets/announcements/cakes.png";
import rooster from "assets/announcements/rooster.png";
import shovel from "assets/announcements/shovel.png";
import warWeekOne from "assets/announcements/war_week_1.png";
import warWeekTwo from "assets/announcements/war_week_two.png";
import warWeekThree from "assets/announcements/war_week_three.png";
import warTent from "assets/announcements/war_tent.png";
import roadmap from "assets/announcements/roadmap.png";
import merchant from "assets/announcements/merchant.png";
import bumpkin from "assets/announcements/bumpkin.png";
import warriorTop from "assets/announcements/warrior_top.png";
import greenAmulet from "assets/bumpkins/shop/necklaces/green_amulet.png";
import boat from "assets/announcements/boat.png";
import warDrop from "assets/announcements/war_drop.png";

export interface Announcement {
  date: Date;
  image?: string;
  title: string;
  notes: string[];
  link?: string;
  type?: "war";
}

/**
 * Announcements are shown in game after the `date`.
 */
export const ANNOUNCEMENTS: Announcement[] = [
  {
    date: new Date("2022-10-17T00:00:00"),
    title: "Sending the cavalry",
    notes: [
      "It's getting rough out there.",
      "We are going to need more troops, let's stock up ready for their arrival.",
      "Next week we will launch our main attack and end this war once and for all!",
    ],
    type: "war",
  },
  {
    date: new Date("2022-10-12T00:00:00"),
    title: "War Tent Items",
    notes: [
      "All war tent items will become available for crafting",
      "6am UTC 13th October",
      "New Items: Skull Hat, War Skull, Undead Chicken & War Tombstone.",
    ],
    type: "war",
    image: warDrop,
  },
  {
    date: new Date("2022-10-11T00:00:00"),
    title: "New Wallet Transfer",
    notes: [
      "If you need to transfer your account to a new wallet, you can now do it in-game",
      "Access Menu > Settings > Transfer Ownership",
      "This is useful if your wallet is compromised or you want to move your farm to a new wallet.",
    ],
  },
  {
    date: new Date("2022-10-10T00:00:00"),
    title: "You are my sunshine",
    notes: [
      "The war is starting to take its toll on the troops.",
      "I think we need to boost morale so we can continue fighting.",
      "Moonshine is a popular choice of drink in this situation but we can make it stronger with Sunshine.",
    ],
    type: "war",
  },
  {
    date: new Date("2022-10-04T00:00:00"),
    title: "Green Amulet Drop",
    notes: [
      "At 11pm 2022-10-05 UTC, the Green Amulet will be dropped.",
      "Visit the War Tent at Goblin Village to craft it.",
    ],
    image: greenAmulet,
  },
  {
    date: new Date("2022-10-03T00:00:00"),
    title: "Making waves",
    notes: [
      "It looks like we are going to run out of land if we keep expanding.",
      "The war effort has attracted lots of attention so we should consider building a boat to explore.",
    ],
    image: boat,
    type: "war",
  },
  {
    date: new Date("2022-09-27T00:00:00"),
    title: "Warrior Shirt Drop",
    notes: [
      "At 12am 2022-09-28 UTC, the Warrior Shirt will be dropped.",
      "Visit the War Tent at Goblin Village to craft it.",
      "250 will become available for a discounted price of 650 war bonds.",
    ],
    image: warriorTop,
  },
  {
    date: new Date("2022-09-26T02:00:00"),
    title: "Bumpkin Art Competition",
    notes: [
      "Calling all artists for the first official art contest!",
      "Design Bumpkin NFT items and get your art in the game.",
      "30,000 SFL in prizes to be won for the community",
    ],
    link: "https://github.com/sunflower-land/sunflower-land/discussions/1434",
    image: bumpkin,
  },
  {
    date: new Date("2022-09-26T00:00:00"),
    title: "Something Smells bad",
    notes: [
      "We are getting reports that the enemy has a secret weapon they found in a cave.",
      "We need to craft more swords if we are going to win this war.",
      "It's also possible to make stink bombs from rotten eggs, the pulp of a pumpkin and some mouldy cabbages.",
    ],
    link: "https://docs.sunflower-land.com/fundamentals/special-events/goblin-war",
    type: "war",
  },
  {
    date: new Date("2022-09-19T04:00:00"),
    title: "The Halvening is coming!",
    notes: [
      "In-game buy and sale prices are about to half!",
      "At 2022-09-21 12:00am UTC all in-game prices will automatically change.",
      "Make sure you are prepared!",
    ],
    link: "https://docs.sunflower-land.com/economy/tokenomics/the-halvening",
  },
  {
    date: new Date("2022-09-19T00:00:00"),
    title: "Setting the stage",
    notes: [
      "Great work clearing the land, now we can start to build.",
      "We will need to create some shelter and a training ground in order for the soldiers to prepare for the big siege.",
      "I’ve made a list of things that we will need to get started.",
    ],
    link: "https://docs.sunflower-land.com/fundamentals/special-events/goblin-war",
    image: warWeekThree,
    type: "war",
  },
  {
    date: new Date("2022-09-18T23:00:00"),
    title: "Community Garden",
    notes: [
      "The Community Garden offers NFTs built entirely by the community.",
      "You can access the garden by visiting the merchant west of the town.",
    ],
    link: "https://docs.sunflower-land.com/player-guides/islands/community-garden",
    image: merchant,
  },
  {
    date: new Date("2022-09-15T22:00:00"),
    title: "Roadmap Updates",
    notes: [
      "The team is getting closer to launch!",
      "Land Expansion, more crops, more buildings & more resources.",
      "Have a sneak peak of what is coming",
    ],
    link: "https://docs.sunflower-land.com/fundamentals/roadmap/launch",
    image: roadmap,
  },
  {
    date: new Date("2022-09-12T00:00:00"),
    title: "The woods for the trees",
    notes: [
      "War is big business and requires a lot of land.",
      "We need to cut down the Forrest to the south, this will provide ample room for our soldiers to train and prepare.",
      "We have negotiated a deal with the local blacksmith who can help you with a much better rate on the items you need.",
    ],
    link: "https://docs.sunflower-land.com/fundamentals/special-events/goblin-war",
    image: warWeekTwo,
    type: "war",
  },
  {
    date: new Date("2022-09-08T00:00:00"),
    title: "The war tent opens!",
    notes: [
      "The war tent is now open",
      "Visit Goblin Village to view the available rare items.",
      "Each week new limited edition items will become available.",
    ],
    link: "https://docs.sunflower-land.com/fundamentals/special-events/goblin-war",
    image: warTent,
    type: "war",
  },
  {
    date: new Date("2022-09-05T00:00:00"),
    title: "The war begins",
    notes: [
      "All this talk of war makes me hungry.",
      "If we are going to survive the next few weeks we better prepare some food for ourselves and the troops.",
      "These rations will need to last us for at least 10 weeks",
      "Visit the war collectors and see what food is needed",
    ],
    link: "https://docs.sunflower-land.com/fundamentals/special-events/goblin-war",
    image: warWeekOne,
    type: "war",
  },
  {
    date: new Date("2022-07-21T00:00:00"),
    title: "Shovel",
    notes: [
      "The shovel is now available!",
      "Use it to remove unwanted crops.",
      "Double tap crops to remove them.",
      "Craft it at the Blacksmith.",
    ],
    link: "https://docs.sunflower-land.com/player-guides/crop-farming#tools",
    image: shovel,
  },
  {
    date: new Date("2022-07-04T00:00:00"),
    title: "Rooster",
    notes: [
      "The rooster is now available!",
      "Doubles the chance of dropping a mutant chicken.",
      "Craft it at Goblin Village.",
    ],
    link: "https://docs.sunflower-land.com/player-guides/rare-and-limited-items#boosts-1",
    image: rooster,
  },
  {
    date: new Date("2022-06-26T23:57:05.618Z"),
    title: "Cakes",
    notes: [
      "Craft a new cake weekly!",
      "Collect them all!",
      "Will you win the great bake off?",
    ],
    link: "https://docs.sunflower-land.com/fundamentals/special-events/the-great-sunflower-bakeoff",
    image: cakes,
  },
  {
    date: new Date("2022-06-22T06:27:20.861Z"),
    title: "Traveling Salesman",
    notes: [
      "Find weekly offers.",
      "Trade resources for items.",
      "What will be the next offer?",
    ],
    link: "https://docs.sunflower-land.com/fundamentals/special-events/traveling-salesman",
    image: nomad,
  },
  {
    date: new Date("Mon, 20 Jun 2022 22:30:00 GMT"),
    title: "Nugget is open for crafting!",
    notes: [
      "Gives a 25% increase to Gold Mines.",
      "Price: 50 Gold, 300 SFL",
      "Supply: 1000",
    ],
    link: "https://docs.sunflower-land.com/player-guides/rare-and-limited-items#boosts",
    image: nugget,
  },
  {
    date: new Date(
      "Tue Jun 01 2022 10:06:50 GMT-0300 (Brasilia Standard Time)"
    ),
    title: "Chickens",
    notes: [
      "Craft chickens at the Barn.",
      "Feed chickens wheat and collect eggs.",
      "Craft a rare Chicken Coop to grow your egg empire.",
      "Will you be lucky enough to find a mutant chicken in an egg?",
    ],
    link: "https://docs.sunflower-land.com/player-guides/raising-animals/chickens",
    image: chicken,
  },
];
