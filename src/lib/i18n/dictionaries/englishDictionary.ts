import {
  TranslationKeys,
  AchievementsDialog,
  BumpkinPartRequirements,
  BumpkinTrade,
  // ConfirmationTerms,
  Conversations,
  ErrorTerms,
  GameTerms,
  GeneralTerms,
  GuideTerms,
  HenHouseTerms,
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
  LevelUpMessages,
  LandscapeTerms,
  BumpkinSkillsDescription,
  BoostDescriptions,
  CropFruitDescriptions,
  FoodDescriptions,
  DecorationDescriptions,
  FishDescriptions,
  BuildingDescriptions,
  ToolDescriptions,
  BountyDescription,
} from "./types";

const generalTerms: Record<GeneralTerms, string> = {
  "2x.sale": "2x Sale",
  "add.liquidity": "Add Liquidity",
  "alr.bought": "Already Bought",
  "alr.claim": "Already Claimed!",
  "alr.completed": "Already Completed",
  "alr.crafted": "Already Crafted!",
  "alr.minted": "Already minted!",
  "available.all.year": "Available all year round",
  "beach.bounty": "Beach Bounty",
  "card.cash": "Card/Cash",
  "claim.skill": "Claim skill",
  "coming.soon": "Coming soon",
  "easter.eggs": "Easter Eggs",
  "feed.bumpkin": "Feed Bumpkin",
  "fish.caught": "Fish Caught: ",
  "grant.wish": "Grant New Wish",
  "hungry?": "Hungry?",
  "last.updated": "Last updated: ",
  "lets.go": "Let's Go!",
  "make.wish": "Make a Wish",
  "making.wish": "Making a wish",
  "no.mail": "No mail",
  "no.thanks": "No thanks",
  "ocean.fishing": "Ocean fishing",
  "open.gift": "Open Gift",
  "pass.required": "Pass Required",
  "placing.bid": "Placing bid",
  "promo.code": "Promo Code",
  "providing.liquidity": "Providing Liquidity",
  "read.more": "Read more",
  "reward.discovered": "Reward Discovered",
  "seasonal.treasure": "Seasonal Treasure",
  "select.resource": "Select your resource:",
  "sell.all": "Sell All",
  "sell.one": "Sell 1",
  "sell.ten": "Sell 10",
  "session.expired": "Session expired!",
  "skip.order": "Skip Order",
  "sound.effects": "Sound Effects: ",
  "support.team": "Support Team",
  "total.price": "Total Price: ",
  "trash.collection": "Trash Collection",
  "try.again": "Try again",
  "unlock.land": "Unlock more land",
  "visit.friend": "Visit Friend",
  "wishing.well": "Wishing Well",
  "you.are.here": "You are here",
  achievements: "Achievements",
  auctions: "Auctions",
  back: "Back",
  bait: "Bait",
  basket: "Basket",
  beta: "Beta",
  bounty: "Bounty",
  build: "Build",
  buy: "Buy",
  cancel: "Cancel",
  chest: "Chest",
  chores: "Chores",
  claim: "Claim",
  clear: "Clear",
  close: "Close",
  common: "Common",
  completed: "Completed",
  confirm: "Confirm",
  congrats: "Congratulations!",
  connected: "Connected",
  connecting: "Connecting",
  continue: "Continue",
  cook: "Cook",
  coupons: "Coupons",
  craft: "Craft",
  crafting: "Crafting",
  crops: "Crops",
  date: "Date",
  decoration: "Decoration",
  deliveries: "Deliveries",
  delivery: "Delivery",
  details: "Details",
  donate: "Donate",
  donating: "Donating",
  egg: "Egg",
  equip: "Equip",
  error: "Error",
  exotics: "Exotics",
  expand: "Expand",
  explore: "Explore",
  farm: "Farm",
  featured: "Featured",
  fertilisers: "Fertilisers",
  fish: "Fish",
  foods: "Foods",
  for: "for",
  forbidden: "Forbidden",
  fruit: "Fruit",
  fruits: "Fruits",
  gotIt: "Got it",
  guide: "Guide",
  info: "Info",
  item: "Item:",
  left: "Left",
  "let'sDoThis": "Let's do this!",
  list: "List",
  loading: "Loading",
  lvl: "Level",
  maintenance: "Maintenance",
  mins: "mins",
  mint: "Mint",
  minting: "minting",
  music: "Music",
  next: "Next",
  nextSkillPtLvl: "Next skill point: level",
  ok: "OK",
  print: "Print",
  purchasing: "Purchasing",
  rank: "Rank",
  rare: "Rare",
  refresh: "Refresh",
  refreshing: "Refreshing",
  reqSkillPts: "Required Skill Points",
  reqSkills: "Required Skills:",
  resources: "Resources",
  restock: "Restock",
  retry: "Retry",
  save: "Save",
  saving: "Saving",
  secs: "secs",
  seeds: "Seeds",
  sell: "Sell",
  shopping: "Shopping",
  skillPts: "Skill Points:",
  skills: "Skills",
  success: "Success!",
  swapping: "Swapping",
  syncing: "Syncing",
  task: "Task",
  tools: "Tools",
  total: "Total",
  trades: "Trades",
  trading: "Trading",
  travel: "Travel",
  uncommon: "Uncommon",
  uhOh: "Uh oh!",
  unlocking: "Unlocking",
  verify: "Verify",
  version: "Version",
  viewAll: "View all",
  wallet: "Wallet",
  welcome: "Welcome!",
  withdraw: "Withdraw",
  withdrawing: "Withdrawing",
};

