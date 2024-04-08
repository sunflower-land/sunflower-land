import {
  AchievementsTerms,
  Auction,
  AddSFL,
  AvailableSeeds,
  Base,
  BasicTreasure,
  Beach,
  Beehive,
  BeachLuck,
  BirdiePlaza,
  BoostDescriptions,
  BoostEffectDescriptions,
  BountyDescription,
  BuildingDescriptions,
  BumpkinDelivery,
  BumpkinItemBuff,
  BumpkinPartRequirements,
  BumpkinSkillsDescription,
  BumpkinTrade,
  BuyFarmHand,
  ClaimAchievement,
  Chat,
  ChickenWinner,
  ChoresStart,
  ChumDetails,
  Community,
  CompostDescription,
  ComposterDescription,
  ConfirmSkill,
  ConfirmationTerms,
  Conversations,
  CropBoomMessages,
  CropFruitDescriptions,
  DeliveryItem,
  DefaultDialogue,
  DecorationDescriptions,
  Delivery,
  DeliveryHelp,
  DepositWallet,
  Detail,
  DiscordBonus,
  Donation,
  DraftBid,
  ErrorAndAccess,
  ErrorTerms,
  ExoticShopItems,
  FestiveTree,
  FishDescriptions,
  FishermanModal,
  FishermanQuest,
  FishingChallengeIntro,
  FishingGuide,
  FishingQuests,
  FlowerBed,
  Flowerbreed,
  FlowerShopTerms,
  FoodDescriptions,
  GameDescriptions,
  GameTerms,
  GarbageCollector,
  GeneralTerms,
  GenieLamp,
  GetContent,
  GetInputErrorMessage,
  GOBLIN_MESSAGES,
  GoldPassModal,
  GoldTooth,
  GuideCompost,
  GuideTerms,
  HalveningCountdown,
  Harvestflower,
  HarvestBeeHive,
  HayseedHankPlaza,
  HayseedHankV2,
  Helper,
  HeliosSunflower,
  HenHouseTerms,
  HowToFarm,
  HowToSync,
  HowToUpgrade,
  Islandupgrade,
  InteractableModals,
  IntroPage,
  IslandName,
  IslandNotFound,
  LandscapeTerms,
  LetsGo,
  LevelUpMessages,
  Loser,
  LostSunflorian,
  MegaStore,
  ModalDescription,
  Noaccount,
  NoBumpkin,
  NoTownCenter,
  NotOnDiscordServer,
  NFTMinting,
  NPC_MESSAGE,
  Npc,
  NpcDialogues,
  NyeButton,
  ObsessionDialogue,
  Offer,
  Onboarding,
  OnCollectReward,
  OrderHelp,
  PageFounds,
  Pending,
  PersonHood,
  PirateChest,
  PirateQuest,
  Pickserver,
  PlazaSettings,
  PlayerTrade,
  Portal,
  PurchaseableBaitTranslation,
  Quest,
  Questions,
  Reaction,
  ReactionBud,
  Refunded,
  RemoveKuebiko,
  Resale,
  ResourceTerms,
  Restock,
  RetreatTerms,
  Resources,
  RewardTerms,
  RulesGameStart,
  RulesTerms,
  SceneDialogueKey,
  SeasonTerms,
  SettingsMenu,
  Share,
  SharkBumpkinDialogues,
  Shelly,
  ShellyDialogue,
  ShopItems,
  ShowingFarm,
  SnorklerDialogues,
  SomethingWentWrong,
  SpecialEvent,
  Statements,
  StopGoblin,
  SubSettings,
  Swarming,
  TieBreaker,
  ToolDescriptions,
  TransactionTerms,
  TranslationKeys,
  Transfer,
  TreasureModal,
  TutorialPage,
  VisitislandEnter,
  VisitislandNotFound,
  Wallet,
  WarningTerms,
  WelcomeTerms,
  WishingWell,
  Withdraw,
  Winner,
  WornDescription,
  World,
  MilestoneMessages,
  Event,
  Promo,
  Trader,
  NyonStatue,
  Trading,
  TimeUnits,
  PwaInstall,
  GoblinTrade,
  RestrictionReason,
} from "./types";

const generalTerms: Record<GeneralTerms, string> = {
  "2x.sale": "Распродажа",
  advanced: "Дополнительные",
  achievements: "Достижения",
  accept: "Принять",
  "accepting.terms": "Принимаю условия...",
  "amount.matic": "Сумма в MATIC",
  deposit: "Внести",
  add: "Добавить",
  addSFL: "Добавить SFL",
  "add.liquidity": "Добавить ликвидность",
  "alr.bought": "Уже куплено!",
  "alr.claim": "Уже получено!",
  "alr.completed": "Уже завершено",
  "alr.crafted": "Уже скрафчено!",
  "alr.minted": "Уже сминчено!",
  auction: "Аукцион",
  auctions: "Аукционы",
  "available.all.year": "Доступно круглый год",
  available: "Доступно",
  back: "Назад",
  bait: "Приманка",
  balance: "Баланс",
  basket: "Корзина",
  "beach.bounty": "Пляжные сокровища",
  beta: "Бета",
  bid: "Ставка",
  bounty: "Сокровища",
  build: "Построить",
  buy: "Купить",
  cancel: "Отмена",
  "card.cash": "Карта / Наличные",
  caught: "Поймано",
  "change.Language": "Сменить язык",
  check: "Проверить",
  chest: "Сундук",
  chores: "Список дел",
  "choose.wisely": "Выбирай с умом!",
  claim: "Забрать",
  "claim.gift": "Забрать подарок",
  "claim.skill": "Получить навык",
  clear: "Очистить",
  close: "Закрыть",
  collect: "Собрать",
  "coming.soon": "Скоро",
  common: "Обычный",
  completed: "Завершено",
  complete: "Завершить",
  confirm: "Подтвердить",
  congrats: "Поздравляем",
  connected: "Подключен",
  connecting: "Подключение",
  continue: "Продолжить",
  cook: "Приготовить",
  copied: "Скопировано",
  "copy.address": "Скопировать адрес",
  "copy.link": "Copy Link",
  "copy.failed": "Copy Failed!",
  coupons: "Купоны",
  craft: "Скрафтить",
  crafting: "Крафтится",
  crops: "Растения",
  "currently.Unavailable": "В данный момент недоступно!",
  danger: "Опасно",
  date: "Дата",
  decoration: "Украшение",
  deliver: "Доставить",
  deliveries: "Доставки",
  "deliveries.closed": "Доставки закрыты",
  delivery: "Доставка",
  details: "Подробнее",
  donate: "Пожертвовать",
  donating: "Жертвуем",
  "drafting.noitem": "Нет товаров в наличии",
  "drafting.select": "Выберите товар для выставления",
  "drafting.trade.detail": "Детали торговли",
  dragMe: "Drag me",
  earn: "Earn",
  "easter.eggs": "Пасхальные яйца",
  egg: "Яйцо",
  empty: "Пусто",
  "enjoying.event": "Наслаждаетесь этим событием?",
  equip: "Экипировать",
  error: "Ошибка",
  exchange: "Обмен",
  exotics: "Экзотика",
  "expand.land": "Расширяйте свою территорию",
  expand: "Расширить",
  explore: "Исследовать",
  farm: "Ферма",
  "farm.storage": "Farm Storage",
  featured: "Рекомендуемый",
  fee: "fee",
  "feed.bumpkin": "Feed Bumpkin",
  fertilisers: "Удобрения",
  fish: "Рыба",
  "fish.caught": "Пойманная рыба",
  flowers: "Цветы",
  "flowers.found": "Найденные цветы",
  foods: "Foods",
  for: "for",
  "for.info.wearable": "for more info about this wearable",
  forbidden: "Forbidden",
  "free.trade": "Free Trade",
  fruit: "Fruit",
  fruits: "Fruits",
  gift: "Gift",
  "go.home": "Go Home",
  "goblin.delivery":
    "Goblins keep their delivery cut in the treasury. View them also on",
  gotIt: "Got it",
  goto: "Go to",
  "grant.wish": "Grant New Wish",
  guide: "Гайд",
  harvested: "Harvested",
  honey: "Honey",
  "hungry?": "Hungry?",
  info: "Info",
  kick: "Kick",
  item: "Item",
  land: "Land",
  "land.id": "Land ID",
  "last.updated": "Last updated",
  left: "Left",
  "let'sDoThis": "Let's do this!",
  "lets.go": "Let's Go!",
  limit: "Limit",
  "linked.wallet": "Linked wallet",
  list: "List",
  "list.trade": "List trade",
  loading: "Загрузка",
  locked: "Locked",
  logout: "Logout",
  "loser.refund": "Refund resources",
  lvl: "Level",
  maintenance: "Maintenance",
  "make.wish": "Make a Wish",
  "making.wish": "Making a wish",
  max: "Max",
  message: "Message",
  messages: "Messages",
  minimum: "Minimum",
  mint: "Mint",
  minting: "minting",
  music: "Music",
  next: "Next",
  "next.order": "Next order",
  nextSkillPtLvl: "Next skill point: level",
  no: "No",
  "no.delivery.avl": "No deliveries available",
  "no.event": "No Event",
  "no.have.bumpkin": "You do not have a Bumpkin!",
  "no.limits.exceeded": "No limits exceeded",
  "no.mail": "No mail",
  "no.obsessions": "No Obsessions",
  "no.thanks": "No thanks",
  "ocean.fishing": "Ocean fishing",
  off: "Off",
  "offer.end": "Offer ends in",
  ok: "OK",
  on: "On",
  open: "open",
  "open.gift": "Open Gift",
  "pass.required": "Pass Required",
  place: "Place",
  "place.map": "Place on map",
  "place.bid": "Place your bid",
  "placing.bid": "Placing bid",
  plant: "Plant",
  "play.again": "Play again",
  "please.try.again": "Please try again later.",
  "please.wait": "Please wait",
  "pay.attention.feedback": "Pay attention to the feedback icons",
  print: "Print",
  "promo.code": "Promo Code",
  "providing.liquidity": "Providing Liquidity",
  purchased: "purchased",
  purchasing: "Purchasing",
  rank: "Rank",
  rare: "Rare",
  "read.more": "Read more",
  "ready.trade": "Ready to trade?",
  refresh: "Refresh",
  refreshing: "Refreshing",
  remaining: "remaining",
  "remaining.trades": "Remaining Trades",
  remove: "Remove",
  reqSkillPts: "Required Skill Points",
  reqSkills: "Required Skills",
  required: "required",
  requires: "Requires",
  resale: "Resale",
  resources: "Resources",
  restock: "Restock",
  retry: "Retry",
  reward: "Reward",
  "reward.discovered": "Reward Discovered",
  save: "Save",
  saving: "Сохранение",
  search: "Search",
  searching: "Searching",
  "seasonal.treasure": "Seasonal Treasure",
  seeds: "Seeds",
  selected: "Selected",
  "select.resource": "Select your resource",
  sell: "Продать",
  "sell.all": "Sell All",
  "sell.one": "Sell 1",
  "sell.ten": "Sell 10",
  "session.expire": "Your session has expired",
  "session.expired": "Session expired!",
  settings: "Settings",
  share: "Share",
  shopping: "Shopping",
  skillPts: "Skill Points",
  skills: "Skills",
  skipping: "Skipping",
  "skip.order": "Skip Order",
  "sound.effects": "Sound Effects",
  "special.event": "Special Event",
  spin: "Spin",
  start: "Start",
  "start.new.chore": "Start New Chore",
  submit: "Submit",
  submitting: "Submitting",
  success: "Success!",
  "support.team": "Support Team",
  swapping: "Swapping",
  syncing: "Syncing",
  task: "Задание",
  "terms.condition": "Правила и условия",
  test: "Test",
  "thank.you": "Thank you!",
  "there.currently": "There is currently",
  time: "Time",
  tools: "Tools",
  total: "Total",
  trades: "Trades",
  trading: "Trading",
  transfer: "Transfer",
  "trash.collection": "Trash Collection",
  travel: "Travel",
  "traveller.ready": "Hey Traveller! Ready to explore?",
  "try.again": "Try again",
  uhOh: "Uh oh!",
  uncommon: "Uncommon",
  "unlock.land": "Unlock more land",
  unlocking: "Unlocking",
  unmute: "Unmute",
  "use.craft": "Used to craft items",
  verify: "Verify",
  version: "Version",
  viewAll: "View all",
  visit: "Visit",
  "visit.enter.land": "Enter a Land ID to browse what's on offer.",
  "visit.friend": "Visit Friend",
  "visit.land": "Visit land",
  wallet: "Wallet",
  warning: "Warning",
  welcome: "Welcome!",
  "wishing.well": "Wishing Well",
  withdraw: "Withdraw",
  withdrawing: "Withdrawing",
  wish: "wish",
  yes: "Yes",
  "yes.please": "Yes Please",
  "you.are.here": "You are here",
  "hoarding.check": "Hoarder Check",
  opensea: "Opensea",
  layouts: "Layouts",
  labels: "Labels",
  buff: "Buff",
  speed: "Speed",
  treasure: "Treasure",
  special: "Special",
  default: "Default",
  formula: "Formula",
  chill: "Chill",
  full: "Full",
  collectibles: "Коллекционные предметы",
  buds: "Бады",
  wearables: "Одежда",
  bumpkin: "Bumpkin",
  storage: "Storage",
  upcoming: "Upcoming",
  collection: "Collection",
  purchase: "Purchase",
  listing: "Listing",
  cancelling: "Cancelling",
  skip: "Skip",
  docs: "Docs",
  exit: "Exit",
  compost: "Загрузить",
  chicken: "Chicken",
  recipes: "Recipes",
  unlocked: "Unlocked",
  reel: "Reel",
  "new.species": "New Species",
  buildings: "Buildings",
  boosts: "Boosts",
  decorations: "Decorations",
  "sfl/coins": "SFL/Coins",
};

const timeUnits: Record<TimeUnits, string> = {
  sec: "сек",
  min: "мин",
  hr: "ч",
  day: "день",

  secs: "сек",
  mins: "мин",
  hrs: "ч",
  days: "дней",
};

const achievementTerms: Record<AchievementsTerms, string> = {
  "breadWinner.description": "Заработать 0,001 SFL",
  "breadWinner.one": "Так-так-так, приятель.. Кажется, тебе нужно немного SFL!",
  "breadWinner.two":
    "В Sunflower Land, большой запас SFL - это ключ к созданию инструментов, строений и редких NFT",
  "breadWinner.three":
    "Выращивание и продажа урожая - это самый быстрый способ заработка SFL.",

  "sunSeeker.description": "Собрать Sunflower 100 раз",
  "cabbageKing.description": "Собрать Cabbage 200 раз",
  "jackOLantern.description": "Собрать Pumpkin 500 раз",
  "coolFlower.description": "Собрать Cauliflower 100 раз",
  "farmHand.description": "Собрать урожай 10,000 раз",
  "beetrootBeast.description": "Собрать Beetroot 2,000 раз",
  "myLifeIsPotato.description": "Собрать Potato 5,000 раз",
  "rapidRadish.description": "Собрать Radish 200 раз",
  "twentyTwentyVision.description": "Собрать Carrot 10,000 раз",
  "stapleCrop.description": "Собрать Wheat 10,000 раз",
  "sunflowerSuperstar.description": "Собрать Sunflower 100,000 раз",
  "bumpkinBillionaire.description": "Заработать 5,000 SFL",
  "patientParsnips.description": "Собрать Parsnip 5,000 раз",
  "cropChampion.description": "Собрать урожай 1 миллион раз",

  "busyBumpkin.description": "Достичь 2 уровня",
  "busyBumpkin.one":
    "Привет, мой амбициозный друг! Для открытия новых растений, участков земли, строений и многого другого, тебе придется повышать свой уровень.",
  "busyBumpkin.two":
    "Загляни в Fire Pit, приготовь вкусное блюдо согласно рецепту и покорми им своего бампкина.",

  "kissTheCook.description": "Приготовить 20 блюд",
  "bakersDozen.description": "Испечь 13 тортов",
  "brilliantBumpkin.description": "Достичь 20 уровня",
  "chefDeCuisine.description": "Приготовить 5,000 блюд",

  "scarecrowMaestro.description":
    "Скрафти Scarecrow, чтобы увеличить количество урожая",
  "scarecrowMaestro.one":
    "Привет, приятель! Пришло время научить тебя искусству крафта предметов и улучшить твои фермерские навыки",
  "scarecrowMaestro.two":
    "Отправляйся на Pumpkin Plaza, загляни к Blacksmith и скрафти Scarecrow.",

  "bigSpender.description": "Потратить 10 SFL",
  "museum.description":
    "Разместить 10 различных редких предметов на своей земле",
  "highRoller.description": "Потратить 7500 SFL",
  "timbeerrr.description": "Срубить 150 деревьев",
  "craftmanship.description": "Создать 100 инструментов",
  "driller.description": "Добыть камень 50 раз",
  "ironEyes.description": "Добыть железо 50 раз",
  "elDorado.description": "Добыть золото 50 раз",
  "timeToChop.description": "Создать 500 топоров",
  "canary.description": "Добыть камень 1000 раз",
  "somethingShiny.description": "Добыть железо 500 раз",
  "bumpkinChainsawAmateur.description": "Срубить 5000 деревьев",
  "goldFever.description": "Добыть золото 500 раз",

  // Explorer
  "explorer.one":
    "Давай соберем немного древесины, срубив эти деревья, и расширим остров. Вперёд! Узнай, как лучше всего это сделать!",
  "expansion.description": "Расширить свою землю до новых горизонтов.",

  // Well of Prosperity
  "wellOfProsperity.description": "Построить колодец",
  "wellOfProsperity.one": "Так-так-так, что тут у нас?",
  "wellOfProsperity.two":
    "Кажется, твоему урожаю нужна вода. Чтобы выращивать большее количество урожая, сначала нужно построить колодец.",

  "contractor.description": "Разместить 10 строений",
  "fruitAficionado.description": "Собрать 50 фруктов",
  "fruitAficionado.one":
    "Привет, сборщик фруктов! Фрукты — это самые сладкие дары природы, которые наполняют твою ферму ярким разнообразием вкусов.",
  "fruitAficionado.two":
    "Собирая различные фрукты, такие как яблоки, апельсины и голубику, ты разблокируешь уникальные рецепты, улучшишь свои кулинарные навыки и создашь восхитительные угощения",

  "orangeSqueeze.description": "Собрать Orange 100 раз",
  "appleOfMyEye.description": "Собрать Apple 500 раз",
  "blueChip.description": "Собрать Blueberry 5000 раз",
  "fruitPlatter.description": "Собрать фрукты 50000 раз",
  "crowdFavourite.description": "Завершить 100 доставок",

  "deliveryDynamo.description": "Завершить 3 доставки",
  "deliveryDynamo.one":
    "Привет, надежный фермер! Бампкины со всей округи нуждаются в твоей помощи с доставкой.",
  "deliveryDynamo.two":
    "Доставляя заказы, ты сделаешь их счастливыми и получишь взамен SFL, в качестве награды",

  "seasonedFarmer.description": "Собрать 50 сезонных ресурсов",
  "seasonedFarmer.one":
    "Привет, сезонный авантюрист! Sunflower Land известен своими особыми сезонами, которые наполнены уникальными предметами и сюрпризами.",
  "seasonedFarmer.two":
    "Собирая Сезонные ресурсы, ты получишь доступ к ограниченным по времени наградам, эксклюзивным крафтам и редким сокровищам. Это как оказаться в первом ряду, наслаждаясь всеми чудесами сезона.",
  "seasonedFarmer.three":
    "Для полного наслаждения всем тем, что может предложить тебе Sunflower Land, выполняй задания, участвуй в событиях и собирай Сезонные Билеты!",
  "treasureHunter.description": "Выкопать 10 ям",
  "treasureHunter.one":
    "Эхей, искатель сокровищ! Sunflower Land кишит спрятанными сокровищами, которые так и ждут своего часа.",
  "treasureHunter.two":
    "Хватай лопату и отправляйся на Остров Сокровищ, где ты можешь выкопать ценные предметы и редкие сюрпризы.",
  "eggcellentCollection.description": "Собрать яйца 10 раз",
  "eggcellentCollection.one":
    "Хэй, собиратель яиц! Куры — замечательные фермерские компаньоны, которые обеспечивают нас вкусными яйцами.",
  "eggcellentCollection.two":
    "Собирая яйца, у тебя будет свежий запас ингредиентов для приготовления еды, и также откроются особые рецепты и бонусы.",
  "task.harvestSunflowers": "Собрать Sunflower 10 раз",
};

const auction: Record<Auction, string> = {
  "auction.title": "Аукцион",
  "auction.bid.message": "Ты сделал ставку.",
  "auction.reveal": "Показать победителей",
  "auction.live": "Аукцион стартовал!",
  "auction.requirement": "Требования",
  "auction.start": "Время начала",
  "auction.period": "Период аукциона",
  "auction.closed": "Аукцион завершен",
  "auction.const": "В разработке!",
  "auction.const.soon": "Эта функция скоро появится.",
};

const addSFL: Record<AddSFL, string> = {
  "addSFL.swapDetails":
    "Sunflower Land предоставляет быстрый способ обмена Matic на SFL с помощью Quickswap.",
  "addSFL.referralFee":
    "Sunflower Land берет комиссию в размере 5% за совершение сделки.",
  "addSFL.swapTitle": "Детали Обмена",
  "addSFL.minimumReceived": "Минимальное получаемое",
};

const availableSeeds: Record<AvailableSeeds, string> = {
  "availableSeeds.select": "Семя не выбрано",
  "availableSeeds.select.plant": "Какое семя ты бы хотел выбрать и посадить?",
};

const base: Record<Base, string> = {
  "base.missing": "Missing name in config",
  "base.far.away": "Ты слишком далеко",
};

const basicTreasure: Record<BasicTreasure, string> = {
  "basic.treasure.missingKey": "Отсутствует ключ",
  "basic.treasure.needKey":
    "Тебе нужен Treasure Key, чтобы открыть этот сундук",
  "rare.treasure.needKey": "Тебе нужен Rare Key, чтобы открыть этот сундук",
  "luxury.treasure.needKey": "Тебе нужен Luxury Key, чтобы открыть этот сундук",
  "basic.treasure.getKey":
    "Ты можешь получать Treasure Keys, помогая бампкинам с заданиями",
  "basic.treasure.goodLuck": "Удачи",
  "basic.treasure.key": "Treasure Key",
  "basic.treasure.congratsKey": "Поздравляю, у тебя есть Treasure Key!",
  "basic.treasure.openChest": "Хочешь ли ты открыть сундук и забрать награду?",
  "budBox.open": "Open",
  "budBox.opened": "Opened",
  "budBox.title": "Bud box",
  "budBox.description": "Each day, a bud type can unlock farming rewards.",
  "raffle.title": "Goblin Raffle",
  "raffle.description":
    "Each month, you have a chance to win rewards. Winners will be announced on Discord.",
  "raffle.entries": "entries",
  "raffle.noTicket": "Missing Prize Ticket",
  "raffle.how":
    "You can collect Prize Tickets for free through special events and Bumpkin deliveries.",
  "raffle.enter": "Enter",
};

const beach: Record<Beach, string> = {
  "beach.party": "Мы усердно готовимся к пляжной вечеринке.",
  "beach.ready": "Приготовь солнцезащитный крем и зонты, лето приближается!",
};

const beehive: Record<Beehive, string> = {
  "beehive.harvestHoney": "Собрать Honey",
  "beehive.noFlowersGrowing": "Нет растущих цветов",
  "beehive.beeSwarm": "Пчелиный рой",
  "beehive.pollinationCelebration":
    "Праздник опыления! Твои посевы получают +0.2 к урожаю от дружелюбного пчелиного роя!",
};

const beachLuck: Record<BeachLuck, string> = {
  "beachLuck.tryLuck": "Хочешь испытать свою удачу сегодня?",
  "beachLuck.uncleFound":
    "Мой дядя нашел кольцо с бриллиантом, копая на этом пляже. А я нахожу только унылые монеты SFL.",
  "beachLuck.grabShovel": "Хватай лопату и начинай копать.",
  "beachLuck.refreshesIn": "Сокровища обновятся через",
};

const birdiePlaza: Record<BirdiePlaza, string> = {
  "birdieplaza.birdieIntro":
    "Привет, я - Birdie, самый красивый бампкин в округе!",
  "birdieplaza.admiringOutfit":
    "Я заметила, что ты восхищаешься моим нарядом. Ну разве он не великолепен?!?",
  "birdieplaza.currentSeason":
    "На данный момент мы в {{currentSeason}} сезоне, и бампкины сходят с ума по {{seasonalTicket}}.",
  "birdieplaza.collectTickets":
    "Собери достаточно {{seasonalTicket}} и ты сможешь скрафтить редкие NFTs. Так у меня и появился этот редкий наряд!",
  "birdieplaza.whatIsSeason": "Что такое сезон?",
  "birdieplaza.howToEarnTickets": "Как мне получить {{seasonalTicket}}?",
  "birdieplaza.earnTicketsVariety":
    "Ты можешь заработать {{seasonalTicket}} различными способами.",
  "birdieplaza.commonMethod":
    "Самый распространенный способ заработать {{seasonalTicket}} - это собирать ресурсы и доставлять их бампкинам в плазе.",
  "birdieplaza.choresAndRewards":
    "Ты также можешь заработать {{seasonalTicket}} за прохождение списка дел у Hank’а и собирая ежедневные награды!",
  "birdieplaza.gatherAndCraft":
    "Собери достаточно {{seasonalTicket}} и ты сможешь скрафтить некоторые редкие предметы, как я.",
  "birdieplaza.newSeasonIntro":
    "Каждые 3 месяца в Sunflower Land начинается новый сезон.",
  "birdieplaza.seasonQuests":
    "В этом сезоне тебя ждут увлекательные задания и редкие коллекционные предметы, которые ты можешь заработать.",
  "birdieplaza.craftItems":
    "Чтобы скрафтить эти предметы, ты должен собирать {{seasonalTicket}} и обменивать их в магазинах или в аукционном доме.",
};

const boostDescriptions: Record<BoostDescriptions, string> = {
  // Mutant Chickens
  "description.speed.chicken.one":
    "Твои куры теперь будут производить яйца на 10% быстрее.",
  "description.speed.chicken.two": "Яйца производятся на 10% быстрее",
  "description.fat.chicken.one":
    "Твои куры теперь будут требовать на 10% меньше Wheat на корм.",
  "description.fat.chicken.two": "На корм курице нужно на 10% меньше пшеницы",
  "description.rich.chicken.one":
    "Твои куры теперь будут производить на 10% больше яиц.",
  "description.rich.chicken.two": "Производится на 10% больше яиц",
  "description.ayam.cemani": "Самая редкая курица на свете!",
  "description.el.pollo.veloz.one":
    "Твои куры будут нести яйца на 4 часа быстрее!",
  "description.el.pollo.veloz.two":
    "Дай мне эти яйца, быстро! Яйца несутся на 4 часа быстрее.",
  "description.banana.chicken":
    "Курица, которая бустит Bananas. В каком мире мы живем.",

  // Boosts
  "description.lab.grow.pumpkin": "+0.3 к урожаю Pumpkin",
  "description.lab.grown.radish": "+0.4 к урожаю Radish",
  "description.lab.grown.carrot": "+0.2 к урожаю Carrot",
  "description.purple.trail":
    "Завораживающий и уникальный Purple Trail оставит за твоими противниками след зависти",
  "description.obie": "Свирепый баклажановый солдат",
  "description.maximus": "Раздави соперников с помощью пухлого Maximus",
  "description.mushroom.house":
    "Причудливый грибной дом, в котором очарованием пропитаны не только стены, но и мебель!",
  "description.Karkinos":
    "Колючий, но добрый. Отличное дополнение к твоей ферме в виде буста к cabbage!",
  "description.heart.of.davy.jones":
    "Тот, кто владеет этим, обладает огромной властью над семью морями, может без устали копать сокровища",
  "description.tin.turtle":
    "Tin Turtle дает +0.1 к Stones, которые ты добываешь в области ее действия.",
  "description.emerald.turtle":
    "Emerald Turtle дает +0.5 к любым минералам, которые ты добываешь в области ее действия.",
  "description.iron.idol":
    "Idol добавляет 1 iron каждый раз, когда ты добываешь iron.",
  "description.crim.peckster":
    "Детектив, который обладает умением находить Crimstones.",
  "description.skill.shrimpy":
    "Shrimpy's здесь, чтобы помочь! Он позаботится о том, чтобы ты получил дополнительный опыт с рыбы.",
  "description.soil.krabby":
    "Быстрое просеивание с улыбкой! Крабообразный чемпион, увеличивающий скорость компостирования на 10%.",
  "description.nana":
    "Эта редкая прелесть - верный способ увеличить урожай твоих бананов.",
  "description.grain.grinder":
    "Перемалывай зерна и получай аппетитный прирост к опыту с тортов!",
  "description.kernaldo": "Волшебный заклинатель кукурузы.",
  "description.kernaldo.1":
    "Волшебный заклинатель кукурузы. +25% скорости роста corn.",
  "description.poppy": "Мистическое кукурузное зерно.",
  "description.poppy.1": "Мистическое кукурузное зерно. +0.1 Corn с урожая.",
  "description.victoria.sisters": "Сестры, любящие тыкву",
  "description.undead.rooster":
    "Несчастная жертва войны. Производство яиц увеличивается на 10%.",
  "description.observatory": "Изучай звезды и улучшай научное развитие",
  "description.engine.core": "Сила подсолнуха",
  "description.time.warp.totem":
    "Время роста урожая, готовки, восстановления минералов и деревьев уменьшается на 50%. Длится только 2 часа",
  "description.time.warp.totem.expired":
    "Срок действия твоего Time Warp Totem закончился. Отправляйся на Pumpkin Plaza, чтобы найти и скрафтить больше волшебных предметов, которые улучшат твои фермерские навыки!",
  "description.time.warp.totem.temporarily":
    "Time Warp Totem временно дает буст к времени роста урожая, готовки, восстановления минералов и деревьев. Используй его по максимуму!",
  "description.cabbage.boy": "Не разбуди ребенка!",
  "description.cabbage.girl": "Тссс, она спит",
  "description.wood.nymph.wendy":
    "Накладывает чары для того, чтобы завлечь лесный фей.",
  "description.peeled.potato":
    "Прекрасный картофель, поощряет бонусным картофелем при сборе.",
  "description.potent.potato":
    "Мощный! Дает 3% шанс на получение +10 potatoes при сборе.",
  "description.radical.radish":
    "Коренной! Дает 3% шанс на получение +10 radishes при сборе.",
  "description.stellar.sunflower":
    "Звездный! Дает 3% шанс на получение +10 sunflowers при сборе.",
  "description.lady.bug":
    "Потрясающая букашка, которая питается тлями. Улучшает качество яблок.",
  "description.squirrel.monkey":
    "Естественный оранжевый хищник. Апельсиновые деревья пугаются, когда Squirrel Monkey рядом с ними.",
  "description.black.bearry":
    "Его любимое лакомство - пухлые, сочные blueberries. Съедает ее горстями!",
  "description.maneki.neko":
    "Манящая кошка. Потяни ее за ручку, и удача придет",
  "description.easter.bunny": "Редкий пасхальный предмет",
  "description.pablo.bunny": "Волшебный Easter bunny",
  "description.foliant": "Книга заклинаний.",
  "description.tiki.totem":
    "Tiki Totem добавляет 0.1 wood к каждому дереву, которое ты рубишь.",
  "description.lunar.calendar":
    "Растения теперь следуют лунному циклу! Скорость роста культур увеличивается на 10%.",
  "description.heart.davy.jones":
    "Тот, кто владеет этим, обладает огромной властью над семью морями, может без устали копать сокровища.",
  "description.treasure.map":
    "Зачарованная карта, которая приведет владельца к ценным сокровищам. +20% прибыли с пляжных сокровищ.",
  "description.genie.lamp":
    "Волшебная лампа, в которой живет джин, исполняющий три твоих желания.",
  "description.basic.scarecrow": "Придирчивый VIP защитник на твоей ферме",
  "description.scary.mike":
    "Любитель овощей и защитник до ужаса хорошего урожая!",
  "description.laurie.chuckle.crow":
    "Своим обескураживающим хохотом она прогоняет клювы от твоих посевов!",
  "description.immortal.pear":
    "Долгоживущая груша, благодаря которой фруктовые деревья живут дольше.",
  "description.bale":
    "Любимый сосед домашних птиц, обеспечивающий курам уютную обстановку",
  "description.sir.goldensnout":
    "Член королевской семьи, Sir Goldensnout наполняет твою ферму процветанием благодаря своему золотому навозу.",
  "description.freya.fox":
    "Очаровательная хранительница, своим мистическим шармом увеличивает скорость роста pumpkin. Собери много pumpkins под ее пристальным взглядом.",
  "description.queen.cornelia":
    "Воспользуйся силой Queen Cornelia и испытай внушительное увеличение урожая corn в области ее действия. +1 Corn.",
};

