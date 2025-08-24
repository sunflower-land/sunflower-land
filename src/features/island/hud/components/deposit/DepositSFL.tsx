import { CONFIG } from "lib/config";
import SFLABI from "lib/blockchain/abis/Token";
import { useContext, useEffect, useState } from "react";
import { config } from "features/wallet/WalletProvider";
import { readContract, writeContract } from "@wagmi/core";
import { polygon, polygonAmoy } from "@wagmi/core/chains";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import sflIcon from "assets/icons/sfl.webp";
import { Label } from "components/ui/Label";
import { useTranslation } from "react-i18next";
import { Button } from "components/ui/Button";
import { formatEther } from "viem";

const SFL_ADDRESS =
  CONFIG.NETWORK === "mainnet"
    ? "0xD1f9c58e33933a993A3891F8acFe05a68E1afC05"
    : "0x64C865248a4ba3E9993F0c948246C0cC17E50F8F";

const _linkedWallet = (state: MachineState) => state.context.linkedWallet;

export const DepositSFL: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const { t } = useTranslation();

  const [balance, setBalance] = useState<bigint>();
  const linkedWallet = useSelector(gameService, _linkedWallet);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!linkedWallet) return;

      const balance = await readContract(config, {
        chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
        abi: SFLABI,
        address: SFL_ADDRESS,
        functionName: "balanceOf",
        args: [linkedWallet as `0x${string}`],
      });

      setBalance(balance);
    };

    fetchBalance();
  }, [linkedWallet]);

  const migrate = async () => {
    console.log(linkedWallet, balance);

    if (!linkedWallet || !balance) return;

    writeContract(config, {
      chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
      abi: SFLABI,
      address: SFL_ADDRESS,
      functionName: "transfer",
      args: [linkedWallet as `0x${string}`, balance],
    });
  };

  return (
    <>
      <div className="flex items-center ml-2 gap-3 my-2">
        <img
          src={SUNNYSIDE.icons.arrow_left}
          className="w-6 cursor-pointer"
          onClick={() => onClose()}
        />
        <Label type="default" icon={sflIcon}>
          Migrate SFL
        </Label>
      </div>
      <div>{balance ? formatEther(balance) : "Loading..."}</div>
      <Button onClick={() => {}}>Migrate</Button>
    </>
  );
};