const gameTerms: Record<GameTerms, string> = {
  "bumpkin.level": "Bumpkin level",
  "daily.sfl.limit": "Daily SFL Limit",
  "goblin.swarm": "Goblin Swarm!",
  potions: "Potions",
  "sfl.discord": "Sunflower Land Discord Server",
  "auction.winner": "Auction Winner!",
  "farm.banned": "This farm is banned",
  "proof.of.humanity": "Proof of Humanity",
  "no.sfl.found": "No SFL tokens found",
  "granting.wish": "Granting your wish",
  "new.delivery.in": "New deliveries available in: ",
  bumpkinBuzz: "Bumpkin Buzz",
  opensea: "OpenSea",
  polygonscan: "PolygonScan",
};

// const confirmationTerms: Record<ConfirmationTerms, string> = {
//   "confirmation.sellCrops": "Are you sure you want to",
// };

const welcomeTerms: Record<WelcomeTerms, string> = {
  "welcome.createAccount": "Create account",
  "welcome.creatingAccount": "Creating your account",
  "welcome.email": "Email & Social Login",
  "welcome.login": "Login",
  "welcome.needHelp": "Need help?",
  "welcome.otherWallets": "Other wallets",
  "welcome.signingIn": "Signing you in",
  "welcome.signIn.message":
    "Accept the signature request in your browser wallet to login.",
  "welcome.takeover.ownership":
    "It looks like you are new to Sunflower Land and have claimed ownership of another player's account.",
  "welcome.promo": "Add Promo Code",
};

const rulesTerms: Record<RulesTerms, string> = {
  "game.rules": "Game Rules",
  "rules.oneAccountPerPlayer": "1 account per player",
  "rules.gameNotFinancialProduct": "This is a game. Not a financial product.",
  "rules.noBots": "No botting or automation",
  "rules.termsOfService": "Terms of Service",
};

const seasonTerms: Record<SeasonTerms, string> = {
  "season.access": "You have access to:",
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
  "season.catch.the.kraken": "Catch the Kraken",
};

