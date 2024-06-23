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
  "2x.sale": "Venda em dobro",
  achievements: "Conquistas",
  "amount.matic": "Quantidade em MATIC",
  deposit: "Depósito",
  add: "Adicionar",
  addSFL: "Adicionar SFL",
  "add.liquidity": "Adicionar Liquidez",
  "alr.claim": "Já Reivindicado",
  "alr.completed": "Já Feito",
  "alr.crafted": "Já Criado",
  "alr.minted": "Já Mintado",
  "are.you.sure": ENGLISH_TERMS["are.you.sure"],
  auction: "Leilão",
  available: "Disponível",
  back: "Voltar",
  bait: "Isca",
  balance: "Saldo",
  "balance.short": ENGLISH_TERMS["balance.short"],
  banner: "Banner",
  banners: "Banners",
  basket: "Cesta",
  beta: "Beta",
  bid: "Lance",
  bounty: "Recompensa",
  build: "Construir",
  buy: "Comprar",
  cancel: "Cancelar",
  "card.cash": "Cartão/Dinheiro",
  check: "Verificar",
  chest: "Baú",
  chores: "Tarefas",
  claim: "Reivindicar",
  "claim.gift": "Reivindicar Presente",
  "claim.skill": "Reivindicar Habilidade",
  clear: "Limpar",
  close: "Fechar",
  "coming.soon": "Em breve",
  coins: ENGLISH_TERMS["coins"],
  completed: "Concluído",
  confirm: "Confirmar",
  congrats: "Parabéns!",
  connecting: "Conectando",
  continue: "Continuar",
  cook: "Cozinhar",
  copied: "Copiado",
  "copy.address": "Copiar Endereço",
  "copy.link": "Copy Link",
  "copy.failed": "Copy Failed!",
  coupons: "Cupons",
  craft: "Artesanato",
  crops: "Culturas",
  danger: "Perigo",
  date: "Data",
  deliveries: "Entregas",
  delivery: "Entrega",
  details: "Detalhes",
  donate: "Doar",
  donating: "Doando",
  donations: "Donations",
  earn: "Ganhar",
  "easter.eggs": "Ovos de Páscoa",
  egg: "Ovo",
  empty: "Vazio",
  equip: "Equipar",
  error: "Erro",
  exchange: "Trocar",
  exotics: "Exóticos",
  "expand.land": "Expandir sua Terra",
  expand: "Expandir",
  explore: "Explorar",
  faction: "Faction",
  farm: "Fazenda",
  featured: "Destaque",
  fee: "taxa",
  "feed.bumpkin": "Alimentar Bumpkin",
  fertilisers: "Fertilizantes",
  fish: "Peixe",
  "fish.caught": "Peixes Capturados: ",
  flowers: "Flores",
  foods: "Alimentos",
  for: "para",
  forbidden: "Proibido",
  free: "Grátis",
  fruit: "Fruta",
  fruits: "Frutas",
  "go.home": "Ir para Casa",
  gotIt: "Entendi",
  "grant.wish": "Conceder Novo Desejo",
  greenhouse: ENGLISH_TERMS["greenhouse"],
  growing: ENGLISH_TERMS["growing"],
  guide: "Guia",
  honey: "Mel",
  "hungry?": "Com Fome?",
  info: "Informações",
  item: "Item",
  land: "Terra",
  "last.updated": "Última atualização",
  "lets.go": "Vamos lá!",
  limit: "Limite",
  list: "Listar",
  "list.trade": "Listar comércio",
  loading: "Carregando",
  "loser.refund": "Reembolso de recursos",
  lvl: "Nível",
  maintenance: "Manutenção",
  "make.wish": "Faça um Desejo",
  "making.wish": "Fazendo um desejo",
  max: "Máx",
  minimum: "Mínimo",
  mint: "Mintar",
  minting: "Mintando",
  music: "Música",
  next: "Próximo",
  nextSkillPtLvl: "Próximo ponto de habilidade: nível",
  no: "Não",
  "no.limits.exceeded": "Nenhum limite excedido",
  "no.mail": "Sem correio",
  "no.thanks": "Não, obrigado",
  "ocean.fishing": "Pesca no mar",
  off: "Desligado",
  "offer.end": "Oferta termina em",
  ok: "OK",
  on: "Ligado",
  "open.gift": "Abrir Presente",
  optional: ENGLISH_TERMS["optional"],
  "place.map": "Colocar no mapa",
  "placing.bid": "Colocando lance",
  plant: "Plantar",
  "please.try.again": "Por favor, tente novamente mais tarde.",
  "pay.attention.feedback": "Preste atenção aos ícones de feedback",
  print: "Imprimir",
  purchased: "Comprado",
  purchasing: "Comprando",
  rank: "Classificação",
  "read.more": "Leia mais",
  refresh: "Atualizar",
  refreshing: "Atualizando",
  "remaining.free.listings": "{{listingsRemaining}} listagens grátis restantes",
  "remaining.free.purchases": "{{purchasesRemaining}} compras grátis restantes",
  "remaining.free.listing": "1 listagem grátis restante",
  "remaining.free.purchase": "1 compra grátis restante",
  remove: "Remover",
  reqSkillPts: "Pontos de Habilidade Necessários",
  reqSkills: "Habilidades Necessárias",
  required: "Necessário",
  resources: "Recursos",
  restock: "Reabastecer",
  retry: "Tentar Novamente",
  "reward.discovered": "Recompensa Descoberta",
  save: "Salvar",
  saving: "Salvando",
  searching: "Buscando",
  seeds: "Sementes",
  selected: "Selecionado",
  "select.resource": "Selecione seu recurso: ",
  sell: "Vender",
  "sell.all": "Vender Todos",
  "sell.one": "Vender 1",
  "sell.ten": "Vender 10",
  "session.expired": "Sessão expirada!",
  share: "Compartilhar",
  skillPts: "Pontos de Habilidade",
  skills: "Habilidades",
  "skip.order": "Pular Pedido",
  "sound.effects": "Efeitos Sonoros",
  start: "Iniciar",
  submit: "Enviar",
  submitting: "Enviando",
  success: "Sucesso!",
  swapping: "Trocando",
  syncing: "Sincronizando",
  task: "Tarefa",
  "thank.you": "Obrigado!",
  tools: "Ferramentas",
  total: "Total",
  trades: "Negociações",
  trading: "Negociando",
  transfer: "Transferência",
  "try.again": "Tentar Novamente",
  uhOh: "Ah, não!",
  "unlock.land": "Desbloquear mais terreno",
  unlocking: "Desbloqueando",
  unmute: "Ativar som",
  "use.craft": "Usado para criar itens",
  verify: "Verificar",
  version: "Versão",
  viewAll: "Ver Todos",
  visit: "Visitar",
  warning: "Aviso",
  welcome: "Bem-vindo!",
  "wishing.well": "Poço dos Desejos",
  withdraw: "Sacar",
  yes: "Sim",
  "yes.please": "Sim, por favor",
  "choose.wisely": "Escolha com sabedoria",
  "deliveries.closed": ENGLISH_TERMS["deliveries.closed"],
  "enjoying.event": "Gostando desse evento?",
  "flowers.found": "Flores encontradas",
  "linked.wallet": "Carteira vinculada",
  "new.species": "Nova espécie",
  "next.order": "Próximo pedido",
  "no.delivery.avl": "Nenhuma entrega disponível",
  "no.obsessions": "Nenhuma obsessão",
  "place.bid": "Dê seu lance",
  "play.again": "Jogar novamente",
  boosts: "Boosts",
  buds: "Buds",
  buff: "Buff",
  buildings: "Construções",
  chicken: "Galinha",
  chill: "Relaxar",
  collect: "Coletar",
  collectibles: "Colecionáveis",
  complete: "completo",
  compost: "Composto",
  decorations: "Decorações",
  default: "Padrão",
  deliver: "Entregar",
  docs: "Documentos",
  exit: "Sair",
  formula: "Fórmula",
  full: "Cheio",
  gift: "Presente",
  labels: "Etiquetas",
  layouts: "Layouts",
  locked: "Trancado",
  open: "aberto",
  opensea: "OpenSea",
  place: "Posicionar",
  recipes: "Receitas",
  reel: "Puxar",
  remaining: "restante",
  requires: "Requer",
  reward: "Recompensa",
  skip: "Pular",
  skipping: "Pulando",
  special: "Especial",
  speed: "Velocidade",
  test: "Teste",
  treasure: "Tesouro",
  unlocked: "Destrancado",
  wearables: "Vestíveis",
  wish: "Desejo",
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
  "time.second.full": "segundo",
  "time.minute.full": "minuto",
  "time.hour.full": "hora",
  "time.day.full": "dia",

  // Full Plural
  "time.seconds.full": "segundos",
  "time.minutes.full": "minutos",
  "time.hours.full": "horas",
  "time.days.full": "dias",

  // Medium Singular
  "time.sec.med": "seg",
  "time.min.med": "min",
  "time.hr.med": "hr",
  "time.day.med": "dia",

  // Medium Plural
  "time.secs.med": "segs",
  "time.mins.med": "mins",
  "time.hrs.med": "hrs",
  "time.days.med": "dias",

  // Short
  "time.second.short": "s",
  "time.minute.short": "m",
  "time.hour.short": "h",
  "time.day.short": "d",

  // Relative Time
  "time.seconds.ago": ENGLISH_TERMS["time.seconds.ago"],
  "time.minutes.ago": ENGLISH_TERMS["time.minutes.ago"],
  "time.hours.ago": ENGLISH_TERMS["time.hours.ago"],
  "time.days.ago": ENGLISH_TERMS["time.days.ago"],
};

const achievementTerms: Record<AchievementsTerms, string> = {
  "breadWinner.description": "Ganhe 0.001 SFL",
  "breadWinner.one":
    "Bem, bem, bem, parceiro... Parece que você precisa de um pouco de SFL!",
  "breadWinner.two":
    "Em Sunflower Land, um bom estoque de SFL é a chave para criar ferramentas, construções e NFTs raros",
  "breadWinner.three":
    "A maneira mais rápida de ganhar SFL é plantando e vendendo colheitas.",

  "sunSeeker.description": "Colha Girassóis 100 vezes",
  "cabbageKing.description": "Colha Repolhos 200 vezes",
  "jackOLantern.description": "Colha Abóboras 500 vezes",
  "coolFlower.description": "Colha Couve-flor 100 vezes",
  "farmHand.description": "Faça 10.000 Colheitas",
  "beetrootBeast.description": "Colha Beterrabas 2.000 vezes",
  "myLifeIsPotato.description": "Colha Batatas 5.000 vezes",
  "rapidRadish.description": "Colha Rabanetes 200 vezes",
  "twentyTwentyVision.description": "Colha Cenouras 10.000 vezes",
  "stapleCrop.description": "Colha Trigo 10.000 vezes",
  "sunflowerSuperstar.description": "Colha Girassóis 100.000 vezes",
  "bumpkinBillionaire.description": "Ganhe 5.000 SFL",
  "patientParsnips.description": "Colha Nabos 5.000 vezes",
  "cropChampion.description": "Faça 1 milhão de colheitas",

  "busyBumpkin.description": "Alcance o nível 2",
  "busyBumpkin.one":
    "Olá, meu amigo ambicioso! Para desbloquear novas colheitas, expansões, construções e mais, você precisará subir de nível.",
  "busyBumpkin.two":
    "Vá até a Fogueira, prepare uma receita deliciosa e alimente o seu Bumpkin.",

  "kissTheCook.description": "Cozinhe 20 refeições",
  "bakersDozen.description": "Asse 13 bolos",
  "brilliantBumpkin.description": "Alcance o nível 20",
  "chefDeCuisine.description": "Cozinhe 5.000 refeições",

  "scarecrowMaestro.description":
    "Construa um espantalho e aumente suas colheitas",
  "scarecrowMaestro.one":
    "Olá, parceiro! É hora de você aprender a arte da fabricação e aumentar suas habilidades de agricultura",
  "scarecrowMaestro.two":
    "Vá para a Pumpkin Plaza, visite o Ferreiro e construa um Espantalho.",

  "bigSpender.description": "Gaste 10 SFL",
  "museum.description":
    "Tenha 10 tipos diferentes de itens raros colocados em sua terra",
  "highRoller.description": "Gaste 7.500 SFL",
  "timbeerrr.description": "Corte 150 árvores",
  "craftmanship.description": "Fabrique 100 ferramentas",
  "driller.description": "Extraia 50 pedras",
  "ironEyes.description": "Extraia 50 minérios de ferro",
  "elDorado.description": "Extraia 50 minérios de ouro",
  "timeToChop.description": "Fabrique 500 machados",
  "canary.description": "Extraia 1.000 pedras",
  "somethingShiny.description": "Extraia 500 minérios de ferro",
  "bumpkinChainsawAmateur.description": "Corte 5.000 árvores",
  "goldFever.description": "Extraia 500 minérios de ouro",

  // Explorer
  "explorer.one":
    "Vamos reunir um pouco de madeira cortando essas árvores e expandir a ilha. Vá em frente e descubra a melhor maneira de fazer isso.",
  "expansion.description": "Expanda sua terra para novos horizontes.",

  // Well of Prosperity
  "wellOfProsperity.description": "Construa um poço",
  "wellOfProsperity.one": "Bem, bem, bem, o que temos aqui?",
  "wellOfProsperity.two":
    "Parece que suas colheitas precisam de água. Para liberar mais espaços de plantação, você deve primeiro construir um Poço.",

  "contractor.description": "Tenha 10 construções feitas em sua terra",
  "fruitAficionado.description": "Colha 50 frutas",
  "fruitAficionado.one":
    "Olá, coletor de frutas! As frutas são os presentes mais doces da natureza, e elas trazem um sabor especial para sua fazenda.",
  "fruitAficionado.two":
    "Ao coletar diferentes frutas, como maçãs, laranjas e mirtilos, você irá desbloquear receitas exclusivas, aumentará suas habilidades culinárias e criará deliciosos petiscos",

  "orangeSqueeze.description": "Colha Laranja 100 vezes",
  "appleOfMyEye.description": "Colha Maçã 500 vezes",
  "blueChip.description": "Colha Mirtilo 5.000 vezes",
  "fruitPlatter.description": "Colha 50.000 frutas",
  "crowdFavourite.description": "Complete 100 entregas",

  "deliveryDynamo.description": "Complete 3 entregas",
  "deliveryDynamo.one":
    "Olá, confiável fazendeiro! Colhedores de todos os lugares precisam de sua ajuda com as entregas.",
  "deliveryDynamo.two":
    "Ao completar entregas, você os deixará felizes e ganhará algumas fantásticas recompensas em SFL em troca ",

  "seasonedFarmer.description": "Colete 50 Recursos Sazonais",
  "seasonedFarmer.one":
    "Olá, aventureiro sazonal! Sunflower Land é conhecida por suas Temporadas especiais cheias de itens únicos e surpresas.",
  "seasonedFarmer.two":
    "Ao coletar recursos sazonais, você terá acesso a recompensas por tempo limitado, artesanatos exclusivos e tesouros raros. É como ter um ingresso de primeira fila para as maravilhas de cada Temporada.",
  "seasonedFarmer.three":
    "Portanto, complete tarefas, participe de eventos e reúna esses Bilhetes de Temporada para desfrutar do melhor que Sunflower Land tem a oferecer!",
  "treasureHunter.description": "Cave 10 buracos",
  "treasureHunter.one":
    "Ahoy, caçador de tesouros! Sunflower Land está cheia de tesouros escondidos esperando para serem descobertos.",
  "treasureHunter.two":
    "Pegue sua pá e vá para a Ilha do Tesouro, onde você pode cavar itens valiosos e surpresas raras.",
  "eggcellentCollection.description": "Colete 10 Ovos",
  "eggcellentCollection.one":
    "Olá, colecionador de ovos! As galinhas são companheiras maravilhosas da fazenda que nos fornecem ovos deliciosos.",
  "eggcellentCollection.two":
    "Ao coletar ovos, você terá um suprimento fresco de ingredientes para cozinhar, e também irá desbloquear receitas e bônus especiais.",
};

const auction: Record<Auction, string> = {
  "auction.bid.message": "Você fez sua oferta.",
  "auction.reveal": "Revelar vencedores",
  "auction.live": "Leilão está ao vivo!",
  "auction.requirement": "Requisitos",
  "auction.start": "Hora de Início",
  "auction.period": "Período do Leilão",
  "auction.closed": "Leilão fechado",
  "auction.const": "Em construção!",
  "auction.const.soon": "Este recurso está chegando em breve.",
  "auction.title": ENGLISH_TERMS["auction.title"],
};
const addSFL: Record<AddSFL, string> = {
  "addSFL.swapDetails":
    "Sunflower Land oferece uma maneira rápida de trocar Matic por SFL via Quickswap.",
  "addSFL.referralFee":
    "Sunflower Land cobra uma taxa de indicação de 5% para completar esta transação.",
  "addSFL.swapTitle": "Detalhes da Troca",
  "addSFL.minimumReceived": "Mínimo Recebido: ",
};

const availableSeeds: Record<AvailableSeeds, string> = {
  "availableSeeds.select": "Semente não selecionada",
  "availableSeeds.select.plant":
    "Qual semente você gostaria de selecionar e plantar?",
  "quickSelect.empty": ENGLISH_TERMS["quickSelect.empty"],
  "quickSelect.label": ENGLISH_TERMS["quickSelect.label"],
  "quickSelect.cropSeeds": ENGLISH_TERMS["quickSelect.cropSeeds"],
  "quickSelect.greenhouseSeeds": ENGLISH_TERMS["quickSelect.greenhouseSeeds"],
  "quickSelect.purchase": ENGLISH_TERMS["quickSelect.purchase"],
};

const base: Record<Base, string> = {
  "base.far.away": "Você está muito longe",
  "base.iam.far.away": "Estou muito longe",
};

const basicTreasure: Record<BasicTreasure, string> = {
  "giftGiver.description": ENGLISH_TERMS["giftGiver.description"],
  "giftGiver.label": ENGLISH_TERMS["giftGiver.label"],

  "basic.treasure.congratsKey": "Parabéns, você tem uma Chave do Tesouro!",
  "basic.treasure.getKey":
    "Você pode obter Chaves do Tesouro completando tarefas para Bumpkins",
  "basic.treasure.missingKey": "Vocé nao tem uma chave do tesouro",
  "basic.treasure.needKey":
    "Você precisa de uma chave do tesouro para abrir este baú",
  "luxury.treasure.needKey": ENGLISH_TERMS["luxury.treasure.needKey"],
  "rare.treasure.needKey": ENGLISH_TERMS["rare.treasure.needKey"],
  "basic.treasure.openChest":
    "Você gostaria de abrir o baú e coletar uma recompensa?",
  "budBox.open": ENGLISH_TERMS["budBox.open"],
  "budBox.opened": ENGLISH_TERMS["budBox.opened"],
  "budBox.title": ENGLISH_TERMS["budBox.title"],
  "budBox.description": ENGLISH_TERMS["budBox.description"],
  "raffle.title": ENGLISH_TERMS["raffle.title"],
  "raffle.description": ENGLISH_TERMS["raffle.description"],
  "raffle.entries": ENGLISH_TERMS["raffle.entries"],
  "raffle.noTicket": ENGLISH_TERMS["raffle.noTicket"],
  "raffle.how": ENGLISH_TERMS["raffle.how"],
  "raffle.enter": ENGLISH_TERMS["raffle.enter"],
};

const beehive: Record<Beehive, string> = {
  "beehive.harvestHoney": "Colete o Mel!",
  "beehive.noFlowersGrowing": "Não há flores crescendo",
  "beehive.beeSwarm": "Enxame de abelhas",
  "beehive.pollinationCelebration":
    "Celebração da polinização! Suas colheitas terão um boost de 0,2 graças a um enxame de abelhas amigáveis!",
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
    "Olá, eu sou Birdie, a Bumpkin mais bonita por aqui!",
  "birdieplaza.admiringOutfit":
    "Notei você admirando meu traje. Não é fantástico?!?",
  "birdieplaza.currentSeason": ENGLISH_TERMS["birdieplaza.currentSeason"],
  "birdieplaza.collectTickets": ENGLISH_TERMS["birdieplaza.collectTickets"],
  "birdieplaza.whatIsSeason": "O que é uma Temporada?",
  "birdieplaza.howToEarnTickets": ENGLISH_TERMS["birdieplaza.howToEarnTickets"],
  "birdieplaza.earnTicketsVariety":
    ENGLISH_TERMS["birdieplaza.earnTicketsVariety"],
  "birdieplaza.commonMethod": ENGLISH_TERMS["birdieplaza.commonMethod"],
  "birdieplaza.choresAndRewards": ENGLISH_TERMS["birdieplaza.choresAndRewards"],
  "birdieplaza.gatherAndCraft": ENGLISH_TERMS["birdieplaza.gatherAndCraft"],
  "birdieplaza.newSeasonIntro":
    "A cada 3 meses, uma nova temporada é introduzida em Sunflower Land.",
  "birdieplaza.seasonQuests":
    "Esta temporada tem missões emocionantes e colecionáveis raros que você pode ganhar.",
  "birdieplaza.craftItems": ENGLISH_TERMS["birdieplaza.craftItems"],
};

const boostDescriptions: Record<BoostDescriptions, string> = {
  // Mutant Chickens
  "description.speed.chicken.one":
    "Seus frangos agora produzirão ovos 10% mais rápido.",
  "description.speed.chicken.two": "Produz ovos 10% mais rápido",
  "description.fat.chicken.one":
    "Seus frangos agora precisarão de 10% menos trigo por ração.",
  "description.fat.chicken.two":
    "10% menos trigo necessário para alimentar um frango",
  "description.rich.chicken.one": "Seus frangos agora renderão 10% mais ovos.",
  "description.rich.chicken.two": "Rende 10% mais ovos",
  "description.ayam.cemani": "O frango mais raro que existe!",
  "description.el.pollo.veloz.one":
    "Seus frangos botarão ovos 4 horas mais rápido!",
  "description.el.pollo.veloz.two":
    "Dê-me esses ovos rápido! Aumento de velocidade de 4 horas na postura de ovos.",
  "description.banana.chicken":
    "Um frango que impulsiona bananas. Em que mundo vivemos?!",
  "description.knight.chicken": ENGLISH_TERMS["description.knight.chicken"],

  // Boosts
  "description.lab.grow.pumpkin": "+0,3 Rendimento de Abóbora",
  "description.lab.grown.radish": "+0,4 Rendimento de Rabanete",
  "description.lab.grown.carrot": "+0,2 Rendimento de Cenoura",
  "description.purple.trail":
    "Deixe seus oponentes com inveja com a trilha roxa única e fascinante",
  "description.obie": "Um feroz soldado de Berinjela",
  "description.maximus": "Esmague a competição com o robusto Maximus",
  "description.mushroom.house":
    "Uma morada fungosa e caprichosa onde as paredes brotam com charme e até os móveis têm um toque 'esporacular'!",
  "description.Karkinos":
    "Afiado mas gentil, adição de repolho “caranguejo” à sua fazenda!",
  "description.heart.of.davy.jones":
    "Quem o possui detém um poder imenso sobre os sete mares, pode cavar tesouros sem se cansar",
  "description.tin.turtle":
    "A Tartaruga de Estanho dá +0,1 a Pedras que você minera dentro de sua Área de Efeito.",
  "description.emerald.turtle":
    "A Tartaruga Esmeralda dá +0,5 a quaisquer minerais que você minera dentro de sua Área de Efeito.",
  "description.iron.idol":
    "O Ídolo adiciona 1 ferro toda vez que você minera ferro.",
  "description.crim.peckster":
    "Um detetive de gemas com habilidade para desenterrar Crimstones.",
  "description.skill.shrimpy":
    "Shrimpy está aqui para ajudar! Ele garantirá que você obtenha XP extra de peixes.",
  "description.soil.krabby":
    "Peneira rápida com um sorriso! Desfrute de um aumento de velocidade de 10% no composto com este campeão crustáceo.",
  "description.nana":
    "Esta beleza rara é uma maneira infalível de impulsionar suas colheitas de banana.",
  "description.grain.grinder":
    "Moa seu grão e experimente um aumento delicioso no XP do bolo.",
  "description.kernaldo": "O sussurro de milho mágico.",
  "description.kernaldo.1":
    "O sussurro de milho mágico. +25% de Velocidade de Crescimento de Milho.",
  "description.poppy": "O grão de milho místico.",
  "description.poppy.1": "O grão de milho místico. +0,1 Milho por colheita,",
  "description.victoria.sisters": "As irmãs amantes de abóbora",
  "description.undead.rooster":
    "Uma casualidade da guerra. 10% de aumento na produção de ovos.",
  "description.observatory":
    "Explore as estrelas e melhore o desenvolvimento científico",
  "description.engine.core": "O poder do girassol",
  "description.time.warp.totem":
    "Velocidade 2x para plantações, árvores, cozimento e minerais. Dura apenas 2 horas",
  "description.time.warp.totem.expired":
    "Seu Totem de Dobra Temporal expirou. Vá para a Pumpkin Plaza para descobrir e criar mais itens mágicos para impulsionar suas habilidades agrícolas!",
  "description.time.warp.totem.temporarily":
    "O Totem de Dobra Temporal aumenta temporariamente o tempo de cozimento, plantações, árvores e minerais. Aproveite ao máximo!",
  "description.cabbage.boy": "Não acorde o bebê!",
  "description.cabbage.girl": "Shhh, está dormindo",
  "description.wood.nymph.wendy":
    "Lance um encantamento para atrair as fadas da madeira.",
  "description.peeled.potato":
    "Uma batata preciosa, incentiva batatas extras na colheita.",
  "description.potent.potato":
    "Potente! Concede 3% de chance de obter +10 batatas na colheita.",
  "description.radical.radish":
    "Radical! Concede 3% de chance de obter +10 rabanetes na colheita.",
  "description.stellar.sunflower":
    "Estelar! Concede 3% de chance de obter +10 girassóis na colheita.",
  "description.lady.bug":
    "Um inseto incrível que se alimenta de pulgões. Melhora a qualidade da maçã.",
  "description.squirrel.monkey":
    "Um predador natural de laranjas. As árvores de laranja ficam assustadas quando um Macaco-Esquilo está por perto.",
  "description.black.bearry":
    "Seu deleite favorito - Mirtilos suculentos e rechonchudos. Devora-os a punhados!",
  "description.maneki.neko": "O gato da sorte. Puxe o braço e a boa sorte virá",
  "description.easter.bunny": "Um item raro de Páscoa",
  "description.pablo.bunny": "Um coelho mágico de Páscoa",
  "description.foliant": "Um livro de feitiços.",
  "description.tiki.totem":
    "O Totem Tiki adiciona 0,1 madeira a cada árvore que você corta.",
  "description.lunar.calendar":
    "Os cultivos agora seguem o ciclo lunar! Aumento de 10% na velocidade de crescimento das plantações.",
  "description.heart.davy.jones":
    "Quem o possui detém um poder imenso sobre os sete mares, pode cavar tesouros sem se cansar.",
  "description.treasure.map":
    "Um mapa encantado que leva o portador a tesouros valiosos. +20% de lucro com a venda de itens de recompensa da praia.",
  "description.genie.lamp":
    "Uma lâmpada mágica que contém um gênio que concederá três desejos.",
  "description.basic.scarecrow": ENGLISH_TERMS["description.basic.scarecrow"],
  "description.scary.mike": ENGLISH_TERMS["description.scary.mike"],
  "description.laurie.chuckle.crow":
    ENGLISH_TERMS["description.laurie.chuckle.crow"],
  "description.immortal.pear": ENGLISH_TERMS["description.immortal.pear"],
  "description.bale":
    "Vizinho favorito das aves, fornece um retiro aconchegante para as galinhas",
  "description.sir.goldensnout":
    "Um membro real, Sir Goldensnout infunde sua fazenda com prosperidade soberana através de seu esterco dourado.",
  "description.freya.fox":
    "Guardiã encantadora, impulsiona o crescimento de abóboras com seu encanto místico. Colha abóboras abundantes sob seu olhar vigilante.",
  "description.queen.cornelia":
    "Comande o poder régio da Rainha Cornelia e experimente um magnífico impulso de Área de Efeito para a produção de milho. +1 Milho.",
};

const resourceTerms: Record<ResourceTerms, string> = {
  "chicken.description": "Usado para botar ovos",
  "magicMushroom.description": "Usado para cozinhar receitas avançadas",
  "wildMushroom.description": "Usado para cozinhar receitas básicas",
  "honey.description": "Usado para adoçar seu cozimento",
};

const boostEffectDescriptions: Record<BoostEffectDescriptions, string> = {
  "description.obie.boost": "-25% Tempo de Crescimento de Berinjela",
  "description.purple.trail.boost": "+0,2 Berinjela",
  "description.freya.fox.boost": "+0,5 Abóbora",
  "description.sir.goldensnout.boost": "+0,5 Plantações (AOE 4x4)",
  "description.maximus.boost": "+1 Berinjela",
  "description.basic.scarecrow.boost":
    "-20% Tempo de Crescimento de Plantação Básica: Girassol, Batata e Abóbora (AOE 3x3)",
  "description.scary.mike.boost":
    "+0,2 Plantação Média: Cenoura, Repolho, Soja, Beterraba, Couve-flor e Nabo (AOE 3x3)",
  "description.laurie.chuckle.crow.boost":
    "+0,2 Plantação Avançada: Berinjela, Milho, Rabanete, Trigo, Couve (AOE 3x3)",
  "description.bale.boost": "+0,2 Ovo (AOE 4x4)",
  "description.immortal.pear.boost":
    ENGLISH_TERMS["description.immortal.pear.boost"],
  "description.treasure.map.boost":
    "+20% Coins nas Vendas de Recompensa do Tesouro",
  "description.poppy.boost": "+0,1 Milho",
  "description.kernaldo.boost": "-25% Tempo de Crescimento de Milho",
  "description.grain.grinder.boost": "+20% XP de Bolo",
  "description.nana.boost": "-10% Tempo de Crescimento de Banana",
  "description.soil.krabby.boost": "-10% Tempo na Compostagem",
  "description.skill.shrimpy.boost": "+20% XP de Peixe",
  "description.iron.idol.boost": "+1 Ferro",
  "description.emerald.turtle.boost": "+0,5 Pedra, Ferro, Ouro (AOE 3x3)",
  "description.tin.turtle.boost": "+0,1 Pedra (AOE 3x3)",
  "description.heart.of.davy.jones.boost": "+20 Limite Diário de Escavação",
  "description.Karkinos.boost": "+0,1 Repolho (Inativo com Cabbage Boy)",
  "description.mushroom.house.boost": "+0,2 Wild Mushroom",
  "description.boost.gilded.swordfish": "+0,1 Ouro",
  "description.nancy.boost": "-15% Tempo de Crescimento de Plantações",
  "description.scarecrow.boost":
    "-15% Tempo de Crescimento de Plantações; +20% Rendimento de Plantações",
  "description.kuebiko.boost":
    "-15% Tempo de Crescimento de Plantações; +20% Rendimento de Plantações; Sementes Grátis",
  "description.gnome.boost":
    "+10 Rendimento para Plantações Médias/Avançadas (parcela AOE abaixo)",
  "description.lunar.calendar.boost": "-10% Tempo de Crescimento de Plantações",
  "description.peeled.potato.boost": "20% de chance de +1 Batata",
  "description.victoria.sisters.boost": "+20% Abóbora",
  "description.easter.bunny.boost": "+20% Cenoura",
  "description.pablo.bunny.boost": "+0.1 Cenoura",
  "description.cabbage.boy.boost": "+0.25 Repolho (+0.5 com Cabbage Girl)",
  "description.cabbage.girl.boost": "-50% Tempo de Crescimento de Repolho",
  "description.golden.cauliflower.boost": "+100% Couve-flor",
  "description.mysterious.parsnip.boost": "-50% Tempo de Crescimento de Nabo",
  "description.queen.cornelia.boost": "+1 Milho (AOE 3x4)",
  "description.foliant.boost": "+0.2 Couve",
  "description.hoot.boost": "+0.5 Trigo, Rabanete, Couve, Arroz",
  "description.hungry.caterpillar.boost": "Sementes de Flores Grátis",
  "description.black.bearry.boost": "+1 Mirtilo",
  "description.squirrel.monkey.boost": "-50% Tempo de Crescimento de Laranja",
  "description.lady.bug.boost": "+0.25 Maçã",
  "description.banana.chicken.boost": "+0.1 Banana",
  "description.carrot.sword.boost": "Chance 4x de Colheita Mutante",
  "description.stellar.sunflower.boost": "Chance de 3% de +10 Girassóis",
  "description.potent.potato.boost": "Chance de 3% de +10 Batatas",
  "description.radical.radish.boost": "Chance de 3% de +10 Rabanetes",
  "description.lg.pumpkin.boost": "+0.3 Abóbora",
  "description.lg.carrot.boost": "+0.2 Cenoura",
  "description.lg.radish.boost": "+0.4 Rabanete",
  "description.fat.chicken.boost": "-0.1 Trigo para alimentar as galinhas",
  "description.rich.chicken.boost": "+0.1 Ovo",
  "description.speed.chicken.boost": "-10% Tempo de Produção de Ovos",
  "description.ayam.cemani.boost": "+0.2 Ovo",
  "description.el.pollo.veloz.boost": "-4h Tempo de Produção de Ovos",
  "description.rooster.boost": "Chance 2x de Galinha Mutante",
  "description.undead.rooster.boost": "+0.1 Ovo",
  "description.chicken.coop.boost":
    "+1 Rendimento de Ovos; +5 Limite de Galinhas por Galinheiro",
  "description.gold.egg.boost": "Alimente as Galinhas sem Trigo",
  "description.woody.beaver.boost": "+20% Madeira",
  "description.apprentice.beaver.boost":
    "+20% Madeira; -50% Tempo de Recuperação de Árvores",
  "description.foreman.beaver.boost":
    "+20% Madeira; -50% Tempo de Recuperação de Árvores; Corte Árvores sem Machados",
  "description.wood.nymph.wendy.boost": "+0.2 Madeira",
  "description.tiki.totem.boost": "+0.1 Madeira",
  "description.tunnel.mole.boost": "+0.25 Pedra",
  "description.rocky.mole.boost": "+0.25 Ferro",
  "description.nugget.boost": "+0.25 Ouro",
  "description.rock.golem.boost": "Chance de 10% de +2 Pedra",
  "description.crimson.carp.boost": "+0.05 Crimstone",
  "description.battle.fish.boost":
    ENGLISH_TERMS["description.battle.fish.boost"],
  "description.crim.peckster.boost": "+0.1 Crimstone",
  "description.knight.chicken.boost":
    ENGLISH_TERMS["description.knight.chicken.boost"],
  "description.queen.bee.boost": "+1 na Velocidade de Produção de Mel",
  "description.beekeeper.hat.boost": "+0.2 na Velocidade de Produção de Mel",
  "description.humming.bird.boost": "Chance de 20% de +1 Flor",
  "description.beehive.boost":
    "Chance de 10% de +0.2 Cultivo quando a Colmeia estiver cheia",
  "description.walrus.boost": "+1 Peixe",
  "description.alba.boost": "Chance de 50% de +1 Peixe Básico",
  "description.knowledge.crab.boost":
    "Dobra o Efeito de Aumento do Fertilizante Mix de Broto",
  "description.maneki.neko.boost": "1 Comida aleatória grátis por Dia",
  "description.genie.lamp.boost": "Concede 3 Desejos",
  "description.observatory.boost": "+5% XP",
  "description.blossombeard.boost": "+10% XP",
  "description.desertgnome.boost":
    ENGLISH_TERMS["description.desertgnome.boost"],
  "description.christmas.festive.tree.boost": "Presente Grátis no Natal",
  "description.grinxs.hammer.boost": "Reduz pela Metade os Custos de Expansão",
  "description.time.warp.totem.boost":
    "Redução de 50% no Tempo de Plantações, Mineral, Cozimento e Árvore",
  "description.radiant.ray.boost": "+0.1 Ferro",
  "description.babyPanda.boost": "2x XP Mar 2024",
  "description.flower.fox.boost": "-10% Tempo de Crescimento de Flores",
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
  "description.clam.shell": "Uma concha de marisco.",
  "description.sea.cucumber": "Um pepino-do-mar.",
  "description.coral": "Um pedaço de coral, é bonito",
  "description.crab": "Um caranguejo, cuidado com suas garras!",
  "description.starfish": "A estrela do mar.",
  "description.pirate.bounty":
    "Uma recompensa por um pirata. Vale muito dinheiro.",
  "description.wooden.compass":
    "Pode não ser alta tecnologia, mas sempre vai te guiar na direção certa, você acreditaria nisso?",
  "description.iron.compass":
    "Endireite seu caminho para o tesouro! Esta bússola é 'atrativa', e não apenas para o Norte magnético!",
  "description.emerald.compass":
    "Guie seu caminho através dos mistérios exuberantes da vida! Esta bússola aponta para a opulência e grandiosidade!",
  "description.old.bottle":
    "Garrafa de pirata antiga, ecoando contos de aventura em alto mar.",
  "description.pearl": "Brilha ao sol.",
  "description.pipi": "Plebidonax deltoides, encontrado no Oceano Pacífico.",
  "description.seaweed": "Algas marinhas.",
};

