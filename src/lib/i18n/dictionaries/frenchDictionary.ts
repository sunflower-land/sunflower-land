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
  PwaInstall,
  Trader,
  NyonStatue,
  Trading,
  TimeUnits,
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
  "2x.sale": "Vente 2x",
  achievements: "Succès",
  "amount.matic": "Montant en MATIC",
  deposit: "Dépôt",
  add: "Ajouter",
  addSFL: "Ajouter SFL",
  "add.liquidity": "Ajouter de la liquidité",
  "alr.claim": "Déjà réclamé!",
  "alr.completed": "Déjà terminé",
  "alr.crafted": "Déjà fabriqué!",
  "alr.minted": "Déjà obtenu!",
  "are.you.sure": ENGLISH_TERMS["are.you.sure"],
  auction: "Enchère",
  available: "Disponible",
  back: "Retour",
  bait: "Appât",
  balance: "Solde",
  "balance.short": ENGLISH_TERMS["balance.short"],
  banner: "Bannière",
  banners: "Banners",
  basket: "Panier",
  beta: "Bêta",
  bid: "Offre",
  boosts: "Boosts",
  bounty: "Prime",
  buds: "Bourgeons",
  buff: "Buff",
  build: "Construire",
  buildings: "Bâtiments",
  buy: "Acheter",
  cancel: "Annuler",
  "card.cash": "Carte / Espèces",
  check: "Vérifier",
  chest: "Coffre",
  chicken: "Poulet",
  chill: "Détente",
  chores: "Corvées",
  "choose.wisely": "Choisissez judicieusement!",
  claim: "Réclamer",
  "claim.gift": "Réclamer un cadeau",
  "claim.skill": "Réclamer une compétence",
  clear: "Effacer",
  close: "Fermer",
  coins: ENGLISH_TERMS["coins"],
  collect: "Collecter",
  collectibles: "Objets de collection",
  "coming.soon": "Bientôt disponible",
  completed: "Terminé",
  complete: "complet",
  compost: "Compost",
  confirm: "Confirmer",
  congrats: "Félicitations!",
  connecting: "Connexion",
  continue: "Continuer",
  cook: "Cuisiner",
  copied: "Copié",
  "copy.address": "Copier l'adresse",
  "copy.failed": "Copy Failed!",
  "copy.link": "Copy Link",
  coupons: "Coupons",
  craft: "Fabriquer",
  crops: "Cultures",
  danger: "Danger",
  date: "Date",
  decorations: "Décorations",
  default: "Par défaut",
  deliver: "Livrer",
  deliveries: "Livraisons",
  "deliveries.closed": ENGLISH_TERMS["deliveries.closed"],
  delivery: "Livraison",
  details: "Détails",
  docs: "Documents",
  donate: "Donner",
  donating: "Donation",
  donations: "Donations",
  earn: "Gagner",
  "easter.eggs": "Œufs de Pâques",
  egg: "Egg",
  empty: "Vide",
  "enjoying.event": "Appréciez-vous cet événement?",
  equip: "Équiper",
  error: "Erreur",
  exchange: "Échange",
  exit: "Quitter",
  exotics: "Exotiques",
  "expand.land": "Étendre votre île",
  expand: "Étendre",
  explore: "Explorer",
  faction: "Faction",
  farm: "Ferme",
  featured: "En vedette",
  fee: "Frais",
  "feed.bumpkin": "Nourrir Bumpkin",
  fertilisers: "Fertilisants",
  fish: "Poisson",
  "fish.caught": "Poissons Capturés: ",
  flowers: "Fleurs",
  "flowers.found": "Fleurs trouvées",
  foods: "Nourritures",
  for: "pour",
  forbidden: "Interdit",
  formula: "Formule",
  free: "Gratuit",
  fruit: "Fruit",
  fruits: "Fruits",
  full: "Complet",
  gift: "Cadeau",
  "go.home": "Rentrer chez soi",
  gotIt: "Compris",
  "grant.wish": "Exaucer un vœu",
  greenhouse: ENGLISH_TERMS["greenhouse"],
  growing: ENGLISH_TERMS["growing"],
  guide: "Guide",
  honey: "Honey",
  "hungry?": "Affamé?",
  info: "Info",
  item: "Objet",
  labels: "Étiquettes",
  land: "Île",
  "last.updated": "Dernière mise à jour",
  layouts: "Mises en page",
  "lets.go": "C'est parti!",
  limit: "Limite",
  "linked.wallet": "Portefeuille lié",
  list: "Liste",
  "list.trade": "Lister un article",
  loading: "Chargement",
  locked: "Verrouillé",
  "loser.refund": "Rembourser les ressources",
  lvl: "Niveau",
  maintenance: "Maintenance",
  "make.wish": "Faire un vœu",
  "making.wish": "En train de faire un vœu",
  max: "Max",
  minimum: "Minimum",
  mint: "Frapper monnaie",
  minting: "Frappe de monnaie",
  music: "Musique",
  "new.species": "Nouvelle espèce",
  next: "Suivant",
  "next.order": "Commande suivante",
  nextSkillPtLvl: "Prochain point de compétence : niveau",
  no: "Non",
  "no.delivery.avl": "Aucune livraison disponible",
  "no.limits.exceeded": "Aucune limite dépassée",
  "no.mail": "Votre boîte aux lettres est vide.",
  "no.obsessions": "Pas d'obsessions",
  "no.thanks": "Non merci",
  "ocean.fishing": "Pêche en mer",
  off: "Éteindre",
  "offer.end": "L'offre prend fin dans ",
  ok: "OK",
  on: "Allumer",
  open: "Ouvrir",
  opensea: "Opensea",
  "open.gift": "Ouvrir un Cadeau",
  optional: ENGLISH_TERMS["optional"],
  place: "Place",
  "place.map": "Placer sur la carte",
  "place.bid": "Placez votre enchère",
  "placing.bid": "Placement d'une offre",
  plant: "Planter",
  "play.again": "Rejouer",
  "please.try.again": "Veuillez réessayer plus tard.",
  "pay.attention.feedback": "Faites attention aux icônes de retour :",
  print: "Imprimer",
  purchased: "acheté",
  purchasing: "Achat",
  rank: "Rang",
  "read.more": "Lire plus",
  recipes: "Recettes",
  reel: "Enroulé",
  refresh: "Rafraîchir",
  refreshing: "Rafraîchissement",
  remaining: "restante",
  "remaining.free.listings": ENGLISH_TERMS["remaining.free.listings"],
  "remaining.free.purchases": ENGLISH_TERMS["remaining.free.purchases"],
  "remaining.free.listing": ENGLISH_TERMS["remaining.free.listing"],
  "remaining.free.purchase": ENGLISH_TERMS["remaining.free.purchase"],
  remove: "Retirer",
  reqSkillPts: "Points de compétence requis",
  reqSkills: "Compétences requises",
  required: "Requis",
  requires: "Requiert",
  resources: "Ressources",
  restock: "Recharger",
  retry: "Réessayer",
  reward: "Récompense",
  "reward.discovered": "Récompense découverte",
  save: "Sauvegarder",
  saving: "Enregistrement",
  searching: "Recherche",
  seeds: "Graines",
  selected: "Sélectionné",
  "select.resource": "Sélectionner votre ressource: ",
  sell: "Vendre",
  "sell.all": "Tout vendre",
  "sell.one": "Vendre 1",
  "sell.ten": "Vendre 10",
  "session.expired": "Session expirée!",
  share: "Partager",
  skillPts: "Points de compétence",
  skills: "Compétences",
  skip: "Passer",
  skipping: "Saut",
  "skip.order": "Ignorer la commande",
  "sound.effects": "Effets sonores",
  special: "Spécial",
  speed: "Vitesse",
  start: "Commencer",
  submit: "Soumettre",
  submitting: "Soumission",
  success: "Succès!",
  swapping: "Échange",
  syncing: "Synchronisation",
  task: "Tâche",
  test: "Test",
  "thank.you": "Merci!",
  tools: "Outils",
  total: "Total",
  trades: "Échanges",
  trading: "Commerce",
  transfer: "Transfert",
  treasure: "Trésor",
  "try.again": "Essayer à nouveau",
  uhOh: "Oh là là!",
  "unlock.land": "Débloquer plus d'îles'",
  unlocked: "Débloqué",
  unlocking: "Déverrouillage",
  unmute: "Réactiver le son",
  "use.craft": "Utilisé pour fabriquer des objets",
  verify: "Vérifier",
  version: "Version",
  viewAll: "Voir tout",
  visit: "Visiter",
  warning: "Avertissement",
  wearables: "Vêtements",
  welcome: "Bienvenue!",
  "wishing.well": "Puits à souhaits",
  withdraw: "Retirer",
  wish: "souhait",
  yes: "Oui",
  "yes.please": "Oui, s'il vous plaît",
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
  "time.second.full": "seconde",
  "time.minute.full": "minute",
  "time.hour.full": "heure",
  "time.day.full": "jour",

  // Full Plural
  "time.seconds.full": "secondes",
  "time.minutes.full": "minutes",
  "time.hours.full": "heures",
  "time.days.full": "jours",

  // Medium Singular
  "time.sec.med": "sec",
  "time.min.med": "min",
  "time.hr.med": "hr",
  "time.day.med": "jr",

  // Medium Plural
  "time.secs.med": "secs",
  "time.mins.med": "mins",
  "time.hrs.med": "hrs",
  "time.days.med": "jrs",

  // Short
  "time.second.short": "s",
  "time.minute.short": "min",
  "time.hour.short": "h",
  "time.day.short": "j",

  // Relative Time
  "time.seconds.ago": ENGLISH_TERMS["time.seconds.ago"],
  "time.minutes.ago": ENGLISH_TERMS["time.minutes.ago"],
  "time.hours.ago": ENGLISH_TERMS["time.hours.ago"],
  "time.days.ago": ENGLISH_TERMS["time.days.ago"],
};

const achievementTerms: Record<AchievementsTerms, string> = {
  "breadWinner.description": "Gagnez 0.001 SFL",
  "breadWinner.one":
    "Eh bien, eh bien, partenaire... On dirait que vous avez besoin de SFL!",
  "breadWinner.two":
    "Dans Sunflower Land, un bon stock de SFL est la clé pour fabriquer des outils, des bâtiments et des NFT rares",
  "breadWinner.three":
    "La manière la plus rapide de gagner du SFL est en plantant et vendant des cultures.",

  "sunSeeker.description": "Récolter Sunflower 100 fois",
  "cabbageKing.description": "Récolter Cabbage 200 fois",
  "jackOLantern.description": "Récolter Pumpkin 500 fois",
  "coolFlower.description": "Récolter Cauliflower 100 fois",
  "farmHand.description": "Récolter des cultures 10 000 fois",
  "beetrootBeast.description": "Récolter Beetroot 2 000 fois",
  "myLifeIsPotato.description": "Récolter Potato 5 000 fois",
  "rapidRadish.description": "Récolter Radish 200 fois",
  "twentyTwentyVision.description": "Récolter Carrot 10 000 fois",
  "stapleCrop.description": "Récolter Wheat 10 000 fois",
  "sunflowerSuperstar.description": "Récolter Sunflower 100 000 fois",
  "bumpkinBillionaire.description": "Gagner 5 000 SFL",
  "patientParsnips.description": "Récolter Parsnip 5 000 fois",
  "cropChampion.description": "Récolter 1 million de cultures",

  "busyBumpkin.description": "Atteignez le niveau 2",
  "busyBumpkin.one":
    "Salut, mon ami ambitieux ! Pour débloquer de nouvelles cultures, extensions, bâtiments et bien plus encore, vous devrez monter de niveau.",
  "busyBumpkin.two":
    "Rendez-vous à la Fosse de Feu, préparez une recette délicieuse et donnez-la à votre Bumpkin.",

  "kissTheCook.description": "Cuisiner 20 repas",
  "bakersDozen.description": "Cuire 13 gâteaux",
  "brilliantBumpkin.description": "Atteindre le niveau 20",
  "chefDeCuisine.description": "Cuisiner 5 000 repas",

  "scarecrowMaestro.description":
    "Fabriquer un épouvantail et booster vos cultures",
  "scarecrowMaestro.one":
    "Salut, partenaire ! Il est temps d'apprendre l'art de la fabrication et d'améliorer vos capacités agricoles",
  "scarecrowMaestro.two":
    "Rendez-vous à la Pumpkin Plaza, visitez le Forgeron et fabriquez un Épouvantail.",

  "bigSpender.description": "Dépenser 10 SFL",
  "museum.description":
    "Avoir 10 types différents d'objets rares placés sur votre île",
  "highRoller.description": "Dépenser 7 500 SFL",
  "timbeerrr.description": "Couper 150 arbres",
  "craftmanship.description": "Fabriquer 100 outils",
  "driller.description": "Extraire 50 roches de pierre",
  "ironEyes.description": "Extraire 50 roches de fer",
  "elDorado.description": "Extraire 50 roches d'or",
  "timeToChop.description": "Fabriquer 500 haches",
  "canary.description": "Extraire 1 000 roches de pierre",
  "somethingShiny.description": "Extraire 500 roches de fer",
  "bumpkinChainsawAmateur.description": "Couper 5 000 arbres",
  "goldFever.description": "Extraire 500 roches d'or",

  // Explorer
  "explorer.one":
    "Rassemblons du Wood en coupant ces arbres et étendons l'île. Allez-y et trouvez la meilleure façon de le faire.",
  "expansion.description": "Étendez votre île vers de nouveaux horizons.",

  // Well of Prosperity
  "wellOfProsperity.description": "Construire un puits",
  "wellOfProsperity.one": "Eh bien, eh bien, eh bien, qu'avons-nous ici?",
  "wellOfProsperity.two":
    "Il semble que vos cultures aient soif. Pour soutenir plus de cultures, vous devez d'abord construire un puits.",

  "contractor.description": "Avoir 10 bâtiments construits sur votre île",
  "fruitAficionado.description": "Récolter 50 fruits",
  "fruitAficionado.one":
    "Salut là, cueilleur de fruits ! Les fruits sont les cadeaux les plus doux de la nature, et ils apportent une explosion de saveur à votre ferme.",
  "fruitAficionado.two":
    "En collectant différents fruits, tels que les pommes, les oranges et les myrtilles, vous débloquerez des recettes uniques, améliorerez vos compétences culinaires et créerez des friandises délicieuses",

  "orangeSqueeze.description": "Récolter une Orange 100 fois",
  "appleOfMyEye.description": "Récolter une Pomme 500 fois",
  "blueChip.description": "Récolter une Myrtille 5 000 fois",
  "fruitPlatter.description": "Récolter 50 000 fruits",
  "crowdFavourite.description": "Compléter 100 livraisons",

  "deliveryDynamo.description": "Effectuer 3 livraisons",
  "deliveryDynamo.one":
    "Salut, fermier fiable ! Les Bumpkins de partout ont besoin de votre aide pour les livraisons.",
  "deliveryDynamo.two":
    "En effectuant des livraisons, vous les rendrez heureux et gagnerez en retour de fantastiques récompenses en SFL.",

  "seasonedFarmer.description": "Collecter 50 Ressources Saisonnières",
  "seasonedFarmer.one":
    "Salut, aventurier saisonnier ! Sunflower Land est connu pour ses saisons spéciales remplies d'objets uniques et de surprises.",
  "seasonedFarmer.two":
    "En collectant des ressources saisonnières, vous aurez accès à des récompenses limitées dans le temps, des artisanats exclusifs et des trésors rares. C'est comme avoir un billet de première classe pour les merveilles de chaque saison.",
  "seasonedFarmer.three":
    "Alors, complétez des tâches, participez à des événements et rassemblez ces Tickets Saisonniers pour profiter du meilleur que Sunflower Land a à offrir!",
  "treasureHunter.description": "Creuser 10 trous",
  "treasureHunter.one":
    "Ahoy, chasseur de trésors ! Sunflower Land regorge de trésors cachés qui attendent d'être découverts.",
  "treasureHunter.two":
    "Prenez votre pelle et dirigez-vous vers l'Île au Trésor, où vous pouvez creuser pour trouver des objets précieux et de rares surprises.",
  "eggcellentCollection.description": "Collecter 10 Œufs",
  "eggcellentCollection.one":
    "Salut, collectionneur d'œufs ! Les poules sont de merveilleuses compagnes de ferme qui nous fournissent de délicieux œufs.",
  "eggcellentCollection.two":
    "En collectant des œufs, vous aurez un approvisionnement frais d'ingrédients pour la cuisine, et vous débloquerez également des recettes spéciales et des bonus.",
};

const addSFL: Record<AddSFL, string> = {
  "addSFL.swapDetails":
    "Sunflower Land offre un moyen rapide d'échanger du Matic contre du SFL via Quickswap.",
  "addSFL.referralFee":
    "Sunflower Land prend une commission de parrainage de 5% pour compléter cette transaction.",
  "addSFL.swapTitle": "Détails de l'échange",
  "addSFL.minimumReceived": "Minimum reçu: ",
};

const auction: Record<Auction, string> = {
  "auction.title": ENGLISH_TERMS["auction.title"],
  "auction.bid.message": "Vous avez placé votre enchère.",
  "auction.reveal": "Révéler les gagnants",
  "auction.live": "L'enchère est en cours!",
  "auction.requirement": "Exigences",
  "auction.start": "Heure de début",
  "auction.period": "Période de l'enchère",
  "auction.closed": "Enchère terminée",
  "auction.const": "En construction!",
  "auction.const.soon": "Cette fonctionnalité sera bientôt disponible.",
};

const availableSeeds: Record<AvailableSeeds, string> = {
  "availableSeeds.select": "Graine non sélectionnée",
  "availableSeeds.select.plant":
    "Quelle graine souhaitez-vous sélectionner et planter?",
  "quickSelect.empty": ENGLISH_TERMS["quickSelect.empty"],
  "quickSelect.label": ENGLISH_TERMS["quickSelect.label"],
  "quickSelect.cropSeeds": ENGLISH_TERMS["quickSelect.cropSeeds"],
  "quickSelect.greenhouseSeeds": ENGLISH_TERMS["quickSelect.greenhouseSeeds"],
  "quickSelect.purchase": ENGLISH_TERMS["quickSelect.purchase"],
};

const base: Record<Base, string> = {
  "base.far.away": "Vous êtes trop éloigné",
  "base.iam.far.away": "Je suis trop loin",
};

const basicTreasure: Record<BasicTreasure, string> = {
  "giftGiver.description": ENGLISH_TERMS["giftGiver.description"],
  "giftGiver.label": ENGLISH_TERMS["giftGiver.label"],

  "basic.treasure.missingKey": "Clé manquante",
  "basic.treasure.needKey":
    "Vous avez besoin d'une Treasure Key pour ouvrir ce coffre",
  "rare.treasure.needKey":
    "Vous avez besoin d'une Rare Key pour ouvrir ce coffre",
  "luxury.treasure.needKey":
    "Vous avez besoin d'une Luxury Key pour ouvrir ce coffre",
  "basic.treasure.getKey":
    "Vous pouvez obtenir des clés de trésor en accomplissant des tâches pour les Bumpkins",
  "basic.treasure.congratsKey": "Félicitations, vous avez une clé de trésor!",
  "basic.treasure.openChest":
    "Souhaitez-vous ouvrir le coffre et réclamer une récompense?",
  "budBox.open": "Ouvrir",
  "budBox.opened": "Ouvert",
  "budBox.title": "Bud Box",
  "budBox.description":
    "Chaque jour, un type de tête peut débloquer des récompenses agricoles.",
  "raffle.title": "Tombola Gobelin",
  "raffle.description":
    "Chaque mois, vous avez une chance de gagner des récompenses. Les gagnants seront annoncés sur Discord.",
  "raffle.entries": "entrées",
  "raffle.noTicket": "Billet gagnant manquant",
  "raffle.how":
    "Vous pouvez collecter des tickets de récompense gratuitement grâce à des événements spéciaux et des livraisons de Bumpkin.",
  "raffle.enter": "Entrer",
};

const beehive: Record<Beehive, string> = {
  "beehive.harvestHoney": "Récolter le Honey",
  "beehive.noFlowersGrowing": "Aucune fleur en croissance",
  "beehive.beeSwarm": "Essaim d'abeilles",
  "beehive.pollinationCelebration":
    "Célébration de la pollinisation ! Vos cultures sont gâtées avec un bonus de 0,2 grâce à un essaim d'abeilles amical!",
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
    "Salut, je suis Birdie, le Bumpkin le plus beau des environs !",
  "birdieplaza.admiringOutfit":
    "J'ai remarqué que tu admirais ma tenue. N'est-elle pas fantastique ?!?",
  "birdieplaza.currentSeason":
    "Nous sommes actuellement dans la saison {{currentSeason}} et les Bumpkins sont fous de {{seasonalTicket}}.",
  "birdieplaza.collectTickets":
    "Collecte suffisamment de {{seasonalTicket}} et tu pourras fabriquer des NFT rares. C'est ainsi que j'ai obtenu cette tenue rare !",
  "birdieplaza.whatIsSeason": "Qu'est-ce qu'une saison ?",
  "birdieplaza.howToEarnTickets":
    "Comment puis-je gagner des {{seasonalTicket}} ?",
  "birdieplaza.earnTicketsVariety":
    "Tu peux gagner des {{seasonalTicket}} de plusieurs manières.",
  "birdieplaza.commonMethod":
    "La méthode la plus courante pour gagner des {{seasonalTicket}} est de rassembler des ressources et de les livrer aux Bumpkins sur la Plaza.",
  "birdieplaza.choresAndRewards":
    "Tu peux également gagner des {{seasonalTicket}} en accomplissant des tâches pour Hank et en réclamant des récompenses quotidiennes !",
  "birdieplaza.gatherAndCraft":
    "Rassemble assez de {{seasonalTicket}} et tu pourras acheter des objets rares comme je l'ai fait.",
  "birdieplaza.newSeasonIntro":
    "Tous les 3 mois, une nouvelle saison est introduite à Sunflower Land.",
  "birdieplaza.seasonQuests":
    "Cette saison offre des quêtes excitantes et des objets de collection rares que tu peux gagner.",
  "birdieplaza.craftItems":
    "Pour obtenir ces objets rares, tu dois collecter des {{seasonalTicket}} et les échanger chez Stella's Megastore ou faire une offre à la maison de vente aux enchères.",
};

const boostDescriptions: Record<BoostDescriptions, string> = {
  // Mutant Chickens
  "description.speed.chicken.one":
    "Vos poules produiront désormais des œufs 10% plus rapidement.",
  "description.speed.chicken.two": "Produit des œufs 10% plus rapidement",
  "description.fat.chicken.one":
    "Vos poules auront désormais besoin de 10% de moins de Wheat par repas.",
  "description.fat.chicken.two":
    "10% de moins de Wheat nécessaire pour nourrir une poule",
  "description.rich.chicken.one":
    "Vos poules produiront désormais 10% de plus d'œufs.",
  "description.rich.chicken.two": "Produit 10% de plus d'œufs",
  "description.ayam.cemani": "La poule la plus rare qui existe!",
  "description.el.pollo.veloz.one":
    "Vos poules pondront des œufs 4 heures plus rapidement!",
  "description.el.pollo.veloz.two":
    "Donnez-moi ces œufs, vite ! Boost de vitesse de 4 heures sur la ponte des œufs.",
  "description.banana.chicken":
    "Une poule qui booste les bananes. Quel monde nous vivons.",
  "description.knight.chicken": ENGLISH_TERMS["description.knight.chicken"],

  // Boosts
  "description.lab.grow.pumpkin": "+0,3 de rendement en pumpkins",
  "description.lab.grown.radish": "+0,4 de rendement en Radish",
  "description.lab.grown.carrot": "+0,2 de rendement en carottes",
  "description.purple.trail":
    "Laissez vos adversaires derrière vous dans un sillage d'envie avec le sentier violet captivant et unique",
  "description.obie": "Un vaillant soldat Eggplant",
  "description.maximus": "Écrasez la concurrence avec le joufflu Maximus",
  "description.mushroom.house":
    "Une demeure fantasque pleine de champignons où les murs poussent avec charme et même les meubles ont un flair 'spore-taculaire'!",
  "description.Karkinos":
    "Pincé mais gentil, l'ajout crabe-Cabbage à votre ferme qui améliore la production de choux!",
  "description.heart.of.davy.jones":
    "Celui qui le possède détient un immense pouvoir sur les sept mers, peut creuser des trésors sans se fatiguer",
  "description.tin.turtle":
    "La Tortue d'Étain ajoute +0,1 aux pierres que vous minez dans sa zone d'effet.",
  "description.emerald.turtle":
    "La Tortue d'Émeraude ajoute +0,5 à tous les minéraux que vous minez dans sa zone d'effet.",
  "description.iron.idol":
    "L'Idole ajoute 1 fer à chaque fois que vous minez du fer.",
  "description.crim.peckster":
    "Un détective de gemmes avec un talent pour déterrer des Crimstones.",
  "description.skill.shrimpy":
    "Shrimpy est là pour vous aider ! Il s'assurera que vous obteniez de l'XP supplémentaire des poissons.",
  "description.soil.krabby":
    "Tamisage rapide avec le sourire ! Profitez d'une augmentation de vitesse de 10% de la compostière avec ce champion crustacé.",
  "description.nana":
    "Cette beauté rare est un moyen sûr d'augmenter votre récolte de bananes.",
  "description.grain.grinder":
    "Moulez votre grain et ressentez une montée délectable de l'XP du gâteau.",
  "description.kernaldo": "Le chuchoteur de maïs magique.",
  "description.kernaldo.1":
    "Le chuchoteur de maïs magique. +25% de vitesse de croissance du Corn.",
  "description.poppy": "Le noyau de maïs mystique.",
  "description.poppy.1": "Le noyau de maïs mystique. +0,1 de Corn par récolte,",
  "description.victoria.sisters": "Les sœurs amatrices de pumpkins",
  "description.undead.rooster":
    "Une victime malheureuse de la guerre. 10% de rendement en œufs supplémentaire.",
  "description.observatory":
    "Explorez les étoiles et améliorez le développement scientifique",
  "description.engine.core": "Le pouvoir du tournesol",
  "description.time.warp.totem":
    "Vitesse x2 pour les cultures, les arbres, la cuisine et les minéraux. Ne dure que 2 heures",
  "description.time.warp.totem.expired":
    "Votre Totem de Déformation Temporelle a expiré. Rendez-vous à la Pumpkin Plaza pour découvrir et fabriquer plus d'objets magiques pour booster vos capacités agricoles!",
  "description.time.warp.totem.temporarily":
    "Le Totem de Déformation Temporelle booste temporairement votre temps de cuisson, vos cultures, vos arbres et vos minéraux. Profitez-en au maximum!",
  "description.cabbage.boy": "Ne réveillez pas le bébé!",
  "description.cabbage.girl": "Chut, il dort",
  "description.wood.nymph.wendy":
    "Lancez un enchantement pour attirer les fées de la forêt.",
  "description.peeled.potato":
    "Une précieuse potato, encourage les potato bonus à la récolte.",
  "description.potent.potato":
    "Puissant ! Donne une chance de 3% d'obtenir +10 potato à la récolte.",
  "description.radical.radish":
    "Radical ! Donne une chance de 3% d'obtenir +10 Radish à la récolte.",
  "description.stellar.sunflower":
    "Stellaire ! Donne une chance de 3% d'obtenir +10 Sunflowers à la récolte.",
  "description.lady.bug":
    "Un incroyable insecte qui se nourrit de pucerons. Améliore la qualité des pommes.",
  "description.squirrel.monkey":
    "Un prédateur naturel des oranges. Les arbres d'orange ont peur quand un Singe Écureuil est dans les parages.",
  "description.black.bearry":
    "Sa gourmandise préférée - des myrtilles dodues et juteuses. Il les engloutit par poignées!",
  "description.maneki.neko":
    "Le chat qui fait signe. Tirez sur son bras et la bonne chance viendra",
  "description.easter.bunny": "Un objet de Pâques rare",
  "description.pablo.bunny": "Un lapin de Pâques magique",
  "description.foliant": "Un livre de sorts.",
  "description.tiki.totem":
    "Le Totem Tiki ajoute 0,1 de Wood à chaque arbre que vous coupez.",
  "description.lunar.calendar":
    "Les cultures suivent désormais le cycle lunaire ! Augmentation de 10% de la vitesse de croissance des cultures.",
  "description.heart.davy.jones":
    "Celui qui le possède détient un immense pouvoir sur les sept mers, peut creuser des trésors sans se fatiguer.",
  "description.treasure.map":
    "Une carte enchantée qui guide son détenteur vers un trésor précieux. +20% de profit sur les objets de la chasse à la plage.",
  "description.genie.lamp":
    "Une lampe magique contenant un génie qui vous accordera trois vœux.",
  "description.basic.scarecrow": ENGLISH_TERMS["description.basic.scarecrow"],
  "description.scary.mike": ENGLISH_TERMS["description.scary.mike"],
  "description.laurie.chuckle.crow":
    ENGLISH_TERMS["description.laurie.chuckle.crow"],
  "description.immortal.pear": ENGLISH_TERMS["description.immortal.pear"],
  "description.bale":
    "Le voisin préféré de la volaille, offrant une retraite confortable aux poules",
  "description.sir.goldensnout":
    "Un membre de la royauté, Sir Goldensnout infuse votre ferme d'une prospérité souveraine grâce à son fumier doré.",
  "description.freya.fox":
    "Gardienne enchanteresse, stimule la croissance des pumpkins avec son charme mystique. Récoltez des pumpkins abondantes sous son regard vigilant.",
  "description.queen.cornelia":
    "Commandez le pouvoir royal de la Reine Cornelia et bénéficiez d'un magnifique boost de zone d'effet pour votre production de Corn. +1 de Corn.",
};

const boostEffectDescriptions: Record<BoostEffectDescriptions, string> = {
  "description.obie.boost": "-25% Temps de croissance de l'aubergine",
  "description.purple.trail.boost": "+0.2 Eggplant",
  "description.freya.fox.boost": "+0.5 pumpkin",
  "description.sir.goldensnout.boost": "+0.5 Récolte (AOE 4x4)",
  "description.maximus.boost": "+1 Eggplant",
  "description.basic.scarecrow.boost":
    "-20% Temps de croissance des cultures de base : Tournesol, potato et pumpkin (AOE 3x3)",
  "description.scary.mike.boost":
    "+0.2 Culture moyenne : Carotte, Cabbage, Soya, Betterave, Cauliflower et Parsnip (AOE 3x3)",
  "description.laurie.chuckle.crow.boost":
    "+0.2 Culture avancée: Eggplant, Corn, Radish, Wheat, Kale (AOE 3x3)",
  "description.bale.boost": "+0.2 Egg (AOE 4x4)",
  "description.immortal.pear.boost":
    ENGLISH_TERMS["description.immortal.pear.boost"],
  "description.treasure.map.boost": "+20% Coins sur les ventes de trésors",
  "description.poppy.boost": "+0.1 Corn",
  "description.kernaldo.boost": "-25% Temps de croissance du Wheat",
  "description.grain.grinder.boost": "+20% XP de gâteau",
  "description.nana.boost": "-10% Temps de croissance de la banana",
  "description.soil.krabby.boost": "-10% Temps de compostage du composteur",
  "description.skill.shrimpy.boost": "+20% XP de poisson",
  "description.iron.idol.boost": "+1 Fer",
  "description.emerald.turtle.boost": "+0.5 Stone, Iron, Gold (AOE 3x3)",
  "description.tin.turtle.boost": "+0.1 Stone (AOE 3x3)",
  "description.heart.of.davy.jones.boost": "+20 Limite de creusage quotidienne",
  "description.Karkinos.boost": "+0.1 Cabbage (Inactif avec Cabbage Boy)",
  "description.mushroom.house.boost": "+0.2 Champignon sauvage",
  "description.boost.gilded.swordfish": "+0.1 Or",
  "description.nancy.boost": "-15% Temps de croissance des cultures",
  "description.scarecrow.boost":
    "-15% Temps de croissance des cultures ; +20% Rendement des cultures",
  "description.kuebiko.boost":
    "-15% Temps de croissance des cultures ; +20% Rendement des cultures ; Graines gratuites",
  "description.gnome.boost":
    "+10 Rendement pour les cultures moyennes/avancées (Parcelle AOE en dessous)",
  "description.lunar.calendar.boost": "-10% Temps de croissance des cultures",
  "description.peeled.potato.boost": "20% Chance d'obtenir +1 potato",
  "description.victoria.sisters.boost": "+20% pumpkin",
  "description.easter.bunny.boost": "+20% Carot",
  "description.pablo.bunny.boost": "+0.1 Carot",
  "description.cabbage.boy.boost": "+0.25 Cabbage (+0.5 avec Cabbage Girl)",
  "description.cabbage.girl.boost": "-50% Temps de croissance du Cabbage",
  "description.golden.cauliflower.boost": "+100% Cauliflower",
  "description.mysterious.parsnip.boost": "-50% Temps de croissance du Parsnip",
  "description.queen.cornelia.boost": "+1 Corn (AOE 3x4)",
  "description.foliant.boost": "+0.2 Kale",
  "description.hoot.boost": "+0.5 Blé, Radis, Chou Frisé, Riz",
  "description.hungry.caterpillar.boost": "Graines de fleurs gratuites",
  "description.black.bearry.boost": "+1 Myrtille",
  "description.squirrel.monkey.boost": "-50% Temps de croissance de l'orange",
  "description.lady.bug.boost": "+0.25 Pomme",
  "description.banana.chicken.boost": "+0.1 Banane",
  "description.carrot.sword.boost": "Chance x4 d'obtenir une culture mutante",
  "description.stellar.sunflower.boost": "Chance de 3% d'obtenir +10 Tournesol",
  "description.potent.potato.boost": "Chance de 3% d'obtenir +10 potato",
  "description.radical.radish.boost": "Chance de 3% d'obtenir +10 Radish",
  "description.lg.pumpkin.boost": "+0.3 pumpkin",
  "description.lg.carrot.boost": "+0.2 Carotte",
  "description.lg.radish.boost": "+0.4 Radish",
  "description.fat.chicken.boost": "-0.1 Wheat pour nourrir les poulets",
  "description.rich.chicken.boost": "+0.1 Egg",
  "description.speed.chicken.boost": "-10% Temps de production des Eggs",
  "description.ayam.cemani.boost": "+0.2 Egg",
  "description.el.pollo.veloz.boost": "-4h Temps de production des Eggs",
  "description.rooster.boost": "Chance x2 d'obtenir un poulet mutant",
  "description.undead.rooster.boost": "+0.1 Egg",
  "description.chicken.coop.boost":
    "+1 Rendement en Eggs ; +5 Limite de poulets par poulailler",
  "description.gold.egg.boost": "Nourrir les poulets sans Wheat",
  "description.woody.beaver.boost": "+20% Wood",
  "description.apprentice.beaver.boost":
    "+20% Wood ; -50% Temps de récupération des arbres",
  "description.foreman.beaver.boost":
    "+20% Wood ; -50% Temps de récupération des arbres ; Couper les arbres sans haches",
  "description.wood.nymph.wendy.boost": "+0.2 Wood",
  "description.tiki.totem.boost": "+0.1 Wood",
  "description.tunnel.mole.boost": "+0.25 Pierre",
  "description.rocky.mole.boost": "+0.25 Fer",
  "description.nugget.boost": "+0.25 Or",
  "description.rock.golem.boost": "Chance de 10% d'obtenir +2 Pierre",
  "description.crimson.carp.boost": "+0.05 Crimstone",
  "description.battle.fish.boost":
    ENGLISH_TERMS["description.battle.fish.boost"],
  "description.crim.peckster.boost": "+0.1 Crimstone",
  "description.knight.chicken.boost":
    ENGLISH_TERMS["description.knight.chicken.boost"],
  "description.queen.bee.boost": "+1 de vitesse de production de Honey",
  "description.beekeeper.hat.boost": "+0.2 de vitesse de production de Honey",
  "description.flower.fox.boost": "-10% Temps de Croissance des Fleurs",
  "description.humming.bird.boost": "Chance de 20% d'obtenir +1 Fleur",
  "description.beehive.boost":
    "Chance de 10% d'obtenir +0.2 Culture lorsque la ruche est pleine",
  "description.walrus.boost": "+1 Poisson",
  "description.alba.boost": "50% Chance d'obtenir +1 Poisson de base",
  "description.knowledge.crab.boost":
    "Double l'effet de boost de mélange de germination",
  "description.maneki.neko.boost": "1 Nourriture gratuite par jour",
  "description.genie.lamp.boost": "Accorde 3 souhaits",
  "description.observatory.boost": "+5% XP",
  "description.blossombeard.boost": "+10% XP",
  "description.desertgnome.boost":
    ENGLISH_TERMS["description.desertgnome.boost"],
  "description.christmas.festive.tree.boost": "Cadeau gratuit à Noël",
  "description.grinxs.hammer.boost": "Réduit de moitié les coûts d'expansion",
  "description.time.warp.totem.boost":
    "Réduction de 50% du temps de croissance des cultures, minéraux, cuisine et arbres",
  "description.radiant.ray.boost": "+0.1 Fer",
  "description.babyPanda.boost": "Beginner 2x XP Boost",
  "description.hungryHare.boost": "Fermented Carrots 2x XP",
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
  "description.clam.shell": "Une coquille de palourde.",
  "description.sea.cucumber": "Un concombre de mer.",
  "description.coral": "Un morceau de corail, c'est joli",
  "description.crab": "Un crabe, attention à ses pinces!",
  "description.starfish": "L'étoile de la mer.",
  "description.pirate.bounty":
    "Une prime pour un pirate. Elle vaut beaucoup d'argent.",
  "description.wooden.compass":
    "Il n'est peut-être pas high-tech, mais il vous orientera toujours dans la bonne direction, vous le croyez en bois?",
  "description.iron.compass":
    "Redressez votre chemin vers le trésor ! Ce compas est 'attirant', et pas seulement vers le Nord magnétique!",
  "description.emerald.compass":
    "Guidez votre chemin à travers les mystères luxuriants de la vie ! Ce compas ne pointe pas seulement vers le Nord, il pointe vers l'opulence et la grandeur!",
  "description.old.bottle":
    "Bouteille de pirate antique, évoquant des récits d'aventures en haute mer.",
  "description.pearl": "Brille au soleil.",
  "description.pipi": "Plebidonax deltoides, trouvé dans l'océan Pacifique.",
  "description.seaweed": "Des algues marines.",
};

