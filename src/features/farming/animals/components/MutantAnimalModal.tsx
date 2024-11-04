import React from "react";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { MutantAnimal } from "features/game/types/game";

import richChicken from "assets/animals/chickens/rich_chicken.png";
import fatChicken from "assets/animals/chickens/fat_chicken.png";
import speedChicken from "assets/animals/chickens/speed_chicken.png";
import ayamCemani from "assets/animals/chickens/ayam_cemani.png";
import elPolloVeloz from "assets/animals/chickens/el_pollo_veloz.png";
import bananaChicken from "assets/animals/chickens/banana_chicken.png";
import crimPeckster from "assets/animals/chickens/crim_peckster.png";
import knightChicken from "assets/animals/chickens/knight_chicken.png";
import pharaohChicken from "assets/animals/chickens/pharaoh_chicken.webp";
import alienChicken from "assets/sfts/alien_chicken.webp";
import toxicTuft from "assets/sfts/toxic_tuft.webp";
import mootant from "assets/sfts/mootant.webp";

import { Button } from "components/ui/Button";
import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const mutants: Record<
  MutantAnimal | "Speed Chicken" | "Fat Chicken" | "Rich Chicken",
  {
    description: string;
    image: string;
  }
> = {
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
  "Pharaoh Chicken": {
    description: translate("description.pharaoh.chicken"),
    image: pharaohChicken,
  },
  "Alien Chicken": {
    description: translate("description.alien.chicken"),
    image: alienChicken,
  },
  "Toxic Tuft": {
    description: translate("description.toxic.tuft"),
    image: toxicTuft,
  },
  Mootant: {
    description: translate("description.mootant"),
    image: mootant,
  },
};

interface Props {
  mutant: MutantAnimal;
  show: boolean;
  onContinue: () => void;
}

export const MutantAnimalModal = ({ mutant, show, onContinue }: Props) => {
  const { t } = useAppTranslation();
  return (
    <Modal show={show}>
      <Panel>
        <div className="p-2">
          <h1 className="text-lg text-center">
            {mutant}
            {"!"}
          </h1>
          <div className="flex my-4 justify-center">
            <img src={mutants[mutant].image} style={{ width: "50px" }} />
          </div>
          <p className="text-sm mb-2">{t("statements.mutant.animal")}</p>
          <p className="text-sm mb-2">{mutants[mutant].description}</p>
        </div>

        <div className="flex">
          <Button onClick={onContinue}>{t("continue")}</Button>
        </div>
      </Panel>
    </Modal>
  );
};
