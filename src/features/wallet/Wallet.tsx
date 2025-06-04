import { useActor, useSelector } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";

import { Context as AuthContext } from "features/auth/lib/Provider";
import { WalletAction } from "features/wallet/walletMachine";

import walletIcon from "assets/icons/wallet.png";

import { Context } from "features/game/GameProvider";
import { shortAddress } from "lib/utils/shortAddress";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  Connector,
  CreateConnectorFn,
  useAccount,
  useConnect,
  useDisconnect,
} from "wagmi";
import { Label } from "components/ui/Label";
import { MetaMaskButton } from "./components/buttons/MetaMaskButton";
import { CoinbaseButton } from "./components/buttons/CoinbaseButton";
import { RoninButton } from "./components/buttons/RoninButton";
import { OtherWalletsButton } from "./components/buttons/OtherWalletsButton";
import {
  LinkWallet,
  ConnectLinkedWallet,
  SelectLinkedWallet,
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
      [CONFIG.NETWORK === "mainnet" ? base.id : baseSepolia.id]: true,
      [CONFIG.NETWORK === "mainnet" ? ronin.id : saigon.id]: true,
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

export const Wallet: React.FC<Props> = ({
  children,
  action,
  linkedAddress,
  farmAddress,
  id,
}) => {
  const { authService } = useContext(AuthContext);
  const [authState] = useActor(authService);

  const { address, isConnected, connector, chainId, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();

  const { t } = useAppTranslation();

  const icon = connector?.icon ?? walletIcon;

  const hasLinkedWallet = !!linkedAddress;
  const hasNFT = !!farmAddress;

  const requiresLinkedWallet = WALLET_ACTIONS[action].requiresLinkedWallet;
  const requiresNFT = WALLET_ACTIONS[action].requiresNFT;
  const requiresChains = Object.values(WALLET_ACTIONS[action].chains).some(
    Boolean,
  );

  const linkedWalletSelected =
    !!address &&
    hasLinkedWallet &&
    isAddressEqual(address, linkedAddress as `0x${string}`);

  const validChainSelected =
    !!chainId && chainId in WALLET_ACTIONS[action].chains;

  if (!isConnected) {
    return (
      <>
        {!hasLinkedWallet && <LinkWallet />}
        {hasLinkedWallet && (
          <ConnectLinkedWallet linkedWallet={linkedAddress as `0x${string}`} />
        )}
      </>
    );
  }

  if (requiresLinkedWallet && !linkedWalletSelected) {
    return <SelectLinkedWallet linkedWallet={linkedAddress as `0x${string}`} />;
  }

  if (requiresChains && !validChainSelected) {
    return (
      <SelectChain
        availableChains={Object.keys(WALLET_ACTIONS[action].chains).map(Number)}
      />
    );
  }

  // if (walletState.matches("missingNFT")) {
  //   return (
  //     <>
  //       <div className="p-2">
  //         <Label
  //           icon={SUNNYSIDE.resource.pirate_bounty}
  //           type="default"
  //           className="mb-2"
  //         >
  //           {t("wallet.missingNFT")}
  //         </Label>
  //         <p className="text-sm mb-2">
  //           {t("wallet.requireFarmNFT")}
  //           {"."}
  //         </p>
  //         <p className="text-xs mb-2">
  //           {t("wallet.uniqueFarmNFT")}
  //           {"."}
  //         </p>
  //         <p className="text-xs mb-2">
  //           {t("wallet.RequiresPol")}
  //           {"."}
  //         </p>
  //       </div>
  //       <Button onClick={() => walletService.send("MINT")}>
  //         {t("wallet.mintFreeNFT")}
  //       </Button>
  //     </>
  //   );
  // }

  // if (walletState.matches("alreadyLinkedWallet")) {
  //   return (
  //     <div className="p-2">
  //       <Label type="danger" icon={walletIcon}>
  //         {t("wallet.walletAlreadyLinked")}
  //       </Label>
  //       <p className="my-2 text-sm">{`Wallet ${shortAddress(
  //         walletState.context.address as string,
  //       )} has already been linked to an account.`}</p>
  //       <p className="text-xs my-2">
  //         {t("wallet.linkAnotherWallet")}
  //         {"."}
  //       </p>
  //     </div>
  //   );
  // }

  // if (walletState.matches("alreadyHasFarm")) {
  //   return (
  //     <div className="p-2">
  //       <Label type="danger" icon={walletIcon}>
  //         {t("wallet.walletAlreadyLinked")}
  //       </Label>
  //       <p className="my-2 text-sm">{`Wallet ${shortAddress(
  //         walletState.context.address as string,
  //       )} has already been linked to an account.`}</p>
  //       <p className="text-xs my-2">
  //         {t("wallet.transferFarm")}
  //         {"."}
  //       </p>
  //     </div>
  //   );
  // }

  // if (walletState.matches("signingFailed")) {
  //   return (
  //     <>
  //       <div className="p-2">
  //         <Label icon={walletIcon} type="default" className="mb-1">
  //           {t("wallet.signRequest")}
  //         </Label>
  //         <p className="text-sm">
  //           {t("wallet.signRequestInWallet")}
  //           {"."}
  //         </p>
  //       </div>
  //       <div className="flex space-x-1">
  //         <Button onClick={() => walletService.send("BACK")}>
  //           {t("back")}
  //         </Button>
  //         <Button onClick={() => walletService.send("CONTINUE")}>
  //           {t("wallet.signIn")}
  //         </Button>
  //       </div>
  //     </>
  //   );
  // }

  // if (walletState.matches("signing")) {
  //   return (
  //     <>
  //       <div className="p-2">
  //         <Label icon={walletIcon} type="default" className="mb-1">
  //           {t("wallet.signRequest")}
  //         </Label>
  //         <p className="text-sm">
  //           {t("wallet.signRequestInWallet")}
  //           {"."}
  //         </p>
  //       </div>
  //       <div className="flex space-x-1">
  //         <Button onClick={() => walletService.send("BACK")}>
  //           {t("back")}
  //         </Button>
  //         <Button onClick={() => walletService.send("DISCONNECT_WALLET")}>
  //           <span className="whitespace-nowrap">
  //             {t("wallet.disconnectWallet")}
  //           </span>
  //         </Button>
  //       </div>
  //     </>
  //   );
  // }

  // if (walletState.matches("waiting")) {
  //   return (
  //     <NFTWaiting
  //       onComplete={() => walletService.send("CONTINUE")}
  //       readyAt={walletState.context.nftReadyAt as number}
  //     />
  //   );
  // }

  // if (walletState.matches("minting")) {
  //   return <NFTMinting />;
  // }

  // if (walletState.matches("migrating")) {
  //   return <NFTMigrating />;
  // }

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
