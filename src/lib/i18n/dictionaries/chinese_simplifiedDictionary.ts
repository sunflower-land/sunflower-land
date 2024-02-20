import { ENGLISH_TERMS } from "./englishDictionary";
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
} from "./types";

const generalTerms: Record<GeneralTerms, string> = {
  "2x.sale": "2 倍卖价",
  advanced: "高级", //setting
  achievements: "成就",
  accept: "接受",
  "accepting.terms": "接受条款中……",
  "amount.matic": "MATIC 换算数额",
  deposit: "存入",
  add: "添加",
  addSFL: "添加 SFL",
  "add.liquidity": "添加流动性",
  "alr.bought": "已购买",
  "alr.claim": "已领取！",
  "alr.completed": "已完成",
  "alr.crafted": "已锻造！",
  "alr.minted": "已铸造！",
  auction: "竞拍",
  auctions: "竞拍",
  "available.all.year": "全年常驻：",
  available: "可用",
  back: "返回",
  bait: "鱼饵", // Basket
  balance: "余额：",
  basket: "篮子",
  "beach.bounty": "沙岸财宝",
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
  common: "普通",
  completed: "已完成",
  confirm: "确认",
  congrats: "恭喜！",
  connected: "已连接",
  connecting: "连接中",
  continue: "继续",
  cook: "烹饪",
  copied: "已复制",
  "copy.address": "复制地址",
  coupons: "票券", // Basket
  craft: "锻造",
  crafting: "锻造", // Map Selection Tag
  crops: "庄稼",
  "currently.Unavailable": "目前不可用！",
  danger: "危险",
  date: "日期",
  decoration: "装饰",
  deliveries: "送货",
  delivery: "送货",
  details: "详情：",
  donate: "捐赠",
  donating: "捐赠中",
  "drafting.noitem": "没有物品可供上架",
  "drafting.select": "选择要上架的物品",
  "drafting.trade.detail": "买卖详情",
  dragMe: "拖我",
  earn: "挣得",
  "easter.eggs": "复活节彩蛋",
  egg: "蛋",
  empty: "空的",
  equip: "装备",
  error: "错误",
  exotics: "魔法", // Translated from “magic” for contextual purposes
  "expand.land": "拓张你的地块",
  expand: "拓张",
  explore: "探索",
  farm: "农场",
  "farm.storage": "农场库存",
  featured: "新增", // from “Featured” to “Newly Added”
  fee: "费用",
  "feed.bumpkin": "喂乡包佬",
  fertilisers: "肥料",
  fish: "鱼类", // Basket
  "fish.caught": "捕获的鱼：",
  flowers: "花卉", // Basket
  foods: "食品", // Basket
  for: "换", // meaning “swap”
  "for.info.wearable": "了解此饰物详情",
  forbidden: "禁止入内", // meaning forbidden to enter
  fruit: "水果",
  fruits: "水果", // Basket
  "go.home": "回农场",
  "goblin.delivery": "哥布林将送货分成放在珠宝库里。查览也可到此处 {{opensea}}",
  gotIt: "知道了",
  goto: "去",
  "grant.wish": "许下新愿望",
  guide: "指南",
  honey: "蜂蜜",
  "hungry?": "饿了么？",
  info: "概览",
  item: "物品：",
  land: "农场",
  "land.id": "农场 ID：",
  "last.updated": "最近更新时间：",
  left: "剩余", // context is amount of stock left, Megashop time left
  "let'sDoThis": "让我们开始吧!", // not used
  "lets.go": "走吧！",
  limit: "上限", // Megastore error message, Limit: Balance / Limit
  list: "上架",
  "list.trade": "买卖上架", // Might be better to use “List item”
  loading: "加载中",
  "loser.refund": "退还资源",
  lvl: "级",
  maintenance: "维护中", // added meaning to “Under Maintenance”
  "make.wish": "许一个愿望",
  "making.wish": "正在许愿",
  max: "最多",
  minimum: "至少",
  mint: "铸造",
  minting: "正在铸造",
  music: "音乐",
  next: "继续", // meaning changed to “Continue” since used on UI page turn
  nextSkillPtLvl: "新技能点等级：", // adjusted from “Next skill point: level”
  no: "否",
  "no.have.bumpkin": "你并未持有一个乡包佬!",
  "no.limits.exceeded": "未超出上限", // only in testnet can skip
  "no.mail": "没有邮件",
  "no.thanks": "免了谢谢",
  "ocean.fishing": "海上垂钓",
  off: "关",
  "offer.end": "报价截止余",
  ok: "好",
  on: "开",
  "open.gift": "打开礼物",
  "pass.required": "需要通行证",
  "place.map": "放置地图上",
  "placing.bid": "投标中",
  plant: "种植",
  "please.try.again": "请稍后再试。",
  "please.wait": "请耐心等候",
  "pay.attention.feedback": "请留意反馈图标：",
  print: "打印", // builder file, is it only in testnet?
  "promo.code": "优惠码",
  "providing.liquidity": "提供流动性",
  purchased: "已购买",
  purchasing: "购买中",
  rank: "排名",
  rare: "稀罕",
  "read.more": "更多详情", // translated to “More Info”
  "ready.trade": "准备好做买卖了吗？",
  refresh: "刷新",
  refreshing: "刷新中",
  remove: "移除",
  reqSkillPts: "所需技能点：",
  reqSkills: "所需技能：",
  required: "门槛", // as Threshold, expansion lvl requirement, Lvl X required
  resale: "转售",
  resources: "资源",
  restock: "补货",
  retry: "重试",
  "reward.discovered": "奖励揭晓",
  save: "保存",
  saving: "保存中",
  "seasonal.treasure": "时季宝物",
  seeds: "种子", // Basket
  selected: "已选择",
  "select.resource": "选择你的添饵：", // chum selection, distinguishing “bait/chum” as “鱼饵/添饵”
  sell: "卖出",
  "sell.all": "卖所有",
  "sell.one": "卖一个",
  "sell.ten": "卖十个",
  "session.expired": "进程已过期！",
  settings: "设置",
  share: "分享",
  shopping: "购物", // Map Selection Tag
  skillPts: "技能点：",
  skills: "技能",
  "skip.order": "跳过订单",
  "sound.effects": "音效：",
  start: "开始",
  submit: "提交",
  submitting: "提交中",
  success: "成功！",
  "support.team": "运维小组",
  swapping: "兑换中",
  syncing: "同步中",
  task: "任务",
  "thank.you": "谢谢你！",
  tools: "工具", // Basket
  total: "总共",
  trades: "买卖", // Bumpkin UI
  trading: "买卖", // Map Selection Tag
  transfer: "转移", //Account
  "trash.collection": "垃圾回收", // Map Selection Tag
  travel: "旅行",
  "traveller.ready": "嘿游客！准备好游览了吗？",
  "try.again": "再试一次",
  uhOh: "呃噢！",
  uncommon: "罕见", // Unknown Usecase
  "unlock.land": "解锁更多地块", //Unknown Usecase
  unlocking: "开锁中", // Daily Reward
  unmute: "取消静音",
  "use.craft": "用于锻造物品", // item description
  verify: "验证", // Unknown Usecase
  version: "版本",
  viewAll: "查看所有", // Bumpkin UI
  visit: "拜访", // Multiple usecase: share, tab - bumpkin.io
  "visit.enter.land": "输入农场 ID 以查看报价",
  "visit.friend": "拜访朋友",
  "visit.land": "拜访农场",
  wallet: "钱包",
  warning: "警告",
  welcome: "欢迎！",
  "wishing.well": "许愿池",
  withdraw: "提现", // Map Selection Tag and Bank Withdrawal
  withdrawing: "正在提现",
  yes: "是",
  "yes.please": "没错，有劳",
  "you.are.here": "你在这里",
  caught: "捕获",
  "choose.wisely": "谨慎选择！",
  collect: "收集",
  complete: "完成",
  deliver: "送货",
  "deliveries.closed": "送货停单",
  "enjoying.event": "活动尽兴吗？",
  "flowers.found": "发现花卉",
  gift: "送礼",
  harvested: "已收获",
  kick: "踢出",
  "linked.wallet": "关联钱包",
  locked: "已锁定",
  message: "消息",
  messages: "消息",
  "next.order": "下一订单",
  "no.delivery.avl": "暂无送货订单",
  "no.obsessions": "暂无痴玩",
  "no.event": "暂无活动",
  open: "打开",
  place: "放置",
  "place.bid": "有请投标",
  "play.again": "再玩一回",
  remaining: "剩余的",
  requires: "需要",
  reward: "奖励",
  "session.expire": "你的进程已过期",
  skipping: "正在跳过",
  "special.event": "特别活动",
  spin: "转动",
  "start.new.chore": "开始新的日常农活",
  "terms.condition": "条款与细则",
  test: "测试",
  time: "时间",
  wish: "许愿",
  "hoarding.check": "检查储物",
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
  bumpkin: "乡包佬",
  storage: "库存",
  upcoming: "未至",
  collection: "收藏",
  purchase: "购买",
  listing: "上架中",
  cancelling: "撤销中",
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
  search: "搜索",
  searching: "搜寻中",
  "copy.failed": "复制失败！",
  "copy.link": "复制链接",
  exchange: "交换",
  "sfl/coins": "SFL/硬币",
  "are.you.sure": "你确认吗？",
  banner: "横幅",
  "already.own.item": "你已经拥有这个东西了",
  banners: "横幅",
  donation: "捐款",
  donations: "捐款",
  faction: "派",
  free: "免费",
  "goblin.exchange": "妖精交换",
  "p2p.trading": "同行交易",
  player: "玩家·",
  "remaining.free.listings": "剩下 {{listingsRemaining}} 个免费列表",
  "remaining.free.listing": "剩下 1 个免费列表",
  "remaining.free.purchases": "剩下 {{purchasesRemaining}} 个免费购买",
  "remaining.free.purchase": "剩下 1 个免费购买",
  "goblin.deliveries": "地精送货",
  vipAccess: "VIP 访问",
  vip: "VIP",
  coins: "硬币",
  greenhouse: "温室",
  "max.reached": "最大达到了",
  "not.required": "不需要",
  optional: "选修的",
  "balance.short": ENGLISH_TERMS["balance.short"],
  bought: ENGLISH_TERMS.bought,
  requirements: ENGLISH_TERMS.requirements,
};

const timeUnits: Record<TimeUnits, string> = {
  // Plural Forms
  sec: "秒",
  min: "分",
  hr: "时",
  day: "天",

  secs: "秒",
  mins: "分",
  hrs: "时",
  days: "天",
};

const achievementTerms: Record<AchievementsTerms, string> = {
  "breadWinner.description": "赚得 0.001 SFL",
  "breadWinner.one": "好，好，好，伙计……看来你需要整点 SFL ！",
  "breadWinner.two":
    "在Sunflower Land，囤够充足的 SFL 对锻造工具、建筑和稀罕NFT来说相当紧要。",
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
  "busyBumpkin.two": "去瞧瞧Fire Pit，挑点好吃的菜谱煮给你那乡包佬吃。",

  "kissTheCook.description": "煮 20 顿饭菜",
  "bakersDozen.description": "烤 13 个蛋糕",
  "brilliantBumpkin.description": "达到 20 级",
  "chefDeCuisine.description": "煮 5,000 顿饭菜",

  "scarecrowMaestro.description": "锻造一个稻草人来增产你的庄稼。",
  "scarecrowMaestro.one":
    "好喂，伙计！是时候让你学学锻造的技艺好增强你的农务水准了。",
  "scarecrowMaestro.two": "跑去Pumpkin Plaza，找Blacksmith去锻造一个稻草人吧。",

  "bigSpender.description": "花费 10 SFL",
  "museum.description": "放有 10 个不同种类的稀罕物品在你农场上",
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
  "wellOfProsperity.description": "造一口Well",
  "wellOfProsperity.one": "害，害，害，咱们瞧瞧这是咋了？",
  "wellOfProsperity.two":
    "看来你的庄稼都快枯死了。要想种多点庄稼你必须得先造口Well。",

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
  "deliveryDynamo.one": "好喂，可靠的农夫！ 到处的乡包佬都需要你帮忙送货。",
  "deliveryDynamo.two": "货送到了手，赚了他们开心，还赚来 SFL 作丰美回报。",

  "seasonedFarmer.description": "收集 50 个时季资源",
  "seasonedFarmer.one":
    "好喂，时季游侠！Sunflower Land可是凭特殊季节丰富的特别美物与惊喜出名的。",
  "seasonedFarmer.two":
    "收集有了时季资源，你就有机会得到限时奖励、独占锻造品和稀罕财物，好比攥上了当季奇旅的头等票。",
  "seasonedFarmer.three":
    "所以完成任务、参加活动以及收集时季票券好享受这Sunflower Land呈上的最美时节吧！",
  "treasureHunter.description": "挖 10 个洞",
  "treasureHunter.one":
    "阿嚯，猎金人！Sunflower Land可处处藏着秘宝等着重见天日呐。",
  "treasureHunter.two":
    "拿上你那铁锹冲去Treasure Island ，把那些富贵宝藏和意外惊喜统统都挖出来吧。",
  "eggcellentCollection.description": "收集 10 个鸡蛋",
  "eggcellentCollection.one":
    "好喂，采蛋人！鸡真是出色的农场伙伴，每天都给你产出些美味鸡蛋。",
  "eggcellentCollection.two":
    "采到了鸡蛋，做饭就有了新鲜供应的原料，还能解锁特殊菜谱和额外奖励。",
  "task.harvestSunflowers": "收获 10 棵向日葵",
};

const addSFL: Record<AddSFL, string> = {
  "addSFL.swapDetails":
    "Sunflower Land凭 Quickswap 提供了快速兑 Matic 换 SFL 的渠道。",
  "addSFL.referralFee": "Sunflower Land每笔交易会收取 5% 的推荐费。",
  "addSFL.swapTitle": "兑换详情",
  "addSFL.minimumReceived": "至少收到：",
};

const auction: Record<Auction, string> = {
  "auction.bid.message": "你已投下竞标。",
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
  "availableSeeds.select.plant": "你希望选择哪个种子来种植？",
  "quickSelect.empty": "No greenhouse seeds.",
  "quickSelect.label": "Quick select",
};

