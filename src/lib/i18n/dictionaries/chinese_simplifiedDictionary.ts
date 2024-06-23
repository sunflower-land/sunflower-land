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
  Shelly,
  ShellyDialogue,
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
  RemoveHungryCaterpillar,
  Factions,
  GameOptions,
  Leaderboard,
  BumpkinPart,
  GreenhouseKeys,
  Minigame,
  CropMachine,
  RemoveCropMachine,
  Username,
  EasterEggKeys,
  ChangeLanguage,
  FactionShopDescription,
} from "./types";

const generalTerms: Record<GeneralTerms, string> = {
  "2x.sale": "2 倍卖价",
  achievements: "成就",
  "amount.matic": "MATIC 换算数额",
  deposit: "存入",
  add: "添加",
  addSFL: "添加 SFL",
  "add.liquidity": "添加流动性",
  "alr.claim": "已领取！",
  "alr.completed": "已完成",
  "alr.crafted": "已锻造！",
  "alr.minted": "已铸造！",
  auction: "竞拍",
  available: "可用",
  back: "返回",
  bait: "鱼饵", // Basket
  balance: "余额：",
  basket: "篮子",
  beta: "公测",
  bid: "竞标",
  bounty: "财宝", // Basket
  build: "建造",
  buy: "购买",
  cancel: "取消",
  "card.cash": "银行卡 / 现金",
  check: "查验",
  chest: "箱子",
  chores: "日常农活",
  claim: "领取",
  "claim.gift": "领取礼物",
  "claim.skill": "领取技能",
  clear: "清除",
  close: "关闭",
  "coming.soon": "即将推出",
  completed: "完成",
  confirm: "确认",
  congrats: "恭喜！",
  connecting: "连接中",
  continue: "继续",
  cook: "烹饪",
  copied: "已复制",
  "copy.address": "复制地址",
  coupons: "票券", // Basket
  craft: "锻造",
  crops: "庄稼",
  danger: "危险",
  date: "日期",
  deliveries: "送货",
  delivery: "送货",
  details: "详情：",
  donate: "捐赠",
  donating: "捐赠中",
  earn: "挣得",
  "easter.eggs": "复活节彩蛋",
  egg: "蛋",
  empty: "空的",
  equip: "装备",
  error: "错误",
  exotics: "魔法", // Translated from “magic” for contextual purposes
  "expand.land": "拓张您的地块",
  expand: "拓张",
  explore: "探索",
  farm: "农场",
  featured: "新增", // from “Featured” to “Newly Added”
  fee: "手续费", // Withdrawal Fee
  "feed.bumpkin": "喂乡包佬",
  fertilisers: "肥料",
  fish: "鱼类", // Basket
  "fish.caught": "捕获的鱼：",
  flowers: "花卉", // Basket
  foods: "食品", // Basket
  for: "换", // meaning “swap”
  forbidden: "禁止入内", // meaning forbidden to enter
  fruit: "水果",
  fruits: "水果", // Basket
  "go.home": "回农场",
  gotIt: "知道了",
  "grant.wish": "许下新愿望",
  guide: "指南",
  growing: "正在种植",
  honey: "蜂蜜",
  "hungry?": "饿了么？",
  info: "概览",
  item: "物品：",
  land: "农场",
  "last.updated": "最近更新时间：",
  "lets.go": "走吧！",
  limit: "上限", // Megastore error message, Limit: Balance / Limit
  list: "上架",
  "list.trade": "挂单上架", // Might be better to use “List item”
  loading: "加载中",
  "loser.refund": "退还资源",
  lvl: "Lv.",
  maintenance: "维护中", // added meaning to “Under Maintenance”
  "make.wish": "许一个愿望",
  "making.wish": "正在许愿",
  max: "最多",
  minimum: "至少",
  mint: "铸造",
  minting: "正在铸造",
  music: "音乐",
  next: "下一页", // meaning changed to “Next Page” since used on UI page turn
  nextSkillPtLvl: "新技能点等级：", // adjusted from “Next skill point: level”
  no: "否",
  "no.limits.exceeded": "未超出上限", // only in testnet can skip
  "no.mail": "没有邮件",
  "no.thanks": "免了谢谢",
  "ocean.fishing": "海上垂钓",
  off: "关",
  "offer.end": "报价截止余",
  ok: "好",
  on: "开",
  "open.gift": "打开礼物",
  "place.map": "放置地图上",
  "placing.bid": "投标中",
  plant: "种植",
  "please.try.again": "请稍后再试。",
  "pay.attention.feedback": "请留意反馈图标：",
  print: "打印", // builder file, is it only in testnet?
  purchased: "已购买",
  purchasing: "购买中",
  rank: "排名",
  "read.more": "更多详情", // translated to “More Info”
  refresh: "刷新",
  refreshing: "刷新中",
  remove: "移除",
  reqSkillPts: "所需技能点：",
  reqSkills: "所需技能：",
  required: "必需", // as Threshold, expansion lvl requirement, Lvl X required
  resources: "资源",
  restock: "补货",
  retry: "重试",
  "reward.discovered": "奖励揭晓",
  save: "保存",
  saving: "保存中",
  seeds: "种子", // Basket
  selected: "已选择",
  "select.resource": "选择您的添饵：", // chum selection, distinguishing “bait/chum” as “鱼饵/添饵”
  sell: "出售",
  "sell.all": "出售所有",
  "sell.one": "出售 1",
  "sell.ten": "出售 10",
  "session.expired": "进程已过期！",
  share: "分享",
  skillPts: "技能点：",
  skills: "技能",
  "skip.order": "跳过订单",
  "sound.effects": "音效：",
  start: "开始",
  submit: "提交",
  submitting: "提交中",
  success: "成功！",
  swapping: "兑换中",
  syncing: "储存中",
  task: "任务",
  "thank.you": "谢谢你！",
  tools: "工具", // Basket
  total: "总共",
  trades: "交易", // Bumpkin UI
  trading: "交易", // Map Selection Tag
  transfer: "转移", //Account
  "try.again": "再试一次",
  uhOh: "呃噢！",
  "unlock.land": "解锁更多地块", //Unknown Usecase
  unlocking: "开锁中", // Daily Reward
  unmute: "取消静音",
  "use.craft": "用于锻造物品", // item description
  verify: "验证", // Unknown Usecase
  version: "版本",
  viewAll: "查看所有", // Bumpkin UI
  visit: "拜访", // Multiple usecase: share, tab - bumpkin.io
  warning: "警告",
  welcome: "欢迎！",
  "wishing.well": "许愿池",
  withdraw: "提取", // Map Selection Tag and Bank Withdrawal
  yes: "是",
  "yes.please": "没错，有劳",
  "choose.wisely": "谨慎选择！",
  collect: "收集",
  complete: "完成",
  deliver: "送货",
  "deliveries.closed": "送货停单",
  "enjoying.event": "活动尽兴吗？",
  "flowers.found": "发现花卉",
  gift: "送礼",
  "linked.wallet": "关联钱包",
  locked: "已锁定",
  "next.order": "下一订单",
  "no.delivery.avl": "暂无送货订单",
  "no.obsessions": "暂无痴玩",
  open: "打开",
  place: "放置",
  "place.bid": "有请投标",
  "play.again": "再玩一回",
  remaining: "剩余的",
  requires: "需要",
  reward: "奖励",
  skipping: "正在跳过",
  test: "测试",
  wish: "许愿",
  opensea: "Opensea", // special term not transalting until official Chinese name
  layouts: "布局",
  labels: "标签",
  buff: "增益",
  speed: "速度",
  treasure: "财宝",
  special: "特殊",
  default: "默认",
  formula: "公式",
  chill: "冷静",
  full: "满",
  collectibles: "收集品",
  buds: "蕾芽",
  wearables: "饰物",
  skip: "跳过",
  docs: "文档",
  exit: "退出",
  compost: "堆肥",
  chicken: "鸡",
  recipes: "配方",
  unlocked: "已解锁",
  reel: "收线",
  "new.species": "新品种",
  buildings: "建筑",
  boosts: "增益道具",
  decorations: "装饰",
  searching: "搜索中",
  "copy.failed": "复制失败！",
  "copy.link": "复制链接",
  exchange: "兑换",
  "sfl/coins": "SFL/硬币",
  "are.you.sure": "是否确认？",
  banner: "旗帜",
  banners: "旗帜",
  donations: "捐赠",
  faction: "派系",
  free: "免费",
  player: "玩家",
  "remaining.free.listings": "剩余 {{listingsRemaining}} 次免费上架",
  "remaining.free.listing": "剩余 1 次免费上架",
  "remaining.free.purchases": "剩余 {{purchasesRemaining}} 次免费采购",
  "remaining.free.purchase": "剩余 1 次免费采购",
  vipAccess: "VIP 权限",
  coins: "硬币",
  greenhouse: "温室",
  "max.reached": "已加满",
  optional: "额外",
  "balance.short": "余额：",
  bought: "已购买",
  requirements: "需要",
  "time.remaining": ENGLISH_TERMS["time.remaining"],
  expired: ENGLISH_TERMS.expired,
};

const timeUnits: Record<TimeUnits, string> = {
  // Full Singular
  "time.second.full": "秒",
  "time.minute.full": "分钟",
  "time.hour.full": "小时",
  "time.day.full": "天",

  // Full Plural
  "time.seconds.full": "秒",
  "time.minutes.full": "分钟",
  "time.hours.full": "小时",
  "time.days.full": "天",

  // Medium Singular
  "time.sec.med": "秒",
  "time.min.med": "分钟",
  "time.hr.med": "小时",
  "time.day.med": "天",

  // Medium Plural
  "time.secs.med": "秒",
  "time.mins.med": "分钟",
  "time.hrs.med": "小时",
  "time.days.med": "天",

  // Short
  "time.second.short": "秒",
  "time.minute.short": "分钟",
  "time.hour.short": "小时",
  "time.day.short": "天",

  // Relative Time
  "time.seconds.ago": "{{time}} {{secondORseconds}} 前",
  "time.minutes.ago": "{{time}} {{minuteORminutes}} 前",
  "time.hours.ago": "{{time}} {{hourORhours}} 前",
  "time.days.ago": "{{time}} {{dayORdays}} 前",
};

const achievementTerms: Record<AchievementsTerms, string> = {
  "breadWinner.description": "赚得 0.001 SFL",
  "breadWinner.one": "好，好，好，伙计……看来你需要整点 SFL ！",
  "breadWinner.two":
    "在Sunflower Land，囤够充足的 SFL 对锻造工具、建筑和稀有 NFT 来说相当紧要。",
  "breadWinner.three": "赚 SFL 最快的办法就是种和卖庄稼了。",

  "sunSeeker.description": "收获向日葵 100 次",
  "cabbageKing.description": "收获卷心菜 200 次",
  "jackOLantern.description": "收获南瓜 500 次",
  "coolFlower.description": "收获花椰菜 100 次",
  "farmHand.description": "收获庄稼 10,000 次",
  "beetrootBeast.description": "收获甜菜根 2,000 次",
  "myLifeIsPotato.description": "收获土豆 5,000 次",
  "rapidRadish.description": "收获小萝卜 200 次",
  "twentyTwentyVision.description": "收获胡萝卜 10,000 次",
  "stapleCrop.description": "收获小麦 10,000 次",
  "sunflowerSuperstar.description": "收获向日葵 100,000 次",
  "bumpkinBillionaire.description": "赚 5,000 SFL",
  "patientParsnips.description": "收获防风草 5,000 次",
  "cropChampion.description": "收获 1 百万庄稼",

  "busyBumpkin.description": "到达 2 级",
  "busyBumpkin.one":
    "好喂，我志向远大的朋友！想要解锁新庄稼、地块、建筑诸如此类，你就得去升级。",
  "busyBumpkin.two": "去瞧瞧 Fire Pit，挑点好吃的菜谱煮给你那乡包佬吃。",

  "kissTheCook.description": "煮 20 顿饭菜",
  "bakersDozen.description": "烤 13 个蛋糕",
  "brilliantBumpkin.description": "达到 20 级",
  "chefDeCuisine.description": "煮 5,000 顿饭菜",

  "scarecrowMaestro.description": "锻造一个稻草人来增产你的庄稼。",
  "scarecrowMaestro.one":
    "好喂，伙计！是时候让你学学锻造的技艺好增强你的农务水准了。",
  "scarecrowMaestro.two":
    "跑去 Pumpkin Plaza，找 Blacksmith 去锻造一个稻草人吧。",

  "bigSpender.description": "花费 10 SFL",
  "museum.description": "放有 10 个不同种类的稀有物品在你农场上",
  "highRoller.description": "花费 7,500 SFL",
  "timbeerrr.description": "砍倒 150 棵树木",
  "craftmanship.description": "锻造 100 个工具",
  "driller.description": "挖取 50 个石脉",
  "ironEyes.description": "挖取 50 个铁脉",
  "elDorado.description": "挖取 50 个金脉",
  "timeToChop.description": "锻造 500 把斧头",
  "canary.description": "挖取 1,000 个石脉",
  "somethingShiny.description": "挖取 500 个铁脉",
  "bumpkinChainsawAmateur.description": "砍倒 5,000 棵树木",
  "goldFever.description": "挖取 500 个金脉",

  // Explorer
  "explorer.one":
    "让咱们把这些个树都砍了，采点木头好拓张这岛吧。上手看看咋样最顺手吧。",
  "expansion.description": "拓张你的岛屿到新的境地。",

  // Well of Prosperity
  "wellOfProsperity.description": "造一口 Well",
  "wellOfProsperity.one": "害，害，害，咱们瞧瞧这是咋了？",
  "wellOfProsperity.two":
    "看来你的庄稼都快枯死了。要想种多点庄稼你必须得先造口 Well。",

  "contractor.description": "造有 10 栋建筑在你岛上",
  "fruitAficionado.description": "收获 50 个水果",
  "fruitAficionado.one":
    "嘿，那边那位果农！水果可是大自然最甜美的礼物，叫你的农场秀色可餐。",
  "fruitAficionado.two":
    "收集有了各式水果，比如苹果、香橙和蓝莓，你就能解锁独到菜谱、增进你的厨艺再做点怡人小吃",

  "orangeSqueeze.description": "收获香橙 100 次",
  "appleOfMyEye.description": "收获苹果 500 次",
  "blueChip.description": "收获蓝莓 5,000 次",
  "fruitPlatter.description": "收获 50,000 个水果",
  "crowdFavourite.description": "完成 100 次送货",

  "deliveryDynamo.description": "完成 3 次送货",
  "deliveryDynamo.one": "好喂，可靠的农夫！到处的乡包佬都需要你帮忙送货。",
  "deliveryDynamo.two": "货送到了手，赚了他们开心，还赚来 SFL 作丰美回报。",

  "seasonedFarmer.description": "收集 50 个时季资源",
  "seasonedFarmer.one":
    "好喂，时季游侠！Sunflower Land 可是凭特殊季节丰富的特别美物与惊喜出名的。",
  "seasonedFarmer.two":
    "收集有了时季资源，你就有机会得到限时奖励、独占锻造品和稀有财物，好比攥上了当季奇旅的头等票。",
  "seasonedFarmer.three":
    "所以完成任务、参加活动以及收集时季票券好享受这 Sunflower Land 呈上的最美时节吧！",
  "treasureHunter.description": "挖 10 个洞",
  "treasureHunter.one":
    "阿嚯，猎金人！Sunflower Land 可处处藏着秘宝等着重见天日呐。",
  "treasureHunter.two":
    "拿上你那铁锹冲去 Treasure Island，把那些富贵宝藏和意外惊喜统统都挖出来吧。",
  "eggcellentCollection.description": "收集 10 个鸡蛋",
  "eggcellentCollection.one":
    "好喂，采蛋人！鸡真是出色的农场伙伴，每天都给你产出些美味鸡蛋。",
  "eggcellentCollection.two":
    "采到了鸡蛋，做饭就有了新鲜供应的原料，还能解锁特殊菜谱和额外奖励。",
};

const addSFL: Record<AddSFL, string> = {
  "addSFL.swapDetails":
    "Sunflower Land 凭 Quickswap 提供了快速兑 Matic 换 SFL 的渠道。",
  "addSFL.referralFee": "Sunflower Land 每笔交易会收取 5% 的推荐费。",
  "addSFL.swapTitle": "兑换详情",
  "addSFL.minimumReceived": "至少收到：",
};

const auction: Record<Auction, string> = {
  "auction.bid.message": "您已投下竞标。",
  "auction.reveal": "赢家揭晓",
  "auction.live": "竞拍现正举行！",
  "auction.requirement": "竞拍要求",
  "auction.start": "开拍时间",
  "auction.period": "竞拍计时",
  "auction.closed": "竞拍结束",
  "auction.const": "正在施工！",
  "auction.const.soon": "这个功能即将上线。",
  "auction.title": "竞拍和投放",
};

const availableSeeds: Record<AvailableSeeds, string> = {
  "availableSeeds.select": "还未选择种子",
  "availableSeeds.select.plant": "您希望选择哪个种子来种植？",
  "quickSelect.empty": "无温室种子",
  "quickSelect.label": "快速选择",
  "quickSelect.cropSeeds": ENGLISH_TERMS["quickSelect.cropSeeds"],
  "quickSelect.greenhouseSeeds": ENGLISH_TERMS["quickSelect.greenhouseSeeds"],
  "quickSelect.purchase": ENGLISH_TERMS["quickSelect.purchase"],
};

const base: Record<Base, string> = {
  "base.far.away": "你离得太远了",
  "base.iam.far.away": "我离得太远了",
};

const basicTreasure: Record<BasicTreasure, string> = {
  "basic.treasure.missingKey": "缺少钥匙",
  "basic.treasure.needKey": "您需要一把宝箱钥匙来开宝箱。",
  "basic.treasure.getKey": "您可以给乡包佬完成任务来拿到宝箱钥匙。",
  "basic.treasure.congratsKey": "恭喜您，您有一把宝箱钥匙了！",
  "basic.treasure.openChest": "您要开箱领取奖励吗？",
  "rare.treasure.needKey": "您需要一把稀有钥匙才能打开这个宝箱。",
  "luxury.treasure.needKey": "您需要一把奢华钥匙才能打开这个宝箱。",

  // Translate
  "budBox.open": "开",
  "budBox.opened": "已打开",
  "budBox.title": "蕾芽箱",
  "budBox.description": "每天，对应的蕾芽类型可以解锁宝箱奖励。", // Farming rewards -> Chest rewards
  "raffle.title": "哥布林抽奖",
  "raffle.description":
    "每个月您都有机会赢得奖励。获奖者名单将在 Discord 上公布。",
  "raffle.entries": "投注",
  "raffle.noTicket": "未有奖券",
  "raffle.how": "您可以通过特殊活动和乡包佬送货免费领取奖券。",
  "raffle.enter": "投注",
  "giftGiver.description":
    "恭喜，您找到了个送礼客！每天你们都可以找他们领一份免费礼物。",
  "giftGiver.label": "送礼客",
};

const beehive: Record<Beehive, string> = {
  "beehive.harvestHoney": "收集蜂蜜",
  "beehive.noFlowersGrowing": "没有花卉生长",
  "beehive.beeSwarm": "蜂群",
  "beehive.pollinationCelebration":
    "授粉庆典！友善的蜂群给你的庄稼带来了 0.2 的增益！",
  "beehive.honeyProductionPaused": "蜂蜜生产暂停",
  "beehive.yield": "产量",
  "beehive.honeyPerFullHive": "1 蜂蜜 / 满蜂窝",
  "beehive.speed": "速度",
  "beehive.fullHivePerDay": "每天 {{speed}} 个{{hive}}",
  "beehive.estimatedFull": "预计满员",
  "beehive.hive.singular": "蜂窝",
  "beehive.hives.plural": "蜂窝",
};

const birdiePlaza: Record<BirdiePlaza, string> = {
  "birdieplaza.birdieIntro": "嘿，我是 Birdie，这儿最美的乡包佬！",
  "birdieplaza.admiringOutfit": "我看你是在欣赏我的衣服。漂亮坏了，是吧？！？",
  "birdieplaza.currentSeason":
    "我们目前正处于 {{currentSeason}} 季节，乡包佬们对 {{seasonalTicket}} 疯狂不已。",
  "birdieplaza.collectTickets":
    "收集足够的 {{seasonalTicket}} 即可制作稀有 NFT。这就是我获得这套稀有服装的方法！",
  "birdieplaza.whatIsSeason": "什么是时季？",
  "birdieplaza.howToEarnTickets": "我怎样赚取",
  "birdieplaza.earnTicketsVariety":
    "您可以通过多种方式赚取 {{seasonalTicket}}。",
  "birdieplaza.commonMethod":
    "赚取 {{seasonalTicket}} 最常见的方法是收集资源并将其交给广场上的乡包佬。",
  "birdieplaza.choresAndRewards":
    "您还可以通过完成 Hank 的日常农活和领取每日奖励来赚取 {{seasonalTicket}}！",
  "birdieplaza.gatherAndCraft":
    "收集足够的 {{seasonalTicket}} 你就可以像我一样购买一些稀有物品。",
  "birdieplaza.newSeasonIntro": "Sunflower Land 每 3 个月会迎来一个新的时季。",
  "birdieplaza.seasonQuests": "这个时季有激动人心的任务和稀有收藏品等你赚取。",
  "birdieplaza.craftItems":
    "要获得这些稀有物品，您必须收集 {{seasonalTicket}} 并在 Stella's Megastore 兑换或在拍卖行竞标。",
};

const boostDescriptions: Record<BoostDescriptions, string> = {
  // Mutant Chickens
  "description.speed.chicken.one": "你的鸡产蛋速度会加快 10 %。",
  "description.speed.chicken.two": "产蛋速度加快 10 %",
  "description.fat.chicken.one": "你的鸡小麦喂食量会减少 10 %。",
  "description.fat.chicken.two": "小麦喂食量减少 10 %",
  "description.rich.chicken.one": "你的鸡产蛋量会提高 10 %。",
  "description.rich.chicken.two": "产蛋量提高 10 %",
  "description.ayam.cemani": "世上最稀有的鸡！",
  "description.el.pollo.veloz.one": "你的鸡下蛋速度会加快 4 小时。",
  "description.el.pollo.veloz.two": "交出那些蛋，快！鸡的下蛋速度加快 4 小时。",
  "description.banana.chicken":
    "一只能让香蕉增加产量的鸡。我们这世界可真奇妙。",

  // Boosts
  "description.lab.grow.pumpkin": "+0.3 南瓜产量",
  "description.lab.grown.radish": "+0.4 小萝卜产量",
  "description.lab.grown.carrot": "+0.2 胡萝卜产量",
  "description.purple.trail":
    "有了这迷人独特的 Purple Trail，让你的对手垂涎食尘吧",
  "description.obie": "凶悍的长茄兵。",
  "description.maximus": "用丰满的 Maximus 碾压全场",
  "description.mushroom.house":
    "好一个真上老菌的奇趣妙妙屋，四壁散发迷人魅力，家具孢含惊奇！",
  "description.Karkinos": "咔叽诺斯。掐得也温柔，卷心好帮手！",
  "description.tin.turtle":
    "Tin Turtle 会为你在其作用范围内开采的石头带来 +0.1 增益",
  "description.emerald.turtle":
    "Emerald Turtle 会为你在其作用范围内开采的任何基矿带来 +0.5 增益",
  "description.iron.idol": "每次开采铁矿，偶像都会额外赐你 1 块铁矿",
  "description.crim.peckster": "一位精通揪出红宝石的宝石侦探",
  "description.skill.shrimpy": "Shrimpy 来帮忙了！他来保你从鱼身上获取额外 XP",
  "description.soil.krabby":
    "微笑面对挑拣！有这位坚壳硬汉超人相伴，享受更快 10 % 的堆肥时间",
  "description.nana": "这个稀有品种的香蕉美人保你香蕉收成有所增进",
  "description.grain.grinder": "磨碎你的谷物，享受美味蛋糕，增加你获得的 XP",
  "description.kernaldo": "神奇的玉米语者。",
  "description.kernaldo.1": "神奇的玉米语者让玉米达 25 % 更快高长大",
  "description.poppy": "神秘的玉米粒。",
  "description.poppy.1": "神秘的玉米粒。玉米产量 +0.1",
  "description.victoria.sisters": "热爱南瓜的姐妹们",
  "description.undead.rooster": "战争的不幸亡者。提升 10 % 鸡蛋产量。",
  "description.observatory": "探索星辰，科技飞跃",
  "description.engine.core": "向日葵之力",
  "description.time.warp.totem":
    "庄稼、树木、烹饪和基矿的速度加倍。仅持续2小时（请在开始计时/收获资源前放置）",
  "description.time.warp.totem.expired":
    "你的 Time Warp Totem 已过期。前往 Pumpkin Plaza 发现并锻造更多魔法物品以提升你的耕作能力吧！",
  "description.time.warp.totem.temporarily":
    "Time Warp Totem 可以暂时提升你的烹饪、庄稼、树木和基矿的成长速度。充分利用它吧！",
  "description.cabbage.boy": "不要吵醒宝宝！",
  "description.cabbage.girl": "嘘，它正在睡觉",
  "description.wood.nymph.wendy": "施放一个魔法来吸引林中仙子",
  "description.peeled.potato": "一颗珍贵的土豆，能在收获时带来额外土豆",
  "description.potent.potato": "强效！在收获时有 3 % 的机会 +10 土豆",
  "description.radical.radish": "激进！在收获时有 3 % 的机会 +10 小萝卜",
  "description.stellar.sunflower": "卓越！在收获时有 3 % 的机会 +10 向日葵",
  "description.lady.bug":
    "一种令人啧啧称奇的虫子，以蚜虫为食。 能够提升苹果品质",
  "description.squirrel.monkey":
    "天然的香橙捕食客。有 Squirrel Monkey 在附近时，橙树都感到害怕",
  "description.black.bearry":
    "他最喜欢的零食——丰满多汁的蓝莓。他一把把地狼吞虎咽！",
  "description.maneki.neko": "招财猫。拉动手臂，好运来临",
  "description.easter.bunny": "一个稀有的复活节物品",
  "description.pablo.bunny": "一只神奇的复活节兔子",
  "description.foliant": "一本咒法书",
  "description.tiki.totem": "Tiki Totem 会在你每次砍树时额外增加 0.1 个木头",
  "description.lunar.calendar": "庄稼现在遵循满月周期！庄稼生长速度提高 10 %",
  "description.heart.davy.jones":
    "谁拥有它，谁就拥有掌控七大洋的浩瀚力量，可以挖掘财宝不知疲倦",
  "description.treasure.map":
    "一张魔法地图，能引领持有者找到珍贵的财宝。沙岸财宝的利润 +20 %",
  "description.genie.lamp":
    "一盏有魔力的灯，里面有一个能帮你实现三个愿望的精灵",
  "description.basic.scarecrow": ENGLISH_TERMS["description.basic.scarecrow"],
  "description.scary.mike": ENGLISH_TERMS["description.scary.mike"],
  "description.laurie.chuckle.crow":
    ENGLISH_TERMS["description.laurie.chuckle.crow"],
  "description.immortal.pear": "一种能使果树寿命变长的长寿梨",
  "description.bale": "家禽们最喜欢的邻居，为鸡们提供一个舒适的休息地",
  "description.sir.goldensnout":
    "一位皇家成员，Sir Goldensnout 通过它的黄金肥料为您的农场带来了治下繁荣",
  "description.freya.fox":
    "迷人的守护者，用她的神秘魅力来促进南瓜的生长。在她的注视下，收获大量南瓜。",
  "description.queen.cornelia":
    "掌控Queen Cornelia的威严力量，并体验大块区域内玉米产量的显著提升。+1 玉米",
  "description.heart.of.davy.jones":
    "谁拥有它，谁就拥有掌控七大洋的浩瀚力量，可以挖掘财宝不知疲倦",
  "description.knight.chicken": "一只强大而高贵的鸡为您的油田增强产出",
};

const boostEffectDescriptions: Record<BoostEffectDescriptions, string> = {
  "description.obie.boost": "-25 % 茄子生长时间",
  "description.purple.trail.boost": "+0.2 茄子",
  "description.freya.fox.boost": "+0.5 南瓜",
  "description.sir.goldensnout.boost": "+0.5 庄稼(AOE 4x4)",
  "description.maximus.boost": "+1 茄子",
  "description.basic.scarecrow.boost":
    "-20 % 低阶庄稼生长时间：向日葵土豆和南瓜(AOE 3x3)",
  "description.scary.mike.boost":
    "+0.2 中阶庄稼：胡萝卜、卷心菜、大豆、甜菜根、花椰菜和防风草(AOE 3x3)",
  "description.laurie.chuckle.crow.boost":
    "+0.2 高阶庄稼：茄子玉米、小萝卜、小麦和羽衣甘蓝(AOE 3x3)",
  "description.bale.boost": "+0.2 鸡蛋(AOE 4x4)",
  "description.immortal.pear.boost": "每个种子水果收获次数 +1",
  "description.treasure.map.boost": "财宝售价 +20 % SFL",
  "description.poppy.boost": "+0.1 玉米",
  "description.kernaldo.boost": "-25% 玉米生长时间",
  "description.grain.grinder.boost": "+20% 蛋糕 XP",
  "description.nana.boost": "-10 % 香蕉生长时间",
  "description.soil.krabby.boost": "-10 % 堆肥器堆肥时间",
  "description.skill.shrimpy.boost": "+20 % 鱼 XP",
  "description.iron.idol.boost": "+1 铁矿",
  "description.emerald.turtle.boost": "+0.5 石头铁矿黄金(AOE 3x3)",
  "description.tin.turtle.boost": "+0.1 石头(AOE 3x3)",
  "description.heart.of.davy.jones.boost": "挖宝的每日限制 +20",
  "description.Karkinos.boost": "+0.1 卷心菜(对 Cabbage Boy 没有效果)",
  "description.mushroom.house.boost": "+0.2 野生蘑菇",
  "description.boost.gilded.swordfish": "+0.1 黄金",
  "description.nancy.boost": "-15 % 庄稼生长时间",
  "description.scarecrow.boost": "-15 % 庄稼生长时间；+20 % 庄稼产量",
  "description.kuebiko.boost": "-15 % 庄稼生长时间；+20 % 庄稼产量；免费种子",
  "description.gnome.boost": "+10 中阶/高阶庄稼(影响正下方一格土壤)",
  "description.lunar.calendar.boost": "-10 % 庄稼生长时间",
  "description.peeled.potato.boost": "20 % 几率 +1 土豆",
  "description.victoria.sisters.boost": "+20 % 南瓜",
  "description.easter.bunny.boost": "+20 % 胡萝卜",
  "description.pablo.bunny.boost": "+0.1 胡萝卜",
  "description.cabbage.boy.boost":
    "+0.25 卷心菜(当 Cabbage Girl 生效时 +0.5 卷心菜)",
  "description.cabbage.girl.boost": "-50 % 卷心菜生长时间",
  "description.golden.cauliflower.boost": "+100 % 花椰菜",
  "description.mysterious.parsnip.boost": "-50 % 防风草生长时间",
  "description.queen.cornelia.boost": "+1 玉米(AOE 3x4)",
  "description.foliant.boost": "+0.2 羽衣甘蓝",
  "description.hoot.boost": "+0.5 小麦、小萝卜、羽衣甘蓝、稻米",
  "description.hungry.caterpillar.boost": "免费花卉种子",
  "description.black.bearry.boost": "+1 蓝莓",
  "description.squirrel.monkey.boost": "-50 % 香橙生长时间",
  "description.lady.bug.boost": "+0.25 苹果",
  "description.banana.chicken.boost": "+0.1 香蕉",
  "description.carrot.sword.boost": "变种庄稼几率提升 4 倍",
  "description.stellar.sunflower.boost": "3 % 几率 +10 向日葵",
  "description.potent.potato.boost": "3 % 几率 +10 土豆",
  "description.radical.radish.boost": "3 % 几率 +10 小萝卜",
  "description.lg.pumpkin.boost": "+0.3 南瓜",
  "description.lg.carrot.boost": "+0.2 胡萝卜",
  "description.lg.radish.boost": "+0.4 小萝卜",
  "description.fat.chicken.boost": "-0.1 小麦喂食量",
  "description.rich.chicken.boost": "+0.1 鸡蛋",
  "description.speed.chicken.boost": "-10 % 产蛋时间",
  "description.ayam.cemani.boost": "+0.2 鸡蛋",
  "description.el.pollo.veloz.boost": "-4 小时产蛋时间",
  "description.rooster.boost": "变种鸡几率提升 2 倍",
  "description.undead.rooster.boost": "+0.1 鸡蛋",
  "description.chicken.coop.boost":
    "+1 鸡蛋产量；每个 Hen House 的养鸡数量上限 +5",
  "description.gold.egg.boost": "喂鸡不再需要小麦",
  "description.woody.beaver.boost": "+20 % 木头",
  "description.apprentice.beaver.boost": "+20 % 木头；-50 % 树木恢复时间",
  "description.foreman.beaver.boost":
    "+20 % 木头；-50 % 树木恢复时间；砍树不再需要斧头",
  "description.wood.nymph.wendy.boost": "+0.2 木头",
  "description.tiki.totem.boost": "+0.1 木头",
  "description.tunnel.mole.boost": "+0.25 石头",
  "description.rocky.mole.boost": "+0.25 铁矿",
  "description.nugget.boost": "+0.25 黄金",
  "description.rock.golem.boost": "10 % 几率 +2 石头",
  "description.crimson.carp.boost": "+0.05 红宝石",
  "description.crim.peckster.boost": "+0.1 红宝石",
  "description.queen.bee.boost": "双倍蜂蜜生产速度",
  "description.humming.bird.boost": "20 % 几率 +1 花卉",
  "description.beehive.boost": "当蜂箱已满时，有 10 % 几率获得 +0.2 庄稼",
  "description.walrus.boost": "+1 鱼",
  "description.alba.boost": "50 % 几率获得 +1 基础鱼",
  "description.knowledge.crab.boost": "双倍 Sprout Mix 增强效果",
  "description.maneki.neko.boost": "每天 1 份免费食物(点击领取)",
  "description.genie.lamp.boost": "实现 3 个愿望",
  "description.observatory.boost": "+5 % XP",
  "description.blossombeard.boost": "+10 % XP",
  "description.christmas.festive.tree.boost": "圣诞节期间免费礼物",
  "description.grinxs.hammer.boost": "拓张成本减半",
  "description.time.warp.totem.boost":
    "庄稼生长、基矿、烹饪和树木冷却时间减少 50 %(请在开始计时/收获资源前放置)",
  "description.radiant.ray.boost": "+0.1 铁矿",
  "description.beekeeper.hat.boost": "+20 % 蜂蜜生产速度",
  "description.flower.fox.boost": "-10 % 花朵 生长时间",
  "description.babyPanda.boost": "新玩家在 2024 年 3 月期间 2 倍 XP",

  // Translate
  "description.hungryHare.boost": "发酵胡萝卜 XP 翻倍",
  "description.battle.fish.boost": "+0.05 石油",
  "description.knight.chicken.boost": "+0.1 石油",
  "description.turbo.sprout.boost": "-50 % 温室庄稼生长时间",
  "description.soybliss.boost": "+1 大豆",
  "description.grape.granny.boost": "+1 葡萄",
  "description.non.la.hat.boost": "+1 稻米",
  "description.oil.can.boost": "+2 石油",
  "description.olive.shield.boost": "+1 橄榄",
  "description.pan.boost": "+25 % XP",
  "description.paw.shield.boost": "+25 % 派系宠物饱食度",
  "description.vinny.boost": "+0.25 葡萄",
  "description.desertgnome.boost": "+10 % 烹饪速度",
  "description.rice.panda.boost": "+0.25 稻米",
  "description.olive.shirt.boost": "+0.25 橄榄",
  "description.tofu.mask.boost": "+0.1 大豆",

  "description.gourmet.hourglass.boost":
    ENGLISH_TERMS["description.gourmet.hourglass.boost"],
  "description.harvest.hourglass.boost":
    ENGLISH_TERMS["description.harvest.hourglass.boost"],
  "description.timber.hourglass.boost":
    ENGLISH_TERMS["description.timber.hourglass.boost"],
  "description.ore.hourglass.boost":
    ENGLISH_TERMS["description.ore.hourglass.boost"],
  "description.orchard.hourglass.boost":
    ENGLISH_TERMS["description.orchard.hourglass.boost"],
  "description.fishers.hourglass.boost":
    ENGLISH_TERMS["description.fishers.hourglass.boost"],
  "description.blossom.hourglass.boost":
    ENGLISH_TERMS["description.blossom.hourglass.boost"],
  "description.hourglass.expired":
    ENGLISH_TERMS["description.hourglass.expired"],
  "description.hourglass.running":
    ENGLISH_TERMS["description.hourglass.running"],
};

