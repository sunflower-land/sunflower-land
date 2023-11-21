import {
  AchievementsDialog,
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
  RewardTerms,
  RulesTerms,
  SeasonBannerOffer,
  ShopItems,
  Statements,
  TransactionTerms,
  TranslationKeys,
  WelcomeTerms,
} from "./types";

const generalTerms: Record<GeneralTerms, string> = {
  featured: "Em destaque",
  connecting: "Conectando",
  connected: "Conectado",
  loading: "Carregando",
  saving: "Salvando",
  continue: "Continuar",
  readMore: "Saiba mais",
  close: "Fechar",
  noThanks: "Não, obrigado",
  guide: "Guia",
  task: "Tarefa",
  buy: "Comprar",
  sell: "Vender",
  "sell.one": "Vender 1",
  "sell.ten": "Vender 10",
  "sell.all": "Vender tudo",
  delivery: "Entrega",
  crops: "Colheitas",
  exotics: "Exóticos",
  fruits: "Frutas",
  fruit: "Fruta",
  "2x.sale": "Venda 2x",
  cancel: "Cancelar",
  for: "por",
  wallet: "Carteira",
  mint: "Mint", // To translate
  "card.cash": "Cartão/Dinheiro",
  letsGo: "Vamos!",
  maintenance: "Manutenção",
  back: "Volte",
  forbidden: "Proibido",
  refreshing: "Refrescante",
  tryAgain: "Tente novamente",
  claim: "Reivindicar",
};

const gameTerms: Record<GameTerms, string> = {
  blockBucks: "Block Bucks",
};

const confirmationTerms: Record<ConfirmationTerms, string> = {
  // "confirmation.sellCrops": "Are you sure you want to"
  "confirmation.sellCrops": "Tem certeza de que deseja",
};

const welcomeTerms: Record<WelcomeTerms, string> = {
  "welcome.otherWallets": "Outras carteiras",
  "welcome.needHelp": "Ajuda?",
  "welcome.createAccount": "Criar conta",
  "welcome.creatingAccount": "Creating your account", // To be translated
  "welcome.login": "Entrar",
  "welcome.signingIn": "Entrando",
  "welcome.signInMessage":
    "Aceite a requisição de assinatura na sua carteira para entrar.",
  "welcome.email": "Email & Social Login", // To be Translated
};

const rulesTerms: Record<RulesTerms, string> = {
  rules: "Regras do Jogo",
  "rules.accounts": "1 conta por jogador",
  "rules.noBots": "Sem bots ou automação",
  "rules.game": "Isto é um jogo. Não um produto financeiro.",
  "rules.termsOfService": "Termos de Serviço",
};

const seasonBannerOffer: Record<SeasonBannerOffer, string> = {
  "season.goodLuck": "Boa sorte na temporada!",
  "season.discount": "25% de desconto em itens de temporada",
  "season.banner": "Banner de Temporada",
  "season.wearableAirdrop": "Airdrop de Vestível de Temporada",
  "season.bonusTickets": "Tickets de Temporada Bônus",
  "season.boostXP": "+10% EXP de comida",
  "season.exclusiveOffer": "Oferta exclusiva!",
  "season.includes": "Inclui:",
  "season.limitedOffer": "Oferta por tempo limitado!",
  "season.accessTo": "Você tem acesso a:",
  "season.buyNow": "Comprar Agora",
};

const introTerms: Record<Intro, string> = {
  "intro.one":
    "Olá, Bumpkin! Bem-vindo ao Sunflower Land, o paraíso agrícola onde tudo é possível!",
  "intro.two":
    "Que ilha linda você escolheu! Sou o Pumpkin Pete, seu vizinho fazendeiro.",
  "intro.three":
    "Agora mesmo os jogadores estão celebrando um festival no Pumpkin Plaza com recompensas fantásticas e itens mágicos.",
  "intro.four":
    "Antes de poder se juntar à diversão, você precisará melhorar sua fazenda e coletar alguns recursos. Você não vai querer aparecer de mãos vazias!",
  "intro.five":
    "Para começar, você vai precisar derrubar essas árvores e expandir sua ilha.",
};

