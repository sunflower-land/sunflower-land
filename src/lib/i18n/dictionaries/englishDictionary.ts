import {
  TranslationKeys,
  AchievementsDialog,
  BumpkinPartRequirements,
  BumpkinTrade,
  ConfirmationTerms,
  Conversations,
  ErrorTerms,
  GameTerms,
  GeneralTerms,
  GuideTerms,
  HenHouseTerms,
  Intro,
  Onboarding,
  Questions,
  RetreatTerms,
  RewardTerms,
  RulesTerms,
  SeasonTerms,
  ShopItems,
  Statements,
  WarningTerms,
  WelcomeTerms,
  TransactionTerms,
  GameDescriptions,
  FishingQuests,
  IslandName,
} from "./types";

const generalTerms: Record<GeneralTerms, string> = {
  "2x.sale": "2x Sale",
  achievements: "Achievements",
  "add.liquidity": "Add Liquidity",
  alrClaim: "Already Claimed!",
  auctions: "Auctions",
  back: "Back",
  basket: "Basket",
  beta: "Beta",
  build: "Build",
  buy: "Buy",
  cancel: "Cancel",
  "card.cash": "Card/Cash",
  chest: "Chest",
  chores: "Chores",
  claim: "Claim",
  claimSkill: "Claim skill",
  clear: "Clear",
  close: "Close",
  craft: "Craft",
  crafting: "Crafting",
  comingSoon: "Coming soon",
  completed: "Completed",
  congrats: "Congratulations!",
  connected: "Connected",
  connecting: "Connecting",
  continue: "Continue",
  crops: "Crops",
  date: "Date",
  delivery: "Delivery",
  deliveries: "Deliveries",
  details: "Details",
  equip: "Equip",
  error: "Error",
  exotics: "Exotics",
  explore: "Explore",
  farm: "Farm",
  featured: "Featured",
  "feed.bumpkin": "Feed Bumpkin",
  "fish.caught": "Fish Caught: ",
  for: "for",
  forbidden: "Forbidden",
  fruit: "Fruit",
  fruits: "Fruits",
  gotIt: "Got it",
  "grant.wish": "Grant New Wish",
  guide: "Guide",
  "hungry?": "Hungry?",
  info: "Info",
  item: "Item:",
  lastUpdated: "Last updated: ",
  letsGo: "Let's Go!",
  list: "List",
  loading: "Loading",
  lvl: "Level",
  maintenance: "Maintenance",
  "make.wish": "Make a Wish",
  "making.wish": "Making a wish",
  mint: "Mint",
  minting: "minting",
  minted: "Already minted!",
  music: "Music",
  next: "Next",
  nextSkillPtLvl: "Next skill point: level",
  "no.mail": "No mail",
  noThanks: "No thanks",
  "ocean.fishing": "Ocean fishing",
  ok: "OK",
  "open.gift": "Open Gift",
  "pass.required": "Pass Required",
  "placing.bid": "Placing bid",
  print: "Print",
  "providing.liquidity": "Providing Liquidity",
  purchasing: "Purchasing",
  rank: "Rank",
  readMore: "Read more",
  refresh: "Refresh",
  refreshing: "Refreshing",
  reqSkillPts: "Required Skill Points",
  reqSkills: "Required Skills:",
  retry: "Retry",
  "reward.discovered": "Reward Discovered",
  save: "Save",
  saving: "Saving",
  sell: "Sell",
  "sell.all": "Sell All",
  "sell.one": "Sell 1",
  "sell.ten": "Sell 10",
  shopping: "Shopping",
  skillPts: "Skill Points:",
  skills: "Skills",
  "skip.order": "Skip Order",
  sound: "Sound Effects: ",
  success: "Success!",
  "support.team": "Support Team",
  swapping: "Swapping",
  syncing: "Syncing",
  task: "Task",
  tools: "Tools",
  total: "Total",
  "total.price": "Total Price: ",
  trades: "Trades",
  trading: "Trading",
  "trash.collection": "Trash Collection",
  travel: "Travel",
  tryAgain: "Try again",
  uhOh: "Uh oh!",
  unlocking: "Unlocking",
  "unlock.land": "Unlock more land",
  verify: "Verify",
  version: "Version",
  viewAll: "View all",
  "visit.friend": "Visit Friend",
  wallet: "Wallet",
  welcome: "Welcome!",
  "wishing.well": "Wishing Well",
  withdraw: "Withdraw",
  "you.are.here": "You are here",
  bait: "Bait",
  bounty: "Bounty",
  coupons: "Coupons",
  "easter.eggs": "Easter Eggs",
  fertilisers: "Fertilisers",
  fish: "Fish",
  foods: "Foods",
  resources: "Resources",
  seeds: "Seeds",
  cook: "Cook",
};

const gameTerms: Record<GameTerms, string> = {
  bumpkinLvl: "Bumpkin level",
  dailyLim: "Daily SFL Limit",
  gobSwarm: "Goblin Swarm!",
  potions: "Potions",
  sflDiscord: "Sunflower Land Discord Server",
  "auction.winner": "Auction Winner!",
  "farm.banned": "This farm is banned",
  "proof.of.humanity": "Proof of Humanity",
  "no.sfl": "No SFL tokens found",
  "granting.wish": "Granting your wish",
  "new.delivery.in": "New deliveries available in: ",
};

const confirmationTerms: Record<ConfirmationTerms, string> = {
  "confirmation.sellCrops": "Are you sure you want to",
};

const welcomeTerms: Record<WelcomeTerms, string> = {
  "welcome.createAccount": "Create account",
  "welcome.creatingAccount": "Creating your account",
  "welcome.email": "Email & Social Login",
  "welcome.login": "Login",
  "welcome.needHelp": "Need help?",
  "welcome.otherWallets": "Other wallets",
  "welcome.signingIn": "Signing you in",
  "welcome.signInMessage":
    "Accept the signature request in your browser wallet to login.",
  "welcome.takeover":
    "It looks like you are new to Sunflower Land and have claimed ownership of another player's account.",
};

const rulesTerms: Record<RulesTerms, string> = {
  rules: "Game Rules",
  "rules.accounts": "1 account per player",
  "rules.game": "This is a game. Not a financial product.",
  "rules.noBots": "No botting or automation",
  "rules.termsOfService": "Terms of Service",
};

const seasonTerms: Record<SeasonTerms, string> = {
  "season.accessTo": "You have access to:",
  "season.banner": "Seasonal Banner",
  "season.bonusTickets": "Bonus Seasonal Tickets",
  "season.boostXP": "+10% EXP from food",
  "season.buyNow": "Buy Now",
  "season.discount": "25% SFL discount on seasonal items",
  "season.exclusiveOffer": "Exclusive offer!",
  "season.goodLuck": "Good luck in the season!",
  "season.includes": "Includes:",
  "season.limitedOffer": " Limited time only!",
  "season.wearableAirdrop": "Seasonal Wearable Airdrop",
  "season.ctk": "Catch the Kraken",
};

const introTerms: Record<Intro, string> = {
  "intro.one":
    "Howdy there, Bumpkin! Welcome to Sunflower Land, the bountiful farming paradise where anything is possible!",
  "intro.two":
    "What a beautiful island you have set up on! I'm Pumpkin Pete, your neighboring farmer.",
  "intro.three":
    "Right now the players are celebrating a festival in the plaza with fantastic rewards and magical items.",
  "intro.four":
    "Before you can join the fun, you will need to grow your farm and gather some resources. You don't want to turn up empty handed!",
  "intro.five":
    "To get started, you will want to chop down those trees and grow your island.",
};