const base: Record<Base, string> = {
  "base.missing": "设定中缺失名字",
  "base.far.away": "你离得太远了",
  "base.iam.far.away": "I am far away",
};

const basicTreasure: Record<BasicTreasure, string> = {
  "basic.treasure.missingKey": "缺少钥匙",
  "basic.treasure.needKey": "你需要一把宝箱钥匙来开宝箱。",
  "basic.treasure.getKey": "你可以给乡包佬完成任务来拿到宝箱钥匙。",
  "basic.treasure.goodLuck": "祝你好运",
  "basic.treasure.key": "宝箱钥匙",
  "basic.treasure.congratsKey": "恭喜你，你有一把宝箱钥匙了！",
  "basic.treasure.openChest": "你要开箱领取奖励吗？",
  "rare.treasure.needKey": "你需要一把稀罕钥匙才能打开这个宝箱。",
  "luxury.treasure.needKey": "你需要一把奢华钥匙才能打开这个宝箱。",

  // Translate
  "budBox.open": "开",
  "budBox.opened": "已打开",
  "budBox.title": "蕾芽箱",
  "budBox.description": "每天，一种芽类型可以解锁农业奖励。",
  "raffle.title": "妖精抽奖",
  "raffle.description":
    "每个月您都有机会赢得奖励。获奖者名单将在 Discord 上公布。",
  "raffle.entries": "条目",
  "raffle.noTicket": "遗失奖券",
  "raffle.how": "您可以通过特殊活动和 Bumpkin 递送免费领取奖券。",
  "raffle.enter": "进入",
  "giftGiver.description":
    "Congratulations, you discovered a gift giver! Each day you can claim a free prize from them.",
  "giftGiver.label": "Gift Giver",
  "giftGiver.opened": "Already opened today",
};

const beach: Record<Beach, string> = {
  "beach.party": "我们正在努力准备沙滩派对。",
  "beach.ready": "准备好你的防晒霜和遮阳伞，酷夏将至！",
};

const beachLuck: Record<BeachLuck, string> = {
  "beachLuck.tryLuck": "想试试今天的运气吗？",
  "beachLuck.uncleFound":
    "我叔叔在这个沙滩上可挖到了一枚钻戒。而我只能挖到些无聊的 SFL 硬币。",
  "beachLuck.grabShovel": "赶快拿起铁锹开始挖吧。",
  "beachLuck.refreshesIn": "财宝刷新于：",
};

const beehive: Record<Beehive, string> = {
  "beehive.harvestHoney": "收集蜂蜜",
  "beehive.noFlowersGrowing": "没有花卉生长",
  "beehive.beeSwarm": "蜂群",
  "beehive.pollinationCelebration":
    "授粉庆典！友善的蜂群给你的庄稼带来了 0.2 的增益！",
};

const birdiePlaza: Record<BirdiePlaza, string> = {
  "birdieplaza.birdieIntro": "嘿，我是 Birdie ，这儿最美的乡包佬！",
  "birdieplaza.admiringOutfit": "我看你是在欣赏我的衣服。 漂亮坏了，是吧？！？",
  "birdieplaza.currentSeason":
    "我们目前正处于 {{currentSeason}} 季节，乡巴佬们对 {{seasonalTicket}} 疯狂不已。",
  "birdieplaza.collectTickets":
    "收集足够的 {{seasonalTicket}} 即可制作稀有 NFT。这就是我获得这套稀有服装的方法！",
  "birdieplaza.whatIsSeason": "什么是时季？",
  "birdieplaza.howToEarnTickets": "我怎样赚取",
  "birdieplaza.earnTicketsVariety":
    "您可以通过多种方式赚取 {{seasonalTicket}}。",
  "birdieplaza.commonMethod":
    "赚取 {{seasonalTicket}} 最常见的方法是收集资源并将其交给广场上的乡巴佬。",
  "birdieplaza.choresAndRewards":
    "您还可以通过完成汉克的家务和领取每日奖励来赚取 {{seasonalTicket}}！",
  "birdieplaza.gatherAndCraft":
    "收集足够的 {{seasonalTicket}} 你就可以像我一样购买一些稀有物品。",
  "birdieplaza.newSeasonIntro": "Sunflower Land每 3 个月会迎来一个新的时季。",
  "birdieplaza.seasonQuests": "这个时季有激动人心的任务和稀罕收藏品等你赚取。",
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
    "有了这迷人独特的Purple Trail，让你的对手垂涎食尘吧",
  "description.obie": "凶悍的长茄兵。",
  "description.maximus": "用丰满的Maximus碾压全场",
  "description.mushroom.house":
    "好一个真上老菌的奇趣妙妙屋，四壁散发迷人魅力，家具孢含惊奇！",
  "description.Karkinos": "咔叽诺斯。掐得也温柔，卷心好帮手！",
  "description.tin.turtle":
    "Tin Turtle会为你在其作用范围内开采的石头带来 +0.1 增益",
  "description.emerald.turtle":
    "Emerald Turtle会为你在其作用范围内开采的任何基矿带来 +0.5 增益",
  "description.iron.idol": "每次开采铁矿，偶像都会额外赐你 1 块铁矿",
  "description.crim.peckster": "一位精通揪出红宝石的宝石侦探",
  "description.skill.shrimpy": "Shrimpy来帮忙了！ 他来保你从鱼身上获取额外 XP",
  "description.soil.krabby":
    "微笑面对挑拣！ 有这位坚壳硬汉超人相伴，享受更快 10% 的堆肥时间",
  "description.nana": "这个稀罕品种的香蕉美人保你香蕉收成有所增进",
  "description.grain.grinder": "磨碎你的谷物，享受美味蛋糕，增加你获得的 XP",
  "description.kernaldo": "神奇的玉米语者。",
  "description.kernaldo.1": "神奇的玉米语者让玉米达25%更快高长大",
  "description.poppy": "神秘的玉米粒。",
  "description.poppy.1": "神秘的玉米粒。玉米产量 +0.1",
  "description.victoria.sisters": "热爱南瓜的姐妹们",
  "description.undead.rooster": "战争的不幸亡者。提升 10% 鸡蛋产量。",
  "description.observatory": "探索星辰，科技飞跃",
  "description.engine.core": "向日葵之力",
  "description.time.warp.totem":
    "庄稼、树木、烹饪和基矿的速度加倍。 仅持续2小时（请在开始计时/收获资源前放置）",
  "description.time.warp.totem.expired":
    "你的Time Warp Totem已过期。 前往Pumpkin Plaza发现并锻造更多魔法物品以提升你的耕作能力吧！",
  "description.time.warp.totem.temporarily":
    "Time Warp Totem可以暂时提升你的烹饪、庄稼、树木和矿物的成长速度。 充分利用它吧！",
  "description.cabbage.boy": "不要吵醒宝宝！",
  "description.cabbage.girl": "嘘，它正在睡觉",
  "description.wood.nymph.wendy": "施放一个魔法来吸引林中仙子",
  "description.peeled.potato": "一颗珍贵的土豆，能在收获时带来额外土豆",
  "description.potent.potato": "强效！在收获时有 3% 的机会 +10 土豆",
  "description.radical.radish": "激进！在收获时有 3% 的机会 +10 小萝卜",
  "description.stellar.sunflower": "卓越！在收获时有 3% 的机会 +10 向日葵",
  "description.lady.bug":
    "一种令人啧啧称奇的虫子，以蚜虫为食。 能够提升苹果品质",
  "description.squirrel.monkey":
    "天然的香橙捕食客。 有Squirrel Monkey在附近时，橙树都感到害怕",
  "description.black.bearry":
    "他最喜欢的零食——丰满多汁的蓝莓。 他一把把地狼吞虎咽！",
  "description.maneki.neko": "招财猫。 拉动手臂， 好运来临",
  "description.easter.bunny": "一个稀有的复活节物品",
  "description.pablo.bunny": "一只神奇的复活节兔子",
  "description.foliant": "一本咒法书",
  "description.tiki.totem": "Tiki Totem会在你每次砍树时额外增加 0.1 个木头",
  "description.lunar.calendar": "庄稼现在遵循圆月周期！ 庄稼生长速度提高 10%",
  "description.heart.davy.jones":
    "谁拥有它，谁就拥有掌控七大洋的浩瀚力量，可以挖掘财宝不知疲倦",
  "description.treasure.map":
    "一张魔法地图，能引领持有者找到珍贵的财宝。 沙岸财宝的利润 +20%",
  "description.genie.lamp":
    "一盏有魔力的灯，里面有一个能帮你实现三个愿望的精灵",
  "description.basic.scarecrow":
    "你农场 VIP (Very Important Plants) 的挑剔守护者",
  "description.scary.mike": "蔬菜私语者和惊人丰盛收成的冠军！",
  "description.laurie.chuckle.crow":
    "她那令人不安的笑声，将啄食你庄稼的鸟儿赶走！",
  "description.immortal.pear": "一种能使果树寿命变长的长寿梨",
  "description.bale": "家禽们最喜欢的邻居，为鸡们提供一个舒适的休息地",
  "description.sir.goldensnout":
    "一位皇家成员， Sir Goldensnout通过它的黄金肥料为你的农场带来了治下繁荣",
  "description.freya.fox":
    "迷人的守护者，用她的神秘魅力来促进南瓜的生长。 在她的注视下，收获大量南瓜。",
  "description.queen.cornelia":
    "掌控Queen Cornelia的威严力量， 并体验大块区域内玉米产量的显著提升。 +1 玉米",
  "description.heart.of.davy.jones":
    "谁拥有它，谁就拥有掌控七大洋的浩瀚力量，可以挖掘财宝不知疲倦",
  "description.knight.chicken":
    "A strong and noble chicken boosting your oil yield.",
};