const shopItems: Record<ShopItems, string> = {
  "shopItems.one": "Ei, ei! Bem-vindo de volta.",
  "shopItems.two":
    "Você ajudou a resolver a escassez de colheitas e os preços voltaram ao normal.",
  "shopItems.three": "É hora de passar para colheitas maiores e melhores!",
};

const achievementTerms: Record<AchievementsDialog, string> = {
  "breadWinner.description": "Ganhe 0.001 SFL",
  "breadWinner.one":
    "Bem, bem, bem, parceiro... Parece que você precisa de mais SFL!",
  "breadWinner.two":
    "Em Sunflower Land, uma boa quantidade de SFL é a chave para criar ferramentas, edifícios e NFTs raros",
  "breadWinner.three":
    "A maneira mais rápida de ganhar SFL é plantando e vendendo colheitas.",

  "sunSeeker.description": "Colha Girassol 100 vezes",
  "cabbageKing.description": "Colha Repolho 200 vezes",
  "jackOLantern.description": "Colha Abóbora 500 vezes",
  "coolFlower.description": "Colha Couve-flor 100 vezes",
  "farmHand.description": "Colha colheitas 10,000 vezes",
  "beetrootBeast.description": "Colha beterraba 2.000 vezes",
  "myLifeIsPotato.description": "Colha batata 5.000 vezes",
  "rapidRadish.description": "Colha rabanete 200 vezes",
  "twentyTwentyVision.description": "Colha cenoura 10.000 vezes",
  "stapleCrop.description": "Colha trigo 10.000 vezes",
  "sunflowerSuperstar.description": "Colha girassol 100.000 vezes",
  "bumpkinBillionaire.description": "Ganhe 5.000 SFL",
  "patientParsnips.description": "Colha pastinaca 5.000 vezes",
  "cropChampion.description": "Atinja 1 milhão de colheitas",

  "busyBumpkin.description": "Alcance o nível 2",
  "busyBumpkin.one":
    "Olá, meu amigo ambicioso! Para desbloquear novas colheitas, expansões, edifícios e muito mais, você precisará subir de nível.",
  "busyBumpkin.two":
    "Vá até a Fogueira, prepare uma receita deliciosa e alimente seu Bumpkin.",

  "kissTheCook.description": "Cozinhe 20 refeições",
  "bakersDozen.description": "Asse 13 bolos",
  "brilliantBumpkin.description": "Alcance o nível 20",
  "chefDeCuisine.description": "Cozinhe 5.000 refeições",

  "scarecrowMaestro.description":
    "Construa um espantalho e aumente suas colheitas",
  "scarecrowMaestro.one":
    "Olá, parceiro! É hora de você aprender a arte de construir e aumentar suas habilidades agrícolas",
  "scarecrowMaestro.two":
    "Vá até o Pumpkin Plaza, visite o Ferreiro e construa um Espantalho.",

  "bigSpender.description": "Gaste 10 SFL",
  "museum.description":
    "Tenha 10 tipos diferentes de itens raros colocados em sua terra",
  "highRoller.description": "Gaste 7.500 SFL",
  "timbeerrr.description": "Corte 150 árvores",
  "craftmanship.description": "Crie 100 ferramentas",
  "driller.description": "Minere 50 pedras",
  "ironEyes.description": "Minere 50 rochas de ferro",
  "elDorado.description": "Minere 50 rochas de ouro",
  "timeToChop.description": "Crie 500 machados",
  "canary.description": "Minere 1.000 pedras",
  "somethingShiny.description": "Minere 500 rochas de ferro",
  "bumpkinChainsawAmateur.description": "Corte 5.000 árvores",
  "goldFever.description": "Minere 500 rochas de ouro",

  // Explorer
  "explorer.description": "Expanda sua ilha",
  "explorer.one":
    "Vamos primeiro derrubar essas árvores, coletar madeira e expandir a ilha. Vá em frente e descubra a melhor maneira de fazer isso.",

  "expansion.description": "Expanda sua ilha para novos horizontes.",

  // Well of Prosperity
  "wellOfProsperity.description": "Construa um poço",
  "wellOfProsperity.one": "Bem, bem, bem, o que temos aqui?",
  "wellOfProsperity.two":
    "Parece que suas colheitas estão com sede. Para cultivar mais, você deve primeiro construir um poço.",

  "contractor.description": "Tenha 10 construções em sua fazenda",
  "fruitAficionado.description": "Colha 50 frutas",
  "fruitAficionado.one":
    "Ei, colecionador de frutas! As frutas são os presentes mais doces da natureza e trazem um sabor especial para sua fazenda.",
  "fruitAficionado.two":
    "Ao coletar diferentes frutas, como maçãs, laranjas e mirtilos, você desbloqueará receitas exclusivas, aumentará suas habilidades culinárias e criará deliciosos petiscos.",

  "orangeSqueeze.description": "Colha Laranja 100 vezes",
  "appleOfMyEye.description": "Colha Maçã 500 vezes",
  "blueChip.description": "Colha Mirtilo 5.000 vezes",
  "fruitPlatter.description": "Colha 50.000 frutas",
  "deliveryDynamo.description": "Complete 3 entregas",
  "crowdFavourite.description": "Complete 100 entregas",

  "deliveryDynamo.one":
    "Alô, mestre da colheita! Os Bumpkins de todo canto estão pedindo por sua ajuda nas entregas.",
  "deliveryDynamo.two":
    "Completando as entregas, você espalha alegria e ainda ganha SFL de recompensa!",

  "seasonedFarmer.description": "Colete 50 Recursos Sazonais",
  "seasonedFarmer.one":
    "Olá, aventureiro! Sunflower Land é conhecido por suas temporadas especiais repletas de itens únicos e surpresas.",
  "seasonedFarmer.two":
    "Ao coletar recursos de temporada, você terá acesso a recompensas por tempo limitado, Crafts exclusivos e tesouros raros. É como ter um ingresso na primeira fila para as maravilhas de cada temporada.",
  "seasonedFarmer.three":
    "Então complete tarefas, participe de eventos e junte esses Tickets de Temporada para aproveitar o melhor que Sunflower Land tem a oferecer!",
  "treasureHunter.description": "Cave 10 buracos",
  "treasureHunter.one":
    "Alô, caçador de tesouros! Sunflower Land está cheio de tesouros escondidos esperando para serem descobertos.",
  "treasureHunter.two":
    "Pegue sua pá e vá para a Ilha do Tesouro, onde você pode cavar itens valiosos e surpresas raras.",
  "eggcellentCollection.description": "Colete 10 Ovos",
  "eggcellentCollection.one":
    "Olá, colecionador de ovos! As galinhas são companheiras maravilhosas da fazenda que nos fornecem deliciosos ovos.",
  "eggcellentCollection.two":
    "Ao coletar ovos, você terá um fornecimento de ingredientes para cozinhar e também desbloqueará receitas especiais e bônus.",
};

