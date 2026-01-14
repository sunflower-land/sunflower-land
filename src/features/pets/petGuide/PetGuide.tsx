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
import { getObjectEntries } from "features/game/expansion/lib/utils";

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

export const PetGuide: React.FC = () => {
  const [view, setView] = useState<PetGuideView>();

  const setToDefault = () => setView(undefined);

  const GUIDE_CONTENT: Record<
    PetGuideView,
    { translatedTitle: string; content: React.FC<{ onBack: () => void }> }
  > = {
    "Pet Egg": { translatedTitle: "Pet Egg", content: PetEgg },
    Feed: { translatedTitle: "Feed", content: Feed },
    Fetch: { translatedTitle: "Fetch", content: Fetch },
    "Pet Maintenance": {
      translatedTitle: "Pet Maintenance",
      content: PetMaintenance,
    },
    "Pet Categories": {
      translatedTitle: "Pet Categories",
      content: PetCategories,
    },
    "Levels & Perks": {
      translatedTitle: "Levels & Perks",
      content: PetLevelsAndPerks,
    },
    Shrines: { translatedTitle: "Shrines", content: Shrines },
    "NFT Traits": { translatedTitle: "NFT Traits", content: NFTTraits },
    Social: { translatedTitle: "Social", content: Social },
  };

  if (view) {
    const ContentComponent = GUIDE_CONTENT[view].content;
    return <ContentComponent onBack={setToDefault} />;
  }

  return (
    <InnerPanel>
      <Label type="default">{`Pet Guide`}</Label>
      <p className="text-xs p-1">{`Learn about pets and how to care for them.`}</p>
      <div id="Buttons" className="grid grid-cols-2 gap-1">
        {getObjectEntries(GUIDE_CONTENT).map(([key, value]) => {
          return (
            <Button key={key} onClick={() => setView(key)}>
              {value.translatedTitle}
            </Button>
          );
        })}
      </div>
    </InnerPanel>
  );
};

export const PetGuideButton: React.FC = () => {
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
          <PetGuide />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