const bountyDescription: Record<BountyDescription, string> = {
  "description.clam.shell": "蛤壳。一块蛤壳。",
  "description.sea.cucumber": "海参。一根海参。",
  "description.coral": "珊瑚。一块珊瑚，很漂亮",
  "description.crab": "螃蟹。小心它的爪子！",
  "description.starfish": "海星。海中之星。",
  "description.pirate.bounty": "海盗赏金。给海盗的赏金，值很多钱。",
  "description.wooden.compass":
    "木指南针。它可能不是高科技，但它总会引导你走向正确的方向，你信不？",
  "description.iron.compass":
    "铁指南针。开辟你的宝藏之路！这个指南针很有吸引力，而且不仅仅是对磁极！",
  "description.emerald.compass":
    "玉指南针。引导你探索生命的繁茂奥秘！这个指南针不仅指向北方，还指向富贵伟业！",
  "description.old.bottle": "老旧漂流瓶。古董海盗瓶，印照着公海冒险传说。",
  "description.pearl": "珍珠。阳光之下闪闪发光。",
  "description.pipi": "三角斧蛤。发现于太平洋。",
  "description.seaweed": "海藻。",
};

const buildingDescriptions: Record<BuildingDescriptions, string> = {
  // Buildings
  "description.water.well": "水井。庄稼需要水！",
  "description.kitchen": "厨房。升级您的烹饪游戏",
  "description.compost.bin": "箱式堆肥器。定期生产鱼饵和肥料",
  "description.hen.house": "鸡窝。发展您的养鸡帝国。",
  "description.bakery": "面包房。烤你最喜欢的蛋糕",
  "description.turbo.composter": "涡轮堆肥器。定期生产高级鱼饵和肥料",
  "description.deli": "熟食店。这些熟食满足你的口腹之欲！",
  "description.smoothie.shack": "沙冰屋。鲜榨！",
  "description.warehouse": "仓库。种子库存增加 20 %",
  "description.toolshed": "工具棚。Workbench 工具库存增加 50 %",
  "description.premium.composter": "旗舰堆肥器。定期生产专业鱼饵和肥料",
  "description.town.center": "镇中心。聚集到 Town Center 获取最新消息",
  "description.market": "市场。在农贸市场购买和出售",
  "description.fire.pit": "火堆。烤你的向日葵，喂食并升级你的乡包佬",
  "description.workbench": "工作台。锻造收集资源的工具",
  "description.tent": "帐篷。（已绝版）",
  "description.house": "房屋。一个让你休息的地方",
  "description.greenhouse": "温室。娇弱庄稼的庇护所（消耗石油运转）",
  "description.crop.machine": "基础庄稼生产自动化（消耗石油运转）",
  "building.oil.remaining": "{{oil}} 石油储罐余量",
  "cooking.building.oil.description":
    "为 {{buildingName}} 添加石油可令烹饪速度提升 {{boost}} %。",
  "cooking.building.oil.boost": "石油提速",
  "cooking.building.runtime": "运行时间 {{time}}",
};

const bumpkinDelivery: Record<BumpkinDelivery, string> = {
  "bumpkin.delivery.selectFlower": "选择一朵花",
  "bumpkin.delivery.noFlowers": "哦不，你没有任何鲜花可以赠送！",
  "bumpkin.delivery.thanks": "天哪，谢谢你乡包佬！！！",
  "bumpkin.delivery.waiting":
    "我一直就是在等这个。非常感谢！请尽快回来获取更多送货订单。",
  "bumpkin.delivery.proveYourself":
    "证明你的价值。再扩展你的岛屿 {{missingExpansions}} 次。",
};

const bumpkinItemBuff: Record<BumpkinItemBuff, string> = {
  "bumpkinItemBuff.chef.apron.boost": "+20 % SFL 蛋糕利润",
  "bumpkinItemBuff.fruit.picker.apron.boost": "+0.1 水果",
  "bumpkinItemBuff.angel.wings.boost": "30 % 几率马上获得庄稼",
  "bumpkinItemBuff.devil.wings.boost": "30 % 几率马上获得庄稼",
  "bumpkinItemBuff.eggplant.onesie.boost": "+0.1 茄子",
  "bumpkinItemBuff.golden.spatula.boost": "+10 % XP",
  "bumpkinItemBuff.mushroom.hat.boost": "+0.1 蘑菇",
  "bumpkinItemBuff.parsnip.boost": "+20 % 防风草",
  "bumpkinItemBuff.sunflower.amulet.boost": "+10 % 向日葵",
  "bumpkinItemBuff.carrot.amulet.boost": "-20 % 胡萝卜生长时间",
  "bumpkinItemBuff.beetroot.amulet.boost": "+20 % 甜菜根",
  "bumpkinItemBuff.green.amulet.boost": "10 % 几率获得 10 倍庄稼",
  "bumpkinItemBuff.Luna.s.hat.boost": "-50 % 烹饪时间",
  "bumpkinItemBuff.infernal.pitchfork.boost": "+3 庄稼",
  "bumpkinItemBuff.cattlegrim.boost": "+0.25 牲畜产出",
  "bumpkinItemBuff.corn.onesie.boost": "+0.1 玉米",
  "bumpkinItemBuff.sunflower.rod.boost": "10 % 几率获得 +1 条鱼",
  "bumpkinItemBuff.trident.boost": "20 % 几率获得 +1 条鱼",
  "bumpkinItemBuff.bucket.o.worms.boost": "+1 饵虫",
  "bumpkinItemBuff.luminous.anglerfish.topper.boost": "+50 % 鱼 XP",
  "bumpkinItemBuff.angler.waders.boost": "+10 钓鱼上限",
  "bumpkinItemBuff.ancient.rod.boost": "钓鱼无需鱼竿",
  "bumpkinItemBuff.banana.amulet.boost": "+0.5 香蕉",
  "bumpkinItemBuff.banana.boost": "-20 % 香蕉生长时间",
  "bumpkinItemBuff.deep.sea.helm": "3 倍 Marine Marvel 几率",
  "bumpkinItemBuff.bee.suit": "+0.1 蜂蜜",
  "bumpkinItemBuff.crimstone.hammer": "第 5 次开采 +2 红宝石",
  "bumpkinItemBuff.crimstone.amulet": "-20% 红宝石冷却时间",
  "bumpkinItemBuff.crimstone.armor": "+0.1 红宝石",
  "bumpkinItemBuff.hornet.mask": "2 倍蜂群几率",
  "bumpkinItemBuff.honeycomb.shield": "+1 蜂蜜",
  "bumpkinItemBuff.flower.crown": "-50 % 花卉生长时间",
  "bumpkinItemBuff.goblin.armor": ENGLISH_TERMS["bumpkinItemBuff.goblin.armor"],
  "bumpkinItemBuff.goblin.helmet":
    ENGLISH_TERMS["bumpkinItemBuff.goblin.helmet"],
  "bumpkinItemBuff.goblin.axe": ENGLISH_TERMS["bumpkinItemBuff.goblin.axe"],
  "bumpkinItemBuff.goblin.pants": ENGLISH_TERMS["bumpkinItemBuff.goblin.pants"],
  "bumpkinItemBuff.goblin.sabatons":
    ENGLISH_TERMS["bumpkinItemBuff.goblin.sabatons"],
  "bumpkinItemBuff.nightshade.armor":
    ENGLISH_TERMS["bumpkinItemBuff.nightshade.armor"],
  "bumpkinItemBuff.nightshade.helmet":
    ENGLISH_TERMS["bumpkinItemBuff.nightshade.helmet"],
  "bumpkinItemBuff.nightshade.sword":
    ENGLISH_TERMS["bumpkinItemBuff.nightshade.sword"],
  "bumpkinItemBuff.nightshade.pants":
    ENGLISH_TERMS["bumpkinItemBuff.nightshade.pants"],
  "bumpkinItemBuff.nightshade.sabatons":
    ENGLISH_TERMS["bumpkinItemBuff.nightshade.sabatons"],
  "bumpkinItemBuff.sunflorian.armor":
    ENGLISH_TERMS["bumpkinItemBuff.sunflorian.armor"],
  "bumpkinItemBuff.sunflorian.helmet":
    ENGLISH_TERMS["bumpkinItemBuff.sunflorian.helmet"],
  "bumpkinItemBuff.sunflorian.sword":
    ENGLISH_TERMS["bumpkinItemBuff.sunflorian.sword"],
  "bumpkinItemBuff.sunflorian.pants":
    ENGLISH_TERMS["bumpkinItemBuff.sunflorian.pants"],
  "bumpkinItemBuff.sunflorian.sabatons":
    ENGLISH_TERMS["bumpkinItemBuff.sunflorian.sabatons"],
  "bumpkinItemBuff.bumpkin.armor":
    ENGLISH_TERMS["bumpkinItemBuff.bumpkin.armor"],
  "bumpkinItemBuff.bumpkin.helmet":
    ENGLISH_TERMS["bumpkinItemBuff.bumpkin.helmet"],
  "bumpkinItemBuff.bumpkin.sword":
    ENGLISH_TERMS["bumpkinItemBuff.bumpkin.sword"],
  "bumpkinItemBuff.bumpkin.pants":
    ENGLISH_TERMS["bumpkinItemBuff.bumpkin.pants"],
  "bumpkinItemBuff.bumpkin.sabatons":
    ENGLISH_TERMS["bumpkinItemBuff.bumpkin.sabatons"],
};

const bumpkinPartRequirements: Record<BumpkinPartRequirements, string> = {
  "equip.missingHair": "需要装佩头发",
  "equip.missingBody": "需要装佩躯干",
  "equip.missingShoes": "需要装佩鞋子",
  "equip.missingShirt": "需要装佩衬衣",
  "equip.missingPants": "需要装佩裤子",
  "equip.missingBackground": "需要装佩背景",
};

const bumpkinSkillsDescription: Record<BumpkinSkillsDescription, string> = {
  // Crops
  "description.green.thumb": "庄稼产量增加 5 %",
  "description.cultivator": "庄稼生长速度加快 5 %",
  "description.master.farmer": "庄稼产量增加 10 %",
  "description.golden.flowers": "向日葵有几率掉落黄金",
  "description.happy.crop": "有几率收获 2 倍庄稼",
  // Trees
  "description.lumberjack": "木头产量增加 10 %",
  "description.tree.hugger": "木头生长速度加快 20 %",
  "description.tough.tree": "有几率掉落 3 倍木头",
  "description.money.tree": "砍伐树木有几率掉落硬币",
  // Rocks
  "description.digger": "石头产量增加 10 %",
  "description.coal.face": "石脉恢复速度加快 20 %",
  "description.seeker": "攻击石怪",
  "description.gold.rush": "开采金脉有几率获得 2.5 倍产量",
  // Cooking
  "description.rush.hour": "烹饪速度加快 10 %",
  "description.kitchen.hand": "饭菜 XP 增加 5 %",
  "description.michelin.stars": "精致食物，SFL 利润增加 5 %",
  "description.curer": "Deli 餐品 XP 增加 15 %",
  // Animals
  "description.stable.hand": "牲畜生产加快 10 %",
  "description.free.range": "牲畜产出增加 10 %",
  "description.horse.whisperer": "增加变种几率",
  "description.buckaroo": "有几率获得 2 倍牲畜产出",
};

const bumpkinTrade: Record<BumpkinTrade, string> = {
  "bumpkinTrade.minLevel": "您必须到 10 级才能挂单 P2P 交易",
  "bumpkinTrade.noTradeListed": "您还未挂单交易",
  "bumpkinTrade.sell": "卖您的资源给其他玩家换 SFL",
  "bumpkinTrade.like.list": "您想上架什么呢",
  "bumpkinTrade.purchase": "请于 Goblin Retreat 购买",

  "bumpkinTrade.available": "可售",
  "bumpkinTrade.quantity": "数量",
  "bumpkinTrade.price": "价格",
  "bumpkinTrade.listingPrice": "挂牌价格",
  "bumpkinTrade.pricePerUnit": " {{resource}} 平均单价",
  "bumpkinTrade.tradingFee": "交易费",
  "bumpkinTrade.youWillReceive": "您将收到",
  "bumpkinTrade.cancel": "取消",
  "bumpkinTrade.list": "上架",
  "bumpkinTrade.maxListings": "已达到最大上架单数",
  "bumpkinTrade.max": "最大: {{max}}",
  "bumpkinTrade.floorPrice": "底价：{{price}} SFL",
  "bumpkinTrade.price/unit": "{{price}} / 单位",
  "bumpkinTrade.min": "您需到 10 级以参与 P2P 交易。",
  "bumpkinTrade.minimumFloor": "最低单价： {{min}}",
  "bumpkinTrade.maximumFloor": "最高单价： {{max}}",
  "bumpkinTrade.sellConfirmation":
    "确认卖出 {{quantity}} {{resource}} 以赚 {{price}} SFL？",
  "bumpkinTrade.cant.sell.all": ENGLISH_TERMS["bumpkinTrade.cant.sell.all"],
};

const buyFarmHand: Record<BuyFarmHand, string> = {
  "buyFarmHand.howdyBumpkin": "好喂，乡包佬。",
  "buyFarmHand.confirmBuyAdditional": "您确定是想买额外乡包佬吗？",
  "buyFarmHand.farmhandCoupon": "1 张 Farmhand 票券",
  "buyFarmHand.adoptBumpkin": "领养 1 位乡包佬",
  "buyFarmHand.additionalBumpkinsInfo":
    "额外乡包佬可以用来装佩饰品来增益您的农场。",
  "buyFarmHand.notEnoughSpace": "空间不足——升阶您的岛屿",
  "buyFarmHand.buyBumpkin": "购买乡包佬",
  "buyFarmHand.newFarmhandGreeting": "我是您的新雇农。我已经等不及要开干了！",
};

const changeLanguage: Record<ChangeLanguage, string> = {
  "changeLanguage.confirm": "此操作将刷新您的浏览器。您确定要更改语言吗？",
  "changeLanguage.contribute": ENGLISH_TERMS["changeLanguage.contribute"],
  "changeLanguage.contribute.message":
    ENGLISH_TERMS["changeLanguage.contribute.message"],
};

const chat: Record<Chat, string> = {
  "chat.Fail": "连接失败",
  "chat.mute": "您已被禁言",
  "chat.again": "您再次发言的恢复时限：",
  "chat.Kicked": "您已被踢出",
};

const chickenWinner: Record<ChickenWinner, string> = {
  "chicken.winner.playagain": "点此处再次游玩",
};

const choresStart: Record<ChoresStart, string> = {
  "chores.harvestFields": "田园丰收",
  "chores.harvestFieldsIntro": "这些田可不会自己给自己耕了。收获 3 把向日葵。",
  "chores.earnSflIntro":
    "你要是想把耕田事业做大发家，你最好从卖向日葵、买种子和反复赚钱做起。",
  "chores.reachLevel": "到达 2 级",
  "chores.reachLevelIntro": "你要是想升级并解锁新技能，你最好开始做饭吃了。",
  "chores.chopTrees": "砍倒 3 颗树",
  "chores.helpWithTrees":
    "我这身老骨头已强健不再了，想来你可以搭把手把这些该砍的死鬼树砍了？我们这块的 Blacksmith 会帮你锻造好些工具的。",
  "chores.noChore": "抱歉，我暂时没有什么日常农活需要您做的。",
  "chores.newSeason": "新时季就要来临，日常农活暂时停单。",
  "chores.choresFrozen":
    "新时季日常农活即将发单。先前时季的日常农活与进度会被重置。",
  "chores.left": ENGLISH_TERMS["chores.left"],
};

const chumDetails: Record<ChumDetails, string> = {
  "chumDetails.gold": "闪闪金光照耀千里",
  "chumDetails.iron": "星星火花，黄昏间四方闪烁",
  "chumDetails.stone": "没准丢点石头也能勾来些鱼",
  "chumDetails.egg": "唔，也不知什么鱼会喜欢鸡蛋……",
  "chumDetails.sunflower": "硕实如阳光，勾起鱼儿好奇",
  "chumDetails.potato": "土豆在鱼儿餐牌上可不常见",
  "chumDetails.pumpkin": "南瓜的橙黄荧光也许会吸引鱼儿",
  "chumDetails.carrot": "最好搭配蚯蚓来抓鳀鱼！",
  "chumDetails.cabbage": "海生草食动物的鲜叶诱惑",
  "chumDetails.beetroot": "甜菜，大胆鱼儿的水底欢悦",
  "chumDetails.cauliflower": "鱼儿们或许会惊奇发现这花儿甚是诱人",
  "chumDetails.parsnip": "为好奇鱼儿准备带土带根接地气的饵诱",
  "chumDetails.eggplant": "茄子：鱼儿勇者的海洋历险",
  "chumDetails.corn": "玉米棒子——奇特诱人的零食",
  "chumDetails.radish": "小萝卜海洋生物的深埋宝藏",
  "chumDetails.wheat": "小麦海下食客的谷物欢愉",
  "chumDetails.kale": "好奇鱼儿的绿叶惊喜",
  "chumDetails.blueberry": "时常被蓝色鱼儿们误认为求偶对象",
  "chumDetails.orange": "香橙，海洋生物的柑橘奇物",
  "chumDetails.apple": "苹果——浪涛之下的香脆谜团",
  "chumDetails.banana": "轻浮水面！",
  "chumDetails.seaweed": "海底叶片零食尽显海洋本味",
  "chumDetails.crab": "海底鱼儿的逗人零嘴",
  "chumDetails.anchovy": "鳀鱼，在海内狂徒面前总是神奇地诱人",
  "chumDetails.redSnapper": "海洋深处潜藏的奥秘",
  "chumDetails.tuna": "得长多大才吃得下一条金枪鱼？",
  "chumDetails.squid": "用鳐鱼最爱的零食唤醒它！",
  "chumDetails.wood": "木头。这选择真有趣……",
  "chumDetails.redPansy": "躲藏鱼儿的火辣诱惑",
  "chumDetails.fatChicken": "原汁原味的白肉再庞大的猎物也欲罢不能",
  "chumDetails.speedChicken": "利齿猎人的快餐甜点",
  "chumDetails.richChicken": "白肚银幕恐怖巨星的精美佳肴",
  "chumDetails.horseMackerel": ENGLISH_TERMS["chumDetails.horseMackerel"],
  "chumDetails.sunfish": ENGLISH_TERMS["chumDetails.sunfish"],
};

const claimAchievement: Record<ClaimAchievement, string> = {
  "claimAchievement.alreadyHave": "您已获取本成就",
  "claimAchievement.requirementsNotMet": "您尚未达到要求",
};

const community: Record<Community, string> = {
  "community.toast": "祝贺词为空",
  "community.url": "请输入您的 Repo URL",
  "comunity.Travel": "旅行至社区构筑的岛屿",
};

const compostDescription: Record<CompostDescription, string> = {
  "compost.fruitfulBlend": "Fruitful Blend 为树坑上生长的每棵果树 +0.1 产出",
  "compost.sproutMix": "Sprout Mix 为田坑上种的庄稼 +0.2 产出",
  "compost.sproutMixBoosted": "Sprout Mix 为田坑上种的庄稼 +0.4 产出",
  "compost.rapidRoot": "Rapid Root 为田坑上种的庄稼 -50 % 生长时间",
};

const composterDescription: Record<ComposterDescription, string> = {
  "composter.compostBin": "Compost Bin 详情…….",
  "composter.turboComposter": "Turbo Composter 详情…….",
  "composter.premiumComposter": "Premium Composter 详情…….",
};

const confirmationTerms: Record<ConfirmationTerms, string> = {
  "confirmation.sellCrops":
    "您确定要卖掉 {{cropAmount}} {{cropName}} 以换取 {{coinAmount}} 枚硬币吗？",
  "confirmation.buyCrops":
    "您确定要花 {{coinAmount}} 枚硬币购买 {{seedNo}} {{seedName}}s 吗？",
};

const confirmSkill: Record<ConfirmSkill, string> = {
  "confirm.skillClaim": "您确定要领取该技能吗？",
};

const conversations: Record<Conversations, string> = {
  "home-intro.one": ENGLISH_TERMS["home-intro.one"],
  "home-intro.three": ENGLISH_TERMS["home-intro.three"],
  "home-intro.two": ENGLISH_TERMS["home-intro.two"],
  "firepit-intro.one": ENGLISH_TERMS["firepit-intro.one"],
  "firepit-intro.two": ENGLISH_TERMS["firepit-intro.two"],
  "firepit.increasedXP": ENGLISH_TERMS["firepit.increasedXP"],
  "hank-intro.headline": "帮帮老人家？",
  "hank-intro.one": "好喂，乡包佬！欢迎来到我们这小块桃园天堂。",
  "hank-intro.two": "我在这儿耕地已有 50 余年了，但帮手当然也不嫌少。",
  "hank-intro.three": "我能教教你耕作基础，只要你肯帮我干点日常农活就好啦。",
  "hank.crafting.scarecrow": "锻造 Scarecrow",
  "hank-crafting.one": "唔，这些庄稼长得好鬼慢啊。我可没时间傻等着。",
  "hank-crafting.two": "锻造个 Scarecrow 来助长庄稼吧。",
  "betty-intro.headline": "农场成长秘诀",
  "betty-intro.one": "嘿，嘿！欢迎来到我的市场。",
  "betty-intro.two": "带上你最好的收成给我，我也好给你出个好价钱！",
  "betty-intro.three": "你需要种子吗？从土豆到防风草，应有尽有！",
  "betty.market-intro.one":
    "嘿这边，乡包佬！我是农夫市场的 Betty。我周游列岛收购庄稼销售种子。",
  "betty.market-intro.two":
    "好消息：你刚拿上了一把闪闪新铲子！坏消息：我们碰上了一回庄稼荒。",
  "betty.market-intro.three":
    "我会给出一段有限时间，作为新来客的你，收成庄稼卖价可以双倍。",
  "betty.market-intro.four": "收割那些向日葵，让咱们打下你农业帝国的基业吧。",
  "bruce-intro.headline": "烹饪介绍",
  "bruce-intro.one": "我是这家可爱小酒馆的老板。",
  "bruce-intro.two": "带食材给我，我就能做你能吃的所有食物！",
  "bruce-intro.three": "好喂农民！我远在一里外就能嗅到饿肚子的乡包佬。",
  "blacksmith-intro.headline": "砍、砍、砍。",
  "blacksmith-intro.one":
    "我是工具大师，只要有合适的素材，你要什么我都能给你造……包括再来更多工具！",
  "pete.first-expansion.one":
    "恭喜，乡包佬！你的农场成长得可比暴风雨里的豆芽还要快！",
  "pete.first-expansion.two":
    "每次拓张完成，你都会找到酷酷的东西，特殊资源、新树之余还有更多供你收集！",
  "pete.first-expansion.three":
    "探索之余还别忘了留意哥布林们慷慨的惊喜礼物——他们可不只是建筑专家，还是低调隐秘的慈善家！",
  "pete.first-expansion.four": "恭喜，乡包佬！继续加油吧。",
  "pete.craftScarecrow.one": "唔，这些庄稼长得有点慢。",
  "pete.craftScarecrow.two":
    "Sunflower Land 到处都有魔法物品供你铸造，好增进你的农活技艺。 ",
  "pete.craftScarecrow.three":
    "跑去 Work Bench 并锻造一个 Scarecrow 好助长那些向日葵吧。",
  "pete.levelthree.one": "恭喜，你那绿指头是真的闪亮！",
  "pete.levelthree.two":
    "我们是时候跑去 Plaza 了，在那里你的农艺天赋可以甚至更上一层、更加闪耀！",
  "pete.levelthree.three":
    "在 Plaza 你可以带你的资源去送货换奖励、锻造魔法物品和与其他玩家做买卖。",
  "pete.levelthree.four": "点击左下角的地球图标，你就可以开始旅行啦。",
  "pete.help.zero": "光顾 Fire Pit、烹饪食物并食用以升级。",
  "pete.pumpkinPlaza.one":
    "当你升级时，你将解锁新的领域以供探索。首先是南瓜广场……我的家！",
  "pete.pumpkinPlaza.two":
    "在这里，你可以完成送货收获奖励、锻造魔法物品以及与其他玩家做买卖。",
  "sunflowerLand.islandDescription":
    "Sunflower Land 随处都是激动人心的列岛，供你完成送货、锻造稀有 NFT 甚至挖掘财宝！",
  "sunflowerLand.opportunitiesDescription":
    "你辛苦挣得的资源可以花费在各种地点获得各种机会。",
  "sunflowerLand.returnHomeInstruction": "你随时都可以点击旅行按钮回家。",
  "grimbly.expansion.one":
    "你好，新晋农民！我是 Grimbly，一位老练的哥布林建筑家。",
  "grimbly.expansion.two":
    "凭借合适的材料和我古老的工艺技巧，我们可以将你的岛屿变成一件杰作。",
  "luna.portalNoAccess": "唔，这传送门就凭空出现了。这是怎么回事呢？",
  "luna.portals": "传送门",
  "luna.rewards": "奖赏",
  "luna.travel": "旅行到这些由玩家建造的传送门里并赚取奖赏吧。",
  "pete.intro.one":
    "好喂，这边，乡包佬！欢迎来到 Sunflower Land，一个富饶的农业天堂，这里一切皆有可能！",
  "pete.intro.two":
    "你建立的岛屿多么美丽啊！ 我是 Pumpkin Pete，你的农民邻居。",
  "pete.intro.three":
    "乡包佬们现在正在广场上庆祝节日，有丰厚的奖励和神奇的物品。",
  "pete.intro.four":
    "在加入乐趣之前，你需要发展你的农场并收集一些资源。 你可不想两手空空！",
  "pete.intro.five": "首先，你需要砍倒这些树木并拓张你的岛屿。",
  "mayor.plaza.changeNamePrompt":
    "您想要改名字吗？很可惜，我现在不能帮您登记，我的文书工作已经有够多了。",
  "mayor.plaza.intro": "好喂，乡包佬同志，看起来我们还没自我介绍呢。",
  "mayor.plaza.role":
    "我是这镇子的镇长！我负责照顾所有人安居乐业。我同样也负责让每个人有名可稽！",
  "mayor.plaza.fixNamePrompt":
    "您还没登记名字吗？好吧，我来帮您解决！您希望我帮您准备文书不？",
  "mayor.plaza.enterUsernamePrompt": "请输入您的名字：",
  "mayor.plaza.usernameValidation": "请注意名字需要遵守我们的",
  "mayor.plaza.niceToMeetYou": "幸会，！",
  "mayor.plaza.congratulations": "恭喜，您的文书已经登记完毕。回头见！",
  "mayor.plaza.enjoyYourStay":
    "我祝您在 Sunflower Land 玩得开心！如果您还再有需要，回来找我就好了！",
  "mayor.codeOfConduct": "行为准则",
  "mayor.failureToComply": "违反良俗会招致惩罚，可能包括账号封禁",
  "mayor.paperworkComplete": "您的文书现已登记完毕。回头见",
  "hank.choresFrozen":
    "好哇伙计，看来今天咱们都忙完啦。歇息一阵子，今天就好好享受吧！",
};

const cropBoomMessages: Record<CropBoomMessages, string> = {
  "crop.boom.welcome": "欢迎来到 Crop Boom",
  "crop.boom.reachOtherSide": "跑到这危险庄稼田的另一头去领取 Arcade Token 吧",
  "crop.boom.bewareExplodingCrops":
    "小心庄稼雷爆炸。如果你踩上了，你就得从头开始了",
  "crop.boom.newPuzzleDaily": "新谜题每天都会出现",
  "crop.boom.back.puzzle": "晚点回来再看看全新谜题吧！",
};

const cropFruitDescriptions: Record<CropFruitDescriptions, string> = {
  // Crops
  "description.sunflower": "向日葵。一朵阳光明媚的花",
  "description.potato": "土豆。比你想象的更健康。",
  "description.pumpkin": "南瓜。南瓜不止于馅饼。",
  "description.carrot": "胡萝卜。对你的眼睛有益！",
  "description.cabbage": "卷心菜。曾经的奢侈品，现在的大众食物。",
  "description.soybean": "用途广泛的豆科植物！",
  "description.beetroot": "甜菜根。有益宿醉！",
  "description.cauliflower": "花椰菜。优秀的大米代餐！",
  "description.parsnip": "防风草。可别错认为是胡萝卜。",
  "description.eggplant": "茄子。大自然的食用杰作。",
  "description.corn": "玉米。受阳光亲吻的怡人果粒，大自然的夏日瑰宝。",
  "description.radish": "小萝卜。颇为耗时但值得等待！",
  "description.wheat": "小麦。世上产量最多的庄稼。",
  "description.kale": "羽衣甘蓝。乡包佬能量食品！",

  // Fruits
  "description.blueberry": "蓝莓。哥布林的弱点。",
  "description.orange": "香橙。维生素 C 让你的乡包佬保持健康。",
  "description.apple": "苹果。非常适合自制苹果派。",
  "description.banana": "香蕉。哦香蕉！",

  // Exotic Crops
  "description.white.carrot": "白胡萝卜。一根浅色的胡萝卜，有浅色的根",
  "description.warty.goblin.pumpkin":
    "疣粒哥布林南瓜。一个异想天开、长满疣的南瓜",
  "description.adirondack.potato":
    "阿迪朗达克土豆。坚固的马铃薯，阿迪朗达克风格！",
  "description.purple.cauliflower": "紫色花椰菜。高贵的紫色花椰菜",
  "description.chiogga": "意大利甜菜根。彩虹甜菜！",
  "description.golden.helios": "金叵罗。阳光亲吻的宏伟！",
  "description.black.magic": "黑魔花。一朵黑暗而神秘的花！",

  //Flower Seed
  "description.sunpetal.seed": "日光瓣种子。一粒 Sunpetal 种子",
  "description.bloom.seed": "绽放种子。一粒 Bloom 种子",
  "description.lily.seed": "百合种子。一粒 Lily 种子",

  // Greenhouse Seeds
  "description.grape": "一种甜美神往的水果",
  "description.olive": "高端农夫的奢品",
  "description.rice": "完美口粮！",
};

const cropMachine: Record<CropMachine, string> = {
  "cropMachine.addOil": "添加石油",
  "cropMachine.addSeedPack": "添加种子袋",
  "cropMachine.addSeeds": "添加 {{seedType}}",
  "cropMachine.availableInventory": "库存有 {{amount}}",
  "cropMachine.boosted": "已享增益",
  "cropMachine.growTime": "生长时长： {{time}}",
  "cropMachine.growTimeRemaining": "生长剩余时长: {{time}}",
  "cropMachine.harvest": "收割",
  "cropMachine.harvestCropPack": "收割所有庄稼",
  "cropMachine.machineRuntime": "机器运作时长： {{time}}",
  "cropMachine.maxRuntime": "最高运作时长: {{time}}",
  "cropMachine.moreOilRequired": "需要更多的石油",
  "cropMachine.notStartedYet": "尚未启动",
  "cropMachine.oil.description":
    "您的机器需要石油运作。每袋种子依据其生长时长会需要一定数量的石油。添加石油后机器会显示对应石油可支持运作的时长。",
  "cropMachine.oilTank": "油箱",
  "cropMachine.oilToAdd": "石油添量： {{amount}}",
  "cropMachine.paused": "已暂停",
  "cropMachine.pickSeed": "选择种子",
  "cropMachine.readyCropPacks": "准备庄稼袋",
  "cropMachine.readyCropPacks.description":
    "您目前有 {{totalReady}} 袋庄稼可供收割！点击收割按钮来收割所有庄稼。",
  "cropMachine.readyToHarvest": "可供收割",
  "cropMachine.seedPacks": "种子袋",
  "cropMachine.seeds": "种子： {{amount}}",
  "cropMachine.totalCrops": "{{cropName}} 总产出： {{total}}",
  "cropMachine.totalRuntime": "总运行时长： {{time}}",
  "cropMachine.totalSeeds": "总播下种子： {{total}}",
  "cropMachine.running": ENGLISH_TERMS["cropMachine.running"],
  "cropMachine.stopped": ENGLISH_TERMS["cropMachine.stopped"],
  "cropMachine.idle": ENGLISH_TERMS["cropMachine.idle"],
  "cropMachine.name": ENGLISH_TERMS["cropMachine.name"],
};

