import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { Button } from "components/ui/Button";
import { WithdrawFlower } from "./WithdrawFlower";
import { WithdrawItems } from "./WithdrawItems";
import { WithdrawResources } from "./WithdrawResources";
import { WithdrawWearables } from "./WithdrawWearables";
import { SUNNYSIDE } from "assets/sunnyside";
import chest from "assets/icons/chest.png";
import flowerIcon from "assets/icons/flower_token.webp";
import { WithdrawBuds } from "./WithdrawBuds";
import { Context } from "features/game/GameProvider";
import { hasTimeBasedFeatureAccess } from "lib/flags";
import { useNow } from "lib/utils/hooks/useNow";
import { Label } from "components/ui/Label";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { TradeCooldownWidget } from "features/game/components/TradeCooldownWidget";
import {
  getAccountTradedRestrictionSecondsLeft,
  isAccountTradedWithin90Days,
  MachineState,
} from "features/game/lib/gameMachine";
import { translate } from "lib/i18n/translate";
import { Transaction } from "features/island/hud/Transaction";
import { FaceRecognition } from "features/retreat/components/personhood/FaceRecognition";
import { GameWallet } from "features/wallet/Wallet";
import { WithdrawPets } from "./WithdrawPets";
import petNFTEgg from "assets/icons/pet_nft_egg.png";

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
    case "pets":
      return petNFTEgg;
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
    case "pets":
      return translate("pets");
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
  | "verify"
  | "pets";

const MainMenu: React.FC<{
  setPage: (page: Page) => void;
  showResources: boolean;
}> = ({ setPage, showResources }) => {
  return (
    <div className="flex flex-col justify-center space-y-1">
      <span className="p-2 mb-1">{translate("withdraw.sync")}</span>

      <div className="flex space-x-1">
        <Button onClick={() => setPage("tokens")}>
          <div className="flex items-center">
            <img src={getPageIcon("tokens")} className="h-4 mr-1" />
            {getPageText("tokens")}
          </div>
        </Button>
        {showResources && (
          <Button onClick={() => setPage("resources")}>
            <div className="flex items-center">
              <img src={getPageIcon("resources")} className="h-4 mr-1" />
              {getPageText("resources")}
            </div>
          </Button>
        )}
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
        <Button onClick={() => setPage("pets")}>
          <div className="flex items-center">
            <img src={getPageIcon("pets")} className="h-4 mr-1" />
            {getPageText("pets")}
          </div>
        </Button>
      </div>
      <div className="flex space-x-1">
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
    <div className="flex items-center ml-2 pb-1">
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
const _game = (state: MachineState) => state.context.state;

export const Withdraw: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const farmId = useSelector(gameService, _farmId);
  const game = useSelector(gameService, _game);

  // For testing purposes, delete after feature flag is released
  const now = useNow({
    live: true,
    autoEndAt: new Date("2026-03-02T00:00:00Z").getTime(),
  });

  const showResources = !hasTimeBasedFeatureAccess({
    featureName: "OFFCHAIN_RESOURCES",
    now,
    game,
  });

  const accountTradedRecently = useSelector(gameService, (s) =>
    isAccountTradedWithin90Days(s.context),
  );
  const restrictionSecondsLeft = useSelector(gameService, (s) =>
    getAccountTradedRestrictionSecondsLeft(s.context),
  );

  const [page, setPage] = useState<Page>("main");

  const onWithdrawTokens = async (sfl: string, chainId: number) => {
    if (accountTradedRecently) return;
    gameService.send("TRANSACT", {
      transaction: "transaction.flowerWithdrawn",
      request: {
        farmId,
        effect: { type: "withdraw.flower", amount: sfl, chainId },
      },
    });
    onClose();
  };

  const onWithdrawItems = async (ids: number[], amounts: string[]) => {
    if (accountTradedRecently) return;
    gameService.send("TRANSACT", {
      transaction: "transaction.itemsWithdrawn",
      request: { farmId, effect: { type: "withdraw.items", amounts, ids } },
    });
    onClose();
  };

  const onWithdrawWearables = async (
    wearableIds: number[],
    wearableAmounts: number[],
  ) => {
    if (accountTradedRecently) return;
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
    if (accountTradedRecently) return;
    gameService.send("TRANSACT", {
      transaction: "transaction.budWithdrawn",
      request: { effect: { type: "withdraw.buds", budIds: ids } },
    });
    onClose();
  };

  const onWithdrawPets = async (ids: number[]) => {
    if (accountTradedRecently) return;
    gameService.send("TRANSACT", {
      transaction: "transaction.petWithdrawn",
      request: { effect: { type: "withdraw.pets", petIds: ids } },
    });
    onClose();
  };

  const transaction = gameService.getSnapshot().context.state.transaction;
  if (transaction) {
    return <Transaction isBlocked onClose={onClose} />;
  }

  return (
    <>
      {page === "main" && (
        <MainMenu setPage={setPage} showResources={showResources} />
      )}
      {page !== "main" && <NavigationMenu page={page} setPage={setPage} />}
      {page === "tokens" && (
        <GameWallet action="withdrawFlower">
          <WithdrawFlower
            onWithdraw={onWithdrawTokens}
            withdrawDisabled={accountTradedRecently}
          />
        </GameWallet>
      )}
      {page === "items" && (
        <GameWallet action="withdrawItems">
          <WithdrawItems
            onWithdraw={onWithdrawItems}
            withdrawDisabled={accountTradedRecently}
          />
        </GameWallet>
      )}
      {page === "resources" && (
        <GameWallet action="withdrawItems">
          <WithdrawResources
            onWithdraw={onClose}
            withdrawDisabled={accountTradedRecently}
          />
        </GameWallet>
      )}
      {page === "wearables" && (
        <GameWallet action="withdrawItems">
          <WithdrawWearables
            onWithdraw={onWithdrawWearables}
            withdrawDisabled={accountTradedRecently}
          />
        </GameWallet>
      )}
      {page === "buds" && (
        <GameWallet action="withdrawItems">
          <WithdrawBuds
            onWithdraw={onWithdrawBuds}
            withdrawDisabled={accountTradedRecently}
          />
        </GameWallet>
      )}
      {page === "pets" && (
        <GameWallet action="withdrawItems">
          <WithdrawPets
            onWithdraw={onWithdrawPets}
            withdrawDisabled={accountTradedRecently}
          />
        </GameWallet>
      )}
      {page === "verify" && <FaceRecognition />}
      {accountTradedRecently && (
        <div className="mt-2">
          <TradeCooldownWidget
            restrictionSecondsLeft={restrictionSecondsLeft}
          />
        </div>
      )}
    </>
  );
};
