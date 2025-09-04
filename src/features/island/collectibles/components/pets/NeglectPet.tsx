import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { PetName } from "features/game/types/pets";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

interface Props {
  handleNeglectPet: (petName: PetName) => void;
  petName: PetName;
}

export const NeglectPet: React.FC<Props> = ({ handleNeglectPet, petName }) => {
  const { t } = useAppTranslation();
  return (
    <InnerPanel>
      <Label type="warning">{t("pets.neglectPet")}</Label>
      <p className="text-sm p-1">
        {t("pets.neglectPetDescription", { pet: petName })}
      </p>
      <Button onClick={() => handleNeglectPet(petName)}>
        {t("pets.cheerPet", { pet: petName })}
      </Button>
    </InnerPanel>
  );
};
