import React, { useContext, useRef, useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GameProvider";
import { getOnChainState } from "features/game/actions/visit";
import { Inventory } from "features/game/types/game";

import { Button } from "components/ui/Button";
import { WithdrawTokens } from "./WithdrawTokens";
import { WithdrawItems } from "./WithdrawItems";

import alert from "assets/icons/expression_alerted.png";
import { useActor } from "@xstate/react";

interface Props {
  onClose: () => void;
}
export const Withdraw: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);
  const [page, setPage] = useState<"warning" | "tokens" | "items">("warning");
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<Inventory>({});
  const [balance, setBalance] = useState<Decimal>(new Decimal(0));

  const withdrawAmount = useRef({
    ids: [] as number[],
    amounts: [] as string[],
    sfl: "0",
  });

  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showSyncCaptcha, setShowSyncCaptcha] = useState(false);

  const onWithdrawTokens = async (sfl: string) => {
    console.log({ sfl });
    withdrawAmount.current = {
      ids: [],
      amounts: [],
      sfl,
    };
    setShowCaptcha(true);
  };

  const onWithdrawItems = async (ids: number[], amounts: string[]) => {
    withdrawAmount.current = {
      ids,
      amounts,
      sfl: "0",
    };
    setShowCaptcha(true);
  };

  const onCaptchaSolved = async (token: string | null) => {
    await new Promise((res) => setTimeout(res, 1000));

    gameService.send("WITHDRAW", {
      ...withdrawAmount.current,
      captcha: token,
    });
    onClose();
  };

  const onPreWithdrawCaptchaSolved = async (captcha: string | null) => {
    await new Promise((res) => setTimeout(res, 1000));
    gameService.send("SYNC", { captcha });
    onClose();
  };

  const preWithdrawSync = () => {
    setShowSyncCaptcha(true);
  };

  const isBlacklisted = !!game.context.whitelistedAt;
  if (isBlacklisted) {
    return (
      <div className="p-2 text-sm text-center">
        The anti-bot detection system is relatively new and has picked up some
        strange behaviour. Withdrawing is temporarily restricted while the team
        investigates this case. Thanks for your patience!
      </div>
    );
  }

  useEffect(() => {
    setIsLoading(true);

    const load = async () => {
      const { game: state } = await getOnChainState({
        id: game.context.state.id as number,
        farmAddress: game.context.state.farmAddress as string,
      });

      setInventory(state.inventory);
      setBalance(state.balance);
      setIsLoading(false);
    };

    load();
  }, []);

  if (isLoading) {
    return <span className="text-shadow loading">Loading</span>;
  }

  if (showCaptcha) {
    return (
      <>
        <ReCAPTCHA
          sitekey="6Lfqm6MeAAAAAFS5a0vwAfTGUwnlNoHziyIlOl1s"
          onChange={onCaptchaSolved}
          onExpired={() => setShowCaptcha(false)}
          className="w-full m-4 flex items-center justify-center"
        />
        <p className="text-xxs p-1 m-1 text-center">
          Any unsaved progress will be lost.
        </p>
      </>
    );
  }

  if (showSyncCaptcha) {
    return (
      <>
        <ReCAPTCHA
          sitekey="6Lfqm6MeAAAAAFS5a0vwAfTGUwnlNoHziyIlOl1s"
          onChange={onPreWithdrawCaptchaSolved}
          onExpired={() => setShowSyncCaptcha(false)}
          className="w-full m-4 flex items-center justify-center"
        />
        <p className="text-xxs p-1 m-1 text-center">
          Any unsaved progress will be lost.
        </p>
      </>
    );
  }

  const localInventory = JSON.stringify(
    game.context.state.inventory,
    Object.keys(game.context.state.inventory).sort()
  );
  const chainInventory = JSON.stringify(
    inventory,
    Object.keys(inventory).sort()
  );
  var inventoriesMatch = false;

  const localBalance = game.context.state.balance;
  const chainBalance = balance;
  var balancesMatch = false;

  if (localInventory == chainInventory) inventoriesMatch = true;

  if (localBalance.equals(chainBalance)) balancesMatch = true;

  var farmSynced = inventoriesMatch && balancesMatch;

  if (page === "tokens") {
    return <WithdrawTokens onWithdraw={onWithdrawTokens} />;
  }

  if (page === "items") {
    return <WithdrawItems onWithdraw={onWithdrawItems} />;
  }

  return (
    <div className="p-2 flex flex-col justify-center">
      <span className="text-shadow text-sm text-center pb-2">
        You can only withdraw items that you have synced to the blockchain.
      </span>

      <div
        hidden={farmSynced}
        className="flex items-center text-center border-2 rounded-md border-black p-2 bg-[#e43b44]"
      >
        <img src={alert} alt="alert" className="mr-2 w-5 h-5/6" />
        <span className="text-xs">
          ANY PROGRESS THAT HAS NOT BEEN SYNCED ON CHAIN WILL BE LOST. IT IS
          HIGHLY RECCOMMENDED THAT YOU SYNC PRIOR TO WITHDRAW.
        </span>
        <img src={alert} alt="alert" className="mr-2 w-5 h-5/6" />
        <Button className="mr-1" onClick={preWithdrawSync}>
          SYNC
        </Button>
      </div>

      <div className="flex mt-4">
        <Button className="mr-1" onClick={() => setPage("tokens")}>
          SFL Tokens
        </Button>
        <Button className="mr-1" onClick={() => setPage("items")}>
          SFL Items
        </Button>
      </div>
    </div>
  );
};