const shopItems: Record<ShopItems, string> = {
  "shopItems.one": "Hey, hey! Welcome back.",
  "shopItems.two":
    "You've helped solve the crop shortage and prices have returned to normal.",
  "shopItems.three": "It's time to move onto some bigger and better crops!",
};

const achievementTerms: Record<AchievementsDialog, string> = {
  "breadWinner.description": "Earn 0.001 SFL",
  "breadWinner.one":
    "Well, well, well, partner... It looks like you need some SFL!",
  "breadWinner.two":
    "In Sunflower Land, a healthy stash of SFL is the key to crafting tools, buildings and rare NFTs",
  "breadWinner.three":
    "The quickest way to earn SFL is by planting and selling crops.",

  "sunSeeker.description": "Harvest Sunflower 100 times",
  "cabbageKing.description": "Harvest Cabbage 200 times",
  "jackOLantern.description": "Harvest Pumpkin 500 times",
  "coolFlower.description": "Harvest Cauliflower 100 times",
  "farmHand.description": "Harvest crops 10,000 times",
  "beetrootBeast.description": "Harvest Beetroot 2,000 times",
  "myLifeIsPotato.description": "Harvest Potato 5,000 times",
  "rapidRadish.description": "Harvest Radish 200 times",
  "twentyTwentyVision.description": "Harvest Carrot 10,000 times",
  "stapleCrop.description": "Harvest Wheat 10,000 times",
  "sunflowerSuperstar.description": "Harvest Sunflower 100,000 times",
  "bumpkinBillionaire.description": "Earn 5,000 SFL",
  "patientParsnips.description": "Harvest Parsnip 5,000 times",
  "cropChampion.description": "Harvest 1 million crops",

  "busyBumpkin.description": "Reach level 2",
  "busyBumpkin.one":
    "Howdy, my ambitious friend! To unlock new crops, expansions, buildings and much more you will need to level up.",
  "busyBumpkin.two":
    "Head over to the Fire Pit, cook up a delicious recipe and feed it to your Bumpkin.",

  "kissTheCook.description": "Cook 20 meals",
  "bakersDozen.description": "Bake 13 cakes",
  "brilliantBumpkin.description": "Reach level 20",
  "chefDeCuisine.description": "Cook 5,000 meals",

  "scarecrowMaestro.description": "Craft a scarecrow and boost your crops",
  "scarecrowMaestro.one":
    "Howdy, partner! It is time you learn the art of crafting and boost your farming abilities",
  "scarecrowMaestro.two":
    "Travel to the Pumpkin Plaza, visit the Blacksmith and craft a Scarecrow.",

  "bigSpender.description": "Spend 10 SFL",
  "museum.description":
    "Have 10 different kinds of rare items placed on your land",
  "highRoller.description": "Spend 7,500 SFL",
  "timbeerrr.description": "Chop 150 trees",
  "craftmanship.description": "Craft 100 tools",
  "driller.description": "Mine 50 stone rocks",
  "ironEyes.description": "Mine 50 iron rocks",
  "elDorado.description": "Mine 50 gold rocks",
  "timeToChop.description": "Craft 500 axes",
  "canary.description": "Mine 1,000 stone rocks",
  "somethingShiny.description": "Mine 500 iron rocks",
  "bumpkinChainsawAmateur.description": "Chop 5,000 trees",
  "goldFever.description": "Mine 500 gold rocks",

  // Explorer
  "explorer.description": "Expand your land",
  "explorer.one":
    "Let's gather some wood by chopping down these trees and expand the island. Go ahead and figure out the best way to do it.",

  "expansion.description": "Expand your land to new horizons.",

  // Well of Prosperity
  "wellOfProsperity.description": "Build a well",
  "wellOfProsperity.one": "Well, well, well, what do we have here?",
  "wellOfProsperity.two":
    "It looks like your crops are thirsty. To support more crops you must first build a well.",

  "contractor.description": "Have 10 buildings constructed on your land",
  "fruitAficionado.description": "Harvest 50 fruit",
  "fruitAficionado.one":
    "Hey there, fruit gatherer! Fruits are nature's sweetest gifts, and they bring a burst of flavor to your farm.",
  "fruitAficionado.two":
    "By collecting different fruits, such as apples, oranges, and blueberries, you'll unlock unique recipes, boost your cooking skills, and create delightful treats",

  "orangeSqueeze.description": "Harvest Orange 100 times",
  "appleOfMyEye.description": "Harvest Apple 500 times",
  "blueChip.description": "Harvest Blueberry 5,000 times",
  "fruitPlatter.description": "Harvest 50,000 fruits",
  "crowdFavourite.description": "Complete 100 deliveries",

  "deliveryDynamo.description": "Complete 3 deliveries",
  "deliveryDynamo.one":
    "Howdy, reliable farmer! Bumpkins from all around need your help with deliveries.",
  "deliveryDynamo.two":
    "By completing deliveries, you'll make them happy and earn some fantastic SFL rewards in return ",

  "seasonedFarmer.description": "Collect 50 Seasonal Resources",
  "seasonedFarmer.one":
    "Howdy, seasonal adventurer! Sunflower Land is known for its special seasons filled with unique items and surprises.",
  "seasonedFarmer.two":
    "By collecting Seasonal resources, you'll gain access to limited-time rewards, exclusive crafts, and rare treasures. It's like having a front-row ticket to the wonders of each season.",
  "seasonedFarmer.three":
    "So complete tasks, participate in events, and gather those Seasonal Tickets to enjoy the best that Sunflower Land has to offer!",
  "treasureHunter.description": "Dig 10 holes",
  "treasureHunter.one":
    "Ahoy, treasure hunter! Sunflower Land is full of hidden treasures waiting to be discovered.",
  "treasureHunter.two":
    "Grab your shovel and head to Treasure Island, where you can dig for valuable items and rare surprises.",
  "eggcellentCollection.description": "Collect 10 Eggs",
  "eggcellentCollection.one":
    "Howdy, egg collector! Chickens are wonderful farm companions that provide us with delicious eggs.",
  "eggcellentCollection.two":
    "By collecting eggs, you'll have a fresh supply of ingredients for cooking, and you'll also unlock special recipes and bonuses.",
};

