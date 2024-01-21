import {
  AchievementsTerms,
  Action,
  AddSFL,
  AvailableSeeds,
  Base,
  Beach,
  BeachLuck,
  BirdiePlaza,
  BoostDescriptions,
  BoostEffectDescriptions,
  BountyDescription,
  BuildingDescriptions,
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
  CropFruitDescriptions,
  Deliveryitem,
  DefaultDialogue,
  DecorationDescriptions,
  Delivery,
  DeliveryHelp,
  DepositWallet,
  Detail,
  DiscordBonus,
  Donation,
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
  Flowerbedguide,
  FoodDescriptions,
  GameDescriptions,
  GameTerms,
  GarbageCollector,
  GeneralTerms,
  GetContent,
  GetInputErrorMessage,
  GOBLIN_MESSAGES,
  GoldPassModal,
  GoldTooth,
  GuideTerms,
  GrubShop,
  HalveningCountdown,
  Harvestflower,
  HarvestBeeHive,
  HayseedHankPlaza,
  HayseedHankV2,
  HeliosSunflower,
  HenHouseTerms,
  HowToFarm,
  HowToSync,
  HowToUpgrade,
  Islandupgrade,
  InteractableModals,
  Intro,
  IntroPage,
  IslandName,
  IslandNotFound,
  Kick,
  Kicked,
  LandscapeTerms,
  LetsGo,
  LevelUpMessages,
  Loser,
  LostSunflorian,
  ModalDescription,
  Mute,
  Noaccount,
  NoBumpkin,
  NoTownCenter,
  NotOnDiscordServer,
  NPC_MESSAGE,
  Npc,
  NpcDialogues,
  NyeButton,
  ObsessionDialogue,
  Offer,
  Onboarding,
  OnCollectReward,
  OrderHelp,
  Parsnip,
  Pending,
  PersonHood,
  PirateQuest,
  Pickserver,
  PlazaSettings,
  PlayerTrade,
  Portal,
  PurchaseableBaitTranslation,
  Quest,
  Questions,
  Reaction,
  Refunded,
  RemoveKuebiko,
  Resale,
  Restock,
  RetreatTerms,
  RewardTerms,
  RulesGameStart,
  RulesTerms,
  SceneDialogueKey,
  SeasonTerms,
  Session,
  SettingsMenu,
  Share,
  SharkBumpkinDialogues,
  Shelly,
  ShellyDialogue,
  ShopItems,
  ShowingFarm,
  SnorklerDialogues,
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
  WarningTerms,
  WelcomeTerms,
  Winner,
  Withdraw,
  WornDescription,
  World,
} from "./types";

const generalTerms: Record<GeneralTerms, string> = {
  "2x.sale": "Vente x2",
  "action.deposit": "Dépôt",
  add: "Ajouter",
  "add.liquidity": "Ajouter de la liquidité",
  "alr.bought": "Déjà acheté",
  "alr.claim": "Déjà réclamé !",
  "alr.completed": "Déjà terminé",
  "alr.crafted": "Déjà fabriqué !",
  "alr.minted": "Déjà minté !",
  "card.cash": "Carte/Argent liquide",
  "claim.skill": "Réclamation de compétence",
  "coming.soon": "Bientôt disponible",
  "copy.adress": "Copie Addresse",
  danger: "Danger",
  "drafting.select": "Sélectionnez un article à lister",
  "drafting.noitem": "Aucun article disponible à lister",
  "drafting.trade.detail": "Détails de l'échange",
  "easter.eggs": "Œufs de Pâques",
  empty: "Vide",
  "farm.storage": "Stockage de la Ferme",
  "feed.bumpkin": "Nourrir Bumpkin",
  "fish.caught": "Poissons attrapés",
  "free.trade": "Libre-échange",
  "grant.wish": "Accorder un nouveau vœu",
  "go.home": "Vers Maison",
  "goblin.delivery":
    "Les gobelins gardent leur part de la livraison dans le trésor. Voir aussi sur",
  "hungry?": "Faim?",
  "land.id": "ID du terrain",
  "last.updated": "Dernière mise à jour : ",
  "lets.go": "C'est parti !",
  "list.trade": "Lister au commerce",
  "make.wish": "Faire un Vœu",
  "making.wish": "Faire un vœu",
  "no.mail": "Pas de courrier",
  "no.limits.exceeded": "Aucune limite dépassée",
  "no.thanks": "Non merci",
  "yes.please": "Oui S'il vous plait",
  "ocean.fishing": "Pêche en mer",
  "open.gift": "Ouvrir un Cadeau",
  "pass.required": "Pass requis",
  "place.map": "Placer sur la carte",
  "placing.bid": "Placer une enchère",
  "providing.liquidity": "Fournir de la liquidité",
  "ready.trade": "Prêt à échanger ?",
  "read.more": "Lire la suite",
  "remaining.trades": "Échanges restants",
  "reward.discovered": "Récompense Découverte",
  "select.resource": "Sélectionnez votre ressource :",
  "sell.all": "Tout vendre",
  "sell.one": "Vendre 1",
  "sell.ten": "Vendre 10",
  "skip.order": "Passer la commande",
  "sound.effects": "Effets sonores : ",
  "support.team": "Équipe de support",
  submit: "Soumettre",
  submitting: "Soumission",
  "total.price": "Prix total : ",
  "trash.collection": "Collecte des déchets",
  "try.again": "Réessayer",
  "unlock.land": "Débloquer plus de terrain",
  "use.craft": "Utilisé pour fabriquer des objets",
  "chicken.description": "Utilisé pour pondre des œufs",
  "honey.description": "Utilisé pour sucrer vos plats",
  "wildMushroom.description": "Utilisé pour cuisiner des recettes basiques",
  "magicMushroom.description": "Utilisé pour cuisiner des recettes avancées",
  "visit.enter.land":
    "Entrez un ID de terrain pour parcourir ce qui est proposé.",
  "visit.friend": "Visiter un ami",
  "visit.land": "Visiter le terrain",
  "wishing.well": "Puits à vœux",
  "you.are.here": "Vous êtes ici",
  achievements: "Succès",
  auctions: "Enchères",
  back: "Retour",
  bait: "Appât",
  basket: "Panier",
  beta: "Bêta",
  bounty: "Prime",
  build: "Construire",
  buy: "Acheter",
  craft: "Fabriquer",
  cancel: "Annuler",
  check: "Vérifier",

  chest: "Coffre",
  chores: "Corvées",
  claim: "Réclamation",
  clear: "Effacer",
  close: "Fermer",
  completed: "Terminé",
  confirm: "Confirmer",
  congrats: "Félicitations !",
  connected: "Connecté",
  connecting: "Connexion en cours",
  continue: "Continuer",
  cook: "Cuisiner",
  coupons: "Coupons",
  crafting: "Fabrication",
  crops: "Cultures",
  date: "Date",
  deliveries: "Livraisons",
  delivery: "Livraison",
  details: "Détails",
  egg: "Œuf",
  equip: "Équiper",
  error: "Erreur",
  exotics: "Exotiques",
  expand: "Étendre",
  explore: "Explorer",
  farm: "Ferme",
  featured: "En vedette",
  fertilisers: "Engrais",
  fish: "Poisson",
  foods: "Aliments",
  for: "pour",
  forbidden: "Interdit",
  fruit: "Fruit",
  fruits: "Fruits",
  gotIt: "C'est compris",
  guide: "Guide",
  info: "Info",
  item: "Objet :",
  left: "Restant",
  list: "Liste",
  loading: "Chargement",
  lvl: "Niveau",
  maintenance: "Maintenance",
  mins: "minutes",
  mint: "Mint",
  minting: "Mintage",
  music: "Musique",
  next: "Suivant",
  nextSkillPtLvl: "Prochain point de compétence : niveau",
  no: "Non",
  ok: "OK",
  print: "Imprimer",
  purchasing: "Achat en cours",
  rank: "Classement",
  remove: "Retirer",
  refresh: "Actualiser",
  required: "requis",
  refreshing: "Actualisation en cours",
  reqSkillPts: "Points de compétence requis",
  reqSkills: "Compétences requises :",
  resources: "Ressources",
  restock: "Réapprovisionner",
  retry: "Réessayer",
  save: "Enregistrer",
  saving: "Enregistrement",
  start: "Démarer",
  share: "Partager",
  secs: "secondes",
  seeds: "Graines",
  sell: "Vendre",
  shopping: "Achats",
  skillPts: "Points de compétence :",
  skills: "Compétences",
  success: "Succès !",
  swapping: "Échange",
  syncing: "Synchronisation",
  task: "Tâche",
  tools: "Outils",
  total: "Total",
  trades: "Échanges",
  trading: "Échange",
  transfer: "Transfer",
  travel: "Voyage",
  uhOh: "Oh oh !",
  unlocking: "Déverrouillage",
  verify: "Vérifier",
  version: "Version",
  viewAll: "Voir tout",
  warning: "Avertissement",
  wallet: "Portefeuille",
  welcome: "Bienvenue !",
  withdraw: "Retirer",
  yes: "Oui",
};

const achievementTerms: Record<AchievementsTerms, string> = {
  "breadWinner.description": "Gagnez 0,001 SFL",
  "breadWinner.one":
    "Tiens, tiens, tiens, partenaire... Il semble que vous ayez besoin de quelques SFL !",
  "breadWinner.two":
    "Dans Sunflower Land, une réserve saine de SFL est la clé pour fabriquer des outils, des bâtiments et des NFT rares.",
  "breadWinner.three":
    "Le moyen le plus rapide de gagner des SFL est de planter et de vendre des cultures.",

  "sunSeeker.description": "Récoltez le tournesol 100 fois",
  "cabbageKing.description": "Récoltez le chou 200 fois",
  "jackOLantern.description": "Récoltez la citrouille 500 fois",
  "coolFlower.description": "Récoltez le chou-fleur 100 fois",
  "farmHand.description": "Récoltez des cultures 10 000 fois",
  "beetrootBeast.description": "Récoltez la betterave 2 000 fois",
  "myLifeIsPotato.description": "Récoltez la pomme de terre 5 000 fois",
  "rapidRadish.description": "Récoltez le radis 200 fois",
  "twentyTwentyVision.description": "Récoltez la carotte 10 000 fois",
  "stapleCrop.description": "Récoltez le blé 10 000 fois",
  "sunflowerSuperstar.description": "Récoltez le tournesol 100 000 fois",
  "bumpkinBillionaire.description": "Gagnez 5 000 SFL",
  "patientParsnips.description": "Récoltez le panais 5 000 fois",
  "cropChampion.description": "Récoltez 1 million de cultures",

  "busyBumpkin.description": "Atteignez le niveau 2",
  "busyBumpkin.one":
    "Salut, mon ami ambitieux ! Pour débloquer de nouvelles cultures, des agrandissements, des bâtiments et bien plus encore, vous devrez monter de niveau.",
  "busyBumpkin.two":
    "Rendez-vous au Fire Pit, préparez une délicieuse recette et nourrissez votre Bumpkin.",

  "kissTheCook.description": "Préparez 20 repas",
  "bakersDozen.description": "Cuisinez 13 cakex",
  "brilliantBumpkin.description": "Atteignez le niveau 20",
  "chefDeCuisine.description": "Préparez 5 000 repas",

  "scarecrowMaestro.description":
    "Fabriquez un épouvantail et améliorez vos cultures",
  "scarecrowMaestro.one":
    "Salut, partenaire ! Il est temps d'apprendre l'art de la fabrication et d'améliorer vos compétences en agriculture.",
  "scarecrowMaestro.two":
    "Rendez-vous à la Pumpkin Plaza, visitez le Blacksmith et fabriquez un épouvantail.",

  "bigSpender.description": "Dépensez 10 SFL",
  "museum.description":
    "Ayez 10 types différents d'objets rares placés sur votre terrain",
  "highRoller.description": "Dépensez 7 500 SFL",
  "timbeerrr.description": "Abattez 150 arbres",
  "craftmanship.description": "Fabriquez 100 outils",
  "driller.description": "Extrayez 50 roches en pierre",
  "ironEyes.description": "Extrayez 50 roches de fer",
  "elDorado.description": "Extrayez 50 roches d'or",
  "timeToChop.description": "Fabriquez 500 haches",
  "canary.description": "Extrayez 1 000 roches en pierre",
  "somethingShiny.description": "Extrayez 500 roches de fer",
  "bumpkinChainsawAmateur.description": "Abattez 5 000 arbres",
  "goldFever.description": "Extrayez 500 roches d'or",

  // Explorer
  "explorer.description": "Étendez votre terrain",
  "explorer.one":
    "Récoltons du bois en abattant ces arbres et agrandissons l'île. Allez-y et trouvez la meilleure façon de le faire.",

  "expansion.description": "Étendez votre terrain vers de nouveaux horizons.",

  // Well of Prosperity
  "wellOfProsperity.description": "Construisez un puits",
  "wellOfProsperity.one": "Tien, tien, tien, qu'avons-nous ici ?",
  "wellOfProsperity.two":
    "On dirait que vos cultures ont soif. Pour en soutenir davantage, vous devez d'abord construire un puits.",

  "contractor.description": "Construire 10 bâtiments sur votre terrain",
  "fruitAficionado.description": "Récoltez 50 fruits",
  "fruitAficionado.one":
    "Salut, cueilleur de fruits ! Les fruits sont les cadeaux les plus doux de la nature, et ils apportent une explosion de saveur à votre ferme.",
  "fruitAficionado.two":
    "En collectant différents fruits, tels que des pommes, des oranges et des myrtilles, vous débloquerez des recettes uniques, renforcerez vos compétences en cuisine et créerez des délices.",

  "orangeSqueeze.description": "Récoltez 100 fois des oranges",
  "appleOfMyEye.description": "Récoltez 500 fois des pommes",
  "blueChip.description": "Récoltez 5 000 fois des myrtilles",
  "fruitPlatter.description": "Récoltez 50 000 fruits",
  "crowdFavourite.description": "Effectuez 100 livraisons",

  "deliveryDynamo.description": "Effectuez 3 livraisons",
  "deliveryDynamo.one":
    "Salut, fermier fiable ! Les Bumpkins de partout ont besoin de votre aide pour les livraisons.",
  "deliveryDynamo.two":
    "En effectuant des livraisons, vous les rendrez heureux et vous gagnerez en retour de fantastiques récompenses en SFL.",

  "seasonedFarmer.description": "Collectez 50 Ressources Saisonnières",
  "seasonedFarmer.one":
    "Salut, aventurier de la saison ! Sunflower Land est connu pour ses saisons spéciales remplies d'objets uniques et de surprises.",
  "seasonedFarmer.two":
    "En collectant des ressources saisonnières, vous aurez accès à des récompenses à durée limitée, à des créations exclusives et à des trésors rares. C'est comme avoir un billet de première rangée pour les merveilles de chaque saison.",
  "seasonedFarmer.three":
    "Alors, accomplissez des tâches, participez à des événements et collectez ces billets saisonniers pour profiter de ce que Sunflower Land a de mieux à offrir !",
  "treasureHunter.description": "Creusez 10 trous",
  "treasureHunter.one":
    "Ahoy, chasseur de trésors ! Sunflower Land regorge de trésors cachés qui n'attendent qu'à être découverts.",
  "treasureHunter.two":
    "Prenez votre pelle et rendez-vous sur l'île aux trésors, où vous pouvez creuser pour trouver des objets de valeur et des surprises rares.",
  "eggcellentCollection.description": "Collectez 10 œufs",
  "eggcellentCollection.one":
    "Salut, collectionneur d'œufs ! Les poules sont de merveilleux compagnons de ferme qui nous fournissent de délicieux œufs.",
  "eggcellentCollection.two":
    "En collectant des œufs, vous disposerez d'un approvisionnement frais d'ingrédients pour la cuisine, et vous débloquerez également des recettes spéciales et des bonus.",

  "task.harvestSunflowers": "Récoltez 10 Sunflower",
};

const action: Record<Action, string> = {
  "action.bid.message": "Vous avez placé votre enchère.",
  "action.bid": "Enchérir",
  "action.reveal": "Révéler les gagnants",
  "action.time": "Enchère :",
  "action.live": "L'enchère est en cours !",
  "action.requirement": "Exigences",
  "action.start": "Heure de début",
  "action.period": "Période d'enchère",
  "action.closed": "Enchère terminée",
  "action.rank": "Classement",
  "action.farm": "Ferme",
  "action.const": "En construction !",
  "action.const.soon": "Cette fonctionnalité arrive bientôt.",
};

const addSFL: Record<AddSFL, string> = {
  "addSFL.loading": "Chargement",
  "addSFL.swapDetails":
    "Sunflower Land offre un moyen rapide d'échanger du Matic contre du SFL via Quickswap.",
  "addSFL.referralFee":
    "Sunflower Land prend une commission de référence de 5% pour réaliser cette transaction.",
  "addSFL.swapTitle": "Détails de l'échange",
  "addSFL.balance": "Solde : ",
  "addSFL.for": "pour",
  "addSFL.minimumReceived": "Minimum reçu :",
  "addSFL.addSFL": "Ajouter SFL",
  "addSFL.title": "Ajouter SFL",
};

const availableSeeds: Record<AvailableSeeds, string> = {
  "availableSeeds.select": "Graine non sélectionnée",
  "availableSeeds.select.plant":
    "Quelle graine souhaitez-vous sélectionner et planter ?",
  "availableSeeds.plant": "Planter",
};

const base: Record<Base, string> = {
  "base.missing": "Nom manquant dans la configuration",
  "base.far.away": "Vous êtes trop loin",
};

const beach: Record<Beach, string> = {
  "beach.party": "Nous travaillons dur pour préparer une fête à la plage.",
  "beach.ready": "Préparez votre crème solaire et vos parasols, l'été arrive !",
};

const beachLuck: Record<BeachLuck, string> = {
  "beachLuck.tryLuck": "Envie de tenter ta chance aujourd'hui ?",
  "beachLuck.uncleFound":
    "Mon oncle a trouvé une bague en diamant en creusant sur cette plage. Tout ce que je trouve, ce sont des pièces SFL ennuyeuses.",
  "beachLuck.grabShovel": "Prends simplement une pelle et commence à creuser.",
  "beachLuck.refreshesIn": "Rafraîchissement des trésors dans :",
};

const birdiePlaza: Record<BirdiePlaza, string> = {
  "birdieplaza.birdieIntro":
    "Salut, je suis Birdie, le plus beau Bumpkin du coin !",
  "birdieplaza.admiringOutfit":
    "J'ai remarqué que tu admirais ma tenue. N'est-elle pas fantastique ?!?",
  "birdieplaza.currentSeason": "Nous sommes actuellement en Saison",
  "birdieplaza.currentSeason.two": "et les Bumpkins sont fous des",
  "birdieplaza.collectTickets": "Collectez suffisamment de",
  "birdieplaza.collectTickets.two":
    "et vous pourrez créer des NFT rares. C'est ainsi que j'ai obtenu cette tenue rare !",
  "birdieplaza.whatIsSeason": "Qu'est-ce qu'une saison ?",
  "birdieplaza.howToEarnTickets": "Comment gagner des",
  "birdieplaza.earnTicketsVariety": "Vous pouvez gagner des",
  "birdieplaza.earnTicketsVariety.two": "de plusieurs manières.",
  "birdieplaza.commonMethod": "La méthode la plus courante pour gagner des",
  "birdieplaza.commonMethod.two":
    "est de rassembler des ressources et de les livrer aux Bumpkins de la Plaza.",
  "birdieplaza.choresAndRewards": "Vous pouvez également gagner des",
  "birdieplaza.choresAndRewards.two":
    "en accomplissant des tâches pour Hank et en réclamant des récompenses quotidiennes !",
  "birdieplaza.gatherAndCraft": "Rassemblez assez de",
  "birdieplaza.gatherAndCraft.two":
    "et vous pourrez fabriquer des objets rares comme moi.",
  "birdieplaza.newSeasonIntro":
    "Tous les 3 mois, une nouvelle saison est introduite à Sunflower Land.",
  "birdieplaza.seasonQuests":
    "Cette saison propose des quêtes passionnantes et des objets de collection rares à gagner.",
  "birdieplaza.craftItems": "Pour fabriquer ces objets, vous devez collecter",
  "birdieplaza.craftItems.two":
    "et les échanger dans les boutiques ou à la maison de vente aux enchères.",
};

const boostDescriptions: Record<BoostDescriptions, string> = {
  // Mutant Chickens
  "description.speed.chicken.one":
    "Vos poules produiront maintenant des œufs 10 % plus rapidement.",
  "description.speed.chicken.two": "Produit des œufs 10 % plus rapidement",
  "description.fat.chicken.one":
    "Vos poules auront désormais besoin de 10 % de moins de blé par repas.",
  "description.fat.chicken.two":
    "10 % de blé en moins nécessaire pour nourrir une poule",
  "description.rich.chicken.one":
    "Vos poules produiront maintenant 10 % de plus d'œufs.",
  "description.rich.chicken.two": "Produit 10 % de plus d'œufs",
  "description.ayam.cemani": "La poule la plus rare qui existe !",
  "description.el.pollo.veloz.one":
    "Vos poules pondront des œufs 4 heures plus rapidement !",
  "description.el.pollo.veloz.two":
    "Donnez-moi ces œufs, vite ! Boost de vitesse de ponte de 4 heures.",
  "description.banana.chicken":
    "Une poule qui booste les bananes. Quel monde nous vivons.",

  // Boosts
  "description.lab.grow.pumpkin": "+0.3 de rendement pour les Pumpkins",
  "description.lab.grown.radish": "+0.4 de rendement pour les Radishes",
  "description.lab.grown.carrot": "+0.2 de rendement pour les Carrots",
  "description.purple.trail":
    "Laissez vos adversaires dans un sillage d'envie avec la traînée violette envoûtante et unique",
  "description.obie": "Un soldat d'aubergine féroce",
  "description.maximus": "Écrasez la concurrence avec le dodu Maximus",
  "description.mushroom.house":
    "Une demeure fantaisiste de champignons où les murs bourgeonnent de charme et même les meubles ont un flair 'spore-taculaire' !",
  "description.Karkinos":
    "Pinçant mais gentil, l'addition de chou-boostant à votre ferme !",
  "description.heart.of.davy.jones":
    "Celui qui le possède détient un immense pouvoir sur les sept mers, peut creuser des trésors sans se fatiguer",
  "description.tin.turtle":
    "La Tortue en Étain donne +0.1 aux Pierres que vous minez dans son Aire d'Effet.",
  "description.emerald.turtle":
    "La Tortue Émeraude donne +0.5 à tous les minéraux que vous minez dans son Aire d'Effet.",
  "description.iron.idol":
    "L'Idole ajoute 1 fer à chaque fois que vous minez du fer.",
  "description.skill.shrimpy":
    "Shrimpy est là pour aider ! Il vous assurera ce XP supplémentaire des poissons.",
  "description.soil.krabby":
    "Tamisage rapide avec le sourire ! Profitez d'une augmentation de 10% de la vitesse du composteur avec ce champion crustacé.",
  "description.nana":
    "Cette rare beauté est un moyen infaillible d'augmenter vos récoltes de bananes.",
  "description.grain.grinder":
    "Moulez votre grain et vivez une montée délicieuse en XP de Cake.",
  "description.kernaldo": "Le magicien chuchoteur de maïs.",
  "description.poppy": "Le grain de maïs mystique.",
  "description.victoria.sisters": "Les sœurs passionnées de citrouilles",
  "description.undead.rooster":
    "Une victime malheureuse de la guerre. Augmentation de 10% de la production d'œufs.",
  "description.observatory":
    "Explorez les étoiles et améliorez le développement scientifique",
  "description.engine.core": "Le pouvoir du tournesol",
  "description.time.warp.totem":
    "Vitesse doublée pour les cultures, arbres, cuisine & minéraux. Dure seulement 2 heures",
  "description.time.warp.totem.expired":
    "Votre Totem de Distorsion Temporelle a expiré. Rendez-vous à la Plaza de la Citrouille pour découvrir et fabriquer plus d'objets magiques pour améliorer vos capacités agricoles !",
  "description.time.warp.totem.temporarily":
    "Le Totem de Distorsion Temporelle booste temporairement votre cuisine, vos cultures, vos arbres et le temps des minéraux. Profitez-en au maximum !",
  "description.cabbage.boy": "Ne réveillez pas le bébé !",
  "description.cabbage.girl": "Chut, il dort",
  "description.wood.nymph.wendy":
    "Lance un enchantement pour séduire les fées des bois.",
  "description.peeled.potato":
    "Une pomme de terre précieuse, encourage des pommes de terre bonus à la récolte.",
  "description.potent.potato":
    "Puissante ! Donne 3% de chance d'obtenir +10 pommes de terre à la récolte.",
  "description.radical.radish":
    "Radical ! Donne 3% de chance d'obtenir +10 radis à la récolte.",
  "description.stellar.sunflower":
    "Stellaire ! Donne 3% de chance d'obtenir +10 tournesols à la récolte.",
  "description.lady.bug":
    "Un incroyable insecte qui se nourrit de pucerons. Améliore la qualité des pommes.",
  "description.squirrel.monkey":
    "Un prédateur naturel des oranges. Les orangers ont peur quand un singe écureuil est à proximité.",
  "description.black.bearry":
    "Son en-cas favori - de grosses myrtilles juteuses. Il les dévore à pleines mains !",
  "description.maneki.neko":
    "Le chat qui invite. Tirez sur son bras et la chance viendra",
  "description.easter.bunny": "Un objet rare de Pâques",
  "description.pablo.bunny": "Un lapin de Pâques magique",
  "description.foliant": "Un livre de sorts.",
  "description.tiki.totem":
    "Le Totem Tiki ajoute 0,1 de bois à chaque arbre que vous abattez.",
  "description.lunar.calendar":
    "Les cultures suivent désormais le cycle lunaire ! Augmentation de 10 % de la vitesse de croissance des cultures.",
  "description.heart.davy.jones":
    "Celui qui le possède détient un immense pouvoir sur les sept mers, peut chercher des trésors sans se fatiguer.",
  "description.treasure.map":
    "Une carte enchantée qui guide son détenteur vers des trésors précieux. +20 % de profit sur les objets trouvés sur la plage.",
  "description.genie.lamp":
    "Une lampe magique qui contient un génie qui vous accordera trois vœux.",
  "description.basic.scarecrow":
    "Défenseur exigeant des plantes très importantes de votre ferme.",
  "description.scary.mike":
    "Le chuchoteur de légumes et champion des récoltes effrayamment bonnes !",
  "description.laurie.chuckle.crow":
    "Avec son rire déconcertant, elle chasse les picoreurs loin de vos cultures.",
  "description.immortal.pear":
    "Une poire à longue durée de vie qui fait durer les arbres fruitiers plus longtemps.",
  "description.bale":
    "Le voisin préféré des volailles, offrant un refuge confortable aux poules.",
  "description.sir.goldensnout":
    "Un membre de la royauté, Sir Goldensnout infuse votre ferme d'une prospérité souveraine grâce à son fumier doré.",
  "description.freya.fox":
    "Gardienne enchanteresse, elle stimule la croissance des citrouilles avec son charme mystique. Récoltez des citrouilles abondantes sous son regard bienveillant.",
  "description.queen.cornelia":
    "Commandez le pouvoir royal de la Reine Cornelia et bénéficiez d'un magnifique boost en zone pour votre production de maïs. +1 Maïs.",
};

const boostEffectDescriptions: Record<BoostEffectDescriptions, string> = {
  "description.obie.boost": "Les eggplants poussent 25% plus vite",
  "description.purple.trail.boost": "+0.2 Eggplant",
  "description.freya.fox.boost": "+0.5 Pumpkin",
  "description.sir.goldensnout.boost": "+0.5 Crops (AOE)",
  "description.maximus.boost": "+1 Eggplant",
  "description.basic.scarecrow.boost":
    "Les Sunflowers, Potatoes et Pumpkins poussent 20% plus vite",
  "description.scary.mike.boost":
    "+0.2 de rendement sur les Carrots, Cabbages, Beetroots, Cauliflowers et Parsnips",
  "description.laurie.chuckle.crow.boost":
    "+0.2 de rendement sur les Eggplants, Corn, Radishes, Wheat et Kale",
  "description.bale.boost": "Les poules adjacentes produisent +0.2 Eggs",
  "description.immortal.pear.boost": "+1 de rendement",
  "description.treasure.map.boost": "+20% de SFL sur Treasure Bounty",
  "description.poppy.boost": "+0.1 Corn",
  "description.kernaldo.boost": "+25% de vitesse pour le Corn",
  "description.grain.grinder.boost": "+20% d'XP pour le Cake",
  "description.nana.boost": "+10% de vitesse pour le Banana",
  "description.soil.krabby.boost": "+10% de vitesse pour le Composter",
  "description.skill.shrimpy.boost": "+20% d'XP pour le Fish",
  "description.iron.idol.boost": "+1 Iron",
  "description.emerald.turtle.boost": "+0.5 AoE pour tout Mineral",
  "description.tin.turtle.boost": "+0.1 AoE pour les Stones",
  "description.heart.of.davy.jones.boost": "Creuser 20 fois de plus par jour",
  "description.Karkinos.boost": "+0.1 Cabbage",
  "description.mushroom.house.boost": "+0.2 Wild Mushroom",
  "description.boost.gilded.swordfish": "+0,1 Or",
};

const bountyDescription: Record<BountyDescription, string> = {
  "description.clam.shell": "Une coquille de palourde.",
  "description.sea.cucumber": "Un concombre de mer.",
  "description.coral": "Un morceau de corail, c'est joli.",
  "description.crab": "Un crabe, attention à ses pinces !",
  "description.starfish": "L'étoile de la mer.",
  "description.pirate.bounty":
    "Une prime pour un pirate. Ça vaut beaucoup d'argent.",
  "description.wooden.compass":
    "Ce n'est peut-être pas high-tech, mais il vous dirigera toujours dans la bonne direction, vous y croyez en bois ?",
  "description.iron.compass":
    "Fermez votre chemin vers le trésor ! Ce compas est 'attirant', et pas seulement vers le Nord magnétique !",
  "description.emerald.compass":
    "Guidez votre chemin à travers les mystères luxuriants de la vie ! Ce compas ne pointe pas seulement vers le Nord, il pointe vers l'opulence et la grandeur !",
  "description.old.bottle":
    "Bouteille de pirate antique, résonnant des récits d'aventures en haute mer.",
  "description.pearl": "Brille au soleil.",
  "description.pipi": "Plebidonax deltoides, trouvé dans l'océan Pacifique.",
  "description.seaweed": "Algues marines.",
};