const boostEffectDescriptions: Record<BoostEffectDescriptions, string> = {
  "description.obie.boost": "-25% 茄子生长时间",
  "description.purple.trail.boost": "+0.2 茄子",
  "description.freya.fox.boost": "+0.5 南瓜",
  "description.sir.goldensnout.boost": "+0.5 庄稼(AOE 4x4)",
  "description.maximus.boost": "+1 茄子",
  "description.basic.scarecrow.boost":
    "-20% 低阶庄稼生长时间：向日葵土豆和南瓜(AOE 3x3)",
  "description.scary.mike.boost":
    "+0.2 中阶庄稼：胡萝卜卷心菜甜菜根花椰菜和防风草(AOE 3x3)",
  "description.laurie.chuckle.crow.boost":
    "+0.2 高阶庄稼：茄子玉米小萝卜小麦和羽衣甘蓝(AOE 3x3)",
  "description.bale.boost": "+0.2 鸡蛋(AOE 4x4)",
  "description.immortal.pear.boost": "每个种子水果收获次数 +1",
  "description.treasure.map.boost": "财宝售价 +20% SFL",
  "description.poppy.boost": "+0.1 玉米",
  "description.kernaldo.boost": "-25% 玉米生长时间",
  "description.grain.grinder.boost": "+20% 蛋糕 XP",
  "description.nana.boost": "-10% 香蕉生长时间",
  "description.soil.krabby.boost": "-10% 堆肥器堆肥时间",
  "description.skill.shrimpy.boost": "+20% 鱼 XP",
  "description.iron.idol.boost": "+1 铁矿",
  "description.emerald.turtle.boost": "+0.5 石头铁矿黄金(AOE 3x3)",
  "description.tin.turtle.boost": "+0.1 石头(AOE 3x3)",
  "description.heart.of.davy.jones.boost": "挖宝的每日限制 +20",
  "description.Karkinos.boost": "+0.1 卷心菜(对Cabbage Boy没有效果)",
  "description.mushroom.house.boost": "+0.2 野生蘑菇",
  "description.boost.gilded.swordfish": "+0.1 黄金",
  "description.nancy.boost": "-15% 庄稼生长时间",
  "description.scarecrow.boost": "-15% 庄稼生长时间； +20% 庄稼产量",
  "description.kuebiko.boost": "-15% 庄稼生长时间； +20% 庄稼产量； 免费种子",
  "description.gnome.boost": "+10 中阶/高阶庄稼(影响正下方一格土壤)",
  "description.lunar.calendar.boost": "-10% 庄稼生长时间",
  "description.peeled.potato.boost": "20% 几率 +1 土豆",
  "description.victoria.sisters.boost": "+20% 南瓜",
  "description.easter.bunny.boost": "+20% 胡萝卜",
  "description.pablo.bunny.boost": "+0.1 胡萝卜",
  "description.cabbage.boy.boost":
    "+0.25 卷心菜(当Cabbage Girl生效时 +0.5 卷心菜)",
  "description.cabbage.girl.boost": "-50% 卷心菜生长时间",
  "description.golden.cauliflower.boost": "+100% 花椰菜",
  "description.mysterious.parsnip.boost": "-50% 防风草生长时间",
  "description.queen.cornelia.boost": "+1 玉米(AOE 3x4)",
  "description.foliant.boost": "+0.2 羽衣甘蓝",
  "description.hoot.boost": "+0.5 小麦小萝卜羽衣甘蓝",
  "description.hungry.caterpillar.boost": "免费花卉种子",
  "description.black.bearry.boost": "+1 蓝莓",
  "description.squirrel.monkey.boost": "-50% 香橙生长时间",
  "description.lady.bug.boost": "+0.25 苹果",
  "description.banana.chicken.boost": "+0.1 香蕉",
  "description.carrot.sword.boost": "变种庄稼几率提升 4 倍",
  "description.stellar.sunflower.boost": "3% 几率 +10 向日葵",
  "description.potent.potato.boost": "3% 几率 +10 土豆",
  "description.radical.radish.boost": "3% 几率 +10 小萝卜",
  "description.lg.pumpkin.boost": "+0.3 南瓜",
  "description.lg.carrot.boost": "+0.2 胡萝卜",
  "description.lg.radish.boost": "+0.4 小萝卜",
  "description.fat.chicken.boost": "-0.1 小麦喂食量",
  "description.rich.chicken.boost": "+0.1 鸡蛋",
  "description.speed.chicken.boost": "-10% 产蛋时间",
  "description.ayam.cemani.boost": "+0.2 鸡蛋",
  "description.el.pollo.veloz.boost": "-4hr 产蛋时间",
  "description.rooster.boost": "变种鸡几率提升 2 倍",
  "description.undead.rooster.boost": "+0.1 鸡蛋",
  "description.chicken.coop.boost":
    "+1 鸡蛋产量；每个Hen House的养鸡数量上限 +5",
  "description.gold.egg.boost": "喂鸡不再需要小麦",
  "description.woody.beaver.boost": "+20% 木头",
  "description.apprentice.beaver.boost": "+20% 木头； -50% 树木恢复时间",
  "description.foreman.beaver.boost":
    "+20% 木头； -50% 树木恢复时间； 砍树不再需要斧头",
  "description.wood.nymph.wendy.boost": "+0.2 木头",
  "description.tiki.totem.boost": "+0.1 木头",
  "description.tunnel.mole.boost": "+0.25 石头",
  "description.rocky.mole.boost": "+0.25 铁矿",
  "description.nugget.boost": "+0.25 黄金",
  "description.rock.golem.boost": "10% 几率 +2 石头",
  "description.crimson.carp.boost": "+0.05 红宝石",
  "description.crim.peckster.boost": "+0.1 红宝石",
  "description.queen.bee.boost": "双倍蜂蜜生产速度",
  "description.humming.bird.boost": "20% 几率 +1 花卉",
  "description.beehive.boost": "当蜂箱已满时，有 10% 几率获得 +0.2 庄稼",
  "description.walrus.boost": "+1 鱼",
  "description.alba.boost": "50% 几率获得 +1 基础鱼",
  "description.knowledge.crab.boost": "双倍Sprout Mix增强效果",
  "description.maneki.neko.boost": "每天 1 份免费食物(点击领取)",
  "description.genie.lamp.boost": "实现 3 个愿望",
  "description.observatory.boost": "+5% XP",
  "description.blossombeard.boost": "+10% XP",
  "description.christmas.festive.tree.boost": "圣诞节期间免费礼物",
  "description.grinxs.hammer.boost": "拓张成本减半",
  "description.time.warp.totem.boost":
    "庄稼生长、矿物烹饪和树木冷却时间减少 50% (请在开始计时/收获资源前放置)",
  "description.radiant.ray.boost": "+0.1 铁矿",
  "description.beekeeper.hat.boost": "+20% 蜂蜜生产速度",
  "description.flower.fox.boost": "-10% 花朵 生长时间",
  "description.babyPanda.boost": "新玩家在 2024 年 3 月期间 2 倍 XP",

  // Translate
  "description.hungryHare.boost": "发酵胡萝卜 2x XP",
  "description.battle.fish.boost": "+0.05 Oil",
  "description.knight.chicken.boost": "+0.1 Oil",
  "description.turbo.sprout.boost": "-50% Green House Crop time",
  "description.soybliss.boost": "+1 Soybean",
  "description.grape.granny.boost": "+1 Grape",
  "description.non.la.hat.boost": "+1 Rice",
  "description.oil.can.boost": "+2 Oil",
  "description.olive.shield.boost": "+1 Olive",
  "description.pan.boost": "+25% XP",
  "description.paw.shield.boost": "+25% Faction Ped feeding XP",
  "description.vinny.boost": "+0.25 Grape",
  "description.desertgnome.boost": "+10% Cooking Speed",
  "description.rice.panda.boost": "+0.25 Rice",
  "description.olive.shirt.boost":
    ENGLISH_TERMS["description.olive.shirt.boost"],
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
  "description.kitchen": "厨房。升级你的烹饪游戏",
  "description.compost.bin": "箱式堆肥器。定期生产鱼饵和肥料",
  "description.hen.house": "鸡窝。发展你的养鸡帝国。",
  "description.bakery": "面包房。烤你最喜欢的蛋糕",
  "description.turbo.composter": "涡轮堆肥器。定期生产高级鱼饵和肥料",
  "description.deli": "熟食店。这些熟食满足你的口腹之欲！",
  "description.smoothie.shack": "沙冰屋。鲜榨！",
  "description.warehouse": "仓库。种子库存增加 20%",
  "description.toolshed": "工具棚。Workbench工具库存增加 50%",
  "description.premium.composter": "旗舰堆肥器。定期生产专业鱼饵和肥料",
  "description.town.center": "镇中心。聚集到Town Center获取最新消息",
  "description.market": "市场。在农贸Market购买和出售",
  "description.fire.pit": "火堆。烤你的向日葵，喂食并升级你的乡包佬",
  "description.workbench": "工作台。锻造收集资源的工具",
  "description.tent": "帐篷。（已停产）",
  "description.house": "房屋。一个让你休息的地方",
  "description.greenhouse": ENGLISH_TERMS["description.greenhouse"],
  "description.crop.machine": ENGLISH_TERMS["description.crop.machine"],
  "building.oil.remaining": ENGLISH_TERMS["building.oil.remaining"],
  "cooking.building.oil.description":
    ENGLISH_TERMS["cooking.building.oil.description"],
  "cooking.building.oil.boost": ENGLISH_TERMS["cooking.building.oil.boost"],
  "cooking.building.runtime": ENGLISH_TERMS["cooking.building.runtime"],
};

const bumpkinDelivery: Record<BumpkinDelivery, string> = {
  "bumpkin.delivery.haveFlower": "你有花要给我吗？得是我喜欢的。",
  "bumpkin.delivery.notFavorite":
    "唔，这不是我最喜欢的花。但我想重要的是心意。",
  "bumpkin.delivery.loveFlower": "哇，谢谢！我喜欢这朵花！",
  "bumpkin.delivery.favoriteFlower": "这是我最喜欢的花！非常感谢！",
  "bumpkin.delivery.selectFlower": "选择一朵花",
  "bumpkin.delivery.noFlowers": "哦不，你没有任何鲜花可以赠送！",
  "bumpkin.delivery.thanks": "天哪，谢谢你乡包佬！！！",
  "bumpkin.delivery.waiting":
    "我一直就是在等这个。非常感谢！请尽快回来获取更多送货订单。",
  "bumpkin.delivery.proveYourself":
    "证明你的价值。再扩展你的岛屿 {{missingExpansions}} 次。",
};

const bumpkinItemBuff: Record<BumpkinItemBuff, string> = {
  "bumpkinItemBuff.chef.apron.boost": "+20% SFL 蛋糕利润",
  "bumpkinItemBuff.fruit.picker.apron.boost": "+0.1 水果",
  "bumpkinItemBuff.angel.wings.boost": "30% 几率马上获得庄稼",
  "bumpkinItemBuff.devil.wings.boost": "30% 几率马上获得庄稼",
  "bumpkinItemBuff.eggplant.onesie.boost": "+0.1 茄子",
  "bumpkinItemBuff.golden.spatula.boost": "+10% XP",
  "bumpkinItemBuff.mushroom.hat.boost": "+0.1 蘑菇",
  "bumpkinItemBuff.parsnip.boost": "+20% 防风草",
  "bumpkinItemBuff.sunflower.amulet.boost": "+10% 向日葵",
  "bumpkinItemBuff.carrot.amulet.boost": "-20% 胡萝卜生长时间",
  "bumpkinItemBuff.beetroot.amulet.boost": "+20% 甜菜根",
  "bumpkinItemBuff.green.amulet.boost": "10% 几率获得 10 倍庄稼",
  "bumpkinItemBuff.Luna.s.hat.boost": "-50% 烹饪时间",
  "bumpkinItemBuff.infernal.pitchfork.boost": "+3 庄稼",
  "bumpkinItemBuff.cattlegrim.boost": "+0.25 牲畜产出",
  "bumpkinItemBuff.corn.onesie.boost": "+0.1 玉米",
  "bumpkinItemBuff.sunflower.rod.boost": "10% 几率获得 +1 条鱼",
  "bumpkinItemBuff.trident.boost": "20% 几率获得 +1 条鱼",
  "bumpkinItemBuff.bucket.o.worms.boost": "+1 Worm",
  "bumpkinItemBuff.luminous.anglerfish.topper.boost": "+50% 鱼 XP",
  "bumpkinItemBuff.angler.waders.boost": "+10 钓鱼上限",
  "bumpkinItemBuff.ancient.rod.boost": "钓鱼无需鱼竿",
  "bumpkinItemBuff.banana.amulet.boost": "+0.5 香蕉",
  "bumpkinItemBuff.banana.boost": "-20% 香蕉生长时间",
  "bumpkinItemBuff.deep.sea.helm": "3 倍 Marine Marvel几率",
  "bumpkinItemBuff.bee.suit": "+0.1 蜂蜜",
  "bumpkinItemBuff.crimstone.hammer": "第5次开采 +2 红宝石",
  "bumpkinItemBuff.crimstone.amulet": "-20% 红宝石冷却时间",
  "bumpkinItemBuff.crimstone.armor": "+0.1 红宝石",
  "bumpkinItemBuff.hornet.mask": "2 倍蜂群几率",
  "bumpkinItemBuff.honeycomb.shield": "+1 蜂蜜",
  "bumpkinItemBuff.flower.crown": "-50% 花卉生长时间",
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
  "description.green.thumb": "庄稼产量增加 5%",
  "description.cultivator": "庄稼生长速度加快 5%",
  "description.master.farmer": "庄稼产量增加 10%",
  "description.golden.flowers": "向日葵有几率掉落黄金",
  "description.happy.crop": "有几率收获 2 倍庄稼",
  // Trees
  "description.lumberjack": "木头产量增加 10%",
  "description.tree.hugger": "木头生长速度加快 20%",
  "description.tough.tree": "有几率掉落 3 倍木头",
  "description.money.tree": "砍伐树木有几率掉落 SFL",
  // Rocks
  "description.digger": "石头产量增加 10%",
  "description.coal.face": "石头恢复速度加快 20%",
  "description.seeker": "攻击石怪",
  "description.gold.rush": "开采金脉有几率获得 2.5 倍产量",
  // Cooking
  "description.rush.hour": "烹饪速度加快 10%",
  "description.kitchen.hand": "饭菜XP增加 5%",
  "description.michelin.stars": "精致食物，SFL 利润增加 5%",
  "description.curer": "Deli餐品 XP 增加 15%",
  // Animals
  "description.stable.hand": "牲畜生产加快 10%",
  "description.free.range": "牲畜产出增加 10%",
  "description.horse.whisperer": "增加变种几率",
  "description.buckaroo": "有几率获得 2 倍牲畜产出",
};

const bumpkinTrade: Record<BumpkinTrade, string> = {
  "bumpkinTrade.minLevel": "你必须到 10 级才能做买卖",
  "bumpkinTrade.noTradeListed": "你还未挂单买卖",
  "bumpkinTrade.sell": "卖你的资源给其他玩家换 SFL",
  "bumpkinTrade.like.list": "你想上架什么呢",
  "bumpkinTrade.purchase": "请于Goblin Retreat购买",

  "bumpkinTrade.available": "可供",
  "bumpkinTrade.quantity": "数量",
  "bumpkinTrade.price": "价格",
  "bumpkinTrade.listingPrice": "挂牌价格",
  "bumpkinTrade.pricePerUnit": " {{resource}}平均单价",
  "bumpkinTrade.tradingFee": "交易费",
  "bumpkinTrade.youWillReceive": "您将收到",
  "bumpkinTrade.cancel": "取消",
  "bumpkinTrade.list": "列表",
  "bumpkinTrade.maxListings": "已达到最大列表数量",
  "bumpkinTrade.max": "最大: {{max}}",
  "bumpkinTrade.floorPrice": "底价：{{price}} SFL",
  "bumpkinTrade.price/unit": "{{price}} / 单位",
  "bumpkinTrade.min": ENGLISH_TERMS["bumpkinTrade.min"],
  "bumpkinTrade.minimumFloor": ENGLISH_TERMS["bumpkinTrade.minimumFloor"],
  "bumpkinTrade.maximumFloor": ENGLISH_TERMS["bumpkinTrade.maximumFloor"],
  "bumpkinTrade.sellConfirmation":
    ENGLISH_TERMS["bumpkinTrade.sellConfirmation"],
};

const buyFarmHand: Record<BuyFarmHand, string> = {
  "buyFarmHand.howdyBumpkin": "好喂，乡包佬。",
  "buyFarmHand.confirmBuyAdditional": "你确定是想买额外乡包佬吗？",
  "buyFarmHand.farmhandCoupon": "1 张 Farmhand票券",
  "buyFarmHand.adoptBumpkin": "领养 1 位乡包佬",
  "buyFarmHand.additionalBumpkinsInfo":
    "额外乡包佬可以用来装佩饰品来增益你的农场。",
  "buyFarmHand.notEnoughSpace": "空间不足——升阶你的岛屿",
  "buyFarmHand.buyBumpkin": "购买乡包佬",
  "buyFarmHand.newFarmhandGreeting": "我是你的新雇农。我已经等不及要开干了！",
};

const chat: Record<Chat, string> = {
  "chat.Fail": "连接失败",
  "chat.mute": "你已被禁言",
  "chat.again": "你再次发言的恢复时限：",
  "chat.Kicked": "你已被踢出",
};

const chickenWinner: Record<ChickenWinner, string> = {
  "chicken.winner.playagain": "点此处再次游玩",
};

const choresStart: Record<ChoresStart, string> = {
  "chores.harvestFields": "收割田野",
  "chores.harvestFieldsIntro": "这些田可不会自己给自己耕了。收获 3 把向日葵。",
  "chores.earnSflIntro":
    "你要是想把耕田事业做大发家，你最好从卖向日葵、买种子和反复赚钱做起。",
  "chores.reachLevel": "到达 2 级",
  "chores.reachLevelIntro": "你要是想升级并解锁新技能，你最好开始做饭吃了。",
  "chores.chopTrees": "砍倒 3 颗树",
  "chores.helpWithTrees":
    "我这身老骨头已强健不再了，想来你可以搭把手把这些该砍的死鬼树砍了？我们这块的Blacksmith会帮你锻造好些工具的。",
  "chores.noChore": "抱歉，我暂时没有什么日常农活需要你做的。",
  "chores.newSeason": "新时季就要来临，日常农活暂时停单。",
  "chores.choresFrozen":
    "新时季日常农活即将发单。先前时季的日常农活与进度会被重置。",
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
  "chumDetails.squid": "用鳐魚最爱的零食唤醒它！",
  "chumDetails.wood": "木头。这选择真有趣……",
  "chumDetails.redPansy": "躲藏鱼儿的火辣诱惑",
  "chumDetails.fatChicken": "原汁原味的白肉再庞大的猎物也欲罢不能",
  "chumDetails.speedChicken": "利齿猎人的快餐甜点",
  "chumDetails.richChicken": "白肚银幕恐怖巨星的精美佳肴",
};

