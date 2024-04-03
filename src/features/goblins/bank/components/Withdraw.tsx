import React, { useContext, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useActor } from "@xstate/react";
import { CONFIG } from "lib/config";

import * as AuthProvider from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { WithdrawTokens } from "./WithdrawTokens";
import { WithdrawItems } from "./WithdrawItems";

import { Context } from "features/game/GoblinProvider";
import { WithdrawWearables } from "./WithdrawWearables";
import { WithdrawBumpkin } from "./WithdrawBumpkin";
import { SUNNYSIDE } from "assets/sunnyside";
import chest from "assets/icons/chest.png";
import token from "assets/icons/sfl.webp";
import { WithdrawBuds } from "./WithdrawBuds";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
}
export const Withdraw: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const { authService } = useContext(AuthProvider.Context);
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);
  const [authState] = useActor(authService);

  const [page, setPage] = useState<
    "tokens" | "items" | "wearables" | "bumpkin" | "buds"
  >();

  const withdrawAmount = useRef({
    ids: [] as number[],
    amounts: [] as string[],
    sfl: "0",
    wearableIds: [] as number[],
    wearableAmounts: [] as number[],
    bumpkinId: undefined as number | undefined,
    budIds: [] as number[],
  });

  const [showCaptcha, setShowCaptcha] = useState(false);

  const onWithdrawTokens = async (sfl: string) => {
    withdrawAmount.current = {
      ids: [],
      amounts: [],
      sfl,
      wearableAmounts: [],
      wearableIds: [],
      bumpkinId: undefined,
      budIds: [],
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
      bumpkinId: undefined,
      budIds: [],
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
      bumpkinId: undefined,
      budIds: [],
    };
    setShowCaptcha(true);
  };

  const onWithdrawBumpkin = async () => {
    withdrawAmount.current = {
      ids: [],
      amounts: [],
      sfl: "0",
      wearableAmounts: [],
      wearableIds: [],
      bumpkinId: goblinState.context.state.bumpkin?.id,
      budIds: [],
    };
    setShowCaptcha(true);
  };

  const onWithdrawBuds = async (ids: number[]) => {
    withdrawAmount.current = {
      ids: [],
      amounts: [],
      sfl: "0",
      wearableAmounts: [],
      wearableIds: [],
      bumpkinId: undefined,
      budIds: ids,
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

  const proovePersonhood = async () => {
    goblinService.send("PROVE_PERSONHOOD");
    onClose();
  };

  if (!goblinState.context.verified) {
    return (
      <>
        <p className="text-sm p-1 m-1">{t("withdraw.proof")}</p>
        <Button className="mr-1" onClick={proovePersonhood}>
          {t("withdraw.verification")}
        </Button>
      </>
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
        <p className="text-xs p-1 m-1 text-center">{t("withdraw.unsave")}</p>
      </>
    );
  }

  return (
    <>
      <div className="p-2 flex flex-col justify-center space-y-1">
        <span className="text-shadow text-sm mb-1">{t("withdraw.sync")}</span>
        <div className="flex space-x-1">
          <Button onClick={() => setPage("tokens")}>
            <div className="flex">
              <img src={token} className="h-4 mr-1" />
              {"SFL"}
            </div>
          </Button>
          <Button onClick={() => setPage("items")}>
            <div className="flex">
              <img src={chest} className="h-4 mr-1" />
              {t("collectibles")}
            </div>
          </Button>
        </div>
        <div className="flex space-x-1">
          <Button onClick={() => setPage("wearables")}>
            <div className="flex">
              <img src={SUNNYSIDE.icons.wardrobe} className="h-4 mr-1" />
              {t("wearables")}
            </div>
          </Button>
          <Button onClick={() => setPage("bumpkin")}>
            <div className="flex">
              <img src={SUNNYSIDE.icons.player} className="h-4 mr-1" />
              {t("bumpkin")}
            </div>
          </Button>
          <Button onClick={() => setPage("buds")}>
            <div className="flex">
              <img src={SUNNYSIDE.icons.plant} className="h-4 mr-1" />
              {t("buds")}
            </div>
          </Button>
        </div>
      </div>
      {page === "tokens" && <WithdrawTokens onWithdraw={onWithdrawTokens} />}
      {page === "items" && <WithdrawItems onWithdraw={onWithdrawItems} />}
      {page === "wearables" && (
        <WithdrawWearables onWithdraw={onWithdrawWearables} />
      )}
      {page === "bumpkin" && <WithdrawBumpkin onWithdraw={onWithdrawBumpkin} />}
      {page === "buds" && <WithdrawBuds onWithdraw={onWithdrawBuds} />}
    </>
  );
};