const buildingDescriptions: Record<BuildingDescriptions, string> = {
  // Buildings
  "description.water.well": "Les cultures ont besoin d'eau !",
  "description.kitchen": "Améliorez vos compétences culinaires",
  "description.compost.bin":
    "Produit de l'appât et de l'engrais régulièrement.",
  "description.hen.house": "Développez votre empire avicole",
  "description.bakery": "Faites cuire vos gâteaux préférés",
  "description.turbo.composter":
    "Produit de l'appât et de l'engrais avancés régulièrement.",
  "description.deli": "Satisfaites votre appétit avec ces délices !",
  "description.smoothie.shack": "Fraîchement pressé !",
  "description.warehouse": "Augmente vos stocks de graines de 20%",
  "description.toolshed": "Augmente vos stocks d'outils d'atelier de 50%",
  "description.premium.composter":
    "Produit de l'appât et de l'engrais experts régulièrement.",
  "description.town.center":
    "Rassemblez-vous autour du Town Center pour les dernières nouvelles",
  "description.market": "Achetez et vendez au Market des fermiers",
  "description.fire.pit":
    "Rôtissez vos tournesols, nourrissez et montez de niveau votre Bumpkin",
  "description.workbench": "Fabriquez des outils pour collecter des ressources",
  "description.tent": "(Arrêté)",
  "description.house": "Un endroit pour reposer votre tête",
};

const bumpkinItemBuff: Record<BumpkinItemBuff, string> = {
  "bumpkinItemBuff.chef.apron.boost": "+20% de profit sur les gâteaux",
  "bumpkinItemBuff.fruit.picker.apron.boost": "+0.1 Fruit",
  "bumpkinItemBuff.angel.wings.boost": "Récoltes instantanées",
  "bumpkinItemBuff.devil.wings.boost": "Récoltes instantanées",
  "bumpkinItemBuff.eggplant.onesie.boost": "+0.1 Aubergine",
  "bumpkinItemBuff.golden.spatula.boost": "+10% XP",
  "bumpkinItemBuff.mushroom.hat.boost": "+0.1 Champignons",
  "bumpkinItemBuff.parsnip.boost": "+20% Panais",
  "bumpkinItemBuff.sunflower.amulet.boost": "+10% Tournesol",
  "bumpkinItemBuff.carrot.amulet.boost":
    "-20% Temps de croissance des carottes",
  "bumpkinItemBuff.beetroot.amulet.boost": "+20% Betterave",
  "bumpkinItemBuff.green.amulet.boost":
    "Chance de multiplier les récoltes par 10",
  "bumpkinItemBuff.Luna.s.hat.boost": "-50% Temps de cuisson",
  "bumpkinItemBuff.infernal.pitchfork.boost": "+3 Récoltes",
  "bumpkinItemBuff.cattlegrim.boost": "+0.25 Produits animaux",
  "bumpkinItemBuff.corn.onesie.boost": "+0.1 Maïs",
  "bumpkinItemBuff.sunflower.rod.boost": "10% de chance de +1 Poisson",
  "bumpkinItemBuff.trident.boost": "20% de chance de +1 Poisson",
  "bumpkinItemBuff.bucket.o.worms.boost": "+1 Ver",
  "bumpkinItemBuff.luminous.anglerfish.topper.boost": "+50% XP de pêche",
  "bumpkinItemBuff.angler.waders.boost": "+10 Limite de pêche",
  "bumpkinItemBuff.ancient.rod.boost": "Pêche sans canne",
  "bumpkinItemBuff.banana.amulet.boost": "+0.5 Bananes",
  "bumpkinItemBuff.banana.boost": "+20% de vitesse pour les bananes",
  "bumpkinItemBuff.deep.sea.helm":
    "3x plus de chances pour les Merveilles Marines",
};

const bumpkinPartRequirements: Record<BumpkinPartRequirements, string> = {
  "part.hair": "Les cheveux sont requis",
  "part.body": "Le corps est requis",
  "part.shoes": "Les chaussures sont requises",
  "part.shirt": "La chemise est requise",
  "part.pants": "Le pantalon est requis",
  "part.background": "L'arrière-plan est requis",
};

const bumpkinSkillsDescription: Record<BumpkinSkillsDescription, string> = {
  // Crops
  "description.green.thumb": "Les cultures produisent 5% de plus",
  "description.cultivator": "Les cultures poussent 5% plus vite",
  "description.master.farmer": "Les cultures produisent 10% de plus",
  "description.golden.flowers":
    "Chance d'obtenir de l'or en récoltant des tournesols",
  "description.happy.crop": "Chance d'obtenir 2x plus de récoltes",
  // Trees
  "description.lumberjack": "Les arbres laissent tomber 10% de plus",
  "description.tree.hugger": "Les arbres repoussent 20% plus rapidement",
  "description.tough.tree":
    "Chance d'obtenir 3x plus de bois en coupant des arbres",
  "description.money.tree":
    "Chance d'obtenir des drops SFL en coupant des arbres",
  // Rocks
  "description.digger": "Les pierres laissent tomber 10% de plus",
  "description.coal.face": "Les pierres se régénèrent 20% plus rapidement",
  "description.seeker": "Attire les Monstres des Roches",
  "description.gold.rush": "Chance d'obtenir 2.5x plus de drops d'or",
  // Cooking
  "description.rush.hour": "Cuisinez les repas 10% plus rapidement",
  "description.kitchen.hand":
    "Les repas rapportent 5% d'expérience supplémentaire",
  "description.michelin.stars":
    "Nourriture de haute qualité, rapporte 5% de plus de SFL",
  "description.curer":
    "Consommer les produits du Deli ajoute 15% d'expérience supplémentaire",
  // Animals
  "description.stable.hand": "Les animaux produisent 10% plus rapidement",
  "description.free.range": "Les animaux produisent 10% de plus",
  "description.horse.whisperer": "Augmente les chances d'obtenir des mutants",
  "description.buckaroo": "Chance d'obtenir des récoltes doubles",
};

const bumpkinTrade: Record<BumpkinTrade, string> = {
  "bumpkinTrade.askPrice": "Prix demandé :",
  "bumpkinTrade.purchased": "Felicitations, votre annonce a été achetée !",
  "bumpkinTrade.plaza":
    "Rendez-vous à la place pour que d'autres joueurs puissent commercer avec vous",
  "bumpkinTrade.lvl": "Vous devez être niveau 10 pour commercer",
  "bumpkinTrade.noTradeLs":
    "Vous n'avez aucune annonce commerciale répertoriée.",
  "bumpkinTrade.sell":
    "Vendez vos ressources à d'autres joueurs en échange de SFL.",
  "bumpkinTrade.list": "Lister le commerce",
  "bumpkinTrade.like.list": "Que souhaitez-vous lister",
};

const buyFarmHand: Record<BuyFarmHand, string> = {
  "buyFarmHand.howdyBumpkin": "Salut Bumpkin.",
  "buyFarmHand.confirmBuyAdditional":
    "Êtes-vous sûr de vouloir acheter un Bumpkin supplémentaire ?",
  "buyFarmHand.farmhandCoupon": "1 Coupon d'Aide Agricole",
  "buyFarmHand.adoptBumpkin": "Adopter un Bumpkin",
  "buyFarmHand.additionalBumpkinsInfo":
    "Des Bumpkins supplémentaires peuvent être utilisés pour équiper des accessoires et améliorer votre ferme.",
  "buyFarmHand.notEnoughSpace": "Pas assez d'espace - améliorez votre île",
  "buyFarmHand.buyBumpkin": "Acheter un Bumpkin",
};

const claimAchievement: Record<ClaimAchievement, string> = {
  "claimAchievement.noBumpkin": "Vous n'avez pas de Bumpkin",
  "claimAchievement.alreadyHave": "Vous avez déjà cet accomplissement",
  "claimAchievement.requirementsNotMet": "Vous ne répondez pas aux exigences",
};

const chat: Record<Chat, string> = {
  "chat.Loading": "Chargement",
  "chat.Fail": "Échec de la connexion",
  "chat.mute": "Vous êtes muet",
  "chat.again": "Vous pourrez à nouveau discuter dans",
  "chat.Kicked": "Expulsé",
};

const chickenWinner: Record<ChickenWinner, string> = {
  "chicken.winner.playagain": "cliquez ici pour rejouer",
};

const choresStart: Record<ChoresStart, string> = {
  "chores.harvestFields": "Récolter les champs",
  "chores.earnSfl": "Gagner",
  "chores.harvestFieldsIntro":
    "Ces champs ne vont pas se labourer tout seuls. Récoltez 3 Tournesols.",
  "chores.earnSflIntro":
    "Si vous voulez réussir dans l'agriculture, commencez par vendre des tournesols, acheter des graines et récolter les profits.",
  "chores.reachLevel": "Atteindre le niveau 2",
  "chores.reachLevelIntro":
    "Si vous voulez monter de niveau et débloquer de nouvelles capacités, commencez par cuisiner de la nourriture et la manger.",
  "chores.chopTrees": "Couper 3 arbres",
  "chores.helpWithTrees":
    "Mes vieux os ne sont plus ce qu'ils étaient, pensez-vous pouvoir m'aider avec ces maudits arbres à couper ? Notre forgeron local vous aidera à fabriquer des outils.",
};

const chumDetails: Record<ChumDetails, string> = {
  "chumDetails.gold": "L'or scintillant peut être vu à 100 miles de distance",
  "chumDetails.iron":
    "Un scintillement étincelant, visible sous tous les angles au crépuscule",
  "chumDetails.stone":
    "Peut-être que jeter quelques pierres attirera des poissons",
  "chumDetails.egg": "Hmm, pas sûr que les poissons aiment les œufs...",
  "chumDetails.sunflower":
    "Un appât ensoleillé et vibrant pour les poissons curieux.",
  "chumDetails.potato":
    "Les pommes de terre constituent un festin de poisson inhabituel.",
  "chumDetails.pumpkin":
    "Les poissons pourraient être intrigués par la lueur orange des citrouilles.",
  "chumDetails.carrot":
    "Meilleur utilisé avec des vers de terre pour attraper des anchois !",
  "chumDetails.cabbage":
    "Une tentation feuillue pour les herbivores sous-marins.",
  "chumDetails.beetroot":
    "Les betteraves, le délice sous-marin pour les poissons audacieux.",
  "chumDetails.cauliflower":
    "Les poissons peuvent trouver les fleurons étrangement attrayants.",
  "chumDetails.parsnip":
    "Un appât terreux et racinaire pour les poissons curieux.",
  "chumDetails.eggplant":
    "Les aubergines : une aventure aquatique pour les poissons audacieux.",
  "chumDetails.corn": "Le maïs en épi – un régal étrange mais intrigant.",
  "chumDetails.radish": "Les radis, le trésor enfoui pour les aquatiques.",
  "chumDetails.wheat":
    "Le blé, un délice granuleux pour les fourrageurs sous-marins.",
  "chumDetails.kale": "Une surprise verte pour les poissons curieux.",
  "chumDetails.blueberry":
    "Souvent confondu par les poissons bleus comme des partenaires potentiels.",
  "chumDetails.orange":
    "Les oranges, une curiosité citronnée pour les créatures marines.",
  "chumDetails.apple": "Les pommes – une énigme croquante sous les vagues.",
  "chumDetails.banana": "Plus léger que l'eau !",
  "chumDetails.seaweed":
    "Un goût d'océan dans une collation sous-marine feuillue.",
  "chumDetails.crab":
    "Un morceau alléchant pour un poisson curieux sous la mer.",
  "chumDetails.anchovy":
    "Les anchois, mystérieusement séduisants pour les hors-la-loi de la mer.",
  "chumDetails.redSnapper": "Un mystère caché dans les profondeurs de l'océan.",
  "chumDetails.tuna": "Qu'est-ce qui est assez grand pour manger un thon ?",
  "chumDetails.squid": "Réveillez une raie avec sa friandise préférée !",
  "chumDetails.wood": "Bois. Un choix intéressant....",
};

const community: Record<Community, string> = {
  "community.toast": "Le texte du toast est vide",
  "community.url": "Entrez l'URL de votre dépôt",
  "comunity.Travel": "Voyagez vers des îles construites par la communauté",
};

const compostDescription: Record<CompostDescription, string> = {
  "compost.fruitfulBlend":
    "Le Mélange Fructueux augmente le rendement de chaque fruit de +0.1",
  "compost.sproutMix":
    "Le Mélange Germinatif augmente le rendement de vos cultures de +0.2",
  "compost.sproutMixBoosted":
    "Le Mélange Germinatif renforcé augmente le rendement de vos cultures de +0.4",
  "compost.rapidRoot":
    "Racine Rapide réduit le temps de croissance des cultures de 50%",
};

const composterDescription: Record<ComposterDescription, string> = {
  "composter.compostBin": "Détails sur le Bac à Compost...",
  "composter.turboComposter": "Détails sur le Composteur Turbo...",
  "composter.premiumComposter": "Détails sur le Composteur Premium...",
};

const confirmSkill: Record<ConfirmSkill, string> = {
  "confirm.skillClaim": "Êtes-vous sûr de vouloir réclamer la compétence ?",
};

const confirmationTerms: Record<ConfirmationTerms, string> = {
  "confirmation.sellCrops": "Êtes-vous sûr de vouloir vendre",
};

const conversations: Record<Conversations, string> = {
  "hank-intro.headline": "Aider un vieil homme ?",
  "hank-intro.one":
    "Salut Bumpkin ! Bienvenue dans notre petit coin de paradis.",
  "hank-intro.two":
    "Je travaille cette terre depuis cinquante ans, mais j'aurais bien besoin d'aide.",
  "hank-intro.three":
    "Je peux vous enseigner les bases de l'agriculture, tant que vous m'aidez dans mes tâches quotidiennes.",
  "hank-crafting.headline": "Fabriquez un épouvantail",
  "hank-crafting.one":
    "Hmmm, ces cultures poussent terriblement lentement. Je n'ai pas le temps d'attendre.",
  "hank-crafting.two":
    "Fabriquez un épouvantail pour accélérer la croissance de vos cultures.",
  "betty-intro.headline": "Comment développer votre ferme",
  "betty-intro.one": "Hé, hé ! Bienvenue sur mon marché.",
  "betty-intro.two":
    "Apportez-moi votre meilleure récolte, et je vous en donnerai un bon prix !",
  "betty-intro.three":
    "Vous avez besoin de graines ? Des pommes de terre aux panais, je m'occupe de tout !",
  "betty.market-intro.one":
    "Hé toi, Bumpkin ! C'est Betty du marché fermier. Je voyage entre les îles pour acheter des récoltes et vendre des graines fraîches.",
  "betty.market-intro.two":
    "Bonne nouvelle : vous venez de tomber sur une toute nouvelle pelle étincelante ! Mauvaise nouvelle : nous avons connu une pénurie de cultures.",
  "betty.market-intro.three":
    "Pendant un temps limité, je propose aux nouveaux venus le double d'argent pour chaque récolte que vous m'apportez.",
  "betty.market-intro.four":
    "Récoltez ces Tournesols et commençons à construire votre empire agricole.",
  "bruce-intro.headline": "Introduction à la cuisine",
  "bruce-intro.one": "Je suis le propriétaire de ce charmant petit bistro.",
  "bruce-intro.two":
    "Apportez-moi des ressources et je cuisinerai autant de nourriture que vous le souhaitez !",
  "bruce-intro.three":
    "Salut fermier ! Je peux repérer un Bumpkin affamé à des kilomètres à la ronde.",
  "blacksmith-intro.headline": "Coupez, coupez, coupez.",
  "blacksmith-intro.one":
    "Je suis un maître des outils, et avec les bonnes ressources, je peux fabriquer tout ce dont vous avez besoin... y compris plus d'outils !",
  "pete.first-expansion.one":
    "Félicitations, Bumpkin ! Votre ferme grandit plus vite qu'un haricot magique sous une averse !",
  "pete.first-expansion.two":
    "À chaque expansion, vous trouverez des choses cool comme des ressources spéciales, de nouveaux arbres, et plus encore à collecter !",
  "pete.first-expansion.three":
    "Gardez un œil sur les cadeaux surprises des gobelins généreux pendant que vous explorez, ils ne sont pas seulement des experts en construction, mais aussi des donneurs de secrets astucieux !",
  "pete.first-expansion.four":
    "Félicitations, Bumpkin ! Continuez le bon travail.",
  "pete.blacksmith.one": "Hmm, ces cultures poussent lentement.",
  "pete.blacksmith.two":
    "Sunflower Land regorge d'objets magiques que vous pouvez fabriquer pour améliorer vos compétences en agriculture.",
  "pete.blacksmith.three":
    "Dirigez-vous vers le Workbench et fabriquez un épouvantail pour accélérer la croissance de ces Tournesols.",
  "pete.levelthree.one": "Félicitations, votre main verte brille vraiment !",
  "pete.levelthree.two":
    "Il est grand temps de vous rendre à la Plaza, où vos compétences en agriculture peuvent briller encore plus.",
  "pete.levelthree.three":
    "À la plaza, vous pouvez effectuer des livraisons pour obtenir des récompenses, fabriquer des objets magiques et échanger avec d'autres joueurs.",
  "pete.levelthree.four":
    "Vous pouvez voyager en cliquant sur l'icône du monde en bas à gauche.",
  "pete.help.zero":
    "Visitez le Fire Pit, cuisinez de la nourriture et mangez pour monter de niveau.",
  "pete.help.one":
    "À mesure que vous montez de niveau, vous débloquerez de nouvelles zones à explorer. La première est le Bumpkin's Plaza... ma maison !",
  "pete.help.two":
    "Ici, vous pouvez effectuer des livraisons pour obtenir des récompenses, fabriquer des objets magiques et échanger avec d'autres joueurs.",
  "sunflowerLand.explorationPrompt": "Hé voyageur ! Prêt à explorer ?",
  "sunflowerLand.islandDescription":
    "Sunflower Land regorge d'îles passionnantes où vous pouvez effectuer des livraisons, fabriquer des NFT rares et même chercher des trésors !",
  "sunflowerLand.opportunitiesDescription":
    "Différents lieux offrent différentes opportunités pour dépenser vos ressources durement gagnées.",
  "sunflowerLand.returnHomeInstruction":
    "À tout moment, cliquez sur le bouton de voyage pour revenir à la maison.",
  "grimbly.expansion.one":
    "Salutations, jeune fermier ! Je suis Grimbly, un gobelin constructeur expérimenté.",
  "grimbly.expansion.two":
    "Avec les bons matériaux et mes compétences artisanales ancestrales, nous pouvons transformer votre île en un chef-d'œuvre.",
  "luna.portalNoAccess":
    "Hmm, ce portail est apparu de nulle part. Que pourrait-il signifier ?",
  "luna.portals": "Portails",
  "luna.rewards": "Récompenses",
  "luna.travel":
    "Voyagez vers ces portails construits par les joueurs et gagnez des récompenses.",
  "luna.coming": "Bientôt disponible...  ",
  "mayor.plaza.changeNamePrompt":
    "Voulez-vous changer votre nom ? Malheureusement, je ne peux pas le faire pour vous en ce moment, les formalités administratives sont trop lourdes pour moi.",
  "mayor.plaza.intro":
    "Salut, cher Bumpkin, il semble que nous ne nous soyons pas encore présentés.",
  "mayor.plaza.role":
    "Je suis le Maire de cette ville ! Je veille à ce que tout le monde soit heureux. Je m'assure également que tout le monde ait un nom !",
  "mayor.plaza.fixNamePrompt":
    "Vous n'avez pas encore de nom ? Eh bien, nous pouvons arranger ça ! Voulez-vous que je prépare les documents ?",
  "mayor.plaza.enterUsernamePrompt": "Entrez votre nom d'utilisateur :",
  "mayor.plaza.processingUsernames":
    "Je traite les noms d'utilisateur dans l'ordre des identifiants de ferme. Vous pourrez choisir votre nom d'utilisateur à partir de :",
  "mayor.plaza.usernameValidation":
    "Veuillez noter que les noms d'utilisateur doivent respecter notre Code de Conduite. Le non-respect peut entraîner des sanctions, y compris une suspension éventuelle du compte.",
  "mayor.plaza.niceToMeetYou": "Enchanté de vous rencontrer, ",
  "mayor.plaza.congratulations":
    "Félicitations , vos formalités administratives sont maintenant terminées. À bientôt !",
  "mayor.plaza.enjoyYourStay":
    "J'espère que vous apprécierez votre séjour à Sunflower Land ! Si vous avez encore besoin de moi, revenez me voir !",
};

const cropFruitDescriptions: Record<CropFruitDescriptions, string> = {
  // Crops
  "description.sunflower": "Une fleur ensoleillée",
  "description.potato": "Plus sain que vous ne le pensez.",
  "description.pumpkin": "Il y a plus dans la citrouille que dans la tarte.",
  "description.carrot": "Ils sont bons pour vos yeux !",
  "description.cabbage":
    "Autrefois un luxe, maintenant un aliment pour beaucoup.",
  "description.beetroot": "Bon contre la gueule de bois !",
  "description.cauliflower": "Excellent substitut du riz !",
  "description.parsnip": "À ne pas confondre avec les carottes.",
  "description.eggplant": "Œuvre d'art comestible de la nature.",
  "description.corn":
    "Des grains de maïs ensoleillés, trésor estival de la nature.",
  "description.radish": "Ça prend du temps mais ça vaut la peine d'attendre !",
  "description.wheat": "La culture la plus récoltée au monde.",
  "description.kale": "Un aliment puissant pour les Bumpkins !",

  // Fruits
  "description.blueberry": "La faiblesse d'un Goblin",
  "description.orange":
    "De la vitamine C pour garder votre Bumpkin en bonne santé",
  "description.apple": "Parfait pour une tarte aux pommes maison",
  "description.banana": "Oh, la banane !",

  // Exotic Crops
  "description.white.carrot": "Une carotte pâle aux racines pâles",
  "description.warty.goblin.pumpkin":
    "Une citrouille fantasque et couverte de verrues",
  "description.adirondack.potato":
    "Une pomme de terre robuste, style Adirondack !",
  "description.purple.cauliflower": "Un chou-fleur pourpre royal",
  "description.chiogga": "Une betterave arc-en-ciel !",
  "description.golden.helios": "Grandeur baignée de soleil !",
  "description.black.magic": "Une fleur sombre et mystérieuse !",
};

const deliveryitem: Record<Deliveryitem, string> = {
  "deliveryitem.loading": "Chargement",
  "deliveryitem.inventory": "Inventaire :",
  "deliveryitem.itemsToDeliver": "Articles à livrer :",
  "deliveryitem.deliverToWallet": "Livrer à votre portefeuille",
  "deliveryitem.viewOnOpenSea":
    "Une fois livrés, vous pourrez voir vos articles sur OpenSea.",
  "deliveryitem.deliver": "Livrer",
};

const defaultDialogue: Record<DefaultDialogue, string> = {
  "defaultDialogue.intro":
    "Bonjour, ami ! Je suis là pour voir si tu as ce dont j'ai besoin.",
  "defaultDialogue.positiveDelivery":
    "Oh, fantastique ! Tu as apporté exactement ce dont j'ai besoin. Merci !",
  "defaultDialogue.negativeDelivery":
    "Oh non ! Il semble que tu n'aies pas ce dont j'ai besoin. Pas de souci, cependant. Continue d'explorer, et nous trouverons une autre occasion.",
  "defaultDialogue.noOrder":
    "Pas de commande active à réaliser pour moi en ce moment.",
};

