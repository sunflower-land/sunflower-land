// Type declarations for the MoonForge Web SDK (generated JS modules).
export type ErrorLevelValue = "info" | "warning" | "error" | "fatal";
export type BreadcrumbTypeValue =
  | "navigation"
  | "network"
  | "user"
  | "debug"
  | "error";
export type BreadcrumbLevelValue =
  | "debug"
  | "info"
  | "warning"
  | "error"
  | "fatal";

export interface MoonForgeInitOptions {
  gameId: string;
  apiEndpoint?: string;
  debug?: boolean;
  autoTrackSession?: boolean;
  trackNetworkErrors?: boolean;
  appVersion?: string;
  buildNumber?: string;
}

export interface MoonForgeGameState {
  sceneName?: string;
  gameMode?: string;
  levelId?: string;
}

export const MoonForgeAnalytics: {
  markIdentified(): void;
  resetBuffering(): void;
  init(options: MoonForgeInitOptions): MoonForgeInitOptions | undefined;
  trackEvent(
    name: string,
    data?: Record<string, unknown>,
    opts?: { beacon?: boolean },
  ): Promise<boolean> | undefined;
  trackScreenView(
    name: string,
    opts?: { beacon?: boolean },
  ): Promise<boolean> | undefined;
  identify(
    userId: string,
    traits?: Record<string, unknown>,
  ): Promise<boolean> | undefined;
  setUserProperty(key: string, value: unknown): void;
  removeUserProperty(key: string): void;
  clearUserProperties(): void;
  getDistinctId(): string;
  getSessionId(): string;
  reset(): void;
  flush(): Promise<boolean>;
};

export const MoonForgeErrorTracker: {
  setUser(userId: string, tags?: Record<string, string>): void;
  clearUser(): void;
  setGameState(state: MoonForgeGameState): void;
  setGameStateData(key: string, value: unknown): void;
  getGameState(): MoonForgeGameState & { customData?: Record<string, unknown> };
  clearGameState(): void;
  addBreadcrumb(
    message: string,
    options?: {
      type?: BreadcrumbTypeValue;
      level?: BreadcrumbLevelValue;
      category?: string;
      data?: Record<string, unknown>;
    },
  ): {
    type: BreadcrumbTypeValue;
    level: BreadcrumbLevelValue;
    message: string;
    category?: string;
    data?: Record<string, unknown>;
    timestamp: number;
  };
  captureException(
    error: unknown,
    options?: {
      level?: ErrorLevelValue;
      tags?: Record<string, string>;
      category?: "handled" | "unhandled";
    },
  ): Promise<boolean> | false | undefined;
  captureMessage(
    message: string,
    options?: { level?: ErrorLevelValue; tags?: Record<string, string> },
  ): Promise<boolean> | false | undefined;
  captureNetworkError(
    url: string,
    options?: {
      method?: string;
      statusCode?: number;
      errorMessage?: string;
      durationMs?: number;
      tags?: Record<string, string>;
    },
  ): Promise<boolean> | false | undefined;
  flush(): Promise<boolean>;
};

export const ErrorLevel: Readonly<{
  Info: "info";
  Warning: "warning";
  Error: "error";
  Fatal: "fatal";
}>;
export const BreadcrumbType: Readonly<{
  Navigation: "navigation";
  Network: "network";
  User: "user";
  Debug: "debug";
  Error: "error";
}>;
export const BreadcrumbLevel: Readonly<{
  Debug: "debug";
  Info: "info";
  Warning: "warning";
  Error: "error";
  Fatal: "fatal";
}>;
