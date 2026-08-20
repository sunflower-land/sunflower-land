import React, { useContext, useState } from "react";

import { Button } from "components/ui/Button";
import { Checkbox } from "components/ui/Checkbox";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { SUNNYSIDE } from "assets/sunnyside";

const TERMS_URL = "https://docs.sunflower-land.com/support/terms-of-service";

/**
 * Blocking Terms & Conditions gate.
 *
 * Shown by the `termsAndConditions` machine state whenever the player has never
 * accepted the terms, or their last acceptance is over 30 days old. It is
 * deliberately not closable - the only way out is to tick the box and continue,
 * which stamps `tcsAcknowledged` on the game state.
 */
export const TermsAndConditions: React.FC = () => {
  const { gameService } = useContext(Context);
  const [accepted, setAccepted] = useState(false);

  const acknowledge = () => {
    gameService.send({ type: "tcs.acknowledged" });
    gameService.send({ type: "ACKNOWLEDGE" });
  };

  return (
    <div className="flex flex-col">
      <div className="p-1">
        <Label type="info" className="mb-2">
          {`Rules`}
        </Label>
        <NoticeboardItems
          items={[
            {
              text: `Sunflower Land is a game - not a financial product.`,
              icon: SUNNYSIDE.icons.heart,
            },
            {
              text: `1 account per player (no sharing)`,
              icon: SUNNYSIDE.icons.player,
            },
            {
              text: `Respect the rules - no botting/automation tools`,
              icon: SUNNYSIDE.icons.search,
            },
          ]}
        />
        <div className="flex items-center gap-2 my-2">
          <Checkbox
            checked={accepted}
            onChange={setAccepted}
            aria-label="Accept the Terms and Conditions"
          />
          <p
            className="text-xs cursor-pointer"
            onClick={() => setAccepted(!accepted)}
          >
            {`I have read and agree to the `}
            <a
              href={TERMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              // Opening the terms shouldn't also tick the box
              onClick={(e) => e.stopPropagation()}
            >
              {`Terms and Conditions`}
            </a>
            {`.`}
          </p>
        </div>
      </div>
      <Button disabled={!accepted} onClick={acknowledge}>
        {`Continue`}
      </Button>
    </div>
  );
};
