import React, { useState } from "react";

import { Button } from "components/ui/Button";

import { DeliverItems } from "./DeliverItems";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onWithdraw: () => void;
}

export const Delivery: React.FC<Props> = ({ onWithdraw }) => {
  const [isTalking, setIsTalking] = useState(true);
  const { t } = useAppTranslation();

  if (isTalking) {
    return (
      <>
        <div className="p-2 mb-2">
          <img
            src={SUNNYSIDE.npcs.goblin_carry}
            className="h-16 my-2 running relative left-1/4"
          />
          <div className="flex flex-col space-y-3">
            <span className="text-sm">{t("delivery.ressource")}</span>
            <span className="text-sm">{t("delivery.feed")}</span>
            <span className="text-sm">
              {t("delivery.fee")}
              <a
                className="underline"
                href="https://docs.sunflower-land.com/economy/goblin-community-treasury"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("delivery.goblin.comm.treasury")}
              </a>
              {"."}
            </span>
          </div>
        </div>
        <Button onClick={() => setIsTalking(false)}>{t("continue")}</Button>
      </>
    );
  }
  return <DeliverItems onWithdraw={onWithdraw} />;
};
