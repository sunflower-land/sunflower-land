// Settings-menu types shared between GameOptions and the content
// components it routes to. Kept in a leaf module so content components
// can depend on these without forming a source-level cycle through
// GameOptions (which itself imports those content components).

export type SettingMenuId =
  // Game Options
  | "main"
  | "installApp"
  | "account"
  | "advanced"
  | "about"
  | "amoy"
  | "blockchain"
  | "linkedAccounts"
  | "linkAccountWallet"
  | "linkAccountGoogle"
  | "linkAccountGoogleManage"
  | "linkAccountTwitter"
  | "linkAccountTelegram"
  | "linkAccountDiscord"
  | "referAFriend"
  | "streams"
  | "plaza"
  | "experiments"
  | "economyEditor"
  | "interiorExperiment"
  | "toolShopBuyAll"
  | "admin"
  | "faceRecognition"

  // Account / Preferences
  | "changeLanguage"
  | "preferences"
  | "appearance"
  | "behaviour"
  | "audio"
  | "notifications"
  | "apiKey"

  // Amoy Testnet Actions
  | "playerSearch"
  | "errorSearch"
  // Plaza Settings
  | "pickServer"
  | "shader";

export interface ContentComponentProps {
  onSubMenuClick: (id: SettingMenuId) => void;
  onClose: () => void;
}