const shopItems: Record<ShopItems, string> = {
  "betty.post.sale.one": "Hey, hey! Welcome back.",
  "betty.post.sale.two":
    "You've helped solve the crop shortage and prices have returned to normal.",
  "betty.post.sale.three":
    "It's time to move onto some bigger and better crops!",
  "betty.welcome": "Welcome to my market. What would you like to do?",
  "betty.buySeeds": "Buy seeds",
  "betty.sellCrops": "Sell crops",
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
  "gathering.guide.one":
    "To thrive in Sunflower Land, mastering the art of resource gathering is essential. Start by equipping the appropriate tools to collect different resources. Use the trusty Axe to chop down trees and acquire wood. To craft tools, visit the local workbench & exchange your SFL/resources for the desired tool.",
  "gathering.guide.two":
    "As you progress and gather sufficient resources, you'll unlock the ability to expand your territory. Expanding your land opens up new horizons in Sunflower Land. Land expansions reveal a treasure trove of resources, including fertile soil for planting crops, majestic trees, valuable stone deposits, precious iron veins, shimmering gold deposits, delightful fruit patches and much more.",
  "gathering.guide.three":
    "Remember, resource gathering and land expansion are the backbone of your farming journey. Embrace the challenges and rewards that come with each step, and watch your Sunflower Land flourish with bountiful resources and endless possibilities.",

  "crops.guide.one":
    "In Sunflower Land, crops play a crucial role in your journey towards prosperity. By planting and harvesting crops, you can earn SFL (Sunflower Token) or utilize them to craft valuable recipes and items within the game.",
  "crops.guide.two":
    "To grow crops, you need to purchase the respective seeds from the in-game shop. Each crop has a different growth time, ranging from just 1 minute for Sunflowers to 36 hours for Kale. Once the crops are fully grown, you can harvest them and reap the rewards.",
  "crops.guide.three":
    "Remember, as you expand your land and progress in the game, more crops will become available, offering greater opportunities for earning SFL and exploring the vast potential of Sunflower Land's farming economy. So get your hands dirty, plant those seeds, and watch your crops flourish as you harvest your way to success!",

  "building.guide.one":
    "Explore the diverse range of buildings available as you progress in Sunflower Land. From hen houses to workshops and beyond, each structure brings unique advantages to your farm. Take advantage of these buildings to streamline your farming operations, increase productivity, and unlock new possibilities. Plan your layout carefully and enjoy the rewards that come with constructing a thriving farm in Sunflower Land.",
  "building.guide.two":
    "In Sunflower Land, buildings are the cornerstone of your farming journey. To access the buildings menu, click the Inventory icon and select the Buildings tab. Choose the desired structure and return to your farm screen. Find an open space, marked in green, and confirm the placement. Wait for the timer to complete, and your new building will be ready to use. Buildings provide various benefits and unlock exciting gameplay features. Strategically position them on your farm to maximize efficiency and watch as your farming empire grows and prospers.",

  "cooking.guide.one":
    "Cooking allows you to nourish your Bumpkin and help them gain valuable experience points (XP). By utilizing the crops you've harvested, you can prepare delicious food at different buildings dedicated to cooking.",
  "cooking.guide.two":
    "Starting with the Fire Pit, every farm has access to basic cooking facilities from the beginning. However, as you progress, you can unlock more advanced buildings such as the Kitchen, Bakery, Deli, and Smoothie Shack, each offering a wider variety of recipes and culinary delights.",
  "cooking.guide.three":
    "To cook, simply select a building and choose a recipe you wish to prepare. The recipe will provide details about the required ingredients, the XP gained upon consumption, and the preparation time. After initiating the cooking process, keep an eye on the timer to know when the food will be ready to collect.",
  "cooking.guide.four":
    "Once the food is ready, retrieve it from the building by clicking on it and moving it into your inventory. From there, you can interact with your Bumpkin NPC on the farm and feed them the prepared food, helping them gain XP and progress further in the game.",
  "cooking.guide.five":
    "Experiment with different recipes, unlock new buildings, and discover the joy of cooking as you nurture your Bumpkin and embark on a delicious culinary adventure in Sunflower Land.",

  "animals.guide.one":
    "Chickens in Sunflower Land are a delightful addition to your farm, serving as a source of eggs that can be used in various recipes and crafting. To start with chickens, you'll need to reach Bumpkin level 9 and build the Hen House. From there, you have the option to purchase chickens or place the ones you already have. Simply drag and drop them onto your farm, just like placing buildings. On a standard farm, every Hen House houses up to 10 chickens, and if you own the Chicken Coop SFT, this limit extends to 15.",
  "animals.guide.two":
    "Each chicken has an indicator above its head, displaying its current mood or needs. This can range from being hungry, tired, happy, or ready to hatch. To keep your chickens content and productive, feed them by selecting wheat from your inventory and interacting with the chicken. Feeding initiates the egg timer, which takes 48 hours for the eggs to be ready to hatch. Once the eggs are ready, visit your farm, check the icon above each chicken, and interact with them to find out the type of egg that has hatched. Occasionally, you may even discover rare mutant chickens, which offer special boosts such as faster egg production, increased yield, or reduced food consumption.",
  "animals.guide.three":
    "Nurturing your chickens and collecting their eggs adds a dynamic and rewarding element to your farm in Sunflower Land. Experiment with recipes, make use of the eggs in your crafting endeavors, and enjoy the surprises that come with rare mutant chickens. Build a thriving poultry operation and reap the benefits of your hard work as you embrace the charming world of chickens in Sunflower Land.",

  "crafting.guide.one":
    "In Sunflower Land, crafting NFTs is a crucial aspect of boosting your farming output and accelerating your progress. These special items provide various bonuses, such as crop growth boosts, cooking enhancements, and resource boosts, which can greatly expedite your journey. By maximizing your SFL (Sunflower Token), you can craft tools, gather resources, and expand your land to further establish your farming empire.",
  "crafting.guide.two":
    "To begin crafting items, we'll visit Igor, a skilled craftsman in Sunfloria. After hopping on the boat and arriving at Sunfloria, head to the top of the island to have a conversation with Igor. He is currently offering a Basic Scarecrow, which boosts the speed of Sunflowers, Potatoes, and Pumpkins. This is an excellent deal that requires exchanging your resources for the scarecrow. Once obtained, return to your main island and enter design mode by clicking on the white hand icon in the top right corner of the game.",
  "crafting.guide.three":
    "In design mode, you can strategically place items and rearrange resources on your farm to optimize its layout and enhance its visual appeal. This step is crucial in maximizing the effectiveness of your crafted equipment. For example, place the Scarecrow over the plots you want to boost. Additionally, consider purchasing decorations to add charm and tidiness to your land.",
  "crafting.guide.four":
    "By crafting equipment and placing it strategically, you can amplify your farming abilities, create an island home to be proud of, and accelerate your progress in Sunflower Land.",

  "deliveries.guide.one":
    "Deliveries in Sunflower Land provide an exciting opportunity to help hungry Goblins and fellow Bumpkins while earning rewards. Every day you will be able to see all the orders you have by clicking on the delivery board on the bottom left of the screen. The orders have been placed by some local NPCs that can be found hanging around Pumpkin Plaza. To fulfill an order, you will need to take a boat ride to Pumpkin Plaza and look for the NPC expecting the delivery. Once you find them, click on them to deliver the order and receive your reward.",
  "deliveries.guide.two":
    "As a new player, you start with three order slots, but as you expand your farm, you will unlock additional slots, allowing advanced players to take on more orders. New orders come in every 24 hours, offering a range of tasks from farming produce to cooking food and gathering resources. Completing orders will earn you milestone bonuses, including Block Bucks, SFL, delicious cakes, and other rewards. The reward system is based on the difficulty of the request, so consider prioritizing orders that offer greater rewards to maximize your gains. Keep an eye on the board and challenge yourself with a variety of orders, leveling up and unlocking new buildings as needed to fulfill more demanding requests.",

  "scavenger.guide.one":
    "Scavenging in Sunflower Land offers exciting opportunities to uncover hidden treasures and gather valuable resources. The first aspect of scavenging is digging for treasure on Treasure Island, where you can become a pirate treasure hunter. By crafting a sand shovel and venturing to Treasure Island, you can dig in dark sandy areas to uncover a variety of treasures, including bounty, decorations, and even ancient SFTs with utility.",
  "scavenger.guide.two":
    "Another form of scavenging involves gathering wild mushrooms that appear spontaneously on your farm and surrounding islands. These mushrooms can be collected for free and used in recipes, quests, and crafting items. Keep an eye out for these mushrooms, as they replenish every 16 hours, with a maximum limit of 5 mushrooms on your farm. If your land is full, mushrooms will appear on the surrounding islands, ensuring you don't miss out on these valuable resources.",

  "fruit.guide.one":
    "Fruit plays a significant role in Sunflower Land as a valuable resource that can be sold for SFL or utilized in various recipes and crafting. Unlike crops, fruit patches have the unique ability to replenish multiple times after each harvest, providing a sustainable source of fruit for players.",
  "fruit.guide.two":
    "To plant fruit, you'll need to acquire larger fruit patches, which become available on the 9-10th expansion of your farm.",
  "fruit.guide.three":
    "By cultivating fruit and incorporating it into your farming strategies, you can maximize your profits, create delicious recipes, and unlock new possibilities in Sunflower Land.",

  "seasons.guide.one":
    "Seasons in Sunflower Land bring excitement and freshness to the game, offering players new challenges and opportunities. With the introduction of each season, players can look forward to a variety of new craftable items, limited edition decorations, mutant animals, and rare treasures. These seasonal changes create a dynamic and evolving gameplay experience, encouraging players to adapt their strategies and explore new possibilities on their farms. Additionally, seasonal tickets add a strategic element to the game, as players must decide how to allocate their tickets wisely, whether it's collecting rare items, opting for higher supply decorations, or exchanging tickets for SFL. The seasonal mechanic keeps the game engaging and ensures that there's always something to look forward to in Sunflower Land.",
  "seasons.guide.two":
    "The availability of seasonal items at the Goblin Blacksmith adds another layer of excitement. Players must gather the required resources and seasonal tickets to craft these limited-supply items, creating a sense of competition and urgency. Planning ahead and strategizing become crucial as players aim to secure their desired items before the supply runs out. Moreover, the option to swap seasonal tickets for SFL provides flexibility and allows players to make choices that align with their specific gameplay goals. With each season's unique offerings and the anticipation of surprise events, Sunflower Land keeps players engaged and entertained throughout the year, fostering a vibrant and ever-evolving farming experience.",
};

