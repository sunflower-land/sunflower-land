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
  ConnectWallet,
  LinkedWalletNotConnected,
  LinkedWalletNotSelected,
} from "features/auth/components/SignIn";
import { wallet } from "lib/blockchain/wallet";
import { MachineState } from "features/game/lib/gameMachine";
import { isAddressEqual } from "viem";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { mintNFTFarm } from "./actions/mintFarm";
import { randomID } from "lib/utils/random";
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
};

const WALLET_ACTIONS: Record<WalletAction, WalletActionSettings> = {
  specialEvent: {
    requiresLinkedWallet: false,
    requiresNFT: false,
  },
  login: {
    requiresLinkedWallet: false,
    requiresNFT: false,
  },
  depositItems: {
    requiresLinkedWallet: true,
    requiresNFT: true,
  },
  confirmDepositItems: {
    requiresLinkedWallet: true,
    requiresNFT: true,
  },
  depositFlower: {
    requiresLinkedWallet: false,
    requiresNFT: false,
  },
  donate: {
    requiresLinkedWallet: false,
    requiresNFT: false,
  },
  dailyReward: {
    requiresLinkedWallet: false,
    requiresNFT: false,
  },
  withdraw: {
    requiresLinkedWallet: true,
    requiresNFT: true,
  },
  dequip: {
    requiresLinkedWallet: true,
    requiresNFT: true,
  },
  marketplace: {
    requiresLinkedWallet: true,
    requiresNFT: false,
  },
  transfer: {
    requiresLinkedWallet: true,
    requiresNFT: true,
  },
  sync: {
    requiresLinkedWallet: true,
    requiresNFT: true,
  },
  purchase: {
    requiresLinkedWallet: true,
    requiresNFT: true,
  },
};

const MintNFTFarm = (farmId: number) => {
  const { authService } = useContext(AuthContext);
  const [authState] = useActor(authService);

  const { t } = useAppTranslation();

  const mintFarm = async () => {
    await mintNFTFarm({
      id: farmId,
      jwt: authState.context.user.rawToken as string,
      transactionId: randomID(),
    });
  };

  return (
    <>
      <div className="p-2">
        <Label
          icon={SUNNYSIDE.resource.pirate_bounty}
          type="default"
          className="mb-2"
        >
          {t("wallet.missingNFT")}
        </Label>
        <p className="text-sm mb-2">
          {t("wallet.requireFarmNFT")}
          {"."}
        </p>
        <p className="text-xs mb-2">
          {t("wallet.uniqueFarmNFT")}
          {"."}
        </p>
        <p className="text-xs mb-2">
          {t("wallet.RequiresPol")}
          {"."}
        </p>
      </div>
      <Button onClick={() => mintFarm()}>{t("wallet.mintFreeNFT")}</Button>
    </>
  );
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

  const { address, isConnected, connector, isConnecting, isReconnecting } =
    useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();

  const { t } = useAppTranslation();

  const icon = connector?.icon ?? walletIcon;

  const requiresLinkedWallet = WALLET_ACTIONS[action].requiresLinkedWallet;
  const requiresNFT = WALLET_ACTIONS[action].requiresNFT;

  const hasLinkedWallet = !!linkedAddress;
  const hasNFT = !!farmAddress;

  const linkedWalletSelected =
    !!address &&
    hasLinkedWallet &&
    isAddressEqual(address, linkedAddress as `0x${string}`);

  console.log({ address, linkedAddress, linkedWalletSelected });

  // if (isConnecting || isReconnecting) {
  //   return <Loading text={t("connecting")} />;
  // }

  // if (isConnected) {
  //   return (
  //     <>
  //       <div className="flex">
  //         <img
  //           src={connector?.icon ?? walletIcon}
  //           className="w-6 h-6 mr-2"
  //           alt={connector?.name ?? "Wallet"}
  //         />
  //         <div>{shortAddress(address ?? "")}</div>
  //         <Button onClick={() => disconnect()}>Disconnect</Button>
  //       </div>
  //       {children}
  //     </>
  //   );
  // }

  if (!isConnected && !hasLinkedWallet) {
    return <ConnectWallet />;
  }

  if (!isConnected && hasLinkedWallet) {
    return (
      <LinkedWalletNotConnected linkedWallet={linkedAddress as `0x${string}`} />
    );
  }

  if (requiresLinkedWallet && hasLinkedWallet && !linkedWalletSelected) {
    return (
      <LinkedWalletNotSelected linkedWallet={linkedAddress as `0x${string}`} />
    );
  }

  // if (requiresNFT && !hasNFT) {
  //   return <MintNFTFarm id={id} />;
  // }

  // if (!isConnected) {
  //   return (
  //     <>
  //       {
  //         // Only show after login
  //         !!id && linkedAddress && (
  //           <div className="flex justify-between">
  //             <Label className="ml-2 mt-1 mb-2" icon={icon} type="default">
  //               {t("wallet.connect")}
  //               {"-"}
  //               {shortAddress(linkedAddress)}
  //             </Label>
  //           </div>
  //         )
  //       }

  //       {!!id && !linkedAddress && (
  //         <>
  //           <div className="flex justify-between">
  //             <Label className="ml-2 mt-1 mb-2" icon={icon} type="default">
  //               {t("wallet.linkWeb3")}
  //             </Label>
  //           </div>
  //           <p className="text-xs mx-1 mb-2">
  //             {t("wallet.setupWeb3")}
  //             {"."}
  //           </p>
  //         </>
  //       )}

  //       {/* <Wallets onConnect={(connector) => connect({ connector })} /> */}
  //     </>
  //   );
  // }

  // if (isWrongWallet) {
  //   return (
  //     <>
  //       <div className="p-2">
  //         <ConnectedWalletLabel icon={icon} address={address} />
  //         <div className="flex justify-between items-center">
  //           <Label type="danger" icon={walletIcon}>
  //             {t("wallet.wrongWallet")}
  //           </Label>
  //           {linkedAddress && (
  //             <Label type="formula">{shortAddress(linkedAddress)}</Label>
  //           )}
  //         </div>
  //         <p className="text-sm my-2">
  //           {t("wallet.connectedWrongWallet")}
  //           {"."}
  //         </p>
  //       </div>
  //       <Button onClick={() => walletService.send("CONTINUE")}>
  //         {t("wallet.changeWallet")}
  //       </Button>
  //     </>
  //   );
  // }

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

  // if (walletState.matches("wrongNetwork")) {
  //   return <PolygonRequired canContinue={true} />;
  // }

  // if (walletState.matches("networkNotSupported")) {
  //   return <PolygonRequired canContinue={false} />;
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

  return <>{children}</>;
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
