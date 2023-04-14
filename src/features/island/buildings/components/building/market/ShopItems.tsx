import React, { useState } from "react";
import { Seeds } from "./Seeds";
import { Crops } from "./Crops";
import { Equipped } from "features/game/types/bumpkin";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Conversation } from "features/farming/mail/components/Conversation";
import { ConversationName } from "features/game/types/conversations";
import { NPC_WEARABLES } from "lib/npcs";

interface Props {
  onClose: () => void;
  conversation?: ConversationName;
  hasSoldBefore?: boolean;
}

export const ShopItems: React.FC<Props> = ({
  onClose,
  conversation,
  hasSoldBefore,
}) => {
  const [tab, setTab] = useState(0);

  const bumpkinParts: Partial<Equipped> = NPC_WEARABLES.betty;

  if (conversation) {
    return <Conversation conversationId={conversation} />;
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
