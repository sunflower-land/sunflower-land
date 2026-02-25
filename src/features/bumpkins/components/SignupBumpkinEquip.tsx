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
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getWearableImage } from "features/game/lib/getWearableImage";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import {
  DEFAULT_SIGNUP_EQUIPMENT,
  Gender,
} from "features/auth/lib/signupBumpkinDefaults";
import { BUMPKIN_PART_SILHOUETTE } from "features/game/types/bumpkinPartSilhouettes";

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

function SelectionCorners() {
  return (
    <div className="block">
      <img
        className="absolute pointer-events-none"
        src={SUNNYSIDE.ui.selectBoxTL}
        style={{
          top: `${PIXEL_SCALE * -3}px`,
          left: `${PIXEL_SCALE * -3}px`,
          width: `${PIXEL_SCALE * 8}px`,
        }}
      />
      <img
        className="absolute pointer-events-none"
        src={SUNNYSIDE.ui.selectBoxTR}
        style={{
          top: `${PIXEL_SCALE * -3}px`,
          right: `${PIXEL_SCALE * -3}px`,
          width: `${PIXEL_SCALE * 8}px`,
        }}
      />
      <img
        className="absolute pointer-events-none"
        src={SUNNYSIDE.ui.selectBoxBL}
        style={{
          bottom: `${PIXEL_SCALE * -3}px`,
          left: `${PIXEL_SCALE * -3}px`,
          width: `${PIXEL_SCALE * 8}px`,
        }}
      />
      <img
        className="absolute pointer-events-none"
        src={SUNNYSIDE.ui.selectBoxBR}
        style={{
          bottom: `${PIXEL_SCALE * -3}px`,
          right: `${PIXEL_SCALE * -3}px`,
          width: `${PIXEL_SCALE * 8}px`,
        }}
      />
    </div>
  );
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
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Left column: preview + save */}
        <div className="w-full sm:w-2/5 flex flex-col justify-center">
          <div className="w-full relative rounded-xl overflow-hidden mb-1">
            <DynamicNFT
              showBackground
              bumpkinParts={equipped}
              key={JSON.stringify(equipped)}
            />
            <div className="absolute w-8 h-8 bottom-10 right-10">
              <NPCIcon
                parts={equipped}
                width={PIXEL_SCALE * 20}
                key={JSON.stringify(equipped)}
              />
            </div>
          </div>
        </div>

        {/* Right column: Body / Hair / Outfit */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Body */}
          <div className="grid grid-cols-4 gap-2">
            <div className="w-full relative aspect-square !p-0 flex items-center justify-center">
              <img src={SUNNYSIDE.icons.player} className="h-2/3" />
            </div>
            {ALLOWED_BUMPKIN_BODIES.map((body) => (
              <OuterPanel
                key={body}
                className={classNames(
                  "w-full cursor-pointer relative aspect-square !p-0 flex items-center justify-center hover:img-highlight",
                  { "img-highlight": equipped.body === body },
                )}
                onClick={() => selectBody(body)}
              >
                <img
                  src={getWearableImage(body)}
                  className="h-2/3"
                  style={{ imageRendering: "pixelated" }}
                />
                {equipped.body === body && <SelectionCorners />}
              </OuterPanel>
            ))}
          </div>

          {/* Hair */}
          <div>
            <div className="grid grid-cols-4 gap-2">
              <div className="w-full relative aspect-square !p-0 flex flex-col items-center justify-center">
                <img src={BUMPKIN_PART_SILHOUETTE.hair} className="h-2/3" />
                <div className="flex gap-1 justify-items-end">
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
              {GENDERS[hairGender].hair.map((hair) => (
                <OuterPanel
                  key={hair}
                  className={classNames(
                    "w-full cursor-pointer relative aspect-square !p-0 flex items-center justify-center hover:img-highlight",
                    { "img-highlight": equipped.hair === hair },
                  )}
                  onClick={() => selectHair(hair)}
                >
                  <img
                    src={getWearableImage(hair)}
                    className="h-2/3"
                    style={{ imageRendering: "pixelated" }}
                  />
                  {equipped.hair === hair && <SelectionCorners />}
                </OuterPanel>
              ))}
            </div>
          </div>

          {/* Outfit */}
          <div className="grid grid-cols-4 gap-2">
            <div className="w-full relative aspect-square !p-0 flex items-center justify-center">
              <img src={BUMPKIN_PART_SILHOUETTE.suit} className="h-2/3" />
            </div>
            {OUTFIT_PRESETS.map((preset, index) => (
              <OuterPanel
                key={index}
                className={classNames(
                  "w-full cursor-pointer relative aspect-square !p-0 flex items-center justify-center hover:img-highlight",
                  { "img-highlight": selectedPresetIndex === index },
                )}
                onClick={() => selectOutfitPreset(preset)}
              >
                <img
                  src={getWearableImage(preset.shirt)}
                  className="h-2/3"
                  style={{ imageRendering: "pixelated" }}
                />
                {selectedPresetIndex === index && <SelectionCorners />}
              </OuterPanel>
            ))}
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