const buildingDescriptions: Record<BuildingDescriptions, string> = {
  // Bâtiments
  "description.water.well": "Les cultures ont besoin d'eau!",
  "description.kitchen": "Améliorez vos compétences en cuisine",
  "description.compost.bin":
    "Produit régulièrement de l'appât et de l'engrais.",
  "description.hen.house": "Développez votre empire de poulets",
  "description.bakery": "Préparez vos gâteaux préférés",
  "description.greenhouse": ENGLISH_TERMS["description.greenhouse"],
  "description.turbo.composter":
    "Produit régulièrement de l'appât et de l'engrais avancés.",
  "description.deli": "Satisfaites votre appétit avec ces mets délicats!",
  "description.smoothie.shack": "Pressé à froid!",
  "description.warehouse": "Augmentez vos stocks de graines de 20 %",
  "description.toolshed": "Augmentez votre stock d'outils d'établi de 50 %",
  "description.premium.composter":
    "Produit régulièrement de l'appât et de l'engrais experts.",
  "description.town.center":
    "Rassemblez-vous autour du centre-ville pour les dernières nouvelles",
  "description.market": "Achetez et vendez au marché des fermiers",
  "description.fire.pit":
    "Faites griller vos Sunflowers, nourrissez et améliorez votre Bumpkin",
  "description.workbench": "Fabriquez des outils pour collecter des ressources",
  "description.tent": "(Arrêté)",
  "description.house": "Un endroit où reposer votre tête",
  "description.crop.machine": ENGLISH_TERMS["description.crop.machine"],
  "building.oil.remaining": ENGLISH_TERMS["building.oil.remaining"],
  "cooking.building.oil.description":
    ENGLISH_TERMS["cooking.building.oil.description"],
  "cooking.building.oil.boost": ENGLISH_TERMS["cooking.building.oil.boost"],
  "cooking.building.runtime": ENGLISH_TERMS["cooking.building.runtime"],
};

const bumpkinDelivery: Record<BumpkinDelivery, string> = {
  "bumpkin.delivery.selectFlower": "Sélectionne une fleur",
  "bumpkin.delivery.noFlowers": "Oh non, tu n'as pas de fleurs à offrir!",
  "bumpkin.delivery.thanks": "Merci beaucoup, Bumpkin !!!",
  "bumpkin.delivery.waiting":
    "J'attendais ça. Merci beaucoup ! Reviens bientôt pour plus de livraisons.",
  "bumpkin.delivery.proveYourself":
    "Prouve que tu es digne. Agrandis ton île {{missingExpansions}} fois de plus.",
};

const bumpkinItemBuff: Record<BumpkinItemBuff, string> = {
  "bumpkinItemBuff.chef.apron.boost": "+20 % de profit de gâteau",
  "bumpkinItemBuff.fruit.picker.apron.boost": "+0,1 Fruit",
  "bumpkinItemBuff.angel.wings.boost":
    "30 % de chances de récoltes instantanées",
  "bumpkinItemBuff.devil.wings.boost":
    "30 % de chances de récoltes instantanées",
  "bumpkinItemBuff.eggplant.onesie.boost": "+0,1 Eggplant",
  "bumpkinItemBuff.golden.spatula.boost": "+10 % d'XP",
  "bumpkinItemBuff.mushroom.hat.boost": "+0,1 Champignons",
  "bumpkinItemBuff.parsnip.boost": "+20 % de Parsnip",
  "bumpkinItemBuff.sunflower.amulet.boost": "+10 % de Tournesol",
  "bumpkinItemBuff.carrot.amulet.boost":
    "-20 % de temps de croissance des Carottes",
  "bumpkinItemBuff.beetroot.amulet.boost": "+20 % de Betterave",
  "bumpkinItemBuff.green.amulet.boost": "Chance 10x pour les cultures",
  "bumpkinItemBuff.Luna.s.hat.boost": "-50 % de temps de cuisson",
  "bumpkinItemBuff.infernal.pitchfork.boost": "+3 Cultures",
  "bumpkinItemBuff.cattlegrim.boost": "+0,25 Produit animal",
  "bumpkinItemBuff.corn.onesie.boost": "+0,1 Corn",
  "bumpkinItemBuff.sunflower.rod.boost": "10 % de chance d'obtenir +1 Poisson",
  "bumpkinItemBuff.trident.boost": "20 % de chance d'obtenir +1 Poisson",
  "bumpkinItemBuff.bucket.o.worms.boost": "+1 Ver",
  "bumpkinItemBuff.luminous.anglerfish.topper.boost": "+50 % d'XP de Pêche",
  "bumpkinItemBuff.angler.waders.boost": "+10 Limite de Pêche",
  "bumpkinItemBuff.ancient.rod.boost": "Lancer sans canne à pêche",
  "bumpkinItemBuff.banana.amulet.boost": "+0,5 Bananes",
  "bumpkinItemBuff.banana.boost": "+20 % de Vitesse de Banane",
  "bumpkinItemBuff.deep.sea.helm":
    "Chances x3 d'obtenir des Merveilles Marines",
  "bumpkinItemBuff.bee.suit": ENGLISH_TERMS["bumpkinItemBuff.bee.suit"],
  "bumpkinItemBuff.crimstone.hammer": "+2 Crimstones à la 5e mine",
  "bumpkinItemBuff.crimstone.amulet": "20 % de vitesse de Crimstone",
  "bumpkinItemBuff.crimstone.armor": "+0,1 Crimstones",
  "bumpkinItemBuff.hornet.mask": "Chances x2 d'obtenir un Essaim d'Abeilles",
  "bumpkinItemBuff.honeycomb.shield":
    ENGLISH_TERMS["bumpkinItemBuff.honeycomb.shield"],
  "bumpkinItemBuff.flower.crown": "Vitesse des fleurs x2",
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
  "equip.missingHair": "Les cheveux sont nécessaires",
  "equip.missingBody": "Le corps est nécessaire",
  "equip.missingShoes": "Les chaussures sont nécessaires",
  "equip.missingShirt": "La chemise est nécessaire",
  "equip.missingPants": "Le pantalon est nécessaire",
  "equip.missingBackground": "L'arrière-plan est nécessaire",
};

const bumpkinSkillsDescription: Record<BumpkinSkillsDescription, string> = {
  // Crops
  "description.green.thumb": "Les cultures rapportent 5 % de plus",
  "description.cultivator": "Les cultures poussent 5 % plus vite",
  "description.master.farmer": "Les cultures rapportent 10 % de plus",
  "description.golden.flowers":
    "Chance pour les Sunflowers de laisser tomber du Gold",
  "description.happy.crop": "Chance d'obtenir des cultures doublées",
  // Trees
  "description.lumberjack": "Les arbres rapportent 10 % de plus",
  "description.tree.hugger": "Les arbres repoussent 20 % plus vite",
  "description.tough.tree": "Chance d'obtenir des arbres triplés",
  "description.money.tree": "Chance d'obtenir des pièces coins",
  // Roches
  "description.digger": "Les pierres rapportent 10 % de plus",
  "description.coal.face": "Les pierres se régénèrent 20 % plus vite",
  "description.seeker": "Attire les monstres de pierre",
  "description.gold.rush": "Chance d'obtenir 2,5 fois plus d'or",
  // Cooking
  "description.rush.hour": "Cuisine 10 % plus vite",
  "description.kitchen.hand":
    "Les repas rapportent 5 % d'expérience supplémentaire",
  "description.michelin.stars":
    "Nourriture de haute qualité, rapporte 5 % de plus en SFL",
  "description.curer":
    "La consommation de produits de la boucherie ajoute 15 % d'expérience supplémentaire",
  // Animals
  "description.stable.hand": "Les animaux produisent 10 % plus rapidement",
  "description.free.range": "Les animaux produisent 10 % de plus",
  "description.horse.whisperer": "Augmente les chances d'obtenir des mutants",
  "description.buckaroo": "Chance d'obtenir des doubles récoltes",
};

const bumpkinTrade: Record<BumpkinTrade, string> = {
  "bumpkinTrade.minLevel": "Vous devez être niveau 10 pour commercer",
  "bumpkinTrade.noTradeListed": "Vous n'avez aucune annonce en cours.",
  "bumpkinTrade.sell":
    "Vendez vos ressources à d'autres joueurs contre des SFL.",
  "bumpkinTrade.like.list": "Que souhaitez-vous mettre en annonce?",
  "bumpkinTrade.purchase": "Acheter aux Goblin Retreat",

  "bumpkinTrade.available": "Disponible",
  "bumpkinTrade.quantity": "Quantité",
  "bumpkinTrade.price": "Prix",
  "bumpkinTrade.listingPrice": "Prix catalogue",
  "bumpkinTrade.pricePerUnit": "Prix par {{resource}}",
  "bumpkinTrade.tradingFee": "Frais de négociation",
  "bumpkinTrade.youWillReceive": "Vous recevrez",
  "bumpkinTrade.cancel": "Annuler",
  "bumpkinTrade.list": "Liste",
  "bumpkinTrade.maxListings": "Nombre maximum d'annonces atteint",
  "bumpkinTrade.max": "Max : {{max}}",
  "bumpkinTrade.min": "Min : {{min}}",
  "bumpkinTrade.minimumFloor": ENGLISH_TERMS["bumpkinTrade.minimumFloor"],
  "bumpkinTrade.maximumFloor": ENGLISH_TERMS["bumpkinTrade.maximumFloor"],
  "bumpkinTrade.floorPrice": "Prix minimum : {{price}} SFL",
  "bumpkinTrade.price/unit": "{{price}} / unité",
  "bumpkinTrade.sellConfirmation":
    ENGLISH_TERMS["bumpkinTrade.sellConfirmation"],
  "bumpkinTrade.cant.sell.all": ENGLISH_TERMS["bumpkinTrade.cant.sell.all"],
};

const goblinTrade: Record<GoblinTrade, string> = {
  "goblinTrade.bulk": "Quantité en vrac",
  "goblinTrade.conversion": "Conversion",
  "goblinTrade.select": "Sélectionnez la ressource à vendre",
  "goblinTrade.hoarding": "Oh non ! Vous avez atteint le maximum de SFL.",
  "goblinTrade.vipRequired": "Accès VIP requis",
  "goblinTrade.vipDelivery":
    "Hmmm, on dirait que vous êtes un Bumpkin de base. Je ne commerce qu'avec les VIP.",
};

const buyFarmHand: Record<BuyFarmHand, string> = {
  "buyFarmHand.howdyBumpkin": "Salut Bumpkin.",
  "buyFarmHand.confirmBuyAdditional":
    "Êtes-vous sûr de vouloir acheter un Bumpkin supplémentaire?",
  "buyFarmHand.farmhandCoupon": "1 Coupon de fermier",
  "buyFarmHand.adoptBumpkin": "Adoptez un Bumpkin",
  "buyFarmHand.additionalBumpkinsInfo":
    "Les Bumpkins supplémentaires peuvent être utilisés pour équiper des vêtements et améliorer votre ferme.",
  "buyFarmHand.notEnoughSpace": "Pas assez d'espace - améliorez votre île",
  "buyFarmHand.buyBumpkin": "Acheter un Bumpkin",
  "buyFarmHand.newFarmhandGreeting":
    "Je suis votre nouveau fermier. J'ai hâte de commencer à travailler!",
};

const changeLanguage: Record<ChangeLanguage, string> = {
  "changeLanguage.confirm": ENGLISH_TERMS["changeLanguage.confirm"],
  "changeLanguage.contribute": ENGLISH_TERMS["changeLanguage.contribute"],
  "changeLanguage.contribute.message":
    ENGLISH_TERMS["changeLanguage.contribute.message"],
};

const chat: Record<Chat, string> = {
  "chat.Fail": "Échec de la connexion",
  "chat.mute": "Vous êtes en mode muet",
  "chat.again": "Vous pourrez discuter à nouveau dans",
  "chat.Kicked": "Expulsé",
};

const chickenWinner: Record<ChickenWinner, string> = {
  "chicken.winner.playagain": "Cliquez ici pour rejouer",
};

const choresStart: Record<ChoresStart, string> = {
  "chores.harvestFields": "Récolter les champs",
  "chores.harvestFieldsIntro":
    "Ces champs ne se récolteront pas tout seuls. Récoltez 3 Sunflowers.",
  "chores.earnSflIntro":
    "Si vous voulez réussir dans le monde de l'agriculture, vous feriez mieux de commencer par vendre des Sunflowers, acheter des graines et récolter les bénéfices.",
  "chores.reachLevel": "Atteindre le niveau 2",
  "chores.reachLevelIntro":
    "Si vous voulez monter de niveau et débloquer de nouvelles compétences, vous feriez mieux de cuisiner de la nourriture et de la déguster.",
  "chores.chopTrees": "Couper 3 arbres",
  "chores.helpWithTrees":
    "Mes vieux os ne sont plus ce qu'ils étaient, pensez-vous que vous pourriez me donner un coup de main avec ces maudits arbres à abattre ? Notre forgeron local vous aidera à fabriquer quelques outils.",
  "chores.noChore": "Désolé, je n'ai pas de tâches à faire pour le moment.",
  "chores.newSeason":
    "Une nouvelle saison approche, les tâches seront temporairement fermées.",
  "chores.choresFrozen": ENGLISH_TERMS["chores.choresFrozen"],
  "chores.left": ENGLISH_TERMS["chores.left"],
};

const chumDetails: Record<ChumDetails, string> = {
  "chumDetails.gold": "L'or scintillant peut être vu à 100 miles à la ronde",
  "chumDetails.iron":
    "Un éclat scintillant, visible sous tous les angles au crépuscule",
  "chumDetails.stone":
    "Peut-être qu'en jetant quelques pierres, vous attirerez des poissons",
  "chumDetails.egg":
    "Hmm, je ne suis pas sûr que les poissons aiment les œufs...",
  "chumDetails.sunflower":
    "Un appât ensoleillé et vibrant pour les poissons curieux.",
  "chumDetails.potato": "Les potato font un festin aquatique inhabituel.",
  "chumDetails.pumpkin":
    "Les poissons pourraient être intrigués par la lueur orange des pumpkins.",
  "chumDetails.carrot":
    "Meilleur utilisé avec des vers de terre pour attraper des anchois!",
  "chumDetails.cabbage":
    "Une tentation feuillue pour les herbivores sous-marins.",
  "chumDetails.beetroot":
    "Betteraves, le délice sous-marin des poissons audacieux.",
  "chumDetails.cauliflower":
    "Les poissons peuvent trouver les fleurons étrangement séduisants.",
  "chumDetails.parsnip":
    "Un appât terrestre et racinaire pour les poissons curieux.",
  "chumDetails.eggplant":
    "Aubergines : l'aventure aquatique pour les poissons téméraires.",
  "chumDetails.corn": "Le maïs en épi - une friandise étrange mais intrigante.",
  "chumDetails.radish": "Les Radish, le trésor enfoui des animaux aquatiques.",
  "chumDetails.wheat":
    "Le Wheat, un délice granuleux pour les fouilleurs sous-marins.",
  "chumDetails.kale": "Une surprise verte feuillue pour les poissons curieux.",
  "chumDetails.blueberry":
    "Souvent confondu par les poissons bleus comme des partenaires potentiels.",
  "chumDetails.orange":
    "Oranges, la curiosité citronnée pour les créatures marines.",
  "chumDetails.apple": "Les pommes - un mystère croquant sous les vagues.",
  "chumDetails.banana": "Plus léger que l'eau!",
  "chumDetails.seaweed":
    "Un goût de l'océan dans une collation sous-marine feuillue.",
  "chumDetails.crab":
    "Un morceau alléchant pour un poisson sous-marin curieux.",
  "chumDetails.anchovy":
    "Anchois, mystérieusement séduisants pour les hors-la-loi de la mer.",
  "chumDetails.redSnapper": "Un mystère caché dans les profondeurs de l'océan.",
  "chumDetails.tuna": "Qu'est-ce qui est assez gros pour manger un thon?",
  "chumDetails.squid": "Réveillez une raie avec sa friandise préférée!",
  "chumDetails.wood": "Du Wood. Un choix intéressant....",
  "chumDetails.redPansy": "Attrait ardent pour les poissons insaisissables.",
  "chumDetails.fatChicken":
    "La viande blanche originale que les plus grandes proies ne peuvent résister.",
  "chumDetails.speedChicken":
    "Dessert de restauration rapide pour les chasseurs aux dents acérées.",
  "chumDetails.richChicken":
    "Délice pour la terreur au ventre lumineux de l'écran.",
  "chumDetails.horseMackerel": ENGLISH_TERMS["chumDetails.horseMackerel"],
  "chumDetails.sunfish": ENGLISH_TERMS["chumDetails.sunfish"],
};

const claimAchievement: Record<ClaimAchievement, string> = {
  "claimAchievement.alreadyHave": "Vous avez déjà obtenu cette réalisation",
  "claimAchievement.requirementsNotMet":
    "Vous ne remplissez pas les conditions requises",
};

const community: Record<Community, string> = {
  "community.toast": "Le texte du toast est vide",
  "community.url": "Entrez l'URL de votre dépôt",
  "comunity.Travel": "Voyagez vers les îles construites par la communauté",
};

const compostDescription: Record<CompostDescription, string> = {
  "compost.fruitfulBlend": ENGLISH_TERMS["compost.fruitfulBlend"],
  "compost.sproutMix": ENGLISH_TERMS["compost.sproutMix"],
  "compost.sproutMixBoosted": ENGLISH_TERMS["compost.sproutMixBoosted"],
  "compost.rapidRoot": ENGLISH_TERMS["compost.rapidRoot"],
};

const composterDescription: Record<ComposterDescription, string> = {
  "composter.compostBin": "Détails du Bac à Compost...",
  "composter.turboComposter": "Détails du Turbo Composteur...",
  "composter.premiumComposter": "Détails du Composteur Premium...",
};

const confirmSkill: Record<ConfirmSkill, string> = {
  "confirm.skillClaim":
    "Êtes-vous sûr de vouloir revendiquer cette compétence?",
};

const confirmationTerms: Record<ConfirmationTerms, string> = {
  "confirmation.sellCrops":
    "Êtes-vous sûr de vouloir vendre {{cropAmount}} {{cropName}} pour {{coinAmount}} pièces ?",
  "confirmation.buyCrops": ENGLISH_TERMS["confirmation.buyCrops"],
};

const conversations: Record<Conversations, string> = {
  "home-intro.one": ENGLISH_TERMS["home-intro.one"],
  "home-intro.three": ENGLISH_TERMS["home-intro.three"],
  "home-intro.two": ENGLISH_TERMS["home-intro.two"],
  "firepit-intro.one": ENGLISH_TERMS["firepit-intro.one"],
  "firepit-intro.two": ENGLISH_TERMS["firepit-intro.two"],
  "firepit.increasedXP": ENGLISH_TERMS["firepit.increasedXP"],
  "hank-intro.headline": "Aider un vieil homme?",
  "hank-intro.one":
    "Salut Bumpkin ! Bienvenue dans notre petit coin de paradis.",
  "hank-intro.two":
    "Je travaille cette île depuis cinquante ans, mais j'aurais bien besoin d'aide.",
  "hank-intro.three":
    "Je peux t'apprendre les bases de l'agriculture, tant que tu m'aides dans mes tâches quotidiennes.",
  "hank.crafting.scarecrow": "Fabrique un épouvantail",
  "hank-crafting.one":
    "Hmm, ces cultures poussent terriblement lentement. Je n'ai pas le temps d'attendre.",
  "hank-crafting.two":
    "Fabrique un épouvantail pour accélérer la croissance de tes cultures.",
  "hank.choresFrozen": ENGLISH_TERMS["hank.choresFrozen"],
  "betty-intro.headline": "Comment faire pousser ta ferme",
  "betty-intro.one": "Hé, hé ! Bienvenue sur mon marché.",
  "betty-intro.two":
    "Apporte-moi ta meilleure récolte, et je te donnerai un bon prix pour elle!",
  "betty-intro.three":
    "Tu as besoin de graines ? Des potato aux Parsnip, j'ai ce qu'il te faut!",
  "betty.market-intro.one":
    "Salut, Bumpkin ! C'est Betty du marché fermier. Je voyage entre les îles pour acheter des récoltes et vendre des graines fraîches.",
  "betty.market-intro.two":
    "Bonne nouvelle : tu viens de tomber sur une pelle toute neuve ! Mauvaise nouvelle : nous sommes en plein pénurie de récoltes.",
  "betty.market-intro.three":
    "Pendant un temps limité, je propose aux nouveaux venus de doubler l'argent pour toutes les récoltes que tu m'apportes.",
  "betty.market-intro.four":
    "Récolte ces Sunflowers et commençons ton empire agricole.",
  "bruce-intro.headline": "Introduction à la cuisine",
  "bruce-intro.one": "Je suis le propriétaire de ce charmant petit bistrot.",
  "bruce-intro.two":
    "Apporte-moi des ressources et je cuisinerai autant de nourriture que tu peux manger!",
  "bruce-intro.three":
    "Salut fermier ! Je peux repérer un Bumpkin affamé de loin.",
  "blacksmith-intro.headline": "Coupe, coupe, coupe.",
  "blacksmith-intro.one":
    "Je suis un maître des outils, et avec les bonnes ressources, je peux fabriquer tout ce dont tu as besoin... y compris plus d'outils!",
  "pete.first-expansion.one":
    "Félicitations, Bumpkin ! Ta ferme pousse plus vite qu'un haricot magique pendant une tempête de pluie!",
  "pete.first-expansion.two":
    "À chaque expansion, tu trouveras des trucs sympas comme des ressources spéciales, de nouveaux arbres, et bien plus encore à collectionner!",
  "pete.first-expansion.three":
    "Garde un œil sur les cadeaux surprises des généreux gobelins pendant que tu explores. Ils ne sont pas seulement de bons constructeurs, mais aussi de bons donneurs de secrets!",
  "pete.first-expansion.four":
    "Félicitations, Bumpkin ! Continue ton bon travail.",
  "pete.craftScarecrow.one": "Hmm, ces cultures poussent lentement.",
  "pete.craftScarecrow.two":
    "Sunflower Land regorge d'objets magiques que tu peux fabriquer pour améliorer tes compétences en agriculture.",
  "pete.craftScarecrow.three":
    "Dirige-toi vers l'établi et fabrique un épouvantail pour accélérer la croissance de ces Sunflowers.",
  "pete.levelthree.one": "Félicitations, ton pouce vert brille vraiment!",
  "pete.levelthree.two":
    "Il est grand temps de se rendre à la Plaza, où ton talent en agriculture peut briller encore plus.",
  "pete.levelthree.three":
    "À la Plaza, tu peux livrer tes ressources contre des récompenses, fabriquer des objets magiques et échanger avec d'autres joueurs.",
  "pete.levelthree.four":
    "Tu peux voyager en cliquant sur l'icône du monde en bas à gauche.",
  "pete.help.zero":
    "Rends visite au foyer, cuisines de la nourriture et manges pour monter de niveau.",
  "pete.pumpkinPlaza.one":
    "À mesure que tu montes de niveau, tu débloqueras de nouvelles zones à explorer. En premier lieu, il y a la Pumpkin Plaza... ma maison!",
  "pete.pumpkinPlaza.two":
    "Ici, tu peux effectuer des livraisons pour obtenir des récompenses, fabriquer des objets magiques et échanger avec d'autres joueurs.",
  "sunflowerLand.islandDescription":
    "Sunflower Land est rempli d'îles passionnantes où tu peux effectuer des livraisons, fabriquer des NFT rares et même creuser des trésors!",
  "sunflowerLand.opportunitiesDescription":
    "Différents endroits offrent différentes opportunités pour dépenser tes ressources durement gagnées.",
  "sunflowerLand.returnHomeInstruction":
    "À tout moment, clique sur le bouton de voyage pour rentrer chez toi.",
  "grimbly.expansion.one":
    "Salutations, jeune fermier ! Je suis Grimbly, un vétéran de la construction des gobelins.",
  "grimbly.expansion.two":
    "Avec les bonnes matières premières et mes anciennes compétences en artisanat, nous pouvons transformer ton île en un chef-d'œuvre.",
  "luna.portalNoAccess":
    "Hmm, ce portail vient d'apparaître de nulle part. Que pourrait cela signifier?",
  "luna.portals": "Portails",
  "luna.rewards": "Récompenses",
  "luna.travel":
    "Voyage vers ces portails construits par les joueurs et gagne des récompenses.",
  "pete.intro.one":
    "Bonjour, Bumpkin ! Bienvenue à Tournesol, le paradis agricole abondant où tout est possible !",
  "pete.intro.two":
    "Avant de pouvoir vous lancer dans votre aventure, vous devrez développer votre ferme, cuisiner et passer au niveau supérieur !",
  "pete.intro.three":
    "Pour commencer, vous souhaiterez abattre ces arbres et agrandir votre île.",
  "pete.intro.four":
    "Avant de pouvoir te joindre à la fête, tu devras faire pousser ta ferme et rassembler des ressources. Tu ne veux pas arriver les mains vides!",
  "pete.intro.five":
    "Pour commencer, tu voudras abattre ces arbres et agrandir ton île.",
  "mayor.plaza.changeNamePrompt":
    "Veux-tu changer de nom ? Malheureusement, je ne peux pas le faire pour toi en ce moment, les formalités sont trop lourdes pour moi.",
  "mayor.plaza.intro":
    "Salut, cher Bumpkin, il semble que nous ne nous soyons pas encore présentés.",
  "mayor.plaza.role":
    "Je suis le maire de cette ville ! Je suis chargé de m'assurer que tout le monde est heureux. Je veille également à ce que tout le monde ait un nom!",
  "mayor.plaza.fixNamePrompt":
    "Tu n'as pas encore de nom ? Eh bien, nous pouvons arranger ça ! Veux-tu que je prépare les papiers?",
  "mayor.plaza.enterUsernamePrompt": "Entrez votre nom d'utilisateur: ",
  "mayor.plaza.usernameValidation":
    "Veuillez noter que les noms d'utilisateur doivent respecter nos",
  "mayor.plaza.niceToMeetYou": "Enchanté,!",
  "mayor.plaza.congratulations":
    "Félicitations , tes formalités sont maintenant complètes. À bientôt!",
  "mayor.plaza.enjoyYourStay":
    "J'espère que tu apprécieras ton séjour à Sunflower Land ! Si tu as besoin de moi à nouveau, reviens simplement me voir!",
  "mayor.codeOfConduct": "Code de conduite",
  "mayor.failureToComply":
    "Le non-respect peut entraîner des pénalités, y compris une éventuelle suspension de compte.",
  "mayor.paperworkComplete":
    "Vos formalités administratives sont maintenant terminées. À bientôt!",
};

const cropBoomMessages: Record<CropBoomMessages, string> = {
  "crop.boom.welcome": "Bienvenue dans Crop Boom",
  "crop.boom.reachOtherSide":
    "Atteignez l'autre côté du champ de culture dangereux pour réclamer un jeton d'arcade",
  "crop.boom.bewareExplodingCrops":
    "Attention aux cultures explosives. Si vous marchez dessus, vous recommencerez depuis le début",
  "crop.boom.newPuzzleDaily": "Chaque jour, un nouveau puzzle apparaîtra",
  "crop.boom.back.puzzle": "Revenez plus tard pour un tout nouveau puzzle!",
};

