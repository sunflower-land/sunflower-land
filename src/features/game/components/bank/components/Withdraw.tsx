import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { Button } from "components/ui/Button";
import { WithdrawFlower } from "./WithdrawFlower";
import { WithdrawItems } from "./WithdrawItems";
import { WithdrawWearables } from "./WithdrawWearables";
import { SUNNYSIDE } from "assets/sunnyside";
import chest from "assets/icons/chest.png";
import flowerIcon from "assets/icons/flower_token.webp";
import { WithdrawBuds } from "./WithdrawBuds";
import { Context } from "features/game/GameProvider";
import { WithdrawResources } from "./WithdrawResources";
import { Label } from "components/ui/Label";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { translate } from "lib/i18n/translate";
import { Transaction } from "features/island/hud/Transaction";
import { FaceRecognition } from "features/retreat/components/personhood/FaceRecognition";

const getPageIcon = (page: Page) => {
  switch (page) {
    case "tokens":
      return flowerIcon;
    case "items":
      return chest;
    case "wearables":
      return SUNNYSIDE.icons.wardrobe;
    case "buds":
      return SUNNYSIDE.icons.plant;
    case "resources":
      return SUNNYSIDE.resource.wood;
    case "verify":
      return SUNNYSIDE.icons.search;
    default:
      return "";
  }
};

const getPageText = (page: Page) => {
  switch (page) {
    case "tokens":
      return "FLOWER";
    case "items":
      return translate("collectibles");
    case "wearables":
      return translate("wearables");
    case "buds":
      return translate("buds");
    case "resources":
      return translate("resources");
    case "verify":
      return translate("verify");
    default:
      return "";
  }
};

type Page =
  | "main"
  | "tokens"
  | "items"
  | "wearables"
  | "buds"
  | "resources"
  | "verify";

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
        <Button onClick={() => setPage("verify")}>
          <div className="flex items-center">
            <img src={getPageIcon("verify")} className="h-4 mr-1" />
            {getPageText("verify")}
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

const _farmId = (state: MachineState) => state.context.farmId;

export const Withdraw: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const farmId = useSelector(gameService, _farmId);

  const [page, setPage] = useState<Page>("main");

  const onWithdrawTokens = async (sfl: string) => {
    gameService.send("TRANSACT", {
      transaction: "transaction.flowerWithdrawn",
      request: {
        farmId,
        effect: {
          type: "withdraw.flower",
          amount: sfl,
        },
      },
    });
    onClose();
  };

  const onWithdrawItems = async (ids: number[], amounts: string[]) => {
    gameService.send("TRANSACT", {
      transaction: "transaction.itemsWithdrawn",
      request: {
        farmId,
        effect: {
          type: "withdraw.items",
          amounts,
          ids,
        },
      },
    });
    onClose();
  };

  const onWithdrawWearables = async (
    wearableIds: number[],
    wearableAmounts: number[],
  ) => {
    gameService.send("TRANSACT", {
      transaction: "transaction.wearablesWithdrawn",
      request: {
        effect: {
          type: "withdraw.wearables",
          amounts: wearableAmounts,
          ids: wearableIds,
        },
      },
    });
    onClose();
  };

  const onWithdrawBuds = async (ids: number[]) => {
    gameService.send("TRANSACT", {
      transaction: "transaction.budWithdrawn",
      request: {
        effect: {
          type: "withdraw.buds",
          budIds: ids,
        },
      },
    });
    onClose();
  };

  const transaction = gameService.state.context.state.transaction;
  if (transaction) {
    return <Transaction isBlocked onClose={onClose} />;
  }

  return (
    <>
      {page === "main" && <MainMenu setPage={setPage} />}
      {page !== "main" && <NavigationMenu page={page} setPage={setPage} />}
      {page === "tokens" && <WithdrawFlower onWithdraw={onWithdrawTokens} />}
      {page === "items" && <WithdrawItems onWithdraw={onWithdrawItems} />}
      {page === "resources" && <WithdrawResources onWithdraw={onClose} />}
      {page === "wearables" && (
        <WithdrawWearables onWithdraw={onWithdrawWearables} />
      )}
      {page === "buds" && <WithdrawBuds onWithdraw={onWithdrawBuds} />}
      {page === "verify" && <FaceRecognition />}
    </>
  );
};