const resourceTerms: Record<ResourceTerms, string> = {
  "chicken.description": "Используется для откладывания яиц",
  "magicMushroom.description":
    "Используется для приготовления продвинутых блюд",
  "wildMushroom.description": "Используется для приготовления базовых блюд",
  "honey.description": "Используется для подслащивания твоих блюд",
};

const boostEffectDescriptions: Record<BoostEffectDescriptions, string> = {
  "description.obie.boost": "-25% времени роста Eggplant",
  "description.purple.trail.boost": "+0.2 Eggplant",
  "description.freya.fox.boost": "+0.5 Pumpkin",
  "description.sir.goldensnout.boost": "+0.5 урожая (область 4x4)",
  "description.maximus.boost": "+1 Eggplant",
  "description.basic.scarecrow.boost":
    "-20% времени роста базовых культур: Sunflower, Potato and Pumpkin (область 3х3)",
  "description.scary.mike.boost":
    "+0.2 средних культур: Carrot, Cabbage, Beetroot, Cauliflower and Parsnip (область 3х3)",
  "description.laurie.chuckle.crow.boost":
    "+0.2 продвинутых культур: Eggplant, Corn, Radish, Wheat, Kale (область 3x3)",
  "description.bale.boost": "+0.2 Egg (область 4x4)",
  "description.immortal.pear.boost": "+1 урожай фруктов за семя",
  "description.treasure.map.boost": "+20% монет за продажу сокровищ",
  "description.poppy.boost": "+0.1 Corn",
  "description.kernaldo.boost": "-25% времени роста Corn",
  "description.grain.grinder.boost": "+20% опыта с торта",
  "description.nana.boost": "-10% времени роста Banana",
  "description.soil.krabby.boost": "-10% времени компостирования у Composter",
  "description.skill.shrimpy.boost": "+20% опыта с рыбы",
  "description.iron.idol.boost": "+1 Iron",
  "description.emerald.turtle.boost": "+0.5 Stone, Iron, Gold (область 3x3)",
  "description.tin.turtle.boost": "+0.1 Stone (область 3x3)",
  "description.heart.of.davy.jones.boost": "+20 к ежедневному лимиту раскопок",
  "description.Karkinos.boost": "+0.1 Cabbage (не работает с Cabbage Boy)",
  "description.mushroom.house.boost": "+0.2 Wild Mushroom",
  "description.boost.gilded.swordfish": "+0.1 Gold",
  "description.nancy.boost": "-15% времени роста урожая",
  "description.scarecrow.boost": "-15% времени роста урожая; +20% к урожаю",
  "description.kuebiko.boost":
    "-15% времени роста урожая; +20% к урожаю; бесплатные семена",
  "description.gnome.boost":
    "+10 к урожаю средних/продвинутых культур (область 1х1)",
  "description.lunar.calendar.boost": "-10% времени роста урожая",
  "description.peeled.potato.boost": "20% шанс на +1 Potato",
  "description.victoria.sisters.boost": "+20% Pumpkin",
  "description.easter.bunny.boost": "+20% Carrot",
  "description.pablo.bunny.boost": "+0.1 Carrot",
  "description.cabbage.boy.boost": "+0.25 Cabbage (+0.5 с Cabbage Girl)",
  "description.cabbage.girl.boost": "-50% времени роста Cabbage",
  "description.golden.cauliflower.boost": "+100% Cauliflower",
  "description.mysterious.parsnip.boost": "-50% времени роста Parsnip",
  "description.queen.cornelia.boost": "+1 Corn (область 3x4)",
  "description.foliant.boost": "+0.2 Kale",
  "description.hoot.boost": "+0.5 Wheat, Radish, Kale",
  "description.hungry.caterpillar.boost": "Бесплатные семена цветов",
  "description.black.bearry.boost": "+1 Blueberry",
  "description.squirrel.monkey.boost": "-50% времени роста Orange",
  "description.lady.bug.boost": "+0.25 Apple",
  "description.banana.chicken.boost": "+0.1 Banana",
  "description.carrot.sword.boost": "4x шанс на урожай мутантов",
  "description.stellar.sunflower.boost": "3% шанс на +10 Sunflower",
  "description.potent.potato.boost": "3% шанс на +10 Potato",
  "description.radical.radish.boost": "3% шанс на +10 Radish",
  "description.lg.pumpkin.boost": "+0.3 Pumpkin",
  "description.lg.carrot.boost": "+0.2 Carrot",
  "description.lg.radish.boost": "+0.4 Radish",
  "description.fat.chicken.boost": "-0.1 Wheat для корма Chickens",
  "description.rich.chicken.boost": "+0.1 Egg",
  "description.speed.chicken.boost": "-10% времени производства Egg",
  "description.ayam.cemani.boost": "+0.2 Egg",
  "description.el.pollo.veloz.boost": "-4ч времени производства Egg",
  "description.rooster.boost": "2x шанс на курицу-мутанта",
  "description.undead.rooster.boost": "+0.1 Egg",
  "description.chicken.coop.boost":
    "+1 к производству Egg; +5 к лимиту Chicken на Hen House",
  "description.gold.egg.boost": "Для кормления кур не требуется Wheat",
  "description.woody.beaver.boost": "+20% Wood",
  "description.apprentice.beaver.boost":
    "+20% Wood; -50% времени восстановления Tree",
  "description.foreman.beaver.boost":
    "+20% Wood; -50% времени восстановления Tree; для рубки деревьев не требуются топоры",
  "description.wood.nymph.wendy.boost": "+0.2 Wood",
  "description.tiki.totem.boost": "+0.1 Wood",
  "description.tunnel.mole.boost": "+0.25 Stone",
  "description.rocky.mole.boost": "+0.25 Iron",
  "description.nugget.boost": "+0.25 Gold",
  "description.rock.golem.boost": "10% шанс на +2 Stone",
  "description.crimson.carp.boost": "+0.05 Crimstone",
  "description.crim.peckster.boost": "+0.1 Crimstone",
  "description.queen.bee.boost": "Удваивает скорость производства Honey",
  "description.beekeeper.hat.boost": "+20% скорость производства Honey",
  "description.flower.fox.boost": "-10% времени роста цветов",
  "description.humming.bird.boost": "20% шанс на +1 цветок",
  "description.beehive.boost": "10% шанс на +0.2 урожая когда улей заполнен",
  "description.walrus.boost": "+1 рыба",
  "description.alba.boost": "50% шанс на +1 базовую рыбу",
  "description.knowledge.crab.boost": "Двойной эффект от Sprout Mix",
  "description.maneki.neko.boost": "1 бесплатное блюдо в день",
  "description.genie.lamp.boost": "Исполняет 3 желания",
  "description.observatory.boost": "+5% опыта",
  "description.blossombeard.boost": "+10% опыта",
  "description.christmas.festive.tree.boost": "Бесплатный подарок на рождество",
  "description.grinxs.hammer.boost": "Снижает стоимость расширений вдвое",
  "description.time.warp.totem.boost":
    "Время роста урожая, готовки, восстановления минералов и деревьев уменьшается на 50%",
  "description.radiant.ray.boost": "+0.1 Iron",
  "description.babyPanda.boost": "2x буст к опыту для новичков",
  "description.hungryHare.boost": "2x опыта от Fermented Carrots",
};

const bountyDescription: Record<BountyDescription, string> = {
  "description.clam.shell": "Ракушка моллюска.",
  "description.sea.cucumber": "Морской огурец",
  "description.coral": "Кусочек коралла, красивый",
  "description.crab": "Краб, остерегайся его клешней!",
  "description.starfish": "Морская звезда.",
  "description.pirate.bounty": "Награда за пирата. Она стоит больших денег.",
  "description.wooden.compass":
    "Может он и не хай-тек, но всегда направит тебя в нужное направление, не так ли?",
  "description.iron.compass":
    "Проложи свой путь к сокровищам! Этот компас притягателен, и не только к Северному полюсу!",
  "description.emerald.compass":
    "Проложи свой путь через сочные тайны жизни! Этот компас не просто указывает на Север, он указывает на роскошь и величие!",
  "description.old.bottle":
    "Антикварная пиратская бутылка, напоминающая о приключениях в открытом море.",
  "description.pearl": "Переливается на солнце.",
  "description.pipi": "Plebidonax deltoides, встречается в Тихом океане.",
  "description.seaweed": "Морская водоросль.",
};

const buildingDescriptions: Record<BuildingDescriptions, string> = {
  // Buildings
  "description.water.well": "Растениям нужна вода!",
  "description.kitchen": "Улучши свои кулинарные навыки",
  "description.compost.bin":
    "Производит приманки и удобрения на регулярной основе.",
  "description.hen.house": "Развивай свою куриную империю",
  "description.bakery": "Испеки свои любимые торты",
  "description.turbo.composter":
    "Производит продвинутые приманки и удобрения на регулярной основе.",
  "description.deli": "Утоли свой аппетит этими деликатесами!",
  "description.smoothie.shack": "Свежевыжатый!",
  "description.warehouse": "Увеличь свой запас семян на 20%",
  "description.toolshed": "Увеличь свой запас инструментов на 50%",
  "description.premium.composter":
    "Производит экспертные приманки и удобрения на регулярной основе.",
  "description.town.center":
    "Соберись в Town Center, чтобы быть в курсе последних событий",
  "description.market": "Покупай и продавай на фермерском рынке",
  "description.fire.pit":
    "Поджарь свои Sunflowers, накорми и подними уровень своему бампкину",
  "description.workbench": "Создавай инструменты для сбора ресурсов",
  "description.tent": "(Отменено)",
  "description.house": "Место, где можно отдохнуть",
};

const bumpkinDelivery: Record<BumpkinDelivery, string> = {
  "bumpkin.delivery.haveFlower":
    "У тебя есть для меня цветок? Убедись, что это то, что мне нравится.",
  "bumpkin.delivery.notFavorite":
    "Хммм, это не мой любимый цветок. Но, думаю, главное не подарок, а внимание.",
  "bumpkin.delivery.loveFlower": "Ух ты, спасибо! Я обожаю этот цветок!",
  "bumpkin.delivery.favoriteFlower":
    "Это мой любимый цветок! Огромное спасибо!",
  "bumpkin.delivery.selectFlower": "Выбери цветок",
  "bumpkin.delivery.noFlowers": "О нет, у тебя нет цветов для подарка!",
  "bumpkin.delivery.thanks": "Вот здорово, спасибо, бампкин!!!",
  "bumpkin.delivery.waiting":
    "То что надо. Огромное спасибо! Возвращайся позже за новыми доставками.",
  "bumpkin.delivery.proveYourself":
    "Докажи, что ты достоин. Расширь свой остров еще {{missingExpansions}} раз.",
};

const bumpkinItemBuff: Record<BumpkinItemBuff, string> = {
  "bumpkinItemBuff.chef.apron.boost": "+20% прибыли от торта",
  "bumpkinItemBuff.fruit.picker.apron.boost": "+0.1 к фруктам",
  "bumpkinItemBuff.angel.wings.boost": "Мгновенный урожай",
  "bumpkinItemBuff.devil.wings.boost": "Мгновенный урожай",
  "bumpkinItemBuff.eggplant.onesie.boost": "+0.1 Eggplant",
  "bumpkinItemBuff.golden.spatula.boost": "+10% опыта",
  "bumpkinItemBuff.mushroom.hat.boost": "+0.1 Mushrooms",
  "bumpkinItemBuff.parsnip.boost": "+20% Parsnip",
  "bumpkinItemBuff.sunflower.amulet.boost": "+10% Sunflower",
  "bumpkinItemBuff.carrot.amulet.boost": "-20% времени роста Carrot",
  "bumpkinItemBuff.beetroot.amulet.boost": "+20% Beetroot",
  "bumpkinItemBuff.green.amulet.boost": "Шанс на 10x урожая",
  "bumpkinItemBuff.Luna.s.hat.boost": "-50% времени готовки",
  "bumpkinItemBuff.infernal.pitchfork.boost": "+3 урожая",
  "bumpkinItemBuff.cattlegrim.boost": "+0.25 продукции от животных",
  "bumpkinItemBuff.corn.onesie.boost": "+0.1 Corn",
  "bumpkinItemBuff.sunflower.rod.boost": "10% шанс на +1 рыбу",
  "bumpkinItemBuff.trident.boost": "20% шанс на +1 рыбу",
  "bumpkinItemBuff.bucket.o.worms.boost": "+1 Червь",
  "bumpkinItemBuff.luminous.anglerfish.topper.boost": "+50% опыта с рыбы",
  "bumpkinItemBuff.angler.waders.boost": "+10 к лимиту рыбалки",
  "bumpkinItemBuff.ancient.rod.boost": "Ловля без rod",
  "bumpkinItemBuff.banana.amulet.boost": "+0.5 Bananas",
  "bumpkinItemBuff.banana.boost": "-20% времени роста Banana",
  "bumpkinItemBuff.deep.sea.helm": "3x шанс на Marine Marvels",
  "bumpkinItemBuff.bee.suit": "+0.1 Honey",
  "bumpkinItemBuff.crimstone.hammer": "+2 Crimstones на 5й копке",
  "bumpkinItemBuff.crimstone.amulet": "-20% времени восстановления Crimstone",
  "bumpkinItemBuff.crimstone.armor": "+0.1 Crimstones",
  "bumpkinItemBuff.hornet.mask": "2x шанс на пчелиный рой",
  "bumpkinItemBuff.honeycomb.shield": "+1 Honey",
  "bumpkinItemBuff.flower.crown": "-50% времени роста цветов",
};

const bumpkinPartRequirements: Record<BumpkinPartRequirements, string> = {
  "equip.missingHair": "Требуется прическа",
  "equip.missingBody": "Требуется туловище",
  "equip.missingShoes": "Требуется обувь",
  "equip.missingShirt": "Требуется рубашка",
  "equip.missingPants": "Требуются брюки",
  "equip.missingBackground": "Требуется задний фон",
};

const bumpkinSkillsDescription: Record<BumpkinSkillsDescription, string> = {
  // Crops
  "description.green.thumb": "Растения дают на 5% больше урожая",
  "description.cultivator": "Растения растут на 5% быстрее",
  "description.master.farmer": "Растения дают на 10% больше урожая",
  "description.golden.flowers": "Шанс на выпадение Gold с Sunflowers",
  "description.happy.crop": "Шанс получить двойной урожай",
  // Trees
  "description.lumberjack": "С Trees падает на 10% больше",
  "description.tree.hugger": "Trees вырастают на 20% быстрее",
  "description.tough.tree": "Шанс получить 3x Wood",
  "description.money.tree": "Шанс на выпадение SFL",
  // Rocks
  "description.digger": "Падает на 10% больше Stone",
  "description.coal.face": "Stones восстанавливаются на 20% быстрее",
  "description.seeker": "Привлечение каменных монстров",
  "description.gold.rush": "Шанс получить 2.5x gold",
  // Cooking
  "description.rush.hour": "Блюда готовятся на 10% быстрее",
  "description.kitchen.hand": "Блюда дают дополнительно 5% опыта",
  "description.michelin.stars":
    "Высококачественная еда, зарабатывайте на 5% больше SFL",
  "description.curer":
    "Употребление деликатесов с deli добавляет дополнительно 15% опыта",
  // Animals
  "description.stable.hand": "Животные производят на 10% быстрее",
  "description.free.range": "Животные производят на 10% больше",
  "description.horse.whisperer": "Увеличение шанса на получение мутантов",
  "description.buckaroo": "Шанс на двойной сбор",
};

const bumpkinTrade: Record<BumpkinTrade, string> = {
  "bumpkinTrade.minLevel": "Чтобы торговать, тебе нужен 10 уровень",
  "bumpkinTrade.noTradeListed": "Ты ничего не выставил на продажу.",
  "bumpkinTrade.sell": "Продавай свои ресурсы другим игрокам за SFL.",
  "bumpkinTrade.like.list": "Что бы ты хотел выставить на продажу",
  "bumpkinTrade.goldpass.required": "Требуется Gold Pass",
  "bumpkinTrade.purchase": "Приобрести в Goblin Retreat",
  "bumpkinTrade.available": "Available",
  "bumpkinTrade.quantity": "Quantity",
  "bumpkinTrade.price": "Price",
  "bumpkinTrade.listingPrice": "Listing price",
  "bumpkinTrade.pricePerUnit": "Price per {{resource}}",
  "bumpkinTrade.tradingFee": "Trading fee",
  "bumpkinTrade.youWillReceive": "You will receive",
  "bumpkinTrade.cancel": "Cancel",
  "bumpkinTrade.list": "List",
  "bumpkinTrade.maxListings": "Max listings reached",
  "bumpkinTrade.max": "Max: {{max}}",
  "bumpkinTrade.floorPrice": "Floor Price: {{price}} SFL",
  "bumpkinTrade.price/unit": "{{price}} / unit",
};

const goblinTrade: Record<GoblinTrade, string> = {
  "goblinTrade.bulk": "Bulk Amount",
  "goblinTrade.conversion": "Conversion",
  "goblinTrade.select": "Select resource to sell",
  "goblinTrade.hoarding": "Oh no! You've reached the max SFL.",
  "goblinTrade.vipRequired": "VIP Access Required",
  "goblinTrade.vipDelivery":
    "Hmmm, looks like you are a basic Bumpkin. I only trade with VIPs.",
};

const buyFarmHand: Record<BuyFarmHand, string> = {
  "buyFarmHand.howdyBumpkin": "Привет, бампкин.",
  "buyFarmHand.confirmBuyAdditional":
    "Ты уверен, что хочешь купить еще одного бампкина?",
  "buyFarmHand.farmhandCoupon": "1 Farmhand Coupon",
  "buyFarmHand.adoptBumpkin": "Усыновить бампкина",
  "buyFarmHand.additionalBumpkinsInfo":
    "Дополнительного бампкина можно использовать, чтобы экипировать его одеждой и дать ферме буст.",
  "buyFarmHand.notEnoughSpace": "Не хватает места - улучши свой остров",
  "buyFarmHand.buyBumpkin": "Купить бампкина",
  "buyFarmHand.newFarmhandGreeting":
    "Я твой новый новый помощник. Мне не терпится приступить к работе!",
};

const claimAchievement: Record<ClaimAchievement, string> = {
  "claimAchievement.alreadyHave": "У тебя уже есть это достижение",
  "claimAchievement.requirementsNotMet": "Не выполнены все условия",
};

const chat: Record<Chat, string> = {
  "chat.Fail": "Проблемы с подключением",
  "chat.mute": "Ты в муте",
  "chat.again": "Ты снова сможешь общаться через",
  "chat.Kicked": "Кикнут",
};

const chickenWinner: Record<ChickenWinner, string> = {
  "chicken.winner.playagain": "нажми здесь, чтобы сыграть еще раз",
};

const choresStart: Record<ChoresStart, string> = {
  "chores.harvestFields": "Собери урожай с грядок",
  "chores.harvestFieldsIntro":
    "Эти грядки сами себя не вспашут. Собери 3 Sunflowers.",
  "chores.earnSflIntro":
    "Если ты хочешь добиться больших успехов в фермерских делах, то лучше начни с продажи sunflowers, покупки семян и получения прибыли.",
  "chores.reachLevel": "Достичь 2 уровня",
  "chores.reachLevelIntro":
    "Если ты хочешь повысить уровень и открыть новые возможности, то тебе следует приготовить еду и заточить ее.",
  "chores.chopTrees": "Срубить 3 Trees",
  "chores.helpWithTrees":
    "Мои старые кости уже не такие как раньше, не поможешь ли ты мне срубить эти проклятые деревья? Наш местный Blacksmith поможет тебе скрафтить немного инструментов.",
  "chores.noChore":
    "К сожалению, у меня сейчас нет списка дел, которые надо сделать.",
  "chores.newSeason": "Приближается новый сезон, список дел временно закрыт.",
  "chores.choresFrozen":
    "Скоро появится новый сезонный список дел. Список дел и прогресс с прошлого сезона будет сброшен.",
};

const chumDetails: Record<ChumDetails, string> = {
  "chumDetails.gold": "Сияющее золото, которое можно увидеть за 100 миль",
  "chumDetails.iron":
    "Сверкающий блеск, который можно увидеть под любым ракурсом во время Dusk",
  "chumDetails.stone":
    "Возможно, забросив несколько камней, получится привлечь какую-нибудь рыбу",
  "chumDetails.egg": "Хммм, не знаю какой рыбе понравятся яйца...",
  "chumDetails.sunflower": "Солнечная, яркая насадка для любопытных рыб.",
  "chumDetails.potato": "Из картофеля получится необычное угощение для рыбы.",
  "chumDetails.pumpkin": "Рыб может заинтриговать оранжевое сияние тыкв.",
  "chumDetails.carrot":
    "Лучше всего использовать вместе с Earthworms для ловли Anchovies!",
  "chumDetails.cabbage": "Листовый соблазн для подводных травоядных.",
  "chumDetails.beetroot": "Свекла - подводное лакомство для отважных рыб.",
  "chumDetails.cauliflower":
    "Рыбы могут считать цветочки весьма привлекательными",
  "chumDetails.parsnip": "Землянистая, корневая насадка  для любопытных рыб.",
  "chumDetails.eggplant": "Баклажаны: подводное приключения для отважных рыб.",
  "chumDetails.corn":
    "Кукуруза в початках - странное, но интригующее угощение.",
  "chumDetails.radish": "Редис - зарытое сокровище для подводных обитателей.",
  "chumDetails.wheat":
    "Пшеница - зернистое лакомство для подводных обитателей.",
  "chumDetails.kale": "Лиственно-зеленый сюрприз для любопытных рыб.",
  "chumDetails.blueberry":
    "Голубые рыбы часто путают с потенциальными приятелями.",
  "chumDetails.orange":
    "Апельсины - цитрусовая диковинка для подводных обитателей.",
  "chumDetails.apple": "Яблоки - хрустящая тайна под волнами.",
  "chumDetails.banana": "Легче воды!",
  "chumDetails.seaweed": "Вкус океана в листовой подводной закуске.",
  "chumDetails.crab": "Манящее лакомство для любопытных подводных рыб.",
  "chumDetails.anchovy": "Анчоусы, таинственно манящие морских разбойников.",
  "chumDetails.redSnapper": "Тайна, скрытая в глубинах океана.",
  "chumDetails.tuna": "Что может быть настолько большим, чтобы съесть тунца?",
  "chumDetails.squid": "Пробуди ray его любимым угощением!",
  "chumDetails.wood": "Древесина. Интересный выбор....",
  "chumDetails.redPansy": "Пламенная приманка для неуловимой рыбы.",
  "chumDetails.fatChicken":
    "Настоящее белое мясо, перед которым не устоит самый крупный хищник.",
  "chumDetails.speedChicken":
    "Фастфудный перекус для хищника с острыми зубами.",
  "chumDetails.richChicken": "Деликатес для ужасающего яркобрюхого хищника.",
};

const community: Record<Community, string> = {
  "community.toast": "Toast text is empty",
  "community.url": "Enter your repo URL",
  "comunity.Travel": "Travel to community built islands",
};

const cropBoomMessages: Record<CropBoomMessages, string> = {
  "crop.boom.welcome": "Welcome to Crop Boom",
  "crop.boom.reachOtherSide":
    "Reach the other side of the dangerous crop field to claim an Arcade Token",
  "crop.boom.bewareExplodingCrops":
    "Beware of exploding crops. If you step on these, you will start from the beginning",
  "crop.boom.newPuzzleDaily": "Each day a new puzzle will appear",
  "crop.boom.back.puzzle": "Come back later for a brand new puzzle!",
};

const compostDescription: Record<CompostDescription, string> = {
  "compost.fruitfulBlend":
    "Fruitful Blend добавляет +0.1 к урожаю каждого фрукта",
  "compost.sproutMix": "Sprout Mix увеличивает урожай растений на +0.2",
  "compost.sproutMixBoosted": "Sprout Mix увеличивает урожай растений на +0.4",
  "compost.rapidRoot": "Rapid Root снижает время роста растений на 50%",
};

const composterDescription: Record<ComposterDescription, string> = {
  "composter.compostBin": "Детали Compost Bin...",
  "composter.turboComposter": "Детали Turbo Composter...",
  "composter.premiumComposter": "Детали Premium Composter...",
};

const confirmSkill: Record<ConfirmSkill, string> = {
  "confirm.skillClaim": "Ты точно хочешь выбрать этот навык?",
};

const confirmationTerms: Record<ConfirmationTerms, string> = {
  "confirmation.sellCrops": "Ты уверен что хочешь",
};