const decorationDescriptions: Record<DecorationDescriptions, string> = {
  // Decorations
  "description.wicker.man": "牵牵手、转转圈，柳條怪影长上天",
  "description.golden bonsai": "哥布林也会爱盆栽",
  "description.christmas.bear": "圣诞老人的最爱",
  "description.war.skull": "用敌人的骨颅装点您的地盘",
  "description.war.tombstone": "愿您安息",
  "description.white.tulips": "远离哥布林的嗅味",
  "description.potted.sunflower": "为你的岛上增添阳光",
  "description.potted.potato": "土豆血在你的乡包佬体内流淌。",
  "description.potted.pumpkin": "南瓜属于乡包佬",
  "description.cactus": "节约用水并让您的农场美丽惊人！",
  "description.basic.bear":
    "这是一只普通的熊。用它在哥布林退留地制作一只熊吧！",
  "description.bonnies.tombstone":
    "在任何农场都显诡怪的添饰，Bonnie 的人类墓碑叫人寒凉刺骨",
  "description.grubnashs.tombstone": "让 Grubnash 的哥布林墓碑带来些许诡魅",
  "description.town.sign": "骄傲地炫耀您的农场号码吧！",
  "description.dirt.path": "千足踏过的小径总不脏鞋",
  "description.bush": "草丛里都躲着什么？",
  "description.fence": "给你的农场来点乡村魅力",
  "description.stone.fence": "拥抱石栏的永恒优雅",
  "description.pine.tree": "高岸雄伟，一趟层层针叶梦",
  "description.shrub": "一簇美妙灌木倍增您的游乐景象",
  "description.field.maple": "娇枝嫩叶展开翠绿天蓬",
  "description.red.maple": "火热红叶有一颗秋日暖心",
  "description.golden.maple": "金光枫叶四绽光芒",
  "description.crimson.cap": "一朵高耸壮硕的蘑菇，赤红大伞菇让你的农场生机勃勃",
  "description.toadstool.seat": "坐稳放松，伞菌可是奇异佳座",
  "description.chestnut.fungi.stool":
    "栗子菇凳在任何农场都是如此牢靠又增乡村风味",
  "description.mahogany.cap": "凭桃花心木大伞菇添一番不寻常的风味",
  "description.candles": "在女巫之夜借跳跃的火焰为您的农场附上魔力",
  "description.haunted.stump": "召来通灵让你的农场萦绕鬼魅",
  "description.spooky.tree": "增添农场上的闹鬼奇趣！",
  "description.observer": "永不停转的眼珠，永存戒心、永不松眼！",
  "description.crow.rock": "乌鸦栖息的神秘石块",
  "description.mini.corn.maze": "2023 年女巫之夜时季广受喜爱迷宫的纪念品",
  "description.lifeguard.ring": "漂浮你的风尚，你的海岸救星！",
  "description.surfboard": "驾驭你的惊涛骇浪，愿沙滩祝福你的浪板！",
  "description.hideaway.herman": "Herman 在这躲着，但总是瞄着等派对！",
  "description.shifty.sheldon": "狡猾的 Sheldon，总是匆忙凿着下一个沙岸惊喜！",
  "description.tiki.torch": "照亮黑夜，热带风味点燃一切！",
  "description.beach.umbrella": "遮阳、歇息，一撑架起海滨风尚！",
  "description.magic.bean": "会长出什么呢？",
  "description.giant.potato": "一个巨大土豆。",
  "description.giant.pumpkin": "一个巨大南瓜。",
  "description.giant.cabbage": "一个巨大卷心菜。",
  "description.chef.bear": "每个厨师都需要个帮手",
  "description.construction.bear": "熊市里就是要建设投入",
  "description.angel.bear": "是时候升华耕地生活了",
  "description.badass.bear": "没人能挡着你的道",
  "description.bear.trap": "是个陷阱！",
  "description.brilliant.bear": "纯然聪耀！",
  "description.classy.bear": "SFL 多到你都不知道怎么花！",
  "description.farmer.bear": "辛勤劳作的一天，无可比拟！",
  "description.rich.bear": "好一个珍贵的财物",
  "description.sunflower.bear": "这庄稼，小熊视如珍宝",
  "description.beta.bear": "特殊测试活动找到的小熊",
  "description.rainbow.artist.bear": "主人可是个美丽小熊艺术家！",
  "description.devil.bear": "知根知底的恶魔总比不知的好",
  "description.collectible.bear": "小熊奖品，全新无损！",
  "description.cyborg.bear": "后会有期，熊儿",
  "description.christmas.snow.globe": "摇一摇，看雪再活生机",
  "description.kraken.tentacle":
    "挖掘深海奥秘！这触手戏说着古老海洋传说与水底奇世的故事",
  "description.kraken.head":
    "挖掘深海奥秘！这大脑戏说着古老海洋传说与水底奇世的故事",
  "description.abandoned.bear": "一只被落在岛上的小熊",
  "description.turtle.bear": "够龟样去参加龟龟俱乐部了",
  "description.trex.skull": "暴龙头骨！棒极了！",
  "description.sunflower.coin": "一颗向日葵做的硬币",
  "description.skeleton.king.staff": "骷髅王万岁！",
  "description.lifeguard.bear": "救生熊来拯救世界了！",
  "description.snorkel.bear": "呼吸管熊热爱游泳",
  "description.parasaur.skull": "一个副栉龙头骨！",
  "description.goblin.bear": "一只哥布林熊。有点吓人",
  "description.golden.bear.head": "诡异，但很酷",
  "description.pirate.bear": "呀啊，伙计！抱我！",
  "description.galleon": "玩具船，但完好无损",
  "description.dinosaur.bone": "恐龙骨头！这真是怎么一种生物？",
  "description.human.bear": "人型熊。甚至比哥布林熊还要吓人",
  "description.flamingo": "爱的标志挺立高岸",
  "description.blossom.tree": "精致的花瓣象征着美丽而脆弱的爱",
  "description.heart.balloons": "用作浪漫场合的装饰吧",
  "description.whale.bear":
    "圆润毛绒的身体恰似小熊，但有着鲸鱼的鱼鳍、鱼尾和气孔",
  "description.valentine.bear": "为愿爱之人",
  "description.easter.bear": "兔子怎么下蛋？",
  "description.easter.bush": "里头是什么？",
  "description.giant.carrot":
    "巨大的胡萝卜直立着，奇趣的影子投下着，注视的兔子惊讶着",
  "description.beach.ball": "弹跳的小球跃动着海滩气息，赶走所有无聊",
  "description.palm.tree": "高大、滩岸、阴凉、别致，棕榈树摇曳着海浪",

  //other
  "description.sunflower.amulet": "增加 10 % 向日葵产出",
  "description.carrot.amulet": "增加 20 % 胡萝卜生长速度",
  "description.beetroot.amulet": "增加 20 % 甜菜根产出",
  "description.green.amulet": "有几率收获 10 倍庄稼产出",
  "description.warrior.shirt": "真正战士的标志",
  "description.warrior.pants": "保驾你的腿部",
  "description.warrior.helmet": "免疫箭矢",
  "description.sunflower.shield": "Sunflower Land 的英雄。免费向日葵种子！",
  "description.skull.hat": "乡包佬的稀有帽子",
  "description.sunflower.statue": "神圣代币的象征",
  "description.potato.statue": "原初土豆狂热者的雕塑",
  "description.christmas.tree": "在圣诞节收取圣诞老人的空投",
  "description.gnome": "一个幸运的侏儒",
  "description.homeless.tent": "一张美好舒适的帐篷",
  "description.sunflower.tombstone": "谨此纪念向日葵农夫们",
  "description.sunflower.rock": "这曾挤爆 Polygon 链的游戏",
  "description.goblin.crown": "召来哥布林的头领",
  "description.fountain": "你农场上的惬意喷泉",
  "description.nyon.statue": "谨此纪念 Nyon Lann",
  "description.farmer.bath": "农夫们的甜菜根香薰浴",
  "description.woody.Beaver": "增加 20 % 木头产出",
  "description.apprentice.beaver": "增加 50 % 木头生长速度",
  "description.foreman.beaver": "无需用斧头砍树木",
  "description.egg.basket": "准许参与复活节彩蛋寻猎",
  "description.mysterious.head": "一个理应保护农夫们的雕像",
  "description.tunnel.mole": "增加 25 % 石头产出",
  "description.rocky.the.mole": "增加 25 % 铁矿产出",
  "description.nugget": "增加 25 % 黄金产出",
  "description.rock.golem": "给予 10 % 概率产出 3 倍石头",
  "description.chef.apron": "给予额外 20 % 蛋糕销售 SFL 利润",
  "description.chef.hat": "传奇面包师的桂冠！",
  "description.nancy": "赶走那些乌鸦。增加 15 % 庄稼生长速度",
  "description.scarecrow": "一个哥布林稻草人。增加 20 % 庄稼产出",
  "description.kuebiko": "连店主都害怕这一稻草人。种子免费",
  "description.golden.cauliflower": "加倍花椰菜产出",
  "description.mysterious.parsnip": "增加 50 % 防风草生长速度",
  "description.carrot.sword": "增加变种庄稼的出现概率",
  "description.chicken.coop": "收获 2 倍数目的鸡蛋",
  "description.farm.cat": "赶走那些老鼠",
  "description.farm.dog": "农场狗狗能牧羊",
  "description.gold.egg": "无需小麦便能喂食鸡群",
  "description.easter.bunny": "增加 20 % 胡萝卜产出",
  "description.rooster": "变种鸡出现的概率翻倍",
  "description.chicken": "产出鸡蛋。需要喂养小麦。",
  "description.cow": "产出牛奶。需要喂养小麦。",
  "description.pig": "产出粪肥。需要喂养小麦。",
  "description.sheep": "产出羊毛。需要喂养小麦。",
  "description.basic.land": "一片基础岛地",
  "description.crop.plot": "一块空田以种庄稼",
  "description.gold.rock": "一片矿脉以收集黄金",
  "description.iron.rock": "一片矿脉以收集铁矿",
  "description.stone.rock": "一片矿脉以收集石头",
  "description.crimstone.rock": "一片矿脉以收集红宝石",
  "description.flower.bed": "一块空田以种花卉",
  "description.tree": "一棵树木以收集木头",
  "description.fruit.patch": "一块空田以种水果",
  "description.boulder": "一片神秘矿脉可掉落稀有矿物",
  "description.catch.the.kraken.banner": "海怪浮现！追捕海怪时季参与者的标志",
  "description.luminous.lantern": "明亮纸灯笼照亮前方道路",
  "description.radiance.lantern": "光亮纸灯笼射出强光闪耀",
  "description.ocean.lantern": "海浪纸灯笼随着波涛摇曳",
  "description.solar.lantern":
    "掌持向日葵的跃动精粹，向日灯笼散发着温暖又耀眼的荧光",
  "description.aurora.lantern": "极光纸灯笼晕染魔法幻境",
  "description.dawn.umbrella": "有了晨曦伞座，叫茄子在阴雨云天也保持干爽",
  "description.eggplant.grill": "用上茄子烤架做饭，户外就餐完美精选",
  "description.giant.dawn.mushroom": "巨型晨曦蘑菇在任何农场都显得雄伟又魔幻",
  "description.shroom.glow": "蘑菇灯的魔力荧光照亮您的农场",
  "description.clementine": "小橙侏儒是你耕作冒险的欢乐伙伴",
  "description.blossombeard": "开花胡茬侏儒是你耕作冒险的强力帮手",
  "description.cobalt": "钴侏儒用他的鲜艳帽子为你的农场另添时兴增色",
  "description.hoot": "呼呜！呼呜！解开我的谜语没？",
  "description.genie.bear": "正是我想要的！",
  "description.betty.lantern": "看起来栩栩如生！好奇他们是怎么打造这出来的",
  "description.bumpkin.lantern": "凑近听，能听到乡包佬的呢喃低语……可怕！",
  "description.eggplant.bear": "茄子大亨慷慨的标志",
  "description.goblin.lantern": "看着吓人的灯笼",
  "description.dawn.flower":
    "拥吻 Dawn Flower 的夺目美丽，她精致的花瓣闪烁着第一缕晨光",
  "description.kernaldo.bonus": "增加 25 % 玉米生长速度",
  "description.white.crow": "神秘空灵的白乌鸦",
  "description.sapo.docuras": "真正的享受！",
  "description.sapo.travessuras": "噢噢……有人调皮了",
  "description.walrus":
    "凭借他可靠的獠牙和对深海的热爱，他会确保你每次都能钓上额外一条鱼",
  "description.alba":
    "凭借她的敏锐直觉，她会确保你上钩的会有额外水花。50% 的几率 +1 基础鱼！",
  "description.knowledge.crab":
    "Knowledge Crab 让你的 Sprout Mix 效果翻倍，让你的田地财宝跟海上劫掠一样滋润！",
  "description.anchor":
    "用这颗航海明珠抛锚，让每一块地方都风生水起又流行时锚！",
  "description.rubber.ducky":
    "伴着这经典叫叫玩具漂浮，传颂胶胶奇趣到每一角落！",
  "description.arcade.token": "从小游戏与冒险挣来的代币。可以换取奖赏。",
  "description.bumpkin.nutcracker": "2023 年的节日装饰",
  "description.festive.tree":
    "每到佳节搬上台面的节庆树。好奇够不够大让圣诞老人看见呢？",
  "description.white.festive.fox": "白狐的赐福安居在慷慨的农场",
  "description.grinxs.hammer": "出自传奇哥布林铁匠 Grinx 之手的魔法锤子",
  "description.angelfish": "海洋的天蓝之美，点缀着缤纷跃动弧光",
  "description.halibut": "海底平地的潜居者，披着沙色迷彩的伪装大师",
  "description.parrotFish": "海浪下的七彩万花筒，这鱼就是大自然的鲜活艺术造物",
  "description.Farmhand": "热心的雇农",
  "description.Beehive":
    "熙熙攘攘的蜂巢，从生长的花卉采来产出蜂蜜；收获满溢的蜂蜜有 10 % 的概率召来蜂群，为生长的庄稼授粉增加 0.2 的产出！",
  // Flowers
  "description.red.pansy": "红三色堇。一朵红三色堇。",
  "description.yellow.pansy": "黄三色堇。一朵黄三色堇。",
  "description.purple.pansy": "紫三色堇。一朵紫三色堇。",
  "description.white.pansy": "白三色堇。一朵白三色堇。",
  "description.blue.pansy": "蓝三色堇。一朵蓝三色堇。",

  "description.red.cosmos": "红波斯菊。一朵红波斯菊。",
  "description.yellow.cosmos": "黄波斯菊。一朵黄色波斯菊。",
  "description.purple.cosmos": "紫波斯菊。一朵紫波斯菊。",
  "description.white.cosmos": "白波斯菊。一朵白波斯菊。",
  "description.blue.cosmos": "蓝波斯菊。一朵蓝波斯菊。",

  "description.red.balloon.flower": "红桔梗。一朵红桔梗。",
  "description.yellow.balloon.flower": "黄桔梗。一朵黄桔梗。",
  "description.purple.balloon.flower": "紫桔梗。一朵紫桔梗。",
  "description.white.balloon.flower": "白桔梗。一朵白桔梗。",
  "description.blue.balloon.flower": "蓝桔梗。一朵蓝桔梗。",

  "description.red.carnation": "红康乃馨。一朵红康乃馨。",
  "description.yellow.carnation": "黄康乃馨。一朵黄康乃馨。",
  "description.purple.carnation": "紫康乃馨。一朵紫康乃馨。",
  "description.white.carnation": "白康乃馨。一朵白康乃馨。",
  "description.blue.carnation": "蓝康乃馨。一朵蓝康乃馨。",

  "description.humming.bird": "小小天上明珠，Humming Bird 捧七彩的优雅飞掠而过",
  "description.queen.bee": "蜂巢的威严统领，Queen Bee 以至高君权嗡嗡号令",
  "description.flower.fox": "Flower Fox，花瓣簇拥的欢欣生灵，为花园带来雀跃",
  "description.hungry.caterpillar":
    "嚼着树叶，Hungry Caterpillar 总蓄势等待下一场美味冒险",
  "description.sunrise.bloom.rug":
    "踏上 Sunrise Bloom Rug，花瓣在之上舞起花香晨光。",
  "description.blossom.royale":
    "Blossom Royale，蓝与粉鲜活荡漾的巨大花朵，挺拔撑起俨然绽放。",
  "description.rainbow": "欢乐彩虹，为天地搭起七彩拱桥。",
  "description.enchanted.rose":
    "Enchanted Rose，永生美丽的象征，沉迷在她的魔法魅力里吧。",
  "description.flower.cart": "Flower Cart，满盛花开，移动花园推动鲜花喜悦。",
  "description.capybara": "Capybara，悠闲伙伴，享受水边的慵懒时光。",
  "description.prism.petal": "哇！好一朵漂亮鲜花！我看这朵很值得你放在农场上。",
  "description.celestial.frostbloom":
    "哇！好一朵漂亮鲜花！我看这朵很值得你放在农场上。",
  "description.primula.enigma":
    "哇！好一朵漂亮鲜花！我看这朵很值得你放在农场上。",

  "description.red.daffodil": "红水仙花。一朵红水仙花。",
  "description.yellow.daffodil": "黄水仙花。一朵黄水仙花。",
  "description.purple.daffodil": "紫水仙花。一朵紫水仙花l。",
  "description.white.daffodil": "白水仙花。一朵白水仙花。",
  "description.blue.daffodil": "蓝水仙花。一朵蓝水仙花。",

  "description.red.lotus": "红莲花。一朵红莲花。",
  "description.yellow.lotus": "黄莲花。一朵黄莲花。",
  "description.purple.lotus": "紫莲花。一朵紫莲花。",
  "description.white.lotus": "白莲花。一朵白莲花。",
  "description.blue.lotus": "蓝莲花。一朵蓝莲花。",

  // Banners
  "description.goblin.war.banner": "彰显为哥布林伟业献身的盟约",
  "description.human.war.banner": "彰显为人类伟业献身的盟约",
  "description.earnAllianceBanner": "一杆特别活动的旗帜",
  "description.sunflorian.faction.banner": "彰显对 Sunflorian 派系的忠心",
  "description.goblin.faction.banner": "彰显对 Goblin 派系的忠心",
  "description.nightshade.faction.banner": "彰显对 Nightshade 派系的忠心",
  "description.bumpkin.faction.banner": "彰显对 Bumpkin 派系的忠心",
  "description.oil.reserve": "石油之源",

  // Clash of Factions
  "description.turbo.sprout": "一台为温室减少 50 % 生长时间的引擎。",
  "description.soybliss": "为大豆 +1 产出的奇特豆豆生物。",
  "description.grape.granny": "女族长悉心睿智的照料助长葡萄 +1 产出。",
  "description.royal.throne": "为至高阶农夫打造的王位。",
  "description.lily.egg": "小小欣喜，大大美丽，久久惊奇。",
  "description.goblet": "至珍美酒高杯藏。",
  "description.clock": "时钟的脚步轻响时季的滴答",
  "description.fancy.rug": "叫任何房间都蓬荜生辉的地毯。",
  "description.vinny": "Vinny，友善葡萄藤，随时欢迎闲聊。",
  "description.desertgnome": "能够在最恶劣的条件下生存的侏儒。",
  "description.battleCryDrum": ENGLISH_TERMS["description.battleCryDrum"],
  "description.bullseyeBoard": ENGLISH_TERMS["description.bullseyeBoard"],
  "description.chessRug": ENGLISH_TERMS["description.chessRug"],
  "description.cluckapult": ENGLISH_TERMS["description.cluckapult"],
  "description.goldenGallant": ENGLISH_TERMS["description.goldenGallant"],
  "description.goldenGarrison": ENGLISH_TERMS["description.goldenGarrison"],
  "description.goldenGuardian": ENGLISH_TERMS["description.goldenGuardian"],
  "description.noviceKnight": ENGLISH_TERMS["description.noviceKnight"],
  "description.regularPawn": ENGLISH_TERMS["description.regularPawn"],
  "description.rookieRook": ENGLISH_TERMS["description.rookieRook"],
  "description.silverSentinel": ENGLISH_TERMS["description.silverSentinel"],
  "description.silverStallion": ENGLISH_TERMS["description.silverStallion"],
  "description.silverSquire": ENGLISH_TERMS["description.silverSquire"],
  "description.traineeTarget": ENGLISH_TERMS["description.traineeTarget"],
  "description.twisterRug": ENGLISH_TERMS["description.twisterRug"],
  "description.gauchoRug": "纪念驰援南巴西的地毯。",
  "description.ricePanda": "熊猫很聪明，从不忘记给稻米浇水。",
  "description.benevolenceFlag": ENGLISH_TERMS["description.benevolenceFlag"],
  "description.devotionFlag": ENGLISH_TERMS["description.devotionFlag"],
  "description.generosityFlag": ENGLISH_TERMS["description.generosityFlag"],
  "description.splendorFlag": ENGLISH_TERMS["description.splendorFlag"],
  "description.jellyLamp": ENGLISH_TERMS["description.jellyLamp"],
  "description.paintCan": ENGLISH_TERMS["description.paintCan"],
};

const defaultDialogue: Record<DefaultDialogue, string> = {
  "defaultDialogue.intro": "你好，朋友！我来看看你有没有什么我需要的。",
  "defaultDialogue.positiveDelivery":
    "噢，太棒了！你带的正是我需要的。谢谢你！",
  "defaultDialogue.negativeDelivery":
    "噢，不！看来你没带上我要的。不过别担心。继续探索吧，会有新的机会的。",
  "defaultDialogue.noOrder": "我现在没有可接的订单要去完成。",
};

const delivery: Record<Delivery, string> = {
  "delivery.resource": "要我提供资源吗？",
  "delivery.feed": "这不是免费的，我得养活一个部落！",
  "delivery.fee": "我将抽出其中资源的 30 % 给哥布林社区金库。",
  "delivery.goblin.comm.treasury": "哥布林社区金库",
};

const deliveryHelp: Record<DeliveryHelp, string> = {
  "deliveryHelp.pumpkinSoup":
    "收集食材，乘船前往 Pumpkin Plaza，为乡包佬完成送货订单以获得奖励！",
  "deliveryHelp.hammer": "拓张您的土地以解锁更大的空间和更多的送货订单。",
  "deliveryHelp.axe": "完成您的日常农活然后在 Plaza 找到 Hank 来领取您的奖励。",
  "deliveryHelp.chest": "通过完成多次送货订单来与乡包佬培养友谊以解锁奖励。",
};

const deliveryitem: Record<DeliveryItem, string> = {
  "deliveryitem.inventory": "存货：",
  "deliveryitem.itemsToDeliver": "提取的物品：",
  "deliveryitem.deliverToWallet": "提至您的钱包",
  "deliveryitem.viewOnOpenSea": "一旦交付，您将能够在 OpenSea 上查看您的物品。",
  "deliveryitem.deliver": "提取",
};

const depositWallet: Record<DepositWallet, string> = {
  "deposit.errorLoadingBalances": "加载您的余额时出错。",
  "deposit.yourPersonalWallet": "您的个人钱包",
  "deposit.farmWillReceive": "您的农场将收到：",
  "deposit.depositDidNotArrive": "存入没到？",
  "deposit.goblinTaxInfo": "当玩家提取任意 SFL 时，都会被征收哥布林税。",
  "deposit.sendToFarm": "送往农场",
  "deposit.toDepositLevelUp": "要存入物品你必须先升级",
  "deposit.level": "3 级",
  "deposit.noSflOrCollectibles": "未找到 SFL 或收藏品！",
  "deposit.farmAddress": "农场地址",
  "question.depositSFLItems":
    "您想存入 Sunflower Land 的收藏品、可穿戴物品或 SFL 吗？",
};

const detail: Record<Detail, string> = {
  "detail.how.item": "如何获得此物品？",
  "detail.Claim.Reward": "领取奖励",
  "detail.basket.empty": "您的篮子是空的！",
  "detail.view.item": "查看商品请到",
};

const discordBonus: Record<DiscordBonus, string> = {
  "discord.bonus.niceHat": "哇，好一顶帽子！",
  "discord.bonus.attentionEvents": "不要错过 Discord 上的特别活动和赠品。",
  "discord.bonus.bonusReward": "特别奖励",
  "discord.bonus.payAttention":
    "请务必关注 Discord 上的特别活动和赠品，可别错过任何精彩机会。",
  "discord.bonus.enjoyCommunity": "我们希望您能作为我们社区的一份子乐在其中！",
  "discord.bonus.communityInfo":
    "您是否知道我们分外活跃的 Discord 社区已经拥有超过 85,000 名农夫？",
  "discord.bonus.farmingTips": "要是您正苦苦寻觅农业技巧和窍门，来这儿就对了！",
  "discord.bonus.freeGift": "最妙的是……每个加入的人都会得到一份礼物！",
  "discord.bonus.connect": "连接 Discord",
  "fontReward.bonus.claim": ENGLISH_TERMS["fontReward.bonus.claim"],
  "fontReward.bonus.intro1": ENGLISH_TERMS["fontReward.bonus.intro1"],
  "fontReward.bonus.intro2": ENGLISH_TERMS["fontReward.bonus.intro2"],
  "fontReward.bonus.intro3": ENGLISH_TERMS["fontReward.bonus.intro3"],
};

const donation: Record<Donation, string> = {
  "donation.one": "这是一个社区艺术项目，非常感谢捐赠！",
  "donation.rioGrandeDoSul.one":
    "嗨，大家好！巴西南部最近遭受洪水破坏，我们正在避难所筹集食物和水的捐款。",
  "donation.rioGrandeDoSul.two": "每位捐款人都将获得纪念装饰品。",
  "donation.matic": "MATIC 捐款",
  "donation.minimum": "至少捐 1 MATIC",
  "donation.airdrop": "捐赠活动落幕后便将空投装饰品。",
  "donation.specialEvent": "特别捐献活动",
};

const draftBid: Record<DraftBid, string> = {
  "draftBid.howAuctionWorks": "拍卖如何进行？",
  "draftBid.unsuccessfulParticipants": "未中标的投标者将返还全额资源。",
  "draftBid.termsAndConditions": "条款和条件",
};

// Will Skip this category first, cuz I don’t think this page is used atm
const errorAndAccess: Record<ErrorAndAccess, string> = {
  "errorAndAccess.blocked.betaTestersOnly": "仅准许 Beta 测试人员",
  "errorAndAccess.denied.message": "您尚未获得游玩权限。",
  "errorAndAccess.instructions.part1": "请确保您已加入 ",
  "errorAndAccess.sflDiscord": "Sunflower Land Discord",
  "errorAndAccess.instructions.part2":
    '，到 #verify 频道并领取 "farmer" 角色。',
  "error.cannotPlaceInside": "无法在里面放置",
};

const errorTerms: Record<ErrorTerms, string> = {
  "error.betaTestersOnly": "仅限 Beta 测试人员！",
  "error.congestion.one":
    "我们正在尽力，但看起来 Polygon 的流量太大或者您丢失了连接。",
  "error.congestion.two": "如果此错误继续发生，请尝试更改您的 Metamask RPC",
  "error.connection.one": "看起来我们无法完成这个请求。",
  "error.connection.two": "这可能只是连接的问题而已。",
  "error.connection.three": "您可以点击刷新再试一次。",
  "error.connection.four":
    "如果问题仍然存在，您可以联系我们的支持团队或跳转到我们的 Discord 并询问我们的社区以寻求帮助。",
  "error.diagnostic.info": "诊断信息",
  "error.forbidden.goblinVillage": "您无权访问哥布林村！",
  "error.multipleDevices.one": "多台设备上线",
  "error.multipleDevices.two":
    "请确保您正在使用的所有其他浏览器选项卡或设备都已关闭。",
  "error.multipleWallets.one": "多余钱包",
  "error.multipleWallets.two":
    "看来您安装了多个钱包。这可能会导致程序意外。您可以尝试禁用所有钱包，只留下一个吗？",
  "error.polygonRPC": "请重试或检查您的 Polygon RPC 设置。",
  "error.toManyRequest.one": "请求太多！",
  "error.toManyRequest.two": "看来您很忙！请稍后再试。",
  "error.Web3NotFound": "未找到 Web3",
  "error.wentWrong": "出了些问题！",
  "error.clock.not.synced": "时钟不同步。",
  "error.polygon.cant.connect": "无法连接到 Polygon。",
  "error.composterNotExist": "堆肥器不存在。",
  "error.composterNotProducing": "堆肥器未生产任何东西",
  "error.composterAlreadyDone": "堆肥器已完成。",
  "error.composterAlreadyBoosted": "已经加速了。",
  "error.missingEggs": "缺少鸡蛋",
  "error.insufficientSFL": "SFL 不足。",
  "error.dailyAttemptsExhausted": "每日尝试次数都已用尽。",
  "error.missingRod": "缺少钓鱼竿。",
  "error.missingBait": "缺少鱼饵", // not used
  "error.alreadyCasted": "已投竿",
  "error.unsupportedChum": "{{chum}} 不可用作添饵",
  "error.insufficientChum": "添饵量不足",
  "error.alr.composter": "堆肥器已经开始工作",
  "error.no.alr.composter": "堆肥机生产未就绪",
  "error.missing": "缺少必需品",
  "error.no.ready": "堆肥尚未准备好",
  "error.noprod.composter": "堆肥机未产生任何肥料",
  "error.buildingNotExist": "建筑物不存在",
  "error.buildingNotCooking": "建筑未烹饪任何东西",
  "error.recipeNotReady": "食谱未就绪",
  "error.npcsNotExist": "NPC 不存在",
  "error.noDiscoveryAvailable": "没有想要的痴玩",
  "error.obsessionAlreadyCompleted": "已经完成展示此次痴玩",
  "error.collectibleNotInInventory": "您没有所需的收藏品",
  "error.wearableNotInWardrobe": "您没有所需的可穿戴物品",
  "error.requiredBuildingNotExist": "所需建筑不存在",
  "error.cookingInProgress": "烹饪已在进行中",
  "error.insufficientIngredient": "原料不足",
  "error.ClientRPC": "客户端 RPC 错误",

  "error.walletInUse.one": "钱包占用中",
  "error.walletInUse.two":
    "本钱包已连接到一座农场。请使用社交帐号或另一个钱包登录。",
  "error.walletInUse.three": "请尝试其他登陆手段",
  "error.notEnoughOil": "石油不足",
  "error.oilCapacityExceeded": "石油超出容量",
};

const event: Record<Event, string> = {
  "event.christmas": "圣诞节活动！",
  "event.LunarNewYear": "农历新年活动",
  "event.GasHero": "燃气英雄活动",
  "event.valentines.rewards": "情人节礼物",
  "event.Easter": "复活节活动",
};

const exoticShopItems: Record<ExoticShopItems, string> = {
  "exoticShopItems.line1":
    "我们的豆子店要关门了，因为我们的豆子要随一位疯狂的科学家一起踏上新的旅程。",
  "exoticShopItems.line2": "感谢您加入我们这个热爱豆科植物的社区。",
  "exoticShopItems.line3": "致以最诚挚的问候，",
  "exoticShopItems.line4": "豆豆团队",
};

const factions: Record<Factions, string> = {
  "faction.join": "加入 {{faction}}",
  "faction.description.bumpkins":
    "Bumpkins 在 Sunflower Land 世代耕作。您是否信仰精诚与合作？",
  "faction.description.goblins":
    "Goblins 都是 Sunflower Land 上机灵的实业家。您是否信仰进步与创新？",
  "faction.description.sunflorians":
    "Sunflorians 君临统治 Sunflower Land。您是否信仰权威与规程？",
  "faction.description.nightshades":
    "Nightshades 是 Sunflower Land 土地上的神秘魔物。您是否信仰魔法与神秘？",
  "faction.countdown": "在 {{timeUntil}} 后派系纷争即将开幕。",
  "faction.join.confirm": "您想要加入 {{faction}} 吗？",
  "faction.cannot.change": "一旦选择您将无法更换派系。",
  "faction.joined.sunflorians.intro":
    "贵安，高贵的 Sunflorian！加入我们正高举的旗帜，凝聚一心征索我们王国的强权与荣耀。",
  "faction.joined.bumpkins.intro":
    "嘿呀， Bumpkin 同僚！是时候团结我们的农民子弟，向他方派系展示勤劳团结的力量了。",
  "faction.joined.goblins.intro":
    "致敬，巧手的 Goblin！我们保持头脑精明与巧计诈施，前路的征战必归我们。",
  "faction.joined.nightshades.intro":
    "恭迎，诡秘的 Nightshade！齐聚一堂，我们当指引阴影、展露制胜前方争战的秘密。",
  "faction.earn.emblems": "获得纹章",
  "faction.earn.emblems.time.left": "剩余 {{timeLeft}}",
  "faction.emblems.tasks":
    "通过捐赠或完成时季送货来赚取派系点数参与派系纹章空投。",
  "faction.view.leaderboard": "查看排行榜",
  "faction.donation.bulk.resources": "批量资源捐献（至少 {{min}}）",
  "faction.donation.bulk.resources.unlimited.per.day":
    "{{donatedToday}} / 无 每日限额",
  "faction.donation.confirm":
    "您确认希望进行如下捐献以赚取总共 {{factionPoints}} 点派系点数吗？",
  "faction.donation.label": "{{faction}} 派系捐赠",
  "faction.donation.request.message":
    "您好， {{faction}}！我们现正接受资源和SFL捐赠以援助派系筑基。您将获得派系点数以回馈您的慷慨解囊。",
  "faction.donation.sfl": "SFL 捐赠（至少 10）",
  "faction.donation.sfl.max.per.day": "{{donatedToday}} / 500 每日限额",
  "faction.seasonal.delivery.start.at": "时季送货开始尚余 {{days}}",
  "faction.points.with.number": "派系点数： {{points}}",
  "faction.points.title": "派系点数",
  "faction.points.pledge.warning": "请效忠一宗派系以获取派系点数！",
  "faction.emblemAirdrop": ENGLISH_TERMS["faction.emblemAirdrop"],
  "faction.emblemAirdrop.closes": ENGLISH_TERMS["faction.emblemAirdrop.closes"],

  // Kingdom
  "faction.restrited.area": ENGLISH_TERMS["faction.restrited.area"],
  "faction.not.pledged": ENGLISH_TERMS["faction.not.pledged"],
  "faction.cost": ENGLISH_TERMS["faction.cost"],
  "faction.pledge.reward": ENGLISH_TERMS["faction.pledge.reward"],
  "faction.welcome": ENGLISH_TERMS["faction.welcome"],
  "faction.greeting.bumpkins": ENGLISH_TERMS["faction.greeting.bumpkins"],
  "faction.greeting.goblins": ENGLISH_TERMS["faction.greeting.goblins"],
  "faction.greeting.nightshades": ENGLISH_TERMS["faction.greeting.nightshades"],
  "faction.greeting.sunflorians": ENGLISH_TERMS["faction.greeting.sunflorians"],

  "faction.claimEmblems.alreadyClaimed":
    ENGLISH_TERMS["faction.claimEmblems.alreadyClaimed"],
  "faction.claimEmblems.emblemsEarned":
    ENGLISH_TERMS["faction.claimEmblems.emblemsEarned"],
  "faction.claimEmblems.yourRank":
    ENGLISH_TERMS["faction.claimEmblems.yourRank"],
  "faction.claimEmblems.yourPercentile":
    ENGLISH_TERMS["faction.claimEmblems.yourPercentile"],
  "faction.claimEmblems.yourEmblems":
    ENGLISH_TERMS["faction.claimEmblems.yourEmblems"],
  "faction.claimEmblems.noContribution":
    ENGLISH_TERMS["faction.claimEmblems.noContribution"],
  "faction.claimEmblems.statistics":
    ENGLISH_TERMS["faction.claimEmblems.statistics"],
  "faction.claimEmblems.thankYou":
    ENGLISH_TERMS["faction.claimEmblems.thankYou"],
  "faction.claimEmblems.claimMessage":
    ENGLISH_TERMS["faction.claimEmblems.claimMessage"],
  "faction.claimEmblems.claim": ENGLISH_TERMS["faction.claimEmblems.claim"],
  "faction.claimEmblems.congratulations":
    ENGLISH_TERMS["faction.claimEmblems.congratulations"],
  "faction.claimEmblems.comparison":
    ENGLISH_TERMS["faction.claimEmblems.comparison"],
  "faction.claimEmblems.totalMembers":
    ENGLISH_TERMS["faction.claimEmblems.totalMembers"],
  "faction.claimEmblems.totalEmblems":
    ENGLISH_TERMS["faction.claimEmblems.totalEmblems"],
  "faction.claimEmblems.percentile":
    ENGLISH_TERMS["faction.claimEmblems.percentile"],
  "faction.claimEmblems.travelNow":
    ENGLISH_TERMS["faction.claimEmblems.travelNow"],
  "faction.claimEmblems.visitMe": ENGLISH_TERMS["faction.claimEmblems.visitMe"],
  "faction.kitchen.gatherResources":
    ENGLISH_TERMS["faction.kitchen.gatherResources"],
  "faction.kitchen.opensIn": ENGLISH_TERMS["faction.kitchen.opensIn"],
  "faction.kitchen.notReady": ENGLISH_TERMS["faction.kitchen.notReady"],
  "faction.kitchen.preparing": ENGLISH_TERMS["faction.kitchen.preparing"],
  "faction.kitchen.newRequests": ENGLISH_TERMS["faction.kitchen.newRequests"],
  "faction.openingSoon": ENGLISH_TERMS["faction.openingSoon"],
  "faction.emblems": ENGLISH_TERMS["faction.emblems"],
  "faction.emblems.intro.one": ENGLISH_TERMS["faction.emblems.intro.one"],
  "faction.emblems.intro.three": ENGLISH_TERMS["faction.emblems.intro.three"],
  "faction.emblems.intro.two": ENGLISH_TERMS["faction.emblems.intro.two"],
  "faction.tradeEmblems": ENGLISH_TERMS["faction.tradeEmblems"],
  "faction.marksBoost": ENGLISH_TERMS["faction.marksBoost"],
  "faction.shop.onlyFor": ENGLISH_TERMS["faction.shop.onlyFor"],
  "faction.shop.welcome": ENGLISH_TERMS["faction.shop.welcome"],
};

