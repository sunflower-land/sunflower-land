import React from "react";
import { useInterpret } from "@xstate/react";
import { MachineInterpreter, walletMachine } from "./walletMachine";
import { CONFIG } from "lib/config";

import { http, createConfig, fallback, injected } from "@wagmi/core";
import {
  base,
  baseSepolia,
  polygon,
  polygonAmoy,
  ronin,
  saigon,
} from "@wagmi/core/chains";
import { walletConnect, metaMask } from "@wagmi/connectors";
import { sequenceWallet } from "@0xsequence/wagmi-connector";
import { WaypointProvider } from "@sky-mavis/waypoint";
import { EIP1193Provider } from "viem";

export const WalletContext = React.createContext<{
  walletService: MachineInterpreter;
}>(
  {} as {
    walletService: MachineInterpreter;
  },
);

export const sequenceConnector = sequenceWallet({
  defaultNetwork: "polygon",
  connectOptions: {
    app: "Sunflower Land",
    projectAccessKey: CONFIG.SEQUENCE_ACCESS_KEY,
    settings: {
      theme: "dark",
      bannerUrl: "https://sunflower-land.com/play/brand/sequence_banner.png",
      includedPaymentProviders: ["ramp"],
      lockFundingCurrencyToDefault: true,
      defaultFundingCurrency: "matic",
      defaultPurchaseAmount: 10,
    },
  },
});

export const walletConnectConnector = walletConnect({
  projectId: CONFIG.WALLETCONNECT_PROJECT_ID,
});

export const metaMaskConnector = metaMask();

export const cryptoComConnector = injected({
  target() {
    if (typeof (window as any).deficonnectProvider !== "undefined") {
      return {
        id: "CryptoCom",
        name: "Crypto Com Provider",
        provider: (window as any).deficonnectProvider,
      };
    }

    if (navigator?.userAgent?.includes("DeFiWallet") && window.ethereum) {
      return {
        id: "CryptoCom",
        name: "Crypto Com Provider",
        provider: window.ethereum,
      };
    }

    return {
      id: "windowProvider",
      name: "Crypto Com Provider",
      provider: undefined,
    };
  },
});

export const bitGetConnector = injected({
  target: "bitKeep",
});

export const okexConnector = injected({
  target: "okxWallet",
});

export const phantomConnector = injected({
  target: "phantom",
});

export const fallbackConnector = injected({
  target() {
    return {
      id: "injected",
      name: "Injected Wallet",
      provider: window.ethereum,
    };
  },
});

export const waypointConnector = injected({
  target() {
    return {
      id: "waypoint",
      name: "Ronin Waypoint",
      provider: WaypointProvider.create({
        clientId: "f71ef546-f5e5-49a9-8835-f89b60868622",
        chainId: 2021,
      }) as EIP1193Provider,
    };
  },
});

type SupportedChain =
  | "polygon"
  | "polygonAmoy"
  | "base"
  | "baseSepolia"
  | "ronin"
  | "saigon";

const getAlchemyRpc = (chain: SupportedChain) => {
  switch (chain) {
    case "polygon":
      return `https://polygon-mainnet.g.alchemy.com/v2/${CONFIG.ALCHEMY_KEY}`;
    case "polygonAmoy":
      return `https://polygon-amoy.g.alchemy.com/v2/${CONFIG.ALCHEMY_KEY}`;
    case "base":
      return `https://base-mainnet.g.alchemy.com/v2/${CONFIG.ALCHEMY_KEY}`;
    case "baseSepolia":
      return `https://base-sepolia.g.alchemy.com/v2/${CONFIG.ALCHEMY_KEY}`;
    case "ronin":
      return `https://base-sepolia.g.alchemy.com/v2/${CONFIG.ALCHEMY_KEY}`;
    case "saigon":
      return `https://base-sepolia.g.alchemy.com/v2/${CONFIG.ALCHEMY_KEY}`;
  }
};

export const config = createConfig({
  chains:
    CONFIG.NETWORK === "mainnet"
      ? [polygon, ronin, base]
      : [polygonAmoy, saigon, baseSepolia],
  multiInjectedProviderDiscovery: true,
  connectors: [
    sequenceConnector,
    walletConnectConnector,
    cryptoComConnector,
    bitGetConnector,
    okexConnector,
    phantomConnector,
    fallbackConnector,
    waypointConnector,
  ],
  transports: {
    // Testnet
    [polygon.id]: fallback([http(), http(getAlchemyRpc("polygon"))]),
    [ronin.id]: fallback([http(), http(getAlchemyRpc("ronin"))]),
    [base.id]: fallback([http(), http(getAlchemyRpc("base"))]),

    // On Testnet use Alchemy RPC - as public testnet RPCs are unreliable
    [polygonAmoy.id]: fallback([http(getAlchemyRpc("polygonAmoy")), http()]),
    [saigon.id]: fallback([http(getAlchemyRpc("saigon")), http()]),
    [baseSepolia.id]: fallback([http(getAlchemyRpc("baseSepolia")), http()]),
  },
});

export const WalletProvider: React.FC = ({ children }) => {
  const walletService = useInterpret(
    walletMachine,
  ) as unknown as MachineInterpreter;

  return (
    <WalletContext.Provider value={{ walletService }}>
      {children}
    </WalletContext.Provider>
  );
};