const decorationDescriptions: Record<DecorationDescriptions, string> = {
  // Décorations
  "description.wicker.man":
    "Joignez les mains et formez une chaîne, l'ombre de l'Homme en Osier se lèvera à nouveau",
  "description.golden bonsai": "Les gobelins aiment aussi les bonsaïs",
  "description.christmas.bear": "Le préféré du Père Noël",
  "description.war.skull": "Décorez la terre avec les os de vos ennemis.",
  "description.war.tombstone": "R.I.P",
  "description.white.tulips": "Éloignez l'odeur des gobelins.",
  "description.potted.sunflower": "Illuminez votre terre.",
  "description.potted.potato":
    "Le sang de pomme de terre coule dans vos Bumpkins.",
  "description.potted.pumpkin": "Des citrouilles pour les Bumpkins",
  "description.cactus": "Économise de l'eau et rend votre ferme magnifique !",
  "description.basic.bear":
    "Un ours basique. Utilisez-le au Goblin Retreat pour construire un ours !",
  "description.bonnies.tombstone":
    "Un ajout effrayant à toute ferme, la pierre tombale humaine de Bonnie vous donnera des frissons.",
  "description.grubnashs.tombstone":
    "Ajoutez un charme espiègle avec la pierre tombale de gobelin de Grubnash.",
  "description.town.sign": "Affichez votre identifiant de ferme avec fierté !",
  "description.dirt.path":
    "Gardez vos bottes de fermier propres avec un chemin bien foulé.",
  "description.bush": "Qu'est-ce qui se cache dans les buissons ?",
  "description.fence": "Ajoutez une touche de charme rustique à votre ferme.",
  "description.stone.fence":
    "Adoptez l'élégance intemporelle d'une clôture en pierre.",
  "description.pine.tree":
    "Debout, grand et puissant, un rêve couvert d'aiguilles.",
  "description.shrub":
    "Améliorez l'aménagement paysager de votre jeu avec un magnifique arbuste",
  "description.field.maple":
    "Un charmeur de petite taille qui étend ses feuilles comme un délicat auvent vert.",
  "description.red.maple":
    "Un feuillage flamboyant et un cœur plein de chaleur automnale.",
  "description.golden.maple":
    "Rayonne de brillance avec ses feuilles dorées scintillantes.",
  "description.crimson.cap":
    "Un champignon vibrant et imposant, le champignon géant Crimson Cap apportera de la vie à votre ferme.",
  "description.toadstool.seat":
    "Asseyez-vous et détendez-vous sur le siège champignon fantaisiste Toadstool.",
  "description.chestnut.fungi.stool":
    "Le tabouret de champignon Chestnut Fungi est un ajout robuste et rustique à toute ferme.",
  "description.mahogany.cap":
    "Ajoutez une touche de sophistication avec le champignon géant Mahogany Cap.",
  "description.candles":
    "Enchantez votre ferme avec des flammes spectrales vacillantes pendant la Nuit des Sorcières.",
  "description.haunted.stump":
    "Invoquez des esprits et ajoutez un charme inquiétant à votre ferme.",
  "description.spooky.tree":
    "Un ajout amusant et hanté à la décoration de votre ferme !",
  "description.observer":
    "Un œil errant perpétuel, toujours vigilant et constamment observateur !",
  "description.crow.rock": "Un corbeau perché sur un rocher mystérieux.",
  "description.mini.corn.maze":
    "Un souvenir du labyrinthe bien-aimé de la saison 2023 de la Nuit des Sorcières.",
  "description.lifeguard.ring":
    "Restez à flot avec style, votre sauveur en bord de mer !",
  "description.surfboard":
    "Surfez sur les vagues de l'émerveillement, le bonheur de la plage sur une planche !",
  "description.hideaway.herman":
    "Herman est là pour se cacher, mais il jette toujours un coup d'œil pour une fête !",
  "description.shifty.sheldon":
    "Sheldon est rusé, se faufilant toujours vers la prochaine surprise sablonneuse !",
  "description.tiki.torch":
    "Illuminez la nuit, des vibrations tropicales brillantes !",
  "description.beach.umbrella":
    "Ombre, abri et chic balnéaire en un seul ensemble ensoleillé !",
  "description.magic.bean": "Qu'est-ce qui va pousser ?",
  "description.giant.potato": "Une pomme de terre géante.",
  "description.giant.pumpkin": "Une citrouille géante.",
  "description.giant.cabbage": "Un chou géant.",
  "description.chef.bear": "Chaque chef a besoin d'un coup de main",
  "description.construction.bear":
    "Toujours construire dans un marché baissier",
  "description.angel.bear":
    "Il est temps de transcender l'agriculture paysanne",
  "description.badass.bear": "Rien ne se dresse sur votre chemin.",
  "description.bear.trap": "C'est un piège !",
  "description.brilliant.bear": "Pure brillance !",
  "description.classy.bear": "Plus de SFL que vous ne savez quoi en faire !",
  "description.farmer.bear": "Rien de tel qu'une dure journée de travail !",
  "description.rich.bear": "Une possession précieuse",
  "description.sunflower.bear": "La culture chérie d'un ours",
  "description.beta.bear": "Un ours trouvé lors d'événements de test spéciaux",
  "description.rainbow.artist.bear":
    "Le propriétaire est un magnifique artiste ours !",
  "description.devil.bear":
    "Mieux vaut connaître le Diable que ne pas le connaître",
  "description.collectible.bear":
    "Un ours de collection, toujours en parfait état !",
  "description.cyborg.bear": "Hasta la vista, ours",
  "description.christmas.snow.globe":
    "Faites tourbillonner la neige et regardez-la prendre vie",
  "description.kraken.tentacle":
    "Plongez dans le mystère des profondeurs marines ! Cette tentacule évoque des contes de légendes océaniques anciennes et de merveilles aquatiques.",
  "description.kraken.head":
    "Plongez dans le mystère des profondeurs marines ! Cette tête évoque des contes de légendes océaniques anciennes et de merveilles aquatiques.",
  "description.abandoned.bear": "Un ours qui a été laissé derrière sur l'île.",
  "description.turtle.bear": "Assez tortue pour le club des tortues.",
  "description.trex.skull": "Un crâne de T-Rex ! Incroyable !",
  "description.sunflower.coin": "Une pièce faite de tournesols.",
  "description.skeleton.king.staff": "Vive le Roi Squelette !",
  "description.lifeguard.bear":
    "L'ours sauveteur est là pour sauver la journée !",
  "description.snorkel.bear": "L'ours avec tuba adore nager.",
  "description.parasaur.skull": "Un crâne de parasaur !",
  "description.goblin.bear": "Un ours gobelin. C'est un peu effrayant.",
  "description.golden.bear.head": "Effrayant, mais cool.",
  "description.pirate.bear": "Argh, matelot ! Serre-moi dans tes bras !",
  "description.galleon": "Un bateau jouet, encore en assez bon état.",
  "description.dinosaur.bone":
    "Un os de dinosaure ! Quel genre de créature était-ce ?",
  "description.human.bear":
    "Un ours humain. Encore plus effrayant qu'un ours gobelin.",
  "description.flamingo":
    "Représente un symbole de la beauté de l'amour, se tenant grand et confiant.",
  "description.blossom.tree":
    "Ses pétales délicats symbolisent la beauté et la fragilité de l'amour.",
  "description.heart.balloons":
    "Utilisez-les comme décorations pour des occasions romantiques.",
  "description.whale.bear":
    "Il a un corps rond et poilu comme un ours, mais avec les nageoires, la queue et l'évent d'une baleine.",
  "description.valentine.bear": "Pour ceux qui aiment.",
  "description.easter.bear": "Comment un lapin peut-il pondre des œufs ?",
  "description.easter.bush": "Qu'y a-t-il à l'intérieur ?",
  "description.giant.carrot":
    "Une carotte géante se dresse, projetant des ombres amusantes, tandis que les lapins regardent avec émerveillement.",
  "description.beach.ball":
    "Une balle rebondissante apporte des vibrations de plage, éloignant l'ennui.",
  "description.palm.tree":
    "Grande, balnéaire, ombragée et chic, les palmiers font onduler les vagues.",

  //other
  "description.sunflower.amulet": "Rendement de tournesols augmenté de 10%",
  "description.carrot.amulet": "Les carottes poussent 20% plus vite",
  "description.betroot.amulet": "Rendement de betteraves augmenté de 20%",
  "description.green.amulet": "Chance d'un rendement de récolte 10x",
  "description.warrior.shirt": "La marque d'un vrai guerrier",
  "description.warrior.pants": "Protégez vos cuisses",
  "description.warrior.helmet": "Immunisé contre les flèches",
  "description.sunflower.shield":
    "Un héros de Sunflower Land. Graines de tournesol gratuites !",
  "description.skull.hat": "Un chapeau rare pour votre Bumpkin.",
  "description.undead.rooster": "",
  "description.sunflower.statue": "Un symbole du jeton sacré",
  "description.potato.statue": "Le flex du hustler de pommes de terre OG",
  "description.christmas.tree":
    "Recevez un largage aérien du Père Noël le jour de Noël",
  "description.gnome": "Un gnome chanceux",
  "description.homeless.tent": "Une tente agréable et confortable",
  "description.sunflower.tombstone": "En mémoire des fermiers de tournesols",
  "description.sunflower.rock": "Le jeu qui a brisé Polygon",
  "description.goblin.crown": "Invoquez le chef des Gobelins",
  "description.fountain": "Une fontaine relaxante pour votre ferme",
  "description.nyon.statue": "En mémoire de Nyon Lann",
  "description.farmer.bath": "Un bain parfumé à la betterave pour les fermiers",
  "description.woody.Beaver": "Augmente les récoltes de bois de 20%",
  "description.apprentice.beaver": "Les arbres se régénèrent 50% plus vite",
  "description.foreman.beaver": "Coupez des arbres sans haches",
  "description.egg.basket": "Donne accès à la chasse aux œufs de Pâques",
  "description.mysterious.head": "Une statue censée protéger les fermiers",
  "description.tunnel.mole":
    "Augmente de 25% la production des mines de pierre",
  "description.rocky.the.mole":
    "Augmente de 25% la production des mines de fer",
  "description.nugget": "Augmente de 25% la production des mines d'or",
  "description.rock.golem": "10% de chance d'obtenir 3x plus de pierre",
  "description.chef.apron":
    "Donne 20% de SFL supplémentaires en vendant des gâteaux",
  "description.chef.hat": "La couronne d'un boulanger légendaire !",
  "description.nancy":
    "Éloigne quelques corbeaux. Les cultures poussent 15% plus vite",
  "description.scarecrow":
    "Un épouvantail de gobelin. Rendement de récolte augmenté de 20%",
  "description.kuebiko":
    "Même le commerçant a peur de cet épouvantail. Les graines sont gratuites",
  "description.golden.cauliflower": "Double le rendement du chou-fleur",
  "description.mysterious.parsnip": "Les panais poussent 50% plus vite",
  "description.carrot.sword":
    "Augmente la chance qu'une récolte mutante apparaisse",
  "description.chicken.coop": "Collectez 2x plus d'œufs",
  "description.farm.cat": "Éloignez les rats",
  "description.farm.dog": "Conduisez les moutons avec votre chien de ferme",
  "description.gold.egg": "Nourrissez les poules sans avoir besoin de blé",
  "description.easter.bunny": "Gagnez 20% de carottes en plus",
  "description.rooster":
    "Double la chance de faire apparaître un poulet mutant",
  "description.chiken":
    "Produit des œufs. Nécessite du blé pour l'alimentation",
  "description.cow": "Produit du lait. Nécessite du blé pour l'alimentation",
  "description.pig": "Produit du fumier. Nécessite du blé pour l'alimentation",
  "description.sheep":
    "Produit de la laine. Nécessite du blé pour l'alimentation",
  "description.basic.land": "Un morceau de terre basique",
  "description.crop.plot": "Une parcelle vide pour planter des cultures",
  "description.gold.rock": "Un rocher exploitable pour collecter de l'or",
  "description.iron.rock": "Un rocher exploitable pour collecter du fer",
  "description.stone.rock": "Un rocher exploitable pour collecter de la pierre",
  "description.ruby.rock": "Un rocher exploitable pour collecter du rubis",
  "description.flower.bed": "Une parcelle vide pour planter des fleurs",
  "description.tree": "Un arbre à couper pour collecter du bois",
  "description.fruit.patch": "Une parcelle vide pour planter des fruits",
  "description.boulder": "Un rocher mythique pouvant lâcher des minéraux rares",
  "description.catch.the.kraken.banner":
    "Le Kraken est là ! La marque d'un participant à la saison 'Attrapez le Kraken'.",
  "description.luminous.lantern":
    "Une lanterne en papier lumineuse qui éclaire le chemin.",
  "description.radiance.lantern":
    "Une lanterne en papier rayonnante qui brille d'une lumière puissante.",
  "description.ocean.lantern":
    "Une lanterne en papier ondulée qui se balance au rythme des marées.",
  "description.solar.lantern":
    "Capturant l'essence vibrante des tournesols, la Lanterne Solaire émet une lueur chaude et rayonnante.",
  "description.aurora.lantern":
    "Une lanterne en papier qui transforme tout espace en un pays des merveilles magique.",
  "description.dawn.umbrella":
    "Gardez ces aubergines au sec pendant les jours de pluie avec le Siège Parapluie Aube.",
  "description.eggplant.grill":
    "Cuisinez avec le Grill Aubergine, parfait pour tout repas en plein air.",
  "description.giant.dawn.mushroom":
    "Le Champignon Géant Aube est un ajout majestueux et magique à toute ferme.",
  "description.shroom.glow":
    "Illuminez votre ferme avec la lueur envoûtante de Shroom Glow.",
  "description.clementine":
    "Le Gnome Clémentine est un compagnon joyeux pour vos aventures agricoles.",
  "description.cobalt":
    "Le Gnome Cobalt ajoute une touche de couleur à votre ferme avec son chapeau vibrant.",
  "description.hoot": "Hou hou ! Avez-vous résolu mon énigme ?",
  "description.genie.bear": "Exactement ce que je souhaitais !",
  "description.betty.lantern":
    "Ça a l'air tellement réel ! Je me demande comment ils l'ont fabriqué.",
  "description.bumpkin.lantern":
    "En se rapprochant, vous entendez des murmures d'un Bumpkin vivant... effrayant !",
  "description.eggplant.bear": "La marque d'une baleine d'aubergine généreuse.",
  "description.goblin.lantern": "Une lanterne d'aspect effrayant",
  "description.dawn.flower":
    "Embrassez la beauté rayonnante de la Fleur de l'Aube alors que ses délicats pétales scintillent avec la première lumière du jour",
  "description.kernaldo.bonus": "+25% de vitesse de croissance du maïs",
  "description.white.crow": "Un corbeau blanc mystérieux et éthéré",
  "description.sapo.docuras": "Un vrai régal !",
  "description.sapo.travessuras": "Oh oh... quelqu'un a été vilain",
  "description.walrus":
    "Avec ses défenses fiables et son amour pour les profondeurs, il vous assurera de pêcher un poisson supplémentaire à chaque fois",
  "description.alba":
    "Avec ses instincts aiguisés, elle vous assure un petit plus dans votre pêche. 50% de chance de +1 Poisson Basique !",
  "description.knowledge.crab":
    "Le Crabe de la Connaissance double l'effet de votre Mélange de Germes, rendant vos trésors du sol aussi riches que le butin marin !",
  "description.anchor":
    "Jetez l'ancre avec ce joyau nautique, rendant chaque endroit digne de la mer et éclaboussant de style !",
  "description.rubber.ducky":
    "Flottez sur le plaisir avec ce canard classique, apportant de la joie pétillante à chaque coin !",
  "description.arcade.token":
    "Un jeton gagné lors de mini-jeux et d'aventures. Peut être échangé contre des récompenses.",
  "description.bumpkin.nutcracker": "Une décoration festive de 2023.",
  "description.festive.tree":
    "Un arbre festif disponible chaque saison des fêtes. Je me demande s'il est assez grand pour que le Père Noël le voie ?",
  "description.white.festive.fox":
    "La bénédiction du Renard Blanc habite les fermes généreuses",
  "description.grinxs.hammer":
    "Le marteau magique de Grinx, le légendaire forgeron gobelin.",
  "description.angelfish":
    "La beauté céleste aquatique, ornée d'une palette de couleurs vibrantes.",
  "description.halibut":
    "L'habitant du fond de l'océan plat, maître du déguisement en camouflage sableux.",
  "description.parrotFish":
    "Un kaléidoscope de couleurs sous les vagues, ce poisson est une œuvre d'art vivante de la nature.",
  "description.Farmhand": "Un aide agricole utile",
  "description.Beehive":
    "Une ruche animée, produisant du miel à partir de fleurs en pleine croissance ; 10 % de chance lors de la récolte du miel d'invoquer un essaim d'abeilles qui pollinisera toutes les cultures en croissance avec un bonus de +0.2 !",

  // Banners
  "description.goblin.war.banner":
    "Une marque d'allégeance à la cause des Gobelins",
  "description.human.war.banner":
    "Une marque d'allégeance à la cause des Humains",
};

const delivery: Record<Delivery, string> = {
  "delivery.panel.one":
    "Hmm, il semble que votre ferme n'aura pas les ressources dont j'ai besoin. Atteignez la ",
  "delivery.panel.two": "ième expansions et revenez me voir.",
  "delivery.panel.three": "Livraison : Aucune commande sélectionnée",
  "delivery.panel.four":
    "J'attends le début de la nouvelle saison. Revenez me voir à ce moment-là !",
  "delivery.ressource": "Voulez-vous que je livre des ressources ?",
  "delivery.feed": "Ce n'est pas gratuit, j'ai une tribu à nourrir !",
  "delivery.fee": "Je prendrai 30% des ressources pour le ",
};

const deliveryHelp: Record<DeliveryHelp, string> = {
  "deliveryHelp.pumpkinSoup":
    "Rassemblez les ingrédients et prenez un bateau pour le Pumpkin Plaza afin de livrer des commandes aux Bumpkins en échange d'une récompense !",
  "deliveryHelp.hammer":
    "Agrandissez votre terre pour débloquer plus d'emplacements et accélérer les commandes de livraison",
  "deliveryHelp.axe":
    "Terminez vos tâches et retrouvez Hank au Plaza pour réclamer vos récompenses.",
  "deliveryHelp.chest":
    "Construisez des relations avec les Bumpkins en complétant plusieurs commandes pour débloquer des récompenses bonus. (Bientôt disponible)  ",
};

const depositWallet: Record<DepositWallet, string> = {
  "deposit.errorLoadingBalances":
    "Une erreur s'est produite lors du chargement de vos soldes.",
  "deposit.yourPersonalWallet": "Votre Portefeuille Personnel",
  "deposit.farmWillReceive": "Votre ferme recevra :",
  "deposit.depositDidNotArrive": "Le dépôt n'est pas arrivé ?",
  "deposit.goblinTaxInfo":
    "Lorsque les joueurs retirent des SFL, une Taxe de Goblin est appliquée.",
  "deposit.applied": "est appliquée.",
  "deposit.sendToFarm": "Envoyer à la ferme",
  "deposit.toDepositLevelUp":
    "Pour déposer des objets, vous devez d'abord monter de niveau",
  "deposit.level": "Niveau 3",
  "deposit.noSflOrCollectibles": "Aucun SFL ou objet de collection trouvé !",
  "deposit.farmAdresse": "Adresse de la ferme :",
  "question.depositSFLItems":
    "Souhaitez-vous déposer des objets de collection, des vêtements ou des SFL de Sunflower Land ?",
};

const detail: Record<Detail, string> = {
  "detail.how.item": "Comment obtenir cet article ?",
  "detail.Claim.Reward": "Réclamer la récompense",
  "detail.basket.empty": "Votre panier est vide !",
  "detail.view.item": "View item on,",
};

const discordBonus: Record<DiscordBonus, string> = {
  "discord.bonus.niceHat": "Wow, joli chapeau !",
  "discord.bonus.attentionEvents":
    "N'oubliez pas de prêter attention aux événements spéciaux et aux cadeaux sur Discord pour ne rien manquer.",
  "discord.bonus.bonusReward": "Récompense bonus",
  "discord.bonus.payAttention":
    "Faites attention aux événements spéciaux et aux cadeaux sur Discord pour ne rien manquer.",
  "discord.bonus.enjoyCommunity":
    "Nous espérons que vous appréciez faire partie de notre communauté !",
  "discord.bonus.claimGift": "Réclamer le cadeau",
  "discord.bonus.communityInfo":
    "Saviez-vous qu'il y a plus de 100 000 joueurs dans notre communauté Discord ?",
  "discord.bonus.farmingTips":
    "Si vous cherchez des astuces et conseils pour l'agriculture, c'est l'endroit idéal.",
  "discord.bonus.freeGift":
    "Le meilleur... tout le monde qui rejoint reçoit un cadeau gratuit !",
  "discord.bonus.connect": "Se connecter à Discord",
};

const donation: Record<Donation, string> = {
  "donation.one":
    "Ceci était une initiative artistique communautaire et les dons sont grandement appréciés !",
  "donation.amount": "Montant en MATIC",
  "donation.donate": "Faire un don",
  "donation.donating": "Don en cours",
  "donation.Ty": "Merci !",
  "donation.wrong": "Oh non ! Quelque chose s'est mal passé !",
};

const errorAndAccess: Record<ErrorAndAccess, string> = {
  "errorAndAccess.warning": "Avertissement",
  "errorAndAccess.blocked.betaTestersOnly":
    "Accès limité aux testeurs bêta uniquement",
  "errorAndAccess.denied.message": "Vous n'avez pas encore accès au jeu.",
  "errorAndAccess.instructions.part1": "Assurez-vous d'avoir rejoint le ",
  "errorAndAccess.sflDiscord": "Discord de Sunflower Land",
  "errorAndAccess.instructions.part2":
    ", allez sur le canal #verify et obtenez le rôle de 'fermier'.",
  "errorAndAccess.try.again": "Réessayer  ",
};

const errorTerms: Record<ErrorTerms, string> = {
  "error.blocked.betaTestersOnly": "Réservé aux bêta-testeurs !",
  "error.congestion.one":
    "Nous faisons de notre mieux, mais il semble que Polygon reçoive beaucoup de trafic ou que vous ayez perdu votre connexion.",
  "error.congestion.two":
    "Si cette erreur persiste, veuillez essayer de changer votre RPC Metamask",
  "error.connection.one":
    "Il semble que nous n'ayons pas pu compléter cette demande.",
  "error.connection.two": "Cela peut être un simple problème de connexion.",
  "error.connection.three":
    "Vous pouvez cliquer sur actualiser pour réessayer.",
  "error.connection.four":
    "Si le problème persiste, vous pouvez demander de l'aide en contactant notre équipe de support ou en rejoignant notre discord pour demander à notre communauté.",
  "error.diagnostic.info": "Informations de diagnostic",
  "error.forbidden.goblinVillage":
    "Vous n'êtes pas autorisé à visiter le Village des Gobelins !",
  "error.multipleDevices.one": "Plusieurs appareils ouverts",
  "error.multipleDevices.two":
    "Veuillez fermer les autres onglets de navigateur ou appareils que vous utilisez.",
  "error.multipleWallets.one": "Plusieurs portefeuilles",
  "error.multipleWallets.two":
    "Il semble que vous ayez plusieurs portefeuilles installés. Cela peut causer un comportement inattendu. Essayez de désactiver tous les portefeuilles sauf un.",
  "error.polygonRPC":
    "Veuillez réessayer ou vérifier vos paramètres RPC Polygon.",
  "error.toManyRequest.one": "Trop de demandes !",
  "error.toManyRequest.two":
    "On dirait que vous avez été occupé ! Veuillez réessayer plus tard.",
  "error.Web3NotFound": "Web3 introuvable",
  "error.wentWrong": "Quelque chose a mal tourné !",
  "error.noBumpkin": "Bumpkin n'est pas défini",
  "error.clock.not.synced": "Horloge non synchronisée",
  "error.polygon.cant.connect": "Impossible de se connecter à Polygon",
  "error.composterNotExist": "Le composteur n'existe pas",
  "error.composterNotProducing": "Le composteur ne produit pas",
  "error.composterAlreadyDone": "Composteur déjà terminé",
  "error.composterAlreadyBoosted": "Déjà boosté",
  "error.missingEggs": "Œufs manquants",
  "error.noBumpkin1": "Vous n'avez pas de Bumpkin",
  "error.insufficientSFL": "SFL insuffisant",
  "error.insufficientSpaceForChickens":
    "Espace insuffisant pour plus de poulets",
  "error.noBumpkin2": "Vous n'avez pas de Bumpkin",
  "error.dailyAttemptsExhausted": "Tentatives quotidiennes épuisées",
  "error.missingRod": "Canne à pêche manquante",
  "error.missingBait": "Appât manquant : {bait}",
  "error.alreadyCasted": "Déjà lancé",
  "error.unsupportedChum": "{chum} n'est pas un appât pris en charge",
  "error.insufficientChum": "Appât insuffisant :",
  "error.alr.composter": "Le composteur est déjà en train de composter",
  "error.no.alr.composter": "Le composteur n'est pas prêt à produire",
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
  "error.insufficientIngredient": "Ingrédient insuffisant :",
  "error.itemNotExist": "L'objet n'existe pas",
  "error.notEnoughStock": "Stock insuffisant",
  "error.tooEarly": "Trop tôt",
  "error.tooLate": "Trop tard",
  "error.decorationCollides": "La décoration entre en collision",
  "error.idAlreadyExists": "L'ID existe déjà",
};

const exoticShopItems: Record<ExoticShopItems, string> = {
  "exoticShopItems.line1":
    "Notre boutique de haricots ferme ses portes car nos haricots entament un nouveau voyage avec un scientifique fou.",
  "exoticShopItems.line2":
    "Merci de faire partie de notre communauté d'amoureux des légumineuses.",
  "exoticShopItems.line3": "Cordialement,",
  "exoticShopItems.line4": "L'Équipe des Haricots",
};

const festivetree: Record<FestiveTree, string> = {
  "festivetree.greedyBumpkin": "Bumpkin avide détecté",
  "festivetree.alreadyGifted":
    "Cet arbre a déjà été offert. Attendez le prochain Noël pour plus de festivités.",
  "festivetree.notFestiveSeason":
    "Ce n'est pas la saison festive. Revenez plus tard.",
};

const fishDescriptions: Record<FishDescriptions, string> = {
  // Fish
  "description.anchovy.one":
    "L'acrobate miniature pressé de l'océan, toujours en mouvement !",
  "description.anchovy.two": "Petit poisson, grande saveur !",
  "description.butterflyfish.one":
    "Un poisson à la mode, exhibant ses rayures vives et élégantes.",
  "description.butterflyfish.two": "Nagez dans les couleurs et les saveurs !",
  "description.blowfish.one":
    "Le comique rond et gonflé de la mer, garanti pour vous faire sourire.",
  "description.blowfish.two": "Dînez avec danger, une surprise épineuse !",
  "description.clownfish.one":
    "Le bouffon sous-marin, arborant un smoking tangerine et un charme clownesque.",
  "description.clownfish.two":
    "Pas de blagues, juste de la délicieuseté pure !",
  "description.seabass.one":
    "Votre ami 'pas si excitant' aux écailles argentées - une prise de base !",
  "description.seabass.two": "L'essentiel de la cuisine en bord de mer !",
  "description.seahorse.one":
    "Le danseur au ralenti de l'océan, se balançant gracieusement dans le ballet aquatique.",
  "description.seahorse.two": "Délicat, rare et étonnamment savoureux !",
  "description.horsemackerel.one":
    "Un coureur avec un pelage brillant, toujours en course à travers les vagues.",
  "description.horsemackerel.two":
    "Galopez à travers les saveurs à chaque bouchée !",
  "description.squid.one":
    "L'énigme des profondeurs avec des tentacules pour titiller votre curiosité.",
  "description.squid.two": "Encrez votre chemin vers des saveurs exquises !",
  "description.redsnapper.one":
    "Une prise digne de son poids en or, vêtue de rouge cramoisi ardent.",
  "description.redsnapper.two":
    "Plongez dans des océans de saveurs riches et zestées !",
  "description.morayeel.one":
    "Un traînard sournois dans les coins ombragés de l'océan.",
  "description.morayeel.two": "Glissant, savoureux et sensationnel !",
  "description.oliveflounder.one":
    "Le maître du camouflage du fond marin, toujours confondu avec la foule.",
  "description.oliveflounder.two": "Tâtonnez dans la richesse et la saveur !",
  "description.napoleanfish.one":
    "Rencontrez le poisson au complexe de Napoléon - petit, mais royal !",
  "description.napoleanfish.two": "Conquérez votre faim avec cette prise !",
  "description.surgeonfish.one":
    "Le guerrier néon de l'océan, armé d'une attitude tranchante.",
  "description.surgeonfish.two": "Opérez vos papilles avec précision !",
  "description.zebraturkeyfish.one":
    "Des rayures, des épines et une disposition zestée, ce poisson est un véritable arrêt sur image !",
  "description.zebraturkeyfish.two":
    "Rayé, épineux et spectaculairement savoureux !",
  "description.ray.one":
    "Le planeur sous-marin, une belle aile sereine à travers les vagues.",
  "description.ray.two": "Planez dans un monde de saveurs riches !",
  "description.hammerheadshark.one":
    "Rencontrez le requin à tête d'affiche, avec une tête pour les affaires et un corps pour l'aventure !",
  "description.hammerheadshark.two": "Un choc frontal avec la saveur !",
  "description.tuna.one":
    "Le sprinter musclé de l'océan, prêt pour une course fantastique de nageoires !",
  "description.tuna.two": "Un titan de la saveur dans chaque tranche !",
  "description.mahimahi.one":
    "Un poisson qui croit vivre la vie en couleurs avec des nageoires dorées.",
  "description.mahimahi.two": "Double le nom, double la déliciosité !",
  "description.bluemarlin.one":
    "Une légende océanique, le marlin avec une attitude aussi profonde que la mer.",
  "description.bluemarlin.two":
    "Dirigez votre appétit avec cette prise royale !",
  "description.oarfish.one":
    "Le long et le long de lui - un voyageur océanique énigmatique.",
  "description.oarfish.two": "Ramez vers une saveur légendaire !",
  "description.footballfish.one":
    "Le MVP des profondeurs, une étoile bioluminescente prête à jouer !",
  "description.footballfish.two": "Marquez un touchdown en saveur !",
  "description.sunfish.one":
    "Le preneur de soleil de l'océan, se prélassant sous les projecteurs avec des nageoires bien levées.",
  "description.sunfish.two":
    "Prélassez-vous dans l'éclat de sa saveur délectable !",
  "description.coelacanth.one":
    "Un vestige préhistorique, avec un goût pour le passé et le présent.",
  "description.coelacanth.two":
    "Une saveur préhistorique qui a résisté à l'épreuve du temps !",
  "description.whaleshark.one":
    "Le doux géant des profondeurs, filtrant les trésors du buffet de l'océan.",
  "description.whaleshark.two":
    "Un festin colossal pour des envies monumentales !",
  "description.barredknifejaw.one":
    "Un hors-la-loi océanique avec des rayures en noir et blanc et un cœur en or.",
  "description.barredknifejaw.two":
    "Tranchez la faim avec des saveurs tranchantes !",
  "description.sawshark.one":
    "Avec un museau en forme de scie, c'est le menuisier de l'océan, toujours à la pointe !",
  "description.sawshark.two": "Saveur de pointe des profondeurs !",
  "description.whiteshark.one":
    "Le requin au sourire meurtrier, régnant sur les mers avec une intensité de nageoire !",
  "description.whiteshark.two": "Plongez dans un océan de saveur palpitante !",

  // Marine Marvels
  "description.twilight.anglerfish":
    "Un poisson-hameçon des profondeurs avec une lumière intégrée, guidant son chemin dans l'obscurité.",
  "description.starlight.tuna":
    "Un thon qui brille plus que les étoiles, prêt à illuminer votre collection.",
  "description.radiant.ray":
    "Une raie qui préfère briller dans l'obscurité, avec un secret scintillant à partager.",
  "description.phantom.barracuda":
    "Un poisson-barracuda insaisissable et spectral des profondeurs, se cachant dans les ombres.",
  "description.gilded.swordfish":
    "Un poisson-épée aux écailles qui scintillent comme de l'or, la prise ultime !",
};

const fishermanModal: Record<FishermanModal, string> = {
  "fishermanModal.attractFish":
    "Attirez les poissons en jetant de l'appât dans l'eau.",
  "fishermanModal.royChallenge":
    "Ahoy, amis insulaires ! Je suis Reelin' Roy, votre fidèle pêcheur insulaire, et je me suis lancé un grand défi – attraper tous les poissons sous le soleil !",
  "fishermanModal.fishBenefits":
    "Les poissons sont excellents à manger, à livrer et à réclamer des récompenses !",
  "fishermanModal.baitAndResources":
    "Apportez-moi des appâts et des ressources et nous attraperons les plus rares trésors que l'océan a à offrir !",
  "fishermanModal.crazyHappening":
    "Wow, quelque chose de fou se passe...... C'est une frénésie de poissons !",
  "fishermanModal.bonusFish":
    "Dépêchez-vous, vous obtiendrez un poisson bonus pour chaque prise !",
  "fishermanModal.dailyLimitReached":
    "Vous avez atteint votre limite quotidienne de pêche de {dailyFishingMax}.",
  "fishermanModal.needCraftRod":
    "Vous devez d'abord fabriquer une canne à pêche.",
  "fishermanModal.craft.beach": "Fabriquer à la plage",
  "fishermanModal.zero.available": "0 Disponible",
  "fishermanmodal.greetingPart1": "Ahoy, compagnons insulaires ! Je suis ",
  "fishermanmodal.greetingPart2":
    " , votre fidèle pêcheur de l'île, et je me suis lancé un grand défi - collecter tous les poissons sous le soleil !",
};

const fishermanQuest: Record<FishermanQuest, string> = {
  "fishermanQuest.Ohno": "Oh non ! Il s'est échappé",
  "fishermanQuest.Newfish": "New fish",
};

const fishingChallengeIntro: Record<FishingChallengeIntro, string> = {
  "fishingChallengeIntro.powerfulCatch": "Une prise puissante vous attend !",
  "fishingChallengeIntro.useStrength":
    "Utilisez toute votre force pour la ramener.",
  "fishingChallengeIntro.stopGreenBar":
    "Arrêtez la barre verte sur le poisson pour réussir.",
  "fishingChallengeIntro.beQuick":
    "Soyez rapide - 3 essais ratés, et il s'échappe !  ",
};

const fishingGuide: Record<FishingGuide, string> = {
  "fishingGuide.catch.rod":
    "Fabriquez une canne et rassemblez des appâts pour pêcher.",
  "fishingGuide.bait.earn":
    "Les appâts peuvent être obtenus en compostant ou en fabriquant des leurres.",
  "fishingGuide.eat.fish":
    "Mangez du poisson pour faire évoluer votre Bumpkin ou effectuez des livraisons de poissons pour obtenir des récompenses.",
  "fishingGuide.discover.fish":
    "Explorez les eaux pour découvrir des poissons rares, accomplir des missions et débloquer des récompenses uniques dans le Codex.",
  "fishingGuide.condition":
    "Suivez les changements des marées ; certaines espèces de poissons ne sont disponibles que dans certaines conditions.",
  "fishingGuide.bait.chum":
    "Expérimentez avec différents types d'appâts et de chum pour maximiser vos chances de capturer diverses espèces de poissons.",
  "fishingGuide.legendery.fish":
    "Méfiez-vous des poissons légendaires ; ils nécessitent une compétence et une force exceptionnelles pour être capturés.",
};

const fishingQuests: Record<FishingQuests, string> = {
  "quest.basic.fish": "Attrapez chaque poisson de base",
  "quest.advanced.fish": "Attrapez chaque poisson avancé",
  "quest.all.fish": "Découvrez chaque poisson de base, avancé et expert",
  "quest.300.fish": "Attrapez 300 poissons",
  "quest.1500.fish": "Attrapez 1500 poissons",
  "quest.marine.marvel": "Attrapez chaque Marine Marvel",
  "quest.5.fish": "Attrapez 5 de chaque poisson",
};

const flowerbedguide: Record<Flowerbedguide, string> = {
  "flowerbedguide.craftRod":
    "Fabriquez une canne et rassemblez des appâts pour pêcher.",
  "flowerbedguide.earnBait":
    "Les appâts peuvent être obtenus par compostage ou en fabriquant des leurres.",
  "flowerbedguide.eatFish":
    "Mangez du poisson pour faire évoluer votre Bumpkin ou effectuez des livraisons de poissons pour obtenir des récompenses.",
  "flowerbedguide.exploreWaters":
    "Explorez les eaux pour découvrir des poissons rares, compléter des missions et débloquer des récompenses uniques dans le Codex.",
  "flowerbedguide.tidePatterns":
    "Suivez les changements de marées ; certaines espèces de poissons ne sont disponibles que dans certaines conditions.",
  "flowerbedguide.experimentBait":
    "Expérimentez avec différents types d'appâts et de combinaisons de chum pour maximiser vos chances de capturer diverses espèces de poissons.",
  "flowerbedguide.legendaryFish":
    "Méfiez-vous des poissons légendaires ; ils nécessitent une compétence et une force exceptionnelles pour être capturés.",
};

