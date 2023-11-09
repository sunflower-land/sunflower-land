export type LanguageCode = "en" | "pt";

type GeneralTerms = "featured" | "connecting" | "loading" | "continue";

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

export type TranslationKeys = WelcomeTerms | GeneralTerms | Rules;

export type TranslationResource = Record<TranslationKeys, string>;

export const resources: Record<
  LanguageCode,
  { translation: TranslationResource }
> = {
  en: {
    translation: {
      featured: "Featured",
      "welcome.otherWallets": "Other wallets",
      "welcome.needHelp": "Need help?",
      "welcome.createAccount": "Create account",
      connecting: "Connecting",
      loading: "Loading",
      "welcome.login": "Login",
      "welcome.signingIn": "Signing you in",
      "welcome.signInMessage":
        "Accept the signature request in your browser wallet to login.",

      rules: "Game Rules",
      "rules.accounts": "1 account per player",
      "rules.noBots": "No botting or automation",
      "rules.game": "This is a game. Not a financial product.",
      continue: "Continue",
      "rules.termsOfService": "Terms of Service",
    },
  },
  pt: {
    translation: {
      featured: "Destaque",
      "welcome.otherWallets": "Outras carteiras",
      "welcome.needHelp": "Ajuda?",
      "welcome.createAccount": "Criar conta",
      connecting: "Conectando",
      loading: "Carregando",
      "welcome.login": "Entrar",
      "welcome.signingIn": "Entrando",
      "welcome.signInMessage":
        "Aceite a requisição de assinatura na sua carteira para entrar.",
      rules: "Regras do Jogo",
      "rules.accounts": "1 conta por jogador",
      "rules.noBots": "Sem bots ou automação",
      "rules.game": "Isto é um jogo. Não um produto financeiro.",
      continue: "Continuar",
      "rules.termsOfService": "Termos de Serviço",
    },
  },
};
