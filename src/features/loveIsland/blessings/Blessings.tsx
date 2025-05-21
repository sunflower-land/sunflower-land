import { useAuth } from "features/auth/lib/Provider";
import { useGame } from "features/game/GameProvider";
import React, { useState } from "react";
import { ClaimBlessingReward } from "./ClaimBlessing";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import Decimal from "decimal.js-light";
import { NumberInput } from "components/ui/NumberInput";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
}
export const Blessings: React.FC<Props> = ({ onClose }) => {
  const { gameState, gameService } = useGame();
  const { authState } = useAuth();
  const { t } = useAppTranslation();

  const [page, setPage] = useState(10);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [amount, setAmount] = useState<Decimal>(new Decimal(0));

  const { offering, offered } = gameState.context.state.blessing;

  const offer = () => {
    gameService.send("blessing.offered", {
      effect: {
        type: "blessing.offered",
        amount: amount.toNumber(),
        item: offering.item,
      },
      authToken: authState.context.user.rawToken as string,
    });
  };

  if (offered) {
    return <ClaimBlessingReward onClose={onClose} />;
  }

  if (showConfirmation) {
    return (
      <>
        <Label type="danger">{t("blessing.areYouSure")}</Label>
        <div className="p-1">
          <div className="text-sm">{t("blessing.confirmOffering")}</div>
          <div className="text-sm my-2">{`${amount.toNumber()} x ${offering.item}`}</div>
          <div className="text-xs italic">{t("blessing.offeringWarning")}</div>
        </div>
        <Button onClick={offer}>{t("blessing.confirm")}</Button>
      </>
    );
  }

  if (page === 0) {
    return (
      <SpeakingText
        message={[
          {
            text: t("blessing.greetings"),
          },
          {
            text: t("blessing.seasonBlooming", {
              season: gameState.context.state.season.season,
            }),
          },
        ]}
        onClose={() => setPage(1)}
      />
    );
  }

  const inventory =
    gameState.context.state.inventory[offering.item] ?? new Decimal(0);

  return (
    <div>
      <div className="flex justify-between mb-1 mr-10">
        <Label type="default">{t("blessing.offerTitle")}</Label>
        <Label type="formula">{new Date().toISOString().slice(0, 10)}</Label>
      </div>
      <p className="text-xs m-1">{t("blessing.guardiansSeek")}</p>
      <div className="flex items-center">
        <Box image={ITEM_DETAILS[offering.item].image} count={inventory} />
        <div className="ml-2">
          <p className="text-sm">{offering.item}</p>
          <p className="text-xs">
            {t("blessing.chooseAmount", { name: offering.item })}
          </p>
        </div>
      </div>
      <NumberInput
        value={amount}
        maxDecimalPlaces={0}
        onValueChange={setAmount}
        className="mb-1"
      />
      {amount.lt(10) && (
        <Label type="danger" className="my-2">
          {t("blessing.minimumRequired", { amount: 10 })}
        </Label>
      )}
      {amount.gt(inventory) && (
        <Label type="danger" className="my-2">
          {t("blessing.maxAmount", { amount: inventory.toNumber() })}
        </Label>
      )}
      <Button
        disabled={amount.lt(10) || amount.gt(inventory)}
        onClick={() => setShowConfirmation(true)}
      >
        {t("blessing.offer")}
      </Button>
    </div>
  );
};