const guideTerms: Record<GuideTerms, string> = {
  "guide.intro":
    "From humble beginnings to expert farming, this guide has got you covered!",
  "gathering.description.one":
    "To thrive in Sunflower Land, mastering the art of resource gathering is essential. Start by equipping the appropriate tools to collect different resources. Use the trusty Axe to chop down trees and acquire wood. To craft tools, visit the local workbench & exchange your SFL/resources for the desired tool.",
  "gathering.description.two":
    "As you progress and gather sufficient resources, you'll unlock the ability to expand your territory. Expanding your land opens up new horizons in Sunflower Land. Land expansions reveal a treasure trove of resources, including fertile soil for planting crops, majestic trees, valuable stone deposits, precious iron veins, shimmering gold deposits, delightful fruit patches and much more.",
  "gathering.description.three":
    "Remember, resource gathering and land expansion are the backbone of your farming journey. Embrace the challenges and rewards that come with each step, and watch your Sunflower Land flourish with bountiful resources and endless possibilities.",

  "crops.description.one":
    "In Sunflower Land, crops play a crucial role in your journey towards prosperity. By planting and harvesting crops, you can earn SFL (Sunflower Token) or utilize them to craft valuable recipes and items within the game.",
  "crops.description.two":
    "To grow crops, you need to purchase the respective seeds from the in-game shop. Each crop has a different growth time, ranging from just 1 minute for Sunflowers to 36 hours for Kale. Once the crops are fully grown, you can harvest them and reap the rewards.",
  "crops.description.three":
    "Remember, as you expand your land and progress in the game, more crops will become available, offering greater opportunities for earning SFL and exploring the vast potential of Sunflower Land's farming economy. So get your hands dirty, plant those seeds, and watch your crops flourish as you harvest your way to success!",

  "building.description.one":
    "Explore the diverse range of buildings available as you progress in Sunflower Land. From hen houses to workshops and beyond, each structure brings unique advantages to your farm. Take advantage of these buildings to streamline your farming operations, increase productivity, and unlock new possibilities. Plan your layout carefully and enjoy the rewards that come with constructing a thriving farm in Sunflower Land.",
  "building.description.two":
    "In Sunflower Land, buildings are the cornerstone of your farming journey. To access the buildings menu, click the Inventory icon and select the Buildings tab. Choose the desired structure and return to your farm screen. Find an open space, marked in green, and confirm the placement. Wait for the timer to complete, and your new building will be ready to use. Buildings provide various benefits and unlock exciting gameplay features. Strategically position them on your farm to maximize efficiency and watch as your farming empire grows and prospers.",

  "cooking.description.one":
    "Cooking allows you to nourish your Bumpkin and help them gain valuable experience points (XP). By utilizing the crops you've harvested, you can prepare delicious food at different buildings dedicated to cooking.",
  "cooking.description.two":
    "Starting with the Fire Pit, every farm has access to basic cooking facilities from the beginning. However, as you progress, you can unlock more advanced buildings such as the Kitchen, Bakery, Deli, and Smoothie Shack, each offering a wider variety of recipes and culinary delights.",
  "cooking.description.three":
    "To cook, simply select a building and choose a recipe you wish to prepare. The recipe will provide details about the required ingredients, the XP gained upon consumption, and the preparation time. After initiating the cooking process, keep an eye on the timer to know when the food will be ready to collect.",
  "cooking.description.four":
    "Once the food is ready, retrieve it from the building by clicking on it and moving it into your inventory. From there, you can interact with your Bumpkin NPC on the farm and feed them the prepared food, helping them gain XP and progress further in the game.",
  "cooking.description.five":
    "Experiment with different recipes, unlock new buildings, and discover the joy of cooking as you nurture your Bumpkin and embark on a delicious culinary adventure in Sunflower Land.",

  "animals.description.one":
    "Chickens in Sunflower Land are a delightful addition to your farm, serving as a source of eggs that can be used in various recipes and crafting. To start with chickens, you'll need to reach Bumpkin level 9 and build the Hen House. From there, you have the option to purchase chickens or place the ones you already have. Simply drag and drop them onto your farm, just like placing buildings. On a standard farm, every Hen House houses up to 10 chickens, and if you own the Chicken Coop SFT, this limit extends to 15.",
  "animals.description.two":
    "Each chicken has an indicator above its head, displaying its current mood or needs. This can range from being hungry, tired, happy, or ready to hatch. To keep your chickens content and productive, feed them by selecting wheat from your inventory and interacting with the chicken. Feeding initiates the egg timer, which takes 48 hours for the eggs to be ready to hatch. Once the eggs are ready, visit your farm, check the icon above each chicken, and interact with them to find out the type of egg that has hatched. Occasionally, you may even discover rare mutant chickens, which offer special boosts such as faster egg production, increased yield, or reduced food consumption.",
  "animals.description.three":
    "Nurturing your chickens and collecting their eggs adds a dynamic and rewarding element to your farm in Sunflower Land. Experiment with recipes, make use of the eggs in your crafting endeavors, and enjoy the surprises that come with rare mutant chickens. Build a thriving poultry operation and reap the benefits of your hard work as you embrace the charming world of chickens in Sunflower Land.",

  "crafting.description.one":
    "In Sunflower Land, crafting NFTs is a crucial aspect of boosting your farming output and accelerating your progress. These special items provide various bonuses, such as crop growth boosts, cooking enhancements, and resource boosts, which can greatly expedite your journey. By maximizing your SFL (Sunflower Token), you can craft tools, gather resources, and expand your land to further establish your farming empire.",
  "crafting.description.two":
    "To begin crafting items, we'll visit Igor, a skilled craftsman in Sunfloria. After hopping on the boat and arriving at Sunfloria, head to the top of the island to have a conversation with Igor. He is currently offering a Basic Scarecrow, which boosts the speed of Sunflowers, Potatoes, and Pumpkins. This is an excellent deal that requires exchanging your resources for the scarecrow. Once obtained, return to your main island and enter design mode by clicking on the white hand icon in the top right corner of the game.",
  "crafting.description.three":
    "In design mode, you can strategically place items and rearrange resources on your farm to optimize its layout and enhance its visual appeal. This step is crucial in maximizing the effectiveness of your crafted equipment. For example, place the Scarecrow over the plots you want to boost. Additionally, consider purchasing decorations to add charm and tidiness to your land.",
  "crafting.description.four":
    "By crafting equipment and placing it strategically, you can amplify your farming abilities, create an island home to be proud of, and accelerate your progress in Sunflower Land.",

  "deliveries.description.one":
    "Deliveries in Sunflower Land provide an exciting opportunity to help hungry Goblins and fellow Bumpkins while earning rewards. Every day you will be able to see all the orders you have by clicking on the delivery board on the bottom left of the screen. The orders have been placed by some local NPCs that can be found hanging around Pumpkin Plaza. To fulfill an order, you will need to take a boat ride to Pumpkin Plaza and look for the NPC expecting the delivery. Once you find them, click on them to deliver the order and receive your reward.",
  "deliveries.description.two":
    "As a new player, you start with three order slots, but as you expand your farm, you will unlock additional slots, allowing advanced players to take on more orders. New orders come in every 24 hours, offering a range of tasks from farming produce to cooking food and gathering resources. Completing orders will earn you milestone bonuses, including Block Bucks, SFL, delicious cakes, and other rewards. The reward system is based on the difficulty of the request, so consider prioritizing orders that offer greater rewards to maximize your gains. Keep an eye on the board and challenge yourself with a variety of orders, leveling up and unlocking new buildings as needed to fulfill more demanding requests.",

  "scavenger.description.one":
    "Scavenging in Sunflower Land offers exciting opportunities to uncover hidden treasures and gather valuable resources. The first aspect of scavenging is digging for treasure on Treasure Island, where you can become a pirate treasure hunter. By crafting a sand shovel and venturing to Treasure Island, you can dig in dark sandy areas to uncover a variety of treasures, including bounty, decorations, and even ancient SFTs with utility.",
  "scavenger.description.two":
    "Another form of scavenging involves gathering wild mushrooms that appear spontaneously on your farm and surrounding islands. These mushrooms can be collected for free and used in recipes, quests, and crafting items. Keep an eye out for these mushrooms, as they replenish every 16 hours, with a maximum limit of 5 mushrooms on your farm. If your land is full, mushrooms will appear on the surrounding islands, ensuring you don't miss out on these valuable resources.",

  "fruit.description.one":
    "Fruit plays a significant role in Sunflower Land as a valuable resource that can be sold for SFL or utilized in various recipes and crafting. Unlike crops, fruit patches have the unique ability to replenish multiple times after each harvest, providing a sustainable source of fruit for players.",
  "fruit.description.two":
    "To plant fruit, you'll need to acquire larger fruit patches, which become available on the 9-10th expansion of your farm.",
  "fruit.description.three":
    "By cultivating fruit and incorporating it into your farming strategies, you can maximize your profits, create delicious recipes, and unlock new possibilities in Sunflower Land.",

  "seasons.description.one":
    "Seasons in Sunflower Land bring excitement and freshness to the game, offering players new challenges and opportunities. With the introduction of each season, players can look forward to a variety of new craftable items, limited edition decorations, mutant animals, and rare treasures. These seasonal changes create a dynamic and evolving gameplay experience, encouraging players to adapt their strategies and explore new possibilities on their farms. Additionally, seasonal tickets add a strategic element to the game, as players must decide how to allocate their tickets wisely, whether it's collecting rare items, opting for higher supply decorations, or exchanging tickets for SFL. The seasonal mechanic keeps the game engaging and ensures that there's always something to look forward to in Sunflower Land.",
  "seasons.description.two":
    "The availability of seasonal items at the Goblin Blacksmith adds another layer of excitement. Players must gather the required resources and seasonal tickets to craft these limited-supply items, creating a sense of competition and urgency. Planning ahead and strategizing become crucial as players aim to secure their desired items before the supply runs out. Moreover, the option to swap seasonal tickets for SFL provides flexibility and allows players to make choices that align with their specific gameplay goals. With each season's unique offerings and the anticipation of surprise events, Sunflower Land keeps players engaged and entertained throughout the year, fostering a vibrant and ever-evolving farming experience.",
};

