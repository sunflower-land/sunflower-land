import React, { useContext, useEffect, useState } from "react";

import { Button } from "components/ui/Button";
import { Context as AuthContext } from "../lib/Provider";
import walletIcon from "assets/icons/wallet.png";

import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { shortAddress } from "lib/utils/shortAddress";
import { getWalletIcon } from "features/wallet/lib/getWalletIcon";

import { DropdownPanel } from "components/ui/DropdownPanel";
import { NetworkName } from "features/game/events/landExpansion/updateNetwork";
import { networkOptions } from "features/game/expansion/components/dailyReward/DailyReward";
import { WalletWall } from "features/wallet/components/WalletWall";

const Login: React.FC<{ screen: "signin" | "signup" }> = ({ screen }) => {
  const { authService } = useContext(AuthContext);
  const { t } = useAppTranslation();

  return (
    <>
      <WalletWall
        screen={screen}
        onSignMessage={({ address, signature }) => {
          authService.send("CONNECTED", { address, signature });
        }}
      />
      <div className="flex justify-between my-1 items-center">
        <a href="https://discord.gg/sunflowerland" className="mr-4">
          <img
            src="https://img.shields.io/discord/880987707214544966?label=Sunflower%20Land&logo=Discord&style=social"
            alt="Discord: Sunflower Land"
          />
        </a>
        <a
          href="https://docs.sunflower-land.com/getting-started/how-to-start"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-base font-secondary"
        >
          {t("welcome.needHelp")}
        </a>
      </div>
    </>
  );
};

export const SignIn = () => <Login screen="signin" />;
export const SignUp = () => <Login screen="signup" />;

const ChainRequiredHeader: React.FC<{
  address: `0x${string}`;
  icon: string;
}> = ({ address, icon }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex justify-between items-center ml-2 mt-1 pb-2">
        <Label icon={walletIcon} type="default">
          Select a network
        </Label>
        <Label type="default" icon={icon}>
          {shortAddress(address)}
        </Label>
      </div>
    </>
  );
};

export const SelectChain: React.FC<{
  availableChains: number[];
}> = ({ availableChains }) => {
  const { t } = useAppTranslation();

  const { chainId, connector, address } = useAccount();
  const { disconnect } = useDisconnect();

  const { switchChain, isError, isPending } = useSwitchChain();

  const filteredNetworkOptions = networkOptions.filter((network) =>
    availableChains.includes(network.chainId),
  );

  const [selectedNetwork, setSelectedNetwork] = useState<
    NetworkName | undefined
  >(
    filteredNetworkOptions.find((network) => network.chainId === chainId)
      ?.value,
  );

  useEffect(() => {
    if (!selectedNetwork) return;

    const networkOption = filteredNetworkOptions.find(
      (network) => network.value === selectedNetwork,
    );

    if (!networkOption) return;

    switchChain({
      chainId: networkOption.chainId,
    });
  }, [selectedNetwork]);

  const handleNetworkChange = (networkName: NetworkName) => {
    const selectedNetwork = networkOptions.find(
      (network) => network.value === networkName,
    );

    if (!selectedNetwork) return;

    setSelectedNetwork(selectedNetwork.value);
  };

  return (
    <>
      <ChainRequiredHeader
        address={address as `0x${string}`}
        icon={getWalletIcon(connector)}
      />
      <DropdownPanel<NetworkName>
        options={filteredNetworkOptions}
        value={selectedNetwork}
        onChange={handleNetworkChange}
        placeholder={t("deposit.flower.selectNetwork")}
      />
      <div
        style={{
          minHeight: "100px",
        }}
      >
        {isPending && <div className="text-xs p-2">Switching Network...</div>}
        {!isPending && (
          <div className="text-xs p-2">Please select a chain to continue.</div>
        )}
        {isError && (
          <div className="text-xs p-2">
            Error switching to {selectedNetwork}. Please try again.
          </div>
        )}
      </div>
      <Button onClick={() => disconnect()}>Disconnect Wallet</Button>
    </>
  );
};

export const WalletConnectedHeader: React.FC = () => {
  const { chainId, address, connector, chain } = useAccount();

  const chainIcon = networkOptions.find(
    (network) => network.chainId === chainId,
  )?.icon;

  return (
    <div className="flex justify-between items-center pl-1">
      <div>
        {chain && (
          <Label type="formula" icon={chainIcon}>
            {chain.name}
          </Label>
        )}
      </div>
      <div>
        {address && (
          <Label type="default" icon={getWalletIcon(connector)}>
            {shortAddress(address)}
          </Label>
        )}
      </div>
    </div>
  );
};