const buildingDescriptions: Record<BuildingDescriptions, string> = {
  // Buildings
  "description.water.well": "As plantações precisam de água!",
  "description.kitchen": "Melhore sua habilidade culinária",
  "description.compost.bin": "Produz iscas e fertilizantes regularmente.",
  "description.hen.house": "Expanda seu império de galinhas",
  "description.bakery": "Asse seus bolos favoritos",
  "description.greenhouse": ENGLISH_TERMS["description.greenhouse"],
  "description.turbo.composter":
    "Produz iscas e fertilizantes avançados regularmente.",
  "description.deli": "Satisfaça seu apetite com esses alimentos delicatessen!",
  "description.smoothie.shack": "Produz sucos e batidas espremidos na hora!",
  "description.warehouse": "Aumente seu estoque de sementes em 20%",
  "description.toolshed": "Aumente seu estoque de ferramentas em 50%",
  "description.premium.composter":
    "Produz iscas e fertilizantes especialistas regularmente.",
  "description.town.center":
    "Reúna-se ao redor do centro da cidade para as últimas notícias",
  "description.market": "Compre e venda no Mercado dos Agricultores",
  "description.fire.pit": "Faça comidas, alimente e evolua seu Bumpkin",
  "description.workbench": "Faça ferramentas para coletar recursos",
  "description.tent": "(Descontinuado)",
  "description.house": "Um lugar para descansar a cabeça",
  "description.crop.machine": "Automatize suas plantações",
  "building.oil.remaining": ENGLISH_TERMS["building.oil.remaining"],
  "cooking.building.oil.description":
    ENGLISH_TERMS["cooking.building.oil.description"],
  "cooking.building.oil.boost": ENGLISH_TERMS["cooking.building.oil.boost"],
  "cooking.building.runtime": ENGLISH_TERMS["cooking.building.runtime"],
};

const bumpkinDelivery: Record<BumpkinDelivery, string> = {
  "bumpkin.delivery.selectFlower": "Selecione uma flor",
  "bumpkin.delivery.noFlowers":
    "Oh não, você não tem nenhuma flor para presentear!",
  "bumpkin.delivery.thanks": "Caramba, obrigado Bumpkin!!!",
  "bumpkin.delivery.waiting":
    "Eu estava esperando por isso. Obrigado! Volte logo para mais entregas.",
  "bumpkin.delivery.proveYourself":
    ENGLISH_TERMS["bumpkin.delivery.proveYourself"],
};

const bumpkinItemBuff: Record<BumpkinItemBuff, string> = {
  "bumpkinItemBuff.chef.apron.boost": "+20% Lucro com Bolos",
  "bumpkinItemBuff.fruit.picker.apron.boost": "+0.1 Fruta",
  "bumpkinItemBuff.angel.wings.boost": "30% de Chance de colheita Instantânea",
  "bumpkinItemBuff.devil.wings.boost": "30% de Chance de colheita Instantânea",
  "bumpkinItemBuff.eggplant.onesie.boost": "+0.1 Berinjela",
  "bumpkinItemBuff.golden.spatula.boost": "+10% XP",
  "bumpkinItemBuff.mushroom.hat.boost": "+0.1 Cogumelos",
  "bumpkinItemBuff.parsnip.boost": "+20% Nabos",
  "bumpkinItemBuff.sunflower.amulet.boost": "+10% Girassol",
  "bumpkinItemBuff.carrot.amulet.boost": "-20% Tempo de Crescimento de Cenoura",
  "bumpkinItemBuff.beetroot.amulet.boost": "+20% Beterraba",
  "bumpkinItemBuff.green.amulet.boost": "Chance 10x de colheita",
  "bumpkinItemBuff.Luna.s.hat.boost": "-50% Tempo de Cozimento",
  "bumpkinItemBuff.infernal.pitchfork.boost": "+3 Colheitas",
  "bumpkinItemBuff.cattlegrim.boost": "+0.25 Produção Animal",
  "bumpkinItemBuff.corn.onesie.boost": "+0.1 Milho",
  "bumpkinItemBuff.sunflower.rod.boost": "Chance de 10% +1 Peixe",
  "bumpkinItemBuff.trident.boost": "Chance de 20% +1 Peixe",
  "bumpkinItemBuff.bucket.o.worms.boost": "+1 Minhoca",
  "bumpkinItemBuff.luminous.anglerfish.topper.boost": "+50% XP de Pesca",
  "bumpkinItemBuff.angler.waders.boost": "+10 Limite de Pesca",
  "bumpkinItemBuff.ancient.rod.boost": "Pescar sem vara",
  "bumpkinItemBuff.banana.amulet.boost": "+0.5 Bananas",
  "bumpkinItemBuff.banana.boost": "-20% Tempo de Crescimento de Banana",
  "bumpkinItemBuff.deep.sea.helm": "Chance 3x de Maravilhas Marinhas",
  "bumpkinItemBuff.bee.suit": ENGLISH_TERMS["bumpkinItemBuff.bee.suit"],
  "bumpkinItemBuff.crimstone.hammer": "+2 Crimstones na 5ª coleta seguida",
  "bumpkinItemBuff.crimstone.amulet": "-20% Tempo de Recarga de Crimstones",
  "bumpkinItemBuff.crimstone.armor": "+0.1 Crimstones",
  "bumpkinItemBuff.hornet.mask": "Chance 2x de Enxame de Abelhas",
  "bumpkinItemBuff.honeycomb.shield":
    ENGLISH_TERMS["bumpkinItemBuff.honeycomb.shield"],
  "bumpkinItemBuff.flower.crown": "-50% Tempo de Crescimento de Flores",
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
  "equip.missingHair": "Cabelo é necessário",
  "equip.missingBody": "Corpo é necessário",
  "equip.missingShoes": "Sapatos são necessários",
  "equip.missingShirt": "Camisa é necessária",
  "equip.missingPants": "Calças são necessárias",
  "equip.missingBackground": "Fundo é necessário",
};

const bumpkinSkillsDescription: Record<BumpkinSkillsDescription, string> = {
  // Crops
  "description.green.thumb": "Plantações rendem 5% a mais",
  "description.cultivator": "Plantações crescem 5% mais rápido",
  "description.master.farmer": "Plantações rendem 10% a mais",
  "description.golden.flowers":
    "Chance coletar Girassóis e receber um pouco de Ouro",
  "description.happy.crop": "Chance de obter 2x Plantações",
  // Trees
  "description.lumberjack": "Árvores rendem 10% a mais",
  "description.tree.hugger": "Árvores regeneram 20% mais rápido",
  "description.tough.tree": "Chance de obter 3x de madeira",
  "description.money.tree": "Chance para coins",
  // Rocks
  "description.digger": "Pedras rendem 10% a mais",
  "description.coal.face": "Pedras recuperam 20% mais rápido",
  "description.seeker": "Atrai Monstros de Pedra",
  "description.gold.rush":
    "Chance de obter 2.5x de ouro ao coletar pedras de Ouro",
  // Cooking
  "description.rush.hour": "Prepare refeições 10% mais rápido",
  "description.kitchen.hand": "Refeições rendem 5% de experiência extra",
  "description.michelin.stars":
    "Comida de alta qualidade, ganhe 5% adicional de SFL ao fazer entregas",
  "description.curer":
    "Consumir alimentos deli adiciona 15% de experiência extra",
  // Animals
  "description.stable.hand": "Animais produzem 10% mais rápido",
  "description.free.range": "Animais produzem 10% a mais",
  "description.horse.whisperer": "Aumenta a chance de animais mutantes",
  "description.buckaroo": "Chance de coletas duplas",
};

const bumpkinTrade: Record<BumpkinTrade, string> = {
  "bumpkinTrade.minLevel": "Você deve estar no nível 10 para negociar",
  "bumpkinTrade.noTradeListed": "Você não tem negociações listadas.",
  "bumpkinTrade.sell": "Venda seus recursos para outros jogadores por SFL.",
  "bumpkinTrade.like.list": "O que você gostaria de listar?",
  "bumpkinTrade.purchase": "Comprar no Goblin Retreat",
  "bumpkinTrade.available": ENGLISH_TERMS["bumpkinTrade.available"],
  "bumpkinTrade.quantity": ENGLISH_TERMS["bumpkinTrade.quantity"],
  "bumpkinTrade.price": ENGLISH_TERMS["bumpkinTrade.price"],
  "bumpkinTrade.listingPrice": ENGLISH_TERMS["bumpkinTrade.listingPrice"],
  "bumpkinTrade.pricePerUnit": ENGLISH_TERMS["bumpkinTrade.pricePerUnit"],
  "bumpkinTrade.tradingFee": ENGLISH_TERMS["bumpkinTrade.tradingFee"],
  "bumpkinTrade.youWillReceive": ENGLISH_TERMS["bumpkinTrade.youWillReceive"],
  "bumpkinTrade.cancel": ENGLISH_TERMS["bumpkinTrade.cancel"],
  "bumpkinTrade.list": ENGLISH_TERMS["bumpkinTrade.list"],
  "bumpkinTrade.maxListings": ENGLISH_TERMS["bumpkinTrade.maxListings"],
  "bumpkinTrade.max": ENGLISH_TERMS["bumpkinTrade.max"],
  "bumpkinTrade.min": ENGLISH_TERMS["bumpkinTrade.min"],
  "bumpkinTrade.minimumFloor": ENGLISH_TERMS["bumpkinTrade.minimumFloor"],
  "bumpkinTrade.maximumFloor": ENGLISH_TERMS["bumpkinTrade.maximumFloor"],
  "bumpkinTrade.floorPrice": ENGLISH_TERMS["bumpkinTrade.floorPrice"],
  "bumpkinTrade.price/unit": ENGLISH_TERMS["bumpkinTrade.price/unit"],
  "bumpkinTrade.sellConfirmation":
    ENGLISH_TERMS["bumpkinTrade.sellConfirmation"],
  "bumpkinTrade.cant.sell.all": ENGLISH_TERMS["bumpkinTrade.cant.sell.all"],
};

const goblinTrade: Record<GoblinTrade, string> = {
  "goblinTrade.bulk": ENGLISH_TERMS["goblinTrade.bulk"],
  "goblinTrade.conversion": ENGLISH_TERMS["goblinTrade.conversion"],
  "goblinTrade.select": ENGLISH_TERMS["goblinTrade.select"],
  "goblinTrade.hoarding": ENGLISH_TERMS["goblinTrade.hoarding"],
  "goblinTrade.vipRequired": ENGLISH_TERMS["goblinTrade.vipRequired"],
  "goblinTrade.vipDelivery": ENGLISH_TERMS["goblinTrade.vipDelivery"],
};

const buyFarmHand: Record<BuyFarmHand, string> = {
  "buyFarmHand.howdyBumpkin": "Olá Bumpkin.",
  "buyFarmHand.confirmBuyAdditional":
    "Tem certeza de que deseja comprar um Bumpkin adicional?",
  "buyFarmHand.farmhandCoupon": "1 Cupom de Ajudante de Fazenda",
  "buyFarmHand.adoptBumpkin": "Adote um Bumpkin",
  "buyFarmHand.additionalBumpkinsInfo":
    "Bumpkins adicionais podem ser usados para equipar roupas que impulsionam sua fazenda.",
  "buyFarmHand.notEnoughSpace": "Espaço insuficiente - atualize sua ilha",
  "buyFarmHand.buyBumpkin": "Comprar Bumpkin",
  "buyFarmHand.newFarmhandGreeting":
    "Eu sou seu novo ajudante de fazenda. Mal posso esperar para começar a trabalhar!",
};

const claimAchievement: Record<ClaimAchievement, string> = {
  "claimAchievement.alreadyHave": "Você já possui esta conquista",
  "claimAchievement.requirementsNotMet": "Você não atende aos requisitos",
};

const changeLanguage: Record<ChangeLanguage, string> = {
  "changeLanguage.confirm": ENGLISH_TERMS["changeLanguage.confirm"],
  "changeLanguage.contribute": ENGLISH_TERMS["changeLanguage.contribute"],
  "changeLanguage.contribute.message":
    ENGLISH_TERMS["changeLanguage.contribute.message"],
};

const chat: Record<Chat, string> = {
  "chat.Fail": "Conexão falhou",
  "chat.mute": "Você está silenciado",
  "chat.again": "Você poderá conversar novamente em",
  "chat.Kicked": "Expulso",
};

const chickenWinner: Record<ChickenWinner, string> = {
  "chicken.winner.playagain": "Clique aqui para jogar novamente",
};

const choresStart: Record<ChoresStart, string> = {
  "chores.harvestFields": "Colha suas plantações",
  "chores.harvestFieldsIntro":
    "Esses campos não vão arar sozinhos. Colha 3 Girassóis.",
  "chores.earnSflIntro":
    "Se você quer se dar bem no negócio agrícola, é melhor começar vendendo girassóis, comprando sementes e colhendo os lucros.",
  "chores.reachLevel": "Alcance o nível 2",
  "chores.reachLevelIntro":
    "Se você quer subir de nível e desbloquear novas habilidades, é melhor começar a cozinhar e comer.",
  "chores.chopTrees": "Corte 3 Árvores",
  "chores.helpWithTrees":
    "Meus velhos ossos não são mais como costumavam ser, acho que você poderia me dar uma mão com essas malditas árvores que precisam ser cortadas? Nosso Ferreiro local irá ajudá-lo a fabricar algumas ferramentas.",
  "chores.choresFrozen": ENGLISH_TERMS["chores.choresFrozen"],
  "chores.newSeason":
    "Uma nova temporada se aproxima, as tarefas serão temporariamente encerradas.",
  "chores.noChore": "Desculpe, não tenho tarefas para fazer agora.",
  "chores.left": ENGLISH_TERMS["chores.left"],
};

const chumDetails: Record<ChumDetails, string> = {
  "chumDetails.gold":
    "O ouro cintilante pode ser visto a 100 milhas de distância",
  "chumDetails.iron":
    "Um brilho cintilante, pode ser visto de todos os ângulos durante o crepúsculo",
  "chumDetails.stone": "Talvez jogar algumas pedras atraia alguns peixes",
  "chumDetails.egg": "Hmm, não tenho certeza de que peixe gostaria de ovos...",
  "chumDetails.sunflower":
    "Um atrativo ensolarado e vibrante para peixes curiosos.",
  "chumDetails.potato": "Batatas fazem para um banquete aquático incomum.",
  "chumDetails.pumpkin":
    "Peixes podem ser intrigados pelo brilho laranja das abóboras.",
  "chumDetails.carrot": "Melhor usado com minhocas para pegar Anchovas!",
  "chumDetails.cabbage": "Uma tentação folhosa para herbívoros subaquáticos.",
  "chumDetails.beetroot":
    "Beterrabas, o deleite subaquático para peixes destemidos.",
  "chumDetails.cauliflower":
    "Peixes podem achar os floretes estranhamente atrativos.",
  "chumDetails.parsnip":
    "Um atrativo terroso e radicular para peixes curiosos.",
  "chumDetails.eggplant":
    "Beringelas: a aventura aquática para os peixes ousados.",
  "chumDetails.corn": "Milho na espiga - um petisco estranho, mas intrigante.",
  "chumDetails.radish": "Rabanetes, o tesouro enterrado para aquáticos.",
  "chumDetails.wheat":
    "Trigo, um deleite granulado para forrageadores subaquáticos.",
  "chumDetails.kale": "Uma surpresa verde folhosa para os peixes inquisitivos.",
  "chumDetails.blueberry":
    "Muitas vezes confundido por peixes azuis como parceiros em potencial.",
  "chumDetails.orange":
    "Laranjas, a curiosidade cítrica para criaturas marinhas.",
  "chumDetails.apple": "Maçãs - um enigma crocante abaixo das ondas.",
  "chumDetails.banana": "Mais leve que a água!",
  "chumDetails.seaweed": "Um sabor do oceano em um lanche subaquático folhoso.",
  "chumDetails.crab":
    "Um petisco tentador para um peixe curioso do mar profundo.",
  "chumDetails.anchovy":
    "Anchovas, misteriosamente atraentes para os foras-da-lei do mar.",
  "chumDetails.redSnapper": "Um mistério escondido nas profundezas do oceano.",
  "chumDetails.tuna": "O que é grande o suficiente para comer um atum?",
  "chumDetails.squid": "Acorde uma raia com seu petisco favorito!",
  "chumDetails.wood": "Madeira. Uma escolha interessante....",
  "chumDetails.fatChicken": ENGLISH_TERMS["chumDetails.fatChicken"],
  "chumDetails.richChicken": ENGLISH_TERMS["chumDetails.richChicken"],
  "chumDetails.speedChicken": ENGLISH_TERMS["chumDetails.speedChicken"],
  "chumDetails.redPansy": ENGLISH_TERMS["chumDetails.redPansy"],
  "chumDetails.horseMackerel": ENGLISH_TERMS["chumDetails.horseMackerel"],
  "chumDetails.sunfish": ENGLISH_TERMS["chumDetails.sunfish"],
};

const community: Record<Community, string> = {
  "community.toast": "O texto do brinde está vazio",
  "community.url": "Digite a URL do seu repositório",
  "comunity.Travel": "Viaje para ilhas construídas pela comunidade",
};

const cropBoomMessages: Record<CropBoomMessages, string> = {
  "crop.boom.welcome": "Bem-vindo ao Crop Boom",
  "crop.boom.reachOtherSide":
    "Chegue ao outro lado do campo de cultivo perigoso para reivindicar um Token de Arcade",
  "crop.boom.bewareExplodingCrops":
    "Cuidado com os plantações explosivas. Se você pisar neles, começará do início",
  "crop.boom.newPuzzleDaily": "Cada dia um novo quebra-cabeça aparecerá",
  "crop.boom.back.puzzle": "Volte mais tarde para um novo quebra-cabeça!",
};

const compostDescription: Record<CompostDescription, string> = {
  "compost.fruitfulBlend": ENGLISH_TERMS["compost.fruitfulBlend"],
  "compost.sproutMix": ENGLISH_TERMS["compost.sproutMix"],
  "compost.sproutMixBoosted": ENGLISH_TERMS["compost.sproutMixBoosted"],
  "compost.rapidRoot": ENGLISH_TERMS["compost.rapidRoot"],
};

const composterDescription: Record<ComposterDescription, string> = {
  "composter.compostBin": "Detalhes da Composteira Iniciante...",
  "composter.turboComposter": "Detalhes do Composteira Avançada...",
  "composter.premiumComposter": "Detalhes do Composteira Experiente...",
};

const confirmSkill: Record<ConfirmSkill, string> = {
  "confirm.skillClaim": "Tem certeza de que deseja reivindicar a habilidade?",
};

const confirmationTerms: Record<ConfirmationTerms, string> = {
  "confirmation.sellCrops": ENGLISH_TERMS["confirmation.sellCrops"],
  "confirmation.buyCrops": ENGLISH_TERMS["confirmation.buyCrops"],
};

const conversations: Record<Conversations, string> = {
  "home-intro.one": ENGLISH_TERMS["home-intro.one"],
  "home-intro.three": ENGLISH_TERMS["home-intro.three"],
  "home-intro.two": ENGLISH_TERMS["home-intro.two"],
  "firepit-intro.one": ENGLISH_TERMS["firepit-intro.one"],
  "firepit-intro.two": ENGLISH_TERMS["firepit-intro.two"],
  "firepit.increasedXP": ENGLISH_TERMS["firepit.increasedXP"],
  "hank-intro.headline": "Ajude um velho?",
  "hank-intro.one": "Como vai, Bumpkin! Bem-vindo ao nosso pequeno paraíso.",
  "hank-intro.two":
    "Tenho trabalhado nesta terra por cinquenta anos, mas certamente poderia usar alguma ajuda.",
  "hank-intro.three":
    "Posso ensinar-lhe o básico da agricultura, contanto que me ajude com meus afazeres diários.",
  "hank.crafting.scarecrow": "Fabrique um espantalho",
  "hank-crafting.one":
    "Hmm, essas colheitas estão crescendo muito devagar. Não tenho tempo para esperar.",
  "hank-crafting.two": "Fabrique um espantalho para acelerar suas colheitas.",
  "hank.choresFrozen": ENGLISH_TERMS["hank.choresFrozen"],
  "betty-intro.headline": "Como fazer crescer sua fazenda",
  "betty-intro.one": "Ei, ei! Bem-vindo ao meu mercado.",
  "betty-intro.two":
    "Traga-me sua melhor colheita, e eu lhe darei um preço justo por elas!",
  "betty-intro.three":
    "Precisa de sementes? De batatas a nabos, eu tenho tudo o que você precisa!",
  "betty.market-intro.one":
    "E aí, Bumpkin! É a Betty do mercado de agricultores. Eu viajo entre ilhas para comprar colheitas e vender sementes frescas.",
  "betty.market-intro.two":
    "Boas notícias: você acabou de encontrar uma pá novinha em folha! Más notícias: nós enfrentamos uma escassez de colheitas.",
  "betty.market-intro.three":
    "Por tempo limitado, estou oferecendo o dobro do dinheiro para qualquer colheita que você me trouxer.",
  "betty.market-intro.four":
    "Colha esses Girassóis e vamos começar seu império agrícola.",
  "bruce-intro.headline": "Introdução à Culinária",
  "bruce-intro.one": "Sou o proprietário deste adorável bistrô.",
  "bruce-intro.two":
    "Traga-me recursos e eu vou cozinhar toda a comida que você puder comer!",
  "bruce-intro.three":
    "Olá fazendeiro! Consigo identificar um Bumpkin com fome a milhas de distância.",
  "blacksmith-intro.headline": "Corte, corte, corte.",
  "blacksmith-intro.one":
    "Sou um mestre das ferramentas, e com os recursos certos, posso fabricar qualquer coisa que você precise... inclusive mais ferramentas!",
  "pete.first-expansion.one":
    "Parabéns, Bumpkin! Sua fazenda está crescendo mais rápido do que um pé de feijão em uma tempestade de chuva!",
  "pete.first-expansion.two":
    "Com cada expansão, você encontrará coisas legais como recursos especiais, novas árvores e mais para coletar!",
  "pete.first-expansion.three":
    "Fique de olho em presentes surpresa dos goblins generosos enquanto você explora - eles não são apenas construtores experientes, mas também dão presentes secretos astutos!",
  "pete.first-expansion.four":
    "Parabéns, Bumpkin! Continue com o bom trabalho.",
  "pete.craftScarecrow.one": "Hmm, essas colheitas estão crescendo devagar.",
  "pete.craftScarecrow.two":
    "Sunflower Land está cheia de itens mágicos que você pode fabricar para melhorar suas habilidades agrícolas.",
  "pete.craftScarecrow.three":
    "Vá até o banco de trabalho e fabrique um espantalho para acelerar esses Girassóis.",
  "pete.levelthree.one": "Parabéns, seu dedo verde está realmente brilhando!",
  "pete.levelthree.two":
    "Já passou da hora de irmos para a Praça, onde sua habilidade agrícola pode brilhar ainda mais.",
  "pete.levelthree.three":
    "Na praça você pode entregar seus recursos por recompensas, fabricar itens mágicos e negociar com outros jogadores.",
  "pete.levelthree.four":
    "Você pode viajar clicando no ícone do mundo no canto inferior esquerdo.",
  "pete.help.zero":
    "Visite a fogueira, cozinhe comida e coma para subir de nível.",
  "pete.pumpkinPlaza.one":
    "À medida que você sobe de nível, desbloqueará novas áreas para explorar. Primeiro é a Pumpkin Plaza.... minha casa!",
  "pete.pumpkinPlaza.two":
    "Aqui você pode completar entregas por recompensas, fabricar itens mágicos e negociar com outros jogadores.",
  "sunflowerLand.islandDescription":
    "Sunflower Land está cheia de ilhas emocionantes onde você pode completar entregas, fabricar NFTs raros e até mesmo cavar tesouros!",
  "sunflowerLand.opportunitiesDescription":
    "Locais diferentes trazem diferentes oportunidades para gastar seus recursos suados.",
  "sunflowerLand.returnHomeInstruction":
    "A qualquer momento, clique no botão de viagem para voltar para casa.",
  "grimbly.expansion.one":
    "Saudações, agricultor(a) em ascensão! Eu sou Grimbly, um experiente Construtor Goblin.",
  "grimbly.expansion.two":
    "Com os materiais certos e minhas habilidades de artesanato antigas, podemos transformar sua ilha em uma obra-prima.",
  "luna.portalNoAccess":
    "Hmm, este portal acabou de aparecer do nada. O que isso poderia significar?",
  "luna.portals": "Portais",
  "luna.rewards": "Recompensas",
  "luna.travel":
    "Viaje para esses portais construídos pelos jogadores(as) e ganhe recompensas.",
  "pete.intro.one":
    "Olá, Bumpkin! Bem-vindo ao Sunflower Land, o paraíso agrícola abundante onde tudo é possível!",
  "pete.intro.two":
    "Que bela ilha você montou! Sou o Pumpkin Pete, seu fazendeiro vizinho.",
  "pete.intro.three":
    "Neste momento, os jogadores(as) estão celebrando um festival na praça com recompensas fantásticas e itens mágicos.",
  "pete.intro.four":
    "Antes de poder se juntar à diversão, você precisará expandir sua fazenda e reunir alguns recursos. Você não quer aparecer de mãos vazias!",
  "pete.intro.five":
    "Para começar, você vai querer derrubar aquelas árvores e expandir sua ilha.",
  "mayor.plaza.changeNamePrompt":
    "Você quer mudar seu nome? Infelizmente, não consigo fazer isso por você agora, a papelada é muito para eu lidar.",
  "mayor.plaza.intro":
    "Olá, colega Bumpkin, parece que ainda não fomos apresentados.",
  "mayor.plaza.role":
    "Sou o prefeito desta cidade! Estou encarregado de garantir que todos estejam felizes. Também me certifico de que todos tenham um nome!",
  "mayor.plaza.fixNamePrompt":
    "Você ainda não tem um nome? Bem, podemos consertar isso! Quer que eu prepare os papéis?",
  "mayor.plaza.enterUsernamePrompt": "Digite seu nome de usuário: ",
  "mayor.plaza.usernameValidation":
    "Por favor, esteja ciente de que os nomes de usuário devem obedecer aos nossos",
  "mayor.plaza.niceToMeetYou": "Prazer em conhecê-lo, !",
  "mayor.plaza.congratulations":
    "Parabéns , sua papelada agora está completa. Nos vemos por aí!",
  "mayor.plaza.enjoyYourStay":
    "Espero que você aproveite sua estadia no Sunflower Land! Se precisar de mim novamente, basta voltar até mim!",
  "mayor.codeOfConduct": "Código de Conduta",
  "mayor.failureToComply":
    "O não cumprimento pode resultar em penalidades, incluindo possível suspensão da conta",
  "mayor.paperworkComplete":
    "Seus papéis estão agora completos. Vejo você por aí",
};

