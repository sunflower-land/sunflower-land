import {
  ALLOWED_BUMPKIN_BODIES,
  BumpkinBody,
  BumpkinHair,
  BumpkinPant,
  BumpkinShirt,
  BumpkinShoe,
} from "features/game/types/bumpkin";
import React, { useState } from "react";
import { DynamicNFT } from "./DynamicNFT";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getWearableImage } from "features/game/lib/getWearableImage";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  DEFAULT_SIGNUP_EQUIPMENT,
  Gender,
} from "features/auth/lib/signupBumpkinDefaults";
import { BUMPKIN_PART_SILHOUETTE } from "features/game/types/bumpkinPartSilhouettes";
import { Label } from "components/ui/Label";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { getObjectEntries } from "features/game/expansion/lib/utils";

const MALE_HAIRSTYLES: BumpkinHair[] = [
  "Basic Hair",
  "Explorer Hair",
  "Buzz Cut",
];

const FEMALE_HAIRSTYLES: BumpkinHair[] = [
  "Rancher Hair",
  "Blondie",
  "Brown Long Hair",
];

interface OutfitPreset {
  shirt: BumpkinShirt;
  pants: BumpkinPant;
  shoes: BumpkinShoe;
}

const OUTFIT_PRESETS: OutfitPreset[] = [
  {
    shirt: "Red Farmer Shirt",
    pants: "Farmer Pants",
    shoes: "Black Farmer Boots",
  },
  {
    shirt: "Blue Farmer Shirt",
    pants: "Blue Suspenders",
    shoes: "Yellow Boots",
  },
  {
    shirt: "Yellow Farmer Shirt",
    pants: "Farmer Overalls",
    shoes: "Brown Boots",
  },
];

const FIXED_PARTS: Pick<BumpkinParts, "background" | "tool"> = {
  background: "Farm Background",
  tool: "Farmer Pitchfork",
};

interface Props {
  initialEquipment?: BumpkinParts;
  onSave: (equipment: BumpkinParts) => void;
}

export const SignupBumpkinEquip: React.FC<Props> = ({
  initialEquipment = DEFAULT_SIGNUP_EQUIPMENT,
  onSave,
}) => {
  const [equipped, setEquipped] = useState<BumpkinParts>({
    ...initialEquipment,
    ...FIXED_PARTS,
  });
  const [hairGender, setHairGender] = useState<Gender>("male");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const { t } = useAppTranslation();

  const selectBody = (body: BumpkinBody) => {
    setEquipped((prev) => ({ ...prev, body }));
  };

  const selectHair = (hair: BumpkinHair) => {
    setEquipped((prev) => ({ ...prev, hair }));
  };

  const selectOutfitPreset = (preset: OutfitPreset) => {
    setEquipped((prev) => ({
      ...prev,
      shirt: preset.shirt,
      pants: preset.pants,
      shoes: preset.shoes,
    }));
  };

  const switchHairGender = (gender: Gender) => {
    if (gender === hairGender) return;
    setHairGender(gender);

    const currentList = gender === "male" ? MALE_HAIRSTYLES : FEMALE_HAIRSTYLES;
    if (!equipped.hair || !currentList.includes(equipped.hair)) {
      selectHair(currentList[0]);
    }
  };

  const finish = () => {
    setShowConfirmationModal(false);
    onSave(equipped);
  };
  const GENDERS: Record<Gender, { hair: BumpkinHair[]; icon: string }> = {
    male: { hair: MALE_HAIRSTYLES, icon: "♂" },
    female: { hair: FEMALE_HAIRSTYLES, icon: "♀" },
  };

  const selectedPresetIndex = OUTFIT_PRESETS.findIndex(
    (p) =>
      p.shirt === equipped.shirt &&
      p.pants === equipped.pants &&
      p.shoes === equipped.shoes,
  );

  return (
    <div className="p-2">
      <div className="flex gap-2 justify-between mb-1">
        <div>
          <Label type="default">{t("signup.createBumpkin")}</Label>
        </div>
        <div className="flex gap-1">
          {getObjectEntries(GENDERS).map(([gender, { icon }]) => {
            const isSelected = hairGender === gender;
            const Container = isSelected ? InnerPanel : OuterPanel;
            return (
              <Container
                key={gender}
                className="cursor-pointer !p-1 flex items-center justify-center hover:img-highlight"
                onClick={() => switchHairGender(gender)}
              >
                <span className="text-xs leading-none">{icon}</span>
              </Container>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Left column: preview + save */}
        <div className="w-full sm:w-2/5 flex flex-col justify-between">
          <div className="w-full relative rounded-xl overflow-hidden mb-1">
            <DynamicNFT
              showBackground
              bumpkinParts={equipped}
              key={JSON.stringify(equipped)}
            />
            <div className="absolute w-8 h-8 bottom-6 right-6">
              <NPCIcon
                parts={equipped}
                width={PIXEL_SCALE * 18}
                key={JSON.stringify(equipped)}
              />
            </div>
          </div>
        </div>

        {/* Right column: Body / Hair / Outfit */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Body */}
          <div className="flex">
            <div className="!p-0 flex items-center justify-center w-1/4">
              <img src={SUNNYSIDE.icons.player} className="h-10" />
            </div>
            <div className="flex">
              {ALLOWED_BUMPKIN_BODIES.map((body) => (
                <Box
                  key={body}
                  image={getWearableImage(body)}
                  isSelected={equipped.body === body}
                  onClick={() => selectBody(body)}
                  hideCount
                />
              ))}
            </div>
          </div>

          {/* Hair */}
          <div className="flex">
            <div className="!p-0 flex flex-col items-center justify-center w-1/4">
              <img src={BUMPKIN_PART_SILHOUETTE.hair} className="h-10" />
            </div>
            <div className="flex">
              {GENDERS[hairGender].hair.map((hair) => (
                <Box
                  key={hair}
                  image={getWearableImage(hair)}
                  isSelected={equipped.hair === hair}
                  onClick={() => selectHair(hair)}
                  hideCount
                />
              ))}
            </div>
          </div>

          {/* Outfit */}
          <div className="flex">
            <div className="!p-0 flex items-center justify-center w-1/4">
              <img src={BUMPKIN_PART_SILHOUETTE.suit} className="h-10" />
            </div>
            <div className="flex">
              {OUTFIT_PRESETS.map((preset, index) => (
                <Box
                  key={index}
                  image={getWearableImage(preset.shirt)}
                  isSelected={selectedPresetIndex === index}
                  onClick={() => selectOutfitPreset(preset)}
                  hideCount
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button onClick={() => setShowConfirmationModal(true)} className="mt-2">
        {t("save")}
      </Button>

      <ConfirmationModal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        onConfirm={finish}
        confirmButtonLabel={t("noaccount.createFarm")}
        messages={[
          t("signup.createBumpkinConfirmation"),
          t("signup.createBumpkinConfirmation.two"),
        ]}
        onCancel={() => setShowConfirmationModal(false)}
      />
    </div>
  );
};