const foodDescriptions: Record<FoodDescriptions, string> = {
  // Fire Pit
  "description.pumpkin.soup": "Une soupe crémeuse que les gobelins adorent",
  "description.mashed.potato": "Ma vie, c'est la pomme de terre.",
  "description.bumpkin.broth":
    "Un bouillon nutritif pour reconstituer votre Bumpkin",
  "description.boiled.eggs":
    "Les œufs durs sont parfaits pour le petit-déjeuner",
  "description.kale.stew": "Un parfait booster pour votre Bumpkin !",
  "description.mushroom.soup": "Réchauffez l'âme de votre Bumpkin.",
  "description.reindeer.carrot":
    "Rudolph ne peut pas s'arrêter de les manger !",
  "description.kale.omelette": "Un petit-déjeuner sain",
  "description.cabbers.mash": "Choux et pommes de terre en purée",
  "description.popcorn": "Un snack croustillant fait maison classique.",
  "description.gumbo":
    "Un pot plein de magie ! Chaque cuillerée est une parade de Mardi Gras !",

  // Kitchen
  "description.roast.veggies":
    "Même les Gobelins doivent manger leurs légumes !",
  "description.bumpkin.salad": "Il faut garder votre Bumpkin en bonne santé !",
  "description.goblins.treat": "Les Gobelins en raffolent !",
  "description.cauliflower.burger": "Appel à tous les amateurs de chou-fleur !",
  "description.club.sandwich":
    "Rempli de carottes et de graines de tournesol grillées",
  "description.mushroom.jacket.potatoes":
    "Garnissez ces pommes de terre avec ce que vous avez !",
  "description.sunflower.crunch":
    "Un délice croustillant. Essayez de ne pas le brûler.",
  "description.bumpkin.roast": "Un plat traditionnel de Bumpkin",
  "description.goblin.brunch": "Un plat traditionnel des Gobelins",
  "description.fruit.salad": "Salade de fruits, Miam Miam",
  "description.bumpkin.ganoush": "Une tartinade d'aubergine rôtie zestée.",
  "description.chowder":
    "Le délice des marins dans un bol ! Plongez, il y a un trésor à l'intérieur !",
  "description.pancakes": "Un excellent début de journée pour un Bumpkin !",

  // Bakery
  "description.apple.pie": "La célèbre recette de Bumpkin Betty",
  "description.kale.mushroom.pie": "Une recette traditionnelle de Sapphiron",
  "description.cornbread": "Un pain ferme et doré, tout frais de la ferme.",
  "description.sunflower.cake": "Gâteau au tournesol",
  "description.potato.cake": "Gâteau à la pomme de terre",
  "description.pumpkin.cake": "Gâteau à la citrouille",
  "description.carrot.cake": "Gâteau aux carottes",
  "description.cabbage.cake": "Gâteau au chou",
  "description.beetroot.cake": "Gâteau à la betterave",
  "description.cauliflower.cake": "Gâteau au chou-fleur",
  "description.parsnip.cake": "Gâteau au panais",
  "description.radish.cake": "Gâteau au radis",
  "description.wheat.cake": "Gâteau au blé",
  "description.honey.cake": "A scrumptious cake!",
  "description.eggplant.cake": "Une délicieuse surprise sucrée de la ferme.",
  "description.orange.cake":
    "Content que nous ne cuisinions pas de pommes, n'est-ce pas ?",
  "description.pirate.cake":
    "Idéal pour les fêtes d'anniversaire sur le thème des pirates.",

  // Deli
  "description.blueberry.jam":
    "Les gobelins feraient n'importe quoi pour cette confiture",
  "description.fermented.carrots": "Vous avez un surplus de carottes ?",
  "description.sauerkraut": "Fini le chou ennuyeux !",
  "description.fancy.fries": "Choux et pommes de terre écrasées",
  "description.fermented.fish":
    "Délice audacieux ! Libérez le Viking en vous à chaque bouchée !",

  // Smoothie Shack
  "description.apple.juice": "Une boisson rafraîchissante et croquante",
  "description.orange.juice":
    "Le jus d'orange se marie parfaitement avec un Club Sandwich",
  "description.purple.smoothie": "Vous pouvez à peine goûter le chou",
  "description.power.smoothie":
    "Boisson officielle de la Société d'Haltérophilie des Bumpkins",
  "description.bumpkin.detox": "Lavez les péchés de la veille",
  "description.banana.blast":
    "Le carburant fruité ultime pour ceux qui ont une peau pour la puissance !",

  // Unused foods
  "description.roasted.cauliflower": "Le préféré des gobelins",
  "description.radish.pie": "Détestée par les humains, adorée par les gobelins",
};

const garbageCollector: Record<GarbageCollector, string> = {
  "garbageCollector.welcome": "Bienvenue dans ma modeste boutique.",
  "garbageCollector.description":
    "Je suis le Marchand de Déchets, et j'achèterai tout ce que vous avez - tant que c'est des ordures.",
  "garbageCollector.continue": "Continuer",
};

const gameDescriptions: Record<GameDescriptions, string> = {
  // Quest Items
  "description.goblin.key": "La clé du gobelin",
  "description.sunflower.key": "La clé du tournesol",
  "description.ancient.goblin.sword": "Une épée ancienne de gobelin",
  "description.ancient.human.warhammer": "Un marteau de guerre humain ancien",

  // Coupons
  "description.community.coin":
    "Une pièce de valeur qui peut être échangée contre des récompenses",
  "description.bud.seedling": "Un plant à échanger contre un NFT Bud gratuit",
  "description.gold.pass":
    "Un pass exclusif qui permet à son détenteur de fabriquer des NFT rares, de commercer, de retirer et d'accéder à du contenu bonus.",
  "description.rapid.growth":
    "À appliquer sur une culture pour qu'elle pousse deux fois plus vite",
  "description.bud.ticket":
    "Une place garantie pour Mint un Bud lors du lancement des NFT Sunflower Land Buds.",
  "description.potion.ticket":
    "Une récompense de la Maison des Potions. Utilisez ceci pour acheter des articles chez Garth.",
  "description.trading.ticket": "Échanges gratuits ! Woohoo !",
  "description.block.buck": "Un jeton précieux dans Sunflower Land !",
  "description.beta.pass":
    "Accédez en avant-première à des fonctionnalités pour les tests.",
  "description.war.bond": "Une marque d'un véritable guerrier",
  "description.allegiance": "Une démonstration d'allégeance",
  "description.jack.o.lantern": "Un objet spécial de l'événement d'Halloween",
  "description.golden.crop": "Une culture dorée brillante",
  "description.red.envelope": "Waouh, vous avez de la chance !",
  "description.love.letter": "Exprimez des sentiments d'amour",
  "description.solar.flare.ticket":
    "Un billet utilisé pendant la Saison de Solar Flare",
  "description.dawn.breaker.ticket":
    "Un billet utilisé pendant la Saison de Dawn Breake",
  "description.crow.feather":
    "Un billet utilisé pendant la Saison de Witches' Eve",
  "description.mermaid.scale":
    "Un billet utilisé pendant la Saison Catch the Kraken",
  "description.sunflower.supporter":
    "La marque d'un véritable supporter du jeu !",

  // Easter Items
  "description.egg.basket": "Événement de Pâques",
  "description.blue.egg": "Un œuf de Pâques bleu",
  "description.orange.egg": "Un œuf de Pâques orange",
  "description.green.egg": "Un œuf de Pâques vert",
  "description.yellow.egg": "Un œuf de Pâques jaune",
  "description.red.egg": "Un œuf de Pâques rouge",
  "description.pink.egg": "Un œuf de Pâques rose",
  "description.purple.egg": "Un œuf de Pâques violet",

  //class
  "description.sunflowerAmulet":
    "10 % de rendement supplémentaire pour les tournesols.",
  "description.carrotAmulet": "Les carottes poussent 20 % plus vite.",
  "description.beetrootAmulet":
    "20 % de rendement supplémentaire pour les betteraves.",
  "description.greenAmulet":
    "Chance d'obtenir un rendement décuplé pour les cultures.",
  "description.warriorShirt": "La marque d'un vrai guerrier.",
  "description.warriorPants": "Protégez vos cuisses !",
  "description.warriorHelmet": "Immunisé contre les flèches.",
  "description.sunflowerShield":
    "Un héros de Sunflower Land. Graines de tournesol gratuites !",
  "description.skullHat": "Une récompense pour vos efforts de guerre.",
  "description.warSkull": "Trois ennemis vaincus.",
  "description.warTombstone": "Une récompense pour vos efforts de guerre.",

  //Home
  "description.homeOwnerPainting":
    "Un tableau du propriétaire de cette maison.",
};

const gameTerms: Record<GameTerms, string> = {
  bumpkinLvl: "Niveau de Bumpkin",
  dailyLim: "Limite quotidienne de SFL",
  gobSwarm: "Essaim de Gobelins !",
  potions: "Potions",
  sflDiscord: "Serveur Discord Sunflower Land",
  "auction.winner": "Gagnant de l'Enchère !",
  "farm.banned": "Cette ferme est bannie",
  "proof.of.humanity": "Preuve d'Humanité",
  "no.sfl": "Aucun jeton SFL trouvé",
  "granting.wish": "Exaucement de votre vœu",
  "new.delivery.in": "Nouvelles livraisons disponibles dans : ",
  bumpkinBuzz: "Bumpkin Buzz",
};

const getContent: Record<GetContent, string> = {
  "getContent.error": "Erreur !",
  "getContent.joining": "Rejoindre",
  "getContent.congratulations": "Félicitations !",
  "getContent.accessGranted":
    "Vous avez maintenant accès. Allez vérifier le canal sur Discord",
  "getContent.connectToDiscord":
    "Vous devez être connecté à Discord pour rejoindre un canal restreint.",
  "getContent.connect": "Connecter",
  "getContent.getAccess": "Obtenez l'accès aux groupes restreints sur Discord",
  "getContent.requires": "Nécessite un",
  "getContent.join": "Rejoindre",
};

const getInputErrorMessage: Record<GetInputErrorMessage, string> = {
  "getInputErrorMessage.minimum": "L'enchère minimale est de ",
  "getInputErrorMessage.sfl": "SFL",
  "getInputErrorMessage.s": "s",
  "getInputErrorMessage.no.sfl": "Vous n'avez pas assez de SFL",
  "getInputErrorMessage.yes.sfl": "Vous n'avez pas assez",
  "getInputErrorMessage.auction": "L'enchère est terminée",
  "getInputErrorMessage.place.bid":
    "Êtes-vous sûr de vouloir placer cette enchère ?",
  "getInputErrorMessage.cannot.bid":
    "Les enchères ne peuvent pas être modifiées une fois qu'elles ont été placées.",
};

const goblin_messages: Record<GOBLIN_MESSAGES, string> = {
  "goblinMessages.msg1":
    "Hé toi ! Humain ! Apporte-moi de la nourriture sinon...",
  "goblinMessages.msg2":
    "J'ai toujours faim, tu as des friandises appétissantes pour moi ?",
  "goblinMessages.msg3":
    "Peu importe ce que c'est, donne-moi simplement de la nourriture !",
  "goblinMessages.msg4":
    "Si tu ne me donnes rien à manger, je pourrais commencer à te grignoter.",
  "goblinMessages.msg5":
    "J'ai entendu dire que la nourriture humaine est la meilleure, apporte-m'en !",
  "goblinMessages.msg6":
    "Hé, tu as de la nourriture qui ne me rendra pas malade ?",
  "goblinMessages.msg7":
    "Je commence à m'ennuyer de manger toujours la même chose, tu as quelque chose de différent ?",
  "goblinMessages.msg8":
    "J'ai faim de quelque chose de nouveau, tu as quelque chose d'exotique ?",
  "goblinMessages.msg9":
    "Salut, tu as des en-cas à partager ? Je promets que je ne les volerai pas... peut-être.",
  "goblinMessages.msg10":
    "Peu importe ce que c'est, donne-moi simplement de la nourriture !",
};

const goldpassModal: Record<GoldPassModal, string> = {
  "goldPass.unlockPower": "Débloquez la puissance du Gold Pass :",
  "goldPass.craftNFTs": "Fabriquer des NFTs rares",
  "goldPass.trade": "Échanger avec d'autres joueurs",
  "goldPass.participateAuction": "Participer aux enchères",
  "goldPass.withdrawTransferNFTs": "Retirer et transférer des NFTs",
  "goldPass.accessRestrictedAreas": "Accéder aux zones restreintes",
  "goldPass.readMore": "En savoir plus",
  "common.noThanks": "Non, merci",
  "goldPass.buyNow": "Achetez maintenant $",
  "goldPass.priceInMatic": "Le prix est payé en équivalent $MATIC de $",
};

const goldTooth: Record<GoldTooth, string> = {
  "goldTooth.intro.part1":
    "Arrr, mes compagnons ! La zone de fouille de trésors regorge de richesses et d'aventures, et elle ouvrira bientôt ses portes pour vous, fermiers audacieux !",
  "goldTooth.intro.part2":
    "Soyez prêts à rejoindre mon équipage, car la chasse aux richesses commence sous peu !",
};

const guideTerms: Record<GuideTerms, string> = {
  "guide.intro":
    "De modestes débuts à l'expertise en agriculture, ce guide vous couvre !",
  "gathering.description.one":
    "Pour prospérer dans Sunflower Land, maîtriser l'art de la collecte de ressources est essentiel. Commencez par équiper les outils appropriés pour collecter différentes ressources. Utilisez la fidèle hache pour abattre les arbres et obtenir du bois. Pour fabriquer des outils, visitez Workbench local et échangez vos SFL/ressources contre l'outil désiré.",
  "gathering.description.two":
    "À mesure que vous progressez et que vous collectez suffisamment de ressources, vous débloquerez la capacité d'agrandir votre territoire. L'agrandissement de votre terrain ouvre de nouveaux horizons dans Sunflower Land. Les expansions de terrain révèlent une mine de ressources, notamment des sols fertiles pour planter des cultures, des arbres majestueux, des dépôts de pierres précieuses, des veines de fer précieux, des gisements d'or scintillants, des parcelles de fruits délicieux et bien plus encore.",
  "gathering.description.three":
    "N'oubliez pas que la collecte de ressources et l'expansion du terrain sont l'épine dorsale de votre parcours agricole. Acceptez les défis et les récompenses qui accompagnent chaque étape, et regardez votre Sunflower Land prospérer avec une abondance de ressources et d'innombrables possibilités.",

  "crops.description.one":
    "Dans Sunflower Land, les cultures jouent un rôle crucial dans votre voyage vers la prospérité. En plantant et en récoltant des cultures, vous pouvez gagner des SFL (Sunflower Token) ou les utiliser pour fabriquer des recettes et des objets de valeur dans le jeu.",
  "crops.description.two":
    "Pour faire pousser des cultures, vous devez acheter les graines respectives dans la boutique du jeu. Chaque culture a un temps de croissance différent, allant d'une minute seulement pour les Tournesols à 36 heures pour le Chou frisé. Une fois que les cultures sont complètement développées, vous pouvez les récolter et récolter les récompenses.",
  "crops.description.three":
    "N'oubliez pas que, à mesure que vous agrandissez votre terrain et progressez dans le jeu, de plus en plus de cultures seront disponibles, offrant de plus grandes opportunités de gagner des SFL et d'explorer le vaste potentiel de l'économie agricole de Sunflower Land. Alors mettez-vous au travail, plantez ces graines et regardez vos cultures prospérer tout en récoltant votre chemin vers le succès !",

  "building.description.one":
    "Explorez la diversité des bâtiments disponibles à mesure que vous progressez dans Sunflower Land. Des poulaillers aux ateliers et au-delà, chaque structure apporte des avantages uniques à votre ferme. Profitez de ces bâtiments pour rationaliser vos opérations agricoles, augmenter la productivité et débloquer de nouvelles possibilités. Planifiez soigneusement votre disposition et profitez des récompenses qui accompagnent la construction d'une ferme prospère dans Sunflower Land.",
  "building.description.two":
    "Dans Sunflower Land, les bâtiments sont la pierre angulaire de votre voyage agricole. Pour accéder au menu des bâtiments, cliquez sur l'icône Inventaire et sélectionnez l'onglet Bâtiments. Choisissez la structure désirée et retournez à votre écran de ferme. Trouvez un espace ouvert, marqué en pelouse, et confirmez l'emplacement. Attendez que le minuteur se termine, et votre nouveau bâtiment sera prêt à être utilisé. Les bâtiments offrent divers avantages et débloquent des fonctionnalités de jeu passionnantes. Positionnez-les stratégiquement sur votre ferme pour maximiser l'efficacité et observez votre empire agricole grandir et prospérer.",

  "cooking.description.one":
    "La cuisine vous permet de nourrir votre Bumpkin et de l'aider à gagner des points d'expérience (XP) précieux. En utilisant les cultures que vous avez récoltées, vous pouvez préparer de délicieuses recettes dans différents bâtiments dédiés à la cuisine.",
  "cooking.description.two":
    "À partir du Foyer, chaque ferme a accès à des installations de base pour la cuisine dès le début. Cependant, à mesure que vous progressez, vous pouvez débloquer des bâtiments plus avancés tels que la Cuisine, la Boulangerie, la Charcuterie et le Stand à Smoothies, chacun offrant une plus grande variété de recettes et de délices culinaires.",
  "cooking.description.three":
    "Pour cuisiner, il suffit de sélectionner un bâtiment et de choisir une recette que vous souhaitez préparer. La recette fournira des détails sur les ingrédients requis, les XP gagnés lors de la consommation et le temps de préparation. Après avoir lancé le processus de cuisson, surveillez le minuteur pour savoir quand la nourriture sera prête à être collectée.",
  "cooking.description.four":
    "Une fois la nourriture prête, il vous suffira de la récupérer dans le bâtiment en cliquant dessus, puis elle sera automatiquement ajoutée à votre inventaire. Ensuite, vous pourrez interagir avec votre personnage Bumpkin NPC sur la ferme et lui donner la nourriture préparée, ce qui l'aidera à gagner de l'XP et à progresser davantage dans le jeu.",
  "cooking.description.five":
    "Expérimentez avec différentes recettes, débloquez de nouveaux bâtiments et découvrez la joie de cuisiner en nourrissant votre Bumpkin et en vous lançant dans une délicieuse aventure culinaire à Sunflower Land.",

  "animals.description.one":
    "Les poules dans Sunflower Land sont un ajout charmant à votre ferme, servant de source d'œufs pouvant être utilisés dans diverses recettes et créations artisanales. Pour commencer avec les poules, vous devrez atteindre le niveau de Bumpkin 9 et construire un Poulaier. À partir de là, vous avez la possibilité d'acheter des poules ou de placer celles que vous avez déjà. Il vous suffit de les faire glisser et de les déposer sur votre ferme, comme pour placer des bâtiments. Sur une ferme standard, chaque Poulaier peut abriter jusqu'à 10 poules, et si vous possédez le Coopératif de Poules SFT, cette limite s'étend à 15.",
  "animals.description.two":
    "Chaque poule a un indicateur au-dessus de sa tête, affichant son humeur ou ses besoins actuels. Cela peut aller de la faim, à la fatigue, en passant par le bonheur ou le prêt à éclore. Pour garder vos poules contentes et productives, nourrissez-les en sélectionnant du blé dans votre inventaire et en interagissant avec la poule. L'alimentation lance le minuteur des œufs, qui prend 48 heures pour que les œufs soient prêts à éclore. Une fois les œufs prêts, visitez votre ferme, vérifiez l'icône au-dessus de chaque poule et interagissez avec elles pour découvrir le type d'œuf qui a éclos. De temps en temps, vous pouvez même découvrir des poules mutantes rares, qui offrent des avantages spéciaux tels qu'une production d'œufs plus rapide, un rendement accru ou une réduction de la consommation de nourriture.",
  "animals.description.three":
    "Nourrir vos poules et collecter leurs œufs ajoute un élément dynamique et gratifiant à votre ferme dans Sunflower Land. Expérimentez avec des recettes, utilisez les œufs dans vos projets de fabrication et profitez des surprises offertes par les poules mutantes rares. Construisez une opération avicole prospère et récoltez les fruits de votre travail acharné en vous immergent dans le charmant monde des poules à Sunflower Land.",

  "crafting.description.one":
    "Dans Sunflower Land, la création d'objets NFT (tokens non fongibles) est un aspect crucial pour augmenter votre production agricole et accélérer votre progression. Ces objets spéciaux offrent divers bonus, tels que des boosts de croissance des cultures, des améliorations de la cuisine et des augmentations de ressources, qui peuvent considérablement accélérer votre voyage. En maximisant votre SFL (Sunflower Token), vous pouvez fabriquer des outils, collecter des ressources et agrandir votre terrain pour établir davantage votre empire agricole.",
  "crafting.description.two":
    "Pour commencer à fabriquer des objets, nous allons rendre visite à Igor, un artisan talentueux de Sunfloria. Après avoir pris le bateau et être arrivé à Sunfloria, rendez-vous en haut de l'île pour discuter avec Igor. Il propose actuellement un Épouvantail de base, qui booste la vitesse de croissance des Tournesols, des Pommes de terre et des Citrouilles. Il s'agit d'une excellente affaire qui nécessite l'échange de vos ressources contre l'épouvantail. Une fois obtenu, retournez sur votre île principale et entrez en mode conception en cliquant sur l'icône de main blanche en haut à droite du jeu.",
  "crafting.description.three":
    "En mode conception, vous pouvez placer stratégiquement des objets et réorganiser les ressources sur votre ferme pour optimiser sa disposition et améliorer son attrait visuel. Cette étape est cruciale pour maximiser l'efficacité de votre équipement fabriqué. Par exemple, placez l'épouvantail sur les parcelles que vous souhaitez booster. De plus, envisagez d'acheter des décorations pour ajouter du charme et de l'ordre à votre terrain.",
  "crafting.description.four":
    "En fabriquant de l'équipement et en le plaçant stratégiquement, vous pouvez amplifier vos compétences agricoles, créer une île dont vous pouvez être fier, et accélérer votre progression dans Sunflower Land.",

  "deliveries.description.one":
    "Les livraisons à Sunflower Land offrent une occasion passionnante d'aider les Gobelins affamés et les autres Bumpkins tout en gagnant des récompenses. Chaque jour, vous pourrez voir toutes les commandes que vous avez en cliquant sur le tableau de livraison en bas à gauche de l'écran. Les commandes ont été passées par quelques PNJ locaux que l'on peut trouver autour de la Pumpkin Plaza. Pour remplir une commande, vous devrez prendre un bateau pour la Pumpkin Plaza et chercher le PNJ qui attend la livraison. Une fois que vous les avez trouvés, cliquez sur eux pour livrer la commande et recevoir votre récompense.",
  "deliveries.description.two":
    "En tant que nouveau joueur, vous commencez avec trois emplacements de commande, mais à mesure que vous agrandissez votre ferme, vous débloquerez des emplacements supplémentaires, permettant aux joueurs avancés de prendre plus de commandes. De nouvelles commandes arrivent toutes les 24 heures, offrant une gamme de tâches allant de la production agricole à la cuisine et à la collecte de ressources. En remplissant les commandes, vous obtiendrez des bonus de palier, notamment des Block Bucks, des SFL, des cakex délicieux et d'autres récompenses. Le système de récompense est basé sur la difficulté de la demande, alors envisagez de prioriser les commandes offrant des récompenses plus importantes pour maximiser vos gains. Gardez un œil sur le tableau et relevez le défi avec diverses commandes, en montant de niveau et en débloquant de nouveaux bâtiments au besoin pour répondre à des demandes plus exigeantes.",

  "scavenger.description.one":
    "L'exploration à Sunflower Land offre des opportunités passionnantes pour découvrir des trésors cachés et collecter des ressources précieuses. Le premier aspect de l'exploration consiste à creuser des trésors sur Treasure Island, où vous pouvez devenir un chasseur de trésors pirate. En fabriquant une pelle à sable et en vous aventurant sur Treasure Island, vous pouvez creuser dans des zones de sable sombre pour découvrir divers trésors, y compris des butins, des décorations, et même des SFT anciens avec une utilité.",
  "scavenger.description.two":
    "Une autre forme d'exploration consiste à collecter des champignons sauvages qui apparaissent spontanément sur votre ferme et les îles environnantes. Ces champignons peuvent être collectés gratuitement et utilisés dans des recettes, des quêtes et la fabrication d'objets. Gardez un œil sur ces champignons, car ils se renouvellent toutes les 16 heures, avec une limite maximale de 5 champignons sur votre ferme. Si votre terrain est plein, les champignons apparaîtront sur les îles environnantes, vous assurant de ne pas manquer ces ressources précieuses.",

  "fruit.description.one":
    "Les fruits jouent un rôle important dans Sunflower Land en tant que ressource précieuse pouvant être vendue contre des SFL ou utilisée dans diverses recettes et fabrications. Contrairement aux cultures, les parcelles de fruits ont la capacité unique de se reconstituer plusieurs fois après chaque récolte, offrant une source durable de fruits pour les joueurs.",
  "fruit.description.two":
    "Pour planter des fruits, vous devrez acquérir des parcelles de fruits plus grandes, qui deviennent disponibles lors de la 9e-10e expansion de votre ferme.",
  "fruit.description.three":
    "En cultivant des fruits et en les intégrant dans vos stratégies agricoles, vous pouvez maximiser vos profits, créer des recettes délicieuses et débloquer de nouvelles possibilités dans Sunflower Land.",

  "seasons.description.one":
    "Les saisons à Sunflower Land apportent de l'excitation et de la fraîcheur au jeu, offrant aux joueurs de nouveaux défis et opportunités. Avec l'introduction de chaque saison, les joueurs peuvent s'attendre à une variété de nouveaux objets craftables, de décorations en édition limitée, d'animaux mutants et de trésors rares. Ces changements saisonniers créent une expérience de jeu dynamique et évolutive, encourageant les joueurs à adapter leurs stratégies et à explorer de nouvelles possibilités sur leurs fermes. De plus, les tickets saisonniers ajoutent un élément stratégique au jeu, car les joueurs doivent décider comment allouer judicieusement leurs tickets, que ce soit pour collecter des objets rares, opter pour des décorations en grande quantité, ou échanger des tickets contre des SFL. Le mécanisme saisonnier maintient le jeu captivant et garantit qu'il y a toujours quelque chose à anticiper à Sunflower Land.",
  "seasons.description.two":
    "La disponibilité d'objets saisonniers chez le Goblin Blacksmith ajoute une autre couche d'excitation. Les joueurs doivent rassembler les ressources requises et les tickets saisonniers pour fabriquer ces objets en quantité limitée, créant un sentiment de compétition et d'urgence. La planification à l'avance et la stratégie deviennent cruciales alors que les joueurs cherchent à sécuriser les objets souhaités avant que l'offre ne s'épuise. De plus, l'option d'échanger des tickets saisonniers contre des SFL offre de la flexibilité et permet aux joueurs de faire des choix conformes à leurs objectifs de jeu spécifiques. Avec les offres uniques de chaque saison et l'anticipation d'événements surprises, Sunflower Land maintient les joueurs engagés et divertis tout au long de l'année, favorisant une expérience agricole vibrante et toujours en évolution.",
  "pete.teaser.one": "Coupez les arbres",
  "pete.teaser.two": "Agrandis ton terrain",
  "pete.teaser.three": "Récolte les tournesols",
  "pete.teaser.four": "Vends les tournesols",
  "pete.teaser.five": "Achète des graines",
  "pete.teaser.six": "Plante les graines",
  "pete.teaser.seven": "Fabrique un épouvantail",
  "pete.teaser.eight": "Cuisine de la nourriture et monte de niveau",
};

const grubshop: Record<GrubShop, string> = {
  "message.grublinOrders":
    "Revenez demain pour voir les commandes des Grublins.",
  "message.orderFulfilled": "Commande exécutée",
  "message.grubShopClosed": "Le Grub Shop est fermé le mardi.",
  "message.moreOrdersIn": "Plus de commandes dans",
  "message.bonusOffer": "Offre Bonus",
  "message.earnSeasonalTickets":
    "Gagnez 10 Tickets Saisonniers pour chaque repas.",
};

const halveningCountdown: Record<HalveningCountdown, string> = {
  "halveningCountdown.approaching": "Le Halvening approche !",
  "halveningCountdown.description":
    "Lors du Halvening, tous les prix des cultures et certaines ressources sont divisés par deux. Cela rend plus difficile l'obtention de SFL.",
  "halveningCountdown.preparation": "Assurez-vous d'être prêt !",
  "halveningCountdown.title": "Halvening",
  "halveningCountdown.readMore": "En savoir plus",
};

const harvestflower: Record<Harvestflower, string> = {
  "harvestflower.noBumpkin": "Vous n'avez pas de Bumpkin",
  "harvestflower.noFlowerBed": "Il n'y a pas de parterre de fleurs",
  "harvestflower.noFlower": "Le parterre de fleurs n'a pas de fleur",
  "harvestflower.notReady": "La fleur n'est pas prête à être récoltée",
  "harvestflower.alr.plant": "Une fleur est déjà plantée ici.",
};

const harvestBeeHive: Record<HarvestBeeHive, string> = {
  "harvestBeeHive.notPlaced": "Cette ruche n'est pas placée.",
  "harvestBeeHive.noHoney": "Cette ruche ne contient pas de miel.",
};

const hayseedHankPlaza: Record<HayseedHankPlaza, string> = {
  "hayseedHankPlaza.cannotCompleteChore":
    "Impossible de terminer cette tâche ?",
  "hayseedHankPlaza.skipChore": "Passer la tâche",
  "hayseedHankPlaza.canSkipIn": "Vous pouvez passer cette tâche dans",
  "hayseedHankPlaza.wellDone": "Bien joué",
  "hayseedHankPlaza.lendAHand": "Prêter main-forte ?",
};

const hayseedHankV2: Record<HayseedHankV2, string> = {
  "hayseedHankv2.dialog1":
    "Eh bien, salut là, jeunes fripons ! Je suis Hayseed Hank, un vieux fermier Bumpkin chevronné, qui s'occupe de la terre comme au bon vieux temps.",
  "hayseedHankv2.dialog2":
    "Cependant, mes os ne sont plus ce qu'ils étaient. Si tu peux m'aider avec mes tâches quotidiennes, je te récompenserai avec des ",
  "hayseedHankv2.action": "Faisons-le",
  "hayseedHankv2.title": "Tâches Quotidiennes",
  "hayseedHankv2.newChoresAvailable": "Nouvelles tâches disponibles dans .",
  "hayseedHankv2.skipChores": "Tu peux passer les tâches chaque nouveau jour.",
  "hayseedHankv2.greeting":
    "Eh bien, salut là, jeunes fripons ! Je suis Hayseed Hank...",
};

const heliosSunflower: Record<HeliosSunflower, string> = {
  "heliosSunflower.title": "Clytie le Tournesol",
  "heliosSunflower.description":
    "Seul le véritable sauveur peut revenir et récolter ce Tournesol.",
  "confirmation.craft": "Êtes-vous sûr de vouloir fabriquer",
};

const henHouseTerms: Record<HenHouseTerms, string> = {
  "henHouse.chickens": "Poules",
  "henHouse.text.one": "Nourrissez-les de blé et collectez des œufs",
  "henHouse.text.two": "Poule Paresseuse",
  "henHouse.text.three":
    "Mettez votre poule au travail pour commencer à collecter des œufs !",
  "henHouse.text.four": "Poule Travailleuse",
  "henHouse.text.five": "Déjà placée et travaillant dur !",
  "henHouse.text.six":
    "Construisez un autre Hen House pour élever plus de poules",
};

const howToFarm: Record<HowToFarm, string> = {
  "howToFarm.title": "Comment cultiver ?",
  "howToFarm.stepOne": "1. Récoltez les cultures lorsqu'elles sont prêtes",
  "howToFarm.stepTwo": "2. Visitez la ville et cliquez sur le magasin",
  "howToFarm.stepThree": "3. Vendez les cultures au magasin contre des SFL",
  "howToFarm.stepFour": "4. Achetez des graines avec vos SFL",
  "howToFarm.stepFive": "5. Plantez les graines et attendez",
};

const howToSync: Record<HowToSync, string> = {
  "howToSync.title": "Comment synchroniser ?",
  "howToSync.description":
    "Tous vos progrès sont sauvegardés sur notre serveur de jeu. Vous devrez synchroniser sur la chaîne lorsque vous voudrez déplacer vos jetons, NFTs et ressources sur Polygon.",
  "howToSync.stepOne": "1. Ouvrez le menu",
  "howToSync.stepTwo": `2. Cliquez sur "Synchroniser sur la chaîne  "`,
};

