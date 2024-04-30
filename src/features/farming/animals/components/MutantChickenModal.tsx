import React from "react";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { MutantChicken } from "features/game/types/game";

import richChicken from "assets/animals/chickens/rich_chicken.png";
import fatChicken from "assets/animals/chickens/fat_chicken.png";
import speedChicken from "assets/animals/chickens/speed_chicken.png";
import ayamCemani from "assets/animals/chickens/ayam_cemani.png";
import elPolloVeloz from "assets/animals/chickens/el_pollo_veloz.png";
import bananaChicken from "assets/animals/chickens/banana_chicken.png";
import crimPeckster from "assets/animals/chickens/crim_peckster.png";
import knightChicken from "assets/animals/chickens/knight_chicken.png";

import { Button } from "components/ui/Button";
import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const mutants: Record<MutantChicken, Record<string, string>> = {
  "Speed Chicken": {
    description: translate("description.speed.chicken.one"),
    image: speedChicken,
  },
  "Fat Chicken": {
    description: translate("description.fat.chicken.one"),
    image: fatChicken,
  },
  "Rich Chicken": {
    description: translate("description.rich.chicken.one"),
    image: richChicken,
  },
  "Ayam Cemani": {
    description: translate("description.ayam.cemani"),
    image: ayamCemani,
  },
  "El Pollo Veloz": {
    description: translate("description.el.pollo.veloz.one"),
    image: elPolloVeloz,
  },
  "Banana Chicken": {
    description: translate("description.banana.chicken"),
    image: bananaChicken,
  },
  "Crim Peckster": {
    description: translate("description.crim.peckster"),
    image: crimPeckster,
  },
  "Knight Chicken": {
    description: translate("description.knight.chicken"),
    image: knightChicken,
  },
};

interface Props {
  type: MutantChicken;
  show: boolean;
  onContinue: () => void;
}

export const MutantChickenModal = ({ type, show, onContinue }: Props) => {
  const { t } = useAppTranslation();
  return (
    <Modal show={show}>
      <Panel>
        <div className="p-2">
          <h1 className="text-lg text-center">
            {type}
            {"!"}
          </h1>
          <div className="flex my-4 justify-center">
            <img src={mutants[type].image} style={{ width: "50px" }} />
          </div>
          <p className="text-sm mb-2">{t("statements.mutant.chicken")}</p>
          <p className="text-sm mb-2">{mutants[type].description}</p>
        </div>

        <div className="flex">
          <Button onClick={onContinue}>{t("continue")}</Button>
        </div>
      </Panel>
    </Modal>
  );
};
