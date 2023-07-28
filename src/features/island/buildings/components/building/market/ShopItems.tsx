import React, { useState } from "react";
import { Seeds } from "./Seeds";
import { Crops } from "./Crops";
import { Equipped } from "features/game/types/bumpkin";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ConversationName } from "features/game/types/conversations";
import { NPC_WEARABLES } from "lib/npcs";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { Panel } from "components/ui/Panel";

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `betty-read.${host}-${window.location.pathname}`;

function acknowledgeRead() {
  localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toString());
}

function hasRead() {
  return !!localStorage.getItem(LOCAL_STORAGE_KEY);
}

interface Props {
  onClose: () => void;
  conversation?: ConversationName;
  hasSoldBefore?: boolean;
}

export const ShopItems: React.FC<Props> = ({ onClose, hasSoldBefore }) => {
  const [tab, setTab] = useState(0);
  const [showIntro, setShowIntro] = React.useState(!hasRead());

  const bumpkinParts: Partial<Equipped> = NPC_WEARABLES.betty;

  if (showIntro) {
    return (
      <Panel bumpkinParts={NPC_WEARABLES.betty}>
        <SpeakingText
          message={[
            {
              text: "Hey, hey! Welcome to my market.",
            },
            {
              text: "Bring me your finest harvest, and I will give you a fair price for them!",
            },
            {
              text: "You need seeds? From potatoes to parsnips, I've got you covered!",
            },
          ]}
          onClose={() => {
            acknowledgeRead();
            setShowIntro(false);
          }}
        />
      </Panel>
    );
  }
  return (
    <CloseButtonPanel
      bumpkinParts={bumpkinParts}
      tabs={[
        { icon: SUNNYSIDE.icons.seeds, name: "Buy" },
        {
          icon: CROP_LIFECYCLE.Sunflower.crop,
          name: "Sell",
          unread: !hasSoldBefore,
        },
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
