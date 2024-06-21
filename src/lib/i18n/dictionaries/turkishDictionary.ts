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
  TimeUnits,
  PwaInstall,
  Trading,
  GoblinTrade,
  RestrictionReason,
  RemoveHungryCaterpillar,
  Leaderboard,
  GameOptions,
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
  "2x.sale": "2x Satış",
  achievements: "Başarımlar",
  "amount.matic": "MATIC cinsinden tutar",
  deposit: "Yatır",
  add: "Ekle",
  addSFL: "SFL Ekle",
  "add.liquidity": "Likidite Ekle",
  "alr.claim": "Zaten Talep Edildi!",
  "alr.completed": "Çoktan Tamamlandı",
  "alr.crafted": "Zaten Üretildi!",
  "alr.minted": "Zaten Mintlendi!",
  "are.you.sure": ENGLISH_TERMS["are.you.sure"],
  auction: "Açık Artırma",
  available: "Mevcut",
  back: "Geri",
  bait: "Yem",
  balance: "Bakiye",
  "balance.short": ENGLISH_TERMS["balance.short"],
  banner: "Bayrak",
  banners: "Banners",
  basket: "Sepet",
  beta: "Beta",
  bid: "Teklif",
  bounty: "Ödül",
  build: "İnşa Et",
  buy: "Satın al",
  cancel: "İptal Et",
  "card.cash": "Kart / Nakit",
  check: "Kontrol Et",
  chest: "Sandık",
  chores: "Çiftlik İşleri",
  "choose.wisely": "Akıllıca Seç!",
  claim: "Talep Et",
  "claim.gift": "Hediyeyi Talep Et",
  "claim.skill": "Yeteneği Talep Et",
  clear: "Temizle",
  close: "Kapat",
  coins: ENGLISH_TERMS["coins"],
  collect: "Topla",
  "coming.soon": "Yakında Gelecek",
  completed: "Tamamlandı",
  complete: "Tamamla",
  confirm: "Onayla",
  congrats: "Tebrikler",
  connecting: "Bağlanıyor",
  continue: "Devam Et",
  cook: "Pişir",
  copied: "Kopyalandı",
  "copy.address": "Adresi Kopyala",
  coupons: "Kuponlar",
  craft: "Üret",
  crops: "Mahsuller",
  danger: "Tehlike",
  date: "Tarih",
  deliver: "Teslim Et",
  deliveries: "Teslimatlar",
  "deliveries.closed": ENGLISH_TERMS["deliveries.closed"],
  delivery: "Teslimat",
  details: "Detaylar",
  donate: "Bağış Yap",
  donating: "Bağış Yapılıyor",
  donations: "Donations",
  earn: "Kazan",
  "easter.eggs": "Easter Eggs",
  egg: "Yumurta",
  empty: "Boş",
  "enjoying.event": "Bu etkinlikten memnun musunuz?",
  equip: "Kuşan",
  error: "Hata",
  exchange: "Exchange",
  exotics: "Egzotikler",
  "expand.land": "Adanı Genişlet",
  expand: "Genişlet",
  explore: "Keşfet",
  faction: "Faction",
  farm: "Çiftlik",
  featured: "Öne Çıkanlar",
  fee: "ücret",
  "feed.bumpkin": "Bumpkin’i besle",
  fertilisers: "Gübreler",
  fish: "Balık",
  "fish.caught": "Balık Yakalandı: ",
  flowers: "Çiçekler",
  "flowers.found": "Çiçekler Bulundu",
  foods: "Yemekler",
  for: "için",
  forbidden: "Yasaklı",
  free: ENGLISH_TERMS["free"],
  fruit: "Meyve",
  fruits: "Meyveler",
  gift: "Hediye",
  "go.home": "Eve git",
  gotIt: "Anlaşıldı",
  "grant.wish": "Yeni Dilek Dile",
  greenhouse: ENGLISH_TERMS["greenhouse"],
  growing: ENGLISH_TERMS["growing"],
  guide: "Rehber",
  honey: "Bal",
  "hungry?": "Aç mısın?",
  info: "Bilgi",
  item: "Öğe",
  land: "Ada",
  "last.updated": "Son güncelleme:",
  "lets.go": "Hadi Gidelim!",
  limit: "Sınır",
  "linked.wallet": "Bağlantılı Cüzdan",
  list: "Liste",
  "list.trade": "Takası Listele",
  loading: "Yükleniyor",
  locked: "Kilitli",
  "loser.refund": "Kaynakları iade et",
  lvl: "Seviye",
  maintenance: "Bakım",
  "make.wish": "Bir Dilek Tut",
  "making.wish": "Dilek Tutuluyor",
  max: "Maksimum",
  minimum: "Minimum",
  mint: "Mint",
  minting: "Minting",
  music: "Müzik",
  next: "Sonraki",
  "next.order": "Sıradaki sipariş",
  nextSkillPtLvl: "Sonraki yetenek puanı: seviye",
  no: "Hayır",
  "no.delivery.avl": "Teslimat mevcut değil",
  "no.limits.exceeded": "Hiçbir sınır aşılmadı",
  "no.mail": "Mail yok",
  "no.obsessions": "Takıntı yok",
  "no.thanks": "Hayır teşekkürler",
  "ocean.fishing": "Okyanus balıkçılığı",
  off: "Kapalı",
  "offer.end": "Teklif şu tarihte sona eriyor",
  ok: "TAMAM",
  on: "Açık",
  open: "Açık",
  "open.gift": "Hediyeyi Aç",
  optional: ENGLISH_TERMS["optional"],
  place: "Yerleştir",
  "place.map": "Haritaya yerleştir",
  "place.bid": "Teklifinizi verin",
  "placing.bid": "Teklif veriliyor",
  plant: "Bitki",
  "play.again": "Tekrar oyna",
  "please.try.again": "Daha sonra tekrar deneyin.",
  "pay.attention.feedback": "Geri bildirim simgelerine dikkat edin:",
  print: "Yazdır",
  purchased: "satın Alındı",
  purchasing: "Satın Alınılıyor",
  rank: "Sıralama",
  "read.more": "Daha fazla oku",
  refresh: "Yenile",
  refreshing: "Yenileniliyor",
  remaining: "geriye kalan",
  "remaining.free.listings": ENGLISH_TERMS["remaining.free.listings"],
  "remaining.free.purchases": ENGLISH_TERMS["remaining.free.purchases"],
  "remaining.free.listing": ENGLISH_TERMS["remaining.free.listing"],
  "remaining.free.purchase": ENGLISH_TERMS["remaining.free.purchase"],
  remove: "Kaldır",
  reqSkillPts: "Gerekli Yetenek Puanları",
  reqSkills: "Gerekli Yetenekler",
  required: "Gereken",
  requires: "Gerekli",
  resources: "Kaynaklar",
  restock: "Stok Yenileme",
  retry: "Tekrar Dene",
  reward: "Ödül",
  "reward.discovered": "Ödül Keşfedildi",
  save: "Kaydet",
  saving: "Kaydediliyor",
  seeds: "Tohumlar",
  selected: "Seçildi",
  "select.resource": "Kaynağınızı seçin: ",
  sell: "Sat",
  "sell.all": "Hepsini Sat",
  "sell.one": "1 Adet Sat",
  "sell.ten": "10 Adet Sat",
  "session.expired": "Oturum süresi doldu!",
  share: "Paylaş",
  skillPts: "Yetenek Puanları",
  skills: "Yetenekler",
  skipping: "Atlanılıyor",
  "skip.order": "Siparişi Atla",
  "sound.effects": "Ses Efektleri",
  start: "Başlat",
  submit: "Gönder",
  submitting: "Gönderiliyor",
  success: "Başarılı!",
  swapping: "Değiştiriliyor",
  syncing: "Senkronizasyon",
  task: "Görev",
  test: "Deneme",
  "thank.you": "Teşekkür ederim!",
  tools: "Aletler",
  total: "Toplam",
  trades: "Takaslar",
  trading: "Takas",
  transfer: "Aktar",
  "try.again": "Tekrar Deneyin",
  uhOh: "Vay Canına!",
  "unlock.land": "Daha fazla arazi açın",
  unlocking: "Açılıyor",
  unmute: "Sesi Aç",
  "use.craft": "Eşya yapımında kullanılır",
  verify: "Doğrula",
  version: "Versiyon",
  viewAll: "Hepsini Görüntüle",
  visit: "Ziyaret Et",
  warning: "Uyarı",
  welcome: "Hoş Geldin!",
  "wishing.well": "Dilek Kuyusu",
  withdraw: "Çekme",
  wish: "Dilek",
  yes: "Evet",
  "yes.please": "Evet Lütfen",
  opensea: "Opensea",
  layouts: "Yerleşimler",
  labels: "Etiketler",
  buff: "Güçlendirme",
  speed: "Hız",
  treasure: "Hazine",
  special: "Özel",
  default: "Varsayılan",
  formula: "Formül",
  chill: "Sakin Ol",
  full: "Dolu",
  collectibles: "Toplanabilirler",
  buds: "Tomurcuklar",
  wearables: "Giyinebilirler",
  skip: "Atla",
  docs: "Dokümanlar",
  exit: "Çıkış",
  compost: "Gübre",
  chicken: "Tavuk",
  recipes: "Tarifler",
  unlocked: "Açıldı",
  reel: "Makaraya Sar",
  "new.species": "Yeni Türler",
  buildings: "Binalar",
  boosts: "Takviyeler",
  decorations: "Dekorasyonlar",
  "copy.link": "Bağlantıyı kopyala",
  "copy.failed": "Kopyalama Başarısız!",
  searching: "Aranıyor",
  "sfl/coins": ENGLISH_TERMS["sfl/coins"],
  player: ENGLISH_TERMS["player"],
  vipAccess: ENGLISH_TERMS["vipAccess"],
  requirements: ENGLISH_TERMS.requirements,
  "max.reached": ENGLISH_TERMS["max.reached"],
  bought: ENGLISH_TERMS.bought,
  "time.remaining": ENGLISH_TERMS["time.remaining"],
  expired: ENGLISH_TERMS.expired,
};

const timeUnits: Record<TimeUnits, string> = {
  // Full Singular
  "time.second.full": "saniye",
  "time.minute.full": "dakika",
  "time.hour.full": "saat",
  "time.day.full": "gün",

  // Full Plural
  "time.seconds.full": "saniye",
  "time.minutes.full": "dakika",
  "time.hours.full": "saat",
  "time.days.full": "gün",

  // Medium Singular
  "time.sec.med": "sn",
  "time.min.med": "dk",
  "time.hr.med": "sa",
  "time.day.med": "gnn",

  // Medium Plural
  "time.secs.med": "sn",
  "time.mins.med": "dk",
  "time.hrs.med": "sa",
  "time.days.med": "gn",

  // Short
  "time.second.short": "sn",
  "time.minute.short": "d",
  "time.hour.short": "sa",
  "time.day.short": "g",

  // Relative Time
  // Example: 5(time) minutes (singular or plural form) ago
  "time.seconds.ago": "{{time}} saniye önce",
  "time.minutes.ago": "{{time}} dakika önce ",
  "time.hours.ago": "{{time}} saat önce ",
  "time.days.ago": "{{time}} gün önce",
};

const achievementTerms: Record<AchievementsTerms, string> = {
  "breadWinner.description": " 0.001 SFL Kazan",
  "breadWinner.one":
    "Vay, vay, vay, ortak… Görünüşe göre biraz SFL’ye ihtiyacın var!",
  "breadWinner.two":
    "Sunflower Land'de dolu bir SFL zulası, aletler, binalar ve nadir NFT'ler üretmenin anahtarıdır",
  "breadWinner.three":
    "SFL kazanmanın en hızlı yolu mahsul ekimi ve satışıdır.",

  "sunSeeker.description": " 100 defa Ayçiçeği Hasat Et",
  "cabbageKing.description": "200 defa Lahana Hasat Et",
  "jackOLantern.description": "500 defa Balkabağı Hasat Et",
  "coolFlower.description": "100 defa Karnabahar Hasat Et",
  "farmHand.description": "Mahsulleri 10.000 defa Hasat Et",
  "beetrootBeast.description": "2.000 defa Pancar Hasat Et",
  "myLifeIsPotato.description": "5.000 defa Patates Hasat Et",
  "rapidRadish.description": "200 defa Turp Hasat Et",
  "twentyTwentyVision.description": "10.000 defa Havuç Hasat Et",
  "stapleCrop.description": "10.000 defa Buğday Hasat Et",
  "sunflowerSuperstar.description": "100.000 defa Ayçiçeği Hasat Et",
  "bumpkinBillionaire.description": "5.000 SFL Kazan",
  "patientParsnips.description": "5.000 defa Yaban Havucu Hasat Et",
  "cropChampion.description": "1 milyon Mahsul Hasat Et",

  "busyBumpkin.description": "2. Seviyeye ulaşın",
  "busyBumpkin.one":
    "Merhaba, azimli arkadaşım! Yeni mahsullerin, genişletmelerin, binaların ve çok daha fazlasının kilidini açmak için seviye atlamanız gerekecek.",
  "busyBumpkin.two":
    "Fire Pit’e gidin, lezzetli bir tarif hazırlayın ve onu Bumpkininize yedirin.",

  "kissTheCook.description": "20 Yemek pişir",
  "bakersDozen.description": "13 Pasta pişirin",
  "brilliantBumpkin.description": "20. Seviyeye ulaşın",
  "chefDeCuisine.description": "5.000 Yemek pişirin",

  "scarecrowMaestro.description":
    "Bir korkuluk üretin ve mahsullerinizi takviyeleyin",
  "scarecrowMaestro.one":
    "Merhaba ortak! Üretim sanatını öğrenmenin ve çiftçilik yeteneklerinizi geliştirmenin zamanı geldi",
  "scarecrowMaestro.two":
    "Balkabağı Plazasına gidin, Blacksmith’i ziyaret edin ve bir korkuluk üretin.",

  "bigSpender.description": "10 SFL Harca",
  "museum.description": "Arazinize 10 farklı türde nadir eşya yerleştirin",
  "highRoller.description": "7.500 SFL Harca",
  "timbeerrr.description": "150 Ağaç kes",
  "craftmanship.description": "100 Alet üret",
  "driller.description": "50 Taş madeni kır",
  "ironEyes.description": "50 Demir madeni kır",
  "elDorado.description": "50 Altın madeni kır",
  "timeToChop.description": "500 Balta üret",
  "canary.description": "1.000 Taş madeni kır",
  "somethingShiny.description": "500 Demir madeni kır",
  "bumpkinChainsawAmateur.description": "5.000 Ağaç kes",
  "goldFever.description": "500 Altın madeni kır",

  // Explorer
  "explorer.one":
    "Bu ağaçları keserek biraz odun toplayalım ve adayı genişletelim. Devam edin ve bunu yapmanın en iyi yolunu bulun.",
  "expansion.description": "Arazinizi yeni ufuklara genişletin.",

  // Well of Prosperity
  "wellOfProsperity.description": "Bir kuyu inşa et",
  "wellOfProsperity.one": "Vay, vay, vay, burada neler varmış?",
  "wellOfProsperity.two":
    "Mahsulleriniz susuz kalmış gibi görünüyor. Daha fazla mahsul ekmek için önce bir kuyu inşa etmelisiniz.",

  "contractor.description": "Arazinize 10 bina inşa edin",
  "fruitAficionado.description": "50 Meyve Hasat Et",
  "fruitAficionado.one":
    "Merhaba meyve toplayıcı! Meyveler doğanın en tatlı hediyeleridir ve çiftliğinize lezzet katarlar.",
  "fruitAficionado.two":
    "Elma, portakal ve yaban mersini gibi farklı meyveler toplayarak benzersiz tariflerin kilidini açacak, yemek pişirme becerilerinizi geliştirecek ve lezzetli ikramlar hazırlayacaksınız",

  "orangeSqueeze.description": "100 defa Portakal Hasat Et",
  "appleOfMyEye.description": "500 defa Elma Hasat Et",
  "blueChip.description": "5.000 defa Yaban Mersini Hasat Et",
  "fruitPlatter.description": "50.000 defa Hasat Et",
  "crowdFavourite.description": "100 Teslimatı tamamla",

  "deliveryDynamo.description": "3 Teslimatı Tamamla",
  "deliveryDynamo.one":
    "Merhaba, güvenilir çiftçi! Bumpkinler teslimat konusunda her türlü yardımına ihtiyaç duyarlar.",
  "deliveryDynamo.two":
    "Teslimatları tamamlamak onları mutlu edecek ve karşılığında harika SFL ödülleri kazanacaksınız",

  "seasonedFarmer.description": "50 Sezon Kaynağı Topla",
  "seasonedFarmer.one":
    "Merhaba, sezon maceracısı! Sunflower Land benzersiz öğeler ve sürprizlerle dolu özel sezonlarıyla tanınır.",
  "seasonedFarmer.two":
    "Sezonluk kaynakları toplayarak sınırlı süreli ödüllere, özel ürünlere ve nadir hazinelere erişim kazanacaksınız. Her sezonun harikalarına ön sıradan bilet almak gibi.",
  "seasonedFarmer.three":
    "Öyleyse görevleri tamamlayın, etkinliklere katılın ve Sunflower Land’in sunduğu en iyi şeylerin tadını çıkarmak için Sezonluk Biletleri toplayın!",
  "treasureHunter.description": "10 Delik kaz",
  "treasureHunter.one":
    "Hey, hazine avcısı! Sunflower Land keşfedilmeyi bekleyen gizli hazinelerle doludur.",
  "treasureHunter.two":
    "Küreğinizi kapın ve değerli eşyalar ve nadir sürprizler bulabileceğiniz Hazine Adası’na gidin.",
  "eggcellentCollection.description": "10 Yumurta Topla",
  "eggcellentCollection.one":
    "Merhaba, yumurta toplayıcı! Tavuklar bize lezzetli yumurtalar sağlayan harika çiftlik arkadaşlarıdır.",
  "eggcellentCollection.two":
    "Yumurta toplayarak yemek pişirmek için taze malzemelere sahip olacak ve ayrıca özel tariflerin ve bonusların kilidini açacaksınız.",
};

const addSFL: Record<AddSFL, string> = {
  "addSFL.swapDetails":
    "Sunflower Land, Quickswap aracılığıyla Matic’i SFL ile değiştirmenin hızlı bir yolunu sunar.",
  "addSFL.referralFee":
    "Sunflower Land bu işlemi tamamlamak için %5 komisyon ücreti alır.",
  "addSFL.swapTitle": "Değiştirme Detayları",
  "addSFL.minimumReceived": "Minimum Alınan: ",
};

const auction: Record<Auction, string> = {
  "auction.title": "Açık Arttırma & Eşyalar",
  "auction.bid.message": "Teklifinizi verdiniz.",
  "auction.reveal": "Kazananları görüntüle",
  "auction.live": "Açık artırma şu an aktif!",
  "auction.requirement": "Gereksinimler",
  "auction.start": "Başlangıç Zamanı",
  "auction.period": "Açık Artırma Zaman Aralığı",
  "auction.closed": "Açık Artırma kapandı",
  "auction.const": "Yapım halinde!",
  "auction.const.soon": "Bu özellik yakında geliyor.",
};

const availableSeeds: Record<AvailableSeeds, string> = {
  "availableSeeds.select": "Tohum seçilmedi",
  "availableSeeds.select.plant": "Hangi tohumu seçip dikmek istersiniz?",
  "quickSelect.empty": ENGLISH_TERMS["quickSelect.empty"],
  "quickSelect.label": ENGLISH_TERMS["quickSelect.label"],
  "quickSelect.cropSeeds": ENGLISH_TERMS["quickSelect.cropSeeds"],
  "quickSelect.greenhouseSeeds": ENGLISH_TERMS["quickSelect.greenhouseSeeds"],
  "quickSelect.purchase": ENGLISH_TERMS["quickSelect.purchase"],
};

const base: Record<Base, string> = {
  "base.far.away": "Çok uzaktasın",
  "base.iam.far.away": "Çok uzaktasın",
};

const basicTreasure: Record<BasicTreasure, string> = {
  "giftGiver.description": ENGLISH_TERMS["giftGiver.description"],
  "giftGiver.label": ENGLISH_TERMS["giftGiver.label"],
  "basic.treasure.missingKey": "Anahtar Eksik",
  "basic.treasure.needKey":
    "Bu sandığı açmak için bir Hazine Anahtarına ihtiyacınız var",
  "basic.treasure.getKey":
    "Bumpkinler için görevleri tamamlayarak Hazine Anahtarları alabilirsiniz",
  "basic.treasure.congratsKey": "Tebrikler, bir Hazine Anahtarınız var!",
  "basic.treasure.openChest":
    "Sandığı açıp bir ödül talep etmek ister misiniz?",
  "rare.treasure.needKey":
    "Bu sandığı açmak için bir Ender Anahtara ihtiyacınız var",
  "luxury.treasure.needKey":
    "Bu sandığı açmak için bir Lüks Anahtara ihtiyacınız var",
  "budBox.open": "Aç",
  "budBox.opened": "Açıldı",
  "budBox.title": "Tomurcuk kutusu",
  "budBox.description":
    "Her gün bir tomurcuk türü çiftçilik ödüllerinin kilidini açabilir.",
  "raffle.title": "Goblin Çekilişi",
  "raffle.description":
    "Her ay ödül kazanma şansınız var. Kazananlar Discord'da duyurulacaktır.",
  "raffle.entries": "girişler",
  "raffle.noTicket": "Eksik Ödül Bileti",
  "raffle.how":
    "Özel etkinlikler ve Bumpkin teslimatları aracılığıyla Ödül Biletlerini ücretsiz olarak toplayabilirsiniz.",
  "raffle.enter": "Giriş",
};

const beehive: Record<Beehive, string> = {
  "beehive.harvestHoney": "Bal topla",
  "beehive.noFlowersGrowing": "Hiçbir çiçek büyümüyor",
  "beehive.beeSwarm": "Arı sürüsü",
  "beehive.pollinationCelebration":
    "Tozlaşma kutlaması! Mahsulleriniz, dost canlısı bir arı sürüsü sayesinde 0,2'lik bir destekle ödüllendirilecek!",
  "beehive.honeyProductionPaused":
    ENGLISH_TERMS["beehive.honeyProductionPaused"],
  "beehive.yield": ENGLISH_TERMS["beehive.yield"],
  "beehive.honeyPerFullHive": ENGLISH_TERMS["beehive.honeyPerFullHive"],
  "beehive.speed": ENGLISH_TERMS["beehive.speed"],
  "beehive.fullHivePerDay": ENGLISH_TERMS["beehive.fullHivePerDay"],
  "beehive.estimatedFull": ENGLISH_TERMS["beehive.estimatedFull"],
  "beehive.hive.singular": ENGLISH_TERMS["beehive.hive.singular"],
  "beehive.hives.plural": ENGLISH_TERMS["beehive.hives.plural"],
};

const birdiePlaza: Record<BirdiePlaza, string> = {
  "birdieplaza.birdieIntro":
    "Merhaba ben Birdie, çevredeki en güzel Bumpkin’im!",
  "birdieplaza.admiringOutfit":
    "Kıyafetime hayran olduğunu fark ettim. Harika değil mi?!?",
  "birdieplaza.currentSeason": ENGLISH_TERMS["birdieplaza.currentSeason"],
  "birdieplaza.collectTickets": ENGLISH_TERMS["birdieplaza.collectTickets"],
  "birdieplaza.whatIsSeason": "Sezon nedir?",
  "birdieplaza.howToEarnTickets": ENGLISH_TERMS["birdieplaza.howToEarnTickets"],
  "birdieplaza.earnTicketsVariety":
    ENGLISH_TERMS["birdieplaza.earnTicketsVariety"],
  "birdieplaza.commonMethod": ENGLISH_TERMS["birdieplaza.commonMethod"],
  "birdieplaza.choresAndRewards": ENGLISH_TERMS["birdieplaza.choresAndRewards"],
  "birdieplaza.gatherAndCraft": ENGLISH_TERMS["birdieplaza.gatherAndCraft"],
  "birdieplaza.newSeasonIntro":
    "Sunflower Land’de her 3 ayda bir yeni sezon tanıtılıyor.",
  "birdieplaza.seasonQuests":
    "Bu sezon heyecan verici görevler ve kazanabileceğiniz nadir koleksiyon öğeleri içeriyor.",
  "birdieplaza.craftItems": ENGLISH_TERMS["birdieplaza.craftItems"],
};

const boostDescriptions: Record<BoostDescriptions, string> = {
  // Mutant Chickens
  "description.speed.chicken.one":
    "Artık tavukların 10% daha hızlı yumurta üretecek.",
  "description.speed.chicken.two": "Yumurtaları 10% daha hızlı üretir",
  "description.fat.chicken.one":
    "Tavukların artık yem başına 10% daha az buğdaya gerek duyacak.",
  "description.fat.chicken.two":
    "Bir tavuğu beslemek için 10% daha az buğday gerekiyor.",
  "description.rich.chicken.one":
    "Tavukların artık 10% daha fazla yumurta verecek.",
  "description.rich.chicken.two": "10% daha fazla yumurta verimi",
  "description.ayam.cemani": "Var olan en nadir tavuk!",
  "description.el.pollo.veloz.one":
    "Tavukların 4 saat daha hızlı yumurtlayacak!",
  "description.el.pollo.veloz.two":
    "Şu yumurtaları bana ver,çabuk! Yumurtlamada 4 saatlik hız artışı.",
  "description.banana.chicken":
    "Muzları artıran bir tavuk. Nasıl bir dünyada yaşıyoruz.",
  "description.knight.chicken": ENGLISH_TERMS["description.knight.chicken"],

  // Boosts
  "description.lab.grow.pumpkin": "+0.3 Kabak Verimi",
  "description.lab.grown.radish": "+0.4 Turp Verimi",
  "description.lab.grown.carrot": "+0.2 Havuç Verimi",
  "description.purple.trail":
    "Büyüleyici ve eşsiz Purple Trail ile rakiplerini kıskançlık içinde bırak.",
  "description.obie": "Azılı bir patlıcan askeri",
  "description.maximus": "Tombul Maximus ile rekabeti ezip geç!",
  "description.mushroom.house":
    "Duvarların cazibesiyle filizlendiği ve eşyaların bile mantarşem bir zarafete sahip olduğu tuhaf mantar meskeni!",
  "description.Karkinos":
    "Çimdik sever ama kibar, çiftliğine lahana artırıcı bir yengeç!",
  "description.heart.of.davy.jones":
    "Ona sahip olan, yedi deniz üzerinde muazzam bir güce sahip olur, yorulmadan hazine kazabilir.",
  "description.tin.turtle":
    "Küçük Kaplumbağa etki alanı içinde kazdığın taşlara +0.1 verir.",
  "description.emerald.turtle":
    "Zümrüt Kaplumbağa etki alanı içinde kazdığın tüm minerallere +0.5 verir.",
  "description.iron.idol": "Idol, demir kazdığında +1 demir ekler.",
  "description.crim.peckster":
    "Kızıltaşları gün yüzüne çıkarma yeteneğine sahip bir mücevher dedektifi.",
  "description.skill.shrimpy":
    "Shrimpy yardım etmek için burada! Balıklardan ekstra XP elde etmeni sağlayacaktır.",
  "description.soil.krabby":
    "Bir gülümseme ile hızlan! Bu kabuklu şampiyon ile 10% gübre üretme hızı artışının tadını çıkar.",
  "description.nana":
    "Bu nadir güzellik, muz hasadını artırmanın kesin bir yoludur.",
  "description.grain.grinder":
    "Tahılını öğüt ve pasta XP’sinde nefis bir artışın tadını çıkar.",
  "description.kernaldo": "Büyülü mısır fısıldayan.",
  "description.kernaldo.1":
    "Büyülü mısır fısıldayan. Mısırlar için 25% büyüme hızı.",
  "description.poppy": "Mistik mısır çekirdeği.",
  "description.poppy.1":
    "Mistik mısır çekirdeği.Mısır hasatında hasat başı +0.1 ekler,",
  "description.victoria.sisters": "Balkabağı seven kız kardeşler",
  "description.undead.rooster":
    "Savaşın talihsiz bir kaybı. Yumurta veriminde 10% artış.",
  "description.observatory": "Yıldızları keşfedin ve bilimsel gelişimi artırın",
  "description.engine.core": "Ayçiçeğinin gücü",
  "description.time.warp.totem":
    "Mahsuller,ağaçlar,yemek pişirme ve mineraller için 2 kat hız. Sadece 2 saat geçerli",
  "description.time.warp.totem.expired":
    "Zaman bükme toteminin süresi doldu. Çiftçilik yeteneklerini geliştirecek daha fazla sihirli eşya keşfetmek ve üretmek için Balkabağı Plazasına git!",
  "description.time.warp.totem.temporarily":
    "Zaman bükme totemi yemek pişirme, mahsul, ağaç ve maden süresini geçici olarak artırır. Bundan en iyi şekilde yararlan!",
  "description.cabbage.boy": "Bebeği uyandırma!",
  "description.cabbage.girl": "Şşş.. Uyuyor",
  "description.wood.nymph.wendy":
    "Orman perilerini baştan çıkarmak için bir büyü yap.",
  "description.peeled.potato":
    "Değerli bir patates, hasat sırasında bonus patatesleri teşvik eder.",
  "description.potent.potato": "Etkili! Hasatta 3% şans ile +10 patates verir.",
  "description.radical.radish": "Radikal! Hasatta 3% şans ile +10 turp verir.",
  "description.stellar.sunflower":
    "Yıldız! Hasatta 3% şans ile +10 ayçiçeği verir.",
  "description.lady.bug":
    "Yaprak bitleriyle beslenen inanılmaz bir böcek. Elma kalitesini artırır.",
  "description.squirrel.monkey":
    "Doğal turuncu bir yırtıcı hayvan. Portakal ağaçları Squirrel Monkey etraftayken korkar.",
  "description.black.bearry":
    "En sevdiği ikram; dolgun,sulu yaban mersini. Onları avuç avuç yutar!",
  "description.maneki.neko": "Şanslı kedi. Kolunu çek ve güzel şanslar gelecek",
  "description.easter.bunny": "Nadir bir paskalya öğesi",
  "description.pablo.bunny": "Büyülü bir paskalya tavşanı",
  "description.foliant": "Bir büyü kitabı.",
  "description.tiki.totem": "Tiki Totem kestiğiniz her ağaca 0.1 odun ekler.",
  "description.lunar.calendar":
    "Mahsuller artık ay döngüsünü takip ediyor! Mahsullerin büyüme hızında 10% artış.",
  "description.heart.davy.jones":
    "Ona sahip olan kişi yedi deniz üzerinde muazzam bir güce sahip olur,yorulmadan hazine kazabilir.",
  "description.treasure.map":
    "Sahibini değerli bir hazineye götüren gizemli bir harita. Plaj ödül eşyalarından +20% kar.",
  "description.genie.lamp":
    "İçinde sana 3 dilek hakkı verecek bir cin içeren sihirli bir lamba.",
  "description.basic.scarecrow": ENGLISH_TERMS["description.basic.scarecrow"],
  "description.scary.mike": ENGLISH_TERMS["description.scary.mike"],
  "description.laurie.chuckle.crow":
    ENGLISH_TERMS["description.laurie.chuckle.crow"],
  "description.immortal.pear": ENGLISH_TERMS["description.immortal.pear"],
  "description.bale":
    "Tavuklar için konforlu bir sığınak sağlayan,kümes hayvanlarının en sevdiği komşusu.",
  "description.sir.goldensnout":
    "Kraliyet üyesi Sir Goldensnout,altın gübresi ile çiftliğine refah sağlıyor.",
  "description.freya.fox":
    "Etkileyici koruyucu,mistik çekiciliği ile balkabağının büyümesini artırır. Onun dikkatli bakışları altında bol miktarda balkabağı hasat edin.",
  "description.queen.cornelia":
    "Queen Cornelia’nın muhteşem gücünü kontrol edin ve mısır üretiminde müthiş bir etki alanı artışını deneyimleyin.+1 mısır.",
};

const boostEffectDescriptions: Record<BoostEffectDescriptions, string> = {
  "description.obie.boost": "-25% Patlıcan Büyüme Süresi",
  "description.purple.trail.boost": "+0.2 Patlıcan",
  "description.freya.fox.boost": "+0.5 Balkabağı",
  "description.sir.goldensnout.boost": "+0.5 Mahsul (Etki Alanı 4x4)",
  "description.maximus.boost": "+1 Patlıcan",
  "description.basic.scarecrow.boost":
    "-20% Temel Mahsullerin Büyüme süresi: Ayçiçeği, Patates ve Kabak (Etki Alanı 3x3)",
  "description.scary.mike.boost":
    "+0.2 Orta Mahsul: Havuç, Lahana, Soya, Pancar, Karnabahar ve Yaban havucu (Etki Alanı 3x3)",
  "description.laurie.chuckle.crow.boost":
    "+0.2 Gelişmiş Mahsul: Patlıcan, Mısır, Turp, Buğday, Kıvırcık lahana (Etki Alanı 3x3)",
  "description.bale.boost": "+0.2 Yumurta (Etki Alanı 4x4)",
  "description.immortal.pear.boost":
    ENGLISH_TERMS["description.immortal.pear.boost"],
  "description.treasure.map.boost": "Hazine Ödülü satışlarında +20% Coins",
  "description.poppy.boost": "+0.1 Mısır",
  "description.kernaldo.boost": "Mısır Büyüme Süresi -25%",
  "description.grain.grinder.boost": "+20% Pasta XP’si",
  "description.nana.boost": "Muz büyüme süresi -10%",
  "description.soil.krabby.boost": "Kompostlayıcı Kompost Süresi -10%",
  "description.skill.shrimpy.boost": "+20% Balık XP’si",
  "description.iron.idol.boost": "+1 Demir",
  "description.emerald.turtle.boost": "+0.5 Taş, Demir, Altın (Etki Alanı 3x3)",
  "description.tin.turtle.boost": "+0.1 Taş (Etki Alanı 3x3)",
  "description.heart.of.davy.jones.boost": "+20 Günlük Kazma Limiti",
  "description.Karkinos.boost": "+0.1 Lahana (Lahana Çocuk ile aktif değil)",
  "description.mushroom.house.boost": "+0.2 Yabani Mantar",
  "description.boost.gilded.swordfish": "+0.1 Altın",
  "description.nancy.boost": "Mahsullerin Büyüme Süresi -15%",
  "description.scarecrow.boost":
    "-15% Mahsullerin Büyüme Süresi ; +20% Mahsul Verimi",
  "description.kuebiko.boost":
    "-15% Mahsullerin Büyüme Süresi; +20% Mahsul Verimi; Ücretsiz Tohum",
  "description.gnome.boost":
    "Orta ve Gelişmiş mahsullerde +10 verim (Etki Alanı; altındaki kare)",
  "description.lunar.calendar.boost": "-10% Mahsul Büyüme Hızı",
  "description.peeled.potato.boost": "+1 Patates için 20% Şans",
  "description.victoria.sisters.boost": "+20% Balkabağı",
  "description.easter.bunny.boost": "+20% Havuç",
  "description.pablo.bunny.boost": "+0.1 Havuç",
  "description.cabbage.boy.boost": "+0.25 Lahana (Lahana Kızı ile +0.5)",
  "description.cabbage.girl.boost": "-50% Lahana Büyüme Süresi",
  "description.golden.cauliflower.boost": "+100% Karnabahar",
  "description.mysterious.parsnip.boost": "-50% Yaban Havucu Büyüme Süresi",
  "description.queen.cornelia.boost": "+1 Mısır (Etki Alanı 3x4)",
  "description.foliant.boost": "+0.2 Kıvırcık Lahana",
  "description.hoot.boost": "+0.5 Buğday, Turp, Kıvırcık Lahana, Pirinç",
  "description.hungry.caterpillar.boost": "Ücretsiz Çiçek Tohumları",
  "description.black.bearry.boost": "+1 Yaban Mersini",
  "description.squirrel.monkey.boost": "-50% Portakal Büyüme Süresi",
  "description.lady.bug.boost": "+0.25 Elma",
  "description.banana.chicken.boost": "+0.1 Muz",
  "description.carrot.sword.boost": "4x Mutant Mahsul Şansı",
  "description.stellar.sunflower.boost": "3% Şans ile +10 Ayçiçeği",
  "description.potent.potato.boost": "3% Şans ile +10 Patates",
  "description.radical.radish.boost": "3% Şans ile +10 Turp",
  "description.lg.pumpkin.boost": "+0.3 Balkabağı",
  "description.lg.carrot.boost": "+0.2 Havuç",
  "description.lg.radish.boost": "+0.4 Turp",
  "description.fat.chicken.boost": "Tavukları Beslemek için -0.1 Buğday",
  "description.rich.chicken.boost": "+0.1 Yumurta",
  "description.speed.chicken.boost": "-10% Yumurtlama Süresi",
  "description.ayam.cemani.boost": "+0.2 Yumurta",
  "description.el.pollo.veloz.boost": "-4 saat Yumurtlama Süresi",
  "description.rooster.boost": "2x Mutant Tavuk Şansı",
  "description.undead.rooster.boost": "+0.1 Yumurta",
  "description.chicken.coop.boost":
    "+1 Yumurta Verimi; Her Tavuk Bümesi başına +5 Tavuk Limiti",
  "description.gold.egg.boost": "Tavukları Buğdaysız Besle",
  "description.woody.beaver.boost": "+20% Odun",
  "description.apprentice.beaver.boost":
    "+20% Odun; -50% Ağaç Yenilenme Süresi",
  "description.foreman.beaver.boost":
    "+20% Odun; -50% Ağaç Yenilenme Süresi; Ağaçları Baltasız Kes",
  "description.wood.nymph.wendy.boost": "+0.2 Odun",
  "description.tiki.totem.boost": "+0.1 Odun",
  "description.tunnel.mole.boost": "+0.25 Taş",
  "description.rocky.mole.boost": "+0.25 Demir",
  "description.nugget.boost": "+0.25 Altın",
  "description.rock.golem.boost": "10% Şans ile +2 Taş",
  "description.crimson.carp.boost": "+0.05 Kızıltaş",
  "description.battle.fish.boost":
    ENGLISH_TERMS["description.battle.fish.boost"],
  "description.crim.peckster.boost": "+0.1 Kızıltaş",
  "description.knight.chicken.boost":
    ENGLISH_TERMS["description.knight.chicken.boost"],
  "description.queen.bee.boost": "+1 Bal Üretim Hızı",
  "description.humming.bird.boost": "20% Şans ile +1 Çiçek",
  "description.beehive.boost":
    "Arı kovanı dolduğunda +0.2 Mahsul için 10% Şans",
  "description.walrus.boost": "+1 Balık",
  "description.alba.boost": "50% Şans ile +1 Temel Balık",
  "description.knowledge.crab.boost": "2x Sprout Mix Etkisi",
  "description.maneki.neko.boost": "Günde 1 defa Bedava Yemek",
  "description.genie.lamp.boost": "3 Dilek Gerçekleştirir",
  "description.observatory.boost": "+5% XP",
  "description.blossombeard.boost": "+10% XP",
  "description.desertgnome.boost":
    ENGLISH_TERMS["description.desertgnome.boost"],
  "description.christmas.festive.tree.boost": "Noelde Ücretsiz Hediye",
  "description.grinxs.hammer.boost": "Genişleme maliyetlerini yarıya indirir",
  "description.time.warp.totem.boost":
    "Mahsul, Pişirme, Mineral ve Ağaç Yenilenme Sürelerinde 50% azalma",
  "description.radiant.ray.boost": "+0.1 Demir",
  "description.beekeeper.hat.boost": "+0.2 Bal Üretim Hızı",
  "description.babyPanda.boost": "Başlangıç 2x XP Takviyesi",
  "description.flower.fox.boost": "-10% Çiçek Büyüme Hızı",
  "description.hungryHare.boost": ENGLISH_TERMS["description.hungryHare.boost"],
  "description.grape.granny.boost":
    ENGLISH_TERMS["description.grape.granny.boost"],
  "description.soybliss.boost": ENGLISH_TERMS["description.soybliss.boost"],
  "description.turbo.sprout.boost":
    ENGLISH_TERMS["description.turbo.sprout.boost"],
  "description.non.la.hat.boost": ENGLISH_TERMS["description.non.la.hat.boost"],
  "description.oil.can.boost": ENGLISH_TERMS["description.oil.can.boost"],
  "description.olive.shield.boost":
    ENGLISH_TERMS["description.olive.shield.boost"],
  "description.pan.boost": ENGLISH_TERMS["description.pan.boost"],
  "description.paw.shield.boost": ENGLISH_TERMS["description.paw.shield.boost"],
  "description.vinny.boost": ENGLISH_TERMS["description.vinny.boost"],
  "description.rice.panda.boost": ENGLISH_TERMS["description.rice.panda.boost"],
  "description.olive.shirt.boost":
    ENGLISH_TERMS["description.olive.shirt.boost"],
  "description.tofu.mask.boost": ENGLISH_TERMS["description.tofu.mask.boost"],

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
  "description.clam.shell": "Bir İstiridye kabuğu.",
  "description.sea.cucumber": "Bir Deniz hıyarı.",
  "description.coral": "Bir parça mercan, çok tatlı.",
  "description.crab": "Bir yengeç, kıskaçlarına dikkat et!!",
  "description.starfish": "Denizin yıldızı.",
  "description.pirate.bounty": "Korsan için bir ganimet. Çok para ediyor.",
  "description.wooden.compass":
    "Yüksek teknoloji olmayabilir ama seni her zaman doğru istikamete yönlendirecek, buna inanabiliyo musun?",
  "description.iron.compass":
    "Yolunu hazineye doğru çiz! Bu pusula çok ‘çekici’, ve sadece manyetik kuzey kutbuna değil!",
  "description.emerald.compass":
    "Yolunuzu hayatın bereketli gizemlerine çevirin! Bu pusula sadece kuzeyi göstermiyor, aynı zamanda zenginliği ve ihtişamı işaret ediyor!",
  "description.old.bottle":
    "Antik korsan şişesi, açık deniz maceralarının hikayelerini yankılıyor.",
  "description.pearl": "Güneşte parlıyor.",
  "description.pipi": "Plebidonax deltoides, Pasifik okyanusunda bulundu.",
  "description.seaweed": "Deniz yosunu.",
};

const buildingDescriptions: Record<BuildingDescriptions, string> = {
  // Buildings
  "description.water.well": "Mahsullerin suya ihtiyacı var!",
  "description.kitchen": "Aşçılığınızı geliştirin",
  "description.compost.bin": "Düzenli olarak yem ve gübre üretir.",
  "description.hen.house": "Tavuk imparatorluğunuzu kurun",
  "description.bakery": "Favori pastalarınızı pişirin",
  "description.greenhouse": ENGLISH_TERMS["description.greenhouse"],
  "description.turbo.composter": "Düzenli olarak gelişmiş yem ve gübre üretir.",
  "description.deli": "Mezelerle iştahınızı tatmin edin!",
  "description.smoothie.shack": "Taze sıkılmış!",
  "description.warehouse": "Tohum stoğunuzu %20 arttırın",
  "description.toolshed": "Çalışma tezgahı aletlerinizi %50 arttırın",
  "description.premium.composter": "Düzenli olarak uzman yem ve gübre üretir.",
  "description.town.center": "En son haberler için şehir merkezinde toplanın.",
  "description.market": "Çiftçi pazarında alım ve satım yapın.",
  "description.fire.pit":
    "Ayçiçeği kavurun, Bumpkininizi besleyin ve seviye atlatın.",
  "description.workbench": "Kaynak toplamak için alet üretin",
  "description.tent": "(Artık üretilmiyor)",
  "description.house": "Kafanı dinleyebileceğin bir yer.",
  "description.crop.machine": ENGLISH_TERMS["description.crop.machine"],
  "building.oil.remaining": ENGLISH_TERMS["building.oil.remaining"],
  "cooking.building.oil.description":
    ENGLISH_TERMS["cooking.building.oil.description"],
  "cooking.building.oil.boost": ENGLISH_TERMS["cooking.building.oil.boost"],
  "cooking.building.runtime": ENGLISH_TERMS["cooking.building.runtime"],
};

const bumpkinDelivery: Record<BumpkinDelivery, string> = {
  "bumpkin.delivery.selectFlower": "Çiçek seç",
  "bumpkin.delivery.noFlowers":
    "Olamaz hayır, hediye edebilecek bir çiçeğin yok!",
  "bumpkin.delivery.thanks": "Vay Wizz teşekkürler Bumpkin!!!",
  "bumpkin.delivery.waiting":
    "Bunun için bekliyordum. Çok teşekkürler! Daha fazla teslimat için yakında tekrar gel.",
  "bumpkin.delivery.proveYourself":
    ENGLISH_TERMS["bumpkin.delivery.proveYourself"],
};

const bumpkinItemBuff: Record<BumpkinItemBuff, string> = {
  "bumpkinItemBuff.chef.apron.boost": "+20% Pasta Kârı",
  "bumpkinItemBuff.fruit.picker.apron.boost": "+0.1 Meyve",
  "bumpkinItemBuff.angel.wings.boost": "Anında Mahsüller",
  "bumpkinItemBuff.devil.wings.boost": "Anında Mahsüller",
  "bumpkinItemBuff.eggplant.onesie.boost": "+0.1 Patlıcan",
  "bumpkinItemBuff.golden.spatula.boost": "+10% XP",
  "bumpkinItemBuff.mushroom.hat.boost": "+0.1 Mantar",
  "bumpkinItemBuff.parsnip.boost": "+20% Yaban havucu",
  "bumpkinItemBuff.sunflower.amulet.boost": "+10% Ayçiçeği",
  "bumpkinItemBuff.carrot.amulet.boost": "-20% Havuç büyüme süresi",
  "bumpkinItemBuff.beetroot.amulet.boost": "+20% Pancar",
  "bumpkinItemBuff.green.amulet.boost": "10x Mahsül Şansı",
  "bumpkinItemBuff.Luna.s.hat.boost": "-50% Pişirme süresi",
  "bumpkinItemBuff.infernal.pitchfork.boost": "+3 Mahsül",
  "bumpkinItemBuff.cattlegrim.boost": "+0.25 Hayvan Üretimi",
  "bumpkinItemBuff.corn.onesie.boost": "+0.1 Mısır",
  "bumpkinItemBuff.sunflower.rod.boost": "10% +1 Balık Şansı",
  "bumpkinItemBuff.trident.boost": "20% +1 Balık Şansı",
  "bumpkinItemBuff.bucket.o.worms.boost": "+1 Balık Yemi",
  "bumpkinItemBuff.luminous.anglerfish.topper.boost": "+50% Balık XP",
  "bumpkinItemBuff.angler.waders.boost": "+10 Balık Limiti",
  "bumpkinItemBuff.ancient.rod.boost": "Olta Olmadan Balık Tut",
  "bumpkinItemBuff.banana.amulet.boost": "+0.5 Muz",
  "bumpkinItemBuff.banana.boost": "-20% Muz Büyüme Süresi",
  "bumpkinItemBuff.deep.sea.helm": "Marine Seviyesi 3x Şans",
  "bumpkinItemBuff.bee.suit": ENGLISH_TERMS["bumpkinItemBuff.bee.suit"],
  "bumpkinItemBuff.crimstone.hammer": "5. Gün +2 Crimstone",
  "bumpkinItemBuff.crimstone.amulet": "-20% Crimstone Bekleme Süresi",
  "bumpkinItemBuff.crimstone.armor": "+0.1 Crimstone",
  "bumpkinItemBuff.hornet.mask": "Arı Sürüsü için 2x Şans",
  "bumpkinItemBuff.honeycomb.shield":
    ENGLISH_TERMS["bumpkinItemBuff.honeycomb.shield"],
  "bumpkinItemBuff.flower.crown": "-50% Çiçek Büyüme süresi",
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

const bumpkinPartRequirements: Record<BumpkinPartRequirements, string> = {
  "equip.missingHair": "Saç Gerekli",
  "equip.missingBody": "Vücut gerekli",
  "equip.missingShoes": "Ayakkabı Gerekli",
  "equip.missingShirt": "Kıyafet Gerekli",
  "equip.missingPants": "Pantolon Gerekli",
  "equip.missingBackground": "Arkaplan Gerekli",
};

const bumpkinSkillsDescription: Record<BumpkinSkillsDescription, string> = {
  // Crops
  "description.green.thumb": "Mahsül verimi 5% fazla",
  "description.cultivator": "Mahsül süresi 5% hızlı",
  "description.master.farmer": "Mahsuller %10 daha fazla verim sağlıyor",
  "description.golden.flowers": "Ayçiçeklerin Altın Düşürebilir ",
  "description.happy.crop": "2x Mahsul Şansı",
  // Trees
  "description.lumberjack": "Ağaçlar %10 odun daha fazla veriyor",
  "description.tree.hugger": "Ağaçlar %20 daha hızlı büyüyor",
  "description.tough.tree": "3x Odun Düşürme Şansı",
  "description.money.tree": "Ağaçlardan coins düşürme şansı",
  // Rocks
  "description.digger": "%10 daha fazla taş",
  "description.coal.face": "Taşlar %20 daha hızlı geri döner",
  "description.seeker": "Kaya canavarlarını çekin",
  "description.gold.rush": "2.5x Altın düşürme şansı",
  // Cooking
  "description.rush.hour": "Yemekleri %10 daha hızlı pişirin",
  "description.kitchen.hand": "Yemekler ekstra %5 deneyim kazandırır",
  "description.michelin.stars": "Yüksek kaliteli yiyecekler, ek %5 SFL kazanın",
  "description.curer": "Delinin ürünlerini tüketmek ekstra %15 exp ekler",
  // Animals
  "description.stable.hand": "Hayvanlar %10 daha hızlı üretiyor",
  "description.free.range": "Hayvanlar %10 daha fazla üretiyor",
  "description.horse.whisperer": "Mutantların şansını artırın",
  "description.buckaroo": "Çift düşüş ihtimali",
};

const bumpkinTrade: Record<BumpkinTrade, string> = {
  "bumpkinTrade.minLevel": "Ticaret yapmak için 10. seviyede olmanız gerekir",
  "bumpkinTrade.noTradeListed": "Listelenen herhangi bir işleminiz yok.",
  "bumpkinTrade.sell": "Kaynaklarınızı SFL için diğer oyunculara satın.",
  "bumpkinTrade.like.list": "Neleri listelemek istersiniz?",
  "bumpkinTrade.purchase": "Goblin Retreat’den satın alın",
  "bumpkinTrade.available": "Mevcut",
  "bumpkinTrade.quantity": "Miktar",
  "bumpkinTrade.price": "Fiyat",
  "bumpkinTrade.listingPrice": "Listeleme fiyatı",
  "bumpkinTrade.pricePerUnit": ENGLISH_TERMS["bumpkinTrade.pricePerUnit"],
  "bumpkinTrade.tradingFee": "Takas ücreti",
  "bumpkinTrade.youWillReceive": "Alacağın miktar",
  "bumpkinTrade.cancel": "İptal",
  "bumpkinTrade.list": "Listele",
  "bumpkinTrade.maxListings": "Maksimum listelemeye ulaşıldı",
  "bumpkinTrade.max": ENGLISH_TERMS["bumpkinTrade.max"],
  "bumpkinTrade.min": ENGLISH_TERMS["bumpkinTrade.min"],
  "bumpkinTrade.floorPrice": ENGLISH_TERMS["bumpkinTrade.floorPrice"],
  "bumpkinTrade.price/unit": ENGLISH_TERMS["bumpkinTrade.price/unit"],
  "bumpkinTrade.minimumFloor": ENGLISH_TERMS["bumpkinTrade.minimumFloor"],
  "bumpkinTrade.maximumFloor": ENGLISH_TERMS["bumpkinTrade.maximumFloor"],
  "bumpkinTrade.sellConfirmation":
    ENGLISH_TERMS["bumpkinTrade.sellConfirmation"],
  "bumpkinTrade.cant.sell.all": ENGLISH_TERMS["bumpkinTrade.cant.sell.all"],
};

const goblinTrade: Record<GoblinTrade, string> = {
  "goblinTrade.select": ENGLISH_TERMS["goblinTrade.select"],
  "goblinTrade.bulk": ENGLISH_TERMS["goblinTrade.bulk"],
  "goblinTrade.conversion": ENGLISH_TERMS["goblinTrade.conversion"],
  "goblinTrade.hoarding": ENGLISH_TERMS["goblinTrade.hoarding"],
  "goblinTrade.vipRequired": ENGLISH_TERMS["goblinTrade.vipRequired"],
  "goblinTrade.vipDelivery": ENGLISH_TERMS["goblinTrade.vipDelivery"],
};

const buyFarmHand: Record<BuyFarmHand, string> = {
  "buyFarmHand.howdyBumpkin": "Selam Bumpkin.",
  "buyFarmHand.confirmBuyAdditional":
    "Ek bir Bumpkin satın almak istediğinizden emin misiniz?",
  "buyFarmHand.farmhandCoupon": "1 Çiftlik Yardımcısı Kuponu",
  "buyFarmHand.adoptBumpkin": "Bir Bumpkin'i evlat edin",
  "buyFarmHand.additionalBumpkinsInfo":
    "Giyilebilir cihazları donatmak ve çiftliğinizi güçlendirmek için ek Bumpkins kullanılabilir.",
  "buyFarmHand.notEnoughSpace": "Yeterli alan yok - adanızı yükseltin",
  "buyFarmHand.buyBumpkin": "Bumpkin satın al",
  "buyFarmHand.newFarmhandGreeting":
    "Ben senin yeni çiftçinim. İşe gitmek için sabırsızlanıyorum!",
};

const changeLanguage: Record<ChangeLanguage, string> = {
  "changeLanguage.confirm": ENGLISH_TERMS["changeLanguage.confirm"],
  "changeLanguage.contribute": ENGLISH_TERMS["changeLanguage.contribute"],
  "changeLanguage.contribute.message":
    ENGLISH_TERMS["changeLanguage.contribute.message"],
};

const chat: Record<Chat, string> = {
  "chat.Fail": "Bağlantı başarısız oldu",
  "chat.mute": "Sessize alındın",
  "chat.again": "Tekrar sohbet edebilmeye kalan süre",
  "chat.Kicked": "Atıldın",
};

const chickenWinner: Record<ChickenWinner, string> = {
  "chicken.winner.playagain": "tekrar oynamak için buraya tıklayın",
};

const choresStart: Record<ChoresStart, string> = {
  "chores.harvestFields": "Tarlaları hasat edin",
  "chores.harvestFieldsIntro":
    "Bu tarlalar kendi kendini sürmeyecek. 3 Ayçiçeği hasat edin.",
  "chores.earnSflIntro":
    "Çiftçilik işinde başarılı olmak istiyorsanız, ayçiçeği satarak, tohum satın alarak ve kâr elde ederek başlasanız iyi olur.",
  "chores.reachLevel": "2. Seviyeye Ulaşın",
  "chores.reachLevelIntro":
    "Seviye atlamak ve yeni yeteneklerin kilidini açmak istiyorsanız, yemek pişirip yemeye başlasanız iyi olur.",
  "chores.chopTrees": "3 Ağaç Kesin",
  "chores.helpWithTrees":
    "Eski kemiklerim eskisi gibi değil, kesilmesi gereken bu lanet ağaçlar konusunda bana yardım edebilir misin? Yerel Demircimiz bazı aletler yapmanıza yardımcı olacaktır.",
  "chores.noChore": "Üzgünüm, şu anda yapman gereken herhangi bir iş yok.",
  "chores.newSeason":
    "Yeni bir sezon yaklaşıyor, işler geçici olarak kapanacak.",
  "chores.choresFrozen": ENGLISH_TERMS["chores.choresFrozen"],
  "chores.left": ENGLISH_TERMS["chores.left"],
};

const chumDetails: Record<ChumDetails, string> = {
  "chumDetails.gold": "Parıldayan altın 100 mil öteden görülebilir",
  "chumDetails.iron":
    "Alacakaranlık sırasında her açıdan görülebilen parıldayan bir ışıltı",
  "chumDetails.stone": "Belki birkaç taş atmak balıkları çeker",
  "chumDetails.egg":
    "Hmmm, hangi balığın yumurtadan hoşlanacağından emin değilim...",
  "chumDetails.sunflower": "Meraklı balıklar için güneşli, canlı bir yem.",
  "chumDetails.potato": "Patates alışılmadık bir balık ziyafeti sunar.",
  "chumDetails.pumpkin":
    "Balkabaklarının turuncu parıltısı balıkların ilgisini çekebilir.",
  "chumDetails.carrot":
    "Hamsi yakalamak için en iyi solucanlarla birlikte kullanılır!",
  "chumDetails.cabbage": "Sualtı otçulları için yemyeşil bir cazibe.",
  "chumDetails.beetroot": "Cesur balıkların deniz altı lezzeti pancar.",
  "chumDetails.cauliflower":
    "Balıklar çiçek salkımlarını garip bir şekilde çekici bulabilir.",
  "chumDetails.parsnip": "Meraklı balıklar için topraksı, köklü bir yem.",
  "chumDetails.eggplant": "Patlıcan: Cesur balıkların sudaki macerası.",
  "chumDetails.corn": "Koçandaki mısır tuhaf ama ilgi çekici bir ikramdır.",
  "chumDetails.radish": "Turp, su sporları için gömülü hazine.",
  "chumDetails.wheat":
    "Buğday, su altında toplayıcılar için grenli bir lezzet.",
  "chumDetails.kale": "Meraklı balıklara yeşil yapraklı bir sürpriz.",
  "chumDetails.blueberry":
    "Çoğu zaman mavi balıklar potansiyel eş olarak karıştırılır.",
  "chumDetails.orange": "Deniz canlılarının narenciye merakı olan portakal.",
  "chumDetails.apple": "Elmalar – dalgaların altında çıtır bir bilmece.",
  "chumDetails.banana": "Sudan daha hafif!",
  "chumDetails.seaweed":
    "Yapraklı bir su altı atıştırmalığında okyanusun tadı.",
  "chumDetails.crab":
    "Meraklı bir deniz altı balığı için iştah açıcı bir lokma.",
  "chumDetails.anchovy":
    "Hamsi, denizdeki kanun kaçaklarını gizemli bir şekilde cezbediyor.",
  "chumDetails.redSnapper": "Okyanusun derinliklerinde saklı bir gizem.",
  "chumDetails.tuna": "Ton balığı yiyebilecek kadar büyük olan şey nedir?",
  "chumDetails.squid": "En sevdiği ikramla bir ışını uyandırın!",
  "chumDetails.wood": "Odun. İlginç bir seçim....",
  "chumDetails.redPansy": "Yakalanması zor balıklar için ateşli cazibe.",
  "chumDetails.fatChicken":
    "Balıkların en büyüğünün dayanamadığı orijinal beyaz et.",
  "chumDetails.speedChicken": "Keskin dişli avcılar için fast food tatlısı.",
  "chumDetails.richChicken": "Ekranın parlak terörüne karşı incelik.",
  "chumDetails.horseMackerel": ENGLISH_TERMS["chumDetails.horseMackerel"],
  "chumDetails.sunfish": ENGLISH_TERMS["chumDetails.sunfish"],
};

const claimAchievement: Record<ClaimAchievement, string> = {
  "claimAchievement.alreadyHave": "Bu başarıya zaten sahipsiniz",
  "claimAchievement.requirementsNotMet": "Gereksinimleri karşılamıyorsunuz",
};

const community: Record<Community, string> = {
  "community.toast": "Metin boş",
  "community.url": "Repo URL'nizi girin",
  "comunity.Travel": "Topluluk tarafından inşa edilen adalara seyahat et",
};

const compostDescription: Record<CompostDescription, string> = {
  "compost.fruitfulBlend": ENGLISH_TERMS["compost.fruitfulBlend"],
  "compost.sproutMix": ENGLISH_TERMS["compost.sproutMix"],
  "compost.sproutMixBoosted": ENGLISH_TERMS["compost.sproutMixBoosted"],
  "compost.rapidRoot": ENGLISH_TERMS["compost.rapidRoot"],
};

const composterDescription: Record<ComposterDescription, string> = {
  "composter.compostBin": "Kompost Kutusu ayrıntıları…",
  "composter.turboComposter": "Turbo Kompost detayları...",
  "composter.premiumComposter": "Premium Kompost detayları...",
};

const confirmationTerms: Record<ConfirmationTerms, string> = {
  "confirmation.sellCrops": ENGLISH_TERMS["confirmation.sellCrops"],
  "confirmation.buyCrops": ENGLISH_TERMS["confirmation.buyCrops"],
};

const confirmSkill: Record<ConfirmSkill, string> = {
  "confirm.skillClaim": "Yeteneği talep etmek istediğinizden emin misiniz?",
};

const conversations: Record<Conversations, string> = {
  "home-intro.one": ENGLISH_TERMS["home-intro.one"],
  "home-intro.three": ENGLISH_TERMS["home-intro.three"],
  "home-intro.two": ENGLISH_TERMS["home-intro.two"],
  "firepit-intro.one": ENGLISH_TERMS["firepit-intro.one"],
  "firepit-intro.two": ENGLISH_TERMS["firepit-intro.two"],
  "firepit.increasedXP": ENGLISH_TERMS["firepit.increasedXP"],
  "hank-intro.headline": "Yaşlı bir adama yardım mı edeceksin?",
  "hank-intro.one": "Selam Bumpkin! Küçük cennet bölgemize hoş geldiniz.",
  "hank-intro.two":
    "Elli yıldır bu topraklarda çalışıyorum ama biraz yardıma ihtiyacım olabilir.",
  "hank-intro.three":
    "Günlük işlerimde bana yardım ettiğin sürece sana çiftçiliğin temellerini öğretebilirim.",
  "hank.crafting.scarecrow": "Bir korkuluk üret",
  "hank-crafting.one":
    "Hımmm, bu mahsuller çok yavaş büyüyor. Beklemek için zamanım yok.",
  "hank-crafting.two": "Mahsullerinizi hızlandırmak için bir korkuluk yapın.",
  "hank.choresFrozen": ENGLISH_TERMS["hank.choresFrozen"],
  "betty-intro.headline": "Çiftliğinizi nasıl büyütebilirsiniz?",
  "betty-intro.one": "Selam, selam! Pazarıma hoş geldiniz.",
  "betty-intro.two":
    "Bana en güzel hasadını getir, ben de sana onlar için makul bir fiyat vereceğim!",
  "betty-intro.three":
    "Tohumlara mı ihtiyacınız var? Patateslerden yaban havuçlarına kadar her konuda yanınızdayım!",
  "betty.market-intro.one":
    "Merhaba Bumpkin! Ben çiftçi pazarından Betty. Mahsul satın almak ve taze tohum satmak için adalar arasında seyahat ediyorum.",
  "betty.market-intro.two":
    "İyi haber: az önce yeni ve parlak bir kürekle karşılaştınız! Kötü haber: Bir miktar mahsul kıtlığı yaşadık.",
  "betty.market-intro.three":
    "Sınırlı bir süre için yeni gelenlere, bana getireceğiniz mahsuller için paranın iki katını teklif ediyorum.",
  "betty.market-intro.four":
    "Ayçiçeklerini hasat edin ve çiftçilik imparatorluğunuzu kuralım.",

  "bruce-intro.headline": "Yemek Pişirmeye Giriş",
  "bruce-intro.one": "Bu sevimli küçük bistronun sahibiyim.",
  "bruce-intro.two":
    "Bana kaynak getirin, ben de yiyebileceğiniz tüm yemekleri pişireyim!",
  "bruce-intro.three":
    "Merhaba çiftçi! Aç bir Bumpkin'i bir mil öteden fark edebilirim.",
  "blacksmith-intro.headline": "Ağaç Kes Kes Kes.",
  "blacksmith-intro.one":
    "Ben bir alet ustasıyım ve doğru kaynaklarla ihtiyacınız olan her şeyi yapabilirim... daha fazla alet de dahil!",

  "pete.first-expansion.one":
    "Tebrikler Bumpkin! Çiftliğiniz yağmur fırtınasındaki fasulye saplarından daha hızlı büyüyor!",
  "pete.first-expansion.two":
    "Her genişletmede özel kaynaklar, yeni ağaçlar ve toplanacak daha fazlası gibi harika şeyler bulacaksınız!",
  "pete.first-expansion.three":
    "Keşfederken cömert goblinlerden gelen sürpriz hediyelere dikkat edin; onlar sadece uzman inşaatçılar değil, aynı zamanda kurnaz sır verenlerdir!",
  "pete.first-expansion.four":
    "Tebrikler Bumpkin! İyi işler yapmaya devam edin.",
  "pete.craftScarecrow.one": "Hmm, bu mahsuller yavaş büyüyor.",
  "pete.craftScarecrow.two":
    "Sunflower Land, çiftçilik becerilerinizi geliştirmek için üretebileceğiniz büyülü öğelerle doludur.",
  "pete.craftScarecrow.three":
    "Çalışma tezgahına gidin ve Ayçiçeklerini hızlandırmak için bir korkuluk yapın.",
  "pete.levelthree.one": "Tebrikler, yeşil baş parmağınız gerçekten parlıyor!",
  "pete.levelthree.two":
    "Çiftçilik yeteneğinizin daha da parlayabileceği Plaza'ya gitmemizin tam zamanı.",
  "pete.levelthree.three":
    "Plazada kaynaklarınızı ödüller karşılığında teslim edebilir, büyülü eşyalar üretebilir ve diğer oyuncularla ticaret yapabilirsiniz.",
  "pete.levelthree.four":
    "Sol alttaki dünya simgesine tıklayarak seyahat edebilirsiniz.",
  "pete.help.zero":
    "Ateş çukurunu ziyaret edin, yemek pişirin ve seviye atlamak için yiyin.",
  "pete.pumpkinPlaza.one":
    "Seviye atladıkça keşfedilecek yeni alanların kilidini açacaksınız. İlk önce Balkabağı Plaza... benim evim!",
  "pete.pumpkinPlaza.two":
    "Burada ödüller için teslimatları tamamlayabilir, büyülü eşyalar üretebilir ve diğer oyuncularla ticaret yapabilirsiniz.",

  "sunflowerLand.islandDescription":
    "Ayçiçeği Ülkesi, teslimatları tamamlayabileceğiniz, nadir NFT'ler üretebileceğiniz ve hatta hazine kazabileceğiniz heyecan verici adalarla doludur!",
  "sunflowerLand.opportunitiesDescription":
    "Farklı yerler, zorlukla kazandığınız kaynaklarınızı harcamak için farklı fırsatlar sunar.",
  "sunflowerLand.returnHomeInstruction":
    "İstediğiniz zaman eve dönmek için seyahat düğmesine tıklayın.",

  "grimbly.expansion.one":
    "Selamlar, tomurcuklanan çiftçi! Ben Grimbly'yim, tecrübeli bir Goblin İnşaatçısıyım.",
  "grimbly.expansion.two":
    "Doğru malzemeler ve eski işçilik becerilerim ile adanızı bir şahesere dönüştürebiliriz.",

  "luna.portalNoAccess":
    "Hımmm, bu portal birdenbire ortaya çıktı. Bu ne anlama gelebilir?",
  "luna.portals": "Portallar",
  "luna.rewards": "Ödüller",
  "luna.travel":
    "Oyuncuların oluşturduğu bu portallara seyahat edin ve ödüller kazanın.",

  "pete.intro.one":
    "Selam, Bumpkin! Her şeyin mümkün olduğu bereketli tarım cenneti Sunflower Land’e hoş geldiniz!",
  "pete.intro.two":
    "Ne güzel bir ada kurmuşsun! Ben komşu çiftçiniz Balkabağı Pete'im.",
  "pete.intro.three":
    "Şu anda oyuncular plazada muhteşem ödüller ve büyülü eşyalarla dolu bir festivali kutluyorlar.",
  "pete.intro.four":
    "Eğlenceye katılmadan önce çiftliğinizi büyütmeniz ve bazı kaynaklar toplamanız gerekecek. Eliniz boş dönmek istemezsiniz!",
  "pete.intro.five":
    "Başlamak için bu ağaçları kesip adanızı büyütmek isteyeceksiniz.",

  "mayor.plaza.changeNamePrompt":
    "İsminizi değiştirmek istiyor musunuz? Maalesef bunu şu anda senin için yapamam, evrak işleri benim için çok fazla.",
  "mayor.plaza.intro":
    "Selam dostum Bumpkin, görünüşe göre henüz tanıştırılmadık.",
  "mayor.plaza.role":
    "Ben bu şehrin belediye başkanıyım! Herkesin mutlu olmasını sağlamak benim görevim. Ayrıca herkesin bir adı olduğundan da emin oluyorum!",
  "mayor.plaza.fixNamePrompt":
    "Henüz bir adınız yok mu? Pekâlâ, bunu düzeltebiliriz! Evrakları hazırlamamı ister misin?",
  "mayor.plaza.enterUsernamePrompt": "Kullanıcı adınızı giriniz: ",
  "mayor.plaza.usernameValidation":
    "Lütfen kullanıcı adlarının kurallara uyması gerektiğini unutmayın.",
  "mayor.plaza.niceToMeetYou": "Tanıştığıma memnun oldum, !",
  "mayor.plaza.congratulations":
    "Tebrikler, artık evraklarınız tamamlandı. Görüşürüz!",
  "mayor.plaza.enjoyYourStay":
    "Umarım Sunflower Land’de konaklamanızdan keyif alırsınız! Bir daha bana ihtiyacın olursa bana geri dön!",
  "mayor.codeOfConduct": "Davranış kodu",
  "mayor.failureToComply":
    "Buna uyulmaması, hesabın askıya alınması da dahil olmak üzere cezalarla sonuçlanabilir",
  "mayor.paperworkComplete": "Artık evraklarınız tamamlandı. Görüşürüz",
};

const cropBoomMessages: Record<CropBoomMessages, string> = {
  "crop.boom.welcome": "Crop Boom'a hoş geldiniz",
  "crop.boom.reachOtherSide":
    "Arcade Jetonu almak için tehlikeli mahsul alanının diğer tarafına ulaşın",
  "crop.boom.bewareExplodingCrops":
    "Patlayan mahsullere karşı dikkatli olun. Bunların üzerine basarsanız baştan başlayacaksınız",
  "crop.boom.newPuzzleDaily": "Her gün yeni bir bulmaca ortaya çıkacak",
  "crop.boom.back.puzzle": "Yepyeni bir bulmaca için daha sonra tekrar gelin!",
};

const cropFruitDescriptions: Record<CropFruitDescriptions, string> = {
  // Crops
  "description.sunflower": "Güneşli bir çiçek",
  "description.potato": "Düşündüğünüzden daha sağlıklı.",
  "description.pumpkin": "Balkabağında turtadan daha fazlası var.",
  "description.carrot": "Gözlerinize iyi gelirler!",
  "description.cabbage":
    "Bir zamanlar lüks olan bu ürün artık birçokları için bir yiyecek.",
  "description.beetroot": "Akşamdan kalmalığa iyi gelir!",
  "description.cauliflower": "Mükemmel pirinç yerine!",
  "description.parsnip": "Havuçla karıştırılmamalıdır.",
  "description.eggplant": "Doğanın yenilebilir sanat eseri.",
  "description.corn": "Güneşin öptüğü keyif taneleri, doğanın yaz hazinesi.",
  "description.radish": "Zaman alır ama beklemeye değer!",
  "description.wheat": "Dünyanın en çok hasat edilen ürünü.",
  "description.kale": "Bir Bumpkin Güç Yemeği!",
  "description.soybean": ENGLISH_TERMS["description.soybean"],

  "description.grape": ENGLISH_TERMS["description.grape"],
  "description.olive": ENGLISH_TERMS["description.olive"],
  "description.rice": ENGLISH_TERMS["description.rice"],

  // Fruits
  "description.blueberry": "Bir Goblin'in zayıflığı",
  "description.orange": "Bumpkin'inizi Sağlıklı tutmak için C Vitamini",
  "description.apple": "Ev yapımı elmalı turta için mükemmel",
  "description.banana": "Ah muz!",

  // Exotic Crops
  "description.white.carrot": "Soluk kökleri olan soluk bir havuç",
  "description.warty.goblin.pumpkin": "Tuhaf, siğillerle kaplı bir balkabağı",
  "description.adirondack.potato": "Sağlam bir patates, Adirondack tarzı!",
  "description.purple.cauliflower": "Muhteşem bir mor karnabahar",
  "description.chiogga": "Gökkuşağı pancarı!",
  "description.golden.helios": "Güneşin öptüğü ihtişam!",
  "description.black.magic": "Karanlık ve gizemli bir çiçek!",

  //Flower Seed
  "description.sunpetal.seed": "Bir güneş yaprağı tohumu",
  "description.bloom.seed": "Bir çiçek tohumu",
  "description.lily.seed": "Bir zambak tohumu",
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
  "cropMachine.harvestCropPack": ENGLISH_TERMS["cropMachine.harvestCropPack"],
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
  "cropMachine.running": ENGLISH_TERMS["cropMachine.running"],
  "cropMachine.stopped": ENGLISH_TERMS["cropMachine.stopped"],
  "cropMachine.idle": ENGLISH_TERMS["cropMachine.idle"],
  "cropMachine.name": ENGLISH_TERMS["cropMachine.name"],
};

const decorationDescriptions: Record<DecorationDescriptions, string> = {
  // Decorations
  "description.wicker.man":
    "El ele tutuşun ve bir zincir yapın, Hasır Adam'ın gölgesi yeniden yükselecek",
  "description.golden bonsai": "Goblinler de bonsai'yi sever",
  "description.christmas.bear": "Noel Baba'nın favorisi",
  "description.war.skull": "Ülkeyi düşmanlarınızın kemikleriyle süsleyin.",
  "description.war.tombstone": "HUZUR İÇİNDE YATSIN",
  "description.white.tulips": "Goblinlerin kokusunu uzak tutun.",
  "description.potted.sunflower": "Toprağınızı aydınlatın.",
  "description.potted.potato": "Bumpkin'in içinden patates kanı akıyor.",
  "description.potted.pumpkin": "Bumpkins için Balkabakları",
  "description.cactus":
    "Su tasarrufu sağlar ve çiftliğinizin muhteşem görünmesini sağlar!",
  "description.basic.bear":
    "Temel bir ayı. Bir ayı inşa etmek için bunu Goblin Retreat'te kullanın!",
  "description.bonnies.tombstone":
    "Her çiftliğe ürkütücü bir eklenti olan Bonnie'nin İnsan Mezar Taşı tüylerinizi diken diken edecek.",
  "description.grubnashs.tombstone":
    "Grubnash’ın Goblin Mezar Taşı ile biraz muzip bir çekicilik katın",
  "description.town.sign": "Çiftlik kimliğinizi gururla gösterin!",
  "description.dirt.path":
    "Çiftçi botlarınızı iyi işlenmiş bir yolla temiz tutun.",
  "description.bush": "Çalıların arasında ne gizleniyor?",
  "description.fence": "Çiftliğinize rustik bir çekicilik katın.",
  "description.stone.fence": "Taş çitin zamansız zarafetini kucaklayın.",
  "description.pine.tree": "Dik ve kudretli durmak, iğnelerle kaplı bir rüya.",
  "description.shrub": "Güzel bir çalıyla oyun içi peyzajınızı geliştirin",
  "description.field.maple":
    "Yapraklarını narin yeşil bir gölgelik gibi yayan küçük bir büyücü.",
  "description.red.maple":
    "Ateşli yapraklar ve sonbahar sıcaklığıyla dolu bir kalp.",
  "description.golden.maple":
    "Parıldayan altın yapraklarıyla parlaklık saçıyor.",
  "description.crimson.cap":
    "Yüksek ve canlı bir mantar olan Kızıl Şapkalı Dev Mantar, çiftliğinize hayat getirecek.",
  "description.toadstool.seat":
    "Arkanıza yaslanın ve ilginç Mantarlı Mantar Koltuğunda rahatlayın.",
  "description.chestnut.fungi.stool":
    "Kestane Mantarı Taburesi her çiftliğe sağlam ve rustik bir eklentidir.",
  "description.mahogany.cap":
    "Maun Kapaklı Dev Mantar ile sofistike bir dokunuş ekleyin.",
  "description.candles":
    "Cadılar Bayramı sırasında çiftliğinizi titreyen hayalet alevlerle büyüleyin.",
  "description.haunted.stump":
    "Ruhları çağırın ve çiftliğinize ürkütücü bir çekicilik katın.",
  "description.spooky.tree":
    "Çiftliğinizin dekoruna akıl almaz derecede eğlenceli bir katkı!",
  "description.observer":
    "Sürekli gezinen bir göz küresi, her zaman tetikte ve her zaman tetikte!",
  "description.crow.rock": "Gizemli bir kayanın tepesine tünemiş bir karga.",
  "description.mini.corn.maze":
    "2023 Cadılar Bayramı sezonundan sevilen labirentten bir hatıra.",
  "description.lifeguard.ring":
    "Deniz kenarındaki kurtarıcınız, stilinizle ayakta kalın!",
  "description.surfboard": "Harika dalgalarda gezin, teknede plaj mutluluğu!",
  "description.hideaway.herman":
    "Herman saklanmak için burada ama her zaman bir parti arıyor!",
  "description.shifty.sheldon":
    "Sheldon kurnazdır, her zaman bir sonraki sürprize koşar!",
  "description.tiki.torch":
    "Geceyi aydınlatın, tropik titreşimler parlak bir şekilde yanıyor!",
  "description.beach.umbrella":
    "Güneşli bir ortamda gölge, barınak ve deniz kenarı şıklığı!",
  "description.magic.bean": "Ne büyüyecek?",
  "description.giant.potato": "Dev bir patates.",
  "description.giant.pumpkin": "Dev bir balkabağı.",
  "description.giant.cabbage": "Dev bir lahana.",
  "description.chef.bear": "Her şefin bir yardım eline ihtiyacı vardır",
  "description.construction.bear": "Her zaman bir ayı piyasasında inşa edin",
  "description.angel.bear": "Köylü çiftçiliğini aşmanın zamanı geldi",
  "description.badass.bear": "Hiçbir şey yolunuza çıkamaz.",
  "description.bear.trap": "Bu bir tuzak!",
  "description.brilliant.bear": "Saf parlaklık!",
  "description.classy.bear":
    "Bununla ne yapacağınızı bildiğinizden daha fazla SFL!",
  "description.farmer.bear":
    "Hiçbir şey zorlu bir günlük çalışma gibisi yoktur!",
  "description.rich.bear": "Değerli bir sahiplik",
  "description.sunflower.bear": "Bir Ayının değerli mahsulü",
  "description.beta.bear": "Özel test etkinlikleriyle bulunan bir ayı",
  "description.rainbow.artist.bear": "Sahibi güzel bir ayı sanatçısı!",
  "description.devil.bear": "Tanıdığın Şeytan tanımadığın Şeytandan iyidir",
  "description.collectible.bear": "Değerli bir ayı, hala mükemmel durumda!",
  "description.cyborg.bear": "Görüşürüz, ayı",
  "description.christmas.snow.globe":
    "Karları döndürün ve canlanmasını izleyin",
  "description.kraken.tentacle":
    "Derin deniz gizemine dalın! Bu dokunaç, antik okyanus efsaneleri ve su harikaları hakkındaki hikayeleri anlatıyor.",
  "description.kraken.head":
    "Derin deniz gizemine dalın! Bu kafa, eski okyanus efsaneleri ve su harikaları hakkındaki hikayeleri anlatıyor.",
  "description.abandoned.bear": "Adada geride bırakılan bir ayı.",
  "description.turtle.bear": "Kaplumbağa kulübü için yeterince kaplumbağa var.",
  "description.trex.skull": "T-Rex'ten bir kafatası! İnanılmaz!",
  "description.sunflower.coin": "Ayçiçeklerinden yapılmış bir madeni para.",
  "description.skeleton.king.staff": "Hepiniz İskelet Kral'ı selamlayın!",
  "description.lifeguard.bear": "Cankurtaran Ayı günü kurtarmak için burada!",
  "description.snorkel.bear": "Şnorkel Ayı yüzmeyi çok seviyor.",
  "description.parasaur.skull": "Parasaur'dan bir kafatası!",
  "description.goblin.bear": "Bir goblin ayı. Biraz korkutucu.",
  "description.golden.bear.head": "Ürkütücü ama harika.",
  "description.pirate.bear": "Ah, dostum! Sarıl bana!",
  "description.galleon": "Oyuncak bir gemi, hala oldukça iyi durumda.",
  "description.dinosaur.bone": "Bir Dinozor Kemiği! Bu nasıl bir yaratıktı?",
  "description.human.bear":
    "Bir insan ayı. Bir goblin ayıdan bile daha korkutucu.",
  "description.flamingo":
    "Dikenli ve kendinden emin duran aşkın güzelliğinin simgesidir.",
  "description.blossom.tree":
    "Narin yaprakları aşkın güzelliğini ve kırılganlığını simgelemektedir.",
  "description.heart.balloons":
    "Bunları romantik günler için dekorasyon olarak kullanın.",
  "description.whale.bear":
    "Bir ayı gibi yuvarlak, tüylü bir vücudu vardır, ancak yüzgeçleri, kuyruğu ve bir balinanın hava deliği vardır.",
  "description.valentine.bear": "Sevenler için.",
  "description.easter.bear": "Bir Tavşan nasıl yumurtlayabilir?",
  "description.easter.bush": "İçerideki ne?",
  "description.giant.carrot":
    "Tavşanlar merakla bakarken dev bir havuç eğlenceli gölgeler yaratarak duruyordu.",
  "description.beach.ball":
    "Zıplayan top, plaj havası verir ve can sıkıntısını giderir.",
  "description.palm.tree":
    "Uzun, kumsal, gölgeli ve şık palmiye ağaçları dalgaları dalgalandırıyor.",

  //other
  "description.sunflower.amulet": "Ayçiçeği veriminde %10 artış.",
  "description.carrot.amulet": "Havuçlar %20 daha hızlı büyür.",
  "description.beetroot.amulet": "Pancar veriminde %20 artış.",
  "description.green.amulet": "10x mahsul verimi şansı.",
  "description.warrior.shirt": "Gerçek bir savaşçının işareti.",
  "description.warrior.pants": "Kalçalarınızı koruyun.",
  "description.warrior.helmet": "Oklara karşı bağışıklı.",
  "description.sunflower.shield":
    "Ayçiçeği Diyarı'nın bir kahramanı. Ücretsiz Ayçiçeği Tohumları!",
  "description.skull.hat": "Bumpkin'iniz için nadir bir şapka.",
  "description.sunflower.statue": "Kutsal simgenin sembolü",
  "description.potato.statue": "OG patates avcısı",
  "description.christmas.tree": "Noel gününde Santa Airdrop'u alın",
  "description.gnome": "Şanslı bir cüce",
  "description.homeless.tent": "Güzel ve rahat bir çadır",
  "description.sunflower.tombstone": "Ayçiçeği Çiftçileri anısına",
  "description.sunflower.rock": "Polygon'u kıran oyun",
  "description.goblin.crown": "Goblinlerin liderini çağır",
  "description.fountain": "Çiftliğiniz için rahatlatıcı bir çeşme",
  "description.nyon.statue": "Nyon Lann’ın hatırlarında",
  "description.farmer.bath": "Çiftçilere pancara kokulu banyo",
  "description.woody.Beaver": "Odun verimini %20 artırın",
  "description.apprentice.beaver": "Ağaçlar %50 daha hızlı iyileşir",
  "description.foreman.beaver": "Ağaçları baltasız kes",
  "description.egg.basket": "Paskalya Yumurtası Avına erişim sağlar",
  "description.mysterious.head": "Çiftçileri koruduğu düşünülen bir heykel",
  "description.tunnel.mole": "Taş madenlerine %25 artış sağlar",
  "description.rocky.the.mole": "Demir madenlerine %25 artış sağlar",
  "description.nugget": "Altın madenlerine %25 artış sağlar",
  "description.rock.golem": "3x taş elde etmek için %10 şans verir",
  "description.chef.apron": "Pasta satışında %20 ekstra SFL verir",
  "description.chef.hat": "Efsanevi fırıncının tacı!",
  "description.nancy":
    "Birkaç kargayı uzakta tutar. Mahsuller %15 daha hızlı büyüyor",
  "description.scarecrow": "Bir goblin korkuluğu. %20 daha fazla ürün verin",
  "description.kuebiko":
    "Esnaf bile bu korkuluktan korkuyor. Tohumlar ücretsizdir",
  "description.golden.cauliflower": "Karnabahar verimini iki katına çıkarır",
  "description.mysterious.parsnip": "Yaban havuçları %50 daha hızlı büyüyor",
  "description.carrot.sword": "Mutant bir ürünün ortaya çıkma şansını artırın",
  "description.chicken.coop": "Yumurta miktarının 2 katı kadar topla",
  "description.farm.cat": "Fareleri uzak tutun",
  "description.farm.dog": "Çiftlik köpeğinizle koyun sürün",
  "description.gold.egg": "Tavukları buğdaya ihtiyaç duymadan besleyin",
  "description.easter.bunny": "%20 daha fazla Havuç kazanın",
  "description.rooster": "Mutant bir tavuğu düşürme şansını iki katına çıkarır",
  "description.chicken": "Yumurta üretir. Beslemek için buğdaya ihtiyaç var",
  "description.cow": "Süt üretir. Beslemek için buğdaya ihtiyaç var",
  "description.pig": "Gübre üretir. Beslemek için buğdaya ihtiyaç var",
  "description.sheep": "Yün üretir. Beslemek için buğdaya ihtiyaç var",
  "description.basic.land": "Temel bir toprak parçası",
  "description.crop.plot": "Bitki yetiştirmek için boş bir arsa",
  "description.gold.rock": "Altın toplamak için kazılabilen bir kaya",
  "description.iron.rock": "Demir toplamak için kazılabilen bir kaya",
  "description.stone.rock": "Taş toplamak için kazılabilen bir kaya",
  "description.crimstone.rock": "Kızıltaş toplamak için kazılabilen bir kaya",
  "description.oil.reserve": ENGLISH_TERMS["description.oil.reserve"],
  "description.flower.bed": "Çiçek dikmek için boş bir arsa",
  "description.tree": "Odun toplamak için kesilebilir bir ağaç",
  "description.fruit.patch": "Meyve dikmek için boş bir arsa",
  "description.boulder": "Nadir mineralleri düşürebilen efsanevi bir kaya",
  "description.catch.the.kraken.banner":
    "Kraken burada! Kraken Yakalama Sezonu katılımcısının işareti.",
  "description.luminous.lantern": "Yolu aydınlatan parlak bir kağıt fener.",
  "description.radiance.lantern":
    "Güçlü bir ışıkla parlayan parlak bir kağıt fener.",
  "description.ocean.lantern":
    "Gelgitin sallanmasıyla sallanan dalgalı bir kağıt fener.",
  "description.solar.lantern":
    "Ayçiçeklerinin canlı özünü kullanan Solar Fener, sıcak ve ışıltılı bir ışıltı yayıyor.",
  "description.aurora.lantern":
    "Herhangi bir alanı büyülü bir harikalar diyarına dönüştüren bir kağıt fener.",
  "description.dawn.umbrella":
    "Şafak Şemsiye Koltuğu ile bu yağmurlu günlerde patlıcanları kuru tutun.",
  "description.eggplant.grill":
    "Her türlü açık hava yemeği için mükemmel olan Patlıcan Izgara ile yemek pişirin.",
  "description.giant.dawn.mushroom":
    "Dev Şafak Mantarı her çiftliğe görkemli ve büyülü bir katkıdır.",
  "description.shroom.glow":
    "Çiftliğinizi Shroom Glow'un büyüleyici ışıltısıyla aydınlatın.",
  "description.clementine":
    "Clementine Gnome, çiftçilik maceralarınız için neşeli bir yol arkadaşıdır.",
  "description.blossombeard":
    "Çiçek Sakallı Gnome, çiftçilik maceralarınız için güçlü bir yol arkadaşıdır.",
  "description.desertgnome": ENGLISH_TERMS["description.desertgnome"],
  "description.cobalt":
    "Kobalt Gnome, canlı şapkasıyla çiftliğinize renk katar.",
  "description.hoot": "Vay vay! Bilmecemi hâlâ çözmedin mi?",
  "description.genie.bear": "Tam olarak istediğim şey!",
  "description.betty.lantern":
    "O kadar gerçek görünüyor ki! Bunu nasıl hazırladıklarını merak ediyorum.",
  "description.bumpkin.lantern":
    "Yaklaştığınızda yaşayan bir Bumpkin'in mırıltılarını duyarsınız... tüyler ürpertici!",
  "description.eggplant.bear": "Cömert bir patlıcan balinasının işareti.",
  "description.goblin.lantern": "Korkunç görünümlü bir fener",
  "description.dawn.flower":
    "Günün ilk ışıklarında narin yaprakları parıldayan Şafak Çiçeğinin ışıltılı güzelliğini kucaklayın",
  "description.kernaldo.bonus": "+%25 Mısır Büyüme Hızı",
  "description.white.crow": "Gizemli ve ruhani bir beyaz karga",
  "description.sapo.docuras": "Gerçek bir tehdit!",
  "description.sapo.travessuras": "Oh oh... birisi yaramazlık yapmış",
  "description.walrus":
    "Güvenilir dişleri ve derinlere olan sevgisiyle, her seferinde ekstra bir balık yakalamanızı sağlayacaktır.",
  "description.alba":
    "Keskin içgüdüleri sayesinde avınıza biraz daha fazla katkı sağlamanızı sağlar. %50 ihtimalle +1 Temel Balık!",
  "description.knowledge.crab":
    "Bilgi Yengeç, Filiz Karışımı etkinizi ikiye katlayarak toprak hazinelerinizi deniz yağmacılığı kadar zengin hale getirir!",
  "description.anchor":
    "Bu deniz mücevheriyle demir atın, her noktayı denize uygun hale getirin ve su sıçramasına son derece şık bir hale getirin!",
  "description.rubber.ducky":
    "Her köşeye neşeli bir neşe getiren bu klasik şarlatanla eğlencenin tadını çıkarın!",
  "description.arcade.token":
    "Mini oyunlardan ve maceralardan kazanılan bir jeton. Ödüllerle takas edilebilir.",
  "description.bumpkin.nutcracker": "2023'ten kalma şenlikli bir dekorasyon.",
  "description.festive.tree":
    "Her tatil sezonunda şenlikli bir ağaç mevcuttur. Acaba Noel Baba'nın görebileceği kadar büyük mü?",
  "description.white.festive.fox":
    "Beyaz Tilki'nin kutsaması cömert çiftliklerde yaşıyor",
  "description.grinxs.hammer":
    "Efsanevi Goblin Demircisi Grinx'in sihirli çekici.",
  "description.angelfish":
    "Canlı tonlardan oluşan bir paletle süslenmiş sudaki göksel güzellik.",
  "description.halibut":
    "Düz okyanus tabanı sakini, kumlu kamuflajda kılık değiştirme ustası.",
  "description.parrotFish":
    "Dalgaların altındaki renklerden oluşan bir kaleydoskop olan bu balık, doğanın yaşayan sanat eseridir.",
  "description.Farmhand": "Yardımsever bir çiftçi",
  "description.Beehive":
    "Aktif olarak büyüyen çiçeklerden bal üreten hareketli bir arı kovanı; Bal hasadında, büyüyen tüm mahsulleri +0,2 artışla tozlaştıracak bir arı sürüsü çağırma şansı %10!",
  // Flowers
  "description.red.pansy": "Kırmızı bir menekşe.",
  "description.yellow.pansy": "Sarı bir menekşe.",
  "description.purple.pansy": "Mor bir menekşe.",
  "description.white.pansy": "Beyaz bir menekşe.",
  "description.blue.pansy": "Mavi bir menekşe.",

  "description.red.cosmos": "Kırmızı bir Cosmos.",
  "description.yellow.cosmos": "Sarı bir Cosmos.",
  "description.purple.cosmos": "Mor bir Cosmos.",
  "description.white.cosmos": "Beyaz bir Cosmos.",
  "description.blue.cosmos": "Mavi bir Cosmos.",

  "description.red.balloon.flower": "Kırmızı balon çiçeği.",
  "description.yellow.balloon.flower": "Sarı balon çiçeği.",
  "description.purple.balloon.flower": "Mor bir balon çiçeği.",
  "description.white.balloon.flower": "Beyaz bir balon çiçeği.",
  "description.blue.balloon.flower": "Mavi balon çiçeği.",

  "description.red.carnation": "Kırmızı bir karanfil.",
  "description.yellow.carnation": "Sarı bir karanfil.",
  "description.purple.carnation": "Mor bir karanfil.",
  "description.white.carnation": "Beyaz bir karanfil.",
  "description.blue.carnation": "Mavi bir karanfil.",

  "description.humming.bird":
    "Gökyüzünün minik bir mücevheri olan Sinek Kuşu, rengarenk bir zarafetle uçuyor.",
  "description.queen.bee":
    "Kovanın görkemli hükümdarı Kraliçe Arı, kraliyet otoritesiyle vızıldıyor.",
  "description.flower.fox":
    "Yapraklarla süslenmiş oyuncu bir yaratık olan Çiçek Tilki, bahçeye neşe katıyor.",
  "description.hungry.caterpillar":
    "Yaprakları yerken Aç Tırtıl her zaman lezzetli bir maceraya hazırdır.",
  "description.sunrise.bloom.rug":
    "Yaprakların çiçekli gün doğumu etrafında dans ettiği Sunrise Bloom Rug'a adım atın.",
  "description.blossom.royale":
    "Canlı mavi ve pembe renkte dev bir çiçek olan Blossom Royale, görkemli bir çiçek içinde duruyor.",
  "description.rainbow":
    "Rengarenk kemeriyle gökyüzü ile yeryüzü arasında köprü oluşturan neşeli bir Gökkuşağı.",
  "description.enchanted.rose":
    "Sonsuz güzelliğin sembolü olan Büyülü Gül, büyülü cazibesiyle büyülüyor.",
  "description.flower.cart":
    "Çiçeklerle dolu Çiçek Arabası, çiçek lezzetleriyle dolu hareketli bir bahçedir.",
  "description.capybara":
    "Rahat bir arkadaş olan Kapibara, su kenarında tembel günlerin tadını çıkarır.",
  "description.prism.petal":
    "Vay! Ne güzel bir çiçek! Bunun çiftliğinize yerleştirmeye değer olduğunu düşünüyorum.",
  "description.celestial.frostbloom":
    "Vay! Ne güzel bir çiçek! Bunun çiftliğinize yerleştirmeye değer olduğunu düşünüyorum.",
  "description.primula.enigma":
    "Vay! Ne güzel bir çiçek! Bunun çiftliğinize yerleştirmeye değer olduğunu düşünüyorum.",

  "description.red.daffodil": "Kırmızı bir nergis.",
  "description.yellow.daffodil": "Sarı bir nergis.",
  "description.purple.daffodil": "Mor bir nergis.",
  "description.white.daffodil": "Beyaz bir nergis.",
  "description.blue.daffodil": "Mavi bir nergis.",

  "description.red.lotus": "Kırmızı bir nilüfer.",
  "description.yellow.lotus": "Sarı bir nilüfer.",
  "description.purple.lotus": "Mor bir nilüfer.",
  "description.white.lotus": "Beyaz bir nilüfer.",
  "description.blue.lotus": "Mavi bir nilüfer.",

  // Banners
  "description.goblin.war.banner": "Goblin davasına bağlılığın bir göstergesi",
  "description.human.war.banner": "İnsan davasına bağlılığın bir göstergesi",
  "description.earnAllianceBanner": "Özel bir etkinlik bayrağı",
  "description.sunflorian.faction.banner":
    ENGLISH_TERMS["description.sunflorian.faction.banner"],
  "description.goblin.faction.banner":
    ENGLISH_TERMS["description.goblin.faction.banner"],
  "description.bumpkin.faction.banner":
    ENGLISH_TERMS["description.bumpkin.faction.banner"],
  "description.nightshade.faction.banner":
    ENGLISH_TERMS["description.nightshade.faction.banner"],

  "description.gauchoRug": ENGLISH_TERMS["description.gauchoRug"],

  // Clash of Factions
  "description.turbo.sprout": ENGLISH_TERMS["description.turbo.sprout"],
  "description.soybliss": ENGLISH_TERMS["description.soybliss"],
  "description.grape.granny": ENGLISH_TERMS["description.grape.granny"],
  "description.royal.throne": ENGLISH_TERMS["description.royal.throne"],
  "description.lily.egg": ENGLISH_TERMS["description.lily.egg"],
  "description.goblet": ENGLISH_TERMS["description.goblet"],
  "description.clock": ENGLISH_TERMS["description.clock"],
  "description.fancy.rug": ENGLISH_TERMS["description.fancy.rug"],
  "description.vinny": ENGLISH_TERMS["description.vinny"],

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
  "description.silverSquire": ENGLISH_TERMS["description.silverSquire"],
  "description.silverStallion": ENGLISH_TERMS["description.silverStallion"],
  "description.traineeTarget": ENGLISH_TERMS["description.traineeTarget"],
  "description.twisterRug": ENGLISH_TERMS["description.twisterRug"],
  "description.ricePanda": ENGLISH_TERMS["description.ricePanda"],
  "description.benevolenceFlag": ENGLISH_TERMS["description.benevolenceFlag"],
  "description.devotionFlag": ENGLISH_TERMS["description.devotionFlag"],
  "description.generosityFlag": ENGLISH_TERMS["description.generosityFlag"],
  "description.splendorFlag": ENGLISH_TERMS["description.splendorFlag"],
  "description.jellyLamp": ENGLISH_TERMS["description.jellyLamp"],
  "description.paintCan": ENGLISH_TERMS["description.paintCan"],
};

const defaultDialogue: Record<DefaultDialogue, string> = {
  "defaultDialogue.intro":
    "Merhaba arkadaş! İhtiyacım olan şeyin sende olup olmadığını görmek için buradayım.",
  "defaultDialogue.positiveDelivery":
    "Harika! Tam ihtiyacım olanı getirdin. Teşekkür ederim!",
  "defaultDialogue.negativeDelivery":
    "Oh hayır! Görünüşe göre ihtiyacım olan şey sende yok. Yine de endişelenmeyin. Keşfetmeye devam edin, başka bir fırsat bulacağız.",
  "defaultDialogue.noOrder":
    "Şu anda yerine getirmem gereken aktif bir sipariş yok.",
};

const delivery: Record<Delivery, string> = {
  "delivery.resource": "Kaynakları teslim etmemi ister misin?",
  "delivery.feed": "Bedava değil, beslemem gereken bir kabilem var!",
  "delivery.fee": ENGLISH_TERMS["delivery.fee"],
  "delivery.goblin.comm.treasury": "Goblin Topluluk Hazinesi",
};

const deliveryHelp: Record<DeliveryHelp, string> = {
  "deliveryHelp.pumpkinSoup":
    "Malzemeleri toplayın ve ödül karşılığında siparişleri Bumpkins'e teslim etmek için Balkabağı Plazasına tekne yolculuğu yapın!",
  "deliveryHelp.hammer":
    "Daha fazla slotun ve daha hızlı teslimat siparişlerinin kilidini açmak için arazinizi genişletin",
  "deliveryHelp.axe":
    "Görevlerinizi tamamlayın ve ödüllerinizi almak için Plaza'da Hank'i bulun.",
  "deliveryHelp.chest":
    "Bonus ödüllerin kilidini açmak için birden fazla siparişi tamamlayarak Bumpkinler ile ilişkiler kurun.",
};

const deliveryitem: Record<DeliveryItem, string> = {
  "deliveryitem.inventory": "Envanter: ",
  "deliveryitem.itemsToDeliver": "Teslim edilecek öğeler: ",
  "deliveryitem.deliverToWallet": "Cüzdanınıza teslim edin",
  "deliveryitem.viewOnOpenSea":
    "Teslim edildikten sonra öğelerinizi OpenSea'de görebileceksiniz.",
  "deliveryitem.deliver": "Teslim etmek",
};

const depositWallet: Record<DepositWallet, string> = {
  "deposit.errorLoadingBalances": "Bakiyeniz yüklenirken bir hata oluştu.",
  "deposit.yourPersonalWallet": "Kişisel Cüzdanınız",
  "deposit.farmWillReceive": "Çiftliğiniz alacak",
  "deposit.depositDidNotArrive": "Depozito ulaşmadı mı?",
  "deposit.goblinTaxInfo":
    "Oyuncular herhangi bir SFL'yi geri çektiklerinde Goblin Vergisi uygulanır.",
  "deposit.sendToFarm": "Çiftliğe gönder",
  "deposit.toDepositLevelUp": "Öğeleri yatırmak için önce seviye atlamalısınız",
  "deposit.level": "3. seviye",
  "deposit.noSflOrCollectibles": "SFL veya Koleksiyon Bulunamadı!",
  "deposit.farmAddress": "Çiftlik adresi",
  "question.depositSFLItems":
    "Sunflower Land koleksiyonlarını, giyilebilir ürünlerini veya SFL'yi yatırmak ister misiniz?",
};

const detail: Record<Detail, string> = {
  "detail.how.item": "Bu öğeyi nasıl edinebilirim?",
  "detail.Claim.Reward": "Ödül talep et",
  "detail.basket.empty": "Senin sepetin boş!",
  "detail.view.item": "Öğeyi şu tarihte görüntüle:",
};

const discordBonus: Record<DiscordBonus, string> = {
  "discord.bonus.niceHat": "Vay, güzel şapka!",
  "discord.bonus.attentionEvents":
    "Fırsatları kaçırmamak için Discord'daki özel etkinliklere ve çekilişlere dikkat etmeyi unutmayın.",
  "discord.bonus.bonusReward": "Bonus Ödülü",
  "discord.bonus.payAttention":
    "Kaçırmamak için Discord'daki özel etkinliklere ve çekilişlere dikkat edin.",
  "discord.bonus.enjoyCommunity":
    "Topluluğumuzun bir parçası olmaktan keyif alacağınızı umuyoruz!",
  "discord.bonus.communityInfo":
    "Canlı Discord topluluğumuzda 100.000'den fazla oyuncu olduğunu biliyor muydunuz?",
  "discord.bonus.farmingTips":
    "Çiftçilik ipuçları ve püf noktaları arıyorsanız, burası tam size göre.",
  "discord.bonus.freeGift":
    "En iyi yanı... Katılan herkese ücretsiz bir hediye verilecek!",
  "discord.bonus.connect": "Discord'a bağlan",
  "fontReward.bonus.claim": ENGLISH_TERMS["fontReward.bonus.claim"],
  "fontReward.bonus.intro1": ENGLISH_TERMS["fontReward.bonus.intro1"],
  "fontReward.bonus.intro2": ENGLISH_TERMS["fontReward.bonus.intro2"],
  "fontReward.bonus.intro3": ENGLISH_TERMS["fontReward.bonus.intro3"],
};

const donation: Record<Donation, string> = {
  "donation.one":
    "Bu bir topluluk sanat girişimiydi ve bağışlar çok takdir ediliyor!",
  "donation.specialEvent": ENGLISH_TERMS["donation.specialEvent"],
  "donation.rioGrandeDoSul.one": ENGLISH_TERMS["donation.rioGrandeDoSul.one"],
  "donation.rioGrandeDoSul.two": ENGLISH_TERMS["donation.rioGrandeDoSul.two"],
  "donation.matic": ENGLISH_TERMS["donation.matic"],
  "donation.minimum": ENGLISH_TERMS["donation.minimum"],
  "donation.airdrop": ENGLISH_TERMS["donation.airdrop"],
};

const draftBid: Record<DraftBid, string> = {
  "draftBid.howAuctionWorks": "Açık artırma nasıl işliyor?",
  "draftBid.unsuccessfulParticipants":
    "Başarısız olan katılımcılara kaynakları iade edilecektir.",
  "draftBid.termsAndConditions": "Şartlar ve koşullar",
};

const errorAndAccess: Record<ErrorAndAccess, string> = {
  "errorAndAccess.blocked.betaTestersOnly":
    "Erişim yalnızca beta test kullanıcılarıyla sınırlıdır",
  "errorAndAccess.denied.message": "Henüz oyuna erişiminiz yok.",
  "errorAndAccess.instructions.part1": "Katıldığınızdan emin olun",
  "errorAndAccess.sflDiscord": "Ayçiçeği Arazi Anlaşmazlığı",
  "errorAndAccess.instructions.part2":
    ", #verify kanalına gidin ve 'çiftçi' rolünü üstlenin.",
  "error.cannotPlaceInside": "İçeri yerleştirilemiyor",
};

const errorTerms: Record<ErrorTerms, string> = {
  "error.betaTestersOnly": "Yalnızca beta test kullanıcıları!",
  "error.congestion.one":
    "Elimizden gelenin en iyisini yapmaya çalışıyoruz ancak görünüşe göre Polygon çok fazla trafik alıyor veya bağlantınızı kaybetmişsiniz.",
  "error.congestion.two":
    "Bu hata devam ederse lütfen Metamask RPC'nizi değiştirmeyi deneyin.",
  "error.connection.one": "Görünüşe göre bu isteği yerine getiremedik.",
  "error.connection.two": "Basit bir bağlantı sorunu olabilir.",
  "error.connection.three": "Tekrar denemek için yenile'yi tıklayabilirsiniz.",
  "error.connection.four":
    "Sorun devam ederse destek ekibimizle iletişime geçerek veya discord'a geçip topluluğumuza sorarak yardıma ulaşabilirsiniz.",
  "error.diagnostic.info": "Teşhis Bilgileri",
  "error.forbidden.goblinVillage":
    "Goblin Köyü'nü ziyaret etmenize izin verilmiyor!",
  "error.multipleDevices.one": "Birden fazla cihaz açık",
  "error.multipleDevices.two":
    "Lütfen üzerinde çalıştığınız diğer tarayıcı sekmelerini veya cihazlarını kapatın.",
  "error.multipleWallets.one": "Çoklu Cüzdan",
  "error.multipleWallets.two":
    "Birden fazla cüzdanınızın yüklü olduğu anlaşılıyor. Bu beklenmeyen davranışlara neden olabilir. Biri hariç tüm cüzdanları devre dışı bırakmayı deneyin.",
  "error.polygonRPC":
    "Lütfen tekrar deneyin veya Polygon RPC ayarlarınızı kontrol edin.",
  "error.toManyRequest.one": "Çok fazla istek!",
  "error.toManyRequest.two":
    "Görünüşe göre meşgulsün! Lütfen daha sonra tekrar deneyiniz.",
  "error.Web3NotFound": "Web3 Bulunamadı",
  "error.wentWrong": "Bir şeyler yanlış gitti!",
  "error.clock.not.synced": "Saat senkronize değil",
  "error.polygon.cant.connect": "Polygon'a bağlanılamıyor",
  "error.composterNotExist": "Komposto mevcut değil",
  "error.composterNotProducing": "Kompost üretmiyor",
  "error.composterAlreadyDone": "Komposto zaten yapıldı",
  "error.composterAlreadyBoosted": "Zaten öne çıkarıldı",
  "error.missingEggs": "Kayıp Yumurtalar",
  "error.insufficientSFL": "Yetersiz SFL",
  "error.dailyAttemptsExhausted": "Günlük denemeler tükendi",
  "error.missingRod": "Eksik çubuk",
  "error.missingBait": "Eksik ",
  "error.alreadyCasted": "Zaten yayınlandı",
  "error.unsupportedChum": ENGLISH_TERMS["error.unsupportedChum"],
  "error.insufficientChum": "Yetersiz Yem",
  "error.alr.composter": "Kompost makinesi zaten kompost yapıyor",
  "error.no.alr.composter": "Kompost makinesi üretime hazır değil",
  "error.missing": "Eksik gereksinimler",
  "error.no.ready": "Kompost hazır değil",
  "error.noprod.composter": "Kompost hiçbir şey üretmiyor",
  "error.buildingNotExist": "Bina mevcut değil",
  "error.buildingNotCooking": "Bina hiçbir şey pişirmek değildir",
  "error.recipeNotReady": "Tarif hazır değil",
  "error.npcsNotExist": "NPC'ler mevcut değil",
  "error.noDiscoveryAvailable": "Keşif mevcut değil",
  "error.obsessionAlreadyCompleted": "Bu takıntı zaten tamamlandı",
  "error.collectibleNotInInventory":
    "Gerekli koleksiyon parçasına sahip değilsiniz",
  "error.wearableNotInWardrobe":
    "Gerekli giyilebilir donanıma sahip değilsiniz",
  "error.requiredBuildingNotExist": "Gerekli bina mevcut değil",
  "error.cookingInProgress": "Pişirme işlemi zaten devam ediyor",
  "error.insufficientIngredient": "Yetersiz içerik",
  "error.ClientRPC": "İstemci RPC Hatası",
  "error.walletInUse.one": ENGLISH_TERMS["error.walletInUse.one"],
  "error.walletInUse.two": ENGLISH_TERMS["error.walletInUse.two"],
  "error.walletInUse.three": ENGLISH_TERMS["error.walletInUse.three"],
  "error.notEnoughOil": ENGLISH_TERMS["error.notEnoughOil"],
  "error.oilCapacityExceeded": ENGLISH_TERMS["error.oilCapacityExceeded"],
};

const event: Record<Event, string> = {
  "event.christmas": "Noel etkinliği!",
  "event.LunarNewYear": "Ay Yeni Yılı Etkinliği",
  "event.valentines.rewards": "Sevgililer Günü Ödülleri",
  "event.GasHero": "Gas Hero Etkinliği",
  "event.Easter": "Paskalya Etkinliği",
};

const exoticShopItems: Record<ExoticShopItems, string> = {
  "exoticShopItems.line1":
    "Fasulyelerimiz çılgın bir bilim adamıyla yeni bir yolculuğa çıkarken fasulye dükkanımız kapanıyor.",
  "exoticShopItems.line2":
    "Baklagilleri seven topluluğumuzun bir parçası olduğunuz için teşekkür ederiz.",
  "exoticShopItems.line3": "Saygılarımla,",
  "exoticShopItems.line4": "Fasulye Takımı",
};

const factions: Record<Factions, string> = {
  "faction.emblems": ENGLISH_TERMS["faction.emblems"],
  "faction.emblems.intro.one": ENGLISH_TERMS["faction.emblems.intro.one"],
  "faction.emblems.intro.three": ENGLISH_TERMS["faction.emblems.intro.three"],
  "faction.emblems.intro.two": ENGLISH_TERMS["faction.emblems.intro.two"],
  "faction.tradeEmblems": ENGLISH_TERMS["faction.tradeEmblems"],
  "faction.marksBoost": ENGLISH_TERMS["faction.marksBoost"],
  "faction.openingSoon": ENGLISH_TERMS["faction.openingSoon"],
  "faction.join": ENGLISH_TERMS["faction.join"],
  "faction.description.bumpkins": ENGLISH_TERMS["faction.description.bumpkins"],
  "faction.description.goblins": ENGLISH_TERMS["faction.description.goblins"],
  "faction.description.sunflorians":
    ENGLISH_TERMS["faction.description.sunflorians"],
  "faction.description.nightshades":
    ENGLISH_TERMS["faction.description.nightshades"],
  "faction.countdown": ENGLISH_TERMS["faction.countdown"],
  "faction.join.confirm": ENGLISH_TERMS["faction.join.confirm"],
  "faction.cannot.change": ENGLISH_TERMS["faction.cannot.change"],
  "faction.joined.sunflorians.intro":
    ENGLISH_TERMS["faction.joined.sunflorians.intro"],
  "faction.joined.bumpkins.intro":
    ENGLISH_TERMS["faction.joined.bumpkins.intro"],
  "faction.joined.goblins.intro": ENGLISH_TERMS["faction.joined.goblins.intro"],
  "faction.joined.nightshades.intro":
    ENGLISH_TERMS["faction.joined.nightshades.intro"],
  "faction.earn.emblems": ENGLISH_TERMS["faction.earn.emblems"],
  "faction.earn.emblems.time.left":
    ENGLISH_TERMS["faction.earn.emblems.time.left"],
  "faction.emblems.tasks": ENGLISH_TERMS["faction.emblems.tasks"],
  "faction.view.leaderboard": ENGLISH_TERMS["faction.view.leaderboard"],
  "faction.donation.bulk.resources":
    ENGLISH_TERMS["faction.donation.bulk.resources"],
  "faction.donation.bulk.resources.unlimited.per.day":
    ENGLISH_TERMS["faction.donation.bulk.resources.unlimited.per.day"],
  "faction.donation.confirm": ENGLISH_TERMS["faction.donation.confirm"],
  "faction.donation.label": ENGLISH_TERMS["faction.donation.label"],
  "faction.donation.request.message":
    ENGLISH_TERMS["faction.donation.request.message"],
  "faction.donation.sfl": ENGLISH_TERMS["faction.donation.sfl"],
  "faction.donation.sfl.max.per.day":
    ENGLISH_TERMS["faction.donation.sfl.max.per.day"],
  "faction.seasonal.delivery.start.at":
    ENGLISH_TERMS["faction.seasonal.delivery.start.at"],
  "faction.points.with.number": ENGLISH_TERMS["faction.points.with.number"],
  "faction.points.title": ENGLISH_TERMS["faction.points.title"],
  "faction.points.pledge.warning":
    ENGLISH_TERMS["faction.points.pledge.warning"],
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

  // Faction Shop
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
  "festivetree.greedyBumpkin": "Açgözlü Bumpkin Tespit Edildi",
  "festivetree.alreadyGifted":
    "Bu ağaç zaten hediye edildi. Daha fazla şenlik için gelecek Noel'e kadar bekleyin.",
  "festivetree.notFestiveSeason": "Festival sezonu değil. Daha sonra gel.",
};

const fishDescriptions: Record<FishDescriptions, string> = {
  // Fish
  "description.anchovy.one":
    "Okyanusun cep boyutunda dart akrobatı, her zaman acelesi var!",
  "description.anchovy.two": "Minik balık, büyük lezzet!",
  "description.butterflyfish.one":
    "Canlı, şık çizgileriyle gösteriş yapan, ileri moda anlayışına sahip bir balık.",
  "description.butterflyfish.two": "Renklerde ve tatlarda yüzmek!",
  "description.blowfish.one":
    "Denizin yuvarlak, şişirilmiş komedyeni, bir gülümseme getirmeyi garanti ediyor.",
  "description.blowfish.two": "Tehlikeyle yemek yiyin, dikenli bir sürpriz!",
  "description.clownfish.one":
    "Mandalina rengi bir smokini ve palyaço çekiciliğiyle su altı soytarısı.",
  "description.clownfish.two": "Şaka yok, sadece saf lezzet!",
  "description.seabass.one":
    "Gümüş pullu 'o kadar da heyecan verici olmayan' arkadaşınız – basit bir yakalama!",
  "description.seabass.two": "Deniz kenarı mutfağının temelleri!",
  "description.seahorse.one":
    "Okyanusun ağır çekim dansçısı, su balesinde zarif bir şekilde sallanıyor.",
  "description.seahorse.two": "Zarif, nadir ve şaşırtıcı derecede lezzetli!",
  "description.horsemackerel.one":
    "Daima dalgaların arasında yarışan, parlak paltolu bir hızcı.",
  "description.horsemackerel.two":
    "Her lokmada lezzetlerin arasında dörtnala koşun!",
  "description.squid.one":
    "Merakınızı gıdıklayacak dokunaçlara sahip derin deniz gizemi.",
  "description.squid.two": "Enfes lezzetlere giden yolu çizin!",
  "description.redsnapper.one":
    "Ağır kırmızıya bürünmüş, ağırlığınca altın değerinde bir av.",
  "description.redsnapper.two": "Zengin, lezzetli lezzet okyanuslarına dalın!",
  "description.morayeel.one":
    "Okyanusun gölgeli köşelerinde sinsi, uğursuz bir pusuya yatmış.",
  "description.morayeel.two": "Kaygan, lezzetli ve sansasyonel!",
  "description.oliveflounder.one":
    "Deniz yatağının kılık değiştirme ustası, her zaman kalabalığa karışıyor.",
  "description.oliveflounder.two": "Zenginlik ve lezzet içinde debelenmek!",
  "description.napoleanfish.one":
    "Balıklarla Napolyon kompleksiyle tanışın – kısa ama muhteşem!",
  "description.napoleanfish.two": "Bu avla açlığınızı yenin!",
  "description.surgeonfish.one":
    "Okyanusun neon savaşçısı, keskin bir tavırla donanmış.",
  "description.surgeonfish.two": "Damak tadınıza göre hassasiyetle çalışın!",
  "description.zebraturkeyfish.one":
    "Çizgileri, dikenleri ve neşeli yapısıyla bu balık gerçek bir gösterişçidir!",
  "description.zebraturkeyfish.two":
    "Çizgili, dikenli ve olağanüstü derecede lezzetli!",
  "description.ray.one":
    "Su altı planörü, dalgaların arasından geçen sakin kanatlı bir güzellik.",
  "description.ray.two": "Zengin lezzetler diyarına doğru süzülün!",
  "description.hammerheadshark.one":
    "İş için kafası ve macera için vücudu olan köpekbalığıyla tanışın!",
  "description.hammerheadshark.two": "Lezzetle kafa kafaya çarpışma!",
  "description.tuna.one":
    "Okyanusun kaslı sprinteri, muhteşem bir yarışa hazır!",
  "description.tuna.two": "Her dilimde dev bir lezzet!",
  "description.mahimahi.one":
    "Altın yüzgeçlerle hayatı rengarenk yaşamaya inanan bir balık.",
  "description.mahimahi.two": "Adı ikiye katla, lezzeti ikiye katla!",
  "description.bluemarlin.one":
    "Okyanus efsanesi, tavrı deniz kadar derin olan marlin.",
  "description.bluemarlin.two": "Bu muhteşem avla iştahınızı önleyin!",
  "description.oarfish.one":
    "Uzun lafın kısası esrarengiz bir okyanus gezgini.",
  "description.oarfish.two": "Efsanevi lezzete doğru yol alın!",
  "description.footballfish.one":
    "Derinlerin MVP'si, oynamaya hazır biyolüminesan bir yıldız!",
  "description.footballfish.two": "Lezzet konusunda bir gol atın!",
  "description.sunfish.one":
    "Okyanusta güneşlenen, yüzgeçlerini yüksekte tutarak spot ışıklarının tadını çıkarıyor.",
  "description.sunfish.two": "Nefis lezzetinin ışıltısının tadını çıkarın!",
  "description.coelacanth.one":
    "Geçmişe ve bugüne dair bir tada sahip, tarih öncesi bir kalıntı.",
  "description.coelacanth.two": "Zamana meydan okuyan tarih öncesi lezzet!",
  "description.whaleshark.one":
    "Derinlerin nazik devi, okyanusun büfesinden hazineleri ayıklıyor.",
  "description.whaleshark.two": "Anıtsal istekler için devasa bir yemek!",
  "description.barredknifejaw.one":
    "Siyah-beyaz çizgili ve altın kalpli bir okyanus kanun kaçağı.",
  "description.barredknifejaw.two": "Keskin lezzetlerle açlığınızı bastırın!",
  "description.sawshark.one":
    "Testere benzeri burnuyla okyanusun marangozudur, her zaman son teknolojiye sahiptir!",
  "description.sawshark.two": "Derinlerden gelen son teknoloji lezzet!",
  "description.whiteshark.one":
    "Denizleri son derece güçlü bir şekilde yöneten, öldürücü gülümsemeye sahip köpekbalığı!",
  "description.whiteshark.two": "Heyecan verici lezzet okyanusuna dalın!",

  // Marine Marvels
  "description.twilight.anglerfish":
    "Dahili gece lambasına sahip, karanlıkta yolunu gösteren bir derin deniz balıkçısı.",
  "description.starlight.tuna":
    "Koleksiyonunuzu aydınlatmaya hazır, yıldızları gölgede bırakan bir ton balığı.",
  "description.radiant.ray":
    "Paylaşacak parıldayan bir sırrı olan, karanlıkta parlamayı tercih eden bir ışın.",
  "description.phantom.barracuda":
    "Derinlerin, gölgelerde saklanan, bulunması zor ve hayaletimsi bir balığı.",
  "description.gilded.swordfish":
    "Altın gibi parıldayan pullara sahip bir kılıç balığı, en iyi av!",
  "description.crimson.carp": "Kaynak sularının nadir, canlı bir mücevheri.",
  "description.battle.fish": ENGLISH_TERMS["description.battle.fish"],
};

const fishermanModal: Record<FishermanModal, string> = {
  "fishermanModal.attractFish": "Suya chum atarak balıkları çekin.",
  "fishermanModal.fishBenefits":
    "Balık; yemek, dağıtmak ve ödül almak için harikadır!",
  "fishermanModal.baitAndResources":
    "Bana yem ve kaynaklar getirin, okyanusun sunabileceği en nadide ödüllerin tadını çıkaralım!",
  "fishermanModal.crazyHappening":
    "Vay be, çılgınca bir şeyler oluyor... Tam bir balık çılgınlığı!",
  "fishermanModal.fullMoon": ENGLISH_TERMS["fishermanModal.fullMoon"],
  "fishermanModal.bonusFish":
    "Acele edin, her avınızda bir bonus balık kazanacaksınız!",
  "fishermanModal.dailyLimitReached":
    "Günlük balık avlama limitinize ulaştınız",
  "fishermanModal.needCraftRod": "İlk önce bir olta yapmalısınız.",
  "fishermanModal.craft.beach": "Sahilde El İşi",
  "fishermanModal.zero.available": "0 Mevcut",
  "fishermanmodal.greeting":
    "Ahoy adalılar!  Ben {{name}}, güvenilir ada balıkçınız ve ben de gözlerimi büyük bir mücadeleye diktim: güneşin altındaki tüm balıkları toplamak istiyorum!",
};

const fishermanQuest: Record<FishermanQuest, string> = {
  "fishermanQuest.Ohno": "Oh hayır! Uzaklaştı",
  "fishermanQuest.Newfish": "Yeni balık",
};

const fishingChallengeIntro: Record<FishingChallengeIntro, string> = {
  "fishingChallengeIntro.powerfulCatch": "Güçlü bir yakalama sizi bekliyor!",
  "fishingChallengeIntro.useStrength": "Onu tutmak için tüm gücünüzü kullanın.",
  "fishingChallengeIntro.stopGreenBar":
    "Başarılı olmak için balığın üzerinde yeşil çubuğu durdurun.",
  "fishingChallengeIntro.beQuick": "Acele edin - 3 kaçırılan denemede kaçar!",
};

const fishingGuide: Record<FishingGuide, string> = {
  "fishingGuide.catch.rod":
    "Bir olta yapın ve balık yakalamak için yem toplayın.",
  "fishingGuide.bait.earn":
    "Yem, gübreleme veya yem hazırlama yoluyla kazanılabilir.",
  "fishingGuide.eat.fish":
    "Bumpkin'inizin seviyesini yükseltmek için balık yiyin veya ödüller için balık teslimatı yapın.",
  "fishingGuide.discover.fish":
    "Nadir balıkları keşfetmek, görevleri tamamlamak ve Codex'teki benzersiz ödüllerin kilidini açmak için suları keşfedin.",
  "fishingGuide.condition":
    "Değişen gelgit düzenlerini takip edin; belirli balık türleri yalnızca belirli koşullar altında mevcuttur.",
  "fishingGuide.bait.chum":
    "Çeşitli balık türlerini yakalama şansınızı en üst düzeye çıkarmak için farklı türde yem ve arkadaş kombinasyonlarını deneyin.",
  "fishingGuide.legendery.fish":
    "Efsanevi balıklara dikkat edin; yakalamak için olağanüstü beceri ve güç gerektirirler.",
};

const fishingQuests: Record<FishingQuests, string> = {
  "quest.basic.fish": "Her temel balığı yakalayın",
  "quest.advanced.fish": "Her gelişmiş balığı yakalayın",
  "quest.all.fish": "Temel, gelişmiş ve uzman balıkların her birini keşfedin",
  "quest.300.fish": "300 balık yakala",
  "quest.1500.fish": "1500 balık yakala",
  "quest.marine.marvel": "Her Deniz Marvelini yakalayınl",
  "quest.5.fish": "Her balıktan 5'er tane yakala",
  "quest.sunpetal.savant": "12 Sunpetal çeşidini keşfedin",
  "quest.bloom.bigshot": "12 Bloom çeşidini keşfedin",
  "quest.lily.luminary": "12 Lily çeşidini keşfedin",
};

const flowerBed: Record<FlowerBed, string> = {
  "flowerBedGuide.buySeeds": "Tohum Dükkanından tohum satın alın.",
  "flowerBedGuide.crossbreedWithCrops":
    "Yeni çiçek türlerini keşfetmek için mahsullerle ve diğer çiçeklerle melezleyin.",
  "flowerBedGuide.collectAllSpecies":
    "Kodeks'teki tüm çiçek türlerini toplayın!",
  "flowerBedGuide.beesProduceHoney": "Arılar çiçekler büyürken bal üretirler.",
  "flowerBedGuide.fillUpBeehive":
    "Bir arı kovanını tamamen doldurun ve arı sürüsünün ortaya çıkma şansı için balı toplayın.",
  "flowerBedGuide.beeSwarmsBoost":
    "Arı sürüleri ekilen mahsullere +0,2 artış sağlar.",
  "flowerBed.newSpecies.discovered":
    "Vay canına, yeni bir çiçek türü keşfettiniz!",
  "flowerBedContent.select.combination": "Kombinasyonunuzu seçin",
  "flowerBedContent.select.seed": "Bir tohum seçin",
  "flowerBedContent.select.crossbreed": "Bir melez seçin",
};

const flowerbreed: Record<Flowerbreed, string> = {
  "flower.breed.sunflower":
    "Bumpkin Botanikçiler bunların çiçek olmadığına yemin ediyorlar.",
  "flower.breed.cauliflower":
    "Bumpkin Botanikçilerinin bu konuda ne söylediğinden pek emin değilim.",
  "flower.breed.beetroot": "Çok güzel bir mor rengi var.",
  "flower.breed.parsnip": "Yaban havucu melezleme için iyi bir seçim olabilir.",
  "flower.breed.eggplant":
    "Patlıcanın canlı bir rengi var, belki iyi melezlenebilir.",
  "flower.breed.radish": "Vay, bu turp kırmızı!",
  "flower.breed.kale": "Yeşil ama diğer yeşillikler gibi değil.",
  "flower.breed.blueberry":
    "Bu yaban mersinleri çok olgun, umarım lekelenmezler.",
  "flower.breed.apple": "Çıtır elmalar!",
  "flower.breed.banana": "Bir demet muz.",
  "flower.breed.redPansy": "Kırmızı bir menekşe.",
  "flower.breed.yellowPansy": "Sarı bir menekşe.",
  "flower.breed.purplePansy": "Mor bir menekşe.",
  "flower.breed.whitePansy":
    "Beyaz bir menekşe. Renkten yoksun, bunun nadir olup olmadığını merak ediyorum.",
  "flower.breed.bluePansy": "Mavi bir menekşe.",
  "flower.breed.redCosmos": "Kırmızı bir Cosmos.",
  "flower.breed.yellowCosmos": "Sarı bir Cosmos.",
  "flower.breed.purpleCosmos": "Mor bir Cosmos.",
  "flower.breed.whiteCosmos": "Beyaz bir Cosmos.",
  "flower.breed.blueCosmos": "Mavi bir Cosmos. Çok açıklayıcı.",
  "flower.breed.prismPetal":
    "Son derece nadir bir mutasyon, bunu melezlemek istediğinden emin misin?",
  "flower.breed.redBalloonFlower":
    "Balon çiçekleri çok güzel. Özellikle kırmızı olanlar.",
  "flower.breed.yellowBalloonFlower": "Sarı balon çiçeği.",
  "flower.breed.purpleBalloonFlower": "Mor bir balon çiçeği.",
  "flower.breed.whiteBalloonFlower": "Beyaz bir balon çiçeği. Bu nadir.",
  "flower.breed.blueBalloonFlower":
    "Balon çiçeklerinin en temeli. Övünecek bir şey yok.",
  "flower.breed.redDaffodil": ENGLISH_TERMS["flower.breed.redDaffodil"],
  "flower.breed.yellowDaffodil": ENGLISH_TERMS["flower.breed.yellowDaffodil"],
  "flower.breed.purpleDaffodil": ENGLISH_TERMS["flower.breed.purpleDaffodil"],
  "flower.breed.whiteDaffodil": ENGLISH_TERMS["flower.breed.whiteDaffodil"],
  "flower.breed.blueDaffodil": ENGLISH_TERMS["flower.breed.blueDaffodil"],
  "flower.breed.celestialFrostbloom":
    "Son derece nadir bir mutasyon. Bunu melezlemek istediğinizden emin misiniz?",
  "flower.breed.redCarnation":
    "Bumpkins, nadir olması nedeniyle kırmızı karanfillere değer veriyor.",
  "flower.breed.yellowCarnation": "Bumpkins sarı karanfillere değer vermiyor.",
  "flower.breed.purpleCarnation":
    "Bumpkins, mor karanfilin güzelliğine değer veriyor.",
  "flower.breed.whiteCarnation":
    "Bumpkins, sarı karanfilin sadeliğinden dolayı değer veriyor.",
  "flower.breed.blueCarnation":
    "Bumpkins, mavi karanfilin Bloom tohumlarıyla melezleme yeteneğinden dolayı değer veriyor.",
  "flower.breed.redLotus": ENGLISH_TERMS["flower.breed.redLotus"],
  "flower.breed.yellowLotus": ENGLISH_TERMS["flower.breed.yellowLotus"],
  "flower.breed.purpleLotus": ENGLISH_TERMS["flower.breed.purpleLotus"],
  "flower.breed.whiteLotus": ENGLISH_TERMS["flower.breed.purpleLotus"],
  "flower.breed.blueLotus": ENGLISH_TERMS["flower.breed.blueLotus"],
  "flower.breed.primulaEnigma":
    "Son derece nadir bir mutasyon, bunu melezlemek istediğinden emin misin?",
};

const flowerShopTerms: Record<FlowerShopTerms, string> = {
  "flowerShop.desired.dreaming": ENGLISH_TERMS["flowerShop.desired.dreaming"],
  "flowerShop.desired.delightful":
    ENGLISH_TERMS["flowerShop.desired.delightful"],
  "flowerShop.desired.wonderful": ENGLISH_TERMS["flowerShop.desired.wonderful"],
  "flowerShop.desired.setMyHeart":
    ENGLISH_TERMS["flowerShop.desired.setMyHeart"],
  "flowerShop.missingPages.alas":
    "Ama ne yazık ki! Melezleme kitabımın sayfalarını kaybettim! Plazada bir yerlerde olmalılar.",
  "flowerShop.missingPages.cantBelieve":
    "Ama inanamıyorum, en güzel hibrit çiçek tariflerimin olduğu sayfalar kayıp. Plazada bir yerlerde olmalılar.",
  "flowerShop.missingPages.inABind":
    "Ancak biraz çıkmazdayım; melezleme tekniklerimi içeren sayfalar kaybolmuş gibi görünüyor. Plazada bir yerlerde olmalılar.",
  "flowerShop.missingPages.sadly":
    "Ne yazık ki melezleme notlarım gitti! Eminim buralarda bir yerlerdedirler. Plazada bir yerlerde olmalılar.",
  "flowerShop.noFlowers.noTrade": "Üzgünüm, şu anda takas edecek çiçeğim yok.",
  "flowerShop.do.have.trade": ENGLISH_TERMS["flowerShop.do.have.trade"],
  "flowerShop.do.have.trade.one": ENGLISH_TERMS["flowerShop.do.have.trade.one"],
};

const foodDescriptions: Record<FoodDescriptions, string> = {
  // Fire Pit
  "description.pumpkin.soup": "Goblinlerin sevdiği kremalı bir çorba",
  "description.mashed.potato": "Benim hayatım patates.",
  "description.bumpkin.broth":
    "Bumpkin'inizi yenilemek için besleyici bir et suyu",
  "description.boiled.eggs": "Haşlanmış Yumurta kahvaltıda harikadır",
  "description.kale.stew": "Mükemmel bir Bumpkin Güçlendirici!",
  "description.mushroom.soup": "Bumpkin'inizin ruhunu ısıtın.",
  "description.reindeer.carrot": "Rudolph onları yemeyi bırakamıyor!",
  "description.kale.omelette": "Sağlıklı bir kahvaltı",
  "description.cabbers.mash": "Lahana ve Patates Püresi",
  "description.popcorn": "Klasik evde yetiştirilen çıtır atıştırmalık.",
  "description.gumbo":
    "Büyü dolu bir kap! Her kaşık dolusu bir Mardi Gras geçit törenidir!",

  // Kitchen
  "description.roast.veggies": "Goblinlerin bile sebzelerini yemesi gerekiyor!",
  "description.bumpkin.salad": "Bumpkin'inizi sağlıklı tutmalısınız!",
  "description.goblins.treat": "Goblinler bu şeylere deli oluyor!",
  "description.cauliflower.burger": "Tüm karnabahar severleri çağırıyoruz!",
  "description.club.sandwich": "Havuç ve Kavrulmuş Ay Çekirdeği Dolgulu",
  "description.mushroom.jacket.potatoes":
    "Elindekilerle onları tıka basa doldur!",
  "description.sunflower.crunch": "Çıtır çıtır iyilik. Yakmamaya çalışın.",
  "description.bumpkin.roast": "Geleneksel bir Bumpkin yemeği",
  "description.goblin.brunch": "Geleneksel bir Goblin yemeği",
  "description.fruit.salad": "Meyve Salatası, Nefis Nefis",
  "description.bumpkin.ganoush": "Lezzetli közlenmiş patlıcan yayıldı.",
  "description.chowder":
    "Denizcinin kasedeki lokumu! Dalın, içeride hazine var!",
  "description.pancakes": "Bumpkins gününe harika bir başlangıç",
  "description.rapidRoast": ENGLISH_TERMS["description.rapidRoast"],
  "description.beetrootBlaze": ENGLISH_TERMS["description.beetrootBlaze"],
  "description.fermented.shroomSyrup":
    ENGLISH_TERMS["description.fermented.shroomSyrup"],
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
  "description.antipasto": ENGLISH_TERMS["description.antipasto"],

  // Bakery
  "description.apple.pie": "Bumpkin Betty'nin ünlü tarifi",
  "description.kale.mushroom.pie": "Geleneksel bir Sapphiron tarifi",
  "description.cornbread": "Doyurucu altın çiftlik taze ekmeği.",
  "description.sunflower.cake": "Ayçiçeği Pastası",
  "description.potato.cake": "Patatesli Pasta",
  "description.pumpkin.cake": "Balkabaklı Pasta",
  "description.carrot.cake": "Havuçlu Pasta",
  "description.cabbage.cake": "Lahanalı Pasta",
  "description.beetroot.cake": "Pancarlı Pasta",
  "description.cauliflower.cake": "Karnabaharlı Pasta",
  "description.parsnip.cake": "Yaban havuçlu Pasta",
  "description.radish.cake": "Turplu Pasta",
  "description.wheat.cake": "Buğday Pastası",
  "description.honey.cake": "Enfes bir Pasta!",
  "description.eggplant.cake": "Taze tatlı sürpriz.",
  "description.orange.cake":
    "Portakal, elmalı pişirmediğin için seninle gurur duyuyor.",
  "description.pirate.cake": "Korsan temalı doğum günü partileri için harika.",

  // Deli
  "description.blueberry.jam": "Goblinler bu reçel için her şeyi yapar",
  "description.fermented.carrots": "Fazla havuç var mı?",
  "description.sauerkraut": "Artık sıkıcı Lahana yok!",
  "description.fancy.fries": "Fantastik Patates Kızartması",
  "description.fermented.fish":
    "Cesur bir lezzet! Her lokmada içinizdeki Viking'i serbest bırakın!",

  // Smoothie Shack
  "description.apple.juice": "Çıtır çıtır ferahlatıcı bir içecek",
  "description.orange.juice": "PS, Club Sandviç ile mükemmel uyum sağlar",
  "description.purple.smoothie": "Lahananın tadını zar zor alabiliyorsun",
  "description.power.smoothie":
    "Bumpkin Powerlifting Society'nin resmi içeceği",
  "description.bumpkin.detox": "Dün gecenin günahlarını yıka",
  "description.banana.blast":
    "Güç duygusuna sahip olanlar için en iyi meyveli yakıt!",

  // Unused foods
  "description.roasted.cauliflower": "Bir Goblin'in favorisi",
  "description.radish.pie":
    "İnsanlar tarafından hor görülür, goblinler tarafından sevilir",
};

const gameDescriptions: Record<GameDescriptions, string> = {
  // Quest Items
  "description.goblin.key": "Goblin Anahtarı",
  "description.sunflower.key": "Ayçiçeği Anahtarı",
  "description.ancient.goblin.sword": "Kadim Bir Goblin Kılıcı",
  "description.ancient.human.warhammer": "Kadim Bir İnsan Savaş Çekici",

  // Coupons
  "description.community.coin": "Ödüllerle takas edilebilecek değerli bir para",
  "description.bud.seedling": "Ücretsiz Bud NFT ile değiştirilecek bir fide",
  "description.gold.pass":
    "Sahibinin nadir NFT'ler oluşturmasına, ticaret yapmasına, para çekmesine ve bonus içeriğe erişmesine olanak tanıyan özel bir geçiş kartı.",
  "description.rapid.growth":
    "İki kat daha hızlı büyütmek için mahsule uygulayın",
  "description.bud.ticket":
    "Sunflower Land Buds NFT düşüşünde Bud basmak için garantili bir yer.",
  "description.potion.ticket":
    "İksir Evi'nden bir ödül. Garth'tan ürün satın almak için bunu kullanın.",
  "description.trading.ticket": "Serbest Ticaret! Vay be!",
  "description.block.buck": "Ayçiçeği Ülkesinde değerli bir jeton!",
  "description.beta.pass": "Test amaçlı özelliklere erken erişim sağlayın.",
  "description.war.bond": "Gerçek bir savaşçının işareti",
  "description.allegiance": "Bir bağlılık gösterisi",
  "description.jack.o.lantern": "Cadılar Bayramı özel etkinlik öğesi",
  "description.golden.crop": "Parlak altın bir mahsul",
  "description.red.envelope": "Vay, şanslısın!",
  "description.love.letter": "Sevgi duygularını aktarın",
  "description.solar.flare.ticket":
    "Güneş Patlaması Sezonunda kullanılan bir bilet",
  "description.dawn.breaker.ticket":
    "Şafak Kıran Sezonunda kullanılan bir bilet",
  "description.crow.feather":
    "Cadılar Bayramı Bilet Sezonunda kullanılan bir bilet",
  "description.mermaid.scale": "Kraken'i Yakala Sezonunda kullanılan bir bilet",
  "description.sunflower.supporter": "Oyunun gerçek bir destekçisinin işareti!",
  "description.arcade.coin":
    "Mini oyunlardan ve maceralardan kazanılan bir jeton. Ödüllerle takas edilebilir.",
  "description.farmhand.coupon":
    "Seçtiğiniz bir bumpkini satın almak için takas edebileceğiniz bir kupon.",
  "description.farmhand": "Çiftliğinizde evlat edinilmiş bir Bumpkin",
  "description.tulip.bulb": "Bahar Çiçeği sırasında kullanılan bir bilet",
  "description.treasure.key":
    "Ödülünüzün kilidini açmak için Plazayı ziyaret edin",
  "description.prizeTicket": "Ödül çekilişlerine katılmak için bir bilet",
  "description.scroll": ENGLISH_TERMS["description.scroll"],

  // Easter Items
  "description.egg.basket": "Paskalya Etkinliği",
  "description.blue.egg": "Mavi bir Paskalya yumurtası",
  "description.orange.egg": "Turuncu bir Paskalya yumurtası",
  "description.green.egg": "Yeşil bir Paskalya yumurtası",
  "description.yellow.egg": "Sarı bir Paskalya yumurtası",
  "description.red.egg": "Kırmızı bir Paskalya yumurtası",
  "description.pink.egg": "Pembe bir Paskalya yumurtası",
  "description.purple.egg": "Mor bir Paskalya yumurtası",

  //Home
  "description.homeOwnerPainting": "Bu evin sahibinin bir tablosu.",
  "description.rare.key": "Sahili ziyaret edin ve sandığınızı açın",
  "description.luxury.key":
    "Plazanın Ağaç diyarına yakın olan kısmında sandığınızı açın",
  "description.babyPanda":
    "Gas Hero etkinliğinden sevimli bir panda. Mart ayında yeni başlayanlar için 2x XP.",
  "description.baozi": "Ay Yeni Yılı etkinliğinden lezzetli bir ikram.",
  "description.hungryHare": ENGLISH_TERMS["description.hungryHare"],
  "description.communityEgg": ENGLISH_TERMS["description.communityEgg"],

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
  "auction.winner": "Açık Artırma Kazananı!",
  "bumpkin.level": "Bumpkin seviyesi",
  bumpkinBuzz: "Bumpkin Vızıltısı",
  dailyLim: "Günlük SFL Limiti",
  "farm.banned": "Bu çiftlik yasaklandı",
  gobSwarm: "Goblin Sürüsü!",
  "granting.wish": "Dileğinin yerine getirilmesi",
  "new.delivery.in": "Yeni siparişler içi kalan süre",
  "new.delivery.levelup": ENGLISH_TERMS["new.delivery.levelup"],
  "no.sfl": "SFL bulunamadı",
  opensea: "OpenSea",
  polygonscan: "PolygonScan",
  potions: "İksirler",
  "proof.of.humanity": "İnsanlığın Kanıtı",
  sflDiscord: "Sunflower Land Discord Sunucusu",
  "in.progress": "Devam etmekte",
  "compost.complete": "Kompost tamamlandı",
  "aoe.locked": "Etki Alanı Kilitli",
  sunflowerLandCodex: "Sunflower Land Kodeksi",
  "visiting.farmId": ENGLISH_TERMS["visiting.farmId"],
  "harvest.number": ENGLISH_TERMS["harvest.number"],
  "level.number": ENGLISH_TERMS["level.number"],
  "stock.left": ENGLISH_TERMS["stock.left"],
  "stock.inStock": ENGLISH_TERMS["stock.inStock"],
};

const garbageCollector: Record<GarbageCollector, string> = {
  "garbageCollector.welcome": "Mütevazı dükkanıma hoş geldiniz.",
  "garbageCollector.description":
    "Ben Çöp Taciriyim ve sahip olduğun her şeyi satın alacağım - çöp olduğu sürece.",
};

const genieLamp: Record<GenieLamp, string> = {
  "genieLamp.ready.wish": "Bir dilek tutmaya hazır mısın?",
  "genieLamp.cannotWithdraw": "Lambayı ovaladıktan sonra geri çekemezsiniz",
};

const getContent: Record<GetContent, string> = {
  "getContent.error": "Hata!",
  "getContent.joining": "Katılınılıyor",
  "getContent.accessGranted":
    "Artık erişiminiz var. Discord'daki kanala göz atın",
  "getContent.connectToDiscord":
    "Kısıtlı bir kanala katılmak için Discord'a bağlı olmanız gerekir.",
  "getContent.connect": "Bağla",
  "getContent.getAccess": "Discord'daki kısıtlı gruplara erişin",
  "getContent.requires": "Gerektirir",
  "getContent.join": "Katıl",
};

const getInputErrorMessage: Record<GetInputErrorMessage, string> = {
  "getInputErrorMessage.place.bid":
    "Bu teklifi vermek istediğinizden emin misiniz?",
  "getInputErrorMessage.cannot.bid":
    "Teklifler verildikten sonra değiştirilemez.",
};

const goblin_messages: Record<GOBLIN_MESSAGES, string> = {
  "goblinMessages.msg1": "Hey sen! İnsan! Bana biraz yiyecek getir, yoksa...",
  "goblinMessages.msg2":
    "Her zaman açım, benim için lezzetli ikramların var mı?",
  "goblinMessages.msg3": "Ne olduğu umurumda değil, sadece bana yiyecek ver!",
  "goblinMessages.msg4":
    "Eğer bana yiyecek bir şeyler vermezsen seni kemirmeye başlamak zorunda kalabilirim.",
  "goblinMessages.msg5":
    "İnsan yemeğinin en iyisi olduğunu duydum, bana biraz getir!",
  "goblinMessages.msg6": "Hey, beni hasta etmeyecek bir yiyeceğin var mı?",
  "goblinMessages.msg7":
    "Aynı şeyi yemekten biraz sıkılmaya başladım, farklı bir şeyin var mı?",
  "goblinMessages.msg8": "Yeni bir şeye açım, egzotik bir şeyin var mı?",
  "goblinMessages.msg9":
    "Hey, yedek atıştırmalıkların var mı? Söz veriyorum onları çalmayacağım... belki.",
  "goblinMessages.msg10": "Ne olduğu umurumda değil, sadece bana yiyecek ver!",
};

const goldTooth: Record<GoldTooth, string> = {
  "goldTooth.intro.part1":
    "Arrr, canlarım! Hazine kazma alanı zenginlik ve macerayla dolup taşıyor ve yakında siz cesur çiftçiler için kapılarını açacak!",
  "goldTooth.intro.part2":
    "Mürettebatıma katılmaya hazır olun, çünkü zenginlik avı yakında başlayacak!",
};

const guideCompost: Record<GuideCompost, string> = {
  "guide.compost.addEggs.speed": "Üretimi hızlandırmak için yumurta ekleyin",
  "guide.compost.addEggs": "Yumurta Ekle",
  "guide.compost.eggs": "Yumurtalar",
  "guide.compost.cropGrowthTime": "-50% Mahsul Büyüme Süresi",
  "guide.compost.fishingBait": "Balık yemi",
  "guide.compost.placeCrops":
    "Solucanları beslemek için mahsulleri kompostun içine yerleştirin",
  "guide.compost.compostCycle":
    "Bir kompost döngüsü, mahsullerinizi ve meyvelerinizi artırmak için kullanılabilecek birden fazla gübre üretir",
  "guide.compost.yieldsWorms":
    "Her kompost, balık tutmak için yem olarak kullanılabilecek solucanlar üretir",
  "guide.compost.useEggs":
    "Beklemekten yoruldunuz mu? Kompost üretimini hızlandırmak için Yumurta kullanın",
  "guide.compost.addEggs.confirmation":
    ENGLISH_TERMS["guide.compost.addEggs.confirmation"],
};

const guideTerms: Record<GuideTerms, string> = {
  "guide.intro":
    "Mütevazi başlangıçlardan uzman çiftçiliğe kadar bu kılavuz sizi her konuda bilgilendiriyor!",
  "gathering.guide.one":
    "Sunflower Land’de gelişmek için kaynak toplama sanatında ustalaşmak şarttır. Farklı kaynakları toplamak için uygun araçları donatarak başlayın. Ağaçları kesmek ve odun elde etmek için güvenilir Baltayı kullanın. Araçlar oluşturmak için yerel tezgahı ziyaret edin ve Coins/kaynaklarınızı istediğiniz araçla değiştirin.",
  "gathering.guide.two":
    "İlerledikçe ve yeterli kaynak topladıkça bölgenizi genişletme yeteneğinin kilidini açacaksınız. Arazinizi genişletmek Sunflower Land’de yeni ufuklar açar. Arazi genişletmeleri, ürün yetiştirmek için verimli topraklar, görkemli ağaçlar, değerli taş yatakları, değerli demir damarları, parıldayan altın yatakları, enfes meyve tarlaları ve çok daha fazlasını içeren bir kaynak hazinesini ortaya çıkarıyor.",
  "gathering.guide.three":
    "Kaynak toplamanın ve arazi genişletmenin çiftçilik yolculuğunuzun omurgası olduğunu unutmayın. Her adımla birlikte gelen zorlukları ve ödülleri kucaklayın ve Sunflower Land’de bol kaynaklar ve sonsuz olanaklarla gelişmesini izleyin.",

  "crops.guide.one":
    "Sunflower Land’de mahsuller refah yolculuğunuzda çok önemli bir rol oynar. Mahsul ekerek ve hasat ederek Coins kazanabilir veya bunları oyun içinde değerli tarifler ve öğeler oluşturmak için kullanabilirsiniz.",
  "crops.guide.two":
    "Mahsul yetiştirmek için ilgili tohumları oyun içi mağazadan satın almanız gerekir. Her mahsulün, Ayçiçekleri için sadece 1 dakikadan Kale için 36 saate kadar değişen farklı bir büyüme süresi vardır. Mahsuller tamamen büyüdüğünde, onları hasat edebilir ve ödülleri toplayabilirsiniz.",
  "crops.guide.three":
    "Unutmayın, arazinizi genişlettikçe ve oyunda ilerledikçe, daha fazla mahsul elde edilebilecek, bu da Coins kazanmak için daha büyük fırsatlar sunacak ve Sunflower Land'in tarım ekonomisinin geniş potansiyelini keşfetmenizi sağlayacak. Öyleyse ellerinizi kirletin, tohumları ekin ve başarıya giden yolda hasat yaparken mahsullerinizin gelişmesini izleyin!",

  "building.guide.one":
    "Sunflower Land’de  ilerledikçe mevcut çeşitli binaları keşfedin. Tavuk kümeslerinden atölyelere ve ötesine kadar her yapı, çiftliğinize benzersiz avantajlar getirir. Çiftçilik operasyonlarınızı kolaylaştırmak, verimliliği artırmak ve yeni olanakların kilidini açmak için bu binalardan yararlanın. Düzeninizi dikkatli bir şekilde planlayın ve Sunflower Land’de gelişen bir çiftlik kurmanın getirdiği ödüllerin tadını çıkarın.",
  "building.guide.two":
    "Sunflower Land'de binalar çiftçilik yolculuğunuzun temel taşıdır. Binalar menüsüne erişmek için Envanter simgesine tıklayın ve Binalar sekmesini seçin. İstediğiniz yapıyı seçin ve çiftlik ekranınıza dönün. Yeşille işaretlenmiş açık bir alan bulun ve yerleşimi onaylayın. Zamanlayıcının tamamlanmasını bekleyin; yeni binanız kullanıma hazır olacaktır. Binalar çeşitli avantajlar sağlar ve heyecan verici oyun özelliklerinin kilidini açar. Verimliliği en üst düzeye çıkarmak ve çiftçilik imparatorluğunuzun büyüyüp gelişmesini izlemek için bunları çiftliğinize stratejik olarak yerleştirin.",

  "cooking.guide.one":
    "Yemek pişirmek Bumpkin'inizi beslemenize ve değerli deneyim puanları (XP) kazanmalarına yardımcı olmanıza olanak tanır. Hasat ettiğiniz mahsulleri kullanarak yemek pişirmeye ayrılmış farklı binalarda lezzetli yemekler hazırlayabilirsiniz.",
  "cooking.guide.two":
    "Ateş Çukuru'ndan başlayarak, her çiftliğin en başından itibaren temel pişirme olanaklarına erişimi vardır. Ancak ilerledikçe, her biri daha geniş çeşitlilikte tarifler ve mutfak lezzetleri sunan Mutfak, Fırın, Şarküteri ve Smoothie Shack gibi daha gelişmiş binaların kilidini açabilirsiniz.",
  "cooking.guide.three":
    "Yemek pişirmek için bir bina seçin ve hazırlamak istediğiniz tarifi seçin. Tarif, gerekli malzemeler, tüketildiğinde kazanılan XP ve hazırlama süresi hakkında ayrıntılı bilgi verecektir. Pişirme işlemini başlattıktan sonra, yiyeceğin ne zaman toplanmaya hazır olacağını öğrenmek için zamanlayıcıya göz atın.",
  "cooking.guide.four":
    "Yiyecek hazır olduğunda, üzerine tıklayarak onu binadan alın ve envanterinize taşıyın. Buradan, çiftlikteki Bumpkin NPC'nizle etkileşime girebilir ve onlara hazırlanan yiyecekleri besleyerek XP kazanmalarına ve oyunda ilerlemelerine yardımcı olabilirsiniz.",
  "cooking.guide.five":
    "Farklı tarifler deneyin, yeni binaların kilidini açın ve Bumpkin'inizi beslerken yemek pişirmenin keyfini keşfedin ve Sunflower Land’de  lezzetli bir mutfak macerasına çıkın.",

  "animals.guide.one":
    "Sunflower Land’deki tavuklar, çeşitli tariflerde ve işçilikte kullanılabilecek bir yumurta kaynağı olarak hizmet ederek çiftliğinize hoş bir katkı sağlar. Tavuklarla başlamak için Bumpkin'in 9. seviyesine ulaşmanız ve Tavuk Evini inşa etmeniz gerekecek. Oradan tavuk satın alma veya sahip olduğunuz tavukları yerleştirme seçeneğiniz vardır. Tıpkı binaları yerleştirir gibi bunları çiftliğinize sürükleyip bırakmanız yeterlidir. Standart bir çiftlikte her Tavuk Kümesi 10'a kadar tavuğa ev sahipliği yapar ve Chicken Coop SFT'ye sahipseniz bu limit 15'e kadar çıkar.",
  "animals.guide.two":
    "Her tavuğun başının üstünde o anki ruh halini veya ihtiyaçlarını gösteren bir gösterge bulunur. Bu aç, yorgun, mutlu veya yumurtadan çıkmaya hazır olmak arasında değişebilir. Tavuklarınızın memnun ve üretken kalmasını sağlamak için envanterinizden buğday seçerek ve tavukla etkileşime girerek onları besleyin. Besleme, yumurtaların çatlamaya hazır hale gelmesi 48 saat süren yumurta zamanlayıcısını başlatır. Yumurtalar hazır olduğunda çiftliğinizi ziyaret edin, her tavuğun üzerindeki simgeyi kontrol edin ve yumurtadan çıkan yumurtanın türünü öğrenmek için onlarla etkileşime geçin. Bazen, daha hızlı yumurta üretimi, artan verim veya daha az yiyecek tüketimi gibi özel destekler sunan nadir mutant tavukları bile keşfedebilirsiniz.",
  "animals.guide.three":
    "Tavuklarınızı beslemek ve yumurtalarını toplamak Sunflower Land’de çiftliğinize dinamik ve ödüllendirici bir unsur katar. Tariflerle deneyler yapın, zanaat çalışmalarınızda yumurtalardan yararlanın ve nadir mutant tavuklarla gelen sürprizlerin tadını çıkarın. Başarılı bir kümes hayvanı işletmesi kurun ve Sunflower Land’deki tavukların büyüleyici dünyasını kucaklarken sıkı çalışmanızın meyvelerinden yararlanın.",

  "crafting.guide.one":
    "Sunflower Land’de NFT'ler üretmek, çiftçilik çıktınızı artırmanın ve ilerlemenizi hızlandırmanın çok önemli bir yönüdür. Bu özel öğeler, mahsul büyüme artışları, pişirme geliştirmeleri ve kaynak artışları gibi yolculuğunuzu büyük ölçüde hızlandırabilecek çeşitli bonuslar sağlar. Coins en üst düzeye çıkararak: tarım imparatorluğunuzu daha da kurmak için aletler üretebilir, kaynak toplayabilir ve arazinizi genişletebilirsiniz.",
  "crafting.guide.two":
    "Eşya yapımına başlamak için Sunfloria'da yetenekli bir zanaatkar olan Igor'u ziyaret edeceğiz. Tekneye atlayıp Sunfloria'ya vardıktan sonra Igor ile sohbet etmek için adanın tepesine gidin. Şu anda Ayçiçeklerinin, Patateslerin ve Balkabaklarının hızını artıran Temel Korkuluk sunuyor. Bu, kaynaklarınızı korkulukla değiştirmenizi gerektiren mükemmel bir anlaşma. Elde ettiğinizde ana adanıza dönün ve oyunun sağ üst köşesindeki beyaz el simgesine tıklayarak tasarım moduna girin.",
  "crafting.guide.three":
    "Tasarım modunda, çiftliğinizin düzenini optimize etmek ve görsel çekiciliğini artırmak için öğeleri stratejik olarak yerleştirebilir ve çiftliğinizdeki kaynakları yeniden düzenleyebilirsiniz. Bu adım, hazırlanmış ekipmanınızın etkinliğini en üst düzeye çıkarmak için çok önemlidir. Örneğin Korkuluğu artırmak istediğiniz arazilerin üzerine yerleştirin. Ayrıca arazinize çekicilik ve düzen katmak için dekorasyonlar satın almayı düşünün.",
  "crafting.guide.four":
    "Ekipman üreterek ve stratejik olarak yerleştirerek çiftçilik becerilerinizi geliştirebilir, gurur duyulacak bir ada evi yaratabilir ve Sunflower Land’deki ilerlemenizi hızlandırabilirsiniz.",

  "deliveries.guide.one":
    "Sunflower Land’deki teslimatlar, aç Goblinlere ve Bumpkins dostlarına yardım ederken ödüller kazanma konusunda heyecan verici bir fırsat sunuyor. Her gün ekranın sol alt kısmındaki teslimat panosuna tıklayarak sahip olduğunuz tüm siparişleri görebileceksiniz. Siparişler, Pumpkin Plaza civarında bulunabilen bazı yerel NPC'ler tarafından verilmiştir. Bir siparişi yerine getirmek için Pumpkin Plaza'ya tekneyle gitmeniz ve teslimatı bekleyen NPC'yi aramanız gerekecek. Onları bulduğunuzda, siparişi teslim etmek ve ödülünüzü almak için üzerlerine tıklayın.",
  "deliveries.guide.two":
    "Yeni bir oyuncu olarak üç sipariş yuvasıyla başlarsınız, ancak çiftliğinizi genişlettikçe ek yuvaların kilidini açarak ileri düzey oyuncuların daha fazla sipariş almasına olanak tanıyacaksınız. Her 24 saatte bir yeni siparişler geliyor ve tarım ürünlerinden yemek pişirmeye ve kaynak toplamaya kadar çeşitli görevler sunuyor. Siparişleri tamamlamak size Block Bucks, SFL, Coins, lezzetli pastalar ve diğer ödüller dahil olmak üzere dönüm noktası bonusları kazandıracak. Ödül sistemi isteğin zorluğuna dayalıdır; bu nedenle kazancınızı en üst düzeye çıkarmak için daha büyük ödüller sunan siparişlere öncelik vermeyi düşünün. Tahtaya göz kulak olun ve çeşitli siparişlerle kendinize meydan okuyun, seviye atlayın ve daha zorlu istekleri yerine getirmek için gerektiğinde yeni binaların kilidini açın.",
  "deliveries.intro": ENGLISH_TERMS["deliveries.intro"],
  "deliveries.new": ENGLISH_TERMS["deliveries.new"],
  "chores.intro": ENGLISH_TERMS["chores.intro"],

  "scavenger.guide.one":
    "Sunflower Land’de çöp toplamak, gizli hazineleri ortaya çıkarmak ve değerli kaynakları toplamak için heyecan verici fırsatlar sunar. Çöp toplamanın ilk yönü, korsan hazine avcısı olabileceğiniz Define Adası'nda hazine kazmaktır. Bir kum küreği üreterek ve Treasure Island'a giderek, ödül, dekorasyon ve hatta kullanışlı antik SFT'ler dahil olmak üzere çeşitli hazineleri ortaya çıkarmak için karanlık kumlu alanları kazabilirsiniz.",
  "scavenger.guide.two":
    "Başka bir temizleme şekli, çiftliğinizde ve çevredeki adalarda kendiliğinden ortaya çıkan yabani mantarların toplanmasını içerir. Bu mantarlar ücretsiz olarak toplanabilir ve tariflerde, görevlerde ve işçilik öğelerinde kullanılabilir. Çiftliğinizde maksimum 5 mantar olacak şekilde her 16 saatte bir yenilenen bu mantarlara dikkat edin. Araziniz doluysa çevredeki adalarda mantarlar ortaya çıkacak ve bu değerli kaynakları kaçırmamanızı sağlayacak.",

  "fruit.guide.one":
    "Meyve, Coins için satılabilen veya çeşitli tariflerde ve işçilikte kullanılabilen değerli bir kaynak olarak Sunflower Land’de önemli bir rol oynar. Mahsullerin aksine, meyve tarlaları her hasattan sonra birden çok kez yenilenebilme özelliğine sahiptir ve oyuncular için sürdürülebilir bir meyve kaynağı sağlar.",
  "fruit.guide.two":
    "Meyve yetiştirmek için çiftliğinizin 9-10'uncu genişlemesinde mevcut olacak daha büyük meyve tarlaları edinmeniz gerekir.",
  "fruit.guide.three":
    "Meyve yetiştirerek ve bunu çiftçilik stratejilerinize dahil ederek karınızı en üst düzeye çıkarabilir, lezzetli tarifler oluşturabilir ve Sunflower Land’de yeni olanakların kilidini açabilirsiniz.",

  "seasons.guide.one":
    "Sunflower Land’de sezonlar oyuna heyecan ve tazelik katarak oyunculara yeni zorluklar ve fırsatlar sunuyor. Her sezonun tanıtımıyla birlikte oyuncular çeşitli yeni işlenebilir öğeleri, sınırlı sayıda üretilen dekorasyonları, mutant hayvanları ve nadir hazineleri sabırsızlıkla bekleyebilirler. Bu sezonluk değişiklikler, dinamik ve gelişen bir oyun deneyimi yaratarak oyuncuları stratejilerini uyarlamaya ve çiftliklerinde yeni olasılıkları keşfetmeye teşvik ediyor. Buna ek olarak, sezonluk biletler oyuna stratejik bir unsur katıyor; çünkü oyuncuların, nadir öğeleri toplamak, daha yüksek tedarik dekorasyonlarını tercih etmek veya SFL için bilet alışverişi yapmak gibi biletlerini akıllıca nasıl dağıtacaklarına karar vermeleri gerekiyor. Sezonluk mekanik, oyunu ilgi çekici kılıyor ve Sunflower Land’de her zaman sabırsızlıkla beklenecek bir şeyler olmasını sağlıyor.",
  "seasons.guide.two":
    "Goblin Demircisinde mevsimlik eşyaların mevcudiyeti başka bir heyecan katıyor. Oyuncular bu sınırlı tedarikli eşyaları üretmek için gerekli kaynakları ve sezonluk biletleri toplamalı, böylece rekabet ve aciliyet hissi yaratılmalıdır. Oyuncular arz tükenmeden önce istedikleri eşyaları güvence altına almayı amaçladıklarından, ileriyi planlamak ve strateji oluşturmak çok önemli hale geliyor. Dahası, sezonluk biletleri Coins ile değiştirme seçeneği esneklik sağlar ve oyuncuların kendi özel oyun hedeflerine uygun seçimler yapmalarına olanak tanır. Her sezonun benzersiz teklifleri ve sürpriz etkinlik beklentisiyle Sunflower Land, oyuncuları yıl boyunca meşgul edip eğlendirerek canlı ve sürekli gelişen bir çiftçilik deneyimini teşvik ediyor.",
  "pete.teaser.one": "Ağaçları Kesin",
  "pete.teaser.three": "Ayçiçeklerini Hasat Edin",
  "pete.teaser.four": "Ayçiçeklerini Sat",
  "pete.teaser.five": "Tohum satın al",
  "pete.teaser.six": "Tohumleri Ek",
  "pete.teaser.seven": "Bir Korkuluk Yap",
  "pete.teaser.eight": "Yemek pişirin ve seviye atlayın",
};

const halveningCountdown: Record<HalveningCountdown, string> = {
  "halveningCountdown.approaching": "Yarılanma Yaklaşıyor!",
  "halveningCountdown.description":
    "Halving'de tüm mahsullerin ve belirli kaynakların fiyatları yarıya iner. Bu, SFL’ye ulaşmayı daha da zorlaştırır.",
  "halveningCountdown.preparation": "Hazır olduğunuzdan emin olun!",
  "halveningCountdown.title": "Yarınlanma",
};

const harvestBeeHive: Record<HarvestBeeHive, string> = {
  "harvestBeeHive.notPlaced": "Bu arı kovanı yerleştirilmemiş.",
  "harvestBeeHive.noHoney": "Bu arı kovanında bal yok.",
};

const harvestflower: Record<Harvestflower, string> = {
  "harvestflower.noFlowerBed": "Çiçek toprağı mevcut değil",
  "harvestflower.noFlower": "Çiçek toprağının çiçeği yok",
  "harvestflower.notReady": "Çiçek hasat edilmeye hazır değil",
  "harvestflower.alr.plant": "Çiçek zaten ekildi",
};

const hayseedHankPlaza: Record<HayseedHankPlaza, string> = {
  "hayseedHankPlaza.cannotCompleteChore": "Bu görevi tamamlayamıyor musunuz?",
  "hayseedHankPlaza.skipChore": "Görevi atla",
  "hayseedHankPlaza.canSkipIn": "Bu işi atlayabilirsiniz",
  "hayseedHankPlaza.wellDone": "Tebrikler",
  "hayseedHankPlaza.lendAHand": "El uzat?",
};

const hayseedHankV2: Record<HayseedHankV2, string> = {
  "hayseedHankv2.dialog1":
    "Pekala, selamlar genç çılgınlar! Ben Hayseed Hank, tecrübeli bir Bumpkin çiftçisiyim ve eski günlerdeki gibi toprakla ilgileniyorum.",
  "hayseedHankv2.dialog2": ENGLISH_TERMS["hayseedHankv2.dialog2"],
  "hayseedHankv2.action": "Hadi yapalım",
  "hayseedHankv2.title": "Hank'ın Günlük İşleri",
  "hayseedHankv2.newChoresAvailable": "Yeni işler mevcut ",
  "hayseedHankv2.skipChores": "Her yeni günde ev işlerini atlayabilirsiniz.",
  "hayseedHankv2.greeting":
    "Pekala, selamlar genç çılgınlar! Ben Hayseed Hank'im...",
};

const heliosSunflower: Record<HeliosSunflower, string> = {
  "heliosSunflower.title": "Ayçiçeği Clytie",
  "heliosSunflower.description":
    "Yalnızca gerçek kurtarıcı bu Ayçiçeğini geri getirip hasat edebilir.",
  "confirmation.craft": ENGLISH_TERMS["confirmation.craft"],
};

const helper: Record<Helper, string> = {
  "helper.highScore1": "İnanılmaz! İksir yapma sanatında ustalaşıyorsun!",
  "helper.highScore2": "Muhteşem! Becerileriniz bitkiye hayat veriyor!",
  "helper.highScore3": "Şaşırtıcı! Tesis uzmanlığınıza hayran!",
  "helper.midScore1":
    "Neredeyse! İksirinizin bitkiniz üzerinde olumlu bir etkisi oldu!",
  "helper.midScore2":
    "Aynen böyle devam! Bitki sizin becerikli karışımınız sayesinde gelişmeye başlıyor!",
  "helper.midScore3":
    "Güzel bir! İksirin bitki üzerinde büyüsünü göstermeye başlıyor!",
  "helper.lowScore1": "Oraya varmak. Bitki mutluluk belirtileri gösteriyor.",
  "helper.lowScore2": "Güzel çaba. İksirin bitkiye biraz neşe getirdi.",
  "helper.lowScore3":
    "Fena değil. Becerileriniz tesis üzerinde iyi bir izlenim bırakmaya başlıyor.",
  "helper.veryLowScore1":
    "Denemeye devam et. Bitki kararlılığınızı takdir ediyor.",
  "helper.veryLowScore2": "Oraya varıyorsun. Bitki ilerlemenizi görüyor.",
  "helper.veryLowScore3":
    "Tam olarak değil ama bitki bağlılığınızı hissediyor.",
  "helper.noScore1":
    "Oh hayır! Bitki, iiksirindeki bir şeyi küçümsüyor! Tekrar deneyin.",
  "helper.noScore2":
    "Hata! Bitki, iksirinizdeki bir şeyden geri tepiyor! Tekrar deneyin.",
  "helper.noScore3":
    "Uh-oh! İksirin içindeki bir şey bitki için tam bir fiyasko! Tekrar deneyin.",
};

const henHouseTerms: Record<HenHouseTerms, string> = {
  "henHouse.chickens": "Tavuklar",
  "henHouse.text.one": "Buğday ile besleyin ve yumurta toplayın",
  "henHouse.text.two": "Tembel Tavuk",
  "henHouse.text.three":
    "Yumurta toplamaya başlamak için tavuğunuzu araziye koyun!",
  "henHouse.text.four": "Çalışan Tavuk",
  "henHouse.text.five": "Zaten yerleştirildi ve çok çalışıyor!",
  "henHouse.text.six":
    "Daha fazla tavuk yetiştirmek için fazladan bir Tavuk Kümesi inşa edin",
};

const howToFarm: Record<HowToFarm, string> = {
  "howToFarm.title": "Nasıl Tarım Yapılır?",
  "howToFarm.stepOne": "1. Ürünleri hazır olduklarında hasat edin",
  "howToFarm.stepTwo": "2. Kasabayı ziyaret edin ve mağazaya tıklayın",
  "howToFarm.stepThree": "3. Coins için mağazada mahsul satın",
  "howToFarm.stepFour": "4. Coins'nizi kullanarak tohum satın alın",
  "howToFarm.stepFive": "5. Tohum ekin ve bekleyin",
};

const howToSync: Record<HowToSync, string> = {
  "howToSync.title": "Nasıl senkronize edilir?",
  "howToSync.description":
    "Tüm ilerlemeniz oyun sunucumuza kaydedilir. Tokenlarınızı, NFT'lerinizi ve kaynaklarınızı Polygon'a taşımak istediğinizde zincir üzerinde senkronizasyon yapmanız gerekecektir..",
  "howToSync.stepOne": "1. Menüyü açın",
  "howToSync.stepTwo": "2. 'Zincirde senkronize et'e tıklayın'",
};

const howToUpgrade: Record<HowToUpgrade, string> = {
  "howToUpgrade.title": "Nasıl yükseltilir?",
  "howToUpgrade.stepOne": "1. Tarlaları kapatan bir Goblin ile konuşun",
  "howToUpgrade.stepTwo": "2. Kasabayı ziyaret edin ve mutfağa tıklayın",
  "howToUpgrade.stepThree": "3. Goblinin istediği yemeği hazırlayın",
  "howToUpgrade.stepFour":
    "4. İşte! Yeni tarlalarınızın ve mahsullerinizin tadını çıkarın",
};

const interactableModals: Record<InteractableModals, string> = {
  "interactableModals.returnhome.message": "Eve dönmek ister misin?",
  "interactableModals.fatChicken.message":
    "Neden bu Bumpkins beni rahat bırakmıyor, sadece rahatlamak istiyorum.",
  "interactableModals.lazyBud.message": "Eeep! Çok yorgun.....",
  "interactableModals.bud.message":
    "Hmmm, o tomurcuğu rahat bıraksam iyi olur. Sahibinin onu aradığına eminim",
  "interactableModals.walrus.message":
    "Arrr varr! Ben balığımı alana kadar balık dükkanı açık değil.",
  "interactableModals.plazaBlueBook.message1":
    "Arayanları çağırmak için toprağın özünü toplamalıyız; toprağın beslediği balkabakları ve yeni başlangıçların vaadi olan yumurtalar.. ",
  "interactableModals.plazaBlueBook.message2":
    "Akşam karanlığı çökerken ve ay gümüşi ışıltısını saçarken, onların dikkatli gözlerini bir kez daha uyandırmayı umarak mütevazı hediyelerimizi sunuyoruz.",
  "interactableModals.plazaOrangeBook.message1":
    "Cesur savunucularımız yiğitçe savaştılar ama ne yazık ki büyük savaşı kaybettik ve Ay Arayıcıları bizi vatanımızdan sürdüler. Yine de umudumuzu koruyoruz, çünkü bir gün bir zamanlar bizim olanı geri alacağız.",
  "interactableModals.plazaOrangeBook.message2":
    "O zamana kadar Sunflower Land kalplerimizde ve hayallerimizde canlı tutacağız, muzaffer dönüşümüzü bekleyeceğiz.",
  "interactableModals.beachGreenBook.message1":
    "O imrenilen Red Snappers'ın peşindeyken beklenmedik bir değişiklik deneyin",
  "interactableModals.beachGreenBook.message2":
    "Elmaları Kırmızı Wiggler Yemi ile kullanın ve bu kızıl güzelliklerin adeta ağınıza sıçramasını izleyin.",
  "interactableModals.beachBlueBook.message1":
    "Shelly'ye söyleme ama Saw Sharks'ı sahile getirmeye çalışıyorum!",
  "interactableModals.beachBlueBook.message2":
    "Son zamanlarda farklı arkadaşlarla deneyler yapıyorum ama işe yarayan tek kişi Red Snapper.",
  "interactableModals.beachBlueBook.message3":
    "Bu okyanus avcıları bir Kızıl Balığı ziyafetinin kokusunu kilometrelerce öteden alabilirler, bu yüzden hücum etmeye başlarlarsa şaşırmayın. ",
  "interactableModals.beachOrangeBook.message1":
    "Yüzeyde parlak bir yüzgeç belirdi, gözlerime inanamadım!",
  "interactableModals.beachOrangeBook.message2":
    "Şans eseri Tango yanımdaydı, o benim şans tılsımım olmalı.",
  "interactableModals.plazaGreenBook.message1":
    "Bumpkins bu adaları kontrol ediyor ve biz goblinlere az iş ve hatta daha az yiyecek bırakıyor.",
  "interactableModals.plazaGreenBook.message2":
    "Eşitlik, kendimize ait diyebileceğimiz, yaşayabileceğimiz ve gelişebileceğimiz bir yer için çabalıyoruz",
  "interactableModals.fanArt1.message":
    "İlk Fan Art yarışmasının kazananı Palisman'ı tebrik ederiz",
  "interactableModals.fanArt2.message":
    "Şafak Kıran Partisi Hayran Sanatı yarışmasının galibi Vergelsxtn'i tebrik ederiz",
  "interactableModals.fanArt2.linkLabel": "Daha fazla göster",
  "interactableModals.fanArt3.message":
    "Güzel bir tablo için mükemmel bir yer. Bakalım bundan sonra buraya ne koyacaklar...",
  "interactableModals.clubhouseReward.message1":
    "Sabır dostum, ödüller geliyor...",
  "interactableModals.clubhouseReward.message2":
    "En son güncellemeler için Discord'da #bud-clubhouse'a katılın.",
  "interactableModals.plazaStatue.message":
    "Antik savaşın karanlık günlerinde kasabamızı Goblin sürüsüne karşı birleştiren sadık çiftçi Bumpkin Cesur Yürekli'nin onuruna.",
  "interactableModals.dawnBook1.message1":
    "Ailemiz yüzyıllardır Şafak Kıran Adası'nı korudu. Adanın zili olarak, karanlık yaratıklar evimizi tehdit ederken bile Kuzey'den gelen tehlikelere karşı uyardık.",
  "interactableModals.dawnBook1.message2":
    "Ailemiz, Kuzeyden yayılan karanlığa karşı ilk savunma hattı olarak duruyor ama ne yazık ki fedakarlıklarımız fark edilmiyor.",
  "interactableModals.dawnBook1.message3":
    "Bağlılığımızın kabul edildiği gün gelecek mi?",
  "interactableModals.dawnBook2.message1":
    "Patlıcanlar göründüklerinden daha fazlasıdır. Gölgeli yaratıkları cezbeden karanlık dış görünüşlerine rağmen yemeklerimize ışık getiriyorlar.",
  "interactableModals.dawnBook2.message2":
    "Izgarada pişirilmiş veya Bumpkin Ganoush'una püre haline getirilmiş, çok yönlülüğü eşsizdir. Gece gölgesi sebzeleri için zorluklar karşısında dayanıklılığımızın bir sembolüdür.",
  "interactableModals.dawnBook3.message1":
    "Sevgili günlük, Bumpkins'in gelişi bir umut ışığı getirdi.",
  "interactableModals.dawnBook3.message2":
    "Maceracıların ve gezginlerin bir araya geldiği ülke olan Sunfloria'ya kendi teknemi yönlendirebileceğim günü hayal ediyorum.",
  "interactableModals.dawnBook3.message3":
    "Bumpkins'in oradaki özel hazırlıklarına dair fısıltılar duydum; bu zorlu zamanlarda bir umut ışığı.",
  "interactableModals.dawnBook4.message1":
    "Gnomların cazibesi direnilemeyecek kadar güçlüydü.",
  "interactableModals.dawnBook4.message2":
    "Cadının talimatları zihnimde yankılanıyordu: 'Üçünü hizalayın, güç sizin olsun.'",
  "interactableModals.dawnBook4.message3":
    "Ne yazık ki patlıcan askerleri bile bu ayartmaya karşı kendilerini koruyamamışlar. Ama yılmayacağım. Bir gün, hak ettiğim güce sahip olacağım, öyle mi?",
  "interactableModals.timmyHome.message":
    "Gerçekten evimi keşfetmeni istiyorum ama annem bana yabancılarla konuşmamamı söyledi, belki de bu en iyisidir.",
  "interactableModals.windmill.message":
    "Ah, yel değirmenim tamirde, ben tamir ederken kimsenin etrafı gözetlemesine izin veremem, sonra tekrar gel.",
  "interactableModals.igorHome.message":
    "Kaybol! Ziyaretçileri, özellikle de senin gibi meraklıları kaldıracak havamda değilim!",
  "interactableModals.potionHouse.message1":
    "Dikkat et dostum, çılgın bilim adamı orada yaşıyor!",
  "interactableModals.potionHouse.message2":
    "Söylentiye göre kendileriyle birlikte mutant ürünler yetiştirecek Bumpkin çırakları arıyorlar.",
  "interactableModals.guildHouse.message":
    "Bekle Bumpkin! Lonca Evi'ne girmek istiyorsanız Bud'a ihtiyacınız var.",
  "interactableModals.guildHouse.budsCollection": "Opensea'de Buds Koleksiyonu",
  "interactableModals.bettyHome.message":
    "Ah tatlım, mahsullerimi ne kadar sevsem de evim özel bir alan, şu anda ziyaretçilere açık değil.",
  "interactableModals.bertHome.message":
    "Davetsiz misafirler! Nadir eşyalar ve sırlardan oluşan koleksiyonumun peşinde olmalılar, onları içeri alamam!",
  "interactableModals.beach.message1": "Sahile gittin mi?",
  "interactableModals.beach.message2":
    "Lüks hazinelerle dolu olduğu söyleniyor! Ne yazık ki inşaat halinde.",
  "interactableModals.castle.message":
    "Orada dur köylü! Kaleyi ziyaret etmene izin vermemin hiçbir yolu yok",
  "interactableModals.woodlands.message":
    "Ormanlık alanlara mı seyahat ediyorsunuz? Lezzetli mantarlar aldığınızdan emin olun!",
  "interactableModals.port.message":
    "Orada tut! Goblinler hâlâ limanı inşa ediyor. Yakında seyahate ve balık tutmaya hazır olacak.",
  "interactableModals.fanArt.winner": "Hayran çizimi kazananı",
};

const introPage: Record<IntroPage, string> = {
  "introPage.welcome": "İksir Odasına hoş geldin meraklı çırağım!",
  "introPage.description":
    "Ben Çılgın Bilim Adamı Bumpkin, botanik büyücülük dünyasındaki bu büyülü arayışta size yardımcı olmak için buradayım. Sunflower Land’de sırlarını açığa çıkarmaya hazır olun! Her deneme 1 SFL'ye mal olacaktır.",
  "introPage.mission":
    "Göreviniz: büyülü ızgarada doğru iksir kombinasyonunu çözmek.",
  "introPage.tip":
    "Unutmayın, ne kadar doğru iksir seçerseniz bitki o kadar mutlu olur ve nadir düşme şansınız artar!",
  "introPage.chaosPotion": "'Kaos' iksirine dikkat edin, ortalığı karıştırır!",
  "introPage.playButton": "Hadi oynayalım",
};

const islandName: Record<IslandName, string> = {
  "island.home": "Ev",
  "island.pumpkin.plaza": "Balkabağı Plazası",
  "island.beach": "Sahil",
  "island.kingdom": ENGLISH_TERMS["island.kingdom"],
  "island.woodlands": "Ormanlık Alanlar",
  "island.helios": "Helios",
  "island.goblin.retreat": "Goblin Retreat",
};

const islandNotFound: Record<IslandNotFound, string> = {
  "islandNotFound.message": "Hiçliğin ortasına indin!",
  "islandNotFound.takeMeHome": "Beni eve götür",
};

const islandupgrade: Record<Islandupgrade, string> = {
  "islandupgrade.confirmUpgrade":
    "Yeni bir adaya geçmek istediğinizden emin misiniz?",
  "islandupgrade.warning": ENGLISH_TERMS["islandupgrade.warning"],
  "islandupgrade.upgradeIsland": "Ada Yükseltmesi",
  "islandupgrade.newOpportunities":
    "Çiftliğinizi büyütmeniz için yeni kaynaklar ve fırsatlarla dolu egzotik bir ada sizi bekliyor.",
  "islandupgrade.confirmation":
    "Yükseltmek ister misiniz? Tüm eşyalarınızla birlikte küçük bir adada başlayacaksınız.",
  "islandupgrade.locked": "Kilitli",
  "islandupgrade.exploring": "Keşfet",
  "islandupgrade.welcomePetalParadise": "Petal Paradise'a hoş geldiniz!",
  "islandupgrade.welcomeDesertIsland":
    ENGLISH_TERMS["islandupgrade.welcomeDesertIsland"],
  "islandupgrade.itemsReturned":
    "Öğeleriniz güvenli bir şekilde envanterinize iade edildi.",
  "islandupgrade.notReadyExpandMore":
    ENGLISH_TERMS["islandupgrade.notReadyExpandMore"],
  "islandupgrade.exoticResourcesDescription":
    "Sunflower Land bu bölgesi egzotik kaynaklarıyla tanınır. Meyveleri, çiçekleri, arı kovanlarını ve nadir mineralleri keşfetmek için topraklarınızı genişletin!",
  "islandupgrade.desertResourcesDescription":
    ENGLISH_TERMS["islandupgrade.desertResourcesDescription"],
  "islandupgrade.requiredIsland": ENGLISH_TERMS["islandupgrade.requiredIsland"],
  "islandupgrade.otherIsland": ENGLISH_TERMS["islandupgrade.otherIsland"],
};

const landscapeTerms: Record<LandscapeTerms, string> = {
  "landscape.intro.one": "Hayalinizdeki adayı tasarlayın!",
  "landscape.intro.two":
    "Tasarım modunda öğeleri tutabilir, sürükleyebilir ve taşıyabilirsiniz.",
  "landscape.intro.three": "Nadir dekorasyonlar yapın",
  "landscape.intro.four": "Koleksiyon parçalarını göğsünüzden yerleştirin",
  "landscape.expansion.one":
    "Her arazi parçası, çiftçilik imparatorluğunuzu kurmanıza yardımcı olacak benzersiz kaynaklarla birlikte gelir!",
  "landscape.expansion.two": "Yakında daha fazla genişletme mevcut olacak...",
  "landscape.timerPopover": "Sonraki Genişleme",
  "landscape.dragMe": "Beni sürükle",
  "landscape.expansion.date": "7 Şubat'ta daha fazla genişletme mevcut olacak.",
  "landscape.great.work": "Harika iş çıkardın Bumpkin!",
};

const letsGo: Record<LetsGo, string> = {
  "letsGo.title": "Oyun zamanı!",
  "letsGo.description":
    "Betayı oynadığınız için teşekkürler! Hala oyun üzerinde çalışıyoruz ve erken aşamalardaki desteğiniz için teşekkür ederiz!",
  "letsGo.readMore": "Oyun hakkında daha fazlasını şuradan okuyabilirsiniz.",
  "letsGo.officialDocs": "resmi belgeler",
};

const levelUpMessages: Record<LevelUpMessages, string> = {
  "levelUp.2":
    "Yeehaw, 2. seviyeye ulaştın! Mahsuller botlarının içinde titriyor.",
  "levelUp.3": "3. seviye için tebrikler! Ot gibi büyüyorsun...",
  "levelUp.4":
    "4. seviye için tebrikler! Resmi olarak yeşil başparmağını aştın.",
  "levelUp.5":
    "Seviye 5 ve hala hayatta! Sıkı çalışmanız karşılığını veriyor...yoksa 'saman işi' mi demeliyiz?",
  "levelUp.6":
    "Vay, zaten 6. seviye mi oldun? Bir öküz kadar güçlü olmalısın. Veya en azından sabanınız öyle.",
  "levelUp.7":
    "7. seviyeye ulaştığınız için tebrikler! Çiftliğiniz mısır üretiyor.",
  "levelUp.8": "Seviye 8, harika iş! Başarı tohumlarını ekiyorsunuz.",
  "levelUp.9":
    "Dokuz dokuz, seviye 9! Hasatınız, becerileriniz kadar hızlı büyüyor.",
  "levelUp.10":
    "Seviye 10, çift haneli rakamlar! Çiftliğiniz o kadar güzel görünüyor ki tavuklar bile etkilendi.",
  "levelUp.11": "Seviye 11, yağmur yağdırıyorsun (yani su)!",
  "levelUp.12":
    "12. seviye için tebrikler! Çiftliğiniz gerçekten bir karakter geliştirmeye başlıyor.",
  "levelUp.13": "Şanslı seviye 13! Bu çiftçilik işini gerçekten öğreniyorsun.",
  "levelUp.14": "Seviye 14, ne kadar ilerleme kaydettiğiniz çok etkileyici!",
  "levelUp.15":
    "On beş ve gelişen! Çiftliğiniz her zamankinden daha iyi görünüyor.",
  "levelUp.16":
    "16. seviye için tebrikler! Çiftçilik becerileriniz gerçekten kök salıyor.",
  "levelUp.17": "Seviye 17, ne ekersen onu biçersin (ve iyi görünüyor!).",
  "levelUp.18": "On sekiz yaşındasın ve potansiyeli gelişiyor!",
  "levelUp.19":
    "19. seviye için tebrikler! Çiftliğiniz, becerileriniz kadar hızlı büyüyor.",
  "levelUp.20": "Seviye 20, mahsulün kreması sensin!",
  "levelUp.21": "Yirmi bir yaşındayım ve bir profesyonel gibi hasat yapıyorum!",
  "levelUp.22": "22. seviye için tebrikler! Çiftliğiniz başarıyla sürülüyor.",
  "levelUp.23": "Seviye 23, becerileriniz gerçekten gelişmeye başlıyor!",
  "levelUp.24": "24. seviyede gerçekten çiçek açıyorsun!",
  "levelUp.25": "Çeyrek yüzyıla damga vurdu! Güneş parlarken saman yapıyorsun.",
  "levelUp.26":
    "26. seviye için tebrikler! Bu çiftçilik işini gerçekten sağıyorsun.",
  "levelUp.27": "Seviye 27, sahada gerçekten öne çıkmaya başlıyorsunuz!",
  "levelUp.28": "Gerçekten 28. seviyede çıtayı yükseltiyorsun!",
  "levelUp.29":
    "29. seviye için tebrikler! Gerçekten bazı ciddi becerileri geliştiriyorsun.",
  "levelUp.30": "Seviye 30, artık gerçek bir çiftçisin!",
  "levelUp.31": "Otuz bir yaşındayım ve hâlâ güçleniyorum!",
  "levelUp.32": "32. seviye için tebrikler! Çiftliğiniz tamamen çiçek açıyor.",
  "levelUp.33": "Seviye 33, çiftçilik becerileriniz gerçekten gelişiyor!",
  "levelUp.34": "Gerçekten 34. seviyede filizleniyorsun!",
  "levelUp.35": "Seviye 35, çiftçiliğin çekici römorkusun!",
  "levelUp.36":
    "36. seviye için tebrikler! Çiftliğiniz gerçekten de başarı toplamaya başlıyor.",
  "levelUp.37": "Seviye 37, becerileriniz gerçekten ortaya çıkmaya başlıyor!",
  "levelUp.38": "Gerçekten başarının tohumlarını 38. seviyede ekiyorsunuz!",
  "levelUp.39":
    "39. seviye için tebrikler! Çiftliğiniz gerçekten olgunlaşmaya başlıyor.",
  "levelUp.40": "Seviye 40, sen bir hasat kahramanısın!",
  "levelUp.41": "Kırk bir yaşındayım ve hâlâ güçleniyorum!",
  "levelUp.42":
    "42. seviye için tebrikler! Çiftliğiniz ödülleri toplamaya başlıyor.",
  "levelUp.43": "Seviye 43, gerçekten bazı ciddi beceriler geliştiriyorsun.",
  "levelUp.44": "Gerçekten 44. seviyede başarı elde ediyorsunuz!",
  "levelUp.45": "Seviye 45, hasadın gerçek ustasısın!",
  "levelUp.46":
    "46. ​​seviye için tebrikler! Çiftçilik becerileriniz gerçekten meyve vermeye başlıyor.",
  "levelUp.47": "Seviye 47, gerçekten bir çiftçilik efsanesine dönüşüyorsun.",
  "levelUp.48": "48. seviyede gerçekten gelişiyorsun!",
  "levelUp.49":
    "49. seviye için tebrikler! Gerçekten sıkı çalışmanızın meyvelerini almaya başlıyorsunuz.",
  "levelUp.50": "100'ün yarısı! Artık gerçek bir çiftçilik profesyonelisin.",
  "levelUp.51": "Elli bir yaşındayım ve hala güçlüyüm!",
  "levelUp.52":
    "52. seviye için tebrikler! Çiftliğiniz gerçek bir sanat eseridir.",
  "levelUp.53": "Seviye 53, becerileriniz gerçekten kök salmaya başlıyor.",
  "levelUp.54": "54. seviyede gerçekten mutluluk hasadı yapıyorsunuz!",
  "levelUp.55":
    "Seviye 55, dikkate alınması gereken gerçek bir çiftçi gücüsünüz.",
  "levelUp.56":
    "56. seviye için tebrikler! Çiftliğiniz gerçekten çiçek açmaya başlıyor.",
  "levelUp.57":
    "Seviye 57, gerçekten bazı ciddi beceriler geliştirmeye başlıyorsunuz.",
  "levelUp.58": "Gerçekten başarının tohumlarını 58. seviyede ekiyorsunuz!",
  "levelUp.59": "59. seviye için tebrikler! Çiftliğiniz mahsulün kremasıdır.",
  "levelUp.60": "Seviye 60, gerçek bir çiftçilik süperstarısın!",
};

const loser: Record<Loser, string> = {
  "loser.unsuccess": "Başarısız oldun",
  "loser.longer": "Açık artırma artık mevcut değil",
  "loser.refund.one": "Geri ödeme",
};

const lostSunflorian: Record<LostSunflorian, string> = {
  "lostSunflorian.line1": "Babam beni buraya Helios'u yönetmem için gönderdi.",
  "lostSunflorian.line2":
    "Ne yazık ki bu Bumpkinler onları izlememden hoşlanmıyor.",
  "lostSunflorian.line3": "Sunfloria'ya dönmek için sabırsızlanıyorum.",
};

const megaStore: Record<MegaStore, string> = {
  "megaStore.message":
    "Mega Mağaza'ya hoş geldiniz! Bu ayın sınırlı ürünlerine göz atın. Bir şeyden hoşlanırsanız, zamanın derinliklerinde kaybolmadan önce onu yakaladığınızdan emin olun.",
  "megaStore.month.sale": "Bu ayın satışları",
  "megaStore.wearable":
    "Güzel tercih! Yeni giyilebilir cihazınız gardırobunuzda güvenle saklanır. Oradan onu kuşanabilirsin.",
  "megaStore.collectible":
    "Güzel tercih! Yeni koleksiyonunuz envanterinizde güvenle saklanır.",
  "megaStore.timeRemaining": ENGLISH_TERMS["megaStore.timeRemaining"], // "{{timeRemaining}} left!",
};

const milestoneMessages: Record<MilestoneMessages, string> = {
  "milestone.noviceAngler":
    "Tebrikler, Acemi Balıkçı dönüm noktasına ulaştınız! Temel balıkların her birini yakalayarak profesyonel bir balıkçı olma yolunda ilerliyorsunuz.",
  "milestone.advancedAngler":
    "Etkileyici, Gelişmiş Balıkçı dönüm noktasına ulaştınız! Her gelişmiş balığı yakalama sanatında ustalaştınız. Aynen böyle devam!",
  "milestone.expertAngler":
    "Vay be, Uzman Balıkçı dönüm noktasına ulaştınız! Artık gerçek bir balıkçılık uzmanısın! 300 balık yakalamak küçük bir başarı değil.",
  "milestone.fishEncyclopedia":
    "Tebrikler, Balık Ansiklopedisi dönüm noktasına ulaştınız! Gerçek bir balık uzmanı oldunuz! Temel, gelişmiş ve uzman balıkların her birini keşfetmek olağanüstü bir başarıdır.",
  "milestone.masterAngler":
    "Vay be, Usta Balıkçı dönüm noktasına ulaştınız! 1500 balık yakalamak balık tutma becerilerinizin bir kanıtıdır.",
  "milestone.marineMarvelMaster":
    "Tebrikler, Marine Marvel Master dönüm noktasına ulaştınız! Sen denizlerin tartışmasız şampiyonusun! Her bir Marvel'ı yakalamak, balıkçılık yeteneğinizi eşi benzeri olmayan bir şekilde kanıtlar.",
  "milestone.deepSeaDiver":
    "Tebrikler, Deep Sea Diver dönüm noktasına ulaştınız! Deniz Harikalarını kancanıza çeken gizemli bir Taç olan Derin Deniz Miğferini kazandınız.",
  "milestone.sunpetalSavant":
    "Tebrikler, Sunpetal Savant dönüm noktasına ulaştınız! Her Sunpetal çeşidini keşfettiniz. Sen gerçek bir Sunpetal uzmanısın!",
  "milestone.bloomBigShot":
    "Tebrikler, Bloom Big Shot dönüm noktasına ulaştınız! Bloom'un her çeşidini keşfettiniz. Sen gerçek bir Bloom uzmanısın!",
  "milestone.lilyLuminary":
    "Tebrikler, Lily Luminary dönüm noktasına ulaştınız! Her Lily çeşidini keşfettiniz. Sen gerçek bir Lily uzmanısın!",
};

const modalDescription: Record<ModalDescription, string> = {
  "modalDescription.friend": "Hey dostum!",
  "modalDescription.love.fruit":
    "Vay, sen de Meyveleri gerçekten benim kadar seviyorsun!",
  "modalDescription.gift":
    "Artık sana hediyem yok. Yeni eşyalarınızı giymeyi unutmayın!",
  "modalDescription.limited.abilities":
    "Meyve toplama becerilerinizi geliştirebilecek sınırlı sayıda giyilebilir ürünler tasarlıyorum",
  "modalDescription.trail":
    "Bu giysiyi denemek için özel meyve toplayıcıları arıyorum.... ÜCRETSİZ!",
};

const nftminting: Record<NFTMinting, string> = {
  "nftminting.mintAccountNFT": "NFT Darphane Hesabı",
  "nftminting.mintingYourNFT":
    "NFT'nizi üretin ve ilerlemeyi Blockchain'de depolayın",
  "nftminting.almostThere": "Neredeyse oradayız",
};

const noaccount: Record<Noaccount, string> = {
  "noaccount.newFarmer": "Yeni Çiftçi",
  "noaccount.addPromoCode": "Promosyon kodu eklensin mi?",
  "noaccount.alreadyHaveNFTFarm": "Zaten bir NFT çiftliğiniz var mı?",
  "noaccount.createFarm": "Çiftlik Oluştur",
  "noaccount.noFarmNFTs": "Herhangi bir çiftlik NFT'sine sahip değilsiniz.",
  "noaccount.createNewFarm": "Yeni çiftlik oluştur",
  "noaccount.selectNFTID": "NFT kimliğinizi seçin:",
  "noaccount.welcomeMessage":
    "Sunflower Land’de hoş geldiniz. Henüz bir çiftliğiniz yok gibi görünüyor.",
  "noaccount.promoCodeLabel": "Promosyon kodu",
  "noaccount.haveFarm": ENGLISH_TERMS["noaccount.haveFarm"],
  "noaccount.letsGo": ENGLISH_TERMS["noaccount.letsGo"],
};

const noBumpkin: Record<NoBumpkin, string> = {
  "noBumpkin.readyToFarm": "Harika, Bumpkin'iniz çiftçilik yapmaya hazır!",
  "noBumpkin.play": "Oyna",
  "noBumpkin.missingBumpkin": "Bumpkin'ini özlüyorsun",
  "noBumpkin.bumpkinNFT": "Bumpkin, Blockchain üzerinde üretilen bir NFT'dir.",
  "noBumpkin.bumpkinHelp":
    "Toprağınızı ekmenize, hasat etmenize, doğramanıza, madencilik yapmanıza ve genişletmenize yardımcı olacak bir Bumpkin'e ihtiyacınız var.",
  "noBumpkin.mintBumpkin": "OpenSea'den Bumpkin alabilirsiniz: ",
  "noBumpkin.allBumpkins": "Vay be, şu Bumpkinler’e bak!",
  "noBumpkin.chooseBumpkin": "Hangi Bumpkinle oynamak istersin?",
  "noBumpkin.deposit": "Deposit",
  "noBumpkin.advancedIsland":
    "Burası gelişmiş bir ada. Güçlü bir Bumpkin gerekli:",
  "dequipper.noBumpkins": "Bumpkin’in yok",
  "dequipper.missingBumpkins": "Cüzdanın herhangi bir Bumpking NFT’si yok.",
  "dequipper.intro": "Bumpkininden cüzdanına giyilebilir gönder.",
  "dequipper.success":
    "Tebrikler, giyilebilirler cüzdanınızda gönderildi. Kullanmak istediğinizde tekrar çiftliğine gönderin.",
  "dequipper.dequip": "Çıkart",
  "dequipper.warning":
    "Bir Bumpkin çıkarıldığında, bir daha hiçbir zaman kullanılamaz.",
  "dequipper.nude": "Bumpkin çoktan çıkarıldı.",
  "noBumpkin.nude": "Üzeri boş bir bumpkini çıkaramazsın.",
};

const notOnDiscordServer: Record<NotOnDiscordServer, string> = {
  "notOnDiscordServer.intro":
    "Görünüşe göre henüz Sunflower Land Discord Sunucusuna katılmadınız.",
  "notOnDiscordServer.joinDiscord": "Bize katılın ",
  "notOnDiscordServer.discordServer": "Discord Sunucusu",
  "notOnDiscordServer.completeVerification":
    "2. Doğrulamayı tamamlayın ve başlayın",
  "notOnDiscordServer.acceptRules":
    "3. #rules bölümündeki kuralları kabul edin",
};

const noTownCenter: Record<NoTownCenter, string> = {
  "noTownCenter.reward": "Ödül: 1 x Şehir Merkezi!",
  "noTownCenter.news": "En son haberleriniz veya açıklamalarınız burada.",
  "noTownCenter.townCenterPlacement":
    "Şehir Merkezini envanter > bina bölümünden yerleştirebilirsiniz.",
};

const npc_message: Record<NPC_MESSAGE, string> = {
  // Betty
  "npcMessages.betty.msg1":
    "Ah oğlum, taze ürünler almak için sabırsızlanıyorum!",
  "npcMessages.betty.msg2":
    "Yeni mahsuller deneyeceğim için çok heyecanlıyım, benim için neyin var?",
  "npcMessages.betty.msg3":
    "Bütün gün lezzetli meyveleri hasat etme fırsatını bekledim!",
  "npcMessages.betty.msg4":
    "Bugün ne tür mahsullerin hasada hazır olduğunu görmek için sabırsızlanıyorum.",
  "npcMessages.betty.msg5":
    "Emeğimin meyvesini tatmak için sabırsızlanıyorum, ne tür ürünleriniz var?",
  "npcMessages.betty.msg6":
    "Çiftçiliğe karşı gerçek bir tutkum var ve her zaman yetiştirmek için yeni ve ilginç mahsuller arıyorum.",
  "npcMessages.betty.msg7":
    "Bol miktarda ürün hasat etme hissi gibisi yoktur; çiftçilik budur!",
  // Blacksmith
  "npcMessages.blacksmith.msg1":
    "Son icadım için malzemeye ihtiyacım var, malzeme var mı?",
  "npcMessages.blacksmith.msg2":
    "Ham kaynak stoklamak istiyorum, satacak var mı?",
  "npcMessages.blacksmith.msg3":
    "Biraz el işi malzemesine ihtiyacım var, kullanabileceğim bir şey var mı?",
  "npcMessages.blacksmith.msg4":
    "Kullanabileceğim nadir veya benzersiz kaynaklarınız var mı?",
  "npcMessages.blacksmith.msg5":
    "Bazı yüksek kaliteli malzemeler almakla ilgileniyorum, elinizde ne var?",
  "npcMessages.blacksmith.msg6":
    "Bir sonraki projem için bazı materyaller arıyorum, önerebileceğiniz bir şey var mı?",
  "npcMessages.blacksmith.msg7":
    "Hammadde almak için pazardayım, satacak var mı?",
  // Pumpkin' pete
  "npcMessages.pumpkinpete.msg1": "Selam çaylak! Biraz taze ürüne ne dersiniz?",
  "npcMessages.pumpkinpete.msg2":
    "Lezzetli mahsuller var mı? Ben kolay seçim için senin adamınım!",
  "npcMessages.pumpkinpete.msg3":
    "Taze ve lezzetli, bu benim mottom. Neye sahipsin?",
  "npcMessages.pumpkinpete.msg4":
    "Şehre yeni gelen biri mi? Haydi biraz mahsulle gününüzü aydınlatalım!",
  "npcMessages.pumpkinpete.msg5":
    "Yardıma ihtiyacın var mı dostum? Sizin için çeşitli mahsullerim var!",
  "npcMessages.pumpkinpete.msg6": "Enerjik Pete, hizmetinizde! Mahsul var mı?",
  "npcMessages.pumpkinpete.msg7":
    "Plaza'ya hoş geldiniz! Haydi mahsullerle gününüzü aydınlatalım!",
  // Cornwell
  "npcMessages.cornwell.msg1":
    "Ah, eski güzel günler... Çok çalışmak benim düsturumdur. Elinde ne var?",
  "npcMessages.cornwell.msg2":
    "Bu gençlerin iş ahlakı yok! Bana zorlu şeyleri getir.",
  "npcMessages.cornwell.msg3":
    "Hatırlıyorum da... Sıkı çalışma, eksik olan şey bu!",
  "npcMessages.cornwell.msg4":
    "Zorlukla kazanılan bilgi en iyi hasatı hak eder. Beni etkile!",
  "npcMessages.cornwell.msg5":
    "Tarih ve sıkı çalışma, hepimizin meselesi bu. Seçiminiz hangisi?",
  "npcMessages.cornwell.msg6":
    "Adı Cornwell ve ben gerçek çiftlik deneyimi için buradayım.",
  "npcMessages.cornwell.msg7":
    "Zor görevler, zengin ödüller. Bana neye sahip olduğunu göster!",
  // Raven
  "npcMessages.raven.msg1":
    "Karanlık ve gizem benim oyunum. Zorlu mahsulleri alacağım.",
  "npcMessages.raven.msg2":
    "İçten içe gotik, iksirlerim için en koyu mahsullere ihtiyacım var.",
  "npcMessages.raven.msg3":
    "Doğaüstü ve uğursuz, peşinde olduğum ortam bu. Beni etkile.",
  "npcMessages.raven.msg4":
    "Büyü çalışmalarım için gölgeli hasadı arzuluyorum. Ver onları.",
  "npcMessages.raven.msg5":
    "Gölgelerde saklanan ekinleri bana getir. Hayal kırıklığına uğramayacağım.",
  "npcMessages.raven.msg6":
    "Karanlığın koruyucusu Raven, en zorlu mahsullerinizi istiyor.",
  "npcMessages.raven.msg7":
    "Gotik bir kalp için karanlık zevkler. Bana en karanlık hasadını göster.",
  // Bert
  "npcMessages.bert.msg1":
    "Dostum, bu mantarlar... onlar anahtar. Hiç sihirli olan var mı?",
  "npcMessages.bert.msg2":
    "Mantar çılgınlığı, bu benim. Sihirli mantarlar var mı?",
  "npcMessages.bert.msg3":
    "Her şey mantarlarla ilgili bebeğim. Büyülü olanları teslim edin.",
  "npcMessages.bert.msg4":
    "Bir şeyler görüyorum, biliyor musun? Sihirli mantarlar, ihtiyacım olan şey bu.",
  "npcMessages.bert.msg5":
    "Hayat bir yolculuktur dostum ve bu yolculuğa çıkmak için o sihirli mantarlara ihtiyacım var!",
  "npcMessages.bert.msg6":
    "Adı Bert, oyun ise mantarlar. Büyülü olanlar lütfen!",
  "npcMessages.bert.msg7":
    "Sihirli mantarlar dostum. Devam etmemi sağlayan şey bu.",
  // Timmy
  "npcMessages.timmy.msg1":
    "Kükreme! Ben ayı Timmy'yim! Bana tüm meyveli iyilikleri ver!",
  "npcMessages.timmy.msg2":
    "Ben bir ayıyım ve ayılar meyveyi sever! Benim için meyveli ikramların var mı?",
  "npcMessages.timmy.msg3":
    "Meyveli lezzetler, işin sırrı bu. Bu Timmy'ye ait bir şey, biliyor musun?",
  "npcMessages.timmy.msg4":
    "Meyveler için kucaklaşın! Bu Timmy'ye ait bir şey, biliyor musun?",
  "npcMessages.timmy.msg5":
    "Ayı kostümüyle hayat bir zevktir. Meyveler benim reçelim, var mı?",
  "npcMessages.timmy.msg6":
    "Ayı Timmy meyveli eğlence için burada! O meyveleri verin!",
  "npcMessages.timmy.msg7":
    "Bir ayıyla verimli sohbetler! Meyveli aşkı paylaşın!",
  // Tywin
  "npcMessages.tywin.msg1":
    "Altın, altın ve daha fazla altın! Bana zenginliği gösterin köylüler!",
  "npcMessages.tywin.msg2":
    "Aidatlarını ödediklerinden emin olmak için Bumpkins'e göz kulak oluyorum. Altın, hemen!",
  "npcMessages.tywin.msg3":
    "Köylüler, bana zenginliklerinizi getirin! Ben talepkar prens Tywin'im!",
  "npcMessages.tywin.msg4":
    "Balkabağı Plaza altımda ama altın asla yeterli değil. Daha fazla!",
  "npcMessages.tywin.msg5":
    "Bu bir prensin hayatı ve ben senin servetini istiyorum. Vergilerinizi ödeyin!",
  "npcMessages.tywin.msg6":
    "Bir prensin zenginliği sınır tanımaz. Altın, altın ve daha fazla altın!",
  "npcMessages.tywin.msg7":
    "Altın benim tacım ve hepsini istiyorum! Bana zenginliklerini getir!",
  // Tango
  "npcMessages.tango.msg1":
    "Tekrar konuşun, çiğneyin ve tekrar konuşun! Meyveler, meyveler ve daha fazla meyve!",
  "npcMessages.tango.msg2":
    "Ben meyveli sincap maymunu Tango'yum! Bana meyveli hazineler getir!",
  "npcMessages.tango.msg3":
    "Turuncu, arsız ve şakacı, işte bu benim. Meyve var mı?",
  "npcMessages.tango.msg4":
    "Meyve sırları? Onları yakaladım! Meyveli harikaları benimle paylaşın!",
  "npcMessages.tango.msg5":
    "Verimli yaramazlık ve meyveli lezzetler. Hadi biraz eğlenelim!",
  "npcMessages.tango.msg6":
    "Tango'nun adı, meyveli oyunlar benim şöhret iddiam. Ver bana!",
  "npcMessages.tango.msg7":
    "Meyve bilgisi ailemde var. Bana en verimli hikayelerini anlat!",
  // Miranda
  "npcMessages.miranda.msg1":
    "Benimle dans et dostum! Meyve tadındaki şapkama ekle, değil mi?",
  "npcMessages.miranda.msg2":
    "Samba ve meyveler el ele gider. Ne teklif edebilirsin?",
  "npcMessages.miranda.msg3":
    "Samba ritminde meyveler olmazsa olmazdır. Paylaşmak ister misin?",
  "npcMessages.miranda.msg4":
    "Her şey samba ritmi ve meyveli ikramlarla ilgili. Biraz buraya getir!",
  "npcMessages.miranda.msg5":
    "Şapkama meyve hediye ederek samba kutlamasına katılın!",
  "npcMessages.miranda.msg6":
    "Miranda'nın şapkası meyveli havayı seviyor. Ne katkıda bulunabilirsiniz?",
  "npcMessages.miranda.msg7":
    "Samba, meyveler ve dostluk. Bunu bir parti haline getirelim!",
  // Finn
  "npcMessages.finn.msg1":
    "Şimdiye kadarki en büyük yakalamayı yakaladım! Balık var mı?",
  "npcMessages.finn.msg2":
    "Hayat bir balıkçının hikayesidir ve benim anlatacak hikayelerim var. Biraz balığa sarıldım!",
  "npcMessages.finn.msg3":
    "Balıkçı, efsane ve balıklara fısıldayan Finn. Biraz balık mı yedin?",
  "npcMessages.finn.msg4":
    "Büyük balık, büyük hikayeler ve büyük bir ego. Balık hazinelerini bana getir!",
  "npcMessages.finn.msg5":
    "Kanca, çizgi ve hava, işte benim. Balık, ben bunu yapıyorum!",
  "npcMessages.finn.msg6":
    "Balık masalları, övünme hakları ve bir miktar tevazu. Balık lütfen!",
  "npcMessages.finn.msg7":
    "Surgeonfish'in portakalın lezzetli cazibesine karşı zaafı olduğunu biliyor muydunuz?",
  "npcMessages.finn.msg8":
    "Şimdiye kadarki en büyük balığı yakaladık. Bu sadece bir hikaye değil; bu gerçek!",
  // Findley
  "npcMessages.findley.msg1":
    "Finn'in tüm ihtişamı almasına izin vermemek! Büyük avım için yem ve dosta ihtiyacım var!",
  "npcMessages.findley.msg2":
    "Balık tutmayı bilen tek kişi Finn değil. Yem ve arkadaşa ihtiyacım var, stat!",
  "npcMessages.findley.msg3":
    "Finn'e gerçek balıkçının kim olduğunu göstereceğim! Yem ve ahbap, onlara sahip olmalıyım!",
  "npcMessages.findley.msg4":
    "Bir Tuna'yı mı bağlamak istiyorsunuz? Karnabaharın gevrek çekiciliğine karşı tuhaf bir düşkünlükleri var.",
  "npcMessages.findley.msg5":
    "Ailede kuşkulu rekabet vardır. Bir şeyi kanıtlamak için buradayım. Yem ve ahbap, lütfen!",
  "npcMessages.findley.msg6":
    "Balık tutma becerisine sahip olan tek kişi Finn değil. Hayatımın avını yakalamaya gidiyorum!",
  "npcMessages.findley.msg7":
    "Finn'le rekabet etmek şart. Yem ve dostum, yardımına ihtiyacım var!",
  "npcMessages.findley.msg8":
    "Balık tutma mücadelesindeki kardeşler. Yem ve ahbap benim gizli silahlarımdır!",
  "npcMessages.findley.msg9":
    "Mahi Mahi'nin mısırın tatlı çıtırtısına dayanamayacağını biliyor muydunuz?",
  // Corale
  "npcMessages.corale.msg1":
    "Okyanus çağırıyor ve balığa ihtiyacım var. Arkadaşlarımı serbest bırakmama yardım et!",
  "npcMessages.corale.msg2":
    "Balıklar benim dostlarım ve onları özgür bırakmalıyım. Bana yardım edecek misin?",
  "npcMessages.corale.msg3":
    "Deniz aşkına bana balık getir. Onları evlerine bırakacağım.",
  "npcMessages.corale.msg4":
    "Dalgaların altında dostlarım bekliyor. Balık tut ki özgürce yüzebilsinler!",
  "npcMessages.corale.msg5":
    "Bir denizkızının arkadaşlarını koruma isteği. Bana balık getir, nazik ruh.",
  "npcMessages.corale.msg6":
    "Balıkların özgürlüğü, bu benim görevim. Bana balık konusunda yardım edersin, değil mi?",
  "npcMessages.corale.msg7":
    "Denizin yaşam dansında bana katılın. Balık, arkadaşlarımı serbest bırak!",
  //Shelly
  "npcMessages.shelly.msg1":
    "Bumpkins ortadan kayboluyor ve bunun sebebinin Kraken olmasından korkuyorum. Dokunaçlarını toplamama yardım et!",
  "npcMessages.shelly.msg2":
    "Bumpkins ortadan kayboluyor ve Kraken'dan şüpheleniyorum. Dokunaçlarını getirir misin lütfen?",
  "npcMessages.shelly.msg3":
    "Kraken bir tehdit, Bumpkins kayıp. Onları güvende tutmak için dokunaçlarını getir.",
  "npcMessages.shelly.msg4":
    "Kraken uğursuz, Bumpkins gitti. Güvenlikleri için dokunaçlarını getirin.",
  "npcMessages.shelly.msg5":
    "Sahili korumak Kraken ile zordur. Bumpkins'i korumama yardım et, dokunaçlarını al.",
  "npcMessages.shelly.msg6":
    "Bumpkins'i korumak benim görevim ama Kraken beni endişelendiriyor. Onları korumak için dokunaçlarını alın.",
  "npcMessages.shelly.msg7":
    "Kraken paniğe neden oluyor, Bumpkins kayıp. Güvenlikleri için dokunaçlarını toplamama yardım et.",
  "npcMessages.shelly.msg8":
    "Bumpkins'in güvenliği benim en büyük önceliğim ve korkarım işin içinde Kraken var. Dokunaçlar fark yaratabilir!",
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
  "npc.Modal.Hammer":
    "Bumpkinlerin etrafında toplanın, müzayede başlamak üzere.",
  "npc.Modal.Marcus":
    "Hey! Evime girmene izin verilmiyor. Eşyalarıma dokunmaya cesaret etme!",
  "npc.Modal.Billy": "Merhaba millet! Adı Billy.",
  "npc.Modal.Billy.one":
    "Bu yavru fidanları buldum ama onlarla ne yapacağımı bilemiyorum.",
  "npc.Modal.Billy.two":
    "Eminim bunların plazanın etrafında beliren solucan tomurcuklarıyla bir ilgisi vardır.",
  "npc.Modal.Gabi": "Oh Bumpkin!",
  "npc.Modal.Gabi.one":
    "Yaratıcı görünüyorsun, oyuna sanatla katkıda bulunmayı hiç düşündün mü?",
  "npc.Modal.Craig": "Neden bana garip bakıyorsun?",
  "npc.Modal.Craig.one": "Dişlerimin arasında bir şey mi var?",
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
    "Ne istiyorsun? Hızlı konuşun; vakit nakittir.",
  "npcDialogues.blacksmith.intro2":
    "Seni atölyeme getiren ne? Meşgulüm, o yüzden çabuk ol.",
  "npcDialogues.blacksmith.intro3":
    "Mütevazı evime hoş geldiniz. Seni buraya ne getirdi?",
  "npcDialogues.blacksmith.intro4":
    "Amacınızı belirtin. Meşgulüm ve boş gevezelik için zamanım yok. Seni atölyeme getiren ne?",
  // Blacksmith Positive Delivery
  "npcDialogues.blacksmith.positiveDelivery1":
    "Nihayet! İhtiyacım olan malzemeleri getirdin. Kenara çekil; izin ver sihrimi çalıştırayım.",
  "npcDialogues.blacksmith.positiveDelivery2":
    "Ah, zamanı geldi! Tam olarak aradığım eşyaları aldınız. Hassas bir şekilde hazırlanmış ekipmanlara hazırlanın.",
  "npcDialogues.blacksmith.positiveDelivery3":
    "İyi. İhtiyacım olan malzemeleri teslim ettin. Hayal kırıklığına uğratmayacağım; yaratımlarım dikkat çekici olacak.",
  "npcDialogues.blacksmith.positiveDelivery4":
    "Etkileyici! Gerekli bileşenleri aldınız. Onları tarım harikalarına dönüştüreceğim!",
  "npcDialogues.blacksmith.positiveDelivery5":
    "Hmm, aslında istediğimi bulmayı başardın. Tebrikler.",
  // Blacksmith Negative Delivery
  "npcDialogues.blacksmith.negativeDelivery1":
    "İhtiyacım olan şey sende yok mu? Zaman boşa gidiyor. Gerekli olanı aldığında geri gel.",
  "npcDialogues.blacksmith.negativeDelivery2":
    "Hayır hayır hayır. Temel malzemelerden yoksunsunuz. Zamanımı boşa harcamayın. Hazır olduğunuzda geri dönün.",
  "npcDialogues.blacksmith.negativeDelivery3":
    "Kabul edilemez. Sen benim ihtiyacım olan şeye sahip değilsin. Beceriksizliğe zamanım yok. Yeteneğin olduğunda geri dön.",
  "npcDialogues.blacksmith.negativeDelivery4":
    "Tatmin edici değil. İhtiyacım olan şeye sahip değilsin. Pazarlığın size düşen kısmını yerine getirmeye hazır olduğunuzda geri gelin.",
  "npcDialogues.blacksmith.negativeDelivery5":
    "Beceriksizlik. Gerekli materyallerden yoksunsunuz. Vaktimi boşa harcamayın; hazır olduğunuzda geri dönün.",
  // Blacksmith NoOrder
  "npcDialogues.blacksmith.noOrder1":
    "Şu anda yerine getirmem gereken aktif bir sipariş yok, ancak aletlere ihtiyacınız varsa veya işçilik için malzemeleriniz varsa, size yardımcı olmak için her zaman buradayım. Konuşun ve işe koyulalım.",
  "npcDialogues.blacksmith.noOrder2":
    "Benden aktif bir emir yok, ancak sağlam bir ekipmana ihtiyacınız varsa veya şekil verilmesi gereken malzemeleriniz varsa, ustanızım.",
  // Betty Into
  "npcDialogues.betty.intro1":
    "Selam, gün ışığı! Piyasada yoğun bir gün oldu. Sipariş ettiğim malzemeleri alıp almadığınızı görmeye geldim. Onlar yanınızda mı?",
  "npcDialogues.betty.intro2":
    "Merhaba Merhaba! Sipariş ettiğim malzemelerin elinizde olup olmadığını görmek için bekliyordum. Onları getirdin mi?",
  "npcDialogues.betty.intro3":
    "Betty'nin pazarına hoş geldiniz! İhtiyacım olan malzemelerin sizde olup olmadığını kontrol etmeye hazır mısınız? Bakalım benim için neler hazırlayacaksın!",
  "npcDialogues.betty.intro4":
    "Selam, selam! Sipariş ettiğim malzemeleri getirip getirmediğinizi öğrenmek için sabırsızlanıyorum. Bana neye sahip olduğunu göster!",
  "npcDialogues.betty.intro5":
    "Selamlar yeşil başparmaklı arkadaşım! İstediğim malzemelerin elinizde olup olmadığını görmek beni heyecanlandırıyor. Sepetinizde neler var?",
  // Betty Positive Delivery
  "npcDialogues.betty.positiveDelivery1":
    "Yaşasın! Sipariş ettiğim malzemeleri getirmişsin. Olabildiğince taze ve canlıdırlar. Teşekkür ederim bahçecilik dahim!",
  "npcDialogues.betty.positiveDelivery2":
    "Ben de bundan bahsediyorum! Tam ihtiyacım olan malzemeleri aldın. Hızlı teslimatınızla günümü güzelleştirdiniz. Teşekkür ederim!",
  "npcDialogues.betty.positiveDelivery3":
    "Harika! Tam olarak istediğim malzemeler bunlar. Piyasa heyecanla hareketlenecek. Sıkı çalışman için teşekkürler!",
  "npcDialogues.betty.positiveDelivery4":
    "Ah, bahçem! Bu malzemeler kesinlikle mükemmel. En iyi ürünü bulma konusunda bir yeteneğiniz var. Teşekkür ederim yeşil başparmaklı kahramanım!",
  "npcDialogues.betty.positiveDelivery5":
    "Bravo! Tam ihtiyacım olan malzemeleri getirdin. Olağanüstü bir şey yaratmak için onları kullanmak için sabırsızlanıyorum. Hızlı teslimatınız için teşekkürler!",
  // Betty Negative Delivery
  "npcDialogues.betty.negativeDelivery1":
    "Oopsie-papatya! Görünüşe göre sipariş ettiğim malzemeler sende yok. Yine de endişelenmeyin. Aramaya devam edin, başka bir fırsat bulacağız.",
  "npcDialogues.betty.negativeDelivery2":
    "Oh hayır! Şu anda ihtiyacım olan malzemeler sende yok gibi görünüyor. Endişelenmeyin. Senin becerikliliğine inanıyorum. Aradığım şeyi aldığında geri gel!",
  "npcDialogues.betty.negativeDelivery3":
    "Ah, kahretsin! Görünüşe göre şu anda aradığım malzemeler sende yok. Yine de yiyecek aramaya devam edin! Belki bir dahaki sefere şansımız daha iyi olur.",
  "npcDialogues.betty.negativeDelivery4":
    "Ah, serseri! Görünüşe göre getirdiğin malzemeler benim ihtiyacım olanlarla eşleşmiyor. Ama cesaretinizi kaybetmeyin; çalışmaya devam et ve yakında geri dön.",
  "npcDialogues.betty.negativeDelivery5":
    "Ah, aslanağzılar! Görünüşe göre aradığım malzemeler tam olarak sende yok. Ama endişelenme dostum. Sıkı çalışmaya devam edin, onları bulduğunuzda kutlayacağız!",
  // Betty NoOrder
  "npcDialogues.betty.noOrder1":
    "Şu anda yerine getirmem gereken aktif bir emir yok ama bu sana en iyi tohumları ve mahsulleri sunmaktan beni alıkoyamaz. Hemen yukarı çıkın ve piyasada ne için olduğunuzu görelim!",
  "npcDialogues.betty.noOrder2":
    "Bugün benden belirli bir emir gelmedi ama bu sorun değil. Size en iyi tohumları sağlamaya ve enfes mahsullerinizi satın almaya hazır bir adımla buradayım!",
  // Grimbly Intro
  "npcDialogues.grimbly.intro1":
    "Aç. Yiyecek lazım. Aç bir goblin için lezzetli bir şeyin var mı?",
  "npcDialogues.grimbly.intro2":
    "Aç goblinin beslenmeye ihtiyacı var. İhtiyacım olan şey var mı?",
  "npcDialogues.grimbly.intro3":
    "Burada açlıktan ölmek üzere olan bir goblin var. Yiyebileceğim enfes bir şey var mı?",
  "npcDialogues.grimbly.intro4":
    "Grimbly aç. Benim için lezzetli bir şey mi getirdin?",
  // Grimbly Positive Delivery
  "npcDialogues.grimbly.positiveDelivery1":
    "Sonunda! Açlığımı tatmin edecek lezzetli bir şey. Sen bir cankurtaransın dostum!",
  "npcDialogues.grimbly.positiveDelivery2":
    "Yiyecek getirdin! Grimbly'nin açlığı yatıştı. Teşekkür ederim teşekkür ederim!",
  "npcDialogues.grimbly.positiveDelivery3":
    "Yaşasın! Aç karnımı doyurmak için bana yemek getirdin. Grimbly cömertliğini takdir ediyor!",
  "npcDialogues.grimbly.positiveDelivery4":
    "Grimbly için bir ziyafet! Bana tam olarak ihtiyacım olanı getirdin. İyiliğiniz unutulmayacak!",
  // Grimbly Negative Delivery
  "npcDialogues.grimbly.negativeDelivery1":
    "Yemek yok? Acımasızca hâlâ aç. Yiyecek bul, yiyecek getir. Acı bir şekilde minnettarım.",
  "npcDialogues.grimbly.negativeDelivery2":
    "Grimbly'ye yiyecek yok mu? Grimbly'nin karnı guruldadı. Lezzetli bir şey bulduğunda tekrar gel.",
  "npcDialogues.grimbly.negativeDelivery3":
    "Acımasızca hâlâ aç. Yemek yok? Aramaya devam et, belki bir dahaki sefere goblin iştahımı tatmin edersin.",
  "npcDialogues.grimbly.negativeDelivery4":
    "Eli boş mu? Grimbly'nin midesi guruldadı. Aramaya devam edin ve bir goblinin açlığını unutmayın!",
  // Grimbly NoOrder
  "npcDialogues.grimbly.noOrder1":
    "Grimbly'nin senin için aktif bir emri yok ama bu aç olmadığım anlamına gelmez!",
  "npcDialogues.grimbly.noOrder2":
    "Bugün Grimbly'den aktif bir emir yok ama korkmayın! Her zaman lezzetli ikramların peşindeyim. Lezzetli bir şey bulursan onu kime getireceğini biliyorsun!",
  // Grimtootk Intro
  "npcDialogues.grimtooth.intro1": "Selamlar yorgun gezgin. Beni mi arıyorsun?",
  "npcDialogues.grimtooth.intro2":
    "Gölgeler diyarına adım atın. Siparişimi yerine getirdin mi?",
  "npcDialogues.grimtooth.intro3":
    "Mistik diyarıma hoş geldin gezgin. İhtiyacım olan şey sende var mı?",
  "npcDialogues.grimtooth.intro4":
    "İçeri adım atın sevgili gezgin ve biriktirdiğim sırları ortaya çıkarın. İstediğimi buldun mu?",
  // Grimtooth Positive Delivery
  "npcDialogues.grimtooth.positiveDelivery1":
    "İnanılmaz! İhtiyacım olan malzemeleri buldun. Sunflorea'nın büyüsü parmaklarınızın ucunda!",
  "npcDialogues.grimtooth.positiveDelivery2":
    "Muhteşem! Aradığımı elde ettin. Birlikte büyünün en derin derinliklerine dalacağız!",
  "npcDialogues.grimtooth.positiveDelivery3":
    "İnanılmaz! İhtiyacım olan mistik bileşenleri topladın. Sihir diyarındaki yolculuğunuz başlıyor!",
  "npcDialogues.grimtooth.positiveDelivery4":
    "Ah, muhteşem! Aradığım bulunması zor malzemeleri elde ettin. Sihir diyarındaki yolculuğunuz başlıyor!",
  // Grimtooth Negative Delivery
  "npcDialogues.grimtooth.negativeDelivery1":
    "Ne yazık ki gerekli malzemeler elinizden kaçıyor. Yine de korkmayın. Aramaya devam edin, gizemler ortaya çıkacak!",
  "npcDialogues.grimtooth.negativeDelivery2":
    "Ah, karanlık ve dehşet. İhtiyacım olan şeye sahip değilsin. Ama endişelenmeyin; çalışmaya devam edin, gölgeler size rehberlik etmeye devam edecektir.",
  "npcDialogues.grimtooth.negativeDelivery3":
    "Yine de korkmayın. Çalışmanıza devam edin, sihir ortaya çıkacak.",
  "npcDialogues.grimtooth.negativeDelivery4":
    "Ne yazık ki. İhtiyacım olan şeye sahip değilsin. Bunu yaptığında geri dön.",
  // Grimtooth NoOrder
  "npcDialogues.grimtooth.noOrder1":
    "Şu anda GrimTooth'tan aktif bir emir yok ama endişelenmeyin. Mükemmel bir işçiliğe ihtiyacınız varsa veya üzerinde çalışabileceğim malzemeleriniz varsa, yaratmaya hazır olarak burada olacağım.",
  "npcDialogues.grimtooth.noOrder2":
    "GrimTooth ile yerine getirmeniz gereken aktif bir sipariş yok, ancak usta bir zanaatkarın dokunuşuna ihtiyacınız varsa veya dönüştürülmesi gereken malzemeleriniz varsa, hizmetinizdeyim.",
  // Old Salty Intro
  "npcDialogues.oldSalty.intro1":
    "Ahhh, hoş geldin canım! Adı Eski Salty ve hazine benim oyunum. Aradığım şey sende var mı?",
  "npcDialogues.oldSalty.intro2":
    "Hey, kara hırsızı! İhtiyar Salty aradığınız hazine tutkunu. Bana arayışında ne bulduğunu göster?",
  "npcDialogues.oldSalty.intro3": "",
  // Old Salty Positive Delivery
  "npcDialogues.oldSalty.positiveDelivery1":
    "Arghhhh, aradığım hazineyi buldun. Sende gerçek bir maceracının kalbi var dostum!",
  "npcDialogues.oldSalty.positiveDelivery2":
    "Dur! Old Salty'nin arzuladığı hazineyi getirdin. Bana saygı kazandırıyorsun, canım!",
  "npcDialogues.oldSalty.positiveDelivery3":
    "Hey, İhtiyar Salty'nin aradığı hazineyi buldun. Bu sularda gerçek bir efsane ol canım!",
  //  Old Salty Negative Delivery
  "npcDialogues.oldSalty.negativeDelivery1":
    "Arrrr, Old Salty için hazine yok mu? Gözlerini dört aç canım. Gizli mücevherler keşfedilmeyi bekliyor!",
  "npcDialogues.oldSalty.negativeDelivery2":
    "Ah, pislik! Old Salty'nin hazinesi yok mu? Aramaya devam edin, aradığınız zenginlikleri bulacaksınız!",
  "npcDialogues.oldSalty.negativeDelivery3":
    "Bana odun kes! Old Salty'nin hazinesi yok mu? Yelken açmaya devam et dostum. Ganimet orada, seni bekliyor!",
  // Old Salty NoOrder
  "npcDialogues.oldSalty.noOrder1":
    "Eski Salty'nin hazine koyu için aktif bir emir yok canım ama bu yaşanacak bir macera olmadığı anlamına gelmez. Gizli hazineler ve keşfedilmemiş sular için gözlerinizi dört açın!",
  "npcDialogues.oldSalty.noOrder2":
    "Şu anda Old Salty'de arayabileceğin özel bir hazine yok ama endişelenme, yürekli denizcim! Açık denizler keşfedilmeyi bekleyen sayısız zenginliği barındırıyor.",
  // Raven Intro
  "npcDialogues.raven.intro1":
    "Mütevazı evime hoş geldiniz. Nereye bastığınıza dikkat edin; hazırlanan iksirler var. Sipariş ettiğim şeyi aldın mı?",
  "npcDialogues.raven.intro2":
    "Gölgeler diyarına adım atın. Bilgeliği arayın, büyüyü bulun. İhtiyacım olan şey sende var mı?",
  "npcDialogues.raven.intro3":
    "Mistik diyarıma hoş geldin gezgin. Büyülü bir şey mi arıyorsunuz? Yoksa ihtiyacım olan şey sende mi?",
  "npcDialogues.raven.intro4":
    "İçeri girin sevgili gezgin. Gölgeler sana rehberlik edecek. Aradığımı buldun mu?",
  // Raven Positive Delivery
  "npcDialogues.raven.positiveDelivery1":
    "İnanılmaz! İhtiyacım olan malzemeleri buldun. Sunflorea'nın büyüsü parmaklarınızın ucunda!",
  "npcDialogues.raven.positiveDelivery2":
    "Muhteşem! Aradığımı elde ettin. Birlikte büyünün en derin derinliklerine dalacağız!",
  "npcDialogues.raven.positiveDelivery3":
    "İnanılmaz! İhtiyacım olan mistik bileşenleri topladın. Sihir diyarındaki yolculuğunuz başlıyor!",
  "npcDialogues.raven.positiveDelivery4":
    "Ah, muhteşem! Aradığım bulunması zor malzemeleri elde ettin. Sihir diyarındaki yolculuğunuz başlıyor!",
  // Raven Negative Delivery
  "npcDialogues.raven.negativeDelivery1":
    "Ne yazık ki gerekli malzemeler elinizden kaçıyor. Yine de korkmayın. Aramaya devam edin, gizemler ortaya çıkacak!",
  "npcDialogues.raven.negativeDelivery2":
    "Ah, karanlık ve dehşet. İhtiyacım olan şeye sahip değilsin. Ama endişelenmeyin; gölgeler seni ona yönlendirecek.",
  "npcDialogues.raven.negativeDelivery3":
    "Yine de korkmayın. Arayışınıza devam edin, sihir ortaya çıkacak.",
  // Raven NoOrder
  "npcDialogues.raven.noOrder1":
    "Görünüşe göre benim karanlık alanıma gelişinizi bekleyen aktif bir düzen yok. Ancak, rehberlik almak isterseniz veya mistik sanatlarla ilgili sorularınız varsa sormaktan çekinmeyin.",
  "npcDialogues.raven.noOrder2":
    "Benden aktif bir emir yok gezgin. Ama endişelenme! Gölgeler her zaman tetikte ve zamanı geldiğinde birlikte büyünün derinliklerine dalacağız.",
  // Tywin Intro
  "npcDialogues.tywin.intro1":
    "Ah, varlığımı şereflendiren başka bir halktan biri. İstediğim şey sende var mı? Çabuk konuş.",
  "npcDialogues.tywin.intro2":
    "Harika, köylülerden bir tane daha. Benim itibarımdaki biriyle işin ne? İhtiyacım olan şey sende var mı?",
  "npcDialogues.tywin.intro3":
    "Selamlar halktan. Bilgelik mi arıyorsunuz? İstediğim her şey sende var mı?",
  "npcDialogues.tywin.intro4":
    "Ne istiyorsun? Hızlı konuşun; vakit nakittir. İhtiyacım olan şey sende var sanırım?",
  // Tywin Positive Delivery
  "npcDialogues.tywin.positiveDelivery1":
    "Hmm, görünüşe göre tamamen işe yaramaz değilsin. İstediğimi getirmeyi başardın. Devam et köylü!",
  "npcDialogues.tywin.positiveDelivery2":
    "Şaşırtıcı bir şekilde, aslında istediğimi yerine getirdin. Belki de sandığım kadar işe yaramaz değilsindir.",
  "npcDialogues.tywin.positiveDelivery3":
    "Ah, harika iş! İhtiyacım olan malzemeleri getirdin. Birlikte başyapıtlar yaratacağız!",
  "npcDialogues.tywin.positiveDelivery4":
    "İyi. İhtiyacım olan malzemeleri teslim ettin. Igor hayal kırıklığına uğratmayacaktır; araçlar dikkat çekici olacak.",
  // Tywin Negative Delivery
  "npcDialogues.tywin.negativeDelivery1":
    "Acınası. Sende istediğim şey yok. Beceriksizliğinizle zamanımı harcamayın. Ayrılmak!",
  "npcDialogues.tywin.negativeDelivery2":
    "Ne bir hayal kırıklığı. Sende istediğim şey yok. Türünüzün tipik bir örneği. Şimdi defol!",
  "npcDialogues.tywin.negativeDelivery3":
    "Tatmin edici değil. Sen benim ihtiyacım olan şeye sahip değilsin. Beceriksizliğe zamanım yok. Yeteneğin olduğunda geri dön.",
  "npcDialogues.tywin.negativeDelivery4":
    "Beceriksizlik. Gerekli materyallerden yoksunsunuz. Vaktimi boşa harcamayın; hazır olduğunuzda geri dönün.",
  // Tywin NoOrder
  "npcDialogues.tywin.noOrder1":
    "Ah, görünüşe göre senin için aktif bir emrim yok halktan. Ama eğer saygıdeğer varlığıma ihtiyacınız varsa ya da bir isteğiniz varsa, hemen söyleyin. Sonuçta vakit paradır.",
  "npcDialogues.tywin.noOrder2":
    "Bugün senin için aktif bir emir yok köylü. Ancak dikkatimi çekecek bir şeyle karşılaşırsanız veya uzmanlığıma ihtiyaç duyarsanız beni nerede bulacağınızı biliyorsunuz.",
  //Bert Intro
  "npcDialogues.bert.intro1":
    "Sst! Gizemin keşfetmenin araştırmacısı! Sunflorea'nın geniş sırları çok çeşitlidir...",
  "npcDialogues.bert.intro2":
    "Ah, ruh eşim! Sunflorea sayısız hazineye ev sahipliği yapıyor...",
  "npcDialogues.bert.intro3":
    "Selam, gizemin taşıyıcısı! Sunflorea'da bazı eşyalar Teslimat gerektirir...",
  "npcDialogues.bert.intro4":
    "Merhaba, gizli arayıcısı! Sunflorea'nın büyüleri ikiye ayrılabilir...",
  "bert.day": ENGLISH_TERMS["bert.day"],

  // Bert Positive Delivery
  "npcDialogues.bert.positiveDelivery1":
    "İnanılmaz! Bana gereken her şeyi getirdin...",
  "npcDialogues.bert.positiveDelivery2":
    "Oh, büyüleyici buluş! Tam olarak aradığım şeyi getirdin...",
  "npcDialogues.bert.positiveDelivery3":
    "Ah, tam zamanında! Tam olarak ihtiyacım olan şeyleri edindiniz. Mükemmel!",
  "npcDialogues.bert.positiveDelivery4":
    "Etkileyici! Sunflorea'nın sırlarını ortaya çıkarmak için tam olarak ihtiyacım olanı getirdiniz.",

  // Bert Negative Delivery
  "npcDialogues.bert.negativeDelivery1":
    "Oh, ne yazık ki. Aradığımı elinde bulundurmadın. Keşfetmeye devam et, ihtiyacım olanı bulduğunda seni göreceğim!",
  "npcDialogues.bert.negativeDelivery2":
    "Pekala! Sahip olduğun şey tam olarak aradığım şey değil. Siparişim üzerinde çalışmaya devam et, birlikte sırları çözeceğiz!",
  "npcDialogues.bert.negativeDelivery3":
    "Hmm, beklentilerime tam olarak uymuyor. Ama korkma! İhtiyacım olanı alman için hala zaman var.",
  "npcDialogues.bert.negativeDelivery4":
    "Oh, tam olarak ne aradığım değil. Onu bulduğunda geri dön. Ama gözlerini açık tut; tarih sayfalarının daha fazlası ortaya çıkar.",

  // Bert NoOrder
  "npcDialogues.bert.noOrder1":
    "Bugün yerine getireceğim aktif bir sipariş yok, ama bu, paylaşacak ilginç sırlarımın olmadığı anlamına gelmiyor.",
  "npcDialogues.bert.noOrder2":
    "Şu anda Bert ile keşfedilecek gizemli bir sanat eseri yok, ama bu, garip gerçeklerim ve gizli doğrularımın az olduğu anlamına gelmez.",

  // Timmy Intro
  "npcDialogues.timmy.intro1":
    "Merhaba dostum! Ben Timmy, acaba istediğim şeyi buldun mu?",
  "npcDialogues.timmy.intro2":
    "Selamlar, yol arkadaşı! Burada Timmy var, acaba istediğim şeyi buldun mu?",
  "npcDialogues.timmy.intro3":
    "Hoş geldiniz, hoş geldiniz! Ben Timmy, meydandaki en dost canlısı yüz. Bana ihtiyacım olanı kontrol ederek yardımcı olabilir misiniz?",
  "npcDialogues.timmy.intro4":
    "Hey, hey! Güneşte eğlenceye hazır mısınız? Ben Timmy, ve istediğim şeyi bulduğunuzu görmek için sabırsızlanıyorum.",
  "npcDialogues.timmy.intro5":
    "Merhaba, güneş ışığı! Timmy burada, umarım istediğim şeyi bulmuşsunuzdur. Görelim bakalım?",

  // Timmy Positive Delivery
  "npcDialogues.timmy.positiveDelivery1":
    "Yaşasın! Tam olarak ihtiyacım olan şeyi getirdiniz. Cömertliğiniz kalbimi sevinçle dolduruyor. Teşekkürler!",
  "npcDialogues.timmy.positiveDelivery2":
    "İşte bu konuşmak istediğim şey! Tam olarak aradığımı getirdiniz. Sen bir süperstarsın!",
  "npcDialogues.timmy.positiveDelivery3":
    "Oh, harika! Zamanlamanız daha iyi olamazdı. Düşünceli teklifinizle günümü aydınlattınız. Teşekkür ederim!",
  "npcDialogues.timmy.positiveDelivery4":
    "Hooray! Malzemeleri teslim ettiniz. Sunflorea'nın senin gibi muhteşem birini olması şanslı!",
  "npcDialogues.timmy.positiveDelivery5":
    "Yine yaptınız! Nezaketiniz ve cömertliğiniz beni her zaman şaşırtıyor. Meydanı aydınlatmanız için teşekkür ederim!",

  // Timmy Negative Delivery
  "npcDialogues.timmy.negativeDelivery1":
    "Hoppala! Görünüşe göre aradığımı bulamadın. Endişelenme, ancak inanıyorum. Bulduğunda geri gel!",
  "npcDialogues.timmy.negativeDelivery2":
    "Oh, hayır! Şu anda ihtiyacım olanı bulunmuyor gibi görünüyor. Ancak endişelenme, sana inanıyorum. Bulduğunda geri gel!",
  "npcDialogues.timmy.negativeDelivery3":
    "Ah, pekala! Şu anda ihtiyacım olanı bulamadın. Ancak endişelenme! Belki bir dahaki sefere ihtiyacım olanı tesadüfen bulursun.",
  "npcDialogues.timmy.negativeDelivery4":
    "Oh, yazık! Şu anda aradığım ögeyi bulamadın. Ama üzülme; yeni fırsatlar",
  "npcDialogues.timmy.negativeDelivery5":
    "Oh, süsen çiçekleri! Aradığımı bulamadınız. Ama endişelenme, dostum. Keşfetmeye devam et, bulduğunda kutlayacağız!",

  // Timmy NoOrder
  "npcDialogues.timmy.noOrder1":
    "Oh, merhaba! Şu anda sizin için aktif bir siparişim yok, ama her zaman öğrenmeye ve hikayeler dinlemeye istekliyim. Sunflorea'daki maceralarınızdan heyecan verici hikayeleriniz var mı? Belki yeni bir ayı arkadaşı edindiniz? Benimle paylaş!",
  "npcDialogues.timmy.noOrder2":
    "Şu anda yerine getireceğim belirli bir siparişim yok, ama bu benim meraklı olmamı engellemeyecek! Seyahatlerinizle ilgili ilginç hikayeleriniz var mı? Belki nadir bir ayıyla karşılaştınız veya Sunflorea'da gizli bir cevher keşfettiniz? Konuşalım!",

  // Cornwell Intro
  "npcDialogues.cornwell.intro1":
    "Selamlar, genç maceracı! Aradığım eşyalarla mı geldiniz?",
  "npcDialogues.cornwell.intro2":
    "Ah, hoş geldiniz, bilgi ve kalıntı arayıcısı! İstediğim öğeleri buldunuz mu? Bana ne gösterdiğinizi gösterin.",
  "npcDialogues.cornwell.intro3":
    "Eski sırlar ve bilgelik alanına adım atın. İstediğim öğeleri edindiniz mi? Keşiflerinizi benimle paylaşın, gençler.",
  "npcDialogues.cornwell.intro4":
    "Ah, sen misin! Asil bir arayışta olan. Aradığım öğeleri buldunuz mu? Gel, Sunflower Land'ın geniş topraklarında ne keşfettiğinizi gösterin.",
  "npcDialogues.cornwell.intro5":
    "Selamlar, genç gezgin! Merak rüzgarları sizi buraya getirdi. Koleksiyonumu zenginleştirmek için ihtiyacım olan öğeleri buldunuz mu?",

  // Cornwell Positive Delivery
  "npcDialogues.cornwell.positiveDelivery1":
    "Harika! Tam olarak aradığım kalıntıları getirdiniz. Sunflower Land'ın tarihini koruma çabanız hatırlanacak.",
  "npcDialogues.cornwell.positiveDelivery2":
    "Ah, harika! Bulduklarınız istediğim kalıntılarla mükemmel uyum sağlıyor. Bu hazineler koleksiyonuma büyük bilgelik katacak.",
  "npcDialogues.cornwell.positiveDelivery3":
    "Etkileyici! Edindiğiniz öğeler tam olarak aradıklarım. Sunflower Land'ın tarihi onların aracılığıyla parlayacak.",
  "npcDialogues.cornwell.positiveDelivery4":
    "Ah, genç maceracı, beklentilerimi aştınız! Getirdiğiniz öğeler, araştırmalarımda çok değerli olacak.",
  "npcDialogues.cornwell.positiveDelivery5":
    "Ah, iyi yapılmış, keskin gözlü arkadaşım! Getirdiğiniz öğeler, rüzgar değirmenimin koleksiyonunda onurlu bir yer bulacak.",

  // Cornwell Negative Delivery
  "npcDialogues.cornwell.negativeDelivery1":
    "Oh, aradığım öğeleri bulamadığınız görünüyor. Korkmayın; keşif yolculuğu devam ediyor. Sunflower Land'ın gizemlerini keşfetmeye devam edin.",
  "npcDialogues.cornwell.negativeDelivery2":
    "Hmm, beklediğim kalıntılar tam olarak değil gibi. Ama üzülmeyin! Aramaya devam edin ve Sunflower Land'ın hazineleri size kendini gösterecek.",
  "npcDialogues.cornwell.negativeDelivery3":
    "Oh, görünüşe göre istediğim öğeler sizden kaçtı. Fark etmez; merakınız sizi doğru keşiflere götürecek.",
  "npcDialogues.cornwell.negativeDelivery4":
    "Ah, belirli öğeleri bulamadığınızı görüyorum. Endişelenme; Sunflower Land'ın tarihi, ortaya çıkarılması bekleyen birçok sır saklıyor.",
  "npcDialogues.cornwell.negativeDelivery5":
    "Oh, sevgili gezginim, istediğim tam olarak öğeleri getirmediğiniz görünüyor. Ancak Sunflower Land'ın tarihine olan bağlılığınız takdire değer.",

  // Cornwell NoOrder
  "npcDialogues.cornwell.noOrder1":
    "Ah, şu anda sizin teslim edeceğiniz bir görev öğesi görünmüyor. Ama moralinizi bozmayın! Sunflower Land'daki yolculuğunuz, keşfedilmeyi bekleyen sayısız macera ile dolu.",
  "npcDialogues.cornwell.noOrder2":
    "Oh, şu anda hizmetlerinize ihtiyacım yok gibi görünüyor. Ama üzülmeyin! Sunflower Land'ın tarih sayfaları sonsuzca dönüyor ve yeni görevler kesinlikle kendini gösterecek.",
  "npcDialogues.cornwell.noOrder3":
    "Ah, özür dilerim, ancak şu anda yerine getirmeniz gereken bir şeyim yok. Ancak korkmayın; bilgi arayıcısı olarak yolunuz zamanla sizi yeni görevlere yönlendirecek.",
  "npcDialogues.cornwell.noOrder4":
    "Ah, şu anda benden herhangi bir görev siparişi almadınız gibi görünüyor. Ama umudu kaybetmeyin; meraklı doğanız sizi yakında Sunflower Land'da heyecan verici yeni görevlere yönlendirecek.",

  // Pumpkin Pete Intro
  "npcDialogues.pumpkinPete.intro1":
    "Seni bekliyordum, dostum! Siparişim hazır mı?",
  "npcDialogues.pumpkinPete.intro2":
    "Merhaba, kabak! Plazada Bumpkin'leri yönlendirmekle meşguldüm. Siparişimi aldınız mı?",
  "npcDialogues.pumpkinPete.intro3":
    "Selamlar, dost! Bugün plaza heyecanla dolu. Siparişimi alabildiniz mi?",
  "npcDialogues.pumpkinPete.intro4":
    "Merhaba, yol arkadaşı maceracı! Sizi mütevazı evime ne getirdi? Siparişimi aldınız mı?",
  "npcDialogues.pumpkinPete.intro5":
    "Hey, hey! Plazaya hoş geldiniz! İhtiyacım olanı bulabildiniz mi?",

  // Pumpkin Pete Positive Delivery
  "npcDialogues.pumpkinPete.positiveDelivery1":
    "Hooray! Tam olarak ihtiyacım olanı getirdiniz. Sen plazanın gerçek bir kahramanısın!",
  "npcDialogues.pumpkinPete.positiveDelivery2":
    "Kabak-tastik! Tam olarak ihtiyacım olanı buldunuz. Küçük topluluğumuzu daha parlak yapıyorsunuz!",
  "npcDialogues.pumpkinPete.positiveDelivery3":
    "Sevinç tohumları! Tam olarak ihtiyacım olanı getirdiniz. Plaza senin gibi şanslı!",
  "npcDialogues.pumpkinPete.positiveDelivery4":
    "Harika! Tam olarak istediğim şeyi getirdiniz. İyiliğiniz plazamızda güneş ışığı yayıyor!",
  "npcDialogues.pumpkinPete.positiveDelivery5":
    "Oh, kabak sevinç tohumları! Tam olarak ihtiyacım olanı getirdiniz. Plaza, yardımınız için minnettardır!",

  // Pumpkin Pete Negative Delivery
  "npcDialogues.pumpkinPete.negativeDelivery1":
    "Oh hayır. Aradığım şeye sahip değilsiniz gibi görünüyor. Endişelenme, inanıyorum sana. Bulduğunda geri gel!",
  "npcDialogues.pumpkinPete.negativeDelivery2":
    "Ah, vay be! Şu anda aradığım şeye sahip değilsiniz. Ancak keşfe devam edin! Belki bir sonraki sefere.",
  "npcDialogues.pumpkinPete.negativeDelivery3":
    "Oh, keder tohumları! Aradığım şeye sahip değilsiniz. Ama pes etme; her gün yeni fırsatlar çıkar!",
  "npcDialogues.pumpkinPete.negativeDelivery4":
    "Oh, şimşek çiçekleri! Şu anda aradığımı bulamadınız. Ancak keşfe devam edin! Eminim bulacaksınız.",
  "npcDialogues.pumpkinPete.negativeDelivery5":
    "Ayıp! Aradığımı bulamadınız. Ancak endişelenme, dostum. Keşfe devam edin, bulduğunuzda kutlayacağız.",

  // Pumpkin Pete NoOrder
  "npcDialogues.pumpkinPete.noOrder1":
    "Ah, dostum, şu anda sizin için aktif bir siparişim yok gibi görünüyor. Ama korkmayın! Her zaman rehberlik ve dostane bir kabak gülümsemesi sunmak için buradayım.",
  "npcDialogues.pumpkinPete.noOrder2":
    "Ah, bugün sizin için aktif bir sipariş yok, dostum. Ama endişelenme! Plazayı keşfetmekte özgürsünüz ve herhangi bir yardıma ihtiyacınız varsa, ben buradayım.",

  // NPC gift dialogues
  "npcDialogues.pumpkinPete.reward":
    "Teslimatlarınız için nazik olmanızı takdir ederim. İşte minnettarlığımı göstermek için küçük bir şey.",
  "npcDialogues.pumpkinPete.flowerIntro":
    "Sarı bir Kozmozun zarafetini gördünüz mü? Bir tane görmek istiyorum...",
  "npcDialogues.pumpkinPete.averageFlower":
    "Tam olarak aklımdaki gibi değil, ama oldukça çekici. Teşekkürler.",
  "npcDialogues.pumpkinPete.badFlower":
    "Bunu umduğum gibi değil. Belki daha uygun bir tane bulabilir misiniz?",
  "npcDialogues.pumpkinPete.goodFlower":
    "Bu Sarı Kozmoz muhteşem! Onu bana getirdiğiniz için teşekkür ederim.",

  "npcDialogues.betty.reward":
    "Düşünceli hediyeleriniz için teşekkür ederim. Minnettarlığımı göstermek için küçük bir şey.",
  "npcDialogues.betty.flowerIntro":
    "Kırmızı, Sarı, Mor, Beyaz veya Mavi bir Pansiyumu hayal edebilir misiniz? Bir tane arzuluyorum...",
  "npcDialogues.betty.averageFlower":
    "Tam olarak beklediğim gibi değil, ama oldukça güzel. Teşekkür ederim.",
  "npcDialogues.betty.badFlower":
    "Bunu aklımdaki gibi değil. Daha uygun bir çiçek bulabilir misiniz?",
  "npcDialogues.betty.goodFlower":
    "Bu Pansiyum güzel! Onu bana getirdiğiniz için teşekkür ederim.",

  "npcDialogues.blacksmith.reward":
    "Teslimatlarınız çok takdir ediliyor. Çabalarınız için bir şeyler.",
  "npcDialogues.blacksmith.flowerIntro":
    "Parlak bir Kırmızı Karanfil'e ihtiyacım var. Böyle bir şey buldunuz mu?",
  "npcDialogues.blacksmith.averageFlower":
    "Tam olarak umduğum gibi değil, ama oldukça güzel. Teşekkürler.",
  "npcDialogues.blacksmith.badFlower":
    "Bu çiçek tam olarak uygun değil. Daha uygun bir tane arayabilir misiniz?",
  "npcDialogues.blacksmith.goodFlower":
    "Ah, bu Kırmızı Karanfil mükemmel! Onu bana getirdiğiniz için teşekkür ederim.",

  "npcDialogues.bert.reward":
    "Sürekli yardımlarınız için teşekkür ederim. Çabalarınız için küçük bir hediye.",
  "npcDialogues.bert.flowerIntro":
    "Kırmızı, Sarı, Mor, Beyaz veya Mavi Lotus çiçekleri gerçekten büyüleyici. Böyle bir şeyiniz var mı?",
  "npcDialogues.bert.averageFlower":
    "Bu aklımdaki gibi değildi, ama oldukça keyifli. Teşekkür ederim.",
  "npcDialogues.bert.badFlower":
    "Bu ihtiyacım olan çiçek değil. Belki başka bir arama gerekir?",
  "npcDialogues.bert.goodFlower":
    "Bu Lotus muhteşem! Onu bana getirdiğiniz için teşekkür ederim.",

  "npcDialogues.finn.reward":
    "Katkılarınız paha biçilmez. Minnettarlığımı göstermek için küçük bir şey.",
  "npcDialogues.finn.flowerIntro":
    "Kırmızı, Sarı, Mor, Beyaz veya Mavi bir Nergis hayal edebiliyor musunuz? Böyle bir şey bulabilir misiniz?",
  "npcDialogues.finn.averageFlower":
    "Tam olarak umduğum gibi değil, ama oldukça hoş. Teşekkür ederim.",
  "npcDialogues.finn.badFlower":
    "Bu çiçek beklentilerimi tam olarak karşılamıyor. Belki başka bir deneme?",
  "npcDialogues.finn.goodFlower":
    "Bu Nergis şahane! Onu bana getirdiğiniz için teşekkür ederim.",

  "npcDialogues.finley.reward":
    "Teslimatlarınız için teşekkür ederim. Çabalarınız için küçük bir hediye.",
  "npcDialogues.finley.flowerIntro":
    "Aklımdaki gibi güzel bir Nergis günümü aydınlatır. Böyle bir şey gördünüz mü?",
  "npcDialogues.finley.averageFlower":
    "Tam olarak beklediğim gibi değil, ama oldukça çekici. Teşekkür ederim.",
  "npcDialogues.finley.badFlower":
    "Bu çiçek tam olarak uygun değil. Belki başka bir tane daha uygun olur?",
  "npcDialogues.finley.goodFlower":
    "Bu Sarı Karanfil güzel! Onu bana getirdiğiniz için teşekkür ederim.",

  "npcDialogues.corale.reward":
    "Teslimatlarınız çok takdir ediliyor. Minnettarlığımı göstermek için küçük bir şey.",
  "npcDialogues.corale.flowerIntro":
    "Parlak bir Prismal yaprağa rastladınız mı? Sadece büyüleyici...",
  "npcDialogues.corale.averageFlower":
    "Tam olarak umduğum gibi değil, ama oldukça hoş. Teşekkür ederim.",
  "npcDialogues.corale.badFlower":
    "Bu benim aklımdaki değildi. Daha uygun bir çiçek bulamaz mısın?",
  "npcDialogues.corale.goodFlower":
    "Bu Prizma Yaprağı muhteşem! Onu bana getirdiğin için teşekkür ederim.",

  "npcDialogues.raven.reward":
    "Teslimatlarınız için teşekkür ederiz. İşte çabalarınız için küçük bir takdir nişanesi.",
  "npcDialogues.raven.flowerIntro":
    "Koyu koyu mor ruhumun rengi; buna benzer bir şeyle karşılaştın mı?",
  "npcDialogues.raven.averageFlower":
    "Beklediğim gibi olmasa da oldukça sevindirici. Teşekkür ederim.",
  "npcDialogues.raven.badFlower":
    "Bu çiçek pek doğru değil. Belki başka bir arama yapılması gerekiyor?",
  "npcDialogues.raven.goodFlower":
    "Bu Mor Karanfil mükemmel! Onu bana getirdiğin için teşekkür ederim.",

  "npcDialogues.miranda.reward":
    "Çabalarınız için teşekkürler. İşte teslimatlarınız için küçük bir teşekkür simgesi.",
  "npcDialogues.miranda.flowerIntro":
    "Sarı bir çiçeğin canlılığı kesinlikle moralimi yükseltirdi. Etrafta birini gördün mü?",
  "npcDialogues.miranda.averageFlower":
    "Tam olarak umduğum şey bu değildi ama oldukça etkileyici. Teşekkür ederim.",
  "npcDialogues.miranda.badFlower":
    "Bu çiçek pek doğru değil.  Belki başka biri daha uygun olur?",
  "npcDialogues.miranda.goodFlower":
    "Bu Sarı çiçek çok hoş!  Onu bana getirdiğin için teşekkür ederim.",

  "npcDialogues.cornwell.reward":
    "Teslimatlarınız için teşekkür ederiz. İşte çabalarınız için küçük bir takdir nişanesi.",
  "npcDialogues.cornwell.flowerIntro":
    "Kırmızı, Sarı, Mor, Beyaz veya Mavi renkte bir Balon Çiçeğinin görünümü gerçekten keyiflidir...",
  "npcDialogues.cornwell.averageFlower":
    "Beklediğim gibi değil ama oldukça etkileyici. Teşekkür ederim.",
  "npcDialogues.cornwell.badFlower":
    "Bu çiçek pek doğru değil. Belki başka bir arama yapılması gerekiyor?",
  "npcDialogues.cornwell.goodFlower":
    "Bu Balon Çiçeği çok hoş! Onu bana getirdiğin için teşekkür ederim.",

  "npcDialogues.tywin.reward":
    "Teslimatlarınız için teşekkür ederiz. İşte çabalarınız için küçük bir takdir nişanesi.",
  "npcDialogues.tywin.flowerIntro":
    "Enfes Primula Enigma'yı veya büyüleyici Celestial Frostbloom'u duydunuz mu? Birine ihtiyacım var.",
  "npcDialogues.tywin.averageFlower":
    "Tam olarak umduğum gibi değildi ama oldukça keyifliydi. Teşekkür ederim.",
  "npcDialogues.tywin.badFlower":
    "Bu çiçek pek doğru değil. Belki başka biri daha uygun olur?",
  "npcDialogues.tywin.goodFlower":
    "Bu çiçek tek kelimeyle nefes kesici! Onu bana getirdiğin için teşekkür ederim.",

  "npcDialogues.default.flowerIntro":
    "Benim için bir çiçek aldın mı?  Sevdiğim bir şey olduğundan emin olun.",
  "npcDialogues.default.averageFlower":
    "Vay, teşekkürler!  Bu çiçeğe bayılıyorum!",
  "npcDialogues.default.badFlower":
    "Hmmmm, bu benim en sevdiğim çiçek değil. Ama sanırım önemli olan düşünce.",
  "npcDialogues.default.goodFlower":
    "Bu benim en sevdiğim çiçek!  Çok teşekkürler!",
  "npcDialogues.default.reward":
    "Vay be, teşekkürler Bumpkin.  İşte yardımınız için küçük bir hediye!",
  "npcDialogues.default.locked": "Lütfen yarın tekrar gelin.",
};

const nyeButton: Record<NyeButton, string> = {
  "plaza.magicButton.query":
    "Plazada sihirli bir düğme belirdi. Basmak ister misin?",
};

const NYON_STATUE: Record<NyonStatue, string> = {
  "nyonStatue.memory": "Anısına",
  "nyonStatue.description":
    "Mağaralardaki goblinleri temizlemekten sorumlu efsanevi şövalye. Zaferinden kısa bir süre sonra, bir Goblin komplocusunun zehirlemesi sonucu öldü. Sunflower Vatandaşları, onun zaferlerini anmak için zırhıyla birlikte bu heykeli dikti.",
};

const obsessionDialogue: Record<ObsessionDialogue, string> = {
  "obsessionDialogue.line1": ENGLISH_TERMS["obsessionDialogue.line1"],
  "obsessionDialogue.line2": ENGLISH_TERMS["obsessionDialogue.line2"],
  "obsessionDialogue.line3": ENGLISH_TERMS["obsessionDialogue.line3"],
  "obsessionDialogue.line4": ENGLISH_TERMS["obsessionDialogue.line4"],
  "obsessionDialogue.line5": ENGLISH_TERMS["obsessionDialogue.line5"],
};

const offer: Record<Offer, string> = {
  "offer.okxOffer": "Merhaba Çiftçi, senin için özel bir OKX teklifim var!",
  "offer.beginWithNFT": ENGLISH_TERMS["offer.beginWithNFT"],
  "offer.getStarterPack": "Başlangıç Paketini Al",
  "offer.newHere": "Merhaba Çiftçi, burada yenisin görünüyorsun!",
  "offer.getStarted": "Şimdi Başla",
  "offer.not.enough.BlockBucks": "Yeterince Block Bucks yok!",
};

const onboarding: Record<Onboarding, string> = {
  "onboarding.welcome": "Merkeziyetsiz oyun dünyasına hoş geldiniz!",
  "onboarding.step.one": "Adım 1/3",
  "onboarding.step.two": "Adım 2/3 (Bir cüzdan oluştur)",
  "onboarding.step.three": "Adım 3/3 (NFT'nizi oluşturun)",
  "onboarding.intro.one":
    "Yolculuklarınızda, korumanız gereken nadir NFT'ler kazanacaksınız. Bunları güvende tutmak için bir Web3 cüzdanına ihtiyacınız olacak.",
  "onboarding.intro.two": "Yolculuğunuza başlamak için cüzdanınız",
  "onboarding.cheer": "Neredeyse oradasınız!",
  "onboarding.form.one": "Bilgilerinizi doldurun",
  "onboarding.form.two":
    "ve oynayacak ücretsiz bir NFT göndereceğiz. (Bu, bize 3-7 gün sürecektir)",
  "onboarding.duplicateUser.one": "Zaten kaydoldunuz!",
  "onboarding.duplicateUser.two":
    "Beta testi için farklı bir adres kullanarak kaydolduğunuzu gösteriyor gibi görünüyor. Beta testi sırasında yalnızca bir adres kullanılabilir. ",
  "onboarding.starterPack": "Başlangıç Paketi",
  "onboarding.settingWallet": "Cüzdanınızı ayarlama",
  "onboarding.wallet.one":
    "Çok sayıda cüzdan sağlayıcısı var, ancak Sequence ile işbirliği yaptık çünkü kullanımı kolay ve güvenlidirler.",
  "onboarding.wallet.two":
    "Açılır pencerede bir kayıt yöntemi seçin ve hazırsınız.  Bir dakika sonra tekrar burada görüşürüz!",
  "onboarding.wallet.haveWallet": "Zaten bir cüzdanım var",
  "onboarding.wallet.createButton": "Duvar oluştur",
  "onboarding.wallet.acceptButton": "Hizmet şartlarını kabul edin",
  "onboarding.buyFarm.title": "Çiftliğini satın al!",
  "onboarding.buyFarm.one":
    "Artık cüzdanınız hazır olduğuna göre, kendi çiftliğinizin NFT'sini almanın zamanı geldi!",
  "onboarding.buyFarm.two":
    "Bu NFT, Ayçiçeği Diyarı'ndaki tüm ilerlemenizi güvenli bir şekilde saklayacak ve çiftliğinizle ilgilenmeye devam etmenize olanak tanıyacaktır.",
  "onboarding.wallet.already": "Zaten bir cüzdanım var",
};

const onCollectReward: Record<OnCollectReward, string> = {
  "onCollectReward.Missing.Seed": "Eksik Tohumlar",
  "onCollectReward.Market": "Tohum satın almak için Pazara gidin.",
  "onCollectReward.Missing.Shovel": "Eksik Kürek",
  "onCollectReward.Missing.Shovel.description":
    "Onu bulmak için adanızı genişletin.",
};

const orderhelp: Record<OrderHelp, string> = {
  "orderhelp.Skip.hour":
    "Bir siparişi yalnızca 24 saat sonra atlayabilirsiniz!",
  "orderhelp.New.Season":
    "Yeni sezon yaklaşıyor, teslimatlar geçici olarak kapanacak.",
  "orderhelp.New.Season.arrival": "Yeni sezonluk teslimatlar yakında açılıyor.",
  "orderhelp.Wisely": "Akıllıca seç!",
  "orderhelp.SkipIn": "Atla",
  "orderhelp.NoRight": "Şimdi olmaz",
  "orderhelp.ticket.deliveries.closed":
    ENGLISH_TERMS["orderhelp.ticket.deliveries.closed"],
};

const pending: Record<Pending, string> = {
  "pending.calcul": "Sonuçlar hesaplanıyor.",
  "pending.comeback": "Daha sonra gel.",
};

const personHood: Record<PersonHood, string> = {
  "personHood.Details": "Kişilik Detayları Yüklenemedi",
  "personHood.Identify": "Kimliğiniz doğrulanamadı",
  "personHood.Congrat": "Tebrikler, kimliğiniz doğrulandı!",
};

const pickserver: Record<Pickserver, string> = {
  "pickserver.server": "Katılmak için bir sunucu seçin",
  "pickserver.full": "DOLU",
  "pickserver.explore": "Özel proje adalarını keşfedin.",
  "pickserver.built": "Kendi adanızı mı inşa etmek istiyorsunuz?",
};

const piratechest: Record<PirateChest, string> = {
  "piratechest.greeting":
    "Ahoy korsan! Yelkenleri aç ve daha sonra dönüp dolu bir sandık için gel!",
  "piratechest.refreshesIn": "Sandık yenileniyor",
  "piratechest.warning":
    "Ahoy orada! Bu sandık, bir korsan kralına yakışır hazinelerle doludur, ancak dikkat edin, sadece korsan bir görünüme sahip olanlar açabilir ve içindeki ganimeti alabilir!",
};

const pirateQuest: Record<PirateQuest, string> = {
  "questDescription.farmerQuest1": "1000 Ayçiçeği hasat et",
  "questDescription.fruitQuest1": "10 Yaban Mersini hasat et",
  "questDescription.fruitQuest2": "100 Portakal hasat et",
  "questDescription.fruitQuest3": "750 Elma hasat et",
  "questDescription.pirateQuest1": "30 Delik kaz",
  "questDescription.pirateQuest2": "10 Deniz yosunu topla",
  "questDescription.pirateQuest3": "10 Midye topla",
  "questDescription.pirateQuest4": "5 Mercan topla",
  "piratequest.welcome":
    "Macera dolu denizlerin hoş geldiniz, gerçek bir korsan olarak sınandığınız yer burası. En zengin yağmurları bulmak ve okyanus dalgalarına en büyük korsan olmak için bir yolculuğa çıkın.",
  "piratequest.finestPirate":
    "Ahoy, siz yedi denizin en iyi korsanısınız ve yağmanızla birlikte buradasınız!!",
};

const playerTrade: Record<PlayerTrade, string> = {
  "playerTrade.no.trade": "Ticaret yok.",
  "playerTrade.max.item": "Oh hayır! Maksimum eşya sayısına ulaştınız.",
  "playerTrade.Progress":
    "Devam etmeden önce ilerlemenizi zincire kaydedin lütfen.",
  "playerTrade.transaction":
    "Oh oh! Devam eden bir işleminiz olduğunu gösteriyor gibi.",
  "playerTrade.Please": "Devam etmeden önce lütfen 5 dakika bekleyin.",
  "playerTrade.sold": "Satıldı",
  "playerTrade.sale": "Satılık: ",
  "playerTrade.title.congrat": "Tebrikler, listelemeniz satın alındı",
};

const portal: Record<Portal, string> = {
  "portal.wrong": "Bir şeyler yanlış gitti",
  "portal.unauthorised": "Yetkisiz",
  "portal.example.intro": ENGLISH_TERMS["portal.example.intro"],
  "portal.example.claimPrize": ENGLISH_TERMS["portal.example.claimPrize"],
  "portal.example.purchase": ENGLISH_TERMS["portal.example.purchase"],
};

const promo: Record<Promo, string> = {
  "promo.cdcBonus": "Crypto.com Bonusu!",
  "promo.expandLand": "Arazinizi iki katına çıkararak 100 SFL talep edin.",
};

const purchaseableBaitTranslation: Record<PurchaseableBaitTranslation, string> =
  {
    "purchaseableBait.fishingLure.description":
      "Nadir balıklar yakalamak için harika!",
  };

const quest: Record<Quest, string> = {
  "quest.mint.free": "Ücretsiz Giyilebilir Ürünü Üret",
  "quest.equipWearable": "Bu giyilebilir ürünü Bumpkin'inize takın",
  "quest.congrats": ENGLISH_TERMS["quest.congrats"],
};

const questions: Record<Questions, string> = {
  "questions.obtain.MATIC": "MATIC nasıl alınır?",
  "questions.lowCash": "Nakit sıkıntısı mı var?",
};

const reaction: Record<Reaction, string> = {
  "reaction.bumpkin": "Seviye 3 Bumpkin",
  "reaction.bumpkin.10": "Seviye 10 Bumpkin",
  "reaction.bumpkin.30": "Seviye 30 Bumpkin",
  "reaction.bumpkin.40": "Seviye 40 Bumpkin",
  "reaction.sunflowers": "100.000 Ayçiçeği hasadı",
  "reaction.crops": "10.000 ürün hasadı",
  "reaction.goblin": "Bir Goblin'e dönüş",
  "reaction.crown": "Bir Goblin Tacı sahibi ol",
};

const reactionBud: Record<ReactionBud, string> = {
  "reaction.bud.show": "Tomurcuklarınızı gösterin",
  "reaction.bud.select": "Meydan'a yerleştirmek için bir tomurcuk seçin",
  "reaction.bud.noFound": "Envanterinizde tomurcuk bulunamadı",
};

const refunded: Record<Refunded, string> = {
  "refunded.itemsReturned": "Eşyalarınız envanterinize geri döndü",
  "refunded.goodLuck": "Bir dahaki sefere iyi şanslar!",
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
  "removeKuebiko.title": "Kuebiko'yı Kaldır",
  "removeKuebiko.description":
    "Bu eylem envanterinizden tüm tohumları kaldıracak.",
  "removeKuebiko.removeSeeds": "Tohumları Kaldır",
};

const removeCropMachine: Record<RemoveCropMachine, string> = {
  "removeCropMachine.title": ENGLISH_TERMS["removeCropMachine.title"],
  "removeCropMachine.description":
    ENGLISH_TERMS["removeCropMachine.description"],
};

const resale: Record<Resale, string> = {
  "resale.actionText": "Yeniden Sat",
};

const resources: Record<Resources, string> = {
  "resources.recoversIn": "Şurada iyileşir:",
  "resources.boulder.rareMineFound": "Nadir bir maden buldunuz!",
  "resources.boulder.advancedMining": "Gelişmiş madencilik yolda.",
};

const resourceTerms: Record<ResourceTerms, string> = {
  "chicken.description": "Yumurtlamak için kullanılır",
  "magicMushroom.description": "Gelişmiş tarifler pişirmek için kullanılır",
  "wildMushroom.description": "Temel tarifler pişirmek için kullanılır",
  "honey.description": "Yemeklerinizi tatlandırmak için kullanılır",
};

const restock: Record<Restock, string> = {
  "restock.one.buck":
    "Tüm mağaza ürünlerini yenilemek için 1 Block Bucks kullanacaksınız.",
  "restock.sure": "Yenilemek istediğinizden emin misiniz?",
  "restock.tooManySeeds": "Sepetinizde fazla tohum var!",
  "seeds.reachingInventoryLimit": ENGLISH_TERMS["seeds.reachingInventoryLimit"],
};

const retreatTerms: Record<RetreatTerms, string> = {
  "retreatTerms.lookingForRareItems": "Nadir eşyalar mı arıyorsunuz?",
  "retreatTerms.resale.one":
    "Oyunda ürettikleri özel eşyaları oyuncular takas edebilirler.",
  "retreatTerms.resale.two":
    "Bu eşyaları OpenSea gibi ikincil pazarlardan satın alabilirsiniz.",
  "retreatTerms.resale.three": "Eşyaları OpenSea'de görüntüleyin",
};

const rewardTerms: Record<RewardTerms, string> = {
  "reward.daily.reward": "Günlük Ödül",
  "reward.streak": "Gün üst üste",
  "reward.comeBackLater": "Daha fazla ödül için daha sonra tekrar gelin",
  "reward.nextBonus": "Sonraki bonus",
  "reward.unlock": "Ödülü Aç",
  "reward.open": "Ödülü Aç",
  "reward.lvlRequirement":
    "Günlük ödülleri almak için en az seviye 3 olmalısınız.",
  "reward.whatCouldItBe": "Bu ne olabilir?",
  "reward.streakBonus": "3x üst üste bonusu",
  "reward.found": "Buldunuz",
  "reward.spendWisely": "Onu akıllıca harcayın.",
  "reward.wearable": "Bumpkin'iniz için giyilebilir bir şey",
  "reward.promo.code": "Promosyon kodunuzu girin",
  "reward.woohoo": "Woohoo! İşte ödülünüz",
  "reward.connectWeb3Wallet": "Günlük bir ödül için bir Web3 Cüzdanı bağlayın.",
  "reward.factionPoints": ENGLISH_TERMS["reward.factionPoints"],
};

const rulesGameStart: Record<RulesGameStart, string> = {
  "rules.gameStart":
    "Oyunun başında bitki rastgele 4 iksir ve 1 'kaos' iksirinden oluşan bir kombinasyon seçecektir. Kombinasyonun hepsi farklı veya hepsi aynı olabilir.",
  "rules.chaosPotionRule":
    "'Kaos' iksirini eklerseniz bu girişim için puanınız 0 olacaktır.",
  "rules.potion.feedback":
    "İksirlerinizi seçin ve bitkilerin sırlarını açığa çıkarın!",
  "BloomBoost.description": "Bitkilerinizi canlı çiçeklerle ateşleyin!",
  "DreamDrip.description":
    "Bitkilerinizi büyülü rüyalar ve fantezilerle süsleyin.",
  "EarthEssence.description":
    "Bitkilerinizi beslemek için toprağın gücünden yararlanın.",
  "FlowerPower.description": "Bitkilerinize çiçek enerjisi patlaması yaşatın.",
  "SilverSyrup.description":
    "Bitkilerinizdeki en iyiyi ortaya çıkaracak tatlı bir şurup.",
  "HappyHooch.description":
    "Bitkilerinize neşe ve kahkaha getirecek bir iksir.",
  "OrganicOasis.description":
    "Bitkileriniz için yemyeşil, organik bir cennet yaratın.",
};

const rulesTerms: Record<RulesTerms, string> = {
  "game.rules": "Oyun kuralları",
  "rules.oneAccountPerPlayer": "Oyuncu başına 1 hesap",
  "rules.gameNotFinancialProduct": "Bu bir oyun. Finansal bir ürün değil.",
  "rules.noBots": "Botlar veya otomasyon yasak",
  "rules.termsOfService": "Kullanım Şartları",
};

const sceneDialogueKey: Record<SceneDialogueKey, string> = {
  "sceneDialogues.chefIsBusy": "Şef meşgul",
};

const seasonTerms: Record<SeasonTerms, string> = {
  "season.access": "Erişiminiz var",
  "season.banner": "Sezonluk Bayrak",
  "season.bonusTickets": "Bonus Sezonluk Biletler",
  "season.boostXP": "Yiyeceklerden +%10 XP",
  "season.buyNow": "Şimdi al",
  "season.discount": "Sezonluk ürünlerde %25 SFL indirimi",
  "season.exclusiveOffer": "Özel teklif!",
  "season.goodLuck": "Sezonda iyi şanslar!",
  "season.includes": "İçerir",
  "season.limitedOffer": " Sadece sınırlı süre için!",
  "season.wearableAirdrop": "Sezonluk Giyilebilir Airdrop",
  "season.place.land": "Onu kendi arazine koymalısın",
  "season.free.season.passes": ENGLISH_TERMS["season.free.season.passes"],
  "season.free.season.passes.description":
    ENGLISH_TERMS["season.free.season.passes.description"],
  "season.megastore.discount": ENGLISH_TERMS["season.megastore.discount"],
  "season.mystery.gift": ENGLISH_TERMS["season.mystery.gift"],
  "season.supporter.gift": ENGLISH_TERMS["season.supporter.gift"],
  "season.vip.access": ENGLISH_TERMS["season.vip.access"],
  "season.vip.description": ENGLISH_TERMS["season.vip.description"],
  "season.xp.boost": ENGLISH_TERMS["season.xp.boost"],
  "season.lifetime.farmer": ENGLISH_TERMS["season.lifetime.farmer"],
  "season.free.with.lifetime": ENGLISH_TERMS["season.free.with.lifetime"],
  "season.vip.claim": ENGLISH_TERMS["season.vip.claim"],
};

const share: Record<Share, string> = {
  "share.TweetText": "Ayçiçeği Arazi Çiftliğimi Ziyaret Edin",
  "share.ShareYourFarmLink": "Çiftlik Bağlantınızı Paylaşın",
  "share.ShowOffToFarmers":
    "Çiftlik bağlantınızı (URL: çiftliğinizi doğrudan ziyaret etmek için) paylaşarak çiftçi arkadaşlarınıza gösteriş yapın!",
  "share.FarmNFTImageAlt": "Ayçiçeği-Arazi Çiftliği NFT Görüntüsü",
  "share.CopyFarmURL": "Çiftlik URL'sini kopyala",
  "share.Tweet": "Tweet",
  "share.chooseServer": "Katılmak için bir sunucu seçin",
  "share.FULL": "DOLU",
  "share.exploreCustomIslands": "Özel proje adalarını keşfedin.",
  "share.buildYourOwnIsland": "Kendi adanızı mı inşa etmek istiyorsunuz?",
};

const sharkBumpkinDialogues: Record<SharkBumpkinDialogues, string> = {
  "sharkBumpkin.dialogue.shhhh": "Şşşşt!",
  "sharkBumpkin.dialogue.scareGoblins": "Goblinleri korkutmaya çalışıyorum.",
};

const shelly: Record<Shelly, string> = {
  "shelly.Dialogue.one": "Selam, Bumpkin! Plaja hoş geldiniz!",
  "shelly.Dialogue.two":
    "Çiftliğinizde geçirdiğiniz zorlu bir günün ardından arkanıza yaslanıp dalgaların tadını çıkarmak için daha iyi bir yer olamaz.",
  "shelly.Dialogue.three":
    "Ama şöyle bir durumumuz var. Devasa bir kraken ortaya çıktı ve sevgili kumsalımızın kontrolünü ele geçirdi.",
  "shelly.Dialogue.four":
    "Gerçekten yardımına ihtiyacımız var canım. Yeminizi ve oltalarınızı alın, birlikte bu devasa sorunun üstesinden gelelim!",
  "shelly.Dialogue.five":
    "Yakaladığın her dokunaç için sana değerli denizkızı pulları vereceğim!",
  "shelly.Dialogue.letsgo": "Hadi yapalım!",
};

const shellyDialogue: Record<ShellyDialogue, string> = {
  "shellyPanelContent.tasksFrozen":
    "Yeni sezonun başlamasını bekliyorum. O zaman bana geri dön!",
  "shellyPanelContent.canTrade":
    "Aman Tanrım, bir Kraken Dokunacın var! Bunu birkaç denizkızı terazisiyle değiştireceğim.",
  "shellyPanelContent.cannotTrade":
    "Görünüşe göre elinizde hiç Kraken Tentacles yok! Bunu yaptığında geri gel.",
  "shellyPanelContent.swap": "Değiştir",
  "krakenIntro.congrats":
    "Tebrikler! Kraken, Bumpkins'i terörize etmeyi bıraktı.",
  "krakenIntro.noMoreTentacles":
    "Haftanın tüm dokunaçlarını topladın. Yakından takip edelim, açlığın geri döneceğinden eminim.",
  "krakenIntro.gotIt": "Anlaşıldı!",
  "krakenIntro.appetiteChanges": "Kraken'in iştahı sürekli değişiyor.",
  "krakenIntro.currentHunger":
    "Şu anda ....Vay canına, bu Bumpkinlerden daha iyi.",
  "krakenIntro.catchInstruction":
    "Balık tutma noktanıza gidin ve canavarı yakalamaya çalışın!",
};

const shopItems: Record<ShopItems, string> = {
  "betty.post.sale.one": "Selam, selam! Tekrar hoşgeldiniz.",
  "betty.post.sale.two":
    "Mahsul kıtlığının çözülmesine yardımcı oldunuz ve fiyatlar normale döndü.",
  "betty.post.sale.three":
    "Daha büyük ve daha iyi mahsullere geçmenin zamanı geldi!",
  "betty.welcome": "Pazarıma hoş geldiniz. Ne yapmak istersin?",
  "betty.buySeeds": "Tohum satın al",
  "betty.sellCrops": "Mahsul satmak",
};

const showingFarm: Record<ShowingFarm, string> = {
  "showing.farm": "Çiftlikte Gösteriliyor",
  "showing.wallet": "Cüzdanda",
};

const snorklerDialogues: Record<SnorklerDialogues, string> = {
  "snorkler.vastOcean": "Bu engin bir okyanus!",
  "snorkler.goldBeneath": "Yüzeyin altında bir yerde altın olmalı.",
};

const somethingWentWrong: Record<SomethingWentWrong, string> = {
  "somethingWentWrong.supportTeam": "destek ekibi",
  "somethingWentWrong.jumpingOver": "ya da komünitemize katılın",
  "somethingWentWrong.askingCommunity": "ve topluluğumuza sorun.",
};

const specialEvent: Record<SpecialEvent, string> = {
  "special.event.easterIntro": ENGLISH_TERMS["special.event.easterIntro"],
  "special.event.rabbitsMissing": ENGLISH_TERMS["special.event.rabbitsMissing"],
  "special.event.claimForm":
    "Airdropunuzu talep etmek için lütfen aşağıdaki formu doldurun.",
  "special.event.airdropHandling":
    "Airdroplar dışarıdan gerçekleştirilir ve ulaşması birkaç gün sürebilir.",
  "special.event.walletRequired": "Cüzdan Gerekli",
  "special.event.web3Wallet":
    "Airdrop içerdiğinden bu etkinlik için bir Web3 cüzdanı gereklidir.",
  "special.event.airdrop": "Airdrop",
  "special.event.link": "Airdrop Bağlantısı",
  "special.event.finishedLabel": "Etkinlik Bitti",
  "special.event.finished":
    "Bu etkinlik sona erdi. Gelecekteki etkinlikler için bizi takip etmeye devam edin!",
  "special.event.ineligible":
    "Şu anda yapılması gereken bir iş yok, yine de uğradığınız için teşekkürler!",
};

const statements: Record<Statements, string> = {
  "statements.adventure": "Maceranıza başlayın!",
  "statements.auctioneer.one":
    "Bumpkins dostlarıma götürebileceğim egzotik hazineler bulmak için Sunflower Land’in dört bir yanını dolaştım.",
  "statements.auctioneer.two":
    "Kudretli çekicimin bir vuruşunun, zorlukla kazandığınız kaynaklarınızı nadir, üretilmiş harikalara dönüştürebileceği Açık Artırmalardan birini kaçırmayın!",
  "statements.beta.one": "Beta'ya yalnızca OG çiftçilerimiz erişebilir.",
  "statements.beta.two":
    "Güncellemeler için bizi takip etmeye devam edin. Yakında canlı yayına geçeceğiz!",
  "statements.better.luck": "Bir dahaki sefere daha iyi şanslar!",
  "statements.blacklist.one":
    "Anti-bot ve çoklu hesap tespit sistemi garip davranışlar tespit etti. Eylemler kısıtlandı.",
  "statements.blacklist.two":
    "Lütfen ayrıntıları içeren bir bilet gönderin; size geri döneceğiz.",
  "statements.clickBottle": "Tahmininize eklemek için bir şişeye tıklayın",
  "statements.clock.one":
    "Görünüşe göre saatiniz oyunla senkronize değil. Kesintileri önlemek için tarih ve saati otomatik olarak ayarlayın",
  "statements.clock.two":
    "Saatinizi senkronize etmek için yardıma mı ihtiyacınız var? Rehberimize bir göz atın!",
  "statements.conversation.one": "Senin için bir şeyim var!",
  "statements.cooldown":
    "Topluluğu korumak amacıyla bu çiftliğe erişim için 2 haftalık bir bekleme süresine ihtiyacımız var.",
  "statements.docs": "Dokümanlara git",
  "statements.dontRefresh": "Tarayıcınızı yenilemeyin!",
  "statements.guide.one": "Rehber’e gidin",
  "statements.guide.two":
    "Başlamanıza yardımcı olması için bu kılavuza göz atın.",
  "statements.jigger.one":
    "Hızlı bir selfie çekmek için 3. taraf bir hizmete yönlendirileceksiniz. Hiçbir kişisel bilgiyi veya kripto verisini asla paylaşmayın.",
  "statements.jigger.two": "Jigger İnsanlık Kanıtında başarısız oldun.",
  "statements.jigger.three":
    "Oynamaya devam edebilirsiniz ancak doğrulama sırasında bazı eylemler kısıtlanacaktır.",
  "statements.jigger.four":
    "Bunun bir hata olduğunu düşünüyorsanız lütfen support@usejigger.com adresine ulaşın.",
  "statements.jigger.five":
    "İnsanlık kanıtınız hâlâ Jigger tarafından işleniyor. Bu 2 saat kadar sürebilir.",
  "statements.jigger.six":
    "Çoklu hesap tespit sistemi garip davranışlar tespit etti.",
  "statements.lvlUp": "Seviye atlamak için Bumpkin'inizi besleyin",
  "statements.maintenance":
    "Yeni şeyler geliyor! Sabrınız için teşekkürler, oyun kısa süre sonra tekrar yayında olacak.",
  "statements.minted": "Goblinler senin işini yaptı",
  "statements.minting": "Öğeniz Blockchain'de üretilirken lütfen sabırlı olun.",
  "statements.mutant.chicken":
    "Tebrikler, tavuğunuz çok nadir görülen bir mutant tavuk yumurtladı!",
  "statements.news":
    "En son haberleri alın, işleri tamamlayın ve Bumpkin'inizi besleyin.",
  "statements.ohNo": "Oh hayır! Bir şeyler yanlış gitti!",
  "statements.openGuide": "Rehberi aç",
  "statements.patience": "Sabrınız için teşekkürler.",
  "statements.potionRule.one":
    "Amaç: Kombinasyonu bulmak. Doğru yapmak için 3 denemeniz var. Mükemmel bir iksiriniz varsa veya deneme süreniz biterse oyun sona erecektir.",
  "statements.potionRule.two":
    "İksirlerin bir kombinasyonunu seçin ve bunları karıştırmaya çalışın.",
  "statements.potionRule.three":
    "Verilen geri bildirimlere göre bir sonraki kombinasyonunuzu ayarlayın.",
  "statements.potionRule.four":
    "Oyun tamamlandığında son denemenizin puanı, ödülünüzü belirlemenize yardımcı olacaktır.",
  "statements.potionRule.five": "Mükemmel pozisyonda mükemmel bir iksir",
  "statements.potionRule.six": "Doğru iksir ama yanlış pozisyon",
  "statements.potionRule.seven": "Hata, yanlış iksir",
  "statements.sflLim.one": "Günlük SFL limitine ulaştınız.",
  "statements.sflLim.two":
    "Oynamaya devam edebilirsiniz ancak tekrar senkronizasyon için yarına kadar beklemeniz gerekecektir.",
  "statements.sniped":
    "Oh hayır! Bu takası sizden önce başka bir oyuncu satın aldı.",
  "statements.switchNetwork": "Ağ Ekle veya Değiştir",
  "statements.sync":
    "Zincirdeki tüm verilerinizi senkronize ederken lütfen sabırlı olun.",
  "statements.tapCont": "Devam etmek için dokunun",
  "statements.price.change": ENGLISH_TERMS["statements.price.change"],

  "statements.tutorial.one":
    "Tekne sizi yeni topraklar ve heyecan verici maceralar keşfedebileceğiniz adalar arasında götürecek.",
  "statements.tutorial.two":
    "Pek çok ülke çok uzaktadır ve onları ziyaret edebilmeniz için deneyimli bir Bumpkin'e ihtiyacınız olacaktır.",
  "statements.tutorial.three":
    "Maceranız şimdi başlıyor, ne kadar uzağı keşfedeceğiniz size kalmış.",
  "statements.visit.firePit":
    "Yemek pişirmek ve Bumpkin'inizi beslemek için Ateş Çukuru'nu ziyaret edin.",
  "statements.wishing.well.info.four": "likidite sağla",
  "statements.wishing.well.info.five": "oyunda",
  "statements.wishing.well.info.six": "likidite sağlanıyor",
  "statements.wishing.well.worthwell":
    ENGLISH_TERMS["statements.wishing.well.worthwell"],
  "statements.wishing.well.look.like":
    ENGLISH_TERMS["statements.wishing.well.look.like"],
  // "It doesn't look like you are providing liquidity yet.",
  "statements.wishing.well.lucky": "Bakalım ne kadar şanslısın!",
  "statements.wrongChain.one":
    "Bağlantı kurmanıza yardımcı olacak bu kılavuza göz atın.",
  "statements.feed.bumpkin.one": "Envanterinizde yiyecek yok.",
  "statements.feed.bumpkin.two":
    "Bumpkin'inizi beslemek için yemek pişirmeniz gerekecek.",
  "statements.empty.chest": "Sandığınız boş, bugün nadir eşyaları keşfedin!",
  "statements.chest.captcha": "Açmak için sandığa dokunun",
  "statements.frankie.plaza":
    "Nadir dekorasyonlar yapmak için plazaya seyahat edin!",
  "statements.blacksmith.plaza": "Daha nadir eşyalar için Plaza'ya gidin.",
  "statements.water.well.needed.one": "Ek Su Kuyusu gereklidir.",
  "statements.water.well.needed.two":
    "Daha fazla mahsulü desteklemek için bir kuyu inşa edin.",
  "statements.soldOut": "Hepsi satıldı",
  "statements.soldOutWearables": "Tükenen giyilebilir ürünleri görüntüle",
  "statements.craft.composter": "Composter'da üret",
  "statements.wallet.to.inventory.transfer": "Cüzdanınızdan eşya yatırma",
  "statements.crop.water": "Bu mahsullerin suya ihtiyacı var!",
  "statements.daily.limit": "Günlük Limit: ",
  "statements.sure.buy": "Satın almak istediğinizden emin misiniz?",
  "statements.perplayer": "Oyuncu başına",
  "statements.minted.goToChest": "Göğsünüze gidin ve onu adanıza yerleştirin",
  "statements.minted.withdrawAfterMint":
    "Darphane bittiğinde öğenizi geri çekebileceksiniz",
  "statements.startgame": "Yeni Oyuna Başla",

  "statements.session.expired":
    "Oturumunuzun süresi dolmuş gibi görünüyor. Oynamaya devam etmek için lütfen sayfayı yenileyin.",
  "statements.translation.joinDiscord":
    ENGLISH_TERMS["statements.translation.joinDiscord"],
};

const stopGoblin: Record<StopGoblin, string> = {
  "stopGoblin.stop.goblin": "Goblinleri durdurun!",
  "stopGoblin.stop.moon": "Ay Arayanları Durdurun!",
  "stopGoblin.tap.one": "Kaynaklarınızı çalmadan önce Ay Arayanlara dokunun",
  "stopGoblin.tap.two": "Yemeğinizi yemeden önce Goblinlere dokunun",
  "stopGoblin.left": "Kalan deneme sayısı: {{attemptsLeft}}",
};

const swarming: Record<Swarming, string> = {
  "swarming.tooLongToFarm":
    "Dikkat edin, mahsullerinizi yetiştirmek çok uzun sürdü!",
  "swarming.goblinsTakenOver":
    "Goblinler çiftliğinizi ele geçirdi. Gitmelerini beklemelisin",
};

const tieBreaker: Record<TieBreaker, string> = {
  "tieBreaker.tiebreaker": "Eşitliği bozan",
  "tieBreaker.closeBid":
    " Beraberliği bozan kişi, hangisi daha fazla deneyime sahip olursa olsun, Bumpkin tarafından seçilir. Ne yazık ki kaybettin.",
  "tieBreaker.betterLuck":
    "Biraz daha pasta yeme zamanı! Bir dahaki sefere daha iyi şanslar.",
  "tieBreaker.refund": "Geri ödeme kaynağı",
};

const toolDescriptions: Record<ToolDescriptions, string> = {
  // Tools
  "description.axe": "Odun toplamak için kullanılır",
  "description.pickaxe": "Taş toplamak için kullanılır",
  "description.stone.pickaxe": "Demir toplamak için kullanılır",
  "description.iron.pickaxe": "Altın toplamak için kullanılır",
  "description.rod": "Balık yakalamak için kullanılır",
  "description.rusty.shovel":
    "Binaları ve koleksiyon parçalarını kaldırmak için kullanılır",
  "description.shovel": "Bitkileri ekin ve hasat edin.",
  "description.sand.shovel": "Hazine kazmak için kullanılır",
  "description.sand.drill":
    "Sıra dışı veya nadir hazineler için derinlere inin",
  "description.gold.pickaxe": "Kızıltaş ve güneştaşı toplamak için kullanılır",
  "description.oil.drill": ENGLISH_TERMS["description.oil.drill"],
};

const trader: Record<Trader, string> = {
  "trader.you.pay": "Ödeyeceğin",
  "trader.price.per.unit": "Birim başına fiyat",
  "trader.goblin.fee": "Goblin ücreti",
  "trader.they.receive": "Alırlar",
  "trader.seller.receives": "Satıcı alır",
  "trader.buyer.pays": "Alıcı öder",
  "trader.cancel.trade": "Takası iptal et",
  "trader.you.receive": "Aldığın",
  "trader.PoH":
    "Bu özellik için insanlık kanıtı gereklidir. Lütfen hızlı bir selfie çekin.",
  "trader.start.verification": "Doğrulamayı Başlat",
};

const transactionTerms: Record<TransactionTerms, string> = {
  "transaction.starterOffer": ENGLISH_TERMS["transaction.starterOffer"],
  "transaction.t&c.one":
    "Sunflower Land'de oturum açmak için şartlar ve koşulları kabul edin.",
  "transaction.t&c.two": "Şartlar ve Koşulları kabul edin",
  "transaction.mintFarm": "Çiftliğiniz basıldı!",
  "transaction.farm.ready": "Çiftliğiniz şu tarihte hazır olacak:",
  "transaction.networkFeeRequired":
    "NFTlerinizi Blockchainde güvence altına almak için küçük bir ağ ücreti gereklidir.",
  "transaction.estimated.fee": "Tahmini ücret",
  "transaction.payCardCash": "Kart/Nakit ile Ödeme",
  "transaction.creditCard": "*Kredi kartı ücretleri uygulanır",
  "transaction.rejected": "İşlem Reddedildi!",
  "transaction.message0":
    "Devam etmek için metamask açılır penceresinde işlemi kabul etmeniz gerekir.",
  "transaction.noFee":
    "Bu istek bir blockchain işlemini tetiklemeyecek veya herhangi bir gas ücreti gerektirmeyecektir.",
  "transaction.chooseDonationGame":
    "Desteğin için teşekkürler! Lütfen bağış yapmayı sevdiğiniz oyunu seçin.",
  "transaction.minblockbucks": "Minimum 5 Block Bucks",
  "transaction.payCash": "Nakit Ödeme",
  "transaction.matic": "Matic",
  "transaction.payMatic": "MATIC ile öde",
  "transaction.storeBlockBucks": "Block Bucks çiftliğinizde saklanacaktır.",
  "transaction.excludeFees": "*Fiyatlara işlem ücretleri dahil değildir.",
  "transaction.storeProgress.blockchain.one":
    "İlerlemenizi Blockchain'de saklamak ister misiniz?",
  "transaction.storeProgress.blockchain.two":
    "Verilerin Blockchain'de saklanması mağazaların stoklarını yenilemez.",
  "transaction.storeProgress": "Mağaza ilerlemesi",
  "transaction.storeProgress.chain": "İlerlemeyi zincirde saklayın",
  "transaction.storeProgress.success":
    "Vay be! Eşyalarınız Blockchainde güvende!",
  "transaction.trade.congrats": "Tebrikler, takasınız başarılı oldu",
  "transaction.processing": "İşleminiz devam ediyor.",
  "transaction.pleaseWait":
    "Lütfen işleminizin Blockchain tarafından onaylanmasını bekleyin.",
  "transaction.unconfirmed.reset":
    "5 dakika sonra onaylanmamış tüm işlemler sıfırlanacaktır.",
  "transaction.withdraw.one": "Geri Çekiliyor",
  "transaction.withdraw.sent": "Öğeleriniz/jetonlarınız şu adrese gönderildi:",
  "transaction.withdraw.view": "Öğelerinizi şurada görüntüleyebilirsiniz:",
  "transaction.openSea": "OpenSea",
  "transaction.withdraw.four":
    "SFL Tokenini cüzdanınıza aktararak tokenlerinizi görüntüleyebilirsiniz.",
  "transaction.withdraw.five": "SFL Tokeni MetaMask'a aktarın",
  "transaction.displayItems":
    "OpenSea'nin öğelerinizi görüntülemesinin 30 dakikaya kadar sürebileceğini lütfen unutmayın. Ayrıca öğelerinizi şu adreste de görüntüleyebilirsiniz",
  "transaction.withdraw.polygon": "PolygonScan",
  "transaction.id": "Transaction ID",
  "transaction.termsOfService": "Hizmet şartlarını kabul edin",
  "transaction.termsOfService.one":
    "Çiftliğinizi satın alabilmeniz için Sunflower Land'in hizmet şartlarını kabul etmeniz gerekmektedir.",
  "transaction.termsOfService.two":
    "Bu adım, hizmet şartlarını kabul etmeniz için sizi yeni dizi cüzdanınıza geri götürecektir.",
  "transaction.buy.BlockBucks": "Block Bucks Satın Al",
};

const transfer: Record<Transfer, string> = {
  "transfer.sure.adress":
    "Lütfen sağladığınız adresin Polygon Blockchain'de olduğundan, doğru olduğundan ve size ait olduğundan emin olun. Yanlış adreslerden kurtarma mümkün değildir.",
  "transfer.Account": ENGLISH_TERMS["transfer.Account"],
  // "Your Account #{{farmID}} has been transferred to {{receivingAddress}}!",
  "transfer.Farm": "Çiftliğini transfer ediyor!",
  "transfer.Refresh": "Sayfayı yenilemeyin",
  "transfer.Taccount": "Hesabınızı aktarın",
  "transfer.address": "Cüzdan adresi: ",
};

const treasureModal: Record<TreasureModal, string> = {
  "treasureModal.noShovelTitle": "Kum Küreği Yok!",
  "treasureModal.needShovel":
    "Hazine kazabilmek için bir Kum Küreğine sahip olmanız gerekir!",
  "treasureModal.purchaseShovel":
    "Eğer satın almanız gerekiyorsa adanın güney ucundaki Hazine Dükkanına gidebilirsiniz.",
  "treasureModal.gotIt": "Anlaşıldı",
  "treasureModal.maxHolesTitle": "Maksimum deliklere ulaşıldı!",
  "treasureModal.saveTreasure": "Geri kalanımız için biraz hazine biriktirin!",
  "treasureModal.comeBackTomorrow":
    "Daha fazla hazine aramak için yarın tekrar gelin.",
  "treasureModal.drilling": "Drilling",
};

const tutorialPage: Record<TutorialPage, string> = {
  "tutorial.pageOne.text1":
    "Bu menü size yeni binaların kilidini açmak için gereken seviyeleri gösterecektir.",
  "tutorial.pageOne.text2":
    "Bunlardan bazıları belirli bir seviyeye ulaştığınızda birden çok kez inşa edilebilir.",
  "tutorial.pageTwo.text1":
    "Binalar, genişlemenize ve gelişmenize yardımcı olacağından oyunda ilerlemenin önemli bir yoludur.",
  "tutorial.pageTwo.text2":
    "Tezgahın aletler hakkında bilgi edinmesini sağlamak için Bumpkin'imizin seviyesini yükselterek başlayalım.",
};

const username: Record<Username, string> = {
  "username.tooShort": ENGLISH_TERMS["username.tooShort"],
  "username.tooLong": ENGLISH_TERMS["username.tooLong"],
  "username.invalidChar": ENGLISH_TERMS["username.invalidChar"],
  "username.startWithLetter": ENGLISH_TERMS["username.startWithLetter"],
};

const visitislandEnter: Record<VisitislandEnter, string> = {
  "visitIsland.enterIslandId": "Ada Kimliğini girin",
  "visitIsland.visit": "Ziyaret Et",
};

const visitislandNotFound: Record<VisitislandNotFound, string> = {
  "visitislandNotFound.title": "Ada Bulunamadı!",
};

const wallet: Record<Wallet, string> = {
  "wallet.connect": "Cüzdanınızı bağlayın",
  "wallet.linkWeb3": "Web3 Cüzdanını Bağlama",
  "wallet.setupWeb3":
    "Bu özelliğe erişmek için öncelikle bir Web3 cüzdanı kurmalısınız",
  "wallet.wrongWallet": "Yanlış Cüzdan",
  "wallet.connectedWrongWallet": "Yanlış cüzdana bağlısınız",
  "wallet.missingNFT": "Eksik NFT",
  "wallet.requireFarmNFT":
    "Bazı eylemler Çiftlik NFTsi gerektirir. Bu, tüm öğelerinizin Blockchainde güvende kalmasına yardımcı olur",
  "wallet.uniqueFarmNFT":
    "İlerlemenizi depolamak için benzersiz bir çiftlik NFTsi üretilecek",
  "wallet.mintFreeNFT": "Ücretsiz NFTnizi oluşturun",
  "wallet.wrongChain": "Yanlış Zincir",
  "wallet.walletAlreadyLinked": "Cüzdan zaten bağlı",
  "wallet.linkAnotherWallet": "Lütfen başka bir cüzdan bağlayın",
  "wallet.transferFarm":
    "Yeni hesabı oluşturmak için lütfen çiftliği başka bir cüzdana aktarın",
  "wallet.signRequest": "İmza",
  "wallet.signRequestInWallet":
    "Devam etmek için isteği cüzdanınızda imzalayın",
};

const warningTerms: Record<WarningTerms, string> = {
  "warning.noAxe": "Balta Seçilmedi!",
  "warning.chat.maxCharacters": "Maksimum karakter",
  "warning.chat.noSpecialCharacters": "Özel karakter yok",
  "warning.level.required": ENGLISH_TERMS["warning.level.required"], // "Level {{lvl}} required",
  "warning.hoarding.message": ENGLISH_TERMS["warning.hoarding.message"],
  // indefiniteArticle: 'a' or 'an' depending if first letter is vowel.
  // If this is not used in your language, leave the `{{indefiniteArticle}}` part out
  "warning.hoarding.indefiniteArticle.a":
    ENGLISH_TERMS["warning.hoarding.indefiniteArticle.a"], // Leave this blank if not needed
  "warning.hoarding.indefiniteArticle.an":
    ENGLISH_TERMS["warning.hoarding.indefiniteArticle.an"], // Leave this blank if not needed
  "warning.hoarding.one":
    "Söylentiye göre Goblinlerin bol miktarda kaynağa sahip çiftliklere baskın yaptıkları biliniyor.",
  "warning.hoarding.two":
    "Kendinizi korumak ve bu değerli kaynakları güvende tutmak için lütfen daha fazla kaynak toplamadan önce bunları zincir halinde senkronize edin",
  "travelRequirement.notice": "Seyahat etmeden önce seviye atlamalısınız.",
};

const welcomeTerms: Record<WelcomeTerms, string> = {
  "welcome.createAccount": "Hesap oluşturmak",
  "welcome.creatingAccount": "Hesabınız oluşturuluyor",
  "welcome.email": "E-posta ve Sosyal Giriş",
  "welcome.login": "Giriş Yap",
  "welcome.needHelp": "Yardıma mı ihtiyacınız var?",
  "welcome.otherWallets": "Diğer cüzdanlar",
  "welcome.signingIn": "Oturumunuz açılıyor",
  "welcome.signIn.Message":
    "Oturum açmak için tarayıcı cüzdanınızdaki imza isteğini kabul edin.",
  "welcome.takeover.ownership":
    "Görünüşe göre Sunflower Land'de yenisiniz ve başka bir oyuncunun hesabının sahipliğini talep etmişsiniz.",
  "welcome.promo": "Promosyon Kodu Ekle",
  "welcome.offline": ENGLISH_TERMS["welcome.offline"],
  // "Hey there Bumpkin, it looks like you aren't online. Please check your network connection.",
};

const winner: Record<Winner, string> = {
  "winner.mintTime": "Ödülünüzü üretmek için 24 saatiniz var.",
  "winner.mintTime.one": "Üretilebilecek öğe yok!",
};

const wishingWellTerms: Record<WishingWell, string> = {
  "wishingWell.makeWish":
    "Yeni bir dilek dile ve ne kadar şanslı olduğunu gör!",
  "wishingWell.newWish":
    "Mevcut LP token bakiyenize göre sizin için yeni bir dilek dile getirildi!",
  "wishingWell.noReward":
    "Hiçbir ödülünüz yok! Ödül alabilmek için likiditenin 3 gün tutulması gerekiyor!",
  "wishingWell.wish.lucky":
    "Yeni bir dilek dile ve ne kadar şanslı olduğunu gör!",
  "wishingWell.sflRewardsReceived":
    ENGLISH_TERMS["wishingWell.sflRewardsReceived"], // "You received {{reward}} SFL!",
  "wishingWell.wish.grantTime": "Dileğinizi yerine getirmenin zamanı geldi!",
  "wishingWell.wish.granted": "Dileğiniz kabul edildi.",
  "wishingWell.wish.made": "Bir dilek tuttun!",
  "wishingWell.wish.timeTillNextWish":
    "Bir sonraki dilek zamanı: {{nextWishTime}}",
  "wishingWell.wish.thanksForSupport":
    "Projeyi desteklediğiniz ve dilek tuttuğunuz için teşekkür ederiz.",
  "wishingWell.wish.comeBackAfter":
    ENGLISH_TERMS["wishingWell.wish.comeBackAfter"],
  // "Come back in {{nextWishTime}} to see just how lucky you have been!",
  "wishingWell.wish.warning.one":
    "Dilek kabul edildiğinde yalnızca dilek tutulduğu sırada elinizde bulunan LP jetonlarının dikkate alınacağını unutmayın.",
  "wishingWell.wish.warning.two":
    "Bu süre içinde likiditenizi çekerseniz herhangi bir ödül alamazsınız.",
  "wishingWell.info.one":
    "Dilek kuyusu, sadece bir dilek tutularak SFL ödüllerinin alınabileceği büyülü bir yerdir!",
  "wishingWell.info.two":
    "Oyunda likidite sağlayan çiftçilerin dilekleri yerine getirilir.",
  "wishingWell.info.three":
    "Görünüşe göre cüzdanınızda o sihirli LP jetonları var!",
  "wishingWell.noLiquidity":
    "Henüz likidite sağlıyormuşsunuz gibi görünmüyor. Daha fazla bilgi,",
  "wishingWell.rewardsInWell": "Kuyudaki ödül miktarı",
  "wishingWell.luck": "Bakalım ne kadar şanslısın!",
  "wishingWell.moreInfo": ENGLISH_TERMS["wishingWell.moreInfo"], // "More info",
};

const withdraw: Record<Withdraw, string> = {
  "withdraw.proof":
    "Bu özellik için insanlık kanıtı gereklidir. Lütfen hızlı bir selfie çekin.",
  "withdraw.verification": "Doğrulamayı Başlat",
  "withdraw.unsave": "Kaydedilmemiş ilerlemeler kaybolacaktır.",
  "withdraw.sync":
    "Yalnızca blockchain ile senkronize ettiğiniz öğeleri çekebilirsiniz.",
  "withdraw.available": "9 Mayıs’ta mevcut",
  "withdraw.sfl.available": "SFL zincir üzerinde mevcuttur",
  "withdraw.send.wallet": "Cüzdanınıza gönderildi",
  "withdraw.choose": "Çekilecek tutarı seçin",
  "withdraw.receive": "Alacaksın: {{sflReceived}}",
  "withdraw.select.item": "Geri çekilecek öğeleri seçin",
  "withdraw.opensea":
    "Geri çekildikten sonra öğelerinizi OpenSea'de görebileceksiniz.",
  "withdraw.restricted":
    "Bazı öğeler geri alınamaz. Diğer öğeler şu durumlarda kısıtlanabilir",
  "withdraw.bumpkin.wearing":
    "Bumpkin'iniz şu anda geri alınamayan aşağıdaki öğeleri giyiyor. Geri çekilmeden önce bunları donanımdan çıkarmanız gerekecek.",
  "withdraw.bumpkin.sure.withdraw":
    "Bumpkin'inizi geri çekmek istediğinizden emin misiniz?",
  "withdraw.bumpkin.closed": ENGLISH_TERMS["withdraw.bumpkin.closed"],
  "withdraw.bumpkin.closing": ENGLISH_TERMS["withdraw.bumpkin.closing"],
  "withdraw.buds": "Çekilecek Tomurcukları seçin",
  "withdraw.budRestricted": "Bugünkü tomurcuk kutusunda kullanıldı",
};

const world: Record<World, string> = {
  "world.intro.one": "Merhaba Gezgin! Balkabağı Plazasına hoş geldiniz.",
  "world.intro.two":
    "Plaza, yardımınıza ihtiyacı olan çok çeşitli aç Bumpkins ve Goblinlere ev sahipliği yapıyor!",
  "world.intro.delivery": ENGLISH_TERMS["world.intro.delivery"],
  "world.intro.levelUpToTravel": ENGLISH_TERMS["world.intro.levelUpToTravel"],
  "world.intro.find": ENGLISH_TERMS["world.intro.find"],
  "world.intro.findNPC": ENGLISH_TERMS["world.intro.findNPC"],
  "world.intro.missingDelivery": ENGLISH_TERMS["world.intro.missingDelivery"],
  "world.intro.visit":
    "NPC'leri ziyaret edin ve teslimatları tamamlayarak SFL, Coins ve nadir ödüller kazanın.",
  "world.intro.craft":
    "Farklı mağazalarda nadir koleksiyonlar, giyilebilir eşyalar ve dekorasyonlar üretin.",
  "world.intro.carf.limited":
    "Acele edin, ürünler yalnızca sınırlı bir süre için mevcut!",
  "world.intro.trade":
    "Diğer oyuncularla kaynak ticareti yapın. Bir oyuncuyla etkileşime geçmek için yakınına yürüyün ve üzerine tıklayın.",
  "world.intro.auction":
    "Kaynaklarınızı hazırlayın ve nadir koleksiyon parçaları için diğer oyuncularla rekabet etmek üzere Müzayede Evini ziyaret edin!",
  "world.intro.four":
    "Bumpkin'inizi hareket ettirmek için klavyenin yön tuşlarını kullanın",
  "world.intro.five": "Dokunmatik ekranda joystick'i kullanın.",
  "world.intro.six":
    "Bir Bumpkin veya bir nesneyle etkileşime geçmek için onun yanına yürüyün ve ona tıklayın",
  "world.intro.seven":
    "Taciz, küfür veya zorbalık yok. Başkalarına saygı duyduğunuz için teşekkür ederiz.",
  "world.plaza": ENGLISH_TERMS["world.plaza"],
  "world.beach": ENGLISH_TERMS["world.beach"],
  "world.retreat": ENGLISH_TERMS["world.retreat"],
  "world.woodlands": ENGLISH_TERMS["world.woodlands"],
  "world.home": ENGLISH_TERMS["world.home"],
  "world.kingdom": ENGLISH_TERMS["world.kingdom"],
  "world.travelTo": ENGLISH_TERMS["world.travelTo"],
};

const wornDescription: Record<WornDescription, string> = {
  "worm.earthworm": "Küçük balıkları çeken kıvranan bir solucan.",
  "worm.grub": "Sulu bir kurtçuk - üst düzey balıklar için mükemmel.",
  "worm.redWiggler": "Nadir balıkları baştan çıkaran egzotik bir solucan.",
};

const pwaInstall: Record<PwaInstall, string> = {
  "install.app": "Uygulayı İndir",
  "magic.link": "Sihirli Bağlantı",
  "generating.link": "Bağlantı Oluşturuluyor",
  "generating.code": "Kod Oluşturuluyor",
  "install.app.desktop.description":
    "Cihazınıza yüklemek için aşağıdaki kodu tarayın.",
  "install.app.mobile.metamask.description":
    "Aşağıdaki sihirli bağlantıyı kopyalayın ve açın {{browser}} yüklemek için cihazınıza!",
  "do.not.share.link": "Bu bağlantıyı paylaşmayın!",
  "do.not.share.code": "Bu kodu paylaşmayın!",
  "qr.code.not.working": "QR kodu çalışmıyor mu?",
};

const trading: Record<Trading, string> = {
  "trading.select.resources":
    "Listelemeleri görüntülemek için kaynakları seçin",
  "trading.no.listings": "Hiçbir listeleme bulunamadı",
  "trading.listing.congrats":
    "Tebrikler, ürünlerisnizi takas için listelediniz!",
  "trading.listing.deleted": "Listelemeniz Kaldırıldı",
  "trading.listing.fulfilled": "Ticaret gerçekleşti",
  "trading.your.listing": "Listelemeniz",
  "trading.you.receive": "Aldığın",
  "trading.burned": "yakılan.",
};

const restrictionReason: Record<RestrictionReason, string> = {
  "restrictionReason.isGrowing": ENGLISH_TERMS["restrictionReason.isGrowing"],
  "restrictionReason.beanPlanted":
    ENGLISH_TERMS["restrictionReason.beanPlanted"],
  "restrictionReason.cropsGrowing":
    ENGLISH_TERMS["restrictionReason.cropsGrowing"],
  "restrictionReason.?cropGrowing":
    ENGLISH_TERMS["restrictionReason.?cropGrowing"],
  "restrictionReason.basicCropsGrowing":
    ENGLISH_TERMS["restrictionReason.basicCropsGrowing"],
  "restrictionReason.mediumCropsGrowing":
    ENGLISH_TERMS["restrictionReason.mediumCropsGrowing"],
  "restrictionReason.advancedCropsGrowing":
    ENGLISH_TERMS["restrictionReason.advancedCropsGrowing"],
  "restrictionReason.fruitsGrowing":
    ENGLISH_TERMS["restrictionReason.fruitsGrowing"],
  "restrictionReason.treesChopped":
    ENGLISH_TERMS["restrictionReason.treesChopped"],
  "restrictionReason.stoneMined": ENGLISH_TERMS["restrictionReason.stoneMined"],
  "restrictionReason.ironMined": ENGLISH_TERMS["restrictionReason.ironMined"],
  "restrictionReason.goldMined": ENGLISH_TERMS["restrictionReason.goldMined"],
  "restrictionReason.crimstoneMined":
    ENGLISH_TERMS["restrictionReason.crimstoneMined"],
  "restrictionReason.chickensFed":
    ENGLISH_TERMS["restrictionReason.chickensFed"],
  "restrictionReason.treasuresDug":
    ENGLISH_TERMS["restrictionReason.treasuresDug"],
  "restrictionReason.inUse": ENGLISH_TERMS["restrictionReason.inUse"],
  "restrictionReason.recentlyUsed":
    ENGLISH_TERMS["restrictionReason.recentlyUsed"],
  "restrictionReason.recentlyFished":
    ENGLISH_TERMS["restrictionReason.recentlyFished"],
  "restrictionReason.flowersGrowing":
    ENGLISH_TERMS["restrictionReason.flowersGrowing"],
  "restrictionReason.beesBusy": ENGLISH_TERMS["restrictionReason.beesBusy"],
  "restrictionReason.pawShaken": ENGLISH_TERMS["restrictionReason.pawShaken"],
  "restrictionReason.festiveSeason":
    ENGLISH_TERMS["restrictionReason.festiveSeason"],
  "restrictionReason.noRestriction":
    ENGLISH_TERMS["restrictionReason.noRestriction"],
  "restrictionReason.genieLampRubbed":
    ENGLISH_TERMS["restrictionReason.genieLampRubbed"],
  "restrictionReason.oilReserveDrilled":
    ENGLISH_TERMS["restrictionReason.oilReserveDrilled"],
  "restrictionReason.buildingInUse":
    ENGLISH_TERMS["restrictionReason.buildingInUse"],
  "restrictionReason.beehiveInUse":
    ENGLISH_TERMS["restrictionReason.beehiveInUse"],
};

export const leaderboardTerms: Record<Leaderboard, string> = {
  "leaderboard.leaderboard": ENGLISH_TERMS["leaderboard.leaderboard"],
  "leaderboard.error": ENGLISH_TERMS["leaderboard.error"],
  "leaderboard.initialising": ENGLISH_TERMS["leaderboard.initialising"],
  "leaderboard.topTen": ENGLISH_TERMS["leaderboard.topTen"],
  "leaderboard.yourPosition": ENGLISH_TERMS["leaderboard.yourPosition"],
  "leaderboard.factionMembers": ENGLISH_TERMS["leaderboard.factionMembers"],
};

const gameOptions: Record<GameOptions, string> = {
  "gameOptions.title": ENGLISH_TERMS["gameOptions.title"],
  "gameOptions.howToPlay": "Nasıl oynanır? (Tadilatta)",
  "gameOptions.farmId": ENGLISH_TERMS["gameOptions.farmId"],
  "gameOptions.logout": "Çıkış Yap",
  "gameOptions.confirmLogout": "Oturumu kapatmak istediğinizden emin misiniz?",

  // Amoy Actions
  "gameOptions.amoyActions": ENGLISH_TERMS["gameOptions.amoyActions"],
  "gameOptions.amoyActions.timeMachine": "Zaman Makinesi",

  // Blockchain Settings
  "gameOptions.blockchainSettings":
    ENGLISH_TERMS["gameOptions.blockchainSettings"],
  "gameOptions.blockchainSettings.refreshChain":
    ENGLISH_TERMS["gameOptions.blockchainSettings.refreshChain"],
  "gameOptions.blockchainSettings.storeOnChain": "Zincirde Mağaza",
  "gameOptions.blockchainSettings.swapMaticForSFL":
    "MATIC'i SFL ile değiştirin",
  "gameOptions.blockchainSettings.transferOwnership": "Sahipliği Aktar",

  // General Settings
  "gameOptions.generalSettings": ENGLISH_TERMS["gameOptions.generalSettings"],
  "gameOptions.generalSettings.connectDiscord":
    ENGLISH_TERMS["gameOptions.generalSettings.connectDiscord"],
  "gameOptions.generalSettings.assignRole":
    ENGLISH_TERMS["gameOptions.generalSettings.assignRole"],
  "gameOptions.generalSettings.changeLanguage": "Dili değiştir",
  "gameOptions.generalSettings.darkMode":
    ENGLISH_TERMS["gameOptions.generalSettings.darkMode"],
  "gameOptions.generalSettings.lightMode":
    ENGLISH_TERMS["gameOptions.generalSettings.lightMode"],
  "gameOptions.generalSettings.font":
    ENGLISH_TERMS["gameOptions.generalSettings.font"],
  "gameOptions.generalSettings.disableAnimations": "Animasyonları Kapat",
  "gameOptions.generalSettings.enableAnimations": "Animasyonları Etkinleştir",
  "gameOptions.generalSettings.share": "Paylaş",
  "gameOptions.generalSettings.appearance": "Appearance Settings",

  // Plaza Settings
  "gameOptions.plazaSettings": "Plaza Ayarları",
  "gameOptions.plazaSettings.title.mutedPlayers": "Sessize Alınan Oyuncular",
  "gameOptions.plazaSettings.title.keybinds": "Tuş Atamaları",
  "gameOptions.plazaSettings.mutedPlayers.description":
    "Eğer /mute komutunu kullanarak bazı oyuncuları sessize aldıysanız, burada görebilir ve isterseniz onları seslerini açabilirsiniz.",
  "gameOptions.plazaSettings.keybinds.description":
    "Kullanılabilir tuş atamalarını mı öğrenmek istiyorsunuz? Buradan kontrol edin.",
  "gameOptions.plazaSettings.noMutedPlayers": "Sessize alınan oyuncunuz yok.",
  "gameOptions.plazaSettings.changeServer": "Sunucuyu Değiştirin",
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
  "easterEgg.lostKnight": ENGLISH_TERMS["easterEgg.lostKnight"],
  "easterEgg.knight": ENGLISH_TERMS["easterEgg.knight"],
  "easterEgg.kingdomBook1": ENGLISH_TERMS["easterEgg.kingdomBook1"],
  "easterEgg.kingdomBook2": ENGLISH_TERMS["easterEgg.kingdomBook2"],
  "easterEgg.kingdomBook3": ENGLISH_TERMS["easterEgg.kingdomBook3"],
  "easterEgg.kingdomBook4": ENGLISH_TERMS["easterEgg.kingdomBook4"],
  "easterEgg.kingdomBook5": ENGLISH_TERMS["easterEgg.kingdomBook5"],
};

export const TURKISH_TERMS: Record<TranslationKeys, string> = {
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
  ...bumpkinPart,
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
  ...cropMachine,
  ...cropFruitDescriptions,
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
  ...gameDescriptions,
  ...gameOptions,
  ...gameTerms,
  ...garbageCollector,
  ...generalTerms,
  ...genieLamp,
  ...getContent,
  ...getInputErrorMessage,
  ...goblin_messages,
  ...goblinTrade,
  ...goldTooth,
  ...greenhouse,
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
  ...leaderboardTerms,
  ...letsGo,
  ...levelUpMessages,
  ...loser,
  ...lostSunflorian,
  ...megaStore,
  ...milestoneMessages,
  ...minigame,
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
  ...quest,
  ...questions,
  ...reaction,
  ...reactionBud,
  ...refunded,
  ...removeHungryCaterpillar,
  ...removeKuebiko,
  ...resale,
  ...resources,
  ...resourceTerms,
  ...restock,
  ...retreatTerms,
  ...rewardTerms,
  ...rulesGameStart,
  ...rulesTerms,
  ...pwaInstall,
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
  ...trading,
  ...trader,
  ...transactionTerms,
  ...transfer,
  ...treasureModal,
  ...tutorialPage,
  ...username,
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
  ...restrictionReason,
  ...removeCropMachine,
  ...easterEggTerms,
};
