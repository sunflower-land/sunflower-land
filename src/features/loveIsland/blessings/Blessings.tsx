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

interface Props {
  onClose: () => void;
}
export const Blessings: React.FC<Props> = ({ onClose }) => {
  const { gameState, gameService } = useGame();
  const { authState } = useAuth();

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
        <Label type="danger">Are you sure?</Label>
        <div className="text-sm ">
          Are you sure you want to offer the following?
        </div>
        <div className="text-sm">{`${amount.toNumber()} x ${offering.item}`}</div>
        <div className="text-xs italic">
          Offerings are donations to the Guardians and will be burnt.
        </div>
        <Button onClick={offer}>Confirm</Button>
      </>
    );
  }

  if (page === 0) {
    return (
      <SpeakingText
        message={[
          {
            text: "Greetings farmer...you have stumbled upon divinity. Are you worthy of a blessing?",
          },
          {
            text: `${gameState.context.state.season.season} is blooming. Will you show your faith in the Gods?`,
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
        <Label type="default">Offer a Blessing</Label>
        <Label type="formula">{new Date().toISOString().slice(0, 10)}</Label>
      </div>
      <p className="text-xs">
        Every day, the Guardians seek an offering. Show your faith, for the
        chance to gain a blessing.
      </p>
      <div className="flex">
        <Box image={ITEM_DETAILS[offering.item].image} count={inventory} />
        <div>
          <p className="text-sm">{offering.item}</p>
          <p className="text-xs">
            The guardians seek {offering.item} for today's offering.
          </p>
        </div>
      </div>
      <NumberInput
        value={amount}
        maxDecimalPlaces={0}
        onValueChange={setAmount}
      />
      {amount.lt(10) && (
        <Label type="danger" className="my-2">{`Minimum 10 required`}</Label>
      )}
      {amount.gt(inventory) && (
        <Label
          type="danger"
          className="my-2"
        >{`Minimum ${inventory.toNumber()} required`}</Label>
      )}
      <Button
        disabled={amount.lt(10) || amount.gt(inventory)}
        onClick={() => setShowConfirmation(true)}
      >
        Offer
      </Button>
    </div>
  );
};