const guideTerms: Record<GuideTerms, string> = {
  "guide.intro":
    "Do início humilde à fazenda especializada, este guia tem tudo o que você precisa!",
  "gathering.description.one":
    "No Sunflower Land, é essencial saber coletar recursos pra prosperar. Comece escolhendo as ferramentas certas. Com o Machado, você corta árvores e pega madeira. Quer fazer ferramentas novas? Vai na oficina do jogo e troca teu SFL ou recursos pela ferramenta que está precisando.",
  "gathering.description.two":
    "Conforme você coleta mais recursos, dá pra expandir seu espaço no jogo. Mais terra no Sunflower Land abre um monte de possibilidades, com terra boa pra plantar, árvores enormes, pedras valiosas, ferro, ouro e pomares de frutas deliciosas.",
  "gathering.description.three":
    "Lembre-se, coletar recursos e aumentar sua terra são fundamentais pra sua fazenda crescer. Enfrente os desafios e aproveite as recompensas enquanto vê seu Sunflower Land ficar cheio de recursos e oportunidades.",

  "crops.description.one":
    "No Sunflower Land, plantar e colher é muito importante pra sua jornada. Você ganha SFL (Sunflower Token) ou cria receitas e itens legais no jogo. Tudo começa com a compra de sementes na loja do jogo.",
  "crops.description.two":
    "Cada planta tem seu tempo pra crescer, desde 1 minuto pra Girassóis até 36 horas pra Couve. Depois que as plantas crescem, é só colher e aproveitar as recompensas.",
  "crops.description.three":
    "Não esqueça: expandir suas terras e avançar no jogo libera mais plantas, aumentando suas chances de ganhar SFL e explorar tudo que o Sunflower Land tem a oferecer. Mãos à obra e boa sorte!",

  "building.description.one":
    "Explore as diversas construções disponíveis no Sunflower Land conforme avança no jogo. De galinheiros a oficinas, cada construção traz benefícios únicos pra sua fazenda. Use elas pra melhorar suas operações agrícolas e desbloquear novas possibilidades.",
  "building.description.two":
    "Construções são fundamentais na sua jornada agrícola no Sunflower Land. Pra acessar as construções, clique no ícone do Inventário e escolha a aba Construções. Escolha o que quer construir, ache um espaço na sua fazenda e espere o temporizador acabar. Com as construções, você desbloqueia recursos emocionantes e vê seu império agrícola crescer.",

  "cooking.description.one":
    "Cozinhar permite nutrir seu Bumpkin e ajudá-lo a ganhar pontos valiosos de experiência (XP). Utilizando as colheitas, você pode preparar alimentos deliciosos em diferentes locais como Kitchen, Bakery, Deli e Smoothie Shack.",
  "cooking.description.two":
    "Começando com o Fire Pit, cada fazenda tem acesso às instalações básicas de cozinha desde o início. À medida que você progride, pode desbloquear construções mais avançadas como Kitchen, Bakery, Deli e Smoothie Shack, cada uma oferecendo uma variedade maior de receitas e delícias culinárias.",
  "cooking.description.three":
    "Para cozinhar, basta escolher um local como Kitchen ou Bakery e selecionar uma receita para preparar. A receita fornecerá detalhes sobre os ingredientes necessários, o XP ganho ao consumir e o tempo de preparação. Depois de iniciar o processo, é só ficar de olho no temporizador para saber quando a comida estará pronta.",
  "cooking.description.four":
    "Assim que a comida estiver pronta, você pode retirá-la do local, clicando nela a comida vai para o seu inventário. A partir daí, é possível alimentar seu Bumpkin NPC na fazenda com a comida preparada, ajudando-o a ganhar XP e avançar no jogo.",
  "cooking.description.five":
    "Experimente diferentes receitas, desbloqueie novas construções e descubra a alegria de cozinhar enquanto cuida do seu Bumpkin em Sunflower Land.",

  "animals.description.one":
    "As galinhas no Sunflower Land são uma adição encantadora à sua fazenda, servindo como fonte de ovos que podem ser usados em várias receitas e itens. Para começar com galinhas, você precisa alcançar o nível 9 de Bumpkin e construir o Hen House. A partir daí, você pode comprar galinhas. Simplesmente arraste e solte-as na sua fazenda, assim como faz com construções. Em uma fazenda padrão, cada Hen House abriga até 10 galinhas, e se você possui o SFT Chicken Coop, esse limite aumenta para 15.",
  "animals.description.two":
    "Cada galinha tem um indicador, mostrando seu humor ou necessidades atuais. Isso pode variar entre estar com fome, cansada, feliz ou pronta para chocar. Para manter suas galinhas contentes e produtivas, alimente-as selecionando trigo no seu inventário e interagindo com elas. Alimentar inicia o cronômetro do ovo, que leva 48 horas para os ovos estarem prontos para coleta. Uma vez que os ovos estejam prontos, visite sua fazenda, verifique o ícone acima de cada galinha e interaja com elas para descobrir o tipo de ovo que chocou. Ocasionalmente, você pode até descobrir galinhas mutantes raras, que oferecem benefícios especiais como produção de ovos mais rápida, maior rendimento ou consumo reduzido de alimentos.",
  "animals.description.three":
    "Cuidar das suas galinhas e coletar seus ovos adiciona um elemento dinâmico e gratificante à sua fazenda no Sunflower Land. Experimente com receitas, aproveite os ovos em sua busca por novos itens e desfrute das surpresas que vêm com as galinhas mutantes raras. Construa uma operação de avicultura próspera e colha os benefícios do seu trabalho árduo enquanto você se delicia com o encantador mundo das galinhas no Sunflower Land.",

  "crafting.description.one":
    "No Sunflower Land, criar NFTs é um aspecto crucial para aumentar sua produção agrícola e acelerar seu progresso. Esses itens especiais oferecem vários bônus, como aumento no crescimento das colheitas, melhorias na culinária e boosts nos recursos, o que pode acelerar bastante sua jornada. Maximizando seu SFL (Sunflower Token), você pode criar ferramentas, coletar recursos e expandir suas terras para fortalecer ainda mais seu império agrícola.",
  "crafting.description.two":
    "Para começar a criar itens, visitaremos Igor, um artesão habilidoso em Sunfloria. Depois de pegar o barco e chegar a Sunfloria, vá até o topo da ilha para conversar com Igor. Ele está oferecendo um Basic Scarecrow, que acelera o crescimento de Sunflowers, Potatoes e Pumpkins. É uma ótima troca que exige alguns de seus recursos pelo espantalho. Uma vez obtido, volte para sua ilha principal e entre no modo de design clicando no ícone de mão no canto superior direito do jogo.",
  "crafting.description.three":
    "No modo de design, você pode posicionar estrategicamente itens e rearranjar recursos em sua fazenda para otimizar seu layout e realçar sua aparência visual. Esse passo é crucial para maximizar a eficácia de seus itens. Por exemplo, coloque o Scarecrow acima dos locais que deseja aplicar o boost. Além disso, considere comprar decorações para adicionar charme e organização à sua fazenda.",
  "crafting.description.four":
    "Ao criar equipamentos e posicioná-los estrategicamente, você pode ampliar suas habilidades agrícolas, criar um lar na ilha do qual se orgulhar e acelerar seu progresso no Sunflower Land.",

  "deliveries.description.one":
    "As entregas no Sunflower Land oferecem uma oportunidade emocionante de ajudar Goblins famintos e outros Bumpkins, enquanto ganha recompensas. Todos os dias, você poderá ver todos os pedidos que tem clicando no quadro de entregas no canto inferior esquerdo da tela. Os pedidos foram feitos por alguns NPCs locais que podem ser encontrados no Pumpkin Plaza. Para entregar um pedido, você precisará pegar um barco até o Pumpkin Plaza e procurar o NPC que espera a entrega. Uma vez que os encontrar, clique neles para entregar o pedido e receber sua recompensa.",
  "deliveries.description.two":
    "Como um jogador novo, você começa com três espaços de pedido, mas à medida que expande sua fazenda, desbloqueará espaços adicionais, permitindo que jogadores avançados completem mais pedidos. Novos pedidos chegam a cada 24 horas, oferecendo uma variedade de tarefas, desde produzir colheitas até cozinhar alimentos e coletar recursos. Completar pedidos tambem lhe renderá alguns bônus, incluindo Block Bucks, SFL, bolos deliciosos e outras recompensas. O sistema de recompensas é baseado na dificuldade do pedido, então considere priorizar pedidos que ofereçam maiores recompensas para maximizar seus ganhos. Fique de olho no quadro e desafie-se com uma variedade de pedidos, subindo de nível e desbloqueando novos construções conforme necessário para atender pedidos mais exigentes.",

  "scavenger.description.one":
    "Coletar no Sunflower Land oferece oportunidades emocionantes para descobrir tesouros escondidos e reunir recursos valiosos. O primeiro aspecto da coleta é escavar tesouros na Treasure Island, onde você pode se tornar um caçador de tesouros pirata. Com uma pá e se aventurando na Treasure Island, você pode cavar em áreas arenosas escuras para descobrir uma variedade de tesouros, incluindo recompensas, decorações e até SFTs antigos com utilidade.",
  "scavenger.description.two":
    "Outra forma de coleta envolve coletar cogumelos selvagens que aparecem espontaneamente em sua fazenda e ilhas vizinhas. Estes cogumelos podem ser coletados gratuitamente e usados em receitas, missões e artesanato. Fique de olho nesses cogumelos, pois eles se reabastecem a cada 16 horas, com um limite máximo de 5 cogumelos em sua fazenda. Se sua terra estiver cheia, os cogumelos aparecerão nas ilhas vizinhas, garantindo que você não perca esses recursos valiosos.",

  "fruit.description.one":
    "As frutas têm um papel significativo no Sunflower Land como um recurso valioso que pode ser vendido por SFL ou utilizado em várias receitas e artesanatos. Diferente das plantações, as áreas de frutas têm a habilidade única de se reabastecer várias vezes após cada colheita, proporcionando uma fonte sustentável de frutas para os jogadores.",
  "fruit.description.two":
    "Para plantar frutas, você precisará adquirir áreas de frutas maiores, que se tornam disponíveis na 9ª ou 10ª expansão de sua fazenda.",
  "fruit.description.three":
    "Cultivando frutas e incorporando-as em suas estratégias agrícolas, você pode maximizar seus lucros, criar receitas deliciosas e desbloquear novas possibilidades no Sunflower Land.",

  "seasons.description.one":
    "As temporadas no Sunflower Land trazem animação e novidades ao jogo, oferecendo aos jogadores novos desafios e oportunidades. Com a introdução de cada temporada, os jogadores podem esperar uma variedade de novos itens, decorações de edição limitada, animais mutantes e tesouros raros. Além disso, os tickets de temporada adicionam um elemento estratégico ao jogo, já que os jogadores devem decidir como alocar seus tickets sabiamente, seja coletando itens raros, optando por decorações de maior oferta ou trocando tickets por SFL.",
  "seasons.description.two":
    "A disponibilidade de itens de temporada no Goblin Blacksmith adiciona outra camada de emoção. Os jogadores devem reunir os recursos necessários e tickets de temporada para criar esses itens de oferta limitada, criando um senso de competição e urgência. Planejar com antecedência e estrategizar se tornam cruciais à medida que os jogadores visam garantir seus itens desejados antes que o estoque acabe. Além disso, a opção de trocar tickets de temporada por SFL oferece flexibilidade e permite que os jogadores façam escolhas que estejam alinhadas com seus objetivos específicos de jogo. Com as ofertas únicas e eventos surpresa de cada temporada , Sunflower Land mantém os jogadores engajados e entretidos durante todo o ano, fomentando uma experiência de fazenda vibrante e em constante evolução.",
};

