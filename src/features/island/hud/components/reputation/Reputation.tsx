import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { ButtonPanel } from "components/ui/Panel";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import React, { useContext, useState } from "react";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  getReputation,
  getReputationPoints,
  Reputation,
  REPUTATION_NAME,
  REPUTATION_POINTS,
  REPUTATION_TASKS,
  REPUTATION_TIERS,
} from "features/game/lib/reputation";
import { useGame } from "features/game/GameProvider";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { ITEM_DETAILS } from "features/game/types/images";

import lockIcon from "assets/icons/lock.png";
import infoIcon from "assets/icons/info.webp";
import tradeIcon from "assets/icons/trade.png";
import increaseArrow from "assets/icons/increase_arrow.png";
import sflIcon from "assets/icons/flower_token.webp";
import walletIcon from "assets/icons/wallet.png";
import hammerinHarry from "assets/npcs/hammerin_harry.webp";
import salesIcon from "assets/icons/sale.webp";
import { UPGRADE_RAFTS } from "features/game/expansion/components/IslandUpgrader";
import settings from "assets/icons/settings_disc.png";
import bank from "assets/icons/withdraw.png";
import bud from "assets/icons/bud.png";
import { AnimatedPanel } from "features/world/ui/AnimatedPanel";

export const MyReputation: React.FC = () => {
  const { openModal } = useContext(ModalContext);
  const { t } = useAppTranslation();
  const { gameState } = useGame();

  return (
    <ButtonPanel onClick={() => openModal("REPUTATION")}>
      <div className="flex flex-col">
        <Label type="vibrant" icon={SUNNYSIDE.icons.heart}>
          {`${t("reputation.title")} - ${REPUTATION_NAME[getReputation({ game: gameState.context.state })]}`}
        </Label>
        <p className="text-xs">{t("reputation.description")}</p>
      </div>
    </ButtonPanel>
  );
};

export const RequiredReputation: React.FC<{
  reputation: Reputation;
  text?: string;
}> = ({ reputation, text }) => {
  const { openModal } = useContext(ModalContext);
  const { t } = useAppTranslation();

  return (
    <ButtonPanel onClick={() => openModal("REPUTATION")}>
      <div className="flex flex-col">
        <Label type="danger" icon={lockIcon}>
          {t("reputation.notAReputation", {
            name: REPUTATION_NAME[reputation],
          })}
        </Label>
        <p className="text-xs">{text ?? t("reputation.description")}</p>
      </div>
    </ButtonPanel>
  );
};

export const ReputationSystem: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const { t } = useAppTranslation();

  return (
    <CloseButtonPanel
      onClose={onClose}
      currentTab={tab}
      setCurrentTab={setTab}
      tabs={[
        {
          icon: SUNNYSIDE.icons.heart,
          name: t("reputation.tiers"),
        },
        {
          icon: salesIcon,
          name: t("reputation.earnPoints"),
        },
        {
          icon: SUNNYSIDE.icons.expression_confused,
          name: t("guide"),
        },
      ]}
    >
      {tab === 0 && <ReputationTiers />}
      {tab === 1 && <ReputationPoints />}
      {tab === 2 && <ReputationGuide onClose={() => setTab(1)} />}
    </CloseButtonPanel>
  );
};