const cropFruitDescriptions: Record<CropFruitDescriptions, string> = {
  // Crops
  "description.sunflower": "Une fleur ensoleillée",
  "description.potato": "Plus sain que vous ne le pensez.",
  "description.pumpkin": "Il y a plus dans la pumpkin que dans la tarte.",
  "description.carrot": "Elles sont bonnes pour vos yeux!",
  "description.cabbage":
    "Autrefois un luxe, maintenant une nourriture pour beaucoup.",
  "description.beetroot": "Bon contre les gueules de bois!",
  "description.cauliflower": "Excellent substitut au riz!",
  "description.parsnip": "À ne pas confondre avec les carottes.",
  "description.eggplant": "Œuvre d'art comestible de la nature.",
  "description.corn":
    "Grains de délice embrassés par le soleil, trésor estival de la nature.",
  "description.radish": "Ça prend du temps mais ça vaut la peine d'attendre!",
  "description.wheat": "La récolte la plus abondante au monde.",
  "description.kale": "Une nourriture puissante pour les Bumpkins!",
  "description.soybean": ENGLISH_TERMS["description.soybean"],

  "description.grape": ENGLISH_TERMS["description.grape"],
  "description.olive": ENGLISH_TERMS["description.olive"],
  "description.rice": ENGLISH_TERMS["description.rice"],

  // Fruits
  "description.blueberry": "La faiblesse d'un Goblin",
  "description.orange":
    "De la vitamine C pour garder votre Bumpkin en bonne santé",
  "description.apple": "Parfait pour une tarte aux pommes maison",
  "description.banana": "Oh la banane!",

  // Exotic Crops
  "description.white.carrot": "Une carotte pâle aux racines pâles",
  "description.warty.goblin.pumpkin": "Une pumpkin fantaisiste et verruqueuse",
  "description.adirondack.potato": "Une potato robuste, style Adirondack!",
  "description.purple.cauliflower": "Un Cauliflower pourpre royal",
  "description.chiogga": "Une betterave arc-en-ciel!",
  "description.golden.helios": "Majesté baignée de soleil!",
  "description.black.magic": "Une fleur sombre et mystérieuse!",

  //Flower Seed
  "description.sunpetal.seed": "Une graine de pétales de soleil",
  "description.bloom.seed": "Une graine de fleur épanouie",
  "description.lily.seed": "Une graine de lys",
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
  // Décorations
  "description.wicker.man":
    "Unissez-vous et formez une chaîne, l'ombre de l'Homme en osier se lèvera à nouveau",
  "description.golden bonsai": "Les Gobelins aiment aussi les bonsaïs",
  "description.christmas.bear": "Le favori du Père Noël",
  "description.war.skull": "Décorez l'île avec les os de vos ennemis.",
  "description.war.tombstone": "R.I.P",
  "description.white.tulips": "Éloignez l'odeur des Gobelins.",
  "description.potted.sunflower": "Illuminez votre île.",
  "description.potted.potato": "Le sang de la potato coule dans votre Bumpkin.",
  "description.potted.pumpkin": "Des pumpkins pour les Bumpkins",
  "description.cactus": "Économise de l'eau et rend votre ferme magnifique!",
  "description.basic.bear":
    "Un ours basique. Utilisez-le au Goblin Retreat pour construire un ours!",
  "description.bonnies.tombstone":
    "Un ajout effrayant à n'importe quelle ferme, la pierre tombale humaine de Bonnie vous donnera des frissons dans le dos.",
  "description.grubnashs.tombstone":
    "Ajoutez un charme espiègle avec la pierre tombale Goblin de Grubnash.",
  "description.town.sign": "Montrez fièrement votre ID de ferme!",
  "description.dirt.path":
    "Gardez vos bottes de fermier propres avec un chemin bien foulé.",
  "description.bush": "Que se cache-t-il dans les buissons?",
  "description.fence": "Ajoutez une touche de charme rustique à votre ferme.",
  "description.stone.fence":
    "Adoptez l'élégance intemporelle d'une clôture en pierre.",
  "description.pine.tree":
    "Debout haut et puissant, un rêve habillé d'aiguilles.",
  "description.shrub":
    "Améliorez votre aménagement paysager en jeu avec un bel arbuste.",
  "description.field.maple":
    "Un charmeur petit qui étend ses feuilles comme une délicate canopée verte.",
  "description.red.maple":
    "Foliage enflammé et un cœur plein de chaleur automnale.",
  "description.golden.maple":
    "Illuminant de sa brillance avec ses feuilles dorées scintillantes.",
  "description.crimson.cap":
    "Un champignon imposant et vibrant, le Crimson Cap Giant Mushroom apportera de la vie à votre ferme.",
  "description.toadstool.seat":
    "Asseyez-vous et détendez-vous sur le whimsical Toadstool Mushroom Seat.",
  "description.chestnut.fungi.stool":
    "Le Chestnut Fungi Stool est un ajout robuste et rustique à n'importe quelle ferme.",
  "description.mahogany.cap":
    "Ajoutez une touche de sophistication avec le Mahogany Cap Giant Mushroom.",
  "description.candles":
    "Enchantez votre ferme avec des flammes spectrales vacillantes pendant la Veille des Sorcières.",
  "description.haunted.stump":
    "Invoquez des esprits et ajoutez un charme étrange à votre ferme.",
  "description.spooky.tree":
    "Un ajout amusant et hanté à la décoration de votre ferme!",
  "description.observer":
    "Un œil perpétuellement en mouvement, toujours vigilant et attentif!",
  "description.crow.rock": "Un corbeau perché sur un rocher mystérieux.",
  "description.mini.corn.maze":
    "Un souvenir du labyrinthe bien-aimé de la saison de la Veille des Sorcières 2023.",
  "description.lifeguard.ring":
    "Restez à flot avec style, votre sauveur en bord de mer!",
  "description.surfboard":
    "Ridez les vagues de l'émerveillement, béatitude de plage à bord!",
  "description.hideaway.herman":
    "Herman est là pour se cacher, mais regarde toujours pour une fête!",
  "description.shifty.sheldon":
    "Sheldon est sournois, toujours en train de se faufiler vers la prochaine surprise sableuse!",
  "description.tiki.torch":
    "Illuminez la nuit, des vibrations tropicales brûlant brillamment!",
  "description.beach.umbrella":
    "Ombre, abri et élégance en bord de mer en un seul arrangement ensoleillé!",
  "description.magic.bean": "Que poussera-t-il?",
  "description.giant.potato": "Une potato géante.",
  "description.giant.pumpkin": "Une pumpkin géante.",
  "description.giant.cabbage": "Un Cabbage géant.",
  "description.chef.bear": "Chaque chef a besoin d'une aide précieuse.",
  "description.construction.bear":
    "Toujours construire en période de marché baissier.",
  "description.angel.bear": "Le moment de transcender l'agriculture paysanne.",
  "description.badass.bear": "Rien ne se dresse sur votre chemin.",
  "description.bear.trap": "C'est un piège!",
  "description.brilliant.bear": "Pure brillance!",
  "description.classy.bear": "Plus SFL que vous ne savez quoi en faire!",
  "description.farmer.bear": "Rien de tel qu'une dure journée de travail!",
  "description.rich.bear": "Une possession précieuse.",
  "description.sunflower.bear": "Une culture chérie par un ours.",
  "description.beta.bear": "Un ours trouvé lors d'événements de test spéciaux.",
  "description.rainbow.artist.bear":
    "Le propriétaire est un bel artiste de l'ours!",
  "description.devil.bear":
    "Mieux vaut le Diable que vous connaissez que le Diable que vous ne connaissez pas.",
  "description.collectible.bear": "Un ours précieux, toujours en parfait état!",
  "description.cyborg.bear": "Hasta la vista, l'ours.",
  "description.christmas.snow.globe":
    "Remuez la neige et regardez-la prendre vie.",
  "description.kraken.tentacle":
    "Plongez dans le mystère des profondeurs ! Cette tentacule évoque des contes anciens de légendes marines et de merveilles aquatiques.",
  "description.kraken.head":
    "Plongez dans le mystère des profondeurs ! Cette tête évoque des contes anciens de légendes marines et de merveilles aquatiques.",
  "description.abandoned.bear": "Un ours qui a été laissé derrière sur l'île.",
  "description.turtle.bear": "Assez pour le club des tortues.",
  "description.trex.skull": "Un crâne de T-Rex ! Incroyable!",
  "description.sunflower.coin": "Une pièce faite de Sunflowers.",
  "description.skeleton.king.staff": "Tous saluent le Roi Squelette!",
  "description.lifeguard.bear":
    "L'ours sauveteur est là pour sauver la journée!",
  "description.snorkel.bear": "L'ours tuba aime nager.",
  "description.parasaur.skull": "Un crâne de parasaur!",
  "description.goblin.bear": "Un ours gobelin. C'est un peu effrayant.",
  "description.golden.bear.head": "Effrayant, mais cool.",
  "description.pirate.bear": "Argh, matelot ! Serre-moi dans tes bras!",
  "description.galleon": "Un navire jouet, toujours en très bon état.",
  "description.dinosaur.bone":
    "Un os de dinosaure ! De quelle créature s'agit-il?",
  "description.human.bear":
    "Un ours humain. Encore plus effrayant qu'un ours gobelin.",
  "description.flamingo":
    "Représente un symbole de la beauté de l'amour, debout grand et confiant.",
  "description.blossom.tree":
    "Ses pétales délicats symbolisent la beauté et la fragilité de l'amour.",
  "description.heart.balloons":
    "Utilisez-les comme décoration pour des occasions romantiques.",
  "description.whale.bear":
    "Il a un corps rond et poilu comme un ours, mais avec les nageoires, la queue et le blowhole d'une baleine.",
  "description.valentine.bear": "Pour ceux qui aiment.",
  "description.easter.bear": "Comment un lapin peut-il pondre des œufs?",
  "description.easter.bush": "Qu'y a-t-il à l'intérieur?",
  "description.giant.carrot":
    "Une grosse carotte debout, projetant des ombres amusantes, alors que les lapins contemplent avec émerveillement.",
  "description.beach.ball":
    "La balle rebondissante apporte des vibrations de plage, chasse l'ennui.",
  "description.palm.tree":
    "Haut, branché, ombragé et chic, les palmiers font des vagues.",

  //other
  "description.sunflower.amulet":
    "Augmentation de 10 % du rendement en Sunflowers.",
  "description.carrot.amulet": "Les carottes poussent 20 % plus vite.",
  "description.beetroot.amulet":
    "Augmentation de 20 % du rendement en betteraves.",
  "description.green.amulet":
    "Chance d'obtenir un rendement de culture 10 fois supérieur.",
  "description.warrior.shirt": "Marque d'un véritable guerrier.",
  "description.warrior.pants": "Protégez vos cuisses.",
  "description.warrior.helmet": "Immunité aux flèches.",
  "description.sunflower.shield":
    "Un héros de Sunflower Land. Des graines de tournesol gratuites!",
  "description.skull.hat": "Un chapeau rare pour votre Bumpkin.",
  "description.sunflower.statue": "Un symbole du jeton sacré.",
  "description.potato.statue": "Le OG de la potato qui en a dans le ventre.",
  "description.christmas.tree":
    "Recevez une distribution de cadeaux du Père Noël le jour de Noël.",
  "description.gnome": "Un gnome chanceux.",
  "description.homeless.tent": "Une tente agréable et confortable.",
  "description.sunflower.tombstone":
    "En mémoire des agriculteurs de Sunflowers.",
  "description.sunflower.rock": "Le jeu qui a fait exploser Polygon.",
  "description.goblin.crown": "Invoque le leader des Gobelins.",
  "description.fountain": "Une fontaine relaxante pour votre ferme.",
  "description.nyon.statue": "En mémoire de Nyon Lann.",
  "description.farmer.bath":
    "Un bain parfumé à la betterave pour les agriculteurs.",
  "description.woody.Beaver": "Augmente les récoltes de Wood de 20 %.",
  "description.apprentice.beaver":
    "Les arbres se régénèrent 50 % plus rapidement.",
  "description.foreman.beaver": "Abattez des arbres sans hache.",
  "description.egg.basket": "Donne accès à la chasse aux œufs de Pâques.",
  "description.mysterious.head": "Une statue censée protéger les agriculteurs.",
  "description.tunnel.mole": "Augmente de 25 % les mines de pierre.",
  "description.rocky.the.mole": "Augmente de 25 % les mines de fer.",
  "description.nugget": "Augmente de 25 % les mines d'or.",
  "description.rock.golem":
    "Donne 10 % de chances d'obtenir 3 fois plus de pierre.",
  "description.chef.apron":
    "Donne 20 % de revenus SFL supplémentaires en vendant des gâteaux.",
  "description.chef.hat": "La couronne d'un boulanger légendaire!",
  "description.nancy":
    "Éloigne quelques corbeaux. Les cultures poussent 15 % plus vite.",
  "description.scarecrow":
    "Un épouvantail gobelin. Rendement 20 % plus élevé en cultures.",
  "description.kuebiko":
    "Même le propriétaire de la boutique a peur de cet épouvantail. Les graines sont gratuites.",
  "description.golden.cauliflower": "Double le rendement en choux-fleurs.",
  "description.mysterious.parsnip": "Les Parsnip poussent 50 % plus vite.",
  "description.carrot.sword":
    "Augmente les chances qu'une culture mutante apparaisse.",
  "description.chicken.coop": "Collectez deux fois plus d'œufs.",
  "description.farm.cat": "Éloigne les rats.",
  "description.farm.dog": "Rassemblez les moutons avec votre chien de ferme.",
  "description.gold.egg": "Nourrissez les poules sans avoir besoin de Wheat.",
  "description.easter.bunny": "Gagnez 20 % de carottes supplémentaires.",
  "description.rooster":
    "Doublez les chances de faire apparaître un poulet mutant.",
  "description.chicken":
    "Produit des œufs. Nécessite du Wheat pour la nourriture.",
  "description.cow": "Produit du lait. Nécessite du Wheat pour la nourriture.",
  "description.pig":
    "Produit du fumier. Nécessite du Wheat pour la nourriture.",
  "description.sheep":
    "Produit de la laine. Nécessite du Wheat pour la nourriture.",
  "description.basic.land": "Un morceau d'île basique.",
  "description.crop.plot": "Une parcelle vide pour planter des cultures.",
  "description.gold.rock": "Une roche exploitable pour collecter de l'or.",
  "description.iron.rock": "Une roche exploitable pour collecter du fer.",
  "description.stone.rock":
    "Une roche exploitable pour collecter de la pierre.",
  "description.crimstone.rock":
    "Une roche exploitable pour collecter du crimstone.",
  "description.oil.reserve": ENGLISH_TERMS["description.oil.reserve"],
  "description.flower.bed": "Une parcelle vide pour planter des fleurs.",
  "description.tree":
    "Un arbre que vous pouvez abattre pour collecter du Wood.",
  "description.fruit.patch": "Une parcelle vide pour planter des fruits.",
  "description.boulder":
    "Une roche mythique qui peut laisser tomber des minéraux rares.",
  "description.catch.the.kraken.banner":
    "Le Kraken est là ! La marque d'un participant à la saison Catch the Kraken.",
  "description.luminous.lantern":
    "Une lanterne en papier lumineuse qui éclaire le chemin.",
  "description.radiance.lantern":
    "Une lanterne en papier radieuse qui brille d'une lumière puissante.",
  "description.ocean.lantern":
    "Une lanterne en papier ondulée qui flotte avec la marée.",
  "description.solar.lantern":
    "Utilisant l'essence vibrante des Sunflowers, la lanterne solaire émet une lueur chaude et radieuse.",
  "description.aurora.lantern":
    "Une lanterne en papier qui transforme tout espace en un pays des merveilles magique.",
  "description.dawn.umbrella":
    "Gardez ces Eggplants au sec lors des journées pluvieuses avec le siège-parapluie Dawn.",
  "description.eggplant.grill":
    "Préparez vos repas en plein air avec le Eggplant Grill, parfait pour tout repas en plein air.",
  "description.giant.dawn.mushroom":
    "Le champignon géant Dawn est un ajout majestueux et magique à toute ferme.",
  "description.shroom.glow":
    "Illuminez votre ferme avec la lueur enchanteresse de Shroom Glow.",
  "description.clementine":
    "Le gnome Clementine est un compagnon joyeux pour vos aventures agricoles.",
  "description.blossombeard":
    "Le gnome Blossombeard est un compagnon puissant pour vos aventures agricoles.",
  "description.desertgnome": ENGLISH_TERMS["description.desertgnome"],
  "description.cobalt":
    "Le gnome Cobalt ajoute une touche de couleur à votre ferme avec son chapeau vibrant.",
  "description.hoot": "Hibou hibou ! Avez-vous résolu mon énigme?",
  "description.genie.bear": "Exactement ce que je souhaitais!",
  "description.betty.lantern":
    "Elle a l'air tellement réelle ! Je me demande comment ils l'ont fabriquée.",
  "description.bumpkin.lantern":
    "En vous approchant, vous entendez des murmures d'un Bumpkin vivant... effrayant!",
  "description.eggplant.bear": "La marque généreuse Eggplant balaine.",
  "description.goblin.lantern": "Une lanterne au look effrayant.",
  "description.dawn.flower":
    "Embrassez la beauté radieuse de la Dawn Flower alors que ses pétales délicats scintillent avec les premières lueurs du jour.",
  "description.kernaldo.bonus": "+25 % de vitesse de croissance du Corn.",
  "description.white.crow": "Un corbeau blanc mystérieux et éthéré.",
  "description.sapo.docuras": "Un vrai régal!",
  "description.sapo.travessuras": "Oh oh... quelqu'un a été méchant.",
  "description.walrus":
    "Avec ses défenses fiables et son amour pour les profondeurs, il s'assurera que vous pêchiez un poisson de plus à chaque fois.",
  "description.alba":
    "Avec ses instincts aiguisés, elle s'assure que vous avez un peu plus de plaisir dans votre pêche. 50 % de chances d'obtenir +1 poisson de base!",
  "description.knowledge.crab":
    "Le crabe de la connaissance double l'effet de votre mélange de graines, rendant vos trésors de sol aussi riches que les pillages marins!",
  "description.anchor":
    "Jetez l'ancre avec cette gemme nautique, rendant chaque endroit navigable et d'une élégance éclaboussante!",
  "description.rubber.ducky":
    "Flottez dans le plaisir avec ce canard classique, apportant une joie pétillante à chaque coin!",
  "description.arcade.token":
    "Un jeton gagné grâce à des mini-jeux et des aventures. Peut être échangé contre des récompenses.",
  "description.bumpkin.nutcracker": "Une décoration festive de 2023.",
  "description.festive.tree":
    "Un arbre festif disponible chaque saison des fêtes. Je me demande s'il est assez grand pour que le Père Noël le voie?",
  "description.white.festive.fox":
    "La bénédiction du Renard Blanc habite les fermes généreuses.",
  "description.grinxs.hammer":
    "Le marteau magique de Grinx, le légendaire forgeron gobelin.",
  "description.angelfish":
    "La beauté céleste aquatique, ornée d'une palette de couleurs vibrantes.",
  "description.halibut":
    "Le habitant plat du fond de l'océan, un maître du déguisement en camouflage sableux.",
  "description.parrotFish":
    "Un kaléidoscope de couleurs sous les vagues, ce poisson est une œuvre d'art vivante de la nature.",
  "description.Farmhand": "Un ouvrier agricole utile.",
  "description.Beehive":
    "Une ruche animée, produisant du Honey à partir de fleurs en croissance active ; 10 % de chance lors de la récolte du Honey d'invoquer un essaim d'abeilles qui pollinisera toutes les cultures en croissance avec un bonus de +0.2!",
  // Flowers
  "description.red.pansy": "Une red pansy.",
  "description.yellow.pansy": "Une yellow pansy.",
  "description.purple.pansy": "Une purple pansy.",
  "description.white.pansy": "Une white panssy.",
  "description.blue.pansy": "Une blue pansy.",

  "description.red.cosmos": "Un red cosmos.",
  "description.yellow.cosmos": "Un yellow cosmos.",
  "description.purple.cosmos": "Un purple cosmos.",
  "description.white.cosmos": "Un white cosmos.",
  "description.blue.cosmos": "Un blue cosmos.",

  "description.red.balloon.flower": "Une red balloon flower.",
  "description.yellow.balloon.flower": "Une yellow balloon flower.",
  "description.purple.balloon.flower": "Une purple balloon flower.",
  "description.white.balloon.flower": "Une white balloon flower.",
  "description.blue.balloon.flower": "Une blue balloon flower.",

  "description.red.carnation": "Une red carnation.",
  "description.yellow.carnation": "Une yellow carnation.",
  "description.purple.carnation": "Une purple carnation.",
  "description.white.carnation": "Unewhite carnation.",
  "description.blue.carnation": "Une blue carnation.",

  "description.humming.bird":
    "Un joyau du ciel, le Colibri virevolte avec grâce et couleur.",
  "description.queen.bee":
    "Majestueuse reine de la ruche, l'Abeille Reine bourdonne avec autorité royale.",
  "description.flower.fox":
    "Le Renard des Fleurs, une créature espiègle ornée de pétales, apporte de la joie au jardin.",
  "description.hungry.caterpillar":
    "Se régalant de feuilles, la Chenille Gourmande est toujours prête pour une aventure savoureuse.",
  "description.sunrise.bloom.rug":
    "Marchez sur le Tapis de l'Éclosion du Soleil, où les pétales dansent autour d'un lever de soleil floral.",
  "description.blossom.royale":
    "Le Blossom Royale, une fleur géante aux couleurs bleues et roses vibrantes, se dresse en majesté.",
  "description.rainbow":
    "Un arc-en-ciel joyeux, reliant le ciel et la terre avec son arc-en-ciel coloré.",
  "description.enchanted.rose":
    "La Rose Enchantée, symbole de beauté éternelle, captive par son charme magique.",
  "description.flower.cart":
    "Le Chariot de Fleurs, débordant de fleurs, est un jardin mobile de délices floraux.",
  "description.capybara":
    "Le Capybara, un ami décontracté, apprécie les journées paisibles au bord de l'eau.",
  "description.prism.petal":
    "Waouh ! Quelle belle fleur ! Je pense que celle-ci mérite d'être placée sur votre ferme.",
  "description.celestial.frostbloom":
    "Waouh ! Quelle belle fleur ! Je pense que celle-ci mérite d'être placée sur votre ferme.",
  "description.primula.enigma":
    "Waouh ! Quelle belle fleur ! Je pense que celle-ci mérite d'être placée sur votre ferme.",

  "description.red.daffodil": "Une red daffodil.",
  "description.yellow.daffodil": "Une yellow daffodil.",
  "description.purple.daffodil": "Une purple daffodil.",
  "description.white.daffodil": "Une white daffodil.",
  "description.blue.daffodil": "Une blue daffodil.",

  "description.red.lotus": "Un red lotus.",
  "description.yellow.lotus": "Un yellow lotus.",
  "description.purple.lotus": "Un purple lotus.",
  "description.white.lotus": "Un white lotus.",
  "description.blue.lotus": "Un blue lotus.",

  // Bannières
  "description.goblin.war.banner":
    "Un affichage d'allégeance à la cause des Gobelins.",
  "description.human.war.banner":
    "Un affichage d'allégeance à la cause des Humains.",
  "description.earnAllianceBanner": "A special event banner",
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
    "Bonjour, ami ! Je suis là pour voir si vous avez ce dont j'ai besoin.",
  "defaultDialogue.positiveDelivery":
    "Oh, fantastique ! Vous avez apporté exactement ce dont j'ai besoin. Merci!",
  "defaultDialogue.negativeDelivery":
    "Oh non ! Il semble que vous n'ayez pas ce dont j'ai besoin. Pas de soucis, cependant. Continuez à explorer, et nous trouverons une autre opportunité.",
  "defaultDialogue.noOrder": "Pas de commande active à traiter pour le moment.",
};

const delivery: Record<Delivery, string> = {
  "delivery.resource": "Voulez-vous que je livre des ressources?",
  "delivery.feed": "Ce n'est pas gratuit, j'ai une tribu à nourrir!",
  "delivery.fee":
    "Il me faudra 30 % des ressources pour la Trésorerie de la Communauté des Gobelins.",
  "delivery.goblin.comm.treasury": "Trésor de la Communauté des Gobelins",
};

const deliveryHelp: Record<DeliveryHelp, string> = {
  "deliveryHelp.pumpkinSoup":
    "Rassemblez les ingrédients et prenez un bateau pour Pumpkin Plaza pour livrer des commandes aux Bumpkins en échange d'une récompense!",
  "deliveryHelp.hammer":
    "Étendez votre terrain pour débloquer plus d'emplacements et des commandes de livraison plus rapides.",
  "deliveryHelp.axe":
    "Terminez vos tâches et trouvez Hank à la Plaza pour réclamer vos récompenses.",
  "deliveryHelp.chest":
    "Établissez des relations avec les Bumpkins en effectuant plusieurs commandes pour débloquer des récompenses bonus.",
};

const deliveryitem: Record<DeliveryItem, string> = {
  "deliveryitem.inventory": "Inventaire:",
  "deliveryitem.itemsToDeliver": "Articles à livrer: ",
  "deliveryitem.deliverToWallet": "Livrer à votre portefeuille",
  "deliveryitem.viewOnOpenSea":
    "Une fois livré, vous pourrez voir vos articles sur OpenSea.",
  "deliveryitem.deliver": "Livrer",
};

const depositWallet: Record<DepositWallet, string> = {
  "deposit.errorLoadingBalances":
    "Une erreur s'est produite lors du chargement de vos soldes.",
  "deposit.yourPersonalWallet": "Votre Portefeuille Personnel",
  "deposit.farmWillReceive": "Votre ferme recevra :",
  "deposit.depositDidNotArrive": "Le dépôt n'est pas arrivé?",
  "deposit.goblinTaxInfo":
    "Lorsque les joueurs retirent des SFL, une taxe des Gobelins est appliquée.",
  "deposit.sendToFarm": "Envoyer à la ferme",
  "deposit.toDepositLevelUp":
    "Pour déposer des objets, vous devez d'abord monter de niveau",
  "deposit.level": "Niveau 3",
  "deposit.noSflOrCollectibles": "Aucun SFL ou objets de collection trouvés!",
  "deposit.farmAddress": "Adresse de la ferme :",
  "question.depositSFLItems":
    "Souhaitez-vous déposer des objets de Sunflower Land, des accessoires ou des SFL?",
};

const detail: Record<Detail, string> = {
  "detail.how.item": "Comment obtenir cet objet?",
  "detail.Claim.Reward": "Réclamer la récompense",
  "detail.basket.empty": "Votre panier est vide!",
  "detail.view.item": "Voir l'objet sur",
};

const discordBonus: Record<DiscordBonus, string> = {
  "discord.bonus.niceHat": "Wow, beau chapeau!",
  "discord.bonus.attentionEvents":
    "N'oubliez pas de prêter attention aux événements spéciaux et aux cadeaux sur Discord pour ne rien manquer.",
  "discord.bonus.bonusReward": "Récompense bonus",
  "discord.bonus.payAttention":
    "Soyez attentif aux événements spéciaux et aux cadeaux sur Discord pour ne rien manquer.",
  "discord.bonus.enjoyCommunity":
    "Nous espérons que vous appréciez de faire partie de notre communauté!",
  "discord.bonus.communityInfo":
    "Saviez-vous qu'il y a plus de 100 000 joueurs dans notre communauté Discord animée?",
  "discord.bonus.farmingTips":
    "Si vous recherchez des astuces et des conseils en matière de farming, c'est l'endroit où il faut être.",
  "discord.bonus.freeGift":
    "La meilleure partie... tout le monde qui rejoint obtient un cadeau gratuit!",
  "discord.bonus.connect": "Connectez-vous à Discord",
  "fontReward.bonus.claim": ENGLISH_TERMS["fontReward.bonus.claim"],
  "fontReward.bonus.intro1": ENGLISH_TERMS["fontReward.bonus.intro1"],
  "fontReward.bonus.intro2": ENGLISH_TERMS["fontReward.bonus.intro2"],
  "fontReward.bonus.intro3": ENGLISH_TERMS["fontReward.bonus.intro3"],
};

const donation: Record<Donation, string> = {
  "donation.one":
    "Il s'agissait d'une initiative artistique communautaire et les dons sont grandement appréciés!",
  "donation.specialEvent": ENGLISH_TERMS["donation.specialEvent"],
  "donation.rioGrandeDoSul.one": ENGLISH_TERMS["donation.rioGrandeDoSul.one"],
  "donation.rioGrandeDoSul.two": ENGLISH_TERMS["donation.rioGrandeDoSul.two"],
  "donation.matic": ENGLISH_TERMS["donation.matic"],
  "donation.minimum": ENGLISH_TERMS["donation.minimum"],
  "donation.airdrop": ENGLISH_TERMS["donation.airdrop"],
};

const draftBid: Record<DraftBid, string> = {
  "draftBid.howAuctionWorks": "Comment fonctionne l'enchère?",
  "draftBid.unsuccessfulParticipants":
    "Les participants qui ne réussissent pas seront remboursés de leurs ressources.",
  "draftBid.termsAndConditions": "Conditions générales",
};

const errorAndAccess: Record<ErrorAndAccess, string> = {
  "errorAndAccess.blocked.betaTestersOnly":
    "Accès réservé aux bêta-testeurs uniquement",
  "errorAndAccess.denied.message": "Vous n'avez pas encore accès au jeu.",
  "errorAndAccess.instructions.part1": "Assurez-vous d'avoir rejoint le ",
  "errorAndAccess.sflDiscord": "Discord de Sunflower Land",
  "errorAndAccess.instructions.part2":
    ", allez dans le canal #verify et obtenez le rôle 'farmer'.",
  "error.cannotPlaceInside": "Impossible de placer à l'intérieur",
};

const errorTerms: Record<ErrorTerms, string> = {
  "error.betaTestersOnly": "Réservé aux bêta-testeurs uniquement!",
  "error.congestion.one":
    "Nous faisons de notre mieux, mais il semble que Polygon soit très fréquenté ou que vous ayez perdu votre connexion.",
  "error.congestion.two":
    "Si cette erreur persiste, veuillez essayer de changer votre RPC Metamask.",
  "error.connection.one":
    "Il semble que nous n'ayons pas pu compléter cette demande.",
  "error.connection.two": "Cela peut être un simple problème de connexion.",
  "error.connection.three":
    "Vous pouvez cliquer sur Actualiser pour réessayer.",
  "error.connection.four":
    "Si le problème persiste, vous pouvez demander de l'aide en contactant notre équipe de support ou en rejoignant notre Discord et en demandant à notre communauté.",
  "error.diagnostic.info": "Informations de diagnostic",
  "error.forbidden.goblinVillage":
    "Vous n'êtes pas autorisé à visiter le village des Gobelins!",
  "error.multipleDevices.one": "Plusieurs appareils ouverts",
  "error.multipleDevices.two":
    "Veuillez fermer les autres onglets de navigateur ou appareils que vous utilisez.",
  "error.multipleWallets.one": "Portefeuilles multiples",
  "error.multipleWallets.two":
    "Il semble que vous ayez plusieurs portefeuilles installés. Cela peut provoquer un comportement inattendu. Essayez de désactiver tous les portefeuilles sauf un.",
  "error.polygonRPC":
    "Veuillez réessayer ou vérifier vos paramètres RPC Polygon.",
  "error.toManyRequest.one": "Trop de demandes!",
  "error.toManyRequest.two":
    "On dirait que vous avez été occupé ! Veuillez réessayer plus tard.",
  "error.Web3NotFound": "Web3 non trouvé",
  "error.wentWrong": "Quelque chose s'est mal passé!",
  "error.clock.not.synced": "Horloge non synchronisée",
  "error.polygon.cant.connect": "Impossible de se connecter à Polygon",
  "error.composterNotExist": "Le composteur n'existe pas",
  "error.composterNotProducing": "Le composteur ne produit rien",
  "error.composterAlreadyDone": "Composteur déjà terminé",
  "error.composterAlreadyBoosted": "Déjà boosté",
  "error.missingEggs": "Œufs manquants",
  "error.insufficientSFL": "SFL insuffisant",
  "error.dailyAttemptsExhausted": "Tentatives quotidiennes épuisées",
  "error.missingRod": "Canne à pêche manquante",
  "error.missingBait": "Appât manquant",
  "error.alreadyCasted": "Déjà lancé",
  "error.unsupportedChum": ENGLISH_TERMS["error.unsupportedChum"],
  "error.insufficientChum": "Appât insuffisant",
  "error.alr.composter": "Le composteur est déjà en train de composter",
  "error.no.alr.composter": "Le composteur n'est pas prêt pour la production",
  "error.missing": "Exigences manquantes",
  "error.no.ready": "Le compost n'est pas prêt",
  "error.noprod.composter": "Le composteur ne produit rien",
  "error.buildingNotExist": "Le bâtiment n'existe pas",
  "error.buildingNotCooking": "Le bâtiment ne cuisine rien",
  "error.recipeNotReady": "La recette n'est pas prête",
  "error.npcsNotExist": "Les PNJ n'existent pas",
  "error.noDiscoveryAvailable": "Aucune découverte disponible",
  "error.obsessionAlreadyCompleted": "Cette obsession est déjà terminée",
  "error.collectibleNotInInventory": "Vous n'avez pas le collectible requis",
  "error.wearableNotInWardrobe": "Vous n'avez pas l'accessoire requis",
  "error.requiredBuildingNotExist": "Le bâtiment requis n'existe pas",
  "error.cookingInProgress": "Cuisson déjà en cours",
  "error.insufficientIngredient": "Ingrédient insuffisant",
  "error.ClientRPC": "Client RPC Erreur",
  "error.walletInUse.one": ENGLISH_TERMS["error.walletInUse.one"],
  "error.walletInUse.two": ENGLISH_TERMS["error.walletInUse.two"],
  "error.walletInUse.three": ENGLISH_TERMS["error.walletInUse.three"],
  "error.notEnoughOil": ENGLISH_TERMS["error.notEnoughOil"],
  "error.oilCapacityExceeded": ENGLISH_TERMS["error.oilCapacityExceeded"],
};

const event: Record<Event, string> = {
  "event.christmas": "Événement de Noël!",
  "event.LunarNewYear": "Événement du Nouvel An lunaire",
  "event.GasHero": "Événement Gas Hero",
  "event.Easter": "Événement de Pâques",
  "event.valentines.rewards": "Récompenses de la Saint-Valentin",
};

const exoticShopItems: Record<ExoticShopItems, string> = {
  "exoticShopItems.line1":
    "Notre magasin de haricots ferme ses portes alors que nos haricots se lancent dans une nouvelle aventure avec un savant fou.",
  "exoticShopItems.line2":
    "Merci d'avoir fait partie de notre communauté d'amateurs de légumes secs.",
  "exoticShopItems.line3": "Cordialement,",
  "exoticShopItems.line4": "L'équipe des haricots",
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
  "festivetree.greedyBumpkin": "Bumpkin avide détecté",
  "festivetree.alreadyGifted":
    "Cet arbre a déjà été offert. Attendez jusqu'à Noël prochain pour plus de festivités.",
  "festivetree.notFestiveSeason":
    "Ce n'est pas la saison des fêtes. Revenez plus tard.",
};

const fishDescriptions: Record<FishDescriptions, string> = {
  // Poissons
  "description.anchovy.one":
    "L'acrobate miniature des océans, toujours pressé!",
  "description.anchovy.two": "Petit poisson, grande saveur!",
  "description.butterflyfish.one":
    "Un poisson à la mode, arborant ses rayures vives et élégantes.",
  "description.butterflyfish.two": "Nagez dans les couleurs et les saveurs!",
  "description.blowfish.one":
    "Le comique rond et gonflé de la mer, garanti pour vous faire sourire.",
  "description.blowfish.two": "Dînez avec danger, une surprise épineuse!",
  "description.clownfish.one":
    "Le bouffon sous-marin, portant un smoking mandarine et un charme clownesque.",
  "description.clownfish.two": "Pas de blagues, juste de la délicatesse pure!",
  "description.seabass.one":
    "Votre ami 'pas très excitant' aux écailles argentées - une prise basique!",
  "description.seabass.two": "Les bases de la cuisine en bord de mer!",
  "description.seahorse.one":
    "La danseuse au ralenti de l'océan, se balançant gracieusement dans le ballet aquatique.",
  "description.seahorse.two": "Délicat, rare et étonnamment savoureux!",
  "description.horsemackerel.one":
    "Un sprinter à la brillante robe, toujours en course à travers les vagues.",
  "description.horsemackerel.two":
    "Galopez à travers les saveurs à chaque bouchée!",
  "description.squid.one":
    "L'énigme des profondeurs avec des tentacules pour titiller votre curiosité.",
  "description.squid.two": "Encrez votre chemin vers des saveurs exquises!",
  "description.redsnapper.one":
    "Une prise qui vaut son pesant d'or, vêtue de rouge ardent.",
  "description.redsnapper.two":
    "Plongez dans des océans riches et zestés de saveurs!",
  "description.morayeel.one":
    "Un habitant sinistre et insaisissable des coins sombres de l'océan.",
  "description.morayeel.two": "Glissant, savoureux et sensationnel!",
  "description.oliveflounder.one":
    "Le maître du déguisement du fond marin, toujours en train de se fondre dans la foule.",
  "description.oliveflounder.two": "Se noyer dans la richesse et la saveur!",
  "description.napoleanfish.one":
    "Rencontrez le poisson au complexe de Napoléon - petit, mais royal!",
  "description.napoleanfish.two": "Conquérez votre faim avec cette prise!",
  "description.surgeonfish.one":
    "Le guerrier néon de l'océan, armé d'une attitude pointue.",
  "description.surgeonfish.two": "Opérez sur vos papilles avec précision!",
  "description.zebraturkeyfish.one":
    "Des rayures, des épines et une disposition zestée, ce poisson est vraiment sensationnel!",
  "description.zebraturkeyfish.two":
    "Rayé, épineux et spectaculairement délicieux!",
  "description.ray.one":
    "Le planeur sous-marin, une belle aile sereine à travers les vagues.",
  "description.ray.two": "Planez dans un monde de saveurs riches!",
  "description.hammerheadshark.one":
    "Rencontrez le requin à la tête d'affiche, prêt pour une collision de tête avec la saveur!",
  "description.hammerheadshark.two": "Une collision de saveurs de tête!",
  "description.tuna.one":
    "Le sprinter musclé de l'océan, prêt pour une course fantastique!",
  "description.tuna.two": "Un titan de la saveur à chaque tranche!",
  "description.mahimahi.one":
    "Un poisson qui croit en une vie colorée avec des nageoires dorées.",
  "description.mahimahi.two": "Double le nom, double la délicatesse!",
  "description.bluemarlin.one":
    "Une légende océanique, le marlin avec une attitude aussi profonde que la mer.",
  "description.bluemarlin.two":
    "Emparez-vous de votre appétit avec cette prise royale!",
  "description.oarfish.one":
    "Le long et le long de lui - un voyageur océanique énigmatique.",
  "description.oarfish.two": "Ramez dans une saveur légendaire!",
  "description.footballfish.one":
    "Le MVP des profondeurs, une star bioluminescente prête à jouer!",
  "description.footballfish.two": "Marquez un touché dans la saveur!",
  "description.sunfish.one":
    "Le preneur de soleil de l'océan, se prélassant sous les projecteurs avec des nageoires bien dressées.",
  "description.sunfish.two":
    "Prélassez-vous dans la lueur de sa saveur délectable!",
  "description.coelacanth.one":
    "Un vestige préhistorique, avec un goût pour le passé et le présent.",
  "description.coelacanth.two":
    "Une saveur préhistorique qui a résisté à l'épreuve du temps!",
  "description.whaleshark.one":
    "Le doux géant des profondeurs, filtrant les trésors du buffet océanique.",
  "description.whaleshark.two":
    "Un repas colossal pour des envies monumentales!",
  "description.barredknifejaw.one":
    "Un hors-la-loi océanique aux rayures noires et blanches et au cœur d'or.",
  "description.barredknifejaw.two":
    "Taillez la faim avec des saveurs tranchantes!",
  "description.sawshark.one":
    "Avec un museau en forme de scie, c'est le charpentier de l'océan, toujours à la pointe!",
  "description.sawshark.two": "Saveur de pointe des profondeurs!",
  "description.whiteshark.one":
    "Le requin au sourire meurtrier, régnant sur les mers avec une fin-tensité!",
  "description.whiteshark.two": "Plongez dans un océan de saveurs palpitantes!",

  // Marine Marvels
  "description.twilight.anglerfish":
    "Un poisson-pêcheur des profondeurs avec une lumière intégrée, guidant son chemin à travers les ténèbres.",
  "description.starlight.tuna":
    "Un thon qui brille plus que les étoiles, prêt à illuminer votre collection.",
  "description.radiant.ray":
    "Une raie qui préfère briller dans l'obscurité, avec un secret scintillant à partager.",
  "description.phantom.barracuda":
    "Un barracuda insaisissable et fantomatique des profondeurs, se cachant dans les ombres.",
  "description.gilded.swordfish":
    "Un espadon aux écailles qui scintillent comme de l'or, la capture ultime!",
  "description.crimson.carp": "Un joyau rare et vibrant des eaux du printemps.",
  "description.battle.fish": ENGLISH_TERMS["description.battle.fish"],
};

const fishermanModal: Record<FishermanModal, string> = {
  "fishermanModal.attractFish":
    "Attirez les poissons en jetant de l'appât dans l'eau.",
  "fishermanModal.fishBenefits":
    "Les poissons sont parfaits pour manger, livrer et obtenir des récompenses!",
  "fishermanModal.baitAndResources":
    "Apportez-moi de l'appât et des ressources, et nous attraperons les plus rares trésors que l'océan a à offrir!",
  "fishermanModal.crazyHappening":
    "Wow, quelque chose de fou se passe... C'est une frénésie de poissons!",
  "fishermanModal.fullMoon": ENGLISH_TERMS["fishermanModal.fullMoon"],
  "fishermanModal.bonusFish":
    "Dépêchez-vous, vous obtiendrez un poisson bonus pour chaque capture!",
  "fishermanModal.dailyLimitReached":
    "Vous avez atteint votre limite quotidienne de pêche de {{limit}}",
  "fishermanModal.needCraftRod":
    "Vous devez d'abord fabriquer une canne à pêche.",
  "fishermanModal.craft.beach": "Fabriquez-la sur la plage",
  "fishermanModal.zero.available": "0 disponible",
  "fishermanmodal.greeting":
    "Ahoy, camarades insulaires ! Je suis {{name}}, votre fidèle pêcheur insulaire, et j'ai lancé un grand défi - collecter tous les poissons sous le soleil!",
};

const fishermanQuest: Record<FishermanQuest, string> = {
  "fishermanQuest.Ohno": "Oh non ! Il s'est échappé",
  "fishermanQuest.Newfish": "Nouveau poisson",
};

const fishingChallengeIntro: Record<FishingChallengeIntro, string> = {
  "fishingChallengeIntro.powerfulCatch": "Une prise puissante vous attend!",
  "fishingChallengeIntro.useStrength":
    "Utilisez toute votre force pour la ramener.",
  "fishingChallengeIntro.stopGreenBar":
    "Arrêtez la barre verte sur le poisson pour réussir.",
  "fishingChallengeIntro.beQuick":
    "Soyez rapide - 3 tentatives ratées, et il s'échappe!",
};