const conversations: Record<Conversations, string> = {
  "hank-intro.headline": "Ajude um velho fazendeiro?",
  "hank-intro.one": "Olá, Bumpkin! Bem-vindo ao nosso pequeno paraíso.",
  "hank-intro.two":
    "Estou trabalhando nesta terra há cinquenta anos, mas com adoraria receber alguma ajuda.",
  "hank-intro.three":
    "Posso te ensinar o básico da agricultura, desde que você me ajude com as tarefas diárias.",
  "hank-crafting.headline": "Faça um espantalho",
  "hank-crafting.one":
    "Hmm, essas colheitas estão crescendo muito lentamente. Não tenho o dia todo.",
  "hank-crafting.two": "Faça um espantalho para acelerar suas colheitas.",
  "betty-intro.headline": "Como fazer sua fazenda crescer",
  "betty-intro.one": "Oi! Bem-vindo ao meu mercado.",
  "betty-intro.two":
    "Traga-me suas colheitas e te darei um preço justo por elas!",
  "betty-intro.three":
    "Precisa de sementes? De batatas a pastinagas, eu tenho tudo o que você precisa!",
  "bruce-intro.headline": "Introdução à culinária",
  "bruce-intro.one": "Sou o dono deste adorável bistrô.",
  "bruce-intro.two":
    "Traga-me recursos e cozinharei toda a comida que você puder comer!",
  "bruce-intro.three":
    "Olá, fazendeiro! Eu posso ver um Bumpkin faminto a um quilômetro de distância.",
  "blacksmith-intro.headline": "Madeeeeeira.",
  "blacksmith-intro.one":
    "Sou um mestre das ferramentas, e com os recursos certos, posso criar tudo o que você precisa... incluindo mais ferramentas!",
};

