import React, { useContext, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { Context } from "features/game/GameProvider";


import { Button } from "components/ui/Button";
import { WithdrawTokens } from "./WithdrawTokens";
import { WithdrawItems } from "./WithdrawItems";

interface Props {
  onClose: () => void;
}
export const Withdraw: React.FC<Props> = ({ onClose }) => {

  const { gameService } = useContext(Context);
  const [page, setPage] = useState<"warning" | "tokens" | "items">("warning");

  const withdrawAmount = useRef({
    ids: [] as number[],
    amounts: [] as string[],
    sfl: "0",
  });

  const [showCaptcha, setShowCaptcha] = useState(false);

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

  if (showCaptcha) {
    return (
      <>
      <ReCAPTCHA
        sitekey="6Lfqm6MeAAAAAFS5a0vwAfTGUwnlNoHziyIlOl1s"
        onChange={onCaptchaSolved}
        onExpired={() => setShowCaptcha(false)}
        className="w-full m-4 flex items-center justify-center"
      />
      <p className="text-xxs p-1 m-1 underline text-center">
        Any unsaved progress will be lost.
      </p>
      </>
    );
  }

  if (page === "tokens") {
    return <WithdrawTokens onWithdraw={onWithdrawTokens} />;
  }

  if (page === "items") {
    return <WithdrawItems onWithdraw={onWithdrawItems} />;
  }

  return (
    <div className="p-2 flex flex-col justify-center">
      <span className="text-shadow text-sm text-center">
        You can only withdraw items that you have synced to the blockchain.
      </span>
      <span className="text-shadow text-sm text-center mt-4 block">
        Any progress that has not been synced will be lost.
      </span>

      <div className="flex mt-4">
        <Button className="mr-1" onClick={() => setPage("tokens")}>
          SFL Tokens
        </Button>
        <Button onClick={() => setPage("items")}>SFL Items</Button>
      </div>
    </div>
  );
};
