import React, { useContext } from "react";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { MutantAnimal } from "features/game/types/game";

import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";

import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import chest from "assets/icons/chest.png";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";

interface Props {
  mutant: MutantAnimal;
  show: boolean;
  onContinue: () => void;
}
const _state = (state: MachineState) => state.context.state;
export const MutantAnimalModal = ({ mutant, show, onContinue }: Props) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const boost = COLLECTIBLE_BUFF_LABELS[mutant]?.({
    skills: state.bumpkin.skills,
    collectibles: state.collectibles,
  });

  return (
    <Modal show={show} dialogClassName="max-w-[480px]">
      <Panel>
        <div className="flex flex-wrap justify-between m-1 ml-2 mb-2">
          <Label type="warning" icon={chest}>
            {t("reward")}
          </Label>
          <Label type="info" secondaryIcon={SUNNYSIDE.icons.stopwatch}>
            {t("chapter")}
          </Label>
        </div>
        <div className="flex flex-col justify-center items-center mb-2 mx-1 sm:mx-2">
          <p className="text-base mb-2">
            {mutant}
            {"!"}
          </p>
          <img src={ITEM_DETAILS[mutant]?.image} className="h-14 mb-2" />
          <span className="text-xs text-center mb-2">
            {t("statements.mutant.animal")}
          </span>
          <span className="text-xs text-center mb-2">
            {ITEM_DETAILS[mutant]?.description}
          </span>
          {boost && (
            <div className="flex flex-row flex-wrap items-center">
              {boost.map(
                (
                  {
                    labelType,
                    boostTypeIcon,
                    boostedItemIcon,
                    shortDescription,
                  },
                  index,
                ) => (
                  <Label
                    key={index}
                    type={labelType}
                    icon={boostTypeIcon}
                    secondaryIcon={boostedItemIcon}
                    className="mb-1"
                  >
                    {shortDescription}
                  </Label>
                ),
              )}
            </div>
          )}
        </div>
        <Button onClick={onContinue}>{t("continue")}</Button>
      </Panel>
    </Modal>
  );
};