const conversations: Record<Conversations, string> = {
  "hank-intro.headline": "Help an old man?",
  "hank-intro.one": "Howdy Bumpkin! Welcome to our little patch of paradise.",
  "hank-intro.two":
    "I've been working this land for fifty years but could sure use some help.",
  "hank-intro.three":
    "I can teach you the basics of farming, as long as you help me with my daily chores.",
  "hank-crafting.headline": "Craft a scarecrow",
  "hank-crafting.one":
    "Hmmm, those crops are growing awfully slow. I aint' got time to wait around.",
  "hank-crafting.two": "Craft a scarecrow to speed up your crops.",
  "betty-intro.headline": "How to grow your farm",
  "betty-intro.one": "Hey, hey! Welcome to my market.",
  "betty-intro.two":
    "Bring me your finest harvest, and I will give you a fair price for them!",
  "betty-intro.three":
    "You need seeds? From potatoes to parsnips, I've got you covered!",
  "betty.market-intro.one":
    "Hey there, Bumpkin! It's Betty from the farmer's market. I travel between islands to buy crops and sell fresh seeds.",
  "betty.market-intro.two":
    "Good news: you just stumbled upon a shiny new shovel! Bad news: we've hit a bit of a crop shortage.",
  "betty.market-intro.three":
    "For a limited time I am offering newcomers double the money for any crops you bring to me.",
  "betty.market-intro.four":
    "Harvest those Sunflowers and let's start your farming empire.",
  "bruce-intro.headline": "Cooking Introduction",
  "bruce-intro.one": "I'm the owner of this lovely little bistro.",
  "bruce-intro.two":
    "Bring me resources and I will cook all the food you can eat!",
  "bruce-intro.three":
    "Howdy farmer! I can spot a hungry Bumpkin from a mile away.",
  "blacksmith-intro.headline": "Chop chop chop.",
  "blacksmith-intro.one":
    "I'm a master of tools, and with the right resources, I can craft anything you need...including more tools!",
  "pete.first-expansion.one":
    "Congratulations, Bumpkin! Your farm is growing faster than a beanstalk in a rainstorm!",
  "pete.first-expansion.two":
    "With each expansion, you'll find cool stuff like special resources, new trees, and more to collect!",
  "pete.first-expansion.three":
    "Keep an eye out for surprise gifts from the generous goblins as you explore—they're not just expert builders, but crafty secret givers!",
  "pete.blacksmith.one": "Hmm, those crops are growing slow.",
  "pete.blacksmith.two":
    "Sunflower Land is full of magical items you can craft to enhance your farming abilities.",
  "pete.blacksmith.three":
    "Head over to the work bench and craft a scarecrow to speed up those Sunflowers.",
  "pete.levelthree.one": "Congratulations, your green thumb is truly shining!",
  "pete.levelthree.two":
    "It's high time we head to the Plaza, where your farming prowess can shine even brighter.",
  "pete.levelthree.three":
    "At the plaza you can deliver your resources for rewards, craft magical items & trade with other players.",
  "pete.levelthree.four":
    "You can travel by clicking on the world icon in the bottom left.",
  "pete.help.one":
    "As you level up, you will unlock new areas to explore. First up is the Pumpkin Plaza....my home!",
  "pete.help.two":
    "Here you can complete deliveries for rewards, craft magical items & trade with other players.",
};

const henHouseTerms: Record<HenHouseTerms, string> = {
  "henHouse.chickens": "Chickens",
  "henHouse.text.one": "Feed wheat and collect eggs",
  "henHouse.text.two": "Lazy Chicken",
  "henHouse.text.three": "Put your chicken to work to start collecting eggs!",
  "henHouse.text.four": "Working Chicken",
  "henHouse.text.five": "Already placed and working hard!",
  "henHouse.text.six": "Build an extra Hen House to farm more chickens",
};

const rewardTerms: Record<RewardTerms, string> = {
  "reward.title": "Daily Reward",
  "reward.streak": " day streak",
  "reward.comeBackLater": "Come back later for more rewards",
  "reward.nextBonus": " Next bonus: ",
  "reward.unlock": "Unlock Reward",
  "reward.open": "Open reward",
  "reward.lvlRequirement": "You must be level 3 to claim daily rewards.",
  "reward.revealing": "What could it be?",
  "reward.streakBonus": "3x streak bonus",
  "reward.found": "You found",
};

const errorTerms: Record<ErrorTerms, string> = {
  "error.blocked.betaTestersOnly": "Beta testers only!",
  "error.congestion.one":
    "We are trying our best but looks like Polygon is getting a lot of traffic or you have lost your connection.",
  "error.congestion.two":
    "If this error continues please try changing your Metamask RPC",
  "error.connection.one":
    "It looks like we were unable to complete this request.",
  "error.connection.two": "It may be a simple connection issue.",
  "error.connection.three": "You can click refresh to try again.",
  "error.connection.four":
    "If the issue remains, you can reach out for help by either contacting our support team or jumping over to our discord and asking our community.",
  "error.diagnostic.info": "Diagnostic Information",
  "error.forbidden.goblinVillage":
    "You are not allowed to visit Goblin Village!",
  "error.multipleDevices.one": "Multiple devices open",
  "error.multipleDevices.two":
    "Please close any other browser tabs or devices that you are operating on.",
  "error.multipleWallets.one": "Multiple Wallets",
  "error.multipleWallets.two":
    "It looks like you have multiple wallets installed. This can cause unexpected behaviour.Try to disable all but one wallet.",
  "error.polygonRPC": "Please try again or check your Polygon RPC settings.",
  "error.toManyRequest.one": "Too many requests!",
  "error.toManyRequest.two":
    "Looks like you have been busy! Please try again later.",
  "error.Web3NotFound": "Web3 Not Found",
  "error.wentWrong": "Something went wrong!",
  "error.noBumpkin": "Bumpkin is not defined",
  "error.clock.not.synced": "Clock not in sync",
};

const warningTerms: Record<WarningTerms, string> = {
  "warning.noAxe": "No Axe Selected!",
  "warning.chat.maxCharacters": "Max characters:",
  "warning.chat.noSpecialCharacters": "No special characters",
  "warning.level.required": "Level Required: ",
  "warning.hoarding.message":
    "You have reached the Hoarding Limit for the following item",
  "warning.hoarding.one":
    "Word is that Goblins are known to raid farms that have an abundance of resources.",
  "warning.hoarding.two":
    "To protect yourself and keep those precious resources safe, please sync them on chain before gathering any more of:",
};