const conversations: Record<Conversations, string> = {
  "hank-intro.headline": "Поможешь старику?",
  "hank-intro.one":
    "Привет, Бампкин! Добро пожаловать в наше маленькое райское местечко.",
  "hank-intro.two":
    "Я работаю на этой земле уже пятьдесят лет, и мне бы точно пригодилась помощь.",
  "hank-intro.three":
    "Я могу научить тебя основам фермерства, при условии, что ты поможешь мне с моим ежедневным списком дел.",
  "hank.crafting.scarecrow": "Создать Scarecrow",
  "hank-crafting.one":
    "Хммм, этот урожай растет до ужаса медленно. У меня нет времени ждать.",
  "hank-crafting.two": "Создай Scarecrow, чтобы ускорить рост своего урожая.",
  "betty-intro.headline": "Как развить твою ферму",
  "betty-intro.one": "Привет привет! Добро пожаловать ко мне на рынок.",
  "betty-intro.two":
    "Приноси мне свой лучший урожай, и я предложу тебе справедливую цену за него!",
  "betty-intro.three":
    "Тебе нужны семена? У меня есть все, от картошки до пастернака!",
  "betty.market-intro.one":
    "Привет, бампкин! Это Betty с рынка на ферме. Я путешествую между островами, чтобы прикупить урожай и продать свежие семена.",
  "betty.market-intro.two":
    "Хорошая новость: ты только что наткнулся на новую блестящую лопату! Плохая новость: нам не хватает урожая.",
  "betty.market-intro.three":
    "В течение ограниченного времени, я предлагаю новичкам удвоить их прибыль с любых растений, которые они мне принесут.",
  "betty.market-intro.four":
    "Собери эти Sunflowers и начинай развивать свою фермерскую империю.",
  "bruce-intro.headline": "Введение в кулинарию",
  "bruce-intro.one": "Я владелец этого маленького уютного бистро.",
  "bruce-intro.two":
    "Принеси мне ингредиенты, и я приготовлю столько еды, сколько ты сможешь съесть!",
  "bruce-intro.three":
    "Привет, фермер! Я могу за милю учуять голодного бампкина.",
  "blacksmith-intro.headline": "Поторапливайся.",
  "blacksmith-intro.one":
    "Я мастер по крафту инструментов, и с правильными ресурсами я могу скрафтить все, что ты пожелаешь... включая еще больше инструментов!",
  "pete.first-expansion.one":
    "Мои поздравления, бампкин! Твоя ферма развивается быстрее, чем бобовый стебель в ливень!",
  "pete.first-expansion.two":
    "С каждым расширением ты будешь открывать новые возможности, такие как: особые ресурсы, новые деревья и многое другое!",
  "pete.first-expansion.three":
    "Не пропускай подарки от щедрых гоблинов после расширений - они не только опытные строители, но и искусные дарители!",
  "pete.first-expansion.four": "Поздравляю, бампкин! Продолжай в том же духе.",
  "pete.craftScarecrow.one": "Хмм, эти растения медленно растут.",
  "pete.craftScarecrow.two":
    "Sunflower Land полон волшебных предметов, которые ты можешь скрафтить, чтобы усилить свои фермерские навыки.",
  "pete.craftScarecrow.three":
    "Подойди к work bench и скрафти scarecrow, чтобы увеличить скорость роста Sunflowers.",
  "pete.levelthree.one":
    "Поздравляю, твой зеленый палец действительно блестящий! ",
  "pete.levelthree.two":
    "Пришло время отправиться в Plaza, где ты можешь усовершенствовать свое фермерское мастерство.",
  "pete.levelthree.three":
    "В plaza ты можешь сдавать свои ресурсы за награды, крафтить волшебные предметы и торговать с другими игроками.",
  "pete.levelthree.four":
    "Ты можешь путешествовать, нажав на значок мира в левом нижнем углу.",
  "pete.help.zero":
    "Посещай fire pit, готовь и ешь еду, чтобы поднимать свой уровень.",
  "pete.pumpkinPlaza.one":
    "По мере повышения уровня, ты будешь открывать новые места для исследования. Первое - это Pumpkin Plaza....мой дом!",
  "pete.pumpkinPlaza.two":
    "Здесь ты можешь выполнять доставки и получать за них награды, крафтить волшебные предметы и торговать с другими игроками.",
  "sunflowerLand.islandDescription":
    "Sunflower Land полон захватывающих островов, где ты можешь выполнять доставки, крафтить редкие NFTs и даже раскапывать сокровища!",
  "sunflowerLand.opportunitiesDescription":
    "В разных локациях есть разные возможности потратить свои усердно заработанные ресурсы.",
  "sunflowerLand.returnHomeInstruction":
    "В любое время можно нажать на кнопку путешествия и отправиться домой.",
  "grimbly.expansion.one":
    "Приветствую тебя, начинающий фермер! Я - Grimbly, опытный гоблин-строитель.",
  "grimbly.expansion.two":
    "С помощью подходящих материалов и моего древнего таланта, мы можем превратить твой остров в произведение искусства.",
  "luna.portalNoAccess":
    "Хммм, этот портал появился из ниоткуда. Что это может означать?",
  "luna.portals": "Порталы",
  "luna.rewards": "Награды",
  "luna.travel":
    "Путешествуй по построенным игроками порталам и зарабатывай награды.",
  "pete.intro.one":
    "Приветствую тебя, Бампкин! Добро пожаловать в Sunflower Land, изобильный фермерский мир, где возможно всё!",
  "pete.intro.two":
    "На каком живописном острове ты обосновался! Я - Pumpkin Pete, твой сосед.",
  "pete.intro.three":
    "Прямо сейчас в Plaza игроки отмечают праздник, получая фантастические награды и волшебные предметы.",
  "pete.intro.four":
    "Но перед тем, как присоединиться к веселью, ты должен развить свою ферму и собрать немного ресурсов. Ты же не хочешь прийти туда с пустыми руками?",
  "pete.intro.five":
    "Для начала тебе нужно срубить деревья и расширить свой остров.",
  "mayor.plaza.changeNamePrompt":
    "Ты хочешь сменить имя? К сожалению, я не могу тебе сейчас с этим помочь, слишком много документов для меня.",
  "mayor.plaza.intro":
    "Привет, дорогой бампкин, кажется, мы еще не познакомились.",
  "mayor.plaza.role":
    "Я мэр этого города! Я отвечаю за то, чтобы все были счастливы. А еще я слежу за тем, чтобы у каждого было имя!",
  "mayor.plaza.fixNamePrompt":
    "У тебя еще нет имени? Что ж, мы можем это исправить! Хочешь, чтобы я подготовил документы?",
  "mayor.plaza.enterUsernamePrompt": "Введи свое имя пользователя",
  "mayor.plaza.usernameValidation":
    "Пожалуйста, имей в виду, что имя пользователя должно соответствовать нашим",
  "mayor.plaza.niceToMeetYou": "Приятно познакомиться, !",
  "mayor.plaza.congratulations":
    "Поздравляю, оформление документов завершено. До встречи!",
  "mayor.plaza.enjoyYourStay":
    "Надеюсь, тебе нравится твое пребывание в Sunflower Land! Если я тебе когда-нибудь понадоблюсь, то ты знаешь где меня искать!",
  "mayor.codeOfConduct": "Кодекс поведения",
  "mayor.failureToComply":
    "Несоблюдение правил может повлечь за собой наказание, включая возможную блокировку аккаунта",
  "mayor.paperworkComplete": "Оформление документов завершено. До встречи",
};

const cropFruitDescriptions: Record<CropFruitDescriptions, string> = {
  // Crops
  "description.sunflower": "Солнечный цветок",
  "description.potato": "Полезнее, чем ты мог бы подумать.",
  "description.pumpkin": "Не только для пирога.",
  "description.carrot": "Она полезна для твоих глаз!",
  "description.cabbage": "Когда-то роскошь, а теперь просто еда.",
  "description.beetroot": "Хорошо помогает от похмелья!",
  "description.cauliflower": "Отличная замена рису!",
  "description.parsnip": "Не путать с морковью.",
  "description.eggplant": "Съедобное произведение искусства.",
  "description.corn":
    "Обожженные солнцем лакомые зернышки, летнее природное богатство.",
  "description.radish": "Придется подождать, но это того стоит!",
  "description.wheat": "Самая собираемая культура в мире.",
  "description.kale": "Мощная еда для бампкина!",

  // Fruits
  "description.blueberry": "Гоблинская слабость",
  "description.orange": "Витамин С для поддержания здоровья твоего бампкина",
  "description.apple": "Идеально для домашнего Apple Pie",
  "description.banana": "О, банан!",

  // Exotic Crops
  "description.white.carrot": "Бледная морковь с бледными корнями",
  "description.warty.goblin.pumpkin": "Причудливая, покрытая бородавками тыква",
  "description.adirondack.potato": "Прочный картофель, в стиле адирондак!",
  "description.purple.cauliflower": "Царская фиолетовая цветная капуста",
  "description.chiogga": "Радужная свекла!",
  "description.golden.helios": "Загорелое чудо!",
  "description.black.magic": "Мрачный и таинственный цветок!",

  //Flower Seed
  "description.sunpetal.seed": "Семя sunpetal",
  "description.bloom.seed": "Семя bloom",
  "description.lily.seed": "Семя lily",
};

const deliveryitem: Record<DeliveryItem, string> = {
  "deliveryitem.inventory": "Инвентарь",
  "deliveryitem.itemsToDeliver": "Предметы для отправки",
  "deliveryitem.deliverToWallet": "Отправить на твой кошелек",
  "deliveryitem.viewOnOpenSea":
    "После получения ты увидишь свои товары на OpenSea.",
  "deliveryitem.deliver": "Доставить",
};

const defaultDialogue: Record<DefaultDialogue, string> = {
  "defaultDialogue.intro":
    "Привет, друг! Я здесь для того, чтобы узнать, нет ли у тебя нужной мне вещи!",
  "defaultDialogue.positiveDelivery":
    "О, замечательно! Ты принес именно то, что мне нужно. Спасибо!",
  "defaultDialogue.negativeDelivery":
    "О нет! Похоже, у тебя нет того, что мне нужно. Впрочем, не переживай. Продолжай поиски и мы найдем другую возможность.",
  "defaultDialogue.noOrder":
    "Сейчас нет активного заказа, который я мог бы выполнить.",
};

const decorationDescriptions: Record<DecorationDescriptions, string> = {
  // Decorations
  "description.wicker.man":
    "Возьмитесь за руки и образуйте цепь, и тень Wicker Man появится вновь",
  "description.golden bonsai": "Гоблины тоже любят бонсай",
  "description.christmas.bear": "Любимец Санты",
  "description.war.skull": "Украшает землю костями твоих врагов.",
  "description.war.tombstone": "R.I.P",
  "description.white.tulips":
    "Отгораживает от запаха гоблинов как можно дальше.",
  "description.potted.sunflower": "Украшает твою землю.",
  "description.potted.potato": "В твоем бампкине течет картофельная кровь.",
  "description.potted.pumpkin": "Pumpkins для бампкинов",
  "description.cactus": "Экономит воду и придает твоей ферме превосходный вид!",
  "description.basic.bear":
    "A basic bear. Используй его в Goblin Retreat, чтобы создать медведя!",
  "description.bonnies.tombstone":
    "Жуткое дополнение к любой ферме, от Bonnie's Human Tombstone у тебя пойдут мурашки по спине.",
  "description.grubnashs.tombstone":
    "Добавь немного зловещего обаяния с помощью Grubnash's Goblin Tombstone.",
  "description.town.sign": "С гордостью показывает номер твоей фермы!",
  "description.dirt.path":
    "Не пачкает твою фермерскую обувь благодаря хорошо протоптанной дорожке.",
  "description.bush": "Что затаилось в кустах?",
  "description.fence": "Добавляет нотку деревенского стиля твоей ферме.",
  "description.stone.fence":
    "Насладись неустаревающей элегантностью каменного забора.",
  "description.pine.tree": "Стоит высокая и могучая, покрытая иголками.",
  "description.shrub": "Укрась свой игровой ландшафт красивым кустарником",
  "description.field.maple":
    "Маленький клен, раскинувший свои листья в виде нежно-зеленого купола.",
  "description.red.maple":
    "Пламенные листья и сердце, наполненное осенним теплом.",
  "description.golden.maple":
    "Излучает блеск своими мерцающими золотыми листьями.",
  "description.crimson.cap":
    "Возвышающийся и красочный гриб, Crimson Cap Giant Mushroom оживит твою ферму.",
  "description.toadstool.seat":
    "Устраивайся поудобнее и расслабься на причудливом Toadstool Mushroom Seat.",
  "description.chestnut.fungi.stool":
    "Chestnut Fungi Stool - прочное и деревенское дополнение к любой ферме.",
  "description.mahogany.cap":
    "Добавь нотку изысканности с помощью Mahogany Cap Giant Mushroom.",
  "description.candles":
    "Зачаровывает твою ферму мерцающим призрачным пламенем во время Witches' Eve.",
  "description.haunted.stump":
    "Призывает духов и добавляет мрачности твоей ферме.",
  "description.spooky.tree":
    "Невероятно забавное дополнение к декору на твоей ферме!",
  "description.observer": "Вечно бдящее глазное яблоко, которое всегда начеку!",
  "description.crow.rock": "Ворона, сидящее на загадочном камне.",
  "description.mini.corn.maze":
    "В память о любимом лабиринте с 2023 Witches' Eve сезона.",
  "description.lifeguard.ring":
    "Оставайся на плаву со стилем, вместе с морским спасателем!",
  "description.surfboard": "Оседлай волну чудес и пляжного счастья на доске!",
  "description.hideaway.herman":
    "Herman здесь, чтобы спрятаться, но он всегд заглядывает на вечеринку!",
  "description.shifty.sheldon":
    "Скользкий Sheldon, всегда убегает к следующему песчаному сюрпризу!",
  "description.tiki.torch":
    "Освети ночь, потому что тропический вайб горит ярко!",
  "description.beach.umbrella":
    "Тенек, навес и морской шик в одном солнечном устройстве!",
  "description.magic.bean": "Что же вырастет?",
  "description.giant.potato": "Гигантский картофель.",
  "description.giant.pumpkin": "Гигантская тыква.",
  "description.giant.cabbage": "Гигантская капуста.",
  "description.chef.bear": "Каждому шеф-повару нужна помощь",
  "description.construction.bear": "Всегда производится на медвежьем рынке",
  "description.angel.bear":
    "Пришло время выйти за рамки крестьянского фермерства",
  "description.badass.bear": "Ничто тебя не остановит",
  "description.bear.trap": "Это ловушка!",
  "description.brilliant.bear": "Чистейшее великолепие!",
  "description.classy.bear": "Здесь больше SFL, чем тебе нужно!",
  "description.farmer.bear": "Ничто не сравнится с тяжелым рабочим днем!",
  "description.rich.bear": "Ценная вещь",
  "description.sunflower.bear": "Любимое растение медведя",
  "description.beta.bear":
    "Медведь, полученный в ходе специальных тестовых событий",
  "description.rainbow.artist.bear": "Его владелец прекрасно рисует медведя!",
  "description.devil.bear":
    "Лучше тот дьявол, которого знаешь, чем тот, которого не знаешь",
  "description.collectible.bear":
    "Ценный медведь, до сих пор в отличном состоянии!",
  "description.cyborg.bear": "Hasta la vista, медвежонок",
  "description.christmas.snow.globe":
    "Потряси шар и смотри за тем, как он оживает",
  "description.kraken.tentacle":
    "Окунись в тайны морских глубин! Это щупальце расскажет о древних океанских легендах и морских чудесах.",
  "description.kraken.head":
    "Окунись в тайны морских глубин! Эта голова расскажет о древних океанских легендах и морских чудесах.",
  "description.abandoned.bear": "Медведь, которого оставили на острове.",
  "description.turtle.bear": "Хватит для черепашьего клуба.",
  "description.trex.skull": "Череп Ти-Рекса! Потрясающе!",
  "description.sunflower.coin": "Монета, сделанная из подсолнухов.",
  "description.skeleton.king.staff": "Да здравствует Skeleton King!",
  "description.lifeguard.bear": "Lifeguard Bear здесь, чтобы выручить!",
  "description.snorkel.bear": "Snorkel Bear обожает плавать.",
  "description.parasaur.skull": "Череп Паразавра!",
  "description.goblin.bear": "Медведь-гоблин. Немного пугающе.",
  "description.golden.bear.head": "Жуткий, но клевый.",
  "description.pirate.bear": "Аррр, старый пройдоха! Обними меня!",
  "description.galleon": "Игрушечный корабль, все еще в хорошем состоянии.",
  "description.dinosaur.bone": "Кость динозавра! Интересно, чья она?",
  "description.human.bear":
    "Медведь-человек. Даже страшнее, чем медведь-гоблин.",
  "description.flamingo":
    "Представляет собой символ любви, стоящей высоко и уверенно.",
  "description.blossom.tree":
    "Эти нежные лепестки символизируют красоту и хрупкость любви.",
  "description.heart.balloons":
    "Используй их в качестве декорации для романтических свиданий.",
  "description.whale.bear":
    "У него круглое пушистое тело, как у медведя, но плавники, хвост и дыхало кита.",
  "description.valentine.bear": "Для тех, кто любит.",
  "description.easter.bear": "Как кролик может откладывать яйца?",
  "description.easter.bush": "Что там внутри?",
  "description.giant.carrot":
    "Стояла гигантская морковка, отбрасывая забавные тени, а кролики с удивлением смотрели на нее.",
  "description.beach.ball":
    "Надувной мяч, создающий пляжный вайб и прогоняющий скуку.",
  "description.palm.tree":
    "Высокие, пляжные, тенистые и изысканные пальмы заставляют волны колыхаться.",

  //other
  "description.sunflower.amulet": "Урожай Sunflower увеличен на 10%.",
  "description.carrot.amulet": "Carrots растут на 20% быстрее.",
  "description.beetroot.amulet": "Урожай Beetroot увеличен на 20%.",
  "description.green.amulet": "Шанс на 10х урожая.",
  "description.warrior.shirt": "Знак настоящего воина.",
  "description.warrior.pants": "Защитит твои бедра.",
  "description.warrior.helmet": "Иммунитет к стрелам.",
  "description.sunflower.shield":
    "Герой Sunflower Land. Бесплатные Sunflower Seeds!",
  "description.skull.hat": "Редкая шляпа для твоего бампкина.",
  "description.sunflower.statue": "Символ священного токена",
  "description.potato.statue": "Настоящий картофельный барыга",
  "description.christmas.tree": "Получает подарок от Санты на Рождество",
  "description.gnome": "Везучий гном",
  "description.homeless.tent": "Красивая и уютная палатка",
  "description.sunflower.tombstone": "В память о Sunflower Farmers",
  "description.sunflower.rock": "Игра, сломавшая Polygon",
  "description.goblin.crown": "Призывает предводителя гоблинов",
  "description.fountain": "Расслабляющий фонтан для твоей фермы",
  "description.nyon.statue": "В память о Nyon Lann",
  "description.farmer.bath": "Ванна с ароматом свеклы для фермеров",
  "description.woody.Beaver": "Выпадение wood увеличено на 20%",
  "description.apprentice.beaver": "Trees восстанавливаются на 50% быстрее",
  "description.foreman.beaver": "Руби trees без axes",
  "description.egg.basket": "Дает доступ к Easter Egg Hunt",
  "description.mysterious.head": "Статуя, призванная защищать фермеров",
  "description.tunnel.mole": "Дает 25% увеличение к выпадению stone",
  "description.rocky.the.mole": "Дает 25% увеличение к выпадению iron",
  "description.nugget": "Дает 25% увеличение к выпадению gold",
  "description.rock.golem": "Дает 10% шанс на получение 3х stone",
  "description.chef.apron": "Дает дополнительно 20% SFL с продажи тортов",
  "description.chef.hat": "La couronne d'un boulanger légendaire !",
  "description.nancy": "Отгоняет немного ворон. Растения растут на 15% быстрее",
  "description.scarecrow": "Пугало-гоблин. Урожай с растений увеличен на 20%",
  "description.kuebiko":
    "Даже торговец боится этого пугала. Семена теперь бесплатные",
  "description.golden.cauliflower": "Удваивает урожай с cauliflower",
  "description.mysterious.parsnip": "Parsnips растут на 50% быстрее",
  "description.carrot.sword": "Увеличивает шанс на появление растений-мутантов",
  "description.chicken.coop": "Собирает в 2 раза больше eggs",
  "description.farm.cat": "Отгоняет крыс",
  "description.farm.dog": "Паси овец вместе со своим фермерским песиком",
  "description.gold.egg": "Кормит chickens без необходимости wheat",
  "description.easter.bunny": "Получает на 20% больше Carrots",
  "description.rooster": "Удваивает шанс на выпадение курицы-мутанта",
  "description.chicken": "Производит eggs. Нужна wheat для корма",
  "description.cow": "Производит milk. Нужна wheat для корма",
  "description.pig": "Производит manure. Нужна wheat для корма",
  "description.sheep": "Produces wool. Нужна wheat для корма",
  "description.basic.land": "Базовый кусок земли",
  "description.crop.plot": "Пустая грядка для выращивания растений",
  "description.gold.rock": "Добываемый камень для сбора gold",
  "description.iron.rock": "Добываемый камень для сбора iron",
  "description.stone.rock": "Добываемый камень для сбора stone",
  "description.crimstone.rock": "Добываемый камень для сбора crimstone",
  "description.flower.bed": "Пустая клумба для выращивания цветов",
  "description.tree": "Дерево, которое можно срубить для сбора wood",
  "description.fruit.patch": "Пустая лунка для выращивания фруктов",
  "description.boulder":
    "Мифический камень, из которого могут выпасть редкие минералы",
  "description.catch.the.kraken.banner":
    "Кракен здесь! Знак участника в Catch the Kraken сезоне.",
  "description.luminous.lantern": "Яркий бумажный фонарь, освещающий путь.",
  "description.radiance.lantern":
    "Сияющий бумажный фонарь, излучающий мощный свет.",
  "description.ocean.lantern":
    "Волнистый бумажный фонарь, покачивающийся в такт приливу.",
  "description.solar.lantern":
    "Используя яркую силу подсолнухов, Solar Lantern излучает теплое и сияющее свечение.",
  "description.aurora.lantern":
    "Бумажный фонарь, который превращает любое пространство в волшебную страну чудес.",
  "description.dawn.umbrella":
    "С помощью Dawn Umbrella Seat, баклажаны будут сухими даже в дождливые дни.",
  "description.eggplant.grill":
    "Приступай к готовке с Eggplant Grill, который идеально подходит для любой трапезы на открытом воздухе.",
  "description.giant.dawn.mushroom":
    "Giant Dawn Mushroom - величественное и волшебное дополнение к любой ферме.",
  "description.shroom.glow":
    "Освети свою ферму чарующим сиянием от Shroom Glow.",
  "description.clementine":
    "Clementine Gnome - веселый компаньон для твоих фермерских увлечений.",
  "description.blossombeard":
    "Blossombeard Gnome - мощный компаньон для твоих фермерских увлечений.",
  "description.cobalt":
    "Cobalt Gnome добавит красок твоей ферме своей яркой шляпкой.",
  "description.hoot": "Ух-уху-ху! Ты уже разгадал мою загадку?",
  "description.genie.bear": "Именно то, что я хотел!",
  "description.betty.lantern":
    "Это выглядит так реалистично! Интересно, как они это сделали?",
  "description.bumpkin.lantern":
    "Подойдя ближе, ты слышишь шорохи живого бампкина... жуть!",
  "description.eggplant.bear": "Знак щедрого баклажанного кита.",
  "description.goblin.lantern": "Страшный фонарь",
  "description.dawn.flower":
    "Насладись сияющей красотой Dawn Flower, когда его нежные лепестки мерцают при первых лучах солнца",
  "description.kernaldo.bonus": "+25% скорости роста Corn",
  "description.white.crow": "Таинственная и неземная белая ворона",
  "description.sapo.docuras": "Настоящее удовольствие!",
  "description.sapo.travessuras": "Ой-ой...кто-то был непослушным",
  "description.walrus":
    "Благодаря его надежным бивням и любви к глубинам, ты всегда будешь вылавливать дополнительную рыбу.",
  "description.alba":
    "Благодаря её острому чутью, ты будешь вылавливать дополнительную рыбу. 50% шанс на +1 базовую рыбу!",
  "description.knowledge.crab":
    "Knowledge Crab удваивает эффект от Sprout Mix, делая твои посевы такими же богатыми, как морская добыча!",
  "description.anchor":
    "Брось якорь с помощью этой морской драгоценности, которая придает любому месту морской и восхитительный стиль!",
  "description.rubber.ducky":
    "Веселись вместе с этой классической уточкой, которая приподнимает настроение в любом уголке!",
  "description.arcade.token":
    "Токен, получаемый с мини-игр и приключений. Можно обменять на награды.",
  "description.bumpkin.nutcracker": "Праздничная декорация 2023.",
  "description.festive.tree":
    "Праздничное дерево, доступное каждый праздничный сезон. Интересно, достаточно ли она большая, чтобы Санта мог ее увидеть?",
  "description.white.festive.fox":
    "Благословение White Fox обитает на щедрых фермах",
  "description.grinxs.hammer":
    "Волшебный молот от Grinx, легендарного гоблина-кузнеца.",
  "description.angelfish":
    "Водная небесная красавица, украшенная палитрой ярких цветов.",
  "description.halibut":
    "Обитатель океанского дна, мастер маскировки в песчаном камуфляже.",
  "description.parrotFish":
    "Эта рыба, представляющая собой калейдоскоп цветов под волнами, является живым произведением искусства.",
  "description.Farmhand": "Полезный помощник",
  "description.Beehive":
    "Шумный рой, производящий Honey из активно растущих цветов; 10% шанс при сборе Honey вызвать пчелиный рой, который опылит все посевы на +0.2 к урожаю!",
  // Flowers
  "description.red.pansy": "Красная фиалка.",
  "description.yellow.pansy": "Желтая фиалка.",
  "description.purple.pansy": "Фиолетовая фиалка.",
  "description.white.pansy": "Белая фиалка.",
  "description.blue.pansy": "Голубая фиалка.",

  "description.red.cosmos": "Красный космос.",
  "description.yellow.cosmos": "Желтый космос.",
  "description.purple.cosmos": "Фиолетовый космос.",
  "description.white.cosmos": "Белый космос.",
  "description.blue.cosmos": "Голубой космос.",

  "description.red.balloon.flower": "Красный колокольчик.",
  "description.yellow.balloon.flower": "Желтый колокольчик.",
  "description.purple.balloon.flower": "Фиолетовый колокольчик.",
  "description.white.balloon.flower": "Белый колокольчик.",
  "description.blue.balloon.flower": "Голубой колокольчик.",

  "description.red.carnation": "Красная гвоздика.",
  "description.yellow.carnation": "Желтая гвоздика.",
  "description.purple.carnation": "Фиолетовая гвоздика.",
  "description.white.carnation": "Белая гвоздика.",
  "description.blue.carnation": "Голубая гвоздика.",

  "description.humming.bird":
    "Маленькая небесная драгоценность, Humming Bird порхает с красочной грацией.",
  "description.queen.bee":
    "Величественная правительница улья, Queen Bee жужжит с королевской властью.",
  "description.flower.fox":
    "Flower Fox - игривое существо, украшенное лепестками, приносит радость в сад.",
  "description.hungry.caterpillar":
    "Жуя листья, Hungry Caterpillar всегда готов к вкусным приключениям.",
  "description.sunrise.bloom.rug":
    "Встань на Sunrise Bloom Rug, где лепестки танцуют вокруг цветочного рассвета.",
  "description.blossom.royale":
    "Blossom Royale - гигантский цветок в ярких голубых и розовых тонах, величественно цветущий.",
  "description.rainbow":
    "Веселая радуга, соединяющая небо и землю своей разноцветной аркой.",
  "description.enchanted.rose":
    "Enchanted Rose - символ вечной красоты, завораживает своим волшебным очарованием.",
  "description.flower.cart":
    "Flower Cart, наполненная цветами, представляет собой передвижной сад цветочных прелестей.",
  "description.capybara":
    "Capybara - спокойный друг, наслаждающийся ленивыми деньками у берега.",
  "description.prism.petal":
    "Вау! Какой красивый цветок! Думаю, он достоин того, чтобы разместить его на ферме.",
  "description.celestial.frostbloom":
    "Вау! Какой красивый цветок! Думаю, он достоин того, чтобы разместить его на ферме.",
  "description.primula.enigma":
    "Вау! Какой красивый цветок! Думаю, он достоин того, чтобы разместить его на ферме.",

  "description.red.daffodil": "Красный нарцисс.",
  "description.yellow.daffodil": "Желтый нарцисс.",
  "description.purple.daffodil": "Фиолетовый нарцисс.",
  "description.white.daffodil": "Белый нарцисс.",
  "description.blue.daffodil": "Голубой нарцисс.",

  "description.red.lotus": "Красный лотос.",
  "description.yellow.lotus": "Желтый лотос.",
  "description.purple.lotus": "Фиолетовый лотос.",
  "description.white.lotus": "Белый лотос.",
  "description.blue.lotus": "Голубой лотос.",

  // Banners
  "description.goblin.war.banner": "Демонстрирует преданность гоблинскому делу",
  "description.human.war.banner":
    "Демонстрирует преданность человеческому делу",
  "description.earnAllianceBanner": "Баннер специального события",
};

const delivery: Record<Delivery, string> = {
  "delivery.resource": "Хочешь, чтобы я доставил ресурсы?",
  "delivery.feed": "Это не бесплатно, мне надо кормить целое племя!",
  "delivery.fee": "Я возьму с тебя 30% ресурсов для ",
  "delivery.goblin.comm.treasury": "Goblin Community Treasury",
};

const deliveryHelp: Record<DeliveryHelp, string> = {
  "deliveryHelp.pumpkinSoup":
    "Собери ингредиенты и отправляйся на лодке на Pumpkin Plaza, чтобы доставить заказы бампкинам за вознаграждение!",
  "deliveryHelp.hammer":
    "Расширь свою землю, чтобы разблокировать больше слотов + ускорить появление новых заказов",
  "deliveryHelp.axe":
    "Выполняй список дел и найди Hank на Plaza, чтобы забрать свою награду.",
  "deliveryHelp.chest":
    "Строй отношения с бампкинами, завершая различные заказы для разблокировки наград.",
};

const depositWallet: Record<DepositWallet, string> = {
  "deposit.errorLoadingBalances":
    "Произошла ошибка при загрузке твоего баланса.",
  "deposit.yourPersonalWallet": "Твой личный кошелек",
  "deposit.farmWillReceive": "Твоя ферма получит",
  "deposit.depositDidNotArrive": "Депозит не поступил?",
  "deposit.goblinTaxInfo":
    "Когда игроки выводят любое количество SFL, гоблинам платится налог.",
  "deposit.sendToFarm": "Отправить на ферму",
  "deposit.toDepositLevelUp":
    "Для отправки, тебе сначала нужно поднять свой уровень",
  "deposit.level": "3 уровень",
  "deposit.noSflOrCollectibles": "SFL или коллекционные предметы не найдены!",
  "deposit.farmAddress": "Адрес фермы",
  "question.depositSFLItems":
    "Хочешь закинуть Sunflower Land предметы, одежду или токен SFL?",
};

const detail: Record<Detail, string> = {
  "detail.how.item": "Как получить этот предмет?",
  "detail.Claim.Reward": "Забрать награду",
  "detail.basket.empty": "Твоя корзина пуста!",
  "detail.view.item": "Посмотреть предмет на",
};

const discordBonus: Record<DiscordBonus, string> = {
  "discord.bonus.niceHat": "Ого, красивая шляпа!",
  "discord.bonus.attentionEvents":
    "Не забывай следить за специальными событиями и розыгрышами в Discord, чтобы не пропустить их.",
  "discord.bonus.bonusReward": "Бонусная награда",
  "discord.bonus.payAttention":
    "Следи за специальными событиями и розыгрышами в Discord, чтобы не пропустить их.",
  "discord.bonus.enjoyCommunity":
    "Мы надеемся, что тебе нравится быть частью нашего сообщества!",
  "discord.bonus.communityInfo":
    "Ты знал, что в нашем активном Discord сообществе больше 100,000 игроков?",
  "discord.bonus.farmingTips":
    "Если ты ищешь фермерских советов и фишек, то тебе сюда.",
  "discord.bonus.freeGift":
    "И самая лучшая часть...каждый, кто присоединится, получит бесплатный подарок!",
  "discord.bonus.connect": "Подключиться к Discord",
};

