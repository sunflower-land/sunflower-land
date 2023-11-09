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

export type TranslationKeys =
  | WelcomeTerms
  | GeneralTerms
  | Rules
  | SeasonBannerOffer
  | Intro;

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
    },
  },
};
