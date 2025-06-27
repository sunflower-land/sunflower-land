import React from "react";

import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useContext } from "react";
import { Context as AuthContext } from "features/auth/lib/Provider";

const _isSeedling = (state: MachineState) =>
  hasReputation({
    game: state.context.state,
    reputation: Reputation.Seedling,
  });

export const NoNFT: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthContext);

  const isSeedling = useSelector(gameService, _isSeedling);

  const mint = () => {
    gameService.send("nft.assigned", {
      effect: {
        type: "nft.assigned",
      },
      authToken: authService.state.context.user.rawToken as string,
    });
  };

  return (
    <>
      <div className="p-2 pt-1">
        <div className="flex items-center justify-between mb-2">
          <Label icon={SUNNYSIDE.resource.pirate_bounty} type="default">
            {t("wallet.missingNFT")}
          </Label>
          {!isSeedling && (
            <Label type="danger" icon={SUNNYSIDE.crops.seedling}>
              {t("reputation.seedlingRequired")}
            </Label>
          )}
        </div>
        <p className="text-sm mb-2">
          {t("wallet.requireFarmNFT")}
          {"."}
        </p>
        <p className="text-xs mb-2">
          {t("wallet.uniqueFarmNFT")}
          {"."}
        </p>
        {!isSeedling && (
          <p className="text-xs mb-2">
            {t("wallet.seedlingRequired")}
            {"."}
          </p>
        )}
      </div>
      <Button onClick={mint} disabled={!isSeedling}>
        {t("wallet.mintFreeNFT")}
      </Button>
    </>
  );
};