const henHouseTerms: Record<HenHouseTerms, string> = {
  "henHouse.chickens": "Galinhas",
  "henHouse.text.one": "Alimente com trigo e colete ovos",
  "henHouse.text.two": "Galinha Preguiçosa",
  "henHouse.text.three":
    "Coloque sua galinha para trabalhar e comece a coletar ovos!",
  "henHouse.text.four": "Galinha Trabalhadora",
  "henHouse.text.five": "Já colocada e trabalhando duro!",
  "henHouse.text.six": "Construa uma Hen House extra para criar mais galinhas",
};

const rewardTerms: Record<RewardTerms, string> = {
  "reward.title": "Recompensas Diárias",
  "reward.streak": " dias seguidos",
  "reward.comeBackLater": "Volte mais tarde para mais recompensas",
  "reward.nextBonus": "Próximo bônus: ",
  "reward.unlock": "Desbloquear recompensa",
  "reward.open": "Abrir recompensa",
  "reward.lvlRequirement":
    "Você precisa estar no nível 3 para acessar recompensas diárias.",
  "reward.revealing": "O que poderia ser?",
  "reward.streakBonus": "Bônus de streak x3",
  "reward.found": "Você encontrou",
};

// To Be Translated
const errorTerms: Record<ErrorTerms, string> = {
  "error.congestion.one":
    "We are trying our best but looks like Polygon is getting a lot of traffic or you have lost your connection.",
  "error.congestion.two":
    "If this error continues please try changing your Metamask RPC",
  "error.forbidden.goblinVillage":
    "You are not allowed to visit Goblin Village!",
  "error.multipleDevices.one": "Multiple devices open",
  "error.multipleDevices.two":
    "Please close any other browser tabs or devices that you are operating on.",
  "error.multipleWallets.one": "Multiple Wallets",
  "error.multipleWallets.two":
    "It looks like you have multiple wallets installed. This can cause unexpected behaviour.Try to disable all but one wallet.",
  "error.toManyRequest.one": "Too many requests!",
  "error.toManyRequest.two":
    "Looks like you have been busy! Please try again later.",
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
};

