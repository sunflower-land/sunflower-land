import React, { useContext, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useActor } from "@xstate/react";
import { CONFIG } from "lib/config";

import { Button } from "components/ui/Button";
import { WithdrawTokens } from "./WithdrawTokens";
import { WithdrawItems } from "./WithdrawItems";
import { WithdrawWearables } from "./WithdrawWearables";
import { SUNNYSIDE } from "assets/sunnyside";
import chest from "assets/icons/chest.png";
import token from "assets/icons/sfl.webp";
import { WithdrawBuds } from "./WithdrawBuds";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { WithdrawResources } from "./WithdrawResources";

interface Props {
  onClose: () => void;
}
export const Withdraw: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [page, setPage] = useState<
    "tokens" | "items" | "wearables" | "bumpkin" | "buds" | "resources"
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
      bumpkinId: gameState.context.state.bumpkin?.id,
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

    gameService.send("WITHDRAW", {
      ...withdrawAmount.current,
      captcha: token,
    });
    onClose();
  };

  const provePersonhood = async () => {
    gameService.send("PROVE_PERSONHOOD");
    onClose();
  };

  if (!gameState.context.verified) {
    return (
      <>
        <p className="text-sm p-1 m-1">{t("withdraw.proof")}</p>
        <Button className="mr-1" onClick={provePersonhood}>
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
          <Button onClick={() => setPage("resources")}>
            <div className="flex">
              <img src={SUNNYSIDE.resource.wood} className="h-4 mr-1" />
              {t("resources")}
            </div>
          </Button>
        </div>
        <div className="flex space-x-1">
          <Button onClick={() => setPage("items")}>
            <div className="flex">
              <img src={chest} className="h-4 mr-1" />
              {t("collectibles")}
            </div>
          </Button>
          <Button onClick={() => setPage("wearables")}>
            <div className="flex">
              <img src={SUNNYSIDE.icons.wardrobe} className="h-4 mr-1" />
              {t("wearables")}
            </div>
          </Button>
        </div>
        <div className="flex space-x-1">
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
      {page === "resources" && <WithdrawResources onWithdraw={onClose} />}
      {page === "wearables" && (
        <WithdrawWearables onWithdraw={onWithdrawWearables} />
      )}
      {page === "buds" && <WithdrawBuds onWithdraw={onWithdrawBuds} />}
    </>
  );
};
