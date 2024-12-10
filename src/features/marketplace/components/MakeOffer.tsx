import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { NumberInput } from "components/ui/NumberInput";
import { MachineState } from "features/game/lib/gameMachine";
import { GameWallet } from "features/wallet/Wallet";
import { CONFIG } from "lib/config";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { config } from "features/wallet/WalletProvider";
import { VIPAccess } from "features/game/components/VipAccess";

import { TradeableDisplay } from "../lib/tradeables";
import { Context } from "features/game/GameProvider";
import { signTypedData } from "@wagmi/core";

import walletIcon from "assets/icons/wallet.png";
import sflIcon from "assets/icons/sfl.webp";
import lockIcon from "assets/icons/lock.png";
import { TradeableSummary } from "./TradeableSummary";
import { getTradeType } from "../lib/getTradeType";
import { ResourceOffer } from "./ResourceOffer";
import { InventoryItemName } from "features/game/types/game";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";
import { getKeys } from "features/game/types/craftables";
import { KNOWN_ITEMS } from "features/game/types";
import Decimal from "decimal.js-light";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { calculateTradePoints } from "features/game/events/landExpansion/addTradePoints";

const _balance = (state: MachineState) => state.context.state.balance;
const _isVIP = (state: MachineState) =>
  hasVipAccess(state.context.state.inventory);
export const MakeOffer: React.FC<{
  display: TradeableDisplay;
  floorPrice: number;
  itemId: number;
  authToken: string;
  onClose: () => void;
}> = ({ onClose, display, itemId, authToken, floorPrice }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const usd = gameService.getSnapshot().context.prices.sfl?.usd ?? 0.0;

  const balance = useSelector(gameService, _balance);
  const isVIP = useSelector(gameService, _isVIP);
  const { openModal } = useContext(ModalContext);

  const [offer, setOffer] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [isSigning, setIsSigning] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const isResource = getKeys(TRADE_LIMITS).includes(
    KNOWN_ITEMS[Number(itemId)],
  );

  const tradeType = getTradeType({
    collection: display.type,
    id: itemId,
    trade: {
      sfl: offer,
    },
  });

  const sign = async () => {
    const signature = await signTypedData(config, {
      primaryType: "Offer",
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        Offer: [
          { name: "item", type: "string" },
          { name: "collection", type: "string" },
          { name: "id", type: "uint256" },
          { name: "quantity", type: "uint256" },
          { name: "SFL", type: "uint256" },
        ],
      },
      domain: {
        name: CONFIG.NETWORK === "mainnet" ? "Sunflower Land" : "TESTING",
        version: "1",
        chainId: BigInt(CONFIG.POLYGON_CHAIN_ID),
        verifyingContract:
          CONFIG.MARKETPLACE_VERIFIER_CONTRACT as `0x${string}`,
      },
      message: {
        item: display.name,
        collection: display.type,
        id: BigInt(itemId),
        quantity: BigInt(Math.max(1, quantity)),
        SFL: BigInt(offer),
      },
    });

    confirm({ signature });

    setIsSigning(false);
  };

  const submitOffer = () => {
    if (tradeType === "onchain") {
      setIsSigning(true);
      return;
    }

    setShowConfirmation(true);
  };

  const confirm = async ({ signature }: { signature?: string }) => {
    gameService.send("marketplace.offerMade", {
      effect: {
        type: "marketplace.offerMade",
        id: itemId,
        collection: display.type,
        signature,
        contract: CONFIG.MARKETPLACE_VERIFIER_CONTRACT,
        quantity: Math.max(1, quantity),
        sfl: offer,
      },
      authToken,
    });

    onClose();
  };

  const estTradePoints =
    offer === 0
      ? 0
      : calculateTradePoints({
          sfl: offer,
          points: tradeType === "instant" ? 2 : 10,
        }).multipliedPoints;

  if (showConfirmation) {
    return (
      <>
        <div className="p-2">
          <Label type="danger" className="-ml-1 mb-2">
            {t("are.you.sure")}
          </Label>
          <p className="text-xs mb-2">{t("marketplace.confirmDetails")}</p>
          <TradeableSummary
            display={display}
            sfl={offer}
            quantity={quantity}
            estTradePoints={estTradePoints}
          />
        </div>

        <div className="flex">
          <Button onClick={() => setShowConfirmation(false)} className="mr-1">
            {t("cancel")}
          </Button>
          <Button onClick={() => confirm({})}>{t("confirm")}</Button>
        </div>
      </>
    );
  }

  if (isSigning) {
    return (
      <GameWallet action="marketplace">
        <>
          <div className="p-2">
            <Label type="danger" className="-ml-1 mb-2">
              {t("are.you.sure")}
            </Label>
            <p className="text-xs mb-2">{t("marketplace.signOffer")}</p>
            <TradeableSummary
              display={display}
              sfl={offer}
              quantity={Math.max(1, quantity)}
              estTradePoints={estTradePoints}
            />
          </div>

          <div className="flex">
            <Button onClick={() => setIsSigning(false)} className="mr-1">
              {t("cancel")}
            </Button>
            <Button onClick={sign}>{t("marketplace.signAndOffer")}</Button>
          </div>
        </>
      </GameWallet>
    );
  }

  if (isResource) {
    return (
      <ResourceOffer
        itemName={display.name as InventoryItemName}
        floorPrice={floorPrice}
        isSaving={false}
        onCancel={onClose}
        onOffer={() => confirm({})}
        price={offer}
        quantity={quantity}
        setPrice={setOffer}
        setQuantity={setQuantity}
      />
    );
  }

  /* TODO only use game wallet when required */
  return (
    <>
      <div className="p-2">
        <div className="flex flex-wrap justify-between mb-2">
          <Label type="default" className="-ml-1 mb-1">
            {t("marketplace.makeOffer")}
          </Label>
          {!isVIP && (
            <VIPAccess
              isVIP={isVIP}
              onUpgrade={() => {
                openModal("BUY_BANNER");
              }}
              // text={t("marketplace.unlockSelling")}
              labelType={!isVIP ? "danger" : undefined}
            />
          )}

          {tradeType === "onchain" && (
            <Label type="formula" icon={walletIcon} className="-mr-1">
              {t("marketplace.walletRequired")}
            </Label>
          )}
        </div>
        <p className="text-sm">{t("marketplace.howMuch")}</p>
        <div className="my-2 -mx-2">
          <NumberInput
            value={offer}
            onValueChange={(decimal) => setOffer(decimal.toNumber())}
            maxDecimalPlaces={2}
            isOutOfRange={balance.lt(offer)}
            icon={sflIcon}
          />
          <p className="text-xxs ml-2">
            {`$${new Decimal(usd).mul(offer).toFixed(2)}`}
          </p>
        </div>

        <Label type="default" className="-ml-1 mb-1" icon={lockIcon}>
          {t("marketplace.sflLocked")}
        </Label>
        <p className="text-xs mb-2">{t("marketplace.sflLocked.description")}</p>
      </div>

      <div className="flex">
        <Button className="mr-1" onClick={() => onClose()}>
          {t("cancel")}
        </Button>
        <Button
          disabled={!offer || balance.lt(offer) || !isVIP}
          onClick={submitOffer}
          className="relative"
        >
          <span>{t("confirm")}</span>
          {tradeType === "onchain" && (
            <img src={walletIcon} className="absolute right-1 top-0.5 h-7" />
          )}
        </Button>
      </div>
    </>
  );
};