const onboarding: Record<Onboarding, string> = {
  "onboarding.welcome": "Welcome to decentralized gaming!",
  "onboarding.step.one": "Step 1/3",
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
};

const questions: Record<Questions, string> = {
  "questions.obtain.MATIC": "How do I get MATIC?",
  "questions.lowCash": "Short on Cash?",
};

const statements: Record<Statements, string> = {
  "statements.adventure": "Start your Adventure!",
  "statements.maintenance":
    "New things are coming! Thanks for your patience, the game will be live again shortly.",
  "statements.docs": "Go to docs",
  "statements.wrongChain.one":
    "Check out this guide to help you get connected.",
  "statements.guide": "Go to guide",
  "statements.switchNetwork": "Add or Switch Network",
};

export const PORTUGUESE_TERMS: Record<TranslationKeys, string> = {
  ...generalTerms,
  ...gameTerms,
  ...welcomeTerms,
  ...rulesTerms,
  ...seasonBannerOffer,
  ...introTerms,
  ...achievementTerms,
  ...guideTerms,
  ...conversations,
  ...henHouseTerms,
  ...shopItems,
  ...rewardTerms,
  ...confirmationTerms,
  ...errorTerms,
  ...transactionTerms,
  ...onboarding,
  ...questions,
  ...statements,
};
