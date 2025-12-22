import { useSelector } from "@xstate/react";
import React, { PropsWithChildren, useContext } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

import { Context } from "features/game/GameProvider";

import {
  useAccount,
  useConnections,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { MachineState } from "features/game/lib/gameMachine";
import { isAddressEqual } from "viem";
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
import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { getWalletIcon } from "./lib/getWalletIcon";
import { Label } from "components/ui/Label";
import { shortAddress } from "lib/utils/shortAddress";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NoNFT } from "./components/NoNFT";
import classNames from "classnames";
import { NetworkName } from "features/game/events/landExpansion/updateNetwork";
import baseIcon from "assets/icons/chains/base.png";

export type NetworkOption = {
  value: NetworkName;
  icon: string;
  chainId: number;
};

export const BASE_MAINNET_NETWORK: NetworkOption = {
  value: "Base",
  icon: baseIcon,
  chainId: 8453,
};

export const POLYGON_MAINNET_NETWORK: NetworkOption = {
  value: "Polygon",
  icon: SUNNYSIDE.icons.polygonIcon,
  chainId: 137,
};

export const RONIN_MAINNET_NETWORK: NetworkOption = {
  value: "Ronin",
  icon: SUNNYSIDE.icons.roninIcon,
  chainId: 2020,
};

const MAINNET_NETWORKS: NetworkOption[] = [
  BASE_MAINNET_NETWORK,
  RONIN_MAINNET_NETWORK,
  POLYGON_MAINNET_NETWORK,
];

export const BASE_TESTNET_NETWORK: NetworkOption = {
  value: "Base Sepolia",
  icon: baseIcon,
  chainId: 84532,
};

export const POLYGON_TESTNET_NETWORK: NetworkOption = {
  value: "Polygon Amoy",
  icon: SUNNYSIDE.icons.polygonIcon,
  chainId: 80002,
};

export const RONIN_TESTNET_NETWORK: NetworkOption = {
  value: "Ronin Saigon",
  icon: SUNNYSIDE.icons.roninIcon,
  chainId: 2021,
};

const TESTNET_NETWORKS: NetworkOption[] = [
  BASE_TESTNET_NETWORK,
  RONIN_TESTNET_NETWORK,
  POLYGON_TESTNET_NETWORK,
];

// Select appropriate network options based on config
export const networkOptions =
  CONFIG.NETWORK === "mainnet" ? MAINNET_NETWORKS : TESTNET_NETWORKS;

export type WalletAction =
  | "specialEvent"
  | "login"
  | "depositItems"
  | "depositFlower"
  | "depositSFL"
  | "donate"
  | "dailyReward"
  | "withdrawItems"
  | "withdrawFlower"
  | "dequip"
  | "marketplace"
  | "transfer"
  | "sync"
  | "purchase"
  | "raffle"
  | "auction"
  | "linkWallet";