const howToUpgrade: Record<HowToUpgrade, string> = {
  "howToUpgrade.title": "Comment améliorer ?",
  "howToUpgrade.stepOne": "1. Parlez à un gobelin bloquant les champs",
  "howToUpgrade.stepTwo": "2. Visitez la ville et cliquez sur la cuisine",
  "howToUpgrade.stepThree": "3. Préparez le plat que le gobelin désire",
  "howToUpgrade.stepFour":
    "4. Voilà ! Profitez de vos nouveaux champs et cultures",
};

const islandupgrade: Record<Islandupgrade, string> = {
  "islandupgrade.confirmUpgrade":
    "Êtes-vous sûr de vouloir passer à une nouvelle île.",
  "islandupgrade.warning":
    "Assurez-vous de ne pas avoir de cultures, de fruits, de bâtiments ou de poulets en cours. Ceux-ci seront retournés dans votre inventaire.",
  "islandupgrade.upgradeIsland": "Améliorer l'île",
  "islandupgrade.newOpportunities":
    "Une île exotique vous attend avec de nouvelles ressources et opportunités pour développer votre ferme.",
  "islandupgrade.confirmation":
    "Souhaitez-vous améliorer ? Vos ressources seront transférées en toute sécurité vers votre nouvelle île.",
  "islandupgrade.locked": "Verrouillé",
  "islandupgrade.continue": "Continuer",
  "islandupgrade.exploring": "Exploration",
  "islandupgrade.welcomePetalParadise": "Bienvenue au Paradis des Pétales !",
  "islandupgrade.itemsReturned":
    "Vos objets ont été retournés en toute sécurité dans votre inventaire.",
  "islandupgrade.notReadyExpandMore": "Vous n'êtes pas prêt. Développez",
  "islandupgrade.notReadyExpandMore.two": " expansions de plus.",
  "islandupgrade.exoticResourcesDescription":
    "Cette région de Sunflower Land est connue pour ses ressources exotiques. Étendez vos terres pour découvrir des fruits, des fleurs, des ruches d'abeilles et des minéraux rares !",
};

const interactableModals: Record<InteractableModals, string> = {
  "interactableModals.returnhome.message":
    "Souhaitez-vous retourner à la maison ?",
  "interactableModals.fatChicken.message":
    "Pourquoi ces Bumpkins ne me laissent-ils pas tranquille, je veux juste me détendre.",
  "interactableModals.lazyBud.message": "Eeeep ! Si fatigué.....",
  "interactableModals.bud.message":
    "Hmm, je ferais mieux de laisser ce bourgeon tranquille. Je suis sûr que son propriétaire le cherche",
  "interactableModals.walrus.message":
    "Arrr arr arrr ! La poissonnerie n'ouvrira pas tant que je n'ai pas mon poisson.",
  "interactableModals.plazaBlueBook.message1":
    "Pour invoquer les chercheurs, nous devons rassembler l'essence de la terre - des citrouilles, nourries par la terre, et des œufs, promesse de nouveaux commencements.",
  "interactableModals.plazaBlueBook.message2":
    "À la tombée de la nuit et sous le rayon argenté de la lune, nous offrons nos humbles cadeaux, espérant éveiller à nouveau leurs yeux vigilants.",
  "interactableModals.plazaOrangeBook.message1":
    "Nos vaillants défenseurs ont combattu avec bravoure, mais hélas, nous avons perdu la grande guerre, et les Moonseekers nous ont chassés de notre terre natale. Pourtant, nous gardons espoir, car un jour nous reprendrons ce qui était autrefois le nôtre.",
  "interactableModals.plazaOrangeBook.message2":
    "Jusqu'à ce jour, nous garderons Sunflower Land vivant dans nos cœurs et nos rêves, en attendant le jour de notre retour triomphant",
  "interactableModals.beachGreenBook.message1":
    "Lorsque tu cherches ces convoités Red Snappers, tente une approche inattendue",
  "interactableModals.beachGreenBook.message2":
    "Utilise des Pommes avec de l'appât Red Wiggler, et regarde ces beautés écarlates sauter pratiquement dans ton filet.",
  "interactableModals.beachBlueBook.message1":
    "Ne le dis pas à Shelly, mais j'essaie d'attirer des Saw Sharks sur la plage !",
  "interactableModals.beachBlueBook.message2":
    "J'ai expérimenté différents appâts dernièrement, mais le seul qui semble fonctionner est le Red Snapper.",
  "interactableModals.beachBlueBook.message3":
    "Ces chasseurs océaniques peuvent sentir un festin de Red Snapper à des kilomètres, alors ne sois pas surpris s'ils arrivent en charge.",
  "interactableModals.beachOrangeBook.message1":
    "Une nageoire rayonnante est apparue à la surface, je ne pouvais pas en croire mes yeux !",
  "interactableModals.beachOrangeBook.message2":
    "Heureusement, Tango était avec moi, il doit être mon porte-bonheur.",
  "interactableModals.plazaGreenBook.message1":
    "Les Bumpkins contrôlent ces îles, laissant nous, les gobelins, avec peu de travail et encore moins de nourriture.",
  "interactableModals.plazaGreenBook.message2":
    "Nous aspirons à l'égalité, un endroit à nous, où nous pouvons vivre et prospérer",
  "interactableModals.fanArt1.message":
    "Félicitations à Palisman, le gagnant du premier concours de Fan Art",
  "interactableModals.fanArt2.message":
    "Félicitations à Vergelsxtn, le gagnant du concours de Fan Art de la Dawn Breaker Party",
  "interactableModals.fanArt2.linkLabel": "Voir plus",
  "interactableModals.fanArt3.message":
    "L'endroit parfait pour une belle peinture. Je me demande ce qu'ils mettront ici ensuite...",
  "interactableModals.clubhouseReward.message1":
    "Patience, mon ami, les récompenses arrivent...",
  "interactableModals.clubhouseReward.message2":
    "Rejoins #bud-clubhouse sur Discord pour les dernières mises à jour.",
  "interactableModals.plazaStatue.message":
    "En l'honneur de Bumpkin Braveheart, le fermier inébranlable qui a rallié notre ville contre la horde de gobelins pendant les jours sombres de la guerre ancienne.",
  "interactableModals.dawnBook1.message1":
    "Depuis des siècles, notre famille protège Dawn Breaker Island. En tant que sonneur de cloche de l'île, nous avons averti des dangers venant du Nord, même lorsque des créatures ombragées menaçaient notre foyer.",
  "interactableModals.dawnBook1.message2":
    "Notre famille se tient comme la première ligne de défense contre l'obscurité se propageant depuis le Nord, mais hélas, nos sacrifices passent inaperçus.",
  "interactableModals.dawnBook1.message3":
    "Le jour viendra-t-il où notre dévouement sera reconnu ?",
  "interactableModals.dawnBook2.message1":
    "Les aubergines, elles sont plus que ce qu'elles semblent. Malgré leur extérieur sombre qui attire les créatures ombragées, elles apportent de la lumière à nos plats.",
  "interactableModals.dawnBook2.message2":
    "Grillées ou écrasées en ganoush de Bumpkin, leur polyvalence est inégalée. Les légumes de la famille des solanacées sont un symbole de notre résilience face à l'adversité.",
  "interactableModals.dawnBook3.message1":
    "Cher journal, l'arrivée des Bumpkins a apporté un rayon d'espoir.",
  "interactableModals.dawnBook3.message2":
    "Je rêve du jour où je pourrai piloter mon propre bateau vers Sunfloria, la terre où se rassemblent aventuriers et voyageurs.",
  "interactableModals.dawnBook3.message3":
    "J'ai entendu des murmures sur les préparations spéciales des Bumpkins là-bas - un phare de promesse en ces temps difficiles.",
  "interactableModals.dawnBook4.message1":
    "Les gnomes, leur attrait était trop puissant pour résister.",
  "interactableModals.dawnBook4.message2":
    "Les instructions de la Sorcière résonnaient dans mon esprit - 'Aligne les trois, et le pouvoir sera tien.'",
  "interactableModals.dawnBook4.message3":
    "Hélas, même les soldats aubergine n'ont pas pu garder la tentation à distance. Mais je ne faiblirai pas. Un jour, je revendiquerai le pouvoir que je mérite légitimement.",
  "interactableModals.timmyHome.message":
    "Oh, zut, j'aimerais vraiment que tu explores ma maison, mais Maman m'a dit de ne pas parler aux étrangers, peut-être que c'est mieux ainsi.",
  "interactableModals.windmill.message":
    "Ah, mon moulin est en réparation, je ne peux pas laisser quelqu'un fouiner pendant que je le répare, reviens plus tard.",
  "interactableModals.igorHome.message":
    "Fiche le camp ! Je ne suis pas d'humeur à recevoir des visiteurs, surtout des curieux comme toi !",
  "interactableModals.potionHouse.message1":
    "Attention, ami, le scientifique fou habite là-dedans !",
  "interactableModals.potionHouse.message2":
    "La rumeur dit qu'ils cherchent des apprentis Bumpkin pour cultiver des cultures mutantes avec eux.",
  "interactableModals.guildHouse.message":
    "Attends Bumpkin ! Tu as besoin d'un Bud si tu veux entrer dans la Maison de la Guilde.",
  "interactableModals.guildHouse.readMore": "En savoir plus",
  "interactableModals.guildHouse.budsCollection":
    "Collection de Buds sur Opensea",
  "interactableModals.bettyHome.message":
    "Oh, chéri, autant j'adore mes cultures, autant ma maison est un espace privé, actuellement fermé aux visiteurs.",
  "interactableModals.bertHome.message":
    "Des intrus ! Ils doivent en avoir après ma collection d'objets rares et de secrets, je ne peux pas les laisser entrer !",
  "interactableModals.beach.message1": "As-tu été à la plage ?",
  "interactableModals.beach.message2":
    "La rumeur dit qu'elle regorge de trésors luxueux ! Malheureusement, elle est en cours de construction.",
  "interactableModals.castle.message":
    "Arrête-toi là, paysan ! Pas question que je te laisse visiter le château",
  "interactableModals.woodlands.message":
    "Tu voyages vers les bois ? Assure-toi de ramasser de délicieux champignons !",
  "interactableModals.port.message":
    "Attends un peu ! Les gobelins sont encore en train de construire le port. Il sera bientôt prêt pour les voyages et la pêche.",
  "interactableModals.like.home": "Souhaitez-vous retourner à la maison ?  ",
};

const introTerms: Record<Intro, string> = {
  "intro.one":
    "Salut à toi, Bumpkin ! Bienvenue à Sunflower Land, le paradis agricole abondant où tout est possible !",
  "intro.two":
    "Quelle belle île vous avez aménagée ! Je suis Pumpkin' Pete, votre voisin fermier.",
  "intro.three":
    "En ce moment, les joueurs célèbrent un festival sur la place avec des récompenses fantastiques et des objets magiques.",
  "intro.four":
    "Avant de pouvoir vous joindre à la fête, vous devrez développer votre ferme et collecter des ressources. Vous ne voulez pas venir les mains vides !",
  "intro.five":
    "Pour débuter, vous pouvez couper ces arbres et étendre votre île.",
};

const introPage: Record<IntroPage, string> = {
  "introPage.welcome":
    "Bienvenue dans la Salle des Potions, mon apprenti curieux !",
  "introPage.description":
    "Je suis Mad Scientist Bumpkin, ici pour t'assister dans cette quête magique dans le monde de la sorcellerie botanique. Prépare-toi à découvrir les secrets de Sunflower Land ! Chaque tentative coûtera 1 SFL.",
  "introPage.mission":
    "Ta mission : déchiffrer la bonne combinaison de potions dans la grille enchantée.",
  "introPage.tip":
    "Souviens-toi, plus tu sélectionnes de potions correctes, plus la plante sera heureuse, augmentant tes chances de trouver des objets rares !",
  "introPage.feedbackIcons": "Fais attention aux icônes de retour :",
  "introPage.correctPosition": "Une potion parfaite à la position parfaite",
  "introPage.correctPotionWrongPosition":
    "Potion correcte mais mauvaise position",
  "introPage.wrongPotion": "Oups, mauvaise potion",
  "introPage.chaosPotion":
    "Méfie-toi de la potion 'chaos', elle bouscule tout !",
  "introPage.playButton": "Jouons",
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
  "islandNotFound.message": "Vous avez atterri au milieu de nulle part !",
  "islandNotFound.takeMeHome": "Ramenez-moi à la maison",
};

const kick: Record<Kick, string> = {
  "kick.player": "Expulser un joueur",
  "kick.player.id": "ID de la ferme du joueur",
  "kick.Message":
    "Veuillez noter que vous pouvez toujours rejoindre à nouveau, mais si vous continuez à enfreindre les règles, nous prendrons des mesures supplémentaires.",
  "kick.Reason":
    "Raison de l'expulsion (Veuillez noter que le joueur verra ceci)",
  "kick.player.farm": "Expulser le joueur de la ferme",
  "kick.player.kick": "Le joueur a été expulsé.",
  "kick.player.failed": "Échec de l'expulsion du joueur",
  "kick.player.kicking": "Expulsion du joueur en cours...",
  "kick.please": "Veuillez patienter",
};

const kicked: Record<Kicked, string> = {
  "kicked.kicked": "Vous avez été expulsé !",
  "kicked.Reason": "Raison :",
  "kicked.Message":
    "Veuillez noter que vous pouvez toujours rejoindre, mais si vous continuez à enfreindre les règles, nous prendrons des mesures supplémentaires.",
  "kicked.accept": "Accepter",
};

const landscapeTerms: Record<LandscapeTerms, string> = {
  "landscape.intro.one": "Concevez votre île de rêve !",
  "landscape.intro.two":
    "En mode conception, vous pouvez tenir, faire glisser et déplacer des objets.",
  "landscape.intro.three": "Fabriquez des décorations rares",
  "landscape.intro.four": "Placez des objets de collection de votre coffre",
  "landscape.expansion.one":
    "Chaque parcelle de terrain est accompagnée de ressources uniques pour vous aider à construire votre empire agricole !",
  "landscape.expansion.two":
    "D'autres expansions seront bientôt disponibles...",
  "landscape.timerPopover": "Prochaine expansion",
  "landscape.dragMe": "Faites glisser-moi",
};

const levelUpMessages: Record<LevelUpMessages, string> = {
  "levelUp.2":
    "Yeehaw, vous avez atteint le niveau 2 ! Les cultures tremblent dans leurs bottes.",
  "levelUp.3":
    "Félicitations pour le niveau 3 ! Vous grandissez comme une mauvaise herbe...",
  "levelUp.4":
    "Félicitations pour le niveau 4 ! Vous avez officiellement dépassé votre main verte.",
  "levelUp.5":
    "Niveau 5 et toujours en vie ! Votre dur labeur porte ses fruits... ou devrions-nous dire 'travail du foin' ?",
  "levelUp.6":
    "Wow, niveau 6 déjà ? Vous devez être fort comme un bœuf. Ou du moins votre charrue l'est.",
  "levelUp.7":
    "Félicitations pour avoir atteint le niveau 7 ! Votre ferme est é-maïs-nante.",
  "levelUp.8": "Niveau 8, très bien ! Vous semez les graines du succès.",
  "levelUp.9":
    "Neuf neuf, niveau 9ieme ! Votre récolte grandit aussi vite que vos compétences.",
  "levelUp.10":
    "Niveau 10, chiffres doubles ! Votre ferme a tellement fière allure que même les poules sont impressionnées.",
  "levelUp.11": "Niveau 11, vous faites pleuvoir (de l'eau, bien sûr) !",
  "levelUp.12":
    "Félicitations pour le niveau 12 ! Votre ferme commence vraiment à cultiver du caractère.",
  "levelUp.13":
    "Niveau 13 chanceux ! Vous commencez vraiment à prendre le coup de cette agriculture.",
  "levelUp.14":
    "Niveau 14, c'est incroyable de voir les progrès que tu as réalisés !",
  "levelUp.15": "15 et prospère ! Votre ferme n'a jamais été aussi belle.",
  "levelUp.16":
    "Félicitations pour le niveau 16 ! Vos compétences en agriculture prennent vraiment racine.",
  "levelUp.17":
    "Niveau 17, vous récoltez ce que vous semez (et ça a l'air bien !).",
  "levelUp.18": "18 et bourgeonnant de potentiel !",
  "levelUp.19":
    "Félicitations pour le niveau 19 ! Votre ferme grandit aussi vite que vos compétences.",
  "levelUp.20": "Niveau 20, vous êtes la crème de la récolte !",
  "levelUp.21": "21 et récoltant comme un pro !",
  "levelUp.22":
    "Félicitations pour le niveau 22 ! Votre ferme est en train de réussir.",
  "levelUp.23":
    "Niveau 23, vos compétences en agriculture commencent vraiment à s'épanouir !",
  "levelUp.24": "Vous êtes vraiment en train de fleurir au niveau 24 !",
  "levelUp.25":
    "Niveau du quart de siècle ! Vous faites du foin pendant que le soleil brille.",
  "levelUp.26":
    "Félicitations pour le niveau 26 ! Vous exploitez vraiment cette agriculture.",
  "levelUp.27":
    "Niveau 27, vous commencez vraiment à vous démarquer dans le domaine !",
  "levelUp.28": "Vous élevez vraiment la barre au niveau 28 !",
  "levelUp.29":
    "Félicitations pour le niveau 29 ! Vous commencez vraiment à cultiver des compétences sérieuses.",
  "levelUp.30": "Niveau 30, vous êtes maintenant un vrai fermier !",
  "levelUp.31": "31 et toujours en pleine croissance !",
  "levelUp.32":
    "Félicitations pour le niveau 32 ! Votre ferme est en pleine floraison.",
  "levelUp.33":
    "Niveau 33, vos compétences en agriculture commencent vraiment à s'enraciner !",
  "levelUp.34": "Vous êtes vraiment en train de germer au niveau 34 !",
  "levelUp.35": "Niveau 35, vous êtes le tracteur-remorque de l'agriculture !",
  "levelUp.36":
    "Félicitations pour le niveau 36 ! Votre ferme commence vraiment à récolter du succès.",
  "levelUp.37":
    "Niveau 37, vos compétences commencent vraiment à se développer !",
  "levelUp.38":
    "Vous êtes vraiment en train de semer les graines du succès au niveau 38 !",
  "levelUp.39":
    "Félicitations pour le niveau 39 ! Votre ferme commence vraiment à mûrir.",
  "levelUp.40": "Niveau 40, vous êtes un véritable héros de la récolte !",
  "levelUp.41": "41 et toujours en pleine croissance !",
  "levelUp.42":
    "Félicitations pour le niveau 42 ! Votre ferme commence vraiment à récolter les récompenses.",
  "levelUp.43":
    "Niveau 43, vos compétences en agriculture commencent vraiment à s'enraciner !",
  "levelUp.44": "Vous récoltez vraiment le succès au niveau 44 !",
  "levelUp.45": "Niveau 45, vous êtes un véritable maître de la récolte !",
  "levelUp.46":
    "Félicitations pour le niveau 46 ! Vos compétences en agriculture commencent vraiment à porter leurs fruits.",
  "levelUp.47":
    "Niveau 47, vous commencez vraiment à devenir une légende de l'agriculture.",
  "levelUp.48": "Vous prospérez vraiment au niveau 48 !",
  "levelUp.49":
    "Félicitations pour le niveau 49 ! Vous commencez vraiment à récolter les fruits de votre dur labeur.",
  "levelUp.50":
    "À mi-chemin vers 100 ! Vous êtes maintenant un véritable professionnel de l'agriculture.",
  "levelUp.51": "51 et toujours en pleine croissance !",
  "levelUp.52":
    "Félicitations pour le niveau 52 ! Votre ferme est une véritable œuvre d'art.",
  "levelUp.53": "Niveau 53, vos compétences commencent vraiment à s'enraciner.",
  "levelUp.54": "Vous récoltez vraiment le bonheur au niveau 54 !",
  "levelUp.55": "Niveau 55, vous êtes une véritable force de l'agriculture.",
  "levelUp.56":
    "Félicitations pour le niveau 56 ! Votre ferme commence vraiment à s'épanouir.",
  "levelUp.57":
    "Niveau 57, Vous commencez vraiment à cultiver des compétences sérieuses.",
  "levelUp.58": "Vous semez vraiment les graines du succès au niveau 58 !",
  "levelUp.59":
    "Félicitations pour le niveau 59 ! Votre ferme est la crème de la crème.",
  "levelUp.60":
    "Niveau 60, vous êtes maintenant une véritable superstar de l'agriculture !",
};

const letsGo: Record<LetsGo, string> = {
  "letsGo.title": "C'est l'heure de jouer !",
  "letsGo.description":
    "Merci de jouer à la version bêta ! Nous travaillons encore sur le jeu et apprécions votre soutien durant ces premières étapes !",
  "letsGo.readMore": "Vous pouvez en savoir plus sur le jeu dans les ",
  "letsGo.officialDocs": "documents officiels",
  "letsGo.officialDocsLink": "https://docs.sunflower-land.com",
};

const loser: Record<Loser, string> = {
  "loser.unsuccess": "Vous n'avez pas réussi",
  "loser.refund": "Remboursement des ressources",
  "loser.longer": "L'enchère n'existe plus",
  "loser.refund.one": "Rembourser",
};

const lostSunflorian: Record<LostSunflorian, string> = {
  "lostSunflorian.line1": "Mon père m'a envoyé ici pour régner sur Hélios.",
  "lostSunflorian.line2":
    "Malheureusement, ces Bumpkins n'aiment pas que je les surveille.",
  "lostSunflorian.line3": "J'ai hâte de retourner à Sunfloria.",
};

const modalDescription: Record<ModalDescription, string> = {
  "modalDescription.friend": "Salut l'ami !",
  "modalDescription.love.fruit":
    "Waouh, tu aimes vraiment les fruits autant que moi !",
  "modalDescription.gift":
    "Je n'ai plus de cadeaux pour toi. N'oublie pas de porter tes nouveaux articles !",
  "modalDescription.limited.abilitie":
    "J'ai conçu des vêtements en édition limitée qui peuvent améliorer tes capacités de cueillette de fruits",
  "modalDescription.trail":
    "Je recherche des cueilleurs de fruits dévoués pour tester ces vêtements... GRATUITEMENT !",
};

const mute: Record<Mute, string> = {
  "mute.playe": "Muter un joueur",
  "mute.playe.id": "ID de la ferme du joueur",
  "mute.duration": "Durée du mute (Veuillez noter que le joueur verra ceci)",
  "mute.Reason": "Raison du mute (Veuillez noter que le joueur verra ceci)",
  "mute.player.farm": "Muter le joueur de la ferme",
  "mute.player.mute": "Le joueur a été muté",
  "mute.fail": "Échec de la mise en mute du joueur",
  "mute.player.muting": "Mise en mute du joueur...",
  "mute.player.wait": "Veuillez patienter",
  "mute.you": "Vous avez été mis en mute !",
  "mute.until": "Vous êtes en mute jusqu'à",
  "mute.discord":
    "Si vous êtes contre cette décision, veuillez nous contacter sur Discord.",
  "mute.accept": "Accepter",
  "mute.unmute.farm": "Retirer le mute du joueur de la ferme",
  "mute.unmute.player": "Le joueur a été démuté",
  "mute.unmute.failed": "Échec du retrait du mute du joueur",
  "mute.unmuting.player": "Retrait du mute du joueur en cours...",
  "mute.unmute.wait": "Veuillez patienter",
  "mute.online":
    "Dans le cas où vous devez mettre en sourdine un joueur qui n'est pas en ligne, vous pouvez le faire ici. Lors de leur prochaine connexion, ils seront mis en sourdine.  ",
};

const noaccount: Record<Noaccount, string> = {
  "noaccount.enterPromoCode": "Entrez votre code promo :",
  "noaccount.newFarmer": "Nouveau Fermier",
  "noaccount.addPromoCode": "Ajouter un code promo ?",
  "noaccount.alreadyHaveNFTFarm": "Vous possédez déjà une ferme NFT ?",
  "noaccount.createFarm": "Créer une Ferme",
  "noaccount.loading": "Chargement",
  "noaccount.noFarmNFTs": "Vous ne possédez aucun NFT de ferme.",
  "noaccount.createNewFarm": "Créer une nouvelle ferme",
  "noaccount.selectNFTID": "Sélectionnez votre ID NFT :",
  "noaccount.welcomeMessage":
    "Bienvenue à Sunflower Land. Il semble que vous n'ayez pas encore de ferme.",
  "noaccount.promoCodeLabel": "Code Promo :",
};

const noBumpkin: Record<NoBumpkin, string> = {
  "noBumpkin.readyToFarm":
    "Génial, votre Bumpkin est prêt à travailler à la ferme !",
  "noBumpkin.play": "Jouer",
  "noBumpkin.missingBumpkin": "Il vous manque votre Bumpkin",
  "noBumpkin.bumpkinNFT":
    "Un Bumpkin est un NFT qui est frappé sur la Blockchain.",
  "noBumpkin.bumpkinHelp":
    "Vous avez besoin d'un Bumpkin pour vous aider à planter, récolter, couper, miner et agrandir votre terre.",
  "noBumpkin.mintBumpkin": "Vous pouvez obtenir un Bumpkin sur OpenSea.",
  "noBumpkin.allBumpkins": "Waouh, regardez tous ces Bumpkins !",
  "noBumpkin.chooseBumpkin": "Avec quel Bumpkin souhaitez-vous jouer ?",
  "noBumpkin.deposit": "Déposer",
  "noBumpkin.loading": "Chargement",
};

const noTownCenter: Record<NoTownCenter, string> = {
  "noTownCenter.reward": "Récompense : 1 x Centre-Ville !",
  "noTownCenter.news": "Vos dernières nouvelles ou déclarations ici.",
  "noTownCenter.townCenterPlacement":
    "Vous pouvez placer le Centre-Ville via la section inventaire > bâtiments",
};

const notOnDiscordServer: Record<NotOnDiscordServer, string> = {
  "notOnDiscordServer.warning": "Avertissement",
  "notOnDiscordServer.intro":
    "On dirait que vous n'avez pas encore rejoint le serveur Discord de Sunflower Land.",
  "notOnDiscordServer.joinDiscord": "Rejoignez notre ",
  "notOnDiscordServer.discordServer": "Serveur Discord",
  "notOnDiscordServer.completeVerification":
    "2. Complétez la vérification et commencez",
  "notOnDiscordServer.acceptRules": "3. Acceptez les règles dans #rules",
  "notOnDiscordServer.tryAgain": "4. Réessayez",
  "notOnDiscordServer.close": "Fermer",
  "notOnDiscordServer.tryAgainButton": "Réessayer",
};

