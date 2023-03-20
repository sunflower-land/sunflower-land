import React, { useState } from "react";
import { Seeds } from "./Seeds";
import { Crops } from "./Crops";
import { acknowledgeTutorial, hasShownTutorial } from "lib/tutorial";
import { Equipped } from "features/game/types/bumpkin";
import { Tutorial } from "./Tutorial";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

interface Props {
  onClose: () => void;
}

export const ShopItems: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const [showTutorial, setShowTutorial] = useState<boolean>(
    !hasShownTutorial("Market")
  );

  const acknowledge = () => {
    acknowledgeTutorial("Market");
    setShowTutorial(false);
  };

  const bumpkinParts: Partial<Equipped> = {
    body: "Beige Farmer Potion",
    hair: "Rancher Hair",
    pants: "Farmer Overalls",
    shirt: "Red Farmer Shirt",
    tool: "Parsnip",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
  };

  if (showTutorial) {
    return <Tutorial onClose={acknowledge} bumpkinParts={bumpkinParts} />;
  }

  return (
    <CloseButtonPanel
      bumpkinParts={bumpkinParts}
      tabs={[
        { icon: SUNNYSIDE.icons.seeds, name: "Buy" },
        { icon: CROP_LIFECYCLE.Sunflower.crop, name: "Sell" },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
      onClose={onClose}
    >
      {tab === 0 && <Seeds onClose={onClose} />}
      {tab === 1 && <Crops />}
    </CloseButtonPanel>
  );
};