const conversations: Record<Conversations, string> = {
  "hank-intro.headline": "Help an old man?",
  "hank-intro.one": "Howdy Bumpkin! Welcome to our little patch of paradise.",
  "hank-intro.two":
    "I've been working this land for fifty years but could sure use some help.",
  "hank-intro.three":
    "I can teach you the basics of farming, as long as you help me with my daily chores.",
  "hank.crafting.scarecrow": "Craft a scarecrow",
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
  "luna.portalNoAccess":
    "Hmmm, this portal just appeared out of nowhere. What could this mean?",

  "luna.portals": "Portals",
  "luna.rewards": "Rewards",
  "pete.intro.one":
    "Howdy there, Bumpkin! Welcome to Sunflower Land, the bountiful farming paradise where anything is possible!",
  "pete.intro.two":
    "What a beautiful island you have set up on! I'm Pumpkin Pete, your neighboring farmer.",
  "pete.intro.three":
    "Right now the players are celebrating a festival in the plaza with fantastic rewards and magical items.",
  "pete.intro.four":
    "Before you can join the fun, you will need to grow your farm and gather some resources. You don't want to turn up empty handed!",
  "pete.intro.five":
    "To get started, you will want to chop down those trees and grow your island.",
  "pete.first-expansion.one":
    "Congratulations, Bumpkin! Your farm is growing faster than a beanstalk in a rainstorm!",
  "pete.first-expansion.two":
    "With each expansion, you'll find cool stuff like special resources, new trees, and more to collect!",
  "pete.first-expansion.three":
    "Keep an eye out for surprise gifts from the generous goblins as you explore—they're not just expert builders, but crafty secret givers!",
  "pete.craftScarecrow.one": "Hmm, those crops are growing slow.",
  "pete.craftScarecrow.two":
    "Sunflower Land is full of magical items you can craft to enhance your farming abilities.",
  "pete.craftScarecrow.three":
    "Head over to the work bench and craft a scarecrow to speed up those Sunflowers.",
  "pete.levelthree.one": "Congratulations, your green thumb is truly shining!",
  "pete.levelthree.two":
    "It's high time we head to the Plaza, where your farming prowess can shine even brighter.",
  "pete.levelthree.three":
    "At the plaza you can deliver your resources for rewards, craft magical items & trade with other players.",
  "pete.levelthree.four":
    "You can travel by clicking on the world icon in the bottom left.",
  "pete.help.zero": "Visit the fire pit, cook food and eat to level up.",
  "pete.pumpkinPlaza.one":
    "As you level up, you will unlock new areas to explore. First up is the Pumpkin Plaza....my home!",
  "pete.pumpkinPlaza.two":
    "Here you can complete deliveries for rewards, craft magical items & trade with other players.",
  "grimbly.expansion.one":
    "Greetings, budding farmer! I am Grimbly, a seasoned Goblin Builder.",
  "grimbly.expansion.two":
    "With the right materials and my ancient crafting skills, we can turn your island into a masterpiece.",
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
  "reward.daily.reward": "Daily Reward",
  "reward.streak": " day streak",
  "reward.comeBackLater": "Come back later for more rewards",
  "reward.nextBonus": " Next bonus: ",
  "reward.unlock": "Unlock Reward",
  "reward.open": "Open reward",
  "reward.lvlRequirement": "You must be level 3 to claim daily rewards.",
  "reward.whatCouldItBe": "What could it be?",
  "reward.streakBonus": "3x streak bonus",
  "reward.found": "You found",
  "reward.spendWisely": "Spend it wisely.",
  "reward.wearable": "A wearable for your Bumpkin",
  "reward.promo.code": "Enter your promo code:",
};

