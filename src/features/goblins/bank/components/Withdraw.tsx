import React, { useContext, useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useActor } from "@xstate/react";
import { CONFIG } from "lib/config";

import * as AuthProvider from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { WithdrawTokens } from "./WithdrawTokens";
import { WithdrawItems } from "./WithdrawItems";

import { Context } from "features/game/GoblinProvider";
import { loadBanDetails } from "features/game/actions/bans";
import { Jigger, JiggerStatus } from "features/game/components/Jigger";
import { WithdrawWearables } from "./WithdrawWearables";

interface Props {
  onClose: () => void;
}
export const Withdraw: React.FC<Props> = ({ onClose }) => {
  const { authService } = useContext(AuthProvider.Context);
  const { goblinService } = useContext(Context);
  const [authState] = useActor(authService);
  const [page, setPage] = useState<"tokens" | "items" | "wearables">();

  const [jiggerState, setJiggerState] =
    useState<{ url: string; status: JiggerStatus }>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const check = await loadBanDetails(
        authState.context.user.farmId?.toString() as string,
        authState.context.user.rawToken as string,
        authState.context.transactionId as string
      );

      if (check.verificationUrl) {
        setJiggerState({
          url: check.verificationUrl,
          status: check.botStatus as JiggerStatus,
        });
      }
      setIsLoading(false);
    };

    load();
  }, []);

  const withdrawAmount = useRef({
    ids: [] as number[],
    amounts: [] as string[],
    sfl: "0",
    wearableIds: [] as number[],
    wearableAmounts: [] as number[],
  });

  const [showCaptcha, setShowCaptcha] = useState(false);

  const onWithdrawTokens = async (sfl: string) => {
    withdrawAmount.current = {
      ids: [],
      amounts: [],
      sfl,
      wearableAmounts: [],
      wearableIds: [],
    };
    setShowCaptcha(true);
  };

  const onWithdrawItems = async (ids: number[], amounts: string[]) => {
    withdrawAmount.current = {
      ids,
      amounts,
      sfl: "0",
      wearableAmounts: [],
      wearableIds: [],
    };
    setShowCaptcha(true);
  };

  const onWithdrawWearables = async (
    wearableIds: number[],
    wearableAmounts: number[]
  ) => {
    withdrawAmount.current = {
      ids: [],
      amounts: [],
      sfl: "0",
      wearableAmounts,
      wearableIds,
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

  if (isLoading) {
    return <span className="loading">Loading</span>;
  }

  if (jiggerState) {
    return (
      <Jigger
        onClose={onClose}
        status={jiggerState.status}
        verificationUrl={jiggerState.url}
      />
    );
  }

  const isBlacklisted = authState.context.blacklistStatus !== "OK";

  if (isBlacklisted) {
    return (
      <div className="p-2 text-sm">
        Withdrawing is temporarily restricted while your humanity is being
        verified. Thanks for your patience!
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

      <div className="flex">
        <Button className="mr-1" onClick={() => setPage("tokens")}>
          SFL
        </Button>
        <Button className="ml-1" onClick={() => setPage("items")}>
          Collectibles
        </Button>
        <Button className="ml-1" onClick={() => setPage("wearables")}>
          Wearables
        </Button>
      </div>
      {page === "tokens" && <WithdrawTokens onWithdraw={onWithdrawTokens} />}
      {page === "items" && <WithdrawItems onWithdraw={onWithdrawItems} />}
      {page === "wearables" && (
        <WithdrawWearables onWithdraw={onWithdrawWearables} />
      )}
    </div>
  );
};
