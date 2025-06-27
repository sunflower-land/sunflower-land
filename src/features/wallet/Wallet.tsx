import { useSelector } from "@xstate/react";
import React, { useContext, useLayoutEffect, useRef, useState } from "react";

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
import { networkOptions } from "features/game/expansion/components/dailyReward/DailyReward";
import { shortAddress } from "lib/utils/shortAddress";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NoNFT } from "./components/NoNFT";
import classNames from "classnames";
import { createPortal } from "react-dom";

export type WalletAction =
  | "specialEvent"
  | "login"
  | "depositItems"
  | "depositFlower"
  | "donate"
  | "dailyReward"
  | "withdrawItems"
  | "withdrawFlower"
  | "dequip"
  | "marketplace"
  | "transfer"
  | "sync"
  | "purchase";

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

const WalletConnectedHeader: React.FC<{ availableChains: number[] }> = ({
  availableChains,
}) => {
  const { chainId, address, connector, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending } = useSwitchChain();
  const connections = useConnections();
  const { t } = useAppTranslation();

  const buttonRef = useRef<HTMLDivElement>(null);

  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [chainDropdownPosition, setChainDropdownPosition] = useState({
    top: 0,
    left: 0,
  });

  useLayoutEffect(() => {
    if (showChainDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setChainDropdownPosition({
        top: rect.bottom,
        left: rect.left,
      });
    }
  }, [showChainDropdown]);

  const filteredNetworkOptions = networkOptions.filter((network) =>
    availableChains.includes(network.chainId),
  );

  const onDisconnect = () => {
    disconnect();
    connections.forEach((connection) =>
      disconnect({ connector: connection.connector }),
    );
  };

  const chainName = chain?.name ?? "Select Network";
  const chainIcon = networkOptions.find(
    (network) => network.chainId === chainId,
  )?.icon;

  return (
    <div className="flex justify-between items-center px-2">
      <div className="relative">
        <div ref={buttonRef}>
          <Label
            type="formula"
            icon={isPending ? undefined : chainIcon}
            secondaryIcon={
              showChainDropdown
                ? SUNNYSIDE.icons.chevron_up
                : SUNNYSIDE.icons.chevron_down
            }
            className={classNames("cursor-pointer", {
              "pl-1": isPending,
            })}
            onClick={() => {
              setShowChainDropdown(!showChainDropdown);
              setShowWalletDropdown(false);
            }}
          >
            {isPending ? "Switching Network..." : chainName}
          </Label>
        </div>
        {/* Put in a portal to break it out of the modal stacking context which was blocking its zIndex */}
        {showChainDropdown &&
          createPortal(
            <div
              className="absolute left-0 mt-1"
              style={{
                zIndex: 10000,
                top: chainDropdownPosition.top,
                left: chainDropdownPosition.left,
              }}
            >
              <InnerPanel className="flex flex-col">
                {filteredNetworkOptions.map((network) => (
                  <div
                    key={network.chainId}
                    className="flex items-center gap-2 cursor-pointer hover:bg-[#ead4aa]/50 py-1.5 px-2"
                    onClick={() => {
                      setShowChainDropdown(false);
                      switchChain({ chainId: network.chainId });
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
            </div>,
            document.getElementById("headlessui-portal-root") || document.body,
          )}
      </div>
      <div className="relative">
        {address && (
          <Label
            type="default"
            icon={getWalletIcon(connector)}
            secondaryIcon={
              showWalletDropdown
                ? SUNNYSIDE.icons.chevron_up
                : SUNNYSIDE.icons.chevron_down
            }
            className="cursor-pointer"
            onClick={() => {
              setShowChainDropdown(false);
              setShowWalletDropdown(!showWalletDropdown);
            }}
          >
            {shortAddress(address)}
          </Label>
        )}
        {showWalletDropdown && (
          <div className="absolute right-0 mt-1 z-50">
            <InnerPanel className="flex flex-col">
              <div
                className="flex items-center gap-2 cursor-pointer hover:bg-[#ead4aa]/50 pb-1 px-2"
                onClick={onDisconnect}
              >
                <span className="text-sm">{t("walletWall.disconnect")}</span>
              </div>
            </InnerPanel>
          </div>
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
  donate: "donate",
  dailyReward: "claim the daily reward",
  withdrawItems: "withdraw items",
  withdrawFlower: "withdraw flower",
  dequip: "dequip",
  marketplace: "marketplace",
  transfer: "transfer",
  sync: "sync",
  purchase: "purchase",
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
        {isPending ? "Switching Network..." : text}
      </div>
    </>
  );
};

export const Wallet: React.FC<Props> = ({
  children,
  action,
  linkedAddress,
  farmAddress,
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
