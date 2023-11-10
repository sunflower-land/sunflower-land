export type LanguageCode = "en" | "pt";

type GeneralTerms =
  | "featured"
  | "connecting"
  | "loading"
  | "continue"
  | "readMore"
  | "close"
  | "noThanks";

type WelcomeTerms =
  | "welcome.otherWallets"
  | "welcome.needHelp"
  | "welcome.createAccount"
  | "welcome.login"
  | "welcome.signingIn"
  | "welcome.signInMessage";

type Rules =
  | "rules"
  | "rules.accounts"
  | "rules.noBots"
  | "rules.game"
  | "rules.termsOfService";

type SeasonBannerOffer =
  | "season.goodLuck"
  | "season.discount"
  | "season.banner"
  | "season.wearableAirdrop"
  | "season.bonusTickets"
  | "season.boostXP"
  | "season.exclusiveOffer"
  | "season.includes"
  | "season.limitedOffer"
  | "season.accessTo"
  | "season.buyNow";

type Intro =
  | "intro.one"
  | "intro.two"
  | "intro.three"
  | "intro.four"
  | "intro.five";

type AchievementsDialog =
  | "breadWinner.description"
  | "breadWinner.one"
  | "breadWinner.two"
  | "breadWinner.three"
  | "sunSeeker.description"
  | "cabbageKing.description"
  | "jackOLantern.description"
  | "coolFlower.description"
  | "farmHand.description"
  | "beetrootBeast.description"
  | "myLifeIsPotato.description"
  | "rapidRadish.description"
  | "twentyTwentyVision.description"
  | "stapleCrop.description"
  | "sunflowerSuperstar.description"
  | "bumpkinBillionaire.description"
  | "patientParsnips.description"
  | "cropChampion.description"
  | "busyBumpkin.description"
  | "busyBumpkin.one"
  | "busyBumpkin.two"
  | "kissTheCook.description"
  | "bakersDozen.description"
  | "brilliantBumpkin.description"
  | "chefDeCuisine.description"
  | "scarecrowMaestro.description"
  | "scarecrowMaestro.one"
  | "scarecrowMaestro.two"
  | "bigSpender.description"
  | "museum.description"
  | "highRoller.description"
  | "timbeerrr.description"
  | "craftmanship.description"
  | "driller.description"
  | "ironEyes.description"
  | "elDorado.description"
  | "timeToChop.description"
  | "canary.description"
  | "somethingShiny.description"
  | "bumpkinChainsawAmateur.description"
  | "goldFever.description"
  | "explorer.description"
  | "explorer.one"
  | "expansion.description"
  | "wellOfProsperity.description"
  | "wellOfProsperity.one"
  | "wellOfProsperity.two"
  | "fruitAficionado.description"
  | "fruitAficionado.one"
  | "fruitAficionado.two"
  | "orangeSqueeze.description"
  | "appleOfMyEye.description"
  | "blueChip.description"
  | "fruitPlatter.description"
  | "crowdFavourite.description"
  | "deliveryDynamo.description"
  | "deliveryDynamo.one"
  | "deliveryDynamo.two"
  | "seasonedFarmer.description"
  | "seasonedFarmer.one"
  | "seasonedFarmer.two"
  | "seasonedFarmer.three"
  | "treasureHunter.description"
  | "treasureHunter.one"
  | "treasureHunter.two"
  | "eggcellentCollection.description"
  | "eggcellentCollection.one"
  | "eggcellentCollection.two";

export type TranslationKeys =
  | WelcomeTerms
  | GeneralTerms
  | Rules
  | SeasonBannerOffer
  | Intro
  | AchievementsDialog;

export type TranslationResource = Record<TranslationKeys, string>;

export const resources: Record<
  LanguageCode,
  { translation: TranslationResource }
