import { ENGLISH_TERMS } from "./englishDictionary";
import {
  AchievementsTerms,
  Auction,
  AddSFL,
  AvailableSeeds,
  Base,
  BasicTreasure,
  Beehive,
  BirdiePlaza,
  BoostDescriptions,
  BoostEffectDescriptions,
  BountyDescription,
  BuildingDescriptions,
  BumpkinDelivery,
  BumpkinItemBuff,
  BumpkinPart,
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
  CropMachine,
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
  Factions,
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
  GameOptions,
  GameTerms,
  GarbageCollector,
  GeneralTerms,
  GenieLamp,
  GetContent,
  GetInputErrorMessage,
  GOBLIN_MESSAGES,
  GoldTooth,
  GreenhouseKeys,
  GuideCompost,
  GuideTerms,
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
  Leaderboard,
  LetsGo,
  LevelUpMessages,
  Loser,
  LostSunflorian,
  MegaStore,
  Minigame,
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
  Pending,
  PersonHood,
  PirateChest,
  PirateQuest,
  Pickserver,
  PlayerTrade,
  Portal,
  PurchaseableBaitTranslation,
  Quest,
  Questions,
  Reaction,
  ReactionBud,
  Refunded,
  RemoveCropMachine,
  RemoveHungryCaterpillar,
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
  Share,
  SharkBumpkinDialogues,
  ShopItems,
  ShowingFarm,
  SnorklerDialogues,
  SomethingWentWrong,
  SpecialEvent,
  Statements,
  StopGoblin,
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
  Username,
  EasterEggKeys,
  ChangeLanguage,
  FactionShopDescription,
  GuideFactionPet,
  DesertKeys,
} from "./types";

const generalTerms: Record<GeneralTerms, string> = {
  "2x.sale": "2x монет",
  achievements: "Достижения",
  "amount.matic": "Сумма в MATIC",
  deposit: "Внести",
  add: "Добавить",
  addSFL: "Добавить SFL",
  "add.liquidity": "Добавить ликвидность",
  "alr.claim": "Уже получено!",
  "alr.completed": "Уже завершено",
  "alr.crafted": "Уже скрафчено!",
  "alr.minted": "Уже сминчено!",
  "are.you.sure": "Вы уверены?",
  auction: "Аукцион",
  available: "Доступно",
  back: "Назад",
  bait: "Приманка",
  balance: "Баланс",
  "balance.short": "Бал",
  banner: "Баннер",
  banners: "Баннеры",
  basket: "Корзина",
  beta: "Бета",
  bid: "Ставка",
  bounty: "Сокровища",
  build: "Построить",
  buy: "Купить",
  cancel: "Отмена",
  "card.cash": "Карта / Наличные",
  check: "Проверить",
  chest: "Сундук",
  chores: "Список дел",
  "choose.wisely": "Выбирай с умом!",
  claim: "Забрать",
  "claim.gift": "Забрать подарок",
  "claim.skill": "Получить навык",
  clear: "Очистить",
  close: "Закрыть",
  coins: "Монеты",
  collect: "Собрать",
  "coming.soon": "Скоро",
  completed: "Завершено",
  complete: "Завершить",
  confirm: "Подтвердить",
  congrats: "Поздравляем",
  connecting: "Подключение",
  continue: "Продолжить",
  cook: "Приготовить",
  copied: "Скопировано",
  "copy.address": "Скопировать адрес",
  "copy.link": "Скопировать ссылку",
  "copy.failed": "Копирование не удалось",
  coupons: "Купоны",
  craft: "Скрафтить",
  crops: "Растения",
  danger: "Опасно",
  date: "Дата",
  deliver: "Доставить",
  deliveries: "Доставки",
  "deliveries.closed": "Доставки билетов закрыты",
  delivery: "Доставка",
  details: "Подробнее",
  donate: "Пожертвовать",
  donating: "Жертвуем",
  donations: "Пожертвования",
  earn: "Заработай",
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
  expired: "Expired",
  explore: "Исследовать",
  faction: "Фракция",
  farm: "Ферма",
  featured: "Рекомендуемый",
  fee: "комиссия",
  "feed.bumpkin": "Покормить бампкина",
  fertilisers: "Удобрения",
  fish: "Рыба",
  "fish.caught": "Поймано рыбы: ",
  flowers: "Цветы",
  "flowers.found": "Найденные цветы",
  foods: "Еда",
  for: "для",
  forbidden: "Запрещено",
  free: "Бесплатно",
  fruit: "Фрукт",
  fruits: "Фрукты",
  gift: "Подарок",
  "go.home": "Домой",
  gotIt: "Понял",
  "grant.wish": "Исполнить желание",
  greenhouse: "Теплица",
  growing: "Растет",
  guide: "Гайд",
  honey: "Мед",
  "hungry?": "Голоден?",
  info: "Инфо",
  item: "Предмет",
  land: "Земля",
  landscaping: "Landscaping",
  "last.updated": "Последнее обновление",
  "lets.go": "Погнали!",
  limit: "Лимит",
  "linked.wallet": "Подключенные кошельки",
  list: "Список",
  "list.trade": "Выставить",
  loading: "Загрузка",
  locked: "Недоступно",
  "loser.refund": "Вернуть ресурсы",
  lvl: "Уровень",
  maintenance: "Технические работы",
  "make.wish": "Загадать желание",
  "making.wish": "Загадываем желание",
  marks: "Marks",
  max: "Максимум",
  "max.reached": "Достигнут максимум",
  minimum: "Минимум",
  mint: "Сминтить",
  minting: "минтим",
  music: "Музыка",
  next: "Следующее",
  "next.order": "Следующий заказ",
  nextSkillPtLvl: "Следующий скилл поинт на уровне",
  no: "Нет",
  "no.delivery.avl": "Больше нет доставок",
  "no.limits.exceeded": "Лимиты не превышены",
  "no.mail": "Нет писем",
  "no.obsessions": "Нет одержимостей",
  "no.thanks": "Нет, спасибо",
  "ocean.fishing": "Рыбалка в океане",
  off: "Выключено",
  "offer.end": "Предложение заканчивается в",
  ok: "Ок",
  on: "В",
  open: "открыто",
  opened: ENGLISH_TERMS.opened,
  optional: "Дополнительно",
  "open.gift": "Открыть подарок",
  place: "Место",
  "place.map": "Место на карте",
  "place.bid": "Сделать ставку",
  "placing.bid": "Делаем ставку",
  plant: "Посадить",
  player: "Игрок",
  "play.again": "Сыграть снова",
  "please.try.again": "Попробуйте позже.",
  "pay.attention.feedback": "Обрати внимание на значки обратной связи",
  print: "Распечатать",
  purchased: "куплено",
  purchasing: "Покупаем",
  rank: "Ранг",
  "read.more": "прочитать дальше",
  refresh: "Обновить",
  refreshing: "Обновляем",
  remaining: "осталось",
  "remaining.free.listings":
    "Осталось {{listingsRemaining}} бесплатных листингов",
  "remaining.free.listing": "Остался 1 бесплатный листинг",
  "remaining.free.purchases":
    "Осталось {{purchasesRemaining}} бесплатных покупок",
  "remaining.free.purchase": "Осталась 1 бесплатная покупка",
  remove: "Удалить",
  reqSkillPts: "Необходимо скилл поинтов",
  reqSkills: "Необходимые навыки",
  required: "Необходимо",
  requires: "Требуется",
  requirements: "Требования",
  resources: "Ресурсы",
  restock: "Пополнить запасы",
  retry: "Попробовать снова",
  reward: "Награда",
  "reward.discovered": "Найдено вознаграждение",
  "reward.whatsNew": "What's new",
  save: "Сохранить",
  saving: "Сохранение",
  searching: "Ищем",
  seeds: "Семена",
  selected: "Выбрано",
  "select.resource": "Выберите ресурс: ",
  sell: "Продать",
  "sell.all": "Продать все",
  "sell.one": "Продать 1",
  "sell.ten": "Продать 10",
  "session.expired": "Сессия истекла!",
  share: "Поделиться",
  skillPts: "Очки навыков",
  skills: "Навыки",
  skipped: "Skipped",
  skipping: "Пропускаем",
  "skip.order": "Пропустить заказ",
  "sound.effects": "Звуковые эффекты",
  start: "Начать",
  submit: "Отправить",
  submitting: "Отправляем",
  success: "Успех!",
  swapping: "Меняем",
  syncing: "Синхронизируем",
  task: "Задание",
  test: "Тест",
  "thank.you": "Спасибо!",
  "time.remaining": "Time remaining: {{time}}",
  tools: "Инструменты",
  total: "Всего",
  trades: "Сделки",
  trading: "Торгуем",
  transfer: "Отправить",
  "try.again": "Попробовать еще раз",
  uhOh: "ой-ой!",
  "unlock.land": "Открой больше земли",
  unlocking: "Расширяем",
  unmute: "Включить звук",
  upcoming: "Upcoming",
  "use.craft": "Используется для создания предметов",
  verify: "Проверьте",
  version: "Версия",
  viewAll: "Просмотреть все",
  visit: "Посетить",
  warning: "Предупреждение",
  welcome: "Добро пожаловать!",
  "wishing.well": "Колодец желаний",
  withdraw: "Вывести",
  wish: "желание",
  yes: "Да",
  "yes.please": "Да, пожалуйста",
  opensea: "OpenSea",
  layouts: "Схемы",
  labels: "Ярлыки",
  buff: "Буст",
  speed: "Скорость",
  treasure: "Сокровище",
  special: "Особый",
  default: "По умолчанию",
  formula: "Формула",
  chill: "Спокойный",
  full: "Полный",
  collectibles: "Коллекционные предметы",
  buds: "Бады",
  wearables: "Одежда",
  skip: "Пропустить",
  docs: "Документация",
  exit: "Выйти",
  compost: "Загрузить",
  chicken: "Курица",
  recipes: "Рецепты",
  unlocked: "Разблокировано",
  reel: "Подсечь",
  "new.species": "Новые виды",
  buildings: "Здания",
  boosts: "Усилители",
  decorations: "Украшения",
  "sfl/coins": "SFL/Монеты",
  vipAccess: "VIP-доступ",
  bought: "Купил",
  inventory: ENGLISH_TERMS.inventory,
  "sell.amount": ENGLISH_TERMS["sell.amount"],
  "sell.inBulk": ENGLISH_TERMS["sell.inBulk"],
};

const timeUnits: Record<TimeUnits, string> = {
  // Full Singular
  "time.second.full": "секунда",
  "time.minute.full": "минута",
  "time.hour.full": "час",
  "time.day.full": "день",

  // Full Plural
  "time.seconds.full": "секунд",
  "time.minutes.full": "минут",
  "time.hours.full": "часов",
  "time.days.full": "дней",

  // Medium Singular
  "time.sec.med": "сек",
  "time.min.med": "мин",
  "time.hr.med": "ч",
  "time.day.med": "день",

  // Medium Plural
  "time.secs.med": "сек",
  "time.mins.med": "мин",
  "time.hrs.med": "ч",
  "time.days.med": "дней",

  // Short
  "time.second.short": "с",
  "time.minute.short": "м",
  "time.hour.short": "ч",
  "time.day.short": "д",

  // Relative Time
  "time.seconds.ago": "{{time}} {{secondORseconds}} назад",
  "time.minutes.ago": "{{time}} {{minuteORminutes}} назад",
  "time.hours.ago": "{{time}} {{hourORhours}} назад",
  "time.days.ago": "{{time}} {{dayORdays}} назад",
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
  "addSFL.minimumReceived": "Минимум: ",
};

const availableSeeds: Record<AvailableSeeds, string> = {
  "availableSeeds.select": "Семя не выбрано",
  "availableSeeds.select.plant": "Какое семя ты бы хотел выбрать и посадить?",
  "quickSelect.empty": "Нет тепличных семян.",
  "quickSelect.purchase": "Purchase {{name}} at the Market.",
  "quickSelect.label": "Быстрый выбор",
  "quickSelect.cropSeeds": "crop seeds",
  "quickSelect.greenhouseSeeds": "greenhouse seeds",
};

const base: Record<Base, string> = {
  "base.far.away": "Ты слишком далеко",
  "base.iam.far.away": "Я слишком далеко",
};

const basicTreasure: Record<BasicTreasure, string> = {
  "giftGiver.description":
    "Поздравляем, вы нашли одного из Гифтгиверов! Каждый день вы можете получить от них бесплатный приз.",
  "giftGiver.label": "Гифтгивер",
  "basic.treasure.missingKey": "Отсутствует ключ",
  "basic.treasure.needKey":
    "Тебе нужен Treasure Key, чтобы открыть этот сундук",
  "rare.treasure.needKey": "Тебе нужен Rare Key, чтобы открыть этот сундук",
  "luxury.treasure.needKey": "Тебе нужен Luxury Key, чтобы открыть этот сундук",
  "basic.treasure.getKey":
    "Ты можешь получать Treasure Keys, помогая бампкинам с заданиями",
  "basic.treasure.congratsKey": "Поздравляю, у тебя есть Treasure Key!",
  "basic.treasure.openChest": "Хочешь ли ты открыть сундук и забрать награду?",
  "budBox.open": "Открыть",
  "budBox.opened": "Открыт",
  "budBox.title": "Сундук бадов",
  "budBox.description":
    "Каждый день определенный вид бада может получать фермерские награды.",
  "raffle.title": "Розыгрыш от гоблинов",
  "raffle.description":
    "Каждый месяц у тебя есть шанс выиграть награды. Победители будут объявлены в Discord.",
  "raffle.entries": "записи",
  "raffle.noTicket": "Отсутствует Prize Ticket",
  "raffle.how":
    "Prize Tickets можно получить бесплатно, участвуя в особых событиях и осуществляя доставки бампкинам.",
  "raffle.enter": "Участвовать",
};

const beehive: Record<Beehive, string> = {
  "beehive.harvestHoney": "Собрать Honey",
  "beehive.noFlowersGrowing": "Нет растущих цветов",
  "beehive.beeSwarm": "Пчелиный рой",
  "beehive.pollinationCelebration":
    "Праздник опыления! Твои посевы получают +0.2 к урожаю от дружелюбного пчелиного роя!",
  "beehive.honeyProductionPaused": "Производство меда остановлено",
  "beehive.yield": "Доход",
  "beehive.honeyPerFullHive": "{{multiplier}} меда/ полный сбор",
  "beehive.speed": "Скорость",
  "beehive.fullHivePerDay": "{{speed}} полного {{hive}} / день",
  "beehive.estimatedFull": "Ожидаемое заполнение",
  "beehive.hive.singular": "улей",
  "beehive.hives.plural": "улии",
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
  "birdieplaza.howToEarnTickets": "{{seasonalTicket}}’ы?",
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
  "description.knight.chicken":
    "A strong and noble chicken boosting your oil yield.",
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
    "Время роста урожая(овощи и фрукты), готовки, восстановления минералов и деревьев уменьшается на 50%. Длится только 2 часа",
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
    "Его любимое лакомство - пухлая, сочная голубика. Съедает её горстями!",
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
  "description.basic.scarecrow":
    "Бустит находящиеся рядом Sunflowers, Potatoes и Pumpkins.",
  "description.scary.mike":
    "Бустит находящиеся рядом Carrots, Cabbages, Soybeans, Beetroots, Cauliflowers и Parsnips",
  "description.laurie.chuckle.crow":
    "Бустит находящиеся рядом Eggplant, Corn, Radish, Wheat и Kale",
  "description.immortal.pear": "Увеличивает время жизни фруктовых лунок.",
  "description.bale": "Бустит находящихся рядом кур.",
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
  "description.basic.scarecrow.boost": "-20% время роста",
  "description.scary.mike.boost": "+0.2 к средним растениям",
  "description.laurie.chuckle.crow.boost": "+0.2 к продвинутым растениям",
  "description.bale.boost": "+0.2 Eggs",
  "description.immortal.pear.boost": "+1 к сбору фруктов",
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
  "description.hoot.boost": "+0.5 Wheat, Radish, Kale, Rice",
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
  "description.battle.fish.boost": "+0.05 Oil",
  "description.crim.peckster.boost": "+0.1 Crimstone",
  "description.knight.chicken.boost": "+0.1 Oil",
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
  "description.desertgnome.boost": "+10% Cooking Speed",
  "description.christmas.festive.tree.boost": "Бесплатный подарок на рождество",
  "description.grinxs.hammer.boost": "Снижает стоимость расширений вдвое",
  "description.time.warp.totem.boost":
    "Время роста урожая(овощи и фрукты), готовки, восстановления минералов и деревьев уменьшается на 50%",
  "description.radiant.ray.boost": "+0.1 Iron",
  "description.babyPanda.boost": "2x буст к опыту для новичков",
  "description.hungryHare.boost": "2x опыта от Fermented Carrots",
  "description.turbo.sprout.boost": "-50% к времени роста тепличных культур",
  "description.soybliss.boost": "+1 Soybean",
  "description.grape.granny.boost": "+1 Grape",
  "description.non.la.hat.boost": "+1 Rice",
  "description.oil.can.boost": "+2 Oil",
  "description.olive.shield.boost": "+1 Olive",
  "description.pan.boost": "+25% XP",
  "description.paw.shield.boost":
    "+25% к насыщению питомца фракции и к получаемым маркам",
  "description.vinny.boost": "+0.25 Grape",
  "description.rice.panda.boost": "+0.25 Rice",
  "description.olive.shirt.boost": "+0.25 Olive",
  "description.tofu.mask.boost": "+0.1 Soybean",
  "description.gourmet.hourglass.boost": "+50% Cooking Speed (4hrs)",
  "description.harvest.hourglass.boost": "-25% Crop Growth Time (6hrs)",
  "description.timber.hourglass.boost": "-25% Tree Recovery Time (4hrs)",
  "description.ore.hourglass.boost": "-50% Mineral Recovery Time (3hrs)",
  "description.orchard.hourglass.boost": "-25% Fruit Growth Time (6hrs)",
  "description.fishers.hourglass.boost": "50% Chance of +1 Fish (4hrs)",
  "description.blossom.hourglass.boost": "-25% Flower Growth Time (4hrs)",
  "description.hourglass.running":
    "This {{hourglass}} provides a temporary boost of {{boost}}.",
  "description.hourglass.expired":
    "Your {{hourglass}} has expired. Time to grab another one!",
  "description.desert.rose.boost":
    ENGLISH_TERMS["description.desert.rose.boost"],
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
  "description.greenhouse": "A sanctuary for sensitive crops",
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
  "description.crop.machine": "Automate your crop production",
  "building.oil.remaining": "{{oil}} Oil in building",

  "cooking.building.oil.description":
    "You can boost your recipe cooking times by {{boost}}% when adding oil into the {{buildingName}}.",
  "cooking.building.oil.boost": "Oil boost",
  "cooking.building.runtime": "Runtime {{time}}",
};

const bumpkinDelivery: Record<BumpkinDelivery, string> = {
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
  "bumpkinItemBuff.fruit.picker.apron.boost":
    "+0.1 Apple, Blueberry, Orange, Banana",
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
  "bumpkinItemBuff.bee.suit": "+0.1 Honey за полный улей",
  "bumpkinItemBuff.crimstone.hammer": "+2 Crimstones на 5й копке",
  "bumpkinItemBuff.crimstone.amulet": "-20% времени восстановления Crimstone",
  "bumpkinItemBuff.crimstone.armor": "+0.1 Crimstones",
  "bumpkinItemBuff.hornet.mask": "2x шанс на пчелиный рой",
  "bumpkinItemBuff.honeycomb.shield": "+1 Honey за полный улей",
  "bumpkinItemBuff.flower.crown": "-50% времени роста цветов",
  "bumpkinItemBuff.goblin.armor": "+20% Marks",
  "bumpkinItemBuff.goblin.helmet": "+10% Marks",
  "bumpkinItemBuff.goblin.axe": "+10% Marks",
  "bumpkinItemBuff.goblin.pants": "+5% Marks",
  "bumpkinItemBuff.goblin.sabatons": "+5% Marks",
  "bumpkinItemBuff.nightshade.armor": "+20% Marks",
  "bumpkinItemBuff.nightshade.helmet": "+10% Marks",
  "bumpkinItemBuff.nightshade.sword": "+10% Marks",
  "bumpkinItemBuff.nightshade.pants": "+5% Marks",
  "bumpkinItemBuff.nightshade.sabatons": "+5% Marks",
  "bumpkinItemBuff.sunflorian.armor": "+20% Marks",
  "bumpkinItemBuff.sunflorian.helmet": "+10% Marks",
  "bumpkinItemBuff.sunflorian.sword": "+10% Marks",
  "bumpkinItemBuff.sunflorian.pants": "+5% Marks",
  "bumpkinItemBuff.sunflorian.sabatons": "+5% Marks",
  "bumpkinItemBuff.bumpkin.armor": "+20% Marks",
  "bumpkinItemBuff.bumpkin.helmet": "+10% Marks",
  "bumpkinItemBuff.bumpkin.sword": "+10% Marks",
  "bumpkinItemBuff.bumpkin.pants": "+5% Marks",
  "bumpkinItemBuff.bumpkin.sabatons": "+5% Marks",
};