const claimAchievement: Record<ClaimAchievement, string> = {
  "claimAchievement.alreadyHave": "你已获取本成就",
  "claimAchievement.requirementsNotMet": "你尚未达到要求",
};

const community: Record<Community, string> = {
  "community.toast": "祝贺词为空",
  "community.url": "请输入你的Repo URL",
  "comunity.Travel": "旅行至社区构筑的岛屿",
};

const compostDescription: Record<CompostDescription, string> = {
  "compost.fruitfulBlend": "Fruitful Blend增加 +0.1 每水果产量",
  "compost.sproutMix": "Sprout Mix增加 +0.2 庄稼产量",
  "compost.sproutMixBoosted": "Sprout Mix增加 +0.4 庄稼产量",
  "compost.rapidRoot": "Rapid Root减少 50% 庄稼生长时间",
};

const composterDescription: Record<ComposterDescription, string> = {
  "composter.compostBin": "Compost Bin 详情…….",
  "composter.turboComposter": "Turbo Composter详情…….",
  "composter.premiumComposter": "Premium Composter详情…….",
};

const confirmationTerms: Record<ConfirmationTerms, string> = {
  "confirmation.sellCrops":
    "你确定要出售 {{cropAmount}} {{cropName}} 以换取 {{coinAmount}} 枚硬币吗？",
};

const confirmSkill: Record<ConfirmSkill, string> = {
  "confirm.skillClaim": "你确定要领取该技能吗？",
};

const conversations: Record<Conversations, string> = {
  "hank-intro.headline": "帮帮老人家？",
  "hank-intro.one": "好喂，乡包佬！欢迎来到我们这小块桃园天堂。",
  "hank-intro.two": "我在这儿耕地已有 50 余年了，但帮手当然也不嫌少。",
  "hank-intro.three": "我能教教你耕作基础，只要你肯帮我干点日常农活就好啦。",
  "hank.crafting.scarecrow": "锻造Scarecrow",
  "hank-crafting.one": "唔，这些庄稼长得好贵慢啊。我可没时间傻等着。",
  "hank-crafting.two": "锻造个Scarecrow来助长庄稼吧。",
  "betty-intro.headline": "农场成长秘诀",
  "betty-intro.one": "嘿，嘿！欢迎来到我的Market。",
  "betty-intro.two": "带上你最好的收成给我，我也好给你出个好价钱！",
  "betty-intro.three": "你需要种子吗？从土豆到防风草，应有尽有！",
  "betty.market-intro.one":
    "嘿这边，乡包佬！我是农夫市场的Betty。我周游列岛收购庄稼销售种子。",
  "betty.market-intro.two":
    "好消息：你刚拿上了一把闪闪新铲子！坏消息：我们碰上了一回庄稼荒。",
  "betty.market-intro.three":
    "我会给出一段有限时间，作为新来客的你，收成庄稼卖价可以双倍。",
  "betty.market-intro.four": "收割那些向日葵，让咱们打下你农业帝国的基业吧。",
  "bruce-intro.headline": "烹饪介绍",
  "bruce-intro.one": "我是这家可爱小酒馆的老板。",
  "bruce-intro.two": "带食材给我，我就能做你能吃的所有食物！",
  "bruce-intro.three": "好喂农民！ 我远在一里外就能嗅到饿肚子的乡包佬。",
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
    "Sunflower Land到处都有魔法物品供你铸造，好增进你的农活技艺。 ",
  "pete.craftScarecrow.three":
    "跑去Work Bench并锻造一个Scarecrow好助长那些向日葵吧。",
  "pete.levelthree.one": "恭喜，你那绿指头是真的闪亮！",
  "pete.levelthree.two":
    "我们是时候跑去Plaza了，在那里你的农艺天赋可以甚至更上一层、更加闪耀！",
  "pete.levelthree.three":
    "在Plaza你可以带你的资源去送货换奖励、锻造魔法物品和与其他玩家做买卖。",
  "pete.levelthree.four": "点击左下角的地球图标，你就可以开始旅行啦。",
  "pete.help.zero": "光顾Fire Pit、烹饪食物并食用以升级。",
  "pete.pumpkinPlaza.one":
    "当你升级时，你将解锁新的领域以供探索。 首先是南瓜广场……我的家！",
  "pete.pumpkinPlaza.two":
    "在这里，你可以完成送货收获奖励、锻造魔法物品以及与其他玩家做买卖。",
  "sunflowerLand.islandDescription":
    "Sunflower Land随处都是激动人心的列岛，供你完成送货、锻造稀罕NFT甚至挖掘财宝！",
  "sunflowerLand.opportunitiesDescription":
    "你辛苦挣得的资源可以花费在各种地点获得各种机会。",
  "sunflowerLand.returnHomeInstruction": "你随时都可以点击旅行按钮回家。",
  "grimbly.expansion.one":
    "你好，新晋农民！ 我是Grimbly，一位老练的哥布林建筑家。",
  "grimbly.expansion.two":
    "凭借合适的材料和我古老的工艺技巧，我们可以将你的岛屿变成一件杰作。",
  "luna.portalNoAccess": "唔，这传送门就凭空出现了。这是怎么回事呢？",
  "luna.portals": "传送门",
  "luna.rewards": "奖赏",
  "luna.travel": "旅行到这些由玩家建造的传送门里并赚取奖赏吧。",
  "pete.intro.one":
    "好喂，这边，乡包佬！ 欢迎来到Sunflower Land，一个富饶的农业天堂，这里一切皆有可能！",
  "pete.intro.two": "你建立的岛屿多么美丽啊！ 我是Pumpkin Pete，你的农民邻居。",
  "pete.intro.three":
    "乡包佬们现在正在广场上庆祝节日，有丰厚的奖励和神奇的物品。",
  "pete.intro.four":
    "在加入乐趣之前，你需要发展你的农场并收集一些资源。 你可不想两手空空！",
  "pete.intro.five": "首先，你需要砍倒这些树木并拓张你的岛屿。",
  "mayor.plaza.changeNamePrompt":
    "你想要改名字吗？很可惜，我现在不能帮你登记，我的文书工作已经有够多了。",
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
    "我祝你在Sunflower Land玩得开心！如果你还再有需要，回来找我就好了！",
  "mayor.codeOfConduct": "行为准则",
  "mayor.failureToComply": "违反良俗会招致惩罚，可能包括账号封禁",
  "mayor.paperworkComplete": "您的文书现已登记完毕。回头见",
  "hank.choresFrozen": ENGLISH_TERMS["hank.choresFrozen"],
};

const cropBoomMessages: Record<CropBoomMessages, string> = {
  "crop.boom.welcome": "欢迎来到Crop Boom",
  "crop.boom.reachOtherSide": "跑到这危险庄稼田的另一头去领取Arcade Token吧",
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
  "description.soybean": "A versatile legume!",
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
  "description.sunpetal.seed": "日光瓣种子。一粒Sunpetal种子",
  "description.bloom.seed": "绽放种子。一粒Bloom种子",
  "description.lily.seed": "百合种子。一粒Lily种子",

  // Greenhouse Seeds
  "description.grape": "A zesty and desired fruit.",
  "description.olive": "A luxury for advanced farmers.",
  "description.rice": "Perfect for rations!",
};

const cropMachine: Record<CropMachine, string> = {
  "cropMachine.addOil": ENGLISH_TERMS["cropMachine.addOil"],
  "cropMachine.addSeedPack": ENGLISH_TERMS["cropMachine.addSeedPack"],
  "cropMachine.addSeeds": ENGLISH_TERMS["cropMachine.addSeeds"],
  "cropMachine.availableInventory":
    ENGLISH_TERMS["cropMachine.availableInventory"],
  "cropMachine.boosted": ENGLISH_TERMS["cropMachine.boosted"],
  "cropMachine.growTime": ENGLISH_TERMS["cropMachine.growTime"],
  "cropMachine.growTimeRemaining":
    ENGLISH_TERMS["cropMachine.growTimeRemaining"],
  "cropMachine.harvest": ENGLISH_TERMS["cropMachine.harvest"],
  "cropMachine.harvestAllCrops": ENGLISH_TERMS["cropMachine.harvestAllCrops"],
  "cropMachine.machineRuntime": ENGLISH_TERMS["cropMachine.machineRuntime"],
  "cropMachine.maxRuntime": ENGLISH_TERMS["cropMachine.maxRuntime"],
  "cropMachine.moreOilRequired": ENGLISH_TERMS["cropMachine.moreOilRequired"],
  "cropMachine.notStartedYet": ENGLISH_TERMS["cropMachine.notStartedYet"],
  "cropMachine.oil.description": ENGLISH_TERMS["cropMachine.oil.description"],
  "cropMachine.oilTank": ENGLISH_TERMS["cropMachine.oilTank"],
  "cropMachine.oilToAdd": ENGLISH_TERMS["cropMachine.oilToAdd"],
  "cropMachine.paused": ENGLISH_TERMS["cropMachine.paused"],
  "cropMachine.pickSeed": ENGLISH_TERMS["cropMachine.pickSeed"],
  "cropMachine.readyCropPacks": ENGLISH_TERMS["cropMachine.readyCropPacks"],
  "cropMachine.readyCropPacks.description":
    ENGLISH_TERMS["cropMachine.readyCropPacks.description"],
  "cropMachine.readyToHarvest": ENGLISH_TERMS["cropMachine.readyToHarvest"],
  "cropMachine.seedPacks": ENGLISH_TERMS["cropMachine.seedPacks"],
  "cropMachine.seeds": ENGLISH_TERMS["cropMachine.seeds"],
  "cropMachine.totalCrops": ENGLISH_TERMS["cropMachine.totalCrops"],
  "cropMachine.totalRuntime": ENGLISH_TERMS["cropMachine.totalRuntime"],
  "cropMachine.totalSeeds": ENGLISH_TERMS["cropMachine.totalSeeds"],
};