const donation: Record<Donation, string> = {
  "donation.one":
    "Это была инициатива от художников нашего сообщества, и они будут очень признательны за пожертвования!",
};

const draftBid: Record<DraftBid, string> = {
  "draftBid.howAuctionWorks": "Как работает аукцион?",
  "draftBid.unsuccessfulParticipants":
    "Проигравшим участникам будут возвращены их ресурсы.",
  "draftBid.termsAndConditions": "Правила и условия",
};

const errorAndAccess: Record<ErrorAndAccess, string> = {
  "errorAndAccess.blocked.betaTestersOnly":
    "Доступ открыт только для бета-тестеров",
  "errorAndAccess.denied.message": "У тебя пока что нет доступа к игре",
  "errorAndAccess.instructions.part1": "Убедись, что ты присоединился к ",
  "errorAndAccess.sflDiscord": "Sunflower Land Discord",
  "errorAndAccess.instructions.part2":
    ", зайди в #verify канал и получи роль 'farmer'.",
  "error.cannotPlaceInside": "Нельзя разместить в помещении",
};

const errorTerms: Record<ErrorTerms, string> = {
  "error.betaTestersOnly": "Только для бета-тестеров!",
  "error.congestion.one":
    "Мы стараемся изо всех сил, но, похоже, у Polygon большой трафик или вы потеряли соединение.",
  "error.congestion.two":
    "Если эта ошибка повторяется, пожалуйста, попробуйте изменить свой Metamask RPC",
  "error.connection.one": "Похоже, нам не удалось выполнить этот запрос.",
  "error.connection.two": "Возможно, это просто проблема с соединением.",
  "error.connection.three": "Вы можете нажать обновить и попробовать снова.",
  "error.connection.four":
    "Если проблема не устранена, вы можете обратиться за помощью в нашу службу поддержки, либо перейти в наш discord и спросить у нашего сообщества",
  "error.diagnostic.info": "Диагностическая информация",
  "error.forbidden.goblinVillage": "Тебе запрещено посещать Goblin Village!",
  "error.multipleDevices.one": "Открыто несколько устройств",
  "error.multipleDevices.two":
    "Пожалуйста, закройте все другие вкладки в браузере или на устройствах, которые вы используете.",
  "error.multipleWallets.one": "Несколько кошельков",
  "error.multipleWallets.two":
    "Похоже, что у вас установлено несколько кошельков. Это может привести к неожиданному поведению. Попробуйте отключить все кошельки, кроме одного.",
  "error.polygonRPC":
    "Пожалуйста, попробуйте еще раз или проверьте настройки вашего Polygon RPC.",
  "error.toManyRequest.one": "Слишков много запросов!",
  "error.toManyRequest.two":
    "Похоже, ты был занят! Пожалуйста, повтори попытку позже.",
  "error.Web3NotFound": "Web3 Not Found",
  "error.wentWrong": "Что-то пошло не так!",
  "error.clock.not.synced": "Часы не синхронизированы",
  "error.polygon.cant.connect": "Не удается подключиться к Polygon",
  "error.composterNotExist": "Компостер не установлен",
  "error.composterNotProducing": "Компостер не работает",
  "error.composterAlreadyDone": "Компост готов",
  "error.composterAlreadyBoosted": "Буст уже применен",
  "error.missingEggs": "Отсутствуют Eggs",
  "error.insufficientSFL": "Недостаточно SFL",
  "error.insufficientCoins": "Недостаточно Coin’ов",
  "error.insufficientSpaceForChickens": "Недостаточно места для chickens",
  "error.dailyAttemptsExhausted": "Ежедневные попытки потрачены",
  "error.missingRod": "Отсутствует rod",
  "error.missingBait": "Отсутствует ",
  "error.alreadyCasted": "Уже заброшена",
  "error.unsupportedChum": " не поддерживаемая насадка",
  "error.insufficientChum": "Недостаточно насадки",
  "error.alr.composter": "Компостер уже полон",
  "error.no.alr.composter": "Компостер не готов к производству",
  "error.missing": "Отсутствуют требуемые материалы",
  "error.no.ready": "Компост еще не готов",
  "error.noprod.composter": "Компостер ничего не производит",
  "error.buildingNotExist": "Строения не существует",
  "error.buildingNotCooking": "В строении ничего не готовится",
  "error.recipeNotReady": "Рецепт не готов",
  "error.npcsNotExist": "NPCs не найдены",
  "error.noDiscoveryAvailable": "No discovery available",
  "error.obsessionAlreadyCompleted": "Эта одержимость уже выполнена",
  "error.collectibleNotInInventory": "У тебя нет требуемого предмета",
  "error.wearableNotInWardrobe": "У тебя нет требуемой одежды",
  "error.requiredBuildingNotExist": "Нужное строение не установлено",
  "error.cookingInProgress": "Приготовление в процессе",
  "error.insufficientIngredient": "Недостаточно ингредиента",
  "error.itemNotExist": "Предмет не найден",
  "error.notEnoughStock": "Не достаточно запасов",
  "error.tooEarly": "Слишком рано",
  "error.tooLate": "Слишком поздно",
  "error.decorationCollides": "Декорации сталкиваются",
  "error.idAlreadyExists": "ID уже есть",
  "error.ClientRPC": "Ошибка клиентского RPC",
};

const exoticShopItems: Record<ExoticShopItems, string> = {
  "exoticShopItems.line1":
    "Наш магазин бобов закрывается, так как наши бобы отправляются в новое путешествие с безумным ученым.",
  "exoticShopItems.line2":
    "Спасибо за то, что был частью нашего сообщества любителей бобов.",
  "exoticShopItems.line3": "С наилучшими пожеланиями,",
  "exoticShopItems.line4": "The Bean Team",
};

const festiveTree: Record<FestiveTree, string> = {
  "festivetree.greedyBumpkin": "Обнаружен жадный бампкин",
  "festivetree.alreadyGifted":
    "Под елкой уже оставили подарок. Подожди до следующего Рождественского праздника.",
  "festivetree.notFestiveSeason": "Сейчас не праздничный сезон. Приходи позже.",
};

const fishDescriptions: Record<FishDescriptions, string> = {
  // Fish
  "description.anchovy.one":
    "Океанический карманный акробат, всегда стремится только вперед!",
  "description.anchovy.two": "Крошечная рыбка, с сильным вкусом!",
  "description.butterflyfish.one":
    "Рыба, ориентирующаяся на моду, демонстрирующая свои яркие и стильные полоски.",
  "description.butterflyfish.two": "Вкус и цвет расплывается во рту!",
  "description.blowfish.one":
    "Круглый, надутый морской комик, который гарантированно вызовет улыбку.",
  "description.blowfish.two": "Ешь с опаской, шипастый сюрприз!",
  "description.clownfish.one":
    "Подводный шут в мандариновом смокинге и с клоунским обаянием.",
  "description.clownfish.two":
    "Никаких шуток, только чистейшее наслаждение вкусом!",
  "description.seabass.one":
    "Твой 'не-такой-интересный' друг с серебристой чешуей - отличный улов!",
  "description.seabass.two": "Основа морской кухни!",
  "description.seahorse.one":
    "Океанический танцор в слоумо, грациозно покачивающийся в водном балете.",
  "description.seahorse.two": "Изысканная, редкая и на удивление вкусная!",
  "description.horsemackerel.one":
    "Спидстер с блестящим покрытием, всегда мчится по волнам.",
  "description.horsemackerel.two": "Галопом по вкусам с каждым укусом!",
  "description.squid.one":
    "Загадка глубин с щупальцами, способными пощекотать твое любопытство.",
  "description.squid.two": "Проложи путь к изысканным вкусам!",
  "description.redsnapper.one":
    "Улов на вес золота, окрашенный в огненно-малиновый цвет.",
  "description.redsnapper.two": "Окунись в богатый и пикантный вкус океана!",
  "description.morayeel.one":
    "Скользкое, зловещее существо, скрывающееся в темных уголках океана. ",
  "description.morayeel.two": "Скользкая, пикантная и сенсационная!",
  "description.oliveflounder.one":
    "Мастер маскировки на морском дне, всегда сливающийся с толпой.",
  "description.oliveflounder.two": "Утопай в богатстве и вкусе!",
  "description.napoleanfish.one":
    "Встречай рыбу с комплексом Наполеона - короткая, но властная!",
  "description.napoleanfish.two": "Преодолей свой голод с помощью этого улова!",
  "description.surgeonfish.one":
    "Океанический неоновый воин, вооруженный острым шипом.",
  "description.surgeonfish.two":
    "Развивай свои вкусовые рецепторы с точностью до мелочей!",
  "description.zebraturkeyfish.one":
    "Полосы, шипы и пикантный вид, эта рыба - настоящее зрелище!",
  "description.zebraturkeyfish.two":
    "Полосатая, колючая и невероятно аппетитная!",
  "description.ray.one":
    "Подводный глайдер, спокойный крылатый красавец, летящий по волнам.",
  "description.ray.two": "Окунись в царство насыщенных вкусов!",
  "description.hammerheadshark.one":
    "Встречай, акула с головой для охоты, и телом для приключений",
  "description.hammerheadshark.two": "Лобовое столкновение со вкусом!",
  "description.tuna.one":
    "Океанический мускулистый спринтер, готовый к финальной гонке!",
  "description.tuna.two": "Титанический вкус в каждом ломтике!",
  "description.mahimahi.one":
    "Рыба, которая верит в красочную жизнь с золотыми плавниками.",
  "description.mahimahi.two": "Двойное название - двойной вкус!",
  "description.bluemarlin.one":
    "Океаническая легенда, марлин, чье отношение к жизни столь же глубоко, как и море.",
  "description.bluemarlin.two": "Утоли свой аппетит этим королевским уловом!",
  "description.oarfish.one":
    "Длинный–предлинный - загадочный океанический странник.",
  "description.oarfish.two": "Проложи себе путь к легендарному вкусу!",
  "description.footballfish.one":
    "MVP глубин, биолюминесцентная звезда, готовая играть!",
  "description.footballfish.two": "Забей вкусовой тачдаун!",
  "description.sunfish.one":
    "Океанический любитель солнца, греющийся в лучах света с высоко поднятыми плавниками.",
  "description.sunfish.two": "Насладись этим аппетитнейшим вкусом!",
  "description.coelacanth.one":
    "Доисторический реликт, относящийся со вкусом к прошлому и настоящему.",
  "description.coelacanth.two":
    "Доисторический вкус, выдержавший испытание временем!",
  "description.whaleshark.one":
    "Бережный гигант из глубин, добывающий сокровища из океанского буфета.",
  "description.whaleshark.two":
    "Огромное лакомство для тех, кто испытывает невероятную тягу к еде!",
  "description.barredknifejaw.one":
    "Океанический преступник с черно-белыми полосами и золотым сердцем.",
  "description.barredknifejaw.two": "Утоли голод резким вкусом!",
  "description.sawshark.one":
    "С похожим на пилу рылом, этот океанический плотник, который всегда на виду!",
  "description.sawshark.two": "Новейший вкус из глубин!",
  "description.whiteshark.one":
    "Акула с убийственной улыбкой, правящая морями!",
  "description.whiteshark.two": "Погрузись в океан захватывающего вкуса!",

  // Marine Marvels
  "description.twilight.anglerfish":
    "Глубоководный удильщик со встроенной лампочкой, прокладывающей путь в темноте.",
  "description.starlight.tuna":
    "Тунец, затмевающий звезды, готов украсить твою коллекцию.",
  "description.radiant.ray":
    "Скат, предпочитающий светиться в темноте с сияющим секретом, которым хочет поделиться.",
  "description.phantom.barracuda":
    "Неуловимая и призрачная глубоководная рыба, скрывающаяся в тенях.",
  "description.gilded.swordfish":
    "Рыба-меч с чешуей, сверкающей, как золото. Лучший улов!",
  "description.crimson.carp": "Редкая и яркая драгоценность весенних вод.",
};

const fishermanModal: Record<FishermanModal, string> = {
  "fishermanModal.attractFish": "Привлеки рыбу, бросив в воду приманку.",
  "fishermanModal.fishBenefits":
    "Рыба отлично подходит для еды, доставки и получения наград!",
  "fishermanModal.baitAndResources":
    "Принеси мне приманку и ресурсы, и мы вытащим редчайшие призы, которые только может предложить океан!",
  "fishermanModal.crazyHappening":
    "Ух ты, происходит что-то безумное......это рыбное безумие!",
  "fishermanModal.bonusFish":
    "Поторопись, за каждый улов ты получишь дополнительную рыбу!",
  "fishermanModal.dailyLimitReached":
    "Ты исчерпал свой суточный лимит в ({{limit}}) уловов",
  "fishermanModal.needCraftRod": "Сперва ты должен изготовить удочку.",
  "fishermanModal.craft.beach": "Craft at Beach",
  "fishermanModal.zero.available": "0 в наличии",
  "fishermanmodal.greeting":
    "Эхой, земляк! Я - {{name}}, твой верный островной рыбак, и я поставил перед собой грандиозную задачу - собрать всю рыбу!",
};

const fishermanQuest: Record<FishermanQuest, string> = {
  "fishermanQuest.Ohno": "О нет! Она сорвалась",
  "fishermanQuest.Newfish": "Новая рыба",
};

const fishingChallengeIntro: Record<FishingChallengeIntro, string> = {
  "fishingChallengeIntro.powerfulCatch": "Тебя ждет мощный улов!",
  "fishingChallengeIntro.useStrength":
    "Используй всю свою силу, чтобы выловить его.",
  "fishingChallengeIntro.stopGreenBar":
    "Останавливай зеленую полоску на рыбе, чтобы добиться успеха.",
  "fishingChallengeIntro.beQuick":
    "Не медли - 3 неудачные попытки, и она сорвется!",
};

const fishingGuide: Record<FishingGuide, string> = {
  "fishingGuide.catch.rod":
    "Изготовь удочку и собери приманку, для того чтобы ловить рыбу.",
  "fishingGuide.bait.earn":
    "Приманку можно собрать с компостера или создать самому.",
  "fishingGuide.eat.fish":
    "Ешь рыбу, чтобы поднять уровень бампкина или выполняй рыбные доставки за вознаграждение.",
  "fishingGuide.discover.fish":
    "Изучай воды для открытия редких рыб, прохождения миссий и разблокировки уникальных наград в кодексе.",
  "fishingGuide.condition":
    "Следи за изменением времени суток и событиями; Некоторые рыбы доступны только при определенных условиях.",
  "fishingGuide.bait.chum":
    "Экспериментируй с разными комбинациями приманок и насадок, чтобы увеличить шанс на ловлю различных видов рыб.",
  "fishingGuide.legendery.fish":
    "Остерегайся легендарных рыб; их ловля требует исключительного мастерства и силы.",
};

const fishingQuests: Record<FishingQuests, string> = {
  "quest.basic.fish": "Вылови каждую базовую рыбу!",
  "quest.advanced.fish": "Вылови каждую продвинутую рыбу!",
  "quest.all.fish": "Открой каждую базовую, продвинутую и экспертную рыбу",
  "quest.300.fish": "Вылови 300 рыб",
  "quest.1500.fish": "Вылови 1500 рыб",
  "quest.marine.marvel": "Вылови каждое морское чудище",
  "quest.5.fish": "Вылови по 5 штук каждой рыбы",
  "quest.sunpetal.savant": "Открой 12 разновидностей с Sunpetal",
  "quest.bloom.bigshot": "Открой 12 разновидностей с Bloom",
  "quest.lily.luminary": "Открой 12 разновидностей с Lily",
};

const flowerBed: Record<FlowerBed, string> = {
  "flowerBedGuide.buySeeds": "Покупай семена в магазине семян.",
  "flowerBedGuide.crossbreedWithCrops":
    "Скрещивай с урожаем и другими цветами, чтобы открыть новые виды цветов.",
  "flowerBedGuide.collectAllSpecies": "Собери все виды цветов в кодексе!",
  "flowerBedGuide.beesProduceHoney":
    "Пчелы производят мед во время роста цветов.",
  "flowerBedGuide.fillUpBeehive":
    "Если собрать мед с заполненного улья, то появится шанс на пчелиный рой.",
  "flowerBedGuide.beeSwarmsBoost":
    "Пчелиные рои дают +0.2 к урожаю любым посевам.",
  "flowerBed.newSpecies.discovered": "Боже мой, ты открыл новый вид цветка!",
  "flowerBedContent.select.combination": "Выбери свою комбинацию",
  "flowerBedContent.select.seed": "Выбери семя",
  "flowerBedContent.select.crossbreed": "Выбери скрещивание",
};

const flowerbreed: Record<Flowerbreed, string> = {
  "flower.breed.sunflower": "Бампкины-ботаники клянутся, что это не цветы.",
  "flower.breed.cauliflower":
    "Не совсем уверен, что скажут об этом бампкины-ботаники.",
  "flower.breed.beetroot": "У него красивый фиолетовый цвет.",
  "flower.breed.parsnip":
    "Пастернак может стать хорошим выбором для скрещивания.",
  "flower.breed.eggplant":
    "У баклажана яркий цвет, возможно, он будет хорошо скрещиваться.",
  "flower.breed.radish": "Вау, этот редис красный!",
  "flower.breed.kale": "Он зеленый, но не такой, как другие зеленые.",
  "flower.breed.blueberry":
    "Эта голубика очень спелая, надеюсь, она не красит.",
  "flower.breed.apple": "Хрустящие яблоки!",
  "flower.breed.banana": "Связка бананов.",
  "flower.breed.redPansy": "Красная фиалка.",
  "flower.breed.yellowPansy": "Желтая фиалка.",
  "flower.breed.purplePansy": "Фиолетовая фиалка.",
  "flower.breed.whitePansy":
    "Белая фиалка. Лишена цвета, я задаюсь вопросом, редкость ли это.",
  "flower.breed.bluePansy": "Голубая фиалка.",
  "flower.breed.redCosmos": "Красный космос.",
  "flower.breed.yellowCosmos": "Желтый космос.",
  "flower.breed.purpleCosmos": "Фиолетовый космос.",
  "flower.breed.whiteCosmos": "Белый космос.",
  "flower.breed.blueCosmos": "Голубой космос. Весьма познавательно.",
  "flower.breed.prismPetal":
    "Крайне редкая мутация, ты уверен, что хочешь скрестить её?",
  "flower.breed.redBalloonFlower":
    "Колокольчики очень красивые. Особенно красные.",
  "flower.breed.yellowBalloonFlower": "Желтый колокольчик.",
  "flower.breed.purpleBalloonFlower": "Фиолетовый колокольчик.",
  "flower.breed.whiteBalloonFlower": "Белый колокольчик. Он редкий.",
  "flower.breed.blueBalloonFlower":
    "Самый обычный колокольчик. Нечем похвастаться.",
  "flower.breed.redDaffodil": "",
  "flower.breed.yellowDaffodil": "",
  "flower.breed.purpleDaffodil": "",
  "flower.breed.whiteDaffodil": "",
  "flower.breed.blueDaffodil": "",
  "flower.breed.celestialFrostbloom":
    "Крайне редкая мутация, ты уверен, что хочешь скрестить её?",
  "flower.breed.redCarnation":
    "Бампкины ценят красную гвоздику за её редкость.",
  "flower.breed.yellowCarnation": "Бампкины не ценят желтую гвоздику.",
  "flower.breed.purpleCarnation":
    "Бампкины ценят фиолетовую гвоздику за её красоту.",
  "flower.breed.whiteCarnation":
    "Бампкины ценят белую гвоздику за её простоту.",
  "flower.breed.blueCarnation":
    "Бампкины ценят голубую гвоздику за её возможность скрещиваться с семенами Bloom.",
  "flower.breed.redLotus": "",
  "flower.breed.yellowLotus": "",
  "flower.breed.purpleLotus": "",
  "flower.breed.whiteLotus": "",
  "flower.breed.blueLotus": "",
  "flower.breed.primulaEnigma":
    "Крайне редкая мутация, ты уверен, что хочешь скрестить её?",
};

const flowerShopTerms: Record<FlowerShopTerms, string> = {
  "flowerShop.desired.dreaming":
    "О, я так давно мечтаю вырастить {{desiredFlowerName}}!",
  "flowerShop.desired.delightful":
    "Как восхитительно было бы иметь {{desiredFlowerName}}!",
  "flowerShop.desired.wonderful":
    "Как прекрасно было бы иметь {{desiredFlowerName}}!",
  "flowerShop.desired.setMyHeart":
    "Я очень сильно хочу вырастить {{desiredFlowerName}}!",
  "flowerShop.missingPages.alas":
    "Но увы! Я потеряла страницы своей книги по скрещиванию! Они должны быть где-то на площади.",
  "flowerShop.missingPages.cantBelieve":
    "Но я не могу поверить, что страницы с моими лучшими рецептами скрещивания цветов пропали. Они должны быть где-то на площади.",
  "flowerShop.missingPages.inABind":
    "Однако я попала в затруднительное положение - страницы, содержащие мои методы скрещивания, похоже, пропали. Они должны быть где-то на площади.",
  "flowerShop.missingPages.sadly":
    "К сожалению, мои записи о скрещивании пропали! Я уверена, что они где-то здесь. Они должны быть где-то на площади.",
  "flowerShop.noFlowers.noTrade":
    "Извини, но сейчас у меня нет цветов для обмена.",
  "flowerShop.do.have.trade":
    "У тебя есть {{desiredFlower}}, которым ты бы мог со мной обменяться?",
  "flowerShop.do.have.trade.one":
    "У тебя есть {{desiredFlower}}, которым ты бы хотел обменяться?",
};

