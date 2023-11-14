// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "done.invoke.authMachine.oauthorising:invocation[0]": {
      type: "done.invoke.authMachine.oauthorising:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.authMachine.setupContracts:invocation[0]": {
      type: "done.invoke.authMachine.setupContracts:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.authMachine.signing:invocation[0]": {
      type: "done.invoke.authMachine.signing:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.connectingToWallet:invocation[0]": {
      type: "done.invoke.connectingToWallet:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.authMachine.oauthorising:invocation[0]": {
      type: "error.platform.authMachine.oauthorising:invocation[0]";
      data: unknown;
    };
    "error.platform.authMachine.setupContracts:invocation[0]": {
      type: "error.platform.authMachine.setupContracts:invocation[0]";
      data: unknown;
    };
    "error.platform.authMachine.signing:invocation[0]": {
      type: "error.platform.authMachine.signing:invocation[0]";
      data: unknown;
    };
    "error.platform.connectingToWallet:invocation[0]": {
      type: "error.platform.connectingToWallet:invocation[0]";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    initWallet: "done.invoke.connectingToWallet:invocation[0]";
    login: "done.invoke.authMachine.signing:invocation[0]";
    oauthorise: "done.invoke.authMachine.oauthorising:invocation[0]";
    setupContracts: "done.invoke.authMachine.setupContracts:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    assignErrorMessage:
      | "error.platform.authMachine.oauthorising:invocation[0]"
      | "error.platform.authMachine.setupContracts:invocation[0]"
      | "error.platform.authMachine.signing:invocation[0]"
      | "error.platform.connectingToWallet:invocation[0]";
    assignToken:
      | "SET_TOKEN"
      | "VERIFIED"
      | "done.invoke.authMachine.oauthorising:invocation[0]"
      | "done.invoke.authMachine.signing:invocation[0]";
    assignUser: "SET_WALLET" | "done.invoke.connectingToWallet:invocation[0]";
    assignVisitingFarmIdFromUrl: "done.invoke.authMachine.setupContracts:invocation[0]";
    clearSession: "LOGOUT";
    clearTransactionId:
      | "VERIFIED"
      | "done.invoke.authMachine.oauthorising:invocation[0]"
      | "done.invoke.authMachine.signing:invocation[0]";
    deleteFarmIdUrl: "RETURN";
    refreshFarm:
      | "ACCOUNT_CHANGED"
      | "CHAIN_CHANGED"
      | "LOGOUT"
      | "REFRESH"
      | "RETURN";
    setTransactionId:
      | ""
      | "SIGN"
      | "done.invoke.authMachine.setupContracts:invocation[0]"
      | "done.invoke.authMachine.signing:invocation[0]";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    hasDiscordCode: "done.invoke.authMachine.signing:invocation[0]";
    isVisitingUrl: "done.invoke.authMachine.setupContracts:invocation[0]";
  };
  eventsCausingServices: {
    initWallet: "" | "CONNECT_TO_WALLET";
    login: "" | "SIGN" | "done.invoke.authMachine.setupContracts:invocation[0]";
    oauthorise: "done.invoke.authMachine.signing:invocation[0]";
    setupContracts: "done.invoke.connectingToWallet:invocation[0]";
  };
  matchesStates:
    | "connected"
    | "connectedToWallet"
    | "connectingToWallet"
    | "createWallet"
    | "idle"
    | "oauthorising"
    | "reconnecting"
    | "setupContracts"
    | "signIn"
    | "signing"
    | "unauthorised"
    | "verifying"
    | "visiting"
    | "welcome";
  tags: never;
}