const decorationDescriptions: Record<DecorationDescriptions, string> = {
  // Decorations
  "description.wicker.man": "牵牵手、转转圈，柳條怪影长上天",
  "description.golden bonsai": "哥布林也会爱盆栽",
  "description.christmas.bear": "圣诞老人的最爱",
  "description.war.skull": "用敌人的骨颅装点你的地盘",
  "description.war.tombstone": "愿你安息",
  "description.white.tulips": "远离哥布林的嗅味",
  "description.potted.sunflower": "为你的岛上增添阳光",
  "description.potted.potato": "土豆血在你的乡包佬体内流淌。",
  "description.potted.pumpkin": "南瓜属于乡包佬",
  "description.cactus": "节约用水并让您的农场美丽惊人！",
  "description.basic.bear": "这是一只普通的熊。用它在妖精撤退制作一只熊吧！",
  "description.bonnies.tombstone":
    "在任何农场都显诡怪的添饰，Bonnie的人类墓碑叫人寒凉刺骨",
  "description.grubnashs.tombstone": "让Grubnash的哥布林墓碑带来些许诡魅",
  "description.town.sign": "骄傲地炫耀你的农场号码吧！",
  "description.dirt.path": "千足踏过的小径总不脏鞋",
  "description.bush": "草丛里都躲着什么？",
  "description.fence": "给你的农场来点乡村魅力",
  "description.stone.fence": "拥抱石栏的永恒优雅",
  "description.pine.tree": "高岸雄伟，一趟层层针叶梦",
  "description.shrub": "一簇美妙灌木倍增你的游乐景象",
  "description.field.maple": "娇枝嫩叶展开翠绿天蓬",
  "description.red.maple": "火热红叶有一颗秋日暖心",
  "description.golden.maple": "金光枫叶四绽光芒",
  "description.crimson.cap": "一朵高耸壮硕的蘑菇，赤红大伞菇让你的农场生机勃勃",
  "description.toadstool.seat": "坐稳放松，伞菌可是奇异佳座",
  "description.chestnut.fungi.stool":
    "栗子菇凳在任何农场都是如此牢靠又增乡村风味",
  "description.mahogany.cap": "凭桃花心木大伞菇添一番不寻常的风味",
  "description.candles": "在女巫之夜借跳跃的火焰为你的农场附上魔力",
  "description.haunted.stump": "召来通灵让你的农场萦绕鬼魅",
  "description.spooky.tree": "增添农场上的闹鬼奇趣！",
  "description.observer": "永不停转的眼珠，永存戒心、永不松眼！",
  "description.crow.rock": "乌鸦栖息的神秘石块",
  "description.mini.corn.maze": "2023年女巫之夜时季广受喜爱迷宫的纪念品",
  "description.lifeguard.ring": "漂浮你的风尚，你的海岸救星！",
  "description.surfboard": "驾驭你的惊涛骇浪，愿沙滩祝福你的浪板！",
  "description.hideaway.herman": "Herman在这躲着，但总是瞄着等派对！",
  "description.shifty.sheldon": "狡猾的Sheldon，总是匆忙凿着下一个沙岸惊喜！",
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
  "description.sunflower.amulet": "增加 10% 向日葵产出",
  "description.carrot.amulet": "增加 20% 胡萝卜生长速度",
  "description.beetroot.amulet": "增加 20% 甜菜根产出",
  "description.green.amulet": "有几率收获 10 倍庄稼产出",
  "description.warrior.shirt": "真正战士的标志",
  "description.warrior.pants": "保驾你的腿部",
  "description.warrior.helmet": "免疫箭矢",
  "description.sunflower.shield": "Sunflower Land的英雄。免费向日葵种子！",
  "description.skull.hat": "乡包佬的稀罕帽子",
  "description.sunflower.statue": "神圣代币的象征",
  "description.potato.statue": "原初土豆狂热者的雕塑",
  "description.christmas.tree": "在圣诞节收取圣诞老人的空投",
  "description.gnome": "一个幸运的侏儒",
  "description.homeless.tent": "一张美好舒适的帐篷",
  "description.sunflower.tombstone": "谨此纪念向日葵农夫们",
  "description.sunflower.rock": "这曾挤爆Polygon链的游戏",
  "description.goblin.crown": "召来哥布林的头领",
  "description.fountain": "你农场上的惬意喷泉",
  "description.nyon.statue": "谨此纪念Nyon Lann",
  "description.farmer.bath": "农夫们的甜菜根香薰浴",
  "description.woody.Beaver": "增加 20% 木头产出",
  "description.apprentice.beaver": "增加 50% 木头生长速度",
  "description.foreman.beaver": "无需用斧头砍树木",
  "description.egg.basket": "准许参与复活节彩蛋寻猎",
  "description.mysterious.head": "一个理应保护农夫们的雕像",
  "description.tunnel.mole": "增加 25% 石头产出",
  "description.rocky.the.mole": "增加 25% 铁矿产出",
  "description.nugget": "增加 25% 黄金产出",
  "description.rock.golem": "给予 10% 概率产出 3 倍石头",
  "description.chef.apron": "给予额外 20% 蛋糕销售 SFL 利润",
  "description.chef.hat": "传奇面包师的桂冠！",
  "description.nancy": "赶走那些乌鸦。增加 15% 庄稼生长速度",
  "description.scarecrow": "一个哥布林稻草人。增加 20% 庄稼产出",
  "description.kuebiko": "连店主都害怕这一稻草人。种子免费",
  "description.golden.cauliflower": "加倍花椰菜产出",
  "description.mysterious.parsnip": "增加 50% 防风草生长速度",
  "description.carrot.sword": "增加变种庄稼的出现概率",
  "description.chicken.coop": "收获 2 倍数目的鸡蛋",
  "description.farm.cat": "赶走那些老鼠",
  "description.farm.dog": "农场狗狗能牧羊",
  "description.gold.egg": "无需小麦便能喂食鸡群",
  "description.easter.bunny": "增加 20% 胡萝卜产出",
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
  "description.boulder": "一片神秘矿脉可掉落稀罕矿物",
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
  "description.shroom.glow": "蘑菇灯的魔力荧光照亮你的农场",
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
  "description.kernaldo.bonus": "增加 25% 玉米生长速度",
  "description.white.crow": "神秘空灵的白乌鸦",
  "description.sapo.docuras": "真正的享受！",
  "description.sapo.travessuras": "噢噢……有人调皮了",
  "description.walrus":
    "凭借他可靠的獠牙和对深海的热爱，他会确保你每次都能钓上额外一条鱼",
  "description.alba":
    "凭借她的敏锐直觉，她会确保你上钩的会有额外水花。50% 的几率 +1 基础鱼！",
  "description.knowledge.crab":
    "Knowledge Crab让你的Sprout Mix效果翻倍，让你的田地财宝跟海上劫掠一样滋润！",
  "description.anchor":
    "用这颗航海明珠抛锚，让每一块地方都风生水起又流行时锚！",
  "description.rubber.ducky":
    "伴着这经典叫叫玩具漂浮，传颂胶胶奇趣到每一角落！",
  "description.arcade.token": "从小游戏与冒险挣来的代币。可以换取奖赏。",
  "description.bumpkin.nutcracker": "2023年的节日装饰",
  "description.festive.tree":
    "每到佳节搬上台面的节庆树。好奇够不够大让圣诞老人看见呢？",
  "description.white.festive.fox": "白狐的赐福安居在慷慨的农场",
  "description.grinxs.hammer": "出自传奇哥布林铁匠Grinx之手的魔法锤子",
  "description.angelfish": "海洋的天蓝之美，点缀着缤纷跃动弧光",
  "description.halibut": "海底平地的潜居者，披着沙色迷彩的伪装大师",
  "description.parrotFish": "海浪下的七彩万花筒，这鱼就是大自然的鲜活艺术造物",
  "description.Farmhand": "热心的雇农",
  "description.Beehive":
    "熙熙攘攘的蜂巢，从生长的花卉采来产出蜂蜜；收获满溢的蜂蜜有 10% 的概率召来蜂群，为生长的庄稼授粉增加 0.2 的产出！",
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

  "description.humming.bird": "小小天上明珠，Humming Bird捧七彩的优雅飞掠而过",
  "description.queen.bee": "蜂巢的威严统领，Queen Bee以至高君权嗡嗡号令",
  "description.flower.fox": "Flower Fox，花瓣簇拥的欢欣生灵，为花园带来雀跃",
  "description.hungry.caterpillar":
    "嚼着树叶，Hungry Caterpillar总蓄势等待下一场美味冒险",
  "description.sunrise.bloom.rug":
    "踏上Sunrise Bloom Rug，花瓣在之上舞起花香晨光。",
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
  "description.sunflorian.faction.banner":
    "A display of allegiance to the Sunflorian Faction",
  "description.goblin.faction.banner":
    "A display of allegiance to the Goblin Faction",
  "description.nightshade.faction.banner":
    "A display of allegiance to the Nightshade Faction",
  "description.bumpkin.faction.banner":
    "A display of allegiance to the Bumpkin Faction",
  "description.oil.reserve": "A source of oil",

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
  "description.desertgnome":
    "A gnome that can survive the harshest of conditions.",
  "description.battleCryDrum": "",
  "description.bullseyBoard": "",
  "description.chessRug": "",
  "description.cluckapult": "",
  "description.goldenGallant": "",
  "description.goldenGarrison": "",
  "description.goldenGurdian": "",
  "description.noviceKnight": "",
  "description.regularPawn": "",
  "description.rookieRook": "",
  "description.silverSentinel": "",
  "description.silverStallion": "",
  "description.silverSquire": "",
  "description.traineeTarget": "",
  "description.twisterRug": "",
  "description.gauchoRug": "A commerative rug to support South Brazil.",
  "description.ricePanda": "A smart panda never forgets to water the rice.",
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
  "delivery.feed": "这不是免费的，我要养活一个部落！",
  "delivery.fee": "我将拿出其中的30%作为妖精社区金库的资源。",
  "delivery.goblin.comm.treasury": "妖精社区金库",
};

const deliveryHelp: Record<DeliveryHelp, string> = {
  "deliveryHelp.pumpkinSoup":
    "收集食材，乘船前往南瓜广场，将订单交给乡巴佬以获得奖励！",
  "deliveryHelp.hammer": "扩大您的土地以解锁更多的空间和更多的送货订单。",
  "deliveryHelp.axe": "完成你的家务然后在广场找到汉克来领取你的奖励。",
  "deliveryHelp.chest": "通过完成多个订单来与乡巴佬建立关系以解锁奖励。",
};

const deliveryitem: Record<DeliveryItem, string> = {
  "deliveryitem.inventory": "存货：",
  "deliveryitem.itemsToDeliver": "递送的物品：",
  "deliveryitem.deliverToWallet": "送达您的钱包",
  "deliveryitem.viewOnOpenSea": "一旦交付，您将能够在 OpenSea 上查看您的物品。",
  "deliveryitem.deliver": "递送",
};

const depositWallet: Record<DepositWallet, string> = {
  "deposit.errorLoadingBalances": "加载您的余额时出错。",
  "deposit.yourPersonalWallet": "您的个人钱包",
  "deposit.farmWillReceive": "您的农场将收到",
  "deposit.depositDidNotArrive": "押金没到？",
  "deposit.goblinTaxInfo": "当玩家提取任何 SFL 时，都会征收妖精税。",
  "deposit.sendToFarm": "送往农场",
  "deposit.toDepositLevelUp": "要存入物品你必须先升级",
  "deposit.level": "3级",
  "deposit.noSflOrCollectibles": "未找到 SFL 或收藏品！",
  "deposit.farmAddress": "农场地址",
  "question.depositSFLItems":
    "您想存入 Sunflower Land 的收藏品、可穿戴物品或 SFL 吗？",
};

const detail: Record<Detail, string> = {
  "detail.how.item": "如何獲得此物品？",
  "detail.Claim.Reward": "领取奖励",
  "detail.basket.empty": "您的购物篮是空的！",
  "detail.view.item": "在 Opensea 上查看商品",
};

const discordBonus: Record<DiscordBonus, string> = {
  "discord.bonus.niceHat": "“你的帽子看起来很棒！”",
  "discord.bonus.attentionEvents": "不要错过 Discord 上的特别活动和赠品。",
  "discord.bonus.bonusReward": "奖金奖励",
  "discord.bonus.payAttention":
    "请务必关注 Discord 上的特别活动和赠品，这样你就不会错过任何令人兴奋的机会。",
  "discord.bonus.enjoyCommunity":
    "我们希望你作为我们社区的一员拥有愉快的经历！",
  "discord.bonus.communityInfo":
    "你是否知道我们充满活力的 Discord 社区拥有超过 85,000 名农民？",
  "discord.bonus.farmingTips":
    "如果你正在寻找农业技巧和窍门，这里是完美的地方。",
  "discord.bonus.freeGift": "最棒的是……每个加入的人都会得到一份礼物！",
  "discord.bonus.connect": "连接到 Discord",
};

const donation: Record<Donation, string> = {
  "donation.one": "这是一个社区艺术项目，非常感谢捐赠！",
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
  "draftBid.howAuctionWorks": "拍卖如何进行？",
  "draftBid.unsuccessfulParticipants":
    "未满足投标要求的参与者将获得其资源的全额补偿。",
  "draftBid.termsAndConditions": "条款和条件",
};

// Will Skip this category first, cuz I don’t think this page is used atm
const errorAndAccess: Record<ErrorAndAccess, string> = {
  "errorAndAccess.blocked.betaTestersOnly":
    "Access limited to beta testers only",
  "errorAndAccess.denied.message": "You don't have access to the game yet.",
  "errorAndAccess.instructions.part1": "Make sure you have joined the ",
  "errorAndAccess.sflDiscord": "Sunflower Land Discord",
  "errorAndAccess.instructions.part2":
    ", go to the #verify channel and have the 'farmer' role.",
  "error.cannotPlaceInside": "无法放置在里面",
};

const errorTerms: Record<ErrorTerms, string> = {
  "error.betaTestersOnly": "仅限 Beta 测试人员！",
  "error.congestion.one":
    "我们正在尽力，但看起来 Polygon 的流量太大或者您丢失了连接。",
  "error.congestion.two": "如果此错误继续，请尝试更改您的 Metamask RPC",
  "error.connection.one": "看起来我们无法完成这个请求。",
  "error.connection.two": "这可能是一个简单的连接问题。",
  "error.connection.three": "您可以点击刷新再试一次。",
  "error.connection.four":
    "如果问题仍然存在，您可以联系我们的支持团队或跳转到我们的 Discord 并询问我们的社区来寻求帮助。",
  "error.diagnostic.info": "诊断信息",
  "error.forbidden.goblinVillage": "您无权访问妖精林村！",
  "error.multipleDevices.one": "多台设备打开",
  "error.multipleDevices.two":
    "请确保您正在使用的所有其他浏览器选项卡或设备都已关闭。",
  "error.multipleWallets.one": "多余钱包",
  "error.multipleWallets.two":
    "看来您安装了多个钱包。这可能会导致意外行为。您可以尝试禁用所有钱包，只留下一个吗？",
  "error.polygonRPC": "请重试或检查您的 Polygon RPC 设置。",
  "error.toManyRequest.one": "请求太多！",
  "error.toManyRequest.two": "看来您很忙！请稍后再试。",
  "error.Web3NotFound": "未找到 Web3",
  "error.wentWrong": "出了些问题！",
  "error.clock.not.synced": "时钟不同步。",
  "error.polygon.cant.connect": "无法连接到 Polygon。",
  "error.composterNotExist": "堆肥器不存在。",
  "error.composterNotProducing": "堆肥机不生产任何东西",
  "error.composterAlreadyDone": "堆肥器已完成。",
  "error.composterAlreadyBoosted": "已经提升了。",
  "error.missingEggs": "丢失的鸡蛋",
  "error.insufficientSFL": "SFL 不足。",
  "error.insufficientSpaceForChickens": "没有足够的空间饲养更多鸡。",
  "error.dailyAttemptsExhausted": "每日的尝试都已用尽。",
  "error.missingRod": "釣魚竿不见了。",
  "error.missingBait": "Missing ", // not used
  "error.alreadyCasted": "已投",
  "error.unsupportedChum": "{{chum}} 不是受支持的 chum",
  "error.insufficientChum": "筹码不足",
  "error.alr.composter": "堆肥机已经开始工作",
  "error.no.alr.composter": "堆肥机不能生产农产品",
  "error.missing": "缺失的要求",
  "error.no.ready": "堆肥尚未准备好",
  "error.noprod.composter": "堆肥机不产生任何肥料",
  "error.buildingNotExist": "建筑物不存在",
  "error.buildingNotCooking": "建筑未烹饪任何东西",
  "error.recipeNotReady": "食谱未就绪",
  "error.npcsNotExist": "NPC 不存在",
  "error.noDiscoveryAvailable": "没有可用的发现",
  "error.obsessionAlreadyCompleted": "这种痴迷已经完成",
  "error.collectibleNotInInventory": "您没有所需的收藏品",
  "error.wearableNotInWardrobe": "您没有所需的可穿戴设备",
  "error.requiredBuildingNotExist": "所需建筑不存在",
  "error.cookingInProgress": "烹饪已在进行中",
  "error.insufficientIngredient": "成分不足",
  "error.itemNotExist": "项目不存在",
  "error.notEnoughStock": "库存不足",
  "error.tooEarly": "太早",
  "error.tooLate": "太迟",
  "error.decorationCollides": "装饰碰撞",
  "error.idAlreadyExists": "ID已存在",
  "error.ClientRPC": "客户端 RPC 错误",
  "error.insufficientCoins": "硬币不足",

  "error.walletInUse.one": "Wallet in Use",
  "error.walletInUse.two":
    "This wallet is already linked to a farm. Please use social login or another wallet.",
  "error.walletInUse.three": "Try another login method",
  "error.notEnoughOil": ENGLISH_TERMS["error.notEnoughOil"],
  "error.oilCapacityExceeded": ENGLISH_TERMS["error.oilCapacityExceeded"],
};