const fishingGuide: Record<FishingGuide, string> = {
  "fishingGuide.catch.rod":
    "Fabriquez une canne à pêche et rassemblez de l'appât pour attraper des poissons.",
  "fishingGuide.bait.earn":
    "L'appât peut être obtenu en compostant ou en fabriquant des leurres.",
  "fishingGuide.eat.fish":
    "Mangez du poisson pour faire monter de niveau votre Bumpkin ou effectuez des livraisons de poissons pour obtenir des récompenses.",
  "fishingGuide.discover.fish":
    "Explorez les eaux pour découvrir des poissons rares, accomplir des missions et débloquer des récompenses uniques dans le Codex.",
  "fishingGuide.condition":
    "Soyez attentif aux changements de marée ; certaines espèces de poissons ne sont disponibles que dans certaines conditions.",
  "fishingGuide.bait.chum":
    "Expérimentez avec différents types d'appâts et de combinaisons de chum pour maximiser vos chances de capturer différentes espèces de poissons.",
  "fishingGuide.legendery.fish":
    "Méfiez-vous des poissons légendaires ; ils nécessitent une compétence et une force exceptionnelles pour être capturés.",
};

const fishingQuests: Record<FishingQuests, string> = {
  "quest.basic.fish": "Attrapez chaque poisson de base",
  "quest.advanced.fish": "Attrapez chaque poisson avancé",
  "quest.all.fish": "Découvrez chaque poisson de base, avancé et expert",
  "quest.300.fish": "Attrapez 300 poissons",
  "quest.1500.fish": "Attrapez 1500 poissons",
  "quest.marine.marvel": "Attrapez chaque merveille marine",
  "quest.5.fish": "Attrapez 5 exemplaires de chaque poisson",
  "quest.sunpetal.savant": "Découvrez 12 variantes de Sunpetal",
  "quest.bloom.bigshot": "Découvrez 12 variantes de Bloom",
  "quest.lily.luminary": "Découvrez 12 variantes de Lily",
};

const flowerBed: Record<FlowerBed, string> = {
  "flowerBedGuide.buySeeds": "Achetez des graines à la boutique de graines.",
  "flowerBedGuide.crossbreedWithCrops":
    "Croisez-les avec des cultures et d'autres fleurs pour découvrir de nouvelles espèces de fleurs.",
  "flowerBedGuide.collectAllSpecies":
    "Collectionnez toutes les espèces de fleurs dans le Codex!",
  "flowerBedGuide.beesProduceHoney":
    "Les abeilles produisent du Honey pendant que les fleurs poussent.",
  "flowerBedGuide.fillUpBeehive":
    "Remplissez complètement une ruche et collectez le Honey pour avoir une chance qu'un essaim d'abeilles apparaisse.",
  "flowerBedGuide.beeSwarmsBoost":
    "Les essaims d'abeilles donnent un bonus de +0,2 aux cultures plantées.",
  "flowerBed.newSpecies.discovered":
    "Parbleu, vous avez découvert une nouvelle espèce de fleur!",
  "flowerBedContent.select.combination": "Sélectionnez votre combinaison",
  "flowerBedContent.select.seed": "Sélectionnez une graine",
  "flowerBedContent.select.crossbreed": "Sélectionnez un croisement",
};

const flowerbreed: Record<Flowerbreed, string> = {
  "flower.breed.sunflower":
    "Les botanistes de Bumpkin jurent que ce ne sont pas des fleurs.",
  "flower.breed.cauliflower":
    "Pas si sûr de ce que disent les botanistes de Bumpkin à propos de celle-ci.",
  "flower.breed.beetroot": "Elle a une belle couleur violette.",
  "flower.breed.parsnip":
    "Un Parsnip pourrait être un bon choix pour le croisement.",
  "flower.breed.eggplant":
    "L'aubergine a une couleur vibrante, peut-être qu'elle se croisera bien.",
  "flower.breed.radish": "Wow, ce Radish est rouge!",
  "flower.breed.kale": "Il est vert, mais pas comme les autres légumes verts.",
  "flower.breed.blueberry":
    "Ces myrtilles sont très mûres, j'espère qu'elles ne tacheront pas.",
  "flower.breed.apple": "Des pommes croquantes!",
  "flower.breed.banana": "Une grappe de bananes.",
  "flower.breed.redPansy": "Une pensée rouge.",
  "flower.breed.yellowPansy": "Une pensée jaune.",
  "flower.breed.purplePansy": "Une pensée violette.",
  "flower.breed.whitePansy":
    "Une pensée blanche. Dépourvue de couleur, je me demande si c'est rare.",
  "flower.breed.bluePansy": "Une pensée bleue.",
  "flower.breed.redCosmos": "Un cosmos rouge.",
  "flower.breed.yellowCosmos": "Un cosmos jaune.",
  "flower.breed.purpleCosmos": "Un cosmos violet.",
  "flower.breed.whiteCosmos": "Un cosmos blanc.",
  "flower.breed.blueCosmos": "Un cosmos bleu. Très descriptif.",
  "flower.breed.prismPetal":
    "Une mutation extrêmement rare. Êtes-vous sûr de vouloir la croiser?",
  "flower.breed.redBalloonFlower":
    "Les fleurs de ballon sont très jolies. Surtout les rouges.",
  "flower.breed.yellowBalloonFlower": "Une fleur de ballon jaune.",
  "flower.breed.purpleBalloonFlower": "Une fleur de ballon violette.",
  "flower.breed.whiteBalloonFlower": "Une fleur de ballon blanche. C'est rare.",
  "flower.breed.blueBalloonFlower":
    "La plus basique des fleurs de ballon. Rien à en dire de spécial.",
  "flower.breed.redDaffodil": "Un red daffoldil",
  "flower.breed.yellowDaffodil": "Un yellow daffoldil",
  "flower.breed.purpleDaffodil": "Un purple daffoldil",
  "flower.breed.whiteDaffodil": "Un white daffoldil",
  "flower.breed.blueDaffodil": "Un blue daffoldil",
  "flower.breed.celestialFrostbloom":
    "Une mutation extrêmement rare. Êtes-vous sûr de vouloir la croiser?",
  "flower.breed.redCarnation":
    "Les Bumpkins apprécient la carnation rouge pour sa rareté.",
  "flower.breed.yellowCarnation":
    "Les Bumpkins ne valorisent pas la carnation jaune.",
  "flower.breed.purpleCarnation":
    "Les Bumpkins apprécient la carnation violette pour sa beauté.",
  "flower.breed.whiteCarnation":
    "Les Bumpkins apprécient la carnation blanche pour sa simplicité.",
  "flower.breed.blueCarnation":
    "Les Bumpkins apprécient la carnation bleue pour sa capacité à se croiser avec les graines Bloom.",
  "flower.breed.redLotus": "Un red lotus",
  "flower.breed.yellowLotus": "Un yellow lotus",
  "flower.breed.purpleLotus": "Un purple lotus",
  "flower.breed.whiteLotus": "Un white lotus",
  "flower.breed.blueLotus": "Un blue lotus",
  "flower.breed.primulaEnigma":
    "Une mutation extrêmement rare. Êtes-vous sûr de vouloir la croiser?",
};

const flowerShopTerms: Record<FlowerShopTerms, string> = {
  "flowerShop.desired.dreaming":
    "Oh, j'ai rêvé de cultiver un {{desiredFlowerName}} !",
  "flowerShop.desired.delightful":
    "Comme ce serait ravissant d'avoir un {{desiredFlowerName}}.",
  "flowerShop.desired.wonderful":
    "Comme ce serait merveilleux d'avoir un {{desiredFlowerName}} !",
  "flowerShop.desired.setMyHeart":
    "J'ai mis mon cœur à cultiver un {{desiredFlowerName}}.",
  "flowerShop.missingPages.alas":
    "Mais hélas ! J'ai égaré les pages de mon livre de croisement ! Elles doivent être quelque part sur la place.",
  "flowerShop.missingPages.cantBelieve":
    "Mais je n'arrive pas à y croire, les pages avec mes meilleures recettes de fleurs hybrides ont disparu. Elles doivent être quelque part sur la place.",
  "flowerShop.missingPages.inABind":
    "Cependant, je suis un peu dans l'embarras - les pages contenant mes techniques de croisement semblent avoir disparu. Elles doivent être quelque part sur la place.",
  "flowerShop.missingPages.sadly":
    "Malheureusement, mes notes de croisement ont disparu ! Je suis sûr qu'elles sont quelque part ici. Elles doivent être quelque part sur la place.",
  "flowerShop.noFlowers.noTrade":
    "Je suis désolé, je n'ai pas de fleurs à échanger pour le moment.",
  "flowerShop.do.have.trade":
    "As-tu un {{desiredFlower}} que tu voudrais échanger avec moi ?",
  "flowerShop.do.have.trade.one":
    "As-tu un {{desiredFlower}} que tu serais prêt à échanger ?",
};

const foodDescriptions: Record<FoodDescriptions, string> = {
  // Fire Pit
  "description.pumpkin.soup": "Une soupe crémeuse que les gobelins adorent",
  "description.mashed.potato": "Ma vie, c'est la potato.",
  "description.bumpkin.broth":
    "Un bouillon nutritif pour recharger votre Bumpkin",
  "description.boiled.eggs":
    "Les œufs durs sont parfaits pour le petit-déjeuner",
  "description.kale.stew": "Un parfait Booster de Bumpkin!",
  "description.mushroom.soup": "Réchauffez l'âme de votre Bumpkin.",
  "description.reindeer.carrot": "Rudolph ne peut pas s'arrêter de les manger!",
  "description.kale.omelette": "Un petit-déjeuner sain",
  "description.cabbers.mash": "Choux et purée de potato",
  "description.popcorn":
    "Une collation croustillante classique cultivée à la maison.",
  "description.gumbo":
    "Une marmite pleine de magie ! Chaque cuillerée est une parade de Mardi Gras!",
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

  // Kitchen
  "description.roast.veggies":
    "Même les gobelins ont besoin de manger leurs légumes!",
  "description.bumpkin.salad": "Il faut garder votre Bumpkin en bonne santé!",
  "description.goblins.treat": "Les gobelins raffolent de ce truc!",
  "description.cauliflower.burger": "Appel à tous les amateurs de Cauliflower!",
  "description.club.sandwich":
    "Rempli de carottes et de graines de tournesol rôties",
  "description.mushroom.jacket.potatoes":
    "Garnissez ces potato de tout ce que vous avez!",
  "description.sunflower.crunch":
    "Un régal croquant. Essayez de ne pas le brûler.",
  "description.bumpkin.roast": "Un plat traditionnel de Bumpkin",
  "description.goblin.brunch": "Un plat traditionnel de gobelin",
  "description.fruit.salad": "Salade de fruits, Miam Miam",
  "description.bumpkin.ganoush": "Sauce d'aubergine rôtie relevée.",
  "description.chowder":
    "Le délice d'un marin dans un bol ! Plongez-y, il y a un trésor à l'intérieur!",
  "description.pancakes": "Un excellent début de journée pour un Bumpkin",

  // Bakery
  "description.apple.pie": "La fameuse recette de Bumpkin Betty",
  "description.kale.mushroom.pie": "Une recette traditionnelle de Sapphiron",
  "description.cornbread": "Un pain rustique doré et frais de la ferme.",
  "description.sunflower.cake": "Gâteau au tournesol",
  "description.potato.cake": "Gâteau à la potato",
  "description.pumpkin.cake": "Gâteau à la pumpkin",
  "description.carrot.cake": "Gâteau à la carotte",
  "description.cabbage.cake": "Gâteau au Cabbage",
  "description.beetroot.cake": "Gâteau à la betterave",
  "description.cauliflower.cake": "Gâteau au Cauliflower",
  "description.parsnip.cake": "Gâteau au Parsnip",
  "description.radish.cake": "Gâteau au Radish",
  "description.wheat.cake": "Gâteau au Wheat",
  "description.honey.cake": "Un gâteau délicieux!",
  "description.eggplant.cake": "Douceur sucrée tout droit de la ferme.",
  "description.orange.cake":
    "Vous êtes content que nous ne cuisinions pas de pommes",
  "description.pirate.cake":
    "Idéal pour les fêtes d'anniversaire sur le thème des pirates.",

  // Deli
  "description.blueberry.jam":
    "Les gobelins feraient n'importe quoi pour cette confiture",
  "description.fermented.carrots": "Vous avez un surplus de carottes?",
  "description.sauerkraut": "Fini le Cabbage ennuyeux!",
  "description.fancy.fries": "Frites fantastiques",
  "description.fermented.fish":
    "Délice audacieux ! Libérez le Viking qui est en vous à chaque bouchée!",

  // Smoothie Shack
  "description.apple.juice": "Une boisson rafraîchissante et croustillante",
  "description.orange.juice":
    "L'OJ se marie parfaitement avec un Club Sandwich",
  "description.purple.smoothie": "On ne sent presque pas le Cabbage",
  "description.power.smoothie":
    "Boisson officielle de la Bumpkin Powerlifting Society",
  "description.bumpkin.detox": "Lavez les péchés de la veille",
  "description.banana.blast":
    "Le carburant fruité ultime pour ceux qui ont une peau pour la puissance!",

  // Unused foods
  "description.roasted.cauliflower": "Le favori des gobelins",
  "description.radish.pie": "Détestée par les humains, adorée par les gobelins",
};

const gameDescriptions: Record<GameDescriptions, string> = {
  // Objets de quête
  "description.goblin.key": "La Clé des Gobelins",
  "description.sunflower.key": "La Clé du Tournesol",
  "description.ancient.goblin.sword": "Une Ancienne Épée des Gobelins",
  "description.ancient.human.warhammer": "Un Ancien Marteau de Guerre Humain",

  // Coupons
  "description.community.coin":
    "Une pièce de valeur pouvant être échangée contre des récompenses",
  "description.bud.seedling":
    "Une jeune pousse à échanger contre un NFT Bud gratuit",
  "description.gold.pass":
    "Un laissez-passer exclusif permettant au détenteur de fabriquer des NFT rares, de commercer, de retirer et d'accéder à du contenu bonus.",
  "description.rapid.growth":
    "À appliquer sur une culture pour une croissance deux fois plus rapide",
  "description.bud.ticket":
    "Une place garantie pour frapper un Bud lors de la distribution des NFT Sunflower Land Buds.",
  "description.potion.ticket":
    "Une récompense de la Maison des Potions. Utilisez-la pour acheter des articles auprès de Garth.",
  "description.trading.ticket": "Échanges gratuits ! Hourra!",
  "description.block.buck": "Un jeton précieux dans Sunflower Land!",
  "description.beta.pass":
    "Accédez en avant-première à des fonctionnalités pour les tester.",
  "description.war.bond": "La marque d'un vrai guerrier",
  "description.allegiance": "Une déclaration d'allégeance",
  "description.jack.o.lantern": "Un objet spécial d'événement d'Halloween",
  "description.golden.crop": "Une culture dorée étincelante",
  "description.red.envelope": "Wow, vous avez de la chance!",
  "description.love.letter": "Transmettez des sentiments d'amour",
  "description.solar.flare.ticket":
    "Un billet utilisé pendant la saison des Éruptions Solaires",
  "description.dawn.breaker.ticket":
    "Un billet utilisé pendant la saison de l'Éclaireur de l'Aube",
  "description.crow.feather":
    "Un billet utilisé pendant la saison des Billets de la Veille des Sorcières",
  "description.mermaid.scale":
    "Un billet utilisé pendant la saison de la Chasse au Kraken",
  "description.sunflower.supporter":
    "La marque d'un véritable supporter du jeu!",
  "description.arcade.coin":
    "Un jeton gagné lors de mini-jeux et d'aventures. Peut être échangé contre des récompenses.",
  "description.farmhand.coupon":
    "Un coupon à échanger contre un ouvrier agricole de votre choix.",
  "description.farmhand": "Un Bumpkin adopté dans votre ferme.",
  "description.tulip.bulb":
    "Un billet utilisé pendant la Floraison du Printemps.",
  "description.treasure.key":
    "Visitez la place pour débloquer votre récompense",
  "description.rare.key": "Visitez la plage pour débloquer votre récompense",
  "description.luxury.key":
    "Visitez la place près des bois pour débloquer votre récompense",
  "description.prizeTicket":
    "Un ticket pour participer au concours de fin de saison",
  "description.babyPanda": "Un adorable panda de l'événement Gas Hero.",
  "description.baozi":
    "Une délicieuse friandise de l'événement du Nouvel An lunaire.",
  "description.communityEgg":
    "Wow, vous devez vraiment vous soucier de la communauté !",
  "description.hungryHare":
    "Ce lapin vorace saute dans votre ferme. Un objet spécial de l'événement de Pâques 2024.",

  // Objets de Pâques
  "description.egg.basket": "Événement de Pâques",
  "description.blue.egg": "Un œuf de Pâques bleu",
  "description.orange.egg": "Un œuf de Pâques orange",
  "description.green.egg": "Un œuf de Pâques vert",
  "description.yellow.egg": "Un œuf de Pâques jaune",
  "description.red.egg": "Un œuf de Pâques rouge",
  "description.pink.egg": "Un œuf de Pâques rose",
  "description.purple.egg": "Un œuf de Pâques violet",

  // Accueil
  "description.homeOwnerPainting":
    "Un tableau du propriétaire de cette maison.",

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
  "auction.winner": "Gagnant de l'enchère!",
  "bumpkin.level": "Niveau de Bumpkin",
  bumpkinBuzz: "Boites aux lettres",
  dailyLim: "Limite quotidienne de SFL",
  "farm.banned": "Cette ferme est interdite",
  gobSwarm: "Nuée de Gobelins!",
  "granting.wish": "Exaucement de votre souhait",
  "new.delivery.in": "Nouvelles livraisons disponibles dans",
  "new.delivery.levelup": "Montez de niveau pour débloquer plus de livraisons.",
  "no.sfl": "Aucun jeton SFL trouvé",
  opensea: "OpenSea",
  polygonscan: "PolygonScan",
  potions: "Potions",
  "proof.of.humanity": "Preuve d'Humanité",
  sflDiscord: "Serveur Discord de Sunflower Land",
  "in.progress": "En cours",
  "compost.complete": "Compost terminé",
  "aoe.locked": "AOE verrouillé",
  sunflowerLandCodex: "Sunflower Land Codex",
  "visiting.farmId": ENGLISH_TERMS["visiting.farmId"],
  "harvest.number": ENGLISH_TERMS["harvest.number"],
  "level.number": ENGLISH_TERMS["level.number"],
  "stock.left": ENGLISH_TERMS["stock.left"],
  "stock.inStock": ENGLISH_TERMS["stock.inStock"],
};

const garbageCollector: Record<GarbageCollector, string> = {
  "garbageCollector.welcome": "Bienvenue dans ma modeste boutique.",
  "garbageCollector.description":
    "Je suis le Marchand d'Ordures, et j'achèterai tout ce que vous avez - tant que c'est de la garbage.",
};

const genieLamp: Record<GenieLamp, string> = {
  "genieLamp.ready.wish": "Prêt à faire un vœu?",
  "genieLamp.cannotWithdraw":
    "Vous ne pouvez pas retirer la lampe une fois qu'elle a été frottée",
};

const getContent: Record<GetContent, string> = {
  "getContent.error": "Erreur!",
  "getContent.joining": "En cours de connexion",
  "getContent.accessGranted":
    "Vous avez désormais accès. Allez voir le canal sur Discord",
  "getContent.connectToDiscord":
    "Vous devez être connecté à Discord pour rejoindre un canal restreint.",
  "getContent.connect": "Se connecter",
  "getContent.getAccess": "Obtenez l'accès aux groupes restreints sur Discord",
  "getContent.requires": "Nécessite",
  "getContent.join": "Rejoindre",
};

const getInputErrorMessage: Record<GetInputErrorMessage, string> = {
  "getInputErrorMessage.place.bid":
    "Êtes-vous sûr de vouloir placer cette enchère?",
  "getInputErrorMessage.cannot.bid":
    "Les enchères ne peuvent pas être modifiées une fois qu'elles ont été placées.",
};

const goblin_messages: Record<GOBLIN_MESSAGES, string> = {
  "goblinMessages.msg1":
    "Eh toi ! Humain ! Apporte-moi de la nourriture ou sinon...",
  "goblinMessages.msg2":
    "J'ai toujours faim, tu as des friandises appétissantes pour moi?",
  "goblinMessages.msg3":
    "Peu m'importe ce que c'est, donne-moi de la nourriture!",
  "goblinMessages.msg4":
    "Si tu ne me donnes pas quelque chose à manger, je pourrais être tenté de te grignoter.",
  "goblinMessages.msg5":
    "J'ai entendu dire que la nourriture humaine est la meilleure, apporte-moi quelque chose!",
  "goblinMessages.msg6":
    "Hé, tu as de la nourriture qui ne me rendra pas malade?",
  "goblinMessages.msg7":
    "Je commence à m'ennuyer de manger la même chose, as-tu quelque chose de différent?",
  "goblinMessages.msg8":
    "J'ai faim de quelque chose de nouveau, as-tu quelque chose d'exotique?",
  "goblinMessages.msg9":
    "Salut, as-tu des collations à épargner ? Je te promets de ne pas les voler... peut-être.",
  "goblinMessages.msg10":
    "Peu m'importe ce que c'est, donne-moi de la nourriture!",
};

const goldTooth: Record<GoldTooth, string> = {
  "goldTooth.intro.part1":
    "Arrr, mes matelots ! La zone de recherche de trésors regorge de richesses et d'aventures, et elle ouvrira bientôt ses portes aux intrépides fermiers!",
  "goldTooth.intro.part2":
    "Soyez prêts à rejoindre mon équipage, car la chasse aux richesses commence sous peu!",
};

const guideCompost: Record<GuideCompost, string> = {
  "guide.compost.addEggs.speed":
    "Ajoutez des œufs pour accélérer la production",
  "guide.compost.addEggs": "Ajouter des œufs",
  "guide.compost.eggs": "Œufs",
  "guide.compost.cropGrowthTime": "-50% Temps de croissance des cultures",
  "guide.compost.fishingBait": "Appât de pêche",
  "guide.compost.placeCrops":
    "Placez des cultures dans le composteur pour nourrir les vers",
  "guide.compost.compostCycle":
    "Un cycle de compostage produit plusieurs engrais qui peuvent être utilisés pour booster vos cultures et fruits",
  "guide.compost.yieldsWorms":
    "Chaque compost produit des vers qui peuvent être utilisés comme appât pour la pêche",
  "guide.compost.useEggs":
    "Fatigué d'attendre ? Utilisez des œufs pour accélérer la production de compost",
  "guide.compost.addEggs.confirmation":
    ENGLISH_TERMS["guide.compost.addEggs.confirmation"],
};

const guideTerms: Record<GuideTerms, string> = {
  "guide.intro":
    "De vos modestes débuts à la maîtrise de la ferme, ce guide vous couvre!",
  "gathering.guide.one":
    "Pour prospérer dans Sunflower Land, il est essentiel de maîtriser l'art de la collecte de ressources. Commencez par équiper les outils appropriés pour collecter différentes ressources. Utilisez la fidèle hache pour abattre des arbres et obtenir du Wood. Pour fabriquer des outils, rendez-vous à l'établi local et échangez vos Coins/ressources contre l'outil désiré.",
  "gathering.guide.two":
    "À mesure que vous progressez et collectez suffisamment de ressources, vous débloquerez la possibilité d'étendre votre territoire. L'expansion de votre île ouvre de nouvelles perspectives dans Sunflower Land. Les expansions de île révèlent un trésor de ressources, y compris un sol fertile pour planter des cultures, des arbres majestueux, des dépôts de pierres précieuses, des veines de fer précieux, des dépôts d'or scintillants, des champs de fruits délicieux et bien plus encore.",
  "gathering.guide.three":
    "N'oubliez pas que la collecte de ressources et l'expansion de l'île sont la base de votre voyage agricole. Acceptez les défis et les récompenses qui accompagnent chaque étape et regardez votre Sunflower Land s'épanouir avec des ressources abondantes et des possibilités infinies.",

  "crops.guide.one":
    "Dans Sunflower Land, les cultures jouent un rôle crucial dans votre voyage vers la prospérité. En plantant et en récoltant des cultures, vous pouvez gagner des Coins ou les utiliser pour fabriquer des recettes et des objets précieux dans le jeu.",
  "crops.guide.two":
    "Pour cultiver des cultures, vous devez acheter les graines respectives dans la boutique du jeu. Chaque culture a un temps de croissance différent, allant d'une minute pour les Sunflowers à 36 heures pour le Kale. Une fois les cultures entièrement développées, vous pouvez les récolter et récolter les récompenses.",
  "crops.guide.three":
    "N'oubliez pas que lorsque vous étendez votre île et progressez dans le jeu, de nouvelles cultures deviendront disponibles, offrant de plus grandes opportunités de gagner des Coins et d'explorer le potentiel immense de l'économie agricole de Sunflower Land. Alors mettez-vous au travail, plantez ces graines et regardez vos cultures prospérer en récoltant votre chemin vers le succès!",

  "building.guide.one":
    "Explorez la gamme diversifiée de bâtiments disponibles à mesure que vous progressez dans Sunflower Land. Des poulaillers aux ateliers et au-delà, chaque structure apporte des avantages uniques à votre ferme. Profitez de ces bâtiments pour rationaliser vos opérations agricoles, augmenter la productivité et débloquer de nouvelles possibilités. Planifiez soigneusement votre disposition et profitez des récompenses qui viennent avec la construction d'une ferme prospère à Sunflower Land.",
  "building.guide.two":
    "Dans Sunflower Land, les bâtiments sont la pierre angulaire de votre voyage agricole. Pour accéder au menu des bâtiments, cliquez sur l'icône Inventaire et sélectionnez l'onglet Bâtiments. Choisissez la structure souhaitée et revenez à l'écran de votre ferme. Trouvez un espace ouvert, marqué en vert, et confirmez l'emplacement. Attendez que le chronomètre se termine, et votre nouveau bâtiment sera prêt à être utilisé. Les bâtiments offrent divers avantages et débloquent des fonctionnalités de jeu passionnantes. Positionnez-les stratégiquement sur votre ferme pour maximiser l'efficacité et observez votre empire agricole grandir et prospérer.",

  "cooking.guide.one":
    "La cuisine vous permet de nourrir votre Bumpkin et de l'aider à gagner des points d'expérience précieux (XP). En utilisant les cultures que vous avez récoltées, vous pouvez préparer de délicieux plats dans différents bâtiments dédiés à la cuisine.",
  "cooking.guide.two":
    "À partir du foyer, chaque ferme a accès à des installations de cuisine de base dès le début. Cependant, à mesure que vous progressez, vous pouvez débloquer des bâtiments plus avancés tels que la cuisine, la boulangerie, la charcuterie et le Smoothie Shack, chacun offrant une plus grande variété de recettes et de délices culinaires.",
  "cooking.guide.three":
    "Pour cuisiner, sélectionnez simplement un bâtiment et choisissez une recette que vous souhaitez préparer. La recette fournira des détails sur les ingrédients requis, les XP gagnés à la consommation et le temps de préparation. Après avoir lancé le processus de cuisson, surveillez le chronomètre pour savoir quand la nourriture sera prête à être collectée.",
  "cooking.guide.four":
    "Une fois la nourriture prête, récupérez-la du bâtiment en cliquant dessus et en la déplaçant dans votre inventaire. À partir de là, vous pouvez interagir avec votre personnage Bumpkin sur la ferme et lui donner la nourriture préparée, l'aidant à gagner de l'XP et à progresser davantage dans le jeu.",
  "cooking.guide.five":
    "Expérimentez avec différentes recettes, débloquez de nouveaux bâtiments et découvrez la joie de cuisiner tout en nourrissant votre Bumpkin et en vous lançant dans une délicieuse aventure culinaire à Sunflower Land.",

  "animals.guide.one":
    "Les poules à Sunflower Land sont un ajout charmant à votre ferme, servant de source d'œufs utilisables dans diverses recettes et créations. Pour commencer avec les poules, vous devrez atteindre le niveau Bumpkin 9 et construire le poulailler. À partir de là, vous avez la possibilité d'acheter des poules ou de placer celles que vous avez déjà. Il vous suffit de les faire glisser et de les déposer sur votre ferme, comme pour les bâtiments. Sur une ferme standard, chaque poulailler abrite jusqu'à 10 poules, et si vous possédez le Chicken Coop SFT, cette limite s'étend à 15.",
  "animals.guide.two":
    "Chaque poule a un indicateur au-dessus de sa tête, affichant son humeur ou ses besoins actuels. Cela peut aller de la faim, de la fatigue, du bonheur ou de la prête à éclore. Pour garder vos poules contentes et productives, nourrissez-les en sélectionnant du Wheat dans votre inventaire et en interagissant avec la poule. L'alimentation lance le chronomètre des œufs, qui prend 48 heures pour que les œufs soient prêts à éclore. Une fois les œufs prêts, visitez votre ferme, vérifiez l'icône au-dessus de chaque poule et interagissez avec elles pour découvrir le type d'œuf qui a éclos. De temps en temps, vous pouvez même découvrir des poules mutantes rares, qui offrent des bonus spéciaux tels qu'une production d'œufs plus rapide, un rendement accru ou une consommation alimentaire réduite.",
  "animals.guide.three":
    "Nourrir vos poules et collecter leurs œufs ajoute un élément dynamique et gratifiant à votre ferme à Sunflower Land. Expérimentez avec des recettes, utilisez les œufs dans vos projets de création et profitez des surprises qui accompagnent les poules mutantes rares. Construisez une exploitation avicole prospère et récoltez les avantages de votre travail acharné en embrassant le monde charmant des poules à Sunflower Land.",

  "crafting.guide.one":
    "Dans Sunflower Land, la création de NFT (Jetons NFT) est un aspect essentiel pour augmenter votre production agricole et accélérer votre progression. Ces objets spéciaux offrent divers bonus, tels que des augmentations de la croissance des cultures, des améliorations de la cuisine et des renforcements des ressources, qui peuvent considérablement accélérer votre voyage. En maximisant vos Coins, vous pouvez fabriquer des outils, collecter des ressources, et étendre votre île pour établir davantage votre empire agricole.",
  "crafting.guide.two":
    "Pour commencer à fabriquer des objets, nous allons rendre visite à Igor, un artisan expérimenté de Sunfloria. Après avoir embarqué sur le bateau et être arrivé à Sunfloria, dirigez-vous vers le sommet de l'île pour entamer une conversation avec Igor. Il propose actuellement un Épouvantail de base, qui accélère la croissance des Sunflowers, des potato et des pumpkins. C'est une excellente affaire qui nécessite l'échange de vos ressources contre l'épouvantail. Une fois obtenu, retournez sur votre île principale et entrez en mode de conception en cliquant sur l'icône de la main blanche en haut à droite du jeu.",
  "crafting.guide.three":
    "En mode de conception, vous pouvez placer stratégiquement des objets et réorganiser les ressources sur votre ferme pour optimiser sa disposition et améliorer son attrait visuel. Cette étape est cruciale pour maximiser l'efficacité de votre équipement fabriqué. Par exemple, placez l'Épouvantail sur les parcelles que vous souhaitez booster. De plus, envisagez d'acheter des décorations pour ajouter du charme et de l'ordre à votre terrain.",
  "crafting.guide.four":
    "En fabriquant de l'équipement et en le plaçant stratégiquement, vous pouvez amplifier vos compétences agricoles, créer une maison insulaire dont vous pouvez être fier, et accélérer votre progression dans Sunflower Land.",
  "deliveries.guide.one":
    "Les livraisons dans Sunflower Land offrent une opportunité excitante pour aider les Gobelins affamés et les camarades Bumpkins tout en gagnant des récompenses. Chaque jour, vous pourrez voir toutes les commandes que vous avez en cliquant sur le tableau des livraisons en bas à gauche de l'écran. Les commandes ont été passées par certains PNJ locaux que l'on peut trouver autour de Pumpkin Plaza. Pour remplir une commande, vous devrez prendre un bateau pour Pumpkin Plaza et chercher le PNJ qui attend la livraison. Une fois que vous les avez trouvés, cliquez sur eux pour livrer la commande et recevoir votre récompense.",
  "deliveries.guide.two":
    "En tant que nouveau joueur, vous commencez avec trois emplacements de commande, mais en étendant votre ferme, vous débloquerez des emplacements supplémentaires, permettant aux joueurs avancés de prendre plus de commandes. De nouvelles commandes arrivent toutes les 24 heures, offrant une gamme de tâches, de la production agricole à la cuisine et à la collecte de ressources. En remplissant des commandes, vous obtiendrez des bonus de palier, notamment des Block Bucks, des SFL, Coins, des gâteaux délicieux et d'autres récompenses. Le système de récompenses est basé sur la difficulté de la demande, alors envisagez de donner la priorité aux commandes offrant de plus grandes récompenses pour maximiser vos gains. Gardez un œil sur le tableau et challengez-vous avec diverses commandes, montez de niveau et débloquez de nouveaux bâtiments au besoin pour répondre à des demandes plus exigeantes.",
  "deliveries.intro":
    "Voyagez vers différentes îles et livrez des marchandises pour gagner des récompenses.",
  "deliveries.new": "Nouvelle livraison",
  "chores.intro":
    "Effectuez des tâches autour de la ferme pour gagner des récompenses des Bumpkins.",
  "scavenger.guide.one":
    "Le fouilleur dans Sunflower Land offre des opportunités passionnantes pour découvrir des trésors cachés et rassembler des ressources précieuses. Le premier aspect de la fouille consiste à chercher des trésors sur Treasure Island, où vous pouvez devenir un chasseur de trésors pirate. En fabriquant une pelle en sable et en vous aventurant sur Treasure Island, vous pouvez creuser dans les zones de sable sombre pour découvrir divers trésors, y compris des butins, des décorations et même d'anciens SFTs avec utilité.",
  "scavenger.guide.two":
    "Une autre forme de fouille implique la collecte de champignons sauvages qui apparaissent spontanément sur votre ferme et les îles environnantes. Ces champignons peuvent être collectés gratuitement et utilisés dans des recettes, des quêtes et la fabrication d'objets. Gardez un œil sur ces champignons, car ils se reconstituent toutes les 16 heures, avec une limite maximale de 5 champignons sur votre ferme. Si votre terrain est plein, les champignons apparaîtront sur les îles environnantes, vous assurant de ne pas manquer ces ressources précieuses.",

  "fruit.guide.one":
    "Les fruits jouent un rôle important dans Sunflower Land en tant que ressource précieuse qui peut être vendue contre des Coins ou utilisée dans diverses recettes et fabrications. Contrairement aux cultures, les parcelles de fruits ont la capacité unique de se reconstituer plusieurs fois après chaque récolte, offrant ainsi une source durable de fruits pour les joueurs.",
  "fruit.guide.two":
    "Pour planter des fruits, vous devrez acquérir de plus grandes parcelles de fruits, disponibles à partir de la 9e à la 10e expansion de votre ferme.",
  "fruit.guide.three":
    "En cultivant des fruits et en les intégrant dans vos stratégies agricoles, vous pouvez maximiser vos profits, créer des recettes délicieuses et débloquer de nouvelles possibilités dans Sunflower Land.",

  "seasons.guide.one":
    "Les saisons dans Sunflower Land apportent de l'excitation et de la fraîcheur au jeu, offrant aux joueurs de nouveaux défis et opportunités. Avec l'arrivée de chaque saison, les joueurs peuvent s'attendre à une variété de nouveaux objets fabriquables, de décorations en édition limitée, d'animaux mutants et de trésors rares. Ces changements saisonniers créent une expérience de jeu dynamique et en évolution, encourageant les joueurs à adapter leurs stratégies et à explorer de nouvelles possibilités sur leurs fermes. De plus, les tickets saisonniers ajoutent un élément stratégique au jeu, car les joueurs doivent décider comment allouer judicieusement leurs tickets, que ce soit pour collecter des objets rares, opter pour des décorations à haute disponibilité ou échanger des tickets contre des SFL. Le mécanisme saisonnier maintient le jeu intéressant et garantit qu'il y a toujours quelque chose à attendre dans Sunflower Land.",
  "seasons.guide.two":
    "La disponibilité des objets saisonniers chez le forgeron Goblin ajoute une couche d'excitation supplémentaire. Les joueurs doivent rassembler les ressources nécessaires et les tickets saisonniers pour fabriquer ces objets en édition limitée, créant ainsi un sentiment de concurrence et d'urgence. La planification et la stratégie deviennent cruciales alors que les joueurs cherchent à sécuriser les objets désirés avant que l'offre ne s'épuise. De plus, l'option d'échanger des tickets saisonniers contre des Coins offre de la flexibilité et permet aux joueurs de faire des choix qui correspondent à leurs objectifs de jeu spécifiques. Avec les offres uniques de chaque saison et l'anticipation d'événements surprises, Sunflower Land maintient les joueurs engagés et divertis tout au long de l'année, favorisant une expérience agricole dynamique et en constante évolution.",

  "pete.teaser.one": "Abattez les arbres",
  "pete.teaser.three": "Récoltez les Sunflowers",
  "pete.teaser.four": "Vendez les Sunflowers",
  "pete.teaser.five": "Achetez des graines",
  "pete.teaser.six": "Plantez des graines",
  "pete.teaser.seven": "Fabriquez un Épouvantail",
  "pete.teaser.eight": "Cuisinez de la nourriture et montez de niveau",
};