> = {
  en: {
    translation: {
      // Common Terms
      featured: "Featured",
      connecting: "Connecting",
      loading: "Loading",
      continue: "Continue",
      readMore: "Read more",
      close: "Close",
      noThanks: "No thanks",

      // Welcome Page
      "welcome.otherWallets": "Other wallets",
      "welcome.needHelp": "Need help?",
      "welcome.createAccount": "Create account",
      "welcome.login": "Login",
      "welcome.signingIn": "Signing you in",
      "welcome.signInMessage":
        "Accept the signature request in your browser wallet to login.",

      // Rules Modal
      rules: "Game Rules",
      "rules.accounts": "1 account per player",
      "rules.noBots": "No botting or automation",
      "rules.game": "This is a game. Not a financial product.",
      "rules.termsOfService": "Terms of Service",

      // Season Banner Offer
      "season.goodLuck": "Good luck in the season!",
      "season.discount": "25% SFL discount on seasonal items",
      "season.banner": "Seasonal Banner",
      "season.wearableAirdrop": "Seasonal Wearable Airdrop",
      "season.bonusTickets": "Bonus Seasonal Tickets",
      "season.boostXP": "+10% EXP from food",
      "season.exclusiveOffer": "Exclusive offer!",
      "season.includes": "Includes:",
      "season.limitedOffer": " Limited time only!",
      "season.accessTo": "You have access to:",
      "season.buyNow": "Buy Now",

      // Intro
      "intro.one":
        "Howdy there, partner! Welcome to Sunflower Land, the bountiful farming paradise!",
      "intro.two":
        "I'm Otis, an old Bumpkin farmer who's been tending to these lands for longer than I can remember. Truth be told, I could use a little help from a fresh face like you.",
      "intro.three":
        "You see, our little island has so much potential, and with your determination and hard work, we can transform it into a thriving empire!",
      "intro.four":
        "Looks like our little island is getting crowded. If we want to craft buildings and rare NFTs, we'll need more space.",
      "intro.five":
        "Let's first chop down these trees, gather some wood and expand the island.",

      // Achievements Dialog
      // Bread Winner
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
    },
  },
  pt: {
    translation: {
      // Common Terms
      featured: "Destaque",
      connecting: "Conectando",
      loading: "Carregando",
      continue: "Continuar",
      readMore: "Saiba mais",
      close: "Fechar",
      noThanks: "Não, obrigado",

      // Welcome Page
      "welcome.otherWallets": "Outras carteiras",
      "welcome.needHelp": "Ajuda?",
      "welcome.createAccount": "Criar conta",
      "welcome.login": "Entrar",
      "welcome.signingIn": "Entrando",
      "welcome.signInMessage":
        "Aceite a requisição de assinatura na sua carteira para entrar.",

      // Rules <Modal
      rules: "Regras do Jogo",
      "rules.accounts": "1 conta por jogador",
      "rules.noBots": "Sem bots ou automação",
      "rules.game": "Isto é um jogo. Não um produto financeiro.",
      "rules.termsOfService": "Termos de Serviço",

      // Season
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
      "intro.one":
        "Olá, parceiro! Bem-vindo ao Sunflower Land, o paraíso agrícola!",
      "intro.two":
        "Sou Otis, um velho fazendeiro Bumpkin que cuida destas terras há mais tempo do que consigo me lembrar. Para ser sincero, eu poderia usar a ajuda de alguém como você, cheio de energia e com novas ideias.",
      "intro.three":
        "Veja bem, nossa pequena ilha tem um grande potencial, e com sua determinação e empenho, podemos fazer dela um lugar florescente!",
      "intro.four":
        "Parece que nossa pequena ilha está ficando lotada. Se quisermos construir edifícios e NFTs raros, vamos precisar de mais espaço.",
      "intro.five":
        "Vamos primeiro derrubar essas árvores, coletar madeira e expandir a ilha.",

      // Achievements Dialog
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
        "Olá, aventureiro das temporadas! Sunflower Land é conhecido por suas temporadas especiais repletas de itens únicos e surpresas.",
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
    },
  },
};