const transactionTerms: Record<TransactionTerms, string> = {
  "transaction.t&c.one":
    "Accept the terms and conditions to sign in to Sunflower Land.",
  "transaction.t&c.two": "Accept Terms and Conditions",
  "transaction.mintFarm.one": "Your farm has been minted!",
  "transaction.mintFarm.two": "Your farm will be ready in",
  "transaction.doNotRefresh": "Do not refresh this browser",
  "transaction.network":
    "To secure your NFTs on the Blockchain, a small network fee is required.",
  "transaction.estimated.fee": "Estimated fee:",
  "transaction.pay": "Pay with Card/Cash",
  "transaction.creditCard": "*Credit card fees apply",
  "transaction.rejected": "Transaction Rejected!",
  "transaction.message":
    "This request will not trigger a blockchain transaction or cost any gas fees.",
  "transaction.maticAmount": "Amount in MATIC",
  "transaction.donate": "Donate",
  "transaction.donating": "Donating",
  "transaction.thankYou":
    "Thank you for your support! Kindly choose the game that you like donate to.",
  "transaction.minblockbucks": "Minimum 5 Block Bucks",
  "transaction.payCash": "Pay with Cash",
  "transaction.matic": "Matic",
  "transaction.payMatic": "Pay with Matic",
  "transaction.blockBucksFarm": "Block bucks will be stored on your farm.",
  "transaction.excludeFees": "*Prices exclude transaction fees.",
  "transaction.blockchain.one":
    "Do you wish to store your progress on the Blockchain?",
  "transaction.blockchain.two":
    "Storing data on the Blockchain does not restock shops.",
  "transaction.progress": "Store progress",
  "transaction.progChain": "Store progress on chain",
  "transaction.success": "Woohoo! Your items are secured on the Blockchain!",
  "transaction.congrats": "Congratulations, your trade was successful",
  "transaction.transacting.one": "Processing your transaction.",
  "transaction.transacting.two":
    "Please wait for your transaction to be confirmed by the Blockchain.",
  "transaction.transacting.three":
    "After 5 minutes, any unconfirmed transactions will be reset.",
  "transaction.withdraw.one": "Withdrawing",
  "transaction.withdraw.two": "Your items/tokens have been sent to:",
  "transaction.withdraw.three": "You can view your items on",
  "transaction.openSea": "OpenSea",
  "transaction.withdraw.four":
    "You can view your tokens by importing the SFL Token to your wallet.",
  "transaction.withdraw.five": "Import SFL Token to MetaMask",
  "transaction.withdraw.six":
    "Please note that OpenSea can take up to 30 minutes to display your items. You can also view your items on",
  "transaction.withdraw.polygon": "PolygonScan",
  "transaction.id": "Transaction ID",
};

const onboarding: Record<Onboarding, string> = {
  "onboarding.welcome": "Welcome to decentralized gaming!",
  "onboarding.step.one": "Step 1/3",
  "onboarding.step.two": "Step 2/3 (Create a wallet)",
  "onboarding.step.three": "Step 3/3 (Create your NFT)",
  "onboarding.intro.one":
    "In your travels, you will earn rare NFTs that need to be protected. To keep these secure you'll need a Web3 wallet.",
  "onboarding.intro.two": "To begin your journey, your wallet will receive:",
  "onboarding.cheer": "You're almost there!",
  "onboarding.form.one": "Fill in your details",
  "onboarding.form.two":
    "and we will send a free NFT to play. (This will take us 3-7 days)",
  "onboarding.duplicateUser.one": "Already signed up!",
  "onboarding.duplicateUser.two":
    "It looks like you have already registered for beta testing using a different address. Only one address can be used during beta testing. ",
  "onboarding.starterPack": "Starter Pack",
  "onboarding.wallet.titleOne": "Setting up your wallet",
  "onboarding.wallet.one":
    "There are many wallet providers out there, but we've partnered with Sequence because they're easy to use and secure.",
  "onboarding.wallet.two":
    "Select a sign-up method in the pop-up window and you're good to go. I'll see you back here in just a minute!",
  "onboarding.wallet.haveWallet": "I already have a wallet",
  "onboarding.wallet.createButton": "Create wallet",
  "onboarding.wallet.titleTwo": "Accept the terms of service",
  "onboarding.wallet.three":
    "In order to buy your farm you will need to accept the Sunflower Land terms of service.",
  "onboarding.wallet.four":
    "This step will take you back to your new sequence wallet to accept the terms of service.",
  "onboarding.wallet.acceptButton": "Accept terms of service",
  "onboarding.wallet.acceptLoading": "Accepting terms...",
  "onboarding.wallet.titleThree": "Buy your farm!",
  "onboarding.wallet.five":
    "Now that your wallet is all set up, it's time to get your very own farm NFT! ",
  "onboarding.wallet.six":
    "This NFT will securely store all your progress in Sunflower Land and allow you to keep coming back to tend to your farm.",
  "onboarding.wallet.final": "Let's do this!",
};

const questions: Record<Questions, string> = {
  "questions.obtain.MATIC": "How do I get MATIC?",
  "questions.lowCash": "Short on Cash?",
};

