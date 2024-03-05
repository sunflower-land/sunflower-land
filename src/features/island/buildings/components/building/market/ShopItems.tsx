import React, { useState } from "react";
import { Seeds } from "./Seeds";
import { Crops } from "./Crops";
import { Equipped } from "features/game/types/bumpkin";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ConversationName } from "features/game/types/announcements";
import { NPC_WEARABLES } from "lib/npcs";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { Panel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `betty-read.${host}-${window.location.pathname}`;
const INTRO_LOCAL_STORAGE_KEY = `betty-intro-read.${host}-${window.location.pathname}`;

function acknowledgeIntroRead() {
  localStorage.setItem(INTRO_LOCAL_STORAGE_KEY, new Date().toString());
}

function hasReadIntro() {
  return !!localStorage.getItem(INTRO_LOCAL_STORAGE_KEY);
}

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
  showBuyHelper?: boolean;
  cropShortage?: boolean;
}

export const ShopItems: React.FC<Props> = ({
  onClose,
  hasSoldBefore,
  showBuyHelper,
  cropShortage,
}) => {
  const [tab, setTab] = useState(0);
  const [showShortageEnd, setShowShortageEnd] = React.useState(
    !hasRead() && !cropShortage
  );
  const [showIntro, setShowIntro] = React.useState(!hasReadIntro());
  const { t } = useAppTranslation();

  const bumpkinParts: Partial<Equipped> = NPC_WEARABLES.betty;

  if (showIntro) {
    return (
      <Panel bumpkinParts={NPC_WEARABLES.betty}>
        <SpeakingText
          message={[
            {
              text: t("betty.welcome"),
              actions: [
                {
                  text: t("betty.buySeeds"),
                  cb: () => {
                    setTab(0);
                    acknowledgeIntroRead();
                    setShowIntro(false);
                  },
                },
                {
                  text: t("betty.sellCrops"),
                  cb: () => {
                    setTab(1);
                    acknowledgeIntroRead();
                    setShowIntro(false);
                  },
                },
              ],
            },
          ]}
          onClose={() => {
            acknowledgeRead();
            setShowShortageEnd(false);
          }}
        />
      </Panel>
    );
  }

  if (showShortageEnd) {
    return (
      <Panel bumpkinParts={NPC_WEARABLES.betty}>
        <SpeakingText
          message={[
            {
              text: t("betty.post.sale.one"),
            },
            {
              text: t("betty.post.sale.two"),
            },
            {
              text: t("betty.post.sale.three"),
            },
          ]}
          onClose={() => {
            acknowledgeRead();
            setShowShortageEnd(false);
          }}
        />
      </Panel>
    );
  }

  return (
    <CloseButtonPanel
      bumpkinParts={bumpkinParts}
      tabs={[
        {
          icon: SUNNYSIDE.icons.seeds,
          name: t("buy"),
          unread: showBuyHelper,
        },
        {
          icon: CROP_LIFECYCLE.Sunflower.crop,
          name: t("sell"),
          unread: !hasSoldBefore,
        },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
      onClose={onClose}
    >
      {tab === 0 && <Seeds onClose={onClose} />}
      {tab === 1 && <Crops cropShortage={!!cropShortage} />}
    </CloseButtonPanel>
  );
};
