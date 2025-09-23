import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { PetName } from "features/game/types/pets";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";
import xpIcon from "assets/icons/xp.png";

interface Props {
  handleNeglectPet: (petId: PetName | number) => void;
  petId: PetName | number;
  petName: string;
}

export const NeglectPet: React.FC<Props> = ({
  handleNeglectPet,
  petId,
  petName,
}) => {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col gap-1">
      <Label type="danger">{t("pets.neglectPet")}</Label>
      <p className="text-sm px-1">
        {t("pets.neglectPetDescription", { pet: petName })}
      </p>
      <Label type="danger" secondaryIcon={xpIcon}>{`-500`}</Label>
      <Button onClick={() => handleNeglectPet(petId)}>
        {t("pets.cheerPet", { pet: petName })}
      </Button>
    </div>
  );
};
