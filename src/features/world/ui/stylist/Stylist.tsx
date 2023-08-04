import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useState } from "react";

interface Props {
  onClose: () => void;
}
export const Stylist: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES.stella}
      // Comment this back in when Stella is ready to sell wearables
      // tabs={[
      //   { icon: SUNNYSIDE.icons.wardrobe, name: "Wearables" },
      //   { icon: SUNNYSIDE.icons.timer, name: "Limited" },
      //   { icon: SUNNYSIDE.icons.heart, name: "Merch" },
      // ]}
      onClose={onClose}
      currentTab={tab}
      setCurrentTab={setTab}
    >
      {/*Delete this back in when Stella is ready to sell wearables*/}
      <div className="p-2 pb-3">
        {`Sorry, I'm temporarily closed for business! Please come back later!`}
      </div>
      {/*Comment this back in when Stella is ready to sell wearables*/}
      {/* {tab === 0 && <StylistWearables wearables={BASIC_WEARABLES} />}
      {tab === 1 && (
        <StylistWearables wearables={LIMITED_WEARABLES(TEST_FARM)} />
      )}
      {tab === 2 && <Merch />} */}
    </CloseButtonPanel>
  );
};