const factionShopDescription: Record<FactionShopDescription, string> = {
  "description.factionShop.sunflorianThrone":
    ENGLISH_TERMS["description.factionShop.sunflorianThrone"],
  "description.factionShop.nightshadeThrone":
    ENGLISH_TERMS["description.factionShop.nightshadeThrone"],
  "description.factionShop.goblinThrone":
    ENGLISH_TERMS["description.factionShop.goblinThrone"],
  "description.factionShop.bumpkinThrone":
    ENGLISH_TERMS["description.factionShop.bumpkinThrone"],
  "description.factionShop.goldenSunflorianEgg":
    ENGLISH_TERMS["description.factionShop.goldenSunflorianEgg"],
  "description.factionShop.goblinMischiefEgg":
    ENGLISH_TERMS["description.factionShop.goblinMischiefEgg"],
  "description.factionShop.bumpkinCharmEgg":
    ENGLISH_TERMS["description.factionShop.bumpkinCharmEgg"],
  "description.factionShop.nightshadeVeilEgg":
    ENGLISH_TERMS["description.factionShop.nightshadeVeilEgg"],
  "description.factionShop.emeraldGoblinGoblet":
    ENGLISH_TERMS["description.factionShop.emeraldGoblinGoblet"],
  "description.factionShop.opalSunflorianGoblet":
    ENGLISH_TERMS["description.factionShop.opalSunflorianGoblet"],
  "description.factionShop.sapphireBumpkinGoblet":
    ENGLISH_TERMS["description.factionShop.sapphireBumpkinGoblet"],
  "description.factionShop.amethystNightshadeGoblet":
    ENGLISH_TERMS["description.factionShop.amethystNightshadeGoblet"],
  "description.factionShop.goldenFactionGoblet":
    ENGLISH_TERMS["description.factionShop.goldenFactionGoblet"],
  "description.factionShop.rubyFactionGoblet":
    ENGLISH_TERMS["description.factionShop.rubyFactionGoblet"],
  "description.factionShop.sunflorianBunting":
    ENGLISH_TERMS["description.factionShop.sunflorianBunting"],
  "description.factionShop.nightshadeBunting":
    ENGLISH_TERMS["description.factionShop.nightshadeBunting"],
  "description.factionShop.goblinBunting":
    ENGLISH_TERMS["description.factionShop.goblinBunting"],
  "description.factionShop.bumpkinBunting":
    ENGLISH_TERMS["description.factionShop.bumpkinBunting"],
  "description.factionShop.sunflorianCandles":
    ENGLISH_TERMS["description.factionShop.sunflorianCandles"],
  "description.factionShop.nightshadeCandles":
    ENGLISH_TERMS["description.factionShop.nightshadeCandles"],
  "description.factionShop.goblinCandles":
    ENGLISH_TERMS["description.factionShop.goblinCandles"],
  "description.factionShop.bumpkinCandles":
    ENGLISH_TERMS["description.factionShop.bumpkinCandles"],
  "description.factionShop.sunflorianLeftWallSconce":
    ENGLISH_TERMS["description.factionShop.sunflorianLeftWallSconce"],
  "description.factionShop.nightshadeLeftWallSconce":
    ENGLISH_TERMS["description.factionShop.nightshadeLeftWallSconce"],
  "description.factionShop.goblinLeftWallSconce":
    ENGLISH_TERMS["description.factionShop.goblinLeftWallSconce"],
  "description.factionShop.bumpkinLeftWallSconce":
    ENGLISH_TERMS["description.factionShop.bumpkinLeftWallSconce"],
  "description.factionShop.sunflorianRightWallSconce":
    ENGLISH_TERMS["description.factionShop.sunflorianRightWallSconce"],
  "description.factionShop.nightshadeRightWallSconce":
    ENGLISH_TERMS["description.factionShop.nightshadeRightWallSconce"],
  "description.factionShop.goblinRightWallSconce":
    ENGLISH_TERMS["description.factionShop.goblinRightWallSconce"],
  "description.factionShop.bumpkinRightWallSconce":
    ENGLISH_TERMS["description.factionShop.bumpkinRightWallSconce"],
  "description.factionShop.cookingBoost":
    ENGLISH_TERMS["description.factionShop.cookingBoost"],
  "description.factionShop.cropBoost":
    ENGLISH_TERMS["description.factionShop.cropBoost"],
  "description.factionShop.woodBoost":
    ENGLISH_TERMS["description.factionShop.woodBoost"],
  "description.factionShop.mineralBoost":
    ENGLISH_TERMS["description.factionShop.mineralBoost"],
  "description.factionShop.fruitBoost":
    ENGLISH_TERMS["description.factionShop.fruitBoost"],
  "description.factionShop.flowerBoost":
    ENGLISH_TERMS["description.factionShop.flowerBoost"],
  "description.factionShop.fishBoost":
    ENGLISH_TERMS["description.factionShop.fishBoost"],
  "description.factionShop.sunflorianFactionRug":
    ENGLISH_TERMS["description.factionShop.sunflorianFactionRug"],
  "description.factionShop.nightshadeFactionRug":
    ENGLISH_TERMS["description.factionShop.nightshadeFactionRug"],
  "description.factionShop.goblinFactionRug":
    ENGLISH_TERMS["description.factionShop.goblinFactionRug"],
  "description.factionShop.bumpkinFactionRug":
    ENGLISH_TERMS["description.factionShop.bumpkinFactionRug"],
  "description.factionShop.goblinArmor":
    ENGLISH_TERMS["description.factionShop.goblinArmor"],
  "description.factionShop.goblinHelmet":
    ENGLISH_TERMS["description.factionShop.goblinHelmet"],
  "description.factionShop.goblinPants":
    ENGLISH_TERMS["description.factionShop.goblinPants"],
  "description.factionShop.goblinSabatons":
    ENGLISH_TERMS["description.factionShop.goblinSabatons"],
  "description.factionShop.goblinAxe":
    ENGLISH_TERMS["description.factionShop.goblinAxe"],
  "description.factionShop.sunflorianArmor":
    ENGLISH_TERMS["description.factionShop.sunflorianArmor"],
  "description.factionShop.sunflorianHelmet":
    ENGLISH_TERMS["description.factionShop.sunflorianHelmet"],
  "description.factionShop.sunflorianPants":
    ENGLISH_TERMS["description.factionShop.sunflorianPants"],
  "description.factionShop.sunflorianSabatons":
    ENGLISH_TERMS["description.factionShop.sunflorianSabatons"],
  "description.factionShop.sunflorianSword":
    ENGLISH_TERMS["description.factionShop.sunflorianSword"],
  "description.factionShop.bumpkinArmor":
    ENGLISH_TERMS["description.factionShop.bumpkinArmor"],
  "description.factionShop.bumpkinHelmet":
    ENGLISH_TERMS["description.factionShop.bumpkinHelmet"],
  "description.factionShop.bumpkinPants":
    ENGLISH_TERMS["description.factionShop.bumpkinPants"],
  "description.factionShop.bumpkinSabatons":
    ENGLISH_TERMS["description.factionShop.bumpkinSabatons"],
  "description.factionShop.bumpkinSword":
    ENGLISH_TERMS["description.factionShop.bumpkinSword"],
  "description.factionShop.nightshadeArmor":
    ENGLISH_TERMS["description.factionShop.nightshadeArmor"],
  "description.factionShop.nightshadeHelmet":
    ENGLISH_TERMS["description.factionShop.nightshadeHelmet"],
  "description.factionShop.nightshadePants":
    ENGLISH_TERMS["description.factionShop.nightshadePants"],
  "description.factionShop.nightshadeSabatons":
    ENGLISH_TERMS["description.factionShop.nightshadeSabatons"],
  "description.factionShop.nightshadeSword":
    ENGLISH_TERMS["description.factionShop.nightshadeSword"],
  "description.factionShop.knightGambit":
    ENGLISH_TERMS["description.factionShop.knightGambit"],
  "description.factionShop.motley":
    ENGLISH_TERMS["description.factionShop.motley"],
  "description.factionShop.royalBraids":
    ENGLISH_TERMS["description.factionShop.royalBraids"],
};

const festiveTree: Record<FestiveTree, string> = {
  "festivetree.greedyBumpkin": "发现贪婪的乡包佬",
  "festivetree.alreadyGifted": "这棵树已配礼物。请等到下一个圣诞节再庆祝吧。",
  "festivetree.notFestiveSeason": "现在没到节日。晚点再来吧",
};

const fishDescriptions: Record<FishDescriptions, string> = {
  // Fish
  "description.anchovy.one": "海洋里的袖珍飞镖，总是匆匆忙忙！",
  "description.anchovy.two": "鱼小味香！",
  "description.butterflyfish.one": "时尚前卫的鱼，显摆其鲜艳、时髦的条纹。",
  "description.butterflyfish.two": "游弋在色彩和美味间！",
  "description.blowfish.one": "海中的圆润喜剧演员，保证让你笑容满面。",
  "description.blowfish.two": "与危险共进晚餐，一个多刺的惊喜！",
  "description.clownfish.one": "水下的小丑，身着橘色礼服，充满小丑般的魅力。",
  "description.clownfish.two": "不开玩笑，只有纯粹的美味！",
  "description.seabass.one":
    "你的“不那么令人兴奋的”朋友，银色的鳞片——一个基础的捕获！",
  "description.seabass.two": "海边美食的基础！",
  "description.seahorse.one": "海洋中的慢动作舞者，在水下芭蕾中优雅地摇摆。",
  "description.seahorse.two": "精致、稀有且出乎意料地美味！",
  "description.horsemackerel.one":
    "一位身披闪亮外衣的速度选手，总是在波浪中穿梭。",
  "description.horsemackerel.two": "每一口都能让你感受到风味的飞跃！",
  "description.squid.one": "深海之谜，用其触须勾起你的好奇心。",
  "description.squid.two": "用墨水开启精致味道之旅！",
  "description.redsnapper.one": "价值连城的捕获，身披火红色。",
  "description.redsnapper.two": "一口咬下，品尝丰富、辛辣的海洋风味！",
  "description.morayeel.one": "海洋中阴暗角落里的狡猾潜伏者。",
  "description.morayeel.two": "滑溜、美味、引人入胜！",
  "description.oliveflounder.one": "海床上的伪装大师，总是与众不同。",
  "description.oliveflounder.two": "在丰富和味道中挣扎！",
  "description.napoleanfish.one":
    "认识一下患有拿破仑情结的鱼——短小，但雍容华贵！",
  "description.napoleanfish.two": "用这个捕获征服你的饥饿感！",
  "description.surgeonfish.one": "海洋中的霓虹战士，武装着锋利的态度。",
  "description.surgeonfish.two": "用精准操作征服你的味蕾！",
  "description.zebraturkeyfish.one":
    "条纹、刺和充满活力的性格，这条鱼是真正的焦点！",
  "description.zebraturkeyfish.two": "条纹斑斓、多刺、极其美味！",
  "description.ray.one": "水下的滑翔者，通过波浪中的宁静翅膀展现出的优雅。",
  "description.ray.two": "滑入丰富风味的领域！",
  "description.hammerheadshark.one": "这是一只头脑灵活、身体追求冒险的鲨鱼！",
  "description.hammerheadshark.two": "与味道正面碰撞！",
  "description.tuna.one":
    "海洋中肌肉发达的短跑运动员，准备好进行一场鳍部的精彩比赛！",
  "description.tuna.two": "每一片中都有一个味道的巨人！",
  "description.mahimahi.one": "一条相信生活要多姿多彩的鱼，金色的鳍片。",
  "description.mahimahi.two": "名字双倍，美味加倍！",
  "description.bluemarlin.one": "海洋的传奇，马林鱼，拥有深海一样的态度。",
  "description.bluemarlin.two": "用这皇家的捕获引领你的胃口！",
  "description.oarfish.one": "长而漫长——一位神秘的海洋流浪者。",
  "description.oarfish.two": "划入传奇风味的旅程！",
  "description.footballfish.one": "深海的MVP，一颗准备参与比赛的生物发光之星！",
  "description.footballfish.two": "在味道中攻入一球！",
  "description.sunfish.one":
    "海洋中的晒太阳者，高举鳍片，享受着聚光灯下的时刻。",
  "description.sunfish.two": "沐浴在它美味风味的光辉中！",
  "description.coelacanth.one": "一个古老的遗迹，对过去和现在都有一种品味。",
  "description.coelacanth.two": "古老的风味，经受住了时间的考验！",
  "description.whaleshark.one": "深海的温柔巨人，从海洋的自助餐中筛选珍宝。",
  "description.whaleshark.two": "为巨大的渴望提供一顿丰盛的餐食！",
  "description.barredknifejaw.one": "一位带有黑白条纹和黄金心的海洋流氓。",
  "description.barredknifejaw.two": "以锋利的风味切开饥饿！",
  "description.sawshark.one":
    "以锯齿状的吻，它是海洋的木工，总是走在潮流的前沿！",
  "description.sawshark.two": "来自深海的前沿风味！",
  "description.whiteshark.one":
    "带着杀手般的笑容统治海洋的鲨鱼，以鳍的强度为傲！",
  "description.whiteshark.two": "潜入令人激动的海洋风味中！",

  // Marine Marvels
  "description.twilight.anglerfish":
    "一种深海琵琶鱼，内置夜灯，引领其穿越黑暗。",
  "description.starlight.tuna":
    "一条比星星还要耀眼的金枪鱼，准备照亮你的收藏。",
  "description.radiant.ray": "一种在黑暗中发光的鳐鱼，有着闪亮的秘密要分享。",
  "description.phantom.barracuda":
    "一种深海中难以捉摸且幽灵般的鱼，隐藏在阴影中。",
  "description.gilded.swordfish": "一条鳞片闪耀如金的剑鱼，终极的捕获！",
  "description.crimson.carp": "春天水域中稀有、充满活力的宝石。",
  "description.battle.fish": "派系赛季稀有的装甲游泳者！",
};

const fishermanModal: Record<FishermanModal, string> = {
  "fishermanModal.attractFish": "通过向水中投食来吸引鱼。",
  "fishermanModal.fishBenefits": "鱼非常适合吃，运送和领取奖励！",
  "fishermanModal.baitAndResources":
    "给我鱼饵和资源，我们将捕获大海所提供的最稀有的奖品！",
  "fishermanModal.crazyHappening":
    "哇，发生了疯狂的事情......这是一场鱼的狂欢！",
  "fishermanModal.bonusFish": "快点，每捕捉一条鱼你将获得一条额外的鱼！",
  "fishermanModal.dailyLimitReached": "你已达到每日{{limit}}条的钓鱼限额",
  "fishermanModal.needCraftRod": "你必须先制作一根钓竿。",
  "fishermanModal.craft.beach": "在海滩上制作",
  "fishermanModal.zero.available": "0可用",
  "fishermanmodal.greeting":
    "嗨，岛上的朋友们！我是{{name}}，你们信赖的岛上渔夫，我已经准备好迎接一个宏大的挑战——收集太阳下的每一种鱼！",
  "fishermanModal.fullMoon": ENGLISH_TERMS["fishermanModal.fullMoon"],
};

const fishermanQuest: Record<FishermanQuest, string> = {
  "fishermanQuest.Ohno": "不好！它跑掉了",
  "fishermanQuest.Newfish": "新鱼种",
};

const fishingChallengeIntro: Record<FishingChallengeIntro, string> = {
  "fishingChallengeIntro.powerfulCatch": "一条强大的鱼等着你！",
  "fishingChallengeIntro.useStrength": "用尽你所有的力量来拉它上来。",
  "fishingChallengeIntro.stopGreenBar": "在鱼上停下绿色条才能成功。",
  "fishingChallengeIntro.beQuick": "要快——错过3次机会，它就会逃走！",
};

const fishingGuide: Record<FishingGuide, string> = {
  "fishingGuide.catch.rod": "制作鱼竿，收集鱼饵来捕鱼。",
  "fishingGuide.bait.earn": "饵料可以通过堆肥或制作诱饵获得。",
  "fishingGuide.eat.fish": "吃鱼来提升你的乡巴佬等级，或者送鱼来获取奖励。",
  "fishingGuide.discover.fish":
    "探索水域，发现珍稀鱼类，完成任务，解锁法典中的独特奖励。",
  "fishingGuide.condition":
    "跟踪潮汐的变化规律；特定的鱼种只有在特定条件下才能捕获。",
  "fishingGuide.bait.chum":
    "尝试使用不同类型的鱼饵和钓饵组合，最大限度地增加钓到各种鱼类的机会。",
  "fishingGuide.legendery.fish":
    "小心传说中的鱼，它们需要非凡的技巧和力量才能捕获。",
};

const fishingQuests: Record<FishingQuests, string> = {
  "quest.basic.fish": "捕获每条基本鱼",
  "quest.advanced.fish": "捕捉每条高级鱼",
  "quest.all.fish": "探索每种基础、高级和专家级鱼类",
  "quest.300.fish": "捕获 300 条鱼",
  "quest.1500.fish": "捕获 1500 条鱼",
  "quest.marine.marvel": "抓住每个海洋奇观",
  "quest.5.fish": "每种鱼都抓 5 条",
  "quest.sunpetal.savant": "发现 12 种 Sunpetal 变体",
  "quest.bloom.bigshot": "发现 12 种 Bloom 变体",
  "quest.lily.luminary": "发现 12 种 Lily 变体",
};

const flowerBed: Record<FlowerBed, string> = {
  "flowerBedGuide.buySeeds": "从种子商店购买种子",
  "flowerBedGuide.crossbreedWithCrops":
    "与作物和其他花卉杂交，发现新的花卉品种",
  "flowerBedGuide.collectAllSpecies": "收集法典中的所有花种！",
  "flowerBedGuide.beesProduceHoney": "蜜蜂在花朵生长时生产蜂蜜",
  "flowerBedGuide.fillUpBeehive":
    "完全填满蜂箱并收集蜂蜜，这样就有机会出现蜂群",
  "flowerBedGuide.beeSwarmsBoost": "蜂群可为任何种植作物带来 +0.2 的增益",
  "flowerBed.newSpecies.discovered": "天哪，你发现了一个新的花种！",
  "flowerBedContent.select.combination": "选择您的组合",
  "flowerBedContent.select.seed": "选择一粒种子",
  "flowerBedContent.select.crossbreed": "选择杂交品种",
};

const flowerbreed: Record<Flowerbreed, string> = {
  "flower.breed.sunflower": ENGLISH_TERMS["flower.breed.sunflower"],
  "flower.breed.cauliflower": ENGLISH_TERMS["flower.breed.cauliflower"],
  "flower.breed.beetroot": ENGLISH_TERMS["flower.breed.beetroot"],
  "flower.breed.parsnip": ENGLISH_TERMS["flower.breed.parsnip"],
  "flower.breed.eggplant": ENGLISH_TERMS["flower.breed.eggplant"],
  "flower.breed.radish": ENGLISH_TERMS["flower.breed.radish"],
  "flower.breed.kale": ENGLISH_TERMS["flower.breed.kale"],
  "flower.breed.blueberry": ENGLISH_TERMS["flower.breed.blueberry"],
  "flower.breed.apple": ENGLISH_TERMS["flower.breed.apple"],
  "flower.breed.banana": ENGLISH_TERMS["flower.breed.banana"],
  "flower.breed.redPansy": ENGLISH_TERMS["flower.breed.redPansy"],
  "flower.breed.yellowPansy": ENGLISH_TERMS["flower.breed.yellowPansy"],
  "flower.breed.purplePansy": ENGLISH_TERMS["flower.breed.purplePansy"],
  "flower.breed.whitePansy": ENGLISH_TERMS["description.white.pansy"],
  "flower.breed.bluePansy": ENGLISH_TERMS["flower.breed.bluePansy"],
  "flower.breed.redCosmos": ENGLISH_TERMS["flower.breed.redCosmos"],
  "flower.breed.yellowCosmos": ENGLISH_TERMS["flower.breed.yellowCosmos"],
  "flower.breed.purpleCosmos": ENGLISH_TERMS["flower.breed.purpleCosmos"],
  "flower.breed.whiteCosmos": ENGLISH_TERMS["flower.breed.whiteCosmos"],
  "flower.breed.blueCosmos": ENGLISH_TERMS["flower.breed.blueCosmos"],
  "flower.breed.prismPetal": ENGLISH_TERMS["flower.breed.prismPetal"],
  "flower.breed.redBalloonFlower":
    ENGLISH_TERMS["flower.breed.redBalloonFlower"],
  "flower.breed.yellowBalloonFlower":
    ENGLISH_TERMS["flower.breed.yellowBalloonFlower"],
  "flower.breed.purpleBalloonFlower":
    ENGLISH_TERMS["flower.breed.purpleBalloonFlower"],
  "flower.breed.whiteBalloonFlower":
    ENGLISH_TERMS["flower.breed.whiteBalloonFlower"],
  "flower.breed.blueBalloonFlower":
    ENGLISH_TERMS["flower.breed.blueBalloonFlower"],
  "flower.breed.redDaffodil": ENGLISH_TERMS["flower.breed.redDaffodil"],
  "flower.breed.yellowDaffodil": ENGLISH_TERMS["flower.breed.yellowDaffodil"],
  "flower.breed.purpleDaffodil": ENGLISH_TERMS["flower.breed.purpleDaffodil"],
  "flower.breed.whiteDaffodil": ENGLISH_TERMS["flower.breed.whiteDaffodil"],
  "flower.breed.blueDaffodil": ENGLISH_TERMS["flower.breed.blueDaffodil"],
  "flower.breed.celestialFrostbloom":
    ENGLISH_TERMS["flower.breed.celestialFrostbloom"],
  "flower.breed.redCarnation": ENGLISH_TERMS["flower.breed.redCarnation"],
  "flower.breed.yellowCarnation": ENGLISH_TERMS["flower.breed.yellowCarnation"],
  "flower.breed.purpleCarnation": ENGLISH_TERMS["flower.breed.purpleCarnation"],
  "flower.breed.whiteCarnation": ENGLISH_TERMS["flower.breed.whiteCarnation"],
  "flower.breed.blueCarnation": ENGLISH_TERMS["flower.breed.blueCarnation"],
  "flower.breed.redLotus": ENGLISH_TERMS["flower.breed.redLotus"],
  "flower.breed.yellowLotus": ENGLISH_TERMS["flower.breed.yellowLotus"],
  "flower.breed.purpleLotus": ENGLISH_TERMS["flower.breed.purpleLotus"],
  "flower.breed.whiteLotus": ENGLISH_TERMS["flower.breed.whiteLotus"],
  "flower.breed.blueLotus": ENGLISH_TERMS["flower.breed.blueLotus"],
  "flower.breed.primulaEnigma": ENGLISH_TERMS["flower.breed.primulaEnigma"],
};

const flowerShopTerms: Record<FlowerShopTerms, string> = {
  "flowerShop.desired.dreaming": ENGLISH_TERMS["flowerShop.desired.dreaming"],
  "flowerShop.desired.delightful":
    ENGLISH_TERMS["flowerShop.desired.delightful"],
  "flowerShop.desired.wonderful": ENGLISH_TERMS["flowerShop.desired.wonderful"],
  "flowerShop.desired.setMyHeart":
    ENGLISH_TERMS["flowerShop.desired.setMyHeart"],
  "flowerShop.missingPages.alas": ENGLISH_TERMS["flowerShop.missingPages.alas"],
  "flowerShop.missingPages.cantBelieve":
    ENGLISH_TERMS["flowerShop.missingPages.cantBelieve"],
  "flowerShop.missingPages.inABind":
    ENGLISH_TERMS["flowerShop.missingPages.inABind"],
  "flowerShop.missingPages.sadly":
    ENGLISH_TERMS["flowerShop.missingPages.sadly"],
  "flowerShop.noFlowers.noTrade": ENGLISH_TERMS["flowerShop.noFlowers.noTrade"],
  "flowerShop.do.have.trade": ENGLISH_TERMS["flowerShop.do.have.trade"],
  "flowerShop.do.have.trade.one": ENGLISH_TERMS["flowerShop.do.have.trade.one"],
};

const foodDescriptions: Record<FoodDescriptions, string> = {
  // Fire Pit
  "description.pumpkin.soup": "哥布林们喜爱的奶油汤。",
  "description.mashed.potato": "我的生活就是土豆。",
  "description.bumpkin.broth": "营养丰富的肉汤，可以补充你的乡巴佬。",
  "description.boiled.eggs": "煮鸡蛋非常适合早餐。",
  "description.kale.stew": "完美的乡巴佬助推器！",
  "description.mushroom.soup": "温暖你乡巴佬的灵魂。",
  "description.reindeer.carrot": "鲁道夫无法停止吃它们！",
  "description.kale.omelette": "一顿健康的早餐。",
  "description.cabbers.mash": "卷心菜和土豆泥",
  "description.popcorn": "经典的自制脆脆小吃。",
  "description.gumbo": "一锅充满魔力！ 每一勺都是狂欢节游行！",
  "description.rapidRoast": "对于急着赶路的乡巴佬来说……",

  // Kitchen
  "description.roast.veggies": ENGLISH_TERMS["description.roast.veggies"],
  "description.bumpkin.salad": ENGLISH_TERMS["description.bumpkin.salad"],
  "description.goblins.treat": ENGLISH_TERMS["description.goblins.treat"],
  "description.cauliflower.burger":
    ENGLISH_TERMS["description.cauliflower.burger"],
  "description.club.sandwich": ENGLISH_TERMS["description.club.sandwich"],
  "description.mushroom.jacket.potatoes":
    ENGLISH_TERMS["description.mushroom.jacket.potatoes"],
  "description.sunflower.crunch": ENGLISH_TERMS["description.sunflower.crunch"],
  "description.bumpkin.roast": ENGLISH_TERMS["description.bumpkin.roast"],
  "description.goblin.brunch": ENGLISH_TERMS["description.goblin.brunch"],
  "description.fruit.salad": ENGLISH_TERMS["description.fruit.salad"],
  "description.bumpkin.ganoush": ENGLISH_TERMS["description.bumpkin.ganoush"],
  "description.chowder": ENGLISH_TERMS["description.chowder"],
  "description.pancakes": ENGLISH_TERMS["description.pancakes"],
  "description.beetrootBlaze": ENGLISH_TERMS["description.beetrootBlaze"],

  // Bakery
  "description.apple.pie": "乡巴佬 Betty 的著名食谱",
  "description.kale.mushroom.pie": "一份来自 Sapphiro 的传统食谱",
  "description.cornbread": "丰盛的金色农家面包。",
  "description.sunflower.cake": "向日葵蛋糕",
  "description.potato.cake": "土豆蛋糕",
  "description.pumpkin.cake": "南瓜蛋糕",
  "description.carrot.cake": "胡萝卜蛋糕",
  "description.cabbage.cake": "卷心菜蛋糕",
  "description.beetroot.cake": "甜菜蛋糕",
  "description.cauliflower.cake": "花椰菜蛋糕",
  "description.parsnip.cake": "防风草蛋糕",
  "description.radish.cake": "小萝卜蛋糕",
  "description.wheat.cake": "小麦蛋糕",
  "description.honey.cake": "一块美味的蛋糕！",
  "description.eggplant.cake": "甜美的新鲜甜点惊喜。",
  "description.orange.cake": "橘子蛋糕。",
  "description.pirate.cake": "适合海盗主题生日派对。",

  // Deli
  "description.blueberry.jam": "哥布林会为这果酱疯狂",
  "description.fermented.carrots": "有多剩余的胡萝卜吗？",
  "description.sauerkraut": "再也不是无聊的卷心菜了！",
  "description.fancy.fries": "奇妙的薯条",
  "description.fermented.fish": "大胆的美食！每一口都能释放内心的维京战士！",
  "description.fermented.shroomSyrup":
    ENGLISH_TERMS["description.fermented.shroomSyrup"],

  // Smoothie Shack
  "description.apple.juice": ENGLISH_TERMS["description.apple.juice"],
  "description.orange.juice": ENGLISH_TERMS["description.orange.juice"],
  "description.purple.smoothie": ENGLISH_TERMS["description.purple.smoothie"],
  "description.power.smoothie": ENGLISH_TERMS["description.power.smoothie"],
  "description.bumpkin.detox": ENGLISH_TERMS["description.bumpkin.detox"],
  "description.banana.blast": ENGLISH_TERMS["description.banana.blast"],

  // Unused foods
  "description.roasted.cauliflower":
    ENGLISH_TERMS["description.roasted.cauliflower"],
  "description.radish.pie": ENGLISH_TERMS["description.radish.pie"],
  "description.antipasto": ENGLISH_TERMS["description.antipasto"],
  "description.carrotJuice": ENGLISH_TERMS["description.carrotJuice"],
  "description.fishBasket": ENGLISH_TERMS["description.fishBasket"],
  "description.fishBurger": ENGLISH_TERMS["description.fishBurger"],
  "description.fishnChips": ENGLISH_TERMS["description.fishnChips"],
  "description.fishOmelette": ENGLISH_TERMS["description.fishOmelette"],
  "description.friedCalamari": ENGLISH_TERMS["description.friedCalamari"],
  "description.friedTofu": ENGLISH_TERMS["description.friedTofu"],
  "description.grapeJuice": ENGLISH_TERMS["description.grapeJuice"],
  "description.oceansOlive": ENGLISH_TERMS["description.oceansOlive"],
  "description.quickJuice": ENGLISH_TERMS["description.quickJuice"],
  "description.riceBun": ENGLISH_TERMS["description.riceBun"],
  "description.slowJuice": ENGLISH_TERMS["description.slowJuice"],
  "description.steamedRedRice": ENGLISH_TERMS["description.steamedRedRice"],
  "description.sushiRoll": ENGLISH_TERMS["description.sushiRoll"],
  "description.theLot": ENGLISH_TERMS["description.theLot"],
  "description.tofuScramble": ENGLISH_TERMS["description.tofuScramble"],
};

const gameDescriptions: Record<GameDescriptions, string> = {
  // Quest Items
  "description.goblin.key": ENGLISH_TERMS["description.goblin.key"],
  "description.sunflower.key": ENGLISH_TERMS["description.sunflower.key"],
  "description.ancient.goblin.sword":
    ENGLISH_TERMS["description.ancient.goblin.sword"],
  "description.ancient.human.warhammer":
    ENGLISH_TERMS["description.ancient.human.warhammer"],

  // Coupons
  "description.community.coin": ENGLISH_TERMS["description.community.coin"],
  "description.bud.seedling": ENGLISH_TERMS["description.bud.seedling"],
  "description.gold.pass": ENGLISH_TERMS["description.gold.pass"],
  "description.rapid.growth": ENGLISH_TERMS["description.rapid.growth"],
  "description.bud.ticket": ENGLISH_TERMS["description.bud.ticket"],
  "description.potion.ticket": ENGLISH_TERMS["description.potion.ticket"],
  "description.trading.ticket": ENGLISH_TERMS["description.trading.ticket"],
  "description.block.buck": ENGLISH_TERMS["description.block.buck"],
  "description.beta.pass": ENGLISH_TERMS["description.beta.pass"],
  "description.war.bond": ENGLISH_TERMS["description.war.bond"],
  "description.allegiance": ENGLISH_TERMS["description.allegiance"],
  "description.jack.o.lantern": ENGLISH_TERMS["description.jack.o.lantern"],
  "description.golden.crop": ENGLISH_TERMS["description.golden.crop"],
  "description.red.envelope": ENGLISH_TERMS["description.red.envelope"],
  "description.love.letter": ENGLISH_TERMS["description.love.letter"],
  "description.solar.flare.ticket":
    ENGLISH_TERMS["description.solar.flare.ticket"],
  "description.dawn.breaker.ticket":
    ENGLISH_TERMS["description.dawn.breaker.ticket"],
  "description.crow.feather": ENGLISH_TERMS["description.crow.feather"],
  "description.mermaid.scale": ENGLISH_TERMS["description.mermaid.scale"],
  "description.sunflower.supporter":
    ENGLISH_TERMS["description.sunflower.supporter"],
  "description.arcade.coin": ENGLISH_TERMS["description.arcade.coin"],
  "description.farmhand.coupon": ENGLISH_TERMS["description.farmhand.coupon"],
  "description.farmhand": ENGLISH_TERMS["description.farmhand"],
  "description.tulip.bulb": ENGLISH_TERMS["description.tulip.bulb"],
  "description.treasure.key": ENGLISH_TERMS["description.treasure.key"],
  "description.rare.key": ENGLISH_TERMS["description.rare.key"],
  "description.luxury.key": ENGLISH_TERMS["description.luxury.key"],
  "description.prizeTicket": ENGLISH_TERMS["description.prizeTicket"],
  "description.babyPanda": ENGLISH_TERMS["description.babyPanda"],
  "description.baozi": ENGLISH_TERMS["description.baozi"],

  // Easter Items
  "description.egg.basket": "复活节活动",
  "description.blue.egg": "一个蓝色的复活节彩蛋",
  "description.orange.egg": "一个橙色的复活节彩蛋",
  "description.green.egg": "一个绿色的复活节彩蛋",
  "description.yellow.egg": "一个黄色的复活节彩蛋",
  "description.red.egg": "一个红色的复活节彩蛋",
  "description.pink.egg": "一个粉色的复活节彩蛋",
  "description.purple.egg": "一个紫色的复活节彩蛋",
  "description.communityEgg": "哇，你一定非常关心社区！",
  "description.hungryHare":
    "这只贪吃的小兔子跳进了你的农场。2024年复活节的特别活动物品",

  //Home
  "description.homeOwnerPainting": "这个家的主人画像。",
  "description.scroll": ENGLISH_TERMS["description.scroll"],

  // Emblem
  "description.bumpkin.emblem": ENGLISH_TERMS["description.bumpkin.emblem"],
  "description.goblin.emblem": ENGLISH_TERMS["description.goblin.emblem"],
  "description.sunflorian.emblem":
    ENGLISH_TERMS["description.sunflorian.emblem"],
  "description.nightshade.emblem":
    ENGLISH_TERMS["description.nightshade.emblem"],
  "description.faction.mark": ENGLISH_TERMS["description.faction.mark"],
};

const gameTerms: Record<GameTerms, string> = {
  "auction.winner": ENGLISH_TERMS["auction.winner"],
  "bumpkin.level": ENGLISH_TERMS["bumpkin.level"],
  bumpkinBuzz: ENGLISH_TERMS["bumpkinBuzz"],
  dailyLim: ENGLISH_TERMS["dailyLim"],
  "farm.banned": ENGLISH_TERMS["farm.banned"],
  gobSwarm: ENGLISH_TERMS["gobSwarm"],
  "granting.wish": ENGLISH_TERMS["granting.wish"],
  "new.delivery.in": ENGLISH_TERMS["new.delivery.in"],
  "no.sfl": ENGLISH_TERMS["no.sfl"],
  opensea: ENGLISH_TERMS["opensea"],
  polygonscan: ENGLISH_TERMS["polygonscan"],
  potions: ENGLISH_TERMS["potions"],
  "proof.of.humanity": ENGLISH_TERMS["proof.of.humanity"],
  sflDiscord: ENGLISH_TERMS["sflDiscord"],
  "in.progress": ENGLISH_TERMS["in.progress"],
  "compost.complete": ENGLISH_TERMS["compost.complete"],
  "aoe.locked": ENGLISH_TERMS["aoe.locked"],
  sunflowerLandCodex: ENGLISH_TERMS["sunflowerLandCodex"],
  "new.delivery.levelup": ENGLISH_TERMS["new.delivery.levelup"],
  "harvest.number": ENGLISH_TERMS["harvest.number"],
  "level.number": ENGLISH_TERMS["level.number"],
  "visiting.farmId": ENGLISH_TERMS["visiting.farmId"],
  "stock.left": "剩下 {{stock}} 个",
  "stock.inStock": "库存 {{stock}} 个",
};

const garbageCollector: Record<GarbageCollector, string> = {
  "garbageCollector.welcome": "欢迎来到我的小店。",
  "garbageCollector.description": "我是垃圾商人，只要是垃圾，你有的我都买。",
};

const genieLamp: Record<GenieLamp, string> = {
  "genieLamp.ready.wish": "准备好许愿了吗？",
  "genieLamp.cannotWithdraw": "一旦摩擦了神灯，就无法将它从农场上提出。",
};

const getContent: Record<GetContent, string> = {
  "getContent.error": "故障！",
  "getContent.joining": "加入中",
  "getContent.accessGranted": "您现在有权访问 Discord 频道。过去看看吧！",
  "getContent.connectToDiscord": "您必须连接到 Discord 才能加入受限频道。",
  "getContent.connect": "连接",
  "getContent.getAccess": "获取 Discord 受限频道的访问权限",
  "getContent.requires": "需要",
  "getContent.join": "加入",
};

const getInputErrorMessage: Record<GetInputErrorMessage, string> = {
  "getInputErrorMessage.place.bid": "你确定要出这个价吗？",
  "getInputErrorMessage.cannot.bid": "一旦出价，就不能更改了。",
};

const goblin_messages: Record<GOBLIN_MESSAGES, string> = {
  "goblinMessages.msg1": "喂，人类！给我点吃的，不然的话...",
  "goblinMessages.msg2": "我总是饿着，有什么好吃的给我吗？",
  "goblinMessages.msg3": "我不在乎是什么，只要给我些食物！",
  "goblinMessages.msg4": "如果你再不给我东西吃，我可能得开始啃你了。",
  "goblinMessages.msg5": "我听说人类的食物是最好的，给我拿点来！",
  "goblinMessages.msg6": "嘿，你有没有不会让我生病的食物？",
  "goblinMessages.msg7": "吃同样的东西我有点腻了，有没有点不同的？",
  "goblinMessages.msg8": "我想尝尝新鲜的，有什么奇异的东西吗？",
  "goblinMessages.msg9":
    "嘿，有零食可以分享吗？我保证我不会- 嗯- 应该不会把它给偷了。",
  "goblinMessages.msg10": "我不在乎是什么，只要给我食物！",
};

const goblinTrade: Record<GoblinTrade, string> = {
  "goblinTrade.bulk": ENGLISH_TERMS["goblinTrade.bulk"],
  "goblinTrade.conversion": ENGLISH_TERMS["goblinTrade.conversion"],
  "goblinTrade.select": ENGLISH_TERMS["goblinTrade.select"],
  "goblinTrade.hoarding": ENGLISH_TERMS["goblinTrade.hoarding"],
  "goblinTrade.vipRequired": ENGLISH_TERMS["goblinTrade.vipRequired"],
  "goblinTrade.vipDelivery": ENGLISH_TERMS["goblinTrade.vipDelivery"],
};

const goldTooth: Record<GoldTooth, string> = {
  "goldTooth.intro.part1": ENGLISH_TERMS["goldTooth.intro.part1"],
  "goldTooth.intro.part2": ENGLISH_TERMS["goldTooth.intro.part2"],
};

const guideCompost: Record<GuideCompost, string> = {
  "guide.compost.addEggs.speed": "添加鸡蛋以加快生产速度",
  "guide.compost.addEggs": "添加鸡蛋",
  "guide.compost.eggs": "鸡蛋",
  "guide.compost.cropGrowthTime": "-50% 庄稼生长时间",
  "guide.compost.fishingBait": "鱼饵",
  "guide.compost.placeCrops": "将作物放入堆肥机中喂养虫儿",
  "guide.compost.compostCycle":
    "一个堆肥周期可以生产多个肥料，可用来促进你的作物和水果生长",
  "guide.compost.yieldsWorms": "每个堆肥产出的蚯蚓可以用作钓鱼的饵",
  "guide.compost.useEggs": "厌倦了等待？使用鸡蛋来加速堆肥生产",
  "guide.compost.addEggs.confirmation":
    ENGLISH_TERMS["guide.compost.addEggs.confirmation"],
};