const statements: Record<Statements, string> = {
  "statements.adventure": "Start your Adventure!",
  "statements.auctioneer.one":
    "I've travelled far and wide across Sunflower Land in search for exotic treasures to bring to my fellow Bumpkins.",
  "statements.auctioneer.two":
    "Don't miss one of the Auctions where a swing of my mighty hammer can turn your hard-earned resources into rare, minted marvels!",
  "statements.beta.one": "Beta is only accessible to our OG farmers.",
  "statements.beta.two": "Stay tuned for updates. We will be going live soon!",
  "statements.better.luck": "Better luck next time!",
  "statements.blacklist.one":
    "The anti-bot and multi-account detection system has picked up strange behaviour. Actions have been restricted.",
  "statements.blacklist.two":
    "Please submit a ticket with details and we will get back to you.",
  "statements.clickBottle": "Click on a bottle to add to your guess",
  "statements.clock.one":
    "Uh oh, it looks like your clock is not in sync with the game. Set date and time to automatic to avoid disruptions",
  "statements.clock.two":
    "Need help to sync your clock? Have a look at our guide!",
  "statements.conversation.one": "I've got something for you!",
  "statements.cooldown":
    "To protect the community, we require a 2 week waiting period before this farm can be accessed.",
  "statements.docs": "Go to docs",
  "statements.dontRefresh": "Do not refresh your browser!",
  "statements.guide.one": "Go to guide",
  "statements.guide.two": "Check out this guide to help you get started.",
  "statements.jigger.one":
    "You will be redirected to a 3rd party service to take a quick selfie. Never share any personal information or crypto data.",
  "statements.jigger.two": "You failed the Jigger Proof of Humanity.",
  "statements.jigger.three":
    "You can continue playing, but some actions will be restricted while you are being verified.",
  "statements.jigger.four":
    "Please reach out to support@usejigger.com if you beleive this was a mistake.",
  "statements.jigger.five":
    "Your proof of humanity is still being processed by Jigger. This can take up to 2 hours.",
  "statements.jigger.six":
    "The multi-account detection system has picked up strange behaviour.",
  "statements.jigger.seven":
    "You can continue playing, but some actions will be restricted while you are being verified.",
  "statements.lvlUp": "Feed your Bumpkin to level up",
  "statements.maintenance":
    "New things are coming! Thanks for your patience, the game will be live again shortly.",
  "statements.make.a.wish": "Grant a new wish and see how lucky you are!",
  "statements.minted": "The goblins have crafted your ",
  "statements.minting":
    "Please be patient while your item is minted on the Blockchain.",
  "statements.mutant.chicken":
    "Congratulations, your chicken has laid a very rare mutant chicken!",
  "statements.new.wish":
    "A new wish has been made for you based on your current balance of LP tokens!",
  "statements.news":
    "Recieve the latest news, complete chores & feed your Bumpkin.",
  "statements.no.reward":
    "You have no reward available! Liquidity needs to be held for 3 days to get a reward!",
  "statements.ohNo": "Oh no! Something went wrong!",
  "statements.openGuide": "Open guide",
  "statements.patience": "Thank you for your patience.",
  "statements.potionRule.one":
    "Objective: Figure out the combination. You have 3 tries to get it right. The game will end if you have a perfect potion or if you run out of tries.",
  "statements.potionRule.two":
    "Choose a combination of potions and attempt to mix them.",
  "statements.potionRule.three":
    "Adjust your next combination based on the feedback given.",
  "statements.potionRule.four":
    "When the game is complete, the score for your last attempt will determine help to determine your reward.",
  "statements.potionRule.five": "A perfect potion in the perfect position",
  "statements.potionRule.six": "Correct potion but wrong position",
  "statements.potionRule.seven": "Oops, wrong potion",
  "statements.sfl.rewards.received": "SFL rewards received: ",
  "statements.sflLim.one": "You have reached the daily SFL limit.",
  "statements.sflLim.two":
    "You can continue playing, but will need to wait until tomorrow to sync again.",
  "statements.sniped": "Oh no! Another player bought that trade before you.",
  "statements.switchNetwork": "Add or Switch Network",
  "statements.sync":
    "Please bear with us while we sync all of your data on chain.",
  "statements.tapCont": "Tap to continue",
  "statements.thankYou": "Thank you!",
  "statements.tutorial.one":
    "The boat will take you between islands where you can discover new lands and exciting adventures.",
  "statements.tutorial.two":
    "Many lands are far away and will require an experienced Bumpkin before you can visit them.",
  "statements.tutorial.three":
    "Your adventure begins now, how far you explore ... that is on you.",
  "statements.visit.firePit":
    "Visit the Fire Pit to cook food and feed your Bumpkin.",
  "statements.wish.granted.time": "It's time to grant your wish!",
  "statements.wish.granted": "Your wish has been granted.",
  "statements.wish.made": "You have made a wish!",
  "statements.wish.ready.in": "Time till next wish: ",
  "statements.wish.thanks":
    "Thanks for supporting the project and making a wish.",
  "statements.wish.time":
    "Come back in the following amount of time to see just how lucky you have been: ",
  "statements.wish.warning.one":
    "Be aware that only the LP tokens you held at the time the wish was made will be considered when the wish is granted.",
  "statements.wish.warning.two":
    "If you remove your liquidity during this time you won't receive any rewards.",
  "statements.wishing-well.info.one":
    "The wishing well is a magical place where SFL rewards can be made just by making a wish!",
  "statements.wishing-well.info.two":
    "Wishes are granted to farmers who provided liquidity in the game. More info:",
  "statements.wishing-well.info.three":
    "Looks like you have those magic LP tokens in your wallet!",
  "statements.wishing-well.not.providing.liquidity":
    "It doesn't look like you're providing liquidity yet. More info: ",
  "statements.wishing.well.amount": "Amount of rewards in the well: ",
  "statements.wishing.well.luck": "Let's see how lucky you are!",
  "statements.wrongChain.one":
    "Check out this guide to help you get connected.",
  "statements.feed.bumpkin.one": "You have no food in your inventory.",
  "statements.feed.bumpkin.two":
    "You will need to cook food in order to feed your Bumpkin.",
  "statements.empty.chest": "Your chest is empty, discover rare items today!",
};

const bumpkinTrade: Record<BumpkinTrade, string> = {
  "bumpkinTrade.askPrice": "Asking price:",
  "bumpkinTrade.purchased": "Congratulations, your listing was purchased!",
  "bumpkinTrade.plaza": "Travel to the plaza so players can trade with you",
  "bumpkinTrade.lvl": "You must be level 10 to trade",
  "bumpkinTrade.noTradeLs": "You have no trades listed.",
  "bumpkinTrade.sell": "Sell your resources to other players for SFL.",
  "bumpkinTrade.list": "List trade",
};

const bumpkinPartRequirements: Record<BumpkinPartRequirements, string> = {
  "part.hair": "Hair is required",
  "part.body": "Body is required",
  "part.shoes": "Shoes are required",
  "part.shirt": "Shirt is required",
  "part.pants": "Pants are required",
  "part.background": "Background is required",
};

const retreatTerms: Record<RetreatTerms, string> = {
  "retreatTerms.introTravel.one": "Hey Traveller! Ready to explore?",
  "retreatTerms.introTravel.two":
    "Sunflower Land is filled with exciting islands where you can complete deliveries, craft rare NFTs and even dig for treasure!",
  "retreatTerms.introTravel.three":
    "Different locations bring different opportunities to spend your hard earned resources.",
  "retreatTerms.introTravel.four":
    "At any time click the travel button to return home.",
  "retreatTerms.resale.title": "Looking for rare items?",
  "retreatTerms.resale.one":
    "Players can trade special items they crafted in-game.",
  "retreatTerms.resale.two":
    "You can purchase these on secondary marketplaces like OpenSea.",
  "retreatTerms.resale.three": "View items on OpenSea",
};