const halveningCountdown: Record<HalveningCountdown, string> = {
  "halveningCountdown.approaching": "La Réduction approche!",
  "halveningCountdown.description":
    "À la Réduction, tous les prix des cultures et de certaines ressources sont réduits de moitié. Cela rend plus difficile l'obtention de SFL.",
  "halveningCountdown.preparation": "Assurez-vous d'être prêt!",
  "halveningCountdown.title": "Réduction",
};

const harvestBeeHive: Record<HarvestBeeHive, string> = {
  "harvestBeeHive.notPlaced": "Cette ruche n'est pas placée.",
  "harvestBeeHive.noHoney": "Cette ruche n'a pas de Honey.",
};

const harvestflower: Record<Harvestflower, string> = {
  "harvestflower.noFlowerBed": "Le lit de fleurs n'existe pas",
  "harvestflower.noFlower": "Le lit de fleurs n'a pas de fleur",
  "harvestflower.notReady": "La fleur n'est pas prête à être récoltée",
  "harvestflower.alr.plant": "La fleur est déjà plantée",
};

const hayseedHankPlaza: Record<HayseedHankPlaza, string> = {
  "hayseedHankPlaza.cannotCompleteChore":
    "Impossible de terminer cette corvée?",
  "hayseedHankPlaza.skipChore": "Passer la corvée",
  "hayseedHankPlaza.canSkipIn": "Vous pouvez passer cette corvée dans",
  "hayseedHankPlaza.wellDone": "Bien joué",
  "hayseedHankPlaza.lendAHand": "Donner un coup de main?",
};

const hayseedHankV2: Record<HayseedHankV2, string> = {
  "hayseedHankv2.dialog1":
    "Eh bien, bonjour à vous, jeunes froussards ! Je suis Hayseed Hank, un vieux fermier expérimenté, travaillant la terre comme au bon vieux temps.",
  "hayseedHankv2.dialog2": ENGLISH_TERMS["hayseedHankv2.dialog2"],
  "hayseedHankv2.action": "Allons-y",
  "hayseedHankv2.title": "Les corvées quotidiennes de Hank",
  "hayseedHankv2.newChoresAvailable": "De nouvelles corvées disponibles dans ",
  "hayseedHankv2.skipChores":
    "Vous pouvez sauter des corvées chaque nouveau jour.",
  "hayseedHankv2.greeting":
    "Eh bien, bonjour à vous, jeunes froussards ! Je suis Hayseed Hank...",
};

const heliosSunflower: Record<HeliosSunflower, string> = {
  "heliosSunflower.title": "Clytie la Tournesol",
  "heliosSunflower.description":
    "Seul le véritable sauveur peut revenir et récolter cette Tournesol.",
  "confirmation.craft": ENGLISH_TERMS["confirmation.craft"],
};

const helper: Record<Helper, string> = {
  "helper.highScore1":
    "Incroyable ! Vous maîtrisez l'art de la fabrication de potions!",
  "helper.highScore2": "Magnifique ! Vos compétences donnent vie à la plante!",
  "helper.highScore3":
    "Étonnant ! La plante est émerveillée par votre expertise!",
  "helper.midScore1":
    "Presque ! Votre potion a eu un impact positif sur la plante!",
  "helper.midScore2":
    "Continuez comme ça ! La plante commence à prospérer grâce à votre concoction habile!",
  "helper.midScore3":
    "Bien joué ! Votre potion commence à agir comme par magie sur la plante!",
  "helper.lowScore1": "Vous y arrivez. La plante montre des signes de bonheur.",
  "helper.lowScore2":
    "Bel effort. Votre potion a apporté un peu de joie à la plante.",
  "helper.lowScore3":
    "Pas mal. Vos compétences commencent à faire bonne impression sur la plante.",
  "helper.veryLowScore1":
    "Continuez d'essayer. La plante reconnaît votre détermination.",
  "helper.veryLowScore2":
    "Vous vous en rapprochez. La plante voit vos progrès.",
  "helper.veryLowScore3":
    "Pas tout à fait, mais la plante ressent votre engagement.",
  "helper.noScore1":
    "Oh non ! La plante déteste quelque chose dans votre potion ! Réessayez.",
  "helper.noScore2":
    "Oups ! La plante se recule devant quelque chose dans votre potion ! Réessayez.",
  "helper.noScore3":
    "Uh-oh ! Quelque chose dans votre potion est un échec total auprès de la plante ! Réessayez.",
};

const henHouseTerms: Record<HenHouseTerms, string> = {
  "henHouse.chickens": "Poules",
  "henHouse.text.one": "Nourrissez-les avec du Wheat et collectez des œufs",
  "henHouse.text.two": "Poule paresseuse",
  "henHouse.text.three":
    "Mettez vos poules au travail pour commencer à collecter des œufs!",
  "henHouse.text.four": "Poule travailleuse",
  "henHouse.text.five": "Déjà placées et au travail!",
  "henHouse.text.six":
    "Construisez une autre Maison de Poules pour élever plus de poules",
};

const howToFarm: Record<HowToFarm, string> = {
  "howToFarm.title": "Comment cultiver?",
  "howToFarm.stepOne": "1. Récoltez les cultures lorsqu'elles sont prêtes",
  "howToFarm.stepTwo": "2. Rendez-vous en ville et cliquez sur la boutique",
  "howToFarm.stepThree":
    "3. Vendez les cultures à la boutique contre des Coins",
  "howToFarm.stepFour": "4. Achetez des graines avec vos Coins",
  "howToFarm.stepFive": "5. Plantez les graines et attendez",
};

const howToSync: Record<HowToSync, string> = {
  "howToSync.title": "Comment synchroniser?",
  "howToSync.description":
    "Tout votre progrès est enregistré sur notre serveur de jeu. Vous devrez synchroniser sur la chaîne lorsque vous souhaiterez déplacer vos jetons, NFT et ressources sur Polygon.",
  "howToSync.stepOne": "1. Ouvrez le menu",
  "howToSync.stepTwo": "2. Cliquez sur 'Synchroniser sur la chaîne'",
};

const howToUpgrade: Record<HowToUpgrade, string> = {
  "howToUpgrade.title": "Comment améliorer?",
  "howToUpgrade.stepOne": "1. Parlez à un lutin bloquant les champs",
  "howToUpgrade.stepTwo": "2. Visitez la ville et cliquez sur la cuisine",
  "howToUpgrade.stepThree": "3. Fabriquez la nourriture que le lutin souhaite",
  "howToUpgrade.stepFour":
    "4. Voilà ! Profitez de vos nouveaux champs et cultures",
};

const interactableModals: Record<InteractableModals, string> = {
  "interactableModals.returnhome.message": "Souhaitez-vous rentrer chez vous?",
  "interactableModals.fatChicken.message":
    "Pourquoi ces Bumpkins ne me laissent-ils pas tranquille ? Je veux juste me détendre.",
  "interactableModals.lazyBud.message": "Eeeep ! Tellement fatigué.....",
  "interactableModals.bud.message":
    "Hmmm, je ferais mieux de laisser ce bourgeon tranquille. Je suis sûr que son propriétaire le recherche.",
  "interactableModals.walrus.message":
    "Arrr arr arrr ! La poissonnerie n'ouvrira pas avant que je n'aie mon poisson.",
  "interactableModals.plazaBlueBook.message1":
    "Pour invoquer les chercheurs, nous devons rassembler l'essence de la terre - les pumpkins, nourries par la terre, et les œufs, la promesse de nouveaux départs.",
  "interactableModals.plazaBlueBook.message2":
    "Au crépuscule, lorsque la lune jette sa lueur argentée, nous offrons nos modestes cadeaux, espérant éveiller une fois de plus leurs yeux vigilants.",
  "interactableModals.plazaOrangeBook.message1":
    "Nos braves défenseurs ont combattu vaillamment, mais hélas, nous avons perdu la grande guerre, et les Moonseekers nous ont chassés de notre patrie. Pourtant, nous gardons espoir, car un jour nous reprendrons ce qui était autrefois le nôtre.",
  "interactableModals.plazaOrangeBook.message2":
    "D'ici là, nous garderons Sunflower Land vivant dans nos cœurs et nos rêves, en attendant le jour de notre retour triomphant.",
  "interactableModals.beachGreenBook.message1":
    "Lorsque vous visez ces précieux vivaneaux rouges, essayez une touche inattendue.",
  "interactableModals.beachGreenBook.message2":
    "Utilisez des pommes avec de l'appât pour ver rouge, et regardez ces beautés cramoisies sauter presque dans votre filet.",
  "interactableModals.beachBlueBook.message1":
    "Ne le dites pas à Shelly, mais j'ai essayé d'amener des Saw Sharks à la plage!",
  "interactableModals.beachBlueBook.message2":
    "J'ai fait des expériences avec différents appâts ces derniers temps, mais le seul qui semble fonctionner est le vivaneau rouge.",
  "interactableModals.beachBlueBook.message3":
    "Ces chasseurs océaniques peuvent sentir un festin de vivaneau rouge à des kilomètres de distance, alors ne soyez pas surpris s'ils accourent.",
  "interactableModals.beachOrangeBook.message1":
    "Une nageoire rayonnante est apparue à la surface, je n'en croyais pas mes yeux!",
  "interactableModals.beachOrangeBook.message2":
    "Heureusement, Tango était avec moi, il doit être mon porte-bonheur.",
  "interactableModals.plazaGreenBook.message1":
    "Les Bumpkins contrôlent ces îles, nous laissant, les gobelins, avec peu de travail et encore moins de nourriture.",
  "interactableModals.plazaGreenBook.message2":
    "Nous luttons pour l'égalité, un endroit que nous pouvons appeler chez nous, où nous pouvons vivre et prospérer.",
  "interactableModals.fanArt.winner": "Gagnant Fan art ",
  "interactableModals.fanArt1.message":
    "Félicitations Palisman, le gagnant du premier concours de Fan Art",
  "interactableModals.fanArt2.message":
    "Félicitations Vergelsxtn, le gagnant du concours de Fan Art de Dawn Breaker Party",
  "interactableModals.fanArt2.linkLabel": "Voir plus",
  "interactableModals.fanArt3.message":
    "L'endroit parfait pour une belle peinture. Je me demande ce qu'ils mettront ici la prochaine fois...",
  "interactableModals.clubhouseReward.message1":
    "Patience, mon ami, les récompenses arrivent...",
  "interactableModals.clubhouseReward.message2":
    "Rejoignez #bud-clubhouse sur Discord pour les dernières mises à jour.",
  "interactableModals.plazaStatue.message":
    "En l'honneur de Bumpkin Braveheart, l'agriculteur infatigable qui a rallié notre ville contre la horde des gobelins pendant les jours sombres de la guerre ancienne.",
  "interactableModals.dawnBook1.message1":
    "Depuis des siècles, notre famille protège Dawn Breaker Island. En tant que sonneur de cloche de l'île, nous avons averti des dangers venant du Nord, même lorsque des créatures obscures menacent notre maison.",
  "interactableModals.dawnBook1.message2":
    "Notre famille se tient en première ligne de défense contre les ténèbres qui se répandent du Nord, mais hélas, nos sacrifices passent inaperçus.",
  "interactableModals.dawnBook1.message3":
    "Viendra-t-il un jour où notre dévouement sera reconnu?",
  "interactableModals.dawnBook2.message1":
    "Les Eggplants, elles sont plus qu'elles n'en ont l'air. Malgré leur extérieur sombre qui attire les créatures obscures, elles apportent de la lumière à nos plats.",
  "interactableModals.dawnBook2.message2":
    "Grillées ou réduites en purée dans un Bumpkin ganoush, leur polyvalence est inégalée. Les légumes de la nuit sont un symbole de notre résilience face à l'adversité.",
  "interactableModals.dawnBook3.message1":
    "Cher journal, l'arrivée des Bumpkins a apporté un rayon d'espoir.",
  "interactableModals.dawnBook3.message2":
    "Je rêve du jour où je pourrai diriger mon propre bateau vers Sunfloria, la terre où aventuriers et voyageurs se rassemblent.",
  "interactableModals.dawnBook3.message3":
    "J'ai entendu murmurer à propos des préparatifs spéciaux des Bumpkins là-bas - un phare de promesse en ces temps difficiles.",
  "interactableModals.dawnBook4.message1":
    "Les gnomes, leur pouvoir d'attraction était trop puissant pour résister.",
  "interactableModals.dawnBook4.message2":
    "Les instructions de la sorcière résonnaient dans mon esprit - 'Alignez les trois, et le pouvoir sera vôtre.'",
  "interactableModals.dawnBook4.message3":
    "Hélas, même les soldats d'aubergine ne pouvaient pas résister à la tentation. Mais je ne fléchirai pas. Un jour, je revendiquerai le pouvoir qui me revient de droit.",
  "interactableModals.timmyHome.message":
    "Oh, gee, je veux vraiment que vous exploriez ma maison, mais maman m'a dit de ne pas parler aux étrangers, peut-être que c'est pour le mieux.",
  "interactableModals.windmill.message":
    "Ah, mon moulin à vent est en réparation, je ne peux pas laisser qui que ce soit fouiller pendant que je le répare, revenez plus tard.",
  "interactableModals.igorHome.message":
    "Dégagez ! Je n'ai pas envie de visiteurs, surtout pas des curieux comme vous!",
  "interactableModals.potionHouse.message1":
    "Faites attention, ami, le savant fou vit ici!",
  "interactableModals.potionHouse.message2":
    "On raconte qu'ils cherchent des apprentis Bumpkin pour cultiver des cultures mutantes avec eux.",
  "interactableModals.guildHouse.message":
    "Attendez un instant, Bumpkin ! Vous avez besoin d'un Bud si vous voulez entrer dans la Maison de la Guilde.",
  "interactableModals.guildHouse.budsCollection":
    "Collection de Buds sur Opensea",
  "interactableModals.bettyHome.message":
    "Oh, chéri, autant j'aime mes cultures, ma maison est un espace privé, pas ouverte aux visiteurs en ce moment.",
  "interactableModals.bertHome.message":
    "Intrus ! Ils doivent être après ma collection d'objets rares et de secrets, je ne peux pas les laisser entrer!",
  "interactableModals.beach.message1": "Êtes-vous allé à la plage?",
  "interactableModals.beach.message2":
    "On dit qu'elle est remplie de trésors luxueux ! Malheureusement, elle est en construction.",
  "interactableModals.castle.message":
    "Attends là, paysan ! Il est hors de question que je te laisse visiter le château.",
  "interactableModals.woodlands.message":
    "Vous voyagez vers les bois ? Assurez-vous de ramasser des champignons délicieux!",
  "interactableModals.port.message":
    "Attends là ! Les gobelins sont toujours en train de construire le port. Il sera prêt pour les voyages et la pêche bientôt.",
};

const introPage: Record<IntroPage, string> = {
  "introPage.welcome":
    "Bienvenue dans la Salle des Potions, mon apprenti curieux!",
  "introPage.description":
    "Je suis Mad Scientist Bumpkin, ici pour vous aider dans cette quête magique dans le monde de la sorcellerie botanique. Préparez-vous à découvrir les secrets de Sunflower Land ! Chaque tentative coûtera 1 SFL.",
  "introPage.mission":
    "Votre mission : déchiffrer la bonne combinaison de potions dans la grille enchantée.",
  "introPage.tip":
    "N'oubliez pas, plus vous sélectionnez de potions correctes, plus la plante sera heureuse, augmentant ainsi vos chances de drops rares!",
  "introPage.chaosPotion":
    "Attention à la potion 'chaos', elle bouleverse les choses!",
  "introPage.playButton": "Commençons le jeu",
};

const islandName: Record<IslandName, string> = {
  "island.home": "Accueil",
  "island.pumpkin.plaza": "Bumpkin Plaza",
  "island.beach": "Plage",
  "island.kingdom": ENGLISH_TERMS["island.kingdom"],
  "island.woodlands": "Wood",
  "island.helios": "Helios",
  "island.goblin.retreat": "Retraite des Gobelins",
};

const islandNotFound: Record<IslandNotFound, string> = {
  "islandNotFound.message": "Vous avez atterri au milieu de nulle part!",
  "islandNotFound.takeMeHome": "Ramène-moi à la maison",
};

const islandupgrade: Record<Islandupgrade, string> = {
  "islandupgrade.confirmUpgrade":
    "Êtes-vous sûr de vouloir passer à une nouvelle île?",
  "islandupgrade.warning": ENGLISH_TERMS["islandupgrade.warning"],
  "islandupgrade.upgradeIsland": "Améliorer l'île",
  "islandupgrade.newOpportunities":
    "Une île exotique vous attend avec de nouvelles ressources et des opportunités pour développer votre ferme.",
  "islandupgrade.confirmation":
    "Souhaitez-vous procéder à la mise à niveau ? Vos ressources seront transférées en toute sécurité sur votre nouvelle île.",
  "islandupgrade.locked": "Verrouillé",
  "islandupgrade.exploring": "Exploration en cours",
  "islandupgrade.welcomePetalParadise": "Bienvenue à Petal Paradise!",
  "islandupgrade.welcomeDesertIsland":
    ENGLISH_TERMS["islandupgrade.welcomeDesertIsland"],
  "islandupgrade.itemsReturned":
    "Vos objets ont été renvoyés en toute sécurité dans votre inventaire.",
  "islandupgrade.notReadyExpandMore":
    "You are not ready. Expand {{remainingExpansions}} more times",
  "islandupgrade.exoticResourcesDescription":
    "Cette partie de Sunflower Land est connue pour ses ressources exotiques. Étendez votre île pour découvrir des fruits, des fleurs, des ruches d'abeilles et des minéraux rares!",
  "islandupgrade.desertResourcesDescription":
    ENGLISH_TERMS["islandupgrade.desertResourcesDescription"],
  "islandupgrade.requiredIsland": ENGLISH_TERMS["islandupgrade.requiredIsland"],
  "islandupgrade.otherIsland": ENGLISH_TERMS["islandupgrade.otherIsland"],
};

const landscapeTerms: Record<LandscapeTerms, string> = {
  "landscape.intro.one": "Concevez votre île de rêve!",
  "landscape.intro.two":
    "En mode de conception, vous pouvez saisir, faire glisser et déplacer des objets.",
  "landscape.intro.three": "Fabriquez des décorations rares",
  "landscape.intro.four": "Placez des objets de collection de votre coffre",
  "landscape.expansion.one":
    "Chaque morceau d'île est livré avec des ressources uniques pour vous aider à construire votre empire agricole!",
  "landscape.expansion.two": "Plus d'expansions seront bientôt disponibles...",
  "landscape.timerPopover": "Prochaine expansion",
  "landscape.dragMe": "Glisser moi",
  "landscape.expansion.date":
    "Plus d'extensions seront disponibles le 7 février.",
  "landscape.great.work": "Excellent travail, Bumpkin!",
};

const letsGo: Record<LetsGo, string> = {
  "letsGo.title": "C'est le moment de jouer!",
  "letsGo.description":
    "Merci d'avoir participé à la version bêta ! Nous travaillons toujours sur le jeu et nous vous sommes reconnaissants de votre soutien pendant les premières étapes!",
  "letsGo.readMore": "Vous pouvez en savoir plus sur le jeu dans la ",
  "letsGo.officialDocs": "documentation officielle",
};

const levelUpMessages: Record<LevelUpMessages, string> = {
  "levelUp.2":
    "Youpi, vous avez atteint le niveau 2 ! Les cultures tremblent dans leurs bottes.",
  "levelUp.3":
    "Félicitations pour le niveau 3 ! Vous grandissez comme une mauvaise herbe...",
  "levelUp.4":
    "Félicitations pour le niveau 4 ! Vous avez officiellement dépassé votre pouce vert.",
  "levelUp.5":
    "Niveau 5 et toujours en vie ! Votre dur labeur porte ses fruits... ou devrions-nous dire 'labeur à la ferme'?",
  "levelUp.6":
    "Waouh, déjà niveau 6 ? Vous devez être fort comme un bœuf. Ou du moins, votre charrue l'est.",
  "levelUp.7":
    "Félicitations pour avoir atteint le niveau 7 ! Votre ferme est incroyable.",
  "levelUp.8": "Niveau 8, super boulot ! Vous semez les graines du succès.",
  "levelUp.9":
    "Niner niner, niveau 9er ! Votre récolte pousse aussi vite que vos compétences.",
  "levelUp.10":
    "Niveau 10, chiffres doubles ! Votre ferme a tellement fière allure que même les poules sont impressionnées.",
  "levelUp.11": "Niveau 11, vous faites pleuvoir (de l'eau, bien sûr)!",
  "levelUp.12":
    "Félicitations pour le niveau 12 ! Votre ferme commence vraiment à cultiver du caractère.",
  "levelUp.13":
    "Niveau chanceux 13 ! Vous commencez vraiment à prendre le coup de la vie à la ferme.",
  "levelUp.14": "Niveau 14, c'est incroyable à quel point vous avez progressé!",
  "levelUp.15":
    "Quinze ans et en pleine croissance ! Votre ferme a meilleure allure que jamais.",
  "levelUp.16":
    "Félicitations pour le niveau 16 ! Vos compétences en agriculture prennent vraiment racine.",
  "levelUp.17":
    "Niveau 17, vous récoltez ce que vous avez semé (et ça a l'air bien !).",
  "levelUp.18": "Dix-huit ans et bourgeonnant de potentiel!",
  "levelUp.19":
    "Félicitations pour le niveau 19 ! Votre ferme pousse aussi vite que vos compétences.",
  "levelUp.20": "Niveau 20, vous êtes la crème de la récolte!",
  "levelUp.21": "Vingt et un ans et vous récoltez comme un pro!",
  "levelUp.22":
    "Félicitations pour le niveau 22 ! Votre ferme prospère à plein régime.",
  "levelUp.23": "Niveau 23, vos compétences commencent vraiment à éclore!",
  "levelUp.24": "Vous êtes vraiment en pleine floraison au niveau 24!",
  "levelUp.25":
    "Quart de siècle ! Vous faites du foin pendant que le soleil brille.",
  "levelUp.26":
    "Félicitations pour le niveau 26 ! Vous êtes vraiment en train de traire cette vie à la ferme.",
  "levelUp.27":
    "Niveau 27, vous commencez vraiment à vous démarquer dans le domaine!",
  "levelUp.28": "Vous relevez vraiment la barre au niveau 28!",
  "levelUp.29":
    "Félicitations pour le niveau 29 ! Vous cultivez vraiment des compétences sérieuses.",
  "levelUp.30": "Niveau 30, vous êtes un vrai fermier maintenant!",
  "levelUp.31": "Trente et un ans et toujours en pleine croissance!",
  "levelUp.32":
    "Félicitations pour le niveau 32 ! Votre ferme est en pleine floraison.",
  "levelUp.33": "Niveau 33, vos compétences en agriculture décollent vraiment!",
  "levelUp.34": "Vous êtes vraiment en train de pousser au niveau 34!",
  "levelUp.35": "Niveau 35, vous êtes le camion-remorque de l'agriculture!",
  "levelUp.36":
    "Félicitations pour le niveau 36 ! Votre ferme commence vraiment à récolter du succès.",
  "levelUp.37":
    "Niveau 37, vos compétences commencent vraiment à se manifester!",
  "levelUp.38": "Vous plantez vraiment les graines du succès au niveau 38!",
  "levelUp.39":
    "Félicitations pour le niveau 39 ! Votre ferme commence vraiment à mûrir.",
  "levelUp.40": "Niveau 40, vous êtes un héros de la récolte!",
  "levelUp.41": "Quarante et un ans et toujours en pleine croissance!",
  "levelUp.42":
    "Félicitations pour le niveau 42 ! Votre ferme commence à récolter les récompenses.",
  "levelUp.43": "Niveau 43, vous cultivez vraiment des compétences sérieuses.",
  "levelUp.44": "Vous récoltez vraiment le succès au niveau 44!",
  "levelUp.45": "Niveau 45, vous êtes un vrai maître de la récolte!",
  "levelUp.46":
    "Félicitations pour le niveau 46 ! Vos compétences en agriculture commencent vraiment à porter leurs fruits.",
  "levelUp.47":
    "Niveau 47, vous devenez vraiment une légende de l'agriculture.",
  "levelUp.48": "Vous prospérez vraiment au niveau 48!",
  "levelUp.49":
    "Félicitations pour le niveau 49 ! Vous commencez vraiment à récolter les fruits de votre dur labeur.",
  "levelUp.50":
    "À mi-chemin vers 100 ! Vous êtes maintenant un vrai professionnel de l'agriculture.",
  "levelUp.51": "Cinquante et un ans et toujours vaillant!",
  "levelUp.52":
    "Félicitations pour le niveau 52 ! Votre ferme est une véritable œuvre d'art.",
  "levelUp.53": "Niveau 53, vos compétences commencent vraiment à s'enraciner.",
  "levelUp.54": "Vous récoltez vraiment le bonheur au niveau 54!",
  "levelUp.55": "Niveau 55, vous êtes une véritable force de l'agriculture.",
  "levelUp.56":
    "Félicitations pour le niveau 56 ! Votre ferme commence vraiment à fleurir.",
  "levelUp.57":
    "Niveau 57, vous commencez vraiment à cultiver des compétences sérieuses.",
  "levelUp.58": "Vous semez vraiment les graines du succès au niveau 58!",
  "levelUp.59":
    "Félicitations pour le niveau 59 ! Votre ferme est la crème de la récolte.",
  "levelUp.60":
    "Niveau 60, vous êtes une véritable superstar de l'agriculture!",
};

const loser: Record<Loser, string> = {
  "loser.unsuccess": "Vous n'avez pas réussi",
  "loser.longer": "L'enchère n'existe plus",
  "loser.refund.one": "Remboursement",
};

const lostSunflorian: Record<LostSunflorian, string> = {
  "lostSunflorian.line1": "Mon père m'a envoyé ici pour régner sur Helios.",
  "lostSunflorian.line2":
    "Malheureusement, ces Bumpkins n'aiment pas que je les observe.",
  "lostSunflorian.line3": "J'ai hâte de retourner à Sunfloria.",
};

const megaStore: Record<MegaStore, string> = {
  "megaStore.message":
    "Bienvenue dans le Mega Store ! Découvrez les articles limités du mois. Si vous aimez quelque chose, assurez-vous de le prendre avant qu'il ne disparaisse dans les méandres du temps.",
  "megaStore.month.sale": "Les soldes du mois en cours",
  "megaStore.wearable":
    "Super achat ! Votre nouveau vêtement est en sécurité dans votre garde-robe. Vous pouvez l'équiper sur un Bumpkin à partir de là.",
  "megaStore.collectible":
    "Super achat ! Votre nouveau collectible est en sécurité dans votre inventaire.",
  "megaStore.timeRemaining": "{{timeRemaining}} restant(s) !",
};

const milestoneMessages: Record<MilestoneMessages, string> = {
  "milestone.noviceAngler":
    "Félicitations, vous venez d'atteindre le jalon du Pêcheur Novice ! Vous êtes bien parti pour devenir un pro de la pêche en attrapant chaque poisson de base.",
  "milestone.advancedAngler":
    "Impressionnant, vous venez d'atteindre le jalon du Pêcheur Avancé ! Vous avez maîtrisé l'art de la capture de chaque poisson avancé. Continuez comme ça!",
  "milestone.expertAngler":
    "Wow, vous venez d'atteindre le jalon du Pêcheur Expert ! Vous êtes maintenant un vrai expert de la pêche ! Attraper 300 poissons n'est pas une petite réalisation.",
  "milestone.fishEncyclopedia":
    "Félicitations, vous venez d'atteindre le jalon de l'Encyclopédie des Poissons ! Vous êtes devenu un vrai connaisseur de poissons ! Découvrir chaque poisson de base, avancé et expert est une réalisation remarquable.",
  "milestone.masterAngler":
    "Wow, vous venez d'atteindre le jalon du Maître Pêcheur ! Attraper 1500 poissons est un témoignage de vos compétences en matière de pêche.",
  "milestone.marineMarvelMaster":
    "Félicitations, vous venez d'atteindre le jalon du Maître de la Merveille Marine ! Vous êtes le champion incontesté des mers ! Attraper chaque Marvel prouve vos compétences en matière de pêche comme aucun autre.",
  "milestone.deepSeaDiver":
    "Félicitations, vous venez d'atteindre le jalon du Plongeur en Eaux Profondes ! Vous avez obtenu le Casque des Profondeurs - une Couronne mystérieuse qui attire les Merveilles Marines à votre hameçon.",
  "milestone.sunpetalSavant":
    "Félicitations, vous venez d'atteindre le jalon du Savant des Sunpétales ! Vous avez découvert chaque variante de Sunpétale. Vous êtes un vrai expert en Sunpétale!",
  "milestone.bloomBigShot":
    "Félicitations, vous venez d'atteindre le jalon du Grand Tireur de Bloom ! Vous avez découvert chaque variante de Bloom. Vous êtes un vrai expert en Bloom!",
  "milestone.lilyLuminary":
    "Félicitations, vous venez d'atteindre le jalon du Luminaire du Lys ! Vous avez découvert chaque variante de Lys. Vous êtes un vrai expert en Lys!",
};

const modalDescription: Record<ModalDescription, string> = {
  "modalDescription.friend": "Salut l'ami!",
  "modalDescription.love.fruit":
    "Waouh, tu aimes vraiment les fruits autant que moi!",
  "modalDescription.gift":
    "Je n'ai plus de cadeaux pour toi. N'oublie pas de porter tes nouveaux objets!",
  "modalDescription.limited.abilities":
    "J'ai conçu des vêtements en édition limitée qui peuvent améliorer tes compétences de cueillette de fruits",
  "modalDescription.trail":
    "Je recherche des cueilleurs de fruits dévoués pour tester ces vêtements... GRATUITEMENT!",
};

const nftminting: Record<NFTMinting, string> = {
  "nftminting.mintAccountNFT": "Création de votre NFT de compte",
  "nftminting.mintingYourNFT":
    "Création de votre NFT et stockage de la progression sur la blockchain",
  "nftminting.almostThere": "Presque terminé",
};

const noaccount: Record<Noaccount, string> = {
  "noaccount.newFarmer": "Nouveau fermier",
  "noaccount.addPromoCode": "Ajouter un code promotionnel?",
  "noaccount.alreadyHaveNFTFarm": "Déjà en possession d'une ferme NFT?",
  "noaccount.createFarm": "Créer une ferme",
  "noaccount.noFarmNFTs": "Vous ne possédez aucune ferme NFT.",
  "noaccount.createNewFarm": "Créer une nouvelle ferme",
  "noaccount.selectNFTID": "Sélectionnez votre ID NFT",
  "noaccount.welcomeMessage":
    "Bienvenue dans Sunflower Land. Il semble que vous n'ayez pas encore de ferme.",
  "noaccount.promoCodeLabel": "Code promotionnel",
  "noaccount.haveFarm": ENGLISH_TERMS["noaccount.haveFarm"],
  "noaccount.letsGo": ENGLISH_TERMS["noaccount.letsGo"],
};

const noBumpkin: Record<NoBumpkin, string> = {
  "noBumpkin.readyToFarm":
    "Génial, votre Bumpkin est prêt à travailler à la ferme!",
  "noBumpkin.play": "Jouer",
  "noBumpkin.missingBumpkin": "Vous n'avez pas votre Bumpkin",
  "noBumpkin.bumpkinNFT":
    "Un Bumpkin est un NFT (jeton non fongible) minté sur la Blockchain.",
  "noBumpkin.bumpkinHelp":
    "Vous avez besoin d'un Bumpkin pour vous aider à planter, récolter, couper, miner et étendre votre terrain.",
  "noBumpkin.mintBumpkin": "Vous pouvez obtenir un Bumpkin sur OpenSea:",
  "noBumpkin.allBumpkins": "Regardez tous ces Bumpkins!",
  "noBumpkin.chooseBumpkin": "Quel Bumpkin souhaitez-vous utiliser pour jouer?",
  "noBumpkin.deposit": "Déposer",
  "noBumpkin.advancedIsland":
    "Ceci est une île avancée. Un Bumpkin fort est requis:",
  "dequipper.noBumpkins": "Pas de Bumpkins",
  "dequipper.missingBumpkins":
    "Vous n’avez aucun NFT Bumpkin dans votre portefeuille.",
  "dequipper.intro":
    "Envoyez les vêtements d'un Bumpkin dans votre portefeuille.",
  "dequipper.success":
    "Félicitations, les wearables ont été envoyés dans votre portefeuille. Déposez-les dans votre ferme pour les utiliser.",
  "dequipper.dequip": "Équiper",
  "dequipper.warning":
    "Une fois qu'un Bumpkin est déséquipé, il ne peut plus être utilisé.",
  "dequipper.nude": "Bumpkin est déjà déséquipé",
  "noBumpkin.nude": "Impossible d'équiper un Bumpkin vide",
};

const notOnDiscordServer: Record<NotOnDiscordServer, string> = {
  "notOnDiscordServer.intro":
    "Il semblerait que vous n'ayez pas encore rejoint le serveur Discord de Sunflower Land.",
  "notOnDiscordServer.joinDiscord": "Rejoignez notre ",
  "notOnDiscordServer.discordServer": "serveur Discord",
  "notOnDiscordServer.completeVerification":
    "2. Effectuez la vérification & commencez",
  "notOnDiscordServer.acceptRules": "3. Acceptez les règles dans #rules",
};

const noTownCenter: Record<NoTownCenter, string> = {
  "noTownCenter.reward": "Récompense : 1 x Centre-ville!",
  "noTownCenter.news": "Vos dernières nouvelles ou déclarations ici.",
  "noTownCenter.townCenterPlacement":
    "Vous pouvez placer le Centre-ville dans l'inventaire > section des bâtiments",
};