const guideTerms: Record<GuideTerms, string> = {
  "guide.intro": "从简朴的开始到专家级的农耕，这份指南将全面指导你！",
  "gathering.guide.one":
    "要想在 Sunflower Land 蓬勃发展，熟练地采集资源非常重要。 首先，为每种资源配备适当的工具。 例如，使用可靠的斧头砍伐树木并收集木材。 要制作新工具，请访问本地工作台并用你的 SFL/资源交换所需的工具。",
  "gathering.guide.two":
    "随着你的进步并收集足够的资源，你将解锁扩展领土的能力。 扩大你的土地在向日葵之地开辟了新的视野。 土地扩张揭示了资源宝库，包括种植庄稼的肥沃土壤、雄伟的树木、珍贵的石头矿藏、珍贵的铁矿脉、闪闪发光的金矿、令人愉悦的果园等等。",
  "gathering.guide.three":
    "资源收集和土地扩张对于农业至关重要。 迎接挑战和奖励，看着你的土地因丰富的资源而蓬勃发展。",

  "crops.guide.one":
    "在 Sunflower Land，庄稼在你通往繁荣之路上扮演着至关重要的角色。通过种植和收获庄稼，你可以赚取向日葵币(SFL)或利用它们在游戏内制作有价值的配方和物品。",
  "crops.guide.two":
    "要种植庄稼，你需要从游戏商店购买相应的种子。每种农作物的生长时间都不同，从向日葵的1分钟到羽衣甘蓝的36小时不等。一旦庄稼完全成熟，你就可以收获它们并获得奖励。",
  "crops.guide.three": ENGLISH_TERMS["crops.guide.three"],
  "building.guide.one": ENGLISH_TERMS["building.guide.one"],
  "building.guide.two": ENGLISH_TERMS["building.guide.two"],
  "cooking.guide.one": ENGLISH_TERMS["cooking.guide.one"],
  "cooking.guide.two": ENGLISH_TERMS["cooking.guide.two"],
  "cooking.guide.three": ENGLISH_TERMS["cooking.guide.three"],
  "cooking.guide.four": ENGLISH_TERMS["cooking.guide.four"],
  "cooking.guide.five": ENGLISH_TERMS["cooking.guide.five"],

  "animals.guide.one": ENGLISH_TERMS["animals.guide.one"],
  "animals.guide.two": ENGLISH_TERMS["animals.guide.two"],
  "animals.guide.three": ENGLISH_TERMS["animals.guide.three"],
  "crafting.guide.one": ENGLISH_TERMS["crafting.guide.one"],
  "crafting.guide.two": ENGLISH_TERMS["crafting.guide.two"],
  "crafting.guide.three": ENGLISH_TERMS["crafting.guide.three"],
  "crafting.guide.four": ENGLISH_TERMS["crafting.guide.four"],
  "deliveries.guide.one": ENGLISH_TERMS["deliveries.guide.one"],
  "deliveries.guide.two": ENGLISH_TERMS["deliveries.guide.two"],

  "scavenger.guide.one": ENGLISH_TERMS["scavenger.guide.one"],
  "scavenger.guide.two": ENGLISH_TERMS["scavenger.guide.two"],
  "fruit.guide.one": ENGLISH_TERMS["fruit.guide.one"],
  "fruit.guide.two": ENGLISH_TERMS["fruit.guide.two"],
  "fruit.guide.three": ENGLISH_TERMS["fruit.guide.three"],
  "seasons.guide.one": ENGLISH_TERMS["seasons.guide.one"],
  "seasons.guide.two": ENGLISH_TERMS["seasons.guide.two"],
  "pete.teaser.one": ENGLISH_TERMS["pete.teaser.one"],
  "pete.teaser.three": ENGLISH_TERMS["pete.teaser.three"],
  "pete.teaser.four": ENGLISH_TERMS["pete.teaser.four"],
  "pete.teaser.five": ENGLISH_TERMS["pete.teaser.five"],
  "pete.teaser.six": ENGLISH_TERMS["pete.teaser.six"],
  "pete.teaser.seven": ENGLISH_TERMS["pete.teaser.seven"],
  "pete.teaser.eight": ENGLISH_TERMS["pete.teaser.eight"],
  "deliveries.intro": ENGLISH_TERMS["deliveries.intro"],
  "deliveries.new": ENGLISH_TERMS["deliveries.new"],
  "chores.intro": ENGLISH_TERMS["chores.intro"],
};

const halveningCountdown: Record<HalveningCountdown, string> = {
  "halveningCountdown.approaching":
    ENGLISH_TERMS["halveningCountdown.approaching"],
  "halveningCountdown.description":
    ENGLISH_TERMS["halveningCountdown.description"],
  "halveningCountdown.preparation":
    ENGLISH_TERMS["halveningCountdown.preparation"],
  "halveningCountdown.title": ENGLISH_TERMS["halveningCountdown.title"],
};

const harvestBeeHive: Record<HarvestBeeHive, string> = {
  "harvestBeeHive.notPlaced": ENGLISH_TERMS["harvestBeeHive.notPlaced"],
  "harvestBeeHive.noHoney": ENGLISH_TERMS["harvestBeeHive.noHoney"],
};

const harvestflower: Record<Harvestflower, string> = {
  "harvestflower.noFlowerBed": ENGLISH_TERMS["harvestflower.noFlowerBed"],
  "harvestflower.noFlower": ENGLISH_TERMS["harvestflower.noFlower"],
  "harvestflower.notReady": ENGLISH_TERMS["harvestflower.notReady"],
  "harvestflower.alr.plant": ENGLISH_TERMS["harvestflower.alr.plant"],
};

const hayseedHankPlaza: Record<HayseedHankPlaza, string> = {
  "hayseedHankPlaza.cannotCompleteChore":
    ENGLISH_TERMS["hayseedHankPlaza.cannotCompleteChore"],
  "hayseedHankPlaza.skipChore": ENGLISH_TERMS["hayseedHankPlaza.skipChore"],
  "hayseedHankPlaza.canSkipIn": ENGLISH_TERMS["hayseedHankPlaza.canSkipIn"],
  "hayseedHankPlaza.wellDone": ENGLISH_TERMS["hayseedHankPlaza.wellDone"],
  "hayseedHankPlaza.lendAHand": ENGLISH_TERMS["hayseedHankPlaza.lendAHand"],
};

const hayseedHankV2: Record<HayseedHankV2, string> = {
  "hayseedHankv2.dialog1": ENGLISH_TERMS["hayseedHankv2.dialog1"],
  "hayseedHankv2.dialog2": ENGLISH_TERMS["hayseedHankv2.dialog2"],
  "hayseedHankv2.action": ENGLISH_TERMS["hayseedHankv2.action"],
  "hayseedHankv2.title": ENGLISH_TERMS["hayseedHankv2.title"],
  "hayseedHankv2.newChoresAvailable":
    ENGLISH_TERMS["hayseedHankv2.newChoresAvailable"],
  "hayseedHankv2.skipChores": ENGLISH_TERMS["hayseedHankv2.skipChores"],
  "hayseedHankv2.greeting": ENGLISH_TERMS["hayseedHankv2.greeting"],
};

const heliosSunflower: Record<HeliosSunflower, string> = {
  "heliosSunflower.title": ENGLISH_TERMS["heliosSunflower.title"],
  "heliosSunflower.description": ENGLISH_TERMS["heliosSunflower.description"],
  "confirmation.craft": ENGLISH_TERMS["confirmation.craft"],
};

const helper: Record<Helper, string> = {
  "helper.highScore1": "不可思议！你正在掌握药水制作的艺术！",
  "helper.highScore2": "壮观！你的技能让植物焕发生机！",
  "helper.highScore3": "惊人！植物对你的专业技能感到敬畏！",
  "helper.midScore1": "差不多了！你的药水对植物产生了积极的影响！",
  "helper.midScore2": "继续加油！植物开始在你巧妙的调配下茁壮成长！",
  "helper.midScore3": "干得不错！你的药水开始对植物施展其魔法！",
  "helper.lowScore1": "接近了。植物显示出了幸福的迹象。",
  "helper.lowScore2": "努力可嘉。你的药水给植物带来了一丝快乐。",
  "helper.lowScore3": "还不错。你的技能开始给植物留下了良好的印象。",
  "helper.veryLowScore1": "继续尝试。植物认可了你的决心。",
  "helper.veryLowScore2": "你正在接近目标。植物看到了你的进步。",
  "helper.veryLowScore3": "还没到位，但植物感受到了你的承诺。",
  "helper.noScore1": "哦不！植物讨厌你药水中的某些东西！再试一次。",
  "helper.noScore2": "哎呀！植物对你药水中的某些东西产生了反感！再试一次。",
  "helper.noScore3":
    "呃哦！你药水中的某些东西对植物来说是彻底的失败！再试一次。",
};

const henHouseTerms: Record<HenHouseTerms, string> = {
  "henHouse.chickens": ENGLISH_TERMS["henHouse.chickens"],
  "henHouse.text.one": ENGLISH_TERMS["henHouse.text.one"],
  "henHouse.text.two": ENGLISH_TERMS["henHouse.text.two"],
  "henHouse.text.three": ENGLISH_TERMS["henHouse.text.three"],
  "henHouse.text.four": ENGLISH_TERMS["henHouse.text.four"],
  "henHouse.text.five": ENGLISH_TERMS["henHouse.text.five"],
  "henHouse.text.six": ENGLISH_TERMS["henHouse.text.six"],
};

const howToFarm: Record<HowToFarm, string> = {
  "howToFarm.title": ENGLISH_TERMS["howToFarm.title"],
  "howToFarm.stepOne": ENGLISH_TERMS["howToFarm.stepOne"],
  "howToFarm.stepTwo": ENGLISH_TERMS["howToFarm.stepTwo"],
  "howToFarm.stepThree": ENGLISH_TERMS["howToFarm.stepThree"],
  "howToFarm.stepFour": ENGLISH_TERMS["howToFarm.stepFour"],
  "howToFarm.stepFive": ENGLISH_TERMS["howToFarm.stepFive"],
};

const howToSync: Record<HowToSync, string> = {
  "howToSync.title": ENGLISH_TERMS["howToSync.title"],
  "howToSync.description": ENGLISH_TERMS["howToSync.description"],
  "howToSync.stepOne": ENGLISH_TERMS["howToSync.stepOne"],
  "howToSync.stepTwo": ENGLISH_TERMS["howToSync.stepTwo"],
};

const howToUpgrade: Record<HowToUpgrade, string> = {
  "howToUpgrade.title": ENGLISH_TERMS["howToUpgrade.title"],
  "howToUpgrade.stepOne": ENGLISH_TERMS["howToUpgrade.stepOne"],
  "howToUpgrade.stepTwo": ENGLISH_TERMS["howToUpgrade.stepTwo"],
  "howToUpgrade.stepThree": ENGLISH_TERMS["howToUpgrade.stepThree"],
  "howToUpgrade.stepFour": ENGLISH_TERMS["howToUpgrade.stepFour"],
};

const interactableModals: Record<InteractableModals, string> = {
  "interactableModals.returnhome.message":
    ENGLISH_TERMS["interactableModals.returnhome.message"],
  "interactableModals.fatChicken.message":
    ENGLISH_TERMS["interactableModals.fatChicken.message"],
  "interactableModals.lazyBud.message":
    ENGLISH_TERMS["interactableModals.lazyBud.message"],
  "interactableModals.bud.message":
    ENGLISH_TERMS["interactableModals.bud.message"],
  "interactableModals.walrus.message":
    ENGLISH_TERMS["interactableModals.walrus.message"],
  "interactableModals.plazaBlueBook.message1":
    ENGLISH_TERMS["interactableModals.plazaBlueBook.message1"],
  "interactableModals.plazaBlueBook.message2":
    ENGLISH_TERMS["interactableModals.plazaBlueBook.message2"],
  "interactableModals.plazaOrangeBook.message1":
    ENGLISH_TERMS["interactableModals.plazaOrangeBook.message1"],
  "interactableModals.plazaOrangeBook.message2":
    ENGLISH_TERMS["interactableModals.plazaOrangeBook.message2"],
  "interactableModals.beachGreenBook.message1":
    ENGLISH_TERMS["interactableModals.beachGreenBook.message1"],
  "interactableModals.beachGreenBook.message2":
    ENGLISH_TERMS["interactableModals.beachGreenBook.message2"],
  "interactableModals.beachBlueBook.message1":
    ENGLISH_TERMS["interactableModals.beachBlueBook.message1"],
  "interactableModals.beachBlueBook.message2":
    ENGLISH_TERMS["interactableModals.beachBlueBook.message2"],
  "interactableModals.beachBlueBook.message3":
    ENGLISH_TERMS["interactableModals.beachBlueBook.message3"],
  "interactableModals.beachOrangeBook.message1":
    ENGLISH_TERMS["interactableModals.beachOrangeBook.message1"],
  "interactableModals.beachOrangeBook.message2":
    ENGLISH_TERMS["interactableModals.beachOrangeBook.message2"],
  "interactableModals.plazaGreenBook.message1":
    ENGLISH_TERMS["interactableModals.plazaGreenBook.message1"],
  "interactableModals.plazaGreenBook.message2":
    ENGLISH_TERMS["interactableModals.plazaGreenBook.message2"],
  "interactableModals.fanArt.winner":
    ENGLISH_TERMS["interactableModals.fanArt.winner"],
  "interactableModals.fanArt1.message":
    ENGLISH_TERMS["interactableModals.fanArt1.message"],
  "interactableModals.fanArt2.message":
    ENGLISH_TERMS["interactableModals.fanArt2.message"],
  "interactableModals.fanArt2.linkLabel":
    ENGLISH_TERMS["interactableModals.fanArt2.linkLabel"],
  "interactableModals.fanArt3.message":
    ENGLISH_TERMS["interactableModals.fanArt3.message"],
  "interactableModals.clubhouseReward.message1":
    ENGLISH_TERMS["interactableModals.clubhouseReward.message1"],
  "interactableModals.clubhouseReward.message2":
    ENGLISH_TERMS["interactableModals.clubhouseReward.message2"],
  "interactableModals.plazaStatue.message":
    ENGLISH_TERMS["interactableModals.plazaStatue.message"],
  "interactableModals.dawnBook1.message1":
    ENGLISH_TERMS["interactableModals.dawnBook1.message1"],
  "interactableModals.dawnBook1.message2":
    ENGLISH_TERMS["interactableModals.dawnBook1.message2"],
  "interactableModals.dawnBook1.message3":
    ENGLISH_TERMS["interactableModals.dawnBook1.message3"],
  "interactableModals.dawnBook2.message1":
    ENGLISH_TERMS["interactableModals.dawnBook2.message1"],
  "interactableModals.dawnBook2.message2":
    ENGLISH_TERMS["interactableModals.dawnBook2.message2"],
  "interactableModals.dawnBook3.message1":
    ENGLISH_TERMS["interactableModals.dawnBook3.message1"],
  "interactableModals.dawnBook3.message2":
    ENGLISH_TERMS["interactableModals.dawnBook3.message2"],
  "interactableModals.dawnBook3.message3":
    ENGLISH_TERMS["interactableModals.dawnBook3.message3"],
  "interactableModals.dawnBook4.message1":
    ENGLISH_TERMS["interactableModals.dawnBook4.message1"],
  "interactableModals.dawnBook4.message2":
    ENGLISH_TERMS["interactableModals.dawnBook4.message2"],
  "interactableModals.dawnBook4.message3":
    ENGLISH_TERMS["interactableModals.dawnBook4.message3"],
  "interactableModals.timmyHome.message":
    ENGLISH_TERMS["interactableModals.timmyHome.message"],
  "interactableModals.windmill.message":
    ENGLISH_TERMS["interactableModals.windmill.message"],
  "interactableModals.igorHome.message":
    ENGLISH_TERMS["interactableModals.igorHome.message"],
  "interactableModals.potionHouse.message1":
    ENGLISH_TERMS["interactableModals.potionHouse.message1"],
  "interactableModals.potionHouse.message2":
    ENGLISH_TERMS["interactableModals.potionHouse.message2"],
  "interactableModals.guildHouse.message":
    ENGLISH_TERMS["interactableModals.guildHouse.message"],
  "interactableModals.guildHouse.budsCollection":
    ENGLISH_TERMS["interactableModals.guildHouse.budsCollection"],
  "interactableModals.bettyHome.message":
    ENGLISH_TERMS["interactableModals.bettyHome.message"],
  "interactableModals.bertHome.message":
    ENGLISH_TERMS["interactableModals.bertHome.message"],
  "interactableModals.beach.message1":
    ENGLISH_TERMS["interactableModals.beach.message1"],
  "interactableModals.beach.message2":
    ENGLISH_TERMS["interactableModals.beach.message2"],
  "interactableModals.castle.message":
    ENGLISH_TERMS["interactableModals.castle.message"],
  "interactableModals.woodlands.message":
    ENGLISH_TERMS["interactableModals.woodlands.message"],
  "interactableModals.port.message":
    ENGLISH_TERMS["interactableModals.port.message"],
};

const introPage: Record<IntroPage, string> = {
  "introPage.welcome": ENGLISH_TERMS["introPage.welcome"],
  "introPage.description": ENGLISH_TERMS["introPage.description"],
  "introPage.mission": ENGLISH_TERMS["introPage.mission"],
  "introPage.tip": ENGLISH_TERMS["introPage.tip"],
  "introPage.chaosPotion": ENGLISH_TERMS["introPage.chaosPotion"],
  "introPage.playButton": ENGLISH_TERMS["introPage.playButton"],
};

const islandName: Record<IslandName, string> = {
  "island.home": ENGLISH_TERMS["island.home"],
  "island.pumpkin.plaza": ENGLISH_TERMS["island.pumpkin.plaza"],
  "island.beach": ENGLISH_TERMS["island.beach"],
  "island.kingdom": ENGLISH_TERMS["island.kingdom"],
  "island.woodlands": ENGLISH_TERMS["island.woodlands"],
  "island.helios": ENGLISH_TERMS["island.helios"],
  "island.goblin.retreat": ENGLISH_TERMS["island.goblin.retreat"],
};

const islandNotFound: Record<IslandNotFound, string> = {
  "islandNotFound.message": ENGLISH_TERMS["islandNotFound.message"],
  "islandNotFound.takeMeHome": ENGLISH_TERMS["islandNotFound.takeMeHome"],
};

const islandupgrade: Record<Islandupgrade, string> = {
  "islandupgrade.confirmUpgrade": ENGLISH_TERMS["islandupgrade.confirmUpgrade"],
  "islandupgrade.warning": ENGLISH_TERMS["islandupgrade.warning"],
  "islandupgrade.upgradeIsland": "升级岛",
  "islandupgrade.newOpportunities":
    "“探索一个充满异国情调的岛屿，发现新的资源，帮助你发展你的农场。令人兴奋的机会在等着你！”",
  "islandupgrade.confirmation":
    "你想升级吗？ 你将从一座小岛上开始，并携带所有物品。",
  "islandupgrade.locked": "锁定",
  "islandupgrade.exploring": "探索",
  "islandupgrade.welcomePetalParadise": "欢迎来到 Petal Paradise！",
  "islandupgrade.itemsReturned": "“你的物品已安全返回你的库存。”",
  "islandupgrade.notReadyExpandMore":
    "你尚未准备好。请再展开 {{remainingExpansions}} 次。",
  "islandupgrade.exoticResourcesDescription":
    "Sunflower Land 的这一地区以其奇异的资源而闻名。扩大你的土地，发现水果、鲜花、蜂巢和稀有矿物！",
  "islandupgrade.welcomeDesertIsland":
    ENGLISH_TERMS["islandupgrade.welcomeDesertIsland"],
  "islandupgrade.desertResourcesDescription":
    ENGLISH_TERMS["islandupgrade.desertResourcesDescription"],
  "islandupgrade.requiredIsland": ENGLISH_TERMS["islandupgrade.requiredIsland"],
  "islandupgrade.otherIsland": ENGLISH_TERMS["islandupgrade.otherIsland"],
};

const landscapeTerms: Record<LandscapeTerms, string> = {
  "landscape.intro.one": ENGLISH_TERMS["landscape.intro.one"],
  "landscape.intro.two": ENGLISH_TERMS["landscape.intro.two"],
  "landscape.intro.three": ENGLISH_TERMS["landscape.intro.three"],
  "landscape.intro.four": ENGLISH_TERMS["landscape.intro.four"],
  "landscape.expansion.one": ENGLISH_TERMS["landscape.expansion.one"],
  "landscape.expansion.two": ENGLISH_TERMS["landscape.expansion.two"],
  "landscape.timerPopover": ENGLISH_TERMS["landscape.timerPopover"],
  "landscape.dragMe": ENGLISH_TERMS["landscape.dragMe"],
  "landscape.expansion.date": ENGLISH_TERMS["landscape.expansion.date"],
  "landscape.great.work": ENGLISH_TERMS["landscape.great.work"],
};

const letsGo: Record<LetsGo, string> = {
  "letsGo.title": ENGLISH_TERMS["letsGo.title"],
  "letsGo.description": ENGLISH_TERMS["letsGo.description"],
  "letsGo.readMore": ENGLISH_TERMS["letsGo.readMore"],
  "letsGo.officialDocs": ENGLISH_TERMS["letsGo.officialDocs"],
};

const levelUpMessages: Record<LevelUpMessages, string> = {
  "levelUp.2": "耶哈，你达到了2级！庄稼们都在颤抖。",
  "levelUp.3": "恭喜达到3级！你长得像杂草一样快...",
  "levelUp.4": "恭喜达到4级！你已经超越了新手的水平。",
  "levelUp.5":
    "5级了，还活着！你的辛勤工作得到了回报……或者我们应该说'干草工作'？。",
  "levelUp.6": "哇，已经6级了？你一定和牛一样强壮。或者至少你的犁是。",
  "levelUp.7": "恭喜达到7级！你的农场棒极了。",
  "levelUp.8": "8级了，干得好！你正在播下成功的种子。",
  "levelUp.9": "九级了，高手！你的收获和技能一样迅速成长。",
  "levelUp.10": "10级，双位数了！你的农场看起来太棒了，连鸡都印象深刻。",
  "levelUp.11": "11级，你正在使（水）雨成金！",
  "levelUp.12": "恭喜达到12级！你的农场真的开始培育出一些特色来了。",
  "levelUp.13": "幸运的13级！你真的掌握了农事。",
  "levelUp.14": "14级，你取得的进步真是令人称奇！",
  "levelUp.15": "15级，茁壮成长！你的农场看起来比以往任何时候都要好。",
  "levelUp.16": "恭喜达到16级！你的农艺技能真的扎根了。",
  "levelUp.17": "17级，你正在收获你所播下的（看起来很不错！）。",
  "levelUp.18": "18级，充满潜力的萌芽！",
  "levelUp.19": "恭喜达到19级！你的农场和技能一样快速成长。",
  "levelUp.20": "20级，你是佼佼者！",
  "levelUp.21": "21级，像专业人士一样收割！",
  "levelUp.22": "恭喜达到22级！你的农场正在取得成功。",
  "levelUp.23": "23级，你的技能真的开始绽放了！",
  "levelUp.24": "在24级，你真的开花结果了！",
  "levelUp.25": "四分之一世纪的标记！你在阳光下尽情制作干草。",
  "levelUp.26": "恭喜达到26级！你真的在农事上做得很好。",
  "levelUp.27": "27级，你真的开始在田野中脱颖而出了！",
  "levelUp.28": "在28级，你真的提高了标准！",
  "levelUp.29": "恭喜达到29级！你真的培育出了一些严肃的技能。",
  "levelUp.30": "30级，你现在是真正的农民了！",
  "levelUp.31": "31级，依然强劲成长！",
  "levelUp.32": "恭喜达到32级！你的农场盛开了。",
  "levelUp.33": "33级，你的农艺技能真的起飞了！",
  "levelUp.34": "在34级，你真的在生长！",
  "levelUp.35": "35级，你是农业的拖拉机拖车！",
  "levelUp.36": "恭喜达到36级！你的农场真的开始获得一些成功。",
  "levelUp.37": "37级，你的技能真的开始显现了！",
  "levelUp.38": "在38级，你真的在播下成功的种子！",
  "levelUp.39": "恭喜达到39级！你的农场真的开始成熟。",
  "levelUp.40": "40级，你是收割的英雄！",
  "levelUp.41": "四十一级，依然强劲成长！",
  "levelUp.42": "恭喜达到42级！你的农场开始收获奖励。",
  "levelUp.43": "43级，你真的在培养一些严肃的技能。",
  "levelUp.44": "在44级，你真的在收获成功！",
  "levelUp.45": "45级，你是真正的收割大师！",
  "levelUp.46": "恭喜达到46级！你的农业技能真的开始结出果实。",
  "levelUp.47": "47级，你真的在成为一个农业传奇。",
  "levelUp.48": "在48级，你真的在茁壮成长！",
  "levelUp.49": "恭喜达到49级！你真的开始收获你辛勤工作的回报。",
  "levelUp.50": "到达100的一半了！你现在是真正的农业专家。",
  "levelUp.51": "五十一级，依然强劲成长！",
  "levelUp.52": "恭喜达到52级！你的农场是一件真正的艺术品。",
  "levelUp.53": "53级，你的技能真的开始生根发芽。",
  "levelUp.54": "在54级，你真的在收获幸福！",
  "levelUp.55": "55级，你是一个不容小觑的农业力量。",
  "levelUp.56": "恭喜达到56级！你的农场真的开始绽放。",
  "levelUp.57": "57级，你真的开始培育一些严肃的技能。",
  "levelUp.58": "在58级，你真的在播下成功的种子！",
  "levelUp.59": "恭喜达到59级！你的农场是佼佼者。",
  "levelUp.60": "60级，你是真正的农业超级明星！",
};

const loser: Record<Loser, string> = {
  "loser.unsuccess": ENGLISH_TERMS["loser.unsuccess"],
  "loser.longer": ENGLISH_TERMS["loser.longer"],
  "loser.refund.one": ENGLISH_TERMS["loser.refund.one"],
};

const lostSunflorian: Record<LostSunflorian, string> = {
  "lostSunflorian.line1": ENGLISH_TERMS["lostSunflorian.line1"],
  "lostSunflorian.line2": ENGLISH_TERMS["lostSunflorian.line2"],
  "lostSunflorian.line3": ENGLISH_TERMS["lostSunflorian.line3"],
};

const megaStore: Record<MegaStore, string> = {
  "megaStore.message": ENGLISH_TERMS["megaStore.message"],
  "megaStore.month.sale": ENGLISH_TERMS["megaStore.month.sale"],
  "megaStore.wearable": ENGLISH_TERMS["megaStore.wearable"],
  "megaStore.collectible": ENGLISH_TERMS["megaStore.collectible"],
  "megaStore.timeRemaining": "剩下{{timeRemaining}}！",
};

const milestoneMessages: Record<MilestoneMessages, string> = {
  "milestone.noviceAngler": ENGLISH_TERMS["milestone.noviceAngler"],
  "milestone.advancedAngler": ENGLISH_TERMS["milestone.advancedAngler"],
  "milestone.expertAngler": ENGLISH_TERMS["milestone.expertAngler"],
  "milestone.fishEncyclopedia": ENGLISH_TERMS["milestone.fishEncyclopedia"],
  "milestone.masterAngler": ENGLISH_TERMS["milestone.masterAngler"],
  "milestone.marineMarvelMaster": ENGLISH_TERMS["milestone.marineMarvelMaster"],
  "milestone.deepSeaDiver": ENGLISH_TERMS["milestone.deepSeaDiver"],
  "milestone.sunpetalSavant": ENGLISH_TERMS["milestone.sunpetalSavant"],
  "milestone.bloomBigShot": ENGLISH_TERMS["milestone.bloomBigShot"],
  "milestone.lilyLuminary": ENGLISH_TERMS["milestone.lilyLuminary"],
};

const modalDescription: Record<ModalDescription, string> = {
  "modalDescription.friend": ENGLISH_TERMS["modalDescription.friend"],
  "modalDescription.love.fruit": ENGLISH_TERMS["modalDescription.love.fruit"],
  "modalDescription.gift": ENGLISH_TERMS["modalDescription.gift"],
  "modalDescription.limited.abilities":
    ENGLISH_TERMS["modalDescription.limited.abilities"],
  "modalDescription.trail": ENGLISH_TERMS["modalDescription.trail"],
};

const nftminting: Record<NFTMinting, string> = {
  "nftminting.mintAccountNFT": ENGLISH_TERMS["nftminting.mintAccountNFT"],
  "nftminting.mintingYourNFT": ENGLISH_TERMS["nftminting.mintingYourNFT"],
  "nftminting.almostThere": ENGLISH_TERMS["nftminting.almostThere"],
};

const noaccount: Record<Noaccount, string> = {
  "noaccount.newFarmer": "新农民",
  "noaccount.addPromoCode": "添加促销代码？",
  "noaccount.alreadyHaveNFTFarm": "已经有农场了？",
  "noaccount.createFarm": "创建农场",
  "noaccount.noFarmNFTs": ENGLISH_TERMS["noaccount.noFarmNFTs"],
  "noaccount.createNewFarm": ENGLISH_TERMS["noaccount.createNewFarm"],
  "noaccount.selectNFTID": ENGLISH_TERMS["noaccount.selectNFTID"],
  "noaccount.welcomeMessage": "欢迎来到 Sunflower Land！ 看来你还没有农场。",
  "noaccount.promoCodeLabel": ENGLISH_TERMS["noaccount.promoCodeLabel"],
  "noaccount.haveFarm": ENGLISH_TERMS["noaccount.haveFarm"],
  "noaccount.letsGo": ENGLISH_TERMS["noaccount.letsGo"],
};

const noBumpkin: Record<NoBumpkin, string> = {
  "noBumpkin.readyToFarm": ENGLISH_TERMS["noBumpkin.readyToFarm"],
  "noBumpkin.play": ENGLISH_TERMS["noBumpkin.play"],
  "noBumpkin.missingBumpkin": ENGLISH_TERMS["noBumpkin.missingBumpkin"],
  "noBumpkin.bumpkinNFT": ENGLISH_TERMS["noBumpkin.bumpkinNFT"],
  "noBumpkin.bumpkinHelp": ENGLISH_TERMS["noBumpkin.bumpkinHelp"],
  "noBumpkin.mintBumpkin": ENGLISH_TERMS["noBumpkin.mintBumpkin"],
  "noBumpkin.allBumpkins": ENGLISH_TERMS["noBumpkin.allBumpkins"],
  "noBumpkin.chooseBumpkin": ENGLISH_TERMS["noBumpkin.chooseBumpkin"],
  "noBumpkin.deposit": ENGLISH_TERMS["noBumpkin.deposit"],
  "noBumpkin.advancedIsland": ENGLISH_TERMS["noBumpkin.advancedIsland"],
  "dequipper.noBumpkins": ENGLISH_TERMS["dequipper.noBumpkins"],
  "dequipper.missingBumpkins": ENGLISH_TERMS["dequipper.missingBumpkins"],
  "dequipper.intro": ENGLISH_TERMS["dequipper.intro"],
  "dequipper.success": ENGLISH_TERMS["dequipper.success"],
  "dequipper.dequip": "解除装备",
  "dequipper.warning": ENGLISH_TERMS["dequipper.warning"],
  "dequipper.nude": ENGLISH_TERMS["dequipper.nude"],
  "noBumpkin.nude": ENGLISH_TERMS["noBumpkin.nude"],
};

const notOnDiscordServer: Record<NotOnDiscordServer, string> = {
  "notOnDiscordServer.intro": ENGLISH_TERMS["notOnDiscordServer.intro"],
  "notOnDiscordServer.joinDiscord":
    ENGLISH_TERMS["notOnDiscordServer.joinDiscord"],
  "notOnDiscordServer.discordServer":
    ENGLISH_TERMS["notOnDiscordServer.discordServer"],
  "notOnDiscordServer.completeVerification":
    ENGLISH_TERMS["notOnDiscordServer.completeVerification"],
  "notOnDiscordServer.acceptRules":
    ENGLISH_TERMS["notOnDiscordServer.acceptRules"],
};

const noTownCenter: Record<NoTownCenter, string> = {
  "noTownCenter.reward": ENGLISH_TERMS["noTownCenter.reward"],
  "noTownCenter.news": ENGLISH_TERMS["noTownCenter.news"],
  "noTownCenter.townCenterPlacement":
    ENGLISH_TERMS["noTownCenter.townCenterPlacement"],
};

