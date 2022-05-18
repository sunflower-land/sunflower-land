import React, { useContext, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useActor } from "@xstate/react";
import { CONFIG } from "lib/config";

import * as AuthProvider from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { WithdrawTokens } from "./WithdrawTokens";
import { WithdrawItems } from "./WithdrawItems";

import alert from "assets/icons/expression_alerted.png";

import { Context } from "features/game/GoblinProvider";

interface Props {
  onClose: () => void;
}
export const Withdraw: React.FC<Props> = ({ onClose }) => {
  const { authService } = useContext(AuthProvider.Context);
  const { goblinService } = useContext(Context);
  const [authState] = useActor(authService);

  const [page, setPage] = useState<"tokens" | "items">();

  const withdrawAmount = useRef({
    ids: [] as number[],
    amounts: [] as string[],
    sfl: "0",
  });

  const [showCaptcha, setShowCaptcha] = useState(false);

  const onWithdrawTokens = async (sfl: string) => {
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

    goblinService.send("WITHDRAW", {
      ...withdrawAmount.current,
      captcha: token,
    });
    onClose();
  };

  const isBlacklisted = !!authState.context.isBlacklisted;

  if (isBlacklisted) {
    return (
      <div className="p-2 text-sm">
        The anti-bot detection system is relatively new and has picked up some
        strange behaviour. Withdrawing is temporarily restricted while the team
        investigates this case. Thanks for your patience!
      </div>
    );
  }

  if (showCaptcha) {
    return (
      <>
        <ReCAPTCHA
          sitekey={CONFIG.RECAPTCHA_SITEKEY}
          onChange={onCaptchaSolved}
          onExpired={() => setShowCaptcha(false)}
          className="w-full m-4 flex items-center justify-center"
        />
        <p className="text-xs p-1 m-1 text-center">
          Any unsaved progress will be lost.
        </p>
      </>
    );
  }

  return (
    <div className="p-2 flex flex-col justify-center">
      <span className="text-shadow text-sm pb-2">
        You can only withdraw items that you have synced to the blockchain.
      </span>

      <div className="flex items-center border-2 rounded-md border-black p-2 bg-error mb-3">
        <img src={alert} alt="alert" className="mr-2 w-5 h-5/6" />
        <span className="text-xs">
          ANY PROGRESS THAT HAS NOT BEEN SYNCED ON CHAIN WILL BE LOST.
        </span>
      </div>

      <div className="flex">
        <Button className="mr-1" onClick={() => setPage("tokens")}>
          SFL Tokens
        </Button>
        <Button className="ml-1" onClick={() => setPage("items")}>
          SFL Items
        </Button>
      </div>
      {page === "tokens" && <WithdrawTokens onWithdraw={onWithdrawTokens} />}
      {page === "items" && <WithdrawItems onWithdraw={onWithdrawItems} />}
    </div>
  );
};
