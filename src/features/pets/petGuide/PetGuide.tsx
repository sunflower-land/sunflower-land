import { Button } from "components/ui/Button";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import React, { useState } from "react";
import { PetEgg } from "./PetEgg";
import { Label } from "components/ui/Label";
import { Feed } from "./Feed";
import { Fetch } from "./Fetch";
import { PetMaintenance } from "./PetMaintenance";
import { PetLevelsAndPerks } from "./PetLevelsAndPerks";
import { PetCategories } from "./PetCategories";
import { Shrines } from "./Shrines";
import { NFTTraits } from "./NFTTraits";
import { Social } from "./Social";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

type PetGuideView =
  | "Pet Egg"
  | "Feed"
  | "Fetch"
  | "Pet Maintenance"
  | "Pet Categories"
  | "Levels & Perks"
  | "Shrines"
  | "NFT Traits"
  | "Social";

export const PetGuide: React.FC<{ isNFTPet: boolean }> = ({ isNFTPet }) => {
  const [view, setView] = useState<PetGuideView>();

  const setToDefault = () => setView(undefined);

  if (view === "Pet Egg") {
    return <PetEgg onBack={setToDefault} />;
  }
  if (view === "Feed") {
    return <Feed onBack={setToDefault} />;
  }
  if (view === "Fetch") {
    return <Fetch onBack={setToDefault} />;
  }
  if (view === "Pet Maintenance") {
    return <PetMaintenance onBack={setToDefault} />;
  }
  if (view === "Pet Categories") {
    return <PetCategories onBack={setToDefault} />;
  }
  if (view === "Levels & Perks") {
    return <PetLevelsAndPerks onBack={setToDefault} />;
  }
  if (view === "Shrines") {
    return <Shrines onBack={setToDefault} />;
  }
  if (view === "NFT Traits") {
    return <NFTTraits onBack={setToDefault} />;
  }
  if (view === "Social") {
    return <Social onBack={setToDefault} />;
  }

  return (
    <InnerPanel>
      <Label type="default">{`Pet Guide`}</Label>
      <p className="text-xs p-1">{`Learn about pets and how to care for them.`}</p>
      <div id="Buttons" className="grid grid-cols-2 gap-1">
        <Button onClick={() => setView("Pet Egg")}>{`Pet Egg`}</Button>
        <Button onClick={() => setView("Feed")}>{`Feed`}</Button>
        <Button onClick={() => setView("Fetch")}>{`Fetch`}</Button>
        <Button onClick={() => setView("Pet Maintenance")}>
          {`Pet Maintenance`}
        </Button>
        <Button onClick={() => setView("Pet Categories")}>
          {`Pet Categories`}
        </Button>
        <Button onClick={() => setView("Levels & Perks")}>
          {`Levels & Perks`}
        </Button>
        <Button onClick={() => setView("Shrines")}>{`Shrines`}</Button>
        <Button onClick={() => setView("Social")}>{`Social`}</Button>
        {isNFTPet && (
          <Button onClick={() => setView("NFT Traits")}>{`NFT Traits`}</Button>
        )}
      </div>
    </InnerPanel>
  );
};

export const PetGuideButton: React.FC<{ isNFTPet: boolean }> = ({
  isNFTPet,
}) => {
  const [showPetGuide, setShowPetGuide] = useState(false);
  const { t } = useAppTranslation();
  return (
    <>
      <div>
        <Button onClick={() => setShowPetGuide(true)}>
          <div className="flex justify-between items-center text-xs -m-1 space-x-1">
            <img src={SUNNYSIDE.icons.expression_confused} className="w-3" />
            <p>{t("guide")}</p>
          </div>
        </Button>
      </div>

      <Modal show={showPetGuide} onHide={() => setShowPetGuide(false)}>
        <CloseButtonPanel
          onClose={() => setShowPetGuide(false)}
          container={OuterPanel}
        >
          <PetGuide isNFTPet={isNFTPet} />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
