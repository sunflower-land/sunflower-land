import React, { useContext } from "react";

import { Button } from "components/ui/Button";

import { SUNNYSIDE } from "assets/sunnyside";
import { MachineInterpreter } from "features/game/lib/auctionMachine";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  auctionService: MachineInterpreter;
}
export const MissingAuction: React.FC<Props> = ({ auctionService }) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);

  const refund = () => {
    gameService.send({ type: "bid.refunded" });
    auctionService.send({ type: "REFUND" });
    gameService.send({ type: "SAVE" });
  };

  return (
    <div className="flex flex-col items-center">
      <p className="mb-2">{t("loser.longer")}</p>
      <img src={SUNNYSIDE.icons.neutral} className="w-12 mb-2" />
      <Button className="mt-2" onClick={refund}>
        {t("loser.refund.one")}
      </Button>
    </div>
  );
};
