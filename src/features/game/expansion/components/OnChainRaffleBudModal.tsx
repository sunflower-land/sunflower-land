import React, { useContext } from "react";
import { Modal } from "components/ui/Modal";
import { Context } from "features/game/GameProvider";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { getBudImage } from "lib/buds/types";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { InlineDialogue } from "features/world/ui/TypingMessage";
import { getBudTraits, getBudBuffs } from "features/game/types/budBuffs";
import { capitalize } from "lib/utils/capitalize";
import powerup from "assets/icons/level_up.png";

interface Props {
  budId: number;
}

const BUD_TRAIT_ORDER = ["type", "colour", "stem", "aura", "ears"] as const;

export const OnChainRaffleBudModal: React.FC<Props> = ({ budId }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const budImageUrl = getBudImage(budId);
  const budTraits = getBudTraits(budId);
  const buffs = getBudBuffs(budId);

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
        <InnerPanel>
          <div className="p-1">
            <InlineDialogue message={t("auction.raffle.win")} />
          </div>
        </InnerPanel>
        <div className="flex justify-center gap-1 sm:flex-row text-[24px] leading-5 sm:text-[28px] sm:leading-6">
          <InnerPanel className="flex justify-center relative w-[45%] sm:w-[60%]">
            <img
              className="rounded-md object-contain w-full"
              src={budImageUrl}
              alt={`Bud #${budId}`}
            />
          </InnerPanel>
          {budTraits && (
            <InnerPanel className="w-[55%] sm:w-full">
              <Label type="default">{t("pets.traits")}</Label>
              <div className="flex flex-col gap-1 p-1.5 -mt-1">
                {BUD_TRAIT_ORDER.filter((key) => key in budTraits).map(
                  (trait) => (
                    <div key={`${budTraits[trait]}-${budId}`}>
                      <div className="flex space-x-2 items-center">
                        <div className="gap-1">
                          <span>{`${capitalize(trait)}: `}</span>
                          <div className="inline-flex items-center gap-1">
                            <span className="whitespace-nowrap">
                              {`${budTraits[trait]}`}
                            </span>
                            {((trait === "aura" &&
                              budTraits.aura !== "No Aura") ||
                              (trait === "stem" &&
                                budTraits.stem !== "Basic Leaf")) && (
                              <img
                                src={powerup}
                                alt="Powerup"
                                className="w-4"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </InnerPanel>
          )}
        </div>

        {buffs.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-1 w-full">
            <InnerPanel className="w-full gap-2">
              <div>
                <Label type="default">{t("boosts")}</Label>
                <div className="flex flex-col gap-1 p-1.5">
                  {buffs.map((buff) => (
                    <div
                      key={buff.shortDescription}
                      className="flex space-x-2 items-center gap-1"
                    >
                      <Label
                        type={buff.labelType}
                        icon={buff.boostTypeIcon}
                        secondaryIcon={buff.boostedItemIcon}
                      >
                        {buff.shortDescription}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </InnerPanel>
          </div>
        )}
        <Button className="w-full" onClick={onPlaceBud}>
          {t("buds.place")}
        </Button>
      </OuterPanel>
    </Modal>
  );
};
