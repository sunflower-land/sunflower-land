/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";
import giftIcon from "assets/icons/gift.png";

import { ITEM_DETAILS } from "features/game/types/images";
import { OuterPanel } from "components/ui/Panel";
import { StreamReward } from "features/world/ui/player/StreamReward";
import { PlayerGift } from "features/world/ui/player/PlayerGift";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Equipped } from "features/game/types/bumpkin";
import {
  rewardModalManager,
  RewardModalPlayer,
} from "./lib/rewardModalManager";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

type Tab = "Reward" | "Stream";

export const RewardModal: React.FC = () => {
  const { t } = useAppTranslation();
  const [tab, setTab] = useState<Tab>("Reward");
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardGiver, setRewardGiver] = useState<
    RewardModalPlayer | undefined
  >();

  const setInitialTab = useCallback((equipped?: BumpkinParts) => {
    if (equipped?.hat === "Streamer Hat") {
      setTab("Stream");
    } else if (equipped?.shirt === "Gift Giver") {
      setTab("Reward");
    } else {
      setShowRewardModal(false);
    }
  }, []);

  useEffect(() => {
    rewardModalManager.listen((npc) => {
      setRewardGiver(npc);
      setShowRewardModal(true);
      rewardModalManager.setIsOpen(true);
      // Automatically set to Stream tab if player has Streamer Hat and is not current player
      setInitialTab(npc.clothing as Equipped);
    });
  }, [setInitialTab]);

  const closeModal = () => {
    setShowRewardModal(false);
    setRewardGiver(undefined);
    rewardModalManager.setIsOpen(false);
  };

  const hasGiftGiver = rewardGiver?.clothing?.shirt === "Gift Giver";
  const hasStreamerHat = rewardGiver?.clothing?.hat === "Streamer Hat";

  return (
    <>
      <Modal show={showRewardModal} onHide={closeModal} size="lg">
        <CloseButtonPanel
          onClose={closeModal}
          bumpkinParts={rewardGiver?.clothing}
          currentTab={tab}
          setCurrentTab={setTab}
          tabs={[
            ...(hasGiftGiver
              ? [
                  {
                    icon: giftIcon,
                    name: t("reward"),
                    id: "Reward",
                  },
                ]
              : []),
            ...(hasStreamerHat
              ? [
                  {
                    icon: ITEM_DETAILS["Love Charm"].image,
                    name: t("stream"),
                    id: "Stream",
                  },
                ]
              : []),
          ]}
          container={OuterPanel}
        >
          <div className="max-h-[500px]">
            {tab === "Reward" && <PlayerGift />}
            {tab === "Stream" && (
              <StreamReward streamerId={rewardGiver?.farmId as number} />
            )}
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