const npc_message: Record<NPC_MESSAGE, string> = {
  // Betty
  "npcMessages.betty.msg1":
    "Oh là là, j'ai hâte de mettre la main sur des produits frais !",
  "npcMessages.betty.msg2":
    "Je suis tellement excitée à l'idée d'essayer de nouvelles cultures, qu'as-tu pour moi ?",
  "npcMessages.betty.msg3":
    "J'attends toute la journée une chance de récolter des fruits délicieux !",
  "npcMessages.betty.msg4":
    "Je suis impatiente de voir quel type de cultures est prêt à être récolté aujourd'hui.",
  "npcMessages.betty.msg5":
    "J'ai hâte de goûter aux fruits de mon travail, quel type de produits as-tu ?",
  "npcMessages.betty.msg6":
    "J'ai une véritable passion pour l'agriculture, et je suis toujours à la recherche de nouvelles cultures intéressantes à cultiver.",
  "npcMessages.betty.msg7":
    "Il n'y a rien comme la sensation de récolter une grande quantité de cultures, c'est ça le vrai travail agricole !",
  // Blacksmith
  "npcMessages.blacksmith.msg1":
    "J'ai besoin de quelques fournitures pour ma dernière invention, as-tu des matériaux ?",
  "npcMessages.blacksmith.msg2":
    "Je cherche à stocker des ressources brutes, en as-tu à vendre ?",
  "npcMessages.blacksmith.msg3":
    "J'ai besoin de matériaux pour l'artisanat, as-tu quelque chose que je pourrais utiliser ?",
  "npcMessages.blacksmith.msg4":
    "As-tu des ressources rares ou uniques que je pourrais utiliser ?",
  "npcMessages.blacksmith.msg5":
    "Je suis intéressé à acquérir des matériaux de haute qualité, qu'as-tu à proposer ?",
  "npcMessages.blacksmith.msg6":
    "Je cherche des matériaux pour mon prochain projet, as-tu quelque chose à offrir ?",
  "npcMessages.blacksmith.msg7":
    "Je suis sur le marché pour des matériaux bruts, en as-tu à vendre ?",
  // Pumpkin' pete
  "npcMessages.pumpkinpete.msg1":
    "Salut toi, le petit nouveau ! Que dirais-tu de quelques produits frais ?",
  "npcMessages.pumpkinpete.msg2":
    "Des cultures savoureuses, quelqu'un est intéressé ? Je suis votre homme pour une cueillette facile !",
  "npcMessages.pumpkinpete.msg3":
    "Frais et délicieux, c'est ma devise. Qu'as-tu à proposer ?",
  "npcMessages.pumpkinpete.msg4":
    "Nouveau en ville ? Illuminons ta journée avec quelques cultures !",
  "npcMessages.pumpkinpete.msg5":
    "Besoin d'un coup de main, ami ? J'ai toute une variété de cultures pour toi !",
  "npcMessages.pumpkinpete.msg6":
    "Pete l'énergique, à ton service ! Des cultures, quelqu'un en veut ?",
  "npcMessages.pumpkinpete.msg7":
    "Bienvenue sur la place ! Rendons ta journée plus lumineuse avec des cultures !",
  // Cornwell
  "npcMessages.cornwell.msg1":
    "Ah le bon vieux temps... Le travail acharné, c'est ma devise. Qu'as-tu à proposer ?",
  "npcMessages.cornwell.msg2":
    "Ces jeunes, aucun sens du travail ! Apporte-moi quelque chose de difficile.",
  "npcMessages.cornwell.msg3":
    "Je me souviens quand... Le travail acharné, c'est ce qui manque !",
  "npcMessages.cornwell.msg4":
    "Un savoir durement acquis mérite la meilleure récolte. Impressionne-moi !",
  "npcMessages.cornwell.msg5":
    "L'histoire et le travail acharné, c'est notre credo. Quel est ton choix ?",
  "npcMessages.cornwell.msg6":
    "Cornwell, c'est mon nom, et je suis là pour une véritable expérience agricole.",
  "npcMessages.cornwell.msg7":
    "Des tâches difficiles, des récompenses riches. Montre-moi ce que tu as !",
  // Raven
  "npcMessages.raven.msg1":
    "L'obscurité et le mystère, c'est mon domaine. Je prendrai les cultures les plus difficiles.",
  "npcMessages.raven.msg2":
    "Gothique dans l'âme, j'ai besoin des cultures les plus sombres pour mes potions.",
  "npcMessages.raven.msg3":
    "Le surnaturel et le sinistre, c'est l'ambiance que je recherche. Impressionne-moi.",
  "npcMessages.raven.msg4":
    "Je désire la récolte ombragée pour mes sortilèges. Donne-les moi.",
  "npcMessages.raven.msg5":
    "Apporte-moi les cultures qui se cachent dans l'ombre. Je ne serai pas déçu.",
  "npcMessages.raven.msg6":
    "Raven, le gardien des ténèbres, veut vos cultures les plus exigeantes.",
  "npcMessages.raven.msg7":
    "Délices obscurs pour un cœur gothique. Montre-moi ta récolte la plus sombre.",
  // Bert
  "npcMessages.bert.msg1":
    "Mec, ces champignons... ils sont la clé. Tu as des magiques ?",
  "npcMessages.bert.msg2":
    "La folie des champignons, c'est moi. Des champignons magiques, quelqu'un ?",
  "npcMessages.bert.msg3":
    "Tout est question de champis, bébé. Passe-moi les enchantés.",
  "npcMessages.bert.msg4":
    "Je vois des choses, tu sais ? Des champignons magiques, c'est ce dont j'ai besoin.",
  "npcMessages.bert.msg5":
    "La vie est un voyage, mec, et j'ai besoin de ces champignons magiques pour le faire !",
  "npcMessages.bert.msg6":
    "Bert, c'est mon nom, les champis, c'est mon jeu. Les enchantés, s'il te plaît !",
  "npcMessages.bert.msg7":
    "Des champignons magiques, mon ami. C'est ça qui me maintient en mouvement.",
  // Timmy
  "npcMessages.timmy.msg1":
    "Roaar ! Je suis Timmy l'ours ! Donne-moi toute cette bonté fruitée !",
  "npcMessages.timmy.msg2":
    "Je suis un ours, et les ours adorent les fruits ! Tu as des friandises fruitées pour moi ?",
  "npcMessages.timmy.msg3":
    "Les délices fruités, c'est le secret. C'est un truc de Timmy, tu sais ?",
  "npcMessages.timmy.msg4":
    "Des câlins d'ours pour des fruits ! C'est un truc de Timmy, tu sais ?",
  "npcMessages.timmy.msg5":
    "Dans un costume d'ours, la vie est un régal. Les fruits, c'est ma confiture, tu en as ?",
  "npcMessages.timmy.msg6":
    "Timmy l'ours est là pour s'amuser avec les fruits ! Passe-moi ces fruits !",
  "npcMessages.timmy.msg7":
    "Des conversations fructueuses avec un ours ! Partage l'amour des fruits !",
  // Tywin
  "npcMessages.tywin.msg1":
    "De l'or, de l'or, et encore de l'or ! Montre-moi les richesses, manants !",
  "npcMessages.tywin.msg2":
    "Je surveille les Bumpkins pour m'assurer qu'ils paient ce qu'ils doivent. De l'or, maintenant !",
  "npcMessages.tywin.msg3":
    "Manants, apportez-moi vos richesses ! Je suis Tywin, le prince exigeant !",
  "npcMessages.tywin.msg4":
    "La place des Citrouilles est en dessous de moi, mais l'or n'est jamais suffisant. Encore plus !",
  "npcMessages.tywin.msg5":
    "C'est la vie d'un prince, et j'exige votre richesse. Payez vos impôts !",
  "npcMessages.tywin.msg6":
    "La richesse d'un prince ne connaît pas de limites. De l'or, de l'or, et encore de l'or !",
  "npcMessages.tywin.msg7":
    "L'or est ma couronne, et je veux tout ! Apportez-moi vos richesses !",
  // Tango
  "npcMessages.tango.msg1":
    "Bavarder, croquer, et bavarder encore ! Des fruits, des fruits, et encore des fruits !",
  "npcMessages.tango.msg2":
    "Je suis Tango, le singe écureuil fruité ! Apporte-moi des trésors fruités !",
  "npcMessages.tango.msg3":
    "Orange, effronté et joueur, c'est moi. Des fruits, quelqu'un ?",
  "npcMessages.tango.msg4":
    "Des secrets de fruits ? Je les ai ! Partage avec moi les merveilles fruitées !",
  "npcMessages.tango.msg5":
    "Des espiègleries fructueuses et des délices fruités. Amusons-nous !",
  "npcMessages.tango.msg6":
    "Tango, c'est mon nom, les jeux fruités sont ma renommée. Donne-moi !",
  "npcMessages.tango.msg7":
    "La connaissance des fruits coule dans ma famille. Raconte-moi tes histoires les plus fruitées !",
  // Miranda
  "npcMessages.miranda.msg1":
    "Danse avec moi, ami ! Ajouteras-tu quelque chose à mon chapeau fruit-tastique ?",
  "npcMessages.miranda.msg2":
    "La samba et les fruits, ils vont de pair. Que peux-tu offrir ?",
  "npcMessages.miranda.msg3":
    "Au rythme de la samba, les fruits sont essentiels. Ça te dit de partager ?",
  "npcMessages.miranda.msg4":
    "Tout est question de rythme de samba et de friandises fruitées. Apporte-en un peu !",
  "npcMessages.miranda.msg5":
    "Rejoins la célébration de la samba avec un cadeau fruité pour mon chapeau !",
  "npcMessages.miranda.msg6":
    "Le chapeau de Miranda adore le panache fruité. Que peux-tu y ajouter ?",
  "npcMessages.miranda.msg7": "Samba, fruits et amitié. Faisons-en une fête !",
  // Finn
  "npcMessages.finn.msg1":
    "J'ai pêché la plus grosse prise de tous les temps ! Du poisson, quelqu'un ?",
  "npcMessages.finn.msg2":
    "La vie est une histoire de pêcheur, et j'ai des histoires à raconter. Des poissons pêchés !",
  "npcMessages.finn.msg3":
    "Finn le pêcheur, la légende, et le murmureur de poissons. Quelques poissons pêchés ?",
  "npcMessages.finn.msg4":
    "Gros poissons, grandes histoires, et un grand ego. Apporte-moi tes trésors de poissons !",
  "npcMessages.finn.msg5":
    "Hameçon, ligne et panache, c'est moi. Le poisson, c'est ma spécialité !",
  "npcMessages.finn.msg6":
    "Des histoires de poissons, des droits de vantardise, et une pointe de modestie. Du poisson, s'il te plaît !",
  "npcMessages.finn.msg7":
    "Savais-tu que les chirurgiens ont un faible pour le charme piquant des oranges",
  "npcMessages.finn.msg8":
    "J'ai attrapé le plus gros poisson de tous les temps. Ce n'est pas juste une histoire ; c'est la réalité !",
  // Findley
  "npcMessages.findley.msg1":
    "Je ne vais pas laisser toute la gloire à Finn ! J'ai besoin d'appâts et de chum pour ma grosse prise !",
  "npcMessages.findley.msg2":
    "Finn n'est pas le seul à savoir pêcher. J'ai besoin d'appâts et de chum, vite !",
  "npcMessages.findley.msg3":
    "Je vais montrer à Finn qui est le vrai pêcheur ! Des appâts et du chum, il m'en faut !",
  "npcMessages.findley.msg4":
    "Tu cherches à accrocher un thon ? Ils ont un goût particulier pour l'attrait croustillant du chou-fleur.",
  "npcMessages.findley.msg5":
    "La rivalité de pêche est une affaire de famille. Je suis là pour prouver quelque chose. Des appâts et du chum, s'il te plaît !",
  "npcMessages.findley.msg6":
    "Finn n'est pas le seul à avoir des compétences en pêche. Je vise la prise de ma vie !",
  "npcMessages.findley.msg7":
    "Concourir avec Finn est un must. J'ai besoin de ton aide avec des appâts et du chum !",
  "npcMessages.findley.msg8":
    "Une compétition de pêche entre frères et sœurs. Les appâts et le chum sont mes armes secrètes !",
  "npcMessages.findley.msg9":
    "Savais-tu que le Mahi Mahi ne peut pas résister au croquant sucré du maïs",
  // Corale
  "npcMessages.corale.msg1":
    "L'océan m'appelle, et j'ai besoin de poissons. Aide-moi à libérer mes amis !",
  "npcMessages.corale.msg2":
    "Les poissons sont mes amis, et je dois les libérer. Veux-tu m'aider ?",
  "npcMessages.corale.msg3":
    "Par amour pour la mer, apporte-moi des poissons. Je les relâcherai dans leur habitat.",
  "npcMessages.corale.msg4":
    "Sous les vagues, mes amis attendent. Des poissons, pour qu'ils puissent nager librement !",
  "npcMessages.corale.msg5":
    "Un appel de sirène pour protéger ses amis. Apporte-moi des poissons, âme bienveillante.",
  "npcMessages.corale.msg6":
    "La liberté des poissons, c'est ma mission. Aide-moi avec les poissons, veux-tu ?",
  "npcMessages.corale.msg7":
    "Rejoins-moi dans la danse de la vie marine. Des poissons, pour libérer mes amis !",
  //Shelly
  "npcMessages.shelly.msg1":
    "Les Bumpkins disparaissent, et je crains que le Kraken en soit la cause. Aide-moi à collecter ses tentacules !",
  "npcMessages.shelly.msg2":
    "Les Bumpkins disparaissent, et je soupçonne le Kraken. Peux-tu récupérer ses tentacules, s'il te plaît ?",
  "npcMessages.shelly.msg3":
    "Le Kraken est une menace, les Bumpkins manquent. Apporte ses tentacules pour les garder en sécurité.",
  "npcMessages.shelly.msg4":
    "Le Kraken est menaçant, les Bumpkins sont partis. Apporte ses tentacules pour leur sécurité.",
  "npcMessages.shelly.msg5":
    "Garder la plage est difficile avec le Kraken. Aide-moi à protéger les Bumpkins, obtiens ses tentacules.",
  "npcMessages.shelly.msg6":
    "Protéger les Bumpkins est mon devoir, mais le Kraken m'inquiète. Obtenez ses tentacules pour les sauvegarder.",
  "npcMessages.shelly.msg7":
    "Le Kraken provoque la panique, les Bumpkins manquent. Aide-moi à rassembler ses tentacules pour leur sécurité.",
  "npcMessages.shelly.msg8":
    "La sécurité des Bumpkins est ma priorité, et je crains que le Kraken soit impliqué. Les tentacules peuvent faire la différence !",
};

const npc: Record<Npc, string> = {
  "npc.Modal.Hammer":
    "Rassemblez-vous, Bumpkins, une vente aux enchères est sur le point de commencer.",
  "npc.Modal.Marcus":
    "Hé ! Tu n'as pas le droit d'entrer dans ma maison. Ne touche surtout pas à mes affaires !",
  "npc.Modal.Billy": "Salut à tous ! Je m'appelle Billy.",
  "npc.Modal.Billy.one":
    "J'ai trouvé ces jeunes pousses, mais je ne sais absolument pas quoi en faire.",
  "npc.Modal.Billy.two":
    "Je parie qu'elles ont un rapport avec les bourgeons de vers qui apparaissent autour de la place.",
  "npc.Modal.Readmore": "En savoir plus",
  "npc.Modal.Gabi": "Hé Bumpkin !",
  "npc.Modal.Gabi.one":
    "Tu as l'air créatif, as-tu déjà pensé à contribuer artistiquement au jeu ?",
  "npc.Modal.Craig": "Pourquoi me regardes-tu bizarrement ?",
  "npc.Modal.Craig.one": "Y a-t-il quelque chose dans mes dents...  ",
};

const npcDialogues: Record<NpcDialogues, string> = {
  // Blacksmith Intro
  "npcDialogues.blacksmith.intro1":
    "Que voulez-vous ? Parlez vite ; le temps c'est de l'argent.",
  "npcDialogues.blacksmith.intro2":
    "Qu'est-ce qui vous amène dans mon atelier ? Je suis occupé, alors faites vite.",
  "npcDialogues.blacksmith.intro3":
    "Bienvenue dans mon humble demeure. Qu'est-ce qui vous amène ici ?",
  "npcDialogues.blacksmith.intro4":
    "Déclarez votre objectif. Je suis occupé, et je n'ai pas le temps pour des bavardages inutiles. Qu'est-ce qui vous amène dans mon atelier ?",
  // Blacksmith Positive Delivery
  "npcDialogues.blacksmith.positiveDelivery1":
    "Enfin ! Vous avez apporté les matériaux dont j'ai besoin. Écartez-vous ; laissez-moi travailler ma magie.",
  "npcDialogues.blacksmith.positiveDelivery2":
    "Ah, il était temps ! Vous avez acquis les objets exacts que je recherchais. Préparez-vous à un équipement fabriqué avec précision.",
  "npcDialogues.blacksmith.positiveDelivery3":
    "Bien. Vous avez livré les matériaux dont j'ai besoin. Je ne vous décevrai pas ; mes créations seront remarquables.",
  "npcDialogues.blacksmith.positiveDelivery4":
    "Impressionnant ! Vous avez acquis les composants nécessaires. Je vais les transformer en merveilles agricoles !",
  "npcDialogues.blacksmith.positiveDelivery5":
    "Hmm, vous avez effectivement réussi à trouver ce que je voulais. Bien joué.",
  // Blacksmith Negative Delivery
  "npcDialogues.blacksmith.negativeDelivery1":
    "Vous n'avez pas ce dont j'ai besoin ? Du temps gaspillé. Revenez quand vous aurez ce qu'il faut.",
  "npcDialogues.blacksmith.negativeDelivery2":
    "Non, non, non. Vous manquez de matériaux essentiels. Ne gaspillez pas mon temps. Revenez quand vous serez prêt.",
  "npcDialogues.blacksmith.negativeDelivery3":
    "Inacceptable. Vous ne possédez pas ce dont j'ai besoin. Je n'ai pas de temps à perdre avec l'incompétence. Revenez quand vous serez capable.",
  "npcDialogues.blacksmith.negativeDelivery4":
    "Insatisfaisant. Vous n'avez pas ce qu'il me faut. Revenez quand vous serez prêt à remplir votre part du marché.",
  "npcDialogues.blacksmith.negativeDelivery5":
    "Incompétence. Vous manquez des matériaux requis. Ne gaspillez pas mon temps ; revenez quand vous serez préparé.",
  // Blacksmith NoOrder
  "npcDialogues.blacksmith.noOrder1":
    "Pas de commande en cours à réaliser pour le moment, mais si vous avez besoin d'outils ou de matériaux à façonner, je suis toujours là pour vous aider. Parlez, et nous nous mettrons au travail.",
  "npcDialogues.blacksmith.noOrder2":
    "Pas de commande active de ma part, mais si vous avez besoin d'équipement solide ou de matériaux à travailler, je suis votre artisan.",
  // Betty Into
  "npcDialogues.betty.intro1":
    "Salut, rayon de soleil ! Journée chargée au marché. Je suis venue voir si tu as les ingrédients que j'ai commandés. Les as-tu avec toi ?",
  "npcDialogues.betty.intro2":
    "Bonjour, bonjour ! J'attendais pour voir si tu as les ingrédients que j'ai commandés. Les as-tu apportés ?",
  "npcDialogues.betty.intro3":
    "Bienvenue au marché de Betty ! Prêt à vérifier si tu as les ingrédients dont j'ai besoin ? Voyons ce que tu as à m'offrir !",
  "npcDialogues.betty.intro4":
    "Hé, hé ! J'ai hâte de savoir si tu as apporté les ingrédients que j'ai commandés. Montre-moi ce que tu as !",
  "npcDialogues.betty.intro5":
    "Salutations, mon ami au pouce vert ! Je suis excitée de voir si tu as les ingrédients que j'ai demandés. Qu'y a-t-il dans ton panier ?",
  // Betty Positive Delivery
  "npcDialogues.betty.positiveDelivery1":
    "Hourra ! Tu as apporté les ingrédients que j'ai commandés. Ils sont aussi frais et vibrants que possible. Merci, mon génie du jardinage !",
  "npcDialogues.betty.positiveDelivery2":
    "C'est de cela que je parle ! Tu as exactement les ingrédients dont j'avais besoin. Tu as égayé ma journée avec ta livraison rapide. Merci !",
  "npcDialogues.betty.positiveDelivery3":
    "Oh, fantastique ! Ce sont exactement les ingrédients que j'avais demandés. Le marché va bourdonner d'excitation. Merci pour ton dur travail !",
  "npcDialogues.betty.positiveDelivery4":
    "Oh, mon jardin ! Ces ingrédients sont absolument parfaits. Tu as un talent pour trouver les meilleurs produits. Merci, mon héros au pouce vert !",
  "npcDialogues.betty.positiveDelivery5":
    "Bravo ! Tu as apporté exactement les ingrédients dont j'avais besoin. J'ai hâte de les utiliser pour créer quelque chose d'extraordinaire. Merci pour ta livraison rapide !",
  // Betty Negative Delivery
  "npcDialogues.betty.negativeDelivery1":
    "Oupsie-daisy ! On dirait que tu n'as pas les ingrédients que j'ai commandés. Pas de souci, cependant. Continue de chercher, et nous trouverons une autre occasion.",
  "npcDialogues.betty.negativeDelivery2":
    "Oh, non ! Il semble que tu n'aies pas les ingrédients dont j'ai besoin pour le moment. Ne t'en fais pas, cependant. Je crois en ta débrouillardise. Reviens quand tu auras ce que je recherche !",
  "npcDialogues.betty.negativeDelivery3":
    "Aw, mince ! Il semble que tu n'aies pas les ingrédients que je recherche en ce moment. Continue de fouiller, cependant ! Peut-être que la prochaine fois, nous aurons plus de chance.",
  "npcDialogues.betty.negativeDelivery4":
    "Oh, dommage ! Il semble que les ingrédients que tu as apportés ne correspondent pas à ce dont j'ai besoin. Mais ne perd pas espoir ; continue de travailler et reviens bientôt.",
  "npcDialogues.betty.negativeDelivery5":
    "Oh, des mufliers ! Il semble que tu n'aies pas exactement les ingrédients que je cherche. Mais ne t'inquiète pas, mon ami. Continue de travailler dur, et nous fêterons quand tu les trouveras !",
  // Betty NoOrder
  "npcDialogues.betty.noOrder1":
    "Pas de commande active à réaliser pour moi en ce moment, mais cela ne m'empêche pas de t'offrir les meilleures graines et cultures. Approche et voyons ce que tu cherches sur le marché !",
  "npcDialogues.betty.noOrder2":
    "Pas de commande spécifique de ma part aujourd'hui, mais ce n'est pas un problème. Je suis là, pleine d'entrain, prête à te fournir les meilleures graines et à acheter tes magnifiques cultures !",
  // Grimbly Intro
  "npcDialogues.grimbly.intro1":
    "Affamé. Besoin de nourriture. Tu as quelque chose de savoureux pour un gobelin affamé ?",
  "npcDialogues.grimbly.intro2":
    "Gobelin affamé a besoin de sustentation. Tu as ce dont j'ai besoin ?",
  "npcDialogues.grimbly.intro3":
    "Gobelin affamé ici. Tu as quelque chose de délicieux à me faire grignoter ?",
  "npcDialogues.grimbly.intro4":
    "Grimbly a faim. Tu as apporté quelque chose de savoureux pour moi ?",
  // Grimbly Positive Delivery
  "npcDialogues.grimbly.positiveDelivery1":
    "Ah, enfin ! Quelque chose de délicieux pour satisfaire ma faim. Tu es un sauveur, mon ami !",
  "npcDialogues.grimbly.positiveDelivery2":
    "Tu as apporté de la nourriture ! La faim de Grimbly est apaisée. Merci, merci !",
  "npcDialogues.grimbly.positiveDelivery3":
    "Hourra ! Tu m'as apporté de la nourriture pour remplir mon ventre affamé. Grimbly apprécie ta générosité !",
  "npcDialogues.grimbly.positiveDelivery4":
    "Un festin pour Grimbly ! Tu m'as apporté exactement ce dont j'avais besoin. Ta gentillesse ne sera pas oubliée !",
  // Grimbly Negative Delivery
  "npcDialogues.grimbly.negativeDelivery1":
    "Pas de nourriture ? Grimbly a toujours faim. Trouve de la nourriture, apporte de la nourriture. Grimbly reconnaissant.",
  "npcDialogues.grimbly.negativeDelivery2":
    "Pas de nourriture pour Grimbly ? Le ventre de Grimbly gargouille. Reviens quand tu trouves quelque chose de savoureux.",
  "npcDialogues.grimbly.negativeDelivery3":
    "Grimbly a toujours faim. Pas de nourriture ? Continue de chercher, et peut-être la prochaine fois satisferas-tu mon appétit de gobelin.",
  "npcDialogues.grimbly.negativeDelivery4":
    "Les mains vides ? Le ventre de Grimbly gronde. Continue de chercher, et n'oublie pas la faim d'un gobelin !",
  // Grimbly NoOrder
  "npcDialogues.grimbly.noOrder1":
    "Grimbly n'a pas de commande active pour toi, mais cela ne signifie pas que je n'ai pas faim !",
  "npcDialogues.grimbly.noOrder2":
    "Pas de commande active de Grimbly aujourd'hui, mais ne t'inquiète pas ! Je suis toujours à l'affût de friandises savoureuses. Si tu trouves quelque chose de délicieux, tu sais à qui l'apporter !",
  // Grimtooth Intro
  "npcDialogues.grimtooth.intro1":
    "Salutations, voyageur fatigué. Tu me cherches, n'est-ce pas ?",
  "npcDialogues.grimtooth.intro2":
    "Entre dans le royaume des ombres. As-tu rempli ma commande ?",
  "npcDialogues.grimtooth.intro3":
    "Bienvenue, vagabond, dans mon royaume mystique. As-tu ce dont j'ai besoin ?",
  "npcDialogues.grimtooth.intro4":
    "Entre, cher voyageur, et découvre les secrets que j'ai amassés. As-tu trouvé ce que j'ai demandé ?",
  // Grimtooth Positive Delivery
  "npcDialogues.grimtooth.positiveDelivery1":
    "Incroyable ! Tu as trouvé les ingrédients dont j'ai besoin. La magie de Sunflorea est à portée de tes doigts !",
  "npcDialogues.grimtooth.positiveDelivery2":
    "Merveilleux ! Tu as acquis ce que je cherchais. Ensemble, nous plongerons dans les profondeurs les plus obscures de la magie !",
  "npcDialogues.grimtooth.positiveDelivery3":
    "Incroyable ! Tu as rassemblé les composants mystiques dont j'avais besoin. Ton voyage dans le royaume de la magie commence !",
  "npcDialogues.grimtooth.positiveDelivery4":
    "Ah, splendide ! Tu as obtenu les ingrédients insaisissables que je cherchais. Ton voyage dans le royaume de la magie commence !",
  // Grimtooth Negative Delivery
  "npcDialogues.grimtooth.negativeDelivery1":
    "Hélas, les ingrédients requis t'échappent. Ne crains rien, cependant. Continue de chercher, et les mystères se révéleront !",
  "npcDialogues.grimtooth.negativeDelivery2":
    "Oh, ténèbres et désarroi. Tu ne possèdes pas ce dont j'ai besoin. Mais ne t'inquiète pas ; continue de travailler et les ombres continueront de te guider.",
  "npcDialogues.grimtooth.negativeDelivery3":
    "Ne crains rien, cependant. Continue ton travail, et la magie se manifestera.",
  "npcDialogues.grimtooth.negativeDelivery4":
    "Oh, hélas. Tu ne possèdes pas ce dont j'ai besoin. Reviens quand tu l'auras.",
  // Grimtooth NoOrder
  "npcDialogues.grimtooth.noOrder1":
    "Pas de commande active de GrimTooth pour le moment, mais ne t'inquiète pas. Si tu as besoin d'un travail d'artisanat exquis ou si tu as des matériaux à travailler, je serai là, prêt à créer.",
  "npcDialogues.grimtooth.noOrder2":
    "Pas de commande active à réaliser avec GrimTooth, mais si tu as besoin du toucher du maître artisan ou si tu as des matériaux à transformer, je suis à ton service.",
  // Old Salty Intro
  "npcDialogues.oldSalty.intro1":
    "Arghhhh, bienvenue, mon cœur ! Old Salty, c'est mon nom, et le trésor, c'est mon jeu. As-tu ce que je cherche ?",
  "npcDialogues.oldSalty.intro2":
    "Ahoy, terrien ! Old Salty, c'est l'enthousiaste du trésor que tu cherches. Montre-moi ce que tu as trouvé dans ta quête ?",
  "npcDialogues.oldSalty.intro3": "",
  // Old Salty Positive Delivery
  "npcDialogues.oldSalty.positiveDelivery1":
    "Arghhhh, tu as trouvé le trésor que je cherche. Tu as le cœur d'un vrai aventurier, mon ami !",
  "npcDialogues.oldSalty.positiveDelivery2":
    "Avast ! Tu as apporté le trésor même qu'Old Salty désire. Tu gagnes mon respect, mon cœur !",
  "npcDialogues.oldSalty.positiveDelivery3":
    "Ahoy, tu as trouvé le trésor qu'Old Salty chasse. Tu es une vraie légende sur ces eaux, mon cœur !",
  //  Olkd Salty Negative Delivery
  "npcDialogues.oldSalty.negativeDelivery1":
    "Arrrr, pas de trésor pour Old Salty ? Garde les yeux grands ouverts, mon cœur. Les joyaux cachés attendent ta découverte !",
  "npcDialogues.oldSalty.negativeDelivery2":
    "Ah, scélérat ! Pas de trésor pour Old Salty ? Continue de chercher, et tu trouveras les richesses que tu cherches !",
  "npcDialogues.oldSalty.negativeDelivery3":
    "Shiver me timbers ! Pas de trésor pour Old Salty ? Continue de naviguer, mon ami. Le butin est là-bas, t'attendant !",
  // Old Salty NoOrder
  "npcDialogues.oldSalty.noOrder1":
    "Pas de commande active pour le coffre au trésor d'Old Salty, mon cœur, mais cela ne signifie pas qu'il n'y a pas d'aventure à vivre. Garde les yeux ouverts pour les trésors cachés et les eaux inexplorées !",
  "npcDialogues.oldSalty.noOrder2":
    "Pas de trésor spécifique à chercher avec Old Salty pour le moment, mais ne t'inquiète pas, mon marin courageux ! Les hautes mers regorgent de richesses innombrables qui attendent d'être découvertes.",
  // Raven Intro
  "npcDialogues.raven.intro1":
    "Bienvenue dans mon humble demeure. Fais attention où tu marches ; des potions sont en cours de préparation. As-tu obtenu ce que j'avais commandé ?",
  "npcDialogues.raven.intro2":
    "Entre dans le royaume des ombres. Cherche la sagesse, trouve l'enchantement. As-tu ce dont j'ai besoin ?",
  "npcDialogues.raven.intro3":
    "Bienvenue, vagabond, dans mon royaume mystique. Cherches-tu quelque chose de magique, ou as-tu ce dont j'ai besoin ?",
  "npcDialogues.raven.intro4":
    "Entre, cher voyageur. Les ombres te guideront. As-tu trouvé ce que je cherche ?",
  // Raven Positive Delivery
  "npcDialogues.raven.positiveDelivery1":
    "Incroyable ! Tu as trouvé les ingrédients dont j'ai besoin. La magie de Sunflorea est à portée de tes doigts !",
  "npcDialogues.raven.positiveDelivery2":
    "Merveilleux ! Tu as acquis ce que je cherchais. Ensemble, nous plongerons dans les profondeurs les plus obscures de la magie !",
  "npcDialogues.raven.positiveDelivery3":
    "Incroyable ! Tu as rassemblé les composants mystiques dont j'avais besoin. Ton voyage dans le royaume de la magie commence !",
  "npcDialogues.raven.positiveDelivery4":
    "Ah, splendide ! Tu as obtenu les ingrédients insaisissables que je cherchais. Ton voyage dans le royaume de la magie commence !",
  // Raven Negative Delivery
  "npcDialogues.raven.negativeDelivery1":
    "Hélas, les ingrédients requis t'échappent. Ne crains rien, cependant. Continue de chercher, et les mystères se révéleront !",
  "npcDialogues.raven.negativeDelivery2":
    "Oh, ténèbres et désarroi. Tu ne possèdes pas ce dont j'ai besoin. Mais ne t'inquiète pas ; les ombres te guideront vers ce qu'il te faut.",
  "npcDialogues.raven.negativeDelivery3":
    "Ne crains rien, cependant. Continue ta quête, et la magie se manifestera.",
  // Raven NoOrder
  "npcDialogues.raven.noOrder1":
    "Il semble qu'il n'y ait pas de commande active t'attendant dans mon domaine obscur. Cependant, si tu cherches des conseils ou as des questions sur les arts mystiques, n'hésite pas à demander.",
  "npcDialogues.raven.noOrder2":
    "Pas de commande active de ma part, voyageur. Mais ne t'inquiète pas ! Les ombres veillent toujours, et lorsque le moment sera venu, nous plongerons ensemble dans les profondeurs de la magie.",
  // Tywin Intro
  "npcDialogues.tywin.intro1":
    "Ah, un autre roturier honorant ma présence. As-tu ce que je veux ? Parle vite.",
  "npcDialogues.tywin.intro2":
    "Oh, génial, un autre venu de la plèbe. Quelle est ton affaire avec quelqu'un de mon envergure ? As-tu ce dont j'ai besoin ?",
  "npcDialogues.tywin.intro3":
    "Salutations, roturier. Tu cherches la sagesse, n'est-ce pas ? As-tu tout ce que j'ai demandé ?",
  "npcDialogues.tywin.intro4":
    "Que veux-tu ? Parle vite ; le temps c'est de l'argent. Tu as ce dont j'ai besoin, j'imagine ?",
  // Tywin Positive Delivery
  "npcDialogues.tywin.positiveDelivery1":
    "Hmm, il semble que tu n'es pas totalement inutile. Tu as réussi à apporter ce que je voulais. Continue, paysan !",
  "npcDialogues.tywin.positiveDelivery2":
    "Étonnamment, tu as effectivement livré ce que je désirais. Peut-être que tu n'es pas aussi inutile que je le pensais.",
  "npcDialogues.tywin.positiveDelivery3":
    "Ah, travail merveilleux ! Tu as apporté les matériaux dont j'ai besoin. Ensemble, nous créerons des chefs-d'œuvre !",
  "npcDialogues.tywin.positiveDelivery4":
    "Bien. Tu as livré les matériaux dont j'ai besoin. Igor ne décevra pas ; les outils seront remarquables.",
  // Tywin Negative Delivery
  "npcDialogues.tywin.negativeDelivery1":
    "Pathétique. Tu n'as pas ce que j'ai demandé. Ne gaspille pas mon temps avec ton incompétence. Va-t'en !",
  "npcDialogues.tywin.negativeDelivery2":
    "Quelle déception. Tu n'as pas ce que j'ai demandé. Typique de ta sorte. Maintenant, pars !",
  "npcDialogues.tywin.negativeDelivery3":
    "Insatisfaisant. Tu ne possèdes pas ce dont j'ai besoin. Je n'ai pas le temps pour l'incompétence. Reviens quand tu seras capable.",
  "npcDialogues.tywin.negativeDelivery4":
    "Incompétence. Tu manques des matériaux requis. Ne gaspille pas mon temps ; reviens quand tu seras préparé.",
  // Tywin NoOrder
  "npcDialogues.tywin.noOrder1":
    "Ah, il semble que je n'ai pas de commande active pour toi, roturier. Mais si tu requiers ma présence estimée ou as une demande, exprime-la vite. Le temps, c'est de l'argent, après tout.",
  "npcDialogues.tywin.noOrder2":
    "Pas de commande active pour toi aujourd'hui, paysan. Cependant, si tu tombes sur quelque chose digne de mon attention ou requiers mon expertise, tu sais où me trouver.",
  //Bert Intro
  "npcDialogues.bert.intro1":
    "Psst ! Explorateur de l'arcane ! Les vastes secrets de Sunflorea sont nombreux...",
  "npcDialogues.bert.intro2":
    "Ah, esprit semblable ! Sunflorea est le foyer de trésors innombrables...",
  "npcDialogues.bert.intro3":
    "Salutations, porteur du mystérieux ! À Sunflorea, certains objets exigent une livraison...",
  "npcDialogues.bert.intro4":
    "Bonjour, chercheur de l'occulte ! Les enchantements de Sunflorea peuvent être classés en deux...",
  "bert.day":
    "Vous ne pouvez pas retirer cet objet pendant 3 jours après la réclamation.",
  //Bert Positive Delivery
  "npcDialogues.bert.positiveDelivery1":
    "Incroyable ! Tu m'as apporté tout ce dont j'ai besoin...",
  "npcDialogues.bert.positiveDelivery2":
    "Oh, trouvaille fascinante ! Tu m'as apporté exactement les objets que je cherchais...",
  "npcDialogues.bert.positiveDelivery3":
    "Ah, il était temps ! Tu as acquis exactement les objets que je cherchais. Excellent !",
  "npcDialogues.bert.positiveDelivery4":
    "Impressionnant ! Tu m'as apporté exactement ce dont j'ai besoin pour percer les secrets de Sunflorea.",
  //Bert Negative Delivery
  "npcDialogues.bert.negativeDelivery1":
    "Oh, hélas. Tu ne possèdes pas ce que je cherche. Continue d'explorer, je te verrai quand tu auras ce dont j'ai besoin !",
  "npcDialogues.bert.negativeDelivery2":
    "Zut ! Ce que tu as n'est pas tout à fait ce dont j'ai besoin. Continue de travailler sur ma commande, et ensemble, nous dévoilerons les mystères !",
  "npcDialogues.bert.negativeDelivery3":
    "Hmm, pas tout à fait ce à quoi je m'attendais. Mais n'aie crainte ! Il reste encore du temps pour me procurer ce dont j'ai besoin.",
  "npcDialogues.bert.negativeDelivery4":
    "Oh, pas tout à fait ce que je cherchais. Reviens quand tu l'auras. Mais garde les yeux ouverts ; les pages de l'histoire ont encore à révéler.",
  //Bert NoOrder
  "npcDialogues.bert.noOrder1":
    "Pas de commande active à réaliser pour moi aujourd'hui, mais cela ne signifie pas que je n'ai pas de secrets intrigants à partager.",
  "npcDialogues.bert.noOrder2":
    "Pas d'artefact énigmatique à découvrir avec Bert pour le moment, mais cela ne veut pas dire que je manque de faits curieux et de vérités cachées.",
  // Timmy Intro
  "npcDialogues.timmy.intro1":
    "Salut, l'ami ! C'est Timmy, et je suis impatient de voir si tu as ce que j'ai demandé.",
  "npcDialogues.timmy.intro2":
    "Salutations, compagnon d'aventure ! C'est Timmy ici, me demandant si tu as trouvé ce que j'avais demandé.",
  "npcDialogues.timmy.intro3":
    "Bienvenue, bienvenue ! Je suis Timmy, le visage le plus amical de la place. Peux-tu m'aider en vérifiant si tu as ce dont j'ai besoin ?",
  "npcDialogues.timmy.intro4":
    "Hé, hé ! Prêt pour un peu de plaisir au soleil ? C'est Timmy, et j'ai hâte de voir si tu as ce que j'ai demandé.",
  "npcDialogues.timmy.intro5":
    "Bonjour, rayon de soleil ! Timmy est là, espérant que tu as ce que j'ai demandé. Voyons voir ?",
  // Timmy Positive Delivery
  "npcDialogues.timmy.positiveDelivery1":
    "Youpi ! Tu as juste ce dont j'avais besoin. Ta générosité remplit mon cœur de joie. Merci !",
  "npcDialogues.timmy.positiveDelivery2":
    "C'est exactement de cela que je parle ! Tu as apporté précisément ce que je cherchais. Tu es une superstar !",
  "npcDialogues.timmy.positiveDelivery3":
    "Oh, fantastique ! Ton timing ne pouvait pas être meilleur. Tu as égayé ma journée avec ton offre attentionnée. Merci !",
  "npcDialogues.timmy.positiveDelivery4":
    "Hourra ! Tu as livré la marchandise. Sunflorea a de la chance d'avoir quelqu'un d'aussi incroyable que toi !",
  "npcDialogues.timmy.positiveDelivery5":
    "Tu as réussi encore une fois ! Ta gentillesse et ta générosité ne cessent de m'étonner. Merci d'illuminer la place !",
  // Timmy Negative Delivery
  "npcDialogues.timmy.negativeDelivery1":
    "Oupsie-daisy ! On dirait que tu n'as pas ce que je cherche en ce moment. Pas de souci, cependant. Continue d'explorer, et nous trouverons une autre occasion.",
  "npcDialogues.timmy.negativeDelivery2":
    "Oh, non ! Il semble que tu n'aies pas ce dont j'ai besoin pour le moment. Ne t'en fais pas, cependant. Je crois en toi. Reviens quand tu le trouveras !",
  "npcDialogues.timmy.negativeDelivery3":
    "Aw, mince ! Tu n'as pas ce que je cherche en ce moment. Continue d'explorer, cependant ! Peut-être que la prochaine fois, tu tomberas sur ce dont j'ai besoin.",
  "npcDialogues.timmy.negativeDelivery4":
    "Oh, dommage ! Il semble que tu n'aies pas l'objet que je cherche. Mais ne baisse pas les bras ; de nouvelles opportunités t'attendent au coin de la rue.",
  "npcDialogues.timmy.negativeDelivery5":
    "Oh, des mufliers ! Tu n'as pas ce que je cherche. Mais ne t'inquiète pas, mon ami. Continue d'explorer, et nous fêterons quand tu le trouveras !",
  // Timmy NoOrder
  "npcDialogues.timmy.noOrder1":
    "Oh, salut ! Je n'ai pas de commande active pour toi en ce moment, mais je suis toujours désireux d'apprendre et d'entendre des histoires. As-tu des récits passionnants de tes aventures à Sunflorea ? Ou peut-être as-tu rencontré un nouvel ami ours ? Partage-le avec moi !",
  "npcDialogues.timmy.noOrder2":
    "Pas de commande spécifique à réaliser pour moi en ce moment, mais cela ne m'empêche pas d'être curieux ! As-tu des histoires intéressantes sur tes voyages ? Peut-être as-tu rencontré un ours rare ou découvert un joyau caché à Sunflorea ? Parlons-en !",
  // Cornwell Intro
  "npcDialogues.cornwell.intro1":
    "Salutations, jeune aventurier ! Viens-tu portant les objets que je cherche ?",
  "npcDialogues.cornwell.intro2":
    "Ah, bienvenue, chercheur de connaissances et de reliques ! As-tu les objets que j'ai demandés ? Montre-moi ce que tu as.",
  "npcDialogues.cornwell.intro3":
    "Entre dans le royaume des secrets anciens et de la sagesse. As-tu acquis les objets que je désire ? Partage tes découvertes avec moi, jeune.",
  "npcDialogues.cornwell.intro4":
    "Ah, c'est toi ! Celui en quête noble. As-tu trouvé les objets que je cherche ? Viens, montre-moi ce que tu as découvert dans les vastes terres de Sunflower Land.",
  "npcDialogues.cornwell.intro5":
    "Salutations, jeune voyageur ! Les vents de la curiosité t'ont amené ici. As-tu les objets dont j'ai besoin pour enrichir ma collection ?",
  // Cornwell Positive Delivery
  "npcDialogues.cornwell.positiveDelivery1":
    "Merveilleux ! Tu as apporté les reliques mêmes que je désirais. Tes efforts pour préserver l'histoire de Sunflower Land seront reconnus.",
  "npcDialogues.cornwell.positiveDelivery2":
    "Ah, splendide ! Tes trouvailles correspondent parfaitement aux reliques que je cherchais. Ces trésors ajouteront une grande sagesse à ma collection.",
  "npcDialogues.cornwell.positiveDelivery3":
    "Impressionnant ! Les objets que tu as acquis sont exactement ce que je cherchais. L'histoire de Sunflower Land brillera à travers eux.",
  "npcDialogues.cornwell.positiveDelivery4":
    "Ah, jeune aventurier, tu as dépassé mes attentes ! Les objets que tu as apportés seront inestimables pour mes recherches.",
  "npcDialogues.cornwell.positiveDelivery5":
    "Ah, bien joué, mon ami à l'œil vif ! Les objets que tu as livrés trouveront une place d'honneur dans la collection de mon moulin.",
  // Cornwell Negative Delivery
  "npcDialogues.cornwell.negativeDelivery1":
    "Oh, il semble que tu n'aies pas trouvé les objets que je cherche. Ne crains rien ; le voyage de la découverte continue. Continue d'explorer les mystères de Sunflower Land.",
  "npcDialogues.cornwell.negativeDelivery2":
    "Hmm, pas tout à fait les reliques que j'attendais. Mais ne désespère pas ! Continue de chercher, et les trésors de Sunflower Land se révéleront à toi.",
  "npcDialogues.cornwell.negativeDelivery3":
    "Oh, il semble que les objets que je désirais t'échappent. Peu importe ; ta curiosité te mènera finalement aux bonnes découvertes.",
  "npcDialogues.cornwell.negativeDelivery4":
    "Ah, je vois que tu n'as pas trouvé les objets spécifiques dont j'ai besoin. Ne t'inquiète pas ; l'histoire de Sunflower Land recèle de nombreux secrets à déterrer.",
  "npcDialogues.cornwell.negativeDelivery5":
    "Oh, mon cher voyageur, il semble que tu n'aies pas apporté les objets exacts que je cherchais. Mais ta dévotion à l'histoire de Sunflower Land est louable.",
  // Cornwell NoOrder
  "npcDialogues.cornwell.noOrder1":
    "Ah, il semble qu'il n'y ait pas d'objets de quête à livrer pour toi pour le moment. Mais ne sois pas découragé ! Ton voyage à Sunflower Land est rempli d'aventures inédites à découvrir.",
  "npcDialogues.cornwell.noOrder2":
    "Oh, il semble que je n'aie pas besoin de tes services pour le moment. Mais ne t'inquiète pas ; les pages de l'histoire de Sunflower Land tournent sans cesse, et de nouvelles quêtes se présenteront sûrement.",
  "npcDialogues.cornwell.noOrder3":
    "Ah, mes excuses, mais je n'ai rien pour toi à réaliser en ce moment. Ne crains rien, cependant ; ton chemin en tant que chercheur de connaissances te mènera à de nouvelles quêtes en temps voulu.",
  "npcDialogues.cornwell.noOrder4":
    "Ah, il semble que tu n'aies pas reçu de commandes de quête de ma part pour le moment. Mais ne perds pas espoir ; ta nature inquisitive te guidera bientôt vers de passionnantes nouvelles quêtes à Sunflower Land.",
  // Pumpkin Pete Intor
  "npcDialogues.pumpkinPete.intro1":
    "Je t'ai attendu, mon ami ! As-tu ma commande prête ?",
  "npcDialogues.pumpkinPete.intro2":
    "Salut, citrouille ! J'ai été occupé à guider les Bumpkins autour de la place ? As-tu eu ma commande ?",
  "npcDialogues.pumpkinPete.intro3":
    "Salutations, ami ! La place est pleine d'excitation aujourd'hui. As-tu réussi à obtenir ma commande ?",
  "npcDialogues.pumpkinPete.intro4":
    "Bonjour, compagnon d'aventure ! Que t'amène-t-il dans mon humble demeure ? As-tu eu ma commande ?",
  "npcDialogues.pumpkinPete.intro5":
    "Hé, hé ! Bienvenue sur la place ? As-tu réussi à trouver ce dont j'ai besoin ?",
  // Pumpkin Pete Positive Delivery
  "npcDialogues.pumpkinPete.positiveDelivery1":
    "Hourra ! Tu as apporté exactement ce dont j'ai besoin. Tu es un vrai héros de la place !",
  "npcDialogues.pumpkinPete.positiveDelivery2":
    "Citrouille-tastique ! Tu as juste ce qu'il me faut. Tu rends notre petite communauté plus lumineuse !",
  "npcDialogues.pumpkinPete.positiveDelivery3":
    "Graines de joie ! Tu as apporté exactement ce dont j'ai besoin. La place a de la chance de t'avoir !",
  "npcDialogues.pumpkinPete.positiveDelivery4":
    "Fantastique ! Tu es arrivé portant exactement ce que je désirais. Ta gentillesse répand la lumière du soleil sur notre place !",
  "npcDialogues.pumpkinPete.positiveDelivery5":
    "Oh, graines de joie de citrouille ! Tu m'as apporté exactement ce dont j'avais besoin. La place te remercie pour ton aide !",
  // Pumpkin Pete Negative Delivery
  "npcDialogues.pumpkinPete.negativeDelivery1":
    "Oh, non. Il semble que tu n'aies pas ce que je cherche. Ne t'en fais pas, cependant. Je crois en toi. Reviens quand tu l'auras trouvé !",
  "npcDialogues.pumpkinPete.negativeDelivery2":
    "Aw, zut ! Tu n'as pas ce que je cherche en ce moment. Continue d'explorer, cependant ! Peut-être la prochaine fois.",
  "npcDialogues.pumpkinPete.negativeDelivery3":
    "Oh, graines de chagrin ! Tu n'as pas ce que je cherche. Mais n'abandonne pas ; de nouvelles opportunités fleurissent chaque jour !",
  "npcDialogues.pumpkinPete.negativeDelivery4":
    "Oh, des mufliers ! Tu n'as pas ce que je cherche en ce moment. Continue d'explorer, cependant ! Je suis confiant que tu le trouveras.",
  "npcDialogues.pumpkinPete.negativeDelivery5":
    "Oupsie-daisy ! Tu n'as pas ce que je cherche. Mais ne t'inquiète pas, mon ami. Continue d'explorer, et nous fêterons quand tu l'auras trouvé.",
  // Pumpkin Pete NoOrder
  "npcDialogues.pumpkinPete.noOrder1":
    "Ah, mon ami, il semble que je n'ai pas de commande active pour toi en ce moment. Mais n'aie crainte ! Je suis toujours là pour offrir des conseils et un sourire amical de citrouille.",
  "npcDialogues.pumpkinPete.noOrder2":
    "Oh, pas de commande active pour toi aujourd'hui, mon ami. Mais ne t'en fais pas ! N'hésite pas à explorer la place, et si tu as besoin d'aide, je suis ton Bumpkin de confiance.  ",
};

