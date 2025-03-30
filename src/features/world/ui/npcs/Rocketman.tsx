import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useContext, useState } from "react";
import { NoticeboardItems } from "../kingdom/KingdomNoticeboard";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import flowerIcon from "assets/icons/flower_token.webp";
import trophyIcon from "assets/icons/trophy.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasFeatureAccess } from "lib/flags";
import { GameState } from "features/game/types/game";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";

interface Props {
  onClose: () => void;
}

const _hasFlowerExchange = (game: GameState) =>
  hasFeatureAccess(game, "LOVE_CHARM_FLOWER_EXCHANGE");

export const Rocketman: React.FC<Props> = ({ onClose }) => {
  const [showIntro, setShowIntro] = useState(true);
  const { t } = useAppTranslation();
  const [currentTab, setCurrentTab] = useState<
    "Noticeboard" | "FLOWER Exchange"
  >("Noticeboard");
  const countdown = useCountdown(new Date("2025-04-01").getTime());
  const { gameService } = useContext(Context);
  const hasFlowerExchange = useSelector(gameService, _hasFlowerExchange);

  if (showIntro) {
    return (
      <SpeakingModal
        onClose={() => setShowIntro(false)}
        bumpkinParts={NPC_WEARABLES["rocket man"]}
        message={[
          {
            text: t("rocketman.intro"),
          },
        ]}
      />
    );
  }

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES["rocket man"]}
      onClose={onClose}
      tabs={[
        {
          icon: SUNNYSIDE.icons.stopwatch,
          name: "Noticeboard",
        },
        ...(hasFlowerExchange
          ? [
              {
                icon: flowerIcon,
                name: "FLOWER Exchange",
              },
            ]
          : []),
      ]}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
    >
      {currentTab === "Noticeboard" && (
        <div>
          <div className="p-1">
            <div className="flex justify-between items-center mr-8 mb-2">
              <Label type="vibrant">{t("rocketman.flower.coming")}</Label>
              <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                <TimerDisplay time={countdown} />
              </Label>
            </div>
            <NoticeboardItems
              items={[
                {
                  icon: SUNNYSIDE.icons.stopwatch,
                  text: t("rocketman.flower.launch"),
                },
                {
                  icon: trophyIcon,
                  text: t("rocketman.flower.compete"),
                },
                {
                  icon: SUNNYSIDE.icons.heart,
                  text: t("rocketman.flower.social"),
                },
                {
                  icon: flowerIcon,
                  text: t("rocketman.flower.eligible"),
                },
              ]}
            />
          </div>
          <div className="flex">
            <Button
              className="mr-1"
              onClick={() => {
                window.open(
                  "https://docs.sunflower-land.com/getting-started/usdflower-erc20/schedule",
                  "_blank",
                );
              }}
            >
              {t("read.more")}
            </Button>
            <Button onClick={onClose}>{t("close")}</Button>
          </div>
        </div>
      )}
      {currentTab === "FLOWER Exchange" && <FlowerExchange />}
    </CloseButtonPanel>
  );
};

const FlowerExchange: React.FC = () => {
  return (
    <div>
      <div></div>
    </div>
  );
};
