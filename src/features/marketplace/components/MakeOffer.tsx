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

const _balance = (state: MachineState) => state.context.state.balance;

export const MakeOffer: React.FC<{
  display: TradeableDisplay;
  floorPrice: number;
  itemId: number;
  authToken: string;
  onClose: () => void;
}> = ({ onClose, display, itemId, authToken, floorPrice }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const balance = useSelector(gameService, _balance);

  const [offer, setOffer] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isSigning, setIsSigning] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
        quantity: BigInt(1),
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
        quantity,
        sfl: offer,
      },
      authToken,
    });

    onClose();
  };

  if (showConfirmation) {
    return (
      <>
        <div className="p-2">
          <Label type="danger" className="-ml-1 mb-2">
            {t("are.you.sure")}
          </Label>
          <p className="text-xs mb-2">{t("marketplace.confirmDetails")}</p>
          <TradeableSummary display={display} sfl={offer} quantity={quantity} />
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
              quantity={quantity}
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

  const isComingSoon = tradeType === "onchain" && CONFIG.NETWORK === "mainnet";

  if (display.type === "resources") {
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
        <div className="flex justify-between">
          <Label type="default" className="-ml-1 mb-1">
            {t("marketplace.makeOffer")}
          </Label>
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
        </div>

        <Label type="default" className="-ml-1 mb-1" icon={lockIcon}>
          {t("marketplace.sflLocked")}
        </Label>
        <p className="text-xs mb-2">{t("marketplace.sflLocked.description")}</p>
      </div>

      {isComingSoon && (
        <div className="p-2">
          <Label type="danger" className="-ml-1 mb-2">
            {t("marketplace.onchainComingSoon")}
          </Label>
        </div>
      )}

      <div className="flex">
        <Button className="mr-1" onClick={() => onClose()}>
          {t("cancel")}
        </Button>
        <Button
          disabled={!offer || balance.lt(offer)}
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