const event: Record<Event, string> = {
  "event.christmas": "圣诞节活动！",
  "event.LunarNewYear": "农历新年活动",
  "event.GasHero": "燃气英雄活动",
  "event.valentines.rewards": "情人节奖励",
  "event.Easter": "复活节活动",
};

const exoticShopItems: Record<ExoticShopItems, string> = {
  "exoticShopItems.line1":
    "我们的豆子店要关门了，因为我们的豆子要和一位疯狂的科学家一起踏上新的旅程。",
  "exoticShopItems.line2": "感谢您加入我们这个热爱豆科植物的社区。",
  "exoticShopItems.line3": "致以最诚挚的问候，",
  "exoticShopItems.line4": "豆豆团队",
};

const factions: Record<Factions, string> = {
  "faction.join": "Join {{faction}}",
  "faction.description.sunflorians":
    "The Sunflorians are the royals that rule over Sunflower Land. Do you believe in power and rules?",
  "faction.description.bumpkins":
    "The Bumpkins are the farmers and all round lifeblood of Sunflower Land. Do you believe in hard work and community?",
  "faction.description.goblins":
    "The Goblins are the mischievous industrialists of Sunflower Land. Do you believe in progress and innovation?",
  "faction.description.nightshades":
    "The Nightshades are the mysterious and magical beings of Sunflower Land. Do you believe in magic and secrets?",
  "faction.countdown": "In {{timeUntil}} the faction battle begins.",
  "faction.join.confirm": "Do you want to join the {{faction}}?",
  "faction.cannot.change": "You cannot change factions once you have chosen.",
  "faction.joined.sunflorians.intro":
    "Greetings, noble Sunflorian! Join us as we rally our forces to claim supremacy and uphold the honor of our kingdom.",
  "faction.joined.bumpkins.intro":
    "Hey there, fellow Bumpkin! It's time to unite our farming brethren and show the other factions the power of hard work and unity.",
  "faction.joined.goblins.intro":
    "Salutations, crafty Goblin! With our minds sharp and our schemes devious, victory shall be ours in the battles ahead.",
  "faction.joined.nightshades.intro":
    "Greetings, enigmatic Nightshade! Together, we shall navigate the shadows and unveil the secrets that will lead us to victory in the battles ahead.",
  "faction.earn.emblems": "Earn Emblems",
  "faction.earn.emblems.time.left": "{{timeLeft}} left",
  "faction.emblems.tasks":
    "Earn faction points by making donations or completing seasonal deliveries to become eligible for the faction emblems airdrop.",
  "faction.view.leaderboard": "View Leaderboard",
  "faction.donation.request.message":
    "Greetings, {{faction}}! We are currently accepting donations of resources and SFL to help build up our faction. You will be rewarded faction points in return for your generosity.",
  "faction.donation.label": "{{faction}} Faction Donation",
  "faction.donation.sfl": "SFL donations min(10)",
  "faction.donation.sfl.max.per.day": "{{donatedToday}}/500 max per day",
  "faction.donation.bulk.resources": "Bulk resource donations (min {{min}})",
  "faction.donation.bulk.resources.unlimited.per.day":
    "{{donatedToday}}/unlimited per day",
  "faction.donation.confirm":
    "Are you sure you want to donate the following for a total of {{factionPoints}} faction points?",
  "faction.seasonal.delivery.start.at": "Seasonal Deliveries begin in {{days}}",
  "faction.points.with.number": "Faction points: {{points}}",
  "faction.points.title": "Faction Points",
  "faction.points.pledge.warning":
    "Pledge a faction to receive faction points!",
};

const festiveTree: Record<FestiveTree, string> = {
  "festivetree.greedyBumpkin": "发现贪婪的乡巴佬",
  "festivetree.alreadyGifted": "这棵树已被赠送。 请等到下一个圣诞节再庆祝吧。",
  "festivetree.notFestiveSeason": "现在不是节日。 晚点再来吧",
};

const fishDescriptions: Record<FishDescriptions, string> = {
  // Fish
  "description.anchovy.one": "海洋中的袖珍飞镖，总是匆匆忙忙的！",
  "description.anchovy.two": "小鱼大味！",
  "description.butterflyfish.one": "时尚前卫的鱼，展示其鲜艳、时髦的条纹。",
  "description.butterflyfish.two": "游弋在色彩和味道中！",
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
  "description.battle.fish": "The rare armored swimmer of faction season!",
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
  "flower.breed.sunflower": "Bumpkin Botanists swear they're not flowers.",
  "flower.breed.cauliflower":
    "Not so sure what the Bumpkin Botanists say about this one.",
  "flower.breed.beetroot": "It has a beautiful purple color.",
  "flower.breed.parsnip":
    "A parsnip might be a good choice to cross breed with.",
  "flower.breed.eggplant":
    "Eggplant has a vibrant color, perhaps it will cross breed well.",
  "flower.breed.radish": "Wow, this radish is red!",
  "flower.breed.kale": "It's green, but not like the other greens.",
  "flower.breed.blueberry":
    "These blueberries are very ripe, I hope they don't stain.",
  "flower.breed.apple": "Crunchy apples!",
  "flower.breed.banana": "A bunch of bananas.",
  "flower.breed.redPansy": "A red pansy.",
  "flower.breed.yellowPansy": "A yellow pansy.",
  "flower.breed.purplePansy": "A purple pansy.",
  "flower.breed.whitePansy":
    "A white pansy. Devoid of color, I wonder if this is rare.",
  "flower.breed.bluePansy": "A blue pansy.",
  "flower.breed.redCosmos": "A red cosmos.",
  "flower.breed.yellowCosmos": "A yellow cosmos.",
  "flower.breed.purpleCosmos": "A purple cosmos.",
  "flower.breed.whiteCosmos": "A white cosmos.",
  "flower.breed.blueCosmos": "A blue cosmos. Very descriptive.",
  "flower.breed.prismPetal":
    "An extremely rare mutation, are you sure you want to cross breed this?",
  "flower.breed.redBalloonFlower":
    "Balloon flowers are very pretty. The red ones especially.",
  "flower.breed.yellowBalloonFlower": "A yellow balloon flower.",
  "flower.breed.purpleBalloonFlower": "A purple balloon flower.",
  "flower.breed.whiteBalloonFlower": "A white balloon flower. This is rare.",
  "flower.breed.blueBalloonFlower":
    "The most basic of balloon flowers. Nothing to brag about.",
  "flower.breed.redDaffodil": "A red daffoldil",
  "flower.breed.yellowDaffodil": "A yellow daffoldil",
  "flower.breed.purpleDaffodil": "A purple daffoldil",
  "flower.breed.whiteDaffodil": "A white daffoldil",
  "flower.breed.blueDaffodil": "A blue daffoldil",
  "flower.breed.celestialFrostbloom":
    "An extremely rare mutation. Are you sure you want to cross breed this?",
  "flower.breed.redCarnation":
    "Bumpkins value the red carnation for its rarity.",
  "flower.breed.yellowCarnation":
    "Bumpkins don't value the yellow carnation for.",
  "flower.breed.purpleCarnation":
    "Bumpkins value the purple carnation for its beauty.",
  "flower.breed.whiteCarnation":
    "Bumpkins value the yellow carnation for its simplicity.",
  "flower.breed.blueCarnation":
    "Bumpkins value the blue carnation for its ability to cross breed with Bloom seeds.",
  "flower.breed.redLotus": "A red lotus",
  "flower.breed.yellowLotus": "A yellow lotus",
  "flower.breed.purpleLotus": "A purple lotus",
  "flower.breed.whiteLotus": "A white lotus",
  "flower.breed.blueLotus": "A blue lotus",
  "flower.breed.primulaEnigma":
    "An extremely rare mutation, are you sure you want to cross breed this?",
};

const flowerShopTerms: Record<FlowerShopTerms, string> = {
  "flowerShop.desired.dreaming":
    "Oh, I've been dreaming of cultivating a {{desiredFlowerName}}!",
  "flowerShop.desired.delightful":
    "How delightful it would be to have a {{desiredFlowerName}}.",
  "flowerShop.desired.wonderful":
    "How wonderful it would be to have a {{desiredFlowerName}}!",
  "flowerShop.desired.setMyHeart":
    "I've set my heart on growing a {{desiredFlowerName}}.",
  "flowerShop.missingPages.alas":
    "But alas! I've misplaced the pages of my cross-breeding book! They must be in the plaza somewhere.",
  "flowerShop.missingPages.cantBelieve":
    "But I can't believe it, the pages with my best hybrid flower recipes are missing. They must be in the plaza somewhere.",
  "flowerShop.missingPages.inABind":
    "However, I'm in a bit of a bind – the pages containing my cross-breeding techniques seem to have disappeared. They must be in the plaza somewhere.",
  "flowerShop.missingPages.sadly":
    "Sadly, my cross-breeding notes are gone! I'm sure they're somewhere around here. They must be in the plaza somewhere.",
  "flowerShop.noFlowers.noTrade":
    "I'm sorry, I don't have any flowers to trade right now.",
  "flowerShop.do.have.trade":
    "Do you have a {{desiredFlower}} you would trade me?",
  "flowerShop.do.have.trade.one":
    "Do you have a {{desiredFlower}} you would be willing to trade?",
};

const foodDescriptions: Record<FoodDescriptions, string> = {
  // Fire Pit
  "description.pumpkin.soup": "妖精们喜爱的奶油汤。",
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
  "description.rapidRoast": "For Bumpkins in a hurry...",

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
  "description.beetrootBlaze": "A spicy beetroot-infused magic mushroom dish",

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
    "The essence of bees and enchanted fungi",

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
  "description.sushirRoll": "Delicious sushi roll, skillfully prepared.",
  "description.theLot": "Flavorful fruit blend, refreshing and nutritious.",
  "description.tofuScramble":
    "Hearty scramble, packed with protein and flavor.",
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
  "description.scroll": "A ticket used during the Clash of Factions Season",
};

const gameTerms: Record<GameTerms, string> = {
  "auction.winner": "Auction Winner!",
  "bumpkin.level": "Bumpkin level",
  bumpkinBuzz: "Bumpkin Buzz",
  dailyLim: "Daily SFL Limit",
  "farm.banned": "This farm is banned",
  gobSwarm: "Goblin Swarm!",
  "granting.wish": "Granting your wish",
  "new.delivery.in": "新交付可用于：",
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
  "new.delivery.levelup": "Level up to unlock more deliveries.",
  "harvest.number": ENGLISH_TERMS["harvest.number"],
  "level.number": ENGLISH_TERMS["level.number"],
  "visiting.farmId": ENGLISH_TERMS["visiting.farmId"],
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
  "getContent.error": "Error!",
  "getContent.joining": "Joining",
  "getContent.accessGranted":
    "You now have access. Go check out the channel in Discord",
  "getContent.connectToDiscord":
    "You must be connected to Discord to join a restricted channel.",
  "getContent.connect": "Connect",
  "getContent.getAccess": "Get access to restricted groups on Discord",
  "getContent.requires": "Requires",
  "getContent.join": "Join",
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
  "goblinTrade.bulk": "Bulk Amount",
  "goblinTrade.conversion": "Conversion",
  "goblinTrade.select": "Select resource to sell",
  "goblinTrade.hoarding": "Oh no! You've reached the max SFL.",
  "goblinTrade.vipRequired": "VIP Access Required",
  "goblinTrade.vipDelivery":
    "Hmmm, looks like you are a basic Bumpkin. I only trade with VIPs.",
};

const goldTooth: Record<GoldTooth, string> = {
  "goldTooth.intro.part1":
    "Arrr, me hearties! The treasure-diggin' area be teemin' with wealth and adventure, and it be openin' its gates soon for ye daring farmers!",
  "goldTooth.intro.part2":
    "Be ready to join me crew, for the hunt for riches begins shortly!",
};

const guideCompost: Record<GuideCompost, string> = {
  "guide.compost.add.eggs.speed": "添加鸡蛋以加快生产速度",
  "guide.compost.add.eggs": "添加鸡蛋",
  "guide.compost.eggs": "鸡蛋",
  "guide.compost.cropGrowthTime": "-50% 庄稼生长时间",
  "guide.compost.fishingBait": "钓鱼饵",
  "guide.compost.placeCrops": "将作物放入堆肥机中喂养虫儿",
  "guide.compost.compostCycle":
    "一个堆肥周期可以生产多个肥料，可用来促进你的作物和水果生长",
  "guide.compost.yieldsWorms": "每个堆肥产出的蚯蚓可以用作钓鱼的饵",
  "guide.compost.useEggs": "厌倦了等待？使用鸡蛋来加速堆肥生产",
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
  "pete.teaser.one": "Chop the trees",
  "pete.teaser.three": "Harvest the Sunflowers",
  "pete.teaser.four": "Sell the Sunflowers",
  "pete.teaser.five": "Buy Seeds",
  "pete.teaser.six": "Plant Seeds",
  "pete.teaser.seven": "Craft a Scarecrow",
  "pete.teaser.eight": "Cook food and level up",

  "deliveries.intro":
    "Travel to different islands and deliver goods to earn rewards.",
  "deliveries.new": "New delivery",
  "chores.intro":
    "Complete tasks around the farm to earn rewards from Bumpkins.",
};

const halveningCountdown: Record<HalveningCountdown, string> = {
  "halveningCountdown.approaching": "The Halvening is Approaching!",
  "halveningCountdown.description":
    "At the Halvening, all prices of crops & certain resources are halved. This makes it more difficult to attain SFL.",
  "halveningCountdown.preparation": "Make sure you are prepared!",
  "halveningCountdown.title": "Halvening",
};

const harvestBeeHive: Record<HarvestBeeHive, string> = {
  "harvestBeeHive.notPlaced": "This beehive is not placed.",
  "harvestBeeHive.noHoney": "This beehive has no honey.",
};

const harvestflower: Record<Harvestflower, string> = {
  "harvestflower.noFlowerBed": "Flower bed does not exist",
  "harvestflower.noFlower": "Flower bed does not have a flower",
  "harvestflower.notReady": "Flower is not ready to harvest",
  "harvestflower.alr.plant": "Flower is already planted",
};