interface Props {
  action: WalletAction;
  id?: number;
  linkedAddress?: string;
  farmAddress?: string;
  wallet?: string;
  reputation?: Reputation;
  enforceChainId?: number;
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
    chains: {
      [CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id]: true,
      [CONFIG.NETWORK === "mainnet" ? base.id : baseSepolia.id]: true,
      [CONFIG.NETWORK === "mainnet" ? ronin.id : saigon.id]: true,
    },
  },
  depositItems: {
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
      [CONFIG.NETWORK === "mainnet" ? ronin.id : saigon.id]: true,
    },
  },
  depositSFL: {
    requiresLinkedWallet: true,
    requiresNFT: false,
    chains: {
      [CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id]: true,
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
  withdrawItems: {
    requiresLinkedWallet: true,
    requiresNFT: true,
    chains: {
      [CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id]: true,
    },
  },
  withdrawFlower: {
    requiresLinkedWallet: true,
    requiresNFT: false,
    chains: {
      [CONFIG.NETWORK === "mainnet" ? base.id : baseSepolia.id]: true,
      [CONFIG.NETWORK === "mainnet" ? ronin.id : saigon.id]: true,
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
  auction: {
    requiresLinkedWallet: true,
    requiresNFT: true,
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
  raffle: {
    requiresLinkedWallet: true,
    requiresNFT: true,
    chains: {},
  },
  linkWallet: {
    requiresLinkedWallet: true,
    requiresNFT: false,
    chains: {},
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

interface SelectChainDropdownProps {
  availableChains: number[];
  switchChain: ({ chainId }: { chainId: number }) => void;
  isPending: boolean;
  chainIcon: string | undefined;
  chainName: string;
}

export const SelectChainDropdown: React.FC<SelectChainDropdownProps> = ({
  availableChains,
  switchChain,
  isPending,
  chainIcon,
  chainName,
}) => {
  const { t } = useAppTranslation();

  const filteredNetworkOptions = networkOptions.filter((network) =>
    availableChains.includes(network.chainId),
  );

  return (
    <Popover>
      {({ open, close }) => (
        <>
          <PopoverButton>
            <Label
              type="formula"
              icon={isPending ? undefined : chainIcon}
              secondaryIcon={
                open ? SUNNYSIDE.icons.chevron_up : SUNNYSIDE.icons.chevron_down
              }
              className={classNames("cursor-pointer", {
                "pl-1": isPending,
              })}
            >
              {isPending ? t("switching.network") : chainName}
            </Label>
          </PopoverButton>
          <PopoverPanel anchor={{ to: "bottom start" }}>
            <InnerPanel className="flex flex-col">
              {filteredNetworkOptions.map((network) => (
                <div
                  key={network.chainId}
                  className="flex items-center gap-2 cursor-pointer hover:bg-[#ead4aa]/50 py-1.5 px-2"
                  onClick={() => {
                    switchChain({ chainId: network.chainId });
                    close();
                  }}
                >
                  {network.icon && (
                    <img src={network.icon} className="pl-1 w-5" />
                  )}
                  <span className="text-sm whitespace-nowrap pr-4">
                    {network.value}
                  </span>
                </div>
              ))}
            </InnerPanel>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
};

const WalletConnectedHeader: React.FC<{ availableChains: number[] }> = ({
  availableChains,
}) => {
  const { chainId, address, connector, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending } = useSwitchChain();
  const connections = useConnections();
  const { t } = useAppTranslation();

  const onDisconnect = () => {
    disconnect();
    connections.forEach((connection) =>
      disconnect({ connector: connection.connector }),
    );
  };

  const chainName = chain?.name ?? t("select.network");
  const chainIcon = networkOptions.find(
    (network) => network.chainId === chainId,
  )?.icon;

  return (
    <div className="flex justify-between items-center px-2">
      <div className="relative">
        <SelectChainDropdown
          availableChains={availableChains}
          switchChain={switchChain}
          isPending={isPending}
          chainIcon={chainIcon}
          chainName={chainName}
        />
      </div>
      <div className="relative">
        {address && (
          <Popover>
            {({ open }) => (
              <>
                <PopoverButton>
                  <Label
                    type="default"
                    icon={getWalletIcon(connector)}
                    secondaryIcon={
                      open
                        ? SUNNYSIDE.icons.chevron_up
                        : SUNNYSIDE.icons.chevron_down
                    }
                    className="cursor-pointer"
                  >
                    {shortAddress(address)}
                  </Label>
                </PopoverButton>
                <PopoverPanel anchor={{ to: "bottom end" }}>
                  <InnerPanel className="flex flex-col">
                    <div
                      className="flex items-center gap-2 cursor-pointer hover:bg-[#ead4aa]/50 pb-1 px-2"
                      onClick={onDisconnect}
                    >
                      <span className="text-sm">
                        {t("walletWall.disconnect")}
                      </span>
                    </div>
                  </InnerPanel>
                </PopoverPanel>
              </>
            )}
          </Popover>
        )}
      </div>
    </div>
  );
};

const ACTION_HUMAN_NAMES: Record<WalletAction, string> = {
  specialEvent: "use this special event",
  login: "login",
  depositItems: "deposit items",
  depositFlower: "deposit FLOWER",
  depositSFL: "deposit SFL",
  donate: "donate",
  dailyReward: "claim the daily reward",
  withdrawItems: "withdraw items",
  withdrawFlower: "withdraw flower",
  dequip: "dequip",
  marketplace: "marketplace",
  transfer: "transfer",
  sync: "sync",
  purchase: "purchase",
  raffle: "enter the raffle",
  auction: "auction",
  linkWallet: "link wallet",
};

const SelectChain: React.FC<{
  action: WalletAction;
  availableChains: number[];
}> = ({ action, availableChains }) => {
  const { t } = useAppTranslation();
  const { isPending } = useSwitchChain();

  const filteredNetworkOptions = networkOptions.filter((network) =>
    availableChains.includes(network.chainId),
  );

  const multipleNetworks = filteredNetworkOptions.length > 1;

  const text = multipleNetworks
    ? t("walletWall.selectANetwork", {
        action: ACTION_HUMAN_NAMES[action],
      })
    : t("walletWall.selectSpecificNetwork", {
        network: filteredNetworkOptions[0].value,
        action: ACTION_HUMAN_NAMES[action],
      });

  return (
    <>
      <WalletConnectedHeader availableChains={availableChains} />
      <div className="text-sm p-2">
        {isPending ? t("switching.network") : text}
      </div>
    </>
  );
};

export const Wallet: React.FC<PropsWithChildren<Props>> = ({
  children,
  action,
  linkedAddress,
  farmAddress,
  enforceChainId,
}) => {
  const { address, isConnected, chainId } = useAccount();

  const { requiresLinkedWallet, requiresNFT, chains } = WALLET_ACTIONS[action];
  const requiresChain = Object.values(chains).some(Boolean);
  const requiresConnection = requiresChain;
  const requiresLinkedWalletSelected =
    requiresConnection && requiresLinkedWallet;

  const hasLinkedWallet = !!linkedAddress;
  const hasNFT = !!farmAddress;
  const hasConnection = isConnected;
  const hasLinkedWalletSelected =
    !!address &&
    !!linkedAddress &&
    isAddressEqual(address, linkedAddress as `0x${string}`);

  const availableChains = enforceChainId
    ? [enforceChainId]
    : Object.keys(WALLET_ACTIONS[action].chains).map(Number);
  const hasChain = !!chainId && availableChains.includes(chainId);

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
    return <SelectChain action={action} availableChains={availableChains} />;
  }

  if (requiresNFT && !hasNFT) {
    return <NoNFT />;
  }

  return (
    <>
      {requiresChain && (
        <WalletConnectedHeader availableChains={availableChains} />
      )}
      {children}
    </>
  );
};

const _farmId = (state: MachineState) => state.context.farmId;
const _farmAddress = (state: MachineState) => state.context.farmAddress;
const _wallet = (state: MachineState) => state.context.wallet;
const _linkedWallet = (state: MachineState): string | undefined =>
  state.context.linkedWallet;

export const GameWallet: React.FC<PropsWithChildren<Props>> = ({
  children,
  action,
  enforceChainId,
}) => {
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
        enforceChainId={enforceChainId}
      >
        {children}
      </Wallet>
    </>
  );
};