const cropFruitDescriptions: Record<CropFruitDescriptions, string> = {
  // Crops
  "description.sunflower": "Uma flor ensolarada",
  "description.potato": "Mais saudável do que você pensa.",
  "description.pumpkin": "Há mais na abóbora do que torta.",
  "description.carrot": "Eles são bons para os seus olhos!",
  "description.cabbage": "Antes um luxo, agora um alimento para muitos.",
  "description.beetroot": "Bom para ressacas!",
  "description.cauliflower": "Excelente substituto para o arroz!",
  "description.parsnip": "Não confundir com cenouras.",
  "description.eggplant": "Obra de arte comestível da natureza.",
  "description.corn": "Grãos de sol beijados, tesouro de verão da natureza.",
  "description.radish": "Leva tempo, mas vale a pena esperar!",
  "description.wheat": "A colheita mais colhida do mundo.",
  "description.kale": "Um alimento poderoso para Bumpkin!",
  "description.soybean": ENGLISH_TERMS["description.soybean"],

  "description.grape": ENGLISH_TERMS["description.grape"],
  "description.olive": ENGLISH_TERMS["description.olive"],
  "description.rice": ENGLISH_TERMS["description.rice"],

  // Fruits
  "description.blueberry": "A fraqueza de um Goblin",
  "description.orange": "Vitamina C para manter seu Bumpkin saudável",
  "description.apple": "Perfeito para torta de maçã caseira",
  "description.banana": "Oh banana!",

  // Exotic Crops
  "description.white.carrot": "Uma cenoura pálida com raízes pálidas",
  "description.warty.goblin.pumpkin":
    "Uma abóbora coberta de verrugas e whimsical",
  "description.adirondack.potato": "Um tubérculo robusto, estilo Adirondack!",
  "description.purple.cauliflower": "Um repolho roxo real",
  "description.chiogga": "Uma beterraba arco-íris!",
  "description.golden.helios": "Grandeza beijada pelo sol!",
  "description.black.magic": "Uma flor escura e misteriosa!",

  //Flower Seed
  "description.sunpetal.seed": "Uma semente de Pétala de Sol",
  "description.bloom.seed": "Uma semente de Flor da Noite",
  "description.lily.seed": "Uma semente de Lírio",
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

const deliveryitem: Record<DeliveryItem, string> = {
  "deliveryitem.inventory": "Inventário:",
  "deliveryitem.itemsToDeliver": "Itens para entregar: ",
  "deliveryitem.deliverToWallet": "Entregar para sua carteira",
  "deliveryitem.viewOnOpenSea":
    "Uma vez entregue, você poderá visualizar seus itens na OpenSea.",
  "deliveryitem.deliver": "Entregar",
};

const defaultDialogue: Record<DefaultDialogue, string> = {
  "defaultDialogue.intro":
    "Olá, amigo! Estou aqui para ver se você tem o que preciso.",
  "defaultDialogue.positiveDelivery":
    "Oh, fantástico! Você trouxe exatamente o que eu preciso. Obrigado!",
  "defaultDialogue.negativeDelivery":
    "Oh não! Parece que você não tem o que eu preciso. Sem problemas, no entanto. Continue explorando, e encontraremos outra oportunidade.",
  "defaultDialogue.noOrder": "Não há pedido ativo para eu cumprir agora.",
};

const decorationDescriptions: Record<DecorationDescriptions, string> = {
  // Decorations
  "description.wicker.man":
    "Junte-se e faça uma corrente, a sombra do Homem de Vime se erguerá novamente",
  "description.golden bonsai": "Goblins também amam bonsai",
  "description.christmas.bear": "O favorito do Papai Noel",
  "description.war.skull": "Decore a terra com os ossos de seus inimigos.",
  "description.war.tombstone": "R.I.P",
  "description.white.tulips": "Mantenha o cheiro dos goblins afastado.",
  "description.potted.sunflower": "Ilumine sua terra.",
  "description.potted.potato": "O sangue da batata corre pelo seu Bumpkin.",
  "description.potted.pumpkin": "Abóboras para Bumpkins",
  "description.cactus": "Economiza água e deixa sua fazenda deslumbrante!",
  "description.basic.bear": "Um urso básico.",
  "description.bonnies.tombstone":
    "Uma adição assustadora a qualquer fazenda, a Lápide Humana de Bonnie enviará calafrios pela sua espinha.",
  "description.grubnashs.tombstone":
    "Adicione um charme travesso com a Lápide dos Goblins de Grubnash.",
  "description.town.sign": "Mostre sua identificação da fazenda com orgulho!",
  "description.dirt.path":
    "Mantenha suas botas de fazendeiro limpas com um caminho bem pisado.",
  "description.bush": "O que está espreitando nas moitas?",
  "description.fence": "Adicione um toque de charme rústico à sua fazenda.",
  "description.stone.fence":
    "Abrace a elegância atemporal de uma cerca de pedra.",
  "description.pine.tree": "De pé alto e poderoso.",
  "description.shrub": "Melhore seu paisagismo no jogo com um arbusto bonito",
  "description.field.maple":
    "Um charme pequeno que espalha suas folhas como um dossel verde delicado.",
  "description.red.maple":
    "Folhagem ardente e um coração cheio de calor outonal.",
  "description.golden.maple":
    "Irradiando brilho com suas folhas douradas cintilantes.",
  "description.crimson.cap":
    "Um cogumelo vibrante e imponente, o Cogumelo Gigante Crimson Cap trará vida para sua fazenda.",
  "description.toadstool.seat": "Sente-se e relaxe no assento de cogumelo.",
  "description.chestnut.fungi.stool":
    "O Banquinho de Fungos Castanhos é uma adição robusta e rústica a qualquer fazenda.",
  "description.mahogany.cap": "Adicione um toque de sofisticação.",
  "description.candles":
    "Encante sua fazenda com chamas espectrais cintilantes durante a Véspera das Bruxas.",
  "description.haunted.stump":
    "Chame espíritos e adicione charme sinistro à sua fazenda.",
  "description.spooky.tree":
    "Uma adição assustadoramente divertida à decoração da sua fazenda!",
  "description.observer":
    "Um globo ocular em movimento perpétuo, sempre vigilante e sempre atento!",
  "description.crow.rock": "Um corvo empoleirado em uma rocha misteriosa.",
  "description.mini.corn.maze":
    "Uma lembrança do adorado labirinto da temporada Witches' Eve de 2023.",
  "description.lifeguard.ring":
    "Mantenha-se à tona com estilo, seu salvador à beira-mar!",
  "description.surfboard":
    "Surfe nas ondas da maravilha, bliss de praia a bordo!",
  "description.hideaway.herman":
    "Herman está aqui para se esconder, mas sempre dá uma espiada em uma festa!",
  "description.shifty.sheldon":
    "Sheldon é astuto, sempre se movendo para a próxima surpresa arenosa!",
  "description.tiki.torch":
    "Ilumine a noite, vibrações tropicais brilhando intensamente!",
  "description.beach.umbrella":
    "Sombra, abrigo e elegância à beira-mar em um único conjunto ensolarado!",
  "description.magic.bean": "O que vai crescer?",
  "description.giant.potato": "Uma batata gigante.",
  "description.giant.pumpkin": "Uma abóbora gigante.",
  "description.giant.cabbage": "Um repolho gigante.",
  "description.chef.bear": "Todo chef precisa de uma mãozinha",
  "description.construction.bear": "Sempre construa em um mercado em baixa",
  "description.angel.bear": "Hora de transcender a agricultura camponesa",
  "description.badass.bear": "Nada fica no seu caminho.",
  "description.bear.trap": "É uma armadilha!",
  "description.brilliant.bear": "Pura genialidade!",
  "description.classy.bear": "Mais SFL do que você sabe o que fazer com isso!",
  "description.farmer.bear": "Nada como um dia de trabalho árduo!",
  "description.rich.bear": "Uma posse valorizada",
  "description.sunflower.bear": "Uma colheita apreciada pelo urso",
  "description.beta.bear":
    "Um urso encontrado através de eventos de teste especiais",
  "description.rainbow.artist.bear": "O proprietário é um belo artista urso!",
  "description.devil.bear":
    "Melhor o Diabo que você conhece do que o Diabo que você não conhece",
  "description.collectible.bear":
    "Um urso valioso, ainda em condição de menta!",
  "description.cyborg.bear": "Hasta la vista, urso",
  "description.christmas.snow.globe": "Gire a neve e veja-a ganhar vida",
  "description.kraken.tentacle":
    "Mergulhe no mistério do mar profundo! Este tentáculo provoca contos de lendas oceânicas antigas e maravilhas aquáticas.",
  "description.kraken.head":
    "Mergulhe no mistério do mar profundo! Esta cabeça provoca contos de lendas oceânicas antigas e maravilhas aquáticas.",
  "description.abandoned.bear": "Um urso que foi deixado para trás na ilha.",
  "description.turtle.bear":
    "Suficientemente tartarugoso para o clube da tartaruga.",
  "description.trex.skull": "Um crânio de um T-Rex! Incrível!",
  "description.sunflower.coin": "Uma moeda feita de girassóis.",
  "description.skeleton.king.staff": "Toda a glória ao Rei Esquelético!",
  "description.lifeguard.bear":
    "O Urso Salva-vidas está aqui para salvar o dia!",
  "description.snorkel.bear": "O Urso Snorkel adora nadar.",
  "description.parasaur.skull": "Um crânio de um parasaur!",
  "description.goblin.bear": "Um urso goblin. É um pouco assustador.",
  "description.golden.bear.head": "Assustador, mas legal.",
  "description.pirate.bear": "Argh, pirata! Abraço!",
  "description.galleon": "Um navio de brinquedo, ainda em muito bom estado.",
  "description.dinosaur.bone":
    "Um Osso de Dinossauro! Que tipo de criatura era esta?",
  "description.human.bear":
    "Um urso humano. Ainda mais assustador do que um urso goblin.",
  "description.flamingo":
    "Representa um símbolo da beleza do amor, alto e confiante.",
  "description.blossom.tree":
    "Suas delicadas pétalas simbolizam a beleza e fragilidade do amor.",
  "description.heart.balloons":
    "Use-os como decoração para ocasiões românticas.",
  "description.whale.bear":
    "Tem um corpo redondo e peludo como um urso, mas com as barbatanas, cauda e sopro de uma baleia.",
  "description.valentine.bear": "Para aqueles que amam.",
  "description.easter.bear": "Como um coelho pode botar ovos?",
  "description.easter.bush": "O que tem dentro?",
  "description.giant.carrot":
    "Uma cenoura gigante ficou, lançando sombras divertidas, enquanto coelhos observavam maravilhados.",
  "description.beach.ball":
    "A bola saltitante traz vibrações de praia, afasta o tédio.",
  "description.palm.tree":
    "Alto, de praia, sombreado e chique, as palmeiras fazem as ondas gingarem.",

  //other
  "description.sunflower.amulet": "Aumenta o rendimento do Girassol em 10%.",
  "description.carrot.amulet": "As cenouras crescem 20% mais rápido.",
  "description.beetroot.amulet": "Aumento de 20% na produção de Beterraba.",
  "description.green.amulet": "Chance de colheita 10 vezes maior.",
  "description.warrior.shirt": "Marca de um verdadeiro guerreiro.",
  "description.warrior.pants": "Proteja suas coxas.",
  "description.warrior.helmet": "Imune a flechas.",
  "description.sunflower.shield":
    "Um herói da Terra do Girassol. Sementes de girassol grátis!",
  "description.skull.hat": "Um chapéu raro para o seu Bumpkin.",
  "description.sunflower.statue": "Um símbolo do token sagrado",
  "description.potato.statue": "O negociante de batatas OG flex",
  "description.christmas.tree":
    "Receba um Airdrop do Papai Noel no dia de Natal",
  "description.gnome": "Um gnomo da sorte",
  "description.homeless.tent": "Uma barraca agradável e aconchegante",
  "description.sunflower.tombstone": "Em memória dos Agricultores de Girassol",
  "description.sunflower.rock": "O jogo que quebrou a Polygon",
  "description.goblin.crown": "Chame o líder dos Goblins",
  "description.fountain": "Uma fonte relaxante para sua fazenda",
  "description.nyon.statue": "Em memória de Nyon Lann",
  "description.farmer.bath":
    "Um banho perfumado de beterraba para os agricultores",
  "description.woody.Beaver": "Aumenta a coleta de madeira em 20%",
  "description.apprentice.beaver": "Árvores se recuperam 50% mais rápido",
  "description.foreman.beaver": "Corte árvores sem machados",
  "description.egg.basket": "Dá acesso à Caça aos Ovos de Páscoa",
  "description.mysterious.head":
    "Uma estátua que se pensa proteger os agricultores",
  "description.tunnel.mole":
    "Dá um aumento de 25% ao coletar nas minas de pedra",
  "description.rocky.the.mole":
    "Dá um aumento de 25% ao coletar nas minas de ferro",
  "description.nugget": "Dá um aumento de 25% ao coletar nas minas de ouro",
  "description.rock.golem": "Dá uma chance de 10% de obter 3x pedra",
  "description.chef.apron": "Dá 20% a mais na venda de bolos SFL",
  "description.chef.hat": "A coroa de um padeiro lendário!",
  "description.nancy":
    "Mantém alguns corvos afastados. As colheitas crescem 15% mais rápido",
  "description.scarecrow": "Um espantalho goblin. Rende 20% mais colheitas",
  "description.kuebiko":
    "Até o dono da loja tem medo desse espantalho. As sementes são gratuitas",
  "description.golden.cauliflower": "Dobra o rendimento do couve-flor",
  "description.mysterious.parsnip": "Os nabos crescem 50% mais rápido",
  "description.carrot.sword":
    "Aumenta a chance de aparecer uma colheita mutante",
  "description.chicken.coop": "Coleta o dobro da quantidade de ovos",
  "description.farm.cat": "Mantenha os ratos afastados",
  "description.farm.dog": "Conduza ovelhas com seu cão de fazenda",
  "description.gold.egg": "Alimente as galinhas sem precisar de trigo",
  "description.easter.bunny": "Ganhe 20% mais cenouras",
  "description.rooster": "Dobra a chance de soltar uma galinha mutante",
  "description.chicken": "Produz ovos. Requer trigo para alimentação",
  "description.cow": "Produz leite. Requer trigo para alimentação",
  "description.pig": "Produz esterco. Requer trigo para alimentação",
  "description.sheep": "Produz lã. Requer trigo para alimentação",
  "description.basic.land": "Um pedaço básico de terra",
  "description.crop.plot": "Um espaço vazio para plantar",
  "description.gold.rock": "Uma rocha minerável para coletar ouro",
  "description.iron.rock": "Uma rocha minerável para coletar ferro",
  "description.stone.rock": "Uma rocha minerável para coletar pedra",
  "description.crimstone.rock": "Uma rocha minerável para coletar Crimstone",
  "description.oil.reserve": "Uma reserva para coletar petróleo",
  "description.flower.bed": "Um terreno vazio para plantar flores",
  "description.tree": "Uma árvore cortável para coletar madeira",
  "description.fruit.patch": "Um terreno vazio para plantar frutas",
  "description.boulder": "Uma rocha mítica que pode liberar minerais raros",
  "description.catch.the.kraken.banner":
    "O Kraken está aqui! O símbolo de um participante na Temporada de Pegar o Kraken.",
  "description.luminous.lantern":
    "Uma lanterna de papel brilhante que ilumina o caminho.",
  "description.radiance.lantern":
    "Uma lanterna de papel radiante que brilha com uma luz poderosa.",
  "description.ocean.lantern":
    "Uma lanterna de papel ondulante que balança com o movimento da maré.",
  "description.solar.lantern":
    "Aproveitando a essência vibrante dos girassóis, a Lanterna Solar emana um brilho quente e radiante.",
  "description.aurora.lantern":
    "Uma lanterna de papel que transforma qualquer espaço em um mundo mágico.",
  "description.dawn.umbrella":
    "Mantenha essas Berinjelas secas durante os dias chuvosos com o Guarda-chuva Assento da Aurora.",
  "description.eggplant.grill":
    "Comece a cozinhar com a Churrasqueira de Berinjela, perfeita para qualquer refeição ao ar livre.",
  "description.giant.dawn.mushroom":
    "O Cogumelo Gigante da Aurora é uma adição majestosa e mágica para qualquer fazenda.",
  "description.shroom.glow":
    "Ilumine sua fazenda com o brilho encantador do Brilho dos Cogumelos.",
  "description.clementine":
    "O Gnomo Clementine é um companheiro alegre para suas aventuras na fazenda.",
  "description.blossombeard":
    "O Gnomo Blossombeard é um companheiro poderoso para suas aventuras na fazenda.",
  "description.desertgnome": ENGLISH_TERMS["description.desertgnome"],
  "description.cobalt":
    "O Gnomo Cobalt adiciona um toque de cor à sua fazenda com seu chapéu vibrante.",
  "description.hoot": "Hoot hoot! Você já resolveu meu enigma?",
  "description.genie.bear": "Exatamente o que eu desejei!",
  "description.betty.lantern":
    "Parece tão real! Eu me pergunto como eles fizeram isso.",
  "description.bumpkin.lantern":
    "Aproximando-se, você ouve murmúrios de um Bumpkin vivo... assustador!",
  "description.eggplant.bear": "O símbolo de uma baleia berinjela generosa.",
  "description.goblin.lantern": "Uma lanterna com uma aparência assustadora",
  "description.dawn.flower":
    "Abraçe a beleza radiante da Flor da Aurora enquanto suas pétalas delicadas brilham com a primeira luz do dia",
  "description.kernaldo.bonus": "+25% de Velocidade de Crescimento de Milho",
  "description.white.crow": "Um corvo branco misterioso e etéreo",
  "description.sapo.docuras": "Um verdadeiro agrado!",
  "description.sapo.travessuras": "Oh oh... alguém foi travesso",
  "description.walrus":
    "Com suas presas confiáveis e amor pelo fundo do mar, ele garantirá que você pesque um peixe extra toda vez",
  "description.alba":
    "Com seus instintos afiados, ela garante que você receba um pouco de splash extra em sua pesca. 50% de chance de +1 Peixe Básico!",
  "description.knowledge.crab":
    "O Caranguejo do Conhecimento duplica o efeito da sua Mistura de Broto, tornando seus tesouros de solo tão ricos quanto pilhagem do mar!",
  "description.anchor":
    "Ancore com esta joia náutica, tornando cada local próprio para navegação e estilisticamente espirituoso!",
  "description.rubber.ducky":
    "Flutue na diversão com este patinho clássico, trazendo alegria borbulhante para todos os cantos!",
  "description.arcade.token":
    "Um token ganho de minijogos e aventuras. Pode ser trocado por recompensas.",
  "description.bumpkin.nutcracker": "Uma decoração festiva de 2023.",
  "description.festive.tree":
    "Uma árvore festiva disponível em cada temporada de festas. Eu me pergunto se é grande o suficiente para o Papai Noel ver?",
  "description.white.festive.fox":
    "A bênção da Raposa Branca habita as fazendas generosas",
  "description.grinxs.hammer":
    "O martelo mágico de Grinx, o lendário Ferreiro Goblin.",
  "description.angelfish":
    "A beleza celestial aquática, adornada com uma paleta de cores vibrantes.",
  "description.halibut":
    "O habitante plano do fundo do oceano, um mestre do disfarce em camuflagem arenosa.",
  "description.parrotFish":
    "Um caleidoscópio de cores sob as ondas, este peixe é a obra de arte viva da natureza.",
  "description.Farmhand": "Um ajudante de fazenda útil",
  "description.Beehive":
    "Uma colmeia agitada, produzindo mel a partir de flores em crescimento ativo; 10% de chance ao colher Mel de invocar um enxame de abelhas que polinizará todas as plantações em crescimento com um impulso de +0.2!",
  // Flores
  "description.red.pansy": "Uma pansy vermelha.",
  "description.yellow.pansy": "Uma pansy amarela.",
  "description.purple.pansy": "Uma pansy roxa.",
  "description.white.pansy": "Uma pansy branca.",
  "description.blue.pansy": "Uma pansy azul.",

  "description.red.cosmos": "Um cosmos vermelho.",
  "description.yellow.cosmos": "Um cosmos amarelo.",
  "description.purple.cosmos": "Um cosmos roxo.",
  "description.white.cosmos": "Um cosmos branco.",
  "description.blue.cosmos": "Um cosmos azul.",

  "description.red.balloon.flower": "Uma flor de balão vermelho.",
  "description.yellow.balloon.flower": "Uma flor de balão amarelo.",
  "description.purple.balloon.flower": "Uma flor de balão roxo.",
  "description.white.balloon.flower": "Uma flor de balão branca.",
  "description.blue.balloon.flower": "Uma flor de balão azul.",

  "description.red.carnation": "Um cravo vermelho.",
  "description.yellow.carnation": "Um cravo amarelo.",
  "description.purple.carnation": "Um cravo roxo.",
  "description.white.carnation": "Um cravo branco.",
  "description.blue.carnation": "Um cravo azul.",

  "description.humming.bird":
    "Um joia minúscula do céu, o Beija-flor flutua com graça colorida.",
  "description.queen.bee":
    "Régia majestosa da colmeia, a Abelha Rainha zumbindo com autoridade régia.",
  "description.flower.fox":
    "A Raposa Flor, uma criatura lúdica adornada com pétalas, traz alegria ao jardim.",
  "description.hungry.caterpillar":
    "Devorando folhas, a Lagarta Faminta está sempre pronta para uma aventura saborosa.",
  "description.sunrise.bloom.rug":
    "Pise no Tapete de Flores do Amanhecer, onde pétalas dançam ao redor de um nascer do sol floral.",
  "description.blossom.royale":
    "O Royale da Flor, uma flor gigante em azul e rosa vibrantes, está em majestosa floração.",
  "description.rainbow":
    "Um Arco-íris alegre, unindo o céu e a terra com seu arco colorido.",
  "description.enchanted.rose":
    "A Rosa Encantada, um símbolo de beleza eterna, cativa com seu fascínio mágico.",
  "description.flower.cart":
    "O Carrinho de Flores, transbordante de flores, é um jardim móvel de delícias florais.",
  "description.capybara":
    "A Capivara, uma amiga tranquila, desfruta de dias preguiçosos à beira da água.",
  "description.prism.petal":
    "Uau! Que flor bonita! Acho que esta vale a pena colocar em sua fazenda.",
  "description.celestial.frostbloom":
    "Uau! Que flor bonita! Acho que esta vale a pena colocar em sua fazenda.",
  "description.primula.enigma":
    "Uau! Que flor bonita! Acho que esta vale a pena colocar em sua fazenda.",

  "description.red.daffodil": "Um narciso vermelho.",
  "description.yellow.daffodil": "Um narciso amarelo.",
  "description.purple.daffodil": "Um narciso roxo.",
  "description.white.daffodil": "Um narciso branco.",
  "description.blue.daffodil": "Um narciso azul.",

  "description.red.lotus": "Um lótus vermelho.",
  "description.yellow.lotus": "Um lótus amarelo.",
  "description.purple.lotus": "Um lótus roxo.",
  "description.white.lotus": "Um lótus branco.",
  "description.blue.lotus": "Um lótus azul.",

  // Banners
  "description.goblin.war.banner":
    "Uma exibição de lealdade à causa dos Goblins",
  "description.human.war.banner": "Uma exibição de lealdade à causa humana",
  "description.earnAllianceBanner": "Um banner de evento especial",
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

const delivery: Record<Delivery, string> = {
  "delivery.resource": "Quer que eu entregue recursos?",
  "delivery.feed": "Não é de graça, tenho uma tribo para alimentar!",
  "delivery.fee": ENGLISH_TERMS["delivery.fee"],
  "delivery.goblin.comm.treasury": "Tesouro da Comunidade Goblin",
};

const deliveryHelp: Record<DeliveryHelp, string> = {
  "deliveryHelp.pumpkinSoup":
    "Reúna ingredientes e faça um passeio de barco até a Pumpkin Plaza para entregar pedidos aos Bumpkins em troca de uma recompensa!",
  "deliveryHelp.hammer":
    "Expanda sua terra para desbloquear mais espaços + pedidos de entrega mais rápidos",
  "deliveryHelp.axe":
    "Complete suas tarefas e encontre o Hank na Praça para reivindicar suas recompensas.",
  "deliveryHelp.chest":
    "Construa relacionamentos com os Bumpkins completando vários pedidos para desbloquear recompensas extras.",
};

const depositWallet: Record<DepositWallet, string> = {
  "deposit.errorLoadingBalances": "Houve um erro ao carregar seus saldos.",
  "deposit.yourPersonalWallet": "Sua Carteira Pessoal",
  "deposit.farmWillReceive": "Sua fazenda receberá",
  "deposit.depositDidNotArrive": "Depósito não chegou?",
  "deposit.goblinTaxInfo":
    "Quando os jogadores retiram qualquer SFL, um Imposto Goblin é aplicado.",
  "deposit.sendToFarm": "Enviar para a fazenda",
  "deposit.toDepositLevelUp":
    "Para depositar itens, você deve primeiro subir de nível",
  "deposit.level": "Nível 3",
  "deposit.noSflOrCollectibles": "Nenhum SFL ou Colecionáveis encontrados!",
  "deposit.farmAddress": "Endereço da fazenda",
  "question.depositSFLItems":
    "Você gostaria de depositar colecionáveis Sunflower Land, roupas ou SFL?",
};

const detail: Record<Detail, string> = {
  "detail.how.item": "Como obter este item?",
  "detail.Claim.Reward": "Reivindicar recompensa",
  "detail.basket.empty": "Sua cesta está vazia!",
  "detail.view.item": "Ver item em",
};

const discordBonus: Record<DiscordBonus, string> = {
  "discord.bonus.niceHat": "Uau, que chapéu legal!",
  "discord.bonus.attentionEvents":
    "Não se esqueça de prestar atenção a eventos especiais e sorteios no Discord para não perder.",
  "discord.bonus.bonusReward": "Recompensa Bônus",
  "discord.bonus.payAttention":
    "Preste atenção a eventos especiais e sorteios no Discord para não perder.",
  "discord.bonus.enjoyCommunity":
    "Esperamos que você esteja gostando de fazer parte de nossa comunidade!",
  "discord.bonus.communityInfo":
    "Você sabia que existem mais de 100.000 jogadores em nossa vibrante comunidade do Discord?",
  "discord.bonus.farmingTips":
    "Se você está procurando dicas e truques de agricultura, é o lugar certo.",
  "discord.bonus.freeGift":
    "A melhor parte... todos que participam recebem um presente grátis!",
  "discord.bonus.connect": "Conectar ao Discord",
  "fontReward.bonus.claim": ENGLISH_TERMS["fontReward.bonus.claim"],
  "fontReward.bonus.intro1": ENGLISH_TERMS["fontReward.bonus.intro1"],
  "fontReward.bonus.intro2": ENGLISH_TERMS["fontReward.bonus.intro2"],
  "fontReward.bonus.intro3": ENGLISH_TERMS["fontReward.bonus.intro3"],
};

const donation: Record<Donation, string> = {
  "donation.one":
    "Esta foi uma iniciativa de arte da comunidade e as doações são muito apreciadas!",
  "donation.rioGrandeDoSul.one":
    "Olá gente! O Sul do Brasil foi fortemente afetado pelas enchentes e nós estamos coletando doações para a compra de água e comida para os abrigos.",
  "donation.rioGrandeDoSul.two":
    "Todos que doarem receberão um item de decorão especial.",
  "donation.matic": "Doação em MATIC",
  "donation.minimum": "Mínimo 1 MATIC",
  "donation.airdrop":
    "As decorações serão enviadas via airdrop quando as doações forem encerradas.",
  "donation.specialEvent": "Evento especial de doação",
};

const draftBid: Record<DraftBid, string> = {
  "draftBid.howAuctionWorks": "Como funciona o leilão?",
  "draftBid.unsuccessfulParticipants":
    "Os participantes que não forem bem-sucedidos receberão um reembolso de seus recursos.",
  "draftBid.termsAndConditions": "Termos e condições",
};

const errorAndAccess: Record<ErrorAndAccess, string> = {
  "errorAndAccess.blocked.betaTestersOnly":
    "Acesso limitado apenas a testadores beta",
  "errorAndAccess.denied.message": "Você não tem acesso ao jogo ainda.",
  "errorAndAccess.instructions.part1": "Certifique-se de ter se juntado ao ",
  "errorAndAccess.sflDiscord": "Discord do Sunflower Land",
  "errorAndAccess.instructions.part2":
    ", vá para o canal #verify e obtenha a função 'farmer'.",
  "error.cannotPlaceInside": "Não é possível colocar dentro",
};

const errorTerms: Record<ErrorTerms, string> = {
  "error.betaTestersOnly": "Apenas testadores beta!",
  "error.congestion.one":
    "Estamos fazendo o nosso melhor, mas parece que a Polygon está recebendo muito tráfego ou você perdeu sua conexão.",
  "error.congestion.two":
    "Tente novamente mais tarde ou verifique sua conexão com a internet.",
  "error.connection.one":
    "Parece que não conseguimos concluir esta solicitação.",
  "error.connection.two": "Pode ser um problema de conexão simples.",
  "error.connection.three":
    "Você pode clicar em atualizar para tentar novamente.",
  "error.connection.four":
    "Se o problema persistir, você pode procurar ajuda entrando em contato com nossa equipe de suporte ou indo para o nosso Discord e perguntando à nossa comunidade.",
  "error.diagnostic.info": "Informações de Diagnóstico",
  "error.forbidden.goblinVillage":
    "Você não tem permissão para visitar a Vila dos Goblins!",
  "error.multipleDevices.one": "Múltiplos dispositivos abertos",
  "error.multipleDevices.two":
    "Por favor, feche outras guias do navegador ou dispositivos que você estiver usando.",
  "error.multipleWallets.one": "Múltiplas Carteiras",
  "error.multipleWallets.two":
    "Parece que você tem várias carteiras instaladas. Isso pode causar comportamentos inesperados. Tente desativar todas as carteiras, exceto uma.",
  "error.polygonRPC":
    "Por favor, tente novamente ou verifique suas configurações RPC da Polygon.",
  "error.toManyRequest.one": "Muitas solicitações!",
  "error.toManyRequest.two":
    "Parece que você tem estado ocupado! Por favor, tente novamente mais tarde.",
  "error.Web3NotFound": " Carteira Web3 Não Encontrada",
  "error.wentWrong": "Algo deu errado!",
  "error.clock.not.synced": "Relógio do dispositivo não sincronizado",
  "error.polygon.cant.connect": "Não é possível conectar-se à Polygon",
  "error.composterNotExist": "Composteira não existe",
  "error.composterNotProducing": "Composteira não está produzindo",
  "error.composterAlreadyDone": "Composto já foi concluído",
  "error.composterAlreadyBoosted": "Já impulsionado",
  "error.missingEggs": "Ovos em falta",
  "error.insufficientSFL": "SFL insuficiente",
  "error.dailyAttemptsExhausted": "Tentativas diárias esgotadas",
  "error.missingRod": "Vara ausente",
  "error.missingBait": "Isca ausente",
  "error.alreadyCasted": "Já lançado",
  "error.unsupportedChum": ENGLISH_TERMS["error.unsupportedChum"],
  "error.insufficientChum": "Isca insuficiente:",
  "error.alr.composter": "Composteira já está compostando",
  "error.no.alr.composter": "Composteira não está pronta para produzir",
  "error.missing": "Requisitos em falta",
  "error.no.ready": "O composto não está pronto",
  "error.noprod.composter": "O Composter não está produzindo nada",
  "error.buildingNotExist": "A construção não existe",
  "error.buildingNotCooking": "A construção não está cozinhando nada",
  "error.recipeNotReady": "A receita não está pronta",
  "error.npcsNotExist": "NPCs não existem",
  "error.noDiscoveryAvailable": "Nenhuma descoberta disponível",
  "error.obsessionAlreadyCompleted": "Essa obsessão já foi concluída",
  "error.collectibleNotInInventory": "Você não tem o colecionável necessário",
  "error.wearableNotInWardrobe": "Você não tem o item de vestuário necessário",
  "error.requiredBuildingNotExist": "A construção necessária não existe",
  "error.cookingInProgress": "Cozinhando já em andamento",
  "error.insufficientIngredient": "Ingrediente insuficiente: ",
  "error.ClientRPC": "Erro de RPC",
  "error.walletInUse.one": ENGLISH_TERMS["error.walletInUse.one"],
  "error.walletInUse.two": ENGLISH_TERMS["error.walletInUse.two"],
  "error.walletInUse.three": ENGLISH_TERMS["error.walletInUse.three"],
  "error.notEnoughOil": ENGLISH_TERMS["error.notEnoughOil"],
  "error.oilCapacityExceeded": ENGLISH_TERMS["error.oilCapacityExceeded"],
};

const exoticShopItems: Record<ExoticShopItems, string> = {
  "exoticShopItems.line1":
    "Nossa loja de feijão está fechando enquanto nossos feijões embarcam em uma nova jornada com um cientista louco.",
  "exoticShopItems.line2":
    "Obrigado por fazer parte de nossa comunidade amante de legumes.",
  "exoticShopItems.line3": "Melhores cumprimentos,",
  "exoticShopItems.line4": "A Equipe do Feijão",
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
  "festivetree.greedyBumpkin": "Bumpkin Ganancioso Detectado",
  "festivetree.alreadyGifted":
    "Esta árvore já foi presenteada. Espere até o próximo Natal para mais festividades.",
  "festivetree.notFestiveSeason":
    "Não é a temporada festiva. Volte mais tarde.",
};

const fishDescriptions: Record<FishDescriptions, string> = {
  // Peixes
  "description.anchovy.one":
    "O acrobata saltitante do oceano, sempre com pressa!",
  "description.anchovy.two": "Peixe pequeno, grande sabor!",
  "description.butterflyfish.one":
    "Um peixe com um senso de moda avançado, exibindo suas listras vívidas e estilosas.",
  "description.butterflyfish.two": "Nadando em cores e sabor!",
  "description.blowfish.one":
    "O comediante redondo e inflado do mar, garantido para trazer um sorriso.",
  "description.blowfish.two": "Jante com perigo, uma surpresa espinhosa!",
  "description.clownfish.one":
    "O bobo da corte subaquático, vestindo um terno tangerina e um charme de palhaço.",
  "description.clownfish.two": "Sem piadas, apenas pura delícia!",
  "description.seabass.one":
    "Seu amigo 'não-tão-exciting' com escamas prateadas - uma captura básica!",
  "description.seabass.two": "Os princípios básicos da culinária à beira-mar!",
  "description.seahorse.one":
    "O dançarino em câmera lenta do oceano, balançando gracioso no balé aquático.",
  "description.seahorse.two": "Delicado, raro e surpreendentemente saboroso!",
  "description.horsemackerel.one":
    "Um velocista com um casaco brilhante, sempre correndo pelas ondas.",
  "description.horsemackerel.two": "Galope através dos sabores a cada mordida!",
  "description.squid.one":
    "O enigma das profundezas com tentáculos para despertar sua curiosidade.",
  "description.squid.two": "Tinture seu caminho para gostos requintados!",
  "description.redsnapper.one":
    "Uma captura que vale seu peso em ouro, vestida de carmesim ardente.",
  "description.redsnapper.two": "Morda em oceanos ricos!",
  "description.morayeel.one":
    "Um espreitador sinistro e sinuoso nos cantos sombrios do oceano.",
  "description.morayeel.two": "Escorregadio, saboroso e sensacional!",
  "description.oliveflounder.one":
    "O mestre do disfarce do leito marinho, sempre se misturando com a multidão.",
  "description.oliveflounder.two": "Floundering em riqueza e sabor!",
  "description.napoleanfish.one":
    "Conheça o peixe com o complexo de Napoleão - curto, mas real!",
  "description.napoleanfish.two": "Conquiste sua fome com esta captura!",
  "description.surgeonfish.one":
    "O guerreiro neon do oceano, armado com uma atitude afiada de espinha.",
  "description.surgeonfish.two": "Opere em seus gostos com precisão!",
  "description.zebraturkeyfish.one":
    "Listras, espinhos e uma disposição, este peixe é um verdadeiro espetáculo!",
  "description.zebraturkeyfish.two":
    "Listrado, espinhoso e espetacularmente delicioso!",
  "description.ray.one":
    "O planejador subaquático, uma beleza alada serena através das ondas.",
  "description.ray.two": "Deslize em um reino de sabores ricos!",
  "description.hammerheadshark.one":
    "Conheça o tubarão com cabeça para negócios e corpo para aventura!",
  "description.hammerheadshark.two": "Um choque frontal com o sabor!",
  "description.tuna.one":
    "O velocista musculoso do oceano, pronto para uma corrida fantástica!",
  "description.tuna.two": "Um titã de sabor em cada fatia!",
  "description.mahimahi.one":
    "Um peixe que acredita em viver a vida coloridamente com barbatanas de ouro.",
  "description.mahimahi.two": "Dobre o nome, dobre a delícia!",
  "description.bluemarlin.one":
    "Uma lenda oceânica, o marlim com uma atitude tão profunda quanto o mar.",
  "description.bluemarlin.two": "Lance seu apetite com esta captura real!",
  "description.oarfish.one":
    "O longo e o longo disso - um errante enigmático do oceano.",
  "description.oarfish.two": "Navegue até o sabor lendário!",
  "description.footballfish.one":
    "O MVP do fundo do mar, uma estrela bioluminescente pronta para jogar!",
  "description.footballfish.two": "Marque um touchdown no sabor!",
  "description.sunfish.one":
    "O banhista do oceano, banhando-se no holofote com barbatanas erguidas.",
  "description.sunfish.two": "Banhe-se no brilho de seu sabor delicioso!",
  "description.coelacanth.one":
    "Um relicário pré-histórico, com um gosto pelo passado e pelo presente.",
  "description.coelacanth.two":
    "Sabor pré-histórico que resistiu ao teste do tempo!",
  "description.whaleshark.one":
    "O gigante gentil das profundezas, peneirando tesouros no buffet do oceano.",
  "description.whaleshark.two": "Uma refeição mamute para desejos monumentais!",
  "description.barredknifejaw.one":
    "Um fora da lei oceânico com listras em preto e branco e um coração de ouro.",
  "description.barredknifejaw.two": "Corte a fome com sabores afiados!",
  "description.sawshark.one":
    "Com um focinho em forma de serra, é o carpinteiro do oceano, sempre à frente!",
  "description.sawshark.two": "Sabor de ponta da profundeza!",
  "description.whiteshark.one":
    "O tubarão com um sorriso assassino, dominando os mares com intensidade de barbatana!",
  "description.whiteshark.two": "Mergulhe em um oceano de sabor emocionante!",

  // Maravilhas Marinhas
  "description.twilight.anglerfish":
    "Um pescador de águas profundas com uma luz noturna embutida, guiando seu caminho através da escuridão.",
  "description.starlight.tuna":
    "Um atum que supera as estrelas, pronto para iluminar sua coleção.",
  "description.radiant.ray":
    "Um raio que prefere brilhar no escuro, com um segredo cintilante para compartilhar.",
  "description.phantom.barracuda":
    "Um peixe fantasmagórico e elusivo das profundezas, escondido nas sombras.",
  "description.gilded.swordfish":
    "Um peixe-espada com escamas que brilham como ouro, a captura definitiva!",
  "description.crimson.carp":
    "Uma joia rara e vibrante das águas da primavera.",
  "description.battle.fish": ENGLISH_TERMS["description.battle.fish"],
};

const fishermanModal: Record<FishermanModal, string> = {
  "fishermanModal.attractFish": "Atraia peixes jogando isca na água.",
  "fishermanModal.fishBenefits":
    "Peixes são ótimos para comer, entregar e reivindicar recompensas!",
  "fishermanModal.baitAndResources":
    "Traga-me isca e recursos e vamos pescar os prêmios mais raros que o oceano tem a oferecer!",
  "fishermanModal.crazyHappening":
    "Uau, algo louco está acontecendo... É uma loucura de peixe!",
  "fishermanModal.fullMoon": ENGLISH_TERMS["fishermanModal.fullMoon"],
  "fishermanModal.bonusFish":
    "Rápido, você receberá um peixe bônus para cada captura!",
  "fishermanModal.dailyLimitReached":
    "Você atingiu seu limite diário de pesca de {{limit}}",
  "fishermanModal.needCraftRod": "Você deve primeiro criar uma vara.",
  "fishermanModal.craft.beach": "Artesanato na Praia",
  "fishermanModal.zero.available": "0 disponível",
  "fishermanmodal.greeting":
    "Ahoy, colegas! Eu sou {{name}}, seu confiável pescador da ilha, e tracei um grande desafio - coletar todos os peixes sob o sol!",
};

const fishermanQuest: Record<FishermanQuest, string> = {
  "fishermanQuest.Ohno": "Oh não! Ele escapou",
  "fishermanQuest.Newfish": "Novo peixe",
};

const fishingChallengeIntro: Record<FishingChallengeIntro, string> = {
  "fishingChallengeIntro.powerfulCatch":
    "Uma captura poderosa espera por você!",
  "fishingChallengeIntro.useStrength": "Use toda a sua força para puxá-lo.",
  "fishingChallengeIntro.stopGreenBar":
    "Pare a barra verde no peixe para ter sucesso.",
  "fishingChallengeIntro.beQuick":
    "Seja rápido - 3 tentativas perdidas, e ele escapa!",
};

const fishingGuide: Record<FishingGuide, string> = {
  "fishingGuide.catch.rod": "Craft uma vara e junte iscas para pegar peixes.",
  "fishingGuide.bait.earn":
    "Isca pode ser ganha através de compostagem ou fabricação de iscas.",
  "fishingGuide.eat.fish":
    "Coma peixe para aumentar o nível do seu Bumpkin ou faça entregas de peixe para recompensas.",
  "fishingGuide.discover.fish":
    "Explore as águas para descobrir peixes raros, completar missões e desbloquear recompensas únicas no Codex.",
  "fishingGuide.condition":
    "Acompanhe os padrões de marés em mudança; espécies específicas de peixes só estão disponíveis durante certas condições.",
  "fishingGuide.bait.chum":
    "Experimente diferentes tipos de iscas e combinações de iscas para maximizar suas chances de pegar várias espécies de peixes.",
  "fishingGuide.legendery.fish":
    "Cuidado com peixes lendários; eles requerem habilidade e força excepcionais para pegar.",
};

const fishingQuests: Record<FishingQuests, string> = {
  "quest.basic.fish": "Capture cada peixe básico",
  "quest.advanced.fish": "Capture cada peixe avançado",
  "quest.all.fish": "Descubra cada peixe básico, avançado e especialista",
  "quest.300.fish": "Capture 300 peixes",
  "quest.1500.fish": "Capture 1500 peixes",
  "quest.marine.marvel": "Capture cada Marine Marvel",
  "quest.5.fish": "Capture 5 de cada peixe",
  "quest.sunpetal.savant": "Descubra 12 variantes de Sunpetal",
  "quest.bloom.bigshot": "Descubra 12 variantes de Bloom",
  "quest.lily.luminary": "Descubra 12 variantes de Lily",
};

const flowerBed: Record<FlowerBed, string> = {
  "flowerBedGuide.buySeeds": "Compre sementes de Flor na Loja de Sementes.",
  "flowerBedGuide.crossbreedWithCrops":
    "Cruze com plantações e outras flores para descobrir novas espécies de flores.",
  "flowerBedGuide.collectAllSpecies":
    "Colete todas as espécies de flores no Codex!",
  "flowerBedGuide.beesProduceHoney":
    "As abelhas produzem mel enquanto as flores estão crescendo.",
  "flowerBedGuide.fillUpBeehive":
    "Encha completamente uma colmeia e colete o mel para ter chance de aparecer um enxame de abelhas.",
  "flowerBedGuide.beeSwarmsBoost":
    "Enxames de abelhas dão um impulso de +0.2 para qualquer plantação plantada.",
  "flowerBed.newSpecies.discovered":
    "Uau, você descobriu uma nova espécie de flor!",
  "flowerBedContent.select.combination": "Selecione sua combinação",
  "flowerBedContent.select.crossbreed": "Selecione um cruzamento",
  "flowerBedContent.select.seed": "Selecione uma semente",
};

const flowerbreed: Record<Flowerbreed, string> = {
  "flower.breed.sunflower": "Os botânicos Bumpkin juram que não são flores.",
  "flower.breed.cauliflower":
    "Não tenho certeza do que os botânicos Bumpkin dizem sobre este.",
  "flower.breed.beetroot": "Tem uma bela cor roxa.",
  "flower.breed.parsnip": "Um nabo pode ser uma boa escolha para cruzar.",
  "flower.breed.eggplant":
    "A berinjela tem uma cor vibrante, talvez cruze bem.",
  "flower.breed.radish": "Uau, este rabanete é vermelho!",
  "flower.breed.kale": "É verde, mas não como os outros verdes.",
  "flower.breed.blueberry":
    "Essas amoras estão muito maduras, espero que não manchem.",
  "flower.breed.apple": "Maçãs crocantes!",
  "flower.breed.banana": "Um cacho de bananas.",
  "flower.breed.redPansy": "Um Pansy vermelho.",
  "flower.breed.yellowPansy": "Um Pansy amarelo.",
  "flower.breed.purplePansy": "Um Pansy roxo.",
  "flower.breed.whitePansy":
    "Um Pansy branco. Desprovido de cor, eu me pergunto se isso é raro.",
  "flower.breed.bluePansy": "Um Pansy azul.",
  "flower.breed.redCosmos": "Um Cosmos vermelho.",
  "flower.breed.yellowCosmos": "Um Cosmos amarelo.",
  "flower.breed.purpleCosmos": "Um Cosmos roxo.",
  "flower.breed.whiteCosmos": "Um Cosmos branco.",
  "flower.breed.blueCosmos": "Um Cosmos azul. Muito descritivo.",
  "flower.breed.prismPetal":
    "Uma mutação extremamente rara, tem certeza de que quer cruzar isso?",
  "flower.breed.redBalloonFlower":
    "As flores balão são muito bonitas. As vermelhas especialmente.",
  "flower.breed.yellowBalloonFlower": "Uma flor de balão amarela.",
  "flower.breed.purpleBalloonFlower": "Uma flor de balão roxa.",
  "flower.breed.whiteBalloonFlower": "Uma flor de balão branca. Isso é raro.",
  "flower.breed.blueBalloonFlower":
    "A mais básica das flores balão. Nada para se gabar.",
  "flower.breed.redDaffodil": ENGLISH_TERMS["flower.breed.redDaffodil"],
  "flower.breed.yellowDaffodil": ENGLISH_TERMS["flower.breed.yellowDaffodil"],
  "flower.breed.purpleDaffodil": ENGLISH_TERMS["flower.breed.purpleDaffodil"],
  "flower.breed.whiteDaffodil": ENGLISH_TERMS["flower.breed.whiteDaffodil"],
  "flower.breed.blueDaffodil": ENGLISH_TERMS["flower.breed.blueDaffodil"],
  "flower.breed.celestialFrostbloom":
    "Uma mutação extremamente rara. Tem certeza de que quer cruzar isso?",
  "flower.breed.redCarnation":
    "Os Bumpkins valorizam a cravo vermelho por sua raridade.",
  "flower.breed.yellowCarnation":
    "Os Bumpkins não valorizam o cravo amarelo por nada.",
  "flower.breed.purpleCarnation":
    "Os Bumpkins valorizam o cravo roxo por sua beleza.",
  "flower.breed.whiteCarnation":
    "Os Bumpkins valorizam o cravo amarelo por sua simplicidade.",
  "flower.breed.blueCarnation":
    "Os Bumpkins valorizam o cravo azul por sua capacidade de cruzar com sementes Noturnas.",
  "flower.breed.redLotus": ENGLISH_TERMS["flower.breed.redLotus"],
  "flower.breed.yellowLotus": ENGLISH_TERMS["flower.breed.yellowLotus"],
  "flower.breed.purpleLotus": ENGLISH_TERMS["flower.breed.purpleLotus"],
  "flower.breed.whiteLotus": ENGLISH_TERMS["flower.breed.purpleLotus"],
  "flower.breed.blueLotus": ENGLISH_TERMS["flower.breed.blueLotus"],
  "flower.breed.primulaEnigma":
    "Uma mutação extremamente rara, tem certeza de que quer cruzar isso?",
};

const flowerShopTerms: Record<FlowerShopTerms, string> = {
  "flowerShop.desired.dreaming": ENGLISH_TERMS["flowerShop.desired.dreaming"],
  "flowerShop.desired.delightful":
    ENGLISH_TERMS["flowerShop.desired.delightful"],
  "flowerShop.desired.wonderful": ENGLISH_TERMS["flowerShop.desired.wonderful"],
  "flowerShop.desired.setMyHeart":
    ENGLISH_TERMS["flowerShop.desired.setMyHeart"],
  "flowerShop.missingPages.alas":
    "Mas aí eu perdi as páginas do meu livro de cruzamento! Elas devem estar na praça em algum lugar.",
  "flowerShop.missingPages.cantBelieve":
    "Mas eu não posso acreditar, as páginas com minhas melhores receitas de flores híbridas estão faltando. Elas devem estar na praça em algum lugar.",
  "flowerShop.missingPages.inABind":
    "No entanto, estou um pouco apertado - as páginas contendo minhas técnicas de cruzamento parecem ter desaparecido. Elas devem estar na praça em algum lugar.",
  "flowerShop.missingPages.sadly":
    "Infelizmente, minhas notas de cruzamento desapareceram! Tenho certeza de que estão por aqui. Elas devem estar na praça em algum lugar.",
  "flowerShop.noFlowers.noTrade":
    "Desculpe, não tenho flores para trocar no momento.",
  "flowerShop.do.have.trade": ENGLISH_TERMS["flowerShop.do.have.trade"],
  "flowerShop.do.have.trade.one": ENGLISH_TERMS["flowerShop.do.have.trade.one"],
};

const foodDescriptions: Record<FoodDescriptions, string> = {
  // Fire Pit
  "description.pumpkin.soup": "Uma sopa cremosa que os goblins adoram",
  "description.mashed.potato": "Minha vida é batata.",
  "description.bumpkin.broth": "Um caldo nutritivo para repor seu Bumpkin",
  "description.boiled.eggs": "Ovos cozidos são ótimos para o café da manhã",
  "description.kale.stew": "Um impulsionador perfeito para o Bumpkin!",
  "description.mushroom.soup": "Aqueça a alma do seu Bumpkin.",
  "description.reindeer.carrot": "Rudolph não consegue parar de comê-los!",
  "description.kale.omelette": "Um café da manhã saudável",
  "description.cabbers.mash": "Repolhos e purê de batata",
  "description.popcorn": "Lanche crocante caseiro clássico.",
  "description.gumbo":
    "Uma panela cheia de magia! Cada colherada é um desfile de Mardi Gras!",

  // Kitchen
  "description.roast.veggies": "Até os Goblins precisam comer seus vegetais!",
  "description.bumpkin.salad": "Você precisa manter seu Bumpkin saudável!",
  "description.goblins.treat": "Goblins ficam loucos por isso!",
  "description.cauliflower.burger": "Chamando todos os amantes de couve-flor!",
  "description.club.sandwich":
    "Recheado com cenouras e sementes de girassol torradas",
  "description.mushroom.jacket.potatoes":
    "Enfie essas batatas com o que você tem!",
  "description.sunflower.crunch": "Bondade crocante. Tente não queimá-la.",
  "description.bumpkin.roast": "Um prato Bumpkin tradicional",
  "description.goblin.brunch": "Um prato Goblin tradicional",
  "description.fruit.salad": "Salada de Frutas, Yummy Yummy",
  "description.bumpkin.ganoush": "Espalhe berinjela assada com zeste.",
  "description.chowder":
    "Delícia de marinheiro em uma tigela! Mergulhe, há tesouro dentro!",
  "description.pancakes": "Um ótimo começo para o dia de um Bumpkin",
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
  "description.apple.pie": "Receita famosa de Bumpkin Betty",
  "description.kale.mushroom.pie": "Uma receita tradicional de Sapphiron",
  "description.cornbread": "Pão de fazenda dourado e saudável.",
  "description.sunflower.cake": "Bolo de Girassol",
  "description.potato.cake": "Bolo de Batata",
  "description.pumpkin.cake": "Bolo de Abóbora",
  "description.carrot.cake": "Bolo de Cenoura",
  "description.cabbage.cake": "Bolo de Repolho",
  "description.beetroot.cake": "Bolo de Beterraba",
  "description.cauliflower.cake": "Bolo de Couve-Flor",
  "description.parsnip.cake": "Bolo de Nabo",
  "description.radish.cake": "Bolo de Rabanete",
  "description.wheat.cake": "Bolo de Trigo",
  "description.honey.cake": "Um bolo delicioso!",
  "description.eggplant.cake": "Surpresa de sobremesa fresca da fazenda.",
  "description.orange.cake":
    "Você está feliz por não estarmos cozinhando maçãs",
  "description.pirate.cake":
    "Ótimo para festas de aniversário com tema de pirata.",

  // Deli
  "description.blueberry.jam":
    "Os goblins farão qualquer coisa por esta geléia",
  "description.fermented.carrots": "Tem um excedente de cenouras?",
  "description.sauerkraut": "Não mais repolho chato!",
  "description.fancy.fries": "Batatas fritas fantásticas",
  "description.fermented.fish":
    "Delicadeza audaciosa! Liberte o Viking que há dentro com cada mordida!",

  // Smoothie Shack
  "description.apple.juice": "Uma bebida refrescante e crocante",
  "description.orange.juice": "Combina perfeitamente com um Club Sandwich",
  "description.purple.smoothie": "Você quase não consegue sentir o Repolho",
  "description.power.smoothie":
    "Bebida oficial da Sociedade de Levantamento de Peso do Bumpkin",
  "description.bumpkin.detox": "Lave os pecados da noite passada",
  "description.banana.blast":
    "O combustível frutado final para aqueles com uma casca para poder!",

  // Unused foods
  "description.roasted.cauliflower": "Favorito dos Goblins",
  "description.radish.pie": "Desprezado pelos humanos, amado pelos goblins",
};

const garbageCollector: Record<GarbageCollector, string> = {
  "garbageCollector.welcome": "Bem-vindo à minha humilde loja.",
  "garbageCollector.description":
    "Sou o Comerciante de Lixo e comprarei qualquer coisa que você tenha - contanto que seja lixo.",
};

const gameDescriptions: Record<GameDescriptions, string> = {
  // Quest Items
  "description.goblin.key": "A Chave do Goblin",
  "description.sunflower.key": "A Chave do Girassol",
  "description.ancient.goblin.sword": "Uma Antiga Espada de Goblin",
  "description.ancient.human.warhammer": "Um Antigo Martelo de Guerra Humano",

  // Coupons
  "description.community.coin":
    "Uma moeda valiosa que pode ser trocada por recompensas",
  "description.bud.seedling": "Uma muda a ser trocada por um Bud NFT gratuito",
  "description.gold.pass":
    "Um passe exclusivo que permite ao portador criar NFTs raros, negociar, sacar e acessar conteúdo bônus.",
  "description.rapid.growth":
    "Aplique em uma cultura para crescer duas vezes mais rápido",
  "description.bud.ticket":
    "Um lugar garantido para mintar um Bud no lançamento de NFTs do Sunflower Land Buds.",
  "description.potion.ticket":
    "Uma recompensa da Casa das Poções. Use isso para comprar itens de Garth.",
  "description.trading.ticket": "Negociações grátis! Uhu!",
  "description.block.buck": "Um token valioso em Sunflower Land!",
  "description.beta.pass": "Acesso antecipado a recursos para teste.",
  "description.war.bond": "Uma marca de um verdadeiro guerreiro",
  "description.allegiance": "Uma exibição de lealdade",
  "description.jack.o.lantern": "Um item especial de evento de Halloween",
  "description.golden.crop": "Uma safra dourada brilhante",
  "description.red.envelope": "Uau, você tem sorte!",
  "description.love.letter": "Expressar sentimentos de amor",
  "description.solar.flare.ticket":
    "Um ticket usado durante a Temporada de Solar Flare",
  "description.dawn.breaker.ticket":
    "Um ticket usado durante a Temporada Danw Breaker",
  "description.crow.feather": "Um ticket usado durante Whiches' Eve",
  "description.mermaid.scale":
    "Um ticket usado durante a Temporada de Catch the Kraken",
  "description.sunflower.supporter":
    "A marca de um verdadeiro apoiador do jogo!",
  "description.arcade.coin":
    "Um token ganho de minijogos e aventuras. Pode ser trocado por recompensas.",
  "description.farmhand.coupon":
    "Um cupom para trocar por um ajudante de fazenda de sua escolha.",
  "description.farmhand": "Um Bumpkin adotado em sua fazenda",
  "description.tulip.bulb": "Um ticket usado durante a ",
  "description.prizeTicket": "Um ticket para entrar nos sorteios de prêmios",
  "description.babyPanda": ENGLISH_TERMS["description.babyPanda"],
  "description.baozi": ENGLISH_TERMS["description.baozi"],
  "description.hungryHare": ENGLISH_TERMS["description.hungryHare"],
  "description.communityEgg": ENGLISH_TERMS["description.communityEgg"],
  "description.treasure.key": "Visite o Plaza para desbloquear sua recompensa",
  "description.rare.key": "Visite a praia para desbloquear sua recompensa",
  "description.luxury.key":
    "Visite o Plaza perto de Woodlands para desbloquear sua recompensa",
  "description.scroll": "Um ticket usado durante a temporada Clash of Factions",

  // Easter Items
  "description.egg.basket": "Evento de Páscoa",
  "description.blue.egg": "Um ovo de Páscoa azul",
  "description.orange.egg": "Um ovo de Páscoa laranja",
  "description.green.egg": "Um ovo de Páscoa verde",
  "description.yellow.egg": "Um ovo de Páscoa amarelo",
  "description.red.egg": "Um ovo de Páscoa vermelho",
  "description.pink.egg": "Um ovo de Páscoa rosa",
  "description.purple.egg": "Um ovo de Páscoa roxo",

  //Home
  "description.homeOwnerPainting": "Uma pintura do proprietário desta casa.",

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
  "auction.winner": "Vencedor do leilão!",
  "bumpkin.level": "Nível Bumpkin",
  bumpkinBuzz: "Zumbido Bumpkin",
  dailyLim: "Limite Diário SFL",
  "farm.banned": "Esta fazenda está banida",
  gobSwarm: "Enxame de Goblins!",
  "granting.wish": "Concedendo seu desejo",
  "new.delivery.in": "Novas entregas disponíveis em",
  "new.delivery.levelup": ENGLISH_TERMS["new.delivery.levelup"],
  "no.sfl": "Nenhum token SFL encontrado",
  opensea: "OpenSea",
  polygonscan: "PolygonScan",
  potions: "Poções",
  "proof.of.humanity": "Prova de Humanidade",
  sflDiscord: "Servidor Discord de Sunflower Land",
  "aoe.locked": "AOE Bloqueado",
  "compost.complete": "Compostagem completa",
  "in.progress": "Em progresso",
  sunflowerLandCodex: "Sunflower Land Codex",
  "visiting.farmId": ENGLISH_TERMS["visiting.farmId"],
  "harvest.number": ENGLISH_TERMS["harvest.number"],
  "level.number": ENGLISH_TERMS["level.number"],
  "stock.left": ENGLISH_TERMS["stock.left"],
  "stock.inStock": ENGLISH_TERMS["stock.inStock"],
};

const genieLamp: Record<GenieLamp, string> = {
  "genieLamp.ready.wish": "Pronto para fazer um pedido?",
  "genieLamp.cannotWithdraw":
    "Você não pode retirar a lâmpada depois de esfregá-la",
};

const getContent: Record<GetContent, string> = {
  "getContent.error": "Erro!",
  "getContent.joining": "Entrando",
  "getContent.accessGranted":
    "Agora você tem acesso. Vá conferir o canal no Discord",
  "getContent.connectToDiscord":
    "Você deve estar conectado ao Discord para entrar em um canal restrito.",
  "getContent.connect": "Conectar",
  "getContent.getAccess": "Obtenha acesso a grupos restritos no Discord",
  "getContent.requires": "Requer",
  "getContent.join": "Junte-se",
};

const getInputErrorMessage: Record<GetInputErrorMessage, string> = {
  "getInputErrorMessage.place.bid":
    "Tem certeza de que deseja fazer este lance?",
  "getInputErrorMessage.cannot.bid":
    "Os lances não podem ser alterados depois de serem feitos.",
};

const goblin_messages: Record<GOBLIN_MESSAGES, string> = {
  "goblinMessages.msg1": "Ei você! Humano! Me traga comida ou então...",
  "goblinMessages.msg2":
    "Eu sempre estou com fome, tem algum petisco gostoso para mim?",
  "goblinMessages.msg3": "Não me importo com o que é, apenas me dê comida!",
  "goblinMessages.msg4":
    "Se você não me der algo para comer, talvez eu tenha que começar a beliscar você.",
  "goblinMessages.msg5":
    "Ouvi dizer que a comida humana é a melhor, me traga um pouco!",
  "goblinMessages.msg6": "Ei, você tem alguma comida que não me fará mal?",
  "goblinMessages.msg7":
    "Estou ficando um pouco entediado de comer sempre a mesma coisa, tem algo diferente?",
  "goblinMessages.msg8": "Estou com fome de algo novo, tem algo exótico?",
  "goblinMessages.msg9":
    "Olá, tem algum lanche para me dar? Prometo que não vou roubar eles... talvez.",
  "goblinMessages.msg10": "Não me importo com o que é, apenas me dê comida!",
};

const goldTooth: Record<GoldTooth, string> = {
  "goldTooth.intro.part1":
    "Arrr, marujos! A área de escavação do tesouro está cheia de riquezas e aventuras, e em breve abrirá suas portas para vocês, fazendeiros destemidos!",
  "goldTooth.intro.part2":
    "Estejam prontos para se juntar à minha tripulação, pois a caçada ao tesouro começará em breve!",
};

const guideCompost: Record<GuideCompost, string> = {
  "guide.compost.addEggs.speed": "Adicione ovos para acelerar a produção",
  "guide.compost.addEggs": "Adicione ovos",
  "guide.compost.eggs": "Ovos",
  "guide.compost.cropGrowthTime": "-50% Tempo de crescimento da plantação",
  "guide.compost.fishingBait": "Isca de pesca",
  "guide.compost.placeCrops":
    "Coloque plantações na composteira para alimentar as minhocas",
  "guide.compost.compostCycle":
    "Um ciclo de compostagem produz vários fertilizantes que podem ser usados para dar boost nas suas plantações e frutas",
  "guide.compost.yieldsWorms":
    "Cada compostagem produz minhocas que podem ser usadas como isca para pesca",
  "guide.compost.useEggs":
    "Cansado de esperar? Use ovos para acelerar a produção de compostagem",
  "guide.compost.addEggs.confirmation":
    ENGLISH_TERMS["guide.compost.addEggs.confirmation"],
};

const guideTerms: Record<GuideTerms, string> = {
  "guide.intro":
    "Desde humildes começos até a agricultura especializada, este guia tem tudo o que você precisa!",
  "gathering.guide.one":
    "Para prosperar em Sunflower Land, dominar a arte da coleta de recursos é essencial. Comece equipando as ferramentas apropriadas para coletar diferentes recursos. Use o machado confiável para derrubar árvores e adquirir madeira. Para criar ferramentas, visite a bancada local do Ferreiro e troque seus Coins/recursos pela ferramenta desejada.",
  "gathering.guide.two":
    "Conforme você avança e reúne recursos suficientes, você desbloqueará a capacidade de expandir seu território. A expansão de sua terra abre novos horizontes em Sunflower Land. As expansões de terras revelam um tesouro de recursos, incluindo solo fértil para plantar culturas, árvores majestosas, depósitos de pedra valiosa, veias de ferro precioso, depósitos de ouro brilhante, patches de frutas encantadoras e muito mais.",
  "gathering.guide.three":
    "Lembre-se, a coleta de recursos e a expansão de terras são a espinha dorsal de sua jornada agrícola. Aceite os desafios e recompensas que vêm a cada passo, e observe seu Sunflower Land florescer com recursos abundantes e possibilidades infinitas.",

  "crops.guide.one":
    "Em Sunflower Land, as plantações desempenham um papel crucial em sua jornada rumo à prosperidade. Plantando e colhendo, você pode ganhar Coins ou usá-las para criar receitas e itens valiosos dentro do jogo.",
  "crops.guide.two":
    "Para cultivar, você precisa comprar as respectivas sementes na loja do jogo. Cada semente tem um tempo de crescimento diferente, variando de apenas 1 minuto para Girassóis a 36 horas para Couve. Quando as culturas estiverem totalmente crescidas, você pode colhê-las e colher as recompensas.",
  "crops.guide.three":
    "Lembre-se, à medida que você expande sua terra e progride no jogo, mais sementes se tornarão disponíveis, oferecendo maiores oportunidades de ganhar Coins e explorar o vasto potencial da economia agrícola de Sunflower Land. Então suje as mãos, plante essas sementes e observe suas culturas florescerem enquanto você colhe seu caminho para o sucesso!",

  "building.guide.one":
    "Explore a variedade diversificada de construções disponíveis à medida que você progride em Sunflower Land. De casas de galinha a oficinas e além, cada estrutura traz vantagens únicas para sua fazenda. Aproveite essas construções para otimizar suas operações agrícolas, aumentar a produtividade e desbloquear novas possibilidades. Planeje seu layout cuidadosamente e aproveite as recompensas que vêm com a construção de uma fazenda próspera em Sunflower Land.",
  "building.guide.two":
    "Em Sunflower Land, as construções são a pedra angular de sua jornada agrícola. Para acessar o menu, clique no ícone do Inventário e selecione a guia Construções. Escolha a estrutura desejada e retorne à tela da sua fazenda. Encontre um espaço aberto, marcado em verde, e confirme o posicionamento. Aguarde o término do temporizador e seu novo edifício estará pronto para uso. Construções oferecem vários benefícios e desbloqueiam recursos emocionantes de jogabilidade. Posicione-os estrategicamente em sua fazenda para maximizar a eficiência e observe enquanto seu império agrícola cresce e prospera.",

  "cooking.guide.one":
    "Cozinhar permite que você alimente seu Bumpkin e o mantenha feliz e saudável. Ao preparar uma variedade de pratos deliciosos, você pode reabastecer a energia do seu Bumpkin, desbloquear buffs e até mesmo desbloquear conquistas.",
  "cooking.guide.two":
    "Para cozinhar, você precisará de ingredientes. Você pode adquirir ingredientes de várias maneiras, incluindo comprá-los na loja do jogo, colhê-los das plantações prontas em sua fazenda ou ganhá-los de outras atividades no jogo.",
  "cooking.guide.three":
    "Uma vez que você tenha os ingredientes necessários, vá para a Cozinha em sua fazenda e selecione o prato que deseja preparar. Cada prato requer uma certa quantidade de tempo para ser concluído. Assim que estiver pronto, você pode coletá-lo e usá-lo para alimentar seu Bumpkin ou desbloquear benefícios adicionais no jogo. Experimente diferentes receitas e descubra os segredos da culinária em Sunflower Land.",
  "cooking.guide.four":
    "Depois que a comida estiver pronta, pegue-a do prédio clicando nele, e assim movendo-a para o seu inventário. A partir daí, você pode interagir com seu NPC Bumpkin na fazenda e alimentá-los com a comida preparada, ajudando-os a ganhar XP e progredir ainda mais no jogo.",
  "cooking.guide.five":
    "Experimente diferentes receitas, desbloqueie novos prédios e descubra a alegria de cozinhar enquanto você nutre seu Bumpkin e embarca em uma deliciosa aventura culinária em Sunflower Land.",

  "animals.guide.one":
    "As galinhas em Sunflower Land são uma adição encantadora à sua fazenda, servindo como fonte de ovos que podem ser usados em várias receitas e artesanatos. Para começar com as galinhas, você precisará alcançar o nível 9 do Bumpkin e construir o Galinheiro. A partir daí, você tem a opção de comprar galinhas ou colocar as que já possui. Basta arrastá-las para a sua fazenda, assim como colocar prédios. Em uma fazenda padrão, cada Galinheiro comporta até 10 galinhas, e se você possuir o Galinheiro SFT, esse limite se estende para 15.",
  "animals.guide.two":
    "Cada galinha tem um indicador acima de sua cabeça, exibindo seu humor ou necessidades atuais. Isso pode variar de estar com fome, cansado, feliz ou pronto para chocar. Para manter suas galinhas contentes e produtivas, alimente-as selecionando trigo do seu inventário e interagindo com a galinha. A alimentação inicia o temporizador de ovos, que leva 48 horas para os ovos ficarem prontos para chocar. Uma vez que os ovos estejam prontos, visite sua fazenda, verifique o ícone acima de cada galinha e interaja com elas para descobrir o tipo de ovo que chocou. Ocasionalmente, você pode até descobrir galinhas mutantes raras, que oferecem impulsos especiais, como produção de ovos mais rápida, aumento de rendimento ou redução no consumo de alimentos.",
  "animals.guide.three":
    "Cuidar de suas galinhas e coletar seus ovos adiciona um elemento dinâmico e gratificante à sua fazenda em Sunflower Land. Experimente receitas, use os ovos em seus empreendimentos de artesanato e aproveite as surpresas que vêm com as galinhas mutantes raras. Construa uma operação avícola próspera e colha os benefícios de seu trabalho árduo enquanto você abraça o mundo encantador das galinhas em Sunflower Land.",

  "crafting.guide.one":
    "Em Sunflower Land, a criação de NFTs é um aspecto crucial para aumentar sua produção agrícola e acelerar seu progresso. Esses itens especiais fornecem vários bônus, como aumento no crescimento de culturas, melhorias na culinária e aumentos de recursos, que podem acelerar significativamente sua jornada. Ao maximizar suas Coins você pode criar ferramentas, reunir recursos e expandir sua terra para estabelecer ainda mais seu império agrícola.",
  "crafting.guide.two":
    "Para começar a criar itens, vamos visitar Igor, um artesão habilidoso em Sunfloria. Depois de pegar o barco e chegar a Sunfloria, vá até o topo da ilha para conversar com Igor. Ele está atualmente oferecendo um Espantalho Básico, que aumenta a velocidade de Girassóis, Batatas e Abóboras. Este é um excelente negócio que requer a troca de seus recursos pelo espantalho. Uma vez obtido, retorne à sua ilha principal e entre no modo de design clicando no ícone da mão branca no canto superior direito do jogo.",
  "crafting.guide.three":
    "No modo de design, você pode colocar itens estrategicamente e rearranjar recursos em sua fazenda para otimizar seu layout e melhorar seu apelo visual. Este passo é crucial para maximizar a eficácia de seu equipamento artesanal. Por exemplo, coloque o Espantalho sobre as parcelas que deseja impulsionar. Além disso, considere comprar decorações para adicionar charme e arrumação à sua terra.",
  "crafting.guide.four":
    "Ao criar equipamentos e colocá-los estrategicamente, você pode amplificar suas habilidades agrícolas, criar uma casa na ilha para se orgulhar e acelerar seu progresso em Sunflower Land.",

  "deliveries.guide.one":
    "As entregas em Sunflower Land oferecem uma oportunidade emocionante de ajudar Goblins famintos e companheiros Bumpkins enquanto ganha recompensas. Todos os dias, você poderá ver todos os pedidos que possui clicando no quadro de entregas na parte inferior esquerda da tela. Os pedidos foram feitos por alguns NPCs locais que podem ser encontrados em torno da Pumpkin Plaza. Para cumprir um pedido, você precisará fazer um passeio de barco até a Pumpkin Plaza e procurar pelo NPC que espera a entrega. Depois de encontrá-los, clique neles para entregar o pedido e receber sua recompensa.",
  "deliveries.guide.two":
    "Como um novo jogador, você começa com três slots de pedidos, mas à medida que expande sua fazenda, desbloqueará slots adicionais, permitindo que jogadores avançados assumam mais pedidos. Novos pedidos chegam a cada 24 horas, oferecendo uma variedade de tarefas, desde cultivar produtos até cozinhar alimentos e reunir recursos. Completar pedidos lhe renderá bônus de marcos, incluindo Block Bucks, SFL, Coins, bolos deliciosos e outras recompensas. O sistema de recompensas é baseado na dificuldade do pedido, então considere priorizar pedidos que ofereçam maiores recompensas para maximizar seus ganhos. Fique de olho no quadro e desafie-se com uma variedade de pedidos, subindo de nível e desbloqueando novos prédios conforme necessário para cumprir pedidos mais exigentes.",
  "deliveries.intro": ENGLISH_TERMS["deliveries.intro"],
  "deliveries.new": ENGLISH_TERMS["deliveries.new"],
  "chores.intro": ENGLISH_TERMS["chores.intro"],

  "scavenger.guide.one":
    "Coletar em Sunflower Land oferece oportunidades emocionantes para  descobrir tesouros escondidos e reunir recursos valiosos. O primeiro aspecto é cavar tesouros na Ilha do Tesouro, onde você pode se tornar um caçador de tesouros piratas. Ao criar uma pá de areia e aventurar-se na Ilha do Tesouro, você pode cavar em áreas de areia escura para descobrir uma variedade de tesouros, incluindo recompensas, decorações e até mesmo SFTs antigos com utilidade.",
  "scavenger.guide.two":
    "Outra forma de coleta envolve reunir cogumelos selvagens que aparecem espontaneamente em sua fazenda e nas ilhas vizinhas. Esses cogumelos podem ser coletados gratuitamente e usados em receitas, missões e na criação de itens. Fique de olho nesses cogumelos, pois eles se renovam a cada 16 horas, com um limite máximo de 5 cogumelos em sua fazenda. Se sua terra estiver cheia, os cogumelos aparecerão nas ilhas vizinhas, garantindo que você não perca esses recursos valiosos.",

  "fruit.guide.one":
    "As frutas desempenham um papel significativo em Sunflower Land como um recurso valioso que pode ser vendido por Coins ou utilizado em várias receitas e artesanatos. Ao contrário das plantações, as áreas de frutas têm a capacidade única de se regenerar várias vezes após cada colheita, fornecendo uma fonte sustentável de frutas para os jogadores.",
  "fruit.guide.two":
    "Para plantar frutas, você precisará adquirir áreas de frutas maiores, que se tornam disponíveis na 9ª-10ª expansão de sua fazenda.",
  "fruit.guide.three":
    "Ao cultivar frutas e incorporá-las em suas estratégias agrícolas, você pode maximizar seus lucros, criar receitas deliciosas e desbloquear novas possibilidades em Sunflower Land.",

  "seasons.guide.one":
    "As Temporadas em Sunflower Land trazem excitação e frescor ao jogo, oferecendo aos jogadores novos desafios e oportunidades. Com a introdução de cada Temporada, os jogadores podem esperar uma variedade de novos itens craftáveis, decorações de edição limitada, animais mutantes e tesouros raros. Essas mudanças sazonais criam uma experiência de jogo dinâmica e evolutiva, incentivando os jogadores a adaptarem suas estratégias e explorarem novas possibilidades em suas fazendas. Além disso, os Tickets de Temporada adicionam um elemento estratégico ao jogo, pois os jogadores devem decidir como alocar seus ingressos sabiamente, seja coletando itens raros, optando por decorações de maior oferta ou trocando tickets por SFL. O mecanismo sazonal mantém o jogo envolvente e garante que sempre haja algo para esperar em Sunflower Land.",
  "seasons.guide.two":
    "A disponibilidade de itens sazonais na Ferraria Goblin adiciona outra camada de emoção. Os jogadores devem reunir os recursos necessários e os ingressos sazonais para criar esses itens de oferta limitada, criando uma sensação de competição e urgência. Planejar com antecedência e estrategizar se tornam crucial, pois os jogadores visam garantir os itens desejados antes que o estoque acabe. Além disso, a opção de trocar tickets de temporada por Coins oferece flexibilidade e permite que os jogadores façam escolhas que estejam alinhadas com seus objetivos específicos de jogo. Com as ofertas únicas de cada Temporada e a antecipação de eventos surpresa, Sunflower Land mantém os jogadores engajados e entretidos durante todo o ano, promovendo uma experiência agrícola vibrante e sempre em evolução.",
  "pete.teaser.one": "Corte as árvores",
  "pete.teaser.three": "Colha os Girassóis",
  "pete.teaser.four": "Venda os Girassóis",
  "pete.teaser.five": "Compre Sementes",
  "pete.teaser.six": "Plante Sementes",
  "pete.teaser.seven": "Crie um Espantalho",
  "pete.teaser.eight": "Cozinhe comida e evolua",
};

// const grubshop: Record<GrubShop, string> = {
//   "message.grublinOrders": "Volte amanhã para ver os Pedidos dos Grublins.",
//   "message.orderFulfilled": "Pedido entregue",
//   "message.grubShopClosed": "O Grub Shop está fechado às terças-feiras.",
//   "message.moreOrdersIn": "Mais pedidos em",
//   "message.bonusOffer": "Oferta de bônus",
//   "message.earnSeasonalTickets":
//     "Ganhe 10 Tickets de Temporada para cada refeição.",
// };

const halveningCountdown: Record<HalveningCountdown, string> = {
  "halveningCountdown.approaching": "O Halvening está se Aproximando!",
  "halveningCountdown.description":
    "No Halvening, todos os preços de culturas e certos recursos são reduzidos pela metade. Isso torna mais difícil obter SFL.",
  "halveningCountdown.preparation": "Certifique-se de estar preparado!",
  "halveningCountdown.title": "Halvening!",
};

const harvestflower: Record<Harvestflower, string> = {
  "harvestflower.noFlowerBed": "Canteiro de flores não existe",
  "harvestflower.noFlower": "O canteiro de flores não tem uma flor",
  "harvestflower.notReady": "A flor não está pronta para ser colhida",
  "harvestflower.alr.plant": "A flor já está plantada",
};

const harvestBeeHive: Record<HarvestBeeHive, string> = {
  "harvestBeeHive.notPlaced": "Esta colméia não está colocada.",
  "harvestBeeHive.noHoney": "Esta colméia não tem mel.",
};

const hayseedHankPlaza: Record<HayseedHankPlaza, string> = {
  "hayseedHankPlaza.cannotCompleteChore":
    "Não é possível completar esta tarefa?",
  "hayseedHankPlaza.skipChore": "Pular tarefa",
  "hayseedHankPlaza.canSkipIn": "Você pode pular esta tarefa em",
  "hayseedHankPlaza.wellDone": "Bem feito",
  "hayseedHankPlaza.lendAHand": "Dê uma mão?",
};

const hayseedHankV2: Record<HayseedHankV2, string> = {
  "hayseedHankv2.dialog1":
    "Bem, olá, jovens! Eu sou Hayseed Hank, um fazendeiro Bumpkin experiente, cuidando da terra como nos bons e velhos tempos.",
  "hayseedHankv2.dialog2": ENGLISH_TERMS["hayseedHankv2.dialog2"],
  "hayseedHankv2.action": "Vamos lá",
  "hayseedHankv2.title": "As Tarefas Diárias de Hank",
  "hayseedHankv2.newChoresAvailable": "Novas tarefas disponíveis em ",
  "hayseedHankv2.skipChores": "Você pode pular tarefas a cada novo dia.",
  "hayseedHankv2.greeting": "Bem, olá, jovens! Eu sou Hayseed Hank...",
};

const heliosSunflower: Record<HeliosSunflower, string> = {
  "heliosSunflower.title": "Clytie, a Girassol",
  "heliosSunflower.description":
    "Apenas o verdadeiro salvador pode voltar e colher este Girassol.",
  "confirmation.craft": ENGLISH_TERMS["confirmation.craft"],
};

const helper: Record<Helper, string> = {
  "helper.highScore1": "Incrível! Você está dominando a arte de fazer poções!",
  "helper.highScore2":
    "Magnífico! Suas habilidades estão trazendo a planta à vida!",
  "helper.highScore3":
    "Surpreendente! A planta está maravilhada com sua expertise!",
  "helper.midScore1":
    "Quase lá! Sua poção teve um impacto positivo em sua planta!",
  "helper.midScore2":
    "Continue assim! A planta está começando a prosperar com sua mistura habilidosa!",
  "helper.midScore3":
    "Bom trabalho! Sua poção está começando a fazer sua mágica na planta!",
  "helper.lowScore1":
    "Está chegando lá. A planta está mostrando sinais de felicidade.",
  "helper.lowScore2":
    "Esforço louvável. Sua poção trouxe um pouco de alegria para a planta.",
  "helper.lowScore3":
    "Nada mal. Suas habilidades estão começando a causar uma boa impressão na planta.",
  "helper.veryLowScore1":
    "Continue tentando. A planta reconhece sua determinação.",
  "helper.veryLowScore2": "Você está chegando lá. A planta vê seu progresso.",
  "helper.veryLowScore3": "Ainda não, mas a planta sente seu comprometimento.",
  "helper.noScore1":
    "Oh não! A planta despreza algo em sua poção! Tente novamente.",
  "helper.noScore2":
    "Oops! A planta não gosta de algo em sua poção! Tente novamente.",
  "helper.noScore3":
    "Uh-oh! Algo em sua poção é um fracasso total com a planta! Tente novamente.",
};

const henHouseTerms: Record<HenHouseTerms, string> = {
  "henHouse.chickens": "Galinhas",
  "henHouse.text.one": "Alimente com trigo e colete ovos",
  "henHouse.text.two": "Galinha Preguiçosa",
  "henHouse.text.three":
    "Coloque sua galinha para trabalhar e comece a coletar ovos!",
  "henHouse.text.four": "Galinha chocando",
  "henHouse.text.five": "Já está colocada e trabalhando duro!",
  "henHouse.text.six": "Construa um galinheiro extra para criar mais galinhas",
};

const howToFarm: Record<HowToFarm, string> = {
  "howToFarm.title": "Como Fazer Agricultura?",
  "howToFarm.stepOne": "1. Colha as plantações quando estiverem prontas",
  "howToFarm.stepTwo": "2. Visite a cidade e clique na loja",
  "howToFarm.stepThree": "3. Venda suas colheitas na loja por Coins",
  "howToFarm.stepFour": "4. Compre sementes usando seu Coins",
  "howToFarm.stepFive": "5. Plante sementes e espere",
};

const howToSync: Record<HowToSync, string> = {
  "howToSync.title": "Como Sincronizar?",
  "howToSync.description":
    "Todo o seu progresso é salvo em nosso servidor de jogo. Você precisará sincronizar na cadeia (blockchain) quando quiser mover seus tokens, NFTs e recursos para a Polygon.",
  "howToSync.stepOne": "1. Abra o menu",
  "howToSync.stepTwo": "2. Clique em 'Sincronizar na cadeia'",
};

const howToUpgrade: Record<HowToUpgrade, string> = {
  "howToUpgrade.title": "Como Atualizar?",
  "howToUpgrade.stepOne": "1. Fale com um Goblin bloqueando os campos",
  "howToUpgrade.stepTwo": "2. Visite a cidade e clique na cozinha",
  "howToUpgrade.stepThree": "3. Faça a comida que o goblin quer",
  "howToUpgrade.stepFour": "4. Voilà! Aproveite seus novos campos e culturas",
};

const islandupgrade: Record<Islandupgrade, string> = {
  "islandupgrade.confirmUpgrade":
    "Tem certeza de que deseja atualizar para uma nova ilha.",
  "islandupgrade.warning": ENGLISH_TERMS["islandupgrade.warning"],
  "islandupgrade.upgradeIsland": "Atualizar Ilha",
  "islandupgrade.newOpportunities":
    "Uma ilha exótica espera por você com novos recursos e oportunidades para expandir sua fazenda.",
  "islandupgrade.confirmation":
    "Você gostaria de atualizar? Seus recursos serão transferidos com segurança para sua nova ilha.",
  "islandupgrade.locked": "Trancado",
  "islandupgrade.exploring": "Explorando",
  "islandupgrade.welcomePetalParadise": "Bem-vindo ao Paraíso das Pétalas!",
  "islandupgrade.welcomeDesertIsland":
    ENGLISH_TERMS["islandupgrade.welcomeDesertIsland"],
  "islandupgrade.itemsReturned":
    "Seus itens foram devolvidos com segurança ao seu inventário.",
  "islandupgrade.notReadyExpandMore":
    ENGLISH_TERMS["islandupgrade.notReadyExpandMore"],
  "islandupgrade.exoticResourcesDescription":
    "Esta área de Sunflower Land é conhecida por seus recursos exóticos. Expanda sua terra para descobrir frutas, flores, colmeias e minerais raros!",
  "islandupgrade.desertResourcesDescription":
    ENGLISH_TERMS["islandupgrade.desertResourcesDescription"],
  "islandupgrade.requiredIsland": ENGLISH_TERMS["islandupgrade.requiredIsland"],
  "islandupgrade.otherIsland": ENGLISH_TERMS["islandupgrade.otherIsland"],
};

const interactableModals: Record<InteractableModals, string> = {
  "interactableModals.returnhome.message": "Você gostaria de voltar para casa?",
  "interactableModals.fatChicken.message":
    "Por que esses Bumpkins não me deixam em paz, só quero relaxar.",
  "interactableModals.lazyBud.message": "Uuuuf! Tão cansado.....",
  "interactableModals.bud.message":
    "Hmm, melhor eu deixar esse broto em paz. Tenho certeza de que seu dono está procurando por ele",
  "interactableModals.walrus.message":
    "Arrr arr arrr! A loja de peixes não abrirá até que eu consiga meu peixe.",
  "interactableModals.plazaBlueBook.message1":
    "Para chamar os buscadores, devemos reunir a essência da terra - abóboras, nutridas pela terra, e ovos, a promessa de novos começos.",
  "interactableModals.plazaBlueBook.message2":
    "Ao cair da noite e a lua lançar seu brilho prateado, oferecemos nossos humildes presentes, esperando despertar seus olhos vigilantes mais uma vez.",
  "interactableModals.plazaOrangeBook.message1":
    "Nossos bravos defensores lutaram valentemente, mas perdemos a grande guerra, e os Moonseekers nos expulsaram de nossa terra natal. No entanto, mantemos a esperança, pois um dia recuperaremos o que era nosso.",
  "interactableModals.plazaOrangeBook.message2":
    "Até lá, manteremos Sunflower Land viva em nossos corações e sonhos, esperando o dia de nosso retorno triunfante.",
  "interactableModals.beachGreenBook.message1":
    "Quando você está atrás daqueles cobiçados Red Snappers, tente uma reviravolta inesperada",
  "interactableModals.beachGreenBook.message2":
    "Use Maçãs com Isca básica e veja essas belezas vermelhas praticamente pularem em sua rede.",
  "interactableModals.beachBlueBook.message1":
    "Não conte para Shelly, mas tenho tentado trazer Saw Sharks para a praia!",
  "interactableModals.beachBlueBook.message2":
    "Tenho experimentado com diferentes iscas ultimamente, mas a única que parece funcionar é o Red Snapper.",
  "interactableModals.beachBlueBook.message3":
    "Esses caçadores oceânicos conseguem sentir o cheiro de um banquete de Red Snapper de longe, então não se surpreenda se eles vierem correndo.",
  "interactableModals.beachOrangeBook.message1":
    "Uma barbatana radiante apareceu na superfície, não podia acreditar nos meus olhos!",
  "interactableModals.beachOrangeBook.message2":
    "Por sorte, Tango estava comigo, ele deve ser meu amuleto da sorte.",
  "interactableModals.plazaGreenBook.message1":
    "Os Bumpkins controlam essas ilhas, deixando-nos goblins com pouco trabalho e comida ainda mais escassa.",
  "interactableModals.plazaGreenBook.message2":
    "Lutamos pela igualdade, um lugar para chamar de nosso, onde possamos viver e prosperar",
  "interactableModals.fanArt.winner":
    ENGLISH_TERMS["interactableModals.fanArt1.message"],
  "interactableModals.fanArt1.message":
    "Parabéns Palisman, o vencedor da primeira competição de Fan Art",
  "interactableModals.fanArt2.message":
    "Parabéns Vergelsxtn, o vencedor da competição de Fan Art Dawn Breaker Party",
  "interactableModals.fanArt2.linkLabel": "Ver mais",
  "interactableModals.fanArt3.message":
    "O lugar perfeito para uma bela pintura. Eu me pergunto o que vão colocar aqui depois...",
  "interactableModals.clubhouseReward.message1":
    "Paciência, amigo, as recompensas estão chegando...",
  "interactableModals.clubhouseReward.message2":
    "Junte-se a #bud-clubhouse no Discord para as últimas atualizações.",
  "interactableModals.plazaStatue.message":
    "Em homenagem a Bumpkin Braveheart, o fazendeiro firme que liderou nossa cidade contra a horda de Goblins durante os dias sombrios da guerra antiga.",
  "interactableModals.dawnBook1.message1":
    "Por séculos, nossa família protegeu a Ilha Dawn Breaker. Como o tocador de sino da ilha, avisamos sobre perigos do Norte, mesmo quando criaturas sombrias ameaçam nosso lar.",
  "interactableModals.dawnBook1.message2":
    "Nossa família está na linha de frente contra a escuridão se espalhando do Norte, mas alas, nossos sacrifícios passam despercebidos.",
  "interactableModals.dawnBook1.message3":
    "Chegará o dia em que nossa devoção será reconhecida?",
  "interactableModals.dawnBook2.message1":
    "Beringelas, elas são mais do que parecem. Apesar de sua casca escura que atrai criaturas sombrias, elas trazem luz aos nossos pratos.",
  "interactableModals.dawnBook2.message2":
    "Grelhadas ou amassadas em uma ganoush de Bumpkin, sua versatilidade é incomparável. Os vegetais da família das solanáceas são um símbolo de nossa resiliência diante da adversidade.",
  "interactableModals.dawnBook3.message1":
    "Querido diário, a chegada dos Bumpkins trouxe um raio de esperança.",
  "interactableModals.dawnBook3.message2":
    "Sonho com o dia em que poderei pilotar meu próprio barco para Sunfloria, a terra onde aventureiros e viajantes se congregam.",
  "interactableModals.dawnBook3.message3":
    "Ouvi sussurros sobre os preparativos especiais dos Bumpkins lá - um farol de promessa nestes tempos desafiadores.",
  "interactableModals.dawnBook4.message1":
    "Os gnomos, seu fascínio era muito potente para resistir.",
  "interactableModals.dawnBook4.message2":
    "As instruções da Bruxa ecoavam em minha mente - 'Alinhe os três, e o poder será seu.'",
  "interactableModals.dawnBook4.message3":
    "Porém, mesmo os soldados de berinjela não conseguiram resistir à tentação. Mas eu não vacilarei. Um dia, reivindicarei o poder que me é de direito.",
  "interactableModals.timmyHome.message":
    "Oh, céus, eu realmente quero que você explore minha casa, mas mamãe me disse para não falar com estranhos, talvez seja melhor assim.",
  "interactableModals.windmill.message":
    "Ah, meu moinho está em reparo, não posso deixar ninguém bisbilhotando enquanto o conserto, volte mais tarde.",
  "interactableModals.igorHome.message":
    "Perca-se! Não estou com humor para visitantes, especialmente curiosos como você!",
  "interactableModals.potionHouse.message1":
    "Cuidado, amigo, o cientista maluco mora aqui!",
  "interactableModals.potionHouse.message2":
    "Rumor tem, eles estão procurando aprendizes Bumpkin para cultivar culturas mutantes com eles.",
  "interactableModals.guildHouse.message":
    "Espere aí Bumpkin! Você precisa de um Bud se quiser entrar no Clube.",
  "interactableModals.guildHouse.budsCollection": "Coleção de Buds no Opensea",
  "interactableModals.bettyHome.message":
    "Oh, querido, por mais que eu ame minhas plantações, minha casa é um espaço privado, não aberto a visitantes agora.",
  "interactableModals.bertHome.message":
    "Invasores! Eles devem estar atrás da minha coleção de itens raros e segredos, não posso deixá-los entrar!",
  "interactableModals.beach.message1": "Você já foi à praia?",
  "interactableModals.beach.message2":
    "Dizem que está cheia de tesouros luxuosos! Infelizmente está em construção.",
  "interactableModals.castle.message":
    "Segure aí, camponês! De jeito nenhum vou deixar você visitar o castelo",
  "interactableModals.woodlands.message":
    "Está viajando para as florestas? Certifique-se de pegar alguns cogumelos deliciosos!",
  "interactableModals.port.message":
    "Segure aí! Os Goblins ainda estão construindo o porto. Estará pronto para viagens e pesca em breve.",
};

const introPage: Record<IntroPage, string> = {
  "introPage.welcome": "Bem-vindo à Sala de Poções, meu aprendiz curioso!",
  "introPage.description":
    "Eu sou o Cientista Maluco Bumpkin, aqui para ajudá-lo nesta busca mágica pelo mundo da feitiçaria botânica. Prepare-se para descobrir os segredos de Sunflower Land! Cada tentativa custará 1 SFL.",
  "introPage.mission":
    "Sua missão: decifrar a combinação certa de poções dentro da grade encantada.",
  "introPage.tip":
    "Lembre-se, quanto mais poções corretas você selecionar, mais feliz a planta ficará, aumentando suas chances de drops raros!",
  "introPage.chaosPotion": "Cuidado com a poção 'bomba', ela bagunça tudo!",
  "introPage.playButton": "Vamos jogar",
};

const islandName: Record<IslandName, string> = {
  "island.home": "Casa",
  "island.pumpkin.plaza": "Pumpkin Plaza",
  "island.beach": "Praia",
  "island.kingdom": ENGLISH_TERMS["island.kingdom"],
  "island.woodlands": "Floresta",
  "island.helios": "Helios",
  "island.goblin.retreat": "Ilha Goblin",
};

const islandNotFound: Record<IslandNotFound, string> = {
  "islandNotFound.message": "Você chegou no meio do nada!",
  "islandNotFound.takeMeHome": "Me leve para casa",
};

const landscapeTerms: Record<LandscapeTerms, string> = {
  "landscape.intro.one": "Desenhe sua ilha dos sonhos!",
  "landscape.intro.two":
    "No modo de design, você pode segurar, arrastar e mover itens ao redor.",
  "landscape.intro.three": "Colecione decorações raras",
  "landscape.intro.four": "Coloque colecionáveis do seu baú",
  "landscape.expansion.one":
    "Cada pedaço de terra vem com recursos exclusivos para ajudar a construir seu império agrícola!",
  "landscape.expansion.two": "Mais expansões estarão disponíveis em breve...",
  "landscape.timerPopover": "Próxima Expansão",
  "landscape.dragMe": "Arraste-me",
  "landscape.expansion.date": "Mais expansões estarão disponíveis em breve...",
  "landscape.great.work": "Ótimo trabalho Bumpkin!",
};

const levelUpMessages: Record<LevelUpMessages, string> = {
  "levelUp.2":
    "Yeehaw, você alcançou o nível 2! As colheitas estão tremendo em suas botas.",
  "levelUp.3":
    "Parabéns pelo nível 3! Você está crescendo como uma erva daninha...",
  "levelUp.4":
    "Parabéns pelo nível 4! Você oficialmente superou seu dedo verde.",
  "levelUp.5": "Nível 5 e ainda vivo! Seu trabalho duro está valendo a pena!",
  "levelUp.6":
    "Uau, nível 6 já? Você deve ser forte como um boi. Ou pelo menos seu arado é.",
  "levelUp.7": "Parabéns por alcançar o nível 7! Sua fazenda é incrível.",
  "levelUp.8":
    "Nível 8, ótimo trabalho! Você está plantando as sementes do sucesso.",
  "levelUp.9":
    "Niner niner, nível 9er! Sua colheita está crescendo tão rápido quanto suas habilidades.",
  "levelUp.10":
    "Nível 10, dois dígitos! Sua fazenda está tão boa, até as galinhas estão impressionadas.",
  "levelUp.11": "Nível 11, você está fazendo chover (água, é claro)!",
  "levelUp.12":
    "Parabéns pelo nível 12! Sua fazenda realmente está cultivando algum caráter.",
  "levelUp.13":
    "Sortudo nível 13! Você realmente está pegando o jeito dessa coisa de fazenda.",
  "levelUp.14": "Nível 14, é incrível quanto progresso você fez!",
  "levelUp.15": "Quinze e próspero! Sua fazenda está melhor do que nunca.",
  "levelUp.16":
    "Parabéns pelo nível 16! Suas habilidades agrícolas estão realmente enraizando.",
  "levelUp.17":
    "Nível 17, você está colhendo o que semeia (e está ficando bom!).",
  "levelUp.18": "Dezoito e florescendo com potencial!",
  "levelUp.19":
    "Parabéns pelo nível 19! Sua fazenda está crescendo tão rápido quanto suas habilidades.",
  "levelUp.20": "Nível 20, você é o creme da colheita!",
  "levelUp.21": "Vinte e um e colhendo como um profissional!",
  "levelUp.22":
    "Parabéns pelo nível 22! Sua fazenda está sendo arada com sucesso.",
  "levelUp.23":
    "Nível 23, suas habilidades estão realmente começando a florescer!",
  "levelUp.24": "Você está realmente florescendo no nível 24!",
  "levelUp.25":
    "Marca de um quarto de século! Você está fazendo feno enquanto o sol brilha.",
  "levelUp.26":
    "Parabéns pelo nível 26! Você está realmente tirando proveito dessa coisa de fazenda.",
  "levelUp.27":
    "Nível 27, você está realmente começando a se destacar no campo!",
  "levelUp.28": "Você está realmente elevando o nível no nível 28!",
  "levelUp.29":
    "Parabéns pelo nível 29! Você está realmente cultivando algumas habilidades sérias.",
  "levelUp.30": "Nível 30, agora você é um verdadeiro fazendeiro!",
  "levelUp.31": "Trinta e um e ainda crescendo forte!",
  "levelUp.32": "Parabéns pelo nível 32! Sua fazenda está em plena floração.",
  "levelUp.33":
    "Nível 33, suas habilidades agrícolas estão realmente decolando!",
  "levelUp.34": "Você está realmente brotando no nível 34!",
  "levelUp.35": "Nível 35, você é o caminhão de carga da agricultura!",
  "levelUp.36":
    "Parabéns pelo nível 36! Sua fazenda está realmente começando a colher algum sucesso.",
  "levelUp.37":
    "Nível 37, suas habilidades estão realmente começando a aparecer!",
  "levelUp.38":
    "Você está realmente plantando as sementes do sucesso no nível 38!",
  "levelUp.39":
    "Parabéns pelo nível 39! Sua fazenda está realmente começando a amadurecer.",
  "levelUp.40": "Nível 40, você é um herói da colheita!",
  "levelUp.41": "Quarenta e um e ainda crescendo forte!",
  "levelUp.42":
    "Parabéns pelo nível 42! Sua fazenda está começando a colher as recompensas.",
  "levelUp.43":
    "Nível 43, você está realmente cultivando algumas habilidades sérias.",
  "levelUp.44": "Você está realmente colhendo sucesso no nível 44!",
  "levelUp.45": "Nível 45, você é um verdadeiro mestre da colheita!",
  "levelUp.46":
    "Parabéns pelo nível 46! Suas habilidades agrícolas estão realmente começando a dar frutos.",
  "levelUp.47":
    "Nível 47, você está realmente se transformando em uma lenda agrícola.",
  "levelUp.48": "Você está realmente prosperando no nível 48!",
  "levelUp.49":
    "Parabéns pelo nível 49! Você está realmente começando a colher os frutos do seu trabalho árduo.",
  "levelUp.50":
    "Meio caminho para 100! Agora você é um verdadeiro profissional da agricultura.",
  "levelUp.51": "Cinquenta e um e ainda indo forte!",
  "levelUp.52":
    "Parabéns pelo nível 52! Sua fazenda é uma verdadeira obra de arte.",
  "levelUp.53":
    "Nível 53, suas habilidades estão realmente começando a se enraizar.",
  "levelUp.54": "Você está realmente colhendo felicidade no nível 54!",
  "levelUp.55":
    "Nível 55, você é uma verdadeira força agrícola a ser reconhecida.",
  "levelUp.56":
    "Parabéns pelo nível 56! Sua fazenda está realmente maravilhosa!",
  "levelUp.57":
    "Nível 57, você está realmente começando a cultivar algumas habilidades sérias.",
  "levelUp.58":
    "Você está realmente plantando as sementes do sucesso no nível 58!",
  "levelUp.59": "Parabéns pelo nível 59! Sua fazenda é o creme da colheita.",
  "levelUp.60": "Nível 60, você é um verdadeiro superstar agrícola!",
};

const letsGo: Record<LetsGo, string> = {
  "letsGo.title": "Hora de jogar!",
  "letsGo.description":
    "Obrigado por jogar a versão beta! Ainda estamos trabalhando no jogo e apreciamos seu apoio durante as fases iniciais!",
  "letsGo.readMore": "Você pode ler mais sobre o jogo na ",
  "letsGo.officialDocs": "documentação oficial",
};

const loser: Record<Loser, string> = {
  "loser.unsuccess": "Você não teve sucesso",
  "loser.longer": "O leilão não existe mais",
  "loser.refund.one": "Reembolso",
};

const lostSunflorian: Record<LostSunflorian, string> = {
  "lostSunflorian.line1": "Meu pai me enviou aqui para governar Helios.",
  "lostSunflorian.line2":
    "Infelizmente, esses Bumpkins não gostam que eu os observe.",
  "lostSunflorian.line3": "Mal posso esperar para voltar para Sunfloria.",
};

const megaStore: Record<MegaStore, string> = {
  "megaStore.message":
    "Bem-vindo à Mega Loja! Confira os itens limitados deste mês. Se você gostar de algo, certifique-se de pegá-lo antes que desapareça nos reinos do tempo.",
  "megaStore.month.sale": "Vendas deste mês",
  "megaStore.wearable":
    "Ótima compra! Seu novo item para vestir está armazenado com segurança em seu guarda-roupa. Você pode equipá-lo em um Bumpkin por lá.",
  "megaStore.collectible":
    "Ótima compra! Seu novo item colecionável está armazenado com segurança em seu inventário.",
  "megaStore.timeRemaining": ENGLISH_TERMS["megaStore.timeRemaining"],
};

const modalDescription: Record<ModalDescription, string> = {
  "modalDescription.friend": "Olá amigo!",
  "modalDescription.love.fruit":
    "Uau, você realmente ama Frutas tanto quanto eu!",
  "modalDescription.gift":
    "Não tenho mais presentes para você. Não se esqueça de usar seus novos itens!",
  "modalDescription.limited.abilities":
    "Tenho projetado vestíveis de edição limitada que podem melhorar suas habilidades de colheita de frutas.",
  "modalDescription.trail":
    "Estou procurando colhedores de frutas dedicados para testar esta roupa....de GRAÇA!",
};

const noaccount: Record<Noaccount, string> = {
  "noaccount.newFarmer": "Novo Fazendeiro",
  "noaccount.addPromoCode": "Adicionar um código promocional?",
  "noaccount.alreadyHaveNFTFarm": "Já tem uma fazenda NFT?",
  "noaccount.createFarm": "Criar Fazenda",
  "noaccount.noFarmNFTs": "Você não possui nenhuma fazenda NFT.",
  "noaccount.createNewFarm": "Criar nova fazenda",
  "noaccount.selectNFTID": "Selecione seu ID de NFT",
  "noaccount.welcomeMessage":
    "Bem-vindo à Sunflower Land. Parece que você ainda não tem uma fazenda.",
  "noaccount.promoCodeLabel": "Código Promocional",
  "noaccount.haveFarm": ENGLISH_TERMS["noaccount.haveFarm"],
  "noaccount.letsGo": ENGLISH_TERMS["noaccount.letsGo"],
};

const noBumpkin: Record<NoBumpkin, string> = {
  "noBumpkin.readyToFarm":
    "Incrível, seu Bumpkin está pronto para trabalhar na fazenda!",
  "noBumpkin.play": "Jogar",
  "noBumpkin.missingBumpkin": "Você está sem seu Bumpkin",
  "noBumpkin.bumpkinNFT": "Um Bumpkin é um NFT que é criado na Blockchain.",
  "noBumpkin.bumpkinHelp":
    "Você precisa de um Bumpkin para ajudá-lo a plantar, colher, cortar, minerar e expandir sua terra.",
  "noBumpkin.mintBumpkin": "Você pode obter um Bumpkin na OpenSea:",
  "noBumpkin.allBumpkins": "Uau, olhe todos esses Bumpkins!",
  "noBumpkin.chooseBumpkin": "Com qual Bumpkin você gostaria de jogar?",
  "noBumpkin.deposit": "Depositar",
  "noBumpkin.advancedIsland":
    "Esta é uma ilha avançada. Um Bumpkin forte é necessário:",

  "dequipper.noBumpkins": ENGLISH_TERMS["dequipper.noBumpkins"],
  "dequipper.missingBumpkins": ENGLISH_TERMS["dequipper.missingBumpkins"],
  "dequipper.intro": ENGLISH_TERMS["dequipper.intro"],
  "dequipper.warning": ENGLISH_TERMS["dequipper.warning"],
  "dequipper.success": ENGLISH_TERMS["dequipper.success"],
  "dequipper.dequip": ENGLISH_TERMS["dequipper.dequip"],
  "dequipper.nude": ENGLISH_TERMS["dequipper.nude"],
  "noBumpkin.nude": ENGLISH_TERMS["noBumpkin.nude"],
};

const noTownCenter: Record<NoTownCenter, string> = {
  "noTownCenter.reward": "Recompensa: 1 x Centro da Cidade!",
  "noTownCenter.news": "Suas últimas notícias ou declarações aqui.",
  "noTownCenter.townCenterPlacement":
    "Você pode colocar o Centro da Cidade através do inventário > seção de construção",
};

const notOnDiscordServer: Record<NotOnDiscordServer, string> = {
  "notOnDiscordServer.intro":
    "Parece que você ainda não entrou no servidor do Discord do Sunflower Land.",
  "notOnDiscordServer.joinDiscord": "Junte-se ao nosso ",
  "notOnDiscordServer.discordServer": "Servidor do Discord",
  "notOnDiscordServer.completeVerification":
    "2. Complete a verificação e comece",
  "notOnDiscordServer.acceptRules": "3. Aceite as regras em #regras",
};

const npc_message: Record<NPC_MESSAGE, string> = {
  // Betty
  "npcMessages.betty.msg1":
    "Caramba, mal posso esperar para colocar as mãos em produtos frescos!",
  "npcMessages.betty.msg2":
    "Estou tão animada para experimentar novas culturas, o que você tem para mim?",
  "npcMessages.betty.msg3":
    "Esperei o dia todo por uma chance de colher algumas frutas deliciosas!",
  "npcMessages.betty.msg4":
    "Estou ansiosa para ver que tipos de culturas estão prontas para colher hoje.",
  "npcMessages.betty.msg5":
    "Mal posso esperar para provar os frutos do meu trabalho, que tipo de produtos você tem?",
  "npcMessages.betty.msg6":
    "Tenho uma verdadeira paixão pela agricultura e estou sempre em busca de culturas novas e interessantes para cultivar.",
  "npcMessages.betty.msg7":
    "Não há nada como a sensação de colher uma safra abundante, é para isso que a agricultura serve!",
  // Blacksmith
  "npcMessages.blacksmith.msg1":
    "Preciso de alguns suprimentos para minha última invenção, tem algum material?",
  "npcMessages.blacksmith.msg2":
    "Estou procurando estocar alguns recursos brutos, tem algum para vender?",
  "npcMessages.blacksmith.msg3":
    "Preciso de alguns materiais para artesanato, tem algo que posso usar?",
  "npcMessages.blacksmith.msg4":
    "Você tem algum recurso raro ou único que eu poderia usar?",
  "npcMessages.blacksmith.msg5":
    "Estou interessado em adquirir alguns materiais de alta qualidade, o que você tem?",
  "npcMessages.blacksmith.msg6":
    "Estou procurando alguns materiais para meu próximo projeto, tem algo para oferecer?",
  "npcMessages.blacksmith.msg7":
    "Estou no mercado em busca de alguns materiais brutos, tem algum para vender?",
  // Pumpkin' pete
  "npcMessages.pumpkinpete.msg1":
    "E aí, novato! Que tal alguns produtos frescos?",
  "npcMessages.pumpkinpete.msg2":
    "Culturas saborosas, alguém? Sou sua escolha para colheitas fáceis!",
  "npcMessages.pumpkinpete.msg3":
    "Fresco e delicioso, esse é meu lema. O que você tem?",
  "npcMessages.pumpkinpete.msg4":
    "Novato na cidade? Vamos alegrar seu dia com algumas culturas!",
  "npcMessages.pumpkinpete.msg5":
    "Precisa de uma mãozinha, amigo? Tenho uma variedade de culturas para você!",
  "npcMessages.pumpkinpete.msg6":
    "Pete, o enérgico, à sua disposição! Culturas, alguém?",
  "npcMessages.pumpkinpete.msg7":
    "Bem-vindo à praça! Vamos alegrar seu dia com culturas!",
  // Cornwell
  "npcMessages.cornwell.msg1":
    "Ah, os velhos tempos... Trabalho duro é meu lema. O que você tem?",
  "npcMessages.cornwell.msg2":
    "Esses jovens, sem ética de trabalho! Traga-me coisas desafiadoras.",
  "npcMessages.cornwell.msg3":
    "Lembro-me de quando... Trabalho duro, é isso que está faltando!",
  "npcMessages.cornwell.msg4":
    "O conhecimento conquistado com trabalho árduo merece a melhor colheita. Me impressione!",
  "npcMessages.cornwell.msg5":
    "História e trabalho duro, é disso que se trata. Qual é a sua escolha?",
  "npcMessages.cornwell.msg6":
    "Cornwell é o nome, e estou aqui para a verdadeira experiência na fazenda.",
  "npcMessages.cornwell.msg7":
    "Tarefas difíceis, recompensas ricas. Mostre-me o que você tem!",
  // Raven
  "npcMessages.raven.msg1":
    "Escuridão e mistério, esse é meu jogo. Vou levar as culturas difíceis.",
  "npcMessages.raven.msg2":
    "Gótico no coração, preciso das culturas mais escuras para minhas poções.",
  "npcMessages.raven.msg3":
    "Sobrenatural e sinistro, esse é o clima que estou procurando. Me impressione.",
  "npcMessages.raven.msg4":
    "Anseio pela colheita sombria para meu trabalho com feitiços. Entregue-as.",
  "npcMessages.raven.msg5":
    "Traga-me as culturas que se escondem nas sombras. Não ficarei desapontado.",
  "npcMessages.raven.msg6":
    "Raven, o guardião da escuridão, quer suas culturas mais desafiadoras.",
  "npcMessages.raven.msg7":
    "Delícias sombrias para um coração gótico. Mostre-me sua colheita mais sombria.",
  // Bert
  "npcMessages.bert.msg1":
    "Cara, esses cogumelos... eles são a chave. Tem alguns mágicos?",
  "npcMessages.bert.msg2":
    "Loucura dos cogumelos, esse sou eu. Cogumelos mágicos, alguém?",
  "npcMessages.bert.msg3":
    "É tudo sobre os cogumelos, baby. Entregue os encantados.",
  "npcMessages.bert.msg4":
    "Vejo coisas, sabe? Cogumelos mágicos, é o que eu preciso.",
  "npcMessages.bert.msg5":
    "A vida é uma viagem, cara, e preciso desses cogumelos mágicos para vivê-la!",
  "npcMessages.bert.msg6":
    "Bert é o nome, cogumelos são o jogo. Os encantados, por favor!",
  "npcMessages.bert.msg7":
    "Cogumelos mágicos,meu amigo. É isso que me mantém em movimento.",
  // Timmy
  "npcMessages.timmy.msg1":
    "Roar! Sou Timmy, o urso! Me dê todas as delícias frutadas!",
  "npcMessages.timmy.msg2":
    "Sou um urso, e os ursos adoram frutas! Tem algum petisco frutado para mim?",
  "npcMessages.timmy.msg3":
    "Delícias frutadas, esse é o segredo. É uma coisa de Timmy, sabe?",
  "npcMessages.timmy.msg4":
    "Abraços de urso para as frutas! É uma coisa de Timmy, sabe?",
  "npcMessages.timmy.msg5":
    "Num traje de urso, a vida é uma festa. Frutas são minha praia, tem alguma?",
  "npcMessages.timmy.msg6":
    "Timmy, o urso, está aqui para diversão frutada! Entregue essas frutas!",
  "npcMessages.timmy.msg7":
    "Conversas frutíferas com um urso! Compartilhe o amor frutado!",
  // Tywin
  "npcMessages.tywin.msg1":
    "Ouro, ouro e mais ouro! Mostre-me as riquezas, plebeus!",
  "npcMessages.tywin.msg2":
    "Eu vigio os Bumpkins para garantir que paguem suas dívidas. Ouro, agora!",
  "npcMessages.tywin.msg3":
    "Plebeus, tragam-me suas riquezas! Sou Tywin, o príncipe exigente!",
  "npcMessages.tywin.msg4":
    "O Pumpkin Plaza está abaixo de mim, mas o ouro nunca é o suficiente. Mais!",
  "npcMessages.tywin.msg5":
    "É a vida de um príncipe, e exijo sua riqueza. Pague seus impostos!",
  "npcMessages.tywin.msg6":
    "A riqueza de um príncipe não conhece limites. Ouro, ouro e mais ouro!",
  "npcMessages.tywin.msg7":
    "O ouro é minha coroa, e quero tudo! Traga-me suas riquezas!",
  // Tango
  "npcMessages.tango.msg1":
    "Conversa, mastiga e conversa de novo! Frutas, frutas e mais frutas!",
  "npcMessages.tango.msg2":
    "Sou Tango, o macaco-esquilo frutado! Traga-me tesouros frutados!",
  "npcMessages.tango.msg3":
    "Laranja, travesso e brincalhão, esse sou eu. Frutas, alguém?",
  "npcMessages.tango.msg4":
    "Segredos das frutas? Eu os tenho! Compartilhe as maravilhas frutadas comigo!",
  "npcMessages.tango.msg5":
    "Travessuras frutíferas e delícias frutadas. Vamos nos divertir!",
  "npcMessages.tango.msg6":
    "Tango é o nome, jogos e frutas são minha marca registrada. Me dê!",
  "npcMessages.tango.msg7":
    "O conhecimento frutífero corre na minha família. Conte-me suas histórias mais frutadas!",
  // Miranda
  "npcMessages.miranda.msg1":
    "Dance comigo, amigo! Contribua para meu chapéu fantástico de frutas, por favor?",
  "npcMessages.miranda.msg2":
    "Samba e frutas andam de mãos dadas. O que você pode oferecer?",
  "npcMessages.miranda.msg3":
    "No ritmo do samba, as frutas são imprescindíveis. Quer compartilhar?",
  "npcMessages.miranda.msg4":
    "Tudo se resume ao ritmo do samba e às delícias frutadas. Traga algumas!",
  "npcMessages.miranda.msg5":
    "Junte-se à celebração do samba com um presente de frutas para meu chapéu!",
  "npcMessages.miranda.msg6":
    "O chapéu de Miranda adora um toque frutado. O que você pode contribuir?",
  "npcMessages.miranda.msg7": "Samba, frutas e amizade. Vamos fazer uma festa!",
  // Finn
  "npcMessages.finn.msg1":
    "Peguei a maior captura de todos os tempos! Peixes, alguém?",
  "npcMessages.finn.msg2":
    "A vida é um conto de pescador, e tenho histórias para contar. Pesquei alguns peixes!",
  "npcMessages.finn.msg3":
    "Finn, o pescador, a lenda e o sussurrador de peixes. Pesquei alguns peixes!",
  "npcMessages.finn.msg4":
    "Peixes grandes, histórias grandes e um grande ego. Traga-me seus tesouros piscosos!",
  "npcMessages.finn.msg5":
    "Anzol, linha e confiança, esse sou eu. Peixes, é o que faço!",
  "npcMessages.finn.msg6":
    "Histórias de pescador, direitos de se gabar e um toque de modéstia. Peixes, por favor!",
  "npcMessages.finn.msg7":
    "Você sabia que o Cirurgião não consegue resistir ao atrativo crocante das couves-flor?",
  "npcMessages.finn.msg8":
    "Peguei o maior peixe de todos os tempos. Não é apenas uma história; é realidade!",
  // Findley
  "npcMessages.findley.msg1":
    "Não vou deixar Finn ter toda a glória! Preciso de isca e chum para minha grande captura!",
  "npcMessages.findley.msg2":
    "Finn não é o único que pode pescar. Preciso de isca e chum, rápido!",
  "npcMessages.findley.msg3":
    "Vou mostrar a Finn quem é o verdadeiro pescador! Isca e chum, eu preciso deles!",
  "npcMessages.findley.msg4":
    "Procurando fisgar um Atum? Eles têm uma estranha predileção pelo atrativo crocante de couve-flor.",
  "npcMessages.findley.msg5":
    "A rivalidade corre na família. Estou aqui para provar um ponto. Isca e chum, por favor!",
  "npcMessages.findley.msg6":
    "Finn não é o único com habilidades de pesca. Estou atrás da captura da minha vida!",
  "npcMessages.findley.msg7":
    "Competir com Finn é uma obrigação. Isca e chum, preciso da sua ajuda!",
  "npcMessages.findley.msg8":
    "Irmãos em um duelo de pesca. Isca e chum são minhas armas secretas!",
  "npcMessages.findley.msg9":
    "Você sabia que o Mahi Mahi não consegue resistir ao doce crocante do milho?",
  // Corale
  "npcMessages.corale.msg1":
    "O oceano chama, e eu preciso de peixes. Ajude-me a libertar meus amigos!",
  "npcMessages.corale.msg2":
    "Peixes são meus amigos, e devo libertá-los. Você vai me ajudar?",
  "npcMessages.corale.msg3":
    "Pelo amor ao mar, traga-me peixes. Vou soltá-los em seu lar.",
  "npcMessages.corale.msg4":
    "Sob as ondas, meus amigos esperam. Peixes, para que possam nadar livres!",
  "npcMessages.corale.msg5":
    "O apelo de uma sereia para proteger seus amigos. Traga-me peixes, alma bondosa.",
  "npcMessages.corale.msg6":
    "A liberdade dos peixes, essa é minha missão. Me ajude com peixes, por favor?",
  "npcMessages.corale.msg7":
    "Junte-se a mim na dança da vida do mar. Peixes, para libertar meus amigos!",
  // Shelly
  "npcMessages.shelly.msg1":
    "Os Bumpkins estão desaparecendo, e eu temo que o Kraken seja a causa. Ajude-me a coletar seus tentáculos!",
  "npcMessages.shelly.msg2":
    "Os Bumpkins estão sumindo, e suspeito do Kraken. Você pode pegar seus tentáculos, por favor?",
  "npcMessages.shelly.msg3":
    "Kraken é uma ameaça. Traga seus tentáculos para mantê-los seguros.",
  "npcMessages.shelly.msg4":
    "O Kraken é sinistro. Traga seus tentáculos para a segurança deles.",
  "npcMessages.shelly.msg5":
    "Proteger a praia é difícil com o Kraken. Ajude-me a proteger os Bumpkins, pegue seus tentáculos.",
  "npcMessages.shelly.msg6":
    "Proteger os Bumpkins é meu dever, mas o Kraken me preocupa. Pegue seus tentáculos para protegê-los.",
  "npcMessages.shelly.msg7":
    "O Kraken está causando pânico, Bumpkins desaparecidos. Ajude-me a reunir seus tentáculos para a segurança deles.",
  "npcMessages.shelly.msg8":
    "A segurança dos Bumpkins é minha prioridade máxima, e receio que o Kraken esteja envolvido. Os tentáculos podem fazer a diferença!",
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

const nftminting: Record<NFTMinting, string> = {
  "nftminting.mintAccountNFT": "Mintando conta NFT",
  "nftminting.mintingYourNFT":
    "Mintando seu NFT e armazenando o progresso na Blockchain",
  "nftminting.almostThere": "Quase lá",
};

const npc: Record<Npc, string> = {
  "npc.Modal.Hammer": "Reúnam-se, Bumpkins, um leilão está prestes a começar.",
  "npc.Modal.Marcus":
    "Ei! Você não está autorizado a entrar na minha casa. Nem pense em tocar nas minhas coisas!",
  "npc.Modal.Billy": "Oi, pessoal! Me chamo Billy.",
  "npc.Modal.Billy.one":
    "Encontrei essas mudinhas, mas não consigo de jeito nenhum descobrir o que fazer com elas.",
  "npc.Modal.Billy.two":
    "Aposto que elas têm algo a ver com os brotos de minhoca que têm aparecido pela praça.",
  "npc.Modal.Gabi": "Oi, Bumpkin!",
  "npc.Modal.Gabi.one":
    "Você parece criativo, já pensou em contribuir com arte para o jogo?",
  "npc.Modal.Craig": "Por que você está me olhando estranho?",
  "npc.Modal.Craig.one": "Tem algo nos meus dentes...",
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
    "O que você quer? Fale rápido; tempo é dinheiro.",
  "npcDialogues.blacksmith.intro2":
    "O que te traz à minha oficina? Estou ocupado, então seja breve.",
  "npcDialogues.blacksmith.intro3":
    "Bem-vindo à minha humilde morada. O que te traz aqui?",
  "npcDialogues.blacksmith.intro4":
    "Declare seu propósito. Estou ocupado, e não tenho tempo para conversa fiada. O que te traz à minha oficina?",
  // Blacksmith Positive Delivery
  "npcDialogues.blacksmith.positiveDelivery1":
    "Finalmente! Você trouxe os materiais que eu preciso. Afaste-se; deixe-me fazer minha mágica.",
  "npcDialogues.blacksmith.positiveDelivery2":
    "Ah, finalmente! Você adquiriu os itens exatos que eu procurava. Prepare-se para equipamentos feitos com precisão.",
  "npcDialogues.blacksmith.positiveDelivery3":
    "Bom. Você entregou os materiais que eu preciso. Não vou decepcionar; minhas criações serão notáveis.",
  "npcDialogues.blacksmith.positiveDelivery4":
    "Impressionante! Você adquiriu os componentes necessários. Vou transformá-los em maravilhas agrícolas!",
  "npcDialogues.blacksmith.positiveDelivery5":
    "Hmm, você realmente conseguiu encontrar o que eu queria. Bem feito.",
  // Blacksmith Negative Delivery
  "npcDialogues.blacksmith.negativeDelivery1":
    "Você não tem o que eu exijo? Tempo está sendo desperdiçado. Volte quando tiver o necessário.",
  "npcDialogues.blacksmith.negativeDelivery2":
    "Não, não, não. Você falta com os materiais essenciais. Não desperdice meu tempo. Volte quando estiver preparado.",
  "npcDialogues.blacksmith.negativeDelivery3":
    "Inaceitável. Você não possui o que eu exijo. Não tenho tempo para incompetência. Volte quando estiver apto.",
  "npcDialogues.blacksmith.negativeDelivery4":
    "Insatisfatório. Você não possui o que preciso. Volte quando estiver pronto para cumprir sua parte do acordo.",
  "npcDialogues.blacksmith.negativeDelivery5":
    "Incompetência. Você falta com os materiais necessários. Não desperdice meu tempo; volte quando estiver preparado.",
  // Blacksmith NoOrder
  "npcDialogues.blacksmith.noOrder1":
    "Sem pedido ativo para mim no momento, mas se você precisar de ferramentas ou tiver materiais para artesanato, estou sempre aqui para ajudar. Fale, e começaremos a trabalhar.",
  "npcDialogues.blacksmith.noOrder2":
    "Sem pedido ativo para mim, mas se você precisar de equipamentos robustos ou tiver materiais para dar forma, sou seu artesão.",
  // Betty Into
  "npcDialogues.betty.intro1":
    "Ei, solzinho! Foi um dia agitado no mercado. Estou aqui para ver se você tem os ingredientes que pedi. Você os trouxe?",
  "npcDialogues.betty.intro2":
    "Olá, olá! Estava esperando para ver se você tem os ingredientes que pedi. Você os trouxe?",
  "npcDialogues.betty.intro3":
    "Bem-vindo ao mercado da Betty! Pronto para verificar se você tem os ingredientes que preciso? Vamos ver o que você tem pra mim!",
  "npcDialogues.betty.intro4":
    "Ei, ei! Estou ansiosa para saber se você trouxe os ingredientes que pedi. Mostre-me o que você tem!",
  "npcDialogues.betty.intro5":
    "Saudações, meu amigo de dedo verde! Estou animada para ver se você trouxe os ingredientes que pedi. O que tem na sua cesta?",
  // Betty Positive Delivery
  "npcDialogues.betty.positiveDelivery1":
    "Uhu! Você trouxe os ingredientes que pedi. Eles estão frescos e vibrantes como podem ser. Obrigada, meu gênio da jardinagem!",
  "npcDialogues.betty.positiveDelivery2":
    "É disso que estou falando! Você conseguiu os ingredientes exatos que eu precisava. Você alegrau meu dia com sua entrega rápida. Obrigada!",
  "npcDialogues.betty.positiveDelivery3":
    "Ah, fantástico! Estes são os ingredientes exatos que pedi. O mercado estará agitado de excitação. Obrigada pelo seu trabalho duro!",
  "npcDialogues.betty.positiveDelivery4":
    "Oh, meu jardim! Estes ingredientes estão absolutamente perfeitos. Você tem talento para encontrar os melhores produtos. Obrigada, meu herói de dedo verde!",
  "npcDialogues.betty.positiveDelivery5":
    "Bravo! Você trouxe os ingredientes exatos que eu precisava. Mal posso esperar para usá-los para criar algo extraordinário. Obrigada pela sua entrega rápida!",
  // Betty Negative Delivery
  "npcDialogues.betty.negativeDelivery1":
    "Oops! Parece que você não tem os ingredientes que pedi. Sem problemas, porém. Continue procurando, e encontraremos outra oportunidade.",
  "npcDialogues.betty.negativeDelivery2":
    "Ah, não! Parece que você não tem os ingredientes de que preciso no momento. Mas não se preocupe. Acredito na sua engenhosidade. Volte quando tiver o que estou procurando!",
  "npcDialogues.betty.negativeDelivery3":
    "Ah, droga! Parece que você não tem os ingredientes que estou procurando agora. Continue procurando! Talvez na próxima vez tenhamos mais sorte.",
  "npcDialogues.betty.negativeDelivery4":
    "Oh, que pena! Parece que os ingredientes que você trouxe não correspondem ao que eu preciso. Mas não desanime; continue trabalhando e volte em breve.",
  "npcDialogues.betty.negativeDelivery5":
    "Oh, que decepção! Parece que você não tem os ingredientes exatos que estou procurando. Mas não se preocupe, meu amigo. Continue trabalhando duro, e vamos comemorar quando você os encontrar!",
  // Betty NoOrder
  "npcDialogues.betty.noOrder1":
    "Sem pedido ativo para eu cumprir agora, mas isso não me impede de oferecer as melhores sementes e colheitas para você. Entre e vejamos o que você está procurando!",
  "npcDialogues.betty.noOrder2":
    "Nenhum pedido específico de mim hoje, mas isso não é um problema. Estou aqui com um pulo no passo, pronto para lhe fornecer as melhores sementes e comprar suas deliciosas colheitas!",
  // Grimbly Intro
  "npcDialogues.grimbly.intro1":
    "Com fome. Preciso de comida. Tem algo saboroso para um goblin faminto?",
  "npcDialogues.grimbly.intro2":
    "Goblin faminto precisa de sustento. Você tem o que eu preciso?",
  "npcDialogues.grimbly.intro3":
    "Goblin faminto aqui. Tem algo delicioso para eu devorar?",
  "npcDialogues.grimbly.intro4":
    "Grimbly está com fome. Você trouxe algo saboroso para mim?",
  // Grimbly Positive Delivery
  "npcDialogues.grimbly.positiveDelivery1":
    "Ah, finalmente! Algo delicioso para saciar minha fome. Você é um salva-vidas, meu amigo!",
  "npcDialogues.grimbly.positiveDelivery2":
    "Você trouxe comida! A fome de Grimbly está saciada. Obrigado, obrigado!",
  "npcDialogues.grimbly.positiveDelivery3":
    "Uhu! Você trouxe comida para encher minha barriga faminta. Grimbly aprecia sua generosidade!",
  "npcDialogues.grimbly.positiveDelivery4":
    "Um banquete para Grimbly! Você trouxe exatamente o que eu precisava. Sua gentileza não será esquecida!",
  // Grimbly Negative Delivery
  "npcDialogues.grimbly.negativeDelivery1":
    "Sem comida? Grimbly ainda com fome. Encontre comida, traga comida. Grimbly agradecido.",
  "npcDialogues.grimbly.negativeDelivery2":
    "Sem comida para Grimbly? A barriga de Grimbly ronca. Volte quando encontrar algo saboroso.",
  "npcDialogues.grimbly.negativeDelivery3":
    "Grimbly ainda com fome. Sem comida? Continue procurando, e talvez da próxima vez você satisfaça meu apetite de goblin.",
  "npcDialogues.grimbly.negativeDelivery4":
    "De mãos vazias? O estômago de Grimbly ronca. Continue procurando, e não se esqueça da fome de um goblin!",
  // Grimbly NoOrder
  "npcDialogues.grimbly.noOrder1":
    "Grimbly não tem um pedido ativo para você, mas isso não significa que eu não esteja com fome!",
  "npcDialogues.grimbly.noOrder2":
    "Nenhum pedido ativo do Grimbly hoje, mas não tema! Estou sempre de olho em guloseimas saborosas. Se você encontrar algo delicioso, já sabe para quem trazer!",
  // Grimtootk Intro
  "npcDialogues.grimtooth.intro1":
    "Saudações, viajante cansado. Está me procurando, está?",
  "npcDialogues.grimtooth.intro2":
    "Pise no reino das sombras. Você cumpriu meu pedido?",
  "npcDialogues.grimtooth.intro3":
    "Bem-vindo, viajante, ao meu reino místico. Você tem o que eu preciso?",
  "npcDialogues.grimtooth.intro4":
    "Passe adiante, caro viajante, e descubra os segredos que acumulei. Você encontrou o que eu pedi?",
  // Grimtooth Positive Delivery
  "npcDialogues.grimtooth.positiveDelivery1":
    "Incrível! Você encontrou os ingredientes que eu preciso. A magia de Sunflorea está ao seu alcance!",
  "npcDialogues.grimtooth.positiveDelivery2":
    "Maravilhoso! Você adquiriu o que eu procurava. Juntos, exploraremos as profundezas mais profundas da magia!",
  "npcDialogues.grimtooth.positiveDelivery3":
    "Incrível! Você reuniu os componentes místicos que eu exigia. Sua jornada no reino da magia começa!",
  "npcDialogues.grimtooth.positiveDelivery4":
    "Ah, esplêndido! Você obteve os ingredientes elusivos que eu procurava. Sua jornada no reino da magia começa!",
  // Grimtooth Negative Delivery
  "npcDialogues.grimtooth.negativeDelivery1":
    "Os ingredientes necessários te escapam. Não tema, porém. Continue procurando, e os mistérios se revelarão!",
  "npcDialogues.grimtooth.negativeDelivery2":
    "Oh, trevas e tristeza. Você não possui o que eu preciso. Mas não se preocupe; continue trabalhando e as sombras continuarão a guiá-lo.",
  "npcDialogues.grimtooth.negativeDelivery3":
    "Não tema, porém. Continue seu trabalho, e a magia se manifestará.",
  "npcDialogues.grimtooth.negativeDelivery4":
    "Oh. Você não possui o que eu preciso. Volte quando o fizer.",
  // Grimtooth NoOrder
  "npcDialogues.grimtooth.noOrder1":
    "Nenhum pedido ativo do GrimTooth no momento, mas não se preocupe. Se você precisar de um artesanato requintado ou tiver materiais para eu trabalhar, estarei aqui, pronto para criar.",
  "npcDialogues.grimtooth.noOrder2":
    "Nenhum pedido específico para você atender com o GrimTooth no momento, mas se precisar do toque do mestre artesão ou tiver materiais que precisam ser transformados, estou à sua disposição.",
  // Old Salty Intro
  "npcDialogues.oldSalty.intro1":
    "Arghhhh, bem-vindo, meu coração! Old Salty é o nome, e tesouro é o meu jogo. Você tem o que procuro?",
  "npcDialogues.oldSalty.intro2":
    "Ahoy, marinheiro em terra! Old Salty é o entusiasta do tesouro que você está procurando. Mostre-me o que você encontrou em sua jornada?",
  "npcDialogues.oldSalty.intro3": "",
  // Old Salty Positive Delivery
  "npcDialogues.oldSalty.positiveDelivery1":
    "Arghhhh, você encontrou o tesouro que eu procurava. Você tem o coração de um verdadeiro aventureiro, meu amigo!",
  "npcDialogues.oldSalty.positiveDelivery2":
    "Avante! Você trouxe o tesouro exato que Old Salty deseja. Você está ganhando meu respeito, meu valente!",
  "npcDialogues.oldSalty.positiveDelivery3":
    "Ahoy, você encontrou o tesouro que Old Salty estava caçando. Você é uma verdadeira lenda nestas águas, meu valente!",
  // Olkd Salty Negative Delivery
  "npcDialogues.oldSalty.negativeDelivery1":
    "Arrrr, nenhum tesouro para Old Salty? Continue de olhos abertos, meu coração. As gemas escondidas aguardam sua descoberta!",
  "npcDialogues.oldSalty.negativeDelivery2":
    "Ah, patife! Nenhum tesouro para Old Salty? Continue procurando, e você encontrará as riquezas que procura!",
  "npcDialogues.oldSalty.negativeDelivery3":
    "Santos céus! Nenhum tesouro para Old Salty? Continue navegando, meu amigo. O saque está lá fora, esperando por você!",
  // Old Salty NoOrder
  "npcDialogues.oldSalty.noOrder1":
    "Nenhum pedido ativo para o covil de tesouros do Old Salty, meu coração, mas isso não significa que não há aventura a ser vivida. Mantenha os olhos abertos para tesouros escondidos e águas desconhecidas!",
  "npcDialogues.oldSalty.noOrder2":
    "Nenhum tesouro específico para você buscar com o Old Salty no momento, mas não tema, meu valente marinheiro! Os mares revoltos guardam inúmeras riquezas esperando para serem descobertas.",
  // Raven Intro
  "npcDialogues.raven.intro1":
    "Bem-vindo à minha humilde morada. Cuidado onde pisa; há poções sendo preparadas. Você trouxe o que eu pedi?",
  "npcDialogues.raven.intro2":
    "Pise no reino das sombras. Busque sabedoria, encontre encantamento. Você tem o que eu preciso?",
  "npcDialogues.raven.intro3":
    "Bem-vindo, viajante, ao meu reino místico. Procurando algo mágico, está? Ou você tem o que eu preciso?",
  "npcDialogues.raven.intro4":
    "Passe adiante, caro viajante. As sombras vão guiá-lo. Você encontrou o que eu procuro?",
  // Raven Positive Delivery
  "npcDialogues.raven.positiveDelivery1":
    "Incrível! Você encontrou os ingredientes que eu preciso. A magia de Sunflorea está ao seu alcance!",
  "npcDialogues.raven.positiveDelivery2":
    "Maravilhoso! Você adquiriu o que eu procurava. Juntos, exploraremos as profundezas mais profundas da magia!",
  "npcDialogues.raven.positiveDelivery3":
    "Incrível! Você reuniu os componentes místicos que eu exigia. Sua jornada no reino da magia começa!",
  "npcDialogues.raven.positiveDelivery4":
    "Ah, esplêndido! Você obteve os ingredientes elusivos que eu procurava. Sua jornada no reino da magia começa!",
  // Raven Negative Delivery
  "npcDialogues.raven.negativeDelivery1":
    "Ai, os ingredientes necessários escapam de você. Não tema, porém. Continue procurando, e os mistérios se revelarão!",
  "npcDialogues.raven.negativeDelivery2":
    "Oh, escuridão e desânimo. Você não possui o que eu preciso. Mas não se preocupe; as sombras vão te guiar até lá.",
  "npcDialogues.raven.negativeDelivery3":
    "Não tema, contudo. Continue sua busca, e a magia se manifestará.",
  // Raven NoOrder
  "npcDialogues.raven.noOrder1":
    "Parece que não há nenhum pedido ativo aguardando sua chegada em meu domínio sombrio. No entanto, se você precisar de orientação ou tiver perguntas sobre as artes místicas, não hesite em perguntar.",
  "npcDialogues.raven.noOrder2":
    "Sem pedido ativo de mim, viajante. Mas não se preocupe! As sombras estão sempre atentas, e quando chegar a hora certa, vamos mergulhar nas profundezas da magia juntos.",
  // Tywin Intro
  "npcDialogues.tywin.intro1":
    "Ah, outro plebeu em minha presença. Você tem o que eu quero? Fale rápido.",
  "npcDialogues.tywin.intro2":
    "Oh, ótimo, mais um da plebe. Qual é o seu negócio com alguém da minha estatura? Você tem o que eu preciso?",
  "npcDialogues.tywin.intro3":
    "Saudações, plebeu. Buscando sabedoria, está? Você tem tudo o que eu pedi?",
  "npcDialogues.tywin.intro4":
    "O que você quer? Fale rápido; tempo é dinheiro. Você tem o que eu preciso, eu suponho?",
  // Tywin Positive Delivery
  "npcDialogues.tywin.positiveDelivery1":
    "Hmm, parece que você não é totalmente inútil. Você conseguiu trazer o que eu queria. Continue, camponês!",
  "npcDialogues.tywin.positiveDelivery2":
    "Surpreendentemente, você realmente entregou o que eu desejava. Talvez você não seja tão inútil quanto eu presumia.",
  "npcDialogues.tywin.positiveDelivery3":
    "Ah, trabalho maravilhoso! Você trouxe os materiais que eu preciso. Juntos, vamos criar obras-primas!",
  "npcDialogues.tywin.positiveDelivery4":
    "Bom. Você entregou os materiais que eu preciso. Igor não vai decepcionar; as ferramentas serão notáveis.",
  // Tywin Negative Delivery
  "npcDialogues.tywin.negativeDelivery1":
    "Patético. Você não tem o que eu pedi. Não perca meu tempo com sua incompetência. Saia!",
  "npcDialogues.tywin.negativeDelivery2":
    "Que decepção. Você não tem o que eu pedi. Típico de sua espécie. Agora, suma daqui!",
  "npcDialogues.tywin.negativeDelivery3":
    "Insatisfatório. Você não possui o que eu exijo. Não tenho tempo para incompetência. Volte quando estiver capaz.",
  "npcDialogues.tywin.negativeDelivery4":
    "Incompetência. Você falta com os materiais necessários. Não perca meu tempo; volte quando estiver preparado.",
  // Tywin NoOrder
  "npcDialogues.tywin.noOrder1":
    "Ah, parece que não tenho um pedido ativo esperando por você aqui, plebeu. Mas se você precisar da minha presença ilustre ou tiver um pedido, declare rapidamente. Tempo é dinheiro, afinal de contas.",
  "npcDialogues.tywin.noOrder2":
    "Nenhum pedido ativo para você hoje, camponês. No entanto, se você tropeçar em algo digno da minha atenção ou precisar da minha expertise, você sabe onde me encontrar.",
  // Bert Intro
  "npcDialogues.bert.intro1":
    "Psst! Explorador! Os vastos segredos de Sunflorea são inúmeros...",
  "npcDialogues.bert.intro2":
    "Ah, espírito afim! Sunflorea é lar de inúmeros tesouros...",
  "npcDialogues.bert.intro3":
    "Saudações, portador do misterioso! Em Sunflorea, alguns itens demandam Entrega...",
  "npcDialogues.bert.intro4":
    "Olá, buscador do oculto! Os encantos de Sunflorea podem ser categorizados em dois...",
  "bert.day": ENGLISH_TERMS["bert.day"],
  // Bert Positive Delivery
  "npcDialogues.bert.positiveDelivery1":
    "Incrível! Você trouxe tudo o que eu preciso...",
  "npcDialogues.bert.positiveDelivery2":
    "Oh, descoberta fascinante! Você trouxe os itens exatos que eu procurava...",
  "npcDialogues.bert.positiveDelivery3":
    "Ah, era hora! Você adquiriu os itens exatos que eu procurava. Excelente!",
  "npcDialogues.bert.positiveDelivery4":
    "Impressionante! Você trouxe exatamente o que eu preciso para desvendar os segredos de Sunflorea.",
  // Bert Negative Delivery
  "npcDialogues.bert.negativeDelivery1":
    "Oh, alas. Você não possui o que procuro. Continue explorando, nos veremos quando você tiver o que eu preciso!",
  "npcDialogues.bert.negativeDelivery2":
    "Caramba! O que você tem não é exatamente o que eu preciso. Continue trabalhando no meu pedido, e juntos, desvendaremos os mistérios!",
  "npcDialogues.bert.negativeDelivery3":
    "Hmm, não é exatamente o que eu esperava. Mas não tema! Ainda há tempo para você me trazer o que eu preciso.",
  "npcDialogues.bert.negativeDelivery4":
    "Oh, não é exatamente o que eu procurava. Volte quando você tiver isso. Mas mantenha os olhos abertos; as páginas da história têm mais a revelar.",
  // Bert NoOrder
  "npcDialogues.bert.noOrder1":
    "Sem pedido ativo para eu cumprir hoje, mas isso não significa que eu não tenha segredos intrigantes para compartilhar.",
  "npcDialogues.bert.noOrder2":
    "Nenhum artefato enigmático para você descobrir com Bert no momento, mas isso não significa que eu esteja com poucas informações peculiares e verdades escondidas.",
  // Timmy Intro
  "npcDialogues.timmy.intro1":
    "E aí, amigo! É o Timmy, e estou ansioso para ver se você tem o que eu pedi.",
  "npcDialogues.timmy.intro2":
    "Saudações, companheiro aventureiro! Timmy aqui, perguntando se você encontrou o que eu pedi.",
  "npcDialogues.timmy.intro3":
    "Bem-vindo, bem-vindo! Eu sou o Timmy, o rosto mais amigável da praça. Você pode me ajudar verificando se você tem o que eu preciso?",
  "npcDialogues.timmy.intro4":
    "Ei, ei! Pronto para se divertir no sol? É o Timmy, e mal posso esperar para ver se você tem o que eu pedi.",
  "npcDialogues.timmy.intro5":
    "Olá, brilho do sol! Timmy aqui, esperando que você tenha o que eu pedi. Vamos ver?",
  // Timmy Positive Delivery
  "npcDialogues.timmy.positiveDelivery1":
    "Uhu! Você tem exatamente o que eu precisava. Sua generosidade enche meu coração de alegria. Obrigado!",
  "npcDialogues.timmy.positiveDelivery2":
    "É disso que estou falando! Você trouxe exatamente o que eu estava procurando. Você é uma estrela!",
  "npcDialogues.timmy.positiveDelivery3":
    "Ah, fantástico! Sua hora não poderia ser melhor. Você me fez o dia com sua oferta atenciosa. Obrigado!",
  "npcDialogues.timmy.positiveDelivery4":
    "Urra! Você entregou as mercadorias. Sunflorea tem sorte de ter alguém tão incrível como você!",
  "npcDialogues.timmy.positiveDelivery5":
    "Você fez de novo! Sua bondade e generosidade nunca deixam de me surpreender. Obrigado por alegrar a praça!",
  // Timmy Negative Delivery
  "npcDialogues.timmy.negativeDelivery1":
    "Ops! Parece que você não tem o que estou procurando no momento. Sem problemas, porém. Continue explorando, e encontraremos outra oportunidade.",
  "npcDialogues.timmy.negativeDelivery2":
    "Oh, não! Parece que você não tem o que eu preciso no momento. Mas não se preocupe. Eu acredito em você. Volte quando encontrar!",
  "npcDialogues.timmy.negativeDelivery3":
    "Ah, droga! Você não tem o que eu procuro agora. Continue explorando! Talvez na próxima vez você tropece no que eu preciso.",
  "npcDialogues.timmy.negativeDelivery4":
    "Ah, que pena! Parece que você não tem o item que estou procurando. Mas não desista; novas oportunidades esperam logo ali.",
  "npcDialogues.timmy.negativeDelivery5":
    "Ah, crisântemos! Você não tem o que estou procurando. Mas não se preocupe, meu amigo. Continue explorando, e celebraremos quando você encontrar!",
  // Timmy NoOrder
  "npcDialogues.timmy.noOrder1":
    "Ah, oi! Não tenho nenhum pedido ativo para você cumprir agora, mas estou sempre ansioso para aprender e ouvir histórias. Tem alguma história emocionante sobre suas aventuras em Sunflorea? Ou talvez você tenha encontrado um novo amigo urso? Compartilhe comigo!",
  "npcDialogues.timmy.noOrder2":
    "Nenhum pedido específico para eu cumprir no momento, mas isso não vai me impedir de ficar curioso! Você tem alguma história interessante sobre suas viagens? Talvez você tenha encontrado um urso raro ou descoberto uma joia escondida em Sunflorea? Vamos conversar!",
  // Cornwell Intro
  "npcDialogues.cornwell.intro1":
    "Saudações, jovem aventureiro! Você veio trazendo os itens que procuro?",
  "npcDialogues.cornwell.intro2":
    "Ah, bem-vindo, buscador de conhecimento e relíquias! Você tem os itens que eu pedi? Mostre-me o que você tem.",
  "npcDialogues.cornwell.intro3":
    "Adentre o reino dos segredos e sabedoria antigas. Você adquiriu os itens que desejo? Compartilhe suas descobertas comigo, jovem.",
  "npcDialogues.cornwell.intro4":
    "Ah, é você! O que está em uma nobre busca. Você encontrou os itens que procuro? Venha, me mostre o que você descobriu nas vastas terras de Sunflower Land.",
  "npcDialogues.cornwell.intro5":
    "Saudações, jovem viajante! Os ventos da curiosidade te trouxeram aqui. Você tem os itens que preciso para enriquecer minha coleção?",
  // Cornwell Positive Delivery
  "npcDialogues.cornwell.positiveDelivery1":
    "Maravilhoso! Você trouxe as relíquias que eu desejava. Seus esforços em preservar a história de Sunflower Land serão lembrados.",
  "npcDialogues.cornwell.positiveDelivery2":
    "Ah, esplêndido! Suas descobertas se alinham perfeitamente com as relíquias que eu procurava. Esses tesouros acrescentarão grande sabedoria à minha coleção.",
  "npcDialogues.cornwell.positiveDelivery3":
    "Impressionante! Os itens que você adquiriu são exatamente o que eu procurava. A história de Sunflower Land brilhará através deles.",
  "npcDialogues.cornwell.positiveDelivery4":
    "Ah, jovem aventureiro, você superou minhas expectativas! Os itens que você trouxe serão inestimáveis para minha pesquisa.",
  "npcDialogues.cornwell.positiveDelivery5":
    "Ah, muito bem, meu amigo de olhos atentos! Os itens que você entregou encontrarão um lugar de honra na coleção do meu moinho de vento.",
  // Cornwell Negative Delivery
  "npcDialogues.cornwell.negativeDelivery1":
    "Oh, parece que você não encontrou os itens que procuro. Não tema; a jornada de descoberta continua. Continue explorando os mistérios de Sunflower Land.",
  "npcDialogues.cornwell.negativeDelivery2":
    "Hmm, não são exatamente as relíquias que eu esperava. Mas não se desespere! Continue procurando, e os tesouros de Sunflower Land se revelarão para você.",
  "npcDialogues.cornwell.negativeDelivery3":
    "Oh, parece que os itens que eu desejava escapam de você. Não importa; sua curiosidade o levará às descobertas certas eventualmente.",
  "npcDialogues.cornwell.negativeDelivery4":
    "Ah, vejo que você não encontrou os itens específicos que eu preciso. Não se preocupe; a história de Sunflower Land guarda muitos segredos esperando para serem desenterrados.",
  "npcDialogues.cornwell.negativeDelivery5":
    "Oh, meu querido viajante, parece que você não trouxe os itens exatos que eu procurava. Mas sua dedicação à história de Sunflower Land é louvável.",
  // Cornwell NoOrder
  "npcDialogues.cornwell.noOrder1":
    "Ah, parece que não há itens de missão para você entregar no momento. Mas não fique desanimado! Sua jornada em Sunflower Land está cheia de aventuras não contadas esperando para serem descobertas.",
  "npcDialogues.cornwell.noOrder2":
    "Oh, parece que não tenho necessidade de seus serviços no momento. Mas não se preocupe; as páginas da história de Sunflower Land giram sem parar, e novas missões certamente surgirão.",
  "npcDialogues.cornwell.noOrder3":
    "Ah, minhas desculpas, mas não tenho nada para você cumprir agora. Não tema, porém; seu caminho como buscador de conhecimento certamente o levará a novas missões em breve.",
  "npcDialogues.cornwell.noOrder4":
    "Ah, parece que você não recebeu nenhum pedido meu no momento. Mas não perca a esperança; sua natureza inquisitiva logo o guiará para emocionantes novas missões em Sunflower Land.",
  // Pumpkin Pete Intro
  "npcDialogues.pumpkinPete.intro1":
    "Estive esperando por você, meu amigo! Você tem meu pedido pronto?",
  "npcDialogues.pumpkinPete.intro2":
    "E aí, abóbora! Estive ocupado guiando as Cucurbitáceas pela praça? Você conseguiu meu pedido?",
  "npcDialogues.pumpkinPete.intro3":
    "Saudações, amigo! A praça está cheia de excitação hoje. Você conseguiu pegar meu pedido?",
  "npcDialogues.pumpkinPete.intro4":
    "Olá, aventureiro! O que te traz à minha humilde morada? Você conseguiu meu pedido?",
  "npcDialogues.pumpkinPete.intro5":
    "Ei, ei! Bem-vindo à praça! Você conseguiu encontrar o que eu precisava?",
  // Pumpkin Pete Positive Delivery
  "npcDialogues.pumpkinPete.positiveDelivery1":
    "Urra! Você trouxe exatamente o que eu preciso. Você é um verdadeiro herói da praça!",
  "npcDialogues.pumpkinPete.positiveDelivery2":
    "Abobrastic! Você trouxe exatamente o que eu precisava. Você está tornando nossa pequena comunidade mais brilhante!",
  "npcDialogues.pumpkinPete.positiveDelivery3":
    "Grandes sementes de alegria! Você trouxe exatamente o que eu precisava. A praça tem sorte de ter você!",
  "npcDialogues.pumpkinPete.positiveDelivery4":
    "Fantástico! Você chegou trazendo exatamente o que eu desejava. Sua bondade espalha o sol em nossa praça!",
  "npcDialogues.pumpkinPete.positiveDelivery5":
    "Oh, sementes de abóbora de alegria! Você me trouxe exatamente o que eu precisava. A praça agradece sua ajuda!",
  // Pumpkin Pete Negative Delivery
  "npcDialogues.pumpkinPete.negativeDelivery1":
    "Oh, não. Parece que você não tem o que estou procurando. Não se preocupe, porém. Eu acredito em você. Volte quando encontrar!",
  "npcDialogues.pumpkinPete.negativeDelivery2":
    "Ah, droga! Parece que você não tem o que estou procurando no momento. Continue explorando, porém! Talvez na próxima vez.",
  "npcDialogues.pumpkinPete.negativeDelivery3":
    "Oh! Você não tem o que estou procurando. Mas não desista; novas oportunidades brotam todos os dias!",
  "npcDialogues.pumpkinPete.negativeDelivery4":
    "Oh! Você não tem o que estou procurando agora. Continue explorando, porém! Estou confiante de que você vai encontrar.",
  "npcDialogues.pumpkinPete.negativeDelivery5":
    "Oops! Você não tem o que estou procurando. Mas não se preocupe, meu amigo. Continue explorando, e vamos comemorar quando você encontrar.",
  // Pumpkin Pete NoOrder
  "npcDialogues.pumpkinPete.noOrder1":
    "Ah, meu amigo, parece que não tenho um pedido ativo para você no momento. Mas não tema! Estou sempre aqui para oferecer orientação e um sorriso amigável de abóbora.",
  "npcDialogues.pumpkinPete.noOrder2":
    "Ah, nenhum pedido ativo para você hoje, meu amigo. Mas não se preocupe! Sinta-se à vontade para explorar a praça, e se precisar de alguma assistência, estou aqui como seu confiável Bumpkin.",

  // NPC gift dialogues
  "npcDialogues.pumpkinPete.reward":
    "Muito obrigado pelas suas entregas. Aqui está um símbolo de apreço para você.",
  "npcDialogues.pumpkinPete.flowerIntro":
    "Você já viu a elegância de um Cosmos Amarelo? Estou desejando um...",
  "npcDialogues.pumpkinPete.averageFlower":
    "Não é exatamente o que eu tinha em mente, mas é bastante encantador. Obrigado.",
  "npcDialogues.pumpkinPete.badFlower":
    "Isso não é o que eu esperava. Talvez você possa encontrar uma opção mais adequada?",
  "npcDialogues.pumpkinPete.goodFlower":
    "Este Cosmos Amarelo é esplêndido! Obrigado por trazê-lo para mim.",

  "npcDialogues.betty.reward":
    "Agradeço seus presentes atenciosos. Aqui está um pequeno gesto para mostrar minha gratidão.",
  "npcDialogues.betty.flowerIntro":
    "Você consegue imaginar a beleza de uma Pansy Vermelha, Amarela, Roxa, Branca ou Azul? Estou desejando uma...",
  "npcDialogues.betty.averageFlower":
    "Não é exatamente o que eu esperava, mas é bastante adorável. Obrigado.",
  "npcDialogues.betty.badFlower":
    "Isso não é o que eu tinha em mente. Você poderia tentar encontrar uma flor mais adequada?",
  "npcDialogues.betty.goodFlower":
    "Esta Pansy é linda! Obrigado por trazê-la para mim.",

  "npcDialogues.blacksmith.reward":
    "Suas entregas são muito apreciadas. Aqui está algo pelos seus esforços.",
  "npcDialogues.blacksmith.flowerIntro":
    "Estou precisando de um Cravo Vermelho vibrante. Você já encontrou um?",
  "npcDialogues.blacksmith.averageFlower":
    "Não é exatamente o que eu esperava, mas é bastante agradável. Obrigado.",
  "npcDialogues.blacksmith.badFlower":
    "Esta flor não está certa. Você poderia procurar uma opção mais adequada?",
  "npcDialogues.blacksmith.goodFlower":
    "Ah, este Cravo Vermelho está perfeito! Obrigado por trazê-lo para mim.",

  "npcDialogues.bert.reward":
    "Obrigado por sua ajuda contínua. Aqui está um pequeno gesto de apreço.",
  "npcDialogues.bert.flowerIntro":
    "As flores de Lótus em Vermelho, Amarelo, Roxo, Branco ou Azul são verdadeiramente encantadoras. Você tem uma?",
  "npcDialogues.bert.averageFlower":
    "Isso não era o que eu tinha em mente, mas é bastante encantador. Obrigado.",
  "npcDialogues.bert.badFlower":
    "Esta não é a flor que eu precisava. Talvez outra busca seja necessária?",
  "npcDialogues.bert.goodFlower":
    "Este Lótus é exquisito! Obrigado por trazê-lo para mim.",

  "npcDialogues.finn.reward":
    "Suas contribuições são inestimáveis. Aqui está algo para expressar minha gratidão.",
  "npcDialogues.finn.flowerIntro":
    "Estou desejando um belo Cosmos em Branco ou Azul. Você consegue encontrar um?",
  "npcDialogues.finn.averageFlower":
    "Não é exatamente o que eu esperava, mas é bastante agradável. Obrigado.",
  "npcDialogues.finn.badFlower":
    "Esta flor não atende exatamente às minhas expectativas. Talvez outra tentativa?",
  "npcDialogues.finn.goodFlower":
    "Este Cosmos é deslumbrante! Obrigado por trazê-lo para mim.",

  "npcDialogues.finley.reward":
    "Obrigado por seus esforços. Aqui está um pequeno gesto de apreço por suas entregas.",
  "npcDialogues.finley.flowerIntro":
    "Um lindo Cravo Amarelo, como o que estou pensando, alegraria meu dia. Você já viu um?",
  "npcDialogues.finley.averageFlower":
    "Não é exatamente o que eu tinha em mente, mas é bastante encantador. Obrigado.",
  "npcDialogues.finley.badFlower":
    "Esta flor não está certa. Talvez outra opção seria mais adequada?",
  "npcDialogues.finley.goodFlower":
    "Esse Narciso é lindo! Obrigado por trazê-lo para mim.",

  "npcDialogues.corale.reward":
    "Suas entregas são muito apreciadas. Aqui está um pequeno gesto de apreço por seus esforços.",
  "npcDialogues.corale.flowerIntro":
    "Você já encontrou a radiante Pétala Prismática? É simplesmente encantadora...",
  "npcDialogues.corale.averageFlower":
    "Não é exatamente o que eu esperava, mas é bastante encantador. Obrigado.",
  "npcDialogues.corale.badFlower":
    "Isso não está exatamente do jeito que eu tinha em mente. Você poderia encontrar uma flor mais adequada?",
  "npcDialogues.corale.goodFlower":
    "Esta Pétala Prismática é exquisita! Obrigado por trazê-la para mim.",

  "npcDialogues.raven.reward":
    "Obrigado por suas entregas. Aqui está um pequeno gesto de apreço por seus esforços.",
  "npcDialogues.raven.flowerIntro":
    "Um roxo escuro é a cor da minha alma - você já viu algo assim?",
  "npcDialogues.raven.averageFlower":
    "Não é exatamente o que eu esperava, mas é bastante agradável. Obrigado.",
  "npcDialogues.raven.badFlower":
    "Esta flor não está exatamente certa. Talvez outra busca seja necessária?",
  "npcDialogues.raven.goodFlower":
    "Este Flor Roxo está perfeito! Obrigado por trazê-lo para mim.",

  "npcDialogues.miranda.reward":
    "Obrigado por seus esforços. Aqui está um pequeno gesto de apreço por suas entregas.",
  "npcDialogues.miranda.flowerIntro":
    "A vibração de uma flor Amarela certamente levantaria meu ânimo. Você viu alguma por aqui?",
  "npcDialogues.miranda.averageFlower":
    "Não é exatamente o que eu esperava, mas é bastante encantador. Obrigado.",
  "npcDialogues.miranda.badFlower":
    "Esta flor não está exatamente certa. Talvez outra opção seria mais adequada?",
  "npcDialogues.miranda.goodFlower":
    "Esta flor Amarela é adorável! Obrigado por trazê-la para mim.",

  "npcDialogues.cornwell.reward":
    "Obrigado por suas entregas. Aqui está um pequeno gesto de apreço por seus esforços.",
  "npcDialogues.cornwell.flowerIntro":
    "A visão de uma flor de Balão em Vermelho, Amarelo, Roxo, Branco ou Azul é verdadeiramente encantadora...",
  "npcDialogues.cornwell.averageFlower":
    "Não é exatamente o que eu esperava, mas é bastante encantador. Obrigado.",
  "npcDialogues.cornwell.badFlower":
    "Esta flor não está exatamente certa. Talvez outra busca seja necessária?",
  "npcDialogues.cornwell.goodFlower":
    "Esta flor de Balão é encantadora! Obrigado por trazê-la para mim.",

  "npcDialogues.tywin.reward":
    "Obrigado por suas entregas. Aqui está um pequeno gesto de apreço por seus esforços.",
  "npcDialogues.tywin.flowerIntro":
    "Você já ouviu falar da exquisita Primula Enigma ou da fascinante Celestial Frostbloom? Estou precisando de uma.",
  "npcDialogues.tywin.averageFlower":
    "Não é exatamente o que eu esperava, mas é bastante encantador. Obrigado.",
  "npcDialogues.tywin.badFlower":
    "Esta flor não está exatamente certa. Talvez outra opção seria mais adequada?",
  "npcDialogues.tywin.goodFlower":
    "Esta flor é simplesmente deslumbrante! Obrigado por trazê-la para mim.",

  "npcDialogues.default.flowerIntro":
    "Você tem uma flor para mim? Certifique-se de ser algo que eu goste.",
  "npcDialogues.default.averageFlower": "Uau, obrigado! Adoro esta flor!",
  "npcDialogues.default.badFlower":
    "Hmmmm, esta não é minha flor favorita. Mas acho que é o pensamento que conta.",
  "npcDialogues.default.goodFlower":
    "Esta é minha flor favorita! Muito obrigado!",
  "npcDialogues.default.reward":
    "Uau, obrigado Bumpkin. Aqui está um pequeno presente pela sua ajuda!",
  "npcDialogues.default.locked": "Por favor, volte amanhã.",
};

const nyeButton: Record<NyeButton, string> = {
  "plaza.magicButton.query":
    "Um botão mágico apareceu na praça. Você quer apertá-lo?",
};

const obsessionDialogue: Record<ObsessionDialogue, string> = {
  "obsessionDialogue.line1": ENGLISH_TERMS["obsessionDialogue.line1"],
  "obsessionDialogue.line2": ENGLISH_TERMS["obsessionDialogue.line2"],
  "obsessionDialogue.line3": ENGLISH_TERMS["obsessionDialogue.line3"],
  "obsessionDialogue.line4": ENGLISH_TERMS["obsessionDialogue.line4"],
  "obsessionDialogue.line5": ENGLISH_TERMS["obsessionDialogue.line5"],
};

const offer: Record<Offer, string> = {
  "offer.okxOffer": "Olá Agricultor, tenho uma oferta exclusiva OKX para você!",
  "offer.beginWithNFT": ENGLISH_TERMS["offer.beginWithNFT"],
  "offer.getStarterPack": "Obtenha o Pacote Inicial Agora",
  "offer.newHere": "Olá Agricultor, você parece novo por aqui!",
  "offer.getStarted": "Comece Agora",
  "offer.not.enough.BlockBucks": ENGLISH_TERMS["offer.not.enough.BlockBucks"],
};

const onboarding: Record<Onboarding, string> = {
  "onboarding.welcome": "Bem-vindo ao jogo descentralizado!",
  "onboarding.step.one": "Passo 1/3",
  "onboarding.step.two": "Passo 2/3 (Crie uma carteira)",
  "onboarding.step.three": "Passo 3/3 (Crie sua fazenda NFT)",
  "onboarding.intro.one":
    "Em suas jornadas, você ganhará NFTs raros que precisam ser protegidos. Para mantê-los seguros, você precisará de uma carteira Web3.",
  "onboarding.intro.two": "Para começar sua jornada, sua carteira receberá",
  "onboarding.cheer": "Você está quase lá!",
  "onboarding.form.one": "Preencha seus detalhes",
  "onboarding.form.two":
    "e enviaremos um NFT gratuito para você jogar. (Isso nos levará de 3 a 7 dias)",
  "onboarding.duplicateUser.one": "Já registrado!",
  "onboarding.duplicateUser.two":
    "Parece que você já se cadastrou para teste beta usando um endereço diferente. Apenas um endereço pode ser usado durante o teste beta.",
  "onboarding.starterPack": "Pacote Inicial",
  "onboarding.settingWallet": "Configurando sua carteira",
  "onboarding.wallet.one":
    "Existem muitos provedores de carteiras por aí, mas escolhemos a Sequence porque são fáceis de usar e seguros.",
  "onboarding.wallet.two":
    "Selecione um método de inscrição na janela pop-up e você estará pronto para começar. Nos vemos de volta aqui em apenas um minuto!",
  "onboarding.wallet.haveWallet": "Eu já tenho uma carteira",
  "onboarding.wallet.createButton": "Criar carteira",
  "onboarding.wallet.acceptButton": "Aceitar termos de serviço",
  "onboarding.buyFarm.title": "Compre sua fazenda!",
  "onboarding.buyFarm.one":
    "Agora que sua carteira está toda configurada, é hora de obter sua própria NFT de fazenda!",
  "onboarding.buyFarm.two":
    "Esta NFT armazenará com segurança todo o seu progresso em Sunflower Land e permitirá que você volte sempre para cuidar de sua fazenda.",
  "onboarding.wallet.already": "Eu já tenho uma carteira ",
};

const onCollectReward: Record<OnCollectReward, string> = {
  "onCollectReward.Missing.Seed": "Sementes em falta",
  "onCollectReward.Market": "Vá para o Mercado para comprar sementes.",
  "onCollectReward.Missing.Shovel": "Pá em falta",
  "onCollectReward.Missing.Shovel.description":
    ENGLISH_TERMS["onCollectReward.Missing.Shovel.description"],
};

const orderhelp: Record<OrderHelp, string> = {
  "orderhelp.Skip.hour": "Você só pode pular um pedido após 24 horas!",
  "orderhelp.New.Season":
    "Uma nova temporada se aproxima, as entregas serão temporariamente interrompidas.",
  "orderhelp.New.Season.arrival": "Novas entregas sazonais em breve.",
  "orderhelp.Wisely": "Escolha sabiamente!",
  "orderhelp.SkipIn": "Pular em",
  "orderhelp.NoRight": "Não Agora",
  "orderhelp.ticket.deliveries.closed":
    ENGLISH_TERMS["orderhelp.ticket.deliveries.closed"],
};

const pending: Record<Pending, string> = {
  "pending.calcul": "Os resultados estão sendo calculados.",
  "pending.comeback": "Volte mais tarde.",
};

const personHood: Record<PersonHood, string> = {
  "personHood.Details": "Falha ao Carregar Detalhes da Identidade",
  "personHood.Identify": "Sua identidade não pôde ser verificada",
  "personHood.Congrat": "Parabéns, sua identidade foi verificada!",
};

const pickserver: Record<Pickserver, string> = {
  "pickserver.server": "Escolha um servidor para entrar",
  "pickserver.full": "CHEIO",
  "pickserver.explore": "Explore ilhas de projetos personalizados.",
  "pickserver.built": "Você quer construir sua própria ilha?",
};

const piratechest: Record<PirateChest, string> = {
  "piratechest.greeting":
    "Ahoy, marinheiro! Prepare-se e volte mais tarde para um baú cheio de recompensas!",
  "piratechest.refreshesIn": "Baú será atualizado em",
  "piratechest.warning":
    "Ahoy! Este baú está cheio de tesouros dignos de um rei pirata, mas cuidado, apenas aqueles com uma pele de pirata podem abri-lo e reivindicar o tesouro dentro!",
};

const pirateQuest: Record<PirateQuest, string> = {
  "questDescription.farmerQuest1": "Colha 1000 Girassóis",
  "questDescription.fruitQuest1": "Colha 10 Mirtilos",
  "questDescription.fruitQuest2": "Colha 100 Laranjas",
  "questDescription.fruitQuest3": "Colha 750 Maçãs",
  "questDescription.pirateQuest1": "Cave 30 buracos",
  "questDescription.pirateQuest2": "Colete 10 Algas",
  "questDescription.pirateQuest3": "Colete 10 Pipis",
  "questDescription.pirateQuest4": "Colete 5 Corais",
  "piratequest.welcome":
    "Bem-vindo aos mares agitados da aventura, onde você será testado como um verdadeiro pirata. Parta em uma jornada para encontrar o saque mais rico e tornar-se o maior pirata a navegar pelos oceanos.",
  "piratequest.finestPirate":
    "Ahoy, você é o melhor pirata dos sete mares com seu saque!!",
};

const playerTrade: Record<PlayerTrade, string> = {
  "playerTrade.no.trade": "Nenhuma negociação disponível.",
  "playerTrade.max.item": "Oh não! Você atingiu o limite máximo de itens.",
  "playerTrade.Progress":
    "Por favor, armazene seu progresso na cadeia antes de continuar.",
  "playerTrade.transaction":
    "Oh oh! Parece que você tem uma transação em progresso.",
  "playerTrade.Please": "Por favor, aguarde 5 minutos antes de continuar.",
  "playerTrade.sold": "Vendido",
  "playerTrade.sale": "À venda: ",
  "playerTrade.title.congrat": "Parabéns, sua oferta foi adquirida",
};

const portal: Record<Portal, string> = {
  "portal.wrong": "Algo deu errado",
  "portal.unauthorised": "não autorizado",
  "portal.example.intro": ENGLISH_TERMS["portal.example.intro"],
  "portal.example.claimPrize": ENGLISH_TERMS["portal.example.claimPrize"],
  "portal.example.purchase": ENGLISH_TERMS["portal.example.purchase"],
};

const promo: Record<Promo, string> = {
  "promo.cdcBonus": "Bônus Crypto.com!",
  "promo.expandLand": "Expanda sua terra duas vezes para reivindicar 100 SFL.",
};

const purchaseableBaitTranslation: Record<PurchaseableBaitTranslation, string> =
  {
    "purchaseableBait.fishingLure.description":
      "Ótimo para pegar peixes raros!",
  };

const quest: Record<Quest, string> = {
  "quest.mint.free": "Acessório Grátis para mintar",
  "quest.equipWearable": "Equipe este acessório em seu Bumpkin",
  "quest.congrats": ENGLISH_TERMS["quest.congrats"],
};

const questions: Record<Questions, string> = {
  "questions.obtain.MATIC": "Como posso obter MATIC?",
  "questions.lowCash": "Com pouco dinheiro?",
};

const reaction: Record<Reaction, string> = {
  "reaction.bumpkin": "Nível 3 Bumpkin",
  "reaction.bumpkin.10": "Nível 10 Bumpkin",
  "reaction.bumpkin.30": "Nível 30 Bumpkin",
  "reaction.bumpkin.40": "Nível 40 Bumpkin",
  "reaction.sunflowers": "Colha 100.000 Girassóis",
  "reaction.crops": "Colha 10.000 culturas",
  "reaction.goblin": "Transforme-se em um Goblin",
  "reaction.crown": "Possua uma Coroa de Goblin",
};

const reactionBud: Record<ReactionBud, string> = {
  "reaction.bud.show": "Mostre seus Buds NFT",
  "reaction.bud.select": "Selecione um Bud para colocar na praça",
  "reaction.bud.noFound": "Nenhum Bud encontrado em seu inventário",
};

const refunded: Record<Refunded, string> = {
  "refunded.itemsReturned": "Seus itens foram devolvidos ao seu inventário",
  "refunded.goodLuck": "Boa sorte na próxima vez!",
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
  "removeKuebiko.title": "Remover Kuebiko",
  "removeKuebiko.description":
    "Esta ação removerá todas as suas sementes do seu inventário.",
  "removeKuebiko.removeSeeds": "Remover sementes",
};

const removeCropMachine: Record<RemoveCropMachine, string> = {
  "removeCropMachine.title": ENGLISH_TERMS["removeCropMachine.title"],
  "removeCropMachine.description":
    ENGLISH_TERMS["removeCropMachine.description"],
};

const resale: Record<Resale, string> = {
  "resale.actionText": "Revenda",
};

const resources: Record<Resources, string> = {
  "resources.recoversIn": "Recupera em:",
  "resources.boulder.rareMineFound": "Você encontrou uma pedra rara!",
  "resources.boulder.advancedMining": "Mineração avançada a caminho.",
};

const restock: Record<Restock, string> = {
  "restock.one.buck":
    "Você vai usar 1 Block Buck para reabastecer todos os itens da loja no jogo.",
  "restock.sure": "Você tem certeza de que deseja reabastecer?",
  "restock.tooManySeeds": "Você tem muitas sementes em sua cesta!",
  "seeds.reachingInventoryLimit": ENGLISH_TERMS["seeds.reachingInventoryLimit"],
};

const retreatTerms: Record<RetreatTerms, string> = {
  "retreatTerms.lookingForRareItems": "Procurando por itens raros?",
  "retreatTerms.resale.one":
    "Os jogadores podem negociar itens especiais que criaram no jogo.",
  "retreatTerms.resale.two":
    "Você pode comprá-los em mercados secundários como OpenSea.",
  "retreatTerms.resale.three": "Veja os itens no OpenSea",
};

const rewardTerms: Record<RewardTerms, string> = {
  "reward.daily.reward": "Recompensa Diária",
  "reward.streak": " dias consecutivos",
  "reward.comeBackLater": "Volte mais tarde para mais recompensas",
  "reward.nextBonus": " Próximo bônus",
  "reward.unlock": "Desbloquear Recompensa",
  "reward.open": "Abrir recompensa",
  "reward.lvlRequirement":
    "Você precisa estar no nível 3 para reivindicar recompensas diárias.",
  "reward.whatCouldItBe": "O que poderia ser?",
  "reward.streakBonus": "Bônus de sequência 3x",
  "reward.found": "Você encontrou",
  "reward.spendWisely": "Gaste com sabedoria.",
  "reward.wearable": "Um acessório para o seu Bumpkin",
  "reward.promo.code": "Insira seu código promocional",
  "reward.woohoo": "Uhuu! Aqui está sua recompensa",
  "reward.connectWeb3Wallet":
    "Conecte uma Carteira Web3 para uma recompensa diária.",
  "reward.factionPoints": ENGLISH_TERMS["reward.factionPoints"],
};

const rulesGameStart: Record<RulesGameStart, string> = {
  "rules.gameStart":
    "No início do jogo, a planta escolherá aleatoriamente uma combinação de 4 poções e 1 poção 'caos'. A combinação pode ser toda diferente ou todas iguais.",
  "rules.chaosPotionRule":
    "Se você adicionar a poção 'caos', sua pontuação para essa tentativa será 0.",
  "rules.potion.feedback":
    "Selecione suas poções e desvende os segredos das plantas!",
  "BloomBoost.description": "Irradie suas plantas com flores vibrantes!",
  "DreamDrip.description": "Regue suas plantas com sonhos e fantasias mágicas.",
  "EarthEssence.description":
    "Aproveite o poder da terra para nutrir suas plantas.",
  "FlowerPower.description":
    "Libere uma explosão de energia floral sobre suas plantas.",
  "SilverSyrup.description":
    "Um xarope doce para trazer o melhor das suas plantas.",
  "HappyHooch.description":
    "Uma poção para trazer alegria e risadas para suas plantas.",
  "OrganicOasis.description":
    "Crie um paraíso orgânico exuberante para suas plantas.",
};

const rulesTerms: Record<RulesTerms, string> = {
  "game.rules": "Regras do Jogo",
  "rules.oneAccountPerPlayer": "1 conta por jogador",
  "rules.gameNotFinancialProduct":
    "Este é um jogo. Não é um produto financeiro.",
  "rules.noBots": "Sem bots ou automação",
  "rules.termsOfService": "Termos de Serviço",
};

const pwaInstall: Record<PwaInstall, string> = {
  "install.app": ENGLISH_TERMS["install.app"], // "Install App",
  "magic.link": ENGLISH_TERMS["magic.link"], // "Magic Link",
  "generating.link": ENGLISH_TERMS["generating.link"], // "Generating Link",
  "generating.code": ENGLISH_TERMS["generating.code"], // "Generating Code",
  "install.app.desktop.description":
    ENGLISH_TERMS["install.app.desktop.description"],
  // "Scan the code below to install on your device. Please be sure to open in either Safari or Chrome browser.",
  "install.app.mobile.metamask.description":
    ENGLISH_TERMS["install.app.mobile.metamask.description"],
  // "Copy the magic link below and open it in {{browser}} on your device to install!",
  "do.not.share.link": ENGLISH_TERMS["do.not.share.link"], // "Do not share this link!",
  "do.not.share.code": ENGLISH_TERMS["do.not.share.code"], // "Do not share this code!",
  "qr.code.not.working": ENGLISH_TERMS["qr.code.not.working"], // "QR code not working?",
};

const sceneDialogueKey: Record<SceneDialogueKey, string> = {
  "sceneDialogues.chefIsBusy": "O Chef está ocupado",
};

const seasonTerms: Record<SeasonTerms, string> = {
  "season.access": "Você tem acesso a",
  "season.banner": "Banner Sazonal",
  "season.bonusTickets": "Bônus de Bilhetes Sazonais",
  "season.boostXP": "+10% de EXP dos alimentos",
  "season.buyNow": "Comprar Agora",
  "season.discount": "Desconto de 25% em itens sazonais de Temporada!",
  "season.exclusiveOffer": "Oferta exclusiva!",
  "season.goodLuck": "Boa sorte na temporada!",
  "season.includes": "Inclui",
  "season.limitedOffer": " Somente por tempo limitado!",
  "season.wearableAirdrop": "Airdrop deVestíveis",
  "season.place.land": "Você deve colocá-lo em sua terra",
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
  "share.TweetText": "Visite Minha Fazenda Sunflower Land",
  "share.ShareYourFarmLink": "Compartilhe o Link da Sua Fazenda",
  "share.ShowOffToFarmers":
    "Mostre aos outros fazendeiros compartilhando o link da sua fazenda (URL: para visitar diretamente sua fazenda!",
  "share.FarmNFTImageAlt": "Imagem NFT da Fazenda Sunflower-Land",
  "share.CopyFarmURL": "Copiar URL da fazenda",
  "share.Tweet": "Tweetar",
  "share.chooseServer": "Escolha um servidor para entrar",
  "share.FULL": "CHEIO",
  "share.exploreCustomIslands": "Explore ilhas de projetos personalizados.",
  "share.buildYourOwnIsland": "Você quer construir sua própria ilha?",
};

const sharkBumpkinDialogues: Record<SharkBumpkinDialogues, string> = {
  "sharkBumpkin.dialogue.shhhh": "Shhhh!",
  "sharkBumpkin.dialogue.scareGoblins": "Estou tentando assustar os Goblins.",
};

const shelly: Record<Shelly, string> = {
  "shelly.Dialogue.one": "Olá, Bumpkin! Bem-vindo à praia!",
  "shelly.Dialogue.two":
    "Depois de um dia duro de trabalho na sua fazenda, não há lugar melhor para relaxar e aproveitar as ondas.",
  "shelly.Dialogue.three":
    "Mas temos um pequeno problema. Um kraken gigantesco emergiu e assumiu o controle de nossa amada praia.",
  "shelly.Dialogue.four":
    "Nós realmente precisamos da sua ajuda, querido. Pegue suas iscas e varas de pesca, e juntos, vamos enfrentar esse problema colossal!",
  "shelly.Dialogue.five":
    "Para cada tentáculo que você pegar, vou fornecer valiosas escamas de sereia!",
  "shelly.Dialogue.letsgo": "Vamos lá!",
};

const shellyDialogue: Record<ShellyDialogue, string> = {
  "shellyPanelContent.tasksFrozen":
    "Estou esperando o início da nova temporada. Volte para mim então!",
  "shellyPanelContent.canTrade":
    "Oh meu Deus, você conseguiu um Tentáculo de Kraken! Vou trocá-lo por algumas escamas de sereia.",
  "shellyPanelContent.cannotTrade":
    "Parece que você não tem nenhum Tentáculo de Kraken à mão! Volte quando tiver.",
  "shellyPanelContent.swap": "Trocar",
  "krakenIntro.congrats":
    "Bem feito! O Kraken parou de aterrorizar os Bumpkins.",
  "krakenIntro.noMoreTentacles":
    "Você coletou todos os tentáculos da semana. Vamos ficar de olho, tenho certeza de que a fome dele vai voltar.",
  "krakenIntro.gotIt": "Entendi!",
  "krakenIntro.appetiteChanges": "A fome do Kraken está sempre mudando.",
  "krakenIntro.currentHunger":
    "No momento, ele está com fome de... Ufa, isso é melhor do que Bumpkins.",
  "krakenIntro.catchInstruction":
    "Vá para o seu ponto de pesca e tente pegar a besta!",
};

const shopItems: Record<ShopItems, string> = {
  "betty.post.sale.one": "Ei, ei! Bem-vindo de volta.",
  "betty.post.sale.two":
    "Você ajudou a resolver a escassez de culturas e os preços voltaram ao normal.",
  "betty.post.sale.three": "É hora de passar para culturas maiores e melhores!",
  "betty.welcome": "Bem-vindo ao meu mercado. O que você gostaria de fazer?",
  "betty.buySeeds": "Comprar sementes",
  "betty.sellCrops": "Vender colheitas",
};

const showingFarm: Record<ShowingFarm, string> = {
  "showing.farm": "Mostrando na Fazenda",
  "showing.wallet": "Na Carteira",
};

const snorklerDialogues: Record<SnorklerDialogues, string> = {
  "snorkler.vastOcean": "É um oceano vasto!",
  "snorkler.goldBeneath": "Deve haver ouro em algum lugar sob a superfície.",
};

const somethingWentWrong: Record<SomethingWentWrong, string> = {
  "somethingWentWrong.supportTeam": "equipe de suporte",
  "somethingWentWrong.jumpingOver": "ou indo para o nosso",
  "somethingWentWrong.askingCommunity": "e pedindo ajuda à nossa comunidade.",
};

const specialEvent: Record<SpecialEvent, string> = {
  "special.event.easterIntro": ENGLISH_TERMS["special.event.easterIntro"],
  "special.event.rabbitsMissing": ENGLISH_TERMS["special.event.rabbitsMissing"],
  "special.event.link": ENGLISH_TERMS["special.event.link"],
  "special.event.claimForm":
    "Preencha o formulário abaixo para reivindicar seu airdrop.",
  "special.event.airdropHandling":
    "Os airdrops são tratados externamente e podem levar alguns dias para chegar.",
  "special.event.walletRequired": "Carteira Necessária",
  "special.event.web3Wallet":
    "Uma carteira Web3 é necessária para este evento, pois contém um Airdrop.",
  "special.event.airdrop": "Airdrop",
  "special.event.finishedLabel": ENGLISH_TERMS["special.event.finishedLabel"],
  "special.event.finished": ENGLISH_TERMS["special.event.finished"],
  "special.event.ineligible": ENGLISH_TERMS["special.event.ineligible"],
};

const statements: Record<Statements, string> = {
  "statements.adventure": "Inicie sua Aventura!",
  "statements.auctioneer.one":
    "Viajei longe e largo por Sunflower Land em busca de tesouros exóticos para trazer aos meus colegas Bumpkins.",
  "statements.auctioneer.two":
    "Não perca nenhum dos leilões onde um golpe do meu poderoso martelo pode transformar seus recursos suados em maravilhas raras!",
  "statements.beta.one": "O Beta é acessível apenas aos nossos fazendeiros OG.",
  "statements.beta.two":
    "Fique ligado para atualizações. Estaremos entrando ao vivo em breve!",
  "statements.better.luck": "Boa sorte na próxima vez!",
  "statements.blacklist.one":
    "O sistema de detecção de bots e contas múltiplas detectou comportamento estranho. As ações foram restritas.",
  "statements.blacklist.two":
    "Envie um ticket com detalhes e entraremos em contato com você.",
  "statements.clickBottle":
    "Clique em uma garrafa para adicionar ao seu palpite",
  "statements.clock.one":
    "Ops, parece que seu relógio não está sincronizado com o jogo. Configure data e hora para automático para evitar interrupções",
  "statements.clock.two":
    "Precisa de ajuda para sincronizar seu relógio? Dê uma olhada em nosso guia!",
  "statements.conversation.one": "Eu tenho algo para você!",
  "statements.cooldown":
    "Para proteger a comunidade, exigimos um período de espera de 2 semanas antes que esta fazenda possa ser acessada.",
  "statements.docs": "Ir para docs",
  "statements.dontRefresh": "Não atualize seu navegador!",
  "statements.guide.one": "Ir para o guia",
  "statements.guide.two": "Confira este guia para ajudá-lo a começar.",
  "statements.jigger.one":
    "Você será redirecionado para um serviço de terceiros para tirar uma selfie rápida. Nunca compartilhe informações pessoais ou dados criptográficos.",
  "statements.jigger.two": "Você falhou no Jigger Proof of Humanity.",
  "statements.jigger.three":
    "Você pode continuar jogando, mas algumas ações serão restritas enquanto você estiver sendo verificado.",
  "statements.jigger.four":
    "Entre em contato com support@usejigger.com se achar que isso foi um erro.",
  "statements.jigger.five":
    "Seu comprovante de humanidade ainda está sendo processado pelo Jigger. Isso pode levar até 2 horas.",
  "statements.jigger.six":
    "O sistema de detecção de contas múltiplas detectou comportamento estranho.",
  "statements.lvlUp": "Alimente seu Bumpkin para subir de nível",
  "statements.maintenance":
    "Coisas novas estão chegando! Obrigado pela sua paciência, o jogo estará de volta ao vivo em breve.",
  "statements.minted": "Os goblins criaram o seu",
  "statements.minting":
    "Por favor, tenha paciência enquanto o seu item é mintado na Blockchain.",
  "statements.mutant.chicken":
    "Parabéns, sua galinha pôs uma galinha mutante muito rara!",
  "statements.news":
    "Receba as últimas notícias, complete tarefas e alimente seu Bumpkin.",
  "statements.ohNo": "Oh não! Algo deu errado!",
  "statements.openGuide": "Abrir guia",
  "statements.patience": "Obrigado pela sua paciência.",
  "statements.potionRule.one":
    "Objetivo: Descubra a combinação. Você tem 3 tentativas para acertar. O jogo terminará se você tiver uma poção perfeita ou se ficar sem tentativas.",
  "statements.potionRule.two":
    "Escolha uma combinação de poções e tente misturá-las.",
  "statements.potionRule.three":
    "Ajuste sua próxima combinação com base no feedback recebido.",
  "statements.potionRule.four":
    "Quando o jogo estiver completo, a pontuação de sua última tentativa ajudará a determinar sua recompensa.",
  "statements.potionRule.five": "Uma poção perfeita na posição perfeita",
  "statements.potionRule.six": "Poção correta, mas posição errada",
  "statements.potionRule.seven": "Ops, poção errada",
  "statements.sflLim.one": "Você atingiu o limite diário de SFL.",
  "statements.sflLim.two":
    "Você pode continuar jogando, mas precisará esperar até amanhã para sincronizar novamente.",
  "statements.sniped":
    "Oh não! Outro jogador comprou esse comércio antes de você.",
  "statements.switchNetwork": "Adicionar ou Trocar de Rede",
  "statements.sync":
    "Por favor, tenha paciência enquanto sincronizamos todos os seus dados na cadeia.",
  "statements.tapCont": "Toque para continuar",
  "statements.price.change": "Oh não! O preço mudou, tente novamente.",

  "statements.tutorial.one":
    "O barco o levará entre as ilhas onde você pode descobrir novas terras e aventuras emocionantes.",
  "statements.tutorial.two":
    "Muitas terras estão longe e exigirão um Bumpkin experiente antes que você possa visitá-las.",
  "statements.tutorial.three":
    "Sua aventura começa agora, até onde você explora... isso depende de você.",
  "statements.visit.firePit":
    "Visite a Fogueira para cozinhar alimentos e alimentar seu Bumpkin.",
  "statements.wishing.well.info.four": "fornecer liquidez",
  "statements.wishing.well.info.five": " no jogo",
  "statements.wishing.well.info.six": "fornecendo liquidez",
  "statements.wishing.well.worthwell":
    ENGLISH_TERMS["statements.wishing.well.worthwell"],
  "statements.wishing.well.look.like":
    ENGLISH_TERMS["statements.wishing.well.look.like"],
  //  "It doesn't look like you are providing liquidity yet.",
  "statements.wishing.well.lucky": "Vamos ver o quão sortudo você é!",
  "statements.wrongChain.one": "Confira este guia para ajudá-lo a se conectar.",
  "statements.feed.bumpkin.one": "Você não tem comida em seu inventário.",
  "statements.feed.bumpkin.two":
    "Você precisará cozinhar comida para alimentar seu Bumpkin.",
  "statements.empty.chest": "Seu baú está vazio, descubra itens raros hoje!",
  "statements.chest.captcha": "Toque no baú para abri-lo",
  "statements.frankie.plaza": "Viaje para a praça para criar decorações raras!",
  "statements.blacksmith.plaza": "Viaje para a Praça para mais itens raros.",
  "statements.water.well.needed.one": "Poço de água adicional necessário.",
  "statements.water.well.needed.two":
    "Para suportar mais culturas, construa um poço.",
  "statements.soldOut": "Esgotado",
  "statements.soldOutWearables": "Ver wearables esgotados",
  "statements.craft.composter": "Produzir no Composter",
  "statements.wallet.to.inventory.transfer": "Deposite itens de sua carteira",
  "statements.crop.water": "Essas culturas precisam de água!",
  "statements.daily.limit": "Limite Diário: ",
  "statements.sure.buy": "Tem certeza de que deseja comprar",
  "statements.perplayer": "por Jogador",
  "statements.minted.goToChest": "Vá para o seu baú e coloque-o em sua ilha",
  "statements.minted.withdrawAfterMint":
    "Você poderá retirar seu item assim que o mint terminar",
  "statements.startgame": "Iniciar Novo Jogo",

  "statements.session.expired":
    "Parece que sua sessão expirou. Atualize a página para continuar jogando.",
  "statements.translation.joinDiscord":
    ENGLISH_TERMS["statements.translation.joinDiscord"],
};

const stopGoblin: Record<StopGoblin, string> = {
  "stopGoblin.stop.goblin": "Pare os Goblins!",
  "stopGoblin.stop.moon": "Pare os Caçadores de Lua!",
  "stopGoblin.tap.one":
    "Toque nos Caçadores de Lua antes que roubem seus recursos",
  "stopGoblin.tap.two": "Toque nos Goblins antes que comam sua comida",
  "stopGoblin.left": "Tentativas restantes: {{attemptsLeft}}",
};

const swarming: Record<Swarming, string> = {
  "swarming.tooLongToFarm":
    "Preste atenção, você demorou demais para cuidar de suas plantações!",
  "swarming.goblinsTakenOver":
    "Os Goblins tomaram conta da sua fazenda. Você deve esperar que saiam",
};

const tieBreaker: Record<TieBreaker, string> = {
  "tieBreaker.tiebreaker": "Desempate",
  "tieBreaker.closeBid":
    " Um desempate é escolhido pelo Bumpkin com mais experiência. Infelizmente, você perdeu.",
  "tieBreaker.betterLuck":
    "Hora de comer mais bolos! Boa sorte na próxima vez.",
  "tieBreaker.refund": "Reembolsar recurso",
};

const toolDescriptions: Record<ToolDescriptions, string> = {
  // Ferramentas
  "description.axe": "Usado para cortar madeira",
  "description.pickaxe": "Usado para minerar pedra",
  "description.stone.pickaxe": "Usado para minerar ferro",
  "description.iron.pickaxe": "Usado para minerar ouro",
  "description.gold.pickaxe": "Usado para minerar crimstone e sunstone",
  "description.rod": "Usado para pescar",
  "description.rusty.shovel": "Usado para remover construções e colecionáveis",
  "description.shovel": "Plantar e colher plantações.",
  "description.sand.shovel": "Usado para escavar tesouros",
  "description.sand.drill":
    "Perfurar profundamente por tesouros incomuns ou raros",
  "description.oil.drill": ENGLISH_TERMS["description.oil.drill"],
};

const trader: Record<Trader, string> = {
  "trader.you.pay": "Você paga",
  "trader.price.per.unit": "Preço por unidade",
  "trader.goblin.fee": "Taxa de Goblin",
  "trader.they.receive": "Eles recebem",
  "trader.seller.receives": "Vendedor recebe",
  "trader.buyer.pays": "Comprador paga",
  "trader.cancel.trade": "Cancelar troca",
  "trader.you.receive": "Você recebe",
  "trader.PoH":
    "A prova de humanidade é necessária para este recurso. Por favor, tire uma selfie rápida.",
  "trader.start.verification": "Iniciar verificação",
};

const transactionTerms: Record<TransactionTerms, string> = {
  "transaction.starterOffer": ENGLISH_TERMS["transaction.starterOffer"],
  "transaction.t&c.one":
    "Aceite os termos e condições para entrar no Sunflower Land.",
  "transaction.t&c.two": "Aceitar Termos e Condições",
  "transaction.mintFarm": "Sua fazenda foi mintada!",
  "transaction.farm.ready": "Sua fazenda estará pronta em",
  "transaction.networkFeeRequired":
    "Para garantir seus NFTs na Blockchain, é necessária uma pequena taxa de rede.",
  "transaction.estimated.fee": "Taxa estimada",
  "transaction.payCardCash": "Pagar com Cartão/Dinheiro",
  "transaction.creditCard": "*Taxas de cartão de crédito aplicáveis",
  "transaction.rejected": "Transação Rejeitada!",
  "transaction.message0":
    "Você precisa aceitar a transação na janela pop-up do metamask para continuar.",
  "transaction.noFee":
    "Esta solicitação não desencadeará uma transação na blockchain ou custará taxas de gás.",
  "transaction.chooseDonationGame":
    "Obrigado pelo seu apoio! Por favor, escolha o jogo para o qual deseja doar.",
  "transaction.minblockbucks": "Mínimo 5 Block Bucks",
  "transaction.payCash": "Pagar com Dinheiro",
  "transaction.matic": "Matic",
  "transaction.payMatic": "Pagar com MATIC",
  "transaction.storeBlockBucks":
    "Block bucks serão armazenados em sua fazenda.",
  "transaction.excludeFees": "*Preços excluem taxas de transação.",
  "transaction.storeProgress.blockchain.one":
    "Você deseja armazenar seu progresso na Blockchain?",
  "transaction.storeProgress.blockchain.two":
    "Armazenar dados na Blockchain não repõe lojas.",
  "transaction.storeProgress": "Armazenar progresso",
  "transaction.storeProgress.chain": "Armazenar progresso na cadeia",
  "transaction.storeProgress.success":
    "Uau! Seus itens estão seguros na Blockchain!",
  "transaction.trade.congrats": "Parabéns, sua troca foi bem-sucedida",
  "transaction.processing": "Processando sua transação.",
  "transaction.pleaseWait":
    "Aguarde a confirmação de sua transação pela Blockchain.",
  "transaction.unconfirmed.reset":
    "Após 5 minutos, quaisquer transações não confirmadas serão redefinidas.",
  "transaction.withdraw.one": "Retirando",
  "transaction.withdraw.sent": "Seus itens/tokens foram enviados para",
  "transaction.withdraw.view": "Você pode ver seus itens em",
  "transaction.openSea": "OpenSea",
  "transaction.withdraw.four":
    "Você pode ver seus tokens importando o Token SFL para sua carteira.",
  "transaction.withdraw.five": "Importar Token SFL para o MetaMask",
  "transaction.displayItems":
    "Observe que o OpenSea pode levar até 30 minutos para exibir seus itens. Você também pode ver seus itens em",
  "transaction.withdraw.polygon": "PolygonScan",
  "transaction.id": "ID da Transação",
  "transaction.termsOfService": "Aceitar os termos de serviço",
  "transaction.termsOfService.one":
    "Para comprar sua fazenda, você precisará aceitar os termos de serviço do Sunflower Land.",
  "transaction.termsOfService.two":
    "Esta etapa o levará de volta para sua nova carteira de sequência para aceitar os termos de serviço.",
  "transaction.buy.BlockBucks": ENGLISH_TERMS["transaction.buy.BlockBucks"],
};

const transfer: Record<Transfer, string> = {
  "transfer.sure.adress":
    "Certifique-se de que o endereço que você forneceu está na Blockchain Polygon, está correto e é de sua propriedade. Não há recuperação de endereços incorretos.",
  "transfer.Account": ENGLISH_TERMS["transfer.Account"],
  // "Your Account #{{farmID}} has been transferred to {{receivingAddress}}!",
  "transfer.Farm": "Transferindo sua fazenda!",
  "transfer.Refresh": "Não atualize este navegador",
  "transfer.Taccount": "Transferir sua conta",
  "transfer.address": "Endereço da carteira: ",
};

const treasureModal: Record<TreasureModal, string> = {
  "treasureModal.noShovelTitle": "Nenhuma Pá!",
  "treasureModal.needShovel":
    "Você precisa ter uma Pá de Areia equipada para poder cavar tesouros!",
  "treasureModal.purchaseShovel":
    "Se precisar comprar uma, você pode ir à Loja de Tesouros na extremidade sul da ilha.",
  "treasureModal.gotIt": "Entendi",
  "treasureModal.maxHolesTitle": "Máximo de buracos alcançado!",
  "treasureModal.saveTreasure": "Deixe alguns tesouros para o resto de nós!",
  "treasureModal.comeBackTomorrow": "Volte amanhã para procurar mais tesouros.",
  "treasureModal.drilling": "Furando",
};

const tutorialPage: Record<TutorialPage, string> = {
  "tutorial.pageOne.text1":
    "Este menu mostrará os níveis necessários para desbloquear novas construções.",
  "tutorial.pageOne.text2":
    "Algumas delas podem ser construídas várias vezes uma vez que você atinja um certo nível.",
  "tutorial.pageTwo.text1":
    "As construções são uma maneira importante de progredir no jogo, pois ajudarão você a expandir e evoluir.",
  "tutorial.pageTwo.text2":
    "Vamos começar aumentando nosso Bumpkin para podermos obter a Bancada de Trabalho e aprender sobre ferramentas.",
};

const username: Record<Username, string> = {
  "username.tooShort": ENGLISH_TERMS["username.tooShort"],
  "username.tooLong": ENGLISH_TERMS["username.tooLong"],
  "username.invalidChar": ENGLISH_TERMS["username.invalidChar"],
  "username.startWithLetter": ENGLISH_TERMS["username.startWithLetter"],
};

const visitislandEnter: Record<VisitislandEnter, string> = {
  "visitIsland.enterIslandId": "Digite o ID da Ilha",
  "visitIsland.visit": "Visitar",
};

const visitislandNotFound: Record<VisitislandNotFound, string> = {
  "visitislandNotFound.title": "Ilha Não Encontrada!",
};

const wallet: Record<Wallet, string> = {
  "wallet.connect": "Conectar sua carteira",
  "wallet.linkWeb3": "Vincular uma Carteira Web3",
  "wallet.setupWeb3":
    "Para acessar este recurso, você primeiro deve configurar uma carteira Web3",
  "wallet.wrongWallet": "Carteira Errada",
  "wallet.connectedWrongWallet": "Você está conectado à carteira errada",
  "wallet.missingNFT": "NFT Ausente",
  "wallet.requireFarmNFT":
    "Algumas ações requerem um NFT de fazenda. Isso ajuda a manter todos os seus itens seguros na Blockchain",
  "wallet.uniqueFarmNFT":
    "Um NFT de fazenda exclusivo será mintado para armazenar seu progresso",
  "wallet.mintFreeNFT": "Mintar seu NFT grátis",
  "wallet.wrongChain": "Cadeia Errada",
  "wallet.walletAlreadyLinked": "Carteira já vinculada",
  "wallet.linkAnotherWallet": "Por favor, vincule outra carteira",
  "wallet.transferFarm":
    "Por favor, transfira a fazenda para outra carteira para mintar a nova conta",
  "wallet.signRequest": "Assinar",
  "wallet.signRequestInWallet":
    "Assine a solicitação em sua carteira para continuar",
};

const warningTerms: Record<WarningTerms, string> = {
  "warning.noAxe": "Nenhuma Machado Selecionado!",
  "warning.chat.maxCharacters": "Máximo de caracteres",
  "warning.chat.noSpecialCharacters": "Sem caracteres especiais",
  "warning.level.required": "Nível {{lvl}} necessário",
  "warning.hoarding.message": ENGLISH_TERMS["warning.hoarding.message"],
  // indefiniteArticle: 'a' or 'an' depending if first letter is vowel.
  // If this is not used in your language, leave the `{{indefiniteArticle}}` part out
  "warning.hoarding.indefiniteArticle.a":
    ENGLISH_TERMS["warning.hoarding.indefiniteArticle.a"], // Leave this blank if not needed
  "warning.hoarding.indefiniteArticle.an":
    ENGLISH_TERMS["warning.hoarding.indefiniteArticle.an"], // Leave this blank if not needed
  "warning.hoarding.one":
    "Dizem que os Goblins são conhecidos por atacar fazendas que têm uma abundância de recursos.",
  "warning.hoarding.two":
    "Para se proteger e manter esses preciosos recursos seguros, sincronize-os na cadeia antes de coletar mais de",
  "travelRequirement.notice": "Antes de viajar, você deve aumentar de nível.",
};

const welcomeTerms: Record<WelcomeTerms, string> = {
  "welcome.createAccount": "Criar conta",
  "welcome.creatingAccount": "Criando sua conta",
  "welcome.email": "Email & Login Social",
  "welcome.login": "Login",
  "welcome.needHelp": "Precisa de ajuda?",
  "welcome.otherWallets": "Outras carteiras",
  "welcome.signingIn": "Entrando",
  "welcome.signIn.Message":
    "Aceite a solicitação de assinatura em sua carteira de navegador para fazer login.",
  "welcome.takeover.ownership":
    "Parece que você é novo no Sunflower Land e reivindicou a propriedade da conta de outro jogador.",
  "welcome.promo": "Adicionar Código Promocional",
  "welcome.offline": ENGLISH_TERMS["welcome.offline"],
};

const winner: Record<Winner, string> = {
  "winner.mintTime": "Você tem 24 horas para mintar seu prêmio.",
  "winner.mintTime.one": "Nenhum item disponível para fabricação!",
};

const wishingWellTerms: Record<WishingWell, string> = {
  "wishingWell.makeWish": "Conceda um novo desejo e veja quão sortudo você é!",
  "wishingWell.newWish":
    "Um novo desejo foi feito para você com base no seu saldo atual de tokens LP!",
  "wishingWell.noReward":
    "Você não tem recompensa disponível! A liquidez precisa ser mantida por 3 dias para obter uma recompensa!",
  "wishingWell.wish.lucky":
    "Conceda um novo desejo e veja quão sortudo você é!",
  "wishingWell.sflRewardsReceived":
    ENGLISH_TERMS["wishingWell.sflRewardsReceived"], // "You received {{reward}} SFL!",
  "wishingWell.wish.grantTime": "É hora de conceder seu desejo!",
  "wishingWell.wish.granted": "Seu desejo foi concedido.",
  "wishingWell.wish.made": "Você fez um desejo!",
  "wishingWell.wish.timeTillNextWish":
    "Tempo até o próximo desejo: {{nextWishTime}}",
  "wishingWell.wish.thanksForSupport":
    "Obrigado por apoiar o projeto e fazer um desejo.",
  "wishingWell.wish.comeBackAfter":
    ENGLISH_TERMS["wishingWell.wish.comeBackAfter"],
  // "Come back in {{nextWishTime}} to see just how lucky you have been!",
  "wishingWell.wish.warning.one":
    "Esteja ciente de que apenas os tokens LP que você possuía no momento em que o desejo foi feito serão considerados quando o desejo for concedido.",
  "wishingWell.wish.warning.two":
    "Se você remover sua liquidez durante este tempo, você não receberá nenhuma recompensa.",
  "wishingWell.info.one":
    "O poço dos desejos é um lugar mágico onde as recompensas SFL podem ser feitas apenas fazendo um desejo!",
  "wishingWell.info.two":
    "Os desejos são concedidos aos fazendeiros que forneceram liquidez no jogo.",
  "wishingWell.info.three":
    "Parece que você tem esses tokens LP mágicos em sua carteira!",
  "wishingWell.noLiquidity":
    "Parece que você ainda não está fornecendo liquidez. Mais informações,",
  "wishingWell.rewardsInWell": "Quantidade de recompensas no poço",
  "wishingWell.luck": "Vamos ver quão sortudo você é!",
  "wishingWell.moreInfo": "Mais informações",
};

const withdraw: Record<Withdraw, string> = {
  "withdraw.proof":
    "A prova de humanidade é necessária para este recurso. Por favor, tire uma selfie rápida.",
  "withdraw.verification": "Iniciar Verificação",
  "withdraw.unsave": "Qualquer progresso não salvo será perdido.",
  "withdraw.sync": "Você só pode retirar itens que sincronizou na blockchain.",
  "withdraw.available": "Disponível em 9 de maio",
  "withdraw.sfl.available": "SFL está disponível na cadeia",
  "withdraw.send.wallet": "Enviado para sua carteira",
  "withdraw.choose": "Escolha a quantidade a ser retirada",
  "withdraw.receive": "Você receberá: {{sflReceived}}",
  "withdraw.select.item": "Selecione os itens a serem retirados",
  "withdraw.opensea":
    "Depois de retirados, você poderá ver seus itens no OpenSea.",
  "withdraw.budRestricted": ENGLISH_TERMS["withdraw.budRestricted"],
  "withdraw.restricted":
    "Alguns itens não podem ser retirados. Outros itens podem ser restritos quando",
  "withdraw.bumpkin.wearing":
    "Seu Bumpkin está atualmente usando o(s) seguinte(s) item(ns) que não podem ser retirados. Você precisará desequipá-los antes de poder retirar.",
  "withdraw.bumpkin.sure.withdraw":
    "Tem certeza de que deseja retirar seu Bumpkin?",
  "withdraw.bumpkin.closed": ENGLISH_TERMS["withdraw.bumpkin.closed"],
  "withdraw.bumpkin.closing": ENGLISH_TERMS["withdraw.bumpkin.closing"],
  "withdraw.buds": "Selecione Buds para retirar",
};

const world: Record<World, string> = {
  "world.intro.one": "Olá Viajante! Bem-vindo à Pumpkin Plaza!",
  "world.intro.two":
    "A praça é lar de um grupo diversificado de Bumpkins e Goblins famintos que precisam da sua ajuda!",
  "world.intro.delivery": ENGLISH_TERMS["world.intro.delivery"],
  "world.intro.levelUpToTravel": ENGLISH_TERMS["world.intro.levelUpToTravel"],
  "world.intro.find": ENGLISH_TERMS["world.intro.find"],
  "world.intro.findNPC": ENGLISH_TERMS["world.intro.findNPC"],
  "world.intro.missingDelivery": ENGLISH_TERMS["world.intro.missingDelivery"],
  "world.intro.visit":
    "Visite NPCs e complete entregas para ganhar SFL, Coins e recompensas raras.",
  "world.intro.craft":
    "Crie colecionáveis raros, vestíveis e decorações nas diferentes lojas.",
  "world.intro.carf.limited":
    "Depressa, os itens só estão disponíveis por tempo limitado!",
  "world.intro.trade":
    "Troque recursos com outros jogadores. Para interagir com um jogador, aproxime-se e clique nele.",
  "world.intro.auction":
    "Prepare seus recursos e visite a Casa de Leilões para competir com outros jogadores por colecionáveis raros!",
  "world.intro.four": "Para mover seu Bumpkin, use as setas do teclado",
  "world.intro.five": "Na tela de toque, use o joystick.",
  "world.intro.six":
    "Para interagir com um Bumpkin ou um objeto, aproxime-se e clique nele",
  "world.intro.seven":
    "Sem assédio, palavrões ou bullying. Obrigado por respeitar os outros.",
  "world.plaza": ENGLISH_TERMS["world.plaza"],
  "world.beach": ENGLISH_TERMS["world.beach"],
  "world.retreat": ENGLISH_TERMS["world.retreat"],
  "world.woodlands": ENGLISH_TERMS["world.woodlands"],
  "world.home": ENGLISH_TERMS["world.home"],
  "world.kingdom": ENGLISH_TERMS["world.kingdom"],
  "world.travelTo": ENGLISH_TERMS["world.travelTo"],
};

const wornDescription: Record<WornDescription, string> = {
  "worm.earthworm": "Uma minhoca que atrai peixes pequenos.",
  "worm.grub": "Uma larva suculenta - perfeita para peixes avançados.",
  "worm.redWiggler": "Uma minhoca exótica que atrai peixes raros.",
};

const milestoneMessages: Record<MilestoneMessages, string> = {
  "milestone.noviceAngler":
    "Parabéns, você acaba de alcançar o marco de Pescador Novato! Você está no caminho certo para se tornar um profissional da pesca, capturando cada peixe básico.",
  "milestone.advancedAngler":
    "Impressionante, você acaba de alcançar o marco de Pescador Avançado! Você dominou a arte de capturar cada peixe avançado. Continue assim!",
  "milestone.expertAngler":
    "Uau, você acaba de alcançar o marco de Pescador Especialista! Você é um verdadeiro especialista em pesca agora! Capturar 300 peixes não é uma tarefa pequena.",
  "milestone.fishEncyclopedia":
    "Parabéns, você acaba de alcançar o marco da Enciclopédia de Peixes! Você se tornou um verdadeiro conhecedor de peixes! Descobrir cada peixe básico, avançado e especial é uma conquista notável.",
  "milestone.masterAngler":
    "Uau, você acaba de alcançar o marco de Mestre Pescador! Capturar 1500 peixes é um testemunho de suas habilidades de pesca.",
  "milestone.marineMarvelMaster":
    "Parabéns, você acaba de alcançar o marco de Mestre da Maravilha Marinha! Você é o campeão indiscutível dos mares! Capturar cada Marvel prova suas habilidades de pesca como nenhuma outra.",
  "milestone.deepSeaDiver":
    "Parabéns, você acaba de alcançar o marco de Mergulhador do Mar Profundo! Você ganhou o Deep Sea Helm - uma coroa misteriosa que atrai Maravilhas Marinhas para o seu anzol.",
  "milestone.sunpetalSavant":
    "Parabéns, você acaba de alcançar o marco de Sunpetal Savant! Você descobriu cada variante de Sunpetal. Você é um verdadeiro especialista em Sunpetal!",
  "milestone.bloomBigShot":
    "Parabéns, você acaba de alcançar o marco de Bloom Big Shot! Você descobriu cada variante de Bloom. Você é um verdadeiro especialista em Bloom!",
  "milestone.lilyLuminary":
    "Parabéns, você acaba de alcançar o marco de Lily Luminary! Você descobriu cada variante de Lily. Você é um verdadeiro especialista em Lily!",
};

const event: Record<Event, string> = {
  "event.christmas": "Evento de Natal!",
  "event.LunarNewYear": "Evento de Ano Novo Lunar",
  "event.GasHero": "Evento de Gas Hero",
  "event.Easter": "Evento de Páscoa",
  "event.valentines.rewards": "Recompensas de Dia dis Namorados",
};

export const NYON_STATUE: Record<NyonStatue, string> = {
  "nyonStatue.memory": "Em memória de",
  "nyonStatue.description":
    "O lendário cavaleiro responsável por limpar os goblins das minas. Pouco depois de sua vitória, ele morreu envenenado por um conspirador Goblin. Os Cidadãos de Sunflower Land ergueram esta estátua com sua armadura para comemorar suas conquistas.",
};

const trading: Record<Trading, string> = {
  "trading.select.resources": "Selecione recursos para ver listagens",
  "trading.no.listings": "Nenhuma listagem encontrada",
  "trading.listing.congrats": "Parabéns, você listou seus itens para troca!",
  "trading.listing.deleted": "Sua listagem foi excluída",
  "trading.listing.fulfilled": "A troca foi completada",
  "trading.your.listing": "Sua listagem",
  "trading.you.receive": "Você recebe",
  "trading.burned": "será queimado.",
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
  "gameOptions.howToPlay": "Como Jogar? (Sob reconstrução)",
  "gameOptions.farmId": ENGLISH_TERMS["gameOptions.farmId"],
  "gameOptions.logout": "Sair",
  "gameOptions.confirmLogout": "Tem certeza de que deseja sair?",

  // Amoy Actions
  "gameOptions.amoyActions": ENGLISH_TERMS["gameOptions.amoyActions"],
  "gameOptions.amoyActions.timeMachine": "Máquina do Tempo",

  // Blockchain Settings
  "gameOptions.blockchainSettings":
    ENGLISH_TERMS["gameOptions.blockchainSettings"],
  "gameOptions.blockchainSettings.refreshChain":
    ENGLISH_TERMS["gameOptions.blockchainSettings.refreshChain"],
  "gameOptions.blockchainSettings.storeOnChain": "Armazenar na Blockchain",
  "gameOptions.blockchainSettings.swapMaticForSFL": "Trocar MATIC por SFL",
  "gameOptions.blockchainSettings.transferOwnership": "Transferir Propriedade",

  // General Settings
  "gameOptions.generalSettings": ENGLISH_TERMS["gameOptions.generalSettings"],
  "gameOptions.generalSettings.connectDiscord":
    ENGLISH_TERMS["gameOptions.generalSettings.connectDiscord"],
  "gameOptions.generalSettings.assignRole":
    ENGLISH_TERMS["gameOptions.generalSettings.assignRole"],
  "gameOptions.generalSettings.changeLanguage": "Alterar Idioma",
  "gameOptions.generalSettings.darkMode":
    ENGLISH_TERMS["gameOptions.generalSettings.darkMode"],
  "gameOptions.generalSettings.lightMode":
    ENGLISH_TERMS["gameOptions.generalSettings.lightMode"],
  "gameOptions.generalSettings.font":
    ENGLISH_TERMS["gameOptions.generalSettings.font"],
  "gameOptions.generalSettings.disableAnimations": "Desativar Animações",
  "gameOptions.generalSettings.enableAnimations": "Ativar Animações",
  "gameOptions.generalSettings.share": "Compartilhar",
  "gameOptions.generalSettings.appearance": "Appearance Settings",

  // Plaza Settings
  "gameOptions.plazaSettings": "Configurações do Plaza",
  "gameOptions.plazaSettings.title.mutedPlayers": "Jogadores Silenciados",
  "gameOptions.plazaSettings.title.keybinds": "Atalhos de Teclado",
  "gameOptions.plazaSettings.mutedPlayers.description":
    "Caso você tenha silenciado alguns jogadores usando o comando /mute, você pode vê-los aqui e desmutá-los se quiser.",
  "gameOptions.plazaSettings.keybinds.description":
    "Precisa saber quais atalhos de teclado estão disponíveis? Confira-os aqui.",
  "gameOptions.plazaSettings.noMutedPlayers":
    "Você não tem jogadores silenciados.",
  "gameOptions.plazaSettings.changeServer":
    ENGLISH_TERMS["gameOptions.plazaSettings.changeServer"],
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

export const PORTUGUESE_TERMS: Record<TranslationKeys, string> = {
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
  ...claimAchievement,
  ...changeLanguage,
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
  ...goblinTrade,
  ...goldTooth,
  ...greenhouse,
  ...guideTerms,
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
  ...leaderboardTerms,
  ...letsGo,
  ...levelUpMessages,
  ...loser,
  ...lostSunflorian,
  ...megaStore,
  ...milestoneMessages,
  ...minigame,
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
  ...transactionTerms,
  ...transfer,
  ...trading,
  ...treasureModal,
  ...tutorialPage,
  ...username,
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
  ...restrictionReason,
  ...removeCropMachine,
  ...easterEggTerms,
};
