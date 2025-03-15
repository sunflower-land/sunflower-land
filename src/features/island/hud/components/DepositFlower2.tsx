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
import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import baseIcon from "assets/icons/Base_Network_Logo.png";
import { SUNNYSIDE } from "assets/sunnyside";
interface Props {
  onClose: () => void;
}
export const DepositFlower2: React.FC<Props> = ({ onClose }) => {
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

type ProcessedDeposit = {
  from: string | null;
  value: string;
  transactionHash: string;
  createdAt: number;
};

const _success = (state: MachineState) =>
  state.matches("depositingFlowerSuccess");
const _error = (state: MachineState) => state.matches("depositingFlowerFailed");
const _pending = (state: MachineState) => state.matches("depositingFlower");
const _deposits = (state: MachineState): ProcessedDeposit[] =>
  state.context.data["depositingFlower"]?.deposits ?? [
    {
      from: "0x123f681646d4a755815f9cb19e1acc8565a0c2ac",
      value: "10.5",
      transactionHash:
        "0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0",
      createdAt: Date.now() - 1000 * 60 * 60 * 2,
    },
    {
      from: "0x456d4f8e9b3a147895c4b8f2e76bac0a1d5f7eb2",
      value: "7.25",
      transactionHash:
        "0x234567890abcdef0234567890abcdef0234567890abcdef0234567890abcdef0",
      createdAt: Date.now() - 1000 * 60 * 30,
    },
    {
      from: "0x789a1b2c3d4e5f6789a1b2c3d4e5f6789a1b2c3d",
      value: "15.0",
      transactionHash:
        "0x345678901abcdef0345678901abcdef0345678901abcdef0345678901abcdef0",
      createdAt: Date.now() - 1000 * 60 * 5,
    },
    {
      from: "0xabcdef0123456789abcdef0123456789abcdef012",
      value: "5.75",
      transactionHash:
        "0x456789012abcdef0456789012abcdef0456789012abcdef0456789012abcdef0",
      createdAt: Date.now() - 1000 * 60 * 120,
    },
    {
      from: "0xdef0123456789abcdef0123456789abcdef012345",
      value: "20.35556587687",
      transactionHash:
        "0x567890123abcdef0567890123abcdef0567890123abcdef0567890123abcdef0",
      createdAt: Date.now() - 1000 * 60 * 10,
    },
  ];
const _depositAddress = (state: MachineState): string =>
  state.context.data["depositingFlower"]?.depositAddress ??
  "0xdef0123456789abcdef0123456789abcdef012345";

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
      // refreshDeposit();
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

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<"BASE" | "ARBITRUM">("BASE");

  const generateAddress = async () => {
    // gameService.send("flower.depositStarted", {
    //   effect: {
    //     type: "flower.depositStarted",
    //   },
    //   authToken: authService.getSnapshot().context.user.rawToken as string,
    // });
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
        <Label type="default" icon={flowerIcon}>
          {`Deposit $FLOWER`}
        </Label>
        <Button onClick={() => generateAddress()}>{`Retry`}</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <img src={SUNNYSIDE.icons.arrow_left} className="w-6 cursor-pointer" />
        <Label type="default" icon={flowerIcon} className="ml-1.5 mb-2">
          {`Deposit $FLOWER`}
        </Label>
      </div>

      <InnerPanel className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex flex-col items-center justify-between">
          <ButtonPanel>
            <div className="flex items-center gap-2">
              <img src={baseIcon} className="w-6" />
              <span>{`BASE Network`}</span>
            </div>
          </ButtonPanel>
          {isOpen && (
            <div className="w-full mt-1 z-50">
              <ButtonPanel
                onClick={() => {
                  setSelected("BASE");
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <img src={baseIcon} className="w-6" />
                  <span>{`BASE Network`}</span>
                </div>
              </ButtonPanel>

              <ButtonPanel
                onClick={() => {
                  setSelected("ARBITRUM");
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <img src="/icons/arbitrum.png" className="w-6" />
                  <span>{`Arbitrum Network`}</span>
                </div>
              </ButtonPanel>

              {/* Add more ButtonPanels for other networks */}
            </div>
          )}
        </div>
      </InnerPanel>

      {/* {!address && !error && <span>{`Generating address...`}</span>}
      {address && (
        <Address address={address} refreshDeposit={() => generateAddress()} />
      )} */}
    </div>
  );
};

const ProcessedDeposits: React.FC<{ deposits: ProcessedDeposit[] }> = ({
  deposits,
}) => {
  return (
    <div className="flex flex-col">
      {deposits.map(({ transactionHash, value }) => (
        <div
          className=""
          key={transactionHash}
        >{`${transactionHash} - ${value}`}</div>
      ))}
    </div>
  );
};