const bumpkinPart: Record<BumpkinPart, string> = {
  "equip.background": "Background",
  "equip.hair": "Hair",
  "equip.body": "Body",
  "equip.shirt": "Shirt",
  "equip.pants": "Pants",
  "equip.shoes": "Shoes",
  "equip.tool": "Tool",
  "equip.necklace": "Necklace",
  "equip.coat": "Coat",
  "equip.hat": "Hat",
  "equip.secondaryTool": "Secondary Tool",
  "equip.onesie": "Onesie",
  "equip.suit": "Suit",
  "equip.wings": "Wings",
  "equip.dress": "Dress",
  "equip.beard": "Beard",
  "equip.aura": ENGLISH_TERMS["equip.aura"],
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
  "description.money.tree": "Шанс на выпадение монет",
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
  "bumpkinTrade.purchase": "Приобрести в Goblin Retreat",
  "bumpkinTrade.available": "В наличии",
  "bumpkinTrade.quantity": "Количество",
  "bumpkinTrade.price": "Цена",
  "bumpkinTrade.listingPrice": "Цена при листинге",
  "bumpkinTrade.pricePerUnit": "Цена за {{resource}}",
  "bumpkinTrade.tradingFee": "Комиссия",
  "bumpkinTrade.youWillReceive": "Ты получишь",
  "bumpkinTrade.cancel": "Отмена",
  "bumpkinTrade.list": "Выставить",
  "bumpkinTrade.maxListings": "Достигнут лимит листингов",
  "bumpkinTrade.max": "Максимум: {{max}}",
  "bumpkinTrade.min": "Min: {{min}}",
  "bumpkinTrade.minimumFloor": "Min unit price: {{min}}",
  "bumpkinTrade.maximumFloor": "Max unit price: {{max}}",
  "bumpkinTrade.floorPrice": "Минимальная цена: {{price}} SFL",
  "bumpkinTrade.sellConfirmation":
    "Sell {{quantity}} {{resource}} for {{price}} SFL?",
  "bumpkinTrade.cant.sell.all": "Can't sell all",
  "bumpkinTrade.price/unit": "{{price}}/шт",
  "bumpkinTrade.unlockMoreTrades":
    ENGLISH_TERMS["bumpkinTrade.unlockMoreTrades"],
  "bumpkinTrade.visitBoard": ENGLISH_TERMS["bumpkinTrade.visitBoard"],
};

const goblinTrade: Record<GoblinTrade, string> = {
  "goblinTrade.bulk": "количество",
  "goblinTrade.conversion": "Конвертация",
  "goblinTrade.select": "Выбери ресурсы на продажу",
  "goblinTrade.hoarding": "О нет! Ты достиг максимума SFL.",
  "goblinTrade.vipRequired": "Необходим VIP доступ",
  "goblinTrade.vipDelivery":
    "Хммм, похоже, ты обычный бампкин. Я торгую только с VIP-персонами.",
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
  "chores.choresFrozen": "Скоро появится новый сезонный список дел.",
  "kingdomChores.preparing": "Just a second. I'm preparing some chores.",
  "kingdomChores.completed":
    "Looks like you have completed all your chores for now. Come back soon!",
  "kingdomChores.noChores":
    "I'm sorry, I don't have any chores available right now. Come back soon!",
  "kingdomChores.noUpcoming": "No upcoming chores",
  "kingdomChores.progress": "Progress: {{progress}}",
  "kingdomChores.nextSkip": "Next Skip: {{skip}}",
  "kingdomChores.skipWarning": "You can only skip one chore every 24 hours",
  "kingdomChores.completeActive": "Complete active chores to unlock",
  "kingdomChores.loading": "Loading new chores",
  "kingdomChores.reset": "Chores Reset: {{reset}}",
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
  "chumDetails.sunfish": "Perfect for a full moon...",
  "chumDetails.horseMackerel": "Only for the biggest appetites",
  "chumDetails.zebraFish": ENGLISH_TERMS["chumDetails.zebraFish"],
};

const community: Record<Community, string> = {
  "community.toast": "Текст тоста пуст",
  "community.url": "Введите URL-адрес вашего репозитория",
  "comunity.Travel": "Отправиться на острова, построенные сообществом",
};

const cropBoomMessages: Record<CropBoomMessages, string> = {
  "crop.boom.welcome": "Добро пожаловать в Crop Boom",
  "crop.boom.reachOtherSide":
    "Доберись до другой стороны опасного поля, чтобы получить Arcade Token",
  "crop.boom.bewareExplodingCrops":
    "Остерегайся взрывающихся растений. Если ты наступишь на них, то начнешь с самого начала.",
  "crop.boom.newPuzzleDaily": "Каждый день будет появляться новая головоломка",
  "crop.boom.back.puzzle":
    "Возвращайся позже, чтобы увидеть новую головоломку!",
};

const compostDescription: Record<CompostDescription, string> = {
  "compost.fruitfulBlend":
    "Fruitful Blend boosts the yield of each fruit growing on fruit patches by +0.1",
  "compost.sproutMix":
    "Sprout Mix increases your crop yield from plots by +0.2",
  "compost.sproutMixBoosted":
    "Sprout Mix increases your crop yield from plots by +0.4",
  "compost.rapidRoot": "Rapid Root reduces crop growth time from plots by 50%",
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
  "confirmation.sellCrops":
    "Ты уверен что хочешь продать {{cropAmount}} {{cropName}} за {{coinAmount}} монет?",
  "confirmation.buyCrops":
    "Are you sure you want to spend {{coinAmount}} Coins to buy {{seedNo}} {{seedName}}s?",
  "confirmation.enterAmount": "",
};

const conversations: Record<Conversations, string> = {
  "faction-intro.one":
    "Welcome to your new faction house... We need your help to become more powerful and dominate the kingdom.",
  "faction-intro.two":
    "You will be rewarded with marks by completing chores, delivering items to the kitchen and feeding our magestic pet.",
  "faction-intro.three":
    "At the end of each week, bonus prizes will be given to our best members. Good luck!",
  "home-intro.one":
    "Howdy Bumpkin, welcome to your home...It's not much, but we all have to start somewhere!",
  "home-intro.two":
    "Throughout your adventures you will be able to store rare collectibles you find here.",
  "home-intro.three":
    "The bigger your home, the more Bumpkins that can live on your island.",
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
  "hank.choresFrozen":
    "Well shucks, looks like we're all caught up for today. Take yourself a little breather and enjoy the rest of the day!",
  "betty-intro.headline": "Как развить твою ферму",
  "betty-intro.one": "Привет привет! Добро пожаловать ко мне на рынок.",
  "betty-intro.two":
    "Приноси мне свой лучший урожай, и я предложу тебе справедливую цену за него!",
  "betty-intro.three":
    "Тебе нужны семена? У меня есть все, от картошки до пастернака!",
  "betty.market-intro.one": "Great work Bumpkin! You've just discovered Crops!",
  "betty.market-intro.two":
    "You can harvest and sell them at my market to earn coins and grow your island.",
  "betty.market-intro.three":
    "You can harvest them and sell them at my market to earn coins and grow your farming empire",
  "betty.market-intro.four":
    "Собери эти Sunflowers и начинай развивать свою фермерскую империю.",
  "firepit-intro.one": "Congratulations Bumpkin...You're a natural!",
  "firepit-intro.two":
    "If you want to level up & unlock new abilities, gather crops and visit my fire pit. I can cook some nutritious food for you.",
  "firepit.increasedXP": "Increased XP",
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
    "It looks like you've got some deliveries in the Plaza to complete.",
  "pete.levelthree.three":
    "View your deliveries in the bottom left of the screen. Once you've gathered the resources, you can travel and deliver the items to the Bumpkins.",
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
  "mayor.plaza.enterUsernamePrompt": "Введи свое имя пользователя: ",
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
  "description.soybean": "A versatile legume!",

  // Greenhouse
  "description.grape": "A zesty and desired fruit.",
  "description.olive": "A luxury for advanced farmers.",
  "description.rice": "Perfect for rations!",

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
  "deliveryitem.inventory": "Инвентарь: ",
  "deliveryitem.itemsToDeliver": "Предметы для отправки: ",
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
  "description.beta.bear": "Медведь, полученный в ходе особых тестовых событий",
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
  "description.battleCryDrum": "",
  "description.bullseyeBoard": "",
  "description.chessRug": "",
  "description.cluckapult": "",
  "description.goldenGallant": "",
  "description.goldenGarrison": "",
  "description.goldenGuardian": "",
  "description.noviceKnight": "",
  "description.regularPawn": "",
  "description.rookieRook": "",
  "description.silverSentinel": "",
  "description.silverSquire": "",
  "description.silverStallion": "",
  "description.traineeTarget": "",
  "description.twisterRug": "",

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
  "description.gold.rock": "Горная порода пригодная для добычи gold",
  "description.iron.rock": "Горная порода пригодная для добычи iron",
  "description.stone.rock": "Горная порода пригодная для добычи stone",
  "description.crimstone.rock": "Горная порода пригодная для добычи crimstone",
  "description.oil.reserve": "Источник нефти",
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
  "description.desertgnome":
    "A gnome that can survive the harshest of conditions.",
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
  "description.gauchoRug": "A commerative rug to support South Brazil.",
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
  "description.earnAllianceBanner": "Баннер особого события",
  "description.sunflorian.faction.banner":
    "Демонстрация верности Sunflorian фракции",
  "description.goblin.faction.banner": "Демонстрация верности Goblin фракции",
  "description.nightshade.faction.banner":
    "Демонстрация верности Nightshade фракции",
  "description.bumpkin.faction.banner": "Демонстрация верности Bumpkin фракции",

  // Clash of Factions
  "description.turbo.sprout":
    "An engine that reduces the Green House's growth time by 50%.",
  "description.soybliss": "A unique soy creature that gives +1 Soybean yield.",
  "description.grape.granny":
    "Wise matriarch nurturing grapes to flourish with +1 yield.",
  "description.royal.throne": "A throne fit for the highest ranking farmer.",
  "description.lily.egg": "Tiny delight, grand beauty, endless wonder.",
  "description.goblet": "A goblet that holds the finest of wines.",
  "description.clock":
    "A Clock that keeps time with the gentle ticking of the seasons.",
  "description.fancy.rug": "A rug that brings a touch of elegance to any room.",
  "description.vinny":
    "Vinny, a friendly grapevine, is always ready for a chat.",
  "description.ricePanda": "A smart panda never forgets to water the rice.",
  "description.benevolenceFlag":
    "For players who have shown great benevolence by contributing significantly to the Bumpkins.",
  "description.devotionFlag":
    "For players who have shown unwavering devotion by donating extensively to the Nightshades, reflecting their cult-like dedication",
  "description.generosityFlag":
    "For players who have donated substantial resources to the Goblins.",
  "description.splendorFlag":
    "For players who have generously supported the Sunflorians, symbolizing their splendor in generosity.",
  "description.jellyLamp": "A lamp that brings a touch of luxury to any room.",
  "description.paintCan": "A paint can discovered in the festival of colors",
};

