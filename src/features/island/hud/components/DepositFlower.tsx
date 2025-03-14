import { Label } from "components/ui/Label";
import React, { useContext, useEffect, useState } from "react";
import flowerIcon from "assets/icons/flower_token.webp";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { useWatchContractEvent, useChains } from "wagmi";
import { CONFIG } from "lib/config";
import FlowerOFT from "lib/blockchain/abis/FlowerOFT";
import { config } from "features/wallet/WalletProvider";
import { Context } from "features/game/GameProvider";
import * as AuthProvider from "features/auth/lib/Provider";
import { CopyAddress } from "components/ui/CopyAddress";
import { baseSepolia } from "viem/chains";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";

interface Props {
  onClose: () => void;
}
export const DepositFlower: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();

  const [page, setPage] = useState<"create" | "existing" | "landing">(
    "landing",
  );

  if (page === "create") {
    return <CreateDeposit />;
  }

  return (
    <div>
      <Label type="default" icon={flowerIcon}>
        {`Deposit $FLOWER`}
      </Label>
      <Button onClick={() => setPage("create")}>{`Create New Deposit`}</Button>
      <Button onClick={() => setPage("existing")}>{`Existing Deposits`}</Button>
    </div>
  );
};

type FlowerDeposit = {
  transactionHash: string;
  value: string;
};

const _success = (state: MachineState) =>
  state.matches("depositingFlowerSuccess");
const _error = (state: MachineState) => state.matches("depositingFlowerFailed");
const _pending = (state: MachineState) => state.matches("depositingFlower");
const _deposits = (state: MachineState): FlowerDeposit[] =>
  state.context.data["depositingFlower"]?.deposits ?? [];
const _depositAddress = (state: MachineState): string =>
  state.context.data["depositingFlower"]?.depositAddress ?? "";

const AddressComponent = ({
  address,
  refreshDeposit,
}: {
  address: string;
  refreshDeposit: () => void;
}) => {
  const { gameService } = useContext(Context);

  const pending = useSelector(gameService, _pending);

  const deposits = useSelector(gameService, _deposits);

  useWatchContractEvent({
    address: CONFIG.FLOWER_CONTRACT as `0x${string}`,
    abi: FlowerOFT,
    fromBlock: 22988953n,
    eventName: "Transfer",
    args: {
      to: address as `0x${string}`,
    },
    chainId: baseSepolia.id,
    onLogs() {
      refreshDeposit();
    },
    config,
  });

  const chains = useChains({ config });

  const chainConfig = chains.find((chain) => chain.id === baseSepolia.id);

  return (
    <>
      <div>{`Address: ${address}`}</div>
      <CopyAddress address={address} />
      <Label type="danger">
        {`Do not save this address as address may change`}
      </Label>
      <Label type="default">{`Min 5 $FLOWER to deposit`}</Label>
      <div>
        {deposits.map(({ transactionHash, value }) => (
          <div key={transactionHash}>
            <a
              href={`${chainConfig?.blockExplorers?.default?.url}/tx/${transactionHash}`}
              target="_blank"
              rel="noreferrer"
            >
              {`${transactionHash} - ${value}`}
            </a>
          </div>
        ))}
      </div>
      <Button disabled={pending} onClick={() => refreshDeposit()}>
        {pending ? "Refreshing..." : "Refresh Deposit"}
      </Button>
    </>
  );
};

const Address = React.memo(AddressComponent);

const CreateDeposit = () => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthProvider.Context);

  const address = useSelector(gameService, _depositAddress);
  const success = useSelector(gameService, _success);
  const error = useSelector(gameService, _error);

  const generateAddress = async () => {
    gameService.send("flower.depositStarted", {
      effect: {
        type: "flower.depositStarted",
      },
      authToken: authService.getSnapshot().context.user.rawToken as string,
    });
  };

  useEffect(() => {
    generateAddress();
  }, []);

  useEffect(() => {
    if (success) {
      gameService.send("CONTINUE");
    }
  }, [success]);

  if (error) {
    return (
      <div>
        {" "}
        <Label type="default" icon={flowerIcon}>
          {`Deposit $FLOWER`}
        </Label>
        <Button onClick={() => generateAddress()}>{`Retry`}</Button>
      </div>
    );
  }

  return (
    <div>
      <Label type="default" icon={flowerIcon}>
        {`Deposit $FLOWER`}
      </Label>
      <div>{`Chain: BASE`}</div>
      {!address && !error && <span>{`Generating address...`}</span>}
      {address && (
        <Address address={address} refreshDeposit={() => generateAddress()} />
      )}
    </div>
  );
};
