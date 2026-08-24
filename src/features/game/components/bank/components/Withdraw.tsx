import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { Button } from "components/ui/Button";
import { ButtonPanel } from "components/ui/Panel";
import type Decimal from "decimal.js-light";
import { formatNumber } from "lib/utils/formatNumber";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { WithdrawFlower } from "./WithdrawFlower";
import { WithdrawItems } from "./WithdrawItems";
import { WithdrawWearables } from "./WithdrawWearables";
import { SUNNYSIDE } from "assets/sunnyside";
import chest from "assets/icons/chest.png";
import flowerIcon from "assets/icons/flower_token.webp";
import { WithdrawBuds } from "./WithdrawBuds";
import { Context } from "features/game/GameProvider";
import { Label } from "components/ui/Label";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { TradeCooldownWidget } from "features/game/components/TradeCooldownWidget";
import {
  getAccountTradedRestrictionSecondsLeft,
  isAccountTradedWithin90Days,
  type MachineState,
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
  balance: Decimal;
}> = ({ setPage, balance }) => {
  const { t } = useAppTranslation();

  const collections: {
    key: Page;
    name: string;
    icon: string;
    sub: string;
  }[] = [
    {
      key: "items",
      name: getPageText("items"),
      icon: getPageIcon("items"),
      sub: t("withdraw.menu.collectibles.subtitle"),
    },
    {
      key: "wearables",
      name: getPageText("wearables"),
      icon: getPageIcon("wearables"),
      sub: t("withdraw.menu.wearables.subtitle"),
    },
    {
      key: "buds",
      name: getPageText("buds"),
      icon: getPageIcon("buds"),
      sub: t("withdraw.menu.buds.subtitle"),
    },
    {
      key: "pets",
      name: getPageText("pets"),
      icon: getPageIcon("pets"),
      sub: t("withdraw.menu.pets.subtitle"),
    },
  ];

  return (
    <div className="flex flex-col gap-2 p-1">
      <span className="text-xs">{t("withdraw.menu.intro")}</span>

      {/* FLOWER token */}
      <ButtonPanel
        onClick={() => setPage("tokens")}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <img src={flowerIcon} className="w-8 h-8" />
          <div className="flex flex-col">
            <span className="text-sm">{`FLOWER`}</span>
            <span className="text-xxs">
              {t("withdraw.menu.flower.subtitle")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-secondary">
            {formatNumber(balance, { decimalPlaces: 2 })}
          </span>
          <img src={SUNNYSIDE.icons.arrow_right} className="h-3 opacity-60" />
        </div>
      </ButtonPanel>

      <span className="text-xxs">{t("withdraw.menu.nftCollections")}</span>
      <div className="grid grid-cols-2 gap-1">
        {collections.map((collection) => (
          <ButtonPanel
            key={collection.key}
            variant="card"
            onClick={() => setPage(collection.key)}
            className="flex flex-col gap-1"
          >
            <img src={collection.icon} className="w-6 h-6" />
            <span className="text-sm">{collection.name}</span>
            <span className="text-xxs">{collection.sub}</span>
          </ButtonPanel>
        ))}
      </div>

      <Button onClick={() => setPage("verify")}>
        <div className="flex items-center">
          <img src={getPageIcon("verify")} className="h-4 mr-1" />
          {getPageText("verify")}
        </div>
      </Button>
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

export const Withdraw: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const farmId = useSelector(gameService, _farmId);
  const balance = useSelector(gameService, (s) => s.context.state.balance);

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
      {page === "main" && <MainMenu setPage={setPage} balance={balance} />}
      {/* Collection pages own their back navigation inside WithdrawCollection;
          other pages keep the shared back/title header. */}
      {page !== "main" &&
        !["items", "wearables", "buds", "pets"].includes(page) && (
          <NavigationMenu page={page} setPage={setPage} />
        )}
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
            onBack={() => setPage("main")}
            withdrawDisabled={accountTradedRecently}
          />
        </GameWallet>
      )}
      {page === "wearables" && (
        <GameWallet action="withdrawItems">
          <WithdrawWearables
            onWithdraw={onWithdrawWearables}
            onBack={() => setPage("main")}
            withdrawDisabled={accountTradedRecently}
          />
        </GameWallet>
      )}
      {page === "buds" && (
        <GameWallet action="withdrawItems">
          <WithdrawBuds
            onWithdraw={onWithdrawBuds}
            onBack={() => setPage("main")}
            withdrawDisabled={accountTradedRecently}
          />
        </GameWallet>
      )}
      {page === "pets" && (
        <GameWallet action="withdrawItems">
          <WithdrawPets
            onWithdraw={onWithdrawPets}
            onBack={() => setPage("main")}
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