const hayseedHankPlaza: Record<HayseedHankPlaza, string> = {
  "hayseedHankPlaza.cannotCompleteChore": "Cannot complete this chore?",
  "hayseedHankPlaza.skipChore": "Skip chore",
  "hayseedHankPlaza.canSkipIn": "You can skip this chore in",
  "hayseedHankPlaza.wellDone": "Well done",
  "hayseedHankPlaza.lendAHand": "Lend a hand?",
};

const hayseedHankV2: Record<HayseedHankV2, string> = {
  "hayseedHankv2.dialog1":
    "Well, howdy there, young whippersnappers! I'm Hayseed Hank, a seasoned ol' Bumpkin farmer, tending to the land like in the good ol' days.",
  "hayseedHankv2.dialog2":
    "However, my bones ain't what they used to be. If you can help me with my daily chores, I will reward you with ",
  "hayseedHankv2.action": "Let's do it",
  "hayseedHankv2.title": "Daily Chores",
  "hayseedHankv2.newChoresAvailable": "New chores available in ",
  "hayseedHankv2.skipChores": "You can skip chores each new day.",
  "hayseedHankv2.greeting":
    "Well, howdy there, young whippersnappers! I'm Hayseed Hank...",
};

const heliosSunflower: Record<HeliosSunflower, string> = {
  "heliosSunflower.title": "Clytie the Sunflower",
  "heliosSunflower.description":
    "Only the true saviour can return and harvest this Sunflower.",
  "confirmation.craft": "Are you sure you want to craft",
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
  "henHouse.chickens": "Chickens",
  "henHouse.text.one": "Feed wheat and collect eggs",
  "henHouse.text.two": "Lazy Chicken",
  "henHouse.text.three": "Put your chicken to work to start collecting eggs!",
  "henHouse.text.four": "Working Chicken",
  "henHouse.text.five": "Already placed and working hard!",
  "henHouse.text.six": "Build an extra Hen House to farm more chickens",
};

const howToFarm: Record<HowToFarm, string> = {
  "howToFarm.title": "How to Farm?",
  "howToFarm.stepOne": "1.Harvest crops when they are ready",
  "howToFarm.stepTwo": "2.Visit the town & click on the shop",
  "howToFarm.stepThree": "3.Sell crops at the shop for SFL",
  "howToFarm.stepFour": "4.Buy seeds using your SFL",
  "howToFarm.stepFive": "5. Plant seeds and wait",
};

const howToSync: Record<HowToSync, string> = {
  "howToSync.title": "How to sync?",
  "howToSync.description":
    "All of your progress is saved on our game server. You will need to sync on chain when you want to move your tokens, NFTs and resources onto Polygon.",
  "howToSync.stepOne": "1. Open the menu",
  "howToSync.stepTwo": "2. Click 'Sync on chain'",
};

const howToUpgrade: Record<HowToUpgrade, string> = {
  "howToUpgrade.title": "How to upgrade?",
  "howToUpgrade.stepOne": "1. Talk to a Goblin blocking the fields",
  "howToUpgrade.stepTwo": "2.Visit the town & click on the kitchen",
  "howToUpgrade.stepThree": "3. Craft the food that the goblin wants",
  "howToUpgrade.stepFour": "4. Voila! Enjoy your new fields and crops",
};

