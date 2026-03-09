import React, { useContext } from "react";
import { Modal } from "components/ui/Modal";
import { Context } from "features/game/GameProvider";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { getBudImage } from "lib/buds/types";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  budId: number;
}

export const OnChainRaffleBudModal: React.FC<Props> = ({ budId }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const budImageUrl = getBudImage(budId);

  const onClose = () => gameService.send("CONTINUE");

  const onPlaceBud = () => {
    gameService.send("CONTINUE");
    gameService.send("LANDSCAPE", {
      action: "nft.placed",
      placeable: {
        id: budId.toString(),
        name: "Bud",
      },
      location: "farm",
    });
  };

  return (
    <Modal show={true} onHide={onClose}>
      <OuterPanel className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <Label type="default">
            <span className="text-sm px-0.5 pb-0.5">{`Bud #${budId}`}</span>
          </Label>
          <div onClick={onClose} className="cursor-pointer">
            <img
              src={SUNNYSIDE.icons.close}
              alt="Close"
              style={{
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 p-2">
          <p className="text-sm text-center">{t("auction.raffle.win")}</p>
          <div className="w-24 h-24 flex justify-center items-center">
            <img
              src={budImageUrl}
              alt={`Bud #${budId}`}
              className="w-full h-full object-contain rounded-md"
            />
          </div>
        </div>
        <div className="flex gap-1">
          <Button onClick={onClose}>{t("close")}</Button>
          <Button className="flex-1" onClick={onPlaceBud}>
            {t("pets.place")}
          </Button>
        </div>
      </OuterPanel>
    </Modal>
  );
};
