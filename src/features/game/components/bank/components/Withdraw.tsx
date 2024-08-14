import React, { useContext, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useSelector } from "@xstate/react";
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
import { Label } from "components/ui/Label";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { translate } from "lib/i18n/translate";

const getPageIcon = (page: Page) => {
  switch (page) {
    case "tokens":
      return token;
    case "items":
      return chest;
    case "wearables":
      return SUNNYSIDE.icons.wardrobe;
    case "buds":
      return SUNNYSIDE.icons.plant;
    case "resources":
      return SUNNYSIDE.resource.wood;
    default:
      return "";
  }
};

const getPageText = (page: Page) => {
  switch (page) {
    case "tokens":
      return "SFL";
    case "items":
      return translate("collectibles");
    case "wearables":
      return translate("wearables");
    case "buds":
      return translate("buds");
    case "resources":
      return translate("resources");
    default:
      return "";
  }
};

type Page = "main" | "tokens" | "items" | "wearables" | "buds" | "resources";

const MainMenu: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => {
  return (
    <div className="p-2 flex flex-col justify-center space-y-1">
      <span className="mb-1">{translate("withdraw.sync")}</span>
      <div className="flex space-x-1">
        <Button onClick={() => setPage("tokens")}>
          <div className="flex items-center">
            <img src={getPageIcon("tokens")} className="h-4 mr-1" />
            {getPageText("tokens")}
          </div>
        </Button>
        <Button onClick={() => setPage("resources")}>
          <div className="flex items-center">
            <img src={getPageIcon("resources")} className="h-4 mr-1" />
            {getPageText("resources")}
          </div>
        </Button>
      </div>
      <div className="flex space-x-1">
        <Button onClick={() => setPage("items")}>
          <div className="flex items-center">
            <img src={getPageIcon("items")} className="h-4 mr-1" />
            {getPageText("items")}
          </div>
        </Button>
        <Button onClick={() => setPage("wearables")}>
          <div className="flex items-center">
            <img src={getPageIcon("wearables")} className="h-4 mr-1" />
            {getPageText("wearables")}
          </div>
        </Button>
      </div>
      <div className="flex space-x-1">
        <Button onClick={() => setPage("buds")}>
          <div className="flex items-center">
            <img src={getPageIcon("buds")} className="h-4 mr-1" />
            {getPageText("buds")}
          </div>
        </Button>
      </div>
    </div>
  );
};

const NavigationMenu: React.FC<{
  page: Page;
  setPage: (page: Page) => void;
}> = ({ page, setPage }) => {
  return (
    <div className="flex items-center">
      <img
        src={SUNNYSIDE.icons.arrow_left}
        className="self-start cursor-pointer mr-3"
        style={{
          top: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 2}px`,
          width: `${PIXEL_SCALE * 11}px`,
        }}
        alt="back"
        onClick={() => setPage("main")}
      />
      <Label type="default" icon={getPageIcon(page)}>
        {getPageText(page)}
      </Label>
    </div>
  );
};

interface Props {
  onClose: () => void;
}

const _verified = (state: MachineState) => state.context.verified;

export const Withdraw: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const verified = useSelector(gameService, _verified);

  const [page, setPage] = useState<Page>("main");

  const withdrawAmount = useRef({
    ids: [] as number[],
    amounts: [] as string[],
    sfl: "0",
    wearableIds: [] as number[],
    wearableAmounts: [] as number[],
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
      budIds: [],
    };
    setShowCaptcha(true);
  };

  const onWithdrawWearables = async (
    wearableIds: number[],
    wearableAmounts: number[],
  ) => {
    withdrawAmount.current = {
      ids: [],
      amounts: [],
      sfl: "0",
      wearableAmounts,
      wearableIds,
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

  if (!verified) {
    return (
      <>
        <p className="p-1 m-1">{t("withdraw.proof")}</p>
        <Button onClick={provePersonhood}>{t("withdraw.verification")}</Button>
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
      {page === "main" && <MainMenu setPage={setPage} />}
      {page !== "main" && <NavigationMenu page={page} setPage={setPage} />}
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