const npc_message: Record<NPC_MESSAGE, string> = {
  // Betty
  "npcMessages.betty.msg1": "哦，我迫不及待想要得到一些新鲜的庄稼！",
  "npcMessages.betty.msg2": "我很兴奋尝试一些新庄稼，你有什么给我？",
  "npcMessages.betty.msg3": "我整天都在等待机会收获一些美味的水果！",
  "npcMessages.betty.msg4": "我想知道今天有哪些庄稼可以收获。",
  "npcMessages.betty.msg5":
    "我迫不及待想尝尝我辛勤劳动的果实，你有什么样的庄稼啊？",
  "npcMessages.betty.msg6":
    "我对农业有着真正的热情，我总是在寻找种植新奇有趣的庄稼。",
  "npcMessages.betty.msg7":
    "没有什么比收获一大批庄稼的感觉更好的了，这就是农业的全部意义！",
  // Blacksmith
  "npcMessages.blacksmith.msg1": "为了我的新创造，我正缺少一些材料，你有货吗？",
  "npcMessages.blacksmith.msg2": "我正想囤点原料，手头有什么好货卖吗？",
  "npcMessages.blacksmith.msg3": "我得弄点打造材料，你那有什么能派上用场的吗？",
  "npcMessages.blacksmith.msg4": "你有没有什么稀世珍宝或独一无二的材料啊？",
  "npcMessages.blacksmith.msg5": "我对那些上等的材料很感兴趣，你能提供什么？",
  "npcMessages.blacksmith.msg6": "我正为下一件作品搜寻材料，你那有什么好东西？",
  "npcMessages.blacksmith.msg7":
    "我正在市场上寻找原材料，你这有什么是能出售的吗？",
  // Pumpkin' pete
  "npcMessages.pumpkinpete.msg1": ENGLISH_TERMS["npcMessages.pumpkinpete.msg1"],
  "npcMessages.pumpkinpete.msg2": ENGLISH_TERMS["npcMessages.pumpkinpete.msg2"],
  "npcMessages.pumpkinpete.msg3": ENGLISH_TERMS["npcMessages.pumpkinpete.msg3"],
  "npcMessages.pumpkinpete.msg4": ENGLISH_TERMS["npcMessages.pumpkinpete.msg4"],
  "npcMessages.pumpkinpete.msg5": ENGLISH_TERMS["npcMessages.pumpkinpete.msg5"],
  "npcMessages.pumpkinpete.msg6": ENGLISH_TERMS["npcMessages.pumpkinpete.msg6"],
  "npcMessages.pumpkinpete.msg7": ENGLISH_TERMS["npcMessages.pumpkinpete.msg7"],
  // Cornwell
  "npcMessages.cornwell.msg1": ENGLISH_TERMS["npcMessages.cornwell.msg1"],
  "npcMessages.cornwell.msg2": ENGLISH_TERMS["npcMessages.cornwell.msg2"],
  "npcMessages.cornwell.msg3": ENGLISH_TERMS["npcMessages.cornwell.msg3"],
  "npcMessages.cornwell.msg4": ENGLISH_TERMS["npcMessages.cornwell.msg4"],
  "npcMessages.cornwell.msg5": ENGLISH_TERMS["npcMessages.cornwell.msg5"],
  "npcMessages.cornwell.msg6": ENGLISH_TERMS["npcMessages.cornwell.msg6"],
  "npcMessages.cornwell.msg7": ENGLISH_TERMS["npcMessages.cornwell.msg7"],
  // Raven
  "npcMessages.raven.msg1": ENGLISH_TERMS["npcMessages.raven.msg1"],
  "npcMessages.raven.msg2": ENGLISH_TERMS["npcMessages.raven.msg2"],
  "npcMessages.raven.msg3": ENGLISH_TERMS["npcMessages.raven.msg3"],
  "npcMessages.raven.msg4": ENGLISH_TERMS["npcMessages.raven.msg4"],
  "npcMessages.raven.msg5": ENGLISH_TERMS["npcMessages.raven.msg5"],
  "npcMessages.raven.msg6": ENGLISH_TERMS["npcMessages.raven.msg6"],
  "npcMessages.raven.msg7": ENGLISH_TERMS["npcMessages.raven.msg7"],
  // Bert
  "npcMessages.bert.msg1": ENGLISH_TERMS["npcMessages.bert.msg1"],
  "npcMessages.bert.msg2": ENGLISH_TERMS["npcMessages.bert.msg2"],
  "npcMessages.bert.msg3": ENGLISH_TERMS["npcMessages.bert.msg3"],
  "npcMessages.bert.msg4": ENGLISH_TERMS["npcMessages.bert.msg4"],
  "npcMessages.bert.msg5": ENGLISH_TERMS["npcMessages.bert.msg5"],
  "npcMessages.bert.msg6": ENGLISH_TERMS["npcMessages.bert.msg6"],
  "npcMessages.bert.msg7": ENGLISH_TERMS["npcMessages.bert.msg7"],
  // Timmy
  "npcMessages.timmy.msg1": ENGLISH_TERMS["npcMessages.timmy.msg1"],
  "npcMessages.timmy.msg2": ENGLISH_TERMS["npcMessages.timmy.msg2"],
  "npcMessages.timmy.msg3": ENGLISH_TERMS["npcMessages.timmy.msg3"],
  "npcMessages.timmy.msg4": ENGLISH_TERMS["npcMessages.timmy.msg4"],
  "npcMessages.timmy.msg5": ENGLISH_TERMS["npcMessages.timmy.msg5"],
  "npcMessages.timmy.msg6": ENGLISH_TERMS["npcMessages.timmy.msg6"],
  "npcMessages.timmy.msg7": ENGLISH_TERMS["npcMessages.timmy.msg7"],
  // Tywin
  "npcMessages.tywin.msg1": ENGLISH_TERMS["npcMessages.tywin.msg1"],
  "npcMessages.tywin.msg2": ENGLISH_TERMS["npcMessages.tywin.msg2"],
  "npcMessages.tywin.msg3": ENGLISH_TERMS["npcMessages.tywin.msg3"],
  "npcMessages.tywin.msg4": ENGLISH_TERMS["npcMessages.tywin.msg4"],
  "npcMessages.tywin.msg5": ENGLISH_TERMS["npcMessages.tywin.msg5"],
  "npcMessages.tywin.msg6": ENGLISH_TERMS["npcMessages.tywin.msg6"],
  "npcMessages.tywin.msg7": ENGLISH_TERMS["npcMessages.tywin.msg7"],
  // Tango
  "npcMessages.tango.msg1": ENGLISH_TERMS["npcMessages.tango.msg1"],
  "npcMessages.tango.msg2": ENGLISH_TERMS["npcMessages.tango.msg2"],
  "npcMessages.tango.msg3": ENGLISH_TERMS["npcMessages.tango.msg3"],
  "npcMessages.tango.msg4": ENGLISH_TERMS["npcMessages.tango.msg4"],
  "npcMessages.tango.msg5": ENGLISH_TERMS["npcMessages.tango.msg5"],
  "npcMessages.tango.msg6": ENGLISH_TERMS["npcMessages.tango.msg6"],
  "npcMessages.tango.msg7": ENGLISH_TERMS["npcMessages.tango.msg7"],
  // Miranda
  "npcMessages.miranda.msg1": ENGLISH_TERMS["npcMessages.miranda.msg1"],
  "npcMessages.miranda.msg2": ENGLISH_TERMS["npcMessages.miranda.msg2"],
  "npcMessages.miranda.msg3": ENGLISH_TERMS["npcMessages.miranda.msg3"],
  "npcMessages.miranda.msg4": ENGLISH_TERMS["npcMessages.miranda.msg4"],
  "npcMessages.miranda.msg5": ENGLISH_TERMS["npcMessages.miranda.msg5"],
  "npcMessages.miranda.msg6": ENGLISH_TERMS["npcMessages.miranda.msg6"],
  "npcMessages.miranda.msg7": ENGLISH_TERMS["npcMessages.miranda.msg7"],
  // Finn
  "npcMessages.finn.msg1": ENGLISH_TERMS["npcMessages.finn.msg1"],
  "npcMessages.finn.msg2": ENGLISH_TERMS["npcMessages.finn.msg2"],
  "npcMessages.finn.msg3": ENGLISH_TERMS["npcMessages.finn.msg3"],
  "npcMessages.finn.msg4": ENGLISH_TERMS["npcMessages.finn.msg4"],
  "npcMessages.finn.msg5": ENGLISH_TERMS["npcMessages.finn.msg5"],
  "npcMessages.finn.msg6": ENGLISH_TERMS["npcMessages.finn.msg6"],
  "npcMessages.finn.msg7": ENGLISH_TERMS["npcMessages.finn.msg7"],
  "npcMessages.finn.msg8": ENGLISH_TERMS["npcMessages.finn.msg8"],
  // Findley
  "npcMessages.findley.msg1": ENGLISH_TERMS["npcMessages.findley.msg1"],
  "npcMessages.findley.msg2": ENGLISH_TERMS["npcMessages.findley.msg2"],
  "npcMessages.findley.msg3": ENGLISH_TERMS["npcMessages.findley.msg3"],
  "npcMessages.findley.msg4": ENGLISH_TERMS["npcMessages.findley.msg4"],
  "npcMessages.findley.msg5": ENGLISH_TERMS["npcMessages.findley.msg5"],
  "npcMessages.findley.msg6": ENGLISH_TERMS["npcMessages.findley.msg6"],
  "npcMessages.findley.msg7": ENGLISH_TERMS["npcMessages.findley.msg7"],
  "npcMessages.findley.msg8": ENGLISH_TERMS["npcMessages.findley.msg8"],
  "npcMessages.findley.msg9": ENGLISH_TERMS["npcMessages.findley.msg9"],
  // Corale
  "npcMessages.corale.msg1": ENGLISH_TERMS["npcMessages.corale.msg1"],
  "npcMessages.corale.msg2": ENGLISH_TERMS["npcMessages.corale.msg2"],
  "npcMessages.corale.msg3": ENGLISH_TERMS["npcMessages.corale.msg3"],
  "npcMessages.corale.msg4": ENGLISH_TERMS["npcMessages.corale.msg4"],
  "npcMessages.corale.msg5": ENGLISH_TERMS["npcMessages.corale.msg5"],
  "npcMessages.corale.msg6": ENGLISH_TERMS["npcMessages.corale.msg6"],
  "npcMessages.corale.msg7": ENGLISH_TERMS["npcMessages.corale.msg7"],
  // Shelly
  "npcMessages.shelly.msg1": ENGLISH_TERMS["npcMessages.shelly.msg1"],
  "npcMessages.shelly.msg2": ENGLISH_TERMS["npcMessages.shelly.msg2"],
  "npcMessages.shelly.msg3": ENGLISH_TERMS["npcMessages.shelly.msg3"],
  "npcMessages.shelly.msg4": ENGLISH_TERMS["npcMessages.shelly.msg4"],
  "npcMessages.shelly.msg5": ENGLISH_TERMS["npcMessages.shelly.msg5"],
  "npcMessages.shelly.msg6": ENGLISH_TERMS["npcMessages.shelly.msg6"],
  "npcMessages.shelly.msg7": ENGLISH_TERMS["npcMessages.shelly.msg7"],
  "npcMessages.shelly.msg8": ENGLISH_TERMS["npcMessages.shelly.msg8"],
  "npcMessages.gambit.msg1": ENGLISH_TERMS["npcMessages.gambit.msg1"],
  "npcMessages.gambit.msg2": ENGLISH_TERMS["npcMessages.gambit.msg2"],
  "npcMessages.gambit.msg3": ENGLISH_TERMS["npcMessages.gambit.msg3"],
  "npcMessages.gambit.msg4": ENGLISH_TERMS["npcMessages.gambit.msg4"],
  "npcMessages.gambit.msg5": ENGLISH_TERMS["npcMessages.gambit.msg5"],
  "npcMessages.gambit.msg6": ENGLISH_TERMS["npcMessages.gambit.msg6"],
  "npcMessages.gambit.msg7": ENGLISH_TERMS["npcMessages.gambit.msg7"],
  "npcMessages.gambit.msg8": ENGLISH_TERMS["npcMessages.gambit.msg8"],
  "npcMessages.gambit.msg9": ENGLISH_TERMS["npcMessages.gambit.msg9"],
  "npcMessages.queenVictoria.msg1":
    ENGLISH_TERMS["npcMessages.queenVictoria.msg1"],
  "npcMessages.queenVictoria.msg2":
    ENGLISH_TERMS["npcMessages.queenVictoria.msg2"],
  "npcMessages.queenVictoria.msg3":
    ENGLISH_TERMS["npcMessages.queenVictoria.msg3"],
  "npcMessages.queenVictoria.msg4":
    ENGLISH_TERMS["npcMessages.queenVictoria.msg4"],
  "npcMessages.queenVictoria.msg5":
    ENGLISH_TERMS["npcMessages.queenVictoria.msg5"],
  "npcMessages.queenVictoria.msg6":
    ENGLISH_TERMS["npcMessages.queenVictoria.msg6"],
  "npcMessages.queenVictoria.msg7":
    ENGLISH_TERMS["npcMessages.queenVictoria.msg7"],
  "npcMessages.queenVictoria.msg8":
    ENGLISH_TERMS["npcMessages.queenVictoria.msg8"],
  "npcMessages.queenVictoria.msg9":
    ENGLISH_TERMS["npcMessages.queenVictoria.msg9"],
  "npcMessages.jester.msg1": ENGLISH_TERMS["npcMessages.jester.msg1"],
  "npcMessages.jester.msg2": ENGLISH_TERMS["npcMessages.jester.msg2"],
  "npcMessages.jester.msg3": ENGLISH_TERMS["npcMessages.jester.msg3"],
  "npcMessages.jester.msg4": ENGLISH_TERMS["npcMessages.jester.msg4"],
  "npcMessages.jester.msg5": ENGLISH_TERMS["npcMessages.jester.msg5"],
  "npcMessages.jester.msg6": ENGLISH_TERMS["npcMessages.jester.msg6"],
  "npcMessages.jester.msg7": ENGLISH_TERMS["npcMessages.jester.msg7"],
  "npcMessages.jester.msg8": ENGLISH_TERMS["npcMessages.jester.msg8"],
  "npcMessages.jester.msg9": ENGLISH_TERMS["npcMessages.jester.msg9"],
};

const npc: Record<Npc, string> = {
  "npc.Modal.Hammer": ENGLISH_TERMS["npc.Modal.Hammer"],
  "npc.Modal.Marcus": ENGLISH_TERMS["npc.Modal.Marcus"],
  "npc.Modal.Billy": ENGLISH_TERMS["npc.Modal.Billy"],
  "npc.Modal.Billy.one": ENGLISH_TERMS["npc.Modal.Billy.one"],
  "npc.Modal.Billy.two": ENGLISH_TERMS["npc.Modal.Billy.two"],
  "npc.Modal.Gabi": ENGLISH_TERMS["npc.Modal.Gabi"],
  "npc.Modal.Gabi.one": ENGLISH_TERMS["npc.Modal.Gabi.one"],
  "npc.Modal.Craig": ENGLISH_TERMS["npc.Modal.Craig"],
  "npc.Modal.Craig.one": ENGLISH_TERMS["npc.Modal.Craig.one"],
};

const npcDialogues: Record<NpcDialogues, string> = {
  "npcDialogues.queenVictoria.intro1":
    ENGLISH_TERMS["npcDialogues.queenVictoria.intro1"],
  "npcDialogues.queenVictoria.intro2":
    ENGLISH_TERMS["npcDialogues.queenVictoria.intro2"],
  "npcDialogues.queenVictoria.intro3":
    ENGLISH_TERMS["npcDialogues.queenVictoria.intro3"],
  "npcDialogues.queenVictoria.intro4":
    ENGLISH_TERMS["npcDialogues.queenVictoria.intro4"],
  "npcDialogues.queenVictoria.intro5":
    ENGLISH_TERMS["npcDialogues.queenVictoria.intro5"],
  "npcDialogues.queenVictoria.positiveDelivery1":
    ENGLISH_TERMS["npcDialogues.queenVictoria.positiveDelivery1"],
  "npcDialogues.queenVictoria.positiveDelivery2":
    ENGLISH_TERMS["npcDialogues.queenVictoria.positiveDelivery2"],
  "npcDialogues.queenVictoria.positiveDelivery3":
    ENGLISH_TERMS["npcDialogues.queenVictoria.positiveDelivery3"],
  "npcDialogues.queenVictoria.positiveDelivery4":
    ENGLISH_TERMS["npcDialogues.queenVictoria.positiveDelivery4"],
  "npcDialogues.queenVictoria.positiveDelivery5":
    ENGLISH_TERMS["npcDialogues.queenVictoria.positiveDelivery5"],
  "npcDialogues.queenVictoria.negativeDelivery1":
    ENGLISH_TERMS["npcDialogues.queenVictoria.negativeDelivery1"],
  "npcDialogues.queenVictoria.negativeDelivery2":
    ENGLISH_TERMS["npcDialogues.queenVictoria.negativeDelivery2"],
  "npcDialogues.queenVictoria.negativeDelivery3":
    ENGLISH_TERMS["npcDialogues.queenVictoria.negativeDelivery3"],
  "npcDialogues.queenVictoria.negativeDelivery4":
    ENGLISH_TERMS["npcDialogues.queenVictoria.negativeDelivery4"],
  "npcDialogues.queenVictoria.negativeDelivery5":
    ENGLISH_TERMS["npcDialogues.queenVictoria.negativeDelivery5"],
  "npcDialogues.queenVictoria.noOrder1":
    ENGLISH_TERMS["npcDialogues.queenVictoria.noOrder1"],
  "npcDialogues.queenVictoria.noOrder2":
    ENGLISH_TERMS["npcDialogues.queenVictoria.noOrder2"],
  "npcDialogues.queenVictoria.reward":
    ENGLISH_TERMS["npcDialogues.queenVictoria.reward"],
  "npcDialogues.queenVictoria.flowerIntro":
    ENGLISH_TERMS["npcDialogues.queenVictoria.flowerIntro"],
  "npcDialogues.queenVictoria.averageFlower":
    ENGLISH_TERMS["npcDialogues.queenVictoria.averageFlower"],
  "npcDialogues.queenVictoria.badFlower":
    ENGLISH_TERMS["npcDialogues.queenVictoria.badFlower"],
  "npcDialogues.queenVictoria.goodFlower":
    ENGLISH_TERMS["npcDialogues.queenVictoria.goodFlower"],
  "npcDialogues.gambit.intro1": ENGLISH_TERMS["npcDialogues.gambit.intro1"],
  "npcDialogues.gambit.intro2": ENGLISH_TERMS["npcDialogues.gambit.intro2"],
  "npcDialogues.gambit.intro3": ENGLISH_TERMS["npcDialogues.gambit.intro3"],
  "npcDialogues.gambit.intro4": ENGLISH_TERMS["npcDialogues.gambit.intro4"],
  "npcDialogues.gambit.intro5": ENGLISH_TERMS["npcDialogues.gambit.intro5"],
  "npcDialogues.gambit.positiveDelivery1":
    ENGLISH_TERMS["npcDialogues.gambit.positiveDelivery1"],
  "npcDialogues.gambit.positiveDelivery2":
    ENGLISH_TERMS["npcDialogues.gambit.positiveDelivery2"],
  "npcDialogues.gambit.positiveDelivery3":
    ENGLISH_TERMS["npcDialogues.gambit.positiveDelivery3"],
  "npcDialogues.gambit.positiveDelivery4":
    ENGLISH_TERMS["npcDialogues.gambit.positiveDelivery4"],
  "npcDialogues.gambit.positiveDelivery5":
    ENGLISH_TERMS["npcDialogues.gambit.positiveDelivery5"],
  "npcDialogues.gambit.negativeDelivery1":
    ENGLISH_TERMS["npcDialogues.gambit.negativeDelivery1"],
  "npcDialogues.gambit.negativeDelivery2":
    ENGLISH_TERMS["npcDialogues.gambit.negativeDelivery2"],
  "npcDialogues.gambit.negativeDelivery3":
    ENGLISH_TERMS["npcDialogues.gambit.negativeDelivery3"],
  "npcDialogues.gambit.negativeDelivery4":
    ENGLISH_TERMS["npcDialogues.gambit.negativeDelivery4"],
  "npcDialogues.gambit.negativeDelivery5":
    ENGLISH_TERMS["npcDialogues.gambit.negativeDelivery5"],
  "npcDialogues.gambit.noOrder1": ENGLISH_TERMS["npcDialogues.gambit.noOrder1"],
  "npcDialogues.gambit.noOrder2": ENGLISH_TERMS["npcDialogues.gambit.noOrder2"],
  "npcDialogues.jester.intro1": ENGLISH_TERMS["npcDialogues.jester.intro1"],
  "npcDialogues.jester.intro2": ENGLISH_TERMS["npcDialogues.jester.intro2"],
  "npcDialogues.jester.intro3": ENGLISH_TERMS["npcDialogues.jester.intro3"],
  "npcDialogues.jester.intro4": ENGLISH_TERMS["npcDialogues.jester.intro4"],
  "npcDialogues.jester.intro5": ENGLISH_TERMS["npcDialogues.jester.intro5"],
  "npcDialogues.jester.positiveDelivery1":
    ENGLISH_TERMS["npcDialogues.jester.positiveDelivery1"],
  "npcDialogues.jester.positiveDelivery2":
    ENGLISH_TERMS["npcDialogues.jester.positiveDelivery2"],
  "npcDialogues.jester.positiveDelivery3":
    ENGLISH_TERMS["npcDialogues.jester.positiveDelivery3"],
  "npcDialogues.jester.positiveDelivery4":
    ENGLISH_TERMS["npcDialogues.jester.positiveDelivery4"],
  "npcDialogues.jester.positiveDelivery5":
    ENGLISH_TERMS["npcDialogues.jester.positiveDelivery5"],
  "npcDialogues.jester.negativeDelivery1":
    ENGLISH_TERMS["npcDialogues.jester.negativeDelivery1"],
  "npcDialogues.jester.negativeDelivery2":
    ENGLISH_TERMS["npcDialogues.jester.negativeDelivery2"],
  "npcDialogues.jester.negativeDelivery3":
    ENGLISH_TERMS["npcDialogues.jester.negativeDelivery3"],
  "npcDialogues.jester.negativeDelivery4":
    ENGLISH_TERMS["npcDialogues.jester.negativeDelivery4"],
  "npcDialogues.jester.negativeDelivery5":
    ENGLISH_TERMS["npcDialogues.jester.negativeDelivery5"],
  "npcDialogues.jester.noOrder1": ENGLISH_TERMS["npcDialogues.jester.noOrder1"],
  "npcDialogues.jester.noOrder2": ENGLISH_TERMS["npcDialogues.jester.noOrder2"],
  "npcDialogues.jester.reward": ENGLISH_TERMS["npcDialogues.jester.reward"],
  "npcDialogues.jester.flowerIntro":
    ENGLISH_TERMS["npcDialogues.jester.flowerIntro"],
  "npcDialogues.jester.averageFlower":
    ENGLISH_TERMS["npcDialogues.jester.averageFlower"],
  "npcDialogues.jester.badFlower":
    ENGLISH_TERMS["npcDialogues.jester.badFlower"],
  "npcDialogues.jester.goodFlower":
    ENGLISH_TERMS["npcDialogues.jester.goodFlower"],

  // Blacksmith Intro
  "npcDialogues.blacksmith.intro1":
    ENGLISH_TERMS["npcDialogues.blacksmith.intro1"],
  "npcDialogues.blacksmith.intro2":
    ENGLISH_TERMS["npcDialogues.blacksmith.intro2"],
  "npcDialogues.blacksmith.intro3":
    ENGLISH_TERMS["npcDialogues.blacksmith.intro3"],
  "npcDialogues.blacksmith.intro4":
    ENGLISH_TERMS["npcDialogues.blacksmith.intro4"],
  // Blacksmith Positive Delivery
  "npcDialogues.blacksmith.positiveDelivery1":
    ENGLISH_TERMS["npcDialogues.blacksmith.positiveDelivery1"],
  "npcDialogues.blacksmith.positiveDelivery2":
    ENGLISH_TERMS["npcDialogues.blacksmith.positiveDelivery2"],
  "npcDialogues.blacksmith.positiveDelivery3":
    ENGLISH_TERMS["npcDialogues.blacksmith.positiveDelivery3"],
  "npcDialogues.blacksmith.positiveDelivery4":
    ENGLISH_TERMS["npcDialogues.blacksmith.positiveDelivery4"],
  "npcDialogues.blacksmith.positiveDelivery5":
    ENGLISH_TERMS["npcDialogues.blacksmith.positiveDelivery5"],
  // Blacksmith Negative Delivery
  "npcDialogues.blacksmith.negativeDelivery1":
    ENGLISH_TERMS["npcDialogues.blacksmith.negativeDelivery1"],
  "npcDialogues.blacksmith.negativeDelivery2":
    ENGLISH_TERMS["npcDialogues.blacksmith.negativeDelivery2"],
  "npcDialogues.blacksmith.negativeDelivery3":
    ENGLISH_TERMS["npcDialogues.blacksmith.negativeDelivery3"],
  "npcDialogues.blacksmith.negativeDelivery4":
    ENGLISH_TERMS["npcDialogues.blacksmith.negativeDelivery4"],
  "npcDialogues.blacksmith.negativeDelivery5":
    ENGLISH_TERMS["npcDialogues.blacksmith.negativeDelivery5"],
  // Blacksmith NoOrder
  "npcDialogues.blacksmith.noOrder1":
    ENGLISH_TERMS["npcDialogues.blacksmith.noOrder1"],
  "npcDialogues.blacksmith.noOrder2":
    ENGLISH_TERMS["npcDialogues.blacksmith.noOrder2"],
  // Betty Into
  "npcDialogues.betty.intro1": ENGLISH_TERMS["npcDialogues.betty.intro1"],
  "npcDialogues.betty.intro2": ENGLISH_TERMS["npcDialogues.betty.intro2"],
  "npcDialogues.betty.intro3": ENGLISH_TERMS["npcDialogues.betty.intro3"],
  "npcDialogues.betty.intro4": ENGLISH_TERMS["npcDialogues.betty.intro4"],
  "npcDialogues.betty.intro5": ENGLISH_TERMS["npcDialogues.betty.intro5"],
  // Betty Positive Delivery
  "npcDialogues.betty.positiveDelivery1":
    ENGLISH_TERMS["npcDialogues.betty.positiveDelivery1"],
  "npcDialogues.betty.positiveDelivery2":
    ENGLISH_TERMS["npcDialogues.betty.positiveDelivery2"],
  "npcDialogues.betty.positiveDelivery3":
    ENGLISH_TERMS["npcDialogues.betty.positiveDelivery3"],
  "npcDialogues.betty.positiveDelivery4":
    ENGLISH_TERMS["npcDialogues.betty.positiveDelivery4"],
  "npcDialogues.betty.positiveDelivery5":
    ENGLISH_TERMS["npcDialogues.betty.positiveDelivery5"],
  // Betty Negative Delivery
  "npcDialogues.betty.negativeDelivery1":
    ENGLISH_TERMS["npcDialogues.betty.negativeDelivery1"],
  "npcDialogues.betty.negativeDelivery2":
    ENGLISH_TERMS["npcDialogues.betty.negativeDelivery2"],
  "npcDialogues.betty.negativeDelivery3":
    ENGLISH_TERMS["npcDialogues.betty.negativeDelivery3"],
  "npcDialogues.betty.negativeDelivery4":
    ENGLISH_TERMS["npcDialogues.betty.negativeDelivery4"],
  "npcDialogues.betty.negativeDelivery5":
    ENGLISH_TERMS["npcDialogues.betty.negativeDelivery5"],
  // Betty NoOrder
  "npcDialogues.betty.noOrder1": ENGLISH_TERMS["npcDialogues.betty.noOrder1"],
  "npcDialogues.betty.noOrder2": ENGLISH_TERMS["npcDialogues.betty.noOrder2"],
  // Grimbly Intro
  "npcDialogues.grimbly.intro1": ENGLISH_TERMS["npcDialogues.grimbly.intro1"],
  "npcDialogues.grimbly.intro2": ENGLISH_TERMS["npcDialogues.grimbly.intro2"],
  "npcDialogues.grimbly.intro3": ENGLISH_TERMS["npcDialogues.grimbly.intro3"],
  "npcDialogues.grimbly.intro4": ENGLISH_TERMS["npcDialogues.grimbly.intro4"],
  // Grimbly Positive Delivery
  "npcDialogues.grimbly.positiveDelivery1":
    ENGLISH_TERMS["npcDialogues.grimbly.positiveDelivery1"],
  "npcDialogues.grimbly.positiveDelivery2":
    ENGLISH_TERMS["npcDialogues.grimbly.positiveDelivery2"],
  "npcDialogues.grimbly.positiveDelivery3":
    ENGLISH_TERMS["npcDialogues.grimbly.positiveDelivery3"],
  "npcDialogues.grimbly.positiveDelivery4":
    ENGLISH_TERMS["npcDialogues.grimbly.positiveDelivery4"],
  // Grimbly Negative Delivery
  "npcDialogues.grimbly.negativeDelivery1":
    ENGLISH_TERMS["npcDialogues.grimbly.negativeDelivery1"],
  "npcDialogues.grimbly.negativeDelivery2":
    ENGLISH_TERMS["npcDialogues.grimbly.negativeDelivery2"],
  "npcDialogues.grimbly.negativeDelivery3":
    ENGLISH_TERMS["npcDialogues.grimbly.negativeDelivery3"],
  "npcDialogues.grimbly.negativeDelivery4":
    ENGLISH_TERMS["npcDialogues.grimbly.negativeDelivery4"],
  // Grimbly NoOrder
  "npcDialogues.grimbly.noOrder1":
    ENGLISH_TERMS["npcDialogues.grimbly.noOrder1"],
  "npcDialogues.grimbly.noOrder2":
    ENGLISH_TERMS["npcDialogues.grimbly.noOrder2"],
  // Grimtooth Intro
  "npcDialogues.grimtooth.intro1":
    ENGLISH_TERMS["npcDialogues.grimtooth.intro1"],
  "npcDialogues.grimtooth.intro2":
    ENGLISH_TERMS["npcDialogues.grimtooth.intro2"],
  "npcDialogues.grimtooth.intro3":
    ENGLISH_TERMS["npcDialogues.grimtooth.intro3"],
  "npcDialogues.grimtooth.intro4":
    ENGLISH_TERMS["npcDialogues.grimtooth.intro4"],
  // Grimtooth Positive Delivery
  "npcDialogues.grimtooth.positiveDelivery1":
    ENGLISH_TERMS["npcDialogues.grimtooth.positiveDelivery1"],
  "npcDialogues.grimtooth.positiveDelivery2":
    ENGLISH_TERMS["npcDialogues.grimtooth.positiveDelivery2"],
  "npcDialogues.grimtooth.positiveDelivery3":
    ENGLISH_TERMS["npcDialogues.grimtooth.positiveDelivery3"],
  "npcDialogues.grimtooth.positiveDelivery4":
    ENGLISH_TERMS["npcDialogues.grimtooth.positiveDelivery4"],
  // Grimtooth Negative Delivery
  "npcDialogues.grimtooth.negativeDelivery1":
    ENGLISH_TERMS["npcDialogues.grimtooth.negativeDelivery1"],
  "npcDialogues.grimtooth.negativeDelivery2":
    ENGLISH_TERMS["npcDialogues.grimtooth.negativeDelivery2"],
  "npcDialogues.grimtooth.negativeDelivery3":
    ENGLISH_TERMS["npcDialogues.grimtooth.negativeDelivery3"],
  "npcDialogues.grimtooth.negativeDelivery4":
    ENGLISH_TERMS["npcDialogues.grimtooth.negativeDelivery4"],
  // Grimtooth NoOrder
  "npcDialogues.grimtooth.noOrder1":
    ENGLISH_TERMS["npcDialogues.grimtooth.noOrder1"],
  "npcDialogues.grimtooth.noOrder2":
    ENGLISH_TERMS["npcDialogues.grimtooth.noOrder2"],
  // Old Salty Intro
  "npcDialogues.oldSalty.intro1":
    "Arghhhh, welcome, me heartie! Old Salty's the name, and treasure's me game. Do ye have what I seek?",
  "npcDialogues.oldSalty.intro2":
    "Ahoy, landlubber! Old Salty's the treasure enthusiast ye be lookin' for. Show me what ye've found on yer quest?",
  "npcDialogues.oldSalty.intro3": ENGLISH_TERMS["npcDialogues.oldSalty.intro3"],
  // Old Salty Positive Delivery
  "npcDialogues.oldSalty.positiveDelivery1":
    ENGLISH_TERMS["npcDialogues.oldSalty.positiveDelivery1"],
  "npcDialogues.oldSalty.positiveDelivery2":
    ENGLISH_TERMS["npcDialogues.oldSalty.positiveDelivery2"],
  "npcDialogues.oldSalty.positiveDelivery3":
    ENGLISH_TERMS["npcDialogues.oldSalty.positiveDelivery3"],
  // Old Salty Negative Delivery
  "npcDialogues.oldSalty.negativeDelivery1":
    ENGLISH_TERMS["npcDialogues.oldSalty.negativeDelivery1"],
  "npcDialogues.oldSalty.negativeDelivery2":
    ENGLISH_TERMS["npcDialogues.oldSalty.negativeDelivery2"],
  "npcDialogues.oldSalty.negativeDelivery3":
    ENGLISH_TERMS["npcDialogues.oldSalty.negativeDelivery3"],
  // Old Salty NoOrder
  "npcDialogues.oldSalty.noOrder1":
    ENGLISH_TERMS["npcDialogues.oldSalty.noOrder1"],
  "npcDialogues.oldSalty.noOrder2":
    ENGLISH_TERMS["npcDialogues.oldSalty.noOrder2"],
  // Raven Intro
  "npcDialogues.raven.intro1": ENGLISH_TERMS["npcDialogues.raven.intro1"],
  "npcDialogues.raven.intro2": ENGLISH_TERMS["npcDialogues.raven.intro2"],
  "npcDialogues.raven.intro3": ENGLISH_TERMS["npcDialogues.raven.intro3"],
  "npcDialogues.raven.intro4": ENGLISH_TERMS["npcDialogues.raven.intro4"],
  // Raven Positive Delivery
  "npcDialogues.raven.positiveDelivery1":
    ENGLISH_TERMS["npcDialogues.raven.positiveDelivery1"],
  "npcDialogues.raven.positiveDelivery2":
    ENGLISH_TERMS["npcDialogues.raven.positiveDelivery2"],
  "npcDialogues.raven.positiveDelivery3":
    ENGLISH_TERMS["npcDialogues.raven.positiveDelivery3"],
  "npcDialogues.raven.positiveDelivery4":
    ENGLISH_TERMS["npcDialogues.raven.positiveDelivery4"],
  // Raven Negative Delivery
  "npcDialogues.raven.negativeDelivery1":
    ENGLISH_TERMS["npcDialogues.raven.negativeDelivery1"],
  "npcDialogues.raven.negativeDelivery2":
    ENGLISH_TERMS["npcDialogues.raven.negativeDelivery2"],
  "npcDialogues.raven.negativeDelivery3":
    ENGLISH_TERMS["npcDialogues.raven.negativeDelivery3"],
  // Raven NoOrder
  "npcDialogues.raven.noOrder1": ENGLISH_TERMS["npcDialogues.raven.noOrder1"],
  "npcDialogues.raven.noOrder2": ENGLISH_TERMS["npcDialogues.raven.noOrder2"],
  // Tywin Intro
  "npcDialogues.tywin.intro1": ENGLISH_TERMS["npcDialogues.tywin.intro1"],
  "npcDialogues.tywin.intro2": ENGLISH_TERMS["npcDialogues.tywin.intro2"],
  "npcDialogues.tywin.intro3": ENGLISH_TERMS["npcDialogues.tywin.intro3"],
  "npcDialogues.tywin.intro4": ENGLISH_TERMS["npcDialogues.tywin.intro4"],
  // Tywin Positive Delivery
  "npcDialogues.tywin.positiveDelivery1":
    ENGLISH_TERMS["npcDialogues.tywin.positiveDelivery1"],
  "npcDialogues.tywin.positiveDelivery2":
    ENGLISH_TERMS["npcDialogues.tywin.positiveDelivery2"],
  "npcDialogues.tywin.positiveDelivery3":
    ENGLISH_TERMS["npcDialogues.tywin.positiveDelivery3"],
  "npcDialogues.tywin.positiveDelivery4":
    ENGLISH_TERMS["npcDialogues.tywin.positiveDelivery4"],
  // Tywin Negative Delivery
  "npcDialogues.tywin.negativeDelivery1":
    ENGLISH_TERMS["npcDialogues.tywin.negativeDelivery1"],
  "npcDialogues.tywin.negativeDelivery2":
    ENGLISH_TERMS["npcDialogues.tywin.negativeDelivery2"],
  "npcDialogues.tywin.negativeDelivery3":
    ENGLISH_TERMS["npcDialogues.tywin.negativeDelivery3"],
  "npcDialogues.tywin.negativeDelivery4":
    ENGLISH_TERMS["npcDialogues.tywin.negativeDelivery4"],
  // Tywin NoOrder
  "npcDialogues.tywin.noOrder1": ENGLISH_TERMS["npcDialogues.tywin.noOrder1"],
  "npcDialogues.tywin.noOrder2": ENGLISH_TERMS["npcDialogues.tywin.noOrder2"],
  // Bert Intro
  "npcDialogues.bert.intro1": ENGLISH_TERMS["npcDialogues.bert.intro1"],
  "npcDialogues.bert.intro2": ENGLISH_TERMS["npcDialogues.bert.intro2"],
  "npcDialogues.bert.intro3": ENGLISH_TERMS["npcDialogues.bert.intro3"],
  "npcDialogues.bert.intro4": ENGLISH_TERMS["npcDialogues.bert.intro4"],
  "bert.day": ENGLISH_TERMS["bert.day"],
  // Bert Positive Delivery
  "npcDialogues.bert.positiveDelivery1":
    ENGLISH_TERMS["npcDialogues.bert.positiveDelivery1"],
  "npcDialogues.bert.positiveDelivery2":
    ENGLISH_TERMS["npcDialogues.bert.positiveDelivery2"],
  "npcDialogues.bert.positiveDelivery3":
    ENGLISH_TERMS["npcDialogues.bert.positiveDelivery3"],
  "npcDialogues.bert.positiveDelivery4":
    ENGLISH_TERMS["npcDialogues.bert.positiveDelivery4"],
  // Bert Negative Delivery
  "npcDialogues.bert.negativeDelivery1":
    ENGLISH_TERMS["npcDialogues.bert.negativeDelivery1"],
  "npcDialogues.bert.negativeDelivery2":
    ENGLISH_TERMS["npcDialogues.bert.negativeDelivery2"],
  "npcDialogues.bert.negativeDelivery3":
    ENGLISH_TERMS["npcDialogues.bert.negativeDelivery3"],
  "npcDialogues.bert.negativeDelivery4":
    ENGLISH_TERMS["npcDialogues.bert.negativeDelivery4"],
  // Bert NoOrder
  "npcDialogues.bert.noOrder1": ENGLISH_TERMS["npcDialogues.bert.noOrder1"],
  "npcDialogues.bert.noOrder2": ENGLISH_TERMS["npcDialogues.bert.noOrder2"],
  // Timmy Intro
  "npcDialogues.timmy.intro1": ENGLISH_TERMS["npcDialogues.timmy.intro1"],
  "npcDialogues.timmy.intro2": ENGLISH_TERMS["npcDialogues.timmy.intro2"],
  "npcDialogues.timmy.intro3": ENGLISH_TERMS["npcDialogues.timmy.intro3"],
  "npcDialogues.timmy.intro4": ENGLISH_TERMS["npcDialogues.timmy.intro4"],
  "npcDialogues.timmy.intro5": ENGLISH_TERMS["npcDialogues.timmy.intro5"],
  // Timmy Positive Delivery
  "npcDialogues.timmy.positiveDelivery1":
    ENGLISH_TERMS["npcDialogues.timmy.positiveDelivery1"],
  "npcDialogues.timmy.positiveDelivery2":
    ENGLISH_TERMS["npcDialogues.timmy.positiveDelivery2"],
  "npcDialogues.timmy.positiveDelivery3":
    ENGLISH_TERMS["npcDialogues.timmy.positiveDelivery3"],
  "npcDialogues.timmy.positiveDelivery4":
    ENGLISH_TERMS["npcDialogues.timmy.positiveDelivery4"],
  "npcDialogues.timmy.positiveDelivery5":
    ENGLISH_TERMS["npcDialogues.timmy.positiveDelivery5"],
  // Timmy Negative Delivery
  "npcDialogues.timmy.negativeDelivery1":
    ENGLISH_TERMS["npcDialogues.timmy.negativeDelivery1"],
  "npcDialogues.timmy.negativeDelivery2":
    ENGLISH_TERMS["npcDialogues.timmy.negativeDelivery2"],
  "npcDialogues.timmy.negativeDelivery3":
    ENGLISH_TERMS["npcDialogues.timmy.negativeDelivery3"],
  "npcDialogues.timmy.negativeDelivery4":
    ENGLISH_TERMS["npcDialogues.timmy.negativeDelivery4"],
  "npcDialogues.timmy.negativeDelivery5":
    ENGLISH_TERMS["npcDialogues.timmy.negativeDelivery5"],
  // Timmy NoOrder
  "npcDialogues.timmy.noOrder1": ENGLISH_TERMS["npcDialogues.timmy.noOrder1"],
  "npcDialogues.timmy.noOrder2": ENGLISH_TERMS["npcDialogues.timmy.noOrder2"],
  // Cornwell Intro
  "npcDialogues.cornwell.intro1": ENGLISH_TERMS["npcDialogues.cornwell.intro1"],
  "npcDialogues.cornwell.intro2": ENGLISH_TERMS["npcDialogues.cornwell.intro2"],
  "npcDialogues.cornwell.intro3": ENGLISH_TERMS["npcDialogues.cornwell.intro3"],
  "npcDialogues.cornwell.intro4": ENGLISH_TERMS["npcDialogues.cornwell.intro4"],
  "npcDialogues.cornwell.intro5": ENGLISH_TERMS["npcDialogues.cornwell.intro5"],
  // Cornwell Positive Delivery
  "npcDialogues.cornwell.positiveDelivery1":
    ENGLISH_TERMS["npcDialogues.cornwell.positiveDelivery1"],
  "npcDialogues.cornwell.positiveDelivery2":
    ENGLISH_TERMS["npcDialogues.cornwell.positiveDelivery2"],
  "npcDialogues.cornwell.positiveDelivery3":
    ENGLISH_TERMS["npcDialogues.cornwell.positiveDelivery3"],
  "npcDialogues.cornwell.positiveDelivery4":
    ENGLISH_TERMS["npcDialogues.cornwell.positiveDelivery4"],
  "npcDialogues.cornwell.positiveDelivery5":
    ENGLISH_TERMS["npcDialogues.cornwell.positiveDelivery5"],
  // Cornwell Negative Delivery
  "npcDialogues.cornwell.negativeDelivery1":
    ENGLISH_TERMS["npcDialogues.cornwell.negativeDelivery1"],
  "npcDialogues.cornwell.negativeDelivery2":
    ENGLISH_TERMS["npcDialogues.cornwell.negativeDelivery2"],
  "npcDialogues.cornwell.negativeDelivery3":
    ENGLISH_TERMS["npcDialogues.cornwell.negativeDelivery3"],
  "npcDialogues.cornwell.negativeDelivery4":
    ENGLISH_TERMS["npcDialogues.cornwell.negativeDelivery4"],
  "npcDialogues.cornwell.negativeDelivery5":
    ENGLISH_TERMS["npcDialogues.cornwell.negativeDelivery5"],
  // Cornwell NoOrder
  "npcDialogues.cornwell.noOrder1":
    ENGLISH_TERMS["npcDialogues.cornwell.noOrder1"],
  "npcDialogues.cornwell.noOrder2":
    ENGLISH_TERMS["npcDialogues.cornwell.noOrder2"],
  "npcDialogues.cornwell.noOrder3":
    ENGLISH_TERMS["npcDialogues.cornwell.noOrder3"],
  "npcDialogues.cornwell.noOrder4":
    ENGLISH_TERMS["npcDialogues.cornwell.noOrder4"],
  // Pumpkin Pete Intro
  "npcDialogues.pumpkinPete.intro1":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.intro1"],
  "npcDialogues.pumpkinPete.intro2":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.intro2"],
  "npcDialogues.pumpkinPete.intro3":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.intro3"],
  "npcDialogues.pumpkinPete.intro4":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.intro4"],
  "npcDialogues.pumpkinPete.intro5":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.intro5"],
  // Pumpkin Pete Positive Delivery
  "npcDialogues.pumpkinPete.positiveDelivery1":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.positiveDelivery1"],
  "npcDialogues.pumpkinPete.positiveDelivery2":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.positiveDelivery2"],
  "npcDialogues.pumpkinPete.positiveDelivery3":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.positiveDelivery3"],
  "npcDialogues.pumpkinPete.positiveDelivery4":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.positiveDelivery4"],
  "npcDialogues.pumpkinPete.positiveDelivery5":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.positiveDelivery5"],
  // Pumpkin Pete Negative Delivery
  "npcDialogues.pumpkinPete.negativeDelivery1":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.negativeDelivery1"],
  "npcDialogues.pumpkinPete.negativeDelivery2":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.negativeDelivery2"],
  "npcDialogues.pumpkinPete.negativeDelivery3":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.negativeDelivery3"],
  "npcDialogues.pumpkinPete.negativeDelivery4":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.negativeDelivery4"],
  "npcDialogues.pumpkinPete.negativeDelivery5":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.negativeDelivery5"],
  // Pumpkin Pete NoOrder
  "npcDialogues.pumpkinPete.noOrder1":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.noOrder1"],
  "npcDialogues.pumpkinPete.noOrder2":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.noOrder2"],

  // NPC gift dialogues
  // Pumpkin Pete
  "npcDialogues.pumpkinPete.reward":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.reward"],
  "npcDialogues.pumpkinPete.flowerIntro":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.flowerIntro"],
  "npcDialogues.pumpkinPete.averageFlower":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.averageFlower"],
  "npcDialogues.pumpkinPete.badFlower":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.badFlower"],
  "npcDialogues.pumpkinPete.goodFlower":
    ENGLISH_TERMS["npcDialogues.pumpkinPete.goodFlower"],
  // Betty
  "npcDialogues.betty.reward": ENGLISH_TERMS["npcDialogues.betty.reward"],
  "npcDialogues.betty.flowerIntro":
    ENGLISH_TERMS["npcDialogues.betty.flowerIntro"],
  "npcDialogues.betty.averageFlower":
    ENGLISH_TERMS["npcDialogues.betty.averageFlower"],
  "npcDialogues.betty.badFlower": ENGLISH_TERMS["npcDialogues.betty.badFlower"],
  "npcDialogues.betty.goodFlower":
    ENGLISH_TERMS["npcDialogues.betty.goodFlower"],
  // Blacksmith
  "npcDialogues.blacksmith.reward":
    ENGLISH_TERMS["npcDialogues.blacksmith.reward"],
  "npcDialogues.blacksmith.flowerIntro":
    ENGLISH_TERMS["npcDialogues.blacksmith.flowerIntro"],
  "npcDialogues.blacksmith.averageFlower":
    ENGLISH_TERMS["npcDialogues.blacksmith.averageFlower"],
  "npcDialogues.blacksmith.badFlower":
    ENGLISH_TERMS["npcDialogues.blacksmith.badFlower"],
  "npcDialogues.blacksmith.goodFlower":
    ENGLISH_TERMS["npcDialogues.blacksmith.goodFlower"],
  // Bert
  "npcDialogues.bert.reward": ENGLISH_TERMS["npcDialogues.bert.reward"],
  "npcDialogues.bert.flowerIntro":
    ENGLISH_TERMS["npcDialogues.bert.flowerIntro"],
  "npcDialogues.bert.averageFlower":
    ENGLISH_TERMS["npcDialogues.bert.averageFlower"],
  "npcDialogues.bert.badFlower": ENGLISH_TERMS["npcDialogues.bert.badFlower"],
  "npcDialogues.bert.goodFlower": ENGLISH_TERMS["npcDialogues.bert.goodFlower"],
  // Finn
  "npcDialogues.finn.reward": ENGLISH_TERMS["npcDialogues.finn.reward"],
  "npcDialogues.finn.flowerIntro":
    ENGLISH_TERMS["npcDialogues.finn.flowerIntro"],
  "npcDialogues.finn.averageFlower":
    ENGLISH_TERMS["npcDialogues.finn.averageFlower"],
  "npcDialogues.finn.badFlower": ENGLISH_TERMS["npcDialogues.finn.badFlower"],
  "npcDialogues.finn.goodFlower": ENGLISH_TERMS["npcDialogues.finn.goodFlower"],

  // Finley
  "npcDialogues.finley.reward": ENGLISH_TERMS["npcDialogues.finley.reward"],
  "npcDialogues.finley.flowerIntro":
    ENGLISH_TERMS["npcDialogues.finley.flowerIntro"],
  "npcDialogues.finley.averageFlower":
    ENGLISH_TERMS["npcDialogues.finley.averageFlower"],
  "npcDialogues.finley.badFlower":
    ENGLISH_TERMS["npcDialogues.finley.badFlower"],
  "npcDialogues.finley.goodFlower":
    ENGLISH_TERMS["npcDialogues.finley.goodFlower"],
  // Corale
  "npcDialogues.corale.reward": ENGLISH_TERMS["npcDialogues.corale.reward"],
  "npcDialogues.corale.flowerIntro":
    ENGLISH_TERMS["npcDialogues.corale.flowerIntro"],
  "npcDialogues.corale.averageFlower":
    ENGLISH_TERMS["npcDialogues.corale.averageFlower"],
  "npcDialogues.corale.badFlower":
    ENGLISH_TERMS["npcDialogues.corale.badFlower"],
  "npcDialogues.corale.goodFlower":
    ENGLISH_TERMS["npcDialogues.corale.goodFlower"],
  // Raven
  "npcDialogues.raven.reward": ENGLISH_TERMS["npcDialogues.raven.reward"],
  "npcDialogues.raven.flowerIntro":
    ENGLISH_TERMS["npcDialogues.raven.flowerIntro"],
  "npcDialogues.raven.averageFlower":
    ENGLISH_TERMS["npcDialogues.raven.averageFlower"],
  "npcDialogues.raven.badFlower": ENGLISH_TERMS["npcDialogues.raven.badFlower"],
  "npcDialogues.raven.goodFlower":
    ENGLISH_TERMS["npcDialogues.raven.goodFlower"],
  // Miranda
  "npcDialogues.miranda.reward": ENGLISH_TERMS["npcDialogues.miranda.reward"],
  "npcDialogues.miranda.flowerIntro":
    ENGLISH_TERMS["npcDialogues.miranda.flowerIntro"],
  "npcDialogues.miranda.averageFlower":
    ENGLISH_TERMS["npcDialogues.miranda.averageFlower"],
  "npcDialogues.miranda.badFlower":
    ENGLISH_TERMS["npcDialogues.miranda.badFlower"],
  "npcDialogues.miranda.goodFlower":
    ENGLISH_TERMS["npcDialogues.miranda.goodFlower"],
  // Cornwell
  "npcDialogues.cornwell.reward": ENGLISH_TERMS["npcDialogues.cornwell.reward"],
  "npcDialogues.cornwell.flowerIntro":
    ENGLISH_TERMS["npcDialogues.cornwell.flowerIntro"],
  "npcDialogues.cornwell.averageFlower":
    ENGLISH_TERMS["npcDialogues.cornwell.averageFlower"],
  "npcDialogues.cornwell.badFlower":
    ENGLISH_TERMS["npcDialogues.cornwell.badFlower"],
  "npcDialogues.cornwell.goodFlower":
    ENGLISH_TERMS["npcDialogues.cornwell.goodFlower"],
  // Tywin
  "npcDialogues.tywin.reward": ENGLISH_TERMS["npcDialogues.tywin.reward"],
  "npcDialogues.tywin.flowerIntro":
    ENGLISH_TERMS["npcDialogues.tywin.flowerIntro"],
  "npcDialogues.tywin.averageFlower":
    ENGLISH_TERMS["npcDialogues.tywin.averageFlower"],
  "npcDialogues.tywin.badFlower": ENGLISH_TERMS["npcDialogues.tywin.badFlower"],
  "npcDialogues.tywin.goodFlower":
    ENGLISH_TERMS["npcDialogues.tywin.goodFlower"],

  "npcDialogues.default.flowerIntro":
    ENGLISH_TERMS["npcDialogues.default.flowerIntro"],
  "npcDialogues.default.averageFlower":
    ENGLISH_TERMS["npcDialogues.default.averageFlower"],
  "npcDialogues.default.badFlower":
    ENGLISH_TERMS["npcDialogues.default.badFlower"],
  "npcDialogues.default.goodFlower":
    ENGLISH_TERMS["npcDialogues.default.goodFlower"],
  "npcDialogues.default.reward": ENGLISH_TERMS["npcDialogues.default.reward"],
  "npcDialogues.default.locked": ENGLISH_TERMS["npcDialogues.default.locked"],
};

