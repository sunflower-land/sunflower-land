import React, { useContext, useState } from "react";

import { Button } from "components/ui/Button";
import { Checkbox } from "components/ui/Checkbox";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const TERMS_URL = "https://docs.sunflower-land.com/support/terms-of-service";

/**
 * Placeholder swapped into `tcs.agree` so the link can be rendered inline.
 * Chosen to be something no translation would ever produce on its own.
 */
const TERMS_PLACEHOLDER = "%TERMS%";

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
  const { t } = useAppTranslation();
  const [accepted, setAccepted] = useState(false);

  const acknowledge = () => {
    gameService.send({ type: "tcs.acknowledged" });
    gameService.send({ type: "ACKNOWLEDGE" });
  };

  const terms = t("tcs.terms");

  // The link sits inside the sentence and languages order it differently, so
  // split around the interpolated placeholder rather than concatenating.
  const [beforeLink, afterLink = ""] = t("tcs.agree", {
    terms: TERMS_PLACEHOLDER,
  }).split(TERMS_PLACEHOLDER);

  return (
    <div className="flex flex-col">
      <div className="p-1">
        <Label type="info" icon={SUNNYSIDE.icons.expression_alerted}>
          {t("tcs.title")}
        </Label>
        <NoticeboardItems
          items={[
            {
              text: t("tcs.rule.two"),
              icon: SUNNYSIDE.icons.player,
            },
            {
              text: t("tcs.rule.three"),
              icon: SUNNYSIDE.icons.search,
            },
            {
              text: t("tcs.rule.one"),
              icon: SUNNYSIDE.icons.heart,
            },
          ]}
        />
        <div className="flex items-center gap-2 my-2">
          <Checkbox
            checked={accepted}
            onChange={setAccepted}
            aria-label={t("tcs.agree", { terms })}
          />
          <p
            className="text-xs cursor-pointer"
            onClick={() => setAccepted(!accepted)}
          >
            {beforeLink}
            <a
              href={TERMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              // Opening the terms shouldn't also tick the box
              onClick={(e) => e.stopPropagation()}
            >
              {terms}
            </a>
            {afterLink}
          </p>
        </div>
      </div>
      <Button disabled={!accepted} onClick={acknowledge}>
        {t("continue")}
      </Button>
    </div>
  );
};