const errorTerms: Record<ErrorTerms, string> = {
  "error.betaTestersOnly": "Beta testers only!",
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
  "error.polygon.cant.connect": "Can't connect to Polygon",
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
  "transaction.mintFarm": "Your farm has been minted!",
  "transaction.farm.ready": "Your farm will be ready in",
  "transaction.doNotRefreshBrowser": "Do not refresh this browser",
  "transaction.networkFeeRequired":
    "To secure your NFTs on the Blockchain, a small network fee is required.",
  "transaction.estimated.fee": "Estimated fee:",
  "transaction.payCardCash": "Pay with Card/Cash",
  "transaction.creditCard": "*Credit card fees apply",
  "transaction.rejected": "Transaction Rejected!",
  "transaction.noFee":
    "This request will not trigger a blockchain transaction or cost any gas fees.",
  "transaction.maticAmount": "Amount in MATIC",
  "transaction.chooseDonationGame":
    "Thank you for your support! Kindly choose the game that you like donate to.",
  "transaction.minblockbucks": "Minimum 5 Block Bucks",
  "transaction.payCash": "Pay with Cash",
  "transaction.payMatic": "Pay with Matic",
  "transaction.storeBlockBucks": "Block bucks will be stored on your farm.",
  "transaction.excludeFees": "*Prices exclude transaction fees.",
  "transaction.storeProgress.blockchain.one":
    "Do you wish to store your progress on the Blockchain?",
  "transaction.storeProgress.blockchain.two":
    "Storing data on the Blockchain does not restock shops.",
  "transaction.storeProgress": "Store progress",
  "transaction.storeProgress.chain": "Store progress on chain",
  "transaction.storeProgress.success":
    "Woohoo! Your items are secured on the Blockchain!",
  "transaction.trade.congrats": "Congratulations, your trade was successful",
  "transaction.processing": "Processing your transaction.",
  "transaction.pleaseWait":
    "Please wait for your transaction to be confirmed by the Blockchain.",
  "transaction.unconfirmed.reset":
    "After 5 minutes, any unconfirmed transactions will be reset.",
  "transaction.withdraw.sent": "Your items/tokens have been sent to:",
  "transaction.withdraw.view": "You can view your items on",
  "transaction.viewTokens":
    "You can view your tokens by importing the SFL Token to your wallet.",
  "transaction.import.SFLToken": "Import SFL Token to MetaMask",
  "transaction.displayItems":
    "Please note that OpenSea can take up to 30 minutes to display your items. You can also view your items on",
  "transaction.id": "Transaction ID",
  "transaction.termsOfService": "Accept the terms of service",
  "transaction.termsOfService.one":
    "In order to buy your farm you will need to accept the Sunflower Land terms of service.",
  "transaction.termsOfService.two":
    "This step will take you back to your new sequence wallet to accept the terms of service.",
  "transaction.termsOfService.accepting": "Accepting terms...",
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
  "onboarding.settingWallet": "Setting up your wallet",
  "onboarding.wallet.one":
    "There are many wallet providers out there, but we've partnered with Sequence because they're easy to use and secure.",
  "onboarding.wallet.two":
    "Select a sign-up method in the pop-up window and you're good to go. I'll see you back here in just a minute!",
  "onboarding.wallet.haveWallet": "I already have a wallet",
  "onboarding.wallet.createButton": "Create wallet",
  "onboarding.buyFarm.title": "Buy your farm!",
  "onboarding.buyFarm.one":
    "Now that your wallet is all set up, it's time to get your very own farm NFT! ",
  "onboarding.buyFarm.two":
    "This NFT will securely store all your progress in Sunflower Land and allow you to keep coming back to tend to your farm.",
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
  "statements.chest.captcha": "Tap the chest to open it",
  "statements.gold.pass.required": "A Gold Pass is required to mint rare NFTs.",
  "statements.frankie.plaza": "Travel to the plaza to craft rare decorations!",
  "statements.blacksmith.plaza": "Travel to the Plaza for more rare items.",
  "statements.water.well.needed.one": "Additional Water Well required.",
  "statements.water.well.needed.two":
    "In order to support more crops, build a well.",
  "statements.soldOut": "Sold out",
  "statements.inStock": "in stock",
  "statements.soldOutWearables": "View sold out wearables",
  "statements.craft.composter": "Craft at Composter",
  "statements.join.discord":
    "Make sure you have joined the Sunflower Land Discord, go to the #rules channel and be assigned the 'Bumpkin' role.",
  "statements.session.expired":
    "It looks like your session has expired. Please refresh the page to continue playing.",
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

const landscapeTerms: Record<LandscapeTerms, string> = {
  "landscape.intro.one": "Design your dream island!",
  "landscape.intro.two":
    "In design mode you can hold, drag & move items around.",
  "landscape.intro.three": "Craft rare decorations",
  "landscape.intro.four": "Place collectibles from your chest",
  "landscape.expansion.one":
    "Each piece of land comes with unique resources to help build your farming empire!",
  "landscape.expansion.two": "More expansions will be available soon...",
  "landscape.timerPopover": "Next Expansion",
  "landscape.dragMe": "Drag me",
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

const boostDescriptions: Record<BoostDescriptions, string> = {
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

  // Boosts
  "description.victoria.sisters": "The pumpkin loving sisters",
  "description.undead.rooster":
    "An unfortunate casualty of the war. 10% increased egg yield.",
  "description.observatory":
    "Explore the stars and improve scientific development",
  "description.time.warp.totem":
    "2x speed for crops, trees, cooking & minerals. Only lasts for 2 hours",
  "description.cabbage.boy": "Don't wake the baby!",
  "description.cabbage.girl": "Shhh it's sleeping",
  "description.wood.nymph.wendy":
    "Cast an enchantment to entice the wood fairies.",
  "description.peeled.potato":
    "A precious potato, encourages bonus potatoes on harvest.",
  "description.potent.potato":
    "Potent! Grants a 3% chance to get +10 potatoes on harvest.",
  "description.radical.radish":
    "Radical! Grants a 3% chance to get +10 radishes on harvest.",
  "description.stellar.sunflower":
    "Stellar! Grants a 3% chance to get +10 sunflowers on harvest.",
  "description.lady.bug":
    "An incredible bug that feeds on aphids. Improves Apple quality.",
  "description.squirrel.monkey":
    "A natural orange predator. Orange Trees are scared when a Squirrel Monkey is around.",
  "description.black.bearry":
    "His favorite treat - plump, juicy blueberries. Gobbles them up by the handful!",
  "description.maneki.neko":
    "The beckoning cat. Pull its arm and good luck will come",
  "description.easter.bunny": "A rare Easter item",
  "description.pablo.bunny": "A magical Easter bunny",
  "description.foliant": "A book of spells.",
  "description.tiki.totem":
    "The Tiki Totem adds 0.1 wood to every tree you chop.",
  "description.lunar.calendar":
    "Crops now follow the lunar cycle! 10% increase to crop growth speed.",
  "description.heart.davy.jones":
    "Whoever possesses it holds immense power over the seven seas, can dig for treasure without tiring.",
  "description.treasure.map":
    "An enchanted map that leads the holder to valuable treasure. +20% profit from beach bounty items.",
  "description.genie.lamp":
    "A magical lamp that contains a genie who will grant you three wishes.",
  "description.basic.scarecrow":
    "Choosy defender of your farm's VIP (Very Important Plants)",
  "description.scary.mike":
    "The veggie whisperer and champion of frightfully good harvests!",
  "description.laurie.chuckle.crow":
    "With her disconcerting chuckle, she shooes peckers away from your crops!",
  "description.immortal.pear":
    "A long-lived pear that makes fruit trees last longer.",
  "description.bale":
    "A poultry's favorite neighbor, providing a cozy retreat for chickens",
  "description.sir.goldensnout":
    "A royal member, Sir Goldensnout infuses your farm with sovereign prosperity through its golden manure.",
  "description.freya.fox":
    "Enchanting guardian, boosts pumpkin growth with her mystical charm. Harvest abundant pumpkins under her watchful gaze.",
  "description.queen.cornelia":
    "Command the regal power of Queen Cornelia and experience a magnificent Area of Effect boost to your corn production. +1 Corn.",
};

const cropFruitDescriptions: Record<CropFruitDescriptions, string> = {
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
};

const foodDescriptions: Record<FoodDescriptions, string> = {
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
};

const decorationDescriptions: Record<DecorationDescriptions, string> = {
  // Decorations
  "description.wicker.man":
    "Join hands and make a chain, the shadow of the Wicker Man will rise up again",
  "description.golden bonsai": "Goblins love bonsai too",
  "description.christmas.bear": "Santa's favorite",
  "description.war.skull": "Decorate the land with the bones of your enemies.",
  "description.war.tombstone": "R.I.P",
  "description.white.tulips": "Keep the smell of goblins away.",
  "description.potted.sunflower": "Brighten up your land.",
  "description.potted.potato": "Potato blood runs through your Bumpkin.",
  "description.potted.pumpkin": "Pumpkins for Bumpkins",
  "description.cactus": "Saves water and makes your farm look stunning!",
  "description.basic.bear":
    "A basic bear. Use this at Goblin Retreat to build a bear!",
  "description.bonnies.tombstone":
    "A spooky addition to any farm, Bonnie's Human Tombstone will send shivers down your spine.",
  "description.grubnashs.tombstone":
    "Add some mischievous charm with Grubnash's Goblin Tombstone.",
  "description.town.sign": "Show your farm ID with pride!",
  "description.dirt.path":
    "Keep your farmer boots clean with a well trodden path.",
  "description.bush": "What's lurking in the bushes?",
  "description.fence": "Add a touch of rustic charm to your farm.",
  "description.stone.fence": "Embrace the timeless elegance of a stone fence.",
  "description.pine.tree": "Standing tall and mighty, a needle-clad dream.",
  "description.shrub":
    "Enhance your in-game landscaping with a beautiful shrub",
  "description.field.maple":
    "A petite charmer that spreads its leaves like a delicate green canopy.",
  "description.red.maple": "Fiery foliage and a heart full of autumnal warmth.",
  "description.golden.maple":
    "Radiating brilliance with its shimmering golden leaves.",
  "description.crimson.cap":
    "A towering and vibrant mushroom, the Crimson Cap Giant Mushroom will bring life to your farm.",
  "description.toadstool.seat":
    "Sit back and relax on the whimsical Toadstool Mushroom Seat.",
  "description.chestnut.fungi.stool":
    "The Chestnut Fungi Stool is a sturdy and rustic addition to any farm.",
  "description.mahogany.cap":
    "Add a touch of sophistication with the Mahogany Cap Giant Mushroom.",
  "description.candles":
    "Enchant your farm with flickering spectral flames during Witches' Eve.",
  "description.haunted.stump":
    "Summon spirits and add eerie charm to your farm.",
  "description.spooky.tree": "A hauntingly fun addition to your farm's decor!",
  "description.observer":
    "A perpetually roving eyeball, always vigilant and ever-watchful!",
  "description.crow.rock": "A crow perched atop a mysterious rock.",
  "description.mini.corn.maze":
    "A memento of the beloved maze from the 2023 Witches' Eve season.",
  "description.lifeguard.ring": "Stay afloat with style, your seaside savior!",
  "description.surfboard": "Ride the waves of wonder, beach bliss on board!",
  "description.hideaway.herman":
    "Herman's here to hide, but always peeks for a party!",
  "description.shifty.sheldon":
    "Sheldon's sly, always scuttling to the next sandy surprise!",
  "description.tiki.torch": "Light the night, tropical vibes burning bright!",
  "description.beach.umbrella":
    "Shade, shelter, and seaside chic in one sunny setup!",
  "description.magic.bean": "What will grow?",
  "description.giant.potato": "A giant potato.",
  "description.giant.pumpkin": "A giant pumpkin.",
  "description.giant.cabbage": "A giant cabbage.",
  "description.chef.bear": "Every chef needs a helping hand",
  "description.construction.bear": "Always build in a bear market",
  "description.angel.bear": "Time to transcend peasant farming",
  "description.badass.bear": "Nothing stands in your way.",
  "description.bear.trap": "It's a trap!",
  "description.brilliant.bear": "Pure brilliance!",
  "description.classy.bear": "More SFL than you know what to do with it!",
  "description.farmer.bear": "Nothing quite like a hard day's work!",
  "description.rich.bear": "A prized possession",
  "description.sunflower.bear": "A Bear's cherished crop",
  "description.beta.bear": "A bear found through special testing events",
  "description.rainbow.artist.bear": "The owner is a beautiful bear artist!",
  "description.devil.bear":
    "Better the Devil you know than the Devil you don't",
  "description.collectible.bear": "A prized bear, still in mint condition!",
  "description.cyborg.bear": "Hasta la vista, bear",
  "description.christmas.snow.globe":
    "Swirl the snow and watch it come to life",
  "description.kraken.tentacle":
    "Dive into deep-sea mystery! This tentacle teases tales of ancient ocean legends and watery wonders.",
  "description.kraken.head":
    "Dive into deep-sea mystery! This head teases tales of ancient ocean legends and watery wonders.",
  "description.abandoned.bear": "A bear that was left behind on the island.",
  "description.turtle.bear": "Turtley enough for the turtle club.",
  "description.trex.skull": "A skull from a T-Rex! Amazing!",
  "description.sunflower.coin": "A coin made of sunflowers.",
  "description.skeleton.king.staff": "All hail the Skeleton King!",
  "description.lifeguard.bear": "Lifeguard Bear is here to save the day!",
  "description.snorkel.bear": "Snorkel Bear loves to swim.",
  "description.parasaur.skull": "A skull from a parasaur!",
  "description.goblin.bear": "A goblin bear. It's a bit scary.",
  "description.golden.bear.head": "Spooky, but cool.",
  "description.pirate.bear": "Argh, matey! Hug me!",
  "description.galleon": "A toy ship, still in pretty good nick.",
  "description.dinosaur.bone":
    "A Dinosaur Bone! What kind of creature was this?",
  "description.human.bear": "A human bear. Even scarier than a goblin bear.",
  "description.flamingo":
    "Represents a symbol of love's beauty standing tall and confident.",
  "description.blossom.tree":
    "Its delicate petals symbolizes the beauty and fragility of love.",
  "description.heart.balloons":
    "Use them as decorations for romantic occasions.",
  "description.whale.bear":
    "It has a round, furry body like a bear, but with the fins, tail, and blowhole of a whale.",
  "description.valentine.bear": "For those who love.",
  "description.easter.bear": "How can a Bunny lay eggs?",
  "description.easter.bush": "What is inside?",
  "description.giant.carrot":
    "A giant carrot stood, casting fun shadows, as rabbits gazed in wonder.",
  "description.beach.ball":
    "Bouncy ball brings beachy vibes, blows boredom away.",
  "description.palm.tree":
    "Tall, beachy, shady and chic, palm trees make waves sashay.",
  // Banners
  "description.goblin.war.banner":
    "A display of allegiance to the Goblin cause",
  "description.human.war.banner": "A display of allegiance to the Human cause",
};

const fishDescriptions: Record<FishDescriptions, string> = {
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
};

const buildingDescriptions: Record<BuildingDescriptions, string> = {
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
};

const toolDescriptions: Record<ToolDescriptions, string> = {
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
};

const gameDescriptions: Record<GameDescriptions, string> = {
  // Quest Items
  "description.goblin.key": "The Goblin Key",
  "description.sunflower.key": "The Sunflower Key",
  "description.ancient.goblin.sword": "An Ancient Goblin Sword",
  "description.ancient.human.warhammer": "An Ancient Human Warhammer",

  // Coupons
  "description.block.buck": "A valuable token in Sunflower Land!",
  "description.beta.pass": "Gain early access to features for testing.",
  "description.war.bond": "A mark of a true warrior",
  "description.jack.o.lantern": "A Halloween special event item",
  "description.golden.crop": "A shiny golden crop",
  "description.red.envelope": "Wow, you are lucky!",
  "description.love.letter": "Convey feelings of love",
  "description.solar.flare.ticket":
    "A ticket used during the Solar Flare Season",
  "description.dawn.breaker.ticket":
    "A ticket used during the Dawn Breaker Season",
  "description.crow.feather":
    "A ticket used during the Witches' Eve Ticket Season",
  "description.mermaid.scale":
    "A ticket used during the Catch the Kraken Season",
  "description.sunflower.supporter":
    "The mark of a true supporter of the game!",

  // Easter Items
  "description.egg.basket": "Easter Event",
  "description.blue.egg": "A blue easter egg",
  "description.orange.egg": "An orange easter egg",
  "description.green.egg": "A green easter egg",
  "description.yellow.egg": "A yellow easter egg",
  "description.red.egg": "A red easter egg",
  "description.pink.egg": "A pink easter egg",
  "description.purple.egg": "A purple easter egg",
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

const levelUpMessages: Record<LevelUpMessages, string> = {
  "levelUp.2":
    "Yeehaw, you've reached level 2! The crops are quakin' in their boots.",
  "levelUp.3": "Congrats on level 3! You're growing like a weed...",
  "levelUp.4":
    "Congrats on level 4! You've officially outgrown your green thumb.",
  "levelUp.5":
    "Level 5 and still alive! Your hard work is paying off...or should we say 'hay work'?",
  "levelUp.6":
    "Wow, level 6 already? You must be as strong as an ox. Or at least your plow is.",
  "levelUp.7": "Congrats on reaching level 7! Your farm is a-maize-ing.",
  "levelUp.8": "Level 8, great job! You're sowing the seeds of success.",
  "levelUp.9":
    "Niner niner, level 9er! Your harvest is growing as fast as your skills.",
  "levelUp.10":
    "Level 10, double digits! Your farm is looking so good, even the chickens are impressed.",
  "levelUp.11": "Level 11, you're making it rain (water, that is)!",
  "levelUp.12":
    "Congrats on level 12! Your farm is really starting to cultivate some character.",
  "levelUp.13":
    "Lucky level 13! You're really getting the hang of this farming thing.",
  "levelUp.14": "Level 14, it's a-maize-ing how much progress you've made!",
  "levelUp.15": "Fifteen and thriving! Your farm is looking better than ever.",
  "levelUp.16":
    "Congrats on level 16! Your farming skills are really taking root.",
  "levelUp.17":
    "Level 17, you're reaping what you sow (and it's looking good!).",
  "levelUp.18": "Eighteen and budding with potential!",
  "levelUp.19":
    "Congrats on level 19! Your farm is growing as fast as your skills.",
  "levelUp.20": "Level 20, you're the cream of the crop!",
  "levelUp.21": "Twenty-one and harvesting like a pro!",
  "levelUp.22":
    "Congrats on level 22! Your farm is getting plowed with success.",
  "levelUp.23": "Level 23, your skills are really starting to bloom!",
  "levelUp.24": "You're really blossoming at level 24!",
  "levelUp.25": "Quarter-century mark! You're making hay while the sun shines.",
  "levelUp.26":
    "Congrats on level 26! You're really milking this farming thing.",
  "levelUp.27": "Level 27, you're really starting to stand out in the field!",
  "levelUp.28": "You're really raising the bar at level 28!",
  "levelUp.29":
    "Congrats on level 29! You're really crop-tivating some serious skills.",
  "levelUp.30": "Level 30, you're a true farmer now!",
  "levelUp.31": "Thirty-one and still growing strong!",
  "levelUp.32": "Congrats on level 32! Your farm is in full bloom.",
  "levelUp.33": "Level 33, your farming skills are really taking off!",
  "levelUp.34": "You're really sprouting at level 34!",
  "levelUp.35": "Level 35, you're the tractor-trailer of farming!",
  "levelUp.36":
    "Congrats on level 36! Your farm is really starting to harvest some success.",
  "levelUp.37": "Level 37, your skills are really starting to crop up!",
  "levelUp.38": "You're really planting the seeds of success at level 38!",
  "levelUp.39": "Congrats on level 39! Your farm is really starting to mature.",
  "levelUp.40": "Level 40, you're a harvesting hero!",
  "levelUp.41": "Forty-one and still growing strong!",
  "levelUp.42":
    "Congrats on level 42! Your farm is starting to rake in the rewards.",
  "levelUp.43": "Level 43, you're really cultivating some serious skills.",
  "levelUp.44": "You're really harvesting success at level 44!",
  "levelUp.45": "Level 45, you're a true master of the harvest!",
  "levelUp.46":
    "Congrats on level 46! Your farming skills are really starting to bear fruit.",
  "levelUp.47": "Level 47, you're really growing into a farming legend.",
  "levelUp.48": "You're really thriving at level 48!",
  "levelUp.49":
    "Congrats on level 49! You're really starting to reap the rewards of your hard work.",
  "levelUp.50": "Halfway to 100! You're a true farming pro now.",
  "levelUp.51": "Fifty-one and still going strong!",
  "levelUp.52": "Congrats on level 52! Your farm is a true work of art.",
  "levelUp.53": "Level 53, your skills are really starting to take root.",
  "levelUp.54": "You're really harvesting happiness at level 54!",
  "levelUp.55": "Level 55, you're a true farming force to be reckoned with.",
  "levelUp.56":
    "Congrats on level 56! Your farm is really starting to blossom.",
  "levelUp.57":
    "Level 57, you're really starting to cultivate some serious skills.",
  "levelUp.58": "You're really sowing the seeds of success at level 58!",
  "levelUp.59": "Congrats on level 59! Your farm is the cream of the crop.",
  "levelUp.60": "Level 60, you're a true farming superstar!",
};

const bumpkinSkillsDescription: Record<BumpkinSkillsDescription, string> = {
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

const bountyDescription: Record<BountyDescription, string> = {
  "description.clam.shell": "A clam shell.",
  "description.sea.cucumber": "A sea cucumber.",
  "description.coral": "A piece of coral, it's pretty",
  "description.crab": "A crab, watch out for its claws!",
  "description.starfish": "The star of the sea.",
  "description.pirate.bounty":
    "A bounty for a pirate. It's worth a lot of money.",
  "description.wooden.compass":
    "It may not be high-tech, but it will always steer you in the right direction, wood you believe it?",
  "description.iron.compass":
    "Iron out your path to treasure! This compass is 'attract'-ive, and not just to the magnetic North!",
  "description.emerald.compass":
    "Guide your way through the lush mysteries of life! This compass doesn't just point North, it points towards opulence and grandeur!",
  "description.old.bottle":
    "Antique pirate bottle, echoing tales of high seas adventure.",
  "description.pearl": "Shimmers in the sun.",
  "description.pipi": "Plebidonax deltoides, found in the Pacific Ocean.",
  "description.seaweed": "Seaweed.",
};

export const ENGLISH_TERMS: Record<TranslationKeys, string> = {
  ...achievementTerms,
  ...bountyDescription,
  ...boostDescriptions,
  ...buildingDescriptions,
  ...bumpkinSkillsDescription,
  ...bumpkinPartRequirements,
  ...bumpkinTrade,
  // ...confirmationTerms,
  ...conversations,
  ...cropFruitDescriptions,
  ...decorationDescriptions,
  ...errorTerms,
  ...fishDescriptions,
  ...fishingQuests,
  ...foodDescriptions,
  ...gameDescriptions,
  ...gameTerms,
  ...generalTerms,
  ...guideTerms,
  ...henHouseTerms,
  ...islandName,
  ...landscapeTerms,
  ...levelUpMessages,
  ...onboarding,
  ...questions,
  ...retreatTerms,
  ...rewardTerms,
  ...rulesTerms,
  ...seasonTerms,
  ...shopItems,
  ...statements,
  ...toolDescriptions,
  ...transactionTerms,
  ...warningTerms,
  ...welcomeTerms,
};