const npc_message: Record<NPC_MESSAGE, string> = {
  // Betty
  "npcMessages.betty.msg1":
    "Oh la la, je suis impatiente de mettre la main sur des produits frais!",
  "npcMessages.betty.msg2":
    "Je suis tellement excitée de tester de nouvelles cultures, qu'est-ce que vous avez pour moi?",
  "npcMessages.betty.msg3":
    "J'attends toute la journée une chance de récolter des fruits délicieux!",
  "npcMessages.betty.msg4":
    "J'ai hâte de voir quels types de cultures sont prêts à être récoltés aujourd'hui.",
  "npcMessages.betty.msg5":
    "Je suis impatiente de goûter les fruits de mon travail, quels types de produits avez-vous?",
  "npcMessages.betty.msg6":
    "J'ai une véritable passion pour l'agriculture, et je suis toujours à la recherche de cultures nouvelles et intéressantes à cultiver.",
  "npcMessages.betty.msg7":
    "Il n'y a rien de tel que le sentiment de récolter une récolte abondante, c'est ça, l'agriculture!",
  // Blacksmith
  "npcMessages.blacksmith.msg1":
    "J'ai besoin de fournitures pour ma dernière invention, avez-vous des matériaux?",
  "npcMessages.blacksmith.msg2":
    "Je cherche à faire le plein de matières premières, en avez-vous à vendre?",
  "npcMessages.blacksmith.msg3":
    "J'ai besoin de matériaux de fabrication, avez-vous quelque chose que je puisse utiliser?",
  "npcMessages.blacksmith.msg4":
    "Avez-vous des ressources rares ou uniques que je pourrais utiliser?",
  "npcMessages.blacksmith.msg5":
    "Je suis intéressé à acquérir des matériaux de haute qualité, qu'avez-vous?",
  "npcMessages.blacksmith.msg6":
    "Je recherche des matériaux pour mon prochain projet, avez-vous quelque chose à offrir?",
  "npcMessages.blacksmith.msg7":
    "Je suis sur le marché pour des matières premières, en avez-vous à vendre?",
  // Pumpkin' pete
  "npcMessages.pumpkinpete.msg1":
    "Salut, petit nouveau ! Que dirais-tu de produits frais?",
  "npcMessages.pumpkinpete.msg2":
    "Cultures savoureuses, quelqu'un ? Je suis votre homme pour des récoltes faciles!",
  "npcMessages.pumpkinpete.msg3":
    "Frais et délicieux, c'est ma devise. Qu'avez-vous?",
  "npcMessages.pumpkinpete.msg4":
    "Nouveau venu en ville ? Égayons votre journée avec quelques cultures!",
  "npcMessages.pumpkinpete.msg5":
    "Besoin d'un coup de main, mon ami ? J'ai une variété de cultures pour vous!",
  "npcMessages.pumpkinpete.msg6":
    "Pete énergique, à votre service ! Des cultures, quelqu'un?",
  "npcMessages.pumpkinpete.msg7":
    "Bienvenue sur la place ! Égayons votre journée avec des cultures!",
  // Cornwell
  "npcMessages.cornwell.msg1":
    "Ah, le bon vieux temps... Le travail dur, c'est ma devise. Qu'avez-vous?",
  "npcMessages.cornwell.msg2":
    "Ces jeunes, pas d'éthique de travail ! Apportez-moi les choses difficiles.",
  "npcMessages.cornwell.msg3":
    "Je me souviens quand... Le travail dur, voilà ce qui manque!",
  "npcMessages.cornwell.msg4":
    "La connaissance acquise grâce au dur labeur mérite la meilleure récolte. Impressionnez-moi!",
  "npcMessages.cornwell.msg5":
    "L'histoire et le travail acharné, c'est ce qui nous caractérise tous. Quel est votre choix?",
  "npcMessages.cornwell.msg6":
    "Cornwell, c'est mon nom, et je suis ici pour une véritable expérience agricole.",
  "npcMessages.cornwell.msg7":
    "Des tâches difficiles, des récompenses riches. Montrez-moi ce que vous avez!",
  // Raven
  "npcMessages.raven.msg1":
    "Obscurité et mystère, c'est mon jeu. Je prends les cultures les plus difficiles.",
  "npcMessages.raven.msg2":
    "Gothique dans l'âme, j'ai besoin des cultures les plus sombres pour mes potions.",
  "npcMessages.raven.msg3":
    "Surnaturel et sinistre, voilà l'ambiance que je recherche. Impressionnez-moi.",
  "npcMessages.raven.msg4":
    "Je convoite la récolte ombragée pour mes sorts. Remettez-les.",
  "npcMessages.raven.msg5":
    "Apportez-moi les cultures qui se cachent dans l'ombre. Je ne serai pas déçu.",
  "npcMessages.raven.msg6":
    "Raven, le gardien de l'obscurité, veut vos cultures les plus difficiles.",
  "npcMessages.raven.msg7":
    "Délices sombres pour un cœur gothique. Montrez-moi votre récolte la plus sombre.",
  // Bert
  "npcMessages.bert.msg1":
    "Les champis, mec... c'est la clé. T'as des champignons magiques?",
  "npcMessages.bert.msg2":
    "La folie des champignons, c'est moi. Des champis magiques, quelqu'un?",
  "npcMessages.bert.msg3":
    "C'est tout au sujet des champignons, bébé. Donne-moi les enchantés.",
  "npcMessages.bert.msg4":
    "Tu sais, je vois des trucs. Des champignons magiques, c'est ce qu'il me faut.",
  "npcMessages.bert.msg5":
    "La vie, c'est un voyage, mec, et j'ai besoin de ces champignons magiques pour le faire!",
  "npcMessages.bert.msg6":
    "Je m'appelle Bert, les champis, c'est mon truc. Les enchantés, s'il te plaît!",
  "npcMessages.bert.msg7":
    "Les champignons magiques, mon pote. C'est ce qui me fait avancer.",
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
    "De l'or, de l'or, et encore de l'or ! Montrez-moi les richesses, paysans!",
  "npcMessages.tywin.msg2":
    "Je veille sur les Bumpkins pour m'assurer qu'ils paient leurs dettes. De l'or, maintenant!",
  "npcMessages.tywin.msg3":
    "Paysans, apportez-moi vos richesses ! Je suis Tywin, le prince exigeant!",
  "npcMessages.tywin.msg4":
    "Pumpkin Plaza est en-dessous de moi, mais l'or n'est jamais suffisant. Encore!",
  "npcMessages.tywin.msg5":
    "C'est la vie d'un prince, et j'exige votre richesse. Payez vos impôts!",
  "npcMessages.tywin.msg6":
    "La richesse d'un prince ne connaît pas de limites. De l'or, de l'or, et encore de l'or!",
  "npcMessages.tywin.msg7":
    "L'or est ma couronne, et je veux tout ! Apportez-moi vos richesses!",
  // Tango
  "npcMessages.tango.msg1":
    "Bavarder, grignoter, et bavarder encore ! Des fruits, des fruits, et encore des fruits!",
  "npcMessages.tango.msg2":
    "Je suis Tango, le petit singe espiègle aux fruits ! Apportez-moi des trésors fruités!",
  "npcMessages.tango.msg3":
    "Orange, espiègle et joueur, c'est moi. Des fruits, quelqu'un?",
  "npcMessages.tango.msg4":
    "Des secrets de fruits ? Je les ai ! Partagez les merveilles fruitées avec moi!",
  "npcMessages.tango.msg5":
    "Des farces fruitées et des délices fruités. Amusons-nous!",
  "npcMessages.tango.msg6":
    "Tango, c'est mon nom, les jeux fruités sont ma renommée. Donnez-moi!",
  "npcMessages.tango.msg7":
    "La connaissance des fruits est dans ma famille. Racontez-moi vos histoires les plus fruitées!",
  // Miranda
  "npcMessages.miranda.msg1":
    "Dansez avec moi, ami ! Ajoutez quelque chose à mon chapeau rempli de fruits, je vous prie.",
  "npcMessages.miranda.msg2":
    "La samba et les fruits vont de pair. Qu'avez-vous à offrir?",
  "npcMessages.miranda.msg3":
    "Dans le rythme de la samba, les fruits sont incontournables. Acceptez-vous de partager?",
  "npcMessages.miranda.msg4":
    "Tout tourne autour du rythme de la samba et des délices fruités. Apportez-en quelques-uns!",
  "npcMessages.miranda.msg5":
    "Rejoignez la célébration de la samba en offrant un cadeau fruité à mon chapeau!",
  "npcMessages.miranda.msg6":
    "Le chapeau de Miranda raffole des ornements fruités. Que pouvez-vous y contribuer?",
  "npcMessages.miranda.msg7": "Samba, fruits et amitié. Faisons-en une fête!",
  // Finn
  "npcMessages.finn.msg1":
    "J'ai attrapé la plus grosse prise de ma vie ! Du poisson, quelqu'un?",
  "npcMessages.finn.msg2":
    "La vie d'un pêcheur, c'est une histoire à raconter. J'ai attrapé quelques poissons!",
  "npcMessages.finn.msg3":
    "Finn le pêcheur, la légende et le chuchoteur de poissons. J'ai attrapé quelques poissons?",
  "npcMessages.finn.msg4":
    "Des gros poissons, des grandes histoires, et un gros ego. Apportez-moi vos trésors poissons!",
  "npcMessages.finn.msg5":
    "Hameçon, ligne, et allure, c'est moi. Les poissons, c'est ma spécialité!",
  "npcMessages.finn.msg6":
    "Récits de pêche, droits de vantardise, et une touche de modestie. Du poisson, s'il vous plaît!",
  "npcMessages.finn.msg7":
    "Saviez-vous que les poissons-chirurgiens raffolent de l'alléchante saveur des oranges?",
  "npcMessages.finn.msg8":
    "J'ai attrapé le plus gros poisson jamais vu. Ce n'est pas qu'une histoire, c'est la réalité!",
  // Findley
  "npcMessages.findley.msg1":
    "Pas question de laisser Finn avoir toute la gloire ! J'ai besoin d'appât et d'appât pour ma grosse prise!",
  "npcMessages.findley.msg2":
    "Finn n'est pas le seul à savoir pêcher. J'ai besoin d'appât et d'appât, tout de suite!",
  "npcMessages.findley.msg3":
    "Je vais montrer à Finn qui est le vrai pêcheur ! J'ai besoin d'appât et d'appât, je dois les avoir!",
  "npcMessages.findley.msg4":
    "Vous cherchez à attraper un Thon ? Ils ont une affection particulière pour le croquant alléchant du Cauliflower.",
  "npcMessages.findley.msg5":
    "La rivalité des pêcheurs est dans la famille. Je suis là pour prouver un point. Appât et appât, s'il vous plaît!",
  "npcMessages.findley.msg6":
    "Finn n'est pas le seul avec des compétences en pêche. Je vais chercher la prise d'une vie!",
  "npcMessages.findley.msg7":
    "Concourir avec Finn est incontournable. Appât et appât, j'ai besoin de votre aide!",
  "npcMessages.findley.msg8":
    "Des frères et sœurs dans un duel de pêche. Appât et appât sont mes armes secrètes!",
  "npcMessages.findley.msg9":
    "Saviez-vous que le Mahi Mahi ne peut pas résister au croquant sucré du Corn?",
  // Corale
  "npcMessages.corale.msg1":
    "L'océan appelle, et j'ai besoin de poissons. Aidez-moi à libérer mes amis!",
  "npcMessages.corale.msg2":
    "Les poissons sont mes amis, et je dois les libérer. M'aiderez-vous?",
  "npcMessages.corale.msg3":
    "Pour l'amour de la mer, apportez-moi des poissons. Je les relâcherai chez eux.",
  "npcMessages.corale.msg4":
    "Sous les vagues, mes amis attendent. Des poissons, pour qu'ils puissent nager librement!",
  "npcMessages.corale.msg5":
    "L'appel d'une sirène pour protéger ses amis. Apportez-moi des poissons, âme bienveillante.",
  "npcMessages.corale.msg6":
    "La liberté des poissons, c'est ma mission. Aidez-moi avec des poissons, je vous prie?",
  "npcMessages.corale.msg7":
    "Rejoignez-moi dans la danse de la vie de la mer. Des poissons, pour libérer mes amis!",
  // Shelly
  "npcMessages.shelly.msg1":
    "Les Bumpkins disparaissent, et je crains que le Kraken en soit la cause. Aidez-moi à collecter ses tentacules!",
  "npcMessages.shelly.msg2":
    "Les Bumpkins disparaissent, et je soupçonne le Kraken. Pouvez-vous récupérer ses tentacules, s'il vous plaît?",
  "npcMessages.shelly.msg3":
    "Le Kraken est une menace, les Bumpkins manquent. Apportez ses tentacules pour les protéger.",
  "npcMessages.shelly.msg4":
    "Le Kraken est sinistre, les Bumpkins ont disparu. Apportez ses tentacules pour leur sécurité.",
  "npcMessages.shelly.msg5":
    "Garder la plage est difficile avec le Kraken. Aidez-moi à protéger les Bumpkins, obtenez ses tentacules.",
  "npcMessages.shelly.msg6":
    "Protéger les Bumpkins est mon devoir, mais le Kraken m'inquiète. Obtenez ses tentacules pour les sauvegarder.",
  "npcMessages.shelly.msg7":
    "Le Kraken provoque la panique, les Bumpkins disparaissent. Aidez-moi à rassembler ses tentacules pour leur sécurité.",
  "npcMessages.shelly.msg8":
    "La sécurité des Bumpkins est ma priorité absolue, et j'ai bien peur que le Kraken soit impliqué. Les tentacules peuvent faire la différence!",
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
    "Rassemblez-vous, Bumpkins, une vente aux enchères va bientôt commencer.",
  "npc.Modal.Marcus":
    "Hé ! Vous n'avez pas le droit d'entrer chez moi. Ne touchez surtout pas à mes affaires!",
  "npc.Modal.Billy": "Salut à tous ! Je m'appelle Billy.",
  "npc.Modal.Billy.one":
    "J'ai trouvé ces petites plantules, mais je n'arrive pas du tout à comprendre quoi en faire.",
  "npc.Modal.Billy.two":
    "Je parie qu'elles ont quelque chose à voir avec les bourgeons de vers qui apparaissent autour de la place.",
  "npc.Modal.Gabi": "Hé, Bumpkin!",
  "npc.Modal.Gabi.one":
    "Tu as l'air créatif, tu as déjà pensé à contribuer de l'art au jeu?",
  "npc.Modal.Craig": "Pourquoi tu me regardes bizarrement?",
  "npc.Modal.Craig.one": "Est-ce qu'il y a quelque chose entre mes dents...",
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
    "Que voulez-vous ? Parlez vite ; le temps, c'est de l'argent.",
  "npcDialogues.blacksmith.intro2":
    "Qu'est-ce qui vous amène dans mon atelier ? Je suis occupé, alors faites vite.",
  "npcDialogues.blacksmith.intro3":
    "Bienvenue dans ma modeste demeure. Qu'est-ce qui vous amène ici?",
  "npcDialogues.blacksmith.intro4":
    "Dites votre but. Je suis occupé, et je n'ai pas de temps pour les bavardages inutiles. Qu'est-ce qui vous amène dans mon atelier?",
  // Blacksmith Positive Delivery
  "npcDialogues.blacksmith.positiveDelivery1":
    "Enfin ! Vous avez apporté les matériaux dont j'ai besoin. Laissez-moi faire ma magie.",
  "npcDialogues.blacksmith.positiveDelivery2":
    "Ah, il était temps ! Vous avez acquis les articles exacts que je recherchais. Préparez-vous à recevoir des équipements fabriqués avec précision.",
  "npcDialogues.blacksmith.positiveDelivery3":
    "Bien. Vous avez livré les matériaux dont j'ai besoin. Je ne vous décevrai pas ; mes créations seront remarquables.",
  "npcDialogues.blacksmith.positiveDelivery4":
    "Impressionnant ! Vous avez obtenu les composants nécessaires. Je vais les transformer en merveilles de la ferme!",
  "npcDialogues.blacksmith.positiveDelivery5":
    "Hmm, vous avez en fait réussi à trouver ce que je voulais. Bien joué.",
  // Blacksmith Negative Delivery
  "npcDialogues.blacksmith.negativeDelivery1":
    "Vous n'avez pas ce dont j'ai besoin ? Le temps est gaspillé. Revenez quand vous aurez ce qui est nécessaire.",
  "npcDialogues.blacksmith.negativeDelivery2":
    "Non, non, non. Vous manquez des matériaux essentiels. Ne perdez pas mon temps. Revenez quand vous serez prêt.",
  "npcDialogues.blacksmith.negativeDelivery3":
    "Inacceptable. Vous ne possédez pas ce dont j'ai besoin. Je n'ai pas de temps pour l'incompétence. Revenez quand vous serez capable.",
  "npcDialogues.blacksmith.negativeDelivery4":
    "Insatisfaisant. Vous n'avez pas ce dont j'ai besoin. Revenez quand vous serez prêt à remplir votre part du marché.",
  "npcDialogues.blacksmith.negativeDelivery5":
    "Incompétence. Vous manquez des matériaux requis. Ne perdez pas mon temps ; revenez quand vous serez prêt.",
  // Blacksmith NoOrder
  "npcDialogues.blacksmith.noOrder1":
    "Aucune commande en cours pour moi à remplir pour le moment, mais si vous avez besoin d'outils ou si vous avez des matériaux pour la fabrication, je suis toujours là pour vous aider. Parlez-moi, et nous nous mettrons au travail.",
  "npcDialogues.blacksmith.noOrder2":
    "Aucune commande en cours de ma part, mais si vous avez besoin d'équipement robuste ou si vous avez des matériaux à façonner, je suis votre artisan.",
  // Betty Into
  "npcDialogues.betty.intro1":
    "Salut, rayon de soleil ! Ça a été une journée bien remplie au marché. Je suis là pour voir si vous avez les ingrédients que j'ai commandés. Les avez-vous avec vous?",
  "npcDialogues.betty.intro2":
    "Bonjour, bonjour ! J'attendais de voir si vous aviez les ingrédients que j'ai commandés. Les avez-vous apportés?",
  "npcDialogues.betty.intro3":
    "Bienvenue au marché de Betty ! Prêt à vérifier si vous avez les ingrédients dont j'ai besoin ? Montrez-moi ce que vous avez en magasin pour moi!",
  "npcDialogues.betty.intro4":
    "Hé, hé ! J'ai hâte de savoir si vous avez apporté les ingrédients que j'ai commandés. Montrez-moi ce que vous avez!",
  "npcDialogues.betty.intro5":
    "Salutations, mon ami au pouce vert ! Je suis impatient de voir si vous avez les ingrédients que j'ai demandés. Qu'avez-vous dans votre panier?",
  // Betty Positive Delivery
  "npcDialogues.betty.positiveDelivery1":
    "Hourra ! Vous avez apporté les ingrédients que j'ai commandés. Ils sont aussi frais et vibrants que possible. Merci, mon génie du jardinage!",
  "npcDialogues.betty.positiveDelivery2":
    "C'est de cela dont je parle ! Vous avez exactement les ingrédients dont j'avais besoin. Vous avez fait de ma journée avec votre livraison rapide. Merci!",
  "npcDialogues.betty.positiveDelivery3":
    "Oh, fantastique ! Ce sont les ingrédients exacts que j'ai demandés. Le marché sera animé d'excitation. Merci pour votre travail acharné!",
  "npcDialogues.betty.positiveDelivery4":
    "Oh, mon jardin ! Ces ingrédients sont absolument parfaits. Vous avez un talent pour trouver les meilleurs produits. Merci, mon héros au pouce vert!",
  "npcDialogues.betty.positiveDelivery5":
    "Bravo ! Vous avez apporté les ingrédients exacts dont j'avais besoin. J'ai hâte de les utiliser pour créer quelque chose d'extraordinaire. Merci pour votre livraison rapide!",
  // Betty Negative Delivery
  "npcDialogues.betty.negativeDelivery1":
    "Oupsie-daisy ! Il semble que vous n'ayez pas les ingrédients que j'ai commandés. Pas de soucis, cependant. Continuez à chercher, et nous trouverons une autre opportunité.",
  "npcDialogues.betty.negativeDelivery2":
    "Oh non ! Il semble que vous n'ayez pas les ingrédients dont j'ai besoin pour le moment. Ne vous inquiétez pas, cependant. Je crois en votre ingéniosité. Revenez quand vous aurez ce que je cherche!",
  "npcDialogues.betty.negativeDelivery3":
    "Oh, zut ! Il semble que vous n'ayez pas les ingrédients que je recherche pour le moment. Continuez à chercher ! Peut-être aurons-nous plus de chance la prochaine fois.",
  "npcDialogues.betty.negativeDelivery4":
    "Oh, dommage ! Il semble que les ingrédients que vous avez apportés ne correspondent pas à ce dont j'ai besoin. Mais ne perdez pas courage ; continuez à travailler et revenez bientôt.",
  "npcDialogues.betty.negativeDelivery5":
    "Oh, zut ! Il semble que vous n'ayez pas les ingrédients exacts que je recherche. Mais ne vous inquiétez pas, mon ami. Continuez à travailler dur, et nous célébrerons lorsque vous les trouverez!",
  // Betty NoOrder
  "npcDialogues.betty.noOrder1":
    "Pas de commande active à remplir pour le moment, mais cela ne m'empêchera pas de vous offrir les meilleures graines et cultures. Approchez-vous et voyons ce que vous recherchez!",
  "npcDialogues.betty.noOrder2":
    "Pas de commande spécifique de ma part aujourd'hui, mais ce n'est pas un problème. Je suis là avec un rebond dans ma démarche, prête à vous fournir les meilleures graines et à acheter vos cultures délicieuses!",
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
    "Ah, enfin ! Quelque chose de délicieux pour apaiser ma faim. Tu es un sauveur, mon ami!",
  "npcDialogues.grimbly.positiveDelivery2":
    "Tu as apporté de la nourriture ! La faim de Grimbly est apaisée. Merci, merci!",
  "npcDialogues.grimbly.positiveDelivery3":
    "Hourra ! Tu m'as apporté de la nourriture pour remplir mon ventre affamé. Grimbly apprécie ta générosité!",
  "npcDialogues.grimbly.positiveDelivery4":
    "Un festin pour Grimbly ! Tu m'as apporté exactement ce dont j'avais besoin. Ta gentillesse ne sera pas oubliée!",
  // Grimbly Negative Delivery
  "npcDialogues.grimbly.negativeDelivery1":
    "Pas de nourriture ? Grimbly a toujours faim. Trouve de la nourriture, apporte de la nourriture. Grimbly est reconnaissant.",
  "npcDialogues.grimbly.negativeDelivery2":
    "Pas de nourriture pour Grimbly ? L'estomac de Grimbly gronde. Reviens quand tu trouveras quelque chose de savoureux.",
  "npcDialogues.grimbly.negativeDelivery3":
    "Grimbly a toujours faim. Pas de nourriture ? Continue à chercher, et peut-être que la prochaine fois tu satisferas l'appétit du gobelin.",
  "npcDialogues.grimbly.negativeDelivery4":
    "Les mains vides ? L'estomac de Grimbly gronde. Continue à chercher, et n'oublie pas la faim d'un gobelin!",
  // Grimbly NoOrder
  "npcDialogues.grimbly.noOrder1":
    "Grimbly n'a pas de commande active pour vous en ce moment, mais cela ne signifie pas que je n'ai pas faim!",
  "npcDialogues.grimbly.noOrder2":
    "Pas de commande active de Grimbly aujourd'hui, mais ne craignez rien ! Je suis toujours à la recherche de friandises délicieuses. Si vous trouvez quelque chose de délicieux, vous savez à qui l'apporter!",
  // Grimtootk Intro
  "npcDialogues.grimtooth.intro1":
    "Salutations, voyageur épuisé. Vous me cherchez, n'est-ce pas?",
  "npcDialogues.grimtooth.intro2":
    "Entrez dans le royaume des ombres. Avez-vous accompli ma commande?",
  "npcDialogues.grimtooth.intro3":
    "Bienvenue, voyageur, dans mon royaume mystique. Avez-vous ce dont j'ai besoin?",
  "npcDialogues.grimtooth.intro4":
    "Entrez, cher voyageur, et découvrez les secrets que j'ai accumulés. Avez-vous trouvé ce que je demandais?",
  // Grimtooth Positive Delivery
  "npcDialogues.grimtooth.positiveDelivery1":
    "Incroyable ! Vous avez trouvé les ingrédients dont j'ai besoin. La magie de Sunflorea est à portée de main!",
  "npcDialogues.grimtooth.positiveDelivery2":
    "Merveilleux ! Vous avez acquis ce que je cherchais. Ensemble, nous plongerons dans les profondeurs les plus sombres de la magie!",
  "npcDialogues.grimtooth.positiveDelivery3":
    "Incroyable ! Vous avez rassemblé les composants mystiques dont j'avais besoin. Votre voyage dans le royaume de la magie commence!",
  "npcDialogues.grimtooth.positiveDelivery4":
    "Ah, splendide ! Vous avez obtenu les ingrédients insaisissables que je recherchais. Votre voyage dans le royaume de la magie commence!",
  // Grimtooth Negative Delivery
  "npcDialogues.grimtooth.negativeDelivery1":
    "Hélas, les ingrédients nécessaires vous échappent. Ne craignez rien, cependant. Continuez à chercher, et les mystères se révéleront!",
  "npcDialogues.grimtooth.negativeDelivery2":
    "Oh, ténèbres et désespoir. Vous ne possédez pas ce dont j'ai besoin. Mais ne vous inquiétez pas ; continuez à travailler, et les ombres continueront de vous guider.",
  "npcDialogues.grimtooth.negativeDelivery3":
    "N'ayez crainte, cependant. Poursuivez votre travail, et la magie se manifestera.",
  "npcDialogues.grimtooth.negativeDelivery4":
    "Oh, hélas. Vous ne possédez pas ce dont j'ai besoin. Revenez quand vous l'aurez.",
  // Grimtooth NoOrder
  "npcDialogues.grimtooth.noOrder1":
    "Pas de commande active de GrimTooth pour le moment, mais ne vous inquiétez pas. Si vous avez besoin d'une artisanat exquis ou si vous avez des matériaux à transformer, je serai là, prêt à créer.",
  "npcDialogues.grimtooth.noOrder2":
    "Pas de commande active à remplir pour vous avec GrimTooth, mais si vous avez besoin de la touche du maître artisan ou si vous avez des matériaux à transformer, je suis à votre service.",
  // Old Salty Intro
  "npcDialogues.oldSalty.intro1":
    "Arghhhh, bienvenue, mon ami ! Je suis Vieux Salty, et les trésors sont ma passion. As-tu ce que je recherche?",
  "npcDialogues.oldSalty.intro2":
    "Ahoy, moussaillon ! Vieux Salty est l'amoureux des trésors que tu cherches. Montre-moi ce que tu as trouvé dans ta quête!",
  "npcDialogues.oldSalty.intro3": "",
  // Old Salty Positive Delivery
  "npcDialogues.oldSalty.positiveDelivery1":
    "Arghhhh, tu as trouvé le trésor que je recherchais. Tu as l'âme d'un véritable aventurier, mon ami!",
  "npcDialogues.oldSalty.positiveDelivery2":
    "Avast ! Tu as apporté le trésor même qu'Old Salty désire. Tu gagnes mon respect, mon ami!",
  "npcDialogues.oldSalty.positiveDelivery3":
    "Ahoy, tu as trouvé le trésor que Vieux Salty cherchait depuis longtemps. Tu es une vraie légende en ces eaux, mon ami!",
  // Old Salty Negative Delivery
  "npcDialogues.oldSalty.negativeDelivery1":
    "Arrrr, pas de trésor pour Vieux Salty ? Garde les yeux ouverts, mon ami. Les gemmes cachées t'attendent!",
  "npcDialogues.oldSalty.negativeDelivery2":
    "Ah, maraud ! Pas de trésor pour Vieux Salty ? Continue de chercher, et tu trouveras les richesses que tu recherches!",
  "npcDialogues.oldSalty.negativeDelivery3":
    "Que le tonnerre gronde ! Pas de trésor pour Vieux Salty ? Continue de voguer, mon ami. Le butin est là-bas, qui t'attend!",
  // Old Salty NoOrder
  "npcDialogues.oldSalty.noOrder1":
    "Pas de commande active pour le trésor de Vieux Salty pour le moment, mon ami, mais cela ne signifie pas qu'il n'y a pas d'aventure à vivre. Garde les yeux ouverts pour les trésors cachés et les eaux inexplorées!",
  "npcDialogues.oldSalty.noOrder2":
    "Pas de trésor spécifique à chercher avec Vieux Salty pour le moment, mais ne t'inquiète pas, mon vaillant marin ! Les hautes mers regorgent de richesses en attente d'être découvertes.",
  // Raven Intro
  "npcDialogues.raven.intro1":
    "Bienvenue dans ma modeste demeure. Fais attention où tu mets les pieds ; des potions sont en train de mijoter. As-tu obtenu ce que je t'ai demandé?",
  "npcDialogues.raven.intro2":
    "Pénètre dans le royaume des ombres. Cherche la sagesse, trouve l'enchantement. As-tu ce dont j'ai besoin?",
  "npcDialogues.raven.intro3":
    "Bienvenue, voyageur, dans mon royaume mystique. Cherches-tu quelque chose de magique, ou as-tu ce dont j'ai besoin?",
  "npcDialogues.raven.intro4":
    "Entre, cher voyageur. Les ombres te guideront. As-tu trouvé ce que je cherche?",
  // Raven Positive Delivery
  "npcDialogues.raven.positiveDelivery1":
    "Incroyable ! Tu as trouvé les ingrédients dont j'ai besoin. La magie de Sunflorea est à portée de main!",
  "npcDialogues.raven.positiveDelivery2":
    "Merveilleux ! Tu as acquis ce que je cherchais. Ensemble, nous plongerons dans les profondeurs les plus sombres de la magie!",
  "npcDialogues.raven.positiveDelivery3":
    "Incroyable ! Tu as rassemblé les composants mystiques dont j'avais besoin. Ton voyage dans le royaume de la magie commence!",
  "npcDialogues.raven.positiveDelivery4":
    "Ah, splendide ! Tu as obtenu les ingrédients insaisissables que je cherchais. Ton voyage dans le royaume de la magie commence!",
  // Raven Negative Delivery
  "npcDialogues.raven.negativeDelivery1":
    "Hélas, les ingrédients nécessaires vous échappent. N'ayez crainte, cependant. Continuez à chercher, et les mystères se révéleront d'eux-mêmes!",
  "npcDialogues.raven.negativeDelivery2":
    "Oh, ténèbres et désarroi. Vous ne possédez pas ce dont j'ai besoin. Mais ne vous inquiétez pas ; les ombres vous guideront jusqu'à lui.",
  "npcDialogues.raven.negativeDelivery3":
    "N'ayez crainte, cependant. Poursuivez votre quête, et la magie se manifestera.",
  // Raven NoOrder
  "npcDialogues.raven.noOrder1":
    "Il semble qu'il n'y ait pas de commande active vous attendant dans mon domaine sombre. Cependant, si vous cherchez des conseils ou avez des questions sur les arts mystiques, n'hésitez pas à demander.",
  "npcDialogues.raven.noOrder2":
    "Pas de commande active de ma part, voyageur. Mais ne vous inquiétez pas ! Les ombres veillent toujours, et quand le moment sera venu, nous plongerons ensemble dans les profondeurs de la magie.",
  // Tywin Intro
  "npcDialogues.tywin.intro1":
    "Ah, un autre roturier qui honore ma présence. As-tu ce que je veux ? Parle vite.",
  "npcDialogues.tywin.intro2":
    "Oh, super, encore un de la plèbe. Quel est ton business avec quelqu'un de mon envergure ? As-tu ce dont j'ai besoin?",
  "npcDialogues.tywin.intro3":
    "Salutations, roturier. Cherches-tu la sagesse, par hasard ? As-tu tout ce que je t'ai demandé?",
  "npcDialogues.tywin.intro4":
    "Que veux-tu ? Parle vite ; le temps, c'est de l'argent. Tu as ce dont j'ai besoin, je présume?",
  // Tywin Positive Delivery
  "npcDialogues.tywin.positiveDelivery1":
    "Hmm, il semble que tu n'es pas complètement inutile. Tu as réussi à apporter ce que je voulais. Continue, paysan!",
  "npcDialogues.tywin.positiveDelivery2":
    "Étonnamment, tu as réellement apporté ce que je désirais. Peut-être que tu n'es pas aussi inutile que je le pensais.",
  "npcDialogues.tywin.positiveDelivery3":
    "Ah, travail merveilleux ! Tu as apporté les matériaux dont j'ai besoin. Ensemble, nous créerons des chefs-d'œuvre!",
  "npcDialogues.tywin.positiveDelivery4":
    "Bien. Tu as livré les matériaux dont j'ai besoin. Igor ne décevra pas ; les outils seront remarquables.",
  // Tywin Negative Delivery
  "npcDialogues.tywin.negativeDelivery1":
    "Pathétique. Tu n'as pas ce que j'ai demandé. Ne perds pas mon temps avec ton incompétence. Pars!",
  "npcDialogues.tywin.negativeDelivery2":
    "Quelle déception. Tu n'as pas ce que j'ai demandé. Typique de ton genre. Maintenant, disparais!",
  "npcDialogues.tywin.negativeDelivery3":
    "Insatisfaisant. Tu ne possèdes pas ce dont j'ai besoin. Je n'ai pas de temps pour l'incompétence. Reviens quand tu seras capable.",
  "npcDialogues.tywin.negativeDelivery4":
    "Incompétence. Tu n'as pas les matériaux nécessaires. Ne gaspille pas mon temps ; reviens quand tu seras prêt.",
  // Tywin NoOrder
  "npcDialogues.tywin.noOrder1":
    "Ah, il semble que je n'ai pas de commande active pour toi, roturier. Mais si tu as besoin de ma présence estimée ou si tu as une requête, dis-la rapidement. Le temps, c'est de l'argent, après tout.",
  "npcDialogues.tywin.noOrder2":
    "Pas de commande active pour toi aujourd'hui, paysan. Cependant, si tu tombes sur quelque chose digne de mon attention ou si tu as besoin de mon expertise, tu sais où me trouver.",
  // Bert Intro
  "npcDialogues.bert.intro1":
    "Psst ! Explorateur de l'occulte ! Les secrets vastes de Sunflorea sont nombreux...",
  "npcDialogues.bert.intro2":
    "Ah, esprit apparenté ! Sunflorea abrite d'innombrables trésors...",
  "npcDialogues.bert.intro3":
    "Salutations, porteur du mystérieux ! À Sunflorea, certains objets demandent Livraison...",
  "npcDialogues.bert.intro4":
    "Bonjour, chercheur du caché ! Les enchantements de Sunflorea peuvent être catégorisés en deux...",
  "bert.day":
    "Vous ne pouvez pas retirer cet objet pendant 3 jours après avoir réclamé {{seasonalTicket}}.",
  // Bert Positive Delivery
  "npcDialogues.bert.positiveDelivery1":
    "Incroyable ! Vous m'avez apporté tout ce dont j'ai besoin...",
  "npcDialogues.bert.positiveDelivery2":
    "Oh, découverte fascinante ! Vous m'avez apporté exactement les objets que je cherchais...",
  "npcDialogues.bert.positiveDelivery3":
    "Ah, il était temps ! Vous avez acquis les objets exacts que je cherchais. Excellent!",
  "npcDialogues.bert.positiveDelivery4":
    "Impressionnant ! Vous m'avez apporté exactement ce dont j'ai besoin pour découvrir les secrets de Sunflorea.",
  // Bert Negative Delivery
  "npcDialogues.bert.negativeDelivery1":
    "Oh, hélas. Vous ne possédez pas ce que je cherche. Continuez à explorer, je vous verrai lorsque vous aurez ce dont j'ai besoin!",
  "npcDialogues.bert.negativeDelivery2":
    "Zut ! Ce que vous avez n'est pas tout à fait ce dont j'ai besoin. Continuez à travailler sur ma commande, et ensemble, nous dévoilerons les mystères!",
  "npcDialogues.bert.negativeDelivery3":
    "Hmm, pas tout à fait ce à quoi je m'attendais. Mais ne craignez rien ! Il y a encore du temps pour m'obtenir ce dont j'ai besoin.",
  "npcDialogues.bert.negativeDelivery4":
    "Oh, pas tout à fait ce que je cherchais. Revenez quand vous l'aurez. Mais gardez les yeux ouverts ; les pages de l'histoire ont encore plus à révéler.",
  // Bert NoOrder
  "npcDialogues.bert.noOrder1":
    "Pas de commande active à accomplir pour moi aujourd'hui, mais cela ne signifie pas que je n'ai pas d'énigmatiques secrets à partager.",
  "npcDialogues.bert.noOrder2":
    "Pas d'artefact énigmatique à découvrir avec Bert en ce moment, mais cela ne signifie pas que je manque de faits étranges et de vérités cachées.",
  // Timmy Intro
  "npcDialogues.timmy.intro1":
    "Salut, l'ami ! C'est Timmy, et j'ai hâte de voir si tu as ce que j'ai demandé.",
  "npcDialogues.timmy.intro2":
    "Salutations, compagnon aventurier ! C'est Timmy, qui se demande si tu as trouvé ce que j'ai demandé.",
  "npcDialogues.timmy.intro3":
    "Bienvenue, bienvenue ! Je suis Timmy, le visage le plus amical de la place. Peux-tu m'aider en vérifiant si tu as ce dont j'ai besoin?",
  "npcDialogues.timmy.intro4":
    "Hé, hé ! Prêt pour un peu de plaisir au soleil ? C'est Timmy, et je suis impatient de voir si tu as ce que j'ai demandé.",
  "npcDialogues.timmy.intro5":
    "Bonjour, rayon de soleil ! Timmy est là, en espérant que tu as ce que j'ai demandé. Voyons voir?",
  // Timmy Positive Delivery
  "npcDialogues.timmy.positiveDelivery1":
    "Youpi ! Tu as exactement ce dont j'avais besoin. Ta générosité remplit mon cœur de joie. Merci!",
  "npcDialogues.timmy.positiveDelivery2":
    "C'est de cela dont je parle ! Tu as apporté exactement ce que je cherchais. Tu es une superstar!",
  "npcDialogues.timmy.positiveDelivery3":
    "Oh, fantastique ! Ton timing ne pouvait pas être meilleur. Tu as illuminé ma journée avec ton offre réfléchie. Merci!",
  "npcDialogues.timmy.positiveDelivery4":
    "Hourra ! Tu as livré la marchandise. Sunflorea a de la chance d'avoir quelqu'un d'aussi incroyable que toi!",
  "npcDialogues.timmy.positiveDelivery5":
    "Tu l'as encore fait ! Ta gentillesse et ta générosité ne cessent de m'étonner. Merci d'illuminer la place!",
  // Timmy Negative Delivery
  "npcDialogues.timmy.negativeDelivery1":
    "Oh, zut ! On dirait que tu n'as pas ce que je cherche en ce moment. Pas de soucis, cependant. Continue à explorer, et nous trouverons une autre opportunité.",
  "npcDialogues.timmy.negativeDelivery2":
    "Oh non ! Il semble que tu n'aies pas ce dont j'ai besoin pour le moment. Ne t'inquiète pas, cependant. Je crois en toi. Reviens quand tu l'auras trouvé!",
  "npcDialogues.timmy.negativeDelivery3":
    "Oh, zut ! Tu n'as pas ce que je cherche en ce moment. Continue à explorer ! Peut-être que la prochaine fois tu tomberas sur ce dont j'ai besoin.",
  "npcDialogues.timmy.negativeDelivery4":
    "Oh, dommage ! Il semble que tu n'aies pas l'objet que je recherche. Mais ne renonce pas ; de nouvelles opportunités t'attendent juste au coin de la rue.",
  "npcDialogues.timmy.negativeDelivery5":
    "Oh, zut ! Tu n'as pas ce que je cherche. Mais ne t'inquiète pas, mon ami. Continue à explorer, et nous fêterons ça quand tu le trouveras!",
  // Timmy NoOrder
  "npcDialogues.timmy.noOrder1":
    "Oh, salut ! Je n'ai pas de commandes actives pour toi en ce moment, mais je suis toujours impatient d'apprendre et d'entendre des histoires. As-tu des récits passionnants de tes aventures à Sunflorea ? Ou peut-être as-tu rencontré un nouvel ami ours ? Partage-le avec moi!",
  "npcDialogues.timmy.noOrder2":
    "Pas de commande spécifique à remplir pour le moment, mais cela ne m'empêchera pas d'être curieux ! As-tu des histoires intéressantes sur tes voyages ? Peut-être as-tu rencontré un ours rare ou découvert un joyau caché à Sunflorea ? Parlons-en!",
  // Cornwell Intro
  "npcDialogues.cornwell.intro1":
    "Salutations, jeune aventurier ! Es-tu venu avec les objets que je recherche?",
  "npcDialogues.cornwell.intro2":
    "Ah, bienvenue, chercheur de connaissances et de reliques ! As-tu les objets que j'ai demandés ? Montre-moi ce que tu as.",
  "npcDialogues.cornwell.intro3":
    "Plonge dans le royaume des secrets anciens et de la sagesse. As-tu acquis les objets que je désire ? Partage tes découvertes avec moi, jeune.",
  "npcDialogues.cornwell.intro4":
    "Ah, c'est toi ! Celui qui est en quête noble. As-tu trouvé les objets que je recherche ? Viens, montre-moi ce que tu as découvert dans les vastes terres de Sunflower Land.",
  "npcDialogues.cornwell.intro5":
    "Salutations, jeune voyageur ! Les vents de la curiosité t'ont amené ici. As-tu les objets que je demande pour enrichir ma collection?",
  // Cornwell Positive Delivery
  "npcDialogues.cornwell.positiveDelivery1":
    "Merveilleux ! Vous avez apporté les reliques que je désirais tant. Vos efforts pour préserver l'histoire de Sunflower Land resteront gravés dans les mémoires.",
  "npcDialogues.cornwell.positiveDelivery2":
    "Ah, splendide ! Vos découvertes correspondent parfaitement aux reliques que je recherchais. Ces trésors ajouteront une grande sagesse à ma collection.",
  "npcDialogues.cornwell.positiveDelivery3":
    "Impressionnant ! Les objets que vous avez acquis sont exactement ce que je cherchais. L'histoire de Sunflower Land brillera à travers eux.",
  "npcDialogues.cornwell.positiveDelivery4":
    "Ah, jeune aventurier, vous avez dépassé mes attentes ! Les objets que vous avez apportés seront d'une grande valeur pour mes recherches.",
  "npcDialogues.cornwell.positiveDelivery5":
    "Ah, bien joué, mon ami au regard perçant ! Les objets que vous avez livrés trouveront une place d'honneur dans la collection de mon moulin à vent.",
  // Cornwell Negative Delivery
  "npcDialogues.cornwell.negativeDelivery1":
    "Oh, il semble que vous n'ayez pas trouvé les objets que je cherche. N'ayez crainte ; le voyage de la découverte continue. Continuez à explorer les mystères de Sunflower Land.",
  "npcDialogues.cornwell.negativeDelivery2":
    "Hmm, ce ne sont pas tout à fait les reliques auxquelles je m'attendais. Mais ne désespérez pas ! Continuez à chercher, et les trésors de Sunflower Land se révéleront à vous.",
  "npcDialogues.cornwell.negativeDelivery3":
    "Oh, il semble que les objets que je désirais vous échappent. Peu importe ; votre curiosité vous conduira finalement vers les découvertes appropriées.",
  "npcDialogues.cornwell.negativeDelivery4":
    "Ah, je vois que vous n'avez pas trouvé les objets spécifiques dont j'ai besoin. Ne vous inquiétez pas ; l'histoire de Sunflower Land recèle de nombreux secrets qui attendent d'être découverts.",
  "npcDialogues.cornwell.negativeDelivery5":
    "Oh, mon cher voyageur, il semble que vous n'ayez pas apporté les objets exacts que je cherchais. Mais votre dévouement envers l'histoire de Sunflower Land est louable.",
  // Cornwell NoOrder
  "npcDialogues.cornwell.noOrder1":
    "Ah, il semble qu'il n'y ait pas d'objets de quête à livrer pour le moment. Mais ne soyez pas découragé ! Votre voyage à Sunflower Land est rempli d'aventures inédites qui attendent d'être découvertes.",
  "npcDialogues.cornwell.noOrder2":
    "Oh, il semble que je n'aie pas besoin de vos services pour le moment. Mais ne vous inquiétez pas ; les pages de l'histoire de Sunflower Land tournent sans fin, et de nouvelles quêtes se présenteront sûrement.",
  "npcDialogues.cornwell.noOrder3":
    "Ah, mes excuses, mais je n'ai rien à vous faire accomplir en ce moment. N'ayez crainte, cependant ; votre chemin en tant que chercheur de connaissances vous conduira inévitablement à de nouvelles quêtes en temps voulu.",
  "npcDialogues.cornwell.noOrder4":
    "Ah, il semble que vous n'ayez pas reçu de commandes de quête de ma part pour le moment. Mais ne perdez pas espoir ; votre nature curieuse vous guidera bientôt vers de passionnantes nouvelles quêtes à Sunflower Land.",
  // Pumpkin Pete Intor
  "npcDialogues.pumpkinPete.intro1":
    "Je t'attendais, mon ami ! As-tu ma commande prête?",
  "npcDialogues.pumpkinPete.intro2":
    "Salut là, pumpkin ! J'ai été occupé à guider les Bumpkins autour de la place ? As-tu eu ma commande?",
  "npcDialogues.pumpkinPete.intro3":
    "Salutations, ami ! La place est en ébullition aujourd'hui. As-tu réussi à obtenir ma commande?",
  "npcDialogues.pumpkinPete.intro4":
    "Bonjour, camarade aventurier ! Qu'est-ce qui t'amène dans ma modeste demeure ? As-tu eu ma commande?",
  "npcDialogues.pumpkinPete.intro5":
    "Hey, hey ! Bienvenue sur la place ! As-tu réussi à trouver ce dont j'avais besoin?",
  // Pumpkin Pete Positive Delivery
  "npcDialogues.pumpkinPete.positiveDelivery1":
    "Hourra ! Tu as apporté exactement ce dont j'avais besoin. Tu es un véritable héros de la place!",
  "npcDialogues.pumpkinPete.positiveDelivery2":
    "C'est génial ! Tu as exactement ce que je cherchais. Tu illumines notre petite communauté!",
  "npcDialogues.pumpkinPete.positiveDelivery3":
    "Super, des graines de joie ! Tu as apporté exactement ce dont j'avais besoin. La place a de la chance de t'avoir!",
  "npcDialogues.pumpkinPete.positiveDelivery4":
    "Fantastique ! Tu es arrivé avec précisément ce que je désirais. Ta gentillesse répand la joie dans notre place!",
  "npcDialogues.pumpkinPete.positiveDelivery5":
    "Oh, des graines de pumpkin de joie ! Tu m'as apporté exactement ce dont j'avais besoin. La place te remercie pour ton aide!",
  // Pumpkin Pete Negative Delivery
  "npcDialogues.pumpkinPete.negativeDelivery1":
    "Oh non. Il semble que tu n'aies pas ce que je recherche. Ne t'inquiète pas, cependant. Je crois en toi. Reviens quand tu l'auras trouvé!",
  "npcDialogues.pumpkinPete.negativeDelivery2":
    "Oh zut ! Tu n'as pas ce que je cherche en ce moment. Continue à explorer, cependant ! Peut-être la prochaine fois.",
  "npcDialogues.pumpkinPete.negativeDelivery3":
    "Oh, des graines de chagrin ! Tu n'as pas ce que je recherche. Mais ne désespère pas ; de nouvelles opportunités se présentent chaque jour!",
  "npcDialogues.pumpkinPete.negativeDelivery4":
    "Oh, des snapdragons ! Tu n'as pas ce que je recherche en ce moment. Continue à explorer, cependant ! Je suis sûr que tu le trouveras.",
  "npcDialogues.pumpkinPete.negativeDelivery5":
    "Oupsie-daisy ! Tu n'as pas ce que je recherche. Mais ne t'inquiète pas, mon ami. Continue à explorer, et nous célébrerons quand tu le trouveras.",
  // Pumpkin Pete NoOrder
  "npcDialogues.pumpkinPete.noOrder1":
    "Eh bien, mon ami, il semble que je n'aie pas de commande active pour toi en ce moment. Mais ne crains rien ! Je suis toujours là pour t'offrir des conseils et un sourire amical de pumpkin.",
  "npcDialogues.pumpkinPete.noOrder2":
    "Oh, pas de commande active pour toi aujourd'hui, mon ami. Mais ne t'inquiète pas ! N'hésite pas à explorer la place, et si tu as besoin d'aide, je suis ton fidèle Bumpkin.",

  // NPC gift dialogues
  "npcDialogues.pumpkinPete.reward":
    "Merci beaucoup pour tes livraisons. Voici un petit geste d'appréciation pour toi.",
  "npcDialogues.pumpkinPete.flowerIntro":
    "As-tu déjà vu l'élégance d'un Cosmos Jaune ? J'en ai envie...",
  "npcDialogues.pumpkinPete.averageFlower":
    "Pas exactement ce que j'avais en tête, mais c'est assez charmant. Merci.",
  "npcDialogues.pumpkinPete.badFlower":
    "Ce n'est pas ce que j'espérais. Peut-être que tu peux trouver quelque chose de plus approprié?",
  "npcDialogues.pumpkinPete.goodFlower":
    "Ce Cosmos Jaune est splendide! Merci de me l'avoir apporté.",

  "npcDialogues.betty.reward":
    "J'apprécie tes cadeaux réfléchis. Voici quelque chose pour te montrer ma gratitude.",
  "npcDialogues.betty.flowerIntro":
    "Peux-tu imaginer la beauté d'une Pensée Rouge, Jaune, Violette, Blanche ou Bleue ? J'en rêve...",
  "npcDialogues.betty.averageFlower":
    "Pas exactement ce à quoi je m'attendais, mais c'est assez charmant. Merci.",
  "npcDialogues.betty.badFlower":
    "Ce n'est pas ce que j'avais en tête. Pourrais-tu essayer de trouver une fleur plus appropriée?",
  "npcDialogues.betty.goodFlower":
    "Cette Pensée est magnifique ! Merci de me l'avoir apportée.",

  "npcDialogues.blacksmith.reward":
    "Vos livraisons sont grandement appréciées. Voici quelque chose pour vos efforts.",
  "npcDialogues.blacksmith.flowerIntro":
    "J'ai besoin d'une Œil-de-perdrix rouge vibrante. En avez-vous trouvé une?",
  "npcDialogues.blacksmith.averageFlower":
    "Ce n'est pas exactement ce que j'espérais, mais c'est plutôt agréable. Merci.",
  "npcDialogues.blacksmith.badFlower":
    "Cette fleur n'est pas tout à fait ce qu'il faut. Pourriez-vous en chercher une autre plus adaptée?",
  "npcDialogues.blacksmith.goodFlower":
    "Ah, cette Œil-de-perdrix rouge est parfaite ! Merci de me l'avoir apportée.",

  "npcDialogues.bert.reward":
    "Merci pour votre aide continue. Voici un petit geste d'appréciation.",
  "npcDialogues.bert.flowerIntro":
    "Les Lotus rouges, jaunes, violets, blancs ou bleus sont vraiment enchanteurs. En avez-vous un?",
  "npcDialogues.bert.averageFlower":
    "Ce n'était pas ce à quoi je m'attendais, mais c'est plutôt charmant. Merci.",
  "npcDialogues.bert.badFlower":
    "Ce n'est pas la fleur que je recherchais. Pourriez-vous essayer de trouver une autre fleur plus adaptée?",
  "npcDialogues.bert.goodFlower":
    "Ce Lotus est magnifique ! Merci de me l'avoir apporté.",

  "npcDialogues.finn.reward":
    "Vos contributions sont inestimables. Voici quelque chose pour exprimer ma gratitude.",
  "npcDialogues.finn.flowerIntro":
    "J'aspire à un magnifique Cosmos en blanc ou en bleu. Pouvez-vous en trouver un ?",
  "npcDialogues.finn.averageFlower":
    "Ce n'est pas exactement ce que j'espérais, mais c'est plutôt plaisant. Merci.",
  "npcDialogues.finn.badFlower":
    "Cette fleur ne répond pas tout à fait à mes attentes. Peut-être un autre essai?",
  "npcDialogues.finn.goodFlower":
    "Ce Cosmos est magnifique ! Merci de me l'avoir apporté.",

  "npcDialogues.finley.reward":
    "Merci pour vos efforts. Voici un petit geste d'appréciation pour vos livraisons.",
  "npcDialogues.finley.flowerIntro":
    "Une belle jonquille, comme celle à laquelle je pense, illuminerait ma journée. En avez-vous vu une?",
  "npcDialogues.finley.averageFlower":
    "Ce n'est pas exactement ce à quoi je pensais, mais c'est plutôt charmant. Merci.",
  "npcDialogues.finley.badFlower":
    "Cette fleur n'est pas tout à fait appropriée. Peut-être qu'une autre serait plus adaptée?",
  "npcDialogues.finley.goodFlower":
    "Cette jonquille est magnifique ! Merci de me l'avoir apportée.",

  "npcDialogues.corale.reward":
    "Vos livraisons sont grandement appréciées. Voici un petit geste pour témoigner de ma gratitude.",
  "npcDialogues.corale.flowerIntro":
    "Avez-vous déjà rencontré le radiant Pétale de Prisme ? C'est tout simplement enchanteur...",
  "npcDialogues.corale.averageFlower":
    "Ce n'est pas tout à fait ce que j'espérais, mais c'est plutôt délicat. Merci.",
  "npcDialogues.corale.badFlower":
    "Ce n'est pas tout à fait ce que j'avais en tête. Pourriez-vous trouver une fleur plus adaptée?",
  "npcDialogues.corale.goodFlower":
    "Ce Pétale de Prisme est exquis ! Merci de me l'avoir apporté.",

  "npcDialogues.raven.reward":
    "Merci pour vos livraisons. Voici un petit geste d'appréciation pour vos efforts.",
  "npcDialogues.raven.flowerIntro":
    "Le violet sombre est la couleur de mon âme - en avez-vous trouvé quelque chose de similaire?",
  "npcDialogues.raven.averageFlower":
    "Ce n'est pas tout à fait ce à quoi je m'attendais, mais c'est plutôt plaisant. Merci.",
  "npcDialogues.raven.badFlower":
    "Cette fleur n'est pas tout à fait appropriée. Peut-être qu'une autre recherche est nécessaire?",
  "npcDialogues.raven.goodFlower":
    "This Purple flower is perfect! Thank you for bringing it to me.",

  "npcDialogues.miranda.reward":
    "Merci pour vos efforts. Voici un petit geste d'appréciation pour vos livraisons.",
  "npcDialogues.miranda.flowerIntro":
    "La vivacité d'une fleur jaune soulèverait certainement mon moral. En avez-vous vu une quelque part?",
  "npcDialogues.miranda.averageFlower":
    "Ce n'est pas tout à fait ce que j'espérais, mais c'est plutôt charmant. Merci.",
  "npcDialogues.miranda.badFlower":
    "Cette fleur n'est pas tout à fait appropriée. Peut-être qu'une autre serait plus adaptée?",
  "npcDialogues.miranda.goodFlower":
    "Cette fleur jaune est ravissante ! Merci de me l'avoir apportée.",

  "npcDialogues.cornwell.reward":
    "Merci pour vos livraisons. Voici un petit geste d'appréciation pour vos efforts.",
  "npcDialogues.cornwell.flowerIntro":
    "La vue d'une Fleur Ballon en rouge, jaune, violet, blanc ou bleu est vraiment délicieuse...",
  "npcDialogues.cornwell.averageFlower":
    "Ce n'est pas tout à fait ce à quoi je m'attendais, mais c'est plutôt charmant. Merci.",
  "npcDialogues.cornwell.badFlower":
    "Cette fleur n'est pas tout à fait appropriée. Peut-être qu'une autre recherche est nécessaire?",
  "npcDialogues.cornwell.goodFlower":
    "Cette Fleur Ballon est délicieuse ! Merci de me l'avoir apportée.",

  "npcDialogues.tywin.reward":
    "Merci pour vos livraisons. Voici un petit geste d'appréciation pour vos efforts.",
  "npcDialogues.tywin.flowerIntro":
    "Avez-vous entendu parler de l'exquise Primula Enigma ou de la fascinante Celestial Frostbloom ? J'en ai besoin d'une.",
  "npcDialogues.tywin.averageFlower":
    "Ce n'est pas exactement ce à quoi je m'attendais, mais c'est plutôt charmant. Merci.",
  "npcDialogues.tywin.badFlower":
    "Cette fleur n'est pas tout à fait appropriée. Peut-être qu'une autre serait plus adaptée?",
  "npcDialogues.tywin.goodFlower":
    "Cette fleur est tout simplement époustouflante ! Merci de me l'avoir apportée.",

  "npcDialogues.default.flowerIntro":
    "As-tu une fleur pour moi ? Assure-toi que c'est quelque chose que j'aime.",
  "npcDialogues.default.averageFlower": "Wow, merci ! J'adore cette fleur!",
  "npcDialogues.default.badFlower":
    "Hmmmm, ce n'est pas ma fleur préférée. Mais je suppose que c'est l'intention qui compte.",
  "npcDialogues.default.goodFlower":
    "C'est ma fleur préférée ! Merci beaucoup!",
  "npcDialogues.default.reward":
    "Wow, merci Bumpkin. Voici un petit cadeau pour ton aide!",
  "npcDialogues.default.locked": "Veuillez revenir demain.",
};