const nyeButton: Record<NyeButton, string> = {
  "plaza.magicButton.query": ENGLISH_TERMS["plaza.magicButton.query"],
};

const NYON_STATUE: Record<NyonStatue, string> = {
  "nyonStatue.memory": ENGLISH_TERMS["nyonStatue.memory"],
  "nyonStatue.description": ENGLISH_TERMS["nyonStatue.description"],
};

const obsessionDialogue: Record<ObsessionDialogue, string> = {
  "obsessionDialogue.line1": ENGLISH_TERMS["obsessionDialogue.line1"],
  "obsessionDialogue.line2": ENGLISH_TERMS["obsessionDialogue.line2"],
  "obsessionDialogue.line3": ENGLISH_TERMS["obsessionDialogue.line3"],
  "obsessionDialogue.line4": ENGLISH_TERMS["obsessionDialogue.line4"],
  "obsessionDialogue.line5": ENGLISH_TERMS["obsessionDialogue.line5"],
};

const offer: Record<Offer, string> = {
  "offer.okxOffer": ENGLISH_TERMS["offer.okxOffer"],
  "offer.beginWithNFT": ENGLISH_TERMS["offer.beginWithNFT"],
  "offer.getStarterPack": ENGLISH_TERMS["offer.getStarterPack"],
  "offer.newHere": ENGLISH_TERMS["offer.newHere"],
  "offer.getStarted": ENGLISH_TERMS["offer.getStarted"],
  "offer.not.enough.BlockBucks": ENGLISH_TERMS["offer.not.enough.BlockBucks"],
};

const onboarding: Record<Onboarding, string> = {
  "onboarding.welcome": ENGLISH_TERMS["onboarding.welcome"],
  "onboarding.step.one": ENGLISH_TERMS["onboarding.step.one"],
  "onboarding.step.two": ENGLISH_TERMS["onboarding.step.two"],
  "onboarding.step.three": ENGLISH_TERMS["onboarding.step.three"],
  "onboarding.intro.one": ENGLISH_TERMS["onboarding.intro.one"],
  "onboarding.intro.two": ENGLISH_TERMS["onboarding.intro.two"],
  "onboarding.cheer": ENGLISH_TERMS["onboarding.cheer"],
  "onboarding.form.one": ENGLISH_TERMS["onboarding.form.one"],
  "onboarding.form.two": ENGLISH_TERMS["onboarding.form.two"],
  "onboarding.duplicateUser.one": ENGLISH_TERMS["onboarding.duplicateUser.one"],
  "onboarding.duplicateUser.two": ENGLISH_TERMS["onboarding.duplicateUser.two"],
  "onboarding.starterPack": ENGLISH_TERMS["onboarding.starterPack"],
  "onboarding.settingWallet": ENGLISH_TERMS["onboarding.settingWallet"],
  "onboarding.wallet.one": ENGLISH_TERMS["onboarding.wallet.one"],
  "onboarding.wallet.two": ENGLISH_TERMS["onboarding.wallet.two"],
  "onboarding.wallet.haveWallet": ENGLISH_TERMS["onboarding.wallet.haveWallet"],
  "onboarding.wallet.createButton":
    ENGLISH_TERMS["onboarding.wallet.createButton"],
  "onboarding.wallet.acceptButton":
    ENGLISH_TERMS["onboarding.wallet.acceptButton"],
  "onboarding.buyFarm.title": ENGLISH_TERMS["onboarding.buyFarm.title"],
  "onboarding.buyFarm.one": ENGLISH_TERMS["onboarding.buyFarm.one"],
  "onboarding.buyFarm.two": ENGLISH_TERMS["onboarding.buyFarm.two"],
  "onboarding.wallet.already": ENGLISH_TERMS["onboarding.wallet.already"],
};

const onCollectReward: Record<OnCollectReward, string> = {
  "onCollectReward.Missing.Seed": ENGLISH_TERMS["onCollectReward.Missing.Seed"],
  "onCollectReward.Market": ENGLISH_TERMS["onCollectReward.Market"],
  "onCollectReward.Missing.Shovel":
    ENGLISH_TERMS["onCollectReward.Missing.Shovel"],
  "onCollectReward.Missing.Shovel.description":
    ENGLISH_TERMS["onCollectReward.Missing.Shovel.description"],
};

const orderhelp: Record<OrderHelp, string> = {
  "orderhelp.Skip.hour": "要跳过订单，你必须在下订单后等待 24 小时。",
  "orderhelp.New.Season": ENGLISH_TERMS["orderhelp.New.Season"],
  "orderhelp.New.Season.arrival": ENGLISH_TERMS["orderhelp.New.Season.arrival"],
  "orderhelp.Wisely": ENGLISH_TERMS["orderhelp.Wisely"],
  "orderhelp.SkipIn": "跳入：",
  "orderhelp.NoRight": "先别跳",
  "orderhelp.ticket.deliveries.closed":
    ENGLISH_TERMS["orderhelp.ticket.deliveries.closed"],
};

const pending: Record<Pending, string> = {
  "pending.calcul": ENGLISH_TERMS["pending.calcul"],
  "pending.comeback": ENGLISH_TERMS["pending.comeback"],
};

const personHood: Record<PersonHood, string> = {
  "personHood.Details": ENGLISH_TERMS["personHood.Details"],
  "personHood.Identify": ENGLISH_TERMS["personHood.Identify"],
  "personHood.Congrat": ENGLISH_TERMS["personHood.Congrat"],
};

const pickserver: Record<Pickserver, string> = {
  "pickserver.server": ENGLISH_TERMS["pickserver.server"],
  "pickserver.full": ENGLISH_TERMS["pickserver.full"],
  "pickserver.explore": ENGLISH_TERMS["pickserver.explore"],
  "pickserver.built": ENGLISH_TERMS["pickserver.built"],
};

const piratechest: Record<PirateChest, string> = {
  "piratechest.greeting": ENGLISH_TERMS["piratechest.greeting"],
  "piratechest.refreshesIn": ENGLISH_TERMS["piratechest.refreshesIn"],
  "piratechest.warning": ENGLISH_TERMS["piratechest.warning"],
};

const pirateQuest: Record<PirateQuest, string> = {
  "questDescription.farmerQuest1":
    ENGLISH_TERMS["questDescription.farmerQuest1"],
  "questDescription.fruitQuest1": ENGLISH_TERMS["questDescription.fruitQuest1"],
  "questDescription.fruitQuest2": ENGLISH_TERMS["questDescription.fruitQuest2"],
  "questDescription.fruitQuest3": ENGLISH_TERMS["questDescription.fruitQuest3"],
  "questDescription.pirateQuest1":
    ENGLISH_TERMS["questDescription.pirateQuest1"],
  "questDescription.pirateQuest2":
    ENGLISH_TERMS["questDescription.pirateQuest2"],
  "questDescription.pirateQuest3":
    ENGLISH_TERMS["questDescription.pirateQuest3"],
  "questDescription.pirateQuest4":
    ENGLISH_TERMS["questDescription.pirateQuest4"],
  "piratequest.welcome": ENGLISH_TERMS["piratequest.welcome"],
  "piratequest.finestPirate": ENGLISH_TERMS["piratequest.finestPirate"],
};

const playerTrade: Record<PlayerTrade, string> = {
  "playerTrade.no.trade": ENGLISH_TERMS["playerTrade.no.trade"],
  "playerTrade.max.item": ENGLISH_TERMS["playerTrade.max.item"],
  "playerTrade.Progress": ENGLISH_TERMS["playerTrade.Progress"],
  "playerTrade.transaction": ENGLISH_TERMS["playerTrade.transaction"],
  "playerTrade.Please": ENGLISH_TERMS["playerTrade.Please"],
  "playerTrade.sold": ENGLISH_TERMS["playerTrade.sold"],
  "playerTrade.sale": ENGLISH_TERMS["playerTrade.sale"],
  "playerTrade.title.congrat": ENGLISH_TERMS["playerTrade.title.congrat"],
};

const portal: Record<Portal, string> = {
  "portal.wrong": ENGLISH_TERMS["portal.wrong"],
  "portal.unauthorised": ENGLISH_TERMS["portal.unauthorised"],
  "portal.example.intro": ENGLISH_TERMS["portal.example.intro"],
  "portal.example.claimPrize": ENGLISH_TERMS["portal.example.claimPrize"],
  "portal.example.purchase": ENGLISH_TERMS["portal.example.purchase"],
};

const promo: Record<Promo, string> = {
  "promo.cdcBonus": ENGLISH_TERMS["promo.cdcBonus"],
  "promo.expandLand": ENGLISH_TERMS["promo.expandLand"],
};

const purchaseableBaitTranslation: Record<PurchaseableBaitTranslation, string> =
  {
    "purchaseableBait.fishingLure.description":
      ENGLISH_TERMS["purchaseableBait.fishingLure.description"],
  };

const quest: Record<Quest, string> = {
  "quest.mint.free": ENGLISH_TERMS["quest.mint.free"],
  "quest.equipWearable": ENGLISH_TERMS["quest.equipWearable"],
  "quest.congrats": ENGLISH_TERMS["quest.congrats"],
};

const questions: Record<Questions, string> = {
  "questions.obtain.MATIC": ENGLISH_TERMS["questions.obtain.MATIC"],
  "questions.lowCash": ENGLISH_TERMS["questions.lowCash"],
};

const reaction: Record<Reaction, string> = {
  "reaction.bumpkin": ENGLISH_TERMS["reaction.bumpkin"],
  "reaction.bumpkin.10": ENGLISH_TERMS["reaction.bumpkin.10"],
  "reaction.bumpkin.30": ENGLISH_TERMS["reaction.bumpkin.30"],
  "reaction.bumpkin.40": ENGLISH_TERMS["reaction.bumpkin.40"],
  "reaction.sunflowers": ENGLISH_TERMS["reaction.sunflowers"],
  "reaction.crops": ENGLISH_TERMS["reaction.crops"],
  "reaction.goblin": ENGLISH_TERMS["reaction.goblin"],
  "reaction.crown": ENGLISH_TERMS["reaction.crown"],
};

const reactionBud: Record<ReactionBud, string> = {
  "reaction.bud.show": ENGLISH_TERMS["reaction.bud.show"],
  "reaction.bud.select": ENGLISH_TERMS["reaction.bud.select"],
  "reaction.bud.noFound": ENGLISH_TERMS["reaction.bud.noFound"],
};

const refunded: Record<Refunded, string> = {
  "refunded.itemsReturned": ENGLISH_TERMS["refunded.itemsReturned"],
  "refunded.goodLuck": ENGLISH_TERMS["refunded.goodLuck"],
};

const removeCropMachine: Record<RemoveCropMachine, string> = {
  "removeCropMachine.title": ENGLISH_TERMS["removeCropMachine.title"],
  "removeCropMachine.description":
    ENGLISH_TERMS["removeCropMachine.description"],
};

const removeHungryCaterpillar: Record<RemoveHungryCaterpillar, string> = {
  "removeHungryCaterpillar.title":
    ENGLISH_TERMS["removeHungryCaterpillar.title"],
  "removeHungryCaterpillar.description":
    ENGLISH_TERMS["removeHungryCaterpillar.description"],
  "removeHungryCaterpillar.removeFlowerSeeds":
    ENGLISH_TERMS["removeHungryCaterpillar.removeFlowerSeeds"],
  "removeHungryCaterpillar.confirmation":
    ENGLISH_TERMS["removeHungryCaterpillar.confirmation"],
};

const removeKuebiko: Record<RemoveKuebiko, string> = {
  "removeKuebiko.title": ENGLISH_TERMS["removeKuebiko.title"],
  "removeKuebiko.description": ENGLISH_TERMS["removeKuebiko.description"],
  "removeKuebiko.removeSeeds": ENGLISH_TERMS["removeKuebiko.removeSeeds"],
};

const resale: Record<Resale, string> = {
  "resale.actionText": ENGLISH_TERMS["resale.actionText"],
};

const resources: Record<Resources, string> = {
  "resources.recoversIn": "恢复时间：",
  "resources.boulder.rareMineFound":
    ENGLISH_TERMS["resources.boulder.rareMineFound"],
  "resources.boulder.advancedMining":
    ENGLISH_TERMS["resources.boulder.advancedMining"],
};

const resourceTerms: Record<ResourceTerms, string> = {
  "chicken.description": "用来下蛋",
  "magicMushroom.description": "用于烹饪高级食谱",
  "wildMushroom.description": "用于烹饪基础食谱",
  "honey.description": "用于使你的烹饪更甜",
};

const restrictionReason: Record<RestrictionReason, string> = {
  "restrictionReason.isGrowing": "{{item}} 正在生长",
  "restrictionReason.beanPlanted": "魔法豆已种植",
  "restrictionReason.cropsGrowing": "庄稼正在生长",
  "restrictionReason.basicCropsGrowing": "基础庄稼正在生长",
  "restrictionReason.mediumCropsGrowing": "中等庄稼正在生长",
  "restrictionReason.advancedCropsGrowing": "高级庄稼正在生长",
  "restrictionReason.fruitsGrowing": "水果正在生长",
  "restrictionReason.treesChopped": "树木已被砍伐",
  "restrictionReason.stoneMined": "石头已被开采",
  "restrictionReason.ironMined": "铁矿已被开采",
  "restrictionReason.goldMined": "金矿已被开采",
  "restrictionReason.crimstoneMined": "赤石已被开采",
  "restrictionReason.chickensFed": "鸡已被喂食",
  "restrictionReason.treasuresDug": "已有宝藏洞被挖掘",
  "restrictionReason.inUse": "正在使用",
  "restrictionReason.recentlyUsed": "最近使用过",
  "restrictionReason.recentlyFished": "最近钓过鱼",
  "restrictionReason.flowersGrowing": "花朵正在生长",
  "restrictionReason.beesBusy": "蜜蜂正忙着",
  "restrictionReason.pawShaken": "今日已握手",
  "restrictionReason.festiveSeason": "节日季节时被锁定",
  "restrictionReason.noRestriction": "没受限制",
  "restrictionReason.genieLampRubbed": "神灯已被摩擦",
  "restrictionReason.?cropGrowing": "{{crop}} is growing",
  "restrictionReason.oilReserveDrilled": "Oil reserves are drilled",
  "restrictionReason.buildingInUse":
    ENGLISH_TERMS["restrictionReason.buildingInUse"],
  "restrictionReason.beehiveInUse":
    ENGLISH_TERMS["restrictionReason.beehiveInUse"],
};

const restock: Record<Restock, string> = {
  "restock.one.buck": "你将使用1个Blockbuck来补充游戏中所有商店的物品。",
  "restock.sure": "你确定要补货吗？",
  "restock.tooManySeeds": "你的篮子里的种子太多了！",
  "seeds.reachingInventoryLimit": ENGLISH_TERMS["seeds.reachingInventoryLimit"],
};

const retreatTerms: Record<RetreatTerms, string> = {
  "retreatTerms.lookingForRareItems": "寻找稀有物品？",
  "retreatTerms.resale.one": "玩家可以在游戏中交易他们制作的特殊物品。",
  "retreatTerms.resale.two": "你可以在OpenSea等二手市场购买这些物品。",
  "retreatTerms.resale.three": "在OpenSea查看物品",
};

const rewardTerms: Record<RewardTerms, string> = {
  "reward.daily.reward": "每日奖励",
  "reward.streak": "连续天数",
  "reward.comeBackLater": "稍后回来领取更多奖励",
  "reward.nextBonus": "下一个奖励：",
  "reward.unlock": "解锁奖励",
  "reward.open": "打开奖励",
  "reward.lvlRequirement": "您必须达到3级才能领取每日奖励。",
  "reward.whatCouldItBe": "这会是什么呢？",
  "reward.streakBonus": "3倍连续奖励",
  "reward.found": "你发现了",
  "reward.spendWisely": "记得要明智地使用。",
  "reward.wearable": "你的乡包佬可穿戴的饰物",
  "reward.promo.code": "输入您的促销码：",
  "reward.woohoo": "呜呼！ 这是你的奖励：",
  "reward.connectWeb3Wallet": "连接Web3钱包以领取每日奖励。",
  "reward.factionPoints": "Earn glory for your faction!",
};

const rulesGameStart: Record<RulesGameStart, string> = {
  "rules.gameStart":
    "游戏开始时，植物将随机挑选4种药水和1种'混沌'药水的组合。这个组合可以完全不同或完全相同。",
  "rules.chaosPotionRule": "如果你添加了'混沌'药水，那么这次的游戏得分将为0。",
  "rules.potion.feedback": "选择你的药水，揭开植物的秘密！",
  "BloomBoost.description": "用鲜艳的花朵点燃你的植物！",
  "DreamDrip.description": "用魔法的梦想和幻想滋润你的植物。",
  "EarthEssence.description": "利用大地的力量培养你的植物。",
  "FlowerPower.description": "向你的植物释放一阵花卉能量。",
  "SilverSyrup.description": "一种甜蜜的糖浆，能使你的植物焕发最佳状态。",
  "HappyHooch.description": "一种能给植物带来欢笑与快乐的药水。",
  "OrganicOasis.description": "为你的植物创造一个郁郁葱葱的有机乐园。",
};

const rulesTerms: Record<RulesTerms, string> = {
  "game.rules": "游戏规则",
  "rules.oneAccountPerPlayer": "每个玩家只能拥有 1 个帐户。",
  "rules.gameNotFinancialProduct": "这是一个游戏，不是一个金融产品。",
  "rules.noBots": "不允许机器人和自动化。",
  "rules.termsOfService": "服务条款",
};

const pwaInstall: Record<PwaInstall, string> = {
  "install.app": "安装应用程序",
  "magic.link": "魔法链接",
  "generating.link": "生成链接",
  "generating.code": "生成二维码",
  "install.app.desktop.description":
    "扫描下方的二维码即可在您的设备上安装该应用。请务必在 Safari 或 Chrome 中打开它。",
  "install.app.mobile.metamask.description":
    "复制下方的魔法链接，然后在 {{browser}} 中打开进行安装！",
  "do.not.share.link": "请勿分享此链接！",
  "do.not.share.code": "请勿分享此二维码！",
  "qr.code.not.working": "二维码无法使用？",
};

const sceneDialogueKey: Record<SceneDialogueKey, string> = {
  "sceneDialogues.chefIsBusy": ENGLISH_TERMS["sceneDialogues.chefIsBusy"],
};

const seasonTerms: Record<SeasonTerms, string> = {
  "season.access": "你可以访问：",
  "season.banner": "季节性横幅",
  "season.bonusTickets": "完成交付后额外获得 2 张季票。",
  "season.boostXP": "进食时的经验增加 10%。",
  "season.buyNow": "立即购买",
  "season.discount": "售价为 SFL 的季节性商品可享受 25% 折扣。",
  "season.exclusiveOffer": "独家提供！",
  "season.goodLuck": "祝这个季节好运！",
  "season.includes": "包括：",
  "season.limitedOffer": "仅限时间！",
  "season.wearableAirdrop": "免费季节性可穿戴。",
  "season.place.land": "你必须将横幅放置在你的土地上",
  "season.megastore.discount": ENGLISH_TERMS["season.megastore.discount"],
  "season.supporter.gift": ENGLISH_TERMS["season.supporter.gift"],
  "season.free.season.passes": ENGLISH_TERMS["season.free.season.passes"],
  "season.free.season.passes.description":
    ENGLISH_TERMS["season.free.season.passes.description"],
  "season.vip.access": ENGLISH_TERMS["season.vip.access"],
  "season.vip.description": ENGLISH_TERMS["season.vip.description"],
  "season.mystery.gift": ENGLISH_TERMS["season.mystery.gift"],
  "season.xp.boost": ENGLISH_TERMS["season.xp.boost"],
  "season.lifetime.farmer": ENGLISH_TERMS["season.lifetime.farmer"],
  "season.free.with.lifetime": ENGLISH_TERMS["season.free.with.lifetime"],
  "season.vip.claim": ENGLISH_TERMS["season.vip.claim"],
};

const share: Record<Share, string> = {
  "share.TweetText": ENGLISH_TERMS["share.TweetText"],
  "share.ShareYourFarmLink": "分享您的农场链接",
  "share.ShowOffToFarmers": "通过分享您的农场链接来展示您的农场。",
  "share.FarmNFTImageAlt": ENGLISH_TERMS["share.FarmNFTImageAlt"],
  "share.CopyFarmURL": ENGLISH_TERMS["share.CopyFarmURL"],
  "share.Tweet": "推文",
  "share.chooseServer": ENGLISH_TERMS["share.chooseServer"],
  "share.FULL": ENGLISH_TERMS["share.FULL"],
  "share.exploreCustomIslands": ENGLISH_TERMS["share.exploreCustomIslands"],
  "share.buildYourOwnIsland": ENGLISH_TERMS["share.buildYourOwnIsland"],
};

const sharkBumpkinDialogues: Record<SharkBumpkinDialogues, string> = {
  "sharkBumpkin.dialogue.shhhh": ENGLISH_TERMS["sharkBumpkin.dialogue.shhhh"],
  "sharkBumpkin.dialogue.scareGoblins":
    ENGLISH_TERMS["sharkBumpkin.dialogue.scareGoblins"],
};

const shelly: Record<Shelly, string> = {
  "shelly.Dialogue.one": ENGLISH_TERMS["shelly.Dialogue.one"],
  "shelly.Dialogue.two": ENGLISH_TERMS["shelly.Dialogue.two"],
  "shelly.Dialogue.three": ENGLISH_TERMS["shelly.Dialogue.three"],
  "shelly.Dialogue.four": ENGLISH_TERMS["shelly.Dialogue.four"],
  "shelly.Dialogue.five": ENGLISH_TERMS["shelly.Dialogue.five"],
  "shelly.Dialogue.letsgo": ENGLISH_TERMS["shelly.Dialogue.letsgo"],
};

const shellyDialogue: Record<ShellyDialogue, string> = {
  "shellyPanelContent.tasksFrozen":
    ENGLISH_TERMS["shellyPanelContent.tasksFrozen"],
  "shellyPanelContent.canTrade": ENGLISH_TERMS["shellyPanelContent.canTrade"],
  "shellyPanelContent.cannotTrade":
    ENGLISH_TERMS["shellyPanelContent.cannotTrade"],
  "shellyPanelContent.swap": ENGLISH_TERMS["shellyPanelContent.swap"],
  "krakenIntro.congrats": ENGLISH_TERMS["krakenIntro.congrats"],
  "krakenIntro.noMoreTentacles": ENGLISH_TERMS["krakenIntro.noMoreTentacles"],
  "krakenIntro.gotIt": ENGLISH_TERMS["krakenIntro.gotIt"],
  "krakenIntro.appetiteChanges": ENGLISH_TERMS["krakenIntro.appetiteChanges"],
  "krakenIntro.currentHunger": ENGLISH_TERMS["krakenIntro.currentHunger"],
  "krakenIntro.catchInstruction": ENGLISH_TERMS["krakenIntro.catchInstruction"],
};

const shopItems: Record<ShopItems, string> = {
  "betty.post.sale.one": "嘿嘿！ 欢迎回来。",
  "betty.post.sale.two": "你们帮助解决了庄稼短缺问题，价格也恢复了正常。",
  "betty.post.sale.three": "是时候种植一些更大更好的庄稼了！",
  "betty.welcome": "欢迎来到我的市场。 你想干什么？",
  "betty.buySeeds": "购买种子",
  "betty.sellCrops": "卖庄稼",
};

const showingFarm: Record<ShowingFarm, string> = {
  "showing.farm": ENGLISH_TERMS["showing.farm"],
  "showing.wallet": ENGLISH_TERMS["showing.wallet"],
};

const snorklerDialogues: Record<SnorklerDialogues, string> = {
  "snorkler.vastOcean": ENGLISH_TERMS["snorkler.vastOcean"],
  "snorkler.goldBeneath": ENGLISH_TERMS["snorkler.goldBeneath"],
};

const somethingWentWrong: Record<SomethingWentWrong, string> = {
  "somethingWentWrong.supportTeam":
    ENGLISH_TERMS["somethingWentWrong.supportTeam"],
  "somethingWentWrong.jumpingOver":
    ENGLISH_TERMS["somethingWentWrong.jumpingOver"],
  "somethingWentWrong.askingCommunity":
    ENGLISH_TERMS["somethingWentWrong.askingCommunity"],
};

const specialEvent: Record<SpecialEvent, string> = {
  "special.event.link": ENGLISH_TERMS["special.event.link"],
  "special.event.claimForm": ENGLISH_TERMS["special.event.claimForm"],
  "special.event.airdropHandling":
    ENGLISH_TERMS["special.event.airdropHandling"],
  "special.event.walletRequired": ENGLISH_TERMS["special.event.walletRequired"],
  "special.event.web3Wallet": ENGLISH_TERMS["special.event.web3Wallet"],
  "special.event.airdrop": ENGLISH_TERMS["special.event.airdrop"],
  "special.event.finishedLabel": ENGLISH_TERMS["special.event.finishedLabel"],
  "special.event.finished": ENGLISH_TERMS["special.event.finished"],
  "special.event.ineligible": ENGLISH_TERMS["special.event.ineligible"],
  "special.event.easterIntro": ENGLISH_TERMS["special.event.easterIntro"],
  "special.event.rabbitsMissing": ENGLISH_TERMS["special.event.rabbitsMissing"],
};