export const ReputationTiers: React.FC = () => {
  const { t } = useAppTranslation();
  const [showInfo, setShowInfo] = useState<"seedling" | "grower" | null>(null);

  return (
    <>
      <div className="p-2 scrollable overflow-y-scroll max-h-[350px]">
        <p className="text-xs mb-2">{t("reputation.description")}</p>

        <div className="flex items-center mb-1 mt-2">
          <Label
            type="default"
            icon={SUNNYSIDE.crops.seedling}
            className="mr-2"
          >
            {t("reputation.seedling")}
          </Label>
          <Label type="warning">
            {t("reputation.points", {
              amount: REPUTATION_TIERS[Reputation.Seedling],
            })}
          </Label>
        </div>
        <NoticeboardItems
          items={[
            {
              text: t("reputation.seedling.trades"),
              icon: tradeIcon,
            },

            {
              text: (
                <span
                  onClick={() => {
                    if (showInfo === "seedling") {
                      setShowInfo(null);
                    } else {
                      setShowInfo("seedling");
                    }
                  }}
                  className="flex items-center cursor-pointer"
                >
                  {t("reputation.seedling.nft")}
                  <div className="relative">
                    <img src={infoIcon} className="w-5 ml-2" />
                    <AnimatedPanel
                      show={showInfo === "seedling"}
                      className="top-0 left-8 w-20"
                      onClick={() => setShowInfo(null)}
                    >
                      <div className="text-xxs p-0.5">
                        {t("proof.of.humanity.required")}
                      </div>
                    </AnimatedPanel>
                  </div>
                </span>
              ),
              icon: ITEM_DETAILS["Grinx's Hammer"].image,
            },
            {
              text: t("reputation.seedling.farmNFT"),
              icon: SUNNYSIDE.icons.basket,
            },
          ]}
        />

        <div className="flex items-center mb-1 mt-2">
          <Label type="default" icon={SUNNYSIDE.crops.grower} className="mr-2">
            {t("reputation.grower")}
          </Label>
          <Label type="warning">
            {t("reputation.points", {
              amount: REPUTATION_TIERS[Reputation.Grower],
            })}
          </Label>
        </div>
        <NoticeboardItems
          items={[
            {
              text: t("reputation.grower.trades"),
              icon: tradeIcon,
            },
            {
              text: (
                <span
                  onClick={() => {
                    if (showInfo === "grower") {
                      setShowInfo(null);
                    } else {
                      setShowInfo("grower");
                    }
                  }}
                  className="flex items-center cursor-pointer"
                >
                  {t("reputation.grower.description")}
                  <div className="relative">
                    <img src={infoIcon} className="w-5 ml-2" />
                    <AnimatedPanel
                      show={showInfo === "grower"}
                      className="top-0 left-8 w-20"
                      onClick={() => setShowInfo(null)}
                    >
                      <div className="text-xxs p-0.5">
                        {t("proof.of.humanity.required")}
                      </div>
                    </AnimatedPanel>
                  </div>
                </span>
              ),
              icon: walletIcon,
            },

            {
              text: t("reputation.grower.auctions"),
              icon: hammerinHarry,
            },
          ]}
        />
        <div className="flex items-center mb-1 mt-2">
          <Label
            type="default"
            icon={ITEM_DETAILS["Sunflower"].image}
            className="mr-2"
          >
            {t("reputation.cropkeeper")}
          </Label>
          <Label type="warning">
            {t("reputation.points", {
              amount: REPUTATION_TIERS[Reputation.Cropkeeper],
            })}
          </Label>
        </div>
        <NoticeboardItems
          items={[
            {
              text: t("reputation.cropkeeper.offers"),
              icon: increaseArrow,
            },
            {
              text: t("reputation.cropkeeper.trades"),
              icon: tradeIcon,
            },
            {
              text: t("reputation.cropkeeper.description"),
              icon: sflIcon,
            },

            {
              text: t("reputation.cropkeeper.resources"),
              icon: ITEM_DETAILS.Eggplant.image,
            },
          ]}
        />

        <div className="flex items-center mb-1 mt-2">
          <Label
            type={"default"}
            icon={ITEM_DETAILS["Black Magic"].image}
            className="mr-2"
          >
            {t("reputation.grandHarvester")}
          </Label>
          <Label type="warning">
            {t("reputation.points", {
              amount: REPUTATION_TIERS[Reputation.GrandHarvester],
            })}
          </Label>
        </div>
      </div>
    </>
  );
};