const nyeButton: Record<NyeButton, string> = {
  "plaza.magicButton.query":
    "Un bouton magique est apparu sur la place. Souhaitez-vous appuyer dessus?",
};

export const NYON_STATUE: Record<NyonStatue, string> = {
  "nyonStatue.memory": "En mémoire de",
  "nyonStatue.description":
    "Le chevalier légendaire responsable d'avoir débarrassé les gobelins des mines. Peu de temps après sa victoire, il est décédé empoisonné par un conspirateur gobelin. Les Citoyens du Tournesol ont érigé cette statue avec son armure pour commémorer ses conquêtes.",
};

const obsessionDialogue: Record<ObsessionDialogue, string> = {
  "obsessionDialogue.line1":
    "Ah, le {{itemName}} ! Je souhaite seulement le voir, pas le posséder. Montrez-le moi, et vous recevrez {{seasonalTicket}} en récompense.",
  "obsessionDialogue.line2":
    "Vous avez apporté le {{itemName}} ? Je veux simplement le contempler. Laissez-moi le voir, et les {{seasonalTicket}} seront vôtres.",
  "obsessionDialogue.line3":
    "Est-ce le {{itemName}} que vous avez ? Un simple coup d'œil me suffit. Pour cela, vous recevrez {{seasonalTicket}}.",
  "obsessionDialogue.line4":
    "{{itemName}} ! Je ne veux pas le garder, juste le contempler. Montrez-le moi, et les {{seasonalTicket}} seront à vous.",
  "obsessionDialogue.line5":
    "Vous offrez une vue du {{itemName}} ? Tout ce que je demande, c'est de le voir brièvement. Pour votre générosité, des {{seasonalTicket}} vous seront accordés.",
};

const offer: Record<Offer, string> = {
  "offer.okxOffer": "Salut fermier, j'ai une offre exclusive OKX pour toi!",
  "offer.beginWithNFT":
    "Pour commencer, vous devrez créer un NFT de ferme gratuit. Cela comprendra :",
  "offer.getStarterPack": "Obtiens le Pack de Démarrage Maintenant",
  "offer.newHere": "Salut fermier, tu sembles nouveau ici!",
  "offer.getStarted": "Commence Maintenant",
  "offer.not.enough.BlockBucks": "Vous n'avez pas assez de Block Bucks!",
};

const onboarding: Record<Onboarding, string> = {
  "onboarding.welcome": "Bienvenue dans le monde du jeu décentralisé!",
  "onboarding.step.one": "Étape 1/3",
  "onboarding.step.two": "Étape 2/3 (Créer un portefeuille)",
  "onboarding.step.three": "Étape 3/3 (Créer votre NFT)",
  "onboarding.intro.one":
    "Au cours de vos aventures, vous gagnerez des NFT rares qui doivent être protégés. Pour les sécuriser, vous aurez besoin d'un portefeuille Web3.",
  "onboarding.intro.two":
    "Pour commencer votre voyage, votre portefeuille recevra",
  "onboarding.cheer": "Vous y êtes presque!",
  "onboarding.form.one": "Remplissez vos coordonnées",
  "onboarding.form.two":
    "et nous vous enverrons un NFT gratuit pour jouer. (Cela nous prendra de 3 à 7 jours)",
  "onboarding.duplicateUser.one": "Déjà inscrit!",
  "onboarding.duplicateUser.two":
    "Il semble que vous vous soyez déjà inscrit pour les tests bêta en utilisant une adresse différente. Une seule adresse peut être utilisée lors des tests bêta.",
  "onboarding.starterPack": "Pack de Démarrage",
  "onboarding.settingWallet": "Configuration de votre portefeuille",
  "onboarding.wallet.one":
    "Il existe de nombreux fournisseurs de portefeuilles, mais nous avons choisi Sequence car ils sont faciles à utiliser et sécurisés.",
  "onboarding.wallet.two":
    "Sélectionnez une méthode d'inscription dans la fenêtre contextuelle et vous êtes prêt. Je vous reverrai ici dans quelques minutes!",
  "onboarding.wallet.haveWallet": "J'ai déjà un portefeuille",
  "onboarding.wallet.createButton": "Créer un portefeuille",
  "onboarding.wallet.acceptButton": "Accepter les conditions d'utilisation",
  "onboarding.buyFarm.title": "Achetez votre ferme!",
  "onboarding.buyFarm.one":
    "Maintenant que votre portefeuille est configuré, il est temps d'obtenir votre propre NFT de ferme!",
  "onboarding.buyFarm.two":
    "Ce NFT stockera en toute sécurité tout votre progrès dans Sunflower Land et vous permettra de revenir pour vous occuper de votre ferme.",
  "onboarding.wallet.already": "J'ai déjà un portefeuille",
};

const onCollectReward: Record<OnCollectReward, string> = {
  "onCollectReward.Missing.Seed": "Graines manquantes",
  "onCollectReward.Market":
    "Rendez-vous sur le Marché pour acheter des graines.",
  "onCollectReward.Missing.Shovel": "Pelle manquante",
  "onCollectReward.Missing.Shovel.description":
    "Agrandissez votre île pour la trouver.",
};

const orderhelp: Record<OrderHelp, string> = {
  "orderhelp.Skip.hour":
    "Vous ne pouvez sauter une commande qu'après 24 heures!",
  "orderhelp.New.Season":
    "Une nouvelle saison approche, les livraisons seront temporairement fermées.",
  "orderhelp.New.Season.arrival":
    "Nouvelles livraisons saisonnières bientôt disponibles.",
  "orderhelp.Wisely": "Choisissez judicieusement!",
  "orderhelp.SkipIn": "Sauter dans",
  "orderhelp.NoRight": "Pas maintenant",
  "orderhelp.ticket.deliveries.closed":
    ENGLISH_TERMS["orderhelp.ticket.deliveries.closed"],
};

const pending: Record<Pending, string> = {
  "pending.calcul": "Les résultats sont en cours de calcul.",
  "pending.comeback": "Revenez plus tard.",
};

const personHood: Record<PersonHood, string> = {
  "personHood.Details": "Chargement des détails de l'identité échoué",
  "personHood.Identify": "Votre identité n'a pas pu être vérifiée",
  "personHood.Congrat": "Félicitations, votre identité a été vérifiée!",
};

const pickserver: Record<Pickserver, string> = {
  "pickserver.server": "Choisissez un serveur à rejoindre",
  "pickserver.full": "COMPLET",
  "pickserver.explore": "Explorez les îles de projets personnalisés.",
  "pickserver.built": "Voulez-vous construire votre propre île?",
};

const piratechest: Record<PirateChest, string> = {
  "piratechest.greeting":
    "Ahoy matey! Mettez les voiles et revenez plus tard pour un coffre rempli de récompenses de flibustier!",
  "piratechest.refreshesIn": "Le coffre se rafraîchit dans",
  "piratechest.warning":
    "Ahoy là ! Ce coffre est rempli de trésors dignes d'un roi pirate, mais méfiez-vous, seuls ceux avec une apparence de pirate peuvent l'ouvrir et réclamer le butin à l'intérieur!",
};

const pirateQuest: Record<PirateQuest, string> = {
  "questDescription.farmerQuest1": "Récoltez 1000 Sunflowers",
  "questDescription.fruitQuest1": "Récoltez 10 Myrtilles",
  "questDescription.fruitQuest2": "Récoltez 100 Oranges",
  "questDescription.fruitQuest3": "Récoltez 750 Pommes",
  "questDescription.pirateQuest1": "Creusez 30 trous",
  "questDescription.pirateQuest2": "Collectez 10 Algues",
  "questDescription.pirateQuest3": "Collectez 10 Pipis",
  "questDescription.pirateQuest4": "Collectez 5 Coraux",
  "piratequest.welcome":
    "Bienvenue sur les hautes mers de l'aventure, où vous serez mis à l'épreuve en tant que vrai pirate. Mettez les voiles pour partir à la recherche du plus riche butin et devenez le plus grand pirate ayant jamais vogué sur les vagues de l'océan.",
  "piratequest.finestPirate":
    "Ahoy, vous êtes le meilleur pirate des sept mers avec votre butin !!",
};

const playerTrade: Record<PlayerTrade, string> = {
  "playerTrade.no.trade": "Aucun échange disponible.",
  "playerTrade.max.item":
    "Oh non ! Vous avez atteint le nombre maximal d'objets.",
  "playerTrade.Progress":
    "Veuillez stocker votre progression sur la chaîne avant de continuer.",
  "playerTrade.transaction":
    "Oh oh ! Il semble que vous ayez une transaction en cours.",
  "playerTrade.Please": "Veuillez patienter 5 minutes avant de continuer.",
  "playerTrade.sold": "Vendu",
  "playerTrade.sale": "À vendre: ",
  "playerTrade.title.congrat": "Félicitations, votre annonce a été achetée",
};

const portal: Record<Portal, string> = {
  "portal.wrong": "Quelque chose s'est mal passé",
  "portal.unauthorised": "non autorisé",
  "portal.example.intro": ENGLISH_TERMS["portal.example.intro"],
  "portal.example.claimPrize": ENGLISH_TERMS["portal.example.claimPrize"],
  "portal.example.purchase": ENGLISH_TERMS["portal.example.purchase"],
};

const promo: Record<Promo, string> = {
  "promo.cdcBonus": "Bonus Crypto.com!",
  "promo.expandLand": "Étendez votre terrain deux fois pour obtenir 100 SFL.",
};

const purchaseableBaitTranslation: Record<PurchaseableBaitTranslation, string> =
  {
    "purchaseableBait.fishingLure.description":
      "Idéal pour attraper des poissons rares!",
  };

const pwaInstall: Record<PwaInstall, string> = {
  "install.app": "Installer l'application",
  "magic.link": "Lien magique",
  "generating.link": "Génération du lien",
  "generating.code": "Génération du code",
  "install.app.desktop.description":
    "Scannez le code ci-dessous pour l'installer sur votre appareil. Veuillez vous assurer d'ouvrir dans le navigateur Safari ou Chrome.",
  "install.app.mobile.metamask.description":
    "Copiez le lien magique ci-dessous et ouvrez-le dans {{browser}} sur votre appareil pour l'installer !",
  "do.not.share.link": "Ne partagez pas ce lien !",
  "do.not.share.code": "Ne partagez pas ce code !",
  "qr.code.not.working": "Le code QR ne fonctionne pas ?",
};

const quest: Record<Quest, string> = {
  "quest.mint.free": "Mint gratuit pour vêtement",
  "quest.equipWearable": "Équipez ce vêtement sur votre Bumpkin",
  "quest.congrats": "Félicitations, vous avez créé un {{wearable}} !",
};

const questions: Record<Questions, string> = {
  "questions.obtain.MATIC": "Comment puis-je obtenir du MATIC?",
  "questions.lowCash": "En manque de liquidités?",
};

const reaction: Record<Reaction, string> = {
  "reaction.bumpkin": "Bumpkin de niveau 3",
  "reaction.bumpkin.10": "Bumpkin de niveau 10",
  "reaction.bumpkin.30": "Bumpkin de niveau 30",
  "reaction.bumpkin.40": "Bumpkin de niveau 40",
  "reaction.sunflowers": "Récolter 100 000 Sunflowers",
  "reaction.crops": "Récolter 10 000 cultures",
  "reaction.goblin": "Se transformer en gobelin",
  "reaction.crown": "Posséder une Couronne de Gobelin",
};

const reactionBud: Record<ReactionBud, string> = {
  "reaction.bud.show": "Montrez vos boutons",
  "reaction.bud.select": "Sélectionnez un bouton à placer sur la place",
  "reaction.bud.noFound": "Aucun bouton trouvé dans votre inventaire",
};

const refunded: Record<Refunded, string> = {
  "refunded.itemsReturned":
    "Vos objets ont été retournés dans votre inventaire",
  "refunded.goodLuck": "Bonne chance la prochaine fois!",
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
  "removeKuebiko.title": "Supprimer Kuebiko",
  "removeKuebiko.description":
    "Cette action supprimera toutes vos graines de votre inventaire.",
  "removeKuebiko.removeSeeds": "Supprimer les graines",
};

const removeCropMachine: Record<RemoveCropMachine, string> = {
  "removeCropMachine.title": ENGLISH_TERMS["removeCropMachine.title"],
  "removeCropMachine.description":
    ENGLISH_TERMS["removeCropMachine.description"],
};

const resale: Record<Resale, string> = {
  "resale.actionText": "Revente",
};

const resources: Record<Resources, string> = {
  "resources.recoversIn": "Récupère dans :",
  "resources.boulder.rareMineFound": "Vous avez trouvé une mine rare!",
  "resources.boulder.advancedMining": "Exploitation minière avancée en cours.",
};

const resourceTerms: Record<ResourceTerms, string> = {
  "chicken.description": "Utilisé pour pondre des œufs",
  "magicMushroom.description": "Utilisé pour cuisiner des recettes avancées",
  "wildMushroom.description": "Utilisé pour cuisiner des recettes de base",
  "honey.description": "Utilisé pour sucrer vos plats",
};

const restock: Record<Restock, string> = {
  "restock.one.buck":
    "Vous allez utiliser 1 Block Buck pour recharger tous les articles du magasin dans le jeu",
  "restock.sure": "Êtes-vous sûr de vouloir recharger ?",
  "restock.tooManySeeds": "Vous avez trop de graines dans votre panier!",
  "seeds.reachingInventoryLimit": ENGLISH_TERMS["seeds.reachingInventoryLimit"],
};

const retreatTerms: Record<RetreatTerms, string> = {
  "retreatTerms.lookingForRareItems": "À la recherche d'objets rares?",
  "retreatTerms.resale.one":
    "Les joueurs peuvent échanger des objets spéciaux qu'ils ont fabriqués en jeu.",
  "retreatTerms.resale.two":
    "Vous pouvez les acheter sur des marchés secondaires tels qu'OpenSea.",
  "retreatTerms.resale.three": "Voir les objets sur OpenSea",
};

const rewardTerms: Record<RewardTerms, string> = {
  "reward.daily.reward": "Récompense quotidienne",
  "reward.streak": " jour de série",
  "reward.comeBackLater": "Revenez plus tard pour plus de récompenses",
  "reward.nextBonus": " Prochain bonus",
  "reward.unlock": "Débloquer la récompense",
  "reward.open": "Ouvrir la récompense",
  "reward.lvlRequirement":
    "Vous devez être niveau 3 pour réclamer des récompenses quotidiennes.",
  "reward.whatCouldItBe": "Qu'est-ce que cela pourrait être?",
  "reward.streakBonus": "Bonus de série x3",
  "reward.found": "Vous avez trouvé",
  "reward.spendWisely": "Dépensez-le judicieusement.",
  "reward.wearable": "Un accessoire pour votre Bumpkin",
  "reward.promo.code": "Entrez votre code promo",
  "reward.woohoo": "Woohoo ! Voici votre récompense",
  "reward.connectWeb3Wallet":
    "Connectez un portefeuille Web3 pour une récompense quotidienne.",
  "reward.factionPoints": ENGLISH_TERMS["reward.factionPoints"],
};

const rulesGameStart: Record<RulesGameStart, string> = {
  "rules.gameStart":
    "Au début du jeu, la plante choisira au hasard une combinaison de 4 potions et 1 potion 'chaos'. La combinaison peut être complètement différente ou complètement identique.",
  "rules.chaosPotionRule":
    "Si vous ajoutez la potion 'chaos', votre score pour cette tentative sera de 0.",
  "rules.potion.feedback":
    "Sélectionnez vos potions et découvrez les secrets des plantes!",
  "BloomBoost.description": "Enflammez vos plantes avec des fleurs vibrantes!",
  "DreamDrip.description":
    "Arrosez vos plantes avec des rêves et des fantasmes magiques.",
  "EarthEssence.description":
    "Exploitez le pouvoir de la terre pour nourrir vos plantes.",
  "FlowerPower.description":
    "Libérez une explosion d'énergie florale sur vos plantes.",
  "SilverSyrup.description":
    "Un sirop sucré pour mettre en valeur le meilleur de vos plantes.",
  "HappyHooch.description":
    "Une potion pour apporter de la joie et du rire à vos plantes.",
  "OrganicOasis.description":
    "Créez un paradis biologique luxuriant pour vos plantes.",
};

const rulesTerms: Record<RulesTerms, string> = {
  "game.rules": "Règles du jeu",
  "rules.oneAccountPerPlayer": "1 compte par joueur",
  "rules.gameNotFinancialProduct":
    "Il s'agit d'un jeu, pas d'un produit financier.",
  "rules.noBots": "Interdiction de l'utilisation de bots ou d'automatisation",
  "rules.termsOfService": "Conditions d'utilisation",
};

const sceneDialogueKey: Record<SceneDialogueKey, string> = {
  "sceneDialogues.chefIsBusy": "Le chef est occupé",
};

const seasonTerms: Record<SeasonTerms, string> = {
  "season.access": "Vous avez accès à",
  "season.banner": "Bannière saisonnière",
  "season.bonusTickets": "Billets saisonniers bonus",
  "season.boostXP": "+10% EXP provenant de la nourriture",
  "season.buyNow": "Acheter maintenant",
  "season.discount": "25% de réduction SFL sur les articles saisonniers",
  "season.exclusiveOffer": "Offre exclusive!",
  "season.goodLuck": "Bonne chance dans la saison!",
  "season.includes": "Comprend",
  "season.limitedOffer": " Offre à durée limitée!",
  "season.wearableAirdrop": "Distribution de vêtements saisonniers",
  "season.place.land": "Vous devez le placer sur votre terrain",
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
  "share.TweetText": "Visitez ma ferme de Sunflower Land",
  "share.ShareYourFarmLink": "Partagez le lien de votre ferme",
  "share.ShowOffToFarmers":
    "Impressionnez vos collègues agriculteurs en partageant le lien de votre ferme (URL : pour visiter directement votre ferme!",
  "share.FarmNFTImageAlt": "Image de la ferme NFT de Sunflower-Land",
  "share.CopyFarmURL": "Copier l'URL de la ferme",
  "share.Tweet": "Tweeter",
  "share.chooseServer": "Choisissez un serveur à rejoindre",
  "share.FULL": "COMPLET",
  "share.exploreCustomIslands": "Explorez les îles de projets personnalisés.",
  "share.buildYourOwnIsland": "Voulez-vous construire votre propre île?",
};