const statements: Record<Statements, string> = {
  "statements.adventure": ENGLISH_TERMS["statements.adventure"],
  "statements.auctioneer.one": ENGLISH_TERMS["statements.auctioneer.one"],
  "statements.auctioneer.two": ENGLISH_TERMS["statements.auctioneer.two"],
  "statements.beta.one": ENGLISH_TERMS["statements.beta.one"],
  "statements.beta.two": ENGLISH_TERMS["statements.beta.two"],
  "statements.better.luck": ENGLISH_TERMS["statements.better.luck"],
  "statements.blacklist.one": ENGLISH_TERMS["statements.blacklist.one"],
  "statements.blacklist.two": ENGLISH_TERMS["statements.blacklist.two"],
  "statements.clickBottle": ENGLISH_TERMS["statements.clickBottle"],
  "statements.clock.one": ENGLISH_TERMS["statements.clock.one"],
  "statements.clock.two": ENGLISH_TERMS["statements.clock.two"],
  "statements.conversation.one": ENGLISH_TERMS["statements.conversation.one"],
  "statements.cooldown": ENGLISH_TERMS["statements.cooldown"],
  "statements.docs": ENGLISH_TERMS["statements.docs"],
  "statements.dontRefresh": "请勿刷新浏览器！",
  "statements.guide.one": ENGLISH_TERMS["statements.guide.one"],
  "statements.guide.two": ENGLISH_TERMS["statements.guide.two"],
  "statements.jigger.one": ENGLISH_TERMS["statements.jigger.one"],
  "statements.jigger.two": ENGLISH_TERMS["statements.jigger.two"],
  "statements.jigger.three": ENGLISH_TERMS["statements.jigger.three"],
  "statements.jigger.four": ENGLISH_TERMS["statements.jigger.four"],
  "statements.jigger.five": ENGLISH_TERMS["statements.jigger.five"],
  "statements.jigger.six": ENGLISH_TERMS["statements.jigger.six"],
  "statements.lvlUp": ENGLISH_TERMS["statements.lvlUp"],
  "statements.maintenance": ENGLISH_TERMS["statements.maintenance"],
  "statements.minted": ENGLISH_TERMS["statements.minted"],
  "statements.minting": ENGLISH_TERMS["statements.minting"],
  "statements.mutant.chicken": ENGLISH_TERMS["statements.mutant.chicken"],
  "statements.news": ENGLISH_TERMS["statements.news"],
  "statements.ohNo": ENGLISH_TERMS["statements.ohNo"],
  "statements.openGuide": ENGLISH_TERMS["statements.openGuide"],
  "statements.patience": ENGLISH_TERMS["statements.patience"],
  "statements.potionRule.one": ENGLISH_TERMS["statements.potionRule.one"],
  "statements.potionRule.two": ENGLISH_TERMS["statements.potionRule.two"],
  "statements.potionRule.three": ENGLISH_TERMS["statements.potionRule.three"],
  "statements.potionRule.four": ENGLISH_TERMS["statements.potionRule.four"],
  "statements.potionRule.five": ENGLISH_TERMS["statements.potionRule.five"],
  "statements.potionRule.six": ENGLISH_TERMS["statements.potionRule.six"],
  "statements.potionRule.seven": ENGLISH_TERMS["statements.potionRule.seven"],
  "statements.sflLim.one": ENGLISH_TERMS["statements.sflLim.one"],
  "statements.sflLim.two": ENGLISH_TERMS["statements.sflLim.two"],
  "statements.sniped": ENGLISH_TERMS["statements.sniped"],
  "statements.switchNetwork": ENGLISH_TERMS["statements.switchNetwork"],
  "statements.sync": "请耐心等待，我们会将您的进度存储在区块链上。",
  "statements.tapCont": "点击继续",

  "statements.tutorial.one": ENGLISH_TERMS["statements.tutorial.one"],
  "statements.tutorial.two": ENGLISH_TERMS["statements.tutorial.two"],
  "statements.tutorial.three": ENGLISH_TERMS["statements.tutorial.three"],
  "statements.visit.firePit": "访问 Fire Pit 做饭并喂你的乡巴佬。",
  "statements.wishing.well.info.four":
    ENGLISH_TERMS["statements.wishing.well.info.four"],
  "statements.wishing.well.info.five":
    ENGLISH_TERMS["statements.wishing.well.info.five"],
  "statements.wishing.well.info.six":
    ENGLISH_TERMS["statements.wishing.well.info.six"],
  "statements.wishing.well.worthwell":
    ENGLISH_TERMS["statements.wishing.well.worthwell"],
  "statements.wishing.well.look.like":
    ENGLISH_TERMS["statements.wishing.well.look.like"],
  "statements.wishing.well.lucky":
    ENGLISH_TERMS["statements.wishing.well.lucky"],
  "statements.wrongChain.one": ENGLISH_TERMS["statements.wrongChain.one"],
  "statements.feed.bumpkin.one": "你的库存中没有食物。",
  "statements.feed.bumpkin.two": "你需要烹饪食物来喂养你的土包。",
  "statements.empty.chest": ENGLISH_TERMS["statements.empty.chest"],
  "statements.chest.captcha": "点击箱子将其打开",
  "statements.frankie.plaza": ENGLISH_TERMS["statements.frankie.plaza"],
  "statements.blacksmith.plaza": ENGLISH_TERMS["statements.blacksmith.plaza"],
  "statements.water.well.needed.one": "需要追加 Water Well。",
  "statements.water.well.needed.two":
    "为了支持更多的庄稼，建造更多的 Water Well。",
  "statements.soldOut": "售罄",
  "statements.soldOutWearables": ENGLISH_TERMS["statements.soldOutWearables"],
  "statements.craft.composter": ENGLISH_TERMS["statements.craft.composter"],
  "statements.wallet.to.inventory.transfer":
    ENGLISH_TERMS["statements.wallet.to.inventory.transfer"],
  "statements.crop.water": ENGLISH_TERMS["statements.crop.water"],
  "statements.daily.limit": ENGLISH_TERMS["statements.daily.limit"],
  "statements.sure.buy": ENGLISH_TERMS["statements.sure.buy"],
  "statements.perplayer": ENGLISH_TERMS["statements.perplayer"],
  "statements.minted.goToChest": ENGLISH_TERMS["statements.minted.goToChest"],
  "statements.minted.withdrawAfterMint":
    ENGLISH_TERMS["statements.minted.withdrawAfterMint"],
  "statements.startgame": ENGLISH_TERMS["statements.startgame"],
  "statements.session.expired": ENGLISH_TERMS["statements.session.expired"],
  "statements.price.change": ENGLISH_TERMS["statements.price.change"],
  "statements.translation.joinDiscord": "加入 Discord",
};

const stopGoblin: Record<StopGoblin, string> = {
  "stopGoblin.stop.goblin": ENGLISH_TERMS["stopGoblin.stop.goblin"],
  "stopGoblin.stop.moon": ENGLISH_TERMS["stopGoblin.stop.moon"],
  "stopGoblin.tap.one": ENGLISH_TERMS["stopGoblin.tap.one"],
  "stopGoblin.tap.two": ENGLISH_TERMS["stopGoblin.tap.two"],
  "stopGoblin.left": ENGLISH_TERMS["stopGoblin.left"],
};

const swarming: Record<Swarming, string> = {
  "swarming.tooLongToFarm": ENGLISH_TERMS["swarming.tooLongToFarm"],
  "swarming.goblinsTakenOver": ENGLISH_TERMS["swarming.goblinsTakenOver"],
};

const tieBreaker: Record<TieBreaker, string> = {
  "tieBreaker.tiebreaker": ENGLISH_TERMS["tieBreaker.tiebreaker"],
  "tieBreaker.closeBid": ENGLISH_TERMS["tieBreaker.closeBid"],
  "tieBreaker.betterLuck": ENGLISH_TERMS["tieBreaker.betterLuck"],
  "tieBreaker.refund": ENGLISH_TERMS["tieBreaker.refund"],
};

const toolDescriptions: Record<ToolDescriptions, string> = {
  // Tools
  "description.axe": "用来砍木头",
  "description.pickaxe": "用于开采石头",
  "description.stone.pickaxe": "用于开采铁",
  "description.iron.pickaxe": "用于开采黄金",
  "description.rod": "用来抓鱼的",
  "description.rusty.shovel": "用于拆除建筑物和收藏品",
  "description.shovel": "用于种植和收获庄稼",
  "description.sand.shovel": "用来挖宝藏",
  "description.sand.drill": "深入挖掘不寻常或稀有的宝藏",
  "description.gold.pickaxe": "用于收集红宝石和日光石",
  "description.oil.drill": "石油钻探",
};

const trader: Record<Trader, string> = {
  "trader.you.pay": ENGLISH_TERMS["trader.you.pay"],
  "trader.price.per.unit": ENGLISH_TERMS["trader.price.per.unit"],
  "trader.goblin.fee": ENGLISH_TERMS["trader.goblin.fee"],
  "trader.they.receive": ENGLISH_TERMS["trader.they.receive"],
  "trader.seller.receives": ENGLISH_TERMS["trader.seller.receives"],
  "trader.buyer.pays": ENGLISH_TERMS["trader.buyer.pays"],
  "trader.cancel.trade": ENGLISH_TERMS["trader.cancel.trade"],
  "trader.you.receive": ENGLISH_TERMS["trader.you.receive"],
  "trader.PoH": ENGLISH_TERMS["trader.PoH"],
  "trader.start.verification": ENGLISH_TERMS["trader.start.verification"],
};

const transactionTerms: Record<TransactionTerms, string> = {
  "transaction.starterOffer": ENGLISH_TERMS["transaction.starterOffer"],
  "transaction.t&c.one": ENGLISH_TERMS["transaction.t&c.one"],
  "transaction.t&c.two": ENGLISH_TERMS["transaction.t&c.two"],
  "transaction.mintFarm": ENGLISH_TERMS["transaction.mintFarm"],
  "transaction.farm.ready": ENGLISH_TERMS["transaction.farm.ready"],
  "transaction.networkFeeRequired":
    ENGLISH_TERMS["transaction.networkFeeRequired"],
  "transaction.estimated.fee": ENGLISH_TERMS["transaction.estimated.fee"],
  "transaction.payCardCash": ENGLISH_TERMS["transaction.payCardCash"],
  "transaction.creditCard": ENGLISH_TERMS["transaction.creditCard"],
  "transaction.rejected": ENGLISH_TERMS["transaction.rejected"],
  "transaction.message0": ENGLISH_TERMS["transaction.message0"],
  "transaction.noFee": ENGLISH_TERMS["transaction.noFee"],
  "transaction.chooseDonationGame":
    ENGLISH_TERMS["transaction.chooseDonationGame"],
  "transaction.minblockbucks": ENGLISH_TERMS["transaction.minblockbucks"],
  "transaction.payCash": ENGLISH_TERMS["transaction.payCash"],
  "transaction.matic": ENGLISH_TERMS["transaction.matic"],
  "transaction.payMatic": ENGLISH_TERMS["transaction.payMatic"],
  "transaction.storeBlockBucks": ENGLISH_TERMS["transaction.storeBlockBucks"],
  "transaction.excludeFees": ENGLISH_TERMS["transaction.excludeFees"],
  "transaction.storeProgress.blockchain.one":
    "你想把你的进度存储在区块链上吗？",
  "transaction.storeProgress.blockchain.two":
    "将您的进度存储在区块链上并不会补充市场或车间的库存。",
  "transaction.storeProgress": "存储在区块链上",
  "transaction.storeProgress.chain": "存储在区块链上",
  "transaction.storeProgress.success": "哇喔！你的进度已存储在区块链上！",
  "transaction.trade.congrats": ENGLISH_TERMS["transaction.trade.congrats"],
  "transaction.processing": ENGLISH_TERMS["transaction.processing"],
  "transaction.pleaseWait": ENGLISH_TERMS["transaction.pleaseWait"],
  "transaction.unconfirmed.reset":
    ENGLISH_TERMS["transaction.unconfirmed.reset"],
  "transaction.withdraw.one": ENGLISH_TERMS["transaction.withdraw.one"],
  "transaction.withdraw.sent": ENGLISH_TERMS["transaction.withdraw.sent"],
  "transaction.withdraw.view": ENGLISH_TERMS["transaction.withdraw.view"],
  "transaction.openSea": ENGLISH_TERMS["transaction.openSea"],
  "transaction.withdraw.four": ENGLISH_TERMS["transaction.withdraw.four"],
  "transaction.withdraw.five": ENGLISH_TERMS["transaction.withdraw.five"],
  "transaction.displayItems": ENGLISH_TERMS["transaction.displayItems"],
  "transaction.withdraw.polygon": ENGLISH_TERMS["transaction.withdraw.polygon"],
  "transaction.id": ENGLISH_TERMS["transaction.id"],
  "transaction.termsOfService": ENGLISH_TERMS["transaction.termsOfService"],
  "transaction.termsOfService.one":
    ENGLISH_TERMS["transaction.termsOfService.one"],
  "transaction.termsOfService.two":
    ENGLISH_TERMS["transaction.termsOfService.two"],
  "transaction.buy.BlockBucks": ENGLISH_TERMS["transaction.buy.BlockBucks"],
};

const transfer: Record<Transfer, string> = {
  "transfer.sure.adress":
    "请确保您提供的钱包地址在 Polygon 区块链上，正确且归您所有。如果您输入错误的钱包地址，您将无法恢复您的农场。",
  "transfer.Account": "您的农场 #{{farmID}} 已转移到 {{receivingAddress}}！",
  "transfer.Farm": "您正在转移您的农场！",
  "transfer.Refresh": "请勿刷新浏览器！",
  "transfer.Taccount": "转移农场所有权",
  "transfer.address": "接收钱包地址：",
};

const treasureModal: Record<TreasureModal, string> = {
  "treasureModal.noShovelTitle": ENGLISH_TERMS["treasureModal.noShovelTitle"],
  "treasureModal.needShovel": ENGLISH_TERMS["treasureModal.needShovel"],
  "treasureModal.purchaseShovel": ENGLISH_TERMS["treasureModal.purchaseShovel"],
  "treasureModal.gotIt": ENGLISH_TERMS["treasureModal.gotIt"],
  "treasureModal.maxHolesTitle": ENGLISH_TERMS["treasureModal.maxHolesTitle"],
  "treasureModal.saveTreasure": ENGLISH_TERMS["treasureModal.saveTreasure"],
  "treasureModal.comeBackTomorrow":
    ENGLISH_TERMS["treasureModal.comeBackTomorrow"],
  "treasureModal.drilling": ENGLISH_TERMS["treasureModal.drilling"],
};

const tutorialPage: Record<TutorialPage, string> = {
  "tutorial.pageOne.text1": ENGLISH_TERMS["tutorial.pageOne.text1"],
  "tutorial.pageOne.text2": ENGLISH_TERMS["tutorial.pageOne.text2"],
  "tutorial.pageTwo.text1": ENGLISH_TERMS["tutorial.pageTwo.text1"],
  "tutorial.pageTwo.text2": ENGLISH_TERMS["tutorial.pageTwo.text2"],
};

const username: Record<Username, string> = {
  "username.tooShort": ENGLISH_TERMS["username.tooShort"],
  "username.tooLong": ENGLISH_TERMS["username.tooLong"],
  "username.invalidChar": ENGLISH_TERMS["username.invalidChar"],
  "username.startWithLetter": ENGLISH_TERMS["username.startWithLetter"],
};

const visitislandEnter: Record<VisitislandEnter, string> = {
  "visitIsland.enterIslandId": "输入岛屿ID",
  "visitIsland.visit": "拜访",
};

const visitislandNotFound: Record<VisitislandNotFound, string> = {
  "visitislandNotFound.title": "未找到島嶼！",
};

const wallet: Record<Wallet, string> = {
  "wallet.connect": ENGLISH_TERMS["wallet.connect"],
  "wallet.linkWeb3": ENGLISH_TERMS["wallet.linkWeb3"],
  "wallet.setupWeb3": ENGLISH_TERMS["wallet.setupWeb3"],
  "wallet.wrongWallet": ENGLISH_TERMS["wallet.wrongWallet"],
  "wallet.connectedWrongWallet": ENGLISH_TERMS["wallet.connectedWrongWallet"],
  "wallet.missingNFT": ENGLISH_TERMS["wallet.missingNFT"],
  "wallet.requireFarmNFT": ENGLISH_TERMS["wallet.requireFarmNFT"],
  "wallet.uniqueFarmNFT": ENGLISH_TERMS["wallet.uniqueFarmNFT"],
  "wallet.mintFreeNFT": ENGLISH_TERMS["wallet.mintFreeNFT"],
  "wallet.wrongChain": ENGLISH_TERMS["wallet.wrongChain"],
  "wallet.walletAlreadyLinked": ENGLISH_TERMS["wallet.walletAlreadyLinked"],
  "wallet.linkAnotherWallet": ENGLISH_TERMS["wallet.linkAnotherWallet"],
  "wallet.transferFarm": ENGLISH_TERMS["wallet.transferFarm"],
  "wallet.signRequest": "签署",
  "wallet.signRequestInWallet": "请在你的钱包中签署请求以继续。",
};

const warningTerms: Record<WarningTerms, string> = {
  "warning.noAxe": ENGLISH_TERMS["warning.noAxe"],
  "warning.chat.maxCharacters": "最大字符数",
  "warning.chat.noSpecialCharacters":
    ENGLISH_TERMS["warning.chat.noSpecialCharacters"],
  "warning.level.required": "需要 {{lvl}} 级",
  "warning.hoarding.message": ENGLISH_TERMS["warning.hoarding.message"],
  // indefiniteArticle: 'a' or 'an' depending if first letter is vowel.
  // If this is not used in your language, leave the `{{indefiniteArticle}}` part out
  "warning.hoarding.indefiniteArticle.a": "a", // Leave this blank if not needed
  "warning.hoarding.indefiniteArticle.an": "an", // Leave this blank if not needed
  "warning.hoarding.one": ENGLISH_TERMS["warning.hoarding.one"],
  "warning.hoarding.two": ENGLISH_TERMS["warning.hoarding.two"],
  "travelRequirement.notice": ENGLISH_TERMS["travelRequirement.notice"],
};

const welcomeTerms: Record<WelcomeTerms, string> = {
  "welcome.createAccount": "创建账户",
  "welcome.creatingAccount": "创建你的帐户",
  "welcome.email": "电子邮件和社交登录",
  "welcome.login": "登录",
  "welcome.needHelp": "需要帮忙？",
  "welcome.otherWallets": "其他钱包",
  "welcome.signingIn": "正在登录",
  "welcome.signIn.Message": "接受浏览器钱包中的签名请求即可登录。",
  "welcome.takeover.ownership":
    "你似乎是 Sunflower Land 的新手，并且已声明拥有其他玩家帐户的所有权。",
  "welcome.promo": "添加促销代码",
  "welcome.offline": "嘿，乡巴佬，你似乎不在线。请检查你的网络连接。",
};

const winner: Record<Winner, string> = {
  "winner.mintTime": ENGLISH_TERMS["winner.mintTime"],
  "winner.mintTime.one": ENGLISH_TERMS["winner.mintTime.one"],
};

const wishingWellTerms: Record<WishingWell, string> = {
  "wishingWell.makeWish": ENGLISH_TERMS["wishingWell.makeWish"],
  "wishingWell.newWish": ENGLISH_TERMS["wishingWell.newWish"],
  "wishingWell.noReward": ENGLISH_TERMS["wishingWell.noReward"],
  "wishingWell.wish.lucky": ENGLISH_TERMS["wishingWell.wish.lucky"],
  "wishingWell.sflRewardsReceived":
    ENGLISH_TERMS["wishingWell.sflRewardsReceived"],
  "wishingWell.wish.grantTime": ENGLISH_TERMS["wishingWell.wish.grantTime"],
  "wishingWell.wish.granted": ENGLISH_TERMS["wishingWell.wish.granted"],
  "wishingWell.wish.made": ENGLISH_TERMS["wishingWell.wish.made"],
  "wishingWell.wish.timeTillNextWish":
    ENGLISH_TERMS["wishingWell.wish.timeTillNextWish"],
  "wishingWell.wish.thanksForSupport":
    ENGLISH_TERMS["wishingWell.wish.thanksForSupport"],
  "wishingWell.wish.comeBackAfter":
    ENGLISH_TERMS["wishingWell.wish.comeBackAfter"],
  "wishingWell.wish.warning.one": ENGLISH_TERMS["wishingWell.wish.warning.one"],
  "wishingWell.wish.warning.two": ENGLISH_TERMS["wishingWell.wish.warning.two"],
  "wishingWell.info.one": ENGLISH_TERMS["wishingWell.info.one"],
  "wishingWell.info.two": ENGLISH_TERMS["wishingWell.info.two"],
  "wishingWell.info.three": ENGLISH_TERMS["wishingWell.info.three"],
  "wishingWell.moreInfo": ENGLISH_TERMS["wishingWell.moreInfo"],
  "wishingWell.noLiquidity": ENGLISH_TERMS["wishingWell.noLiquidity"],
  "wishingWell.rewardsInWell": ENGLISH_TERMS["wishingWell.rewardsInWell"],
  "wishingWell.luck": ENGLISH_TERMS["wishingWell.luck"],
};

const withdraw: Record<Withdraw, string> = {
  "withdraw.proof": "为了确保游戏安全，我们恳请您快速自拍一张照片以验证身份。",
  "withdraw.verification": "开创验证",
  "withdraw.unsave": "请注意，任何未保存的进度都将丢失。",
  "withdraw.sync": "只有已存储在区块链上的物品才可以被提取。",
  "withdraw.available": "5 月 9 日起发售。",
  "withdraw.sfl.available": "SFL 现已在链上使用。",
  "withdraw.send.wallet": "已存入您的钱包。",
  "withdraw.choose": "请指定您想要提取的 SFL 金额",
  "withdraw.receive": "您将收到： {{sflReceived}} SFL",
  "withdraw.select.item": "请选择要提取的商品",
  "withdraw.opensea": "提现成功后，您将能够在 OpenSea 上查看您的物品。",
  "withdraw.restricted": ENGLISH_TERMS["withdraw.restricted"], // To interpolate
  "withdraw.bumpkin.wearing":
    "你的乡巴佬目前穿着以下无法撤回的衣服。你需要先更换衣服，然后才能撤回。",
  "withdraw.bumpkin.sure.withdraw": "您确定要撤回您的乡巴佬吗？",
  "withdraw.buds": "请选择要退出的 Buds",
  "withdraw.budRestricted": "用于今天的 Bud Box",
  "withdraw.bumpkin.closed": ENGLISH_TERMS["withdraw.bumpkin.closed"],
  "withdraw.bumpkin.closing": ENGLISH_TERMS["withdraw.bumpkin.closing"],
};

const world: Record<World, string> = {
  "world.intro.one": "你好，旅行者！欢迎来到南瓜广场。",
  "world.intro.two": "广场上住着一群饥饿的乡巴佬和妖精，他们需要你的帮助！",
  "world.intro.delivery": ENGLISH_TERMS["world.intro.delivery"],
  "world.intro.levelUpToTravel": ENGLISH_TERMS["world.intro.levelUpToTravel"],
  "world.intro.find": ENGLISH_TERMS["world.intro.find"],
  "world.intro.findNPC": ENGLISH_TERMS["world.intro.findNPC"],
  "world.intro.missingDelivery": ENGLISH_TERMS["world.intro.missingDelivery"],
  "world.intro.visit":
    "与非玩家角色进行互动并成功完成运送任务以获取 SFL 和特殊奖励。",
  "world.intro.craft": "在不同的商店制作稀有的收藏品、可穿戴物品和装饰品。",
  "world.intro.carf.limited": "快点，商品仅在有限时间内可用！",
  "world.intro.trade":
    "与其他玩家交易资源。要与玩家互动，请走近他们并点击他们。",
  "world.intro.auction":
    "准备好您的资源并前往拍卖行与其他玩家进行竞争性竞标，以争夺独家和抢手的收藏品！",
  "world.intro.four": "使用箭头键移动你的乡巴佬。",
  "world.intro.five": "在触摸屏上，使用操纵杆。",
  "world.intro.six": "要与乡巴佬或物体互动，请接近它并点击它。",
  "world.intro.seven":
    "请避免任何形式的骚扰、亵渎或欺凌行为。我们恳请您尊重和体谅他人。感谢您的合作。",

  "world.plaza": "广场",
  "world.beach": "沙滩",
  "world.retreat": "退留地", //Retreat -> Residence
  "world.home": "家园",
  "world.kingdom": "王国",
  "world.woodlands": "林地",
  "world.travelTo": "前往{{location}}",
};

const wornDescription: Record<WornDescription, string> = {
  "worm.earthworm": "吸引小鱼的蠕虫。",
  "worm.grub": "多汁的幼虫——非常适合高级鱼类。",
  "worm.redWiggler": "吸引稀有鱼类的奇异蠕虫。",
};

const trading: Record<Trading, string> = {
  "trading.select.resources": "请选择资源以查看挂单",
  "trading.no.listings": "未找到任何挂单",
  "trading.listing.congrats": "恭喜，您刚刚列出了要交易的物品！",
  "trading.listing.deleted": "您的挂单已被删除",
  "trading.listing.fulfilled": "交易已完成",
  "trading.your.listing": "您的挂单",
  "trading.you.receive": "You receive", // not used
  "trading.burned": "is burned.", // not used
};

const leaderboardTerms: Record<Leaderboard, string> = {
  "leaderboard.leaderboard": ENGLISH_TERMS["leaderboard.leaderboard"],
  "leaderboard.error": ENGLISH_TERMS["leaderboard.error"],
  "leaderboard.initialising": ENGLISH_TERMS["leaderboard.initialising"],
  "leaderboard.topTen": ENGLISH_TERMS["leaderboard.topTen"],
  "leaderboard.yourPosition": ENGLISH_TERMS["leaderboard.yourPosition"],
  "leaderboard.factionMembers": ENGLISH_TERMS["leaderboard.factionMembers"],
};

const gameOptions: Record<GameOptions, string> = {
  "gameOptions.title": "游戏设置", // using “Game Settings"
  "gameOptions.howToPlay": ENGLISH_TERMS["gameOptions.howToPlay"],
  "gameOptions.farmId": "农场 ID #{{farmId}}",
  "gameOptions.logout": "登出",
  "gameOptions.confirmLogout": "您确定要登出吗？",

  "gameOptions.generalSettings.darkMode": "酷黑",
  "gameOptions.generalSettings.font": "字体",
  "gameOptions.generalSettings.lightMode": "明亮",

  // Testnet
  "gameOptions.amoyActions": ENGLISH_TERMS["gameOptions.amoyActions"], // Testnet
  "gameOptions.amoyActions.timeMachine":
    ENGLISH_TERMS["gameOptions.amoyActions.timeMachine"], // Testnet

  // Blockchain Settings
  "gameOptions.blockchainSettings": "区块链设置",
  "gameOptions.blockchainSettings.refreshChain": "从区块链刷新",
  "gameOptions.blockchainSettings.storeOnChain": "存储在区块链上",
  "gameOptions.blockchainSettings.swapMaticForSFL": "将 MATIC 换成 SFL",
  "gameOptions.blockchainSettings.transferOwnership": "转移农场所有权",

  // General Settings
  "gameOptions.generalSettings": "通用设置",
  "gameOptions.generalSettings.connectDiscord":
    ENGLISH_TERMS["gameOptions.generalSettings.connectDiscord"],
  "gameOptions.generalSettings.assignRole":
    ENGLISH_TERMS["gameOptions.generalSettings.assignRole"],
  "gameOptions.generalSettings.changeLanguage": "更改语言",
  "gameOptions.generalSettings.disableAnimations": "禁用动画",
  "gameOptions.generalSettings.enableAnimations": "启用动画",
  "gameOptions.generalSettings.share": "分享",
  "gameOptions.plazaSettings": "广场设置",
  "gameOptions.plazaSettings.title.mutedPlayers": "静音玩家",
  "gameOptions.plazaSettings.title.keybinds": "按键绑定",
  "gameOptions.generalSettings.appearance": "外观",
  "gameOptions.plazaSettings.mutedPlayers.description":
    "如果您使用 /mute 命令将某些玩家静音，您可以在此处查看并取消静音。",
  "gameOptions.plazaSettings.keybinds.description":
    "想要知道有哪些按键绑定可用？请在此处查看。",
  "gameOptions.plazaSettings.noMutedPlayers": "您没有将任何玩家静音。",
  "gameOptions.plazaSettings.changeServer": "更改服务器",
};

const bumpkinPart: Record<BumpkinPart, string> = {
  "equip.background": ENGLISH_TERMS["equip.background"],
  "equip.hair": ENGLISH_TERMS["equip.hair"],
  "equip.body": ENGLISH_TERMS["equip.body"],
  "equip.shirt": ENGLISH_TERMS["equip.shirt"],
  "equip.pants": ENGLISH_TERMS["equip.pants"],
  "equip.shoes": ENGLISH_TERMS["equip.shoes"],
  "equip.tool": ENGLISH_TERMS["equip.tool"],
  "equip.necklace": ENGLISH_TERMS["equip.necklace"],
  "equip.coat": ENGLISH_TERMS["equip.coat"],
  "equip.hat": ENGLISH_TERMS["equip.hat"],
  "equip.secondaryTool": ENGLISH_TERMS["equip.secondaryTool"],
  "equip.onesie": ENGLISH_TERMS["equip.onesie"],
  "equip.suit": ENGLISH_TERMS["equip.suit"],
  "equip.wings": ENGLISH_TERMS["equip.wings"],
  "equip.dress": ENGLISH_TERMS["equip.dress"],
  "equip.beard": ENGLISH_TERMS["equip.beard"],
};

const greenhouse: Record<GreenhouseKeys, string> = {
  "greenhouse.oilDescription": ENGLISH_TERMS["greenhouse.oilDescription"],
  "greenhouse.oilRequired": ENGLISH_TERMS["greenhouse.oilRequired"],
  "greenhouse.oilInMachine": ENGLISH_TERMS["greenhouse.oilInMachine"],
  "greenhouse.insertOil": ENGLISH_TERMS["greenhouse.insertOil"],
  "greenhouse.numberOil": ENGLISH_TERMS["greenhouse.numberOil"],
};

const minigame: Record<Minigame, string> = {
  "minigame.chickenRescue": ENGLISH_TERMS["minigame.chickenRescue"],
  "minigame.comingSoon": ENGLISH_TERMS["minigame.comingSoon"],
  "minigame.completed": ENGLISH_TERMS["minigame.completed"],
  "minigame.confirm": ENGLISH_TERMS["minigame.confirm"],
  "minigame.noPrizeAvailable": ENGLISH_TERMS["minigame.noPrizeAvailable"],
  "minigame.playNow": ENGLISH_TERMS["minigame.playNow"],
  "minigame.purchase": ENGLISH_TERMS["minigame.purchase"],
  "minigame.chickenRescueHelp": ENGLISH_TERMS["minigame.chickenRescueHelp"],
  "minigame.discovered.one": ENGLISH_TERMS["minigame.discovered.one"],
  "minigame.discovered.two": ENGLISH_TERMS["minigame.discovered.two"],
  "minigame.communityEvent": ENGLISH_TERMS["minigame.communityEvent"],
  "minigame.festivalOfColors": ENGLISH_TERMS["minigame.festivalOfColors"],
  "minigame.festivalOfColors.comingSoon":
    ENGLISH_TERMS["minigame.festivalOfColors.comingSoon"],
  "minigame.festivalOfColors.intro":
    ENGLISH_TERMS["minigame.festivalOfColors.intro"],
  "minigame.festivalOfColors.mission":
    ENGLISH_TERMS["minigame.festivalOfColors.mission"],
};

export const easterEggTerms: Record<EasterEggKeys, string> = {
  "easterEgg.queensDiary": "Victoria's Diary",
  "easterEgg.jesterDiary": "Jester's Diary",
  "easterEgg.tywinDiary": "Tywin's Diary",
  "easterEgg.kingDiary": "King's Diary",
  "easterEgg.knight": ENGLISH_TERMS["easterEgg.knight"],
  "easterEgg.lostKnight": ENGLISH_TERMS["easterEgg.lostKnight"],
  "easterEgg.kingdomBook1": ENGLISH_TERMS["easterEgg.kingdomBook1"],
  "easterEgg.kingdomBook2": ENGLISH_TERMS["easterEgg.kingdomBook2"],
  "easterEgg.kingdomBook3": ENGLISH_TERMS["easterEgg.kingdomBook3"],
  "easterEgg.kingdomBook4": ENGLISH_TERMS["easterEgg.kingdomBook4"],
  "easterEgg.kingdomBook5": ENGLISH_TERMS["easterEgg.kingdomBook5"],
};

export const CHINESE_SIMPLIFIED_TERMS: Record<TranslationKeys, string> = {
  ...achievementTerms,
  ...addSFL,
  ...auction,
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
  ...bumpkinPartRequirements,
  ...bumpkinSkillsDescription,
  ...bumpkinTrade,
  ...buyFarmHand,
  ...changeLanguage,
  ...chat,
  ...chickenWinner,
  ...choresStart,
  ...chumDetails,
  ...claimAchievement,
  ...community,
  ...compostDescription,
  ...composterDescription,
  ...confirmationTerms,
  ...confirmSkill,
  ...conversations,
  ...cropBoomMessages,
  ...cropFruitDescriptions,
  ...cropMachine,
  ...decorationDescriptions,
  ...defaultDialogue,
  ...delivery,
  ...deliveryHelp,
  ...deliveryitem,
  ...depositWallet,
  ...detail,
  ...discordBonus,
  ...donation,
  ...draftBid,
  ...errorAndAccess,
  ...errorTerms,
  ...event,
  ...exoticShopItems,
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
  ...gameDescriptions,
  ...gameTerms,
  ...gameOptions,
  ...garbageCollector,
  ...generalTerms,
  ...genieLamp,
  ...getContent,
  ...getInputErrorMessage,
  ...goblin_messages,
  ...goblinTrade,
  ...goldTooth,
  ...guideCompost,
  ...guideTerms,
  ...halveningCountdown,
  ...harvestBeeHive,
  ...harvestflower,
  ...hayseedHankPlaza,
  ...hayseedHankV2,
  ...heliosSunflower,
  ...helper,
  ...henHouseTerms,
  ...howToFarm,
  ...howToSync,
  ...howToUpgrade,
  ...interactableModals,
  ...introPage,
  ...islandName,
  ...islandNotFound,
  ...islandupgrade,
  ...landscapeTerms,
  ...letsGo,
  ...levelUpMessages,
  ...loser,
  ...lostSunflorian,
  ...megaStore,
  ...milestoneMessages,
  ...modalDescription,
  ...nftminting,
  ...noaccount,
  ...noBumpkin,
  ...notOnDiscordServer,
  ...noTownCenter,
  ...npc_message,
  ...npc,
  ...npcDialogues,
  ...nyeButton,
  ...NYON_STATUE,
  ...obsessionDialogue,
  ...offer,
  ...onboarding,
  ...onCollectReward,
  ...orderhelp,
  ...pending,
  ...personHood,
  ...pickserver,
  ...piratechest,
  ...pirateQuest,
  ...playerTrade,
  ...portal,
  ...promo,
  ...purchaseableBaitTranslation,
  ...pwaInstall,
  ...quest,
  ...questions,
  ...reaction,
  ...reactionBud,
  ...refunded,
  ...removeKuebiko,
  ...removeCropMachine,
  ...resale,
  ...resources,
  ...resourceTerms,
  ...restock,
  ...restrictionReason,
  ...retreatTerms,
  ...rewardTerms,
  ...rulesGameStart,
  ...rulesTerms,
  ...sceneDialogueKey,
  ...seasonTerms,
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
  ...swarming,
  ...tieBreaker,
  ...timeUnits,
  ...toolDescriptions,
  ...trader,
  ...trading,
  ...transactionTerms,
  ...transfer,
  ...treasureModal,
  ...tutorialPage,
  ...visitislandEnter,
  ...visitislandNotFound,
  ...wallet,
  ...warningTerms,
  ...welcomeTerms,
  ...winner,
  ...wishingWellTerms,
  ...withdraw,
  ...world,
  ...wornDescription,
  ...factions,
  ...removeHungryCaterpillar,
  ...leaderboardTerms,
  ...bumpkinPart,
  ...greenhouse,
  ...minigame,
  ...username,
  ...easterEggTerms,
};