const nyeButton: Record<NyeButton, string> = {
  "plaza.magicButton.query":
    "Un bouton magique est apparu sur la place. Voulez-vous l'appuyer ?",
};

const pirateQuest: Record<PirateQuest, string> = {
  "questDescription.farmerQuest1": "Récoltez 1000 tournesols",
  "questDescription.fruitQuest1": "Récoltez 10 myrtilles",
  "questDescription.fruitQuest2": "Récoltez 100 oranges",
  "questDescription.fruitQuest3": "Récoltez 750 pommes",
  "questDescription.pirateQuest1": "Creusez 30 trous",
  "questDescription.pirateQuest2": "Collectez 10 algues",
  "questDescription.pirateQuest3": "Collectez 10 Pipis",
  "questDescription.pirateQuest4": "Collectez 5 coraux",
};

const obsessionDialogue: Record<ObsessionDialogue, string> = {
  "obsessionDialogue.line1.part1": "Ah, le",
  "obsessionDialogue.line1.part2":
    "! Je souhaite seulement le voir, pas le posséder. Montrez-le moi, et les ",
  "obsessionDialogue.line1.part3": "s seront votre récompense.",

  "obsessionDialogue.line2.part1": "Vous avez apporté le",
  "obsessionDialogue.line2.part2":
    "? Je veux juste le contempler. Laissez-moi voir, et les ",
  "obsessionDialogue.line2.part3": "s seront à vous.",

  "obsessionDialogue.line3.part1": "Est-ce le",
  "obsessionDialogue.line3.part2":
    " que vous avez ? Un simple coup d'œil est tout ce que je désire. Pour cela, vous recevrez les",
  "obsessionDialogue.line3.part3": "s.",

  "obsessionDialogue.line4.part1": "Le",
  "obsessionDialogue.line4.part2":
    " ! Je ne veux pas le garder, juste le contempler. Montrez-le moi, et les",
  "obsessionDialogue.line4.part3": "s sont à vous.",

  "obsessionDialogue.line5.part1": "Vous proposez une vue du",
  "obsessionDialogue.line5.part2":
    " ? Tout ce que je demande est de le voir brièvement. Pour votre générosité, les",
  "obsessionDialogue.line5.part3": "s vous seront accordés.",
};

const offer: Record<Offer, string> = {
  "offer.okxOffer": "Salut Fermier, j'ai une offre exclusive OKX pour toi !",
  "offer.beginWithNFT": "Pour commencer, tu devras frapper un",
  "offer.getStarterPack": "Obtiens le Pack de Démarrage Maintenant",
  "offer.newHere": "Salut Fermier, tu as l'air nouveau ici !",
  "offer.getStarted": "Commence Maintenant",
  "offer.NFT.inclu": "NFT de la ferme. Cela inclura :  ",
  "offer.free": "gratuit",
};

const onboarding: Record<Onboarding, string> = {
  "onboarding.welcome": "Bienvenue dans le jeu décentralisé !",
  "onboarding.step.one": "Étape 1/3",
  "onboarding.step.two": "Étape 2/3 (Créer un portefeuille)",
  "onboarding.step.three": "Étape 3/3 (Créer votre NFT)",
  "onboarding.intro.one":
    "Au cours de vos voyages, vous gagnerez des NFT rares qui doivent être protégés. Pour les sécuriser, vous aurez besoin d'un portefeuille Web3.",
  "onboarding.intro.two":
    "Pour commencer votre voyage, votre portefeuille recevra :",
  "onboarding.cheer": "Vous y êtes presque !",
  "onboarding.form.one": "Remplissez vos coordonnées",
  "onboarding.form.two":
    "et nous vous enverrons un NFT gratuit pour jouer. (Cela nous prendra de 3 à 7 jours)",
  "onboarding.duplicateUser.one": "Déjà inscrit !",
  "onboarding.duplicateUser.two":
    "Il semble que vous vous soyez déjà inscrit pour les tests bêta en utilisant une adresse différente. Une seule adresse peut être utilisée pendant les tests bêta.",
  "onboarding.starterPack": "Pack de démarrage",
  "onboarding.wallet.titleOne": "Configuration de votre portefeuille",
  "onboarding.wallet.one":
    "Il existe de nombreux fournisseurs de portefeuilles, mais nous avons choisi Sequence car ils sont faciles à utiliser et sécurisés.",
  "onboarding.wallet.two":
    "Sélectionnez une méthode d'inscription dans la fenêtre contextuelle et vous êtes prêt. Je vous retrouve ici dans quelques instants !",
  "onboarding.wallet.haveWallet": "J'ai déjà un portefeuille",
  "onboarding.wallet.createButton": "Créer un portefeuille",
  "onboarding.wallet.titleTwo": "Acceptez les conditions d'utilisation",
  "onboarding.wallet.three":
    "Pour acheter votre ferme, vous devrez accepter les conditions d'utilisation de Sunflower Land.",
  "onboarding.wallet.four":
    "Cette étape vous renverra à votre nouveau portefeuille Sequence pour accepter les conditions d'utilisation.",
  "onboarding.wallet.acceptButton": "Accepter les conditions d'utilisation",
  "onboarding.wallet.acceptLoading": "Acceptation des conditions...",
  "onboarding.wallet.titleThree": "Achetez votre ferme !",
  "onboarding.wallet.five":
    "Maintenant que votre portefeuille est configuré, il est temps d'obtenir votre propre NFT de ferme !",
  "onboarding.wallet.six":
    "Ce NFT stockera en toute sécurité tout votre progrès dans Sunflower Land et vous permettra de revenir pour entretenir votre ferme.",
  "onboarding.wallet.final": "C'est parti !",
  "onboarding.wallet.already": "J'ai déjà un portefeuille",
};

const onCollectReward: Record<OnCollectReward, string> = {
  "onCollectReward.Missing.Seed": "Graines manquantes",
  "onCollectReward.Market": "Allez au marché pour acheter des graines.",
  "onCollectReward.Missing.Shovel": "Pelle manquante",
};

const orderhelp: Record<OrderHelp, string> = {
  "orderhelp.Skip.hour":
    "Vous ne pouvez passer une commande qu'après 24 heures !",
  "orderhelp.New.Season":
    "Une nouvelle saison approche, les livraisons seront temporairement fermées.",
  "orderhelp.New.Season.arrival":
    "Ouverture prochaine des Livraisons Saisonnières.",
  "orderhelp.Wisely": "Choisissez judicieusement !",
  "orderhelp.SkipIn": "Passer dans",
  "orderhelp.NoRight": "Pas pour le moment",
  "orderhelp.Skip.Order": "Passer la Commande",
};

const parsnip: Record<Parsnip, string> = {
  "parsnip.hat": "Wow, belles cornes !",
  "parsnip.miss": "Ne manquez pas les futurs événements et cadeaux !",
  "parsnip.Bonus": "Récompense bonus",
  "parsnip.found": "Youpi... tu m'as trouvé !",
  "parsnip.gift": "Réclamer le cadeau  ",
};

const pending: Record<Pending, string> = {
  "pending.calcul": "Les résultats sont en cours de calcul.",
  "pending.comeback": "Revenez plus tard.",
};

const personHood: Record<PersonHood, string> = {
  "personHood.Details.": "Failed Loading Personhood Details",
  "personHood.Identify": "Your identity could not be verified",
  "personHood.Congrat": "Congratulations, your identity has been verified!",
};

const pickserver: Record<Pickserver, string> = {
  "pickserver.server": "Choose a server to join",
  "pickserver.full": "FULL",
  "pickserver.explore": "Explore custom project islands.",
  "pickserver.event": "Special Event",
  "pickserver.built": "Do you want to build your own island?",
};

const plazaSettings: Record<PlazaSettings, string> = {
  "plazaSettings.title.main": "Paramètres de la Plaza",
  "plazaSettings.title.mutedPlayers": "Joueurs muets",
  "plazaSettings.title.keybinds": "Raccourcis clavier",
  "plazaSettings.mutedPlayers.description":
    "Si vous avez rendu muets certains joueurs en utilisant la commande /mute, vous pouvez les voir ici et les démuter si vous le souhaitez.",
  "plazaSettings.mutedPlayers.button": "Joueurs muets",
  "plazaSettings.keybinds.description":
    "Besoin de connaître les raccourcis clavier disponibles ? Consultez-les ici.",
  "plazaSettings.keybinds.button": "Raccourcis clavier",
  "plazaSettings.noMutedPlayers": "Vous n'avez aucun joueur muet.",
  "plazaSettings.unmute": "Démuter",
  "plazaSettings.back": "Retour",
  "plazaSettings.keybind":
    "Besoin de connaître les raccourcis clavier disponibles ? Consultez-les ici.",
};

const playerTrade: Record<PlayerTrade, string> = {
  "playerTrade.loading": "Chargement",
  "playerTrade.no.trade": "Aucun échange disponible.",
  "playerTrade.max.item":
    "Oh non ! Vous avez atteint votre nombre maximum d'articles.",
  "playerTrade.Progress":
    "Veuillez enregistrer vos progrès sur la chaîne avant de continuer.",
  "playerTrade.transaction":
    "Oh oh ! Il semble que vous ayez une transaction en cours.",
  "playerTrade.Please": "Veuillez patienter 5 minutes avant de continuer.",
  "playerTrade.sold": "Vendu",
  "playerTrade.sale": "À vendre :",
  "playerTrade.title.congrat": "Félicitations, votre annonce a été achetée",
};

const portal: Record<Portal, string> = {
  "portal.wrong": "Un problème est survenu",
  "portal.loading": "Chargement",
  "portal.unauthorised": "Non autorisé  ",
};

const purchaseableBaitTranslation: Record<PurchaseableBaitTranslation, string> =
  {
    "purchaseableBait.fishingLure.description":
      "Idéal pour attraper des poissons rares ! ",
  };

const quest: Record<Quest, string> = {
  "quest.mint.free": "Mint Des Wearable GRATUITEMENT",
};

const questions: Record<Questions, string> = {
  "questions.obtain.MATIC": "Comment obtenir du MATIC ?",
  "questions.lowCash": "Vous manquez de liquidités ?",
};

const reaction: Record<Reaction, string> = {
  "reaction.bumpkin": "Bumpkin Niv 3",
  "reaction.bumpkin.10": "Bumpkin Niv 10",
  "reaction.bumpkin.30": "Bumpkin Niv 30",
  "reaction.bumpkin.40": "Bumpkin Niv 40",
  "reaction.sunflowers": "Récolter 100 000 Tournesols",
  "reaction.crops": "Récolter 10 000 cultures",
  "reaction.goblin": "Se transformer en Gobelin",
  "reaction.crown": "Posséder une Couronne de Gobelin  ",
};

const refunded: Record<Refunded, string> = {
  "refunded.itemsReturned":
    "Vos objets ont été retournés dans votre inventaire",
  "refunded.goodLuck": "Bonne chance pour la prochaine fois !",
};

const removeKuebiko: Record<RemoveKuebiko, string> = {
  "removeKuebiko.title": "Retirer Kuebiko",
  "removeKuebiko.description":
    "Cette action va retirer toutes vos graines de votre inventaire.",
  "removeKuebiko.removeSeeds": "Retirer les graines",
};

const resale: Record<Resale, string> = {
  "resale.lookingForItems": "À la recherche d'objets rares ?",
  "resale.actionText": "Revente  ",
};

const restock: Record<Restock, string> = {
  "restock.one.buck":
    "Vous allez utiliser 1 Block Buck pour réapprovisionner tous les articles du magasin dans le jeu",
  "restock.sure": "Êtes-vous sûr de vouloir réapprovisionner ?",
  "restock.seed.buy": "Vous avez trop de graines dans votre panier !",
};

const retreatTerms: Record<RetreatTerms, string> = {
  "retreatTerms.introTravel.zero":
    "Avant de voyager, tu dois augmenter de niveau.",
  "retreatTerms.introTravel.one": "Hey voyageur ! Prêt à explorer ?",
  "retreatTerms.introTravel.two":
    "Sunflower Land regorge d'îles passionnantes où vous pouvez effectuer des livraisons, fabriquer des NFT rares et même chercher des trésors !",
  "retreatTerms.introTravel.three":
    "Différents endroits offrent différentes opportunités pour dépenser vos ressources durement gagnées.",
  "retreatTerms.introTravel.four":
    "À tout moment, cliquez sur le bouton de voyage pour rentrer chez vous.",
  "retreatTerms.resale.title": "À la recherche d'objets rares ?",
  "retreatTerms.resale.one":
    "Les joueurs peuvent échanger des objets spéciaux qu'ils ont fabriqués en jeu.",
  "retreatTerms.resale.two":
    "Vous pouvez les acheter sur des marchés secondaires comme OpenSea.",
  "retreatTerms.resale.three": "Voir les objets sur OpenSea",
};

const rewardTerms: Record<RewardTerms, string> = {
  "reward.title": "Récompense Quotidienne",
  "reward.streak": " jours de suite",
  "reward.comeBackLater": "Revenez plus tard pour plus de récompenses",
  "reward.nextBonus": " Prochain bonus : ",
  "reward.unlock": "Débloquer la récompense",
  "reward.open": "Ouvrir la récompense",
  "reward.lvlRequirement":
    "Vous devez être niveau 3 pour réclamer les récompenses quotidiennes.",
  "reward.revealing": "Qu'est-ce que cela pourrait être ?",
  "reward.streakBonus": "Bonus de série de 3x",
  "reward.found": "Vous avez trouvé",
  "reward.spendWisely": "Utilisez-le judicieusement.",
  "reward.wearable": "Un accessoire pour votre Bumpkin",
  "reward.woohoo": "Youpi ! Voici votre récompense",
  "reward.connectWeb3Wallet":
    "Connectez un portefeuille Web3 pour une récompense quotidienne.",
};

const rulesGameStart: Record<RulesGameStart, string> = {
  "rules.gameStart":
    "Au début du jeu, la plante choisira aléatoirement une combinaison de 4 potions et 1 potion 'chaos'. La combinaison peut être totalement différente ou identique.",
  "rules.potionRuleOne":
    "Objectif : Déterminer la combinaison. Tu as 3 essais pour y arriver. Le jeu se termine si tu obtiens une potion parfaite ou si tu épuises tous tes essais.",
  "rules.potionRuleTwo":
    "Choisis une combinaison de potions et tente de les mélanger.",
  "rules.potionRuleThree":
    "Ajuste ta prochaine combinaison en fonction des retours donnés.",
  "rules.chaosPotionRule":
    "Si tu ajoutes la potion 'chaos', ton score pour cet essai sera de 0.",
  "rules.potionRuleFour":
    "Lorsque le jeu est terminé, le score de ton dernier essai aidera à déterminer ta récompense.",
  "rules.feedbackIconsIntro": "Fais attention aux icônes de retour :",
  "rules.correctPotion": "Une potion parfaite à la position parfaite",
  "rules.almostCorrectPotion": "Potion correcte mais mauvaise position",
  "rules.incorrectPotion": "Oups, mauvaise potion",
  "rules.chaosPotionWarning":
    "Méfie-toi de la potion 'chaos', elle bouscule tout !",
  "rules.potion.feedback":
    "Sélectionnez vos potions et découvrez les secrets des plantes ",
  "BloomBoost.description":
    "Enflammez vos plantes avec des floraisons vibrantes !",
  "DreamDrip.description":
    "Arrosez vos plantes de rêves et de fantasmes magiques.",
  "EarthEssence.description":
    "Exploitez la puissance de la terre pour nourrir vos plantes.",
  "FlowerPower.description":
    "Libérez une explosion d'énergie florale sur vos plantes.",
  "SilverSyrup.description":
    "Un sirop doux pour révéler le meilleur de vos plantes.",
  "HappyHooch.description":
    "Une potion pour apporter joie et rires à vos plantes.",
  "OrganicOasis.description":
    "Créez un paradis organique luxuriant pour vos plantes.",
};