const delivery: Record<Delivery, string> = {
  "delivery.resource": "Хочешь, чтобы я доставил ресурсы?",
  "delivery.feed": "Это не бесплатно, мне надо кормить целое племя!",
  "delivery.fee": "Я возьму с тебя 30% ресурсов для сокровищницы гоблинов",
  "delivery.goblin.comm.treasury": "Сокровищница гоблинов",
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
    "Не забывай следить за особыми событиями и розыгрышами в Discord, чтобы не пропустить их.",
  "discord.bonus.bonusReward": "Бонусная награда",
  "discord.bonus.payAttention":
    "Следи за особыми событиями и розыгрышами в Discord, чтобы не пропустить их.",
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

export const desertTerms: Record<DesertKeys, string> = {
  "digby.noDigsLeft": ENGLISH_TERMS["digby.noDigsLeft"],
  "digby.noDrills": ENGLISH_TERMS["digby.noDrills"],
  "digby.noShovels": ENGLISH_TERMS["digby.noShovels"],
  "digby.puzzle": ENGLISH_TERMS["digby.puzzle"],
  "digby.today": ENGLISH_TERMS["digby.today"],
  "digby.patterns": ENGLISH_TERMS["digby.patterns"],
  "digby.guide.one": ENGLISH_TERMS["digby.guide.one"],
  "digby.guide.two": ENGLISH_TERMS["digby.guide.two"],
  "digby.guide.three": ENGLISH_TERMS["digby.guide.three"],
  "digby.guide.four": ENGLISH_TERMS["digby.guide.four"],
  "desert.notice.one": ENGLISH_TERMS["desert.notice.one"],
  "desert.notice.two": ENGLISH_TERMS["desert.notice.two"],
  "desert.notice.three": ENGLISH_TERMS["desert.notice.three"],
  "desert.notice.four": ENGLISH_TERMS["desert.notice.four"],
};

const donation: Record<Donation, string> = {
  "donation.one":
    "Это была инициатива от художников нашего сообщества, и они будут очень признательны за пожертвования!",
  "donation.rioGrandeDoSul.one":
    "Olá gente! South of Brazil has been devastated by recent flooding and we are gathering donations for food and water at the shelters.",
  "donation.rioGrandeDoSul.two":
    "Everyone who donates will receive a commemorative decoration.",
  "donation.matic": "Donation in MATIC",
  "donation.minimum": "Minimum 1 MATIC",
  "donation.airdrop": "Decorations will be airdropped after donations close.",
  "donation.specialEvent": "Special Donation Event",
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
  "error.forbidden.goblinVillage": "Тебе нельзя тут быть!",
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
  "error.dailyAttemptsExhausted": "Ежедневные попытки потрачены",
  "error.missingRod": "Отсутствует rod",
  "error.missingBait": "Отсутствует ",
  "error.alreadyCasted": "Уже заброшена",
  "error.unsupportedChum": "{{chum}} не поддерживаемая насадка",
  "error.insufficientChum": "Недостаточно насадок",
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
  "error.insufficientIngredient": "Недостаточно ингредиентов",
  "error.ClientRPC": "Ошибка клиентского RPC",
  "error.walletInUse.one": "Кошелек уже используется",
  "error.walletInUse.two":
    "Этот кошелек уже привязан к ферме. Пожалуйста, используйте вход через социальные сети или выберите другой кошелек.",
  "error.walletInUse.three": "Попробуйте другой способ входа в систему",
  "error.notEnoughOil": "Not enough oil",
  "error.oilCapacityExceeded": "Oil capacity exceeded",
};

const exoticShopItems: Record<ExoticShopItems, string> = {
  "exoticShopItems.line1":
    "Наш магазин бобов закрывается, так как наши бобы отправляются в новое путешествие с безумным ученым.",
  "exoticShopItems.line2":
    "Спасибо за то, что был частью нашего сообщества любителей бобов.",
  "exoticShopItems.line3": "С наилучшими пожеланиями,",
  "exoticShopItems.line4": "The Bean Team",
};

const factions: Record<Factions, string> = {
  "faction.join": "Присоединиться к {{faction}}",
  "faction.description.sunflorians":
    "Санфлорианцы - это королевские особы, которые правят Страной Подсолнухов. Верите ли вы в силу и правила?",
  "faction.description.bumpkins":
    "Бампкины - это фермеры и все основные жители Страны Подсолнухов. Верите ли вы в трудолюбие и общительность?",
  "faction.description.goblins":
    "Гоблины - озорные промышленники Страны Подсолнухов. Верите ли вы в прогресс и инновации?",
  "faction.description.nightshades":
    "Ночные тени - загадочные и волшебные существа Страны Подсолнухов. Верите ли вы в магию и тайны?",
  "faction.countdown": "Через {{timeUntil}} начнется битва фракций.",
  "faction.join.confirm": "Вы согласны присоединиться к {{faction}}?",
  "faction.cannot.change": "Вы не можете сменить фракцию.",
  "faction.joined.sunflorians.intro":
    "Приветствую вас, благородный Санфлориан! Присоединяйтесь к нам, мы объединяем наши силы, чтобы утвердить превосходство и поддержать честь нашего королевства.",
  "faction.joined.bumpkins.intro":
    "Привет, дружище Бампкин! Пришло время объединить наших братьев-фермеров и показать другим фракциям силу упорного труда и единства.",
  "faction.joined.goblins.intro":
    "Приветствую тебя, искусный гоблин! С нашими острыми умами и коварными планами победа будет за нами в предстоящих сражениях.",
  "faction.joined.nightshades.intro":
    "Приветствую тебя, загадочный Найтшейд! Вместе мы пройдем через тени и раскроем секреты, которые приведут нас к победе в грядущих сражениях.",
  "faction.earn.emblems": "Зарабатывай эмблемы",
  "faction.earn.emblems.time.left": "{{timeLeft}} осталось",
  "faction.emblems.tasks":
    "Зарабатывайте очки фракции, делая пожертвования или выполняя сезонные поставки, чтобы получить право на получение аирдропа фракционных эмблем.",
  "faction.view.leaderboard": "Посмотреть таблицу лидеров",
  "faction.donation.request.message":
    "Приветствую, {{faction}}! В настоящее время мы принимаем пожертвования в виде ресурсов и SFL, чтобы помочь построить нашу фракцию. За свою щедрость вы получите очки фракции.",
  "faction.donation.label": "Пожертвование фракции {{faction}}",
  "faction.donation.sfl": "Пожертвование SFL (минимум 10)",
  "faction.donation.sfl.max.per.day": "{{donatedToday}}/500",
  "faction.donation.bulk.resources": "Пожертвования ресурсов (минимум {{min}})",
  "faction.donation.bulk.resources.unlimited.per.day":
    "{{donatedToday}}/неограниченно",
  "faction.donation.confirm":
    "Вы уверены, что хотите пожертвовать перечисленное за {{factionPoints}} {{reward}}?",
  "faction.seasonal.delivery.start.at":
    "Сезонные доставки начнутся через {{days}}",
  "faction.points.with.number": "Очки фракции: {{points}}",
  "faction.points.title": "Faction Points",
  "faction.points.pledge.warning":
    "Pledge a faction to receive faction points!",
  "faction.emblemAirdrop": "Emblem Airdrop",
  "faction.emblemAirdrop.closes": "Ends: {{date}}",

  // Kingdom NPCs
  "faction.restrited.area":
    "Hold up farmer! This castle is off limits to you. Only the {{faction}} are allowed here.",
  "faction.not.pledged":
    "Hmm. It looks like you haven't pledged to a faction yet. Would you like to join the {{faction}}?",
  "faction.cost":
    "Show your allegiance and join the {{faction}}. Entry to the faction costs {{cost}} SFL.",
  "faction.pledge.reward":
    "In exchange, you will receive a {{banner}} and {{emblems}} emblems.",
  "faction.welcome": "Welcome to the {{faction}}!",
  "faction.greeting.goblins": "Hail the Goblin King!",
  "faction.greeting.sunflorians": "Our lineage will reign supreme!",
  "faction.greeting.bumpkins": "We must unite the farmers!",
  "faction.greeting.nightshades": "The shadows will guide us to victory!",

  // Faction Claim Emblems
  "faction.claimEmblems.alreadyClaimed":
    "Hey! We already rewarded you with your emblems!",
  "faction.claimEmblems.emblemsEarned": "Emblems Earned",
  "faction.claimEmblems.yourRank": "Your Rank",
  "faction.claimEmblems.yourPercentile": "Your Percentile",
  "faction.claimEmblems.yourEmblems": "Your Emblems",
  "faction.claimEmblems.noContribution":
    "You have not contributed any points to the faction.",
  "faction.claimEmblems.statistics": "Statistics",
  "faction.claimEmblems.thankYou":
    "Thank you {{player}}for your contributions to the {{Faction}}! Take these emblems, they represent your ownership of the faction!",
  "faction.claimEmblems.claimMessage":
    "You contributed {{count}} faction points. Your rank was {{rank}}. You in the top {{percentile}}% of {{Faction}}.",
  "faction.claimEmblems.claim": "Claim {{count}} Emblems",
  "faction.claimEmblems.congratulations":
    "Congratulations! You've received {{count}} emblems!",
  "faction.claimEmblems.comparison":
    "Here is how you compare to your faction members.",
  "faction.claimEmblems.totalMembers": "Total Faction Members",
  "faction.claimEmblems.totalEmblems": "Total Faction Emblems",
  "faction.claimEmblems.percentile": "Top {{percentile}}%",
  "faction.claimEmblems.travelNow": "Travel Now",
  "faction.claimEmblems.visitMe":
    "Visit me, {{recruiterName}}, in the Kingdom to claim your emblems.",

  "faction.kitchen.opensIn": "Opens in {{time}}",
  "faction.kitchen.notReady":
    "Ahhh I love your enthusiasm! However, the kitchen is not open yet. Please come back later.",
  "faction.kitchen.gatherResources":
    "So many new recruits... how will we feed them all! Can you help me gather some resources?",
  "faction.kitchen.preparing":
    "I'm still preparing my orders! Please come back in a few minutes.",
  "faction.kitchen.newRequests": "New requests: {{time}}",
  "faction.openingSoon":
    "Faction houses are opening on July 8th. Earn marks, compete for glory and claim rewards!",
  "faction.emblems": "Emblems",
  "faction.emblems.intro.one":
    "Wow, look at all those emblems. You are a true warrior!",
  "faction.emblems.intro.two":
    "On July 8th the Faction House will open. You will be able to complete tasks, earn marks and claim rewards.",
  "faction.emblems.intro.three":
    "The more emblems you have, the higher your rank and more marks you can earn.",
  "faction.tradeEmblems": "Trade emblems to climb the ranks and attain perks.",
  "faction.marksBoost":
    "Marks boost applies to faction activities coming July 8th.",
  "faction.shop.onlyFor": "{{faction}} only",
  "faction.shop.welcome":
    "Welcome to the Faction Shop! Use your marks to purchase temporary boosts, stylish wearables, and rare collectibles. Dive in and find your next great addition!",
  "faction.goodLuck": "Good luck this week!",
  "faction.noPrizeFound": "No prize found",
  "kingdom.noticeboard.one": ENGLISH_TERMS["kingdom.noticeboard.one"],
  "kingdom.noticeboard.two": ENGLISH_TERMS["kingdom.noticeboard.two"],
  "kingdom.noticeboard.three": ENGLISH_TERMS["kingdom.noticeboard.three"],
  "kingdom.noticeboard.four": ENGLISH_TERMS["kingdom.noticeboard.four"],
  "faction.noticeboard.one": ENGLISH_TERMS["faction.noticeboard.one"],
  "faction.noticeboard.two": ENGLISH_TERMS["faction.noticeboard.two"],
  "faction.noticeboard.three": ENGLISH_TERMS["faction.noticeboard.three"],
  "faction.noticeboard.four": ENGLISH_TERMS["faction.noticeboard.four"],
  "faction.pet.gatherResources": ENGLISH_TERMS["faction.pet.gatherResources"],
  "faction.leave": ENGLISH_TERMS["faction.leave"],
  "faction.leave.hasEmblems": ENGLISH_TERMS["faction.leave.hasEmblems"],
  "faction.leave.areYouSure": ENGLISH_TERMS["faction.leave.areYouSure"],
  "faction.leave.marks": ENGLISH_TERMS["faction.leave.marks"],
  "faction.leave.sellEmblems": ENGLISH_TERMS["faction.leave.sellEmblems"],
  "faction.leave.isNew": ENGLISH_TERMS["faction.leave.isNew"],
  "faction.boostsApplied": ENGLISH_TERMS["faction.boostsApplied"],
  "faction.no.boostsApplied": ENGLISH_TERMS["faction.no.boostsApplied"],
  "faction.pet.weeklyGoal": ENGLISH_TERMS["faction.pet.weeklyGoal"],
  "faction.pet.hungry": ENGLISH_TERMS["faction.pet.hungry"],
  "faction.pet.fed": ENGLISH_TERMS["faction.pet.fed"],
  "faction.pet.sleeping": ENGLISH_TERMS["faction.pet.sleeping"],
  "faction.pet.newRequests": ENGLISH_TERMS["faction.pet.newRequests"],
  "faction.pet.streak": ENGLISH_TERMS["faction.pet.streak"],
  "faction.pet.wakes.in": ENGLISH_TERMS["faction.pet.wakes.in"],
  "faction.pet.contributingMember":
    ENGLISH_TERMS["faction.pet.contributingMember"],
};

const factionShopDescription: Record<FactionShopDescription, string> = {
  "description.factionShop.sunflorianThrone": "A throne fit for a Sunflorian.",
  "description.factionShop.nightshadeThrone": "A throne fit for a Nightshade.",
  "description.factionShop.goblinThrone": "A throne fit for a Goblin.",
  "description.factionShop.bumpkinThrone": "A throne fit for a Bumpkin.",
  "description.factionShop.goldenSunflorianEgg":
    "A jewelled egg created by the House of Sunflorian.",
  "description.factionShop.goblinMischiefEgg":
    "A jewelled egg created by the House of Goblin.",
  "description.factionShop.bumpkinCharmEgg":
    "A jewelled egg created by the House of Bumpkin.",
  "description.factionShop.nightshadeVeilEgg":
    "A jewelled egg created by the House of Nightshade.",
  "description.factionShop.emeraldGoblinGoblet": "An emerald encrusted goblet.",
  "description.factionShop.opalSunflorianGoblet": "An opal encrusted goblet.",
  "description.factionShop.sapphireBumpkinGoblet":
    "A sapphire encrusted goblet.",
  "description.factionShop.amethystNightshadeGoblet":
    "An amethyst encrusted goblet.",
  "description.factionShop.goldenFactionGoblet": "A golden goblet.",
  "description.factionShop.rubyFactionGoblet": "A ruby encrusted goblet.",
  "description.factionShop.sunflorianBunting":
    "Colorful flags celebrating the Sunflorian Faction.",
  "description.factionShop.nightshadeBunting":
    "Colorful flags celebrating the Nightshade faction.",
  "description.factionShop.goblinBunting":
    "Colorful flags celebrating the Goblin faction.",
  "description.factionShop.bumpkinBunting":
    "Colorful flags celebrating the Bumpkin faction.",
  "description.factionShop.sunflorianCandles":
    "Sunflorian Faction decorative candles.",
  "description.factionShop.nightshadeCandles":
    "Nightshade Faction decorative candles.",
  "description.factionShop.goblinCandles": "Goblin Faction decorative candles.",
  "description.factionShop.bumpkinCandles":
    "Bumpkin Faction decorative candles.",
  "description.factionShop.sunflorianLeftWallSconce":
    "Illuminate your living quarters with a Sunflorian Wall Sconce.",
  "description.factionShop.nightshadeLeftWallSconce":
    "Illuminate your living quarters with a Nightshade Wall Sconce.",
  "description.factionShop.goblinLeftWallSconce":
    "Illuminate your living quarters with a Goblin Wall Sconce.",
  "description.factionShop.bumpkinLeftWallSconce":
    "Illuminate your living quarters with a Bumpkin Wall Sconce.",
  "description.factionShop.sunflorianRightWallSconce":
    "Illuminate your living quarters with a Sunflorian Wall Sconce.",
  "description.factionShop.nightshadeRightWallSconce":
    "Illuminate your living quarters with a Nightshade Wall Sconce.",
  "description.factionShop.goblinRightWallSconce":
    "Illuminate your living quarters with a Goblin Wall Sconce.",
  "description.factionShop.bumpkinRightWallSconce":
    "Illuminate your living quarters with a Bumpkin Wall Sconce.",
  "description.factionShop.cookingBoost":
    "Reduces cooking time by 50% for 4 hours.",
  "description.factionShop.cropBoost":
    "Reduces crop growth time by 25% for 6 hours.",
  "description.factionShop.woodBoost":
    "Reduces tree recovery time by 25% for 4 hours.",
  "description.factionShop.mineralBoost":
    "Reduces mineral replenish cooldown by 50% for 3 hours.",
  "description.factionShop.fruitBoost":
    "Reduces fruit growth time by 25% for 6 hours.",
  "description.factionShop.flowerBoost":
    "Reduces flower growth time by 25% for 4 hours.",
  "description.factionShop.fishBoost":
    "Gives a 50% chance of +1 fish for 4 hours.",
  "description.factionShop.sunflorianFactionRug":
    "A magnificent rug made by the talented Sunflorian faction artisans.",
  "description.factionShop.nightshadeFactionRug":
    "A magnificent rug made by the talented Nightshade faction artisans.",
  "description.factionShop.goblinFactionRug":
    "A magnificent rug made by the talented Goblin faction artisans.",
  "description.factionShop.bumpkinFactionRug":
    "A magnificent rug made by the talented Bumpkin faction artisans.",
  "description.factionShop.goblinArmor":
    "Rugged and rowdy, Goblin-approved protection. Earn +20% marks when pledged to this faction. Multiples of this item do not stack.",
  "description.factionShop.goblinHelmet":
    "Strong and sturdy, crafted for fearless adventures in untamed lands. Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
  "description.factionShop.goblinPants":
    "These pants blend agility with Goblin craftsmanship for swift maneuvers. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
  "description.factionShop.goblinSabatons":
    "Designed to outpace and outlast any foe. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
  "description.factionShop.goblinAxe":
    "This axe is a testament to Goblin strength and unmatched battle prowess. Earn +10% marks",
  "description.factionShop.sunflorianArmor":
    "A shimmering protection that mirrors the sun's strength. Earn +20% marks when pledged to this faction. Multiples of this item do not stack.",
  "description.factionShop.sunflorianHelmet":
    "This helmet is a beacon of light and guardian against shadows. Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
  "description.factionShop.sunflorianPants":
    "Stride confidently in attire that captures the warmth and energy of all Sunflorians. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
  "description.factionShop.sunflorianSabatons":
    "Each step taken in these shoes resonating with the power and vitality. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
  "description.factionShop.sunflorianSword":
    "A blade ablaze with the courage and brilliance of the sun. Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
  "description.factionShop.bumpkinArmor":
    "A sturdy protection that honors tradition and strength. Earn +20% marks when pledged to this faction. Multiples of this item do not stack.",
  "description.factionShop.bumpkinHelmet":
    "Adorn your head with a symbol of rustic fortitude and unwavering resolve. Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
  "description.factionShop.bumpkinPants":
    "Navigate countryside and city alike blending comfort with the spirit of adventure. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
  "description.factionShop.bumpkinSabatons":
    "Stampede through fields in this sturdy footwear echoing the resilience of rural life. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
  "description.factionShop.bumpkinSword":
    "A weapon forged in fields and forests, ready for any challenge. Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
  "description.factionShop.nightshadeArmor":
    "An Armor, crafted for stealth and resilience in the shadows. Earn +20% marks when pledged to this faction. Multiples of this item do not stack.",
  "description.factionShop.nightshadeHelmet":
    "A strong helmet of secrecy and silent strength. Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
  "description.factionShop.nightshadePants":
    "These pants are blending agility with the mystery of the night. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
  "description.factionShop.nightshadeSabatons":
    "Perfect design where every step is a whisper in the dark. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
  "description.factionShop.nightshadeSword":
    "A blade that strikes with the precision of moonlit steel. Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
  "description.factionShop.knightGambit":
    "Don this hat and be ready to charge into adventure with a playful twist of strategy and style.",
  "description.factionShop.motley":
    "A riot of colors stitched together in merry defiance of fashion norms.",
  "description.factionShop.royalBraids": "A hairstyle fit for a royal.",
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
  "description.battle.fish": "The rare armored swimmer of faction season!",
};

const fishermanModal: Record<FishermanModal, string> = {
  "fishermanModal.attractFish": "Привлеки рыбу, бросив в воду приманку.",
  "fishermanModal.fishBenefits":
    "Рыба отлично подходит для еды, доставки и получения наград!",
  "fishermanModal.baitAndResources":
    "Принеси мне приманку и ресурсы, и мы вытащим редчайшие призы, которые только может предложить океан!",
  "fishermanModal.crazyHappening":
    "Ух ты, происходит что-то безумное......это рыбное безумие!",
  "fishermanModal.fullMoon":
    "Wow, look at that full moon! I've heard rumours that during this time you have a chance to catch rare Marine Marvels.",
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
  "flowerBed.newSpecies.superLucky":
    ENGLISH_TERMS["flowerBed.newSpecies.superLucky"],
  "flowerBed.newSpecies.mutant": ENGLISH_TERMS["flowerBed.newSpecies.mutant"],
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
  "flower.breed.redDaffodil": "Красный нарцисс",
  "flower.breed.yellowDaffodil": "Желтый нарцисс",
  "flower.breed.purpleDaffodil": "Фиолетовый нарцисс",
  "flower.breed.whiteDaffodil": "Белый нарцисс",
  "flower.breed.blueDaffodil": "Голубой нарцисс",
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
  "flower.breed.redLotus": "Красный лотос",
  "flower.breed.yellowLotus": "Желтый лотос",
  "flower.breed.purpleLotus": "Фиолетовый лотос",
  "flower.breed.whiteLotus": "Белый лотос",
  "flower.breed.blueLotus": "Голубой лотос",
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
  "description.rapidRoast": "For Bumpkins in a hurry...",
  "description.antipasto": "Assorted bites, perfect for sharing.",
  "description.carrotJuice": "Refreshing juice, pressed fresh by bumpkins.",
  "description.fishBasket": "Oceanic flavors, sourced by goblins.",
  "description.fishBurger": "Succulent burger, loved by seaside adventurers.",
  "description.fishnChips": "Classic seaside meal, loved by all.",
  "description.fishOmelette":
    "Flavorful omelette, filled with oceanic treasures.",
  "description.friedCalamari": "Crispy calamari rings, a delicious indulgence.",
  "description.friedTofu": "Golden fried tofu, crafted with care.",
  "description.grapeJuice": "Sweet and tangy juice, freshly squeezed.",
  "description.oceansOlive":
    "Delightful oceanic dish, a true Sunflorian delicacy.",
  "description.quickJuice": "Quick energy boost, a Goblin favourite.",
  "description.riceBun": "Soft and fluffy rice bun, a favorite.",
  "description.slowJuice": "Nutrient-rich juice, handcrafted by bumpkins.",
  "description.steamedRedRice":
    "Perfectly steamed red rice, a bumpkin's delight.",
  "description.sushiRoll": "Delicious sushi roll, skillfully prepared.",
  "description.theLot": "Flavorful fruit blend, refreshing and nutritious.",
  "description.tofuScramble":
    "Hearty scramble, packed with protein and flavor.",

  // Kitchen
  "description.beetrootBlaze": "A spicy beetroot-infused magic mushroom dish",
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
  "description.fermented.shroomSyrup":
    "The essence of bees and enchanted fungi",
  "description.blueberry.jam":
    "Гоблины сделают всё что угодно ради этого варенья",
  "description.fermented.carrots": "Избыток моркови?",
  "description.sauerkraut": "Больше никакой скучной капусты!",
  "description.fancy.fries": "Фантастический картофель фри",
  "description.fermented.fish":
    "Смелый деликатес! Дай волю викингу, который живет в тебе с каждым кусочком!",

  // Smoothie Shack
  "description.apple.juice": "Освежающий напиток",
  "description.orange.juice": "Сок отлично сочетается с клаб-сэндвичем",
  "description.purple.smoothie": "Ты едва ощутишь вкус капусты",
  "description.power.smoothie":
    "Официальный напиток Bumpkin Powerlifting Society",
  "description.bumpkin.detox": "Смой грехи прошлой ночи",
  "description.banana.blast":
    "Идеальная заправка фруктами для тех, кому нужна энергия!",

  // Unused foods
  "description.roasted.cauliflower": "Любимое у гоблинов",
  "description.radish.pie": "Люди презирают, а гоблины любят.",
};

const garbageCollector: Record<GarbageCollector, string> = {
  "garbageCollector.welcome": "Добро пожаловать в мой скромный магазин.",
  "garbageCollector.description":
    "Я - Garbage Trader, и я куплю все, что у тебя есть - если только это мусор.",
};

const gameDescriptions: Record<GameDescriptions, string> = {
  // Quest Items
  "description.goblin.key": "Гоблинский ключ",
  "description.sunflower.key": "Подсолнечный ключ",
  "description.ancient.goblin.sword": "Старинный гоблинский меч",
  "description.ancient.human.warhammer": "Старинный человеческий молот",

  // Coupons
  "description.community.coin":
    "Ценная монета, которую можно обменять на награду",
  "description.bud.seedling": "Саженец для обмена на бесплатный Bud NFT",
  "description.gold.pass":
    "Эксклюзивный пропуск, который позволяет создавать редкие NFTs, торговать, дает доступ к выводу и бонусному контенту.",
  "description.rapid.growth":
    "Наносится на культуру для ускорения роста в два раза",
  "description.bud.ticket":
    "Гарантированное место на минт Bud в Sunflower Land Buds NFT drop.",
  "description.potion.ticket":
    "Награда из Potion House. Используй её для покупки предметов у Garth’а.",
  "description.trading.ticket": "Бесплатные листинги! Урааа!",
  "description.block.buck": "Ценный билет в Sunflower Land!",
  "description.beta.pass": "Дает ранний доступ к тестированию функций.",
  "description.war.bond": "Признак настоящего воина",
  "description.allegiance": "Демонстрация преданности",
  "description.jack.o.lantern": "Хэллоуинский предмет с особого события",
  "description.golden.crop": "Блестящий золотой урожай",
  "description.red.envelope": "Ого, ты счастливчик!",
  "description.love.letter": "Передай чувства любви",
  "description.solar.flare.ticket":
    "Билет, используемый во время Solar Flare сезона",
  "description.dawn.breaker.ticket":
    "Билет, используемый во время Dawn Breaker сезона",
  "description.crow.feather":
    "Билет, используемый во время Witches' Eve сезона",
  "description.mermaid.scale":
    "Билет, используемый во время Catch the Kraken сезона",
  "description.sunflower.supporter": "Признак настоящего сторонника игры!",
  "description.arcade.coin":
    "Токен, зарабатываемый в мини-играх и приключениях. Можно обменять на награды.",
  "description.farmhand.coupon": "Купон для обмена на помощника.",
  "description.farmhand": "Бампкин, принятый для помощи на ферме",
  "description.tulip.bulb": "Билет, используемый во время Spring Blossom",
  "description.treasure.key": "Посети плазу для получения награды",
  "description.rare.key": "Посети пляж для получения награды",
  "description.luxury.key":
    "Посети площадь рядом с вудлендс для получения награды",
  "description.prizeTicket":
    "Призовой билет. С его помощью можно принять участие в ежемесячном гоблинском розыгрыше.",
  "description.babyPanda":
    "Милая панда из события с Gas Hero. Удваивает опыт для новичков в течение марта.",
  "description.baozi": "Вкусное угощение с Лунного Нового Года.",
  "description.communityEgg":
    "Ого, ты, должно быть, действительно заботишься о сообществе!",
  "description.hungryHare":
    "Этот прожорливый кролик скачет по твоей ферме. Предмет особого события на Пасху 2024",
  "description.scroll": "Билет, используемый во время сезона Clash of Factions",
  "description.amberFossil": ENGLISH_TERMS["description.amberFossil"],

  // Easter Items
  "description.egg.basket": "Событие на Пасху",
  "description.blue.egg": "Голубое пасхальное яйцо",
  "description.orange.egg": "Оранжевое пасхальное яйцо",
  "description.green.egg": "Зеленое пасхальное яйцо",
  "description.yellow.egg": "Желтое пасхальное яйцо",
  "description.red.egg": "Красное пасхальное яйцо",
  "description.pink.egg": "Розовое пасхальное яйцо",
  "description.purple.egg": "Фиолетовое пасхальное яйцо",

  //Home
  "description.homeOwnerPainting":
    "Картина с изображением владельца этого дома.",

  // Emblems
  "description.goblin.emblem": "Show your allegiance to the Goblins",
  "description.sunflorian.emblem": "Show your allegiance to the Sunflorians",
  "description.bumpkin.emblem": "Show your allegiance to the Bumpkins",
  "description.nightshade.emblem": "Show your allegiance to the Nightshades",
  "description.faction.mark": "Use these in the faction shop",
};

const gameTerms: Record<GameTerms, string> = {
  "auction.winner": "Победитель аукциона!",
  "bumpkin.level": "Уровень бампкина",
  bumpkinBuzz: "Почтовый ящик",
  dailyLim: "Дневной лимит SFL",
  "farm.banned": "Эта ферма забанена",
  gobSwarm: "Толпа гоблинов!",
  "granting.wish": "Исполнит твое желание",
  "harvest.number": "{{minHarvest}}-{{maxHarvest}} harvests",
  "level.number": "Level {{level}}",
  "new.delivery.in": "Новые доставки: ",
  "new.delivery.levelup":
    "Поднимай уровень, чтобы разблокировать больше доставок.",
  "no.sfl": "Токены SFL не найдены",
  opensea: "OpenSea",
  polygonscan: "PolygonScan",
  potions: "Зелья",
  "proof.of.humanity": "Доказательство человечности",
  sflDiscord: "Discord сервер Sunflower Land",
  "in.progress": "В процессе",
  "compost.complete": "Компост готов",
  "aoe.locked": "Применен буст по площади",
  sunflowerLandCodex: "Кодекс Sunflower Land",
  "visiting.farmId": "Visting #{{farmId}}",
  "stock.inStock": "{{stock}} in stock",
  "stock.left": "{{stock}} left",
};

const genieLamp: Record<GenieLamp, string> = {
  "genieLamp.ready.wish": "Готов загадать желание?",
  "genieLamp.cannotWithdraw":
    "Ты не сможешь вывести лампу, после того как потрешь её",
};

const getContent: Record<GetContent, string> = {
  "getContent.error": "Ошибка!",
  "getContent.joining": "Входим",
  "getContent.accessGranted":
    "Теперь у тебя есть доступ. Загляни на канал в Discord",
  "getContent.connectToDiscord":
    "Ты должен быть подключен к Discord, чтобы присоединиться к каналу с ограниченным доступом.",
  "getContent.connect": "Подключиться",
  "getContent.getAccess": "Получи доступ к ограниченным группам в Discord",
  "getContent.requires": "Требуется",
  "getContent.join": "Присоединиться",
};

const getInputErrorMessage: Record<GetInputErrorMessage, string> = {
  "getInputErrorMessage.place.bid": "Ты уверен, что хочешь сделать эту ставку?",
  "getInputErrorMessage.cannot.bid":
    "Ставки нельзя изменить после того, как они были сделаны.",
};

const goblin_messages: Record<GOBLIN_MESSAGES, string> = {
  "goblinMessages.msg1": "Эй, ты! Человек! Принеси мне еды, иначе...",
  "goblinMessages.msg2":
    "Я всегда голоден. Ты принес для меня какие-нибудь угощения?",
  "goblinMessages.msg3": "Мне все равно, что это. Просто дай мне еды!",
  "goblinMessages.msg4":
    "Если ты не дашь мне чего-то поесть, то я, возможно, попробую тебя на вкус.",
  "goblinMessages.msg5":
    "Я слышал, что человеческая еда самая лучшая. Принеси мне немного!",
  "goblinMessages.msg6":
    "Эй, у тебя есть какая-нибудь еда, от которой меня не стошнит?",
  "goblinMessages.msg7":
    "Мне уже немного надоело есть одно и то же, у тебя есть что-нибудь необычное?",
  "goblinMessages.msg8":
    "Я жажду чего-то нового, у тебя есть что-нибудь экзотическое?",
  "goblinMessages.msg9":
    "Привет, у тебя не найдется чего-нибудь перекусить? Обещаю, что не украду это...может быть.",
  "goblinMessages.msg10": "Мне все равно, что это. Просто дай мне еды!",
};

const goldTooth: Record<GoldTooth, string> = {
  "goldTooth.intro.part1":
    "Аррр, мои дорогие! Район, где копают сокровища, кишит богатствами и приключениями, и скоро он откроет свои ворота для вас, смелые фермеры!",
  "goldTooth.intro.part2":
    "Будьте готовы присоединиться к моей команде, ведь охота за богатством начнется уже совсем скоро!",
};

const guideCompost: Record<GuideCompost, string> = {
  "guide.compost.addEggs.speed":
    "Добавьте яйца, чтобы ускорить процесс производства",
  "guide.compost.addEggs": "Добавить яйца",
  "guide.compost.eggs": "яиц",
  "guide.compost.cropGrowthTime": "-50% время роста урожая",
  "guide.compost.fishingBait": "Рыболовная приманка",
  "guide.compost.placeCrops":
    "Поместите растения в компостер, чтобы накормить червей",
  "guide.compost.compostCycle":
    "В результате компостного цикла образуется множество удобрений, которые можно использовать для повышения урожайности и плодоношения.",
  "guide.compost.yieldsWorms":
    "Каждый компост дает червей, которых можно использовать в качестве наживки для рыбалки",
  "guide.compost.useEggs":
    "Устали ждать? Используйте яйца, чтобы ускорить производство компоста",
  "guide.compost.addEggs.confirmation":
    "Are you sure you want to add {{noEggs}} Eggs to reduce compost production time by {{time}}?",
};

const guideFactionPet: Record<GuideFactionPet, string> = {
  "guide.factionPet.one":
    "Each week the pet will request 3 foods. When fed, the XP from the food will go to the total XP tally for the faction.",
  "guide.factionPet.two":
    "Your faction will have a goal xp they need to reach each week. If the faction reaches the goal, the next week goal will be 30% harder than the total xp achieved for the week! If the goal isn't reached, the next week goal will be 30% easier than the last weeks total xp.",
  "guide.factionPet.three":
    "If the faction doesn't reach the goal then the pet will go to sleep for 1 week.",
  "guide.factionPet.four":
    "Once the faction reaches a streak of 3 or more weeks, an XP bonus will be given to each contributing faction member when their bumpkin eats!",
  "guide.factionPet.five":
    "You will be awared marks for each food delivered. Every time you deliver the reward will reduce by 2. These rewards will reset daily. Players with an emblem bonus will get an additional bonus based on their faction bonus rank.",
  "guide.factionPet.six": ENGLISH_TERMS["guide.factionPet.six"],
  "guide.streak.beyond": ENGLISH_TERMS["guide.streak.beyond"],
  "guide.streak.one": ENGLISH_TERMS["guide.streak.one"],
  "guide.streak.two": ENGLISH_TERMS["guide.streak.two"],
  "guide.streak.three": ENGLISH_TERMS["guide.streak.three"],
  "guide.streak.four": ENGLISH_TERMS["guide.streak.four"],
  "guide.streak.furtherInfo": ENGLISH_TERMS["guide.streak.furtherInfo"],
};

const guideTerms: Record<GuideTerms, string> = {
  "guide.intro":
    "От скромных начинаний до экспертного фермерства, этот гайд ответит на все твои вопросы!",
  "gathering.guide.one":
    "Чтобы преуспеть в Sunflower Land, необходимо овладеть искусством сбора ресурсов. Начни с создания инструментов для сбора различных ресурсов. Используй надежный топор, чтобы срубить деревья и добыть древесину. Чтобы создать инструменты, посети местный верстак и обменяй монеты/ресурсы на нужный инструмент.",
  "gathering.guide.two":
    "По мере продвижения и сбора достаточного количества ресурсов вы откроете возможность расширить свою территорию. Расширение территории открывает новые горизонты в Sunflower Land. Расширение территории открывает сокровищницу ресурсов, включая плодородную почву для выращивания сельскохозяйственных культур, величественные деревья, залежи ценных камней, драгоценные железные жилы, мерцающие золотые месторождения, восхитительные фруктовые грядки и многое другое.",
  "gathering.guide.three":
    "Помните, что сбор ресурсов и расширение земель - это основа вашего фермерского пути. Принимайте вызовы и награды, которые приходят с каждым шагом, и наблюдайте, как ваша ферма процветает, наполняясь щедрыми ресурсами и бесконечными возможностями.",

  "crops.guide.one":
    "В Sunflower Land посевы играют решающую роль на вашем пути к процветанию. Сажая и собирая урожай, вы можете зарабатывать монеты или использовать их для создания ценных рецептов и предметов в игре.",
  "crops.guide.two":
    "Чтобы вырастить культуры, вам нужно приобрести соответствующие семена во внутриигровом магазине. У каждой культуры разное время роста: от 1 минуты для Sunflower до 36 часов для Kale. Когда культуры полностью вырастут, вы сможете собрать урожай и извлечь из него пользу.",
  "crops.guide.three":
    "Помните, что по мере того, как вы будете расширять свои угодья и продвигаться по игре, вам будет доступно все больше культур, что откроет новые возможности для заработка монет и изучения огромного потенциала фермерской экономики Sunflower Land. Так что пачкайте руки, сажайте семена и наблюдайте за тем, как расцветают ваши посевы, собирая урожай на пути к успеху!",

  "building.guide.one":
    "Изучите разнообразные постройки, доступные по мере продвижения в Sunflower Land. От курятников до мастерских и не только - каждое строение дает уникальные преимущества вашей ферме. Воспользуйтесь этими зданиями, чтобы оптимизировать свои сельскохозяйственные операции, повысить производительность и открыть новые возможности. Тщательно спланируйте свою территорию и наслаждайтесь наградами, которые принесет вам строительство процветающей фермы в Sunflower Land.",
  "building.guide.two":
    'В Sunflower Land здания - это краеугольный камень вашего фермерского пути. Чтобы открыть меню построек, нажмите на значок инвентаря и выберите вкладку "Постройки". Выберите нужное строение и вернитесь на экран фермы. Найдите свободное место, отмеченное зеленым цветом, и подтвердите размещение. Дождитесь окончания таймера, и ваше новое здание будет готово к использованию. Здания дают различные преимущества и открывают захватывающие игровые возможности. Стратегически правильно расположите их на своей ферме, чтобы добиться максимальной эффективности, и наблюдайте, как растет и процветает ваша фермерская империя.',

  "cooking.guide.one":
    "Приготовление пищи позволяет вам накормить своего бампкина и помочь ему получить ценные очки опыта (XP). Используя собранный урожай, вы можете приготовить вкусную еду в различных зданиях, предназначенных для ее приготовления.",
  "cooking.guide.two":
    "Начиная с Fire Pit, на каждой ферме есть базовые возможности для приготовления пищи. Однако по мере развития вы сможете открыть более продвинутые здания, такие как Kitchen, Bakery, Deli и Smoothie Shack, каждое из которых предлагает более широкий выбор рецептов и кулинарных изысков.",
  "cooking.guide.three":
    "Чтобы приготовить еду, просто выберите здание и укажите рецепт, который вы хотите приготовить. В рецепте будут указаны необходимые ингредиенты, количество XP, получаемое при употреблении, и время приготовления. Запустив процесс приготовления, следите за таймером, чтобы знать, когда еда будет готова к получению.",
  "cooking.guide.four":
    "Когда еда будет готова, заберите ее из здания, щелкнув по ней и переместив в инвентарь. После этого вы сможете взаимодействовать со своим бампкином на ферме и накормить его приготовленной едой, помогая ему получить XP и продвинуться дальше по игре.",
  "cooking.guide.five":
    "Экспериментируйте с различными рецептами, открывайте новые здания и познавайте радость кулинарии, воспитывая своего бампкина и отправляясь в восхитительное кулинарное приключение в Sunflower Land.",

  "animals.guide.one":
    "Куры в Sunflower Land - это прекрасное дополнение к вашей ферме, служащее источником яиц, которые можно использовать в различных рецептах и крафте. Чтобы завести кур, вам нужно достичь 9-го уровня и построить Hen House. После этого вы сможете купить кур или разместить уже имеющихся. Просто перетащите их на ферму, как и здания. На стандартной ферме каждый курятник вмещает до 10 кур, а если вы владеете Chicken Coop NFT, то это ограничение увеличивается до 15.",
  "animals.guide.two":
    "У каждой курицы над головой есть индикатор, отображающий ее текущее настроение или потребности. Она может быть голодной, уставшей, счастливой или готовой к кладке. Чтобы ваши куры были довольны и продуктивны, кормите их, выбирая пшеницу из инвентаря и взаимодействуя с ней. Кормление запускает таймер яиц, по которому яйца готовы к появлению на свет через 48 часов. Когда яйца будут готовы, посетите свою ферму, проверьте значок над каждой курицей и взаимодействуйте с ними, чтобы узнать тип яйца, которое вылупилось. Иногда вы можете даже обнаружить редких цыплят-мутантов, которые дают особые преимущества: ускоренное производство яиц, повышенную урожайность или уменьшенное потребление пищи.",
  "animals.guide.three":
    "Выращивание цыплят и сбор их яиц добавляет динамику и пользу вашей ферме в Sunflower Land. Экспериментируйте с рецептами, используйте яйца в своих ремесленных начинаниях и наслаждайтесь сюрпризами, которые приносят редкие куры-мутанты. Постройте процветающее птицеводческое хозяйство и пожинайте плоды своего труда, погружаясь в очаровательный мир кур в Sunflower Land.",

  "crafting.guide.one":
    "В Sunflower Land создание NFT - важнейший аспект повышения производительности фермерского хозяйства и ускорения прогресса. Эти особые предметы дают различные бонусы, такие как ускорение роста урожая, улучшение приготовления пищи и увеличение ресурсов, что может значительно ускорить ваш путь. Максимально используя монеты, вы сможете создавать инструменты, собирать ресурсы и расширять свои земли, чтобы еще больше укрепить свою фермерскую империю.",
  "crafting.guide.two":
    "Чтобы начать изготавливать предметы, мы посетим Игоря, искусного ремесленника в Санфлории. После того как вы сядете на лодку и прибудете в Санфлорию, отправляйтесь на вершину острова, чтобы поговорить с Игорем. В настоящее время он предлагает Базовое пугало, которое повышает скорость выращивания подсолнухов, картофеля и тыкв. Это отличная сделка, которая требует обмена ваших ресурсов на пугало. Получив его, вернитесь на главный остров и войдите в режим проектирования, нажав на значок белой руки в правом верхнем углу игры.",
  "crafting.guide.three":
    "В режиме дизайна вы можете стратегически правильно расставить предметы и распределить ресурсы на своей ферме, чтобы оптимизировать ее планировку и повысить визуальную привлекательность. Этот шаг имеет решающее значение для максимальной эффективности созданного вами оборудования. Например, поставьте пугало над участками, которые вы хотите усилить. Кроме того, подумайте о приобретении украшений, которые придадут вашей земле шарм и опрятность.",
  "crafting.guide.four":
    "Создавая оборудование и размещая его в стратегически важных местах, вы сможете усилить свои фермерские способности, превратить остров в дом, которым можно гордиться, и ускорить свой прогресс в Стране подсолнухов.",

  "deliveries.guide.one":
    "Доставки в Sunflower Land - это увлекательная возможность помочь голодным гоблинам и собратьям-бампкинам, получая за это вознаграждение. Каждый день вы сможете увидеть все заказы, которые у вас есть, нажав на доску доставки в левой нижней части экрана. Заказы были сделаны некоторыми местными NPC, которых можно найти в окрестностях Тыквенной Плазы. Чтобы выполнить заказ, вам нужно отправиться на лодке на Тыквенную Плазу и отыскать NPC, ожидающего доставку. Как только вы их найдете, нажмите на них, чтобы доставить заказ и получить награду.",
  "deliveries.guide.two":
    "Как новый игрок, вы начинаете с тремя слотами для заказов, но по мере развития вашей фермы вы откроете дополнительные слоты, что позволит продвинутым игрокам брать на себя больше заказов. Новые заказы поступают каждые 24 часа, предлагая различные задания - от выращивания продуктов до приготовления еды и сбора ресурсов. Выполняя заказы, вы получаете бонусы за прохождение этапов, включая блок-баксы, SFL, монеты, вкусные пирожные и другие награды. Система вознаграждений зависит от сложности задания, поэтому для получения максимального выигрыша отдавайте предпочтение тем заказам, которые предлагают большее вознаграждение. Следите за доской и выполняйте разнообразные заказы, повышая уровень и открывая новые здания, чтобы выполнять более сложные задания.",
  "deliveries.intro":
    "Отправляйтесь на разные острова и доставляйте товары, чтобы заработать награды.",
  "deliveries.new": "Новая доставка",
  "scavenger.guide.one":
    "Занимаясь скавенджингом в Sunflower Land, вы сможете обнаружить спрятанные сокровища и собрать ценные ресурсы. Первый аспект скавенджинга - это поиск сокровищ на Острове сокровищ, где вы можете стать пиратом-кладоискателем. Создав песчаную лопату и отправившись на Остров сокровищ, вы сможете копать в темных песчаных местах, чтобы обнаружить разнообразные сокровища, включая богатства, украшения и даже древние NFT с полезными свойствами.",
  "scavenger.guide.two":
    "Еще одна форма скавенджинга - сбор диких грибов, которые спонтанно появляются на вашей ферме и близлежащих островах. Эти грибы можно собирать бесплатно и использовать в рецептах, квестах и крафте. Следите за грибами, так как они появляются каждые 16 часов, а максимальное количество грибов на вашей ферме не должно превышать 5 штук. Если на вашей ферме нет места, грибы появятся на соседних островах, чтобы вы не упустили эти ценные ресурсы.",

  "fruit.guide.one":
    "В Sunflower Land фрукты играют роль ценного ресурса, который можно продать за монеты или использовать в различных рецептах и крафтах. В отличие от урожая, фруктовые лунки обладают уникальной способностью неоднократно восстанавливаться после сбора, обеспечивая игрокам надежный источник фруктов.",
  "fruit.guide.two":
    "Чтобы выращивать фрукты, тебе сначала нужно получить фруктовые лунки, которые появятся на 9 или 10 расширении твоей фермы.",
  "fruit.guide.three":
    "Путем выращивания фруктов и использования их в своей фермерской стратегии, ты сможешь значительно увеличить свою прибыль, создать вкусные рецепты и открыть для себя новые возможности в Sunflower Land.",

  "seasons.guide.one":
    "Сезоны в Sunflower Land привносят в игру оживление и свежесть, предлагая игрокам новые задачи и возможности. С наступлением каждого сезона игроков ожидает множество новых предметов для крафта, украшений, выпущенных ограниченным тиражом, животных-мутантов и редких сокровищ. Эти сезонные изменения создают динамичный и развивающийся игровой процесс, побуждая игроков адаптировать свои стратегии и исследовать новые возможности на своих фермах. Кроме того, сезонные билеты добавляют в игру стратегический элемент: игроки должны решить, как грамотно распределить свои билеты, будь то сбор редких предметов, приобретение украшений с большим запасом или обмен билетов на SFL. Механика сезонных билетов делает игру увлекательной и гарантирует, что в Sunflower Land всегда есть, чего ждать.",
  "seasons.guide.two":
    "Доступность сезонных предметов в кузнице гоблинов добавляет еще один уровень азарта. Игроки должны собрать необходимые ресурсы и сезонные билеты, чтобы изготовить эти предметы с ограниченным запасом, что придает ощущение соперничества и безотлагательности. Планирование наперед и выработка стратегии становятся решающими факторами, поскольку игроки стремятся получить желаемые предметы до того, как закончится их запас. Более того, возможность обменивать сезонные билеты на монеты обеспечивает гибкость и позволяет игрокам делать выбор в соответствии с их конкретными игровыми целями. Благодаря уникальным предложениям каждого сезона и предвкушению неожиданных событий Sunflower Land позволяет игрокам оставаться вовлеченными и развлекаться в течение всего года, создавая яркий и постоянно развивающийся фермерский опыт.",
  "pete.teaser.one": "Руби деревья",
  "pete.teaser.three": "Собери урожай подсолнухов",
  "pete.teaser.four": "Продай подсолнухи",
  "pete.teaser.five": "Купи семена",
  "pete.teaser.six": "Посади семена",
  "pete.teaser.seven": "Смастерите Scarecrow",
  "pete.teaser.eight": "Готовь еду и повышай уровень",
  "chores.hank": "",
  "chores.hank.intro": "",
  "chores.kingdom": "",
  "chores.kingdom.intro": "",
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
    "Однако мои кости уже не те, что прежде. Если ты поможешь мне с повседневными делами, я вознагражу тебя {{seasonalTicket}}.",
  "hayseedHankv2.action": "Приступим",
  "hayseedHankv2.title": "Ежедневные дела Hank'а",
  "hayseedHankv2.newChoresAvailable": "New chores:",
  "hayseedHankv2.skipChores": "Можно пропускать задания каждый новый день",
  "hayseedHankv2.greeting": "Ну здравствуй, малец! Я - Hayseed Hank...",
};

const heliosSunflower: Record<HeliosSunflower, string> = {
  "heliosSunflower.title": "Подсолнух Клайти",
  "heliosSunflower.description":
    "Только истинный спаситель может вернуться и собрать урожай этого Подсолнуха.",
  "confirmation.craft": "Ты уверен, что хочешь скрафтить {{item}}?",
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
  "howToFarm.stepThree": "3.Продай урожай в магазине за монеты",
  "howToFarm.stepFour": "4.Покупай семена, используя монеты",
  "howToFarm.stepFive": "5. Посади семена и жди",
};

const howToSync: Record<HowToSync, string> = {
  "howToSync.title": "Как синхронизироваться?",
  "howToSync.description":
    "Весь твой прогресс сохраняется на нашем игровом сервере. Тебе нужно будет синхронизироваться с блокчейном, когда ты захочешь перенести свои токены, NFT и ресурсы на Polygon.",
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
    "Убедись, что у тебя нет урожая, фруктов,цветов, зданий или кур в процессе работы. Они будут возвращены в твой инвентарь.",
  "islandupgrade.upgradeIsland": "Улучшить остров",
  "islandupgrade.newOpportunities":
    "Тебя ждет экзотический остров с новыми ресурсами и возможностями для развития твоей фермы.",
  "islandupgrade.confirmation":
    "Хочешь сделать апгрейд? Ты начнешь на маленьком острове со всеми своими предметами.",
  "islandupgrade.locked": "Заблокировано",
  "islandupgrade.exploring": "Исследование",
  "islandupgrade.welcomePetalParadise": "Добро пожаловать в Лепестковый рай!",
  "islandupgrade.welcomeDesertIsland": "Welcome to the Desert!",
  "islandupgrade.itemsReturned":
    "Твои предметы были благополучно возвращены в твой инвентарь.",
  "islandupgrade.notReadyExpandMore":
    "Ты еще не готов. Расширься еще {{remainingExpansions}} раз",
  "islandupgrade.exoticResourcesDescription":
    "Этот район Страны подсолнухов известен своими экзотическими ресурсами. Расширяйте свои земли, чтобы обнаружить фрукты, цветы, пчелиные ульи и редкие минералы!",
  "islandupgrade.desertResourcesDescription":
    "The harsh desert environment requires new technology to survive. Expand your land to discover new buildings and what's inside!",
  "islandupgrade.requiredIsland": "Unlocks at {{islandType}}",
  "islandupgrade.otherIsland": "{{island}} Island",
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
  "interactableModals.fanArt.winner": "Победитель конкурса фан-артов",
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
    "Присоединись к #bud-clubhouse в Discord чтобы следить за новостями.",
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
  "interactableModals.guildHouse.budsCollection": "OpenSea",
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
  "introPage.welcome":
    "Добро пожаловать в комнату зелий, мой любознательный ученик!",
  "introPage.description":
    "Я - Безумный Ученый Бампкин, помогу вам в этом волшебном путешествии в мир зельеварения. Приготовьтесь раскрыть секреты страны подсолнухов! Каждая попытка будет стоить 320 монет.",
  "introPage.mission":
    "Ваша задача: расшифровать правильную комбинацию зелий в заколдованной таблице.",
  "introPage.tip":
    "Помните, чем больше правильных зелий вы выберете, тем счастливее будет растение, что увеличит ваши шансы на получение редких предметов!",
  "introPage.chaosPotion": "Остерегайтесь зелья хаоса, оно все разрушает!",
  "introPage.playButton": "Давайте сыграем",
};

const islandName: Record<IslandName, string> = {
  "island.home": "Дом",
  "island.pumpkin.plaza": "Тыквенная Плаза",
  "island.beach": "Пляж",
  "island.kingdom": "Kingdom",
  "island.woodlands": "Вудлендс",
  "island.helios": "Гелиос",
  "island.goblin.retreat": "Обитель гоблинов",
};

const islandNotFound: Record<IslandNotFound, string> = {
  "islandNotFound.message": "Вы попали в самую настоящую глушь!",
  "islandNotFound.takeMeHome": "Отправиться домой",
};

const landscapeTerms: Record<LandscapeTerms, string> = {
  "landscape.intro.one": "Создайте остров своей мечты!",
  "landscape.intro.two":
    "В режиме дизайна вы можете захватывать и перетаскивать предметы.",
  "landscape.intro.three": "Создавайте редкие украшения",
  "landscape.intro.four": "Размещайте коллекционные предметы из сундука",
  "landscape.expansion.one":
    "На каждом участке земли вы найдете уникальные ресурсы, которые помогут построить вашу фермерскую империю!",
  "landscape.expansion.two": "Скоро появятся новые расширения...",
  "landscape.timerPopover": "Новое расширение",
  "landscape.dragMe": "Перетащи меня",
  "landscape.expansion.date": "Новые расширения появятся в игре 7 февраля.",
  "landscape.great.work": "Отличная работа бампкин!",
};

const levelUpMessages: Record<LevelUpMessages, string> = {
  "levelUp.2": "Ура, вы достигли второго уровня! Посевы уже трепещут.",
  "levelUp.3":
    "Поздравляем с третьим уровнем! Ты развиваешься как дикий бурьян...",
  "levelUp.4":
    "Поздравляем с четвертым уровнем! Вы официально переросли свой зеленый листочек.",
  "levelUp.5": "Пятый уровень и все еще жив! Ваша тяжелая работа окупается...",
  "levelUp.6":
    "Ого, уже шестой уровень? Ты, должно быть, силен как бык. Или, по крайней мере, твой плуг.",
  "levelUp.7":
    "Поздравляем с достижением 7-го уровня! Твоя ферма просто великолепна.",
  "levelUp.8": "Уровень 8, отличная работа! Ты сеешь семена успеха.",
  "levelUp.9":
    "Девять девяток, девятый уровень! Ваш урожай растет так же быстро, как и ваши навыки.",
  "levelUp.10":
    "Десятый уровень, двузначное число! Ваша ферма выглядит так хорошо, что даже куры впечатлены.",
  "levelUp.11": "Уровень 11, вы заставляете пролиться дождь!",
  "levelUp.12":
    "Поздравляем с 12-м уровнем! Ваша ферма действительно начинает приобретать характер.",
  "levelUp.13":
    "Счастливый 13-й уровень! Вы действительно начинаете разбираться в фермерском деле.",
  "levelUp.14": "Уровень 14, поразительно, как много вы сделали!",
  "levelUp.15":
    "Пятнадцатый и процветающий! Ваша ферма выглядит лучше, чем когда-либо.",
  "levelUp.16":
    "Поздравляем с 16-м уровнем! Ваши навыки фермерства действительно набирают обороты.",
  "levelUp.17": "Уровень 17, вы пожинаете то, что посеяли (и это хорошо!).",
  "levelUp.18": "Восемнадцатый и потенциал только растет!",
  "levelUp.19":
    "Поздравляем с 19-м уровнем! Ваша ферма растет так же быстро, как и ваши навыки.",
  "levelUp.20": "Уровень 20, вы - лучший из лучших!",
  "levelUp.21": "Двадцать первый, а урожай собираешь как профи!",
  "levelUp.22": "Поздравляем с 22-м уровнем! Ваша ферма успешно возделывается.",
  "levelUp.23": "Уровень 23, ваши навыки начинают расцветать!",
  "levelUp.24": "Ты действительно расцветаешь на 24-м уровне!",
  "levelUp.25":
    "Отметка в четверть века! Вы делаете прибыль, пока светит солнце.",
  "levelUp.26":
    "Поздравляю с 26 уровнем! Вы действительно погрузились в эту фермерскую тему.",
  "levelUp.27":
    "Уровень 27, вы действительно начинаете выделяться на общем фоне!",
  "levelUp.28": "Вы действительно подняли планку до 28 уровня!",
  "levelUp.29":
    "Поздравляю с 29-м уровнем! Вы демонстрируете серьезные навыки.",
  "levelUp.30": "30-й уровень, теперь вы настоящий фермер!",
  "levelUp.31": "Тридцать первый и все еще растет!",
  "levelUp.32": "Поздравляем с 32-м уровнем! Ваша ферма расцветает.",
  "levelUp.33": "Уровень 33, ваши фермерские навыки набирают обороты!",
  "levelUp.34": "Ты действительно растешь, уже 34-го уровня!",
  "levelUp.35": "Уровень 35, ты просто комбайн!",
  "levelUp.36":
    "Поздравляем с 36-м уровнем! Ваша ферма действительно начинает приносить успех.",
  "levelUp.37": "Уровень 37, ваши навыки действительно начинают проявляться!",
  "levelUp.38":
    "Вы действительно закладываете семена успеха, уже на 38-м уровне!",
  "levelUp.39":
    "Поздравляем с 39-м уровнем! Ваша ферма действительно начинает взрослеть.",
  "levelUp.40": "Уровень 40, вы - герой труда!",
  "levelUp.41": "Сорок первый и все крепчает!",
  "levelUp.42":
    "Поздравляем с 42-м уровнем! Ваша ферма начинает приносить плоды.",
  "levelUp.43": "43-й уровень, ты демонстрируешь серьезные навыки.",
  "levelUp.44": "Вы по-настоящему собираете плоды успеха, уже на 44-м уровне!",
  "levelUp.45": "45-й уровень - вы настоящий мастер жатвы!",
  "levelUp.46":
    "Поздравляем с 46-м уровнем! Ваши фермерские навыки начинают приносить хорошие плоды.",
  "levelUp.47": "Уровень 47 - вы поистине превращаетесь в легенду фермерства.",
  "levelUp.48": "Вы преуспеваете, уже на 48-м уровне!",
  "levelUp.49":
    "Поздравляем вас с 49-м уровнем! Вы по-настоящему начинаете пожинать плоды своего упорного труда.",
  "levelUp.50":
    "На полпути к 100! Теперь вы настоящий профессионал в сельском хозяйстве.",
  "levelUp.51": "Пятьдесят первый, а он все еще силен!",
  "levelUp.52":
    "Поздравляем с 52-м уровнем! Ваша ферма - настоящее произведение искусства.",
  "levelUp.53": "Уровень 53, ваши навыки начинают укореняться.",
  "levelUp.54":
    "Вы действительно получаете удовольствие от сбора урожая, уже на 54-м уровне!",
  "levelUp.55":
    "55-й уровень - вы настоящий фермер, с которым нужно считаться.",
  "levelUp.56":
    "Поздравляем с 56-м уровнем! Ваша ферма достигла своего расцвета.",
  "levelUp.57": "Уровень 57 - вы начинаете приобретать серьезные навыки.",
  "levelUp.58": "Вы действительно сеете семена успеха, уже на 58-м уровне!",
  "levelUp.59":
    "Поздравляем с 59-м уровнем! Ваша ферма - лучший представитель своего класса.",
  "levelUp.60": "60-й уровень - вы настоящая суперзвезда фермерского дела!",
};

const letsGo: Record<LetsGo, string> = {
  "letsGo.title": "Время играть!",
  "letsGo.description":
    "Спасибо за игру в бета-версию! Мы продолжаем работать над игрой и ценим вашу поддержку на ранних этапах!",
  "letsGo.readMore": "Подробнее об игре вы можете прочитать в ",
  "letsGo.officialDocs": "официальной документации",
};

const loser: Record<Loser, string> = {
  "loser.unsuccess": "Не повезло",
  "loser.longer": "Аукцион закрыт",
  "loser.refund.one": "Возврат средств",
};

const lostSunflorian: Record<LostSunflorian, string> = {
  "lostSunflorian.line1": "Мой отец послал меня сюда, чтобы я правил Гелиосом.",
  "lostSunflorian.line2":
    "К сожалению, этим бампкинам не нравится, что я за ними слежу.",
  "lostSunflorian.line3": "Я не могу дождаться возвращения в Санфлорию.",
};

const megaStore: Record<MegaStore, string> = {
  "megaStore.message":
    "Добро пожаловать в Мегамагазин! Ознакомьтесь с лимитированными товарами этого месяца. Если вам что-то понравится, успейте купить это, пока оно не исчезло в царстве времени.",
  "megaStore.month.sale": "Распродажи этого месяца",
  "megaStore.wearable":
    "Отличная покупка! Ваш новый предмет одежды надежно хранится в гардеробе. Оттуда вы можете надеть его на бампкина.",
  "megaStore.collectible":
    "Отличная покупка! Ваша новая коллекционная вещь надежно хранится в вашем инвентаре.",
  "megaStore.timeRemaining": "{{timeRemaining}} осталось!",
};

const modalDescription: Record<ModalDescription, string> = {
  "modalDescription.friend": "Привет, дружище!",
  "modalDescription.love.fruit":
    "Вау, ты действительно любишь фрукты так же сильно, как и я!",
  "modalDescription.gift":
    "У меня больше нет для тебя подарков. Не забудьте надеть свои новые вещи!",
  "modalDescription.limited.abilities":
    "Я создал лимитированную серию предметов одежды, которые могут улучшить твои возможности по сбору фруктов.",
  "modalDescription.trail":
    "Я ищу преданных сборщиков фруктов, которые смогут опробовать эту одежду.... БЕСПЛАТНО!",
};

const noaccount: Record<Noaccount, string> = {
  "noaccount.newFarmer": "Новый фермер",
  "noaccount.addPromoCode": "Добавить промокод?",
  "noaccount.alreadyHaveNFTFarm": "Уже есть NFT фермы?",
  "noaccount.createFarm": "Создать ферму",
  "noaccount.noFarmNFTs": "У вас нет NFT фермы.",
  "noaccount.createNewFarm": "Создать новую ферму",
  "noaccount.selectNFTID": "Выберите номер NFT фермы",
  "noaccount.welcomeMessage":
    "Welcome to Sunflower Land. Do you want to create a farm?",
  "noaccount.promoCodeLabel": "Промокод",
  "noaccount.haveFarm": "No, I have one",
  "noaccount.letsGo": "Yes, let's go!",
};

const noBumpkin: Record<NoBumpkin, string> = {
  "noBumpkin.readyToFarm": "Потрясающе, ваш Бампкин готов к фермерству!",
  "noBumpkin.play": "Играть",
  "noBumpkin.missingBumpkin": "У вас нет бампкина",
  "noBumpkin.bumpkinNFT":
    "Hmmm, that's strange. It looks like you are playing on a legacy account without a Bumpkin.",
  "noBumpkin.bumpkinHelp":
    "Вам нужен Бампкин, который поможет вам сажать, собирать урожай, рубить, добывать и расширять землю.",
  "noBumpkin.mintBumpkin": "Вы можете купить бампкина на OpenSea: ",
  "noBumpkin.allBumpkins": "Ух ты, посмотрите на всех этих бампкинов!",
  "noBumpkin.chooseBumpkin": "С кем из бампкинов вы хотели бы играть?",
  "noBumpkin.deposit": "Депозит",
  "noBumpkin.advancedIsland":
    "Это продвинутый остров. Требуется сильный бампкин: ",
  "dequipper.noBumpkins": "Нет бампкинов",
  "dequipper.missingBumpkins": "У вас в кошельке нет ни одного NFT бампкина.",
  "dequipper.intro": "Отправьте одежду с бампкина на свой кошелек.",
  "dequipper.success":
    "Поздравляем, вещи отправлены на ваш кошелек. Переместите их на свою ферму, чтобы использовать.",
  "dequipper.dequip": "Раздеть",
  "dequipper.warning":
    "После снятия экипировки бампкин больше не может быть использован.",
  "dequipper.nude": "Бампкин уже раздет",
  "noBumpkin.nude": "Нельзя снять экипировку с пустого бампкина",
};

const noTownCenter: Record<NoTownCenter, string> = {
  "noTownCenter.reward": "Награда: 1 x Town Center!",
  "noTownCenter.news": "Ваши последние новости и сообщения здесь.",
  "noTownCenter.townCenterPlacement":
    'Вы можете разместить городской центр через инвентарь > раздел "Здания".',
};

const notOnDiscordServer: Record<NotOnDiscordServer, string> = {
  "notOnDiscordServer.intro":
    "Похоже, вы еще не присоединились к Discord серверу Sunflower Land.",
  "notOnDiscordServer.joinDiscord": "Присоединитесь к нашему ",
  "notOnDiscordServer.discordServer": "Discord серверу",
  "notOnDiscordServer.completeVerification":
    "2. Пройдите верификацию и приступайте к фермерству",
  "notOnDiscordServer.acceptRules": "3. Примите правила в #rules",
};

const npc_message: Record<NPC_MESSAGE, string> = {
  // Betty
  "npcMessages.betty.msg1":
    "О божечки, я не могу дождаться, когда смогу получить свежих продуктов!",
  "npcMessages.betty.msg2":
    "Мне так не терпится попробовать новые культуры, что у тебя есть для меня?",
  "npcMessages.betty.msg3":
    "Я весь день ждала возможности собрать вкусных фруктов!",
  "npcMessages.betty.msg4":
    "Мне не терпится увидеть, какой сегодня урожай ты для меня приготовил.",
  "npcMessages.betty.msg5":
    "Мне не терпится попробовать плоды своего труда, какие продукты у тебя есть?",
  "npcMessages.betty.msg6":
    "У меня настоящая страсть к фермерству, и я всегда ищу новые и интересные культуры для выращивания.",
  "npcMessages.betty.msg7":
    "Ничто не сравнится с ощущением сбора небывалого урожая, ведь в этом и заключается суть фермерства!",
  // Blacksmith
  "npcMessages.blacksmith.msg1":
    "Мне нужны кое-какие материалы для моего последнего изобретения, есть что-нибудь?",
  "npcMessages.blacksmith.msg2":
    "Я хочу запастись кое-каким сырьем, есть что-нибудь на продажу?",
  "npcMessages.blacksmith.msg3":
    "Мне нужны кое-какие материалы для крафта, есть что-нибудь, что я могу использовать?",
  "npcMessages.blacksmith.msg4":
    "Есть ли у тебя какие-нибудь редкие или уникальные ресурсы, которые я мог бы использовать?",
  "npcMessages.blacksmith.msg5":
    "Я заинтересован в приобретении высококачественных материалов, что у тебя есть?",
  "npcMessages.blacksmith.msg6":
    "Я ищу кое-какие материалы для своего следующего проекта, что можешь мне предложить?",
  "npcMessages.blacksmith.msg7":
    "Мне нужно немного сырья, можешь что-то продать?",
  // Pumpkin' pete
  "npcMessages.pumpkinpete.msg1": "Эй, новичок! Есть свежие овощи?",
  "npcMessages.pumpkinpete.msg2":
    "Вкусные овощи? Кто-нибудь? Заберу по выгодной цене!",
  "npcMessages.pumpkinpete.msg3":
    "Свежий и восхитительный - вот мой девиз. А что у тебя есть?",
  "npcMessages.pumpkinpete.msg4":
    "Новичок в городе? Давай скрасим твой день каким-нибудь урожаем!",
  "npcMessages.pumpkinpete.msg5":
    "Нужна помощь, друг? У меня есть для тебя самые разнообразные культуры!",
  "npcMessages.pumpkinpete.msg6":
    "Энергичный Пит к вашим услугам! Урожай? Кто-нибудь?",
  "npcMessages.pumpkinpete.msg7":
    "Добро пожаловать на плазу! Давай сделаем твой день ярче с помощью урожая!",
  // Cornwell
  "npcMessages.cornwell.msg1":
    "Ах, старые добрые времена... Упорный труд - вот мой девиз. Что у тебя есть?",
  "npcMessages.cornwell.msg2":
    "У этих молодых людей совсем никакой трудовой этики! Принеси мне чего-то интересного.",
  "npcMessages.cornwell.msg3":
    "Я помню, когда... Упорный труд, вот чего не хватает!",
  "npcMessages.cornwell.msg4":
    "Знания, добытые упорным трудом, заслуживают лучшего урожая. Впечатли меня!",
  "npcMessages.cornwell.msg5":
    "История и упорный труд - вот, что нас объединяет. А ты что выберешь?",
  "npcMessages.cornwell.msg6":
    "Меня зовут Корнуэлл, и я здесь, чтобы по-настоящему познакомиться с фермой.",
  "npcMessages.cornwell.msg7":
    "Сложные задания, стоящие награды. Покажи мне, на что ты способен!",
  // Raven
  "npcMessages.raven.msg1":
    "Тьма и таинственность - вот мой стиль. Я буду брать трудный урожай.",
  "npcMessages.raven.msg2":
    "В душе я гот, и для моих зелий мне нужны самые темные растения.",
  "npcMessages.raven.msg3":
    "Сверхъестественное и зловещее - такой вайб мне нужен. Впечатли меня.",
  "npcMessages.raven.msg4":
    "Я жажду теневого урожая для своих заклинаний. Дай мне их.",
  "npcMessages.raven.msg5":
    "Принеси мне урожай, который прячется в тенях. И я не разочаруюсь.",
  "npcMessages.raven.msg6":
    "Raven, the keeper of darkness, wants your most challenging crops.",
  "npcMessages.raven.msg7":
    "Мрачные наслаждения для готического сердца. Покажи мне свой самый темный урожай.",
  // Bert
  "npcMessages.bert.msg1":
    "Чувак, эти грибы... они - ключ ко всему. Есть какие-нибудь волшебные?",
  "npcMessages.bert.msg2":
    "Грибное безумие - это я. Волшебные грибы? У кого-то?",
  "npcMessages.bert.msg3": "Все дело в грибах, детка. Отдай мне зачарованные.",
  "npcMessages.bert.msg4":
    "Я вижу разные вещи, понимаешь? Волшебные грибы - вот что мне нужно.",
  "npcMessages.bert.msg5":
    "Жизнь - это путешествие, чувак, и мне нужны эти волшебные грибы, чтобы прокатиться по ней!",
  "npcMessages.bert.msg6":
    "Берт - это имя, а грибы - это игра. Зачарованные, пожалуйста!",
  "npcMessages.bert.msg7":
    "Волшебные грибы, друг мой. Это то, что помогает мне двигаться дальше.",
  // Timmy
  "npcMessages.timmy.msg1":
    "Р-р-рар! Я медвежонок Тимми! Дай мне все фруктовые лакомства!",
  "npcMessages.timmy.msg2":
    "Я медведь, а медведи любят фрукты! У тебя есть какие-нибудь фруктовые лакомства для меня?",
  "npcMessages.timmy.msg3":
    "Фруктовые вкусности, вот в чем секрет. Это фишка Timmy, понимаешь?",
  "npcMessages.timmy.msg4":
    "Медвежьи обнимашки за фрукты! Это в стиле Тимми, понимаешь?",
  "npcMessages.timmy.msg5":
    "Жизнь в костюме медведя - сплошное удовольствие. Фрукты - это мой конек, есть какие-нибудь?",
  "npcMessages.timmy.msg6":
    "Медвежонок Тимми пришел за фруктовым весельем! Сдавай фрукты!",
  "npcMessages.timmy.msg7":
    "Фруктовые беседы с медведем! Поделись фруктовой любовью!",
  // Tywin
  "npcMessages.tywin.msg1":
    "Золото, золото и еще раз золото! Покажите мне богатства, крестьяне!",
  "npcMessages.tywin.msg2":
    "Я слежу за бампкинами, чтобы они платили свои пошлины. Золото, живо!",
  "npcMessages.tywin.msg3":
    "Крестьяне, несите мне свои богатства! Я - Тайвин, требовательный принц!",
  "npcMessages.tywin.msg4":
    "Тыквенная плаза ниже моего достоинства, но золота всегда недостаточно. Еще!",
  "npcMessages.tywin.msg5":
    "Это жизнь принца, и я требую твоего богатства. Плати налоги!",
  "npcMessages.tywin.msg6":
    "Богатство принца не знает границ. Золото, золото и еще раз золото!",
  "npcMessages.tywin.msg7":
    "Золото - моя корона, и я хочу получить все! Принеси мне свои богатства!",
  // Tango
  "npcMessages.tango.msg1":
    "Болтай, жуй и еще раз болтай! Фрукты, фрукты и еще раз фрукты!",
  "npcMessages.tango.msg2":
    "Я Танго, фруктовая беличья обезьянка! Принеси мне фруктовые сокровища!",
  "npcMessages.tango.msg3":
    "Оранжевая, дерзкая и игривая - это я. Фрукты? У кого-нибудь?",
  "npcMessages.tango.msg4":
    "Фруктовые секреты? У меня они есть! Поделись со мной фруктовыми чудесами!",
  "npcMessages.tango.msg5":
    "Фруктовое озорство и фруктовые удовольствия. Давай повеселимся!",
  "npcMessages.tango.msg6":
    "Танго - это имя, фруктовые игры - моя стихия. Дай мне!",
  "npcMessages.tango.msg7":
    "В моей семье знают толк во фруктах. Расскажи мне свои самые фруктовые истории!",
  // Miranda
  "npcMessages.miranda.msg1":
    "Потанцуй со мной, друг! Добавь что-нибудь к моей фруктовой шляпке, хорошо?",
  "npcMessages.miranda.msg2":
    "Самба и фрукты идут рука об руку. Что ты можешь мне предложить?",
  "npcMessages.miranda.msg3":
    "В ритме самбы фрукты просто необходимы. Не хочешь поделиться?",
  "npcMessages.miranda.msg4":
    "Все дело в ритме самбы и фруктовых лакомствах. Принеси что-нибудь!",
  "npcMessages.miranda.msg5":
    "Присоединяйся к празднованию самбы с фруктовым подарком для моей шляпы!",
  "npcMessages.miranda.msg6":
    "Моя шляпа любит аромат фруктов. Что ты можешь предложить?",
  "npcMessages.miranda.msg7":
    "Самба, фрукты и дружба. Давай устроим вечеринку!",
  // Finn
  "npcMessages.finn.msg1":
    "Я поймал самый большой улов в своей жизни! Рыбки? Желающие?",
  "npcMessages.finn.msg2":
    "Жизнь - это сказка рыбака, и мне есть что рассказать. Поймал несколько рыбин!",
  "npcMessages.finn.msg3":
    "Финн - рыбак, легенда и заклинатель рыб. Поймал немного рыбы?",
  "npcMessages.finn.msg4":
    "Большая рыба, большие истории и большое эго. Принеси мне свои рыбные сокровища!",
  "npcMessages.finn.msg5":
    "Крючок, леска и гордыня - это я. Ловля рыбы - это то, чем я занимаюсь!",
  "npcMessages.finn.msg6":
    "Рыбные истории, хвастовство и немного скромности. Рыбу, пожалуйста!",
  "npcMessages.finn.msg7":
    "А ты знаешь, что Surgeonfish питает слабость к пикантному вкусу апельсинов?",
  "npcMessages.finn.msg8":
    "Поймал самую большую рыбу в своей жизни. Это не просто история, это реальность!",
  // Findley
  "npcMessages.findley.msg1":
    "Не позволю Финну заполучить всю славу! Мне нужна наживка и насадка для моего большого улова!",
  "npcMessages.findley.msg2":
    "Финн не единственный, кто умеет рыбачить. Мне нужна наживка и насадка, срочно!",
  "npcMessages.findley.msg3":
    "Я покажу Финну, кто настоящий рыбак! Наживка и насадка, они должны быть у меня!",
  "npcMessages.findley.msg4":
    "Хотите поймать тунца на крючок? Они питают особую симпатию к апельсинам.",
  "npcMessages.findley.msg5":
    "В моей семье соперничество из-за рыбы. Я хочу доказать свою правоту. Наживку и насадку, пожалуйста!",
  "npcMessages.findley.msg6":
    "Финн не единственный, кто умеет ловить рыбу. Я собираюсь поймать улов всей своей жизни!",
  "npcMessages.findley.msg7":
    "Соревноваться с Финном просто необходимо. Наживку и насадку, мне нужна твоя помощь!",
  "npcMessages.findley.msg8":
    "Рыболовное соревнование брата и сестры. Наживка и насадка - мое секретное оружие!",
  "npcMessages.findley.msg9":
    "Ты знал, что Mahi Mahi не может устоять перед сладким хрустом кукурузы?",
  // Corale
  "npcMessages.corale.msg1":
    "Океан зовет, и мне нужна рыба. Помоги мне освободить моих друзей!",
  "npcMessages.corale.msg2":
    "Рыбы - мои друзья, и я должна освободить их. Ты поможешь мне?",
  "npcMessages.corale.msg3":
    "Ради любви к морю, принеси мне рыбок. Я отпущу их домой.",
  "npcMessages.corale.msg4":
    "Под волнами меня ждут друзья. Рыбачь, чтобы они могли свободно плавать!",
  "npcMessages.corale.msg5":
    "Русалка просит тебя защитить её друзей. Принеси мне рыбу, добрая душа.",
  "npcMessages.corale.msg6":
    "Свободу рыбам - вот моя цель. Помоги мне с рыбой, хорошо?",
  "npcMessages.corale.msg7":
    "Присоединяйся ко мне в морской танец жизни. Рыбачь, чтобы освободить моих друзей!",

  "npcMessages.gambit.msg1":
    "Чувствуете, что сегодня вам повезет? У меня есть пари, которое может вас заинтересовать!",
  "npcMessages.gambit.msg2":
    "Подходите! Готовы испытать свою удачу и сыграть в игру?",
  "npcMessages.gambit.msg3":
    "Ставки высоки, а игра продолжается. Вы участвуете?",
  "npcMessages.gambit.msg4":
    "У меня есть для вас рискованное предложение. Хотите сделать ставку?",
  "npcMessages.gambit.msg5":
    "Удача благоволит смелым! Посмотрим, удастся ли вам перехитрить меня.",
  "npcMessages.gambit.msg6":
    "Fancy a game of chance? The odds might be in your favor.",
  "npcMessages.gambit.msg7":
    "Ready for a gamble? I've got just the challenge for you.",
  "npcMessages.gambit.msg8":
    "Place your bets and let's see who comes out on top!",
  "npcMessages.gambit.msg9":
    "Feeling daring? I've got a high-stakes game just for you.",
  "npcMessages.queenVictoria.msg1":
    "Peasant, have you brought my taxes? The throne's coffers must be filled.",
  "npcMessages.queenVictoria.msg2":
    "I expect nothing less than perfection. Have you completed my orders?",
  "npcMessages.queenVictoria.msg3":
    "Do you have what I require, or are you wasting my time?",
  "npcMessages.queenVictoria.msg4":
    "The throne sits idle, and so do my coffers. Have you brought my dues?",
  "npcMessages.queenVictoria.msg5":
    "I trust you have brought what I asked for. Do not disappoint me.",
  "npcMessages.queenVictoria.msg6":
    "I have no time for idle chatter. Show me what you've brought.",
  "npcMessages.queenVictoria.msg7":
    "The kingdom's wealth must grow. Have you fulfilled your duty?",
  "npcMessages.queenVictoria.msg8":
    "Peasant, your queen awaits. Have you completed your task?",
  "npcMessages.queenVictoria.msg9":
    "I demand excellence. Have you brought my taxes?",
  "npcMessages.jester.msg1":
    "Welcome to the court! Ready for a jest or two about the royals?",
  "npcMessages.jester.msg2":
    "Ah, a new face! Fancy a laugh at the queen's expense?",
  "npcMessages.jester.msg3": "The court's a lively place! Got any good jokes?",
  "npcMessages.jester.msg4":
    "Hello, adventurer! Let's share a laugh about the royals.",
  "npcMessages.jester.msg5":
    "Ahoy! Ready to hear the latest jest about our dear queen?",
  "npcMessages.jester.msg6":
    "Step into the court and enjoy the humor. Got any good jokes?",
  "npcMessages.jester.msg7":
    "Greetings, friend! The court is always lively with jesters around.",
  "npcMessages.jester.msg8":
    "Well, well, look who’s here! Got any funny stories?",
  "npcMessages.jester.msg9":
    "The queen loves a good laugh. Ready to join the fun?",
};

const nftminting: Record<NFTMinting, string> = {
  "nftminting.mintAccountNFT": "Minting Account NFT",
  "nftminting.mintingYourNFT":
    "Minting your NFT and storing progress on the Blockchain",
  "nftminting.almostThere": "Almost there",
};

const npc: Record<Npc, string> = {
  "npc.Modal.Hammer": "Собирайтесь, бампкины, аукцион вот-вот начнется!",
  "npc.Modal.Marcus":
    "Эй! Тебе запрещено входить в мой дом. Не смей трогать мои вещи!",
  "npc.Modal.Billy": "Всем привет! Меня зовут Билли.",
  "npc.Modal.Billy.one":
    "Я нашел эти маленькие саженцы, но никак не могу понять, что с ними делать.",
  "npc.Modal.Billy.two":
    "Наверняка они как-то связаны с червеобразными бадами, которые появляются вокруг плазы.",
  "npc.Modal.Gabi": "Эй, бампкин!",
  "npc.Modal.Gabi.one":
    "Ты выглядишь творчески, ты когда-нибудь думал о том, чтобы внести свой вклад в игру?",
  "npc.Modal.Craig": "Почему ты так странно смотришь на меня?",
  "npc.Modal.Craig.one": "Что-то застряло в моих зубах...",
};

const npcDialogues: Record<NpcDialogues, string> = {
  // Blacksmith Intro
  "npcDialogues.blacksmith.intro1":
    "Что тебе надо? Говори быстро, время - деньги.",
  "npcDialogues.blacksmith.intro2":
    "Что привело тебя в мою мастерскую? Я занят, так что поторопись.",
  "npcDialogues.blacksmith.intro3":
    "Добро пожаловать в мое скромное местечко. Что привело тебя сюда?",
  "npcDialogues.blacksmith.intro4":
    "Озвучь свою цель. Я занят, и у меня нет времени на пустую болтовню. Что привело тебя в мою мастерскую?",
  // Blacksmith Positive Delivery
  "npcDialogues.blacksmith.positiveDelivery1":
    "Наконец-то! Ты принес все, что мне нужно. Отойди в сторону, сейчас я буду творить волшебство.",
  "npcDialogues.blacksmith.positiveDelivery2":
    "О, как раз вовремя! Ты принес именно то, что я искал. Приготовься, снаряжение теперь будет изготовлено с высокой точностью.",
  "npcDialogues.blacksmith.positiveDelivery3":
    "Хорошо. Ты доставил нужные мне материалы. Я не разочарую тебя, мои творения будут замечательными.",
  "npcDialogues.blacksmith.positiveDelivery4":
    "Впечатляет! Ты принес нужные материалы. Я превращу их в настоящие фермерские чудеса!",
  "npcDialogues.blacksmith.positiveDelivery5":
    "Хмм, тебе действительно удалось найти то, что я хотел. Отличная работа.",
  // Blacksmith Negative Delivery
  "npcDialogues.blacksmith.negativeDelivery1":
    "У тебя нет того, что мне нужно? Время потрачено впустую. Приходи, когда у тебя будет все необходимое.",
  "npcDialogues.blacksmith.negativeDelivery2":
    "Нет-нет. У тебя нет нужных материалов. Не трать мое время. Возвращайся, когда будешь готов.",
  "npcDialogues.blacksmith.negativeDelivery3":
    "Неприемлемо. У тебя нет того, что мне нужно. У меня нет времени на некомпетентность. Возвращайся, когда будешь готов.",
  "npcDialogues.blacksmith.negativeDelivery4":
    "Неудовлетворительный. У тебя нет того, что мне нужно. Возвращайся, когда будешь готов выполнить свою часть сделки.",
  "npcDialogues.blacksmith.negativeDelivery5":
    "Некомпетентно. У тебя нет нужных материалов. Не трать мое время, приходи, когда будешь готов.",
  // Blacksmith NoOrder
  "npcDialogues.blacksmith.noOrder1":
    "На данный момент у меня нет активных заказов, но если тебе нужны инструменты или материалы для крафта, я всегда готов тебе помочь. Просто скажи, и мы приступим к работе.",
  "npcDialogues.blacksmith.noOrder2":
    "Активных заказов сейчас у меня нет, но если тебе требуется прочное оборудование или материалы, нуждающиеся в обработке, я - тот кто тебе нужен.",
  // Betty Into
  "npcDialogues.betty.intro1":
    "Привет, солнышко! Сегодня был насыщенный день на рынке. Я пришла узнать, есть ли у тебя ингредиенты, которые я заказала. Они у тебя с собой?",
  "npcDialogues.betty.intro2":
    "Привет, привет! Я хотела узнать, есть ли у тебя ингредиенты, которые я заказала. Ты их взял?",
  "npcDialogues.betty.intro3":
    "Добро пожаловать на рынок Бетти! Готов узнать, есть ли у тебя нужные мне ингредиенты? Давай посмотрим, что ты приготовил для меня!",
  "npcDialogues.betty.intro4":
    "Привет, привет! Мне не терпится узнать, принес ли ты ингредиенты, которые я заказала. Покажи мне, что у тебя есть!",
  "npcDialogues.betty.intro5":
    "Приветствую тебя, мой green-thumbed друг! Мне не терпится узнать, есть ли у тебя ингредиенты, о которых я просила. Что у тебя в корзинке?",
  // Betty Positive Delivery
  "npcDialogues.betty.positiveDelivery1":
    "Ура! Ты принес ингредиенты, которые я заказывала. Они настолько свежие и сочные, насколько это возможно. Спасибо тебе, мой гений садоводства!",
  "npcDialogues.betty.positiveDelivery2":
    "Вот о чем я и говорю! У тебя есть именно те ингредиенты, которые мне были нужны. Ты порадовал меня своей быстрой доставкой. Спасибо!",
  "npcDialogues.betty.positiveDelivery3":
    "О, фантастика! Это именно те ингредиенты, которые я просила. Рынок будет в восторге. Спасибо за твою усердную работу!",
  "npcDialogues.betty.positiveDelivery4":
    "О мой сад! Эти ингредиенты просто идеальны. У тебя талант находить лучшие продукты. Спасибо тебе, мой green-thumbed герой!",
  "npcDialogues.betty.positiveDelivery5":
    "Браво! Ты принес именно те ингредиенты, которые мне были нужны. Мне не терпится использовать их для создания чего-нибудь необычного. Спасибо за быструю доставку!",
  // Betty Negative Delivery
  "npcDialogues.betty.negativeDelivery1":
    "Упси-дупси! Кажется, у тебя нет тех ингредиентов, которые я заказывала. Но не волнуйся. Продолжай поиски, и мы найдем другую возможность.",
  "npcDialogues.betty.negativeDelivery2":
    "О нет! Похоже, в данный момент у тебя нет нужных мне ингредиентов. Но не волнуйсяь. Я верю в твою находчивость. Приходи, когда у тебя будет то, что мне нужно!",
  "npcDialogues.betty.negativeDelivery3":
    "Вот блин! Похоже, у тебя сейчас нет нужных мне ингредиентов. Но продолжай искать! Может быть, в следующий раз нам больше повезет.",
  "npcDialogues.betty.negativeDelivery4":
    "Вот облом! Похоже, ингредиенты, которые ты принес, не соответствуют тому, что мне нужно. Но не падай духом, продолжай трудиться и возвращайся поскорее.",
  "npcDialogues.betty.negativeDelivery5":
    "Елки-палки! Похоже, у тебя нет именно тех ингредиентов, которые я ищу. Но не волнуйся, мой друг. Продолжай усердно трудиться, и мы отпразднуем, когда ты их найдешь!",
  // Betty NoOrder
  "npcDialogues.betty.noOrder1":
    "Сейчас у меня нет активных заказов, но это не помешает мне предложить тебе лучшие семена и урожай. Подходи и давай посмотрим, что ты хочешь прикупить!",
  "npcDialogues.betty.noOrder2":
    "На сегодняшний день у меня нет конкретного заказа, но это не проблема. Я здесь, чтобы с удовольствием предоставить тебе лучшие семена и купить твой восхитительный урожай!",
  // Grimbly Intro
  "npcDialogues.grimbly.intro1":
    "Голоден. Нужна еда. Есть что-нибудь вкусненькое для голодного гоблина?",
  "npcDialogues.grimbly.intro2":
    "Голодному гоблину нужна еда. У тебя она есть?",
  "npcDialogues.grimbly.intro3":
    "Голодающий гоблин здесь. Есть что-нибудь вкусненькое для меня?",
  "npcDialogues.grimbly.intro4":
    "Гримбли голоден. Ты принес мне что-нибудь вкусненькое?",
  // Grimbly Positive Delivery
  "npcDialogues.grimbly.positiveDelivery1":
    "Ах, наконец-то! Что-то вкусное, что утолит мой голод. Ты просто спаситель, мой друг!",
  "npcDialogues.grimbly.positiveDelivery2":
    "Ты принес еду! Гримбли утолил свой голод. Спасибо, спасибо тебе!",
  "npcDialogues.grimbly.positiveDelivery3":
    "Ура! Ты принес мне еды, чтобы я набил свой голодный желудок. Гримбли ценит твое великодушие!",
  "npcDialogues.grimbly.positiveDelivery4":
    "Праздник для Гримбли! Ты принес мне именно то, что я хотел. Твоя доброта не будет забыта!",
  // Grimbly Negative Delivery
  "npcDialogues.grimbly.negativeDelivery1":
    "Нет еды? Гримбли все еще голоден. Найди еду, принеси еду. Гримбли благодарен.",
  "npcDialogues.grimbly.negativeDelivery2":
    "Нет еды для Гримбли? У Гримбли урчит в животе. Приходи, когда найдешь что-нибудь вкусненькое.",
  "npcDialogues.grimbly.negativeDelivery3":
    "Гримбли все еще голоден. Нет еды? Продолжай искать, и, может быть, в следующий раз ты удовлетворишь мой гоблинский аппетит.",
  "npcDialogues.grimbly.negativeDelivery4":
    "С пустыми руками? У Гримбли заурчало в животе. Продолжай поиски и не забывай о гоблинском голоде!",
  // Grimbly NoOrder
  "npcDialogues.grimbly.noOrder1":
    "У Гримбли нет активного заказа для тебя, но это не значит, что я не голоден!",
  "npcDialogues.grimbly.noOrder2":
    "Сегодня нет активного заказа от Гримбли, но не переживай! Я всегда нахожусь в поисках вкусняшек. Если ты найдешь что-нибудь вкусненькое, то ты знаешь, кому это принести!",
  // Grimtootk Intro
  "npcDialogues.grimtooth.intro1":
    "Приветствую тебя, усталый путник. Ты меня ищешь?",
  "npcDialogues.grimtooth.intro2":
    "Шагни в царство теней. Ты выполнил мой заказ?",
  "npcDialogues.grimtooth.intro3":
    "Добро пожаловать, странник, в мое мистическое царство. У тебя есть то, что мне нужно?",
  "npcDialogues.grimtooth.intro4":
    "Заходи, дорогой путешественник, и раскрой секреты, которые я накопил. Ты нашел то, что я просил?",
  // Grimtooth Positive Delivery
  "npcDialogues.grimtooth.positiveDelivery1":
    "Невероятно! Ты нашел ингредиенты, которые мне нужны. Магия Sunflorea у тебя под рукой!",
  "npcDialogues.grimtooth.positiveDelivery2":
    "Чудесно! Ты нашел то, что я искал. Вместе мы проникнем в самые глубины магии!",
  "npcDialogues.grimtooth.positiveDelivery3":
    "Невероятно! Ты собрал необходимые мне мистические компоненты. Твое путешествие в царство магии начинается!",
  "npcDialogues.grimtooth.positiveDelivery4":
    "Ах, великолепно! Ты получил те неуловимые ингредиенты, которые я искал. Твое путешествие в царство магии начинается!",
  // Grimtooth Negative Delivery
  "npcDialogues.grimtooth.negativeDelivery1":
    "Увы, необходимые ингредиенты ускользают от тебя. Но не бойся. Продолжай искать, и тайны раскроются сами собой!",
  "npcDialogues.grimtooth.negativeDelivery2":
    "О, тьма и печаль. Ты не обладаешь тем, что мне нужно. Но не волнуйся; продолжай работать, и тени будут продолжать направлять тебя.",
  "npcDialogues.grimtooth.negativeDelivery3":
    "Не бойся. Продолжай работать, и волшебство проявится.",
  "npcDialogues.grimtooth.negativeDelivery4":
    "Эх, увы. У тебя нет того, что мне нужно. Возвращайся, когда найдешь.",
  // Grimtooth NoOrder
  "npcDialogues.grimtooth.noOrder1":
    "На данный момент у меня нет активных заказов, но не волнуйся. Если ты нуждаешься в изысканном мастерстве или у тебя есть материалы, с которыми я могу работать, я буду здесь, готовый творить.",
  "npcDialogues.grimtooth.noOrder2":
    "У меня нет активного заказа, который ты мог бы выполнить, но если тебе потребуется опытный мастер или у тебя есть материалы, которые нуждаются в преобразовании, то я к твоим услугам.",
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
  "bert.day":
    "You cannot withdraw this item for 3 days after claiming {{seasonalTicket}}",
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

  // Queen Victoria Intro
  "npcDialogues.queenVictoria.intro1":
    "Oh, it's you. Do you have my taxes ready, peasant?",
  "npcDialogues.queenVictoria.intro2":
    "Greetings, subject. I trust you have brought the taxes I demanded?",
  "npcDialogues.queenVictoria.intro3":
    "What do you want, peasant? I'm busy worrying about the throne. Have you brought my taxes?",
  "npcDialogues.queenVictoria.intro4":
    "Oh, the things I must tolerate. Make it quick, peasant. Did you bring my taxes?",
  "npcDialogues.queenVictoria.intro5":
    "The throne sits idle, and here you are. I hope you brought my taxes, peasant.",

  // Queen Victoria Positive Delivery
  "npcDialogues.queenVictoria.positiveDelivery1":
    "Finally, something done right. You've brought my taxes. Consider yourself acknowledged.",
  "npcDialogues.queenVictoria.positiveDelivery2":
    "Very well, this will suffice. You've brought the taxes. You may go now.",
  "npcDialogues.queenVictoria.positiveDelivery3":
    "Acceptable. You've brought my taxes. Perhaps you're not entirely useless.",
  "npcDialogues.queenVictoria.positiveDelivery4":
    "Impressive, for a peasant. The taxes are in order. You may leave.",
  "npcDialogues.queenVictoria.positiveDelivery5":
    "Good. You've managed to bring my taxes. The throne shall not remain empty forever.",

  // Queen Victoria Negative Delivery
  "npcDialogues.queenVictoria.negativeDelivery1":
    "What is this? You haven't brought my taxes? How utterly disappointing.",
  "npcDialogues.queenVictoria.negativeDelivery2":
    "Pathetic. No taxes? How do you expect the kingdom to thrive?",
  "npcDialogues.queenVictoria.negativeDelivery3":
    "Disgraceful. You come to me without the taxes. This is unacceptable.",
  "npcDialogues.queenVictoria.negativeDelivery4":
    "Really? No taxes? I should have known not to expect much from peasants.",
  "npcDialogues.queenVictoria.negativeDelivery5":
    "Useless! Without the taxes, how can I maintain the kingdom's wealth?",

  // Queen Victoria NoOrder
  "npcDialogues.queenVictoria.noOrder1":
    "Hmph, it seems I have no tasks for you at the moment. You're free to go, but don't forget who rules here.",
  "npcDialogues.queenVictoria.noOrder2":
    "No active orders for now, peasant. Consider yourself lucky. Be gone.",

  // Queen Victoria gift dialogues
  "npcDialogues.queenVictoria.reward":
    "Very well, I suppose you deserve a token for your services. Don't expect this often.",
  "npcDialogues.queenVictoria.flowerIntro":
    "Have you laid eyes on the magnificent Primula Enigma? I desire one...",
  "npcDialogues.queenVictoria.averageFlower":
    "This is not what I envisioned, but I suppose it will do. Leave it here.",
  "npcDialogues.queenVictoria.badFlower":
    "This is utterly unsuitable. Find me a better one, peasant.",
  "npcDialogues.queenVictoria.goodFlower":
    "Ah, splendid! This Primula Enigma is precisely what I wanted. Well done, for once.",

  // Gambit Intro
  "npcDialogues.gambit.intro1":
    "Hehe, what do we have here? Ready to play a game of chance, friend?",
  "npcDialogues.gambit.intro2":
    "Well, well, if it isn't my favorite risk-taker! Care to place a bet?",
  "npcDialogues.gambit.intro3":
    "Greetings, my fellow adventurer! Shall we test our luck today?",
  "npcDialogues.gambit.intro4":
    "Ah, a new face! Ready to gamble your way to fortune, or perhaps misfortune?",
  "npcDialogues.gambit.intro5":
    "Hey there! Fancy a game of wits and chance? The stakes are high, just the way I like it.",

  // Gambit Positive Delivery
  "npcDialogues.gambit.positiveDelivery1":
    "Aha! You've come through! Seems luck is on your side today.",
  "npcDialogues.gambit.positiveDelivery2":
    "Well played! You've brought exactly what I needed. Fortune favors the bold!",
  "npcDialogues.gambit.positiveDelivery3":
    "Perfect! You've delivered just what I was hoping for. Let's see if your luck holds!",
  "npcDialogues.gambit.positiveDelivery4":
    "Excellent! You've got what I needed. Seems the odds were in your favor this time.",
  "npcDialogues.gambit.positiveDelivery5":
    "Bravo! You've brought what I asked for. Perhaps there's more fortune to be found.",

  // Gambit Negative Delivery
  "npcDialogues.gambit.negativeDelivery1":
    "Oh, tough luck! You don't have what I need. Better luck next time!",
  "npcDialogues.gambit.negativeDelivery2":
    "Not quite what I was hoping for. Keep trying, and maybe the odds will be in your favor.",
  "npcDialogues.gambit.negativeDelivery3":
    "Ah, bad luck! You don't have it. But don't give up, there's always another chance!",
  "npcDialogues.gambit.negativeDelivery4":
    "Close, but not quite! You don't have what I'm looking for. Try again, the game isn't over.",
  "npcDialogues.gambit.negativeDelivery5":
    "Oops, seems you're out of luck this time. But don't worry, keep playing and you'll win eventually.",

  // Gambit NoOrder
  "npcDialogues.gambit.noOrder1":
    "Looks like I don't have any bets for you right now. Come back later and we'll see what we can wager!",
  "npcDialogues.gambit.noOrder2":
    "No games for you today, my friend. But stick around, the stakes are always changing!",

  // Jester Intro
  "npcDialogues.jester.intro1":
    "Ah, a new face in the court! Ready for a jest or two?",
  "npcDialogues.jester.intro2":
    "Greetings, friend! Fancy a laugh at the royals' expense?",
  "npcDialogues.jester.intro3":
    "Well, well, look who’s graced the court! Got any good jokes?",
  "npcDialogues.jester.intro4":
    "Hello, adventurer! Ready to hear the latest about our dear queen?",
  "npcDialogues.jester.intro5":
    "Ahoy! Step into the court and let's share a laugh or two about the royals.",

  // Jester Positive Delivery
  "npcDialogues.jester.positiveDelivery1":
    "Haha! You've brought exactly what I need. You're funnier than I thought!",
  "npcDialogues.jester.positiveDelivery2":
    "Perfect! You've got just what I asked for. Maybe you should be the jester!",
  "npcDialogues.jester.positiveDelivery3":
    "Marvelous! You've delivered right on cue. The court will be delighted!",
  "npcDialogues.jester.positiveDelivery4":
    "Fantastic! You've brought the goods. The queen will be amused!",
  "npcDialogues.jester.positiveDelivery5":
    "Splendid! Just what I needed. You might have a knack for this!",

  // Jester Negative Delivery
  "npcDialogues.jester.negativeDelivery1":
    "Oh dear, that's not what I needed. But hey, it's the thought that counts!",
  "npcDialogues.jester.negativeDelivery2":
    "Oops, not quite right! But don't worry, even the best jesters miss the mark sometimes.",
  "npcDialogues.jester.negativeDelivery3":
    "Oh no, that's not it! But don't fret, we'll laugh about this later.",
  "npcDialogues.jester.negativeDelivery4":
    "Haha, not what I asked for! But I appreciate the effort. Try again?",
  "npcDialogues.jester.negativeDelivery5":
    "Whoops, that's not what I needed. But hey, every joke has its off day!",

  // Jester NoOrder
  "npcDialogues.jester.noOrder1":
    "No tasks for you right now, friend. But feel free to stick around and enjoy the court's humor!",
  "npcDialogues.jester.noOrder2":
    "No orders today, but don't be a stranger! The court is always lively with jesters around.",

  // Jester gift dialogues
  "npcDialogues.jester.reward":
    "Bravo! Here’s a little something for your trouble. Keep the laughs coming!",
  "npcDialogues.jester.flowerIntro":
    "Ever seen a Red Balloon Flower or a Red Carnation? They always bring a smile to my face...",
  "npcDialogues.jester.averageFlower":
    "Hmm, not exactly a knee-slapper, but it'll do. Thanks!",
  "npcDialogues.jester.badFlower":
    "Oh no, this flower is as funny as a wet sock! Try again, will you?",
  "npcDialogues.jester.goodFlower":
    "Splendid! This flower is perfect. Almost as good as one of my jokes!",
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
  "offer.beginWithNFT":
    "To begin you will need to mint a free Farm NFT. This will include:",
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
    "A new season approaches, ticket deliveries will temporarily close.",
  "orderhelp.New.Season.arrival": "New seasonal deliveries opening soon.",
  "orderhelp.Wisely": "Choose wisely!",
  "orderhelp.SkipIn": "Skip in",
  "orderhelp.NoRight": "Not Right Now",
  "orderhelp.ticket.deliveries.closed":
    "Ticket deliveries are currently closed",
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

const playerTrade: Record<PlayerTrade, string> = {
  "playerTrade.no.trade": "No trades available.",
  "playerTrade.max.item": "Oh no! You've reached your max items.",
  "playerTrade.Progress":
    "Please store your progress on chain before continuing.",
  "playerTrade.transaction":
    "Oh oh! It looks like you have a transaction in progress.",
  "playerTrade.Please": "Please allow 5 minutes before continuing.",
  "playerTrade.sold": "Sold",
  "playerTrade.sale": "For sale: ",
  "playerTrade.title.congrat": "Congratulations, your listing was purchased",
};

const portal: Record<Portal, string> = {
  "portal.wrong": "Something went wrong",
  "portal.unauthorised": "unauthorised",
  "portal.example.claimPrize": "Claim your prize!",
  "portal.example.intro": "Howdy Howdy, welcome to this test portal",
  "portal.example.purchase": "Purchase fake pass",
};

const purchaseableBaitTranslation: Record<PurchaseableBaitTranslation, string> =
  {
    "purchaseableBait.fishingLure.description": "Great for catching rare fish!",
  };

const quest: Record<Quest, string> = {
  "quest.mint.free": "Mint Free Wearable",
  "quest.equipWearable": "Equip this wearable on your Bumpkin",
  "quest.congrats": "Congratulations, you have minted a {{wearable}}",
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

const removeHungryCaterpillar: Record<RemoveHungryCaterpillar, string> = {
  "removeHungryCaterpillar.title": "Remove Hungry Caterpillar?",
  "removeHungryCaterpillar.description":
    "This action will remove all your flower seeds from your inventory.",
  "removeHungryCaterpillar.removeFlowerSeeds": "Remove flower seeds",
  "removeHungryCaterpillar.confirmation":
    "Are you sure you want to remove your Hungry Caterpillar?",
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
  "restock.tooManySeeds": "You have too many seeds in your basket!",
  "seeds.reachingInventoryLimit": "You are reaching your seed basket limit!",
  "crops.noCropsToSell": ENGLISH_TERMS["crops.noCropsToSell"],
  "seeds.plantingSpot.needed": ENGLISH_TERMS["seeds.plantingSpot.needed"],
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
  "reward.woohoo": "Woohoo! You found a hidden reward.",
  "reward.connectWeb3Wallet": "Connect a Web3 Wallet for a daily reward.",
  "reward.factionPoints": "Earn glory for your faction!",
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
  "season.place.land": "Ты должен разместить это на своей земле",
  "season.megastore.discount": "SFL Скидка в Мегасторе",
  "season.supporter.gift": "Подарок для сторонников",
  "season.free.season.passes": "Бесплатные сезонные баннеры",
  "season.free.season.passes.description":
    "Получайте баннеры для каждого сезона",
  "season.vip.access": "Сезонный VIP-доступ",
  "season.vip.claim": "Claim your monthly seasonal airdrop.",
  "season.vip.description":
    "Unlock perks, discounts, bonus tickets, airdrops and more!",
  "season.mystery.gift": "Таинственный подарок",
  "season.xp.boost": "10% XP буст",
  "season.lifetime.farmer": "Фермер на всю жизнь",
  "season.free.with.lifetime": "Free with Lifetime Farmer",
  "season.vip.purchase": ENGLISH_TERMS["season.vip.purchase"],
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
    "Receive the latest news, complete chores & feed your Bumpkin.",
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
  "statements.wishing.well.worthwell":
    "There is currently {{rewards}} SFL worth of rewards in the well!",
  "statements.wishing.well.look.like":
    "It doesn't look like you are providing liquidity yet.",
  "statements.wishing.well.lucky": "Let's see how lucky you are!",
  "statements.wrongChain.one":
    "Check out this guide to help you get connected.",
  "statements.feed.bumpkin.one": "You have no food in your inventory.",
  "statements.feed.bumpkin.two":
    "You will need to cook food in order to feed your Bumpkin.",
  "statements.empty.chest": "Your chest is empty, discover rare items today!",
  "statements.chest.captcha": "Tap the chest to open it",
  "statements.frankie.plaza": "Travel to the plaza to craft rare decorations!",
  "statements.blacksmith.plaza": "Travel to the Plaza for more rare items.",
  "statements.water.well.needed.one": "Additional Water Well required.",
  "statements.water.well.needed.two":
    "In order to support more crops, build a well.",
  "statements.soldOut": "Sold out",
  "statements.soldOutWearables": "View sold out wearables",
  "statements.craft.composter": "Craft at Composter",
  "statements.wallet.to.inventory.transfer": "Deposit items from your wallet",
  "statements.crop.water": "These crops need water!",
  "statements.daily.limit": "Daily Limit: ",
  "statements.sure.buy": "Are you sure you want to buy {{item}}?",
  "statements.perplayer": "per Player",
  "statements.minted.goToChest": "Go to your chest and place it on your island",
  "statements.minted.withdrawAfterMint":
    "You will be able to withdraw your item once the mint has finished",
  "statements.startgame": "Start Game",

  "statements.session.expired":
    "It looks like your session has expired. Please refresh the page to continue playing.",
  "statements.translation.joinDiscord": "Join Discord",
};

const stopGoblin: Record<StopGoblin, string> = {
  "stopGoblin.stop.goblin": "Stop the Goblins!",
  "stopGoblin.stop.moon": "Stop the Moon Seekers!",
  "stopGoblin.tap.one": "Tap the Moon Seekers before they steal your resources",
  "stopGoblin.tap.two": "Tap the Goblins before they eat your food",
  "stopGoblin.left": "Attempts left: {{attemptsLeft}}",
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
  "description.gold.pickaxe": "Used to collect crimstone and sunstone",
  "description.rod": "Used to catch fish",
  "description.rusty.shovel": "Used to remove buildings and collectibles",
  "description.shovel": "Plant and harvest crops.",
  "description.sand.shovel": "Used for digging treasure",
  "description.sand.drill": "Drill deep for uncommon or rare treasure",
  "description.oil.drill": "Drill for oil",
};

const transactionTerms: Record<TransactionTerms, string> = {
  "transaction.starterOffer": "Starter offer",
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
  "wallet.mintFreeNFT": "Mint your NFT",
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
  "wishingWell.sflRewardsReceived": "You received {{reward}} SFL!",
  "wishingWell.wish.grantTime": "It's time to grant your wish!",
  "wishingWell.wish.granted": "Your wish has been granted.",
  "wishingWell.wish.made": "You have made a wish!",
  "wishingWell.wish.timeTillNextWish": "Time till next wish: {{nextWishTime}}",
  "wishingWell.wish.thanksForSupport":
    "Thanks for supporting the project and making a wish.",
  "wishingWell.wish.comeBackAfter":
    "Come back in {{nextWishTime}} to see just how lucky you have been!",
  "wishingWell.wish.warning.one":
    "Be aware that only the LP tokens you held at the time the wish was made will be considered when the wish is granted.",
  "wishingWell.wish.warning.two":
    "If you remove your liquidity during this time you won't receive any rewards.",
  "wishingWell.info.one":
    "The wishing well is a magical place where SFL rewards can be made just by making a wish!",
  "wishingWell.info.two":
    "Wishes are granted to farmers who provided liquidity in the game.",
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
  "withdraw.receive": "You will receive: {{sflReceived}}",
  "withdraw.select.item": "Select items to withdraw",
  "withdraw.opensea":
    "Once withdrawn, you will be able to view your items on OpenSea.",
  "withdraw.restricted":
    "Some items cannot be withdrawn. Other items may be restricted when",
  "withdraw.bumpkin.wearing":
    "Your Bumpkin is currently wearing the following item(s) that can't be withdrawn. You will need to unequip them before you can withdraw.",
  "withdraw.bumpkin.sure.withdraw":
    "Are you sure you want to withdraw your Bumpkin?",
  "withdraw.bumpkin.closed": "Bumpkin withdrawal has been permanently disabled",
  "withdraw.bumpkin.closing":
    "Bumpkins are moving off chain. Bumpkin withdrawal will be permanently disabled, {{timeRemaining}}",
  "withdraw.buds": "Select Buds to withdraw",
  "withdraw.budRestricted": "Used in today's bud box",
};

const world: Record<World, string> = {
  "world.intro.one": "Howdy Traveller! Welcome to the Pumpkin Plaza.",
  "world.intro.two":
    "The plaza is home to a diverse group of hungry Bumpkins and Goblins that need your help!",
  "world.intro.missingDelivery":
    "Hmmm, it looks like you haven't gathered resources for a delivery yet. You can still explore in the meantime.",
  "world.intro.delivery":
    "Oh great, it looks like you've got the resources for a delivery!",
  "world.intro.levelUpToTravel": "Level up to travel",
  "world.intro.findNPC": "Explore the plaza and find {{name}}.",
  "world.intro.find": "Find",
  "world.intro.visit":
    "Visit NPCs and complete deliveries to earn SFL, Coins and rare rewards.",
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
  "world.plaza": ENGLISH_TERMS["world.plaza"],
  "world.beach": ENGLISH_TERMS["world.beach"],
  "world.retreat": ENGLISH_TERMS["world.retreat"],
  "world.woodlands": ENGLISH_TERMS["world.woodlands"],
  "world.home": ENGLISH_TERMS["world.home"],
  "world.kingdom": ENGLISH_TERMS["world.kingdom"],
  "world.faction": ENGLISH_TERMS["world.faction"],
  "world.travelTo": ENGLISH_TERMS["world.travelTo"],
};

const wornDescription: Record<WornDescription, string> = {
  "worm.earthworm": "Извивающийся червяк, привлекающий мелкую рыбу.",
  "worm.grub": "Сочная личинка - идеальный вариант для продвинутых рыболовов.",
  "worm.redWiggler": "Экзотический червь, приманивающий редких рыб.",
};

const milestoneMessages: Record<MilestoneMessages, string> = {
  "milestone.noviceAngler":
    "Поздравляем, вы только что достигли отметки Novice Angler! Поймав каждую основную рыбу, вы встали на путь профессионала в рыбной ловле.",
  "milestone.advancedAngler":
    "Впечатляет, вы только что достигли отметки Advanced Angler! Вы овладели искусством ловли продвинутой рыбы. Продолжайте в том же духе!",
  "milestone.expertAngler":
    "Вау, вы только что достигли отметки Expert Angler! Теперь вы настоящий эксперт по рыбной ловле! Поймать 300 рыб - это не маленький подвиг.",
  "milestone.fishEncyclopedia":
    "Поздравляем, вы только что достигли отметки Fish Encyclopedia! Вы стали настоящим знатоком рыб! Знакомство с каждой рыбой, относящейся к базовому, продвинутому и экспертному уровню, - это выдающееся достижение.",
  "milestone.masterAngler":
    "Вау, вы только что достигли отметки Master Angler! Поймать 1500 рыб - это свидетельство вашего мастерства рыболова.",
  "milestone.marineMarvelMaster":
    "Поздравляем, вы только что достигли отметки Marine Marvel Master! Вы - бесспорный чемпион морей! Поимка каждого Marvel доказывает ваше рыболовное мастерство, как ничто другое.",
  "milestone.deepSeaDiver":
    "Поздравляем, вы только что достигли отметки Deep Sea Diver! Вы заслужили Deep Sea Helm - таинственную корону, которая привлекает Marvel'ов на ваш крючок.",
  "milestone.sunpetalSavant":
    "Поздравляем, вы только что достигли отметки Sunpetal Savant! Вы открыли для себя все возможные варианты с Sunpetal.",
  "milestone.bloomBigShot":
    "Поздравляем, вы только что достигли отметки Bloom Big Shot! Вы открыли для себя каждый вариант с Bloom.Вы - настоящий Bloom эксперт!",
  "milestone.lilyLuminary":
    "Поздравляем, вы только что достигли отметки Lily Luminary! Вы открыли для себя все варианты цветов из Lily.",
};

const event: Record<Event, string> = {
  "event.christmas": "Рождественское событие!",
  "event.LunarNewYear": "Событие, связанное с Лунным Новым годом",
  "event.GasHero": "Событие Gas Hero",
  "event.Easter": "Пасхальное событие",
  "event.valentines.rewards": "Валентиновские награды",
};

const promo: Record<Promo, string> = {
  "promo.cdcBonus": "Бонус от Crypto.com!",
  "promo.expandLand": "Дважды расширьте свою землю, чтобы получить 100 SFL.",
};

const trader: Record<Trader, string> = {
  "trader.you.pay": "Ты платишь",
  "trader.price.per.unit": "Цена за шт.",
  "trader.goblin.fee": "Комиссия гоблинов",
  "trader.they.receive": "Они получат",
  "trader.seller.receives": "Продавец получит",
  "trader.buyer.pays": "Покупатель заплатит",
  "trader.cancel.trade": "Отменить сделку",
  "trader.you.receive": "Ты получишь",
  "trader.PoH":
    'Для этой функции необходимо подтверждение "человечности". Пожалуйста, сделай быстрое селфи.',
  "trader.start.verification": "Начать верификацию",
};

export const NYON_STATUE: Record<NyonStatue, string> = {
  "nyonStatue.memory": "В память о",
  "nyonStatue.description":
    "Легендарный рыцарь, ответственный за очистку шахт от гоблинов. Вскоре после одержанной победы он был отравлен гоблинским заговорщиком. Граждане Sunflower Land воздвигли эту статую в память о его победах.",
};

const trading: Record<Trading, string> = {
  "trading.select.resources": "Выберите ресурс, чтобы просмотреть объявления",
  "trading.no.listings": "Не найдено объявлений",
  "trading.listing.congrats":
    "Поздравляем, вы только что выставили свои товары на продажу!",
  "trading.listing.deleted": "Ваше объявление было удалено",
  "trading.listing.fulfilled": "Сделка закрыта",
  "trading.your.listing": "Ваше объявление",
  "trading.you.receive": "Вы получите",
  "trading.burned": "сгорел.",
};

export const restrictionReason: Record<RestrictionReason, string> = {
  "restrictionReason.isGrowing": "{{item}} растет",
  "restrictionReason.beanPlanted": "Magic Bean растет",
  "restrictionReason.cropsGrowing": "Урожай растет",
  "restrictionReason.?cropGrowing": "{{crop}} is growing",
  "restrictionReason.basicCropsGrowing": "Базовые культуры растут",
  "restrictionReason.mediumCropsGrowing": "Средние культуры растут",
  "restrictionReason.advancedCropsGrowing": "Продвинутые культуры растут",
  "restrictionReason.fruitsGrowing": "Фрукты растут",
  "restrictionReason.treesChopped": "Деревья срублены",
  "restrictionReason.stoneMined": "Stone добыт",
  "restrictionReason.ironMined": "Iron добыто",
  "restrictionReason.goldMined": "Gold добыто",
  "restrictionReason.crimstoneMined": "Crimstone добыт",
  "restrictionReason.chickensFed": "Куры покромлены",
  "restrictionReason.treasuresDug": "Выкопаны ямы с сокровищами",
  "restrictionReason.inUse": "Используется",
  "restrictionReason.recentlyUsed": "Недавно использовалось",
  "restrictionReason.recentlyFished": "Недавно рыбачили",
  "restrictionReason.flowersGrowing": "Цветы растут",
  "restrictionReason.beesBusy": "Пчелы заняты",
  "restrictionReason.pawShaken": "Уже пожал лапку",
  "restrictionReason.festiveSeason":
    "Заблокировано во время праздничного сезона",
  "restrictionReason.noRestriction": "Нет ограничений",
  "restrictionReason.genieLampRubbed": "Genie Lamp потерта",
  "restrictionReason.oilReserveDrilled": "Oil reserves are drilled",
  "restrictionReason.buildingInUse": "Building is in use",
  "restrictionReason.beehiveInUse": "Beehive in use",
};

export const leaderboardTerms: Record<Leaderboard, string> = {
  "leaderboard.leaderboard": "Таблица лидеров",
  "leaderboard.error":
    "Ошибка при загрузке таблицы лидеров. Пожалуйста, повторите попытку позже.",
  "leaderboard.initialising":
    "Рассчитываем ваш ранг. Пожалуйста, повторите попытку позже.",
  "leaderboard.topTen": "Топ 10",
  "leaderboard.yourPosition": "Твоя позиция",
  "leaderboard.factionMembers": "Faction Members",
  "leaderboard.resultsPending": ENGLISH_TERMS["leaderboard.resultsPending"],
  "leaderboard.champions": ENGLISH_TERMS["leaderboard.champions"],
  "leaderboard.congratulations": ENGLISH_TERMS["leaderboard.congratulations"],
  "leaderboard.position": ENGLISH_TERMS["leaderboard.position"],
  "leaderboard.weeklyScore": ENGLISH_TERMS["leaderboard.weeklyScore"],
  "leaderboard.player": ENGLISH_TERMS["leaderboard.player"],
  "leaderboard.score": ENGLISH_TERMS["leaderboard.score"],
  "leaderboard.prizes": ENGLISH_TERMS["leaderboard.prizes"],
  "leaderboard.faction.description":
    ENGLISH_TERMS["leaderboard.faction.description"],
  "leaderboard.faction.bonusPrizeWeek":
    ENGLISH_TERMS["leaderboard.faction.bonusPrizeWeek"],
  "leaderboard.faction.champion": ENGLISH_TERMS["leaderboard.faction.champion"],
  "leaderboard.faction.championPrizes":
    ENGLISH_TERMS["leaderboard.faction.championPrizes"],
  "leaderboard.faction.bonusMarks":
    ENGLISH_TERMS["leaderboard.faction.bonusMarks"],
  "leaderboard.faction.topPlayers":
    ENGLISH_TERMS["leaderboard.faction.topPlayerPrizes"],
  "leaderboard.faction.topPlayerPrizes":
    ENGLISH_TERMS["leaderboard.faction.topPlayerPrizes"],
};

const gameOptions: Record<GameOptions, string> = {
  "gameOptions.title": "Game Options",
  "gameOptions.howToPlay": "How to Play? (Under Reconstruction)",
  "gameOptions.farmId": "Farm ID #{{farmId}}",
  "gameOptions.logout": "Logout",
  "gameOptions.confirmLogout": "Are you sure you want to Logout?",

  // Amoy Actions
  "gameOptions.amoyActions": "Amoy Testnet Actions",
  "gameOptions.amoyActions.timeMachine": "Time Machine",

  // Blockchain Settings
  "gameOptions.blockchainSettings": "Blockchain Settings",
  "gameOptions.blockchainSettings.refreshChain": "Refresh from Chain",
  "gameOptions.blockchainSettings.storeOnChain": "Store on Chain",
  "gameOptions.blockchainSettings.swapMaticForSFL": "Swap MATIC for SFL",
  "gameOptions.blockchainSettings.transferOwnership": "Transfer Ownership",

  // General Settings
  "gameOptions.generalSettings": "General Settings",
  "gameOptions.generalSettings.connectDiscord": "Connect to Discord",
  "gameOptions.generalSettings.assignRole": "Assign Discord Role",
  "gameOptions.generalSettings.changeLanguage": "Change Language",
  "gameOptions.generalSettings.darkMode": "Dark Mode",
  "gameOptions.generalSettings.lightMode": "Light Mode",
  "gameOptions.generalSettings.appearance": "Appearance",
  "gameOptions.generalSettings.font": "Font",
  "gameOptions.generalSettings.disableAnimations": "Disable Animations",
  "gameOptions.generalSettings.enableAnimations": "Enable Animations",
  "gameOptions.generalSettings.share": "Share",

  // Plaza Settings
  "gameOptions.plazaSettings": "Plaza Settings",
  "gameOptions.plazaSettings.title.mutedPlayers": "Muted Players",
  "gameOptions.plazaSettings.title.keybinds": "Keybinds",
  "gameOptions.plazaSettings.mutedPlayers.description":
    "In case you have muted some players using the /mute command, you can see them here and unmute them if you want.",
  "gameOptions.plazaSettings.keybinds.description":
    "Need to know what keybinds are available? Check them out here.",
  "gameOptions.plazaSettings.noMutedPlayers": "You have no muted players.",
  "gameOptions.plazaSettings.changeServer": "Change server",
};

const greenhouse: Record<GreenhouseKeys, string> = {
  "greenhouse.oilDescription": "The greenhouse needs oil to grow plants.",
  "greenhouse.oilRequired": "Oil required",
  "greenhouse.oilInMachine": "{{oil}} Oil in machine",
  "greenhouse.insertOil": "Insert Oil: {{oil}} available",
  "greenhouse.numberOil": "{{oil}} Oil",
};

const minigame: Record<Minigame, string> = {
  "minigame.chickenRescue": "Minigame - Chicken Rescue",
  "minigame.comingSoon": "Coming soon...",
  "minigame.completed": "Complete",
  "minigame.confirm": "Are you sure you want to spend the following:",
  "minigame.noPrizeAvailable": "No daily prize available",
  "minigame.playNow": "Play now",
  "minigame.purchase": "Purchase",
  "minigame.chickenRescueHelp": "Can you help me rescue the chickens?",
  "minigame.discovered.one": "Howdy Bumpkin, you've discovered a portal!",
  "minigame.discovered.two":
    "Step into the magical realm to earn rewards and glory. Good luck!",
  "minigame.communityEvent": "Community event",
  "minigame.festivalOfColors": "Festival of colors",
  "minigame.festivalOfColors.comingSoon":
    "A community event is coming on the 25th of June...",
  "minigame.festivalOfColors.intro":
    "Celebrate the season of colors in this community designed event.",
  "minigame.festivalOfColors.mission": "Find the paint bombs!",
};

const cropMachine: Record<CropMachine, string> = {
  "cropMachine.moreOilRequired": "More oil required",
  "cropMachine.oilTank": "Oil tank",
  "cropMachine.machineRuntime": "Machine runtime {{time}}",
  "cropMachine.growTimeRemaining": "Grow time remaining: {{time}}",
  "cropMachine.paused": "Paused",
  "cropMachine.readyToHarvest": "Ready to harvest",
  "cropMachine.boosted": "Boosted",
  "cropMachine.totalSeeds": "Total seeds planted: {{total}}",
  "cropMachine.totalCrops": "Total {{cropName}} yield: {{total}}",
  "cropMachine.harvest": "Harvest",
  "cropMachine.pickSeed": "Select a seed",
  "cropMachine.addSeeds": "Add {{seedType}}s",
  "cropMachine.availableInventory": "Available {{amount}}",
  "cropMachine.seeds": "Seeds: {{amount}}",
  "cropMachine.growTime": "Grow time: {{time}}",
  "cropMachine.all": "All",
  "cropMachine.addSeedPack": "Add seed pack",
  "cropMachine.notStartedYet": "Not started yet",
  "cropMachine.seedPacks": "Seed packs",
  "cropMachine.readyCropPacks": "Ready crop packs",
  "cropMachine.readyCropPacks.description":
    "You currently have {{totalReady}} crop packs to harvest! Click the pack you want to harvest.",
  "cropMachine.harvestCropPack": "Harvest crop pack",
  "cropMachine.addOil": "Add oil",
  "cropMachine.oil.description":
    "Your machine needs oil to run. Every seed pack will require a certain amount of oil based on how long the crops take to grow. As you add oil you can see how long the machine will run when given that amount.",
  "cropMachine.maxRuntime": "Max runtime: {{time}}",
  "cropMachine.oilToAdd": "Oil to add: {{amount}}",
  "cropMachine.totalRuntime": "Total runtime: {{time}}",
  "cropMachine.running": "Crop Machine is running",
  "cropMachine.stopped": "Crop Machine has stopped",
  "cropMachine.idle": "Crop Machine is idle",
  "cropMachine.name": "Crop Machine",
};

const removeCropMachine: Record<RemoveCropMachine, string> = {
  "removeCropMachine.title": "Remove Crop Machine?",
  "removeCropMachine.description":
    "This action will remove all the oil stored in your crop machine.",
};

const username: Record<Username, string> = {
  "username.tooShort": "Username is too short (min 3 characters)",
  "username.tooLong": "Username is too long (max 12 characters)",
  "username.invalidChar": "Username contains invalid characters",
  "username.startWithLetter": "Username must start with a letter",
};

export const easterEggTerms: Record<EasterEggKeys, string> = {
  "easterEgg.queensDiary": "Victoria's Diary",
  "easterEgg.jesterDiary": "Jester's Diary",
  "easterEgg.tywinDiary": "Tywin's Diary",
  "easterEgg.kingDiary": "King's Diary",
  "easterEgg.lostKnight": "Lost Knight",
  "easterEgg.knight": "Hellllllp...Don't trust the Gambit or his dirty tricks!",
  "easterEgg.kingdomBook1":
    "Dear Diary, I fear the king may never return. Whispers in the court suggest someone may seize the throne in his absence. This kingdom teeters on a knife's edge.",
  "easterEgg.kingdomBook2":
    "Tywin is too weak and far too soft on the Bumpkins. They need to pay more taxes. This kingdom needs a firm hand, not his gentle touch.",
  "easterEgg.kingdomBook3":
    "The royals are a cruel bunch. They treat everyone like dirt beneath their feet. No wonder no one likes them! At least they give me plenty of material for my jokes.",
  "easterEgg.kingdomBook4":
    "Authority and respect are crucial to suppressing the Goblins. We didn’t endure the war only to hand them power. They must be kept in their place for our kingdom's safety.",
  "easterEgg.kingdomBook5":
    "To be king, I must be extra cruel. Once I ascend the throne, all Goblins will suffer. Their rebellion ends with me, and our kingdom will be stronger for it.",
  "easterEgg.pharaohsDiary": ENGLISH_TERMS["easterEgg.pharaohsDiary"],
  "easterEgg.digbysDiary": ENGLISH_TERMS["easterEgg.digbysDiary"],
  "easterEgg.goldtoothsDiary": ENGLISH_TERMS["easterEgg.goldtoothsDiary"],
  "easterEgg.desertBook1": ENGLISH_TERMS["easterEgg.desertBook1"],
  "easterEgg.desertBook2": ENGLISH_TERMS["easterEgg.desertBook2"],
  "easterEgg.desertBook3": ENGLISH_TERMS["easterEgg.desertBook3"],
  "easterEgg.desertBook4": ENGLISH_TERMS["easterEgg.desertBook4"],
};

const changeLanguage: Record<ChangeLanguage, string> = {
  "changeLanguage.confirm":
    "This action will refresh the browser. Are you sure you want to change your language?",
  "changeLanguage.contribute": "Want to contribute your Language?",
  "changeLanguage.contribute.message":
    "If you are interested in contributing translations for your preferred language, please contact one of the Moderators in the Sunflower Land Discord Server:",
  "changeLanguage.currentLanguage": "(Current Language)",
};

export const RUSSIAN_TERMS: Record<TranslationKeys, string> = {
  ...achievementTerms,
  ...auction,
  ...addSFL,
  ...availableSeeds,
  ...base,
  ...basicTreasure,
  ...beehive,
  ...birdiePlaza,
  ...boostDescriptions,
  ...boostEffectDescriptions,
  ...bountyDescription,
  ...buildingDescriptions,
  ...bumpkinDelivery,
  ...bumpkinItemBuff,
  ...bumpkinPart,
  ...bumpkinPartRequirements,
  ...bumpkinSkillsDescription,
  ...bumpkinTrade,
  ...buyFarmHand,
  ...changeLanguage,
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
  ...cropMachine,
  ...deliveryitem,
  ...defaultDialogue,
  ...decorationDescriptions,
  ...delivery,
  ...deliveryHelp,
  ...depositWallet,
  ...desertTerms,
  ...detail,
  ...discordBonus,
  ...donation,
  ...draftBid,
  ...errorAndAccess,
  ...errorTerms,
  ...exoticShopItems,
  ...factions,
  ...factionShopDescription,
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
  ...gameOptions,
  ...gameTerms,
  ...generalTerms,
  ...genieLamp,
  ...getContent,
  ...getInputErrorMessage,
  ...goblin_messages,
  ...goldTooth,
  ...greenhouse,
  ...guideTerms,
  ...guideCompost,
  ...guideFactionPet,
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
  ...leaderboardTerms,
  ...letsGo,
  ...levelUpMessages,
  ...loser,
  ...lostSunflorian,
  ...megaStore,
  ...milestoneMessages,
  ...modalDescription,
  ...minigame,
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
  ...pending,
  ...personHood,
  ...piratechest,
  ...pirateQuest,
  ...pickserver,
  ...playerTrade,
  ...portal,
  ...purchaseableBaitTranslation,
  ...quest,
  ...questions,
  ...reaction,
  ...reactionBud,
  ...refunded,
  ...removeCropMachine,
  ...removeHungryCaterpillar,
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
  ...share,
  ...sharkBumpkinDialogues,
  ...shopItems,
  ...showingFarm,
  ...snorklerDialogues,
  ...somethingWentWrong,
  ...specialEvent,
  ...statements,
  ...stopGoblin,
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
  ...username,
  ...easterEggTerms,
};