const interactableModals: Record<InteractableModals, string> = {
  "interactableModals.returnhome.message": "Would you like to return home?",
  "interactableModals.fatChicken.message":
    "Why won't these Bumpkins leave me alone, I just want to relax.",
  "interactableModals.lazyBud.message": "Eeeep! So tired.....",
  "interactableModals.bud.message":
    "Hmmm, I better leave that bud alone. I'm sure it's owner is looking for it",
  "interactableModals.walrus.message":
    "Arrr arr arrr! The fish shop ain't open 'til I get my fish.",
  "interactableModals.plazaBlueBook.message1":
    "To summon the seekers, we must gather the essence of the land - pumpkins, nurtured by the earth, and eggs, the promise of new beginnings. ",
  "interactableModals.plazaBlueBook.message2":
    "As dusk falls and the moon casts its silvery glow, we offer our humble gifts, hoping to awaken their watchful eyes once more.",
  "interactableModals.plazaOrangeBook.message1":
    "Our brave defenders fought valiantly, but alas, we lost the great war, and the Moonseekers drove us from our homeland. Yet, we hold onto hope, for one day we shall reclaim what was once ours.",
  "interactableModals.plazaOrangeBook.message2":
    "Until then, we will keep Sunflower Land alive in our hearts and dreams, waiting for the day of our triumphant return",
  "interactableModals.beachGreenBook.message1":
    "When you're after those coveted Red Snappers, try an unexpected twist",
  "interactableModals.beachGreenBook.message2":
    "Use Apples with Red Wiggler Bait, and watch those crimson beauties practically leap into your net.",
  "interactableModals.beachBlueBook.message1":
    "Don't tell Shelly, but I've been trying to bring Saw Sharks to the beach!",
  "interactableModals.beachBlueBook.message2":
    "I've been experimenting with different chums lately, but the only one that seems to work is Red Snapper.",
  "interactableModals.beachBlueBook.message3":
    "These oceanic hunters can smell a Red Snapper feast from miles away, so don't be surprised if they come charging. ",
  "interactableModals.beachOrangeBook.message1":
    "A radiant fin appeared on the surface, I couldn't believe my eyes!",
  "interactableModals.beachOrangeBook.message2":
    "Luckily Tango was with me, he must be my good luck charm.",
  "interactableModals.plazaGreenBook.message1":
    "The Bumpkins control these islands, leaving us goblins with scarce work and even scarcer food.",
  "interactableModals.plazaGreenBook.message2":
    "We strive for equality, a place to call our own, where we can live and thrive",
  "interactableModals.fanArt.winner": "Fan art winner",
  "interactableModals.fanArt1.message":
    "Congratulations Palisman, the winner of the first Fan Art competition",
  "interactableModals.fanArt2.message":
    "Congratulations Vergelsxtn, the winner of the Dawn Breaker Party Fan Art competition",
  "interactableModals.fanArt2.linkLabel": "View more",
  "interactableModals.fanArt3.message":
    "The perfect place to for a beautiful painting. I wonder what they will put here next...",
  "interactableModals.clubhouseReward.message1":
    "Patience buddy, rewards are coming...",
  "interactableModals.clubhouseReward.message2":
    "Join #bud-clubhouse on Discord for latest updates.",
  "interactableModals.plazaStatue.message":
    "In honor of Bumpkin Braveheart, the steadfast farmer who rallied our town against the Goblin horde during the dark days of the ancient war.",
  "interactableModals.dawnBook1.message1":
    "For centuries our family has protected Dawn Breaker Island. As the island's bell ringer, we've warned of dangers from the North, even as shadowy creatures threaten our home.",
  "interactableModals.dawnBook1.message2":
    "Our family stands as the first line of defence against the darkness spreading from the North, but alas, our sacrifices go unnoticed.",
  "interactableModals.dawnBook1.message3":
    "Will the day come when our devotion is acknowledged?",
  "interactableModals.dawnBook2.message1":
    "Eggplants, they're more than they appear. Despite their dark exterior that attracts shadowy creatures, they bring light to our dishes.",
  "interactableModals.dawnBook2.message2":
    "Grilled or mashed into a Bumpkin ganoush, their versatility is unmatched. The nightshade vegetables are a symbol of our resilience in the face of adversity.",
  "interactableModals.dawnBook3.message1":
    "Dear diary, the Bumpkins' arrival has brought a ray of hope.",
  "interactableModals.dawnBook3.message2":
    "I dream of the day I can steer my own boat to Sunfloria, the land where adventurers and travelers congregate.",
  "interactableModals.dawnBook3.message3":
    "I've heard whispers about the Bumpkins' special preparations there - a beacon of promise in these challenging times.",
  "interactableModals.dawnBook4.message1":
    "The gnomes, their allure was too potent to resist.",
  "interactableModals.dawnBook4.message2":
    "The Witch's instructions echoed in my mind - 'Align the three, and power shall be yours.'",
  "interactableModals.dawnBook4.message3":
    "Alas, even the eggplant soldiers couldn't guard against the temptation. But I will not falter. One day, I will claim the power I rightfully deserve?.",
  "interactableModals.timmyHome.message":
    "Oh, gee, I really want you to explore my house, but Mom told me not to talk to strangers, maybe it's for the best.",
  "interactableModals.windmill.message":
    "Ah, my windmill is under repair, can't have anyone snooping around while I fix it up, come back later.",
  "interactableModals.igorHome.message":
    "Get lost! I'm in no mood for visitors, especially nosy ones like you!",
  "interactableModals.potionHouse.message1":
    "Watch out friend, the crazy scientist lives in there!",
  "interactableModals.potionHouse.message2":
    "Rumour has it they are searching for Bumpkin apprentices to grow mutant crops with them.",
  "interactableModals.guildHouse.message":
    "Hold on Bumpkin! You need a Bud if you want to enter the Guild House.",
  "interactableModals.guildHouse.budsCollection": "Buds Collection on Opensea",
  "interactableModals.bettyHome.message":
    "Oh, sweetie, as much as I love my crops, my house is a private space, not open to visitors right now.",
  "interactableModals.bertHome.message":
    "Intruders! They must be after my collection of rare items and secrets, I can't let them in!",
  "interactableModals.beach.message1": "Have you been to the beach?",
  "interactableModals.beach.message2":
    "Rumour has that it is filled with luxurious treasures! Unfortunately it is under construction.",
  "interactableModals.castle.message":
    "Hold it there peasant! There is no way I'm letting you visit the castle",
  "interactableModals.woodlands.message":
    "Are you travelling to the woodlands? Make sure you pick up some delicious mushrooms!",
  "interactableModals.port.message":
    "Hold it there! The Goblin's are still building the port. It will be ready for travel and fishing soon.",
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

const islandupgrade: Record<Islandupgrade, string> = {
  "islandupgrade.confirmUpgrade":
    "Are you sure you want to upgrade to a new island.",
  "islandupgrade.warning":
    "Make sure you do not have any crops, fruit, buildings or chickens in progress. These will be returned to your inventory.",
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
  "islandupgrade.welcomeDesertIsland": "Welcome to the Desert!",
  "islandupgrade.desertResourcesDescription":
    "The harsh desert environment requires new technology to survive. Expand your land to discover new buildings and what's inside!",
  "islandupgrade.requiredIsland": "Unlocks on {{islandType}} Island",
};

const landscapeTerms: Record<LandscapeTerms, string> = {
  "landscape.intro.one": "Design your dream island!",
  "landscape.intro.two":
    "In design mode you can hold, drag & move items around.",
  "landscape.intro.three": "Craft rare decorations",
  "landscape.intro.four": "Place collectibles from your chest",
  "landscape.expansion.one":
    "Howdy Bumpkin, would you like to expand your land? You can discover new resources, crops, and rewards.",
  "landscape.expansion.two": "More expansions will be available soon...",
  "landscape.timerPopover": "Next Expansion",
  "landscape.dragMe": "Drag me",
  "landscape.expansion.date":
    "More expansions will be available on the 7th February.",
  "landscape.great.work": "Great work Bumpkin!",
};

const letsGo: Record<LetsGo, string> = {
  "letsGo.title": "Time to play!",
  "letsGo.description":
    "Thanks for playing beta! We are still working on the game and appreciate your support during the early stages!",
  "letsGo.readMore": "You can read more about the game in the ",
  "letsGo.officialDocs": "official docs",
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
  "megaStore.timeRemaining": "剩下{{timeRemaining}}！",
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

const nftminting: Record<NFTMinting, string> = {
  "nftminting.mintAccountNFT": "Minting Account NFT",
  "nftminting.mintingYourNFT":
    "Minting your NFT and storing progress on the Blockchain",
  "nftminting.almostThere": "Almost there",
};

const noaccount: Record<Noaccount, string> = {
  "noaccount.newFarmer": "新农民",
  "noaccount.addPromoCode": "添加促销代码？",
  "noaccount.alreadyHaveNFTFarm": "已经有农场了？",
  "noaccount.createFarm": "创建农场",
  "noaccount.noFarmNFTs": "You do not own any farm NFTs.",
  "noaccount.createNewFarm": "Create new farm",
  "noaccount.selectNFTID": "Select your NFT ID:",
  "noaccount.welcomeMessage": "欢迎来到 Sunflower Land！ 看来你还没有农场。",
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
  "noBumpkin.mintBumpkin": "You can get a Bumpkin from OpenSea:",
  "noBumpkin.allBumpkins": "Wow, look at all those Bumpkins!",
  "noBumpkin.chooseBumpkin": "Which Bumpkin would you like to play with?",
  "noBumpkin.deposit": "Deposit",
  "noBumpkin.advancedIsland":
    "This is an advanced island. A strong Bumpkin is required:",
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

const notOnDiscordServer: Record<NotOnDiscordServer, string> = {
  "notOnDiscordServer.intro":
    "Looks like you haven't joined the Sunflower Land Discord Server yet.",
  "notOnDiscordServer.joinDiscord": "Join our ",
  "notOnDiscordServer.discordServer": "Discord Server",
  "notOnDiscordServer.completeVerification":
    "2. Complete verification & get started",
  "notOnDiscordServer.acceptRules": "3. Accept the rules in #rules",
};

const noTownCenter: Record<NoTownCenter, string> = {
  "noTownCenter.reward": "Reward: 1 x Town Center!",
  "noTownCenter.news": "Your latest news or statement here.",
  "noTownCenter.townCenterPlacement":
    "You can place the Town Center through the inventory  building section",
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
    "No active order from GrimTooth at the moment, but don't worry. If you're in need of exquisite craftsmanship or have materials for me to work with, I'll be here, ready to create.",
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
  "bert.day":
    "You cannot withdraw this item for 3 days after claiming {{seasonalTicket}}s.",
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
    "I'm yearning for a beautiful Cosmos in White, or Blue. Can you find one?",
  "npcDialogues.finn.averageFlower":
    "Not exactly what I was hoping for, but it's quite pleasing. Thank you.",
  "npcDialogues.finn.badFlower":
    "This flower doesn't quite meet my expectations. Perhaps another try?",
  "npcDialogues.finn.goodFlower":
    "This Cosmos is stunning! Thank you for bringing it to me.",

  "npcDialogues.finley.reward":
    "Thank you for your efforts. Here's a small token of appreciation for your deliveries.",
  "npcDialogues.finley.flowerIntro":
    "A lovely Daffodil, like the one I'm thinking of, would brighten up my day. Have you seen one?",
  "npcDialogues.finley.averageFlower":
    "It's not exactly what I had in mind, but it's quite charming. Thank you.",
  "npcDialogues.finley.badFlower":
    "This flower isn't quite right. Perhaps another one would be more suitable?",
  "npcDialogues.finley.goodFlower":
    "This Daffodil is beautiful! Thank you for bringing it to me.",

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
    "This Purple flower is perfect! Thank you for bringing it to me.",

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

export const NYON_STATUE: Record<NyonStatue, string> = {
  "nyonStatue.memory": "In memory of",
  "nyonStatue.description":
    "The legendary knight responsible for clearing the goblins from the mines. Shortly after his victory he died by poisoning from a Goblin conspirator. The Sunflower Citizens erected this statue with his armor to commemorate his conquests.",
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
  "orderhelp.Skip.hour": "要跳过订单，你必须在下订单后等待 24 小时。",
  "orderhelp.New.Season":
    "A new season approaches, deliveries will temporarily close.",
  "orderhelp.New.Season.arrival": "New Seasonal Deliveries opening soon.",
  "orderhelp.Wisely": "Choose wisely!",
  "orderhelp.SkipIn": "跳入：",
  "orderhelp.NoRight": "先别跳",
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

const pickserver: Record<Pickserver, string> = {
  "pickserver.server": "Choose a server to join",
  "pickserver.full": "FULL",
  "pickserver.explore": "Explore custom project islands.",
  "pickserver.built": "Do you want to build your own island?",
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

const playerTrade: Record<PlayerTrade, string> = {
  "playerTrade.no.trade": "No trades available.",
  "playerTrade.max.item": "Oh no! You've reached your max items.",
  "playerTrade.Progress":
    "Please store your progress on chain before continuing.",
  "playerTrade.transaction":
    "Oh oh! It looks like you have a transaction in progress.",
  "playerTrade.Please": "Please allow 5 minutes before continuing.",
  "playerTrade.sold": "Sold",
  "playerTrade.sale": "For sale:",
  "playerTrade.title.congrat": "Congratulations, your listing was purchased",
};

const portal: Record<Portal, string> = {
  "portal.wrong": "Something went wrong",
  "portal.unauthorised": "unauthorised",
};

const promo: Record<Promo, string> = {
  "promo.cdcBonus": "Crypto.com Bonus!",
  "promo.expandLand": "Expand your land twice to claim 100 SFL.",
};

const purchaseableBaitTranslation: Record<PurchaseableBaitTranslation, string> =
  {
    "purchaseableBait.fishingLure.description":
      "Great for catching rare fish ! ",
  };

const quest: Record<Quest, string> = {
  "quest.mint.free": "Mint Free Wearable",
  "quest.equipWearable": "Equip this wearable on your Bumpkin",
  "quest.congrats": "Congratulations, you have minted a {{wearable}}!",
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

const removeCropMachine: Record<RemoveCropMachine, string> = {
  "removeCropMachine.title": ENGLISH_TERMS["removeCropMachine.title"],
  "removeCropMachine.description":
    ENGLISH_TERMS["removeCropMachine.description"],
  "removeCropMachine.removeSeeds":
    ENGLISH_TERMS["removeCropMachine.removeSeeds"],
};

const removeHungryCaterpillar: Record<RemoveHungryCaterpillar, string> = {
  "removeHungryCaterpillar.title": "Remove Hungry Catepillar?",
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

const resources: Record<Resources, string> = {
  "resources.recoversIn": "恢复时间：",
  "resources.boulder.rareMineFound": "You found a rare mine!",
  "resources.boulder.advancedMining": "Advanced mining on its way.",
};

const resourceTerms: Record<ResourceTerms, string> = {
  "chicken.description": "用来下蛋",
  "magicMushroom.description": "用于烹饪高级食谱",
  "wildMushroom.description": "用于烹饪基础食谱",
  "honey.description": "用于使你的烹饪更甜",
};

export const restrictionReason: Record<RestrictionReason, string> = {
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
};

const restock: Record<Restock, string> = {
  "restock.one.buck": "你将使用1个Blockbuck来补充游戏中所有商店的物品。",
  "restock.sure": "你确定要补货吗？",
  "restock.seed.buy": "你的篮子里的种子太多了！",
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
  "season.megastore.discount": "Megastore SFL discount",
  "season.supporter.gift": "Supporter Gift",
  "season.free.season.passes": "Free Season Banners",
  "season.free.season.passes.description": "Receive banners for every Season",
  "season.vip.access": "Season VIP Access",
  "season.vip.description":
    "Unlock perks, discounts, bonus tickets, airdrops and more!",
  "season.mystery.gift": "Mystery Gift",
  "season.xp.boost": "10% XP boost",
  "season.lifetime.farmer": "Lifetime Farmer",
  "season.free.with.lifetime": "Free with Lifetime Farmer",
  "season.vip.claim": "Claim your monthly seasonal airdrop.",
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
  "betty.post.sale.one": "嘿嘿！ 欢迎回来。",
  "betty.post.sale.two": "你们帮助解决了庄稼短缺问题，价格也恢复了正常。",
  "betty.post.sale.three": "是时候种植一些更大更好的庄稼了！",
  "betty.welcome": "欢迎来到我的市场。 你想干什么？",
  "betty.buySeeds": "购买种子",
  "betty.sellCrops": "卖庄稼",
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
  "special.event.link": "Airdrop link",
  "special.event.claimForm":
    "Please fill in the form below to claim your airdrop.",
  "special.event.airdropHandling":
    "Airdrops are handled externally and may take a few days to arrive.",
  "special.event.walletRequired": "Wallet Required",
  "special.event.web3Wallet":
    "A Web3 wallet is required for this event as it contains an Airdrop.",
  "special.event.airdrop": "Airdrop",
  "special.event.finishedLabel": "Event Finished",
  "special.event.finished":
    "This event has finished. Stay tuned for future events!",
  "special.event.ineligible":
    "There is no work needing to be done right now, thanks for stopping by though!",

  "special.event.easterIntro":
    "Oh no, my 6 rabbits have gone missing again....they must be searching for food. Can you help me find them? They look similar to other rabbits but have a unique sparkle. Click on them to capture them.",
  "special.event.rabbitsMissing": "Rabbits missing",
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
  "statements.tapCont": "点击继续",

  "statements.tutorial.one":
    "The boat will take you between islands where you can discover new lands and exciting adventures.",
  "statements.tutorial.two":
    "Many lands are far away and will require an experienced Bumpkin before you can visit them.",
  "statements.tutorial.three":
    "Your adventure begins now, how far you explore ... that is on you.",
  "statements.visit.firePit": "访问 Fire Pit 做饭并喂你的乡巴佬。",
  "statements.wishing.well.info.four": "provide liquidity",
  "statements.wishing.well.info.five": " in the game",
  "statements.wishing.well.info.six": "providing liquidity",
  "statements.wishing.well.worthwell": "worth of rewards in the well!",
  "statements.wishing.well.look.like":
    "It doesn't look like you are providing liquidity yet.",
  "statements.wishing.well.lucky": "Let's see how lucky you are!",
  "statements.wrongChain.one":
    "Check out this guide to help you get connected.",
  "statements.feed.bumpkin.one": "你的库存中没有食物。",
  "statements.feed.bumpkin.two": "你需要烹饪食物来喂养你的土包。",
  "statements.empty.chest": "Your chest is empty, discover rare items today!",
  "statements.chest.captcha": "点击箱子将其打开",
  "statements.frankie.plaza": "Travel to the plaza to craft rare decorations!",
  "statements.blacksmith.plaza": "Travel to the Plaza for more rare items.",
  "statements.water.well.needed.one": "需要追加 Water Well。",
  "statements.water.well.needed.two":
    "为了支持更多的庄稼，建造更多的 Water Well。",
  "statements.soldOut": "Sold out",
  "statements.inStock": "库存",
  "statements.soldOutWearables": "View sold out wearables",
  "statements.craft.composter": "Craft at Composter",
  "statements.wallet.to.inventory.transfer": "Deposit items from your wallet",
  "statements.crop.water": "These crops need water!",
  "statements.daily.limit": "Daily Limit:",
  "statements.sure.buy": "Are you sure you want to buy",
  "statements.perplayer": "per Player",
  "statements.minted.goToChest": "Go to your chest and place it on your island",
  "statements.minted.withdrawAfterMint":
    "You will be able to withdraw your item once the mint has finished",
  "statements.startgame": "Start New Game",

  "statements.session.expired":
    "It looks like your session has expired. Please refresh the page to continue playing.",
  "statements.price.change":
    "Oh no! Looks like the price has changed, please try again!",
  "statements.translation.contribution":
    "If you are interested in contributing translations for your preferred language, please contact one of the Moderators in the Sunflower Land Discord Server:",
  "statements.translation.joinDiscord": "加入 Discord",
  "statements.translation.want2contribute":
    ENGLISH_TERMS["statements.translation.want2contribute"],
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
    " A tie breaker is chosen by whichever Bumpkin has more experience. Unfortunately you lost.",
  "tieBreaker.betterLuck":
    "Time to eat some more cakes! Better luck next time.",
  "tieBreaker.refund": "Refund resource",
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
  "description.oil.drill": "Drill for oil",
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
  "transfer.address": "Wallet address:",
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

const username: Record<Username, string> = {
  "username.tooShort": ENGLISH_TERMS["username.tooShort"],
  "username.tooLong": ENGLISH_TERMS["username.tooLong"],
  "username.invalidChar": ENGLISH_TERMS["username.invalidChar"],
  "username.startWithLetter": ENGLISH_TERMS["username.startWithLetter"],
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
  "wallet.signRequestInWallet": "请在你的钱包中签署请求以继续。",
};

const warningTerms: Record<WarningTerms, string> = {
  "warning.noAxe": "No Axe Selected!",
  "warning.chat.maxCharacters": "Max characters",
  "warning.chat.noSpecialCharacters": "No special characters",
  "warning.level.required": "需要 {{lvl}} 级",
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
  "withdraw.proof": "为了确保游戏安全，我们恳请您快速自拍一张照片以验证身份。",
  "withdraw.verification": "开创验证",
  "withdraw.unsave": "请注意，任何未保存的进度都将丢失。",
  "withdraw.sync": "只有已存储在区块链上的物品才可以被提取。",
  "withdraw.available": "5 月 9 日起发售。",
  "withdraw.sfl.available": "SFL 现已在链上使用。",
  "withdraw.send.wallet": "已存入您的钱包。",
  "withdraw.choose": "请指定您想要提取的 SFL 金额",
  "withdraw.receive": "您将收到 5SFL",
  "withdraw.select.item": "请选择要提取的商品",
  "withdraw.opensea": "提现成功后，您将能够在 OpenSea 上查看您的物品。",
  "withdraw.restricted":
    "Some items cannot be withdrawn. Other items may be restricted when", // To interpolate
  "withdraw.bumpkin.wearing":
    "你的乡巴佬目前穿着以下无法撤回的衣服。你需要先更换衣服，然后才能撤回。",
  "withdraw.bumpkin.sure.withdraw": "您确定要撤回您的乡巴佬吗？",
  "withdraw.buds": "请选择要退出的 Buds",
  "withdraw.budRestricted": "用于今天的 Bud Box",
  "withdraw.bumpkin.closed": "Bumpkin withdrawal has been permanently disabled",
  "withdraw.bumpkin.closing":
    "Bumpkins are moving off chain. Bumpkin withdrawal will be permanently disabled, {{timeRemaining}}",
};

const world: Record<World, string> = {
  "world.intro.one": "你好，旅行者！欢迎来到南瓜广场。",
  "world.intro.two": "广场上住着一群饥饿的乡巴佬和妖精，他们需要你的帮助！",
  "world.intro.three": "踏上旅程之前，请注意以下几点：",
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
  "world.beach": "海滩",
  "world.retreat": "撤退",
  "world.home": "家",
  "world.kingdom": "王国",
  "world.woodlands": "林地",
};

const wornDescription: Record<WornDescription, string> = {
  "worm.earthworm": "吸引小鱼的蠕虫。",
  "worm.grub": "多汁的幼虫——非常适合高级鱼类。",
  "worm.redWiggler": "吸引稀有鱼类的奇异蠕虫。",
};

const trading: Record<Trading, string> = {
  "trading.select.resources": "请选择资源以查看列表",
  "trading.no.listings": "未找到任何列表",
  "trading.listing.congrats": "恭喜，您刚刚列出了要交易的物品！",
  "trading.listing.deleted": "您的列表已被删除",
  "trading.listing.fulfilled": "交易已完成",
  "trading.your.listing": "您的列表",
  "trading.you.receive": "You receive", // not used
  "trading.burned": "is burned.", // not used
};

export const leaderboardTerms: Record<Leaderboard, string> = {
  "leaderboard.leaderboard": "Leaderboard",
  "leaderboard.error": "Error loading leaderboard. Please try again later.",
  "leaderboard.initialising": "Calculating your rank. Please try again later.",
  "leaderboard.topTen": "Top ten",
  "leaderboard.yourPosition": "Your position",
  "leaderboard.factionMembers": "Faction Members",
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
  "minigame.confirm": "Are you sure you want to spend ",
  "minigame.noPrizeAvailable": "No daily prize available",
  "minigame.playNow": "Play now",
  "minigame.purchase": "Purchase",
  "minigame.chickenRescueHelp": "Can you help me rescue the chickens?",
};

export const CHINESE_SIMPLIFIED_TERMS: Record<TranslationKeys, string> = {
  ...achievementTerms,
  ...addSFL,
  ...auction,
  ...availableSeeds,
  ...base,
  ...basicTreasure,
  ...beach,
  ...beachLuck,
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
};