const rulesTerms: Record<RulesTerms, string> = {
  rules: "Règles du jeu",
  "rules.accounts": "1 compte par joueur",
  "rules.noBots": "Pas de bot ou d'automatisation",
  "rules.game": "Ceci est un jeu, pas un produit financier",
  "rules.termsOfService": "Conditions d'utilisation",
};

const sceneDialogueKey: Record<SceneDialogueKey, string> = {
  "sceneDialogues.chefIsBusy": "Le chef est occupé",
};

const seasonTerms: Record<SeasonTerms, string> = {
  "season.accessTo": "Vous avez accès à :",
  "season.banner": "Bannière saisonnière",
  "season.bonusTickets": "Billets saisonniers bonus",
  "season.boostXP": "+10 % d'EXP à partir de la nourriture",
  "season.buyNow": "Acheter maintenant",
  "season.discount": "Réduction de 25 % en SFL sur les articles saisonniers",
  "season.exclusiveOffer": "Offre exclusive !",
  "season.goodLuck": "Bonne chance dans la saison !",
  "season.includes": "Comprend :",
  "season.limitedOffer": " Offre à durée limitée !",
  "season.wearableAirdrop": "Largage de vêtements saisonniers",
  "season.ctk": "Attrapez le Kraken",
};

const session: Record<Session, string> = {
  "session.expired": "Session expirée !",
  "session.expiredMessage":
    "Il semble que votre session ait expiré. Veuillez rafraîchir la page pour continuer à jouer.",
};

const settingsMenu: Record<SettingsMenu, string> = {
  "settingsMenu.timeMachine": "Machine à remonter le temps",
  "settingsMenu.storeOnChain": "Stocker sur la chaîne",
  "settingsMenu.howToPlay": "Comment jouer ?",
  "settingsMenu.community": "Communauté",
  "settingsMenu.swapMaticForSFL": "Échanger MATIC contre SFL",
  "settingsMenu.plazaSettings": "Paramètres de la Plaza",
  "settingsMenu.advanced": "Avancé",
  "settingsMenu.settings": "Paramètres",
  "settingsMenu.communityGarden": "Jardin Communautaire",
  "settingsMenu.share": "Partager",
  "settingsMenu.logout": "Déconnexion",
  "settingsMenu.confirmLogout": "Êtes-vous sûr de vouloir vous déconnecter ?",
};

const share: Record<Share, string> = {
  "share.TweetText": "Visitez ma ferme Sunflower Land",
  "share.ShareYourFarmLink": "Partagez le lien de votre ferme",
  "share.ShowOffToFarmers":
    "Montrez votre ferme aux autres agriculteurs en partageant le lien (URL) de votre ferme pour une visite directe !",
  "share.FarmNFTImageAlt": "Image NFT de la ferme Sunflower-Land",
  "share.CopyFarmURL": "Copier l'URL de la ferme",
  "share.Tweet": "Tweeter",
  "share.Visit": "Visiter",
};

const sharkBumpkinDialogues: Record<SharkBumpkinDialogues, string> = {
  "sharkBumpkin.dialogue.shhhh": "Chut !",
  "sharkBumpkin.dialogue.scareGoblins": "J'essaie d'effrayer les Gobelins.",
};

const shelly: Record<Shelly, string> = {
  "shelly.Dialogue.one": "Salut, Bumpkin ! Bienvenue à la plage !",
  "shelly.Dialogue.two":
    "Après une dure journée de travail à la ferme, il n'y a pas de meilleur endroit pour se détendre et profiter des vagues.",
  "shelly.Dialogue.three":
    "Mais nous avons un petit problème. Un énorme kraken est apparu et a pris le contrôle de notre plage bien-aimée.",
  "shelly.Dialogue.four":
    "Nous aurions vraiment besoin de votre aide, chéri. Prenez vos appâts et vos cannes à pêche, et ensemble, nous allons nous attaquer à ce problème colossal !",
  "shelly.Dialogue.five":
    "Pour chaque tentacule que vous attrapez, je vous fournirai de précieuses écailles de sirène !",
  "shelly.Dialogue.letsgo": "Allons-y !",
};

const shellyDialogue: Record<ShellyDialogue, string> = {
  "shellyPanelContent.tasksFrozen":
    "J'attends le début de la nouvelle saison. Reviens me voir à ce moment-là !",
  "shellyPanelContent.canTrade":
    "Oh là là, tu as une Tentacule de Kraken ! Je l'échangerai contre des écailles de sirène.",
  "shellyPanelContent.cannotTrade":
    "On dirait que tu n'as pas de Tentacules de Kraken en main ! Reviens quand tu en auras.",
  "shellyPanelContent.swap": "Échanger",
  "shellyPanelContent.close": "Fermer",
  "krakenIntro.congrats":
    "Bien joué ! Le Kraken a cessé de terroriser les Bumpkins.",
  "krakenIntro.noMoreTentacles":
    "Tu as collecté toutes les tentacules pour la semaine. Gardons un œil dessus, je suis sûr que la faim reviendra.",
  "krakenIntro.gotIt": "Compris !",
  "krakenIntro.appetiteChanges": "L'appétit du Kraken change constamment.",
  "krakenIntro.currentHunger":
    "En ce moment, il a faim de .... Ouf, c'est mieux que des Bumpkins.",
  "krakenIntro.catchInstruction":
    "Rends-toi à ton spot de pêche et essaie d'attraper la bête !",
};

const shopItems: Record<ShopItems, string> = {
  "shopItems.one": "Hé, hé ! Ravi de vous revoir..",
  "shopItems.two":
    "Vous avez contribué à résoudre la pénurie de cultures, et les prix sont revenus à la normale.",
  "shopItems.three":
    "Il est temps de passer à des cultures plus grandes et meilleures !",
  "betty.intro": "Bienvenue sur mon marché. Que souhaitez-vous faire ?",
  "betty.buySeeds": "Acheter des graines",
  "betty.sellCrops": "Vendre des recoltes",
};

const showingFarm: Record<ShowingFarm, string> = {
  "showing.farm": "Affiché dans la ferme",
  "showing.wallet": "Dans le portefeuille",
};

const snorklerDialogues: Record<SnorklerDialogues, string> = {
  "snorkler.vastOcean": "C'est un vaste océan !",
  "snorkler.goldBeneath":
    "Il doit y avoir de l'or quelque part sous la surface.",
};

const statements: Record<Statements, string> = {
  "statements.adventure": "Commencez votre aventure !",
  "statements.auctioneer.one":
    "J'ai parcouru de vastes étendues de Sunflower Land à la recherche de trésors exotiques à partager avec mes camarades Bumpkins.",
  "statements.auctioneer.two":
    "Ne manquez pas nos enchères, où le coup de mon puissant marteau peut transformer vos ressources durement gagnées en merveilles rares et mintées !",
  "statements.beta.one":
    "La bêta est accessible uniquement aux agriculteurs OG.",
  "statements.beta.two":
    "Restez à l'écoute pour les mises à jour. Nous serons bientôt en direct !",
  "statements.better.luck": "Meilleure chance la prochaine fois !",
  "statements.blacklist.one":
    "Le système de détection anti-bot et multi-comptes a détecté un comportement étrange. Des actions ont été restreintes.",
  "statements.blacklist.two":
    "Veuillez soumettre un ticket avec des détails et nous vous répondrons.",
  "statements.clickBottle":
    "Cliquez sur une bouteille pour l'ajouter à votre choix.",
  "statements.clock.one":
    "Oh oh, il semble que votre horloge ne soit pas synchronisée avec le jeu. Réglez la date et l'heure sur automatique pour éviter les interruptions.",
  "statements.clock.two":
    "Besoin d'aide pour synchroniser votre horloge ? Consultez notre guide !",
  "statements.conversation.one": "J'ai quelque chose pour vous !",
  "statements.cooldown":
    "Pour protéger la communauté, nous imposons une période d'attente de 2 semaines avant que cette ferme puisse être accessible.",
  "statements.docs": "Accédez à la documentation",
  "statements.dontRefresh": "Ne rafraîchissez pas votre navigateur !",
  "statements.guide.one": "Consultez le guide",
  "statements.guide.two": "Consultez ce guide pour vous aider à démarrer.",
  "statements.jigger.one":
    "Vous serez redirigé vers un service tiers pour prendre un selfie rapide. Ne partagez jamais d'informations personnelles ou de données crypto.",
  "statements.jigger.two":
    "Vous avez échoué au test de preuve d'humanité de Jigger.",
  "statements.jigger.three":
    "Vous pouvez continuer à jouer, mais certaines actions seront restreintes pendant que vous êtes vérifié.",
  "statements.jigger.four":
    "Veuillez contacter support@usejigger.com si vous pensez que c'était une erreur.",
  "statements.jigger.five":
    "Votre preuve d'humanité est toujours en cours de traitement par Jigger. Cela peut prendre jusqu'à 2 heures.",
  "statements.jigger.six":
    "Le système de détection multi-comptes a détecté un comportement étrange.",
  "statements.jigger.seven":
    "Vous pouvez continuer à jouer, mais certaines actions seront restreintes pendant que vous êtes vérifié.",
  "statements.lvlUp": "Nourrissez votre Bumpkin pour monter de niveau.",
  "statements.maintenance":
    "De nouvelles choses arrivent ! Merci pour votre patience, le jeu sera bientôt de retour en ligne.",
  "statements.make.a.wish":
    "Accordez un nouveau vœu et voyez à quel point vous êtes chanceux !",
  "statements.minted": "Les gobelins ont fabriqué votre ",
  "statements.minting":
    "Veuillez patienter pendant que votre objet est minté sur la blockchain.",
  "statements.mutant.chicken":
    "Félicitations, votre poulet a pondu un poulet mutant très rare !",
  "statements.new.wish":
    "Un nouveau vœu a été fait pour vous en fonction de votre solde actuel en jetons LP !",
  "statements.no.reward":
    "Vous n'avez aucune récompense disponible ! La liquidité doit être détenue pendant 3 jours pour obtenir une récompense !",
  "statements.ohNo": "Oh non ! Quelque chose s'est mal passé !",
  "statements.openGuide": "Ouvrir le guide",
  "statements.patience": "Merci pour votre patience.",
  "statements.sfl.rewards.received": "Récompenses SFL reçues : ",
  "statements.sflLim.one": "Vous avez atteint la limite quotidienne de SFL.",
  "statements.sflLim.two":
    "Vous pouvez continuer à jouer, mais devrez attendre demain pour vous synchroniser à nouveau.",
  "statements.sniped": "Oh non ! Un autre joueur a acheté ce trade avant vous.",
  "statements.switchNetwork": "Ajouter ou changer de réseau",
  "statements.sync":
    "S'il vous plaît, soyez patients pendant que nous synchronisons toutes vos données sur la chaîne.",
  "statements.tapCont": "Appuyez pour continuer",
  "statements.thankYou": "Merci !",
  "statements.tutorial.one":
    "Le bateau vous emmènera entre les îles où vous pourrez découvrir de nouvelles terres et des aventures passionnantes.",
  "statements.tutorial.two":
    "De nombreuses terres sont éloignées et nécessiteront un Bumpkin expérimenté avant que vous puissiez les visiter.",
  "statements.tutorial.three":
    "Votre aventure commence maintenant, jusqu'où vous explorez... cela dépend de vous.",
  "statements.visit.firePit":
    "Visitez le Fire Pit pour cuisiner de la nourriture et nourrir votre Bumpkin.",
  "statements.wish.granted.time": "Il est temps d'accorder votre vœu !",
  "statements.wish.granted": "Votre vœu a été exaucé.",
  "statements.wish.made": "Vous avez fait un vœu !",
  "statements.wish.ready.in": "Temps avant le prochain vœu : ",
  "statements.wish.thanks": "Merci de soutenir le projet et de faire un vœu.",
  "statements.wish.time":
    "Revenez dans le laps de temps suivant pour voir à quel point vous avez de la chance : ",
  "statements.wish.warning.one":
    "Sachez que seuls les jetons LP que vous avez détenus au moment où le vœu a été fait seront pris en compte lorsque le vœu sera exaucé.",
  "statements.wish.warning.two":
    "Si vous retirez votre liquidité pendant cette période, vous ne recevrez aucune récompense.",
  "statements.wishing-well.info.one":
    "Le puits à souhaits est un endroit magique où des récompenses SFL peuvent être obtenues en faisant un vœu !",
  "statements.wishing-well.info.two":
    "Les vœux sont accordés aux agriculteurs qui ont fourni de la liquidité dans le jeu. Plus d'informations :",
  "statements.wishing-well.info.three":
    "Il semble que vous ayez ces jetons LP magiques dans votre portefeuille !",
  "statements.wishing-well.not.providing.liquidity":
    "Il semble que vous ne fournissiez pas encore de liquidité. Plus d'informations : ",
  "statements.wishing-well.info.four": "fournir de la liquidité",
  "statements.wishing-well.info.five": " dans le jeu",
  "statements.wishing-well.info.six": "fournissant de la liquidité",
  "statements.wishing.well.amount": "Montant des récompenses dans le puits : ",
  "statements.wishing.well.luck": "Voyons à quel point vous êtes chanceux !",
  "statements.wrongChain.one":
    "Consultez ce guide pour vous aider à vous connecter.",
  "statements.feed.bumpkin.one":
    "Vous n'avez pas de nourriture dans votre inventaire.",
  "statements.feed.bumpkin.two":
    "Vous devrez cuisiner de la nourriture pour nourrir votre Bumpkin.",
  "statements.empty.chest":
    "Votre coffre est vide, découvrez des objets rares aujourd'hui !",
  "statements.chest.captcha": "Appuyez sur le coffre pour l'ouvrir",
  "statements.gold.pass.required":
    "Un Gold Pass est requis pour mint des NFT rares.",
  "statements.frankie.plaza":
    "Rendez-vous à la place pour fabriquer des décorations rares !",
  "statements.blacksmith.plaza":
    "Rendez-vous à la place pour plus d'objets rares.",
  "statements.water.well.needed.one":
    "Un puits d'eau supplémentaire est nécessaire.",
  "statements.water.well.needed.two":
    "Pour prendre en charge plus de cultures, construisez un puits.",
  "statements.soldOut": "Épuisé",
  "statements.inStock": "En stock",
  "statements.soldOutWearables": "Voir les accessoires épuisés",
  "statements.craft.composter": "Fabriquer au composteur",
  "statements.wallet.to.inventory.transfer":
    "Transférez des objets depuis votre portefeuille",
  "statements.crop.water": "Ces cultures ont besoin d'eau !",
  "statements.daily.limit": "Limite quotidienne :",
  "statements.sure.buy": "Êtes-vous sûr de vouloir acheter ",
  "statements.max": "Max",
  "statements.perplayer": "par Joueur",
};

const stopGoblin: Record<StopGoblin, string> = {
  "stopGoblin.stop.goblin": "Arrêtez les Gobelins !",
  "stopGoblin.stop.moon": "Arrêtez les Chercheurs de Lune !",
  "stopGoblin.tap.one":
    "Tapez sur les Chercheurs de Lune avant qu'ils ne volent vos ressources",
  "stopGoblin.tap.two":
    "Tapez sur les Gobelins avant qu'ils ne mangent votre nourriture",
  "stopGoblin.left": "Tentatives restantes",
};

const subSettings: Record<SubSettings, string> = {
  "subSettings.title": "Paramètres",
  "subSettings.disableAnimations": "Désactiver les animations",
  "subSettings.enableAnimations": "Activer les animations",
  "subSettings.logout": "Déconnexion",
  "subSettings.transferOwnership": "Transférer la propriété",
  "subSettings.refresh": "Rafraîchir",
  "subSettings.refreshDescription":
    "Rafraîchissez votre session pour récupérer les derniers changements de la Blockchain. Cela est utile si vous avez déposé des objets dans votre ferme.",
};

const swarming: Record<Swarming, string> = {
  "swarming.tooLongToFarm":
    "Faites attention, vous avez mis trop de temps à cultiver vos récoltes !",
  "swarming.goblinsTakenOver":
    "Les gobelins ont pris le contrôle de votre ferme. Vous devez attendre qu'ils partent",
};

const tieBreaker: Record<TieBreaker, string> = {
  "tieBreaker.label": "Décision par Égalité",
  "tieBreaker.tiebreaker": "Décision par Égalité",
  "tieBreaker.closeBid":
    "Si proche ! Vous avez misé exactement les mêmes ressources que la {{supply}} mise. Le gagnant est choisi selon le Bumpkin ayant le plus d'expérience. Malheureusement, vous avez perdu.",
  "tieBreaker.betterLuck":
    "Il est temps de manger plus de gâteaux ! Bonne chance pour la prochaine fois.",
  "tieBreaker.readMore": "En savoir plus",
  "tieBreaker.refundResources": "Rembourser les ressources",
  "tieBreaker.refund": "Remboursement des ressources",
};

const toolDescriptions: Record<ToolDescriptions, string> = {
  // Tools
  "description.axe": "Utilisé pour collecter du bois",
  "description.pickaxe": "Utilisé pour collecter de la pierre",
  "description.stone.pickaxe": "Utilisé pour collecter du fer",
  "description.iron.pickaxe": "Utilisé pour collecter de l'or",
  "description.hammer": "Bientôt disponible",
  "description.rod": "Utilisé pour attraper du poisson",
  "description.rusty.shovel":
    "Utilisé pour retirer des bâtiments et des objets de collection",
  "description.shovel": "Plantez et récoltez des cultures.",
  "description.sand.shovel": "Utilisé pour creuser des trésors",
  "description.sand.drill":
    "Percez profondément pour trouver des trésors peu communs ou rares",
  "description.gold.pickaxe": "Utilisé pour collecter des rubis",
};

const transactionTerms: Record<TransactionTerms, string> = {
  "transaction.t&c.one":
    "Acceptez les termes et conditions pour vous connecter à Sunflower Land.",
  "transaction.t&c.two": "Accepter les termes et conditions",
  "transaction.mintFarm.one": "Votre ferme a été créée !",
  "transaction.mintFarm.two": "Votre ferme sera prête dans",
  "transaction.doNotRefresh": "Ne rafraîchissez pas cette page",
  "transaction.network":
    "Pour sécuriser vos NFT sur la blockchain, des frais de réseau sont nécessaires.",
  "transaction.estimated.fee": "Frais estimés :",
  "transaction.payCardCash": "Payer par carte ou en espèces",
  "transaction.creditCard": "*Des frais de carte de crédit s'appliquent",
  "transaction.rejected": "Transaction rejetée !",
  "transaction.message0":
    "Vous devez accepter la transaction dans la fenêtre popup de Metamask pour continuer.",
  "transaction.message":
    "Cette demande ne déclenchera pas de transaction blockchain ni ne générera de frais de gaz.",
  "transaction.maticAmount": "Montant en MATIC",
  "transaction.donate": "Faire un don",
  "transaction.donating": "Don en cours",
  "transaction.thankYou":
    "Merci pour votre soutien! Veuillez choisir le jeu auquel vous souhaitez faire un don.",
  "transaction.minblockbucks": "Minimum 5 Block Bucks",
  "transaction.payCash": "Payer en espèces",
  "transaction.matic": "Matic",
  "transaction.payMatic": "Payer avec Matic",
  "transaction.blockBucksFarm":
    "Les Block Bucks seront stockés sur votre ferme.",
  "transaction.excludeFees":
    "*Les prix n'incluent pas les frais de transaction.",
  "transaction.blockchain.one":
    "Souhaitez-vous stocker votre progression sur la blockchain ?",
  "transaction.blockchain.two":
    "Le stockage des données sur la blockchain ne réapprovisionne pas les magasins.",
  "transaction.progress": "Stocker la progression",
  "transaction.progChain": "Stocker la progression sur la chaîne",
  "transaction.success":
    "Hourra ! Vos objets sont sécurisés sur la blockchain !",
  "transaction.congrats": "Félicitations, votre transaction a réussi",
  "transaction.transacting.one": "Traitement de votre transaction.",
  "transaction.transacting.two":
    "Veuillez attendre la confirmation de votre transaction par la blockchain.",
  "transaction.transacting.three":
    "Après 5 minutes, toutes les transactions non confirmées seront réinitialisées.",
  "transaction.withdraw.one": "Retrait en cours",
  "transaction.withdraw.two": "Vos objets/tokens ont été envoyés à :",
  "transaction.withdraw.three": "Vous pouvez voir vos objets sur",
  "transaction.openSea": "OpenSea",
  "transaction.withdraw.four":
    "Vous pouvez voir vos tokens en important le Token SFL dans votre portefeuille.",
  "transaction.withdraw.five": "Importer le Token SFL dans MetaMask",
  "transaction.withdraw.six":
    "Veuillez noter qu'OpenSea peut mettre jusqu'à 30 minutes pour afficher vos objets. Vous pouvez également voir vos objets sur",
  "transaction.withdraw.polygon": "PolygonScan",
  "transaction.id": "ID de transaction",
};

const transfer: Record<Transfer, string> = {
  "transfer.sure.adress":
    "Assurez-vous que l'adresse que vous avez fournie est sur la Blockchain Polygon, est correcte et vous appartient. Il n'y a pas de récupération pour les adresses incorrectes.",
  "transfer.Account": "Votre compte #",
  "transfer.Account.Trans": "a été transféré à :",
  "transfer.Farm": "Transfert de votre ferme !",
  "transfer.Refresh": "Ne rafraîchissez pas ce navigateur",
  "transfer.Taccount": "Transférez votre compte",
  "transfer.address": "Adresse du portefeuille :",
};

const treasureModal: Record<TreasureModal, string> = {
  "treasureModal.noShovelTitle": "Pas de pelle à sable !",
  "treasureModal.needShovel":
    "Vous devez avoir une pelle à sable équipée pour pouvoir creuser à la recherche de trésors !",
  "treasureModal.purchaseShovel":
    "Si vous avez besoin d'en acheter une, rendez-vous à la boutique de trésors à l'extrémité sud de l'île.",
  "treasureModal.gotIt": "Compris",
  "treasureModal.maxHolesTitle": "Nombre maximum de trous atteint !",
  "treasureModal.saveTreasure": "Gardez un peu de trésor pour les autres !",
  "treasureModal.comeBackTomorrow":
    "Revenez demain pour chercher plus de trésors.",
  "treasureModal.drilling": "Forage",
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
  "visitIsland.enterIslandId": "Entrez l'ID de l'île: ",
  "visitIsland.visit": "Visiter",
};

const visitislandNotFound: Record<VisitislandNotFound, string> = {
  "visitislandNotFound.title": "Île Introuvable!",
};

const warningTerms: Record<WarningTerms, string> = {
  "warning.noAxe": "Aucune hache sélectionnée !",
  "warning.chat.maxCharacters": "Caractères max :",
  "warning.chat.noSpecialCharacters": "Aucun caractère spécial",
  "warning.level.required": "Niveau requis :",
  "warning.hoarding.message":
    "Vous avez atteint la limite de stockage pour l'objet suivant",
  "warning.hoarding.one":
    "On dit que les Gobelins sont connus pour attaquer les fermes qui regorgent de ressources.",
  "warning.hoarding.two":
    "Pour vous protéger et protéger ces précieuses ressources, veuillez les synchroniser sur la chaîne avant de récolter davantage de :",
  "travelRequirement.notice": "Avant de voyager, vous devez monter de niveau.",
};

const welcomeTerms: Record<WelcomeTerms, string> = {
  "welcome.createAccount": "Créer un compte",
  "welcome.creatingAccount": "Création de votre compte",
  "welcome.email": "Email & Connexion sociale",
  "welcome.login": "Connexion",
  "welcome.needHelp": "Besoin d'aide ?",
  "welcome.otherWallets": "Autres portefeuilles",
  "welcome.signingIn": "Connexion en cours",
  "welcome.signInMessage":
    "Acceptez la demande de signature dans votre portefeuille de navigateur pour vous connecter.",
  "welcome.takeover":
    "Il semble que vous soyez nouveau dans Sunflower Land et ayez revendiqué la propriété du compte d'un autre joueur.",
  "welcome.promo": "Ajoute un Code Promo",
};

const winner: Record<Winner, string> = {
  "winner.congratulations": "Félicitations !",
  "winner.mintTime": "Vous avez 24 heures pour frapper votre prix.",
  "winner.mint": "Frapper",
  "winner.mintTime.one": "Aucun objet disponible à fabriquer !  ",
};

const withdraw: Record<Withdraw, string> = {
  "withdraw.proof":
    "Une preuve d'humanité est nécessaire pour cette fonctionnalité. Veuillez prendre un selfie rapide.",
  "withdraw.verification": "Commencer la vérification",
  "withdraw.unsave": "Tout progrès non enregistré sera perdu.",
  "withdraw.sync":
    "Vous ne pouvez retirer que les articles que vous avez synchronisés avec la blockchain.",
  "withdraw.available": "Disponible le 9 mai",
  "withdraw.sfl.available": "SFL est disponible sur la chaîne",
  "withdraw.max": "Max",
  "withdraw.fee": "frais",
  "withdraw.send.wallet": "Envoyé à votre portefeuille",
  "withdraw.choose": "Choisissez le montant à retirer",
  "withdraw.receive": "Vous recevrez :",
  "withdraw.select.item": "Sélectionnez les articles à retirer",
  "withdraw.select": "Sélectionné",
  "withdraw.opensea":
    "Une fois retiré, vous pourrez voir vos articles sur OpenSea.",
  "withdraw.restricted":
    "Certains articles ne peuvent pas être retirés. D'autres articles peuvent être restreints lorsque ",
  "withdraw.bumpkin.wearing":
    "Votre Bumpkin porte actuellement les articles suivants qui ne peuvent pas être retirés. Vous devrez les déséquiper avant de pouvoir les retirer.",
  "withdraw.bumpkin.sure.withdraw":
    "Êtes-vous sûr de vouloir retirer votre Bumpkin ?",
  "withdraw.bumpkin.play":
    "Pour jouer au jeu, vous avez toujours besoin d'un Bumpkin sur votre ferme.",
  "withdraw.buds": "Sélectionnez les Buds à retirer",
};

const world: Record<World, string> = {
  "world.intro.one": "Salut voyageur ! Bienvenue à la Place de la Citrouille.",
  "world.intro.two":
    "La place est le foyer d'un groupe diversifié de Bumpkins et de Gobelins affamés qui ont besoin de votre aide !",
  "world.intro.three":
    "Quelques conseils rapides avant de commencer votre aventure :",
  "world.intro.visit":
    "Visitez les PNJ et complétez les livraisons pour gagner des SFL et des récompenses rares.",
  "world.intro.craft":
    "Fabriquez des objets de collection rares, des vêtements et des décorations dans les différents magasins.",
  "world.intro.carf.limited":
    "Dépêchez-vous, les articles ne sont disponibles que pour une durée limitée !",
  "world.intro.trade":
    "Échangez des ressources avec d'autres joueurs. Pour interagir avec un joueur, approchez-vous et cliquez sur lui.",
  "world.intro.auction":
    "Préparez vos ressources et visitez la Maison des Enchères pour concurrencer d'autres joueurs pour des objets de collection rares !",
  "world.intro.four":
    "Pour déplacer votre Bumpkin, utilisez les touches fléchées du clavier",
  "world.intro.five": "Sur écran tactile, utilisez le joystick.",
  "world.intro.six":
    "Pour interagir avec un Bumpkin ou un objet, approchez-vous et cliquez dessus",
  "world.intro.seven":
    "Pas de harcèlement, de jurons ou d'intimidation. Merci de respecter les autres.",
};

const wornDescription: Record<WornDescription, string> = {
  "worm.earthworm": "Un ver ondulant qui attire les petits poissons.",
  "worm.grub": "Un asticot juteux - parfait pour les poissons avancés.",
  "worm.redWiggler": "Un ver exotique qui attire les poissons rares.",
};

export const FRENCH_TERMS: Record<TranslationKeys, string> = {
  ...achievementTerms,
  ...action,
  ...addSFL,
  ...availableSeeds,
  ...base,
  ...beach,
  ...beachLuck,
  ...birdiePlaza,
  ...boostDescriptions,
  ...boostEffectDescriptions,
  ...bountyDescription,
  ...buildingDescriptions,
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
  ...errorAndAccess,
  ...errorTerms,
  ...exoticShopItems,
  ...festivetree,
  ...fishDescriptions,
  ...fishermanModal,
  ...fishermanQuest,
  ...fishingChallengeIntro,
  ...fishingGuide,
  ...fishingQuests,
  ...flowerbedguide,
  ...foodDescriptions,
  ...garbageCollector,
  ...gameDescriptions,
  ...gameTerms,
  ...generalTerms,
  ...getContent,
  ...getInputErrorMessage,
  ...goblin_messages,
  ...goldTooth,
  ...goldpassModal,
  ...guideTerms,
  ...grubshop,
  ...halveningCountdown,
  ...harvestflower,
  ...harvestBeeHive,
  ...hayseedHankPlaza,
  ...hayseedHankV2,
  ...heliosSunflower,
  ...henHouseTerms,
  ...howToFarm,
  ...howToSync,
  ...howToUpgrade,
  ...islandupgrade,
  ...interactableModals,
  ...introPage,
  ...introTerms,
  ...islandName,
  ...islandNotFound,
  ...kick,
  ...kicked,
  ...landscapeTerms,
  ...letsGo,
  ...levelUpMessages,
  ...loser,
  ...lostSunflorian,
  ...modalDescription,
  ...mute,
  ...noaccount,
  ...noBumpkin,
  ...noTownCenter,
  ...notOnDiscordServer,
  ...npc,
  ...npcDialogues,
  ...npc_message,
  ...nyeButton,
  ...obsessionDialogue,
  ...offer,
  ...onCollectReward,
  ...onboarding,
  ...orderhelp,
  ...parsnip,
  ...pending,
  ...personHood,
  ...pickserver,
  ...pirateQuest,
  ...plazaSettings,
  ...playerTrade,
  ...portal,
  ...purchaseableBaitTranslation,
  ...quest,
  ...questions,
  ...reaction,
  ...refunded,
  ...removeKuebiko,
  ...resale,
  ...restock,
  ...retreatTerms,
  ...rewardTerms,
  ...rulesGameStart,
  ...rulesTerms,
  ...sceneDialogueKey,
  ...seasonTerms,
  ...session,
  ...settingsMenu,
  ...share,
  ...sharkBumpkinDialogues,
  ...shelly,
  ...shellyDialogue,
  ...shopItems,
  ...showingFarm,
  ...snorklerDialogues,
  ...statements,
  ...stopGoblin,
  ...subSettings,
  ...swarming,
  ...tieBreaker,
  ...toolDescriptions,
  ...transactionTerms,
  ...transfer,
  ...treasureModal,
  ...tutorialPage,
  ...visitislandEnter,
  ...visitislandNotFound,
  ...warningTerms,
  ...welcomeTerms,
  ...winner,
  ...withdraw,
  ...world,
  ...wornDescription,
};