export const ReputationPoints: React.FC = () => {
  const { openModal } = useContext(ModalContext);
  const { t } = useAppTranslation();
  const { gameState } = useGame();

  const points = getReputationPoints({ game: gameState.context.state });
  return (
    <>
      <div className="p-1">
        <div className="flex justify-between items-center mb-2">
          <Label type="default">
            {t("reputation.points.title", {
              name: REPUTATION_NAME[
                getReputation({ game: gameState.context.state })
              ],
            })}
          </Label>
          <Label className="mr-1" type="warning">
            {t("reputation.points.amount", { points })}
          </Label>
        </div>
        <p className="text-xs mb-2">{t("reputation.points.description")}</p>

        <NoticeboardItems
          items={[
            {
              text: t("reputation.unlock.spring", {
                points: REPUTATION_POINTS.SpringIsland,
              }),
              icon: REPUTATION_TASKS.SpringIsland({
                game: gameState.context.state,
              })
                ? SUNNYSIDE.icons.confirm
                : SUNNYSIDE.icons.cancel,
            },
            {
              text: t("reputation.unlock.level15", {
                points: REPUTATION_POINTS.Level15,
              }),
              icon: REPUTATION_TASKS.Level15({
                game: gameState.context.state,
              })
                ? SUNNYSIDE.icons.confirm
                : SUNNYSIDE.icons.cancel,
            },
            {
              text: t("reputation.unlock.desert", {
                points: REPUTATION_POINTS.DesertIsland,
              }),
              icon: REPUTATION_TASKS.DesertIsland({
                game: gameState.context.state,
              })
                ? SUNNYSIDE.icons.confirm
                : SUNNYSIDE.icons.cancel,
            },
            {
              text: t("reputation.unlock.volcano", {
                points: REPUTATION_POINTS.VolcanoIsland,
              }),
              icon: REPUTATION_TASKS.VolcanoIsland({
                game: gameState.context.state,
              })
                ? SUNNYSIDE.icons.confirm
                : SUNNYSIDE.icons.cancel,
            },
            {
              text: t("reputation.unlock.discord", {
                points: REPUTATION_POINTS.Discord,
              }),
              icon: REPUTATION_TASKS.Discord({
                game: gameState.context.state,
              })
                ? SUNNYSIDE.icons.confirm
                : SUNNYSIDE.icons.cancel,
            },
            {
              text: t("reputation.unlock.humanity", {
                points: REPUTATION_POINTS.ProofOfHumanity,
              }),
              icon: REPUTATION_TASKS.ProofOfHumanity({
                game: gameState.context.state,
              })
                ? SUNNYSIDE.icons.confirm
                : SUNNYSIDE.icons.cancel,
            },
            {
              text: t("reputation.unlock.level", {
                points: REPUTATION_POINTS.Level100,
              }),
              icon: REPUTATION_TASKS.Level100({
                game: gameState.context.state,
              })
                ? SUNNYSIDE.icons.confirm
                : SUNNYSIDE.icons.cancel,
            },
            {
              text: t("reputation.unlock.bud", {
                points: REPUTATION_POINTS.Bud,
              }),
              icon: REPUTATION_TASKS.Bud({
                game: gameState.context.state,
              })
                ? SUNNYSIDE.icons.confirm
                : SUNNYSIDE.icons.cancel,
            },
            {
              text: t("reputation.unlock.vip", {
                points: REPUTATION_POINTS.VIP,
              }),
              icon: REPUTATION_TASKS.VIP({
                game: gameState.context.state,
              })
                ? SUNNYSIDE.icons.confirm
                : SUNNYSIDE.icons.cancel,
            },
          ]}
        />
      </div>
      {!hasVipAccess({ game: gameState.context.state }) && (
        <Button onClick={() => openModal("VIP_ITEMS")}>
          {t("reputation.vip.purchase")}
        </Button>
      )}
    </>
  );
};

interface Props {
  onClose: () => void;
}
interface GuideItem {
  icon: string;
  content: string;
}

const ReputationGuideItem: React.FC<{ icon: string; content: string }> = ({
  icon,
  content,
}) => {
  return (
    <div className="flex items-start space-x-2">
      <div className="flex-shrink-0 w-9 h-9 pt-0.5">
        <img
          src={icon}
          className="w-full h-full object-contain object-center"
        />
      </div>
      <p className="text-xs">{content}</p>
    </div>
  );
};

export const ReputationGuide: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const { gameState } = useGame();

  const island = gameState.context.state.island.type ?? "basic";
  const upgradeRaft = UPGRADE_RAFTS[island];

  const reputationGuide: GuideItem[] = [
    {
      content: t("reputation.guide.upgrade"),
      icon: upgradeRaft ?? SUNNYSIDE.icons.upgrade_disc,
    },
    {
      content: t("reputation.guide.levelUp"),
      icon: SUNNYSIDE.icons.player,
    },
    {
      content: t("reputation.guide.connectDiscord"),
      icon: settings,
    },
    {
      content: t("reputation.guide.proofOfHumanity"),
      icon: bank,
    },
    {
      content: t("reputation.guide.ownBud"),
      icon: bud,
    },
  ];

  return (
    <div className="flex flex-wrap pt-1.5 pr-0.5">
      <div className="flex flex-col gap-y-3 p-2">
        {reputationGuide.map((item, i) => (
          <ReputationGuideItem
            key={i}
            icon={item.icon}
            content={item.content}
          />
        ))}
        <Button onClick={onClose} className="mt-2">
          {t("gotIt")}
        </Button>
      </div>
    </div>
  );
};
