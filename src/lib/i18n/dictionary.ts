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

type Season =
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

export type TranslationKeys = WelcomeTerms | GeneralTerms | Rules | Season;

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

      // Season
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
    },
  },
};