const sharkBumpkinDialogues: Record<SharkBumpkinDialogues, string> = {
  "sharkBumpkin.dialogue.shhhh": "Chut!",
  "sharkBumpkin.dialogue.scareGoblins": "J'essaie d'effrayer les Gobelins.",
};

const shelly: Record<Shelly, string> = {
  "shelly.Dialogue.one": "Salut, Bumpkin ! Bienvenue à la plage!",
  "shelly.Dialogue.two":
    "Après une journée de dur labeur dans ta ferme, il n'y a pas de meilleur endroit pour se détendre et profiter des vagues.",
  "shelly.Dialogue.three":
    "Mais nous avons un petit problème. Un kraken géant est apparu et a pris le contrôle de notre plage bien-aimée.",
  "shelly.Dialogue.four":
    "Nous aurions vraiment besoin de ton aide, cher ami. Attrape ton appât et tes cannes à pêche, et ensemble, nous affronterons ce problème colossal!",
  "shelly.Dialogue.five":
    "Pour chaque tentacule que tu attrapes, je te fournirai des précieuses écailles de sirène!",
  "shelly.Dialogue.letsgo": "Allons-y!",
};

const shellyDialogue: Record<ShellyDialogue, string> = {
  "shellyPanelContent.tasksFrozen":
    "J'attends le début de la nouvelle saison. Reviens me voir à ce moment-là!",
  "shellyPanelContent.canTrade":
    "Oh là là, tu as un Tentacule de Kraken ! Je l'échangerai contre des écailles de sirène.",
  "shellyPanelContent.cannotTrade":
    "On dirait que tu n'as pas de Tentacules de Kraken à portée de main ! Reviens quand tu en auras.",
  "shellyPanelContent.swap": "Échanger",
  "krakenIntro.congrats":
    "Bien joué ! Le Kraken a cessé de terroriser les Bumpkins.",
  "krakenIntro.noMoreTentacles":
    "Tu as collecté tous les tentacules de la semaine. Gardons un œil sur lui, je suis sûr que la faim reviendra.",
  "krakenIntro.gotIt": "J'ai compris!",
  "krakenIntro.appetiteChanges": "L'appétit du Kraken change constamment.",
  "krakenIntro.currentHunger":
    "En ce moment, il a une faim pour.... Ouf, c'est mieux que les Bumpkins.",
  "krakenIntro.catchInstruction":
    "Rends-toi à ton lieu de pêche et essaie d'attraper la bête!",
};

const shopItems: Record<ShopItems, string> = {
  "betty.post.sale.one": "Eh bien, bienvenue de retour.",
  "betty.post.sale.two":
    "Tu as aidé à résoudre la pénurie de récoltes et les prix sont revenus à la normale.",
  "betty.post.sale.three":
    "Il est temps de passer à des cultures plus grandes et meilleures!",
  "betty.welcome": "Bienvenue sur mon marché. Que souhaites-tu faire?",
  "betty.buySeeds": "Acheter des graines",
  "betty.sellCrops": "Vendre des récoltes",
};

const showingFarm: Record<ShowingFarm, string> = {
  "showing.farm": "Affichage sur la ferme",
  "showing.wallet": "Dans le portefeuille",
};

const snorklerDialogues: Record<SnorklerDialogues, string> = {
  "snorkler.vastOcean": "C'est un vaste océan!",
  "snorkler.goldBeneath":
    "Il doit y avoir de l'or quelque part sous la surface.",
};

const somethingWentWrong: Record<SomethingWentWrong, string> = {
  "somethingWentWrong.supportTeam": "équipe de support",
  "somethingWentWrong.jumpingOver": "ou en sautant sur notre",
  "somethingWentWrong.askingCommunity": "et en demandant à notre communauté.",
};

const specialEvent: Record<SpecialEvent, string> = {
  "special.event.easterIntro":
    "Oh non, mes 6 lapins ont encore disparu.... ils doivent chercher de la nourriture. Pouvez-vous m'aider à les retrouver ? Ils ressemblent à d'autres lapins mais ont un éclat unique. Cliquez dessus pour les capturer.",
  "special.event.rabbitsMissing": "Lapins disparus",
  "special.event.link": "Lien Airdrop",
  "special.event.claimForm":
    "Veuillez remplir le formulaire ci-dessous pour réclamer votre airdrop.",
  "special.event.airdropHandling":
    "Les parachutages sont gérés en externe et peuvent prendre quelques jours pour arriver.",
  "special.event.walletRequired": "Portefeuille requis",
  "special.event.web3Wallet":
    "Un portefeuille Web3 est requis pour cet événement car il contient un Airdrop.",
  "special.event.airdrop": "Airdrop",
  "special.event.finishedLabel": "Événement terminé",
  "special.event.finished":
    "Cet événement est terminé. Restez à l'écoute pour les événements futurs !",
  "special.event.ineligible":
    "Il n'y a aucun travail à faire pour le moment, merci d'être passé !",
};

const statements: Record<Statements, string> = {
  "statements.adventure": "Commencez votre aventure!",
  "statements.auctioneer.one":
    "J'ai voyagé loin et large à travers Sunflower Land à la recherche de trésors exotiques à ramener à mes compagnons Bumpkins.",
  "statements.auctioneer.two":
    "Ne manquez pas l'une des enchères où un coup de mon puissant marteau peut transformer vos ressources durement gagnées en merveilles rares et frappées!",
  "statements.beta.one":
    "La version bêta n'est accessible qu'à nos fermiers OG.",
  "statements.beta.two":
    "Restez à l'écoute pour les mises à jour. Nous serons bientôt en direct!",
  "statements.better.luck": "Meilleure chance la prochaine fois!",
  "statements.blacklist.one":
    "Le système de détection anti-bot et multi-comptes a repéré un comportement étrange. Les actions ont été restreintes.",
  "statements.blacklist.two":
    "Veuillez soumettre un ticket avec des détails et nous vous répondrons.",
  "statements.clickBottle":
    "Cliquez sur une bouteille pour l'ajouter à votre supposition",
  "statements.clock.one":
    "Oh oh, il semble que votre horloge ne soit pas synchronisée avec le jeu. Réglez la date et l'heure sur automatique pour éviter les interruptions",
  "statements.clock.two":
    "Besoin d'aide pour synchroniser votre horloge ? Consultez notre guide!",
  "statements.conversation.one": "J'ai quelque chose pour vous!",
  "statements.cooldown":
    "Pour protéger la communauté, nous exigeons une période d'attente de 2 semaines avant que cette ferme ne puisse être accessible.",
  "statements.docs": "Allez dans la documentation",
  "statements.dontRefresh": "Ne rafraîchissez pas votre navigateur!",
  "statements.guide.one": "Allez dans le guide",
  "statements.guide.two": "Consultez ce guide pour vous aider à démarrer.",
  "statements.jigger.one":
    "Vous serez redirigé vers un service tiers pour prendre un selfie rapide. Ne partagez jamais d'informations personnelles ou de données crypto.",
  "statements.jigger.two": "Vous avez échoué au Jigger Proof of Humanity.",
  "statements.jigger.three":
    "Vous pouvez continuer à jouer, mais certaines actions seront restreintes tant que vous serez en cours de vérification.",
  "statements.jigger.four":
    "Veuillez contacter support@usejigger.com si vous pensez que c'était une erreur.",
  "statements.jigger.five":
    "Votre preuve d'humanité est toujours en cours de traitement par Jigger. Cela peut prendre jusqu'à 2 heures.",
  "statements.jigger.six":
    "Le système de détection multi-comptes a repéré un comportement étrange.",
  "statements.lvlUp": "Nourrissez votre Bumpkin pour monter de niveau",
  "statements.maintenance":
    "De nouvelles choses arrivent ! Merci pour votre patience, le jeu sera bientôt de retour en ligne.",
  "statements.minted": "Les gobelins ont fabriqué votre ",
  "statements.minting":
    "Veuillez patienter pendant que votre objet est frappé sur la Blockchain.",
  "statements.mutant.chicken":
    "Félicitations, votre poulet a pondu un poulet mutant très rare!",
  "statements.news":
    "Recevez les dernières nouvelles, effectuez des corvées et nourrissez votre Bumpkin.",
  "statements.ohNo": "Oh non ! Quelque chose s'est mal passé!",
  "statements.openGuide": "Ouvrir le guide",
  "statements.patience": "Merci pour votre patience.",
  "statements.potionRule.one":
    "Objectif : Découvrez la combinaison. Vous avez 3 essais pour y parvenir. Le jeu se terminera si vous avez une potion parfaite ou si vous manquez d'essais.",
  "statements.potionRule.two":
    "Choisissez une combinaison de potions et tentez de les mélanger.",
  "statements.potionRule.three":
    "Ajustez votre prochaine combinaison en fonction des commentaires donnés.",
  "statements.potionRule.four":
    "Lorsque le jeu est terminé, le score de votre dernière tentative aidera à déterminer votre récompense.",
  "statements.potionRule.five": "Une potion parfaite à la position parfaite",
  "statements.potionRule.six": "Bonne potion mais mauvaise position",
  "statements.potionRule.seven": "Oops, mauvaise potion",
  "statements.sflLim.one": "Vous avez atteint la limite quotidienne de SFL.",
  "statements.sflLim.two":
    "Vous pouvez continuer à jouer, mais vous devrez attendre demain pour vous resynchroniser.",
  "statements.sniped": "Oh non ! Un autre joueur a acheté ce trade avant vous.",
  "statements.switchNetwork": "Ajouter ou changer de réseau",
  "statements.sync":
    "Veuillez patienter pendant que nous synchronisons toutes vos données sur la chaîne.",
  "statements.tapCont": "Appuyez pour continuer",
  "statements.price.change":
    "Oh non ! Il semble que le prix ait changé. Veuillez réessayer !",
  "statements.tutorial.one":
    "Le bateau vous emmènera entre les îles où vous pourrez découvrir de nouveaux territoires et des aventures passionnantes.",
  "statements.tutorial.two":
    "Beaucoup d'îles sont éloignées et nécessiteront un Bumpkin expérimenté avant de pouvoir les visiter.",
  "statements.tutorial.three":
    "Votre aventure commence maintenant, jusqu'où vous explorez... c'est à vous de décider.",
  "statements.visit.firePit":
    "Visitez le foyer pour cuisiner de la nourriture et nourrir votre Bumpkin.",
  "statements.wishing.well.info.four": "Fournissez de la liquidité",
  "statements.wishing.well.info.five": " dans le jeu",
  "statements.wishing.well.info.six": "Fournir de la liquidité",
  "statements.wishing.well.worthwell":
    ENGLISH_TERMS["statements.wishing.well.worthwell"],
  "statements.wishing.well.look.like":
    "Il semble que vous ne fournissiez pas encore de liquidité.",
  "statements.wishing.well.lucky": "Voyons à quel point vous êtes chanceux!",
  "statements.wrongChain.one": "Consultez ce guide pour vous connecter.",
  "statements.feed.bumpkin.one":
    "Vous n'avez pas de nourriture dans votre inventaire.",
  "statements.feed.bumpkin.two":
    "Vous devrez cuisiner de la nourriture pour nourrir votre Bumpkin.",
  "statements.empty.chest":
    "Votre coffre est vide, découvrez des objets rares aujourd'hui!",
  "statements.chest.captcha": "Appuyez sur le coffre pour l'ouvrir",
  "statements.frankie.plaza":
    "Rendez-vous à la place pour fabriquer des décorations rares!",
  "statements.blacksmith.plaza":
    "Rendez-vous à la Plaza pour plus d'objets rares.",
  "statements.water.well.needed.one":
    "Un puits d'eau supplémentaire est nécessaire.",
  "statements.water.well.needed.two":
    "Pour soutenir davantage de cultures, construisez un puits.",
  "statements.soldOut": "Épuisé",
  "statements.soldOutWearables": "Voir les articles épuisés",
  "statements.craft.composter": "Fabriquez au composteur",
  "statements.wallet.to.inventory.transfer":
    "Déposez des objets de votre portefeuille",
  "statements.crop.water": "Ces cultures ont besoin d'eau!",
  "statements.daily.limit": "Limite quotidienne: ",
  "statements.sure.buy": "Êtes-vous sûr de vouloir acheter ",
  "statements.perplayer": "par joueur",
  "statements.minted.goToChest":
    "Rendez-vous à votre coffre et placez-le sur votre île",
  "statements.minted.withdrawAfterMint":
    "Vous pourrez retirer votre objet une fois la minting terminée",
  "statements.startgame": "Commencer une nouvelle partie",

  "statements.session.expired":
    "Il semble que votre session ait expiré. Veuillez actualiser la page pour continuer à jouer.",
  "statements.translation.joinDiscord":
    ENGLISH_TERMS["statements.translation.joinDiscord"],
};

const stopGoblin: Record<StopGoblin, string> = {
  "stopGoblin.stop.goblin": "Arrêtez les Gobelins!",
  "stopGoblin.stop.moon": "Arrêtez les Chercheurs de Lune!",
  "stopGoblin.tap.one":
    "Touchez les Chercheurs de Lune avant qu'ils ne volent vos ressources",
  "stopGoblin.tap.two":
    "Touchez les Gobelins avant qu'ils ne mangent votre nourriture",
  "stopGoblin.left": "Tentatives restantes: {{attemptsLeft}}",
};

const swarming: Record<Swarming, string> = {
  "swarming.tooLongToFarm":
    "Faites attention, vous avez mis trop de temps pour cultiver vos cultures!",
  "swarming.goblinsTakenOver":
    "Les Gobelins ont envahi votre ferme. Vous devez attendre qu'ils partent.",
};

const tieBreaker: Record<TieBreaker, string> = {
  "tieBreaker.tiebreaker": "Tiebreaker",
  "tieBreaker.closeBid":
    "Si près ! Vous avez mis exactement les mêmes ressources que l'offre de {{supply}}. Le tie-breaker est choisi en fonction du Bumpkin qui a le plus d'expérience. Malheureusement, vous avez perdu.",
  "tieBreaker.betterLuck":
    "Il est temps de manger plus de gâteaux ! Meilleure chance la prochaine fois.",
  "tieBreaker.refund": "Remboursement de ressources",
};

const toolDescriptions: Record<ToolDescriptions, string> = {
  // Outils
  "description.axe": "Utilisé pour collecter du Wood",
  "description.pickaxe": "Utilisé pour collecter de la pierre",
  "description.stone.pickaxe": "Utilisé pour collecter du fer",
  "description.iron.pickaxe": "Utilisé pour collecter de l'or",
  "description.gold.pickaxe":
    "Utilisé pour collecter des Crimstones et Sunstones",
  "description.rod": "Utilisé pour attraper des poissons",
  "description.rusty.shovel":
    "Utilisé pour enlever des bâtiments et des objets à collecter",
  "description.shovel": "Planter et récolter des cultures.",
  "description.sand.shovel": "Utilisé pour creuser des trésors",
  "description.sand.drill":
    "Creusez profondément pour trouver des trésors peu communs ou rares",
  "description.oil.drill": ENGLISH_TERMS["description.oil.drill"],
};

const trader: Record<Trader, string> = {
  "trader.you.pay": "Vous payez",
  "trader.price.per.unit": "Prix par unité",
  "trader.goblin.fee": "Frais de gobelin",
  "trader.they.receive": "Ils reçoivent",
  "trader.seller.receives": "Le vendeur reçoit",
  "trader.buyer.pays": "L'acheteur paie",
  "trader.cancel.trade": "Annuler l'échange",
  "trader.you.receive": "Vous recevez",
  "trader.PoH":
    "Une preuve d'humanité est nécessaire pour cette fonctionnalité. Veuillez prendre un selfie rapide.",
  "trader.start.verification": "Démarrer la vérification",
};

const transactionTerms: Record<TransactionTerms, string> = {
  "transaction.starterOffer": ENGLISH_TERMS["transaction.starterOffer"],
  "transaction.t&c.one":
    "Acceptez les termes et conditions pour vous connecter à Sunflower Land.",
  "transaction.t&c.two": "Accepter les termes et conditions",
  "transaction.mintFarm": "Votre ferme a été mintée!",
  "transaction.farm.ready": "Votre ferme sera prête dans",
  "transaction.networkFeeRequired":
    "Pour sécuriser vos NFT sur la Blockchain, des frais de réseau minimes sont nécessaires.",
  "transaction.estimated.fee": "Frais estimés",
  "transaction.payCardCash": "Payer par carte/espèces",
  "transaction.creditCard": "*Des frais de carte de crédit s'appliquent",
  "transaction.rejected": "Transaction rejetée!",
  "transaction.message0":
    "Vous devez accepter la transaction dans la fenêtre contextuelle de MetaMask pour continuer.",
  "transaction.noFee":
    "Cette demande ne déclenchera pas de transaction blockchain ni de frais de gaz.",
  "transaction.chooseDonationGame":
    "Merci pour votre soutien ! Veuillez choisir le jeu auquel vous souhaitez faire un don.",
  "transaction.minblockbucks": "Minimum 5 Block Bucks",
  "transaction.payCash": "Payer en espèces",
  "transaction.matic": "Matic",
  "transaction.payMatic": "Payer avec MATIC",
  "transaction.storeBlockBucks":
    "Les Block Bucks seront stockés sur votre ferme.",
  "transaction.excludeFees":
    "*Les prix n'incluent pas les frais de transaction.",
  "transaction.storeProgress.blockchain.one":
    "Souhaitez-vous stocker votre progression sur la Blockchain?",
  "transaction.storeProgress.blockchain.two":
    "Stocker des données sur la Blockchain ne recharge pas les magasins.",
  "transaction.storeProgress": "Stockez la progression",
  "transaction.storeProgress.chain": "Stockez la progression sur la chaîne",
  "transaction.storeProgress.success":
    "Hourra ! Vos objets sont sécurisés sur la Blockchain!",
  "transaction.trade.congrats": "Félicitations, votre transaction a réussi",
  "transaction.processing": "Traitement de votre transaction.",
  "transaction.pleaseWait":
    "Veuillez attendre que votre transaction soit confirmée par la Blockchain.",
  "transaction.unconfirmed.reset":
    "Après 5 minutes, toutes les transactions non confirmées seront réinitialisées.",
  "transaction.withdraw.one": "Retrait de",
  "transaction.withdraw.sent": "Vos objets/tokens ont été envoyés à",
  "transaction.withdraw.view": "Vous pouvez voir vos objets sur",
  "transaction.openSea": "OpenSea",
  "transaction.withdraw.four":
    "Vous pouvez voir vos tokens en important le Token SFL dans votre portefeuille.",
  "transaction.withdraw.five": "Importer le Token SFL dans MetaMask",
  "transaction.displayItems":
    "Veuillez noter qu'OpenSea peut mettre jusqu'à 30 minutes pour afficher vos objets. Vous pouvez également voir vos objets sur",
  "transaction.withdraw.polygon": "PolygonScan",
  "transaction.id": "ID de transaction",
  "transaction.termsOfService": "Acceptez les conditions d'utilisation",
  "transaction.termsOfService.one":
    "Pour acheter votre ferme, vous devez accepter les conditions d'utilisation de Sunflower Land.",
  "transaction.termsOfService.two":
    "Cette étape vous ramènera à votre nouveau portefeuille de séquence pour accepter les conditions d'utilisation.",
  "transaction.buy.BlockBucks": "Acheter des Block Bucks",
};

const transfer: Record<Transfer, string> = {
  "transfer.sure.adress":
    "Veuillez vous assurer que l'adresse que vous avez fournie appartient à la Blockchain Polygon, qu'elle est correcte et qu'elle vous appartient. Il n'y a aucune récupération possible en cas d'adresse incorrecte.",
  "transfer.Account":
    "Votre compte n°{{farmID}} a été transféré à {{receivingAddress}} !",
  "transfer.Farm": "Transfert de votre ferme!",
  "transfer.Refresh": "Ne rafraîchissez pas ce navigateur",
  "transfer.Taccount": "Transférer votre compte",
  "transfer.address": "Adresse du portefeuille: ",
};

const treasureModal: Record<TreasureModal, string> = {
  "treasureModal.noShovelTitle": "Pas de pelle à sable!",
  "treasureModal.needShovel":
    "Vous devez avoir une pelle à sable équipée pour pouvoir creuser à la recherche de trésors!",
  "treasureModal.purchaseShovel":
    "Si vous devez en acheter une, vous pouvez vous rendre à la boutique aux trésors à l'extrémité sud de l'île.",
  "treasureModal.gotIt": "Compris",
  "treasureModal.maxHolesTitle": "Nombre maximum de trous atteint!",
  "treasureModal.saveTreasure":
    "Gardez un peu de trésor pour le reste d'entre nous!",
  "treasureModal.comeBackTomorrow":
    "Revenez demain pour chercher plus de trésors.",
  "treasureModal.drilling": "Forage en cours",
};

const tutorialPage: Record<TutorialPage, string> = {
  "tutorial.pageOne.text1":
    "Ce menu vous montrera les niveaux requis pour débloquer de nouveaux bâtiments.",
  "tutorial.pageOne.text2":
    "Certains d'entre eux peuvent être construits plusieurs fois une fois que vous avez atteint un certain niveau.",
  "tutorial.pageTwo.text1":
    "Les bâtiments sont un moyen important de progresser dans le jeu car ils vous aideront à vous développer et à évoluer.",
  "tutorial.pageTwo.text2":
    "Commençons par augmenter le niveau de notre Bumpkin pour obtenir l'établi et en apprendre davantage sur les outils.",
};

const username: Record<Username, string> = {
  "username.tooShort": ENGLISH_TERMS["username.tooShort"],
  "username.tooLong": ENGLISH_TERMS["username.tooLong"],
  "username.invalidChar": ENGLISH_TERMS["username.invalidChar"],
  "username.startWithLetter": ENGLISH_TERMS["username.startWithLetter"],
};

const visitislandEnter: Record<VisitislandEnter, string> = {
  "visitIsland.enterIslandId": "Entrez l'ID de l'île",
  "visitIsland.visit": "Visiter",
};

const visitislandNotFound: Record<VisitislandNotFound, string> = {
  "visitislandNotFound.title": "Île non trouvée!",
};

const wallet: Record<Wallet, string> = {
  "wallet.connect": "Connectez votre portefeuille",
  "wallet.linkWeb3": "Lier un portefeuille Web3",
  "wallet.setupWeb3":
    "Pour accéder à cette fonctionnalité, vous devez d'abord configurer un portefeuille Web3",
  "wallet.wrongWallet": "Mauvais portefeuille",
  "wallet.connectedWrongWallet": "Vous êtes connecté au mauvais portefeuille",
  "wallet.missingNFT": "NFT manquant",
  "wallet.requireFarmNFT":
    "Certaines actions nécessitent un NFT de ferme. Cela permet de garder tous vos objets sécurisés sur la blockchain",
  "wallet.uniqueFarmNFT":
    "Un NFT de ferme unique sera créé pour stocker vos progrès",
  "wallet.mintFreeNFT": "Mintez votre NFT gratuit",
  "wallet.wrongChain": "Mauvaise chaîne",
  "wallet.walletAlreadyLinked": "Portefeuille déjà lié",
  "wallet.linkAnotherWallet": "Veuillez lier un autre portefeuille",
  "wallet.transferFarm":
    "Veuillez transférer la ferme vers un autre portefeuille pour créer le nouveau compte",
  "wallet.signRequest": "Signer",
  "wallet.signRequestInWallet":
    "Signez la demande dans votre portefeuille pour continuer",
};

const warningTerms: Record<WarningTerms, string> = {
  "warning.noAxe": "Aucune hache sélectionnée!",
  "warning.chat.maxCharacters": "Max de caractères",
  "warning.chat.noSpecialCharacters": "Pas de caractères spéciaux",
  "warning.level.required": "Niveau {{lvl}} requis",
  "warning.hoarding.message":
    "Êtes-vous {{indefiniteArticle}} collectionneur de {{itemName}} ?",
  // indefiniteArticle: 'a' or 'an' depending if first letter is vowel.
  // If this is not used in your language, leave the `{{indefiniteArticle}}` part out
  "warning.hoarding.indefiniteArticle.a": "Un", // Leave this blank if not needed
  "warning.hoarding.indefiniteArticle.an": "Une", // Leave this blank if not needed
  "warning.hoarding.one":
    "On dit que les Goblins sont connus pour attaquer les fermes qui regorgent de ressources.",
  "warning.hoarding.two":
    "Pour vous protéger et garder ces précieuses ressources en sécurité, veuillez les synchroniser sur la chaîne avant d'en collecter davantage de",
  "travelRequirement.notice":
    "Avant de voyager, vous devez augmenter de niveau.",
};

const welcomeTerms: Record<WelcomeTerms, string> = {
  "welcome.createAccount": "Créer un compte",
  "welcome.creatingAccount": "Création de votre compte",
  "welcome.email": "Email et connexion sociale",
  "welcome.login": "Connexion",
  "welcome.needHelp": "Besoin d'aide?",
  "welcome.otherWallets": "Autres portefeuilles",
  "welcome.signingIn": "Connexion en cours",
  "welcome.signIn.Message":
    "Acceptez la demande de signature dans votre portefeuille de navigateur pour vous connecter.",
  "welcome.takeover.ownership":
    "Il semble que vous soyez nouveau dans Sunflower Land et que vous ayez revendiqué la propriété du compte d'un autre joueur.",
  "welcome.promo": "Ajouter un code promo",
  "welcome.offline":
    "Salut Bumpkin, il semble que tu ne sois pas en ligne. Veuillez vérifier votre connexion réseau.",
};

const winner: Record<Winner, string> = {
  "winner.mintTime":
    "Vous avez 24 heures pour mettre en circulation votre récompense.",
  "winner.mintTime.one": "Aucun objet disponible à fabriquer!",
};

const wishingWellTerms: Record<WishingWell, string> = {
  "wishingWell.makeWish":
    "Exaucez un nouveau vœu et voyez à quel point vous êtes chanceux!",
  "wishingWell.newWish":
    "Un nouveau vœu a été fait pour vous en fonction de votre solde actuel de jetons LP!",
  "wishingWell.noReward":
    "Vous n'avez aucune récompense disponible ! La liquidité doit être détenue pendant 3 jours pour obtenir une récompense!",
  "wishingWell.wish.lucky":
    "Accordez un nouveau souhait et voyez à quel point vous êtes chanceux!",
  "wishingWell.sflRewardsReceived": "Tu as reçu {{reward}} SFL !",
  "wishingWell.wish.grantTime": "Il est temps d'exaucer votre vœu!",
  "wishingWell.wish.granted": "Votre vœu a été exaucé.",
  "wishingWell.wish.made": "Vous avez fait un vœu!",
  "wishingWell.wish.timeTillNextWish":
    "Temps jusqu'au prochain vœu: {{nextWishTime}}",
  "wishingWell.wish.thanksForSupport":
    "Merci de soutenir le projet et de faire un vœu.",
  "wishingWell.wish.comeBackAfter":
    "Reviens dans {{nextWishTime}} pour voir à quel point tu as été chanceux !",
  "wishingWell.wish.warning.one":
    "Sachez que seuls les jetons LP que vous déteniez au moment où le vœu a été fait seront pris en compte lorsque le vœu sera exaucé.",
  "wishingWell.wish.warning.two":
    "Si vous retirez votre liquidité pendant cette période, vous ne recevrez aucune récompense.",
  "wishingWell.info.one":
    "Le puits à vœux est un endroit magique où des récompenses SFL peuvent être obtenues simplement en faisant un vœu!",
  "wishingWell.info.two":
    "Les vœux sont accordés aux fermiers qui fournissent de la liquidité dans le jeu.",
  "wishingWell.info.three":
    "Il semble que vous ayez ces jetons LP magiques dans votre portefeuille!",
  "wishingWell.noLiquidity":
    "Il semble que vous ne fournissiez pas encore de liquidité. Plus d'informations,",
  "wishingWell.rewardsInWell": "Montant des récompenses dans le puits",
  "wishingWell.luck": "Voyons à quel point vous êtes chanceux!",

  "wishingWell.moreInfo": "Plus d'informations",
};

const withdraw: Record<Withdraw, string> = {
  "withdraw.proof":
    "La preuve d'humanité est nécessaire pour cette fonctionnalité. Veuillez prendre rapidement un selfie.",
  "withdraw.verification": "Démarrer la vérification",
  "withdraw.unsave": "Tout progrès non sauvegardé sera perdu.",
  "withdraw.sync":
    "Vous ne pouvez retirer que les objets que vous avez synchronisés sur la blockchain.",
  "withdraw.available": "Disponible le 9 mai",
  "withdraw.sfl.available": "SFL est disponible sur la chaîne",
  "withdraw.send.wallet": "Envoyé à votre portefeuille",
  "withdraw.choose": "Choisissez le montant à retirer",
  "withdraw.receive": "Vous recevrez: {{sflReceived}}",
  "withdraw.select.item": "Sélectionnez les objets à retirer",
  "withdraw.opensea":
    "Une fois retirés, vous pourrez voir vos objets sur OpenSea.",
  "withdraw.budRestricted": "Utilisé dans la boîte à bud d'aujourd'hui.",
  "withdraw.restricted":
    "Certains objets ne peuvent pas être retirés. D'autres objets peuvent être restreints lorsque",
  "withdraw.bumpkin.wearing":
    "Votre Bumpkin porte actuellement les objets suivants qui ne peuvent pas être retirés. Vous devrez les déséquiper avant de pouvoir les retirer.",
  "withdraw.bumpkin.sure.withdraw":
    "Êtes-vous sûr de vouloir retirer votre Bumpkin?",
  "withdraw.bumpkin.closed": ENGLISH_TERMS["withdraw.bumpkin.closed"],
  "withdraw.bumpkin.closing": ENGLISH_TERMS["withdraw.bumpkin.closing"],
  "withdraw.buds": "Sélectionnez des Buds à retirer",
};

const world: Record<World, string> = {
  "world.intro.one":
    "Salut Bumpkin, bienvenue au Pumpkin Plaza. Ici, des Bumpkins du monde entier se réunissent pour échanger, effectuer des livraisons et jouer à des mini-jeux.",
  "world.intro.two":
    "Explorez la Plaza et trouvez des Bumpkins qui attendent vos livraisons. En échange, ils vous donneront des récompenses !",
  "world.intro.delivery": ENGLISH_TERMS["world.intro.delivery"],
  "world.intro.levelUpToTravel": ENGLISH_TERMS["world.intro.levelUpToTravel"],
  "world.intro.find": ENGLISH_TERMS["world.intro.find"],
  "world.intro.findNPC": ENGLISH_TERMS["world.intro.findNPC"],
  "world.intro.missingDelivery": ENGLISH_TERMS["world.intro.missingDelivery"],
  "world.intro.visit":
    "Visitez les PNJ et accomplissez des livraisons pour gagner des SFL, Coins et des récompenses rares.",
  "world.intro.craft":
    "Fabriquez des objets de collection rares, des vêtements et des décorations dans les différentes boutiques.",
  "world.intro.carf.limited":
    "Dépêchez-vous, les articles ne sont disponibles que pour une durée limitée!",
  "world.intro.trade":
    "Échangez des ressources avec d'autres joueurs. Pour interagir avec un joueur, approchez-vous et cliquez sur lui.",
  "world.intro.auction":
    "Préparez vos ressources et visitez la Maison des Enchères pour concourir avec d'autres joueurs pour des objets de collection rares!",
  "world.intro.four":
    "Pour déplacer votre Bumpkin, utilisez les touches fléchées du clavier.",
  "world.intro.five": "Sur écran tactile, utilisez le joystick.",
  "world.intro.six":
    "Pour interagir avec un Bumpkin ou un objet, approchez-vous et cliquez dessus.",
  "world.intro.seven":
    "Aucun harcèlement, injure ou intimidation. Merci de respecter les autres.",
  "world.plaza": "Plaza",
  "world.beach": "Beach",
  "world.retreat": "Retreat",
  "world.woodlands": ENGLISH_TERMS["world.woodlands"],
  "world.home": "Home",
  "world.kingdom": "Kingdom",
  "world.travelTo": ENGLISH_TERMS["world.travelTo"],
};

const wornDescription: Record<WornDescription, string> = {
  "worm.earthworm": "Un ver qui attire les petits poissons.",
  "worm.grub": "Un ver juteux - parfait pour les poissons avancés.",
  "worm.redWiggler": "Un ver exotique qui attire les poissons rares.",
};

const trading: Record<Trading, string> = {
  "trading.select.resources":
    "Sélectionnez des ressources pour afficher les listes",
  "trading.no.listings": "Aucune annonce trouvée",
  "trading.listing.congrats":
    " Félicitations, vous venez de mettre vos objets en vente !",
  "trading.listing.deleted": "Votre annonce a été supprimée",
  "trading.listing.fulfilled": "L'échange a été réalisé",
  "trading.your.listing": "Votre annonce",
  "trading.you.receive": "Vous recevez",
  "trading.burned": "est brûlé.",
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
  "gameOptions.howToPlay": "Comment jouer? (En reconstruction)",
  "gameOptions.farmId": ENGLISH_TERMS["gameOptions.farmId"],
  "gameOptions.logout": "Déconnexion",
  "gameOptions.confirmLogout": "Êtes-vous sûr de vouloir vous déconnecter?",

  // Amoy Actions
  "gameOptions.amoyActions": ENGLISH_TERMS["gameOptions.amoyActions"],
  "gameOptions.amoyActions.timeMachine": "Machine à remonter le temps",

  // Blockchain Settings
  "gameOptions.blockchainSettings":
    ENGLISH_TERMS["gameOptions.blockchainSettings"],
  "gameOptions.blockchainSettings.refreshChain":
    ENGLISH_TERMS["gameOptions.blockchainSettings.refreshChain"],
  "gameOptions.blockchainSettings.storeOnChain": "Stockage sur la chaîne",
  "gameOptions.blockchainSettings.swapMaticForSFL":
    "Échanger du MATIC contre du SFL",
  "gameOptions.blockchainSettings.transferOwnership": "Transfert de propriété",

  // General Settings
  "gameOptions.generalSettings": ENGLISH_TERMS["gameOptions.generalSettings"],
  "gameOptions.generalSettings.connectDiscord":
    ENGLISH_TERMS["gameOptions.generalSettings.connectDiscord"],
  "gameOptions.generalSettings.assignRole":
    ENGLISH_TERMS["gameOptions.generalSettings.assignRole"],
  "gameOptions.generalSettings.changeLanguage": "Changer de Langue",
  "gameOptions.generalSettings.darkMode":
    ENGLISH_TERMS["gameOptions.generalSettings.darkMode"],
  "gameOptions.generalSettings.lightMode":
    ENGLISH_TERMS["gameOptions.generalSettings.lightMode"],
  "gameOptions.generalSettings.font":
    ENGLISH_TERMS["gameOptions.generalSettings.font"],
  "gameOptions.generalSettings.disableAnimations": "Désactiver les animations",
  "gameOptions.generalSettings.enableAnimations": "Activer les animations",
  "gameOptions.generalSettings.share": "Partager",
  "gameOptions.generalSettings.appearance": "Appearance Settings",

  // Plaza Settings
  "gameOptions.plazaSettings": "Paramètres de la Place",
  "gameOptions.plazaSettings.title.mutedPlayers": "Joueurs Muettes",
  "gameOptions.plazaSettings.title.keybinds": "Raccourcis",
  "gameOptions.plazaSettings.mutedPlayers.description":
    "Au cas où vous auriez muet certains joueurs en utilisant la commande /mute, vous pouvez les voir ici et les démuter si vous le souhaitez.",
  "gameOptions.plazaSettings.keybinds.description":
    "Besoin de savoir quels raccourcis sont disponibles ? Consultez-les ici.",
  "gameOptions.plazaSettings.noMutedPlayers": "Vous n'avez aucun joueur muet.",
  "gameOptions.plazaSettings.changeServer": "Changer de serveur",
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

export const FRENCH_TERMS: Record<TranslationKeys, string> = {
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
  ...trading,
  ...restrictionReason,
  ...removeCropMachine,
  ...easterEggTerms,
};
