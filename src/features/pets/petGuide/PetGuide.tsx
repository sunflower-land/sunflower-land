import { Button } from "components/ui/Button";
import { InnerPanel } from "components/ui/Panel";
import React, { useState } from "react";
import { PetEgg } from "./PetEgg";
import { Label } from "components/ui/Label";
import { Feed } from "./Feed";
import { Fetch } from "./Fetch";
import { PetMaintenance } from "./PetMaintenance";
import { PetLevelsAndPerks } from "./PetLevelsAndPerks";
import { Shrines } from "./Shrines";
import { NFTTraits } from "./NFTTraits";
import { Social } from "./Social";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";
import foodIcon from "assets/food/chicken_drumstick.png";
import petNFTEgg from "assets/icons/pet_nft_egg.png";

type PetGuideView =
  | "Pet Egg"
  | "Feed"
  | "Fetch"
  | "Care"
  | "Level Perks"
  | "Shrines"
  | "NFT Traits"
  | "Social";

const GUIDE_CONTENT: Record<
  PetGuideView,
  {
    translatedTitle: string;
    content: React.FC<{ onBack: () => void }>;
    image?: string;
  }
> = {
  "Pet Egg": {
    translatedTitle: "Pet Egg",
    content: PetEgg,
    image: ITEM_DETAILS["Pet Egg"].image,
  },
  Feed: { translatedTitle: "Feed", content: Feed, image: foodIcon },
  Fetch: {
    translatedTitle: "Fetch",
    content: Fetch,
    image: ITEM_DETAILS.Acorn.image,
  },
  Care: {
    translatedTitle: "Care",
    content: PetMaintenance,
    image: ITEM_DETAILS.Brush.image,
  },
  "Level Perks": {
    translatedTitle: "Level Perks",
    content: PetLevelsAndPerks,
    image: SUNNYSIDE.icons.xpIcon,
  },
  Shrines: {
    translatedTitle: "Shrines",
    content: Shrines,
    image: ITEM_DETAILS["Obsidian Shrine"].image,
  },
  Social: {
    translatedTitle: "Social",
    content: Social,
    image: ITEM_DETAILS.Cheer.image,
  },
  "NFT Traits": {
    translatedTitle: "NFT Traits",
    content: NFTTraits,
    image: petNFTEgg,
  },
};
export const PetGuide: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [view, setView] = useState<PetGuideView>();

  const setToDefault = () => setView(undefined);

  if (view) {
    const ContentComponent = GUIDE_CONTENT[view].content;
    return <ContentComponent onBack={setToDefault} />;
  }

  return <PetGuideMenu onClose={onClose} setView={setView} />;
};

const PetGuideMenu: React.FC<{
  onClose?: () => void;
  setView: React.Dispatch<React.SetStateAction<PetGuideView | undefined>>;
}> = ({ onClose, setView }) => {
  const items = getObjectEntries(GUIDE_CONTENT);

  return (
    <InnerPanel className="relative overflow-y-auto max-h-[350px] scrollable">
      <div className="flex items-center gap-2">
        {onClose && (
          <img
            src={SUNNYSIDE.icons.arrow_left}
            style={{
              width: `${PIXEL_SCALE * 11}px`,
              cursor: "pointer",
            }}
            onClick={onClose}
          />
        )}
        <Label type="default">{`Pet Guide`}</Label>
      </div>

      <p className="text-xs p-1">{`Learn about pets and how to care for them.`}</p>
      <div id="Buttons" className="grid grid-cols-2 gap-1">
        {items.map(([key, value], idx) => {
          // If this is the last item and the number of items is odd, span two columns
          const isLast = idx === items.length - 1;
          const isOdd = items.length % 2 !== 0;

          return (
            <Button
              key={key}
              onClick={() => setView(key)}
              className={isOdd && isLast ? "col-span-2" : ""}
            >
              <div className="flex items-center gap-2">
                {value.image && <img src={value.image} className="h-4" />}
                {value.translatedTitle}
              </div>
            </Button>
          );
        })}
      </div>
    </InnerPanel>
  );
};

export const PetGuideButton: React.FC<{ onShow: () => void }> = ({
  onShow,
}) => {
  const { t } = useAppTranslation();
  return (
    <div>
      <Button onClick={onShow}>
        <div className="flex justify-between items-center text-xs -m-1 space-x-1">
          <img src={SUNNYSIDE.icons.expression_confused} className="w-3" />
          <p>{t("guide")}</p>
        </div>
      </Button>
    </div>
  );
};