const gameDescriptions: Record<GameDescriptions, string> = {
  // Mutant Chickens
  "description.speed.chicken.one":
    "Your chickens will now produce eggs 10% faster.",
  "description.speed.chicken.two": "Produces eggs 10% faster",
  "description.fat.chicken.one":
    "Your chickens will now require 10% less wheat per feed.",
  "description.fat.chicken.two": "10% less wheat needed to feed a chicken",
  "description.rich.chicken.one": "Your chickens will now yield 10% more eggs.",
  "description.rich.chicken.two": "Yields 10% more eggs",
  "description.ayam.cemani": "The rarest chicken in existence!",
  "description.el.pollo.veloz.one":
    "Your chickens will lay eggs 4 hours faster!",
  "description.el.pollo.veloz.two":
    "Give me those eggs, fast! 4 hour speed boost on egg laying.",
  "description.banana.chicken":
    "A chicken that boosts bananas. What a world we live in.",
  // Crops
  "description.sunflower": "A sunny flower",
  "description.potato": "Healthier than you might think.",
  "description.pumpkin": "There's more to pumpkin than pie.",
  "description.carrot": "They're good for your eyes!",
  "description.cabbage": "Once a luxury, now a food for many.",
  "description.beetroot": "Good for hangovers!",
  "description.cauliflower": "Excellent rice substitute!",
  "description.parsnip": "Not to be mistaken for carrots.",
  "description.eggplant": "Nature's edible work of art.",
  "description.corn":
    "Sun-kissed kernels of delight, nature's summer treasure.",
  "description.radish": "Takes time but is worth the wait!",
  "description.wheat": "The most harvested crop in the world.",
  "description.kale": "A Bumpkin Power Food!",
  // Fruits
  "description.blueberry": "A Goblin's weakness",
  "description.orange": "Vitamin C to keep your Bumpkin Healthy",
  "description.apple": "Perfect for homemade Apple Pie",
  "description.banana": "Oh banana!",
  // Exotic Crops
  "description.white.carrot": "A pale carrot with pale roots",
  "description.warty.goblin.pumpkin": "A whimsical, wart-covered pumpkin",
  "description.adirondack.potato": "A rugged spud, Adirondack style!",
  "description.purple.cauliflower": "A regal purple cauliflowser",
  "description.chiogga": "A rainbow beet!",
  "description.golden.helios": "Sun-kissed grandeur!",
  "description.black.magic": "A dark and mysterious flower!",
  // Fire Pit
  "description.pumpkin.soup": "A creamy soup that goblins love",
  "description.mashed.potato": "My life is potato.",
  "description.bumpkin.broth": "A nutritious broth to replenish your Bumpkin",
  "description.boiled.eggs": "Boiled Eggs are great for breakfast",
  "description.kale.stew": "A perfect Bumpkin Booster!",
  "description.mushroom.soup": "Warm your Bumpkin's soul.",
  "description.reindeer.carrot": "Rudolph can't stop eating them!",
  "description.kale.omelette": "A healthy breakfast",
  "description.cabbers.mash": "Cabbages and Mashed Potatoes",
  "description.popcorn": "Classic homegrown crunchy snack.",
  "description.gumbo":
    "A pot full of magic! Every spoonful's a Mardi Gras parade!",
  // Kitchen
  "description.roast.veggies": "Even Goblins need to eat their veggies!",
  "description.bumpkin.salad": "Gotta keep your Bumpkin healthy!",
  "description.goblins.treat": "Goblins go crazy for this stuff!",
  "description.cauliflower.burger": "Calling all cauliflower lovers!",
  "description.club.sandwich":
    "Filled with Carrots and Roasted Sunflower Seeds",
  "description.mushroom.jacket.potatoes": "Cram them taters with what ya got!",
  "description.sunflower.crunch": "Crunchy goodness. Try not to burn it.",
  "description.bumpkin.roast": "A traditional Bumpkin dish",
  "description.goblin.brunch": "A traditional Goblin dish",
  "description.fruit.salad": "Fruit Salad, Yummy Yummy",
  "description.bumpkin.ganoush": "Zesty roasted eggplant spread.",
  "description.chowder":
    "Sailor's delight in a bowl! Dive in, there's treasure inside!",
  "description.pancakes": "A great start to a Bumpkins day",
  // Bakery
  "description.apple.pie": "Bumpkin Betty's famous recipe",
  "description.kale.mushroom.pie": "A traditional Sapphiron recipe",
  "description.cornbread": "Hearty golden farm-fresh bread.",
  "description.sunflower.cake": "Sunflower Cake",
  "description.potato.cake": "Potato Cake",
  "description.pumpkin.cake": "Pumpkin Cake",
  "description.carrot.cake": "Carrot Cake",
  "description.cabbage.cake": "Cabbage Cake",
  "description.beetroot.cake": "Beetroot Cake",
  "description.cauliflower.cake": "Cauliflower Cake",
  "description.parsnip.cake": "Parsnip Cake",
  "description.radish.cake": "Radish Cake",
  "description.wheat.cake": "Wheat Cake",
  "description.eggplant.cake": "Sweet farm-fresh dessert surprise.",
  "description.orange.cake": "Orange you glad we aren't cooking apples",
  "description.pirate.cake": "Great for Pirate themed birthday parties.",
  // Deli
  "description.blueberry.jam": "Goblins will do anything for this jam",
  "description.fermented.carrots": "Got a surplus of carrots?",
  "description.sauerkraut": "No more boring Cabbage!",
  "description.fancy.fries": "Cabbages and Mashed Potatoes",
  "description.fermented.fish":
    "Daring delicacy! Unleash the Viking within with every bite!",
  // Smoothie Shack
  "description.apple.juice": "A crisp refreshing beverage",
  "description.orange.juice": "OJ matches perfectly with a Club Sandwich",
  "description.purple.smoothie": "You can hardly taste the Cabbage",
  "description.power.smoothie":
    "Official drink of the Bumpkin Powerlifting Society",
  "description.bumpkin.detox": "Wash away the sins of last night",
  "description.banana.blast":
    "The ultimate fruity fuel for those with a peel for power!",
  // Unused foods
  "description.roasted.cauliflower": "A Goblin's favourite",
  "description.radish.pie": "Despised by humans, loved by goblins",
  // Tools
  "description.axe": "Used to collect wood",
  "description.pickaxe": "Used to collect stone",
  "description.stone.pickaxe": "Used to collect iron",
  "description.iron.pickaxe": "Used to collect gold",
  "description.hammer": "Coming soon",
  "description.rod": "Used to catch fish",
  "description.rusty.shovel": "Used to remove buildings and collectibles",
  "description.shovel": "Plant and harvest crops.",
  "description.sand.shovel": "Used for digging treasure",
  "description.sand.drill": "Drill deep for uncommon or rare treasure",
  // Quest Items
  "description.goblin.key": "The Goblin Key",
  "description.sunflower.key": "The Sunflower Key",
  "description.ancient.goblin.sword": "An Ancient Goblin Sword",
  "description.ancient.human.warhammer": "An Ancient Human Warhammer",
  // Decorations
  "description.wicker.man":
    "Join hands and make a chain, the shadow of the Wicker Man will rise up again",
  "description.golden bonsai": "Goblins love bonsai too",
  "description.victoria.sisters": "The pumpkin loving sisters",
  "description.christmas.bear": "Santa's favorite",
  "description.war.skull": "Decorate the land with the bones of your enemies.",
  "description.war.tombstone": "R.I.P",
  "description.undead.rooster":
    "An unfortunate casualty of the war. 10% increased egg yield.",
  "description.observatory":
    "Explore the stars and improve scientific development",
  // Banners
  "description.goblin.war.banner":
    "A display of allegiance to the Goblin cause",
  "description.human.war.banner": "A display of allegiance to the Human cause",
  // Coupons
  "description.block.buck": "A valuable token in Sunflower Land!",
  "description.beta.pass": "Gain early access to features for testing.",
  "description.war.bond": "A mark of a true warrior",
  // Fish
  "description.anchovy.one":
    "The ocean's pocket-sized darting acrobat, always in a hurry!",
  "description.anchovy.two": "Tiny fish, big flavor!",
  "description.butterflyfish.one":
    "A fish with a fashion-forward sense, flaunting its vivid, stylish stripes.",
  "description.butterflyfish.two": "Swimming in colors and taste!",
  "description.blowfish.one":
    "The round, inflated comedian of the sea, guaranteed to bring a smile.",
  "description.blowfish.two": "Dine with danger, a spiky surprise!",
  "description.clownfish.one":
    "The underwater jester, sporting a tangerine tuxedo and a clownish charm.",
  "description.clownfish.two": "No jokes, just pure deliciousness!",
  "description.seabass.one":
    "Your 'not-so-exciting' friend with silver scales – a bassic catch!",
  "description.seabass.two": "The bass-ics of seaside cuisine!",
  "description.seahorse.one":
    "The ocean's slow-motion dancer, swaying gracefully in the aquatic ballet.",
  "description.seahorse.two": "Dainty, rare, and surprisingly tasty!",
  "description.horsemackerel.one":
    "A speedster with a shiny coat, always racing through the waves.",
  "description.horsemackerel.two": "Gallop through flavors with every bite!",
  "description.squid.one":
    "The deep-sea enigma with tentacles to tickle your curiosity.",
  "description.squid.two": "Ink your way to exquisite tastes!",
  "description.redsnapper.one":
    "A catch worth its weight in gold, dressed in fiery crimson.",
  "description.redsnapper.two": "Snap into rich, zesty oceans of flavor!",
  "description.morayeel.one":
    "A slinky, sinister lurker in the ocean's shadowy corners.",
  "description.morayeel.two": "Slippery, savory, and sensational!",
  "description.oliveflounder.one":
    "The seabed's master of disguise, always blending in with the crowd.",
  "description.oliveflounder.two": "Floundering in richness and taste!",
  "description.napoleanfish.one":
    "Meet the fish with the Napoleon complex – short, but regal!",
  "description.napoleanfish.two": "Conquer your hunger with this catch!",
  "description.surgeonfish.one":
    "The ocean's neon warrior, armed with a spine-sharp attitude.",
  "description.surgeonfish.two": "Operate on your taste buds with precision!",
  "description.zebraturkeyfish.one":
    "Stripes, spines, and a zesty disposition, this fish is a true showstopper!",
  "description.zebraturkeyfish.two":
    "Striped, spiky, and spectacularly scrumptious!",
  "description.ray.one":
    "The underwater glider, a serene winged beauty through the waves.",
  "description.ray.two": "Glide into a realm of rich flavors!",
  "description.hammerheadshark.one":
    "Meet the shark with a head for business, and a body for adventure!",
  "description.hammerheadshark.two": "A head-on collision with taste!",
  "description.tuna.one":
    "The ocean's muscle-bound sprinter, ready for a fin-tastic race!",
  "description.tuna.two": "A titan of taste in every slice!",
  "description.mahimahi.one":
    "A fish that believes in living life colorfully with fins of gold.",
  "description.mahimahi.two": "Double the name, double the deliciousness!",
  "description.bluemarlin.one":
    "An oceanic legend, the marlin with an attitude as deep as the sea.",
  "description.bluemarlin.two":
    "Spearhead your appetite with this royal catch!",
  "description.oarfish.one":
    "The long and the long of it – an enigmatic ocean wanderer.",
  "description.oarfish.two": "Row your way into legendary flavor!",
  "description.footballfish.one":
    "The MVP of the deep, a bioluminescent star that's ready to play!",
  "description.footballfish.two": "Score a touchdown in taste!",
  "description.sunfish.one":
    "The ocean's sunbather, basking in the spotlight with fins held high.",
  "description.sunfish.two": "Bask in the glow of its delectable flavor!",
  "description.coelacanth.one":
    "A prehistoric relic, with a taste for the past and the present.",
  "description.coelacanth.two":
    "Prehistoric flavor that's stood the test of time!",
  "description.whaleshark.one":
    "The gentle giant of the deep, sifting treasures from the ocean's buffet.",
  "description.whaleshark.two": "A mammoth meal for monumental cravings!",
  "description.barredknifejaw.one":
    "An oceanic outlaw with black-and-white stripes and a heart of gold.",
  "description.barredknifejaw.two":
    "Cut through the hunger with sharp flavors!",
  "description.sawshark.one":
    "With a saw-like snout, it's the ocean's carpenter, always cutting edge!",
  "description.sawshark.two": "Cutting-edge flavor from the deep!",
  "description.whiteshark.one":
    "The shark with a killer smile, ruling the seas with fin-tensity!",
  "description.whiteshark.two": "Dive into an ocean of thrilling taste!",
  "description.kraken.tentacle":
    "Dive into deep-sea mystery! This tentacle teases tales of ancient ocean legends and watery wonders.",
  "description.kraken.head":
    "Dive into deep-sea mystery! This head teases tales of ancient ocean legends and watery wonders.",
  // Marine Marvels
  "description.twilight.anglerfish":
    "A deep-sea angler with a built-in nightlight, guiding its way through darkness.",
  "description.starlight.tuna":
    "A tuna that outshines the stars, ready to light up your collection.",
  "description.radiant.ray":
    "A ray that prefers to glow in the dark, with a shimmering secret to share.",
  "description.phantom.barracuda":
    "An elusive and ghostly fish of the deep, hiding in the shadows.",
  "description.gilded.swordfish":
    "A swordfish with scales that sparkle like gold, the ultimate catch!",
  // Buildings
  "description.water.well": "Crops need water!",
  "description.kitchen": "Step up your cooking game",
  "description.compost.bin": "Produces bait & fertiliser on a regular basis.",
  "description.hen.house": "Grow your chicken empire",
  "description.bakery": "Bake your favourite cakes",
  "description.turbo.composter":
    "Produces advanced bait & fertiliser on a regular basis.",
  "description.deli": "Satisfy your appetite with these delicatessen foods!",
  "description.smoothie.shack": "Freshly squeezed!",
  "description.warehouse": "Increase your seed stocks by 20%",
  "description.toolshed": "Increase your workbench tool stock by 50%",
  "description.premium.composter":
    "Produces expert bait & fertiliser on a regular basis.",
  "description.town.center":
    "Gather around the town center for the latest news",
  "description.market": "Buy and sell at the Farmer's Market",
  "description.fire.pit":
    "Roast your Sunflowers, feed and level up your Bumpkin",
  "description.workbench": "Craft tools to collect resources",
  "description.tent": "(Discontinued)",
  // Bumpkin Skills
  // Crops
  "description.green.thumb": "Crops yield 5% more",
  "description.cultivator": "Crops grow 5% quicker",
  "description.master.farmer": "Crops yield 10% more",
  "description.golden.flowers": "Chance for Sunflowers to Drop Gold ",
  "description.happy.crop": "Chance to get 2x crops",
  // Trees
  "description.lumberjack": "Trees drop 10% more",
  "description.tree.hugger": "Trees regrow 20% quicker",
  "description.tough.tree": "Chance to get 3x wood drops",
  "description.money.tree": "Chance for SFL drops",
  // Rocks
  "description.digger": "Stone Drops 10% more",
  "description.coal.face": "Stones recover 20% quicker",
  "description.seeker": "Attract Rock Monsters",
  "description.gold.rush": "Chance to get 2.5x gold drops",
  // Cooking
  "description.rush.hour": "Cook meals 10% faster",
  "description.kitchen.hand": "Meals yield an extra 5% experience",
  "description.michelin.stars": "High quality food, earn additional 5% SFL",
  "description.curer": "Consuming deli goods adds extra 15% exp",
  // Animals
  "description.stable.hand": "Animals produce 10% quicker",
  "description.free.range": "Animals produce 10% more",
  "description.horse.whisperer": "Increase chance of mutants",
  "description.buckaroo": "Chance of double drops",
};

