import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import { Button } from "components/ui/Button";

import { Context } from "../GoblinProvider";
import { MintedEvent } from "../lib/goblinMachine";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Minted: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);
  const { t } = useAppTranslation();
  // Grab the last event triggered + item.
  const mintedItemName = ((goblinState.event as any)?.data as MintedEvent)
    ?.item;

  return (
    <div className="flex flex-col">
      <div className="p-2 flex flex-col items-center">
        <h1 className="text-center mb-3 text-lg">
          {t("statements.minted")} {mintedItemName}!
        </h1>
        <img src={SUNNYSIDE.npcs.goblin_doing} className="w-20 mb-3" />
        <p className="mb-4 text-sm text-justify">
          {`${t("statements.minted.goToChest")}`}
        </p>
        <p className="mb-4 text-sm text-justify">
          {`${t("statements.minted.withdrawAfterMint")}`}
        </p>
      </div>
      <Button onClick={() => goblinService.send("REFRESH")}>{t("ok")}</Button>
    </div>
  );
};
