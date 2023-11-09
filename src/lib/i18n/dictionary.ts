export type LanguageCode = "en" | "pt";

type GeneralTerms = "featured" | "connecting" | "loading";

type WelcomeTerms =
  | "welcome.otherWallets"
  | "welcome.needHelp"
  | "welcome.createAccount"
  | "welcome.login"
  | "welcome.signingIn"
  | "welcome.signInMessage";

export type TranslationKeys = WelcomeTerms | GeneralTerms;

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
    },
  },
};