const fishingQuests: Record<FishingQuests, string> = {
  "quest.basic.fish": "Catch each basic fish",
  "quest.advanced.fish": "Catch each advanced fish",
  "quest.all.fish": "Discover each basic, advanced, and expert fish",
  "quest.300.fish": "Catch 300 fish",
  "quest.1500.fish": "Catch 1500 fish",
  "quest.marine.marvel": "Catch each Marine Marvel",
};
const islandName: Record<IslandName, string> = {
  "island.home": "Home",
  "island.pumpkin.plaza": "Pumpkin Plaza",
  "island.beach": "Beach",
  "island.woodlands": "Woodlands",
  "island.helios": "Helios",
  "island.goblin.retreat": "Goblin Retreat",
};

export const ENGLISH_TERMS: Record<TranslationKeys, string> = {
  ...achievementTerms,
  ...bumpkinPartRequirements,
  ...bumpkinTrade,
  ...confirmationTerms,
  ...conversations,
  ...errorTerms,
  ...fishingQuests,
  ...gameDescriptions,
  ...gameTerms,
  ...generalTerms,
  ...guideTerms,
  ...henHouseTerms,
  ...introTerms,
  ...islandName,
  ...onboarding,
  ...questions,
  ...retreatTerms,
  ...rewardTerms,
  ...rulesTerms,
  ...seasonTerms,
  ...shopItems,
  ...statements,
  ...transactionTerms,
  ...warningTerms,
  ...welcomeTerms,
};