const foodDescriptions: Record<FoodDescriptions, string> = {
  // Fire Pit
  "description.pumpkin.soup": "Кремовый суп, который любят гоблины",
  "description.mashed.potato": "Моя жизнь - картошка.",
  "description.bumpkin.broth":
    "Питательный бульон для восполнения сил твоего бампкина",
  "description.boiled.eggs": "Вареные яйца - отличный вариант для завтрака",
  "description.kale.stew": "Идеальный усилитель бампкина!",
  "description.mushroom.soup": "Согрей душу своему бампкину.",
  "description.reindeer.carrot": "Rudolph не может перестать их есть!",
  "description.kale.omelette": "Полезный завтрак",
  "description.cabbers.mash": "Капуста и картофельное пюре",
  "description.popcorn": "Классическая домашняя хрустящая закуска.",
  "description.gumbo":
    "Кастрюля, полная волшебства! Каждая ложка - это парад Марди Гра!",

  // Kitchen
  "description.roast.veggies": "Даже гоблины должны есть овощи!",
  "description.bumpkin.salad": "Нужно следить за здоровьем своего бампкина!",
  "description.goblins.treat": "Гоблины сходят с ума от этой штуки!",
  "description.cauliflower.burger": "Призываю всех любителей цветной капусты!",
  "description.club.sandwich":
    "С начинкой из моркови и обжаренных семян подсолнуха",
  "description.mushroom.jacket.potatoes": "Запихивайте в них все, что есть!",
  "description.sunflower.crunch":
    "Хрустящая вкуснятина. Старайтесь не обжечься.",
  "description.bumpkin.roast": "Традиционное блюдо бампкинов",
  "description.goblin.brunch": "Традиционное блюдо гоблинов",
  "description.fruit.salad": "Фруктовый салат, вкуснятина",
  "description.bumpkin.ganoush": "Пикантный спред из обжаренных баклажанов.",
  "description.chowder":
    "Морское удовольствие в миске! Ныряйте, там внутри сокровища!",
  "description.pancakes": "Отличное начало дня для бампкина",

  // Bakery
  "description.apple.pie": "Знаменитый рецепт Betty",
  "description.kale.mushroom.pie": "Традиционный рецепт Sapphiron",
  "description.cornbread": "Пышный золотистый фермерский хлеб.",
  "description.sunflower.cake": "Sunflower Cake",
  "description.potato.cake": "Картофельный пирог",
  "description.pumpkin.cake": "Тыквенный пирог",
  "description.carrot.cake": "Carrot Cake",
  "description.cabbage.cake": "Cabbage Cake",
  "description.beetroot.cake": "Beetroot Cake",
  "description.cauliflower.cake": "Cauliflower Cake",
  "description.parsnip.cake": "Parsnip Cake",
  "description.radish.cake": "Radish Cake",
  "description.wheat.cake": "Wheat Cake",
  "description.honey.cake": "Восхитительный торт!",
  "description.eggplant.cake": "Сладкий фермерский десерт-сюрприз.",
  "description.orange.cake": "Orange ты рад, что мы не готовим яблоки?",
  "description.pirate.cake":
    "Отлично подходит для пиратских вечеринок на день рождения.",

  // Deli
  "description.blueberry.jam": "Goblins will do anything for this jam",
  "description.fermented.carrots": "Got a surplus of carrots?",
  "description.sauerkraut": "No more boring Cabbage!",
  "description.fancy.fries": "Fantastic Fries",
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

const garbageCollector: Record<GarbageCollector, string> = {
  "garbageCollector.welcome": "Welcome to my humble shop.",
  "garbageCollector.description":
    "I'm the Garbage Trader, and I'll buy anything you've got - as long as it's garbage.",
};

const gameDescriptions: Record<GameDescriptions, string> = {
  // Quest Items
  "description.goblin.key": "The Goblin Key",
  "description.sunflower.key": "The Sunflower Key",
  "description.ancient.goblin.sword": "An Ancient Goblin Sword",
  "description.ancient.human.warhammer": "An Ancient Human Warhammer",

  // Coupons
  "description.community.coin":
    "A valued coin that can be exchanged for rewards",
  "description.bud.seedling": "A seedling to be exchanged for a free Bud NFT",
  "description.gold.pass":
    "An exclusive pass that enables the holder to craft rare NFTs, trade, withdraw and access bonus content.",
  "description.rapid.growth": "Apply to a crop to grow twice as fast",
  "description.bud.ticket":
    "A guaranteed spot to mint a Bud at the Sunflower Land Buds NFT drop.",
  "description.potion.ticket":
    "A reward from the Potion House. Use this to buy items from Garth.",
  "description.trading.ticket": "Free Trades! Woohoo!",
  "description.block.buck": "A valuable token in Sunflower Land!",
  "description.beta.pass": "Gain early access to features for testing.",
  "description.war.bond": "A mark of a true warrior",
  "description.allegiance": "A display of allegiance",
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
  "description.arcade.coin":
    "A token earned from mini-games and adventures. Can be exchanged for rewards.",
  "description.farmhand.coupon":
    "A coupon to exchange for a farm hand of your choice.",
  "description.farmhand": "An adopted Bumpkin on your farm",
  "description.tulip.bulb": "A ticket used during the Spring Blossom",
  "description.treasure.key": "Visit the plaza to unlock your reward",
  "description.rare.key": "Visit the beach to unlock your reward",
  "description.luxury.key":
    "Visit the plaza near woodlands to unlock your reward",
  "description.prizeTicket": "A ticket to enter the prize giveaways",
  "description.babyPanda":
    "A cute panda from the Gas Hero event. Double experience for beginners during March.",
  "description.baozi": "A delicious treat from the Lunar New Year event.",
  "description.communityEgg": "Wow, you must really care about the community!",
  "description.hungryHare":
    "This ravenous rabbit hops through your farm. A special event item from Easter 2024",

  // Easter Items
  "description.egg.basket": "Easter Event",
  "description.blue.egg": "A blue easter egg",
  "description.orange.egg": "An orange easter egg",
  "description.green.egg": "A green easter egg",
  "description.yellow.egg": "A yellow easter egg",
  "description.red.egg": "A red easter egg",
  "description.pink.egg": "A pink easter egg",
  "description.purple.egg": "A purple easter egg",

  //Home
  "description.homeOwnerPainting": "A painting of the owner of this home.",
};

const gameTerms: Record<GameTerms, string> = {
  "auction.winner": "Auction Winner!",
  "bumpkin.level": "Bumpkin level",
  bumpkinBuzz: "Bumpkin Buzz",
  dailyLim: "Daily SFL Limit",
  "farm.banned": "This farm is banned",
  gobSwarm: "Goblin Swarm!",
  "granting.wish": "Granting your wish",
  "new.delivery.in": "New deliveries available in",
  "new.delivery.levelup": "Level up to unlock more deliveries.",
  "no.sfl": "No SFL tokens found",
  opensea: "OpenSea",
  polygonscan: "PolygonScan",
  potions: "Potions",
  "proof.of.humanity": "Proof of Humanity",
  sflDiscord: "Sunflower Land Discord Server",
  "in.progress": "In Progress",
  "compost.complete": "Compost complete",
  "aoe.locked": "AOE Locked",
  sunflowerLandCodex: "Sunflower Land Codex",
};

const genieLamp: Record<GenieLamp, string> = {
  "genieLamp.ready.wish": "Ready to make a wish?",
  "genieLamp.cannotWithdraw":
    "You cannot withdraw the lamp once it has been rubbed",
};

const getContent: Record<GetContent, string> = {
  "getContent.error": "Error!",
  "getContent.joining": "Joining",
  "getContent.accessGranted":
    "You now have access. Go check out the channel in Discord",
  "getContent.connectToDiscord":
    "You must be connected to Discord to join a restricted channel.",
  "getContent.connect": "Connect",
  "getContent.getAccess": "Get access to restricted groups on Discord",
  "getContent.requires": "Requires a",
  "getContent.join": "Join",
};

const getInputErrorMessage: Record<GetInputErrorMessage, string> = {
  "getInputErrorMessage.place.bid": "Are you sure you want to place this bid?",
  "getInputErrorMessage.cannot.bid":
    "Bids cannot be changed once they have been placed.",
};

const goblin_messages: Record<GOBLIN_MESSAGES, string> = {
  "goblinMessages.msg1": "Hey you! Human! Bring me some food or else...",
  "goblinMessages.msg2": "I'm always hungry, got any tasty treats for me?",
  "goblinMessages.msg3": "I don't care what it is, just give me food!",
  "goblinMessages.msg4":
    "If you don't give me something to eat, I might have to start nibbling on you.",
  "goblinMessages.msg5": "I heard human food is the best, bring me some!",
  "goblinMessages.msg6": "Hey, you got any food that won't make me sick?",
  "goblinMessages.msg7":
    "I'm getting a bit bored of eating the same thing, got anything different?",
  "goblinMessages.msg8": "I'm hungry for something new, got anything exotic?",
  "goblinMessages.msg9":
    "Hey there, got any snacks to spare? I promise I won't steal them...maybe.",
  "goblinMessages.msg10": "I don't care what it is, just give me food!",
};

const goldpassModal: Record<GoldPassModal, string> = {
  "goldPass.unlockPower": "Unlock the power of the Gold Pass",
  "goldPass.craftNFTs": "Craft rare NFTs",
  "goldPass.trade": "Trade with other players",
  "goldPass.participateAuction": "Participate in Auction Drops",
  "goldPass.withdrawTransferNFTs": "Withdraw & Transfer NFTs",
  "goldPass.accessRestrictedAreas": "Access to restricted areas",
  "common.noThanks": "Нет, спасибо",
  "goldPass.buyNow": "Buy now $",
  "goldPass.priceInMatic": "Price is paid in $MATIC equivalent of $",
};

const goldTooth: Record<GoldTooth, string> = {
  "goldTooth.intro.part1":
    "Arrr, me hearties! The treasure-diggin' area be teemin' with wealth and adventure, and it be openin' its gates soon for ye daring farmers!",
  "goldTooth.intro.part2":
    "Be ready to join me crew, for the hunt for riches begins shortly!",
};

const guideCompost: Record<GuideCompost, string> = {
  "guide.compost.add.eggs.speed": "Add eggs to speed up production",
  "guide.compost.add.eggs": "Add Eggs",
  "guide.compost.eggs": "Eggs",
  "guide.compost.cropGrowthTime": "-50% Crop Growth Time",
  "guide.compost.fishingBait": "Fishing bait",
  "guide.compost.placeCrops": "Place crops in the composter to feed the worms",
  "guide.compost.compostCycle":
    "A compost cycle produces multiple fertilisers which can be used to boost your crops & fruit",
  "guide.compost.yieldsWorms":
    "Each compost yields worms that can be used as bait for fishing",
  "guide.compost.useEggs":
    "Tired of waiting? Use Eggs to speed up the compost production",
};

const guideTerms: Record<GuideTerms, string> = {
  "guide.intro":
    "От скромных начинаний до экспертного фермерства, этот гайд ответит на все твои вопросы!",
  "gathering.guide.one":
    "Чтобы преуспеть в Sunflower Land, необходимо овладеть искусством сбора ресурсов. Начни с создания инструментов для сбора различных ресурсов. Используй надежный топор, чтобы срубить деревья и добыть древесину. Чтобы создать инструменты, посети местный верстак и обменяй SFL/ресурсы на нужный инструмент.",
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
    "In Sunflower Land, crafting NFTs is a crucial aspect of boosting your farming output and accelerating your progress. These special items provide various bonuses, such as crop growth boosts, cooking enhancements, and resource boosts, which can greatly expedite your journey. By maximizing your SFL (Sunflower Token:  you can craft tools, gather resources, and expand your land to further establish your farming empire.",
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
  "deliveries.intro":
    "Travel to different islands and deliver goods to earn rewards.",
  "deliveries.new": "New delivery",
  "chores.intro":
    "Complete tasks around the farm to earn rewards from Bumpkins.",
  "scavenger.guide.one":
    "Scavenging in Sunflower Land offers exciting opportunities to uncover hidden treasures and gather valuable resources. The first aspect of scavenging is digging for treasure on Treasure Island, where you can become a pirate treasure hunter. By crafting a sand shovel and venturing to Treasure Island, you can dig in dark sandy areas to uncover a variety of treasures, including bounty, decorations, and even ancient SFTs with utility.",
  "scavenger.guide.two":
    "Another form of scavenging involves gathering wild mushrooms that appear spontaneously on your farm and surrounding islands. These mushrooms can be collected for free and used in recipes, quests, and crafting items. Keep an eye out for these mushrooms, as they replenish every 16 hours, with a maximum limit of 5 mushrooms on your farm. If your land is full, mushrooms will appear on the surrounding islands, ensuring you don't miss out on these valuable resources.",

  "fruit.guide.one":
    "В Sunflower Land фрукты играют роль ценного ресурса, который можно продать за SFL или использовать в различных рецептах и крафтах. В отличие от урожая, фруктовые лунки обладают уникальной способностью неоднократно восстанавливаться после сбора, обеспечивая игрокам надежный источник фруктов.",
  "fruit.guide.two":
    "Чтобы выращивать фрукты, тебе сначала нужно получить фруктовые лунки, которые появятся на 9 или 10 расширении твоей фермы.",
  "fruit.guide.three":
    "Путем выращивания фруктов и использования их в своей фермерской стратегии, ты сможешь значительно увеличить свою прибыль, создать вкусные рецепты и открыть для себя новые возможности в Sunflower Land.",

  "seasons.guide.one":
    "Seasons in Sunflower Land bring excitement and freshness to the game, offering players new challenges and opportunities. With the introduction of each season, players can look forward to a variety of new craftable items, limited edition decorations, mutant animals, and rare treasures. These seasonal changes create a dynamic and evolving gameplay experience, encouraging players to adapt their strategies and explore new possibilities on their farms. Additionally, seasonal tickets add a strategic element to the game, as players must decide how to allocate their tickets wisely, whether it's collecting rare items, opting for higher supply decorations, or exchanging tickets for SFL. The seasonal mechanic keeps the game engaging and ensures that there's always something to look forward to in Sunflower Land.",
  "seasons.guide.two":
    "The availability of seasonal items at the Goblin Blacksmith adds another layer of excitement. Players must gather the required resources and seasonal tickets to craft these limited-supply items, creating a sense of competition and urgency. Planning ahead and strategizing become crucial as players aim to secure their desired items before the supply runs out. Moreover, the option to swap seasonal tickets for SFL provides flexibility and allows players to make choices that align with their specific gameplay goals. With each season's unique offerings and the anticipation of surprise events, Sunflower Land keeps players engaged and entertained throughout the year, fostering a vibrant and ever-evolving farming experience.",
  "pete.teaser.one": "Chop the trees",
  "pete.teaser.three": "Harvest the Sunflowers",
  "pete.teaser.four": "Sell the Sunflowers",
  "pete.teaser.five": "Buy Seeds",
  "pete.teaser.six": "Plant Seeds",
  "pete.teaser.seven": "Craft a Scarecrow",
  "pete.teaser.eight": "Cook food and level up",
};

const halveningCountdown: Record<HalveningCountdown, string> = {
  "halveningCountdown.approaching": "Халвинг приближается!",
  "halveningCountdown.description":
    "Во время халвинга все цены на урожай и некоторые ресурсы снижаются вдвое. Это затрудняет получение SFL.",
  "halveningCountdown.preparation": "Убедись, что ты подготовился!",
  "halveningCountdown.title": "Халвинг!",
};

const harvestflower: Record<Harvestflower, string> = {
  "harvestflower.noFlowerBed": "Цветочная клумба отсутствует",
  "harvestflower.noFlower": "На клумбе нет цветка",
  "harvestflower.notReady": "Цветок не готов к сбору",
  "harvestflower.alr.plant": "Цветок уже посажен",
};

const harvestBeeHive: Record<HarvestBeeHive, string> = {
  "harvestBeeHive.notPlaced": "Этот улей не установлен.",
  "harvestBeeHive.noHoney": "В этом улье нет мёда.",
};

const hayseedHankPlaza: Record<HayseedHankPlaza, string> = {
  "hayseedHankPlaza.cannotCompleteChore": "Не можешь выполнить это задание?",
  "hayseedHankPlaza.skipChore": "Пропустить задание",
  "hayseedHankPlaza.canSkipIn": "Ты сможешь пропустить это задание через",
  "hayseedHankPlaza.wellDone": "Отличная работа",
  "hayseedHankPlaza.lendAHand": "Помочь?",
};

const hayseedHankV2: Record<HayseedHankV2, string> = {
  "hayseedHankv2.dialog1":
    "Ну здравствуй, малец! Я - Hayseed Hank, опытный фермер, ухаживающий за землей как в старые добрые времена.",
  "hayseedHankv2.dialog2":
    "Однако мои кости уже не те, что прежде. Если ты поможешь мне с повседневными делами, я вознагражу тебя ",
  "hayseedHankv2.action": "Приступим",
  "hayseedHankv2.title": "Ежедневные дела",
  "hayseedHankv2.newChoresAvailable": "Новые дела будут доступны через ",
  "hayseedHankv2.skipChores": "Можно пропускать задания каждый новый день",
  "hayseedHankv2.greeting": "Ну здравствуй, малец! Я - Hayseed Hank...",
};

const heliosSunflower: Record<HeliosSunflower, string> = {
  "heliosSunflower.title": "Clytie the Sunflower",
  "heliosSunflower.description":
    "Только истинный спаситель может вернуться и собрать урожай этого Подсолнуха.",
  "confirmation.craft": "Ты уверен, что хочешь создать",
};

const helper: Record<Helper, string> = {
  "helper.highScore1": "Невероятно! Ты осваиваешь искусство зельеварения!",
  "helper.highScore2": "Великолепно! Благодаря твоим навыкам растение оживает!",
  "helper.highScore3": "Потрясающе! Растение в восторге от твоего мастерства!",
  "helper.midScore1": "Почти! Твоё зелье положительно повлияло на растение!",
  "helper.midScore2":
    "Так держать! Растение начинает процветать благодаря твоему мастерству!",
  "helper.midScore3":
    "Хорошо! Твое зелье начинает оказывать волшебное действие на растение!",
  "helper.lowScore1": "Продолжаем. Растение подает признаки счастья.",
  "helper.lowScore2":
    "Хорошая работа. Твое зелье принесло растению немного радости.",
  "helper.lowScore3":
    "Неплохо. Твои навыки начинают производить хорошее впечатление на растение.",
  "helper.veryLowScore1":
    "Продолжай пробовать. Растение оценит твою целеустремленность.",
  "helper.veryLowScore2": "Ты на верном пути. Растение видит твои успехи.",
  "helper.veryLowScore3":
    "Не совсем так, но растение чувствует твое стремление.",
  "helper.noScore1":
    "О нет! Растению что-то не понравилось в твоем зелье! Попробуй еще раз.",
  "helper.noScore2":
    "Упс! Растение плохо отреагировало на что-то в твоем зелье! Попробуй еще раз.",
  "helper.noScore3":
    "Ой-ой! Что-то в твоем зелье совершенно не подходит для растения! Попробуй еще раз.",
};

const henHouseTerms: Record<HenHouseTerms, string> = {
  "henHouse.chickens": "Куры",
  "henHouse.text.one": "Корми пшеницей и собирай яйца",
  "henHouse.text.two": "Ленивая курица",
  "henHouse.text.three":
    "Заставь свою курицу работать, чтобы начать собирать яйца!",
  "henHouse.text.four": "Работающая курица",
  "henHouse.text.five": "Уже размещены и усердно трудятся!",
  "henHouse.text.six":
    "Построй дополнительный курятник, чтобы разводить больше кур",
};

const howToFarm: Record<HowToFarm, string> = {
  "howToFarm.title": "Как заниматься фермерством?",
  "howToFarm.stepOne": "1.Собирай урожай, когда он готов",
  "howToFarm.stepTwo": "2.Посети город и нажми на магазин",
  "howToFarm.stepThree": "3.Продай урожай в магазине за SFL",
  "howToFarm.stepFour": "4.Покупай семена, используя SFL",
  "howToFarm.stepFive": "5. Посади семена и жди",
};

const howToSync: Record<HowToSync, string> = {
  "howToSync.title": "Как синхронизироваться?",
  "howToSync.description":
    "Весь твой прогресс сохраняется на нашем игровом сервере. Тебе нужно будет синхронизироваться по chain, когда ты захочешь перенести свои токены, NFT и ресурсы на Polygon.",
  "howToSync.stepOne": "1. Открой меню",
  "howToSync.stepTwo": '2. Нажми "Sync on chain".',
};

const howToUpgrade: Record<HowToUpgrade, string> = {
  "howToUpgrade.title": "Как улучшиться?",
  "howToUpgrade.stepOne": "1. Поговори с гоблином, перекрывающим поля",
  "howToUpgrade.stepTwo": "2.Посети город и открой кухню",
  "howToUpgrade.stepThree": "3. Приготовь еду, которую хочет гоблин.",
  "howToUpgrade.stepFour":
    "4. Вуаля! Наслаждайся своими новыми грядками и урожаем",
};

const islandupgrade: Record<Islandupgrade, string> = {
  "islandupgrade.confirmUpgrade":
    "Ты уверен, что хочешь перейти на новый остров?",
  "islandupgrade.warning":
    "Убедись, что у тебя нет урожая, фруктов, зданий или кур в процессе работы. Они будут возвращены в твой инвентарь.",
  "islandupgrade.upgradeIsland": "Улучшить остров",
  "islandupgrade.newOpportunities":
    "Тебя ждет экзотический остров с новыми ресурсами и возможностями для развития твоей фермы.",
  "islandupgrade.confirmation":
    "Хочешь сделать апгрейд? Ты начнешь на маленьком острове со всеми своими предметами.",
  "islandupgrade.locked": "Заблокировано",
  "islandupgrade.exploring": "Исследование",
  "islandupgrade.welcomePetalParadise": "Добро пожаловать в Лепестковый рай!",
  "islandupgrade.itemsReturned":
    "Твои предметы были благополучно возвращены в твой инвентарь.",
  "islandupgrade.notReadyExpandMore":
    "You are not ready. Expand {{remainingExpansions}} more time",
  "islandupgrade.exoticResourcesDescription":
    "Этот район Страны подсолнухов известен своими экзотическими ресурсами. Расширяйте свои земли, чтобы обнаружить фрукты, цветы, пчелиные ульи и редкие минералы!",
};

const interactableModals: Record<InteractableModals, string> = {
  "interactableModals.returnhome.message": "Ты хотел бы вернуться домой?",
  "interactableModals.fatChicken.message":
    "Почему эти бампкины не оставят меня в покое, я просто хочу отдохнуть.",
  "interactableModals.lazyBud.message": "Ииип! Так устал.....",
  "interactableModals.bud.message":
    "Хммм, я лучше оставлю его в покое. Уверен, его хозяин ищет его.",
  "interactableModals.walrus.message":
    "Арррррррррр! Рыбный магазин не откроется, пока я не получу свою рыбу.",
  "interactableModals.plazaBlueBook.message1":
    "Чтобы призвать искателей, мы должны собрать сущность земли - тыквы, вскормленные землей, и яйца, обещающие новое начало.",
  "interactableModals.plazaBlueBook.message2":
    "Когда наступают сумерки и луна отбрасывает свой серебристый отблеск, мы преподносим свои скромные дары, надеясь вновь пробудить их бдительный взор.",
  "interactableModals.plazaOrangeBook.message1":
    "Наши храбрые защитники доблестно сражались, но, увы, мы проиграли великую войну, и Лунные Искатели изгнали нас с родной земли. И все же мы не теряем надежды, ведь однажды мы вернем себе то, что когда-то было нашим.",
  "interactableModals.plazaOrangeBook.message2":
    "До тех пор мы будем хранить Sunflower Land в наших сердцах и мечтах, ожидая дня нашего триумфального возвращения.",
  "interactableModals.beachGreenBook.message1":
    "Когда вы охотитесь за желанными Red Snappers, попробуйте применить неожиданный способ.",
  "interactableModals.beachGreenBook.message2":
    "Используйте яблоки с приманкой Red Wiggler и наблюдайте, как эти малиновые красавцы практически прыгают в вашу сеть.",
  "interactableModals.beachBlueBook.message1":
    'Не говорите Shelly, но я пытаюсь привезти "Saw Sharks" на пляж!',
  "interactableModals.beachBlueBook.message2":
    "В последнее время я экспериментирую с различными приманками, но единственная, которая, похоже, работает, - это Red Snapper.",
  "interactableModals.beachBlueBook.message3":
    "Эти океанские охотники чуют пиршество Red Snappers за много миль, так что не удивляйтесь, если они приплывут.",
  "interactableModals.beachOrangeBook.message1":
    "На поверхности появился сияющий плавник, я не мог поверить своим глазам!",
  "interactableModals.beachOrangeBook.message2":
    "К счастью, Tango был со мной, должно быть, он мой талисман удачи..",
  "interactableModals.plazaGreenBook.message1":
    "Эти острова находятся под контролем бампкинов, а у нас, гоблинов, мало работы и еще меньше еды.",
  "interactableModals.plazaGreenBook.message2":
    "Мы стремимся к равенству, к месту, которое можно назвать своим, где мы можем жить и процветать.",
  "interactableModals.fanArt.winner": "Fan art winner",
  "interactableModals.fanArt1.message":
    "Поздравляем Palisman, победителя первого конкурса фан-арта",
  "interactableModals.fanArt2.message":
    "Поздравляем Vergelsxtn, победитель конкурса фан-арта Dawn Breaker Party",
  "interactableModals.fanArt2.linkLabel": "Подробнее",
  "interactableModals.fanArt3.message":
    "Идеальное место для прекрасной картины. Интересно, что они поставят здесь в следующий раз...",
  "interactableModals.clubhouseReward.message1":
    "Терпение, дружище, вознаграждение придет...",
  "interactableModals.clubhouseReward.message2":
    "Join #bud-clubhouse on Discord for latest updates.",
  "interactableModals.plazaStatue.message":
    "В честь Бампкина Храброго Сердца, стойкого фермера, который сплотил наш город против орды гоблинов в темные дни древней войны.",
  "interactableModals.dawnBook1.message1":
    "На протяжении веков наша семья защищала остров Dawn Breaker. Как звонарь острова, мы предупреждали об опасностях с севера, даже когда теневые существа угрожали нашему дому.",
  "interactableModals.dawnBook1.message2":
    "Наша семья стоит на первой линии обороны от тьмы, распространяющейся с севера, но, увы, наши жертвы остаются незамеченными.",
  "interactableModals.dawnBook1.message3":
    "Настанет ли день, когда наша преданность будет признана?",
  "interactableModals.dawnBook2.message1":
    "Баклажаны - это нечто большее, чем кажется. Несмотря на свою темную внешность, привлекающую теневых существ, они привносят свет в наши блюда.",
  "interactableModals.dawnBook2.message2":
    'Приготовленные на гриле или в виде пюре в "Бампкин гануш", они обладают непревзойденной универсальностью. Овощи семейства пасленовых - символ нашей стойкости перед лицом невзгод.',
  "interactableModals.dawnBook3.message1":
    "Дорогой дневник, приезд бампкинов принес луч надежды.",
  "interactableModals.dawnBook3.message2":
    "Я мечтаю о том дне, когда смогу направить свою собственную лодку в Sunfloria - страну, где собираются искатели приключений и путешественники.",
  "interactableModals.dawnBook3.message3":
    "Я слышал, как там шепчутся об особых приготовлениях бампкинов - маяк надежды в эти трудные времена.",
  "interactableModals.dawnBook4.message1":
    "Гномы - их очарование было слишком сильным, чтобы перед ним устоять.",
  "interactableModals.dawnBook4.message2":
    'В голове эхом отдавались наставления колдуньи: "Соедини три, и сила будет твоей".',
  "interactableModals.dawnBook4.message3":
    "Увы, даже баклажанные солдаты не смогли устоять перед соблазном. Но я не дрогну. Однажды я получу власть, которую заслужил по праву?",
  "interactableModals.timmyHome.message":
    "О, Боже, я очень хочу, чтобы ты исследовал мой дом, но мама сказала мне не разговаривать с незнакомцами, может, это и к лучшему.",
  "interactableModals.windmill.message":
    "А, моя ветряная мельница в ремонте, не могу допустить, чтобы кто-то подглядывал, пока я ее починю, приходите позже.",
  "interactableModals.igorHome.message":
    "Проваливай! Я не в настроении принимать гостей, особенно таких любопытных, как ты!",
  "interactableModals.potionHouse.message1":
    "Осторожно, друг, там живет сумасшедший ученый!",
  "interactableModals.potionHouse.message2":
    "Ходят слухи, что они ищут подмастерьев, чтобы вместе с ними выращивать урожай мутантов.",
  "interactableModals.guildHouse.message":
    "Погоди, бампкин! Тебе нужен Bud, если ты хочешь войти в дом гильдии.",
  "interactableModals.guildHouse.budsCollection": "Buds Collection on Opensea",
  "interactableModals.bettyHome.message":
    "О, милая, как бы я ни любила свой урожай, мой дом - это личное пространство, сейчас он не открыт для посетителей.",
  "interactableModals.bertHome.message":
    "Нарушители! Они, должно быть, хотят заполучить мою коллекцию редких предметов и секретов, но я не могу их впустить!",
  "interactableModals.beach.message1": "Вы были на пляже?",
  "interactableModals.beach.message2":
    "Ходят слухи, что он наполнен роскошными сокровищами! К сожалению, он находится в стадии строительства.",
  "interactableModals.castle.message":
    "Постой, крестьянин! Я ни за что не позволю тебе посетить замок.",
  "interactableModals.woodlands.message":
    "Отправляетесь в путешествие в лес? Не забудьте собрать вкусные грибы!",
  "interactableModals.port.message":
    "Стоять! Гоблины все еще строят порт. Скоро он будет готов для путешествий и рыбалки.",
};

const introPage: Record<IntroPage, string> = {
  "introPage.welcome": "Welcome to the Potion Room, my curious apprentice!",
  "introPage.description":
    "I am Mad Scientist Bumpkin, here to assist you on this magical quest into the world of botanic sorcery. Get ready to uncover the secrets of Sunflower Land! Each attempt will cost 1 SFL.",
  "introPage.mission":
    "Your mission: decipher the right combination of potions within the enchanted grid.",
  "introPage.tip":
    "Remember, the more correct potions you select, the happier the plant will be, increasing your chances of rare drops!",
  "introPage.chaosPotion": "Beware the 'chaos' potion, it shakes things up!",
  "introPage.playButton": "Let's play",
};

const islandName: Record<IslandName, string> = {
  "island.home": "Home",
  "island.pumpkin.plaza": "Pumpkin Plaza",
  "island.beach": "Beach",
  "island.woodlands": "Woodlands",
  "island.helios": "Helios",
  "island.goblin.retreat": "Goblin Retreat",
};

const islandNotFound: Record<IslandNotFound, string> = {
  "islandNotFound.message": "You have landed in the middle of nowhere!",
  "islandNotFound.takeMeHome": "Take me home",
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
  "landscape.expansion.date":
    "More expansions will be available on the 7th February.",
  "landscape.great.work": "Great work Bumpkin!",
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

const letsGo: Record<LetsGo, string> = {
  "letsGo.title": "Time to play!",
  "letsGo.description":
    "Thanks for playing beta! We are still working on the game and appreciate your support during the early stages!",
  "letsGo.readMore": "You can read more about the game in the ",
  "letsGo.officialDocs": "official docs",
};

const loser: Record<Loser, string> = {
  "loser.unsuccess": "You were unsuccessful",
  "loser.longer": "Auction no longer exists",
  "loser.refund.one": "Refund",
};

const lostSunflorian: Record<LostSunflorian, string> = {
  "lostSunflorian.line1": "My father sent me here to rule over Helios.",
  "lostSunflorian.line2":
    "Unfortunately, these Bumpkins don't like me watching them.",
  "lostSunflorian.line3": "I can't wait to return to Sunfloria.",
};

const megaStore: Record<MegaStore, string> = {
  "megaStore.message":
    "Welcome to the Mega Store! Check out this month's limited items. If you like something, be sure to grab it before it vanishes into the realms of time.",
  "megaStore.month.sale": "This month's sales",
  "megaStore.wearable":
    "Nice buy! Your new wearable is safely stored in your wardrobe. You can equip it to a bumpkin from there.",
  "megaStore.collectible":
    "Nice buy! Your new collectible is safely stored in your inventory.",
  "megaStore.timeRemaining": "{{timeRemaining}} left!",
};

const modalDescription: Record<ModalDescription, string> = {
  "modalDescription.friend": "Hey there friend!",
  "modalDescription.love.fruit":
    "Wow, you really do love Fruits as much as I do!",
  "modalDescription.gift":
    "I have no more gifts for you. Don't forget to wear your new items!",
  "modalDescription.limited.abilities":
    "I've been designing limited edition wearables that can enhance your fruit picking abilities",
  "modalDescription.trail":
    "I am looking for dedicated fruit pickers to trial this clothing....for FREE!",
};

const noaccount: Record<Noaccount, string> = {
  "noaccount.newFarmer": "New Farmer",
  "noaccount.addPromoCode": "Add a promo code?",
  "noaccount.alreadyHaveNFTFarm": "Already have an NFT farm?",
  "noaccount.createFarm": "Create Farm",
  "noaccount.noFarmNFTs": "You do not own any farm NFTs.",
  "noaccount.createNewFarm": "Create new farm",
  "noaccount.selectNFTID": "Select your NFT ID",
  "noaccount.welcomeMessage":
    "Welcome to Sunflower Land. It looks like you don't have a farm yet.",
  "noaccount.promoCodeLabel": "Promo Code",
};

const noBumpkin: Record<NoBumpkin, string> = {
  "noBumpkin.readyToFarm": "Awesome, your Bumpkin is ready to farm!",
  "noBumpkin.play": "Play",
  "noBumpkin.missingBumpkin": "You are missing your Bumpkin",
  "noBumpkin.bumpkinNFT":
    "A Bumpkin is an NFT that is minted on the Blockchain.",
  "noBumpkin.bumpkinHelp":
    "You need a Bumpkin to help you plant, harvest, chop, mine and expand your land.",
  "noBumpkin.mintBumpkin": "You can get a Bumpkin from OpenSea",
  "noBumpkin.allBumpkins": "Wow, look at all those Bumpkins!",
  "noBumpkin.chooseBumpkin": "Which Bumpkin would you like to play with?",
  "noBumpkin.deposit": "Deposit",
  "noBumpkin.advancedIsland":
    "This is an advanced island. A strong Bumpkin is required",
  "weakBumpkin.notStrong":
    "Oh no! Your Bumpkin is not strong enough for this island.",
  "dequipper.noBumpkins": "No Bumpkins",
  "dequipper.missingBumpkins":
    "You do not have any Bumpkin NFTs in your wallet.",
  "dequipper.intro": "Send clothing from a Bumpkin to your wallet.",
  "dequipper.success":
    "Congratulations, the wearables have been sent to your wallet. Deposit them to your farm to use them.",
  "dequipper.dequip": "Dequip",
  "dequipper.warning": "Once a Bumpkin is dequipped, it can no longer be used.",
  "dequipper.nude": "Bumpkin is already dequipped",
  "noBumpkin.nude": "Cannot dequip an empty Bumpkin",
};

const noTownCenter: Record<NoTownCenter, string> = {
  "noTownCenter.reward": "Reward: 1 x Town Center!",
  "noTownCenter.news": "Your latest news or statement here.",
  "noTownCenter.townCenterPlacement":
    "You can place the Town Center through the inventory > building section",
};

const notOnDiscordServer: Record<NotOnDiscordServer, string> = {
  "notOnDiscordServer.intro":
    "Looks like you haven't joined the Sunflower Land Discord Server yet.",
  "notOnDiscordServer.joinDiscord": "Join our ",
  "notOnDiscordServer.discordServer": "Discord Server",
  "notOnDiscordServer.completeVerification":
    "2. Complete verification & get started",
  "notOnDiscordServer.acceptRules": "3. Accept the rules in #rules",
};

const npc_message: Record<NPC_MESSAGE, string> = {
  // Betty
  "npcMessages.betty.msg1":
    "Oh boy, I can't wait to get my hands on some fresh produce!",
  "npcMessages.betty.msg2":
    "I'm so excited to try out some new crops, what have you got for me?",
  "npcMessages.betty.msg3":
    "I've been waiting all day for a chance to harvest some delicious fruits!",
  "npcMessages.betty.msg4":
    "I'm eager to see what kind of crops are ready for harvesting today.",
  "npcMessages.betty.msg5":
    "I can't wait to taste the fruits of my labor, what kind of produce do you have?",
  "npcMessages.betty.msg6":
    "I've got a real passion for farming, and I'm always looking for new and interesting crops to grow.",
  "npcMessages.betty.msg7":
    "There's nothing like the feeling of harvesting a bumper crop, it's what farming is all about!",
  // Blacksmith
  "npcMessages.blacksmith.msg1":
    "I need some supplies for my latest invention, got any materials?",
  "npcMessages.blacksmith.msg2":
    "I'm looking to stock up on some raw resources, got any to sell?",
  "npcMessages.blacksmith.msg3":
    "I need some crafting materials, got anything I can use?",
  "npcMessages.blacksmith.msg4":
    "Do you have any rare or unique resources that I could use?",
  "npcMessages.blacksmith.msg5":
    "I'm interested in acquiring some high-quality materials, what do you have?",
  "npcMessages.blacksmith.msg6":
    "I'm looking for some materials for my next project, got anything to offer?",
  "npcMessages.blacksmith.msg7":
    "I'm in the market for some raw materials, got any to sell?",
  // Pumpkin' pete
  "npcMessages.pumpkinpete.msg1":
    "Hey there, newbie! How 'bout some fresh produce?",
  "npcMessages.pumpkinpete.msg2":
    "Tasty crops, anyone? I'm your guy for easy pickings!",
  "npcMessages.pumpkinpete.msg3":
    "Fresh and delightful, that's my motto. What do you have?",
  "npcMessages.pumpkinpete.msg4":
    "Newcomer in town? Let's brighten up your day with some crops!",
  "npcMessages.pumpkinpete.msg5":
    "Need a hand, friend? I've got a variety of crops for you!",
  "npcMessages.pumpkinpete.msg6":
    "Energetic Pete, at your service! Crops, anyone?",
  "npcMessages.pumpkinpete.msg7":
    "Welcome to the plaza! Let's make your day brighter with crops!",
  // Cornwell
  "npcMessages.cornwell.msg1":
    "Ah, the good old days... Hard work's my motto. What've you got?",
  "npcMessages.cornwell.msg2":
    "These youngsters, no work ethic! Bring me the challenging stuff.",
  "npcMessages.cornwell.msg3":
    "I remember when... Hard work, that's what's missing!",
  "npcMessages.cornwell.msg4":
    "Hard-earned knowledge deserves the finest harvest. Impress me!",
  "npcMessages.cornwell.msg5":
    "History and hard work, that's what we're all about. What's your pick?",
  "npcMessages.cornwell.msg6":
    "Cornwell's the name, and I'm here for the real farm experience.",
  "npcMessages.cornwell.msg7":
    "Hard tasks, rich rewards. Show me what you've got!",
  // Raven
  "npcMessages.raven.msg1":
    "Darkness and mystery, that's my game. I'll take the tough crops.",
  "npcMessages.raven.msg2":
    "Goth at heart, I need the darkest crops for my potions.",
  "npcMessages.raven.msg3":
    "Supernatural and sinister, that's the vibe I'm after. Impress me.",
  "npcMessages.raven.msg4":
    "I crave the shadowy harvest for my spellwork. Hand 'em over.",
  "npcMessages.raven.msg5":
    "Bring me the crops that hide in the shadows. I won't be disappointed.",
  "npcMessages.raven.msg6":
    "Raven, the keeper of darkness, wants your most challenging crops.",
  "npcMessages.raven.msg7":
    "Dark delights for a goth heart. Show me your darkest harvest.",
  // Bert
  "npcMessages.bert.msg1":
    "Man, these shrooms... they're the key. Got any magic ones?",
  "npcMessages.bert.msg2":
    "Mushroom madness, that's me. Magic mushrooms, anyone?",
  "npcMessages.bert.msg3":
    "It's all about the shrooms, baby. Hand over the enchanted ones.",
  "npcMessages.bert.msg4":
    "I see things, you know? Magic mushrooms, that's what I need.",
  "npcMessages.bert.msg5":
    "Life's a trip, man, and I need those magic mushrooms to ride it!",
  "npcMessages.bert.msg6":
    "Bert's the name, shrooms are the game. Enchanted ones, please!",
  "npcMessages.bert.msg7":
    "Magic mushrooms, my friend. That's what keeps me going.",
  // Timmy
  "npcMessages.timmy.msg1":
    "Roar! I'm Timmy the bear! Gimme all the fruity goodness!",
  "npcMessages.timmy.msg2":
    "I'm a bear, and bears love fruit! Got any fruity treats for me?",
  "npcMessages.timmy.msg3":
    "Fruity delights, that's the secret. It's a Timmy thing, you know?",
  "npcMessages.timmy.msg4":
    "Bear hugs for fruits! It's a Timmy thing, you know?",
  "npcMessages.timmy.msg5":
    "In a bear suit, life's a treat. Fruits are my jam, got any?",
  "npcMessages.timmy.msg6":
    "Timmy the bear's here for fruity fun! Hand over those fruits!",
  "npcMessages.timmy.msg7":
    "Fruitful conversations with a bear! Share the fruity love!",
  // Tywin
  "npcMessages.tywin.msg1":
    "Gold, gold, and more gold! Show me the riches, peasants!",
  "npcMessages.tywin.msg2":
    "I watch over Bumpkins to ensure they pay their dues. Gold, now!",
  "npcMessages.tywin.msg3":
    "Peasants, bring me your riches! I am Tywin, the demanding prince!",
  "npcMessages.tywin.msg4":
    "Pumpkin Plaza is beneath me, but gold is never enough. More!",
  "npcMessages.tywin.msg5":
    "It's a prince's life, and I demand your wealth. Pay your taxes!",
  "npcMessages.tywin.msg6":
    "A prince's wealth knows no bounds. Gold, gold, and more gold!",
  "npcMessages.tywin.msg7":
    "Gold is my crown, and I want it all! Bring me your riches!",
  // Tango
  "npcMessages.tango.msg1":
    "Chatter, chomp, and chatter again! Fruits, fruits, and more fruits!",
  "npcMessages.tango.msg2":
    "I'm Tango, the fruity squirrel monkey! Bring me fruity treasures!",
  "npcMessages.tango.msg3":
    "Orange, cheeky, and playful, that's me. Fruits, anyone?",
  "npcMessages.tango.msg4":
    "Fruit secrets? I've got 'em! Share the fruity wonders with me!",
  "npcMessages.tango.msg5":
    "Fruitful mischief and fruity delights. Let's have some fun!",
  "npcMessages.tango.msg6":
    "Tango's the name, fruity games are my claim to fame. Gimme!",
  "npcMessages.tango.msg7":
    "Fruit knowledge runs in my family. Tell me your fruitiest tales!",
  // Miranda
  "npcMessages.miranda.msg1":
    "Dance with me, friend! Add to my fruit-tastic hat, won't you?",
  "npcMessages.miranda.msg2":
    "Samba and fruits  they go hand in hand. What can you offer?",
  "npcMessages.miranda.msg3":
    "In the rhythm of samba, fruits are a must. Care to share?",
  "npcMessages.miranda.msg4":
    "It's all about the samba beat and fruity treats. Bring some over!",
  "npcMessages.miranda.msg5":
    "Join the samba celebration with a fruit gift for my hat!",
  "npcMessages.miranda.msg6":
    "Miranda's hat loves fruity flair. What can you contribute?",
  "npcMessages.miranda.msg7":
    "Samba, fruits, and friendship. Let's make it a party!",
  // Finn
  "npcMessages.finn.msg1":
    "I've reeled in the biggest catch ever! Fish, anyone?",
  "npcMessages.finn.msg2":
    "Life's a fisherman's tale, and I've got stories to tell. Reeled in some fish!",
  "npcMessages.finn.msg3":
    "Finn the fisherman, the legend, and the fish whisperer. Reeled in some fish?",
  "npcMessages.finn.msg4":
    "Big fish, big stories, and a big ego. Bring me your fishy treasures!",
  "npcMessages.finn.msg5":
    "Hook, line, and swagger, that's me. Fish, it's what I do!",
  "npcMessages.finn.msg6":
    "Fish tales, bragging rights, and a hint of modesty. Fish, please!",
  "npcMessages.finn.msg7":
    "Did you know Surgeonfish have a soft spot for the zesty allure of oranges",
  "npcMessages.finn.msg8":
    "Caught the biggest fish ever. It's not just a story; it's reality!",
  // Findley
  "npcMessages.findley.msg1":
    "Not letting Finn have all the glory! I need bait and chum for my big catch!",
  "npcMessages.findley.msg2":
    "Finn's not the only one who can fish. I need bait and chum, stat!",
  "npcMessages.findley.msg3":
    "I'll show Finn who's the real angler! Bait and chum, I must have them!",
  "npcMessages.findley.msg4":
    "Looking to hook a Tuna? They have a peculiar fondness for the crisp allure of cauliflower.",
  "npcMessages.findley.msg5":
    "Fishy rivalry runs in the family. I'm out to prove a point. Bait and chum, please!",
  "npcMessages.findley.msg6":
    "Finn's not the only one with fishing skills. I'm going for the catch of a lifetime!",
  "npcMessages.findley.msg7":
    "Competing with Finn is a must. Bait and chum, I need your help!",
  "npcMessages.findley.msg8":
    "Siblings in a fishing showdown. Bait and chum are my secret weapons!",
  "npcMessages.findley.msg9":
    "Did you know Mahi Mahi can't resist the sweet crunch of corn",
  // Corale
  "npcMessages.corale.msg1":
    "The ocean calls, and I need fish. Help me set my friends free!",
  "npcMessages.corale.msg2":
    "Fish are my friends, and I must set them free. Will you assist me?",
  "npcMessages.corale.msg3":
    "For the love of the sea, bring me fish. I'll release them to their home.",
  "npcMessages.corale.msg4":
    "Beneath the waves, my friends await. Fish, so they can swim free!",
  "npcMessages.corale.msg5":
    "A mermaid's plea to protect her friends. Bring me fish, kind soul.",
  "npcMessages.corale.msg6":
    "Fishes' freedom, that's my mission. Help me with fish, won't you?",
  "npcMessages.corale.msg7":
    "Join me in the sea's dance of life. Fish, to set my friends free!",
  //Shelly
  "npcMessages.shelly.msg1":
    "Bumpkins are vanishing, and I fear the Kraken is the cause. Help me collect its tentacles!",
  "npcMessages.shelly.msg2":
    "Bumpkins are disappearing, and I suspect the Kraken. Can you fetch its tentacles, please?",
  "npcMessages.shelly.msg3":
    "Kraken's a threat, Bumpkins missing. Bring its tentacles to keep them safe.",
  "npcMessages.shelly.msg4":
    "Kraken's ominous, Bumpkins gone. Bring its tentacles for their safety.",
  "npcMessages.shelly.msg5":
    "Guarding the beach is tough with the Kraken. Help me protect Bumpkins, get its tentacles.",
  "npcMessages.shelly.msg6":
    "Protecting Bumpkins is my duty, but the Kraken worries me. Get its tentacles to safeguard them.",
  "npcMessages.shelly.msg7":
    "Kraken's causing panic, Bumpkins missing. Help me gather its tentacles for their safety.",
  "npcMessages.shelly.msg8":
    "Bumpkins' safety's my top priority, and I'm afraid the Kraken's involved. Tentacles can make a difference!",
};

const nftminting: Record<NFTMinting, string> = {
  "nftminting.mintAccountNFT": "Minting Account NFT",
  "nftminting.mintingYourNFT":
    "Minting your NFT and storing progress on the Blockchain",
  "nftminting.almostThere": "Almost there",
};

const npc: Record<Npc, string> = {
  "npc.Modal.Hammer": "Gather round Bumpkins, an auction is about to begin.",
  "npc.Modal.Marcus":
    "Hey! You are not allowed to go in my house. Don't you dare touch my things!",
  "npc.Modal.Billy": "Howdy, y'all! Name's Billy.",
  "npc.Modal.Billy.one":
    "I found these baby seedlings but for the life of me I cannot figure out what to do with them.",
  "npc.Modal.Billy.two":
    "I bet they have something to do with the worm buds that have been appearing around the plaza.",
  "npc.Modal.Gabi": "Oi Bumpkin!",
  "npc.Modal.Gabi.one":
    "You look creative, have you ever thought about contributing art to the game?",
  "npc.Modal.Craig": "Why are you looking at me strange?",
  "npc.Modal.Craig.one": "Is there something in my teeth...",
};

const npcDialogues: Record<NpcDialogues, string> = {
  // Blacksmith Intro
  "npcDialogues.blacksmith.intro1":
    "What do you want? Speak quickly; time is money.",
  "npcDialogues.blacksmith.intro2":
    "What brings you to my workshop? I'm busy, so make it quick.",
  "npcDialogues.blacksmith.intro3":
    "Welcome to my humble abode. What brings you here?",
  "npcDialogues.blacksmith.intro4":
    "State your purpose. I'm busy, and I don't have time for idle chatter. What brings you to my workshop?",
  // Blacksmith Positive Delivery
  "npcDialogues.blacksmith.positiveDelivery1":
    "Finally! You brought the materials I need. Step aside; let me work my magic.",
  "npcDialogues.blacksmith.positiveDelivery2":
    "Ah, about time! You've acquired the exact items I sought. Prepare for equipment crafted with precision.",
  "npcDialogues.blacksmith.positiveDelivery3":
    "Good. You've delivered the materials I need. I shall not disappoint; my creations will be remarkable.",
  "npcDialogues.blacksmith.positiveDelivery4":
    "Impressive! You've acquired the necessary components. I will transform them into farming marvels!",
  "npcDialogues.blacksmith.positiveDelivery5":
    "Hmm, you actually managed to find what I wanted. Well done.",
  // Blacksmith Negative Delivery
  "npcDialogues.blacksmith.negativeDelivery1":
    "You don't have what I require? Time is wasted. Come back when you have what's necessary.",
  "npcDialogues.blacksmith.negativeDelivery2":
    "No, no, no. You lack the essential materials. Don't waste my time. Return when you're prepared.",
  "npcDialogues.blacksmith.negativeDelivery3":
    "Unacceptable. You don't possess what I require. I have no time for incompetence. Return when you're capable.",
  "npcDialogues.blacksmith.negativeDelivery4":
    "Unsatisfactory. You don't possess what I need. Come back when you're ready to fulfill your end of the bargain.",
  "npcDialogues.blacksmith.negativeDelivery5":
    "Incompetence. You lack the materials required. Don't waste my time; return when you're prepared.",
  // Blacksmith NoOrder
  "npcDialogues.blacksmith.noOrder1":
    "No active order for me to fulfill at the moment, but if you're in need of tools or have materials for crafting, I am always here to assist you. Speak up, and we'll get to work.",
  "npcDialogues.blacksmith.noOrder2":
    "No active order from me, but if you require sturdy equipment or have materials in need of shaping, I am your craftsman.",
  // Betty Into
  "npcDialogues.betty.intro1":
    "Hey there, sunshine! It's been a busy day at the market. I'm here to see if you've got the ingredients I ordered. Do you have them with you?",
  "npcDialogues.betty.intro2":
    "Hello, hello! I've been waiting to see if you've got the ingredients I ordered. Have you brought them?",
  "npcDialogues.betty.intro3":
    "Welcome to Betty's market! Ready to check if you've got the ingredients I need? Let's see what you've got in store for me!",
  "npcDialogues.betty.intro4":
    "Hey, hey! I'm eager to know if you've brought the ingredients I ordered. Show me what you've got!",
  "npcDialogues.betty.intro5":
    "Greetings, my green-thumbed friend! I'm excited to see if you've got the ingredients I asked for. What's in your basket?",
  // Betty Positive Delivery
  "npcDialogues.betty.positiveDelivery1":
    "Hooray! You've brought the ingredients I ordered. They're as fresh and vibrant as can be. Thank you, my gardening genius!",
  "npcDialogues.betty.positiveDelivery2":
    "That's what I'm talking about! You've got the exact ingredients I needed. You've made my day with your prompt delivery. Thank you!",
  "npcDialogues.betty.positiveDelivery3":
    "Oh, fantastic! These are the exact ingredients I asked for. The market will be buzzing with excitement. Thanks for your hard work!",
  "npcDialogues.betty.positiveDelivery4":
    "Oh, my garden! These ingredients are absolutely perfect. You've got a talent for finding the finest produce. Thank you, my green-thumbed hero!",
  "npcDialogues.betty.positiveDelivery5":
    "Bravo! You've brought the exact ingredients I needed. I can't wait to use them to create something extraordinary. Thanks for your swift delivery!",
  // Betty Negative Delivery
  "npcDialogues.betty.negativeDelivery1":
    "Oopsie-daisy! It seems you don't have the ingredients I ordered. No worries, though. Keep searching, and we'll find another opportunity.",
  "npcDialogues.betty.negativeDelivery2":
    "Oh, no! It looks like you don't have the ingredients I need at the moment. Don't worry, though. I believe in your resourcefulness. Come back when you have what I'm after!",
  "npcDialogues.betty.negativeDelivery3":
    "Aw, shucks! It seems you don't have the ingredients I'm looking for right now. Keep foraging, though! Maybe next time we'll have better luck.",
  "npcDialogues.betty.negativeDelivery4":
    "Oh, bummer! It seems the ingredients you brought don't match what I need. But don't lose heart; keep working, and return soon.",
  "npcDialogues.betty.negativeDelivery5":
    "Oh, snapdragons! It seems you don't have the exact ingredients I'm searching for. But don't worry, my friend. Keep working hard, and we'll celebrate when you find them!",
  // Betty NoOrder
  "npcDialogues.betty.noOrder1":
    "No active order for me to fulfill right now, but that won't stop me from offering you the finest seeds and crops. Step right up and let's see what you're in the market for!",
  "npcDialogues.betty.noOrder2":
    "No specific order from me today, but that's not a problem. I'm here with a bounce in my step, ready to provide you with the best seeds and buy your delightful crops!",
  // Grimbly Intro
  "npcDialogues.grimbly.intro1":
    "Hungry. Need food. Have anything tasty for a hungry goblin?",
  "npcDialogues.grimbly.intro2":
    "Hungry goblin needs sustenance. Have what I need?",
  "npcDialogues.grimbly.intro3":
    "Starving goblin here. Got anything scrumptious for me to munch on?",
  "npcDialogues.grimbly.intro4":
    "Grimbly's hungry. Did you bring something tasty for me?",
  // Grimbly Positive Delivery
  "npcDialogues.grimbly.positiveDelivery1":
    "Ah, finally! Something delicious to satisfy my hunger. You're a lifesaver, my friend!",
  "npcDialogues.grimbly.positiveDelivery2":
    "You've brought food! Grimbly's hunger is appeased. Thank you, thank you!",
  "npcDialogues.grimbly.positiveDelivery3":
    "Hooray! You've brought me food to fill my hungry belly. Grimbly appreciates your generosity!",
  "npcDialogues.grimbly.positiveDelivery4":
    "A feast for Grimbly! You've brought me exactly what I needed. Your kindness won't be forgotten!",
  // Grimbly Negative Delivery
  "npcDialogues.grimbly.negativeDelivery1":
    "No food? Grimbly still hungry. Find food, bring food. Grimbly grateful.",
  "npcDialogues.grimbly.negativeDelivery2":
    "No food for Grimbly? Grimbly's tummy growls. Come back when you find something tasty.",
  "npcDialogues.grimbly.negativeDelivery3":
    "Grimbly still hungry. No food? Keep searching, and maybe next time you'll satisfy my goblin appetite.",
  "npcDialogues.grimbly.negativeDelivery4":
    "Empty-handed? Grimbly's stomach rumbles. Keep searching, and don't forget about a goblin's hunger!",
  // Grimbly NoOrder
  "npcDialogues.grimbly.noOrder1":
    "Grimbly doesn't have an active order for you, but that doesn't mean I'm not hungry!",
  "npcDialogues.grimbly.noOrder2":
    "No active order from Grimbly today, but fear not! I'm always on the lookout for tasty treats. If you find anything delicious, you know who to bring it to!",
  // Grimtootk Intro
  "npcDialogues.grimtooth.intro1":
    "Greetings, weary traveler. Looking for me, are you?",
  "npcDialogues.grimtooth.intro2":
    "Step into the realm of shadows. Have you fulfilled my order?",
  "npcDialogues.grimtooth.intro3":
    "Welcome, wanderer, to my mystical realm. Do you have what I need?",
  "npcDialogues.grimtooth.intro4":
    "Step inside, dear traveler, and uncover the secrets I've amassed. Did you find what I requested?",
  // Grimtooth Positive Delivery
  "npcDialogues.grimtooth.positiveDelivery1":
    "Incredible! You've found the ingredients I require. The magic of Sunflorea is at your fingertips!",
  "npcDialogues.grimtooth.positiveDelivery2":
    "Marvelous! You've acquired what I sought. Together, we shall delve into the deepest depths of magic!",
  "npcDialogues.grimtooth.positiveDelivery3":
    "Incredible! You've gathered the mystical components I required. Your journey in the realm of magic begins!",
  "npcDialogues.grimtooth.positiveDelivery4":
    "Ah, splendid! You've obtained the elusive ingredients I sought. Your journey in the realm of magic begins!",
  // Grimtooth Negative Delivery
  "npcDialogues.grimtooth.negativeDelivery1":
    "Alas, the required ingredients elude you. Fear not, though. Keep searching, and the mysteries shall reveal themselves!",
  "npcDialogues.grimtooth.negativeDelivery2":
    "Oh, darkness and dismay. You don't possess what I need. But fret not; keep working and the shadows will continue to guide you.",
  "npcDialogues.grimtooth.negativeDelivery3":
    "Fear not, though. Continue your work, and the magic shall manifest.",
  "npcDialogues.grimtooth.negativeDelivery4":
    "Oh, alas. You don't possess what I need. Return when you do.",
  // Grimtooth NoOrder
  "npcDialogues.grimtooth.noOrder1":
    "На данный момент у Grimtooth нет активных заказов, но не волнуйся. Если ты нуждаешься в изысканном мастерстве или у тебя есть материалы, с которыми я могу работать, я буду здесь, готовый творить.",
  "npcDialogues.grimtooth.noOrder2":
    "No active order for you to fulfill with GrimTooth, but should you require the master craftsman's touch or have materials that need transforming, I'm at your service.",
  // Old Salty Intro
  "npcDialogues.oldSalty.intro1":
    "Arghhhh, welcome, me heartie! Old Salty's the name, and treasure's me game. Do ye have what I seek?",
  "npcDialogues.oldSalty.intro2":
    "Ahoy, landlubber! Old Salty's the treasure enthusiast ye be lookin' for. Show me what ye've found on yer quest?",
  "npcDialogues.oldSalty.intro3": "",
  // Old Salty Positive Delivery
  "npcDialogues.oldSalty.positiveDelivery1":
    "Arghhhh, ye've found the treasure I be seekin'. Ye've got the heart of a true adventurer, me matey!",
  "npcDialogues.oldSalty.positiveDelivery2":
    "Avast! Ye've brought the very treasure Old Salty desires. Ye be earnin' me respect, me hearty!",
  "npcDialogues.oldSalty.positiveDelivery3":
    "Ahoy, ye've found the treasure Old Salty's been huntin'. Ye be a true legend in these waters, me hearty!",
  //  Olkd Salty Negative Delivery
  "npcDialogues.oldSalty.negativeDelivery1":
    "Arrrr, no treasure for Old Salty? Keep yer eyes peeled, me heartie. The hidden gems await yer discovery!",
  "npcDialogues.oldSalty.negativeDelivery2":
    "Ah, scallywag! No treasure for Old Salty? Keep searchin', and ye'll find the riches ye seek!",
  "npcDialogues.oldSalty.negativeDelivery3":
    "Shiver me timbers! No treasure for Old Salty? Keep sailin', me matey. The loot be out there, waitin' fer ye!",
  // Old Salty NoOrder
  "npcDialogues.oldSalty.noOrder1":
    "No active order for Old Salty's treasure cove, me heartie, but that doesn't mean there's no adventure to be had. Keep your eyes peeled for hidden treasures and uncharted waters!",
  "npcDialogues.oldSalty.noOrder2":
    "No specific treasure for you to seek with Old Salty at the moment, but don't fret, my hearty sailor! The high seas hold countless riches waiting to be discovered.",
  // Raven Intro
  "npcDialogues.raven.intro1":
    "Welcome to my humble abode. Careful where you step; there are potions brewing. Did you get what I ordered?",
  "npcDialogues.raven.intro2":
    "Step into the realm of shadows. Seek wisdom, find enchantment. Do you have what I need?",
  "npcDialogues.raven.intro3":
    "Welcome, wanderer, to my mystical realm. Seeking something magical, are you? Or do you have what I need?",
  "npcDialogues.raven.intro4":
    "Step inside, dear traveler. The shadows will guide you. Did you find what I seek?",
  // Raven Positive Delivery
  "npcDialogues.raven.positiveDelivery1":
    "Incredible! You've found the ingredients I require. The magic of Sunflorea is at your fingertips!",
  "npcDialogues.raven.positiveDelivery2":
    "Marvelous! You've acquired what I sought. Together, we shall delve into the deepest depths of magic!",
  "npcDialogues.raven.positiveDelivery3":
    "Incredible! You've gathered the mystical components I required. Your journey in the realm of magic begins!",
  "npcDialogues.raven.positiveDelivery4":
    "Ah, splendid! You've obtained the elusive ingredients I sought. Your journey in the realm of magic begins!",
  // Raven Negative Delivery
  "npcDialogues.raven.negativeDelivery1":
    "Alas, the required ingredients elude you. Fear not, though. Keep searching, and the mysteries shall reveal themselves!",
  "npcDialogues.raven.negativeDelivery2":
    "Oh, darkness and dismay. You don't possess what I need. But fret not; the shadows will guide you to it.",
  "npcDialogues.raven.negativeDelivery3":
    "Fear not, though. Continue your quest, and the magic shall manifest.",
  // Raven NoOrder
  "npcDialogues.raven.noOrder1":
    "It seems there's no active order awaiting your arrival in my dark domain. However, should you seek guidance or have questions about the mystical arts, don't hesitate to ask.",
  "npcDialogues.raven.noOrder2":
    "No active order from me, traveler. But fret not! The shadows are ever-watchful, and when the time is right, we'll delve into the depths of magic together.",
  // Tywin Intro
  "npcDialogues.tywin.intro1":
    "Ah, another commoner gracing my presence. Do you have what I want? Speak quickly.",
  "npcDialogues.tywin.intro2":
    "Oh, great, another one from the peasantry. What's your business with someone of my stature? Do you have what I need?",
  "npcDialogues.tywin.intro3":
    "Greetings, commoner. Seeking wisdom, are you? Do you have everything I asked for?",
  "npcDialogues.tywin.intro4":
    "What do you want? Speak quickly; time is money. You have what I need, I assume?",
  // Tywin Positive Delivery
  "npcDialogues.tywin.positiveDelivery1":
    "Hmm, it seems you're not entirely useless. You've managed to bring what I wanted. Carry on, peasant!",
  "npcDialogues.tywin.positiveDelivery2":
    "Surprisingly, you've actually delivered what I desired. Perhaps you're not as useless as I presumed.",
  "npcDialogues.tywin.positiveDelivery3":
    "Ah, marvelous work! You've brought the materials I require. Together, we shall create masterpieces!",
  "npcDialogues.tywin.positiveDelivery4":
    "Good. You've delivered the materials I need. Igor shall not disappoint; the tools will be remarkable.",
  // Tywin Negative Delivery
  "npcDialogues.tywin.negativeDelivery1":
    "Pathetic. You don't have what I asked for. Don't waste my time with your incompetence. Leave!",
  "npcDialogues.tywin.negativeDelivery2":
    "What a disappointment. You don't have what I requested. Typical of your kind. Now begone!",
  "npcDialogues.tywin.negativeDelivery3":
    "Unsatisfactory. You don't possess what I require. I have no time for incompetence. Return when you're capable.",
  "npcDialogues.tywin.negativeDelivery4":
    "Incompetence. You lack the materials required. Don't waste my time; return when you're prepared.",
  // Tywin NoOrder
  "npcDialogues.tywin.noOrder1":
    "Ah, it appears I don't have an active order for you, commoner. But if you require my esteemed presence or have a request, state it quickly. Time is money, after all.",
  "npcDialogues.tywin.noOrder2":
    "No active order for you today, peasant. However, should you stumble upon something worthy of my attention or require my expertise, you know where to find me.",
  //Bert Intro
  "npcDialogues.bert.intro1":
    "Psst! Explorer of the arcane! Sunflorea's vast secrets are manifold...",
  "npcDialogues.bert.intro2":
    "Ah, kindred spirit! Sunflorea is home to countless treasures...",
  "npcDialogues.bert.intro3":
    "Greetings, bearer of the mysterious! In Sunflorea, some items demand Delivery...",
  "npcDialogues.bert.intro4":
    "Hello, seeker of the concealed! Sunflorea's enchantments can be categorized into two...",
  "bert.day": "You cannot withdraw this item for 3 days after claiming",
  //Bert Positive Delivery
  "npcDialogues.bert.positiveDelivery1":
    "Incredible! You've brought me everything I need...",
  "npcDialogues.bert.positiveDelivery2":
    "Oh, fascinating find! You have brought me the exact items I sought...",
  "npcDialogues.bert.positiveDelivery3":
    "Ah, about time! You've acquired the exact items I sought. Excellent!",
  "npcDialogues.bert.positiveDelivery4":
    "Impressive! You've brought me exactly what I need to uncover the secrets of Sunflorea.",
  //Bert Negative Delivery
  "npcDialogues.bert.negativeDelivery1":
    "Oh, alas. You don't possess what I seek. Keep exploring, I will see you when you have what I need!",
  "npcDialogues.bert.negativeDelivery2":
    "Drat! What you have isn't quite what I need. Keep working on my order, and together, we'll unravel the mysteries!",
  "npcDialogues.bert.negativeDelivery3":
    "Hmm, not quite what I expected. But fear not! There is still time to get me what I need.",
  "npcDialogues.bert.negativeDelivery4":
    "Oh, not quite what I sought. Return when you have it. But keep your eyes open; the pages of history have more to reveal.",
  //Bert NoOrder
  "npcDialogues.bert.noOrder1":
    "No active order for me to fulfill today, but that doesn't mean I don't have any intriguing secrets to share.",
  "npcDialogues.bert.noOrder2":
    "No enigmatic artifact for you to discover with Bert at the moment, but that doesn't mean I'm short on peculiar facts and hidden truths.",
  // Timmy Intro
  "npcDialogues.timmy.intro1":
    "Hey there, friend! It's Timmy, and I'm eager to see if you have what I asked for.",
  "npcDialogues.timmy.intro2":
    "Greetings, fellow adventurer! Timmy here, wondering if you've found what I requested.",
  "npcDialogues.timmy.intro3":
    "Welcome, welcome! I'm Timmy, the friendliest face in the plaza. Can you help me out by checking if you have what I need?",
  "npcDialogues.timmy.intro4":
    "Hey, hey! Ready for some fun in the sun? It's Timmy, and I can't wait to see if you've got what I asked for.",
  "npcDialogues.timmy.intro5":
    "Hello, sunshine! Timmy's here, hoping you have what I requested. Let's see?",
  // Timmy Positive Delivery
  "npcDialogues.timmy.positiveDelivery1":
    "Woohoo! You've got just what I needed. Your generosity fills my heart with joy. Thank you!",
  "npcDialogues.timmy.positiveDelivery2":
    "That's what I'm talking about! You've brought exactly what I was looking for. You're a superstar!",
  "npcDialogues.timmy.positiveDelivery3":
    "Oh, fantastic! Your timing couldn't be better. You've made my day with your thoughtful offering. Thank you!",
  "npcDialogues.timmy.positiveDelivery4":
    "Hooray! You've delivered the goods. Sunflorea is lucky to have someone as amazing as you!",
  "npcDialogues.timmy.positiveDelivery5":
    "You've done it again! Your kindness and generosity never cease to amaze me. Thank you for brightening up the plaza!",
  // Timmy Negative Delivery
  "npcDialogues.timmy.negativeDelivery1":
    "Oopsie-daisy! It seems you don't have what I'm searching for right now. No worries, though. Keep exploring, and we'll find another opportunity.",
  "npcDialogues.timmy.negativeDelivery2":
    "Oh, no! It looks like you don't have what I need at the moment. Don't worry, though. I believe in you. Come back when you find it!",
  "npcDialogues.timmy.negativeDelivery3":
    "Aw, shucks! You don't have what I'm looking for right now. Keep exploring, though! Maybe next time you'll stumble upon what I need.",
  "npcDialogues.timmy.negativeDelivery4":
    "Oh, bummer! It seems you don't have the item I'm seeking. But don't give up; new opportunities await just around the corner.",
  "npcDialogues.timmy.negativeDelivery5":
    "Oh, snapdragons! You don't have what I'm searching for. But don't worry, my friend. Keep exploring, and we'll celebrate when you find it!",
  // Timmy NoOrder
  "npcDialogues.timmy.noOrder1":
    "Oh, hi there! I don't have any active orders for you right now, but I'm always eager to learn and hear stories. Have any exciting tales of your adventures in Sunflorea? Or perhaps you've come across a new bear friend? Share it with me!",
  "npcDialogues.timmy.noOrder2":
    "No specific order for me to fulfill at the moment, but that won't stop me from being curious! Do you have any interesting stories about your travels? Maybe you've encountered a rare bear or discovered a hidden gem in Sunflorea? Let's chat!",
  // Cornwell Intro
  "npcDialogues.cornwell.intro1":
    "Greetings, young adventurer! Have you come bearing the items I seek?",
  "npcDialogues.cornwell.intro2":
    "Ah, welcome, seeker of knowledge and relics! Do you have the items I requested? Show me what you've got.",
  "npcDialogues.cornwell.intro3":
    "Step into the realm of ancient secrets and wisdom. Have you acquired the items I desire? Share your discoveries with me, young one.",
  "npcDialogues.cornwell.intro4":
    "Ah, it's you! The one on a noble quest. Have you found the items I seek? Come, show me what you've uncovered in Sunflower Land's vast lands.",
  "npcDialogues.cornwell.intro5":
    "Greetings, young traveler! The winds of curiosity have brought you here. Do you have the items I require to enrich my collection?",
  // Cornwell Positive Delivery
  "npcDialogues.cornwell.positiveDelivery1":
    "Marvelous! You've brought the very relics I desired. Your efforts in preserving Sunflower Land's history will be remembered.",
  "npcDialogues.cornwell.positiveDelivery2":
    "Ah, splendid! Your findings align perfectly with the relics I sought. These treasures shall add great wisdom to my collection.",
  "npcDialogues.cornwell.positiveDelivery3":
    "Impressive! The items you've acquired are just what I was looking for. Sunflower Land's history will shine through them.",
  "npcDialogues.cornwell.positiveDelivery4":
    "Ah, young adventurer, you've surpassed my expectations! The items you've brought will be invaluable to my research.",
  "npcDialogues.cornwell.positiveDelivery5":
    "Ah, well done, my keen-eyed friend! The items you've delivered will find a place of honor in my windmill's collection.",
  // Cornwell Negative Delivery
  "npcDialogues.cornwell.negativeDelivery1":
    "Oh, it seems you haven't found the items I seek. Fear not; the journey of discovery continues. Keep exploring Sunflower Land's mysteries.",
  "npcDialogues.cornwell.negativeDelivery2":
    "Hmm, not quite the relics I was expecting. But do not despair! Keep searching, and the treasures of Sunflower Land will reveal themselves to you.",
  "npcDialogues.cornwell.negativeDelivery3":
    "Oh, it appears the items I desired elude you. No matter; your curiosity will lead you to the right discoveries eventually.",
  "npcDialogues.cornwell.negativeDelivery4":
    "Ah, I see you haven't found the specific items I need. Fret not; the history of Sunflower Land holds many secrets waiting to be unearthed.",
  "npcDialogues.cornwell.negativeDelivery5":
    "Oh, my dear traveler, it seems you didn't bring the exact items I sought. But your dedication to Sunflower Land's history is commendable.",
  // Cornwell NoOrder
  "npcDialogues.cornwell.noOrder1":
    "Ah, it appears there are no quest items for you to deliver at the moment. But do not be disheartened! Your journey in Sunflower Land is filled with untold adventures waiting to be discovered.",
  "npcDialogues.cornwell.noOrder2":
    "Oh, it seems I have no need for your services at the moment. But don't fret; the pages of Sunflower Land's history turn endlessly, and new quests will surely present themselves.",
  "npcDialogues.cornwell.noOrder3":
    "Ah, my apologies, but I have nothing for you to fulfill right now. Fear not, though; your path as a seeker of knowledge is bound to lead you to new quests in due time.",
  "npcDialogues.cornwell.noOrder4":
    "Ah, it seems you haven't received any quest orders from me at the moment. But do not lose hope; your inquisitive nature will soon guide you to exciting new quests in Sunflower Land.",
  // Pumpkin Pete Intor
  "npcDialogues.pumpkinPete.intro1":
    "I have been waiting for you, my friend! Do you have my order ready?",
  "npcDialogues.pumpkinPete.intro2":
    "Hey there, pumpkin! I have been busy guiding Bumpkins around the plaza? Did you get my order?",
  "npcDialogues.pumpkinPete.intro3":
    "Greetings, friend! The plaza is bursting with excitement today. Did you get manage to get my order?",
  "npcDialogues.pumpkinPete.intro4":
    "Hello there, fellow adventurer! What brings you to my humble abode? Did you get my order?",
  "npcDialogues.pumpkinPete.intro5":
    "Hey, hey! Welcome to the plaza? Did you manage to find what I needed?",
  // Pumpkin Pete Positive Delivery
  "npcDialogues.pumpkinPete.positiveDelivery1":
    "Hooray! You've brought exactly what I need. You're a true hero of the plaza!",
  "npcDialogues.pumpkinPete.positiveDelivery2":
    "Pumpkin-tastic! You've got just what I needed. You're making our little community brighter!",
  "npcDialogues.pumpkinPete.positiveDelivery3":
    "Great seeds of joy! You've brought exactly what I need. The plaza is lucky to have you!",
  "npcDialogues.pumpkinPete.positiveDelivery4":
    "Fantastic! You've arrived bearing exactly what I desired. Your kindness spreads sunshine in our plaza!",
  "npcDialogues.pumpkinPete.positiveDelivery5":
    "Oh, pumpkin seeds of joy! You've brought me exactly what I needed. The plaza is grateful for your help!",
  // Pumpkin Pete Negative Delivery
  "npcDialogues.pumpkinPete.negativeDelivery1":
    "Oh, no. It seems you don't have what I'm looking for. Don't worry, though. I believe in you. Come back when you find it!",
  "npcDialogues.pumpkinPete.negativeDelivery2":
    "Aw, shucks! You don't have what I'm looking for right now. Keep exploring, though! Maybe next time.",
  "npcDialogues.pumpkinPete.negativeDelivery3":
    "Oh, seeds of sorrow! You don't have what I'm searching for. But don't give up; new opportunities bloom every day!",
  "npcDialogues.pumpkinPete.negativeDelivery4":
    "Oh, snapdragons! You don't have what I'm seeking right now. Keep exploring, though! I'm confident you'll find it.",
  "npcDialogues.pumpkinPete.negativeDelivery5":
    "Oopsie-daisy! You don't have what I'm searching for. But don't worry, my friend. Keep exploring, and we'll celebrate when you find it.",
  // Pumpkin Pete NoOrder
  "npcDialogues.pumpkinPete.noOrder1":
    "Ah, my friend, it seems I don't have an active order for you at the moment. But fear not! I'm always here to offer guidance and a friendly pumpkin smile.",
  "npcDialogues.pumpkinPete.noOrder2":
    "Oh, no active order for you today, my friend. But don't worry! Feel free to explore the plaza, and if you need any assistance, I'm your trusty Bumpkin.",

  // NPC gift dialogues
  "npcDialogues.pumpkinPete.reward":
    "Thank you kindly for your deliveries. Here's a token of appreciation for you.",
  "npcDialogues.pumpkinPete.flowerIntro":
    "Have you ever seen the elegance of a Yellow Cosmos? I'm craving one...",
  "npcDialogues.pumpkinPete.averageFlower":
    "Not exactly what I had in mind, but it's quite charming. Thanks.",
  "npcDialogues.pumpkinPete.badFlower":
    "This isn't what I was hoping for. Perhaps you can find a more suitable one?",
  "npcDialogues.pumpkinPete.goodFlower":
    "This Yellow Cosmos is splendid! Thank you for bringing it to me.",

  "npcDialogues.betty.reward":
    "I appreciate your thoughtful gifts. Here's a little something to show my gratitude.",
  "npcDialogues.betty.flowerIntro":
    "Can you imagine the beauty of a Red, Yellow, Purple, White, or Blue Pansy? I long for one...",
  "npcDialogues.betty.averageFlower":
    "Not exactly what I was expecting, but it's quite lovely. Thank you.",
  "npcDialogues.betty.badFlower":
    "This isn't what I had in mind. Could you try to find a more suitable flower?",
  "npcDialogues.betty.goodFlower":
    "This Pansy is beautiful! Thank you for bringing it to me.",

  "npcDialogues.blacksmith.reward":
    "Your deliveries are much appreciated. Here's something for your efforts.",
  "npcDialogues.blacksmith.flowerIntro":
    "I'm in need of a vibrant Red Carnation. Have you come across one?",
  "npcDialogues.blacksmith.averageFlower":
    "Not exactly what I was hoping for, but it's quite nice. Thank you.",
  "npcDialogues.blacksmith.badFlower":
    "This flower isn't quite right. Could you search for a more suitable one?",
  "npcDialogues.blacksmith.goodFlower":
    "Ah, this Red Carnation is perfect! Thank you for bringing it to me.",

  "npcDialogues.bert.reward":
    "Thank you for your continuous help. Here's a small token of appreciation.",
  "npcDialogues.bert.flowerIntro":
    "The Lotus flowers in Red, Yellow, Purple, White, or Blue are truly enchanting. Do you have one?",
  "npcDialogues.bert.averageFlower":
    "This wasn't what I had in mind, but it's quite delightful. Thank you.",
  "npcDialogues.bert.badFlower":
    "This isn't the flower I needed. Perhaps another search is in order?",
  "npcDialogues.bert.goodFlower":
    "This Lotus is exquisite! Thank you for bringing it to me.",

  "npcDialogues.finn.reward":
    "Your contributions are invaluable. Here's a little something to express my gratitude.",
  "npcDialogues.finn.flowerIntro":
    "I'm yearning for a beautiful Daffodil in Red, Yellow, Purple, White, or Blue. Can you find one?",
  "npcDialogues.finn.averageFlower":
    "Not exactly what I was hoping for, but it's quite pleasing. Thank you.",
  "npcDialogues.finn.badFlower":
    "This flower doesn't quite meet my expectations. Perhaps another try?",
  "npcDialogues.finn.goodFlower":
    "This Daffodil is stunning! Thank you for bringing it to me.",

  "npcDialogues.finley.reward":
    "Thank you for your efforts. Here's a small token of appreciation for your deliveries.",
  "npcDialogues.finley.flowerIntro":
    "A lovely Daffodil, like the one I'm thinking of, would brighten up my day. Have you seen one?",
  "npcDialogues.finley.averageFlower":
    "It's not exactly what I had in mind, but it's quite charming. Thank you.",
  "npcDialogues.finley.badFlower":
    "This flower isn't quite right. Perhaps another one would be more suitable?",
  "npcDialogues.finley.goodFlower":
    "This Yellow Carnation is beautiful! Thank you for bringing it to me.",

  "npcDialogues.corale.reward":
    "Your deliveries are much appreciated. Here's a little something to show my gratitude.",
  "npcDialogues.corale.flowerIntro":
    "Have you ever encountered the radiant Prism Petal? It's simply enchanting...",
  "npcDialogues.corale.averageFlower":
    "Not exactly what I was hoping for, but it's quite delightful. Thank you.",
  "npcDialogues.corale.badFlower":
    "This isn't quite what I had in mind. Could you find a more suitable flower?",
  "npcDialogues.corale.goodFlower":
    "This Prism Petal is exquisite! Thank you for bringing it to me.",

  "npcDialogues.raven.reward":
    "Thank you for your deliveries. Here's a small token of appreciation for your efforts.",
  "npcDialogues.raven.flowerIntro":
    "Deep dark purple is the color of my soul - have you come across anything like this?",
  "npcDialogues.raven.averageFlower":
    "Not quite what I was expecting, but it's quite pleasing. Thank you.",
  "npcDialogues.raven.badFlower":
    "This flower isn't quite right. Perhaps another search is in order?",
  "npcDialogues.raven.goodFlower":
    "This Purple Carnation is perfect! Thank you for bringing it to me.",

  "npcDialogues.miranda.reward":
    "Thank you for your efforts. Here's a small token of appreciation for your deliveries.",
  "npcDialogues.miranda.flowerIntro":
    "The vibrancy of a Yellow flower would surely lift my spirits. Have you seen one around?",
  "npcDialogues.miranda.averageFlower":
    "It's not exactly what I was hoping for, but it's quite charming. Thank you.",
  "npcDialogues.miranda.badFlower":
    "This flower isn't quite right. Perhaps another one would be more suitable?",
  "npcDialogues.miranda.goodFlower":
    "This Yellow flower is lovely! Thank you for bringing it to me.",

  "npcDialogues.cornwell.reward":
    "Thank you for your deliveries. Here's a small token of appreciation for your efforts.",
  "npcDialogues.cornwell.flowerIntro":
    "The sight of a Balloon Flower in Red, Yellow, Purple, White, or Blue is truly delightful...",
  "npcDialogues.cornwell.averageFlower":
    "Not quite what I was expecting, but it's quite charming. Thank you.",
  "npcDialogues.cornwell.badFlower":
    "This flower isn't quite right. Perhaps another search is in order?",
  "npcDialogues.cornwell.goodFlower":
    "This Balloon Flower is delightful! Thank you for bringing it to me.",

  "npcDialogues.tywin.reward":
    "Thank you for your deliveries. Here's a small token of appreciation for your efforts.",
  "npcDialogues.tywin.flowerIntro":
    "Have you heard of the exquisite Primula Enigma or the mesmerizing Celestial Frostbloom? I'm in need of one.",
  "npcDialogues.tywin.averageFlower":
    "Not exactly what I was hoping for, but it's quite delightful. Thank you.",
  "npcDialogues.tywin.badFlower":
    "This flower isn't quite right. Perhaps another one would be more suitable?",
  "npcDialogues.tywin.goodFlower":
    "This flower is simply breathtaking! Thank you for bringing it to me.",

  "npcDialogues.default.flowerIntro":
    "Have you got a flower for me? Make sure it is something I like.",
  "npcDialogues.default.averageFlower": "Wow, thanks! I love this flower!",
  "npcDialogues.default.badFlower":
    "Hmmmm, this isn't my favorite flower. But I guess it's the thought that counts.",
  "npcDialogues.default.goodFlower":
    "This is my favorite flower! Thanks a bunch!",
  "npcDialogues.default.reward":
    "Wow, thanks Bumpkin. Here is a small gift for your help!",
  "npcDialogues.default.locked": "Please come back tomorrow.",

  // Glinteye Intro
  "npcDialogues.glinteye.intro1":
    "Ah, adventurer! Glinteye at your service. Ready to trade secrets and resources? Dive into my listings or add your own. Let's make a deal!",
  "npcDialogues.glinteye.intro2":
    "Welcome, curious soul! I'm Glinteye, your guide to trading wonders. Seek or list resources with me; fortune favors the bold!",
  "npcDialogues.glinteye.intro3":
    "Glinteye's my name, trading's my game! Browse or list, there's always a twist. What's your fancy today?",
  "npcDialogues.glinteye.intro4":
    "Hello there! I'm Glinteye, the goblin of trade. Explore player trades or list your items. Let's see what we can find together!",
};

const nyeButton: Record<NyeButton, string> = {
  "plaza.magicButton.query":
    "A magical button has appeared in the plaza. Do you want to press it?",
};

const obsessionDialogue: Record<ObsessionDialogue, string> = {
  "obsessionDialogue.line1":
    "Ah, the {{itemName}}! I only wish to see it, not possess. Show it to me, and {{seasonalTicket}}s will be your reward.",
  "obsessionDialogue.line2":
    "You've brought the {{itemName}}? I merely want to gaze upon it. Let me see, and {{seasonalTicket}}s shall be yours.",
  "obsessionDialogue.line3":
    "Is that the {{itemName}} you have? A mere glance is all I desire. Fore this, you'll receive {{seasonalTicket}}s.",
  "obsessionDialogue.line4":
    "The {{itemName}}! I don't want to keep it, just to behold it. Show it to me, and {{seasonalTicket}}s are yours.",
  "obsessionDialogue.line5":
    "You offer a view of the {{itemName}}? All I ask is to see it briefly. For your generosity, {{seasonalTicket}}s will be granted to you.",
};

const offer: Record<Offer, string> = {
  "offer.okxOffer": "Howdy Farmer, I have an exclusive OKX offer for you!",
  "offer.beginWithNFT": "To begin you will need to mint a ",
  "offer.getStarterPack": "Get Starter Pack Now",
  "offer.newHere": "Howdy Farmer, you look new here!",
  "offer.getStarted": "Get Started Now",
  "offer.not.enough.BlockBucks": "You do not have enough Block Bucks!",
};

const onboarding: Record<Onboarding, string> = {
  "onboarding.welcome": "Welcome to decentralized gaming!",
  "onboarding.step.one": "Step 1/3",
  "onboarding.step.two": "Step 2/3 (Create a wallet)",
  "onboarding.step.three": "Step 3/3 (Create your NFT)",
  "onboarding.intro.one":
    "In your travels, you will earn rare NFTs that need to be protected. To keep these secure you'll need a Web3 wallet.",
  "onboarding.intro.two": "To begin your journey, your wallet will receive",
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
  "onboarding.wallet.acceptButton": "Accept terms of service",
  "onboarding.buyFarm.title": "Buy your farm!",
  "onboarding.buyFarm.one":
    "Now that your wallet is all set up, it's time to get your very own farm NFT! ",
  "onboarding.buyFarm.two":
    "This NFT will securely store all your progress in Sunflower Land and allow you to keep coming back to tend to your farm.",
  "onboarding.wallet.already": "I already have a wallet ",
};

const onCollectReward: Record<OnCollectReward, string> = {
  "onCollectReward.Missing.Seed": "Missing Seeds",
  "onCollectReward.Market": "Go to the Market to purchase seeds.",
  "onCollectReward.Missing.Shovel": "Missing Shovel",
  "onCollectReward.Missing.Shovel.description":
    "Expand your island to find it.",
};

const orderhelp: Record<OrderHelp, string> = {
  "orderhelp.Skip.hour": "You're only able to skip an order after 24 hours!",
  "orderhelp.New.Season":
    "A new season approaches, deliveries will temporarily close.",
  "orderhelp.New.Season.arrival": "New Seasonal Deliveries opening soon.",
  "orderhelp.Wisely": "Choose wisely!",
  "orderhelp.SkipIn": "Skip in",
  "orderhelp.NoRight": "Not Right Now",
};

const pageFounds: Record<PageFounds, string> = {
  "pageFounds.title": "Page Found!",
  "pageFounds.gardeningBookPage": "Looks like a page from a gardening book...",
  "pageFounds.lastPageFound":
    "Fantastic! Well done finding the last page! The pages reveal how to cross breed a new flower!",
  "pageFounds.knowHowToGrow": "You now know how to grow a",
  "pageFounds.checkCodex": "Check the Codex to learn more about it!",
  "pageFounds.all": "All Pages Found!",
  "pageFounds.pageContainsInfo":
    "Great! This page contains some information about how to grow a",
  pageFounds: "Pages Found:",
};

const pending: Record<Pending, string> = {
  "pending.calcul": "The results are being calculated.",
  "pending.comeback": "Come back later.",
};

const personHood: Record<PersonHood, string> = {
  "personHood.Details": "Failed Loading Personhood Details",
  "personHood.Identify": "Your identity could not be verified",
  "personHood.Congrat": "Congratulations, your identity has been verified!",
};

const piratechest: Record<PirateChest, string> = {
  "piratechest.greeting":
    "Ahoy matey! Set sail and come back later for a chest full of swashbuckling rewards!",
  "piratechest.refreshesIn": "Chest Refreshes in:",
  "piratechest.warning":
    "Ahoy there! This chest be filled with treasures fit for a pirate king, but beware, only those with a pirate skin can open it and claim the booty within!",
};

const pirateQuest: Record<PirateQuest, string> = {
  "questDescription.farmerQuest1": "Harvest 1000 Sunflowers",
  "questDescription.fruitQuest1": "Harvest 10 Blueberries",
  "questDescription.fruitQuest2": "Harvest 100 Oranges",
  "questDescription.fruitQuest3": "Harvest 750 Apples",
  "questDescription.pirateQuest1": "Dig 30 holes",
  "questDescription.pirateQuest2": "Collect 10 Seaweeds",
  "questDescription.pirateQuest3": "Collect 10 Pipis",
  "questDescription.pirateQuest4": "Collect 5 Corals",
  "piratequest.welcome":
    "Welcome to the high seas of adventure, where ye be tested as a true pirate. Set sail on a journey to find the richest pillage and become the greatest pirate to ever grace the ocean waves.",
  "piratequest.finestPirate":
    "Ahoy, ye be the finest pirate on the seven seas with yer loot!!",
};

const pickserver: Record<Pickserver, string> = {
  "pickserver.server": "Choose a server to join",
  "pickserver.full": "FULL",
  "pickserver.explore": "Explore custom project islands.",
  "pickserver.built": "Do you want to build your own island?",
};

const plazaSettings: Record<PlazaSettings, string> = {
  "plazaSettings.title.main": "Plaza Settings",
  "plazaSettings.title.mutedPlayers": "Muted Players",
  "plazaSettings.title.keybinds": "Keybinds",
  "plazaSettings.mutedPlayers.description":
    "In case you have muted some players using the /mute command, you can see them here and unmute them if you want.",
  "plazaSettings.keybinds.description":
    "Need to know what keybinds are available? Check them out here.",
  "plazaSettings.noMutedPlayers": "You have no muted players.",
  "plazaSettings.changeServer": "Change server",
};

const playerTrade: Record<PlayerTrade, string> = {
  "playerTrade.no.trade": "No trades available.",
  "playerTrade.max.item": "Oh no! You've reached your max items.",
  "playerTrade.Progress":
    "Please store your progress on chain before continuing.",
  "playerTrade.transaction":
    "Oh oh! It looks like you have a transaction in progress.",
  "playerTrade.Please": "Please allow 5 minutes before continuing.",
  "playerTrade.sold": "Sold",
  "playerTrade.sale": "For sale",
  "playerTrade.title.congrat": "Congratulations, your listing was purchased",
};

const portal: Record<Portal, string> = {
  "portal.wrong": "Something went wrong",
  "portal.unauthorised": "unauthorised",
};

const purchaseableBaitTranslation: Record<PurchaseableBaitTranslation, string> =
  {
    "purchaseableBait.fishingLure.description":
      "Great for catching rare fish ! ",
  };

const quest: Record<Quest, string> = {
  "quest.mint.free": "Mint Free Wearable",
  "quest.equipWearable": "Equip this wearable on your Bumpkin",
  "quest.congrats": "Congratulations, you have minted a",
};

const questions: Record<Questions, string> = {
  "questions.obtain.MATIC": "How do I get MATIC?",
  "questions.lowCash": "Short on Cash?",
};

const reaction: Record<Reaction, string> = {
  "reaction.bumpkin": "Lvl 3 Bumpkin",
  "reaction.bumpkin.10": "Lvl 10 Bumpkin",
  "reaction.bumpkin.30": "Lvl 30 Bumpkin",
  "reaction.bumpkin.40": "Lvl 40 Bumpkin",
  "reaction.sunflowers": "Harvest 100,000 Sunflowers",
  "reaction.crops": "Harvest 10,000 crops",
  "reaction.goblin": "Turn into a Goblin",
  "reaction.crown": "Own a Goblin Crown",
};

const reactionBud: Record<ReactionBud, string> = {
  "reaction.bud.show": "Show your buds",
  "reaction.bud.select": "Select a bud to place in the plaza",
  "reaction.bud.noFound": "No buds found in your inventory",
};

const refunded: Record<Refunded, string> = {
  "refunded.itemsReturned": "Your items have been returned to your inventory",
  "refunded.goodLuck": "Good luck next time!",
};

const removeKuebiko: Record<RemoveKuebiko, string> = {
  "removeKuebiko.title": "Remove Kuebiko",
  "removeKuebiko.description":
    "This action will remove all your seeds from your inventory.",
  "removeKuebiko.removeSeeds": "Remove seeds",
};

const resale: Record<Resale, string> = {
  "resale.actionText": "Resale",
};

const restock: Record<Restock, string> = {
  "restock.one.buck":
    "You are going to use 1 Block Buck to restock all shop items in the game.",
  "restock.sure": "Are you sure you want to Restock?",
  "restock.seed.buy": "You have too many seeds in your basket!",
};

const retreatTerms: Record<RetreatTerms, string> = {
  "retreatTerms.lookingForRareItems": "Looking for rare items?",
  "retreatTerms.resale.one":
    "Players can trade special items they crafted in-game.",
  "retreatTerms.resale.two":
    "You can purchase these on secondary marketplaces like OpenSea.",
  "retreatTerms.resale.three": "View items on OpenSea",
};

const resources: Record<Resources, string> = {
  "resources.recoversIn": "Recovers in:",
  "resources.boulder.rareMineFound": "You found a rare mine!",
  "resources.boulder.advancedMining": "Advanced mining on its way.",
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
  "reward.promo.code": "Enter your promo code",
  "reward.woohoo": "Woohoo! Here is your reward",
  "reward.connectWeb3Wallet": "Connect a Web3 Wallet for a daily reward.",
};

const rulesGameStart: Record<RulesGameStart, string> = {
  "rules.gameStart":
    "At the beginning of the game, the plant will randomly pick a combination of 4 potions and 1 'chaos' potion. The combination can be all different or all the same.",
  "rules.chaosPotionRule":
    "If you add the 'chaos' potion your score for that attempt will be 0.",
  "rules.potion.feedback":
    "Select your potions and unveil the secrets of the plants!",
  "BloomBoost.description": "Ignite your plants with vibrant blooms!",
  "DreamDrip.description":
    "Drizzle your plants with magical dreams and fantasies.",
  "EarthEssence.description":
    "Harness the power of the earth to nurture your plants.",
  "FlowerPower.description":
    "Unleash a burst of floral energy upon your plants.",
  "SilverSyrup.description":
    "A sweet syrup to bring out the best in your plants.",
  "HappyHooch.description":
    "A potion to bring joy and laughter to your plants.",
  "OrganicOasis.description":
    "Create a lush, organic paradise for your plants.",
};

const rulesTerms: Record<RulesTerms, string> = {
  "game.rules": "Правила игры",
  "rules.oneAccountPerPlayer": "1 аккаунт на игрока",
  "rules.gameNotFinancialProduct": "Это игра. Не финансовый продукт.",
  "rules.noBots": "Без ботоводства или автоматизации",
  "rules.termsOfService": "Пользовательское соглашение",
};

const pwaInstall: Record<PwaInstall, string> = {
  "install.app": "Install App",
  "magic.link": "Magic Link",
  "generating.link": "Generating Link",
  "generating.code": "Generating Code",
  "install.app.desktop.description":
    "Scan the code below to install on your device. Please be sure to open in either Safari or Chrome browser.",
  "install.app.mobile.metamask.description":
    "Copy the magic link below and open it in {{browser}} on your device to install!",
  "do.not.share.link": "Do not share this link!",
  "do.not.share.code": "Do not share this code!",
  "qr.code.not.working": "QR code not working?",
};

const sceneDialogueKey: Record<SceneDialogueKey, string> = {
  "sceneDialogues.chefIsBusy": "Chef is busy",
};

const seasonTerms: Record<SeasonTerms, string> = {
  "season.access": "У вас есть доступ к",
  "season.banner": "Сезонный Баннер",
  "season.bonusTickets": "Бонусные Сезонные Билеты",
  "season.boostXP": "+10% Опыта от еды",
  "season.buyNow": "Купить сейчас",
  "season.discount": "Скидка 25% SFL на сезонные предметы",
  "season.exclusiveOffer": "Эксклюзивное предложение!",
  "season.goodLuck": "Удачи в сезоне!",
  "season.includes": "Содержит:",
  "season.limitedOffer": "Ограниченное время!",
  "season.wearableAirdrop": "Аирдроп Сезонной Одежды",
  "season.place.land": "You must place it on your land",
};

const settingsMenu: Record<SettingsMenu, string> = {
  "settingsMenu.timeMachine": "Time Machine",
  "settingsMenu.storeOnChain": "Store on Chain",
  "settingsMenu.howToPlay": "How to Play?",
  "settingsMenu.swapMaticForSFL": "Swap MATIC for SFL",
  "settingsMenu.share": "Share",
  "settingsMenu.confirmLogout": "Are you sure you want to Logout?",
};

const share: Record<Share, string> = {
  "share.TweetText": "Visit My Sunflower Land Farm",
  "share.ShareYourFarmLink": "Share Your Farm Link",
  "share.ShowOffToFarmers":
    "Show off to fellow farmers by sharing your farm link (URL: to directly visit your farm!",
  "share.FarmNFTImageAlt": "Sunflower-Land Farm NFT Image",
  "share.CopyFarmURL": "Copy farm URL",
  "share.Tweet": "Tweet",
  "share.chooseServer": "Choose a server to join",
  "share.FULL": "FULL",
  "share.exploreCustomIslands": "Explore custom project islands.",
  "share.buildYourOwnIsland": "Do you want to build your own island?",
};

const sharkBumpkinDialogues: Record<SharkBumpkinDialogues, string> = {
  "sharkBumpkin.dialogue.shhhh": "Shhhh!",
  "sharkBumpkin.dialogue.scareGoblins": "I'm trying to scare the Goblins.",
};

const shelly: Record<Shelly, string> = {
  "shelly.Dialogue.one": "Howdy, Bumpkin! Welcome to the beach!",
  "shelly.Dialogue.two":
    "After a hard day's work on your farm, there's no better place to kick back and enjoy the waves.",
  "shelly.Dialogue.three":
    "But we've got a bit of a situation. A massive kraken has emerged and taken control of our beloved beach.",
  "shelly.Dialogue.four":
    "We could really use your help, dear. Grab your bait and fishing rods, and together, we'll tackle this colossal problem!",
  "shelly.Dialogue.five":
    "For each tentacle you catch I will provide you with valuable mermaid scales!",
  "shelly.Dialogue.letsgo": "Let's do it!",
};

const shellyDialogue: Record<ShellyDialogue, string> = {
  "shellyPanelContent.tasksFrozen":
    "I am waiting for the new season to start. Come back to me then!",
  "shellyPanelContent.canTrade":
    "Oh my, you've got a Kraken Tentacle! I'll swap it for some mermaid scales.",
  "shellyPanelContent.cannotTrade":
    "Looks like you don't have any Kraken Tentacles at hand! Come back when you do.",
  "shellyPanelContent.swap": "Swap",
  "krakenIntro.congrats":
    "Well done! The Kraken has stopped terrorising Bumpkins.",
  "krakenIntro.noMoreTentacles":
    "You have collected all the tentacles for the week. Let's keep a close eye on it, I'm sure the hunger will return.",
  "krakenIntro.gotIt": "Got it!",
  "krakenIntro.appetiteChanges":
    "The Kraken's appetite is constantly changing.",
  "krakenIntro.currentHunger":
    "Right now it has a hunger for ....Phew, that's better than Bumpkins.",
  "krakenIntro.catchInstruction":
    "Head to your fishing spot and try catch the beast!",
};

const shopItems: Record<ShopItems, string> = {
  "betty.post.sale.one": "Эй, привет! С возвращением.",
  "betty.post.sale.two":
    "Ты помог справиться с нехваткой урожая, и цены вернулись к прежним.",
  "betty.post.sale.three":
    "Теперь поднимем планку: сажаем более долгосрочные и дорогие культуры!",
  "betty.welcome": "Welcome to my market. What would you like to do?",
  "betty.buySeeds": "Buy seeds",
  "betty.sellCrops": "Sell crops",
};

const showingFarm: Record<ShowingFarm, string> = {
  "showing.farm": "Showing on Farm",
  "showing.wallet": "In Wallet",
};

const snorklerDialogues: Record<SnorklerDialogues, string> = {
  "snorkler.vastOcean": "It is a vast ocean!",
  "snorkler.goldBeneath": "There must be gold somewhere beneath the surface.",
};

const somethingWentWrong: Record<SomethingWentWrong, string> = {
  "somethingWentWrong.supportTeam": "support team",
  "somethingWentWrong.jumpingOver": "or jumping over to our",
  "somethingWentWrong.askingCommunity": "and asking our community.",
};

const specialEvent: Record<SpecialEvent, string> = {
  "special.event.easterIntro":
    "Oh no, my 6 rabbits have gone missing again....they must be searching for food. Can you help me find them? They look similar to other rabbits but have a unique sparkle. Click on them to capture them.",
  "special.event.rabbitsMissing": "Rabbits missing",
  "special.event.link": "Airdrop link",
  "special.event.claimForm":
    "Please fill in the form below to claim your airdrop.",
  "special.event.airdropHandling":
    "Airdrops are handled externally and may take a few days to arrive.",
  "special.event.walletRequired": "Wallet Required",
  "special.event.web3Wallet":
    "A Web3 wallet is required to claim this airdrop.",
  "special.event.airdrop": "Airdrop",
  "special.event.finishedLabel": "Event Finished",
  "special.event.finished":
    "This event has finished. Stay tuned for future events!",
  "special.event.ineligible":
    "There is no work needing to be done right now, thanks for stopping by though!",
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
  "statements.lvlUp": "Feed your Bumpkin to level up",
  "statements.maintenance":
    "New things are coming! Thanks for your patience, the game will be live again shortly.",
  "statements.minted": "The goblins have crafted your ",
  "statements.minting":
    "Please be patient while your item is minted on the Blockchain.",
  "statements.mutant.chicken":
    "Congratulations, your chicken has laid a very rare mutant chicken!",
  "statements.news":
    "Recieve the latest news, complete chores & feed your Bumpkin.",
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
  "statements.sflLim.one": "You have reached the daily SFL limit.",
  "statements.sflLim.two":
    "You can continue playing, but will need to wait until tomorrow to sync again.",
  "statements.sniped": "Oh no! Another player bought that trade before you.",
  "statements.switchNetwork": "Add or Switch Network",
  "statements.sync":
    "Please bear with us while we sync all of your data on chain.",
  "statements.tapCont": "Tap to continue",
  "statements.price.change":
    "Oh no! Looks like the price has changed, please try again!",

  "statements.tutorial.one":
    "The boat will take you between islands where you can discover new lands and exciting adventures.",
  "statements.tutorial.two":
    "Many lands are far away and will require an experienced Bumpkin before you can visit them.",
  "statements.tutorial.three":
    "Your adventure begins now, how far you explore ... that is on you.",
  "statements.visit.firePit":
    "Visit the Fire Pit to cook food and feed your Bumpkin.",
  "statements.wishing.well.info.four": "provide liquidity",
  "statements.wishing.well.info.five": " in the game",
  "statements.wishing.well.info.six": "providing liquidity",
  "statements.wishing.well.worthwell": "worth of rewards in the well!",
  "statements.wishing.well.look.like": "It doesn't look like you are",
  "statements.wishing.well.lucky": "Let's see how lucky you are!",
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
  "statements.wallet.to.inventory.transfer": "Deposit items from your wallet",
  "statements.crop.water": "These crops need water!",
  "statements.daily.limit": "Daily Limit",
  "statements.sure.buy": "Are you sure you want to buy",
  "statements.perplayer": "per Player",
  "statements.minted.goToChest": "Go to your chest and place it on your island",
  "statements.minted.withdrawAfterMint":
    "You will be able to withdraw your item once the mint has finished",
  "statements.startgame": "Start New Game",

  "statements.session.expired":
    "It looks like your session has expired. Please refresh the page to continue playing.",
  "statements.translation.contribution":
    "If you are interested in contributing translations for your preferred language, please contact one of the Moderators in the Sunflower Land Discord Server:",
  "statements.translation.joinDiscord": "Join Discord",
};

const stopGoblin: Record<StopGoblin, string> = {
  "stopGoblin.stop.goblin": "Stop the Goblins!",
  "stopGoblin.stop.moon": "Stop the Moon Seekers!",
  "stopGoblin.tap.one": "Tap the Moon Seekers before they steal your resources",
  "stopGoblin.tap.two": "Tap the Goblins before they eat your food",
  "stopGoblin.left": "Attempts left",
};

const subSettings: Record<SubSettings, string> = {
  "subSettings.disableAnimations": "Disable Animations",
  "subSettings.enableAnimations": "Enable Animations",
  "subSettings.logout": "Logout",
  "subSettings.transferOwnership": "Transfer Ownership",
  "subSettings.refreshDescription":
    "Refresh your session to grab the latest changes from the Blockchain. This is useful if you deposited items to your farm.",
};

const swarming: Record<Swarming, string> = {
  "swarming.tooLongToFarm":
    "Pay attention, you took too long to farm your crops!",
  "swarming.goblinsTakenOver":
    "The Goblins have taken over your farm. You must wait for them to leave",
};

const tieBreaker: Record<TieBreaker, string> = {
  "tieBreaker.tiebreaker": "Tiebreaker",
  "tieBreaker.closeBid":
    "A tie breaker is chosen by whichever Bumpkin has more experience. Unfortunately you lost.",
  "tieBreaker.betterLuck":
    "Time to eat some more cakes! Better luck next time.",
  "tieBreaker.refund": "Refund resource",
};

const toolDescriptions: Record<ToolDescriptions, string> = {
  // Tools
  "description.axe": "Used to collect wood",
  "description.pickaxe": "Used to collect stone",
  "description.stone.pickaxe": "Used to collect iron",
  "description.iron.pickaxe": "Used to collect gold",
  "description.rod": "Used to catch fish",
  "description.rusty.shovel": "Used to remove buildings and collectibles",
  "description.shovel": "Plant and harvest crops.",
  "description.sand.shovel": "Used for digging treasure",
  "description.sand.drill": "Drill deep for uncommon or rare treasure",
  "description.gold.pickaxe": "Used to collect crimstone and sunstone",
};

const transactionTerms: Record<TransactionTerms, string> = {
  "transaction.t&c.one":
    "Accept the terms and conditions to sign in to Sunflower Land.",
  "transaction.t&c.two": "Accept Terms and Conditions",
  "transaction.mintFarm": "Your farm has been minted!",
  "transaction.farm.ready": "Your farm will be ready in",
  "transaction.networkFeeRequired":
    "To secure your NFTs on the Blockchain, a small network fee is required.",
  "transaction.estimated.fee": "Estimated fee",
  "transaction.payCardCash": "Pay with Card/Cash",
  "transaction.creditCard": "*Credit card fees apply",
  "transaction.rejected": "Transaction Rejected!",
  "transaction.message0":
    "You need to accept the transaction in the metamask popup to continue.",
  "transaction.noFee":
    "This request will not trigger a blockchain transaction or cost any gas fees.",
  "transaction.chooseDonationGame":
    "Thank you for your support! Kindly choose the game that you like donate to.",
  "transaction.minblockbucks": "Minimum 5 Block Bucks",
  "transaction.payCash": "Pay with Cash",
  "transaction.matic": "Matic",
  "transaction.payMatic": "Pay with MATIC",
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
  "transaction.withdraw.one": "Withdrawing",
  "transaction.withdraw.sent": "Your items/tokens have been sent to",
  "transaction.withdraw.view": "You can view your items on",
  "transaction.openSea": "OpenSea",
  "transaction.withdraw.four":
    "You can view your tokens by importing the SFL Token to your wallet.",
  "transaction.withdraw.five": "Import SFL Token to MetaMask",
  "transaction.displayItems":
    "Please note that OpenSea can take up to 30 minutes to display your items. You can also view your items on",
  "transaction.withdraw.polygon": "PolygonScan",
  "transaction.id": "Transaction ID",
  "transaction.termsOfService": "Accept the terms of service",
  "transaction.termsOfService.one":
    "In order to buy your farm you will need to accept the Sunflower Land terms of service.",
  "transaction.termsOfService.two":
    "This step will take you back to your new sequence wallet to accept the terms of service.",
  "transaction.buy.BlockBucks": "Buy Block Bucks",
};

const transfer: Record<Transfer, string> = {
  "transfer.sure.adress":
    "Please ensure that the address you provided is on the Polygon Blockchain, is correct and is owned by you. There is no recovery from incorrect addresses.",
  "transfer.Account":
    "Your Account #{{farmID}} has been transferred to {{receivingAddress}}!",
  "transfer.Farm": "Transferring your farm!",
  "transfer.Refresh": "Do not refresh this browser",
  "transfer.Taccount": "Transfer your account",
  "transfer.address": "Wallet address: ",
};

const treasureModal: Record<TreasureModal, string> = {
  "treasureModal.noShovelTitle": "No Sand Shovel!",
  "treasureModal.needShovel":
    "You need to have a Sand Shovel equipped to be able to dig for treasure!",
  "treasureModal.purchaseShovel":
    "If you need to purchase one, you can head to the Treasure Shop at the southern end of the island.",
  "treasureModal.gotIt": "Got it",
  "treasureModal.maxHolesTitle": "Max holes reached!",
  "treasureModal.saveTreasure": "Save some treasure for the rest of us!",
  "treasureModal.comeBackTomorrow":
    "Come back tomorrow to search for more treasure.",
  "treasureModal.drilling": "Drilling",
};

const tutorialPage: Record<TutorialPage, string> = {
  "tutorial.pageOne.text1":
    "This menu will show you the levels required to unlock new buildings.",
  "tutorial.pageOne.text2":
    "Some of these can be built multiple times once you reach a certain level.",
  "tutorial.pageTwo.text1":
    "Buildings are an important way to progress through the game as they will help you to expand and evolve.",
  "tutorial.pageTwo.text2":
    "Lets start by leveling up our Bumpkin so we can get the Workbench to learn about tools.",
};

const visitislandEnter: Record<VisitislandEnter, string> = {
  "visitIsland.enterIslandId": "Enter Island ID",
  "visitIsland.visit": "Visit",
};

const visitislandNotFound: Record<VisitislandNotFound, string> = {
  "visitislandNotFound.title": "Island Not Found!",
};

const wallet: Record<Wallet, string> = {
  "wallet.connect": "Connect your wallet",
  "wallet.linkWeb3": "Link a Web3 Wallet",
  "wallet.setupWeb3":
    "To access this feature, you must first setup a Web3 wallet",
  "wallet.wrongWallet": "Wrong Wallet",
  "wallet.connectedWrongWallet": "You are connected to the wrong wallet",
  "wallet.missingNFT": "Missing NFT",
  "wallet.requireFarmNFT":
    "Some actions require a Farm NFT. This helps keep all of your items secure on the Blockchain",
  "wallet.uniqueFarmNFT":
    "A unique farm NFT will be minted to store your progress",
  "wallet.mintFreeNFT": "Mint your free NFT",
  "wallet.wrongChain": "Wrong Chain",
  "wallet.walletAlreadyLinked": "Wallet already linked",
  "wallet.linkAnotherWallet": "Please link another wallet",
  "wallet.transferFarm":
    "Please transfer the farm to another wallet in order to mint the new account",
  "wallet.signRequest": "Sign",
  "wallet.signRequestInWallet": "Sign the request in your wallet to continue",
};

const warningTerms: Record<WarningTerms, string> = {
  "warning.noAxe": "No Axe Selected!",
  "warning.chat.maxCharacters": "Max characters",
  "warning.chat.noSpecialCharacters": "No special characters",
  "warning.level.required": "Необходимый уровень: {{lvl}}",
  "warning.hoarding.message":
    "Are you {{indefiniteArticle}} {{itemName}} hoarder?!",
  // indefiniteArticle: 'a' or 'an' depending if first letter is vowel.
  // If this is not used in your language, leave the `{{indefiniteArticle}}` part out
  "warning.hoarding.indefiniteArticle.a": "a", // Leave this blank if not needed
  "warning.hoarding.indefiniteArticle.an": "an", // Leave this blank if not needed
  "warning.hoarding.one":
    "Word is that Goblins are known to raid farms that have an abundance of resources.",
  "warning.hoarding.two":
    "To protect yourself and keep those precious resources safe, please store your progress on chain.",
  "travelRequirement.notice": "Before travelling, you must level up.",
};

const welcomeTerms: Record<WelcomeTerms, string> = {
  "welcome.createAccount": "Создать аккаунт",
  "welcome.creatingAccount": "Creating your account",
  "welcome.email": "Email & Social Login",
  "welcome.login": "Авторизация",
  "welcome.needHelp": "Нужна помощь?",
  "welcome.otherWallets": "Другие кошельки",
  "welcome.signingIn": "Выполняется вход",
  "welcome.signIn.Message": "Для входа подпишите сообщение в кошельке.",
  "welcome.takeover.ownership":
    "It looks like you are new to Sunflower Land and have claimed ownership of another player's account.",
  "welcome.promo": "Add Promo Code",
  "welcome.offline":
    "Hey there Bumpkin, it looks like you aren't online. Please check your network connection.",
};

const winner: Record<Winner, string> = {
  "winner.mintTime": "You have 24 hours to mint your prize.",
  "winner.mintTime.one": "No items available to craft!",
};

const wishingWellTerms: Record<WishingWell, string> = {
  "wishingWell.makeWish": "Grant a new wish and see how lucky you are!",
  "wishingWell.newWish":
    "A new wish has been made for you based on your current balance of LP tokens!",
  "wishingWell.noReward":
    "You have no reward available! Liquidity needs to be held for 3 days to get a reward!",
  "wishingWell.wish.lucky": "Grant a new wish and see how lucky you are!",
  "wishingWell.sflRewardsReceived": "SFL rewards received",
  "wishingWell.wish.grantTime": "It's time to grant your wish!",
  "wishingWell.wish.granted": "Your wish has been granted.",
  "wishingWell.wish.made": "You have made a wish!",
  "wishingWell.wish.timeTillNextWish": "Time till next wish",
  "wishingWell.wish.thanksForSupport":
    "Thanks for supporting the project and making a wish.",
  "wishingWell.wish.comeBackAfter":
    "Come back in the following amount of time to see just how lucky you have been",
  "wishingWell.wish.warning.one":
    "Be aware that only the LP tokens you held at the time the wish was made will be considered when the wish is granted.",
  "wishingWell.wish.warning.two":
    "If you remove your liquidity during this time you won't receive any rewards.",
  "wishingWell.info.one":
    "The wishing well is a magical place where SFL rewards can be made just by making a wish!",
  "wishingWell.info.two":
    "Wishes are granted to farmers who provided liquidity in the game. More info",
  "wishingWell.info.three":
    "Looks like you have those magic LP tokens in your wallet!",
  "wishingWell.moreInfo": "More info",
  "wishingWell.noLiquidity":
    "It doesn't look like you're providing liquidity yet. More info,",
  "wishingWell.rewardsInWell": "Amount of rewards in the well",
  "wishingWell.luck": "Let's see how lucky you are!",
};

const withdraw: Record<Withdraw, string> = {
  "withdraw.proof":
    "Proof of humanity is needed for this feature. Please take a quick selfie.",
  "withdraw.verification": "Start Verification",
  "withdraw.unsave": "Any unsaved progress will be lost.",
  "withdraw.sync":
    "You can only withdraw items that you have synced to the blockchain.",
  "withdraw.available": "Available May 9th",
  "withdraw.sfl.available": "SFL is available on-chain",
  "withdraw.send.wallet": "Sent to your wallet",
  "withdraw.choose": "Choose amount to withdraw",
  "withdraw.receive": "You will receive",
  "withdraw.select.item": "Select items to withdraw",
  "withdraw.opensea":
    "Once withdrawn, you will be able to view your items on OpenSea.",
  "withdraw.restricted":
    "Some items cannot be withdrawn. Other items may be restricted when",
  "withdraw.bumpkin.wearing":
    "Your Bumpkin is currently wearing the following item(s) that can't be withdrawn. You will need to unequip them before you can withdraw.",
  "withdraw.bumpkin.sure.withdraw":
    "Are you sure you want to withdraw your Bumpkin?",
  "withdraw.bumpkin.play":
    "To play the game, you always need a Bumpkin on your farm.",
  "withdraw.buds": "Select Buds to withdraw",
  "withdraw.budRestricted": "Used in today's bud box",
};

const world: Record<World, string> = {
  "world.intro.one": "Howdy Traveller! Welcome to the Pumpkin Plaza.",
  "world.intro.two":
    "The plaza is home to a diverse group of hungry Bumpkins and Goblins that need your help!",
  "world.intro.three": "A few quick hints before you begin your adventure:",
  "world.intro.visit":
    "Visit NPCs and complete deliveries to earn SFL and rare rewards.",
  "world.intro.craft":
    "Craft rare collectibles, wearables and decorations at the different shops.",
  "world.intro.carf.limited":
    "Hurry, items are only available for a limited time!",
  "world.intro.trade":
    "Trade resources with other players. To interact with a player, walk nearby and click on them.",
  "world.intro.auction":
    "Prepare your resources & visit the Auction House to compete with other players for rare collectibles!",
  "world.intro.four": "To move your Bumpkin, use the keyboard arrow keys",
  "world.intro.five": "On touch screen, use the joystick.",
  "world.intro.six":
    "To interact with a Bumpkin or an object, walk near it and click it",
  "world.intro.seven":
    "No harrasment, swearing or bullying. Thank you for respecting others.",
  "world.plaza": "Plaza",
  "world.beach": "Beach",
  "world.woodlands": "Woodlands",
  "world.retreat": "Retreat",
  "world.home": "Home",
  "world.kingdom": "Kingdom",
};

const wornDescription: Record<WornDescription, string> = {
  "worm.earthworm": "A wriggly worm that attracts small fish.",
  "worm.grub": "A juicy grub - perfect for advanced fish.",
  "worm.redWiggler": "An exotic worm that entices rare fish.",
};

const milestoneMessages: Record<MilestoneMessages, string> = {
  "milestone.noviceAngler":
    "Congratulations, you've just reached the Novice Angler milestone! You're well on your way to becoming a fishing pro by catching each basic fish.",
  "milestone.advancedAngler":
    "Impressive, you've just reached the Advanced Angler milestone! You've mastered the art of catching each advanced fish. Keep it up!",
  "milestone.expertAngler":
    "Wow, you've just reached the Expert Angler milestone! You're a true fishing expert now! Catching 300 fish is no small feat.",
  "milestone.fishEncyclopedia":
    "Congratulations, you've just reached the Fish Encyclopedia milestone! You've become a true fish connoisseur! Discovering each basic, advanced, and expert fish is a remarkable achievement.",
  "milestone.masterAngler":
    "Wow, you've just reached the Master Angler milestone! Catching 1500 fish is a testament to your fishing skills.",
  "milestone.marineMarvelMaster":
    "Congratulations, you've just reached the Marine Marvel Master milestone! You're the undisputed champion of the seas! Catching each Marvel proves your fishing prowess like no other.",
  "milestone.deepSeaDiver":
    "Congratulations, you've just reached the Deep Sea Diver milestone! You have earnt the Deep Sea Helm - a mysterious Crown that attracts Marine Marvels to your hook.",
  "milestone.sunpetalSavant":
    "Congratulations, you've just reached the Sunpetal Savant milestone! You've discovered each Sunpetal variant. You're a true Sunpetal expert!",
  "milestone.bloomBigShot":
    "Congratulations, you've just reached the Bloom Big Shot milestone! You've discovered each Bloom variant. You're a true Bloom expert!",
  "milestone.lilyLuminary":
    "Congratulations, you've just reached the Lily Luminary milestone! You've discovered each Lily variant. You're a true Lily expert!",
};

const event: Record<Event, string> = {
  "event.christmas": "Christmas event!",
  "event.LunarNewYear": "Lunar New Year Event",
  "event.GasHero": "Gas Hero Event",
  "event.Easter": "Easter Event",
  "event.valentines.rewards": "Valentine Rewards",
};

const promo: Record<Promo, string> = {
  "promo.cdcBonus": "Crypto.com Bonus!",
  "promo.expandLand": "Expand your land twice to claim 100 SFL.",
};

const trader: Record<Trader, string> = {
  "trader.you.pay": "You pay",
  "trader.price.per.unit": "Price per unit",
  "trader.goblin.fee": "Goblin fee",
  "trader.they.receive": "They receive",
  "trader.seller.receives": "Seller receives",
  "trader.buyer.pays": "Buyer pays",
  "trader.cancel.trade": "Cancel trade",
  "trader.you.receive": "You receive",
  "trader.PoH":
    "Proof of humanity is needed for this feature. Please take a quick selfie.",
  "trader.start.verification": "Start Verification",
};

export const NYON_STATUE: Record<NyonStatue, string> = {
  "nyonStatue.memory": "In memory of",
  "nyonStatue.description":
    "The legendary knight responsible for clearing the goblins from the mines. Shortly after his victory he died by poisoning from a Goblin conspirator. The Sunflower Citizens erected this statue with his armor to commemorate his conquests.",
};

const trading: Record<Trading, string> = {
  "trading.select.resources": "Select resources to view listings",
  "trading.no.listings": "No listings found",
  "trading.listing.congrats":
    " Congratulations, you just listed your items for trade!",
  "trading.listing.deleted": "Your listing has been deleted",
  "trading.listing.fulfilled": "Trade has been fulfilled",
  "trading.your.listing": "Your listing",
  "trading.you.receive": "You receive",
  "trading.burned": "is burned.",
};

export const restrictionReason: Record<RestrictionReason, string> = {
  "restrictionReason.isGrowing": "{{item}} is growing",
  "restrictionReason.beanPlanted": "Magic Bean is planted",
  "restrictionReason.cropsGrowing": "Crops are growing",
  "restrictionReason.basicCropsGrowing": "Basic crops are growing",
  "restrictionReason.mediumCropsGrowing": "Medium crops are growing",
  "restrictionReason.advancedCropsGrowing": "Advanced crops are growing",
  "restrictionReason.fruitsGrowing": "Fruits are growing",
  "restrictionReason.treesChopped": "Trees are chopped",
  "restrictionReason.stoneMined": "Stone is mined",
  "restrictionReason.ironMined": "Iron is mined",
  "restrictionReason.goldMined": "Gold is mined",
  "restrictionReason.crimstoneMined": "Crimstone is mined",
  "restrictionReason.chickensFed": "Chickens are fed",
  "restrictionReason.treasuresDug": "Treasure holes are dug",
  "restrictionReason.inUse": "In use",
  "restrictionReason.recentlyUsed": "Recently used",
  "restrictionReason.recentlyFished": "Recently fished",
  "restrictionReason.flowersGrowing": "Flowers are growing",
  "restrictionReason.beesBusy": "Bees are busy",
  "restrictionReason.pawShaken": "Paw shaken",
  "restrictionReason.festiveSeason": "Locked during festive season",
  "restrictionReason.noRestriction": "No restriction",
  "restrictionReason.genieLampRubbed": "Genie Lamp rubbed",
};

export const RUSSIAN_TERMS: Record<TranslationKeys, string> = {
  ...achievementTerms,
  ...auction,
  ...addSFL,
  ...availableSeeds,
  ...base,
  ...basicTreasure,
  ...beach,
  ...beehive,
  ...beachLuck,
  ...birdiePlaza,
  ...boostDescriptions,
  ...boostEffectDescriptions,
  ...bountyDescription,
  ...buildingDescriptions,
  ...bumpkinDelivery,
  ...bumpkinItemBuff,
  ...bumpkinPartRequirements,
  ...bumpkinSkillsDescription,
  ...bumpkinTrade,
  ...buyFarmHand,
  ...claimAchievement,
  ...chat,
  ...chickenWinner,
  ...choresStart,
  ...chumDetails,
  ...community,
  ...compostDescription,
  ...composterDescription,
  ...confirmSkill,
  ...confirmationTerms,
  ...conversations,
  ...cropBoomMessages,
  ...cropFruitDescriptions,
  ...deliveryitem,
  ...defaultDialogue,
  ...decorationDescriptions,
  ...delivery,
  ...deliveryHelp,
  ...depositWallet,
  ...detail,
  ...discordBonus,
  ...donation,
  ...draftBid,
  ...errorAndAccess,
  ...errorTerms,
  ...exoticShopItems,
  ...festiveTree,
  ...fishDescriptions,
  ...fishermanModal,
  ...fishermanQuest,
  ...fishingChallengeIntro,
  ...fishingGuide,
  ...fishingQuests,
  ...flowerBed,
  ...flowerbreed,
  ...flowerShopTerms,
  ...foodDescriptions,
  ...garbageCollector,
  ...gameDescriptions,
  ...gameTerms,
  ...generalTerms,
  ...genieLamp,
  ...getContent,
  ...getInputErrorMessage,
  ...goblin_messages,
  ...goldTooth,
  ...goldpassModal,
  ...guideTerms,
  ...guideCompost,
  ...guideCompost,
  ...halveningCountdown,
  ...harvestflower,
  ...harvestBeeHive,
  ...hayseedHankPlaza,
  ...hayseedHankV2,
  ...helper,
  ...heliosSunflower,
  ...henHouseTerms,
  ...howToFarm,
  ...howToSync,
  ...howToUpgrade,
  ...islandupgrade,
  ...interactableModals,
  ...introPage,
  ...islandName,
  ...islandNotFound,
  ...landscapeTerms,
  ...letsGo,
  ...levelUpMessages,
  ...loser,
  ...lostSunflorian,
  ...megaStore,
  ...milestoneMessages,
  ...modalDescription,
  ...noaccount,
  ...noBumpkin,
  ...noTownCenter,
  ...notOnDiscordServer,
  ...nftminting,
  ...npc,
  ...npcDialogues,
  ...npc_message,
  ...nyeButton,
  ...obsessionDialogue,
  ...offer,
  ...onCollectReward,
  ...onboarding,
  ...orderhelp,
  ...pageFounds,
  ...pending,
  ...personHood,
  ...piratechest,
  ...pirateQuest,
  ...pickserver,
  ...plazaSettings,
  ...playerTrade,
  ...portal,
  ...purchaseableBaitTranslation,
  ...quest,
  ...questions,
  ...reaction,
  ...reactionBud,
  ...refunded,
  ...removeKuebiko,
  ...resale,
  ...restock,
  ...retreatTerms,
  ...resources,
  ...resourceTerms,
  ...rewardTerms,
  ...rulesGameStart,
  ...rulesTerms,
  ...pwaInstall,
  ...sceneDialogueKey,
  ...seasonTerms,
  ...settingsMenu,
  ...share,
  ...sharkBumpkinDialogues,
  ...shelly,
  ...shellyDialogue,
  ...shopItems,
  ...showingFarm,
  ...snorklerDialogues,
  ...somethingWentWrong,
  ...specialEvent,
  ...statements,
  ...stopGoblin,
  ...subSettings,
  ...swarming,
  ...tieBreaker,
  ...timeUnits,
  ...toolDescriptions,
  ...transactionTerms,
  ...transfer,
  ...treasureModal,
  ...tutorialPage,
  ...visitislandEnter,
  ...visitislandNotFound,
  ...wallet,
  ...warningTerms,
  ...welcomeTerms,
  ...wishingWellTerms,
  ...withdraw,
  ...winner,
  ...world,
  ...wornDescription,
  ...event,
  ...promo,
  ...trader,
  ...NYON_STATUE,
  ...trading,
  ...goblinTrade,
  ...restrictionReason,
};
