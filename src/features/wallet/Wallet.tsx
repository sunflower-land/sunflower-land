import { useSelector } from "@xstate/react";
import React, { useContext } from "react";

import { WalletAction } from "features/wallet/walletMachine";

import { Context } from "features/game/GameProvider";

import { useAccount, useDisconnect } from "wagmi";
import {
  SelectChain,
  WalletConnectedHeader,
} from "features/auth/components/SignIn";
import { MachineState } from "features/game/lib/gameMachine";
import { isAddressEqual } from "viem";
import { Button } from "components/ui/Button";
import {
  base,
  baseSepolia,
  polygon,
  polygonAmoy,
  ronin,
  saigon,
} from "@wagmi/core/chains";
import { CONFIG } from "lib/config";
import { Reputation } from "features/game/lib/reputation";
import { ConnectWallet } from "./components/ConnectWallet";
import { LinkWallet } from "./components/LinkWallet";
import { ConnectLinkedWallet } from "./components/ConnectLinkedWallet";
import { SelectLinkedWallet } from "./components/SelectLinkedWallet";

interface Props {
  action: WalletAction;
  id?: number;
  linkedAddress?: string;
  farmAddress?: string;
  wallet?: string;
  reputation?: Reputation;
}

type WalletActionSettings = {
  requiresLinkedWallet: boolean;
  requiresNFT: boolean;
  chains: {
    [polygon.id]?: true;
    [polygonAmoy.id]?: true;
    [ronin.id]?: true;
    [saigon.id]?: true;
    [base.id]?: true;
    [baseSepolia.id]?: true;
  };
};

const WALLET_ACTIONS: Record<WalletAction, WalletActionSettings> = {
  specialEvent: {
    requiresLinkedWallet: false,
    requiresNFT: false,
    chains: {},
  },
  login: {
    requiresLinkedWallet: false,
    requiresNFT: false,
    chains: {},
  },
  depositItems: {
    requiresLinkedWallet: true,
    requiresNFT: false,
    chains: {
      [CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id]: true,
    },
  },
  confirmDepositItems: {
    requiresLinkedWallet: true,
    requiresNFT: true,
    chains: {
      [CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id]: true,
    },
  },
  depositFlower: {
    requiresLinkedWallet: false,
    requiresNFT: false,
    chains: {
      [CONFIG.NETWORK === "mainnet" ? base.id : baseSepolia.id]: true,
    },
  },
  donate: {
    requiresLinkedWallet: false,
    requiresNFT: false,
    chains: {
      [CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id]: true,
    },
  },
  dailyReward: {
    requiresLinkedWallet: false,
    requiresNFT: false,
    chains: {
      [CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id]: true,
      [CONFIG.NETWORK === "mainnet" ? base.id : baseSepolia.id]: true,
      [CONFIG.NETWORK === "mainnet" ? ronin.id : saigon.id]: true,
    },
  },
  withdraw: {
    requiresLinkedWallet: true,
    requiresNFT: true,
    chains: {
      [CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id]: true,
    },
  },
  dequip: {
    requiresLinkedWallet: true,
    requiresNFT: true,
    chains: {
      [CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id]: true,
    },
  },
  marketplace: {
    requiresLinkedWallet: true,
    requiresNFT: false,
    chains: {},
  },
  transfer: {
    requiresLinkedWallet: true,
    requiresNFT: true,
    chains: {
      [CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id]: true,
    },
  },
  sync: {
    requiresLinkedWallet: true,
    requiresNFT: true,
    chains: {
      [CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id]: true,
    },
  },
  purchase: {
    requiresLinkedWallet: true,
    requiresNFT: true,
    chains: {
      [CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id]: true,
    },
  },
};

const EstablishConnection: React.FC<{
  action: WalletAction;
  linkedAddress: string;
}> = ({ action, linkedAddress }) => {
  const { requiresLinkedWallet } = WALLET_ACTIONS[action];
  const hasLinkedWallet = !!linkedAddress;

  if (!requiresLinkedWallet) {
    return <ConnectWallet />;
  }

  if (!hasLinkedWallet) {
    return <LinkWallet />;
  }

  return <ConnectLinkedWallet linkedWallet={linkedAddress as `0x${string}`} />;
};

export const Wallet: React.FC<Props> = ({
  children,
  action,
  linkedAddress,
  farmAddress,
}) => {
  const { address, isConnected, chainId } = useAccount();
  const { disconnect } = useDisconnect();

  const { requiresLinkedWallet, requiresNFT, chains } = WALLET_ACTIONS[action];
  const requiresChain = Object.values(chains).some(Boolean);
  const requiresConnection = requiresChain;
  const requiresLinkedWalletSelected =
    requiresConnection && requiresLinkedWallet;

  const hasLinkedWallet = !!linkedAddress;
  const hasNFT = !!farmAddress;
  const hasConnection = isConnected;
  const hasChain = !!chainId && chainId in chains;
  const hasLinkedWalletSelected =
    !!address &&
    !!linkedAddress &&
    isAddressEqual(address, linkedAddress as `0x${string}`);

  const availableChains = Object.keys(WALLET_ACTIONS[action].chains).map(
    Number,
  );

  if (requiresConnection && !hasConnection) {
    return (
      <EstablishConnection
        action={action}
        linkedAddress={linkedAddress as `0x${string}`}
      />
    );
  }

  if (requiresLinkedWallet && !hasLinkedWallet) {
    return <LinkWallet />;
  }

  if (requiresLinkedWalletSelected && !hasLinkedWalletSelected) {
    return <SelectLinkedWallet linkedWallet={linkedAddress as `0x${string}`} />;
  }

  if (requiresChain && !hasChain) {
    return <SelectChain availableChains={availableChains} />;
  }

  if (requiresNFT && !hasNFT) {
    return <>NO NFT</>;
  }

  return (
    <>
      <WalletConnectedHeader />
      {children}
      <Button onClick={() => disconnect()}>Disconnect Wallet</Button>
    </>
  );
};

const _farmId = (state: MachineState) => state.context.farmId;
const _farmAddress = (state: MachineState) => state.context.farmAddress;
const _wallet = (state: MachineState) => state.context.wallet;
const _linkedWallet = (state: MachineState): string | undefined =>
  state.context.linkedWallet;

export const GameWallet: React.FC<Props> = ({ children, action }) => {
  const { gameService } = useContext(Context);

  const farmId = useSelector(gameService, _farmId);
  const linkedWallet = useSelector(gameService, _linkedWallet);
  const farmAddress = useSelector(gameService, _farmAddress);
  const wallet = useSelector(gameService, _wallet);

  return (
    <>
      <Wallet
        action={action}
        id={farmId}
        linkedAddress={linkedWallet}
        wallet={wallet}
        farmAddress={farmAddress}
      >
        {children}
      </Wallet>
    </>
  );
};
